// @ts-check

import chokidar from 'chokidar';
import Database from 'better-sqlite3';

import { SafeExit } from '../class/SafeExit.mjs';
import { Paths } from '../class/Paths.mjs';
import { TrySync } from '../function/TrySync.mjs';
import { ExportDatabaseToSqlMigration } from './ExportDatabaseToSqlMigration.mjs';
import { LazyFactory } from '../function/LazyFactory.mjs';
import { QChannel } from '../class/QChannel.mjs';
import { Timeout } from '../function/Timeout.mjs';

/**
 * @typedef {import("../typehints/VivthCleanup.mjs").VivthCleanup} VivthCleanup
 * @typedef {import("chokidar").FSWatcher} FSWatcher
 */

/**
 * @description
 * - helper to convert already working `sqlite3` db file into sql migration file;
 * - this class assume `Paths` and `SafeExit` already instantiated;
 * @implements { VivthCleanup }
 */
export class SQLite3AutoMigration {
	/**
	 * @description
	 * - cleanup method;
	 * - can be manually called to cleanup resources that are being used by this `instance`;
	 */
	vivthCleanup = async () => {
		this.#connection?.close();
		this.#watcher?.removeAllListeners();
		this.#watcher?.close();
	};
	/**
	 * @type {FSWatcher | undefined}
	 */
	#watcher;
	/**
	 * @type {string}
	 */
	#sqlite3Path;
	/**
	 * @type {Database.Database | null}
	 */
	#connection = null;
	#reConnect = () => {
		if (this.#connection && typeof this.#connection.close === 'function') {
			const [, err] = TrySync(() => {
				this.#connection?.close();
			});
			if (err) {
				console.error('Error closing existing SQLite connection:', err);
			}
		}
		this.#connection = new Database(this.#sqlite3Path);
	};
	static #q = LazyFactory(() => new QChannel('SQLite3AutoMigration:#q'));
	/**
	 * @description
	 * - This constructor provides extremely low abstraction with this filter;
	 * - You have to filter out from full `rawSQLMigrationResult`;
	 *
	 * @param {string} sqlite3Path
	 * - The file path to the SQLite database, relative to project root;
	 * @param {Parameters<typeof ExportDatabaseToSqlMigration>[2]} migrationRowFilter
	 * @param {number} [debounceMS]
	 * - default: `200`;
	 * @example
	 * import { Paths } from 'vivth/neutral';
	 * import { SQLite3AutoMigration, SafeExit } from 'vivth/node';
	 * new Paths({
	 * 	root: process.env.INIT_CWD ?? process.cwd(),
	 * });
	 * new SafeExit('SIGTERM', 'SIGINT');
	 * new SQLite3AutoMigration('/initial_design.db', async (tableName, columnName) => {
	 * 	switch (tableName) {
	 * 		case 'tbl_do_not_migrate':
	 * 			return false; // no rows in this table will be migrated
	 * 		default:
	 *			switch (columnName) {
	 *				case 'col_do_not_insert_to_migration':
	 *					return false; // this specific row of this table will not be migrated;
	 *				default:
	 *					return true;
	 *			}
	 * 			break;
	 * 	}
	 * }, 300)
	 */
	constructor(sqlite3Path, migrationRowFilter, debounceMS = 200) {
		this.#sqlite3Path = Paths.diskAbsolute(sqlite3Path);
		this.#reConnect();
		const watcher = (this.#watcher = chokidar.watch(this.#sqlite3Path));
		SafeExit.instance?.addCallback(this.vivthCleanup);
		const migrationPath = Paths.diskAbsolute('sql/Migration.sql');
		watcher.addListener('all', (event, path, stats) => {
			path = Paths.normalize(path);
			SQLite3AutoMigration.#q.callback(path, async ({ isLastOnQ }) => {
				if (!isLastOnQ()) {
					return;
				}
				await Timeout(debounceMS);
				switch (event) {
					case 'add':
					case 'change':
						if (!stats || !stats.isFile()) {
							this.#connection?.close();
							break;
						}
						if (!this.#connection) {
							this.#reConnect();
						}
						/**
						 * @type {Database.Database}
						 */
						// @ts-expect-error
						const connection = this.#connection;
						if (!connection) {
							return;
						}
						const [, errorMigrating] = await ExportDatabaseToSqlMigration(
							connection,
							migrationPath,
							migrationRowFilter,
						);
						if (errorMigrating) {
							this.#connection?.close();
							break;
						}
						break;
					default:
						this.#connection?.close();
						break;
				}
			});
		});
	}
}

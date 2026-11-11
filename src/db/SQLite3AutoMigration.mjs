// @ts-check

import chokidar from 'chokidar';
import Database from 'better-sqlite3';

import { SafeExit } from '../class/SafeExit.mjs';
import { Paths } from '../class/Paths.mjs';
import { TrySync } from '../function/TrySync.mjs';
import { exportDatabaseToSqlMigration } from './exportDatabaseToSqlMigration.mjs';
import { LazyFactory } from '../function/LazyFactory.mjs';
import { QChannel } from '../class/QChannel.mjs';
import { FileSafe } from '../class/FileSafe.mjs';
import { Preferrence } from '../common/Preferrence.mjs';
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
	 * @param {(rawSQLMigrationResult: string) => Promise<string>} filter
	 * - A callback that receives the complete raw SQL migration dump string and returns a processed/filtered version asynchronously
	 * @example
	 * import { SQLite3AutoMigration } from 'vivth/node';
	 * new SQLite3AutoMigration('/initial_design.db', async (raw) => {
	 * 	// simple example to delete non complicated thing via regex;
	 * 	return raw.replace(/insert\s+into[\s\S]*?values\s*\((?:'(?:''|[^'])*'|"(?:""|[^"])*"|[^)]+)*\);/gi, '');
	 * })
	 */
	constructor(sqlite3Path, filter) {
		this.#sqlite3Path = Paths.diskAbsolute(sqlite3Path);
		this.#reConnect();
		const watcher = (this.#watcher = chokidar.watch(this.#sqlite3Path));
		SafeExit.instance?.addCallback(this.vivthCleanup);
		const writePathTemp = Paths.diskAbsolute('vivth/sqlite3/migration.temp.sql');
		const migrationPath = Paths.diskAbsolute('sql/Migration.sql');
		watcher.addListener('all', (event, path, stats) => {
			path = Paths.normalize(path);
			SQLite3AutoMigration.#q.callback(path, async ({ isLastOnQ }) => {
				if (!isLastOnQ()) {
					return;
				}
				await Timeout(200);
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
						const [result, errorMigrating] = await exportDatabaseToSqlMigration(
							connection,
							writePathTemp,
						);
						if (errorMigrating) {
							this.#connection?.close();
							break;
						}
						await FileSafe.write(migrationPath, await filter(result.replace(/--[\s\S]*?\n/g, '')), {
							encoding: Preferrence.encoding,
						});
						break;
					default:
						this.#connection?.close();
						break;
				}
			});
		});
	}
}

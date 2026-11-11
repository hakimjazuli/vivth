import { ExportDatabaseToSqlMigration } from './ExportDatabaseToSqlMigration.mjs';
export type VivthCleanup = import("../typehints/VivthCleanup.mjs").VivthCleanup;
export type FSWatcher = import("chokidar").FSWatcher;
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
export declare class SQLite3AutoMigration implements VivthCleanup {
    #private;
    /**
     * @description
     * - cleanup method;
     * - can be manually called to cleanup resources that are being used by this `instance`;
     */
    vivthCleanup: () => Promise<void>;
    /**
     * @description
     * - This constructor provides extremely low abstraction with this filter;
     * - You have to filter out from full `rawSQLMigrationResult`;
     *
     * @param {string} sqlite3Path
     * - The file path to the SQLite database, relative to project root;
     * @param {Parameters<typeof ExportDatabaseToSqlMigration>[2]} migrationRowFilter
     * @example
     * import { SQLite3AutoMigration } from 'vivth/node';
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
     * })
     */
    constructor(sqlite3Path: string, migrationRowFilter: Parameters<typeof ExportDatabaseToSqlMigration>[2]);
}

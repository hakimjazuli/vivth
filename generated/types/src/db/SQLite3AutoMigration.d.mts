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
     * - for row migration, `id` must be used as primary key;
     */
    vivthCleanup: () => Promise<void>;
    /**
     * @description
     * - This constructor provides extremely low abstraction with this filter;
     * - You have to filter out from full `rawSQLMigrationResult`;
     *
     * @param {string} sqlite3Path
     * - The file path to the SQLite database, relative to project root;
     * @param {(filter:{tableName:string, columnName:string, value:any})=>("table" | "column" | "row")[]} migrationFilter
     * - return `column`: `true` -> will include the `column`(as long as returning `row` also `true`);
     * - return `column`: `false` -> will NOT include the `column`;
     * - return `row`: `true` -> will include the `row`;
     * - return `row`: `false` -> will NOT include the `row`;
     * @param {number} [debounceMS]
     * - default: `200`;
     * @example
     * import { Paths } from 'vivth/neutral';
     * import { SQLite3AutoMigration, SafeExit } from 'vivth/node';
     * new Paths({
     * 	root: process.env.INIT_CWD ?? process.cwd(),
     * });
     * new SafeExit('SIGTERM', 'SIGINT');
     * new SQLite3AutoMigration('/initial_design.db', ({tableName, columnName, value}) => {
     * 	// simple logical to pick which data which to migrate and to not to;
     * 	switch (tableName) {
     * 		case 'tbl_do_not_insert_table_to_migration':
     * 			return [];
     * 		default:
     *			switch (columnName) {
     *				case 'col_do_not_insert_column_to_migration':
     *					return ['table', 'row'];
     *				default:
     *					switch (value) {
     *						case 'val_do_not_insert_row_to_migration':
     *							return [];
     *						default:
     *							return ['table', 'row', 'column'];
     *					}
     *			}
     * 			break;
     * 	}
     * }, 300)
     */
    constructor(sqlite3Path: string, migrationFilter: (filter: {
        tableName: string;
        columnName: string;
        value: any;
    }) => ("table" | "column" | "row")[], debounceMS?: number);
}

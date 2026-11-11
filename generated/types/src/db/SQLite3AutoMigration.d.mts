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
     * @param {(rawSQLMigrationResult: string) => Promise<string>} filter
     * - A callback that receives the complete raw SQL migration dump string and returns a processed/filtered version asynchronously
     * @example
     * import { SQLite3AutoMigration } from 'vivth/node';
     * new SQLite3AutoMigration('/initial_design.db', async (raw) => {
     * 	// simple example to delete non complicated thing via regex;
     * 	return raw.replace(/insert\s+into[\s\S]*?values\s*\((?:'(?:''|[^'])*'|"(?:""|[^"])*"|[^)]+)*\);/gi, '');
     * })
     */
    constructor(sqlite3Path: string, filter: (rawSQLMigrationResult: string) => Promise<string>);
}

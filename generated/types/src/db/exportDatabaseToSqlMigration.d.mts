import { TryAsync } from '../function/TryAsync.mjs';
/**
 * Exports all schema objects and table rows from an active better-sqlite3 connection into a SQL file.
 * @param {import('better-sqlite3').Database} connection - Active SQLite database connection
 * @param {string} outputPath - Path where the migration .sql file should be saved
 * @returns {ReturnType<typeof TryAsync<string>>}
 */
export declare function exportDatabaseToSqlMigration(connection: import('better-sqlite3').Database, outputPath: string): ReturnType<typeof TryAsync<string>>;

import { TryAsync } from '../function/TryAsync.mjs';
/**
 * @description
 * - is a internal library for SQLite3AutoMigration;
 * - Exports all schema objects and table rows from an active better-sqlite3 connection into a SQL file;
 * @param {import('better-sqlite3').Database} connection
 * - Active SQLite database connection
 * @param {string} outputPath
 * - Path where the migration .sql file should be saved
 * @param {(tableName:string, columnName:string)=>boolean} migrationRowFilter
 * @returns {ReturnType<typeof TryAsync<void>>}
 */
export declare function ExportDatabaseToSqlMigration(connection: import('better-sqlite3').Database, outputPath: string, migrationRowFilter: (tableName: string, columnName: string) => boolean): ReturnType<typeof TryAsync<void>>;

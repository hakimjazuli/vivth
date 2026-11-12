import { TryAsync } from '../function/TryAsync.mjs';
/**
 * @description
 * - is a internal library for SQLite3AutoMigration;
 * - Exports all schema objects and table rows from an active better-sqlite3 connection into a SQL file;
 * @param {import('better-sqlite3').Database} connection
 * - Active SQLite database connection
 * @param {string} outputPath
 * - Path where the migration .sql file should be saved
 * @param {(filter:{tableName:string, columnName:string, value:any})=>{column: boolean, row:boolean}} migrationFilter
 * - return `column`: `true` -> will include the `column`(as long as returning `row` also `true`);
 * - return `column`: `false` -> will NOT include the `column`;
 * - return `row`: `true` -> will include the `row`;
 * - return `row`: `false` -> will NOT include the `row`;
 * @returns {ReturnType<typeof TryAsync<void>>}
 */
export declare function exportDatabaseToSqlMigration(connection: import('better-sqlite3').Database, outputPath: string, migrationFilter: (filter: {
    tableName: string;
    columnName: string;
    value: any;
}) => {
    column: boolean;
    row: boolean;
}): ReturnType<typeof TryAsync<void>>;

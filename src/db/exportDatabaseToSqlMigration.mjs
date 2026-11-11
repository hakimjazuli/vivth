// @ts-check

import { Console } from '../class/Console.mjs';
import { FileSafe } from '../class/FileSafe.mjs';
import { WalkThrough } from '../class/WalkThrough.mjs';
import { Preferrence } from '../common/Preferrence.mjs';
import { TryAsync } from '../function/TryAsync.mjs';
import { TrySync } from '../function/TrySync.mjs';

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
export async function ExportDatabaseToSqlMigration(connection, outputPath, migrationRowFilter) {
	return await TryAsync(async () => {
		let sqlDump = `-- ==========================================\n`;
		sqlDump += `-- SQLite Real-Time Migration Dump\n`;
		sqlDump += `-- Generated: ${new Date().toISOString()}\n`;
		sqlDump += `-- ==========================================\n\n`;

		// Enable foreign keys constraints safety during migration layout
		sqlDump += `PRAGMA foreign_keys = OFF;\nBEGIN TRANSACTION;\n\n`;

		// 1. Extract Tables, Views, Triggers, and Indexes from sqlite_master
		const schemaObjects = connection
			.prepare(
				`
      SELECT type, name, tbl_name, sql 
      FROM sqlite_master 
      WHERE name NOT LIKE 'sqlite_%' AND sql IS NOT NULL
      ORDER BY 
        CASE type 
          WHEN 'table' THEN 1 
          WHEN 'view' THEN 2 
          WHEN 'index' THEN 3 
          WHEN 'trigger' THEN 4 
          ELSE 5 
        END, 
        name;
    `,
			)
			.all();

		sqlDump += `-- ------------------------------------------\n`;
		sqlDump += `-- 1. SCHEMA DEFINITIONS\n`;
		sqlDump += `-- ------------------------------------------\n`;

		for (const obj of schemaObjects) {
			// @ts-expect-error
			sqlDump += `${obj.sql};\n\n`;
		}

		// 2. Extract Data Rows for all tables
		sqlDump += `-- ------------------------------------------\n`;
		sqlDump += `-- 2. TABLE DATA ROWS\n`;
		sqlDump += `-- ------------------------------------------\n`;

		// @ts-expect-error
		const tables = schemaObjects.filter((obj) => obj.type === 'table');
		Console.log(`[Migration] Found ${tables.length} tables to dump rows from.`, { now: true });
		for (const table of tables) {
			// @ts-expect-error
			const tbl_name = table.tbl_name;
			const [, tableErr] = TrySync(async () => {
				// Fetch all rows from the table using tbl_name

				const rows = connection.prepare(`SELECT * FROM "${tbl_name}"`).all();

				if (!rows || rows.length === 0) {
					Console.log(`[Migration] Table "${tbl_name}" is empty.`, { now: true });
					return;
				}

				sqlDump += `-- Data for table: ${tbl_name} (${rows.length} rows)\n`;

				for (const row of rows) {
					// @ts-expect-error
					const setOfRow = new Set(Object.keys(row));
					WalkThrough.set(setOfRow, (column_name) => {
						if (!migrationRowFilter(tbl_name, column_name)) {
							setOfRow.delete(column_name);
						}
					});
					const columns = Array.from(setOfRow);

					if (!columns.length) {
						continue;
					}
					// FIX: Map values based on the filtered `columns` array, not raw Object.values(row)
					const values = columns.map((col) => {
						// @ts-expect-error
						const val = row[col];

						if (val === null) {
							return 'NULL';
						}
						if (typeof val === 'number' || typeof val === 'bigint') {
							return val;
						}
						if (typeof val === 'boolean') {
							return val ? 1 : 0;
						}
						if (Buffer.isBuffer(val)) {
							return `X'${val.toString('hex')}'`;
						}
						return `'${String(val).replace(/'/g, "''")}'`;
					});
					// Don't forget INSERT OR REPLACE to prevent unique constraint crashes on re-runs!
					sqlDump += `INSERT OR REPLACE INTO "${tbl_name}" ("${columns.join('", "')}") VALUES (${values.join(', ')});\n`;
				}
				sqlDump += `\n`;
			});
			if (!tableErr) {
				continue;
			}
			Console.error(
				{
					'[Migration] Error': ` dumping rows for table "${tbl_name}"`,
					details: tableErr.message,
				},
				{ now: true },
			);
		}

		// Finalize transaction
		sqlDump += `COMMIT;\n`;
		sqlDump += `PRAGMA foreign_keys = ON;\n`;

		// Write file to disk
		const [, errorWrittingTempFile] = await FileSafe.write(outputPath, sqlDump, {
			encoding: Preferrence.encoding,
		});
		if (errorWrittingTempFile) {
			throw errorWrittingTempFile;
		}
		Console.log(`[Migration] Successfully wrote migration file to: ${outputPath}`, { now: true });
	});
}

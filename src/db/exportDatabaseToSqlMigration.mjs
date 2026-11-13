// @ts-check

import { Console } from '../class/Console.mjs';
import { FileSafe } from '../class/FileSafe.mjs';
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
 * @param {(filter:{tableName:string, columnName:string, value:any})=>{column: boolean, row:boolean}} migrationFilter
 * - return `column`: `true` -> will include the `column`(as long as returning `row` also `true`);
 * - return `column`: `false` -> will NOT include the `column`;
 * - return `row`: `true` -> will include the `row`;
 * - return `row`: `false` -> will NOT include the `row`;
 * @returns {ReturnType<typeof TryAsync<void>>}
 */
export async function exportDatabaseToSqlMigration(connection, outputPath, migrationFilter) {
	return await TryAsync(async () => {
		let sqlDump = '';
		// sqlDump += `-- ==========================================\n`;
		// sqlDump += `-- SQLite Real-Time Migration Dump\n`;
		// sqlDump += `-- Generated: ${new Date().toISOString()}\n`;
		// sqlDump += `-- ==========================================\n\n`;

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

		// sqlDump += `-- ------------------------------------------\n`;
		// sqlDump += `-- 1. SCHEMA DEFINITIONS\n`;
		// sqlDump += `-- ------------------------------------------\n`;

		for (const obj of schemaObjects) {
			// @ts-expect-error
			let createSql = obj.sql ? obj.sql.trim() : '';

			// Skip if empty or already has IF NOT EXISTS
			if (!createSql || createSql.toUpperCase().includes('IF NOT EXISTS')) {
				sqlDump += `${createSql};\n\n`;
				continue;
			}

			// 1. Handle CREATE VIRTUAL TABLE specifically
			if (/^CREATE\s+VIRTUAL\s+TABLE/i.test(createSql)) {
				createSql = createSql.replace(/^(CREATE\s+VIRTUAL\s+TABLE)\s+/i, '$1 IF NOT EXISTS ');
			}
			// 2. Handle standard TABLE, VIEW, INDEX, TRIGGER (with TEMP/TEMPORARY/UNIQUE modifiers)
			else {
				createSql = createSql.replace(
					/^(CREATE\s+(?:TEMP(?:ORARY)?\s+|UNIQUE\s+)*?(?:TABLE|VIEW|INDEX|TRIGGER))\s+/i,
					'$1 IF NOT EXISTS ',
				);
			}

			sqlDump += `${createSql};\n\n`;
		}

		// 2. Extract Data Rows for all tables
		// sqlDump += `-- ------------------------------------------\n`;
		// sqlDump += `-- 2. TABLE DATA ROWS\n`;
		// sqlDump += `-- ------------------------------------------\n`;

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

				// sqlDump += `-- Data for table: ${tbl_name} (${rows.length} rows)\n`;
				for (const row of rows) {
					let skipRow = false;
					// @ts-expect-error
					const setOfRow = new Set(Object.keys(row));
					for (const column_name of setOfRow) {
						const { column, row: row_ } = migrationFilter({
							tableName: tbl_name,
							columnName: column_name,
							// @ts-expect-error
							value: row[column_name],
						});
						if (!column) {
							setOfRow.delete(column_name);
						}
						if (!row_) {
							skipRow = true;
							break;
						}
					}
					if (skipRow) {
						continue;
					}
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
					// 1. Build the update assignments for every column except the primary key ('id')
					const updateAssignments = columns
						.filter((col) => col !== 'id')
						.map((col) => `"${col}" = excluded."${col}"`)
						.join(', ');

					// 2. Construct the UPSERT statement
					if (updateAssignments) {
						sqlDump += `INSERT INTO "${tbl_name}" ("${columns.join('", "')}") VALUES (${values.join(', ')}) ON CONFLICT("id") DO UPDATE SET ${updateAssignments};\n`;
					} else {
						// Fallback if the row only contains an 'id' column
						sqlDump += `INSERT OR IGNORE INTO "${tbl_name}" ("${columns.join('", "')}") VALUES (${values.join(', ')});\n`;
					}
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
		const [, errorWrittingTempFile] = await FileSafe.write(
			outputPath,
			sqlDump.replace(/\n+/g, '\n'),
			{
				encoding: Preferrence.encoding,
			},
		);
		if (errorWrittingTempFile) {
			throw errorWrittingTempFile;
		}
		Console.log(`[Migration] Successfully wrote migration file to: ${outputPath}`, { now: true });
	});
}

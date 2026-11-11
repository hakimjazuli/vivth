// @ts-check

import { Console } from '../class/Console.mjs';
import { FileSafe } from '../class/FileSafe.mjs';
import { Preferrence } from '../common/Preferrence.mjs';
import { TryAsync } from '../function/TryAsync.mjs';
import { TrySync } from '../function/TrySync.mjs';

/**
 * Exports all schema objects and table rows from an active better-sqlite3 connection into a SQL file.
 * @param {import('better-sqlite3').Database} connection - Active SQLite database connection
 * @param {string} outputPath - Path where the migration .sql file should be saved
 * @returns {ReturnType<typeof TryAsync<string>>}
 */
export async function exportDatabaseToSqlMigration(connection, outputPath) {
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
			const [, tableErr] = TrySync(async () => {
				// Fetch all rows from the table using tbl_name
				// @ts-expect-error
				const rows = connection.prepare(`SELECT * FROM "${table.tbl_name}"`).all();

				if (!rows || rows.length === 0) {
					// @ts-expect-error
					Console.log(`[Migration] Table "${table.tbl_name}" is empty.`, { now: true });
					return;
				}

				// @ts-expect-error
				sqlDump += `-- Data for table: ${table.tbl_name} (${rows.length} rows)\n`;

				for (const row of rows) {
					// @ts-expect-error
					const columns = Object.keys(row);
					// @ts-expect-error
					const values = Object.values(row).map((val) => {
						if (val === null) return 'NULL';
						if (typeof val === 'number' || typeof val === 'bigint') return val;
						if (typeof val === 'boolean') return val ? 1 : 0;
						if (Buffer.isBuffer(val)) {
							return `X'${val.toString('hex')}'`;
						}
						return `'${String(val).replace(/'/g, "''")}'`;
					});

					// @ts-expect-error
					sqlDump += `INSERT INTO "${table.tbl_name}" ("${columns.join('", "')}") VALUES (${values.join(', ')});\n`;
				}
				sqlDump += `\n`;
			});
			if (!tableErr) {
				continue;
			}
			Console.error(
				{
					// @ts-expect-error
					'[Migration] Error': ` dumping rows for table "${table.tbl_name}"`,
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

		return sqlDump;
	});
}

import { TryAsync } from './TryAsync.mjs';
/**
 * @description
 * - parse then generate file right next to said sql file;
 * - this function assume `Paths` already instantiated;s
 * @param {string} path
 * @param {(
 *  arg0:{input:Record<string, string>,output:Record<string, string>, sqlString:string}
 * )=>
 *  {ext:string, content:string}
 * } [fileGenerator]
 * - file string generator;
 * - the default will generate mjs callback type, and sql string;
 * >- `callback` type: basename + 'CBType';
 * >- `sql` string: basename + 'SQL';
 * @returns {ReturnType<typeof TryAsync<boolean>>}
 */
export declare function ParseSQLFile(path: string, fileGenerator?: (arg0: {
    input: Record<string, string>;
    output: Record<string, string>;
    sqlString: string;
}) => {
    ext: string;
    content: string;
}): ReturnType<typeof TryAsync<boolean>>;

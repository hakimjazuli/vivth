/**
 * @description
 * suited for wails3 project with getter setter pattern using `sqlite3`;
 * this class assume `Paths` and `SafeExit` to be instantiated;
 * helper method with pre templated way of:
 * - sqlite go code generation from SQL file on `{projectroot}/sql`;
 * - main_services.go generation from `{projectroot}/backend`;
 * > > - function commented with `// FORM`;
 * > - provide auto formatter and ipc generator for `// FORM` pattern;
 * > > - `// FORM` prefix for setter function;
 * - provide OOP-ish approach snippets(for .vscode):
 * > - `??staticPrepare`;
 * > - `??staticMethod`;
 * > - `??instancePrepare`;
 * > - `??instanceSingletonPrepare`;
 * > - `??instanceMethod`;
 * > - `??servicePrepare`;
 * > - `??serviceMethod`;
 * - provide `explorer.fileNesting.patterns` on `settings.json` for `.vscode`;
 * > - will nest based on parent `*.md` and `*.sql`;
 * - provide standard `backend/Connection.go` for connecting to `sqlite3` database;
 * - provide standard internal `backend/UtilsGetterSetter.go` for thread-safe, multiple readers/writters;
 * - provide standard `backend/Emitter.go` for return template;
 */
export declare class Wails3Dev {
    #private;
    /**
     * @description
     * - this is a singleton constructor;
     * - dev script to watch multiple directories on your `projectRoot` for auto format and auto generate things;
     * @param {number} [minDelay]
     * - used to add timeout for ide go autoformatter;
     * - default 200;
     * @example
     * import { Paths } from 'vivth/neutral';
     * import { Wails3Dev, SafeExit } from 'vivth/node';
     * new Paths({
     * 	root: process.env.INIT_CWD ?? process.cwd(),
     * });
     * new SafeExit('SIGTERM', 'SIGINT');
     * new Wails3Dev();
     */
    constructor(minDelay?: number);
}

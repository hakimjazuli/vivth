/**
 * @description
 * suited for wails2 project with getter setter pattern using `sqlite3`;
 * this class assume `Paths` and `SafeExit` to be instantiated;
 * helper method with pre templated way of:
 * - sqlite go code generation from SQL file on `{projectroot}/sql`;
 * - auto_ipc.go generation from `{projectroot}/backend`;
 * > > - function commented with `// GETTER`;
 * > > - function commented with `// SETTER`;
 * > - provide auto formatter and ipc generator for `// GETTER` and `// SETTER` pattern;
 * > > - `// GETTER` prefix for getter function;
 * > > - `// SETTER` prefix for setter function;
 * - provide OOP-ish approach snippets(for .vscode):
 * > - `??staticPrepare`;
 * > - `??staticMethod`;
 * > - `??instancePrepare`;
 * > - `??instanceSingletonPrepare`;
 * > - `??instanceMethod`;
 * - provide `explorer.fileNesting.patterns` on `settings.json` for `.vscode`;
 * > - will nest based on parent `*.md` and `*.sql`;
 * - provide standard `backend/Connection.go` for connecting to `sqlite3` database;
 * - provide standard internal `backend/UtilsGetterSetter.go` for thread-safe, multiple readers/writters;
 */
export declare class Wails2Dev {
    #private;
    /**
     * @description
     * - this is a singleton constructor;
     * - dev script to watch multiple directories on your `projectRoot` for auto format and auto generate things;
     * @example
     * import { Paths } from 'vivth/neutral';
     * import { Wails2Dev, SafeExit } from 'vivth/node';
     * new Paths({
     * 	root: process.env.INIT_CWD ?? process.cwd(),
     * });
     * new SafeExit('SIGTERM', 'SIGINT');
     * new Wails2Dev();
     */
    constructor();
}

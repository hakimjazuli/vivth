export declare const wailsProjectHelperSnippet: {
    staticPrepare: {
        prefix: string;
        scope: string;
        body: string[];
        description: string;
    };
    staticMethod: {
        prefix: string;
        scope: string;
        body: string[];
        description: string;
    };
    instancePrepare: {
        prefix: string;
        scope: string;
        body: string[];
        description: string;
    };
    instanceSingletonPrepare: {
        prefix: string;
        scope: string;
        body: string[];
        description: string;
    };
    instanceMethod: {
        prefix: string;
        scope: string;
        body: string[];
        description: string;
    };
};
export declare const wailsProjcetHelperSnippetService: {
    servicePrepare: {
        prefix: string;
        scope: string;
        body: string[];
        description: string;
    };
    serviceMethod: {
        prefix: string;
        scope: string;
        body: string[];
        description: string;
    };
};
export declare const wailsProjectHelperSettings: {
    'explorer.fileNesting.patterns': {
        '*.md': string;
        '*.sql': string;
    };
};
export declare const wailsFileContentsConnection = "package backend\n\nimport (\n\t\"database/sql\"\n\t\"fmt\"\n\t\"path/filepath\"\n\t\"sync\"\n)\n\ntype connectionStatic struct {\n\tmu         sync.Mutex\n\tactiveConn *sql.DB\n\tactivePath string\n}\n\nvar (\n\tConnectionStatic connectionStatic\n\tconnectionRef    *UtilsGetterSetterInstance[*sql.DB] = UtilsGetterSetterStatic.New[*sql.DB](nil)\n)\n\nfunc (thisClass *connectionStatic) set(dirPath string) (*sql.DB, error) {\n\tthisClass.mu.Lock()\n\tdefer thisClass.mu.Unlock()\n\n\t// 1. Sanitize directory path and construct target DB filepath\n\tcleanDir := filepath.Clean(dirPath)\n\tdbPath := filepath.Join(cleanDir, \"shinstask.db\")\n\n\t// 2. Close existing connection if active\n\tif thisClass.activeConn != nil {\n\t\t_, _ = thisClass.activeConn.Exec(\"PRAGMA wal_checkpoint(TRUNCATE);\")\n\t\t_ = thisClass.activeConn.Close()\n\t\tthisClass.activeConn = nil\n\t\tthisClass.activePath = \"\"\n\t\tconnectionRef.Set(nil)\n\t}\n\n\t// 3. Construct DSN string with SQLite PRAGMA configuration\n\tdsn := fmt.Sprintf(\n\t\t\"file:%s?_pragma=journal_mode(WAL)&_pragma=synchronous(NORMAL)&_pragma=busy_timeout(5000)&_pragma=foreign_keys(ON)\",\n\t\tdbPath,\n\t)\n\n\t// 4. Open new SQLite DB connection\n\tdb, err := sql.Open(\"sqlite\", dsn)\n\tif err != nil {\n\t\treturn nil, fmt.Errorf(\"failed to open sqlite db at %s: %w\", dbPath, err)\n\t}\n\n\t// Configure connection pool limits for SQLite single-writer model\n\tdb.SetMaxOpenConns(1)\n\n\tif err := db.Ping(); err != nil {\n\t\t_ = db.Close()\n\t\treturn nil, fmt.Errorf(\"failed to ping sqlite db at %s: %w\", dbPath, err)\n\t}\n\n\t// Store internal state\n\tthisClass.activeConn = db\n\tthisClass.activePath = dbPath\n\n\treturn db, nil\n}\n";
export declare const wailsFileContentsUtilsGetterSetter = "package backend\n\nimport \"sync\"\n\ntype (\n\tUtilsGetterSetterInstance[T any] struct {\n\t\tutilsGetterSettermu    sync.RWMutex\n\t\tutilsGetterSettervalue T\n\t}\n\n\tutilsGetterSetterStatic struct{}\n)\n\nvar UtilsGetterSetterStatic utilsGetterSetterStatic\n\n// New creates a new Instance with an initial value of type T.\nfunc (thisClass utilsGetterSetterStatic) New[T any](initialValue T) *UtilsGetterSetterInstance[T] {\n\treturn &UtilsGetterSetterInstance[T]{\n\t\tutilsGetterSettervalue: initialValue,\n\t}\n}\n\n// Get returns the stored value (thread-safe, multiple readers allowed).\nfunc (thisInstance *UtilsGetterSetterInstance[T]) Get() T {\n\tthisInstance.utilsGetterSettermu.RLock()\n\tdefer thisInstance.utilsGetterSettermu.RUnlock()\n\treturn thisInstance.utilsGetterSettervalue\n}\n\n// Set updates the stored value (thread-safe, exclusive write lock).\nfunc (thisInstance *UtilsGetterSetterInstance[T]) Set(value T) {\n\tthisInstance.utilsGetterSettermu.Lock()\n\tdefer thisInstance.utilsGetterSettermu.Unlock()\n\tthisInstance.utilsGetterSettervalue = value\n}\n";
export declare const wailsProjectHelperEmitter = "package backend\n\nimport (\n\t\"github.com/wailsapp/wails/v3/pkg/application\"\n)\n\ntype (\n\tEmitterInstance struct{}\n\temitterStatic   struct {}\n)\n\nvar EmitterStatic emitterStatic\n\nfunc (thisClass emitterStatic) New(events []string) *EmitterInstance {\n\tif len(events) == 0 {\n\t\treturn &EmitterInstance{}\n\t}\n\tapplication.Get().Event.Emit(\"getter:update\", events)\n\treturn &EmitterInstance{}\n}\n";

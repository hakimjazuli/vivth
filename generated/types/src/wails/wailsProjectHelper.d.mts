export declare const wailsProjectHelperEmitterUpdatedDatasName = "emitter:updated_datas";
export declare const wailsProjectHelperDBLogName = "db:log";
export declare const wailsProjectHelperDBUpdatedName = "db:updated";
export declare const wailsProjectHelperSnippet: {
    eventRegister: {
        prefix: string;
        scope: string;
        body: string[];
        description: string;
    };
    emit: {
        prefix: string;
        scope: string;
        body: string[];
        description: string;
    };
    initPrepare: {
        prefix: string;
        scope: string;
        body: string[];
        description: string;
    };
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
export declare const wailsProjectHelperSnippetService: {
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
    serviceStartup: {
        prefix: string;
        scope: string;
        body: string[];
        description: string;
    };
    serviceShutdown: {
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
export declare const wailsFileContentsConnection = "package backend\n\nimport (\n\t\"database/sql\"\n\t\"fmt\"\n\t\"path/filepath\"\n\t\"sync\"\n\n\t_ \"modernc.org/sqlite\"\n\t\"github.com/wailsapp/wails/v3/pkg/application\"\n)\n\ntype connectionStatic struct {\n\tmu   sync.Mutex\n\tconn *UtilsGetterSetterInstance[*sql.DB]\n\tpath *UtilsGetterSetterInstance[string]\n}\n\nconst (\n\tConnectionDbLogEvent  = \"db:log\"\n\tConnectionDbUpdateEvent = \"db:updated\"\n)\n\nfunc init() {\n\tapplication.RegisterEvent[string](ConnectionDbLogEvent)\n\tapplication.RegisterEvent[string](ConnectionDbUpdateEvent)\n}\n\nvar ConnectionStatic connectionStatic\n\nfunc (thisClass *connectionStatic) Set(dirPath string, dbName string) error {\n\tthisClass.mu.Lock()\n\tdefer thisClass.mu.Unlock()\n\n\tif thisClass.conn == nil {\n\t\tthisClass.conn = UtilsGetterSetterStatic.New[*sql.DB](nil)\n\t}\n\tif thisClass.path == nil {\n\t\tthisClass.path = UtilsGetterSetterStatic.New(\"\")\n\t}\n\tif dirPath == \"\" {\n\t\treturn fmt.Errorf(\"dirPath cannot be empty\")\n\t}\n\tif dbName == \"\" {\n\t\treturn fmt.Errorf(\"dbName cannot be empty\")\n\t}\n\n\t// 1. Sanitize directory path and construct target DB filepath\n\tcleanDir := filepath.Clean(dirPath)\n\tdbPath := filepath.Join(cleanDir, dbName+\".sqlite3\")\n\n\t// 2. Close existing connection if active\n\tif oldDB := thisClass.conn.Get(); oldDB != nil {\n\t\t_, _ = oldDB.Exec(\"PRAGMA wal_checkpoint(TRUNCATE);\")\n\t\t_ = oldDB.Close()\n\t\tthisClass.path.Set(\"\")\n\t\tthisClass.conn.Set(nil)\n\t}\n\n\t// 3. Construct DSN string with SQLite PRAGMA configuration\n\tdsn := fmt.Sprintf(\n\t\t\"file:%s?_pragma=journal_mode(WAL)&_pragma=synchronous(NORMAL)&_pragma=busy_timeout(5000)&_pragma=foreign_keys(ON)\",\n\t\tdbPath,\n\t)\n\n\t// 4. Open new SQLite DB connection\n\tdb, err := sql.Open(\"sqlite\", dsn)\n\tif err != nil {\n\t\treturn fmt.Errorf(\"failed to open sqlite db at %s: %w\", dbPath, err)\n\t}\n\n\t// Configure connection pool limits for SQLite single-writer model\n\tdb.SetMaxOpenConns(1)\n\n\tif err := db.Ping(); err != nil {\n\t\t_ = db.Close()\n\t\treturn fmt.Errorf(\"failed to ping sqlite db at %s: %w\", dbPath, err)\n\t}\n\n\t// Store internal state\n\tthisClass.conn.Set(db)\n\tthisClass.path.Set(dbPath)\n\n\treturn nil\n}\n";
export declare const wailsFileContentsUtilsGetterSetter = "package backend\n\nimport \"sync\"\n\ntype (\n\tUtilsGetterSetterInstance[T any] struct {\n\t\tutilsGetterSettermu    sync.RWMutex\n\t\tutilsGetterSettervalue T\n\t}\n\n\tutilsGetterSetterStatic struct{}\n)\n\nvar UtilsGetterSetterStatic utilsGetterSetterStatic\n\n// New creates a new Instance with an initial value of type T.\nfunc (thisClass utilsGetterSetterStatic) New[T any](initialValue T) *UtilsGetterSetterInstance[T] {\n\treturn &UtilsGetterSetterInstance[T]{\n\t\tutilsGetterSettervalue: initialValue,\n\t}\n}\n\n// Get returns the stored value (thread-safe, multiple readers allowed).\nfunc (thisInstance *UtilsGetterSetterInstance[T]) Get() T {\n\tthisInstance.utilsGetterSettermu.RLock()\n\tdefer thisInstance.utilsGetterSettermu.RUnlock()\n\treturn thisInstance.utilsGetterSettervalue\n}\n\n// Set updates the stored value (thread-safe, exclusive write lock).\nfunc (thisInstance *UtilsGetterSetterInstance[T]) Set(value T) {\n\tthisInstance.utilsGetterSettermu.Lock()\n\tdefer thisInstance.utilsGetterSettermu.Unlock()\n\tthisInstance.utilsGetterSettervalue = value\n}\n";
export declare const wailsProjectHelperEmitter = "package backend\n\nimport (\n\t\"github.com/wailsapp/wails/v3/pkg/application\"\n)\n\ntype (\n\tEmitterInstance struct{}\n\temitterStatic   struct {}\n)\n\nconst EmitterUpdateEvent = \"emitter:updated_datas\"\n\nfunc init() {\n\tapplication.RegisterEvent[[]string](EmitterUpdateEvent)\n}\n\nvar EmitterStatic emitterStatic\n\n// return type generator\nfunc (thisClass emitterStatic) New(events []string) *EmitterInstance {\n\tif len(events) == 0 {\n\t\treturn &EmitterInstance{}\n\t}\n\tapplication.Get().Event.Emit(EmitterUpdateEvent, events)\n\treturn &EmitterInstance{}\n}\n";

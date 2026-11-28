// @ts-check

export const wailsProjectHelperEmitterUpdatedDatasName = 'emitter:updated_datas';
export const wailsProjectHelperDBLogName = 'db:log';
export const wailsProjectHelperDBUpdatedName = 'db:updated';

export const wailsProjectHelperSnippet = {
	eventRegister: {
		prefix: '??eventRegister',
		scope: 'go',
		body: ['application.RegisterEvent[${0:Name}Data](${0:Name}Event)'],
		description: 'eventRegister',
	},
	emit: {
		prefix: '??emit',
		scope: 'go',
		body: ['application.Get().Event.Emit(${1:EventName}, ${2:eventPayload})'],
		description: 'emit',
	},
	initPrepare: {
		prefix: '??initPrepare',
		scope: 'go',
		body: ['func init() {', '\t${0:// code}', '}'],
		description: 'initPrepare',
	},
	staticPrepare: {
		prefix: '??staticPrepare',
		scope: 'go',
		body: [
			'type ${TM_FILENAME_BASE/^(.)/${1:/downcase}/}Static struct{}',
			'',
			'var ${TM_FILENAME_BASE/^(.)/${1:/upcase}/}Static ${TM_FILENAME_BASE/^(.)/${1:/downcase}/}Static',
		],
		description: 'staticPrepare',
	},
	staticMethod: {
		prefix: '??staticMethod',
		scope: 'go',
		body: [
			'func (thisClass ${TM_FILENAME_BASE/^(.)/${1:/downcase}/}Static) ${0:methodName}() {',
			'\t// code',
			'}',
		],
		description: 'staticMethod',
	},
	instancePrepare: {
		prefix: '??instancePrepare',
		scope: 'go',
		body: [
			'type ${TM_FILENAME_BASE/^(.)/${1:/upcase}/}Instance struct{}',
			'type ${TM_FILENAME_BASE/^(.)/${1:/downcase}/}Static struct{}',
			'',
			'var ${TM_FILENAME_BASE/^(.)/${1:/upcase}/}Static ${TM_FILENAME_BASE/^(.)/${1:/downcase}/}Static',
			'',
			'func (thisClass ${TM_FILENAME_BASE/^(.)/${1:/downcase}/}Static) New() *${TM_FILENAME_BASE/^(.)/${1:/upcase}/}Instance {',
			'\treturn &${TM_FILENAME_BASE/^(.)/${1:/upcase}/}Instance{}',
			'}',
		],
		description: 'instancePrepare',
	},
	instanceSingletonPrepare: {
		prefix: '??instanceSingletonPrepare',
		scope: 'go',
		body: [
			'import (',
			'\t"sync"',
			')',
			'',
			'type ${TM_FILENAME_BASE/^(.)/${1:/upcase}/}Instance struct{}',
			'type ${TM_FILENAME_BASE/^(.)/${1:/downcase}/}Static struct{}',
			'',
			'var (',
			'\t${TM_FILENAME_BASE/^(.)/${1:/upcase}/}Static ${TM_FILENAME_BASE/^(.)/${1:/downcase}/}Static',
			'\t${TM_FILENAME_BASE/^(.)/${1:/downcase}/}StaticInstance *${TM_FILENAME_BASE/^(.)/${1:/upcase}/}Instance',
			'\t${TM_FILENAME_BASE/^(.)/${1:/downcase}/}StaticOnce     sync.Once',
			')',
			'',
			'func (thisClass ${TM_FILENAME_BASE/^(.)/${1:/downcase}/}Static) New() *${TM_FILENAME_BASE/^(.)/${1:/upcase}/}Instance {',
			'\t${TM_FILENAME_BASE/^(.)/${1:/downcase}/}StaticOnce.Do(func() {',
			'\t\t${TM_FILENAME_BASE/^(.)/${1:/downcase}/}StaticInstance = &${TM_FILENAME_BASE/^(.)/${1:/upcase}/}Instance{}',
			'\t})',
			'\treturn ${TM_FILENAME_BASE/^(.)/${1:/downcase}/}StaticInstance',
			'}',
		],
		description: 'instanceSingletonPrepare',
	},
	instanceMethod: {
		prefix: '??instanceMethod',
		scope: 'go',
		body: [
			'func (thisInstance *${TM_FILENAME_BASE/^(.)/${1:/upcase}/}Instance) ${0:methodName}() {',
			'\t// code',
			'}',
		],
		description: 'instanceMethod',
	},
};

export const wailsProjectHelperSnippetService = {
	servicePrepare: {
		prefix: '??servicePrepare',
		scope: 'go',
		body: ['type ${TM_FILENAME_BASE/^(.)/${1:/upcase}/} struct{}'],
		description: 'servicePrepare',
	},
	serviceMethod: {
		prefix: '??serviceMethod',
		scope: 'go',
		body: [
			'func (thisService *${TM_FILENAME_BASE/^(.)/${1:/upcase}/}) ${0:methodName}() {',
			'\t// code',
			'}',
		],
		description: 'serviceMethod',
	},
	serviceStartup: {
		prefix: '??serviceStartup',
		scope: 'go',
		body: [
			'func (thisService *${TM_FILENAME_BASE/^(.)/${1:/upcase}/}) ServiceStartup(ctx context.Context, options application.ServiceOptions) error {',
			'\t// code',
			'\t// return error to prevent startup',
			'}',
		],
		description: 'serviceStartup',
	},
	serviceShutdown: {
		prefix: '??serviceShutdown',
		scope: 'go',
		body: [
			'func (thisService *${TM_FILENAME_BASE/^(.)/${1:/upcase}/}) ServiceShutdown() error {',
			'\t// code',
			"\t// returning error doesn't prevent shutdown",
			'}',
		],
		description: 'serviceShutdown',
	},
};

export const wailsProjectHelperSettings = {
	'explorer.fileNesting.patterns': {
		'*.md': '$(capture)*',
		'*.sql': '$(capture).sql*',
	},
};

export const wailsFileContentsConnection = `package backend

import (
	"database/sql"
	"fmt"
	"path/filepath"
	"sync"

	_ "modernc.org/sqlite"
	"github.com/wailsapp/wails/v3/pkg/application"
)

type connectionStatic struct {
	mu   sync.Mutex
	conn *UtilsGetterSetterInstance[*sql.DB]
	path *UtilsGetterSetterInstance[string]
}

const (
	ConnectionDbLogEvent  = "${wailsProjectHelperDBLogName}"
	ConnectionDbUpdateEvent = "${wailsProjectHelperDBUpdatedName}"
)

func init() {
	application.RegisterEvent[string](ConnectionDbLogEvent)
	application.RegisterEvent[string](ConnectionDbUpdateEvent)
}

var ConnectionStatic connectionStatic

func (thisClass *connectionStatic) Set(dirPath string, dbName string) error {
	thisClass.mu.Lock()
	defer thisClass.mu.Unlock()

	if thisClass.conn == nil {
		thisClass.conn = UtilsGetterSetterStatic.New[*sql.DB](nil)
	}
	if thisClass.path == nil {
		thisClass.path = UtilsGetterSetterStatic.New("")
	}
	if dirPath == "" {
		return fmt.Errorf("dirPath cannot be empty")
	}
	if dbName == "" {
		return fmt.Errorf("dbName cannot be empty")
	}

	// 1. Sanitize directory path and construct target DB filepath
	cleanDir := filepath.Clean(dirPath)
	dbPath := filepath.Join(cleanDir, dbName+".sqlite3")

	// 2. Close existing connection if active
	if oldDB := thisClass.conn.Get(); oldDB != nil {
		_, _ = oldDB.Exec("PRAGMA wal_checkpoint(TRUNCATE);")
		_ = oldDB.Close()
		thisClass.path.Set("")
		thisClass.conn.Set(nil)
	}

	// 3. Construct DSN string with SQLite PRAGMA configuration
	dsn := fmt.Sprintf(
		"file:%s?_pragma=journal_mode(WAL)&_pragma=synchronous(NORMAL)&_pragma=busy_timeout(5000)&_pragma=foreign_keys(ON)",
		dbPath,
	)

	// 4. Open new SQLite DB connection
	db, err := sql.Open("sqlite", dsn)
	if err != nil {
		return fmt.Errorf("failed to open sqlite db at %s: %w", dbPath, err)
	}

	// Configure connection pool limits for SQLite single-writer model
	db.SetMaxOpenConns(1)

	if err := db.Ping(); err != nil {
		_ = db.Close()
		return fmt.Errorf("failed to ping sqlite db at %s: %w", dbPath, err)
	}

	// Store internal state
	thisClass.conn.Set(db)
	thisClass.path.Set(dbPath)

	return nil
}
`;

export const wailsFileContentsUtilsGetterSetter = `package backend

import "sync"

type (
	UtilsGetterSetterInstance[T any] struct {
		utilsGetterSettermu    sync.RWMutex
		utilsGetterSettervalue T
	}

	utilsGetterSetterStatic struct{}
)

var UtilsGetterSetterStatic utilsGetterSetterStatic

// New creates a new Instance with an initial value of type T.
func (thisClass utilsGetterSetterStatic) New[T any](initialValue T) *UtilsGetterSetterInstance[T] {
	return &UtilsGetterSetterInstance[T]{
		utilsGetterSettervalue: initialValue,
	}
}

// Get returns the stored value (thread-safe, multiple readers allowed).
func (thisInstance *UtilsGetterSetterInstance[T]) Get() T {
	thisInstance.utilsGetterSettermu.RLock()
	defer thisInstance.utilsGetterSettermu.RUnlock()
	return thisInstance.utilsGetterSettervalue
}

// Set updates the stored value (thread-safe, exclusive write lock).
func (thisInstance *UtilsGetterSetterInstance[T]) Set(value T) {
	thisInstance.utilsGetterSettermu.Lock()
	defer thisInstance.utilsGetterSettermu.Unlock()
	thisInstance.utilsGetterSettervalue = value
}
`;
export const wailsProjectHelperEmitter = `package backend

import (
	"github.com/wailsapp/wails/v3/pkg/application"
)

type (
	EmitterInstance struct{}
	emitterStatic   struct {}
)

const EmitterUpdateEvent = "${wailsProjectHelperEmitterUpdatedDatasName}"

func init() {
	application.RegisterEvent[[]string](EmitterUpdateEvent)
}

var EmitterStatic emitterStatic

// return type generator
func (thisClass emitterStatic) New(events []string) *EmitterInstance {
	if len(events) == 0 {
		return &EmitterInstance{}
	}
	application.Get().Event.Emit(EmitterUpdateEvent, events)
	return &EmitterInstance{}
}
`;

// @ts-check

export const wailsProjectHelperSnippet = {
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

export const wailsProjcetHelperSnippetService = {
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
)

type connectionStatic struct {
	mu         sync.Mutex
	activeConn *sql.DB
	activePath string
}

var (
	ConnectionStatic connectionStatic
	connectionRef    *UtilsGetterSetterInstance[*sql.DB] = UtilsGetterSetterStatic.New[*sql.DB](nil)
)

func (thisClass *connectionStatic) set(dirPath string) (*sql.DB, error) {
	thisClass.mu.Lock()
	defer thisClass.mu.Unlock()

	// 1. Sanitize directory path and construct target DB filepath
	cleanDir := filepath.Clean(dirPath)
	dbPath := filepath.Join(cleanDir, "shinstask.db")

	// 2. Close existing connection if active
	if thisClass.activeConn != nil {
		_, _ = thisClass.activeConn.Exec("PRAGMA wal_checkpoint(TRUNCATE);")
		_ = thisClass.activeConn.Close()
		thisClass.activeConn = nil
		thisClass.activePath = ""
		connectionRef.Set(nil)
	}

	// 3. Construct DSN string with SQLite PRAGMA configuration
	dsn := fmt.Sprintf(
		"file:%s?_pragma=journal_mode(WAL)&_pragma=synchronous(NORMAL)&_pragma=busy_timeout(5000)&_pragma=foreign_keys(ON)",
		dbPath,
	)

	// 4. Open new SQLite DB connection
	db, err := sql.Open("sqlite", dsn)
	if err != nil {
		return nil, fmt.Errorf("failed to open sqlite db at %s: %w", dbPath, err)
	}

	// Configure connection pool limits for SQLite single-writer model
	db.SetMaxOpenConns(1)

	if err := db.Ping(); err != nil {
		_ = db.Close()
		return nil, fmt.Errorf("failed to ping sqlite db at %s: %w", dbPath, err)
	}

	// Store internal state
	thisClass.activeConn = db
	thisClass.activePath = dbPath

	return db, nil
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

var EmitterStatic emitterStatic

func (thisClass emitterStatic) New(events []string) *EmitterInstance {
	if len(events) == 0 {
		return &EmitterInstance{}
	}
	application.Get().Event.Emit("getter:update", events)
	return &EmitterInstance{}
}
`;

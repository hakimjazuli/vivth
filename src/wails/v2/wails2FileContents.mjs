// @ts-check

export const wails2FileContentsUtilsGetterSetter = `package backend

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

export const wails2FileContentsConnection = `package backend

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
	// dsn := fmt.Sprintf("file:%s?_pragma=journal_mode(WAL)&_pragma=synchronous(NORMAL)&_pragma=busy_timeout(5000)", dbPath) // without foreign key;

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

/**
 * @param {string} functionName
 * @param {string} trueInput
 * @param {string} trueOutput
 * @param {string} safeSql
 * @param {boolean} isReadQuery
 * @param {string} namedQueryArgs
 * @param {string} scanTargets
 * @returns {string}
 */
export const wails2FileContentSQLGoGenerator = (
	functionName,
	trueInput,
	trueOutput,
	safeSql,
	isReadQuery,
	namedQueryArgs,
	scanTargets,
) => {
	return `package sql

import (
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

type ${functionName}InputStruct struct {
${trueInput}
}
type ${functionName}OutputStruct struct {
${trueOutput}
}

func ${functionName}(appCtx context.Context, connection *sql.DB, input *${functionName}InputStruct) ([]*${functionName}OutputStruct, error) {
	if connection == nil {
		err := fmt.Errorf("database connection is nil")
		runtime.EventsEmit(appCtx, "Log", err)
		fmt.Println(err)
		return nil, err
	}

	tx, err := connection.BeginTx(context.Background(), nil)
	if err != nil {
		err = fmt.Errorf("${functionName}: failed to begin transaction: %w", err)
		runtime.EventsEmit(appCtx, "Log", err)
		fmt.Println(err)
		return nil, err
	}
	defer tx.Rollback()

	query := \`${safeSql}\`

	stmt, err := tx.PrepareContext(context.Background(), query)
	if err != nil {
		err = fmt.Errorf("${functionName}: failed to prepare statement: %w", err)
		runtime.EventsEmit(appCtx, "Log", err)
		fmt.Println(err)
		return nil, err
	}
	defer stmt.Close()

${
	isReadQuery
		? `\trows, err := stmt.QueryContext(
		context.Background()${namedQueryArgs ? `,\n\t\t${namedQueryArgs}` : ''},
	)
	if err != nil {
		err = fmt.Errorf("${functionName}: query execution failed: %w", err)
		runtime.EventsEmit(appCtx, "Log", err)
		fmt.Println(err)
		return nil, err
	}
	defer rows.Close()

	var results []*${functionName}OutputStruct

	for rows.Next() {
		item := &${functionName}OutputStruct{}
		if err := rows.Scan(${scanTargets}); err != nil {
			err = fmt.Errorf("${functionName}: failed to scan row: %w", err)
			runtime.EventsEmit(appCtx, "Log", err)
			fmt.Println(err)
			return nil, err
		}
		results = append(results, item)
	}

	if err := rows.Err(); err != nil {
		err = fmt.Errorf("${functionName}: row iteration error: %w", err)
		runtime.EventsEmit(appCtx, "Log", err)
		fmt.Println(err)
		return nil, err
	}

	if err := tx.Commit(); err != nil {
		err = fmt.Errorf("${functionName}: transaction commit failed: %w", err)
		runtime.EventsEmit(appCtx, "Log", err)
		fmt.Println(err)
		return nil, err
	}

	return results, nil
}`
		: `\t_, err = stmt.ExecContext(
		context.Background()${namedQueryArgs ? `,\n\t\t${namedQueryArgs}` : ''},
	)
	if err != nil {
		err = fmt.Errorf("${functionName}: statement execution failed: %w", err)
		runtime.EventsEmit(appCtx, "Log", err)
		fmt.Println(err)
		return nil, err
	}

	if err := tx.Commit(); err != nil {
		err = fmt.Errorf("${functionName}: transaction commit failed: %w", err)
		runtime.EventsEmit(appCtx, "Log", err)
		fmt.Println(err)
		return nil, err
	}
	runtime.EventsEmit(appCtx, "Updated")
	runtime.EventsEmit(appCtx, "Log", "database is connected")
	return []*${functionName}OutputStruct{}, nil
}`
}
`;
};

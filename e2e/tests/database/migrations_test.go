package database

import (
	"database/sql"
	"e2e/truter/setup"
	"testing"

	_ "github.com/lib/pq"
)

func TestTablesExist(t *testing.T) {
	db, err := sql.Open("postgres", setup.DbURL)
	if err != nil {
		t.Fatalf("Erro ao conectar ao banco: %v", err)
	}
	defer db.Close()

	tables := []string{"User", "CryptoPrice"}

	for _, table := range tables {
		t.Run("Checking "+table, func(t *testing.T) {
			var exists bool
			query := "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = $1)"
			err := db.QueryRow(query, table).Scan(&exists)
			if err != nil {
				t.Fatalf("Erro ao checar tabela %s: %v", table, err)
			}
			if !exists {
				t.Errorf("A tabela %s não existe no banco", table)
			}
		})
	}
}

func TestColumnsExist(t *testing.T) {
	db, err := sql.Open("postgres", setup.DbURL)
	if err != nil {
		t.Fatalf("Erro ao conectar ao banco: %v", err)
	}
	defer db.Close()

	columns := map[string][]string{
		"User":        {"id", "name", "email", "password", "role"},
		"CryptoPrice": {"id", "coinId", "marketCap", "currentPrice"},
	}

	for table, cols := range columns {
		for _, col := range cols {
			t.Run("Checking "+table+"."+col, func(t *testing.T) {
				var exists bool
				query := `SELECT EXISTS (
					SELECT FROM information_schema.columns
					WHERE table_name = $1 AND column_name = $2
				)`
				err := db.QueryRow(query, table, col).Scan(&exists)
				if err != nil {
					t.Fatalf("Erro ao checar coluna %s.%s: %v", table, col, err)
				}
				if !exists {
					t.Errorf("A coluna %s.%s não existe no banco", table, col)
				}
			})
		}
	}
}

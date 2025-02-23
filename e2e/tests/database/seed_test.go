package database_test

import (
	"database/sql"
	"e2e/truter/setup"
	"testing"

	_ "github.com/lib/pq"
)

func TestSuperAdminExists(t *testing.T) {
	db, err := sql.Open("postgres", setup.DbURL)
	if err != nil {
		t.Fatalf("Erro ao conectar ao banco: %v", err)
	}
	defer db.Close()

	err = setup.WaitForTableExists(db, "User")
	if err != nil {
		t.Fatalf("Erro: %v", err)
	}

	var count int
	query := `SELECT COUNT(*) FROM "User" WHERE email = 'superadmin@email.com'`
	err = db.QueryRow(query).Scan(&count)
	if err != nil {
		t.Fatalf("Erro ao verificar seed do Super Admin: %v", err)
	}

	if count == 0 {
		t.Errorf("Super Admin não foi criado corretamente!")
	}
}

func TestUsersExistAfterSeed(t *testing.T) {
	db, err := sql.Open("postgres", setup.DbURL)
	if err != nil {
		t.Fatalf("Erro ao conectar ao banco: %v", err)
	}
	defer db.Close()

	err = setup.WaitForTableExists(db, "User")
	if err != nil {
		t.Fatalf("Erro: %v", err)
	}

	var count int
	query := `SELECT COUNT(*) FROM "User" LIMIT 100`
	err = db.QueryRow(query).Scan(&count)
	if err != nil {
		t.Fatalf("Erro ao contar usuários: %v", err)
	}

	if count < 2 { // O seed cria o Super Admin e create_users.js cria outros usuários
		t.Errorf("Esperava pelo menos 2 usuários, mas encontrou %d", count)
	}
}

func TestUserPasswordIsHashed(t *testing.T) {
	db, err := sql.Open("postgres", setup.DbURL)
	if err != nil {
		t.Fatalf("Erro ao conectar ao banco: %v", err)
	}
	defer db.Close()

	err = setup.WaitForTableExists(db, "User")
	if err != nil {
		t.Fatalf("Erro: %v", err)
	}

	var passwordHash string
	query := `SELECT password FROM "User" WHERE email = 'superadmin@email.com'`
	err = db.QueryRow(query).Scan(&passwordHash)
	if err != nil {
		t.Fatalf("Erro ao verificar senha do Super Admin: %v", err)
	}

	if len(passwordHash) < 30 { // Hash do bcrypt tem pelo menos 30 caracteres
		t.Errorf("Senha do Super Admin parece não estar hashada corretamente!")
	}
}

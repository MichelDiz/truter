package main

import (
	"e2e/truter/setup"
	"log"
	"testing"
)

// Executa setup antes de todos os testes
func TestMain(m *testing.M) {
	log.Println("Resetando banco de dados...")
	setup.ResetDatabase()

	log.Println("Rodando Migrations...")
	setup.RunMigrations()

	log.Println("Rodando Seeds...")
	setup.RunSeed()
	setup.CreateUsers()

	log.Println("Iniciando Testes...")
	m.Run()
	// for {
	// 	fmt.Println("rodando")
	// }
}

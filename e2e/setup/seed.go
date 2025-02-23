package setup

import (
	"database/sql"
	"log"
	"os/exec"

	_ "github.com/lib/pq"
)

// RunSeed executa `tsx ./prisma/seed.ts`
func RunSeed() {
	backendContainer := getBackendContainerName()
	if backendContainer == "" {
		log.Fatalf("Erro: O container backend não está rodando!")
	}

	cmd := exec.Command("docker", "exec", "-i", backendContainer, "npm", "run", "seed")
	cmd.Stdout = log.Writer()
	cmd.Stderr = log.Writer()

	err := cmd.Run()
	if err != nil {
		log.Fatalf("Erro ao rodar seed: %v", err)
	}

	// Aguarda até que os dados realmente estejam no banco
	db, err := sql.Open("postgres", DbURL)
	if err != nil {
		log.Fatalf("Erro ao conectar ao banco: %v", err)
	}
	defer db.Close()

	log.Println("Aguardando dados do seed serem inseridos...")
	err = WaitForSeedData(db, "User")
	if err != nil {
		log.Fatalf("Erro ao aguardar dados do seed: %v", err)
	}
	log.Println("Dados do seed confirmados no banco!")
}

// CreateUsers executa `node ./scripts/create_users.js`
func CreateUsers() {
	backendContainer := getBackendContainerName()
	if backendContainer == "" {
		log.Fatalf("Erro: O container backend não está rodando!")
	}

	cmd := exec.Command("docker", "exec", "-i", backendContainer, "node", "./scripts/create_users.js")
	cmd.Stdout = log.Writer()
	cmd.Stderr = log.Writer()

	err := cmd.Run()
	if err != nil {
		log.Fatalf("Erro ao criar usuários adicionais: %v", err)
	}
}

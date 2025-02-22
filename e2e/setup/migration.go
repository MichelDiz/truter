package setup

import (
	"log"
	"os/exec"
)

func ResetDatabase() {
	cmd := exec.Command("docker", "exec", "-i", "backend_server", "npx", "prisma", "migrate", "reset", "--force")
	cmd.Stdout = log.Writer()
	cmd.Stderr = log.Writer()

	err := cmd.Run()
	if err != nil {
		log.Fatalf("Erro ao resetar o banco de dados: %v", err)
	}
}

// RunMigrations executa `npx prisma migrate dev`
func RunMigrations() {
	backendContainer := getBackendContainerName()
	cmd := exec.Command("docker", "exec", "-i", backendContainer, "npm", "run", "migrate")
	cmd.Stdout = log.Writer()
	cmd.Stderr = log.Writer()

	err := cmd.Run()
	if err != nil {
		log.Fatalf("Erro ao rodar migrações: %v", err)
	}
}

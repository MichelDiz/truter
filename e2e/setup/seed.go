package setup

import (
	"log"
	"os/exec"
	"strings"
)

func getBackendContainerName() string {
	cmd := exec.Command("docker", "ps", "--format", "{{.Names}}")
	output, err := cmd.Output()
	if err != nil {
		log.Fatalf("Erro ao verificar containers em execução: %v", err)
	}
	containers := strings.Split(string(output), "\n")

	for _, container := range containers {
		if strings.Contains(container, "backend") {
			return strings.TrimSpace(container)
		}
	}
	log.Fatalf("Erro: Nenhum container backend encontrado!")
	return ""
}

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

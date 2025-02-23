package setup

import (
	"bytes"
	"database/sql"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"math/rand"
	"net/http"
	"os/exec"
	"strings"
	"testing"
	"time"
)

func GraphQLRequest(t *testing.T, endpoint string, gqlQuery string, variables map[string]interface{}) (int, string) {
	client := &http.Client{}

	payload := map[string]interface{}{
		"query":     gqlQuery,
		"variables": variables,
	}

	jsonQuery, err := json.Marshal(payload)
	if err != nil {
		t.Fatalf("Erro ao converter query para JSON: %v", err)
	}

	req, err := http.NewRequest("POST", endpoint, bytes.NewBuffer(jsonQuery))
	if err != nil {
		t.Fatalf("Erro ao criar requisição: %v", err)
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("x-apollo-operation-name", "TestQuery")

	resp, err := client.Do(req)
	if err != nil {
		t.Fatalf("Erro ao acessar API: %v", err)
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		t.Fatalf("Erro ao ler resposta: %v", err)
	}

	return resp.StatusCode, string(body)
}

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

func WaitForSeedData(db *sql.DB, tableName string) error {
	timeout := time.After(10 * time.Second)
	tick := time.Tick(500 * time.Millisecond)

	for {
		select {
		case <-timeout:
			return fmt.Errorf("Timeout: Nenhum dado encontrado na tabela %s após o seed", tableName)
		case <-tick:
			var count int
			err := db.QueryRow(fmt.Sprintf(`SELECT COUNT(*) FROM "%s"`, tableName)).Scan(&count)
			if err == nil && count > 0 {
				return nil
			}
		}
	}
}

func WaitForTableExists(db *sql.DB, tableName string) error {
	timeout := time.After(10 * time.Second)
	tick := time.Tick(500 * time.Millisecond)

	for {
		select {
		case <-timeout:
			return fmt.Errorf("Timeout ao esperar pela tabela %s", tableName)
		case <-tick:
			var exists bool
			err := db.QueryRow("SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = $1)", tableName).Scan(&exists)
			if err == nil && exists {
				return nil
			}
		}
	}
}

func GenerateRandomUser() (name, email, username, password string) {
	rng := rand.New(rand.NewSource(time.Now().UnixNano()))

	id := rng.Intn(1000000)

	name = fmt.Sprintf("Usuário %d", id)
	email = fmt.Sprintf("usuario%d@email.com", id)
	username = fmt.Sprintf("user%d", id)
	password = "SenhaForte!123"

	return name, email, username, password
}

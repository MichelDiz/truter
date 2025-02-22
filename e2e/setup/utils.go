package setup

import (
	"bytes"
	"encoding/json"
	"io"
	"net/http"
	"testing"
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

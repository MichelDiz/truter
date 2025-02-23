package nginx_test

import (
	"bytes"
	"net/http"
	"testing"
)

func TestNginxUp(t *testing.T) {
	resp, err := http.Get("http://nginx")
	if err != nil {
		t.Fatalf("Erro ao acessar Nginx: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != 200 {
		t.Errorf("Esperado HTTP 200, mas recebeu %d", resp.StatusCode)
	}
}

func TestPubBackend(t *testing.T) {
	client := &http.Client{}

	query := `{"query": "{ __typename }"}`

	req, err := http.NewRequest("POST", "http://nginx/graphql", bytes.NewBuffer([]byte(query)))
	if err != nil {
		t.Fatalf("Erro ao criar requisição: %v", err)
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("x-apollo-operation-name", "TestQuery")

	resp, err := client.Do(req)
	if err != nil {
		t.Fatalf("Erro ao acessar API pelo Nginx: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != 200 {
		t.Errorf("Esperado HTTP 200 da API, mas recebeu %d", resp.StatusCode)
	}
}

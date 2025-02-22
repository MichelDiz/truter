package graphql

import (
	"e2e/truter/setup"
	"testing"
)

func TestGraphQLQueries(t *testing.T) {
	endpoint := "http://backend:4000/graphql"

	tests := []struct {
		name      string
		query     string
		variables map[string]interface{}
		expected  int
	}{
		{"Test __typename", `query { __typename }`, nil, 200},
		{"Test Users", `query { users { id name } }`, nil, 200},
		{"Test Invalid Query", `query { invalidField }`, nil, 400},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			statusCode, body := setup.GraphQLRequest(t, endpoint, tt.query, tt.variables)

			if statusCode != tt.expected {
				t.Errorf("Esperado HTTP %d, mas recebeu %d. Resposta: %s", tt.expected, statusCode, body)
			}
		})
	}
}

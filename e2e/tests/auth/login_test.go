package auth_test

import (
	"e2e/truter/setup"
	"testing"
)

func TestLogin(t *testing.T) {
	endpoint := "http://backend_server:4000/graphql"

	mutation := `
		mutation Login($username: String!, $password: String!) {
			loginUser(username: $username, password: $password) {
				user {
					id
					name
					email
					role
				}
				message
				key
			}
		}
	`

	variables := map[string]interface{}{
		"username": "superadmin",
		"password": "superadminpassword",
	}

	statusCode, body := setup.GraphQLRequest(t, endpoint, mutation, variables)

	if statusCode != 200 {
		t.Errorf("Erro ao fazer login. Esperado 200, mas recebeu %d. Resposta: %s", statusCode, body)
	}
}

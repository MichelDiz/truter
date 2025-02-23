package setup

import (
	"fmt"
	"os"
)

func GetDbURL() string {
	dbHost := os.Getenv("DB_HOST")
	dbPort := os.Getenv("DB_PORT")
	dbUser := os.Getenv("DB_USER")
	dbPassword := os.Getenv("DB_PASSWORD")
	dbName := os.Getenv("DB_NAME")

	if dbHost == "" {
		dbHost = "localhost"
	}
	if dbPort == "" {
		dbPort = "5432"
	}
	if dbUser == "" {
		dbUser = "admin"
	}
	if dbPassword == "" {
		dbPassword = "secret"
	}
	if dbName == "" {
		dbName = "mydatabase"
	}

	return fmt.Sprintf("postgresql://%s:%s@%s:%s/%s?sslmode=disable",
		dbUser, dbPassword, dbHost, dbPort, dbName)
}

func GetFrontURL() string {
	URLHost := os.Getenv("DB_HOST")

	if URLHost == "" {
		URLHost = "http://localhost"
	} else {
		URLHost = "http://nginx"
	}

	return fmt.Sprint(URLHost)
}

var DbURL = GetDbURL()

var FrontURL = GetFrontURL()

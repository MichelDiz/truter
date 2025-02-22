package nginx

import (
	"bytes"
	"context"
	"net/http"
	"testing"
	"time"

	"github.com/chromedp/chromedp"
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

// Temporário - Apenas para teste manual
func TestLoginOne(t *testing.T) {
	ctx, cancel := chromedp.NewExecAllocator(
		context.Background(),
		append(chromedp.DefaultExecAllocatorOptions[:],
			chromedp.Flag("headless", true),
			chromedp.Flag("disable-gpu", true),
			chromedp.Flag("no-sandbox", true),
			chromedp.Flag("disable-dev-shm-usage", true),
			chromedp.Flag("disable-setuid-sandbox", true),
		)...,
	)
	defer cancel()

	ctx, cancel = chromedp.NewContext(ctx)
	defer cancel()

	ctx, cancel = context.WithTimeout(ctx, 15*time.Second)
	defer cancel()

	var title string
	err := chromedp.Run(ctx,
		chromedp.Navigate("https://www.google.com"),
		chromedp.Title(&title),
	)
	if err != nil {
		t.Fatalf("Erro ao abrir a página: %v", err)
	}

	if title != "Google" {
		t.Errorf("Título esperado 'Google', mas obteve '%s'", title)
	}
}

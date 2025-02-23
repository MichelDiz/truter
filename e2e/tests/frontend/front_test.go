package frontend_test

import (
	"context"
	"e2e/truter/setup"
	"e2e/truter/tests/frontend"
	"fmt"
	"testing"
	"time"

	"github.com/chromedp/chromedp"
)

var URL = setup.FrontURL

func setupChromeDP() (context.Context, context.CancelFunc) {
	opts := append(
		chromedp.DefaultExecAllocatorOptions[:],
		chromedp.NoFirstRun,
		chromedp.NoDefaultBrowserCheck,
		chromedp.Flag("disable-dev-shm-usage", true),  // Evita problemas com memória compartilhada
		chromedp.Flag("headless", true),               // Executa sem interface gráfica
		chromedp.Flag("disable-gpu", true),            // Desativa GPU para evitar erros
		chromedp.Flag("no-sandbox", true),             // Necessário para rodar como root no Docker
		chromedp.Flag("disable-setuid-sandbox", true), // Evita problemas de permissões no Docker
	)

	allocCtx, allocCancel := chromedp.NewExecAllocator(context.Background(), opts...)
	ctx, ctxCancel := chromedp.NewContext(allocCtx)
	timeoutCtx, timeoutCancel := context.WithTimeout(ctx, 30*time.Second)

	return timeoutCtx, func() {
		timeoutCancel()
		ctxCancel()
		allocCancel()
	}
}

func TestCaptureMultipleScreenshots(t *testing.T) {
	ctx, cancel := setupChromeDP()
	defer cancel()

	urls := []string{
		"http://nginx",
		"http://nginx/graphql",
		URL + "/cryptos",
	}

	for i, url := range urls {
		t.Logf("Capturando screenshot de: %s", url)

		err := chromedp.Run(ctx,
			chromedp.Navigate(url),
			chromedp.Sleep(1500*time.Millisecond),
		)
		frontend.TakeStepScreenshot(ctx, fmt.Sprintf("screenshot%d_navigate", i+1), url, t)
		if err != nil {
			t.Fatalf("Erro ao capturar screenshot %d: %v", i, err)
		}

		t.Logf("Screenshot capturado com sucesso: %s", url)
	}
}

func TestPageTitle(t *testing.T) {
	ctx, cancel := setupChromeDP()
	defer cancel()

	var title string
	err := chromedp.Run(ctx,
		chromedp.Navigate(URL),
		chromedp.Title(&title),
	)
	frontend.TakeStepScreenshot(ctx, "page_title", URL, t)
	if err != nil {
		t.Fatalf("Erro ao abrir a página: %v", err)
	}

	if title != "Truter App" {
		t.Errorf("Título esperado 'Truter App', mas obteve '%s'", title)
	}
}

// Testa a navegação pelo menu lateral
func TestNavigation(t *testing.T) {
	ctx, cancel := setupChromeDP()
	defer cancel()

	expectedURL := URL + "/users"

	var currentURL string

	// Passo 1: Navegação inicial
	err := chromedp.Run(ctx,
		chromedp.Navigate(expectedURL),
		chromedp.Sleep(500*time.Millisecond),
	)
	frontend.TakeStepScreenshot(ctx, "step1_navigate", expectedURL, t)
	if err != nil {
		t.Logf("Erro ao navegar: %v", err)
		frontend.TakeStepScreenshot(ctx, "error_navigation", expectedURL, t)
		t.Fatalf("Erro fatal durante a navegação")
	}

	// Passo 2: Clicar no link de usuários
	err = chromedp.Run(ctx,
		chromedp.Click(`a[href="/users"]`, chromedp.NodeVisible),
	)
	frontend.TakeStepScreenshot(ctx, "step2_click_users", expectedURL, t)
	if err != nil {
		t.Fatalf("Erro ao clicar: %v", err)
	}

	// Passo 3: Aguardar a presença do título
	err = chromedp.Run(ctx,
		chromedp.Sleep(500*time.Millisecond),
		chromedp.Location(&currentURL),
	)
	frontend.TakeStepScreenshot(ctx, "step3_wait_and_location", currentURL, t)
	if err != nil {
		t.Fatalf("Erro ao aguardar: %v", err)
	}

	// Passo 4: Verificação da URL
	t.Logf("URL capturada: %s", currentURL)

	if currentURL != expectedURL {
		t.Errorf("Esperava URL '%s', mas obteve '%s'", expectedURL, currentURL)
	}
	frontend.TakeStepScreenshot(ctx, "step4_verification", currentURL, t)
}

// Testa a busca por um usuário específico
func TestSearchUser(t *testing.T) {
	ctx, cancel := setupChromeDP()
	defer cancel()

	url := URL + "/users"

	t.Logf("URL: %s", url)

	var results string
	err := chromedp.Run(ctx,
		chromedp.Navigate(url),
		chromedp.Sleep(500*time.Millisecond),
	)
	frontend.TakeStepScreenshot(ctx, "search_user_step1", url, t)
	if err != nil {
		t.Fatalf("Erro ao navegar para a página: %v", err)
	}
	err = chromedp.Run(ctx,
		chromedp.Clear(`input[placeholder="Buscar usuário por nome ou email..."]`),
		chromedp.SendKeys(`input[placeholder="Buscar usuário por nome ou email..."]`, "Bob"),
		chromedp.Click(`.search-container button`, chromedp.NodeVisible),
		chromedp.Sleep(500*time.Millisecond),
		chromedp.Text(`tbody tr:first-child td:nth-child(2)`, &results),
	)
	frontend.TakeStepScreenshot(ctx, "search_user_step2", url, t)
	if err != nil {
		t.Fatalf("Erro ao buscar usuário: %v", err)
	}

	if results != "Bob" {
		t.Errorf("Esperava encontrar 'Bob', mas encontrou '%s'", results)
	}
}

// Testa o cadastro de um novo usuário
func TestRegisterUser(t *testing.T) {
	ctx, cancel := setupChromeDP()
	defer cancel()

	name, email, username, password := setup.GenerateRandomUser()
	var currentURL, successMessage string

	err := chromedp.Run(ctx,
		chromedp.Navigate(URL+"/user"),
		chromedp.Sleep(500*time.Millisecond),
		chromedp.SendKeys(`input[name="name"]`, name),
		chromedp.SendKeys(`input[name="email"]`, email),
		chromedp.SendKeys(`input[name="username"]`, username),
		chromedp.SendKeys(`input[name="password"]`, password),
	)
	frontend.TakeStepScreenshot(ctx, "register_user_step1", URL+"/user", t)
	if err != nil {
		t.Fatalf("Erro ao navegar para a página: %v", err)
	}
	err = chromedp.Run(ctx,
		chromedp.WaitEnabled(`button[type="submit"]`, chromedp.ByQuery),
		chromedp.Click(`button[type="submit"]`, chromedp.NodeVisible),
		chromedp.Sleep(500*time.Millisecond),
		chromedp.Text(`h1`, &successMessage),
		chromedp.Location(&currentURL),
	)
	frontend.TakeStepScreenshot(ctx, "register_user_step2", currentURL, t)
	if err != nil {
		t.Fatalf("Erro ao cadastrar usuário: %v", err)
	}

	if successMessage != "Cadastro realizado com sucesso!" {
		t.Errorf("Esperava mensagem 'Cadastro realizado com sucesso!', mas encontrou '%s'", successMessage)
	}
}

// Testa a busca por criptomoedas
func TestSearchCrypto(t *testing.T) {
	ctx, cancel := setupChromeDP()
	defer cancel()

	var cryptoResult string
	var retryCount = 2
	var success = false

	for i := 0; i <= retryCount; i++ {
		err := chromedp.Run(ctx,
			chromedp.Navigate(URL+"/cryptos"),
			chromedp.WaitReady(`input`, chromedp.ByQuery),
			chromedp.Clear(`input[placeholder*="Buscar cripto por ID"]`),
			chromedp.SendKeys(`input[placeholder*="Buscar cripto por ID"]`, "Bitcoin"),
		)
		if err != nil {
			t.Logf("Erro ao navegar para a página (tentativa %d/%d): %v", i+1, retryCount+1, err)
			continue
		}

		frontend.TakeStepScreenshot(ctx, fmt.Sprintf("search_crypto_step1_attempt%d", i+1), URL+"/cryptos", t)

		err = chromedp.Run(ctx,
			chromedp.Click(`.search-container button`, chromedp.NodeVisible),
			chromedp.Sleep(500*time.Millisecond),
			chromedp.Text(`tbody tr:first-child td:nth-child(2)`, &cryptoResult),
		)
		frontend.TakeStepScreenshot(ctx, fmt.Sprintf("search_crypto_step2_attempt%d", i+1), URL+"/cryptos", t)
		if err != nil {
			t.Logf("Erro ao buscar criptomoeda (tentativa %d/%d): %v", i+1, retryCount+1, err)
			continue
		}

		if cryptoResult == "Bitcoin" {
			success = true
			break
		}
	}

	if !success {
		t.Fatalf("Erro: não foi possível encontrar a criptomoeda 'Bitcoin' após %d tentativas", retryCount+1)
	}

	t.Logf("Criptomoeda encontrada: %s", cryptoResult)
}

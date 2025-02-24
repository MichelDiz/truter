package main

import (
	"encoding/json"
	"log"
	"math/rand"
	"net/http"
	"strings"
	"time"
)

type CryptoPrice struct {
	ID          string  `json:"id"`
	CoinID      string  `json:"coinId"`
	MarketCap   float64 `json:"marketCap"`
	Change24h   float64 `json:"change24h"`
	Usd         float64 `json:"usd"`
	AllTimeHigh float64 `json:"allTimeHigh"`
	AllTimeLow  float64 `json:"allTimeLow"`
	UpdatedAt   string  `json:"updatedAt"`
}

func applyRandomVariation(value float64, percentage float64) float64 {
	variation := value * percentage / 100
	return value + (rand.Float64()*variation*2 - variation)
}

func mockCryptoData(coinID string) CryptoPrice {
	switch coinID {
	case "solana":
		return CryptoPrice{
			ID:          "solana",
			CoinID:      "solana",
			MarketCap:   applyRandomVariation(12000000.0, 1), // 1% de variação
			Change24h:   applyRandomVariation(1.5, 1),
			Usd:         applyRandomVariation(153.0, 1),
			AllTimeHigh: 250.0,
			AllTimeLow:  10.0,
			UpdatedAt:   time.Now().Format(time.RFC3339),
		}
	case "ethereum":
		return CryptoPrice{
			ID:          "ethereum",
			CoinID:      "ethereum",
			MarketCap:   applyRandomVariation(500000000.0, 1),
			Change24h:   applyRandomVariation(2.1, 1),
			Usd:         applyRandomVariation(2655.02, 1),
			AllTimeHigh: 4800.0,
			AllTimeLow:  100.0,
			UpdatedAt:   time.Now().Format(time.RFC3339),
		}
	default:
		return CryptoPrice{
			ID:          coinID,
			CoinID:      coinID,
			MarketCap:   applyRandomVariation(5000000.0+float64(len(coinID))*100000, 1),
			Change24h:   applyRandomVariation(2.5+float64(len(coinID)), 1),
			Usd:         applyRandomVariation(99000.0+float64(len(coinID))*100, 1),
			AllTimeHigh: 160000.0,
			AllTimeLow:  1000.0,
			UpdatedAt:   time.Now().Format(time.RFC3339),
		}
	}
}

func mockHandler(w http.ResponseWriter, r *http.Request) {
	coinIDs := r.URL.Query().Get("ids")
	if coinIDs == "" {
		coinIDs = "bitcoin"
	}

	ids := strings.Split(coinIDs, ",")
	data := map[string]CryptoPrice{}

	for _, id := range ids {
		data[id] = mockCryptoData(id)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(data)
}

func main() {
	http.HandleFunc("/api/v3/simple/price", mockHandler)

	port := ":8082"
	log.Printf("Mock CoinGecko API rodando em http://localhost%s\n", port)
	log.Fatal(http.ListenAndServe(port, nil))
}

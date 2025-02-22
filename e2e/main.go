package main

import (
	"context"
	"fmt"

	"github.com/chromedp/chromedp"
)

func main() {
	ctx, cancel := chromedp.NewContext(context.Background())
	defer cancel()

	var title string
	err := chromedp.Run(ctx,
		chromedp.Navigate("https://www.google.com"),
		chromedp.Title(&title),
	)
	if err != nil {
		fmt.Println("Erro:", err)
		return
	}

	fmt.Println("Título da página:", title)
}

package frontend

import (
	"bytes"
	"context"
	"fmt"
	"image"
	"image/color"
	"image/draw"
	"image/png"
	"log"
	"os"
	"testing"

	"github.com/chromedp/chromedp"
	"golang.org/x/image/font"
	"golang.org/x/image/font/basicfont"
	"golang.org/x/image/math/fixed"
)

func TakeStepScreenshot(ctx context.Context, stepName string, url string, t *testing.T) {
	var buf []byte
	err := chromedp.Run(ctx, chromedp.CaptureScreenshot(&buf))
	if err != nil {
		log.Printf("Erro ao capturar screenshot no passo '%s': %v", stepName, err)
		return
	}

	finalBuf, err := addTextToImage(buf, url)
	if err != nil {
		t.Fatalf("Erro ao adicionar texto ao screenshot: %v", err)
	}

	testDir := t.Name()
	err = os.MkdirAll("results/"+testDir, os.ModePerm)
	if err != nil {
		t.Fatalf("Erro ao criar diretório '%s': %v", testDir, err)
	}

	filename := fmt.Sprintf("results/%s/%s.png", testDir, stepName)
	err = os.WriteFile(filename, finalBuf, 0644)
	if err != nil {
		log.Printf("Erro ao salvar screenshot no passo '%s': %v", stepName, err)
		return
	}
	log.Printf("Screenshot capturado no passo '%s': %s", stepName, filename)
}

func addTextToImage(buf []byte, url string) ([]byte, error) {
	img, err := png.Decode(bytes.NewReader(buf))
	if err != nil {
		return nil, err
	}

	newImg := image.NewRGBA(image.Rect(0, 0, img.Bounds().Dx(), img.Bounds().Dy()+30))
	draw.Draw(newImg, img.Bounds(), img, image.Point{}, draw.Src)

	addLabel(newImg, 10, 20, url)

	var finalBuf bytes.Buffer
	err = png.Encode(&finalBuf, newImg)
	if err != nil {
		return nil, err
	}

	return finalBuf.Bytes(), nil
}

func addLabel(img *image.RGBA, x, y int, label string) {
	col := color.RGBA{255, 255, 255, 255}

	point := fixed.Point26_6{X: fixed.Int26_6(x * 64), Y: fixed.Int26_6(y * 64)}
	d := &font.Drawer{
		Dst:  img,
		Src:  image.NewUniform(col),
		Face: basicfont.Face7x13,
		Dot:  point,
	}
	d.DrawString(label)
}

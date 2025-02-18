export function formatMarketCap(value: number): string {
    if (value >= 1e12) {
      return `U$ ${(value / 1e12).toFixed(2)} T`; // Trilhões
    } else if (value >= 1e9) {
      return `U$ ${(value / 1e9).toFixed(2)} Bi`; // Bilhões
    } else if (value >= 1e6) {
      return `U$ ${(value / 1e6).toFixed(2)} Mi`; // Milhões
    }
    return `U$ ${value.toLocaleString("en-US", { minimumFractionDigits: 2 })}`; // Valor normal formatado
  }

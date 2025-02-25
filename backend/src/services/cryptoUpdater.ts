import * as cron from 'node-cron';
import prisma from '../config/db';
import axios from 'axios';

const COINS: string[] = ['bitcoin', 'ethereum', 'solana'];
// const COINGECKO_API: string = 'https://api.coingecko.com/api/v3/simple/price';
const COINGECKO_API: string = 'http://coingecko:8082/api/v3/simple/price';

interface CryptoData {
  usd: number;
  usd_market_cap: number;
  usd_24h_change: number;
}

const fetchPrices = async (): Promise<Record<string, CryptoData> | null> => {
  try {
    const { data } = await axios.get<Record<string, CryptoData>>(
      `${COINGECKO_API}?ids=${COINS.join(',')}&vs_currencies=usd&include_market_cap=true&include_24hr_change=true`
    );
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(`Erro ao buscar preços da API CoinGecko: ${error.message}`);
      if (error.code) console.error(`Código do erro: ${error.code}`);
      if (error.response) {
        console.error(`Status HTTP: ${error.response.status}`);
      }
    } else {
      console.error("Erro inesperado:", error);
    }
    return null;
  }
};

const updatePrices = async (): Promise<void> => {
  console.log("Atualizando preços...");
  let data: Record<string, CryptoData> | null = null;
  let attempts = 0;

  while (!data) {
    data = await fetchPrices();
    attempts++;
    if (!data) {
      console.error(`Tentativa ${attempts} falhou. Retentando...`);
      await new Promise((resolve) => setTimeout(resolve, 10000)); // Aguarda 10 segundos antes de tentar novamente
    }
  }

  for (const coinId of COINS) {
    await prisma.cryptoPrice.upsert({
      where: { coinId },
      update: {
        marketCap: data[coinId]?.usd_market_cap ?? 0,
        change24h: data[coinId]?.usd_24h_change ?? 0,
        currentPrice: data[coinId]?.usd ?? 0,
        updatedAt: new Date(),
      },
      create: {
        coinId,
        marketCap: data[coinId]?.usd_market_cap ?? 0,
        change24h: data[coinId]?.usd_24h_change ?? 0,
        currentPrice: data[coinId]?.usd ?? 0,
      },
    });
  }
};

// Roda 1 vez no início.
updatePrices();

// Rodar a cada 1 minuto
cron.schedule('* * * * *', updatePrices);

export default updatePrices;

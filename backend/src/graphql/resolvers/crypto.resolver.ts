import axios from 'axios';
import prisma from '../../config/db';

const COINGECKO_API = 'https://api.coingecko.com/api/v3/simple/price';

export const cryptoResolvers = {
  Query: {
    cryptoPrices: async () => {
      try {

        const prices = await prisma.cryptoPrice.findMany();

        if (!prices || prices.length === 0) {
          console.warn("Nenhum dado encontrado no banco!");
          return [];
        }

        return prices;
      } catch (error) {
        console.error("Erro ao buscar preços no banco:", error);
        throw new Error("Erro ao buscar dados de preços das criptomoedas.");
      }
    },
    liveCryptoPrice: async (_: any, { coinId }: { coinId: string }) => {
      try {

        const { data } = await axios.get(`${COINGECKO_API}?ids=${coinId}&vs_currencies=usd&include_market_cap=true&include_24hr_change=true`);

        if (!data[coinId]) {
          console.error(`Coin "${coinId}" not found on CoinGecko`);
          throw new Error(`Coin "${coinId}" not found on CoinGecko`);
        }

        return {
          id: coinId,
          coinId,
          marketCap: data[coinId].usd_market_cap || 0,
          change24h: data[coinId].usd_24h_change || 0,
          currentPrice: data[coinId].usd || 0,
          allTimeHigh: null,  // Adicionei esses valores como null por enquanto
          allTimeLow: null,   // pois a API não os fornece diretamente.
          updatedAt: new Date().toISOString(),
        };
      } catch (error) {
        console.error("Error fetching data from CoinGecko:", error);
        throw new Error("Failed to fetch live crypto data");
      }
    },
  },
  Mutation: {
    updateCryptoPrice: async (_: any, { coinId }: { coinId: string }) => {
      const { data } = await axios.get(`${COINGECKO_API}?ids=${coinId}&vs_currencies=usd&include_market_cap=true&include_24hr_change=true`);

      return await prisma.cryptoPrice.upsert({
        where: { coinId },
        update: {
          marketCap: data[coinId].usd_market_cap,
          change24h: data[coinId].usd_24h_change,
          currentPrice: data[coinId].usd,
          updatedAt: new Date(),
        },
        create: {
          coinId,
          marketCap: data[coinId].usd_market_cap,
          change24h: data[coinId].usd_24h_change,
          currentPrice: data[coinId].usd,
        },
      });
    },
  },
};

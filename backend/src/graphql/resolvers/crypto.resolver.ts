import axios from 'axios';
import prisma from '../../config/db';

const COINGECKO_API = 'https://api.coingecko.com/api/v3/simple/price';

interface CryptoPrice {
  id: string;
  coinId: string;
  marketCap: number | null;
  change24h: number | null;
  currentPrice: number;
  allTimeHigh: number | null;
  allTimeLow: number | null;
  updatedAt: Date;
}

export const cryptoResolvers = {
  Query: {
    cryptoPrices: async (): Promise<CryptoPrice[]> => {
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

    cryptoById: async (_: unknown, { id }: { id: string }): Promise<CryptoPrice | null> => {
      return await prisma.cryptoPrice.findUnique({ where: { id } });
    },

    cryptoByCoinId: async (_: unknown, { coinId }: { coinId: string }): Promise<CryptoPrice | null> => {
      return await prisma.cryptoPrice.findUnique({ where: { coinId } });
    },

    cryptosAboveMarketCap: async (_: unknown, { minMarketCap }: { minMarketCap: number }): Promise<CryptoPrice[]> => {
      return await prisma.cryptoPrice.findMany({
        where: {
          marketCap: {
            gt: minMarketCap,
          },
        },
      });
    },

    cryptosWithPriceRange: async (_: unknown, { minPrice, maxPrice }: { minPrice: number; maxPrice: number }): Promise<CryptoPrice[]> => {
      return await prisma.cryptoPrice.findMany({
        where: {
          currentPrice: {
            gte: minPrice,
            lte: maxPrice,
          },
        },
      });
    },

    liveCryptoPrice: async (_: unknown, { coinId }: { coinId: string }): Promise<CryptoPrice> => {
      try {
        console.log(`Fetching live data for "${coinId}"`);
        const { data } = await axios.get(`${COINGECKO_API}?ids=${coinId}&vs_currencies=usd&include_market_cap=true&include_24hr_change=true`);
        if (!data[coinId]) {
          console.error(`Coin "${coinId}" not found on CoinGecko`);
          // throw new Error(`Coin "${coinId}" not found on CoinGecko`);
        }

        return {
          id: coinId,
          coinId,
          marketCap: data[coinId].usd_market_cap || 0,
          change24h: data[coinId].usd_24h_change || 0,
          currentPrice: data[coinId].usd || 0,
          allTimeHigh: null,  // Adicionei esses valores como null por enquanto
          allTimeLow: null,   // pois a API não os fornece diretamente.
          updatedAt: new Date(),
        };
      } catch (error) {
        console.error("Error fetching data from CoinGecko:", error);
        throw new Error("Failed to fetch live crypto data");
      }
    },
  },

  Mutation: {
    updateCryptoPrice: async (_: unknown, { coinId }: { coinId: string }): Promise<CryptoPrice> => {
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
          allTimeHigh: null,
          allTimeLow: null,
          updatedAt: new Date(),
        },
      });
    },
  },
};

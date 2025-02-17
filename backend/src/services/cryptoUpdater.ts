import cron from 'node-cron';
import prisma from '../config/db';
import axios from 'axios';

const COINS = ['bitcoin', 'ethereum', 'solana'];
const COINGECKO_API = 'https://api.coingecko.com/api/v3/simple/price';

const updatePrices = async () => {
  console.log("Atualizando preços...");
  
  const { data } = await axios.get(`${COINGECKO_API}?ids=${COINS.join(',')}&vs_currencies=usd&include_market_cap=true&include_24hr_change=true`);
  
  for (const coinId of COINS) {
    await prisma.cryptoPrice.upsert({
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
  }
};

// Rodar a cada 1 minuto
cron.schedule('* * * * *', updatePrices);

export default updatePrices;

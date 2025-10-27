export interface Currency {
  symbol: string;
  name: string;
  icon: string;
  type: 'crypto' | 'fiat';
  category?: string;
}

export const currencies: Currency[] = [
  // Major Cryptocurrencies
  { symbol: 'BTC', name: 'Bitcoin', icon: '₿', type: 'crypto', category: 'major' },
  { symbol: 'ETH', name: 'Ethereum', icon: 'Ξ', type: 'crypto', category: 'major' },
  { symbol: 'USDT', name: 'Tether', icon: '₮', type: 'crypto', category: 'stablecoin' },
  { symbol: 'USDC', name: 'USD Coin', icon: '💵', type: 'crypto', category: 'stablecoin' },
  { symbol: 'BNB', name: 'Binance Coin', icon: '🔶', type: 'crypto', category: 'major' },
  
  // Popular Altcoins
  { symbol: 'SOL', name: 'Solana', icon: '◎', type: 'crypto', category: 'altcoin' },
  { symbol: 'XRP', name: 'Ripple', icon: '✕', type: 'crypto', category: 'altcoin' },
  { symbol: 'ADA', name: 'Cardano', icon: '₳', type: 'crypto', category: 'altcoin' },
  { symbol: 'AVAX', name: 'Avalanche', icon: '🔺', type: 'crypto', category: 'altcoin' },
  { symbol: 'DOT', name: 'Polkadot', icon: '⬤', type: 'crypto', category: 'altcoin' },
  { symbol: 'MATIC', name: 'Polygon', icon: '⬡', type: 'crypto', category: 'altcoin' },
  { symbol: 'LINK', name: 'Chainlink', icon: '🔗', type: 'crypto', category: 'altcoin' },
  { symbol: 'UNI', name: 'Uniswap', icon: '🦄', type: 'crypto', category: 'defi' },
  { symbol: 'ATOM', name: 'Cosmos', icon: '⚛', type: 'crypto', category: 'altcoin' },
  { symbol: 'LTC', name: 'Litecoin', icon: 'Ł', type: 'crypto', category: 'altcoin' },
  
  // DeFi & New Coins
  { symbol: 'AAVE', name: 'Aave', icon: '👻', type: 'crypto', category: 'defi' },
  { symbol: 'SUSHI', name: 'SushiSwap', icon: '🍣', type: 'crypto', category: 'defi' },
  { symbol: 'CRV', name: 'Curve', icon: '🌀', type: 'crypto', category: 'defi' },
  { symbol: 'APT', name: 'Aptos', icon: '🅰', type: 'crypto', category: 'new' },
  { symbol: 'ARB', name: 'Arbitrum', icon: '🔵', type: 'crypto', category: 'new' },
  { symbol: 'OP', name: 'Optimism', icon: '🔴', type: 'crypto', category: 'new' },
  
  // Stablecoins
  { symbol: 'DAI', name: 'Dai', icon: '◈', type: 'crypto', category: 'stablecoin' },
  { symbol: 'BUSD', name: 'Binance USD', icon: '💲', type: 'crypto', category: 'stablecoin' },
  
  // Fiat Currencies
  { symbol: 'USD', name: 'US Dollar', icon: '$', type: 'fiat' },
  { symbol: 'EUR', name: 'Euro', icon: '€', type: 'fiat' },
  { symbol: 'RUB', name: 'Russian Ruble', icon: '₽', type: 'fiat' },
  { symbol: 'GBP', name: 'British Pound', icon: '£', type: 'fiat' },
  { symbol: 'JPY', name: 'Japanese Yen', icon: '¥', type: 'fiat' },
  { symbol: 'CNY', name: 'Chinese Yuan', icon: '¥', type: 'fiat' },
  { symbol: 'KRW', name: 'South Korean Won', icon: '₩', type: 'fiat' },
  { symbol: 'TRY', name: 'Turkish Lira', icon: '₺', type: 'fiat' },
  { symbol: 'UAH', name: 'Ukrainian Hryvnia', icon: '₴', type: 'fiat' },
  { symbol: 'PLN', name: 'Polish Zloty', icon: 'zł', type: 'fiat' },
];

export const getCurrenciesByType = (type: 'crypto' | 'fiat') => {
  return currencies.filter(c => c.type === type);
};

export const getCurrenciesByCategory = (category: string) => {
  return currencies.filter(c => c.category === category);
};

export const searchCurrencies = (query: string) => {
  const lowerQuery = query.toLowerCase();
  return currencies.filter(
    c => c.symbol.toLowerCase().includes(lowerQuery) || 
         c.name.toLowerCase().includes(lowerQuery)
  );
};

import { useState, useEffect } from 'react';
import { currencies } from '@/data/currencies';

interface CryptoRate {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
}

export const useExchangeCalculator = () => {
  const [fromAmount, setFromAmount] = useState('1');
  const [fromCrypto, setFromCrypto] = useState('BTC');
  const [toCrypto, setToCrypto] = useState('USDT');
  const [toAmount, setToAmount] = useState('0');
  const [rates, setRates] = useState<CryptoRate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRates();
  }, []);

  useEffect(() => {
    calculateExchange();
  }, [fromAmount, fromCrypto, toCrypto, rates]);

  const fetchRates = async () => {
    try {
      const cryptoSymbols = currencies.filter(c => c.type === 'crypto').map(c => c.symbol).join(',');
      const fiatSymbols = currencies.filter(c => c.type === 'fiat').map(c => c.symbol).join(',');
      
      const response = await fetch(
        `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${cryptoSymbols}&tsyms=${fiatSymbols}`
      );
      const data = await response.json();
      
      const ratesData: CryptoRate[] = currencies
        .filter(c => c.type === 'crypto')
        .map(crypto => ({
          symbol: crypto.symbol,
          name: crypto.name,
          price: data.RAW?.[crypto.symbol]?.USD?.PRICE || 0,
          change24h: data.RAW?.[crypto.symbol]?.USD?.CHANGEPCT24HOUR || 0,
        }));
      
      setRates(ratesData);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch rates:', error);
      setLoading(false);
    }
  };

  const calculateExchange = () => {
    if (!fromAmount || isNaN(Number(fromAmount)) || rates.length === 0) {
      setToAmount('0');
      return;
    }

    const fromRate = rates.find(r => r.symbol === fromCrypto);
    const toRate = rates.find(r => r.symbol === toCrypto);

    if (fromRate && toRate) {
      const fromValueUSD = Number(fromAmount) * fromRate.price;
      const toValue = fromValueUSD / toRate.price;
      setToAmount(toValue.toFixed(6));
    }
  };

  const handleSwap = () => {
    const tempCrypto = fromCrypto;
    setFromCrypto(toCrypto);
    setToCrypto(tempCrypto);
  };

  return {
    fromAmount,
    fromCrypto,
    toCrypto,
    toAmount,
    rates,
    loading,
    setFromAmount,
    setFromCrypto,
    setToCrypto,
    handleSwap,
  };
};

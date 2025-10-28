import { getCurrenciesByType } from '@/data/currencies';
import { useAuth } from '@/contexts/AuthContext';
import { useExchangeCalculator } from '@/hooks/useExchangeCalculator';
import { useExchangeSubmit } from '@/hooks/useExchangeSubmit';
import Header from '@/components/home/Header';
import HeroSection from '@/components/home/HeroSection';
import ExchangeCalculator from '@/components/home/ExchangeCalculator';
import CryptoRatesSection from '@/components/home/CryptoRatesSection';
import FeaturesSection from '@/components/home/FeaturesSection';
import FAQSection from '@/components/home/FAQSection';
import Footer from '@/components/home/Footer';

const Index = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  
  const {
    fromAmount,
    fromCrypto,
    toCrypto,
    toAmount,
    rates,
    loading,
    exchangeRate,
    setFromAmount,
    setFromCrypto,
    setToCrypto,
    handleSwap,
  } = useExchangeCalculator();

  const displayCryptos = getCurrenciesByType('crypto').filter(c => 
    ['BTC', 'ETH', 'USDT', 'BNB', 'SOL', 'XRP', 'ADA', 'AVAX', 'DOT', 'MATIC', 'LINK', 'UNI'].includes(c.symbol)
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header 
        isAuthenticated={isAuthenticated}
        isAdmin={isAdmin}
      />

      <HeroSection />

      <ExchangeCalculator
        fromAmount={fromAmount}
        fromCrypto={fromCrypto}
        toCrypto={toCrypto}
        toAmount={toAmount}
        exchangeRate={exchangeRate}
        onFromAmountChange={setFromAmount}
        onFromCryptoChange={setFromCrypto}
        onToCryptoChange={setToCrypto}
        onSwap={handleSwap}
      />

      <CryptoRatesSection
        displayCryptos={displayCryptos}
        rates={rates}
        loading={loading}
      />

      <FeaturesSection />

      <FAQSection />

      <Footer />
    </div>
  );
};

export default Index;
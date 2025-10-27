import { getCurrenciesByType } from '@/data/currencies';
import { useAuth } from '@/contexts/AuthContext';
import { useExchangeCalculator } from '@/hooks/useExchangeCalculator';
import { useExchangeSubmit } from '@/hooks/useExchangeSubmit';
import { useAdminLogin } from '@/hooks/useAdminLogin';
import Header from '@/components/home/Header';
import HeroSection from '@/components/home/HeroSection';
import ExchangeCalculator from '@/components/home/ExchangeCalculator';
import CryptoRatesSection from '@/components/home/CryptoRatesSection';
import FeaturesSection from '@/components/home/FeaturesSection';
import FAQSection from '@/components/home/FAQSection';
import Footer from '@/components/home/Footer';
import AdminLoginModal from '@/components/home/AdminLoginModal';

const Index = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  
  const {
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
  } = useExchangeCalculator();

  const { handleExchange: submitExchange } = useExchangeSubmit();

  const {
    showAdminLogin,
    adminEmail,
    adminPassword,
    setShowAdminLogin,
    setAdminEmail,
    setAdminPassword,
    handleAdminLogin,
  } = useAdminLogin();

  const displayCryptos = getCurrenciesByType('crypto').filter(c => 
    ['BTC', 'ETH', 'USDT', 'BNB', 'SOL', 'XRP', 'ADA', 'AVAX', 'DOT', 'MATIC', 'LINK', 'UNI'].includes(c.symbol)
  );

  const handleExchange = () => {
    submitExchange({
      fromCrypto,
      toCrypto,
      fromAmount,
      toAmount,
      rates,
      isAuthenticated,
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header 
        isAuthenticated={isAuthenticated}
        isAdmin={isAdmin}
        onAdminLoginClick={() => setShowAdminLogin(true)}
      />

      <HeroSection />

      <ExchangeCalculator
        fromAmount={fromAmount}
        fromCrypto={fromCrypto}
        toCrypto={toCrypto}
        toAmount={toAmount}
        onFromAmountChange={setFromAmount}
        onFromCryptoChange={setFromCrypto}
        onToCryptoChange={setToCrypto}
        onSwap={handleSwap}
        onExchange={handleExchange}
      />

      <CryptoRatesSection
        displayCryptos={displayCryptos}
        rates={rates}
        loading={loading}
      />

      <FeaturesSection />

      <FAQSection />

      <Footer />

      <AdminLoginModal
        open={showAdminLogin}
        onOpenChange={setShowAdminLogin}
        email={adminEmail}
        password={adminPassword}
        onEmailChange={setAdminEmail}
        onPasswordChange={setAdminPassword}
        onSubmit={handleAdminLogin}
      />
    </div>
  );
};

export default Index;

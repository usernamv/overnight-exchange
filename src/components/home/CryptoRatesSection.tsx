import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Icon from "@/components/ui/icon";
import { currencies } from "@/data/currencies";

interface CryptoRate {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
}

interface Currency {
  symbol: string;
  name: string;
  icon: string;
}

interface CryptoRatesSectionProps {
  displayCryptos: Currency[];
}

const CryptoRatesSection = ({ displayCryptos }: CryptoRatesSectionProps) => {
  const [rates, setRates] = useState<CryptoRate[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRates = async () => {
    try {
      const cryptoSymbols = currencies
        .filter((c) => c.type === "crypto")
        .map((c) => c.symbol)
        .join(",");
      const fiatSymbols = currencies
        .filter((c) => c.type === "fiat")
        .map((c) => c.symbol)
        .join(",");

      const response = await fetch(
        `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${cryptoSymbols}&tsyms=${fiatSymbols}`,
      );
      const data = await response.json();

      const ratesData: CryptoRate[] = currencies
        .filter((c) => c.type === "crypto")
        .map((crypto) => ({
          symbol: crypto.symbol,
          name: crypto.name,
          price: data.RAW?.[crypto.symbol]?.USD?.PRICE || 0,
          change24h: data.RAW?.[crypto.symbol]?.USD?.CHANGEPCT24HOUR || 0,
        }));

      setRates(ratesData);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch rates:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRates();
    return () => clearInterval(interval);
  }, []);
  if (loading) {
    return (
      <section id="rates" className="container mx-auto px-4 py-16">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Загрузка курсов...</p>
        </div>
      </section>
    );
  }

  return (
    <section id="rates" className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-4">Актуальные курсы</h2>
        <p className="text-muted-foreground">Реальные цены с ведущих бирж</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-w-7xl mx-auto">
        {displayCryptos.map((crypto) => {
          const rate = rates.find((r) => r.symbol === crypto.symbol);
          if (!rate) return null;

          return (
            <Card
              key={crypto.symbol}
              className="p-6 bg-card/50 backdrop-blur-sm border-border/40 hover:border-primary/50 transition-all cursor-pointer"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-xl">{crypto.icon}</span>
                  </div>
                  <div>
                    <p className="font-bold">{crypto.symbol}</p>
                    <p className="text-xs text-muted-foreground">
                      {crypto.name}
                    </p>
                  </div>
                </div>
                <Badge
                  variant={rate.change24h >= 0 ? "default" : "destructive"}
                  className={
                    rate.change24h >= 0
                      ? "bg-green-500/20 text-green-400"
                      : "bg-red-500/20 text-red-400"
                  }
                >
                  {rate.change24h >= 0 ? "+" : ""}
                  {rate.change24h.toFixed(2)}%
                </Badge>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold">
                  $
                  {rate.price.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
                <p className="text-xs text-muted-foreground">
                  за 1 {crypto.symbol}
                </p>
              </div>
            </Card>
          );
        })}
      </div>
    </section>
  );
};

export default CryptoRatesSection;

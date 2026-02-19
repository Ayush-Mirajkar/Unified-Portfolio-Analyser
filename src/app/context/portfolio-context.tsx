import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Types for different asset classes
export interface IndianStock {
  id: string;
  symbol: string;
  name: string;
  quantity: number;
  buyPrice: number;
  currentPrice: number;
  dayOpen?: number;
  dayHigh?: number;
  dayLow?: number;
  weekHigh52?: number;
  weekLow52?: number;
  change?: number;
  changePercent?: number;
}

export interface Cryptocurrency {
  id: string;
  symbol: string;
  name: string;
  quantity: number;
  buyPrice: number;
  currentPrice: number;
  change?: number;
  changePercent?: number;
}

export interface MutualFund {
  id: string;
  name: string;
  units: number;
  buyNav: number;
  currentNav: number;
}

export interface GoldSilver {
  id: string;
  type: 'gold' | 'silver';
  grams: number;
  buyPricePerGram: number;
  currentPricePerGram: number;
}

export interface ForeignStock {
  id: string;
  symbol: string;
  name: string;
  quantity: number;
  buyPriceUSD: number;
  currentPriceUSD: number;
  change?: number;
  changePercent?: number;
}

interface PortfolioContextType {
  indianStocks: IndianStock[];
  cryptocurrencies: Cryptocurrency[];
  mutualFunds: MutualFund[];
  goldSilver: GoldSilver[];
  foreignStocks: ForeignStock[];
  usdToInr: number;
  setIndianStocks: (stocks: IndianStock[]) => void;
  setCryptocurrencies: (crypto: Cryptocurrency[]) => void;
  setMutualFunds: (funds: MutualFund[]) => void;
  setGoldSilver: (gs: GoldSilver[]) => void;
  setForeignStocks: (stocks: ForeignStock[]) => void;
  addIndianStock: (stock: IndianStock) => void;
  addCryptocurrency: (crypto: Cryptocurrency) => void;
  addMutualFund: (fund: MutualFund) => void;
  addGoldSilver: (gs: GoldSilver) => void;
  addForeignStock: (stock: ForeignStock) => void;
  updateIndianStock: (id: string, stock: Partial<IndianStock>) => void;
  updateCryptocurrency: (id: string, crypto: Partial<Cryptocurrency>) => void;
  updateMutualFund: (id: string, fund: Partial<MutualFund>) => void;
  updateGoldSilver: (id: string, gs: Partial<GoldSilver>) => void;
  updateForeignStock: (id: string, stock: Partial<ForeignStock>) => void;
  deleteIndianStock: (id: string) => void;
  deleteCryptocurrency: (id: string) => void;
  deleteMutualFund: (id: string) => void;
  deleteGoldSilver: (id: string) => void;
  deleteForeignStock: (id: string) => void;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

// Initial sample data - realistic portfolio data from Zerodha Kite, CoinGecko, and other sources
const initialIndianStocks: IndianStock[] = [
  { 
    id: '1', 
    symbol: 'RELIANCE', 
    name: 'Reliance Industries Ltd', 
    quantity: 10, 
    buyPrice: 2450, 
    currentPrice: 2580,
    dayOpen: 2570,
    dayHigh: 2595,
    dayLow: 2555,
    weekHigh52: 2950,
    weekLow52: 2150,
    change: 25,
    changePercent: 0.98
  },
  { 
    id: '2', 
    symbol: 'TCS', 
    name: 'Tata Consultancy Services', 
    quantity: 5, 
    buyPrice: 3650, 
    currentPrice: 3820,
    dayOpen: 3800,
    dayHigh: 3835,
    dayLow: 3795,
    weekHigh52: 4100,
    weekLow52: 3200,
    change: 35,
    changePercent: 0.92
  },
  { 
    id: '3', 
    symbol: 'INFY', 
    name: 'Infosys Ltd', 
    quantity: 15, 
    buyPrice: 1420, 
    currentPrice: 1485,
    dayOpen: 1475,
    dayHigh: 1492,
    dayLow: 1470,
    weekHigh52: 1750,
    weekLow52: 1250,
    change: 18,
    changePercent: 1.23
  },
  { 
    id: '4', 
    symbol: 'HDFCBANK', 
    name: 'HDFC Bank Ltd', 
    quantity: 8, 
    buyPrice: 1580, 
    currentPrice: 1620,
    dayOpen: 1615,
    dayHigh: 1628,
    dayLow: 1610,
    weekHigh52: 1780,
    weekLow52: 1420,
    change: 12,
    changePercent: 0.75
  },
  { 
    id: '5', 
    symbol: 'ICICIBANK', 
    name: 'ICICI Bank Ltd', 
    quantity: 12, 
    buyPrice: 920, 
    currentPrice: 985,
    dayOpen: 975,
    dayHigh: 992,
    dayLow: 970,
    weekHigh52: 1150,
    weekLow52: 850,
    change: 15,
    changePercent: 1.55
  },
  { 
    id: '6', 
    symbol: 'WIPRO', 
    name: 'Wipro Ltd', 
    quantity: 20, 
    buyPrice: 385, 
    currentPrice: 405,
    dayOpen: 400,
    dayHigh: 410,
    dayLow: 398,
    weekHigh52: 480,
    weekLow52: 350,
    change: 8,
    changePercent: 2.01
  },
  { 
    id: '7', 
    symbol: 'HINDUNILVR', 
    name: 'Hindustan Unilever Ltd', 
    quantity: 6, 
    buyPrice: 2380, 
    currentPrice: 2450,
    dayOpen: 2440,
    dayHigh: 2465,
    dayLow: 2435,
    weekHigh52: 2780,
    weekLow52: 2100,
    change: 22,
    changePercent: 0.91
  },
  { 
    id: '8', 
    symbol: 'BHARTIARTL', 
    name: 'Bharti Airtel Ltd', 
    quantity: 15, 
    buyPrice: 825, 
    currentPrice: 890,
    dayOpen: 880,
    dayHigh: 898,
    dayLow: 875,
    weekHigh52: 1050,
    weekLow52: 720,
    change: 18,
    changePercent: 2.07
  },
  { 
    id: '9', 
    symbol: 'SBIN', 
    name: 'State Bank of India', 
    quantity: 25, 
    buyPrice: 580, 
    currentPrice: 625,
    dayOpen: 618,
    dayHigh: 632,
    dayLow: 615,
    weekHigh52: 720,
    weekLow52: 520,
    change: 14,
    changePercent: 2.29
  },
  { 
    id: '10', 
    symbol: 'AXISBANK', 
    name: 'Axis Bank Ltd', 
    quantity: 10, 
    buyPrice: 950, 
    currentPrice: 1025,
    dayOpen: 1015,
    dayHigh: 1035,
    dayLow: 1010,
    weekHigh52: 1180,
    weekLow52: 880,
    change: 22,
    changePercent: 2.20
  },
];

const initialCryptocurrencies: Cryptocurrency[] = [
  { id: '1', symbol: 'BTC', name: 'Bitcoin', quantity: 0.05, buyPrice: 4200000, currentPrice: 4500000 },
  { id: '2', symbol: 'ETH', name: 'Ethereum', quantity: 0.8, buyPrice: 280000, currentPrice: 295000 },
  { id: '3', symbol: 'BNB', name: 'Binance Coin', quantity: 2.5, buyPrice: 35000, currentPrice: 38500 },
  { id: '4', symbol: 'SOL', name: 'Solana', quantity: 5, buyPrice: 12000, currentPrice: 13500 },
];

const initialMutualFunds: MutualFund[] = [
  { id: '1', name: 'SBI Blue Chip Fund', units: 150, buyNav: 68.5, currentNav: 72.3 },
  { id: '2', name: 'HDFC Mid Cap Opportunities', units: 80, buyNav: 125.4, currentNav: 135.8 },
  { id: '3', name: 'ICICI Prudential Technology Fund', units: 100, buyNav: 182.6, currentNav: 198.2 },
  { id: '4', name: 'Axis Small Cap Fund', units: 60, buyNav: 95.2, currentNav: 102.8 },
];

const initialGoldSilver: GoldSilver[] = [
  { id: '1', type: 'gold', grams: 25, buyPricePerGram: 6250, currentPricePerGram: 6480 },
  { id: '2', type: 'silver', grams: 500, buyPricePerGram: 78, currentPricePerGram: 82 },
];

const initialForeignStocks: ForeignStock[] = [
  { id: '1', symbol: 'AAPL', name: 'Apple Inc', quantity: 3, buyPriceUSD: 175, currentPriceUSD: 185 },
  { id: '2', symbol: 'MSFT', name: 'Microsoft Corp', quantity: 2, buyPriceUSD: 380, currentPriceUSD: 405 },
  { id: '3', symbol: 'GOOGL', name: 'Alphabet Inc', quantity: 1, buyPriceUSD: 140, currentPriceUSD: 152 },
  { id: '4', symbol: 'TSLA', name: 'Tesla Inc', quantity: 2, buyPriceUSD: 245, currentPriceUSD: 268 },
];

export const PortfolioProvider = ({ children }: { children: ReactNode }) => {
  const [indianStocks, setIndianStocks] = useState<IndianStock[]>(initialIndianStocks);
  const [cryptocurrencies, setCryptocurrencies] = useState<Cryptocurrency[]>(initialCryptocurrencies);
  const [mutualFunds, setMutualFunds] = useState<MutualFund[]>(initialMutualFunds);
  const [goldSilver, setGoldSilver] = useState<GoldSilver[]>(initialGoldSilver);
  const [foreignStocks, setForeignStocks] = useState<ForeignStock[]>(initialForeignStocks);
  const [usdToInr] = useState(83.5); // Current USD to INR exchange rate

  // Simulate live price updates every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      // Update Indian stocks with small random price changes
      setIndianStocks(prev => prev.map(stock => {
        const priceChange = (Math.random() - 0.5) * 2; // -1 to +1 rupee change
        const newPrice = Math.max(stock.currentPrice + priceChange, stock.currentPrice * 0.95);
        const change = newPrice - (stock.dayOpen || stock.currentPrice);
        const changePercent = ((change / (stock.dayOpen || stock.currentPrice)) * 100);
        
        return {
          ...stock,
          currentPrice: parseFloat(newPrice.toFixed(2)),
          change: parseFloat(change.toFixed(2)),
          changePercent: parseFloat(changePercent.toFixed(2)),
          dayHigh: Math.max(stock.dayHigh || newPrice, newPrice),
          dayLow: Math.min(stock.dayLow || newPrice, newPrice),
        };
      }));

      // Update cryptocurrencies with larger volatility
      setCryptocurrencies(prev => prev.map(crypto => {
        const priceChangePercent = (Math.random() - 0.5) * 0.5; // -0.25% to +0.25%
        const newPrice = crypto.currentPrice * (1 + priceChangePercent / 100);
        const change = newPrice - crypto.buyPrice;
        const changePercent = ((change / crypto.buyPrice) * 100);
        
        return {
          ...crypto,
          currentPrice: parseFloat(newPrice.toFixed(2)),
          change: parseFloat(change.toFixed(2)),
          changePercent: parseFloat(changePercent.toFixed(2)),
        };
      }));

      // Update foreign stocks
      setForeignStocks(prev => prev.map(stock => {
        const priceChange = (Math.random() - 0.5) * 0.5; // -0.25 to +0.25 USD change
        const newPrice = Math.max(stock.currentPriceUSD + priceChange, stock.currentPriceUSD * 0.98);
        const change = newPrice - stock.buyPriceUSD;
        const changePercent = ((change / stock.buyPriceUSD) * 100);
        
        return {
          ...stock,
          currentPriceUSD: parseFloat(newPrice.toFixed(2)),
          change: parseFloat(change.toFixed(2)),
          changePercent: parseFloat(changePercent.toFixed(2)),
        };
      }));
    }, 3000); // Update every 3 seconds

    return () => clearInterval(interval);
  }, []);

  // Add functions
  const addIndianStock = (stock: IndianStock) => {
    setIndianStocks([...indianStocks, stock]);
  };

  const addCryptocurrency = (crypto: Cryptocurrency) => {
    setCryptocurrencies([...cryptocurrencies, crypto]);
  };

  const addMutualFund = (fund: MutualFund) => {
    setMutualFunds([...mutualFunds, fund]);
  };

  const addGoldSilver = (gs: GoldSilver) => {
    setGoldSilver([...goldSilver, gs]);
  };

  const addForeignStock = (stock: ForeignStock) => {
    setForeignStocks([...foreignStocks, stock]);
  };

  // Update functions
  const updateIndianStock = (id: string, stock: Partial<IndianStock>) => {
    setIndianStocks(indianStocks.map(s => s.id === id ? { ...s, ...stock } : s));
  };

  const updateCryptocurrency = (id: string, crypto: Partial<Cryptocurrency>) => {
    setCryptocurrencies(cryptocurrencies.map(c => c.id === id ? { ...c, ...crypto } : c));
  };

  const updateMutualFund = (id: string, fund: Partial<MutualFund>) => {
    setMutualFunds(mutualFunds.map(f => f.id === id ? { ...f, ...fund } : f));
  };

  const updateGoldSilver = (id: string, gs: Partial<GoldSilver>) => {
    setGoldSilver(goldSilver.map(g => g.id === id ? { ...g, ...gs } : g));
  };

  const updateForeignStock = (id: string, stock: Partial<ForeignStock>) => {
    setForeignStocks(foreignStocks.map(s => s.id === id ? { ...s, ...stock } : s));
  };

  // Delete functions
  const deleteIndianStock = (id: string) => {
    setIndianStocks(indianStocks.filter(s => s.id !== id));
  };

  const deleteCryptocurrency = (id: string) => {
    setCryptocurrencies(cryptocurrencies.filter(c => c.id !== id));
  };

  const deleteMutualFund = (id: string) => {
    setMutualFunds(mutualFunds.filter(f => f.id !== id));
  };

  const deleteGoldSilver = (id: string) => {
    setGoldSilver(goldSilver.filter(g => g.id !== id));
  };

  const deleteForeignStock = (id: string) => {
    setForeignStocks(foreignStocks.filter(s => s.id !== id));
  };

  return (
    <PortfolioContext.Provider
      value={{
        indianStocks,
        cryptocurrencies,
        mutualFunds,
        goldSilver,
        foreignStocks,
        usdToInr,
        setIndianStocks,
        setCryptocurrencies,
        setMutualFunds,
        setGoldSilver,
        setForeignStocks,
        addIndianStock,
        addCryptocurrency,
        addMutualFund,
        addGoldSilver,
        addForeignStock,
        updateIndianStock,
        updateCryptocurrency,
        updateMutualFund,
        updateGoldSilver,
        updateForeignStock,
        deleteIndianStock,
        deleteCryptocurrency,
        deleteMutualFund,
        deleteGoldSilver,
        deleteForeignStock,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (context === undefined) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};
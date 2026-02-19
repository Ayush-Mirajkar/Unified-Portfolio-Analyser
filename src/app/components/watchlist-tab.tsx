import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { TrendingUp, TrendingDown, Plus, X, Eye } from 'lucide-react';

interface WatchlistStock {
  id: string;
  symbol: string;
  name: string;
  currentPrice: number;
  change: number;
  changePercent: number;
  dayHigh: number;
  dayLow: number;
}

const initialWatchlist: WatchlistStock[] = [
  {
    id: '1',
    symbol: 'ITC',
    name: 'ITC Ltd',
    currentPrice: 425,
    change: 5.5,
    changePercent: 1.31,
    dayHigh: 430,
    dayLow: 420,
  },
  {
    id: '2',
    symbol: 'TATAMOTORS',
    name: 'Tata Motors Ltd',
    currentPrice: 685,
    change: -8.2,
    changePercent: -1.18,
    dayHigh: 695,
    dayLow: 680,
  },
  {
    id: '3',
    symbol: 'MARUTI',
    name: 'Maruti Suzuki India Ltd',
    currentPrice: 11250,
    change: 125,
    changePercent: 1.12,
    dayHigh: 11280,
    dayLow: 11180,
  },
  {
    id: '4',
    symbol: 'ADANIENT',
    name: 'Adani Enterprises Ltd',
    currentPrice: 2150,
    change: 35,
    changePercent: 1.65,
    dayHigh: 2165,
    dayLow: 2110,
  },
  {
    id: '5',
    symbol: 'LT',
    name: 'Larsen & Toubro Ltd',
    currentPrice: 3450,
    change: -12,
    changePercent: -0.35,
    dayHigh: 3480,
    dayLow: 3440,
  },
];

export default function WatchlistTab() {
  const [watchlist, setWatchlist] = useState<WatchlistStock[]>(initialWatchlist);
  const [searchTerm, setSearchTerm] = useState('');

  // Simulate live price updates
  useEffect(() => {
    const interval = setInterval(() => {
      setWatchlist((prev) =>
        prev.map((stock) => {
          const priceChange = (Math.random() - 0.5) * 3;
          const newPrice = Math.max(stock.currentPrice + priceChange, stock.currentPrice * 0.97);
          const change = newPrice - (stock.currentPrice - stock.change);
          const changePercent = (change / (stock.currentPrice - stock.change)) * 100;

          return {
            ...stock,
            currentPrice: parseFloat(newPrice.toFixed(2)),
            change: parseFloat(change.toFixed(2)),
            changePercent: parseFloat(changePercent.toFixed(2)),
            dayHigh: Math.max(stock.dayHigh, newPrice),
            dayLow: Math.min(stock.dayLow, newPrice),
          };
        })
      );
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  const removeFromWatchlist = (id: string) => {
    setWatchlist(watchlist.filter((stock) => stock.id !== id));
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(value);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                My Watchlist
              </CardTitle>
              <CardDescription>Track stocks you're interested in</CardDescription>
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add to Watchlist
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Watchlist Items */}
      <div className="grid grid-cols-1 gap-4">
        {watchlist.map((stock) => (
          <Card
            key={stock.id}
            className="hover:shadow-lg transition-shadow cursor-pointer"
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between flex-wrap gap-4">
                {/* Stock Info */}
                <div className="flex-1 min-w-[200px]">
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <div className="font-semibold text-lg">{stock.symbol}</div>
                      <div className="text-sm text-slate-500">{stock.name}</div>
                    </div>
                  </div>
                </div>

                {/* Price Info */}
                <div className="text-right">
                  <div className="font-semibold text-xl">
                    {formatCurrency(stock.currentPrice)}
                  </div>
                  <div
                    className={`text-sm flex items-center gap-1 justify-end ${
                      stock.change >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {stock.change >= 0 ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    {formatCurrency(Math.abs(stock.change))} (
                    {stock.changePercent >= 0 ? '+' : ''}
                    {stock.changePercent.toFixed(2)}%)
                  </div>
                </div>

                {/* Day High/Low */}
                <div className="text-right text-sm">
                  <div className="text-slate-500">High</div>
                  <div className="font-semibold">{formatCurrency(stock.dayHigh)}</div>
                  <div className="text-slate-500 mt-1">Low</div>
                  <div className="font-semibold">{formatCurrency(stock.dayLow)}</div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                    onClick={() => removeFromWatchlist(stock.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Price Bar (Visual representation of price range) */}
              <div className="mt-4">
                <div className="flex justify-between text-xs text-slate-500 mb-1">
                  <span>Low: ₹{stock.dayLow}</span>
                  <span>High: ₹{stock.dayHigh}</span>
                </div>
                <div className="relative h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className={`absolute h-full rounded-full ${
                      stock.change >= 0 ? 'bg-green-500' : 'bg-red-500'
                    }`}
                    style={{
                      left: '0%',
                      width: `${
                        ((stock.currentPrice - stock.dayLow) /
                          (stock.dayHigh - stock.dayLow)) *
                        100
                      }%`,
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {watchlist.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Eye className="h-12 w-12 mx-auto text-slate-300 mb-4" />
            <h3 className="text-lg font-semibold text-slate-700 mb-2">
              Your watchlist is empty
            </h3>
            <p className="text-slate-500 mb-4">
              Add stocks to track their performance
            </p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Stocks
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Market Indices */}
      <Card>
        <CardHeader>
          <CardTitle>Market Indices</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <IndexCard
              name="NIFTY 50"
              value={22150.25}
              change={125.5}
              changePercent={0.57}
            />
            <IndexCard
              name="SENSEX"
              value={73250.80}
              change={-85.25}
              changePercent={-0.12}
            />
            <IndexCard
              name="BANK NIFTY"
              value={48350.15}
              change={220.75}
              changePercent={0.46}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Index Card Component
function IndexCard({
  name,
  value,
  change,
  changePercent,
}: {
  name: string;
  value: number;
  change: number;
  changePercent: number;
}) {
  return (
    <div className="p-4 bg-slate-50 rounded-lg border">
      <div className="text-sm text-slate-600 mb-1">{name}</div>
      <div className="text-2xl font-bold mb-1">{value.toFixed(2)}</div>
      <div
        className={`text-sm flex items-center gap-1 ${
          change >= 0 ? 'text-green-600' : 'text-red-600'
        }`}
      >
        {change >= 0 ? (
          <TrendingUp className="h-3 w-3" />
        ) : (
          <TrendingDown className="h-3 w-3" />
        )}
        {Math.abs(change).toFixed(2)} ({changePercent >= 0 ? '+' : ''}
        {changePercent.toFixed(2)}%)
      </div>
    </div>
  );
}

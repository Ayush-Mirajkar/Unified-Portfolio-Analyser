import { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import { usePortfolio } from '@/app/context/portfolio-context';
import { TrendingUp, TrendingDown, IndianRupee, Wallet } from 'lucide-react';
import IndicesChart from '@/app/components/indices-chart';

export default function PortfolioDashboard() {
  const {
    indianStocks,
    cryptocurrencies,
    mutualFunds,
    goldSilver,
    foreignStocks,
    usdToInr,
  } = usePortfolio();

  // Calculate portfolio values
  const portfolioData = useMemo(() => {

    // Indian Stocks
    const indianStocksValue = indianStocks.reduce(
      (acc, stock) => acc + stock.quantity * stock.currentPrice,
      0
    );
    const indianStocksInvested = indianStocks.reduce(
      (acc, stock) => acc + stock.quantity * stock.buyPrice,
      0
    );

    // Cryptocurrency
    const cryptoValue = cryptocurrencies.reduce(
      (acc, crypto) => acc + crypto.quantity * crypto.currentPrice,
      0
    );
    const cryptoInvested = cryptocurrencies.reduce(
      (acc, crypto) => acc + crypto.quantity * crypto.buyPrice,
      0
    );

    // Mutual Funds
    const mutualFundsValue = mutualFunds.reduce(
      (acc, fund) => acc + fund.units * fund.currentNav,
      0
    );
    const mutualFundsInvested = mutualFunds.reduce(
      (acc, fund) => acc + fund.units * fund.buyNav,
      0
    );

    // Gold/Silver
    const goldSilverValue = goldSilver.reduce(
      (acc, gs) => acc + gs.grams * gs.currentPricePerGram,
      0
    );
    const goldSilverInvested = goldSilver.reduce(
      (acc, gs) => acc + gs.grams * gs.buyPricePerGram,
      0
    );

    // Foreign Stocks (convert to INR)
    const foreignStocksValue = foreignStocks.reduce(
      (acc, stock) => acc + stock.quantity * stock.currentPriceUSD * usdToInr,
      0
    );
    const foreignStocksInvested = foreignStocks.reduce(
      (acc, stock) => acc + stock.quantity * stock.buyPriceUSD * usdToInr,
      0
    );

    const totalValue = indianStocksValue + cryptoValue + mutualFundsValue + goldSilverValue + foreignStocksValue;
    const totalInvested = indianStocksInvested + cryptoInvested + mutualFundsInvested + goldSilverInvested + foreignStocksInvested;
    const totalGainLoss = totalValue - totalInvested;
    const totalGainLossPercent = totalInvested > 0 ? (totalGainLoss / totalInvested) * 100 : 0;

    return {
      indianStocks: {
        value: indianStocksValue,
        invested: indianStocksInvested,
        gainLoss: indianStocksValue - indianStocksInvested,
      },
      crypto: {
        value: cryptoValue,
        invested: cryptoInvested,
        gainLoss: cryptoValue - cryptoInvested,
      },
      mutualFunds: {
        value: mutualFundsValue,
        invested: mutualFundsInvested,
        gainLoss: mutualFundsValue - mutualFundsInvested,
      },
      goldSilver: {
        value: goldSilverValue,
        invested: goldSilverInvested,
        gainLoss: goldSilverValue - goldSilverInvested,
      },
      foreignStocks: {
        value: foreignStocksValue,
        invested: foreignStocksInvested,
        gainLoss: foreignStocksValue - foreignStocksInvested,
      },
      total: {
        value: totalValue,
        invested: totalInvested,
        gainLoss: totalGainLoss,
        gainLossPercent: totalGainLossPercent,
      },
    };
  }, [indianStocks, cryptocurrencies, mutualFunds, goldSilver, foreignStocks, usdToInr]);

  // Pie chart data for allocation
  const allocationData = [
    { name: 'Indian Stocks', value: portfolioData.indianStocks.value, color: '#3b82f6' },
    { name: 'Cryptocurrency', value: portfolioData.crypto.value, color: '#f59e0b' },
    { name: 'Mutual Funds', value: portfolioData.mutualFunds.value, color: '#10b981' },
    { name: 'Gold/Silver', value: portfolioData.goldSilver.value, color: '#fbbf24' },
    { name: 'Foreign Stocks', value: portfolioData.foreignStocks.value, color: '#8b5cf6' },
  ].filter(item => item.value > 0);

  // Historical performance data (simulated trend)
  const performanceData = [
    { month: 'Jan', value: portfolioData.total.invested * 0.92 },
    { month: 'Feb', value: portfolioData.total.invested * 0.95 },
    { month: 'Mar', value: portfolioData.total.invested * 0.98 },
    { month: 'Apr', value: portfolioData.total.invested * 1.02 },
    { month: 'May', value: portfolioData.total.invested * 1.05 },
    { month: 'Jun', value: portfolioData.total.value },
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="space-y-6">
      {/* Live Indices Charts */}
      <IndicesChart />

      {/* Total Portfolio Value */}
      <Card className="bg-gradient-to-br from-blue-500 to-blue-700 text-white border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Wallet className="h-5 w-5" />
            Total Portfolio Value
          </CardTitle>
          <CardDescription className="text-blue-100">
            Complete summary of all your investments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="text-4xl md:text-5xl font-bold">
              {formatCurrency(portfolioData.total.value)}
            </div>
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                {portfolioData.total.gainLoss >= 0 ? (
                  <TrendingUp className="h-5 w-5" />
                ) : (
                  <TrendingDown className="h-5 w-5" />
                )}
                <span className="text-xl font-semibold">
                  {formatCurrency(Math.abs(portfolioData.total.gainLoss))}
                </span>
                <span className="text-sm opacity-90">
                  ({portfolioData.total.gainLossPercent >= 0 ? '+' : ''}
                  {portfolioData.total.gainLossPercent.toFixed(2)}%)
                </span>
              </div>
              <div className="text-sm opacity-90">
                Invested: {formatCurrency(portfolioData.total.invested)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Asset Class Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AssetCard
          title="Indian Stocks"
          value={portfolioData.indianStocks.value}
          gainLoss={portfolioData.indianStocks.gainLoss}
          color="bg-blue-500"
        />
        <AssetCard
          title="Cryptocurrency"
          value={portfolioData.crypto.value}
          gainLoss={portfolioData.crypto.gainLoss}
          color="bg-amber-500"
        />
        <AssetCard
          title="Mutual Funds"
          value={portfolioData.mutualFunds.value}
          gainLoss={portfolioData.mutualFunds.gainLoss}
          color="bg-green-500"
        />
        <AssetCard
          title="Gold/Silver"
          value={portfolioData.goldSilver.value}
          gainLoss={portfolioData.goldSilver.gainLoss}
          color="bg-yellow-500"
        />
        <AssetCard
          title="Foreign Stocks"
          value={portfolioData.foreignStocks.value}
          gainLoss={portfolioData.foreignStocks.gainLoss}
          color="bg-purple-500"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Portfolio Allocation Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Portfolio Allocation</CardTitle>
            <CardDescription>Distribution across asset classes</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={allocationData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {allocationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Portfolio Performance Line Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Portfolio Performance</CardTitle>
            <CardDescription>6-month trend</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis 
                  tickFormatter={(value) => `₹${(value / 100000).toFixed(0)}L`}
                />
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ fill: '#3b82f6' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Asset Card Component
function AssetCard({
  title,
  value,
  gainLoss,
  color,
}: {
  title: string;
  value: number;
  gainLoss: number;
  color: string;
}) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const gainLossPercent = value > 0 ? (gainLoss / (value - gainLoss)) * 100 : 0;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <div className={`w-3 h-3 rounded-full ${color}`} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          <div className="text-2xl font-bold">{formatCurrency(value)}</div>
          <div
            className={`text-sm flex items-center gap-1 ${
              gainLoss >= 0 ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {gainLoss >= 0 ? (
              <TrendingUp className="h-4 w-4" />
            ) : (
              <TrendingDown className="h-4 w-4" />
            )}
            <span>
              {formatCurrency(Math.abs(gainLoss))} ({gainLossPercent >= 0 ? '+' : ''}
              {gainLossPercent.toFixed(2)}%)
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
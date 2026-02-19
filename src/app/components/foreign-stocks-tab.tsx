import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { usePortfolio } from '@/app/context/portfolio-context';
import { TrendingUp, TrendingDown, Plus, Trash2, DollarSign } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/app/components/ui/dialog';

export default function ForeignStocksTab() {
  const { foreignStocks, addForeignStock, deleteForeignStock, usdToInr } = usePortfolio();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const [formData, setFormData] = useState({
    symbol: '',
    name: '',
    quantity: '',
    buyPriceUSD: '',
    currentPriceUSD: '',
  });

  const handleAdd = () => {
    if (formData.symbol && formData.name && formData.quantity && formData.buyPriceUSD && formData.currentPriceUSD) {
      addForeignStock({
        id: Date.now().toString(),
        symbol: formData.symbol.toUpperCase(),
        name: formData.name,
        quantity: parseFloat(formData.quantity),
        buyPriceUSD: parseFloat(formData.buyPriceUSD),
        currentPriceUSD: parseFloat(formData.currentPriceUSD),
      });
      setFormData({ symbol: '', name: '', quantity: '', buyPriceUSD: '', currentPriceUSD: '' });
      setIsAddDialogOpen(false);
    }
  };

  // Calculate totals in USD and INR
  const totalInvestedUSD = foreignStocks.reduce((acc, stock) => acc + stock.quantity * stock.buyPriceUSD, 0);
  const totalCurrentUSD = foreignStocks.reduce(
    (acc, stock) => acc + stock.quantity * stock.currentPriceUSD,
    0
  );

  const totalInvestedINR = totalInvestedUSD * usdToInr;
  const totalCurrentINR = totalCurrentUSD * usdToInr;
  const totalGainLossINR = totalCurrentINR - totalInvestedINR;
  const totalGainLossPercent = totalInvestedINR > 0 ? (totalGainLossINR / totalInvestedINR) * 100 : 0;

  // Historical performance data (simulated)
  const performanceData = foreignStocks.map((stock) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const basePrice = stock.buyPriceUSD;
    const currentPrice = stock.currentPriceUSD;
    const increment = (currentPrice - basePrice) / 5;

    return months.map((month, index) => ({
      month,
      [stock.symbol]: (basePrice + increment * index) * usdToInr,
    }));
  });

  // Merge performance data by month
  const chartData = performanceData[0]?.map((_, index) => {
    const monthData: any = { month: performanceData[0][index].month };
    performanceData.forEach((stockData, stockIndex) => {
      const symbol = foreignStocks[stockIndex].symbol;
      monthData[symbol] = stockData[index][symbol];
    });
    return monthData;
  }) || [];

  const formatCurrency = (value: number, currency: 'INR' | 'USD' = 'INR') => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const STOCK_COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b'];

  return (
    <div className="space-y-6">
      {/* Header with Add Button */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                Foreign Stocks Portfolio
                <span className="text-sm font-normal text-slate-500">(US Markets)</span>
              </CardTitle>
              <CardDescription>Track your international equity investments</CardDescription>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Stock
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Foreign Stock</DialogTitle>
                  <DialogDescription>Enter the details of your foreign stock holding</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="symbol">Symbol</Label>
                    <Input
                      id="symbol"
                      placeholder="e.g., AAPL"
                      value={formData.symbol}
                      onChange={(e) => setFormData({ ...formData, symbol: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="name">Company Name</Label>
                    <Input
                      id="name"
                      placeholder="e.g., Apple Inc"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="quantity">Quantity</Label>
                    <Input
                      id="quantity"
                      type="number"
                      placeholder="e.g., 3"
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="buyPriceUSD">Buy Price (USD)</Label>
                    <Input
                      id="buyPriceUSD"
                      type="number"
                      step="0.01"
                      placeholder="e.g., 175"
                      value={formData.buyPriceUSD}
                      onChange={(e) => setFormData({ ...formData, buyPriceUSD: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currentPriceUSD">Current Price (USD)</Label>
                    <Input
                      id="currentPriceUSD"
                      type="number"
                      step="0.01"
                      placeholder="e.g., 185"
                      value={formData.currentPriceUSD}
                      onChange={(e) => setFormData({ ...formData, currentPriceUSD: e.target.value })}
                    />
                  </div>
                  <Button onClick={handleAdd} className="w-full">
                    Add Stock
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <DollarSign className="h-4 w-4" />
              Exchange Rate: 1 USD = ₹{usdToInr}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-slate-500">Total Invested</p>
                <p className="text-2xl font-bold">{formatCurrency(totalInvestedINR)}</p>
                <p className="text-xs text-slate-500">{formatCurrency(totalInvestedUSD, 'USD')}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Current Value</p>
                <p className="text-2xl font-bold">{formatCurrency(totalCurrentINR)}</p>
                <p className="text-xs text-slate-500">{formatCurrency(totalCurrentUSD, 'USD')}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Gain/Loss</p>
                <p
                  className={`text-2xl font-bold flex items-center gap-2 ${
                    totalGainLossINR >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {totalGainLossINR >= 0 ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
                  {formatCurrency(Math.abs(totalGainLossINR))}
                  <span className="text-sm">
                    ({totalGainLossPercent >= 0 ? '+' : ''}
                    {totalGainLossPercent.toFixed(2)}%)
                  </span>
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Holdings Table */}
      <Card>
        <CardHeader>
          <CardTitle>Holdings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-2 font-medium text-sm">Symbol</th>
                  <th className="text-left py-3 px-2 font-medium text-sm">Company</th>
                  <th className="text-right py-3 px-2 font-medium text-sm">Qty</th>
                  <th className="text-right py-3 px-2 font-medium text-sm">Buy Price (USD)</th>
                  <th className="text-right py-3 px-2 font-medium text-sm">Current Price (USD)</th>
                  <th className="text-right py-3 px-2 font-medium text-sm">Invested (INR)</th>
                  <th className="text-right py-3 px-2 font-medium text-sm">Current Value (INR)</th>
                  <th className="text-right py-3 px-2 font-medium text-sm">Gain/Loss</th>
                  <th className="text-center py-3 px-2 font-medium text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {foreignStocks.map((stock) => {
                  const investedINR = stock.quantity * stock.buyPriceUSD * usdToInr;
                  const currentINR = stock.quantity * stock.currentPriceUSD * usdToInr;
                  const gainLossINR = currentINR - investedINR;
                  const gainLossPercent = (gainLossINR / investedINR) * 100;

                  return (
                    <tr key={stock.id} className="border-b hover:bg-slate-50">
                      <td className="py-3 px-2 font-semibold">{stock.symbol}</td>
                      <td className="py-3 px-2 text-sm">{stock.name}</td>
                      <td className="py-3 px-2 text-right">{stock.quantity}</td>
                      <td className="py-3 px-2 text-right">${stock.buyPriceUSD.toFixed(2)}</td>
                      <td className="py-3 px-2 text-right">
                        ${stock.currentPriceUSD.toFixed(2)}
                      </td>
                      <td className="py-3 px-2 text-right">{formatCurrency(investedINR)}</td>
                      <td className="py-3 px-2 text-right font-semibold">{formatCurrency(currentINR)}</td>
                      <td
                        className={`py-3 px-2 text-right font-semibold ${
                          gainLossINR >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {formatCurrency(Math.abs(gainLossINR))}
                        <div className="text-xs">
                          ({gainLossPercent >= 0 ? '+' : ''}
                          {gainLossPercent.toFixed(2)}%)
                        </div>
                      </td>
                      <td className="py-3 px-2">
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteForeignStock(stock.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
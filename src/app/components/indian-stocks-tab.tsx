import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { usePortfolio } from '@/app/context/portfolio-context';
import { TrendingUp, TrendingDown, Plus, Trash2, BarChart3, Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/app/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import CandlestickChart from '@/app/components/candlestick-chart';

export default function IndianStocksTab() {
  const { indianStocks, addIndianStock, updateIndianStock, deleteIndianStock } = usePortfolio();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedStock, setSelectedStock] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    symbol: '',
    name: '',
    quantity: '',
    buyPrice: '',
    currentPrice: '',
  });

  const handleAdd = () => {
    if (formData.symbol && formData.name && formData.quantity && formData.buyPrice && formData.currentPrice) {
      addIndianStock({
        id: Date.now().toString(),
        symbol: formData.symbol.toUpperCase(),
        name: formData.name,
        quantity: parseFloat(formData.quantity),
        buyPrice: parseFloat(formData.buyPrice),
        currentPrice: parseFloat(formData.currentPrice),
        dayOpen: parseFloat(formData.currentPrice),
        dayHigh: parseFloat(formData.currentPrice) * 1.02,
        dayLow: parseFloat(formData.currentPrice) * 0.98,
        weekHigh52: parseFloat(formData.currentPrice) * 1.2,
        weekLow52: parseFloat(formData.currentPrice) * 0.8,
        change: 0,
        changePercent: 0,
      });
      setFormData({ symbol: '', name: '', quantity: '', buyPrice: '', currentPrice: '' });
      setIsAddDialogOpen(false);
    }
  };

  // Calculate totals
  const totalInvested = indianStocks.reduce((acc, stock) => acc + stock.quantity * stock.buyPrice, 0);
  const totalCurrent = indianStocks.reduce(
    (acc, stock) => acc + stock.quantity * stock.currentPrice,
    0
  );
  const totalGainLoss = totalCurrent - totalInvested;
  const totalGainLossPercent = totalInvested > 0 ? (totalGainLoss / totalInvested) * 100 : 0;

  // Chart data
  const chartData = indianStocks.map((stock) => ({
    name: stock.symbol,
    invested: stock.quantity * stock.buyPrice,
    current: stock.quantity * stock.currentPrice,
  }));

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="space-y-6">
      {/* Header with Add Button */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                Indian Stocks Portfolio
                <span className="text-sm font-normal text-slate-500">(Zerodha Kite)</span>
              </CardTitle>
              <CardDescription>Track your Indian equity investments</CardDescription>
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
                  <DialogTitle>Add New Stock</DialogTitle>
                  <DialogDescription>Enter the details of your stock holding</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="symbol">Symbol</Label>
                    <Input
                      id="symbol"
                      placeholder="e.g., RELIANCE"
                      value={formData.symbol}
                      onChange={(e) => setFormData({ ...formData, symbol: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="name">Company Name</Label>
                    <Input
                      id="name"
                      placeholder="e.g., Reliance Industries Ltd"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="quantity">Quantity</Label>
                    <Input
                      id="quantity"
                      type="number"
                      placeholder="e.g., 10"
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="buyPrice">Buy Price (₹)</Label>
                    <Input
                      id="buyPrice"
                      type="number"
                      placeholder="e.g., 2450"
                      value={formData.buyPrice}
                      onChange={(e) => setFormData({ ...formData, buyPrice: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currentPrice">Current Price (₹)</Label>
                    <Input
                      id="currentPrice"
                      type="number"
                      placeholder="e.g., 2580"
                      value={formData.currentPrice}
                      onChange={(e) => setFormData({ ...formData, currentPrice: e.target.value })}
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-slate-500">Total Invested</p>
              <p className="text-2xl font-bold">{formatCurrency(totalInvested)}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Current Value</p>
              <p className="text-2xl font-bold">{formatCurrency(totalCurrent)}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Gain/Loss</p>
              <p
                className={`text-2xl font-bold flex items-center gap-2 ${
                  totalGainLoss >= 0 ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {totalGainLoss >= 0 ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
                {formatCurrency(Math.abs(totalGainLoss))}
                <span className="text-sm">({totalGainLossPercent >= 0 ? '+' : ''}{totalGainLossPercent.toFixed(2)}%)</span>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stock Holdings Table */}
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
                  <th className="text-right py-3 px-2 font-medium text-sm">Buy Price</th>
                  <th className="text-right py-3 px-2 font-medium text-sm">Current Price</th>
                  <th className="text-right py-3 px-2 font-medium text-sm">Invested</th>
                  <th className="text-right py-3 px-2 font-medium text-sm">Current Value</th>
                  <th className="text-right py-3 px-2 font-medium text-sm">Gain/Loss</th>
                  <th className="text-center py-3 px-2 font-medium text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {indianStocks.map((stock) => {
                  const invested = stock.quantity * stock.buyPrice;
                  const current = stock.quantity * stock.currentPrice;
                  const gainLoss = current - invested;
                  const gainLossPercent = (gainLoss / invested) * 100;

                  return (
                    <tr key={stock.id} className="border-b hover:bg-slate-50">
                      <td className="py-3 px-2 font-semibold">{stock.symbol}</td>
                      <td className="py-3 px-2 text-sm">{stock.name}</td>
                      <td className="py-3 px-2 text-right">{stock.quantity}</td>
                      <td className="py-3 px-2 text-right">₹{stock.buyPrice.toFixed(2)}</td>
                      <td className="py-3 px-2 text-right">
                        ₹{stock.currentPrice.toFixed(2)}
                      </td>
                      <td className="py-3 px-2 text-right">{formatCurrency(invested)}</td>
                      <td className="py-3 px-2 text-right font-semibold">{formatCurrency(current)}</td>
                      <td
                        className={`py-3 px-2 text-right font-semibold ${
                          gainLoss >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {formatCurrency(Math.abs(gainLoss))}
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
                            onClick={() => deleteIndianStock(stock.id)}
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

      {/* Performance Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Comparison</CardTitle>
          <CardDescription>Invested vs Current Value</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}K`} />
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
              <Legend />
              <Bar dataKey="invested" fill="#94a3b8" name="Invested" />
              <Bar dataKey="current" fill="#3b82f6" name="Current Value" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Candlestick Chart */}
      {indianStocks.length > 0 && (
        <CandlestickChart symbol={indianStocks[0].symbol} />
      )}
    </div>
  );
}
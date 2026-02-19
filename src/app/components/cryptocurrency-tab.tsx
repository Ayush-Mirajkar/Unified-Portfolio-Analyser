import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { usePortfolio } from '@/app/context/portfolio-context';
import { TrendingUp, TrendingDown, Plus, Trash2 } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/app/components/ui/dialog';

const CRYPTO_COLORS = ['#f7931a', '#627eea', '#f3ba2f', '#14f195', '#9945ff'];

export default function CryptocurrencyTab() {
  const { cryptocurrencies, addCryptocurrency, deleteCryptocurrency } = usePortfolio();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const [formData, setFormData] = useState({
    symbol: '',
    name: '',
    quantity: '',
    buyPrice: '',
    currentPrice: '',
  });

  const handleAdd = () => {
    if (formData.symbol && formData.name && formData.quantity && formData.buyPrice && formData.currentPrice) {
      addCryptocurrency({
        id: Date.now().toString(),
        symbol: formData.symbol.toUpperCase(),
        name: formData.name,
        quantity: parseFloat(formData.quantity),
        buyPrice: parseFloat(formData.buyPrice),
        currentPrice: parseFloat(formData.currentPrice),
      });
      setFormData({ symbol: '', name: '', quantity: '', buyPrice: '', currentPrice: '' });
      setIsAddDialogOpen(false);
    }
  };

  // Calculate totals
  const totalInvested = cryptocurrencies.reduce(
    (acc, crypto) => acc + crypto.quantity * crypto.buyPrice,
    0
  );
  const totalCurrent = cryptocurrencies.reduce(
    (acc, crypto) => acc + crypto.quantity * crypto.currentPrice,
    0
  );
  const totalGainLoss = totalCurrent - totalInvested;
  const totalGainLossPercent = totalInvested > 0 ? (totalGainLoss / totalInvested) * 100 : 0;

  // Pie chart data for crypto allocation
  const allocationData = cryptocurrencies.map((crypto, index) => ({
    name: crypto.symbol,
    value: crypto.quantity * crypto.currentPrice,
    color: CRYPTO_COLORS[index % CRYPTO_COLORS.length],
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
                Cryptocurrency Portfolio
                <span className="text-sm font-normal text-slate-500">(CoinGecko / WazirX)</span>
              </CardTitle>
              <CardDescription>Track your crypto investments</CardDescription>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Crypto
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Cryptocurrency</DialogTitle>
                  <DialogDescription>Enter the details of your crypto holding</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="symbol">Symbol</Label>
                    <Input
                      id="symbol"
                      placeholder="e.g., BTC"
                      value={formData.symbol}
                      onChange={(e) => setFormData({ ...formData, symbol: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      placeholder="e.g., Bitcoin"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="quantity">Quantity</Label>
                    <Input
                      id="quantity"
                      type="number"
                      step="0.00000001"
                      placeholder="e.g., 0.05"
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="buyPrice">Buy Price (₹)</Label>
                    <Input
                      id="buyPrice"
                      type="number"
                      placeholder="e.g., 4200000"
                      value={formData.buyPrice}
                      onChange={(e) => setFormData({ ...formData, buyPrice: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currentPrice">Current Price (₹)</Label>
                    <Input
                      id="currentPrice"
                      type="number"
                      placeholder="e.g., 4500000"
                      value={formData.currentPrice}
                      onChange={(e) => setFormData({ ...formData, currentPrice: e.target.value })}
                    />
                  </div>
                  <Button onClick={handleAdd} className="w-full">
                    Add Cryptocurrency
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
                <span className="text-sm">
                  ({totalGainLossPercent >= 0 ? '+' : ''}
                  {totalGainLossPercent.toFixed(2)}%)
                </span>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Holdings and Pie Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Holdings Table */}
        <Card>
          <CardHeader>
            <CardTitle>Holdings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {cryptocurrencies.map((crypto) => {
                const invested = crypto.quantity * crypto.buyPrice;
                const current = crypto.quantity * crypto.currentPrice;
                const gainLoss = current - invested;
                const gainLossPercent = (gainLoss / invested) * 100;

                return (
                  <div key={crypto.id} className="p-4 border rounded-lg hover:bg-slate-50">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="font-semibold text-lg">
                          {crypto.symbol}
                          <span className="text-sm text-slate-500 ml-2">{crypto.name}</span>
                        </div>
                        <div className="text-sm text-slate-500">
                          {crypto.quantity} coins
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteCryptocurrency(crypto.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-slate-500">Invested</p>
                        <p className="font-semibold">{formatCurrency(invested)}</p>
                      </div>
                      <div>
                        <p className="text-slate-500">Current Value</p>
                        <p className="font-semibold">{formatCurrency(current)}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-slate-500">Gain/Loss</p>
                        <p
                          className={`font-semibold ${
                            gainLoss >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}
                        >
                          {formatCurrency(Math.abs(gainLoss))} ({gainLossPercent >= 0 ? '+' : ''}
                          {gainLossPercent.toFixed(2)}%)
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Allocation Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Crypto Allocation</CardTitle>
            <CardDescription>Distribution by coin</CardDescription>
          </CardHeader>
          <CardContent>
            {allocationData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={allocationData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
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
            ) : (
              <div className="h-[300px] flex items-center justify-center text-slate-400">
                No cryptocurrency holdings
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Price Table */}
      <Card>
        <CardHeader>
          <CardTitle>Price Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-2 font-medium text-sm">Coin</th>
                  <th className="text-right py-3 px-2 font-medium text-sm">Quantity</th>
                  <th className="text-right py-3 px-2 font-medium text-sm">Buy Price</th>
                  <th className="text-right py-3 px-2 font-medium text-sm">Current Price</th>
                  <th className="text-right py-3 px-2 font-medium text-sm">Change</th>
                </tr>
              </thead>
              <tbody>
                {cryptocurrencies.map((crypto) => {
                  const priceChange = ((crypto.currentPrice - crypto.buyPrice) / crypto.buyPrice) * 100;

                  return (
                    <tr key={crypto.id} className="border-b hover:bg-slate-50">
                      <td className="py-3 px-2">
                        <div className="font-semibold">{crypto.symbol}</div>
                        <div className="text-sm text-slate-500">{crypto.name}</div>
                      </td>
                      <td className="py-3 px-2 text-right">{crypto.quantity}</td>
                      <td className="py-3 px-2 text-right">{formatCurrency(crypto.buyPrice)}</td>
                      <td className="py-3 px-2 text-right font-semibold">
                        {formatCurrency(crypto.currentPrice)}
                      </td>
                      <td
                        className={`py-3 px-2 text-right font-semibold ${
                          priceChange >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {priceChange >= 0 ? '+' : ''}
                        {priceChange.toFixed(2)}%
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
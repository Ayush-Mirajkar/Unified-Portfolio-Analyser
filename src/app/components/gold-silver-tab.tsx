import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { usePortfolio } from '@/app/context/portfolio-context';
import { TrendingUp, TrendingDown, Plus, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/app/components/ui/dialog';

export default function GoldSilverTab() {
  const { goldSilver, addGoldSilver, deleteGoldSilver } = usePortfolio();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const [formData, setFormData] = useState({
    type: 'gold' as 'gold' | 'silver',
    grams: '',
    buyPricePerGram: '',
    currentPricePerGram: '',
  });

  const handleAdd = () => {
    if (formData.grams && formData.buyPricePerGram && formData.currentPricePerGram) {
      addGoldSilver({
        id: Date.now().toString(),
        type: formData.type,
        grams: parseFloat(formData.grams),
        buyPricePerGram: parseFloat(formData.buyPricePerGram),
        currentPricePerGram: parseFloat(formData.currentPricePerGram),
      });
      setFormData({ type: 'gold', grams: '', buyPricePerGram: '', currentPricePerGram: '' });
      setIsAddDialogOpen(false);
    }
  };

  // Separate gold and silver
  const goldHoldings = goldSilver.filter((gs) => gs.type === 'gold');
  const silverHoldings = goldSilver.filter((gs) => gs.type === 'silver');

  // Calculate totals
  const totalGoldGrams = goldHoldings.reduce((acc, g) => acc + g.grams, 0);
  const totalSilverGrams = silverHoldings.reduce((acc, s) => acc + s.grams, 0);

  const goldInvested = goldHoldings.reduce((acc, g) => acc + g.grams * g.buyPricePerGram, 0);
  const goldCurrent = goldHoldings.reduce(
    (acc, g) => acc + g.grams * g.currentPricePerGram,
    0
  );

  const silverInvested = silverHoldings.reduce((acc, s) => acc + s.grams * s.buyPricePerGram, 0);
  const silverCurrent = silverHoldings.reduce(
    (acc, s) => acc + s.grams * s.currentPricePerGram,
    0
  );

  const totalValue = goldCurrent + silverCurrent;
  const totalInvested = goldInvested + silverInvested;
  const totalGainLoss = totalValue - totalInvested;
  const totalGainLossPercent = totalInvested > 0 ? (totalGainLoss / totalInvested) * 100 : 0;

  // Historical price trend (simulated data)
  const trendData = [
    { month: 'Jan', gold: 6150, silver: 75 },
    { month: 'Feb', gold: 6200, silver: 76 },
    { month: 'Mar', gold: 6300, silver: 77 },
    { month: 'Apr', gold: 6400, silver: 79 },
    { month: 'May', gold: 6350, silver: 80 },
    {
      month: 'Jun',
      gold: goldHoldings.length > 0 ? goldHoldings[0].currentPricePerGram : 6480,
      silver: silverHoldings.length > 0 ? silverHoldings[0].currentPricePerGram : 82,
    },
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
      {/* Header with Add Button */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <CardTitle>Gold & Silver Portfolio</CardTitle>
              <CardDescription>Track your precious metals investments</CardDescription>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Metal
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Gold/Silver</DialogTitle>
                  <DialogDescription>Enter the details of your precious metal holding</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Type</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value: 'gold' | 'silver') =>
                        setFormData({ ...formData, type: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gold">Gold</SelectItem>
                        <SelectItem value="silver">Silver</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="grams">Grams</Label>
                    <Input
                      id="grams"
                      type="number"
                      step="0.1"
                      placeholder="e.g., 25"
                      value={formData.grams}
                      onChange={(e) => setFormData({ ...formData, grams: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="buyPricePerGram">Buy Price per Gram (₹)</Label>
                    <Input
                      id="buyPricePerGram"
                      type="number"
                      step="0.01"
                      placeholder="e.g., 6250"
                      value={formData.buyPricePerGram}
                      onChange={(e) => setFormData({ ...formData, buyPricePerGram: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currentPricePerGram">Current Price per Gram (₹)</Label>
                    <Input
                      id="currentPricePerGram"
                      type="number"
                      step="0.01"
                      placeholder="e.g., 6480"
                      value={formData.currentPricePerGram}
                      onChange={(e) => setFormData({ ...formData, currentPricePerGram: e.target.value })}
                    />
                  </div>
                  <Button onClick={handleAdd} className="w-full">
                    Add Holding
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
              <p className="text-2xl font-bold">{formatCurrency(totalValue)}</p>
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

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Gold Summary */}
        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <CardHeader>
            <CardTitle className="text-yellow-900">Gold Holdings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-yellow-700">Total Grams</p>
                <p className="text-3xl font-bold text-yellow-900">{totalGoldGrams.toFixed(2)}g</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-yellow-700">Invested</p>
                  <p className="text-xl font-semibold text-yellow-900">{formatCurrency(goldInvested)}</p>
                </div>
                <div>
                  <p className="text-sm text-yellow-700">Current Value</p>
                  <p className="text-xl font-semibold text-yellow-900">{formatCurrency(goldCurrent)}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Silver Summary */}
        <Card className="bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200">
          <CardHeader>
            <CardTitle className="text-slate-900">Silver Holdings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-slate-700">Total Grams</p>
                <p className="text-3xl font-bold text-slate-900">{totalSilverGrams.toFixed(2)}g</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-700">Invested</p>
                  <p className="text-xl font-semibold text-slate-900">{formatCurrency(silverInvested)}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-700">Current Value</p>
                  <p className="text-xl font-semibold text-slate-900">{formatCurrency(silverCurrent)}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Holdings Table */}
      <Card>
        <CardHeader>
          <CardTitle>Holdings Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-2 font-medium text-sm">Type</th>
                  <th className="text-right py-3 px-2 font-medium text-sm">Grams</th>
                  <th className="text-right py-3 px-2 font-medium text-sm">Buy Price/g</th>
                  <th className="text-right py-3 px-2 font-medium text-sm">Current Price/g</th>
                  <th className="text-right py-3 px-2 font-medium text-sm">Invested</th>
                  <th className="text-right py-3 px-2 font-medium text-sm">Current Value</th>
                  <th className="text-right py-3 px-2 font-medium text-sm">Gain/Loss</th>
                  <th className="text-center py-3 px-2 font-medium text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {goldSilver.map((gs) => {
                  const invested = gs.grams * gs.buyPricePerGram;
                  const current = gs.grams * gs.currentPricePerGram;
                  const gainLoss = current - invested;
                  const gainLossPercent = (gainLoss / invested) * 100;

                  return (
                    <tr key={gs.id} className="border-b hover:bg-slate-50">
                      <td className="py-3 px-2">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded text-xs font-semibold ${
                            gs.type === 'gold'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-slate-100 text-slate-800'
                          }`}
                        >
                          {gs.type.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-right">{gs.grams}g</td>
                      <td className="py-3 px-2 text-right">₹{gs.buyPricePerGram.toFixed(2)}</td>
                      <td className="py-3 px-2 text-right">
                        ₹{(gs.currentPricePerGram).toFixed(2)}
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
                          <Button variant="ghost" size="sm" onClick={() => deleteGoldSilver(gs.id)}>
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
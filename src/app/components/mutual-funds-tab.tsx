import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { usePortfolio } from '@/app/context/portfolio-context';
import { TrendingUp, TrendingDown, Plus, Trash2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/app/components/ui/dialog';

export default function MutualFundsTab() {
  const { mutualFunds, addMutualFund, deleteMutualFund } = usePortfolio();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    units: '',
    buyNav: '',
    currentNav: '',
  });

  const handleAdd = () => {
    if (formData.name && formData.units && formData.buyNav && formData.currentNav) {
      addMutualFund({
        id: Date.now().toString(),
        name: formData.name,
        units: parseFloat(formData.units),
        buyNav: parseFloat(formData.buyNav),
        currentNav: parseFloat(formData.currentNav),
      });
      setFormData({ name: '', units: '', buyNav: '', currentNav: '' });
      setIsAddDialogOpen(false);
    }
  };

  // Calculate totals
  const totalInvested = mutualFunds.reduce(
    (acc, fund) => acc + fund.units * fund.buyNav,
    0
  );
  const totalCurrent = mutualFunds.reduce(
    (acc, fund) => acc + fund.units * fund.currentNav,
    0
  );
  const totalGainLoss = totalCurrent - totalInvested;
  const totalGainLossPercent = totalInvested > 0 ? (totalGainLoss / totalInvested) * 100 : 0;

  // Chart data
  const chartData = mutualFunds.map((fund) => ({
    name: fund.name.split(' ').slice(0, 2).join(' '), // Shorten name for chart
    invested: fund.units * fund.buyNav,
    current: fund.units * fund.currentNav,
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
              <CardTitle>Mutual Funds Portfolio</CardTitle>
              <CardDescription>Track your mutual fund investments</CardDescription>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Fund
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Mutual Fund</DialogTitle>
                  <DialogDescription>Enter the details of your mutual fund holding</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Fund Name</Label>
                    <Input
                      id="name"
                      placeholder="e.g., SBI Blue Chip Fund"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="units">Units</Label>
                    <Input
                      id="units"
                      type="number"
                      step="0.001"
                      placeholder="e.g., 150"
                      value={formData.units}
                      onChange={(e) => setFormData({ ...formData, units: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="buyNav">Buy NAV (₹)</Label>
                    <Input
                      id="buyNav"
                      type="number"
                      step="0.01"
                      placeholder="e.g., 68.5"
                      value={formData.buyNav}
                      onChange={(e) => setFormData({ ...formData, buyNav: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currentNav">Current NAV (₹)</Label>
                    <Input
                      id="currentNav"
                      type="number"
                      step="0.01"
                      placeholder="e.g., 72.3"
                      value={formData.currentNav}
                      onChange={(e) => setFormData({ ...formData, currentNav: e.target.value })}
                    />
                  </div>
                  <Button onClick={handleAdd} className="w-full">
                    Add Mutual Fund
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
                  <th className="text-left py-3 px-2 font-medium text-sm">Fund Name</th>
                  <th className="text-right py-3 px-2 font-medium text-sm">Units</th>
                  <th className="text-right py-3 px-2 font-medium text-sm">Buy NAV</th>
                  <th className="text-right py-3 px-2 font-medium text-sm">Current NAV</th>
                  <th className="text-right py-3 px-2 font-medium text-sm">Invested</th>
                  <th className="text-right py-3 px-2 font-medium text-sm">Current Value</th>
                  <th className="text-right py-3 px-2 font-medium text-sm">Gain/Loss</th>
                  <th className="text-center py-3 px-2 font-medium text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {mutualFunds.map((fund) => {
                  const invested = fund.units * fund.buyNav;
                  const current = fund.units * fund.currentNav;
                  const gainLoss = current - invested;
                  const gainLossPercent = (gainLoss / invested) * 100;

                  return (
                    <tr key={fund.id} className="border-b hover:bg-slate-50">
                      <td className="py-3 px-2 font-semibold">{fund.name}</td>
                      <td className="py-3 px-2 text-right">{fund.units.toFixed(3)}</td>
                      <td className="py-3 px-2 text-right">₹{fund.buyNav.toFixed(2)}</td>
                      <td className="py-3 px-2 text-right">
                        ₹{(fund.currentNav).toFixed(2)}
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
                            onClick={() => deleteMutualFund(fund.id)}
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
              <Bar dataKey="current" fill="#10b981" name="Current Value" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
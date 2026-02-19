import { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { usePortfolio } from '@/app/context/portfolio-context';
import { User, Mail, Phone, MapPin, CreditCard, Calendar, Building2, TrendingUp, Wallet, PieChart, Award } from 'lucide-react';
import { Progress } from '@/app/components/ui/progress';
import { Separator } from '@/app/components/ui/separator';
import { Activity } from 'lucide-react';

export default function ProfileTab() {
  const {
    indianStocks,
    cryptocurrencies,
    mutualFunds,
    goldSilver,
    foreignStocks,
    usdToInr,
  } = usePortfolio();

  // Calculate portfolio statistics
  const portfolioStats = useMemo(() => {

    const indianStocksValue = indianStocks.reduce(
      (acc, stock) => acc + stock.quantity * stock.currentPrice,
      0
    );
    const indianStocksInvested = indianStocks.reduce(
      (acc, stock) => acc + stock.quantity * stock.buyPrice,
      0
    );

    const cryptoValue = cryptocurrencies.reduce(
      (acc, crypto) => acc + crypto.quantity * crypto.currentPrice,
      0
    );
    const cryptoInvested = cryptocurrencies.reduce(
      (acc, crypto) => acc + crypto.quantity * crypto.buyPrice,
      0
    );

    const mutualFundsValue = mutualFunds.reduce(
      (acc, fund) => acc + fund.units * fund.currentNav,
      0
    );
    const mutualFundsInvested = mutualFunds.reduce(
      (acc, fund) => acc + fund.units * fund.buyNav,
      0
    );

    const goldSilverValue = goldSilver.reduce(
      (acc, gs) => acc + gs.grams * gs.currentPricePerGram,
      0
    );
    const goldSilverInvested = goldSilver.reduce(
      (acc, gs) => acc + gs.grams * gs.buyPricePerGram,
      0
    );

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

    // Calculate today's P&L (using change field)
    const todayPL = indianStocks.reduce((acc, stock) => {
      const dayChange = (stock.change || 0) * stock.quantity;
      return acc + dayChange;
    }, 0);

    return {
      totalValue,
      totalInvested,
      totalGainLoss,
      totalGainLossPercent,
      todayPL,
      indianStocksCount: indianStocks.length,
      cryptoCount: cryptocurrencies.length,
      mutualFundsCount: mutualFunds.length,
      foreignStocksCount: foreignStocks.length,
    };
  }, [indianStocks, cryptocurrencies, mutualFunds, goldSilver, foreignStocks, usdToInr]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="space-y-6">
      {/* User Profile Card */}
      <Card className="bg-gradient-to-br from-blue-500 to-blue-700 text-white border-0">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                <User className="h-10 w-10" />
              </div>
              <div>
                <CardTitle className="text-2xl text-white mb-1">John Doe</CardTitle>
                <CardDescription className="text-blue-100">Premium Member</CardDescription>
                <div className="flex items-center gap-2 mt-2">
                  <Award className="h-4 w-4" />
                  <span className="text-sm">Verified Investor</span>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 opacity-80" />
              <div>
                <div className="text-xs opacity-80">Email</div>
                <div className="text-sm font-medium">demo@gmail.com</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 opacity-80" />
              <div>
                <div className="text-xs opacity-80">Phone</div>
                <div className="text-sm font-medium">91XXXXXXXX</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 opacity-80" />
              <div>
                <div className="text-xs opacity-80">Location</div>
                <div className="text-sm font-medium">India</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Portfolio Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Portfolio Summary
          </CardTitle>
          <CardDescription>Overview of your holdings and performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-blue-700">Total Value</p>
                <TrendingUp className="h-4 w-4 text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-blue-900">
                {formatCurrency(portfolioStats.totalValue)}
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-slate-700">Invested</p>
                <Wallet className="h-4 w-4 text-slate-600" />
              </div>
              <p className="text-2xl font-bold text-slate-900">
                {formatCurrency(portfolioStats.totalInvested)}
              </p>
            </div>

            <div className={`p-4 rounded-lg border ${
              portfolioStats.totalGainLoss >= 0 
                ? 'bg-green-50 border-green-100' 
                : 'bg-red-50 border-red-100'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <p className={`text-sm ${portfolioStats.totalGainLoss >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                  Overall P&L
                </p>
                <TrendingUp className={`h-4 w-4 ${portfolioStats.totalGainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`} />
              </div>
              <p className={`text-2xl font-bold ${portfolioStats.totalGainLoss >= 0 ? 'text-green-900' : 'text-red-900'}`}>
                {formatCurrency(Math.abs(portfolioStats.totalGainLoss))}
              </p>
              <p className={`text-xs ${portfolioStats.totalGainLoss >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                {portfolioStats.totalGainLossPercent >= 0 ? '+' : ''}
                {portfolioStats.totalGainLossPercent.toFixed(2)}%
              </p>
            </div>

            <div className={`p-4 rounded-lg border ${
              portfolioStats.todayPL >= 0 
                ? 'bg-emerald-50 border-emerald-100' 
                : 'bg-rose-50 border-rose-100'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <p className={`text-sm ${portfolioStats.todayPL >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                  Today's P&L
                </p>
                <Activity className={`h-4 w-4 ${portfolioStats.todayPL >= 0 ? 'text-emerald-600' : 'text-rose-600'}`} />
              </div>
              <p className={`text-2xl font-bold ${portfolioStats.todayPL >= 0 ? 'text-emerald-900' : 'text-rose-900'}`}>
                {formatCurrency(Math.abs(portfolioStats.todayPL))}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Holdings Count */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="h-5 w-5" />
            Holdings Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg text-center">
              <div className="text-3xl font-bold text-blue-600">{portfolioStats.indianStocksCount}</div>
              <div className="text-sm text-blue-700 mt-1">Indian Stocks</div>
            </div>
            <div className="p-4 bg-amber-50 rounded-lg text-center">
              <div className="text-3xl font-bold text-amber-600">{portfolioStats.cryptoCount}</div>
              <div className="text-sm text-amber-700 mt-1">Cryptocurrencies</div>
            </div>
            <div className="p-4 bg-green-50 rounded-lg text-center">
              <div className="text-3xl font-bold text-green-600">{portfolioStats.mutualFundsCount}</div>
              <div className="text-sm text-green-700 mt-1">Mutual Funds</div>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg text-center">
              <div className="text-3xl font-bold text-purple-600">{portfolioStats.foreignStocksCount}</div>
              <div className="text-sm text-purple-700 mt-1">Foreign Stocks</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
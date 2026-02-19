import { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { usePortfolio } from '@/app/context/portfolio-context';
import { AlertTriangle, Shield, TrendingUp, PieChart } from 'lucide-react';
import { Progress } from '@/app/components/ui/progress';

export default function RiskAnalysis() {
  const {
    indianStocks,
    cryptocurrencies,
    mutualFunds,
    goldSilver,
    foreignStocks,
    usdToInr,
  } = usePortfolio();

  const analysis = useMemo(() => {

    // Calculate portfolio values
    const indianStocksValue = indianStocks.reduce(
      (acc, stock) => acc + stock.quantity * stock.currentPrice,
      0
    );
    const cryptoValue = cryptocurrencies.reduce(
      (acc, crypto) => acc + crypto.quantity * crypto.currentPrice,
      0
    );
    const mutualFundsValue = mutualFunds.reduce(
      (acc, fund) => acc + fund.units * fund.currentNav,
      0
    );
    const goldSilverValue = goldSilver.reduce(
      (acc, gs) => acc + gs.grams * gs.currentPricePerGram,
      0
    );
    const foreignStocksValue = foreignStocks.reduce(
      (acc, stock) => acc + stock.quantity * stock.currentPriceUSD * usdToInr,
      0
    );

    const totalValue = indianStocksValue + cryptoValue + mutualFundsValue + goldSilverValue + foreignStocksValue;

    // Calculate allocation percentages
    const allocations = {
      indianStocks: totalValue > 0 ? (indianStocksValue / totalValue) * 100 : 0,
      crypto: totalValue > 0 ? (cryptoValue / totalValue) * 100 : 0,
      mutualFunds: totalValue > 0 ? (mutualFundsValue / totalValue) * 100 : 0,
      goldSilver: totalValue > 0 ? (goldSilverValue / totalValue) * 100 : 0,
      foreignStocks: totalValue > 0 ? (foreignStocksValue / totalValue) * 100 : 0,
    };

    // Risk scoring (0-100, where 100 is highest risk)
    let riskScore = 0;
    const risks: { type: string; message: string; severity: 'high' | 'medium' | 'low' }[] = [];

    // Crypto over-concentration (>30% is risky)
    if (allocations.crypto > 30) {
      riskScore += 30;
      risks.push({
        type: 'Crypto Over-concentration',
        message: `${allocations.crypto.toFixed(1)}% in crypto is high risk. Consider reducing to below 30%.`,
        severity: 'high',
      });
    } else if (allocations.crypto > 20) {
      riskScore += 15;
      risks.push({
        type: 'Crypto Concentration',
        message: `${allocations.crypto.toFixed(1)}% in crypto. Monitor volatility closely.`,
        severity: 'medium',
      });
    }

    // Foreign stocks over-concentration (>40% is risky due to currency risk)
    if (allocations.foreignStocks > 40) {
      riskScore += 20;
      risks.push({
        type: 'Foreign Stocks Over-concentration',
        message: `${allocations.foreignStocks.toFixed(1)}% in foreign stocks increases currency risk.`,
        severity: 'high',
      });
    } else if (allocations.foreignStocks > 25) {
      riskScore += 10;
      risks.push({
        type: 'Foreign Stocks Exposure',
        message: `${allocations.foreignStocks.toFixed(1)}% in foreign stocks. Watch USD/INR movements.`,
        severity: 'medium',
      });
    }

    // Single asset class over-concentration (>60%)
    Object.entries(allocations).forEach(([key, value]) => {
      if (value > 60) {
        riskScore += 25;
        risks.push({
          type: 'Single Asset Over-concentration',
          message: `${value.toFixed(1)}% in ${key.replace(/([A-Z])/g, ' $1').trim()}. Diversify more.`,
          severity: 'high',
        });
      }
    });

    // Lack of diversification (less than 3 asset classes with >5% allocation)
    const diversifiedAssets = Object.values(allocations).filter((value) => value > 5).length;
    if (diversifiedAssets < 3) {
      riskScore += 20;
      risks.push({
        type: 'Low Diversification',
        message: `Only ${diversifiedAssets} asset class(es) with significant allocation. Diversify more.`,
        severity: 'high',
      });
    } else if (diversifiedAssets === 3) {
      riskScore += 10;
      risks.push({
        type: 'Moderate Diversification',
        message: 'Consider spreading across more asset classes for better risk management.',
        severity: 'medium',
      });
    }

    // No safe haven assets (gold/silver or mutual funds < 15%)
    const safeHavenAllocation = allocations.goldSilver + allocations.mutualFunds;
    if (safeHavenAllocation < 15) {
      riskScore += 15;
      risks.push({
        type: 'Insufficient Safe Haven Assets',
        message: `Only ${safeHavenAllocation.toFixed(1)}% in safe assets. Consider increasing gold/mutual funds.`,
        severity: 'medium',
      });
    }

    // Positive aspects
    const strengths: string[] = [];
    if (allocations.goldSilver > 5 && allocations.goldSilver < 20) {
      strengths.push('Good gold/silver allocation for portfolio stability');
    }
    if (diversifiedAssets >= 4) {
      strengths.push('Well-diversified across multiple asset classes');
    }
    if (allocations.crypto < 15) {
      strengths.push('Conservative crypto exposure reduces volatility');
    }
    if (allocations.mutualFunds > 15 && allocations.mutualFunds < 40) {
      strengths.push('Healthy mutual fund allocation for steady growth');
    }

    // Cap risk score at 100
    riskScore = Math.min(riskScore, 100);

    // Determine risk level
    let riskLevel: 'Low' | 'Moderate' | 'High' | 'Very High';
    let riskColor: string;
    if (riskScore < 25) {
      riskLevel = 'Low';
      riskColor = 'text-green-600';
    } else if (riskScore < 50) {
      riskLevel = 'Moderate';
      riskColor = 'text-yellow-600';
    } else if (riskScore < 75) {
      riskLevel = 'High';
      riskColor = 'text-orange-600';
    } else {
      riskLevel = 'Very High';
      riskColor = 'text-red-600';
    }

    return {
      riskScore,
      riskLevel,
      riskColor,
      allocations,
      risks,
      strengths,
      diversifiedAssets,
    };
  }, [indianStocks, cryptocurrencies, mutualFunds, goldSilver, foreignStocks, usdToInr]);

  return (
    <Card className="border-2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Portfolio Risk Analysis
            </CardTitle>
            <CardDescription>Assess your portfolio's risk profile and diversification</CardDescription>
          </div>
          <div className="text-right">
            <div className="text-sm text-slate-500">Risk Score</div>
            <div className={`text-3xl font-bold ${analysis.riskColor}`}>{analysis.riskScore}</div>
            <div className={`text-sm font-semibold ${analysis.riskColor}`}>{analysis.riskLevel}</div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Risk Score Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Risk Level</span>
            <span className={`font-semibold ${analysis.riskColor}`}>
              {analysis.riskScore}/100
            </span>
          </div>
          <Progress value={analysis.riskScore} className="h-3" />
          <div className="flex justify-between text-xs text-slate-500">
            <span>Low Risk</span>
            <span>Moderate</span>
            <span>High Risk</span>
          </div>
        </div>

        {/* Asset Allocation Breakdown */}
        <div>
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <PieChart className="h-4 w-4" />
            Asset Allocation
          </h3>
          <div className="space-y-3">
            <AllocationBar
              label="Indian Stocks"
              percentage={analysis.allocations.indianStocks}
              color="bg-blue-500"
            />
            <AllocationBar
              label="Cryptocurrency"
              percentage={analysis.allocations.crypto}
              color="bg-amber-500"
            />
            <AllocationBar
              label="Mutual Funds"
              percentage={analysis.allocations.mutualFunds}
              color="bg-green-500"
            />
            <AllocationBar
              label="Gold/Silver"
              percentage={analysis.allocations.goldSilver}
              color="bg-yellow-500"
            />
            <AllocationBar
              label="Foreign Stocks"
              percentage={analysis.allocations.foreignStocks}
              color="bg-purple-500"
            />
          </div>
        </div>

        {/* Risk Factors */}
        {analysis.risks.length > 0 && (
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              Risk Factors
            </h3>
            <div className="space-y-2">
              {analysis.risks.map((risk, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border-l-4 ${
                    risk.severity === 'high'
                      ? 'bg-red-50 border-red-500'
                      : risk.severity === 'medium'
                      ? 'bg-yellow-50 border-yellow-500'
                      : 'bg-blue-50 border-blue-500'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <AlertTriangle
                      className={`h-4 w-4 mt-0.5 flex-shrink-0 ${
                        risk.severity === 'high'
                          ? 'text-red-600'
                          : risk.severity === 'medium'
                          ? 'text-yellow-600'
                          : 'text-blue-600'
                      }`}
                    />
                    <div>
                      <div
                        className={`font-semibold text-sm ${
                          risk.severity === 'high'
                            ? 'text-red-900'
                            : risk.severity === 'medium'
                            ? 'text-yellow-900'
                            : 'text-blue-900'
                        }`}
                      >
                        {risk.type}
                      </div>
                      <div
                        className={`text-sm ${
                          risk.severity === 'high'
                            ? 'text-red-700'
                            : risk.severity === 'medium'
                            ? 'text-yellow-700'
                            : 'text-blue-700'
                        }`}
                      >
                        {risk.message}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Portfolio Strengths */}
        {analysis.strengths.length > 0 && (
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              Portfolio Strengths
            </h3>
            <div className="space-y-2">
              {analysis.strengths.map((strength, index) => (
                <div key={index} className="flex items-start gap-2 text-sm text-green-700">
                  <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5 flex-shrink-0" />
                  <span>{strength}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommendations */}
        <div className="bg-slate-50 p-4 rounded-lg border">
          <h3 className="font-semibold mb-2">Recommendations</h3>
          <ul className="space-y-1 text-sm text-slate-700">
            <li className="flex items-start gap-2">
              <span className="text-slate-400">•</span>
              <span>Maintain diversification across at least 4-5 asset classes</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-slate-400">•</span>
              <span>Keep high-risk assets (crypto) below 20% of total portfolio</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-slate-400">•</span>
              <span>Allocate 10-15% to safe haven assets like gold for stability</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-slate-400">•</span>
              <span>Review and rebalance your portfolio quarterly</span>
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

// Allocation Bar Component
function AllocationBar({
  label,
  percentage,
  color,
}: {
  label: string;
  percentage: number;
  color: string;
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">{label}</span>
        <span className="text-slate-600">{percentage.toFixed(1)}%</span>
      </div>
      <div className="w-full bg-slate-200 rounded-full h-2">
        <div
          className={`${color} h-2 rounded-full transition-all duration-300`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
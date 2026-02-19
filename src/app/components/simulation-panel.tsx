import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Slider } from '@/app/components/ui/slider';
import { Button } from '@/app/components/ui/button';
import { usePortfolio } from '@/app/context/portfolio-context';
import { TrendingUp, TrendingDown, RotateCcw } from 'lucide-react';

export default function SimulationPanel() {
  const { simulationPercentage, setSimulationPercentage } = usePortfolio();

  const handleReset = () => {
    setSimulationPercentage(0);
  };

  return (
    <Card className="bg-slate-50 border-2 border-dashed border-slate-300">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              {simulationPercentage >= 0 ? (
                <TrendingUp className="h-5 w-5 text-green-600" />
              ) : (
                <TrendingDown className="h-5 w-5 text-red-600" />
              )}
              Price Simulation
            </CardTitle>
            <CardDescription>
              See how market changes affect your portfolio
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={handleReset}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Market Change:</span>
            <span
              className={`text-2xl font-bold ${
                simulationPercentage >= 0 ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {simulationPercentage > 0 ? '+' : ''}
              {simulationPercentage}%
            </span>
          </div>
          <Slider
            value={[simulationPercentage]}
            onValueChange={(value) => setSimulationPercentage(value[0])}
            min={-50}
            max={50}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-slate-500">
            <span>-50% (Bear Market)</span>
            <span>0% (Current)</span>
            <span>+50% (Bull Market)</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

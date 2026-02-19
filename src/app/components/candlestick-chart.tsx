import { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface CandlestickChartProps {
  symbol: string;
  data?: any[];
}

export default function CandlestickChart({ symbol }: CandlestickChartProps) {
  // Generate candlestick data for the past 30 days
  const candlestickData = useMemo(() => {
    const data = [];
    let basePrice = 1500;
    
    for (let i = 30; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      const open = basePrice + (Math.random() - 0.5) * 20;
      const close = open + (Math.random() - 0.5) * 30;
      const high = Math.max(open, close) + Math.random() * 15;
      const low = Math.min(open, close) - Math.random() * 15;
      const volume = Math.floor(Math.random() * 1000000) + 500000;
      
      data.push({
        date: date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
        open: parseFloat(open.toFixed(2)),
        high: parseFloat(high.toFixed(2)),
        low: parseFloat(low.toFixed(2)),
        close: parseFloat(close.toFixed(2)),
        volume,
        // For visualization purposes
        body: [Math.min(open, close), Math.max(open, close)],
        wick: [low, high],
        color: close >= open ? '#10b981' : '#ef4444',
      });
      
      basePrice = close;
    }
    
    return data;
  }, [symbol]);

  const CustomCandlestick = (props: any) => {
    const { x, y, width, height, payload } = props;
    if (!payload) return null;

    const { open, close, high, low } = payload;
    const isGreen = close >= open;
    const color = isGreen ? '#10b981' : '#ef4444';
    
    const bodyTop = Math.min(open, close);
    const bodyBottom = Math.max(open, close);
    const bodyHeight = Math.abs(close - open);
    
    // Scale factor (approximate)
    const yScale = height / (Math.max(...candlestickData.map(d => d.high)) - Math.min(...candlestickData.map(d => d.low)));
    
    return (
      <g>
        {/* Wick (high-low line) */}
        <line
          x1={x + width / 2}
          y1={y}
          x2={x + width / 2}
          y2={y + height}
          stroke={color}
          strokeWidth={1}
        />
        {/* Body (open-close rectangle) */}
        <rect
          x={x + width * 0.2}
          y={isGreen ? y + height * 0.3 : y + height * 0.3}
          width={width * 0.6}
          height={Math.max(bodyHeight * yScale, 2)}
          fill={color}
          stroke={color}
        />
      </g>
    );
  };

  return (
    null
  );
}

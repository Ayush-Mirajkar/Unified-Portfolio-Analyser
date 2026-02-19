import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';

interface IndexData {
  time: string;
  value: number;
}

export default function IndicesChart() {
  const [niftyData, setNiftyData] = useState<IndexData[]>([]);
  const [bankNiftyData, setBankNiftyData] = useState<IndexData[]>([]);
  const [nifty50Current, setNifty50Current] = useState(22150);
  const [bankNiftyCurrent, setBankNiftyCurrent] = useState(47500);
  const nifty50Open = 22100;
  const bankNiftyOpen = 47450;

  // Initialize data on mount
  useEffect(() => {
    const now = new Date();
    const initialNiftyData: IndexData[] = [];
    const initialBankNiftyData: IndexData[] = [];

    // Generate initial data for the last 30 data points (every 3 seconds = 90 seconds total)
    for (let i = 29; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 3000);
      const timeStr = time.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      
      initialNiftyData.push({
        time: timeStr,
        value: nifty50Open + (Math.random() - 0.5) * 100,
      });

      initialBankNiftyData.push({
        time: timeStr,
        value: bankNiftyOpen + (Math.random() - 0.5) * 200,
      });
    }

    setNiftyData(initialNiftyData);
    setBankNiftyData(initialBankNiftyData);
  }, []);

  // Update live data every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

      // Update Nifty 50
      setNiftyData(prev => {
        const newValue = prev[prev.length - 1].value + (Math.random() - 0.5) * 20;
        setNifty50Current(newValue);
        const newData = [...prev.slice(1), { time: timeStr, value: newValue }];
        return newData;
      });

      // Update Bank Nifty
      setBankNiftyData(prev => {
        const newValue = prev[prev.length - 1].value + (Math.random() - 0.5) * 40;
        setBankNiftyCurrent(newValue);
        const newData = [...prev.slice(1), { time: timeStr, value: newValue }];
        return newData;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const niftyChange = nifty50Current - nifty50Open;
  const niftyChangePercent = (niftyChange / nifty50Open) * 100;

  const bankNiftyChange = bankNiftyCurrent - bankNiftyOpen;
  const bankNiftyChangePercent = (bankNiftyChange / bankNiftyOpen) * 100;

  const formatValue = (value: number) => value.toFixed(2);

  return (
    null
  );
}

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/app/components/ui/card';
import { Activity } from 'lucide-react';

export default function MarketStatus() {
  const [isMarketOpen, setIsMarketOpen] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
      
      // Market hours: 9:15 AM to 3:30 PM IST (Mon-Fri)
      const hours = currentTime.getHours();
      const minutes = currentTime.getMinutes();
      const day = currentTime.getDay();
      
      const isWeekday = day >= 1 && day <= 5;
      const isInTradingHours = 
        (hours === 9 && minutes >= 15) || 
        (hours > 9 && hours < 15) || 
        (hours === 15 && minutes <= 30);
      
      setIsMarketOpen(isWeekday && isInTradingHours);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="bg-white border-slate-200 shadow-sm">
      <CardContent className="py-3 px-4">
        <div className="flex items-center gap-3">
          <div className={`w-2 h-2 rounded-full ${isMarketOpen ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
          <div>
            <div className="text-xs text-slate-500">Market Status</div>
            <div className={`text-sm font-semibold ${isMarketOpen ? 'text-green-600' : 'text-red-600'}`}>
              {isMarketOpen ? 'Open' : 'Closed'}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
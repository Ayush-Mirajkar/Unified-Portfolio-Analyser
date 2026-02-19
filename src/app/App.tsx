import { useState, useEffect } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import PortfolioDashboard from "@/app/components/portfolio-dashboard";
import IndianStocksTab from "@/app/components/indian-stocks-tab";
import CryptocurrencyTab from "@/app/components/cryptocurrency-tab";
import MutualFundsTab from "@/app/components/mutual-funds-tab";
import GoldSilverTab from "@/app/components/gold-silver-tab";
import ForeignStocksTab from "@/app/components/foreign-stocks-tab";
import RiskAnalysis from "@/app/components/risk-analysis";
import ProfileTab from "@/app/components/profile-tab";
import WatchlistTab from "@/app/components/watchlist-tab";
import MarketStatus from "@/app/components/market-status";
import LoginPage from "@/app/components/login-page";
import { PortfolioProvider } from "@/app/context/portfolio-context";
import { LogOut, User } from "lucide-react";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState({
    email: "",
    name: "",
  });

  // Check for existing session on mount
  useEffect(() => {
    const savedAuth = localStorage.getItem("portfolioAuth");
    if (savedAuth) {
      const authData = JSON.parse(savedAuth);
      setIsAuthenticated(true);
      setCurrentUser(authData);
    }
  }, []);

  const handleLogin = (email: string, name: string) => {
    const authData = { email, name };
    localStorage.setItem(
      "portfolioAuth",
      JSON.stringify(authData),
    );
    setIsAuthenticated(true);
    setCurrentUser(authData);
  };

  const handleLogout = () => {
    localStorage.removeItem("portfolioAuth");
    setIsAuthenticated(false);
    setCurrentUser({ email: "", name: "" });
  };

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <PortfolioProvider>
      <div className="min-h-screen bg-slate-50">
        <div className="container mx-auto px-4 py-4 md:py-6 max-w-7xl">
          {/* Header */}
          <div className="mb-4 md:mb-6">
            <div className="flex items-start justify-between flex-wrap gap-4 bg-white rounded-xl p-4 md:p-6 shadow-sm border border-slate-200">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-1">
                  Unified Portfolio Analyzer
                </h1>
                <p className="text-sm text-slate-600">
                  Professional investment tracking & analytics
                  platform
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-lg">
                  <User className="h-4 w-4 text-slate-600" />
                  <div className="text-sm">
                    <div className="font-semibold text-slate-900">
                      {currentUser.name}
                    </div>
                    <div className="text-xs text-slate-500">
                      {currentUser.email}
                    </div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
                <MarketStatus />
              </div>
            </div>
          </div>

          {/* Main Tabs */}
          <Tabs defaultValue="dashboard" className="space-y-4">
            <TabsList className="grid w-full grid-cols-5 md:grid-cols-8 gap-1 h-auto p-1 bg-white shadow-sm border border-slate-200">
              <TabsTrigger
                value="dashboard"
                className="text-xs md:text-sm"
              >
                Dashboard
              </TabsTrigger>
              <TabsTrigger
                value="profile"
                className="text-xs md:text-sm"
              >
                Profile
              </TabsTrigger>
              <TabsTrigger
                value="watchlist"
                className="text-xs md:text-sm"
              >
                Watchlist
              </TabsTrigger>
              <TabsTrigger
                value="indian-stocks"
                className="text-xs md:text-sm"
              >
                Stocks
              </TabsTrigger>
              <TabsTrigger
                value="crypto"
                className="text-xs md:text-sm"
              >
                Crypto
              </TabsTrigger>
              <TabsTrigger
                value="mutual-funds"
                className="text-xs md:text-sm"
              >
                Funds
              </TabsTrigger>
              <TabsTrigger
                value="gold-silver"
                className="text-xs md:text-sm"
              >
                Gold/Silver
              </TabsTrigger>
              <TabsTrigger
                value="foreign-stocks"
                className="text-xs md:text-sm"
              >
                Foreign
              </TabsTrigger>
            </TabsList>

            <TabsContent
              value="dashboard"
              className="space-y-6"
            >
              <PortfolioDashboard />
              {/* Risk Analysis Section - Only visible in Dashboard */}
              <RiskAnalysis />
            </TabsContent>

            <TabsContent value="profile">
              <ProfileTab />
            </TabsContent>

            <TabsContent value="watchlist">
              <WatchlistTab />
            </TabsContent>

            <TabsContent value="indian-stocks">
              <IndianStocksTab />
            </TabsContent>

            <TabsContent value="crypto">
              <CryptocurrencyTab />
            </TabsContent>

            <TabsContent value="mutual-funds">
              <MutualFundsTab />
            </TabsContent>

            <TabsContent value="gold-silver">
              <GoldSilverTab />
            </TabsContent>

            <TabsContent value="foreign-stocks">
              <ForeignStocksTab />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </PortfolioProvider>
  );
}
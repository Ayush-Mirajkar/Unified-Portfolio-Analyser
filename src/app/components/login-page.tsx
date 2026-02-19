import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Badge } from '@/app/components/ui/badge';
import { Eye, EyeOff, TrendingUp, Shield, Lock, Mail } from 'lucide-react';

interface LoginPageProps {
  onLogin: (email: string, name: string) => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({
    login: '',
  });

  // Demo credentials
  const demoCredentials = {
    email: 'demo@gmail.com',
    password: 'demo123',
    name: 'John Doe',
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({ login: '' });

    if (!loginForm.email || !loginForm.password) {
      setErrors({ login: 'Please fill in all fields' });
      return;
    }

    // Check against demo credentials
    if (
      loginForm.email === demoCredentials.email &&
      loginForm.password === demoCredentials.password
    ) {
      onLogin(loginForm.email, demoCredentials.name);
    } else {
      setErrors({ login: 'Invalid email or password' });
    }
  };

  const handleDemoLogin = () => {
    onLogin(demoCredentials.email, demoCredentials.name);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Branding */}
        <div className="hidden lg:block">
          <div className="space-y-6">
            <div>
              <h1 className="text-5xl font-bold text-slate-900 mb-4">
                Unified Portfolio Analyzer
              </h1>
              <p className="text-xl text-slate-600">
                Professional investment tracking & analytics platform
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Multi-Asset Portfolio Tracking</h3>
                  <p className="text-sm text-slate-600">
                    Track stocks, crypto, mutual funds, gold/silver, and foreign investments in one place
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <Shield className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Advanced Risk Analysis</h3>
                  <p className="text-sm text-slate-600">
                    Get real-time risk assessments and concentration alerts for your portfolio
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm">
                <div className="bg-green-100 p-3 rounded-lg">
                  <Lock className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Live Market Data</h3>
                  <p className="text-sm text-slate-600">
                    Real-time price updates, live charts, and market status indicators
                  </p>
                </div>
              </div>
            </div>

            
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div>
          <Card className="shadow-2xl border-0">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-center">Welcome</CardTitle>
              <CardDescription className="text-center">
                Sign in to access your portfolio
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="Enter your email"
                      className="pl-10"
                      value={loginForm.email}
                      onChange={(e) =>
                        setLoginForm({ ...loginForm, email: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="login-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      className="pl-10 pr-10"
                      value={loginForm.password}
                      onChange={(e) =>
                        setLoginForm({ ...loginForm, password: e.target.value })
                      }
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {errors.login && (
                  <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                    {errors.login}
                  </div>
                )}

                <Button type="submit" className="w-full" size="lg">
                  Sign In
                </Button>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-slate-500">Or</span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={handleDemoLogin}
                >
                  Try Demo Account
                </Button>

                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-xs text-blue-800 font-semibold mb-1">Demo Credentials:</p>
                  <p className="text-xs text-blue-700">Email: demo@gmail.com</p>
                  <p className="text-xs text-blue-700">Password: demo123</p>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Mobile Branding */}
          <div className="lg:hidden mt-6 text-center">
            <p className="text-sm text-slate-600">
              Trusted by 10,000+ investors worldwide
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
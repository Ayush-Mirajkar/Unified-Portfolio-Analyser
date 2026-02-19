import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { 
  Calculator, 
  FileText, 
  TrendingUp, 
  Shield, 
  CheckCircle2, 
  Lock,
  Crown,
  Mail,
  Phone,
  Calendar,
  Star
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/app/components/ui/dialog';

export default function CAServicesTab() {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [showSubscriptionDialog, setShowSubscriptionDialog] = useState(false);

  const handleSubscribe = () => {
    setShowSubscriptionDialog(false);
    setIsSubscribed(true);
  };

  const caServices = [
    {
      id: 1,
      name: 'CA Rajesh Kumar',
      specialization: 'Tax Planning & Investment Advisory',
      experience: '15+ years',
      rating: 4.9,
      reviews: 250,
      availability: 'Available',
      email: 'rajesh.kumar@caservices.in',
      phone: '+91 98765 43210',
      image: '👨‍💼',
      services: ['Income Tax Filing', 'Tax Planning', 'Portfolio Review', 'Capital Gains Advisory'],
    },
    {
      id: 2,
      name: 'CA Priya Sharma',
      specialization: 'GST & Corporate Finance',
      experience: '12+ years',
      rating: 4.8,
      reviews: 180,
      availability: 'Available',
      email: 'priya.sharma@caservices.in',
      phone: '+91 98123 45678',
      image: '👩‍💼',
      services: ['GST Returns', 'Financial Planning', 'Wealth Management', 'Audit Services'],
    },
    {
      id: 3,
      name: 'CA Amit Patel',
      specialization: 'Wealth Management & Audit',
      experience: '18+ years',
      rating: 4.9,
      reviews: 320,
      availability: 'Busy',
      email: 'amit.patel@caservices.in',
      phone: '+91 97234 56789',
      image: '👨‍💼',
      services: ['Wealth Advisory', 'Retirement Planning', 'Estate Planning', 'Tax Optimization'],
    },
    {
      id: 4,
      name: 'CA Neha Gupta',
      specialization: 'Startup & Investment Advisory',
      experience: '10+ years',
      rating: 4.7,
      reviews: 150,
      availability: 'Available',
      email: 'neha.gupta@caservices.in',
      phone: '+91 96345 67890',
      image: '👩‍💼',
      services: ['Startup Advisory', 'Angel Investment Consulting', 'Portfolio Structuring', 'Tax Filing'],
    },
  ];

  const subscriptionFeatures = [
    'Unlimited consultation sessions with expert CAs',
    'Priority scheduling and 24/7 support',
    'Personalized tax planning and optimization',
    'Annual portfolio review and advisory',
    'GST, ITR, and audit services at discounted rates',
    'Direct access to CA via phone/email',
    'Monthly financial health reports',
    'Exclusive webinars and tax updates',
  ];

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white border-0">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Calculator className="h-6 w-6" />
                Chartered Accountant Services
                <Crown className="h-5 w-5 text-yellow-300" />
              </CardTitle>
              <CardDescription className="text-purple-100">
                Professional tax planning, advisory, and financial services
              </CardDescription>
            </div>
            {!isSubscribed && (
              <Badge className="bg-yellow-400 text-yellow-900 hover:bg-yellow-300">
                Premium
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {!isSubscribed ? (
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 bg-white/10 rounded-lg backdrop-blur">
              <div>
                <p className="font-semibold">Unlock Premium CA Services</p>
                <p className="text-sm text-purple-100">Get expert financial guidance from certified professionals</p>
              </div>
              <Button
                onClick={() => setShowSubscriptionDialog(true)}
                className="bg-yellow-400 text-yellow-900 hover:bg-yellow-300"
              >
                <Lock className="h-4 w-4 mr-2" />
                Subscribe Now
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2 p-4 bg-green-500/20 rounded-lg border border-green-300">
              <CheckCircle2 className="h-5 w-5 text-green-300" />
              <span className="font-semibold">Premium subscription active - Full access granted</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* CA Services Grid */}
      {isSubscribed ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {caServices.map((ca) => (
            <Card key={ca.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="text-5xl">{ca.image}</div>
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2">
                      {ca.name}
                      <Badge variant="outline" className="text-xs">
                        {ca.experience}
                      </Badge>
                    </CardTitle>
                    <CardDescription>{ca.specialization}</CardDescription>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-semibold">{ca.rating}</span>
                      </div>
                      <span className="text-xs text-slate-500">({ca.reviews} reviews)</span>
                      <Badge
                        variant={ca.availability === 'Available' ? 'default' : 'secondary'}
                        className={`text-xs ${
                          ca.availability === 'Available' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-orange-100 text-orange-800'
                        }`}
                      >
                        {ca.availability}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Services Offered */}
                <div>
                  <h4 className="text-sm font-semibold mb-2">Services Offered:</h4>
                  <div className="flex flex-wrap gap-2">
                    {ca.services.map((service, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {service}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-slate-500" />
                    <span className="text-slate-600">{ca.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-slate-500" />
                    <span className="text-slate-600">{ca.phone}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <Button variant="outline" className="w-full">
                    <Mail className="h-4 w-4 mr-2" />
                    Send Message
                  </Button>
                  <Button className="w-full">
                    <Calendar className="h-4 w-4 mr-2" />
                    Book Consultation
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        /* Locked Content Preview */
        <div className="relative">
          <div className="filter blur-sm pointer-events-none">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {caServices.slice(0, 2).map((ca) => (
                <Card key={ca.id}>
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className="text-5xl">{ca.image}</div>
                      <div className="flex-1">
                        <CardTitle>{ca.name}</CardTitle>
                        <CardDescription>{ca.specialization}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-32 bg-slate-100 rounded" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Card className="max-w-md shadow-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Premium Feature Locked
                </CardTitle>
                <CardDescription>
                  Subscribe to access professional CA services
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  onClick={() => setShowSubscriptionDialog(true)}
                  className="w-full bg-gradient-to-r from-purple-500 to-indigo-600"
                >
                  <Crown className="h-4 w-4 mr-2" />
                  Unlock with Premium Subscription
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Subscription Dialog */}
      <Dialog open={showSubscriptionDialog} onOpenChange={setShowSubscriptionDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-2">
              <Crown className="h-6 w-6 text-yellow-500" />
              Premium CA Services Subscription
            </DialogTitle>
            <DialogDescription>
              Get unlimited access to certified chartered accountants
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            {/* Pricing Plans */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="text-lg">Monthly</CardTitle>
                  <div className="text-3xl font-bold">₹2,999<span className="text-sm text-slate-500">/mo</span></div>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full" onClick={handleSubscribe}>
                    Select Plan
                  </Button>
                </CardContent>
              </Card>
              <Card className="border-2 border-purple-500 bg-purple-50 relative">
                <Badge className="absolute -top-2 right-4 bg-purple-500">Most Popular</Badge>
                <CardHeader>
                  <CardTitle className="text-lg">Quarterly</CardTitle>
                  <div className="text-3xl font-bold">₹7,999<span className="text-sm text-slate-500">/3mo</span></div>
                  <p className="text-xs text-green-600 font-semibold">Save ₹1,000</p>
                </CardHeader>
                <CardContent>
                  <Button className="w-full bg-purple-500 hover:bg-purple-600" onClick={handleSubscribe}>
                    Select Plan
                  </Button>
                </CardContent>
              </Card>
              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="text-lg">Annual</CardTitle>
                  <div className="text-3xl font-bold">₹24,999<span className="text-sm text-slate-500">/yr</span></div>
                  <p className="text-xs text-green-600 font-semibold">Save ₹10,989</p>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full" onClick={handleSubscribe}>
                    Select Plan
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Features List */}
            <div>
              <h3 className="font-semibold mb-3">What's Included:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {subscriptionFeatures.map((feature, index) => (
                  <div key={index} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center justify-around pt-4 border-t">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">500+</div>
                <div className="text-xs text-slate-500">Happy Clients</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">4.8★</div>
                <div className="text-xs text-slate-500">Average Rating</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">24/7</div>
                <div className="text-xs text-slate-500">Support</div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

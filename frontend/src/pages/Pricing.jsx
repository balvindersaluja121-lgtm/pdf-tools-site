import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Check } from 'lucide-react';
import { pricingPlans } from '../data/mockData';

const Pricing = () => {
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = useState('annual');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-white py-16 px-4">
        <div className="container mx-auto max-w-6xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Choose the plan that's right for you
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Start for free and upgrade when you need more power
          </p>

          {/* Billing Toggle */}
          <div className="mt-8 inline-flex items-center bg-gray-100 rounded-lg p-1">
            <button
              className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                billingCycle === 'monthly'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600'
              }`}
              onClick={() => setBillingCycle('monthly')}
            >
              Monthly
            </button>
            <button
              className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                billingCycle === 'annual'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600'
              }`}
              onClick={() => setBillingCycle('annual')}
            >
              Annual
              <Badge className="ml-2 bg-brand-orange text-white hover:bg-brand-orange-dark text-xs">Save 42%</Badge>
            </button>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map(plan => (
              <Card
                key={plan.id}
                className={`relative ${
                  plan.popular
                    ? 'border-2 border-red-600 shadow-xl scale-105'
                    : 'border border-gray-200'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-brand-orange text-white hover:bg-brand-orange-dark px-4 py-1">
                      Most Popular
                    </Badge>
                  </div>
                )}
                <CardHeader className="text-center pb-6">
                  <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                  <div className="mt-4">
                    {plan.originalPrice && billingCycle === 'annual' && (
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <span className="text-gray-400 line-through text-lg">
                          ${plan.originalPrice}
                        </span>
                        <Badge className="bg-green-100 text-green-700 hover:bg-green-200">
                          {plan.discount}
                        </Badge>
                      </div>
                    )}
                    <div className="flex items-baseline justify-center">
                      {typeof plan.price === 'number' ? (
                        <>
                          <span className="text-5xl font-bold text-gray-900">
                            ${billingCycle === 'annual' ? plan.price : plan.originalPrice}
                          </span>
                          <span className="text-gray-600 ml-2">{plan.period}</span>
                        </>
                      ) : (
                        <span className="text-5xl font-bold text-gray-900">{plan.price}</span>
                      )}
                    </div>
                    {plan.billingNote && billingCycle === 'annual' && (
                      <p className="text-sm text-gray-500 mt-2">{plan.billingNote}</p>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <Button
                    className={`w-full mb-6 ${
                      plan.popular
                        ? 'bg-brand-orange hover:bg-brand-orange-dark text-white'
                        : 'bg-white hover:bg-gray-50 text-gray-900 border border-gray-300'
                    }`}
                    onClick={() => navigate('/signup')}
                  >
                    {plan.buttonText}
                  </Button>
                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="h-5 w-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-white py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold mb-2">Can I use Easy Scan PDF for free?</h3>
              <p className="text-gray-600">
                Yes! Our free plan includes access to all basic PDF tools with some limitations on file size and processing volume.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-2">What payment methods do you accept?</h3>
              <p className="text-gray-600">
                We accept all major credit cards, PayPal, and other popular payment methods.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-2">Can I cancel my subscription anytime?</h3>
              <p className="text-gray-600">
                Yes, you can cancel your subscription at any time from your account settings.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-2">Is there a refund policy?</h3>
              <p className="text-gray-600">
                We offer a 30-day money-back guarantee for all paid plans.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Pricing;

import React, { useState } from 'react';
import { pdfTools, categories } from '../data/mockData';
import ToolCard from '../components/ToolCard';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { ArrowRight, Lock, Sparkles, Cloud } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const navigate = useNavigate();

  const filteredTools = selectedCategory === 'all'
    ? pdfTools
    : pdfTools.filter(tool => tool.category.includes(selectedCategory));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-brand-navy via-brand-navy-light to-brand-navy py-20 px-4">
        <div className="container mx-auto max-w-6xl text-center">
          <div className="inline-block mb-4">
            <span className="bg-brand-orange text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
              Professional PDF Tools
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Complete PDF Solution<br />for Your Business
          </h1>
          <p className="text-lg md:text-xl text-gray-200 max-w-3xl mx-auto mb-8">
            Professional-grade PDF tools designed for businesses. Merge, split, compress, and convert documents with enterprise-level security and reliability.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button 
              size="lg" 
              className="bg-brand-orange hover:bg-brand-orange-dark text-white font-semibold shadow-xl text-lg px-8 py-6"
              onClick={() => navigate('/merge-pdf')}
            >
              Get Started Free
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="bg-white text-brand-navy hover:bg-gray-100 font-semibold border-2 border-white text-lg px-8 py-6"
              onClick={() => navigate('/pricing')}
            >
              View Pricing
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-12 px-4 border-b">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-brand-orange mb-2">28+</div>
              <div className="text-gray-600 font-medium">PDF Tools Available</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-brand-orange mb-2">100%</div>
              <div className="text-gray-600 font-medium">Secure Processing</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-brand-orange mb-2">24/7</div>
              <div className="text-gray-600 font-medium">Available Access</div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="bg-white border-b py-6 px-4 sticky top-20 z-40 shadow-sm">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {categories.map(category => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? 'default' : 'outline'}
                className={
                  selectedCategory === category.id
                    ? 'bg-brand-orange text-white hover:bg-brand-orange-dark whitespace-nowrap font-semibold shadow-md'
                    : 'whitespace-nowrap border-brand-navy-light text-brand-navy hover:bg-brand-orange hover:text-white font-semibold'
                }
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTools.map(tool => (
              <ToolCard key={tool.id} tool={tool} />
            ))}

            {/* Create Workflow Card */}
            {selectedCategory === 'all' && (
              <Card className="cursor-pointer transition-all duration-200 hover:shadow-xl hover:-translate-y-1 border-2 border-brand-orange bg-gradient-to-br from-orange-50 to-amber-50">
                <div className="p-6 h-full flex flex-col justify-between">
                  <div>
                    <div className="bg-brand-orange p-3 rounded-lg w-fit mb-4">
                      <ArrowRight className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-brand-navy mb-3">
                      Create a workflow
                    </h3>
                    <p className="text-gray-700 text-sm mb-6">
                      Automate your PDF processing with custom workflows. Save time and increase productivity.
                    </p>
                  </div>
                  <Button
                    className="w-fit group bg-brand-orange hover:bg-brand-orange-dark text-white font-semibold"
                    onClick={() => navigate('/workflows')}
                  >
                    Create workflow
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </Card>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-brand-navy py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Why Choose Easy Scan PDF?
            </h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Enterprise-grade PDF solutions designed for professionals and businesses
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-brand-navy-light p-8 rounded-xl border border-brand-navy-light hover:border-brand-orange transition-all">
              <div className="w-16 h-16 bg-brand-orange rounded-lg flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Lock className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white text-center">Enterprise Security</h3>
              <p className="text-gray-300 text-center leading-relaxed">
                Bank-level encryption ensures your documents are processed securely with complete privacy protection
              </p>
            </div>
            <div className="bg-brand-navy-light p-8 rounded-xl border border-brand-navy-light hover:border-brand-orange transition-all">
              <div className="w-16 h-16 bg-brand-orange rounded-lg flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white text-center">Lightning Fast</h3>
              <p className="text-gray-300 text-center leading-relaxed">
                Advanced processing infrastructure delivers professional results in seconds, not minutes
              </p>
            </div>
            <div className="bg-brand-navy-light p-8 rounded-xl border border-brand-navy-light hover:border-brand-orange transition-all">
              <div className="w-16 h-16 bg-brand-orange rounded-lg flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Cloud className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white text-center">Always Available</h3>
              <p className="text-gray-300 text-center leading-relaxed">
                Access professional PDF tools from any device, anywhere, anytime with 99.9% uptime
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-brand-orange to-orange-600 py-16 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to streamline your PDF workflow?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join thousands of professionals using Easy Scan PDF
          </p>
          <Button 
            size="lg" 
            className="bg-brand-navy hover:bg-brand-navy-dark text-white font-semibold shadow-2xl text-lg px-10 py-6"
            onClick={() => navigate('/signup')}
          >
            Start Free Trial
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Home;

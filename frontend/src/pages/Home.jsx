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
      <section className="bg-white py-16 px-4">
        <div className="container mx-auto max-w-6xl text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Every tool you need to work with PDFs in one place
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-4xl mx-auto">
            Every tool you need to use PDFs, at your fingertips. All are 100% FREE and easy to use! Merge,
            split, compress, convert, rotate, unlock and watermark PDFs with just a few clicks.
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="bg-white border-y py-6 px-4 sticky top-16 z-40">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {categories.map(category => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? 'default' : 'outline'}
                className={
                  selectedCategory === category.id
                    ? 'bg-gray-900 text-white hover:bg-gray-800 whitespace-nowrap'
                    : 'whitespace-nowrap'
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
              <Card className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1 border border-gray-200 bg-gradient-to-br from-orange-50 to-pink-50">
                <div className="p-6 h-full flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      Create a workflow
                    </h3>
                    <p className="text-gray-600 text-sm mb-6">
                      Create custom workflows with your favorite tools, automate tasks, and reuse them anytime.
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    className="w-fit group"
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
      <section className="bg-white py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Secure & Private</h3>
              <p className="text-gray-600">
                All files are encrypted and automatically deleted after processing
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Fast & Easy</h3>
              <p className="text-gray-600">
                Process your files in seconds with our powerful servers
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Cloud className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Cloud Based</h3>
              <p className="text-gray-600">
                Works on any device with a browser, no installation needed
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

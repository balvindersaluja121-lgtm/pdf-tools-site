import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronDown, Menu, X } from 'lucide-react';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { pdfTools } from '../data/mockData';

const Header = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const quickTools = pdfTools.slice(0, 4);
  const convertTools = pdfTools.filter(tool => tool.category.includes('convert'));

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-brand-navy shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="bg-brand-orange p-2.5 rounded-lg shadow-lg">
              <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <span className="text-xl font-bold text-white tracking-tight">Easy Scan PDF</span>
              <p className="text-xs text-gray-300 -mt-0.5">Professional PDF Solutions</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            <Button
              variant="ghost"
              className="text-sm font-semibold text-white hover:bg-brand-navy-light hover:text-brand-orange transition-colors"
              onClick={() => navigate('/merge-pdf')}
            >
              MERGE PDF
            </Button>
            <Button
              variant="ghost"
              className="text-sm font-semibold text-white hover:bg-brand-navy-light hover:text-brand-orange transition-colors"
              onClick={() => navigate('/split-pdf')}
            >
              SPLIT PDF
            </Button>
            <Button
              variant="ghost"
              className="text-sm font-semibold text-white hover:bg-brand-navy-light hover:text-brand-orange transition-colors"
              onClick={() => navigate('/compress-pdf')}
            >
              COMPRESS PDF
            </Button>
            
            {/* Convert PDF Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-sm font-semibold text-white hover:bg-brand-navy-light hover:text-brand-orange transition-colors">
                  CONVERT PDF <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-white border-gray-200">
                {convertTools.slice(0, 8).map(tool => (
                  <DropdownMenuItem 
                    key={tool.id} 
                    onClick={() => navigate(tool.route)}
                    className="hover:bg-brand-orange hover:text-white cursor-pointer"
                  >
                    {tool.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* All PDF Tools Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-sm font-semibold text-white hover:bg-brand-navy-light hover:text-brand-orange transition-colors">
                  ALL PDF TOOLS <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 max-h-96 overflow-y-auto bg-white border-gray-200">
                {pdfTools.map(tool => (
                  <DropdownMenuItem 
                    key={tool.id} 
                    onClick={() => navigate(tool.route)}
                    className="hover:bg-brand-orange hover:text-white cursor-pointer"
                  >
                    {tool.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              className="hidden md:inline-flex text-white hover:bg-brand-navy-light hover:text-brand-orange font-semibold"
              onClick={() => navigate('/pricing')}
            >
              Pricing
            </Button>
            <Button
              variant="ghost"
              className="hidden md:inline-flex text-white hover:bg-brand-navy-light font-semibold"
              onClick={() => navigate('/login')}
            >
              Login
            </Button>
            <Button
              className="hidden md:inline-flex bg-brand-orange hover:bg-brand-orange-dark text-white font-semibold shadow-lg transition-all"
              onClick={() => navigate('/signup')}
            >
              Sign up
            </Button>

            {/* Mobile Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon" className="text-white">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 bg-brand-navy border-l border-brand-navy-light">
                <div className="flex flex-col space-y-4 mt-6">
                  <Button variant="ghost" className="text-white hover:bg-brand-navy-light justify-start" onClick={() => { navigate('/merge-pdf'); setMobileMenuOpen(false); }}>MERGE PDF</Button>
                  <Button variant="ghost" className="text-white hover:bg-brand-navy-light justify-start" onClick={() => { navigate('/split-pdf'); setMobileMenuOpen(false); }}>SPLIT PDF</Button>
                  <Button variant="ghost" className="text-white hover:bg-brand-navy-light justify-start" onClick={() => { navigate('/compress-pdf'); setMobileMenuOpen(false); }}>COMPRESS PDF</Button>
                  <div className="border-t border-brand-navy-light my-2"></div>
                  <Button variant="ghost" className="text-white hover:bg-brand-navy-light justify-start" onClick={() => { navigate('/pricing'); setMobileMenuOpen(false); }}>Pricing</Button>
                  <Button variant="ghost" className="text-white hover:bg-brand-navy-light justify-start" onClick={() => { navigate('/login'); setMobileMenuOpen(false); }}>Login</Button>
                  <Button className="bg-brand-orange hover:bg-brand-orange-dark text-white" onClick={() => { navigate('/signup'); setMobileMenuOpen(false); }}>Sign up</Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

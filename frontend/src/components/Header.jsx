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
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 text-2xl font-bold">
            <span className="text-gray-900">Easy Scan PDF</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            <Button
              variant="ghost"
              className="text-sm font-medium"
              onClick={() => navigate('/merge-pdf')}
            >
              MERGE PDF
            </Button>
            <Button
              variant="ghost"
              className="text-sm font-medium"
              onClick={() => navigate('/split-pdf')}
            >
              SPLIT PDF
            </Button>
            <Button
              variant="ghost"
              className="text-sm font-medium"
              onClick={() => navigate('/compress-pdf')}
            >
              COMPRESS PDF
            </Button>
            
            {/* Convert PDF Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-sm font-medium">
                  CONVERT PDF <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                {convertTools.slice(0, 8).map(tool => (
                  <DropdownMenuItem key={tool.id} onClick={() => navigate(tool.route)}>
                    {tool.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* All PDF Tools Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-sm font-medium">
                  ALL PDF TOOLS <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 max-h-96 overflow-y-auto">
                {pdfTools.map(tool => (
                  <DropdownMenuItem key={tool.id} onClick={() => navigate(tool.route)}>
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
              className="hidden md:inline-flex"
              onClick={() => navigate('/pricing')}
            >
              Pricing
            </Button>
            <Button
              variant="ghost"
              className="hidden md:inline-flex"
              onClick={() => navigate('/login')}
            >
              Login
            </Button>
            <Button
              className="hidden md:inline-flex bg-red-600 hover:bg-red-700 text-white"
              onClick={() => navigate('/signup')}
            >
              Sign up
            </Button>

            {/* Mobile Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex flex-col space-y-4 mt-6">
                  <Button variant="ghost" onClick={() => { navigate('/merge-pdf'); setMobileMenuOpen(false); }}>MERGE PDF</Button>
                  <Button variant="ghost" onClick={() => { navigate('/split-pdf'); setMobileMenuOpen(false); }}>SPLIT PDF</Button>
                  <Button variant="ghost" onClick={() => { navigate('/compress-pdf'); setMobileMenuOpen(false); }}>COMPRESS PDF</Button>
                  <Button variant="ghost" onClick={() => { navigate('/pricing'); setMobileMenuOpen(false); }}>Pricing</Button>
                  <Button variant="ghost" onClick={() => { navigate('/login'); setMobileMenuOpen(false); }}>Login</Button>
                  <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={() => { navigate('/signup'); setMobileMenuOpen(false); }}>Sign up</Button>
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

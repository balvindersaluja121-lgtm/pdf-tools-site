import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-brand-navy text-gray-300 border-t border-brand-navy-light">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center space-x-3 mb-4">
              <div className="bg-brand-orange p-2 rounded-lg">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <span className="text-white font-bold text-lg">Easy Scan PDF</span>
                <p className="text-xs text-gray-400">Professional PDF Solutions</p>
              </div>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              Enterprise-grade PDF tools for modern businesses. Secure, fast, and reliable.
            </p>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-white font-bold mb-4 text-lg">Product</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-brand-orange transition-colors">All Tools</Link></li>
              <li><Link to="/pricing" className="hover:text-brand-orange transition-colors">Pricing</Link></li>
              <li><Link to="/workflows" className="hover:text-brand-orange transition-colors">Workflows</Link></li>
              <li><Link to="/" className="hover:text-brand-orange transition-colors">Mobile App</Link></li>
              <li><Link to="/" className="hover:text-brand-orange transition-colors">Desktop</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-bold mb-4 text-lg">Company</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-brand-orange transition-colors">About Us</Link></li>
              <li><Link to="/" className="hover:text-brand-orange transition-colors">Blog</Link></li>
              <li><Link to="/" className="hover:text-brand-orange transition-colors">Press</Link></li>
              <li><Link to="/" className="hover:text-brand-orange transition-colors">Help Center</Link></li>
              <li><Link to="/" className="hover:text-brand-orange transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-bold mb-4 text-lg">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-brand-orange transition-colors">Privacy Policy</Link></li>
              <li><Link to="/" className="hover:text-brand-orange transition-colors">Terms of Service</Link></li>
              <li><Link to="/" className="hover:text-brand-orange transition-colors">Cookie Policy</Link></li>
              <li><Link to="/" className="hover:text-brand-orange transition-colors">Security</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-brand-navy-light mt-10 pt-8 text-sm text-center">
          <p className="text-gray-400">&copy; {new Date().getFullYear()} Easy Scan PDF. All rights reserved.</p>
          <p className="text-gray-500 mt-2 text-xs">Professional PDF Solutions for Modern Businesses</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

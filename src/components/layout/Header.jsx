import React, { useState } from 'react';
import { Menu, X, PaintBucket, Phone, Mail, MapPin, LogIn } from 'lucide-react';

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigation = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Services', href: '#services' },
    { name: 'Products', href: '#products' },
    { name: 'Gallery', href: '#gallery' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <header className="fixed top-0 w-full bg-white shadow-md z-50">
      {/* Top Bar */}
      <div className="bg-primaryClr text-primaryClrText py-2">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center text-sm">
            <div className="hidden md:flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Phone size={14} />
                <span>+251 911 234 567</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail size={14} />
                <span>info@rehamerpaint.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin size={14} />
                <span>Addis Ababa, Ethiopia</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <a href="#" className="hover:text-logoGold transition-colors">Facebook</a>
              <a href="#" className="hover:text-logoGold transition-colors">Twitter</a>
              <a href="#" className="hover:text-logoGold transition-colors">LinkedIn</a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="bg-white border-b border-secondaryClr">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <PaintBucket className="text-primaryClr" size={32} />
              <div>
                <h1 className="text-xl font-bold text-primaryClr">Rehamer</h1>
                <p className="text-xs text-logoGold font-medium">Paint Industry</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-primaryClr hover:text-logoGold transition-colors font-medium"
                >
                  {item.name}
                </a>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="hidden md:flex items-center space-x-3">
              <a 
                href="/login" 
                className="flex items-center space-x-2 text-primaryClr hover:text-logoGold transition-colors font-medium border border-primaryClr hover:border-logoGold px-4 py-2 rounded-lg"
              >
                <LogIn size={16} />
                <span>Login</span>
              </a>
              <button className="bg-logoGold hover:bg-primaryClr text-primaryClr px-6 py-2 rounded-lg font-medium transition-colors">
                Get Quote
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-primaryClr hover:text-logoGold transition-colors"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden bg-white border-t border-secondaryClr">
              <div className="px-2 pt-2 pb-3 space-y-1">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="block px-3 py-2 text-primaryClr hover:text-logoGold hover:bg-secondaryClr rounded-md font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </a>
                ))}
                <div className="px-3 py-2 space-y-2">
                  <a 
                    href="/login" 
                    className="w-full flex items-center justify-center space-x-2 text-primaryClr hover:text-logoGold font-medium border border-primaryClr hover:border-logoGold px-4 py-2 rounded-lg"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <LogIn size={16} />
                    <span>Login</span>
                  </a>
                  <button className="w-full bg-logoGold hover:bg-primaryClr text-primaryClr px-4 py-2 rounded-lg font-medium transition-colors">
                    Get Quote
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

import React, { useState } from 'react';
import { Menu, X, Phone, Mail, MapPin, LogIn } from 'lucide-react';

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
      <div className="bg-gradient-to-r from-primaryClr via-rainbowViolet to-rainbowIndigo text-primaryClrText py-2">
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
              <a href="#" className="hover:text-rainbowYellow transition-colors">Facebook</a>
              <a href="#" className="hover:text-rainbowOrange transition-colors">Twitter</a>
              <a href="#" className="hover:text-rainbowGreen transition-colors">LinkedIn</a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="bg-white border-b border-rainbowViolet">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <img 
                src="/src/assets/logo.png" 
                alt="RehamerPaint Logo" 
                className="h-8 w-auto transition-transform hover:scale-110"
              />
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-rainbowViolet to-rainbowIndigo bg-clip-text text-transparent">Rehamer</h1>
                <p className="text-xs text-rainbowOrange font-medium">Paint Industry</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-primaryClr hover:text-rainbowViolet transition-colors font-medium"
                >
                  {item.name}
                </a>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="hidden md:flex items-center space-x-3">
              <a 
                href="/login" 
                className="flex items-center space-x-2 text-primaryClr hover:text-rainbowViolet hover:border-rainbowViolet transition-colors font-medium border border-primaryClr px-4 py-2 rounded-lg"
              >
                <LogIn size={16} />
                <span>Login</span>
              </a>
              <button className="bg-gradient-to-r from-rainbowOrange to-rainbowYellow hover:from-rainbowYellow hover:to-rainbowGreen text-white px-6 py-2 rounded-lg font-medium transition-all transform hover:scale-105">
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

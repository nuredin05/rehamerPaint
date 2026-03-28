import React from 'react';
import { Phone, Mail, MapPin, MessageCircle, Share2, Users, Camera } from 'lucide-react';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  const services = [
    'Interior Painting',
    'Exterior Painting',
    'Commercial Painting',
    'Residential Painting',
    'Industrial Coatings',
    'Color Consultation'
  ];

  const quickLinks = [
    'About Us',
    'Our Services',
    'Portfolio',
    'Testimonials',
    'Contact Us',
    'FAQ'
  ];

  const contactInfo = [
    { icon: Phone, text: '+251 911 234 567' },
    { icon: Mail, text: 'info@rehamerpaint.com' },
    { icon: MapPin, text: 'Bole, Addis Ababa, Ethiopia' }
  ];

  return (
    <footer className="bg-gradient-to-br from-bgDark to-bgDarkAll text-primaryClrText">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <img 
                src="/src/assets/logo.png" 
                alt="RehamerPaint Logo" 
                className="h-6 w-auto transition-transform hover:scale-110"
              />
              <h3 className="text-xl font-bold bg-gradient-to-r from-rainbowYellow to-rainbowOrange bg-clip-text text-transparent">RehamerPaint</h3>
            </div>
            <p className="text-primaryClrText/80 leading-relaxed">
              Professional painting solutions that transform spaces and exceed expectations. Quality craftsmanship meets exceptional service.
            </p>
            <div className="flex space-x-3 pt-4">
              <a href="#" className="bg-gradient-to-r from-rainbowViolet to-rainbowIndigo hover:from-rainbowIndigo hover:to-rainbowBlue p-2 rounded-full transition-all transform hover:scale-110">
                <MessageCircle size={18} />
              </a>
              <a href="#" className="bg-gradient-to-r from-rainbowOrange to-rainbowYellow hover:from-rainbowYellow hover:to-rainbowGreen p-2 rounded-full transition-all transform hover:scale-110">
                <Share2 size={18} />
              </a>
              <a href="#" className="bg-gradient-to-r from-rainbowGreen to-rainbowBlue hover:from-rainbowBlue hover:to-rainbowIndigo p-2 rounded-full transition-all transform hover:scale-110">
                <Users size={18} />
              </a>
              <a href="#" className="bg-gradient-to-r from-rainbowYellow to-rainbowOrange hover:from-rainbowOrange hover:to-rainbowRed p-2 rounded-full transition-all transform hover:scale-110">
                <Camera size={18} />
              </a>
            </div>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold bg-gradient-to-r from-rainbowOrange to-rainbowYellow bg-clip-text text-transparent">Our Services</h4>
            <ul className="space-y-2">
              {services.map((service, index) => (
                <li key={index}>
                  <a 
                    href={service.href} 
                    className="text-primaryClrText/80 hover:text-rainbowYellow transition-colors"
                  >
                    {service.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold bg-gradient-to-r from-rainbowGreen to-rainbowBlue bg-clip-text text-transparent">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href} 
                    className="text-primaryClrText/80 hover:text-rainbowGreen transition-colors"
                  >
                    {link.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold bg-gradient-to-r from-rainbowViolet to-rainbowIndigo bg-clip-text text-transparent">Contact Info</h4>
            <div className="space-y-3">
              {contactInfo.map((info, index) => {
                const Icon = info.icon;
                return (
                  <div key={index} className="flex items-center space-x-2">
                    <Icon className="text-rainbowOrange" size={16} />
                    <span className="text-primaryClrText/80">{info.text}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primaryClrText/20 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-primaryClrText/60 text-sm">
              &copy; {currentYear} <span className="text-rainbowYellow font-semibold">RehamerPaint</span>. All rights reserved.
            </p>
            <div className="flex flex-col md:flex-row space-x-4 md:space-y-0 md:space-x-4 space-y-2">
              <a href="#" className="text-sm hover:text-rainbowOrange transition-colors">Privacy Policy</a>
              <a href="#" className="text-sm hover:text-rainbowOrange transition-colors">Terms of Service</a>
              <a href="#" className="text-sm hover:text-rainbowOrange transition-colors">Sitemap</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

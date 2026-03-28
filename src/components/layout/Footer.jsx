import React from 'react';
import { PaintBucket, Phone, Mail, MapPin, MessageCircle, Share2, Users, Camera } from 'lucide-react';

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
    <footer className="bg-primaryClr text-primaryClrText">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <PaintBucket className="text-logoGold" size={32} />
              <div>
                <h3 className="text-xl font-bold">Rehamer</h3>
                <p className="text-sm text-logoGold">Paint Industry</p>
              </div>
            </div>
            <p className="text-sm leading-relaxed">
              Your trusted partner for high-quality painting solutions. 
              We deliver excellence in every brush stroke, transforming spaces 
              with vibrant colors and lasting finishes.
            </p>
            <div className="flex space-x-3">
              <a href="#" className="bg-logoGold hover:bg-primaryClr text-primaryClr p-2 rounded-full transition-colors">
                <MessageCircle size={18} />
              </a>
              <a href="#" className="bg-logoGold hover:bg-primaryClr text-primaryClr p-2 rounded-full transition-colors">
                <Share2 size={18} />
              </a>
              <a href="#" className="bg-logoGold hover:bg-primaryClr text-primaryClr p-2 rounded-full transition-colors">
                <Users size={18} />
              </a>
              <a href="#" className="bg-logoGold hover:bg-primaryClr text-primaryClr p-2 rounded-full transition-colors">
                <Camera size={18} />
              </a>
            </div>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-logoGold">Our Services</h4>
            <ul className="space-y-2">
              {services.map((service, index) => (
                <li key={index}>
                  <a 
                    href="#" 
                    className="text-sm hover:text-logoGold transition-colors flex items-center group"
                  >
                    <span className="w-2 h-2 bg-logoGold rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {service}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-logoGold">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a 
                    href="#" 
                    className="text-sm hover:text-logoGold transition-colors flex items-center group"
                  >
                    <span className="w-2 h-2 bg-logoGold rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-logoGold">Contact Info</h4>
            <div className="space-y-3">
              {contactInfo.map((info, index) => {
                const Icon = info.icon;
                return (
                  <div key={index} className="flex items-center space-x-3">
                    <Icon className="text-logoGold" size={18} />
                    <span className="text-sm">{info.text}</span>
                  </div>
                );
              })}
            </div>
            <div className="pt-4">
              <h5 className="text-sm font-semibold mb-2 text-logoGold">Business Hours</h5>
              <p className="text-sm">Mon - Fri: 8:00 AM - 6:00 PM</p>
              <p className="text-sm">Sat: 9:00 AM - 4:00 PM</p>
              <p className="text-sm">Sun: Closed</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primaryClrLight mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-center md:text-left">
              © {currentYear} Rehamer Paint Industry. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-sm hover:text-logoGold transition-colors">Privacy Policy</a>
              <a href="#" className="text-sm hover:text-logoGold transition-colors">Terms of Service</a>
              <a href="#" className="text-sm hover:text-logoGold transition-colors">Sitemap</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

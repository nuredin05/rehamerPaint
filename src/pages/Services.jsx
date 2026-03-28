import React from 'react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { Palette, Brush, Droplets, Shield, Clock } from 'lucide-react';

export const Services = () => {
  const services = [
    {
      icon: Palette,
      title: 'Interior Painting',
      description: 'Transform your living spaces with our premium interior painting services. From color consultation to final touch-up.',
      features: ['Wall Painting', 'Ceiling Painting', 'Trim Work', 'Color Matching']
    },
    {
      icon: Brush,
      title: 'Exterior Painting',
      description: 'Protect and beautify your property with our durable exterior painting solutions using weather-resistant materials.',
      features: ['Surface Preparation', 'Weather-Resistant Paint', 'Power Washing', 'Trim Painting']
    },
    {
      icon: Droplets,
      title: 'Commercial Painting',
      description: 'Professional commercial painting services for businesses, offices, and retail spaces with minimal disruption.',
      features: ['After-Hours Service', 'Fast Turnaround', 'Commercial Grade Materials', 'Project Management']
    },
    {
      icon: Shield,
      title: 'Industrial Coatings',
      description: 'Specialized industrial coatings for factories, warehouses, and industrial facilities.',
      features: ['Epoxy Coatings', 'Anti-Slip Solutions', 'Chemical Resistance', 'Floor Coatings']
    },
    {
      icon: Clock,
      title: 'Consultation & Design',
      description: 'Expert color consultation and design services to help you choose the perfect palette.',
      features: ['Color Matching', 'Digital Visualization', 'Sample Creation', 'Trend Analysis']
    }
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Services Hero */}
      <section className="bg-gradient-to-br from-rainbowIndigo via-rainbowBlue to-rainbowGreen text-primaryClrText py-20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6 animate-fadeInUp">
              Our <span className="bg-gradient-to-r from-rainbowYellow to-rainbowOrange bg-clip-text text-transparent">Services</span>
            </h1>
            <p className="text-xl lg:text-2xl max-w-3xl mx-auto animate-fadeInUp">
              Comprehensive Painting Solutions for Every Need
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <div 
                  key={index} 
                  className="bg-white border border-rainbowViolet/20 rounded-xl p-6 hover:shadow-lg transition-all hover:scale-105 hover:border-rainbowViolet animate-fadeInUp"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-rainbowViolet to-rainbowIndigo rounded-full mb-4">
                    <Icon size={32} className="text-primaryClrText" />
                  </div>
                  <h3 className="text-xl font-bold text-primaryClr mb-3">
                    {service.title}
                  </h3>
                  <p className="text-primaryClrText/70 leading-relaxed mb-4">
                    {service.description}
                  </p>
                  <ul className="space-y-2">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center space-x-2 text-sm text-primaryClrText/80">
                        <span className="text-rainbowOrange">✓</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-gradient-to-r from-backgroundClr to-secondaryClr">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primaryClr mb-6">
              Our <span className="bg-gradient-to-r from-rainbowYellow to-rainbowOrange bg-clip-text text-transparent">Process</span>
            </h2>
            <p className="text-primaryClrText/80 max-w-3xl mx-auto">
              From consultation to completion, we ensure a smooth and professional experience
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: 1, title: 'Consultation', desc: 'Initial meeting and color selection' },
              { step: 2, title: 'Preparation', desc: 'Surface preparation and protection' },
              { step: 3, title: 'Application', desc: 'Professional painting execution' },
              { step: 4, title: 'Completion', desc: 'Final inspection and touch-up' }
            ].map((item, index) => (
              <div key={index} className="text-center animate-stagger-1">
                <div className="w-12 h-12 bg-gradient-to-r from-rainbowOrange to-rainbowYellow rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-primaryClrText font-bold">{item.step}</span>
                </div>
                <h4 className="font-semibold text-primaryClr mb-2">{item.title}</h4>
                <p className="text-sm text-primaryClrText/70">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-rainbowViolet to-rainbowIndigo text-primaryClrText">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Transform Your Space?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Get started with a free consultation and quote from our expert team
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-gradient-to-r from-rainbowOrange to-rainbowYellow hover:from-rainbowYellow hover:to-rainbowGreen text-white px-8 py-3 rounded-lg font-semibold transition-all transform hover:scale-105">
              Get Free Quote
            </button>
            <button className="border-2 border-white hover:bg-white hover:text-rainbowViolet text-white px-8 py-3 rounded-lg font-semibold transition-all">
              Schedule Consultation
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Services;

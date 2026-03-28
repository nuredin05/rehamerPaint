import React, { useState } from 'react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { PaintBucket, Droplet, Shield, Star, Filter } from 'lucide-react';

export const Products = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Products', icon: PaintBucket },
    { id: 'interior', name: 'Interior Paints', icon: Droplet },
    { id: 'exterior', name: 'Exterior Paints', icon: Shield },
    { id: 'industrial', name: 'Industrial Coatings', icon: Star },
    { id: 'specialty', name: 'Specialty Products', icon: Filter }
  ];

  const products = [
    {
      id: 1,
      name: 'Premium Interior Paint',
      category: 'interior',
      description: 'High-quality interior paint with excellent coverage and durability',
      features: ['Low VOC', 'Washable', 'Quick Dry', 'Premium Finish'],
      colors: ['White', 'Beige', 'Gray', 'Blue', 'Green'],
      price: '$45/gal'
    },
    {
      id: 2,
      name: 'Weather-Resistant Exterior',
      category: 'exterior',
      description: 'Durable exterior paint designed to withstand harsh weather conditions',
      features: ['UV Protection', 'Mold Resistant', '10 Year Warranty', 'Flexible'],
      colors: ['White', 'Beige', 'Taupe', 'Gray', 'Navy'],
      price: '$55/gal'
    },
    {
      id: 3,
      name: 'Industrial Epoxy Coating',
      category: 'industrial',
      description: 'Heavy-duty epoxy coating for industrial and commercial applications',
      features: ['Chemical Resistant', 'High Traffic', 'Anti-Slip', 'Industrial Grade'],
      colors: ['Clear', 'Gray', 'Safety Yellow', 'Black'],
      price: '$85/gal'
    },
    {
      id: 4,
      name: 'Specialty Primer',
      category: 'specialty',
      description: 'Multi-purpose primer for optimal paint adhesion and coverage',
      features: ['Stain Blocking', 'Quick Dry', 'Universal Base', 'Sealant Properties'],
      colors: ['White', 'Gray', 'Tinted Base'],
      price: '$35/gal'
    },
    {
      id: 5,
      name: 'Eco-Friendly Paint',
      category: 'interior',
      description: 'Environmentally conscious paint with zero VOC and natural ingredients',
      features: ['Zero VOC', 'Natural Ingredients', 'Child Safe', 'Green Certified'],
      colors: ['Earth Tones', 'Pastels', 'White'],
      price: '$52/gal'
    }
  ];

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Products Hero */}
      <section className="bg-gradient-to-br from-rainbowBlue via-rainbowGreen to-rainbowYellow text-primaryClrText py-20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6 animate-fadeInUp">
              Our <span className="bg-gradient-to-r from-rainbowOrange to-rainbowRed bg-clip-text text-transparent">Products</span>
            </h1>
            <p className="text-xl lg:text-2xl max-w-3xl mx-auto animate-fadeInUp">
              Premium Paint Solutions for Every Application
            </p>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 bg-white border-b border-rainbowViolet/20">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all ${
                    selectedCategory === category.id
                      ? 'bg-gradient-to-r from-rainbowViolet to-rainbowIndigo text-white shadow-lg'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700 hover:scale-105'
                  }`}
                >
                  <Icon size={16} />
                  <span className="font-medium">{category.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <div 
                key={product.id} 
                className="bg-white border border-rainbowViolet/20 rounded-xl p-6 hover:shadow-lg transition-all hover:scale-105 hover:border-rainbowViolet animate-fadeInUp"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-primaryClr mb-2">
                    {product.name}
                  </h3>
                  <span className="bg-gradient-to-r from-rainbowOrange to-rainbowYellow text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {product.price}
                  </span>
                </div>
                
                <p className="text-primaryClrText/70 leading-relaxed mb-4">
                  {product.description}
                </p>
                
                <div className="space-y-3">
                  <h4 className="font-semibold text-primaryClr mb-2">Key Features:</h4>
                  <div className="flex flex-wrap gap-2">
                    {product.features.map((feature, index) => (
                      <span 
                        key={index}
                        className="bg-gradient-to-r from-rainbowGreen to-rainbowBlue text-white px-2 py-1 rounded text-xs"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-semibold text-primaryClr mb-2">Available Colors:</h4>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((color, index) => (
                      <div 
                        key={index}
                        className="w-8 h-8 rounded border-2 border-gray-300 flex items-center justify-center text-xs"
                        style={{ 
                          backgroundColor: color.toLowerCase() === 'white' ? '#ffffff' : 
                                         color.toLowerCase() === 'black' ? '#000000' :
                                         color.toLowerCase() === 'gray' ? '#6b7280' :
                                         color.toLowerCase() === 'blue' ? '#3b82f6' :
                                         color.toLowerCase() === 'green' ? '#10b981' :
                                         color.toLowerCase() === 'beige' ? '#d2b48c' :
                                         color.toLowerCase() === 'taupe' ? '#92400e' :
                                         color.toLowerCase() === 'navy' ? '#1e3a8a' :
                                         '#f59e0b'
                        }}
                      >
                        {color}
                      </div>
                    ))}
                  </div>
                </div>
                
                <button className="w-full bg-gradient-to-r from-rainbowViolet to-rainbowIndigo hover:from-rainbowIndigo hover:to-rainbowBlue text-white py-3 rounded-lg font-semibold transition-all transform hover:scale-105">
                  Request Quote
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-backgroundClr to-secondaryClr">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-primaryClr mb-6">
            Need Custom Color Matching?
          </h2>
          <p className="text-primaryClrText/80 mb-8 max-w-2xl mx-auto">
            Our experts can create custom colors to match your exact specifications
          </p>
          <button className="bg-gradient-to-r from-rainbowOrange to-rainbowYellow hover:from-rainbowYellow hover:to-rainbowGreen text-white px-8 py-3 rounded-lg font-semibold transition-all transform hover:scale-105">
            Get Color Consultation
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Products;

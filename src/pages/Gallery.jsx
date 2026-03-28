import React, { useState } from 'react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { Camera, Heart, Share2, Filter, Grid } from 'lucide-react';

export const Gallery = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedImage, setSelectedImage] = useState(null);

  const categories = [
    { id: 'all', name: 'All Projects' },
    { id: 'residential', name: 'Residential' },
    { id: 'commercial', name: 'Commercial' },
    { id: 'industrial', name: 'Industrial' }
  ];

  const galleryItems = [
    {
      id: 1,
      title: 'Modern Living Room Transformation',
      category: 'residential',
      description: 'Complete living room makeover with custom color scheme',
      before: 'living-room-before.jpg',
      after: 'living-room-after.jpg',
      tags: ['Interior', 'Living Room', 'Modern']
    },
    {
      id: 2,
      title: 'Exterior Home Makeover',
      category: 'residential',
      description: 'Full exterior renovation with weather-resistant paints',
      before: 'exterior-before.jpg',
      after: 'exterior-after.jpg',
      tags: ['Exterior', 'Home', 'Renovation']
    },
    {
      id: 3,
      title: 'Office Building Renovation',
      category: 'commercial',
      description: 'Commercial office space with professional finish',
      before: 'office-before.jpg',
      after: 'office-after.jpg',
      tags: ['Commercial', 'Office', 'Professional']
    },
    {
      id: 4,
      title: 'Industrial Facility Coating',
      category: 'industrial',
      description: 'Industrial epoxy coating application',
      before: 'industrial-before.jpg',
      after: 'industrial-after.jpg',
      tags: ['Industrial', 'Epoxy', 'Heavy Duty']
    },
    {
      id: 5,
      title: 'Kitchen Cabinet Refresh',
      category: 'residential',
      description: 'Kitchen cabinet painting with modern hardware',
      before: 'kitchen-before.jpg',
      after: 'kitchen-after.jpg',
      tags: ['Kitchen', 'Cabinets', 'Refresh']
    },
    {
      id: 6,
      title: 'Retail Store Interior',
      category: 'commercial',
      description: 'Retail space with brand-appropriate colors',
      before: 'retail-before.jpg',
      after: 'retail-after.jpg',
      tags: ['Retail', 'Branding', 'Interior']
    }
  ];

  const filteredItems = selectedCategory === 'all' 
    ? galleryItems 
    : galleryItems.filter(item => item.category === selectedCategory);

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Gallery Hero */}
      <section className="bg-gradient-to-br from-rainbowGreen via-rainbowBlue to-rainbowViolet text-primaryClrText py-20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6 animate-fadeInUp">
              Our <span className="bg-gradient-to-r from-rainbowYellow to-rainbowOrange bg-clip-text text-transparent">Gallery</span>
            </h1>
            <p className="text-xl lg:text-2xl max-w-3xl mx-auto animate-fadeInUp">
              Showcase of Our Recent Projects
            </p>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 bg-white border-b border-rainbowViolet/20">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-2 rounded-full transition-all ${
                  selectedCategory === category.id
                    ? 'bg-gradient-to-r from-rainbowViolet to-rainbowIndigo text-white shadow-lg'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700 hover:scale-105'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item) => (
              <div 
                key={item.id} 
                className="group cursor-pointer animate-fadeInUp"
                onClick={() => setSelectedImage(item)}
              >
                <div className="relative overflow-hidden rounded-xl border border-rainbowViolet/20 hover:border-rainbowViolet transition-all hover:shadow-lg">
                  <div className="aspect-widescreen relative">
                    <img 
                      src={`/api/placeholder/${item.before}`}
                      alt={`${item.title} - Before`}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="text-white text-center">
                        <p className="text-sm font-medium mb-2">Before</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="aspect-widescreen relative">
                    <img 
                      src={`/api/placeholder/${item.after}`}
                      alt={`${item.title} - After`}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="text-white text-center">
                        <p className="text-sm font-medium mb-2">After</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 space-y-3">
                  <h3 className="text-lg font-bold text-primaryClr mb-2 group-hover:text-rainbowViolet transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-primaryClrText/70 text-sm mb-3">
                    {item.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {item.tags.map((tag, index) => (
                      <span 
                        key={index}
                        className="bg-gradient-to-r from-rainbowOrange to-rainbowYellow text-white px-3 py-1 rounded-full text-xs font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <button className="flex items-center space-x-2 text-rainbowViolet hover:text-rainbowIndigo transition-colors">
                      <Heart size={16} />
                      <span>Like</span>
                    </button>
                    <button className="flex items-center space-x-2 text-rainbowViolet hover:text-rainbowIndigo transition-colors">
                      <Share2 size={16} />
                      <span>Share</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Image Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setSelectedImage(null)}
        >
          <div 
            className="bg-white rounded-xl max-w-4xl max-h-[90vh] overflow-hidden animate-slideInFromTop"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="aspect-video relative">
                <img 
                  src={`/api/placeholder/${selectedImage.before}`}
                  alt="Before"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 bg-black/60 text-white px-3 py-1 rounded">
                  Before
                </div>
              </div>
              <div className="aspect-video relative">
                <img 
                  src={`/api/placeholder/${selectedImage.after}`}
                  alt="After"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 bg-gradient-to-r from-rainbowOrange to-rainbowYellow text-white px-3 py-1 rounded">
                  After
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-gray-200">
              <h3 className="text-xl font-bold text-primaryClr mb-2">
                {selectedImage.title}
              </h3>
              <p className="text-primaryClrText/70 mb-3">
                {selectedImage.description}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  {selectedImage.tags.map((tag, index) => (
                    <span 
                      key={index}
                      className="bg-gradient-to-r from-rainbowOrange to-rainbowYellow text-white px-3 py-1 rounded-full text-xs font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <button 
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                  onClick={() => setSelectedImage(null)}
                >
                  ✕
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Gallery;

import React from 'react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { 
  PaintBucket, 
  Shield, 
  Award, 
  Users, 
  Clock, 
  CheckCircle,
  ArrowRight,
  Star,
  Palette,
  Brush,
  Droplet
} from 'lucide-react';

export const Landing = () => {
  const features = [
    {
      icon: Shield,
      title: 'Premium Quality',
      description: 'Using only the finest materials and latest techniques for lasting results.'
    },
    {
      icon: Users,
      title: 'Expert Team',
      description: 'Professional painters with years of experience in residential and commercial projects.'
    },
    {
      icon: Clock,
      title: 'On Time Delivery',
      description: 'We respect your time and complete projects within the agreed timeframe.'
    },
    {
      icon: Award,
      title: 'Satisfaction Guaranteed',
      description: 'Your satisfaction is our priority. We stand behind our work 100%.'
    }
  ];

  const services = [
    {
      icon: Brush,
      title: 'Interior Painting',
      description: 'Transform your living spaces with our expert interior painting services.',
      features: ['Wall Painting', 'Ceiling Painting', 'Trim & Molding', 'Color Consultation']
    },
    {
      icon: PaintBucket,
      title: 'Exterior Painting',
      description: 'Protect and beautify your property with our durable exterior painting solutions.',
      features: ['Weather Protection', 'Surface Preparation', 'Color Matching', 'Long-lasting Finishes']
    },
    {
      icon: Droplet,
      title: 'Specialty Coatings',
      description: 'Advanced coating solutions for industrial and commercial applications.',
      features: ['Epoxy Coatings', 'Anti-corrosive', 'Heat Resistant', 'Custom Solutions']
    }
  ];

  const testimonials = [
    {
      name: 'Abebe Kebede',
      role: 'Homeowner',
      content: 'Rehamer Paint transformed our home completely. The attention to detail and professionalism was outstanding.',
      rating: 5
    },
    {
      name: 'Tigist Haile',
      role: 'Business Owner',
      content: 'Excellent service from start to finish. Our office looks brand new and the team was very professional.',
      rating: 5
    },
    {
      name: 'Kassahun Bekele',
      role: 'Property Manager',
      content: 'We\'ve been using Rehamer Paint for all our properties. Reliable, affordable, and high-quality work.',
      rating: 5
    }
  ];

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={16}
        className={i < rating ? 'fill-current text-logoGold' : 'text-gray-300'}
      />
    ));
  };

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Banner */}
      <section id="home" className="relative min-h-screen pt-20">
        {/* Background Image with Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1589927986089-358ddd5b89bc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primaryClr via-primaryClr/90 to-primaryClrLight/80"></div>
        </div>
        
        <div className="relative container mx-auto px-4 py-24 lg:py-32 text-primaryClrText">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-10rem)]">
            <div className="space-y-6 animate-fadeInLeft">
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                Transform Your Space with
                <span className="text-logoGold"> Premium Paint</span> Solutions
              </h1>
              <p className="text-lg lg:text-xl leading-relaxed opacity-90">
                Professional painting services that bring your vision to life. 
                Quality craftsmanship meets exceptional service for results that exceed expectations.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <button className="bg-logoGold hover:bg-primaryClr text-primaryClr px-8 py-4 rounded-lg font-semibold transition-all transform hover:scale-105 flex items-center justify-center space-x-2 hover-lift">
                  <span>Get Free Quote</span>
                  <ArrowRight size={20} />
                </button>
                <button className="border-2 border-white hover:bg-white hover:text-primaryClr text-white px-8 py-4 rounded-lg font-semibold transition-all flex items-center justify-center space-x-2 hover-lift">
                  <span>View Portfolio</span>
                  <Palette size={20} />
                </button>
              </div>
              <div className="flex items-center space-x-8 pt-4">
                <div className="animate-stagger-1">
                  <p className="text-3xl font-bold text-logoGold">500+</p>
                  <p className="text-sm">Projects Completed</p>
                </div>
                <div className="animate-stagger-2">
                  <p className="text-3xl font-bold text-logoGold">10+</p>
                  <p className="text-sm">Years Experience</p>
                </div>
                <div className="animate-stagger-3">
                  <p className="text-3xl font-bold text-logoGold">98%</p>
                  <p className="text-sm">Client Satisfaction</p>
                </div>
              </div>
            </div>
            <div className="relative animate-fadeInRight">
              <div className="bg-gradient-to-br from-logoGold to-primaryClr rounded-2xl p-8 transform rotate-3 hover:rotate-6 transition-transform duration-300 animate-pulse">
                <div className="bg-white rounded-xl p-6 -rotate-3 hover:-rotate-6 transition-transform duration-300">
                  <PaintBucket className="text-primaryClr mb-4 animate-bounce" size={64} />
                  <h3 className="text-2xl font-bold text-primaryClr mb-2">Quality Guaranteed</h3>
                  <p className="text-gray-600">Professional painting services you can trust</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-bgLight">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-primaryClr mb-4">
              Why Choose <span className="text-logoGold">Rehamer Paint</span>
            </h2>
            <p className="text-lg text-place max-w-2xl mx-auto">
              We combine expertise, quality materials, and exceptional service to deliver outstanding results
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className={`bg-white rounded-lg shadow-card border border-secondaryClr p-6 hover:shadow-lg transition-shadow hover-lift animate-fadeInUp animate-stagger-${index + 1}`}>
                  <div className="bg-logoGold rounded-lg p-4 inline-block mb-4">
                    <Icon size={32} className="text-primaryClr" />
                  </div>
                  <h3 className="text-xl font-semibold text-primaryClr mb-2">{feature.title}</h3>
                  <p className="text-place">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-primaryClr mb-4">
              Our <span className="text-logoGold">Services</span>
            </h2>
            <p className="text-lg text-place max-w-2xl mx-auto">
              Comprehensive painting solutions tailored to your specific needs
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <div key={index} className="bg-bgLight rounded-lg shadow-card border border-secondaryClr p-6 hover:shadow-lg transition-all hover:border-logoGold">
                  <div className="bg-primaryClr rounded-lg p-4 inline-block mb-4">
                    <Icon size={32} className="text-primaryClrText" />
                  </div>
                  <h3 className="text-xl font-semibold text-primaryClr mb-3">{service.title}</h3>
                  <p className="text-place mb-4">{service.description}</p>
                  <ul className="space-y-2">
                    {service.features.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-center text-sm text-place">
                        <CheckCircle size={16} className="text-accentClr mr-2 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-bgLight">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-primaryClr mb-4">
              What Our <span className="text-logoGold">Clients Say</span>
            </h2>
            <p className="text-lg text-place max-w-2xl mx-auto">
              Don't just take our word for it - hear from our satisfied customers
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-lg shadow-card border border-secondaryClr p-6">
                <div className="flex mb-4">
                  {renderStars(testimonial.rating)}
                </div>
                <p className="text-place mb-4 italic">"{testimonial.content}"</p>
                <div className="flex items-center">
                  <div className="bg-primaryClrLight rounded-full w-12 h-12 flex items-center justify-center mr-3">
                    <Users size={20} className="text-primaryClr" />
                  </div>
                  <div>
                    <p className="font-semibold text-primaryClr">{testimonial.name}</p>
                    <p className="text-sm text-place">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primaryClr to-primaryClrLight text-primaryClrText">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Ready to Transform Your Space?
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
            Get in touch with us today for a free consultation and quote. 
            Let's bring your vision to life with our expert painting services.
          </p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center">
            <button className="bg-logoGold hover:bg-primaryClr text-primaryClr px-8 py-4 rounded-lg font-semibold transition-all transform hover:scale-105 flex items-center justify-center space-x-2">
              <span>Get Free Quote</span>
              <ArrowRight size={20} />
            </button>
            <button className="border-2 border-white hover:bg-white hover:text-primaryClr text-white px-8 py-4 rounded-lg font-semibold transition-all">
              Call Us Now
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

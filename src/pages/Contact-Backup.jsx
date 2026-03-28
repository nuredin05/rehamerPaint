import React, { useState } from 'react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { Phone, Mail, MapPin, Clock, Send, MessageSquare } from 'lucide-react';

export const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    service: 'general'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');

  const services = [
    { value: 'general', label: 'General Inquiry' },
    { value: 'quote', label: 'Request Quote' },
    { value: 'consultation', label: 'Schedule Consultation' },
    { value: 'support', label: 'Technical Support' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('');

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        service: 'general'
      });
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      <section className="bg-gradient-to-br from-rainbowViolet via-rainbowIndigo to-rainbowBlue text-primaryClrText py-20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6 animate-fadeInUp">
              Contact <span className="bg-gradient-to-r from-rainbowYellow to-rainbowOrange bg-clip-text text-transparent">RehamerPaint</span>
            </h1>
            <p className="text-xl lg:text-2xl max-w-3xl mx-auto animate-fadeInUp">
              Get in Touch with Our Expert Team
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="text-center animate-fadeInUp">
              <div className="w-16 h-16 bg-gradient-to-r from-rainbowOrange to-rainbowYellow rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone size={32} className="text-primaryClrText" />
              </div>
              <h3 className="text-xl font-bold text-primaryClr mb-2">Phone</h3>
              <p className="text-primaryClrText/80">+251 911 234 567</p>
              <p className="text-sm text-primaryClrText/60">Mon-Fri: 8AM-6PM</p>
            </div>
            
            <div className="text-center animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
              <div className="w-16 h-16 bg-gradient-to-r from-rainbowYellow to-rainbowGreen rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail size={32} className="text-primaryClrText" />
              </div>
              <h3 className="text-xl font-bold text-primaryClr mb-2">Email</h3>
              <p className="text-primaryClrText/80">info@rehamerpaint.com</p>
              <p className="text-sm text-primaryClrText/60">24/7 Support</p>
            </div>
            
            <div className="text-center animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
              <div className="w-16 h-16 bg-gradient-to-r from-rainbowGreen to-rainbowBlue rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin size={32} className="text-primaryClrText" />
              </div>
              <h3 className="text-xl font-bold text-primaryClr mb-2">Location</h3>
              <p className="text-primaryClrText/80">Bole, Addis Ababa, Ethiopia</p>
              <p className="text-sm text-primaryClrText/60">Main Office & Workshop</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-r from-backgroundClr to-secondaryClr">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-primaryClr mb-6">
                Send Us a <span className="bg-gradient-to-r from-rainbowYellow to-rainbowOrange bg-clip-text text-transparent">Message</span>
              </h2>
              <p className="text-primaryClrText/80 max-w-2xl mx-auto">
                We'd love to hear about your project and provide a personalized quote
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-primaryClr mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-rainbowViolet/30 rounded-lg focus:ring-2 focus:ring-rainbowViolet focus:border-transparent bg-white/10 backdrop-blur-sm text-primaryClrText placeholder-primaryClrText/50"
                      placeholder="Enter your full name"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-primaryClr mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-rainbowViolet/30 rounded-lg focus:ring-2 focus:ring-rainbowViolet focus:border-transparent bg-white/10 backdrop-blur-sm text-primaryClrText placeholder-primaryClrText/50"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-primaryClr mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-rainbowViolet/30 rounded-lg focus:ring-2 focus:ring-rainbowViolet focus:border-transparent bg-white/10 backdrop-blur-sm text-primaryClrText placeholder-primaryClrText/50"
                      placeholder="+251 911 234 567"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="service" className="block text-sm font-medium text-primaryClr mb-2">
                      Service Type *
                    </label>
                    <select
                      id="service"
                      name="service"
                      required
                      value={formData.service}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-rainbowViolet/30 rounded-lg focus:ring-2 focus:ring-rainbowViolet focus:border-transparent bg-white/10 backdrop-blur-sm text-primaryClrText"
                    >
                      {services.map((service) => (
                        <option key={service.value} value={service.value}>
                          {service.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="md:col-span-2">
                <label htmlFor="subject" className="block text-sm font-medium text-primaryClr mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-rainbowViolet/30 rounded-lg focus:ring-2 focus:ring-rainbowViolet focus:border-transparent bg-white/10 backdrop-blur-sm text-primaryClrText placeholder-primaryClrText/50"
                  placeholder="How can we help you?"
                />
              </div>
            </div>

            <div className="md:col-span-2">
                <label htmlFor="message" className="block text-sm font-medium text-primaryClr mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={6}
                  value={formData.message}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-rainbowViolet/30 rounded-lg focus:ring-2 focus:ring-rainbowViolet focus:border-transparent bg-white/10 backdrop-blur-sm text-primaryClrText placeholder-primaryClrText/50 resize-none"
                  placeholder="Tell us about your project..."
                />
              </div>
            </div>

            {submitStatus === 'success' && (
              <div className="mb-6 p-4 bg-gradient-to-r from-rainbowGreen to-rainbowBlue text-white rounded-lg animate-fadeInUp">
                  <div className="flex items-center space-x-2">
                    <MessageSquare size={20} />
                    <span>Thank you! Your message has been sent successfully.</span>
                  </div>
                </div>
              )}

            {submitStatus === 'error' && (
              <div className="mb-6 p-4 bg-gradient-to-r from-rainbowRed to-rainbowOrange text-white rounded-lg animate-fadeInUp">
                  <div className="flex items-center space-x-2">
                    <Clock size={20} />
                    <span>Sorry, there was an error. Please try again.</span>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-rainbowViolet to-rainbowIndigo hover:from-rainbowIndigo hover:to-rainbowBlue text-white py-4 rounded-lg font-semibold transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-transparent rounded-full animate-spin"></div>
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Send size={20} />
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;

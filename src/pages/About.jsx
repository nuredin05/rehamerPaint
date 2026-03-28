import React from 'react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';

export const About = () => {
  return (
    <div className="min-h-screen">
      <Header />
      
      {/* About Hero Section */}
      <section className="bg-gradient-to-br from-rainbowViolet via-rainbowIndigo to-rainbowBlue text-primaryClrText py-20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6 animate-fadeInUp">
              About <span className="bg-gradient-to-r from-rainbowYellow to-rainbowOrange bg-clip-text text-transparent">RehamerPaint</span>
            </h1>
            <p className="text-xl lg:text-2xl max-w-3xl mx-auto animate-fadeInUp">
              Your Trusted Partner in Professional Painting Solutions
            </p>
          </div>
        </div>
      </section>

      {/* About Content */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-fadeInLeft">
              <h2 className="text-3xl font-bold text-primaryClr mb-6">
                Our Story
              </h2>
              <p className="text-primaryClrText/80 leading-relaxed mb-6">
                RehamerPaint has been a leading name in the painting industry for over a decade. 
                Founded with a vision to transform spaces through exceptional quality and service, 
                we've grown from a small local business to a trusted regional leader.
              </p>
              <p className="text-primaryClrText/80 leading-relaxed">
                Our commitment to excellence, innovation in painting techniques, and customer satisfaction 
                has made us the preferred choice for residential, commercial, and industrial clients.
              </p>
            </div>
            
            <div className="space-y-8 animate-fadeInRight">
              <h2 className="text-3xl font-bold text-primaryClr mb-6">
                Our Mission
              </h2>
              <p className="text-primaryClrText/80 leading-relaxed mb-6">
                To deliver exceptional painting solutions that exceed expectations through:
              </p>
              <ul className="space-y-4 text-primaryClrText/80">
                <li className="flex items-start space-x-3">
                  <span className="text-rainbowOrange text-xl">●</span>
                  <span>Uncompromising quality in every project</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-rainbowYellow text-xl">●</span>
                  <span>Innovative painting techniques and materials</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-rainbowGreen text-xl">●</span>
                  <span>Sustainable and eco-friendly practices</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-rainbowBlue text-xl">●</span>
                  <span>Customer-centric approach with guaranteed satisfaction</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-backgroundClr to-secondaryClr">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div className="animate-stagger-1">
              <p className="text-3xl font-bold text-rainbowYellow">500+</p>
              <p className="text-sm text-primaryClrText">Projects Completed</p>
            </div>
            <div className="animate-stagger-2">
              <p className="text-3xl font-bold text-rainbowOrange">15+</p>
              <p className="text-sm text-primaryClrText">Years Experience</p>
            </div>
            <div className="animate-stagger-3">
              <p className="text-3xl font-bold text-rainbowGreen">50+</p>
              <p className="text-sm text-primaryClrText">Professional Team</p>
            </div>
            <div className="animate-stagger-4">
              <p className="text-3xl font-bold text-rainbowBlue">98%</p>
              <p className="text-sm text-primaryClrText">Client Satisfaction</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;

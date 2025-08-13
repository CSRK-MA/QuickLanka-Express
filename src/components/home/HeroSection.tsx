import React from 'react';
import { Link } from 'react-router-dom';
import { Package, Truck, Clock } from 'lucide-react';

const HeroSection: React.FC = () => {
  return (
    <section className="relative bg-primary text-white overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
        style={{ backgroundImage: "url('https://images.pexels.com/photos/4393668/pexels-photo-4393668.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')" }}
      ></div>
      
      {/* Animated Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-8 w-16 h-16 bg-accent/30 rounded-full animate-bounce-slow"></div>
        <div className="absolute bottom-1/3 right-1/4 w-8 h-8 bg-gold/20 rounded-full animate-ping"></div>
        <div className="absolute top-1/2 right-10 w-12 h-12 bg-primary-light/30 rounded-full animate-pulse"></div>
      </div>
      
      <div className="container relative py-20 md:py-28 lg:py-36">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="fade-in">
            <h1 className="font-bold text-4xl md:text-5xl lg:text-5xl mb-8 leading-tight">
              <span className="block leading-tight">Smart, Fast &amp; Reliable</span>
              <span className="block text-accent leading-tight">Deliveries</span>
              <span className="block leading-tight">Islandwide</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-lg">
              Sri Lanka's premier logistics solution for businesses and individuals with real-time tracking and express delivery options.
            </p>
            
            <div className="flex flex-wrap gap-4 mb-12">
              <Link to="/book" className="btn btn-gold text-base px-6 py-3 font-medium">
                Schedule Pickup
              </Link>
              <Link to="/track" className="btn btn-outline border-white text-primary hover:bg-white hover:text-primary text-base px-6 py-3 font-medium">
                Track Parcel
              </Link>
              <Link to="/business" className="btn bg-white/10 text-white hover:bg-white/20 text-base px-6 py-3 font-medium">
                For Businesses
              </Link>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="flex items-center">
                <div className="bg-accent/20 p-3 rounded-full mr-4">
                  <Package size={24} className="text-accent" />
                </div>
                <div>
                  <div className="font-bold text-2xl">20,000+</div>
                  <div className="text-gray-300 text-sm">Deliveries</div>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="bg-gold/20 p-3 rounded-full mr-4">
                  <Clock size={24} className="text-gold" />
                </div>
                <div>
                  <div className="font-bold text-2xl">60-Min</div>
                  <div className="text-gray-300 text-sm">Avg Pickup Time</div>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="bg-primary-light/30 p-3 rounded-full mr-4">
                  <Truck size={24} className="text-white" />
                </div>
                <div>
                  <div className="font-bold text-2xl">30+</div>
                  <div className="text-gray-300 text-sm">Cities Covered</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Animated Image */}
          <div className="relative hidden lg:block">
            <div className="relative slide-up">
              <img 
                src="https://images.pexels.com/photos/6667684/pexels-photo-6667684.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                alt="QuickLanka Delivery" 
                className="rounded-lg shadow-xl object-cover h-[500px] w-full"
              />
              <div className="absolute -bottom-6 -right-6 bg-white glass p-4 rounded-lg shadow-lg max-w-xs">
                <div className="flex items-center">
                  <div className="bg-success/20 p-2 rounded-full mr-3">
                    <Truck size={20} className="text-success" />
                  </div>
                  <div>
                    <div className="text-primary font-semibold">Live Delivery</div>
                    <div className="text-text-light text-sm">Colombo to Kandy - 2hrs left</div>
                  </div>
                </div>
              </div>
              <div className="absolute -top-6 -left-6 bg-white glass p-4 rounded-lg shadow-lg">
                <div className="flex items-center">
                  <div className="bg-accent/20 p-2 rounded-full mr-3">
                    <Package size={20} className="text-accent" />
                  </div>
                  <div>
                    <div className="text-primary font-semibold">Package ID: QLE7589</div>
                    <div className="text-text-light text-sm">Status: In Transit</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
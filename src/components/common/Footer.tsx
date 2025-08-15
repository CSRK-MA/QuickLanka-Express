import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Linkedin, Twitter, Mail, Phone, MapPin, ArrowRight } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-primary text-white pt-16 pb-6 md:pb-16">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center mb-4">
              <span className="font-bold text-xl mr-2">QuickLanka</span>
              <span className="text-accent text-sm">EXPRESS</span>
            </div>
            <p className="text-gray-300 mb-4">
              Smart, Fast & Reliable Deliveries across Sri Lanka. Your trusted logistics partner since 2020.
            </p>
            <div className="flex space-x-3 mb-6">
              <a href="#" className="bg-white/10 p-2 rounded-full hover:bg-accent transition-colors">
                <Facebook size={18} />
              </a>
              <a href="#" className="bg-white/10 p-2 rounded-full hover:bg-accent transition-colors">
                <Instagram size={18} />
              </a>
              <a href="#" className="bg-white/10 p-2 rounded-full hover:bg-accent transition-colors">
                <Twitter size={18} />
              </a>
              <a href="#" className="bg-white/10 p-2 rounded-full hover:bg-accent transition-colors">
                <Linkedin size={18} />
              </a>
            </div>
            <div className="flex items-center mb-2">
              <Phone size={16} className="mr-2 text-gray-300" />
              <span>+94 11 123 4567</span>
            </div>
            <div className="flex items-center mb-2">
              <Mail size={16} className="mr-2 text-gray-300" />
              <span>info@quicklanka.lk</span>
            </div>
            <div className="flex items-start">
              <MapPin size={16} className="mr-2 text-gray-300 mt-1 flex-shrink-0" />
              <span>742 Colombo Road, Nugegoda, Western Province, Sri Lanka</span>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 border-b border-white/20 pb-2">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="flex items-center hover:text-accent transition-colors">
                  <ArrowRight size={14} className="mr-2" />
                  Home
                </Link>
              </li>
              <li>
                <Link to="/services" className="flex items-center hover:text-accent transition-colors">
                  <ArrowRight size={14} className="mr-2" />
                  Our Services
                </Link>
              </li>
              <li>
                <Link to="/coverage" className="flex items-center hover:text-accent transition-colors">
                  <ArrowRight size={14} className="mr-2" />
                  Coverage Areas
                </Link>
              </li>
              <li>
                <Link to="/business" className="flex items-center hover:text-accent transition-colors">
                  <ArrowRight size={14} className="mr-2" />
                  Business Solutions
                </Link>
              </li>
              <li>
                <Link to="/contact" className="flex items-center hover:text-accent transition-colors">
                  <ArrowRight size={14} className="mr-2" />
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/track" className="flex items-center hover:text-accent transition-colors">
                  <ArrowRight size={14} className="mr-2" />
                  Track Package
                </Link>
              </li>
              <li>
                <Link to="/book" className="flex items-center hover:text-accent transition-colors">
                  <ArrowRight size={14} className="mr-2" />
                  Book a Pickup
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4 border-b border-white/20 pb-2">Our Services</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/services" className="flex items-center hover:text-accent transition-colors">
                  <ArrowRight size={14} className="mr-2" />
                  Same-Day Delivery
                </Link>
              </li>
              <li>
                <Link to="/services" className="flex items-center hover:text-accent transition-colors">
                  <ArrowRight size={14} className="mr-2" />
                  Overnight Express
                </Link>
              </li>
              <li>
                <Link to="/services" className="flex items-center hover:text-accent transition-colors">
                  <ArrowRight size={14} className="mr-2" />
                  eCommerce Fulfillment
                </Link>
              </li>
              <li>
                <Link to="/services" className="flex items-center hover:text-accent transition-colors">
                  <ArrowRight size={14} className="mr-2" />
                  Cash on Delivery
                </Link>
              </li>
              <li>
                <Link to="/services" className="flex items-center hover:text-accent transition-colors">
                  <ArrowRight size={14} className="mr-2" />
                  Document Delivery
                </Link>
              </li>
              <li>
                <Link to="/services" className="flex items-center hover:text-accent transition-colors">
                  <ArrowRight size={14} className="mr-2" />
                  International Shipping
                </Link>
              </li>
              <li>
                <Link to="/services" className="flex items-center hover:text-accent transition-colors">
                  <ArrowRight size={14} className="mr-2" />
                  Bulk Commercial Logistics
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4 border-b border-white/20 pb-2">Newsletter</h3>
            <p className="text-gray-300 mb-4">
              Subscribe to our newsletter for updates, promotions, and logistics insights.
            </p>
            <form className="mb-6">
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Your email address"
                  className="px-4 py-2 rounded-l-md focus:outline-none text-gray-800 w-full"
                />
                <button 
                  type="submit" 
                  className="bg-accent hover:bg-accent-light px-4 py-2 rounded-r-md transition-colors"
                >
                  Subscribe
                </button>
              </div>
            </form>
            <div className="flex items-center space-x-2 mb-4">
              <img src="https://via.placeholder.com/120x40" alt="App Store" className="h-10" />
              <img src="https://via.placeholder.com/120x40" alt="Google Play" className="h-10" />
            </div>
          </div>
        </div>
        
        {/* Bottom Footer */}
        <div className="border-t border-white/10 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-gray-300 mb-4 md:mb-0">
            © {new Date().getFullYear()} QuickLanka Express. All rights reserved. Made with <Heart className="w-4 h-4 mx-1 text-red-500" /> NexonMACS.
          </div>
          <div className="flex space-x-4 text-sm text-gray-300">
            <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/careers" className="hover:text-white transition-colors">Careers</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

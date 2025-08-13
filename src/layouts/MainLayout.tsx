import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, Phone, MapPin, Facebook, Instagram, Linkedin, Package, Truck, MapIcon, HelpCircle, User } from 'lucide-react';
import Footer from '../components/common/Footer';
import LanguageSwitcher from '../components/common/LanguageSwitcher';

const MainLayout: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Bar */}
      <div className="bg-primary text-white text-sm py-2 hidden md:block">
        <div className="container flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Phone size={16} className="mr-1" />
              <span>+94 11 123 4567</span>
            </div>
            <div className="flex items-center">
              <MapPin size={16} className="mr-1" />
              <span>Colombo, Sri Lanka</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <LanguageSwitcher />
            <div className="flex space-x-2">
              <a href="#" className="hover:text-gold transition-colors">
                <Facebook size={16} />
              </a>
              <a href="#" className="hover:text-gold transition-colors">
                <Instagram size={16} />
              </a>
              <a href="#" className="hover:text-gold transition-colors">
                <Linkedin size={16} />
              </a>
            </div>
          </div>
        </div>
      </div>
      
      {/* Header */}
      <header className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'}`}>
        <div className="container flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <Truck className="text-accent" size={28} />
            <div>
              <span className="font-bold text-lg text-primary block leading-tight">QuickLanka</span>
              <span className="text-xs text-accent block leading-tight">EXPRESS</span>
            </div>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className={`font-medium hover:text-accent transition-colors ${location.pathname === '/' ? 'text-accent' : 'text-primary'}`}>
              Home
            </Link>
            <Link to="/services" className={`font-medium hover:text-accent transition-colors ${location.pathname === '/services' ? 'text-accent' : 'text-primary'}`}>
              Services
            </Link>
            <Link to="/coverage" className={`font-medium hover:text-accent transition-colors ${location.pathname === '/coverage' ? 'text-accent' : 'text-primary'}`}>
              Coverage
            </Link>
            <Link to="/business" className={`font-medium hover:text-accent transition-colors ${location.pathname === '/business' ? 'text-accent' : 'text-primary'}`}>
              For Business
            </Link>
            <Link to="/contact" className={`font-medium hover:text-accent transition-colors ${location.pathname === '/contact' ? 'text-accent' : 'text-primary'}`}>
              Contact
            </Link>
          </nav>
          
          <div className="hidden md:flex items-center space-x-3">
            <Link to="/track" className="btn btn-outline">
              Track Parcel
            </Link>
            <Link to="/book" className="btn btn-accent">
              Schedule Pickup
            </Link>
          </div>
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-primary" 
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 bg-white pt-16 fade-in md:hidden">
          <div className="container flex flex-col space-y-4 p-4">
            <Link to="/" className="p-3 border-b border-gray-100 font-medium">
              Home
            </Link>
            <Link to="/services" className="p-3 border-b border-gray-100 font-medium">
              Services
            </Link>
            <Link to="/coverage" className="p-3 border-b border-gray-100 font-medium">
              Coverage
            </Link>
            <Link to="/business" className="p-3 border-b border-gray-100 font-medium">
              For Business
            </Link>
            <Link to="/contact" className="p-3 border-b border-gray-100 font-medium">
              Contact
            </Link>
            <div className="flex flex-col space-y-2 mt-4">
              <Link to="/track" className="btn btn-outline w-full">
                Track Parcel
              </Link>
              <Link to="/book" className="btn btn-accent w-full">
                Schedule Pickup
              </Link>
            </div>
          </div>
        </div>
      )}
      
      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 md:hidden">
        <div className="grid grid-cols-5 py-2">
          <Link to="/" className="flex flex-col items-center justify-center text-primary text-xs">
            <Truck size={20} className={location.pathname === '/' ? 'text-accent' : 'text-primary'} />
            <span>Home</span>
          </Link>
          <Link to="/track" className="flex flex-col items-center justify-center text-primary text-xs">
            <Package size={20} className={location.pathname === '/track' ? 'text-accent' : 'text-primary'} />
            <span>Track</span>
          </Link>
          <Link to="/book" className="flex flex-col items-center justify-center text-xs">
            <div className="bg-accent rounded-full p-2 -mt-5 border-4 border-white">
              <Truck size={20} className="text-white" />
            </div>
            <span className="mt-1 text-accent font-medium">Book</span>
          </Link>
          <Link to="/coverage" className="flex flex-col items-center justify-center text-primary text-xs">
            <MapIcon size={20} className={location.pathname === '/coverage' ? 'text-accent' : 'text-primary'} />
            <span>Coverage</span>
          </Link>
          <Link to="/contact" className="flex flex-col items-center justify-center text-primary text-xs">
            <HelpCircle size={20} className={location.pathname === '/contact' ? 'text-accent' : 'text-primary'} />
            <span>Help</span>
          </Link>
        </div>
      </div>
      
      {/* Main Content */}
      <main className="flex-grow">
        <Outlet />
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default MainLayout;
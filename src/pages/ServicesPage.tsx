import React, { useState, useEffect } from 'react';
import { Clock, Truck, CreditCard, FileText, Globe, ShoppingBag, Package, Briefcase, Shield, Star, ArrowRight, CheckCircle, Phone, Calculator, MapPin, Weight, Calendar, Info, TrendingUp, Zap, Users } from 'lucide-react';
import PriceCalculator from '../components/common/PriceCalculator';
import { PricingBreakdown } from '../utils/pricingCalculator';
import useRealTimeUpdates from '../hooks/useRealTimeUpdates';

interface Service {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  features: string[];
  delivery_time: string;
  coverage: string;
  category: 'express' | 'standard' | 'specialized' | 'business';
  popular?: boolean;
  starting_price: number;
}

const ServicesPage: React.FC = () => {
  useEffect(() => {
    document.title = 'Our Services - QuickLanka Express';
  }, []);

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [showPriceCalculator, setShowPriceCalculator] = useState(false);
  const [calculationResult, setCalculationResult] = useState<PricingBreakdown | null>(null);

  // Real-time updates
  const { updates, isConnected } = useRealTimeUpdates({
    enablePriceUpdates: true,
    enableServiceUpdates: true
  });

  const services: Service[] = [
    {
      id: 'same_day',
      icon: <Clock size={24} />,
      title: 'Same-Day Delivery',
      description: 'Ultra-fast delivery within the same day for urgent packages across major cities.',
      features: [
        'Pickup within 2 hours',
        'Delivery within 6-8 hours',
        'Real-time GPS tracking',
        'SMS & email notifications',
        'Proof of delivery with signature',
        'Insurance up to Rs. 50,000'
      ],
      delivery_time: '6-8 hours',
      coverage: 'Colombo, Gampaha, Kalutara',
      category: 'express',
      popular: true,
      starting_price: 800
    },
    {
      id: 'overnight',
      icon: <Truck size={24} />,
      title: 'Overnight Express',
      description: 'Next business day delivery across Sri Lanka with guaranteed time slots.',
      features: [
        'Next business day delivery',
        'Morning (9-12) or afternoon (2-5) slots',
        'Island-wide coverage',
        'Free pickup from your location',
        'Package consolidation available',
        'Insurance up to Rs. 100,000'
      ],
      delivery_time: 'Next business day',
      coverage: 'All 25 districts',
      category: 'express',
      starting_price: 450
    },
    {
      id: 'standard',
      icon: <Package size={24} />,
      title: 'Standard Delivery',
      description: 'Cost-effective delivery solution for non-urgent shipments.',
      features: [
        'Economical pricing',
        '2-3 business day delivery',
        'Island-wide coverage',
        'Package consolidation',
        'Basic tracking included',
        'Insurance up to Rs. 25,000'
      ],
      delivery_time: '2-3 business days',
      coverage: 'All districts',
      category: 'standard',
      starting_price: 300
    },
    {
      id: 'documents',
      icon: <FileText size={24} />,
      title: 'Document Delivery',
      description: 'Secure and confidential delivery of important documents with signature confirmation.',
      features: [
        'Tamper-evident packaging',
        'Signature confirmation required',
        'Chain of custody tracking',
        'Legal document handling',
        'Confidentiality guarantee',
        'Digital proof of delivery'
      ],
      delivery_time: '4-24 hours',
      coverage: 'Island-wide',
      category: 'specialized',
      starting_price: 250
    },
    {
      id: 'ecommerce',
      icon: <ShoppingBag size={24} />,
      title: 'eCommerce Fulfillment',
      description: 'Complete fulfillment solution including storage, packing, and last-mile delivery.',
      features: [
        'Warehouse storage facilities',
        'Professional packaging',
        'Inventory management',
        'Order processing automation',
        'Returns management',
        'Analytics dashboard'
      ],
      delivery_time: '1-2 business days',
      coverage: 'Major commercial areas',
      category: 'business',
      starting_price: 300
    },
    {
      id: 'international',
      icon: <Globe size={24} />,
      title: 'International Shipping',
      description: 'Reliable international shipping with customs handling and global tracking.',
      features: [
        'Customs clearance assistance',
        'International tracking',
        'Multiple shipping options',
        'Documentation support',
        'Insurance coverage',
        'Duty and tax calculation'
      ],
      delivery_time: '3-10 business days',
      coverage: '50+ countries',
      category: 'specialized',
      starting_price: 2500
    },
    {
      id: 'fragile',
      icon: <Package size={24} />,
      title: 'Fragile & Special Care',
      description: 'Specialized handling for delicate, valuable, or temperature-sensitive items.',
      features: [
        'Custom packaging solutions',
        'Temperature-controlled transport',
        'Fragile item specialists',
        'Extra insurance coverage',
        'White-glove delivery service',
        'Installation services available'
      ],
      delivery_time: '1-2 business days',
      coverage: 'Major cities',
      category: 'specialized',
      starting_price: 600
    },
    {
      id: 'bulk',
      icon: <Briefcase size={24} />,
      title: 'Bulk Commercial',
      description: 'Cost-effective solutions for businesses with high-volume shipping requirements.',
      features: [
        'Volume-based pricing',
        'Dedicated account manager',
        'Flexible pickup schedules',
        'Custom reporting',
        'Priority customer support',
        'API integration'
      ],
      delivery_time: '1-3 business days',
      coverage: 'Island-wide',
      category: 'business',
      starting_price: 200
    }
  ];

  const categories = [
    { id: 'all', name: 'All Services', count: services.length },
    { id: 'express', name: 'Express', count: services.filter(s => s.category === 'express').length },
    { id: 'standard', name: 'Standard', count: services.filter(s => s.category === 'standard').length },
    { id: 'business', name: 'Business', count: services.filter(s => s.category === 'business').length },
    { id: 'specialized', name: 'Specialized', count: services.filter(s => s.category === 'specialized').length }
  ];

  const filteredServices = selectedCategory === 'all' 
    ? services 
    : services.filter(service => service.category === selectedCategory);

  const handleCalculationComplete = (result: PricingBreakdown) => {
    setCalculationResult(result);
  };

  const ServiceCard: React.FC<{ service: Service }> = ({ service }) => (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group">
      {service.popular && (
        <div className="bg-accent text-white text-xs font-medium px-3 py-1 text-center">
          Most Popular
        </div>
      )}
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="bg-primary/5 rounded-full w-14 h-14 flex items-center justify-center group-hover:bg-accent/10 transition-colors">
            <div className="text-primary group-hover:text-accent transition-colors">
              {service.icon}
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">Rs. {service.starting_price}</div>
            <div className="text-sm text-text-light">Starting from</div>
          </div>
        </div>
        
        <h3 className="font-semibold text-xl mb-2 group-hover:text-accent transition-colors">
          {service.title}
        </h3>
        <p className="text-text-light mb-4">{service.description}</p>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm">
            <Clock size={16} className="text-accent mr-2" />
            <span>{service.delivery_time}</span>
          </div>
          <div className="flex items-center text-sm">
            <Globe size={16} className="text-accent mr-2" />
            <span>{service.coverage}</span>
          </div>
        </div>
        
        <div className="flex gap-2">
          <button 
            onClick={() => setSelectedService(service)}
            className="btn btn-primary flex-1"
          >
            View Details
          </button>
          <button 
            onClick={() => {
              setShowPriceCalculator(true);
            }}
            className="btn btn-outline"
          >
            <Calculator size={16} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Real-time Updates Indicator */}
      {isConnected && (
        <div className="bg-success text-white text-center py-2 text-sm">
          🟢 Real-time pricing updates active • Last update: {new Date().toLocaleTimeString()}
        </div>
      )}

      {/* Hero Section */}
      <section className="bg-primary text-white py-16">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Comprehensive Delivery Solutions
            </h1>
            <p className="text-xl text-gray-200 mb-8">
              From same-day express delivery to specialized logistics solutions, we have the right service for every need.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button 
                onClick={() => setShowPriceCalculator(true)}
                className="btn btn-gold"
              >
                <Calculator size={20} className="mr-2" />
                Calculate Price
              </button>
              <a href="#services" className="btn bg-white/10 text-white hover:bg-white/20">
                Browse Services
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Service Categories */}
      <section id="services" className="py-12">
        <div className="container">
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-3 rounded-full font-medium transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-primary text-white'
                    : 'bg-white text-primary hover:bg-gray-100'
                }`}
              >
                {category.name} ({category.count})
              </button>
            ))}
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredServices.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Our Services */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose QuickLanka Express?</h2>
            <p className="text-text-light max-w-2xl mx-auto">
              We combine cutting-edge technology with reliable service to deliver exceptional results.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-success/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Shield size={24} className="text-success" />
              </div>
              <h3 className="font-semibold text-lg mb-2">100% Secure</h3>
              <p className="text-text-light">End-to-end security with insurance coverage and tracking.</p>
            </div>
            
            <div className="text-center">
              <div className="bg-accent/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Clock size={24} className="text-accent" />
              </div>
              <h3 className="font-semibold text-lg mb-2">On-Time Delivery</h3>
              <p className="text-text-light">98.5% on-time delivery rate with real-time tracking.</p>
            </div>
            
            <div className="text-center">
              <div className="bg-gold/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Star size={24} className="text-gold" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Premium Support</h3>
              <p className="text-text-light">24/7 customer support with dedicated account managers.</p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Globe size={24} className="text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Island-wide Coverage</h3>
              <p className="text-text-light">Comprehensive coverage across all 25 districts of Sri Lanka.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Service Detail Modal */}
      {selectedService && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center">
                  <div className="bg-primary/5 rounded-full w-12 h-12 flex items-center justify-center mr-4">
                    <div className="text-primary">{selectedService.icon}</div>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-primary">{selectedService.title}</h2>
                    <p className="text-text-light">{selectedService.description}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedService(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="font-semibold text-lg mb-3">Features & Benefits</h3>
                  <ul className="space-y-2 mb-6">
                    {selectedService.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle size={16} className="text-success mr-2 mt-1 flex-shrink-0" />
                        <span className="text-text-light">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-3">Service Details</h3>
                  <div className="space-y-3">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Starting Price:</span>
                        <span className="font-semibold text-primary">Rs. {selectedService.starting_price}</span>
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Delivery Time:</span>
                        <span className="font-semibold">{selectedService.delivery_time}</span>
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Coverage:</span>
                        <span className="font-semibold">{selectedService.coverage}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button className="btn btn-primary flex-1">
                  Book This Service
                </button>
                <button 
                  onClick={() => {
                    setShowPriceCalculator(true);
                    setSelectedService(null);
                  }}
                  className="btn btn-outline"
                >
                  <Calculator size={16} className="mr-2" />
                  Calculate Price
                </button>
                <button className="btn bg-success text-white hover:bg-success/90">
                  <Phone size={16} className="mr-2" />
                  Call Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Price Calculator Modal */}
      {showPriceCalculator && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[95vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-primary">Service Price Calculator</h2>
                <button 
                  onClick={() => {
                    setShowPriceCalculator(false);
                    setCalculationResult(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <PriceCalculator
                onCalculationComplete={handleCalculationComplete}
                showServiceSelection={true}
              />

              {calculationResult && (
                <div className="mt-6 flex gap-4">
                  <button className="btn btn-primary flex-1">
                    Book This Service - Rs. {calculationResult.total.toFixed(2)}
                  </button>
                  <button className="btn btn-outline">
                    Save Quote
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicesPage;
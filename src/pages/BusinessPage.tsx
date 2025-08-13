import React, { useState, useEffect } from 'react';
import { Truck, Package, BarChart3, Users, Clock, Shield, Zap, Globe, CheckCircle, ArrowRight, Star, Phone, Mail, Download, Play, Calculator } from 'lucide-react';
import PriceCalculator from '../components/common/PriceCalculator';
import { PricingBreakdown } from '../utils/pricingCalculator';
import useRealTimeUpdates from '../hooks/useRealTimeUpdates';

interface BusinessSolution {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
  pricing: {
    setup_fee?: number;
    monthly_minimum?: number;
    per_delivery?: number;
    volume_discounts?: string[];
  };
  ideal_for: string[];
  case_study?: {
    company: string;
    industry: string;
    challenge: string;
    solution: string;
    results: string[];
  };
}

const BusinessPage: React.FC = () => {
  useEffect(() => {
    document.title = 'Business Solutions - QuickLanka Express';
  }, []);

  const [selectedSolution, setSelectedSolution] = useState<BusinessSolution | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [showContactForm, setShowContactForm] = useState(false);
  const [showPriceCalculator, setShowPriceCalculator] = useState(false);
  const [calculationResult, setCalculationResult] = useState<PricingBreakdown | null>(null);

  // Real-time updates
  const { updates, isConnected } = useRealTimeUpdates({
    enablePriceUpdates: true,
    enableServiceUpdates: true
  });

  const businessSolutions: BusinessSolution[] = [
    {
      id: 'enterprise',
      title: 'Enterprise Shipping',
      description: 'Comprehensive logistics solutions for large corporations with complex shipping needs.',
      icon: <Truck size={24} />,
      features: [
        'Dedicated account manager',
        'Custom pricing structures',
        'Priority customer support',
        'Advanced analytics dashboard',
        'Multi-location management',
        'White-label solutions',
        'SLA guarantees',
        'Custom integration support'
      ],
      pricing: {
        setup_fee: 25000,
        monthly_minimum: 100000,
        volume_discounts: ['10,000+ deliveries: 15% discount', '25,000+ deliveries: 25% discount', '50,000+ deliveries: 35% discount']
      },
      ideal_for: ['Large corporations', 'Multi-national companies', 'Government agencies', 'NGOs'],
      case_study: {
        company: 'TechCorp Solutions',
        industry: 'Technology',
        challenge: 'Managing 15,000+ monthly deliveries across 8 offices with inconsistent service levels.',
        solution: 'Implemented enterprise shipping with dedicated account management and custom dashboard.',
        results: ['40% reduction in shipping costs', '99.2% on-time delivery rate', '60% faster processing time']
      }
    },
    {
      id: 'ecommerce',
      title: 'eCommerce Fulfillment',
      description: 'End-to-end fulfillment solutions for online retailers and marketplaces.',
      icon: <Package size={24} />,
      features: [
        'Warehouse storage facilities',
        'Inventory management system',
        'Order processing automation',
        'Multi-channel integration',
        'Returns management',
        'COD collection & remittance',
        'Packaging & branding options',
        'Real-time inventory tracking'
      ],
      pricing: {
        setup_fee: 15000,
        monthly_minimum: 50000,
        per_delivery: 250,
        volume_discounts: ['500+ orders/month: 10% discount', '1000+ orders/month: 20% discount']
      },
      ideal_for: ['Online retailers', 'Marketplace sellers', 'Fashion brands', 'Electronics stores'],
      case_study: {
        company: 'StyleHub Lanka',
        industry: 'Fashion Retail',
        challenge: 'Scaling fulfillment operations while maintaining quality and reducing costs.',
        solution: 'Complete eCommerce fulfillment with automated order processing and COD management.',
        results: ['50% reduction in fulfillment costs', '3x faster order processing', '95% customer satisfaction']
      }
    },
    {
      id: 'bulk',
      title: 'Bulk Commercial',
      description: 'Cost-effective solutions for businesses with high-volume shipping requirements.',
      icon: <BarChart3 size={24} />,
      features: [
        'Volume-based pricing tiers',
        'Flexible pickup schedules',
        'Consolidated shipping options',
        'Custom reporting tools',
        'Dedicated fleet allocation',
        'Route optimization',
        'Bulk packaging solutions',
        'Performance analytics'
      ],
      pricing: {
        setup_fee: 10000,
        monthly_minimum: 75000,
        volume_discounts: ['1000+ packages: 20% discount', '5000+ packages: 30% discount', '10000+ packages: 40% discount']
      },
      ideal_for: ['Manufacturing companies', 'Distributors', 'Wholesale businesses', 'Import/Export companies'],
      case_study: {
        company: 'Lanka Distributors',
        industry: 'FMCG Distribution',
        challenge: 'Managing 5000+ daily deliveries with tight margins and delivery windows.',
        solution: 'Bulk commercial solution with route optimization and dedicated fleet.',
        results: ['35% cost reduction', '25% faster deliveries', '99% delivery accuracy']
      }
    },
    {
      id: 'api',
      title: 'API Integration',
      description: 'Seamless integration with your existing systems through our comprehensive API.',
      icon: <Zap size={24} />,
      features: [
        'RESTful API architecture',
        'Real-time tracking integration',
        'Automated label generation',
        'Webhook notifications',
        'Rate calculation API',
        'Address validation',
        'Comprehensive documentation',
        'Developer support'
      ],
      pricing: {
        setup_fee: 20000,
        monthly_minimum: 30000,
        per_delivery: 15
      },
      ideal_for: ['Software companies', 'SaaS platforms', 'Custom applications', 'System integrators'],
      case_study: {
        company: 'DeliveryApp Pro',
        industry: 'Software Development',
        challenge: 'Integrating reliable shipping services into their delivery management platform.',
        solution: 'Complete API integration with real-time tracking and automated notifications.',
        results: ['100% API uptime', '50ms average response time', '99.9% successful integrations']
      }
    }
  ];

  const benefits = [
    {
      icon: <Shield size={24} />,
      title: 'Reliability & Security',
      description: 'Enterprise-grade security with 99.9% uptime guarantee and comprehensive insurance coverage.'
    },
    {
      icon: <Clock size={24} />,
      title: 'Time Efficiency',
      description: 'Streamlined processes and automation reduce manual work by up to 80%.'
    },
    {
      icon: <BarChart3 size={24} />,
      title: 'Cost Optimization',
      description: 'Volume discounts and optimized routes can reduce shipping costs by 30-50%.'
    },
    {
      icon: <Users size={24} />,
      title: 'Dedicated Support',
      description: '24/7 priority support with dedicated account managers for enterprise clients.'
    }
  ];

  const testimonials = [
    {
      quote: "QuickLanka's enterprise solution transformed our logistics operations. We've seen a 40% reduction in costs and 99% on-time delivery.",
      author: "Samantha Perera",
      position: "Operations Director",
      company: "MegaCorp Lanka",
      rating: 5
    },
    {
      quote: "The API integration was seamless and their developer support is outstanding. Our customers love the real-time tracking.",
      author: "Rohan Silva",
      position: "CTO",
      company: "TechStart Solutions",
      rating: 5
    },
    {
      quote: "Their eCommerce fulfillment service helped us scale from 100 to 10,000 orders per month without any hiccups.",
      author: "Priya Jayawardene",
      position: "Founder",
      company: "StyleLanka",
      rating: 5
    }
  ];

  const handleCalculationComplete = (result: PricingBreakdown) => {
    setCalculationResult(result);
  };

  const SolutionCard: React.FC<{ solution: BusinessSolution }> = ({ solution }) => (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="bg-primary/5 rounded-full w-14 h-14 flex items-center justify-center group-hover:bg-accent/10 transition-colors">
            <div className="text-primary group-hover:text-accent transition-colors">
              {solution.icon}
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-text-light">Starting from</div>
            <div className="text-xl font-bold text-primary">
              Rs. {solution.pricing.monthly_minimum?.toLocaleString()}
            </div>
            <div className="text-xs text-text-light">/month</div>
          </div>
        </div>
        
        <h3 className="font-semibold text-xl mb-2 group-hover:text-accent transition-colors">
          {solution.title}
        </h3>
        <p className="text-text-light mb-4">{solution.description}</p>
        
        <div className="space-y-2 mb-4">
          {solution.features.slice(0, 3).map((feature, index) => (
            <div key={index} className="flex items-center text-sm">
              <CheckCircle size={14} className="text-success mr-2 flex-shrink-0" />
              <span>{feature}</span>
            </div>
          ))}
          {solution.features.length > 3 && (
            <div className="text-sm text-accent">+{solution.features.length - 3} more features</div>
          )}
        </div>
        
        <div className="flex gap-2">
          <button 
            onClick={() => setSelectedSolution(solution)}
            className="btn btn-primary flex-1"
          >
            Learn More
          </button>
          <button 
            onClick={() => setShowContactForm(true)}
            className="btn btn-outline"
          >
            Get Quote
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
          🟢 Real-time business pricing updates active • Last update: {new Date().toLocaleTimeString()}
        </div>
      )}

      {/* Hero Section */}
      <section className="bg-primary text-white py-20">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Enterprise Logistics Solutions
              </h1>
              <p className="text-xl text-gray-200 mb-8">
                Streamline your business operations with our comprehensive logistics solutions designed for modern enterprises.
              </p>
              <div className="flex flex-wrap gap-4 mb-8">
                <button 
                  onClick={() => setShowContactForm(true)}
                  className="btn btn-gold"
                >
                  Get Custom Quote
                </button>
                <button 
                  onClick={() => setShowPriceCalculator(true)}
                  className="btn bg-white/10 text-white hover:bg-white/20 gap-2"
                >
                  <Calculator size={16} />
                  Calculate Pricing
                </button>
              </div>
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <div className="text-3xl font-bold text-gold">500+</div>
                  <div className="text-gray-200 text-sm">Business Clients</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gold">99.9%</div>
                  <div className="text-gray-200 text-sm">Uptime SLA</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gold">50%</div>
                  <div className="text-gray-200 text-sm">Cost Reduction</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://images.pexels.com/photos/4481259/pexels-photo-4481259.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                alt="Business Logistics" 
                className="rounded-lg shadow-xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-lg shadow-lg">
                <div className="flex items-center">
                  <div className="bg-success/20 p-2 rounded-full mr-3">
                    <BarChart3 size={20} className="text-success" />
                  </div>
                  <div>
                    <div className="text-primary font-semibold">40% Cost Reduction</div>
                    <div className="text-text-light text-sm">Average client savings</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <section className="bg-white shadow-sm">
        <div className="container">
          <div className="flex overflow-x-auto">
            {[
              { id: 'overview', name: 'Overview' },
              { id: 'solutions', name: 'Solutions' },
              { id: 'benefits', name: 'Benefits' },
              { id: 'testimonials', name: 'Testimonials' },
              { id: 'resources', name: 'Resources' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-text-light hover:text-primary'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Tab Content */}
      <section className="py-12">
        <div className="container">
          {activeTab === 'overview' && (
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">Why Choose QuickLanka for Business?</h2>
                <p className="text-text-light text-lg">
                  We understand that every business has unique logistics needs. Our enterprise solutions are designed to scale with your growth.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {benefits.map((benefit, index) => (
                  <div key={index} className="text-center">
                    <div className="bg-primary/5 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      <div className="text-primary">{benefit.icon}</div>
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{benefit.title}</h3>
                    <p className="text-text-light">{benefit.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'solutions' && (
            <div>
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">Business Solutions</h2>
                <p className="text-text-light max-w-2xl mx-auto">
                  Choose from our range of specialized solutions designed for different business needs and scales.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {businessSolutions.map((solution) => (
                  <SolutionCard key={solution.id} solution={solution} />
                ))}
              </div>
            </div>
          )}

          {activeTab === 'benefits' && (
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">Business Benefits</h2>
                <p className="text-text-light text-lg">
                  See how our solutions can transform your business operations and bottom line.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white rounded-lg p-6 shadow-md">
                  <h3 className="font-semibold text-xl mb-4">Operational Efficiency</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <CheckCircle size={16} className="text-success mr-2 mt-1 flex-shrink-0" />
                      <span>Automated order processing reduces manual work by 80%</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle size={16} className="text-success mr-2 mt-1 flex-shrink-0" />
                      <span>Real-time tracking eliminates customer service calls</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle size={16} className="text-success mr-2 mt-1 flex-shrink-0" />
                      <span>Integrated systems reduce data entry errors</span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-white rounded-lg p-6 shadow-md">
                  <h3 className="font-semibold text-xl mb-4">Cost Savings</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <CheckCircle size={16} className="text-success mr-2 mt-1 flex-shrink-0" />
                      <span>Volume discounts up to 40% off standard rates</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle size={16} className="text-success mr-2 mt-1 flex-shrink-0" />
                      <span>Reduced packaging and handling costs</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle size={16} className="text-success mr-2 mt-1 flex-shrink-0" />
                      <span>Lower insurance premiums with our coverage</span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-white rounded-lg p-6 shadow-md">
                  <h3 className="font-semibold text-xl mb-4">Customer Experience</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <CheckCircle size={16} className="text-success mr-2 mt-1 flex-shrink-0" />
                      <span>99.2% on-time delivery rate improves satisfaction</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle size={16} className="text-success mr-2 mt-1 flex-shrink-0" />
                      <span>Real-time notifications keep customers informed</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle size={16} className="text-success mr-2 mt-1 flex-shrink-0" />
                      <span>Professional packaging enhances brand image</span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-white rounded-lg p-6 shadow-md">
                  <h3 className="font-semibold text-xl mb-4">Scalability</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <CheckCircle size={16} className="text-success mr-2 mt-1 flex-shrink-0" />
                      <span>Flexible solutions that grow with your business</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle size={16} className="text-success mr-2 mt-1 flex-shrink-0" />
                      <span>Multi-location support for expanding businesses</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle size={16} className="text-success mr-2 mt-1 flex-shrink-0" />
                      <span>API integration supports custom workflows</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'testimonials' && (
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">What Our Clients Say</h2>
                <p className="text-text-light text-lg">
                  Hear from businesses that have transformed their operations with our solutions.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {testimonials.map((testimonial, index) => (
                  <div key={index} className="bg-white rounded-lg p-6 shadow-md">
                    <div className="flex mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} size={16} fill="#FFB000" stroke="#FFB000" />
                      ))}
                    </div>
                    <p className="text-text-light mb-4 italic">"{testimonial.quote}"</p>
                    <div>
                      <h4 className="font-semibold text-primary">{testimonial.author}</h4>
                      <p className="text-sm text-text-light">{testimonial.position}</p>
                      <p className="text-sm text-text-light">{testimonial.company}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'resources' && (
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">Resources & Documentation</h2>
                <p className="text-text-light text-lg">
                  Everything you need to get started and make the most of our business solutions.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg p-6 shadow-md">
                  <div className="bg-primary/5 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                    <Download size={20} className="text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">API Documentation</h3>
                  <p className="text-text-light mb-4">Complete guide to integrating our shipping API.</p>
                  <button className="btn btn-outline w-full">Download PDF</button>
                </div>
                
                <div className="bg-white rounded-lg p-6 shadow-md">
                  <div className="bg-primary/5 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                    <Calculator size={20} className="text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">ROI Calculator</h3>
                  <p className="text-text-light mb-4">Calculate potential savings with our solutions.</p>
                  <button 
                    onClick={() => setShowPriceCalculator(true)}
                    className="btn btn-outline w-full"
                  >
                    Open Calculator
                  </button>
                </div>
                
                <div className="bg-white rounded-lg p-6 shadow-md">
                  <div className="bg-primary/5 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                    <Users size={20} className="text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Implementation Guide</h3>
                  <p className="text-text-light mb-4">Step-by-step setup and onboarding process.</p>
                  <button className="btn btn-outline w-full">View Guide</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-white">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Business?</h2>
          <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            Join hundreds of businesses that have streamlined their operations with QuickLanka Express.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button 
              onClick={() => setShowContactForm(true)}
              className="btn btn-gold"
            >
              Get Custom Quote
            </button>
            <button 
              onClick={() => setShowPriceCalculator(true)}
              className="btn bg-white/10 text-white hover:bg-white/20"
            >
              Calculate Pricing
            </button>
          </div>
        </div>
      </section>

      {/* Solution Detail Modal */}
      {selectedSolution && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center">
                  <div className="bg-primary/5 rounded-full w-12 h-12 flex items-center justify-center mr-4">
                    <div className="text-primary">{selectedSolution.icon}</div>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-primary">{selectedSolution.title}</h2>
                    <p className="text-text-light">{selectedSolution.description}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedSolution(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-semibold text-lg mb-4">Features & Capabilities</h3>
                  <ul className="space-y-2 mb-6">
                    {selectedSolution.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle size={16} className="text-success mr-2 mt-1 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <h3 className="font-semibold text-lg mb-4">Ideal For</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedSolution.ideal_for.map((type, index) => (
                      <span key={index} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                        {type}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-4">Pricing Structure</h3>
                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    {selectedSolution.pricing.setup_fee && (
                      <div className="flex justify-between items-center mb-2">
                        <span>Setup Fee:</span>
                        <span className="font-semibold">Rs. {selectedSolution.pricing.setup_fee.toLocaleString()}</span>
                      </div>
                    )}
                    {selectedSolution.pricing.monthly_minimum && (
                      <div className="flex justify-between items-center mb-2">
                        <span>Monthly Minimum:</span>
                        <span className="font-semibold">Rs. {selectedSolution.pricing.monthly_minimum.toLocaleString()}</span>
                      </div>
                    )}
                    {selectedSolution.pricing.per_delivery && (
                      <div className="flex justify-between items-center mb-2">
                        <span>Per Delivery:</span>
                        <span className="font-semibold">Rs. {selectedSolution.pricing.per_delivery}</span>
                      </div>
                    )}
                    {selectedSolution.pricing.volume_discounts && (
                      <div className="border-t pt-2 mt-2">
                        <h4 className="font-medium mb-2">Volume Discounts:</h4>
                        <ul className="text-sm text-text-light space-y-1">
                          {selectedSolution.pricing.volume_discounts.map((discount, index) => (
                            <li key={index}>• {discount}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {selectedSolution.case_study && (
                    <div>
                      <h3 className="font-semibold text-lg mb-4">Case Study</h3>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-medium text-primary mb-2">{selectedSolution.case_study.company}</h4>
                        <p className="text-sm text-text-light mb-3">{selectedSolution.case_study.industry}</p>
                        <div className="space-y-3">
                          <div>
                            <span className="font-medium">Challenge:</span>
                            <p className="text-sm text-text-light">{selectedSolution.case_study.challenge}</p>
                          </div>
                          <div>
                            <span className="font-medium">Solution:</span>
                            <p className="text-sm text-text-light">{selectedSolution.case_study.solution}</p>
                          </div>
                          <div>
                            <span className="font-medium">Results:</span>
                            <ul className="text-sm text-text-light mt-1">
                              {selectedSolution.case_study.results.map((result, index) => (
                                <li key={index}>• {result}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <button 
                  onClick={() => setShowContactForm(true)}
                  className="btn btn-primary flex-1"
                >
                  Get Custom Quote
                </button>
                <button 
                  onClick={() => setShowPriceCalculator(true)}
                  className="btn btn-outline"
                >
                  <Calculator size={16} className="mr-2" />
                  Calculate Price
                </button>
                <button className="btn bg-success text-white hover:bg-success/90">
                  <Phone size={16} className="mr-2" />
                  Call Sales
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contact Form Modal */}
      {showContactForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-primary">Get Custom Quote</h2>
                <button 
                  onClick={() => setShowContactForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <form className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">First Name</label>
                    <input
                      type="text"
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Last Name</label>
                    <input
                      type="text"
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Company</label>
                  <input
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Phone</label>
                  <input
                    type="tel"
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Solution Interest</label>
                  <select className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary">
                    <option value="">Select solution</option>
                    {businessSolutions.map(solution => (
                      <option key={solution.id} value={solution.id}>{solution.title}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Monthly Shipping Volume</label>
                  <select className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary">
                    <option value="">Select volume</option>
                    <option value="100-500">100-500 shipments</option>
                    <option value="500-1000">500-1,000 shipments</option>
                    <option value="1000-5000">1,000-5,000 shipments</option>
                    <option value="5000+">5,000+ shipments</option>
                  </select>
                </div>

                <button type="submit" className="w-full btn btn-primary">
                  Request Quote
                </button>
              </form>
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
                <h2 className="text-2xl font-bold text-primary">Business Price Calculator</h2>
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
                initialData={{ service_type: 'bulk', volume_tier: 100 }}
              />

              {calculationResult && (
                <div className="mt-6 flex gap-4">
                  <button className="btn btn-primary flex-1">
                    Get Business Quote - Rs. {calculationResult.total.toFixed(2)}
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

export default BusinessPage;
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import PriceCalculator from '../common/PriceCalculator';
import { PricingBreakdown } from '../../utils/pricingCalculator';

const CtaSection: React.FC = () => {
  const [calculationResult, setCalculationResult] = useState<PricingBreakdown | null>(null);

  const features = [
    "Real-time tracking and notifications",
    "Secure payment options including COD",
    "Professional handling of all package types",
    "Customer support available 7 days a week",
    "Specialized eCommerce integration",
    "Island-wide coverage with competitive rates"
  ];

  const handleCalculationComplete = (result: PricingBreakdown) => {
    setCalculationResult(result);
  };

  return (
    <section className="py-16 bg-primary relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-light rounded-full opacity-30 -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent rounded-full opacity-10 translate-y-1/2 -translate-x-1/2"></div>
      </div>
      
      <div className="container relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to transform your delivery experience?
            </h2>
            <p className="text-gray-200 mb-8">
              Join thousands of satisfied customers who trust QuickLanka Express for their logistics needs. Our state-of-the-art technology and dedicated team ensure your packages arrive safely and on time, every time.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 mb-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start">
                  <CheckCircle size={20} className="text-gold mr-2 flex-shrink-0 mt-1" />
                  <span className="text-gray-200">{feature}</span>
                </div>
              ))}
            </div>
            
            <div className="flex flex-wrap gap-4">
              <Link to="/book" className="btn btn-gold text-base px-6 py-3 font-medium">
                Schedule a Pickup
              </Link>
              <Link to="/business" className="btn bg-white/10 text-white hover:bg-white/20 text-base px-6 py-3 font-medium">
                Business Solutions
              </Link>
            </div>
          </div>
          
            <div className="flex justify-center items-center">
            <img
              src="https://images.pexels.com/photos/6169128/pexels-photo-6169128.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              alt="Delivery Illustration"
              className="max-w-full h-auto rounded-lg shadow-lg"
            />
            </div>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
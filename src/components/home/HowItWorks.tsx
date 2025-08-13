import React from 'react';
import { ClipboardList, Package, Truck, CheckCircle } from 'lucide-react';

interface StepProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  number: number;
  isLast?: boolean;
}

const Step: React.FC<StepProps> = ({ icon, title, description, number, isLast = false }) => {
  return (
    <div className="flex">
      <div className="flex flex-col items-center mr-6">
        <div className="bg-accent text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg">
          {number}
        </div>
        {!isLast && (
          <div className="w-1 flex-grow bg-gray-200 my-2"></div>
        )}
      </div>
      <div className="pb-10">
        <div className="bg-primary/5 rounded-full w-14 h-14 flex items-center justify-center mb-4">
          <div className="text-primary">{icon}</div>
        </div>
        <h3 className="font-semibold text-xl mb-2">{title}</h3>
        <p className="text-text-light">{description}</p>
      </div>
    </div>
  );
};

const HowItWorks: React.FC = () => {
  return (
    <section className="section bg-white">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">How It Works</h2>
          <p className="text-text-light max-w-2xl mx-auto">
            Our simple 4-step process makes sending packages across Sri Lanka quick and hassle-free.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <Step 
              icon={<ClipboardList size={24} />}
              title="Book Your Pickup"
              description="Schedule a pickup online or via our mobile app. Enter sender and receiver details, package information, and select your preferred delivery option."
              number={1}
            />
            
            <Step 
              icon={<Package size={24} />}
              title="Package Collection"
              description="Our courier will arrive at your location within the scheduled time window. They'll verify the package details and provide a tracking number."
              number={2}
            />
            
            <Step 
              icon={<Truck size={24} />}
              title="Shipment in Transit"
              description="Your package is transported to its destination via our optimized logistics network. Track its journey in real-time through our app or website."
              number={3}
            />
            
            <Step 
              icon={<CheckCircle size={24} />}
              title="Successful Delivery"
              description="We deliver your package to the recipient and obtain proof of delivery. You'll receive a confirmation notification once completed."
              number={4}
              isLast
            />
          </div>
          
          <div className="rounded-lg overflow-hidden shadow-xl">
            <img 
              src="https://images.pexels.com/photos/4391470/pexels-photo-4391470.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
              alt="QuickLanka Express Delivery Process" 
              className="w-full h-auto object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
import React from 'react';
import { Link } from 'react-router-dom';
import { Truck, Package, Clock, CreditCard, FileText, Globe, ShoppingBag, Briefcase } from 'lucide-react';

interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  link: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ icon, title, description, link }) => {
  return (
    <div className="card group hover:shadow-lg transition-all duration-300">
      <div className="p-6">
        <div className="bg-primary/5 rounded-full w-14 h-14 flex items-center justify-center mb-4 group-hover:bg-accent/10 transition-colors">
          <div className="text-primary group-hover:text-accent transition-colors">
            {icon}
          </div>
        </div>
        <h3 className="font-semibold text-xl mb-2 group-hover:text-accent transition-colors">{title}</h3>
        <p className="text-text-light mb-4">{description}</p>
        <Link to={link} className="text-primary font-medium flex items-center group-hover:text-accent transition-colors">
          Learn more
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );
};

const ServiceCards: React.FC = () => {
  const services = [
    {
      icon: <Clock size={24} />,
      title: "Same-Day Delivery",
      description: "Get your packages delivered within hours across the city with our premium same-day service.",
      link: "/services"
    },
    {
      icon: <Truck size={24} />,
      title: "Overnight Express",
      description: "Island-wide delivery by the next business day for all your urgent shipping needs.",
      link: "/services"
    },
    {
      icon: <CreditCard size={24} />,
      title: "Cash on Delivery",
      description: "Secure payment collection service for eCommerce businesses with same-day remittance.",
      link: "/services"
    },
    {
      icon: <FileText size={24} />,
      title: "Document Delivery",
      description: "Secure and timely delivery of important documents with signature confirmation.",
      link: "/services"
    },
    {
      icon: <ShoppingBag size={24} />,
      title: "eCommerce Fulfillment",
      description: "Complete fulfillment solution including storage, packing, and last-mile delivery.",
      link: "/services"
    },
    {
      icon: <Globe size={24} />,
      title: "International Shipping",
      description: "Reliable international shipping with customs handling and tracking capabilities.",
      link: "/services"
    },
    {
      icon: <Package size={24} />,
      title: "Fragile & Special Care",
      description: "Special handling for delicate, valuable or temperature-sensitive items.",
      link: "/services"
    },
    {
      icon: <Briefcase size={24} />,
      title: "Bulk Commercial",
      description: "Cost-effective solutions for businesses with high-volume shipping requirements.",
      link: "/services"
    }
  ];

  return (
    <section className="section bg-background">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Our Services</h2>
          <p className="text-text-light max-w-2xl mx-auto">
            From same-day delivery to specialized logistics solutions, QuickLanka Express offers a comprehensive range of services to meet all your delivery needs.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <ServiceCard
              key={index}
              icon={service.icon}
              title={service.title}
              description={service.description}
              link={service.link}
            />
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Link to="/services" className="btn btn-primary">
            View All Services
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ServiceCards;
import React, { useState } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';

interface TestimonialProps {
  quote: string;
  author: string;
  position: string;
  company: string;
  image: string;
  rating: number;
}

const Testimonial: React.FC<TestimonialProps> = ({ quote, author, position, company, image, rating }) => {
  return (
    <div className="bg-white p-6 md:p-8 rounded-lg shadow-md">
      <div className="flex mb-4">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={18}
            fill={i < rating ? "#FFB000" : "none"}
            stroke={i < rating ? "#FFB000" : "#CBD5E1"}
          />
        ))}
      </div>
      <p className="text-text-light mb-6 italic">"{quote}"</p>
      <div className="flex items-center">
        <img 
          src={image} 
          alt={author} 
          className="w-12 h-12 rounded-full object-cover mr-4"
        />
        <div>
          <h4 className="font-semibold text-primary">{author}</h4>
          <p className="text-sm text-text-light">{position}, {company}</p>
        </div>
      </div>
    </div>
  );
};

const TestimonialSection: React.FC = () => {
  const [currentCategory, setCurrentCategory] = useState("all");
  
  const testimonials = [
    {
      quote: "QuickLanka Express has been a game-changer for our eCommerce business. Their COD service and real-time tracking have significantly improved our customer satisfaction rates.",
      author: "Dharshana Perera",
      position: "CEO",
      company: "StyleMart",
      image: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      rating: 5,
      category: "business"
    },
    {
      quote: "I regularly use QuickLanka for sending documents across Colombo. Their same-day delivery is incredibly reliable, and their online tracking makes it easy to know exactly when my packages will arrive.",
      author: "Amali Fernando",
      position: "Legal Consultant",
      company: "LegalEdge",
      image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      rating: 4,
      category: "individual"
    },
    {
      quote: "Our hospital relies on QuickLanka for urgent medical deliveries. Their speed and care in handling sensitive items make them our trusted logistics partner.",
      author: "Dr. Rajith Silva",
      position: "Director",
      company: "Asiri Hospital",
      image: "https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      rating: 5,
      category: "healthcare"
    },
    {
      quote: "Since partnering with QuickLanka Express, our delivery times have decreased by 40%. Their API integration with our online store has streamlined our entire fulfillment process.",
      author: "Malik Jayawardene",
      position: "Operations Manager",
      company: "TechZone",
      image: "https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      rating: 5,
      category: "business"
    },
    {
      quote: "I've tried many courier services in Sri Lanka, but QuickLanka stands out with their professional drivers and careful handling. My fragile items always arrive intact.",
      author: "Priya Gunaratne",
      position: "Artist",
      company: "PriyaArts",
      image: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      rating: 4,
      category: "individual"
    }
  ];
  
  const filteredTestimonials = currentCategory === "all" 
    ? testimonials 
    : testimonials.filter(t => t.category === currentCategory);
  
  return (
    <section className="section bg-gray-50">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">What Our Customers Say</h2>
          <p className="text-text-light max-w-2xl mx-auto">
            Don't just take our word for it - see what our customers across Sri Lanka have to say about our service.
          </p>
          
          <div className="flex justify-center mt-6 space-x-2">
            <button
              onClick={() => setCurrentCategory("all")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                currentCategory === "all" ? "bg-primary text-white" : "bg-white text-primary hover:bg-gray-100"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setCurrentCategory("individual")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                currentCategory === "individual" ? "bg-primary text-white" : "bg-white text-primary hover:bg-gray-100"
              }`}
            >
              Individuals
            </button>
            <button
              onClick={() => setCurrentCategory("business")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                currentCategory === "business" ? "bg-primary text-white" : "bg-white text-primary hover:bg-gray-100"
              }`}
            >
              Business
            </button>
            <button
              onClick={() => setCurrentCategory("healthcare")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                currentCategory === "healthcare" ? "bg-primary text-white" : "bg-white text-primary hover:bg-gray-100"
              }`}
            >
              Healthcare
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTestimonials.map((testimonial, index) => (
            <Testimonial
              key={index}
              quote={testimonial.quote}
              author={testimonial.author}
              position={testimonial.position}
              company={testimonial.company}
              image={testimonial.image}
              rating={testimonial.rating}
            />
          ))}
        </div>
        
        <div className="text-center mt-12">
          <div className="inline-flex items-center bg-white rounded-full p-1 shadow-sm">
            <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
              <ChevronLeft size={20} />
            </button>
            <div className="px-4">
              <span className="font-medium text-primary">1</span>
              <span className="text-text-light"> / 3</span>
            </div>
            <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
              <ChevronRight size={20} />
            </button>
          </div>
          
          <div className="mt-4">
            <span className="text-primary font-semibold">4.8</span>
            <span className="text-text-light"> / 5 average from </span>
            <span className="text-primary font-semibold">1,200+</span>
            <span className="text-text-light"> reviews</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
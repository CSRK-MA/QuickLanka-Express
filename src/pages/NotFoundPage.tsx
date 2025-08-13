import React from 'react';
import { Link } from 'react-router-dom';
import { Package, Home } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="text-center max-w-md mx-auto p-6">
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <Package size={120} className="text-primary/20" />
            <div className="absolute inset-0 flex items-center justify-center text-5xl font-bold text-primary">
              404
            </div>
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-primary mb-4">Page Not Found</h1>
        <p className="text-text-light mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/" className="btn btn-primary gap-2">
            <Home size={18} />
            Return Home
          </Link>
          <Link to="/track" className="btn btn-outline gap-2">
            <Package size={18} />
            Track a Package
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
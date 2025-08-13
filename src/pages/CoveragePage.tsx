import React, { useState, useEffect } from 'react';
import { MapPin, Clock, Truck, CheckCircle, Search, Filter, Phone, Star, Calculator, Package, TrendingUp, Users, Zap, Info, AlertCircle } from 'lucide-react';
import PriceCalculator from '../components/common/PriceCalculator';
import { PricingBreakdown, CITY_ZONES } from '../utils/pricingCalculator';
import useRealTimeUpdates from '../hooks/useRealTimeUpdates';

interface CoverageArea {
  id: string;
  district: string;
  province: string;
  cities: string[];
  services: {
    same_day: boolean;
    overnight: boolean;
    cod: boolean;
    international: boolean;
  };
  delivery_time: string;
  pickup_time: string;
  coverage_level: 'full' | 'partial' | 'limited';
  population: number;
  coordinates: { lat: number; lng: number };
  pricing_zone: 'zone1' | 'zone2' | 'zone3';
  monthly_volume: number;
  satisfaction_rating: number;
}

const CoveragePage: React.FC = () => {
  useEffect(() => {
    document.title = 'Coverage Areas - QuickLanka Express';
  }, []);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('all');
  const [selectedService, setSelectedService] = useState('all');
  const [selectedArea, setSelectedArea] = useState<CoverageArea | null>(null);
  const [showPriceCalculator, setShowPriceCalculator] = useState(false);
  const [calculationResult, setCalculationResult] = useState<PricingBreakdown | null>(null);

  // Real-time updates
  const { updates, isConnected } = useRealTimeUpdates({
    enablePriceUpdates: true,
    enableServiceUpdates: true
  });

  const coverageAreas: CoverageArea[] = [
    {
      id: 'colombo',
      district: 'Colombo',
      province: 'Western',
      cities: ['Colombo', 'Dehiwala-Mount Lavinia', 'Moratuwa', 'Sri Jayawardenepura Kotte', 'Maharagama', 'Kesbewa'],
      services: { same_day: true, overnight: true, cod: true, international: true },
      delivery_time: '2-6 hours',
      pickup_time: '30-60 minutes',
      coverage_level: 'full',
      population: 2324349,
      coordinates: { lat: 6.9271, lng: 79.8612 },
      pricing_zone: 'zone1',
      monthly_volume: 15000,
      satisfaction_rating: 4.8
    },
    {
      id: 'gampaha',
      district: 'Gampaha',
      province: 'Western',
      cities: ['Gampaha', 'Negombo', 'Katunayake', 'Ja-Ela', 'Wattala', 'Kelaniya', 'Kadawatha'],
      services: { same_day: true, overnight: true, cod: true, international: false },
      delivery_time: '3-8 hours',
      pickup_time: '45-90 minutes',
      coverage_level: 'full',
      population: 2304833,
      coordinates: { lat: 7.0873, lng: 79.9990 },
      pricing_zone: 'zone1',
      monthly_volume: 12000,
      satisfaction_rating: 4.7
    },
    {
      id: 'kalutara',
      district: 'Kalutara',
      province: 'Western',
      cities: ['Kalutara', 'Panadura', 'Horana', 'Beruwala', 'Aluthgama', 'Matugama'],
      services: { same_day: true, overnight: true, cod: true, international: false },
      delivery_time: '4-8 hours',
      pickup_time: '60-120 minutes',
      coverage_level: 'full',
      population: 1221948,
      coordinates: { lat: 6.5854, lng: 79.9607 },
      pricing_zone: 'zone1',
      monthly_volume: 8000,
      satisfaction_rating: 4.6
    },
    {
      id: 'kandy',
      district: 'Kandy',
      province: 'Central',
      cities: ['Kandy', 'Peradeniya', 'Gampola', 'Nawalapitiya', 'Wattegama'],
      services: { same_day: false, overnight: true, cod: true, international: false },
      delivery_time: 'Next day',
      pickup_time: '2-4 hours',
      coverage_level: 'full',
      population: 1375382,
      coordinates: { lat: 7.2906, lng: 80.6337 },
      pricing_zone: 'zone2',
      monthly_volume: 6000,
      satisfaction_rating: 4.5
    },
    {
      id: 'galle',
      district: 'Galle',
      province: 'Southern',
      cities: ['Galle', 'Hikkaduwa', 'Ambalangoda', 'Elpitiya', 'Bentota'],
      services: { same_day: false, overnight: true, cod: true, international: false },
      delivery_time: 'Next day',
      pickup_time: '3-5 hours',
      coverage_level: 'full',
      population: 1063334,
      coordinates: { lat: 6.0535, lng: 80.2210 },
      pricing_zone: 'zone2',
      monthly_volume: 4500,
      satisfaction_rating: 4.4
    },
    {
      id: 'matara',
      district: 'Matara',
      province: 'Southern',
      cities: ['Matara', 'Weligama', 'Mirissa', 'Dikwella', 'Akuressa'],
      services: { same_day: false, overnight: true, cod: true, international: false },
      delivery_time: 'Next day',
      pickup_time: '3-6 hours',
      coverage_level: 'partial',
      population: 814048,
      coordinates: { lat: 5.9549, lng: 80.5550 },
      pricing_zone: 'zone3',
      monthly_volume: 2800,
      satisfaction_rating: 4.2
    },
    {
      id: 'hambantota',
      district: 'Hambantota',
      province: 'Southern',
      cities: ['Hambantota', 'Tangalle', 'Tissamaharama', 'Beliatta'],
      services: { same_day: false, overnight: true, cod: false, international: false },
      delivery_time: '1-2 days',
      pickup_time: '4-8 hours',
      coverage_level: 'limited',
      population: 599903,
      coordinates: { lat: 6.1241, lng: 81.1185 },
      pricing_zone: 'zone3',
      monthly_volume: 1200,
      satisfaction_rating: 4.0
    },
    {
      id: 'jaffna',
      district: 'Jaffna',
      province: 'Northern',
      cities: ['Jaffna', 'Chavakachcheri', 'Point Pedro', 'Karainagar'],
      services: { same_day: false, overnight: true, cod: true, international: false },
      delivery_time: '1-2 days',
      pickup_time: '4-6 hours',
      coverage_level: 'partial',
      population: 583882,
      coordinates: { lat: 9.6615, lng: 80.0255 },
      pricing_zone: 'zone3',
      monthly_volume: 2000,
      satisfaction_rating: 4.1
    },
    {
      id: 'anuradhapura',
      district: 'Anuradhapura',
      province: 'North Central',
      cities: ['Anuradhapura', 'Kekirawa', 'Thambuttegama', 'Galenbindunuwewa'],
      services: { same_day: false, overnight: true, cod: true, international: false },
      delivery_time: '1-2 days',
      pickup_time: '3-5 hours',
      coverage_level: 'partial',
      population: 860575,
      coordinates: { lat: 8.3114, lng: 80.4037 },
      pricing_zone: 'zone3',
      monthly_volume: 1800,
      satisfaction_rating: 4.0
    },
    {
      id: 'kurunegala',
      district: 'Kurunegala',
      province: 'North Western',
      cities: ['Kurunegala', 'Kuliyapitiya', 'Narammala', 'Wariyapola'],
      services: { same_day: false, overnight: true, cod: true, international: false },
      delivery_time: 'Next day',
      pickup_time: '2-4 hours',
      coverage_level: 'full',
      population: 1618465,
      coordinates: { lat: 7.4818, lng: 80.3609 },
      pricing_zone: 'zone2',
      monthly_volume: 3500,
      satisfaction_rating: 4.3
    }
  ];

  const provinces = ['Western', 'Central', 'Southern', 'Northern', 'Eastern', 'North Western', 'North Central', 'Uva', 'Sabaragamuwa'];
  
  const serviceTypes = [
    { id: 'same_day', name: 'Same Day Delivery' },
    { id: 'overnight', name: 'Overnight Express' },
    { id: 'cod', name: 'Cash on Delivery' },
    { id: 'international', name: 'International Shipping' }
  ];

  const filteredAreas = coverageAreas.filter(area => {
    const matchesSearch = area.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         area.cities.some(city => city.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesProvince = selectedProvince === 'all' || area.province === selectedProvince;
    const matchesService = selectedService === 'all' || area.services[selectedService as keyof typeof area.services];
    
    return matchesSearch && matchesProvince && matchesService;
  });

  const handleCalculationComplete = (result: PricingBreakdown) => {
    setCalculationResult(result);
  };

  const getCoverageBadge = (level: string) => {
    const badges = {
      full: { color: 'bg-success text-white', text: 'Full Coverage' },
      partial: { color: 'bg-warning text-white', text: 'Partial Coverage' },
      limited: { color: 'bg-error text-white', text: 'Limited Coverage' }
    };
    return badges[level as keyof typeof badges] || badges.limited;
  };

  const CoverageCard: React.FC<{ area: CoverageArea }> = ({ area }) => {
    const badge = getCoverageBadge(area.coverage_level);
    
    return (
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group">
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="font-semibold text-xl text-primary mb-1">{area.district}</h3>
              <p className="text-text-light">{area.province} Province</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${badge.color}`}>
              {badge.text}
            </span>
          </div>

          <div className="space-y-3 mb-4">
            <div className="flex items-center text-sm">
              <Clock size={16} className="text-accent mr-2" />
              <span>Delivery: {area.delivery_time}</span>
            </div>
            <div className="flex items-center text-sm">
              <Truck size={16} className="text-accent mr-2" />
              <span>Pickup: {area.pickup_time}</span>
            </div>
            <div className="flex items-center text-sm">
              <MapPin size={16} className="text-accent mr-2" />
              <span>{area.cities.length} cities covered</span>
            </div>
            <div className="flex items-center text-sm">
              <Star size={16} className="text-gold mr-2" />
              <span>{area.satisfaction_rating}/5.0 rating</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {area.services.same_day && (
              <span className="bg-success/10 text-success px-2 py-1 rounded text-xs">Same Day</span>
            )}
            {area.services.overnight && (
              <span className="bg-primary/10 text-primary px-2 py-1 rounded text-xs">Overnight</span>
            )}
            {area.services.cod && (
              <span className="bg-gold/10 text-gold px-2 py-1 rounded text-xs">COD</span>
            )}
            {area.services.international && (
              <span className="bg-accent/10 text-accent px-2 py-1 rounded text-xs">International</span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
            <div className="bg-gray-50 rounded p-2 text-center">
              <div className="font-semibold text-primary">{area.monthly_volume.toLocaleString()}</div>
              <div className="text-gray-500">Monthly Volume</div>
            </div>
            <div className="bg-gray-50 rounded p-2 text-center">
              <div className="font-semibold text-primary">{area.pricing_zone.toUpperCase()}</div>
              <div className="text-gray-500">Pricing Zone</div>
            </div>
          </div>

          <div className="flex gap-2">
            <button 
              onClick={() => setSelectedArea(area)}
              className="btn btn-primary flex-1 text-sm py-2"
            >
              View Details
            </button>
            <button 
              onClick={() => setShowPriceCalculator(true)}
              className="btn btn-outline text-sm py-2"
            >
              <Calculator size={14} />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Real-time Updates Indicator */}
      {isConnected && (
        <div className="bg-success text-white text-center py-2 text-sm">
          🟢 Real-time coverage updates active • Last update: {new Date().toLocaleTimeString()}
        </div>
      )}

      {/* Hero Section */}
      <section className="bg-primary text-white py-16">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Island-wide Coverage
            </h1>
            <p className="text-xl text-gray-200 mb-8">
              Comprehensive delivery services across all 25 districts of Sri Lanka with varying service levels to meet your needs.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
              <div className="bg-white/10 rounded-lg p-4">
                <div className="text-3xl font-bold text-gold">25</div>
                <div className="text-gray-200">Districts Covered</div>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <div className="text-3xl font-bold text-gold">200+</div>
                <div className="text-gray-200">Cities & Towns</div>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <div className="text-3xl font-bold text-gold">98.5%</div>
                <div className="text-gray-200">Coverage Rate</div>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <div className="text-3xl font-bold text-gold">4.5/5</div>
                <div className="text-gray-200">Avg. Rating</div>
              </div>
            </div>
            <div className="mt-8">
              <button 
                onClick={() => setShowPriceCalculator(true)}
                className="btn btn-gold mr-4"
              >
                <Calculator size={20} className="mr-2" />
                Calculate Delivery Price
              </button>
              <a href="#coverage" className="btn bg-white/10 text-white hover:bg-white/20">
                Explore Coverage
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-8 bg-white shadow-sm">
        <div className="container">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by district or city..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <select
              className="px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
              value={selectedProvince}
              onChange={(e) => setSelectedProvince(e.target.value)}
            >
              <option value="all">All Provinces</option>
              {provinces.map(province => (
                <option key={province} value={province}>{province}</option>
              ))}
            </select>
            
            <select
              className="px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
            >
              <option value="all">All Services</option>
              {serviceTypes.map(service => (
                <option key={service.id} value={service.id}>{service.name}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Coverage Areas Grid */}
      <section id="coverage" className="py-12">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">Coverage Areas ({filteredAreas.length})</h2>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-success rounded-full mr-2"></div>
                <span>Full Coverage</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-warning rounded-full mr-2"></div>
                <span>Partial Coverage</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-error rounded-full mr-2"></div>
                <span>Limited Coverage</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAreas.map((area) => (
              <CoverageCard key={area.id} area={area} />
            ))}
          </div>

          {filteredAreas.length === 0 && (
            <div className="text-center py-12">
              <MapPin size={48} className="text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No areas found</h3>
              <p className="text-gray-500">Try adjusting your search criteria</p>
            </div>
          )}
        </div>
      </section>

      {/* Service Levels Explanation */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Service Levels Explained</h2>
            <p className="text-text-light max-w-2xl mx-auto">
              We offer different service levels based on location accessibility and demand patterns.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-success/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={24} className="text-success" />
              </div>
              <h3 className="font-semibold text-lg mb-3 text-success">Full Coverage</h3>
              <ul className="text-text-light space-y-2 text-left">
                <li>• All delivery services available</li>
                <li>• Same-day delivery options</li>
                <li>• Multiple daily pickup schedules</li>
                <li>• Cash on delivery available</li>
                <li>• Real-time tracking</li>
              </ul>
            </div>

            <div className="text-center">
              <div className="bg-warning/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Clock size={24} className="text-warning" />
              </div>
              <h3 className="font-semibold text-lg mb-3 text-warning">Partial Coverage</h3>
              <ul className="text-text-light space-y-2 text-left">
                <li>• Overnight and standard delivery</li>
                <li>• Scheduled pickup times</li>
                <li>• Limited same-day availability</li>
                <li>• COD available in main areas</li>
                <li>• Regular tracking updates</li>
              </ul>
            </div>

            <div className="text-center">
              <div className="bg-error/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <MapPin size={24} className="text-error" />
              </div>
              <h3 className="font-semibold text-lg mb-3 text-error">Limited Coverage</h3>
              <ul className="text-text-light space-y-2 text-left">
                <li>• Standard delivery only</li>
                <li>• Scheduled pickup required</li>
                <li>• Extended delivery times</li>
                <li>• Limited COD availability</li>
                <li>• Basic tracking available</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Area Detail Modal */}
      {selectedArea && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-primary">{selectedArea.district} District</h2>
                  <p className="text-text-light">{selectedArea.province} Province</p>
                </div>
                <button 
                  onClick={() => setSelectedArea(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="font-semibold text-lg mb-3">Coverage Details</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Coverage Level:</span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getCoverageBadge(selectedArea.coverage_level).color}`}>
                        {getCoverageBadge(selectedArea.coverage_level).text}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery Time:</span>
                      <span className="font-medium">{selectedArea.delivery_time}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Pickup Time:</span>
                      <span className="font-medium">{selectedArea.pickup_time}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Population:</span>
                      <span className="font-medium">{selectedArea.population.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Monthly Volume:</span>
                      <span className="font-medium">{selectedArea.monthly_volume.toLocaleString()} packages</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Customer Rating:</span>
                      <div className="flex items-center">
                        <Star size={16} className="text-gold mr-1" />
                        <span className="font-medium">{selectedArea.satisfaction_rating}/5.0</span>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span>Pricing Zone:</span>
                      <span className="font-medium">{selectedArea.pricing_zone.toUpperCase()}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-3">Available Services</h3>
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center justify-between">
                      <span>Same Day Delivery</span>
                      {selectedArea.services.same_day ? (
                        <CheckCircle size={16} className="text-success" />
                      ) : (
                        <span className="text-gray-400">✕</span>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Overnight Express</span>
                      {selectedArea.services.overnight ? (
                        <CheckCircle size={16} className="text-success" />
                      ) : (
                        <span className="text-gray-400">✕</span>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Cash on Delivery</span>
                      {selectedArea.services.cod ? (
                        <CheckCircle size={16} className="text-success" />
                      ) : (
                        <span className="text-gray-400">✕</span>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <span>International Shipping</span>
                      {selectedArea.services.international ? (
                        <CheckCircle size={16} className="text-success" />
                      ) : (
                        <span className="text-gray-400">✕</span>
                      )}
                    </div>
                  </div>

                  <h3 className="font-semibold text-lg mb-3">Performance Metrics</h3>
                  <div className="space-y-3">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm">On-time Delivery</span>
                        <span className="font-semibold text-success">98.2%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-success h-2 rounded-full" style={{ width: '98.2%' }}></div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm">Customer Satisfaction</span>
                        <span className="font-semibold text-gold">{selectedArea.satisfaction_rating}/5.0</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-gold h-2 rounded-full" style={{ width: `${(selectedArea.satisfaction_rating / 5) * 100}%` }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold text-lg mb-3">Covered Cities & Towns</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedArea.cities.map((city, index) => (
                    <span key={index} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                      {city}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex gap-4">
                <button className="btn btn-primary flex-1">
                  Book Delivery
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
                  Contact
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
                <h2 className="text-2xl font-bold text-primary">Coverage Area Price Calculator</h2>
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
                    Book Now - Rs. {calculationResult.total.toFixed(2)}
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

export default CoveragePage;
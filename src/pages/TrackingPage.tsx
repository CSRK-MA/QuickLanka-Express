import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Package, 
  CheckCircle, 
  Truck, 
  ArrowRight, 
  MapPin, 
  Calendar, 
  Clock, 
  Phone, 
  Mail, 
  User, 
  Building,
  Star,
  Download,
  Share2,
  Copy,
  RefreshCw,
  AlertCircle,
  Info,
  Navigation,
  Camera,
  FileText,
  Shield,
  CreditCard,
  Search,
  Filter,
  ExternalLink
} from 'lucide-react';
import toast from 'react-hot-toast';

interface TrackingEvent {
  id: string;
  step: string;
  location: string;
  time: string;
  completed: boolean;
  description?: string;
  agent?: string;
  proof_image?: string;
  signature?: string;
  notes?: string;
}

interface TrackingResult {
  id: string;
  booking_number: string;
  status: 'ordered' | 'picked' | 'in_transit' | 'out_for_delivery' | 'delivered' | 'failed' | 'returned';
  timeline: TrackingEvent[];
  sender: {
    name: string;
    phone: string;
    address: string;
  };
  receiver: {
    name: string;
    phone: string;
    address: string;
  };
  package_details: {
    description: string;
    weight: number;
    value: number;
    special_handling: string[];
  };
  service_type: string;
  estimated_delivery: string;
  actual_delivery?: string;
  current_location: string;
  delivery_agent?: {
    name: string;
    phone: string;
    vehicle: string;
    photo?: string;
  };
  pricing: {
    total: number;
    payment_status: 'pending' | 'paid' | 'cod_pending' | 'refunded';
  };
  additional_services: {
    insurance: boolean;
    cod: boolean;
    signature_required: boolean;
    photo_proof: boolean;
  };
  created_at: string;
  last_updated: string;
  delivery_attempts: number;
  rating?: number;
  feedback?: string;
}

interface RecentSearch {
  id: string;
  tracking_number: string;
  date: string;
  status: string;
}

const TrackingPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTrackingId = searchParams.get('id') || '';

  useEffect(() => {
    document.title = 'Track Your Parcel - QuickLanka Express';
    loadRecentSearches();
    if (initialTrackingId) {
      setTrackingId(initialTrackingId);
      handleSearch(null, initialTrackingId);
    }
  }, []);

  const [trackingId, setTrackingId] = useState(initialTrackingId);
  const [isTracking, setIsTracking] = useState(false);
  const [trackingResult, setTrackingResult] = useState<TrackingResult | null>(null);
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);
  const [showRecentSearches, setShowRecentSearches] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState<NodeJS.Timeout | null>(null);

  // Load recent searches from localStorage
  const loadRecentSearches = () => {
    try {
      const searches = localStorage.getItem('quicklanka_recent_searches');
      if (searches) {
        setRecentSearches(JSON.parse(searches));
      }
    } catch (error) {
      console.error('Error loading recent searches:', error);
    }
  };

  // Save search to recent searches
  const saveToRecentSearches = (trackingNumber: string, status: string) => {
    try {
      const newSearch: RecentSearch = {
        id: Date.now().toString(),
        tracking_number: trackingNumber,
        date: new Date().toISOString(),
        status
      };

      const updatedSearches = [
        newSearch,
        ...recentSearches.filter(s => s.tracking_number !== trackingNumber)
      ].slice(0, 10); // Keep only last 10 searches

      setRecentSearches(updatedSearches);
      localStorage.setItem('quicklanka_recent_searches', JSON.stringify(updatedSearches));
    } catch (error) {
      console.error('Error saving recent search:', error);
    }
  };

  // Mock tracking data generator
  const generateMockTrackingData = (trackingNumber: string): TrackingResult => {
    const statuses = ['ordered', 'picked', 'in_transit', 'out_for_delivery', 'delivered'];
    const currentStatusIndex = Math.floor(Math.random() * statuses.length);
    const currentStatus = statuses[currentStatusIndex] as TrackingResult['status'];

    const baseTimeline: TrackingEvent[] = [
      {
        id: '1',
        step: 'Order Created',
        location: 'Colombo Main Branch',
        time: '2024-01-15 14:30:00',
        completed: true,
        description: 'Booking confirmed and package details recorded',
        agent: 'System'
      },
      {
        id: '2',
        step: 'Package Picked Up',
        location: 'Colombo 05, Havelock Road',
        time: '2024-01-15 16:45:00',
        completed: currentStatusIndex >= 1,
        description: 'Package collected from sender location',
        agent: 'Kamal Perera',
        proof_image: currentStatusIndex >= 1 ? 'pickup_proof.jpg' : undefined
      },
      {
        id: '3',
        step: 'In Transit',
        location: 'Kadawatha Hub',
        time: '2024-01-15 18:20:00',
        completed: currentStatusIndex >= 2,
        description: 'Package processed at sorting facility',
        agent: 'Hub Team'
      },
      {
        id: '4',
        step: 'Out for Delivery',
        location: 'Kandy Distribution Center',
        time: currentStatusIndex >= 3 ? '2024-01-16 09:00:00' : 'Expected 2024-01-16 09:00:00',
        completed: currentStatusIndex >= 3,
        description: 'Package loaded for final delivery',
        agent: currentStatusIndex >= 3 ? 'Lahiru Jayawardene' : undefined
      },
      {
        id: '5',
        step: 'Delivered',
        location: 'Kandy, William Gopallawa Mawatha',
        time: currentStatusIndex >= 4 ? '2024-01-16 14:30:00' : 'Expected 2024-01-16 14:30:00',
        completed: currentStatusIndex >= 4,
        description: currentStatusIndex >= 4 ? 'Package successfully delivered' : 'Awaiting delivery',
        agent: currentStatusIndex >= 4 ? 'Lahiru Jayawardene' : undefined,
        signature: currentStatusIndex >= 4 ? 'K. Jayasinghe' : undefined,
        proof_image: currentStatusIndex >= 4 ? 'delivery_proof.jpg' : undefined
      }
    ];

    return {
      id: trackingNumber,
      booking_number: `QL${trackingNumber.slice(-8)}`,
      status: currentStatus,
      timeline: baseTimeline,
      sender: {
        name: 'Amal Perera',
        phone: '+94 77 123 4567',
        address: 'No. 123, Havelock Road, Colombo 05'
      },
      receiver: {
        name: 'Kamala Jayasinghe',
        phone: '+94 71 987 6543',
        address: 'No. 456, William Gopallawa Mawatha, Kandy'
      },
      package_details: {
        description: 'Electronics - Mobile Phone',
        weight: 0.5,
        value: 85000,
        special_handling: ['fragile']
      },
      service_type: 'Overnight Express',
      estimated_delivery: '2024-01-16 14:00:00',
      actual_delivery: currentStatus === 'delivered' ? '2024-01-16 14:30:00' : undefined,
      current_location: baseTimeline.find(t => t.completed)?.location || 'Colombo Main Branch',
      delivery_agent: currentStatusIndex >= 3 ? {
        name: 'Lahiru Jayawardene',
        phone: '+94 76 555 0123',
        vehicle: 'Motorcycle - CAR-1234',
        photo: 'agent_photo.jpg'
      } : undefined,
      pricing: {
        total: 650,
        payment_status: 'paid'
      },
      additional_services: {
        insurance: true,
        cod: false,
        signature_required: true,
        photo_proof: true
      },
      created_at: '2024-01-15 14:30:00',
      last_updated: new Date().toISOString(),
      delivery_attempts: currentStatus === 'failed' ? 2 : currentStatusIndex >= 3 ? 1 : 0,
      rating: currentStatus === 'delivered' ? 5 : undefined,
      feedback: currentStatus === 'delivered' ? 'Excellent service! Package arrived on time and in perfect condition.' : undefined
    };
  };

  const handleSearch = async (e: React.FormEvent | null, searchId?: string) => {
    if (e) e.preventDefault();
    
    const searchTrackingId = searchId || trackingId;
    if (!searchTrackingId.trim()) {
      setError('Please enter a tracking number');
      return;
    }

    setIsTracking(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Validate tracking number format
      if (!/^(QL|QLE)[A-Z0-9]{8,12}$/i.test(searchTrackingId)) {
        throw new Error('Invalid tracking number format');
      }

      const mockData = generateMockTrackingData(searchTrackingId);
      setTrackingResult(mockData);
      saveToRecentSearches(searchTrackingId, mockData.status);
      
      // Update URL
      setSearchParams({ id: searchTrackingId });
      
      toast.success('Tracking information loaded');
    } catch (error: any) {
      setError(error.message || 'Tracking number not found');
      setTrackingResult(null);
      toast.error('Failed to load tracking information');
    } finally {
      setIsTracking(false);
    }
  };

  // Auto-refresh functionality
  useEffect(() => {
    if (autoRefresh && trackingResult && trackingResult.status !== 'delivered') {
      const interval = setInterval(() => {
        handleSearch(null, trackingId);
      }, 30000); // Refresh every 30 seconds
      
      setRefreshInterval(interval);
      return () => clearInterval(interval);
    } else if (refreshInterval) {
      clearInterval(refreshInterval);
      setRefreshInterval(null);
    }
  }, [autoRefresh, trackingResult]);

  // Get status percentage for progress bar
  const getStatusPercentage = (status: string) => {
    const statusMap: Record<string, number> = {
      'ordered': 20,
      'picked': 40,
      'in_transit': 60,
      'out_for_delivery': 80,
      'delivered': 100,
      'failed': 75,
      'returned': 50
    };
    
    return statusMap[status] || 0;
  };

  // Get status color
  const getStatusColor = (status: string) => {
    const colorMap: Record<string, string> = {
      'ordered': 'bg-blue-500',
      'picked': 'bg-yellow-500',
      'in_transit': 'bg-orange-500',
      'out_for_delivery': 'bg-purple-500',
      'delivered': 'bg-green-500',
      'failed': 'bg-red-500',
      'returned': 'bg-gray-500'
    };
    
    return colorMap[status] || 'bg-gray-500';
  };

  // Copy tracking number
  const copyTrackingNumber = () => {
    if (trackingResult) {
      navigator.clipboard.writeText(trackingResult.id);
      toast.success('Tracking number copied to clipboard');
    }
  };

  // Share tracking link
  const shareTracking = () => {
    if (trackingResult) {
      const url = `${window.location.origin}/track?id=${trackingResult.id}`;
      navigator.clipboard.writeText(url);
      toast.success('Tracking link copied to clipboard');
    }
  };

  // Download tracking report
  const downloadReport = () => {
    if (trackingResult) {
      // In a real app, this would generate and download a PDF
      toast.success('Tracking report downloaded');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4">Track Your Parcel</h1>
          <p className="text-text-light max-w-2xl mx-auto">
            Enter your QuickLanka Express tracking number to get real-time updates on your shipment status.
          </p>
        </div>
        
        {/* Search Form */}
        <div className="bg-white rounded-lg shadow-md p-6 md:p-8 mb-8">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3">
            <div className="flex-grow relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Package size={20} className="text-gray-400" />
              </div>
              <input
                type="text"
                className={`w-full pl-10 pr-4 py-3 border rounded-md focus:ring-2 focus:ring-primary focus:border-primary ${
                  error ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter tracking number (e.g., QL1234567890)"
                value={trackingId}
                onChange={(e) => {
                  setTrackingId(e.target.value);
                  setError(null);
                }}
                onFocus={() => setShowRecentSearches(true)}
                required
              />
              
              {/* Recent Searches Dropdown */}
              {showRecentSearches && recentSearches.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-md shadow-lg z-10 mt-1">
                  <div className="p-2 border-b border-gray-200">
                    <span className="text-sm font-medium text-gray-600">Recent Searches</span>
                  </div>
                  {recentSearches.slice(0, 5).map((search) => (
                    <button
                      key={search.id}
                      type="button"
                      className="w-full text-left p-3 hover:bg-gray-50 flex items-center justify-between"
                      onClick={() => {
                        setTrackingId(search.tracking_number);
                        setShowRecentSearches(false);
                        handleSearch(null, search.tracking_number);
                      }}
                    >
                      <div>
                        <div className="font-medium">{search.tracking_number}</div>
                        <div className="text-sm text-gray-500">
                          {new Date(search.date).toLocaleDateString()}
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        search.status === 'delivered' ? 'bg-green-100 text-green-800' :
                        search.status === 'in_transit' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {search.status}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <div className="flex gap-2">
              <button
                type="submit"
                className="btn btn-primary py-3 px-6"
                disabled={isTracking}
              >
                {isTracking ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Searching...
                  </>
                ) : (
                  <>
                    <Search size={16} className="mr-2" />
                    Track Package
                  </>
                )}
              </button>
              
              {trackingResult && (
                <button
                  type="button"
                  onClick={() => handleSearch(null, trackingId)}
                  className="btn btn-outline py-3 px-4"
                  disabled={isTracking}
                >
                  <RefreshCw size={16} />
                </button>
              )}
            </div>
          </form>
          
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center">
              <AlertCircle size={16} className="text-red-500 mr-2" />
              <span className="text-red-700">{error}</span>
            </div>
          )}
          
          <div className="mt-6 text-text-light text-sm">
            <div className="bg-primary/5 p-4 rounded-md">
              <p>
                <span className="font-medium text-primary">Tip:</span> You can find your tracking number in the confirmation email or SMS sent when your package was picked up.
              </p>
            </div>
          </div>
        </div>
        
        {/* Loading State */}
        {isTracking && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin-slow">
              <svg className="w-12 h-12 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <p className="mt-4 text-primary font-medium">Searching for your package...</p>
          </div>
        )}
        
        {/* Tracking Results */}
        {trackingResult && (
          <div className="space-y-6">
            {/* Status Header */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-primary text-white p-6">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-4">
                  <div className="mb-4 lg:mb-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-xl font-semibold">Tracking: {trackingResult.id}</h2>
                      <button
                        onClick={copyTrackingNumber}
                        className="text-white/80 hover:text-white"
                      >
                        <Copy size={16} />
                      </button>
                    </div>
                    <p className="text-gray-200">
                      {trackingResult.sender.address.split(',')[0]} → {trackingResult.receiver.address.split(',')[0]}
                    </p>
                    <p className="text-sm text-gray-300">
                      Service: {trackingResult.service_type}
                    </p>
                  </div>
                  
                  <div className="flex flex-col lg:items-end gap-2">
                    <div className="bg-white/10 px-4 py-2 rounded-full">
                      <span className="font-medium">
                        {trackingResult.status === 'delivered' && trackingResult.actual_delivery
                          ? `Delivered: ${new Date(trackingResult.actual_delivery).toLocaleString()}`
                          : `Est. Delivery: ${new Date(trackingResult.estimated_delivery).toLocaleString()}`
                        }
                      </span>
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={shareTracking}
                        className="text-white/80 hover:text-white p-2"
                        title="Share tracking link"
                      >
                        <Share2 size={16} />
                      </button>
                      <button
                        onClick={downloadReport}
                        className="text-white/80 hover:text-white p-2"
                        title="Download report"
                      >
                        <Download size={16} />
                      </button>
                      <label className="flex items-center text-white/80 hover:text-white cursor-pointer">
                        <input
                          type="checkbox"
                          checked={autoRefresh}
                          onChange={(e) => setAutoRefresh(e.target.checked)}
                          className="mr-1"
                        />
                        <span className="text-sm">Auto-refresh</span>
                      </label>
                    </div>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full bg-white/20 rounded-full h-3 mb-2">
                  <div 
                    className={`h-3 rounded-full transition-all duration-700 ${getStatusColor(trackingResult.status)}`}
                    style={{ width: `${getStatusPercentage(trackingResult.status)}%` }}
                  ></div>
                </div>
                
                {/* Status Labels */}
                <div className="flex justify-between text-xs text-gray-200">
                  <div className={trackingResult.status === 'ordered' ? 'text-gold font-medium' : ''}>Ordered</div>
                  <div className={trackingResult.status === 'picked' ? 'text-gold font-medium' : ''}>Picked Up</div>
                  <div className={trackingResult.status === 'in_transit' ? 'text-gold font-medium' : ''}>In Transit</div>
                  <div className={trackingResult.status === 'out_for_delivery' ? 'text-gold font-medium' : ''}>Out for Delivery</div>
                  <div className={trackingResult.status === 'delivered' ? 'text-gold font-medium' : ''}>Delivered</div>
                </div>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Timeline - Left Column */}
              <div className="lg:col-span-2 space-y-6">
                {/* Timeline */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold mb-6">Shipment Timeline</h3>
                  <div className="space-y-6">
                    {trackingResult.timeline.map((event, index) => (
                      <div key={event.id} className="flex">
                        <div className="mr-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            event.completed ? 'bg-success text-white' : 'bg-gray-200'
                          }`}>
                            {event.completed ? (
                              <CheckCircle size={20} />
                            ) : (
                              <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                            )}
                          </div>
                          {index < trackingResult.timeline.length - 1 && (
                            <div className={`w-0.5 h-12 ml-5 ${
                              event.completed && trackingResult.timeline[index + 1].completed
                                ? 'bg-success'
                                : 'bg-gray-200'
                            }`}></div>
                          )}
                        </div>
                        
                        <div className="flex-1 pb-6">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-medium text-primary">{event.step}</h4>
                            <span className="text-sm text-gray-500">
                              {new Date(event.time).toLocaleString()}
                            </span>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex items-start">
                              <MapPin size={16} className="text-gray-400 mr-2 mt-0.5" />
                              <span className="text-text-light">{event.location}</span>
                            </div>
                            
                            {event.description && (
                              <div className="flex items-start">
                                <Info size={16} className="text-gray-400 mr-2 mt-0.5" />
                                <span className="text-text-light">{event.description}</span>
                              </div>
                            )}
                            
                            {event.agent && (
                              <div className="flex items-start">
                                <User size={16} className="text-gray-400 mr-2 mt-0.5" />
                                <span className="text-text-light">Agent: {event.agent}</span>
                              </div>
                            )}
                            
                            {event.signature && (
                              <div className="flex items-start">
                                <FileText size={16} className="text-gray-400 mr-2 mt-0.5" />
                                <span className="text-text-light">Signed by: {event.signature}</span>
                              </div>
                            )}
                            
                            {event.proof_image && (
                              <div className="flex items-start">
                                <Camera size={16} className="text-gray-400 mr-2 mt-0.5" />
                                <button className="text-primary hover:underline">
                                  View proof photo
                                </button>
                              </div>
                            )}
                            
                            {event.notes && (
                              <div className="bg-gray-50 p-3 rounded-md">
                                <p className="text-sm text-gray-600">{event.notes}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Package Details */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold mb-4">Package Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-gray-500">Description:</span>
                      <p className="font-medium">{trackingResult.package_details.description}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Weight:</span>
                      <p className="font-medium">{trackingResult.package_details.weight} kg</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Declared Value:</span>
                      <p className="font-medium">Rs. {trackingResult.package_details.value.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Special Handling:</span>
                      <p className="font-medium">
                        {trackingResult.package_details.special_handling.length > 0
                          ? trackingResult.package_details.special_handling.join(', ')
                          : 'None'
                        }
                      </p>
                    </div>
                  </div>
                </div>

                {/* Additional Services */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold mb-4">Additional Services</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex items-center">
                      <Shield size={16} className={`mr-2 ${trackingResult.additional_services.insurance ? 'text-success' : 'text-gray-400'}`} />
                      <span className={trackingResult.additional_services.insurance ? 'text-success' : 'text-gray-500'}>
                        Insurance
                      </span>
                    </div>
                    <div className="flex items-center">
                      <CreditCard size={16} className={`mr-2 ${trackingResult.additional_services.cod ? 'text-success' : 'text-gray-400'}`} />
                      <span className={trackingResult.additional_services.cod ? 'text-success' : 'text-gray-500'}>
                        COD
                      </span>
                    </div>
                    <div className="flex items-center">
                      <FileText size={16} className={`mr-2 ${trackingResult.additional_services.signature_required ? 'text-success' : 'text-gray-400'}`} />
                      <span className={trackingResult.additional_services.signature_required ? 'text-success' : 'text-gray-500'}>
                        Signature
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Camera size={16} className={`mr-2 ${trackingResult.additional_services.photo_proof ? 'text-success' : 'text-gray-400'}`} />
                      <span className={trackingResult.additional_services.photo_proof ? 'text-success' : 'text-gray-500'}>
                        Photo Proof
                      </span>
                    </div>
                  </div>
                </div>

                {/* Customer Feedback (if delivered) */}
                {trackingResult.status === 'delivered' && trackingResult.rating && (
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold mb-4">Customer Feedback</h3>
                    <div className="flex items-center mb-3">
                      <div className="flex mr-3">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={18}
                            fill={i < trackingResult.rating! ? "#FFB000" : "none"}
                            stroke={i < trackingResult.rating! ? "#FFB000" : "#CBD5E1"}
                          />
                        ))}
                      </div>
                      <span className="font-medium">{trackingResult.rating}/5</span>
                    </div>
                    {trackingResult.feedback && (
                      <p className="text-gray-600 italic">"{trackingResult.feedback}"</p>
                    )}
                  </div>
                )}
              </div>
              
              {/* Right Sidebar */}
              <div className="space-y-6">
                {/* Shipment Summary */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold mb-4">Shipment Summary</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm text-gray-500 mb-1">From</h4>
                      <p className="font-medium">{trackingResult.sender.name}</p>
                      <p className="text-sm text-gray-600">{trackingResult.sender.address}</p>
                      <p className="text-sm text-gray-600">{trackingResult.sender.phone}</p>
                    </div>
                    
                    <div className="flex justify-center my-3">
                      <ArrowRight size={20} className="text-gray-400" />
                    </div>
                    
                    <div>
                      <h4 className="text-sm text-gray-500 mb-1">To</h4>
                      <p className="font-medium">{trackingResult.receiver.name}</p>
                      <p className="text-sm text-gray-600">{trackingResult.receiver.address}</p>
                      <p className="text-sm text-gray-600">{trackingResult.receiver.phone}</p>
                    </div>
                  </div>
                </div>

                {/* Current Location */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold mb-4">Current Location</h3>
                  <div className="text-center">
                    <div className="bg-gray-100 rounded-lg h-32 flex items-center justify-center mb-4">
                      <div className="text-center">
                        <MapPin size={30} className="text-accent mx-auto mb-2" />
                        <p className="font-medium text-primary">{trackingResult.current_location}</p>
                      </div>
                    </div>
                    <button className="btn btn-outline w-full text-sm">
                      <Navigation size={14} className="mr-2" />
                      View on Map
                    </button>
                  </div>
                </div>

                {/* Delivery Agent (if available) */}
                {trackingResult.delivery_agent && (
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold mb-4">Delivery Agent</h3>
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-3 flex items-center justify-center">
                        <User size={24} className="text-gray-500" />
                      </div>
                      <p className="font-medium text-primary">{trackingResult.delivery_agent.name}</p>
                      <p className="text-sm text-gray-600 mb-2">{trackingResult.delivery_agent.vehicle}</p>
                      <button
                        onClick={() => window.open(`tel:${trackingResult.delivery_agent!.phone}`)}
                        className="btn btn-primary w-full text-sm"
                      >
                        <Phone size={14} className="mr-2" />
                        Call Agent
                      </button>
                    </div>
                  </div>
                )}

                {/* Billing Information */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold mb-4">Billing Information</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Total Amount:</span>
                      <span className="font-semibold">Rs. {trackingResult.pricing.total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Payment Status:</span>
                      <span className={`font-medium ${
                        trackingResult.pricing.payment_status === 'paid' ? 'text-success' :
                        trackingResult.pricing.payment_status === 'pending' ? 'text-warning' :
                        'text-error'
                      }`}>
                        {trackingResult.pricing.payment_status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>Booking Number:</span>
                      <span>{trackingResult.booking_number}</span>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <Link to="/book" className="btn btn-primary w-full text-sm">
                      <Package size={14} className="mr-2" />
                      Book Another Delivery
                    </Link>
                    <button
                      onClick={() => window.open('tel:+94111234567')}
                      className="btn btn-outline w-full text-sm"
                    >
                      <Phone size={14} className="mr-2" />
                      Contact Support
                    </button>
                    <button className="btn btn-outline w-full text-sm">
                      <Mail size={14} className="mr-2" />
                      Email Updates
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Help Section */}
        {!trackingResult && !isTracking && (
          <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
            <h2 className="text-xl font-semibold mb-4">Need Help?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <Phone size={32} className="text-primary mx-auto mb-3" />
                <h3 className="font-medium mb-2">Call Us</h3>
                <p className="text-sm text-gray-600 mb-3">Speak with our customer service team</p>
                <button
                  onClick={() => window.open('tel:+94111234567')}
                  className="btn btn-outline text-sm"
                >
                  +94 11 123 4567
                </button>
              </div>
              
              <div className="text-center">
                <Mail size={32} className="text-primary mx-auto mb-3" />
                <h3 className="font-medium mb-2">Email Support</h3>
                <p className="text-sm text-gray-600 mb-3">Send us your tracking inquiry</p>
                <button
                  onClick={() => window.open('mailto:support@quicklanka.lk')}
                  className="btn btn-outline text-sm"
                >
                  Email Us
                </button>
              </div>
              
              <div className="text-center">
                <Package size={32} className="text-primary mx-auto mb-3" />
                <h3 className="font-medium mb-2">Book New Delivery</h3>
                <p className="text-sm text-gray-600 mb-3">Schedule a new pickup</p>
                <Link to="/book" className="btn btn-primary text-sm">
                  Book Now
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Click outside to close recent searches */}
      {showRecentSearches && (
        <div
          className="fixed inset-0 z-5"
          onClick={() => setShowRecentSearches(false)}
        />
      )}
    </div>
  );
};

export default TrackingPage;
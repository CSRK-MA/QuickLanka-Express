import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Package, 
  User, 
  MapPin, 
  Calendar, 
  CreditCard, 
  CheckCircle, 
  ArrowRight, 
  ArrowLeft,
  Plus,
  Minus,
  Calculator,
  Phone,
  Mail,
  Building,
  Truck,
  Clock,
  Shield,
  Camera,
  FileText,
  AlertCircle,
  Info,
  Star,
  Zap,
  Globe,
  Weight,
  Ruler,
  DollarSign,
  Copy,
  ExternalLink,
  Save,
  Trash2,
  Edit,
  Search,
  Filter,
  Download,
  Share2
} from 'lucide-react';
import toast from 'react-hot-toast';

// Types for database integration
interface Address {
  id?: string;
  name: string;
  company?: string;
  phone: string;
  email?: string;
  street: string;
  city: string;
  district: string;
  postal_code: string;
  landmark?: string;
  address_type: 'business' | 'personal';
  is_default?: boolean;
  created_at?: string;
}

interface Package {
  id?: string;
  description: string;
  category: string;
  weight: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  value: number;
  special_handling: string[];
  instructions?: string;
}

interface BookingData {
  id?: string;
  booking_number?: string;
  sender: Address;
  receiver: Address;
  packages: Package[];
  service_type: string;
  pickup_date: string;
  pickup_time_slot: string;
  delivery_speed: 'standard' | 'express';
  additional_services: {
    insurance: boolean;
    insurance_value?: number;
    cod: boolean;
    cod_amount?: number;
    signature_required: boolean;
    photo_proof: boolean;
    weekend_delivery: boolean;
    return_service: boolean;
    notifications: {
      sms: boolean;
      email: boolean;
    };
  };
  pricing: {
    base_price: number;
    weight_charge: number;
    distance_charge: number;
    service_charges: number;
    additional_charges: number;
    discount: number;
    tax: number;
    total: number;
    breakdown: Array<{
      label: string;
      amount: number;
      description?: string;
    }>;
  };
  payment: {
    method: 'card' | 'bank_transfer' | 'cash_on_pickup';
    billing_address?: Address;
    promo_code?: string;
    payment_status: 'pending' | 'completed' | 'failed';
  };
  status: 'draft' | 'confirmed' | 'picked_up' | 'in_transit' | 'delivered' | 'cancelled';
  tracking_number?: string;
  created_at?: string;
  updated_at?: string;
}

interface SavedAddress {
  id: string;
  label: string;
  address: Address;
  usage_count: number;
  last_used: string;
}

interface BookingHistory {
  id: string;
  booking_number: string;
  date: string;
  from: string;
  to: string;
  status: string;
  total: number;
  tracking_number?: string;
}

const BookingPage: React.FC = () => {
  useEffect(() => {
    document.title = 'Book a Delivery - QuickLanka Express';
    loadUserData();
  }, []);

  // State management
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [showAddressBook, setShowAddressBook] = useState(false);
  const [showBookingHistory, setShowBookingHistory] = useState(false);
  const [addressBookType, setAddressBookType] = useState<'sender' | 'receiver'>('sender');
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [bookingHistory, setBookingHistory] = useState<BookingHistory[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Main booking data
  const [bookingData, setBookingData] = useState<BookingData>({
    sender: {
      name: '',
      company: '',
      phone: '',
      email: '',
      street: '',
      city: '',
      district: '',
      postal_code: '',
      landmark: '',
      address_type: 'personal'
    },
    receiver: {
      name: '',
      company: '',
      phone: '',
      email: '',
      street: '',
      city: '',
      district: '',
      postal_code: '',
      landmark: '',
      address_type: 'personal'
    },
    packages: [{
      description: '',
      category: 'general',
      weight: 0,
      dimensions: { length: 0, width: 0, height: 0 },
      value: 0,
      special_handling: [],
      instructions: ''
    }],
    service_type: 'overnight',
    pickup_date: '',
    pickup_time_slot: 'morning',
    delivery_speed: 'standard',
    additional_services: {
      insurance: false,
      cod: false,
      signature_required: true,
      photo_proof: false,
      weekend_delivery: false,
      return_service: false,
      notifications: {
        sms: true,
        email: true
      }
    },
    pricing: {
      base_price: 0,
      weight_charge: 0,
      distance_charge: 0,
      service_charges: 0,
      additional_charges: 0,
      discount: 0,
      tax: 0,
      total: 0,
      breakdown: []
    },
    payment: {
      method: 'card',
      payment_status: 'pending'
    },
    status: 'draft'
  });

  // Reference data
  const districts = [
    'Colombo', 'Gampaha', 'Kalutara', 'Kandy', 'Matale', 'Nuwara Eliya',
    'Galle', 'Matara', 'Hambantota', 'Jaffna', 'Kilinochchi', 'Mannar',
    'Vavuniya', 'Mullaitivu', 'Batticaloa', 'Ampara', 'Trincomalee',
    'Kurunegala', 'Puttalam', 'Anuradhapura', 'Polonnaruwa',
    'Badulla', 'Moneragala', 'Ratnapura', 'Kegalle'
  ];

  const serviceTypes = [
    { id: 'same_day', name: 'Same Day Delivery', price: 800, time: '6-8 hours', zones: ['Colombo', 'Gampaha', 'Kalutara'] },
    { id: 'overnight', name: 'Overnight Express', price: 450, time: 'Next business day', zones: 'all' },
    { id: 'standard', name: 'Standard Delivery', price: 300, time: '2-3 business days', zones: 'all' },
    { id: 'documents', name: 'Document Delivery', price: 250, time: '4-24 hours', zones: 'all' },
    { id: 'fragile', name: 'Fragile & Special Care', price: 600, time: '1-2 business days', zones: 'major_cities' },
    { id: 'international', name: 'International Shipping', price: 2500, time: '3-10 business days', zones: 'international' }
  ];

  const packageCategories = [
    'General Items', 'Electronics', 'Clothing & Accessories', 'Books & Media',
    'Food & Beverages', 'Medical Supplies', 'Documents', 'Fragile Items',
    'Automotive Parts', 'Home & Garden', 'Sports Equipment', 'Jewelry & Valuables'
  ];

  const timeSlots = [
    { id: 'morning', label: 'Morning (9:00 AM - 12:00 PM)', available: true },
    { id: 'afternoon', label: 'Afternoon (1:00 PM - 5:00 PM)', available: true },
    { id: 'evening', label: 'Evening (5:00 PM - 8:00 PM)', available: true },
    { id: 'flexible', label: 'Flexible (Any time)', available: true }
  ];

  const specialHandlingOptions = [
    { id: 'fragile', label: 'Fragile', fee: 200 },
    { id: 'liquid', label: 'Liquid/Gel', fee: 150 },
    { id: 'temperature_sensitive', label: 'Temperature Sensitive', fee: 300 },
    { id: 'hazardous', label: 'Hazardous Materials', fee: 500 },
    { id: 'high_value', label: 'High Value (>Rs. 100,000)', fee: 250 },
    { id: 'oversized', label: 'Oversized Item', fee: 400 }
  ];

  // Load user data from localStorage/database
  const loadUserData = async () => {
    try {
      // Load saved addresses
      const addresses = localStorage.getItem('quicklanka_addresses');
      if (addresses) {
        setSavedAddresses(JSON.parse(addresses));
      }

      // Load booking history
      const history = localStorage.getItem('quicklanka_booking_history');
      if (history) {
        setBookingHistory(JSON.parse(history));
      }

      // Load draft booking if exists
      const draft = localStorage.getItem('quicklanka_booking_draft');
      if (draft) {
        const draftData = JSON.parse(draft);
        setBookingData(draftData);
        toast.success('Draft booking restored');
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  // Save draft to localStorage
  const saveDraft = () => {
    try {
      localStorage.setItem('quicklanka_booking_draft', JSON.stringify(bookingData));
      toast.success('Draft saved');
    } catch (error) {
      toast.error('Failed to save draft');
    }
  };

  // Validation functions
  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1: // Sender details
        if (!bookingData.sender.name.trim()) newErrors.sender_name = 'Name is required';
        if (!bookingData.sender.phone.trim()) newErrors.sender_phone = 'Phone is required';
        if (!bookingData.sender.street.trim()) newErrors.sender_street = 'Street address is required';
        if (!bookingData.sender.city.trim()) newErrors.sender_city = 'City is required';
        if (!bookingData.sender.district) newErrors.sender_district = 'District is required';
        break;

      case 2: // Receiver details
        if (!bookingData.receiver.name.trim()) newErrors.receiver_name = 'Name is required';
        if (!bookingData.receiver.phone.trim()) newErrors.receiver_phone = 'Phone is required';
        if (!bookingData.receiver.street.trim()) newErrors.receiver_street = 'Street address is required';
        if (!bookingData.receiver.city.trim()) newErrors.receiver_city = 'City is required';
        if (!bookingData.receiver.district) newErrors.receiver_district = 'District is required';
        break;

      case 3: // Package details
        bookingData.packages.forEach((pkg, index) => {
          if (!pkg.description.trim()) newErrors[`package_${index}_description`] = 'Description is required';
          if (pkg.weight <= 0) newErrors[`package_${index}_weight`] = 'Weight must be greater than 0';
          if (pkg.value <= 0) newErrors[`package_${index}_value`] = 'Value must be greater than 0';
        });
        break;

      case 4: // Service options
        if (!bookingData.pickup_date) newErrors.pickup_date = 'Pickup date is required';
        break;

      case 5: // Additional services
        if (bookingData.additional_services.insurance && !bookingData.additional_services.insurance_value) {
          newErrors.insurance_value = 'Insurance value is required';
        }
        if (bookingData.additional_services.cod && !bookingData.additional_services.cod_amount) {
          newErrors.cod_amount = 'COD amount is required';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Calculate pricing
  const calculatePricing = async () => {
    setIsCalculating(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const service = serviceTypes.find(s => s.id === bookingData.service_type);
      if (!service) return;

      const totalWeight = bookingData.packages.reduce((sum, pkg) => sum + pkg.weight, 0);
      const totalValue = bookingData.packages.reduce((sum, pkg) => sum + pkg.value, 0);

      // Base calculations
      const base_price = service.price;
      const weight_charge = Math.max(0, (totalWeight - 1)) * 85; // First kg included
      const distance_charge = bookingData.sender.district !== bookingData.receiver.district ? 100 : 0;

      // Service charges
      let service_charges = 0;
      if (bookingData.delivery_speed === 'express') service_charges += base_price * 0.5;

      // Additional charges
      let additional_charges = 0;
      if (bookingData.additional_services.insurance) {
        additional_charges += Math.max(bookingData.additional_services.insurance_value! * 0.01, 50);
      }
      if (bookingData.additional_services.cod) {
        additional_charges += Math.max(bookingData.additional_services.cod_amount! * 0.025, 100);
      }
      if (bookingData.additional_services.photo_proof) additional_charges += 50;
      if (bookingData.additional_services.weekend_delivery) additional_charges += base_price * 0.25;

      // Special handling charges
      bookingData.packages.forEach(pkg => {
        pkg.special_handling.forEach(handling => {
          const option = specialHandlingOptions.find(opt => opt.id === handling);
          if (option) additional_charges += option.fee;
        });
      });

      const subtotal = base_price + weight_charge + distance_charge + service_charges + additional_charges;
      const discount = 0; // Apply promo codes here
      const tax = (subtotal - discount) * 0.15; // 15% VAT
      const total = subtotal - discount + tax;

      const breakdown = [
        { label: 'Base Price', amount: base_price, description: service.name },
        { label: 'Weight Charge', amount: weight_charge, description: `${totalWeight}kg (first kg included)` },
        ...(distance_charge > 0 ? [{ label: 'Distance Charge', amount: distance_charge, description: 'Inter-district delivery' }] : []),
        ...(service_charges > 0 ? [{ label: 'Express Service', amount: service_charges, description: '50% surcharge for express delivery' }] : []),
        ...(additional_charges > 0 ? [{ label: 'Additional Services', amount: additional_charges, description: 'Insurance, COD, special handling' }] : []),
        ...(discount > 0 ? [{ label: 'Discount', amount: -discount, description: 'Promo code applied' }] : []),
        { label: 'VAT (15%)', amount: tax, description: 'Government tax' }
      ];

      setBookingData(prev => ({
        ...prev,
        pricing: {
          base_price,
          weight_charge,
          distance_charge,
          service_charges,
          additional_charges,
          discount,
          tax,
          total,
          breakdown
        }
      }));

    } catch (error) {
      toast.error('Failed to calculate pricing');
    } finally {
      setIsCalculating(false);
    }
  };

  // Submit booking
  const submitBooking = async () => {
    if (!validateStep(6)) return;

    setIsLoading(true);
    
    try {
      // Generate booking number and tracking number
      const bookingNumber = `QL${Date.now()}`;
      const trackingNumber = `QLE${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

      const finalBookingData = {
        ...bookingData,
        id: bookingNumber,
        booking_number: bookingNumber,
        tracking_number: trackingNumber,
        status: 'confirmed' as const,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Save to booking history
      const newHistoryItem: BookingHistory = {
        id: bookingNumber,
        booking_number: bookingNumber,
        date: new Date().toISOString(),
        from: `${finalBookingData.sender.city}, ${finalBookingData.sender.district}`,
        to: `${finalBookingData.receiver.city}, ${finalBookingData.receiver.district}`,
        status: 'confirmed',
        total: finalBookingData.pricing.total,
        tracking_number: trackingNumber
      };

      const updatedHistory = [newHistoryItem, ...bookingHistory];
      setBookingHistory(updatedHistory);
      localStorage.setItem('quicklanka_booking_history', JSON.stringify(updatedHistory));

      // Save addresses to address book
      const newAddresses = [...savedAddresses];
      
      // Add sender address if not exists
      const senderExists = newAddresses.find(addr => 
        addr.address.phone === finalBookingData.sender.phone
      );
      if (!senderExists) {
        newAddresses.push({
          id: `addr_${Date.now()}_sender`,
          label: `${finalBookingData.sender.name} (${finalBookingData.sender.city})`,
          address: finalBookingData.sender,
          usage_count: 1,
          last_used: new Date().toISOString()
        });
      }

      // Add receiver address if not exists
      const receiverExists = newAddresses.find(addr => 
        addr.address.phone === finalBookingData.receiver.phone
      );
      if (!receiverExists) {
        newAddresses.push({
          id: `addr_${Date.now()}_receiver`,
          label: `${finalBookingData.receiver.name} (${finalBookingData.receiver.city})`,
          address: finalBookingData.receiver,
          usage_count: 1,
          last_used: new Date().toISOString()
        });
      }

      setSavedAddresses(newAddresses);
      localStorage.setItem('quicklanka_addresses', JSON.stringify(newAddresses));

      // Clear draft
      localStorage.removeItem('quicklanka_booking_draft');

      // Show success and redirect
      toast.success('Booking confirmed successfully!');
      
      // Redirect to tracking page with tracking number
      setTimeout(() => {
        window.location.href = `/track?id=${trackingNumber}`;
      }, 2000);

    } catch (error) {
      toast.error('Failed to submit booking');
    } finally {
      setIsLoading(false);
    }
  };

  // Navigation functions
  const nextStep = () => {
    if (validateStep(currentStep)) {
      if (currentStep === 3 || currentStep === 5) {
        calculatePricing();
      }
      setCurrentStep(prev => Math.min(prev + 1, 6));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  // Package management
  const addPackage = () => {
    setBookingData(prev => ({
      ...prev,
      packages: [...prev.packages, {
        description: '',
        category: 'general',
        weight: 0,
        dimensions: { length: 0, width: 0, height: 0 },
        value: 0,
        special_handling: [],
        instructions: ''
      }]
    }));
  };

  const removePackage = (index: number) => {
    if (bookingData.packages.length > 1) {
      setBookingData(prev => ({
        ...prev,
        packages: prev.packages.filter((_, i) => i !== index)
      }));
    }
  };

  const updatePackage = (index: number, field: string, value: any) => {
    setBookingData(prev => ({
      ...prev,
      packages: prev.packages.map((pkg, i) => 
        i === index ? { ...pkg, [field]: value } : pkg
      )
    }));
  };

  // Address management
  const selectAddress = (address: SavedAddress) => {
    if (addressBookType === 'sender') {
      setBookingData(prev => ({ ...prev, sender: address.address }));
    } else {
      setBookingData(prev => ({ ...prev, receiver: address.address }));
    }
    setShowAddressBook(false);
    toast.success('Address selected');
  };

  const deleteAddress = (addressId: string) => {
    const updatedAddresses = savedAddresses.filter(addr => addr.id !== addressId);
    setSavedAddresses(updatedAddresses);
    localStorage.setItem('quicklanka_addresses', JSON.stringify(updatedAddresses));
    toast.success('Address deleted');
  };

  // Render step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-primary">Sender Details</h2>
              <button
                onClick={() => {
                  setAddressBookType('sender');
                  setShowAddressBook(true);
                }}
                className="btn btn-outline text-sm"
              >
                <Search size={16} className="mr-2" />
                Address Book
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Address Type</label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="sender_type"
                      value="personal"
                      checked={bookingData.sender.address_type === 'personal'}
                      onChange={(e) => setBookingData(prev => ({
                        ...prev,
                        sender: { ...prev.sender, address_type: e.target.value as 'personal' | 'business' }
                      }))}
                      className="mr-2"
                    />
                    <User size={16} className="mr-1" />
                    Personal
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="sender_type"
                      value="business"
                      checked={bookingData.sender.address_type === 'business'}
                      onChange={(e) => setBookingData(prev => ({
                        ...prev,
                        sender: { ...prev.sender, address_type: e.target.value as 'personal' | 'business' }
                      }))}
                      className="mr-2"
                    />
                    <Building size={16} className="mr-1" />
                    Business
                  </label>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  {bookingData.sender.address_type === 'business' ? 'Contact Person' : 'Full Name'} *
                </label>
                <input
                  type="text"
                  className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-primary focus:border-primary ${
                    errors.sender_name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  value={bookingData.sender.name}
                  onChange={(e) => setBookingData(prev => ({
                    ...prev,
                    sender: { ...prev.sender, name: e.target.value }
                  }))}
                  placeholder="Enter full name"
                />
                {errors.sender_name && <p className="text-red-500 text-sm mt-1">{errors.sender_name}</p>}
              </div>

              {bookingData.sender.address_type === 'business' && (
                <div>
                  <label className="block text-sm font-medium mb-2">Company Name</label>
                  <input
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                    value={bookingData.sender.company || ''}
                    onChange={(e) => setBookingData(prev => ({
                      ...prev,
                      sender: { ...prev.sender, company: e.target.value }
                    }))}
                    placeholder="Enter company name"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-2">Phone Number *</label>
                <input
                  type="tel"
                  className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-primary focus:border-primary ${
                    errors.sender_phone ? 'border-red-500' : 'border-gray-300'
                  }`}
                  value={bookingData.sender.phone}
                  onChange={(e) => setBookingData(prev => ({
                    ...prev,
                    sender: { ...prev.sender, phone: e.target.value }
                  }))}
                  placeholder="+94 77 123 4567"
                />
                {errors.sender_phone && <p className="text-red-500 text-sm mt-1">{errors.sender_phone}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Email Address</label>
                <input
                  type="email"
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                  value={bookingData.sender.email || ''}
                  onChange={(e) => setBookingData(prev => ({
                    ...prev,
                    sender: { ...prev.sender, email: e.target.value }
                  }))}
                  placeholder="email@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Street Address *</label>
              <input
                type="text"
                className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-primary focus:border-primary ${
                  errors.sender_street ? 'border-red-500' : 'border-gray-300'
                }`}
                value={bookingData.sender.street}
                onChange={(e) => setBookingData(prev => ({
                  ...prev,
                  sender: { ...prev.sender, street: e.target.value }
                }))}
                placeholder="House/Building number, Street name"
              />
              {errors.sender_street && <p className="text-red-500 text-sm mt-1">{errors.sender_street}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">City *</label>
                <input
                  type="text"
                  className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-primary focus:border-primary ${
                    errors.sender_city ? 'border-red-500' : 'border-gray-300'
                  }`}
                  value={bookingData.sender.city}
                  onChange={(e) => setBookingData(prev => ({
                    ...prev,
                    sender: { ...prev.sender, city: e.target.value }
                  }))}
                  placeholder="Enter city"
                />
                {errors.sender_city && <p className="text-red-500 text-sm mt-1">{errors.sender_city}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">District *</label>
                <select
                  className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-primary focus:border-primary ${
                    errors.sender_district ? 'border-red-500' : 'border-gray-300'
                  }`}
                  value={bookingData.sender.district}
                  onChange={(e) => setBookingData(prev => ({
                    ...prev,
                    sender: { ...prev.sender, district: e.target.value }
                  }))}
                >
                  <option value="">Select district</option>
                  {districts.map(district => (
                    <option key={district} value={district}>{district}</option>
                  ))}
                </select>
                {errors.sender_district && <p className="text-red-500 text-sm mt-1">{errors.sender_district}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Postal Code</label>
                <input
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                  value={bookingData.sender.postal_code}
                  onChange={(e) => setBookingData(prev => ({
                    ...prev,
                    sender: { ...prev.sender, postal_code: e.target.value }
                  }))}
                  placeholder="10250"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Landmark (Optional)</label>
              <input
                type="text"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                value={bookingData.sender.landmark || ''}
                onChange={(e) => setBookingData(prev => ({
                  ...prev,
                  sender: { ...prev.sender, landmark: e.target.value }
                }))}
                placeholder="Near landmark or special instructions"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-primary">Receiver Details</h2>
              <button
                onClick={() => {
                  setAddressBookType('receiver');
                  setShowAddressBook(true);
                }}
                className="btn btn-outline text-sm"
              >
                <Search size={16} className="mr-2" />
                Address Book
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Address Type</label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="receiver_type"
                      value="personal"
                      checked={bookingData.receiver.address_type === 'personal'}
                      onChange={(e) => setBookingData(prev => ({
                        ...prev,
                        receiver: { ...prev.receiver, address_type: e.target.value as 'personal' | 'business' }
                      }))}
                      className="mr-2"
                    />
                    <User size={16} className="mr-1" />
                    Personal
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="receiver_type"
                      value="business"
                      checked={bookingData.receiver.address_type === 'business'}
                      onChange={(e) => setBookingData(prev => ({
                        ...prev,
                        receiver: { ...prev.receiver, address_type: e.target.value as 'personal' | 'business' }
                      }))}
                      className="mr-2"
                    />
                    <Building size={16} className="mr-1" />
                    Business
                  </label>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  {bookingData.receiver.address_type === 'business' ? 'Contact Person' : 'Full Name'} *
                </label>
                <input
                  type="text"
                  className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-primary focus:border-primary ${
                    errors.receiver_name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  value={bookingData.receiver.name}
                  onChange={(e) => setBookingData(prev => ({
                    ...prev,
                    receiver: { ...prev.receiver, name: e.target.value }
                  }))}
                  placeholder="Enter full name"
                />
                {errors.receiver_name && <p className="text-red-500 text-sm mt-1">{errors.receiver_name}</p>}
              </div>

              {bookingData.receiver.address_type === 'business' && (
                <div>
                  <label className="block text-sm font-medium mb-2">Company Name</label>
                  <input
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                    value={bookingData.receiver.company || ''}
                    onChange={(e) => setBookingData(prev => ({
                      ...prev,
                      receiver: { ...prev.receiver, company: e.target.value }
                    }))}
                    placeholder="Enter company name"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-2">Phone Number *</label>
                <input
                  type="tel"
                  className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-primary focus:border-primary ${
                    errors.receiver_phone ? 'border-red-500' : 'border-gray-300'
                  }`}
                  value={bookingData.receiver.phone}
                  onChange={(e) => setBookingData(prev => ({
                    ...prev,
                    receiver: { ...prev.receiver, phone: e.target.value }
                  }))}
                  placeholder="+94 77 123 4567"
                />
                {errors.receiver_phone && <p className="text-red-500 text-sm mt-1">{errors.receiver_phone}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Email Address</label>
                <input
                  type="email"
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                  value={bookingData.receiver.email || ''}
                  onChange={(e) => setBookingData(prev => ({
                    ...prev,
                    receiver: { ...prev.receiver, email: e.target.value }
                  }))}
                  placeholder="email@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Street Address *</label>
              <input
                type="text"
                className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-primary focus:border-primary ${
                  errors.receiver_street ? 'border-red-500' : 'border-gray-300'
                }`}
                value={bookingData.receiver.street}
                onChange={(e) => setBookingData(prev => ({
                  ...prev,
                  receiver: { ...prev.receiver, street: e.target.value }
                }))}
                placeholder="House/Building number, Street name"
              />
              {errors.receiver_street && <p className="text-red-500 text-sm mt-1">{errors.receiver_street}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">City *</label>
                <input
                  type="text"
                  className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-primary focus:border-primary ${
                    errors.receiver_city ? 'border-red-500' : 'border-gray-300'
                  }`}
                  value={bookingData.receiver.city}
                  onChange={(e) => setBookingData(prev => ({
                    ...prev,
                    receiver: { ...prev.receiver, city: e.target.value }
                  }))}
                  placeholder="Enter city"
                />
                {errors.receiver_city && <p className="text-red-500 text-sm mt-1">{errors.receiver_city}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">District *</label>
                <select
                  className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-primary focus:border-primary ${
                    errors.receiver_district ? 'border-red-500' : 'border-gray-300'
                  }`}
                  value={bookingData.receiver.district}
                  onChange={(e) => setBookingData(prev => ({
                    ...prev,
                    receiver: { ...prev.receiver, district: e.target.value }
                  }))}
                >
                  <option value="">Select district</option>
                  {districts.map(district => (
                    <option key={district} value={district}>{district}</option>
                  ))}
                </select>
                {errors.receiver_district && <p className="text-red-500 text-sm mt-1">{errors.receiver_district}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Postal Code</label>
                <input
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                  value={bookingData.receiver.postal_code}
                  onChange={(e) => setBookingData(prev => ({
                    ...prev,
                    receiver: { ...prev.receiver, postal_code: e.target.value }
                  }))}
                  placeholder="10250"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Landmark (Optional)</label>
              <input
                type="text"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                value={bookingData.receiver.landmark || ''}
                onChange={(e) => setBookingData(prev => ({
                  ...prev,
                  receiver: { ...prev.receiver, landmark: e.target.value }
                }))}
                placeholder="Near landmark or special instructions"
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-primary">Package Information</h2>
              <button
                onClick={addPackage}
                className="btn btn-primary text-sm"
              >
                <Plus size={16} className="mr-2" />
                Add Package
              </button>
            </div>

            {bookingData.packages.map((pkg, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6 relative">
                {bookingData.packages.length > 1 && (
                  <button
                    onClick={() => removePackage(index)}
                    className="absolute top-4 right-4 text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={20} />
                  </button>
                )}

                <h3 className="text-lg font-semibold mb-4">Package {index + 1}</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Package Description *</label>
                    <input
                      type="text"
                      className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-primary focus:border-primary ${
                        errors[`package_${index}_description`] ? 'border-red-500' : 'border-gray-300'
                      }`}
                      value={pkg.description}
                      onChange={(e) => updatePackage(index, 'description', e.target.value)}
                      placeholder="Describe the contents"
                    />
                    {errors[`package_${index}_description`] && (
                      <p className="text-red-500 text-sm mt-1">{errors[`package_${index}_description`]}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Category</label>
                    <select
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                      value={pkg.category}
                      onChange={(e) => updatePackage(index, 'category', e.target.value)}
                    >
                      {packageCategories.map(category => (
                        <option key={category} value={category.toLowerCase().replace(/\s+/g, '_')}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Weight (kg) *</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0.1"
                      className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-primary focus:border-primary ${
                        errors[`package_${index}_weight`] ? 'border-red-500' : 'border-gray-300'
                      }`}
                      value={pkg.weight || ''}
                      onChange={(e) => updatePackage(index, 'weight', parseFloat(e.target.value) || 0)}
                      placeholder="0.5"
                    />
                    {errors[`package_${index}_weight`] && (
                      <p className="text-red-500 text-sm mt-1">{errors[`package_${index}_weight`]}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Estimated Value (Rs.) *</label>
                    <input
                      type="number"
                      min="1"
                      className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-primary focus:border-primary ${
                        errors[`package_${index}_value`] ? 'border-red-500' : 'border-gray-300'
                      }`}
                      value={pkg.value || ''}
                      onChange={(e) => updatePackage(index, 'value', parseFloat(e.target.value) || 0)}
                      placeholder="5000"
                    />
                    {errors[`package_${index}_value`] && (
                      <p className="text-red-500 text-sm mt-1">{errors[`package_${index}_value`]}</p>
                    )}
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium mb-2">Dimensions (cm)</label>
                  <div className="grid grid-cols-3 gap-4">
                    <input
                      type="number"
                      min="1"
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                      value={pkg.dimensions.length || ''}
                      onChange={(e) => updatePackage(index, 'dimensions', {
                        ...pkg.dimensions,
                        length: parseFloat(e.target.value) || 0
                      })}
                      placeholder="Length"
                    />
                    <input
                      type="number"
                      min="1"
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                      value={pkg.dimensions.width || ''}
                      onChange={(e) => updatePackage(index, 'dimensions', {
                        ...pkg.dimensions,
                        width: parseFloat(e.target.value) || 0
                      })}
                      placeholder="Width"
                    />
                    <input
                      type="number"
                      min="1"
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                      value={pkg.dimensions.height || ''}
                      onChange={(e) => updatePackage(index, 'dimensions', {
                        ...pkg.dimensions,
                        height: parseFloat(e.target.value) || 0
                      })}
                      placeholder="Height"
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium mb-2">Special Handling</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {specialHandlingOptions.map(option => (
                      <label key={option.id} className="flex items-center">
                        <input
                          type="checkbox"
                          className="mr-2"
                          checked={pkg.special_handling.includes(option.id)}
                          onChange={(e) => {
                            const newHandling = e.target.checked
                              ? [...pkg.special_handling, option.id]
                              : pkg.special_handling.filter(h => h !== option.id);
                            updatePackage(index, 'special_handling', newHandling);
                          }}
                        />
                        <span className="text-sm">
                          {option.label} (+Rs. {option.fee})
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium mb-2">Special Instructions</label>
                  <textarea
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                    rows={3}
                    value={pkg.instructions || ''}
                    onChange={(e) => updatePackage(index, 'instructions', e.target.value)}
                    placeholder="Any special handling instructions..."
                  />
                </div>
              </div>
            ))}
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-primary">Service Options</h2>

            <div>
              <label className="block text-sm font-medium mb-4">Select Service Type</label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {serviceTypes.map(service => {
                  const isAvailable = service.zones === 'all' || 
                    (Array.isArray(service.zones) && service.zones.includes(bookingData.receiver.district)) ||
                    (service.zones === 'major_cities' && ['Colombo', 'Gampaha', 'Kalutara', 'Kandy', 'Galle'].includes(bookingData.receiver.district));

                  return (
                    <div
                      key={service.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${
                        bookingData.service_type === service.id
                          ? 'border-primary bg-primary/5'
                          : isAvailable
                          ? 'border-gray-300 hover:border-primary'
                          : 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-50'
                      }`}
                      onClick={() => {
                        if (isAvailable) {
                          setBookingData(prev => ({ ...prev, service_type: service.id }));
                        }
                      }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">{service.name}</h3>
                        <div className="text-right">
                          <div className="text-lg font-bold text-primary">Rs. {service.price}</div>
                          <div className="text-xs text-gray-500">starting from</div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{service.time}</p>
                      {!isAvailable && (
                        <p className="text-xs text-red-500">Not available for selected destination</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Pickup Date *</label>
                <input
                  type="date"
                  className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-primary focus:border-primary ${
                    errors.pickup_date ? 'border-red-500' : 'border-gray-300'
                  }`}
                  value={bookingData.pickup_date}
                  onChange={(e) => setBookingData(prev => ({ ...prev, pickup_date: e.target.value }))}
                  min={new Date().toISOString().split('T')[0]}
                />
                {errors.pickup_date && <p className="text-red-500 text-sm mt-1">{errors.pickup_date}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Preferred Time Slot</label>
                <select
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                  value={bookingData.pickup_time_slot}
                  onChange={(e) => setBookingData(prev => ({ ...prev, pickup_time_slot: e.target.value }))}
                >
                  {timeSlots.map(slot => (
                    <option key={slot.id} value={slot.id} disabled={!slot.available}>
                      {slot.label} {!slot.available && '(Not Available)'}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-4">Delivery Speed</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    bookingData.delivery_speed === 'standard'
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-300 hover:border-primary'
                  }`}
                  onClick={() => setBookingData(prev => ({ ...prev, delivery_speed: 'standard' }))}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">Standard</h3>
                    <Clock size={20} className="text-primary" />
                  </div>
                  <p className="text-sm text-gray-600">Regular delivery time</p>
                  <p className="text-xs text-green-600 mt-1">No additional charge</p>
                </div>

                <div
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    bookingData.delivery_speed === 'express'
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-300 hover:border-primary'
                  }`}
                  onClick={() => setBookingData(prev => ({ ...prev, delivery_speed: 'express' }))}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">Express</h3>
                    <Zap size={20} className="text-accent" />
                  </div>
                  <p className="text-sm text-gray-600">Faster delivery</p>
                  <p className="text-xs text-accent mt-1">+50% surcharge</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-primary">Additional Services</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <Shield size={20} className="text-primary mr-2" />
                      <span className="font-medium">Insurance Coverage</span>
                    </div>
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={bookingData.additional_services.insurance}
                        onChange={(e) => setBookingData(prev => ({
                          ...prev,
                          additional_services: {
                            ...prev.additional_services,
                            insurance: e.target.checked
                          }
                        }))}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">Protect your package against loss or damage</p>
                  {bookingData.additional_services.insurance && (
                    <div>
                      <label className="block text-sm font-medium mb-2">Insurance Value (Rs.) *</label>
                      <input
                        type="number"
                        className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-primary focus:border-primary ${
                          errors.insurance_value ? 'border-red-500' : 'border-gray-300'
                        }`}
                        value={bookingData.additional_services.insurance_value || ''}
                        onChange={(e) => setBookingData(prev => ({
                          ...prev,
                          additional_services: {
                            ...prev.additional_services,
                            insurance_value: parseFloat(e.target.value) || 0
                          }
                        }))}
                        placeholder="Enter insurance value"
                      />
                      {errors.insurance_value && <p className="text-red-500 text-sm mt-1">{errors.insurance_value}</p>}
                      <p className="text-xs text-gray-500 mt-1">Fee: 1% of value (minimum Rs. 50)</p>
                    </div>
                  )}
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <CreditCard size={20} className="text-primary mr-2" />
                      <span className="font-medium">Cash on Delivery</span>
                    </div>
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={bookingData.additional_services.cod}
                        onChange={(e) => setBookingData(prev => ({
                          ...prev,
                          additional_services: {
                            ...prev.additional_services,
                            cod: e.target.checked
                          }
                        }))}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">Collect payment from receiver on delivery</p>
                  {bookingData.additional_services.cod && (
                    <div>
                      <label className="block text-sm font-medium mb-2">COD Amount (Rs.) *</label>
                      <input
                        type="number"
                        className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-primary focus:border-primary ${
                          errors.cod_amount ? 'border-red-500' : 'border-gray-300'
                        }`}
                        value={bookingData.additional_services.cod_amount || ''}
                        onChange={(e) => setBookingData(prev => ({
                          ...prev,
                          additional_services: {
                            ...prev.additional_services,
                            cod_amount: parseFloat(e.target.value) || 0
                          }
                        }))}
                        placeholder="Enter COD amount"
                      />
                      {errors.cod_amount && <p className="text-red-500 text-sm mt-1">{errors.cod_amount}</p>}
                      <p className="text-xs text-gray-500 mt-1">Fee: 2.5% of amount (minimum Rs. 100)</p>
                    </div>
                  )}
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <FileText size={20} className="text-primary mr-2" />
                      <span className="font-medium">Signature Required</span>
                    </div>
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={bookingData.additional_services.signature_required}
                        onChange={(e) => setBookingData(prev => ({
                          ...prev,
                          additional_services: {
                            ...prev.additional_services,
                            signature_required: e.target.checked
                          }
                        }))}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>
                  <p className="text-sm text-gray-600">Require signature confirmation on delivery</p>
                  <p className="text-xs text-green-600 mt-1">Included at no extra charge</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <Camera size={20} className="text-primary mr-2" />
                      <span className="font-medium">Photo Proof of Delivery</span>
                    </div>
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={bookingData.additional_services.photo_proof}
                        onChange={(e) => setBookingData(prev => ({
                          ...prev,
                          additional_services: {
                            ...prev.additional_services,
                            photo_proof: e.target.checked
                          }
                        }))}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>
                  <p className="text-sm text-gray-600">Get photo confirmation of successful delivery</p>
                  <p className="text-xs text-accent mt-1">Additional Rs. 50</p>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <Calendar size={20} className="text-primary mr-2" />
                      <span className="font-medium">Weekend Delivery</span>
                    </div>
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={bookingData.additional_services.weekend_delivery}
                        onChange={(e) => setBookingData(prev => ({
                          ...prev,
                          additional_services: {
                            ...prev.additional_services,
                            weekend_delivery: e.target.checked
                          }
                        }))}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>
                  <p className="text-sm text-gray-600">Enable Saturday and Sunday delivery</p>
                  <p className="text-xs text-accent mt-1">+25% surcharge</p>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <Package size={20} className="text-primary mr-2" />
                      <span className="font-medium">Return Service</span>
                    </div>
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={bookingData.additional_services.return_service}
                        onChange={(e) => setBookingData(prev => ({
                          ...prev,
                          additional_services: {
                            ...prev.additional_services,
                            return_service: e.target.checked
                          }
                        }))}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>
                  <p className="text-sm text-gray-600">Return package if delivery fails</p>
                  <p className="text-xs text-accent mt-1">Additional Rs. 200</p>
                </div>
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-3">Notification Preferences</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={bookingData.additional_services.notifications.sms}
                    onChange={(e) => setBookingData(prev => ({
                      ...prev,
                      additional_services: {
                        ...prev.additional_services,
                        notifications: {
                          ...prev.additional_services.notifications,
                          sms: e.target.checked
                        }
                      }
                    }))}
                  />
                  <span>SMS Notifications</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={bookingData.additional_services.notifications.email}
                    onChange={(e) => setBookingData(prev => ({
                      ...prev,
                      additional_services: {
                        ...prev.additional_services,
                        notifications: {
                          ...prev.additional_services.notifications,
                          email: e.target.checked
                        }
                      }
                    }))}
                  />
                  <span>Email Notifications</span>
                </label>
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-primary">Review & Payment</h2>

            {/* Booking Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-6">
                {/* Route Summary */}
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-3">Route Summary</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center text-sm text-gray-600 mb-1">
                        <MapPin size={16} className="mr-1" />
                        From
                      </div>
                      <p className="font-medium">{bookingData.sender.name}</p>
                      <p className="text-sm text-gray-600">
                        {bookingData.sender.street}, {bookingData.sender.city}, {bookingData.sender.district}
                      </p>
                    </div>
                    <div className="flex justify-center">
                      <ArrowRight size={20} className="text-gray-400" />
                    </div>
                    <div>
                      <div className="flex items-center text-sm text-gray-600 mb-1">
                        <MapPin size={16} className="mr-1" />
                        To
                      </div>
                      <p className="font-medium">{bookingData.receiver.name}</p>
                      <p className="text-sm text-gray-600">
                        {bookingData.receiver.street}, {bookingData.receiver.city}, {bookingData.receiver.district}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Package Summary */}
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-3">Package Summary</h3>
                  <div className="space-y-2">
                    {bookingData.packages.map((pkg, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{pkg.description}</p>
                          <p className="text-sm text-gray-600">{pkg.weight}kg • Rs. {pkg.value.toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Service Summary */}
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-3">Service Details</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Service Type:</span>
                      <span className="font-medium">
                        {serviceTypes.find(s => s.id === bookingData.service_type)?.name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Pickup Date:</span>
                      <span className="font-medium">{bookingData.pickup_date}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Time Slot:</span>
                      <span className="font-medium">
                        {timeSlots.find(s => s.id === bookingData.pickup_time_slot)?.label}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery Speed:</span>
                      <span className="font-medium capitalize">{bookingData.delivery_speed}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pricing Summary */}
              <div className="space-y-6">
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-3">Price Breakdown</h3>
                  {isCalculating ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                      <p className="text-sm text-gray-600">Calculating final price...</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {bookingData.pricing.breakdown.map((item, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <div>
                            <span className="text-sm">{item.label}</span>
                            {item.description && (
                              <div className="text-xs text-gray-500">{item.description}</div>
                            )}
                          </div>
                          <span className={`font-medium ${item.amount < 0 ? 'text-green-600' : ''}`}>
                            {item.amount < 0 ? '-' : ''}Rs. {Math.abs(item.amount).toFixed(2)}
                          </span>
                        </div>
                      ))}
                      <div className="border-t pt-2 mt-2">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-lg">Total:</span>
                          <span className="font-bold text-xl text-primary">
                            Rs. {bookingData.pricing.total.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Payment Method */}
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-3">Payment Method</h3>
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="payment_method"
                        value="card"
                        checked={bookingData.payment.method === 'card'}
                        onChange={(e) => setBookingData(prev => ({
                          ...prev,
                          payment: { ...prev.payment, method: e.target.value as any }
                        }))}
                        className="mr-2"
                      />
                      <CreditCard size={16} className="mr-2" />
                      Credit/Debit Card
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="payment_method"
                        value="bank_transfer"
                        checked={bookingData.payment.method === 'bank_transfer'}
                        onChange={(e) => setBookingData(prev => ({
                          ...prev,
                          payment: { ...prev.payment, method: e.target.value as any }
                        }))}
                        className="mr-2"
                      />
                      <Building size={16} className="mr-2" />
                      Bank Transfer
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="payment_method"
                        value="cash_on_pickup"
                        checked={bookingData.payment.method === 'cash_on_pickup'}
                        onChange={(e) => setBookingData(prev => ({
                          ...prev,
                          payment: { ...prev.payment, method: e.target.value as any }
                        }))}
                        className="mr-2"
                      />
                      <DollarSign size={16} className="mr-2" />
                      Cash on Pickup
                    </label>
                  </div>
                </div>

                {/* Promo Code */}
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-3">Promo Code</h3>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      className="flex-1 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                      placeholder="Enter promo code"
                      value={bookingData.payment.promo_code || ''}
                      onChange={(e) => setBookingData(prev => ({
                        ...prev,
                        payment: { ...prev.payment, promo_code: e.target.value }
                      }))}
                    />
                    <button className="btn btn-outline">Apply</button>
                  </div>
                </div>

                {/* Terms and Conditions */}
                <div className="border rounded-lg p-4">
                  <label className="flex items-start">
                    <input type="checkbox" className="mr-2 mt-1" required />
                    <span className="text-sm">
                      I agree to the{' '}
                      <Link to="/terms" className="text-primary hover:underline">
                        Terms and Conditions
                      </Link>{' '}
                      and{' '}
                      <Link to="/privacy" className="text-primary hover:underline">
                        Privacy Policy
                      </Link>
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const steps = [
    { number: 1, title: 'Sender', icon: User },
    { number: 2, title: 'Receiver', icon: MapPin },
    { number: 3, title: 'Package', icon: Package },
    { number: 4, title: 'Service', icon: Truck },
    { number: 5, title: 'Extras', icon: Shield },
    { number: 6, title: 'Payment', icon: CreditCard }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4">Book a Delivery</h1>
          <p className="text-text-light max-w-2xl mx-auto">
            Complete the form below to schedule your delivery. We'll handle the rest with care and precision.
          </p>
        </div>

        {/* Progress Steps */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isCompleted = currentStep > step.number;
              const isCurrent = currentStep === step.number;
              
              return (
                <React.Fragment key={step.number}>
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all ${
                        isCompleted
                          ? 'bg-success text-white'
                          : isCurrent
                          ? 'bg-primary text-white'
                          : 'bg-gray-200 text-gray-500'
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle size={20} />
                      ) : (
                        <Icon size={20} />
                      )}
                    </div>
                    <span
                      className={`text-sm font-medium ${
                        isCompleted || isCurrent ? 'text-primary' : 'text-gray-500'
                      }`}
                    >
                      {step.title}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`flex-1 h-1 mx-4 rounded ${
                        isCompleted ? 'bg-success' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-sm p-6 md:p-8 mb-8">
          {renderStepContent()}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <div className="flex gap-4">
            <button
              onClick={saveDraft}
              className="btn bg-gray-100 text-gray-700 hover:bg-gray-200"
            >
              <Save size={16} className="mr-2" />
              Save Draft
            </button>
            {bookingHistory.length > 0 && (
              <button
                onClick={() => setShowBookingHistory(true)}
                className="btn bg-gray-100 text-gray-700 hover:bg-gray-200"
              >
                <Clock size={16} className="mr-2" />
                Booking History
              </button>
            )}
          </div>

          <div className="flex gap-4">
            {currentStep > 1 && (
              <button
                onClick={prevStep}
                className="btn btn-outline"
                disabled={isLoading}
              >
                <ArrowLeft size={16} className="mr-2" />
                Previous
              </button>
            )}
            
            {currentStep < 6 ? (
              <button
                onClick={nextStep}
                className="btn btn-primary"
                disabled={isLoading || isCalculating}
              >
                {isCalculating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Calculating...
                  </>
                ) : (
                  <>
                    Next
                    <ArrowRight size={16} className="ml-2" />
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={submitBooking}
                className="btn btn-primary"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    Confirm Booking
                    <CheckCircle size={16} className="ml-2" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Floating Action Buttons */}
        <div className="fixed bottom-6 right-6 flex flex-col gap-3">
          <button
            onClick={() => window.open('tel:+94111234567')}
            className="w-12 h-12 bg-success text-white rounded-full flex items-center justify-center shadow-lg hover:bg-success/90 transition-colors"
          >
            <Phone size={20} />
          </button>
          <button
            onClick={calculatePricing}
            className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center shadow-lg hover:bg-primary-light transition-colors"
          >
            <Calculator size={20} />
          </button>
        </div>
      </div>

      {/* Address Book Modal */}
      {showAddressBook && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-primary">Address Book</h2>
                <button
                  onClick={() => setShowAddressBook(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              {savedAddresses.length === 0 ? (
                <div className="text-center py-8">
                  <MapPin size={48} className="text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No saved addresses yet</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {savedAddresses.map((address) => (
                    <div key={address.id} className="border rounded-lg p-4 hover:border-primary transition-colors">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold">{address.label}</h3>
                        <button
                          onClick={() => deleteAddress(address.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        {address.address.street}, {address.address.city}, {address.address.district}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          Used {address.usage_count} times
                        </span>
                        <button
                          onClick={() => selectAddress(address)}
                          className="btn btn-primary text-sm"
                        >
                          Select
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Booking History Modal */}
      {showBookingHistory && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-primary">Booking History</h2>
                <button
                  onClick={() => setShowBookingHistory(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              {bookingHistory.length === 0 ? (
                <div className="text-center py-8">
                  <Package size={48} className="text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No booking history yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {bookingHistory.map((booking) => (
                    <div key={booking.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">{booking.booking_number}</h3>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          booking.status === 'confirmed' ? 'bg-success/10 text-success' :
                          booking.status === 'delivered' ? 'bg-primary/10 text-primary' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {booking.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Route:</span>
                          <p>{booking.from} → {booking.to}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Date:</span>
                          <p>{new Date(booking.date).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Total:</span>
                          <p className="font-semibold">Rs. {booking.total.toFixed(2)}</p>
                        </div>
                      </div>
                      {booking.tracking_number && (
                        <div className="mt-3 flex items-center justify-between">
                          <span className="text-sm text-gray-500">
                            Tracking: {booking.tracking_number}
                          </span>
                          <Link
                            to={`/track?id=${booking.tracking_number}`}
                            className="btn btn-outline text-xs"
                          >
                            <ExternalLink size={14} className="mr-1" />
                            Track
                          </Link>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Custom CSS for switches */}
      <style jsx>{`
        .switch {
          position: relative;
          display: inline-block;
          width: 48px;
          height: 24px;
        }

        .switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #ccc;
          transition: .4s;
          border-radius: 24px;
        }

        .slider:before {
          position: absolute;
          content: "";
          height: 18px;
          width: 18px;
          left: 3px;
          bottom: 3px;
          background-color: white;
          transition: .4s;
          border-radius: 50%;
        }

        input:checked + .slider {
          background-color: #0F2C59;
        }

        input:checked + .slider:before {
          transform: translateX(24px);
        }
      `}</style>
    </div>
  );
};

export default BookingPage;
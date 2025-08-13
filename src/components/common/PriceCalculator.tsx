import React, { useState, useEffect } from 'react';
import { Calculator, Info, AlertCircle, CheckCircle, Package, Truck, Clock } from 'lucide-react';
import PricingCalculator, { PricingInput, PricingBreakdown, CITY_ZONES } from '../../utils/pricingCalculator';
import toast from 'react-hot-toast';

interface PriceCalculatorProps {
  onCalculationComplete?: (result: PricingBreakdown) => void;
  initialData?: Partial<PricingInput>;
  compact?: boolean;
  showServiceSelection?: boolean;
  className?: string;
}

interface City {
  id: string;
  name: string;
  zone: 'zone1' | 'zone2' | 'zone3';
}

const PriceCalculator: React.FC<PriceCalculatorProps> = ({
  onCalculationComplete,
  initialData,
  compact = false,
  showServiceSelection = true,
  className = ''
}) => {
  const [calculatorData, setCalculatorData] = useState<Partial<PricingInput>>({
    service_type: 'overnight',
    from_zone: 'zone1',
    to_zone: 'zone1',
    weight: 1,
    delivery_speed: 'standard',
    packaging: 'standard',
    additional_services: {
      insurance: false,
      cod: false,
      signature_required: false,
      photo_proof: false,
      weekend_delivery: false,
      fragile_handling: false,
      temperature_controlled: false
    },
    volume_tier: 1,
    ...initialData
  });

  const [pricingResult, setPricingResult] = useState<PricingBreakdown | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const cities: City[] = [
    { id: 'colombo', name: 'Colombo', zone: 'zone1' },
    { id: 'gampaha', name: 'Gampaha', zone: 'zone1' },
    { id: 'kalutara', name: 'Kalutara', zone: 'zone1' },
    { id: 'kandy', name: 'Kandy', zone: 'zone2' },
    { id: 'galle', name: 'Galle', zone: 'zone2' },
    { id: 'kurunegala', name: 'Kurunegala', zone: 'zone2' },
    { id: 'ratnapura', name: 'Ratnapura', zone: 'zone2' },
    { id: 'matara', name: 'Matara', zone: 'zone3' },
    { id: 'jaffna', name: 'Jaffna', zone: 'zone3' },
    { id: 'anuradhapura', name: 'Anuradhapura', zone: 'zone3' },
    { id: 'hambantota', name: 'Hambantota', zone: 'zone3' },
    { id: 'batticaloa', name: 'Batticaloa', zone: 'zone3' },
    { id: 'trincomalee', name: 'Trincomalee', zone: 'zone3' },
    { id: 'badulla', name: 'Badulla', zone: 'zone3' },
    { id: 'monaragala', name: 'Monaragala', zone: 'zone3' }
  ];

  const serviceTypes = [
    { id: 'same_day', name: 'Same Day Delivery', icon: <Clock size={16} /> },
    { id: 'overnight', name: 'Overnight Express', icon: <Truck size={16} /> },
    { id: 'standard', name: 'Standard Delivery', icon: <Package size={16} /> },
    { id: 'documents', name: 'Document Delivery', icon: <Package size={16} /> },
    { id: 'international', name: 'International Shipping', icon: <Package size={16} /> },
    { id: 'fragile', name: 'Fragile & Special Care', icon: <Package size={16} /> },
    { id: 'bulk', name: 'Bulk Commercial', icon: <Package size={16} /> },
    { id: 'ecommerce', name: 'eCommerce Fulfillment', icon: <Package size={16} /> }
  ];

  // Update zones when cities change
  const handleCityChange = (field: 'from' | 'to', cityId: string) => {
    const city = cities.find(c => c.id === cityId);
    if (city) {
      setCalculatorData(prev => ({
        ...prev,
        [`${field}_zone`]: city.zone
      }));
    }
  };

  // Calculate price
  const calculatePrice = async () => {
    const validationErrors = PricingCalculator.validateInput(calculatorData);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsCalculating(true);
    setErrors([]);

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));

      const result = PricingCalculator.calculate(calculatorData as PricingInput);
      setPricingResult(result);
      
      if (onCalculationComplete) {
        onCalculationComplete(result);
      }

      toast.success('Price calculated successfully');
    } catch (error: any) {
      setErrors([error.message || 'Failed to calculate price']);
      toast.error('Failed to calculate price');
    } finally {
      setIsCalculating(false);
    }
  };

  // Auto-calculate when key fields change
  useEffect(() => {
    if (calculatorData.service_type && calculatorData.from_zone && calculatorData.to_zone && calculatorData.weight) {
      const timer = setTimeout(() => {
        calculatePrice();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [
    calculatorData.service_type,
    calculatorData.from_zone,
    calculatorData.to_zone,
    calculatorData.weight,
    calculatorData.delivery_speed,
    calculatorData.additional_services
  ]);

  const updateCalculatorData = (updates: Partial<PricingInput>) => {
    setCalculatorData(prev => ({
      ...prev,
      ...updates
    }));
  };

  const updateAdditionalServices = (service: keyof PricingInput['additional_services'], value: boolean) => {
    setCalculatorData(prev => ({
      ...prev,
      additional_services: {
        ...prev.additional_services!,
        [service]: value
      }
    }));
  };

  if (compact) {
    return (
      <div className={`bg-white rounded-lg shadow-md p-4 ${className}`}>
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Calculator size={20} className="mr-2 text-primary" />
          Quick Price Calculator
        </h3>
        
        <div className="grid grid-cols-2 gap-3 mb-4">
          <select
            className="p-2 border border-gray-300 rounded-md text-sm"
            value={calculatorData.service_type || ''}
            onChange={(e) => updateCalculatorData({ service_type: e.target.value as any })}
          >
            <option value="">Select service</option>
            {serviceTypes.map(service => (
              <option key={service.id} value={service.id}>{service.name}</option>
            ))}
          </select>
          
          <input
            type="number"
            placeholder="Weight (kg)"
            className="p-2 border border-gray-300 rounded-md text-sm"
            value={calculatorData.weight || ''}
            onChange={(e) => updateCalculatorData({ weight: parseFloat(e.target.value) || 0 })}
            step="0.1"
            min="0.1"
          />
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <select
            className="p-2 border border-gray-300 rounded-md text-sm"
            onChange={(e) => handleCityChange('from', e.target.value)}
          >
            <option value="">From city</option>
            {cities.map(city => (
              <option key={city.id} value={city.id}>{city.name}</option>
            ))}
          </select>
          
          <select
            className="p-2 border border-gray-300 rounded-md text-sm"
            onChange={(e) => handleCityChange('to', e.target.value)}
          >
            <option value="">To city</option>
            {cities.map(city => (
              <option key={city.id} value={city.id}>{city.name}</option>
            ))}
          </select>
        </div>

        {pricingResult && (
          <div className="bg-primary text-white rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-gold">Rs. {pricingResult.total.toFixed(2)}</div>
            <div className="text-sm text-gray-200">Estimated delivery: {pricingResult.delivery_time}</div>
          </div>
        )}

        {errors.length > 0 && (
          <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded-md">
            {errors.map((error, index) => (
              <div key={index} className="text-red-700 text-sm flex items-center">
                <AlertCircle size={14} className="mr-1" />
                {error}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-md ${className}`}>
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-6 flex items-center">
          <Calculator size={24} className="mr-3 text-primary" />
          Advanced Price Calculator
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Input Form */}
          <div className="space-y-4">
            {showServiceSelection && (
              <div>
                <label className="block text-sm font-medium mb-2">Service Type *</label>
                <select
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                  value={calculatorData.service_type || ''}
                  onChange={(e) => updateCalculatorData({ service_type: e.target.value as any })}
                >
                  <option value="">Select service type</option>
                  {serviceTypes.map(service => (
                    <option key={service.id} value={service.id}>{service.name}</option>
                  ))}
                </select>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">From City *</label>
                <select
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                  onChange={(e) => handleCityChange('from', e.target.value)}
                >
                  <option value="">Select origin</option>
                  {cities.map(city => (
                    <option key={city.id} value={city.id}>
                      {city.name} ({city.zone.toUpperCase()})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">To City *</label>
                <select
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                  onChange={(e) => handleCityChange('to', e.target.value)}
                >
                  <option value="">Select destination</option>
                  {cities.map(city => (
                    <option key={city.id} value={city.id}>
                      {city.name} ({city.zone.toUpperCase()})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Weight (kg) *</label>
                <input
                  type="number"
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="0.5"
                  value={calculatorData.weight || ''}
                  onChange={(e) => updateCalculatorData({ weight: parseFloat(e.target.value) || 0 })}
                  step="0.1"
                  min="0.1"
                  max="50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Declared Value (Rs.)</label>
                <input
                  type="number"
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="5000"
                  value={calculatorData.declared_value || ''}
                  onChange={(e) => updateCalculatorData({ declared_value: parseFloat(e.target.value) || 0 })}
                  min="0"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Delivery Speed</label>
                <select
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                  value={calculatorData.delivery_speed || 'standard'}
                  onChange={(e) => updateCalculatorData({ delivery_speed: e.target.value as any })}
                >
                  <option value="standard">Standard</option>
                  <option value="express">Express (+30%)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Packaging</label>
                <select
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
                  value={calculatorData.packaging || 'standard'}
                  onChange={(e) => updateCalculatorData({ packaging: e.target.value as any })}
                >
                  <option value="standard">Standard (Free)</option>
                  <option value="premium">Premium (+Rs. 150)</option>
                  <option value="fragile">Fragile Handling (+Rs. 250)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-3">Additional Services</label>
              <div className="grid grid-cols-2 gap-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={calculatorData.additional_services?.insurance || false}
                    onChange={(e) => updateAdditionalServices('insurance', e.target.checked)}
                  />
                  <span className="text-sm">Insurance Coverage</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={calculatorData.additional_services?.cod || false}
                    onChange={(e) => updateAdditionalServices('cod', e.target.checked)}
                  />
                  <span className="text-sm">Cash on Delivery</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={calculatorData.additional_services?.weekend_delivery || false}
                    onChange={(e) => updateAdditionalServices('weekend_delivery', e.target.checked)}
                  />
                  <span className="text-sm">Weekend Delivery</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={calculatorData.additional_services?.fragile_handling || false}
                    onChange={(e) => updateAdditionalServices('fragile_handling', e.target.checked)}
                  />
                  <span className="text-sm">Fragile Handling</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={calculatorData.additional_services?.signature_required || false}
                    onChange={(e) => updateAdditionalServices('signature_required', e.target.checked)}
                  />
                  <span className="text-sm">Signature Required</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={calculatorData.additional_services?.photo_proof || false}
                    onChange={(e) => updateAdditionalServices('photo_proof', e.target.checked)}
                  />
                  <span className="text-sm">Photo Proof</span>
                </label>
              </div>
            </div>

            <button
              onClick={calculatePrice}
              className="w-full btn btn-primary py-3"
              disabled={isCalculating}
            >
              {isCalculating ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Calculating...
                </div>
              ) : (
                'Calculate Price'
              )}
            </button>

            {errors.length > 0 && (
              <div className="space-y-2">
                {errors.map((error, index) => (
                  <div key={index} className="p-3 bg-red-50 border border-red-200 rounded-md flex items-center">
                    <AlertCircle size={16} className="text-red-500 mr-2" />
                    <span className="text-red-700 text-sm">{error}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column - Results */}
          <div>
            {!pricingResult && !isCalculating && (
              <div className="bg-gray-50 rounded-lg p-8 text-center h-full flex items-center justify-center">
                <div>
                  <Calculator size={48} className="text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Fill in the details to calculate pricing</p>
                </div>
              </div>
            )}

            {isCalculating && (
              <div className="bg-gray-50 rounded-lg p-8 text-center h-full flex items-center justify-center">
                <div>
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-primary font-medium">Calculating your quote...</p>
                </div>
              </div>
            )}

            {pricingResult && (
              <div className="space-y-4">
                {/* Summary Card */}
                <div className="bg-primary text-white rounded-lg p-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gold mb-2">
                      Rs. {pricingResult.total.toFixed(2)}
                    </div>
                    <div className="text-gray-200 mb-4">
                      Estimated delivery: {pricingResult.delivery_time}
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="font-semibold">Rs. {pricingResult.subtotal.toFixed(2)}</div>
                        <div className="text-gray-300">Subtotal</div>
                      </div>
                      <div>
                        <div className="font-semibold">Rs. {pricingResult.tax.toFixed(2)}</div>
                        <div className="text-gray-300">VAT (15%)</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Detailed Breakdown */}
                <div className="bg-white border rounded-lg">
                  <div className="p-4 border-b">
                    <h4 className="font-semibold flex items-center">
                      <Info size={16} className="mr-2 text-primary" />
                      Price Breakdown
                    </h4>
                  </div>
                  <div className="p-4 space-y-3 max-h-64 overflow-y-auto">
                    {pricingResult.breakdown.map((item, index) => (
                      <div key={index} className="flex justify-between items-start">
                        <div className="flex-1">
                          <span className="font-medium">{item.label}</span>
                          {item.description && (
                            <div className="text-xs text-gray-500">{item.description}</div>
                          )}
                        </div>
                        <span className={`font-semibold ml-4 ${item.amount < 0 ? 'text-success' : 'text-gray-900'}`}>
                          {item.amount < 0 ? '-' : ''}Rs. {Math.abs(item.amount).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Success Message */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center">
                  <CheckCircle size={16} className="text-green-500 mr-2" />
                  <span className="text-green-700 text-sm">
                    Price calculated successfully. This quote is valid for 24 hours.
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceCalculator;
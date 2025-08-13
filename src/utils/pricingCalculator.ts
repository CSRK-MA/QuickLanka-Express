export interface PricingInput {
  service_type: 'same_day' | 'overnight' | 'standard' | 'documents' | 'international' | 'fragile' | 'bulk' | 'ecommerce';
  from_zone: 'zone1' | 'zone2' | 'zone3';
  to_zone: 'zone1' | 'zone2' | 'zone3';
  weight: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  declared_value?: number;
  delivery_speed: 'standard' | 'express';
  packaging: 'standard' | 'premium' | 'fragile';
  additional_services: {
    insurance: boolean;
    cod: boolean;
    signature_required: boolean;
    photo_proof: boolean;
    weekend_delivery: boolean;
    fragile_handling: boolean;
    temperature_controlled: boolean;
  };
  pickup_date?: string;
  volume_tier?: number; // Monthly volume for discounts
}

export interface PricingBreakdown {
  base_price: number;
  weight_charge: number;
  distance_charge: number;
  fuel_surcharge: number;
  service_fee: number;
  insurance_fee: number;
  packaging_fee: number;
  cod_fee: number;
  weekend_surcharge: number;
  express_surcharge: number;
  fragile_handling_fee: number;
  temperature_control_fee: number;
  volume_discount: number;
  subtotal: number;
  tax: number;
  total: number;
  delivery_time: string;
  breakdown: {
    label: string;
    amount: number;
    description?: string;
  }[];
}

export interface ServiceConfig {
  base_price: number;
  per_kg_rate: number;
  zones: {
    [key: string]: {
      base_multiplier: number;
      per_kg_multiplier: number;
      fuel_surcharge: number;
    };
  };
  delivery_times: {
    standard: string;
    express: string;
  };
  volume_discounts: {
    min_volume: number;
    discount_percentage: number;
  }[];
}

// Service configurations
const SERVICE_CONFIGS: Record<string, ServiceConfig> = {
  same_day: {
    base_price: 800,
    per_kg_rate: 150,
    zones: {
      zone1: { base_multiplier: 1.0, per_kg_multiplier: 1.0, fuel_surcharge: 75 },
      zone2: { base_multiplier: 1.5, per_kg_multiplier: 1.3, fuel_surcharge: 125 },
      zone3: { base_multiplier: 2.0, per_kg_multiplier: 1.6, fuel_surcharge: 175 }
    },
    delivery_times: {
      standard: '6-8 hours',
      express: '3-5 hours'
    },
    volume_discounts: [
      { min_volume: 10, discount_percentage: 5 },
      { min_volume: 50, discount_percentage: 10 },
      { min_volume: 100, discount_percentage: 15 }
    ]
  },
  overnight: {
    base_price: 450,
    per_kg_rate: 85,
    zones: {
      zone1: { base_multiplier: 1.0, per_kg_multiplier: 1.0, fuel_surcharge: 50 },
      zone2: { base_multiplier: 1.2, per_kg_multiplier: 1.1, fuel_surcharge: 75 },
      zone3: { base_multiplier: 1.5, per_kg_multiplier: 1.3, fuel_surcharge: 100 }
    },
    delivery_times: {
      standard: 'Next business day',
      express: 'Next day by 12 PM'
    },
    volume_discounts: [
      { min_volume: 20, discount_percentage: 8 },
      { min_volume: 100, discount_percentage: 15 },
      { min_volume: 500, discount_percentage: 25 }
    ]
  },
  standard: {
    base_price: 300,
    per_kg_rate: 60,
    zones: {
      zone1: { base_multiplier: 1.0, per_kg_multiplier: 1.0, fuel_surcharge: 40 },
      zone2: { base_multiplier: 1.1, per_kg_multiplier: 1.0, fuel_surcharge: 60 },
      zone3: { base_multiplier: 1.3, per_kg_multiplier: 1.2, fuel_surcharge: 80 }
    },
    delivery_times: {
      standard: '2-3 business days',
      express: '1-2 business days'
    },
    volume_discounts: [
      { min_volume: 50, discount_percentage: 10 },
      { min_volume: 200, discount_percentage: 18 },
      { min_volume: 1000, discount_percentage: 30 }
    ]
  },
  documents: {
    base_price: 250,
    per_kg_rate: 0,
    zones: {
      zone1: { base_multiplier: 1.0, per_kg_multiplier: 0, fuel_surcharge: 30 },
      zone2: { base_multiplier: 1.2, per_kg_multiplier: 0, fuel_surcharge: 50 },
      zone3: { base_multiplier: 1.4, per_kg_multiplier: 0, fuel_surcharge: 70 }
    },
    delivery_times: {
      standard: '4-24 hours',
      express: '2-6 hours'
    },
    volume_discounts: [
      { min_volume: 25, discount_percentage: 12 },
      { min_volume: 100, discount_percentage: 20 }
    ]
  },
  international: {
    base_price: 2500,
    per_kg_rate: 450,
    zones: {
      zone1: { base_multiplier: 1.0, per_kg_multiplier: 1.0, fuel_surcharge: 200 }
    },
    delivery_times: {
      standard: '5-10 business days',
      express: '3-5 business days'
    },
    volume_discounts: [
      { min_volume: 10, discount_percentage: 8 },
      { min_volume: 50, discount_percentage: 15 }
    ]
  },
  fragile: {
    base_price: 600,
    per_kg_rate: 120,
    zones: {
      zone1: { base_multiplier: 1.0, per_kg_multiplier: 1.0, fuel_surcharge: 100 },
      zone2: { base_multiplier: 1.3, per_kg_multiplier: 1.2, fuel_surcharge: 150 },
      zone3: { base_multiplier: 1.6, per_kg_multiplier: 1.4, fuel_surcharge: 200 }
    },
    delivery_times: {
      standard: '1-2 business days',
      express: 'Next day'
    },
    volume_discounts: [
      { min_volume: 5, discount_percentage: 5 },
      { min_volume: 20, discount_percentage: 12 }
    ]
  },
  bulk: {
    base_price: 200,
    per_kg_rate: 45,
    zones: {
      zone1: { base_multiplier: 1.0, per_kg_multiplier: 1.0, fuel_surcharge: 35 },
      zone2: { base_multiplier: 1.0, per_kg_multiplier: 1.0, fuel_surcharge: 50 },
      zone3: { base_multiplier: 1.1, per_kg_multiplier: 1.0, fuel_surcharge: 65 }
    },
    delivery_times: {
      standard: '1-3 business days',
      express: 'Next business day'
    },
    volume_discounts: [
      { min_volume: 500, discount_percentage: 20 },
      { min_volume: 2000, discount_percentage: 30 },
      { min_volume: 10000, discount_percentage: 45 }
    ]
  },
  ecommerce: {
    base_price: 300,
    per_kg_rate: 65,
    zones: {
      zone1: { base_multiplier: 1.0, per_kg_multiplier: 1.0, fuel_surcharge: 45 },
      zone2: { base_multiplier: 1.1, per_kg_multiplier: 1.0, fuel_surcharge: 65 },
      zone3: { base_multiplier: 1.3, per_kg_multiplier: 1.1, fuel_surcharge: 85 }
    },
    delivery_times: {
      standard: '1-2 business days',
      express: 'Next day'
    },
    volume_discounts: [
      { min_volume: 100, discount_percentage: 15 },
      { min_volume: 500, discount_percentage: 25 },
      { min_volume: 2000, discount_percentage: 35 }
    ]
  }
};

// City to zone mapping
export const CITY_ZONES: Record<string, 'zone1' | 'zone2' | 'zone3'> = {
  'colombo': 'zone1',
  'gampaha': 'zone1',
  'kalutara': 'zone1',
  'kandy': 'zone2',
  'galle': 'zone2',
  'kurunegala': 'zone2',
  'ratnapura': 'zone2',
  'matara': 'zone3',
  'jaffna': 'zone3',
  'anuradhapura': 'zone3',
  'hambantota': 'zone3',
  'batticaloa': 'zone3',
  'trincomalee': 'zone3',
  'badulla': 'zone3',
  'monaragala': 'zone3'
};

export class PricingCalculator {
  static calculate(input: PricingInput): PricingBreakdown {
    const config = SERVICE_CONFIGS[input.service_type];
    if (!config) {
      throw new Error(`Invalid service type: ${input.service_type}`);
    }

    const fromZoneConfig = config.zones[input.from_zone] || config.zones.zone1;
    const toZoneConfig = config.zones[input.to_zone] || config.zones.zone1;

    // Use the destination zone for pricing (standard practice)
    const zoneConfig = toZoneConfig;

    // Base calculations
    const base_price = config.base_price * zoneConfig.base_multiplier;
    const weight_charge = config.per_kg_rate * input.weight * zoneConfig.per_kg_multiplier;
    const fuel_surcharge = zoneConfig.fuel_surcharge;

    // Distance charge (inter-zone delivery)
    const distance_charge = input.from_zone !== input.to_zone ? 100 : 0;

    // Service fees
    const service_fee = input.delivery_speed === 'express' ? base_price * 0.3 : 0;
    const express_surcharge = input.delivery_speed === 'express' ? base_price * 0.2 : 0;

    // Additional service fees
    const insurance_fee = input.additional_services.insurance 
      ? Math.max((input.declared_value || 0) * 0.01, 50) 
      : 0;

    const packaging_fee = input.packaging === 'premium' ? 150 : 
                         input.packaging === 'fragile' ? 250 : 0;

    const cod_fee = input.additional_services.cod 
      ? Math.max((input.declared_value || 0) * 0.025, 100) 
      : 0;

    const weekend_surcharge = input.additional_services.weekend_delivery 
      ? base_price * 0.25 
      : 0;

    const fragile_handling_fee = input.additional_services.fragile_handling ? 200 : 0;
    const temperature_control_fee = input.additional_services.temperature_controlled ? 300 : 0;

    // Volume discount calculation
    const volumeTier = input.volume_tier || 1;
    const applicableDiscount = config.volume_discounts
      .filter(d => volumeTier >= d.min_volume)
      .sort((a, b) => b.discount_percentage - a.discount_percentage)[0];

    const volume_discount = applicableDiscount 
      ? (base_price + weight_charge) * (applicableDiscount.discount_percentage / 100)
      : 0;

    // Calculate subtotal
    const subtotal = base_price + weight_charge + distance_charge + fuel_surcharge + 
                    service_fee + insurance_fee + packaging_fee + cod_fee + 
                    weekend_surcharge + express_surcharge + fragile_handling_fee + 
                    temperature_control_fee - volume_discount;

    // Tax calculation (15% VAT)
    const tax = subtotal * 0.15;
    const total = subtotal + tax;

    // Delivery time
    const delivery_time = config.delivery_times[input.delivery_speed];

    // Build breakdown array
    const breakdown = [
      { 
        label: 'Base Price', 
        amount: base_price, 
        description: `${input.service_type.replace('_', ' ')} service to ${input.to_zone}` 
      },
      ...(weight_charge > 0 ? [{
        label: 'Weight Charge',
        amount: weight_charge,
        description: `${input.weight}kg × Rs.${(config.per_kg_rate * zoneConfig.per_kg_multiplier).toFixed(0)}`
      }] : []),
      { 
        label: 'Fuel Surcharge', 
        amount: fuel_surcharge, 
        description: 'Current fuel adjustment' 
      },
      ...(distance_charge > 0 ? [{
        label: 'Distance Charge',
        amount: distance_charge,
        description: 'Inter-zone delivery surcharge'
      }] : []),
      ...(service_fee > 0 ? [{
        label: 'Express Service Fee',
        amount: service_fee,
        description: 'Priority handling and processing'
      }] : []),
      ...(insurance_fee > 0 ? [{
        label: 'Insurance Coverage',
        amount: insurance_fee,
        description: `Coverage up to Rs.${(input.declared_value || 0).toLocaleString()}`
      }] : []),
      ...(packaging_fee > 0 ? [{
        label: 'Special Packaging',
        amount: packaging_fee,
        description: `${input.packaging} packaging`
      }] : []),
      ...(cod_fee > 0 ? [{
        label: 'COD Service Fee',
        amount: cod_fee,
        description: '2.5% of collection amount (min Rs.100)'
      }] : []),
      ...(weekend_surcharge > 0 ? [{
        label: 'Weekend Delivery',
        amount: weekend_surcharge,
        description: '25% surcharge for weekend service'
      }] : []),
      ...(express_surcharge > 0 ? [{
        label: 'Express Surcharge',
        amount: express_surcharge,
        description: 'Expedited delivery processing'
      }] : []),
      ...(fragile_handling_fee > 0 ? [{
        label: 'Fragile Handling',
        amount: fragile_handling_fee,
        description: 'Special care and handling'
      }] : []),
      ...(temperature_control_fee > 0 ? [{
        label: 'Temperature Control',
        amount: temperature_control_fee,
        description: 'Climate-controlled transport'
      }] : []),
      ...(volume_discount > 0 ? [{
        label: 'Volume Discount',
        amount: -volume_discount,
        description: `${applicableDiscount?.discount_percentage}% discount for ${volumeTier}+ monthly shipments`
      }] : []),
      { 
        label: 'VAT (15%)', 
        amount: tax, 
        description: 'Government tax' 
      }
    ];

    return {
      base_price,
      weight_charge,
      distance_charge,
      fuel_surcharge,
      service_fee,
      insurance_fee,
      packaging_fee,
      cod_fee,
      weekend_surcharge,
      express_surcharge,
      fragile_handling_fee,
      temperature_control_fee,
      volume_discount,
      subtotal,
      tax,
      total,
      delivery_time,
      breakdown
    };
  }

  static getServiceConfig(serviceType: string): ServiceConfig | null {
    return SERVICE_CONFIGS[serviceType] || null;
  }

  static getAllServiceTypes(): string[] {
    return Object.keys(SERVICE_CONFIGS);
  }

  static getCityZone(cityId: string): 'zone1' | 'zone2' | 'zone3' {
    return CITY_ZONES[cityId.toLowerCase()] || 'zone3';
  }

  static validateInput(input: Partial<PricingInput>): string[] {
    const errors: string[] = [];

    if (!input.service_type) {
      errors.push('Service type is required');
    } else if (!SERVICE_CONFIGS[input.service_type]) {
      errors.push('Invalid service type');
    }

    if (!input.from_zone) {
      errors.push('Origin zone is required');
    }

    if (!input.to_zone) {
      errors.push('Destination zone is required');
    }

    if (!input.weight || input.weight <= 0) {
      errors.push('Weight must be greater than 0');
    } else if (input.weight > 50) {
      errors.push('Weight cannot exceed 50kg for standard services');
    }

    if (input.declared_value && input.declared_value < 0) {
      errors.push('Declared value cannot be negative');
    }

    return errors;
  }
}

// Export for use in components
export default PricingCalculator;
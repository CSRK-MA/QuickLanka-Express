import { useState, useEffect, useCallback } from 'react';

interface UpdateEvent {
  type: 'price_update' | 'booking_update' | 'tracking_update' | 'service_update';
  data: any;
  timestamp: number;
}

interface UseRealTimeUpdatesOptions {
  enablePriceUpdates?: boolean;
  enableBookingUpdates?: boolean;
  enableTrackingUpdates?: boolean;
  enableServiceUpdates?: boolean;
  updateInterval?: number;
}

export const useRealTimeUpdates = (options: UseRealTimeUpdatesOptions = {}) => {
  const {
    enablePriceUpdates = true,
    enableBookingUpdates = true,
    enableTrackingUpdates = true,
    enableServiceUpdates = true,
    updateInterval = 30000 // 30 seconds
  } = options;

  const [updates, setUpdates] = useState<UpdateEvent[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<number>(Date.now());

  // Simulate real-time updates
  const simulateUpdate = useCallback(() => {
    const updateTypes: UpdateEvent['type'][] = [];
    
    if (enablePriceUpdates) updateTypes.push('price_update');
    if (enableBookingUpdates) updateTypes.push('booking_update');
    if (enableTrackingUpdates) updateTypes.push('tracking_update');
    if (enableServiceUpdates) updateTypes.push('service_update');

    if (updateTypes.length === 0) return;

    const randomType = updateTypes[Math.floor(Math.random() * updateTypes.length)];
    const timestamp = Date.now();

    let updateData: any = {};

    switch (randomType) {
      case 'price_update':
        updateData = {
          fuel_surcharge_adjustment: Math.random() > 0.5 ? 5 : -5,
          zone_pricing_update: {
            zone: ['zone1', 'zone2', 'zone3'][Math.floor(Math.random() * 3)],
            adjustment: Math.random() > 0.5 ? 1.05 : 0.95
          }
        };
        break;
      
      case 'booking_update':
        updateData = {
          booking_id: `QL${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
          status: ['confirmed', 'picked_up', 'in_transit'][Math.floor(Math.random() * 3)],
          estimated_delivery: new Date(Date.now() + Math.random() * 86400000).toISOString()
        };
        break;
      
      case 'tracking_update':
        updateData = {
          tracking_id: `QL${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
          location: ['Colombo Hub', 'Kandy Distribution', 'Galle Sorting'][Math.floor(Math.random() * 3)],
          status: ['in_transit', 'out_for_delivery', 'delivered'][Math.floor(Math.random() * 3)]
        };
        break;
      
      case 'service_update':
        updateData = {
          service_type: ['same_day', 'overnight', 'standard'][Math.floor(Math.random() * 3)],
          availability: Math.random() > 0.2,
          delay_minutes: Math.random() > 0.8 ? Math.floor(Math.random() * 60) : 0
        };
        break;
    }

    const newUpdate: UpdateEvent = {
      type: randomType,
      data: updateData,
      timestamp
    };

    setUpdates(prev => [newUpdate, ...prev.slice(0, 49)]); // Keep last 50 updates
    setLastUpdate(timestamp);

    // Broadcast update to other components
    window.dispatchEvent(new CustomEvent('quicklanka_update', {
      detail: newUpdate
    }));

  }, [enablePriceUpdates, enableBookingUpdates, enableTrackingUpdates, enableServiceUpdates]);

  // Connection simulation
  useEffect(() => {
    setIsConnected(true);
    
    const interval = setInterval(simulateUpdate, updateInterval);
    
    return () => {
      clearInterval(interval);
      setIsConnected(false);
    };
  }, [simulateUpdate, updateInterval]);

  // Subscribe to updates from other components
  useEffect(() => {
    const handleUpdate = (event: CustomEvent<UpdateEvent>) => {
      setUpdates(prev => {
        const exists = prev.some(u => 
          u.type === event.detail.type && 
          u.timestamp === event.detail.timestamp
        );
        
        if (!exists) {
          return [event.detail, ...prev.slice(0, 49)];
        }
        return prev;
      });
    };

    window.addEventListener('quicklanka_update', handleUpdate as EventListener);
    
    return () => {
      window.removeEventListener('quicklanka_update', handleUpdate as EventListener);
    };
  }, []);

  // Broadcast update manually
  const broadcastUpdate = useCallback((type: UpdateEvent['type'], data: any) => {
    const update: UpdateEvent = {
      type,
      data,
      timestamp: Date.now()
    };

    setUpdates(prev => [update, ...prev.slice(0, 49)]);
    setLastUpdate(update.timestamp);

    window.dispatchEvent(new CustomEvent('quicklanka_update', {
      detail: update
    }));
  }, []);

  // Get updates by type
  const getUpdatesByType = useCallback((type: UpdateEvent['type']) => {
    return updates.filter(update => update.type === type);
  }, [updates]);

  // Get latest update by type
  const getLatestUpdate = useCallback((type: UpdateEvent['type']) => {
    return updates.find(update => update.type === type);
  }, [updates]);

  // Clear updates
  const clearUpdates = useCallback(() => {
    setUpdates([]);
  }, []);

  return {
    updates,
    isConnected,
    lastUpdate,
    broadcastUpdate,
    getUpdatesByType,
    getLatestUpdate,
    clearUpdates
  };
};

export default useRealTimeUpdates;
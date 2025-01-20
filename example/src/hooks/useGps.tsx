import { useState, useCallback } from 'react';
import { NativeEventEmitter, NativeModules } from 'react-native';
import { startLocationUpdates, stopGpsUpdates } from 'rn-gps';
import { requestLocationPermission } from '../hooks/usePermission';

interface Location {
  latitude: number;
  longitude: number;
  accuracy: number;
  altitude: number;
  speed: number;
  timestamp: number;
}

const gpsEventEmitter = new NativeEventEmitter(NativeModules.RnGps);

export const useGps = () => {
  const [location, setLocation] = useState<Location | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isTracking, setIsTracking] = useState(false);

  const startTracking = useCallback(async () => {
    try {
      const hasPermission = await requestLocationPermission();
      console.log('Permission:', hasPermission);
      if (!hasPermission) {
        setError('Permission denied');
        return;
      }

      setIsTracking(true);
      setError(null);

      // Add listeners to update state
      const locationListener = gpsEventEmitter.addListener(
        'onLocationUpdate',
        (location: string) => {
          try {
            const coordinates: Location = JSON.parse(location);
            console.log('Location:', coordinates);
            setLocation(coordinates);
          } catch (e) {
            setError('Error processing location');
          }
        }
      );

      const errorListener = gpsEventEmitter.addListener(
        'onLocationError',
        (error: string) => {
          setError(error);
          setIsTracking(false);
        }
      );

      // Call native function to start tracking
      startLocationUpdates(
        7000, // interval for location updates in milliseconds
        0.0 // minimum distance between location updates in meters
      );

      return () => {
        locationListener.remove();
        errorListener.remove();
      };
    } catch (err) {
      setError('Error starting tracking');
      setIsTracking(false);
    }
  }, []);

  const stopTracking = useCallback(() => {
    try {
      // Stop native tracking
      try {
        stopGpsUpdates();
      } catch (err) {
        console.error('Error stopping tracking:', err);
      }

      // Remove listeners
      gpsEventEmitter.removeAllListeners('onLocationUpdate');
      gpsEventEmitter.removeAllListeners('onLocationError');

      // Update state
      setIsTracking(false);
      setLocation(null);
      setError(null);
    } catch (err) {
      console.error('Error stopping tracking:', err);
    }
  }, []);

  return {
    location,
    error,
    isTracking,
    startTracking,
    stopTracking,
  };
};

// hooks/usePermissions.js
import { PermissionsAndroid } from 'react-native';

export const requestLocationPermission = async (): Promise<boolean> => {
  try {
    const permission = PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION;
    if (!permission) {
      throw new Error('Permission not found');
    }
    const granted = await PermissionsAndroid.request(permission);
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  } catch (err) {
    console.error('Error requesting location permission:', err);
    return false;
  }
};

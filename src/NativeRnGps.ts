import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  startLocationUpdates(
    updateInterval: number, // in miliseconds
    minDistance: number     // in meters
  ): void;
  stopGpsUpdates(): void;
}

export default TurboModuleRegistry.getEnforcing<Spec>('RnGps');

import RnGps from './NativeRnGps';

export function startLocationUpdates(updateInterval: number, minDistance: number): void {
  RnGps.startLocationUpdates(updateInterval, minDistance);
}

export function stopGpsUpdates(): void {
  RnGps.stopGpsUpdates();
}

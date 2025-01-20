import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useGps } from './hooks/useGps';

export default function App() {
  const { location, error, isTracking, startTracking, stopTracking } = useGps();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>GPS Tracker</Text>

      <View style={styles.locationContainer}>
        {location ? (
          <Text style={styles.locationText}>
            Latitude: {location.latitude}{'\n'}
            Longitude: {location.longitude}
          </Text>
        ) : (
          <Text style={styles.locationText}>No location data available</Text>
        )}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, isTracking ? styles.buttonTracking : styles.buttonStart]}
          onPress={startTracking}
        >
          <Text style={styles.buttonText}>{isTracking ? 'Tracking...' : 'Start Tracking'}</Text>
        </TouchableOpacity>
        
        <View style={styles.separate} />

        <TouchableOpacity
          style={[styles.button, isTracking ? styles.buttonStop : styles.buttonDisabled]}
          onPress={stopTracking}
          disabled={!isTracking}
        >
          <Text style={styles.buttonText}>Stop Tracking</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
    backgroundColor: '#f7f7f7',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  locationContainer: {
    marginBottom: 30,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 5 },
    alignItems: 'center',
    width: '100%',
    maxWidth: 350,
  },
  locationText: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  separate: {
    margin: 10,
  },
  button: {
    width: '80%',
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonStart: {
    backgroundColor: '#4CAF50',
  },
  buttonTracking: {
    backgroundColor: '#2196F3',
  },
  buttonStop: {
    backgroundColor: '#F44336',
  },
  buttonDisabled: {
    backgroundColor: '#BDBDBD',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
});

import { useEffect } from 'react';
import { View, StyleSheet, Button } from 'react-native';
import { useGps } from './hooks/useGps';

export default function App() {
  const { location, error, isTracking, startTracking, stopTracking } = useGps();

  useEffect(() => {
    console.log('Error:', error);
  }, [error]);

  return (
    <View style={styles.container}>
      <Button
        color={isTracking ? 'blue' : 'green'}
        title={isTracking ? 'Tracking...' : 'Start tracking'}
        onPress={startTracking}
      />
      <View style={styles.separate} />
      <Button
        color={isTracking ? 'red' : 'gray'}
        title="Stop tracking"
        onPress={stopTracking}
        disabled={isTracking ? false : true}
        />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  separate: {
    margin: 10,
  },
});

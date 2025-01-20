
# rn-gps

Este módulo fornece funcionalidade para acessar e obter atualizações de localização no dispositivo Android usando o GPS. Ele permite iniciar e parar atualizações de localização, bem como obter dados de localização em tempo real.

## Instalação

Para integrar o módulo ao seu projeto React Native, siga estas etapas:

1. **Adicione o módulo ao seu projeto:**

   No diretório do seu projeto React Native, adicione o código Java ou importe a biblioteca que implementa o `rn-gps`.

2. **Adicione permissões no `AndroidManifest.xml`:**

   Para que o aplicativo tenha acesso à localização do dispositivo, adicione as permissões abaixo no arquivo `AndroidManifest.xml`:

   ```xml
   <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
   <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
   ```

## Uso

### Iniciar as atualizações de localização

Você pode iniciar as atualizações de localização chamando o método `startLocationUpdates`, que fornece os dados de localização em tempo real e os envia como uma string JSON.

### Parar as atualizações de localização

Quando você não precisar mais das atualizações de localização, pode parar as atualizações chamando `stopGpsUpdates()`.

#### Exemplo de uso em JavaScript (React Native):

```javascript
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

```

## Descrição dos métodos

- **`startLocationUpdates(updateInterval, minDistance)`**
  - Inicia as atualizações de localização.
  - `updateInterval` (número): intervalo entre as atualizações em milissegundos.
  - `minDistance` (número): distância mínima (em metros) entre as atualizações.

- **`stopGpsUpdates()`**
  - Para as atualizações de localização.

## Permissões necessárias

Este módulo requer permissões de localização para acessar as informações de GPS do dispositivo. Certifique-se de adicionar as permissões apropriadas no arquivo `AndroidManifest.xml` como mencionado acima.

## Modo Avião
O módulo funciona corretamente mesmo quando o modo avião está ativado no dispositivo. Isso ocorre porque ele utiliza o GPS, que não é afetado pela configuração do modo avião.

## Exemplo de Resposta de Localização

A resposta do método `resolve` será uma string JSON com os seguintes campos:

```json
{
  "latitude": 40.7128,
  "longitude": -74.0060,
  "accuracy": 10.0,
  "altitude": 5.0,
  "speed": 0.0,
  "timestamp": 1629876543000
}
```

- **`latitude`**: Latitude da posição.
- **`longitude`**: Longitude da posição.
- **`accuracy`**: Precisão da localização em metros.
- **`altitude`**: Altitude em metros.
- **`speed`**: Velocidade do dispositivo em metros por segundo.
- **`timestamp`**: Horário da leitura da localização (em milissegundos desde a época).

## Contribuindo

Se você deseja contribuir com melhorias para o `rn-gps`, sinta-se à vontade para fazer um fork deste repositório e enviar um pull request com suas alterações.
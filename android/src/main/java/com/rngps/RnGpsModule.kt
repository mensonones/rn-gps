package com.rngps

import android.Manifest
import android.content.Context
import android.content.pm.PackageManager
import android.location.Location
import android.location.LocationListener
import android.location.LocationManager
import android.os.Bundle
import androidx.core.content.ContextCompat
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.module.annotations.ReactModule
import org.json.JSONObject
import com.facebook.react.modules.core.DeviceEventManagerModule
import java.lang.ref.WeakReference

@ReactModule(name = RnGpsModule.NAME)
class RnGpsModule(reactContext: ReactApplicationContext) : NativeRnGpsSpec(reactContext) {

  private var locationManager: LocationManager? = null
  private var locationListenerRef: WeakReference<LocationListener>? = null
  private val tag = "RnGpsModule"
  private var isLocationUpdatesRunning = false

  companion object {
      const val NAME = "RnGps"
  }

  override fun getName(): String {
      return NAME
  }

  override fun startLocationUpdates(updateInterval: Double, minDistance: Double) {
      if (isLocationUpdatesRunning) {
          emitEvent("onLocationError", "Location updates already running")
          return
      }

      locationManager = reactApplicationContext.getSystemService(Context.LOCATION_SERVICE) as LocationManager?
      if (locationManager == null) {
          emitEvent("onLocationError", "Location manager is null")
          return
      }

      if (!locationManager!!.isProviderEnabled(LocationManager.GPS_PROVIDER)) {
          emitEvent("onLocationError", "GPS provider is disabled")
          return
      }

      if (!hasLocationPermission()) {
          emitEvent("onLocationError", "Location permission not granted")
          return
      }

      val interval = updateInterval.takeIf { it > 0 } ?: 15000.0
      val distance = minDistance.takeIf { it >= 0 } ?: 0.0

      isLocationUpdatesRunning = true
      startGpsUpdates(interval, distance)
  }

  private fun startGpsUpdates(updateInterval: Double, minDistance: Double) {
      val locationListener = object : LocationListener {
          override fun onLocationChanged(location: Location) {
              try {
                  val coordinates = mapOf(
                      "latitude" to location.latitude,
                      "longitude" to location.longitude,
                      "accuracy" to location.accuracy,
                      "altitude" to location.altitude,
                      "speed" to location.speed,
                      "timestamp" to location.time
                  )
                  emitEvent("onLocationUpdate", JSONObject(coordinates).toString())
              } catch (e: Exception) {
                  emitEvent("onLocationError", "Error processing location: ${e.message}")
              }
          }

          override fun onProviderEnabled(provider: String) {
              emitEvent("onLocationUpdate", "GPS enabled")
          }

          override fun onProviderDisabled(provider: String) {
              emitEvent("onLocationUpdate", "GPS provider disabled")
          }
      }

      locationListenerRef = WeakReference(locationListener)
      try {
          locationManager?.requestLocationUpdates(
              LocationManager.GPS_PROVIDER,
              updateInterval.toLong().coerceAtLeast(0),
              minDistance.toFloat(),
              locationListener
          )
      } catch (e: SecurityException) {
          emitEvent("onLocationError", "Security error: ${e.message}")
      }
  }

  private fun emitEvent(eventName: String, data: String) {
      reactApplicationContext
          .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
          .emit(eventName, data)
  }

  private fun hasLocationPermission(): Boolean {
      val fineLocationPermission = ContextCompat.checkSelfPermission(
          reactApplicationContext,
          Manifest.permission.ACCESS_FINE_LOCATION
      )
      val coarseLocationPermission = ContextCompat.checkSelfPermission(
          reactApplicationContext,
          Manifest.permission.ACCESS_COARSE_LOCATION
      )
      return fineLocationPermission == PackageManager.PERMISSION_GRANTED ||
              coarseLocationPermission == PackageManager.PERMISSION_GRANTED
  }

  override fun stopGpsUpdates() {
      locationListenerRef?.get()?.let { locationListener ->
          locationManager?.removeUpdates(locationListener)
      }
      locationListenerRef = null
      isLocationUpdatesRunning = false
  }
}
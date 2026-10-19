# Location Manager

Before starting tracking location using Asset SDK, you need to request location permissions using `LocationPermissionsManager.requestLocationPermissions()`

## Required permissions

```xml
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />

// API level >= 29
<uses-permission android:name="android.permission.ACCESS_BACKGROUND_LOCATION" />
```

Check if all requested permissions are granted

- Fine location or Coarse location permission is Checked

  ```java
  LocationPermissionsManager.areAllLocationPermissionGranted(this)
  ```

You can request Fine Location and Coarse location permissions using **permissionsManager.requestLocationPermissions(this)** and handle the permission result in the _onRequestPermissionsResult_ callback.

- Request Fine location and Coarse location permissions first

  ```kotlin
  permissionsManager?.requestLocationPermissions(this)
  ```

- Handle the permission result

  ```kotlin
  override fun onRequestPermissionsResult(
      requestCode: Int,
      permissions: Array<String>,
      grantResults: IntArray
  ) {
      super.onRequestPermissionsResult(requestCode, permissions, grantResults)
      permissionsManager?.onRequestPermissionsResult(requestCode, permissions, grantResults)
  }
  ```

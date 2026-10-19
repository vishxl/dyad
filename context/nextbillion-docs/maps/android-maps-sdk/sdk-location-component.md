# SDK Location Component

## Permissions

Access to the user's location information requires proper permissions. As per Android guidelines, it's important to provide a clear and comprehensive rationale to the user about how the location information will be used in the app. This can be achieved through presenting a permission request dialog.

For a more in-depth understanding of the permissions on Android, kindly refer to the official Android documentation: [Permissions on Android](https://developer.android.com/guide/topics/permissions/overview) and [Requesting Location Permissions](https://developer.android.com/training/location/permissions).

## User Location

To get the user’s location, we need to:

1. Retrieve an instance of LocationComponent
2. Build location request that specifies location accuracy and intervals
3. Implement LocationCallback
4. Get a location engine
5. Request for location updates
6. Receive location in the callback.
7. Display user location

### Retrieve LocationComponent

The LocationComponent in Android Maps SDK is an object that provides access to device's location information, including the latitude, longitude, and accuracy. To retrieve the LocationComponent, you need to access the associated NextbillionMap of a MapView. This can be done by calling the _getLocationComponent()_ method on the NextbillionMap instance. The returned _LocationComponent_ object can be used to get the device's current location information and configure various settings related to the location display on the map.

```
LocationComponent locationComponent = nextbillionMap.getLocationComponent();
```

### Build Location Request

The method **"buildEngineRequest"** builds and returns a **LocationEngineRequest** object. It takes two parameters, **"UPDATE_INTERVAL_IN_MILLISECONDS"** and **"FASTEST_UPDATE_INTERVAL_IN_MILLISECONDS"**, which set the desired frequency of location updates in milliseconds.

```
private static final long UPDATE_INTERVAL_IN_MILLISECONDS = 1000;
private static final long FASTEST_UPDATE_INTERVAL_IN_MILLISECONDS = 500;

private LocationEngineRequest buildEngineRequest() {
   return new LocationEngineRequest.Builder(UPDATE_INTERVAL_IN_MILLISECONDS)                .setPriority(LocationEngineRequest.PRIORITY_HIGH_ACCURACY)
.setFastestInterval(FASTEST_UPDATE_INTERVAL_IN_MILLISECONDS)
                .build();
    }
```

The **LocationEngineRequest** is built using the **LocationEngineRequest.Builder** class and the parameters set include a desired update interval of 1000 milliseconds and the highest accuracy priority, as well as the fastest possible interval of 500 milliseconds.
This LocationEngineRequest object is used to request location updates from the device's GPS.

For more details about the location update intervals, please refer to Google’s [LocationRequest](https://developers.google.com/android/reference/com/google/android/gms/location/LocationRequest).

### Implement LocationCallback

```
private static class NavigationLocationCallback implements LocationEngineCallback<LocationEngineResult> {

    @Override
    public void onSuccess(LocationEngineResult result) {
        Location location = result.getLastLocation();
        if (location == null) {
            return;
        }
        //this is where you handle the received location
        }
    }

    @Override
    public void onFailure(@NonNull Exception exception) {
        Timber.e(exception);
    }
}
```

This code defines an implementation of the LocationEngineCallback interface, which is used to receive the result of a location request. When the location request is successful, the onSuccess method is called with the LocationEngineResult that contains the last known location. The code checks if the location is null, if it is, the method returns. If the location is not null, the code handles the received location. In case of failure during the location request, the onFailure method is called with the exception that was thrown. The code logs the exception using the Timber library.

### Obtain LocationEngine and request for update

This code below obtains a **LocationEngine** instance and sets it up to receive location updates. The code calls the **LocationEngineProvider.getBestLocationEngine** method to get the best available location engine for the device, then builds a **LocationEngineRequest** with desired update interval and priority. Finally, the code requests location updates from the engine and also requests the last known location. The location updates and the last known location will be handled by the **NavigationLocationCallback** class, which implements the **LocationEngineCallback** interface.

```kotlin
private final NavigationLocationCallback callback = new NavigationLocationCallback(this);

private void obtainLocationEngine() {
        locationEngine = LocationEngineProvider.getBestLocationEngine(getApplicationContext());
        LocationEngineRequest request = buildEngineRequest();
        locationEngine.requestLocationUpdates(request, callback, null);
        locationEngine.getLastLocation(callback);
}

public void onResume() {
    super.onResume();
    mapView.onResume();
    if (locationEngine != null) {
        locationEngine.requestLocationUpdates(buildEngineRequest(), callback, null);
    }
}

@Override
public void onPause() {
    super.onPause();
    mapView.onPause();
    if (locationEngine != null) {
        locationEngine.removeLocationUpdates(callback);
    }
}
```

### Receive location and display

As mentioned previously, we will receive location in LocationCallback, after we receive the latest location, we can pass it to LocationComponent

```
    @Override
    public void onSuccess(LocationEngineResult result) {
        Location location = result.getLastLocation();
        if (location == null) {
            return;
        }
        //this is where you handle the received location
        locationComponent.forceLocationUpdate(location);
        }
    }
```

This code is handling the successful receipt of a location in the **LocationEngineResult**. When the latest location is received, it is passed to the LocationComponent through the forceLocationUpdate method. This ensures that the LocationComponent is updated with the latest location information.

## Built-in Location Engine

As described in previous section, this is how we obtain an instance of location engine

```
LocationEngineProvider.getBestLocationEngine(getApplicationContext());
```

The LocationEngineProvider will check whether you have google service and decide which location engine to return.

There are two built-in Location engines:

- One is built on Google’s Fused location provider, but this will depend on the google location service.
- The other one uses Core Android Location, which doesn’t need external dependencies

#### How to check if there has a google location service:

Check if these two class names are on the classpath

- "com.google.android.gms.location.LocationServices"
- "com.google.android.gms.common.GoogleApiAvailability"

```
  /**
   * Checks if the class is on classpath
   * @param className of the class to check.
   * @return true if the class is on the classpath, false otherwise.
   */
  static boolean isOnClasspath(String className) {
    boolean isOnClassPath = true;
    try {
      Class.forName(className);
    } catch (ClassNotFoundException exception) {
      isOnClassPath = false;
    }
    return isOnClassPath;
  }
```

## Custom Location Engine

Developers are not limited to the built-in location engine, they can also build their implementations of the location engine, which means developers can build their location service or location simulation service to fulfill their business needs.

To create a custom location engine, you can choose to implement your location provider that returns an Android Location or choose to implement **LocationEngine**.

To request location from Nextbillion.AI’s LocationEngine, we need to instantiate the built-in _LocationEngineCallback_ and _LocationEngineRequest_, which means we need to handle the conversion between the actual location provider’s request, result, and callback in the custom implementation of _LocationEngine_.

(A location provider can be Core Android Location, Google Location Service, or other location service libraries.)

```
public interface LocationEngine {

  /**
   * Returns the most recent location currently available.
   * If a location is not available, which should happen very rarely, null will be returned.
   */
  @RequiresPermission(anyOf = {ACCESS_COARSE_LOCATION, ACCESS_FINE_LOCATION})
  void getLastLocation(@NonNull LocationEngineCallback<LocationEngineResult> callback) throws SecurityException;

  /**
   * Requests location updates with a callback on the specified Looper thread.
   */
  @RequiresPermission(anyOf = {ACCESS_COARSE_LOCATION, ACCESS_FINE_LOCATION})
  void requestLocationUpdates(@NonNull LocationEngineRequest request,
                              @NonNull LocationEngineCallback<LocationEngineResult> callback,
                              @Nullable Looper looper) throws SecurityException;

  /**
   * Requests location updates with callback on the specified PendingIntent.
   */
  @RequiresPermission(anyOf = {ACCESS_COARSE_LOCATION, ACCESS_FINE_LOCATION})
  void requestLocationUpdates(@NonNull LocationEngineRequest request,
                              PendingIntent pendingIntent) throws SecurityException;

  /**
   * Removes location updates for the given location engine callback.
   * It is recommended to remove location requests when the activity is in a paused or stopped state
   */
  void removeLocationUpdates(@NonNull LocationEngineCallback<LocationEngineResult> callback);

  /**
   * Removes location updates for the given pending intent.
   * It is recommended to remove location requests when the activity is in a paused or stopped state
   */
  void removeLocationUpdates(PendingIntent pendingIntent);
}
```

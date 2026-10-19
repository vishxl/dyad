# Location Component

The Location Component in NextBillion.ai's Flutter Maps SDK allows you to leverage user location data and implement location-based functionalities in your application. To utilize this feature, you need to configure location permissions for both Android and iOS platforms.

## Configuration permissions

You need to grant location permission in order to use the location component of the NB Maps Flutter Plugin, declare the permission for both platforms:

### Android

Add the following permissions to the `AndroidManifest.xml` file:

```xml
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
```

### iOS

The **Info.plist** file needs to be explicitly configured in order to ensure the seamless and transparent integration of location-based features within your iOS application.

The _NSLocationWhenInUseUsageDescription_ and _NSLocationAlwaysUsageDescription_ keys must be defined in your **Info.plist** file, which is located in the Runner folder of your Flutter project. These keys give users a clear and concise explanation of why your app requires access to their location data. This proactive approach promotes transparency and trust among your app's users.

```xml
 <key>NSLocationWhenInUseUsageDescription</key>
    <string>[Your explanation here]</string>
<key>NSLocationAlwaysUsageDescription</key>
    <string>[Your explanation here]</string>
```

Replace _\[Your explanation here\]_ with a brief but informative description of why your app requires access to the user's location data. This description should clearly communicate the value that users will receive by granting this access.

## Checking and Granting Permissions

Before using location-related functionalities in your Flutter app, check if the app has location permissions, and request permission if it has not been granted yet.

## Enable Location Tracking

To enable location tracking and display the user's location on the map, you can set the following properties when creating the **NBMap** widget:

- _trackCameraPosition:_ Set to **true** to track the map camera's position based on the user's location.

- _myLocationEnabled:_ Set to **true** to display the user's location on the map.

- _myLocationTrackingMode:_ Set to `MyLocationTrackingMode.Tracking` to continuously update the user's location on the map as they move.

## Observe User Location Updating

You can observe the user's location updates using the `onUserLocationUpdated` callback. Whenever the user's location is updated, this callback function will be invoked with the updated `UserLocation`.

## Example

```dart
NBMap(
     onMapCreated: _onMapCreated,
     initialCameraPosition: const CameraPosition(
            target: LatLng(-33.852, 151.211),
            zoom: 14.0,
          ),
     trackCameraPosition: true,
     myLocationEnabled: true,
     myLocationTrackingMode: MyLocationTrackingMode.Tracking,
     onUserLocationUpdated: (userLocation) {
       // Handle the user’s updated location here
      },
)
```

In this example, the **NBMap** widget is configured to enable location tracking and display the user's location on the map. The `onUserLocationUpdated` callback is defined to receive the user's location updates and perform any necessary actions accordingly.

By implementing the Location Component, your application can effectively utilize user location data, enabling location-based features and enhancing the overall user experience.

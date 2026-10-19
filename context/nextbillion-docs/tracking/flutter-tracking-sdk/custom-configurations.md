# Custom Configurations

Tailor the Flutter Tracking SDK to your specific needs by implementing custom configurations. Customize default settings, notification preferences for Android and iOS, location tracking parameters, and data tracking options as described below:

## Default Configuration(Optional)

Create a default configuration object if you want to customize default settings within the SDK.

```dart
DefaultConfig defaultConfig = DefaultConfig();
await assetTracking.setDefaultConfig(config: defaultConfig);
```

## Android Notification Configuration(Optional)

Customize Android notification settings to tailor the appearance and behavior of notifications on Android devices.

```dart
AndroidNotificationConfig androidConfig = AndroidNotificationConfig();
await assetTracking.setAndroidNotificationConfig(config: androidConfig);
```

## iOS Notification Configuration(Optional)

Configure iOS notification settings based on your application’s requirements for optimal user experience on iOS devices.

```dart
IOSNotificationConfig iosConfig = IOSNotificationConfig();
await assetTracking.setIOSNotificationConfig(config: iosConfig);
```

## Location Configuration(Optional)

Adjust location tracking settings according to your preferences.

```dart
LocationConfig locationConfig = LocationConfig();
await assetTracking.setLocationConfig(config: locationConfig);
```

## Data Tracking Configuration(Optional)

Customize data tracking settings as needed to gather information about asset activity and usage.

```dart
DataTrackingConfig dataTrackingConfig = DataTrackingConfig();
await assetTracking.setDataTrackingConfig(config: dataTrackingConfig);
```

## Event Listeners

Register event listeners to receive updates on tracking activities. Implement the following concrete listener class to handle location updates, tracking start and stop events.

```dart
class ConcreteTrackingListener implements OnTrackingDataCallBack {
  @override
  void onLocationSuccess(NBLocation location) {
    print('Location update successful: $location');
    // Handle successful location update logic here
  }

  @override
  void onLocationFailure(String message) {
    print('Location update failed: $message');
    // Handle location update failure logic here
  }

  @override
  void onTrackingStart(String assetId) {
    print('Tracking started for asset: $assetId');
    // Handle tracking start logic here
  }

  @override
  void onTrackingStop(String assetId) {
    print('Tracking stopped for asset: $assetId');
    // Handle tracking stop logic here
  }
}

// Create an instance of the concrete listener
ConcreteTrackingListener concreteListener = ConcreteTrackingListener();

// Add a listener
assetTracking.addDataListener(concreteListener);

// Remove a listener
assetTracking.removeDataListener(concreteListener);
```

Implement these configurations and event listeners to tailor the Flutter Tracking SDK to your application's unique requirements, providing flexibility and control over tracking behavior and notifications.

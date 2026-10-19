# Getting Started

To begin your journey with NextBillion.ai's Flutter Tracking SDK, make sure you have met the necessary prerequisites, as outlined in the Prerequisites section. Then, proceed with the step-by-step installation instructions to integrate the SDK into your application.

## Prerequisites

Before integrating the SDK into your application, ensure that your development environment meets the following prerequisites:

1.  **NextBillion.ai API Key**: To utilize NextBillion.ai's Flutter Asset Tracking SDK, developers must obtain an API key. This key serves as the authentication mechanism for accessing the SDK's features and functionalities.
2.  **Platform Requirements:**
    - **Android**: The minimum supported Android SDK version for using the Asset Tracking Flutter SDK is API level 21 (Android 5.0, "Lollipop") or higher.
    - **iOS**: The SDK is compatible with iOS 11 or later versions.

3.  **Flutter Compatibility:** The Asset Tracking Flutter SDK requires Flutter version 3.3.0 or higher to ensure seamless integration and optimal performance with the Flutter framework.
4.  **CocoaPods:** For iOS projects, the SDK requires CocoaPods version 1.11.3 or newer to manage dependencies effectively and ensure proper integration with iOS projects.

## Installation

To use this library, add the following dependency to your pubspec.yaml file:

```yaml
dependencies:
  nb_asset_tracking_flutter: ^<version_number>
```

Replace <version_number\> with the desired version of the library. For the latest version, please check out the [Flutter Asset Tracking Plugin](https://pub.dev/packages/nb_asset_tracking_flutter)

## Required Permissions

To ensure the proper functioning of NextBillion.ai's Flutter Asset Tracking SDK, grant location permissions and declare them for both Android and iOS platforms.

### Android

```xml
  <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
  <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
  <uses-permission android:name="android.permission.ACCESS_BACKGROUND_LOCATION" />
  <uses-permission android:name="android.permission.INTERNET" />
  <uses-permission android:name="android.permission.FOREGROUND_SERVICE"/>
```

The `ACCESS_FINE_LOCATION`, `ACCESS_COARSE_LOCATION` and `ACCESS_BACKGROUND_LOCATION` permissions allow the app to access the user's location, The `FOREGROUND_SERVICE` permission is necessary for background location updates and foreground services. And the `INTERNET` permission allows the app to access the internet.

### iOS

#### Getting Location Access

Define the following keys in your `Info.plist` file, located in the Runner folder of your Flutter project.

```xml
<key>NSLocationWhenInUseUsageDescription</key>
<string>[Your explanation here]</string>
<key>NSLocationAlwaysUsageDescription</key>
<string>[Your explanation here]</string>
```

Replace \[Your explanation here\] with a brief but informative description of why your app requires access to the user's location data. This description should clearly communicate the value that users will receive by granting this access.

These keys give users a clear and concise explanation of why your app requires access to their location data. This proactive approach promotes transparency and trust among your app's users.

#### Enabling Background Location Updates

Define the `UIBackgroundModes` key to enable location updates even when your app is running in the background. The location value is specified within this key, indicating that your app intends to use background location services. In addition, an audio mode is included to ensure that your app continues to receive location updates while audio services are active.

```xml
<key>UIBackgroundModes</key>
<array>
<string>location</string>
<string>audio</string>
</array>
```

This setting enables your app to keep accurate location data even when it is not actively in the foreground, resulting in a more seamless user experience for location-based functionalities.

By configuring these elements within your `Info.plist` file, you ensure that your application complies with privacy regulations, respects user preferences, and provides the best possible experience when utilizing location-based features, both in the foreground and background.

# Getting Started

In the following sections of this documentation, we will guide you through the installation process, step-by-step implementation, and usage of Nextbillion.ai's Flutter Navigation SDK. Whether you are a seasoned Flutter developer or just getting started, this documentation will serve as your comprehensive guide to utilizing our Navigation SDK effectively.

## Prerequisites

Before integrating the SDK into your application, ensure that your development environment meets the following prerequisites:

**Access Key:** To utilize Nextbillion.ai's Flutter Navigation SDK, developers must obtain an access key, which serves as the authentication mechanism for accessing the SDK's features and functionalities.

**Platform Requirements:**

- **Android:** The minimum supported Android SDK version for using the Flutter Navigation SDK is API level 19 (Android 4.4, "KitKat") or higher.
- **iOS:** The SDK is compatible with iOS 12 or later versions.

**Flutter Compatibility:** The Flutter Navigation SDK requires Flutter version 3.5.0 or higher to ensure seamless integration and optimal performance with the Flutter framework.

**CocoaPods:** For iOS projects, the SDK requires CocoaPods version 1.11.3 or newer to manage dependencies effectively and ensure proper integration with iOS projects.

**Build Configuration**: Developers need to ensure that the **Build Libraries for Distribution** option, available under build settings, is set to `No`. This configuration is crucial to prevent potential distribution issues when packaging the application for distribution or release.

![documentation image](https://static.nextbillion.io/docs-next/docs/navigation/flutter/image1.webp)

## Installation

To install NextBillion.ai's Flutter Navigation SDK into your Flutter project, follow the steps below:

### Step 1: Add Dependency

Add the following dependency to your project's `pubspec.yaml` file, replacing `{version}` with the actual version of the SDK that you want to use. For the latest version, check out the [Flutter Navigation Plugin](https://pub.dev/packages/nb_navigation_flutter/versions)

```yaml
dependencies:
  nb_navigation_flutter: { version }
```

Ensure that you have the correct version specified to utilize the latest features and improvements.

### Step 2: Import the Plugin

In your Dart code, Import the Navigation plugin to access its functionalities:

```dart
import 'package:nb_navigation_flutter/nb_navigation_flutter.dart';
```

### Step 3: Initialization

To run the Maps Flutter Plugin you will need to configure the NB Maps Token at the beginning of your Flutter app using NextBillion.initNextBillion(_YOUR_ACCESS_KEY_). Obtain your access key from NextBillion.ai and initialize it as follows:

```dart
import 'package:nb_maps_flutter/nb_maps_flutter.dart';
import 'package:nb_navigation_flutter/nb_navigation_flutter.dart';

class _NavigationDemoState extends State<NavigationDemo> {
  @override
  void initState() {
    super.initState();
    NextBillion.initNextBillion(YOUR_ACCESS_KEY);
  }
}
```

Replace `YOUR_ACCESS_KEY` with the access key provided to you by NextBillion.ai. This initialization step is essential to authenticate your app and enable seamless communication with NextBillion.ai's services.

## Required Permissions

To ensure the proper functioning of NextBillion.ai's Flutter Navigation SDK, you need to grant location permissions and declare them for both Android and iOS platforms.

### Android

Add the following permissions to the **AndroidManifest.xml** file:

```xml
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
<uses-permission android:name="android.permission.FOREGROUND_SERVICE"/>

<uses-permission android:name="android.permission.FOREGROUND_SERVICE_LOCATION"/>
<uses-permission android:name="android.permission.INTERNET" />

<uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
<uses-permission android:name="android.permission.ACCESS_BACKGROUND_LOCATION" />
```

The ACCESS_FINE_LOCATION and ACCESS_COARSE_LOCATION permissions allow the app to access the user's location, and the FOREGROUND_SERVICE permission is necessary for background location updates and navigation services.

The POST_NOTIFICATIONS is a runtime permission when you target Android 13 or higher for sending non-exempt notifications from the foreground service. The ACCESS_BACKGROUND_LOCATION permission is needed to be declared in the app's manifest in order to [request background location access](https://developer.android.com/develop/sensors-and-location/location/permissions/background) at runtime on Android 10 and higher

**Requesting Location Runtime Permissions (Foreground and Background) in Android 6.0 and Above**

For Android 6.0 (API 23) and above, you need to dynamically request permissions. Below is how to request location permissions with permission_handler, including foreground and background permissions:

```java
import 'package:permission_handler/permission_handler.dart';

Future<void> checkAndRequestLocationPermissions() async {
  // Request foreground location permission
  PermissionStatus status = await Permission.location.request();

  if (status.isGranted) {
    // If foreground location permission is granted, further request background location permission
    // This permission is needed for Android 10 and above, if you need to continue updating navigation data when the app goes to the background
    PermissionStatus backgroundStatus = await Permission.locationAlways.request();

    if (!backgroundStatus.isGranted) {
      // If background location permission is denied, notify the user and exit
      print("Background location permission is required.");
      return;
    }
  } else {
    // If foreground location permission is denied, notify the user
    print("Foreground location permission is required.");
    return;
  }
}
```

**Requesting Notification Runtime Permission in Android 13 and Above For Android 13 (API 33) and above**, you need to dynamically request notification permissions if you want to show notifications while the app is in the background:

```java
Future<void> checkAndRequestNotificationPermission() async {
  // Check notification permission status
  PermissionStatus status = await Permission.notification.status;

  if (!status.isGranted) {
    // Request notification permission
    status = await Permission.notification.request();
    if (status.isGranted) {
      print("Notification permission granted.");
    } else {
      print("Notification permission denied.");
    }
  } else {
    print("Notification permission already granted.");
  }
}
```

### iOS

The **Info.plist** file needs to be explicitly configured in order to ensure the seamless and transparent integration of location-based features within your iOS application. This step not only ensures compliance with user privacy expectations but also allows your app to access location data while running in the background accurately.

The following are the key steps to correctly configure your Info.plist file:

#### Getting Location Access

The _NSLocationWhenInUseUsageDescription_ and _NSLocationAlwaysUsageDescription_ keys must be defined in your **Info.plist** file, which is located in the _Runner_ folder of your Flutter project. These keys give users a clear and concise explanation of why your app requires access to their location data. This proactive approach promotes transparency and trust among your app's users.

```xml
<key>NSLocationWhenInUseUsageDescription</key>
<string>[Your explanation here]</string>
<key>NSLocationAlwaysUsageDescription</key>
<string>[Your explanation here]</string>
```

Replace `[Your explanation here]` with a brief but informative description of why your app requires access to the user's location data. This description should clearly communicate the value that users will receive by granting this access.

#### Enabling Background Location Updates

The _UIBackgroundModes_ key must be defined to enable location updates even when your app is running in the background. The location value is specified within this key, indicating that your app intends to use background location services. In addition, an audio mode is included to ensure that your app continues to receive location updates while audio services are active.

```xml
<key>UIBackgroundModes</key>
<array>
   <string>location</string>
   <string>audio</string>
</array>
```

This setting enables your app to keep accurate location data even when it is not actively in the foreground, resulting in a more seamless user experience for location-based functionalities.

By configuring these elements meticulously within your **Info.plist** file, you ensure that your application complies with privacy regulations, respects user preferences, and provides the best possible experience when utilizing location-based features, both in the foreground and background.

### Checking and Granting Permissions

Before using location-related functionalities in your Flutter app, check if the app has location permissions, and request permission if it has not been granted yet.

By adhering to these steps, you ensure that your app has the necessary permissions to utilize the location component of NextBillion.ai's Flutter Navigation SDK effectively. This enables you to provide seamless and reliable navigation services and deliver an exceptional user experience to your app's users.

## Set up your Identity (Optional)

### Configure User ID

This feature allows developers to integrate their existing user ID system with the NextBillion SDK. The user ID will then be included in the user-agent header sent to the backend service.

To set a custom user ID from your account system, use the _NBNavigation.setUserId("Your-User-ID")_ method. You can retrieve the set user ID using _NBNavigation.getUserId()_. This method returns a promise that resolves to the ID if it's set, or null otherwise.

```dart
//Set the customize user id
NBNavigation.setUserId("Your-User-ID");
// Get the customize, if the user id haven't seated, the value is null
NBNavigation.getUserId().then((value) {
 // Your will get the user id here
});
```

### Retrieve Nextbillion ID

The SDK also generates a unique identifier called the NextBillion ID. You can retrieve the NextBillion ID using the _NBNavigation.getNBId()_ method. This method returns a promise that resolves to the ID.

```dart
NBNavigation.getNBId().then((value) {
   // Your will get the nextbillion id here
});
```

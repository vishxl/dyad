# Getting Started

To begin your journey with NextBillion.ai's Flutter Maps SDK, make sure you have met the necessary prerequisites, as outlined in the [Prerequisites](#prerequisites) section. Then, proceed with the step-by-step installation instructions to integrate the SDK into your Flutter project.

## Prerequisites

Before integrating the SDK into your application, ensure that your development environment meets the following prerequisites:

**Access Key:**

- Obtain a valid access key from our platform. This access key is essential for authentication and enables you to utilize the SDK's services.

**Platform Compatibility:**

- Android: The minimum supported `minSdkVersion` is 16+ or higher.
- iOS: The minimum supported version is iOS 11 or later.

**Flutter Framework:**

- The SDK requires Flutter version 3.10 or later to function properly within your Flutter application.

**CocoaPods (for iOS):**

- For iOS projects, ensure that CocoaPods version 1.11.3 or later is installed.

**Build Configuration (for iOS):**

- In your iOS project's build settings, set "Build Libraries for Distribution" to "No" to ensure the proper functioning of the SDK.

  ![documentation image](https://static.nextbillion.io/docs-next/docs/maps/flutter/image2.webp)

By meeting these prerequisites, you can guarantee a smooth and successful integration of our SDK into your application. These requirements have been established to ensure compatibility and optimal performance, enabling you to leverage the full potential of the SDK's features.

## Installation

To integrate NextBillion.ai's Flutter Maps SDK into your Flutter project, follow the steps below:

### Step 1: Add Dependency

Add the following dependency to your project's `pubspec.yaml` file, replacing `{version}` with the actual version of the SDK that you want to use, For the latest version, check out [the Fluter Maps Plugin](https://pub.dev/packages/nb_navigation_flutter/versions):

```yaml
dependencies:
  nb_maps_flutter: { version }
```

For the latest version, check out the [Fluter Maps Plugin](https://pub.dev/packages/nb_maps_flutter/versions). Ensure that you have the correct version specified to utilize the latest features and improvements.

### Step 2: Import the Plugin

In your Dart code, Import the maps plugin to access its functionalities:

```dart
import 'package:nb_maps_flutter/nb_maps_flutter.dart';
```

### Step 3: Initialization

To run the Maps Flutter Plugin you will need to configure the NB Maps Token at the beginning of your Flutter app using _NextBillion.initNextBillion(YOUR_ACCESS_KEY)_. Obtain your access key from NextBillion.ai and initialize it as follows:

```
 class _MapsDemoState extends State<MapsDemo> {
  @override
  void initState() {
    super.initState();
    NextBillion.initNextBillion(YOUR_ACCESS_KEY);
  }
}
```

Replace `YOUR_ACCESS_KEY` with the access key provided to you by NextBillion.ai. This initialization step is essential to authenticate your app and enable seamless communication with NextBillion.ai's services.

## NBMap Widget

The **NBMap** widget is the foundation of NextBillion.ai's Flutter Maps SDK, allowing you to seamlessly integrate interactive maps into your application. With this widget, you can define the initial camera position and respond to map creation events through the `onMapCreated` callback.

### Widget Creation

To create an **NBMap** widget with an initial camera position, use the following code snippet:

```dart
NBMap(
      onMapCreated: onMapCreated,
      initialCameraPosition: const CameraPosition(
           target: LatLng(-33.894372606072309, 151.17576679759523),
           zoom: 11.0,
  ),
)
```

### Widget Properties

- **onMapCreated:** This property accepts a callback function that is invoked when the map is created and ready for interaction. You can access the map controller through this callback to perform various map-related tasks.

- **initialCameraPosition:** Use this property to set the initial camera position of the map when it is first displayed. The `CameraPosition` class allows you to define the target coordinates (latitude and longitude) and the initial zoom level of the map.

### Example

Here's a quick example demonstrating the use of the **NBMap** widget:

```dart
class MyMapScreen extends StatefulWidget {
  @override
  _MyMapScreenState createState() => _MyMapScreenState();
}

class _MyMapScreenState extends State<MyMapScreen> {
  NextBillionMapController? mapController;

  void onMapCreated(NextBillionMapController controller) {
    mapController = controller;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('My Map Screen'),
      ),
      body: NBMap(
        onMapCreated: onMapCreated,
        initialCameraPosition: const CameraPosition(
          target: LatLng(-33.894372606072309, 151.17576679759523),
          zoom: 11.0,
        ),
      ),
    );
  }
}
```

In this example, the _MyMapScreen_ widget contains an **NBMap** widget, and the `onMapCreated` callback function stores the map controller in the `mapController` variable. This allows you to perform various map operations using the controller throughout your app's lifecycle.

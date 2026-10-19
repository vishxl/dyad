# Usage

Follow these steps to effectively use the Flutter Tracking SDK in your application.

## Import Necessary classes

Begin by importing the essential classes from the Flutter Tracking SDK package, ensuring that your application has access to the functionalities provided.

```dart
import 'package:nb_asset_tracking_flutter/asset_tracking.dart';
```

## Create an Instance of AssetTracking

Create an `AssetTracking` object to use the SDK's capabilities within your application. This instance serves as the entry point for accessing various tracking and asset management functionalities.

```dart
AssetTracking assetTracking = AssetTracking();
```

## Initialize the library with your API key

Initialize the SDK by providing your NextBillion.ai API key. This step establishes the necessary authentication for accessing the tracking features and functionalities within the SDK.

```dart
await assetTracking.initialize(apiKey: '<your_api_key>');
```

## Using SDK Methods

Once the Flutter Tracking SDK is initialized, you can seamlessly integrate asset management, location tracking, and notification configuration functionalities into your application with the following methods:

- **Create an Asset**

  Use this method to create a new asset, providing relevant profile information. The result includes a unique identifier for the newly created asset.

  ```dart
  // Create an asset
  AssetResult<String> assetResult = await assetTracking.createAsset(profile: assetProfile);
  ```

- **Bind an Asset**

  ```dart
  Bind an asset using this method, specifying a custom identifier. This step associates the asset with a unique identifier for efficient tracking.
  // Bind an asset
  AssetResult<String> bindResult = await assetTracking.bindAsset(customId: '<custom_id>');
  ```

- **Start Tracking**

  Initiate the tracking process using this method, enabling real-time location updates for the associated assets.

  ```dart
  // Start tracking
  await assetTracking.startTracking();
  ```

- **Retrieve Asset Details**

  Fetch comprehensive details about the tracked asset, providing valuable insights into its current status and location.

  ```dart
  // Get asset details
  AssetResult<Map> assetDetails = await assetTracking.getAssetDetail();
  ```

- **Stop Tracking**

  Terminate the tracking process when necessary, ceasing location updates for the associated assets.

  ```dart
  // Stop tracking
  await assetTracking.stopTracking();
  ```

Integrate these methods within your Flutter application to build a robust asset-tracking system with enhanced management, real-time location monitoring, and customizable notification configurations.

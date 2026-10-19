# Getting started

To begin your journey with NextBillion.ai's Asset Tracking iOS SDK, make sure you have met the necessary prerequisites, as outlined in the "Prerequisites" section. Then, proceed with the step-by-step installation instructions to integrate the SDK into your iOS project.

## Prerequisites

Before integrating the SDK into your application, ensure that your development environment meets the following prerequisites:

1.  **NextBillion.ai API Key**: Obtain a valid access key from our platform. This access key is essential for authentication and enables you to utilize the SDK's services.
2.  **Platform Compatibility**: Make sure you're using the right tools and versions:
    - **IDE**: Xcode 13.2.1 or a more recent version.
    - **Minimum Deployment Target**: iOS 11.0.

3.  Location Data Access Explanation: In your `Info.plist`, add the required location permission keys.

    ```xml
    <key>NSLocationWhenInUseUsageDescription</key>
    <string>[Your explanation here]</string>
    <key>NSLocationAlwaysAndWhenInUseUsageDescription</key>
    <string>[Your explanation here]</string>
    ```

By meeting these prerequisites, you can guarantee a smooth and successful integration of our SDK into your application. These requirements have been established to ensure compatibility and optimal performance, enabling you to leverage the full potential of the SDK's features.

## Installation

Installation steps are streamlined for faster integration, aligned with mainstream SDK docs (SPM-first, optional alternatives).

### Quick Integration (Recommended)

1.  Add SDK dependency (SPM recommended).
2.  Configure Info.plist permissions.
3.  Initialize SDK with apiKey.
4.  Create/Bind assets and start tracking.

### Install SDK via Carthage (Optional)

Carthage is kept for existing projects only. If your project already uses Carthage, keep using it. For new projects, use Swift Package Manager.

Carthage reference: [https://github.com/Carthage/Carthage#installing-carthage](https://github.com/Carthage/Carthage#installing-carthage)

#### Carthage Quick Steps

1.  Create Cartfile and add dependencies below:

    **Cartfile example:**

    ```bash
    binary "https://github.com/nextbillion-ai/nextbillion-asset-tracking-ios/releases/download/v1%2Fcarthage/NBAssetDataCollectLib.json" ~> 1.4.1
    binary "https://github.com/nextbillion-ai/nextbillion-asset-tracking-ios/releases/download/v1%2Fcarthage/NBAssetTracking.json" ~> 1.4.1
    ```

2.  Run Carthage update command below:

    ```bash
    carthage update --use-xcframeworks
    ```

3.  Link and embed listed frameworks in Xcode target

    ```bash
    NBAssetDataCollectLib
    NBAssetTracking
    ```

### Install SDK via Swift Package Manager (Recommended)

Recommended for all new integrations.

1.  In Xcode, go to `File` > `Add Package Dependencies...`.
2.  Enter package URL: [https://github.com/nextbillion-ai/asset-tracking-distribution](https://github.com/nextbillion-ai/asset-tracking-distribution)
3.  Add product `NBAssetTracking` to your app target (Version: 1.4.1 or Up to Next Major from 1.4.1).
4.  Import SDK: `import NBAssetTracking`.

### Install SDK via CocoaPods (Optional)

Use this only if your project already uses CocoaPods.

1.  Podfile example:

    ```ruby
    use_frameworks!
    target 'TargetNameForYourApp' do
        pod NextBillionAssetTracking, '1.4.1'
    end
    ```

2.  Run `pod repo update && pod install`, then open the `.xcworkspace` file.

After dependency installation, continue with [Initialization](#initialization) and [Asset Binding](#asset-binding-and-tracking) sections.

### Location Data Access Explanation

Add the following to the `Info.plist` to explain why you need access to the location data:

```xml
    <key>NSLocationAlwaysAndWhenInUseUsageDescription</key>
	<string>Request for location update</string>
	<key>NSLocationAlwaysUsageDescription</key>
	<string>Request for location update</string>
	<key>NSLocationWhenInUseUsageDescription</key>
	<string>Request for location update</string>
```

### Initialization

A common way to initialize the SDK is to put the following code in your _AppDelegate_, otherwise, please make sure you have called the code below before you start using any functionalities of the SDK.

```swift
let assetTracking = AssetTracking.shared

// Customize asset tracking configuration
// Enable notifications for asset status changes
// And Customize data tracking configuration

let notificationConfig = NotificationConfig()
notificationConfig.showAssetEnableNotification = true
notificationConfig.showLowBatteryNotification = true
assetTracking.setNotificationConfig(config: notificationConfig)

let dataTrackingConfig = DataTrackingConfig(baseUrl: "api.nextbillion.io", dataStorageSize: 5000, dataUploadingBatchSize: 30, dataUploadingBatchWindow: 20, shouldClearLocalDataWhenCollision: true)

assetTracking.setDataTrackingConfig(config: dataTrackingConfig)

assetTracking.initialize( Key: "YOUR_ACCESS_KEY")
```

Replace `YOUR_ACCESS_KEY` with the access key provided to you by NextBillion.ai. This initialization step is essential to authenticate your app and enable seamless communication with NextBillion.ai's services.

### Asset Binding and Tracking

To initiate asset binding and tracking with the NextBillion.ai iOS Tracking SDK, follow these steps:

#### Creating an Asset

If you don't have an asset yet, you can create one using the following API: AssetTracking.shared.createAsset(baseUrl, assetProfile, completionHandler, errorHandler)

Retrieve the _assetId_ from the API response.

Here's a sample class structure for handling the response:

```swift
open class AssetCreationResponse {
    public let status: String
    public let data: AssetCreationResponseData{
        public let id: String
    }
}
```

#### Binding the Asset to Your Device

Once you have the _assetId_, use the following API to bind the asset to your current device:

```swift
AssetTracking.shared.bindAsset(baseUrl, assetId, completionHandler, errorHandler)
```

After a successful binding, you're ready to start tracking the location of the asset.

#### Start and Stop Tracking

You have the flexibility to initiate or halt tracking on your device, with location tracking and uploading adhering to your predefined configurations:

To start data tracking:

```swift
// start data tracking
AssetTracking.shared.startTracking()
```

To stop data tracking:

```swift
// stop data tracking
AssetTracking.shared.stopTracking()
```

By following these steps, you'll effectively bind assets to your iOS device and commence location tracking as per your configuration settings. This allows you to seamlessly monitor and manage your assets using the NextBillion.ai iOS Tracking SDK.

# Configuration

Asset tracking SDK provides a variety of configuration methods, users can customize data reporting, location data collection, and notification during Asset tracking SDK initialization.

An example of the configuration module usage during SDK initialization is presented as follows:

```swift
let assetTracking = AssetTracking.shared

//init notificationConfig
let notificationConfig = NotificationConfig()
notificationConfig.showAssetEnableNotification = true
notificationConfig.showLowBatteryNotification = true
assetTracking.setNotificationConfig(config: notificationConfig)

let dataTrackingConfig = DataTrackingConfig(baseUrl: "api.nextbillion.io", dataStorageSize: 5000, dataUploadingBatchSize: 30, dataUploadingBatchWindow: 20, shouldClearLocalDataWhenCollision: true)

assetTracking.setDataTrackingConfig(config: dataTrackingConfig)

assetTracking.initialize(apiKey: "YOUR_ACCESS_KEY")
```

The classes corresponding to the configuration are:

- **DataTrackingConfig**: Data caching and reporting configuration
- **LocationConfig**: Location update configuration
- **NotificationConfig**: Notification configuration

The following methods are related to the configuration in this SDK:

```swift
/**
    * Set the location configuration.
    * Invoke before 'startTracking()'

    - Parameter config: The location configuration to set.
    */
AssetTracking.shared.setLocationConfig(config: LocationConfig)

/**
    * Update the location configuration.
    * Invoke after 'startTracking()'

    - Parameter config: The location configuration to be updated.
    */
AssetTracking.shared.updateLocationConfig(config: LocationConfig)

/**
    * Get the current LocationConfig of the Tracking SDK
    */
AssetTracking.shared.getLocationConfig()

/**
    * Set the data tracking configuration.
    * Invoke before 'startTracking()'

    - Parameter config: The data tracking configuration to be set.
    */
AssetTracking.shared.setDataTrackingConfig(config: DataTrackingConfig)

/**
    * Update the data tracking related configuration.
    * Invoke after 'startTracking()'

    - Parameter config: The data tracking configuration to be updated.
    */
AssetTracking.shared.updateDataTrackingConfig(config: DataTrackingConfig)

/*
    * Provide an interface to get the current data tracking config for other module to use
    */
AssetTracking.shared.getDataTrackingConfig()

/**
    * Set the Configuration of the notification
    * Invoke before 'startTracking()'

    - Parameter config: The data notification configuration to be set.
    */
AssetTracking.shared.setNotificationConfig(config: NotificationConfig)

/**
    * Update the Configuration of the notification
    * Invoke after 'startTracking()'

    - Parameter config: The data notification configuration to be updated.
    */
AssetTracking.shared.updateNotificationConfig(config: NotificationConfig)

/**
    * Get the current Notification config of the Tracking SDK
    */
AssetTracking.shared.getNotificationConfig()
```

## DataTrackingConfig

_DataTrackingConfig_ includes the following parameters that are configurable during SDK initialization:

```swift
open class DataTrackingConfig: NSObject {

    /*
     * BaseUrl that will be used in the asset tracking SDK.
     */
    private var baseUrl: String

    /*
     * The maximum data storage size that is allowed in the location data local cache.
     */
    private var dataStorageSize: Int

    /*
     * how many location data will be sent within one api call (maximum).
     * this should be configured according to your maximum data collection frequency
     * If inappropriate value is set, backend will receive data with huge delay
     * recommended value:
     *      dataUploadingBatchSize: 30
     *      dataUploadingBatchWindow: 20(seconds)
     */
    private var dataUploadingBatchSize: Int

    /*
     * the minimum time interval between two data uploading api call (in seconds)
     * this should be configured according to your maximum data collection frequency
     * If inappropriate value is set, backend will receive data with huge delay
     * recommended value:
     *      dataUploadingBatchSize: 30
     *      dataUploadingBatchWindow: 20(seconds)
     */
    private var dataUploadingBatchWindow: Int

    /*
     * determine whether to clear local data once assetId is taken by another device
     * If do not clear local cache, backend might receive dirty data
     * recommend to set as false only when user temporarily switch to another device
     * or any other condition that may fit your use case
     */
    private var shouldClearLocalDataWhenCollision: Bool
}
```

- **baseUrl** will be used for API related services.
- **dataStorageSize** is the maximum available local storage for the Asset Tracking SDK data caching (location record number in Int, default is 5000, each record contains dataUploadingBatchSize location data, and takes one API call to upload)
- **dataUploadingBatchSize** (default 30) and **dataUploadingBatchWindow**(in seconds, default 20 seconds) is for tracked location uploading. The SDK will upload data for every batch window, with no more than the batch size location data. So it is important to configure a proper value for this, otherwise, data will be uploaded with a huge delay.
- **shouldClearLocalDataWhenCollision** is the flag to control whether to clear local cached location data if assetId is taken by another device
  - If enabled, all the unsent location data will be cleared once asset id is taken, which may cause data loss
  - If disabled, unsent location data will remain cached and continue to upload once user rebinds, but this may cause dirty data issues.

## LocationConfig

The `LocationConfig` is used to configure the location tracking settings. It allows customization of various parameters that influence the behavior of location updates.

```swift
open class LocationConfig: NSObject {

    let trackingMode: TrackingMode

    /*
     *  distanceFilter
     *
     *  Discussion:
     *      Specifies the minimum update distance in meters. Client will not be notified of movements of less
     *      than the stated value, unless the accuracy has improved. Pass in kCLDistanceFilterNone to be
     *      notified of all movements. By default, 5 is used.
     */
    public var distanceFilter: Double = 5

    /*
     *  desiredAccuracy
     *
     *  Discussion:
     *      The desired location accuracy. The location service will try its best to achieve
     *      your desired accuracy. However, it is not guaranteed. To optimize
     *      power performance, be sure to specify an appropriate accuracy for your usage scenario (eg,
     *      use a large accuracy value when only a coarse location is needed). Use kCLLocationAccuracyBest to
     *      achieve the best possible accuracy. Use kCLLocationAccuracyBestForNavigation for navigation.
     *      The default value varies by platform.
     */
    public var desiredAccuracy: Double = kCLLocationAccuracyBest

    /*
     *  enableStationaryCheck
     *
     *  Discussion:
     *      Whether to enable stationary check for location data tracking
     *      Enable this will slightly increase battery consumption
     *      But will provide more accurate speed capture guidance
     */
    public var enableStationaryCheck: Bool = true

}
```

- **trackingMode**: Enumerates the tracking mode, which influences the frequency and accuracy of location updates. Options include _TrackingMode.ACTIVE_, _TrackingMode.BALANCED_ and _TrackingMode.PASSIVE_. For details, please refer to [Tracking Mode](/docs/tracking/sdk/ios-tracking/configuration#tracking-mode).
- **distanceFilter**: Specifies the minimum distance (in meters) that a device must move before a new location update is generated. Movement less than this distance will not trigger updates unless accuracy improves. The default is 5 meters.
- **desiredAccuracy**: Specifies the desired accuracy for location updates. The location service will attempt to achieve this accuracy, but it's not guaranteed. Options include _kCLLocationAccuracyBest_ for the best accuracy and _kCLLocationAccuracyBestForNavigation_ for navigation. Default values depend on the platform.
- **enableStationaryCheck**: Whether to enable stationary check when doing data tracking, enable this will increase battery consumption and the speed capturing accuracy

### Tracking Mode

Location Tracking Mode determines how frequently and accurately the location updates are obtained during tracking. There are three different tracking modes available:

| Tracking Mode | Accuracy                                 | Distance interval | Description                                                                                                                                                                                                                             |
| ------------- | ---------------------------------------- | ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ACTIVE        | High (the most accurate location)        | 5m                | This mode is suitable for applications that require precise and real-time location updates. It provides high accuracy at the cost of increased battery usage.                                                                           |
| BALANCED      | Medium (optimized for battery usage)     | 20m               | This mode strikes a balance between accuracy and battery usage. It provides moderately accurate location updates at a lower frequency, resulting in better battery performance compared to the active mode.                             |
| PASSIVE       | Low (​​coarse ~ 10 km accuracy location) | 100m              | This mode is designed for minimal battery consumption. It provides low-accuracy location updates at longer intervals, making it suitable for scenarios where periodic location updates are sufficient and power efficiency is critical. |

When selecting a tracking mode, you should consider the specific needs of your application.

- _TRACKING_MODE_ACTIVE (Default)_: When you require highly accurate and real-time location updates.
- _TRACKING_MODE_BALANCED_: When a balance between accuracy and battery usage is desired.
- _TRACKING_MODE_PASSIVE_: When power efficiency is a priority and lower accuracy is acceptable.

In the meantime, you are also able to update the related configuration value after the initialization of `LocationConfig`, and do the data tracking with the updated **CUSTOM MODE**.

**Initializing with Default Settings**

Create a LocationConfig instance with default settings. The `trackingMode`, `desiredAccuracy`, and `distanceFilter` properties are initialized with their default values. This is suitable if you want to use the default settings for location tracking.

```swift
var locationConfig: LocationConfig = LocationConfig()
```

**Initializing with Specific Tracking Mode**

Create a `LocationConfig` instance, and custom the `trackingMode` property. The _desiredAccuracy_ and _distanceFilter_ properties are then automatically adjusted based on the specified [tracking mode](/docs/tracking/sdk/ios-tracking/location-manager-and-collection). This is useful if you want to prioritize a specific tracking mode and let the other properties adapt accordingly.

```swift
var locationConfig: LocationConfig = LocationConfig(trackingMode: TrackingMode.BALANCED)
```

**Customizing After Initialization**

Create a `LocationConfig instance`, and custom the `trackingMode` property, the _desireAccuracy_ and _distanceFilter_ properties are then customized.

```swift
var locationConfig: LocationConfig = LocationConfig(trackingMode: TrackingMode.BALANCED)
locationConfig.desiredAccuracy = kCLLocationAccuracyBest
locationConfig.distanceFilter = 100
```

## NotificationConfig

The `NotificationConfig` is used to manage the notification-related configurations. It allows customization of various parameters that influence the behavior of different types of notifications.

```swift
open class NotificationConfig: NSObject {

    /**
     Configuration for asset enable notification
     */
    public var assetEnableNotificationConfig = AssetEnableNotificationConfig.init(identifier: "startTrackingIdentifier")

    /**
     Configuration for asset disable notification
     */
    public var assetDisableNotificationConfig = AssetDisableNotificationConfig.init(identifier: "stopTrackingIdentifier")

    /**
     Configuration for low battery notification
     */
    public var lowBatteryNotificationConfig = LowBatteryNotificationConfig.init(identifier: "lowBatteryIdentifier")

    /**
     A Boolean value to determine whether to show the asset enable notification.
     */
    public var showAssetEnableNotification: Bool = true

    /**
     A Boolean value to determine whether to show the asset disable notification.
     */
    public var showAssetDisableNotification: Bool = true

    /**
     A Boolean value to determine whether to show the low battery notification.
     */
    public var showLowBatteryNotification: Bool = false

}
```

- **assetEnableNotificationConfig**: The configuration for starting asset tracking notifications.
- **assetDisableNotificationConfig**: The configuration for stopping asset tracking notifications.
- **lowBatteryNotificationConfig**: The configuration for low-battery notifications.
- **showAssetEnableNotification**: Determines whether to display notifications for start asset tracking.
- **showAssetDisableNotification**: Determines whether to display notifications for stop asset tracking.
- **showLowBatteryNotification**: Determines whether to display notifications for low battery conditions.

**Initializing with Default Settings**

Use the default notification settings

```swift
var notificationConfig = NotificationConfig()
```

**Customizing Notification Configuration**

Create a NotificationConfig instance with default settings. Customize the _assetEnableNotificationConfig_ by creating an _AssetEnableNotificationConfig_ instance with specific parameters like `identifier`, `title`, and `content`.

```swift
var notificationConfig11 = NotificationConfig()
notificationConfig.assetEnableNotificationConfig = AssetEnableNotificationConfig(identifier: "id", title: "custom notification title", content: "custom notification content")
```

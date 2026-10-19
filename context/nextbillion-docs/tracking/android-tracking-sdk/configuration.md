# Configuration

Asset tracking SDK provides a variety of configuration methods, users can customize data reporting, location data collection, notification, and Android services during Asset tracking SDK initialization.

An example of the configuration module usage during SDK initialization is presented as follows:

```java
AssetTracking {
   setDefaultConfig(
       DefaultConfig( )
   )
   setLocationConfig(
       LocationConfig(
           trackingMode = TrackingMode.ACTIVE

       )
   )
   setNotificationConfig(
       NotificationConfig(
           title = "NextBillion.ai",
           content = "Asset tracking is now enabled and your device's location will be tracked",
       )
   )
   setDataTrackingConfig(
       DataTrackingConfig(
           baseUrl = baseUrl,
           dataUploadingBatchSize = 30,
           dataUploadingBatchWindow = 20,
           dataStorageSize = 5000,
           shouldClearLocalDataWhenCollision = true
       )
   )
   initialize("YOUR_ACCESS_KEY")
}
```

The classes corresponding to the configuration are:

- **DataTrackingConfig** : Data caching and reporting configuration
- **DefaultConfig**: Foreground service configuration
- **LocationConfig**: Location update configuration
- **NotificationConfig**: Notification configuration

The following methods are related to configuration in this SDK:

```java
/**
* Set the support configuration for the AssetTracking SDK
* Invoke before 'startTracking()'
*/
assetTrackingSetDefaultConfig(config: DefaultConfig)

/**
* Get the support configuration for the AssetTracking SDK
*/
assetTrackingGetDefaultConfig()

/**
* Set the notification configuration for the AssetTracking SDK
* Invoke before 'startTracking()'
*/
assetTrackingSetNotificationConfig(config: NotificationConfig)

/**
* Update the notification configuration for the AssetTracking SDK
* Invoke after 'startTracking()'
*/
assetTrackingUpdateNotificationConfig(config: NotificationConfig)

/**
* Get the notification configuration for the AssetTracking SDK
*/
assetTrackingGetNotificationConfig()

/**
* Set the Location configuration for the AssetTracking SDK
* Invoke before 'startTracking()'
*/
assetTrackingSetLocationConfig(config: LocationConfig)

/**
* Update the Location configuration for the AssetTracking SDK
* Invoke after 'startTracking()'
*/
assetTrackingUpdateLocationConfig(config: LocationConfig)

/**
* Get the Location configuration for the AssetTracking SDK
*/
assetTrackingGetLocationConfig()

/**
* Set the DataTracking configuration for the AssetTracking SDK
* Invoke before 'startTracking()'
*/
assetTrackingSetDataTrackingConfig(config: DataTrackingConfig)

/**
* Update the DataTracking configuration for the AssetTracking SDK
* Invoke after 'startTracking()'
*/
assetTrackingUpdateDataTrackingConfig(config: DataTrackingConfig)

/**
* Get the DataTracking configuration for the AssetTracking SDK
*/
assetTrackingGetDataTrackingConfig()
```

## DataTrackingConfig

DataTrackingConfig includes the following parameters that are configurable during SDK initialization:

```java
data class DataTrackingConfig{
   var baseUrl: String
   var dataStorageSize: Int
   var dataUploadingBatchSize: Int
   var dataUploadingBatchWindow: Int
   var shouldClearLocalDataWhenCollision: Boolean
}
```

- **baseUrl** will be used for API related services.
- **dataStorageSize** is the maximum available local storage for the Asset Tracking SDK data caching (location record number in Int, default is 5000, each record contains dataUploadingBatchSize location data, and takes one API call to upload)
- **dataUploadingBatchSize** (default 30) and **dataUploadingBatchWindow**(in seconds, default 20 seconds) is for tracked location uploading. The SDK will upload data for every batch window, with no more than the batch size location data. So it is important to configure a proper value for this, otherwise, data will be uploaded with a huge delay.
- **shouldClearLocalDataWhenCollision** is the flag to control whether to clear locally cached location data if assetId is taken by another device
  - If enabled, all the unsent location data will be cleared once asset id is taken, may cause data loss
  - If disabled, unsent location data will remain cached and continue to upload once user rebinds, but this may cause dirty data issues.

## DefaultConfig

`DefaultConfig` is used to configure the running status of the foreground service, Here is a summary of the properties:

- **debug**: A flag indicating the debug mode, determining whether to enable debug mode.
- **enhanceService**: A flag used to determine whether to enable the enhanced service. If set to true, it raises the priority of the service to ensure that the service stays alive until AssetTracking.stopTracking is called. However, it also increases power consumption.
- **workerEnabled**: A flag determining whether WorkManager can be used.
- **crashRestartEnabled**: A flag determining whether the application can be restarted when it crashes.
- **workOnMainThread**: A flag determining whether the service callback works on the main thread.
- **restartIntent**: The Intent used when the application is restarted.

## LocationConfig

`LocationConfig` includes the following parameters that are configurable during SDK initialization:

### Tracking Mode

Location Tracking Mode determines how frequently and accurately the location updates are obtained during tracking. There are three different tracking modes available:

| Tracking Mode | Accuracy                                 | Distance interval | Description                                                                                                                                                                                                                             |
| ------------- | ---------------------------------------- | ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ACTIVE        | High (the most accurate location)        | 5m                | This mode is suitable for applications that require precise and real-time location updates. It provides high accuracy at the cost of increased battery usage.                                                                           |
| BALANCED      | Medium (optimized for battery usage)     | 20m               | This mode strikes a balance between accuracy and battery usage. It provides moderately accurate location updates at a lower frequency, resulting in better battery performance compared to the active mode.                             |
| PASSIVE       | Low (​​coarse ~ 10 km accuracy location) | 100m              | This mode is designed for minimal battery consumption. It provides low-accuracy location updates at longer intervals, making it suitable for scenarios where periodic location updates are sufficient and power efficiency is critical. |

When selecting a tracking mode, you should consider the specific needs of your application. If you require highly accurate and real-time location updates, choose `TRACKING_MODE_ACTIVE (Default)`. If a balance between accuracy and battery usage is desired, `TRACKING_MODE_BALANCED` is a good option. And if power efficiency is a priority and lower accuracy is acceptable, `TRACKING_MODE_PASSIVE` is suitable. Moreover, You can also customize the related configurations for a LocationConfig object, to build a **Customized Mode** based on your need.

#### Tracking with specific Tracking Mode

- **trackingMode** is the mode used in location data tracking, as is explained in the previous section, different tracking modes will have different location accuracy, time interval, and distance interval, thus resulting in different battery consumption.

```java
// Active mode
val locationConfig = LocationConfig(trackingMode = TrackingMode.ACTIVE)

// Balanced mode
val locationConfig = LocationConfig(trackingMode = TrackingMode.BALANCED)

// Passive mode
val locationConfig = LocationConfig(trackingMode = TrackingMode.PASSIVE)

AssetTracking.instance.setLocationConfig(locationConfig)
```

#### Tracking with Distance Interval

You can customize the update interval of every mode

- **smallestDisplacement**: Distance between location updates in meters, this displacement represents the minimum distance that needs to be covered before receiving a location update.

  ```java
  // Define the location tracking config with desired distance interval
  val locationConfig = LocationConfig(smallestDisplacement = 100f)


  //Config the location config
  AssetTracking.instance.setLocationConfig(locationConfig)
  ```

#### Tracking with Time Interval

```java
**interval**: the desired time interval between location updates in milliseconds.
// Define the location tracking config with desired time interval
val locationConfig = LocationConfig(interval = 3000)

// Set the location config
AssetTracking.instance.setLocationConfig(locationConfig)
```

### Other properties in LocationConfig

- **desiredAccuracy** is the desired accuracy when requiring location updates.
- **maxWaitTime** is the maximum wait time in milliseconds for location updates in milliseconds
- **fastestInterval** indicates for the fastest interval in milliseconds for location updates in milliseconds
- **enableStationaryCheck** indicates whether to enable stationary check for SDK if enabled, when SDK detects the asset is in stationary, will switch to energy saving tracking mode, and revert to the original mode when an asset moves again.

## NotificationConfig

After launching asset tracking, we display a notification in the notification bar indicating that asset tracking is running. Users can customize the notification style using the `NotificationConfig`. They can set the title, text, icon, and other properties. When asset tracking is stopped, we also send a system notification to inform the user that asset tracking has stopped. The content of this notification can be customized using **contentAssetDisable**.

Here is a summary of the properties:

- **serviceId**: The ID of the notification service.
- **channelId**: The ID name of the notification channel.
- **channelName**: The name of the notification channel.
- **title**: The title of the notification view.
- **content**: The content of the notification view.
- **smallIcon**: The resource ID of the small icon image for the notification view.
- **largeIcon**: The resource ID of the large notification icon.
- **largeIconBitmap**: The bitmap for the big icon image of the notification view.
- **remoteViews**: Custom layout for the remote view.
- **bigRemoteViews**: Custom large layout for the remote view.
- **pendingIntent**: The PendingIntent instance for handling notification click.
- **notification**: The Notification instance set by the user.
- **notificationChannel**: The NotificationChannel set by the user.
- **showLowBatteryNotification**: A flag to determine whether to display the low battery notification. By default, the value is true
- **lowBatteryNotification**: Customization options for the low battery notification.
- **contentAssetDisable**: The content of the notification view when asset tracking is disabled.
- **assetIdTakenContent**: The content of the notification view when the asset id is taken by another device.

By default, when the battery level goes below a certain threshold, a notification is triggered to alert the user. Users can customize the title, text, icon, and other properties of the low-battery notification using `LowBatteryNotificationConfig`. If the user doesn't want to receive low battery notifications, they can disable it by setting the _showLowBatteryNotification_ property in `NotificationConfig`. Here is a summary of the properties in `LowBatteryNotificationConfig`.

- **threshold**: The low battery warning threshold. If the battery level falls below this value and NotificationConfig.showLowBatteryNotification is true, a notification will be posted. By default the value is 20.
- **channelId**: The ID name of the notification channel for low battery notification.
- **channelName**: The name of the notification channel for low battery notification.
- **title**: The title of the low battery notification view.
- **content**: The content of the low battery notification view. It includes a placeholder ${threshold} that gets replaced with the actual threshold value.
- **smallIcon**: The resource ID of the small icon image for the low battery notification view.
- **pendingIntent**: The PendingIntent instance for handling notification click.

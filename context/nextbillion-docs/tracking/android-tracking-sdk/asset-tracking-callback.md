# Asset Tracking Callback

This section will help users understand and utilize asset-tracking callbacks effectively. By following these steps and implementing the `AssetTrackingCallback` interface, you can receive valuable updates about location changes, handle errors gracefully, and keep track of when the tracking process starts and stops for a specific asset. Additionally, you have the flexibility to remove the callback when it's no longer required.

## Add the Callback

To add a callback, follow these simple steps:

- Implement the `AssetTrackingCallback` interface in your code.

  ```kotlin
  class YourClass : AssetTrackingCallback {
      // Implement callback methods here
  }
  ```

- Add the callback to the `AssetTracking` instance.

  ```kotlin
      assetTrackingAddCallback(this)
  ```

## Remove the Callback

When you no longer need the callback, you can easily remove it:

```kotlin
assetTrackingRemoveCallback(this)
```

Here's an overview of the available callback methods:

- _onLocationSuccess(location: Location)_: This method is invoked when new location information becomes available.
- _onLocationFailure(exception: Exception)_: If an error occurs during the tracking process, this method is called to handle the error.

Note: It's important to note that the error message is included in the function callback. Since our SDK is designed to offer flexibility, we refrain from displaying error messages directly to the user interface. Instead, we expect users to override this function to access the provided exception. They can then decide whether to present the relevant error message within their application as required.

- _onTrackingStart(assetId: String)_: It is invoked when the tracking process starts for a specified asset, providing you with relevant information.
- _onTrackingStop(assetId: String)_: When the tracking process stops for a particular asset, this method is triggered.
- _onTrackingStop(assetId: String, trackingDisableType: TrackingDisableType)_: In situations where tracking is stopped for an asset with specific disabled type information, this method provides those details.

By following these steps and understanding the available callback methods, you can effectively incorporate asset-tracking capabilities into your application without needing to be a developer.

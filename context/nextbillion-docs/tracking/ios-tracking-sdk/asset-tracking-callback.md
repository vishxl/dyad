# Asset Tracking Callback

To actively monitor the status of asset tracking and receive crucial location updates via the `AssetTracking` framework, you can designate your class as the delegate of the\* AssetTracking.shared\* instance. This responsibility entails handling callbacks and updates related to asset tracking.

```swift
AssetTracking.shared.delegate = self
```

## AssetTrackingCallback Protocol

Here's the protocol definition for `AssetTrackingCallback`, outlining the methods you can implement to handle various tracking-related events:

```swift
public protocol AssetTrackingCallback : NSObjectProtocol {

   /**
    Called when tracking is started for the specified asset.
    - Parameter assetId: The ID of the asset that tracking has started for.
    */
   func onTrackingStart(assetId: String)

   /**
    Called when tracking is stopped for the specified asset.
    - Parameter assetId: The ID of the asset that tracking has stopped for.
    */
   func onTrackingStop(assetId: String, trackingDisableType: TrackingDisableType)

   /**
    Invoked when new locations are available.
    */
   func onLocationSuccess (location: CLLocation)

   /**
    Invoked when an error has occurred.
    */
   func onLocationFailure (error: Error)

   /**
    Invoked when try to start tracking with location service off
    */
   func onLocationServiceOff ()

}
```

By implementing these callback methods, you can effectively manage asset tracking status and location updates within your iOS application, ensuring a smooth and responsive user experience.

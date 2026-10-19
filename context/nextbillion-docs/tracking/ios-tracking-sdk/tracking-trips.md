# Tracking Trips

**Trip Tracking** is a powerful module designed for applications that need to track drivers' routes in real-time. By integrating the SDK into your application, you can record and manage the entire journey of a driver from start to finish.

## Getting Started

### Install the SDK

Before using the trip feature, you need to install the iOS Tracking SDK into your project. Please refer to [Getting Started](/docs/tracking/sdk/ios-tracking/getting-started) for a step-by-step guide.

### Configure an Asset

Next, we will create an asset and bind it to a GPS device so that we can track the asset as it moves through its Trip.

#### Create an Asset

```swift
AssetTracking.shared.createAsset(assetProfile: AssetProfile) { assetId in
             // Handle success, the result is the trip id
         } errorHandler: { error in
             // Handle the error
         }
```

#### Bind an Asset

```swift
 AssetTracking.shared.bindAsset(assetId: String) { assetId in
            // Handle success, the result is the trip id
        } errorHandler: { error in
            // Handle the error
        }
```

For comprehensive details about the above methods, please refer to the [iOS SDK documents](/docs/tracking/sdk/ios-tracking/getting-started).

## Implementing Trip Tracking

The trip feature in the Tracking SDK allows you to monitor and manage trips for your assets. This feature provides functionality for starting, updating, ending, and deleting trips, as well as retrieving trip summaries and details.

### Starting a Trip

When a driver starts a trip, call the `startTrip` method. This will record the start time and the starting location of the trip.

```swift
let tripProfile = TripProfile(customId: "Your custom trip ID", name: "Trip Name",description: "A sample Trip",attributes: ["Key of attribute":"Value of attribute"])
AssetTracking.shared.startTrip(tripProfile: tripProfile) { tripId in
       // Handle success, the result is the trip id
    } errorHandler: { error in
        // Handle success, the result is the trip id

    }
```

### Updating Trip details

```swift
During the trip, you can call the `updateTrip` method to update the driver's trip profile.
let updateTripProfile = UpdateTripProfile(name: "Edit trip name",
                                                  description: "Edit description",
                                                  attributes: ["Edit key of attributes":"Edit value of attributes"])

AssetTracking.shared.updateTrip(tripId: tripId, tripProfile: updateTripProfile) { tripId in
            // Handle success, the result is the trip id
        } errorHandler: { error in
            // Handle the error
        }
```

### Ending a Trip

When a trip ends, such as when an order is picked up or a driver completes a delivery the driver reaches the destination or completes the last delivery of his route, you can mark a trip as completed, by calling the `endTrip` method.

```swift
AssetTracking.shared.endTrip(){ tripId in
            // Handle success, the result is the trip id
        } errorHandler: { error in
           // Handle the error
        }
```

### Retrieving Trip details

You can use the getAssetDetail method to get detailed information about a trip. If the provided trip IDis null, details of the ongoing trip are returned. Otherwise, if a valid trip ID is provided, details of the given trip are returned.

```swift
AssetTracking.shared.getTrip(tripId: tripId) { trip in
           // Handle success, the result is the Trip
        } errorHandler: { [weak self] error in
            // Handle the error
        }
```

### Get Trip Summary

Invoke `tripSummaray` function to get the summary of a completed trip.

```swift
AssetTracking.shared.tripSummaray(tripId: tripId) { summary in
           // Handle success, the result is the TripSummary
       } errorHandler: { [weak self] error in
           // Handle the error
       }
```

### Deleting a Trip

You can delete a trip by providing the trip ID . However, note that once a trip is deleted, calling any other trip-related methods will no longer succeed.

```swift
AssetTracking.shared.deleteTrip(tripId: tripId) { [weak self] id in
             // Handle success, the result is the trip id
        } errorHandler: { error in
            // Handle the error
        }
```

## Listening for Callback Methods

In addition to handling success or failure in method callbacks, you can also handle trip status changes by listening for delegates.

### Setup the delegate

```swift
 AssetTracking.shared.delegate = self
```

### Implemente the delegate

```swift
class YourViewController: UIViewController, AssetTrackingDelegate {
 {

    /// Invoked when the status of a trip changes.
    /// - Parameters:
    ///   - tripId: The ID of the trip whose status has changed.
    ///   - status: The new status of the trip.
    func onTripStatusChanged(tripId: String, status: TripStatus){
         /// Do something
    }
}
```

By following these methods, you can easily integrate and use the Trip Tracking feature to achieve real-time tracking and management of driver trips.

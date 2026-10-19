# Tracking Trips

Trip Tracking is a powerful module designed for applications that need to track drivers' routes in real-time. By integrating the SDK into your application, you can record and manage the entire journey of a driver from start to finish.

## Getting Started

### Install the SDK

Before using the trip feature, you need to install the Android Tracking SDK into your project. Please refer to [Getting Started](/docs/tracking/sdk/android-tracking/getting-started) for a step-by-step guide.

### Configure an Asset

Next, we will create an asset and bind it to a GPS device so that we can track the asset as it moves through its Trip.

#### Create an Asset

```java
AssetTracking.instance.createNewAsset(assetProfile, callback)
```

#### Bind an Asset

```java
AssetTracking.instance.bindAsset(context, assetId, callback)
```

For detailed methods, refer to the [Android SDK documents](/docs/tracking/sdk/android-tracking/http-api).

## Implementing Trip Tracking

The trip feature in the Tracking SDK allows you to monitor and manage trips for your assets. This feature provides functionality for starting, updating, ending, and deleting trips, as well as retrieving trip summaries and details.

### Starting a Trip

When a driver starts a trip, call the `startTrip` method. This will record the start time and the starting location of the trip.

```java
val tripProfile = TripProfile(
   name = "A Sample Trip",
   description = "This is a sample trip",
   attributes = mapOf("keyOfAttribute" to "value of attribute"),
   metaData = mapOf("keyOfMetaData" to "value of meta data"),
   stops = listOf(
       TripStop(
           name = "Trip stops",
           metaData = mapOf("keyOfMetaData" to "value of trip stop meta data"),
           geofenceId = "ID of geofence"
       )
   )
)

AssetTracking.instance.startTrip(this,tripProfile,true, object : AssetApiCallback<String> {
   override fun onSuccess(result: String) {
       // Handle success, the result is the trip id
   }

   override fun onFailure(exception: AssetException) {
       // Handle error
   }
})
```

You can also use the _Context extension_ method:

```java

assetTrackingStartTrip(tripProfile, true, object : AssetApiCallback<String> {
   override fun onSuccess(result: String) {
       // Handle success, the result is the trip id
   }

   override fun onFailure(exception: AssetException) {
       // Handle error
   }
})
```

### Updating a Trip

During the trip, you can call the `updateTrip` method to update the driver's trip profile.

```java
val tripProfile = TripUpdateProfile(
   name = "Update Sample Trip",
   description = "This is a sample trip that has been updated",
   attributes = mapOf("keyOfAttribute" to "value of attribute"),
   metaData = mapOf("keyOfMetaData" to "value of meta data"),
   stops = listOf(
       TripStop(
           name = "updated stops",
           metaData = mapOf("keyOfMetaData" to "value of trip stop meta data"),
           geofenceId = "ID of geofence"
       )
   )
)
AssetTracking.instance.updateTrip(this, tripProfile, object : AssetApiCallback<String> {
   override fun onSuccess(result: String) {
       // Handle success, the result is the trip id
   }

   override fun onFailure(exception: AssetException) {
       // Handle error
   }
})
```

You can also use the _Context extension_ method:

```java
assetTrackingUpdateTrip(tripProfile, object : AssetApiCallback<String> {
   override fun onSuccess(result: String) {
       // Handle success, the result is the trip id
   }

   override fun onFailure(exception: AssetException) {
       // Handle error
   }
})
```

### Ending a Trip

When a trip ends, such as when the driver reaches the destination or completes the last delivery of his route, you can mark a trip as completed, by calling the `endTrip` method.

```java
AssetTracking.instance.endTrip(this, object : AssetApiCallback<String> {
   override fun onSuccess(result: String) {
       // Handle success, the result is the trip id
   }

   override fun onFailure(exception: AssetException) {
       // Handle error
   }
})
```

You can also use the _Context extension_ method:

```java
assetTrackingEndTrip(object : AssetApiCallback<String> {
   override fun onSuccess(result: String) {
       // Handle success, the result is the trip id
   }

   override fun onFailure(exception: AssetException) {
       // Handle error
   }
})
```

### Retrieving Trip details

You can use the `getTripInfo` method to get detailed information about a trip. If the provided trip ID is _null_, details of the ongoing trip are returned. Otherwise, if a valid trip ID is provided, details of the given trip are returned.

```java
AssetTracking.instance.getTripInfo(this, null, object : AssetApiCallback<Trip> {
   override fun onSuccess(result: Trip) {
      // Handle success, the result is the trip object
   }

   override fun onFailure(exception: AssetException) {
      // Handle error
   }
})
```

You can also use the _Context extension_ method:

```java
assetTrackingGetTripInfo(null, object : AssetApiCallback<Trip> {
   override fun onSuccess(result: Trip) {
       setupView(result)
   }

   override fun onFailure(exception: AssetException) {
      // Handle error
   }
})
```

### Get Trip Summary

Invoke `tripSummary` function to get the summary of a completed trip.

```java
AssetTracking.instance.tripSummary(this, tripId, object : AssetApiCallback<TripSummary> {
   override fun onSuccess(result: TripSummary) {
       // Handle the trip summary
   }

   override fun onFailure(exception: AssetException) {
       // Handle the error
   }
})
```

You can also use the _Context extension_ method:

```java
assetTrackingTripSummary(tripId = "<A_valid_trip_ID>", object : AssetApiCallback<TripSummary> {
   override fun onSuccess(result: TripSummary) {
      // Handle the trip summary
       bindData(result)
   }

   override fun onFailure(exception: AssetException) {
       // Handle the error
   }
})
```

### Deleting a Trip

You can delete a trip by providing the trip ID. However, note that once a trip is deleted, calling any other trip-related methods will no longer succeed.

```java
AssetTracking.instance.deleteTrip(this, tripId, object : AssetApiCallback<String> {
   override fun onSuccess(result: String) {
       // Handle success, the result is the trip id
   }

   override fun onFailure(exception: AssetException) {
       // Handle the error
   }
})
```

You can also use the _Context extension_ method:

```java
assetTrackingDeleteTrip(tripId, object : AssetApiCallback<String> {
   override fun onSuccess(result: String) {
        // Handle success, the result is the trip id
   }

   override fun onFailure(exception: AssetException) {
       // Handle the error
   }
})
```

## Listening for Callback Methods

In addition to handling success or failure in method callbacks, you can also handle trip status changes by listening for callbacks.

### Adding a Callback Listener

```java
val assetCallback = object : AssetTrackingCallBack {
   // Other methods
   ...

   /**
    * Invoked when the trip status changes.
    * @param tripId the trip id
    * @param status the trip status, see [TripStatus]
    */
    override fun onTripStatusChanged(tripId: String, status: TripStatus) {
       // Handle the trip status change
    }
}

assetTrackingAddCallback(assetCallback)
```

### Removing a Callback Listener

```java
assetTrackingRemoveCallback(assetCallback)
```

By following these methods, you can easily integrate and use the Trip Tracking feature to achieve real-time tracking and management of driver trips.

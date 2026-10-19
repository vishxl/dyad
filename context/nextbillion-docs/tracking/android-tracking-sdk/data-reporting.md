# Data reporting

This module handles location data received from the device, processes it into a structured format known as _LocationData_, and stores it locally using the MMKV plugin.

## LocationData Format

LocationData is a structured format that contains essential location information. It includes:

- `location`: Represents the geographical coordinates in `lat,lon` format, where `lat` represents the latitude and `lon` represents the longitude of the `location`.
- `timeStamp`: A UNIX Epoch timestamp in seconds indicating the time when the location was recorded.
- `accuracy`: Reflects the accuracy of the location data in meters.
- `speed`: Denotes the speed of the asset(device) movement in meters/second.
- `bearing`: Represents the direction (bearing) in which the device is moving.
- `altitude`: Indicates the altitude above sea level in meters.
- `battery_level`: The battery remaining represents the current level of battery charge remaining.
- `tracking_mode`: The tracking mode represents the current mode of tracking.
  - ACTIVE: Real-time tracking mode.
  - BALANCED: Balanced tracking mode with moderate power consumption.
  - PASSIVE: Passive tracking mode with minimal power consumption.
  - CUSTOM: Custom tracking mode

To add the `LocationData` class to your android project, you can create a new Java class in your project. Copy and Paste the following code block in your newly created Java class:

```java
public class LocationData implements Parcelable {
  private SimpleLocation location;
  private final long timeStamp;
  private final float accuracy;
  private final float speed;
  private final float bearing;
  private final double altitude;

  private LocationData(Builder builder) {
      location = builder.location;
      timeStamp = builder.timeStamp;
      accuracy = builder.accuracy;
      speed = builder.speed;
      bearing = builder.bearing;
      altitude = builder.altitude;
  }

  public static class SimpleLocation{
      private final double lat;
      private final double lon;
}
}
```

## Data Uploading Process

The data uploading process happens discreetly in the background and is not visible to end-users. Here's how it works:

- Data uploading follows the user-defined parameters set in `DataTrackingConfig`, specifically `dataUploadingBatchSize` and `dataUploadingBatchWindow`.
- Data is uploaded in the order it was tracked, with earlier data taking priority.
- For each data upload operation, if there's more data in the local cache than the defined `dataUploadingBatchSize`, only the specified number of location data points are uploaded to the backend in one go.
- If there's less data in the local cache than the `dataUploadingBatchSize`, all available unsent data is uploaded in a single API call.
- Upon successful data upload, it is removed from the local cache to free up storage space. In case of upload failures, the next API call will prioritize uploading the previously failed data before proceeding with the remaining data.
- The behavior of clearing local unsent location data when another device takes the current asset ID is controlled by `DataTrackingConfig.shouldClearLocalDataWhenCollision`. If enabled, all local unsent location data will be cleared to ensure data integrity.

By understanding these simple principles, you can grasp the data reporting module's functionality and how it manages location data seamlessly within the SDK.

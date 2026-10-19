# Location Manager and Collection

This section of the SDK will guide you to efficiently manage and collect location information. We’ll delve into the core functionalities that facilitate precise location data collection and management within your application.

## Required Permissions

Before starting tracking location using the Asset framework, you need to add the following required permissions in your `Info.plist` file.

```xml
<key>NSLocationWhenInUseUsageDescription</key>
<string>[Your explanation here]</string>
<key>NSLocationAlwaysUsageDescription</key>
<string>[Your explanation here]</string>

<key>UIBackgroundModes</key>
<array>
  <string>location</string>
</array>
```

- **NSLocationWhenInUseUsageDescription**: This permission requests access to your location when you're actively using it, allowing us to provide location-based services and features.
- **NSLocationAlwaysUsageDescription**: This permission requests continuous access to your location, even when it's running in the background. It enables us to provide seamless location-based services and notifications, enhancing your overall app experience.
- **UIBackgroundModes**: This Permission requests the ability to continue receiving location updates even when it's running in the background. This allows the app to provide location-based services and features that require ongoing location tracking

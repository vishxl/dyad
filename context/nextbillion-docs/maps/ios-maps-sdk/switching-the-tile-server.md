# Switching the Tile Server

If you have access tokens for both TomTom and NextBillion MapTile, you can choose which tile server the SDK uses.

## Enum

```swift
typedef NS_ENUM(NSUInteger, NGLWellKnownTileServer) {
    /**
     * NextBillion MapTile tile server
     *
     * Use this type when your access token only supports NextBillion MapTile services.
     * NextBillion MapTile provides high-quality vector tiles with global coverage.
     * Requires a NextBillion MapTile API key for authentication.
     */
    NGLMapTiler,

    /**
     * NextBillion TomTom tile server
     *
     * Use this type when your access token supports NextBillion TomTom mapping services.
     * NextBillion provides mapping services powered by TomTom’s infrastructure.
     * Offers global coverage with high performance and reliability.
     */
    NGLTomTom
};
```

## Set the Tile Server at App Launch

Configure tile server in your app entry point (for example, AppDelegate).

#### Swift

```swift
func application(
  _ application: UIApplication,
  didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?
) -> Bool {
    // Switch to NextBillion MapTiler at startup
    NGLAccountManager.useWellKnownTileServer(.mapTiler)
    return true
}
```

#### Objective-C

```swift
// AppDelegate.m
- (BOOL)application:(UIApplication *)application
didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
    // Switch to NextBillion MapTiler at startup
    [NGLAccountManager useWellKnownTileServer:NGLMapTiler];
    return YES;
}
```

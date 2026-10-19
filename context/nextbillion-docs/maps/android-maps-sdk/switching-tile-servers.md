# Switching Tile Servers

If you have access tokens for TomTom and NextBillion.ai map tiles, you can switch the active tile server using the APIs below.

## Enum

```
public enum NGLWellKnownTileServer {
    NGLMapTiler, // NextBillion.ai tile service
    NGLTomTom    // TomTom tile service
}
```

**Default:** The SDK uses **TomTom** as the default tile service provider.

## Set at App Initialization

Specify the desired tile server and the corresponding access token during SDK initialization (e.g., in your `Application`):

```kotlin
// Use NextBillion.ai Map Tiles
Nextbillion.getInstance(
    getApplicationContext(),
    accessToken,
    NGLWellKnownTileServer.NGLMapTiler
);
```

Make sure the **accessToken** matches the selected provider; tokens are not interchangeable across providers.

## Runtime Switching

To switch the tile server at runtime, use `setWellKnownTileServer`:

```
// Read current server
NGLWellKnownTileServer currentServer = Nextbillion.getWellKnownTileServer();

// Compute the new server
NGLWellKnownTileServer newServer =
        (currentServer == NGLWellKnownTileServer.NGLTomTom)
                ? NGLWellKnownTileServer.NGLMapTiler
                : NGLWellKnownTileServer.NGLTomTom;

// Update global setting
Nextbillion.setWellKnownTileServer(newServer);
```

### Recommendations

- **Scope:** `setWellKnownTileServer` is a global setting. Newly created map instances will use the new server.
- **Existing maps:** If existing `MapView/NextbillionMap` instances doesn’t refresh automatically, re-apply style or recreate the map to fetch tiles from the new source.
- **Caching & loading:** After switching, you may briefly see mixed or blank tiles while resources reload.

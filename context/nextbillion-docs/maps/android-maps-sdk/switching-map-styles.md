# Switching Map Styles

```
The SDK currently supports the following map styles:
MapView.MAP_TYPE_NORMAL,    // Standard
MapView.MAP_TYPE_SATELLITE, // Satellite
MapView.MAP_TYPE_NIGHT      // Night
```

## Set Style When the Map Is Ready

Set your desired style in `onMapReady`. You can use the style-loaded callback to further customize layers and sources:

```kotlin
mapView.getMapAsync(new OnMapReadyCallback() {
    @Override
    public void onMapReady(@NonNull NextbillionMap nextbillionMap) {
        nextbillionMap.setStyle(MapView.MAP_TYPE_NIGHT, style -> {
            // Style is loaded. Add custom layers, sources, symbols here.
        });
    }
});
```

## Recommendations

- **Coordinate with tile switching:** After changing the tile server, call `setStyle(...)` to force a reload so the new base tiles are immediately reflected.
- **Performance:** Style switches require re-loading of resources. It is recommended to do so at clear UX moments (e.g., theme toggle).
- **Night mode:** Consider aligning `MAP_TYPE_NIGHT` with system dark mode or your app’s theme.

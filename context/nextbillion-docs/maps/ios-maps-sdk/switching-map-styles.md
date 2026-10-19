# Switching Map Styles

The SDK supports multiple base map styles.

## Enum

```
typedef NS_ENUM(NSUInteger, NGMapStyleType) {
    Bright,
    Night,
    Satellite
};
```

## Set Styles when Map is Initialized

#### Swift

```swift
// After mapView is ready (for example, in delegate callback)
nbMapView.setStyleWithType(.bright)
```

#### Objective-C

```
// Example
[nbMapView setStyleWithType:Bright];
```

**Best Practices & Notes**

- **Coordinate with tiler changes**: When you change the tile server, switch (or re-apply) the map style to force a clean reload of base tiles so users see the tiles from the new provider immediately.
- **Performance**: Style changes reload resources. Bundle switches at natural UX moments (e.g., theme toggles).
- **Night mode**: Consider mapping Night to your app’s dark theme or system appearance for consistency.

## Verify Style Load Completion

You can verify that the map **style has finished loading** via the delegate callback. This is the safest point to add custom layers, sources, images, or adjust styling—your changes won’t be overwritten by subsequent style loads.

#### Objective-C

#pragma mark - NGLMapViewDelegate

```objectivec
- (void)mapView:(NGLMapView *)mapView didFinishLoadingStyle:(NGLStyle *)style {
    // The style is fully loaded here.
    // Example: add a geojson source and a symbol layer
    NGLShapeSource *source = [[NGLShapeSource alloc] initWithIdentifier:@"pois" URL:[NSURL URLWithString:@"bundle://pois.geojson"] options:nil];
    [style addSource:source];

    NGLSymbolStyleLayer *layer = [[NGLSymbolStyleLayer alloc] initWithIdentifier:@"poi-layer" source:source];
    layer.text = [NGLStyleValue valueWithRawValue:@"{name}"];
    [style addLayer:layer];

    // If you switched tile servers recently, this ensures that the tiles are rendered using the new provider.
}
```

#### Swift

```swift
// Ensure your class adopts NGLMapViewDelegate
extension YourViewController: NGLMapViewDelegate {
    func mapView(_ mapView: NGLMapView, didFinishLoading style: NGLStyle) {
        // The style is fully loaded here.
        // Example: add a geojson source and a symbol layer
        let url = URL(string: "bundle://pois.geojson")!
        let source = NGLShapeSource(identifier: "pois", url: url, options: nil)
        style.addSource(source)

        let layer = NGLSymbolStyleLayer(identifier: "poi-layer", source: source)
        layer.text = NGLStyleValue(rawValue: "{name}")
        style.addLayer(layer)

        // If you switched tile servers recently, this ensures that the tiles are rendered using the new provider.
    }
}
```

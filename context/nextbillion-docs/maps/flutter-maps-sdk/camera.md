# Camera

The Camera defines the view of the map, including its geographical location, zoom level, tilt angle, and bearing (rotation). You can use CameraUpdates to move the camera to a specific CameraPosition or adjust its position relative to the current view.

## CameraUpdate

A _CameraUpdate_ represents a change in the map's camera, allowing you to specify the new _CameraPosition_ with its geographical location (_target_), zoom level (_zoom_), tilt angle (_tilt_), and bearing (_bearing_).

```dart
CameraUpdate.newCameraPosition(
       const CameraPosition(
              bearing: 270.0,
              target: LatLng(51.5160895, -0.1294527),
              tilt: 30.0,
              zoom: 17.0,
        ),
 )
controller.animateCamera(cameraUpdate)
```

## Moving the Camera

To move the camera to a specific geographical location, you can use _CameraUpdate.newLatLng()_ with the desired `LatLng` coordinates.

The following code snippet shows how to move the camera target to a specified geographical location.

```dart
CameraUpdate.newLatLng(const LatLng(56.1725505, 10.1850512))
```

## Animate the Camera

The _animateCamera()_ function initiates an animated transition to change the map's camera position smoothly. You can specify the desired _CameraUpdate_ and an optional `duration` to control the animation speed.

```dart
controller.animateCamera(cameraUpdate, duration)
```

While _animateCamera()_ creates a smooth and visually pleasing transition, the _moveCamera()_ function directly moves the camera to the specified position without animation. In most cases, _animateCamera()_ is preferred over _moveCamera()_ to provide a more seamless user experience.

```dart
controller.moveCamera(cameraUpdate)
```

## Additional Camera Methods

In addition to _animateCamera()_ and _moveCamera()_, the SDK offers several other camera-related methods to further control the map view:

- **scrollBy()**: Scrolls the map view by a given distance in pixels along the x and y axes.

- **zoomBy()**: Adjusts the zoom level by a given value.

- **zoomIn()**: Zooms in the map view by one zoom level.

- **zoomOut()**: Zooms out the map view by one zoom level.

- **zoomTo(double zoom)**: Sets the zoom level to the specified value.

- **bearingTo(double bearing)**: Sets the bearing (rotation) to the specified value.

- **tiltTo(double tilt)**: Sets the tilt angle to the specified value.

By utilizing these camera control methods, you can create dynamic and interactive map experiences, allowing users to explore various locations and seamlessly navigate the map's view in your Flutter application.

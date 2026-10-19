# Camera and Animations

This section of the SDK focuses on manipulating the camera position and performing animations on a map. The camera represents the viewpoint or perspective from which the map is viewed, and adjusting its position allows users to navigate and explore the map dynamically.

## Camera Position

### Initial position

Similar to the above quickstart example, we can set the initial camera position in the map view delegate, as is shown in below example code:

```swift
    func mapView(_ mapView: NGLMapView, didFinishLoading style: NGLStyle){
        let centerCoords = CLLocationCoordinate2DMake(53.5511, 9.9937)
        let cameraZoomLevel = 16.0
        nbMapView.setCenter(centerCoords, zoomLevel: cameraZoomLevel, animated: false)
    }
```

The center coordinates and camera zoom level is configurable during the initialization of the map view.

### Set position

After the map view is initialized successfully, we can also move the map view camera position based on needs. An example is provided below:

```swift
        let camera = NGLMapCamera(lookingAtCenter: CLLocationCoordinate2DMake(53.5511, 9.9937),
                                  acrossDistance:1000,
                                  pitch:0,
                                  heading:0)
        nbMapView.fly(to: camera, withDuration: 2 , completionHandler: {

        })
        // optional, can also change the camera zoom level here
        // nbMapView.setZoomLevel(17.0, animated: true)
```

### Get position

We can also retrieve the current camera target position and camera zoom level if needed, the following code snippet shows how to achieve this:

```swift
        let cameraLat = nbMapView.centerCoordinate.latitude
        let cameraLong = nbMapView.centerCoordinate.longitude
        let zoomLevel = nbMapView.zoomLevel
        print("camera center latitude is: " + String(cameraLat))
        print("camera center longitude is: " + String(cameraLong))
        print("camera zoom level is: " + String(zoomLevel))
```

## Fit/Bind camera to a given shape

We can also form a polygon shape based on given coordinates, and fit the map view camera to the polygon shape, please refer to the below code snippet for example:

```swift
        let coords = [
            CLLocationCoordinate2DMake(53.5511, 9.9937),
            CLLocationCoordinate2DMake(53.5311, 9.9947),
            CLLocationCoordinate2DMake(53.5531, 9.9957),
            CLLocationCoordinate2DMake(53.5521, 9.9967)
        ]
        let bounds = NGLPolygon(coordinates: coords, count: UInt(coords.count)).overlayBounds
        nbMapView.setVisibleCoordinateBounds(bounds,animated: true)
```

## Listen to camera changes

We also allow listening to map view camera change via the following code example, just implement one of them in your delegate based on needs:

```swift
    func mapView(_ mapView: NGLMapView, shouldChangeFrom oldCamera: NGLMapCamera, to newCamera: NGLMapCamera) -> Bool {
        // add your logic here
        // remember this will be triggered multiple times for one user action
        return true
    }

    // If this method is implemented, the above shouldChangeFrom:to: function will not be called
    //    func mapView(_ mapView: NGLMapView, shouldChangeFrom oldCamera: NGLMapCamera, to  newCamera: NGLMapCamera, reason: NGLCameraChangeReason) -> Bool {
    //        // add your logic here
    //        // remember this will be triggered multiple times for one user action
    //        return true
    //    }
```

One thing to be aware of is, the later method will block the former one, so if you implement both of the methods, the first one will not be functional.

## Restrict Camera

Besides the above camera operations, we can also customize whether to enable user actions on the map view. By default, the following actions are enabled, and we could disable part of them with the following code example:

```
        // disable map rotating
        nbMapView.allowsRotating = false
        // diable map scrolling up or down
        nbMapView.allowsScrolling = false
        // disable map tilt change
        nbMapView.allowsTilting = false
        // diable map zoom level change
        nbMapView.allowsZooming = false
```

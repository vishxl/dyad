# Camera Controller

## Introduction

This example shows how to show mapview and perform camera update actions:

- Display MapView Widget

- Various Camera Update operations:
  - new Camera position

  - new LatLng

  - new LatLng Bounds

  - new LatLng Zoom

  - scrollBy

  - zoomBy with focus

  - zoomBy

  - zoomIn

| ![documentation image](https://static.nextbillion.io/docs-next/docs/maps/flutter/examples/camera-controller-1.webp) | ![documentation image](https://static.nextbillion.io/docs-next/docs/maps/flutter/examples/camera-controller-2.webp) |
| ------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| **Android snapshot**                                                                                                | **iOS snapshot**                                                                                                    |

For all code examples, refer to [Flutter Maps SDK Code Examples](https://github.com/nextbillion-ai/nb-maps-flutter)

**AnimateCameraPage** [view source](https://github.com/nextbillion-ai/nb-maps-flutter/blob/main/example/lib/animate_camera.dart)

```dart
import 'package:flutter/material.dart';
import 'package:nb_maps_flutter/nb_maps_flutter.dart';

import 'main.dart';
import 'page.dart';

class AnimateCameraPage extends ExamplePage {
  AnimateCameraPage()
      : super(const Icon(Icons.map), 'Camera control, animated');

  @override
  Widget build(BuildContext context) {
    return const AnimateCamera();
  }
}

class AnimateCamera extends StatefulWidget {
  const AnimateCamera();
  @override
  State createState() => AnimateCameraState();
}

class AnimateCameraState extends State<AnimateCamera> {
  late NextbillionMapController mapController;

  void _onMapCreated(NextbillionMapController controller) {
    mapController = controller;
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: <Widget>[
        Center(
          child: SizedBox(
            width: 300.0,
            height: 200.0,
            child: NBMap(
              onMapCreated: _onMapCreated,
              initialCameraPosition:
                  const CameraPosition(target: LatLng(0.0, 0.0)),
            ),
          ),
        ),
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceEvenly,
          children: <Widget>[
            Column(
              children: <Widget>[
                TextButton(
                  onPressed: () {
                    mapController
                        .animateCamera(
                          CameraUpdate.newCameraPosition(
                            const CameraPosition(
                              bearing: 270.0,
                              target: LatLng(51.5160895, -0.1294527),
                              tilt: 30.0,
                              zoom: 17.0,
                            ),
                          ),
                        )
                        .then((result) => print(
                            "mapController.animateCamera() returned $result"));
                  },
                  child: const Text('newCameraPosition'),
                ),
                TextButton(
                  onPressed: () {
                    mapController
                        .animateCamera(
                          CameraUpdate.newLatLng(
                            const LatLng(56.1725505, 10.1850512),
                          ),
                          duration: Duration(seconds: 5),
                        )
                        .then((result) => print(
                            "mapController.animateCamera() returned $result"));
                  },
                  child: const Text('newLatLng'),
                ),
                TextButton(
                  onPressed: () {
                    mapController.animateCamera(
                      CameraUpdate.newLatLngBounds(
                        LatLngBounds(
                          southwest: const LatLng(-38.483935, 113.248673),
                          northeast: const LatLng(-8.982446, 153.823821),
                        ),
                        left: 10,
                        top: 5,
                        bottom: 25,
                      ),
                    );
                  },
                  child: const Text('newLatLngBounds'),
                ),
                TextButton(
                  onPressed: () {
                    mapController.animateCamera(
                      CameraUpdate.newLatLngZoom(
                        const LatLng(37.4231613, -122.087159),
                        11.0,
                      ),
                    );
                  },
                  child: const Text('newLatLngZoom'),
                ),
                TextButton(
                  onPressed: () {
                    mapController.animateCamera(
                      CameraUpdate.scrollBy(150.0, -225.0),
                    );
                  },
                  child: const Text('scrollBy'),
                ),
              ],
            ),
            Column(
              children: <Widget>[
                TextButton(
                  onPressed: () {
                    mapController.animateCamera(
                      CameraUpdate.zoomBy(
                        -0.5,
                        const Offset(30.0, 20.0),
                      ),
                    );
                  },
                  child: const Text('zoomBy with focus'),
                ),
                TextButton(
                  onPressed: () {
                    mapController.animateCamera(
                      CameraUpdate.zoomBy(-0.5),
                    );
                  },
                  child: const Text('zoomBy'),
                ),
                TextButton(
                  onPressed: () {
                    mapController.animateCamera(
                      CameraUpdate.zoomIn(),
                    );
                  },
                  child: const Text('zoomIn'),
                ),
                TextButton(
                  onPressed: () {
                    mapController.animateCamera(
                      CameraUpdate.zoomOut(),
                    );
                  },
                  child: const Text('zoomOut'),
                ),
                TextButton(
                  onPressed: () {
                    mapController.animateCamera(
                      CameraUpdate.zoomTo(16.0),
                    );
                  },
                  child: const Text('zoomTo'),
                ),
                TextButton(
                  onPressed: () {
                    mapController.animateCamera(
                      CameraUpdate.bearingTo(45.0),
                    );
                  },
                  child: const Text('bearingTo'),
                ),
                TextButton(
                  onPressed: () {
                    mapController.animateCamera(
                      CameraUpdate.tiltTo(30.0),
                    );
                  },
                  child: const Text('tiltTo'),
                ),
              ],
            ),
          ],
        )
      ],
    );
  }
}
```

## Code summary

The above code snippet defines an **AnimateCamera** page, which displays a map using the **NBMap** widget from the **nb_maps_flutter** package. The widget allows the user to control the camera position of the map and animate various camera movements, like zooming, panning, and tilting.

1.  **Display MapView Widget**:
    - The NBMap widget is used to display the map on the screen. It requires an onMapCreated callback to get access to the NextbillionMapController, which allows interaction with the map.

    - The initialCameraPosition property sets the initial position of the camera when the map is first displayed.

2.  **Camera Options**:

The AnimateCamera widget has several buttons that trigger different camera animations:

- **newCameraPosition**: Animates the camera to a new position with specified parameters like bearing, target, tilt, and zoom.

- **newLatLng**: Animates the camera to a new latitude and longitude position.

- **newLatLngBounds**: Animates the camera to fit a specific bounding box defined by southwest and northeast coordinates.

- **newLatLngZoom**: Animates the camera to a specific latitude and longitude position with a given zoom level.

- **scrollBy**: Animates the camera by scrolling the map by a given distance in pixels.

- **zoomBy** with focus: Zooms the camera by a given amount relative to the current zoom level, with a specified focus point (offset from the center of the map).

- **zoomBy**: Zooms the camera by a given amount relative to the current zoom level without any focus point.

- **zoomIn**: Animates the camera to zoom in by one zoom level.

- **zoomOut**: Animates the camera to zoom out by one zoom level.

- **zoomTo**: Animates the camera to a specific zoom level.

- **bearingTo**: Animates the camera to a specific bearing (rotation angle) in degrees.

- **tiltTo**: Animates the camera to a specific tilt angle in degrees.

The camera animations are triggered when the corresponding buttons are pressed, and the **NextbillionMapController** is used to perform the camera movements using the **animateCamera** method. The results of the camera animations are printed to the console.

To use this widget in your Flutter app, make sure you have installed the **nb_maps_flutter** package and added the necessary dependencies to your **pubspec.yaml** file.

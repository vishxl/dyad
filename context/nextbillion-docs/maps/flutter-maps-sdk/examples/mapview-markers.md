# MapView Markers

## Introduction

This example shows how to add markers in bulk

- Add markers in bulk to MapView
- Long Click MapView to Add a marker with clicked point

| ![documentation image](https://static.nextbillion.io/docs-next/docs/maps/flutter/examples/mapview-markers-1.webp) | ![documentation image](https://static.nextbillion.io/docs-next/docs/maps/flutter/examples/mapview-markers-2.webp) |
| ----------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| **Android snapshot**                                                                                              | **iOS snapshot**                                                                                                  |

For all code examples, refer to [Flutter Maps SDK Code Examples](https://github.com/nextbillion-ai/nb-maps-flutter)

**CustomMarkerPage** [view source](https://github.com/nextbillion-ai/nb-maps-flutter/blob/main/example/lib/custom_marker.dart)

```dart
import 'dart:io';
import 'dart:math';

import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart'; // ignore: unnecessary_import
import 'package:nb_maps_flutter/nb_maps_flutter.dart';

import 'page.dart';

const randomMarkerNum = 10;

class CustomMarkerPage extends ExamplePage {
 CustomMarkerPage() : super(const Icon(Icons.place), 'Custom marker');

 @override
 Widget build(BuildContext context) {
   return CustomMarker();
 }
}

class CustomMarker extends StatefulWidget {
 const CustomMarker();

 @override
 State createState() => CustomMarkerState();
}

class CustomMarkerState extends State<CustomMarker> {
 final Random _rnd = new Random();

 late NextbillionMapController _mapController;
 List<Marker> _markers = [];
 List<_MarkerState> _markerStates = [];

 void _addMarkerStates(_MarkerState markerState) {
   _markerStates.add(markerState);
 }

 void _onMapCreated(NextbillionMapController controller) {
   _mapController = controller;
   controller.addListener(() {
     if (controller.isCameraMoving) {
       _updateMarkerPosition();
     }
   });
 }

 void _onStyleLoadedCallback() {
   print('onStyleLoadedCallback');
 }

 void _onMapLongClickCallback(Point<double> point, LatLng coordinates) {
   _addMarker(point, coordinates);
 }

 void _onCameraIdleCallback() {
   _updateMarkerPosition();
 }

 void _updateMarkerPosition() {
   final coordinates = <LatLng>[];

   for (final markerState in _markerStates) {
     coordinates.add(markerState.getCoordinate());
   }

   _mapController.toScreenLocationBatch(coordinates).then((points) {
     _markerStates.asMap().forEach((i, value) {
       _markerStates[i].updatePosition(points[i]);
     });
   });
 }

 void _addMarker(Point<double> point, LatLng coordinates) {
   setState(() {
     _markers.add(Marker(_rnd.nextInt(100000).toString(), coordinates, point,
         _addMarkerStates));
   });
 }

 @override
 Widget build(BuildContext context) {
   return new Container(
     child: Stack(children: [
       NBMap(
         trackCameraPosition: true,
         onMapCreated: _onMapCreated,
         onMapLongClick: _onMapLongClickCallback,
         onCameraIdle: _onCameraIdleCallback,
         onStyleLoadedCallback: _onStyleLoadedCallback,
         initialCameraPosition:
             const CameraPosition(target: LatLng(35.0, 135.0), zoom: 5),
       ),
       IgnorePointer(
           ignoring: true,
           child: Stack(
             children: _markers,
           )),
       FloatingActionButton(
         onPressed: () {
           // Generate random markers
           var param = <LatLng>[];
           for (var i = 0; i < randomMarkerNum; i++) {
             final lat = _rnd.nextDouble() * 20 + 30;
             final lng = _rnd.nextDouble() * 20 + 125;
             param.add(LatLng(lat, lng));
           }

           _mapController.toScreenLocationBatch(param).then((value) {
             for (var i = 0; i < randomMarkerNum; i++) {
               var point =
                   Point<double>(value[i].x as double, value[i].y as double);
               _addMarker(point, param[i]);
             }
           });
         },
         child: Icon(Icons.add),
       ),
     ]),
   );
 }

 // ignore: unused_element
 void _measurePerformance() {
   final trial = 10;
   final batches = [500, 1000, 1500, 2000, 2500, 3000];
   var results = Map<int, List<double>>();
   for (final batch in batches) {
     results[batch] = [0.0, 0.0];
   }

   _mapController.toScreenLocation(LatLng(0, 0));
   Stopwatch sw = Stopwatch();

   for (final batch in batches) {
     //
     // primitive
     //
     for (var i = 0; i < trial; i++) {
       sw.start();
       var list = <Future<Point<num>>>[];
       for (var j = 0; j < batch; j++) {
         var p = _mapController
             .toScreenLocation(LatLng(j.toDouble() % 80, j.toDouble() % 300));
         list.add(p);
       }
       Future.wait(list);
       sw.stop();
       results[batch]![0] += sw.elapsedMilliseconds;
       sw.reset();
     }

     //
     // batch
     //
     for (var i = 0; i < trial; i++) {
       sw.start();
       var param = <LatLng>[];
       for (var j = 0; j < batch; j++) {
         param.add(LatLng(j.toDouble() % 80, j.toDouble() % 300));
       }
       Future.wait([_mapController.toScreenLocationBatch(param)]);
       sw.stop();
       results[batch]![1] += sw.elapsedMilliseconds;
       sw.reset();
     }

     print(
         'batch=$batch,primitive=${results[batch]![0] / trial}ms, batch=${results[batch]![1] / trial}ms');
   }
 }
}

class Marker extends StatefulWidget {
 final Point _initialPosition;
 final LatLng _coordinate;
 final void Function(_MarkerState) _addMarkerState;

 Marker(
     String key, this._coordinate, this._initialPosition, this._addMarkerState)
     : super(key: Key(key));

 @override
 State<StatefulWidget> createState() {
   final state = _MarkerState(_initialPosition);
   _addMarkerState(state);
   return state;
 }
}

class _MarkerState extends State with TickerProviderStateMixin {
 final _iconSize = 20.0;

 Point _position;

 _MarkerState(this._position);

 @override
 void initState() {
   super.initState();
 }

 @override
 void dispose() {
   super.dispose();
 }

 @override
 Widget build(BuildContext context) {
   var ratio = 1.0;

   // web does not support Platform._operatingSystem
   if (!kIsWeb) {
     // iOS returns logical pixel while Android returns screen pixel
     ratio = Platform.isIOS ? 1.0 : MediaQuery.of(context).devicePixelRatio;
   }

   return Positioned(
       left: _position.x / ratio - _iconSize / 2,
       top: _position.y / ratio - _iconSize / 2,
       child: Image.asset('assets/symbols/2.0x/custom-icon.png',
           height: _iconSize));
 }

 void updatePosition(Point<num> point) {
   setState(() {
     _position = point;
   });
 }

 LatLng getCoordinate() {
   return (widget as Marker)._coordinate;
 }
}
```

## Code summary

The above code snippet demonstrates how to implement a custom marker feature in a Flutter application using the **nb_maps_flutter** package. The custom markers are added to the map when:

- the user performs a long-press gesture
- User click on the floating button on the top left corner And the marker positions are updated when the map is moved.

**CustomMarker Class**: is a **StatefulWidget** class that represents the custom marker widget. It uses the **NextbillionMapController** to interact with the map and manages a list of custom \_MarkerState instances to keep track of the markers on the map.

**CustomMarkerState Class**: is the state class for the CustomMarker widget. It handles map-related events and manages the markers on the map. Notable methods include:

- **\_onMapCreated**: Handles the initialization of the map controller and sets up a listener for camera movements.
- **\_onStyleLoadedCallback**: A callback method that is called when the map style is loaded.
- **\_onMapLongClickCallback**: Handles the event when the user long-presses on the map to add a new custom marker.
- **\_onCameraIdleCallback**: Handles the event when the camera stops moving and triggers the update of marker positions.
- **\_addMarker**: Adds a new custom marker to the map and updates the list of markers.

**build Method**: returns a Container widget containing a Stack with multiple child widgets:

- **NBMap**: The actual map widget, provided by the nb_maps_flutter package. It handles user interactions and displays the custom markers on the map.
- **IgnorePointer**: A widget that ignores touch events, ensuring that the custom markers do not interfere with user interactions with the map.
- **FloatingActionButton**: A button that, when pressed, generates and adds random markers to the map.

**\_MarkerState Class**: This class represents the state of a custom marker. It extends State and is responsible for rendering the custom marker image on the map. Notable methods include:

- **build**: Builds the marker widget based on the marker's position and icon image.
- **updatePosition**: Updates the marker's position when the map is moved.
- **getCoordinate**: Retrieves the coordinate of the marker on the map.

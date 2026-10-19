# Mapview Circle Annotation

## Introduction

This example shows how to add Circle annotations in **MapView**

- Add Circle annotations from a set of **Latlng**
- Set Circle annotation opacity, color, radius
- Set Circle annotation stroke width, stroke color

| ![documentation image](https://static.nextbillion.io/docs-next/docs/maps/flutter/examples/mapview-circle-annotation-2.webp) | ![documentation image](https://static.nextbillion.io/docs-next/docs/maps/flutter/examples/mapview-circle-annotation-1.webp) |
| --------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| **Android snapshot**                                                                                                        | **iOS snapshot**                                                                                                            |

For all code examples, refer to [Flutter Maps SDK Code Examples](https://github.com/nextbillion-ai/nb-maps-flutter)

**PlaceCirclePage** [view source](https://github.com/nextbillion-ai/nb-maps-flutter/blob/main/example/lib/place_circle.dart)

```dart
import 'dart:async';
import 'dart:math';

import 'package:flutter/material.dart';
import 'package:nb_maps_flutter/nb_maps_flutter.dart';

import 'page.dart';

class PlaceCirclePage extends ExamplePage {
 PlaceCirclePage() : super(const Icon(Icons.check_circle), 'Place circle');

 @override
 Widget build(BuildContext context) {
   return const PlaceCircleBody();
 }
}

class PlaceCircleBody extends StatefulWidget {
 const PlaceCircleBody();

 @override
 State<StatefulWidget> createState() => PlaceCircleBodyState();
}

class PlaceCircleBodyState extends State<PlaceCircleBody> {
 PlaceCircleBodyState();

 static final LatLng center = const LatLng(-33.86711, 151.1947171);

 NextbillionMapController? controller;
 int _circleCount = 0;
 Circle? _selectedCircle;

 void _onMapCreated(NextbillionMapController controller) {
   this.controller = controller;
   controller.onCircleTapped.add(_onCircleTapped);
 }

 @override
 void dispose() {
   controller?.onCircleTapped.remove(_onCircleTapped);
   super.dispose();
 }

 void _onCircleTapped(Circle circle) {
   if (_selectedCircle != null) {
     _updateSelectedCircle(
       const CircleOptions(circleRadius: 60),
     );
   }
   setState(() {
     _selectedCircle = circle;
   });
   _updateSelectedCircle(
     CircleOptions(
       circleRadius: 30,
     ),
   );
 }

 void _updateSelectedCircle(CircleOptions changes) {
   controller!.updateCircle(_selectedCircle!, changes);
 }

 void _add() {
   controller!.addCircle(
     CircleOptions(
         geometry: LatLng(
           center.latitude + sin(_circleCount * pi / 6.0) / 20.0,
           center.longitude + cos(_circleCount * pi / 6.0) / 20.0,
         ),
         circleColor: "#FF0000"),
   );
   setState(() {
     _circleCount += 1;
   });
 }

 void _remove() {
   controller!.removeCircle(_selectedCircle!);
   setState(() {
     _selectedCircle = null;
     _circleCount -= 1;
   });
 }

 void _changePosition() {
   final LatLng current = _selectedCircle!.options.geometry!;
   final Offset offset = Offset(
     center.latitude - current.latitude,
     center.longitude - current.longitude,
   );
   _updateSelectedCircle(
     CircleOptions(
       geometry: LatLng(
         center.latitude + offset.dy,
         center.longitude + offset.dx,
       ),
     ),
   );
 }

 void _changeDraggable() {
   bool? draggable = _selectedCircle!.options.draggable;
   if (draggable == null) {
     // default value
     draggable = false;
   }
   _updateSelectedCircle(
     CircleOptions(
       draggable: !draggable,
     ),
   );
 }

 void _getLatLng() async {
   LatLng latLng = await controller!.getCircleLatLng(_selectedCircle!);
   ScaffoldMessenger.of(context).showSnackBar(
     SnackBar(
       content: Text(latLng.toString()),
     ),
   );
 }

 void _changeCircleStrokeOpacity() {
   double? current = _selectedCircle!.options.circleStrokeOpacity;
   if (current == null) {
     // default value
     current = 1.0;
   }

   _updateSelectedCircle(
     CircleOptions(circleStrokeOpacity: current < 0.1 ? 1.0 : current * 0.75),
   );
 }

 void _changeCircleStrokeWidth() {
   double? current = _selectedCircle!.options.circleStrokeWidth;
   if (current == null) {
     // default value
     current = 0;
   }
   _updateSelectedCircle(
       CircleOptions(circleStrokeWidth: current == 0 ? 5.0 : 0));
 }

 Future<void> _changeCircleStrokeColor() async {
   String? current = _selectedCircle!.options.circleStrokeColor;
   if (current == null) {
     // default value
     current = "#FFFFFF";
   }

   _updateSelectedCircle(
     CircleOptions(
         circleStrokeColor: current == "#FFFFFF" ? "#FF0000" : "#FFFFFF"),
   );
 }

 Future<void> _changeCircleOpacity() async {
   double? current = _selectedCircle!.options.circleOpacity;
   if (current == null) {
     // default value
     current = 1.0;
   }

   _updateSelectedCircle(
     CircleOptions(circleOpacity: current < 0.1 ? 1.0 : current * 0.75),
   );
 }

 Future<void> _changeCircleRadius() async {
   double? current = _selectedCircle!.options.circleRadius;
   if (current == null) {
     // default value
     current = 0;
   }
   _updateSelectedCircle(
     CircleOptions(circleRadius: current == 120.0 ? 30.0 : current + 30.0),
   );
 }

 Future<void> _changeCircleColor() async {
   String? current = _selectedCircle!.options.circleColor;
   if (current == null) {
     // default value
     current = "#FF0000";
   }

   _updateSelectedCircle(
     CircleOptions(circleColor: "#FFFF00"),
   );
 }

 Future<void> _changeCircleBlur() async {
   double? current = _selectedCircle!.options.circleBlur;
   if (current == null) {
     // default value
     current = 0;
   }
   _updateSelectedCircle(
     CircleOptions(circleBlur: current == 0.75 ? 0 : 0.75),
   );
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
             initialCameraPosition: const CameraPosition(
               target: LatLng(-33.852, 151.211),
               zoom: 11.0,
             ),
           ),
         ),
       ),
       Expanded(
         child: SingleChildScrollView(
           child: Row(
             mainAxisAlignment: MainAxisAlignment.spaceEvenly,
             children: <Widget>[
               Row(
                 children: <Widget>[
                   Column(
                     children: <Widget>[
                       TextButton(
                         child: const Text('add'),
                         onPressed: (_circleCount == 12) ? null : _add,
                       ),
                       TextButton(
                         child: const Text('remove'),
                         onPressed: (_selectedCircle == null) ? null : _remove,
                       ),
                     ],
                   ),
                   Column(
                     children: <Widget>[
                       TextButton(
                         child: const Text('change circle-opacity'),
                         onPressed: (_selectedCircle == null)
                             ? null
                             : _changeCircleOpacity,
                       ),
                       TextButton(
                         child: const Text('change circle-radius'),
                         onPressed: (_selectedCircle == null)
                             ? null
                             : _changeCircleRadius,
                       ),
                       TextButton(
                         child: const Text('change circle-color'),
                         onPressed: (_selectedCircle == null)
                             ? null
                             : _changeCircleColor,
                       ),
                       TextButton(
                         child: const Text('change circle-blur'),
                         onPressed: (_selectedCircle == null)
                             ? null
                             : _changeCircleBlur,
                       ),
                       TextButton(
                         child: const Text('change circle-stroke-width'),
                         onPressed: (_selectedCircle == null)
                             ? null
                             : _changeCircleStrokeWidth,
                       ),
                       TextButton(
                         child: const Text('change circle-stroke-color'),
                         onPressed: (_selectedCircle == null)
                             ? null
                             : _changeCircleStrokeColor,
                       ),
                       TextButton(
                         child: const Text('change circle-stroke-opacity'),
                         onPressed: (_selectedCircle == null)
                             ? null
                             : _changeCircleStrokeOpacity,
                       ),
                       TextButton(
                         child: const Text('change position'),
                         onPressed: (_selectedCircle == null)
                             ? null
                             : _changePosition,
                       ),
                       TextButton(
                         child: const Text('toggle draggable'),
                         onPressed: (_selectedCircle == null)
                             ? null
                             : _changeDraggable,
                       ),
                       TextButton(
                         child: const Text('get current LatLng'),
                         onPressed:
                             (_selectedCircle == null) ? null : _getLatLng,
                       ),
                     ],
                   ),
                 ],
               )
             ],
           ),
         ),
       ),
     ],
   );
 }
}
```

## Code summary

The above code snippet displays nbMap with various functionalities related to circles. The user can interact with the map, add and remove circles, change circle properties (such as opacity, radius, color, blur, and stroke), move circles, and toggle the circle's draggable state. It utilizes the **nb_maps_flutter** package for map-related functionalities.

**PlaceCirclePage Class**: extends the **ExamplePage** class and represents a page in the app that demonstrates circle-related functionalities. The page is associated with an icon (check_circle icon) and a title ('Place circle'). The build method returns a **PlaceCircleBody** widget.

**PlaceCircleBody Class**: is a StatefulWidget class representing the main body of the PlaceCirclePage. It manages the state of the PlaceCirclePage and contains the map and various buttons for interacting with circles.

**PlaceCircleBodyState Class**: is the state class for the PlaceCircleBody widget. It handles the interactions with the map, such as adding circles, updating circle properties, and removing circles. Some key methods include:

- **\_onMapCreated**: A callback method called when the map is created. It sets the map controller and adds a listener for circle taps.
- **\_onCircleTapped**: A method called when a circle on the map is tapped. It changes the properties of the selected circle, making it larger and updates its appearance. The previously selected circle, if any, is reverted to its original size and appearance.
- **\_updateSelectedCircle**: A method to update the properties of the selected circle.
- **\_add**: A method to add a new circle to the map. It calculates the position of the circle based on the current \_circleCount and the center of the map.
- **\_remove**: A method to remove the selected circle from the map.
- **\_changePosition**: A method to change the position of the selected circle on the map.
- **\_changeDraggable**: A method to toggle the draggable property of the selected circle.
- **\_getLatLng**: A method to retrieve the latitude and longitude of the selected circle and display it using a SnackBar. Methods to change various circle properties like opacity, radius, color, blur, stroke width, and stroke color.

**build Method**: The build method returns a Column widget containing a map **(NBMap)** and a set of buttons for interacting with the circles. The buttons include 'add', 'remove', 'change circle-opacity', 'change circle-radius', 'change circle-color', 'change circle-blur', 'change circle-stroke-width', 'change circle-stroke-color', 'change circle-stroke-opacity', 'change position', 'toggle draggable', and 'get current LatLng'. The map displays circles, and when a circle is tapped, it becomes selected, and its properties can be modified using the buttons.

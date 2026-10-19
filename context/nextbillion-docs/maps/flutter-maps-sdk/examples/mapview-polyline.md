# MapView Polyline

## Introduction

This example shows how to add PolyLines in MapView

- Add Polyline to Mapview from a set of LatLng
- Set Polyline opacity
- Set polyline visibility
- Move Polyline position

| ![documentation image](https://static.nextbillion.io/docs-next/docs/maps/flutter/examples/mapview-polyline-2.webp) | ![documentation image](https://static.nextbillion.io/docs-next/docs/maps/flutter/examples/mapview-polyline-1.webp) |
| ------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------ |
| **Android snapshot**                                                                                               | **iOS snapshot**                                                                                                   |

For all code examples, refer to [Flutter Maps SDK Code Examples](https://github.com/nextbillion-ai/nb-maps-flutter)

**LinePage** [view source](https://github.com/nextbillion-ai/nb-maps-flutter/blob/main/example/lib/line.dart)

```dart
import 'dart:async';
import 'dart:typed_data';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:nb_maps_flutter/nb_maps_flutter.dart';

import 'page.dart';

class LinePage extends ExamplePage {
 LinePage() : super(const Icon(Icons.share), 'Line');

 @override
 Widget build(BuildContext context) {
   return const LineBody();
 }
}

class LineBody extends StatefulWidget {
 const LineBody();

 @override
 State<StatefulWidget> createState() => LineBodyState();
}

class LineBodyState extends State<LineBody> {
 LineBodyState();

 static final LatLng center = const LatLng(-33.86711, 151.1947171);

 NextbillionMapController? controller;
 int _lineCount = 0;
 Line? _selectedLine;
 final String _linePatternImage = "assets/fill/cat_silhouette_pattern.png";

 void _onMapCreated(NextbillionMapController controller) {
   this.controller = controller;
   controller.onLineTapped.add(_onLineTapped);
 }

 @override
 void dispose() {
   controller?.onLineTapped.remove(_onLineTapped);
   super.dispose();
 }

 /// Adds an asset image to the currently displayed style
 Future<void> addImageFromAsset(String name, String assetName) async {
   final ByteData bytes = await rootBundle.load(assetName);
   final Uint8List list = bytes.buffer.asUint8List();
   return controller!.addImage(name, list);
 }

 _onLineTapped(Line line) async {
   await _updateSelectedLine(
     LineOptions(lineColor: "#ff0000"),
   );
   setState(() {
     _selectedLine = line;
   });
   await _updateSelectedLine(
     LineOptions(lineColor: "#ffe100"),
   );
 }

 _updateSelectedLine(LineOptions changes) async {
   if (_selectedLine != null) controller!.updateLine(_selectedLine!, changes);
 }

 void _add() {
   controller!.addLine(
     LineOptions(
         geometry: [
           LatLng(-33.86711, 151.1947171),
           LatLng(-33.86711, 151.1947171),
           LatLng(-32.86711, 151.1947171),
           LatLng(-33.86711, 152.1947171),
         ],
         lineColor: "#ff0000",
         lineWidth: 14.0,
         lineOpacity: 0.5,
         draggable: true),
   );
   setState(() {
     _lineCount += 1;
   });
 }

 _move() async {
   final currentStart = _selectedLine!.options.geometry![0];
   final currentEnd = _selectedLine!.options.geometry![1];
   final end =
       LatLng(currentEnd.latitude + 0.001, currentEnd.longitude + 0.001);
   final start =
       LatLng(currentStart.latitude - 0.001, currentStart.longitude - 0.001);
   await controller!
       .updateLine(_selectedLine!, LineOptions(geometry: [start, end]));
 }

 void _remove() {
   controller!.removeLine(_selectedLine!);
   setState(() {
     _selectedLine = null;
     _lineCount -= 1;
   });
 }

 Future<void> _changeLinePattern() async {
   String? current =
       _selectedLine!.options.linePattern == null ? "assetImage" : null;
   await _updateSelectedLine(
     LineOptions(linePattern: current),
   );
 }

 Future<void> _changeAlpha() async {
   double? current = _selectedLine!.options.lineOpacity;
   if (current == null) {
     // default value
     current = 1.0;
   }

   await _updateSelectedLine(
     LineOptions(lineOpacity: current < 0.1 ? 1.0 : current * 0.75),
   );
 }

 Future<void> _toggleVisible() async {
   double? current = _selectedLine!.options.lineOpacity;
   if (current == null) {
     // default value
     current = 1.0;
   }
   await _updateSelectedLine(
     LineOptions(lineOpacity: current == 0.0 ? 1.0 : 0.0),
   );
 }

 _onStyleLoadedCallback() async {
   addImageFromAsset("assetImage", _linePatternImage);
   await controller!.addLine(
     LineOptions(
       geometry: [LatLng(37.4220, -122.0841), LatLng(37.4240, -122.0941)],
       lineColor: "#ff0000",
       lineWidth: 14.0,
       lineOpacity: 0.5,
     ),
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
           height: 400.0,
           child: NBMap(
             onMapCreated: _onMapCreated,
             onStyleLoadedCallback: _onStyleLoadedCallback,
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
               Column(
                 children: <Widget>[
                   Row(
                     children: <Widget>[
                       TextButton(
                         child: const Text('add'),
                         onPressed: (_lineCount == 12) ? null : _add,
                       ),
                       TextButton(
                         child: const Text('remove'),
                         onPressed: (_selectedLine == null) ? null : _remove,
                       ),
                       TextButton(
                         child: const Text('move'),
                         onPressed: (_selectedLine == null)
                             ? null
                             : () async {
                                 await _move();
                               },
                       ),
                       TextButton(
                         child: const Text('change line-pattern'),
                         onPressed: (_selectedLine == null)
                             ? null
                             : _changeLinePattern,
                       ),
                     ],
                   ),
                   Row(
                     children: <Widget>[
                       TextButton(
                         child: const Text('change alpha'),
                         onPressed:
                             (_selectedLine == null) ? null : _changeAlpha,
                       ),
                       TextButton(
                         child: const Text('toggle visible'),
                         onPressed:
                             (_selectedLine == null) ? null : _toggleVisible,
                       ),
                       TextButton(
                         child: const Text('print current LatLng'),
                         onPressed: (_selectedLine == null)
                             ? null
                             : () async {
                                 var latLngs = await controller!
                                     .getLineLatLngs(_selectedLine!);
                                 for (var latLng in latLngs) {
                                   print(latLng.toString());
                                 }
                               },
                       ),
                     ],
                   ),
                 ],
               ),
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

The above code snippet demonstrates the implementation of a Flutter application that utilizes the **nb_maps_flutter** package to display a map with various functionalities related to lines and markers.

**LinePage Class**: extends the **ExamplePage** class and represents a page in the app that demonstrates line-related functionalities. The page is associated with an icon (share icon) and a title ('Line'). The build method returns a LineBody widget.

**LineBody Class**: is a StatefulWidget class representing the main body of the LinePage. It manages the state of the LinePage and contains the map and various buttons for interacting with the map.

**LineBodyState Class**: is the state class for the LineBody widget. It handles the interactions with the map, such as adding lines, updating line properties, and removing lines. Some key methods include:

- **\_onMapCreated**: A callback method called when the map is created. It sets the map controller and adds a listener for when a line is tapped.
- **dispose**: A method called when the widget is disposed. It removes the listener for line taps.
- **addImageFromAsset**: A method for adding an image from an asset to the currently displayed style of the map.
- **\_onLineTapped**: A callback method called when a line on the map is tapped. It updates the line color to red when tapped and to yellow when tapped again.
- **\_add**: A method for adding a new line to the map with specific properties such as color, width, opacity, and whether it is draggable.
- **\_move**: A method for moving the currently selected line on the map.
- **\_remove**: A method for removing the currently selected line from the map.
- **\_changeLinePattern**: A method for changing the pattern of the currently selected line.
- **\_changeAlpha**: A method for changing the opacity of the currently selected line.
- **\_toggleVisible**: A method for toggling the visibility of the currently selected line.
- **\_onStyleLoadedCallback**: A callback method called when the map style is loaded. It adds an image from an asset to the style and initializes a line on the map with specific properties.

**build Method**: The build method returns a Column widget containing a map **(NBMap)** and a set of buttons for interacting with the map. The buttons include 'add', 'remove', 'move', 'change line-pattern', 'change alpha', 'toggle visible', and 'print current LatLng'. The map displays lines, and when a line is tapped, its color changes, and the selected line's properties can be modified using the buttons.

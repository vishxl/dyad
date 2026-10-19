# Mapview Annotations Callbacks

## Introduction

This example shows how to add Polygons in MapView

- Add different types of annotations from a set of Latlng
- Add onTap events for the annotations

| ![documentation image](https://static.nextbillion.io/docs-next/docs/maps/flutter/examples/mapview-annotations-callbacks-1.webp) | ![documentation image](https://static.nextbillion.io/docs-next/docs/maps/flutter/examples/mapview-annotations-callbacks-2.webp) |
| ------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| **Android snapshot**                                                                                                            | **iOS snapshot**                                                                                                                |

For all code examples, refer to [Flutter Maps SDK Code Examples](https://github.com/nextbillion-ai/nb-maps-flutter)

**ClickAnnotationsPage** [view source](https://github.com/nextbillion-ai/nb-maps-flutter/blob/main/example/lib/click_annotations.dart)

```dart
import 'package:flutter/material.dart';
import 'package:nb_maps_flutter/nb_maps_flutter.dart';

import 'page.dart';

class ClickAnnotationPage extends ExamplePage {
 ClickAnnotationPage()
     : super(const Icon(Icons.check_circle), 'Annotation tap');

 @override
 Widget build(BuildContext context) {
   return const ClickAnnotationBody();
 }
}

class ClickAnnotationBody extends StatefulWidget {
 const ClickAnnotationBody();

 @override
 State<StatefulWidget> createState() => ClickAnnotationBodyState();
}

class ClickAnnotationBodyState extends State<ClickAnnotationBody> {
 ClickAnnotationBodyState();

 static const LatLng center = const LatLng(-33.88, 151.16);
 bool overlapping = false;

 NextbillionMapController? controller;

 void _onMapCreated(NextbillionMapController controller) {
   this.controller = controller;
   controller.onFillTapped.add(_onFillTapped);
   controller.onCircleTapped.add(_onCircleTapped);
   controller.onLineTapped.add(_onLineTapped);
   controller.onSymbolTapped.add(_onSymbolTapped);
 }

 @override
 void dispose() {
   controller?.onFillTapped.remove(_onFillTapped);
   controller?.onCircleTapped.remove(_onCircleTapped);
   controller?.onLineTapped.remove(_onLineTapped);
   controller?.onSymbolTapped.remove(_onSymbolTapped);
   super.dispose();
 }

 _showSnackBar(String type, String id) {
   final snackBar = SnackBar(
       content: Text('Tapped $type $id',
           style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
       backgroundColor: Theme.of(context).primaryColor);
   ScaffoldMessenger.of(context).clearSnackBars();
   ScaffoldMessenger.of(context).showSnackBar(snackBar);
 }

 void _onFillTapped(Fill fill) {
   _showSnackBar('fill', fill.id);
 }

 void _onCircleTapped(Circle circle) {
   _showSnackBar('circle', circle.id);
 }

 void _onLineTapped(Line line) {
   _showSnackBar('line', line.id);
 }

 void _onSymbolTapped(Symbol symbol) {
   _showSnackBar('symbol', symbol.id);
 }

 void _onStyleLoaded() {
   controller!.addCircle(
     CircleOptions(
       geometry: LatLng(-33.881979408447314, 151.171361438502117),
       circleStrokeColor: "#00FF00",
       circleStrokeWidth: 2,
       circleRadius: 16,
     ),
   );
   controller!.addCircle(
     CircleOptions(
       geometry: LatLng(-33.894372606072309, 151.17576679759523),
       circleStrokeColor: "#00FF00",
       circleStrokeWidth: 2,
       circleRadius: 30,
     ),
   );
   controller!.addSymbol(
     SymbolOptions(
         geometry: LatLng(-33.894372606072309, 151.17576679759523),
         iconImage: "fast-food-15",
         iconSize: 2),
   );
   controller!.addLine(
     LineOptions(
       geometry: [
         LatLng(-33.874867744475786, 151.170627211986584),
         LatLng(-33.881979408447314, 151.171361438502117),
         LatLng(-33.887058805548882, 151.175032571079726),
         LatLng(-33.894372606072309, 151.17576679759523),
         LatLng(-33.900060683994681, 151.15765587687909),
       ],
       lineColor: "#0000FF",
       lineWidth: 20,
     ),
   );

   controller!.addFill(
     FillOptions(
       geometry: [
         [
           LatLng(-33.901517742631846, 151.178099204457737),
           LatLng(-33.872845324482071, 151.179025547977773),
           LatLng(-33.868230472039514, 151.147000529140399),
           LatLng(-33.883172899638311, 151.150838238009328),
           LatLng(-33.894158309528244, 151.14223647675135),
           LatLng(-33.904812805307806, 151.155999294764086),
           LatLng(-33.901517742631846, 151.178099204457737),
         ],
       ],
       fillColor: "#FF0000",
       fillOutlineColor: "#000000",
     ),
   );
 }

 @override
 Widget build(BuildContext context) {
   return Scaffold(
     body: NBMap(
       annotationOrder: [
         AnnotationType.fill,
         AnnotationType.line,
         AnnotationType.circle,
         AnnotationType.symbol,
       ],
       onMapCreated: _onMapCreated,
       onStyleLoadedCallback: _onStyleLoaded,
       initialCameraPosition: const CameraPosition(
         target: center,
         zoom: 12.0,
       ),
     ),
     floatingActionButton: ElevatedButton(
         onPressed: () {
           setState(() {
             overlapping = !overlapping;
           });
           controller!.setSymbolIconAllowOverlap(overlapping);
           controller!.setSymbolIconIgnorePlacement(overlapping);

           controller!.setSymbolTextAllowOverlap(overlapping);
           controller!.setSymbolTextIgnorePlacement(overlapping);
         },
         child: Padding(
           padding: const EdgeInsets.all(8.0),
           child: Text("Toggle overlapping"),
         )),
   );
 }
}
```

## Code summary

The above code snippet displays a nbMap with various annotations (fills, circles, lines, symbols) and allows interactions with these annotations through tapping. The **nb_maps_flutter** package is used for map-related functionalities, and the map annotations are organized in a specific order (fills, lines, circles, symbols) specified in the **annotationOrder** parameter.

**ClickAnnotationPage Class**: extends the **ExamplePage** class and represents a page in the app that demonstrates annotation tapping. The page is associated with an icon (check_circle icon) and a title (Annotation tap). The build method returns a ClickAnnotationBody widget.

**ClickAnnotationBody Class**: is a StatefulWidget class representing the main body of the **ClickAnnotationPage**. It manages the state of the ClickAnnotationPage and contains the map and a toggle button to control overlapping of symbols and texts.

**ClickAnnotationBodyState Class**: This is the state class for the **ClickAnnotationBody** widget. It handles the interactions with the map, such as setting up the map controller, adding listeners for various annotation types (fill, circle, line, symbol), and displaying SnackBars when annotations are tapped. The **onStyleLoaded** method is used to add circles, lines, symbols, and fills to the map.

**\_showSnackBar Method**: A private method to show a SnackBar with information about the type and id of the tapped annotation.

**build Method**: returns a Scaffold widget containing an **NBMap** widget, which displays the map with various annotations. The annotation order is specified to determine the z-order of annotations (fills, lines, circles, symbols). A floating action button (ElevatedButton) is used to toggle the overlapping behavior of symbols and texts. When the button is pressed, overlapping is toggled, and relevant map controller methods are called accordingly to handle overlapping behavior.

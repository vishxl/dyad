# MapView Style

## introduction

This Example Shows:

- Display a MapView Widget
- Update mapview style by setting the **styleString** in NBMap Widget

| ![documentation image](https://static.nextbillion.io/docs-next/docs/navigation/flutter/examples/mapview-style-1.webp) | ![documentation image](https://static.nextbillion.io/docs-next/docs/navigation/flutter/examples/mapview-style-2.webp) |
| --------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| **Android snapshot**                                                                                                  | **iOS snapshot**                                                                                                      |

For all code examples, refer to [Flutter Navigation Code Example](https://github.com/nextbillion-ai/nb-navigation-flutter)

**MapViewStyle** [view source](https://github.com/nextbillion-ai/nb-navigation-flutter/blob/main/example/lib/map_view_style.dart)

```dart
import 'package:flutter/material.dart';
import 'package:nb_navigation_flutter/nb_navigation_flutter.dart';

class MapViewStyle extends StatefulWidget {
  static const String title = "MapView Style";

  const MapViewStyle({super.key});

  @override
  MapViewStyleState createState() => MapViewStyleState();
}

class MapViewStyleState extends State<MapViewStyle> {
  NextbillionMapController? controller;
  var isLight = true;

  void _onMapCreated(NextbillionMapController controller) {
    this.controller = controller;
  }

  void _onStyleLoaded() {}

  @override
  void initState() {
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text(MapViewStyle.title),
      ),
      floatingActionButton: Padding(
        padding: const EdgeInsets.all(32.0),
        child: FloatingActionButton(
          child: const Icon(Icons.swap_horiz),
          onPressed: () => setState(
            () => isLight = !isLight,
          ),
        ),
      ),
      body: Stack(
        children: [
          NBMap(
            onMapCreated: _onMapCreated,
            initialCameraPosition: const CameraPosition(
              target: LatLng(1.312533169133601, 103.76986708439264),
              zoom: 13.0,
            ),
            onStyleLoadedCallback: _onStyleLoaded,
            styleString: isLight ? NbMapStyles.LIGHT : NbMapStyles.DARK,
          ),
        ],
      ),
    );
  }

  @override
  void dispose() {
    super.dispose();
  }
}
```

## Code summary

The above code snippet demonstrates how to display a map view widget using nb_maps_flutter and how to update the map view style dynamically between light and dark modes.

## Display a MapView Widget:

- The MapViewStyle widget is the main entry point of the application.

- The **\_onMapCreated** function is called when the map is created, and it sets the map controller to be used for controlling the map.

- The NBMap widget from the **nb_maps_flutter** package is used to display the map. It is positioned in a Stack widget along with the "FloatingActionButton" widget.

## Update MapView Style:

- The isLight variable is used to determine whether the map view style should be light or dark. It is initially set to true, indicating the light mode.

- A "FloatingActionButton" is provided at the bottom right corner of the screen, allowing the user to toggle between light and dark styles by pressing the "swap_horiz" icon.

- When the FloatingActionButton is pressed, the setState function is called to update the isLight variable, toggling it between true and false.

- The **styleString** property of the NBMap widget is used to set the map view style. If isLight is true, the light style is applied **(NbMapStyles.LIGHT)**, otherwise, the dark style is applied **(NbMapStyles.DARK)**.

When the app is launched, it displays a map view with the initial light mode. When the "FloatingActionButton" is pressed, the map view style toggles between light and dark modes dynamically. Please ensure that you have the necessary permissions and API keys set up to use the mapping services properly.

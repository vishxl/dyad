# Draw Route Line

This example shows:

- Draw Route Line
  - await navNextBillionMap.drawRoute(routes)

- Toggle Alternative Routes Visibility
  - navNextBillionMap.toggleAlternativeVisibilityWith(value)

- Toggle Route Duration Symbol Visibility
  - navNextBillionMap.toggleDurationSymbolVisibilityWith(value)

| ![documentation image](https://static.nextbillion.io/docs-next/docs/navigation/flutter/examples/draw-route-line-1.webp) | ![documentation image](https://static.nextbillion.io/docs-next/docs/navigation/flutter/examples/draw-route-line-2.webp) |
| ----------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| **Android snapshot**                                                                                                    | **iOS snapshot**                                                                                                        |

For all code examples, refer to [Flutter Navigation Code Example](https://github.com/nextbillion-ai/nb-navigation-flutter)

**DrawRouteLine** [view source](https://github.com/nextbillion-ai/nb-navigation-flutter/blob/main/example/lib/draw_route_line.dart)

```dart
import 'dart:math';

import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:nb_navigation_flutter/nb_navigation_flutter.dart';

class DrawRouteLine extends StatefulWidget {
  static const String title = "Draw Route Line";

  const DrawRouteLine({super.key});

  @override
  DrawRouteLineState createState() => DrawRouteLineState();
}

class DrawRouteLineState extends State<DrawRouteLine> {
  NextbillionMapController? controller;
  List<DirectionsRoute> routes = [];
  late NavNextBillionMap navNextBillionMap;

  LatLng origin = const LatLng(
    17.457302037173775,
    78.37463792413473,
  );
  LatLng dest = const LatLng(
    17.466320809357967,
    78.3726774987914,
  );

  bool enableAlternativeRoutes = true;
  bool enableRouteDurationSymbol = true;

  void _onMapCreated(NextbillionMapController controller) {
    this.controller = controller;
  }

  void _onStyleLoaded() async {
    if (controller != null) {
      navNextBillionMap = await NavNextBillionMap.create(controller!);
    }
  }

  _onMapClick(Point<double> point, LatLng coordinates) {
    navNextBillionMap.addRouteSelectedListener(coordinates,
        (selectedRouteIndex) {
      if (routes.isNotEmpty && selectedRouteIndex != 0) {
        var selectedRoute = routes[selectedRouteIndex];
        routes.removeAt(selectedRouteIndex);
        routes.insert(0, selectedRoute);
        setState(() {
          routes = routes;
        });
        navNextBillionMap.drawRoute(routes);
      }
    });
  }

  @override
  void initState() {
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    var screenHeight = MediaQuery.of(context).size.height;

    return Scaffold(
      appBar: AppBar(
        title: const Text(DrawRouteLine.title),
      ),
      body: SingleChildScrollView(
        child: Column(
          children: [
            Container(
              constraints: BoxConstraints(maxHeight: screenHeight * 0.6),
              child: NBMap(
                onMapCreated: _onMapCreated,
                initialCameraPosition: CameraPosition(
                  target: LatLng(origin.latitude, origin.longitude),
                  zoom: 13.0,
                ),
                onStyleLoadedCallback: _onStyleLoaded,
                onMapClick: _onMapClick,
              ),
            ),
            _buttonWidget(),
            _switchButton(),
          ],
        ),
      ),
    );
  }

  void _fetchRoute() async {
    RouteRequestParams requestParams = RouteRequestParams(
      origin: origin,
      destination: dest,
      // waypoints: [Coordinate(latitude: wayP2.latitude, longitude: wayP2.longitude)],
      // overview: ValidOverview.simplified,
      // avoid: [SupportedAvoid.toll, SupportedAvoid.ferry],
      // option: SupportedOption.flexible,
      // truckSize: [200, 200, 600],
      // truckWeight: 100,
      // unit: SupportedUnits.imperial,
      alternatives: true,
      mode: ValidModes.car,
    );

    DirectionsRouteResponse routeResponse =
        await NBNavigation.fetchRoute(requestParams);
    if (routeResponse.directionsRoutes.isNotEmpty) {
      setState(() {
        routes = routeResponse.directionsRoutes;
      });
      drawRoutes(routes);
    } else if (routeResponse.message != null) {
      if (kDebugMode) {
        print(
            "====error====${routeResponse.message}===${routeResponse.errorCode}");
      }
    }
  }

  void _startNavigation() {
    if (routes.isEmpty) return;
    NavigationLauncherConfig config =
        NavigationLauncherConfig(route: routes.first, routes: routes);
    config.locationLayerRenderMode = LocationLayerRenderMode.gps;
    config.themeMode = NavigationThemeMode.system;
    config.useCustomNavigationStyle = false;
    NBNavigation.startNavigation(config);
  }

  Future<void> drawRoutes(List<DirectionsRoute> routes) async {
    navNextBillionMap.clearRoute();
    navNextBillionMap.drawRoute(routes);
  }

  @override
  void dispose() {
    super.dispose();
  }

  _buttonWidget() {
    return Padding(
      padding: const EdgeInsets.only(left: 8, top: 18.0),
      child: Row(
        children: [
          ElevatedButton(
            style: ButtonStyle(
              backgroundColor: WidgetStateProperty.all(Colors.blueAccent),
            ),
            onPressed: () {
              _fetchRoute();
            },
            child: const Text("Fetch Route"),
          ),
          const Padding(padding: EdgeInsets.only(left: 8)),
          ElevatedButton(
            style: ButtonStyle(
                backgroundColor: WidgetStateProperty.all(
                    routes.isEmpty ? Colors.grey : Colors.blueAccent),
                enableFeedback: routes.isNotEmpty),
            onPressed: () {
              _startNavigation();
            },
            child: const Text("Start Navigation"),
          ),
        ],
      ),
    );
  }

  _switchButton() {
    return Padding(
      padding: const EdgeInsets.all(8.0),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.end,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Text("Display Alternative Route"),
              Switch(
                  value: enableAlternativeRoutes,
                  onChanged: (value) {
                    setState(() {
                      enableAlternativeRoutes = value;
                    });
                    navNextBillionMap.toggleAlternativeVisibilityWith(value);
                  })
            ],
          ),
          Row(
            children: [
              const Text("Display Route Duration Symbol"),
              Switch(
                  value: enableRouteDurationSymbol,
                  onChanged: (value) async {
                    setState(() {
                      enableRouteDurationSymbol = value;
                    });
                    navNextBillionMap.toggleDurationSymbolVisibilityWith(value);
                  })
            ],
          )
        ],
      ),
    );
  }
}
```

## Code summary

The above code snippet demonstrates how to draw a route line on a map, toggle the visibility of alternative routes, and toggle the visibility of route duration symbols. The app uses the **nb_maps_flutter** and **nb_navigation_flutter** packages for map rendering and navigation-related functionality.

### Draw Route Line:

- The NBMap widget from the **nb_maps_flutter** package is used to display the map.
- When the "Fetch Route" button is pressed, the \_fetchRoute function is called. It sends a route request to the navigation service **(NBNavigation.fetchRoute)** with the specified **origin** and **destination** coordinates. The response contains a list of DirectionsRoute objects representing different possible routes from the origin to the destination.
- The drawRoutes function is used to draw the fetched routes on the map using the **NavNextBillionMap controller**.

### Toggle Alternative Routes Visibility:

- The "Display Alternative Route" switch allows the user to toggle the visibility of alternative routes on the map.
- The enableAlternativeRoutes variable keeps track of the switch state.
- When the switch is toggled, the \_switchButton function calls the toggleAlternativeVisibilityWith method of **NavNextBillionMap** to change the visibility of alternative routes accordingly.

### Toggle Route Duration Symbol Visibility:

- The "Display Route Duration Symbol" switch allows the user to toggle the visibility of route duration symbols on the map.

- The enableRouteDurationSymbol variable keeps track of the switch state.

- When the switch is toggled, the \_switchButton function calls the toggleDurationSymbolVisibilityWith method of **NavNextBillionMap** to change the visibility of route duration symbols accordingly.

### Start Navigation:

- The "Start Navigation" button is used to initiate turn-by-turn navigation using the selected route.

- When the button is pressed, the \_startNavigation function is called. It launches the navigation using **NBNavigation.startNavigation** with the first route from the list.

### Map Interaction:

- The **\_onMapCreated** callback function is used to get the map controller when the map is created.

- The **\_onMapClick** function is used to handle map click events. When a route is selected on the map, it is moved to the top of the routes list and redrawn.

- Overall, the app provides an interface for fetching routes between two specified coordinates, drawing those routes on the map, and toggling the visibility of alternative routes and route duration symbols.

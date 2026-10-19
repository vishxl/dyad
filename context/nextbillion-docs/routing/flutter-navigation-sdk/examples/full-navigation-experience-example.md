# Full Navigation Experience Example

## Introduction

- This example shows:
  - Display a MapView
  - Track Current Location
  - onMapClick
  - onMapLongClick
  - onUserLocationUpdate
- Customize marker image of route origin and destination
- Fetch route with RouteRequestParams
  - NBNavigation.fetchRoute(requestParams, (routes, error) async
- Draw routes with route result
- navNextBillionMap.drawRoute(routes);
- Start Navigation with LauncherConfig
  - **NBNavigation.startNavigation(config)**

| ![documentation image](https://static.nextbillion.io/docs-next/docs/navigation/flutter/examples/full-navigation-experience-example-1.webp) | ![documentation image](https://static.nextbillion.io/docs-next/docs/navigation/flutter/examples/full-navigation-experience-example-2.webp) |
| ------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------ |
| **Android snapshot**                                                                                                                       | **iOS snapshot**                                                                                                                           |

For all code examples, refer to [Flutter Navigation Code Example](https://github.com/nextbillion-ai/nb-navigation-flutter)

**FullNavigationExample** [view source](https://github.com/nextbillion-ai/nb-navigation-flutter/blob/main/example/lib/full_navigation_example.dart)

```dart
import 'dart:math';

import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:nb_navigation_flutter/nb_navigation_flutter.dart';
import 'package:nb_navigation_flutter_example/constants.dart';

class FullNavigationExample extends StatefulWidget {
  static const String title = "Full Navigation Experience Example";

  const FullNavigationExample({super.key});

  @override
  FullNavigationExampleState createState() => FullNavigationExampleState();
}

class FullNavigationExampleState extends State<FullNavigationExample> {
  NextbillionMapController? controller;
  List<DirectionsRoute> routes = [];
  late NavNextBillionMap navNextBillionMap;
  Symbol? mapMarkerSymbol;

  String locationTrackImage = "assets/location_on.png";
  UserLocation? currentLocation;
  List<LatLng> waypoints = [];

  void _onMapCreated(NextbillionMapController controller) {
    this.controller = controller;
  }

  _onStyleLoadedCallback() {
    if (controller != null) {
      NavNextBillionMap.create(controller!).then((value) {
        navNextBillionMap = value;
        loadAssetImage();
        Fluttertoast.showToast(
            msg: "Long press to select a destination to fetch a route");
        if (currentLocation != null) {
          controller?.animateCamera(
              CameraUpdate.newLatLngZoom(currentLocation!.position, 14),
              duration: const Duration(milliseconds: 400));
        }
      });
    }
  }

  _onMapLongClick(Point<double> point, LatLng coordinates) {
    _fetchRoute(coordinates);
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

  _onUserLocationUpdate(UserLocation location) {
    currentLocation = location;
  }

  _onCameraTrackingChanged() {
    setState(() {
      locationTrackImage = 'assets/location_off.png';
    });
  }

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        NBMap(
          onMapCreated: _onMapCreated,
          onStyleLoadedCallback: _onStyleLoadedCallback,
          initialCameraPosition: const CameraPosition(
            target: LatLng(0, 0),
            zoom: 14.0,
          ),
          trackCameraPosition: true,
          myLocationEnabled: true,
          myLocationTrackingMode: MyLocationTrackingMode.Tracking,
          onMapLongClick: _onMapLongClick,
          onUserLocationUpdated: _onUserLocationUpdate,
          onCameraTrackingDismissed: _onCameraTrackingChanged,
          onMapClick: _onMapClick,
          styleString: NbNavigationStyles.nbMapDefaultLightStyle,
        ),
        Padding(
          padding: const EdgeInsets.all(8.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.end,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Padding(
                padding: const EdgeInsets.all(8.0),
                child: GestureDetector(
                    child: Image(
                      image: AssetImage(locationTrackImage),
                      width: 28,
                      height: 28,
                    ),
                    onTap: () {
                      controller?.updateMyLocationTrackingMode(
                          MyLocationTrackingMode.Tracking);
                      setState(() {
                        locationTrackImage = 'assets/location_on.png';
                      });
                    }),
              ),
              const Padding(padding: EdgeInsets.only(top: 35)),
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  ElevatedButton(
                      style: ButtonStyle(
                          backgroundColor: WidgetStateProperty.all(
                              routes.isEmpty ? Colors.grey : Colors.blueAccent),
                          enableFeedback: routes.isNotEmpty),
                      onPressed: () {
                        clearRouteResult();
                        waypoints.clear();
                      },
                      child: const Text("Clear Routes")),
                  const Padding(padding: EdgeInsets.only(left: 8)),
                  ElevatedButton(
                      style: ButtonStyle(
                          backgroundColor: WidgetStateProperty.all(
                              routes.isEmpty ? Colors.grey : Colors.blueAccent),
                          enableFeedback: routes.isNotEmpty),
                      onPressed: () {
                        _startNavigation();
                      },
                      child: const Text("Start Navigation")),
                ],
              ),
              const Padding(padding: EdgeInsets.only(top: 48)),
              // Padding(
              //   padding: const EdgeInsets.only(top: 8.0),
              //   child: Text("route response: ${routeResult}"),
              // ),
            ],
          ),
        )
      ],
    );
  }

  void _fetchRoute(LatLng destination) async {
    if (currentLocation == null) {
      return;
    }
    LatLng origin = currentLocation!.position;
    waypoints.add(destination);
    RouteRequestParams requestParams = RouteRequestParams(
      origin: origin,
      destination: waypoints.last,
      // overview: ValidOverview.simplified,
      // avoid: [SupportedAvoid.toll, SupportedAvoid.ferry],
      // option: SupportedOption.flexible,
      // truckSize: [200, 200, 600],
      // truckWeight: 100,
      // unit: SupportedUnits.imperial,
      alternatives: true,
      mode: ValidModes.car,
    );

    if (waypoints.length > 1) {
      requestParams.waypoints = waypoints.sublist(0, waypoints.length - 1);
    }

    DirectionsRouteResponse routeResponse =
        await NBNavigation.fetchRoute(requestParams);
    if (routeResponse.directionsRoutes.isNotEmpty) {
      clearRouteResult();
      setState(() {
        routes = routeResponse.directionsRoutes;
      });
      drawRoutes(routes);
      fitCameraToBounds(routes);
      addImageFromAsset(destination);
    } else if (routeResponse.message != null) {
      if (kDebugMode) {
        print(
            "====error====${routeResponse.message}===${routeResponse.errorCode}");
      }
    }
  }

  Future<void> drawRoutes(List<DirectionsRoute> routes) async {
    // navNextBillionMap.toggleDurationSymbolVisibilityWith(false);
    navNextBillionMap.drawRoute(routes);
  }

  void fitCameraToBounds(List<DirectionsRoute> routes) {
    List<LatLng> multiPoints = [];
    for (var route in routes) {
      var routePoints =
          decode(route.geometry ?? '', _getDecodePrecision(route.routeOptions));
      multiPoints.addAll(routePoints);
    }
    if (multiPoints.isNotEmpty) {
      var latLngBounds = LatLngBounds.fromMultiLatLng(multiPoints);
      controller?.animateCamera(CameraUpdate.newLatLngBounds(latLngBounds,
          top: 50, left: 50, right: 50, bottom: 50));
    }
  }

  int _getDecodePrecision(RouteRequestParams? routeOptions) {
    return routeOptions?.geometry == SupportedGeometry.polyline
        ? precision
        : precision6;
  }

  void clearRouteResult() async {
    navNextBillionMap.clearRoute();
    controller?.clearSymbols();
    setState(() {
      routes.clear();
    });
  }

  void _startNavigation() {
    if (routes.isEmpty) return;
    NavigationLauncherConfig config =
        NavigationLauncherConfig(route: routes.first, routes: routes);
    config.locationLayerRenderMode = LocationLayerRenderMode.gps;
    config.shouldSimulateRoute = false;
    config.themeMode = NavigationThemeMode.system;
    config.useCustomNavigationStyle = false;
    NBNavigation.startNavigation(config);
  }

  Future<void> loadAssetImage() async {
    final ByteData bytes = await rootBundle.load("assets/map_marker_light.png");
    final Uint8List list = bytes.buffer.asUint8List();
    await controller?.addImage("ic_marker_destination", list);
  }

  Future<void> addImageFromAsset(LatLng coordinates) async {
    controller?.clearSymbols();
    var symbolOptions = SymbolOptions(
      geometry: coordinates,
      iconImage: "ic_marker_destination",
    );
    await controller?.addSymbol(symbolOptions);
    controller?.symbolManager?.setTextAllowOverlap(false);
  }

  @override
  void initState() {
    super.initState();
  }

  @override
  void dispose() {
    // TODO: implement dispose
    super.dispose();
  }

  @override
  void didUpdateWidget(FullNavigationExample oldWidget) {
    // TODO: implement didUpdateWidget
    super.didUpdateWidget(oldWidget);
  }

  @override
  void didChangeDependencies() {
    // TODO: implement didChangeDependencies
    super.didChangeDependencies();
  }
}
```

## Code summary

The above code snippet demonstrates a full navigation experience using the **"nb_navigation_flutter"** and **"nb_maps_flutter"** packages. It provides functionalities to display a map with a user's current location, select a destination by long-pressing on the map, fetch a route from the user's current location to the selected destination, and start navigation with turn-by-turn directions.

### How to display **NBMap** Widget:

- The NBMap widget is displayed using the \*\*"NBMap" \*\*class from the **"nb_maps_flutter"** package. It is placed in the stack of widgets and is provided with various properties like **onMapCreated**, **initialCameraPosition**, **myLocationEnabled**, etc., to configure its behavior.

## Customize marker image of route origin and destination:

The marker image for the route origin and destination is customized using the method loadAssetImage. It loads a custom marker image from the assets folder and adds it to the map using the "addImage" method of the "NextbillionMapController".

Fetch route with RouteRequestParams: The route is fetched using the \_fetchRoute method. It takes the destination coordinates, constructs a RouteRequestParams object with various route parameters like origin, destination, unit, mode, and geometryType, and then calls the NBNavigation.fetchRoute method to retrieve the route information.

Draw routes with route result: The drawn routes are displayed on the map using the drawRoutes method. It takes a list of DirectionsRoute objects and calls navNextBillionMap.drawRoute to render the route on the map.

Start Navigation with LauncherConfig: The navigation is started using the \_startNavigation method. It constructs a NavigationLauncherConfig object with various configuration options like route, locationLayerRenderMode, enableDissolvedRouteLine, shouldSimulateRoute, etc., and then calls NBNavigation.startNavigation to begin the navigation.

The code also includes various event handlers like \_onMapCreated, \_onStyleLoadedCallback, \_onMapLongClick, \_onMapClick, \_onUserLocationUpdate, and \_onCameraTrackingChanged, which handle map interactions, user location updates, and camera tracking changes.

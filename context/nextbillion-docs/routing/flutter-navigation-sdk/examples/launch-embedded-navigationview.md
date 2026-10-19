# Launch Embedded NavigationView

The example shows:

1.  **Displaying a Map:** Using the NBMap widget to display a map.
2.  **Fetching Routes:** Fetching routes from a given origin to a destination with RouteRequestParams.
3.  **Drawing Routes:** Drawing fetched routes on the map.
4.  **Handling User Interactions:** Handling map interactions such as long-press and click events to select destinations and fetch routes.
5.  **Displaying Embedded Navigation View:** Launching an embedded navigation view with specific navigation options.
6.  **Get Navigation Progress:** Updates and displays navigation progress, including distance remaining, duration remaining, and waypoint arrival information.
7.  **Starting and Cancelling Navigation:** Manages the state of starting and cancelling navigation, displaying an embedded navigation view when navigation starts.

| ![documentation image](https://static.nextbillion.io/docs-next/docs/navigation/flutter/examples/launch-embedded-navigationview-1.webp) | ![documentation image](https://static.nextbillion.io/docs-next/docs/navigation/flutter/examples/launch-embedded-navigationview-2.webp) |
| -------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| **Android snapshot**                                                                                                                   | **iOS snapshot**                                                                                                                       |

For all code examples, refer to [Flutter Navigation Code Example](https://github.com/nextbillion-ai/nb-navigation-flutter)

**LaunchEmbeddedNavigationView** [view source](https://github.com/nextbillion-ai/nb-navigation-flutter/blob/main/example/lib/launch_embedded_navigation_view.dart)

```dart
import 'dart:math';

import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:nb_navigation_flutter/nb_navigation_flutter.dart';
import 'package:nb_navigation_flutter_example/constants.dart';

class LaunchEmbeddedNavigationView extends StatefulWidget {
  static const String title = "Launch Embedded NavigationView";

  const LaunchEmbeddedNavigationView({super.key});

  @override
  LaunchEmbeddedNavigationViewState createState() => LaunchEmbeddedNavigationViewState();
}

class LaunchEmbeddedNavigationViewState extends State<LaunchEmbeddedNavigationView> {
  NextbillionMapController? controller;
  List<DirectionsRoute> routes = [];
  late NavNextBillionMap navNextBillionMap;
  Symbol? mapMarkerSymbol;

  NavigationViewController? navigationViewController;
  NavigationProgress? progress;
  Waypoint? waypoint;
  bool startNavigation = false;

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

  _onNavigationViewReady(NavigationViewController controller) {
    navigationViewController = controller;
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
    return Scaffold(
      body: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsets.only(top: 60, left: 18, bottom: 5.0),
            child: Text("distanceRemaining: ${progress?.distanceRemaining}"),
          ),
          Padding(
            padding: const EdgeInsets.only(left: 18, bottom: 5.0),
            child: Text("durationRemaining: ${progress?.durationRemaining}"),
          ),
          Padding(
            padding: const EdgeInsets.only(left: 18, bottom: 25.0),
            child: Text("arrivedAtWaypointInfo: ${waypoint?.arrivedWaypointIndex}===${waypoint?.arrivedWaypointLocation}"),
          ),
          Expanded(
            child: Stack(
              children: [
                _buildNBMapView(),
                _buildNBNavigationView(),
              ],
            ),
          )
        ],
      ),
    );
  }

  Widget _buildNBNavigationView() {
   return startNavigation
        ? NBNavigationView(
          onNavigationViewReady: _onNavigationViewReady,
          navigationOptions: _buildNavigationViewConfig(),
          onProgressChange: (progress) {
            setState(() {
              this.progress = progress;
            });
          },
          onNavigationCancelling: () {
            setState(() {
              startNavigation = false;
              waypoints.clear();
              clearRouteResult();
            });
          },
          onArriveAtWaypoint: (waypoint) {
            setState(() {
              this.waypoint = waypoint;
            });
          },
          onRerouteFromLocation: (location) {
          },
        ) : Container();
  }

  NavigationLauncherConfig _buildNavigationViewConfig() {
    NavigationLauncherConfig config = NavigationLauncherConfig(route: routes.first, routes: routes);
    config.locationLayerRenderMode = LocationLayerRenderMode.gps;
    config.shouldSimulateRoute = true;
    config.themeMode = NavigationThemeMode.system;
    config.useCustomNavigationStyle = false;
    return config;
  }

  Widget _buildNBMapView() {
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
                        setState(() {
                          startNavigation = true;
                        });
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
  void didUpdateWidget(LaunchEmbeddedNavigationView oldWidget) {
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

## Code Summary

- **Initialization:** Initialises the NBMap and sets up necessary callbacks.
- **Fetching and Drawing Routes:** Handles the logic for fetching routes from a specified origin to a destination and drawing these routes on the map.
- **Navigation Management:** Manages navigation states, such as starting and cancelling navigation, and integrates the embedded navigation view to provide turn-by-turn navigation.
- **User Interface:** Displays navigation-related information, such as distance remaining, duration remaining, and waypoint arrival information, as well as buttons for starting and clearing routes.

## Detailed Analysis

### Displaying NBMap Widget

- **Initialization:** The NBMap widget is initialised with various parameters, including callbacks for map creation, style loading, long clicks, and user location updates. When the map is created and the style is loaded, the map is set up to handle user interactions and display the current location.

## Fetching Route with RouteRequestParams

- **Route Request:** When the user long-presses on the map to set a destination, a route request is initiated using the RouteRequestParams. This request includes the origin (current location), destination (selected point), and other route options such as avoiding tolls or ferries and selecting travel modes.

## Drawing Routes with Route Result

- **Visualisation:** After fetching the routes, they are drawn on the map. The map is updated to display the routes, and the camera view is adjusted to fit the bounds of the routes.

## Launch Embedded NavigationView with Navigation Options

- **Starting Navigation:** When the user decides to start navigation, the embedded navigation view is launched with the specified navigation options. This view provides real-time navigation updates, including progress changes, waypoint arrivals, and rerouting information.
- **Handling Navigation States:** The state of navigation (started or cancelled) is managed within the widget, and relevant updates are displayed to the user.

Above example provides a comprehensive demonstration of functionalities - initialising the map, fetching and displaying routes, and managing an embedded navigation experience - which are critical when integrating Nextbillion Maps for navigation purposes within a Flutter application.

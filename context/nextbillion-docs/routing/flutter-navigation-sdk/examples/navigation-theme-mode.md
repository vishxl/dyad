# Navigation Theme Mode

## Introduction

This example shows

- Fetch routes using RouteRequestParams
- Customize Navigation theme mode by setting themeMode in NavigationLauncherConfig
  - NavigationThemeMode.system: following system mode

  - NavigationThemeMode.light: Navigating in light mode

  - NavigationThemeMode.dark: Navigating in dark mode

    | ![documentation image](https://static.nextbillion.io/docs-next/docs/navigation/flutter/examples/navigation-theme-mode-1.webp) | ![documentation image](https://static.nextbillion.io/docs-next/docs/navigation/flutter/examples/navigation-theme-mode-2.webp) |
    | ----------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
    | **Android snapshot**                                                                                                          | **iOS snapshot**                                                                                                              |

For all code examples, refer to [Flutter Navigation Code Example](https://github.com/nextbillion-ai/nb-navigation-flutter)

**NavigationTheme** [view source](https://github.com/nextbillion-ai/nb-navigation-flutter/blob/main/example/lib/navigation_theme_mode.dart)

```dart
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:nb_navigation_flutter/nb_navigation_flutter.dart';

class NavigationTheme extends StatefulWidget {
  static const String title = "Navigation Theme Mode";

  const NavigationTheme({super.key});

  @override
  NavigationThemeState createState() => NavigationThemeState();
}

class NavigationThemeState extends State<NavigationTheme> {
  NextbillionMapController? controller;
  List<DirectionsRoute> routes = [];
  late NavNextBillionMap navNextBillionMap;
  NavigationThemeMode themeMode = NavigationThemeMode.system;

  LatLng origin = const LatLng(1.312533169133601, 103.75986708439264);
  LatLng dest = const LatLng(1.310473772283314, 103.77982271935586);

  void _onMapCreated(NextbillionMapController controller) {
    this.controller = controller;
  }

  void _onStyleLoaded() async {
    if (controller != null) {
      navNextBillionMap = await NavNextBillionMap.create(controller!);
    }
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
        title: const Text(NavigationTheme.title),
      ),
      body: SingleChildScrollView(
        child: Column(
          children: [
            Container(
              constraints: BoxConstraints(maxHeight: screenHeight * 0.6),
              child: NBMap(
                onMapCreated: _onMapCreated,
                initialCameraPosition: CameraPosition(
                  target: LatLng(origin.latitude, 103.76986708439264),
                  zoom: 13.0,
                ),
                onStyleLoadedCallback: _onStyleLoaded,
              ),
            ),
            _buttonWidget(),
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
    config.shouldSimulateRoute = true;
    config.themeMode = themeMode;
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
      child: Column(
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
          ElevatedButton(
            style: ButtonStyle(
                backgroundColor: WidgetStateProperty.all(
                    routes.isEmpty ? Colors.grey : Colors.blueAccent),
                enableFeedback: routes.isNotEmpty),
            onPressed: () {
              themeMode = NavigationThemeMode.light;
              _startNavigation();
            },
            child: const Text("Start Navigation with light mode"),
          ),
          ElevatedButton(
            style: ButtonStyle(
                backgroundColor: WidgetStateProperty.all(
                    routes.isEmpty ? Colors.grey : Colors.blueAccent),
                enableFeedback: routes.isNotEmpty),
            onPressed: () {
              themeMode = NavigationThemeMode.dark;
              _startNavigation();
            },
            child: const Text("Start Navigation with dark mode"),
          ),
          ElevatedButton(
            style: ButtonStyle(
                backgroundColor: WidgetStateProperty.all(
                    routes.isEmpty ? Colors.grey : Colors.blueAccent),
                enableFeedback: routes.isNotEmpty),
            onPressed: () {
              themeMode = NavigationThemeMode.system;
              _startNavigation();
            },
            child: const Text("Start Navigation with following system mode"),
          ),
        ],
      ),
    );
  }
}
```

## Code summary

The above code snippet defines a StatefulWidget named NavigationTheme, which demonstrates a simple navigation application using the NextbillionMap SDK for maps and the NBNavigation SDK for navigation features. The app allows users to fetch routes and start navigation with different theme modes (light, dark, or system default).

### Initialization and Map Display:

The NBMap widget is used to display the map on the screen. The \_onMapCreated method is called when the map is created and initializes the NextbillionMapController. The \_onStyleLoaded method is called when the map style is loaded and creates a NavNextBillionMap instance using the NextbillionMapController.

### Fetching Routes:

The \_fetchRoute method is responsible for fetching routes between two coordinates (origin and dest) using the NBNavigation.fetchRoute function. The fetched routes are stored in the routes variable. The routes are drawn on the map using the drawRoutes method.

### Starting Navigation:

The \_startNavigation method is triggered when the user presses one of the navigation mode buttons. It creates a NavigationLauncherConfig object with the selected route and navigation settings. The navigation is started using the NBNavigation.startNavigation function with the specified config.

### Explanation of Navigation Theme Mode Customization:

The navigation theme mode can be customized using the NavigationThemeMode enum. It has the following options:

- NavigationThemeMode.light: Starts navigation with a light theme.
- NavigationThemeMode.dark: Starts navigation with a dark theme.
- NavigationThemeMode.system: Starts navigation with the system default theme.

When the user presses one of the navigation mode buttons, the \_startNavigation method is called with the selected theme mode, and navigation is started accordingly.

The user presses the "Fetch Route" button to fetch the routes between the specified origin and destination coordinates.

After fetching the routes, the user can press one of the navigation mode buttons ("Start Navigation with light mode", "Start Navigation with dark mode", "Start Navigation with following system mode") to start navigation with the selected theme mode.

# Fetch Route and Launch Navigation

## Introduction

This example shows:

- Fetch route with RouteRequestParams
  - NBNavigation.fetchRoute(requestParams, (routes, error) async

- Start Navigation with LauncherConfig
  - NBNavigation.startNavigation(config)

| ![documentation image](https://static.nextbillion.io/docs-next/docs/navigation/flutter/examples/fetch-route-and-launch-navigation-1.webp) | ![documentation image](https://static.nextbillion.io/docs-next/docs/navigation/flutter/examples/fetch-route-and-launch-navigation-2.webp) |
| ----------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| **Android snapshot**                                                                                                                      | **iOS snapshot**                                                                                                                          |

For all code examples, refer to [Flutter Navigation Code Example](https://github.com/nextbillion-ai/nb-navigation-flutter)

**LaunchNavigation** [view source](https://github.com/nextbillion-ai/nb-navigation-flutter/blob/main/example/lib/launch_navigation.dart)

```dart
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:nb_navigation_flutter/nb_navigation_flutter.dart';

class LaunchNavigation extends StatefulWidget {
  static const String title = "Route Request and Launch Navigation";

  const LaunchNavigation({super.key});

  @override
  LaunchNavigationState createState() => LaunchNavigationState();
}

class LaunchNavigationState extends State<LaunchNavigation> {
  List<DirectionsRoute> routes = [];

  @override
  void initState() {
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text(LaunchNavigation.title),
      ),
      body: Padding(
        padding: const EdgeInsets.all(8.0),
        child: Column(
          children: [
            Row(
              children: [
                const Padding(padding: EdgeInsets.only(left: 8)),
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
            Padding(
              padding: const EdgeInsets.all(8),
              child: Text(
                  "route info: ${routes.isEmpty ? "" : routes.first.geometry ?? ""}"),
            )
          ],
        ),
      ),
    );
  }

  void _fetchRoute() async {
    LatLng origin = const LatLng(1.312533169133601, 103.75986708439264);
    LatLng dest = const LatLng(1.310473772283314, 103.77982271935586);

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
    config.themeMode = NavigationThemeMode.system;
    config.useCustomNavigationStyle = false;
    NBNavigation.startNavigation(config);
  }

  @override
  void dispose() {
    // TODO: implement dispose
    super.dispose();
  }

  @override
  void didUpdateWidget(LaunchNavigation oldWidget) {
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

The above code snippet demonstrates how to fetch a route using the **"nb_navigation_flutter"** package and how to start navigation with the provided route using the **"NavigationLauncherConfig"**. The user interface consists of two buttons: "Fetch Route" and "Start Navigation". The "Fetch Route" button fetches a route between two specified coordinates, and the "Start Navigation" button launches navigation with the fetched route.

### Fetch route with RouteRequestParams:

- The "\_fetchRoute" method is responsible for fetching the route. It creates a "RouteRequestParams" object with **origin** and **destination** coordinates and other route parameters. The **"NBNavigation.fetchRoute"** method is then called with these **parameters** to retrieve the route. If successful, the fetched route is stored in the "routes" list.

### Start Navigation with LauncherConfig:

- The **"\_startNavigation"** method initiates the navigation. It creates a **"NavigationLauncherConfig"** object with the fetched route and other configuration options like location rendering mode, dissolved route line, simulation mode, **theme mode**, and custom navigation style. The **"NBNavigation.startNavigation"** method is called with this configuration to start the navigation.

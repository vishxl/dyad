# Customize Route Line Style

This example shows:

- Draw route line on the map using NavNextBillionMap

- Customize the style of route line using RouteLineProperties when init the NavNextBillionMap in the \_onStyleLoaded callback

- RouteLineProperties

```dart
      /// The color of the shield icon for the route.
   final Color routeShieldColor;

    /// The color of the shield icon for alternative routes.
    final Color alternativeRouteShieldColor;

    /// The scale factor for the route line.
    final double routeScale;

    /// The scale factor for alternative route lines.
    final double alternativeRouteScale;

    /// The default color of the route line.
    final Color routeDefaultColor;

    /// The default color of alternative route lines.
    final Color alternativeRouteDefaultColor;

    /// The asset image name of the route origin marker.
    final String originMarkerName;

    /// The asset image name of the route destination marker.
    final String destinationMarkerName;

    /// The background color of the primary route's duration symbol.
    final Color durationSymbolPrimaryBackgroundColor;

    /// The background color of the alternative route's duration symbol.
    final Color durationSymbolAlternativeBackgroundColor;

    /// The text style for the primary route's duration symbol.
    final TextStyle durationSymbolPrimaryTextStyle;

    /// The text style for alternative route's duration symbols.
    final TextStyle durationSymbolAlternativeTextStyle;
```

| ![documentation image](https://static.nextbillion.io/docs-next/docs/navigation/flutter/examples/customize-route-line-style-1.webp) | ![documentation image](https://static.nextbillion.io/docs-next/docs/navigation/flutter/examples/customize-route-line-style-2.webp) |
| ---------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| **Android snapshot**                                                                                                               | **iOS snapshot**                                                                                                                   |

For all code examples, refer to [Flutter Navigation Code Example](https://github.com/nextbillion-ai/nb-navigation-flutter)

**RouteLineStyle** [view source](https://github.com/nextbillion-ai/nb-navigation-flutter/blob/main/example/lib/route_line_style.dart)

```dart
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:nb_navigation_flutter/nb_navigation_flutter.dart';

class RouteLineStyle extends StatefulWidget {
  static const String title = "Customize Route Line Style";

  const RouteLineStyle({super.key});

  @override
  RouteLineStyleState createState() => RouteLineStyleState();
}

class RouteLineStyleState extends State<RouteLineStyle> {
  NextbillionMapController? controller;
  List<DirectionsRoute> routes = [];
  late NavNextBillionMap navNextBillionMap;

  LatLng origin = const LatLng(1.312533169133601, 103.75986708439264);
  LatLng dest = const LatLng(1.310473772283314, 103.77982271935586);

  void _onMapCreated(NextbillionMapController controller) {
    this.controller = controller;
  }

  void _onStyleLoaded() async {
    if (controller != null) {
      var routeLineStyle = const RouteLineProperties(
          routeDefaultColor: Color(0xFFE97F2F),
          routeScale: 1.0,
          alternativeRouteScale: 1.0,
          routeShieldColor: Color(0xFF54E910),
          durationSymbolPrimaryBackgroundColor: Color(0xFFE97F2F));
      navNextBillionMap = await NavNextBillionMap.create(controller!,
          routeLineProperties: routeLineStyle);
    }
  }

  @override
  void initState() {
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text(RouteLineStyle.title),
      ),
      body: Stack(
        children: [
          NBMap(
            onMapCreated: _onMapCreated,
            initialCameraPosition: CameraPosition(
              target: LatLng(origin.latitude, 103.76986708439264),
              zoom: 13.0,
            ),
            onStyleLoadedCallback: _onStyleLoaded,
          ),
          _buttonWidget(),
        ],
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

    DirectionsRouteResponse response =
        await NBNavigation.fetchRoute(requestParams);
    List<DirectionsRoute> routeData = response.directionsRoutes;
    if (routeData.isNotEmpty) {
      setState(() {
        routes = routeData;
      });
      drawRoutes(routeData);
    } else if (response.message != null) {
      if (kDebugMode) {
        print("====error====${response.message}===${response.errorCode}");
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

  Future<void> drawRoutes(List<DirectionsRoute> routes) async {
    navNextBillionMap.clearRoute();
    navNextBillionMap.drawRoute(routes);
  }

  @override
  void dispose() {
    super.dispose();
  }

  _buttonWidget() {
    return Positioned(
      bottom: 60,
      child: Padding(
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
      ),
    );
  }
}
```

## Code summary

The above code snippet demonstrates how to draw a route line on nbMap, customize the route line style, and navigate along the route. The app uses the **nb_maps_flutter** and **nb_navigation_flutter** packages for map rendering, route drawing, and navigation-related functionality.

### Draw Route Line:

- The **NBMap** widget from the nb_maps_flutter package is used to display the map.

- When the "Fetch Route" button is pressed, the \_fetchRoute function is called. It sends a route request to the navigation service **(NBNavigation.fetchRoute)** with the specified origin and destination coordinates. The response contains a list of DirectionsRoute objects representing different possible routes from the origin to the destination.

- The drawRoutes function is used to draw the fetched routes on the map using the **NavNextBillionMap** controller.

### Customize Route Line Style:

- The **\_onStyleLoaded** function is called when the map style is loaded. It initializes a RouteLineProperties object to customize the appearance of the route line.

- The **NavNextBillionMap** controller is created with the specified routeLineStyle object, which customizes attributes like the route color, route scale, alternative route scale, route shield color, and duration symbol background color.

### Supported Route Line Style Attributes:

The RouteLineProperties class provides the following supported route line style attributes:

- **routeDefaultColor**: The default color of the main route line.

- **routeScale**: The scaling factor applied to the width of the main route line.

- **alternativeRouteScale**: The scaling factor applied to the width of alternative route lines.

- **routeShieldColor**: The color of the route shield, which is displayed on the map for certain types of routes.

- **durationSymbolPrimaryBackgroundColor**: The background color of the duration symbol displayed along the route line.

- **alternativeRouteDefaultColor**: The default color of alternative route lines.

- **originMarkerName**: The asset image name of the route origin marker.

- **destinationMarkerName**: The asset image name of the route destination marker.

- **durationSymbolPrimaryBackgroundColor**: The background color of the primary route's duration symbol.

- **durationSymbolAlternativeBackgroundColor**: The background color of the alternative route's duration symbol.

- **durationSymbolPrimaryTextStyle**: The text style for the primary route's duration symbol.

- **durationSymbolAlternativeTextStyle**: The text style for alternative route's duration symbols.

### Start Navigation:

- The "Start Navigation" button is used to initiate turn-by-turn navigation using the selected route.

- When the button is pressed, the \_startNavigation function is called. It launches the navigation using NBNavigation.startNavigation with the first route from the list.

Please note that some parts of the code (e.g., fetchRoute and startNavigation) rely on external services or APIs provided by the **nb_navigation_flutter** package. These services handle the actual route fetching and navigation functionality. Also, ensure that you have the required permissions and API keys set up to use the mapping and navigation services properly.

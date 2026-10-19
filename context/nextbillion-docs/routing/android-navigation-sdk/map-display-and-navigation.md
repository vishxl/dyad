# Map Display and Navigation

This section explains the route-to-navigation flow, namely how to define origin/destination, fetch route, and launch navigation.

## Start a Navigation

The guide explains how to use the SDK to fetch a route and start navigation. It first explains how to fetch a route by providing a pair of coordinates (origin and destination), and then it shows how to use the fetched route(s) to start navigation by building a launch configuration and calling _NavigationLauncher.startNavigation()_

### Helper Class

If you already know the helper classes, skip this section and continue to [Fetch a route](#fetch-a-route).

In our navigation SDK, we have put some boilerplate code to start navigations together in **NBNavigation** to make our life easier. Nextbillion.ai’s Navigation API supports two routing planning modes,

- Plan route with coordinates: request a route with origin and destination (and middle waypoints if any).
- Plan a route with geometry string: request a route with geometry data (an [encoded polyline](https://developers.google.com/maps/documentation/utilities/polylinealgorithm))

Below are the function signatures of this helper class, and it is naturally grouped by two modes - Coordinate Mode and Geometry Mode. We cover both of them in following sections:

### Coordinate Mode

- Origin + Destination + Simplified callback

  ```java
  public static void fetchRoute(Point origin, Point destination, String lang, NextbillionRoutingCallback callback)
  ```

- Origin + Destination + Request Params Builder + Simplified callback

  ```java
  public static void fetchRoute(Point origin, Point destination, RouteRequestParams.Builder builder, NextbillionRoutingCallback callback)
  ```

- Origin + Destination + Request Params Builder + Retrofit callback

  ```java
  public static void fetchRoute(Point origin, Point destination, RouteRequestParams.Builder builder, Callback{'<DirectionsResponse>'} callback)
  ```

- Origin + Destination + Retrofit callback

  ```java
  public static void fetchRoute(Point origin, Point destination, Callback{'<DirectionsResponse>'} callback)
  ```

- Origin + Destination + mode + Retrofit callback

  ```java
  public static void fetchRoute(Point origin, Point destination, @RequestParamConsts.ValidModes String mode, Callback{'<DirectionsResponse>'} callback)
  ```

- Origin + Destination + mode + unit + Retrofit callback

  ```java
  public static void fetchRoute(Point origin, Point destination, @RequestParamConsts.ValidModes String mode, @RequestParamConsts.SupportedUnits String unit, Callback{'<DirectionsResponse>'} callback)
  ```

- Origin + Destination + Request Params + Retrofit callback

  ```java
  public static void fetchRoute(Point origin, Point destination, RouteRequestParams params, Callback{'<DirectionsResponse>'} callback)
  ```

### Geometry Mode

- Geometry + GeometryType

  ```java
  public static void fetchRouteWithGeometry(@NonNull String geometry, @NonNull String geometryType, Callback{'<DirectionsResponse>'} callback)
  ```

- Geometry + GeometryType + Request Params

  ```java
  public static void fetchRouteWithGeometry(@NonNull String geometry, @NonNull String geometryType, @NonNull RouteRequestParams params, Callback{'<DirectionsResponse>'} callback)
  ```

- Geometry + GeometryType + Retry (once retry is true and failed to retrieve route based on geometry, the SDK will populate the first and last coordinates from geometry to re-fetch a route)

  ```java
  public static void fetchRouteWithGeometry(@NonNull final String geometry, @NonNull final String geometryType, final boolean retry, final Callback{'<DirectionsResponse>'} callback)
  ```

- Geometry + GeometryType + Request Params + Retry (retry mode can rebuild route using first/last geometry coordinates when geometry-based fetch fails.)

  ```java
  public static void fetchRouteWithGeometry(@NonNull final String geometry, @NonNull final String geometryType, @NonNull final RouteRequestParams params, final boolean retry, final Callback{'<DirectionsResponse>'} callback)
  ```

- Geometry + GeometryType + Origin + Destination (once we failed to retrieve a route based on geometry, the SDK will re-fetch a route with the provided origin and destination coordinates)

  ```java
  public static void fetchRouteWithGeometry(@NonNull final String geometry, @NonNull final String geometryType, @NonNull final Point origin, @NonNull final Point destination, final Callback{'<DirectionsResponse>'} callback)
  ```

### Route response callback

As we can tell from the parameters of functions above, there are two different callbacks to receive the fetched routes:

1.  _NextbillionRoutingCallback_ is a custom callback interface for handling routing related events in the SDK. The purpose of this callback interface is to simplify routing-related response handling by providing predefined methods for success, failure, or other events.
2.  _Callback<DirectionsResponse\>_ is a general-purpose callback class used for handling HTTP request responses, specifically tailored to the 'DirectionsResponse' data type in the context of routing.

### Request Parameters

RouteRequestParams is a data structure that allows developers to modify the parameters of route planning, which includes parameters:

| Parameter        | Required | Type    | Format & Usage                                                                                                                                      | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| ---------------- | -------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| baseUrl          | Yes      | String  | Available value:   `https://api.nextbillion.io`                                                                                                     | Base URL to access NextBillion.ai’s route planning feature. The `baseUrl` can be set using the method _Nextbillion.getBaseUri()_                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| mode             | Yes      | String  | Available values: `car`, `truck`, `bike`,`motorcycle`                                                                                               | Represents transportation mode. Use RequestParamConsts.MODE*CAR, RequestParamConsts.MODE_TRUCK, RequestParamConsts.MODE_BIKE, or RequestParamConsts.MODE_MOTOCYCLE. MODE_TRUCK, MODE_BIKE, and MODE_MOTOCYCLE take effect only when the option is set to RequestParamConsts.FLEXIBLE.<br> <br>Please note the function \_RequestParamConsts.MODE_CAR* , _RequestParamConsts.MODE_TRUCK_ , _RequestParamConsts.MODE_BIKE_, _RequestParamConsts.MODE_MOTOCYCLE_ can be used to set the `mode` value. The mode of _RequestParamConsts.MODE_TRUCK_ , _RequestParamConsts.MODE_BIKE_, _RequestParamConsts.MODE_MOTOCYCLE_ will only take effect if the _option_ is set to _RequestParamConsts.FLEXIBLE_.                 |
| key              | Yes      | String  | Format: 32 character alphanumeric string<br> <br> <br>Example: key=API_KEY                                                                          | The SDK use the method _Nextbillion.getAccessKey()_ to set the `key` by default.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| language         | No       | String  | Allowed values: `en`, `es`, `fr`, `zh`, `de`, `ca`.                                                                                                 | Language of the turn-by-turn instructions for route guidance. This parameter accepts two-lettered [ISO 639-1 codes](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) to identify the language for instructions.<br> <br>Currently, only the following languages are supported: English(`en`), Spanish(`es`), French(`fr`), Mandarin(`zh`),German(`de`), and Catalan(`ca`) and other languages available in [OSRM translations](https://github.com/Project-OSRM/osrm-text-instructions/tree/master/languages/translations).<br> <br>Please note that the method _DEFAULT_LANGUAGE_VALUE_ can be used to set the default `language` value.                                                                      |
| unit             | No       | String  | Allowed values: `metric` , `imperial`                                                                                                               | The unit system to be used for distance. Users can set the `unit` value via the _RequestParamConsts.METRIC_ function.<br> <br>Please note that configuration of this parameter affects how distances and maneuver instructions are displayed in the response. It has no effect on the units used for collecting input values for fields like `truck_weight`, `truck_size` and other similar parameters.                                                                                                                                                                                                                                                                                                             |
| overview         | No       | String  | Allowed values: `full`, `simplified` , `false`.                                                                                                     | Output verbosity of overview geometry for the whole trip. Please note that the `overview` value can be set using the function _RequestParamConsts.OVERVIEW_FULL_                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| avoid            | No       | String  | Allowed values: `toll`, `ferry`, `highway`, `sharp_turn`,`uturn`,`service_road`, `left_turn`, `right_turn`, `bbox`, `geofence_id`, `tunnel` ,`none` | Objects to avoid on the route.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| alternatives     | No       | Boolean | Default: `false`                                                                                                                                    | Request for alternative routes. When   true,  `altCount` should be greater than 0.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| altCount         | No       | Integer | Default: `0`                                                                                                                                        | Number of alternative routes to be returned. Please note the actual number of routes can be smaller than or equal to the provided value.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| approaches       | No       | String  | Allowed values; `unrestricted`, `curb`<br> <br> <br>Default: `unrestricted`<br> <br> <br>Example: approaches=unrestricted;;curb;                    | A semicolon-separated list indicating the side of the road from which to approach waypoints in a requested route. If provided, the number of approaches must be the same as the number of destinations. However, you can skip a coordinate and show its position in the list with the;                                                                                                                                                                                                                                                                                                                                                                                                                              |
| departure \_time | No       | Integer | Default: <br>Current time                                                                                                                           | The departure times provided in UNIX epoch timestamp in seconds format.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| origin           | No       | String  |                                                                                                                                                     | Starting coordinate of the route.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| waypoints        | No       | String  | Example: waypoints = 41.349302,2.136480 \| 41.349303,2.136481 \| 41.349304,2.136482                                                                 | Coordinates along the route between`origin` and `d estination`. In case of multiple points please use a pipe (`\|`) as a separator                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| destination      | No       | String  |                                                                                                                                                     | Ending coordinate of the route                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| bearings         | No       | String  | Format: degree1, range1; degree2, range2;… <br> <br>Example: 90,10; 90 ,10 This means the range is 90-10 and 90+10 degrees.                         | Limits the search to segments with given bearing, in degrees, towards true north in a clockwise direction.<br> <br>Each `bearings` should be in the format of degree,range, where the degree should be a value between \[0, 360\] and range should be a value between \[0, 180\].<br> <br>Note: The number of bearings should equal the number of coordinates.                                                                                                                                                                                                                                                                                                                                                      |
| geometry         | No       | String  |                                                                                                                                                     | Limits the search to segments with given bearing, in degrees, towards true north in a clockwise direction. Each `bearings` should be in the format of degree,range , where the degree should be a value between \[0, 360\] and range should be a value between \[0, 180\]. Note: The number of bearings should equal the number of coordinates.                                                                                                                                                                                                                                                                                                                                                                     |
| geometry_type    | No       | String  | Allowed values: `polyline6` ,  `polyline` .<br> <br> <br>Default : `polyline6`                                                                      | The type of geometry encoding to be used for route in the response. When `geometry` is provided, this parameter can be used to specify the type of encoded geometry being provided.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| routeType        | No       | String  | Allowed values: `Fastest` ,  `Shortest` .<br> <br> <br>Default : `Fastest`                                                                          | Set the route type that needs to be returned.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| crossBorder      | No       | Boolean |                                                                                                                                                     | Specify if crossing an international border is expected. When set to false, the API will place a penalty for crossing an international border through a checkpoint. Consequently, alternative routes will be preferred if they are feasible for the given destination or a set of waypoints . A higher penalty is placed on a route crossing an international border without a checkpoint, hence such routes will be preferred the least.<br>When set to true, there will be no penalty for crossing an international border. This feature is available in North America and Singapore region only. Please get in touch with [support@nextbillion.ai](mailto:support@nextbillion.ai) to enquire/enable other areas. |
| truckAxleLoad    | No       | Float   |                                                                                                                                                     | Specify the total load per axle (including the weight of trailers and shipped goods) of the truck, in tonnes. When used, the service will return routes which are legally allowed to carry the load specified per axle. Please note this parameter is effective only when `mode=truck`.                                                                                                                                                                                                                                                                                                                                                                                                                             |
| hazmatType       | No       | String  | Allowed values: `general` ,  `circumstantial`  `explosive`  `harmful_to_water` .                                                                    | Specify the type of hazardous material being carried and the service will avoid roads which are not suitable for the type of goods specified. Multiple values can be separated using a pipe operator `\|` .<br>Please note that this parameter is effective only when `mode=truck`.                                                                                                                                                                                                                                                                                                                                                                                                                                 |

below are the default values:

| 1   | mode          | RequestParamConsts.MODE_CAR      |
| --- | ------------- | -------------------------------- |
| 2   | overview      | RequestParamConsts.OVERVIEW_FULL |
| 3   | unit          | RequestParamConsts.METRIC        |
| 4   | key           | Nextbillion.getAccessKey()       |
| 5   | baseUrl       | Nextbillion.getBaseUri()         |
| 6   | alternatives  | false                            |
| 7   | altCount      | 0                                |
| 8   | departureTime | 0                                |
| 9   | language      | DEFAULT_LANGUAGE_VALUE           |

## Fetch a route

The minimum requirement to fuel a route fetching is a pair of coordinates, an origin point, and a destination point, in this docs, we are using two fixed coordinates(In Singapore):

```java
Point origin = Point.fromLngLat(103.75986708439264, 1.312533169133601);
Point destination = Point.fromLngLat(103.77982271935586, 1.310473772283314);
```

And then utilize the functions from **“NBNavigation”**.

The simplest function/static method only requires three parameters, two coordinates, and an instance of the Retrofit’s Callback, with this function, we can populate the response and get the route instance, we are also able to handle HTTP status code and errors by ourselves.

```java
NBNavigation.fetchRoute(origin, destination, new Callback<DirectionsResponse>() {
            @Override
            public void onResponse(@NonNull Call<DirectionsResponse> call, @NonNull Response<DirectionsResponse> response) {
                DirectionsRoute route = response.body().routes().get(0);
                //start navigation with the route we just fetched.
            }

            @Override
            public void onFailure(@NonNull Call<DirectionsResponse> call, @NonNull Throwable t) {

            }
        });
```

Use `NBNavigation.fetchRoute(origin, destination, callback)` to request a route and handle success/failure in the callback.

The callback object provides two observer methods, **onResponse()** and **onFailure()** for handling the API response. In case of a successful API call, the method **onResponse()** will be invoked, in which we can retrieve the first route from the response and save it in the variable route. Subsequently, it initiates navigation with this route.

On the other hand, if there is a failure in the API call, the method **onFailure()** will be executed, it can be used to handle the exception or display an error message to the developer/user.

## Start navigation

After we fetch a route, the next step is to build a launching configuration that is composed of a route and set shouldSimulateRoute as true if we want to simulate the navigation.

```java
NavLauncherConfig.Builder configBuilder = NavLauncherConfig.builder(route)
  .shouldSimulateRoute(true);
configBuilder.locationLayerRenderMode(RenderMode.GPS);
```

Start navigation with the launcher configuration we just built.

```java
NavigationLauncher.startNavigation(activity, configBuilder.build());
```

`NavigationLauncher.startNavigation(activity, configBuilder.build())` starts navigation with the built config.

Put them together and we get:

```java
NBNavigation.fetchRoute(origin, destination, new Callback<DirectionsResponse>() {
            @Override
            public void onResponse(@NonNull Call<DirectionsResponse> call, @NonNull Response<DirectionsResponse> response) {
                DirectionsRoute route = response.body().routes().get(0);
                //start a navigation with the route we just fetched.
                NavLauncherConfig.Builder configBuilder = NavLauncherConfig.builder(route)
 .shouldSimulateRoute(true);
                configBuilder.locationLayerRenderMode(RenderMode.GPS);
                NavigationLauncher.startNavigation(activity, configBuilder.build());
            }

            @Override
            public void onFailure(@NonNull Call<DirectionsResponse> call, @NonNull Throwable t) {

            }
});
```

It is assumed that the developer, who integrates this piece of code, already has the SDK set up and configured correctly, the import classes and interfaces are already added and the developer has the required permissions to start the navigation.

# Basic Map Display

## MapView

MapView is a crucial component of the Android Maps SDK that allows developers to display maps in their Android applications. With MapView, developers can create engaging and interactive location-based experiences for their users. This custom view provides a powerful set of features, including map styling, markers, camera animations, and user interactions such as touch and zoom. Whether you're building a mapping app, location-based service, or simply need to display maps in your application, MapView is the key to making it happen. The Android Maps SDK provides an easy-to-use and flexible API that makes it simple to integrate MapView into your app and start creating amazing maps experiences.

### Integration of MapView

There are two ways to integrate a MapView to your App

1. **Add MapView to your layout XML**

   ```xml
   <ai.nextbillion.maps.core.MapView
   android:id="@+id/map_view"
   android:layout_width="match_parent"
   android:layout_height="match_parent" />

   <ai.nextbillion.maps.core.MapView
   android:id="@+id/map_view"
   android:layout_width="match_parent"
   android:layout_height="match_parent"
   app:nbmap_cameraTargetLat="40.38532445"
   app:nbmap_cameraTargetLng="-82.91441935"
   app:nbmap_cameraZoom="10" />
   ```

   This code creates a `MapView` object with an ID of _map_view_ and sets its width and height to match the parent view. In the second code snippet, additional attributes such as _nbmap_cameraTargetLat, nbmap_cameraTargetLng_, and _nbmap_cameraZoom_ are added to set the initial camera position and zoom level for the `MapView`.

2. _Instantiate a MapView and then add it to a parent view_

   ```kotlin
   mapView = new MapView(context);

   parentView.addView(mapView);
   //or
   setContentView(mapView);
   ```

   This code creates a new instance of `MapView` by calling the constructor with a context object. The `MapView` is then added to a parent view either by calling _parentView.addView(mapView)_ or _setContentView(mapView)_. The choice of which method to use depends on the specific use case and the desired parent view.

### Obtain Maps Interface

`NextbillionMap` is the interface of the _MapView_, which allows developers to make changes to the _MapView_, for example, add a marker to the MapView.

To get an instance of the NextbillionMap, we need to register an _OnMapReadyCallback_ to the _MapView_ as soon as we get the reference to it. There are two ways to register the callback:

1. Implementing the _OnMapReadyCallback_ interface within the class that requires the `NextbillionMap` instance.

   ```kotlin
   public class YourClass implements OnMapReadyCallback

   private NextbillionMap nextbillionMap;
   ...
   mapView.getMapAsync(this);
   ...

   @Override
   public void onMapReady(@NonNull NextbillionMap nextbillionMap) {
       this.nextbillionMap = nextbillionMap;
   }
   ```

2. Defining an anonymous _OnMapReadyCallback_ class.

   ```kotlin
   private  OnMapReadyCallback onMapReadyCallback = new OnMapReadyCallback() {
       @Override
       public void onMapReady(@NonNull NextbillionMap nextbillionMap) {
           this.nextbillionMap = nextbillionMap;
       }
   };

   ...
   mapView.getMapAsync(onMapReadyCallback);
   ...
   ```

Once the map is ready, the _onMapReady_ method will be triggered and the _nextbillionMap_ instance variable will be set to the `NextbillionMap` that is passed as an argument to the method. Now, the code can make changes to the _MapView_ using the _nextbillionMap_ instance.

### Lifecycle of MapView

Also, to avoid unexpected behaviors, don’t forget to bind MapView’s lifecycle to Activity

```kotlin
@Override
protected void onCreate(Bundle savedInstanceState) {
   super.onCreate(savedInstanceState);
   setContentView(R.layout.activity_main);

   mapView = findViewById(R.id.map_view);
   mapView.onCreate(savedInstanceState);
   mapView.getMapAsync(this);
}

///////////////////////////////////////////////////////////////////////////
/// Lifecycle
////////////////////////////////////////////////////////////////////////

@Override
protected void onStart() {
   super.onStart();
   mapView.onStart();
}

@Override
protected void onResume() {
   super.onResume();
   mapView.onResume();
}

@Override
protected void onPause() {
   super.onPause();
   mapView.onPause();
}

@Override
protected void onStop() {
   super.onStop();
   mapView.onStop();
}

@Override
protected void onSaveInstanceState(@NonNull Bundle outState) {
   super.onSaveInstanceState(outState);
   mapView.onSaveInstanceState(outState);
}

@Override
protected void onDestroy() {
   super.onDestroy();
   mapView.onDestroy();
}

@Override
public void onLowMemory() {
   super.onLowMemory();
   mapView.onLowMemory();
}
```

The MapView's lifecycle should be bound to the activity's lifecycle by calling corresponding lifecycle methods of the MapView in each activity method, such as _onCreate_, _onStart_, _onResume_, _onPause_, _onStop_, _onSaveInstanceState_, _onDestroy_, and _onLowMemory_. In the _onCreate_ method, the `MapView` is initialized with _mapView.onCreate_ and loaded with _mapView.getMapAsync_.
If you're using a fragment, call _mapView.onDestroy()_ inside the fragment's _onDestroyView()_.

## Camera

The Android Maps SDK provides a camera component that allows developers to control the view of the map. The camera component can be used to manipulate the position, orientation, and zoom level of the map view. With the camera, developers can provide a customized map experience for their users, for example, by zooming in on specific locations or tilting the view to show a particular perspective. The camera component is essential in creating dynamic and interactive map-based applications with the Nextbillion Android Maps SDK.

### Get current Camera Position

The code snippet demonstrates how to retrieve the current camera position from a **NextbillionMap** object.

```
 CameraPosition currentCameraPosition = nextbillionMap.getCameraPosition();
 double currentZoom = currentCameraPosition.zoom;
 double currentTilt = currentCameraPosition.tilt;
```

The _getCameraPosition_ method of the _NextbillionMap_ object is used to retrieve the current camera position, which is represented by a _CameraPosition_ object. The _CameraPosition_ object contains several properties, including the zoom level and the tilt angle of the camera. In this example, two variables are defined: _currentZoom_ and _currentTilt_. These variables are set to the zoom and tilt properties of the _CameraPosition_ object, respectively. This code will allow a developer to retrieve the current camera position and use it in further operations, such as adjusting the camera position or performing calculations based on the current camera position.

### Update Camera Position

The code snippet demonstrates how to update the camera position in the `NextbillionMap` object.

```
int millisecondSpeed = 300;
CameraPosition position = new CameraPosition.Builder()
         .target(new LatLng(12.97551913,77.58917229))
         .zoom(12)
         .tilt(20)
         .build();
nextbillionMap.animateCamera(CameraUpdateFactory.newCameraPosition(position), millisecondSpeed);
```

The _animateCamera_ method of the `NextbillionMap` is used to animate the camera to a new position, represented by a _CameraPosition_ object.

A _CameraPosition_ object is constructed using the _CameraPosition.Builder_ class. The target position, zoom level, and tilt angle of the camera are specified using the _target_, _zoom_, and _tilt_ methods, respectively. When a _CameraPosition_ object is constructed, the _CameraUpdate_ object is created using the _CameraUpdateFactory.newCameraPosition_ method, passing the _CameraPosition_ object as an argument.

Finally, the _animateCamera_ method is called on the `NextbillionMap` object, passing the _CameraUpdate_ object and the _millisecondSpeed_ variable as arguments. The _millisecondSpeed_ variable represents the speed of the camera animation, in milliseconds. The _animateCamera_ method will animate the camera to the specified position over the specified duration, resulting in a smooth transition to the new camera position.

## Annotations

For more details of annotations, please refer to Markers and Annotations.

### Add a marker

The `addMarker` method takes an instance of the _LatLng_ class as an argument, which represents the coordinates(latitude and longitude) of the marker. In this example, the marker is placed at the coordinate `12.97551913, 77.58917229`. This line of code will add a marker to the map at that location, allowing the user to visualize and interact with the location in the map view.

```
nextbillionMap.addMarker(new LatLng(12.97551913,77.58917229));
```

### Add a polyline

The `addPolyline` method takes three arguments: _origin_, _dest_, and a _color_ value represented in an ARGB int. The _origin_ and _dest_ parameters represent the starting and ending points of the polyline respectively. The color value determines the color of the polyline.

In this example, the polyline is drawn from _origin_ to _dest_ and is set to the color with an ARGB value of _0xff00ffff_, which represents a shade of cyan. This line of code will add a polyline to the map that connects the two points, allowing the user to visualize a path or route between them.

```
nextbillionMap.addPolyline(origin, dest, 0xff00ffff);
```

### Add a polygon

The `addPolygon` method takes two arguments: _a list of points_ and a _color value_ represented in an ARGB int. The _points_ parameter represents the vertices of the polygon. The _color_ value determines the color of the polygon.

In this example, the polygon is defined by the vertices in points and is set to the color with an ARGB value of _0xffff0000_, which represents the color red. This line of code will add a polygon to the map, allowing the user to visualize and interact with a region defined by the vertices.

```
nextbillionMap.addPolygon(points, 0xffff0000);
```

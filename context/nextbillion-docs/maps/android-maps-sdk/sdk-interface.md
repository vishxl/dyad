# SDK Interface

`NextbillionMap` is an interactable interface of the _MapView_, each _MapView_ instance will have one associated instance of _NextbillionMap_.

We can get the reference of _NextbillionMap_ that belongs to a current MapView in the callback of _OnMapReadyCallback_.

With `NextbillionMap` we can make changes to the current _MapView_, which includes:

- Get basic information about the current MapView
- Scroll the current MapView
- Style management
- Perform camera control
- Annotations management
- Manage multiple gesture listeners
- Manage InfoWindow
- Query rendered features
- Obtain reference of UiSettings
- Obtain reference of Projection

With **NextbillionMap**, developers have a comprehensive solution for adding location intelligence and mapping capabilities to their Android mobile applications.

## Interface

The **NextbillionMap** Interface is a powerful tool for developers to integrate maps and location services into their Android mobile applications. It provides a user-friendly interface and a wide range of features. The SDK is designed to be highly customizable, allowing developers to create unique and interactive mapping experiences for their users. With the NextbillionMap Android Map SDK, developers can add location intelligence and mapping capabilities to their apps, enabling users to explore, discover and interact with the world around them in new and innovative ways.

### Get basic information about the current MapView

The `getHeight()` and `getWidth()` methods in the NextbillionMap Android Map SDK Interface provide basic information about the current MapView by returning its height and width respectively. The height and width of a MapView are returned as floating-point values, indicating the dimensions of the view in device-independent pixels.

```
public float getHeight()
public float getWidth()
```

By calling these methods, developers can retrieve the current dimensions of the MapView, which can be useful for various purposes such as adjusting the display of annotations or other elements within the map. For example, a developer could use the MapView's height and width to determine the ideal size for markers or other visual elements on the map, ensuring that they are displayed optimally on any screen size.

### Scroll the current MapView

```
public void scrollBy(float x, float y)
public void scrollBy(float x, float y, long duration)
```

The `scrollBy(float x, float y)` and `scrollBy(float x, float y, long duration)` methods in the NextbillionMap Android Map SDK Interface allow developers to control the movement of the MapView. These methods scroll the MapView by a specified distance in the x and y directions and offer a choice between an immediate scroll or a smooth animated scroll with a specified duration. This allows developers to easily navigate the MapView programmatically and create an interactive mapping experience for the user.

### Style management

The NextbillionMap Android Map SDK Interface provides several methods for managing the style of the MapView, including retrieving, setting, and updating the style as needed.

```
public Style getStyle()
public void getStyle(@NonNull Style.OnStyleLoaded onStyleLoaded)
public void setStyle(String style)
public void setStyle(String style, final Style.OnStyleLoaded callback)
public void setStyle(Style.Builder builder)
public void setStyle(Style.Builder builder, final Style.OnStyleLoaded callback)
```

The `getStyle()` method returns the current style of the MapView. This method can be useful for retrieving the current style for further processing or for storing it for later use.
For more advanced style management, the _getStyle(@NonNull Style.OnStyleLoaded onStyleLoaded)_ method allows developers to retrieve the style of the MapView asynchronously, providing a callback to handle the loaded style.

The _setStyle(String style)_ and _setStyle(String style, OnStyleLoaded callback)_ methods set style from a style URI/URL. To apply raw style JSON, use _setStyle(new Style.Builder().fromJson(styleJson))_.
In addition, the _setStyle(Style.Builder builder)_ and _setStyle(Style.Builder builder, final Style.OnStyleLoaded callback)_ methods allow developers to programmatically build and set the style of the MapView using the _Style.Builder_ class. The second method provides a callback to handle the loaded style.

For more details of Style, please refer to [SDK Style and GeoJSON](https://docs.google.com/document/d/1nTDWbB9bkMKAgvnb5bBF8vk4dAnv3TX7y1REDIZbtqc/edit?tab=t.0#heading=h.wj8okz17pw02).

### Perform camera control

This code provides functionality for controlling the camera in a map view. The methods allow you to set the camera position, set a _LatLngBounds_ or Geometry to focus on, and retrieve the current camera position. There are also methods to add or remove listeners for camera movement events, such as _onCameraIdle_, _onCameraMoveStarted_, _onCameraMoveCanceled_, and _onCameraMove_.

```
public void setLatLngBoundsForCameraTarget(@Nullable LatLngBounds latLngBounds)
public CameraPosition getCameraForLatLngBounds(@NonNull LatLngBounds latLngBounds)
public CameraPosition getCameraForLatLngBounds(@NonNull LatLngBounds latLngBounds,
                                                   @NonNull @Size(value = 4) int[] padding)
public CameraPosition getCameraForLatLngBounds(@NonNull LatLngBounds latLngBounds,
                                                   @FloatRange(from = NbmapConstants.MINIMUM_DIRECTION,
                                                           to = NbmapConstants.MAXIMUM_DIRECTION) double bearing,
                                                   @FloatRange(from = NbmapConstants.MINIMUM_TILT,
                                                           to = NbmapConstants.MAXIMUM_TILT) double tilt)
public CameraPosition getCameraForLatLngBounds(@NonNull LatLngBounds latLngBounds,
                                                   @NonNull @Size(value = 4) int[] padding,
                                                   @FloatRange(from = NbmapConstants.MINIMUM_DIRECTION,
                                                           to = NbmapConstants.MAXIMUM_DIRECTION) double bearing,
                                                   @FloatRange(from = NbmapConstants.MINIMUM_TILT,
                                                           to = NbmapConstants.MAXIMUM_TILT) double tilt)
public CameraPosition getCameraForGeometry(@NonNull Geometry geometry)
public CameraPosition getCameraForGeometry(@NonNull Geometry geometry,
                                               @NonNull @Size(value = 4) int[] padding)
public CameraPosition getCameraForGeometry(@NonNull Geometry geometry,
                                               @FloatRange(from = NbmapConstants.MINIMUM_DIRECTION,
                                                       to = NbmapConstants.MAXIMUM_DIRECTION) double bearing,
                                               @FloatRange(from = NbmapConstants.MINIMUM_TILT,
                                                       to = NbmapConstants.MAXIMUM_TILT) double tilt)
public CameraPosition getCameraForGeometry(@NonNull Geometry geometry,
                                               @NonNull @Size(value = 4) int[] padding,
                                               @FloatRange(from = NbmapConstants.MINIMUM_DIRECTION,
                                                       to = NbmapConstants.MAXIMUM_DIRECTION) double bearing,
                                               @FloatRange(from = NbmapConstants.MINIMUM_TILT,
                                                       to = NbmapConstants.MAXIMUM_TILT) double tilt)
public void addOnCameraIdleListener(@NonNull OnCameraIdleListener listener)
public void removeOnCameraIdleListener(@NonNull OnCameraIdleListener listener)
public void addOnCameraMoveCancelListener(@NonNull OnCameraMoveCanceledListener listener)
public void removeOnCameraMoveCancelListener(@NonNull OnCameraMoveCanceledListener listener)
public void addOnCameraMoveStartedListener(@NonNull OnCameraMoveStartedListener listener)
public void removeOnCameraMoveStartedListener(@NonNull OnCameraMoveStartedListener listener)
public void addOnCameraMoveListener(@NonNull OnCameraMoveListener listener)
public void removeOnCameraMoveListener(@NonNull OnCameraMoveListener listener)
```

### Annotations management

These are the functions provided by an annotations management system in a mapping application.
The functions add a marker, polyline, or polygon to the map. The functions update a marker, polyline, or polygon that is already on the map. The functions remove a marker, polyline, or polygon, or remove all annotations from the map. The functions get annotations, markers, polylines, and polygons that are on the map.

```
public Marker addMarker(@NonNull LatLng position)
public Marker addMarker(@NonNull MarkerOptions markerOptions)
public Marker addMarker(@NonNull BaseMarkerOptions markerOptions)
public List<Marker> addMarkers(@NonNull List<? extends
            BaseMarkerOptions> markerOptionsList)
public void updateMarker(@NonNull Marker updatedMarker)
public Polyline addPolyline(@NonNull LatLng origin, @NonNull LatLng dest, int color)
public Polyline addPolyline(@NonNull LatLng origin, @NonNull LatLng dest, String color)
public Polyline addPolyline(@NonNull List<LatLng> points, int color)
public Polyline addPolyline(@NonNull List<LatLng> points, String color)
public Polyline addPolyline(@NonNull PolylineOptions polylineOptions)
public List<Polyline> addPolylines(@NonNull List<PolylineOptions> polylineOptionsList)
public void updatePolyline(@NonNull Polyline polyline)
public Polygon addPolygon(@NonNull List<LatLng> points, int color)
public Polygon addPolygon(@NonNull List<LatLng> points, String color)
public Polygon addPolygon(@NonNull PolygonOptions polygonOptions)
public List<Polygon> addPolygons(@NonNull List<PolygonOptions> polygonOptionsList)
public void updatePolygon(@NonNull Polygon polygon)
public void removeMarker(@NonNull Marker marker)
public void removePolyline(@NonNull Polyline polyline)
public void removePolygon(@NonNull Polygon polygon)
public void removeAnnotation(@NonNull Annotation annotation)
public void removeAnnotation(long id)
public void removeAnnotations(@NonNull List<? extends Annotation> annotationList)
public void removeAnnotations()
public void clear()
public Annotation getAnnotation(long id)
public List<Annotation> getAnnotations()
public List<Marker> getMarkers()
public List<Polygon> getPolygons()
public List<Polyline> getPolylines()
public void setOnMarkerClickListener(@Nullable OnMarkerClickListener listener)
public void setOnPolygonClickListener(@Nullable OnPolygonClickListener listener)
public void setOnPolylineClickListener(@Nullable OnPolylineClickListener listener)
public void selectMarker(@NonNull Marker marker)
public void deselectMarkers()
public void deselectMarker(@NonNull Marker marker)
public List<Marker> getSelectedMarkers()
```

The _setOnMarkerClickListener_, _setOnPolygonClickListener_, and _setOnPolylineClickListener_ functions allow setting listeners for clicks on markers, polylines, or polygons. The _selectMarker_ and _deselectMarker_ functions allow for selecting and deselecting markers. The _getSelectedMarkers_ function returns the list of selected markers.

For more details of annotations, please refer to [Markers and Annotations](/maps/android-maps-sdk/markers-and-annotations).

### Manage gesture listeners

These are methods for adding and removing listeners for different types of gestures in an application.

```
public void addOnFlingListener(@NonNull OnFlingListener listener)
public void removeOnFlingListener(@NonNull OnFlingListener listener)
public void addOnMoveListener(@NonNull OnMoveListener listener)
public void removeOnMoveListener(@NonNull OnMoveListener listener)
public void addOnRotateListener(@NonNull OnRotateListener listener)
public void removeOnRotateListener(@NonNull OnRotateListener listener)
public void addOnScaleListener(@NonNull OnScaleListener listener)
public void removeOnScaleListener(@NonNull OnScaleListener listener)
public void addOnShoveListener(@NonNull OnShoveListener listener)
public void removeOnShoveListener(@NonNull OnShoveListener listener)
public void addOnMapClickListener(@NonNull OnMapClickListener listener)
public void removeOnMapClickListener(@NonNull OnMapClickListener listener)
public void addOnMapLongClickListener(@NonNull OnMapLongClickListener listener)
```

Available listeners:

```
OnFlingListener
OnMoveListener
OnRotateListener
OnScaleListener
OnShoveListener
OnCameraMoveStartedListener
OnCameraMoveListener
OnCameraMoveCanceledListener
OnCameraIdleListener
OnCompassAnimationListener
OnFpsChangedListener
OnGesturesManagerInteractionListener
OnMapClickListener
OnMapLongClickListener
OnMarkerClickListener
OnPolygonClickListener
OnPolylineClickListener
OnInfoWindowClickListener
OnInfoWindowLongClickListener
OnInfoWindowCloseListener
InfoWindowAdapter
CancelableCallback
SnapshotReadyCallback
OnDeveloperAnimationListener
```

For more details of gestures, please refer to [UI Settings and Gestures](./ui-settings-and-gestures).

### Manage InfoWindow

These methods are for managing an `InfoWindow` in a map application. An InfoWindow is a pop-up window that provides information about a specific location or feature on a map.

```
public void setOnInfoWindowClickListener(@Nullable OnInfoWindowClickListener listener)
public OnInfoWindowClickListener getOnInfoWindowClickListener()
public void setOnInfoWindowLongClickListener(@Nullable OnInfoWindowLongClickListener)
public OnInfoWindowLongClickListener getOnInfoWindowLongClickListener()
public void setOnInfoWindowCloseListener(@Nullable OnInfoWindowCloseListener listener)
public OnInfoWindowCloseListener getOnInfoWindowCloseListener()
```

- **setOnInfoWindowClickListener**: sets a listener to receive notifications when an InfoWindow is clicked.
- **getOnInfoWindowClickListener**: returns the current InfoWindow click listener.
- **setOnInfoWindowLongClickListener**: sets a listener to receive notifications when an InfoWindow is long-clicked.
- **getOnInfoWindowLongClickListener**: returns the current InfoWindow long-click listener.
- **setOnInfoWindowCloseListener**: sets a listener to receive notifications when an InfoWindow is closed.
- **getOnInfoWindowCloseListener**: returns the current InfoWindow close listener.

### Query rendered features

These methods are for querying the features that have been rendered on a map. A feature is a geometric shape (such as a point, line, or polygon) that represents a real-world object or location.

The methods take the following parameters:

- **coordinates**: the location to query, either a point or a rectangle
- **filter**: an optional expression used to filter the features based on their properties
- **layerIds**: an optional list of layer IDs to restrict the query to

The methods return a list of Feature objects that have been rendered on the map and match the specified criteria.

```
public List<Feature> queryRenderedFeatures(@NonNull PointF coordinates, @Nullable String... layerIds)
public List<Feature> queryRenderedFeatures(@NonNull PointF coordinates,
                                               @Nullable Expression filter,
                                               @Nullable String... layerIds)
public List<Feature> queryRenderedFeatures(@NonNull RectF coordinates, @Nullable String... layerIds)
public List<Feature> queryRenderedFeatures(@NonNull RectF coordinates,
                                               @Nullable Expression filter,
                                               @Nullable String... layerIds)
```

The first two methods query features based on a point location. The second two methods query features based on a rectangular area. The difference between the two sets of methods is whether a filter expression is specified or not. If a filter is specified, only features that match the filter criteria will be returned. If no filter is specified, all features that have been rendered within the specified location will be returned.

### Obtain reference of UiSettings

This method is for obtaining a reference to the **UiSettings** object associated with a map. The **UiSettings** object provides control over various user interface elements of the map, such as the zoom controls, the compass, and the my-location button.

```
public UiSettings getUiSettings()
```

By calling **getUiSettings()**, you can access the **UiSettings** object and use its methods to modify the behavior and appearance of the map's user interface elements.

For more details of UiSettings please refer to UI Settings and Gestures.

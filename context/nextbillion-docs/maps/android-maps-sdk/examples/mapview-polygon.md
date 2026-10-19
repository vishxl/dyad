# MapView Polygon

This example shows how to add Polygons in MapView

- Add Polygon from a set of Latlng

- Query Visible Polygon in Rect

- Set Polygon stroke

- Set Polygon color

![MapView Polygon](https://static.nextbillion.io/docs-next/docs/maps/android/mapview-polygon.webp)

For all code examples, refer to [Android Maps SDK Code Examples](https://github.com/nextbillion-ai/nb-maps-android-demo)

**activity_polygon.xml** [view source](https://github.com/nextbillion-ai/nb-maps-android-demo/blob/main/app/src/main/res/layout/activity_polygon.xml)

```xml
<?xml version="1.0" encoding="utf-8"?>
<androidx.coordinatorlayout.widget.CoordinatorLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    tools:context=".PolygonActivity">

    <ai.nextbillion.maps.core.MapView
        android:id="@+id/map_view"
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        app:nbmap_cameraTargetLat="53.5493093866953"
        app:nbmap_cameraTargetLng="10.031835837897463"
        app:nbmap_cameraZoom="10"
        app:nbmap_uiAttribution="false" />

    <androidx.core.widget.NestedScrollView
        android:id="@+id/bottomSheet"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:background="@color/white"
        app:behavior_hideable="true"
        app:layout_behavior="com.google.android.material.bottomsheet.BottomSheetBehavior">

        <LinearLayout
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:orientation="vertical">

            <TextView
                android:layout_width="68dp"
                android:layout_height="1dp"
                android:layout_gravity="center_horizontal"
                android:layout_marginTop="13dp"
                android:background="@drawable/nbmap_radius_10_grey_bg" />

            <TextView
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:layout_marginTop="13dp"
                android:paddingHorizontal="16dp"
                android:text="@string/polygonSetting"
                android:textColor="@color/black"
                android:textSize="24sp" />

            <ai.nextbillion.view.SettingSwitchView
                android:id="@+id/pointEnable"
                android:layout_width="match_parent"
                android:layout_height="wrap_content"
                android:layout_marginLeft="16dp"
                android:layout_marginRight="16dp" />

            <ai.nextbillion.view.ColorSelectorView
                android:id="@+id/polygon_color"
                android:layout_width="match_parent"
                android:layout_height="wrap_content"
                android:layout_marginTop="10dp" />

            <ai.nextbillion.view.ColorSelectorView
                android:id="@+id/polygon_stroke_Color"
                android:layout_width="match_parent"
                android:layout_height="wrap_content"
                android:layout_marginTop="10dp" />

            <ai.nextbillion.view.SliderBarView
                android:id="@+id/lineWidth"
                android:layout_width="match_parent"
                android:layout_height="wrap_content"
                android:layout_marginBottom="10dp" />

        </LinearLayout>

    </androidx.core.widget.NestedScrollView>

    <com.google.android.material.floatingactionbutton.FloatingActionButton
        android:id="@+id/fb_clean"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_gravity="right"
        android:layout_marginTop="120dp"
        android:layout_marginRight="16dp"
        android:backgroundTint="@color/purple_200"
        android:src="@android:drawable/ic_menu_close_clear_cancel"
        android:tooltipText="Clean"
        app:fabSize="mini" />

    <TextView
        android:id="@+id/fb_check"
        android:layout_width="40dp"
        android:layout_height="40dp"
        android:layout_gravity="right"
        android:layout_marginTop="170dp"
        android:layout_marginRight="16dp"
        android:background="@drawable/shape_circle_40_md_grey_400"
        android:gravity="center"
        android:text="@string/polygonStrokeCheck" />

    <com.google.android.material.floatingactionbutton.FloatingActionButton
        android:id="@+id/fb_expand"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_gravity="right|bottom"
        android:layout_marginRight="16dp"
        android:layout_marginBottom="56dp"
        android:backgroundTint="@color/purple_200"
        android:src="@android:drawable/ic_dialog_info"
        android:tooltipText="Create"
        android:visibility="gone"
        app:fabSize="mini" />

    <ImageView
        android:id="@+id/iv_back"
        android:layout_width="40dp"
        android:layout_height="40dp"
        android:layout_gravity="top|left"
        android:layout_marginLeft="16dp"
        android:layout_marginTop="16dp"
        android:background="@drawable/circle_white_bg"
        android:src="@drawable/icon_back"
        app:tint="@color/color_back_icon" />

</androidx.coordinatorlayout.widget.CoordinatorLayout>
```

**PolygonActivity** [view source](https://github.com/nextbillion-ai/nb-maps-android-demo/blob/main/app/src/main/java/ai/nextbillion/PolygonActivity.java)

```java
public class PolygonActivity extends AppCompatActivity implements View.OnClickListener {

   private NextbillionMap mMap;
   private MapView mapView;
   private BottomSheetBehavior bottomSheetBehavior;
   private Polygon polygon;
   // for stroke
   private Polyline polyline;

   // polygon
   private List<LatLng> polygonPoints = new ArrayList<>();
   private List<Marker> polygonMarkers = new ArrayList<>();
   private LatLngBounds latLngBounds;
   private Marker clickMarker;

   // menu
   private ColorSelectorView polygonColorSelectorView;
   private ColorSelectorView polygonStrokeColorSelectorView;
   private SliderBarView polygonStrokeWidthSliderBarView;
   private SettingSwitchView pointSettingSwitchView;
   private FloatingActionButton fbInfoFloatingActionButton;
   private TextView fbNoticeButton;

   private String polygonColor = "#1E58A5";
   private String polygonStrokeColor = "#FF0000";
   private float stockWidth = 2;
   private int polygonIndex = 1;
   private boolean showPolygonVertex = true;

   @Override
   protected void onCreate(Bundle savedInstanceState) {
       super.onCreate(savedInstanceState);
       setContentView(R.layout.activity_polygon);
       mapView = findViewById(R.id.map_view);
       mapView.onCreate(savedInstanceState);
       mapView.getMapAsync(this::onMapSync);
       // button
       findViewById(R.id.fb_clean).setOnClickListener(this);
       fbInfoFloatingActionButton = findViewById(R.id.fb_expand);
       fbInfoFloatingActionButton.setOnClickListener(this);
       fbNoticeButton = findViewById(R.id.fb_check);
       fbNoticeButton.setOnClickListener(this);
       // menu
       polygonColorSelectorView = findViewById(R.id.polygon_color);
       polygonStrokeColorSelectorView = findViewById(R.id.polygon_stroke_Color);
       polygonStrokeWidthSliderBarView = findViewById(R.id.lineWidth);
       pointSettingSwitchView = findViewById(R.id.pointEnable);
       findViewById(R.id.iv_back).setOnClickListener(this);
       initData();
       initBottomSheet();
   }

   private void initData() {
       polygonColorSelectorView.setTitle(getResources().getString(R.string.polygonColor));
       polygonColorSelectorView.initColor(polygonColor);
       polygonStrokeColorSelectorView.setTitle(getResources().getString(R.string.polygonStrokeColor));
       polygonStrokeColorSelectorView.initColor(polygonStrokeColor);
       polygonStrokeWidthSliderBarView.setTitle(getResources().getString(R.string.polygonStrokeWidth));
       polygonStrokeWidthSliderBarView.initSeekBar(2, 0, 20, "px", 1);
       pointSettingSwitchView.setTitle(getResources().getString(R.string.polygon_point_show));
       pointSettingSwitchView.defaultValue(true);
       polygonColorSelectorView.setOnColorChangedListener(new ColorSelectorView.OnColorChangedListener() {
           @Override
           public void onColorChanged(@NonNull String color) {
               polygonColor = color;
               if (polygon != null) {
                   polygon.setFillColor(Color.parseColor(color));
               }
           }
       });
       polygonStrokeColorSelectorView.setOnColorChangedListener(new ColorSelectorView.OnColorChangedListener() {
           @Override
           public void onColorChanged(@NonNull String color) {
               polygonStrokeColor = color;
               int colorHex = Color.parseColor(color);
               if (polyline != null) {
                   polyline.setColor(colorHex);
               }
           }
       });
       polygonStrokeWidthSliderBarView.setOnSliderChangedListener(new SliderBarView.OnSliderChangedListener() {
           @Override
           public void onSliderChanged(float value) {
               stockWidth = value;
               if (polyline != null) {
                   polyline.setWidth(value);
               }
           }
       });

       pointSettingSwitchView.setOnSwitchChangedLister(new SettingSwitchView.OnSwitchChangedLister() {
           @Override
           public void onSwitchChanged(boolean status) {
               showPolygonVertex = status;
               upDataMarkerBySwitchState();
           }
       });
   }

   private void upDataMarkerBySwitchState() {
       if (polygonMarkers == null || polygonMarkers.isEmpty()) {
           return;
       }
       for (Marker marker : polygonMarkers) {
           marker.setIcon(IconFactory.getInstance(PolygonActivity.this)
                   .fromResource((showPolygonVertex || polygonPoints.size() < 3) ? R.mipmap.ic_blue_dot : R.mipmap.ic_marker_transparent));
       }
   }

   private void onMapSync(NextbillionMap map) {
       mMap = map;
       addMapListener();
       mMap.setStyle( Style.Builder().fromUri(StyleConstants.LIGHT))
   }

   private void addMapListener() {
       mMap.addOnMapLongClickListener(new NextbillionMap.OnMapLongClickListener() {
           @Override
           public boolean onMapLongClick(@NonNull LatLng latLng) {
               polygonPoints.add(latLng);
               MarkerOptions markerOptions = new MarkerOptions()
                       .setTitle(String.valueOf(polygonIndex))
                       .position(latLng)
                       .setIcon(IconFactory.getInstance(PolygonActivity.this)
                               .fromResource((showPolygonVertex || polygonPoints.size() < 3) ? R.mipmap.ic_blue_dot : R.mipmap.ic_marker_transparent));
               polygonMarkers.add(mMap.addMarker(markerOptions));
               polygonIndex ++;
               if (polygonPoints.size() > 2) {
                   createPolygon();
               }
               return false;
           }
       });
       mMap.addOnMapClickListener(new NextbillionMap.OnMapClickListener() {
           @Override
           public boolean onMapClick(@NonNull LatLng latLng) {
               if (clickMarker != null) {
                   mMap.removeMarker(clickMarker);
               }
               clickMarker = mMap.addMarker(latLng);
               Point clickPoint = new Point(latLng.getLongitude(),latLng.getLatitude());
               List<Point> polygonLngLatPoints = new ArrayList<>();
               for (LatLng point : polygonPoints) {
                   polygonLngLatPoints.add(new Point(point.getLongitude(),point.getLatitude()));
               }
               boolean isPointInPolygon = PolygonUtils.isPointInPolygon(clickPoint,PolygonUtils.getPolygon(true,polygonLngLatPoints));
               if (isPointInPolygon) {
                   Toast.makeText(PolygonActivity.this, "this point is in polygon", Toast.LENGTH_SHORT).show();
               }
               return false;
           }
       });
       mMap.addOnMoveListener(new NextbillionMap.OnMoveListener() {
           @Override
           public void onMoveBegin(@NonNull MoveGestureDetector moveGestureDetector) {

           }

           @Override
           public void onMove(@NonNull MoveGestureDetector moveGestureDetector) {

           }

           @Override
           public void onMoveEnd(@NonNull MoveGestureDetector moveGestureDetector) {
               boolean isPolygonInScreen = checkPolygonVisibility();
               if (isPolygonInScreen) {
                   fbNoticeButton.setBackgroundResource(R.drawable.shape_circle_40_purple_200);
               } else {
                   fbNoticeButton.setBackgroundResource(R.drawable.shape_circle_40_md_grey_400);
               }
           }
       });
       mMap.setOnMarkerClickListener(new NextbillionMap.OnMarkerClickListener() {
           @Override
           public boolean onMarkerClick(@NonNull Marker marker) {
               if (marker == clickMarker) {
                   mMap.removeMarker(clickMarker);
                   clickMarker = null;
               }
               return false;
           }
       });
   }

   private boolean checkPolygonVisibility() {
       if (mMap == null || mMap.getProjection() == null || latLngBounds == null) {
           return false;
       }
       LatLngBounds isInScreen = mMap.getProjection().getVisibleRegion().latLngBounds.intersect(latLngBounds);
       return isInScreen != null;
   }

   private void cleanPolygon() {
       if (mMap == null || polygon == null) {
           Toast.makeText(PolygonActivity.this, "No polygon need remove", Toast.LENGTH_SHORT).show();
           return;
       }
       mMap.removePolygon(polygon);
       polygon = null;
       polygonPoints.clear();
       latLngBounds = null;
       // polygon marker
       for (Marker marker : polygonMarkers) {
           mMap.removeMarker(marker);
       }
       polygonMarkers.clear();

       // line
       if (polyline != null) {
           mMap.removePolyline(polyline);
           polyline = null;
       }
   }

   private void createPolygon() {
       // check map
       if (mMap == null) {
           Toast.makeText(this, getResources().getString(R.string.waite_notice), Toast.LENGTH_SHORT).show();
           return;
       }
       // check data
       if (polygonPoints.isEmpty()) {
           Toast.makeText(this, getResources().getString(R.string.polygon_empty_point_notice), Toast.LENGTH_SHORT).show();
           return;
       }

       if (polyline != null) {
           mMap.removePolyline(polyline);
       }

       if (polygon != null) {
           mMap.removePolygon(polygon);
       }
       // update marker show style
       upDataMarkerBySwitchState();

       // add polygon
       latLngBounds = new LatLngBounds.Builder().includes(polygonPoints).build();
       PolygonOptions polygonOptions = new PolygonOptions();
       polygonOptions.addAll(polygonPoints)
               .fillColor(Color.parseColor(polygonColor))
               .strokeColor(Color.parseColor(polygonStrokeColor));
       polygon = mMap.addPolygon(polygonOptions);

       // add polygon stroke by polyline
       List<LatLng> polylinePoints = new ArrayList<>(polygonPoints);
       polylinePoints.add(polygonPoints.get(0));
       polylinePoints.add(polygonPoints.get(1));
       PolylineOptions polylineOptions = new PolylineOptions()
               .addAll(polylinePoints)
               .color(Color.parseColor(polygonStrokeColor))
               .width(stockWidth);
       polyline = mMap.addPolyline(polylineOptions);
       // change check button color
       fbNoticeButton.setBackgroundResource(R.drawable.shape_circle_40_purple_200);
   }

   private void initBottomSheet() {
       bottomSheetBehavior = BottomSheetBehavior.from(findViewById(R.id.bottomSheet));
       bottomSheetBehavior.setState(BottomSheetBehavior.STATE_EXPANDED);
       bottomSheetBehavior.setPeekHeight((int) Utils.dpToPx(60));
       bottomSheetBehavior.addBottomSheetCallback(new BottomSheetBehavior.BottomSheetCallback() {
           @Override
           public void onStateChanged(@NonNull View bottomSheet, int newState) {
               if (newState == BottomSheetBehavior.STATE_HIDDEN) {
                   fbInfoFloatingActionButton.setVisibility(View.VISIBLE);
               } else {
                   fbInfoFloatingActionButton.setVisibility(View.GONE);
               }
           }

           @Override
           public void onSlide(@NonNull View bottomSheet, float slideOffset) {

           }
       });
   }

   ///////////////////////////////////////////////////////////////////////////
   // Lifecycle
   ///////////////////////////////////////////////////////////////////////////

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

   @Override
   public void onClick(View v) {
       if (v.getId() == R.id.fb_clean) {
           cleanPolygon();
       } else if (v.getId() == R.id.fb_expand) {
           bottomSheetBehavior.setState(BottomSheetBehavior.STATE_EXPANDED);
       } else if (v.getId() == R.id.fb_check) {
           boolean isPolygonInScreen = checkPolygonVisibility();
           String message = getResources().getString(R.string.polygin_visibility_notice);
           if (!isPolygonInScreen) {
               message = getResources().getString(R.string.polygon_invisibility_notice);
           }
           Toast.makeText(PolygonActivity.this, message, Toast.LENGTH_SHORT).show();
       } else if (v.getId() == R.id.iv_back) {
           finish();
       }
   }
}
```

**initData**

- Initialises the data for the polygon activity.

- Sets up various UI components such as color selectors, slider bars, and switch views. It also defines listeners for these components to handle user interactions and update the corresponding data values.

**addMapListener**

- Adds listeners to the map.

- Sets up event listeners for various map interactions such as long clicks, clicks, moves, and marker clicks. These listeners perform actions such as adding markers, creating polygons, checking polygon visibility, and removing markers and polygons.

**checkPolygonVisibility**

- Checks if the polygon is currently visible on the map. It relies on the map's projection and the bounds of the polygon to determine if the polygon is within the visible region of the map. It returns a boolean value indicating the visibility status of the polygon.

**createPolygon**

- Creates a polygon on the map. It checks if the necessary data, such as the map and polygon points, are available. It removes any existing polyline and polygon from the map. It updates the marker show style based on the switch state. Then it adds a polygon and a polyline to the map using the provided polygon points, colors, and stroke width.

**cleanPolygon**

- Removes the polygon and related markers from the map. It checks if the map and polygon are available and removes them from the map. It also clears the polygon points, marker list, and polyline if they exist.

These methods are part of the PolygonActivity class and are used to initialize and manage the polygon functionality in the corresponding Android activity.

The code also includes various lifecycle methods **(onStart, onResume, onPause, onStop, onSaveInstanceState, onDestroy, onLowMemory)** that should be implemented when using the MapView to properly manage its lifecycle and handle configuration changes.

Note: The code uses the Nextbillion Maps SDK, which provides map-related functionalities. It also utilizes the LatLng class to represent geography.

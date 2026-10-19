# Custom Polygon Cluster

This example shows how to add Polygon Cluster in MapView

- Add Cluster from GeoJson

- Aggregate a large number of coordinate points

![Custom Polygon Cluster](https://static.nextbillion.io/docs-next/docs/maps/android/custom-polygon-cluster.webp)

For all code examples, refer to [Android Maps SDK Code Examples](https://github.com/nextbillion-ai/nb-maps-android-demo)

**activity_polygon_cluster.xml** [view source](https://github.com/nextbillion-ai/nb-maps-android-demo/blob/main/app/src/main/res/layout/activity_polygon_cluster.xml)

```xml
<?xml version="1.0" encoding="utf-8"?>
<RelativeLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:orientation="vertical"
    tools:context=".PolygonActivity">

    <ai.nextbillion.maps.core.MapView
        android:id="@id/map_view"
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        app:nbmap_uiAttribution="false"
        app:nbmap_cameraTargetLat="1.3383500934590808"
        app:nbmap_cameraTargetLng="103.80586766146754"
        app:nbmap_cameraZoom="11" />

    <com.google.android.material.floatingactionbutton.FloatingActionButton
        android:id="@+id/fab_route"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_alignParentBottom="true"
        android:layout_alignParentEnd="true"
        android:layout_alignParentRight="true"
        android:layout_marginBottom="@dimen/fab_margin"
        android:layout_marginRight="@dimen/fab_margin"
        android:layout_marginEnd="@dimen/fab_margin"
        android:src="@drawable/ic_directions_bus_black"
        app:backgroundTint="@android:color/white" />

    <com.google.android.material.floatingactionbutton.FloatingActionButton
        android:id="@+id/fab_style"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_above="@id/fab_route"
        android:layout_alignParentEnd="true"
        android:layout_alignParentRight="true"
        android:layout_marginBottom="@dimen/fab_margin"
        android:layout_marginRight="@dimen/fab_margin"
        android:src="@drawable/ic_layers"
        android:layout_marginEnd="@dimen/fab_margin"
        app:backgroundTint="@color/purple_200"
        android:visibility="gone"/>

    <ImageView
        android:id="@+id/back_ib"
        android:layout_width="40dp"
        android:layout_height="40dp"
        android:layout_marginLeft="12dp"
        android:layout_marginTop="30dp"
        android:background="@drawable/circle_white_bg"
        android:src="@drawable/icon_back"
        app:tint="@color/color_back_icon"/>

</RelativeLayout>
```

**PolygonClusterActivity** [view source](https://github.com/nextbillion-ai/nb-maps-android-demo/blob/main/app/src/main/java/ai/nextbillion/PolygonClusterActivity.java)

```java
public class PolygonClusterActivity extends AppCompatActivity implements OnMapReadyCallback, NextbillionMap.OnMapClickListener, View.OnClickListener {

   private static final String TAG = "PolygonClusterActivity";
   public static final String SOURCE_ID = "bus_stop";
   public static final String SOURCE_ID_CLUSTER = "bus_stop_cluster";
   public static final String URL_BUS_ROUTES = "https://raw.githubusercontent.com/cheeaun/busrouter-sg/master/data/2/bus-stops.geojson";
   public static final String LAYER_ID = "stops_layer";
   private static final String TAXI = "taxi";
   private ImageView backBtn;
   private MapView mapView;
   private NextbillionMap nextbillionMap;

   private FloatingActionButton styleFab;
   private FloatingActionButton routeFab;

   private CircleLayer layer;
   private GeoJsonSource source;

   private int currentStyleIndex = 0;
   private boolean isLoadingStyle = true;

   @Override
   protected void onCreate(Bundle savedInstanceState) {
       super.onCreate(savedInstanceState);
       setContentView(R.layout.activity_polygon_cluster);
       mapView = findViewById(R.id.map_view);
       backBtn = findViewById(R.id.back_ib);
       mapView.onCreate(savedInstanceState);
       mapView.getMapAsync(this);

       backBtn.setOnClickListener(new View.OnClickListener() {
           @Override
           public void onClick(View v) {
               finish();
           }
       });
   }

   @Override
   public void onMapReady(@NonNull NextbillionMap nbMap) {
       this.nextbillionMap = nbMap;
       mapView.addOnDidFinishLoadingStyleListener(() -> {
           Style style = nextbillionMap.getStyle();
           style.addImage(TAXI,(BitmapDrawable)getResources().getDrawable(R.mipmap.beat_taxi));
           addBusStopSource(style);
           addBusStopCircleLayer(style);
           initFloatingActionButtons();
           isLoadingStyle = false;
       });
   }

   @Override
   public boolean onMapClick(@NonNull LatLng latLng) {

       return false;
   }

   private void addBusStopSource(Style style) {
       try {
           source = new GeoJsonSource(SOURCE_ID, new URI(URL_BUS_ROUTES));
       } catch (URISyntaxException exception) {
           Log.e(TAG, "That's not an url... ");
       }
       style.addSource(source);
   }

   private void addBusStopCircleLayer(Style style) {
       layer = new CircleLayer(LAYER_ID, SOURCE_ID);
       layer.setProperties(
               circleColor(Color.parseColor("#FF0000")),
               circleRadius(2.0f)
       );
       style.addLayerBelow(layer, "waterway-label");
   }

   private void initFloatingActionButtons() {
       routeFab = findViewById(R.id.fab_route);
       routeFab.setColorFilter(ContextCompat.getColor(PolygonClusterActivity.this, R.color.purple_200));
       routeFab.setOnClickListener(PolygonClusterActivity.this);

       styleFab = findViewById(R.id.fab_style);
       styleFab.setOnClickListener(PolygonClusterActivity.this);
   }

   @Override
   public void onClick(View view) {
       if (isLoadingStyle) {
           return;
       }

       if (view.getId() == R.id.fab_route) {
           showBusCluster();
       } else if (view.getId() == R.id.fab_style) {
           changeMapStyle();
       }
   }

   private void showBusCluster() {
       removeFabs();
       removeOldSource();
       addClusteredSource();
   }

   private void removeOldSource() {
       nextbillionMap.getStyle().removeSource(SOURCE_ID);
       nextbillionMap.getStyle().removeLayer(LAYER_ID);
   }

   private void addClusteredSource() {
       try {
           nextbillionMap.getStyle().addSource(
                   new GeoJsonSource(SOURCE_ID_CLUSTER,
                           new URI(URL_BUS_ROUTES),
                           new GeoJsonOptions()
                                   .withCluster(true)
                                   .withClusterMaxZoom(14)
                                   .withClusterRadius(50)
                   )
           );
       } catch (URISyntaxException malformedUrlException) {
           Log.e(TAG, "That's not an url... ");
       }

       // Add unclustered layer
       int[][] layers = new int[][]{
               new int[]{150, ResourcesCompat.getColor(getResources(), R.color.purple_200, getTheme())},
               new int[]{20, ResourcesCompat.getColor(getResources(), R.color.colorAccent, getTheme())},
               new int[]{0, ResourcesCompat.getColor(getResources(), R.color.color_4158ce, getTheme())}
       };

       SymbolLayer unclustered = new SymbolLayer("unclustered-points", SOURCE_ID_CLUSTER);
       unclustered.setProperties(
               iconImage(TAXI)
       );

       nextbillionMap.getStyle().addLayer(unclustered);

       for (int i = 0; i < layers.length; i++) {
           // Add some nice circles
           CircleLayer circles = new CircleLayer("cluster-" + i, SOURCE_ID_CLUSTER);
           circles.setProperties(
                   circleColor(layers[i][1]),
                   circleRadius(18f)
           );

           Expression pointCount = toNumber(get("point_count"));
           circles.setFilter(
                   i == 0
                           ? all(has("point_count"),
                           gte(pointCount, literal(layers[i][0]))
                   ) : all(has("point_count"),
                           gt(pointCount, literal(layers[i][0])),
                           lt(pointCount, literal(layers[i - 1][0]))
                   )
           );
           nextbillionMap.getStyle().addLayer(circles);
       }

       // Add the count labels
       SymbolLayer count = new SymbolLayer("count", SOURCE_ID_CLUSTER);
       count.setProperties(
               textField(Expression.toString(get("point_count"))),
               textSize(12f),
               textColor(Color.WHITE),
               textIgnorePlacement(true),
               textAllowOverlap(true)
       );
       nextbillionMap.getStyle().addLayer(count);
   }

   private void removeFabs() {
       routeFab.setVisibility(View.GONE);
       styleFab.setVisibility(View.GONE);
   }

   private void changeMapStyle() {
       isLoadingStyle = true;
       removeBusStop();
       loadNewStyle();
   }

   private void removeBusStop() {
       nextbillionMap.getStyle().removeLayer(layer);
       nextbillionMap.getStyle().removeSource(source);
   }

   private void loadNewStyle() {
       nextbillionMap.setStyle(new Style.Builder().fromUri(getNextStyle()));
   }

   private void addBusStop() {
       nextbillionMap.getStyle().addLayer(layer);
       nextbillionMap.getStyle().addSource(source);
   }

   private String getNextStyle() {
       currentStyleIndex++;
       if (currentStyleIndex == Data.STYLES.length) {
           currentStyleIndex = 0;
       }
       return Data.STYLES[currentStyleIndex];
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

   private static class Data {
       private static final String[] STYLES = new String[]{
               Style.NBMAP_STREETS,
               Style.OUTDOORS,
               Style.LIGHT,
               Style.DARK,
               Style.SATELLITE,
               Style.SATELLITE_STREETS
       };
   }
}
```

- **onMapReady**: This method is called when the map is ready to be used. It initializes the NextbillionMap object and adds listeners to the map-style loading event. Once the style finishes loading, it adds the bus stop source, bus stop circle layer and sets up the floating action buttons.

- **addBusStopSource**: This method adds a **GeoJsonSource** to the map style, representing the bus stop data source. It creates a **GeoJsonSource** object with the provided URL to a **GeoJSON** file containing bus stop information and adds it to the map style.

- **addBusStopCircleLayer**: This method adds a **CircleLayer** to the map style, representing the bus stop markers on the map. It creates a CircleLayer object with the specified **layer ID** and **source ID**, sets properties for the circle **color** and **radius** and adds the layer to the map style.

- **addClusteredSource**: This method adds a **clustered source** to the map style, representing a clustering of bus stops. It creates a **GeoJsonSource** object with the provided URL to a **GeoJSON** file, enables clustering with specified cluster options and adds the source to the map style. It also adds clustered and unclustered layers to represent the clusters and individual bus stops on the map.

- **showBusCluster**: This method is called when the user clicks on the "Route" floating action button. It removes the existing floating action buttons, removes the old bus stop source and layer from the map style, and adds a clustered source with **clustered** and **unclustered** layers to represent the bus stop **clusters** on the map.

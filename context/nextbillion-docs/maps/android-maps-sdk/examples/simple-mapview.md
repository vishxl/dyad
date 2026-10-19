# Simple MapView

This example shows how to display a simple map view in activity, this map view does not contain complicated functions, only basic UI.

![Simple MapView](https://static.nextbillion.io/docs-next/docs/maps/android/simple-mapview.webp)

For all code examples, refer to [Android Maps SDK Code Examples](https://github.com/nextbillion-ai/nb-maps-android-demo)

**activity_simple_map_view.xml** [view source](https://github.com/nextbillion-ai/nb-maps-android-demo/blob/main/app/src/main/res/layout/activity_simple_map_view.xml)

```xml
<?xml version="1.0" encoding="utf-8"?>
<androidx.constraintlayout.widget.ConstraintLayout xmlns:android="http://schemas.android.com/apk/res/android"
   xmlns:app="http://schemas.android.com/apk/res-auto"
   xmlns:tools="http://schemas.android.com/tools"
   android:layout_width="match_parent"
   android:layout_height="match_parent"
   tools:context=".MainActivity">

   <ai.nextbillion.maps.core.MapView
       android:id="@+id/simple_map_view"
       android:layout_width="match_parent"
       android:layout_height="match_parent"
       app:nbmap_uiAttribution="false"
       app:nbmap_cameraTargetLat="53.550813508267716"
       app:nbmap_cameraTargetLng="9.992248999933745"
       app:nbmap_cameraZoom="12" />

</androidx.constraintlayout.widget.ConstraintLayout>
```

**SimpleMapViewActivity** [view source](https://github.com/nextbillion-ai/nb-maps-android-demo/blob/main/app/src/main/java/ai/nextbillion/SimpleMapViewActivity.java)

```java
package ai.nextbillion;

import android.os.Bundle;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import ai.nextbillion.maps.core.MapView;
import ai.nextbillion.maps.core.NextbillionMap;
import ai.nextbillion.maps.core.OnMapReadyCallback;
import ai.nextbillion.maps.core.Style;

public class SimpleMapViewActivity extends AppCompatActivity implements OnMapReadyCallback {

   private MapView mapView;
   private NextbillionMap mMap;

   @Override
   protected void onCreate(Bundle savedInstanceState) {
       super.onCreate(savedInstanceState);
       setContentView(R.layout.activity_simple_map_view);
       mapView = findViewById(R.id.simple_map_view);
       mapView.onCreate(savedInstanceState);
   }

   @Override
   public void onMapReady(@NonNull NextbillionMap nextbillionMap) {
       mMap = nextbillionMap;
       mMap.getStyle(new Style.OnStyleLoaded() {
           @Override
           public void onStyleLoaded(@NonNull Style style) {
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
}
```

## Code summary

The **SimpleMapViewActivity** class extends the AppCompatActivity class and implements the **OnMapReadyCallback** interface. It can be used to display a map view in an Android app.

The class has the following members:

- **mapView**: A MapView object that is used to display the map.

- **mMap**: A NextbillionMap object that represents the map data.

The class overrides the following methods:

- **onCreate()**: This method is called when the activity is first created. It initializes the map view and sets the map's style.

- **onMapReady()**: This method is called when the map is ready to be used. It sets the map's center and zoom level.

- **onStart()**: This method is called when the activity starts. It starts the map view.

- **onResume()**: This method is called when the activity resumes. It resumes the map view.

- **onPause()**: This method is called when the activity pauses. It pauses the map view.

- **onStop()**: This method is called when the activity stops. It stops the map view.

- **onSaveInstanceState()**: This method is called when the activity is saved to the state. It saves the map view's state.

- **onDestroy()**: This method is called when the activity is destroyed. It destroys the map view.

- **onLowMemory()**: This method is called when the device is low on memory. It reduces the map view's memory usage.

Here are some additional details about the code:

- The **onCreate()** method initializes the map view and sets the map's style. The map view is initialized by calling the setContentView() method and passing it to the R.layout.activity_simple_map_view layout resource. The map's style is set by calling the mMap.getStyle() method and pass it to a listener that will be called when the style is loaded.

- The **onMapReady()** method is called when the map is ready to be used. It sets the map's center and zoom level. The map's center is set by calling the mMap.setCenter() method and passing it the coordinates of the center point. The map's zoom level is set by calling the mMap.setZoom() method and pass it to the zoom level.

- The other methods in the class implement the lifecycle methods for an activity. These methods are called when the activity starts, pauses, stops, resumes, is destroyed, or is low on memory.

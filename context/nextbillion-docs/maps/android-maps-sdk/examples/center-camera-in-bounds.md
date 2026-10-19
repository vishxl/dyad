# Center Camera In Bounds

This example shows how to Center Camera in Bounds

- Create polygon with custom bound area

- Center Camera to given bounds and padding

- mMap.animateCamera(CameraUpdateFactory.newLatLngBounds(bounds, 150))

![Center Camera In Bounds](https://static.nextbillion.io/docs-next/docs/maps/android/center-camera-in-bounds.webp)

For all code examples, refer to [Android Maps SDK Code Examples](https://github.com/nextbillion-ai/nb-maps-android-demo)

activity_bounds.xml view source

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
        app:nbmap_uiAttribution="false"
        app:nbmap_cameraTargetLat="53.5511"
        app:nbmap_cameraTargetLng="9.9937"
        app:nbmap_cameraZoom="12.5" />

    <ImageView
        android:id="@+id/iv_back"
        android:layout_width="40dp"
        android:layout_height="40dp"
        android:layout_marginLeft="16dp"
        app:layout_constraintTop_toTopOf="parent"
        app:layout_constraintLeft_toLeftOf="parent"
        android:layout_marginTop="16dp"
        android:background="@drawable/circle_white_bg"
        android:src="@drawable/icon_back"
        app:tint="@color/color_back_icon"/>

    <com.google.android.material.floatingactionbutton.FloatingActionButton
        android:id="@+id/removeBounds"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_gravity="right|bottom"
        android:layout_marginRight="20dp"
        android:layout_marginBottom="40dp"
        android:visibility="gone"
        app:elevation="10dp"
        app:backgroundTint="@color/color_4158ce"
        app:pressedTranslationZ="10dp"
        app:fabSize="normal"
        android:src="@drawable/icon_close"/>
</androidx.coordinatorlayout.widget.CoordinatorLayout>
```

BoundsActivity view source

```java
package ai.nextbillion;
import ai.nextbillion.databinding.ActivityBoundsBinding;
import ai.nextbillion.maps.annotations.PolygonOptions;
import ai.nextbillion.maps.camera.CameraUpdateFactory;
import ai.nextbillion.maps.core.NextbillionMap;
import ai.nextbillion.maps.core.Style;
import ai.nextbillion.maps.geometry.LatLng;
import ai.nextbillion.maps.geometry.LatLngBounds;
import android.graphics.Color;
import android.os.Bundle;
import android.view.LayoutInflater;
import androidx.appcompat.app.AppCompatActivity;

/**
 * @author qiuyu
 * @Date 2022/6/30
 **/
class BoundsActivity : AppCompatActivity(){

    private lateinit var binding: ActivityBoundsBinding
    private lateinit var mMap: NextbillionMap
    private var boundsPoints: MutableList<LatLng> = mutableListOf()
    private var boundsArea: PolygonOptions? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityBoundsBinding.inflate(LayoutInflater.from(this))
        setContentView(binding.root)
        binding.mapView.onCreate(savedInstanceState)
        binding.mapView.getMapAsync { map: NextbillionMap -> onMapSync(map) }
        binding.removeBounds.setOnClickListener {
            removeBounds()
        }
        binding.ivBack.setOnClickListener {
            finish()
        }
    }

    private fun removeBounds() {
        mMap.clear()
        boundsPoints.clear()
        boundsArea = null
        binding.removeBounds.hide()
    }

    private fun onMapSync(map: NextbillionMap) {
        mMap = map
        mMap.addOnMapLongClickListener {
            checkBounds(it)
            false
        }
        map.setStyle( Style.Builder().fromUri(StyleConstants.LIGHT))
    }

    private fun checkBounds(latLng: LatLng) {
        mMap.addMarker(latLng)
        boundsPoints.add(latLng)

        if (boundsPoints.size >= 4) {
            binding.removeBounds.show()
            boundsArea?.let {
                mMap.removePolygon(it.polygon)
            }
            val bounds = LatLngBounds.Builder().includes(boundsPoints).build()
            mMap.setLatLngBoundsForCameraTarget(bounds);
            boundsArea = PolygonOptions()
                .add(bounds.northWest)
                .add(bounds.northEast)
                .add(bounds.southEast)
                .add(bounds.southWest)
            boundsArea?.let {
                it.alpha(0.25f)
                it.fillColor(Color.RED)
                mMap.addPolygon(it)
            }
            mMap.animateCamera(CameraUpdateFactory.newLatLngBounds(bounds, 150))
        }

    }

    ///////////////////////////////////////////////////////////////////////////
    // Lifecycle
    ///////////////////////////////////////////////////////////////////////////
    override fun onStart() {
        super.onStart()
        binding.mapView.onStart()
    }

    override fun onResume() {
        super.onResume()
        binding.mapView.onResume()
    }

    override fun onPause() {
        super.onPause()
        binding.mapView.onPause()
    }

    override fun onStop() {
        super.onStop()
        binding.mapView.onStop()
    }

    override fun onSaveInstanceState(outState: Bundle) {
        super.onSaveInstanceState(outState)
        binding.mapView.onSaveInstanceState(outState)
    }

    override fun onDestroy() {
        super.onDestroy()
        binding.mapView.onDestroy()
    }

    override fun onLowMemory() {
        super.onLowMemory()
        binding.mapView.onLowMemory()
    }
}
```

The given code is an Android activity that allows users to create a polygon by selecting points on a map. It also provides the functionality to remove the created polygon.

Initializing the MapView:

- The MapView is initialized in the onCreate method using **binding.mapView.onCreate(savedInstanceState)**.

- The map is obtained asynchronously using **binding.mapView.getMapAsync** and the **onMapSync** method is called.

Creating a Polygon with Custom Bound Area:

- The **onMapSync** method sets up the NextbillionMap and adds a map long click listener.

- When a long click event occurs, the checkBounds method is called with the clicked **LatLng** coordinate.

- The clicked LatLng is added to the boundsPoints list, and a marker is placed at that location on the map.

- If there are at least 4 points in the boundsPoints list, a polygon is created with the bounds using **LatLngBounds.Builder().includes(boundsPoints).build()**.

- The existing bounds area is removed from the map using **mMap.removePolygon(it.polygon)**.

- A new **PolygonOptions** object is created and added to the map with the appropriate points and styling.

- The camera is animated to center on the created bounds using **mMap.animateCamera(CameraUpdateFactory.newLatLngBounds(bounds, 150))**.

Centering Camera to Given Bounds and Padding:

- The **mMap.setLatLngBoundsForCameraTarget(bounds)** method is used to set the bounds for the camera movement.

- The camera is animated to center on the created bounds with a padding of 150 pixels.

Removing Bounds:

- The **removeBounds** method is called when the "removeBounds" button is clicked.

- It clears the map, clears the boundsPoints list, sets boundsArea to null, and hides the "removeBounds" button. Lifecycle Methods:

The code also includes various lifecycle methods **(onStart, onResume, onPause, onStop, onSaveInstanceState, onDestroy, onLowMemory)** that should be implemented when using the MapView to properly manage its lifecycle and handle configuration changes.

_Note_: The code uses the Nextbillion Maps SDK, which provides map-related functionalities. It also utilizes the LatLng class to represent geographical coordinates and the LatLngBounds class to define a rectangular area on the map.

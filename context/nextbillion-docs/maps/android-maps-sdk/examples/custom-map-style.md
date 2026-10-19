# Custom Map Style

This example shows how to Switch Runtime Map Style

- Location Permissions Handling

- Switch Map Style using **nextbillionMap.setStyle(new Style.Builder().fromUri(styleUrl))**

- Tracking Current Location Automatically when MapReady
  - **locationComponent.setLocationComponentEnabled(true)**;

  - **locationComponent.setRenderMode(RenderMode.COMPASS)**;

  - **locationComponent.setCameraMode(CameraMode.TRACKING)**;

![Custom Map Style](<https://static.nextbillion.io/docs-next/docs/maps/android/custom-map style.webp>)

For all code examples, refer to [Android Maps SDK Code Examples](https://github.com/nextbillion-ai/nb-maps-android-demo)

**activity_location_layer_map_change.xml** [view source](https://github.com/nextbillion-ai/nb-maps-android-demo/blob/main/app/src/main/res/layout/activity_location_layer_map_change.xml)

```xml
<?xml version="1.0" encoding="utf-8"?>
<androidx.coordinatorlayout.widget.CoordinatorLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:id="@+id/coordinator_layout"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:orientation="vertical">

    <ai.nextbillion.maps.core.MapView
        android:id="@+id/mapView"
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        android:layout_marginBottom="0dp"
        app:nbmap_uiAttribution="false" />

    <com.google.android.material.floatingactionbutton.FloatingActionButton
        android:id="@+id/fabStyles"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_gravity="end|bottom"
        android:layout_marginBottom="16dp"
        android:layout_marginEnd="16dp"
        android:layout_marginRight="16dp"
        android:src="@drawable/ic_layers"
        android:tint="@android:color/white"
        app:backgroundTint="@color/palette_mint_100"
        app:layout_anchorGravity="top" />

</androidx.coordinatorlayout.widget.CoordinatorLayout>
```

**CustomMapStyleActivity** [view source](https://github.com/nextbillion-ai/nb-maps-android-demo/blob/main/app/src/main/java/ai/nextbillion/CustomMapViewActivity.java)

```java
package ai.nextbillion;

import android.annotation.SuppressLint;
import android.os.Bundle;
import android.widget.Toast;

import com.google.android.material.floatingactionbutton.FloatingActionButton;

import java.util.List;

import ai.nextbillion.maps.camera.CameraPosition;
import ai.nextbillion.maps.camera.CameraUpdateFactory;
import ai.nextbillion.maps.core.MapView;
import ai.nextbillion.maps.core.NextbillionMap;
import ai.nextbillion.maps.core.OnMapReadyCallback;
import ai.nextbillion.maps.core.Style;
import ai.nextbillion.maps.geometry.LatLng;
import ai.nextbillion.maps.location.LocationComponent;
import ai.nextbillion.maps.location.LocationComponentActivationOptions;
import ai.nextbillion.maps.location.LocationComponentOptions;
import ai.nextbillion.maps.location.modes.CameraMode;
import ai.nextbillion.maps.location.modes.RenderMode;
import ai.nextbillion.maps.location.permissions.PermissionsListener;
import ai.nextbillion.maps.location.permissions.PermissionsManager;
import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;

public class CustomMapStyleActivity extends AppCompatActivity implements OnMapReadyCallback {

    private MapView mapView;
    private NextbillionMap nextbillionMap;
    private PermissionsManager permissionsManager;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_location_layer_map_change);

        mapView = findViewById(R.id.mapView);
        FloatingActionButton stylesFab = findViewById(R.id.fabStyles);

        stylesFab.setOnClickListener(v -> {
            if (nextbillionMap != null) {
                toggleMapStyle();
            }
        });

        mapView.onCreate(savedInstanceState);

        if (PermissionsManager.areLocationPermissionsGranted(this)) {
            mapView.getMapAsync(this);
        } else {
            permissionsManager = new PermissionsManager(new PermissionsListener() {
                @Override
                public void onExplanationNeeded(List<String> permissionsToExplain) {
                    Toast.makeText(CustomMapStyleActivity.this, "You need to accept location permissions.",
                            Toast.LENGTH_SHORT).show();
                }

                @Override
                public void onPermissionResult(boolean granted) {
                    if (granted) {
                        mapView.getMapAsync(CustomMapStyleActivity.this);
                    } else {
                        finish();
                    }
                }
            });
            permissionsManager.requestLocationPermissions(this);
        }
    }

    private void toggleMapStyle() {
        nextbillionMap.getStyle(style -> {
            String styleUrl = StyleConstants.DARK.equals(style.getUri()) ? StyleConstants.LIGHT : StyleConstants.DARK;
            nextbillionMap.setStyle(new Style.Builder().fromUri(styleUrl));
        });
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        permissionsManager.onRequestPermissionsResult(requestCode, permissions, grantResults);
    }

    @Override
    public void onMapReady(@NonNull NextbillionMap nextbillionMap) {
        this.nextbillionMap = nextbillionMap;
        CameraPosition cameraPosition = new CameraPosition.Builder()
                .target(new LatLng(22.70418008712976, 78.66264025041812))
                .zoom(6)
                .tilt(30)
                .tilt(0)
                .build();
        nextbillionMap.moveCamera(CameraUpdateFactory.newCameraPosition(cameraPosition));
        nextbillionMap.setStyle(new Style.Builder().fromUri(StyleConstants.LIGHT),
                style -> activateLocationComponent(style));
    }

    @SuppressLint("MissingPermission")
    private void activateLocationComponent(@NonNull Style style) {
        LocationComponent locationComponent = nextbillionMap.getLocationComponent();

        locationComponent.activateLocationComponent(
                LocationComponentActivationOptions
                        .builder(this, style)
                        .useDefaultLocationEngine(true)
                        .locationComponentOptions(LocationComponentOptions.builder(this)
                                .pulseEnabled(true)
                                .build())
                        .build());

        locationComponent.setLocationComponentEnabled(true);
        locationComponent.setRenderMode(RenderMode.COMPASS);
        locationComponent.setCameraMode(CameraMode.TRACKING);

        locationComponent.addOnLocationClickListener(
                () -> Toast.makeText(this, "Location clicked", Toast.LENGTH_SHORT).show());

        locationComponent.addOnLocationLongClickListener(
                () -> Toast.makeText(this, "Location long clicked", Toast.LENGTH_SHORT).show());
    }

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
    protected void onSaveInstanceState(Bundle outState) {
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

This code is an Android application that demonstrates how to customize the map style and handle location permissions using the Nextbillion Maps SDK. Here's a summary of the code:

Initializing MapView:

- The MapView is initialized by calling **mapView.onCreate(savedInstanceState)**.

Location Permissions Handling:

- The app checks if location permissions are granted using **PermissionsManager.areLocationPermissionsGranted(this)**. If permissions are granted, the map is asynchronously loaded. Otherwise, the app requests location permissions using the PermissionsManager and handles the permission result in the **onPermissionResult** callback.

Switch Map Style:

- The app provides a floating action button (FAB) to toggle the map style. When the FAB is clicked, the **toggleMapStyle()** method is called. It gets the current map style using **nextbillionMap.getStyle()** and switches between a dark and light style by setting the new style using
  - nextbillionMap.setStyle(new Style.Builder().fromUri(styleUrl)).

Tracking Current Location Automatically:

- When the map is ready (onMapReady callback), the camera is positioned to a specific location and zoom level.

- The map style is set to the light style, and the location component is activated using nextbillionMap.getLocationComponent().activateLocationComponent().

- The location component is configured to use the default location engine and display a pulsing animation.

- It is enabled and set to render mode **COMPASS** and camera mode **TRACKING**. The location component also listens for click and long-click events on the user's location.
  - **locationComponent.setLocationComponentEnabled(true)**;
  - **locationComponent.setRenderMode(RenderMode.COMPASS)**;
  - **locationComponent.setCameraMode(CameraMode.TRACKING)**;

Additional lifecycle methods are implemented to manage the MapView, including **onStart, onResume, onPause, onStop, onSaveInstanceState, onDestroy**, and **onLowMemory**.

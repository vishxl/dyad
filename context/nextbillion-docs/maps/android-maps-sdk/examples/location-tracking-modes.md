# Location Tracking Modes

This example shows how to Switch Location Tracking Modes

- Location Permissions Handling

- Switch Location component RenderMode

- Switch Location Tracking Camera Mode

- Enable/Disable Location Component

- Tracking Current Location Automatically when MapReady
  - locationComponent.setLocationComponentEnabled(true);
  - locationComponent.setRenderMode(RenderMode.COMPASS);
  - locationComponent.setCameraMode(CameraMode.TRACKING);

![Location Tracking Modes](https://static.nextbillion.io/docs-next/docs/maps/android/location-tracking-modes.webp)

For all code examples, refer to [Android Maps SDK Code Examples](https://github.com/nextbillion-ai/nb-maps-android-demo)

**activity_location_modes.xml** [view source](https://github.com/nextbillion-ai/nb-maps-android-demo/blob/main/app/src/main/res/layout/activity_location_modes.xml)

```xml
<?xml version="1.0" encoding="utf-8"?>
<androidx.constraintlayout.widget.ConstraintLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="match_parent">

    <ai.nextbillion.maps.core.MapView
        android:id="@+id/mapView"
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        android:layout_marginBottom="0dp"
        app:layout_constraintBottom_toTopOf="parent"
        app:layout_constraintLeft_toLeftOf="parent"
        app:layout_constraintRight_toRightOf="parent"
        app:layout_constraintTop_toTopOf="parent"
        app:nbmap_uiAttribution="false" />

    <View
        android:id="@+id/view_protected_gesture_area"
        android:layout_width="0dp"
        android:layout_height="0dp"
        android:alpha="0.5"
        android:background="@android:color/holo_red_light"
        app:layout_constraintStart_toStartOf="@id/mapView"
        app:layout_constraintTop_toTopOf="@id/mapView" />

    <LinearLayout
        android:id="@+id/linearLayout"
        style="?android:attr/buttonBarStyle"
        android:layout_width="0dp"
        android:layout_height="wrap_content"
        android:background="@color/palette_mint_100"
        android:orientation="horizontal"
        android:weightSum="4"
        app:layout_constraintBottom_toBottomOf="parent"
        app:layout_constraintLeft_toLeftOf="parent"
        app:layout_constraintRight_toRightOf="parent"
        tools:layout_constraintBottom_creator="1"
        tools:layout_constraintLeft_creator="1"
        tools:layout_constraintRight_creator="1">

        <TextView
            android:id="@+id/tv_mode"
            android:layout_width="0dp"
            android:layout_height="match_parent"
            android:layout_weight=".75"
            android:gravity="center"
            android:text="Mode:"
            android:textColor="@color/white"
            android:textSize="18sp"
            android:textStyle="bold" />

        <Button
            android:id="@+id/button_location_mode"
            style="?android:attr/buttonBarButtonStyle"
            android:layout_width="0dp"
            android:layout_height="wrap_content"
            android:layout_weight="1.25"
            android:gravity="center"
            android:text="Normal"
            android:textColor="@android:color/white" />

        <TextView
            android:id="@+id/tv_tracking"
            android:layout_width="0dp"
            android:layout_height="match_parent"
            android:layout_weight=".85"
            android:gravity="center"
            android:text="Tracking:"
            android:textColor="@color/white"
            android:textSize="18sp"
            android:textStyle="bold" />

        <Button
            android:id="@+id/button_location_tracking"
            style="?android:attr/buttonBarButtonStyle"
            android:layout_width="0dp"
            android:layout_height="wrap_content"
            android:layout_weight="1.15"
            android:gravity="center"
            android:text="None"
            android:textColor="@android:color/white" />

    </LinearLayout>

</androidx.constraintlayout.widget.ConstraintLayout>
```

**LocationModesActivity** [view source](https://github.com/nextbillion-ai/nb-maps-android-demo/blob/main/app/src/main/java/ai/nextbillion/LocationModesActivity.java)

```java
package ai.nextbillion;

import android.annotation.SuppressLint;
import android.graphics.RectF;
import android.location.Location;
import android.os.Bundle;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.Toast;

import java.util.ArrayList;
import java.util.List;

import ai.nextbillion.maps.camera.CameraUpdateFactory;
import ai.nextbillion.maps.core.MapView;
import ai.nextbillion.maps.core.NextbillionMap;
import ai.nextbillion.maps.core.OnMapReadyCallback;
import ai.nextbillion.maps.location.LocationComponent;
import ai.nextbillion.maps.location.LocationComponentActivationOptions;
import ai.nextbillion.maps.location.LocationComponentOptions;
import ai.nextbillion.maps.location.OnCameraTrackingChangedListener;
import ai.nextbillion.maps.location.OnLocationCameraTransitionListener;
import ai.nextbillion.maps.location.OnLocationClickListener;
import ai.nextbillion.maps.location.engine.LocationEngineRequest;
import ai.nextbillion.maps.location.modes.CameraMode;
import ai.nextbillion.maps.location.modes.RenderMode;
import ai.nextbillion.maps.location.permissions.PermissionsListener;
import ai.nextbillion.maps.location.permissions.PermissionsManager;
import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.ListPopupWindow;

public class LocationModesActivity extends AppCompatActivity implements OnMapReadyCallback,
        OnLocationClickListener, OnCameraTrackingChangedListener {

    private MapView mapView;
    private Button locationModeBtn;
    private Button locationTrackingBtn;
    private View protectedGestureArea;

    private PermissionsManager permissionsManager;

    private LocationComponent locationComponent;
    private NextbillionMap nextbillionMap;
    private boolean defaultStyle = false;

    private static final String SAVED_STATE_CAMERA = "saved_state_camera";
    private static final String SAVED_STATE_RENDER = "saved_state_render";
    private static final String SAVED_STATE_LOCATION = "saved_state_location";

    @CameraMode.Mode
    private int cameraMode = CameraMode.TRACKING;

    @RenderMode.Mode
    private int renderMode = RenderMode.NORMAL;

    private Location lastLocation;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_location_modes);

        mapView = findViewById(R.id.mapView);
        protectedGestureArea = findViewById(R.id.view_protected_gesture_area);

        locationModeBtn = findViewById(R.id.button_location_mode);
        locationModeBtn.setOnClickListener(v -> {
            if (locationComponent == null) {
                return;
            }
            showModeListDialog();
        });

        locationTrackingBtn = findViewById(R.id.button_location_tracking);
        locationTrackingBtn.setOnClickListener(v -> {
            if (locationComponent == null) {
                return;
            }
            showTrackingListDialog();
        });

        if (savedInstanceState != null) {
            cameraMode = savedInstanceState.getInt(SAVED_STATE_CAMERA);
            renderMode = savedInstanceState.getInt(SAVED_STATE_RENDER);
            lastLocation = savedInstanceState.getParcelable(SAVED_STATE_LOCATION);
        }

        mapView.onCreate(savedInstanceState);

        if (PermissionsManager.areLocationPermissionsGranted(this)) {
            mapView.getMapAsync(this);
        } else {
            permissionsManager = new PermissionsManager(new PermissionsListener() {
                @Override
                public void onExplanationNeeded(List<String> permissionsToExplain) {
                    Toast.makeText(LocationModesActivity.this, "You need to accept location permissions.",
                            Toast.LENGTH_SHORT).show();
                }

                @Override
                public void onPermissionResult(boolean granted) {
                    if (granted) {
                        mapView.getMapAsync(LocationModesActivity.this);
                    } else {
                        finish();
                    }
                }
            });
            permissionsManager.requestLocationPermissions(this);
        }
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        permissionsManager.onRequestPermissionsResult(requestCode, permissions, grantResults);
    }

    @SuppressLint("MissingPermission")
    @Override
    public void onMapReady(@NonNull NextbillionMap nextbillionMap) {
        this.nextbillionMap = nextbillionMap;
        nextbillionMap.animateCamera(CameraUpdateFactory.zoomBy(13));
        nextbillionMap.setStyle(StyleConstants.NBMAP_STREETS, style -> {
            locationComponent = nextbillionMap.getLocationComponent();
            locationComponent.activateLocationComponent(
                    LocationComponentActivationOptions
                            .builder(this, style)
                            .useSpecializedLocationLayer(true)
                            .useDefaultLocationEngine(true)
                            .locationEngineRequest(new LocationEngineRequest.Builder(750)
                                    .setFastestInterval(750)
                                    .setPriority(LocationEngineRequest.PRIORITY_HIGH_ACCURACY)
                                    .build())
                            .build());

            locationComponent.setLocationComponentEnabled(true);
            locationComponent.addOnLocationClickListener(this);
            locationComponent.addOnCameraTrackingChangedListener(this);
            locationComponent.setCameraMode(cameraMode);
            setRendererMode(renderMode);
            locationComponent.forceLocationUpdate(lastLocation);
        });
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.menu_location_mode, menu);
        return true;
    }

    @SuppressLint("MissingPermission")
    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        if (locationComponent == null) {
            return super.onOptionsItemSelected(item);
        }

        int id = item.getItemId();
        if (id == R.id.action_component_disable) {
            locationComponent.setLocationComponentEnabled(false);
            return true;
        } else if (id == R.id.action_component_enabled) {
            locationComponent.setLocationComponentEnabled(true);
            return true;
        } else if (id == R.id.action_gestures_management_disabled) {
            disableGesturesManagement();
            return true;
        } else if (id == R.id.action_gestures_management_enabled) {
            enableGesturesManagement();
            return true;
        } else if (id == R.id.action_component_throttling_enabled) {
            locationComponent.setMaxAnimationFps(5);
        } else if (id == R.id.action_component_throttling_disabled) {
            locationComponent.setMaxAnimationFps(Integer.MAX_VALUE);
        } else if (id == R.id.action_component_animate_while_tracking) {
            locationComponent.zoomWhileTracking(17, 750, new NextbillionMap.CancelableCallback() {
                @Override
                public void onCancel() {
                    // No impl
                }

                @Override
                public void onFinish() {
                    locationComponent.tiltWhileTracking(60);
                }
            });
            if (locationComponent.getCameraMode() == CameraMode.NONE) {

                Toast.makeText(this, "Not possible to animate - not tracking", Toast.LENGTH_SHORT).show();
            }
        }

        return super.onOptionsItemSelected(item);
    }

    private void disableGesturesManagement() {
        if (locationComponent == null) {
            return;
        }

        protectedGestureArea.getLayoutParams().height = 0;
        protectedGestureArea.getLayoutParams().width = 0;

        LocationComponentOptions options = locationComponent
                .getLocationComponentOptions()
                .toBuilder()
                .trackingGesturesManagement(false)
                .build();
        locationComponent.applyStyle(options);
    }

    private void enableGesturesManagement() {
        if (locationComponent == null) {
            return;
        }

        RectF rectF = new RectF(0f, 0f, mapView.getWidth() / 2f, mapView.getHeight() / 2f);
        protectedGestureArea.getLayoutParams().height = (int) rectF.bottom;
        protectedGestureArea.getLayoutParams().width = (int) rectF.right;

        LocationComponentOptions options = locationComponent
                .getLocationComponentOptions()
                .toBuilder()
                .trackingGesturesManagement(true)
                .trackingMultiFingerProtectedMoveArea(rectF)
                .trackingMultiFingerMoveThreshold(500)
                .build();
        locationComponent.applyStyle(options);
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

    @SuppressLint("MissingPermission")
    @Override
    protected void onSaveInstanceState(Bundle outState) {
        super.onSaveInstanceState(outState);
        mapView.onSaveInstanceState(outState);
        outState.putInt(SAVED_STATE_CAMERA, cameraMode);
        outState.putInt(SAVED_STATE_RENDER, renderMode);
        if (locationComponent != null) {
            outState.putParcelable(SAVED_STATE_LOCATION, locationComponent.getLastKnownLocation());
        }
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
    public void onLocationComponentClick() {
        Toast.makeText(this, "OnLocationComponentClick", Toast.LENGTH_LONG).show();
    }

    private void showModeListDialog() {
        List<String> modes = new ArrayList<>();
        modes.add("Normal");
        modes.add("Compass");
        modes.add("GPS");
        ArrayAdapter<String> profileAdapter = new ArrayAdapter<>(this,
                android.R.layout.simple_list_item_1, modes);
        ListPopupWindow listPopup = new ListPopupWindow(this);
        listPopup.setAdapter(profileAdapter);
        listPopup.setAnchorView(locationModeBtn);
        listPopup.setOnItemClickListener((parent, itemView, position, id) -> {
            String selectedMode = modes.get(position);
            locationModeBtn.setText(selectedMode);
            if (selectedMode.contentEquals("Normal")) {
                setRendererMode(RenderMode.NORMAL);
            } else if (selectedMode.contentEquals("Compass")) {
                setRendererMode(RenderMode.COMPASS);
            } else if (selectedMode.contentEquals("GPS")) {
                setRendererMode(RenderMode.GPS);
            }
            listPopup.dismiss();
        });
        listPopup.show();
    }

    private void setRendererMode(@RenderMode.Mode int mode) {
        renderMode = mode;
        locationComponent.setRenderMode(mode);
        if (mode == RenderMode.NORMAL) {
            locationModeBtn.setText("Normal");
        } else if (mode == RenderMode.COMPASS) {
            locationModeBtn.setText("Compass");
        } else if (mode == RenderMode.GPS) {
            locationModeBtn.setText("Gps");
        }
    }

    private void showTrackingListDialog() {
        List<String> trackingTypes = new ArrayList<>();
        trackingTypes.add("None");
        trackingTypes.add("None Compass");
        trackingTypes.add("None GPS");
        trackingTypes.add("Tracking");
        trackingTypes.add("Tracking Compass");
        trackingTypes.add("Tracking GPS");
        trackingTypes.add("Tracking GPS North");
        ArrayAdapter<String> profileAdapter = new ArrayAdapter<>(this,
                android.R.layout.simple_list_item_1, trackingTypes);
        ListPopupWindow listPopup = new ListPopupWindow(this);
        listPopup.setAdapter(profileAdapter);
        listPopup.setAnchorView(locationTrackingBtn);
        listPopup.setOnItemClickListener((parent, itemView, position, id) -> {
            String selectedTrackingType = trackingTypes.get(position);
            locationTrackingBtn.setText(selectedTrackingType);
            if (selectedTrackingType.contentEquals("None")) {
                setCameraTrackingMode(CameraMode.NONE);
            } else if (selectedTrackingType.contentEquals("None Compass")) {
                setCameraTrackingMode(CameraMode.NONE_COMPASS);
            } else if (selectedTrackingType.contentEquals("None GPS")) {
                setCameraTrackingMode(CameraMode.NONE_GPS);
            } else if (selectedTrackingType.contentEquals("Tracking")) {
                setCameraTrackingMode(CameraMode.TRACKING);
            } else if (selectedTrackingType.contentEquals("Tracking Compass")) {
                setCameraTrackingMode(CameraMode.TRACKING_COMPASS);
            } else if (selectedTrackingType.contentEquals("Tracking GPS")) {
                setCameraTrackingMode(CameraMode.TRACKING_GPS);
            } else if (selectedTrackingType.contentEquals("Tracking GPS North")) {
                setCameraTrackingMode(CameraMode.TRACKING_GPS_NORTH);
            }
            listPopup.dismiss();
        });
        listPopup.show();
    }

    private void setCameraTrackingMode(@CameraMode.Mode int mode) {
        locationComponent.setCameraMode(mode, 1200, 16.0, null, 45.0,
                new OnLocationCameraTransitionListener() {
                    @Override
                    public void onLocationCameraTransitionFinished(@CameraMode.Mode int cameraMode) {
                        Toast.makeText(LocationModesActivity.this, "Transition finished", Toast.LENGTH_SHORT).show();
                    }

                    @Override
                    public void onLocationCameraTransitionCanceled(@CameraMode.Mode int cameraMode) {
                        Toast.makeText(LocationModesActivity.this, "Transition canceled", Toast.LENGTH_SHORT).show();
                    }
                });
    }

    @Override
    public void onCameraTrackingDismissed() {
        locationTrackingBtn.setText("None");
    }

    @Override
    public void onCameraTrackingChanged(int currentMode) {
        this.cameraMode = currentMode;
        if (currentMode == CameraMode.NONE) {
            locationTrackingBtn.setText("None");
        } else if (currentMode == CameraMode.NONE_COMPASS) {
            locationTrackingBtn.setText("None Compass");
        } else if (currentMode == CameraMode.NONE_GPS) {
            locationTrackingBtn.setText("None GPS");
        } else if (currentMode == CameraMode.TRACKING) {
            locationTrackingBtn.setText("Tracking");
        } else if (currentMode == CameraMode.TRACKING_COMPASS) {
            locationTrackingBtn.setText("Tracking Compass");
        } else if (currentMode == CameraMode.TRACKING_GPS) {
            locationTrackingBtn.setText("Tracking GPS");
        } else if (currentMode == CameraMode.TRACKING_GPS_NORTH) {
            locationTrackingBtn.setText("Tracking GPS North");
        }
    }
}
```

Summary: The given code is an Android activity that demonstrates various location modes and features using the **NextbillionMap** library. It initializes a map view, handles location **permissions, tracks the current location**, switches between location component **render modes** and **tracking camera** modes and enables or disables the location component.

initMapView:

- The map view is initialized in the **onCreate** method by finding the view with the ID R.id.mapView. This method sets up the map view and initializes other UI elements and variables.

Location Permissions Handling:

- The code checks if location permissions are granted using **PermissionsManager.areLocationPermissionsGranted(this)**. If permissions are granted, the map is asynchronously loaded using **mapView.getMapAsync(this)**. If permissions are not granted, a PermissionsManager is created and used to request location permissions. The result of the permission request is handled in the **onPermissionResult** method.

Tracking Current Location Automatically when MapReady:

- When the map is ready (**onMapReady**), the NextbillionMap instance is obtained. The map's style is set, and the **location component** is activated with various options, including a specialized location layer, default location engine, and location update interval. The location component is enabled and configured with listeners for location clicks and camera tracking changes. The last known location is also updated.

Switch Location component **RenderMode**:

- The render mode can be switched using the **showModeListDialog** method, which displays a dialog with options for Normal, Compass, and GPS render modes. The selected mode is applied to the location component using **setRendererMode()**.

Switch Location Tracking **CameraMode**:

- The camera tracking mode can be switched using the **showTrackingListDialog** method, which displays a dialog with options for different camera tracking modes. The selected mode is applied to the location component using **setCameraTrackingMode()**.

**Enable/Disable** Location Component:

- The location component can be enabled or disabled by clicking on the corresponding menu items in the options menu. The status of the location component is updated accordingly using setLocationComponentEnabled.

The code also includes various **lifecycle** methods for managing the **map view**, saving and restoring the state of the activity, and handling user interactions with the location component, such as clicking and dismissing camera tracking.

Overall, the code demonstrates how to use the NextbillionMap library to implement location-based features in an Android application, including handling permissions, tracking the user's location, and customizing the render and camera tracking modes of the location component.

# MapView CameraPosition Method

This example shows CameraPosition Method on MapView

- CameraPosition Method
  - target

  - zoom

  - bearing

  - tilt

![MapView CameraPosition Method](<https://static.nextbillion.io/docs-next/docs/maps/android/mapview-cameraposition method.webp>)

For all code examples, refer to [Android Maps SDK Code Examples](https://github.com/nextbillion-ai/nb-maps-android-demo)

**activity_camera_position.xml** [view source](https://github.com/nextbillion-ai/nb-maps-android-demo/blob/main/app/src/main/res/layout/activity_camera_position.xml)

```xml
<?xml version="1.0" encoding="utf-8"?>
<androidx.coordinatorlayout.widget.CoordinatorLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:id="@+id/coordinator_layout"
    android:layout_width="match_parent"
    android:layout_height="match_parent">

    <ai.nextbillion.maps.core.MapView
        android:id="@id/mapView"
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        app:nbmap_uiAttributionTintColor="@color/redAccent" />

    <com.google.android.material.floatingactionbutton.FloatingActionButton
        android:id="@+id/fab"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_gravity="end|bottom"
        android:layout_margin="@dimen/fab_margin"
        app:srcCompat="@drawable/ic_input"
        app:backgroundTint="@android:color/white" />

</androidx.coordinatorlayout.widget.CoordinatorLayout>
```

**CameraPositionActivity** [view source](https://github.com/nextbillion-ai/nb-maps-android-demo/blob/main/app/src/main/java/ai/nextbillion/CameraPositionActivity.java)

```java
package ai.nextbillion;

import android.content.Context;
import android.content.DialogInterface;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.SeekBar;
import android.widget.TextView;
import android.widget.Toast;

import com.google.android.material.floatingactionbutton.FloatingActionButton;

import ai.nextbillion.maps.camera.CameraPosition;
import ai.nextbillion.maps.camera.CameraUpdateFactory;
import ai.nextbillion.maps.core.MapView;
import ai.nextbillion.maps.core.NextbillionMap;
import ai.nextbillion.maps.core.OnMapReadyCallback;
import ai.nextbillion.maps.geometry.LatLng;
import androidx.annotation.IdRes;
import androidx.annotation.NonNull;
import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.content.ContextCompat;

import static ai.nextbillion.maps.constants.GeometryConstants.MAX_LATITUDE;
import static ai.nextbillion.maps.constants.GeometryConstants.MIN_LATITUDE;

/**
 * Test activity showcasing how to listen to camera change events.
 */
public class CameraPositionActivity extends AppCompatActivity implements OnMapReadyCallback, View.OnClickListener,
        NextbillionMap.OnMapLongClickListener {

    private MapView mapView;
    private NextbillionMap nextbillionMap;
    private FloatingActionButton fab;
    private boolean logCameraChanges;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_camera_position);
        mapView = findViewById(R.id.mapView);
        mapView.onCreate(savedInstanceState);
        mapView.getMapAsync(this);
    }

    @Override
    public void onMapReady(@NonNull final NextbillionMap map) {
        nextbillionMap = map;
        map.setStyle(StyleConstants.LIGHT, style -> {
            // add a listener to FAB
            fab = findViewById(R.id.fab);
            fab.setColorFilter(ContextCompat.getColor(CameraPositionActivity.this, R.color.palette_mint_100));
            fab.setOnClickListener(this);

            toggleLogCameraChanges();

            // listen to long click events to toggle logging camera changes
            nextbillionMap.addOnMapLongClickListener(this);
        });
    }

    @Override
    public boolean onMapLongClick(@NonNull LatLng point) {
        toggleLogCameraChanges();
        return false;
    }

    @Override
    public void onClick(View view) {
        Context context = view.getContext();
        final View dialogContent = LayoutInflater.from(context).inflate(R.layout.dialog_camera_position, null);
        AlertDialog.Builder builder = new AlertDialog.Builder(context);
        builder.setTitle(R.string.dialog_camera_position);
        builder.setView(onInflateDialogContent(dialogContent));
        builder.setPositiveButton("Animate", new DialogClickListener(nextbillionMap, dialogContent));
        builder.setNegativeButton("Cancel", null);
        builder.setCancelable(false);
        builder.show();
    }

    private void toggleLogCameraChanges() {
        logCameraChanges = !logCameraChanges;
        if (logCameraChanges) {
            nextbillionMap.addOnCameraIdleListener(idleListener);
            nextbillionMap.addOnCameraMoveCancelListener(moveCanceledListener);
            nextbillionMap.addOnCameraMoveListener(moveListener);
            nextbillionMap.addOnCameraMoveStartedListener(moveStartedListener);
        } else {
            nextbillionMap.removeOnCameraIdleListener(idleListener);
            nextbillionMap.removeOnCameraMoveCancelListener(moveCanceledListener);
            nextbillionMap.removeOnCameraMoveListener(moveListener);
            nextbillionMap.removeOnCameraMoveStartedListener(moveStartedListener);
        }
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
    protected void onDestroy() {
        super.onDestroy();
        if (nextbillionMap != null) {
            nextbillionMap.removeOnMapLongClickListener(this);
        }
        mapView.onDestroy();
    }

    @Override
    protected void onSaveInstanceState(Bundle outState) {
        super.onSaveInstanceState(outState);
        mapView.onSaveInstanceState(outState);
    }

    private View onInflateDialogContent(View view) {
        linkTextView(view, R.id.value_lat, R.id.seekbar_lat, new LatLngChangeListener(), 180 + 38);
        linkTextView(view, R.id.value_lon, R.id.seekbar_lon, new LatLngChangeListener(), 180 - 77);
        linkTextView(view, R.id.value_zoom, R.id.seekbar_zoom, new ValueChangeListener(), 6);
        linkTextView(view, R.id.value_bearing, R.id.seekbar_bearing, new ValueChangeListener(), 90);
        linkTextView(view, R.id.value_tilt, R.id.seekbar_tilt, new ValueChangeListener(), 40);
        return view;
    }

    private void linkTextView(
            View view, @IdRes int textViewRes, @IdRes int seekBarRes, ValueChangeListener listener, int defaultValue) {
        final TextView value = (TextView) view.findViewById(textViewRes);
        SeekBar seekBar = (SeekBar) view.findViewById(seekBarRes);
        listener.setLinkedValueView(value);
        seekBar.setOnSeekBarChangeListener(listener);
        seekBar.setProgress(defaultValue);
    }

    private NextbillionMap.OnCameraIdleListener idleListener = new NextbillionMap.OnCameraIdleListener() {
        @Override
        public void onCameraIdle() {
            fab.setColorFilter(ContextCompat.getColor(CameraPositionActivity.this, android.R.color.holo_green_dark));
        }
    };

    private NextbillionMap.OnCameraMoveListener moveListener = new NextbillionMap.OnCameraMoveListener() {
        @Override
        public void onCameraMove() {
            fab.setColorFilter(ContextCompat.getColor(CameraPositionActivity.this, android.R.color.holo_orange_dark));
        }
    };

    private NextbillionMap.OnCameraMoveCanceledListener moveCanceledListener = () -> {};

    private NextbillionMap.OnCameraMoveStartedListener moveStartedListener = new NextbillionMap.OnCameraMoveStartedListener() {

        private final String[] REASONS = {"REASON_API_GESTURE", "REASON_DEVELOPER_ANIMATION", "REASON_API_ANIMATION"};

        @Override
        public void onCameraMoveStarted(int reason) {
            // reason ranges from 1 <-> 3
            fab.setColorFilter(ContextCompat.getColor(CameraPositionActivity.this, android.R.color.holo_red_dark));
        }
    };

    private class ValueChangeListener implements SeekBar.OnSeekBarChangeListener {

        protected TextView textView;

        public void setLinkedValueView(TextView textView) {
            this.textView = textView;
        }

        @Override
        public void onStartTrackingTouch(SeekBar seekBar) {

        }

        @Override
        public void onStopTrackingTouch(SeekBar seekBar) {

        }

        @Override
        public void onProgressChanged(SeekBar seekBar, int progress, boolean fromUser) {
            textView.setText(String.valueOf(progress));
        }
    }

    private class LatLngChangeListener extends ValueChangeListener {

        @Override
        public void onProgressChanged(SeekBar seekBar, int progress, boolean fromUser) {
            super.onProgressChanged(seekBar, progress - 180, fromUser);
        }
    }

    private static class DialogClickListener implements DialogInterface.OnClickListener {

        private NextbillionMap nextbillionMap;
        private View dialogContent;

        public DialogClickListener(NextbillionMap nextbillionMap, View view) {
            this.nextbillionMap = nextbillionMap;
            this.dialogContent = view;
        }

        @Override
        public void onClick(DialogInterface dialog, int which) {
            double latitude = Double.parseDouble(
                    ((TextView) dialogContent.findViewById(R.id.value_lat)).getText().toString());
            double longitude = Double.parseDouble(
                    ((TextView) dialogContent.findViewById(R.id.value_lon)).getText().toString());
            double zoom = Double.parseDouble(
                    ((TextView) dialogContent.findViewById(R.id.value_zoom)).getText().toString());
            double bearing = Double.parseDouble(
                    ((TextView) dialogContent.findViewById(R.id.value_bearing)).getText().toString());
            double tilt = Double.parseDouble(
                    ((TextView) dialogContent.findViewById(R.id.value_tilt)).getText().toString());

            if (latitude < MIN_LATITUDE || latitude > MAX_LATITUDE) {
                Toast.makeText(dialogContent.getContext(), "latitude value must be set "
                                + " between " + MIN_LATITUDE + " and " + MAX_LATITUDE,
                        Toast.LENGTH_SHORT).show();
                return;
            }

            CameraPosition cameraPosition = new CameraPosition.Builder()
                    .target(new LatLng(latitude, longitude))
                    .zoom(zoom)
                    .bearing(bearing)
                    .tilt(tilt)
                    .build();

            nextbillionMap.animateCamera(CameraUpdateFactory.newCameraPosition(cameraPosition), 5000,
                    new NextbillionMap.CancelableCallback() {
                        @Override
                        public void onCancel() {
                        }

                        @Override
                        public void onFinish() {
                        }
                    });
        }
    }
}
```

The code is an activity called CameraPositionActivity that demonstrates how to listen to camera change events in a map view. It uses the Nextbillion Maps SDK for Android.

initMapView:

- The map view is initialized in the **onCreate** method by setting the content view to the layout file **activity_camera_position.xml**. The map view is found using **findViewById** and the **getMapAsync** method is called to set the callback for when the map is ready.

Operations on Camera Position:

- The **onMapReady** method is implemented to receive the NextbillionMap object when it is ready. The map style is set to StyleConstants.SATELLITE_STREETS, and a listener is added to a floating action button (FAB).

- The **toggleLogCameraChanges** method is used to toggle the logging of camera changes. When logging is enabled, listeners for camera events are added to the map. When logging is disabled, the listeners are removed.

- The **onMapLongClick** method is implemented to toggle the logging of camera changes when a long click event occurs on the map.

- The **onClick** method is implemented to show a dialog when the FAB is clicked. The dialog allows the user to set the camera position parameters **(latitude, longitude, zoom, bearing, and tilt)** and animates the camera to the new position when the "Animate" button is clicked.

- The **LatLngChangeListener** class extends **ValueChangeListener** and adjusts the latitude value by subtracting 180, as the seek bar range is from 0 to 360 but latitude ranges from -90 to 90.

- The **DialogClickListener** class is an implementation of **DialogInterface.OnClickListener** that retrieves the camera position parameters from the dialog content and animates the camera to the new position using **nextbillionMap.animateCamera**.

Additionally, the code includes lifecycle methods **(onStart, onResume, onPause, onStop, onDestroy, onSaveInstanceState)** to manage the state of the map view and release resources properly.

The activity demonstrates how to initialize a map view, handle camera change events, and interact with the camera position using a dialog.

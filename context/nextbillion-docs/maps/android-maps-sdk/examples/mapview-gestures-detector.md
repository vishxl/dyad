# MapView Gestures detector

This example shows Gestures detectors on MapView

- Gestures detectors on MapView

- Enable/Disable Gesture detector on Mapview

![MapView Gestures detector](https://static.nextbillion.io/docs-next/docs/maps/android/mapview-gestures-detector.webp)

For all code examples, refer to [Android Maps SDK Code Examples](https://github.com/nextbillion-ai/nb-maps-android-demo)

**activity_gesture_detector.xml** [view source](https://github.com/nextbillion-ai/nb-maps-android-demo/blob/main/app/src/main/res/layout/activity_gesture_detector.xml)

```xml
<?xml version="1.0" encoding="utf-8"?>
<RelativeLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="match_parent">

    <ai.nextbillion.maps.core.MapView
        android:id="@id/mapView"
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        app:nbmap_localIdeographEnabled="false"
        app:nbmap_cameraTargetLat="51.50325"
        app:nbmap_cameraTargetLng="-0.11968"
        app:nbmap_cameraZoom="15" />

    <androidx.recyclerview.widget.RecyclerView
        android:id="@+id/alerts_recycler"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_alignParentLeft="true"
        android:layout_alignParentStart="true"
        android:layout_alignParentTop="true"
        android:background="#97cdcfd3" />

</RelativeLayout>
```

**GestureDetectorActivity** [view source](https://github.com/nextbillion-ai/nb-maps-android-demo/blob/main/app/src/main/java/ai/nextbillion/GestureDetectorActivity.java)

```java
package ai.nextbillion;

import android.graphics.Typeface;
import android.os.Bundle;
import android.os.Handler;
import android.view.LayoutInflater;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewGroup;
import android.widget.RelativeLayout;
import android.widget.TextView;

import java.lang.annotation.Retention;
import java.util.ArrayList;
import java.util.List;

import ai.nextbillion.gestures.AndroidGesturesManager;
import ai.nextbillion.gestures.MoveGestureDetector;
import ai.nextbillion.gestures.RotateGestureDetector;
import ai.nextbillion.gestures.ShoveGestureDetector;
import ai.nextbillion.gestures.StandardScaleGestureDetector;
import ai.nextbillion.maps.annotations.Marker;
import ai.nextbillion.maps.annotations.MarkerOptions;
import ai.nextbillion.maps.camera.CameraPosition;
import ai.nextbillion.maps.camera.CameraUpdateFactory;
import ai.nextbillion.maps.core.MapView;
import ai.nextbillion.maps.core.NextbillionMap;
import ai.nextbillion.maps.core.UiSettings;
import ai.nextbillion.maps.geometry.LatLng;
import ai.nextbillion.utils.FontCache;
import ai.nextbillion.utils.ResourceUtils;
import androidx.annotation.ColorInt;
import androidx.annotation.IntDef;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.content.ContextCompat;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import static java.lang.annotation.RetentionPolicy.SOURCE;

/**
 * Test activity showcasing APIs around gestures implementation.
 */
public class GestureDetectorActivity extends AppCompatActivity {

    private static final int MAX_NUMBER_OF_ALERTS = 30;

    private MapView mapView;
    private NextbillionMap nextbillionMap;
    private RecyclerView recyclerView;
    private GestureAlertsAdapter gestureAlertsAdapter;

    private AndroidGesturesManager gesturesManager;

    @Nullable
    private Marker marker;
    @Nullable
    private LatLng focalPointLatLng;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_gesture_detector);

        mapView = findViewById(R.id.mapView);
        mapView.onCreate(savedInstanceState);
        mapView.getMapAsync(nextbillionMap -> {
            GestureDetectorActivity.this.nextbillionMap = nextbillionMap;
            nextbillionMap.setStyle(StyleConstants.NBMAP_STREETS);
            CameraPosition cameraPosition = new CameraPosition.Builder()
                    .target(new LatLng(22.70418008712976, 78.66264025041812))
                    .zoom(6)
                    .tilt(30)
                    .tilt(0)
                    .build();
            nextbillionMap.moveCamera(CameraUpdateFactory.newCameraPosition(cameraPosition));
            initializeMap();
        });

        recyclerView = findViewById(R.id.alerts_recycler);
        recyclerView.setLayoutManager(new LinearLayoutManager(this));

        gestureAlertsAdapter = new GestureAlertsAdapter();
        recyclerView.setAdapter(gestureAlertsAdapter);
    }

    @Override
    protected void onResume() {
        super.onResume();
        mapView.onResume();
    }

    @Override
    protected void onPause() {
        super.onPause();
        gestureAlertsAdapter.cancelUpdates();
        mapView.onPause();
    }

    @Override
    protected void onStart() {
        super.onStart();
        mapView.onStart();
    }

    @Override
    protected void onStop() {
        super.onStop();
        mapView.onStop();
    }

    @Override
    public void onLowMemory() {
        super.onLowMemory();
        mapView.onLowMemory();
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        mapView.onDestroy();
    }

    @Override
    protected void onSaveInstanceState(Bundle outState) {
        super.onSaveInstanceState(outState);
        mapView.onSaveInstanceState(outState);
    }

    private void initializeMap() {
        gesturesManager = nextbillionMap.getGesturesManager();

        RelativeLayout.LayoutParams layoutParams = (RelativeLayout.LayoutParams) recyclerView.getLayoutParams();
        layoutParams.height = (int) (mapView.getHeight() / 1.75);
        layoutParams.width = (mapView.getWidth() / 3);
        recyclerView.setLayoutParams(layoutParams);

        attachListeners();

        fixedFocalPointEnabled(nextbillionMap.getUiSettings().getFocalPoint() != null);
    }

    public void attachListeners() {
        nextbillionMap.addOnMoveListener(new NextbillionMap.OnMoveListener() {
            @Override
            public void onMoveBegin(@NonNull MoveGestureDetector detector) {
                gestureAlertsAdapter.addAlert(new GestureAlert(GestureAlert.TYPE_START, "MOVE START"));
            }

            @Override
            public void onMove(@NonNull MoveGestureDetector detector) {
                gestureAlertsAdapter.addAlert(new GestureAlert(GestureAlert.TYPE_PROGRESS, "MOVE PROGRESS"));
            }

            @Override
            public void onMoveEnd(@NonNull MoveGestureDetector detector) {
                gestureAlertsAdapter.addAlert(new GestureAlert(GestureAlert.TYPE_END, "MOVE END"));
                recalculateFocalPoint();
            }
        });

        nextbillionMap.addOnRotateListener(new NextbillionMap.OnRotateListener() {
            @Override
            public void onRotateBegin(@NonNull RotateGestureDetector detector) {
                gestureAlertsAdapter.addAlert(new GestureAlert(GestureAlert.TYPE_START, "ROTATE START"));
            }

            @Override
            public void onRotate(@NonNull RotateGestureDetector detector) {
                gestureAlertsAdapter.addAlert(new GestureAlert(GestureAlert.TYPE_PROGRESS, "ROTATE PROGRESS"));
                recalculateFocalPoint();
            }

            @Override
            public void onRotateEnd(@NonNull RotateGestureDetector detector) {
                gestureAlertsAdapter.addAlert(new GestureAlert(GestureAlert.TYPE_END, "ROTATE END"));
            }
        });

        nextbillionMap.addOnScaleListener(new NextbillionMap.OnScaleListener() {
            @Override
            public void onScaleBegin(@NonNull StandardScaleGestureDetector detector) {
                gestureAlertsAdapter.addAlert(new GestureAlert(GestureAlert.TYPE_START, "SCALE START"));
                if (focalPointLatLng != null) {
                    gestureAlertsAdapter.addAlert(new GestureAlert(GestureAlert.TYPE_OTHER, "INCREASING MOVE THRESHOLD"));
                    gesturesManager.getMoveGestureDetector().setMoveThreshold(
                            ResourceUtils.convertDpToPx(GestureDetectorActivity.this, 175));

                    gestureAlertsAdapter.addAlert(new GestureAlert(GestureAlert.TYPE_OTHER, "MANUALLY INTERRUPTING MOVE"));
                    gesturesManager.getMoveGestureDetector().interrupt();
                }
                recalculateFocalPoint();
            }

            @Override
            public void onScale(@NonNull StandardScaleGestureDetector detector) {
                gestureAlertsAdapter.addAlert(new GestureAlert(GestureAlert.TYPE_PROGRESS, "SCALE PROGRESS"));
            }

            @Override
            public void onScaleEnd(@NonNull StandardScaleGestureDetector detector) {
                gestureAlertsAdapter.addAlert(new GestureAlert(GestureAlert.TYPE_END, "SCALE END"));

                if (focalPointLatLng != null) {
                    gestureAlertsAdapter.addAlert(new GestureAlert(GestureAlert.TYPE_OTHER, "REVERTING MOVE THRESHOLD"));
                    gesturesManager.getMoveGestureDetector().setMoveThreshold(0f);
                }
            }
        });

        nextbillionMap.addOnShoveListener(new NextbillionMap.OnShoveListener() {
            @Override
            public void onShoveBegin(@NonNull ShoveGestureDetector detector) {
                gestureAlertsAdapter.addAlert(new GestureAlert(GestureAlert.TYPE_START, "SHOVE START"));
            }

            @Override
            public void onShove(@NonNull ShoveGestureDetector detector) {
                gestureAlertsAdapter.addAlert(new GestureAlert(GestureAlert.TYPE_PROGRESS, "SHOVE PROGRESS"));
            }

            @Override
            public void onShoveEnd(@NonNull ShoveGestureDetector detector) {
                gestureAlertsAdapter.addAlert(new GestureAlert(GestureAlert.TYPE_END, "SHOVE END"));
            }
        });
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.menu_gestures, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        UiSettings uiSettings = nextbillionMap.getUiSettings();
        switch (item.getItemId()) {
            case R.id.menu_gesture_focus_point:
                fixedFocalPointEnabled(focalPointLatLng == null);
                return true;
            case R.id.menu_gesture_animation:
                uiSettings.setScaleVelocityAnimationEnabled(!uiSettings.isScaleVelocityAnimationEnabled());
                uiSettings.setRotateVelocityAnimationEnabled(!uiSettings.isRotateVelocityAnimationEnabled());
                uiSettings.setFlingVelocityAnimationEnabled(!uiSettings.isFlingVelocityAnimationEnabled());
                return true;
            case R.id.menu_gesture_rotate:
                uiSettings.setRotateGesturesEnabled(!uiSettings.isRotateGesturesEnabled());
                return true;
            case R.id.menu_gesture_tilt:
                uiSettings.setTiltGesturesEnabled(!uiSettings.isTiltGesturesEnabled());
                return true;
            case R.id.menu_gesture_zoom:
                uiSettings.setZoomGesturesEnabled(!uiSettings.isZoomGesturesEnabled());
                return true;
            case R.id.menu_gesture_scroll:
                uiSettings.setScrollGesturesEnabled(!uiSettings.isScrollGesturesEnabled());
                return true;
            case R.id.menu_gesture_double_tap:
                uiSettings.setDoubleTapGesturesEnabled(!uiSettings.isDoubleTapGesturesEnabled());
                return true;
            case R.id.menu_gesture_quick_zoom:
                uiSettings.setQuickZoomGesturesEnabled(!uiSettings.isQuickZoomGesturesEnabled());
                return true;
            case R.id.menu_gesture_scroll_horizontal:
                uiSettings.setHorizontalScrollGesturesEnabled(!uiSettings.isHorizontalScrollGesturesEnabled());
                return true;
        }
        return super.onOptionsItemSelected(item);
    }

    private void fixedFocalPointEnabled(boolean enabled) {
        if (enabled) {
            focalPointLatLng = new LatLng(51.50325, -0.12968);
            marker = nextbillionMap.addMarker(new MarkerOptions().position(focalPointLatLng));
            nextbillionMap.easeCamera(CameraUpdateFactory.newLatLngZoom(focalPointLatLng, 16),
                    new NextbillionMap.CancelableCallback() {
                        @Override
                        public void onCancel() {
                            recalculateFocalPoint();
                        }

                        @Override
                        public void onFinish() {
                            recalculateFocalPoint();
                        }
                    });
        } else {
            if (marker != null) {
                nextbillionMap.removeMarker(marker);
                marker = null;
            }
            focalPointLatLng = null;
            nextbillionMap.getUiSettings().setFocalPoint(null);
        }
    }

    private void recalculateFocalPoint() {
        if (focalPointLatLng != null) {
            nextbillionMap.getUiSettings().setFocalPoint(
                    nextbillionMap.getProjection().toScreenLocation(focalPointLatLng)
            );
        }
    }

    private static class GestureAlertsAdapter extends RecyclerView.Adapter<GestureAlertsAdapter.ViewHolder> {

        private boolean isUpdating;
        private final Handler updateHandler = new Handler();
        private final List<GestureAlert> alerts = new ArrayList<>();

        public static class ViewHolder extends RecyclerView.ViewHolder {

            TextView alertMessageTv;

            @ColorInt
            public int textColor;

            ViewHolder(View view) {
                super(view);
                Typeface typeface = FontCache.get("Roboto-Regular.ttf", view.getContext());
                alertMessageTv = view.findViewById(R.id.alert_message);
                alertMessageTv.setTypeface(typeface);
            }
        }

        @NonNull
        @Override
        public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
            View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_gesture_alert, parent, false);
            return new ViewHolder(view);
        }

        @Override
        public void onBindViewHolder(@NonNull ViewHolder holder, int position) {
            GestureAlert alert = alerts.get(position);
            holder.alertMessageTv.setText(alert.getMessage());
            holder.alertMessageTv.setTextColor(
                    ContextCompat.getColor(holder.alertMessageTv.getContext(), alert.getColor()));
        }

        @Override
        public int getItemCount() {
            return alerts.size();
        }

        void addAlert(GestureAlert alert) {
            for (GestureAlert gestureAlert : alerts) {
                if (gestureAlert.getAlertType() != GestureAlert.TYPE_PROGRESS) {
                    break;
                }

                if (alert.getAlertType() == GestureAlert.TYPE_PROGRESS && gestureAlert.equals(alert)) {
                    return;
                }
            }

            if (getItemCount() >= MAX_NUMBER_OF_ALERTS) {
                alerts.remove(getItemCount() - 1);
            }

            alerts.add(0, alert);
            if (!isUpdating) {
                isUpdating = true;
                updateHandler.postDelayed(updateRunnable, 250);
            }
        }

        private Runnable updateRunnable = new Runnable() {
            @Override
            public void run() {
                notifyDataSetChanged();
                isUpdating = false;
            }
        };

        void cancelUpdates() {
            updateHandler.removeCallbacksAndMessages(null);
        }
    }

    private static class GestureAlert {
        @Retention(SOURCE)
        @IntDef( {TYPE_NONE, TYPE_START, TYPE_PROGRESS, TYPE_END, TYPE_OTHER})
        @interface Type {
        }

        static final int TYPE_NONE = 0;
        static final int TYPE_START = 1;
        static final int TYPE_END = 2;
        static final int TYPE_PROGRESS = 3;
        static final int TYPE_OTHER = 4;

        @Type
        private int alertType;

        private String message;

        @ColorInt
        private int color;

        GestureAlert(@Type int alertType, String message) {
            this.alertType = alertType;
            this.message = message;

            switch (alertType) {
                case TYPE_NONE:
                    color = android.R.color.black;
                    break;
                case TYPE_END:
                    color = android.R.color.holo_red_dark;
                    break;
                case TYPE_OTHER:
                    color = android.R.color.holo_purple;
                    break;
                case TYPE_PROGRESS:
                    color = android.R.color.holo_orange_dark;
                    break;
                case TYPE_START:
                    color = android.R.color.holo_green_dark;
                    break;
            }
        }

        int getAlertType() {
            return alertType;
        }

        String getMessage() {
            return message;
        }

        int getColor() {
            return color;
        }

        @Override
        public boolean equals(Object o) {
            if (this == o) {
                return true;
            }
            if (o == null || getClass() != o.getClass()) {
                return false;
            }

            GestureAlert that = (GestureAlert) o;

            if (alertType != that.alertType) {
                return false;
            }
            return message != null ? message.equals(that.message) : that.message == null;
        }

        @Override
        public int hashCode() {
            int result = alertType;
            result = 31 * result + (message != null ? message.hashCode() : 0);
            return result;
        }
    }
}
```

The code provided is an Android activity called **GestureDetectorActivity**. It showcases various APIs related to gesture implementation. Here is a summary of the code:

Initialization of **MapView**:

- The MapView is instantiated and initialized in the **onCreate()** method using **findViewById()**.

- The map is asynchronously loaded using **getMapAsync()**, and the initialization of the map is done in the callback.

- The map style is set to "NBMAP_STREETS" using the **setStyle()** method.

- The camera position is set to a specific location with a target LatLng, zoom level and tilt using the **CameraPosition.Builder** and **moveCamera()** methods.

Gesture Detectors on MapView:

- **setOnTouchListener(View.OnTouchListener listener)**: Sets an OnTouchListener to receive touch events for the map view.

- **setOnMapClickListener(MapView.OnMapClickListener listener)**: Sets a listener to be invoked when the map is clicked.

- **setOnMapLongClickListener(MapView.OnMapLongClickListener listener)**: Sets a listener to be invoked when the map is long-clicked.

- **setOnMapDoubleClickListener(MapView.OnMapDoubleClickListener listener)**: Sets a listener to be invoked when the map is double-clicked.

- **setOnMapScaleListener(MapView.OnMapScaleListener listener)**: Sets a listener to be invoked when the map scale changes.

- **setOnMapScrollListener(MapView.OnMapScrollListener listener)**: Sets a listener to be invoked when the map is scrolled.

- **setOnMapFlingListener(MapView.OnMapFlingListener listener)**: Sets a listener to be invoked when the map is flung.

- **setOnMapRotateListener(MapView.OnMapRotateListener listener)**: Sets a listener to be invoked when the map is rotated.

- **setOnMapTranslateListener(MapView.OnMapTranslateListener listener)**: Sets a listener to be invoked when the map is translated.

- **setOnMapPinchListener(MapView.OnMapPinchListener listener)**: Sets a listener to be invoked when the map is pinched.

- **setOnMapSingleFingerTapListener(MapView.OnMapSingleFingerTapListener listener)**: Sets a listener to be invoked when the map is single-finger tapped.

- **setOnMapTwoFingerTapListener(MapView.OnMapTwoFingerTapListener listener)**: Sets a listener to be invoked when the map is two-finger tapped.

Enable/Disable Gesture Detectors on MapView:

- **setRotateGesturesEnabled(boolean enabled)**: Enables or disables rotate gestures on the map.

- **isRotateGesturesEnabled()**: Returns whether rotate gestures are enabled or not.

- **setTiltGesturesEnabled(boolean enabled)**: Enables or disables tilt gestures on the map.

- **isTiltGesturesEnabled()**: Returns whether tilt gestures are enabled or not.

- **setZoomGesturesEnabled(boolean enabled)**: Enables or disables zoom gestures on the map.

- **isZoomGesturesEnabled()**: Returns whether zoom gestures are enabled or not.

- **setScrollGesturesEnabled(boolean enabled)**: Enables or disables scroll gestures on the map.

- **isScrollGesturesEnabled()**: Returns whether scroll gestures are enabled or not.

- **setDoubleTapGesturesEnabled(boolean enabled)**: Enables or disables double-tap gestures on the map.

- **isDoubleTapGesturesEnabled()**: Returns whether double tap gestures are enabled or not.

- **setQuickZoomGesturesEnabled(boolean enabled)**: Enables or disables quick zoom gestures on the map.

- **isQuickZoomGesturesEnabled()**: Returns whether quick zoom gestures are enabled or not.

- **setHorizontalScrollGesturesEnabled(boolean enabled)**: Enables or disables horizontal scroll gestures on the map.

- **isHorizontalScrollGesturesEnabled()**: Returns whether horizontal scroll gestures are enabled or not.

- **setFlingVelocityAnimationEnabled(boolean enabled)**: Enables or disables fling velocity animation.

- **isFlingVelocityAnimationEnabled()**: Returns whether fling velocity animation is enabled or not.

- **setScaleVelocityAnimationEnabled(boolean enabled)**: Enables or disables scale velocity animation.

- **isScaleVelocityAnimationEnabled()**: Returns whether scale velocity animation is enabled or not.

- **setRotateVelocityAnimationEnabled(boolean enabled)**: Enables or disables rotate velocity animation.

- **isRotateVelocityAnimationEnabled()**: Returns, whether rotate velocity animation, is enabled or not.

- **setFocalPoint(PointF point)**: Sets the focal point on the map for gestures.

- **getFocalPoint()**: Returns the current focal point on the map for gestures.

Overall, the code demonstrates how to implement and manage gesture detectors on a MapView in an Android application.

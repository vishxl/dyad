# Animate Symbol Layer

This example shows how to Animate Symbol Layers

- Add Custom Symbol Layers with Properties
- Animate Symbol layers using Value Animator
- Update Symbol layer source

![Animate Symbol Layer](https://static.nextbillion.io/docs-next/docs/maps/android/animate-symbol-layer.webp)

For all code examples, refer to [Android Maps SDK Code Examples](https://github.com/nextbillion-ai/nb-maps-android-demo)

**activity_animate_markers.xml** [view source](https://github.com/nextbillion-ai/nb-maps-android-demo/blob/main/app/src/main/res/layout/activity_animate_markers.xml)

```xml
<?xml version="1.0" encoding="utf-8"?>
<androidx.constraintlayout.widget.ConstraintLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    tools:context=".MainActivity">

    <ai.nextbillion.maps.core.MapView
        android:id="@+id/map_view"
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        app:nbmap_uiAttribution="false"
        app:nbmap_cameraTargetLat="53.550813508267716"
        app:nbmap_cameraTargetLng="9.992248999933745"
        app:nbmap_cameraZoom="15" />

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

</androidx.constraintlayout.widget.ConstraintLayout>
```

**AnimateSymbolActivity** [view source](https://github.com/nextbillion-ai/nb-maps-android-demo/blob/main/app/src/main/java/ai/nextbillion/AnimateSymbolsActivity.java)

```java
package ai.nextbillion;

import android.animation.Animator;
import android.animation.AnimatorListenerAdapter;
import android.animation.TypeEvaluator;
import android.animation.ValueAnimator;
import android.graphics.drawable.BitmapDrawable;
import android.os.Bundle;
import android.view.animation.LinearInterpolator;
import android.widget.ImageView;

import com.google.gson.JsonObject;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

import ai.nextbillion.kits.geojson.Feature;
import ai.nextbillion.kits.geojson.FeatureCollection;
import ai.nextbillion.kits.geojson.Point;
import ai.nextbillion.kits.turf.TurfMeasurement;
import ai.nextbillion.maps.core.MapView;
import ai.nextbillion.maps.core.NextbillionMap;
import ai.nextbillion.maps.core.OnMapReadyCallback;
import ai.nextbillion.maps.core.Style;
import ai.nextbillion.maps.geometry.LatLng;
import ai.nextbillion.maps.geometry.LatLngBounds;
import ai.nextbillion.maps.style.layers.SymbolLayer;
import ai.nextbillion.maps.style.sources.GeoJsonSource;
import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;

import static ai.nextbillion.maps.style.expressions.Expression.get;
import static ai.nextbillion.maps.style.layers.PropertyFactory.iconAllowOverlap;
import static ai.nextbillion.maps.style.layers.PropertyFactory.iconIgnorePlacement;
import static ai.nextbillion.maps.style.layers.PropertyFactory.iconImage;
import static ai.nextbillion.maps.style.layers.PropertyFactory.iconRotate;

public class AnimateSymbolActivity extends AppCompatActivity implements OnMapReadyCallback {
    private static final String TAXI = "taxi";
    private static final String TAXI_LAYER = "taxi-layer";
    private static final String TAXI_SOURCE = "taxi-source";
    private static final String PROPERTY_BEARING = "bearing";
    private static final int DURATION_RANDOM_MAX = 1500;
    private static final int DURATION_BASE = 3000;
    private final Random random = new Random();

    private MapView mapView;
    private NextbillionMap nextbillionMap;
    private Style style;
    private List<Taxi> taxis = new ArrayList<>();
    private GeoJsonSource taxiSource;
    private List<Animator> animators = new ArrayList<>();
    private ImageView ivBack;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_animate_markers);
        ivBack = findViewById(R.id.iv_back);
        mapView = findViewById(R.id.map_view);
        mapView.onCreate(savedInstanceState);
        mapView.getMapAsync(this);
        ivBack.setOnClickListener(v -> finish());
    }

    @Override
    public void onMapReady(@NonNull NextbillionMap nextbillionMap) {
        this.nextbillionMap = nextbillionMap;
        nextbillionMap.getStyle(new Style.OnStyleLoaded() {
            @Override
            public void onStyleLoaded(@NonNull Style style) {
                AnimateSymbolActivity.this.style = style;
                generateTaxis();
                animateTaxis();
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
        for (Animator animator : animators) {
            if (animator != null) {
                animator.removeAllListeners();
                animator.cancel();
            }
        }
        mapView.onDestroy();
    }

    @Override
    public void onLowMemory() {
        super.onLowMemory();
        mapView.onLowMemory();
    }

    ///////////////////////////////////////////////////////////////////////////
    //
    ///////////////////////////////////////////////////////////////////////////

    private void generateTaxis(){
        style.addImage(TAXI,
                ((BitmapDrawable) getResources().getDrawable(R.mipmap.beat_taxi)).getBitmap());

        for (int i = 0; i < 10; i++) {
            LatLng latLng = getRandomLatLng();
            LatLng destination = getRandomLatLng();
            JsonObject properties = new JsonObject();

            properties.addProperty(PROPERTY_BEARING, Taxi.getBearing(latLng, destination));
            Feature feature = Feature.fromGeometry(
                    Point.fromLngLat(
                            latLng.getLongitude(),
                            latLng.getLatitude()), properties);

            Taxi taxi = new Taxi(feature, destination, getDuration());
            taxis.add(taxi);
        }

        taxiSource = new GeoJsonSource(TAXI_SOURCE, taxiMarkerFeatures());
        style.addSource(taxiSource);

        SymbolLayer symbolLayer = new SymbolLayer(TAXI_LAYER, TAXI_SOURCE);
        style.addLayer(symbolLayer);
        symbolLayer.withProperties(
                iconImage(TAXI),
                iconAllowOverlap(true),
                iconRotate(get(PROPERTY_BEARING)),
                iconIgnorePlacement(true)
        );
    }

    private FeatureCollection taxiMarkerFeatures() {
        List<Feature> features = new ArrayList<>();
        for (Taxi taxi : taxis) {
            features.add(taxi.feature);
        }
        return FeatureCollection.fromFeatures(features);
    }

    private void animateTaxis(){
        final Taxi longestDrive = getLongestDrive();
        final Random random = new Random();
        for (final Taxi taxi : taxis) {
            final boolean isLongestDrive = longestDrive.equals(taxi);
            ValueAnimator valueAnimator = ValueAnimator.ofObject(new LatLngEvaluator(), taxi.current, taxi.next);
            valueAnimator.addUpdateListener(new ValueAnimator.AnimatorUpdateListener() {
                private LatLng latLng;

                @Override
                public void onAnimationUpdate(ValueAnimator animation) {
                    latLng = (LatLng) animation.getAnimatedValue();
                    taxi.current = latLng;
                    if (isLongestDrive) {
                        updateTaxisSource();;
                    }
                }
            });

            if (isLongestDrive) {
                valueAnimator.addListener(new AnimatorListenerAdapter() {
                    @Override
                    public void onAnimationEnd(Animator animation) {
                        super.onAnimationEnd(animation);
                        updateDestinations();
                        animateTaxis();
                    }
                });
            }

            valueAnimator.addListener(new AnimatorListenerAdapter() {
                @Override
                public void onAnimationStart(Animator animation) {
                    super.onAnimationStart(animation);
                    taxi.feature.properties().addProperty("bearing", Taxi.getBearing(taxi.current, taxi.next));
                }
            });

            int offset = random.nextInt(2) == 0 ? 0 : random.nextInt(1000) + 250;
            valueAnimator.setStartDelay(offset);
            valueAnimator.setDuration(taxi.duration - offset);
            valueAnimator.setInterpolator(new LinearInterpolator());
            valueAnimator.start();

            animators.add(valueAnimator);
        }
    }

    private void updateTaxisSource() {
        for (Taxi taxi : taxis) {
            taxi.updateFeature();
        }
        taxiSource.setGeoJson(taxiMarkerFeatures());
    }

    private void updateDestinations(){
        for (Taxi taxi : taxis) {
            taxi.setNext(getRandomLatLng());
        }
    }

    ///////////////////////////////////////////////////////////////////////////
    //
    ///////////////////////////////////////////////////////////////////////////

    private LatLng getRandomLatLng() {
        LatLngBounds bounds = nextbillionMap.getProjection().getVisibleRegion().latLngBounds;
        Random generator = new Random();
        double randomLat = bounds.getLatSouth() + generator.nextDouble()
                * (bounds.getLatNorth() - bounds.getLatSouth());
        double randomLon = bounds.getLonWest() + generator.nextDouble()
                * (bounds.getLonEast() - bounds.getLonWest());
        return new LatLng(randomLat, randomLon);
    }

    private long getDuration() {
        return random.nextInt(DURATION_RANDOM_MAX) + DURATION_BASE;
    }

    private Taxi getLongestDrive() {
        Taxi longestDrive = null;
        for (Taxi taxi : taxis) {
            if (longestDrive == null) {
                longestDrive = taxi;
            } else if (longestDrive.duration < taxi.duration) {
                longestDrive = taxi;
            }
        }
        return longestDrive;
    }

    ///////////////////////////////////////////////////////////////////////////
    //
    ///////////////////////////////////////////////////////////////////////////

    private static class Taxi {
        private Feature feature;
        private LatLng next;
        private LatLng current;
        private long duration;

        Taxi(Feature feature, LatLng next, long duration) {
            this.feature = feature;
            Point point = ((Point) feature.geometry());
            this.current = new LatLng(point.latitude(), point.longitude());
            this.duration = duration;
            this.next = next;
        }

        void setNext(LatLng next) {
            this.next = next;
        }

        void updateFeature() {
            feature = Feature.fromGeometry(Point.fromLngLat(
                    current.getLongitude(),
                    current.getLatitude())
            );
            feature.properties().addProperty("bearing", getBearing(current, next));
        }

        private static float getBearing(LatLng from, LatLng to) {
            return (float) TurfMeasurement.bearing(
                    Point.fromLngLat(from.getLongitude(), from.getLatitude()),
                    Point.fromLngLat(to.getLongitude(), to.getLatitude())
            );
        }
    }

    private static class LatLngEvaluator implements TypeEvaluator<LatLng> {

        private LatLng latLng = new LatLng();

        @Override
        public LatLng evaluate(float fraction, LatLng startValue, LatLng endValue) {
            latLng.setLatitude(startValue.getLatitude()
                    + ((endValue.getLatitude() - startValue.getLatitude()) * fraction));
            latLng.setLongitude(startValue.getLongitude()
                    + ((endValue.getLongitude() - startValue.getLongitude()) * fraction));
            return latLng;
        }
    }

}
```

The example code is an Android activity that demonstrates how to animate **symbol markers** on a map using the **Nextbillion Maps** SDK. Here's a summary of the code:

Initializing MapView:

- The MapView is initialized in the onCreate method using the mapView.onCreate(savedInstanceState) method.

Adding Symbol Layer Source:

- The **generateTaxis** method adds a **symbol layer source** to the map.
- It defines a custom **image** called **"taxi"** using a bitmap resource.
- It creates a **GeoJsonSource** object named **"taxi-source"** and adds it to the map's style.
- A SymbolLayer named **"taxi-layer"** is also created and added to the style.
- The SymbolLayer properties are set to display the **"taxi"** icon image and allow overlap.

Animating Symbol Layer:

- The animateTaxis method animates the symbol markers.
- It uses ValueAnimator to animate the markers' positions from their current location to a new location.
- A ValueAnimator listener updates the taxi's current position and calls updateTaxisSource to update the source on the map.
- The longest drive is identified, and when its animation ends, it updates the destinations of all taxis and restarts the animation.
- Each animator is given a random start delay and duration based on the taxi's duration.

Updating Symbol Layer Source:

- The updateTaxisSource method updates the GeoJsonSource on the map with the updated taxi marker features.
- The code uses Nextbillion Maps SDK to work with maps, symbols, and animations in an Android application. It generates random taxi markers on the map, animates their movement, and updates the marker positions dynamically.

Additional notes:

- The code includes lifecycle methods **(onStart, onResume, onPause, onStop, onSaveInstanceState, onDestroy, onLowMemory)** to manage the lifecycle of the MapView.

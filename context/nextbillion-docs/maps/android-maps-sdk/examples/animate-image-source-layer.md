# Animate Image Source Layer

This example shows how to Animate the Runtime Map style layer

- Add Image Source layer
- Update the Image source every second

![Animate Image Source Layer](https://static.nextbillion.io/docs-next/docs/maps/android/animate-image-source-layer.webp)

For all code examples, refer to Android Maps Code Examples

**activity_animated_image_source.xml** [view source](https://github.com/nextbillion-ai/nb-maps-android-demo/blob/main/app/src/main/res/layout/activity_animated_image_source.xml)

```xml
<?xml version="1.0" encoding="utf-8"?>
<RelativeLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:orientation="vertical">

    <ai.nextbillion.maps.core.MapView
        android:id="@id/mapView"
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        app:nbmap_cameraTargetLat="41.9567"
        app:nbmap_cameraTargetLng="-78.6430"
        app:nbmap_cameraZoom="5" />

</RelativeLayout>
```

AnimatedImageSourceActivity view source

```java
package ai.nextbillion;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.drawable.BitmapDrawable;
import android.graphics.drawable.Drawable;
import android.os.Bundle;
import android.os.Handler;

import ai.nextbillion.maps.Nextbillion;
import ai.nextbillion.maps.camera.CameraPosition;
import ai.nextbillion.maps.camera.CameraUpdateFactory;
import ai.nextbillion.maps.core.MapView;
import ai.nextbillion.maps.core.NextbillionMap;
import ai.nextbillion.maps.core.OnMapReadyCallback;
import ai.nextbillion.maps.core.Style;
import ai.nextbillion.maps.geometry.LatLng;
import ai.nextbillion.maps.geometry.LatLngQuad;
import ai.nextbillion.maps.style.layers.RasterLayer;
import ai.nextbillion.maps.style.sources.ImageSource;
import ai.nextbillion.maps.utils.BitmapUtils;
import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;

/**
 * Test activity showing how to use a series of images to create an animation
 * with an ImageSource
 */
public class AnimatedImageSourceActivity extends AppCompatActivity implements OnMapReadyCallback {

    private static final String ID_IMAGE_SOURCE = "animated_image_source";
    private static final String ID_IMAGE_LAYER = "animated_image_layer";

    private MapView mapView;
    private final Handler handler = new Handler();
    private Runnable runnable;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_animated_image_source);
        mapView = findViewById(R.id.mapView);
        mapView.onCreate(savedInstanceState);
        mapView.getMapAsync(this);
    }

    @Override
    public void onMapReady(@NonNull final NextbillionMap map) {
        LatLngQuad quad = new LatLngQuad(
                new LatLng(27.40047198444738, 71.53771145635554),
                new LatLng(27.40047198444738, 90.94171027114842),
                new LatLng(15.333463356222776, 90.94171027114842),
                new LatLng(15.333463356222776, 71.53771145635554)
        );

        CameraPosition position = new CameraPosition.Builder()
                .target(new LatLng(21.333463356222776, 80.53771145635554))
                .zoom(3.5)
                .bearing(0)
                .tilt(0)
                .build();
        map.animateCamera(CameraUpdateFactory.newCameraPosition(position));

        final ImageSource imageSource = new ImageSource(ID_IMAGE_SOURCE, quad, R.mipmap.southeast_radar_0);
        final RasterLayer layer = new RasterLayer(ID_IMAGE_LAYER, ID_IMAGE_SOURCE);
        map.setStyle(new Style.Builder()
                        .fromUri("https://api.nextbillion.io/maps/streets/style.json")
                        .withSource(imageSource)
                        .withLayer(layer), style -> {
                    runnable = new RefreshImageRunnable(imageSource, handler);
                    handler.postDelayed(runnable, 100);
                }
        );
    }

    @Override
    protected void onStart() {
        super.onStart();
        mapView.onStart();
    }

    @Override
    public void onResume() {
        super.onResume();
        mapView.onResume();
    }

    @Override
    public void onPause() {
        super.onPause();
        mapView.onPause();
    }

    @Override
    protected void onStop() {
        super.onStop();
        mapView.onStop();
        handler.removeCallbacks(runnable);
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

    private static class RefreshImageRunnable implements Runnable {

        private ImageSource imageSource;
        private Handler handler;
        private Bitmap[] drawables;
        private int drawableIndex;

        Bitmap getBitmap(int resourceId) {
            Context context = Nextbillion.getApplicationContext();
            Drawable drawable = BitmapUtils.getDrawableFromRes(context, resourceId);
            if (drawable instanceof BitmapDrawable) {
                BitmapDrawable bitmapDrawable = (BitmapDrawable) drawable;
                return bitmapDrawable.getBitmap();
            }
            return null;
        }

        RefreshImageRunnable(ImageSource imageSource, Handler handler) {
            this.imageSource = imageSource;
            this.handler = handler;
            drawables = new Bitmap[4];
            drawables[0] = getBitmap(R.mipmap.southeast_radar_0);
            drawables[1] = getBitmap(R.mipmap.southeast_radar_1);
            drawables[2] = getBitmap(R.mipmap.southeast_radar_2);
            drawables[3] = getBitmap(R.mipmap.southeast_radar_3);
            drawableIndex = 1;
        }

        @Override
        public void run() {
            imageSource.setImage(drawables[drawableIndex++]);
            if (drawableIndex > 3) {
                drawableIndex = 0;
            }
            handler.postDelayed(this, 1000);
        }
    }
}
```

This example demonstrates how to create an animation using a series of images with an ImageSource in the NextbillionMap library. The animation consists of a radar image that changes every second.

Initializing MapView:

- The MapView is initialized in the **onCreate** method by finding the view with the ID mapView from the layout file.
- The onCreate method also calls **mapView.onCreate(savedInstanceState)** to create the **MapView** and **mapView.getMapAsync(this)** to get a reference to the **NextbillionMap** instance when it is ready.

Adding Image Source Layer:

- The **onMapReady** method is called when the NextbillionMap instance is ready.
- A **LatLngQuad** is created to define the corners of a quadrilateral region on the map.
- A **CameraPosition** is defined to set the initial camera position of the map.
- An **ImageSource** is created with an **ID**, the LatLngQuad, and the **resource ID** of the first radar image.
- A **RasterLayer** is created with an ID and the ID of the ImageSource.
- The map style is set using a **Style.Builder** by specifying the style JSON URI, adding the **ImageSource**, and adding the **RasterLayer**.
- A **RefreshImageRunnable** is created to handle the animation by periodically changing the image of the ImageSource.
- The **RefreshImageRunnable** is scheduled to run every 100 milliseconds.

Animating Image Source:

- The **RefreshImageRunnable** class is a custom Runnable implementation.
- It keeps track of the current image index and an array of Bitmaps representing the radar images.
- In the constructor, it initializes the array of Bitmaps with the radar images and sets the initial image index.
- In the run method, it updates the image of the ImageSource with the current Bitmap.
- The image index is incremented, and if it exceeds the number of images, it is reset to 0.
- The RefreshImageRunnable is rescheduled to run after 1 second (1000 milliseconds) using the Handler instance.

Additional notes:

- The code includes lifecycle methods **(onStart, onResume, onPause, onStop, onDestroy, onSaveInstanceState)** to manage the **lifecycle** of the **MapView**.
- The code uses Nextbillion map library classes and methods for map-related operations.
- The code also includes utility methods (getBitmap) to convert resource IDs to Bitmaps for the radar images.

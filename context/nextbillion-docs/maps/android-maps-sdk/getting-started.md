# Getting Started

The Getting Started section of the Android Maps SDK is specifically crafted to facilitate a seamless and efficient onboarding process for developers. It provides a comprehensive guide that outlines the prerequisites, requirements, and necessary steps to start utilizing the SDK effectively. From installation instructions to information on Maven dependencies, this section offers detailed guidance to ensure a smooth integration of the Android Maps SDK into developers' projects.

By following the step-by-step instructions and recommendations provided in this section, developers can swiftly set up the Android Maps SDK and begin constructing captivating maps for their users. Additionally, the section includes a Quickstart guide that offers a concise and practical demonstration of how to create a basic map using the SDK.

## Prerequisites

- **Access Key:** if you don’t have your Access Key yet, don’t hesitate to [contact us](https://nextbillion.ai/contact-us?utm_source=footer&utm_medium=docs&utm_campaign=onpage)
- **IDE (Android Studio):** to build and develop the Android application
- There are no restrictions on IDE version, but we recommend developers to use **Arctic Fox | 2020.3.1 and above**.

## Installation

The guide explains how to install the SDK by adding the necessary dependencies to your project. It provides instructions on adding the maven dependencies of SDK to your app's `build.gradle` file.

### Maven dependencies

In your app-level `build.gradle` file, add the Nextbillion.ai dependency for the Maps SDK for Android.

```gradle
dependencies {
    def version = "3.1.1"
    implementation 'ai.nextbillion:nb-maps-android:$version'
}
```

This line tells Gradle to download Nextbillion Android Maps SDK version 3.1.1 (or the version defined in the version variable) from Maven Central and include it in your app build.

Note: Since the Gradle file has been edited. Android Studio will ask you whether to sync the files or not. Select Yes, and sync the Gradle files for successful installation of Android Maps SDK.

## Initialization

Before we start using any functionalities from both SDK, we need to initialize the Maps SDK first, by initializing it means to pass your Access Key to the singleton method of the class Nextbillion.

A common way to initialize the SDK is to put the following code in an Application’s `onCreate()` callback, otherwise, please make sure you have called the code below before you start using any functionalities of the SDK.

```kotlin
Nextbillion.getInstance(getApplicationContext(), "your access key");
```

### Access Key

The maps SDK doesn’t enforce users to configure the access key in any strict manner, users can maintain and store their key in the below ways:

1. Local file(xml, Sharedpreference, or file)
2. Database
3. Cloud/Backend server
4. More

For instance, if you prefer to configure the access key in an XML file, you can do so like this:

```xml
<string name="nbmap_access_key">your-access-key</string>
```

Once you have your access key configured, you can pass the value to the SDK as follows:

```kotlin
Nextbillion.getInstance(getApplicationContext(), "your access key");
```

This flexibility allows you to adapt the access key configuration to your specific use case and security requirements.

### Base URI

By default, the Maps SDK reads the base URI from nbmap_apiBaseUri, and all MapView instances use this value to request styles and tiles.

```xml
<string name="nbmap_base_uri">http://api.nextbillion.io</string>
```

If we want to override the base Uri for a particular MapView, there are two ways:

- Set `app:nbmap_apiBaseUri` in the layout XML file.

  ```xml
  <ai.nextbillion.maps.core.MapView
  android:id="@+id/mapView"
  android:layout_width="match_parent"
  android:layout_height="match_parent"
  app:nbmap_basrUri="https://api.nextbillion.io" />
  ```

- Set `apiBaseUri` in _NextbillionMapOptions_

  ```kotlin
  NextbillionMapOptions options = NextbillionMapOptions.createFromAttributes(this, null)
  .apiBaseUri("https://api.nextbillion.io");
  mapView = new MapView(this, options);
  ```

## Quickstart Guide

In this guide, we will walk you through the process of displaying a simple map view in an activity. The focus of this example is to provide a basic UI without complicated functions. By following this guide, you will be able to quickly set up and showcase a clean and straightforward map view in your Android application. Let's get started!

For all code examples, refer to Android Maps SDK [Code Examples](https://github.com/nextbillion-ai/nb-maps-android-demo)

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

```kotlin
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
       mapView.getMapAsync(this)
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

### Code summary

The _SimpleMapViewActivity_ class extends the _AppCompatActivity_ class and implements the `OnMapReadyCallback` interface. It can be used to display a map view in an Android app.

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

- The `onCreate()` method initializes the MapView by inflating the layout and calling `mapView.onCreate(...)`. The style should be set in `onMapReady()` using `setStyle(...)`. Note that `mMap.getStyle(...)` reads the current style instead of setting one.
- The `onMapReady()` method is called when the map is ready to be used. In this method, set style and optionally configure camera center/zoom via _CameraUpdateFactory_ + _moveCamera/easeCamera/animateCamera_.
- The other methods in the class implement the lifecycle methods for an activity. These methods are called when the activity starts, pauses, stops, resumes, is destroyed or is low on memory.

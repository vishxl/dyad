# Maps SDK Configuration

The Android Maps SDK allows developers to create maps in their applications using the **NextbillionMapOptions** configuration. This configuration class defines the default values and states for a **MapView**, providing various options for customization. With **NextbillionMapOptions**, developers can easily configure the maps in their applications to meet their specific needs.

## Configurations

The Android Maps SDK offers the following available configurations.

### Camera

The below code snippet is a part of the Camera class in the Android Maps SDK. It defines several variables used to control the camera view of a map. The **cameraPosition** variable stores the current camera position of the map, while the **minZoom** and **maxZoom** variables set the minimum and maximum zoom level allowed. The **minPitch** and **maxPitch** variables set the minimum and maximum pitch angle of the camera. These variables work together to control the camera view of the map and ensure that it stays within the desired range of values. The values are taken from the **NbmapConstants** class, which provides constants that define the minimum and maximum values for various parameters in the map view.

```
  private CameraPosition cameraPosition;
  private double minZoom = NbmapConstants.MINIMUM_ZOOM;
  private double maxZoom = NbmapConstants.MAXIMUM_ZOOM;
  private double minPitch = NbmapConstants.MINIMUM_PITCH;
  private double maxPitch = NbmapConstants.MAXIMUM_PITCH;
```

cameraPosition: The initial coordinate of a MapView will be at (0, 0), we can configure the initial coordinate with this field.
Meanwhile, cameraPosition has defined these configurable values:

```
  public final double bearing;

  /**
   * The location that the camera is pointing at.
   */
  public final LatLng target;

  /**
   * The angle, in degrees, of the camera angle from the nadir (directly facing the Earth).
   */
  public final double tilt;

  /**
   * Zoom level near the center of the screen.
   */
  public final double zoom;

  /**
   * Padding in pixels. Specified in left, top, right, and bottom order.
   */
  public final double[] padding;
```

The other fields are straightforward, and define a range of supported zoom and pitch/tilt of a MapView.

### UI control

```
  private boolean compassEnabled = true;
  private boolean fadeCompassFacingNorth = true;
  private int compassGravity = Gravity.TOP | Gravity.END;
  private int[] compassMargins;
  private Drawable compassImage;

  private boolean logoEnabled = true;
  private int logoGravity = Gravity.BOTTOM | Gravity.START;
  private int[] logoMargins;
  @ColorInt
  private int attributionTintColor = UNDEFINED_COLOR;
  private boolean attributionEnabled = true;
  private int attributionGravity = Gravity.BOTTOM | Gravity.START;
  private int[] attributionMargins;
```

The configuration defines gravity, margins, and toggle-flag for Compass, Logo, and Attribution.

The **"fadeCompassFacingNorth"** flag is set to **"true"**, which means the compass icon on the map view will be hidden when the map view is facing north. When this flag is set to **"true"**, the compass will not be visible on the map when it is rotated to face north.

## Gestures

The code defines the flags for various gestures that are supported by a map view. Each flag determines whether the corresponding gesture is enabled or not.
For example, "rotateGesturesEnabled" is set to **"true"**, which means that the map view will support the gesture of rotating. Similarly, "scrollGesturesEnabled" is set to **"true"**, which means the map view will support the gesture of scrolling.
The other flags (horizontalScrollGesturesEnabled, tiltGesturesEnabled, zoomGesturesEnabled, doubleTapGesturesEnabled, and quickZoomGesturesEnabled) have the same purpose and determine whether their respective gestures are supported in the map view.

```
  private boolean rotateGesturesEnabled = true;
  private boolean scrollGesturesEnabled = true;
  private boolean horizontalScrollGesturesEnabled = true;
  private boolean tiltGesturesEnabled = true;
  private boolean zoomGesturesEnabled = true;
  private boolean doubleTapGesturesEnabled = true;
  private boolean quickZoomGesturesEnabled = true;
```

These are flags to turn on and off for supported gestures.

### Base URI & Map Tiles

```
The code is for a mapping application and defines several variables for the SDK.
  private String apiBaseUri;
  private boolean prefetchesTiles = true;
  private int prefetchZoomDelta = 4;
 @ColorInt
  private int foregroundLoadColor;
```

The **"apiBaseUri"** variable specifies the host for the Maps SDK to connect to. The **"prefetchesTiles"** and **"prefetchZoomDelta"** variables control the behavior of map tile prefetching. Finally, the **"foregroundLoadColor"** variable determines the color of the page before the map tile is loaded.

### Glyphs and Font

```
  private boolean localIdeographFontFamilyEnabled = true;
  private String localIdeographFontFamily;
  private String[] localIdeographFontFamilies;
```

This code snippet declares three variables related to font handling:

- localIdeographFontFamilyEnabled: a boolean variable that determines whether the local ideograph font family is enabled. If set to true, it means that the local ideograph font family is enabled.
- localIdeographFontFamily: a string variable that stores the name of the local ideograph font family.
- localIdeographFontFamilies: an array of strings that holds the names of the local ideograph font families.

## How to configure

### Configure from XML

If we add a MapView from XML layout, we can configure the maps in this way:

```xml
    <ai.nextbillion.maps.core.MapView
        android:id="@id/mapView"
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        app:nbmap_apiBaseUri="https://api.nextbillion.io"
        app:nbmap_cameraTargetLat="12.99150562"
        app:nbmap_cameraTargetLng="77.61940507"
        app:nbmap_cameraZoom="10" />
```

This code defines an XML layout that adds a MapView component. This component is part of the NextBillion maps library and is used to display a map on the screen. The MapView component is specified with the following attributes:

- **android:id**: an ID used to uniquely identify the MapView component in the layout.
- **android:layout_width** and **android:layout_height**: the width and height of the MapView component, respectively. They are set to match_parent which means the component will occupy the entire parent layout.
- **app:nbmap_apiBaseUri**: the base URL used to access the Nextbillion Maps API. The value is set to _<https://api.nextbillion.io>_.
- **app:nbmap_cameraTargetLat** and **app:nbmap_cameraTargetLng**: the latitude and longitude of the target location to be displayed on the map, respectively. The values are set to 12.99150562 and 77.61940507.
- **app:nbmap_cameraZoom**: the zoom level of the camera. The value is set to 10, which means that the map will be zoomed in to a level where objects on the map will appear 10 times larger than at the default zoom level.

This XML layout is used to configure the display of the map, including the URL of the API, the location to be displayed, and the zoom level.

### Available attributes

The Android Maps SDK provides a rich set of attributes that allow developers to customize the appearance and behavior of maps in their applications. These attributes provide fine-grained control over various aspects of maps, such as camera position, zoom level, map style, and markers. With these attributes, developers can create maps that meet the specific needs of their applications and provide a seamless user experience. By using the available attributes, developers can ensure that their maps are visually appealing and provide accurate and up-to-date information.

```xml
   <!--Camera-->
   <attr name="nbmap_cameraTargetLat" format="float" />
   <attr name="nbmap_cameraTargetLng" format="float" />
   <attr name="nbmap_cameraZoom" format="float" />
   <attr name="nbmap_cameraBearing" format="float" />
   <attr name="nbmap_cameraTilt" format="float" />
   <attr name="nbmap_cameraZoomMax" format="float" />
   <attr name="nbmap_cameraZoomMin" format="float" />
   <attr name="nbmap_cameraPitchMax" format="float" />
   <attr name="nbmap_cameraPitchMin" format="float" />

   <!--Gestures-->
   <attr name="nbmap_uiZoomGestures" format="boolean" />
   <attr name="nbmap_uiScrollGestures" format="boolean" />
   <attr name="nbmap_uiHorizontalScrollGestures" format="boolean" />
   <attr name="nbmap_uiRotateGestures" format="boolean" />
   <attr name="nbmap_uiTiltGestures" format="boolean" />
   <attr name="nbmap_uiDoubleTapGestures" format="boolean" />
   <attr name="nbmap_uiQuickZoomGestures" format="boolean" />

   <!--UI control-->
   <!--Compass-->
   <attr name="nbmap_uiCompass" format="boolean" />
   <attr name="nbmap_uiCompassGravity">
       <flag name="top" value="0x30" />
       <flag name="bottom" value="0x50" />
       <flag name="left" value="0x03" />
       <flag name="right" value="0x05" />
       <flag name="center_vertical" value="0x10" />
       <flag name="fill_vertical" value="0x70" />
       <flag name="center_horizontal" value="0x01" />
       <flag name="fill_horizontal" value="0x07" />
       <flag name="center" value="0x11" />
       <flag name="fill" value="0x77" />
       <flag name="clip_vertical" value="0x80" />
       <flag name="clip_horizontal" value="0x08" />
       <flag name="start" value="0x00800003" />
       <flag name="end" value="0x00800005" />
   </attr>
   <attr name="nbmap_uiCompassMarginLeft" format="dimension" />
   <attr name="nbmap_uiCompassMarginTop" format="dimension" />
   <attr name="nbmap_uiCompassMarginRight" format="dimension" />
   <attr name="nbmap_uiCompassMarginBottom" format="dimension" />
   <attr name="nbmap_uiCompassFadeFacingNorth" format="boolean" />
   <attr name="nbmap_uiCompassDrawable" format="reference" />

   <!--Logo-->
   <attr name="nbmap_uiLogo" format="boolean" />
   <attr name="nbmap_uiLogoGravity">
       <flag name="top" value="0x30" />
       <flag name="bottom" value="0x50" />
       <flag name="left" value="0x03" />
       <flag name="right" value="0x05" />
       <flag name="center_vertical" value="0x10" />
       <flag name="fill_vertical" value="0x70" />
       <flag name="center_horizontal" value="0x01" />
       <flag name="fill_horizontal" value="0x07" />
       <flag name="center" value="0x11" />
       <flag name="fill" value="0x77" />
       <flag name="clip_vertical" value="0x80" />
       <flag name="clip_horizontal" value="0x08" />
       <flag name="start" value="0x00800003" />
       <flag name="end" value="0x00800005" />
   </attr>
   <attr name="nbmap_uiLogoMarginLeft" format="dimension" />
   <attr name="nbmap_uiLogoMarginTop" format="dimension" />
   <attr name="nbmap_uiLogoMarginRight" format="dimension" />
   <attr name="nbmap_uiLogoMarginBottom" format="dimension" />

   <!--Attribution-->
   <attr name="nbmap_uiAttribution" format="boolean" />
   <attr name="nbmap_uiAttributionGravity">
       <flag name="top" value="0x30" />
       <flag name="bottom" value="0x50" />
       <flag name="left" value="0x03" />
       <flag name="right" value="0x05" />
       <flag name="center_vertical" value="0x10" />
       <flag name="fill_vertical" value="0x70" />
       <flag name="center_horizontal" value="0x01" />
       <flag name="fill_horizontal" value="0x07" />
       <flag name="center" value="0x11" />
       <flag name="fill" value="0x77" />
       <flag name="clip_vertical" value="0x80" />
       <flag name="clip_horizontal" value="0x08" />
       <flag name="start" value="0x00800003" />
       <flag name="end" value="0x00800005" />
   </attr>
   <attr name="nbmap_uiAttributionMarginLeft" format="dimension" />
   <attr name="nbmap_uiAttributionMarginTop" format="dimension" />
   <attr name="nbmap_uiAttributionMarginRight" format="dimension" />
   <attr name="nbmap_uiAttributionMarginBottom" format="dimension" />
   <attr name="nbmap_uiAttributionTintColor" format="color" />

   <!--Base Uri and Map tile-->
   <attr name="nbmap_baseUri" format="string" />
   <attr name="nbmap_foregroundLoadColor" format="color" />
   <attr name="nbmap_enableTilePrefetch" format="boolean" />
   <attr name="nbmap_prefetchZoomDelta" format="integer" />

   <!--Glyph and Font-->
   <attr name="nbmap_localIdeographEnabled" format="boolean" />
   <attr name="nbmap_localIdeographFontFamily" format="string" />
   <attr name="nbmap_localIdeographFontFamilies" format="reference" />
```

### Configure programmatically

The Android Maps SDK provides the ability to programmatically integrate maps into an application by using the MapView class. To configure the map display, developers can create an instance of **NextbillionMapOptions** and pass it when creating a MapView.

One way to create a default **NextbillionMapOptions** is by calling the static method **NextbillionMapOptions.createFromAttributes(Context context)**. This method creates an instance of **NextbillionMapOptions** with default settings based on the current context.

Once an instance of **NextbillionMapOptions** is created, it can be customized by calling the available setters. For example, in the code snippet:

```kotlin
NextbillionMapOptions options = NextbillionMapOptions.createFromAttributes(this, null)
      .attributionTintColor(BLUE_COLOR)
      .apiBaseUri("https://api.nextbillion.io")
      .compassFadesWhenFacingNorth(false)
      .camera(new CameraPosition.Builder()
        .target(new LatLng(5.727531563481325, 102.11544099540563))
        .zoom(7)
        .tilt(0)
        .build());

mapView = new MapView(this, options);
```

The **NextbillionMapOptions** instance is created with the default settings and then modified to set the attribution tint color to blue, the API base URI to `https://api.nextbillion.io`, to prevent the compass from fading when facing north, and to set the camera position to a specific location with a zoom level of 7 and a tilt of 0 degrees.

Finally, the **MapView** is created by passing the customized **NextbillionMapOptions** instance.

#### Available setters

The Android Maps SDK provides a comprehensive set of setters that allow developers to fully customize the appearance and behavior of maps in their applications. These setters offer fine-grained control over various aspects of maps, such as camera position, zoom level, map style, and markers. With these setters, developers can create maps that meet the specific needs of their applications and provide a seamless user experience.

```
//Camera
public NextbillionMapOptions camera(CameraPosition cameraPosition)
public NextbillionMapOptions minZoomPreference(double minZoom)
public NextbillionMapOptions maxZoomPreference(double maxZoom)
public NextbillionMapOptions minPitchPreference(double minPitch)
public NextbillionMapOptions maxPitchPreference(double maxPitch)

//UI control
public NextbillionMapOptions compassEnabled(boolean enabled)
public NextbillionMapOptions compassGravity(int gravity)
public NextbillionMapOptions compassMargins(int[] margins)
public NextbillionMapOptions compassFadesWhenFacingNorth(boolean compassFadeWhenFacingNorth)
public NextbillionMapOptions compassImage(Drawable compass)
public NextbillionMapOptions logoEnabled(boolean enabled)
public NextbillionMapOptions logoGravity(int gravity)
public NextbillionMapOptions logoMargins(int[] margins)
public NextbillionMapOptions attributionEnabled(boolean enabled)
public NextbillionMapOptions attributionGravity(int gravity)
public NextbillionMapOptions attributionMargins(int[] margins)
public NextbillionMapOptions attributionTintColor(@ColorInt int color)

//Gestures
public NextbillionMapOptions rotateGesturesEnabled(boolean enabled)
public NextbillionMapOptions scrollGesturesEnabled(boolean enabled)
public NextbillionMapOptions horizontalScrollGesturesEnabled(boolean enabled)
public NextbillionMapOptions tiltGesturesEnabled(boolean enabled)
public NextbillionMapOptions zoomGesturesEnabled(boolean enabled)
public NextbillionMapOptions doubleTapGesturesEnabled(boolean enabled)
public NextbillionMapOptions quickZoomGesturesEnabled(boolean enabled)

//Base Uri & Map tile
public NextbillionMapOptions apiBaseUri(String apiBaseUri)
public NextbillionMapOptions foregroundLoadColor(@ColorInt int loadColor)
public NextbillionMapOptions setPrefetchesTiles(boolean enable)
public NextbillionMapOptions setPrefetchZoomDelta(@IntRange(from = 0) int delta)

//Glyphs and Font
public NextbillionMapOptions localIdeographFontFamilyEnabled(boolean enabled)
public NextbillionMapOptions localIdeographFontFamily(String fontFamily)
public NextbillionMapOptions localIdeographFontFamily(String... fontFamilies)
```

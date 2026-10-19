# Markers and Annotations

The Nextbillion Android Maps SDK provides a rich set of annotations that allow developers to add customized information and interactive elements to their maps. Annotations in the SDK can be used to represent various types of geographic features, such as points, lines, polygon shapes, and circles. Each annotation type has its own set of data-driven and constant properties, which developers can use to control its appearance, behavior, and interaction. By using annotations, developers can create interactive and visually appealing maps that engage their users and enhance their applications.

There are two approaches to adding annotations to the MapView, the first is to use NextbillionMap, and the second is to use AnnotationManager and Style. These approaches provide different levels of customization and control, allowing developers to choose the best fit for their specific needs.

## NextbillionMap

NextbillionMap is the interface between developers and the Maps SDK, it provides many useful interface methods to allow developers to make changes to the MapView, the interface methods we are going to cover in this section are part of the class NextbillionMap.

## Marker

The NextbillionMap Marker is a feature in the Android Maps SDK provided by Nextbillion that allows developers to add custom markers to a MapView. These markers can represent a variety of information such as location, points of interest, or custom graphics and can be added to the map as annotations. The NextbillionMap Marker is a convenient tool for mapping and visualizing data, making it easier for users to understand and interact with the information being presented.

## Interface

The NextbillionMap interface provides methods to add markers on the map. There are three methods to add a single marker, one that takes a **LatLng position**, another that takes a **MarkerOptions** object and a third that takes a **BaseMarkerOptions** object. There is also a method to add multiple markers at once by passing a list of **BaseMarkerOptions** objects. Finally, the interface provides a way to set an OnMarkerClickListener, which is a listener that listens for click events on markers on the map.

```
public Marker addMarker(@NonNull LatLng position)

public Marker addMarker(@NonNull MarkerOptions markerOptions)

public Marker addMarker(@NonNull BaseMarkerOptions markerOptions)

public List<Marker> addMarkers(@NonNull List<? extends BaseMarkerOptions> markerOptionsList)

public void setOnMarkerClickListener(@Nullable OnMarkerClickListener listener);
```

Example

```
nextbillionMap.addMarker(new LatLng(12.97551913,77.58917229));
```

This code adds a marker to the NextbillionMap at the given latitude and longitude (12.97551913, 77.58917229).

### Event

```
The NextbillionMap can also set one MakerClickListener to every MapView’s NextbillionMap instance(each NextbillionMap can only have one MakerClickListener).
nextbillionMap.setOnMarkerClickListener(new NextbillionMap.OnMarkerClickListener() {
   @Override
   public boolean onMarkerClick(@NonNull Marker marker) {
       if("Title".equals(marker.getSnippet())){
           //your logic
       }
       return false;
   }
});
```

This code sets a listener for when a user clicks on a marker on a NextbillionMap instance. If the marker's snippet equals "Title", a custom logic block is executed. The method returns a boolean value indicating whether the event has been consumed.

### Update a Marker

According to what we have mentioned earlier, each method to add a marker(s) will return the added marker(s), which will be a handle to modify the newly created marker.

```
Marker marker = nextbillionMap.addMarker(new LatLng(12.97551913,77.58917229));
```

with this instance, you can update it’s properties dynamically.

### Custom Marker Icon

```
Bitmap iconBitmap = your bitmap logic;
marker.setIcon(IconFactory.getInstance(MarkerActivity.this).fromBitmap(iconBitmap));
```

This code sets a custom marker icon for a marker. The custom icon is created by using the **"iconBitmap"** variable which is the result of the custom logic implemented to generate the bitmap. Then, the method **"setIcon()"** is called on the marker instance, which takes the custom bitmap as input and sets it as the marker icon using the **"IconFactory.getInstance()"** method. The IconFactory is used to create an Icon object from a Bitmap.

### Remove a Marker

You can remove a marker by calling removeMarker method of NextbillionMap

```
nextbillionMap.removeMarker(marker);
```

### Info Window

The Marker has a built-in InfoWindow, you can show InfoWindow by clicking on the Marker if you have assigned a title or snippet to your MarkerOptions.

```
nextbillionMap.addMarker(new MarkerOptions().position(new LatLng(12.97780156,77.59656748)).title("Title"));
nextbillionMap.addMarker(new MarkerOptions().position(new LatLng(12.98208919,77.60329262)).snippet("Snippet"));
```

#### Customize InfoWindow

```
nextbillionMap.setInfoWindowAdapter(new NextbillionMap.InfoWindowAdapter() {
   @Nullable
   @Override
   public View getInfoWindow(@NonNull Marker marker) {
      //Logic of customizing infoWindow's View
       return your view;
   }
});
```

This is a code block for customizing the **InfoWindow** for a marker on a NextbillionMap. The method **setInfoWindowAdapter** sets a custom adapter for the **InfoWindow**, allowing the user to define their own layout for the **InfoWindow**. The **getInfoWindow** method is called to get the custom view that should be displayed as the **InfoWindow**. The logic for customizing the **InfoWindow** view is included in this method and the resulting view is returned.

## Polyline

Polyline in Android Maps SDK refers to a series of connected line segments on a map. It is used to represent a route, path, or boundary on a map. In the Android Maps SDK, Polyline is a class that can be used to draw polylines on a MapView. The polylines can be customized with various styles, such as width, color, and opacity. Additionally, Polyline objects can also be used to interact with the map, for example, to listen for clicks on a specific polyline.

### Interface

```
public Polyline addPolyline(@NonNull LatLng origin, @NonNull LatLng dest, int color)

public Polyline addPolyline(@NonNull LatLng origin, @NonNull LatLng dest, String color)

public Polyline addPolyline(@NonNull List<LatLng> points, int color)

public Polyline addPolyline(@NonNull List<LatLng> points, String color)

public Polyline addPolyline(@NonNull PolylineOptions polylineOptions)

public List<Polyline> addPolylines(@NonNull List<PolylineOptions> polylineOptionsList)

public void setOnPolylineClickListener(@Nullable OnPolylineClickListener    listener)
```

The above code is an interface for adding Polylines to the Android Maps SDK. The interface provides several methods to add Polylines to the map, including adding a Polyline between two points, adding multiple Polylines to the map, and adding a Polyline using **PolylineOptions**. Additionally, the interface includes a method to set an **OnPolylineClickListener**, which can be used to listen for clicks on the Polylines.

### Example

```
nextbillionMap.addPolyline(origin, dest, 0xff00ffff);
```

This example shows how to add a polyline to a NextbillionMap. The addPolyline() method is called with origin and dest LatLng coordinates, and an integer representing the color of the line in ARGB format (0xff00ffff represents a bright green color). The method returns a Polyline instance that can be used to further customize the line.

### Event

Similar to markers, we can set one OnPolylineClickListener to every MapView’s NextbillionMap instance.

```
nextbillionMap.setOnPolylineClickListener(new NextbillionMap.OnPolylineClickListener() {
    @Override
    public void onPolylineClick(@NonNull Polyline polyline) {

    }
});
```

If the SDK detects that a polyline has been clicked, the **onPolylineClick** method will be called with a non-null instance of Polyline as its argument. Otherwise, the method will not be called.
Developers can use this listener to perform actions in response to polyline clicks, such as displaying information about the polyline or navigating to a different location on the map.

## Polygon

Polygon is a feature in the Android Maps SDK that allows the representation of shapes on the map. It can be used to display geographical areas, such as a park, lake or building, by connecting multiple points on the map. The Android Maps SDK provides a simple and convenient way to add Polygons to the map, making it easy to visualize and display specific regions of interest. With the Polygon feature, you can create custom shapes with different colors and widths, and also define listeners to handle events such as clicking on the Polygon.

### Interface

This is a list of methods available in Android Maps SDK for creating and adding polygon shapes to a map. The method **addPolygon** can be used to add a polygon shape to the map, with either a list of LatLng points, a color code, or a PolygonOptions object. The method addPolygons can be used to add multiple polygon shapes at once. The setOnPolygonClickListener method allows to set a listener that will be triggered when a polygon shape is clicked on the map.

```
public Polygon addPolygon(@NonNull List<LatLng> points, int color)

public Polygon addPolygon(@NonNull List<LatLng> points, String color)

public Polygon addPolygon(@NonNull PolygonOptions polygonOptions)

public List<Polygon> addPolygons(@NonNull List<PolygonOptions> polygonOptionsList)

public void setOnPolygonClickListener(@Nullable OnPolygonClickListener listener);
```

### Example

```
nextbillionMap.addPolygon(points, 0xffff0000);
```

The above code shows an example of adding a Polygon to a NextbillionMap with a color specified in the hexadecimal format of 0xffff0000.

### Event

Similar to markers and polylines, we can set one OnPolygonClickListener to every MapView’s NextbillionMap instance.

```
nextbillionMap.setOnPolygonClickListener(new NextbillionMap.OnPolygonClickListener() {
    @Override
    public void onPolygonClick(@NonNull Polygon polygon) {

    }
});
```

An non-null instance of Polygon will be returned once the SDK has detected a Polygon get clicked, otherwise the method **onPolygonClick** will not be called.

# AnnotationManager and Style

According to previous guide:
We can add source-layers to Style

<https://geojson.org/>

Essentially, every AnnotationManager will create and add a GeoJSONSource to Style, and ultimately, all annotations(Symbols, Lines, Fills and Circles) will be converted to GeoJSON features and updated to the GeoJSONSource it maintains.

Each Annotation has a major Annotation class, an options class, and a manager class.
The relationship between the major annotation class and the options class is one-to-one,
The relationship between the manager and the major annotation class is one-to-many.

Normally an annotation has two groups of properties,

- **Data-driven properties**: the properties can be dynamically changed based on data attributes. This provides developers with a high level of
  customization and flexibility to tailor the map to their specific use case.
- **Constant properties**: control the position and orientation of the map elements, further enhancing the customization options available to developers.
  The options class is used to configure the data-driven properties, and the manager class is for constant properties, other than properties, the manager class also exposes interfaces to add and remove relevant event listeners, such as
- dragListener
- clickListener
- longClickListener

The step to plot an annotation is:

- Create a manager
- Create an option
- Pass the options to the create() method of the manager to create an annotation

For example
Symbol, SymbolOptions, and SymbolManager.

## Symbol

The Android Maps SDK allows the addition of symbols as annotations to the map. These symbols serve as a visual representation of a specific location or feature and can be customized in terms of shape, color, and size.

### Data-driven properties

This is a list of data-driven properties that can be set for a feature in a map using Android Maps SDK. The properties include the feature's draggability, data associated with it, its geometry, sorting key, icon details like size, image, rotation, and offset, text field, font, size, letter spacing, justification, radial offset, anchor, and transform, opacity and color details for both icon and text, and halo details like color, width, and blur for both icon and text.

```
  private boolean isDraggable;
  private JsonElement data;
  private Point geometry;
  private Float symbolSortKey;
  private Float iconSize;
  private String iconImage;
  private Float iconRotate;
  private Float[] iconOffset;
  private String iconAnchor;
  private String textField;
  private String[] textFont;
  private Float textSize;
  private Float textMaxWidth;
  private Float textLetterSpacing;
  private String textJustify;
  private Float textRadialOffset;
  private String textAnchor;
  private Float textRotate;
  private String textTransform;
  private Float[] textOffset;
  private Float iconOpacity;
  private String iconColor;
  private String iconHaloColor;
  private Float iconHaloWidth;
  private Float iconHaloBlur;
  private Float textOpacity;
  private String textColor;
  private String textHaloColor;
  private Float textHaloWidth;
  private Float textHaloBlur;
```

### Constant properties

```
 public void setSymbolPlacement(@Property.SYMBOL_PLACEMENT String value)
 public void setSymbolSpacing( Float value)
 public void setSymbolAvoidEdges( Boolean value)
 public void setIconAllowOverlap( Boolean value)
 public void setIconIgnorePlacement( Boolean value)
 public void setIconOptional( Boolean value)
 public void setIconRotationAlignment(@Property.ICON_ROTATION_ALIGNMENT String value)
 public void setIconTextFit(@Property.ICON_TEXT_FIT String value)
 public void setIconTextFitPadding( Float[] value)
 public void setIconPadding( Float value)
 public void setIconKeepUpright( Boolean value)
 public void setIconPitchAlignment(@Property.ICON_PITCH_ALIGNMENT String value)
 public void setTextPitchAlignment(@Property.TEXT_PITCH_ALIGNMENT String value)
 public void setTextRotationAlignment(@Property.TEXT_ROTATION_ALIGNMENT String value)
 public void setTextLineHeight( Float value)
 public void setTextVariableAnchor( String[] value)
 public void setTextMaxAngle( Float value)
 public void setTextPadding( Float value)
 public void setTextKeepUpright( Boolean value)
 public void setTextAllowOverlap( Boolean value)
 public void setTextIgnorePlacement( Boolean value)
 public void setTextOptional( Boolean value)
 public void setIconTranslate( Float[] value)
 public void setIconTranslateAnchor(@Property.ICON_TRANSLATE_ANCHOR String value)
 public void setTextTranslate( Float[] value)
 public void setTextTranslateAnchor(@Property.TEXT_TRANSLATE_ANCHOR String value)
```

The above code lists the constant properties of a symbol layer in the Android Maps SDK. The properties define the behavior and appearance of the symbols on a map layer. For example, the **setSymbolPlacement** method sets the placement of the symbols in relation to the geometry they represent. The **setIconAllowOverlap** method determines whether or not icons can overlap with each other. Similarly, **setTextPitchAlignment** sets the vertical alignment of the text in relation to its anchor. These properties help to customize the look and feel of the symbols in a map layer.

## Line

Line annotations in Nextbillion.ai’s Android Maps SDK allow developers to display lines or paths on the map. With this feature, it is possible to represent linear features such as roads, rivers, and borders, with custom styles and attributes. The SDK provides data-driven and constant properties to control the appearance of lines, such as line width, color, join, opacity, and more. The line annotations are drawn over the base map tiles and can be updated dynamically as the map view changes, making them a powerful tool for visualizing linear features in a map-based application.

### Data-driven properties

```
  private boolean isDraggable;
  private JsonElement data;
  private LineString geometry;
  private String lineJoin;
  private Float lineOpacity;
  private String lineColor;
  private Float lineWidth;
  private Float lineGapWidth;
  private Float lineOffset;
  private Float lineBlur;
  private String linePattern;
```

These are Data-driven properties of the Line class in the Android Maps SDK.

- **isDraggable**: determines if the line can be moved by the user.
- **data**: can be used to store custom data for the line, in the form of a JsonElement.
- **geometry**: defines the shape of the line, represented by a LineString object.
- **lineJoin**: specifies the behavior of corners on the line. The options are round, miter, and bevel.
- **lineOpacity**: defines the transparency of the line, where 1 is fully opaque and 0 is fully transparent.
- **lineColor**: sets the color of the line.
- **lineWidth**: sets the width of the line.
- **lineGapWidth**: sets the size of the gap between the segments of a dashed or dotted line.
- **lineOffset**: sets the distance the line is offset from its origin.
- **lineBlur**: adds a blur effect to the line, where the higher the value, the greater the blur.
- **linePattern**: sets a repeated pattern for the line, represented as a string of "tl" and "dr" characters, which represent diagonal lines going up and to the left, and diagonal lines going down and to the right, respectively.

### Constant properties

```
 public void setLineCap(@Property.LINE_CAP String value)
 public void setLineMiterLimit( Float value)
 public void setLineRoundLimit( Float value)
 public void setLineTranslate( Float[] value)
 public void setLineTranslateAnchor(@Property.LINE_TRANSLATE_ANCHOR String value)
 public void setLineDasharray( Float[] value)
```

The above code sets properties for a Line class in a map. The constant properties include:

- **setLineCap**: Set the display of the endpoints of the line. The values for this property can be "butt", "round", or "square".
- **setLineMiterLimit**: Set the limit of the ratio of the miter length to the line width.
- **setLineRoundLimit**: Set the limit of how rounded the line join can be.
- **setLineTranslate**: Set the translation of the line in pixels as an array of two numbers.
- **setLineTranslateAnchor**: Set the origin of the translation of the line. The values can be "map" or "viewport".
- **setLineDasharray**: Set the length and spacing of dashes and gaps as an array of numbers.

## Fill

The Fill properties define the appearance and behavior of a filled area on a map. The properties can be either data-driven or constant.

### Data-driven properties

The data-driven properties of the Fill class include:

- **isDraggable**: a boolean indicating whether the fill can be moved.
- **data**: a JsonElement representing any additional data associated with the fill.
- **geometry**: a Polygon defining the shape of the fill.
- **fillOpacity**: a float representing the opacity of the fill.
- **fillColor**: a string representing the color of the fill.
- **fillOutlineColor**: a string representing the color of the outline of the fill.
- **fillPattern**: a string representing the pattern used to fill the shape.

```
  private boolean isDraggable;
  private JsonElement data;
  private Polygon geometry;
  private Float fillOpacity;
  private String fillColor;
  private String fillOutlineColor;
  private String fillPattern;
```

### Constant properties

The constant properties of the Fill class include:

- **setFillAntialias**: a boolean indicating whether the fill should use antialiasing.
- **setFillTranslate**: a float array representing the translate property of the fill.
- **setFillTranslateAnchor**: a string representing the translate anchor property of the fill.

```
 public void setFillAntialias(Boolean value)
 public void setFillTranslate(Float[] value)
 public void setFillTranslateAnchor(@Property.FILL_TRANSLATE_ANCHOR String value)
```

## Circle

Circle annotations in Nextbillion Android Maps SDK allow developers to display circular shapes on a map, with customizable radius, color, opacity, and stroke properties. These annotations can be used to represent areas of interest, show proximity or coverage of a location, or to highlight geographic features.

### Data-driven properties

The data-driven properties are variables such as "isDraggable", "data", "geometry", "circleRadius", "circleColor", "circleBlur", "circleOpacity", "circleStrokeWidth", "circleStrokeColor", and "circleStrokeOpacity". These properties are dynamic and can change based on the data provided.

```
  private boolean isDraggable;
  private JsonElement data;
  private Point geometry;
  private Float circleRadius;
  private String circleColor;
  private Float circleBlur;
  private Float circleOpacity;
  private Float circleStrokeWidth;
  private String circleStrokeColor;
  private Float circleStrokeOpacity;
```

### Constant properties

The constant properties are methods such as **"setCircleTranslate"**, **"setCircleTranslateAnchor"**, **"setCirclePitchScale"**, and **"setCirclePitchAlignment"**. These properties are set to a fixed value and cannot be changed dynamically. These methods are used to set values for properties such as the circle's translation, its translation anchor, its pitch scale, and its pitch alignment.

```
 public void setCircleTranslate( Float[] value)
 public void setCircleTranslateAnchor(@Property.CIRCLE_TRANSLATE_ANCHOR String value)
 public void setCirclePitchScale(@Property.CIRCLE_PITCH_SCALE String value)
 public void setCirclePitchAlignment(@Property.CIRCLE_PITCH_ALIGNMENT String value)
```

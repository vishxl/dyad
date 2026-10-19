# SDK Style and GeoJSON

Keep the [SDK Interface](https://docs.nextbillion.ai/maps/android-maps-sdk/sdk-interface) section as API index only. Use this section as the single source for detailed style workflows and examples.

In Nextbillion Maps SDK, map styles follow the MapLibre Style Specification: _<https://maplibre.org/maplibre-style-spec/>_.

One of the most important concepts in Style is source and layer.
Sources carry geographic data that determines the shape of the features we want to add to the map.
Layers are styling information that determines how the date of the source looks on the map, in other words, layers determine the visual representation of source data.

## Set Style(with NextbillionMap)

According to the section SDK Interface

The interfaces to add or fetch style are in the class `NextbillionMap`.

```
public Style getStyle()
public void getStyle(@NonNull Style.OnStyleLoaded onStyleLoaded)
public void setStyle(String style)
public void setStyle(String style, final Style.OnStyleLoaded callback)
public void setStyle(Style.Builder builder)
public void setStyle(Style.Builder builder, final Style.OnStyleLoaded callback)
```

With **setStyle(String style)**, we can pass a full URL that links to a Style JSON to the method, and we can also register an `OnStyleLoaded` callback once the style is loaded.
Besides that, we have another style setting methods that accept `Style.Builder`, which provides more flexibility and allows us to:

1. Set style from Url/Uri
2. Set style from a plain JSON content of a style
3. Specify source(s) to be added after the style is loaded
4. Specify layer(s) to be added after the style is loaded
5. Specify image(s) to be added after the style is loaded

The `setStyle(String style)` method allows you to set the style of your map by passing a URL linking to a Style JSON. You can also register a callback, _OnStyleLoaded_, to be notified once the style has been loaded.
For more customization and flexibility in setting the style, the method also accepts a _Style.Builder_ object. With the Builder, you can set the style from a URL or JSON content, add sources, layers, and images to the style after it has been loaded. This provides a more versatile way to configure the map's appearance.

## Style interface

The Style interface allows us to read and modify the style information for a map. With this interface, we can access the properties and elements of a map style, such as sources, layers, and images. Additionally, we can modify these elements by adding, removing, or updating them. By using the methods provided by the Style interface, we can dynamically change the appearance and behavior of a map at runtime.

### Read

The `getUri()` method returns the URL of the current style that has been applied to the Style interface.

```
public String getUri()
```

The `getJson()` method returns the JSON representation of the current style that has been applied to the Style interface. This method returns the style information in plain text format as a string, which can then be used to modify or inspect the style information at runtime.

```
public String **getJson()**
```

### Source

The Style Interface's Source component is a critical part of customizing the appearance of a map on a mapping platform. A source refers to a collection of data that is used to generate a map layer, such as geographic data or satellite imagery. In the Style Interface, sources are defined and managed programmatically, allowing developers to add, modify, and remove data sources in real-time. This feature provides a high degree of flexibility and control over the look and feel of a map, enabling developers to create custom maps tailored to their specific needs and applications.

### Add

The _addSource(Source source)_ method is used to add a source to a map style in a mapping API. The method accepts a `Source` object, which is a base class for various types of data sources that can be added to the map.

```
public void addSource(@NonNull Source source);
```

Steps of adding a source:

- An unique source id
- Initiate a source
- Add to style

```
  GeoJsonOptions options = new GeoJsonOptions().withMaxZoom(18);
  Source source = new GeoJsonSource(SOURCE_ID, options);
  style.addSource(source);
```

In the example, a `GeoJsonSource` is used, which represents a source of GeoJSON data. The source is created by providing an _ID (SOURCE_ID_) and a _GeoJsonOptions_ object, which provides options for the source such as the maximum zoom level to be used _(withMaxZoom(18))_.

There are other types of sources available besides _GeoJsonSource_, including

1. VectorSource
2. RasterSource
3. ImageSource

Each of these sources represents a different type of data and has its own options for controlling how it is displayed on the map.

### Remove

The Style interface provides two ways to remove a source from the style information at runtime.

```
public boolean removeSource(@NonNull String sourceId);
public boolean removeSource(@NonNull Source source);
```

The first way is to remove a source by passing the unique source id as a parameter. The second way is to remove a source by passing the source instance/reference as a parameter. Both methods return a boolean value indicating if the source removal was successful or not.

### Get

Similar to removing methods, we also can find the source by an id or simply get all sources that have been added to the Style.

```
public List<Source> getSources();
public Source getSource(String id);
public <T extends Source> T getSourceAs(@NonNull String sourceId);
```

The `getSources` method returns a list of all the sources currently added to the Style. The `getSource` method returns a specific Source object based on its unique identifier (id). The `getSourceAs` method returns a specific Source object as a specific type, based on its id and the type specified in the method argument.

## Type of source

1. VectorSource
2. GeoJSONSource
3. RasterSource
4. RasterDEMSource
5. ImageSource

### VectorSource

```
public VectorSource(String id, String uri)
public VectorSource(String id, Uri uri)
```

`VectorSource` is a type of source in the Style interface, used to retrieve vector data, such as GeoJSON data, from a specified URL or URI. The constructor of the VectorSource class takes two arguments:

- **id:** A unique identifier for the source.
- **uri:** The URL or URI that points to the source data.

By passing the source id and uri to the VectorSource constructor, we can initiate a VectorSource instance, which can be later added to a Style instance using the _addSource_ method of the Style interface.

### RasterSource

```
public RasterSource(String id, URI uri)
public RasterSource(String id, String uri)
```

The **RasterSource** constructor accepts either a String or URI object as the source's unique identifier and the URL of the raster data. The **id** parameter must be unique among all sources on the same map style, and the **uri** parameter specifies the URL of the raster data. The raster data can be either a raster tileset or a raster image, and it will be used as a source for raster-based map layers in the style.

### RasterDEMSource

```
public RasterDemSource(String id, URI uri)
```

`RasterDEMSource` is a subclass of the `RasterSource` and is used to represent digital elevation models. It is used to add a raster data source to the style that contains elevation data. The constructor takes two arguments:

1. **id**: A unique identifier for the source, used to reference the source in other parts of the code.
2. **uri**: The URI of the raster data source, which can be either a string or a URI object.

### ImageSource

```
public ImageSource(String id, LatLngQuad coordinates, @NonNull URI uri)
public ImageSource(String id, LatLngQuad coordinates, @NonNull Bitmap bitmap)
public ImageSource(String id, LatLngQuad coordinates, @DrawableRes int resourceId)
```

The **ImageSource** is a source used to display images in a style. It can be constructed with either a URI that points to an image file, a Bitmap, or a drawable resource ID. The LatLngQuad parameter specifies the bounding box of the image, where it is positioned on the map. The id parameter is a unique identifier for the image source, which is used to reference it in the style.

## Layer

The Style interface in the Android Maps SDK allows for the management of map layers. Layers are a visual representation of data from a Source and provide a way to control the appearance and behavior of map features. By using the Layer interface, you can add and remove layers from the map style, retrieve a list of all layers, or access individual layers by their ID.

There are various types of layers available in the Android Maps SDK, including _SymbolLayer_, _FillLayer_, _LineLayer_, and _RasterLayer_, each providing different options to customize the appearance and behavior of map features. With the Layer interface, you have full control over the look and feel of your map, making it an essential part of the Android Maps SDK

### Add

This section describes the various methods available for adding a layer to a style in the Android Maps SDK.

```
public void addLayer(@NonNull Layer layer);
public void addLayerBelow(@NonNull Layer layer, @NonNull String below);
public void addLayerAbove(@NonNull Layer layer, @NonNull String above);
public void addLayerAt(@NonNull Layer layer, @IntRange(from = 0) int index);
```

The biggest difference between adding a source and adding a layer is that layers are layered on top of each other, with each layer having a specific index. By calling the `addLayer` method, the newly added layer will always be added on top of all other layers. If you wish to add a layer to a specific index, you can use the `addLayerAt` method. Alternatively, you can add a layer in a relative position using the `addLayerBelow` and `addLayerAbove` methods.

Steps to add a layer:

1. Initiate and add a source
2. A unique layer id
3. Initiate a layer with source id and layer id
4. Add to style

```
  GeoJsonOptions options = new GeoJsonOptions().withMaxZoom(18);
  Source source = new GeoJsonSource(SOURCE_ID, options);
  style.addSource(source);
  SymbolLayer symbolLayer = new SymbolLayer(LAYER_ID, SOURCE_ID)
  style.addLayer(symbolLayer);
```

In the above example, we first initiate a _GeoJsonSource_ with a unique _SOURCE_ID_ and add it to the style. Next, we initiate a _SymbolLayer_ with the _LAYER_ID_ and _SOURCE_ID_ and add it to the style using the `addLayer` method. The _SymbolLayer_ is added to the top of all other layers. By using _addLayerBelow_ or _addLayerAbove_, we can add the layer to a relative position with respect to other layers. If we want to add the layer to a specific index, we can use _addLayerAt_.

### Remove

The `removeLayer` method allows you to remove a layer from Style Interface by either providing the id of the layer to remove or the instance/reference of the layer. The `removeLayerAt` method allows you to remove a layer from a specific index within the style's list of layers. The method returns a boolean indicating whether the removal was successful or not.

```
public boolean removeLayer(@NonNull String layerId);
public boolean removeLayer(@NonNull Layer layer);
public boolean removeLayerAt(@IntRange(from = 0) int index);
```

### Get

The `get` methods of the Layer in the Style Interface provide access to different layers present in the style

```
public Layer getLayer(@NonNull String id);
public <T extends Layer> T getLayerAs(@NonNull String layerId);
public List<Layer> getLayers();
```

1. **getLayer** method returns the layer object that matches the specified layer ID.
2. **getLayerAs** method returns the layer object with the specified layer ID, cast to the specified type.
3. **getLayers** method returns a list of all the layers in the style, in the order they were added

Types of Layer

1. Symbol Layer
2. Line Layer
3. Fill Layer
4. Circle Layer
5. Fill extrusion Layer
6. Hillshade Layer
7. Heatmap Layer

## Image

The `getImage` method in the Map's style interface is used to retrieve an image from the map's style using a specified id.

```
public Bitmap getImage(@NonNull String id)
```

The **id** parameter is a string that represents the unique identifier of the image you want to retrieve. The method returns a _Bitmap_ object that represents the image. The Bitmap object can then be used to display the image in your application or manipulate it in other ways.

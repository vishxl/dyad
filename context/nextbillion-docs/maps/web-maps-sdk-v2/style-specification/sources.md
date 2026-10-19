# Sources

Sources state which data the map should display. Specify the type of source with the "type" property, which must be one of vector, raster, raster-dem, geojson, image, video. Adding a source isn't enough to make data appear on the map because sources don't contain styling details like color or width. Layers refer to a source and give it a visual representation. This makes it possible to style the same source in different ways, like differentiating between types of roads in a highways layer.

Tiled sources (vector and raster) must specify their details according to the [TileJSON specification](https://github.com/mapbox/tilejson-spec). There are several ways to do so:

1.  By supplying TileJSON properties such as `tiles`, `minzoom`, and `maxzoom` directly in the source

    ```json
    "nb-streets": {
    "type": "vector",
    "tiles": [ "http://a.example.com/tiles/{z}/{x}/{y}.pbf",
    "http://b.example.com/tiles/{z}/{x}/{y}.pbf" ],
    "maxzoom": 14
    }
    ```

2.  By providing a `url` to a TileJSON resource

    ```json
    "nb-streets": {
    "type": "vector",
    "url": "http://api.example.com/tilejson.json"
    }
    ```

3.  By providing a URL to a WMS server that supports EPSG:3857 (or EPSG:900913) as a source of tiled data. The server URL should contain a `{bbox-epsg-3857}` replacement token to supply the `bbox` parameter.

    ```json
    "wms-imagery": {
    "type": "raster",
    "tiles": ["http://a.example.com/wms?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&width=256&height=256&layers=example"
    ],
    "tileSize": 256
    }
    ```

## vector

A vector tile source. All geometric coordinates in vector tiles must be between `-1 * extent` and `(extent * 2) - 1` inclusive. All layers that use a vector source must specify a [source-layer](/maps/web-v2/style-specification/layers) value.

### attribution

_Optional [string](/docs/maps/web-v2/style-specification/types#string)_.

Contains an attribution to be displayed when the map is shown to a user.

### bounds

_Optional [Array](/docs/maps/web-v2/style-specification/types#array)[<number\>](/docs/maps/web-v2/style-specification/types#number). Default:`22`_

An array containing the longitude and latitude of the southwest and northeast corners of the source's bounding box in the following order: _\[southwest.lng, southwest.lat, northeast.lng, northeast.lat\]_. When this property is included in a source, no tiles outside of the given bounds are requested by nb GL.

### maxzoom

_Optional [number](/docs/maps/web-v2/style-specification/types#number). Default: 22_

Maximum zoom level for which tiles are available, as in the [TileJSON specification](https://github.com/mapbox/tilejson-spec). Data from tiles at the `maxzoom` are used when displaying the map at higher zoom levels.

### minzoom

_Optional [number](/docs/maps/web-v2/style-specification/types#number). Default: 0_

Minimum zoom level for which tiles are available, as in the [TileJSON specification](https://github.com/mapbox/tilejson-spec).

### scheme

_Optional [string](/docs/maps/web-v2/style-specification/types#string). Allowed values: `xyz`, `tms` Default: `xyz`_

Should belong to one of `xyz`, `tms`. Influences the y direction of the tile coordinates. The global-mercator (aka Spherical Mercator) profile is assumed. - `xyz`: Slippy map tilenames scheme. - `tms`: OSGeo specification scheme.

### tiles

_Optional [Array](/docs/maps/web-v2/style-specification/types#array)[<number\>](/docs/maps/web-v2/style-specification/types#number)._

An array of one or more tile source URLs, as in the [TileJSON specification](https://github.com/mapbox/tilejson-spec).

### url

_Optional [string](/docs/maps/web-v2/style-specification/types#string)._

A URL to a TileJSON resource. Supported protocols are _http_, _https_.

### promoteId

_Optional [promoteId](/docs/maps/web-v2/style-specification/types#promoteId)._

A property to use as a feature id (for feature state). Either a property name, or an object of the form **{ sourceLayer: propertyName}**. If specified as a string for a vector tile source, the same property is used across all its source layer

## raster

A raster tile source.

```json
"nb-satellite": {
"type": "raster",
"url": "http://api.example.com/satellite.json",
"tileSize": 256
}
```

### attribution

_Optional [string](/docs/maps/web-v2/style-specification/types#string)._

Contains an attribution to be displayed when the map is shown to a user.

### bounds

_Optional [Array](/docs/maps/web-v2/style-specification/types#array)[<number\>](/docs/maps/web-v2/style-specification/types#number). Default:`22`_

An array containing the longitude and latitude of the southwest and northeast corners of the source's bounding box in the following order: _\[southwest.lng, southwest.lat, northeast.lng, northeast.lat\]_. When this property is included in a source, no tiles outside of the given bounds are requested by nb GL.

### maxzoom

_Optional [number](/docs/maps/web-v2/style-specification/types#number). Default: 22_

Maximum zoom level for which tiles are available, as in the [TileJSON specification](https://github.com/mapbox/tilejson-spec). Data from tiles at the `maxzoom` are used when displaying the map at higher zoom levels.

### minzoom

_Optional [number](/docs/maps/web-v2/style-specification/types#number). Default: 0_

Minimum zoom level for which tiles are available, as in the [TileJSON specification](https://github.com/mapbox/tilejson-spec).

### scheme

_Optional [string](/docs/maps/web-v2/style-specification/types#string). Allowed values: `xyz`, `tms` Default: `xyz`_

Should belong to one of `xyz`, `tms`. Influences the y direction of the tile coordinates. The global-mercator (aka Spherical Mercator) profile is assumed.

- `xyz`: Slippy map tilenames scheme.
- `tms`: OSGeo specification scheme.

### tiles

_Optional [Array](/docs/maps/web-v2/style-specification/types#array)[<number\>](/docs/maps/web-v2/style-specification/types#number)._

An array of one or more tile source URLs, as in the [TileJSON specification](https://github.com/mapbox/tilejson-spec).

### url

_Optional [string](/docs/maps/web-v2/style-specification/types#string)._

A URL to a TileJSON resource. Supported protocols are _http_, _https_.

### tileSize

_Optional [number](/docs/maps/web-v2/style-specification/types#number). Default: 512_

The minimum visual size to display tiles for this layer. Only configurable for raster layers. Please note the units for `tileSize` is pixel.

## raster-dem

A raster DEM source.

```json
"terrain-rgb": {
"type": "raster-dem",
"url": "https://api.example.com/terrain.json"
}
```

### attribution

_Optional [string](/docs/maps/web-v2/style-specification/types#string)._

Contains an attribution to be displayed when the map is shown to a user.

### bounds

_Optional [Array](/docs/maps/web-v2/style-specification/types#array)[<number\>](/docs/maps/web-v2/style-specification/types#number). Default:`22`_

An array containing the longitude and latitude of the southwest and northeast corners of the source's bounding box in the following order: _\[southwest.lng, southwest.lat, northeast.lng, northeast.lat\]_. When this property is included in a source, no tiles outside of the given bounds are requested by nb GL.

### maxzoom

_Optional [number](/docs/maps/web-v2/style-specification/types#number). Default: 22_

Maximum zoom level for which tiles are available, as in the [TileJSON specification](https://github.com/mapbox/tilejson-spec). Data from tiles at the `maxzoom` are used when displaying the map at higher zoom levels.

### minzoom

_Optional [number](/docs/maps/web-v2/style-specification/types#number). Default: 0_

Minimum zoom level for which tiles are available, as in the [TileJSON specification](https://github.com/mapbox/tilejson-spec).

### scheme

_Optional [string](/docs/maps/web-v2/style-specification/types#string). Allowed values: `xyz`, `tms` Default: `xyz`_

Should belong to one of `xyz`, `tms`. Influences the y direction of the tile coordinates. The global-mercator (aka Spherical Mercator) profile is assumed.

- `xyz`: Slippy map tilenames scheme.
- `tms`: OSGeo specification scheme.

### tiles

_Optional [Array](/docs/maps/web-v2/style-specification/types#array)[<number\>](/docs/maps/web-v2/style-specification/types#number)._

An array of one or more tile source URLs, as in the [TileJSON specification](https://github.com/mapbox/tilejson-spec).

### url

_Optional [string](/docs/maps/web-v2/style-specification/types#string)._

A URL to a TileJSON resource. Supported protocols are _http_, _https_.

### tileSize

_Optional [number](/docs/maps/web-v2/style-specification/types#number). Default: 512_

The minimum visual size to display tiles for this layer. Only configurable for raster layers. Please note the units for `tileSize` is pixel.

### encoding

_Optional [enum](/docs/maps/web-v2/style-specification/types#enum). Allowed values: mapbox, terrarium. Default: mapbox_

Specifies the encoding used by this `source`.

- `mapbox`: Mapbox Terrain RGB. This is also the default.
- `terrarium`: Terrarium format PNG tiles. See [here](https://aws.amazon.com/es/public-datasets/terrain/) for more info.

## geojson

A [GeoJSON](https://geojson.org/) source. Data must be provided via a `data` property, whose value can be a URL or inline GeoJSON.

```json
{
  "geojson-marker": {
    "type": "geojson",
    "data": {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [-77.0323, 38.9131]
      },
      "properties": {
        "title": "DC",
        "marker-symbol": "monument"
      }
    }
  }
}
```

This example of a GeoJSON source refers to an external GeoJSON document via its URL. The GeoJSON document must be on the same domain or accessible using [CORS](https://enable-cors.org/).

```json
"geojson-lines": {
  "type": "geojson",
  "data": "./lines.geojson"
}
```

### attribution

_Optional [string](/docs/maps/web-v2/style-specification/types#string)._

Contains an attribution to be displayed when the map is shown to a user.

### cluster

_Optional [boolean](/docs/maps/web-v2/style-specification/types#boolean). Defaults: 'false'_

Contains an attribution to be displayed when the map is shown to a user.

If the data is a collection of point features, setting this to true clusters the points by radius into groups. Cluster groups become new `Point` features in the source with additional properties:

- `cluster`: Is true if the point is a cluster
- `cluster_id`: A unique ID for the cluster to be used in conjunction with the [cluster inspection methods](/docs/maps/sdk/web-v2/references/sources#methods)
- `point_count`: Number of original points grouped into this cluster
- `point_count_abbreviated`: An abbreviated point count

### clusterMaxZoom

_Optional [number](/docs/maps/web-v2/style-specification/types#number)._

Max zoom on which to cluster points if clustering is enabled. Please note it defaults to one zoom less than maxzoom (so that last zoom features are not clustered).

### clusterProperties

_Optional [object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)._

An object defining custom properties on the generated clusters if clustering is enabled, aggregating values from clustered points. Has the form

```bash
{'property_name': ["operator", "map_expression"]}
```

`operator` is any expression function that accepts at least 2 operands (e.g. "+" or "max") — it accumulates the property value from clusters/points the cluster contains.

`map_expression` produces the value of a single point.

```bash
{"sum": ["+", ["get", "scalerank"]]}
```

For more advanced use cases, in place of operator, you can use a custom reduce expression that references a special `["accumulated"]` value, e.g.

```bash
 {"sum": [["+", ["accumulated"], ["get", "sum"]], ["get", "scalerank"]]}
```

### clusterRadius

_Optional [number](/docs/maps/web-v2/style-specification/types#number). Default: 128_

Radius of each cluster if clustering is enabled. The value must be greater than or equal to 0. A value of 512 indicates a radius equal to the width of a tile.

### data

_Optional [string](/docs/maps/web-v2/style-specification/types#string)._

A URL to a GeoJSON file, or inline GeoJSON.

### generateId

_Optional [boolean](/docs/maps/web-v2/style-specification/types#boolean). Default: false_

Determines whether to generate ids for the geojson features. When enabled, the feature.id property will be auto assigned based on its index in the features array, over-writing any previous values.

### lineMetrics

_Optional [boolean](/docs/maps/web-v2/style-specification/types#boolean). Default: false_

Determines whether to calculate line distance metrics. This is required for line layers that specify line-gradient values.

### maxzoom

_Optional [number](/docs/maps/web-v2/style-specification/types#number). Default: 18_

Maximum zoom level at which to create vector tiles (higher means greater detail at high zoom levels).

### promoteId

_Optional [promoteId](/docs/maps/web-v2/style-specification/types#promoteId)._

A property to use as a feature id (for feature state). Either a property name, or an object of the form `{sourceLayer: propertyName}`.

### tolerance

_Optional [number](/docs/maps/web-v2/style-specification/types#number). Defaults: 0.375_

Douglas-Peucker simplification tolerance (higher means simpler geometries and faster performance).

## image

An image source. The `url` value contains the image location.

The `coordinates` array contains _\[longitude, latitude\]_ pairs for the image corners listed in clockwise order: top left, top right, bottom right, bottom left.

```json
{
  "image": {
    "type": "image",
    "url": "https://www.example.com/assets/radar.gif",
    "coordinates": [
      [-80.425, 46.437],
      [-71.516, 46.437],
      [-71.516, 37.936],
      [-80.425, 37.936]
    ]
  }
}
```

### coordinate

_Required [Array](/docs/maps/web-v2/style-specification/types#array)\[<<[Array](/docs/maps/web-v2/style-specification/types#array)[<number\>](/docs/maps/web-v2/style-specification/types#number)\>. Default:`22`_

Corners of image specified in longitude, latitude pairs. Please follow the clockwise order - top left, top right, bottom right, bottom left - when specifying the `coordinates`.

### url

_Required [string](/docs/maps/web-v2/style-specification/types#string)._

URL that points to an image.

### video

A video source. The `urls` value is an array. For each URL in the array, a video element source will be created. To support the video across browsers, supply URLs in multiple formats.

The `coordinates` array contains _\[longitude, latitude\]_ pairs for the video corners listed in clockwise order: top left, top right, bottom right, bottom left.

```json
{
  "video": {
    "type": "video",
    "urls": [
      "https://static-example.com/drone.mp4",
      "https://static-example.com/drone.webm"
    ],
    "coordinates": [
      [-122.51596391201019, 37.56238816766053],
      [-122.51467645168304, 37.56410183312965],
      [-122.51309394836426, 37.563391708549425],
      [-122.51423120498657, 37.56161849366671]
    ]
  }
}
```

### coordinate

_Required [Array](/docs/maps/web-v2/style-specification/types#array)[<Array](/docs/maps/web-v2/style-specification/types#array)[<number\>\>](/docs/maps/web-v2/style-specification/types#number). Default:`22`_

Corners of image specified in longitude, latitude pairs. Please follow the clockwise order - top left, top right, bottom right, bottom left - when specifying the `coordinates`.

### url

_Required [string](/docs/maps/web-v2/style-specification/types#string)._

URLs to video content in order of preferred format.

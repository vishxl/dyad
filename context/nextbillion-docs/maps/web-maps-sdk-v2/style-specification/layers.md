# Layers

A style's `layers` property lists all the layers available in that style. The type of layer is specified by the `type` property, and must be one of _background_, _fill_, _line_, _symbol_, _raster_, _circle_, _fill-extrusion_, _heatmap_, _hillshade_. Except for `layers` of the _background_ type, each layer needs to refer to a `source`. Layers take the data that they get from a source, optionally filter features, and then define how those features are styled.

```json
"layers": [
  {
    "id": "water",
    "source": "nb-streets",
    "source-layer": "water",
    "type": "fill",
    "paint": {
      "fill-color": "#00ffff",
    },
  },
]
```

## Layer properties

### filter

_Optional [expression](/maps/web-maps-sdk-v2/style-specification/expressions)_.

An expression specifying conditions of source features. Only features that match the filter are displayed. Zoom expressions in filters are only evaluated at integer zoom levels. The `feature-state` expression is not supported in filter expressions.

### id

_Required [string](/maps/web-maps-sdk-v2/style-specification/types#string)_.

Unique layer name.

### layout

_Optional [layout](/maps/web-maps-sdk-v2/style-specification/layers#layout-property)._

Layout properties for the layer.

### maxzoom

_Optional [number](/maps/web-maps-sdk-v2/style-specification/types#number) between 0 and 24 inclusive_.

The maximum zoom level for the layer. At zoom levels equal to or greater than the maxzoom, the layer will be hidden. Please note the maxzoom specified should belong to \[0, 24\].

### metadata

_Optional [object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)_.

Arbitrary properties useful to track with the layer, but do not influence rendering. Properties should be prefixed to avoid collisions, like 'nb:'.

### minzoom

_Optional [number](/maps/web-maps-sdk-v2/style-specification/types#number) between 0 and 24 inclusive_.

The minimum zoom level for the layer. At zoom levels less than the minzoom, the layer will be hidden. Please note the minzoom specified should belong to \[0, 24\].

### paint

_Optional [paint](/maps/web-maps-sdk-v2/style-specification/layers#paint-property)_.

Default paint properties for this layer.

### source

_Optional [string](/maps/web-maps-sdk-v2/style-specification/types#string)_.

Name of a source description to be used for this layer. Required for all layer types except `background`.

### source-layer

_Optional [string](/maps/web-maps-sdk-v2/style-specification/types#string)_.

Layer to use from a vector tile source. Required for vector tile sources; prohibited for all other source types, including GeoJSON sources.

### type

_Required [enum](/maps/web-maps-sdk-v2/style-specification/types#enum)._

Rendering type of this layer. Should belong to one of the following:

- `fill`: A filled polygon with an optional stroked border
- `line`: A stroked line
- `symbol`: An icon or a text label
- `circle`: A filled circle
- `heatmap`: A heatmap
- `fill-extrusion`: An extruded 3D polygon
- `raster`: Raster map textures such as satellite imagery
- `hillshade`: Client-side hillshading visualization based on DEM data. Currently, the implementation only supports Mapbox Terrain RGB and Mapzen terrarium tiles.
- `background`: The background color or pattern of the map.

Layers have two sub-properties that determine how data from that layer is rendered: `layout` and `paint` properties.

1.  **Layout properties** appear in the layer's `layout` object. They are applied early in the rendering process and define how data for that layer is passed to the GPU. Changes to a [layout](/maps/web-maps-sdk-v2/style-specification/layers#layout-property) property require an asynchronous "layout" step.
2.  **Paint properties** are applied later in the rendering process. Paint properties appear in the layer's "paint" object. Changes to a [Paint](/maps/web-maps-sdk-v2/style-specification/layers#paint-property) Property are cheap and happen synchronously.

Let’s take a look at the various attributes available for these properties.

## background

The `background` style layer covers the entire map. Use a background style layer to configure a color or pattern to show below all other map content. If the background layer is transparent or omitted from the style, any part of the map view that does not show another style layer is transparent.

### background-color

_[Paint](/maps/web-maps-sdk-v2/style-specification/layers#paint-property) Property. Optional [color](/maps/web-maps-sdk-v2/style-specification/types#color). Defaults to "#000000"._

The color with which the background will be drawn.

It can be disabled by `background-pattern`. Supports interpolate expressions. Transitionable.

### background-opacity

_[Paint](/maps/web-maps-sdk-v2/style-specification/layers#paint-property) Property. Optional [number](/maps/web-maps-sdk-v2/style-specification/types#number). Defaults to 1_. The opacity at which the background will be drawn. Please note the provided values should belong to \[0,1\]. Supports interpolate expressions. Transitionable.

### background-pattern

_[Paint](/maps/web-maps-sdk-v2/style-specification/layers#paint-property) Property. Optional [resolvedImage](/maps/web-maps-sdk-v2/style-specification/types#resolvedImage)._

Name of image in sprite to use for drawing an image background. For seamless patterns, image width and height must be a factor of two (2, 4, 8, ..., 512). Note that zoom-dependent expressions will be evaluated only at integer zoom levels. It is of resolvedImage type. Transitionable.

### visibility

_[Layout](/maps/web-maps-sdk-v2/style-specification/layers#layout-property) property. Optional [enum](/maps/web-maps-sdk-v2/style-specification/types#enum). One of "visible", "none". Defaults to "visible"._

Determines if the layer is displayed. It can be of two types:

- `visible`: This layer is shown
- `none`: This layer is not shown

## fill

A fill style layer renders one or more filled (and optionally stroked) polygons on a map. You can use a fill layer to configure the visual appearance of polygon or multipolygon features.

### fill-antialias

_[Paint](/maps/web-maps-sdk-v2/style-specification/layers#paint-property) Property. Optional [boolean](/maps/web-maps-sdk-v2/style-specification/types#boolean). Default: true_.

Whether or not the fill should be antialiased.

### fill-color

_[Paint](/maps/web-maps-sdk-v2/style-specification/layers#paint-property) Property. Optional [color](/maps/web-maps-sdk-v2/style-specification/types#color). Defaults to "#000000"._

The color of the filled part of this layer. This color can be specified as `rgba` with an alpha component and the color's opacity will not affect the opacity of the 1px stroke, if it is used.

It can be disabled by `fill-pattern`. Supports [feature-state](/maps/web-maps-sdk-v2/style-specification/expressions#feature-state) and interpolate expressions. Transitionable.

### fill-opacity

_[Paint](/maps/web-maps-sdk-v2/style-specification/layers#paint-property) Property. Optional [number](/maps/web-maps-sdk-v2/style-specification/types#number).Defaults to 1._

The opacity of the entire fill layer. In contrast to the `fill-color`, this value will also affect the 1px stroke around the fill, if the stroke is used.

Should always belong to \[0,1\]. Supports [feature-state](/maps/web-maps-sdk-v2/style-specification/expressions#feature-state) and interpolate expressions. Transitionable.

### fill-outline-color

_[Paint](/maps/web-maps-sdk-v2/style-specification/layers#paint-property) Property. Optional [color](/maps/web-maps-sdk-v2/style-specification/types#color)._

The outline color of the fill. Matches the value of `fill-color` if unspecified.

Requires `fill-antialias` to be true to be effective. It can be disabled by `fill-pattern`. Supports [feature-state](/maps/web-maps-sdk-v2/style-specification/expressions#feature-state) and interpolate expressions. Transitionable.

### fill-pattern

_[Paint](/maps/web-maps-sdk-v2/style-specification/layers#paint-property) Property. Optional [resolvedImage](/maps/web-maps-sdk-v2/style-specification/types#resolvedImage)._

Name of image in sprite to use for drawing an image background. For seamless patterns, image width and height must be a factor of two (2, 4, 8, ..., 512). Note that zoom-dependent expressions will be evaluated only at integer zoom levels. It is of resolvedImage type. Transitionable.

### fill-sort-key

_[Layout](/maps/web-maps-sdk-v2/style-specification/layers#layout-property) property. Optional [number](/maps/web-maps-sdk-v2/style-specification/types#number)._

Sorts features in ascending order based on this value. Features with a higher sort key will appear above features with a lower sort key.

### fill-translate

_[Paint](/maps/web-maps-sdk-v2/style-specification/layers#paint-property) Property. Optional [array](/maps/web-maps-sdk-v2/style-specification/types#array) of [numbers](/maps/web-maps-sdk-v2/style-specification/types#number). Units in pixels. Defaults to \[0,0\]_.

The geometry's offset. Values are \[x, y\] where negatives indicate left and up, respectively. Its unit is pixel. Supports interpolate expressions. Transitionable.

### fill-translate-anchor

_[Paint](/maps/web-maps-sdk-v2/style-specification/layers#paint-property) Property. Optional [enum](/maps/web-maps-sdk-v2/style-specification/types#enum).Defaults to "map"_.

Controls the frame of reference for fill-translate. Requires `fill-translate` to be specified. It supports two values:

- `map`: The fill is translated relative to the map.
- `viewport`: The fill is translated relative to the viewport.

### visibility

_[Layout](/maps/web-maps-sdk-v2/style-specification/layers#layout-property) property. Optional [enum](/maps/web-maps-sdk-v2/style-specification/types#enum). Defaults to "visible"._ Determines if the layer is displayed. It can be of two types:

- `visible`: This layer is shown
- `none`: This layer is not shown

## line

A `line` style layer renders one or more stroked polylines on the map. You can use a line layer to configure the visual appearance of polyline or multipolyline features.

### line-blur

_[Paint](/maps/web-maps-sdk-v2/style-specification/layers#paint-property) Property. Optional [number](/maps/web-maps-sdk-v2/style-specification/types#number) greater than or equal to 0. Units in pixels. Defaults to 0._

Blur applied to the line, in pixels. The number provided should be greater than 0. Supports feature-state and interpolate expressions. Transitionable.

### line-cap

_[Layout](/maps/web-maps-sdk-v2/style-specification/layers#layout-property) property. Optional [enum](/maps/web-maps-sdk-v2/style-specification/types#enum). One of "butt", "round", "square". Defaults to "butt"._

The display of line endings. It has 3 values:

- `butt`: A cap with a squared-off end which is drawn to the exact endpoint of the line.
- `round`: A cap with a rounded end which is drawn beyond the endpoint of the line at a radius of one-half of the line's width and centered on the endpoint of the line.
- `square`: A cap with a squared-off end which is drawn beyond the endpoint of the line at a distance of one-half of the line's width.

### line-color

_[Paint](/maps/web-maps-sdk-v2/style-specification/layers#paint-property) Property. Optional [color](/maps/web-maps-sdk-v2/style-specification/types#color). Defaults to "#000000"._

The color with which the line will be drawn. It can be disabled by `line-pattern`. Supports feature-state and interpolate expressions. Transitionable.

### line-dasharray

_[Paint](/maps/web-maps-sdk-v2/style-specification/layers#paint-property) Property. Optional [array](/maps/web-maps-sdk-v2/style-specification/types#array) of [numbers](/maps/web-maps-sdk-v2/style-specification/types#number) greater than or equal to 0. Units in line widths._

Specifies the lengths of the alternating dashes and gaps that form the dash pattern. The lengths are later scaled by the line width. To convert a dash length to pixels, multiply the length by the current line width. Note that GeoJSON sources with `lineMetrics: true` specified won't render dashed lines to the expected scale.

Please use values greater than or equal to 0. The unit for `line-dasharray` is _line-widths_. `line-dasharray` can be disabled by `line-pattern`. Also, note that zoom-dependent expressions will be evaluated only at integer zoom levels. Transitionable.

### line-gap-width

_[Paint](/maps/web-maps-sdk-v2/style-specification/layers#paint-property) Property. Optional [number](/maps/web-maps-sdk-v2/style-specification/types#number). Defaults to 0._

Draws a line casing outside of a line's actual path. Value indicates the width of the inner gap. It has to be a value greater than or equal to 0. Its unit is pixel. Supports feature-state and interpolate expressions. Transitionable.

### line-gradient

_[Paint](/maps/web-maps-sdk-v2/style-specification/layers#paint-property) Property. Optional [color](/maps/web-maps-sdk-v2/style-specification/types#color)._

Defines a gradient with which to color a line feature. Can only be used with GeoJSON sources that specify "lineMetrics": true. It can be disabled by `line-dasharray` and by`line-pattern`. Supports interpolate expressions.

### line-join

_[Layout](/maps/web-maps-sdk-v2/style-specification/layers#layout-property) property. Optional [enum](/maps/web-maps-sdk-v2/style-specification/types#enum). One of "bevel", "round", "miter". Defaults to "miter"._

The display of lines when joining. It has 3 values:

- `bevel`: A join with a squared-off end which is drawn beyond the endpoint of the line at a distance of one-half of the line's width.
- `round`: A join with a rounded end which is drawn beyond the endpoint of the line at a radius of one-half of the line's width and centered on the endpoint of the line.
- `miter`: A join with a sharp, angled corner which is drawn with the outer sides beyond the endpoint of the path until they meet.

### line-miter-limit

_[Layout](/maps/web-maps-sdk-v2/style-specification/layers#layout-property) property. Optional [number](/maps/web-maps-sdk-v2/style-specification/types#number). Defaults to 2._

Used to automatically convert miter joins to bevel joins for sharp angles. This parameter is effective only when the `line-join:miter`. Supports interpolate expressions.

### line-offset

_[Paint](/maps/web-maps-sdk-v2/style-specification/layers#paint-property) Property. Optional [number](/maps/web-maps-sdk-v2/style-specification/types#number). Units in pixels. Defaults to 0._

The line's offset, in pixel. For linear features, a positive value offsets the line to the right, relative to the direction of the line, and a negative value to the left. For polygon features, a positive value results in an inset, and a negative value results in an outset.

Supports feature-state and interpolate expressions. Transitionable.

### line-opacity

_[Paint](/maps/web-maps-sdk-v2/style-specification/layers#paint-property) Property. Optional [number](/maps/web-maps-sdk-v2/style-specification/types#number) between 0 and 1 inclusive. Defaults to 1._

The opacity at which the line will be drawn. Please note that only values belonging to \[0,1\] are valid.

Supports feature-state and interpolate expressions. Transitionable.

### line-pattern

_[Paint](/maps/web-maps-sdk-v2/style-specification/layers#paint-property) Property. Optional [resolvedImage](/maps/web-maps-sdk-v2/style-specification/types#resolvedImage)._

Name of image in sprite to use for drawing an image background. For seamless patterns, image width and height must be a factor of two (2, 4, 8, ..., 512). Note that zoom-dependent expressions will be evaluated only at integer zoom levels. It is of resolvedImage type. Transitionable.

### line-round-limit

_[Layout](/maps/web-maps-sdk-v2/style-specification/layers#layout-property) property. Optional [number](/maps/web-maps-sdk-v2/style-specification/types#number). Defaults to 1.05._

Used to automatically convert round joins to miter joins for shallow angles. Please note this is effective only when `line-join:round`. Supports interpolate expressions.

### line-sort-key

_[Layout](/maps/web-maps-sdk-v2/style-specification/layers#layout-property) property. Optional [number](/maps/web-maps-sdk-v2/style-specification/types#number)._ Sorts features in ascending order based on this value. Features with a higher sort key will appear above features with a lower sort key.

### line-translate

_[Paint](/maps/web-maps-sdk-v2/style-specification/layers#paint-property) Property. Optional [array](/maps/web-maps-sdk-v2/style-specification/types#array) of [numbers](/maps/web-maps-sdk-v2/style-specification/types#number). Units in pixels. Defaults to \[0,0\]._

The geometry's offset. Values are \[x, y\] where negatives indicate left and up, respectively. Its unit is pixel.

Supports interpolate expressions. Transitionable.

### line-translate-anchor

[Paint](/maps/web-maps-sdk-v2/style-specification/layers#paint-property) Property. Optional [enum](/maps/web-maps-sdk-v2/style-specification/types#enum). One of "map", "viewport". Defaults to "map".

Controls the frame of reference for `line-translate`. Effective only when `line-translate` is available. It supports two values:

- `map`: The line is translated relative to the map.
- `viewport`: The line is translated relative to the viewport.

### line-width

_[Paint](/maps/web-maps-sdk-v2/style-specification/layers#paint-property) Property. Optional [number](/maps/web-maps-sdk-v2/style-specification/types#number) greater than or equal to 0. Defaults to 1._

Stroke thickness, in pixels. Accepts any value greater than or equal to 0. Supports feature-state and interpolate expressions. Transitionable.

### visibility

_[Layout](/maps/web-maps-sdk-v2/style-specification/layers#layout-property) property. Optional [enum](/maps/web-maps-sdk-v2/style-specification/types#enum). One of "visible", "none". Defaults to "visible"._

Determines if the layer is displayed. It can be of two types:

- `visible`: This layer is shown
- `none`: This layer is not shown

## symbol

A `symbol` style layer renders icon and text labels at points or along lines on a map. You can use a symbol layer to configure the visual appearance of labels for features in vector tiles.

### icon-allow-overlap

_[Layout](/maps/web-maps-sdk-v2/style-specification/layers#layout-property) property. Optional [boolean](/maps/web-maps-sdk-v2/style-specification/types#boolean). Defaults to false._

If true, the icon will be visible even if it collides with other previously drawn symbols. Needs `icon-image` to be effective.

### icon-anchor

_[Layout](/maps/web-maps-sdk-v2/style-specification/layers#layout-property) property. Optional [enum](/maps/web-maps-sdk-v2/style-specification/types#enum). One of "center", "left", "right", "top", "bottom", "top-left", "top-right", "bottom-left", "bottom-right". Defaults to "center"._

Determines the position of the icon with respect to the anchor. Needs `icon-image` to be effective. It supports following values:

- `center`: The center of the icon is placed closest to the anchor.
- `left`: The left side of the icon is placed closest to the anchor.
- `right`: The right side of the icon is placed closest to the anchor.
- `top`: The top of the icon is placed closest to the anchor.
- `bottom`: The bottom of the icon is placed closest to the anchor.
- `top-left`: The top left corner of the icon is placed closest to the anchor.
- `top-right`: The top right corner of the icon is placed closest to the anchor.
- `bottom-left`: The bottom left corner of the icon is placed closest to the anchor.
- `bottom-right`: The bottom right corner of the icon is placed closest to the anchor.

### icon-color

_[Paint](/maps/web-maps-sdk-v2/style-specification/layers#paint-property) Property. Optional [color](/maps/web-maps-sdk-v2/style-specification/types#color). Defaults to "#000000"._

The color of the icon. This can only be used with sdf icons. Needs `icon-image` to be effective.

Supports feature-state and interpolate expressions. Transitionable.

### icon-halo-blur

_[Paint](/maps/web-maps-sdk-v2/style-specification/layers#paint-property) Property. Optional [number](/maps/web-maps-sdk-v2/style-specification/types#number) greater than or equal to 0. Defaults to 0._

Fade out the halo towards the outside. Accepts any value greater than or equal to 0. Its unit is pixel. Needs `icon-image` to be effective.

Supports feature-state and interpolate expressions. Transitionable.

### icon-halo-color

_[Paint](/maps/web-maps-sdk-v2/style-specification/layers#paint-property) Property. Optional [color](/maps/web-maps-sdk-v2/style-specification/types#color). Defaults to "rgba(0, 0, 0, 0)"._

The color of the icon's halo. Icon halos can only be used with SDF icons. Needs `icon-image` to be effective.

Supports feature-state and interpolate expressions. Transitionable.

### icon-halo-width

_[Paint](/maps/web-maps-sdk-v2/style-specification/layers#paint-property) Property. Optional [number](/maps/web-maps-sdk-v2/style-specification/types#number) greater than or equal to 0. Defaults to 0._

Distance of halo to the icon outline. Accepts any value greater than or equal to 0. Its unit is pixel. Needs `icon-image` to be effective.

Supports feature-state and interpolate expressions. Transitionable.

### icon-ignore-placement

_[Layout](/maps/web-maps-sdk-v2/style-specification/layers#layout-property) property. Optional [boolean](/maps/web-maps-sdk-v2/style-specification/types#boolean). Defaults to false._

If true, other symbols can be visible even if they collide with the icon. Needs `icon-image` to be effective.

### icon-image

_[Layout](/maps/web-maps-sdk-v2/style-specification/layers#layout-property) property. Optional [resolvedImage](/maps/web-maps-sdk-v2/style-specification/types#resolvedImage)._

Name of image in sprite to use for drawing an image background.

### icon-keep-upright

_[Layout](/maps/web-maps-sdk-v2/style-specification/layers#layout-property) property. Optional [boolean](/maps/web-maps-sdk-v2/style-specification/types#boolean). Defaults to false._

If true, the icon may be flipped to prevent it from being rendered upside-down. It needs following parameters to be effective:

- `icon-image` should be available
- `icon-rotation-alignment` should be `map`.
- `symbol-placement` should be `line` or `line-center`.

### icon-offset

_[Layout](/maps/web-maps-sdk-v2/style-specification/layers#layout-property) property. Optional [array](/maps/web-maps-sdk-v2/style-specification/types#array) of [numbers](/maps/web-maps-sdk-v2/style-specification/types#number). Defaults to \[0,0\]._ Offset distance of icon from its anchor. Positive values indicate right and down, while negative values indicate left and up. Each component is multiplied by the value of `icon-size` to obtain the final offset in pixels. When combined with `icon-rotate` the offset will be as if the rotated direction was up.

Needs `icon-image` to be effective. Supports interpolate expressions.

### icon-opacity

_[Paint](/maps/web-maps-sdk-v2/style-specification/layers#paint-property) Property. Optional [number](/maps/web-maps-sdk-v2/style-specification/types#number) between 0 and 1 inclusive. Defaults to 1._

The opacity at which the icon will be drawn. It should belong to \[0,1\].

Needs `icon-image` to be available. Supports feature-state and interpolate expressions. Transitionable.

### icon-optional

_[Layout](/maps/web-maps-sdk-v2/style-specification/layers#layout-property) property. Optional [boolean](/maps/web-maps-sdk-v2/style-specification/types#boolean). Defaults to false._

If true, text will display without their corresponding icons when the icon collides with other symbols and the text does not. It requires `icon-image` and `text-field` to be available.

### icon-padding

_[Layout](/maps/web-maps-sdk-v2/style-specification/layers#layout-property) property. Optional [number](/maps/web-maps-sdk-v2/style-specification/types#number) greater than or equal to 0. Units in pixels. Defaults to 2._

Size of the additional area around the icon bounding box used for detecting symbol collisions. It should be a number greater than or equal to 0, and its unit is pixel.

Needs `icon-image` to be available. Supports interpolate expressions.

### icon-pitch-alignment

_[Layout](/maps/web-maps-sdk-v2/style-specification/layers#layout-property) property. Optional [enum](/maps/web-maps-sdk-v2/style-specification/types#enum). One of "map", "viewport", "auto". Defaults to "auto"._

Orientation of the icon when the map is pitched. It needs `icon-image` to be available. It can be of three types:

- `map`: The icon is aligned to the plane of the map.
- `viewport`: The icon is aligned to the plane of the viewport.
- `auto`: Automatically matches the value of `icon-rotation-alignment`.

### icon-rotate

_[Layout](/maps/web-maps-sdk-v2/style-specification/layers#layout-property) property. Optional [number](/maps/web-maps-sdk-v2/style-specification/types#number). Units in degrees. Defaults to 0._

Specify the degrees by which to rotate the icon in clockwise direction. It needs `icon-image` to be available.

### icon-rotation-alignment

_[Layout](/maps/web-maps-sdk-v2/style-specification/layers#layout-property) property. Optional [enum](/maps/web-maps-sdk-v2/style-specification/types#enum). One of "map", "viewport", "auto". Defaults to "auto"._

In combination with `symbol-placement`, it determines the rotation behavior of icons. It needs `icon-image` to be available. It can be of three types:

- `map`: When `symbol-placement` is set to _point_, aligns the icon east-west. When `symbol-placement` is set to _line_ or _line-center_, aligns icon’s x-axes with the line
- `viewport`: Produces icons whose x-axes are aligned with the x-axis of the viewport, regardless of the value of `symbol-placement`.
- `auto`: When `symbol-placement` is set to _point_, this is equivalent to _viewport_. When `symbol-placement` is set to _line_ or _line-center_, this is equivalent to _map_.

### icon-size

_[Layout](/maps/web-maps-sdk-v2/style-specification/layers#layout-property) property. Optional [number](/maps/web-maps-sdk-v2/style-specification/types#number) greater than or equal to 0. Defaults to 1._

Scales the original size of the icon by the provided factor. The new pixel size of the image will be the original pixel size multiplied by `icon-size`. For example, 1 is the original size; 3 triples the size of the image.

Needs `icon-image` to be effective. Supports interpolate expressions.

### icon-text-fit

_[Layout](/maps/web-maps-sdk-v2/style-specification/layers#layout-property) property. Optional [enum](/maps/web-maps-sdk-v2/style-specification/types#enum). One of "none", "width", "height", "both". Defaults to "none"._

Scales the icon to fit around the associated text. It needs `icon-image` and `text-field` to be available. It can be of four types:

- `width`: The icon is scaled in the x-dimension to fit the width of the text.
- `height`: The icon is scaled in the y-dimension to fit the height of the text.
- `both`: The icon is scaled in both x- and y-dimensions.
- `none`: The icon is displayed at its intrinsic aspect ratio.

### icon-text-fit-padding

_[Layout](/maps/web-maps-sdk-v2/style-specification/layers#layout-property) property. Optional [array](/maps/web-maps-sdk-v2/style-specification/types#array) of [numbers](/maps/web-maps-sdk-v2/style-specification/types#number). Defaults to \[0,0,0,0\]._

Size of the additional area added to dimensions determined by `icon-text-fit`, in clockwise order: top, right, bottom, left. Its unit is pixel. In order to be effective, it needs:

- `icon-image` to be available
- `text-field` to be available
- `icon-text-fit` to be set to any one of `both`, `width` or `height`.

### icon-translate

_[Paint](/maps/web-maps-sdk-v2/style-specification/layers#paint-property) Property. Optional [array](/maps/web-maps-sdk-v2/style-specification/types#array) of [numbers](/maps/web-maps-sdk-v2/style-specification/types#number). Defaults to \[0,0\]._

Distance that the icon's anchor is moved from its original placement. Positive values indicate right and down, while negative values indicate left and up. Its unit is pixel. It needs `icon-image` to be available to be effective.

Supports interpolate expressions. Transitionable.

### icon-translate-anchor

_[Paint](/maps/web-maps-sdk-v2/style-specification/layers#paint-property) Property. Optional [enum](/maps/web-maps-sdk-v2/style-specification/types#enum). One of "map", "viewport". Defaults to "map"._

Controls the frame of reference for `icon-translate`. Effective only when `icon-image` and `icon-translate` are available. It supports two values:

- `map`: Icons are translated relative to the map.
- `viewport`: Icons are translated relative to the viewport.

### symbol-avoid-edges

_[Layout](/maps/web-maps-sdk-v2/style-specification/layers#layout-property) property. Optional [boolean](/maps/web-maps-sdk-v2/style-specification/types#boolean). Defaults to false._

If true, the symbols will not cross tile edges to avoid mutual collisions. Recommended in layers that don't have enough padding in the vector tile to prevent collisions, or if it is a point symbol layer placed after a line symbol layer. When using a client that supports global collision detection, like nb GL JS version 0.42.0 or greater, enabling this property is not needed to prevent clipped labels at tile boundaries.

### symbol-placement

_[Layout](/maps/web-maps-sdk-v2/style-specification/layers#layout-property) property. Optional [enum](/maps/web-maps-sdk-v2/style-specification/types#enum). One of "point", "line", "line-center". Defaults to "point"._

Label placement relative to its geometry. t supports three values:

- `point`: The label is placed at the point where the geometry is located.
- `line`: The label is placed along the line of the geometry. Can only be used on _LineString_ and _Polygon_ geometries.
- `line-center`: The label is placed at the center of the line of the geometry. Can only be used on _LineString_ and _Polygon_ geometries. Note that a single feature in a vector tile may contain multiple line geometries.

### symbol-sort-key

_[Layout](/maps/web-maps-sdk-v2/style-specification/layers#layout-property) property. Optional [number](/maps/web-maps-sdk-v2/style-specification/types#number)._

Sorts features in ascending order based on this value. Features with a higher sort key will appear above features with a lower sort key when they overlap. Features with a lower sort key will have priority over other features when doing placement.

### symbol-spacing

_[Layout](/maps/web-maps-sdk-v2/style-specification/layers#layout-property) property. Optional [number](/maps/web-maps-sdk-v2/style-specification/types#number) greater than or equal to 1. Defaults to 250._

Distance between two symbol anchors. It is a number greater than or equal to 1 and its unit is pixel.

Needs `symbol-placement` to be set to _line_. Supports interpolate expressions.

### symbol-z-order

_[Layout](/maps/web-maps-sdk-v2/style-specification/layers#layout-property) property. Optional [enum](/maps/web-maps-sdk-v2/style-specification/types#enum). One of "auto", "viewport-y", "source". Defaults to "auto"._

Controls the order in which overlapping symbols in the same layer are rendered. It can be of three types:

- `auto`: If `symbol-sort-key` is set, sort based on that. Otherwise sort symbols by their y-position relative to the viewport.
- `viewport-y`: Symbols will be sorted by their y-position relative to the viewport.
- `source`: Symbols will be rendered in the same order as the source data with no sorting applied.

### text-allow-overlap

_[Layout](/maps/web-maps-sdk-v2/style-specification/layers#layout-property) property. Optional [boolean](/maps/web-maps-sdk-v2/style-specification/types#boolean). Defaults to false._

If true, the text will be visible even if it collides with other previously drawn symbols. Needs `text-field` to be available.

### text-anchor

_[Layout](/maps/web-maps-sdk-v2/style-specification/layers#layout-property) property. Optional [enum](/maps/web-maps-sdk-v2/style-specification/types#enum). One of "center", "left", "right", "top", "bottom", "top-left", "top-right", "bottom-left", "bottom-right". Defaults to "center"._

Determines the Part of the text placed closest to the anchor. Please note this parameter requires `text-field` to be available and it can be disabled by `text-variable-anchor`. It supports the following values:

- `center`: The center of the text is placed closest to the anchor.
- `left`: The left side of the text is placed closest to the anchor.
- `right`: The right side of the text is placed closest to the anchor.
- `top`: The top of the text is placed closest to the anchor.
- `bottom`: The bottom of the text is placed closest to the anchor.
- `top-left`: The top left corner of the text is placed closest to the anchor.
- `top-right`: The top right corner of the text is placed closest to the anchor.
- `bottom-left`: The bottom left corner of the text is placed closest to the anchor.
- `bottom-right`: The bottom right corner of the text is placed closest to the anchor.

### text-color

_[Paint](/maps/web-maps-sdk-v2/style-specification/layers#paint-property) Property. Optional [color](/maps/web-maps-sdk-v2/style-specification/types#color). Defaults to "#000000"._

The color with which the text will be drawn.

Needs `text-field` to be available. Supports feature-state and interpolate expressions. Transitionable.

### text-field

_[Layout](/maps/web-maps-sdk-v2/style-specification/layers#layout-property) property. Optional [formatted](/maps/web-maps-sdk-v2/style-specification/types#formatted). Defaults to ""._

Value to use for a text label. If a _plain_ string is provided, it will be treated as a `formatted` with default/inherited formatting options.

### text-font

_[Layout](/maps/web-maps-sdk-v2/style-specification/layers#layout-property) property. Optional [array](/maps/web-maps-sdk-v2/style-specification/types#array) of [strings](/maps/web-maps-sdk-v2/style-specification/types#strings). Defaults to \["Open Sans Regular","Arial Unicode MS Regular"\]._

Font stack to use for displaying text. Needs `text-field` to be available.

### text-halo-blur

_[Paint](/maps/web-maps-sdk-v2/style-specification/layers#paint-property) Property. Optional [number](/maps/web-maps-sdk-v2/style-specification/types#number) greater than or equal to 0. Defaults to 0._

The halo's fadeout distance towards the outside. Its unit is _pixel_.

Needs `text-field` to be available. Supports feature-state and interpolate expressions. Transitionable.

### text-halo-color

_[Paint](/maps/web-maps-sdk-v2/style-specification/layers#paint-property) Property. Optional [color](/maps/web-maps-sdk-v2/style-specification/types#color). Defaults to "rgba(0, 0, 0, 0)"._

The color of the text's halo, which helps it stand out from backgrounds.

Needs `text-field` to be available. Supports feature-state and interpolate expressions. Transitionable.

### text-halo-width

_[Paint](/maps/web-maps-sdk-v2/style-specification/layers#paint-property) Property. Optional [number](/maps/web-maps-sdk-v2/style-specification/types#number). Defaults to 0._

Distance of halo to the font outline. Maximum text halo width is 1/4 of the font-size. It has to be a number greater than or equal to 0. Its unit is pixel.

Needs `text-field` to be available. Supports feature-state and interpolate expressions. Transitionable.

### text-ignore-placement

_[Layout](/maps/web-maps-sdk-v2/style-specification/layers#layout-property) property. Optional [boolean](/maps/web-maps-sdk-v2/style-specification/types#boolean). Defaults to false._

If true, other symbols can be visible even if they collide with the text. It needs `text-field` to be available.

### text-justify

_[Layout](/maps/web-maps-sdk-v2/style-specification/layers#layout-property) property. Optional [enum](/maps/web-maps-sdk-v2/style-specification/types#enum). One of "auto", "left", "center", "right". Defaults to "center"._

Text justification options. It needs `text-field` to be available. It supports four values:

- `auto`: The text is aligned towards the anchor position.
- `left`: The text is aligned to the left.
- `center`: The text is centered.
- `right`: The text is aligned to the right.

### text-keep-upright

_[Layout](/maps/web-maps-sdk-v2/style-specification/layers#layout-property) property. Optional [boolean](/maps/web-maps-sdk-v2/style-specification/types#boolean). Defaults to true._

If true, the text may be flipped vertically to prevent it from being rendered upside-down. It requires:

- `text-field` to be available
- `text-rotation-alignment` to be `map`
- `symbol-placement` to be either `line` or `line-center`

### text-letter-spacing

_[Layout](/maps/web-maps-sdk-v2/style-specification/layers#layout-property) property. Optional [number](/maps/web-maps-sdk-v2/style-specification/types#number). Units in ems. Defaults to 0._

Text tracking amount.Its unit is _ems_. It needs `text-field` to be available. Supports interpolate expressions.

### text-line-height

_[Layout](/maps/web-maps-sdk-v2/style-specification/layers#layout-property) property. Optional [number](/maps/web-maps-sdk-v2/style-specification/types#number). Units in ems. Defaults to 1.2._

Text leading value for multi-line text. Its unit is _ems_. It needs `text-field` to be available. Supports interpolate expressions.

### text-max-angle

_[Layout](/maps/web-maps-sdk-v2/style-specification/layers#layout-property) property. Optional [number](/maps/web-maps-sdk-v2/style-specification/types#number). Units in degrees. Defaults to 45._

Maximum angle change between adjacent characters. Its unit is _degrees_.

It needs `text-field` to be available and requires `symbol-placement` to be set to either `line` or `line-center`. Supports interpolate expressions.

### text-max-width

_[Layout](/maps/web-maps-sdk-v2/style-specification/layers#layout-property) property. Optional [number](/maps/web-maps-sdk-v2/style-specification/types#number). Defaults to 10._

The maximum line width for text wrapping. Its unit is _ems_. Please ensure to provide a value greater than or equal to 0.

It needs `text-field` to be available. Supports interpolate expressions.

### text-offset

_[Layout](/maps/web-maps-sdk-v2/style-specification/layers#layout-property) property. Optional [array](/maps/web-maps-sdk-v2/style-specification/types#array) of [numbers](/maps/web-maps-sdk-v2/style-specification/types#number). Units in ems. Defaults to \[0,0\]._

Offset distance of text from its anchor. Its unit is _ems_. Positive values indicate right and down, while negative values indicate left and up. If used with text-variable-anchor, input values will be taken as absolute values. Offsets along the x-axis and y-axis will be applied automatically based on the anchor position.

It needs `text-field` to be available and can be disabled by `text-radial-offset`. Supports interpolate expressions.

### text-opacity

_[Paint](/maps/web-maps-sdk-v2/style-specification/layers#paint-property) Property. Optional [number](/maps/web-maps-sdk-v2/style-specification/types#number) between 0 and 1 inclusive. Defaults to 1._

The opacity at which the text will be drawn. Please note that only values belonging to \[0,1\] are valid.

Needs `text-field` to be available. Supports feature-state and interpolate expressions. Transitionable

### text-optional

_[Layout](/maps/web-maps-sdk-v2/style-specification/layers#layout-property) property. Optional [boolean](/maps/web-maps-sdk-v2/style-specification/types#boolean). Defaults to false._

If true, icons will display without their corresponding text when the text collides with other symbols and the icon does not. It requires `text-field` and `icon-image` to be available.

### text-padding

_[Layout](/maps/web-maps-sdk-v2/style-specification/layers#layout-property) property. Optional [number](/maps/web-maps-sdk-v2/style-specification/types#number) greater than or equal to 0. Units in pixels. Defaults to 2._

Size of the additional area around the text bounding box used for detecting symbol collisions. It has to be a value greater than or equal to 0 and its unit is pixel.

Needs `text-field` to be available. Supports interpolate expressions.

### text-pitch-alignment

_[Layout](/maps/web-maps-sdk-v2/style-specification/layers#layout-property) property. Optional [enum](/maps/web-maps-sdk-v2/style-specification/types#enum). One of "map", "viewport", "auto". Defaults to "auto"._

Orientation of text when map is pitched. Needs `text-field` to be available. It can be of three types:

- `auto`: Automatically matches the value of `text-rotation-alignment`.
- `viewport`: The text is aligned to the plane of the viewport.
- `map`: The text is aligned to the plane of the map.

### text-radial-offset

_[Layout](/maps/web-maps-sdk-v2/style-specification/layers#layout-property) property. Optional [number](/maps/web-maps-sdk-v2/style-specification/types#number). Units in ems. Defaults to 0._

Radial offset of text, in the direction of the symbol's anchor. Useful in combination with `text-variable-anchor`, which defaults to using the two-dimensional `text-offset`, if present. Its unit is _ems_.

Needs `text-field` to be available. Supports interpolate expressions.

### text-rotate

_[Layout](/maps/web-maps-sdk-v2/style-specification/layers#layout-property) property. Optional [number](/maps/web-maps-sdk-v2/style-specification/types#number). Units in degrees. Defaults to 0._

Rotates the text clockwise. Its unit is _degrees_.

Needs `text-field` to be available. Supports interpolate expressions.

### text-rotation-alignment

_[Layout](/maps/web-maps-sdk-v2/style-specification/layers#layout-property) property. Optional [enum](/maps/web-maps-sdk-v2/style-specification/types#enum). One of "map", "viewport", "auto". Defaults to "auto"._

In combination with `symbol-placement`, it determines the rotation behavior of the individual glyphs forming the text. It needs `text-field` to be available. It can be of three types:

- `map`: When `symbol-placement` is set to _point_, aligns text east-west. When `symbol-placement` is set to _line_ or _line-center_, aligns text x-axes with the line.
- `viewport`: Produces glyphs whose x-axes are aligned with the x-axis of the viewport, regardless of the value of `symbol-placement`.
- `auto`: When `symbol-placement` is set to _point_, this is equivalent to _viewport_. When `symbol-placement` is set to _line_ or _line-center_, this is equivalent to `map`.

### text-size

_[Layout](/maps/web-maps-sdk-v2/style-specification/layers#layout-property) property. Optional [number](/maps/web-maps-sdk-v2/style-specification/types#number) greater than or equal to 0. Units in pixels. Defaults to 16._

Font size. It should be a number greater than or equal to 0. Its unit is _pixel_.

It requires `text-field` to be available. Supports interpolate expressions.

### text-transform

_[Layout](/maps/web-maps-sdk-v2/style-specification/layers#layout-property) property. Optional [enum](/maps/web-maps-sdk-v2/style-specification/types#enum). One of "none", "uppercase", "lowercase". Defaults to "none"._

Specifies how to capitalize text, similar to the CSS text-transform property. It requires `text-field` to be available. It supports the following values:

- `none`: The text is not altered.
- `lowercase`: Forces all letters to be displayed in lowercase.
- `uppercase`: Forces all letters to be displayed in uppercase.

### text-translate

_[Paint](/maps/web-maps-sdk-v2/style-specification/layers#paint-property) Property. Optional [array](/maps/web-maps-sdk-v2/style-specification/types#array) of [numbers](/maps/web-maps-sdk-v2/style-specification/types#number). Units in pixels. Defaults to \[0,0\]._

Distance that the text's anchor is moved from its original placement. Positive values indicate right and down, while negative values indicate left and up.

Its unit is _pixel_. It requires `text-field` to be available. Supports interpolate expressions. Transitionable.

### text-translate-anchor

_[Paint](/maps/web-maps-sdk-v2/style-specification/layers#paint-property) Property. Optional [enum](/maps/web-maps-sdk-v2/style-specification/types#enum). One of "map", "viewport". Defaults to "map"._

Controls the frame of reference for `text-translate`. It requires `text-field` and `text-translate` to be available. It supports two values:

- `map`: The text is translated relative to the map.
- `viewport`: The text is translated relative to the viewport.

### text-variable-anchor

_[Layout](/maps/web-maps-sdk-v2/style-specification/layers#layout-property) property. Optional [array](/maps/web-maps-sdk-v2/style-specification/types#array) of [enums](/maps/web-maps-sdk-v2/style-specification/types#enum). One of "center", "left", "right", "top", "bottom", "top-left", "top-right", "bottom-left", "bottom-right"._

To increase the chance of placing high-priority labels on the map, you can provide an array of `text-anchor` locations: the renderer will attempt to place the label at each location, in order, before moving onto the next label. Use `text-justify: auto` to choose justification based on anchor position. To apply an offset, use the `text-radial-offset` or the two-dimensional `text-offset`. It supports the following values:

- `center`: The center of the text is placed closest to the anchor.
- `left`: The left side of the text is placed closest to the anchor.
- `right`: The right side of the text is placed closest to the anchor.
- `top`: The top of the text is placed closest to the anchor.
- `bottom`: The bottom of the text is placed closest to the anchor.
- `top-left`: The top left corner of the text is placed closest to the anchor.
- `top-right`: The top right corner of the text is placed closest to the anchor.
- `bottom-left`: The bottom left corner of the text is placed closest to the anchor.
- `bottom-right`: The bottom right corner of the text is placed closest to the anchor.

### text-writing-mode

_[Layout](/maps/web-maps-sdk-v2/style-specification/layers#layout-property) property. Optional [array](/maps/web-maps-sdk-v2/style-specification/types#array) of [enums](/maps/web-maps-sdk-v2/style-specification/types#enum). One of "horizontal", "vertical"._

The property allows control over a symbol's orientation. Note that the property values act as a hint, so that a symbol whose language doesn’t support the provided orientation will be laid out in its natural orientation. Example: English point symbol will be rendered horizontally even if the array value contains a single 'vertical' enum value. The order of elements in an array defines priority order for the placement of an orientation variant. It support two values:

- `horizontal`: If a text's language supports horizontal writing mode, symbols with point placement would be laid out horizontally.
- `vertical`: If a text's language supports vertical writing mode, symbols with point placement would be laid out vertically.

### visibility

_[Layout](/maps/web-maps-sdk-v2/style-specification/layers#layout-property) property. Optional [enum](/maps/web-maps-sdk-v2/style-specification/types#enum). One of "visible", "none". Defaults to "visible"._

Determines if the layer is displayed. It can be of two types:

- `visible`: This layer is shown
- `none`: This layer is not shown

## raster

A `raster` style layer renders raster tiles on a map. You can use a raster layer to configure the color parameters of raster tiles.

### raster-brightness-max

_[Paint](/maps/web-maps-sdk-v2/style-specification/layers#paint-property) Property. Optional [number](/maps/web-maps-sdk-v2/style-specification/types#number) between 0 and 1 inclusive. Defaults to 1._

Increase or reduce the brightness of the image. The value is the maximum brightness. It should be a number belonging to \[0, 1\]. Supports interpolate expressions. Transitionable.

### raster-brightness-min

_[Paint](/maps/web-maps-sdk-v2/style-specification/layers#paint-property) Property. Optional [number](/maps/web-maps-sdk-v2/style-specification/types#number) between 0 and 1 inclusive. Defaults to 0._

Increase or reduce the brightness of the image. The value is the minimum brightness. It should be a number belonging to \[0, 1\]. Supports interpolate expressions. Transitionable.

### raster-contrast

_[Paint](/maps/web-maps-sdk-v2/style-specification/layers#paint-property) Property. Optional [number](/maps/web-maps-sdk-v2/style-specification/types#number) between -1 and 1 inclusive. Defaults to 0._

Increase or reduce the contrast of the image. It should be a number belonging to \[-1, 1\]. Supports interpolate expressions. Transitionable.

### raster-fade-duration

_[Paint](/maps/web-maps-sdk-v2/style-specification/layers#paint-property) Property. Optional [number](/maps/web-maps-sdk-v2/style-specification/types#number) greater than or equal to 0. Units in milliseconds. Defaults to 300._

Fade duration when a new tile is added. Its unit is _milliseconds_. It should be a value greater than or equal to 0. Supports interpolate expressions.

### raster-hue-rotate

_[Paint](/maps/web-maps-sdk-v2/style-specification/layers#paint-property) Property. Optional [number](/maps/web-maps-sdk-v2/style-specification/types#number). Units in degrees. Defaults to 0._

Rotates hues around the color wheel. Its unit is _degrees_.

Supports interpolate expressions. Transitionable.

### raster-opacity

_[Paint](/maps/web-maps-sdk-v2/style-specification/layers#paint-property) Property. Optional [number](/maps/web-maps-sdk-v2/style-specification/types#number) between 0 and 1 inclusive. Defaults to 1._

The opacity at which the image will be drawn. It should be a number belonging to \[0, 1\].

Supports interpolate expressions. Transitionable.

### raster-resampling

_[Paint](/maps/web-maps-sdk-v2/style-specification/layers#paint-property) Property. Optional [enum](/maps/web-maps-sdk-v2/style-specification/types#enum). One of "linear", "nearest". Defaults to "linear"._

The resampling/interpolation method to use for overscaling, also known as texture magnification filter. It supports following values:

- `liner`: (Bi)linear filtering interpolates pixel values using the weighted average of the four closest original source pixels creating a smooth but blurry look when overscaled
- `nearest`: Nearest neighbor filtering interpolates pixel values using the nearest original source pixel creating a sharp but pixelated look when overscaled

### raster-saturation

_[Paint](/maps/web-maps-sdk-v2/style-specification/layers#paint-property) Property. Optional [number](/maps/web-maps-sdk-v2/style-specification/types#number) between -1 and 1 inclusive. Defaults to 0._

Increase or reduce the saturation of the image. It should be a number belonging to \[-1, 1\].

Supports interpolate expressions. Transitionable.

### visibility

_[Layout](/maps/web-maps-sdk-v2/style-specification/layers#layout-property) property. Optional [enum](/maps/web-maps-sdk-v2/style-specification/types#enum). One of "visible", "none". Defaults to "visible"._

Determines if the layer is displayed. It can be of two types:

- `visible`: This layer is shown
- `none`: This layer is not shown

## circle

A `circle` style layer renders one or more filled circles on a map. You can use a circle layer to configure the visual appearance of point or point collection features in vector tiles. A circle layer renders circles whose radii are measured in screen units.

### circle-blur

_[Paint](/maps/web-maps-sdk-v2/style-specification/layers#paint-property) Property. Optional [number](/maps/web-maps-sdk-v2/style-specification/types#number). Defaults to 0._

Amount to blur the circle. 1 blurs the circle such that only the centerpoint is full opacity.

Supports feature-state and interpolate expressions. Transitionable.

### circle-color

_[Paint](/maps/web-maps-sdk-v2/style-specification/layers#paint-property) Property. Optional [color](/maps/web-maps-sdk-v2/style-specification/types#color). Defaults to "#000000"._

The fill color of the circle. Supports feature-state and interpolate expressions. Transitionable.

### circle-opacity

_[Paint](/maps/web-maps-sdk-v2/style-specification/layers#paint-property) Property. Optional [number](/maps/web-maps-sdk-v2/style-specification/types#number) between 0 and 1 inclusive. Defaults to 1._

The opacity at which the circle will be drawn. It should be a number belonging to \[0, 1\].

Supports feature-state and interpolate expressions. Transitionable.

### circle-pitch-alignment

_[Paint](/maps/web-maps-sdk-v2/style-specification/layers#paint-property) Property. Optional [enum](/maps/web-maps-sdk-v2/style-specification/types#enum). One of "map", "viewport". Defaults to "viewport"._

Orientation of the circle when the map is pitched. It supports two values:

- `map`: The circle is aligned to the plane of the map.
- `viewport`: The circle is aligned to the plane of the viewport.

### circle-pitch-scale

_[Paint](/maps/web-maps-sdk-v2/style-specification/layers#paint-property) Property. Optional [enum](/maps/web-maps-sdk-v2/style-specification/types#enum). One of "map", "viewport". Defaults to "map"._

Controls the scaling behavior of the circle when the map is pitched. It supports two values:

- `map`: Circles are scaled according to their apparent distance to the camera.
- `viewport`: Circles are not scaled.

### circle-radius

_[Paint](/maps/web-maps-sdk-v2/style-specification/layers#paint-property) Property. Optional [number](/maps/web-maps-sdk-v2/style-specification/types#number) greater than or equal to 0. Units in pixels. Defaults to 5._

Circle radius. It should be a number greater than or equal to 0. Its unit is _pixel_.

Supports feature-state and interpolate expressions. Transitionable.

### circle-sort-key

_[Layout](/maps/web-maps-sdk-v2/style-specification/layers#layout-property) property. Optional [number](/maps/web-maps-sdk-v2/style-specification/types#number)._

Sorts features in ascending order based on this value. Features with a higher sort key will appear above features with a lower sort key.

### circle-stroke-color

_[Paint](/maps/web-maps-sdk-v2/style-specification/layers#paint-property) Property. Optional [color](/maps/web-maps-sdk-v2/style-specification/types#color). Defaults to "#000000"._

The stroke color of the circle. Supports feature-state and interpolate expressions. Transitionable.

### circle-stroke-opacity

_[Paint](/maps/web-maps-sdk-v2/style-specification/layers#paint-property) Property. Optional [number](/maps/web-maps-sdk-v2/style-specification/types#number) between 0 and 1 inclusive. Defaults to 1._

The opacity of the circle's stroke. It should be a number belonging to \[0, 1\].

Supports feature-state and interpolate expressions. Transitionable.

### circle-stroke-width

_[Paint](/maps/web-maps-sdk-v2/style-specification/layers#paint-property) Property. Optional [number](/maps/web-maps-sdk-v2/style-specification/types#number) greater than or equal to 0. Units in pixels. Defaults to 0._

The width of the circle's stroke. Strokes are placed outside of the circle-radius. It should be a number greater than or equal to 0. Its unit is _pixel_.

Supports feature-state and interpolate expressions. Transitionable.

### circle-translate

_[Paint](/maps/web-maps-sdk-v2/style-specification/layers#paint-property) Property. Optional [array](/maps/web-maps-sdk-v2/style-specification/types#array) of [numbers](/maps/web-maps-sdk-v2/style-specification/types#number). Units in pixels. Defaults to \[0,0\]._

The geometry's offset. Values are \[x, y\] where negatives indicate left and up, respectively.

Its unit is _pixel_. Supports interpolate expressions. Transitionable.

### circle-translate-anchor

_[Paint](/maps/web-maps-sdk-v2/style-specification/layers#paint-property) Property. Optional [enum](/maps/web-maps-sdk-v2/style-specification/types#enum). One of "map", "viewport". Defaults to "map"._

Controls the frame of reference for `circle-translate`. It requires `circle-translate` to be available. It supports two values:

- `map`: The circle is translated relative to the map.
- `viewport`: The circle is translated relative to the viewport.

### visibility

_[Layout](/maps/web-maps-sdk-v2/style-specification/layers#layout-property) property. Optional [enum](/maps/web-maps-sdk-v2/style-specification/types#enum). One of "visible", "none". Defaults to "visible"._

Determines if the layer is displayed. It can be of two types:

- `visible`: This layer is shown
- `none`: This layer is not shown

## fill-extrusion

A `fill-extrusion` style layer renders one or more filled (and optionally stroked) extruded (3D) polygons on a map. You can use a fill-extrusion layer to configure the extrusion and visual appearance of polygon or multipolygon features.

### fill-extrusion-base

_[Paint](/maps/web-maps-sdk-v2/style-specification/layers#paint-property) Property. Optional [number](/maps/web-maps-sdk-v2/style-specification/types#number) greater than or equal to 0. Units in meters. Defaults to 0._

The height with which to extrude the base of this layer. Must be less than or equal to `fill-extrusion-height`. It should be a number greater than equal to 0. Its unit is _meters_.

It requires `fill-extrusion-height` to be available. Supports feature-state and interpolate expressions. Transitionable.

### fill-extrusion-color

_[Paint](/maps/web-maps-sdk-v2/style-specification/layers#paint-property) Property. Optional [color](/maps/web-maps-sdk-v2/style-specification/types#color). Defaults to "#000000"._

The base color of the extruded fill. The extrusion's surfaces will be shaded differently based on this color in combination with the root _light_ settings. If this color is specified as _rgba_ with an alpha component, the alpha component will be ignored; use `fill-extrusion-opacity` to set layer opacity.

It can be disabled by `fill-extrusion-pattern`. Supports feature-state and interpolate expressions. Transitionable.

### fill-extrusion-height

_[Paint](/maps/web-maps-sdk-v2/style-specification/layers#paint-property) Property. Optional [number](/maps/web-maps-sdk-v2/style-specification/types#number) greater than or equal to 0. Units in meters. Defaults to 0._

The height with which to extrude this layer. It should be a number greater than or equal to 0. Its unit is _meters_.

Supports feature-state and interpolate expressions. Transitionable.

### fill-extrusion-opacity

_[Paint](/maps/web-maps-sdk-v2/style-specification/layers#paint-property) Property. Optional [number](/maps/web-maps-sdk-v2/style-specification/types#number) between 0 and 1 inclusive. Defaults to 1._

The opacity of the entire fill extrusion layer. This is rendered on a per-layer, not per-feature, basis, and data-driven styling is not available. It should be a number belonging to \[0, 1\].

Supports interpolate expressions. Transitionable.

### fill-extrusion-pattern

_[Paint](/maps/web-maps-sdk-v2/style-specification/layers#paint-property) Property. Optional [resolvedImage](/maps/web-maps-sdk-v2/style-specification/types#resolvedImage)._

Name of image in sprite to use for drawing images on extruded fills. For seamless patterns, image width and height must be a factor of two (2, 4, 8, ..., 512). Note that zoom-dependent expressions will be evaluated only at integer zoom levels. Transitionable.

### fill-extrusion-translate

_[Paint](/maps/web-maps-sdk-v2/style-specification/layers#paint-property) Property. Optional [array](/maps/web-maps-sdk-v2/style-specification/types#array) of [numbers](/maps/web-maps-sdk-v2/style-specification/types#number). Units in pixels. Defaults to \[0,0\]._

The geometry's offset. Values are \[x, y\] where negatives indicate left and up (on the flat plane), respectively.

Its unit is _pixel_. Supports interpolate expressions. Transitionable.

### fill-extrusion-translate-anchor

_[Paint](/maps/web-maps-sdk-v2/style-specification/layers#paint-property) Property. Optional [enum](/maps/web-maps-sdk-v2/style-specification/types#enum). One of "map", "viewport". Defaults to "map"._

Controls the frame of reference for `fill-extrusion-translate`. It requires `fill-extrusion-translate` to be available. It supports two values:

- `map`: The fill extrusion is translated relative to the map.
- `viewport`: The fill extrusion is translated relative to the viewport.

### fill-extrusion-vertical-gradient

_[Paint](/maps/web-maps-sdk-v2/style-specification/layers#paint-property) Property. Optional [boolean](/maps/web-maps-sdk-v2/style-specification/types#boolean). Defaults to true._

Whether to apply a vertical gradient to the sides of a fill-extrusion layer. If true, sides will be shaded slightly darker farther down.

### visibility

_[Layout](/maps/web-maps-sdk-v2/style-specification/layers#layout-property) property. Optional [enum](/maps/web-maps-sdk-v2/style-specification/types#enum). One of "visible", "none". Defaults to "visible"._

Determines if the layer is displayed. It can be of two types:

`visible`: This layer is shown `none`: This layer is not shown

## heatmap

A `heatmap` style layer renders a range of colors to represent the density of points in an area.

### heatmap-color

_[Paint](/maps/web-maps-sdk-v2/style-specification/layers#paint-property) Property. Optional [color](/maps/web-maps-sdk-v2/style-specification/types#color). Defaults to \["interpolate",\["linear"\],\["heatmap-density"\],0,"rgba(0, 0, 255, 0)",0.1,"royalblue",0.3,"cyan",0.5,"lime",0.7,"yellow",1,"red"\]._

Defines the color of each pixel based on its density value in a heatmap. Should be an expression that uses `heatmap-density` as input. Supports interpolate expressions.

### heatmap-intensity

_[Paint](/maps/web-maps-sdk-v2/style-specification/layers#paint-property) Property. Optional [number](/maps/web-maps-sdk-v2/style-specification/types#number) greater than or equal to 0. Defaults to 1._

Similar to `heatmap-weight` but controls the intensity of the heatmap globally. Primarily used for adjusting the heatmap based on zoom level. It should be a number greater than or equal to 0.

Supports interpolate expressions. Transitionable.

### heatmap-opacity

_[Paint](/maps/web-maps-sdk-v2/style-specification/layers#paint-property) Property. Optional [number](/maps/web-maps-sdk-v2/style-specification/types#number) between 0 and 1 inclusive. Defaults to 1._

The global opacity at which the heatmap layer will be drawn. It should be a number belonging to \[0, 1\].

Supports interpolate expressions. Transitionable.

### heatmap-radius

_[Paint](/maps/web-maps-sdk-v2/style-specification/layers#paint-property) Property. Optional [number](/maps/web-maps-sdk-v2/style-specification/types#number) greater than or equal to 1._

Radius of influence of one heatmap point in pixels. Increasing the value makes the heatmap smoother, but less detailed. It should be a number greater than or equal to 1. Its unit is _pixel_.

Supports feature-state and interpolate expressions. Transitionable.

### heatmap-weight

_[Paint](/maps/web-maps-sdk-v2/style-specification/layers#paint-property) Property. Optional [number](/maps/web-maps-sdk-v2/style-specification/types#number) greater than or equal to 0. Defaults to 1._

A measure of how much an individual point contributes to the heatmap. A value of 10 would be equivalent to having 10 points of weight 1 in the same spot. Especially useful when combined with clustering. It should be a value greater than or equal to 0.

Supports feature-state and interpolate expressions.

### visibility

_[Layout](/maps/web-maps-sdk-v2/style-specification/layers#layout-property) property. Optional [enum](/maps/web-maps-sdk-v2/style-specification/types#enum). One of "visible", "none". Defaults to "visible"._

Determines if the layer is displayed. It can be of two types:

- `visible`: This layer is shown
- `none`: This layer is not shown

## hillshade

A `hillshade` style layer renders digital elevation model (DEM) data on the client-side. The implementation only supports Mapbox Terrain RGB and Mapzen Terrarium tiles.

### hillshade-accent-color

_[Paint](/maps/web-maps-sdk-v2/style-specification/layers#paint-property) Property. Optional [color](/maps/web-maps-sdk-v2/style-specification/types#color). Defaults to "#000000"._

The shading color used to accentuate rugged terrain like sharp cliffs and gorges.

Supports interpolate expressions. Transitionable.

### hillshade-exaggeration

_[Paint](/maps/web-maps-sdk-v2/style-specification/layers#paint-property) Property. Optional [number](/maps/web-maps-sdk-v2/style-specification/types#number) between 0 and 1 inclusive. Defaults to 0.5._

Intensity of the hillshade. It should be a number belonging to \[0,1\].

Supports interpolate expressions. Transitionable.

### hillshade-highlight-color

_[Paint](/maps/web-maps-sdk-v2/style-specification/layers#paint-property) Property. Optional [color](/maps/web-maps-sdk-v2/style-specification/types#color). Defaults to "#FFFFFF"._

The shading color of areas that faces towards the light source.

Supports interpolate expressions. Transitionable.

### hillshade-illumination-anchor

_[Paint](/maps/web-maps-sdk-v2/style-specification/layers#paint-property) Property. Optional [enum](/maps/web-maps-sdk-v2/style-specification/types#enum). One of "map", "viewport". Defaults to "viewport"._

Direction of light source when map is rotated. It supports following values:

- `map`: The hillshade illumination is relative to the north direction.
- `viewport`: The hillshade illumination is relative to the top of the viewport.

### hillshade-illumination-direction

_[Paint](/maps/web-maps-sdk-v2/style-specification/layers#paint-property) Property. Optional [number](/maps/web-maps-sdk-v2/style-specification/types#number) between 0 and 359 inclusive. Defaults to 335._

The direction of the light source used to generate the hill shading with 0 as the top of the viewport if `hillshade-illumination-anchor` is set to _viewport_ and due north if `hillshade-illumination-anchor` is set to _map_. It should be a number belonging to \[0,359\].

Supports interpolate expressions.

### hillshade-shadow-color

_[Paint](/maps/web-maps-sdk-v2/style-specification/layers#paint-property) Property. Optional [color](/maps/web-maps-sdk-v2/style-specification/types#color). Defaults to "#000000"._

The shading color of areas that face away from the light source.

Supports interpolate expressions. Transitionable.

### visibility

_[Layout](/maps/web-maps-sdk-v2/style-specification/layers#layout-property) property. Optional [enum](/maps/web-maps-sdk-v2/style-specification/types#enum). One of "visible", "none". Defaults to "visible"._

Determines if the layer is displayed. It can be of two types:

- `visible`: This layer is shown
- `none`: This layer is not shown

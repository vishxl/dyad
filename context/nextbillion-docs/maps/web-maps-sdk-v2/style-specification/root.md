# Root

Root level properties of a Nextbillion.ai style specify the map's layers, tile sources and other resources, and default values for the initial camera position when not specified elsewhere.

```json
{
"version": 13.12.0,
"name": "NB Maptile",
"sprite": "https://api.nextbillion.io/maps/streets/sprite",
"glyphs": "https://api.nextbillion.io/fonts/{fontstack}/{range}.pbf",
"sources": {...},
"layers": [...]
}
```

Let’s take a look at the attributes available at root level:

## bearing

_Optional [number](/docs/maps/web-v2/style-specification/types#number)_. _Default: "0"_

Default bearing, in degrees. The bearing is the compass direction that is "up"; for example, a bearing of 90° orients the map so that east is up. This value will be used only if the map has not been positioned by other means (e.g. map options or user interaction).

```bash
"bearing": 29
```

## center

_Optional [Array](/docs/maps/web-v2/style-specification/types#array)[<number\>](/docs/maps/web-v2/style-specification/types#number)_.

Default map centre expressed as \[longitude, latitude\]. The style centre will be used only if the map has not been positioned by other means (e.g. map options or user interaction).

```bash
"center": [ -73.9749, 40.7736 ]
```

## glyphs

_Optional [string](/docs/maps/web-v2/style-specification/types#string)_.

A URL template for loading signed-distance-field glyph sets in PBF format. The URL must include `{fontstack}` and `{range}` tokens. This property is required if any layer uses the `text-field` layout property. The URL must be absolute, containing the [scheme](https://en.wikipedia.org/wiki/URL#Syntax), [authority and pathcomponents](https://en.wikipedia.org/wiki/URL#Syntax).

```bash
 "glyphs":"https://api.nextbillion.io/fonts/{fontstack}/{range}.pbf"
```

## layers

_Required [layer](/docs/maps/web-v2/style-specification/layers)_.

Layers will be drawn in the order of this array.

```json
"layers": [ { "id": "water", "source": "nb-streets",
"source-layer": "water", "type": "fill", "paint": { "fill-color":
"#00ffff" } } ]
```

## light

_Optional [light](/docs/maps/web-v2/style-specification/light)_.

The global light source.

```json
 "light": {  "anchor": "viewport",  "color": "white",  "intensity": 0.4 }
```

## metadata

_Optional [object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)_.

Arbitrary properties useful to track with the stylesheet, but do not influence rendering. Properties should be prefixed to avoid collisions, like 'nb:'.

## name

_Optional [string](/docs/maps/web-v2/style-specification/types#string)_.

A custom name for the style.

```bash
"name": "Bright"
```

## pitch

_Optional [number](/docs/maps/web-v2/style-specification/types#number)_. _Default: 50_

Default pitch, in degrees. Zero is perpendicular to the surface, for a look straight down at the map, while a greater value like 60° looks ahead towards the horizon. The style pitch will be used only if the map has not been positioned by other means (e.g. map options or user interaction).

## sources

_Required [sources](/docs/maps/web-v2/style-specification/sources)_.

Data source specifications. See sources for more details

```bash
"sources": { "nb-streets": { "type": "vector", "url": "https://api.example.com/nb-streets.json" } }
```

## sprite

_Optional [string](/docs/maps/web-v2/style-specification/types#string)_.

A base URL for retrieving the sprite image and metadata. The extensions `.png`, `.json` and scale factor `@2x.png` will be automatically appended. This property is required if any layer uses the `background-pattern`, `fill-pattern`, `line-pattern`, `fill-extrusion-pattern`, or `icon-image` properties. The URL must be absolute, containing the [scheme, authority and pathcomponents](https://en.wikipedia.org/wiki/URL#Syntax).

```bash
"sprite": "https://api.nextbillion.io/maps/streets/sprite"
```

## transition

_Optional [transition](/docs/maps/web-v2/style-specification/transition)_.

A global transition definition to use as a default across properties, to be used for timing transitions between one value and the next when no property-specific transition is set. Collision-based symbol fading is controlled independently of the style's transition property.

```bash
"transition": { "duration": 300, "delay": 0 }
```

## version

_Required [string](/docs/maps/web-v2/style-specification/types#string)_.

Style specification version number. Must always be 8.

```bash
"version": 8
```

## version

_Required [string](/docs/maps/web-v2/style-specification/types#string)_.

Style specification version number. Must always be 8.

```bash
"version": 8
```

## zoom

Optional [string](/docs/maps/web-v2/style-specification/types#string)\_.

Default zoom level. The style zoom will be used only if the map has not been positioned by other means (e.g. map options or user interaction).

```bash
"zoom": 12.5
```

# light

A style's light property provides a global light source for that style. Since this property is the light used to light extruded features, you will only see visible changes to your map style when modifying this property if you are using extrusions.

```json
"light": {
  "anchor": 'viewport',
  "color": 'white',
  "intensity": 0.4,
}
```

Let’s take a look at the properties available for light attribute:

## anchor

_Optional [enum](/docs/maps/web-v2/style-specification/types#enum)_. _Allow values are 'map', 'viewport'_ . default: 'viewport'

Should belong to one of `map`, `viewport`. It determines whether extruded geometries are lit relative to the map or viewport.

- `map`: The position of the light source is aligned to the rotation of the map.
- `viewport`: The position of the light source is aligned to the rotation of the viewport.

```bash
"anchor": "map"
```

## color

_Optional [color](/docs/maps/web-v2/style-specification/types#enum)_. Default: '#ffffff'

Supports `interpolate` expressions. Transitionable. Determines the color tint for lighting extruded geometries.

## intensity

_Optional [number](/docs/maps/web-v2/style-specification/types#number)_. Default: '0.5'

Should be between 0 and 1 inclusive. Supports `interpolate` expressions. Transitionable. Intensity of lighting (on a scale from 0 to 1). Higher numbers will present as more extreme contrast.

## position

_Optional [Array](/docs/maps/web-v2/style-specification/types#array)[<number\>](/docs/maps/web-v2/style-specification/types#number)_. Default: '\[1.15,210,30\]'

Supports `interpolate` expressions. Transitionable. Position of the light source relative to lit (extruded) geometries, in \[r radial coordinate, a azimuthal angle, p polar angle\] where r indicates the distance from the center of the base of an object to its light, a indicates the position of the light relative to 0° (0° when `light.anchor` is set to `viewport` corresponds to the top of the viewport, or 0° when light.anchor is set to map corresponds to due north, and degrees proceed clockwise), and p indicates the height of the light (from 0°, directly above, to 180°, directly below).

```bash
"position": [ 1.5, 90, 80 ]
```

# Transition

A `transition` property controls timing for the interpolation between a transitionable style property's previous value and new value. A style's [root transition property](/maps/web-v2/style-specification/root) provides global transition defaults for that style.

```json
"transition": {
"duration": 300,
"delay": 0
}
```

Any transitionable layer property, **marked by** , may also have its own `*-transition` property that defines specific transition timing for that layer property, overriding the global `transition` values.

```json
"fill-opacity-transition": {
"duration": 300,
"delay": 0
}
```

## url

_Optional [number](/docs/maps/web-v2/style-specification/types#number). Default:0_

Length of time before a transition begins. Please note the unit is in milliseconds and the value should be greater than equal to zero.

## duration

_Optional [number](/docs/maps/web-v2/style-specification/types#number). Default:300_

Time allotted for transitions to complete. Please note the unit is in milliseconds and the value should be greater than equal to zero.

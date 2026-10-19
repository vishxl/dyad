## LngLat

A `LngLat` object represents a given longitude and latitude coordinate, measured in degrees.  
These coordinates are based on the [WGS84 (EPSG:4326) standard](https://en.wikipedia.org/wiki/World_Geodetic_System#WGS84).

Nextbillion GL uses longitude, latitude coordinate order (as opposed to latitude, longitude) to match the  
[GeoJSON specification](https://tools.ietf.org/html/rfc7946).

Note that any Nextbillion GL method that accepts a `LngLat` object as an argument or option  
can also accept an `Array` of two numbers and will perform an implicit conversion.  
This flexible type is documented as LngLatLike .

### Constructor

| Name   |                                                                                                  |
| ------ | ------------------------------------------------------------------------------------------------ |
| LngLat | new LngLat(lng: number, lat: number)<br> <br>Parameters<br> <br>1. lng: number<br>2. lat: number |

### Methods

| Method     |                                                                                                                                                                                                                                                                                                                                                                                        |
| ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| distanceTo | distanceTo(lngLat: [LngLat](#lnglat))<br> <br>Parameters<br> <br>1. lngLat: [LngLat](#lnglat)<br> <br>Return Value: number<br> <br>Returns the approximate distance between a pair of coordinates in meters <br>Uses the Haversine Formula (from R.W. Sinnott, "Virtues of the Haversine", Sky and Telescope, vol. 68, no. 2, 1984, p. 159)                                            |
| toArray    | toArray()<br> <br> <br>Return Value: none<br> <br>Returns the coordinates represented as an array of two numbers.                                                                                                                                                                                                                                                                      |
| toBounds   | toBounds(radius: number)<br> <br>Parameters<br> <br>1. radius: number<br> <br>Return Value: [LngLatBounds](#lnglatbounds)<br> <br>Returns a `LngLatBounds` from the coordinates extended by a given `radius` . The returned `LngLatBounds` completely contains the `radius` .                                                                                                          |
| toString   | toString()<br> <br> <br>Return Value: string<br> <br>Returns the coordinates represent as a string.                                                                                                                                                                                                                                                                                    |
| wrap       | wrap()<br> <br> <br>Return Value: [LngLat](#lnglat)<br> <br>Returns a new `LngLat` object whose longitude is wrapped to the range (-180, 180).                                                                                                                                                                                                                                         |
| convert    | convert(input: [LngLatLike](#interface-lnglatlike))<br> <br>Parameters<br> <br>1. input: [LngLatLike](#interface-lnglatlike)<br> <br>Return Value: [LngLat](#lnglat)<br> <br>Converts an array of two numbers or an object with `lng` and `lat` or `lon` and `lat` properties <br>to a `LngLat` object. <br> <br>If a `LngLat` object is passed in, the function returns it unchanged. |

## Example

```ts
var ll = new nextbillion.maps.LngLat(-123.9749, 40.7736);
ll.lng; // = -123.9749
```

## Interface LngLatLike

A LngLat object, an array of two numbers representing longitude and latitude,  
or an object with `lng` and `lat` or `lon` and `lat` properties.

## LngLatBounds

A `LngLatBounds` object represents a geographical bounding box,  
defined by its southwest and northeast points in longitude and latitude.

If no arguments are provided to the constructor, a `null` bounding box is created.

Note that any Mapbox GL method that accepts a `LngLatBounds` object as an argument or option  
can also accept an `Array` of two LngLatLike constructs and will perform an implicit conversion.  
This flexible type is documented as LngLatBoundsLike .

### Constructor

| Name         |                                                                                        |
| ------------ | -------------------------------------------------------------------------------------- |
| LngLatBounds | new LngLatBounds(sw: any, ne: any)<br> <br>Parameters<br> <br>1. sw: any<br>2. ne: any |

### Methods

| Method       |                                                                                                                                                                                                                                                                                                                                                                                      |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| contains     | contains(lnglat: [LngLatLike](#interface-lnglatlike))<br> <br>Parameters<br> <br>1. lnglat: [LngLatLike](#interface-lnglatlike)<br> <br>Return Value: boolean<br> <br>Check if the point is within the bounding box.                                                                                                                                                                 |
| extend       | extend(obj: [LngLatLike](#interface-lnglatlike) \| LngLatBoundsLike)<br> <br>Parameters<br> <br>1. obj: [LngLatLike](#interface-lnglatlike) \| LngLatBoundsLike<br> <br>Return Value: any<br> <br>Extend the bounds to include a given LngLatLike or LngLatBoundsLike.                                                                                                               |
| getCenter    | getCenter()<br> <br> <br>Return Value: [LngLat](#lnglat)<br> <br>Returns the geographical coordinate equidistant from the bounding box's corners.                                                                                                                                                                                                                                    |
| getEast      | getEast()<br> <br> <br>Return Value: number<br> <br>Returns the east edge of the bounding box.                                                                                                                                                                                                                                                                                       |
| getNorth     | getNorth()<br> <br> <br>Return Value: number<br> <br>Returns the north edge of the bounding box.                                                                                                                                                                                                                                                                                     |
| getNorthEast | getNorthEast()<br> <br> <br>Return Value: [LngLat](#lnglat)<br> <br>Returns the northeast corner of the bounding box.                                                                                                                                                                                                                                                                |
| getNorthWest | getNorthWest()<br> <br> <br>Return Value: [LngLat](#lnglat)<br> <br>Returns the northwest corner of the bounding box.                                                                                                                                                                                                                                                                |
| getSouth     | getSouth()<br> <br> <br>Return Value: number<br> <br>Returns the south edge of the bounding box.                                                                                                                                                                                                                                                                                     |
| getSouthEast | getSouthEast()<br> <br> <br>Return Value: [LngLat](#lnglat)<br> <br>Returns the southeast corner of the bounding box.                                                                                                                                                                                                                                                                |
| getSouthWest | getSouthWest()<br> <br> <br>Return Value: [LngLat](#lnglat)<br> <br>Returns the southwest corner of the bounding box.                                                                                                                                                                                                                                                                |
| getWest      | getWest()<br> <br> <br>Return Value: number<br> <br>Returns the west edge of the bounding box.                                                                                                                                                                                                                                                                                       |
| isEmpty      | isEmpty()<br> <br> <br>Return Value: boolean<br> <br>Check if the bounding box is an empty/ `null` -type box.                                                                                                                                                                                                                                                                        |
| setNorthEast | setNorthEast(ne: [LngLatLike](#interface-lnglatlike))<br> <br>Parameters<br> <br>1. ne: [LngLatLike](#interface-lnglatlike)<br> <br>Return Value: [LngLatBounds](#lnglatbounds)<br> <br>Set the northeast corner of the bounding box                                                                                                                                                 |
| setSouthWest | setSouthWest(sw: [LngLatLike](#interface-lnglatlike))<br> <br>Parameters<br> <br>1. sw: [LngLatLike](#interface-lnglatlike)<br> <br>Return Value: [LngLatBounds](#lnglatbounds)<br> <br>Set the southwest corner of the bounding box                                                                                                                                                 |
| toArray      | toArray()<br> <br> <br>Return Value: none<br> <br>Returns the bounding box represented as an array.                                                                                                                                                                                                                                                                                  |
| toString     | toString()<br> <br> <br>Return Value: string<br> <br>Return the bounding box represented as a string.                                                                                                                                                                                                                                                                                |
| convert      | convert(input: LngLatBoundsLike)<br> <br>Parameters<br> <br>1. input: LngLatBoundsLike<br> <br>Return Value: [LngLatBounds](#lnglatbounds)<br> <br>Converts an array to a `LngLatBounds` object. <br> <br>If a `LngLatBounds` object is passed in, the function returns it unchanged. <br> <br>Internally, the function calls `LngLat#convert` to convert arrays to `LngLat` values. |

## Example

```ts
var sw = new nextbillion.maps.LngLat(-73.9876, 40.7661);
var ne = new nextbillion.maps.LngLat(-73.9397, 40.8002);
var llb = new nextbillion.maps.LngLatBounds(sw, ne);
```

## MercatorCoordinate

A `MercatorCoordinate` object represents a projected three dimensional position.

`MercatorCoordinate` uses the web mercator projection ([EPSG:3857](https://epsg.io/3857)) with slightly different units:  
\- the size of 1 unit is the width of the projected world instead of the "mercator meter"  
\- the origin of the coordinate space is at the north-west corner instead of the middle

For example, `MercatorCoordinate(0, 0, 0)` is the north-west corner of the mercator world and  
`MercatorCoordinate(1, 1, 0)` is the south-east corner. If you are familiar with  
[vector tiles](https://github.com/mapbox/vector-tile-spec) it may be helpful to think  
of the coordinate space as the `0/0/0` tile with an extent of `1` .

The `z` dimension of `MercatorCoordinate` is conformal. A cube in the mercator coordinate space would be rendered as a cube.

### Constructor

| Name               |                                                                                                                                 |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------- |
| MercatorCoordinate | new MercatorCoordinate(x: number, y: number, z: number)<br> <br>Parameters<br> <br>1. x: number<br>2. y: number<br>3. z: number |

### Methods

| Method                         |                                                                                                                                                                                                                                                                                                           |
| ------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| meterInMercatorCoordinateUnits | meterInMercatorCoordinateUnits()<br> <br> <br>Return Value: number<br> <br>Returns the distance of 1 meter in `MercatorCoordinate` units at this latitude. <br> <br>For coordinates in real world units using meters, this naturally provides the scale <br>to transform into `MercatorCoordinate` s.     |
| toAltitude                     | toAltitude()<br> <br> <br>Return Value: number<br> <br>Returns the altitude in meters of the coordinate.                                                                                                                                                                                                  |
| toLngLat                       | toLngLat()<br> <br> <br>Return Value: [LngLat](#lnglat)<br> <br>Returns the `LngLat` for the coordinate.                                                                                                                                                                                                  |
| fromLngLat                     | fromLngLat(lngLatLike: [LngLatLike](#interface-lnglatlike), altitude: number)<br> <br>Parameters<br> <br>1. lngLatLike: [LngLatLike](#interface-lnglatlike)<br>2. altitude: number<br> <br>Return Value: [MercatorCoordinate](#mercatorcoordinate)<br> <br>Project a `LngLat` to a `MercatorCoordinate` . |

## Example

```ts
var nullIsland = new nextbillion.maps.MercatorCoordinate(0.5, 0.5, 0);
```

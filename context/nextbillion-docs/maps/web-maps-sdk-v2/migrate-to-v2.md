# Migrate To V2

## Introduction

NB Map Web SDK V2 enables more features and performance enhancements, and we won't update V1 anymore(except bug fixing), highly recommended to migrate from V1 to V2.

## Get Web SDK v2

### CDN

```html
<link href="https://maps-gl.nextbillion.io/maps/v2/api/css" rel="stylesheet" />
<script src="https://maps-gl.nextbillion.io/maps/v2/api/js"></script>
```

### NPM

#### Install

```bash
npm install @nbai/nbmap-gl
```

#### Import

```javascript
import "@nbai/nbmap-gl/dist/nextbillion.css";
import nextbillion from "@nbai/nbmap-gl";
```

### Map Init

The Way to Init a map has been changed a bit, check the example [here](./examples/map).

### Marker

new `Marker`. You can get `Marker` by `nextbillion.maps.Marker` or `import { Marker } from "@nbai/nbmap-gl"`. Check the example [here](./examples/marker).

### Popup

new `Popup`. You can get `Popup` by `nextbillion.maps.Popup` or `import { Popup } from "@nbai/nbmap-gl"`. Check the example [here](./examples/popup).

### Tooltip

`Tooltip` is removed. You can get tooltip by using `Popup`, check the example [here](./examples/marker).

### Draw shapes

`Circle`, `Polyline`, `Polygon` are removed. You can draw shapes by `Layer` in V2, check the example [here](./examples/shape-and-symbol).

### Theme

The built-in theme is removed.

### API Service

Instead of `Directions`, we provide `DirectionsService` now, you can learn how to get and render the data in these examples:

- [simple directions example](./examples/directions-simple)
- [advanced directions example](./examples/directions-complex).

Similarly, we will provide `*Service` for other APIs in new version. But for now, You may need to make the request according to the API docs by yourself in your code.

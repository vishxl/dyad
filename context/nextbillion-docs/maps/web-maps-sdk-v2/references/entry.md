## NextBillion

NextBillion.ai web SDK Entry.

You need to use the singleton instance of this class by calling `window.nextbillion` if you load the sdk with CDN url.  
Or you can get instance by `import nextbillion from '@nbai/nbmap-gl' if you import the sdk with npm`

### Properties

| Name    | Type           |
| ------- | -------------- |
| apiHost | null \| string |
| apiKey  | null \| string |
| version | string         |

### Methods

| Method             |                                                                                                                                                                                                                                 |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| DisableNBTransform | DisableNBTransform()<br> <br> <br>Return Value: void<br> <br>Disable the inner request transform for NextBillion.ai maptiles. You only need to call this method if you want to use the maptiles not provided by nextbillion.ai. |
| EnableNBTransform  | EnableNBTransform()<br> <br> <br>Return Value: void<br> <br>Enable the inner request transform for NextBillion.ai maptiles.                                                                                                     |
| setApiHost         | setApiHost(host: null \| string)<br> <br>Parameters<br> <br>1. host: null \| string<br> <br>Return Value: void<br> <br>Set the API host for the web SDK.                                                                        |
| setApiKey          | setApiKey(token: null \| string)<br> <br>Parameters<br> <br>1. token: null \| string<br> <br>Return Value: void<br> <br>Set the API key for the web SDK.                                                                        |

## NBMap

### Constructor

| Name  |                                                                                                                                            |
| ----- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| NBMap | new NBMap(options: [NBMapOptions](#interface-nbmapoptions))<br> <br>Parameters<br> <br>1. options: [NBMapOptions](#interface-nbmapoptions) |

### Properties

| Name | Type                 |
| ---- | -------------------- |
| map  | [Map](./map#Map-map) |

### Methods

| Method   |                                                                                                                                                                                                                          |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| on       | on(type: string, listener: Listener)<br> <br>Parameters<br> <br>1. type: string<br>2. listener: Listener<br> <br>Return Value: [NBMap](#nbmap)                                                                           |
| setStyle | setStyle(style: null \| string \| StyleSpecification, options: StyleOptions)<br> <br>Parameters<br> <br>1. style: null \| string \| StyleSpecification<br>2. options: StyleOptions<br> <br>Return Value: [NBMap](#nbmap) |

## Example

```ts
nextbillion.setApiKey("your_api_key");
var map = new nextbillion.maps.Map({
  container: "map",
  center: [-122.420679, 37.772537],
  zoom: 13,
  style: "https://api.nextbillion.io/maps/streets/style.json",
  hash: true,
});
```

## Interface NBMapOptions

### Properties

| Name  |                                    |
| ----- | ---------------------------------- |
| style | Type: string \| StyleSpecification |

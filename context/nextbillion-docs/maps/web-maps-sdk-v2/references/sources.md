## GeoJSONSource

A source containing GeoJSON.  
(See the Style Specification for detailed documentation of options.)

### Constructor

| Name          |                                                                                                                                                                                                                                                                                             |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| GeoJSONSource | new GeoJSONSource(id: string, options: GeoJSONSourceOptions, dispatcher: Dispatcher, eventedParent: [Evented](./events#evented))<br> <br>Parameters<br> <br>1. id: string<br>2. options: GeoJSONSourceOptions<br>3. dispatcher: Dispatcher<br>4. eventedParent: [Evented](./events#evented) |

### Methods

| Method                  |                                                                                                                                                                                                                                                                                                                                                                                         |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| abortTile               | abortTile(tile: Tile)<br> <br>Parameters<br> <br>1. tile: Tile<br> <br>Return Value: void                                                                                                                                                                                                                                                                                               |
| fire                    | fire(event: string \| Event, properties: any)<br> <br>Parameters<br> <br>1. event: string \| Event<br>2. properties: any<br> <br>Return Value: [GeoJSONSource](#geojsonsource)                                                                                                                                                                                                          |
| getClusterChildren      | getClusterChildren(clusterId: number, callback: Callback)<br> <br>Parameters<br> <br>1. clusterId: number<br>2. callback: Callback<br> <br>Return Value: [GeoJSONSource](#geojsonsource)<br> <br>For clustered sources, fetches the children of the given cluster on the next zoom level (as an array of GeoJSON features).                                                             |
| getClusterExpansionZoom | getClusterExpansionZoom(clusterId: number, callback: Callback)<br> <br>Parameters<br> <br>1. clusterId: number<br>2. callback: Callback<br> <br>Return Value: [GeoJSONSource](#geojsonsource)<br> <br>For clustered sources, fetches the zoom at which the given cluster expands.                                                                                                       |
| getClusterLeaves        | getClusterLeaves(clusterId: number, limit: number, offset: number, callback: Callback)<br> <br>Parameters<br> <br>1. clusterId: number<br>2. limit: number<br>3. offset: number<br>4. callback: Callback<br> <br>Return Value: [GeoJSONSource](#geojsonsource)<br> <br>For clustered sources, fetches the original points that belong to the cluster (as an array of GeoJSON features). |
| hasTransition           | hasTransition()<br> <br> <br>Return Value: boolean                                                                                                                                                                                                                                                                                                                                      |
| listens                 | listens(type: string)<br> <br>Parameters<br> <br>1. type: string<br> <br>Return Value: any<br> <br>Returns a true if this instance of Evented or any forwardeed instances of Evented have a listener for the specified type.                                                                                                                                                            |
| load                    | load()<br> <br> <br>Return Value: void                                                                                                                                                                                                                                                                                                                                                  |
| loadTile                | loadTile(tile: Tile, callback: Callback)<br> <br>Parameters<br> <br>1. tile: Tile<br>2. callback: Callback<br> <br>Return Value: void                                                                                                                                                                                                                                                   |
| loaded                  | loaded()<br> <br> <br>Return Value: boolean                                                                                                                                                                                                                                                                                                                                             |
| off                     | off(type: string, listener: Listener)<br> <br>Parameters<br> <br>1. type: string<br>2. listener: Listener<br> <br>Return Value: [GeoJSONSource](#geojsonsource)<br> <br>Removes a previously registered event listener.                                                                                                                                                                 |
| on                      | on(type: string, listener: Listener)<br> <br>Parameters<br> <br>1. type: string<br>2. listener: Listener<br> <br>Return Value: [GeoJSONSource](#geojsonsource)<br> <br>Adds a listener to a specified event type.                                                                                                                                                                       |
| onAdd                   | onAdd(map: [Map](./map#map))<br> <br>Parameters<br> <br>1. map: [Map](./map#map)<br> <br>Return Value: void                                                                                                                                                                                                                                                                             |
| onRemove                | onRemove()<br> <br> <br>Return Value: void                                                                                                                                                                                                                                                                                                                                              |
| once                    | once(type: string, listener: Listener)<br> <br>Parameters<br> <br>1. type: string<br>2. listener: Listener<br> <br>Return Value: [GeoJSONSource](#geojsonsource)<br> <br>Adds a listener that will be called only once to a specified event type. <br> <br>The listener will be called first time the event fires after the listener is registered.                                     |
| serialize               | serialize()<br> <br> <br>Return Value: any                                                                                                                                                                                                                                                                                                                                              |
| setData                 | setData(data: string \| GeoJSON)<br> <br>Parameters<br> <br>1. data: string \| GeoJSON<br> <br>Return Value: [GeoJSONSource](#geojsonsource)<br> <br>Sets the GeoJSON data and re-renders the map.                                                                                                                                                                                      |
| setEventedParent        | setEventedParent(parent: [Evented](./events#evented), data: any)<br> <br>Parameters<br> <br>1. parent: [Evented](./events#evented)<br>2. data: any<br> <br>Return Value: [GeoJSONSource](#geojsonsource)<br> <br>Bubble all events fired by this instance of Evented to this parent instance of Evented.                                                                                |
| unloadTile              | unloadTile(tile: Tile)<br> <br>Parameters<br> <br>1. tile: Tile<br> <br>Return Value: void                                                                                                                                                                                                                                                                                              |

## Example

```ts
map.addSource("some id", {
  type: "geojson",
  data: "https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_10m_ports.geojson",
});
```

## ImageSource

A data source containing an image.  
(See the Style Specification for detailed documentation of options.)

### Constructor

| Name        |                                                                                                                                                                                                                                                                                                                                                                                                                     |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ImageSource | new ImageSource(id: string, options: CanvasSourceSpecification \| ImageSourceSpecification \| VideoSourceSpecification, dispatcher: Dispatcher, eventedParent: [Evented](./events#evented))<br> <br>Parameters<br> <br>1. id: string<br>2. options: CanvasSourceSpecification \| ImageSourceSpecification \| VideoSourceSpecification<br>3. dispatcher: Dispatcher<br>4. eventedParent: [Evented](./events#evented) |

### Methods

| Method           |                                                                                                                                                                                                                                                                                                                                                                                              |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| fire             | fire(event: string \| Event, properties: any)<br> <br>Parameters<br> <br>1. event: string \| Event<br>2. properties: any<br> <br>Return Value: [ImageSource](#imagesource)                                                                                                                                                                                                                   |
| hasTransition    | hasTransition()<br> <br> <br>Return Value: boolean                                                                                                                                                                                                                                                                                                                                           |
| listens          | listens(type: string)<br> <br>Parameters<br> <br>1. type: string<br> <br>Return Value: any<br> <br>Returns a true if this instance of Evented or any forwardeed instances of Evented have a listener for the specified type.                                                                                                                                                                 |
| load             | load(newCoordinates: Coordinates, successCallback: Function)<br> <br>Parameters<br> <br>1. newCoordinates: Coordinates<br>2. successCallback: Function<br> <br>Return Value: void                                                                                                                                                                                                            |
| loadTile         | loadTile(tile: Tile, callback: Callback)<br> <br>Parameters<br> <br>1. tile: Tile<br>2. callback: Callback<br> <br>Return Value: void                                                                                                                                                                                                                                                        |
| loaded           | loaded()<br> <br> <br>Return Value: boolean                                                                                                                                                                                                                                                                                                                                                  |
| off              | off(type: string, listener: Listener)<br> <br>Parameters<br> <br>1. type: string<br>2. listener: Listener<br> <br>Return Value: [ImageSource](#imagesource)<br> <br>Removes a previously registered event listener.                                                                                                                                                                          |
| on               | on(type: string, listener: Listener)<br> <br>Parameters<br> <br>1. type: string<br>2. listener: Listener<br> <br>Return Value: [ImageSource](#imagesource)<br> <br>Adds a listener to a specified event type.                                                                                                                                                                                |
| onAdd            | onAdd(map: [Map](./map#map))<br> <br>Parameters<br> <br>1. map: [Map](./map#map)<br> <br>Return Value: void                                                                                                                                                                                                                                                                                  |
| once             | once(type: string, listener: Listener)<br> <br>Parameters<br> <br>1. type: string<br>2. listener: Listener<br> <br>Return Value: [ImageSource](#imagesource)<br> <br>Adds a listener that will be called only once to a specified event type. <br> <br>The listener will be called first time the event fires after the listener is registered.                                              |
| prepare          | prepare()<br> <br> <br>Return Value: void                                                                                                                                                                                                                                                                                                                                                    |
| serialize        | serialize()<br> <br> <br>Return Value: any                                                                                                                                                                                                                                                                                                                                                   |
| setCoordinates   | setCoordinates(coordinates: Coordinates)<br> <br>Parameters<br> <br>1. coordinates: Coordinates<br> <br>Return Value: [ImageSource](#imagesource)<br> <br>Sets the image's coordinates and re-renders the map.                                                                                                                                                                               |
| setEventedParent | setEventedParent(parent: [Evented](./events#evented), data: any)<br> <br>Parameters<br> <br>1. parent: [Evented](./events#evented)<br>2. data: any<br> <br>Return Value: [ImageSource](#imagesource)<br> <br>Bubble all events fired by this instance of Evented to this parent instance of Evented.                                                                                         |
| updateImage      | updateImage(options: { coordinates: Coordinates,url: string })<br> <br>Parameters<br> <br>1. options: { coordinates: Coordinates,url: string }<br> <br>Return Value: [ImageSource](#imagesource)<br> <br>Updates the image URL and, optionally, the coordinates. To avoid having the image flash after changing, <br>set the `raster-fade-duration` paint property on the raster layer to 0. |

## Example

```ts
// add to map
map.addSource("some id", {
  type: "image",
  url: "https://nextbillion.ai/images/foo.png",
  coordinates: [
    [-76.54, 39.18],
    [-76.52, 39.18],
    [-76.52, 39.17],
    [-76.54, 39.17],
  ],
});

// update coordinates
var mySource = map.getSource("some id");
mySource.setCoordinates([
  [-76.54335737228394, 39.18579907229748],
  [-76.52803659439087, 39.1838364847587],
  [-76.5295386314392, 39.17683392507606],
  [-76.54520273208618, 39.17876344106642],
]);

// update url and coordinates simultaneously
mySource.updateImage({
  url: "https://nextbillion.ai/images/bar.png",
  coordinates: [
    [-76.54335737228394, 39.18579907229748],
    [-76.52803659439087, 39.1838364847587],
    [-76.5295386314392, 39.17683392507606],
    [-76.54520273208618, 39.17876344106642],
  ],
});

map.removeSource("some id"); // remove
```

## VideoSource

A data source containing video.  
(See the Style Specification for detailed documentation of options.)

### Constructor

| Name        |                                                                                                                                                                                                                                                                                                   |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| VideoSource | new VideoSource(id: string, options: VideoSourceSpecification, dispatcher: Dispatcher, eventedParent: [Evented](./events#evented))<br> <br>Parameters<br> <br>1. id: string<br>2. options: VideoSourceSpecification<br>3. dispatcher: Dispatcher<br>4. eventedParent: [Evented](./events#evented) |

### Methods

| Method           |                                                                                                                                                                                                                                                                                                                                                                                              |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| fire             | fire(event: string \| Event, properties: any)<br> <br>Parameters<br> <br>1. event: string \| Event<br>2. properties: any<br> <br>Return Value: [VideoSource](#videosource)                                                                                                                                                                                                                   |
| getVideo         | getVideo()<br> <br> <br>Return Value: HTMLVideoElement<br> <br>Returns the HTML `video` element.                                                                                                                                                                                                                                                                                             |
| hasTransition    | hasTransition()<br> <br> <br>Return Value: boolean                                                                                                                                                                                                                                                                                                                                           |
| listens          | listens(type: string)<br> <br>Parameters<br> <br>1. type: string<br> <br>Return Value: any<br> <br>Returns a true if this instance of Evented or any forwardeed instances of Evented have a listener for the specified type.                                                                                                                                                                 |
| load             | load()<br> <br> <br>Return Value: void                                                                                                                                                                                                                                                                                                                                                       |
| loadTile         | loadTile(tile: Tile, callback: Callback)<br> <br>Parameters<br> <br>1. tile: Tile<br>2. callback: Callback<br> <br>Return Value: void                                                                                                                                                                                                                                                        |
| loaded           | loaded()<br> <br> <br>Return Value: boolean                                                                                                                                                                                                                                                                                                                                                  |
| off              | off(type: string, listener: Listener)<br> <br>Parameters<br> <br>1. type: string<br>2. listener: Listener<br> <br>Return Value: [VideoSource](#videosource)<br> <br>Removes a previously registered event listener.                                                                                                                                                                          |
| on               | on(type: string, listener: Listener)<br> <br>Parameters<br> <br>1. type: string<br>2. listener: Listener<br> <br>Return Value: [VideoSource](#videosource)<br> <br>Adds a listener to a specified event type.                                                                                                                                                                                |
| onAdd            | onAdd(map: [Map](./map#map))<br> <br>Parameters<br> <br>1. map: [Map](./map#map)<br> <br>Return Value: void                                                                                                                                                                                                                                                                                  |
| once             | once(type: string, listener: Listener)<br> <br>Parameters<br> <br>1. type: string<br>2. listener: Listener<br> <br>Return Value: [VideoSource](#videosource)<br> <br>Adds a listener that will be called only once to a specified event type. <br> <br>The listener will be called first time the event fires after the listener is registered.                                              |
| pause            | pause()<br> <br> <br>Return Value: void<br> <br>Pauses the video.                                                                                                                                                                                                                                                                                                                            |
| play             | play()<br> <br> <br>Return Value: void<br> <br>Plays the video.                                                                                                                                                                                                                                                                                                                              |
| prepare          | prepare()<br> <br> <br>Return Value: void<br> <br>Sets the video's coordinates and re-renders the map.                                                                                                                                                                                                                                                                                       |
| seek             | seek(seconds: number)<br> <br>Parameters<br> <br>1. seconds: number<br> <br>Return Value: void<br> <br>Sets playback to a timestamp, in seconds.                                                                                                                                                                                                                                             |
| serialize        | serialize()<br> <br> <br>Return Value: none                                                                                                                                                                                                                                                                                                                                                  |
| setCoordinates   | setCoordinates(coordinates: Coordinates)<br> <br>Parameters<br> <br>1. coordinates: Coordinates<br> <br>Return Value: [VideoSource](#videosource)<br> <br>Sets the image's coordinates and re-renders the map.                                                                                                                                                                               |
| setEventedParent | setEventedParent(parent: [Evented](./events#evented), data: any)<br> <br>Parameters<br> <br>1. parent: [Evented](./events#evented)<br>2. data: any<br> <br>Return Value: [VideoSource](#videosource)<br> <br>Bubble all events fired by this instance of Evented to this parent instance of Evented.                                                                                         |
| updateImage      | updateImage(options: { coordinates: Coordinates,url: string })<br> <br>Parameters<br> <br>1. options: { coordinates: Coordinates,url: string }<br> <br>Return Value: [VideoSource](#videosource)<br> <br>Updates the image URL and, optionally, the coordinates. To avoid having the image flash after changing, <br>set the `raster-fade-duration` paint property on the raster layer to 0. |

## Example

```ts
// add to map
map.addSource("some id", {
  type: "video",
  url: [
    "https://nextbillion.ai/blog/assets/baltimore-smoke.mp4",
    "https://nextbillion.ai/blog/assets/baltimore-smoke.webm",
  ],
  coordinates: [
    [-76.54, 39.18],
    [-76.52, 39.18],
    [-76.52, 39.17],
    [-76.54, 39.17],
  ],
});

// update
var mySource = map.getSource("some id");
mySource.setCoordinates([
  [-76.54335737228394, 39.18579907229748],
  [-76.52803659439087, 39.1838364847587],
  [-76.5295386314392, 39.17683392507606],
  [-76.54520273208618, 39.17876344106642],
]);

map.removeSource("some id"); // remove
```

## CanvasSource

A data source containing the contents of an HTML canvas. See CanvasSourceOptions for detailed documentation of options.

### Constructor

| Name         |                                                                                                                                                                                                                                                                                                      |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| CanvasSource | new CanvasSource(id: string, options: CanvasSourceSpecification, dispatcher: Dispatcher, eventedParent: [Evented](./events#evented))<br> <br>Parameters<br> <br>1. id: string<br>2. options: CanvasSourceSpecification<br>3. dispatcher: Dispatcher<br>4. eventedParent: [Evented](./events#evented) |

### Methods

| Method           |                                                                                                                                                                                                                                                                                                                                                                                                |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| fire             | fire(event: string \| Event, properties: any)<br> <br>Parameters<br> <br>1. event: string \| Event<br>2. properties: any<br> <br>Return Value: [CanvasSource](#canvassource)                                                                                                                                                                                                                   |
| getCanvas        | getCanvas()<br> <br> <br>Return Value: HTMLCanvasElement<br> <br>Returns the HTML `canvas` element.                                                                                                                                                                                                                                                                                            |
| hasTransition    | hasTransition()<br> <br> <br>Return Value: boolean                                                                                                                                                                                                                                                                                                                                             |
| listens          | listens(type: string)<br> <br>Parameters<br> <br>1. type: string<br> <br>Return Value: any<br> <br>Returns a true if this instance of Evented or any forwardeed instances of Evented have a listener for the specified type.                                                                                                                                                                   |
| load             | load()<br> <br> <br>Return Value: void<br> <br>Disables animation. The map will display a static copy of the canvas image.                                                                                                                                                                                                                                                                     |
| loadTile         | loadTile(tile: Tile, callback: Callback)<br> <br>Parameters<br> <br>1. tile: Tile<br>2. callback: Callback<br> <br>Return Value: void                                                                                                                                                                                                                                                          |
| loaded           | loaded()<br> <br> <br>Return Value: boolean                                                                                                                                                                                                                                                                                                                                                    |
| off              | off(type: string, listener: Listener)<br> <br>Parameters<br> <br>1. type: string<br>2. listener: Listener<br> <br>Return Value: [CanvasSource](#canvassource)<br> <br>Removes a previously registered event listener.                                                                                                                                                                          |
| on               | on(type: string, listener: Listener)<br> <br>Parameters<br> <br>1. type: string<br>2. listener: Listener<br> <br>Return Value: [CanvasSource](#canvassource)<br> <br>Adds a listener to a specified event type.                                                                                                                                                                                |
| onAdd            | onAdd(map: [Map](./map#map))<br> <br>Parameters<br> <br>1. map: [Map](./map#map)<br> <br>Return Value: void                                                                                                                                                                                                                                                                                    |
| onRemove         | onRemove()<br> <br> <br>Return Value: void                                                                                                                                                                                                                                                                                                                                                     |
| once             | once(type: string, listener: Listener)<br> <br>Parameters<br> <br>1. type: string<br>2. listener: Listener<br> <br>Return Value: [CanvasSource](#canvassource)<br> <br>Adds a listener that will be called only once to a specified event type. <br> <br>The listener will be called first time the event fires after the listener is registered.                                              |
| prepare          | prepare()<br> <br> <br>Return Value: void                                                                                                                                                                                                                                                                                                                                                      |
| serialize        | serialize()<br> <br> <br>Return Value: any                                                                                                                                                                                                                                                                                                                                                     |
| setCoordinates   | setCoordinates(coordinates: Coordinates)<br> <br>Parameters<br> <br>1. coordinates: Coordinates<br> <br>Return Value: [CanvasSource](#canvassource)<br> <br>Sets the image's coordinates and re-renders the map.                                                                                                                                                                               |
| setEventedParent | setEventedParent(parent: [Evented](./events#evented), data: any)<br> <br>Parameters<br> <br>1. parent: [Evented](./events#evented)<br>2. data: any<br> <br>Return Value: [CanvasSource](#canvassource)<br> <br>Bubble all events fired by this instance of Evented to this parent instance of Evented.                                                                                         |
| updateImage      | updateImage(options: { coordinates: Coordinates,url: string })<br> <br>Parameters<br> <br>1. options: { coordinates: Coordinates,url: string }<br> <br>Return Value: [CanvasSource](#canvassource)<br> <br>Updates the image URL and, optionally, the coordinates. To avoid having the image flash after changing, <br>set the `raster-fade-duration` paint property on the raster layer to 0. |

## Example

```ts
// add to map
map.addSource("some id", {
  type: "canvas",
  canvas: "idOfMyHTMLCanvas",
  animate: true,
  coordinates: [
    [-76.54, 39.18],
    [-76.52, 39.18],
    [-76.52, 39.17],
    [-76.54, 39.17],
  ],
});

// update
var mySource = map.getSource("some id");
mySource.setCoordinates([
  [-76.54335737228394, 39.18579907229748],
  [-76.52803659439087, 39.1838364847587],
  [-76.5295386314392, 39.17683392507606],
  [-76.54520273208618, 39.17876344106642],
]);

map.removeSource("some id"); // remove
```

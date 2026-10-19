## Marker

Creates a marker component

### Constructor

| Name   |                                                                                                                                                          |
| ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Marker | new Marker(options: MarkerOptions, legacyOptions: MarkerOptions)<br> <br>Parameters<br> <br>1. options: MarkerOptions<br>2. legacyOptions: MarkerOptions |

### Methods

| Method               |                                                                                                                                                                                                                                                                                                                                                                             |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| addTo                | addTo(map: [Map](./map#map))<br> <br>Parameters<br> <br>1. map: [Map](./map#map)<br> <br>Return Value: default<br> <br>Attaches the `Marker` to a `Map` object.                                                                                                                                                                                                             |
| fire                 | fire(event: string \| Event, properties: any)<br> <br>Parameters<br> <br>1. event: string \| Event<br>2. properties: any<br> <br>Return Value: default                                                                                                                                                                                                                      |
| getElement           | getElement()<br> <br> <br>Return Value: HTMLElement<br> <br>Returns the `Marker` 's HTML element.                                                                                                                                                                                                                                                                           |
| getLngLat            | getLngLat()<br> <br> <br>Return Value: [LngLat](./geography-and-geometry#lnglat)<br> <br>Get the marker's geographical location. <br> <br>The longitude of the result may differ by a multiple of 360 degrees from the longitude previously <br>set by `setLngLat` because `Marker` wraps the anchor longitude across copies of the world to keep <br>the marker on screen. |
| getOffset            | getOffset()<br> <br> <br>Return Value: Point<br> <br>Get the marker's offset.                                                                                                                                                                                                                                                                                               |
| getPitchAlignment    | getPitchAlignment()<br> <br> <br>Return Value: string<br> <br>Returns the current `pitchAlignment` property of the marker.                                                                                                                                                                                                                                                  |
| getPopup             | getPopup()<br> <br> <br>Return Value: default<br> <br>Returns the Popup instance that is bound to the Marker .                                                                                                                                                                                                                                                              |
| getRotation          | getRotation()<br> <br> <br>Return Value: number<br> <br>Returns the current rotation angle of the marker (in degrees).                                                                                                                                                                                                                                                      |
| getRotationAlignment | getRotationAlignment()<br> <br> <br>Return Value: string<br> <br>Returns the current `rotationAlignment` property of the marker.                                                                                                                                                                                                                                            |
| isDraggable          | isDraggable()<br> <br> <br>Return Value: boolean<br> <br>Returns true if the marker can be dragged                                                                                                                                                                                                                                                                          |
| listens              | listens(type: string)<br> <br>Parameters<br> <br>1. type: string<br> <br>Return Value: any<br> <br>Returns a true if this instance of Evented or any forwardeed instances of Evented have a listener for the specified type.                                                                                                                                                |
| off                  | off(type: string, listener: Listener)<br> <br>Parameters<br> <br>1. type: string<br>2. listener: Listener<br> <br>Return Value: default<br> <br>Removes a previously registered event listener.                                                                                                                                                                             |
| on                   | on(type: string, listener: Listener)<br> <br>Parameters<br> <br>1. type: string<br>2. listener: Listener<br> <br>Return Value: default<br> <br>Adds a listener to a specified event type.                                                                                                                                                                                   |
| once                 | once(type: string, listener: Listener)<br> <br>Parameters<br> <br>1. type: string<br>2. listener: Listener<br> <br>Return Value: default<br> <br>Adds a listener that will be called only once to a specified event type. <br> <br>The listener will be called first time the event fires after the listener is registered.                                                 |
| remove               | remove()<br> <br> <br>Return Value: default<br> <br>Removes the marker from a map                                                                                                                                                                                                                                                                                           |
| setDraggable         | setDraggable(shouldBeDraggable: boolean)<br> <br>Parameters<br> <br>1. shouldBeDraggable: boolean<br> <br>Return Value: default<br> <br>Sets the `draggable` property and functionality of the marker                                                                                                                                                                       |
| setEventedParent     | setEventedParent(parent: [Evented](./events#evented), data: any)<br> <br>Parameters<br> <br>1. parent: [Evented](./events#evented)<br>2. data: any<br> <br>Return Value: default<br> <br>Bubble all events fired by this instance of Evented to this parent instance of Evented.                                                                                            |
| setLngLat            | setLngLat(lnglat: [LngLatLike](./geography-and-geometry#interface-lnglatlike))<br> <br>Parameters<br> <br>1. lnglat: [LngLatLike](./geography-and-geometry#interface-lnglatlike)<br> <br>Return Value: default<br> <br>Set the marker's geographical position and move it.                                                                                                  |
| setOffset            | setOffset(offset: PointLike)<br> <br>Parameters<br> <br>1. offset: PointLike<br> <br>Return Value: default<br> <br>Sets the offset of the marker                                                                                                                                                                                                                            |
| setPitchAlignment    | setPitchAlignment(alignment: string)<br> <br>Parameters<br> <br>1. alignment: string<br> <br>Return Value: default<br> <br>Sets the `pitchAlignment` property of the marker.                                                                                                                                                                                                |
| setPopup             | setPopup(popup: default)<br> <br>Parameters<br> <br>1. popup: default<br> <br>Return Value: default<br> <br>Binds a Popup to the Marker .                                                                                                                                                                                                                                   |
| setRotation          | setRotation(rotation: number)<br> <br>Parameters<br> <br>1. rotation: number<br> <br>Return Value: default<br> <br>Sets the `rotation` property of the marker.                                                                                                                                                                                                              |
| setRotationAlignment | setRotationAlignment(alignment: string)<br> <br>Parameters<br> <br>1. alignment: string<br> <br>Return Value: default<br> <br>Sets the `rotationAlignment` property of the marker.                                                                                                                                                                                          |
| togglePopup          | togglePopup()<br> <br> <br>Return Value: default<br> <br>Opens or closes the Popup instance that is bound to the Marker , depending on the current state of the Popup .                                                                                                                                                                                                     |

## Example

```ts
var marker = new nextbillion.maps.Marker().setLngLat([30.5, 50.5]).addTo(map);
```

## Popup

A popup component.

### Constructor

| Name  |                                                                                      |
| ----- | ------------------------------------------------------------------------------------ |
| Popup | new Popup(options: PopupOptions)<br> <br>Parameters<br> <br>1. options: PopupOptions |

### Methods

| Method           |                                                                                                                                                                                                                                                                                                                                                                                            |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| addClassName     | addClassName(className: string)<br> <br>Parameters<br> <br>1. className: string<br> <br>Return Value: void<br> <br>Adds a CSS class to the popup container element.                                                                                                                                                                                                                        |
| addTo            | addTo(map: [Map](./map#map))<br> <br>Parameters<br> <br>1. map: [Map](./map#map)<br> <br>Return Value: default<br> <br>Adds the popup to a map.                                                                                                                                                                                                                                            |
| fire             | fire(event: string \| Event, properties: any)<br> <br>Parameters<br> <br>1. event: string \| Event<br>2. properties: any<br> <br>Return Value: default                                                                                                                                                                                                                                     |
| getElement       | getElement()<br> <br> <br>Return Value: HTMLElement<br> <br>Returns the `Popup` 's HTML element.                                                                                                                                                                                                                                                                                           |
| getLngLat        | getLngLat()<br> <br> <br>Return Value: [LngLat](./geography-and-geometry#lnglat)<br> <br>Returns the geographical location of the popup's anchor. <br> <br>The longitude of the result may differ by a multiple of 360 degrees from the longitude previously <br>set by `setLngLat` because `Popup` wraps the anchor longitude across copies of the world to keep <br>the popup on screen. |
| getMaxWidth      | getMaxWidth()<br> <br> <br>Return Value: string<br> <br>Returns the popup's maximum width.                                                                                                                                                                                                                                                                                                 |
| isOpen           | isOpen()<br> <br> <br>Return Value: boolean                                                                                                                                                                                                                                                                                                                                                |
| listens          | listens(type: string)<br> <br>Parameters<br> <br>1. type: string<br> <br>Return Value: any<br> <br>Returns a true if this instance of Evented or any forwardeed instances of Evented have a listener for the specified type.                                                                                                                                                               |
| off              | off(type: string, listener: Listener)<br> <br>Parameters<br> <br>1. type: string<br>2. listener: Listener<br> <br>Return Value: default<br> <br>Removes a previously registered event listener.                                                                                                                                                                                            |
| on               | on(type: string, listener: Listener)<br> <br>Parameters<br> <br>1. type: string<br>2. listener: Listener<br> <br>Return Value: default<br> <br>Adds a listener to a specified event type.                                                                                                                                                                                                  |
| once             | once(type: string, listener: Listener)<br> <br>Parameters<br> <br>1. type: string<br>2. listener: Listener<br> <br>Return Value: default<br> <br>Adds a listener that will be called only once to a specified event type. <br> <br>The listener will be called first time the event fires after the listener is registered.                                                                |
| remove           | remove()<br> <br> <br>Return Value: default<br> <br>Removes the popup from the map it has been added to.                                                                                                                                                                                                                                                                                   |
| removeClassName  | removeClassName(className: string)<br> <br>Parameters<br> <br>1. className: string<br> <br>Return Value: void<br> <br>Removes a CSS class from the popup container element.                                                                                                                                                                                                                |
| setDOMContent    | setDOMContent(htmlNode: Node)<br> <br>Parameters<br> <br>1. htmlNode: Node<br> <br>Return Value: default<br> <br>Sets the popup's content to the element provided as a DOM node.                                                                                                                                                                                                           |
| setEventedParent | setEventedParent(parent: [Evented](./events#evented), data: any)<br> <br>Parameters<br> <br>1. parent: [Evented](./events#evented)<br>2. data: any<br> <br>Return Value: default<br> <br>Bubble all events fired by this instance of Evented to this parent instance of Evented.                                                                                                           |
| setHTML          | setHTML(html: string)<br> <br>Parameters<br> <br>1. html: string<br> <br>Return Value: default<br> <br>Sets the popup's content to the HTML provided as a string. <br> <br>This method does not perform HTML filtering or sanitization, and must be <br>used only with trusted content. Consider Popup#setText if <br>the content is an untrusted text string.                             |
| setLngLat        | setLngLat(lnglat: [LngLatLike](./geography-and-geometry#interface-lnglatlike))<br> <br>Parameters<br> <br>1. lnglat: [LngLatLike](./geography-and-geometry#interface-lnglatlike)<br> <br>Return Value: default<br> <br>Sets the geographical location of the popup's anchor, and moves the popup to it. Replaces trackPointer() behavior.                                                  |
| setMaxWidth      | setMaxWidth(maxWidth: string)<br> <br>Parameters<br> <br>1. maxWidth: string<br> <br>Return Value: default<br> <br>Sets the popup's maximum width. This is setting the CSS property `max-width` . <br>Available values can be found here: [https://developer.mozilla.org/en-US/docs/Web/CSS/max-width](https://developer.mozilla.org/en-US/docs/Web/CSS/max-width)                         |
| setOffset        | setOffset(offset: Offset)<br> <br>Parameters<br> <br>1. offset: Offset<br> <br>Return Value: default<br> <br>Sets the popup's offset.                                                                                                                                                                                                                                                      |
| setText          | setText(text: string)<br> <br>Parameters<br> <br>1. text: string<br> <br>Return Value: default<br> <br>Sets the popup's content to a string of text. <br> <br>This function creates a [Text](https://developer.mozilla.org/en-US/docs/Web/API/Text) node in the DOM, <br>so it cannot insert raw HTML. Use this method for security against XSS <br>if the popup content is user-provided. |
| toggleClassName  | toggleClassName(className: string)<br> <br>Parameters<br> <br>1. className: string<br> <br>Return Value: boolean<br> <br>Add or remove the given CSS class on the popup container, depending on whether the container currently has that class.                                                                                                                                            |
| trackPointer     | trackPointer()<br> <br> <br>Return Value: default<br> <br>Tracks the popup anchor to the cursor position on screens with a pointer device (it will be hidden on touchscreens). Replaces the `setLngLat` behavior. <br>For most use cases, set `closeOnClick` and `closeButton` to `false` .                                                                                                |

## Example

```ts
var markerHeight = 50,
  markerRadius = 10,
  linearOffset = 25;
var popupOffsets = {
  top: [0, 0],
  "top-left": [0, 0],
  "top-right": [0, 0],
  bottom: [0, -markerHeight],
  "bottom-left": [
    linearOffset,
    (markerHeight - markerRadius + linearOffset) * -1,
  ],
  "bottom-right": [
    -linearOffset,
    (markerHeight - markerRadius + linearOffset) * -1,
  ],
  left: [markerRadius, (markerHeight - markerRadius) * -1],
  right: [-markerRadius, (markerHeight - markerRadius) * -1],
};
var popup = new nextbillion.maps.Popup({
  offset: popupOffsets,
  className: "my-class",
})
  .setLngLat(e.lngLat)
  .setHTML("<h1>Hello World!</h1>")
  .setMaxWidth("300px")
  .addTo(map);
```

## NavigationControl

A `NavigationControl` control contains zoom buttons and a compass.

### Constructor

| Name              |                                                                                                            |
| ----------------- | ---------------------------------------------------------------------------------------------------------- |
| NavigationControl | new NavigationControl(options: NavigationOptions)<br> <br>Parameters<br> <br>1. options: NavigationOptions |

### Methods

| Method   |                                                                                                                                                                                                                                                                                      |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| onAdd    | onAdd(map: [Map](./map#map))<br> <br>Parameters<br> <br>1. map: [Map](./map#map)<br> <br>Return Value: HTMLElement<br> <br>Register a control on the map and give it a chance to register event listeners <br>and resources. This method is called by Map#addControl <br>internally. |
| onRemove | onRemove()<br> <br> <br>Return Value: void<br> <br>Unregister a control on the map and give it a chance to detach event listeners <br>and resources. This method is called by Map#removeControl <br>internally.                                                                      |

## Example

```ts
var nav = new nextbillion.maps.NavigationControl();
map.addControl(nav, "top-left");
```

## GeolocateControl

A `GeolocateControl` control provides a button that uses the browser's geolocation  
API to locate the user on the map.

Not all browsers support geolocation,  
and some users may disable the feature. Geolocation support for modern  
browsers including Chrome requires sites to be served over HTTPS. If  
geolocation support is not available, the GeolocateControl will show  
as disabled.

The zoom level applied will depend on the accuracy of the geolocation provided by the device.

The GeolocateControl has two modes. If `trackUserLocation` is `false` (default) the control acts as a button, which when pressed will set the map's camera to target the user location. If the user moves, the map won't update. This is most suited for the desktop. If `trackUserLocation` is `true` the control acts as a toggle button that when active the user's location is actively monitored for changes. In this mode the GeolocateControl has three interaction states:  
\* active - the map's camera automatically updates as the user's location changes, keeping the location dot in the center. Initial state and upon clicking the `GeolocateControl` button.  
\* passive - the user's location dot automatically updates, but the map's camera does not. Occurs upon the user initiating a map movement.  
\* disabled - occurs if Geolocation is not available, disabled or denied.

These interaction states can't be controlled programmatically, rather they are set based on user interactions.

### Constructor

| Name             |                                                                                                         |
| ---------------- | ------------------------------------------------------------------------------------------------------- |
| GeolocateControl | new GeolocateControl(options: GeolocateOptions)<br> <br>Parameters<br> <br>1. options: GeolocateOptions |

### Methods

| Method           |                                                                                                                                                                                                                                                                                                                                                           |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| fire             | fire(event: string \| Event, properties: any)<br> <br>Parameters<br> <br>1. event: string \| Event<br>2. properties: any<br> <br>Return Value: [GeolocateControl](#geolocatecontrol)                                                                                                                                                                      |
| listens          | listens(type: string)<br> <br>Parameters<br> <br>1. type: string<br> <br>Return Value: any<br> <br>Returns a true if this instance of Evented or any forwardeed instances of Evented have a listener for the specified type.                                                                                                                              |
| off              | off(type: string, listener: Listener)<br> <br>Parameters<br> <br>1. type: string<br>2. listener: Listener<br> <br>Return Value: [GeolocateControl](#geolocatecontrol)<br> <br>Removes a previously registered event listener.                                                                                                                             |
| on               | on(type: string, listener: Listener)<br> <br>Parameters<br> <br>1. type: string<br>2. listener: Listener<br> <br>Return Value: [GeolocateControl](#geolocatecontrol)<br> <br>Adds a listener to a specified event type.                                                                                                                                   |
| onAdd            | onAdd(map: [Map](./map#map))<br> <br>Parameters<br> <br>1. map: [Map](./map#map)<br> <br>Return Value: HTMLElement<br> <br>Register a control on the map and give it a chance to register event listeners <br>and resources. This method is called by Map#addControl <br>internally.                                                                      |
| onRemove         | onRemove()<br> <br> <br>Return Value: void<br> <br>Unregister a control on the map and give it a chance to detach event listeners <br>and resources. This method is called by Map#removeControl <br>internally.                                                                                                                                           |
| once             | once(type: string, listener: Listener)<br> <br>Parameters<br> <br>1. type: string<br>2. listener: Listener<br> <br>Return Value: [GeolocateControl](#geolocatecontrol)<br> <br>Adds a listener that will be called only once to a specified event type. <br> <br>The listener will be called first time the event fires after the listener is registered. |
| setEventedParent | setEventedParent(parent: [Evented](./events#evented), data: any)<br> <br>Parameters<br> <br>1. parent: [Evented](./events#evented)<br>2. data: any<br> <br>Return Value: [GeolocateControl](#geolocatecontrol)<br> <br>Bubble all events fired by this instance of Evented to this parent instance of Evented.                                            |
| trigger          | trigger()<br> <br> <br>Return Value: boolean<br> <br>Programmatically request and move the map to the user's location.                                                                                                                                                                                                                                    |

## Example

```ts
map.addControl(
  new nextbillion.maps.GeolocateControl({
    positionOptions: {
      enableHighAccuracy: true,
    },
    trackUserLocation: true,
  }),
);
```

## AttributionControl

An `AttributionControl` control presents the map's attribution information.

### Constructor

| Name               |                                                                                                               |
| ------------------ | ------------------------------------------------------------------------------------------------------------- |
| AttributionControl | new AttributionControl(options: AttributionOptions)<br> <br>Parameters<br> <br>1. options: AttributionOptions |

### Methods

| Method             |                                                                                                                                                                                                                                                                                                                           |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| getDefaultPosition | getDefaultPosition()<br> <br> <br>Return Value: ControlPosition<br> <br>Optionally provide a default position for this control. If this method <br>is implemented and Map#addControl is called without the `position` <br>parameter, the value returned by getDefaultPosition will be used as the <br>control's position. |
| onAdd              | onAdd(map: [Map](./map#map))<br> <br>Parameters<br> <br>1. map: [Map](./map#map)<br> <br>Return Value: HTMLElement<br> <br>Register a control on the map and give it a chance to register event listeners <br>and resources. This method is called by Map#addControl <br>internally.                                      |
| onRemove           | onRemove()<br> <br> <br>Return Value: void<br> <br>Unregister a control on the map and give it a chance to detach event listeners <br>and resources. This method is called by Map#removeControl <br>internally.                                                                                                           |

## Example

```ts
var map = new nextbillion.maps.Map({ attributionControl: false }).addControl(
  new nextbillion.maps.AttributionControl({
    compact: true,
  }),
);
```

## FullscreenControl

A `FullscreenControl` control contains a button for toggling the map in and out of fullscreen mode.

### Constructor

| Name              |                                                                                                            |
| ----------------- | ---------------------------------------------------------------------------------------------------------- |
| FullscreenControl | new FullscreenControl(options: FullscreenOptions)<br> <br>Parameters<br> <br>1. options: FullscreenOptions |

### Methods

| Method   |                                                                                                                                                                                                                                                                                      |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| onAdd    | onAdd(map: [Map](./map#map))<br> <br>Parameters<br> <br>1. map: [Map](./map#map)<br> <br>Return Value: HTMLElement<br> <br>Register a control on the map and give it a chance to register event listeners <br>and resources. This method is called by Map#addControl <br>internally. |
| onRemove | onRemove()<br> <br> <br>Return Value: void<br> <br>Unregister a control on the map and give it a chance to detach event listeners <br>and resources. This method is called by Map#removeControl <br>internally.                                                                      |

## Example

```ts
map.addControl(
  new nextbillion.maps.FullscreenControl({
    container: document.querySelector("body"),
  }),
);
```

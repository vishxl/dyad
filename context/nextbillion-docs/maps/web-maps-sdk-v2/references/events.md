## Evented

Methods mixed in to other classes for event capabilities.

### Methods

| Method           |                                                                                                                                                                                                                                                                                                                                         |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| fire             | fire(event: string \| Event, properties: any)<br> <br>Parameters<br> <br>1. event: string \| Event<br>2. properties: any<br> <br>Return Value: [Evented](#evented)                                                                                                                                                                      |
| listens          | listens(type: string)<br> <br>Parameters<br> <br>1. type: string<br> <br>Return Value: any<br> <br>Returns a true if this instance of Evented or any forwardeed instances of Evented have a listener for the specified type.                                                                                                            |
| off              | off(type: string, listener: Listener)<br> <br>Parameters<br> <br>1. type: string<br>2. listener: Listener<br> <br>Return Value: [Evented](#evented)<br> <br>Removes a previously registered event listener.                                                                                                                             |
| on               | on(type: string, listener: Listener)<br> <br>Parameters<br> <br>1. type: string<br>2. listener: Listener<br> <br>Return Value: [Evented](#evented)<br> <br>Adds a listener to a specified event type.                                                                                                                                   |
| once             | once(type: string, listener: Listener)<br> <br>Parameters<br> <br>1. type: string<br>2. listener: Listener<br> <br>Return Value: [Evented](#evented)<br> <br>Adds a listener that will be called only once to a specified event type. <br> <br>The listener will be called first time the event fires after the listener is registered. |
| setEventedParent | setEventedParent(parent: [Evented](#evented), data: any)<br> <br>Parameters<br> <br>1. parent: [Evented](#evented)<br>2. data: any<br> <br>Return Value: [Evented](#evented)<br> <br>Bubble all events fired by this instance of Evented to this parent instance of Evented.                                                            |

## MapMouseEvent

`MapMouseEvent` is the event type for mouse-related map events.

### Constructor

| Name          |                                                                                                                                                                                                                     |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| MapMouseEvent | new MapMouseEvent(type: string, map: [Map](./map#map), originalEvent: MouseEvent, data: any)<br> <br>Parameters<br> <br>1. type: string<br>2. map: [Map](./map#map)<br>3. originalEvent: MouseEvent<br>4. data: any |

### Properties

| Name             | Type    |
| ---------------- | ------- |
| defaultPrevented | boolean |

### Methods

| Method         |                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| preventDefault | preventDefault()<br> <br> <br>Return Value: void<br> <br>Prevents subsequent default processing of the event by the map. <br> <br>Calling this method will prevent the following default map behaviors: <br> <br>\* On `mousedown` events, the behavior of DragPanHandler <br>\* On `mousedown` events, the behavior of DragRotateHandler <br>\* On `mousedown` events, the behavior of BoxZoomHandler <br>\* On `dblclick` events, the behavior of DoubleClickZoomHandler |

## Example

// The

## MapTouchEvent

`MapTouchEvent` is the event type for touch-related map events.

### Constructor

| Name          |                                                                                                                                                                                          |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| MapTouchEvent | new MapTouchEvent(type: string, map: [Map](./map#map), originalEvent: TouchEvent)<br> <br>Parameters<br> <br>1. type: string<br>2. map: [Map](./map#map)<br>3. originalEvent: TouchEvent |

### Properties

| Name             | Type    |
| ---------------- | ------- |
| defaultPrevented | boolean |

### Methods

| Method         |                                                                                                                                                                                                                                                                                                                                                  |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| preventDefault | preventDefault()<br> <br> <br>Return Value: void<br> <br>Prevents subsequent default processing of the event by the map. <br> <br>Calling this method will prevent the following default map behaviors: <br> <br>\* On `touchstart` events, the behavior of DragPanHandler <br>\* On `touchstart` events, the behavior of TouchZoomRotateHandler |

## Interface MapDataEvent

A `MapDataEvent` object is emitted with the Map.event  
and Map.event events. Possible values for  
`dataType` s are:

\- `'source'` : The non-tile data associated with any source  
\- `'style'` : The style used by the map

### Properties

| Name           |                         |
| -------------- | ----------------------- |
| dataType       | Type: string            |
| sourceDataType | Type: MapSourceDataType |
| type           | Type: string            |

## MapWheelEvent

`MapWheelEvent` is the event type for the `wheel` map event.

### Constructor

| Name          |                                                                                                                                                                                          |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| MapWheelEvent | new MapWheelEvent(type: string, map: [Map](./map#map), originalEvent: WheelEvent)<br> <br>Parameters<br> <br>1. type: string<br>2. map: [Map](./map#map)<br>3. originalEvent: WheelEvent |

### Properties

| Name             | Type    |
| ---------------- | ------- |
| defaultPrevented | boolean |

### Methods

| Method         |                                                                                                                                                                                                            |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| preventDefault | preventDefault()<br> <br> <br>Return Value: void<br> <br>Prevents subsequent default processing of the event by the map. <br> <br>Calling this method will prevent the the behavior of ScrollZoomHandler . |

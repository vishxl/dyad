## BoxZoomHandler

The `BoxZoomHandler` allows the user to zoom the map to fit within a bounding box.  
The bounding box is defined by clicking and holding `shift` while dragging the cursor.

### Constructor

| Name           |                                                                                                                                                                              |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| BoxZoomHandler | new BoxZoomHandler(map: [Map](./map#map), options: { clickTolerance: number })<br> <br>Parameters<br> <br>1. map: [Map](./map#map)<br>2. options: { clickTolerance: number } |

### Methods

| Method          |                                                                                                                                                             |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| disable         | disable()<br> <br> <br>Return Value: void<br> <br>Disables the "box zoom" interaction.                                                                      |
| enable          | enable()<br> <br> <br>Return Value: void<br> <br>Enables the "box zoom" interaction.                                                                        |
| isActive        | isActive()<br> <br> <br>Return Value: boolean<br> <br>Returns a Boolean indicating whether the "box zoom" interaction is active, i.e. currently being used. |
| isEnabled       | isEnabled()<br> <br> <br>Return Value: boolean<br> <br>Returns a Boolean indicating whether the "box zoom" interaction is enabled.                          |
| keydown         | keydown(e: KeyboardEvent)<br> <br>Parameters<br> <br>1. e: KeyboardEvent<br> <br>Return Value: void                                                         |
| mousedown       | mousedown(e: MouseEvent, point: Point)<br> <br>Parameters<br> <br>1. e: MouseEvent<br>2. point: Point<br> <br>Return Value: void                            |
| mousemoveWindow | mousemoveWindow(e: MouseEvent, point: Point)<br> <br>Parameters<br> <br>1. e: MouseEvent<br>2. point: Point<br> <br>Return Value: void                      |
| mouseupWindow   | mouseupWindow(e: MouseEvent, point: Point)<br> <br>Parameters<br> <br>1. e: MouseEvent<br>2. point: Point<br> <br>Return Value: none                        |
| reset           | reset()<br> <br> <br>Return Value: void                                                                                                                     |

## ScrollZoomHandler

The `ScrollZoomHandler` allows the user to zoom the map by scrolling.

### Constructor

| Name              |                                                                                                                                                         |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ScrollZoomHandler | new ScrollZoomHandler(map: [Map](./map#map), handler: HandlerManager)<br> <br>Parameters<br> <br>1. map: [Map](./map#map)<br>2. handler: HandlerManager |

### Methods

| Method           |                                                                                                                                                                   |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| disable          | disable()<br> <br> <br>Return Value: void<br> <br>Disables the "scroll to zoom" interaction.                                                                      |
| enable           | enable(options: any)<br> <br>Parameters<br> <br>1. options: any<br> <br>Return Value: void<br> <br>Enables the "scroll to zoom" interaction.                      |
| isActive         | isActive()<br> <br> <br>Return Value: boolean                                                                                                                     |
| isEnabled        | isEnabled()<br> <br> <br>Return Value: boolean<br> <br>Returns a Boolean indicating whether the "scroll to zoom" interaction is enabled.                          |
| isZooming        | isZooming()<br> <br> <br>Return Value: boolean                                                                                                                    |
| renderFrame      | renderFrame()<br> <br> <br>Return Value: none                                                                                                                     |
| reset            | reset()<br> <br> <br>Return Value: void                                                                                                                           |
| setWheelZoomRate | setWheelZoomRate(wheelZoomRate: number)<br> <br>Parameters<br> <br>1. wheelZoomRate: number<br> <br>Return Value: void<br> <br>Set the zoom rate of a mouse wheel |
| setZoomRate      | setZoomRate(zoomRate: number)<br> <br>Parameters<br> <br>1. zoomRate: number<br> <br>Return Value: void<br> <br>Set the zoom rate of a trackpad                   |
| wheel            | wheel(e: WheelEvent)<br> <br>Parameters<br> <br>1. e: WheelEvent<br> <br>Return Value: void                                                                       |

## DragPanHandler

The `DragPanHandler` allows the user to pan the map by clicking and dragging  
the cursor.

### Constructor

| Name           |                                                                                                                                                                                         |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| DragPanHandler | new DragPanHandler(el: HTMLElement, mousePan: MousePanHandler, touchPan: default)<br> <br>Parameters<br> <br>1. el: HTMLElement<br>2. mousePan: MousePanHandler<br>3. touchPan: default |

### Methods

| Method    |                                                                                                                                                                 |
| --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| disable   | disable()<br> <br> <br>Return Value: void<br> <br>Disables the "drag to pan" interaction.                                                                       |
| enable    | enable(options: DragPanOptions)<br> <br>Parameters<br> <br>1. options: DragPanOptions<br> <br>Return Value: void<br> <br>Enables the "drag to pan" interaction. |
| isActive  | isActive()<br> <br> <br>Return Value: boolean<br> <br>Returns a Boolean indicating whether the "drag to pan" interaction is active, i.e. currently being used.  |
| isEnabled | isEnabled()<br> <br> <br>Return Value: boolean<br> <br>Returns a Boolean indicating whether the "drag to pan" interaction is enabled.                           |

## DragRotateHandler

The `DragRotateHandler` allows the user to rotate the map by clicking and  
dragging the cursor while holding the right mouse button or `ctrl` key.

### Constructor

| Name              |                                                                                                                                                                                                                                                                            |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| DragRotateHandler | new DragRotateHandler(options: { pitchWithRotate: boolean }, mouseRotate: MouseRotateHandler, mousePitch: MousePitchHandler)<br> <br>Parameters<br> <br>1. options: { pitchWithRotate: boolean }<br>2. mouseRotate: MouseRotateHandler<br>3. mousePitch: MousePitchHandler |

### Methods

| Method    |                                                                                                                                                                   |
| --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| disable   | disable()<br> <br> <br>Return Value: void<br> <br>Disables the "drag to rotate" interaction.                                                                      |
| enable    | enable()<br> <br> <br>Return Value: void<br> <br>Enables the "drag to rotate" interaction.                                                                        |
| isActive  | isActive()<br> <br> <br>Return Value: boolean<br> <br>Returns a Boolean indicating whether the "drag to rotate" interaction is active, i.e. currently being used. |
| isEnabled | isEnabled()<br> <br> <br>Return Value: boolean<br> <br>Returns a Boolean indicating whether the "drag to rotate" interaction is enabled.                          |

## KeyboardHandler

The `KeyboardHandler` allows the user to zoom, rotate, and pan the map using  
the following keyboard shortcuts:

\- `=` / `+` : Increase the zoom level by 1.  
\- `Shift-=` / `Shift-+` : Increase the zoom level by 2.  
\- `-` : Decrease the zoom level by 1.  
\- `Shift--` : Decrease the zoom level by 2.  
\- Arrow keys: Pan by 100 pixels.  
\- `Shift+⇢` : Increase the rotation by 15 degrees.  
\- `Shift+⇠` : Decrease the rotation by 15 degrees.  
\- `Shift+⇡` : Increase the pitch by 10 degrees.  
\- `Shift+⇣` : Decrease the pitch by 10 degrees.

### Methods

| Method          |                                                                                                                                                                |
| --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| disable         | disable()<br> <br> <br>Return Value: void<br> <br>Disables the "keyboard rotate and zoom" interaction.                                                         |
| disableRotation | disableRotation()<br> <br> <br>Return Value: void<br> <br>Disables the "keyboard pan/rotate" interaction, leaving the <br>"keyboard zoom" interaction enabled. |
| enable          | enable()<br> <br> <br>Return Value: void<br> <br>Enables the "keyboard rotate and zoom" interaction.                                                           |
| enableRotation  | enableRotation()<br> <br> <br>Return Value: void<br> <br>Enables the "keyboard pan/rotate" interaction.                                                        |
| isActive        | isActive()<br> <br> <br>Return Value: boolean<br> <br>Returns true if the handler is enabled and has detected the start of a <br>zoom/rotate gesture.          |
| isEnabled       | isEnabled()<br> <br> <br>Return Value: boolean<br> <br>Returns a Boolean indicating whether the "keyboard rotate and zoom" <br>interaction is enabled.         |
| keydown         | keydown(e: KeyboardEvent)<br> <br>Parameters<br> <br>1. e: KeyboardEvent<br> <br>Return Value: none                                                            |
| reset           | reset()<br> <br> <br>Return Value: void                                                                                                                        |

## DoubleClickZoomHandler

The `DoubleClickZoomHandler` allows the user to zoom the map at a point by  
double clicking or double tapping.

### Constructor

| Name                   |                                                                                                                                          |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| DoubleClickZoomHandler | new DoubleClickZoomHandler(clickZoom: default, TapZoom: default)<br> <br>Parameters<br> <br>1. clickZoom: default<br>2. TapZoom: default |

### Methods

| Method    |                                                                                                                                                                         |
| --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| disable   | disable()<br> <br> <br>Return Value: void<br> <br>Disables the "double click to zoom" interaction.                                                                      |
| enable    | enable()<br> <br> <br>Return Value: void<br> <br>Enables the "double click to zoom" interaction.                                                                        |
| isActive  | isActive()<br> <br> <br>Return Value: boolean<br> <br>Returns a Boolean indicating whether the "double click to zoom" interaction is active, i.e. currently being used. |
| isEnabled | isEnabled()<br> <br> <br>Return Value: boolean<br> <br>Returns a Boolean indicating whether the "double click to zoom" interaction is enabled.                          |

## TouchZoomRotateHandler

The `TouchZoomRotateHandler` allows the user to zoom and rotate the map by  
pinching on a touchscreen.

They can zoom with one finger by double tapping and dragging. On the second tap,  
hold the finger down and drag up or down to zoom in or out.

### Constructor

| Name                   |                                                                                                                                                                                                                                                                                  |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| TouchZoomRotateHandler | new TouchZoomRotateHandler(el: HTMLElement, touchZoom: TouchZoomHandler, touchRotate: TouchRotateHandler, tapDragZoom: default)<br> <br>Parameters<br> <br>1. el: HTMLElement<br>2. touchZoom: TouchZoomHandler<br>3. touchRotate: TouchRotateHandler<br>4. tapDragZoom: default |

### Methods

| Method          |                                                                                                                                                                                      |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| disable         | disable()<br> <br> <br>Return Value: void<br> <br>Disables the "pinch to rotate and zoom" interaction.                                                                               |
| disableRotation | disableRotation()<br> <br> <br>Return Value: void<br> <br>Disables the "pinch to rotate" interaction, leaving the "pinch to zoom" <br>interaction enabled.                           |
| enable          | enable(options: { around: center })<br> <br>Parameters<br> <br>1. options: { around: center }<br> <br>Return Value: void<br> <br>Enables the "pinch to rotate and zoom" interaction. |
| enableRotation  | enableRotation()<br> <br> <br>Return Value: void<br> <br>Enables the "pinch to rotate" interaction.                                                                                  |
| isActive        | isActive()<br> <br> <br>Return Value: boolean<br> <br>Returns true if the handler is enabled and has detected the start of a zoom/rotate gesture.                                    |
| isEnabled       | isEnabled()<br> <br> <br>Return Value: boolean<br> <br>Returns a Boolean indicating whether the "pinch to rotate and zoom" interaction is enabled.                                   |

## TouchPitchHandler

The `TouchPitchHandler` allows the user to pitch the map by dragging up and down with two fingers.

### Constructor

| Name              |                                                                                                  |
| ----------------- | ------------------------------------------------------------------------------------------------ |
| TouchPitchHandler | new TouchPitchHandler(map: [Map](./map#map))<br> <br>Parameters<br> <br>1. map: [Map](./map#map) |

### Methods

| Method                  |                                                                                                                                                                                                            |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| disable                 | disable()<br> <br> <br>Return Value: void                                                                                                                                                                  |
| enable                  | enable(options: { around: center })<br> <br>Parameters<br> <br>1. options: { around: center }<br> <br>Return Value: void                                                                                   |
| gestureBeginsVertically | gestureBeginsVertically(vectorA: Point, vectorB: Point, timeStamp: number)<br> <br>Parameters<br> <br>1. vectorA: Point<br>2. vectorB: Point<br>3. timeStamp: number<br> <br>Return Value: none            |
| isActive                | isActive()<br> <br> <br>Return Value: boolean                                                                                                                                                              |
| isEnabled               | isEnabled()<br> <br> <br>Return Value: boolean                                                                                                                                                             |
| reset                   | reset()<br> <br> <br>Return Value: void                                                                                                                                                                    |
| touchcancel             | touchcancel()<br> <br> <br>Return Value: void                                                                                                                                                              |
| touchend                | touchend(e: TouchEvent, points: Array<Point>, mapTouches: Array<Touch>)<br> <br>Parameters<br> <br>1. e: TouchEvent<br>2. points: Array<Point><br>3. mapTouches: Array<Touch><br> <br>Return Value: void   |
| touchmove               | touchmove(e: TouchEvent, points: Array<Point>, mapTouches: Array<Touch>)<br> <br>Parameters<br> <br>1. e: TouchEvent<br>2. points: Array<Point><br>3. mapTouches: Array<Touch><br> <br>Return Value: none  |
| touchstart              | touchstart(e: TouchEvent, points: Array<Point>, mapTouches: Array<Touch>)<br> <br>Parameters<br> <br>1. e: TouchEvent<br>2. points: Array<Point><br>3. mapTouches: Array<Touch><br> <br>Return Value: void |

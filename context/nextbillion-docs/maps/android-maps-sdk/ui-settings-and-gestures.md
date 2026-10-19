# UI Settings and Gestures

The Android Maps SDK provides a comprehensive set of tools for customizing the look and feel of your map, as well as the interactions your users can have with it. With the SDK's UI settings, you can easily customize the visual aspects of your map, such as the color scheme, the visibility of certain UI elements, and more. Additionally, the SDK provides a range of gesture options, allowing you to specify the types of interactions your users can have with the map, such as panning, zooming, and more. With these tools, you can create a truly unique and interactive map experience for your users.

## UI settings

UiSettings is an interface to manage views(Compass, Logo, and Attribution), gesture flags, and gesture animations.
UiSettings allows developers to

1. modify the visibility, gravity, and margins to
   - Compass view
   - Logo
   - Attribution view

2. Enable or disable gestures
   - Rotate
   - Tilt
   - Zoom
   - Scroll
   - Horizontal scroll
   - Double tap
   - Quick zoom

3. Enable or disable gesture animations
   - Scale velocity animation
   - Rotate velocity animation
   - Fling velocity animation

## UI control

The Android Maps SDK offers a comprehensive set of tools for controlling the user interface (UI) of your map, allowing you to customize its appearance and user interactions. With the SDK's UI settings, you have the flexibility to tailor the visual aspects of your map to your specific requirements. You can modify the color scheme, visibility of UI elements and more.
One of the key components for managing the UI is the UiSettings interface. It provides developers with the ability to handle various views, gesture flags, and gesture animations associated with the map.
With UiSettings, you can:

Manage the visibility, gravity, and margins of the following views:

- Compass view: Control the display of a compass indicating the map's orientation.
- Logo: Choose whether to show the logo of the mapping service on the map.
- Attribution view: Determine the visibility of attribution information on the map.

Enable or disable specific gestures, including:

- Rotate: Allow users to rotate the map.
- Tilt: Enable tilting the map for a different perspective.
- Zoom: Allow users to zoom in and out.
- Scroll: Enable panning or dragging the map.
- Horizontal scroll: Enable horizontal panning of the map.
- Double tap: Allow users to double-tap to zoom in and out quickly.
- Quick zoom: Enable quick zooming with a two-finger double-tap gesture.

Enable or disable gesture animations, including:

- Scale velocity animation: Control the animation when scaling the map.
- Rotate velocity animation: Specify animation behavior when rotating the map.
- Fling velocity animation: Control the animation when flinging the map.

By leveraging these UI control features, you can create a truly unique and interactive map experience for your users. Take advantage of the Android Maps SDK to customize your map's appearance and define the user interactions that best suit your application's needs.

## Gestures

The **NextbillionMap** supports gestures below:

1. Rotation gesture
   - Hold two fingers down on the screen and rotate to adjust the bearing

2. Zoom gesture
   - Hold two fingers and pinch to adjust the zoom level.

3. Tilt Gesture/Pitch
   - Hold two fingers and move vertically to adjust the tilt/pitch

4. Scroll gesture
5. Double tap gesture
   - Double tap with one finger to zoom in, double tap with two fingers to zoom out.

6. Quick zoom gesture
   - Double tap and drag up to zoom out, and drag down to zoom in.

### Enable and disable gestures

```
UiSettings uiSettings = nextbillionMap.getUiSettings();

//Rotation
uiSettings.setRotateGesturesEnabled(enable);

//Tilt
uiSettings.setTiltGesturesEnabled(enable);

//Zoom
uiSettings.setZoomGesturesEnabled(enable);

//Scroll
uiSettings.setScrollGesturesEnabled(enable);

//Double tap
uiSettings.setDoubleTapGesturesEnabled(enable);

//Quick Zoom
uiSettings.setQuickZoomGesturesEnabled(enable);

//Horizontal Scroll
uiSettings.setHorizontalScrollGesturesEnabled(enable);

//All gestures
uiSettings.setAllGesturesEnabled(enable);
```

The above code is a sample code demonstrating how to enable or disable gestures in the Nextbillion Android Maps SDK. By using the getUiSettings method, you can access the UiSettings interface and control different gestures like rotation, tilt, zoom, scroll, double tap, quick zoom, and horizontal scroll. Additionally, you can also enable or disable all gestures at once by using the setAllGesturesEnabled method with a boolean value as its argument.

### Register listener to gesture events

The gesture flags in UiSettings only allow developers to switch a specific gesture on and off, to listen to any of those gestures, we need to register the listener to **NextbillionMap**

```
public void registerListeners() {
 nextbillionMap.addOnMoveListener(new NextbillionMap.OnMoveListener() {
   @Override
   public void onMoveBegin(@NonNull MoveGestureDetector detector) {
   }

   @Override
   public void onMove(@NonNull MoveGestureDetector detector) {
   }

   @Override
   public void onMoveEnd(@NonNull MoveGestureDetector detector) {
   }
 });

 nextbillionMap.addOnScaleListener(new NextbillionMap.OnScaleListener() {
   @Override
   public void onScaleBegin(@NonNull StandardScaleGestureDetector detector) {
   }

   @Override
   public void onScale(@NonNull StandardScaleGestureDetector detector) {
   }

   @Override
   public void onScaleEnd(@NonNull StandardScaleGestureDetector detector) {
   }
 });

 nextbillionMap.addOnRotateListener(new NextbillionMap.OnRotateListener() {
   @Override
   public void onRotateBegin(@NonNull RotateGestureDetector detector) {
   }

   @Override
   public void onRotate(@NonNull RotateGestureDetector detector) {
   }

   @Override
   public void onRotateEnd(@NonNull RotateGestureDetector detector) {
   }
 });

 nextbillionMap.addOnShoveListener(new NextbillionMap.OnShoveListener() {
   @Override
   public void onShoveBegin(@NonNull ShoveGestureDetector detector) {
   }

   @Override
   public void onShove(@NonNull ShoveGestureDetector detector) {
   }

   @Override
   public void onShoveEnd(@NonNull ShoveGestureDetector detector) {
   }
 });
}
```

This code shows how to register listeners for various gesture types (move, scale, rotate, and shove) on a **NextbillionMap**. The addOnMoveListener, addOnScaleListener, addOnRotateListener, and addOnShoveListener methods are used to attach a new listener to the map. The listener implements three callback methods for each type of gesture: **on[GestureType]Begin**, **on[GestureType]**, and **on[GestureType]End**. These methods are called when the gesture begins, is ongoing, and ends, respectively. By registering these listeners, developers can receive real-time updates about the user's interaction with the map and perform custom actions based on the gestures performed.

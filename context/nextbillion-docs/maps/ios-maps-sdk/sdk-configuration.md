# Maps SDK configuration

The Maps SDK configuration for iOS provides developers with the ability to create maps within their applications using the **NGLMapView** class. This class serves as the foundation for integrating interactive maps into iOS applications.

With the **NGLMapView** class, developers can configure various properties to customize the behavior and appearance of the map. These properties allow fine-grained control over aspects such as the map's initial position, zoom level, rotation, and tilt. Additionally, developers can specify the map's style, which determines the visual representation of the map, including the colors, icons, and fonts used.

By leveraging the properties provided by the NGLMapView class, developers can create maps that seamlessly integrate with their applications and match the desired look and feel. This flexibility allows developers to tailor the map's behavior and appearance to meet the specific needs and branding requirements of their applications, ensuring a cohesive and immersive user experience.

## Initialization

The `NGLMapView` class offers two initializers to suit your needs.

- **initWithFrame**: This initializer takes a `CGRect` as input and creates a map view with the specified frame using the default style.

```
- (instancetype)initWithFrame:(CGRect)frame;
```

Use this method to swiftly initialize and obtain a map view with your desired frame and the default style.

- **`initWithFrame:styleURL`**: This initializer takes a `CGRect` and an optional style URL. It creates a map view with the specified frame and style URL.

```
- (instancetype)initWithFrame:(CGRect)frame styleURL:(nullable NSURL *)styleURL
```

This initializer allows you to initialize a map view with a custom style, providing even more flexibility. You can also set or modify the style URL after the map view has been initialized.

```
NSURL *styleURL;
// Set or change the style URL as needed.
```

These initializers empower you to easily create and customize map views in your application, tailoring them to your specific requirements.

## Map components

The NGLMapView class provides properties for configuring the following map components:

- [Scale bar](#scale-bar)
- [Compass view](#compass-view)
- [Logo view](#logo-view)
- [Location and tracking mode](#location-and-tracking-mode)
- [Camera](#camera)

### Scale bar

The scale bar displays the map's zoom level. The NGLMapView class provides properties for controlling whether the scale bar is displayed, its position, and its margins.

```swift
/**
 A Boolean value indicates whether the map may display scale information.
 The scale bar may not be shown at all zoom levels. The scale bar becomes visible
 when the maximum distance visible on the map view is less than 400 miles (800
 kilometers). The zoom level where this occurs depends on the latitude at the map
 view's center coordinate, as well as the device screen width. At latitudes
 farther from the equator, the scale bar becomes visible at lower zoom levels.
 The unit of measurement is determined by the user's device locale.
 The view controlled by this property is available at `scaleBar`. The default value
 of this property is `NO`.
 */

@property (nonatomic, assign) BOOL showsScale;
/**
 A control indicating the scale of the map. The scale bar is positioned in the
 upper-left corner. Enable the scale bar via `showsScale`.
 */
@property (nonatomic, readonly) UIView *scaleBar;
/**
 The position of the scale bar. The default value is `NGLOrnamentPositionTopLeft`.
 */
@property (nonatomic, assign) NGLOrnamentPosition scaleBarPosition;
/**
 A `CGPoint` indicating the position offset of the scale bar.
 */
@property (nonatomic, assign) CGPoint scaleBarMargins;
```

The following parameters are optional for NGLOrnamentPosition:

```swift
/** Place the ornament in the top left of the map view. */
    NGLOrnamentPositionTopLeft = 0,
    /** Place the ornament in the top right of the map view. */
    NGLOrnamentPositionTopRight,
    /** Place the ornament in the bottom left of the map view. */
    NGLOrnamentPositionBottomLeft,
    /** Place the ornament in the bottom right of the map view. */
    NGLOrnamentPositionBottomRight,
```

### Compass view

The compass view indicates the map's direction and allows the user to manipulate the direction. The NGLMapView class provides properties for controlling the compass view's position and margins.
The compass view is displayed in the top-right corner of the map view by default. More detailed parameter Settings can be seen below：

```swift
/**
 A control indicates the map's direction and allows the user to manipulate
 the direction, positioned in the upper-right corner.
 */
@property (nonatomic, readonly) NGLCompassButton *compassView;
/**
 The position of the compass view. The default value is `NGLOrnamentPositionTopRight`.
 */
@property (nonatomic, assign) NGLOrnamentPosition compassViewPosition;
/**
 A `CGPoint` indicating the position offset of the compass.
 */
@property (nonatomic, assign) CGPoint compassViewMargins;
```

_compassView_ contains the _compassView_ visibility property, which allows you to set the _compassView_ display status.

```swift
/** A constant indicating that the ornament adapts to the current map state. */
NGLOrnamentVisibilityAdaptive,
/** A constant indicating that the ornament is always hidden. */
NGLOrnamentVisibilityHidden,
/** A constant indicating that the ornament is always visible. */
NGLOrnamentVisibilityVisible
```

### Logo view

The logo view displays the **Nbmap** wordmark. The `NGLMapView` class provides properties for controlling whether the logo view is displayed, its position, and its margins.

The logo view is displayed in the bottom-left corner of the map view by default.

```swift
/**
 The Nbmap wordmark, is positioned in the lower-left corner.
 */
@property (nonatomic, readonly) UIImageView *logoView;
/**
 The position of the logo view. The default value is `NGLOrnamentPositionBottomLeft`.
 */
@property (nonatomic, assign) NGLOrnamentPosition logoViewPosition;
/**
 A `CGPoint` indicates the position offset of the logo.
 */
@property (nonatomic, assign) CGPoint logoViewMargins;
```

The following Settings can be used to control the display and hiding of logo view

```
logoView.isHidden = false
```

### Location and tracking mode

The `NGLMapView` class equips you with essential properties to manage user location and map tracking modes seamlessly. Here's an overview of these properties and their functionality:

1. **locationManager**: This property allows you to set a custom location manager, granting you control over how location data is handled.
2. **showsUserLocation**: Use this property to determine whether the user's location is displayed on the map. It's a handy switch to toggle the user's location visibility.
3. **userLocationVisible**: This property informs you whether the user's location is currently visible on the map. It serves as a quick check to ensure the user's position is effectively displayed.
4. **userLocation**: When you need to access the annotation object representing the user's current location, this property provides the means to retrieve it.
5. **userTrackingMode**: This property empowers you to dictate the map's tracking mode. The default mode is `NGLUserTrackingModeNone`. The `userTrackingMode` offers the following options:
   - `NGLUserTrackingModeNone`: The map does not follow the user's location.
   - `NGLUserTrackingModeFollow`: The map follows the user's location, reverting to `NGLUserTrackingModeNone` if the user pans the map.
   - `NGLUserTrackingModeFollowWithHeading`: In this mode, the map follows the user's location and rotates according to the heading. It displays a fan-shaped indicator representing the device's heading.
   - `NGLUserTrackingModeFollowWithCourse`: Here, the map tracks the user's location and rotates as the course changes. It uses a puck-shaped indicator to illustrate course changes.

These tracking modes provide diverse options to enhance user experiences based on your application's requirements, whether you need static positioning, heading-based orientation, or course-dependent movement tracking.

userTrackingMode has the following parameters:

```swift
    /** The map does not follow the user's location. */
    NGLUserTrackingModeNone              = 0,
    /** The map follows the user's location. This tracking mode falls back
        to `NGLUserTrackingModeNone` if the user pans the map view. */
    NGLUserTrackingModeFollow,
    /**
        The map follows the user's location and rotates when the heading changes.
        The default user location annotation displays a fan-shaped indicator with
        the current heading. The heading indicator represents the direction the
        device is facing, which is sized according to the reported accuracy.
        This tracking mode is disabled if the user pans the map view, but
        remains enabled if the user zooms in. If the user rotates the map
        view, this tracking mode will fall back to `NGLUserTrackingModeFollow`.
     */
    NGLUserTrackingModeFollowWithHeading,
    /**
        The map follows the user's location and rotates when the course changes.
        The course represents the direction in which the device is traveling.
        The default user location annotation shows a puck-shaped indicator
        that rotates as the course changes.
        This tracking mode is disabled if the user pans the map view, but
        remains enabled if the user zooms in. If the user rotates the map view,
        this tracking mode will fall back to `NGLUserTrackingModeFollow`.
     */
    NGLUserTrackingModeFollowWithCourse,
```

### Camera

The `NGLMapView` class provides properties for controlling the camera view of the map. These properties are essential for controlling and customizing the behavior and appearance of a map interface within an iOS application, providing fine-grained control over zoom levels, direction, and perspective. The SDK provides the following camera properties.

```
@property (nonatomic) double zoomLevel;

@property (nonatomic) double minimumZoomLevel;

@property (nonatomic) double maximumZoomLevel;

@property (nonatomic) CLLocationDirection direction;

@property (nonatomic) CGFloat minimumPitch;

@property (nonatomic) CGFloat maximumPitch;
```

A detailed explanation of the properties are as follows:

- The **zoomLevel** property of the `NGLMapView` class specifies the zoom level of the map. The zoom level affects the visual size and detail of features on the map, as well as the size of the vector tiles that are loaded.
- At zoom level 0, each tile covers the entire world map. At zoom level 1, each tile covers ¼ of the world. At zoom level 2, each tile covers 1/16 of the world, and so on.
- The **zoomLevel** property can be changed at any time. If you want to animate the change, you can use the `setZoomLevel:animated:` method.
- The **minimumZoomLevel** property sets the minimum zoom level at which the map can be shown. The default minimumZoomLevel is 0.
- The **maximumZoomLevel** property sets the maximum zoom level at which the map can be shown. The default _maximumZoomLevel_ is 22. The upper bound for this property is 25.5.
- The **direction** property sets the heading of the map, measured in degrees clockwise from true north. The value `0` means that the top edge of the map view corresponds to true.
- The **minimumPitch** property sets the minimum pitch of the map's camera toward the horizon, measured in degrees. If the value of this property is greater than that of the _maximumPitch_ property, the behavior is undefined. The pitch may not be less than 0 regardless of this property.
- The **maximumPitch** property sets the maximum pitch of the map's camera toward the horizon, measured in degrees. If the value of this property is smaller than that of the _minimumPitch_ property, the behavior is undefined. The pitch may not exceed 60 degrees regardless of this property. The default value of this property is 60 degrees.

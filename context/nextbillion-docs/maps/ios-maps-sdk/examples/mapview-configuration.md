# MapView Configuration

This example shows how to configure a NGLMapView object. The NGLMapView object is a map view that can be used to display maps from the nominatim database. The NGLMapView allow to sets the following properties :

- showsScale: This property is set to false to disable the scale bar.

- scaleBarPosition: This property is set to .topLeft to position the scale bar at the top left of the map view.

- scaleBarMargins: This property can be set to CGPoint to set the margins of the scale bar.

- compassView.isHidden: This property can be set to true or false to show or hide the compass view.

- compassViewMargins: This property can be set to CGPoint to set the margins of the compass view.

- logoView.isHidden: This property can be set to true or false to show or hide the logo view.

- logoViewMargins: This property can be set to CGPoint to set the margins of the logo view.

- showsUserLocation: This property can be set to true or false to show or hide the user's location on the map.

- userTrackingMode: This property can be set to .follow , .followWithHeading .followWithCourse or .none to make the map follow the user's location.

- showsUserHeadingIndicator: This property can be set to true or false to enable or disable the user's heading indicator.

- displayHeadingCalibration: This property can be set to true or false to show or hide the heading calibration alert when necessary.

- targetCoordinate: This property can be set to the coordinate of the map's target.

- isScrollEnabled: This property can be set to true or false to allow or disallow the user to scroll the map.

- panScrollingMode: This property is set to .default to allow the user to scroll the map both horizontally and vertically.

- isRotateEnabled: This property can be set to true or false to enable or disable the user's ability to rotate the map.

- isPitchEnabled: This property can be set to true or false to allow or disallow the user to change the pitch of the map.

- anchorRotateOrZoomGesturesToCenterCoordinate: This property can be set to true or false to enable or disable the anchoring of gestures to the center coordinate of the map while rotating or zooming.

Users can also use the following properties to get information from the NGLMapView object.

- selectedAnnotations : Gets the selected annotations on the map.

- visibleAnnotations: Gets the visible annotations that display on the map.

- annotations : Gets all annotations added on the map.

- visibleAnnotations: Gets the list of annotations associated with the receiver that intersect with the given rectangle.

- zoomLevel: Gets the current zoom level of the map view.

- Style: Gets the current map style.

- userLocation: Gets the annotation object indicating the user's current location.

- isRotateEnabled: Gets the bool value that determines whether the user may rotate the map, changing the direction.

- isPitchEnabled: Gets the bool value that determines whether the user may change the pitch (tilt) of the map.

- Direction: Gets the direction of the map.

For all code examples, refer to [Maps Code Examples](https://github.com/nextbillion-ai/ios-map-example)

**MapConfigViewController** [view source](https://github.com/nextbillion-ai/ios-map-example/blob/main/ios-map-example/Map-Configration.swift)

```swift
import UIKit
import Nbmap

class MapConfigViewController: UIViewController, NGLMapViewDelegate {
    var nbMapView: NGLMapView! {
        didSet {
            oldValue?.removeFromSuperview()
            if let mapView = nbMapView {
                configureMapView(nbMapView)
                view.insertSubview(mapView, at: 0)
            }
        }
    }

    func configureMapView(_ mapView: NGLMapView) {
        mapView.autoresizingMask = [.flexibleWidth, .flexibleHeight]
        /**
         Set the map view's   delegate.
         A map view sends messages to its delegate to notify it of changes to its
         contents or the viewpoint. The delegate also provides information about
         annotations displayed on the map, such as the styles to apply to individual
         annotations.
         If set the delegate the current view controller need to extend with  `NGLMapViewDelegate`
         */
        mapView.delegate = self

        /**
         A Boolean value indicating whether the map may display scale information.
         The scale bar may not be shown at all zoom levels. The scale bar becomes visible
         when the maximum distance visible on the map view is less than 400 miles (800
         kilometers). The zoom level where this occurs depends on the latitude at the map
         view's center coordinate, as well as the device screen width. At latitudes
         farther from the equator, the scale bar becomes visible at lower zoom levels.
         The unit of measurement is determined by the user's device locale.
         The view controlled by this property is available at `scaleBar`. The default value
         of this property is `NO`.
         */
        mapView.showsScale = false

        /**
         The position of the scale bar. The default value is `.topLeft`. The optional parameters are:  `.topLeft`,`.topRight`,`.bottomLeft`,`.bottomRight`
         */
        mapView.scaleBarPosition = .topLeft
        /**
         A `CGPoint` indicating the position offset of the scale bar.
         */
        mapView.scaleBarMargins = CGPoint(x: 10, y: 10)

        // Show or hidden the compass view
        mapView.compassView.isHidden = false

        // Set the compass view margins
        mapView.compassViewMargins = CGPoint(x: 16 ,y: 100)

        /**
         The position of the compass view. The default value is `.topLeft`. The optional parameters are:  `.topLeft`,`.topRight`,`.bottomLeft`,`.bottomRight`
         */
        mapView.compassViewPosition = .topRight

        /**  A `CGPoint` indicating the position offset of the compass view .**/
        mapView.compassViewMargins = CGPoint(x: 16 ,y: 100)

        // Show or hidden the logo view
        mapView.logoView.isHidden = false
        /**
         The position of the logo view. The default value is `.bopLeft`. The optional parameters are:  `.topLeft`,`.topRight`,`.bottomLeft`,`.bottomRight`
         */
        mapView.logoViewPosition = .bottomLeft

        /** A `CGPoint` indicating the position offset of the logo. */
        mapView.logoViewMargins =  CGPoint(x: 16 ,y: 100)

        /**
         A Boolean value indicating whether the map may display the user location.
         Setting this property to `YES` causes the map view to use the Core Location
         framework to find the current location. As long as this property is `YES`, the
         map view continues to track the user's location and update it periodically.
         This property does not indicate whether the user's position is actually visible
         on the map, only whether the map view is allowed to display it. To determine
         whether the user's position is visible, use the `userLocationVisible` property.
         The default value of this property is `NO`.
         Your app must specify a value for `NSLocationWhenInUseUsageDescription` or
         `NSLocationAlwaysUsageDescription` in its `Info.plist` to satisfy the
         requirements of the underlying Core Location framework when enabling this
         property.
         If you implement a custom location manager, set the `locationManager` before
         calling `showsUserLocation`.
         */
        mapView.showsUserLocation = true

        /**
         The mode used to track the user location. The default value is
         `NGLUserTrackingModeNone`.
         The optional parameters are:   `.none`, `.follow`.`.followWithHeading`,`.followWithCourse`.
         Changing the value of this property updates the map view with an animated
         transition. If you don't want to animate the change, use the
         `-setUserTrackingMode:animated:` method instead.
         */
        mapView.userTrackingMode = .follow

        /**
         A Boolean value indicating whether the user location annotation may display a
         permanent heading indicator.
         Setting this property to `true` causes the default user location annotation to
         appear and always show an arrow-shaped heading indicator, if heading is
         available. This property does not rotate the map; for that, see
         `NGLUserTrackingModeFollowWithHeading`.
         This property has no effect when `userTrackingMode` is
         `NGLUserTrackingModeFollowWithHeading` or
         `NGLUserTrackingModeFollowWithCourse`.
         The default value of this property is `false`.
         */
        mapView.showsUserHeadingIndicator = false

        /**
         Whether the map view should display a heading calibration alert when necessary.
         The default value is `true`.
         */
        mapView.displayHeadingCalibration = true

        /**
         The geographic coordinate that is the subject of observation as the user
         location is being tracked.
         By default, this property is set to an invalid coordinate, indicating that
         there is no target. In course tracking mode, the target forms one of two foci
         in the viewport, the other being the user location annotation. Typically, this
         property is set to a destination or waypoint in a real-time navigation scene.
         As the user annotation moves toward the target, the map automatically zooms in
         to fit both foci optimally within the viewport.
         This property has no effect if the `userTrackingMode` property is set to a
         value other than `NGLUserTrackingModeFollowWithCourse`.
         Changing the value of this property updates the map view with an animated
         transition. If you don't want to animate the change, use the
         `-setTargetCoordinate:animated:` method instead.
         */
        mapView.targetCoordinate =  CLLocationCoordinate2DMake(12.94798778, 77.57375084)

        /**
         A Boolean value that determines whether the user may zoom the map in and
         out, changing the zoom level.
         When this property is set to `true`, the default, the user may zoom the map
         in and out by pinching two fingers or by double tapping, holding, and moving
         the finger up and down.
         This property controls only user interactions with the map. If you set the
         value of this property to `false`, you may still change the map zoom
         programmatically.
         */
        mapView.isZoomEnabled = true

        /**
         A Boolean value that determines whether the user may scroll around the map,
         changing the center coordinate.
         When this property is set to `true`, the default, the user may scroll the map
         by dragging or swiping with one finger.
         This property controls only user interactions with the map. If you set the
         value of this property to `false`, you may still change the map location
         programmatically.
         */
        mapView.isScrollEnabled = true

        /**
         The scrolling mode the user is allowed to use to interact with the map.
        `NGLPanScrollingModeHorizontal` only allows the user to scroll horizontally on the map,
         restricting a user's ability to scroll vertically.
        `NGLPanScrollingModeVertical` only allows the user to scroll vertically on the map,
         restricting a user's ability to scroll horizontally.
         `NGLPanScrollingModeDefault` allows the user to scroll both horizontally and vertically
         on the map.
         By default, this property is set to `NGLPanScrollingModeDefault`.
         */
        mapView.panScrollingMode = .default

        /**
         A Boolean value that determines whether the user may rotate the map,
         changing the direction.
         When this property is set to `true`, the default, the user may rotate the map
         by moving two fingers in a circular motion.
         This property controls only user interactions with the map. If you set the
         value of this property to `false`, you may still rotate the map
         programmatically.
         */
        mapView.isRotateEnabled = false

        /**
         A Boolean value that determines whether the user may change the pitch (tilt) of
         the map.
         When this property is set to `true`, the default, the user may tilt the map by
         vertically dragging two fingers.
         This property controls only user interactions with the map. If you set the
         value of this property to `false`, you may still change the pitch of the map
         programmatically.
         The default value of this property is `true`.
         */
        mapView.isPitchEnabled = true
        /**
         A Boolean value that determines whether gestures are anchored to the center coordinate of the map while rotating or zooming.
         Default value is set to `false`..
         */
        mapView.anchorRotateOrZoomGesturesToCenterCoordinate = false
        /**
         A floating-point value that determines the rate of deceleration after the user
         lifts their finger.
         Your application can use the `NGLMapViewDecelerationRate.normal` and
         `NGLMapViewDecelerationRate.fast` constants as reference points for reasonable
         deceleration rates. `NGLMapViewDecelerationRate.immediate` can be used to
         disable deceleration entirely.
         */
        mapView.decelerationRate = NGLMapViewDecelerationRate.normal.rawValue

        /** The zoom level of the receiver.
         In addition to affecting the visual size and detail of features on the map,
         the zoom level affects the size of the vector tiles that are loaded. At zoom
         level 0, each tile covers the entire world map; at zoom level 1, it covers 1/4
         of the world; at zoom level 2, <sup>1</sup>⁄<sub>16</sub> of the world, and
         so on.
         Changing the value of this property updates the map view immediately. If you
         want to animate the change, use the `-setZoomLevel:animated:` method instead.
         */
        mapView.zoomLevel = 18
        /**
         * The minimum zoom level at which the map can be shown.
         *
         * Depending on the map view's aspect ratio, the map view may be prevented
         * from reaching the minimum zoom level, in order to keep the map from
         * repeating within the current viewport.
         *
         * If the value of this property is greater than that of the
         * maximumZoomLevel property, the behavior is undefined.
         *
         * The default minimumZoomLevel is 0.
         */
        mapView.minimumZoomLevel = 0
        /**
         * The maximum zoom level the map can be shown at.
         *
         * If the value of this property is smaller than that of the
         * minimumZoomLevel property, the behavior is undefined.
         *
         * The default maximumZoomLevel is 22. The upper bound for this property
         * is 25.5.
         */
        mapView.maximumZoomLevel = 22

        /**
         The heading of the map, measured in degrees clockwise from true north.
         The value `0` means that the top edge of the map view corresponds to true
         north. The value `90` means the top of the map is pointing due east. The
         value `180` means the top of the map points due south, and so on.
         Changing the value of this property updates the map view immediately. If you
         want to animate the change, use the `-setDirection:animated:` method instead.
         */
        mapView.direction = 0
        /**
         The minimum pitch of the map's camera toward the horizon measured in degrees.
         If the value of this property is greater than that of the `maximumPitch`
         property, the behavior is undefined. The pitch may not be less than 0
         regardless of this property.
         The default value of this property is 0 degrees, allowing the map to appear
         two-dimensional.
         */
        mapView.minimumPitch = 0
        /**
         The maximum pitch of the map's camera toward the horizon measured in degrees.
         If the value of this property is smaller than that of the `minimumPitch`
         property, the behavior is undefined. The pitch may not exceed 60 degrees
         regardless of this property.
         The default value of this property is 60 degrees.
         */
        mapView.maximumPitch = 60

        /**
         The coordinate bounds visible in the receiver's viewport.
         Changing the value of this property updates the receiver immediately. If you
         want to animate the change, call `-setVisibleCoordinateBounds:animated:`
         instead.
         If a longitude is less than −180 degrees or greater than 180 degrees, the
         visible bounds straddles the antimeridian or international date line. For
         example, if both Tokyo and San Francisco are visible, the visible bounds might
         extend from (35.68476, −220.24257) to (37.78428, −122.41310).
         */
//        mapView.visibleCoordinateBounds

        /**
         The distance from the edges of the map view's frame to the edges of the map
         view's logical viewport.
         When the value of this property is equal to `UIEdgeInsetsZero`, viewport
         properties such as `centerCoordinate` assume a viewport that matches the map
         view's frame. Otherwise, those properties are inset, excluding part of the
         frame from the viewport. For instance, if the only the top edge is inset, the
         map center is effectively shifted downward.

         When the map view's superview is an instance of `UIViewController` whose
         `automaticallyAdjustsScrollViewInsets` property is `YES`, the value of this
         property may be overridden at any time.

         The usage of `automaticallyAdjustsScrollViewInsets` has been deprecated
         use the map view's property `NGLMapView.automaticallyAdjustsContentInset`instead.
         Changing the value of this property updates the map view immediately. If you
         want to animate the change, use the `-setContentInset:animated:completionHandler:`
         method instead.
         */
        mapView.contentInset = UIEdgeInsets.zero

        /**
         URL of the style currently displayed in the receiver.
         The URL may be a full HTTP or HTTPS URL, a Nbmap
         style URL (`nbmap://styles/{user}/{style}`), or a path to a local file
         relative to the application's resource path.
         If you set this property to `nil`, the receiver will use the default style
         and this property will automatically be set to that style's URL.
         If you want to modify the current style without replacing it outright, or if
         you want to introspect individual style attributes, use the `style` property.
         */
//        self.mapView?.styleURL = URL(string: styleUrl)
        /**
         The options that determine which debugging aids are shown on the map.
         These options are all disabled by default and should remain disabled in
         released software for performance and aesthetic reasons.
         */

    }

    override func viewDidLoad() {
        super.viewDidLoad()
        /**
         Initialize the map view
         */
        nbMapView = NGLMapView(frame:self.view.bounds)
        /**
         Get the select annotations  on the map
         */
        let selectedAnnotations = nbMapView.selectedAnnotations
        /**
         Get the visible annotations that display on the map
         */
        let visibleAnnotations = nbMapView.visibleAnnotations

        /**
         Get all annotations added on the map
         */
        let annotation = nbMapView.annotations

        /**
         Get the list of annotations associated with the receiver that intersect with
         the given rectangle.
         */
        let visibleAnnotationsInRect = nbMapView.visibleAnnotations(in: CGRect(x: 100, y: 100, width: 100, height: 100))

        /**
         Get the current zoom level of the map view
         */
        let zoomLevel = nbMapView.zoomLevel

        /**
         Get the current map style
         */
        let style = nbMapView.style ?? NGLStyle()

        /**
         Get the annotation object indicating the user's current location.
         */
        let userLocation = nbMapView.userLocation ?? NGLUserLocation()

        /**
         Get the bool value that  whether the user may rotate the map, changing the direction.
         */
        let isRotateEnabled: Bool = nbMapView.isRotateEnabled
        /**
         Get  the bool value that  whether the user may change the pitch (tilt) of the map.
         **/

        let isPitchEnabled: Bool = nbMapView.isPitchEnabled

        /**
         Get the direction of the map
         */
        let direction: CLLocationDirection = nbMapView.direction

    }

}
```

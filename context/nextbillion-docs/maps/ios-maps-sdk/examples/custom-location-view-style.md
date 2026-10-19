# Custom Location View Style

This example shows how to customize the location view style for NGLMapView.

- Move the map camera to the given location after the map is loaded

- Update the map location mode by use setUserTrackingMode method

![documentation image](https://static.nextbillion.io/docs-next/docs/maps/ios/custom-location-view-style.webp)

For all code examples, refer to [Maps Code Examples](https://github.com/nextbillion-ai/ios-map-example)

**LocationStyleViewController** [view source](https://github.com/nextbillion-ai/ios-map-example)

```swift
import UIKit
import Nbmap
enum LocationType {
    case HidePuckView
    case UpdateToFollow
    case UpdateToFollowWithHeading
    case UpdateToFollowWithCourse
    case GetUserLocation
}
class LocationStyleViewController: UIViewController {
    var nbMapView: NGLMapView! {
        didSet {
            oldValue?.removeFromSuperview()
            if let mapView = nbMapView {
                view.insertSubview(mapView, at: 0)
            }
        }
    }

    var button: UIButton!

    let typeList = [
        LocationType.HidePuckView,
        LocationType.UpdateToFollow,
        LocationType.UpdateToFollowWithCourse,
        LocationType.UpdateToFollowWithHeading,
        LocationType.GetUserLocation
    ]

    override func viewDidLoad() {
        super.viewDidLoad()
        nbMapView = NGLMapView(frame:self.view.bounds)
        nbMapView.autoresizingMask = [.flexibleWidth, .flexibleHeight]
        nbMapView.delegate = self

        button = UIButton(type: .system)
        button.setTitle("Settings", for: .normal)
        button.addTarget(self, action: #selector(showSetings), for: .touchUpInside)
        button.frame = CGRect(x: 0, y: 0, width: 100, height: 40)
        navigationItem.rightBarButtonItem = UIBarButtonItem(customView: button)
    }

    @objc func showSetings() {
        let tableViewController = UITableViewController(style: .plain)
        tableViewController.tableView.delegate = self
        tableViewController.tableView.dataSource = self
        tableViewController.title = "Locations Settings"
        self.present(tableViewController, animated: true)
    }

    func performeSettings(tyle: LocationType) {
        switch tyle {
        case LocationType.UpdateToFollow:
            nbMapView.setUserTrackingMode(.follow,animated: true,completionHandler: nil)
            break
        case LocationType.UpdateToFollowWithCourse:
            nbMapView.setUserTrackingMode(.followWithCourse,animated: true,completionHandler: nil)
            break
        case LocationType.UpdateToFollowWithHeading:
            nbMapView.setUserTrackingMode(.followWithHeading,animated: true,completionHandler: nil)
            break
        case LocationType.HidePuckView:
            nbMapView.setUserTrackingMode(.none,animated: true,completionHandler: nil)
            break
        case LocationType.GetUserLocation:
            if let userLocation = nbMapView.userLocation {
                let location = userLocation.location
                let isUpdating = userLocation.isUpdating
                let title = userLocation.title
                let subtitle = userLocation.subtitle ?? ""
                print("location:" + location!.description)
                print("isUpdating:" + String(isUpdating))
                print("title:" + title)
                print("subtitle:" + subtitle)
                if let heading = userLocation.heading {
                    print(heading.description)
                }
            }
            break
        }

    }
}
extension LocationStyleViewController: NGLMapViewDelegate {
    func mapView(_ mapView: NGLMapView, didFinishLoading style: NGLStyle){

        let camera = NGLMapCamera(lookingAtCenter: CLLocationCoordinate2DMake(12.94798778, 77.57375084),
                                                                      acrossDistance:10000,
                                                                               pitch:0,
                                                                             heading:0)
       // This method only works after the map has finished loading the style
        nbMapView.fly(to: camera)

    }

    /**
     Tells the user that the map view will begin tracking the user's location.
     This method is called when the value of the `showsUserLocation` property
     changes to `YES`.
     @param mapView The map view that is tracking the user's location.
     */
    func mapViewWillStartLocatingUser(_ mapView: NGLMapView) {

    }

    /**
     Tells the user that the map view has stopped tracking the user's location.
     This method is called when the value of the `showsUserLocation` property
     changes to `NO`.
     @param mapView The map view that is tracking the user's location.
     */
    func mapViewDidStopLocatingUser(_ mapView: NGLMapView) {

    }


    /**
     Asks the user styling options for each default user location annotation view.

     This method is called many times during gesturing, so you should avoid performing
     complex or performance-intensive tasks in your implementation.

     @param mapView The map view that is tracking the user's location.
     */
    func mapView(styleForDefaultUserLocationAnnotationView mapView: NGLMapView) -> NGLUserLocationAnnotationViewStyle {
        let locationStyle =  NGLUserLocationAnnotationViewStyle()
        /**
         The fill color for the puck view.
         */
        locationStyle.puckFillColor = UIColor.blue
        /**
         The shadow color for the puck view.
         */
        locationStyle.puckShadowColor = UIColor.red
        /**
         The shadow opacity for the puck view.
         Set any value between 0.0 and 1.0.
         The default value of this property is equal to `0.25`
         */
        locationStyle.puckShadowOpacity = 0.25
        /**
         The fill color for the arrow puck.
         */
        locationStyle.puckArrowFillColor = UIColor.black
        /**
         The fill color for the puck view.
         */
        locationStyle.haloFillColor = UIColor.white

        if #available(iOS 14, *) {
            /**
             The halo fill color for the approximate view.
             */
            locationStyle.approximateHaloFillColor = UIColor.white
            /**
             The halo border color for the approximate view.
             */
            locationStyle.approximateHaloBorderColor = UIColor.white
            /**
             The halo border width for the approximate view.
             The default value of this property is equal to `2.0`
             */
            locationStyle.approximateHaloBorderWidth = 2.0
            /**
             The halo opacity for the approximate view.
             Set any value between 0.0 and 1.0
             The default value of this property is equal to `0.15`
             */
            locationStyle.approximateHaloOpacity = 0.15
        }

        return locationStyle
    }

    /**
     Tells the user that the location of the user was updated.
     While the `showsUserLocation` property is set to `YES`, this method is called
     whenever a new location update is received by the map view. This method is also
     called if the map view's user tracking mode is set to
     `NGLUserTrackingModeFollowWithHeading` and the heading changes, or if it is set
     to `NGLUserTrackingModeFollowWithCourse` and the course changes.
     This method is not called if the application is currently running in the
     background. If you want to receive location updates while running in the
     background, you must use the Core Location framework.
     private  @param mapView The map view that is tracking the user's location.
     @param userLocation The location object representing the user's latest
        location. This property may be `nil`.
     */
    func mapView(_ mapView: NGLMapView, didUpdate userLocation: NGLUserLocation?) {

    }

    /**
     Tells the user that an attempt to locate the user's position failed.
     @param mapView The map view that is tracking the user's location.
     @param error An error object containing the reason why location tracking
        failed.
     */
    func mapView(_ mapView: NGLMapView, didFailToLocateUserWithError error: Error)  {

    }


    /**
     Tells the user that the map view's user tracking mode has changed.
     This method is called after the map view asynchronously changes to reflect the
     new user tracking mode, for example by beginning to zoom or rotate.
     private  @param mapView The map view that changed its tracking mode.
     @param mode The new tracking mode.
     @param animated Whether the change caused an animated effect on the map.
     */
    func mapView(_ mapView: NGLMapView, didChange mode: NGLUserTrackingMode, animated: Bool )  {

    }

    /**
     Returns a screen coordinate at which to position the user location annotation.
     This coordinate is relative to the map view's origin after applying the map view's
     content insets.
     When unimplemented, the user location annotation is aligned within the center of
     the map view with respect to the content insets.
     This method will override any values set by `NGLMapView.userLocationVerticalAlignment`
     or `-[NGLMapView setUserLocationVerticalAlignment:animated:]`.
     @param mapView The map view that is tracking the user's location.

     Notes: We don't need to set the anchor point for now, so comment out this method first
     */
//    func mapViewUserLocationAnchorPoint(_ mapView: NGLMapView ) -> CGPoint  {
//
//    }
    /**
     Tells the user that the map's location updates accuracy authorization has changed.

     This method is called after the user changes location accuracy authorization when
     requesting location permissions or in privacy settings.

     @param mapView The map view that changed its location accuracy authorization.
     @param manager The location manager reporting the update.

     */
    func mapView(_ apView: NGLMapView, didChangeLocationManagerAuthorization manager: NGLLocationManager)  {

    }

    /**
     Returns a view object to mark the given point annotation object on the map.
     Implement this method to mark a point annotation with a view object. If you
     want to mark a particular point annotation with a static image instead, omit
     this method or have it return `nil` for that annotation, then implement
     `-mapView:imageForAnnotation:` instead.
     Annotation views are compatible with UIKit, Core Animation, and other Cocoa
     Touch frameworks. On the other hand, static annotation images use less memory
     and draw more quickly than annotation views.
     The user location annotation view can also be customized via this method. When
     `annotation` is an instance of `NGLUserLocation` (or equal to the map view's
     `userLocation` property), return an instance of `NGLUserLocationAnnotationView`
     (or a subclass thereof).
     @param mapView The map view that requested the annotation view.
     @param annotation The object representing the annotation that is about to be
        displayed.
     @return The view object to display for the given annotation or `nil` if you
        want to display an annotation image instead.
     */
    func mapView(_ mapView: NGLMapView, viewFor annotation: NGLAnnotation) -> NGLAnnotationView?  {
        return nil
    }

}
extension LocationStyleViewController: UITableViewDelegate, UITableViewDataSource {

    func settingsTitlesForRaw(index: Int) -> String {
        let type = typeList[index]
        var title: String = ""
        switch type {
        case LocationType.HidePuckView :
                title = "Hide puck view"
            break
        case LocationType.UpdateToFollowWithHeading:
            title = "Update puck view to follow with heading"
            break
        case LocationType.UpdateToFollowWithCourse:
            title = "Update puck view to follow with course"
            break
        case LocationType.UpdateToFollow:
            title = "Update puck view to follow"
            break
        case LocationType.GetUserLocation:
            title = "Get user location"
            break
        }
        return title
    }
    //
     func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
         return typeList.count
     }
     func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
         let cell = UITableViewCell(style: .default, reuseIdentifier: nil)
         cell.textLabel?.text = settingsTitlesForRaw(index: indexPath.row)
         return cell
     }
     func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
         tableView.isHidden = true
         let type = typeList[indexPath.row]
        dismissSettings(type: type)
     }

    func dismissSettings(type: LocationType) {
        dismiss(animated: true)
        performeSettings(tyle: type)
    }
}
```

The example code is a LocationStyleViewController class that sets up a map view **(NGLMapView)** and handles various location-related functionalities.

**Initializing MapView:**

- The nbMapView property is initialized as an instance of **NGLMapView** and added as a subview to the view controller's view.

- The autoresizingMask property is set to allow the map view to resize with the view controller's view.

- The delegate property is set to self to receive map view delegate callbacks.

Custom User Location Style:

- The **mapView(styleForDefaultUserLocationAnnotationView:)** method is implemented to customize the appearance of the default user location annotation view.

- A **NGLUserLocationAnnotationViewStyle** object is created and configured with various properties to customize the puck, arrow, and halo colors. The method returns the configured **NGLUserLocationAnnotationViewStyle** object.

Setting User Tracking Mode:

- Depending on the selected LocationType, the method calls nbMapView.setUserTrackingMode with the appropriate mode.

- The setUserTrackingMode(\_:animated:completionHandler:) method is used to set the user tracking mode for the map view.
  - **NGLUserTrackingModeNone** The map does not follow the user location.

  - **NGLUserTrackingModeFollow** The map follows the user location. This tracking mode falls back to `NGLUserTrackingModeNone` if the user pans the map view.

  - **NGLUserTrackingModeFollowWithHeading** The map follows the user location and rotates when the heading changes.

  - **NGLUserTrackingModeFollowWithCourse** The map follows the user location and rotates when the course changes.

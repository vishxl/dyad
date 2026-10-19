# Custom destination marker

Enhance the visual representation of destination markers and provide users with real-time ETA information.

This example shows:

- How to Custom destination marker

- How to show route ETA on top of route line on map

![documentation image](https://static.nextbillion.io/docs-next/docs/navigation/ios/custom-destination-marker.webp)

For all code examples, refer to [Navigation Code Examples](https://github.com/nextbillion-ai/ios-navigation-demo)

**CustomDestinationMarkerController** [view source](https://github.com/nextbillion-ai/ios-navigation-demo/blob/main/navigation-ios-demo/Custom-Destination-Marker.swift)

```swift
import UIKit
import NbmapNavigation
import NbmapCoreNavigation
import Nbmap

class CustomDestinationMarkerController: UIViewController {

   var mapView: NavigationMapView? {
       didSet {
           oldValue?.removeFromSuperview()
           if let mapView = mapView {
               view.insertSubview(mapView, at: 0)
           }
       }
   }

   var routes : [Route]?

   override func viewDidLoad() {
       super.viewDidLoad()

       self.mapView = NavigationMapView(frame: view.bounds)

       mapView?.userTrackingMode = .followWithHeading

       let singleTap = UILongPressGestureRecognizer(target: self, action: #selector(didLongPress(tap:)))
       mapView?.gestureRecognizers?.filter({ $0 is UILongPressGestureRecognizer }).forEach(singleTap.require(toFail:))
       mapView?.addGestureRecognizer(singleTap)
       mapView?.delegate = self

   }

   @objc func didLongPress(tap: UILongPressGestureRecognizer) {
       guard let mapView = mapView, tap.state == .began else {
           return
       }
       let coordinates = mapView.convert(tap.location(in: mapView), toCoordinateFrom: mapView)
       // Note: The destination name can be modified. The value is used in the top banner when arriving at a destination.
       let destination = Waypoint(coordinate: coordinates, name: "\(coordinates.latitude),\(coordinates.longitude)")
       addNewDestinationcon(coordinates: coordinates)

       guard let currentLocation =  mapView.userLocation?.coordinate else { return}
       let currentWayPoint = Waypoint.init(coordinate: currentLocation, name: "My Location")

       requestRoutes(origin: currentWayPoint, destination: destination)
   }

   @IBAction func startNavigation(_ sender: Any) {
       guard let routes = self.routes else {
           return
       }
       let navigationService = NBNavigationService(routes: routes, routeIndex: 0)

       let navigationOptions = NavigationOptions(navigationService: navigationService)

       let navigationViewController = NavigationViewController(for: routes,navigationOptions: navigationOptions)
       navigationViewController.modalPresentationStyle = .fullScreen

       navigationViewController.delegate = self

       present(navigationViewController, animated: true, completion: nil)

   }

   func addNewDestinationcon(coordinates: CLLocationCoordinate2D){
       guard let mapView = mapView else {
           return
       }

       if let annotation = mapView.annotations?.last {
           mapView.removeAnnotation(annotation)
       }

       let annotation = NGLPointAnnotation()
       annotation.coordinate = coordinates
       mapView.addAnnotation(annotation)
   }

   func requestRoutes(origin: Waypoint, destination: Waypoint){

       let options = RouteOptions.init(origin: origin, destination: destination)
       // Includes alternative routes in the response
       options.includesAlternativeRoutes = true

       // Set the measurement format system
       options.distanceMeasurementSystem = MeasurementSystem.metric

       Directions.shared.calculate(options) { [weak self] routes, error in
           guard let weakSelf = self else {
               return
           }
           guard error == nil else {
               print(error!)
               return
           }

           guard let routes = routes else { return }


           // Process or display routes information.For example,display the routes,waypoints and duration symbol on the map
           weakSelf.mapView?.showRoutes(routes)
           weakSelf.mapView?.showRouteDurationSymbol(routes)

           guard let current = routes.first else { return }
           weakSelf.mapView?.showWaypoints(current)
           weakSelf.routes = routes
       }
   }

}

extension CustomDestinationMarkerController : NGLMapViewDelegate {

   func mapView(_ mapView: NGLMapView, imageFor annotation: NGLAnnotation) -> NGLAnnotationImage? {
       let image = UIImage(named: "marker", in: .main, compatibleWith: nil)!.withRenderingMode(.alwaysOriginal)
       return NGLAnnotationImage(image: image, reuseIdentifier: "destination_icon_identifier")
   }
}

extension CustomDestinationMarkerController : NavigationViewControllerDelegate {

   func navigationViewController(_ navigationViewController: NavigationViewController, imageFor annotation: NGLAnnotation) -> NGLAnnotationImage? {
       let image = UIImage(named: "marker", in: .main, compatibleWith: nil)!.withRenderingMode(.alwaysOriginal)
       return NGLAnnotationImage(image: image, reuseIdentifier: "destination_icon_identifier")
   }
}
```

The class **CustomDestinationMarkerController** is a view controller that allows users to add a custom destination marker to a map. The class has the following **properties**:

- **mapView**: A NavigationMapView object that displays the map.

- **routes**: An array of Route objects that represent the routes between the user's current location and the custom destination marker.

The class has the following **methods**:

- **viewDidLoad():** This method is called when the view controller is loaded. In this method, the map view is created and configured.

- **didLongPress():** This method is called when the user long-presses on the map. In this method, a custom destination marker is added to the map at the location of the long press.

- **startNavigation():** This method is called when the user taps the "Start Navigation" button. In this method, a navigation controller is created and presented to the user. The navigation controller uses the routes property to display the route between the user's current location and the custom destination marker.

- **addNewDestinationcon():** This method adds a new destination annotation to the map.

- **requestRoutes():** This method requests routes between the user's current location and the custom destination marker.

- **mapView(\_:imageFor:):** This method is called by the map view to get an image for an annotation. In this method, a custom image is returned for the destination annotation.

- **navigationViewController(\_:imageFor:):** This method is called by the navigation controller to get an image for an annotation. In this method, a custom image is returned for the destination annotation.

The code also has two extensions:

- **CustomDestinationMarkerController**: NGLMapViewDelegate

- **CustomDestinationMarkerController**: NavigationViewControllerDelegate

These extensions conform the **CustomDestinationMarkerController** class to the **NGLMapViewDelegate** and **NavigationViewControllerDelegate** protocols. These protocols allow the **CustomDestinationMarkerController** class to respond to events from the map view and the navigation controller.

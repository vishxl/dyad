# Custom location indicator

Customize the location indicator in the Navigation view based on user preferences and add a bottom sheet to allow user-customized actions.

This example shows:

- How to add a bottom sheet to allow user-customized actions

- How to Custom location indicator in Navigation view based on user preferences

![documentation image](https://static.nextbillion.io/docs-next/docs/navigation/ios/custom-location-indicator-2.webp)

![documentation image](https://static.nextbillion.io/docs-next/docs/navigation/ios/custom-location-indicator-1.webp)

For all code examples, refer to [Navigation Code Examples](https://github.com/nextbillion-ai/ios-navigation-demo)

CustomLocationViewController [view source](https://github.com/nextbillion-ai/ios-navigation-demo/blob/main/navigation-ios-demo/Custom-User-Location.swift)

```swift
import UIKit
import NbmapNavigation
import NbmapCoreNavigation
import Nbmap

class CustomLocationViewController: UIViewController ,NGLMapViewDelegate{
   typealias ActionHandler = (UIAlertAction) -> Void

   var navigationMapView: NavigationMapView! {
       didSet {
           oldValue?.removeFromSuperview()
           if let mapView = navigationMapView {
               view.insertSubview(mapView, at: 0)
           }
       }
   }

   var routes : [Route]? {
       didSet {
           guard routes != nil else{
               startButton.isEnabled = false
               return
           }
           startButton.isEnabled = true
       }
   }

   private let startButton = UIButton()

   override func viewDidLoad() {
       super.viewDidLoad()

       self.navigationMapView = NavigationMapView(frame: view.bounds)

       navigationMapView.userTrackingMode = .follow
       let singleTap = UILongPressGestureRecognizer(target: self, action: #selector(didLongPress(tap:)))
       navigationMapView?.gestureRecognizers?.filter({ $0 is UILongPressGestureRecognizer }).forEach(singleTap.require(toFail:))
       navigationMapView?.addGestureRecognizer(singleTap)
       navigationMapView?.delegate = self

       let navigationViewportDataSource = NavigationViewportDataSource(navigationMapView)
       navigationViewportDataSource.options.followingCameraOptions.zoomUpdatesAllowed = false
       navigationViewportDataSource.followingMobileCamera = NavMapCameraOption()
       navigationMapView.navigationCamera.viewportDataSource = navigationViewportDataSource

       setupStartButton()
   }

   func setupStartButton() {
       startButton.setTitle("Start", for: .normal)
       startButton.layer.cornerRadius = 5
       startButton.contentEdgeInsets = UIEdgeInsets(top: 5, left: 5, bottom: 5, right: 5)
       startButton.backgroundColor = .blue

       startButton.addTarget(self, action: #selector(performAction), for: .touchUpInside)
       view.addSubview(startButton)
       startButton.translatesAutoresizingMaskIntoConstraints = false
       startButton.bottomAnchor.constraint(equalTo: view.safeAreaLayoutGuide.bottomAnchor, constant: -50).isActive = true
       startButton.centerXAnchor.constraint(equalTo: view.safeAreaLayoutGuide.centerXAnchor).isActive = true
       startButton.titleLabel?.font = UIFont.systemFont(ofSize: 25)
   }

   @objc func didLongPress(tap: UILongPressGestureRecognizer) {
       guard let mapView = navigationMapView, tap.state == .began else {
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

   @objc func performAction(_ sender: Any) {
       guard routes != nil else {
           let alertController = UIAlertController(title: "Create route",
                                                   message: "Long tap on the map to create a route first.",
                                                   preferredStyle: .alert)
           alertController.addAction(UIAlertAction(title: "OK", style: .default))
           return present(alertController, animated: true)
       }
       // Set Up the alert controller to switch between different userLocationStyle.
       let alertController = UIAlertController(title: "Choose UserLocationStyle",
                                               message: "Select the user location style",
                                               preferredStyle: .actionSheet)

       let courseView: ActionHandler = { _ in self.setupCourseView() }
       let defaultPuck2D: ActionHandler = { _ in self.setupDefaultPuck2D() }
       let invisiblePuck: ActionHandler = { _ in self.setupInvisiblePuck() }
       let puck2D: ActionHandler = { _ in self.setupCustomPuck2D() }
       let cancel: ActionHandler = { _ in }

       let actionPayloads: [(String, UIAlertAction.Style, ActionHandler?)] = [
           ("Invisible Puck", .default, invisiblePuck),
           ("Default Course View", .default, courseView),
           ("2D Default Puck", .default, defaultPuck2D),
           ("2D Custom Puck", .default, puck2D),
           ("Cancel", .cancel, cancel)
       ]

       actionPayloads
           .map { payload in UIAlertAction(title: payload.0, style: payload.1, handler: payload.2) }
           .forEach(alertController.addAction(_:))

       if let popoverController = alertController.popoverPresentationController {
           popoverController.sourceView = self.startButton
           popoverController.sourceRect = self.startButton.bounds
       }

       present(alertController, animated: true, completion: nil)
   }

   func setupCourseView() {
       presentNavigationViewController(.courseView())
   }

   func setupDefaultPuck2D() {
       presentNavigationViewController(.puck2D)
   }

   func setupInvisiblePuck() {
       presentNavigationViewController(.none)
   }

   func setupCustomPuck2D() {
       let courseView = UserPuckCourseView(frame: CGRect(origin: .zero, size: 75.0))
       courseView.puckView.image = UIImage(named: "airplane")
       let userLocationStyle = UserLocationStyle.courseView(courseView)
       presentNavigationViewController(userLocationStyle)
   }

   func presentNavigationViewController(_ userLocationStyle: UserLocationStyle? = nil) {
       guard let routes = self.routes else {
           return
       }
       let navigationService = NBNavigationService(routes: routes, routeIndex: 0)
       let navigationOptions = NavigationOptions(navigationService: navigationService)
       let navigationViewController = NavigationViewController(for: routes,navigationOptions: navigationOptions)
       navigationViewController.modalPresentationStyle = .fullScreen
       navigationViewController.navigationMapView?.userLocationStyle = userLocationStyle
       present(navigationViewController, animated: true, completion: nil)
   }

   func addNewDestinationcon(coordinates: CLLocationCoordinate2D){
       guard let mapView = navigationMapView else {
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

       // Avoid road options , Set an array road class to avoid.
       options.roadClassesToAvoid = []

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
           weakSelf.navigationMapView?.showRoutes(routes)
           weakSelf.navigationMapView?.showRouteDurationSymbol(routes)

           guard let current = routes.first else { return }
           weakSelf.navigationMapView?.showWaypoints(current)
           weakSelf.routes = routes
       }
   }
}
```

This class is a view controller that allows users to add a custom destination marker to a map and then navigate to that destination. The class has the following **properties**:

- **navigationMapView**: A NavigationMapView object that displays the map.

- **routes**: An array of Route objects that represent the routes between the user's current location and the custom destination marker.

- **startButton**: A UIButton object that is used to start navigation.

The class has the following **methods**:

- **viewDidLoad():** This method is called when the view controller is loaded. In this method, the map view is created and configured.

- **didLongPress():** This method is called when the user long-presses on the map. In this method, a custom destination marker is added to the map at the location of the long press.

- **performAction():** This method is called when the user taps the "Start Navigation" button. In this method, a navigation controller is created and presented to the user. The navigation controller uses the routes property to display the route between the user's current location and the custom destination marker.

- **setupStartButton():** This method sets up the "Start Navigation" button.

- **setupCourseView():** This method sets up the map view to use a course view for the user location.

- **setupDefaultPuck2D():** This method sets up the map view to use the default 2D puck for the user location.

- **setupInvisiblePuck():** This method sets up the map view to use an invisible puck for the user location.

- **setupCustomPuck2D():** This method sets up the map view to use a custom 2D puck for the user location.

- **presentNavigationViewController():** This method presents a navigation controller for the given routes.

- **addNewDestinationcon():** This method adds a new destination annotation to the map.

- **requestRoutes():** This method requests routes between the user's current location and the custom destination marker.

The code also has two extensions:

- CustomLocationViewController: **NGLMapViewDelegate**

- CustomLocationViewController: **NavigationViewControllerDelegate**

These extensions conform the **CustomLocationViewController** class to the **NGLMapViewDelegate** and **NavigationViewControllerDelegate** protocols. These protocols allow the **CustomLocationViewController** class to respond to events from the map view and the navigation controller.

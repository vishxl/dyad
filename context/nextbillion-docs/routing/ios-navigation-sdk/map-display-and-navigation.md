# Map Display and Navigation

Generally, a navigation application comprises two pages incorporating a map view. We will refer to this setup as a standalone navigation view.

Users can designate the destinations or waypoints on the initial page, which they intend to traverse. Simultaneously, a route is obtained and displayed within the map view. Upon selecting "start navigation," the application transitions to the second page, providing a comprehensive navigation experience.

In certain scenarios, product designers may prefer to consolidate waypoint selection and navigation initiation onto a single page. We will refer to this alternative as the embedded navigation view. While this approach is discussed in other sections, the present section focuses on the conventional case (i.e., the standalone navigation view).

To embark on your first navigation experience, construct a page for plotting waypoints and execute an HTTP request to acquire a route. Subsequently, access the built-in navigation page by invoking the SDK API.

## First Page

### Integrate a map view

Normally, we only initialize NavigationMapView once, so we call it in **viewDidLoad()**

```swift
var mapView: NavigationMapView?
//init navigationMapView within viewDidLoad() method
override func viewDidLoad() {
    super.viewDidLoad()
    self.mapView = NavigationMapView(frame: view.bounds)
    //configure for mapView based on your needs
    mapView.autoresizingMask = [.flexibleWidth, .flexibleHeight]
    mapView.userTrackingMode = .follow
    mapView.logoView.isHidden = false
    mapView.compassView.isHidden = false
    mapView.styleURL = URL(string: mapStyleUrl)!

    //Assign Your ViewController as the delegate of navigationMapView
    mapView.navigationMapDelegate = self
    self.view.insertSubview(mapView, at: 0)
}

//Extend YourViewController to adhere to the NavigationMapViewDelegate
extension YourViewController: NavigationMapViewDelegate {
  //Implement the functions of delegate based on your needs
}
```

### Get the user’s current location

To obtain users’ geographic location, we are using Core Location Service via instances of **CLLocationManager**, in our SDK we can leverage _NavigationLocationManager_ to determine users’ location.

```swift
let locationManager = NavigationLocationManager()
CLLocation location = locationManager.location
//if the return location of the previous code is nil, we can call requestLocation to force a request for a location
locationManager.requestLocation()
// we can also call locationManager.startUpdatingLocation() to Start the generation of update of user’s current location, and call locationManager.stopUpdatingLocation() to stop.
```

On the other hand, you can also implement CLLocationManager’s delegation to manage user location, for more details please refer to Apple’s [official docs](https://developer.apple.com/documentation/corelocation)

## Fetch a route

### How to fetch a route

```swift
// Initialize the route options with the start and end waypoints
let options = RouteOptions.init(origin: startWaypoint, destination: endWaypoint)

// Include alternative routes in the response
options.includesAlternativeRoutes = true

// Set the road classes to avoid as an empty array
options.roadClassesToAvoid = []

// Set the measurement system to metric
options.distanceMeasurementSystem = MeasurementSystem.metric

// Calculate the directions based on the provided options
Directions.shared.calculate(options) { [weak self] routes, error in
    // Check if there was an error during the calculation
    guard error == nil else {
        // Handle the error here if it exists
        return
    }

    // Display the routes, waypoints, and duration symbols on the map
    guard let weakSelf = self else {
        return
    }
    weakSelf.mapView?.showRoutes(routes)
    weakSelf.mapView?.showWaypoints(current)
    weakSelf.mapView?.showRouteDurationSymbol(routes)
}
```

## Start navigation

Once we have fetched routes, we need to construct a NavigationOptions to build a NavigationViewController, and then call UIViewController’s present function to display NavigationView.

```swift
// Initialize the navigation service with the fetched routes and set the primary route to the first index
let navigationService = NBNavigationService(routes: routes, routeIndex: 0)

// Initialize the day and night styles for navigation, or use custom styles if available
let styles = [DayStyle(), NightStyle()]
let navigationOptions = NavigationOptions(styles:styles, navigationService: navigationService)

// Initialize the NavigationViewController with the provided routes and navigation options
let navigationViewController = NavigationViewController(for: routes, navigationOptions: navigationOptions)

// Set the delegate of the NavigationViewController to subscribe to NavigationView's events (optional)
navigationViewController.delegate = self

// Set the presentation style of the NavigationViewController to full-screen
navigationViewController.modalPresentationStyle = .fullScreen

// Present the NavigationViewController to start the navigation
present(navigationViewController, animated: true) {
}
```

And there we go:

![documentation image](https://static.nextbillion.io/docs-next/docs/navigation/android/basic-single-app.webp)

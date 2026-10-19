# Route lines styling

Enhance your navigation app by customizing the style of route lines and create visually appealing navigation experiences.

This example shows:

- How to customize the style of Navigation route lines

![documentation image](https://static.nextbillion.io/docs-next/docs/navigation/ios/route-lines-styling.webp)

For all code examples, refer to [Navigation Code Examples](https://github.com/nextbillion-ai/ios-navigation-demo)

**RouteLinesStylingViewController** [view source](https://github.com/nextbillion-ai/ios-navigation-demo/blob/main/navigation-ios-demo/Custom-Route-Lines-Styling.swift)

```swift
import UIKit
import NbmapNavigation
import NbmapCoreNavigation

class RouteLinesStylingViewController: UIViewController {

   typealias ActionHandler = (UIAlertAction) -> Void

   var trafficUnknownColor: UIColor =  #colorLiteral(red: 0.1843137255, green: 0.4784313725, blue: 0.7764705882, alpha: 1)
   var trafficLowColor: UIColor =  #colorLiteral(red: 0.1843137255, green: 0.4784313725, blue: 0.7764705882, alpha: 1)
   var trafficModerateColor: UIColor =  #colorLiteral(red: 1, green: 0.5843137255, blue: 0, alpha: 1)
   var trafficHeavyColor: UIColor =  #colorLiteral(red: 1, green: 0.3019607843, blue: 0.3019607843, alpha: 1)
   var trafficSevereColor: UIColor = #colorLiteral(red: 0.5607843137, green: 0.1411764706, blue: 0.2784313725, alpha: 1)
   var routeCasingColor: UIColor = #colorLiteral(red: 0.28, green: 0.36, blue: 0.8, alpha: 1)
   var routeAlternateColor: UIColor = #colorLiteral(red: 1, green: 0.65, blue: 0, alpha: 1)
   var routeAlternateCasingColor: UIColor = #colorLiteral(red: 1.0, green: 0.9, blue: 0.4, alpha: 1)
   var traversedRouteColor: UIColor = #colorLiteral(red: 0.1843137255, green: 0.4784313725, blue: 0.7764705882, alpha: 1)

   var navigationMapView: NavigationMapView!

   var currentRouteIndex = 0 {
       didSet {
           showCurrentRoute()
       }
   }

   var currentRoute: Route? {
       return routes?[currentRouteIndex]
   }

   var routes: [Route]? {
       didSet {

           guard let routes = routes,
                 let current = routes.first
           else {
               navigationMapView?.removeRoutes()
               navigationMapView?.removeRouteDurationSymbol()
               if let annotation = navigationMapView?.annotations?.last {
                   navigationMapView?.removeAnnotation(annotation)
               }
               return

           }

           navigationMapView?.showRoutes(routes)
           navigationMapView?.showWaypoints(current)
           navigationMapView?.showRouteDurationSymbol(routes)
       }
   }

   func showCurrentRoute() {
       guard let currentRoute = currentRoute else { return }

       var routes = [currentRoute]
       routes.append(contentsOf: self.routes!.filter {
           $0 != currentRoute
       })
       navigationMapView.showRoutes(routes)
       navigationMapView.showWaypoints(currentRoute)
   }

   // MARK: - UIViewController lifecycle methods
   override func viewDidLoad() {
       super.viewDidLoad()

       setupNavigationMapView()
       setupPerformActionBarButtonItem()
       setupGestureRecognizers()
   }

   // MARK: - Setting-up methods
   func setupNavigationMapView() {
       navigationMapView = NavigationMapView(frame: view.bounds)
       navigationMapView.autoresizingMask = [.flexibleWidth, .flexibleHeight]
       navigationMapView.navigationMapDelegate = self
       navigationMapView.userTrackingMode = .follow

       view.addSubview(navigationMapView)
   }

   func setupPerformActionBarButtonItem() {
       let settingsBarButtonItem = UIBarButtonItem(title: NSString(string: "\u{2699}\u{0000FE0E}") as String,
                                                   style: .plain,
                                                   target: self,
                                                   action: #selector(performAction))
       settingsBarButtonItem.setTitleTextAttributes([.font: UIFont.systemFont(ofSize: 30)], for: .normal)
       settingsBarButtonItem.setTitleTextAttributes([.font: UIFont.systemFont(ofSize: 30)], for: .highlighted)
       navigationItem.rightBarButtonItem = settingsBarButtonItem
   }

   @objc func performAction(_ sender: Any) {
       let alertController = UIAlertController(title: "Perform action",
                                               message: "Select specific action to perform it", preferredStyle: .actionSheet)

       let startNavigation: ActionHandler = { _ in self.startNavigation() }
       let removeRoutes: ActionHandler = { _ in self.routes = nil }

       let actions: [(String, UIAlertAction.Style, ActionHandler?)] = [
           ("Start Navigation", .default, startNavigation),
           ("Remove Routes", .default, removeRoutes),
           ("Cancel", .cancel, nil)
       ]

       actions
           .map({ payload in UIAlertAction(title: payload.0, style: payload.1, handler: payload.2) })
           .forEach(alertController.addAction(_:))

       if let popoverController = alertController.popoverPresentationController {
           popoverController.barButtonItem = navigationItem.rightBarButtonItem
       }

       present(alertController, animated: true, completion: nil)
   }

   func setupGestureRecognizers() {
       let longPressGestureRecognizer = UILongPressGestureRecognizer(target: self, action: #selector(handleLongPress(_:)))
       navigationMapView.addGestureRecognizer(longPressGestureRecognizer)
   }

   @objc func startNavigation() {
       guard let routes = routes else {
           print("Please select at least one destination coordinate to start navigation.")
           return
       }

       let navigationService = NBNavigationService(routes: routes, routeIndex: currentRouteIndex)

       let navigationOptions = NavigationOptions(navigationService: navigationService)
       let navigationViewController = NavigationViewController(for: routes,navigationOptions: navigationOptions)
       navigationViewController.delegate = self
       navigationViewController.modalPresentationStyle = .fullScreen
       navigationViewController.routeLineTracksTraversal = true
       present(navigationViewController, animated: true, completion: nil)
   }

   @objc func handleLongPress(_ gesture: UILongPressGestureRecognizer) {
       guard let navigationMapView = navigationMapView, gesture.state == .began else {
           return
       }
       let coordinates = navigationMapView.convert(gesture.location(in: navigationMapView), toCoordinateFrom: navigationMapView)
       let destination = Waypoint(coordinate: coordinates, name: "\(coordinates.latitude),\(coordinates.longitude)")

       addNewDestinationcon(coordinates: coordinates)

       guard let currentLocation =  navigationMapView.userLocation?.coordinate else { return}
       let currentWayPoint = Waypoint.init(coordinate: currentLocation, name: "My Location")

       requestRoutes(origin: currentWayPoint, destination: destination)
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

       let options = NavigationRouteOptions(origin: origin, destination: destination)

       Directions.shared.calculate(options) { [weak self] routes, error in
           guard let weakSelf = self else {
               return
           }
           guard error == nil else {
               print(error!)
               return
           }

           guard let routes = routes else { return }

           weakSelf.routes = routes
       }
   }

   func routeStyleLayer(identifier: String,source: NGLSource) -> NGLStyleLayer {
       let line = NGLLineStyleLayer(identifier: identifier, source: source)
       line.lineWidth = NSExpression(format: "ngl_interpolate:withCurveType:parameters:stops:($zoomLevel, 'linear', nil, %@)", NBRouteLineWidthByZoomLevel)
       line.lineColor = NSExpression(format: "TERNARY(isAlternateRoute == true, %@, NGL_MATCH(congestion, 'low' , %@, 'moderate', %@, 'heavy', %@, 'severe', %@, %@))", routeAlternateColor, trafficLowColor, trafficModerateColor, trafficHeavyColor, trafficSevereColor, trafficUnknownColor)
       line.lineOpacity = NSExpression(forConstantValue: 1)
       line.lineCap = NSExpression(forConstantValue: "round")
       line.lineJoin = NSExpression(forConstantValue: "round")

       return line
   }

   func routeCasingStyleLayer(identifier: String,source: NGLSource) -> NGLStyleLayer {
       let lineCasing = NGLLineStyleLayer(identifier: identifier, source: source)

       // Take the default line width and make it wider for the casing
       lineCasing.lineWidth = NSExpression(format: "ngl_interpolate:withCurveType:parameters:stops:($zoomLevel, 'linear', nil, %@)", NBRouteLineWidthByZoomLevel.multiplied(by: 1.3))

       lineCasing.lineColor = NSExpression(forConstantValue: routeCasingColor)

       lineCasing.lineCap = NSExpression(forConstantValue: "round")
       lineCasing.lineJoin = NSExpression(forConstantValue: "round")

       lineCasing.lineOpacity = NSExpression(forConditional: NSPredicate(format: "isAlternateRoute == true"),
                                             trueExpression: NSExpression(forConstantValue: 1),
                                             falseExpression: NSExpression(forConditional: NSPredicate(format: "isCurrentLeg == true"), trueExpression: NSExpression(forConstantValue: 1), falseExpression: NSExpression(forConstantValue: 0.85)))

       return lineCasing
   }
}

// MARK: - NavigationMapViewDelegate methods
extension RouteLinesStylingViewController: NavigationMapViewDelegate {

   func navigationMapView(_ mapView: NavigationMapView, routeStyleLayerWithIdentifier identifier: String, source: NGLSource) -> NGLStyleLayer? {

       return routeStyleLayer(identifier: identifier,source: source)
   }

   func navigationMapView(_ mapView: NavigationMapView, routeCasingStyleLayerWithIdentifier identifier: String, source: NGLSource) -> NGLStyleLayer? {
       return routeCasingStyleLayer(identifier: identifier,source: source)
   }
}

// MARK: - NavigationViewControllerDelegate methods
extension RouteLinesStylingViewController: NavigationViewControllerDelegate {


   func navigationViewControllerDidDismiss(_ navigationViewController: NavigationViewController, byCanceling canceled: Bool) {
       dismiss(animated: true, completion: nil)
   }

   func navigationViewController(_ navigationViewController: NavigationViewController, routeStyleLayerWithIdentifier identifier: String, source: NGLSource) -> NGLStyleLayer? {
       return routeStyleLayer(identifier: identifier,source: source)
   }

   func navigationViewController(_ navigationViewController: NavigationViewController, routeCasingStyleLayerWithIdentifier identifier: String, source: NGLSource) -> NGLStyleLayer? {
       return routeCasingStyleLayer(identifier: identifier,source: source)
   }
}
```

The code first defines a number of colors that will be used to style the route lines. These colors are:

- **trafficUnknownColor**: This color will be used to style route lines when the traffic conditions are unknown.

- **trafficLowColor**: This color will be used to style route lines when the traffic conditions are light.

- **trafficModerateColor**: This color will be used to style route lines when the traffic conditions are moderate.

- **trafficHeavyColor**: This color will be used to style route lines when the traffic conditions are heavy.

- **trafficSevereColor**: This color will be used to style route lines when the traffic conditions are severe.

- **routeCasingColor**: This color will be used to style the casing of the route lines.

- **routeAlternateColor**: This color will be used to style alternate route lines.

- **routeAlternateCasingColor**: This color will be used to style the casing of alternate route lines.

- **traversedRouteColor**: This color will be used to style routes that have already been traversed.

The code then defines a function called **routeStyleLayer().** This function takes two parameters: an **identifier** and a **source**.

- The identifier is used to identify the route style layer

- The source is the source of the route data.

- The function returns a **NGLStyleLayer** object that contains the style properties for the route line.

Inside the **routeStyleLayer()** function

- It first sets the **lineWidth** property of the **NGLStyleLayer** object to a value that varies depending on the zoom level. The **lineWidth** property controls the width of the route line.

- then sets the **lineColor** property of the **NGLStyleLayer** object to a value that depends on the traffic conditions and whether the route is an alternate route. The **lineColor** property controls the color of the route line.

- then sets the **lineOpacity** property of the **NGLStyleLayer** object to a value of 1. The lineOpacity property controls the opacity of the route line.

- then sets the **lineCap** property of the **NGLStyleLayer** object to a value of "round". The lineCap property controls the shape of the ends of the route line.

- then sets the **lineJoin** property of the **NGLStyleLayer** object to a value of "round". The lineJoin property controls the shape of the corners of the route line.

The code then defines a function called **routeCasingStyleLayer()**. This function is similar to the **routeStyleLayer()** function, but it styles the casing of the route lines.

- It sets the **lineWidth** property of the **NGLStyleLayer** object to a value that is 1.3 times the width of the route line.

- Then sets the **lineColor** property of the **NGLStyleLayer** object to a value of routeCasingColor.

- Then sets the **lineCap** property of the **NGLStyleLayer** object to a value of "round".

- Then sets the **lineJoin** property of the **NGLStyleLayer** object to a value of "round".

- Then sets the **lineOpacity** property of the **NGLStyleLayer** object to a value that depends on whether the route is an alternate route and whether it is the current route leg.

The code then implements

- **navigationMapView(\_:routeStyleLayerWithIdentifier:source:)** method of the **NavigationMapViewDelegate** protocol. This method is called by the NavigationMapView object when it needs to create a route style layer. The method returns the **NGLStyleLayer** object that was created by the **routeStyleLayer()** function.

- **navigationMapView(\_:routeCasingStyleLayerWithIdentifier:source:)** method of the **NavigationMapViewDelegate** protocol. This method is called by the **NavigationMapView** object when it needs to create a route casing style layer. The method returns the **NGLStyleLayer** object that was created by the **routeCasingStyleLayer()** function.

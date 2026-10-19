# Custom Waypoint Styling

Easily tailor the waypoint styling to suit your preferences and create a visually appealing and intuitive navigation experience.

This example shows:

- How to customize the UI of waypoints displayed in a route

- The waypoint styling is customized in CustomWaypointStylingViewController

![documentation image](https://static.nextbillion.io/docs-next/docs/navigation/ios/custom-waypoint-styling.webp)

For all code examples, refer to [Navigation Code Examples](https://github.com/nextbillion-ai/ios-navigation-demo)

**CustomWaypointStylingViewController** [view source](https://github.com/nextbillion-ai/ios-navigation-demo/blob/main/navigation-ios-demo/Custom-Waypoint-Styling.swift)

```swift
import UIKit
import NbmapNavigation
import NbmapCoreNavigation
import Nbmap

class CustomWaypointStylingViewController: UIViewController {

   var navigationMapView: NavigationMapView? {
       didSet {
           oldValue?.removeFromSuperview()
           if let navigationMapView = navigationMapView {
               view.insertSubview(navigationMapView, at: 0)
           }
       }
   }

   var routes : [Route]? {
       didSet {
           if oldValue != nil || routes == nil || routes?.first == nil {
               navigationMapView?.removeRoutes()
               navigationMapView?.removeRouteDurationSymbol()
               if let annotation = navigationMapView?.annotations?.last {
                   navigationMapView?.removeAnnotation(annotation)
               }
               return
           }

           guard let routes = routes,
                 let current = routes.first
           else {
               return
           }

           navigationMapView?.showRoutes(routes)
           navigationMapView?.showWaypoints(current)
           navigationMapView?.showRouteDurationSymbol(routes)
       }
   }

   private let startButton = UIButton()

   override func viewDidLoad() {
       super.viewDidLoad()

       self.navigationMapView = NavigationMapView(frame: view.bounds)

       navigationMapView?.userTrackingMode = .follow
       navigationMapView?.navigationMapDelegate = self
       setupStartButton()
       requestRoutes()

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

   @objc func performAction(_ sender: Any) {
       guard let routes = self.routes else {
           return
       }
       let navigationService = NBNavigationService(routes: routes, routeIndex: 0)
       let styles = [DayStyle(), NightStyle()]
       let navigationOptions = NavigationOptions(styles:styles,navigationService: navigationService)

       let navigationViewController = NavigationViewController(for: routes,navigationOptions: navigationOptions)
       navigationViewController.modalPresentationStyle = .fullScreen

       navigationViewController.delegate = self

       present(navigationViewController, animated: true, completion: nil)
   }

   func requestRoutes(){
       let origin = CLLocation(latitude: 37.775252, longitude: -122.416082)
       let firstWaypoint = CLLocation(latitude: 37.779196, longitude: -122.410833)
       let secondWaypoint = CLLocation(latitude: 37.777342, longitude: -122.404094)

       let options = NavigationRouteOptions(locations: [origin,firstWaypoint,secondWaypoint])
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


   func customShape(for waypoints: [Waypoint], legIndex: Int) -> NGLShape? {
       var features = [NGLPointFeature]()

       for (waypointIndex, waypoint) in waypoints.enumerated() {
           let feature = NGLPointFeature()
           feature.coordinate = waypoint.coordinate
           feature.attributes = [
               "waypointCompleted": waypointIndex < legIndex,
               "name": waypointIndex + 1
           ]
           features.append(feature)
       }

       return NGLShapeCollectionFeature(shapes: features)
   }

   func customWaypointCircleStyleLayer(identifier: String, source: NGLSource) -> NGLStyleLayer {
       let circles = NGLCircleStyleLayer(identifier: identifier, source: source)
       let opacity = NSExpression(forConditional: NSPredicate(format: "waypointCompleted == true"), trueExpression: NSExpression(forConstantValue: 0.5), falseExpression: NSExpression(forConstantValue: 1))

       circles.circleColor = NSExpression(forConstantValue: UIColor(red:0.9, green:0.9, blue:0.9, alpha:1.0))
       circles.circleOpacity = opacity
       circles.circleRadius = NSExpression(forConstantValue: 10)
       circles.circleStrokeColor = NSExpression(forConstantValue: UIColor.green)
       circles.circleStrokeWidth = NSExpression(forConstantValue: 1)
       circles.circleStrokeOpacity = opacity

       return circles
   }

   func customWaypointSymbolStyleLayer(identifier: String, source: NGLSource) -> NGLStyleLayer {
       let symbol = NGLSymbolStyleLayer(identifier: identifier, source: source)

       symbol.text = NSExpression(format: "CAST(name, 'NSString')")
       symbol.textOpacity = NSExpression(forConditional: NSPredicate(format: "waypointCompleted == true"), trueExpression: NSExpression(forConstantValue: 0.5), falseExpression: NSExpression(forConstantValue: 1))
       symbol.textFontSize = NSExpression(forConstantValue: 10)
       symbol.textHaloWidth = NSExpression(forConstantValue: 0.25)
       symbol.textHaloColor = NSExpression(forConstantValue: UIColor.blue)

       return symbol
   }

}

extension CustomWaypointStylingViewController: NavigationMapViewDelegate {

   func navigationMapView(_ mapView: NavigationMapView, waypointStyleLayerWithIdentifier identifier: String, source: NGLSource) -> NGLStyleLayer? {
       return customWaypointCircleStyleLayer(identifier: identifier, source: source)
   }

   func navigationMapView(_ mapView: NavigationMapView, waypointSymbolStyleLayerWithIdentifier identifier: String, source: NGLSource) -> NGLStyleLayer? {
       return customWaypointSymbolStyleLayer(identifier: identifier, source: source)
   }

   func navigationMapView(_ mapView: NavigationMapView, shapeFor waypoints: [Waypoint], legIndex: Int) -> NGLShape? {
       return customShape(for: waypoints, legIndex: legIndex)
   }
}

extension CustomWaypointStylingViewController: NavigationViewControllerDelegate {
   func navigationViewController(_ navigationViewController: NavigationViewController, waypointStyleLayerWithIdentifier identifier: String, source: NGLSource) -> NGLStyleLayer? {
       return customWaypointCircleStyleLayer(identifier: identifier, source: source)
   }

   func navigationViewController(_ navigationViewController: NavigationViewController, waypointSymbolStyleLayerWithIdentifier identifier: String, source: NGLSource) -> NGLStyleLayer? {
       return customWaypointSymbolStyleLayer(identifier: identifier, source: source)
   }

   func navigationViewController(_ navigationViewController: NavigationViewController, shapeFor waypoints: [Waypoint], legIndex: Int) -> NGLShape? {
       return customShape(for: waypoints, legIndex: legIndex)
   }

}
```

The code example is for a **CustomWaypointStylingViewController** class. This class is used to customize the UI of waypoints displayed in a route. The class does this by overriding the **navigationMapView(\_:waypointStyleLayerWithIdentifier:source:),** navigationMapView\*\*(_:waypointSymbolStyleLayerWithIdentifier:source:)\*\*, and \*\*navigationMapView(_:shapeFor:legIndex:)\*\* methods. The **navigationMapView(\_:waypointStyleLayerWithIdentifier:source:)** method is used to customize the style of the waypoint circle. The method takes three parameters:

- **mapView**: The **NavigationMapView** instance that is displaying the route.
- **identifier**: The identifier of the style layer.
- **source**: The source of the style layer.

The method returns a **NGLStyleLayer** instance that represents the custom style of the waypoint circle. The **NGLStyleLayer** instance can be used to specify the color, opacity, radius, and stroke of the waypoint circle.

The **navigationMapView(\_:waypointSymbolStyleLayerWithIdentifier:source:)** method is used to customize the style of the waypoint symbol. The method takes three parameters:

- **mapView**: The NavigationMapView instance that is displaying the route.

- **identifier**: The identifier of the style layer.

- **source**: The source of the style layer.

The method returns a **NGLStyleLayer** instance that represents the custom style of the waypoint symbol. The **NGLStyleLayer** instance can be used to specify the text, opacity, font size, halo width, and halo color of the waypoint symbol.

The **navigationMapView(\_:shapeFor:legIndex:)** method is used to customize the shape of the waypoints. The method takes three parameters:

- **mapView**: The NavigationMapView instance that is displaying the route.

- **waypoints**: The waypoints that are being displayed.

- **egIndex**: The index of the current leg.

The method returns a **NGLShape** instance that represents the custom shape of the waypoints. The **NGLShape** instance can be used to specify the coordinates of the waypoints.

By overriding these methods, you can customize the UI of waypoints displayed in a route. Here are some examples of how you can use the **CustomWaypointStylingViewController** class to customize the UI of waypoints:

- You can change the color of the waypoint circle.

- You can change the opacity of the waypoint circle.

- You can change the radius of the waypoint circle.

- You can change the stroke of the waypoint circle.

- You can change the text of the waypoint symbol.

- You can change the opacity of the waypoint symbol.

- You can change the font size of the waypoint symbol.

- You can change the halo width of the waypoint symbol.

- You can change the halo color of the waypoint symbol.

- You can change the coordinates of the waypoints.

# Map Directions

This example shows how to draw a directions on the NGLMapView.

- Request a direction by using NBAPIClient

- Get NBRoute object from the getDirections response

- Gets the geometry property from the NBRoute object.

- Converts the geometry property to a Feature object.

- Creates a NGLShapeSource object with the Feature object.

- Adds the NGLShapeSource object to the NGLMapView object's style.

- Creates a NGLShapeSource object with the NGLShapeSource object.

- Sets the lineColor property of the NGLLineStyleLayer object to red.

- Sets the lineWidth property of the NGLLineStyleLayer object.

- Adds the NGLLineStyleLayer object to the NGLMapView object's style.

![documentation image](https://static.nextbillion.io/docs-next/docs/maps/ios/map-directions.webp)

For all code examples, refer to [Maps Code Examples](https://github.com/nextbillion-ai/ios-map-example)

**DirectionsViewController** [view source](https://github.com/nextbillion-ai/ios-map-example/blob/main/ios-map-example/Directions.swift)

```swift
import Foundation
import UIKit
import Nbmap
class DirectionsViewController: UIViewController {
    var nbMapView: NGLMapView! {
        didSet {
            oldValue?.removeFromSuperview()
            if let mapView = nbMapView {
                view.insertSubview(mapView, at: 0)
            }
        }
    }

    override func viewDidLoad() {
        super.viewDidLoad()
        nbMapView = NGLMapView(frame:self.view.bounds)
        nbMapView.delegate = self
        drawDirections()
    }

    func drawDirections(){
        let locations: [CLLocationCoordinate2D] =  [
                   CLLocationCoordinate2D(latitude: 12.96206481, longitude: 77.56687669),
                   CLLocationCoordinate2D(latitude: 12.99150562, longitude: 77.61940507)
               ]
        let apiClient: NBAPIClient = NBAPIClient()
        apiClient.getDirections(locations) { [weak self] resp in
            guard let weakSelf = self else {
                return
            }
            let first = resp?.routes.first;
            if first is NBRoute {
                let route:NBRoute? = first as? NBRoute
                let geometry = route?.geometry
                let routeline = GeometryDecoder.covert(toFeature: geometry, precision:5)
                let routeSource = NGLShapeSource.init(identifier: "route-style-source", shape: routeline)
                weakSelf.nbMapView.style?.addSource(routeSource)
                let routeLayer = NGLLineStyleLayer.init(identifier: "route-layer", source: routeSource)
                routeLayer.lineColor = NSExpression.init(forConstantValue: UIColor.red)
                routeLayer.lineWidth = NSExpression.init(forConstantValue: 2)

                weakSelf.nbMapView.style?.addLayer(routeLayer)
            }
        }
    }
}

extension DirectionsViewController: NGLMapViewDelegate {
    // Set the camera after map style loaded
    func mapView(_ mapView: NGLMapView, didFinishLoading style: NGLStyle){

        let camera = NGLMapCamera(lookingAtCenter: CLLocationCoordinate2DMake(12.962, 77.56687669),
                                                                      acrossDistance:10000,
                                                                               pitch:0,
                                                                             heading:0)
        nbMapView.setCamera(camera, animated: false)

    }
}
```

The example code showcases a DirectionsViewController that initializes a MapView and includes a method called drawDirections() to draw directions on the map.

**Initializing MapView:**

- The code initializes a **NGLMapView** object called nbMapView in the **viewDidLoad()** method. It sets the frame of the map view to match the bounds of the current view controller's view. The map view is assigned as the delegate of the view controller.

**drawDirections() method:** The drawDirections() method is responsible for drawing directions on the map view. It performs the following steps:

- Defines an array of **CLLocationCoordinate2D** objects representing the **locations** for the directions.

- Creates an instance of **NBAPIClient** to interact with the map's API.

- Call the **getDirections(\_:completion:)** method of the apiClient to retrieve the directions based on the specified locations.

- In the completion handler, it retrieves the **first route** from the response.

- If a route is found, it extracts the route's **geometry** and converts it into a NGLShape using the **GeometryDecoder.covert(toFeature:precision:)** method.

- Creates a **NGLShapeSource** using the converted route's shape and adds it to the map view's style.

- Creates a **NGLLineStyleLayer** using the route source and configures its properties like line color and width.

- Adds the route layer to the map view's style.

**NGLMapViewDelegate:**

- The code extends the DirectionsViewController to conform to the NGLMapViewDelegate protocol. It includes the **mapView(\_ style:)** delegate method, which is called when the map style finishes loading. In this method, it creates a **NGLMapCamera** object and sets it as the camera for the map view.

Overall, this code initializes a MapView and uses the drawDirections() method to fetch and draw directions on the map view based on the provided locations.

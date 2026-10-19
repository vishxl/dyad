# Basic Map Display

Incorporating a map into your iOS application is made easy with our SDK, which provides a preconfigured style for seamless integration. The provided code snippet showcases how to add a `MapView` to your application with minimal effort.

```swift
import Foundation
import UIKit
import Nbmap
class MapViewController: UIViewController {
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

    }

    override func viewDidLoad() {
        super.viewDidLoad()
        nbMapView = NGLMapView(frame:self.view.bounds)
    }
}
```

![documentation image](https://static.nextbillion.io/docs-next/docs/maps/ios/getting-started-6.webp)

### Code Summary

To begin, you'll need to create a _MapViewController_ class that inherits from **UIViewController**. Inside this class, you'll find a variable named `nbMapView` of type _NGLMapView_. This variable is responsible for managing the `MapView` instance.

The _didSet_ property observer ensures that the previous `MapView` instance is removed from the _superview_ when a new instance is assigned to `nbMapView`. It then configures the new `MapView` by calling the _configureMapView()_ function and inserts it as a subview in the view hierarchy.

The **configureMapView()** function allows for additional customization of the MapView. In the provided code, it sets the autoresizing mask to ensure the MapView adjusts its size based on its parent view.

Within the `viewDidLoad()` method of the _MapViewController_, a new instance of _NGLMapView_ is created and assigned to the `nbMapView` variable. This initializes the `MapView` and sets its frame to match the bounds of the view controller's view.

By following this example, you'll be able to quickly add the first MapView to your iOS application, providing a foundation for further customization and interaction with the map.

### Move camera position

In the process of working with a map in your iOS application, it may be necessary to adjust the camera position to focus on a specific location or area. This can be achieved by utilizing the Move Camera Position functionality provided by our SDK.

To demonstrate this, the provided code snippet shows how to move the map camera position to a desired location.

```swift
import Foundation
import UIKit
import Nbmap
class MapViewController: UIViewController {

    var nbMapView: NGLMapView! {
        didSet {
            oldValue?.removeFromSuperview()
            if let mapView = nbMapView {
                configureMapView(nbMapView)
                view.insertSubview(mapView, at: 0)
                mapView.delegate = self
            }
        }
    }


    func configureMapView(_ mapView: NGLMapView) {
        mapView.autoresizingMask = [.flexibleWidth, .flexibleHeight]

    }

    override func viewDidLoad() {
        super.viewDidLoad()
        nbMapView = NGLMapView(frame:self.view.bounds)
    }
}

extension MapViewController: NGLMapViewDelegate {
    func mapView(_ mapView: NGLMapView, didFinishLoading style: NGLStyle){

        let camera = NGLMapCamera(lookingAtCenter: CLLocationCoordinate2DMake(12.97780156, 77.59656748),
                                  acrossDistance:10000,
                                  pitch:0,
                                  heading:0)
        nbMapView.fly(to: camera)

    }
}
```

In the _MapViewController_ class, a `mapView` delegate is set, allowing for the execution of custom behaviors when the map finishes loading.
Inside the _mapView(\_:didFinishLoading:)_ delegate method, a new `NGLMapCamera` instance is created. This camera object specifies the desired position by providing the coordinates of the center location, the distance across the view, the pitch and the heading. Adjust these values as needed to achieve the desired camera position.
Finally, the _nbMapView.fly(to:)_ method is called, triggering the map to animate smoothly to the specified camera position. This provides a visually pleasing transition for the user.

![documentation image](https://static.nextbillion.io/docs-next/docs/maps/ios/getting-started-7.webp)

By following this example, you can easily implement the Move Camera Position functionality in your iOS application, allowing you to dynamically adjust the view and focus on specific areas or locations within the map.

## Annotations

Annotations play a crucial role in providing visual markers and information on a map within an iOS application. They allow developers to highlight points of interest, specific locations, or custom data on the map surface. With the help of our SDK, incorporating annotations into your iOS application becomes effortless.

### Add Markers to MapView

Adding markers to a MapView is a fundamental task when working with maps in an iOS application. Markers serve as visual indicators on the map to represent specific locations or points of interest. With the help of our iOS SDK, incorporating markers into your MapView becomes a seamless process.

The provided code snippet demonstrates how to add markers to the MapView.

```swift
import Foundation
import UIKit
import Nbmap
class MarkerViewController: UIViewController {

    var nbMapView: NGLMapView! {
        didSet {
            oldValue?.removeFromSuperview()
            if let mapView = nbMapView {
                view.insertSubview(mapView, at: 0)
                mapView.delegate = self
            }
        }
    }

    var points : Array = [CLLocationCoordinate2D]()

    override func viewDidLoad() {
        super.viewDidLoad()
        nbMapView = NGLMapView(frame:self.view.bounds)
        addMarker()
    }

    func addMarker(){
        let locations: [CLLocationCoordinate2D] =  [
            CLLocationCoordinate2D(latitude: 12.97780156, longitude: 77.59656748),
            CLLocationCoordinate2D(latitude: 12.98208919, longitude: 77.60329262)
        ]

        if let currentAnnotations = nbMapView.annotations {
            nbMapView.removeAnnotations(currentAnnotations)
        }

        nbMapView.addAnnotations(locations.map({(coord)->
            NGLPointAnnotation in
            let annotation = NGLPointAnnotation()
            annotation.coordinate = coord
            return annotation
        }))

    }
}

extension MarkerViewController: NGLMapViewDelegate {
    func mapView(_ mapView: NGLMapView, didFinishLoading style: NGLStyle){

        let camera = NGLMapCamera(lookingAtCenter: CLLocationCoordinate2DMake(12.97780156, 77.59656748),
                                  acrossDistance:10000,
                                  pitch:0,
                                  heading:0)
        nbMapView.fly(to: camera)

    }
}
```

In the **MarkerViewController** class, the **nbMapView** instance is set up and configured. The **addMarker()** method is then called, which adds multiple markers to the MapView.
Inside the **addMarker()** method, an array of **CLLocationCoordinate2D** objects is created, representing the desired marker locations. The current annotations on the MapView are first removed, and then new **NGLPointAnnotation** objects are added for each coordinate in the array. These annotations are customized with their respective coordinates.
By utilizing the **addAnnotations()** method of the MapView, the markers are added to the map surface, visually representing the specified locations.
In the **mapView(\_:didFinishLoading:)** delegate method, a camera position is set to focus on a specific coordinate, ensuring that the markers are visible on the MapView. The **nbMapView.fly(to:)** method is then called to animate the camera movement to the specified position.

![documentation image](https://static.nextbillion.io/docs-next/docs/maps/ios/getting-started-8.webp)

By following this example and incorporating the provided code into your iOS application, you can easily add markers to the MapView, enabling you to highlight important locations or points of interest within your map-based application.

### Add a Polyline to MapView

Adding a polyline to a MapView can greatly enhance the visual representation of routes or paths in your iOS application. Our SDK simplifies the process of incorporating a polyline by providing a default polyline style that you can easily integrate.

The provided code snippet demonstrates how to add a polyline to the MapView.

```swift
import Foundation
import UIKit
import Nbmap
class MapViewController: UIViewController {

    var nbMapView: NGLMapView! {
        didSet {
            oldValue?.removeFromSuperview()
            if let mapView = nbMapView {
                configureMapView(nbMapView)
                view.insertSubview(mapView, at: 0)
                mapView.delegate = self
                drawPolyline()
            }
        }
    }

    let locations: [CLLocationCoordinate2D] =  [
               CLLocationCoordinate2D(latitude: 12.92948165, longitude: 77.61501446),
               CLLocationCoordinate2D(latitude: 12.95205978, longitude: 77.60494206),
               CLLocationCoordinate2D(latitude: 12.96612918, longitude: 77.60678866),
               CLLocationCoordinate2D(latitude: 12.96449325, longitude: 77.59654839)
           ]
    func drawPolyline(){
        if(locations.count > 1){
            let line = NGLPolyline(coordinates:locations,count: UInt(locations.count))
            nbMapView.addAnnotation(line)

        }
    }

    func configureMapView(_ mapView: NGLMapView) {
        mapView.autoresizingMask = [.flexibleWidth, .flexibleHeight]

    }

    override func viewDidLoad() {
        super.viewDidLoad()
        nbMapView = NGLMapView(frame:self.view.bounds)
    }
}

extension MapViewController: NGLMapViewDelegate {
    func mapView(_ mapView: NGLMapView, didFinishLoading style: NGLStyle){
        let camera = NGLMapCamera(lookingAtCenter: CLLocationCoordinate2DMake(12.96612918, 77.60678866),
                                  acrossDistance:20000,
                                  pitch:0,
                                  heading:0)
        nbMapView.fly(to: camera)

    }
}
```

In the `MapViewController` class, the `nbMapView` instance is set up and configured. The _drawPolyline()_ method is called within the `didSet` property observer of `nbMapView`, ensuring that the polyline is drawn when the MapView is ready.

Inside the _drawPolyline()_ method, a polyline is created using the provided array of `CLLocationCoordinate2D` objects. This array represents the coordinates that form the points of the polyline. If the array contains more than one coordinate, the polyline is added as an annotation to the MapView using the _nbMapView.addAnnotation()_ method.

In the _mapView(\_:didFinishLoading:)_ delegate method, a camera position is set to focus on a specific coordinate, ensuring that the added polyline is visible on the MapView. The _nbMapView.fly(to:)_ method is then called to animate the camera movement to the specified position.

![documentation image](https://static.nextbillion.io/docs-next/docs/maps/ios/getting-started-9.webp)

By following this example and incorporating the provided code into your iOS application, you can easily add a polyline to the MapView. The specified coordinates will be connected by a line, allowing you to display routes, paths, or any other desired lines on the map.

With the ability to add polylines to the MapView, you can effectively visualize routes, highlight paths, or display other line-based information within your map-based iOS application.

### Add a Polygon to MapView

Incorporating polygons into your MapView can be an effective way to highlight specific areas or define boundaries in your iOS application. With our SDK, adding a polygon to the MapView is made simple by following a similar logic to that of drawing polylines.
The provided code snippet demonstrates how to add a polygon to the MapView.

```swift
import Foundation
import UIKit
import Nbmap
class MapViewController: UIViewController {

    var nbMapView: NGLMapView! {
        didSet {
            oldValue?.removeFromSuperview()
            if let mapView = nbMapView {
                configureMapView(nbMapView)
                view.insertSubview(mapView, at: 0)
                mapView.delegate = self
                drawPolygon()
            }
        }
    }

    let locations: [CLLocationCoordinate2D] =  [
        CLLocationCoordinate2D(latitude: 12.92948165, longitude: 77.61501446),
        CLLocationCoordinate2D(latitude: 12.95205978, longitude: 77.60494206),
        CLLocationCoordinate2D(latitude: 12.96612918, longitude: 77.60678866),
        CLLocationCoordinate2D(latitude: 12.96449325, longitude: 77.59654839)
    ]

    func drawPolygon(){
        if let currentAnnotations = nbMapView.annotations {
            nbMapView.removeAnnotations(currentAnnotations)
        }

        let polygon: NGLPolygon = NGLPolygon.init(coordinates: locations, count: UInt(locations.count))
        nbMapView.addAnnotation(polygon)
    }

    func configureMapView(_ mapView: NGLMapView) {
        mapView.autoresizingMask = [.flexibleWidth, .flexibleHeight]

    }

    override func viewDidLoad() {
        super.viewDidLoad()
        nbMapView = NGLMapView(frame:self.view.bounds)
    }
}

extension MapViewController: NGLMapViewDelegate {
    func mapView(_ mapView: NGLMapView, didFinishLoading style: NGLStyle){

        let camera = NGLMapCamera(lookingAtCenter: CLLocationCoordinate2DMake(12.96612918, 77.60678866),
                                  acrossDistance:20000,
                                  pitch:0,
                                  heading:0)
        nbMapView.fly(to: camera)
    }
}
```

Inside the MapViewController class, the `nbMapView` instance is set up and configured. The _drawPolygon()_ method is called within the _didSet_ property observer of `nbMapView`, ensuring that the polygon is drawn when the MapView is ready.

Within the _drawPolygon()_ method, a polygon is created using the array of CLLocationCoordinate2D objects. These coordinates define the vertices of the polygon, and the count parameter specifies the number of vertices in the array. If there are existing annotations on the MapView, they are removed before adding the polygon annotation using the _nbMapView.addAnnotation()_ method.

In the _mapView(\_:didFinishLoading:)_ delegate method, a camera position is set to focus on a specific coordinate, ensuring that the added polygon is visible on the MapView. The _nbMapView.fly(to:)_ method is then called to animate the camera movement to the specified position.

![documentation image](https://static.nextbillion.io/docs-next/docs/maps/ios/getting-started-10.webp)

By following this example and incorporating the provided code into your iOS application, you can easily add a polygon to the MapView. The specified coordinates will form the boundary of the polygon, allowing you to visually represent areas or boundaries on the map. With the ability to add polygons to the MapView, you can effectively showcase specific areas, boundaries, or any other enclosed regions within your map-based iOS application.

### Add a Route Line to MapView

To display a route line, first fetch route geometry from your routing service, then render it on the map as a shape source and line style layer.

**Recommended flow:**

1. Get route geometry (GeoJSON or encoded polyline) from your routing backend.

   ```swift
   import Foundation
   import UIKit
   import Nbmap
   class MapViewController: UIViewController {

       var nbMapView: NGLMapView! {
           didSet {
               oldValue?.removeFromSuperview()
               if let mapView = nbMapView {
                   configureMapView(nbMapView)
                   view.insertSubview(mapView, at: 0)
                   mapView.delegate = self
                   drawDirections()
               }
           }
       }

       let locations: [CLLocationCoordinate2D] =  [
           CLLocationCoordinate2D(latitude: 12.96206481, longitude: 77.56687669),
           CLLocationCoordinate2D(latitude: 12.99150562, longitude: 77.61940507)
       ]

       func drawDirections(){
           nbMapView.addAnnotations(locations.map({(coord)->
               NGLPointAnnotation in
               let annotation = NGLPointAnnotation()
               annotation.coordinate = coord
               return annotation
           }))

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

       func configureMapView(_ mapView: NGLMapView) {
           mapView.autoresizingMask = [.flexibleWidth, .flexibleHeight]

       }

       override func viewDidLoad() {
           super.viewDidLoad()
           nbMapView = NGLMapView(frame:self.view.bounds)
       }
   }

   extension MapViewController: NGLMapViewDelegate {
       func mapView(_ mapView: NGLMapView, didFinishLoading style: NGLStyle){
           let camera = NGLMapCamera(lookingAtCenter: CLLocationCoordinate2DMake(12.96206481, 77.56687669),
                                   acrossDistance:50000,
                                   pitch:0,
                                   heading:0)
           nbMapView.fly(to: camera)

       }
   }
   ```

2. Convert geometry to NGLShape / NGLFeature.
3. Add NGLShapeSource to map style.
4. Create NGLLineStyleLayer and set line color / width.
5. Add the layer after style load is complete in mapView(\_:didFinishLoading:).

_Note:_ Route fetching capability is provided by your routing API/service, not by the base map rendering API alone.

After adding the route layer, adjust camera bounds so the full route is visible.
Use the style-load callback as the safe point to add route source and layers.

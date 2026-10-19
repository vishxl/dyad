# MapView Polygon

This example shows how to draw a NGLPolygon on the NGLMapView.

- Draw a Polygon by the given coordinates.

- Provide proxy methods to set properties of the Polygon, such as color and alpha. Also, provide some methods to handle user gesture events, such as selecting and deselecting the Polyline.

![documentation image](https://static.nextbillion.io/docs-next/docs/maps/ios/mapview-polygon.webp)

For all code examples, refer to [Maps Code Examples](https://github.com/nextbillion-ai/ios-map-example)

**PolygonViewController** [view source](https://github.com/nextbillion-ai/ios-map-example/blob/main/ios-map-example/Custom-Polygon.swift)

```swift
import UIKit
import Nbmap
class PolygonViewController: UIViewController {
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
        drawPolygon()
    }

    func drawPolygon(){
        let locations: [CLLocationCoordinate2D] =  [
            CLLocationCoordinate2D(latitude: 12.94798778, longitude: 77.57375084),
            CLLocationCoordinate2D(latitude: 12.93669616, longitude: 77.57385337),
            CLLocationCoordinate2D(latitude: 12.93639637, longitude: 77.58031279),
            CLLocationCoordinate2D(latitude: 12.94808770, longitude: 77.58000520)
        ]
        if let currentAnnotations = nbMapView.annotations {
            nbMapView.removeAnnotations(currentAnnotations)
        }

        let polygon: NGLPolygon = NGLPolygon.init(coordinates: locations, count: 4)
        nbMapView.addAnnotation(polygon)
    }
}
extension PolygonViewController: NGLMapViewDelegate {
    func mapView(_ mapView: NGLMapView, didFinishLoading style: NGLStyle){

        let camera = NGLMapCamera(lookingAtCenter: CLLocationCoordinate2DMake(12.94798778, 77.57375084),
                                                                      acrossDistance:10000,
                                                                               pitch:0,
                                                                             heading:0)
        nbMapView.fly(to: camera)

    }
    /**
     Returns the alpha value to use when rendering a shape annotation.
     A value of `0.0` results in a completely transparent shape. A value of `1.0`,
     the default, results in a completely opaque shape.
     This method sets the opacity of an entire shape, inclusive of its stroke and
     fill. To independently set the values for stroke or fill, specify an alpha
     component in the color returned by `-mapView:strokeColorForShapeAnnotation:` or
     `-mapView:fillColorForPolygonAnnotation:`.
     @param mapView The map view rendering the shape annotation.
     @param annotation The annotation being rendered.
     @return An alpha value between `0` and `1.0`.
     */
    func mapView(_ mapView: NGLMapView, alphaForShapeAnnotation annotation: NGLShape) -> CGFloat  {
        return 1.0
    }
    /**
     Returns the color to use when rendering the outline of a shape annotation.
     The default stroke color is the map view's tint color. If a pattern color is
     specified, the result is undefined.
     Opacity may be set by specifying an alpha component. The default alpha value is
     `1.0` and results in a completely opaque stroke.
     @param mapView The map view rendering the shape annotation.
     @param annotation The annotation being rendered.
     @return A color to use for the shape outline.
     */
    func mapView(_ mapView: NGLMapView, strokeColorForShapeAnnotation annotation: NGLShape) -> UIColor  {
        return UIColor.red
    }
    /**
     Returns the color to use when rendering the fill of a polygon annotation.
     The default fill color is the map view's tint color. If a pattern color is
     specified, the result is undefined.
     Opacity may be set by specifying an alpha component. The default alpha value is
     `1.0` and results in a completely opaque shape.
     @param mapView The map view rendering the polygon annotation.
     @param annotation The annotation being rendered.
     @return The polygon's interior fill color.
     */

    func mapView(_ mapView: NGLMapView, fillColorForPolygonAnnotation annotation: NGLPolygon) -> UIColor  {
        return UIColor.blue
    }

    /**
     Returns the line width in points to use when rendering the outline of a
     polyline annotation.
     By default, the polyline is outlined with a line `3.0` points wide.
     @param mapView The map view rendering the polygon annotation.
     @param annotation The annotation being rendered.
     @return A line width for the polyline, measured in points.
     */
    func mapView(_ mapView: NGLMapView, lineWidthForPolylineAnnotation annotation: NGLPolyline) -> CGFloat  {
        return 3.0
    }

    /**
     Tells the delegate that one of its annotations was selected.
     You can use this method to track changes in the selection state of annotations.
     If the annotation is associated with an annotation view, you can also implement
     `-mapView:didSelectAnnotationView:`, which is called immediately after this
     method is called.
     @param mapView The map view containing the annotation.
     @param annotation The annotation that was selected.
     */
    func mapView(_ mapView: NGLMapView, didSelect annotation: NGLAnnotation){
        let title = (annotation.title ?? "") ?? ""
        print("didSelect title:" + title)
        let subtitle = (annotation.subtitle ?? "") ?? ""
        print("didSelect subtitle:" + subtitle)
    }
    /**
     Tells the delegate that one of its annotations was deselected.
     You can use this method to track changes in the selection state of annotations.
     If the annotation is associated with an annotation view, you can also implement
     `-mapView:didDeselectAnnotationView:`, which is called immediately after this
     method is called.
     @param mapView The map view containing the annotation.
     @param annotation The annotation that was deselected.
     */
    func mapView(_ mapView: NGLMapView, didDeselect annotation: NGLAnnotation){
        let title = (annotation.title ?? "") ?? ""
        print("didDeselect title:" + title)
        let subtitle = (annotation.subtitle ?? "") ?? ""
        print("didDeselect subtitle:" + subtitle)
    }
}
```

The example code sets up a view controller with a map view, allows drawing a **polygon** on the map, and customizes the polygon's style and annotation events using the **NGLMapViewDelegate** methods.

## Initialization of MapView

- The code initializes an instance of **NGLMapView** and assigns it to the nbMapView property. The map view is configured with a flexible width and height and added as a subview to the view controller's view. The map view's delegate is set to the view controller.

## Drawing a Polygon

- The code defines a function named **drawPolygon** that creates a polygon on the map view. It specifies an array of coordinates for the polygon's vertices and creates an **NGLPolygon** object with these **coordinates**. The existing annotations on the map view are removed, and the created polygon is added as an annotation to the map view.

## Custom Polygon Style

- The code includes several delegate methods from the **NGLMapViewDelegate** protocol to customize the style of the polygon and handle various events related to annotations.
  - **mapView(\_:didFinishLoading:)** method sets the initial camera position.

  - **mapView(\_:alphaForShapeAnnotation:)**, **mapView(\_:strokeColorForShapeAnnotation:)** **mapView(\_:fillColorForPolygonAnnotation:)**, **mapView(\_:lineWidthForPolylineAnnotation:)** methods define the alpha value, stroke color, fill color, and line width for the polygon annotation, respectively.

  - **mapView(\_:didSelect:)** and **mapView(\_:didDeselect:)** methods handle the selection and deselection events of annotations and print their titles and subtitles.

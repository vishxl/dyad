# Annotations

This section focuses on the usage and customization of different types of annotations on a map. Annotations are visual elements that represent specific points, lines, or shapes on a map. They provide additional information and enhance the user experience by adding context to the displayed map.

It covers various types of annotations and their respective functionalities. Each subsection explains the specific annotation type, provides examples of how to use them, and discusses the relevant protocols or interfaces involved.

## PointAnnotation

An `NGLPointAnnotation` object represents a one-dimensional shape located at a single geographical coordinate. Depending on how it is used, an `NGLPointAnnotation` object is known as a point annotation or point shape. For example, you could use a point shape to represent a city at low zoom levels, an address at high zoom levels, or the location of a long press gesture.

### Interface

For more interactivity, add a selectable point annotation to a map view using the `-[NGLMapView addAnnotation:]` method. A point annotation’s _annotation.title_ and _annotation.subtitle_ properties define the default content of the annotation’s callout or pop-over.

```swift
​​func addAnnotation(_ annotation: NGLAnnotation)

func addAnnotations(_ annotations: [NGLAnnotation])
```

### Example

```swift
let coord = CLLocationCoordinate2D(latitude: 12.97780156, longitude: 77.59656748)
let annotation = NGLPointAnnotation()
annotation.title = "title"
annotation.subtitle = "subtitle"
annotation.coordinate = coord
nbMapView.addAnnotation(annotation)
```

### Protocol

Alternatively, define your own model class that conforms to the `NGLAnnotation` protocol. Configure a point annotation’s appearance using
`-[NGLMapViewDelegate mapView:imageForAnnotation:]` or
`-[NGLMapViewDelegate mapView:viewForAnnotation:]`

```swift
func mapView(_ mapView: NGLMapView, imageFor annotation: NGLAnnotation)
```

To show a callout view when tapping on an annotation you can implement the method annotationCanShowCallout and return true

```swift
func mapView(_ mapView: NGLMapView, annotationCanShowCallout annotation: NGLAnnotation) -> Bool{
   return true
}
```

You can add accessory views to either end of the callout by implementing the `-mapView:leftCalloutAccessoryViewForAnnotation:` and `-mapView:rightCalloutAccessoryViewForAnnotation:` methods.

```swift
func mapView(_ mapView: NGLMapView, rightCalloutAccessoryViewFor annotation: NGLAnnotation) -> UIView?

func mapView(_ mapView: NGLMapView, leftCalloutAccessoryViewFor annotation: NGLAnnotation) -> UIView?
```

You can further customize the callout’s contents by implementing the
`-mapView:calloutViewForAnnotation:` method.

```swift
func mapView(_ mapView: NGLMapView, calloutViewFor annotation: NGLAnnotation) -> NGLCalloutView?

func mapView(_ mapView: NGLMapView, tapOnCalloutFor annotation: NGLAnnotation)
```

## PolylineAnnotation

An `NGLPolyline` object represents a shape consisting of two or more vertices, specified as _CLLocationCoordinate2D_ instances, and the line segments that connect them. For example, you could use a polyline to represent a road or the path along which something moves.

The vertices are automatically connected in the order in which you provide them. The first and last vertices are not connected to each other, but you can specify the same _CLLocationCoordinate2D_ as the first and last vertices in order to close the polyline. To fill the space within the shape, use an `NGLPolygon` object. To group multiple polylines together in one shape, use an `NGLMultiPolyline` or `NGLShapeCollection` object.

### Example

you can create and add a polyline overlay directly to a map view using the `-[NGLMapView addAnnotation:]` or `-[NGLMapView addOverlay:]` method.

```swift
var points : Array = [CLLocationCoordinate2D]()
points.append(CLLocationCoordinate2D(latitude: 12.97780156, longitude: 77.59656748)
)
...
let line = NGLPolyline(coordinates:points, count: UInt(points.count))

nbMapView.addAnnotation(line)
```

### Protocol

Configure a polyline overlay’s appearance using following methods

```swift
func mapView(_ mapView: NGLMapView, strokeColorForShapeAnnotation annotation: NGLShape) -> UIColor  {
   return UIColor.red
}

func mapView(_ mapView: NGLMapView, fillColorForPolygonAnnotation annotation: NGLPolygon) -> UIColor  {
   return UIColor.blue
}

func mapView(_ mapView: NGLMapView, lineWidthForPolylineAnnotation annotation: NGLPolyline) -> CGFloat  {}
```

You can set the opacity of an entire polyline shape, inclusive of its stroke and fill by implementing the method

```swift
func mapView(_ mapView: NGLMapView, alphaForShapeAnnotation annotation: NGLShape) -> CGFloat  {
  return 1.0
}
```

## PolygonAnnotation

An `NGLPolygon` object represents a closed shape consisting of four or more vertices, specified as `CLLocationCoordinate2D` instances, and the edges that connect them. For example, you could use a polygon shape to represent a building, a lake, or an area you want to highlight.

### Example

Create a polyline with coordinates

```swift
let locations: [CLLocationCoordinate2D] =  [
            CLLocationCoordinate2D(latitude: 12.94798778, longitude: 77.57375084),
            CLLocationCoordinate2D(latitude: 12.93669616, longitude: 77.57385337),
            CLLocationCoordinate2D(latitude: 12.93639637, longitude: 77.58031279),
            CLLocationCoordinate2D(latitude: 12.94808770, longitude: 77.58000520)
        ]

let polygon: NGLPolygon = NGLPolygon(coordinates: locations, count: 4)
```

you can add a polygon overlay directly to a map view using the `-[NGLMapView addAnnotation:]` or `-[NGLMapView addOverlay:]` method.

```swift
​​func addAnnotation(_ annotation: NGLAnnotation)
func addAnnotations(_ annotations: [NGLAnnotation])

nbMapView.addAnnotation(polygon)
```

### Protocol

The following methods can be used to configure the appearance of a polygon overlay using the Protocol:

```swift
func mapView(_ mapView: NGLMapView, alphaForShapeAnnotation annotation: NGLShape) -> CGFloat  {
        return 1.0
    }
```

This method sets the opacity of the entire shape, including its stroke and fill. The value returned should be a _CGFloat_ representing the desired opacity. In the provided example, the opacity is set to 1.0, indicating full opacity.

```swift
func mapView(_ mapView: NGLMapView, strokeColorForShapeAnnotation annotation: NGLShape) -> UIColor  {
        return UIColor.red
    }
```

This method sets the default stroke color for the shape annotation. The returned UIColor object represents the desired stroke color. In the provided example, the stroke color is set to red.

```swift
func mapView(_ mapView: NGLMapView, fillColorForPolygonAnnotation annotation: NGLPolygon) -> UIColor  {
        return UIColor.blue
    }
```

This method sets the fill color for the polygon annotation. The returned UIColor object represents the desired fill color. In the provided example, the fill color is set to blue.

```swift
 func mapView(_ mapView: NGLMapView, lineWidthForPolylineAnnotation annotation: NGLPolyline) -> CGFloat  {
        return 3.0
    }
```

This method sets the line width, in points, for rendering the outline of a polyline annotation. The value returned should be a CGFloat representing the desired line width. In the provided example, the line width is set to 3.0 points.

## CircleAnnotation

An `NGLCircleStyleLayer` is a style layer that renders one or more filled circles on the map. A circle-style layer renders circles whose radii are measured in screen units. To display circles on the map whose radii correspond to real-world distances, use many-sided regular polygons and configure their appearance using an `NGLFillStyleLayer` object.

Use a circle-style layer to configure the visual appearance of point or point collection features. These features can come from vector tiles loaded by an `NGLVectorTileSource` object, or they can be `NGLPointAnnotation`, `NGLPointFeature`, `NGLPointCollection`, or `NGLPointCollectionFeature` instances in an `NGLShapeSource` or `NGLComputedShapeSource` object.

### Protocol

When working with circle-style layers, you can implement the `NGLAnnotation` protocol to customize the visual representation of your circle annotations on the map. The protocol allows you to define attributes such as the circle's color, size, and other properties.

Here's an example of how you can create and customize an _NGLPointFeature_, which conforms to the `NGLAnnotation` protocol, and a corresponding `NGLShapeSource` to represent a circle annotation:

```swift
let shape = NGLPointFeature()
shape.coordinate = CLLocationCoordinate2D(latitude: 51.050459433092655, longitude: -114.06847000122069)
shape.identifier = "circle-feature"
shape.attributes = ["color": "green"]

let pointSource = NGLShapeSource(identifier: "circle-point-source", shape: shape, options: nil)
```

### Example

You can access an existing circle style layer using the `-[NGLStyle layerWithIdentifier:]` method if you know its identifier; otherwise, find it using the `NGLStyle.layers` property. You can also create a new circle style layer and add it to the style using a method such as `-[NGLStyle addLayer:]`.

```swift
let circleLayer = NGLCircleStyleLayer(identifier: "leaf-circle-layer", source: pointSource)
circleLayer.predicate = NSPredicate(format: "color = 'green'")
circleLayer.circleColor = NSExpression(forConstantValue: UIColor.green)
circleLayer.circleRadius = NSExpression(forConstantValue: 10)

if let shapeLayer = self.nbMapView.style?.layer(withIdentifier: "leaf-circle-layer") {
   self.nbMapView.style?.removeLayer(shapeLayer)
}

nbMapView.style?.addLayer(circleLayer)
```

## ViewAnnotation

You can customize a View Annotation by implementing the following methods to mark a point annotation with a view object. If you want to mark a particular point annotation with a static image instead, omit this method or have it return `nil` for that annotation, then implement
`-mapView:imageForAnnotation:` instead.

```swift
func mapView(_ mapView: NGLMapView, viewFor annotation: NGLAnnotation) -> NGLAnnotationView?

func mapView(_ mapView: NGLMapView, imageFor annotation: NGLAnnotation) -> NGLAnnotationImage?
```

Annotation views are compatible with UIKit, Core Animation, and other Cocoa Touch frameworks. On the other hand, static annotation images use less memory and draw more quickly than annotation views.

The user location annotation view can also be customized via this method. When `annotation` is an instance of `NGLUserLocation` (or equal to the map view’s `userLocation` property), return an instance of `NGLUserLocationAnnotationView` (or a subclass thereof).

### Custom ViewAnnotation and UserLocationView with a view object

```swift
func mapView(_ mapView: NGLMapView, imageFor annotation: NGLAnnotation) -> NGLAnnotationImage?{
        return nil
}


func mapView(_ mapView: NGLMapView, viewFor annotation: NGLAnnotation) -> NGLAnnotationView? {
        if annotation === mapView.userLocation {
            if mapView.showsUserLocation {
                let annotationView = NGLUserLocationAnnotationView(frame: .zero)
                annotationView.frame = CGRect(x: 0, y: 0, width: annotationView.intrinsicContentSize.width, height: annotationView.intrinsicContentSize.height)
                return annotationView
            }

            return nil
        }


        var annotationView = mapView.dequeueReusableAnnotationView(withIdentifier:"NBXViewControllerAnnotationViewReuseIdentifer")
        if annotationView == nil {
            annotationView = NGLAnnotationView(reuseIdentifier: "NBXViewControllerAnnotationViewReuseIdentifer")
            annotationView?.frame = CGRect(x: 0, y: 0, width: 20, height: 20)
            annotationView?.backgroundColor = .red

            annotationView?.isDraggable = true
        } else {
            // orange indicates that the annotation view was reused
            annotationView?.backgroundColor = .orange
        }

        return annotationView
    }
```

### Custom ViewAnnotation with a static Image

```swift
func mapView(_ mapView: NGLMapView, imageFor annotation: NGLAnnotation) -> NGLAnnotationImage?{
        return NGLAnnotationImage(image: UIImage(named: "marker")!,reuseIdentifier:"Marker-Identifier")
 }


    func mapView(_ mapView: NGLMapView, viewFor annotation: NGLAnnotation) -> NGLAnnotationView? {
       return nil
 }
```

## Remove annotation

The 'removeAnnotation' method allows you to effectively remove an annotation from the map view, also deselecting it if it happens to be currently selected. When an annotation is removed, it is completely disassociated from the map view, ensuring that it will no longer be visible on the map. Typically, you would use this method when you intend to hide or delete a specific annotation from the map.

Here are the available methods for removing annotations:

```swift
func removeAnnotation(_ annotation: NGLAnnotation)

func removeAnnotations(_ annotations: [NGLAnnotation])
```

1. **func removeAnnotation(\_ annotation: NGLAnnotation)**: This method removes a single annotation from the map view.
2. **func removeAnnotations(\_ annotations: [NGLAnnotation])**: Use this method to remove multiple annotations simultaneously by providing an array of annotations to be removed.

These functions provide a straightforward way to manage and manipulate annotations on the map, enhancing your control over their visibility and presence.

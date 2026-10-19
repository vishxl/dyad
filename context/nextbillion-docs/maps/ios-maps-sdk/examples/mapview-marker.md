# MapView Marker

This example shows how to add a marker on the **NGLMapView**.

- User long-press to select points.

- Add a marker on the NGLMapView

- Provide delegate methods to set properties of the Marker, such as color and width.

- Provide delegate methods to handle user gesture events, such as selecting and deselecting the marker.

- Provide delegate method to customize the marker image

![documentation image](https://static.nextbillion.io/docs-next/docs/maps/ios/mapview-marker.webp)

For all code examples, refer to [Maps Code Examples](https://github.com/nextbillion-ai/ios-map-example)

**MarkerViewController** [view source](https://github.com/nextbillion-ai/ios-map-example/blob/main/ios-map-example/Custom-Marker.swift)

```swift
import Foundation
import UIKit
import Nbmap

class MarkerViewController: UIViewController {
    var nbMapView: NGLMapView! {
        didSet {
            oldValue?.removeFromSuperview()
            if let mapView = nbMapView {
                configureMapView(mapView)
                view.insertSubview(mapView, at: 0)
                mapView.delegate = self
            }
        }
    }

    var points : Array = [CLLocationCoordinate2D]()

    override func viewDidLoad() {
        super.viewDidLoad()
        nbMapView = NGLMapView(frame:self.view.bounds)
    }

    func configureMapView(_ mapView: NGLMapView) {
        mapView.autoresizingMask = [.flexibleWidth, .flexibleHeight]
        mapView.delegate = self

        let singleTap = UITapGestureRecognizer(target: self, action: #selector(didTapMap(_:)))
        mapView.gestureRecognizers?.filter({ $0 is UITapGestureRecognizer }).forEach(singleTap.require(toFail:))
        mapView.addGestureRecognizer(singleTap)
    }

    @objc func didTapMap(_ tap: UITapGestureRecognizer) {
        let point = tap.location(in: tap.view)
        let coordinate = nbMapView.convert(point, toCoordinateFrom: nbMapView)
        addMarker(coordinates: [coordinate])
    }

    func addMarker(coordinates: [CLLocationCoordinate2D]){
        if let currentAnnotations = nbMapView.annotations {
            nbMapView.removeAnnotations(currentAnnotations)
        }

        nbMapView.addAnnotations(coordinates.map({(coord)-> NGLPointAnnotation in
            let annotation = NGLPointAnnotation()
            annotation.title = "title"
            annotation.subtitle = "subtitle"
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

        nbMapView.setCamera(camera, animated: false)


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
        print("didDeselect annotation")
    }

    /**
     Tells the delegate that one of its annotation views was selected.
     You can use this method to track changes in the selection state of annotation
     views.
     This method is only called for annotation views. To track changes in the
     selection state of all annotations, including those associated with static
     annotation images, implement `-mapView:didSelectAnnotation:`, which is called
     immediately before this method is called.
     @param mapView The map view containing the annotation.
     @param annotationView The annotation view that was selected.
     */
    func mapView(_ mapView: NGLMapView, didSelect annotationView: NGLAnnotationView){
        print("didSelect annotationView")
    }

 /**
     Get an annotation image object to mark the given point annotation object on
     the map.
     Implement this method to mark a point annotation with a static image. If you
     want to mark a particular point annotation with an annotation view instead,
     omit this method or have it return `nil` for that annotation, then implement
     `-mapView:viewForAnnotation:`.
     Static annotation images use less memory and draw more quickly than annotation
     views. On the other hand, annotation views are compatible with UIKit, Core
     Animation, and other Cocoa Touch frameworks.
     @param mapView The map view that requested the annotation image.
     @param annotation The object representing the annotation that is about to be
        displayed.
     @return The annotation image object to display for the given annotation or
        `nil` if you want to display the default marker image or an annotation view.
     */
    func mapView(_ mapView: NGLMapView, imageFor annotation: NGLAnnotation) -> NGLAnnotationImage?{
        return NGLAnnotationImage(image: UIImage(named: "marker")!,reuseIdentifier:"Marker-Identifier")
    }


    /**
     Tells the delegate that one of its annotation views was deselected.
     You can use this method to track changes in the selection state of annotation
     views.
     This method is only called for annotation views. To track changes in the
     selection state of all annotations, including those associated with static
     annotation images, implement `-mapView:didDeselectAnnotation:`, which is called
     immediately before this method is called.
     @param mapView The map view containing the annotation.
     @param annotationView The annotation view that was deselected.
     */
    func mapView(_ mapView: NGLMapView, didDeselect annotationView: NGLAnnotationView){
        print("didDeselect annotationView")
    }
//    #pragma mark Managing Callout Views
    /**
     Returns a Boolean value indicating whether the annotation is able to display
     extra information in a callout bubble.
     This method is called after an annotation is selected, before any callout is
     displayed for the annotation.
     If the return value is `YES`, a callout view is shown when the user taps on an
     annotation, selecting it. The default callout displays the annotation's title
     and subtitle. You can add accessory views to either end of the callout by
     implementing the `-mapView:leftCalloutAccessoryViewForAnnotation:` and
     `-mapView:rightCalloutAccessoryViewForAnnotation:` methods. You can further
     customize the callout's contents by implementing the
     `-mapView:calloutViewForAnnotation:` method.
     If the return value is `NO`, or if this method is absent from the delegate, or
     if the annotation lacks a title, the annotation will not show a callout even
     when selected.
     @param mapView The map view that has selected the annotation.
     @param annotation The object representing the annotation.
     @return A Boolean value indicating whether the annotation should show a
        callout.
     */
    func mapView(_ mapView: NGLMapView, annotationCanShowCallout annotation: NGLAnnotation) -> Bool{
        print("didDeselect annotationCanShowCallout")
        return true
    }

    /**
     Returns a callout view to display for the given annotation.
     If this method is present in the delegate, it must return a new instance of a
     view dedicated to display the callout. The returned view will be configured by
     the map view.
     If this method is absent from the delegate, or if it returns `nil`, a standard,
     two-line, bubble-like callout view is displayed by default.
     @param mapView The map view that requested the callout view.
     @param annotation The object representing the annotation.
     @return A view conforming to the `NGLCalloutView` protocol, or `nil` to use the
        default callout view.
     */
    func mapView(_ mapView: NGLMapView, calloutViewFor annotation: NGLAnnotation) -> NGLCalloutView? {
        print("didDeselect calloutViewFor")
        return nil
    }

    /**
     Returns the view to display on the left side of the standard callout bubble.
     The left callout view is typically used to convey information about the
     annotation or to link to custom information provided by your application.
     If the view you specify is a descendant of the `UIControl` class, you can use
     the map view's delegate to receive notifications when your control is tapped,
     by implementing the `-mapView:annotation:calloutAccessoryControlTapped:`
     method. If the view you specify does not descend from `UIControl`, your view is
     responsible for handling any touch events within its bounds.
     If this method is absent from the delegate, or if it returns `nil`, the
     standard callout view has no accessory view on its left side. The return value
     of this method is ignored if `-mapView:calloutViewForAnnotation:` is present in
     the delegate.
     To display a view on the callout's right side, implement the
     `-mapView:rightCalloutAccessoryViewForAnnotation:` method.
     @param mapView The map view presenting the annotation callout.
     @param annotation The object representing the annotation with the callout.
     @return The accessory view to display.
     */
    func mapView(_ mapView: NGLMapView, leftCalloutAccessoryViewFor annotation: NGLAnnotation) -> UIView? {
        print("leftCalloutAccessoryViewFor")
        return nil
    }

    /**
     Returns the view to display on the right side of the standard callout bubble.
     The right callout view is typically used to convey information about the
     annotation or to link to custom information provided by your application.
     If the view you specify is a descendant of the `UIControl` class, you can use
     the map view's delegate to receive notifications when your control is tapped,
     by implementing the `-mapView:annotation:calloutAccessoryControlTapped:`
     method. If the view you specify does not descend from `UIControl`, your view is
     responsible for handling any touch events within its bounds.
     If this method is absent from the delegate, or if it returns `nil`, the
     standard callout view has no accessory view on its right side. The return value
     of this method is ignored if `-mapView:calloutViewForAnnotation:` is present in
     the delegate.
     To display a view on the callout's left side, implement the
     `-mapView:leftCalloutAccessoryViewForAnnotation:` method.
     @param mapView The map view presenting the annotation callout.
     @param annotation The object representing the annotation with the callout.
     @return The accessory view to display.
     */
    func mapView(_ mapView: NGLMapView, rightCalloutAccessoryViewFor annotation: NGLAnnotation) -> UIView? {
        print("rightCalloutAccessoryViewFor")
        return nil
    }

    /**
     Tells the delegate that the user tapped one of the accessory controls in the
     annotation's callout view.
     In a standard callout view, accessory views contain custom content and are
     positioned on either side of the annotation title text. If an accessory view
     you specify is a descendant of the `UIControl` class, the map view calls this
     method as a convenience whenever the user taps your view. You can use this
     method to respond to taps and perform any actions associated with that control.
     For example, if your control displays additional information about the
     annotation, you could use this method to present a modal panel with that
     information.
     If your custom accessory views are not descendants of the `UIControl` class,
     the map view does not call this method. If the annotation has a custom callout
     view via the `-mapView:calloutViewForAnnotation:` method, you can specify the
     custom accessory views using the `NGLCalloutView` protocol's
     `leftAccessoryView` and `rightAccessoryView` properties.
     @param mapView The map view containing the specified annotation.
     @param annotation The annotation whose accessory view was tapped.
     @param control The control that was tapped.
     */
    func mapView(_ mapView: NGLMapView, calloutAccessoryControlTapped control: UIControl){
        print("calloutAccessoryControlTapped control")
    }

    /**
     Tells the delegate that the user tapped on an annotation's callout view.
     This method is called when the user taps on the body of the callout view, as
     opposed to the callout's left or right accessory view. If the annotation has a
     custom callout view via the `-mapView:calloutViewForAnnotation:` method, this
     method is only called whenever the callout view calls its delegate's
     `-[NGLCalloutViewDelegate calloutViewTapped:]` method.
     If this method is present on the delegate, the standard callout view's body
     momentarily highlights when the user taps it, whether or not this method does
     anything in response to the tap.
     @param mapView The map view containing the specified annotation.
     @param annotation The annotation whose callout was tapped.
     */
    func mapView(_ mapView: NGLMapView, tapOnCalloutFor annotation: NGLAnnotation){
        print("tapOnCalloutFor")
    }
}
```

The code provided is an implementation of a MarkerViewController that manages a map view with custom marker annotations. Here's a summary of the code:

Initialization of MapView: The code initializes an instance of **NGLMapView** and assigns it to the nbMapView property. The map view is configured with flexible width and height, added as a subview to the view controller's view, and the map view's delegate is set to the view controller.

Custom Marker View:

- The code provides functionality for adding custom markers to the map view. When the user taps on the map view, a marker is added at the tapped location. The existing markers are removed before adding the new marker. Each marker is represented by an **NGLPointAnnotation** object with a **title**, **subtitle**, and **coordinate**.

- The maker's image is set using the **imageFor annotation delegate** method, which returns a **custom marker image**. The code also includes delegate methods for handling events related to marker selection and callout views.
  - **mapView(\_:didFinishLoading:)**: Called when the map view finishes loading its style. It sets the initial camera position using an NGLMapCamera.

  - **mapView(\_:didDeselect:)**: Called when one of the annotations is deselected.

  - **mapView(\_:didSelect:)**: Called when one of the annotation views is selected.

  - **mapView(\_:imageFor:)**: Returns an NGLAnnotationImage to display for the given annotation. In this case, it returns a marker image with a specific identifier.

  - **mapView(\_:annotationCanShowCallout:)**: Returns a Boolean indicating whether the annotation should show a callout.

  - **mapView(\_:calloutViewFor:)**: Returns a custom callout view to display for the given annotation.

  - **mapView(\_:leftCalloutAccessoryViewFor:)**: Returns the left accessory view for the standard callout bubble.

  - **mapView(\_:rightCalloutAccessoryViewFor:)**: Returns the right accessory view for the standard callout bubble.

  - **mapView(\_:calloutAccessoryControlTapped:)**: Called when the user taps on an accessory control in the annotation's callout view.

  - **mapView(\_:tapOnCalloutFor:)**: Called when the user taps on the body of the callout view.

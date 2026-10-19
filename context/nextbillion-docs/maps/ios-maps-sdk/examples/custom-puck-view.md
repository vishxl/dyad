# Custom Puck View

This example shows how to customize your location puck view.

- To achieve a custom Puck view, you can inherit from the NGLUserLocationAnnotationView class.

- Replace the custom puck view of the **NGLMapView**

![documentation image](https://static.nextbillion.io/docs-next/docs/maps/ios/custom-puck-view.webp)

For all code examples, refer to [Maps Code Examples](https://github.com/nextbillion-ai/ios-map-example)

**CustomPuckViewController** [view source](https://github.com/nextbillion-ai/ios-map-example/blob/main/ios-map-example/Custom-PuckView.swift)

```swift
import UIKit
import Nbmap
class CustomPuckViewController: UIViewController {
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
        nbMapView.autoresizingMask = [.flexibleWidth, .flexibleHeight]
        nbMapView.delegate = self
        nbMapView.userTrackingMode = .follow
    }
}

// MARK: - NGLMapViewDelegate
extension CustomPuckViewController: NGLMapViewDelegate {

    /**
     Asks the user styling options for each default user location annotation view.

     This method is called many times during gesturing, so you should avoid performing
     complex or performance-intensive tasks in your implementation.

     @param mapView The map view that is tracking the user's location.
     */
    func mapView(styleForDefaultUserLocationAnnotationView mapView: NGLMapView) -> NGLUserLocationAnnotationViewStyle {
        let locationStyle =  NGLUserLocationAnnotationViewStyle()
        /**
         The fill color for the puck view.
         */
        locationStyle.puckFillColor = UIColor.blue
        /**
         The shadow color for the puck view.
         */
        locationStyle.puckShadowColor = UIColor.red
        /**
         The shadow opacity for the puck view.
         Set any value between 0.0 and 1.0.
         The default value of this property is equal to `0.25`
         */
        locationStyle.puckShadowOpacity = 0.25
        /**
         The fill color for the arrow puck.
         */
        locationStyle.puckArrowFillColor = UIColor.black
        /**
         The fill color for the puck view.
         */
        locationStyle.haloFillColor = UIColor.white

        if #available(iOS 14, *) {
            /**
             The halo fill color for the approximate view.
             */
            locationStyle.approximateHaloFillColor = UIColor.white
            /**
             The halo border color for the approximate view.
             */
            locationStyle.approximateHaloBorderColor = UIColor.white
            /**
             The halo border width for the approximate view.
             The default value of this property is equal to `2.0`
             */
            locationStyle.approximateHaloBorderWidth = 2.0
            /**
             The halo opacity for the approximate view.
             Set any value between 0.0 and 1.0
             The default value of this property is equal to `0.15`
             */
            locationStyle.approximateHaloOpacity = 0.15
        }

        return locationStyle
    }

    /**
     Returns a view object to mark the given point annotation object on the map.
     Implement this method to mark a point annotation with a view object. If you
     want to mark a particular point annotation with a static image instead, omit
     this method or have it return `nil` for that annotation, then implement
     `-mapView:imageForAnnotation:` instead.
     Annotation views are compatible with UIKit, Core Animation, and other Cocoa
     Touch frameworks. On the other hand, static annotation images use less memory
     and draw more quickly than annotation views.
     The user location annotation view can also be customized via this method. When
     `annotation` is an instance of `NGLUserLocation` (or equal to the map view's
     `userLocation` property), return an instance of `NGLUserLocationAnnotationView`
     (or a subclass thereof).
     @param mapView The map view that requested the annotation view.
     @param annotation The object representing the annotation that is about to be
        displayed.
     @return The view object to display for the given annotation or `nil` if you
        want to display an annotation image instead.
     */
    func mapView(_ mapView: NGLMapView, viewFor annotation: NGLAnnotation) -> NGLAnnotationView?  {
        let annotationView = CustomUserLocationAnnotationView(frame: CGRect.zero)
        annotationView.frame = CGRectMake(0, 0, annotationView.intrinsicContentSize.width, annotationView.intrinsicContentSize.height);
        return annotationView
    }

}
```

CustomUserLocationAnnotationView

```swift
import UIKit
import Nbmap
let CustomUserLocationDotSize: CGFloat = 10
class CustomUserLocationAnnotationView: NGLUserLocationAnnotationView {

    override init(frame: CGRect) {
        super.init(frame: frame)
        self.backgroundColor = .clear
    }

    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }

    override func update() {
        updateFrame(with: intrinsicContentSize)
        setNeedsDisplay()
    }

    override var intrinsicContentSize: CGSize {
        let carSize = CGSize(width: 30, height: 60)
        return (mapView?.userTrackingMode == .followWithCourse) ? carSize : dotSize()
    }

    func dotSize() -> CGSize {
        let minDotSize: CGFloat = 30
        let dotSize = max(minDotSize, accuracyInPoints())
        return CGSize(width: dotSize, height: dotSize)
    }

    func updateFrame(with size: CGSize) {
        if frame.size.equalTo(size) {
            return
        }

        // Update frame size, keeping the existing center point.
        var newFrame = frame
        let oldCenter = center
        newFrame.size = size
        frame = newFrame
        center = oldCenter
    }

    func accuracyInPoints() -> CGFloat {
        guard let mapView = mapView, let userLocation = userLocation else {
            return 0
        }
        let metersPerPoint = mapView.metersPerPoint(atLatitude: userLocation.coordinate.latitude)
        return CGFloat((userLocation.location?.horizontalAccuracy ?? 0) / metersPerPoint)
    }

    override func draw(_ rect: CGRect) {
        if mapView?.userTrackingMode == .followWithCourse {
            drawCar()
        } else {
            drawDot()
        }
    }

    func drawDot() {
        // Accuracy
        let accuracy = accuracyInPoints()
        let center = bounds.size.width / 2.0 - accuracy / 2.0
        let accuracyPath = UIBezierPath(ovalIn: CGRect(x: center, y: center, width: accuracy, height: accuracy))
        let accuracyColor = UIColor(red: 1, green: 0, blue: 0, alpha: 0.4)
        accuracyColor.setFill()
        accuracyPath.fill()

        // Dot
        let dotCenter = bounds.size.width / 2.0 - CustomUserLocationDotSize / 2.0
        let dotPath = UIBezierPath(ovalIn: CGRect(x: dotCenter, y: dotCenter, width: CustomUserLocationDotSize, height: CustomUserLocationDotSize))
        UIColor.green.setFill()
        dotPath.fill()

        UIColor.black.setStroke()
        dotPath.lineWidth = 1
        dotPath.stroke()

        // Accuracy text
        let font = UIFont.systemFont(ofSize: 11)
        let attributes: [NSAttributedString.Key: Any] = [
            .font: font,
            .backgroundColor: UIColor(white: 0, alpha: 0.5),
            .foregroundColor: UIColor.white
        ]
        let accuracyText = NSString(format: "%.0f", accuracy)
        accuracyText.draw(at: CGPoint.zero, withAttributes: attributes)
    }

    func drawCar() {
        let fillColor = UIColor(red: 0, green: 0, blue: 0, alpha: 1)
        let strokeColor = UIColor(red: 0.592, green: 0.592, blue: 0.592, alpha: 1)
        let fillColor2 = UIColor(red: 1, green: 1, blue: 1, alpha: 1)

        let bezier2Path = UIBezierPath()
        bezier2Path.move(to: CGPoint(x: 30, y: 7.86))
        bezier2Path.addLine(to: CGPoint(x: 30, y: 52.66))
        bezier2Path.addCurve(to: CGPoint(x: 0, y: 52.66), controlPoint1: CGPoint(x: 30, y: 62.05), controlPoint2: CGPoint(x: 0, y: 62.84))
        bezier2Path.addCurve(to: CGPoint(x: 0, y: 7.86), controlPoint1: CGPoint(x: 0, y: 42.48), controlPoint2: CGPoint(x: 0, y: 17.89))
        bezier2Path.addCurve(to: CGPoint(x: 30, y: 7.86), controlPoint1: CGPoint(x: -0, y: -2.17), controlPoint2: CGPoint(x: 30, y: -3.05))
        bezier2Path.close()
        bezier2Path.usesEvenOddFillRule = true

        fillColor.setFill()
        bezier2Path.fill()

        let bezier3Path = UIBezierPath()
        bezier3Path.move(to: CGPoint(x: 30, y: 7.86))
        bezier3Path.addLine(to: CGPoint(x: 30, y: 52.66))
        bezier3Path.addCurve(to: CGPoint(x: 0, y: 52.66), controlPoint1: CGPoint(x: 30, y: 62.05), controlPoint2: CGPoint(x: 0, y: 62.84))
        bezier3Path.addCurve(to: CGPoint(x: 0, y: 7.86), controlPoint1: CGPoint(x: 0, y: 42.48), controlPoint2: CGPoint(x: 0, y: 17.89))
        bezier3Path.addCurve(to: CGPoint(x: 30, y: 7.86), controlPoint1: CGPoint(x: 0, y: -2.17), controlPoint2: CGPoint(x: 30, y: -3.05))
        bezier3Path.close()
        strokeColor.setStroke()
        bezier3Path.lineWidth = 1
        bezier3Path.stroke()

        let bezier4Path = UIBezierPath()
        bezier4Path.move(to: CGPoint(x: 15.56, y: 4.26))
        bezier4Path.addCurve(to: CGPoint(x: 26, y: 6), controlPoint1: CGPoint(x: 21, y: 4.26), controlPoint2: CGPoint(x: 26, y: 6))
        bezier4Path.addCurve(to: CGPoint(x: 23, y: 21), controlPoint1: CGPoint(x: 26, y: 6), controlPoint2: CGPoint(x: 29, y: 17))
        bezier4Path.addCurve(to: CGPoint(x: 16, y: 21), controlPoint1: CGPoint(x: 20.03, y: 22.98), controlPoint2: CGPoint(x: 16, y: 21))
        bezier4Path.addCurve(to: CGPoint(x: 7, y: 21), controlPoint1: CGPoint(x: 16, y: 21), controlPoint2: CGPoint(x: 9.02, y: 23.53))
        bezier4Path.addCurve(to: CGPoint(x: 4, y: 6), controlPoint1: CGPoint(x: 3, y: 16), controlPoint2: CGPoint(x: 4, y: 6))
        bezier4Path.addCurve(to: CGPoint(x: 15.56, y: 4.26), controlPoint1: CGPoint(x: 4, y: 6), controlPoint2: CGPoint(x: 10.12, y: 4.26))
        bezier4Path.close()
        bezier4Path.usesEvenOddFillRule = true

        fillColor2.setFill()
        bezier4Path.fill()

        let rectanglePath = UIBezierPath()
        rectanglePath.move(to: CGPoint(x: 25, y: 46))
        rectanglePath.addCurve(to: CGPoint(x: 21, y: 55), controlPoint1: CGPoint(x: 31, y: 46), controlPoint2: CGPoint(x: 28.5, y: 55))
        rectanglePath.addCurve(to: CGPoint(x: 9, y: 55), controlPoint1: CGPoint(x: 13.5, y: 55), controlPoint2: CGPoint(x: 14, y: 55))
        rectanglePath.addCurve(to: CGPoint(x: 5, y: 46), controlPoint1: CGPoint(x: 4, y: 55), controlPoint2: CGPoint(x: 0, y: 46))
        rectanglePath.addCurve(to: CGPoint(x: 25, y: 46), controlPoint1: CGPoint(x: 10, y: 46), controlPoint2: CGPoint(x: 19, y: 46))
        rectanglePath.close()
        UIColor.white.setFill()
        rectanglePath.fill()

        let bezierPath = UIBezierPath()
        UIColor.white.setFill()
        bezierPath.fill()

        let rectangle2Path = UIBezierPath()
        rectangle2Path.move(to: CGPoint(x: 2, y: 35))
        rectangle2Path.addCurve(to: CGPoint(x: 4.36, y: 35), controlPoint1: CGPoint(x: 2, y: 39), controlPoint2: CGPoint(x: 4.36, y: 35))
        rectangle2Path.addCurve(to: CGPoint(x: 4.36, y: 22), controlPoint1: CGPoint(x: 4.36, y: 35), controlPoint2: CGPoint(x: 5.55, y: 26))
        rectangle2Path.addCurve(to: CGPoint(x: 2, y: 22), controlPoint1: CGPoint(x: 3.18, y: 18), controlPoint2: CGPoint(x: 2, y: 22))
        rectangle2Path.addCurve(to: CGPoint(x: 2, y: 35), controlPoint1: CGPoint(x: 2, y: 22), controlPoint2: CGPoint(x: 2, y: 31))
        rectangle2Path.close()
        UIColor.white.setFill()
        rectangle2Path.fill()

        let rectangle3Path = UIBezierPath()
        rectangle3Path.move(to: CGPoint(x: 28, y: 35))
        rectangle3Path.addCurve(to: CGPoint(x: 25.64, y: 35), controlPoint1: CGPoint(x: 28, y: 39), controlPoint2: CGPoint(x: 25.64, y: 35))
        rectangle3Path.addCurve(to: CGPoint(x: 25.64, y: 22), controlPoint1: CGPoint(x: 25.64, y: 35), controlPoint2: CGPoint(x: 24.45, y:26))
        rectangle3Path.addCurve(to: CGPoint(x: 28, y: 22), controlPoint1: CGPoint(x: 25.82, y: 18), controlPoint2: CGPoint(x: 28, y:22))
        rectangle3Path.addCurve(to: CGPoint(x: 28, y: 35), controlPoint1: CGPoint(x: 28, y: 22), controlPoint2: CGPoint(x: 28, y:31))
        rectangle3Path.close()
        UIColor.white.setFill()
        rectangle3Path.fill()
    }
}
```

This example provided code is for a view controller (CustomPuckViewController) that sets up a map view **(NGLMapView)** and customizes the **user location** style and view.

**Initialization of MapView:**

- The nbMapView property is initialized as an instance of **NGLMapView** with the frame matching the bounds of the view controller's view.

- The **autoresizingMask** is set to allow the map view to resize automatically with the view controller's view.

- The **delegate** property is set to self to receive map view delegate callbacks.

- The **userTrackingMode** is set to .follow to enable user location tracking and center the map on the user's location.

**Custom User Location Style:**

- The **mapView(styleForDefaultUserLocationAnnotationView:)** method is implemented to provide custom styling options for the default user location annotation view.

- An instance of **NGLUserLocationAnnotationViewStyle** is created and configured with various properties to customize the appearance of the user location puck, arrow, and halo.

- The method returns the configured **NGLUserLocationAnnotationViewStyle** object.

**Custom user location view:**

- The **mapView(\_:viewFor:)** method is implemented to provide a custom **annotation** view for the **user location**.

- An instance of **NGLUserLocationAnnotationView** is created and its frame is set based on the intrinsic content size.

- The method returns the **CustomUserLocationAnnotationView** object as the view for the user location annotation.

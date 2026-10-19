# Intercept NavigationMapView click and long click events

Intercept single tap and long click events on NavigationMapView and add corresponding actions to it.

This example shows how to intercept single tap and long click events on NavigationMapView and add corresponding actions to it.

We can get the coordinates from the tap events, so it can also be used to request route info or add markers on the map.

![documentation image](https://static.nextbillion.io/docs-next/docs/navigation/ios/Intercept-events.webp)

For all code examples, refer to [Navigation Code Examples](https://github.com/nextbillion-ai/ios-navigation-demo)

**InterceptClickEventViewController** [view source](https://github.com/nextbillion-ai/ios-navigation-demo/blob/main/navigation-ios-demo/InterceptClickEventViewController.swift)

```swift
import UIKit
import NbmapNavigation
import NbmapCoreNavigation
import Nbmap

class InterceptClickEventViewController: UIViewController, NGLMapViewDelegate {

    var navigationMapView: NavigationMapView? {
        didSet {
            oldValue?.removeFromSuperview()
            if let navigationMapView = navigationMapView {
                view.insertSubview(navigationMapView, at: 0)
            }
        }
    }

    override func viewDidLoad() {
        super.viewDidLoad()

        self.navigationMapView = NavigationMapView(frame: view.bounds)

        navigationMapView?.userTrackingMode = .followWithHeading

        let singleTap = UITapGestureRecognizer(target: self, action: #selector(didTap(tap:)))
        navigationMapView?.addGestureRecognizer(singleTap)

        let longTap = UILongPressGestureRecognizer(target: self, action: #selector(didLongPress(tap:)))
        navigationMapView?.gestureRecognizers?.filter({ $0 is UILongPressGestureRecognizer }).forEach(longTap.require(toFail:))
        navigationMapView?.addGestureRecognizer(longTap)


        navigationMapView?.delegate = self

        self.view.setNeedsLayout()

    }

    @objc func didTap(tap: UITapGestureRecognizer) {
        guard let navigationMapView = navigationMapView else {
            return
        }
        let coordinates = navigationMapView.convert(tap.location(in: navigationMapView), toCoordinateFrom: navigationMapView)
        print("Tapped on Map with latitude: " + String(coordinates.latitude) + " longitude: " + String(coordinates.longitude))
        addNewDestinationIcon(coordinates: coordinates)
    }


    @objc func didLongPress(tap: UILongPressGestureRecognizer) {
        guard let navigationMapView = navigationMapView, tap.state == .began else {
            return
        }
        let coordinates = navigationMapView.convert(tap.location(in: navigationMapView), toCoordinateFrom: navigationMapView)
        print("Long Pressed on Map with latitude: " + String(coordinates.latitude) + " longitude: " + String(coordinates.longitude))
        addNewDestinationIcon(coordinates: coordinates)
    }


    func addNewDestinationIcon(coordinates: CLLocationCoordinate2D){
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
}
```

The example shows how to intercept single tap and long click events on NavigationMapView. This can be useful for adding custom functionality to the map, such as adding a new destination icon when the user taps or long presses on the map.

The code first creates two **UIGestureRecognizer** objects: a single tap gesture recognizer and a long press gesture recognizer. These gesture recognizers are then added to the NavigationMapView object. The single tap gesture recognizer will be called when the user taps on the map, and the long press gesture recognizer will be called when the user long presses on the map.

The single tap and long press gesture recognizers both call the **didTap()** and **didLongPress()** methods, respectively. These methods first check to make sure that a NavigationMapView object exists. If it does, the methods then get the coordinates of the point where the user tapped or long pressed on the map. The coordinates are then used to add a new destination icon to the map.

The **addNewDestinationIcon()** method first checks to make sure that a **NavigationMapView** object exists. If it does, the method then removes any existing destination icons from the map. The method then creates a new NGLPointAnnotation object and sets its coordinate property to the coordinates of the point where the user tapped or long pressed on the map. The annotation object is then added to the NavigationMapView object

- Create two **UIGestureRecognizer** objects: a single tap gesture recognizer and a long press gesture recognizer.

  ```swift
  let singleTap = UITapGestureRecognizer(target: self, action: #selector(didTap(tap:)))
  let longTap = UILongPressGestureRecognizer(target: self, action: #selector(didLongPress(tap:)))
  ```

- Add the gesture recognizers to the NavigationMapView object.

  ```swift
  navigationMapView?.addGestureRecognizer(singleTap)
  navigationMapView?.addGestureRecognizer(longTap)
  ```

- Create the didTap() and didLongPress() methods.

  ```swift
      @objc func didTap(tap: UITapGestureRecognizer) {
          // ...
      }


      @objc func didLongPress(tap: UILongPressGestureRecognizer) {
          // ...
      }
  ```

- In the **didTap()** and **didLongPress()** methods, get the coordinates of the point where the user tapped or long pressed on the map.

  ```swift
  let coordinates = navigationMapView.convert(tap.location(in: navigationMapView), toCoordinateFrom: navigationMapView)
  ```

- In the **didTap()** and **didLongPress()** methods, add a new destination icon to the map.

  ```swift
  addNewDestinationIcon(coordinates: coordinates)
  ```

- In the **addNewDestinationIcon()** method, remove any existing destination icons from the map.

  ```swift
  if let annotation = mapView.annotations?.last {
      mapView.removeAnnotation(annotation)
  }
  ```

- In the **addNewDestinationIcon()** method, create a new **NGLPointAnnotation** object and set its coordinate property to the coordinates of the point where the user tapped or long pressed on the map.

  ```swift
  let annotation = NGLPointAnnotation()
  annotation.coordinate = coordinates
  ```

- In the addNewDestinationIcon() method, add the annotation object to the

  ```swift
  NavigationMapView object.
  mapView.addAnnotation(annotation)
  ```

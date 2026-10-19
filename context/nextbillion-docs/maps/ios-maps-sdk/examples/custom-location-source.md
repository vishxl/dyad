# Custom Location Source

This example shows how to customize your location data source for **NGLMapView**.

- Custom your location data source for **NGLMapView**

![documentation image](https://static.nextbillion.io/docs-next/docs/maps/ios/custom-location-source.webp)

For all code examples, refer to [Maps Code Examples](https://github.com/nextbillion-ai/ios-map-example)

**CustomLocationSourceViewController** [view source](https://github.com/nextbillion-ai/ios-map-example/blob/main/ios-map-example/Custom-Location-Source.swift)

```swift
import Foundation
import UIKit
import Nbmap
class CustomLocationSourceViewController: UIViewController {
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

        /**
         Custom the location source , The locationManager that this map view uses to start and stop the delivery of
         location-related updates.
         To receive the current user location, implement the
         `-[NGLMapViewDelegate mapView:didUpdateUserLocation:]` and
         `-[NGLMapViewDelegate mapView:didFailToLocateUserWithError:]` methods.
         If setting this property to `nil` or if no custom manager is provided this
         property is set to the default location manager.
         `NGLMapView` uses a default location manager. If you want to substitute your
         own location manager, you should do so by setting this property before setting
         `showsUserLocation` to `YES`. To restore the default location manager,
         set this property to `nil`.
         */
        nbMapView.locationManager = CustomMapLocationManager()
        nbMapView.showsUserLocation = true
        nbMapView.userTrackingMode = .follow
    }
}
```

CustomMapLocationManager

```swift
import Nbmap
import CoreLocation
class CustomMapLocationManager: NSObject,NGLLocationManager {

    var delegate: NGLLocationManagerDelegate? {
        didSet {
            locationManager.delegate = self
        }
    }

    // Replay with your own location manager
    private let locationManager = CLLocationManager()

    var headingOrientation: CLDeviceOrientation {
        get {
            return locationManager.headingOrientation
        }
        set {
            locationManager.headingOrientation = newValue
        }
    }

    var desiredAccuracy: CLLocationAccuracy {
        get {
            return locationManager.desiredAccuracy
        }
        set {
            locationManager.desiredAccuracy = newValue
        }
    }

    var authorizationStatus: CLAuthorizationStatus {
        if #available(iOS 14.0, *) {
            return locationManager.authorizationStatus
        } else {
            return CLLocationManager.authorizationStatus()
        }
    }

    var activityType: CLActivityType {
        get {
            return locationManager.activityType
        }
        set {
            locationManager.activityType = newValue
        }
    }

    @available(iOS 14.0, *)
    var accuracyAuthorization: CLAccuracyAuthorization {
        return locationManager.accuracyAuthorization
    }

    @available(iOS 14.0, *)
    func requestTemporaryFullAccuracyAuthorization(withPurposeKey purposeKey: String) {
        locationManager.requestTemporaryFullAccuracyAuthorization(withPurposeKey: purposeKey)
    }

    func dismissHeadingCalibrationDisplay() {
        locationManager.dismissHeadingCalibrationDisplay()
    }

    func requestAlwaysAuthorization() {
        locationManager.requestAlwaysAuthorization()
    }

    func requestWhenInUseAuthorization() {
        locationManager.requestWhenInUseAuthorization()
    }

    func startUpdatingHeading() {
        locationManager.startUpdatingHeading()
    }

    func startUpdatingLocation() {
        locationManager.startUpdatingLocation()
    }

    func stopUpdatingHeading() {
        locationManager.stopUpdatingHeading()
    }

    func stopUpdatingLocation() {
        locationManager.stopUpdatingLocation()
    }

    deinit {
        locationManager.stopUpdatingLocation()
        locationManager.stopUpdatingHeading()
        locationManager.delegate = nil
        delegate = nil
    }

}
// MARK: - CLLocationManagerDelegate
extension CustomMapLocationManager : CLLocationManagerDelegate {

    func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
        delegate?.locationManager(self, didUpdate: locations)
    }

    func locationManager(_ manager: CLLocationManager, didUpdateHeading newHeading: CLHeading) {
        delegate?.locationManager(self, didUpdate: newHeading)
    }

    func locationManagerShouldDisplayHeadingCalibration(_ manager: CLLocationManager) -> Bool {
        return delegate?.locationManagerShouldDisplayHeadingCalibration(self) ?? false
    }

    func locationManager(_ manager: CLLocationManager, didFailWithError error: Error) {
        delegate?.locationManager(self, didFailWithError: error)
    }

    @available(iOS 14.0, *)
    func locationManagerDidChangeAuthorization(_ manager: CLLocationManager) {
        delegate?.locationManagerDidChangeAuthorization(self)
    }
}
```

The example code implements a custom location source **(CustomLocationSourceViewController)** along with a custom location manager **(CustomMapLocationManager)**.

CustomLocationSourceViewController is a subclass of UIViewController responsible for displaying a map view and setting up a custom location source

- Initializing a map view **(NGLMapView)** and setting its frame to match the bounds of the current view.

- Adding the map view as a subview to the current view.

- Customizing the location source by assigning an instance of CustomMapLocationManager to the locationManager property of the map view.

- Setting **showsUserLocation** to true to display the user's location on the map.

- Setting userTrackingMode to .follow to track the user's location.

**CustomMapLocationManager** is a custom location manager that conforms to the NGLLocationManager protocol. It utilizes a CLLocationManager as its private property and sets itself as the delegate.

- It implements the NGLLocationManagerDelegate protocol by setting the locationManager delegate to itself.

- Various properties and methods of the location manager are mapped to the private locationManager instance using the delegate pattern.

- It implements methods from the CLLocationManagerDelegate protocol and forwards these methods to the delegate object.

**Summary**: The provided code establishes a custom location source by utilizing a custom location manager. By setting the custom location manager, it is possible to replace the default location manager and achieve more flexibility and customization in handling location-related updates and delegate callbacks.

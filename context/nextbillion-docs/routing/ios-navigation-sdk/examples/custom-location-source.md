# Custom Location Source

Customize the location data source for `NavigationMapView` and `Navigation`. Obtain location data from user tap actions on the map.

This example shows how to customize your location data source for `NavigationMapView` and `Navigation`

- Custom your location data source for `NavigationMapView`, the location data value is from the user tap action on the map

- Custom your location data source for `Navigation`

![documentation image](https://static.nextbillion.io/docs-next/docs/navigation/ios/custom-location-source.webp)

For all code examples, refer to [Navigation Code Examples](https://github.com/nextbillion-ai/ios-navigation-demo)

**CustomLocationSourceViewController** [view source](https://github.com/nextbillion-ai/ios-navigation-demo/blob/main/navigation-ios-demo/Custom-Location-Source.swift)

```swift
import UIKit
import NbmapNavigation
import NbmapCoreNavigation
import Nbmap

class CustomLocationSourceViewController: UIViewController, NGLMapViewDelegate {

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
           guard routes != nil else{
               startButton.isEnabled = false
               return
           }
           startButton.isEnabled = true
       }
   }

   var currentRouteIndex = 0

   var startButton = UIButton()

   override func viewDidLoad() {
       super.viewDidLoad()

       navigationMapView = NavigationMapView(frame: view.bounds)

       navigationMapView?.locationManager = CustomMapLocationManager()

       navigationMapView?.userTrackingMode = .followWithHeading

       let singleTap = UILongPressGestureRecognizer(target: self, action: #selector(didLongPress(tap:)))
       navigationMapView?.gestureRecognizers?.filter({ $0 is UILongPressGestureRecognizer }).forEach(singleTap.require(toFail:))
       navigationMapView?.addGestureRecognizer(singleTap)

       setupStartButton()

       self.view.setNeedsLayout()

   }

   func setupStartButton() {
       startButton.setTitle("Start", for: .normal)
       startButton.layer.cornerRadius = 5
       startButton.contentEdgeInsets = UIEdgeInsets(top: 5, left: 5, bottom: 5, right: 5)
       startButton.backgroundColor = .blue

       startButton.addTarget(self, action: #selector(tappedButton), for: .touchUpInside)
       view.addSubview(startButton)
       startButton.translatesAutoresizingMaskIntoConstraints = false
       startButton.bottomAnchor.constraint(equalTo: view.safeAreaLayoutGuide.bottomAnchor, constant: -50).isActive = true
       startButton.centerXAnchor.constraint(equalTo: view.safeAreaLayoutGuide.centerXAnchor).isActive = true
       startButton.titleLabel?.font = UIFont.systemFont(ofSize: 25)
   }

   @objc func tappedButton(sender: UIButton) {
       guard let routes = self.routes else {
           return
       }
       let navigationService = NBNavigationService(routes: routes, routeIndex: currentRouteIndex,locationSource: CustomNavigationLocationManager())
       let navigationOptions = NavigationOptions(navigationService: navigationService)

       let navigationViewController = NavigationViewController(for: routes,navigationOptions: navigationOptions)
       navigationViewController.modalPresentationStyle = .fullScreen

       present(navigationViewController, animated: true, completion: nil)
   }

   @objc func didLongPress(tap: UILongPressGestureRecognizer) {
       guard let navigationMapView = navigationMapView, tap.state == .began else {
           return
       }
       let coordinates = navigationMapView.convert(tap.location(in: navigationMapView), toCoordinateFrom: navigationMapView)
       // Note: The destination name can be modified. The value is used in the top banner when arriving at a destination.
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


           // Process or display routes information.For example,display the routes,waypoints and duration symbol on the map
           weakSelf.navigationMapView?.showRoutes(routes)
           weakSelf.navigationMapView?.showRouteDurationSymbol(routes)

           guard let current = routes.first else { return }
           weakSelf.navigationMapView?.showWaypoints(current)
           weakSelf.routes = routes
       }
   }
}

CustomMapViewLocationManager   View source
import Nbmap
import CoreLocation
class CustomMapViewLocationManager: NSObject,NGLLocationManager {

    var delegate: NGLLocationManagerDelegate? {
        didSet {
            locationManager.delegate = self
        }
    }

    // Replace with your own location manager
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
// MARK: - CLLocationManagerDelegate , Please replace with your location data source delegate
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

CustomNavigationLocationManager   view source
import NbmapCoreNavigation
import CoreLocation
class CustomNavigationLocationManager : NavigationLocationManager {

    override var delegate: CLLocationManagerDelegate? {
        didSet {
            locationManager.delegate = self
        }
    }

    // Replace with your own location manager
    private let locationManager = CLLocationManager()

    override var headingOrientation: CLDeviceOrientation {
        get {
            return locationManager.headingOrientation
        }
        set {
            locationManager.headingOrientation = newValue
        }
    }

    override var desiredAccuracy: CLLocationAccuracy {
        get {
            return locationManager.desiredAccuracy
        }
        set {
            locationManager.desiredAccuracy = newValue
        }
    }

    override var authorizationStatus: CLAuthorizationStatus {
        if #available(iOS 14.0, *) {
            return locationManager.authorizationStatus
        } else {
            return CLLocationManager.authorizationStatus()
        }
    }

    override var activityType: CLActivityType {
        get {
            return locationManager.activityType
        }
        set {
            locationManager.activityType = newValue
        }
    }

    @available(iOS 14.0, *)
    override var accuracyAuthorization: CLAccuracyAuthorization {
        return locationManager.accuracyAuthorization
    }

    @available(iOS 14.0, *)
    override  func requestTemporaryFullAccuracyAuthorization(withPurposeKey purposeKey: String) {
        locationManager.requestTemporaryFullAccuracyAuthorization(withPurposeKey: purposeKey)
    }

    override func dismissHeadingCalibrationDisplay() {
        locationManager.dismissHeadingCalibrationDisplay()
    }

    override  func requestAlwaysAuthorization() {
        locationManager.requestAlwaysAuthorization()
    }

    override func requestWhenInUseAuthorization() {
        locationManager.requestWhenInUseAuthorization()
    }

    override func startUpdatingHeading() {
        locationManager.startUpdatingHeading()
    }

    override func startUpdatingLocation() {
        locationManager.startUpdatingLocation()
    }

    override  func stopUpdatingHeading() {
        locationManager.stopUpdatingHeading()
    }

    override func stopUpdatingLocation() {
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
extension CustomNavigationLocationManager : CLLocationManagerDelegate {

    func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
        delegate?.locationManager!(self, didUpdateLocations: locations)
    }

    func locationManager(_ manager: CLLocationManager, didUpdateHeading newHeading: CLHeading) {
        delegate?.locationManager!(self, didUpdateHeading: newHeading)
    }

    func locationManagerShouldDisplayHeadingCalibration(_ manager: CLLocationManager) -> Bool {
        return delegate?.locationManagerShouldDisplayHeadingCalibration!(self) ?? false
    }

    func locationManager(_ manager: CLLocationManager, didFailWithError error: Error) {
        delegate?.locationManager!(self, didFailWithError: error)
    }

    @available(iOS 14.0, *)
    func locationManagerDidChangeAuthorization(_ manager: CLLocationManager) {
        delegate?.locationManagerDidChangeAuthorization!(self)
    }
}
```

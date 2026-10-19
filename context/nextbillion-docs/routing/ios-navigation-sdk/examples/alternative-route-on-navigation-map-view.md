# Draw a route line with the alternative route on NavigationMapView

Draw multiple route lines on NavigationMapView, with one of them designated as an alternative route.

This example shows how to draw multiple route lines with one selected as an alternative route on NavigationMapView

- We first request a route with NavigationRouteOptions and enable includesAlternativeRoutes as true, this allows the backend to calculate and provide multiple route lines

- Then we can set one of the routes as an alternative route and show all the route info on NavigationMapView

![documentation image](https://static.nextbillion.io/docs-next/docs/navigation/ios/alternative-route.webp)

For all code examples, refer to [Navigation Code Examples](https://github.com/nextbillion-ai/ios-navigation-demo)

**DrawAlternativeRouteController** [view source](https://github.com/nextbillion-ai/ios-navigation-demo/blob/main/navigation-ios-demo/DrawAlternativeRouteViewController.swift)

```swift
import UIKit
import NbmapNavigation
import NbmapCoreNavigation
import Nbmap

class DrawAlternativeRouteController: UIViewController, NGLMapViewDelegate {

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
            guard let routes = routes,
                  let current = routes.first else { navigationMapView?.removeRoutes(); return }

            navigationMapView?.showRoutes(routes)
            navigationMapView?.showWaypoints(current)
            navigationMapView?.showRouteDurationSymbol(routes)
        }
    }

    override func viewDidLoad() {
        super.viewDidLoad()

        let origin = CLLocation(latitude: 37.77440680146262, longitude: -122.43539772352648)
        let destination = CLLocation(latitude: 37.779664450073, longitude: -122.43245802247301)

        self.navigationMapView = NavigationMapView(frame: view.bounds)
        navigationMapView?.userTrackingMode = .followWithHeading
        navigationMapView?.delegate = self
        navigationMapView?.navigationMapDelegate = self

        self.view.setNeedsLayout()

        requestRoutes(origin: origin, destination: destination)
    }

    func requestRoutes(origin: CLLocation, destination: CLLocation){

        let options = NavigationRouteOptions(origin: origin, destination: destination)
        /**
         Sets whether the  route contains an alternate route
         By default , it set to `false`
         */
        options.includesAlternativeRoutes = true

        /**
         The route classes that the calculated routes will avoid.
         We can set an array road class to avoid.  This property can be set to `.toll`,`.ferry`,`.highway`
         By default ,  this property is set to empty
         */
        options.roadClassesToAvoid = [.toll,.ferry,.highway]
        /**
         Set up the navigation measurement unit
         This property should be set to `.metric` or `.imperial`
         By default ,  this property is set to the unit follow with current system locale.
         */
        options.distanceMeasurementSystem = .imperial

        /**
         Set  specifying the primary mode of transportation for the routes.
         This property should be set to `NBNavigationModeCar`, `NBNavigationModeAuto`, `NBNavigationModeBike`, `NBNavigationMode4W`,`NBNavigationMode2W`,`NBNavigationMode6W`, or `NBNavigationModeEscooter`. The default value of this property is `NBNavigationMode4W`,  which specifies driving directions.
         */
        options.profileIdentifier = NBNavigationMode.mode4W
        /**
         Set the  departureTime of the route , By default ,  it sets the current timestamp since from 1970
         */
        options.departureTime = Int(Date().timeIntervalSince1970)

        /**
         Set up the locale in which the route's instructions are written.
         If you use NbmapDirections.swift with the Nbmap Directions API, this property affects the sentence contained within the `RouteStep.instructions` property, but it does not affect any road names contained in that property or other properties such as `RouteStep.name`.
         The Navigation API can provide instructions in [a number of languages]. Set this property to `Bundle.main.preferredLocalizations.first` or `Locale.autoupdatingCurrent` to match the application's language or the system language, respectively.
         By default, this property is set to the current system locale.
         */
        options.locale = Locale.autoupdatingCurrent

        /**
         Set map options, This property may make the ETA more accurate.  If set to `NBMapOption.valhala`, shapeFormat needs to be set to `polyline`.
         By default , the value of this  property is `NBMapOption.none`
         */
        options.mapOption = NBMapOption.none
        /**
         Format of the data from which the shapes of the returned route and its steps are derived.

         This property has no effect on the returned shape objects, although the choice of format can significantly affect the size of the underlying HTTP response.

         The default value of this property is `polyline6`.
         */
        options.shapeFormat = .polyline6

        Directions.shared.calculate(options) { [weak self] routes, error in
            guard let weakSelf = self else {
                return
            }
            guard error == nil else {
                print(error!)
                return
            }

            guard let routes = routes else { return }


            // Process or display routes information.For example, display the routes, waypoints and duration symbol on the map
            weakSelf.navigationMapView?.showRoutes(routes)
            weakSelf.navigationMapView?.showRouteDurationSymbol(routes)

            guard let current = routes.first else { return }
            weakSelf.navigationMapView?.showWaypoints(current)
            weakSelf.routes = routes
        }
    }
}

extension DrawAlternativeRouteController: NavigationMapViewDelegate {
    // Delegate method called when the user selects a route
    func navigationMapView(_ mapView: NavigationMapView, didSelect route: Route) {
        guard let routes = routes else { return }
        guard let index = routes.firstIndex(where: { $0 == route }) else { return }
        self.routes!.remove(at: index)
        self.routes!.insert(route, at: 0)
    }
}
```

The code first creates a **NavigationRouteOptions** object. This object specifies the parameters for the route calculation. In this case, the options specify that the route should include an alternate route, that it should avoid toll roads, ferries, and highways, and that it should be calculated in imperial units. The code then calls the calculate() method on the Directions object. This method calculates the routes and returns them in an array. The code then loops through the array and displays the routes on the map. The code also defines a delegate method called navigationMapView(\_:didSelect:). This method is called when the user selects a route. The method removes the selected route from the array and inserts it at the beginning of the array. This ensures that the selected route is always displayed at the top of the map. Here is a more detailed explanation of each step in the code:

- Create a **NavigationRouteOptions** object.

  ```swift
  let options = NavigationRouteOptions(origin: origin, destination: destination)
  ```

  This code creates a NavigationRouteOptions object. The origin property specifies the starting location of the route, and the destination property specifies the ending location of the route.

- Set the options for the route calculation.

  ```swift
  options.includesAlternativeRoutes = true
  options.roadClassesToAvoid = [.toll, .ferry, .highway]
  options.distanceMeasurementSystem = .imperial
  options.profileIdentifier = NBNavigationMode.mode4W
  options.departureTime = Int(Date().timeIntervalSince1970)
  options.locale = Locale.autoupdatingCurrent
  options.mapOption = NBMapOption.none
  options.shapeFormat = .polyline6
  ```

  This code sets the options for the route calculation. The **includesAlternativeRoutes** property specifies that the route calculation should include an alternate route. The **roadClassesToAvoid** property specifies that the route should avoid toll roads, ferries, and highways. The **distanceMeasurementSystem** property specifies that the distance should be measured in imperial units. The **profileIdentifier** property specifies that the route should be calculated for a car. The **departureTime** property specifies the time at which the route should start. The **locale** property specifies the locale in which the route instructions should be written. The **mapOption** property specifies that the route should be calculated using Valhalla. The **shapeFormat** property specifies that the route should be returned as a polyline.

- Calculate the routes.

  ```swift
  Directions.shared.calculate(options) { [weak self] routes, error in
      guard let weakSelf = self else {
          return
      }
      guard error == nil else {
          print(error!)
          return
      }


      guard let routes = routes else { return }
  ```

  This code calls the **calculate()** method on the **Directions** object. The **calculate()** method calculates the routes and returns them in an array. The code then checks to make sure that the calculation was successful. If the calculation was successful, the code stores the routes in a variable.

- Display the routes on the map.

  ```swift
  weakSelf.navigationMapView?.showRoutes(routes)
      weakSelf.navigationMapView?.showRouteDurationSymbol(routes)


      guard let current = routes.first else { return }
      weakSelf.navigationMapView?.showWaypoints(current)
      weakSelf.routes = routes
  }
  ```

  This code displays the routes on the map. The **showRoutes()** method displays the routes as lines on the map. The **showRouteDurationSymbol()** method displays a symbol on the map that shows the duration of each route. The **showWaypoints()** method displays the waypoints for each route on the map.

- Define a delegate method to handle route selection.

  ```swift
      extension DrawAlternativeRouteController: NavigationMapViewDelegate {
  // Delegate method called when the user selects a route
      func navigationMapView(_ mapView: NavigationMapView, didSelect route: Route) {
          guard let routes = routes else { return }
          guard let index = routes.firstIndex(where: { $0 == route }) else { return }
          self.routes!.remove(at: index)
          self.routes!.insert(route, at: 0)
      }
  }
  ```

  This code defines a delegate method called **navigationMapView(\_:didSelect:)**

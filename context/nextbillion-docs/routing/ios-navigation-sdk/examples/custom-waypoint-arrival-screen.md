# Custom Waypoint arrival screen

Customize the arrival experience to enhance user engagement and control during their navigation journey.

This example shows:

- How to customize the arrival screen when arriving at a waypoint of the route

- In the example code, arrival screen will show the waypoint name and user could choose to continue navigating to next waypoint

![documentation image](https://static.nextbillion.io/docs-next/docs/navigation/ios/custom-waypoint-arrival-1.webp)

For all code examples, refer to [Navigation Code Examples](https://github.com/nextbillion-ai/ios-navigation-demo)

**CustomWaypointScreenController** [view source](https://github.com/nextbillion-ai/ios-navigation-demo/blob/main/navigation-ios-demo/Custom-Waypoints-Screen.swift)

```swift
import UIKit
import NbmapNavigation
import NbmapCoreNavigation

class CustomWaypointScreenController: UIViewController {

   override func viewDidLoad() {
       super.viewDidLoad()

       let origin = CLLocation(latitude: 37.77440680146262, longitude: -122.43539772352648)
       let waypoint = CLLocation(latitude: 37.76856957793795, longitude: -122.42709811526268)
       let destination = CLLocation(latitude: 37.76556957793795, longitude: -122.42409811526268)
       let options = NavigationRouteOptions(locations: [origin,waypoint,destination])
       Directions.shared.calculate(options) { [weak self] routes, error in
           guard let strongSelf = self else {
               return
           }
           guard error == nil else {
               print(error!)
               return
           }

           guard let routes = routes else { return }

           let navigationService = NBNavigationService(routes: routes, routeIndex: 0, simulating : simulationIsEnabled ? SimulationMode.always : SimulationMode.onPoorGPS)

           let navigationOptions = NavigationOptions(navigationService: navigationService)

           let navigationViewController = NavigationViewController(for: routes,navigationOptions: navigationOptions)
           navigationViewController.modalPresentationStyle = .fullScreen
           navigationViewController.delegate = self

           // Start navigation
           strongSelf.present(navigationViewController, animated: true, completion: nil)
       }
   }
}

extension CustomWaypointScreenController : NavigationViewControllerDelegate {
   func navigationViewController(_ navigationViewController: NavigationViewController, didArriveAt waypoint: Waypoint) -> Bool {
       let isFinalLeg = navigationViewController.navigationService.routeProgress.isFinalLeg
       if isFinalLeg {
           return true
       }

       let alert = UIAlertController(title: "Arrived at \(waypoint.name ?? "Unknown").", message: "Would you like to continue?", preferredStyle: .alert)
       alert.addAction(UIAlertAction(title: "Ok", style: .default, handler: { _ in
           // Begin the next leg once the driver confirms
           guard !isFinalLeg else { return }
           navigationViewController.navigationService.router.routeProgress.legIndex += 1
           navigationViewController.navigationService.start()
       }))
       navigationViewController.present(alert, animated: true, completion: nil)

       return false
   }
}
```

This class is a view controller that allows users to navigate to a destination with waypoints. The class has the following **properties**:

- **origin**: The origin location of the navigation.

- **waypoint**: The waypoint location of the navigation.

- **destination**: The destination location of the navigation.

- **routes**: An array of Route objects that represent the routes between the origin, waypoint, and destination.

- **navigationService**: A NBNavigationService object that is used to control the navigation.

- **navigationViewController**: A NavigationViewController object that is used to display the navigation.

The class has the following **methods**:

- **viewDidLoad():** This method is called when the view controller is loaded. In this method, the navigation service is created and configured.

- **didArriveAtWaypoint():** This method is called when the navigation service arrives at a waypoint. In this method, an alert is presented to the user asking if they would like to continue to the next waypoint.

The code you provided also has an extension:

- CustomWaypointScreenController: **NavigationViewControllerDelegate**

This extension conforms the **CustomWaypointScreenController** class to the NavigationViewControllerDelegate protocol. This protocol allows the **CustomWaypointScreenController** class to respond to events from the navigation controller.

![ios-sdk-7](https://static.nextbillion.io/docs-next/docs/navigation/ios/custom-waypoint-arrival-2.webp)

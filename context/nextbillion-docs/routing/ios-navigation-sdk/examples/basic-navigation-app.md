# Basic navigation app

### Add basic navigation functionality to an iOS application using the Navigation SDK for iOS.

This example shows how to start navigation with default settings:

- How to fetch a route using default `NavigationRouteOptions` , the origin and destination are pre-defined fake locations

- How to config and launch `NavigationViewController` with the requested route info

This code is a simple example of how to create a basic navigation app using fixed origin and destination coordinates. In a real-world app, you might want to find the user's location, let the user select the destination, handle errors and location permissions more thoroughly, customize the user interface, etc.

![documentation image](https://static.nextbillion.io/docs-next/docs/navigation/ios/basic-navigation-app.webp)

For all code examples, refer to [Navigation Code Examples](https://github.com/nextbillion-ai/ios-navigation-demo)

**BasicNavigationViewController** [view source](https://github.com/nextbillion-ai/ios-navigation-demo/blob/main/navigation-ios-demo/BasicNavigationViewController.swift)

```swift
import UIKit
import NbmapNavigation
import NbmapCoreNavigation

class BasicNavigationViewController: UIViewController {

   override func viewDidLoad() {
       super.viewDidLoad()


       let origin = CLLocation(latitude: 37.77440680146262, longitude: -122.43539772352648)
       let destination = CLLocation(latitude: 37.76556957793795, longitude: -122.42409811526268)
       let options = NavigationRouteOptions(origin: origin, destination: destination)
       Directions.shared.calculate(options) { [weak self] routes, error in
           guard let strongSelf = self else {
               return
           }
           guard error == nil else {
               print(error!)
               return
           }

           guard let routes = routes else { return }


           // Initialize  NBNavigationService with the fetched routes, set routeIndex of the primary route to 0
           let navigationService = NBNavigationService(routes: routes, routeIndex: 0)

           let navigationOptions = NavigationOptions(navigationService: navigationService)

           // Initialize the NavigationViewController
           let navigationViewController = NavigationViewController(for: routes,navigationOptions: navigationOptions)

           // Set the delegate of navigationViewController to subscribe for NavigationView's events, This is optional
           navigationViewController.modalPresentationStyle = .fullScreen

           // Render part of the route that has been traversed with full transparency, to give the illusion of a disappearing route.
           navigationViewController.routeLineTracksTraversal = true

           // Start navigation
           strongSelf.present(navigationViewController, animated: true, completion: nil)
       }

   }

}
```

Breakdown 1 Import necessary libraries:

```swift
import UIKit
import NbmapNavigation
import NbmapCoreNavigation
```

These imports allow us to use components from the UIKit, NbmapNavigation, NbmapCoreNavigation, and NbmapDirections libraries, which are essential for creating a navigation app.

2 Define the BasicNavigationViewController class:

```swift
class BasicNavigationViewController: UIViewController {
```

This class extends **UIViewController**, which is a basic building block for creating user interfaces in iOS apps.

3 Implement the **viewDidLoad()** method:

```swift
override func viewDidLoad() {
   super.viewDidLoad()
```

This method is called when the view controller's view is loaded into memory. It is the place where we set up the necessary elements for our navigation app.

4 Set the origin and destination:

```swift

let origin = CLLocation(latitude: 37.77440680146262, longitude: -122.43539772352648)
let destination = CLLocation(latitude: 37.76556957793795, longitude: -122.42409811526268)
```

These two lines define the origin and destination points using fixed latitude and longitude coordinates.

5 Create navigation options and request a route:

```swift
let options = NavigationRouteOptions(origin: origin, destination: destination)
Directions.shared.calculate(options) { [weak self] routes, error in
```

We create a NavigationRouteOptions object that includes the origin and destination, then use the Directions.shared.calculate() method to request the route(s). This method takes a completion handler, which will be executed once the route calculation is completed.

6 Check for errors and process the received routes:

```swift
guard let strongSelf = self else {
    return
}
guard error == nil else {
    print(error!)
    return
}

guard let routes = routes else { return }
```

These lines check if there are any errors and if any routes have been returned. If there's an error, it prints the error message, and if there are no routes, it returns immediately.

7 Initialize the navigation service:

```swift
let navigationService = NBNavigationService(routes: routes, routeIndex: 0)
```

We create an NBNavigationService object using the fetched routes and set the primary route's index to 0 (the first route).

8 Create navigation options and the navigation view controller:

```swift
let navigationOptions = NavigationOptions(navigationService: navigationService)
let navigationViewController = NavigationViewController(for: routes, navigationOptions: navigationOptions)
```

We create a NavigationOptions object using the navigation service, and then we create a NavigationViewController that will display the navigation using the routes and options.

9 Customize the navigation view controller:

```swift
navigationViewController.modalPresentationStyle = .fullScreen
navigationViewController.routeLineTracksTraversal = true
```

We set the modal presentation style to .fullScreen so that the navigation view covers the entire screen. Additionally, we enable the route line to track traversal, which makes the traversed part of the route line disappear as the user moves along the route.

10 Start the navigation:

```swift
strongSelf.present(navigationViewController, animated: true, completion: nil)
```

Finally, we present the NavigationViewController to start the navigation. The animated: true parameter makes the transition to the navigation view animated.

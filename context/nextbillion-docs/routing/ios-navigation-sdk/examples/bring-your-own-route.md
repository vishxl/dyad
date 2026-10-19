# Bring your own route

Dynamically update and adjust selected routes based on user preferences and real-time conditions.

This example shows:

- How to customize your RoutingProvider for NBNavigationSerivce

- How to simulate your routing Progress with customized NavigatinOptions

![documentation image](https://static.nextbillion.io/docs-next/docs/navigation/ios/bring-your-own-route.webp)

For all code examples, refer to [Navigation Code Examples](https://github.com/nextbillion-ai/nb-navigation-android-demo)

CustomRouteNavigationController [view source](https://github.com/nextbillion-ai/ios-navigation-demo/blob/main/navigation-ios-demo/Custom-RoutingProvider.swift)

```swift
import UIKit
import NbmapNavigation
import NbmapCoreNavigation

class CustomRouteNavigationController: UIViewController , NGLMapViewDelegate {

   override func viewDidLoad() {
       super.viewDidLoad()
       let origin = CLLocation(latitude: 37.77440680146262, longitude: -122.43539772352648)
       let destination = CLLocation(latitude: 37.76556957793795, longitude: -122.42409811526268)
       let options = NavigationRouteOptions(origin: origin, destination: destination)

       let customRoutingProvider = CustomRoutingProvider()
       _ = customRoutingProvider.calculateRoutes(options: options) { [weak self] routes, error in
           guard let strongSelf = self else {
               return
           }
           guard error == nil else {
               print(error!)
               return
           }

           guard let routes = routes else { return }

           let navigationService = NBNavigationService(routes: routes, routeIndex: 0,simulating: simulationIsEnabled ? SimulationMode.always : SimulationMode.onPoorGPS,routingProvider: customRoutingProvider)

           let navigationOptions = NavigationOptions(navigationService: navigationService)
           let navigationViewController = NavigationViewController(for: routes,navigationOptions: navigationOptions)
           navigationViewController.modalPresentationStyle = .fullScreen
           strongSelf.present(navigationViewController, animated: true, completion: nil)
       }

   }
}

public struct CustomRequest: NavigationProviderRequest {
   /**
    Cancels the request if it is still active.
    */
   public func cancel() {
       dataTask.cancel()
   }

   var dataTask : URLSessionDataTask
}

class CustomRoutingProvider : RoutingProvider {
   func calculateRoutes(options: NbmapDirections.RouteOptions, completionHandler: @escaping NbmapDirections.Directions.RouteCompletionHandler) -> NbmapCoreNavigation.NavigationProviderRequest? {
       let task = Directions.shared.calculate(options, completionHandler: completionHandler)
       return CustomRequest(dataTask: task)

   }
}
```

The code above creates a simple custom routing app using NbmapNavigation libraries. It consists of two classes: **CustomRouteNavigationController** and **CustomRoutingProvider**.

The **CustomRouteNavigationController** class is the main view controller that sets up the navigation:

- It sets the origin and destination coordinates for the route.

- It creates a **NavigationRouteOptions** object using the origin and destination.

- It initializes a **CustomRoutingProvider** to provide custom routing services.

- It calls the **calculateRoutes** function from the custom routing provider, passing the options and a completion handler.

- When a route is received in the completion handler, it initializes a **NBNavigationService** with the calculated routes and settings.

- It creates a **NavigationOptions** object with the **navigationService**.

- It initializes a **NavigationViewController** and presents it.

The **CustomRoutingProvider** class is a custom implementation of the **RoutingProvider** protocol that uses **NbmapDirections** to calculate routes:

- It implements the **calculateRoutes** function that takes a **RouteOptions** object and a completion handler.

- It calls the **calculate** function from **Directions.shared** and returns a **CustomRequest** object with the **URLSessionDataTask** object.

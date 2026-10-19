# Custom banners

Enhance user experience by displaying customized banners, providing information like upcoming events and notification.

This example shows:

- How to customize the styling of the Navigation Top banner and Bottom Banner

- How to config custom banner for NavigationViewController

![documentation image](https://static.nextbillion.io/docs-next/docs/navigation/ios/custom-banner.webp)

For all code examples, refer to [Navigation Code Examples](https://github.com/nextbillion-ai/ios-navigation-demo)

**CustomBannersViewController** [view source](https://github.com/nextbillion-ai/ios-navigation-demo/blob/main/navigation-ios-demo/Custom-Banner.swift)

```swift
import UIKit
import NbmapNavigation
import NbmapCoreNavigation

class CustomBannersViewController: UIViewController {

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

           let topBanner = CustomTopBarViewController()
           let bottomBanner = CustomBottomBarViewController()
           let navigationOptions = NavigationOptions(navigationService: navigationService,topBanner: topBanner,bottomBanner:bottomBanner)

           // Initialize the NavigationViewController
           let navigationViewController = NavigationViewController(for: routes,navigationOptions: navigationOptions)

           bottomBanner.navigationViewController = navigationViewController

           let parentSafeArea = navigationViewController.view.safeAreaLayoutGuide
           let bannerHeight: CGFloat = 80.0
           let verticalOffset: CGFloat = 20.0
           let horizontalOffset: CGFloat = 10.0

           // To change the top and bottom banner size and position change layout constraints directly.
           topBanner.view.topAnchor.constraint(equalTo: parentSafeArea.topAnchor).isActive = true

           bottomBanner.view.heightAnchor.constraint(equalToConstant: bannerHeight).isActive = true
           bottomBanner.view.bottomAnchor.constraint(equalTo: parentSafeArea.bottomAnchor, constant: -verticalOffset).isActive = true
           bottomBanner.view.leadingAnchor.constraint(equalTo: parentSafeArea.leadingAnchor, constant: horizontalOffset).isActive = true
           bottomBanner.view.trailingAnchor.constraint(equalTo: parentSafeArea.trailingAnchor, constant: -horizontalOffset).isActive = true


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

This code creates a simple navigation app using **NbmapNavigation**.

- The code begins by importing necessary libraries.

- It defines a **CustomBannersViewController** class that inherits from **UIViewController**, a base class for managing a view.

- Inside the **viewDidLoad()** method, which is called after the view controller, which is responsible for managing your screen, has loaded into memory,

- It calculates the route using **Directions.shared.calculate(options)**.

- The **options** contain information about the origin and destination coordinates for the route, which are hardcoded into the **CLLocation** objects.

- If there are no errors, and the routes are returned, the **NBNavigationService** is initialized with these routes.

- The code then creates two custom view controllers: **CustomTopBarViewController** and **CustomBottomBarViewController**. These controllers handle the banner at the top and the bottom of the navigation view, respectively.

- It then creates **NavigationOptions** with the navigationService, topBanner, and bottomBanner.

- A **NavigationViewController** is initialized using the routes and **navigationOptions**.

- Then, **navigationViewController** is set as the property of bottomBanner for accessing \`navigationViewController,

- The code then defines the constraints for **topBanner** and **bottomBanner** views, which control their size and position on the screen.

- **navigationViewController.modalPresentationStyle = .fullScreen** makes the navigation view appear as a full screen when presented.

- **navigationViewController.routeLineTracksTraversal = true** makes the navigation view render the traversed route with full transparency, giving the illusion of a disappearing route.

- The navigation is started by presenting the **navigationViewController**.

# Custom voice controller

Personalize and configure the voice controller in the navigation app using NavigationOptions.

This example shows:

- How to customize the voice controller and config it using `NavigationOptions`

![documentation image](https://static.nextbillion.io/docs-next/docs/navigation/ios/custom-voice-controller-1.webp)

For all code examples, refer to [Navigation Code Examples](https://github.com/nextbillion-ai/ios-navigation-demo)

**CustomVoiceInstructionController** [view source](https://github.com/nextbillion-ai/ios-navigation-demo/blob/main/navigation-ios-demo/Custom-Voice-Instruction.swift)

```swift
    import UIKit
    import NbmapNavigation
    import NbmapCoreNavigation
    import Nbmap

    class CustomVoiceInstructionController: UIViewController , VoiceControllerDelegate {

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

            let routeVoiceController = RouteVoiceController()
            routeVoiceController.voiceControllerDelegate = self

            let navigationOptions = NavigationOptions(navigationService: navigationService,voiceController: routeVoiceController)

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

    func voiceController(_ voiceController: RouteVoiceController, willSpeak instruction: SpokenInstruction, routeProgress: RouteProgress) -> SpokenInstruction? {
        let modifiedInstruction = SpokenInstruction(distanceAlongStep: instruction.distanceAlongStep, text: instruction.text, ssmlText: instruction.ssmlText, unit: instruction.unit)
        return modifiedInstruction
    }
    }
```

- The necessary libraries are imported at the beginning.
  - The **UIKit** library is for user interface

  - The **NbmapNavigation**, **NbmapCoreNavigation**, **NbmapDirections**, and Nbmap libraries are for the mapping and navigation functionalities.

- A custom view controller class **CustomVoiceInstructionController** is defined which inherits from **UIViewController** and conforms to the **VoiceControllerDelegate** protocol. This means it is capable of handling user interface-related tasks and can also respond to voice navigation events.

- The viewDidLoad() function is overridden. This function is called once the view controller's view has been loaded into memory, and it's a good place to set up anything that's needed when your view first appears.
  - Inside viewDidLoad(), the origin and destination points are defined using CLLocation, which represents a geographic coordinate.

- A **NavigationRouteOptions** object is created using the origin and destination. This object defines the parameters for a route request.

- **Directions.shared.calculate(options) { ... }** is a closure (a function within a function) that **calculates the route from origin to destination**. The Directions object is a shared instance of the NbmapDirections class, which can be used to calculate directions between locations.

- If there is no error and the routes are available, a **NBNavigationService** object is initialized with the routes and the primary route is set to the first route (index 0).

- A **RouteVoiceController** object is created and **its delegate is set to self**, meaning this view controller will handle the voice instructions.

- A **NavigationOptions** object is created with the **navigationService** and **voiceController** created earlier.

- Then, a **NavigationViewController** is initialized with the routes and navigation options. This is a view controller that provides a user interface for turn-by-turn navigation.

- The **modalPresentationStyle** of the **NavigationViewController** is set to **.fullScreen**, meaning it will take up the entire screen when presented.

- The **routeLineTracksTraversal** property is set to **true**, which means the part of the route that has been traversed will be rendered with full transparency, giving the illusion of a disappearing route.

- The navigation is started by presenting the NavigationViewController.

- Lastly, **the voiceController(\_:willSpeak:routeProgress:)** function is defined. This function is called when the voice controller is about to issue a spoken instruction. In this case,
  - it simply returns the original instruction without any modifications.

  - If you want to modify the spoken instructions, you can do so here.

This is a basic explanation of the code, and it's important to note that using location services and mapping in an app requires additional setup, like obtaining **necessary permissions** from the user and **handling different states of the app** (like when it's in the background or when the user navigates away from your app).

![ios-sdk-7](https://static.nextbillion.io/docs-next/docs/navigation/ios/custom-voice-controller-2.webp)

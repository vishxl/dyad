# Getting Started

This section provides an overview of the steps required to install and configure the Navigation SDK, enabling developers to add advanced turn-by-turn navigation capabilities to their iOS applications. Whether you are building a ride-sharing app, a delivery app, or any other app that requires navigation functionality, this guide will help you get up and running quickly. By the end of this guide, you will have a basic navigation app that you can build upon to add your own custom features.

## Prerequisites

Before using the iOS Navigation SDK, ensure that your development environment meets the following requirements:

- Xcode 13.2.1
- Swift 5.5.2
- Minimum deployment target: iOS 12.0
- Access Key: if you don’t have your Access Key yet, don’t hesitate to [contact us](https://nextbillion.ai/contact-us?utm_source=footer&utm_medium=docs&utm_campaign=onpage)

Dependency manager (choose one):

- **Swift Package Manager (SPM)** (supported)
- **CocoaPods** (supported)
- **Carthage** v0.40+ (supported)

Please note that using an outdated version of any of the above tools may result in compatibility issues and may not be supported by the Navigation SDK.

## Step 1 - Configure your public access token

### Add your public token to the app so the SDK can authenticate.

open your project's **Info.plist** and add:

- Key: NBMapAccessKey
- Value: _your public access token_

### Alternative code-based configuration (optional):

Set token in code:

```swift
NGLAccountManager.accessToken = "YOUR_ACCESS_KEY"
```

**When to use this:** Dynamic token injection after login, multi-tenant apps, or environment switching.

**Priority and fallback:** When both are configured, `NGLAccountManager.accessToken` is used first; `NBMapAccessKey` in _Info.plist_ is used as a fallback.

**Important timing:** Configure the token in `AppDelegate` within `func application(_: UIApplication, didFinishLaunchingWithOptions _: [UIApplication.LaunchOptionsKey: Any]?)` before any map view is used.

**Example (AppDelegate):**

```swift
final class AppDelegate: UIResponder, UIApplicationDelegate {
    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        NGLAccountManager.accessToken = "YOUR_ACCESS_KEY"
        return true
    }
}
```

## Step 2 - Add location permissions

Users expect navigation to continue tracking location and delivering audible guidance even when the device is locked or another app is in the foreground. To support that, add the location permission descriptions to your app’s **Info** settings (or **Info.plist**).

Required keys:

- NSLocationWhenInUseUsageDescription
- NSLocationAlwaysUsageDescription

Recommended (commonly used on modern iOS versions):

- NSLocationAlwaysAndWhenInUseUsageDescription

Example **Info.plist** entries:

```xml
<key>NSLocationWhenInUseUsageDescription</key>
<string>This app requires access to your location to provide navigation guidance.</string>

<key>NSLocationAlwaysUsageDescription</key>
<string>This app requires access to your location to provide navigation guidance even when the app is in the background.</string>

<key>NSLocationAlwaysAndWhenInUseUsageDescription</key>
<string>This app requires access to your location to provide continuous navigation guidance.</string>
```

## Step 3 - Install the SDK

Choose one installation method below.

### Option A — Swift Package Manager (SPM) (Recommended)

SPM is Apple’s native dependency manager and integrates directly into Xcode. The Navigation SDK is available through our SPM distribution repository.

**Add via Xcode:**

1.  Open your project in Xcode
2.  Go to **File** → **Add Packages…** (or **File** → **Swift Packages** → **Add Package Dependency…**)
3.  Enter the package repository URL:

    ```html
    https://github.com/nextbillion-ai/navigation-distribution
    ```

4.  Choose a version rule (recommended: **Up to Next Major Version**)
5.  Click **Add Package**
6.  Ensure **Add to Target** includes your application target, then finish by clicking **Add Package**

After installing, you can import the SDK modules in code (see Quickstart below).

### Option B — CocoaPods

To add the Navigation SDK dependency with CocoaPods:

1.  Create a **Podfile**

    ```ruby
    use_frameworks!


    target 'TargetNameForYourApp' do
        pod 'NextBillionNavigation', '~> 3.3.1'
    end
    ```

2.  Install and open the workspace:

    ```bash
    pod repo update && pod install
    ```

    Open the generated **.xcworkspace**

### Option C — Carthage

Carthage integrates third-party libraries by building frameworks locally. The Navigation SDK Carthage setup includes required dependencies.

1.  Install Carthage (if you don’t have it yet)

    Carthage is a dependency manager for iOS/macOS projects. If it is not installed on your machine, follow the official installation instructions here:
    - [Carthage (Official)](https://github.com/Carthage/Carthage)

    For example, using Homebrew:

    ```bash
    brew install carthage
    ```

2.  Create a **Cartfile** and add the SDK dependencies:

    ```bash
    binary "https://github.com/nextbillion-ai/nextbillion-map-ios/releases/download/v1/carthage/Nbmap.json" ~> 2.1.5
    binary "https://github.com/nextbillion-ai/nextbillion-turf-ios/releases/download/v1/carthage/Turf.json" ~> 3.0.1
    binary "https://github.com/nextbillion-ai/nextbillion-navigation-ios/releases/download/v1/carthage/NbmapCoreNavigation.json" ~> 3.3.1
    binary "https://github.com/nextbillion-ai/nextbillion-navigation-ios/releases/download/v1/carthage/NbmapNavigation.json" ~> 3.3.1
    ```

3.  Build:

    ```bash
    carthage update --use-xcframeworks
    ```

4.  Link frameworks (Xcode → **Build Phases** → **Link Binary With Libraries**):
    - **Turf**
    - **NbmapNavigation**
    - **NbmapCoreNavigation**
    - **Nbmap**

5.  Embed frameworks (Xcode → **General** → **Frameworks, Libraries, and Embedded Content**): Set each framework to **Embed & Sign**:

## Step 4 - Quickstart: fetch a route and start navigation

This example starts navigation with default settings by requesting a route and presenting **NavigationViewController**.

```swift
import UIKit
import CoreLocation
import NbmapNavigation
import NbmapCoreNavigation

class BasicNavigationViewController: UIViewController {

    override func viewDidLoad() {
        super.viewDidLoad()

        let origin = CLLocation(latitude: 37.77440680146262, longitude: -122.43539772352648)
        let destination = CLLocation(latitude: 37.76556957793795, longitude: -122.42409811526268)

        let options = NavigationRouteOptions(origin: origin, destination: destination)

        Directions.shared.calculate(options) { [weak self] routes, error in
            guard let self = self else { return }

            guard error == nil else {
                print(error!)
                return
            }

            guard let routes = routes else { return }

            let navigationService = NBNavigationService(routes: routes, routeIndex: 0)
            let navigationOptions = NavigationOptions(navigationService: navigationService)

            let navigationViewController = NavigationViewController(for: routes,
                                                                   navigationOptions: navigationOptions)
            navigationViewController.modalPresentationStyle = .fullScreen
            navigationViewController.routeLineTracksTraversal = true

            self.present(navigationViewController, animated: true)
        }
    }
}
```

![documentation image](https://static.nextbillion.io/docs-next/docs/navigation/ios/image6.webp)

The above code is an example of how to add basic navigation functionality to an iOS application using the iOS Navigation SDK. It imports necessary frameworks and creates a `BasicNavigationViewController` that fetches a route between two locations using the `Directions` API from `NbmapCoreNavigation`, initializes the navigation service with the fetched route, creates a NavigationViewController, sets some navigation options, and presents it. This code can be used as a starting point to build a navigation-enabled iOS app.

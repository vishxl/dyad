# Customize NavigationMapView style at runtime

Customize the style of the NavigationMapView and choose a map style that best suits your preferences or the current context.

This example shows how to customize the NavigationMapView at runtime:

- We have provided a list of available map-style URLs for choosing

- A switch button is provided on the NavigationMapView, each time user clicks on the button will result in a different map-style URL to be set for the NavigationMapView

![documentation image](https://static.nextbillion.io/docs-next/docs/navigation/ios/customize-style-at-runtime.webp)

For all code examples, refer to [Navigation Code Examples](https://github.com/nextbillion-ai/ios-navigation-demo)

**CustomizeMapStyleViewController** [view source](https://github.com/nextbillion-ai/ios-navigation-demo/blob/main/navigation-ios-demo/CustomizeMapStyleViewController.swift)

```swift
import UIKit
import NbmapNavigation
import NbmapCoreNavigation
import Nbmap

class CustomizeMapStyleViewController: UIViewController, NGLMapViewDelegate {

    var changeStyleButton = UIButton()
    let mapStyleList = ["https://api.nextbillion.io/maps/streets/style.json", "https://api.nextbillion.io/maps/hybrid/style.json", "https://api.nextbillion.io/maps/dark/style.json"]
    var buttonClickCount = 0

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
        navigationMapView?.delegate = self

        setUpChangeStyleButton()

        self.view.setNeedsLayout()
    }

    func setUpChangeStyleButton(){
        changeStyleButton.setTitle("Switch", for: .normal)
        changeStyleButton.layer.cornerRadius = 5
        changeStyleButton.contentEdgeInsets = UIEdgeInsets(top: 5, left: 5, bottom: 5, right: 5)
        changeStyleButton.backgroundColor = .blue

        changeStyleButton.addTarget(self, action: #selector(tappedButton), for: .touchUpInside)
        view.addSubview(changeStyleButton)
        changeStyleButton.translatesAutoresizingMaskIntoConstraints = false
        changeStyleButton.bottomAnchor.constraint(equalTo: view.safeAreaLayoutGuide.bottomAnchor, constant: -50).isActive = true
        changeStyleButton.centerXAnchor.constraint(equalTo: view.safeAreaLayoutGuide.centerXAnchor).isActive = true
        changeStyleButton.titleLabel?.font = UIFont.systemFont(ofSize: 25)
    }

    @objc func tappedButton(sender: UIButton) {
        buttonClickCount = (buttonClickCount + 1) % 3

        self.navigationMapView?.styleURL = URL(string: mapStyleList[buttonClickCount])
    }
}
```

The code first imports the following frameworks:

- UIKit
- NbmapNavigation
- NbmapCoreNavigation
- NbmapDirections
- Nbmap

These frameworks provide the necessary functionality to create a map view and customize its style.

The next part of the code defines a class called **CustomizeMapStyleViewController**. This class inherits from **UIViewController** and implements the **NGLMapViewDelegate** protocol.

The **CustomizeMapStyleViewController** class has the following properties:

- **changeStyleButton**: A **UIButton** object that is used to change the map style.

- **mapStyleList**: An array of **String** objects that contain the URLs of the map styles.

- **buttonClickCount**: An **Int** variable that keeps track of the number of times the **changeStyleButton** has been clicked.

The **CustomizeMapStyleViewController** class also has the following methods:

- **viewDidLoad():** This method is called when the view controller is loaded. It initializes the map view and adds the **changeStyleButton** to the view.

- **setUpChangeStyleButton():** This method sets up the **changeStyleButton**. It sets the button's title, background color, and corner radius. It also adds the button as a target for the touchUpInside event.

- **tappedButton():** This method is called when the **changeStyleButton** is tapped. It increments the **buttonClickCount** variable and then sets the map view's style URL to the URL of the map style at the current index in the mapStyleList array.

The **CustomizeMapStyleViewController** class can be used to create a map view that can be customized by clicking the **changeStyleButton**. The map style can be changed to one of three styles: streets, hybrid, or dark.

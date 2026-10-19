# UI Component

Flutter Navigation SDK offers the flexibility to customize the styles of the Navigation View according to your app's design and branding requirements.

## Android Customization:

To customize the styles for the Android Navigation View, create custom styles in your Android project's `styles.xml` file. These styles should inherit from the existing `NavigationViewLight` or `NavigationViewDark` styles, depending on your desired theme.

In the provided code example, a custom map-style URL is integrated into the navigation view styles for both light and dark themes. The custom map style URL allows developers to personalize the visual appearance of the map used within the navigation view according to their application's design language and branding.

For example, to create a custom style named _CustomNavigationViewLight_, use the following code:

```xml
<style name="CustomNavigationViewLight" parent="NavigationViewLight">
//customize your navigation style
<item name="navViewBannerBackground">@color/color</item>
<item name="navViewBannerPrimaryText">@color/color</item>
<item name="navViewMapStyle">lightStyleUrl</item>
...
</style>
```

For the light theme, a style named _CustomNavigationViewLight_ is created, inheriting properties from the `NavigationViewLight` style. Within this style, developers have the opportunity to customize various aspects of the navigation view, including the navigation banner background and primary text color. The crucial customization, however, is the assignment of the custom map style URL using the _navViewMapStyle_ item. By specifying a URL, such as _lightStyleUrl_, developers can link their desired map style definition, tailored to their application's requirements.

Similarly, for the dark theme, a style named _CustomNavigationViewDark_ is defined by extending the `NavigationViewDark` parent style. Within this style, developers can again customize the navigation banner background, and notably, assign the custom map style URL using the _navViewMapStyle_ item, here represented as _darkStyleUrl_.

```xml
<style name="CustomNavigationViewDark" parent="NavigationViewDark">
<item name="navViewBannerBackground">@color/colorAccent</item>
<item name="navViewMapStyle">darkStyleUrl</item>
</style>
```

## iOS Customization

To customize the appearance of the Navigation View on iOS, import `nb_navigation_flutter` in your `AppDelegate` and use the **NavStyleManager** to configure the custom styles. You can create custom styles for both day and night modes by subclassing the provided style classes.

### Create Custom Style Classes

To customize the navigation styles, you need to create your own classes that inherit from **DayStyle** and **NightStyle**. In these classes, you will define the appearance of various UI elements.

Example: Custom Day Style and Night Style

```dart
import NbmapNavigation

class CustomDayStyle: DayStyle {
    required init() {
        super.init()
        // Set the map style URL for the day mode
        mapStyleURL = URL(string: "https://api.nextbillion.io/tt/style/1/style/22.2.1-9?map=2/basic_street-light")!
    }

    override func apply() {
        super.apply()
        // Customize UI elements for day mode
        ArrivalTimeLabel.appearance().font = UIFont.systemFont(ofSize: 18, weight: .medium).adjustedFont
        ArrivalTimeLabel.appearance().normalTextColor = .defaultPrimaryText
        // Add more customizations as needed...
    }
}

class CustomNightStyle: NightStyle {
    required init() {
        super.init()
        // Set the map style URL for the night mode
        mapStyleURL = URL(string: "https://api.nextbillion.io/tt/style/1/style/22.2.1-9?map=2/basic_street-dark")!
    }

    override func apply() {
        super.apply()
        // Customize UI elements for night mode
        NavigationMapView.appearance().trafficUnknownColor = UIColor.green
        // Add more customizations as needed...
    }
}
```

### Apply Custom Styles

Once you have defined your custom styles, you need to apply them in your application. This is typically done in your app's initialization code.

Example: Applying Custom Styles

```dart
import nb_navigation_flutter

func customStyle() {
    NavStyleManager.customDayStyle = CustomDayStyle()
    NavStyleManager.customNightStyle = CustomNightStyle()
}

@UIApplicationMain
@objc class AppDelegate: FlutterAppDelegate, UINavigationControllerDelegate {
    override func application(
        _ application: UIApplication,
        didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?
    ) -> Bool {
        GeneratedPluginRegistrant.register(with: self)
        customStyle()
        return super.application(application, didFinishLaunchingWithOptions: launchOptions)
    }
```

Use the `customDayStyle` and `customNightStyle` properties to define your custom styles for day and night themes, respectively. You can customize various attributes such as fonts, colors, and other visual elements as per your app's design guidelines.

By inheriting from **DayStyle** and **NightStyle**, specific attributes of the daytime and nighttime navigation style are configured. Developers have the freedom to customize various visual elements, such as the font for the arrival time label, the color representation for unknown traffic conditions, and most importantly, the map style itself.

- `arrivalTimeLabelFont`: This property allows you to set the font and weight for the arrival time label displayed on the navigation interface during the daytime mode.
- `trafficUnknownColor`: Developers can define a custom color (e.g., red) to represent unknown traffic conditions, enhancing user comprehension of varying road situations.
- `mapStyleURL`: The URL of the custom map style is specified here using the URL class. The provided URL should point to a JSON file defining the visual characteristics of the map, including colors, icons, and more.

# Styled UI elements

Customize the appearance of UI elements within the Navigation view and modify the colors of UI elements.

This example shows:

- How to customize the UI elements in the Navigation view

- In this example, we use CustomDayStyle and CustomNightStyle to customize the UI element's colors in NavigationView

![documentation image](https://static.nextbillion.io/docs-next/docs/navigation/ios/styled-ui-elements.webp)

For all code examples, refer to [Navigation Code Examples](https://github.com/nextbillion-ai/ios-navigation-demo)

**CustomUIElementsViewController** [view source](https://github.com/nextbillion-ai/ios-navigation-demo/blob/main/navigation-ios-demo/Styled-UI-Elements.swift)

```swift
import UIKit
import NbmapNavigation
import NbmapCoreNavigation

var simulationIsEnabled = true

class CustomUIElementsViewController: UIViewController {

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
            let navigationService = NBNavigationService(routes: routes, routeIndex: 0,simulating: simulationIsEnabled ? SimulationMode.always : SimulationMode.onPoorGPS)
            let styles = [CustomDayStyle(),CustomNightStyle()]
            let navigationOptions = NavigationOptions(styles: styles ,navigationService: navigationService)

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

class CustomDayStyle: DayStyle {
    private let defaultPrimaryText = #colorLiteral(red: 0, green: 0, blue: 0, alpha: 1)
    private let defaultManeuverArrowColor = #colorLiteral(red: 1, green: 1, blue: 1, alpha: 1)
    private let defaultManeuverArrowStrokeColor =  #colorLiteral(red: 0.4520691633, green: 0.5277981758, blue: 0.9168900847, alpha: 1)
    private let defaultAlternateLine = #colorLiteral(red: 0.760784328, green: 0.7607844472, blue: 0.7607844472, alpha: 1)
    private let defaultAlternateLineCasing = #colorLiteral(red: 0.5019607843, green: 0.4980392157, blue: 0.5019607843, alpha: 1)

    private let trafficUnknown = #colorLiteral(red: 0.4520691633, green: 0.5277981758, blue: 0.9168900847, alpha: 1)
    private let trafficLow =  #colorLiteral(red: 0.4520691633, green: 0.5277981758, blue: 0.9168900847, alpha: 1)
    private let trafficModerate =  #colorLiteral(red: 1, green: 0.5843137255, blue: 0, alpha: 1)
    private let trafficHeavy = #colorLiteral(red: 1, green: 0.3019607843, blue: 0.3019607843, alpha: 1)
    private let trafficSevere = #colorLiteral(red: 0.5607843137, green: 0.1411764706, blue: 0.2784313725, alpha: 1)
    private let trafficAlternateLow = #colorLiteral(red: 0.4666666687, green: 0.7647058964, blue: 0.2666666806, alpha: 1)

    required init() {
        super.init()
        styleType = .day
    }

    override func apply() {
        super.apply()

        ArrivalTimeLabel.appearance().font = UIFont.systemFont(ofSize: 18, weight: .medium).adjustedFont
        ArrivalTimeLabel.appearance().normalTextColor = defaultPrimaryText
        BottomBannerContentView.appearance().backgroundColor = #colorLiteral(red: 1, green: 1, blue: 1, alpha: 1)
        BottomBannerView.appearance().backgroundColor = #colorLiteral(red: 1, green: 1, blue: 1, alpha: 1)
        Button.appearance().textColor = defaultPrimaryText
        CancelButton.appearance().backgroundColor = #colorLiteral(red: 0.9254902005, green: 0.2352941185, blue: 0.1019607857, alpha: 1)
        CancelButton.appearance().textFont = UIFont.systemFont(ofSize: 16, weight: .regular).adjustedFont
        CancelButton.appearance().textColor =  #colorLiteral(red: 0.9842069745, green: 0.9843751788, blue: 0.9841964841, alpha: 1)
        OverviewButton.appearance().borderColor = #colorLiteral(red: 0.94117647, green: 0.95294118, blue: 1, alpha: 1)
        OverviewButton.appearance().tintColor = #colorLiteral(red: 0.2566259801, green: 0.3436664343, blue: 0.8086165786, alpha: 0.6812137831)
        DismissButton.appearance().backgroundColor = #colorLiteral(red: 1, green: 1, blue: 1, alpha: 1)
        DismissButton.appearance().textColor = #colorLiteral(red: 0.09803921569, green: 0.09803921569, blue: 0.09803921569, alpha: 1)
        DismissButton.appearance().textFont = UIFont.systemFont(ofSize: 20, weight: .medium).adjustedFont
        DistanceLabel.appearance().unitFont = UIFont.systemFont(ofSize: 14, weight: .medium).adjustedFont
        DistanceLabel.appearance().valueFont = UIFont.systemFont(ofSize: 22, weight: .medium).adjustedFont
        DistanceLabel.appearance(whenContainedInInstancesOf: [InstructionsBannerView.self]).unitTextColor = #colorLiteral(red: 0.980392158, green: 0.980392158, blue: 0.980392158, alpha: 1)
        DistanceLabel.appearance(whenContainedInInstancesOf: [InstructionsBannerView.self]).valueTextColor = #colorLiteral(red: 0.980392158, green: 0.980392158, blue: 0.980392158, alpha: 1)
        DistanceLabel.appearance(whenContainedInInstancesOf: [StepInstructionsView.self]).unitTextColor = #colorLiteral(red: 0.3999999762, green: 0.3999999762, blue: 0.3999999762, alpha: 1)
        DistanceLabel.appearance(whenContainedInInstancesOf: [StepInstructionsView.self]).valueTextColor = #colorLiteral(red: 0.3999999762, green: 0.3999999762, blue: 0.3999999762, alpha: 1)
        DistanceRemainingLabel.appearance().font = UIFont.systemFont(ofSize: 18, weight: .medium).adjustedFont
        DistanceRemainingLabel.appearance().normalTextColor = #colorLiteral(red: 0.3999999762, green: 0.3999999762, blue: 0.3999999762, alpha: 1)
        FloatingButton.appearance().backgroundColor = #colorLiteral(red: 1, green: 1, blue: 1, alpha: 1)
        FloatingButton.appearance().tintColor = tintColor
        InstructionsBannerContentView.appearance().backgroundColor = #colorLiteral(red: 1, green: 1, blue: 1, alpha: 1)
        InstructionsBannerView.appearance().backgroundColor = #colorLiteral(red: 0.2755675018, green: 0.7829894423, blue: 0.3109624088, alpha: 1)
        LaneView.appearance().primaryColor =  #colorLiteral(red: 1, green: 1, blue: 1, alpha: 1)
        LaneView.appearance().secondaryColor = #colorLiteral(red: 0.6196078431, green: 0.6196078431, blue: 0.6196078431, alpha: 1)
        LanesView.appearance().backgroundColor = #colorLiteral(red: 0.1522715986, green: 0.5290428996, blue: 0.1787364483, alpha: 1)
        LineView.appearance().lineColor = #colorLiteral(red: 0, green: 0, blue: 0, alpha: 0.1)
        ManeuverView.appearance().backgroundColor = .clear
        ManeuverView.appearance(whenContainedInInstancesOf: [InstructionsBannerView.self]).primaryColor = #colorLiteral(red: 1, green: 1, blue: 1, alpha: 1)
        ManeuverView.appearance(whenContainedInInstancesOf: [InstructionsBannerView.self]).secondaryColor = #colorLiteral(red: 0.6196078431, green: 0.6196078431, blue: 0.6196078431, alpha: 1)
        ManeuverView.appearance(whenContainedInInstancesOf: [NextBannerView.self]).primaryColor = #colorLiteral(red: 1, green: 1, blue: 1, alpha: 1)
        ManeuverView.appearance(whenContainedInInstancesOf: [NextBannerView.self]).secondaryColor = #colorLiteral(red: 0.6196078431, green: 0.6196078431, blue: 0.6196078431, alpha: 1)
        ManeuverView.appearance(whenContainedInInstancesOf: [StepInstructionsView.self]).primaryColor =  #colorLiteral(red: 0.2392157018, green: 0.2392157018, blue: 0.2392157018, alpha: 1)
        ManeuverView.appearance(whenContainedInInstancesOf: [StepInstructionsView.self]).secondaryColor =  #colorLiteral(red: 0.6196078431, green: 0.6196078431, blue: 0.6196078431, alpha: 1)
        NavigationMapView.appearance().maneuverArrowColor       = defaultManeuverArrowColor
        NavigationMapView.appearance().maneuverArrowStrokeColor = defaultManeuverArrowStrokeColor
        NavigationMapView.appearance().routeAlternateColor      = defaultAlternateLine
        NavigationMapView.appearance().routeCasingColor         = defaultAlternateLineCasing
        NavigationMapView.appearance().trafficHeavyColor        = trafficHeavy
        NavigationMapView.appearance().trafficLowColor          = trafficLow
        NavigationMapView.appearance().trafficModerateColor     = trafficModerate
        NavigationMapView.appearance().trafficSevereColor       = trafficSevere
        NavigationMapView.appearance().trafficUnknownColor      = trafficUnknown
        NavigationView.appearance().backgroundColor = #colorLiteral(red: 0.764706, green: 0.752941, blue: 0.733333, alpha: 1)
        NextBannerView.appearance().backgroundColor = #colorLiteral(red: 0.1522715986, green: 0.5290428996, blue: 0.1787364483, alpha: 1)
        NextInstructionLabel.appearance().font = UIFont.systemFont(ofSize: 20, weight: .medium).adjustedFont
        NextInstructionLabel.appearance().normalTextColor = #colorLiteral(red: 1, green: 1, blue: 1, alpha: 1)
        PrimaryLabel.appearance().normalFont = UIFont.systemFont(ofSize: 30, weight: .medium).adjustedFont
        PrimaryLabel.appearance(whenContainedInInstancesOf: [InstructionsBannerView.self]).normalTextColor = #colorLiteral(red: 1, green: 1, blue: 1, alpha: 1)
        PrimaryLabel.appearance(whenContainedInInstancesOf: [StepInstructionsView.self]).normalTextColor = #colorLiteral(red: 0.09803921569, green: 0.09803921569, blue: 0.09803921569, alpha: 1)
        PrimaryLabel.appearance(whenContainedInInstancesOf: [StepInstructionsView.self]).normalFont =  UIFont.systemFont(ofSize: 15, weight: .medium).adjustedFont
        ProgressBar.appearance().barColor = #colorLiteral(red: 0.149, green: 0.239, blue: 0.341, alpha: 1)
        ReportButton.appearance().backgroundColor = #colorLiteral(red: 1, green: 1, blue: 1, alpha: 1)
        ReportButton.appearance().textColor = tintColor!
        ReportButton.appearance().textFont = UIFont.systemFont(ofSize: 15, weight: .medium).adjustedFont
        ResumeButton.appearance().backgroundColor = #colorLiteral(red: 0.4609908462, green: 0.5315783024, blue: 0.9125307202, alpha: 1)
        ResumeButton.appearance().tintColor =  #colorLiteral(red: 1, green: 1, blue: 1, alpha: 1)
        SecondaryLabel.appearance().normalFont = UIFont.systemFont(ofSize: 26, weight: .medium).adjustedFont
        SecondaryLabel.appearance(whenContainedInInstancesOf: [InstructionsBannerView.self]).normalTextColor = #colorLiteral(red: 0.2156862745, green: 0.2156862745, blue: 0.2156862745, alpha: 1)
        SecondaryLabel.appearance(whenContainedInInstancesOf: [StepInstructionsView.self]).normalTextColor = #colorLiteral(red: 0.2156862745, green: 0.2156862745, blue: 0.2156862745, alpha: 1)
        SeparatorView.appearance().backgroundColor = #colorLiteral(red: 0.737254902, green: 0.7960784314, blue: 0.8705882353, alpha: 1)
        StatusView.appearance().backgroundColor = UIColor.black.withAlphaComponent(2.0/3.0)
        StepInstructionsView.appearance().backgroundColor = #colorLiteral(red: 1, green: 1, blue: 1, alpha: 1)
        StepListIndicatorView.appearance().gradientColors = [#colorLiteral(red: 0.431372549, green: 0.431372549, blue: 0.431372549, alpha: 1), #colorLiteral(red: 0.6274509804, green: 0.6274509804, blue: 0.6274509804, alpha: 1), #colorLiteral(red: 0.431372549, green: 0.431372549, blue: 0.431372549, alpha: 1)]
        StepTableViewCell.appearance().backgroundColor = #colorLiteral(red: 0.9675388083, green: 0.9675388083, blue: 0.9675388083, alpha: 1)
        StepsBackgroundView.appearance().backgroundColor = #colorLiteral(red: 1, green: 1, blue: 1, alpha: 1)
        TimeRemainingLabel.appearance().font = UIFont.systemFont(ofSize: 28, weight: .medium).adjustedFont
        TimeRemainingLabel.appearance().normalTextColor = defaultPrimaryText
        TimeRemainingLabel.appearance().trafficHeavyColor = #colorLiteral(red:0.91, green:0.20, blue:0.25, alpha:1.0)
        TimeRemainingLabel.appearance().trafficLowColor = #colorLiteral(red: 0.4666666687, green: 0.7647058964, blue: 0.2666666806, alpha: 1)
        TimeRemainingLabel.appearance().trafficModerateColor = #colorLiteral(red:0.95, green:0.65, blue:0.31, alpha:1.0)
        TimeRemainingLabel.appearance().trafficSevereColor = #colorLiteral(red: 0.7705719471, green: 0.1753477752, blue: 0.1177056804, alpha: 1)
        TimeRemainingLabel.appearance().trafficUnknownColor = defaultPrimaryText
        WayNameLabel.appearance().normalFont = UIFont.systemFont(ofSize:20, weight: .medium).adjustedFont
        WayNameLabel.appearance().normalTextColor = #colorLiteral(red: 0.968627451, green: 0.968627451, blue: 0.968627451, alpha: 1)
        WayNameView.appearance().backgroundColor = #colorLiteral(red: 0.4520691633, green: 0.5277981758, blue: 0.9168900847, alpha: 1).withAlphaComponent(0.85)
        WayNameView.appearance().borderColor = #colorLiteral(red: 0.4520691633, green: 0.5277981758, blue: 0.9168900847, alpha: 1).withAlphaComponent(0.8)
        SpeedView.appearance().textColor = defaultPrimaryText
        SpeedView.appearance().signBackColor = #colorLiteral(red: 1, green: 1, blue: 1, alpha: 1)
    }
}

class CustomNightStyle: NightStyle {

    private let backgroundColor = #colorLiteral(red: 0.1854747534, green: 0.2004796863, blue: 0.2470968068, alpha: 1)

    private let primaryTextColor = #colorLiteral(red: 1, green: 1, blue: 1, alpha: 1)
    private let secondaryTextColor = #colorLiteral(red: 1, green: 1, blue: 1, alpha: 0.9)

    required init() {
        super.init()
        styleType = .night
    }

    override func apply() {
        super.apply()
        ArrivalTimeLabel.appearance().normalTextColor = #colorLiteral(red: 0.7991961837, green: 0.8232284188, blue: 0.8481693864, alpha: 1)
        BottomBannerContentView.appearance().backgroundColor = backgroundColor
        BottomBannerView.appearance().backgroundColor = backgroundColor
        Button.appearance().textColor = #colorLiteral(red: 0.9842069745, green: 0.9843751788, blue: 0.9841964841, alpha: 1)
        CancelButton.appearance().tintColor = #colorLiteral(red: 0.9254902005, green: 0.2352941185, blue: 0.1019607857, alpha: 1)
        CancelButton.appearance().borderColor = #colorLiteral(red: 0.9254902005, green: 0.2352941185, blue: 0.1019607857, alpha: 1)
        CancelButton.appearance().textFont = UIFont.systemFont(ofSize: 16, weight: .regular).adjustedFont
        CancelButton.appearance().textColor =  #colorLiteral(red: 0.9842069745, green: 0.9843751788, blue: 0.9841964841, alpha: 1)
        OverviewButton.appearance().borderColor = #colorLiteral(red: 0.94117647, green: 0.95294118, blue: 1, alpha: 1)
        OverviewButton.appearance().backgroundColor = #colorLiteral(red: 0.9433202147, green: 0.9532703757, blue: 1, alpha: 1)
        OverviewButton.appearance().tintColor = #colorLiteral(red: 0.2566259801, green: 0.3436664343, blue: 0.8086165786, alpha: 0.6812137831)
        DismissButton.appearance().backgroundColor = backgroundColor
        DismissButton.appearance().textColor = #colorLiteral(red: 0.9842069745, green: 0.9843751788, blue: 0.9841964841, alpha: 1)
        DistanceLabel.appearance(whenContainedInInstancesOf: [InstructionsBannerView.self]).unitTextColor = #colorLiteral(red: 0.9842069745, green: 0.9843751788, blue: 0.9841964841, alpha: 1)
        DistanceLabel.appearance(whenContainedInInstancesOf: [InstructionsBannerView.self]).valueTextColor = #colorLiteral(red: 0.9842069745, green: 0.9843751788, blue: 0.9841964841, alpha: 1)
        DistanceLabel.appearance(whenContainedInInstancesOf: [StepInstructionsView.self]).unitTextColor = #colorLiteral(red: 0.7991961837, green: 0.8232284188, blue: 0.8481693864, alpha: 1)
        DistanceLabel.appearance(whenContainedInInstancesOf: [StepInstructionsView.self]).valueTextColor = #colorLiteral(red: 0.9842069745, green: 0.9843751788, blue: 0.9841964841, alpha: 1)
        DistanceRemainingLabel.appearance().normalTextColor = #colorLiteral(red: 0.7991961837, green: 0.8232284188, blue: 0.8481693864, alpha: 1)
        FloatingButton.appearance().backgroundColor =  #colorLiteral(red: 0.9842069745, green: 0.9843751788, blue: 0.9841964841, alpha: 1)
        FloatingButton.appearance().tintColor = #colorLiteral(red: 0.1725490093, green: 0.1725490093, blue: 0.1725490093, alpha: 1)
        InstructionsBannerContentView.appearance().backgroundColor = backgroundColor
        InstructionsBannerView.appearance().backgroundColor = #colorLiteral(red: 0.2755675018, green: 0.7829894423, blue: 0.3109624088, alpha: 1)
        LaneView.appearance().primaryColor = #colorLiteral(red: 0.9842069745, green: 0.9843751788, blue: 0.9841964841, alpha: 1)
        LanesView.appearance().backgroundColor = #colorLiteral(red: 0.1522715986, green: 0.5290428996, blue: 0.1787364483, alpha: 1)
        ManeuverView.appearance().backgroundColor = .clear
        ManeuverView.appearance(whenContainedInInstancesOf: [InstructionsBannerView.self]).primaryColor = #colorLiteral(red: 1, green: 1, blue: 1, alpha: 1)
        ManeuverView.appearance(whenContainedInInstancesOf: [InstructionsBannerView.self]).secondaryColor = #colorLiteral(red: 1, green: 1, blue: 1, alpha: 0.3)
        ManeuverView.appearance(whenContainedInInstancesOf: [NextBannerView.self]).primaryColor = #colorLiteral(red: 1, green: 1, blue: 1, alpha: 1)
        ManeuverView.appearance(whenContainedInInstancesOf: [NextBannerView.self]).secondaryColor = #colorLiteral(red: 1, green: 1, blue: 1, alpha: 0.3)
        ManeuverView.appearance(whenContainedInInstancesOf: [StepInstructionsView.self]).primaryColor = #colorLiteral(red: 1, green: 1, blue: 1, alpha: 1)
        ManeuverView.appearance(whenContainedInInstancesOf: [StepInstructionsView.self]).secondaryColor = #colorLiteral(red: 1, green: 1, blue: 1, alpha: 0.3)
        NavigationMapView.appearance().routeAlternateColor = #colorLiteral(red: 0.7991961837, green: 0.8232284188, blue: 0.8481693864, alpha: 1)
        NavigationView.appearance().backgroundColor = #colorLiteral(red: 0.0470588, green: 0.0509804, blue: 0.054902, alpha: 1)
        NextBannerView.appearance().backgroundColor = #colorLiteral(red: 0.1522715986, green: 0.5290428996, blue: 0.1787364483, alpha: 1)
        NextInstructionLabel.appearance().normalTextColor = #colorLiteral(red: 0.9842069745, green: 0.9843751788, blue: 0.9841964841, alpha: 1)
        PrimaryLabel.appearance(whenContainedInInstancesOf: [InstructionsBannerView.self]).normalTextColor = #colorLiteral(red: 0.9996390939, green: 1, blue: 0.9997561574, alpha: 1)
        PrimaryLabel.appearance(whenContainedInInstancesOf: [StepInstructionsView.self]).normalTextColor = #colorLiteral(red: 0.9996390939, green: 1, blue: 0.9997561574, alpha: 1)
        ProgressBar.appearance().barColor = #colorLiteral(red: 0.9842069745, green: 0.9843751788, blue: 0.9841964841, alpha: 1)
        ReportButton.appearance().backgroundColor = backgroundColor
        ReportButton.appearance().textColor = #colorLiteral(red: 0.9842069745, green: 0.9843751788, blue: 0.9841964841, alpha: 1)
        ResumeButton.appearance().backgroundColor =  #colorLiteral(red: 0.4609908462, green: 0.5315783024, blue: 0.9125307202, alpha: 1)
        ResumeButton.appearance().tintColor = #colorLiteral(red: 0.9842069745, green: 0.9843751788, blue: 0.9841964841, alpha: 1)
        SecondaryLabel.appearance(whenContainedInInstancesOf: [InstructionsBannerView.self]).normalTextColor = #colorLiteral(red: 0.7349056005, green: 0.7675836682, blue: 0.8063536286, alpha: 1)
        SecondaryLabel.appearance(whenContainedInInstancesOf: [StepInstructionsView.self]).normalTextColor = #colorLiteral(red: 0.7349056005, green: 0.7675836682, blue: 0.8063536286, alpha: 1)
        SeparatorView.appearance().backgroundColor = #colorLiteral(red: 0.3764705882, green: 0.4901960784, blue: 0.6117647059, alpha: 0.796599912)
        StepInstructionsView.appearance().backgroundColor = backgroundColor
        StepTableViewCell.appearance().backgroundColor = backgroundColor
        StepsBackgroundView.appearance().backgroundColor = #colorLiteral(red: 0.103291966, green: 0.1482483149, blue: 0.2006777823, alpha: 1)
        TimeRemainingLabel.appearance().normalTextColor = #colorLiteral(red: 0.9842069745, green: 0.9843751788, blue: 0.9841964841, alpha: 1)
        TimeRemainingLabel.appearance().trafficUnknownColor = #colorLiteral(red: 0.9842069745, green: 0.9843751788, blue: 0.9841964841, alpha: 1)
        WayNameView.appearance().borderColor = #colorLiteral(red: 0.2802129388, green: 0.3988235593, blue: 0.5260632038, alpha: 1)
        SpeedView.appearance().textColor = #colorLiteral(red: 0.9842069745, green: 0.9843751788, blue: 0.9841964841, alpha: 1)
        SpeedView.appearance().signBackColor = #colorLiteral(red: 0.3483417034, green: 0.3733484447, blue: 0.4411733449, alpha: 1)
    }
}
```

The example shows how to customize the UI elements in the Navigation view.

You can change the color of the text, the background color, and other properties. For a complete list of properties that you can customize, see the documentation for the relevant view class.

In the example, the following properties are customized:

- The font and color of the title label

- The background color of the navigation bar

- The appearance of the buttons

- The appearance of the route line

You can customize the UI elements in the Navigation view to match the look and feel of your app. This can help to create a more cohesive and user-friendly experience.

Here are some additional tips for customizing the UI elements in the Navigation view:

- Use consistent colors and fonts throughout your app. This will help to create a more polished look and feel.

- Use high-quality images and icons. This will help to make your app more visually appealing.

- Test your app on a variety of devices and screen sizes. This will help to ensure that your app looks good and works well on all devices.

You can customize the following elements:

- ArrivalTimeLabel

- BottomBannerContentView

- BottomBannerView

- Button

- CancelButton

- OverviewButton

- DismissButton

- DistanceLabel

- DistanceRemainingLabel

- FloatingButton

- InstructionsBannerContentView

- InstructionsBannerView

- LaneView

- LanesView

- ManeuverView

- NavigationMapView

- NavigationView

- NextBannerView

- NextInstructionLabel

- PrimaryLabel

- ProgressBar

- ReportButton

- ResumeButton

- SecondaryLabel

- SeparatorView

- StepInstructionsView

- StepTableViewCell

- StepsBackgroundView

- TimeRemainingLabel

- WayNameView

- SpeedView

The **appearance()** method is used to customize the appearance of a UI widget. The **appearance()** method takes a class as its argument. The class argument specifies the class of the UI widget that you want to customize.

For example, the following code customizes the appearance of the **ArrivalTimeLabel** widget:

ArrivalTimeLabel.appearance().normalTextColor = #colorLiteral(red: 0.7991961837, green: 0.8232284188, blue: 0.8481693864, alpha: 1)

The **normalTextColor** property specifies the color of the text in the **ArrivalTimeLabel** widget. The value of the **normalTextColor** property is a UIColor object.

You can also use the **appearance()** method to customize the appearance of a UI widget based on its parent view. For example, the following code customizes the appearance of the ArrivalTimeLabel widget when it is contained in a view of type InstructionsBannerView:

**ArrivalTimeLabel**.appearance(whenContainedInInstancesOf: **\[InstructionsBannerView.self\]**).normalTextColor = #colorLiteral(red: 0.7991961837, green: 0.8232284188, blue: 0.8481693864, alpha: 1)

The **whenContainedInInstancesOf** property specifies the classes of the parent views that you want to customize the appearance of the UI widget for. The value of the **whenContainedInInstancesOf** property is an array of **Class** objects.

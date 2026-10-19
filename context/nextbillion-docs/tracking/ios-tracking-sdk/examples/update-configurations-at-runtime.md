# Simple Asset Tracking Example

This example guides you through the following steps:

- **Initialization with Customized Configurations**: Learn how to set up the SDK with customized configuration values, tailoring it to your specific requirements and preferences.
- **Updating Configuration Settings at Runtime**: Discover how to dynamically modify configuration settings such as LocationConfig, NotificationConfig, and DataTrackingConfig during the execution of your application. This flexibility empowers you to adapt the SDK to changing conditions and user needs in real time.

For all code examples, refer to [iOS Tracking Android Code Examples](https://github.com/nextbillion-ai/nb-asset-tracking-ios-demo)

**UpdateConfigurationViewController** [view source](https://github.com/nextbillion-ai/nb-asset-tracking-ios-demo/blob/main/AssetTrackingExample/UpdateConfigurationViewController.swift)

```swift
class UpdateConfigurationViewController: UIViewController {
    @IBOutlet weak var updateLocationConfigBtn: UIButton!
    @IBOutlet weak var updateNotificationConfigBtn: UIButton!
    @IBOutlet weak var updateDataTrackingConfigBtn: UIButton!
    @IBOutlet weak var configurationInfo: UILabel!

    override func viewDidLoad() {
        super.viewDidLoad()
        let assetTracking = AssetTracking.shared

        let locationConfig = LocationConfig(trackingMode: .ACTIVE)
        locationConfig.distanceFilter = 5
        assetTracking.setLocationConfig(config: locationConfig)

        let notificationConfig = NotificationConfig()
        notificationConfig.showLowBatteryNotification = true
        assetTracking.setNotificationConfig(config: notificationConfig)

        let dataTrackingConfig = DataTrackingConfig()
        dataTrackingConfig.shouldClearLocalDataWhenCollision = false
        assetTracking.setDataTrackingConfig(config: dataTrackingConfig)

        assetTracking.initialize(apiKey: "YOUR_API_KEY")

        createAsset()
        initView()
    }

    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        self.navigationController?.setNavigationBarHidden(false, animated: true)
    }

    override func viewWillDisappear(_ animated: Bool) {
        super.viewWillDisappear(animated)
        self.navigationController?.setNavigationBarHidden(true, animated: true)
    }

    func initView(){
        updateLocationConfigBtn.addTarget(self, action: #selector(updateLocationConfig), for: .touchUpInside)
        updateNotificationConfigBtn.addTarget(self, action: #selector(updateNotificationConfig), for: .touchUpInside)
        updateDataTrackingConfigBtn.addTarget(self, action: #selector(updateDataTrackingConfig), for: .touchUpInside)
        configurationInfo.text = ""
    }

    @objc  func updateLocationConfig(){
        let locationConfig = AssetTracking.shared.getLocationConfig()
        locationConfig.distanceFilter = 10

        AssetTracking.shared.updateLocationConfig(config: locationConfig)

        let newLocationConfig = AssetTracking.shared.getLocationConfig()

        configurationInfo.text = "The updated location config value is: " + String(newLocationConfig.distanceFilter)
    }

    @objc func updateNotificationConfig() {
        let notificationConfig = AssetTracking.shared.getNotificationConfig()
        notificationConfig.showLowBatteryNotification = true

        AssetTracking.shared.updateNotificationConfig(config: notificationConfig)

        let newNotificationConfig = AssetTracking.shared.getNotificationConfig()

        configurationInfo.text = "The updated notificationConfig config value is: " + String(newNotificationConfig.showLowBatteryNotification)
    }

    @objc func updateDataTrackingConfig() {
        let dataTrackingConfig = AssetTracking.shared.getDataTrackingConfig()
        dataTrackingConfig.shouldClearLocalDataWhenCollision = true

        AssetTracking.shared.updateDataTrackingConfig(config: dataTrackingConfig)

        let newDataTrackingConfig = AssetTracking.shared.getDataTrackingConfig()

        configurationInfo.text = "The updated dataTrackingConfig config value is: " + String(newDataTrackingConfig.shouldClearLocalDataWhenCollision)
    }


    func createAsset(){
        let attributes = ["attribute 1": "test 1", "attribute 2": "test 2"]
        let assetProfile: AssetProfile = AssetProfile.init(customId: UUID().uuidString.lowercased(), assetDescription: "testDescription", name: "testName", attributes: attributes)

        AssetTracking.shared.createAsset(assetProfile: assetProfile) { assetCreationResponse in
            let assetId = assetCreationResponse.data.id

            let toastView = ToastView(message: "Create asset successfully with id: " + assetId)
            toastView.show()

            self.bindAssetAndStartTracking(assetId: assetId)
        } errorHandler: { error in
            let errorMessage = error.localizedDescription
            let toastView = ToastView(message: "Create asset failed: " + errorMessage)
            toastView.show()
        }
    }

    func bindAssetAndStartTracking(assetId: String) {
        AssetTracking.shared.bindAsset(assetId: assetId) { responseCode in
            let toastView = ToastView(message: "Bind asset successfully with id: " + assetId)
            toastView.show()
            AssetTracking.shared.startTracking()
        } errorHandler: { error in
            let errorMessage = error.localizedDescription
            let toastView = ToastView(message: "Bind asset failed: " + errorMessage)
            toastView.show()
        }
    }

}
```

Upon executing the code example provided above, your app's appearance will resemble the following snippet:

![documentation image](/docs/live-tracking/ios-tracking/update-configurations-at-runtime.webp)

### Code Highlights

The above code snippet is a class inherited from the UIViewController class, which is the base class for all view controllers in iOS.

- The class has three outlet properties: **updateLocationConfigBtn**, **updateNotificationConfigBtn**, and **updateDataTrackingConfigBtn**. These properties are linked to the corresponding UI elements in the view controller's storyboard.
- The class has three methods to update the location configuration, notification configuration, and data tracking configuration, respectively. These methods call the **AssetTracking.shared.updateLocationConfig()**, **AssetTracking.shared.updateNotificationConfig()**, and **AssetTracking.shared.updateDataTrackingConfig()** methods, respectively.
- The class has a **createAsset()** method to create a new asset.
- The class has a **bindAssetAndStartTracking()** method to bind the asset to the current view controller and start tracking it.

Here is a more detailed explanation of some of the key concepts in the code:

- **AssetTracking**: This is the class that is responsible for tracking assets.
- **LocationConfig**: This class represents the configuration for location tracking.
- **NotificationConfig**: This class represents the configuration for notification settings.
- **DataTrackingConfig**: This class represents the configuration for data tracking settings.

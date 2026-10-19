# Asset Tracking Extended

This detailed example walks you through the following steps:

- **Creating a New Asset Based on User Input**: Learn how to generate a new asset within your application, leveraging user input to create assets dynamically.
- **Binding User-Created Asset IDs to the Current Device**: Discover the process of associating user-generated asset IDs with the device you're currently using, facilitating tracking and management of these assets.
- **Starting and Stopping Tracking Based on User Operations**: Gain insights into how to initiate and halt tracking operations, giving users control over the tracking process.
- **Switching Between Tracking Modes Based on User Operations**: Learn how to transition between different tracking modes, providing flexibility and adaptability to user preferences.
- **Receiving AssetTrackingCallbacks and Displaying Results in the User Interface**: Explore how to handle AssetTrackingCallbacks and effectively communicate tracking results to the user interface, ensuring a seamless and informative user experience.

For all code examples, refer to [iOS Tracking Android Code Examples](https://github.com/nextbillion-ai/nb-asset-tracking-ios-demo)

**SetProfileViewController** [view source](https://github.com/nextbillion-ai/nb-asset-tracking-ios-demo/blob/main/AssetTrackingExample/SetProfileViewController.swift)

```swift

class SetProfileViewController: UIViewController, UIGestureRecognizerDelegate {
    @IBOutlet weak var editCustomId: UITextField!
    @IBOutlet weak var editAssetName: UITextField!
    @IBOutlet weak var editAssetDescription: UITextField!
    @IBOutlet weak var editAssetAttributes: UITextField!
    @IBOutlet weak var lastAssetId: UITextField!
    @IBOutlet weak var createAsset: UIButton!

    @IBOutlet weak var editAssetId: UITextField!
    @IBOutlet weak var bindAsset: UIButton!

    var customId: String = ""
    var assetName: String = ""
    var assetDescription: String = ""
    var assetAttributes: String = ""
    var assetId: String = ""

    let userDefaults: UserDefaults = UserDefaults.standard

    override func viewDidLoad() {
        super.viewDidLoad()
        self.navigationController?.interactivePopGestureRecognizer?.delegate = self
        self.hideKeyboardWhenTappedAround()
        initData()
        setUpInitialView()
        addGestureEvents()
    }

    override func viewWillAppear(_ animated: Bool) {
        self.navigationController?.setNavigationBarHidden(true, animated: true)
    }

    private func initData() {
        customId = userDefaults.string(forKey: Constants.CUSTOM_ID_KEY) ?? UUID().uuidString.lowercased()
        assetName = userDefaults.string(forKey: Constants.ASSET_NAME_KEY) ?? "my car"
        assetDescription = userDefaults.string(forKey: Constants.ASSET_DESCRIPTION_KEY) ?? "a luxury BMW"
        assetAttributes = userDefaults.string(forKey: Constants.ASSET_ATTRIBUTES_KEY) ?? "a test attribute"

        assetId = userDefaults.string(forKey: Constants.ASSET_ID_KEY) ?? ""
    }

    private func setUpInitialView(){
        editCustomId.delegate = self
        editAssetName.delegate = self
        editAssetDescription.delegate = self
        editAssetAttributes.delegate = self
        editAssetId.delegate = self

        editCustomId.text = customId
        editAssetName.text = assetName
        editAssetDescription.text = assetDescription
        editAssetAttributes.text = assetAttributes
        editAssetId.text = assetId
        lastAssetId.text = userDefaults.string(forKey: Constants.LAST_BIND_ASSET_ID_KEY) ?? ""

        createAsset.setTitleColor(.white, for: .normal)
        createAsset.layer.cornerRadius = 10
        createAsset.layer.backgroundColor = UIColor.systemBlue.cgColor

        bindAsset.setTitleColor(.systemBlue, for: .normal)
        bindAsset.layer.cornerRadius = 10
        bindAsset.layer.borderWidth = 1.0
        bindAsset.layer.borderColor = UIColor.systemBlue.cgColor
    }

    private func addGestureEvents() {
        createAsset.addTarget(self, action: #selector(onCreateAssetTapped), for: .touchUpInside)
        bindAsset.addTarget(self, action: #selector(onBindAssetTapped), for: .touchUpInside)
    }

    func isLauncherScreen() -> Bool {
        return self.navigationController?.viewControllers.count == 1
    }

    func lanchToHomeView() {
        let viewController = UIStoryboard(name: "Main", bundle: nil).instantiateViewController(withIdentifier: "ViewController")
        self.view.window?.rootViewController = UINavigationController(rootViewController: viewController)
    }

    private func saveAssetProfile(assetId: String){
        userDefaults.set(customId, forKey: Constants.CUSTOM_ID_KEY)
        userDefaults.set(assetName, forKey: Constants.ASSET_NAME_KEY)
        userDefaults.set(assetDescription, forKey: Constants.ASSET_DESCRIPTION_KEY)
        userDefaults.set(assetAttributes, forKey: Constants.ASSET_ATTRIBUTES_KEY)
        userDefaults.set(assetId, forKey: Constants.ASSET_ID_KEY)
    }

    @objc private func onCreateAssetTapped() {
        if (assetName.isEmpty) {
            let toastView = ToastView(message: "Please enter asset name")
            toastView.show()
            return
        }

        if(AssetTracking.shared.isRunning()){
            let toastView = ToastView(message: "Asset tracking is ON, please turn off tracking before creating new asset!")
            toastView.show()
            return
        }

        let assetProfile: AssetProfile = AssetProfile.init(customId: customId, assetDescription: assetDescription, name: assetName, attributes: ["test": assetAttributes])

        AssetTracking.shared.createAsset(assetProfile: assetProfile) { assetCreationResponse in
            let assetId = assetCreationResponse.data.id
            self.editAssetId.text = assetId
            self.saveAssetProfile(assetId: assetId)
        } errorHandler: { error in
            let errorMessage = error.localizedDescription
            let toastView = ToastView(message: "Create asset failed: " + errorMessage)
            toastView.show()
        }
    }

    private func showForceBindDialog(assetId: String, warningMessage: String) {
        // Create an alert controller
        let alertController = UIAlertController(title: "", message: warningMessage + ", do you want to clear local data and force bind to new asset id?", preferredStyle: .alert)

        let okAction = UIAlertAction(title: "Proceed", style: .default) { (_) in
            self.dismiss(animated: true, completion: nil)
            AssetTracking.shared.forceBindAsset(assetId: assetId) { responseCode in
                let toastView = ToastView(message: "Force bind new asset successfully with assetId: " + assetId)
                toastView.show()

                self.userDefaults.set(true, forKey: Constants.IS_NOT_FIRST_INSTALLATION_KEY)
                self.userDefaults.set(assetId, forKey: Constants.LAST_BIND_ASSET_ID_KEY)

                if self.isLauncherScreen() {
                    self.lanchToHomeView()
                } else {
                    self.navigationController?.popViewController(animated: true)
                }
            } errorHandler: { error in
                let errorMessage = error.localizedDescription
                let toastView = ToastView(message: "Bind asset failed: " + errorMessage)
                toastView.show()
            }
        }
        alertController.addAction(okAction)

        // Add "Cancel" button
        let cancelAction = UIAlertAction(title: "Cancel", style: .cancel) { (_) in
            self.dismiss(animated: true, completion: nil)
        }
        alertController.addAction(cancelAction)

        // Show the alert
        present(alertController, animated: true, completion: nil)
    }

    @objc private func onBindAssetTapped() {
        guard let assetId = editAssetId.text else {
            let toastView = ToastView(message: "Please enter asset id")
            toastView.show()
            return
        }

        AssetTracking.shared.bindAsset(assetId: assetId) { responseCode in
            let toastView = ToastView(message: "Bind asset successfully with id: " + assetId)
            toastView.show()

            self.userDefaults.set(true, forKey: Constants.IS_NOT_FIRST_INSTALLATION_KEY)
            self.userDefaults.set(assetId, forKey: Constants.LAST_BIND_ASSET_ID_KEY)

            if self.isLauncherScreen() {
                self.lanchToHomeView()
            } else {
                self.navigationController?.popViewController(animated: true)
            }
        } errorHandler: { error in
            let errorMessage = error.localizedDescription

            if (errorMessage.contains(AssetTrackingApiExceptionType.UN_UPLOADED_LOCATION_DATA.rawValue)) {
                self.showForceBindDialog(assetId: assetId, warningMessage: errorMessage)
            } else {
                let toastView = ToastView(message: "Bind asset failed: " + errorMessage)
                toastView.show()
            }
        }

    }

}
extension SetProfileViewController{
    func hideKeyboardWhenTappedAround() {
        let tap: UITapGestureRecognizer = UITapGestureRecognizer(target: self, action: #selector(dismissKeyboard))
        tap.cancelsTouchesInView = false
        view.addGestureRecognizer(tap)
    }

    @objc private func dismissKeyboard() {
        view.endEditing(true)
    }

}
extension SetProfileViewController: UITextFieldDelegate {
    public func textFieldDidChangeSelection(_ textField: UITextField) {
        let text = textField.text?.trimmingCharacters(in: CharacterSet.whitespaces) ?? ""
        if textField == self.editCustomId {
            customId = text
        } else if textField == self.editAssetName {
            assetName = text
        } else if textField == self.editAssetDescription {
            assetDescription = text
        } else if textField == self.editAssetAttributes {
            assetAttributes = text
        } else if textField == self.editAssetId {
            assetId = text
        }
    }

    func textFieldShouldReturn(_ textField: UITextField) -> Bool {
        textField.resignFirstResponder()
        return true
    }
}
```

**ExtendedTrackingViewController** [view source](https://github.com/nextbillion-ai/nb-asset-tracking-ios-demo/blob/main/AssetTrackingExample/ExtendedTrackingViewController.swift)

```swift
class ExtendedTrackingViewController: UIViewController, AssetTrackingCallback {
    @IBOutlet weak var locationInfo: UILabel!
    @IBOutlet weak var trackingStatus: UILabel!
    @IBOutlet weak var trackingModeSelector: UISegmentedControl!
    @IBOutlet weak var startTracking: UIButton!
    @IBOutlet weak var stopTracking: UIButton!
    @IBOutlet weak var createAsset: UIButton!
    @IBOutlet weak var viewDataLogs: UIButton!
    var assetTracking: AssetTracking = AssetTracking.shared

    override func viewDidLoad() {
        super.viewDidLoad()
        assetTracking.initialize(apiKey: "YOUR_API_KEY")

        assetTracking.delegate = self

        startTracking.setTitle("Start Tracking", for: .normal)
        startTracking.setTitleColor(.white, for: .normal)
        startTracking.layer.cornerRadius = 10
        startTracking.layer.backgroundColor = UIColor.systemBlue.cgColor

        stopTracking.setTitle("Stop Tracking", for: .normal)
        stopTracking.setTitleColor(.white, for: .normal)
        stopTracking.layer.cornerRadius = 10
        stopTracking.layer.backgroundColor = UIColor.systemBlue.cgColor

        bindExistingAssetId()
        setUpButtons()
        updateTrackingStatus()
    }

    override func viewWillAppear(_ animated: Bool) {
        self.navigationController?.setNavigationBarHidden(true, animated: true)
    }

    private func bindExistingAssetId(){
        let assetId = UserDefaults.standard.string(forKey: Constants.LAST_BIND_ASSET_ID_KEY) ?? ""

        if(!assetId.isEmpty) {
            AssetTracking.shared.bindAsset(assetId: assetId) { responseCode in
                let toastView = ToastView(message: "Bind asset successfully with id: " + assetId)
                toastView.show()
            } errorHandler: { error in
                let errorMessage = error.localizedDescription
                let toastView = ToastView(message: "Bind asset failed: " + errorMessage)
                toastView.show()
            }
        }
    }

    private func setUpButtons(){
        createAsset.setTitleColor(.white, for: .normal)
        createAsset.layer.cornerRadius = 10
        createAsset.layer.backgroundColor = UIColor.systemBlue.cgColor

        viewDataLogs.setTitleColor(.systemBlue, for: .normal)
        viewDataLogs.layer.cornerRadius = 10
        viewDataLogs.layer.borderWidth = 1.0
        viewDataLogs.layer.borderColor = UIColor.systemBlue.cgColor

        createAsset.addTarget(self, action: #selector(onCreateAssetTapped), for: .touchUpInside)

        viewDataLogs.addTarget(self, action: #selector(onViewDataLogsTapped), for: .touchUpInside)
    }

    @objc private func onCreateAssetTapped() {
        if assetTracking.isRunning() {
            let toastView = ToastView(message: "please stop tracking before editing asset profile")
            toastView.show()
            return
        }

        let setProfileViewController = UIStoryboard(name: "Main", bundle: nil).instantiateViewController(withIdentifier: "SetProfileViewController") as! SetProfileViewController
        self.navigationController?.pushViewController(setProfileViewController, animated: true)
    }

    @objc private func onViewDataLogsTapped() {
        let dataUploadLogVC = UIStoryboard(name: "Main", bundle: nil).instantiateViewController(withIdentifier: "DataUploadLogViewController") as! DataUploadLogViewController
        self.navigationController?.pushViewController(dataUploadLogVC, animated: true)
    }


    @IBAction func startTracking(_ sender: Any) {
        let assetId = assetTracking.getAssetId()

        if (assetId.isEmpty){
            let toastView = ToastView(message: "Please bind asset first before start tracking!")
            toastView.show()
            return
        }

        assetTracking.startTracking()
    }

    @IBAction func stopTracking(_ sender: Any) {
        locationInfo.text = ""
        assetTracking.stopTracking()
    }


    @IBAction func onTrackingModeChanged(_ sender: Any) {
        var trackingMode: TrackingMode = TrackingMode.ACTIVE
        switch trackingModeSelector.selectedSegmentIndex {
        case 0:
            trackingMode = .ACTIVE
        case 1:
            trackingMode = .BALANCED
        case 2:
            trackingMode = .PASSIVE
        default:
            break
        }

        let locationConfig = LocationConfig(trackingMode: trackingMode)
        assetTracking.updateLocationConfig(config: locationConfig)
    }

    func onTrackingStart(assetId: String) {
        updateTrackingStatus()
    }

    func onTrackingStop(assetId: String, trackingDisableType: TrackingDisableType) {
        updateTrackingStatus()
    }

    func onLocationSuccess(location: CLLocation) {
        locationInfo.text = """
                        --------- Location Info ---------
            Latitude: \(location.coordinate.latitude)
            Longitude: \(location.coordinate.longitude)
            Altitude: \(location.altitude)
            Accuracy: \(location.horizontalAccuracy)
            Speed: \(location.speed)
            Bearing: \(location.course)
            Time: \(location.timestamp)
            """
    }

    func showLocationAlert() {
        let alert = UIAlertController(title: "Location Services Disabled", message: "To enable location services, please go to Settings > Privacy > Location Services.", preferredStyle: .alert)
        alert.addAction(UIAlertAction(title: "OK", style: .cancel, handler: nil))

        present(alert, animated: true, completion: nil)
    }

    func onLocationFailure(error: Error) {
    }

    func onLocationServiceOff() {
        showLocationAlert()
    }


    func updateTrackingStatus() {
        trackingStatus.text = "Tracking Status: \(assetTracking.isRunning() ? "ON" : "OFF")"
        if !assetTracking.isRunning() {
            locationInfo.text = ""
        }
    }

}
```

Upon executing the code example provided above, your app's appearance will resemble the following snippet:

| ![documentation image](https://static.nextbillion.io/docs-next/docs/live-tracking/ios-tracking/asset-tracking-extended-1.webp) | ![documentation image](https://static.nextbillion.io/docs-next/docs/live-tracking/ios-tracking/asset-tracking-extended-2.webp) |
| ------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------ |
| **Asset Profile Page**                                                                                                         | **Asset Tracking Page**                                                                                                        |

### Code Highlights

The **SetProfileViewController** class inherits from the UIViewController class, which is the base class for all view controllers in iOS.

- The class has several outlet properties: **editCustomId**, **editAssetName**, **editAssetDescription**, **editAssetAttributes**, **lastAssetId**, **createAsset**, and **bindAsset**. These properties are linked to the corresponding UI elements in the view controller's storyboard.
- **createAsset()**: This method creates a new asset with the specified custom ID, asset name, description, and attributes. The method calls the AssetTracking.shared.createAsset() method to make the API request.
- **bindAsset()**: This method binds the current view controller to the specified asset ID. The method calls the **AssetTracking.shared.bindAsset()** method to make the API request.
- **saveAssetProfile()**: This method saves the asset profile to the user's device. The method updates the values of the customId, assetName, assetDescription, assetAttributes, and assetId properties, and then calls the userDefaults.set() method to save the values to the user's device.
- **onCreateAssetTapped()**: This method is called when the user taps on the create asset button. The method checks if the asset name is empty, and if it is, it displays a toast message. Otherwise, it creates a new asset and saves the asset profile.
- **onBindAssetTapped()**: This method is called when the user taps on the bind asset button. The method checks if the asset ID is empty, and if it is, it displays a toast message. Otherwise, it binds the current view controller to the asset and saves the asset profile.
- **dismissKeyboard()**: This method dismisses the keyboard. The method calls the view.endEditing(true) method to dismiss the keyboard.

Here is a more detailed explanation of some of the key concepts in the code:

- **UITextFieldDelegate**: This protocol is adopted by classes that want to receive notifications when a text field changes.
- **UIGestureRecognizerDelegate**: This protocol is adopted by classes that want to receive notifications when a gesture recognizer is triggered.
- **AssetTrackingApiExceptionType**: This enum defines the possible types of errors that can occur when calling the Asset Tracking API.

The **ViewController** class inherits from the UIViewController class, which is the base class for all view controllers in iOS.

- The class has several outlet properties: **locationInfo**, **trackingStatus**, **trackingModeSelector**, **startTracking**, **stopTracking**, **createAsset**, and vie\*\*wDataLogs. These properties are linked to the corresponding UI elements in the view controller's storyboard.
- **startTracking()**: This method starts tracking the asset. The method calls the assetTracking.startTracking() method.
- **stopTracking()**: This method stops tracking the asset. The method calls the assetTracking.stopTracking() method.
- **onTrackingStart()**: This method is called when tracking starts. The method updates the trackingStatus label.
- **onTrackingStop()**: This method is called when tracking stops. The method updates the trackingStatus label.
- **onLocationSuccess()**: This method is called when a new location is received. The method updates the locationInfo label.
- **onLocationFailure()**: This method is called when an error occurs while getting the location. The method does nothing in this case.
- **onLocationServiceOff()**: This method is called when location services are turned off. The method displays an alert to the user.

Here is a more detailed explanation of some of the key concepts in the code:

- **AssetTracking**: This class is responsible for tracking assets.
- **TrackingMode**: This enum defines the three possible tracking modes: ACTIVE, BALANCED, and PASSIVE.
- **TrackingDisableType**: This enum defines the possible reasons why tracking was stopped.
- **CLLocation**: This class represents a location on Earth.
- **UIAlertController**: This class is used to display alerts.

# Get AssetTrackingCallback ViewController

This example will provide step-by-step guidance on:

- **Initializing Configurations with Default Values**: Learn how to set up all configurations using default values, simplifying the integration process and ensuring a seamless start.
- **Creating and Binding a Simple Asset while Initiating Tracking**: Discover how to create a basic asset, bind it to your application, and kickstart the tracking process, enabling real-time monitoring of asset locations.
- **Receiving AssetTrackingCallback in Your ViewController**: Understand how to receive and utilize AssetTrackingCallback in your ViewController, enabling you to respond to tracking events and location updates effectively.

For all code examples, refer to [iOS Tracking Android Code Examples](https://github.com/nextbillion-ai/nb-asset-tracking-ios-demo)

**GetAssetCallbackViewController** [view source](https://github.com/nextbillion-ai/nb-asset-tracking-ios-demo/blob/main/AssetTrackingExample/GetAssetCallbackViewController.swift)

```swift
class GetAssetCallbackViewController: UIViewController, AssetTrackingCallback {
    @IBOutlet weak var startTrackingBtn: UIButton!
    @IBOutlet weak var stopTrackingBtn: UIButton!
    @IBOutlet weak var trackingStatus: UILabel!
    @IBOutlet weak var locationInfo: UILabel!

    override func viewDidLoad() {
        super.viewDidLoad()
        AssetTracking.shared.initialize(apiKey: "YOUR_API_KEY")

        // Add this to confirm the protocol and receive callbacks
        AssetTracking.shared.delegate = self

        createAndBindAsset()
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

    override func viewDidDisappear(_ animated: Bool) {
        super.viewDidDisappear(animated)
        AssetTracking.shared.stopTracking()
    }

    func initView(){
        startTrackingBtn.addTarget(self, action: #selector(startTracking), for: .touchUpInside)
        stopTrackingBtn.addTarget(self, action: #selector(stopTracking), for: .touchUpInside)
        trackingStatus.text = ""
        locationInfo.text = ""
    }

    func createAndBindAsset(){
        let attributes = ["attribute 1": "test 1", "attribute 2": "test 2"]
        let assetProfile: AssetProfile = AssetProfile.init(customId: UUID().uuidString.lowercased(), assetDescription: "testDescription", name: "testName", attributes: attributes)

        AssetTracking.shared.createAsset(assetProfile: assetProfile) { assetCreationResponse in
            let assetId = assetCreationResponse.data.id

            let toastView = ToastView(message: "Create asset successfully with id: " + assetId)
            toastView.show()

            self.bindAsset(assetId: assetId)
        } errorHandler: { error in
            let errorMessage = error.localizedDescription
            let toastView = ToastView(message: "Create asset failed: " + errorMessage)
            toastView.show()
        }
    }

    func bindAsset(assetId: String) {
        AssetTracking.shared.bindAsset(assetId: assetId) { responseCode in
            let toastView = ToastView(message: "Bind asset successfully with id: " + assetId)
            toastView.show()
        } errorHandler: { error in
            let errorMessage = error.localizedDescription
            let toastView = ToastView(message: "Bind asset failed: " + errorMessage)
            toastView.show()
        }
    }

    @objc func startTracking() {
        AssetTracking.shared.startTracking()
    }

    @objc func stopTracking() {
        AssetTracking.shared.stopTracking()
    }

    func onTrackingStart(assetId: String) {
        updateTrackingStatus()
    }

    func onTrackingStop(assetId: String, trackingDisableType: NBAssetTracking.TrackingDisableType) {
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

    func onLocationFailure(error: Error) {
        locationInfo.text = "Failed to get location data: " + error.localizedDescription
    }

    func onLocationServiceOff() {
        showLocationAlert()
    }

    func showLocationAlert() {
        let alert = UIAlertController(title: "Location Services Disabled", message: "To enable location services, please go to Settings > Privacy > Location Services.", preferredStyle: .alert)
        alert.addAction(UIAlertAction(title: "OK", style: .cancel, handler: nil))

        present(alert, animated: true, completion: nil)
    }

    func updateTrackingStatus() {
        let assetTrackingRunning = AssetTracking.shared.isRunning()
        trackingStatus.text = "Tracking Status: \(assetTrackingRunning ? "ON" : "OFF")"
        if !assetTrackingRunning {
            locationInfo.text = ""
        }
    }
}
```

Upon executing the code example provided above, your app's appearance will resemble the following snippet:

![documentation image](/docs/live-tracking/ios-tracking/get-assettracking-call-backview-controller.webp)

### Code Highlights

The above code snippet is a class inherited from the UIViewController class, which is the base class for all view controllers in iOS.

- The class also conforms to the AssetTrackingCallback protocol, which means that the class will receive callbacks from the AssetTracking class.
- The class has four outlet properties: startTrackingBtn, stopTrackingBtn, trackingStatus, and locationInfo. These properties are linked to the corresponding UI elements in the view controller's storyboard.
- The class has two methods to start and stop tracking the asset. These methods call the AssetTracking.shared.startTracking() and AssetTracking.shared.stopTracking() methods, respectively.
- The class has six methods to handle the callbacks from the AssetTracking class. These methods are:
  - **onTrackingStart(assetId: String)**: This method is called when the tracking for the asset starts.
  - **onTrackingStop(assetId: String, trackingDisableType: NBAssetTracking.TrackingDisableType)**: This method is called when the tracking for the asset stops.
  - **onLocationSuccess(location: CLLocation)**: This method is called when the location of the asset is successfully retrieved.
  - **onLocationFailure(error: Error)**: This method is called when the location of the asset cannot be retrieved.
  - **onLocationServiceOff()**: This method is called when the location services are turned off.
  - **showLocationAlert()**: This method shows an alert to the user to turn on the location services.

Here is a more detailed explanation of some of the key concepts in the code:

- **AssetTracking**: This is the class that is responsible for tracking assets.
- **AssetTrackingCallback**: This is a protocol that must be adopted by classes that want to receive callbacks from the AssetTracking class.
- **CLLocation**: This is a class that represents a location on Earth.

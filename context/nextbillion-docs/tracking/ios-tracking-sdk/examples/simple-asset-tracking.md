# Simple Asset Tracking Example

This example provides step by step guidance on:

1.  **Initializing Configurations with Default Values**: Learn how to set up the SDK with default configuration settings, ensuring a straightforward integration process.
2.  **Creating and Binding a Simple Asset**: Discover how to create and bind an asset within your application, enabling you to associate assets with your tracking system.
3.  **Starting Tracking and Uploading Location Data with Default Values**: Gain insights into how to initiate tracking and the automatic uploading of location data using default parameters, simplifying the process of monitoring asset locations.

For all code examples, refer to [iOS Tracking Code Examples](https://github.com/nextbillion-ai/nb-asset-tracking-ios-demo)

**SimpleTrackingViewController** [view source](https://github.com/nextbillion-ai/nb-asset-tracking-ios-demo/blob/main/AssetTrackingExample/SimpleTrackingViewController.swift)

```swift
class SimpleTrackingViewController: UIViewController {
    @IBOutlet weak var startTracking: UIButton!
    @IBOutlet weak var assetId: UILabel!
    @IBOutlet weak var trackingStatus: UILabel!

    private var mAssetId: String = ""

    override func viewDidLoad() {
        super.viewDidLoad()
        AssetTracking.shared.initialize(apiKey: "YOUR_API_KEY")

        initView()

        createAsset()
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

    func initView() {
        startTracking.addTarget(self, action: #selector(bindAssetAndStartTracking), for: .touchUpInside)
        assetId.text = ""
        trackingStatus.text = ""
    }

    func createAsset(){
        let attributes = ["attribute 1": "test 1", "attribute 2": "test 2"]
        let assetProfile: AssetProfile = AssetProfile.init(customId: UUID().uuidString.lowercased(), assetDescription: "testDescription", name: "testName", attributes: attributes)

        AssetTracking.shared.createAsset(assetProfile: assetProfile) { assetCreationResponse in
            let assetId = assetCreationResponse.data.id

            let toastView = ToastView(message: "Create asset successfully with id: " + assetId)
            toastView.show()

            self.mAssetId = assetId
            self.assetId.text = "asset id is: " + assetId
        } errorHandler: { error in
            let errorMessage = error.localizedDescription
            let toastView = ToastView(message: "Create asset failed: " + errorMessage)
            toastView.show()
        }
    }

    @objc func bindAssetAndStartTracking() {
        AssetTracking.shared.bindAsset(assetId: mAssetId) { responseCode in
            let toastView = ToastView(message: "Bind asset successfully with id: " + self.mAssetId)
            toastView.show()
            AssetTracking.shared.startTracking()
            self.trackingStatus.text = "Asset Tracking is running"
        } errorHandler: { error in
            let errorMessage = error.localizedDescription
            let toastView = ToastView(message: "Bind asset failed: " + errorMessage)
            toastView.show()
        }
    }
}
```

Upon executing the code example provided above, your app's appearance will resemble the following snippet:

![documentation image](/docs/live-tracking/ios-tracking/simple-asset-tracking-example.webp)

### Code Highlights

The above code snippet is a class inherited from the UIViewController class, which is the base class for all view controllers in iOS.

- The class has three outlet properties: startTracking, assetId, and trackingStatus. These properties are linked to the corresponding UI elements in the view controller's storyboard.
- The class has a private variable called mAssetId, which stores the ID of the asset that is being tracked.
- The **viewDidLoad**() method is called when the view controller is first loaded. In this method, the class initializes the AssetTracking shared instance and calls the **createAsset**() method to create a new asset.
- The **viewWillAppear**() and **viewWillDisappear**() methods are called when the view controller is about to appear or disappear, respectively. In these methods, the class hides or shows the navigation bar, depending on the view controller's visibility.
- The **viewDidDisappear**() method is called when the view controller has disappeared. In this method, the class stops tracking the asset.
- The **initView**() method is called to initialize the view controller's user interface. In this method, the class adds a target-action listener to the startTracking button to start tracking the asset when the button is tapped.
- The **createAsset**() method creates a new asset with the specified attributes. The method calls the **AssetTracking.shared.createAsset**() method to make the API request. The method also handles the success and failure cases of the API request.
- The **bindAssetAndStartTracking**() method binds the asset to the current view controller and starts tracking it. The method calls the **AssetTracking.shared.bindAsset**() method to make the API request. The method also handles the success and failure cases of the API request.

Here is a more detailed explanation of some of the key concepts in the code:

- AssetTracking: This is the shared instance of the AssetTracking class, which is responsible for tracking assets.
- NBAssetTrackingApiFetcher: This is a class that provides methods for making API requests to the Asset Tracking API.
- ToastView: This is a class that displays a short message on the screen.

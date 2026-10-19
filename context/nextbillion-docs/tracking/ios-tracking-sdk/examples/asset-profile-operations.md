# Asset profile Operations

This example demonstrates:

- **Creating an Asset**: Learn how to generate a new asset within your application, enabling the introduction of new assets into your tracking system.
- **Binding an Existing Asset ID to the Current Device**: Discover the process of associating an existing asset ID with the device you're currently using, facilitating tracking and management of that asset.
- **Updating the Current Asset Profile**: Gain insights into how to modify the profile of an asset, ensuring that the asset's information remains accurate and up-to-date.
- **Retrieving Asset Details for the Bound Asset ID**: Learn how to access and retrieve detailed information about an asset that has been successfully bound to the current device, enabling comprehensive asset management.

For all code examples, refer to [iOS Tracking Android Code Examples](https://github.com/nextbillion-ai/nb-asset-tracking-ios-demo)

**AssetOperationViewController** [view source](https://github.com/nextbillion-ai/nb-asset-tracking-ios-demo/blob/main/AssetTrackingExample/AssetOperationViewController.swift)

```swift
class AssetOperationViewController: UIViewController {
    @IBOutlet weak var createNewAssetBtn: UIButton!
    @IBOutlet weak var bindAssetBtn: UIButton!
    @IBOutlet weak var updateAssetBtn: UIButton!
    @IBOutlet weak var getAssetInfoBtn: UIButton!
    @IBOutlet weak var assetInfo: UILabel!

    private var assetId = ""
    private var assetName = "testName"
    private var assetDescription = "testDescription"
    private var assetAttributes = ["attribute 1": "test 1", "attribute 2": "test 2"]

    override func viewDidLoad() {
        super.viewDidLoad()
        AssetTracking.shared.initialize(apiKey: "YOUR_API_KEY")

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
        createNewAssetBtn.addTarget(self, action: #selector(createAsset), for: .touchUpInside)
        bindAssetBtn.addTarget(self, action: #selector(bindAsset), for: .touchUpInside)
        updateAssetBtn.addTarget(self, action: #selector(updateAsset), for: .touchUpInside)
        getAssetInfoBtn.addTarget(self, action: #selector(getAssetInfo), for: .touchUpInside)
        assetInfo.text = ""
    }

    @objc func createAsset(){
        let assetProfile: AssetProfile = AssetProfile.init(customId: UUID().uuidString.lowercased(), assetDescription: assetDescription, name: assetName, attributes: assetAttributes)

        AssetTracking.shared.createAsset(assetProfile: assetProfile) { assetCreationResponse in
            let assetId = assetCreationResponse.data.id
            self.assetId = assetId

            let toastView = ToastView(message: "Create asset successfully with id: " + self.assetId)
            toastView.show()

            do {
                let encoder = JSONEncoder()
                let jsonData = try encoder.encode(assetProfile)
                if let jsonString = String(data: jsonData, encoding: .utf8) {
                    self.assetInfo.text = jsonString
                }
            } catch {
                print("Error encoding JSON: \(error)")
            }

        } errorHandler: { error in
            let errorMessage = error.localizedDescription
            let toastView = ToastView(message: "Create asset failed: " + errorMessage)
            toastView.show()
        }
    }

    @objc func bindAsset(){
        AssetTracking.shared.bindAsset(assetId: self.assetId) { responseCode in
            let toastView = ToastView(message: "Bind asset successfully with id: " + self.assetId)
            toastView.show()
        } errorHandler: { error in
            let errorMessage = error.localizedDescription
            let toastView = ToastView(message: "Bind asset failed: " + errorMessage)
            toastView.show()
        }
    }

    @objc func updateAsset() {
        assetName = "newName"
        assetDescription = "newDescription"

        let assetProfile: AssetProfile = AssetProfile.init(customId: assetId, assetDescription: assetDescription, name: assetName, attributes: assetAttributes)

        AssetTracking.shared.updateAsset(assetProfile: assetProfile) {responseCode in
            let toastView = ToastView(message: "update asset profile successfully with id: " + self.assetId)
            toastView.show()

            do {
                let encoder = JSONEncoder()
                let jsonData = try encoder.encode(assetProfile)
                if let jsonString = String(data: jsonData, encoding: .utf8) {
                    self.assetInfo.text = jsonString
                }
            } catch {
                print("Error encoding JSON: \(error)")
            }

        } errorHandler: {
            error in
            let errorMessage = error.localizedDescription
            let toastView = ToastView(message: "Update asset profile failed: " + errorMessage)
            toastView.show()
        }
    }

    @objc func getAssetInfo(){
        AssetTracking.shared.getAssetDetail(){getAssetResponse in
            let data: GetAssetResponseData = getAssetResponse.data
            do {
                let encoder = JSONEncoder()
                let jsonData = try encoder.encode(data)
                if let jsonString = String(data: jsonData, encoding: .utf8) {
                    self.assetInfo.text = jsonString
                }
            } catch {
                print("Error encoding JSON: \(error)")
            }
        } errorHandler: { error in
            let errorMessage = error.localizedDescription
            let toastView = ToastView(message: "Get asset profile failed: " + errorMessage)
            toastView.show()
        }
    }
}
```

Upon executing the code example provided above, your app's appearance will resemble the following snippet:

![documentation image](/docs/live-tracking/ios-tracking/asset-profile-operations.webp)

### Code Highlights

The above code snippet is a class inherited from the UIViewController class, which is the base class for all view controllers in iOS.

- The class has four outlet properties: **createNewAssetBtn**, **bindAssetBtn**, **updateAssetBtn**, and **getAssetInfoBtn**. These properties are linked to the corresponding UI elements in the view controller's storyboard.
- The class has four private variables: **assetId**, **assetName**, **assetDescription**, and **assetAttributes**. These variables store the **asset's** ID, name, description, and attributes.
- The **viewDidLoad()** method is called when the view controller is first loaded. In this method, the class initializes the AssetTracking shared instance and calls the **initView()** method to initialize the view controller's user interface.
- The **viewWillAppear()** and **viewWillDisappear()** methods are called when the view controller is about to appear or disappear, respectively. In these methods, the class hides or shows the navigation bar, depending on the view controller's visibility.
- The **initView()** method is called to initialize the view controller's user interface. In this method, the class adds target-action listeners to the four buttons to perform the corresponding operations when the buttons are tapped.
- The **createAsset()** method creates a new asset with the specified attributes. The method calls the **AssetTracking.shared.createAsset()** method to make the API request. The method also handles the success and failure cases of the API request.
- The **bindAsset()** method binds the asset to the current view controller. The method calls the **AssetTracking.shared.bindAsset()** method to make the API request. The method also handles the success and failure cases of the API request.
- The **updateAsset()** method updates the asset's profile with the specified name and description. The method calls the **AssetTracking.shared.updateAsset()** method to make the API request. The method also handles the success and failure cases of the API request.
- The **getAssetInfo()** method gets the asset's profile. The method calls the **AssetTracking.shared.getAssetDetail()** method to make the API request. The method also handles the success and failure cases of the API request.

Here is a more detailed explanation of some of the key concepts in the code:

- **AssetTracking**: This is a class that provides methods for making API requests to the Asset Tracking API.
- **ToastView**: This is a class that displays a short message on the screen.

# Asset profile Operations

This example demonstrates:

- **Creating an Asset**: Learn how to generate a new asset within your application, enabling the introduction of new assets into your tracking system.
- **Binding an Existing Asset ID to the Current Device**: Discover the process of associating an existing asset ID with the device you're currently using, facilitating tracking and management of that asset.
- **Updating the Current Asset Profile**: Gain insights into how to modify the profile of an asset, ensuring that the asset's information remains accurate and up-to-date.
- **Retrieving Asset Details for the Bound Asset ID**: Learn how to access and retrieve detailed information about an asset that has been successfully bound to the current device, enabling comprehensive asset management.

For all code examples, refer to [Asset Tracking Android Code Examples](https://github.com/nextbillion-ai/nb-asset-tracking-android-demo)

**activity_asset_profile_operation.xml** [view source](https://github.com/nextbillion-ai/nb-asset-tracking-android-demo/blob/main/app/src/main/res/layout/activity_asset_profile_operation.xml)

```xml
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
   xmlns:app="http://schemas.android.com/apk/res-auto"
   xmlns:tools="http://schemas.android.com/tools"
   android:layout_width="match_parent"
   android:layout_height="match_parent"
   android:orientation="vertical"
   android:padding="10dp"
   tools:context=".codeexample.AssetProfileOperations">

   <Button
       android:id="@+id/create_asset"
       android:layout_width="wrap_content"
       android:layout_height="wrap_content"
       android:text="@string/create_asset" />

   <Button
       android:id="@+id/bind_asset_to_device"
       android:layout_width="wrap_content"
       android:layout_height="wrap_content"
       android:text="@string/bind_asset" />

   <Button
       android:id="@+id/update_asset"
       android:layout_width="wrap_content"
       android:layout_height="wrap_content"
       android:text="@string/update_asset" />

   <Button
       android:id="@+id/get_asset_detail"
       android:layout_width="wrap_content"
       android:layout_height="wrap_content"
       android:text="@string/get_asset_detail" />

   <TextView
       android:id="@+id/asset_detail"
       android:layout_width="wrap_content"
       android:layout_height="wrap_content"
       android:layout_marginTop="10dp" />

</LinearLayout>
```

**AssetProfileOperations** [view source](https://github.com/nextbillion-ai/nb-asset-tracking-android-demo/blob/main/app/src/main/java/ai/nextbillion/nbassettrackingdemo/AssetProfileOperations.kt)

```kotlin
class AssetProfileOperations : AppCompatActivity() {
    private var assetId = ""
    private var assetName = "testName"
    private var assetDescription = "testDescription"
    private var assetAttributes: Map<String, String> = mapOf("attribute 1" to "test 1", "attribute 2" to "test 2")

    private lateinit var createAssetButton: Button
    private lateinit var bindAssetButton: Button
    private lateinit var updateAssetButton: Button
    private lateinit var getAssetDetailButton: Button
    private lateinit var assetDetailView: TextView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_asset_profile_operation)
        initView()

        // initialize the Asset Tracking SDK
        initialize( "PUT YOUR API KEY HERE")
    }

    private fun initView() {
        createAssetButton = findViewById(R.id.create_asset)
        createAssetButton.setOnClickListener {
            createAsset()
        }

        bindAssetButton = findViewById(R.id.bind_asset_to_device)
        bindAssetButton.setOnClickListener {
            onBindAsset()
        }

        updateAssetButton = findViewById(R.id.update_asset)
        updateAssetButton.setOnClickListener {
            updateAsset()
        }

        getAssetDetailButton = findViewById(R.id.get_asset_detail)
        getAssetDetailButton.setOnClickListener {
            getAssetDetail()
        }

        assetDetailView = findViewById(R.id.asset_detail)
    }

    private fun createAsset() {
        val assetProfile = AssetProfile.Builder().setCustomId(UUID.randomUUID().toString()).setName(assetName)
            .setDescription(assetDescription).setAttributes(assetAttributes).build()

        createNewAsset(assetProfile, object : AssetApiCallback<AssetCreationResponse> {
            @SuppressLint("SetTextI18n")
            override fun onSuccess(result: AssetCreationResponse) {
                assetId = result.data.id
                Toast.makeText(
                    this@AssetProfileOperations,
                    "create asset successfully with asset id: $assetId",
                    Toast.LENGTH_LONG
                ).show()

                val assetJsonString = Gson().toJson(assetProfile)
                assetDetailView.text = "asset profile is: $assetJsonString"
            }

            override fun onFailure(exception: Exception) {
                val exceptionMessage = exception.message ?: ""
                Toast.makeText(
                    this@AssetProfileOperations,
                    "update asset profile failed with error: $exceptionMessage",
                    Toast.LENGTH_LONG
                ).show()
            }
        })
    }

    private fun onBindAsset() {
        bindAsset(assetId, object : AssetApiCallback<Unit> {
            override fun onSuccess(result: Unit) {
                Toast.makeText(
                    this@AssetProfileOperations,
                    String.format(
                        "bind asset successfully with assetId: %s",
                        assetId
                    ),
                    Toast.LENGTH_LONG
                ).show()
            }

            override fun onFailure(exception: Exception) {
                val exceptionMessage = exception.message ?: ""
                Toast.makeText(
                    this@AssetProfileOperations,
                    "bind asset failed: $exceptionMessage",
                    Toast.LENGTH_LONG
                ).show()
            }
        })
    }

    // Operation of updating asset can only be done after binding to an asset
    private fun updateAsset() {
        assetName = "newName"
        assetDescription = "newDescription"
        val assetProfile = AssetProfile.Builder().setCustomId(assetId).setName(assetName)
            .setDescription(assetDescription).setAttributes(assetAttributes).build()

        updateAssetInfo(assetProfile, object : AssetApiCallback<Unit> {
            @SuppressLint("SetTextI18n")
            override fun onSuccess(result: Unit) {
                Toast.makeText(
                    this@AssetProfileOperations,
                    "update asset profile successfully",
                    Toast.LENGTH_LONG
                ).show()

                val assetJsonString = Gson().toJson(assetProfile)
                assetDetailView.text = "asset profile is: $assetJsonString"
            }

            override fun onFailure(exception: Exception) {
                val exceptionMessage = exception.message ?: ""
                Toast.makeText(
                    this@AssetProfileOperations,
                    "update asset profile failed with error: $exceptionMessage",
                    Toast.LENGTH_LONG
                ).show()
            }

        })
    }

    // User can only get current asset info, and this operation can be done only after binding to an asset id
    private fun getAssetDetail() {
        getAssetInfo(object : AssetApiCallback<GetAssetResponse> {
            @SuppressLint("SetTextI18n")
            override fun onSuccess(result: GetAssetResponse) {
                val asset: Asset = result.data.asset
                val assetJsonString = Gson().toJson(asset)
                assetDetailView.text = "full asset info: $assetJsonString"
            }

            override fun onFailure(exception: Exception) {
                val exceptionMessage = exception.message ?: ""
                Toast.makeText(
                    this@AssetProfileOperations,
                    "bind asset failed: $exceptionMessage",
                    Toast.LENGTH_LONG
                ).show()
            }
        })
    }

}
```

Upon executing the code example provided above, your app's appearance will resemble the following snippet:

![documentation image](/docs/live-tracking/android-tracking/asset-profile-operations.webp)

### Code Highlights

The above code snippet is for an Android activity that demonstrates how to perform asset profile operations using the Asset Tracking SDK. The activity has the following main functionalities:

1.  Initialize the Asset Tracking SDK.
2.  Create an asset profile.
3.  Bind the asset profile to the device.
4.  Update the asset profile.
5.  Get the asset profile details.

The following is a description of each step:

1.  To initialize the Asset Tracking SDK, the activity calls the **initialize()** method with your API key.
2.  To create an asset profile, the activity creates an AssetProfile object and sets its properties. The AssetProfile object specifies the asset's custom ID, name, description, and attributes.
3.  To bind the asset profile to the device, the activity calls the **bindAsset()** method with the asset ID.
4.  To update the asset profile, the activity creates a new AssetProfile object with the updated properties and calls the **updateAssetInfo()** method.
5.  To get the asset profile details, the activity calls the **getAssetInfo()** method.

The code snippet also includes a few helper functions:

- **createNewAsset()**: This function creates a new asset and returns the asset ID.
- **bindAsset()**: This function binds an asset profile to the device.
- **updateAssetInfo()**: This function updates an asset profile.
- **getAssetInfo()**: This function gets the details of an asset profile.

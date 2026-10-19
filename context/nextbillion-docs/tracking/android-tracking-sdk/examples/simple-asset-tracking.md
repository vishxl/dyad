# Simple Asset Tracking

This example provides step by step guidance on:

1.  **Initializing Configurations with Default Values**: Learn how to set up the SDK with default configuration settings, ensuring a straightforward integration process.
2.  **Creating and Binding a Simple Asset**: Discover how to create and bind an asset within your application, enabling you to associate assets with your tracking system.
3.  **Starting Tracking and Uploading Location Data with Default Values**: Gain insights into how to initiate tracking and the automatic uploading of location data using default parameters, simplifying the process of monitoring asset locations.

For all code examples, refer to [Asset Tracking Android Code Examples](https://github.com/nextbillion-ai/nb-asset-tracking-android-demo)

**activity_simple_tracking.xml** [view source](https://github.com/nextbillion-ai/nb-asset-tracking-android-demo/blob/main/app/src/main/res/layout/activity_simple_tracking.xml)

```xml
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
   xmlns:app="http://schemas.android.com/apk/res-auto"
   xmlns:tools="http://schemas.android.com/tools"
   android:layout_width="match_parent"
   android:layout_height="match_parent"
   android:orientation="vertical"
   android:padding="10dp"
   tools:context=".codeexample.SimpleTrackingExample">

   <Button
       android:id="@+id/start_tracking_simple"
       android:layout_width="wrap_content"
       android:layout_height="wrap_content"
       android:text="@string/start_tracking"
       />

   <TextView
       android:id="@+id/asset_id_info"
       android:layout_marginTop="10dp"
       android:layout_width="wrap_content"
       android:layout_height="wrap_content"/>

   <TextView
       android:id="@+id/tracking_status_simple"
       android:layout_marginTop="10dp"
       android:layout_width="wrap_content"
       android:layout_height="wrap_content"/>

</LinearLayout>
```

**SimpleTrackingExample** [view source](https://github.com/nextbillion-ai/nb-asset-tracking-android-demo/blob/main/app/src/main/java/ai/nextbillion/nbassettrackingdemo/SimpleTrackingExample.kt)

```kotlin
class SimpleTrackingExample : AppCompatActivity() {
    private lateinit var startTrackingButton: Button
    private lateinit var trackingStatusView: TextView
    private lateinit var assetIdView: TextView

    var permissionsManager: LocationPermissionsManager? = null
    private var assetId = ""

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_simple_tracking)
        initView()

        // initialize the Asset Tracking SDK
         initialize("PUT YOUR API KEY HERE")

        createAsset()
    }

    override fun onDestroy() {
        super.onDestroy()
        // add this to avoid blocking other example, could remove in real usage
        assetTrackingStop()
    }

    private fun initView() {
        startTrackingButton = findViewById(R.id.start_tracking_simple)
        startTrackingButton.setOnClickListener {
            bindAssetAndStartTracking()
        }

        trackingStatusView = findViewById(R.id.tracking_status_simple)
        assetIdView = findViewById(R.id.asset_id_info)
    }

    private fun createAsset() {
        val assetAttributes: Map<String, String> = mapOf("attribute 1" to "test 1", "attribute 2" to "test 2")
        val assetProfile = AssetProfile.Builder().setCustomId(UUID.randomUUID().toString()).setName("testName")
            .setDescription("testDescription").setAttributes(assetAttributes).build()

        createNewAsset(assetProfile, object : AssetApiCallback<AssetCreationResponse> {
            @SuppressLint("SetTextI18n")
            override fun onSuccess(result: AssetCreationResponse) {
                assetId = result.data.id
                Toast.makeText(
                    this@SimpleTrackingExample,
                    "create asset successfully with asset id: $assetId",
                    Toast.LENGTH_LONG
                ).show()

                assetIdView.text = "current asset id is: $assetId"
            }

            override fun onFailure(exception: Exception) {
                Toast.makeText(
                    this@SimpleTrackingExample,
                    "create asset failed with error: " + exception.message,
                    Toast.LENGTH_LONG
                ).show()
            }
        })
    }

    private fun bindAssetAndStartTracking() {
        bindAsset(assetId, object : AssetApiCallback<Unit> {
            @SuppressLint("SetTextI18n")
            override fun onSuccess(result: Unit) {
                Toast.makeText(
                    this@SimpleTrackingExample,
                    String.format(
                        "bind asset successfully with assetId: %s",
                        assetId
                    ),
                    Toast.LENGTH_LONG
                ).show()
                checkPermissionsAndStartTracking()
            }

            override fun onFailure(exception: Exception) {
                val exceptionMessage = exception.message ?: ""
                Toast.makeText(
                    this@SimpleTrackingExample,
                    "bind asset failed: $exceptionMessage",
                    Toast.LENGTH_LONG
                ).show()
            }
        })
    }

    private fun checkPermissionsAndStartTracking() {
        if (LocationPermissionsManager.areAllLocationPermissionGranted(this)) {
            startTracking()
        } else if (!LocationPermissionsManager.isLocationServiceEnabled(this)) {
            showLocationServiceOffDialog()
        } else {
            permissionsManager = LocationPermissionsManager(object : LocationPermissionsListener {
                override fun onExplanationNeeded(permissionsToExplain: List<String>?) {
                    Toast.makeText(
                        this@SimpleTrackingExample, "You need to accept location permissions.",
                        Toast.LENGTH_SHORT
                    ).show()
                }

                override fun onPermissionResult(granted: Boolean) {
                    if (granted) {
                        if (LocationPermissionsManager.isBackgroundLocationPermissionGranted(this@SimpleTrackingExample)) {
                            startTracking()
                        } else {
                            permissionsManager?.requestBackgroundLocationPermissions(this@SimpleTrackingExample)
                        }
                    } else {
                        Toast.makeText(
                            this@SimpleTrackingExample, "You need to accept location permissions.$granted",
                            Toast.LENGTH_SHORT
                        ).show()
                    }
                }
            })
            permissionsManager?.requestLocationPermissions(this)
        }
    }

    @SuppressLint("MissingPermission", "SetTextI18n")
    fun startTracking() {
        assetTrackingStart()
        trackingStatusView.text = "Asset Tracking is running"
    }

    private fun showLocationServiceOffDialog() {
        val alertDialogBuilder = AlertDialog.Builder(this)

        alertDialogBuilder.setTitle("Location Services Disabled")
        alertDialogBuilder.setMessage("To enable location services, please go to Settings > Privacy > Location Services.")

        alertDialogBuilder.setPositiveButton("OK") { dialogInterface: DialogInterface, _: Int ->
            dialogInterface.dismiss() // Close the dialog
        }

        val alertDialog = alertDialogBuilder.create()
        alertDialog.show()
    }

}
```

Upon executing the code example provided above, your app's appearance will resemble the following snippet:

![documentation image](/docs/live-tracking/android-tracking/simple-asset-tracking.webp)

### Code Highlights

The above code snippet is for an Android activity that demonstrates how to start tracking an asset using the Asset Tracking SDK. The activity has the following main steps:

1.  Initialize the Asset Tracking SDK.
2.  Create an asset.
3.  Bind the asset to the device.
4.  Check for location permissions and start tracking.

The following is a description of each step:

1.  To initialize the Asset Tracking SDK, the activity calls the **initialize**() method with your API key.
2.  To create an asset, the activity creates an AssetProfile object and sets its properties. The AssetProfile object specifies the asset's custom ID, name, description, and attributes.
3.  To bind the asset to the device, the activity calls the **bindAsset**() method with the asset ID.
4.  To check for location permissions and start tracking, the activity calls the **checkPermissionsAndStartTracking**() method. This method first checks if all location permissions are granted. If they are, the method starts tracking the asset. If they are not granted, the method shows a dialog to the user asking them to grant the permissions.

The code snippet also includes a few helper functions:

- **showLocationServiceOffDialog**(): This function shows a dialog to the user if location services are disabled.
- **startTracking**(): This function starts tracking and uploading the location data of the asset.

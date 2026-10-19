# Get AssetTrackingCallback

This example will guide you through the following steps:

- **Initialization with Default Configurations**: Learn how to set up the SDK with default configuration values, simplifying the integration process.
- **Creating, Binding, and Initiating Tracking for a Simple Asset**: Discover how to create an asset, bind it to your application, and commence tracking. This sequence of actions enables you to monitor asset locations effectively.
- **Receiving AssetTrackingCallback in Your Activities**: Gain insight into handling AssetTrackingCallback within your activities, ensuring that you can seamlessly manage and respond to asset-tracking events.

For all code examples, refer to [Asset Tracking Android Code Examples](https://github.com/nextbillion-ai/nb-asset-tracking-android-demo)

**activity_get_asset_callback.xml** [view source](https://github.com/nextbillion-ai/nb-asset-tracking-android-demo/blob/main/app/src/main/res/layout/activity_get_asset_callback.xml)

```xml
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
   xmlns:app="http://schemas.android.com/apk/res-auto"
   xmlns:tools="http://schemas.android.com/tools"
   android:layout_width="match_parent"
   android:layout_height="match_parent"
   android:orientation="vertical"
   android:padding="10dp"
   tools:context=".codeexample.GetAssetCallback">

   <LinearLayout
       android:layout_width="wrap_content"
       android:layout_height="wrap_content">

       <Button
           android:id="@+id/callback_start_tracking"
           android:layout_width="wrap_content"
           android:layout_height="wrap_content"
           android:text="@string/start_tracking" />

       <Button
           android:id="@+id/callback_stop_tracking"
           android:layout_width="wrap_content"
           android:layout_height="wrap_content"
           android:layout_marginLeft="10dp"
           android:text="@string/stop_tracking" />

   </LinearLayout>

   <TextView
       android:id="@+id/callback_is_stop_tracking"
       android:layout_width="wrap_content"
       android:layout_height="wrap_content"
       android:layout_marginTop="10dp" />

   <TextView
       android:id="@+id/callback_location_info"
       android:layout_width="wrap_content"
       android:layout_height="wrap_content"
       android:layout_marginTop="20dp" />

</LinearLayout>
```

**GetAssetCallback** [view source](https://github.com/nextbillion-ai/nb-asset-tracking-android-demo/blob/main/app/src/main/java/ai/nextbillion/nbassettrackingdemo/GetAssetCallback.kt)

```kotlin
class GetAssetCallback : AppCompatActivity(), AssetTrackingCallBack {
    private lateinit var startTrackingButton: Button
    private lateinit var stopTrackingButton: Button
    private lateinit var trackingStatusView: TextView
    private lateinit var locationInfoView: TextView

    var permissionsManager: LocationPermissionsManager? = null
    private var assetId = ""

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_get_asset_callback)

        // initialize the Asset Tracking SDK
        initialize("PUT YOUR API KEY HERE")
        assetTrackingAddCallback(this)

        createAndBindAsset()
        initView()
    }

    private fun initView() {
        startTrackingButton = findViewById(R.id.callback_start_tracking)
        startTrackingButton.setOnClickListener {
            checkPermissionsAndStartTracking()
        }

        stopTrackingButton = findViewById(R.id.callback_stop_tracking)
        stopTrackingButton.setOnClickListener {
            assetTrackingStop()
        }

        trackingStatusView = findViewById(R.id.callback_is_stop_tracking)
        locationInfoView = findViewById(R.id.callback_location_info)
    }

    override fun onDestroy() {
        super.onDestroy()
        assetTrackingRemoveCallback(this)

        // add this to avoid blocking other example, could remove in real usage
        assetTrackingStop()
    }

    @SuppressLint("SetTextI18n")
    override fun onLocationSuccess(location: Location) {
        locationInfoView.text = """
            --------- Location Info ---------
            Provider: ${location.provider}
            Latitude: ${location.latitude}
            Longitude: ${location.longitude}
            Altitude: ${location.altitude}
            Accuracy: ${location.accuracy}
            speed:${location.speed}
            Bearing: ${location.bearing}
            Time: ${location.time}
            """.trimIndent()
    }

    override fun onLocationFailure(exception: Exception) {
        locationInfoView.text = exception.message
    }

    @SuppressLint("SetTextI18n")
    override fun onTrackingStart(assetId: String) {
        trackingStatusView.text = "Asset Tracking is ON"
    }

    @SuppressLint("SetTextI18n")
    override fun onTrackingStop(assetId: String, trackingDisableType: TrackingDisableType) {
        trackingStatusView.text = "Asset Tracking is OFF"
        locationInfoView.text = ""
    }

    private fun createAndBindAsset() {
        val assetAttributes: Map<String, String> = mapOf("attribute 1" to "test 1", "attribute 2" to "test 2")
        val assetProfile = AssetProfile.Builder().setCustomId(UUID.randomUUID().toString()).setName("testName")
            .setDescription("testDescription").setAttributes(assetAttributes).build()

        createNewAsset(assetProfile, object : AssetApiCallback<AssetCreationResponse> {
            @SuppressLint("SetTextI18n")
            override fun onSuccess(result: AssetCreationResponse) {
                assetId = result.data.id
                Toast.makeText(
                    this@GetAssetCallback,
                    "create asset successfully with asset id: $assetId",
                    Toast.LENGTH_LONG
                ).show()

                onBindAsset()
            }

            override fun onFailure(exception: Exception) {
                Toast.makeText(
                    this@GetAssetCallback,
                    "create asset failed with error: " + exception.message,
                    Toast.LENGTH_LONG
                ).show()
            }
        })
    }

    private fun onBindAsset() {
        bindAsset(assetId, object : AssetApiCallback<Unit> {
            @SuppressLint("SetTextI18n")
            override fun onSuccess(result: Unit) {
                Toast.makeText(
                    this@GetAssetCallback,
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
                    this@GetAssetCallback,
                    "bind asset failed: $exceptionMessage",
                    Toast.LENGTH_LONG
                ).show()
            }
        })
    }

    @SuppressLint("MissingPermission")
    private fun checkPermissionsAndStartTracking() {
        if (LocationPermissionsManager.areAllLocationPermissionGranted(this)) {
            assetTrackingStart()
        } else if (!LocationPermissionsManager.isLocationServiceEnabled(this)) {
            showLocationServiceOffDialog()
        } else {
            permissionsManager = LocationPermissionsManager(object : LocationPermissionsListener {
                override fun onExplanationNeeded(permissionsToExplain: List<String>?) {
                    Toast.makeText(
                        this@GetAssetCallback, "You need to accept location permissions.",
                        Toast.LENGTH_SHORT
                    ).show()
                }

                override fun onPermissionResult(granted: Boolean) {
                    if (granted) {
                        if (LocationPermissionsManager.isBackgroundLocationPermissionGranted(this@GetAssetCallback)) {
                            assetTrackingStart()
                        } else {
                            permissionsManager?.requestBackgroundLocationPermissions(this@GetAssetCallback)
                        }
                    } else {
                        Toast.makeText(
                            this@GetAssetCallback, "You need to accept location permissions.$granted",
                            Toast.LENGTH_SHORT
                        ).show()
                    }
                }
            })
            permissionsManager?.requestLocationPermissions(this)
        }
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

![documentation image](/docs/live-tracking/android-tracking/get-assettracking-callback.webp)

## Code Highlights

The above code snippet is for an Android activity that demonstrates how to receive asset tracking callbacks using the Asset Tracking SDK. The activity has the following main steps:

1.  Initialize the Asset Tracking SDK.
2.  Create an asset profile.
3.  Bind the asset profile to the device.
4.  Start tracking the asset.
5.  Receive asset tracking callbacks.

The following is a description of each step:

1.  To initialize the Asset Tracking SDK, the activity calls the **initialize()** method with your API key.
2.  To create an asset profile, the activity creates an AssetProfile object and sets its properties. The AssetProfile object specifies the asset's custom ID, name, description, and attributes.
3.  To bind the asset profile to the device, the activity calls the **bindAsset()** method with the asset ID.
4.  To start tracking the asset, the activity calls the **assetTrackingStart()** method.
5.  To receive asset tracking callbacks, the activity implements the **AssetTrackingCallBack** interface and overrides the following methods:
    1.  **onLocationSuccess()**: This method is called when the asset's location is updated.
    2.  **onLocationFailure()**: This method is called when the asset's location fails to be updated.
    3.  **onTrackingStart()**: This method is called when asset tracking is started.
    4.  **onTrackingStop()**: This method is called when asset tracking is stopped.

The activity also includes a few helper functions:

- **createAndBindAsset()**: This function creates an asset profile, binds it to the device, and starts tracking the asset.
- **checkPermissionsAndStartTracking()**: This function checks for location permissions and starts tracking the asset if they are granted.
- **showLocationServiceOffDialog()**: This function shows a dialog to the user if location services are disabled.

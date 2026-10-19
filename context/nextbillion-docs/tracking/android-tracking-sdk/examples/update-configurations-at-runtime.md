# Update configurations at runtime

This example guides you through the following steps:

- **Initialization with Customized Configurations**: Learn how to set up the SDK with customized configuration values, tailoring it to your specific requirements and preferences.
- **Updating Configuration Settings at Runtime**: Discover how to dynamically modify configuration settings such as LocationConfig, NotificationConfig, and DataTrackingConfig during the execution of your application. This flexibility empowers you to adapt the SDK to changing conditions and user needs in real time.

For all code examples, refer to [Asset Tracking Android Code Examples](https://github.com/nextbillion-ai/nb-asset-tracking-android-demo)

**activity_update_configuration.xml** [view source](https://github.com/nextbillion-ai/nb-asset-tracking-android-demo/blob/main/app/src/main/res/layout/activity_update_configuration.xml)

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
       android:id="@+id/update_location_config"
       android:layout_width="wrap_content"
       android:layout_height="wrap_content"
       android:text="@string/update_location_config" />

   <Button
       android:id="@+id/update_notification_config"
       android:layout_width="wrap_content"
       android:layout_height="wrap_content"
       android:text="@string/update_notification_config" />

   <Button
       android:id="@+id/update_data_tracking_config"
       android:layout_width="wrap_content"
       android:layout_height="wrap_content"
       android:text="@string/update_data_tracking_config" />

   <TextView
       android:id="@+id/configuration_detail"
       android:layout_width="wrap_content"
       android:layout_height="wrap_content"
       android:layout_marginTop="10dp" />

</LinearLayout>
```

UpdateConfiguration view source

```kotlin
class UpdateConfiguration : AppCompatActivity() {
    private lateinit var updateLocationConfigButton: Button
    private lateinit var updateNotificationConfigButton: Button
    private lateinit var updateDataTrackingConfigButton: Button
    private lateinit var configurationDetailView: TextView

    private lateinit var defaultConfig: DefaultConfig
    private lateinit var locationConfig: LocationConfig
    private lateinit var notificationConfig: NotificationConfig
    private lateinit var dataTrackingConfig: DataTrackingConfig

    var permissionsManager: LocationPermissionsManager? = null
    private var assetId = ""

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_update_configuration)

        // initialize the Asset Tracking SDK
        initConfigurations()
        createAsset()

        initView()
    }

    override fun onDestroy() {
        super.onDestroy()
        // add this to avoid blocking other example, could remove in real usage
        assetTrackingStop()
    }

    @SuppressLint("SetTextI18n")
    private fun initView() {
        configurationDetailView = findViewById(R.id.configuration_detail)

        updateLocationConfigButton = findViewById(R.id.update_location_config)
        updateLocationConfigButton.setOnClickListener {
            val locationConfigToChange = LocationConfig(
                interval = 20000,
                smallestDisplacement = 20.0f,
                maxWaitTime = 5000,
                fastestInterval = 1500,
                enableStationaryCheck = true
            )
            assetTrackingUpdateLocationConfig(locationConfigToChange)

            locationConfig = assetTrackingGetLocationConfig()

            configurationDetailView.text = "location config: " + Gson().toJson(locationConfig)

        }

        updateNotificationConfigButton = findViewById(R.id.update_notification_config)
        updateNotificationConfigButton.setOnClickListener {
            val notificationConfigToChange = NotificationConfig(
                channelId = "NextBillion.ai",
                channelName = "NextBillion.ai",
            )
            assetTrackingUpdateNotificationConfig(notificationConfigToChange)

            notificationConfig = assetTrackingGetNotificationConfig()

            configurationDetailView.text = "notification config: " + Gson().toJson(notificationConfig)
        }

        updateDataTrackingConfigButton = findViewById(R.id.update_data_tracking_config)
        updateDataTrackingConfigButton.setOnClickListener {

            val dataTrackingConfigToChange = DataTrackingConfig(
                baseUrl = "https://api.nextbillion.io",
                dataUploadingBatchSize = 15,
                dataUploadingBatchWindow = 30,
                dataStorageSize = 5000,
                shouldClearLocalDataWhenCollision = false
            )
            assetTrackingUpdateDataTrackingConfig(dataTrackingConfigToChange)

            dataTrackingConfig = assetTrackingGetDataTrackingConfig()
            configurationDetailView.text = "dataTracking config: " + Gson().toJson(dataTrackingConfig)
        }
    }

    private fun initConfigurations() {
        defaultConfig = DefaultConfig(
            debug = false,
            enhanceService = true,
            repeatInterval = 5L,
            workerEnabled = true,
            crashRestartEnabled = true,
            workOnMainThread = true,
            restartIntent = null
        )

        // You can either choose the specified tracking mode, or use self-defined
        locationConfig = LocationConfig(
            trackingMode = TrackingMode.ACTIVE,
            maxWaitTime = 10000,
            fastestInterval = 1000,
            enableStationaryCheck = false
        )

        notificationConfig = NotificationConfig(channelId = "Custom.ID", channelName = "Custom.Name")

        dataTrackingConfig = DataTrackingConfig(
            baseUrl = "https://api.nextbillion.io",
            dataUploadingBatchSize = 30,
            dataUploadingBatchWindow = 20,
            dataStorageSize = 5000,
            shouldClearLocalDataWhenCollision = true
        )

        AssetTracking {
            setDefaultConfig(defaultConfig)
            setLocationConfig(locationConfig)
            setNotificationConfig(notificationConfig)
            setDataTrackingConfig(dataTrackingConfig)
        }

         initialize("PUT YOUR API KEY HERE")
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
                    this@UpdateConfiguration,
                    "create asset successfully with asset id: $assetId",
                    Toast.LENGTH_LONG
                ).show()
                bindAssetAndStartTracking()
            }

            override fun onFailure(exception: Exception) {
                Toast.makeText(
                    this@UpdateConfiguration,
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
                    this@UpdateConfiguration,
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
                    this@UpdateConfiguration,
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
                        this@UpdateConfiguration, "You need to accept location permissions.",
                        Toast.LENGTH_SHORT
                    ).show()
                }

                override fun onPermissionResult(granted: Boolean) {
                    if (granted) {
                        if (LocationPermissionsManager.isBackgroundLocationPermissionGranted(this@UpdateConfiguration)) {
                            startTracking()
                        } else {
                            permissionsManager?.requestBackgroundLocationPermissions(this@UpdateConfiguration)
                        }
                    } else {
                        Toast.makeText(
                            this@UpdateConfiguration, "You need to accept location permissions.$granted",
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

![documentation image](/docs/live-tracking/android-tracking/update-configurations-at-runtime.webp)

### Code Highlights

The above code snippet is for an Android activity that demonstrates how to update the configuration of the Asset Tracking SDK. The activity has the following main steps:

1.  Initialize the Asset Tracking SDK.
2.  Create an asset profile.
3.  Bind the asset profile to the device.
4.  Start tracking the asset.
5.  Update the configuration of the Asset Tracking SDK.

The following is a description of each step:

1.  To initialize the Asset Tracking SDK, the activity calls the **initialize()** method with the API key.
2.  To create an asset profile, the activity creates an AssetProfile object and sets its properties. The AssetProfile object specifies the asset's custom ID, name, description, and attributes.
3.  To bind the asset profile to the device, the activity calls the **bindAsset()** method with the asset ID.
4.  To start tracking the asset, the activity calls the **assetTrackingStart()** method.
5.  To update the configuration of the Asset Tracking SDK, the activity calls the following methods:
    1.  **assetTrackingUpdateLocationConfig()**: This method updates the location configuration.
    2.  **assetTrackingUpdateNotificationConfig()**: This method updates the notification configuration.
    3.  **assetTrackingUpdateDataTrackingConfig()**: This method updates the data tracking configuration.

The activity also includes a few helper functions:

- **initConfigurations()**: This function initializes the default configuration, location configuration, notification configuration, and data tracking configuration.
- **createAsset()**: This function creates an asset profile and binds it to the device.
- **bindAssetAndStartTracking()**: This function binds an asset profile to the device and starts tracking the asset.
- **checkPermissionsAndStartTracking()**: This function checks for location permissions and starts tracking the asset if they are granted.
- **showLocationServiceOffDialog()**: This function shows a dialog to the user if location services are disabled.

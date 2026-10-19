# Update Asset Configurations

This example shows:

- Initialize asset tracking: Initialize Asset tracking with necessary configurations such as API key, fake GPS configuration, and data tracking configuration.
- Create and Bind Asset: Creates a new asset profile and binds it to the asset tracking service. Ensures that the asset is ready for tracking.
- Update Data Tracking Configurations: Update data tracking configurations such as batch size, batch window, and storage size. This is achieved by creating a new DataTrackingConfig object and calling the setDataTrackingConfig() method of the asset tracking service.
- Update Location Configurations: Update location tracking configurations such as tracking mode and smallest displacement. This is done by creating a new LocationConfig object and calling the updateLocationConfig() method of the asset tracking service.
- Update Notification Configurations: Update notification configurations based on the platform (Android or iOS). For Android, it updates the Android notification configuration, for iOS, it updates the iOS notification configuration. These configurations include settings such as notification channel ID, notification channel name, and asset enable notification title.

For all code examples, refer to [Asset Tracking Flutter Code Examples](https://github.com/nextbillion-ai/nextbillion-asset-tracking-flutter/tree/main/example)

**update_tracking_configuration.dart** [view source](https://github.com/nextbillion-ai/nextbillion-asset-tracking-flutter/blob/main/example/lib/screen/update_tracking_configuration.dart)

```dart
import 'dart:convert';
import 'dart:io';

import 'package:flutter/material.dart';
import 'package:nb_asset_tracking_flutter/nb_asset_tracking_flutter.dart';
import 'package:nb_asset_tracking_flutter_example/util/consts.dart';
import 'package:nb_asset_tracking_flutter_example/util/toast_mixin.dart';
import 'package:uuid/uuid.dart';

class UpdateConfigurationExample extends StatefulWidget {
  @override
  UpdateConfigurationExampleState createState() => UpdateConfigurationExampleState();
}

class UpdateConfigurationExampleState extends State<UpdateConfigurationExample>
    with ToastMixin
    implements OnTrackingDataCallBack {
  bool bindAsset = false;
  final assetTracking = AssetTracking();
  String locationInfo = "";
  String configInfo = "";
  String assetId = "";
  bool isTracking = false;

  @override
  void initState() {
    super.initState();
    initAssetTracking();
    createAndBindAssetId();
  }

  void initAssetTracking() {
    assetTracking.initialize(apiKey: accessKey);
    assetTracking.setFakeGpsConfig(allow: true);
    assetTracking.addDataListener(this);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        toolbarHeight: 0,
      ),
      body: Container(
        padding: EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            ElevatedButton(
              onPressed: assetId.isNotEmpty
                  ? () async {
                      var locationConfig = LocationConfig(trackingMode: TrackingMode.custom, smallestDisplacement: 40);
                      await assetTracking.updateLocationConfig(config: locationConfig);
                      var locationConfigResult = await assetTracking.getLocationConfig();
                      setState(() {
                        configInfo = "locationConfigInfo: ${jsonEncode(locationConfigResult.data)}";
                      });
                    }
                  : null,
              child: const Text("Update Location Config"),
            ),
            ElevatedButton(
              onPressed: assetId.isNotEmpty
                  ? () async {
                      var androidNotificationConfig =
                          AndroidNotificationConfig(channelId: "testChannelId", channelName: "newChannelName");
                      var iOSNotificationConfig = IOSNotificationConfig();
                      iOSNotificationConfig.showAssetEnableNotification = false;
                      iOSNotificationConfig.showAssetDisableNotification = true;
                      var assetEnableConfig = AssetEnableNotificationConfig(identifier: "iosIdentifier");
                      assetEnableConfig.title = "New asset enable notification title";
                      iOSNotificationConfig.assetEnableNotificationConfig = assetEnableConfig;

                      if (Platform.isAndroid) {
                        assetTracking.setAndroidNotificationConfig(config: androidNotificationConfig);
                        var androidConfig = await assetTracking.getAndroidNotificationConfig();
                        setState(() {
                          configInfo = "notificationConfig: ${jsonEncode(androidConfig.data)}";
                        });
                      } else {
                        assetTracking.setIOSNotificationConfig(config: iOSNotificationConfig);
                        var iosConfig = await assetTracking.getIOSNotificationConfig();
                        setState(() {
                          configInfo = "notificationConfig: ${jsonEncode(iosConfig.data)}";
                        });
                      }
                    }
                  : null,
              child: const Text("Update Notification Config"),
            ),
            ElevatedButton(
              onPressed: assetId.isNotEmpty
                  ? () async {
                      var dataTrackingConfig = DataTrackingConfig(
                          dataUploadingBatchSize: 15, dataUploadingBatchWindow: 30, dataStorageSize: 5000);
                      await assetTracking.setDataTrackingConfig(config: dataTrackingConfig);
                      var dataTrackingConfigInfo = await assetTracking.getDataTrackingConfig();
                      setState(() {
                        configInfo = "dataTrackingConfigInfo: ${jsonEncode(dataTrackingConfigInfo.data)}";
                      });
                    }
                  : null,
              child: const Text("Update DataTracking Config"),
            ),
            Padding(
              padding: const EdgeInsets.only(top: 18.0),
              child: Text(configInfo),
            ),
            Padding(
              padding: const EdgeInsets.only(top: 28.0),
              child: Text(locationInfo),
            ),
          ],
        ),
      ),
    );
  }

  void createAndBindAssetId() async {
    AssetProfile profile = AssetProfile(
        customId: const Uuid().v4().toString(), name: "test asset", description: "asset descriptions", attributes: {});
    AssetResult result = await assetTracking.createAsset(profile: profile);
    if (result.success) {
      String assetID = result.data;
      var assetResult = await assetTracking.bindAsset(customId: assetID);
      if (assetResult.success) {
        showToast("Asset ${result.data} bind success");
        setState(() {
          assetId = assetResult.data;
          bindAsset = true;
        });
      } else {
        showToast(assetResult.msg.toString());
      }
    } else {
      showToast(result.msg.toString());
    }
  }

  @override
  void onLocationFailure(String message) {}

  @override
  void onLocationSuccess(NBLocation location) {
    setState(() {
      locationInfo = "------- Location Info ------- \n"
          "Provider: ${location.provider} \n"
          "Latitude: ${location.latitude}\n"
          "Longitude: ${location.longitude}\n"
          "Altitude: ${location.altitude}\n"
          "Accuracy: ${location.accuracy}\n"
          "Speed: ${location.speed}\n"
          "Bearing: ${location.heading}\n"
          "Time: ${location.timestamp}\n";
    });
  }

  @override
  void onTrackingStart(String message) {
    setState(() {
      isTracking = true;
    });
  }

  @override
  void onTrackingStop(String message) {
    setState(() {
      isTracking = false;
      locationInfo = "";
    });
  }

  @override
  void dispose() {
    super.dispose();
    assetTracking.removeDataListener(this);
    assetTracking.stopTracking();
  }
}
```

Here are the code highlights for each of the four functionalities:

1.  Initialize Asset Tracking
    1.  `assetTracking.initialize(apiKey: accessKey)`: Initializes asset tracking with the provided API key.
    2.  `assetTracking.setFakeGpsConfig(allow: true)`: Allows using fake GPS configurations.
    3.  `assetTracking.addDataListener(this)`: Adds a data listener to track data updates.
    4.  `assetTracking.setDataTrackingConfig(config: DataTrackingConfig(baseUrl: baseUrlStaging))`: Sets data tracking configurations such as the base URL.

2.  Create and Bind Asset
    1.  `AssetProfile profile = AssetProfile(...)`: Defines the profile of the asset to be created.
    2.  `AssetResult result = await assetTracking.createAsset(profile: profile)`: Creates a new asset with the specified profile.
    3.  `var assetResult = await assetTracking.bindAsset(customId: assetID)`: Binds the created asset to the tracking service.

3.  Update Data Tracking Configurations
    1.  `var dataTrackingConfig = DataTrackingConfig(...)`: Defines the data tracking configurations to be updated.
    2.  `await assetTracking.setDataTrackingConfig(config: dataTrackingConfig)`: Updates the data tracking configurations.
    3.  `var dataTrackingConfigInfo = await assetTracking.getDataTrackingConfig()`: Retrieves the updated data tracking configurations.

4.  Update Location Configurations
    1.  `var locationConfig = LocationConfig(...)`: Defines the location configurations to be updated.
    2.  `await assetTracking.updateLocationConfig(config: locationConfig)`: Updates the location tracking configurations.
    3.  `var locationConfigResult = await assetTracking.getLocationConfig()`: Retrieves the updated location tracking configurations.

5.  Update Notification Configurations
    1.  For Android:
        1.  `var androidNotificationConfig = AndroidNotificationConfig(...)`: Defines the Android notification configurations.
        2.  `assetTracking.setAndroidNotificationConfig(config: androidNotificationConfig);`: Sets the Android notification configurations.
        3.  `var androidConfig = await assetTracking.getAndroidNotificationConfig();`: Retrieves the updated Android notification configurations.
    2.  For iOS:
        1.  `var iOSNotificationConfig = IOSNotificationConfig(...)`: Defines the iOS notification configurations.
        2.  `assetTracking.setIOSNotificationConfig(config: iOSNotificationConfig);`: Sets the iOS notification configurations.
        3.  `var iosConfig = await assetTracking.getIOSNotificationConfig();`: Retrieves the updated iOS notification configurations.

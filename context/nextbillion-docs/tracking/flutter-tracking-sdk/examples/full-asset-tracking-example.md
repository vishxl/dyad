# Full Asset Tracking Example

This example shows:

- **Initialize Asset Tracking**: Initialize asset tracking by calling the `initialize()` method of the `AssetTracking` class with the appropriate API key.
- **Check Permissions and Start Tracking**: Before starting tracking, the application checks for location permissions, especially on Android devices. It ensures proper permission before initiating tracking.
- **Add Listener for Asset Tracking Callback**: The application adds a listener to receive updates from the asset tracking service. This includes tracking status updates and location data.
- **Switch Asset Tracking Mode**: Users can switch between different tracking modes, such as active, balanced, passive, or custom. The application updates the location configuration accordingly based on the selected mode.
- **Change Notification Configurations**: Users can configure notification settings to track start and stop events. These configurations are platform-specific and handled appropriately for Android and iOS devices.
- **Start and Stop Tracking**: The application provides buttons to start and stop tracking based on user input. It ensures that tracking is only started when all necessary configurations are set.
- **Display Tracking Status and Location Information**: The application displays the current tracking status and location information in real-time. Users can monitor the tracking process and view location details as they are received.
- **Create a New Asset**: Users can create a new asset profile within the application. This functionality allows for the management of multiple assets and tracking them separately.

For all code examples, refer to [Asset Tracking Flutter Code Examples](https://github.com/nextbillion-ai/nextbillion-asset-tracking-flutter/tree/main/example)

**home_screen.dart** [view source](https://github.com/nextbillion-ai/nextbillion-asset-tracking-flutter/blob/main/example/lib/screen/home_screen.dart)

```dart
import 'dart:io';

import 'package:flutter/material.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:nb_asset_tracking_flutter/nb_asset_tracking_flutter.dart';
import 'package:nb_asset_tracking_flutter_example/util/permiss_checker.dart';
import 'package:nb_asset_tracking_flutter_example/util/toast_mixin.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../util/consts.dart';
import 'create_asset.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _MyAppState();
}

class _MyAppState extends State<HomeScreen> with ToastMixin implements OnTrackingDataCallBack {
  bool _isRunning = false;
  bool isAllowMockLocation = false;
  bool enableTrackingStartedNotification = true;
  bool enableTrackingStopNotification = true;
  final assetTracking = AssetTracking();
  TrackingMode selectedOption = TrackingMode.active;
  CustomIntervalMode selectedIntervalMode = CustomIntervalMode.distanceBased;
  String trackingStatus = 'Tracking Status: ';
  String locationInfo = '';
  late SharedPreferences sharedPreferences;
  final TextEditingController textEditingController = TextEditingController();

  @override
  void initState() {
    super.initState();
    assetTracking.initialize(apiKey: accessKey);
    Stream<AssetResult> statusStream = assetTracking.isTracking().asStream();
    statusStream.listen((value) {
      _isRunning = value.data;
      updateTrackingStatus(_isRunning);
    });

    assetTracking.addDataListener(this);
    initSharedPreferences();
    bindExistAssetId();
  }

  Future initSharedPreferences() async {
    sharedPreferences = await SharedPreferences.getInstance();

    AssetResult result = await assetTracking.getFakeGpsConfig();

    bool allow = sharedPreferences.getBool(keyOfFakeGpsFlag) ?? result.data;
    assetTracking.setFakeGpsConfig(allow: allow);

    String trackingMode = sharedPreferences.getString(keyOfTrackingMode) ?? TrackingMode.active.name;
    TrackingMode mode = TrackingMode.fromString(trackingMode);
    assetTracking.setLocationConfig(config: LocationConfig.config(mode));

    var envConfig = sharedPreferences.getString(keyOfEnvConfig);
    if (envConfig?.isNotEmpty == true) {
      assetTracking.setDataTrackingConfig(
          config: DataTrackingConfig(baseUrl: EnvConfig.fromString(envConfig!) == EnvConfig.prod ? baseUrlProd : baseUrlStaging));
    }

    setState(() {
      isAllowMockLocation = allow;
      selectedOption = mode;
    });
  }

  void bindExistAssetId() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    String? boundId = prefs.getString(keyOfBoundId);

    if (boundId == null) {
      return;
    }

    AssetResult result = await assetTracking.bindAsset(customId: boundId);
    if (!result.success) {
      showToast("bind asset failed: ${result.msg}");
      return;
    } else {
      showToast("Bind asset successfully with id: ${result.data}");
    }
  }

  @override
  void dispose() {
    assetTracking.removeDataListener(this);
    super.dispose();
  }

  void updateTrackingStatus(bool isRunning) {
    setState(() {
      _isRunning = isRunning;
      final status = isRunning ? "ON" : "OFF";
      trackingStatus = 'Tracking Status: $status';
      if (!isRunning) {
        locationInfo = "";
      }
    });
  }

  void startTracking() async {
    if (Platform.isAndroid) {
      var granted = await checkAndRequestLocationPermission();
      if (!granted) {
        showToast("Please granted location access for this app");
        return;
      }
    }
    SharedPreferences prefs = await SharedPreferences.getInstance();
    String? boundId = prefs.getString(keyOfBoundId);

    if (boundId == null) {
      showToast("You mast bind a asset Id first");
      return;
    }

    configNotificationConfig();
    if (locationConfigAvailable()) {
      assetTracking.startTracking();
    }

  }

  void configNotificationConfig() {
    if (Platform.isIOS) {
      var iosNotificationConfig = IOSNotificationConfig();
      iosNotificationConfig.showAssetEnableNotification = enableTrackingStartedNotification;
      iosNotificationConfig.showAssetDisableNotification = enableTrackingStopNotification;
      assetTracking.setIOSNotificationConfig(config: iosNotificationConfig);
    }
  }

  bool locationConfigAvailable() {
    if (selectedOption == TrackingMode.custom) {
      num? customValue = num.tryParse(textEditingController.text);
      if (customValue == null) {
        Fluttertoast.showToast(
            msg:
                "Please enter ${selectedIntervalMode == CustomIntervalMode.distanceBased ? "distance interval" : "time interval"}",
            gravity: ToastGravity.CENTER);
        return false;
      }
      var locationConfig = LocationConfig();
      switch (selectedIntervalMode) {
        case CustomIntervalMode.distanceBased:
          locationConfig = LocationConfig(smallestDisplacement: customValue.toDouble());
          break;
        case CustomIntervalMode.timeBased:
          locationConfig = LocationConfig(intervalForAndroid: customValue.toInt() * 1000);
          break;
      }
      assetTracking.setLocationConfig(config: locationConfig);
    }
    return true;
  }

  void stopTracking() {
    configNotificationConfig();
    assetTracking.stopTracking();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Asset Tracking Flutter'),
      ),
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _notificationConfig(),
              Row(
                children: [
                  const Text(
                    'Allow mock location',
                    style: TextStyle(fontSize: 16),
                  ),
                  Transform.scale(
                    scale: 0.7,
                    child: Switch(
                      value: isAllowMockLocation,
                      onChanged: (value) {
                        setState(() {
                          isAllowMockLocation = value;
                        });
                        assetTracking.setFakeGpsConfig(allow: value);
                        sharedPreferences.setBool(keyOfFakeGpsFlag, value);
                      },
                      activeTrackColor: Colors.lightGreenAccent,
                      activeColor: Colors.green,
                    ),
                  ),
                ],
              ),
              SizedBox(
                height: 40,
                child: RadioListTile<TrackingMode>(
                  title: const Text(
                    'TRACKING_MODE_ACTIVE',
                    style: TextStyle(fontSize: 15),
                  ),
                  value: TrackingMode.active,
                  groupValue: selectedOption,
                  onChanged: _isRunning
                      ? null
                      : (value) {
                          assetTracking.updateLocationConfig(config: LocationConfig.activeConfig());
                          setState(() {
                            selectedOption = value!;
                          });
                          sharedPreferences.setString(keyOfTrackingMode, selectedOption.name);
                        },
                  contentPadding: EdgeInsets.zero,
                ),
              ),
              SizedBox(
                height: 40,
                child: RadioListTile<TrackingMode>(
                  title: const Text(
                    'TRACKING_MODE_BALANCED',
                    style: TextStyle(fontSize: 15),
                  ),
                  value: TrackingMode.balanced,
                  groupValue: selectedOption,
                  onChanged: _isRunning
                      ? null
                      : (value) {
                          assetTracking.updateLocationConfig(config: LocationConfig.balancedConfig());
                          setState(() {
                            selectedOption = value!;
                          });
                          sharedPreferences.setString(keyOfTrackingMode, selectedOption.name);
                        },
                  contentPadding: EdgeInsets.zero,
                ),
              ),
              SizedBox(
                height: 40,
                child: RadioListTile<TrackingMode>(
                  title: const Text(
                    'TRACKING_MODE_PASSIVE',
                    style: TextStyle(fontSize: 15),
                  ),
                  value: TrackingMode.passive,
                  groupValue: selectedOption,
                  onChanged: _isRunning
                      ? null
                      : (value) {
                          assetTracking.updateLocationConfig(config: LocationConfig.passiveConfig());
                          setState(() {
                            selectedOption = value!;
                          });
                          sharedPreferences.setString(keyOfTrackingMode, selectedOption.name);
                        },
                  contentPadding: EdgeInsets.zero,
                ),
              ),
              SizedBox(
                height: 40,
                child: RadioListTile<TrackingMode>(
                  title: const Text(
                    'TRACKING_MODE_CUSTOM',
                    style: TextStyle(fontSize: 15),
                  ),
                  value: TrackingMode.custom,
                  groupValue: selectedOption,
                  onChanged: _isRunning
                      ? null
                      : (value) {
                          assetTracking.updateLocationConfig(config: LocationConfig());
                          setState(() {
                            selectedOption = value!;
                          });
                          sharedPreferences.setString(keyOfTrackingMode, selectedOption.name);
                        },
                  contentPadding: EdgeInsets.zero,
                ),
              ),
              Padding(
                padding: const EdgeInsets.only(left: 48.0, top: 15),
                child: Row(
                  children: [
                    Platform.isAndroid
                        ? DropdownButton<CustomIntervalMode>(
                            value: selectedIntervalMode,
                            underline: Container(
                              height: 1,
                              color: Colors.grey,
                            ),
                            items: const [
                              DropdownMenuItem(
                                value: CustomIntervalMode.distanceBased,
                                child: Text(
                                  'Distance based',
                                  style: TextStyle(fontSize: 15),
                                ),
                              ),
                              DropdownMenuItem(
                                value: CustomIntervalMode.timeBased,
                                child: Text(
                                  'Time based',
                                  style: TextStyle(fontSize: 15),
                                ),
                              ),
                            ],
                            alignment: AlignmentDirectional.topCenter,
                            onChanged: customOptionAvailable()
                                ? (value) {
                                    setState(() {
                                      selectedIntervalMode = value!;
                                    });
                                  }
                                : null,
                          )
                        : Container(),
                    Expanded(
                      child: Container(
                        margin: EdgeInsets.only(left: 8, right: 8),
                        height: 38,
                        child: TextField(
                            enabled: customOptionAvailable(),
                            controller: textEditingController,
                            maxLines: 1,
                            keyboardType: TextInputType.number,
                            style: TextStyle(
                                color: customOptionAvailable() ? Colors.black : Colors.grey.shade400, fontSize: 16.0),
                            decoration: InputDecoration(
                                contentPadding: const EdgeInsets.only(left: 6, right: 6, top: 0, bottom: 0),
                                border: const OutlineInputBorder(),
                                hintText: selectedIntervalMode == CustomIntervalMode.distanceBased
                                    ? "Dist. in meters"
                                    : "Time in seconds",
                                hintStyle: const TextStyle(color: Colors.grey, fontSize: 15.0))),
                      ),
                    ),
                  ],
                ),
              ),

              Padding(
                padding: const EdgeInsets.only(top: 20),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                  children: [
                    Expanded(
                      child: Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 2.0),
                        child: ElevatedButton(
                          onPressed: _isRunning
                              ? null
                              : () {
                                  startTracking();
                                },
                          child: const Text('START TRACKING', style: TextStyle(fontSize: 13)),
                        ),
                      ),
                    ),
                    Expanded(
                      child: Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 2.0),
                        child: ElevatedButton(
                          onPressed: _isRunning
                              ? () {
                                  stopTracking();
                                }
                              : null,
                          child: const Text('STOP TRACKING', style: TextStyle(fontSize: 13)),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              Padding(
                padding: const EdgeInsets.only(top: 18.0),
                child: Text(trackingStatus),
              ),
              const SizedBox(
                height: 16,
              ),
              Text(locationInfo),
              const SizedBox(
                height: 16,
              ),
              SizedBox(
                width: double.infinity,
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 5.0),
                  child: ElevatedButton(
                    onPressed: () async {
                      AssetResult assetResult = await assetTracking.isTracking();
                      if(assetResult.data) {
                        Fluttertoast.showToast(msg: "please stop tracking before editing asset profile");
                        return;
                      }
                      pushToCreateAsset();
                    },
                    child: const Text('Create new Asset'),
                  ),
                ),
              ),
              const SizedBox(
                height: 16,
              ),
              // SizedBox(
              //   width: double.infinity,
              //   child: ElevatedButton(
              //     onPressed: () {
              //       // Do something
              //     },
              //     child: const Text('View data uploaded logs'),
              //   ),
              // )
            ],
          ),
        ),
      ),
    );
  }

  bool customOptionAvailable() {
    return !_isRunning && selectedOption == TrackingMode.custom;
  }

  void pushToCreateAsset() {
    Navigator.push(
      context,
      MaterialPageRoute(builder: (context) => const CreateAssteScreen()),
    );
  }

  @override
  void onLocationFailure(String message) {
    setState(() {
      locationInfo = "------- Location Info ------- \n"
          "$message";
    });
  }

  @override
  void onLocationSuccess(NBLocation location) {
    setState(() {
      if (_isRunning) {
        locationInfo = "------- Location Info ------- \n"
            "Provider: ${location.provider} \n"
            "Latitude: ${location.latitude}\n"
            "Longitude: ${location.longitude}\n"
            "Altitude: ${location.altitude}\n"
            "Accuracy: ${location.accuracy}\n"
            "Speed: ${location.speed}\n"
            "Bearing: ${location.heading}\n"
            "Time: ${location.timestamp}\n";
      }
    });
  }

  @override
  void onTrackingStart(String message) {
    updateTrackingStatus(true);
  }

  @override
  void onTrackingStop(String message) {
    updateTrackingStatus(false);
  }

  Widget _notificationConfig() {
    if (Platform.isAndroid) {
      return Container();
    }
    return Column(
      children: [
        Row(
          children: [
            const Text(
              'Enable Tracking Started Notification',
              style: TextStyle(fontSize: 16),
            ),
            Transform.scale(
              scale: 0.7,
              child: Switch(
                value: enableTrackingStartedNotification,
                onChanged: (value) {
                  setState(() {
                    enableTrackingStartedNotification = value;
                  });
                  sharedPreferences.setBool(keyOfEnableTrackingStartedNotification, value);
                },
                activeTrackColor: Colors.lightGreenAccent,
                activeColor: Colors.green,
              ),
            ),
          ],
        ),
        Row(
          children: [
            const Text(
              'Enable Tracking Stopped Notification',
              style: TextStyle(fontSize: 16),
            ),
            Transform.scale(
              scale: 0.7,
              child: Switch(
                value: enableTrackingStopNotification,
                onChanged: (value) {
                  setState(() {
                    enableTrackingStopNotification = value;
                  });
                  sharedPreferences.setBool(keyOfEnableTrackingStopNotification, value);
                },
                activeTrackColor: Colors.lightGreenAccent,
                activeColor: Colors.green,
              ),
            ),
          ],
        ),
      ],
    );
  }
}
```

These functionalities collectively enable users to manage asset tracking within the application, including configuring settings, initiating tracking, receiving notifications, and viewing relevant information.

1.  **Initialize Asset Tracking:**
    1.  The code initializes the asset tracking module using a specific API key. This likely involves connecting to an external service or setting up internal tracking mechanisms.

2.  **Check Permissions and Start Tracking:**
    1.  It checks if the necessary permissions to access the device's location are granted. If not, it may prompt the user to grant these permissions.
    2.  Once permissions are granted, the code initiates the asset-tracking process, which may involve starting a service or initiating location tracking.

3.  **Add Listener for Asset Tracking Callback:**
    1.  A listener is set up to receive updates from the asset tracking module. This listener likely handles events such as tracking start, stop, location updates, or errors.

4.  **Switch Asset Tracking Mode:**
    1.  Users can switch between different tracking modes, such as active, balanced, passive, or custom. Each mode likely adjusts how frequently location data is collected or the level of accuracy required.

5.  **Change Notification Configurations:**
    1.  Users can configure whether to receive notifications for tracking start and stop events. This allows for customization of the user experience based on preferences.

6.  **Start and Stop Tracking:**
    1.  Users can initiate or terminate the tracking process through the application's interface. This functionality likely interacts with the underlying tracking service or module to control its behavior.

7.  **Display Tracking Status and Location Information:**
    1.  The application provides visual feedback to users regarding the current tracking status (e.g., whether tracking is active or inactive)。
    2.  Location information may be displayed to users in real-time, including latitude, longitude, speed, and accuracy.

### Code highlights related to main functionalities:

- Initialize Asset Tracking
  - assetTracking.initialize(apiKey: accessKey);
  - Add Listener for Asset Tracking Callback
  - assetTracking.addDataListener(this);

- Check Permissions and Start Tracking (Called from startTracking method)
  - var granted = await checkAndRequestLocationPermission();
  - assetTracking.startTracking();
  - Switch Asset Tracking Mode (Called from onChanged callbacks of RadioListTile widgets)
  - assetTracking.updateLocationConfig(config: LocationConfig.activeConfig());
  - assetTracking.updateLocationConfig(config: LocationConfig.balancedConfig());
  - assetTracking.updateLocationConfig(config: LocationConfig.passiveConfig());
  - assetTracking.updateLocationConfig(config: LocationConfig());

- Change Notification Configurations (Called from configNotificationConfig method)
  - assetTracking.setIOSNotificationConfig(config: iosNotificationConfig);

- Start and Stop Tracking (Called from startTracking and stopTracking methods)
  - assetTracking.startTracking();
  - assetTracking.stopTracking();

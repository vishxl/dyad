# Simple Asset Tracking Example

This example shows:

- **Initialize asset tracking**: This involves setting up the asset tracking module with necessary configurations such as API keys, data tracking configurations, and fake GPS settings.
- **Add Asset tracking callback**: Implement callbacks to handle events such as successful location updates, failures, start of tracking, and stop of tracking.
- **Create and Bind Asset**: Create an asset profile with a custom ID, name, description, and attributes. It then creates and binds this asset to the asset tracking system.
- **Check permissions and start tracking**: Check for location permissions, and if granted, it starts tracking the asset's location. Provides options to start and stop tracking.

For all code examples, refer to [Asset Tracking Flutter Code Examples](https://github.com/nextbillion-ai/nextbillion-asset-tracking-flutter/tree/main/example)

**simple_tracking.dart** [view source](https://github.com/nextbillion-ai/nextbillion-asset-tracking-flutter/blob/main/example/lib/screen/simple_tracking.dart)

```dart
import 'dart:io';
import 'package:flutter/material.dart';
import 'package:nb_asset_tracking_flutter/nb_asset_tracking_flutter.dart';
import 'package:nb_asset_tracking_flutter_example/util/consts.dart';
import 'package:nb_asset_tracking_flutter_example/util/permiss_checker.dart';
import 'package:nb_asset_tracking_flutter_example/util/toast_mixin.dart';
import 'package:uuid/uuid.dart';

class SimpleTrackingExample extends StatefulWidget {
  @override
  SimpleTrackingExampleState createState() => SimpleTrackingExampleState();
}

class SimpleTrackingExampleState extends State<SimpleTrackingExample>
    with ToastMixin
    implements OnTrackingDataCallBack {
  bool bindAsset = false;
  final assetTracking = AssetTracking();
  String locationInfo = "";
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
            Row(
              children: [
                ElevatedButton(
                  onPressed: (bindAsset && !isTracking)
                      ? () async {
                          if (Platform.isAndroid) {
                            var granted = await checkAndRequestLocationPermission();
                            if (!granted) {
                              showToast("Please granted location access for this app");
                              return;
                            }
                          }
                          if (assetId.isEmpty) {
                            showToast("You mast bind a asset Id first");
                            return;
                          }
                          assetTracking.startTracking();
                        }
                      : null,
                  child: const Text("Start Tracking"),
                ),
                Padding(
                  padding: const EdgeInsets.only(left: 8.0),
                  child: ElevatedButton(
                    onPressed: isTracking
                        ? () {
                      assetTracking.stopTracking();
                    }
                        : null,
                    child: const Text("Stop Tracking"),
                  ),
                ),
              ],
            ),
            Padding(
              padding: const EdgeInsets.only(top: 8.0),
              child: Text("Current Asset id: $assetId"),
            ),
            Padding(
              padding: const EdgeInsets.only(top: 10.0, bottom: 10),
              child: Text("Asset Tracking status: ${isTracking ? "on" : "off"} "),
            ),
            Text(locationInfo)
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
        showToast("Bind asset successfully with asset id ${assetResult.data}");
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

This Flutter code snippet demonstrates a simple asset tracking example using a stateful widget and a mixin called ToastMixin to display toast messages. Here's a summary of the functionalities:

- Initialize asset tracking:
  - In the `initState()` method, the `initAssetTracking()` function is called to initialize asset tracking. It sets up the necessary configurations and listeners.

- Add Asset tracking callback:
  - The `SimpleTrackingExampleState` class implements the `OnTrackingDataCallBack` interface, which defines callback methods for handling tracking events such as location updates and tracking status changes.

- Create and Bind Asset:
  - The `createAndBindAssetId()` method creates a new asset profile and binds it to the asset tracking service. It generates a unique ID for the asset and updates the UI accordingly.

- Check permissions and start tracking:
  - The UI consists of two buttons, "**Start Tracking**" and "**Stop Tracking**," which are enabled based on certain conditions. The "**Start Tracking**" button triggers the start of tracking if all conditions are met, including location permission on Android and the presence of a bound asset ID.

- Handle tracking events:
  - The `onLocationSuccess()` method updates the UI with location information whenever a new location is received.
  - The `onTrackingStart()` and `onTrackingStop()` methods update the UI to reflect the tracking status.

### Code highlights related to main functionalities:

1.  Initialize Asset Tracking
    1.  assetTracking.initialize(apiKey: accessKey);
    2.  assetTracking.addDataListener(this);

2.  Create and Bind Asset
    1.  AssetProfile profile = AssetProfile(...)
    2.  AssetResult result = await assetTracking.createAsset(profile: profile);
    3.  var assetResult = await assetTracking.bindAsset(customId: assetID);

3.  Check Permissions and Start Tracking
    1.  var granted = await checkAndRequestLocationPermission();
    2.  assetTracking.startTracking();
    3.  assetTracking.stopTracking();

4.  Handle Tracking Events
    1.  onLocationSuccess(NBLocation location)
    2.  onTrackingStart(String message)
    3.  onTrackingStop(String message)

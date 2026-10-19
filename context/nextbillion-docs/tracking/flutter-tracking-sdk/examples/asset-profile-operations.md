# Asset Profile Operations

This example shows:

- Create an Asset: Create a new asset with a custom ID, name, description, and attributes. The created asset ID is stored in the `assetTracking` object.
- Bind an Asset ID: Bind an existing asset ID to the current session. This action associates the current session with a specific asset.
- Update Current Asset Profile: Update the profile of the current asset. Change the name, description, and attributes of the asset.
- Retrieve Asset Detail of Current Asset ID: Retrieve detailed information about the current asset, such as its ID, name, description, and attributes.

For all code examples, refer to [Asset Tracking Flutter Code Examples](https://github.com/nextbillion-ai/nextbillion-asset-tracking-flutter/tree/main/example)

**asset_profile_screen.dart** [view source](https://github.com/nextbillion-ai/nextbillion-asset-tracking-flutter/blob/main/example/lib/screen/asset_profile_screen.dart)

```dart
import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:nb_asset_tracking_flutter/nb_asset_tracking_flutter.dart';
import 'package:nb_asset_tracking_flutter_example/util/consts.dart';
import 'package:nb_asset_tracking_flutter_example/util/toast_mixin.dart';
import 'package:uuid/uuid.dart';

class AssetProfileScreen extends StatefulWidget {
  @override
  AssetProfileScreenState createState() => new AssetProfileScreenState();
}

class AssetProfileScreenState extends State<AssetProfileScreen> with ToastMixin {
  final assetTracking = AssetTracking();
  String assetId = "";
  String assetDetailInfo = "";

  @override
  void initState() {
    super.initState();
    initAssetTracking();
  }

  void initAssetTracking() {
    assetTracking.initialize(apiKey: accessKey);
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
              onPressed: assetId.isEmpty
                  ? () async {
                      AssetProfile profile = AssetProfile(
                          customId: const Uuid().v4().toString(),
                          name: "test asset",
                          description: "asset descriptions",
                          attributes: {});
                      AssetResult result = await assetTracking.createAsset(profile: profile);
                      if (result.success) {
                        showToast("Create asset successfully with asset id ${result.data}");
                        setState(() {
                          assetId = result.data;
                        });
                      } else {
                        showToast(result.msg.toString());
                      }
                    }
                  : null,
              child: const Text("Create New Asset"),
            ),
            ElevatedButton(
              onPressed: assetId.isNotEmpty
                  ? () async {
                      var assetResult = await assetTracking.bindAsset(customId: assetId);
                      if (assetResult.success) {
                        showToast("Bind asset successfully with asset id ${assetResult.data}");
                      } else {
                        showToast(assetResult.msg.toString());
                      }
                    }
                  : null,
              child: const Text("Bind Asset"),
            ),
            ElevatedButton(
              onPressed: assetId.isNotEmpty
                  ? () async {
                      var assetProfile = AssetProfile(
                          customId: assetId,
                          name: "new name",
                          description: "new description",
                          attributes: {"attribute1": "tester1"});
                      var assetDetail = await assetTracking.updateAsset(assetProfile: assetProfile);
                      if (assetDetail.success) {
                        showToast("Update Asset Info successfully");
                      } else {
                        showToast(assetDetail.msg.toString());
                      }
                    }
                  : null,
              child: const Text("Update Asset Info"),
            ),
            ElevatedButton(
              onPressed: assetId.isNotEmpty
                  ? () async {
                      var assetDetail = await assetTracking.getAssetDetail();
                      if (assetDetail.success) {
                        setState(() {
                          assetDetailInfo = jsonEncode(assetDetail.data);
                        });
                      } else {
                        showToast(assetDetail.msg.toString());
                      }
                    }
                  : null,
              child: const Text("Get Asset Detail"),
            ),
            Text(assetDetailInfo)
          ],
        ),
      ),
    );
  }

  @override
  void dispose() {
    super.dispose();
  }
}
```

Here are the code highlights for each of the four functionalities:

### Create an Asset: `assetTracking.createAsset(profile: profile)`

1.  This functionality is implemented within the `onPressed` callback of the "Create New Asset" button.
2.  It creates a new `AssetProfile` object with a custom ID, name, description, and empty attributes.
3.  The `createAsset` method of the `assetTracking` object is called to create the asset.
4.  If the operation is successful (result.success), the asset ID is stored (assetId = result.data), and a success message is displayed. Otherwise, an error message is shown.

### Bind an Asset ID: `assetTracking.bindAsset(customId: assetId)`

1.  This functionality is implemented within the `onPressed` callback of the "Bind Asset" button.
2.  It calls the `bindAsset` method of the assetTracking object to bind the current asset ID.
3.  If the operation is successful (assetResult.success), a success message is displayed. Otherwise, an error message is shown.

### Update Current Asset Profile: `assetTracking.updateAsset(assetProfile: assetProfile)`

1.  This functionality is implemented within the `onPressed` callback of the **"Update Asset Info"** button.
2.  It creates a new `AssetProfile` object with updated information (name, description, and attributes).
3.  The `updateAsset` method of the `assetTracking` object is called to update the asset profile.
4.  If the operation is successful (assetDetail.success), a success message is displayed. Otherwise, an error message is shown.

### Retrieve Asset Detail of Current Asset ID: `assetTracking.getAssetDetail()`

1.  This functionality is implemented within the `onPressed` callback of the "**Get Asset Detail**" button.
2.  It calls the `getAssetDetail` method of the `assetTracking` object to retrieve detailed information about the current asset.
3.  If the operation is successful (assetDetail.success), the retrieved information is stored in `assetDetailInfo` and displayed on the screen. Otherwise, an error message is shown.

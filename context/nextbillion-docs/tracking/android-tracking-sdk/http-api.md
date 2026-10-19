# HTTP API

Within the HTTP client module, you'll find a set of APIs designed for asset profile operations. These operations encompass essential tasks such as Asset creation, Asset profile updates, retrieving Asset details, and binding an Asset to the current device.

Additionally, the Asset tracking-related APIs offer a high degree of configurability. Users have the flexibility to configure these APIs both during the SDK initialization process and at runtime. This configurability is achieved by passing values to the `baseUrl` parameter in API invocations, allowing for dynamic adjustments to suit your application's needs.

## The Asset Creation API

`AssetTracking.instance.createNewAsset(assetProfile, callback, baseUrl)` takes in an _AssetProfile_ object as parameter and call backend to create a new asset:

```java
AssetTracking.instance.createNewAsset(assetProfile, callback, baseUrl) takes in an AssetProfile object as parameter and call backend to create a new asset:
​​class AssetProfile {
   var customId: String
   var description: String
   var name: String
   var attributes: Map<String, String>
}
```

The _customId_ can be provided from the user side (optional), if _customId_ is provided, the user should make sure the value is unique. Creating a new asset with repeated _customId_ will fail. Once an asset is created successfully we can get the _assetId_ from the API response.

## The Asset Profile Update API

`AssetTracking.instance.updateAssetInfo(assetProfile, callback, baseUrl)` takes the updated _AssetProfile_ object as a parameter, and a successful API call will update the asset profile in the backend. The successful response will be Void type.

## The Get Asset Detail API

`AssetTracking.instance.getAssetInfo(callback, baseUrl)` will get the detailed information of the current binding asset, including the device ID of current binding:

```kotlin
data class Asset(
val id: String,
@SerializedName("device_id")
val deviceId: String,
val name: String,
val description: String,
@SerializedName("created_at")
val createdAt: Double,
@SerializedName("updated_at")
val updatedAt: Double,
val attributes: Map<String, String>
)
```

## The Bind Asset API

_AssetTracking.instance.bindAsset(context, assetId, callback, baseUrl)_ takes the current _assetId_ as a parameter and will generate a random _deviceId_ and store it locally if not generated before. A successful bind API will bind the current assetId with the device. Only after binding to a device, the user could start data tracking.

- Two devices cannot bind on the same _assetId_ simultaneously
- The later device performs binding API will kick off the first device
- The device with kicked off _assetId_ will stop data tracking (if applicable), and if SDK initialization setting is clear cached location data in this case, all the unuploaded local location data will be cleared as well.
- When the device is still tracking, using the bind asset API to bind to a new asset ID is not allowed
- When unuploaded data remains in the local cache, it is not permitted to use the `bind asset` API to associate it with a new asset ID.

## The Force Bind Asset API

_AssetTracking.instance.forceBindAsset(context, assetId, callback, baseUrl)_ takes the current assetId as a parameter and will generate a random deviceId and store it locally if not generated before. A successful bind API will force bind the current assetId with the device. Only after binding to a device, the user could start data tracking.

- Same as Bind Asset Api:
  - Two devices cannot bind on the same assetId simultaneously
  - The later device performs binding API will kick off the first device
  - The device with kicked off assetId will stop data tracking (if applicable), and if SDK initialization setting is clear cached location data in this case, all the unuploaded local location data will be cleared as well.
  - When the device is still tracking, using bind asset API to bind to a new asset ID is not allowed

- However Force Bind Asset API will bind the device to a new asset ID regardless of local cache data size, and all unuploaded data will be cleared once bind is successfully

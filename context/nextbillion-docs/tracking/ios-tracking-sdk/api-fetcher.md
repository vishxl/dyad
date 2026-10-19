# API Fetcher Module

Within the API Fetcher module, you'll find a set of APIs designed for asset profile operations. These operations encompass essential tasks such as Asset creation, Asset profile updates, retrieving Asset details, and binding an Asset to the current device.

Additionally, the Asset tracking-related APIs offer a high degree of configurability. Users have the flexibility to configure these APIs both during the SDK initialization process and at runtime. This configurability is achieved by passing values to the `baseUrl` parameter in API invocations, allowing for dynamic adjustments to suit your application's needs.

## The Asset Creation API

_AssetTracking.shared.createAsset(baseUrl, assetProfile, completionHandler, errorHandler)_ takes in an `AssetProfile` object as a parameter and calls backend to create a new asset:

```swift
AssetProfile {
    var customId: String
    var assetDescription: String
    var name: String
    var attributes: [String: String]
}
```

The _customId_ can be provided from the user side (optional), if _customId_ is provided, the user should make sure the value is unique. Creating a new asset with repeated _customId_ will fail.

Once an asset is created successfully we can get the _assetId_ from the API response.

## The Asset Profile Update API

_AssetTracking.shared.updateAsset(baseUrl, assetProfile, completionHandler, errorHandler)_ takes the updated `AssetProfile` object as parameter, and a successful API call will update the asset profile in the backend.

## The Get Asset Detail API

_AssetTracking.shared.getAssetDetail(baseUrl, completionHandler, errorHandler)_ will get the detailed information of the current binding asset, including the device ID of current binding:

```swift
class Asset(
    public let id: String
    public let deviceId: String
    public let name: String
    public let description: String
    public let createdAt: Double
    public let updatedAt: Double
    public let attributes: [String: String]
)
```

## The Bind Asset API

_AssetTracking.shared.bindAsset(baseUrl, assetId, completionHandler, errorHandler)_ takes the current `assetId` as a parameter and will generate a random deviceId and store it locally if not generated before. A successful bind API will bind the current assetId with the device. Only after binding to a device, the user could start data tracking.

- Two devices cannot bind on the same assetId simultaneously
- The later device performs binding API will kick off the first device
- The device with kicked off assetId will stop data tracking (if applicable), and if SDK initialization setting is clear cached location data in this case, all the unuploaded local location data will be cleared as well.
- When the device is still tracking, using bind asset API to bind to a new asset id is not allowed
- When the local cache still has unuploaded data, using bind asset API to bind to a new asset id is not allowed

## The Force Bind Asset API

_AssetTracking.shared.forceBindAsset(baseUrl, assetId, completionHandler, errorHandler)_ takes the current `assetId` as a parameter and will generate a random `deviceId` and store it locally if not generated before. A successful bind API will force bind the current `assetId` with the device. Only after binding to a device, the user could start data tracking.

- Same as Bind Asset API:
  - Two devices cannot bind on the same _assetId_ simultaneously
  - The later device performs binding API will kick off the first device
  - The device with kicked off _assetId_ will stop data tracking (if applicable), and if SDK initialization setting is clear cached location data in this case, all the unuploaded local location data will be cleared as well.
  - When the device is still tracking, using bind asset API to bind to a new _assetId_ is not allowed

- However Force Bind Asset API will bind the device to a new asset ID regardless of local cache data size, and all unuploaded data will be cleared once bind is successfully

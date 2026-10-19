# Getting Started

## Prerequisites

Before integrating the iOS Maps SDK, ensure the following prerequisites are met:

**Access Key:** Obtain a valid NextBillion Access Key before loading map data.

**IDE (Xcode):** Use Xcode 13.2.1 or above (latest stable version recommended).

**Minimum deployment target:** iOS 12.0 or later.

**Supported integration methods:** CocoaPods, Carthage, and Swift Package Manager.

## Installation

In this sections we will focus on integration first, then common map operations such as annotations and camera control.

### Integration Methods

This section provides the minimum setup required to integrate the SDK and render your first map view. It covers prerequisites, installation via CocoaPods/Carthage/Swift Package Manager, and required project configuration. After dependency setup, configure Access Key and permissions, then initialize NGLMapView.

Choose one of the following methods to integrate the SDK into your iOS project.

#### Method A: CocoaPods

platform: ios, '12.0'

```ruby
use_frameworks!
target 'YourAppTarget' do
  pod 'NextBillionMap', '~> 2.1.5'
end
```

```
$ pod repo update && pod install
```

Open the `.xcworkspace` and build the project.

#### Method B: Carthage

1. Add the following entry to Cartfile:

```
binary "https://github.com/nextbillion-ai/nextbillion-map-ios/releases/download/v1/carthage/Nbmap.json" ~> 2.1.5
```

```
$ carthage update --use-xcframeworks
```

1. Add Nbmap.xcframework to your target and set Embed to Embed & Sign.

_Release page:_ <https://github.com/nextbillion-ai/nextbillion-map-ios/releases/tag/2.1.5>

#### Method C: Swift Package Manager

1. In Xcode, go to File > Add Packages...

   Package URL:

   ```
   https://github.com/nextbillion-ai/maps-native-distribution
   ```

2. Select a version rule and add product Nbmap to your target.
3. Build the project to verify package integration.

#### Common Post-Install Configuration

Configure Access Key using one of the following methods:

- Info.plist: NBMapAccessKey = YOUR_ACCESS_KEY
- Code at app launch:

  ```swift
  NGLAccountManager.accessToken = "YOUR_ACCESS_KEY"
  ```

  ```objectivec
  [NGLAccountManager setAccessToken:@"YOUR_ACCESS_KEY"];
  ```

## Configure Access Key

Standard users do not need Base URL configuration. Configure the SDK with Access Key using any of the following methods:

- _NBMapAccessKey_ in `Info.plist` (recommended)

  ```xml
  <key>NBMapAccessKey</key> <string>YOUR_ACCESS_KEY</string>
  ```

- Set it in code at app launch using `NGLAccountManager.accessToken` in swift.

  ```swift
  NGLAccountManager.accessToken = "YOUR_ACCESS_KEY"
  ```

- Set `[NGLAccountManager setAccessToken:]` in Objective-C.

  ```objectivec
  [NGLAccountManager setAccessToken:@"YOUR_ACCESS_KEY"];
  ```

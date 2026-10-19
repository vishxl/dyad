# SDK Configuration and Plug-in

This section aims to assist developers in customizing and extending the functionality of the SDK to meet their application's specific requirements. It offers comprehensive guidance on configuring the SDK to work with different custom parameters and creating and integrating plug-ins into the SDK for improved functionality.

## SDK Configuration Options and Parameters

To configure your public access token, open your project's **Info.plist** file and add an _NBMapAccessKey_ key whose value is your public access token.

```xml
  <key>NBMapAccessKey</key> <your public access token/>
```

### Set permissions

In order for the SDK to track the user's location and provide audible instructions even when the device is locked or another application is being used, you need to set the appropriate permissions. To do this, navigate to the **Signing & Capabilities** tab and locate the Background Modes section. From there, enable **Audio, AirPlay, and Picture in Picture** and **Location updates**. Alternatively, you can add the audio and location values to the _UIBackgroundModes_ array in the Info tab

Add the following permissions in the Info.plist:

```xml
<key>NSLocationAlwaysAndWhenInUseUsageDescription</key>
<string>[Your explanation here]</string>
<key>NSLocationWhenInUseUsageDescription</key>
<string>[Your explanation here]</string>
```

### Set up your Identity (Optional):

#### Configure User ID

```swift
// Set user id
NGLAccountManager.userId = "your user id"
```

```swift

// Get user id, if you haven't set it, the value is nil
var userId = NGLAccountManager.userId
```

- This feature allows developers to integrate their existing user ID system with the Nextbillion SDK. this ID will then be included in the user-agent header sent to the backend service.
- To set a custom user ID from your account system, you can call: `NGLAccountManager.userId = "your user id"` You can retrieve the set user ID by calling `NGLAccountManager.userId`.

#### Retrieve Nextbillion ID

```swift
var nbId = NGLAccountManager.nbId
```

- The SDK also generates a unique identifier called the Nextbillion ID.
- You can retrieve the Nextbillion ID accessing NGLAccountManager.nbId.

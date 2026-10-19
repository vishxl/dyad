# Getting Started

This section is your gateway to kickstarting your journey with our Tracking SDK effectively. To ensure a smooth beginning, we'll cover two crucial aspects: Prerequisites and Installation.

## Prerequisites

Before diving into the installation process, it's essential to ensure that your development environment meets the necessary prerequisites. These prerequisites are fundamental requirements that enable the SDK to function seamlessly within your Android application. Here's what you'll need:

### NextBillion.ai API Key

- Obtain a valid access key from our platform. This access key is essential for authentication and enables you to utilize the SDK's services.

### Platform Compatibility

- Integrated Development Environment (IDE): Android Studio
- Android: The minimum supported minSdkVersion is 21+ or higher.

By meeting these prerequisites, you can guarantee a smooth and successful integration of our SDK into your application. These requirements have been established to ensure compatibility and optimal performance, enabling you to leverage the full potential of the SDK's features.

## Installation

Once you've ensured that your environment meets the necessary prerequisites, it's time to proceed with the installation of the Tracking SDK. This section will guide you through the steps required to get the SDK up and running in your development environment.

To integrate NextBillion.ai's Android Asset Tracking SDK into your Android project, follow the steps below:

### Step 1: Initiating the Project Directory

Before integrating our SDK, ensure you have an existing Android project in place. If you already have a well-established Android project, you can skip this step.

Here are your options:

#### Option 1: Create a New Android Project

1.  Open _Android Studio_ or _IntelliJ_.
2.  Navigate to `File` > `New` > `New Project`.
3.  Choose the `Phone And Tablet` template.
4.  We recommend selecting the `Empty Activity` option.
5.  Follow the prompts to configure your new project.

#### Option 2: Use Our Official Code Example Repository

We also offer an official code example repository for your convenience. If you'd like to experiment and learn with a pre-existing project, follow these steps:

1.  Clone our official code example repository by executing the following command in your command-line interface:

    ```bash
    git clone git@github.com:nextbillion-ai/nb-asset-tracking-android-demo.git --depth 1
    ```

2.  Once the repository is cloned, open it in your preferred integrated development environment (IDE), such as Android Studio or IntelliJ.

By following these simple instructions, you can initiate your project directory and start integrating our SDK into your Android application.

### Step 2: Add Dependencies

Add dependency to your app-level `build.gradle` file.

```gradle
def nbPluginVersion =  "2.4.2"

implementation "ai.nextbillion:nb-asset-tracking:$nbPluginVersion"
```

Ensure that you have the correct version specified to utilize the latest features and improvements.

### Step 3: Add Permissions

To use all functions of Navigation SDK, you need to declare required permissions in the `AndroidManifest.xml` file

```xml
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_BACKGROUND_LOCATION" />
<uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED" />
<uses-permission android:name="android.permission.INTERNET" />
```

### Step 4: Initialization

Initializing the SDK is a crucial step in enabling basic functionalities. A common way to initialize the SDK is to put the following code in an [Application’s](<https://developer.android.com/reference/android/app/Application#Application()>) _onCreate()_ callback. It's essentially a specific place in your app's code where this setup should go. Alternatively, ensure that you execute this code before you begin using any of the SDK's features.

```java
AssetTracking {
   setDefaultConfig(
       DefaultConfig()
   )
   setLocationConfig(
       LocationConfig()
   )
   setNotificationConfig(
       NotificationConfig()
   )
   setDataTrackingConfig(
       DataTrackingConfig()
   )
   initialize("YOUR_ACCESS_KEY")
}
```

Replace **'YOUR_ACCESS_KEY'** with the access key provided to you by NextBillion.ai. This initialization step is essential to authenticate your app and enable seamless communication with NextBillion.ai's services.

### Step 5: Asset Binding and Tracking

Creating basic functionalities for asset tracking is now within your reach. Follow these simple steps to get started:

#### 1\. Create an Asset

If you haven't created an asset yet, use the following API to do so:

```java
AssetTracking.instance.createNewAsset(assetProfile, callback, baseUrl)
```

- **assetProfile**: This is where you can define the characteristics of your asset.
- **callback**: This is where you specify what should happen once the asset is created.
- **baseUrl**: Provide the base URL for the API.

Upon creating the asset, you will receive an `assetId` in the API response. This `assetId` is essential for further actions.

**Example Response**

```kotlin
data class AssetCreationResponse(
    val status: String,
    val data: AssetData(
        val id: String
    )
)
```

#### 2\. Bind the Asset to Your Device

To link the asset to your current device, use the following API:

```java
AssetTracking.instance.bindAsset(context, assetId, callback, baseUrl)
```

- **context**: This refers to the context or environment in which the asset is bound.
- **assetId**: Use the `assetId` obtained from the previous step.
- **callback**: Specify what should occur after the asset is successfully bound.
- **baseUrl**: Provide the base URL for the API.

Once the binding process is successful, you are ready to start tracking the location of the asset with your device.

#### 3\. Start and Stop Tracking

To initiate or halt tracking on your device, use the following interface:

```java
//to start data tracking
assetTrackingStart()

//to stop data tracking
assetTrackingStop()
```

These simple steps allow you to create, bind, and track assets effortlessly, making it easier for you to leverage NextBillion.ai's asset tracking capabilities in your application.

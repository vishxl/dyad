# Tutorials

## Navigation SDK’s Android SDK levels

For compatibility and optimal performance, ensure that your project adheres to the specified SDK version configurations.

- minSdkVersion 21
- targetSdkVersion 34
- compileSdkVersion 34

When integrating the Play Services location dependency (com.google.android.gms:play-services-location:20.0.0), it's essential to maintain version 20.0.0 or below. Starting from version 21.0.0, [breaking changes](https://developers.google.com/android/guides/releases#october_13_2022) have been introduced where some classes are now interfaces instead of classes, effective from October 13, 2022.

## Add Permissions

To unlock the full capabilities of the Navigation Compose SDK, ensure that your `AndroidManifest.xml` file includes the necessary permissions declaration. This step is crucial for enabling seamless functionality across various features and components provided by the SDK.

```xml
<uses-permission android:name="android.permission.FOREGROUND_SERVICE"/>
<uses-permission android:name="android.permission.FOREGROUND_SERVICE_LOCATION"/>
<uses-permission android:name="android.permission.INTERNET" />
// Runtime permissions
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION"/>
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION"/>
<uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
```

## Setting Up Access Key for NextBillion NavigationView

To enable access to the NextBillion NavigationView within your project, follow these steps:

### Update AndroidManifest.xml

Locate the `<application>` tag in your project's AndroidManifest.xml file. Add a `<provider>` element inside it declaring `androidx.startup.InitializationProvider`, responsible for application initialization.

```xml
<provider
    android:name="androidx.startup.InitializationProvider"
    android:authorities="${applicationId}.androidx-startup"
    android:exported="false"
    tools:node="merge">
    <meta-data
    android:name=".AppDataInitStartup"
    android:value="androidx.startup" />
</provider>
```

### Create AppDataInitStartup Class

Next, create a class named `AppDataInitStartup` in your project. This class should implement the `Initializer<Boolean>` interface. Within the `create` method of this class, perform the initialization tasks for your application. In this example, the initialization task is performed using `Nextbillion.getInstance(context, "YOUR-ACCESS-KEY").`

```java
class Application : Initializer<Boolean> {
    override fun create(context: Context): Boolean {
        SDKUtils.init(context as Application)
        Nextbillion.getInstance(context, "YOUR-API-KEY")
        return true
    }

    override fun dependencies(): List<Class<out Initializer<*>>> {
        return emptyList()
    }
}
```

Ensure to replace `YOUR-ACCESS-KEY` with your actual access key provided by NextBillion.ai.

By following these steps, you have added the code for AppDataInitStartup in your Android project. This code will be executed when the application starts, performing the initialization tasks defined in the create method.

## Integrating NextBillion Navigation View into Your App

To seamlessly incorporate the NextBillion NavigationView into your application, follow this simple example utilizing the Compose extension:

```kotlin
import ai.nextbillion.kits.directions.models.DirectionsRoute
import ai.nextbillion.kits.geojson.Point
import ai.nextbillion.maps.location.modes.RenderMode
import ai.nextbillion.navigation.compose.NBNavigationView
import ai.nextbillion.navigation.core.navigation.NavigationConstants
import ai.nextbillion.navigation.core.navigator.NavProgress
import ai.nextbillion.navigation.ui.NavViewConfig
import ai.nextbillion.navigation.ui.listeners.NavigationListener
import ai.nextbillion.navigation.ui.listeners.RouteListener
import android.location.Location
import android.os.Bundle
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material.MaterialTheme
import androidx.compose.material.Surface
import androidx.compose.ui.Modifier
import androidx.fragment.app.FragmentActivity
import com.google.android.material.bottomsheet.BottomSheetDialog

class NavigationActivity : FragmentActivity(),NavigationListener,RouteListener {

    private lateinit var navViewConfig: NavViewConfig
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val routes = intent.getSerializableExtra("routes") as? List<DirectionsRoute> ?: emptyList()

        navViewConfig = NavViewConfig.builder()
            .route(routes.first())
            .routes(routes)
            .navigationListener(this)
            .routeListener(this)
            .build()
        setContent {
            Surface(
                modifier = Modifier.fillMaxSize(),
                color = MaterialTheme.colors.background
            ) {
                NBNavigationView(
                    modifier = Modifier.fillMaxSize(),
                    initViewConfig = { _ ->
                        navViewConfig
                    })
            }
        }
    }

    override fun onCancelNavigation() {
        // The call back of on tap cancel button
        finish()
    }

    override fun onNavigationFinished() {
        // Callback when navigation finishes.
        // If not using simulated Navigation and the navigation finished, finish the activity as well
        if (!navViewConfig.shouldSimulateRoute()) {
            finish()
        }
    }

    override fun onNavigationRunning() {
        // Callback when navigation is running.
        // No action needed here.
    }

    override fun allowRerouteFrom(p0: Location?): Boolean {
        // Check whether need to reroute from the location, by default return true, if don't want to perform reroute, you can return false to interrupt it
       return true
    }

    override fun onOffRoute(p0: Point?) {
        // Callback when the user goes off route.
        // No action needed here.
    }

    override fun onRerouteAlong(p0: DirectionsRoute?) {
        // Callback when rerouting along a new route.
        // No action needed here.
    }

    override fun onFailedReroute(p0: String?) {
        // Callback when rerouting fails.
        // No action needed here.
    }

    override fun onArrival(p0: NavProgress?, p1: Int) {
        // Callback when the user arrives at their destination.
        // No action needed here.
    }

    override fun onUserInTunnel(p0: Boolean) {
        // Callback when the user is detected to be in a tunnel.
        // No action needed here.
    }

    override fun shouldShowArriveDialog(p0: NavProgress?, p1: Int): Boolean {
        // Check whether pop-up arrival dialog. If Dialog is not implemented in the customArriveDialog method, the default BottomSheetDialog is shown. If false is returned, Dialog is not displayed
      return false
    }

    override fun customArriveDialog(p0: NavProgress?, p1: Int): BottomSheetDialog? {
        // You can customize the arrival dialog if needed.
      return null
    }
}
```

This example provides a comprehensive guide on integrating the NextBillion NavigationView into your app. Customize the provided methods as needed to tailor the navigation experience to your application's requirements. NavViewConfig Parameter Description

`NavViewConfig` is used to configure all parameters in the navigation process, including setting routes, route event listener, navigation monitoring, and so on. Initialization of this configuration is achieved through a builder pattern:

```kotlin
 var navViewConfig = NavViewConfig.builder()
            …
            .build()
```

The parameter configuration and usage are as follows.

### Required Parameters

| Name                                                        | Description                                                                                                                                                                                                     |
| ----------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `route(DirectionsRoute directionsRoute)`                    | Sets the current navigation route.                                                                                                                                                                              |
| `routes(List<DirectionsRoute> directionsRoutes)`            | Sets the list of navigation routes. The first route in the list corresponds to the primary route set via the route method, while the subsequent routes represent alternative options.                           |
| `navigationListener(NavigationListener navigationListener)` | Establishes the navigation listener, allowing retrieval of navigation events. If employing `NBNavigationView` within a custom activity, ensure to finish the activity within the `onCancelNavigation` callback. |

### Optional Parameters

| Name                                                                                | Description                                                                                                                                                                                                                                                                                                  |
| ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `locationLayerRenderMode(int renderMode)`                                           | Specifies the render mode for the location layer. The default is `RenderMode.GPS`. <br> <br>Available values: <br>_RenderMode.COMPASS_, _RenderMode.NORMAL_, _RenderMode.GPS_                                                                                                                                |
| `lightThemeResId(Integer lightThemeResId)`                                          | Sets the light theme style ID, with the style parent being `NavigationViewLight`.                                                                                                                                                                                                                            |
| `darkThemeResId(Integer darkThemeResId)`                                            | Assigns the dark theme style ID, with the style parent being `NavigationViewDark`.                                                                                                                                                                                                                           |
| `shouldSimulateRoute(boolean shouldSimulateRoute)`                                  | Enables or disables simulation mode. The default is `false`.                                                                                                                                                                                                                                                 |
| `waynameChipEnabled(boolean waynameChipEnabled)`                                    | Toggles the visibility of the wayname chip. The default is `true`.                                                                                                                                                                                                                                           |
| `themeMode(String themeMode)`                                                       | Configures the navigation theme mode, which can be set as: _NavigationConstants.NAVIGATION_VIEW_FOLLOW_SYSTEM_MODE_, _NavigationConstants.NAVIGATION_VIEW_DARK_MODE_, or _NavigationConstants.NAVIGATION_VIEW_LIGHT_MODE_. <br> <br>The default is _NavigationConstants.NAVIGATION_VIEW_FOLLOW_SYSTEM_MODE_. |
| `navConfig(NavEngineConfig navConfig)`                                              | Specifies the navigation engine configuration.                                                                                                                                                                                                                                                               |
| `routeListener(RouteListener routeListener)`                                        | Registers the route listener to capture navigation route events.                                                                                                                                                                                                                                             |
| `progressChangeListener(ProgressChangeListener progressChangeListener)`             | Sets up the listener for navigation progress changes.                                                                                                                                                                                                                                                        |
| `milestoneEventListener(MilestoneEventListener milestoneEventListener)`             | Configures the milestone event listener.                                                                                                                                                                                                                                                                     |
| `milestones(List<Milestone> milestones)`                                            | Customizes the milestones.                                                                                                                                                                                                                                                                                   |
| `instructionListListener(InstructionListListener instructionListListener)`          | Establishes the instruction list listener.                                                                                                                                                                                                                                                                   |
| `speechAnnouncementListener(SpeechAnnouncementListener speechAnnouncementListener)` | Sets up the listener for speech announcements.                                                                                                                                                                                                                                                               |

By leveraging these parameters, you can fine-tune the behavior and appearance of the NextBillion NavigationView to suit your application's needs.

### Example

The following example demonstrates how to configure the parameters using the builder pattern.

```java
NavViewConfig navViewConfig = NavViewConfig.builder()
        // Required Parameters
        .route(primaryRoute) // Set the current navigation route
        .routes(routeList) // Set the list of navigation routes
        .navigationListener(navigationListener) // Set up the navigation listener

        // Optional Parameters
        .locationLayerRenderMode(RenderMode.GPS) // Set the location layer render mode
        .lightThemeResId(R.style.NavigationViewLight) // Set the light theme style ID
        .darkThemeResId(R.style.NavigationViewDark) // Set the dark theme style ID
        .shouldSimulateRoute(false) // Enable or disable simulation mode
        .waynameChipEnabled(true) // Enable or disable the wayname chip
        .themeMode(NavigationConstants.NAVIGATION_VIEW_FOLLOW_SYSTEM_MODE) // Set the navigation theme mode
        .navConfig(navEngineConfig) // Set the navigation engine configuration
        .routeListener(routeListener) // Set up the route listener
        .progressChangeListener(progressChangeListener) // Set up the navigation progress change listener
        .milestoneEventListener(milestoneEventListener) // Set up the navigation milestone event listener
        .milestones(customMilestones) // Custom the milestones
        .instructionListListener(instructionListListener) // Set up the instruction list listener
        .speechAnnouncementListener(speechAnnouncementListener) // Set up the speech announcement listener
        .build();
```

In this example, replace _primaryRoute_, _routeList_, _navigationListener_, _RenderMode.GPS_, _R.style.NavigationViewLight_, _R.style.NavigationViewDark_, _false_, _true_, _NavigationConstants.NAVIGATION_VIEW_FOLLOW_SYSTEM_MODE_, _navEngineConfig_, _routeListener_, _progressChangeListener_, _milestoneEventListener_, _customMilestones_, _instructionListListener_, and _speechAnnouncementListener_ with appropriate instances or values according to your application's requirements.

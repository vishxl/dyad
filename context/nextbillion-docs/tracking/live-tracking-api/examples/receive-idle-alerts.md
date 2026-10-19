# Receive Idle Alerts

Live Tracking API can be used to get real time alerts based on asset movement and activity. In this example we will present a step by step guide of how to receive events on a configured webhook, when an asset is idle or not moving as desired.

## Get Started

Readers would need a valid NextBillion API key to try this example out. If you don’t have one, please contact us to get your API key now!

## Setup

Once you have a valid API Key, you can start setting up the components to be used in this example. Let’s take a look at them below.

### **Step 1**: Create Asset

Having received a valid key, let’s kick start the setup process by creating an asset whose activity we want to track. To create an asset, we will

- Give a meaningful name to `asset`

- Add the attributes of the asset that will be used to associate the `asset` to a `monitor`

- Though we are not specifying any custom ID in this example, but user’s can provide a custom ID to the asset, if preferred.

Following is the Asset JSON that is used for this example:

```bash
curl --location 'https://api.nextbillion.io/skynet/asset?key=<your_api_key>' \
--header 'Content-Type: application/json' \
--data '{
            "name": "Staff Transportation 002",
            "description": "Live Tracking Idle Event Example",
            "attributes": {
                "driver_contact_no": "422-761-938",
                "driver_name": "John Blake",
                "license": "2 BR 2049",
                "vehicle_type": "Pickup"
            }
}'
```

As soon as the asset is created, we get the asset ID in the acknowledgement response. Please record this ID. For our example, the asset ID is:

```json
{
  "status": "Ok",
  "data": {
    "id": "a39f8299-e19a-4484-9775-be8ae40f75c9"
  }
}
```

### **Step 2**: Bind a device to the Asset

Next step is to bind a GPS device to the asset which can upload the location and other information for the `asset`. Please note that the same device can be used for multiple assets, but one asset can be attached to only one device at a time.

```bash
curl --location 'https://api.nextbillion.io/skynet/asset/a39f8299-e19a-4484-9775-be8ae40f75c9/bind?key=<your_api_key>' \
--header 'Content-Type: application/json' \
--data '{
    "device_id":"ADR-10-SND-SAM031"
}'
```

As soon as the binding process is successful, we get an acknowledgement response from the API:

```json
{
  "status": "Ok"
}
```

### **Step 3**: Define the Idle configurations

Idle configurations involve setting of distance and time thresholds to determine if the vehicle is idle or not. Instead of waiting for the asset to hit 0 speed, Live Tracking API gives users the flexibility to set their own criteria of determining an idle state. The Live Tracking API then uses the GPS information received from the asset to check if it covered a set distance in a set amount of time. An idle event is created if this criteria fails.

The rules for idle state are set using two attributes - `time_tolerance` and `distance_tolerance`. `time_tolerance` is the time for which the monitor will track the distance covered by the `asset`. If the distance covered during `time_tolerance` is less than the `distance_tolerance` then an idle event is created. Please note that the event is created when time elapsed is more than `time_tolerance` while distance is less than `distance_tolerance`.

For our example, we set the `time_tolerance` value as 10000 milliseconds (i.e. 10 sec) and `distance_tolerance` of 30 meters. For practical purposes, readers are advised to consider the area in which the asset is operating, nature of the tasks that the asset is carrying out, and typical traffic conditions or desired average speeds for the asset to arrive at appropriate tolerance values. It would ensure true idle states to be captured. If the tolerance values are randomly set, then it might result in many false idle states.

Following is the `idle_config` object that we use:

```json
"idle_config":{
"distance_tolerance": 30,
"time_tolerance": 10000
}
```

### **Step 4**: Create a Monitor

Now that we have an `asset` and the “idle” configurations, let’s set up a monitoring criteria using a `monitor`. To create a monitor, we need to:

- Specify the `type` of activity that we want to track. Since we want to track idle events of the asset, we set this value to `idle`.

- Specify the `idle_config` attributes to model the configurations decided in the Step 3 above. This configuration will be used by the monitor to identify instances of idle activity.

- Ensure that `asset` is successfully linked with `monitor`. It is worth noting that only those assets which share all of their attributes with a `monitor` are linked with it. For our example, we add the same attributes for the `monitor` as that of the `asset` for the sake of simplicity.

- Optionally, add `name` and `description` for the `monitor`.

Below is the JSON we built for creating the monitor:

```bash
curl --location 'https://api.nextbillion.io/skynet/monitor?key=<your_api_key>' \
--header 'Content-Type: application/json' \
--data '{
"type": "idle",
"idle_config":{
    "distance_tolerance": 30,
    "time_tolerance": 10000
    },
"name": "Pickup Monitor The Ritz Hotel, Los Angeles",
"description": "Track idle activity of the pickup vehicle",
"match_filter":{
"include_all_of_attributes":{
                "driver_contact_no": "422-761-938",
                "driver_name": "John Blake",
                "license": "2 BR 2049",
                "vehicle_type": "Pickup"
                }
}
}'
```

Please record the `monitor` ID from the API response:

```json
{
  "status": "Ok",
  "data": {
    "id": "1d1b20f1-5f33-4a37-833d-119898b18ff9"
  }
}
```

Now that our asset and monitoring set up is done, we move to the next part that deals with capturing the events once they are created. Live Tracking API uses webhooks to share the event information. Let’s see how to configure a webhook.

Alternatively, readers can also constantly poll the **[Event History of an Asset](https://docs.nextbillion.ai/tracking/live-tracking-api#event-history-of-an-asset)** method to retrieve new events.

### **Step 5**: Configure a Webhooks

Readers should obtain a webhook URL from their application where they want to receive the information of events created. In our example, we are using a webhook URL provided by a messenger. Using this webhook results in the event information being sent to the messenger as a notification whenever an event is created.

Although we use a test webhook URL - `https://my-company/api/test_webhook` - in this tutorial to guide readers through the process, we recommend using an actual webhook URL while trying this tutorial.

Once we obtain a valid webhook URL, we register it with our Live Tracking API using the _Add or Update Webhook Configuration_ method.

```bash
curl --location --request PUT 'https://api.nextbillion.io/skynet/config?key=<your_api_key>' \
--header 'Content-Type: application/json' \
--data '{ "webhook":[""https://my-company/api/test_webhook""] }'
```

The registration is acknowledged with an `Ok` response from the API.

### **Step 6**: Test the webhook

In order to make sure that our webhook is correctly configured and is ready to receive the event information, let’s test it out. We will send a test request using our _Test Webhook Configuration_ method and check if a sample event was received on the webhook or not.

```bash
Test request: curl --location --request POST 'https://api.nextbillion.io/skynet/config/testwebhook?key=<your_api_key>'
```

Upon sending the above request we received the following **sample** event on the registered webhook:

```json
{
  "asset_id": "f1ceb76d-2665-4f72-bc56-aae91c4953e3",
  "geofence_id": "350706bf-cc3b-4e74-a66c-c7f050944c47",
  "monitor_id": "8a8ecd4b-f8b2-49ed-8097-b114ce53e4db",
  "monitor_tags": ["america", "newyork"],
  "event_type": "enter",
  "timestamp": 1662629479859,
  "triggered_timestamp": 1662629479810,
  "triggered_location": {
    "location": {
      "lat": 40.7128,
      "lon": -74.0059
    },
    "timestamp": 1662629479859,
    "accuracy": 20,
    "speed": 80,
    "bearing": 90,
    "altitude": 100
  },
  "prev_location": {
    "location": {
      "lat": 40.7127,
      "lon": -74.0059
    },
    "timestamp": 1662629478659,
    "accuracy": 20,
    "speed": 80,
    "bearing": 90,
    "altitude": 100
  }
}
```

## Create Idle Event

Now that setup is done, let’s start uploading the locations for the asset’s movement. We will upload a series of locations and deliberately trigger 2 idle events by keeping the distance traveled less than the distance tolerance value. In a practical scenario, however, these updates would be automatically sent by the GPS device that is bound to the given `asset`.

To better explain how the idle event work, here is a list of sample locations and their attributes:

| Location   | Distance from last tracked location | Time elapsed after receiving last tracking information | Idle alert created? |
| ---------- | ----------------------------------- | ------------------------------------------------------ | ------------------- |
| Location 1 | –                                   | –                                                      | –                   |
| Location 2 | 20m                                 | 11sec                                                  | Yes                 |
| Location 3 | 50m                                 | 11sec                                                  | No                  |
| Location 4 | 10m                                 | 11sec                                                  | Yes                 |
| Location 5 | 110m                                | 11sec                                                  | No                  |
| Location 6 | 20m                                 | 10sec                                                  | No                  |

Before we analyze the above data, remember we configured `time_tolerance` at 10000 milliseconds (10 seconds) and `distance_tolerance` at 30 meters as idle state configurations in our `monitor`. Looking at the above table we can observe that, for locations 2 and 4, the events were created as the time elapsed was greater than 10 seconds while the distance traveled was less than 30m. However, do note that an event was not created for location 6 even though the distance traveled is 20m only. This is because the time elapsed since receiving last track information is only 10 seconds, which is not greater than `time_tolerance`.

The above track distribution when modeled into an upload JSON, results in below script:

```bash
curl --location 'https://api.nextbillion.io/skynet/asset/a39f8299-e19a-4484-9775-be8ae40f75c9/track?key=<your_api_key>' \
--header 'Content-Type: application/json' \
--data '{
    "locations":[
        {
        "location":{
            "lat": 34.01110219,
            "lon": -118.30892106
        },
        "timestamp":1694930360000,
        "accuracy":2,
        "speed":5,
        "bearing":25,
        "altitude":110.5,
        "meta_data":{
            "test": "location 1"
        }
        },
        {
        "location":{
            "lat": 34.01091081,
            "lon": -118.30891733
        },
        "timestamp":1694930371000,
        "accuracy":1,
        "speed":8,
        "bearing":25,
        "altitude":110.5,
        "meta_data":{
            "test": "location 2"
        }
        },
        {
        "location":{
            "lat": 34.01084932,
            "lon": -118.30846558
        },
        "timestamp":1694930382000,
        "accuracy":7,
        "speed":12,
        "bearing":25,
        "altitude":100.5,
        "meta_data":{
            "test": "location 3"
        }
        },
        {
        "location":{
            "lat": 34.01085397,
            "lon": -118.30833917
        },
        "timestamp":1694930393000,
        "accuracy":7,
        "speed":12,
        "bearing":25,
        "altitude":100.5,
        "meta_data":{
            "test": "location 4"
        }
        },
        {
        "location":{
            "lat": 34.01085383,
            "lon": -118.30717058
        },
        "timestamp":1694930404000,
        "accuracy":7,
        "speed":12,
        "bearing":25,
        "altitude":100.5,
        "meta_data":{
            "test": "location 5"
        }
        },
        {
        "location":{
            "lat": 34.01085162,
            "lon": -118.30691488
        },
        "timestamp":1694930414000,
        "accuracy":7,
        "speed":12,
        "bearing":25,
        "altitude":100.5,
        "meta_data":{
            "test": "location 6"
        }
        }
    ],
    "device_id":"ADR-10-SND-SAM031"
}'
```

As soon as the above locations are uploaded, the idle criteria of the monitor is satisfied for a couple of locations (location 2 and location 4) and the following events are received on our configured webhook.

### First Idle Event payload

```json
{
  "asset_id": "a39f8299-e19a-4484-9775-be8ae40f75c9",
  "geofence_id": "",
  "monitor_id": "1d1b20f1-5f33-4a37-833d-119898b18ff9",
  "monitor_tags": [],
  "event_type": "idle",
  "timestamp": 1694930371000,
  "triggered_timestamp": 1694930371000,
  "triggered_location": {
    "location": {
      "lat": 34.01091081,
      "lon": -118.30891733
    },
    "timestamp": 1694930371000,
    "accuracy": 1,
    "speed": 8,
    "bearing": 25,
    "altitude": 110.5,
    "meta_data": {
      "test": "location 2"
    }
  }
}
```

### Second Idle Event payload

```json
{
  "asset_id": "a39f8299-e19a-4484-9775-be8ae40f75c9",
  "geofence_id": "",
  "monitor_id": "1d1b20f1-5f33-4a37-833d-119898b18ff9",
  "monitor_tags": [],
  "event_type": "idle",
  "timestamp": 1694930371000,
  "triggered_timestamp": 1694930371000,
  "triggered_location": {
    "location": {
      "lat": 34.01091081,
      "lon": -118.30891733
    },
    "timestamp": 1694930371000,
    "accuracy": 1,
    "speed": 8,
    "bearing": 25,
    "altitude": 110.5,
    "meta_data": {
      "test": "location 2"
    }
  }
}
```

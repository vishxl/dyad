# Receive Speeding Alerts

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
            "name": "Staff Transportation 003",
            "description": "Live Tracking Speeding Event Example",
            "attributes": {
                "driver_contact_no": "321-902-838",
                "driver_name": "James Smith",
                "license": "4 ES 7167",
                "vehicle_type": "Delivery"
            }
}'
```

As soon as the asset is created, we get the asset ID in the acknowledgement response. Please record this ID. For our example, the asset ID is:

```json
{
  "status": "Ok",
  "data": {
    "id": "683a3672-8eb3-4ec2-a1b9-1bdc2743d491"
  }
}
```

### **Step 2**: Bind a device to the Asset

Next step is to bind a GPS device to the asset which can upload the location and other information for the `asset`. Please note that the same device can be used for multiple assets, but one asset can be attached to only one device at a time.

```bash
curl --location 'https://api.nextbillion.io/skynet/asset/683a3672-8eb3-4ec2-a1b9-1bdc2743d491/bind?key=<your_api_key>' \
--header 'Content-Type: application/json' \
--data '{
    "device_id":"GAW-A1-FB-JT0312"
}'
```

As soon as the binding process is successful, we get an acknowledgement response from the API:

```json
{
  "status": "Ok"
}
```

### **Step 3**: Define the Speeding configurations

Live Tracking API gives users the flexibility to set their own criteria of determining speeding states. Speeding is a state that an asset exhibits when it maintains a speed higher than a specified threshold for a duration higher than a given value. The API uses the GPS information received from the asset to determine the speed maintained by the asset for a given amount of time.

The rules for speeding state are set using three attributes - `time_tolerance`, `customer_speed_limit` and `use_admin_speed_limit`. The amount of time for which an asset needs to over-speed before triggering a speeding alert is set using `time_tolereance`. For speed limits, users have a choice to select which type speed limit is used for monitoring. If they prefer custom speeds, then they can use `customer_speed_limit` to specify the desired speeds while keeping the `use_admin_speed_limit` flag as false. Otherwise, they can set the `use_admin_speed_limit` flag to true to use administrative speed limits for monitoring.

For our example, we are using custom speed limits and configure a speed of 18 m/sec as the threshold and set the `use_admin_speed_limit` as false. Readers encouraged to try the administrative speed limits as well. Next, we set the `time_tolerance` at 35000 milliseconds (i.e. 35 sec). It is worth highlighting here that in order to create a speeding event, the asset needs to maintain a higher speed continuously for a duration more than the `time_tolerance` duration. If the speed of the asset is equal to or if it falls below the speed limit, the asset is not considered to be speeding. We will cover a scenario to showcase this in the [Create Speeding Alert](#create-speeding-event) section.

Following is the `speeding_config` object that we use:

```json
"speeding_config":{
"time_tolerance": 35000,
"customer_speed_limit":18,
"use_admin_speed_limit": false
}
```

### **Step 4**: Create a Monitor

Now that we have an `asset` and the “speeding” configurations, let’s set up a monitoring criteria using a `monitor`. To create a monitor, we need to:

- Specify the `type` of activity that we want to track. Since we want to track overspeeding instances of the asset, we set this value to `speeding`.

- Specify the `speeding_config` attributes to model the configurations decided in the Step 3 above. This configuration will be used by the monitor to identify instances of overspeeding.

- Ensure that `asset` is successfully linked with `monitor`. It is worth noting that only those assets which share all of their attributes with a `monitor` are linked with it. For our example, we add the same attributes for the `monitor` as that of the `asset` for the sake of simplicity.

- Optionally, add `name` and `description` for the `monitor`.

Below is the JSON we built for creating the monitor:

```bash
curl --location 'https://api.nextbillion.io/skynet/monitor?key=<your_api_key>' \
--header 'Content-Type: application/json' \
--data '{
"type":"speeding",
"speeding_config":{
    "time_tolerance": 35000,
    "customer_speed_limit":18,
    "use_admin_speed_limit": false
    },
"name": "Delivery Monitor The Ritz Hotel, Los Angeles",
"description": "Track speeding activity of the delivery vehicle",
"match_filter":{
"include_all_of_attributes":{
                "driver_contact_no": "321-902-838",
                "driver_name": "James Smith",
                "license": "4 ES 7167",
                "vehicle_type": "Delivery"
                }
}
}'
```

Please record the `monitor` ID from the API response:

```json
{
  "status": "Ok",
  "data": {
    "id": "36c171d5-bdf1-47c2-9531-4c02820ab70e"
  }
}
```

Now that our asset and monitoring set up is done, we move to the next part that deals with capturing the events once they are created. Live Tracking API uses webhooks to share the event information. Let’s see how to configure a webhook.

Alternatively, readers can also constantly poll the **[Event History of an Asset](https://docs.nextbillion.ai/tracking/live-tracking-api#event-history-of-an-asset)** method to retrieve new events.

### **Step 5**: Configure a Webhook

Readers should obtain a webhook URL from their application where they want to receive the information of events created. In our example, we are using a webhook URL provided by a messenger. Using this webhook results in the event information being sent to the messenger as a notification whenever an event is created.

Although we use a test webhook URL - `https://my-company/api/test_webhook` - in this tutorial to guide readers through the process, we recommend using an actual webhook URL while trying this tutorial

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

## Create Speeding Event

Now that setup is done, let’s start uploading the locations for the asset’s movement. We will upload a series of locations to demonstrate how speeding events work. In a practical scenario, however, these updates would be automatically sent by the GPS device that is bound to the given `asset`.

Let’s take a look at following list of sample locations and their attributes:

| Location   | Speed at the tracked location | Time elapsed after receiving last tracking information | Timer Value | Speeding alert created? |
| ---------- | ----------------------------- | ------------------------------------------------------ | ----------- | ----------------------- |
| Location 1 | 12                            | –                                                      | 0 sec       | –                       |
| Location 2 | 21                            | 16 sec                                                 | 0 sec       | No                      |
| Location 3 | 16                            | 13 sec                                                 | 0 sec       | No                      |
| Location 4 | 19                            | 12 sec                                                 | 0 sec       | No                      |
| Location 5 | 32                            | 23 sec                                                 | 23 sec      | No                      |
| Location 6 | 35                            | 31 sec                                                 | 54 sec      | Yes                     |
| Location 7 | 25                            | 16 sec                                                 | 70 sec      | Yes                     |
| Location 8 | 11                            | 20 sec                                                 | 0 sec       | No                      |

Before we analyze the above data, remember we configured `time_tolerance` at 35000 milliseconds (35 seconds) and `customer_speed_limit` at 18 m/s as speeding state configurations in our `monitor`. From the above table we can observe that, speed does exceed 18 m/s threshold at location 2 and the timer starts, but since the speed at next location falls below the speed limit, the timer resets to 0 at location 3. Had the speed at location 3 been more than the speed limit, timer would have accumulated the seconds elapsed after location 2.

However, from location 4 onwards the asset is continuously traveling at a speed more than 18 ms/s until location 7. The timer also starts from location 4 and continues to accumulate seconds through locations 5, 6 and 7. The speeding alert is created for locations 6 and 7 as both speed value and timer value at these locations are greater than specified thresholds of 18 m/s and 35 seconds respectively. Do note that location 5 does not trigger the event as the timer value is still lower than `time_threshold`. Timer resets to 0 at location 8 as the speed falls below the speed limit.

The above track distribution when modeled into a upload JSON results in below script:

```bash
curl --location 'https://api.nextbillion.io/skynet/asset/683a3672-8eb3-4ec2-a1b9-1bdc2743d491/track?key=<your_api_key>' \
--header 'Content-Type: application/json' \
--data '{
    "locations":[
        {
        "location":{
            "lat": 34.04209996,
            "lon": -118.25563815
        },
        "timestamp":1694930360000,
        "accuracy":2,
        "speed":12,
        "bearing":25,
        "altitude":110.5,
        "meta_data":{
            "test": "location 1"
        }
        },
        {
        "location":{
            "lat": 34.04034565,
            "lon": -118.25688621
        },
        "timestamp":1694930376000,
        "accuracy":1,
        "speed":21,
        "bearing":25,
        "altitude":110.5,
        "meta_data":{
            "test": "location 2"
        }
        },
        {
        "location":{
            "lat": 34.03943185,
            "lon": -118.25870229
        },
        "timestamp":1694930389000,
        "accuracy":7,
        "speed":16,
        "bearing":25,
        "altitude":100.5,
        "meta_data":{
            "test": "location 3"
        }
        },
        {
        "location":{
            "lat": 34.03852984,
            "lon": -118.26134074
        },
        "timestamp":1694930401000,
        "accuracy":7,
        "speed":19,
        "bearing":25,
        "altitude":100.5,
        "meta_data":{
            "test": "location 4"
        }
        },
        {
        "location":{
            "lat": 34.03930722,
            "lon": -118.26526147
        },
        "timestamp":1694930424000,
        "accuracy":7,
        "speed":32,
        "bearing":25,
        "altitude":100.5,
        "meta_data":{
            "test": "location 5"
        }
        },
        {
        "location":{
            "lat": 34.03776894,
            "lon": -118.26990692
        },
        "timestamp":1694930455000,
        "accuracy":7,
        "speed":35,
        "bearing":25,
        "altitude":100.5,
        "meta_data":{
            "test": "location 6"
        }
        },
        {
        "location":{
            "lat": 34.03404769,
            "lon": -118.27223711
        },
        "timestamp":1694930471000,
        "accuracy":7,
        "speed":25,
        "bearing":25,
        "altitude":100.5,
        "meta_data":{
            "test": "location 7"
        }
        },
        {
        "location":{
            "lat": 34.03233502,
            "lon": -118.27334749
        },
        "timestamp":1694930491000,
        "accuracy":7,
        "speed":11,
        "bearing":25,
        "altitude":100.5,
        "meta_data":{
            "test": "location 8"
        }
        }
    ],
    "device_id":"GAW-A1-FB-JT0312"
}'
```

As soon as the above locations are uploaded, the speeding criteria of the monitor is satisfied for a couple of locations (location 6 and location 7) and the following events are received on our configured webhook.

### First Speeding Event payload

```json
{
  "asset_id": "683a3672-8eb3-4ec2-a1b9-1bdc2743d491",
  "geofence_id": "",
  "monitor_id": "36c171d5-bdf1-47c2-9531-4c02820ab70e",
  "monitor_tags": [],
  "event_type": "speeding",
  "timestamp": 1694930455000,
  "triggered_timestamp": 1694930455000,
  "triggered_location": {
    "location": {
      "lat": 34.03776894,
      "lon": -118.26990692
    },
    "timestamp": 1694930455000,
    "accuracy": 7,
    "speed": 35,
    "bearing": 25,
    "altitude": 100.5,
    "meta_data": {
      "test": "location 6"
    }
  },
  "extra": {
    "speed_limit": 18
  }
}
```

### Second Speeding Event payload

```json
{
  "asset_id": "683a3672-8eb3-4ec2-a1b9-1bdc2743d491",
  "geofence_id": "",
  "monitor_id": "36c171d5-bdf1-47c2-9531-4c02820ab70e",
  "monitor_tags": [],
  "event_type": "speeding",
  "timestamp": 1694930471001,
  "triggered_timestamp": 1694930471000,
  "triggered_location": {
    "location": {
      "lat": 34.03404769,
      "lon": 118.27223711
    },
    "timestamp": 1694930471000,
    "accuracy": 7,
    "speed": 25,
    "bearing": 25,
    "altitude": 100.5,
    "meta_data": {
      "test": "location 7"
    }
  },
  "extra": {
    "speed_limit": 18
  }
}
```

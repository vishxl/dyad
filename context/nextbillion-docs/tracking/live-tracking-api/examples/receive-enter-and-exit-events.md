# Receive enter and exit events

Live Tracking API can be used to get real time alerts based on asset movement and activity. In this example we will present a step by step guide of how to receive events on a configured webhook, when an asset moves into or out of an area of interest.

## Get Started

Readers would need a valid NextBillion API key to try this example out. If you don’t have one, please contact us to get your API key now!

## APIs used

- Live Tracking API

- Geofence API

## Setup

Once you have a valid API Key, you can start setting up the components to be used in this example. Let’s take a look at them below.

### **Step 1**: Create Asset

Having received a valid key, let’s kick start the setup process by creating an asset whose activity we want to track. To create an asset, we will

- Give a meaningful name to `asset`

- Add the attributes of the asset that will be used to associate the `asset` to a `monitor`

- Though we are not specifying any custom ID in this example, but user’s can provide a custom ID to the asset, if preferred.

Following is the Asset JSON that is used for this example:

```bash
curl --location 'https://api.nextbillion.io/skynet/asset?key=<your_api_key>'
--header 'Content-Type: application/json'
--data '{
            "name": "Staff Transportation 001",
            "description": "Live Tracking Enter & Exit Event Example",
            "attributes": {
                "driver_contact_no": "422-583-651",
                "driver_name": "John Luther",
                "license": "2 DS 3236",
                "vehicle_type": "SUV"
            }
}'
```

As soon as the asset is created, we get the asset ID in the acknowledgement response. Please record this ID. For our example, the asset ID is:

```json
{
  "status": "Ok",
  "data": {
    "id": "eb51687b-2f1d-4a50-bae5-73a6d6e5e77f"
  }
}
```

### **Step 2**: Bind a device to the Asset

Next step is to bind a GPS device to the asset which can upload the location and other information for the `asset`. Please note that the same device can be used for multiple assets, but one asset can be attached to only one device at a time.

```bash
curl --location 'https://api.nextbillion.io/skynet/asset/eb51687b-2f1d-4a50-bae5-73a6d6e5e77f/bind?key=<your_api_key>' \
--header 'Content-Type: application/json' \
--data '{
    "device_id":"APL-14-iOS-X43V21F"
}'
```

As soon as the binding process is successful, we get an acknowledgement response from the API:

```json
{
  "status": "Ok"
}
```

### **Step 3**: Set up a Geofence

Geofences are geographic boundaries that are used to mark an area of interest. For our example we create a new geofence using NextBillion.ai’s Geofence API. We create a `polygon` type geofence using geoJSON input around an area of interest in Los Angeles city. Live Tracking API can work seamlessly with any other types of geofences - isochrone or circle - as well. Readers are encouraged to try other types of geofence as well.

For our geofence, we specify:

- The `type` of the geofence as `polygon`

- `name` of the geofence

- `geojson` object with details of the coordinates forming the polygon. If the readers are creating their own polygons, it is worth mentioning that the geofence should be closed, not contain any intersecting boundaries, and should not contain other polygons.

Below is the ‘Create a Geofence’ JSON script we use for this example:

```bash
curl --location 'https: //api.nextbillion.io/geofence?key=<your_api_key>' \
--header 'Content-Type: application/json' \
--data '{
    "polygon": {
        "geojson": {
            "type": "Polygon",
            "coordinates": [
                [
                    [
                        -118.268312,
                        34.046253
                    ],
                    [
                        -118.269707,
                        34.045097
                    ],
                    [
                        -118.270963,
                        34.042996
                    ],
                    [
                        -118.266940,
                        34.042149
                    ],
                    [
                        -118.264289,
                        34.044904
                    ],
                    [
                        -118.264661,
                        34.046638
                    ],
                    [
                        -118.266777,
                        34.047255
                    ],
                    [
                        -118.268312,
                        34.046253
                    ]
                ]
            ]
        }
    },
    "meta_data": {
        "purpose": "plolygon_example_geofence",
        "area": "Los Angeles"
    },
    "type": "polygon",
    "name": "The Ritz Carlton, Los Angeles polygon"
}'
```

Once the geofence is created, we get the asset ID in the acknowledgement response. Please record this ID. For our example, the asset ID is:

```json
{
  "status": "Ok",
  "data": {
    "id": "7d1b861c-67b8-4128-aef8-179a605263c4"
  }
}
```

### **Step 4**: Create a Monitor

Now that we have an `asset` and a `geofence`, let’s set up a monitoring criteria using a `monitor`. To create a monitor, we need to:

- Specify the `type` of activity that we want to track. Since we want to track both events of asset entering and leaving the geofence, we set this value to `enter_and_exit`. Readers can set up only `enter` or only `exit` type of monitor, if they wish.

- Specify the ID of the geofence that we want to use for creating events.

- Ensure that `asset` is successfully linked with `monitor`. It is worth noting that only those assets which share all of their attributes with a `monitor` are linked with it. For our example, we add the same attributes for the `monitor` as that of the `asset` for the sake of simplicity.

- Optionally, add `name` and `description` for the `monitor`.

Below is the JSON we built for creating the monitor:

```bash
curl --location 'https: //api.nextbillion.io/skynet/monitor?key=<your_api_key>' \
--header 'Content-Type: application/json' \
--data '{
    "type": "enter_and_exit",
    "geofence_config": {
        "geofence_ids": [
            "7d1b861c-67b8-4128-aef8-179a605263c4"
        ]
    },
    "name": "Monitor The Ritz Hotel, Los Angeles",
    "description": "Track activity related to free staff transportation service",
    "match_filter": {
        "include_all_of_attributes": {
            "driver_contact_no": "422-583-651",
            "driver_name": "John Luther",
            "license": "2 DS 3236",
            "vehicle_type": "SUV"
        }
    }
}'
```

Please record the `monitor` ID from the API response:

```json
{
  "status": "Ok",
  "data": {
    "id": "dae3b4bd-2402-4b53-83dd-c094b79d02cc"
  }
}
```

Now that our asset and monitoring set up is done, we move to the next part that deals with capturing the events once they are created. Live Tracking API uses webhooks to share the event information. Let’s see how to configure a webhook.

Alternatively, readers can also constantly poll the **[Event History of an Asset](https://docs.nextbillion.ai/tracking/live-tracking-api#event-history-of-an-asset)** method to retrieve new events.

### **Step 5**: Configure a Webhook

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
Asset f1ceb76d-2665-4f72-bc56-aae91c4953e3 Trigger enter event at 2022-09-08 09: 31: 19 Data: {
    "asset_id": "f1ceb76d-2665-4f72-bc56-aae91c4953e3",
    "geofence_id": "350706bf-cc3b-4e74-a66c-c7f050944c47",
    "monitor_id": "8a8ecd4b-f8b2-49ed-8097-b114ce53e4db",
    "monitor_tags": [
        "america",
        "newyork"
    ],
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

## Upload non-intervening locations

Now that setup is done, let’s start uploading the locations for the asset’s movement. Initially we will only upload the locations which do not trigger an enter or exit type of event. We will start from a point outside the geofence and remain outside it

We use the following JSON to upload 3 locations for the asset. In a practical scenario, these updates would be automatically sent by the GPS device that is bound to the given `asset`.

```bash
curl --location 'https: //api.nextbillion.io/skynet/asset/eb51687b-2f1d-4a50-bae5-73a6d6e5e77f/track?key=<your_api_key>' \
--header 'Content-Type: application/json' \
--data '{
    "locations": [
        {
            "location": {
                "lat": 34.044029708304464,
                "lon": -118.27547605693337
            },
            "timestamp": 1686729177000,
            "accuracy": 2,
            "speed": 5,
            "bearing": 25,
            "altitude": 110.5,
            "meta_data": {
                "test": "location_outside_geofence"
            }
        },
        {
            "location": {
                "lat": 34.04298792573917,
                "lon": -118.2733272833076
            },
            "timestamp": 1686729477000,
            "accuracy": 1,
            "speed": 8,
            "bearing": 25,
            "altitude": 110.5,
            "meta_data": {
                "test": "location_outside_geofence"
            }
        },
        {
            "location": {
                "lat": 34.04510936036783,
                "lon": -118.26998982639944
            },
            "timestamp": 1686730017000,
            "accuracy": 7,
            "speed": 12,
            "bearing": 25,
            "altitude": 100.5,
            "meta_data": {
                "test": "location_outside_geofence"
            }
        }
    ],
    "device_id": "APL-14-iOS-X43V21F"
}'
```

Once the locations are uploaded, readers can use the Track locations of an Asset method and verify the track information using the following request:

```bash
curl --location 'https://api.nextbillion.io/skynet/asset/eb51687b-2f1d-4a50-bae5-73a6d6e5e77f/location/list?key=<your_api_key>&geometry_type=geojson'
```

## Create Enter Event

Taking the journey of our `asset` ahead we start off from the point we left and then take it to a point inside the geofence that we created in Step 3. Following is the JSON we use at this step to upload track information:

```bash
curl --location 'https: //api.nextbillion.io/skynet/asset/eb51687b-2f1d-4a50-bae5-73a6d6e5e77f/track?key=<your_api_key>' \
--header 'Content-Type: application/json' \
--data '{
    "locations": [
        {
            "location": {
                "lat": 34.045012,
                "lon": -118.269904
            },
            "timestamp": 1694930400000,
            "accuracy": 2,
            "speed": 5,
            "bearing": 25,
            "altitude": 110.5,
            "meta_data": {
                "test": "location_outside_geofence"
            }
        },
        {
            "location": {
                "lat": 34.044143356537376,
                "lon": -118.26809250500608
            },
            "timestamp": 1694930410000,
            "accuracy": 1,
            "speed": 8,
            "bearing": 25,
            "altitude": 110.5,
            "meta_data": {
                "test": "location_inside_geofence"
            }
        },
        {
            "location": {
                "lat": 34.045904884671515,
                "lon": -118.26690382172373
            },
            "timestamp": 1694930420000,
            "accuracy": 7,
            "speed": 12,
            "bearing": 25,
            "altitude": 100.5,
            "meta_data": {
                "test": "location_inside_geofence"
            }
        }
    ],
    "device_id": "APL-14-iOS-X43V21F"
}'
```

As soon as the first location inside the geofence is uploaded the enter criteria of the monitor is satisfied and the following event information is received on our configured webhook.

```bash
Asset eb51687b-2f1d-4a50-bae5-73a6d6e5e77f Trigger enter event at 2023-09-17 06: 00: 10 Data: {
    "asset_id": "eb51687b-2f1d-4a50-bae5-73a6d6e5e77f",
    "geofence_id": "7d1b861c-67b8-4128-aef8-179a605263c4",
    "monitor_id": "dae3b4bd-2402-4b53-83dd-c094b79d02cc",
    "monitor_tags": [],
    "event_type": "enter",
    "timestamp": 1694930410000,
    "triggered_timestamp": 1694930410000,
    "triggered_location": {
        "location": {
            "lat": 34.044143356537376,
            "lon": -118.26809250500608
        },
        "timestamp": 1694930410000,
        "accuracy": 1,
        "speed": 8,
        "bearing": 25,
        "altitude": 110.5,
        "meta_data": {
            "test": "location_inside_geofence"
        }
    },
    "prev_location": {
        "location": {
            "lat": 34.045012,
            "lon": -118.269904
        },
        "timestamp": 1694930400000,
        "accuracy": 2,
        "speed": 5,
        "bearing": 25,
        "altitude": 110.5,
        "meta_data": {
            "test": "location_outside_geofence"
        }
    }
}
```

## Create Exit Event

On the next leg of the journey of our `asset` we start off from a point inside the geofence and move towards exiting it. Following is the JSON we use at this step:

```bash
curl --location 'https: //api.nextbillion.io/skynet/asset/eb51687b-2f1d-4a50-bae5-73a6d6e5e77f/track?key=<your_api_key>' \
--header 'Content-Type: application/json' \
--data '{
    "locations": [
        {
            "lat": 34.04560182867391,
            "lon": -118.26626376149477
        },
        "timestamp": 1694930430000,
        "accuracy": 7,
        "speed": 12,
        "bearing": 25,
        "altitude": 100.5,
        "meta_data": {
            "test": "location_inside_geofence"
        }
    },
    {
        "location": {
            "lat": 34.04704133501632,
            "lon": -118.26470932951017
        },
        "timestamp": 1694930440000,
        "accuracy": 7,
        "speed": 12,
        "bearing": 25,
        "altitude": 100.5,
        "meta_data": {
            "test": "location_outside_geofence"
        }
    }
],
"device_id": "APL-14-iOS-X43V21F"
}'
```

Notice that the first 2 points are inside the geofence and the last point is outside the geofence that we had created. As soon as the last point is uploaded, we get following event payload sent to the configured webhook URL:

```bash
{
    "asset_id": "eb51687b-2f1d-4a50-bae5-73a6d6e5e77f",
    "geofence_id": "7d1b861c-67b8-4128-aef8-179a605263c4",
    "monitor_id": "dae3b4bd-2402-4b53-83dd-c094b79d02cc",
    "monitor_tags": [],
    "event_type": "exit",
    "timestamp": 1694930440001,
    "triggered_timestamp": 1694930440000,
    "triggered_location": {
        "location": {
            "lat": 34.04704133501632,
            "lon": -118.26470932951017
        },
        "timestamp": 1694930440000,
        "accuracy": 7,
        "speed": 12,
        "bearing": 25,
        "altitude": 100.5,
        "meta_data": {
            "test": "location_outside_geofence"
        }
    },
    "prev_location": {
        "location": {
            "lat": 34.04560182867391,
            "lon": -118.26626376149477
        },
        "timestamp": 1694930430000,
        "accuracy": 7,
        "speed": 12,
        "bearing": 25,
        "altitude": 100.5,
        "meta_data": {
            "test": "location_inside_geofence"
        }
    }
}
```

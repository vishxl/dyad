# Samsara Telematics Integration with NextBillion.ai

In the following sections, we'll go over how to integrate Samsara Telematics with the NextBillion.ai Route Optimization API. Each step will be detailed to ensure a successful and efficient integration process, from obtaining API keys and setting up authentication to designing data pipelines and interpreting response data.

## Prerequisites

Before integrating Samsara Telematics and NextBillion.ai's Route Optimization API, make sure you have the following prerequisites in place:

### Samsara API Token with Read/Write Permissions

Obtain a valid API token with both read and write scopes from your Samsara account. This token will be used to gain secure access to and retrieve data from your Samsara telematics system.

### API Key from NextBillion.ai

Check that you have a valid API key from NextBillion.ai. This key will be used to provide secure authentication when interacting with NextBillion.ai's services.

### Samsara Asset Tracker

Ensure that the Samsara asset tracker is properly installed and configured on your drivers' vehicles. This device will transmit real-time telematics data that will be integrated with NextBillion.ai’s Route Optimization API.

By ensuring that these prerequisites are met, you will pave the way for a smooth and secure integration, allowing you to leverage the combined power of Samsara's telematics insights and NextBillion.ai's optimization capabilities for improved fleet management.

## Connect and Import Data from Samsara

To effectively leverage the capabilities of both Samsara's telematics and NextBillion.ai's Route Optimization API, a seamless data integration process is required. You can unlock the power of advanced route optimization by pulling critical information from your Samsara account and orchestrating a smooth connection to the NextBillion.ai platform. This guide will walk you through the steps of pulling addresses, assets (vehicles), drivers, and addresses from Samsara and integrating them with Nextbillion.ai’s Route Optimization API.

### Login to NextBillion.ai Account

Begin by logging into your NextBillion.ai account. This is your central hub for managing and accessing your API keys. API key is required to authenticate the requests made by the user.

### Integrating Samsara Telematics with NextBillion.ai

To integrate Samsara Telematics with your NCC dashboard, [Contact support](https://nextbillion.ai/contact-us?utm_source=Integrations_samsara&utm_medium=docs&utm_campaign=onpage). We will help you navigate through the process.

### Pull List of Addresses

Initiate a data pull from Samsara to extract a list of addresses where your deliveries or pickups are planned. These addresses are crucial for accurate route optimization.

#### API Request

```bash
# Fetch addresses from Samsara Telematics Dashboard
curl --request GET \
    --url https://api.samsara.com/addresses
```

#### API Response

```json
"data": [
    {
        "id": "68913795",
        "name": "Tuttle Crossing",
        "createdAtTime": "2023-07-21T00:29:59.968745Z",
        "formattedAddress": "Tuttle Crossing, Dublin, Ohio 43016",
        "geofence": {
            "circle": {
                "latitude": 40.0784625,
                "longitude": -83.1287112,
                "radiusMeters": 360
            }
        },
        "latitude": 40.0784625,
        "longitude": -83.1287112
    },
    {
        "id": "69020143",
        "name": "Dublin Pool",
        "createdAtTime": "2023-07-21T11:03:00.814447Z",
        "formattedAddress": "dublin community pool, dublin oh 43017",
        "geofence": {
            "circle": {
                "latitude": 40.1229158,
                "longitude": -83.1442514,
                "radiusMeters": 250
            }
        },
        "latitude": 40.1229158,
        "longitude": -83.1442514
    },
    {
        "id": "70232689",
        "name": "Brandon Park",
        "createdAtTime": "2023-07-26T17:54:47.462049Z",
        "formattedAddress": "Brandon Park Dublin OH 43017",
        "geofence": {
            "circle": {
                "latitude": 40.1259995,
                "longitude": -83.1306475,
                "radiusMeters": 162
            },
            "settings": {
                "showAddresses": false
            }
        },
        "latitude": 40.1259995,
        "longitude": -83.1306475
    },
    {
        "id": "70232810",
        "name": "Carrigan Ridge",
        "createdAtTime": "2023-07-26T17:55:39.892546Z",
        "formattedAddress": "4837 Carrigan Ridge Dr, Dublin, OH 43017, USA",
        "geofence": {
            "circle": {
                "latitude": 40.13228346371899,
                "longitude": -83.11910591484421,
                "radiusMeters": 100
            },
            "settings": {
                "showAddresses": false
            }
        },
        "latitude": 40.13228346371899,
        "longitude": -83.11910591484421
    },
    {
        "id": "70232853",
        "name": "Ashford",
        "createdAtTime": "2023-07-26T17:56:01.820412Z",
        "formattedAddress": "5495 Ashford Rd, Dublin, OH 43017, USA",
        "geofence": {
            "circle": {
                "latitude": 40.130642879687194,
                "longitude": -83.13425503136033,
                "radiusMeters": 93
            },
            "settings": {
                "showAddresses": true
            }
        },
        "latitude": 40.130642879687194,
        "longitude": -83.13425503136033
    },
    {
        "id": "70474188",
        "name": "Matt",
        "createdAtTime": "2023-07-27T14:18:27.457235Z",
        "formattedAddress": "Matt the Millers Dublin OH",
        "geofence": {
            "circle": {
                "latitude": 40.1060565,
                "longitude": -83.1609646,
                "radiusMeters": 260
            }
        },
        "latitude": 40.1060565,
        "longitude": -83.1609646
    },
    {
        "id": "70816049",
        "name": "Tuccis",
        "createdAtTime": "2023-07-28T20:41:20.862933Z",
        "formattedAddress": "Tucci's Dublin OH 43017",
        "geofence": {
            "circle": {
                "latitude": 40.1002547,
                "longitude": -83.11442760000001,
                "radiusMeters": 961
            },
            "settings": {
                "showAddresses": false
            }
        },
        "latitude": 40.1002547,
        "longitude": -83.11442760000001
    },
    {
        "id": "72221870",
        "name": "Library",
        "createdAtTime": "2023-08-03T12:29:40.276738Z",
        "formattedAddress": "dublin public library, dublin, oh 43017",
        "geofence": {
            "circle": {
                "latitude": 40.115674,
                "longitude": -83.13273319999999,
                "radiusMeters": 350
            }
        },
        "latitude": 40.115674,
        "longitude": -83.13273319999999
    },
    {
        "id": "73117679",
        "name": "Welch 2",
        "createdAtTime": "2023-08-07T13:45:23.217399Z",
        "formattedAddress": "6865 Dulles Dr, Powell, OH 43065, USA",
        "geofence": {
            "circle": {
                "latitude": 40.20511242770415,
                "longitude": -83.10496092298392,
                "radiusMeters": 307
            },
            "settings": {
                "showAddresses": false
            }
        },
        "latitude": 40.20511242770415,
        "longitude": -83.10496092298392
    },
    {
        "id": "73174391",
        "name": "SR33-1",
        "createdAtTime": "2023-08-07T18:57:20.113356Z",
        "formattedAddress": "880 Colemans Crossing Blvd, Marysville, OH 43040, USA",
        "geofence": {
            "circle": {
                "latitude": 40.23075414420927,
                "longitude": -83.33725928206681,
                "radiusMeters": 250
            },
            "settings": {
                "showAddresses": false
            }
        },
        "latitude": 40.23075414420927,
        "longitude": -83.33725928206681
    },
    {
        "id": "73174447",
        "name": "SR33-2",
        "createdAtTime": "2023-08-07T18:57:54.658614Z",
        "formattedAddress": "US-33, Marysville, OH 43040, USA",
        "geofence": {
            "circle": {
                "latitude": 40.21432062120889,
                "longitude": -83.3077934597623,
                "radiusMeters": 250
            },
            "settings": {
                "showAddresses": false
            }
        },
        "latitude": 40.21432062120889,
        "longitude": -83.3077934597623
    },
    {
        "id": "73174499",
        "name": "SR42-1",
        "createdAtTime": "2023-08-07T18:58:17.316922Z",
        "formattedAddress": "11144 US-42, Plain City, OH 43064, USA",
        "geofence": {
            "circle": {
                "latitude": 40.177217479800646,
                "longitude": -83.2152583881994,
                "radiusMeters": 250
            },
            "settings": {
                "showAddresses": false
            }
        },
        "latitude": 40.177217479800646,
        "longitude": -83.2152583881994
    }
],
"pagination": {
    "endCursor": "",
    "hasNextPage": false
}
```

Upon the successful retrieval of the address list, the frontend shall look like as the dashboard depicted below.

![documentation image](/integrations/samsara/integration-1.png)

### Fetch Asset (Vehicle) Information

Retrieve a list of your assets, which represent your vehicles. This information will be used to optimize routes based on vehicle capacity and other parameters.

```bash
curl --request GET \
    --url https://api.samsara.com/fleet/vehicles
```

The following image depicts the dashboard with vehicles data.

![documentation image](/integrations/samsara/integration-2.png)

### Obtain Driver Details

Extract the data regarding your drivers, including their availability, name and other details. This ensures that route assignments align with driver capabilities.

```bash
curl --request GET \
    --url https://api.samsara.com/fleet/drivers
```

The drivers data will look like the following dashboard upon successfull retrieval.

![documentation image](/integrations/samsara/integration-3.png)

The integrated dashboard will look something like this after successfully fetching all the necessary data.

![documentation image](/integrations/samsara/integration-4.png)

### Create Jobs with Route Optimization API

Using NextBillion.ai's Route Optimization API, create optimization jobs.

#### POST API Request

The following API request sends data to NextBillion.ai’s Route Optimization API to create optimization jobs based on certain parameters. The response confirms the creation of jobs.

```json
{
  "request": {
    "url": "https://api.nextbillion.io/optimization/v2?key=<your_api_key>",
    "method": "POST",
    "body": "{\"location_index\":0,\"service\":120,\"priority\":0,\"time_windows\":[[1692671400,1692689400]]},{\"id\":73611245,\"description\":// Rest of the locations...],\"vehicles\":[{\"id\":47390364,\"start_index\":9,\"time_window\":[1692671400,1692689400],\"breaks\":[],\"max_tasks\":25,\"costs\":{\"fixed\":0}}],\"options\":{\"routing\":{\"mode\":\"car\"}}}",
    "headers": {
      "Content-Type": "application/json",
      "ot-baggage-requestId": "undefined",
      "x-datadog-trace-id": "8353104637349579618",
      "x-datadog-parent-id": "3667167573625418059",
      "x-datadog-sampling-priority": "-1",
      "traceparent": "00-000000000000000073ec306938e3cb62-32e4657a8dc6314b-00",
      "tracestate": "dd=s:-1",
      "X-Forwarded-For": "183.82.31.124"
    }
  },
  "response": {
    "data": {
      "id": "2bda4ef824fa6c290e82b626ed85a8b3",
      "message": "Optimization job created",
      "status": "Ok",
      ]
    },
    "headers": {
      "server": [
        "nginx/1.25.2"
      ],
      "date": [
        "Tue, 22 Aug 2023 08:22:36 GMT"
      ],
      "content-type": [
        "application/json; charset=utf-8"
      ],
      "content-length": [
        "134"
 ],
      "access-control-allow-origin": [
        "*"
      ],
      "access-control-allow-headers": [
        "authorization"
      ],
      "access-control-allow-methods": [
        "DELETE,GET,HEAD,PUT,PATCH,POST,OPTIONS"
      ],
      "strict-transport-security": [
        "max-age=15724800; includeSubDomains"
      ],
      "via": [
        "1.1 google"
      ],
      "alt-svc": [
        "h3=\":443\"; ma=2592000,h3-29=\":443\"; ma=2592000"
      ]
    },
    "status": 200,
    "statusText": "OK"
  }
}
```

#### Post API Response

```json
{
  "id": "2bda4ef824fa6c290e82b626ed85a8b3",
  "message": "Optimization job created",
  "status": "Ok"
}
```

#### Example JSON Response

```json
{
  "result": {
    "code": 0,
    "summary": {
      "cost": 3042,
      "routes": 1,
      "unassigned": 0,
      "setup": 0,
      "service": 960,
      "duration": 3042,
      "waiting_time": 0,
      "priority": 0,
      "distance": 34783.899999999994
    },

    "routes": [
      {
        "vehicle": 47390364,
        "cost": 3042,
        "steps": [
          {
            "type": "start",
            "arrival": 1692671400,
            "duration": 0,
            "setup": 0,
            "service": 0,
            "waiting_time": 0,
            "location": [40.1177, -83.1265],
            "location_index": 9
          },
          {
            "type": "job",
            "arrival": 1692671776,
            "duration": 376,
            "setup": 0,
            "service": 120,
            "waiting_time": 0,
            "location": [40.1337656, -83.1773764]
            // Rest of the jobs…
          }
        ],
        "setup": 0,
        "service": 960,
        "duration": 3042,
        "waiting_time": 0,
        "priority": 0,
        "distance": 34783.899999999994,
        "geometry": "enzsFrsjzNChCAnAA`... "
      }
    ]
  },
  "status": "Ok",
  "message": ""
}
```

### Integration with Route Optimization API

After successfully pulling the necessary data from Samsara, integrate the fetched data with Route Optimization using the following API endpoint.

```bash
GET https://api.nextbillion.io/optimization/v2/result?id={{nbaiOptimizationRun.data.id}}&key={{localStorage.values.apiKey}}
```

Map the fetched Samsara data to the respective API parameters. Configure optimization settings such as shift start and end time, service time, and start and end location coordinates.

```javascript

      btnSendSamsara.setDisabled(true);
    let locations = [];
    let jobs = [];
    let shipments = [];
    vehicles = [];
    veh_attr = [];
    stop_attr = [];
    // sequence through all stops and create job array while
    // also creating the indexed list of locations
    let location_index = 0;
    let location = [];
    tblStops.data.forEach(planstop => {

        let job = {
            id: parseInt(planstop.id),
            description: planstop.name,
            location_index: location_index++,
            service: numberInput1.value,
            priority: 0,
            time_windows: [[shiftStart,shiftEnd]]
        }
        location.push(`${planstop.latitude},${planstop.longitude}`);

        jobs.push(job);

    });

    // Add shift start/stop location to location index
    location.push(`${txtVehicleStartPosition2.value}`);
    location.push(`${txtVehicleEndPosition2.value}`);
    location_index += 1;
    let veh_fixed_cost = 0;
    tblDrivers.data.forEach( (v,idx) => {
    let breaks = [];

    let vehicle = {
        id: parseInt(v.id),
        start_index: location_index,
        time_window: [shiftStart, shiftEnd],
        skills: v.skills,
        breaks: breaks,
        max_tasks: 25,
        costs: {
        fixed: veh_fixed_cost
        }
    };
        vehicles.push(vehicle);
        veh_fixed_cost += 0;
    }
    });
```

### Trigger Route Optimization API

After successfully fetching the data to Route optimization API, trigger the API to generate optimized routes.

The following API request sends data to the NextBillion.ai server to optimize routes for vehicles using the POST method.

```bash
POST
"https://api.nextbillion.io/optimization/v2?key=<your_api_key>"
```

The following code block prepares the required data (vehicles, shipments, jobs, locations) and configuration (routing mode), then triggers the optimization process.

_Note_: It is required to specify the routing mode. If not specified, the API will optimize the routes for default routing mode `car`. The API supports `truck` and `car` as routing modes.

```javascript
let options = {
  routing: {
    mode: "car",
  },
};

localStorage.setValue("vehiclesNBAI", vehicles);
localStorage.setValue("shipmentsNBAI", shipments);
localStorage.setValue("jobsNBAI", jobs);
localStorage.setValue("locationsNBAI", locations);
localStorage.setValue("nbaiOptions", options);
localStorage.setValue("nbaiVRPResult", null);
nbaiOptimizationRun.trigger();
```

By following these steps, you establish a robust data pipeline between Samsara's telematics and NextBillion.ai's Route Optimization API. This integration empowers you to transform your vehicle fleet management with precise and efficient route planning, dynamically adapting to real-world conditions and driving operational excellence.

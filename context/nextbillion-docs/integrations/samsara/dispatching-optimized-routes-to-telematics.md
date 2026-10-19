# Dispatching Optimized Routes to Samsara Telematics

Using Samsara Telematics and NextBillion.ai's Route Optimization API to dispatch and manage optimized routes can revolutionize fleet management. This guide outlines the easy integration steps for pushing optimized routes from NextBillion.ai to Samsara, alerting drivers, executing routes, and tracking data transmission to improve operational excellence.

## Step 1: Push Optimized Routes to Samsara

Utilize the Optimization API to initiate route optimization based on the imported data and configured settings. Observe how NextBillion.ai's Route Optimization API intelligently optimizes routes for your fleet's specific needs.

The following API endpoint dispatches optimized routes to Samsara.

```bash
POST https://api.samsara.com/fleet/routes?
```

The following code serves the purpose of interacting with data and APIs to optimize routes and perform tasks within the Samsara fleet management system.

```javascript
// For each route in NB.ai solution

let theRoutes = [];
let errors = "";
function runRouteCreateQuery(i) {
  // Update the Status text
  if (i >= theRoutes.length) {
    console.log("Finished running all queries");
    btnSendSamsara.setDisabled(true);
    return;
  }
  tmpRouteObject.setValue(theRoutes[i]);
  RoutePOST.trigger({
    additionalScope: { i: i }, // This is where we override the `i` variable

    // You can use the argument to get the data with the onSuccess function

    onSuccess: function (data) {
      runRouteCreateQuery(i + 1);
    },
    onFailure: function (error) {
      // Update the Errors text
      errors += "Found error at line " + i.toString() + ":  " + error + "\n\n";
      //Errors.setValue(errors);
      runRouteCreateQuery(i + 1);
    },
  });
}
nbaiOptimizationStatus.data.result.routes.forEach((rte) => {
  // For each stop on a single NB.ai route
  let route = {};
  let stops = [];
  rte.steps.forEach((stop) => {
    let theStop = {};
    if (stop.type === "start") {
      let singleUse = {
        address: "Start",
        latitude: stop.location[0],
        longitude: stop.location[1],
      };
      theStop.singleUseLocation = singleUse;
      theStop.scheduledArrivalTime = new Date(
        stop.arrival * 1000,
      ).toISOString();
      stops.push(theStop);
    } else if (stop.type === "end") {
      let singleUse = {
        address: "End",
        latitude: stop.location[0],
        longitude: stop.location[1],
      };
      theStop.singleUseLocation = singleUse;
      theStop.scheduledArrivalTime = new Date(
        stop.arrival * 1000,
      ).toISOString();
      stops.push(theStop);
    } else {
      theStop = {
        addressId: stop.id.toString(),
        name: stop.description,
        notes: stop.type,
        scheduledArrivalTime: new Date(stop.arrival * 1000).toISOString(),
      };
      stops.push(theStop);
    }
  });
  let settings = {
    routeCompletionCondition: "arriveLastStop",
    routeStartingCondition: "arriveFirstStop",
  };
  route = {
    settings: settings,
    stops: stops,
    driverId: rte.vehicle.toString(),
    name: `${rte.vehicle.toString()}-${rte.distance.toString()}-${rte.duration.toString()}`,
    notes: "Notes here",
  };
  theRoutes.push(route);
});

runRouteCreateQuery(0);
```

### Code Breakdown and Explanation

- **Parsing and Extracting Routes**: The code begins by parsing the response from NextBillion.ai (NB.ai) and extracting optimized routes from it.
- **HTTP POST Request**: The code includes a POST request to the `https://api.samsara.com/fleet/routes?` endpoint. This request is used to create routes within the Samsara system.
- **Route Creation Process**: The subsequent steps outline the creation of routes in Samsara for each route obtained from NB.ai's solution. The code iterates through each step of the route to extract relevant information.
- **Iterating Through Steps**: The code iterates through each step of a route provided by NB.ai. It processes each stop on a route and prepares the necessary data.
- **Handling Different Types of Stops**: Depending on the type of stop (start, end, or regular), the code prepares the data accordingly. It creates a list of stops, including their locations and arrival times.
- **Defining Settings and Route Information**: The code defines route settings, including conditions for route starting and completion. It also assembles all the extracted information to create a complete route object.
- **Running Route Creation Queries**: The `runRouteCreateQuery` function is used to trigger the creation of routes in the Samsara system. It uses the prepared route data and sends requests to Samsara's API.
- **Tracking Progress and Handling Errors**: The code tracks the progress of route creation and handles errors that might occur during the process. It updates error messages and continues with the route creation process.

In essence, this code demonstrates the creation of routes in the Samsara fleet management system based on the optimized routes obtained from the NextBillion.ai solution. It leverages APIs and data processing to streamline and automate the route creation process, enhancing efficiency within the fleet management workflow.

Upon sending the optimized routes to Samsara, the Samsara dashboard will assume the appearance showcased in the images depicted below.

![documentation image](https://static.nextbillion.io/docs-next/integrations/samsara/dispatch-op-route-3.png) ![documentation image](https://static.nextbillion.io/docs-next/integrations/samsara/dispatch-op-route-4.png)

## Step 2: Samsara Driver App Alerts Driver

- Use Samsara's Driver App to notify drivers about newly optimized routes.
- Trigger notifications that highlight route updates, stop sequences, and estimated arrival time.

![documentation image](/integrations/samsara/dispatch-op-route-2.png)

## Step 3: Driver Executes Route in Samsara

- Drivers use the Samsara Driver App to access the optimized route details after receiving alerts.
- To execute the route efficiently, follow Samsara's intuitive navigation guidance.

## Step 4: Upload Tracking Information to NextBillion.ai

- Samsara's telematics devices collect and transmit real-time tracking data as the driver travels along the route.
- Implement data retrieval mechanisms to gain access to Samsara's tracking data.

### GET API Request

The following API request shows the interaction and exchange of data between Samsara and NextBillion.ai’s platforms.

```json
{
  "request": {
    "url": "https://api.nextbillion.io/skynet/config?key=<your_api_key>",
    "method": "GET",
    "body": null,
    "headers": {
      "ot-baggage-requestId": "undefined",
      "x-datadog-trace-id": "7526304481543295161",
      "x-datadog-parent-id": "479181799701088157",
      "x-datadog-sampling-priority": "2",
      "traceparent": "00-00000000000000006872ce0cc5d190b9-06a6654eda04079d-01",
      "tracestate": "dd=s:2",
      "X-Forwarded-For": "183.82.31.124"
    }
  },
  "response": {
    "data": {
      "status": "Ok",
      "data": {
        "config": {
          "webhook": []
        }
      }
    },
    "headers": {
      "server": ["nginx/1.25.2"],
      "date": ["Tue, 22 Aug 2023 07:55:39 GMT"],
      "content-type": ["application/json; charset=utf-8"],
      "content-length": ["48"],
      "access-control-allow-origin": ["*"],
      "access-control-allow-headers": ["authorization"],
      "access-control-allow-methods": [
        "DELETE,GET,HEAD,PUT,PATCH,POST,OPTIONS"
      ],
      "via": ["1.1 google"],
      "alt-svc": ["h3=\":443\"; ma=2592000,h3-29=\":443\"; ma=2592000"]
    },
    "status": 200,
    "statusText": "OK"
  }
}
```

### GET Webhook Response

```json
{
  "status": "Ok",
  "data": {
    "config": {
      "webhook": []
    }
  }
}
```

### Example tracking response by webhook

The following webhook data structure provides a detailed snapshot of an alert event, including its type, timestamp, details, associated device and more. It's used to capture and convey significant occurrences within the system for further analysis or action.

```json
{
    "id": 242,
    "msg": {
      "eventId": "7e100985-9cf0-41f5-b33e-2664b2108b8a",
      "eventMs": 1692622280684,
      "eventType": "Alert",
      "orgId": 10004640,
      "webhookId": "2817427052011735",
      "event": {
        "alertEventUrl": "https://cloud.samsara.com/o/10004640/fleet/workflows/incidents/93054207-f597-4496-8619-ccaeb206a6c6/1/281474986740071/1692622244219/link?dl=eyJkZWVwTGlua1R5cGUiOiJXb3JrZmxvd0luY2lkZW50IiwiZ3JvdXBJZCI6MTIyMzU3fQ==",
        "alertConditionDescription": "Asset engine has turned off",
        "alertConditionId": "EngineStateOff",
        "details": "GJ5B-6G2-Y2E engine has turned off.",
        "device": {
          "id": 281474986740071,
          "name": "GJ5B-6G2-Y2E",
          "serial": "GJ5B6G2Y2E",
          "vin": "WBA3B3C52FF546155"
        },
        "orgId": 10004640,
        "resolved": false,
        "startMs": 1692622244219,
        "summary": "GJ5B-6G2-Y2E engine has turned off."
      }
    },
    "vehicle_id": null
  },
```

## Step 5: Sending data to NextBillion.ai

- Retrieve tracking data from Samsara's telematics platform on a regular basis.
- Push tracking data to the NextBillion.ai platform via designated API endpoints.

You can seamlessly integrate NextBillion.ai's route optimization with Samsara Telematics by meticulously following these integration steps. This integration allows you to improve fleet operations by optimizing routes, providing real-time driver alerts, routing in Samsara, and transmitting comprehensive tracking data. Take advantage of the collaboration between these two powerful platforms to achieve maximum efficiency, cost-saving and operational excellence in your fleet management efforts.

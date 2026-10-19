# SAP Integration Application Guide

This guide outlines the integration process for incorporating SAP records into NextBillion's Route Optimization API using the Retool development suite.

## Step 1: SAP Records Retrieval

To retrieve customer records and their address details from SAP, execute the following cURL command:

```bash
# Fetch customer data from SAP
curl --location 'https://sandbox.api.sap.com/s4hanacloud/sap/opu/odata4/sap/api_freightorder/srvd_a2x/sap/freightorder/0001/FrtOrdStopLocAddrDfltRprstn?%24top=50' \
--header 'APIKey: <SAP_API_Key>' \
--header 'Accept: application/json' \
--header 'DataServiceVersio: 2.0'
```

The response will contain an array of customer records with address details in JSON format.

```json
{
  "@odata.context": "$metadata#FrtOrdStopLocAddrDfltRprstn",
  "@odata.metadataEtag": "W/\"20231014225153\"",
  "value": [
    {
      "TransportationOrderStopUUID": "7956f832-6a7c-1edd-9599-71a252fd5b0b",
      "TransportationOrderUUID": "7956f832-6a7c-1edd-9599-71a252fcdb0b",
      "AddressID": "25176",
      "AddresseeFullName": "Shipping Point US20 - Address Name 1",
      "CityName": "Palo Alto",
      "PostalCode": "94304",
      "StreetName": "Baker Street",
      "HouseNumber": "10",
      "Country": "US",
      "Region": "CA"
    },
    {
      "TransportationOrderStopUUID": "7956f832-6a7c-1edd-9599-71a252fddb0b",
      "TransportationOrderUUID": "7956f832-6a7c-1edd-9599-71a252fcdb0b",
      "AddressID": "56254",
      "AddresseeFullName": "",
      "CityName": "Queens",
      "PostalCode": "11430",
      "StreetName": "Terminal Drive",
      "HouseNumber": "2000",
      "Country": "US",
      "Region": "NY"
    },
    {
      "TransportationOrderStopUUID": "7956f832-6a7c-1edd-9599-7294da055b10",
      "TransportationOrderUUID": "7956f832-6a7c-1edd-9599-7294da04db10",
      "AddressID": "56252",
      "AddresseeFullName": "",
      "CityName": "San Francisco",
      "PostalCode": "94128",
      "StreetName": "N Field Road",
      "HouseNumber": "2000",
      "Country": "US",
      "Region": "CA"
    },
    {
      "TransportationOrderStopUUID": "7956f832-6a7c-1edd-9599-7294da05db10",
      "TransportationOrderUUID": "7956f832-6a7c-1edd-9599-7294da04db10",
      "AddressID": "22895",
      "AddresseeFullName": "",
      "CityName": "Palo Alto",
      "PostalCode": "94304-1355",
      "StreetName": "Deer Creek",
      "HouseNumber": "3475",
      "Country": "US",
      "Region": "CA"
    },
    {
      "TransportationOrderStopUUID": "c1b881eb-9605-1eed-b3f1-2c7677aed1a8",
      "TransportationOrderUUID": "c1b881eb-9605-1eed-b3f1-2c7677ae91a8",
      "AddressID": "22895",
      "AddresseeFullName": "",
      "CityName": "Palo Alto",
      "PostalCode": "94304-1355",
      "StreetName": "Deer Creek",
      "HouseNumber": "3475",
      "Country": "US",
      "Region": "CA"
    },
    {
      "TransportationOrderStopUUID": "c1b881eb-9605-1eed-b3f1-2c7677af31a8",
      "TransportationOrderUUID": "c1b881eb-9605-1eed-b3f1-2c7677ae91a8",
      "AddressID": "59109",
      "AddresseeFullName": "Alt Bikes",
      "CityName": "Atlanta",
      "PostalCode": "30315-1402",
      "StreetName": "",
      "HouseNumber": "",
      "Country": "US",
      "Region": "GA"
    },
    {
      "TransportationOrderStopUUID": "c1b881eb-9605-1eed-b3f1-64f337f954e2",
      "TransportationOrderUUID": "c1b881eb-9605-1eed-b3f1-64f337f914e2",
      "AddressID": "22895",
      "AddresseeFullName": "",
      "CityName": "Palo Alto",
      "PostalCode": "94304-1355",
      "StreetName": "Deer Creek",
      "HouseNumber": "3475",
      "Country": "US",
      "Region": "CA"
    },
    {
      "TransportationOrderStopUUID": "c1b881eb-9605-1eed-b3f1-64f337f9b4e2",
      "TransportationOrderUUID": "c1b881eb-9605-1eed-b3f1-64f337f914e2",
      "AddressID": "59109",
      "AddresseeFullName": "Alt Bikes",
      "CityName": "Atlanta",
      "PostalCode": "30315-1402",
      "StreetName": "",
      "HouseNumber": "",
      "Country": "US",
      "Region": "GA"
    },
    {
      "TransportationOrderStopUUID": "fa163e6c-c3e1-1edc-a2a4-976ff6ad168a",
      "TransportationOrderUUID": "fa163e6c-c3e1-1edc-a2a4-976ff6ac968a",
      "AddressID": "22895",
      "AddresseeFullName": "",
      "CityName": "Palo Alto",
      "PostalCode": "94304-1355",
      "StreetName": "Deer Creek",
      "HouseNumber": "3475",
      "Country": "US",
      "Region": "CA"
    },
    {
      "TransportationOrderStopUUID": "fa163e6c-c3e1-1edc-a2a4-976ff6ad968a",
      "TransportationOrderUUID": "fa163e6c-c3e1-1edc-a2a4-976ff6ac968a",
      "AddressID": "54771",
      "AddresseeFullName": "",
      "CityName": "",
      "PostalCode": "",
      "StreetName": "",
      "HouseNumber": "",
      "Country": "DE",
      "Region": ""
    },
    {
      "TransportationOrderStopUUID": "fa163e6c-c3e1-1edc-a2a4-9851fcf6168a",
      "TransportationOrderUUID": "fa163e6c-c3e1-1edc-a2a4-9851fcf5968a",
      "AddressID": "54773",
      "AddresseeFullName": "",
      "CityName": "San Pedro",
      "PostalCode": "90731",
      "StreetName": "South Palos Verdes Street",
      "HouseNumber": "425",
      "Country": "US",
      "Region": "CA"
    },
    {
      "TransportationOrderStopUUID": "fa163e6c-c3e1-1edc-a2a4-9851fcf6968a",
      "TransportationOrderUUID": "fa163e6c-c3e1-1edc-a2a4-9851fcf5968a",
      "AddressID": "33809",
      "AddresseeFullName": "TM Inlandskunde DE 1",
      "CityName": "Hamburg",
      "PostalCode": "20148",
      "StreetName": "Tesdorpfstrasse",
      "HouseNumber": "8",
      "Country": "DE",
      "Region": "HH"
    },
    {
      "TransportationOrderStopUUID": "fa163e6c-c3e1-1edc-a2be-424d534a1ef9",
      "TransportationOrderUUID": "fa163e6c-c3e1-1edc-a2be-424d53499ef9",
      "AddressID": "22824",
      "AddresseeFullName": "Inlandslieferant DE 1",
      "CityName": "Haltern am See",
      "PostalCode": "45721",
      "StreetName": "Hullerner Straße",
      "HouseNumber": "23",
      "Country": "DE",
      "Region": "NW"
    },
    {
      "TransportationOrderStopUUID": "fa163e6c-c3e1-1edc-a2be-424d534a9ef9",
      "TransportationOrderUUID": "fa163e6c-c3e1-1edc-a2be-424d53499ef9",
      "AddressID": "54771",
      "AddresseeFullName": "",
      "CityName": "",
      "PostalCode": "",
      "StreetName": "",
      "HouseNumber": "",
      "Country": "DE",
      "Region": ""
    },
    {
      "TransportationOrderStopUUID": "fa163e6c-c3e1-1edc-a2be-42ace95b9ef9",
      "TransportationOrderUUID": "fa163e6c-c3e1-1edc-a2be-42ace95b1ef9",
      "AddressID": "54773",
      "AddresseeFullName": "",
      "CityName": "San Pedro",
      "PostalCode": "90731",
      "StreetName": "South Palos Verdes Street",
      "HouseNumber": "425",
      "Country": "US",
      "Region": "CA"
    },
    {
      "TransportationOrderStopUUID": "fa163e6c-c3e1-1edc-a2be-42ace95c1ef9",
      "TransportationOrderUUID": "fa163e6c-c3e1-1edc-a2be-42ace95b1ef9",
      "AddressID": "22895",
      "AddresseeFullName": "",
      "CityName": "Palo Alto",
      "PostalCode": "94304-1355",
      "StreetName": "Deer Creek",
      "HouseNumber": "3475",
      "Country": "US",
      "Region": "CA"
    },
    {
      "TransportationOrderStopUUID": "fa163e6c-c3e1-1edc-a2d1-8d6f05caba9d",
      "TransportationOrderUUID": "fa163e6c-c3e1-1edc-a2d1-8d6f05ca5a9d",
      "AddressID": "25176",
      "AddresseeFullName": "Shipping Point US20 - Address Name 1",
      "CityName": "Palo Alto",
      "PostalCode": "94304",
      "StreetName": "Baker Street",
      "HouseNumber": "10",
      "Country": "US",
      "Region": "CA"
    },
    {
      "TransportationOrderStopUUID": "fa163e6c-c3e1-1edc-a2d1-8d6f05cada9d",
      "TransportationOrderUUID": "fa163e6c-c3e1-1edc-a2d1-8d6f05ca5a9d",
      "AddressID": "22895",
      "AddresseeFullName": "",
      "CityName": "Palo Alto",
      "PostalCode": "94304-1355",
      "StreetName": "Deer Creek",
      "HouseNumber": "3475",
      "Country": "US",
      "Region": "CA"
    },
    {
      "TransportationOrderStopUUID": "fa163e6c-c3e1-1edc-a2d2-099ff1a6bbe7",
      "TransportationOrderUUID": "fa163e6c-c3e1-1edc-a2d2-099ff1a65be7",
      "AddressID": "25176",
      "AddresseeFullName": "Shipping Point US20 - Address Name 1",
      "CityName": "Palo Alto",
      "PostalCode": "94304",
      "StreetName": "Baker Street",
      "HouseNumber": "10",
      "Country": "US",
      "Region": "CA"
    },
    {
      "TransportationOrderStopUUID": "fa163e6c-c3e1-1edc-a2d2-099ff1a6dbe7",
      "TransportationOrderUUID": "fa163e6c-c3e1-1edc-a2d2-099ff1a65be7",
      "AddressID": "22895",
      "AddresseeFullName": "",
      "CityName": "Palo Alto",
      "PostalCode": "94304-1355",
      "StreetName": "Deer Creek",
      "HouseNumber": "3475",
      "Country": "US",
      "Region": "CA"
    },
    {
      "TransportationOrderStopUUID": "fa163e6c-c3e1-1edc-a2d2-465f86177c5a",
      "TransportationOrderUUID": "fa163e6c-c3e1-1edc-a2d2-465f86171c5a",
      "AddressID": "25176",
      "AddresseeFullName": "Shipping Point US20 - Address Name 1",
      "CityName": "Palo Alto",
      "PostalCode": "94304",
      "StreetName": "Baker Street",
      "HouseNumber": "10",
      "Country": "US",
      "Region": "CA"
    },
    {
      "TransportationOrderStopUUID": "fa163e6c-c3e1-1edc-a2d2-465f86179c5a",
      "TransportationOrderUUID": "fa163e6c-c3e1-1edc-a2d2-465f86171c5a",
      "AddressID": "22895",
      "AddresseeFullName": "",
      "CityName": "Palo Alto",
      "PostalCode": "94304-1355",
      "StreetName": "Deer Creek",
      "HouseNumber": "3475",
      "Country": "US",
      "Region": "CA"
    },
    {
      "TransportationOrderStopUUID": "fa163e6c-c3e1-1edc-a3d4-3b36902ea197",
      "TransportationOrderUUID": "fa163e6c-c3e1-1edc-a3d4-3b36902e4197",
      "AddressID": "22903",
      "AddresseeFullName": "Domestic US Supplier 1",
      "CityName": "Muncie",
      "PostalCode": "47305-2757",
      "StreetName": "S Ohio Ave",
      "HouseNumber": "198",
      "Country": "US",
      "Region": "IN"
    },
    {
      "TransportationOrderStopUUID": "fa163e6c-c3e1-1edc-a3d4-3b36902ec197",
      "TransportationOrderUUID": "fa163e6c-c3e1-1edc-a3d4-3b36902e4197",
      "AddressID": "22895",
      "AddresseeFullName": "",
      "CityName": "Palo Alto",
      "PostalCode": "94304-1355",
      "StreetName": "Deer Creek",
      "HouseNumber": "3475",
      "Country": "US",
      "Region": "CA"
    },
    {
      "TransportationOrderStopUUID": "fa163e6c-c3e1-1edc-a49a-4dbe70e5ab2b",
      "TransportationOrderUUID": "fa163e6c-c3e1-1edc-a49a-4dbe70e54b2b",
      "AddressID": "25176",
      "AddresseeFullName": "Shipping Point US20 - Address Name 1",
      "CityName": "Palo Alto",
      "PostalCode": "94304",
      "StreetName": "Baker Street",
      "HouseNumber": "10",
      "Country": "US",
      "Region": "CA"
    },
    {
      "TransportationOrderStopUUID": "fa163e6c-c3e1-1edc-a49a-4dbe70e5cb2b",
      "TransportationOrderUUID": "fa163e6c-c3e1-1edc-a49a-4dbe70e54b2b",
      "AddressID": "22895",
      "AddresseeFullName": "",
      "CityName": "Palo Alto",
      "PostalCode": "94304-1355",
      "StreetName": "Deer Creek",
      "HouseNumber": "3475",
      "Country": "US",
      "Region": "CA"
    },
    {
      "TransportationOrderStopUUID": "fa163e6c-c3e1-1eec-80b0-3e5518972acc",
      "TransportationOrderUUID": "fa163e6c-c3e1-1eec-80b0-3e551896cacc",
      "AddressID": "22895",
      "AddresseeFullName": "",
      "CityName": "Palo Alto",
      "PostalCode": "94304-1355",
      "StreetName": "Deer Creek",
      "HouseNumber": "3475",
      "Country": "US",
      "Region": "CA"
    },
    {
      "TransportationOrderStopUUID": "fa163e6c-c3e1-1eec-80b0-3e5518974acc",
      "TransportationOrderUUID": "fa163e6c-c3e1-1eec-80b0-3e551896cacc",
      "AddressID": "33825",
      "AddresseeFullName": "TM Domestic US Customer 1",
      "CityName": "San Ramon",
      "PostalCode": "94583-0001",
      "StreetName": "Camino Ramon",
      "HouseNumber": "2700",
      "Country": "US",
      "Region": "CA"
    },
    {
      "TransportationOrderStopUUID": "fa163e6c-c3e1-1eec-80b2-5dc3323933e9",
      "TransportationOrderUUID": "fa163e6c-c3e1-1eec-80b2-5dc33238d3e9",
      "AddressID": "22903",
      "AddresseeFullName": "Domestic US Supplier 1",
      "CityName": "Muncie",
      "PostalCode": "47305-2757",
      "StreetName": "S Ohio Ave",
      "HouseNumber": "198",
      "Country": "US",
      "Region": "IN"
    },
    {
      "TransportationOrderStopUUID": "fa163e6c-c3e1-1eec-80b2-5dc3323953e9",
      "TransportationOrderUUID": "fa163e6c-c3e1-1eec-80b2-5dc33238d3e9",
      "AddressID": "22895",
      "AddresseeFullName": "",
      "CityName": "Palo Alto",
      "PostalCode": "94304-1355",
      "StreetName": "Deer Creek",
      "HouseNumber": "3475",
      "Country": "US",
      "Region": "CA"
    },
    {
      "TransportationOrderStopUUID": "fa163e6c-c3e1-1eec-a4eb-348d01a27547",
      "TransportationOrderUUID": "fa163e6c-c3e1-1eec-a4eb-348d01a21547",
      "AddressID": "25176",
      "AddresseeFullName": "Shipping Point US20 - Address Name 1",
      "CityName": "Palo Alto",
      "PostalCode": "94304",
      "StreetName": "Baker Street",
      "HouseNumber": "10",
      "Country": "US",
      "Region": "CA"
    },
    {
      "TransportationOrderStopUUID": "fa163e6c-c3e1-1eec-a4eb-348d01a29547",
      "TransportationOrderUUID": "fa163e6c-c3e1-1eec-a4eb-348d01a21547",
      "AddressID": "25270",
      "AddresseeFullName": "Plant US30 - Address Name 1",
      "CityName": "Palo Alto",
      "PostalCode": "94306",
      "StreetName": "Arastradero Rd",
      "HouseNumber": "780",
      "Country": "US",
      "Region": "CA"
    },
    {
      "TransportationOrderStopUUID": "fa163e6c-c3e1-1eec-a4eb-6780eb2335f4",
      "TransportationOrderUUID": "fa163e6c-c3e1-1eec-a4eb-675e443ef5f4",
      "AddressID": "25176",
      "AddresseeFullName": "Shipping Point US20 - Address Name 1",
      "CityName": "Palo Alto",
      "PostalCode": "94304",
      "StreetName": "Baker Street",
      "HouseNumber": "10",
      "Country": "US",
      "Region": "CA"
    },
    {
      "TransportationOrderStopUUID": "fa163e6c-c3e1-1eec-a4eb-6780eb2355f4",
      "TransportationOrderUUID": "fa163e6c-c3e1-1eec-a4eb-675e443ef5f4",
      "AddressID": "25270",
      "AddresseeFullName": "Plant US30 - Address Name 1",
      "CityName": "Palo Alto",
      "PostalCode": "94306",
      "StreetName": "Arastradero Rd",
      "HouseNumber": "780",
      "Country": "US",
      "Region": "CA"
    },
    {
      "TransportationOrderStopUUID": "fa163e6c-c3e1-1eec-a4eb-f72e8daef75b",
      "TransportationOrderUUID": "fa163e6c-c3e1-1eec-a4eb-f72e8dae975b",
      "AddressID": "25176",
      "AddresseeFullName": "Shipping Point US20 - Address Name 1",
      "CityName": "Palo Alto",
      "PostalCode": "94304",
      "StreetName": "Baker Street",
      "HouseNumber": "10",
      "Country": "US",
      "Region": "CA"
    },
    {
      "TransportationOrderStopUUID": "fa163e6c-c3e1-1eec-a4eb-f72e8daf175b",
      "TransportationOrderUUID": "fa163e6c-c3e1-1eec-a4eb-f72e8dae975b",
      "AddressID": "25270",
      "AddresseeFullName": "Plant US30 - Address Name 1",
      "CityName": "Palo Alto",
      "PostalCode": "94306",
      "StreetName": "Arastradero Rd",
      "HouseNumber": "780",
      "Country": "US",
      "Region": "CA"
    }
  ]
}
```

The subsequent cell visualizes the above API response.

![SAP Records Retrieval](https://static.nextbillion.io/docs-next/integrations/sap/image-13.webp)

## Step 2: Vehicle Records

In this integration, we employed randomly generated vehicles. The CSV-formatted details of these vehicles were uploaded to the Database and leveraged for optimization. Users have the flexibility to integrate their own fleet/vehicle records into the optimization process. If vehicle records are available in SAP, they can be seamlessly pulled and incorporated into the optimization workflow.

The following image visualizes the vehicles dashboard.

![Vehicle Records](https://static.nextbillion.io/docs-next/integrations/sap/image-14.webp)

## Step 3: Integration with Route Optimization API

Following the successful retrieval of essential data from SAP, seamlessly integrate the fetched information with Route Optimization using the specified API endpoint. Effectively map the SAP data to the relevant API parameters and configure optimization settings, including shift start and end times, as well as service times.

This code snippet manages the integration process, ensuring a smooth connection between SAP data and Route Optimization API.

```javascript
//Initialization
let vehicles = [];
let shifts = [];
let starts = [];
let ends = [];
let veh_attr = [];
let stop_attr = [];
let vehicle_index = 1;
let shiftStart = new Date(dtShiftStart2.value).getTime() / 1000;
let shiftEnd = new Date(dtShiftEnd2.value).getTime() / 1000;

// Start NBAI problem build

let locations = [];
let jobs = [];
let shipments = [];
vehicles = [];
veh_attr = [];
stop_attr = [];

// Iterate through stops and create a job array while
// building an indexed list of locations

let location_index = 0;
let location = [];
table1.data.forEach((planstop) => {
  let job = {
    id: parseInt(planstop.id),
    description: planstop.Dropoff,
    location_index: location_index++,
    service: numberInput1.value,
    priority: 0,
    time_window: [[shiftStart, shiftEnd]],
  };
  location.push(`${planstop.dropoff_latitude},${planstop.dropoff_longitude}`);

  jobs.push(job);
});

// Add shift start/stop location to location index

location_index = 8;
let veh_fixed_cost = 0;
tblVehicles.data.forEach((v, idx) => {
  let breaks = [];
  let vehicle = {
    id: vehicle_index++,
    start_index: location_index++,
    time_window: [shiftStart, shiftEnd],
    max_tasks: 25,
    costs: {
      fixed: veh_fixed_cost,
    },
  };
  location.push(`${v.start_position}`);
  vehicles.push(vehicle);
  veh_fixed_cost += 0;
});

locations = {
  id: 12,
  description: "SAP Test",
  location: location,
};

let options = {
  routing: {
    mode: "car",
  },
};

// Store data in local storage for future reference

localStorage.setValue("vehiclesNBAI", vehicles);
localStorage.setValue("shipmentsNBAI", shipments);
localStorage.setValue("jobsNBAI", jobs);
localStorage.setValue("locationsNBAI", locations);
localStorage.setValue("nbaiOptions", options);
localStorage.setValue("nbaiVRPResult", null);

// Trigger the optimization run
nbaiOptimizationRun.trigger();
```

## Step 4: Create Optimization Jobs

Initiate the creation of optimization jobs by sending a POST request to NextBillion.ai's Route Optimization API with specified parameters. Confirm the successful job creation through the received API response.

Here's an example of the POST query using cURL:

```javascript
curl --request POST \
    --url https://api.nextbillion.io/optimization/v2?key={{localStorage.values.apiKey}}
```

Upon successful execution, the API response will confirm the creation of the optimization job:

```javascript
{
  "id": "daa1725f45c6c1e9aa184dca568d596c",
  "message": "Optimization job created",
  "status": "Ok"
}
```

This response provides essential information, including the job ID, a confirmation message, and the status 'Ok,' indicating the successful creation of the optimization job.

## Step 5: Optimized Route Result Retrieval

Retrieve the optimized route result by making a GET request to the NextBillion.ai Route Optimization API with the job ID and API key.

Below is an example of the GET query:

```bash
https://api.nextbillion.io/optimization/v2/result?id={{nbaiOptimizationRun.data.id}}&key={{localStorage.values.apiKey}}
```

Upon successful retrieval, the API responds with a JSON structure, providing crucial details about the optimized route. Here's an example of the JSON response:

```json
{
  "result": {
    "code": 0,
    "summary": {
      "cost": 66069,
      "routes": 2,
      "unassigned": 0,
      "setup": 0,
      "service": 2400,
      "duration": 66069,
      "waiting_time": 0,
      "priority": 0,
      "distance": 1873907
    },
    "routes": [
      {
        "vehicle": 21,
        "cost": 40365,
        "steps": [
          {
            "type": "start",
            "arrival": 1699497000,
            "duration": 0,
            "service": 0,
            "waiting_time": 0,
            "location": [40.193, -85.372],
            "location_index": 28,
            "distance": 0
          },
          {
            "type": "job",
            "arrival": 1699497045,
            "duration": 45,
            "service": 300,
            "waiting_time": 0,
            "location": [40.1925872, -85.3724137],
            "location_index": 6,
            "id": 8,
            "distance": 108
          },
          {
            "type": "job",
            "arrival": 1699537665,
            "duration": 40365,
            "service": 300,
            "waiting_time": 0,
            "location": [40.6431883, -73.7845546],
            "location_index": 7,
            "id": 10,
            "distance": 1147874
          },
          {
            "type": "end",
            "arrival": 1699537965,
            "duration": 40365,
            "service": 0,
            "waiting_time": 0,
            "location": [40.6431883, -73.7845546],
            "location_index": 7,
            "distance": 1147874
          }
        ],
        "service": 600,
        "duration": 40365,
        "waiting_time": 0,
        "priority": 0,
        "distance": 1147874,
        "geometry": "uditF`fahOEbClAc@?M@sC@[@kBCYAKGQS[W[EKCKBo@@iA?}AAo@@i@?aE?}E?...????"
      },
      {
        "vehicle": 1,
        "cost": 25704,
        "steps": [
          {
            "type": "start",
            "arrival": 1699497000,
            "duration": 0,
            "service": 0,
            "waiting_time": 0,
            "location": [37.401, -122.133],
            "location_index": 8,
            "distance": 0
          },
          {
            "type": "job",
            "arrival": 1699497237,
            "duration": 237,
            "service": 300,
            "waiting_time": 0,
            "location": [37.4013872, -122.1335806],
            "location_index": 3,
            "id": 4,
            "distance": 1073
          },
          {
            "type": "job",
            "arrival": 1699497808,
            "duration": 508,
            "service": 300,
            "waiting_time": 0,
            "location": [37.3957724, -122.1502149],
            "location_index": 2,
            "id": 3,
            "distance": 3515
          },
          {
            "type": "job",
            "arrival": 1699498457,
            "duration": 857,
            "service": 300,
            "waiting_time": 0,
            "location": [37.3813444, -122.1802812],
            "location_index": 1,
            "id": 2,
            "distance": 8155
          },
          {
            "type": "job",
            "arrival": 1699500601,
            "duration": 2701,
            "service": 300,
            "waiting_time": 0,
            "location": [37.6370102, -122.390641],
            "location_index": 4,
            "id": 5,
            "distance": 51454
          },
          {
            "type": "job",
            "arrival": 1699503706,
            "duration": 5506,
            "service": 300,
            "waiting_time": 0,
            "location": [37.766315, -121.9616932],
            "location_index": 5,
            "id": 6,
            "distance": 123325
          },
          {
            "type": "job",
            "arrival": 1699524204,
            "duration": 25704,
            "service": 300,
            "waiting_time": 0,
            "location": [33.7443104, -118.2772332],
            "location_index": 0,
            "id": 1,
            "distance": 726033
          },
          {
            "type": "end",
            "arrival": 1699524504,
            "duration": 25704,
            "service": 0,
            "waiting_time": 0,
            "location": [33.7443104, -118.2772332],
            "location_index": 0,
            "distance": 726033
          }
        ],
        "service": 1800,
        "duration": 25704,
        "waiting_time": 0,
        "priority": 0,
        "distance": 726033,
        "geometry": "k{gcFpbmhV\\NDDDFb@vAsBhACB?FPr@d@rBrAs@@BBBB@B?@ABC@C?QBQFKBc@Ho@NUFGBDPdAzDHCJCBC????CBKBIBeA{DEQFCTGn@OBLb@tABBB?D?..."
      }
    ]
  },
  "status": "Ok",
  "message": ""
}
```

This response includes detailed information such as total cost, the number of routes, service and duration metrics, and individual steps for each route, offering a comprehensive overview of the optimized route result.

## Step 6: Visualize Optimized Routes

After successfully fetching the data and setting up the Route Optimization API, initiate the API to generate optimized routes. To visualize the generated routes, you can view them on NextBillion's Optimizer using the following link:

```bash
https://playground.nextbillion.ai/optimization-tester?apiKey={{localStorage.values.apiKey}}&requestID={{nbaiOptimizationRun.data.id}}
```

This link directs you to the Optimizer interface, providing a convenient way to inspect and analyze the optimized routes generated by the Route Optimization API. Simply replace the placeholders with your API key and the request ID obtained from the API response for seamless integration and route assessment.

Below is a snippet showcasing the visual representation of the generated routes within the tester interface.

![Visualize Optimized Routes](https://static.nextbillion.io/docs-next/integrations/sap/image-15.webp)

## Step 7: Retrieve Optimization Results in SAP

To access the outcome of the optimization process within the SAP system, employ a GET request. In your SAP instance, craft a GET request with the specified details:

```bash
curl -X GET "https://api.openconnectors.trial.ap21.ext.hana.ondemand.com/elements/api-v2/optimization/v2/result?id=<Optimization Result ID>&key=<NextBillion.ai API Key>" -H "accept: application/json"
-H "Authorization: User <User Secret of SAP>=, Organization 359ad019a15fd3e02f4353c53a489827, Element w8SQ6cP+l4qBgFpbcHd/mMIoorCZUYiiEu0KxrYY/QM="
```

This request will retrieve the optimization results from NextBillion.ai and integrate them seamlessly into your SAP environment. Ensure that you replace `<Optimization Result ID>` and `<NextBillion.ai API Key>` with the corresponding values for your specific optimization run.

Upon successful execution, the JSON response within SAP will contain the detailed optimization results, providing valuable insights into the routes and associated data generated by the optimization process.

![Retrieve Optimization Results in SAP](https://static.nextbillion.io/docs-next/integrations/sap/image-15.webp)

SAP, with its extensive capabilities, offers a multitude of integration possibilities. This guide outlines one approach to seamlessly integrate SAP with NextBillion's Route Optimization API. While the SAP Integration Suite provides a robust toolkit for integrating diverse applications and systems, it's essential to note that it's not the sole method for integration. There are alternative methods and technologies available, and the choice depends on your specific SAP system.

Selecting the appropriate integration method hinges on your unique requirements and existing infrastructure. SAP offers a range of options to cater to various integration scenarios, allowing you to choose the approach that aligns best with your needs.

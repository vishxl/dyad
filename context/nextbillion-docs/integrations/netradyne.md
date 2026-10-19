# Netradyne Integration with NextBillion.ai’s Route Optimization API

## Introduction

The integration of Netradyne's technology with NextBillion.ai's Route Optimization API is a significant step forward in the field of fleet management and road safety. Netradyne, known for its emphasis on driver safety, fleet efficiency, and data-driven insights, analyzes driver behavior and road conditions using advanced AI algorithms and real-time monitoring.

The Route Optimization API from NextBillion.ai provides businesses with a practical way to plan routes accurately, saving time and money while ensuring customer satisfaction. It includes real-time tracking and detailed analytics to monitor and improve fleet operations.

This integration combines the strengths of Netradyne and NextBillion.ai and provides businesses with a competitive advantage in the field. It simplifies and improves their daily operations by combining safety, efficiency, and innovation.

## Prerequisites

To successfully integrate Netradyne with NextBillion.ai, ensure you have the following prerequisites in place:

1.  Netradyne's Authorization and Tenant Unique Name
2.  NextBillion.ai's API key: Obtain an API key from NextBillion.ai, which serves as the authentication mechanism for accessing their services and data. This key is essential for secure and authorized communication between your systems and NextBillion.ai's APIs.

## Integration Steps

### Generate Access Token

- Generate Access token of Netradyne using the POST request. More details on the REST API requests can be found [here](https://developer.netradyne.com/docs/api-documentation/g212yi5gi59u4-netradyne-driveri-platform-ap-is)

  ```url
  https://api.netradyne.com/driveri/v1/auth/token
  ```

- **Verify Basic CRUD Operations**: Finally, verify that basic CRUD (Create, Read, Update, Delete) operations are functioning as expected using the generated access token.

### Pull List of Vehicles from Netradyne

Retrieve the list of vehicles from the Netradyne platform using the following API request.

#### Sample API Request

```bash
# Fetch vehicles from Netradyne
curl --location 'https://api.netradyne.com/driveri/v1/tenants/N546980211724797/vehicles' \
--header 'Accept-Language: en-US' \
--header 'Authorization: Bearer <access_token>'
```

#### Sample API Response

```json
{
"totalCount": 46,
  "data": {
    "vehicles": [
      {
        "vin": "195192",
        "vehicleNumber": "195192",
        "licensePlateNumber": "string",
        "regdDate": 1694385610954,
        "status": 1,
        "tenantUniqueName": "N546980211724797",
        "updatedOn": 1694385610948,
        "vehicleDetails": {
          "class": "Unknown",
          "gVM": "52000 lb"
        },
        "batteryToMasterSwitchDisconnected": 0
      },
      {
        "vin": "123456789",
        "vehicleNumber": "2345",
        "licensePlateNumber": "4567890",
        "regdDate": 1668727922881,
        "status": 1,
        "tenantUniqueName": "N546980211724797",
        "updatedOn": 1668727922883,
        "vehicleDetails": {
          "class": "CLASS1"
        },
        "batteryToMasterSwitchDisconnected": 2
      },
      {
        "vin": "1J4HA6H1XAL130149",
        "vehicleNumber": "Vista430",
        "licensePlateNumber": "TBD",
        "regdDate": 1681235423863,
        "status": 1,
        "deviceId": "3633015376",
        "camera": {
          "id": "3633015376"
        },
        "tenantUniqueName": "N546980211724797",
        "updatedOn": 1691015788503,
        "vehicleDetails": {
          "class": "CLASS6",
          "gVM": "22000 lb"
        },
        "batteryToMasterSwitchDisconnected": 1
      },
      {
        "vin": "5TBBT54117S452443",
        "vehicleNumber": "IMUTestRandy",
        "licensePlateNumber": "u8002s",
        "regdDate": 1647339413982,
        "status": 1,
        "deviceId": "264015804",
        "camera": {
          "id": "264015804"
        },
        "tenantUniqueName": "N546980211724797",
        "updatedOn": 1685115792723,
        "vehicleDetails": {
          "class": "CLASS2",
          "gVM": "10001 lb"
        },
        "batteryToMasterSwitchDisconnected": 2
      },
      {
        "vin": "5YJ3E1EA4LF611371",
        "vehicleNumber": "KFCModel3",
        "licensePlateNumber": "Temp",
        "regdDate": 1666802973800,
        "status": 1,
        "tenantUniqueName": "N546980211724797",
        "updatedOn": 1692993365292,
        "vehicleDetails": {
          "class": "CLASS1",
          "gVM": "5000 lb"
        },
        "batteryToMasterSwitchDisconnected": 2
      },
      {
        "vin": "101844",
        "vehicleNumber": "101844",
        "licensePlateNumber": "CXAA123",
        "regdDate": 1694106162207,
        "status": 1,
        "tenantUniqueName": "N546980211724797",
        "updatedOn": 1694106162194,
        "vehicleDetails": {
          "class": "Unknown",
          "gVM": "52000 lb"
        },
        "batteryToMasterSwitchDisconnected": 0
      },
      {
        "vin": "0",
        "vehicleNumber": "580-130199",
        "licensePlateNumber": "2374484",
        "regdDate": 1694110935281,
        "status": 1,
        "tenantUniqueName": "N546980211724797",
        "updatedOn": 1694110935272,
        "vehicleDetails": {
          "class": "Unknown"
        },
        "batteryToMasterSwitchDisconnected": 2
      },
      {
        "vin": "1000",
        "vehicleNumber": "827-1000",
        "licensePlateNumber": "CJ28557",
        "regdDate": 1694110935318,
        "status": 1,
        "tenantUniqueName": "N546980211724797",
        "updatedOn": 1694110935272,
        "vehicleDetails": {
          "class": "Unknown"
        },
        "batteryToMasterSwitchDisconnected": 2
      },
      {
        "vin": "101845",
        "vehicleNumber": "115-101845",
        "licensePlateNumber": "C85252A",
        "regdDate": 1694110935326,
        "status": 1,
        "tenantUniqueName": "N546980211724797",
        "updatedOn": 1694110935272,
        "vehicleDetails": {
          "class": "Unknown"
        },
        "batteryToMasterSwitchDisconnected": 2
      },
      {
        "vin": "146660",
        "vehicleNumber": "115-146660",
        "licensePlateNumber": "C07232F",
        "regdDate": 1694110935328,
        "status": 1,
        "tenantUniqueName": "N546980211724797",
        "updatedOn": 1694110935272,
        "vehicleDetails": {
          "class": "Unknown"
        },
        "batteryToMasterSwitchDisconnected": 2
      },
      {
        "vin": "147451",
        "vehicleNumber": "115-147451",
        "licensePlateNumber": "C07234F",
        "regdDate": 1694110935329,
        "status": 1,
        "tenantUniqueName": "N546980211724797",
        "updatedOn": 1694110935272,
        "vehicleDetails": {
          "class": "Unknown"
        },
        "batteryToMasterSwitchDisconnected": 2
      },
      {
        "vin": "157463",
        "vehicleNumber": "729-01",
        "licensePlateNumber": "2385576",
        "regdDate": 1694110935330,
        "status": 1,
        "tenantUniqueName": "N546980211724797",
        "updatedOn": 1694110935272,
        "vehicleDetails": {
          "class": "Unknown"
        },
        "batteryToMasterSwitchDisconnected": 2
      },
      {
        "vin": "170364",
        "vehicleNumber": "595-170364",
        "licensePlateNumber": "None",
        "regdDate": 1694110935333,
        "status": 1,
        "tenantUniqueName": "N546980211724797",
        "updatedOn": 1694110935272,
        "vehicleDetails": {
          "class": "Unknown"
        },
        "batteryToMasterSwitchDisconnected": 2
      },
      {
        "vin": "192071",
        "vehicleNumber": "656-192071",
        "licensePlateNumber": "12345",
        "regdDate": 1694110935335,
        "status": 1,
        "tenantUniqueName": "N546980211724797",
        "updatedOn": 1694110935272,
        "vehicleDetails": {
          "class": "Unknown"
        },
        "batteryToMasterSwitchDisconnected": 2
      },
      {
        "vin": "193627",
        "vehicleNumber": "113-12",
        "licensePlateNumber": "V009DU",
        "regdDate": 1694110935336,
        "status": 1,
        "tenantUniqueName": "N546980211724797",
        "updatedOn": 1694110935272,
        "vehicleDetails": {
          "class": "Unknown"
        },
        "batteryToMasterSwitchDisconnected": 2
      },
      {
        "vin": "195189",
        "vehicleNumber": "767-909",
        "licensePlateNumber": "B77085V",
        "regdDate": 1694110935337,
        "status": 1,
        "tenantUniqueName": "N546980211724797",
        "updatedOn": 1694110935272,
        "vehicleDetails": {
          "class": "Unknown"
        },
        "batteryToMasterSwitchDisconnected": 2
      },
      {
        "vin": "2",
        "vehicleNumber": "650-560",
        "licensePlateNumber": "QTN600",
        "regdDate": 1694110935339,
        "status": 1,
        "tenantUniqueName": "N546980211724797",
        "updatedOn": 1694110935272,
        "vehicleDetails": {
          "class": "Unknown"
        },
        "batteryToMasterSwitchDisconnected": 2
      },
      {
        "vin": "23",
        "vehicleNumber": "848-01",
        "licensePlateNumber": "96089V1",
        "regdDate": 1694110935341,
        "status": 1,
        "tenantUniqueName": "N546980211724797",
        "updatedOn": 1694110935272,
        "vehicleDetails": {
          "class": "Unknown"
        },
        "batteryToMasterSwitchDisconnected": 2
      },
      {
        "vin": "5302023",
        "vehicleNumber": "650-674",
        "licensePlateNumber": "BHQ735",
        "regdDate": 1694110935342,
        "status": 1,
        "tenantUniqueName": "N546980211724797",
        "updatedOn": 1694110935272,
        "vehicleDetails": {
          "class": "Unknown"
        },
        "batteryToMasterSwitchDisconnected": 2
      },
      {
        "vin": "602",
        "vehicleNumber": "10-602",
        "licensePlateNumber": "02860H1",
        "regdDate": 1694110935344,
        "status": 1,
        "tenantUniqueName": "N546980211724797",
        "updatedOn": 1694110935272,
        "vehicleDetails": {
          "class": "Unknown"
        },
        "batteryToMasterSwitchDisconnected": 2
      },
      {
        "vin": "638098",
        "vehicleNumber": "115-638098",
        "licensePlateNumber": "B54314W",
        "regdDate": 1694110935347,
        "status": 1,
        "tenantUniqueName": "N546980211724797",
        "updatedOn": 1694110935272,
        "vehicleDetails": {
          "class": "Unknown"
        },
        "batteryToMasterSwitchDisconnected": 2
      },
      {
        "vin": "638102",
        "vehicleNumber": "115-638102",
        "licensePlateNumber": "B54318W",
        "regdDate": 1694110935348,
        "status": 1,
        "tenantUniqueName": "N546980211724797",
        "updatedOn": 1694110935272,
        "vehicleDetails": {
          "class": "Unknown"
        },
        "batteryToMasterSwitchDisconnected": 2
      },
      {
        "vin": "638103",
        "vehicleNumber": "115-638103",
        "licensePlateNumber": "B54319W",
        "regdDate": 1694110935350,
        "status": 1,
        "tenantUniqueName": "N546980211724797",
        "updatedOn": 1694110935272,
        "vehicleDetails": {
          "class": "Unknown"
        },
        "batteryToMasterSwitchDisconnected": 2
      },
      {
        "vin": "638107",
        "vehicleNumber": "564-08",
        "licensePlateNumber": "87060L1",
        "regdDate": 1694110935352,
        "status": 1,
        "tenantUniqueName": "N546980211724797",
        "updatedOn": 1694110935272,
        "vehicleDetails": {
          "class": "Unknown"
        },
        "batteryToMasterSwitchDisconnected": 2
      },
      {
        "vin": "676202",
        "vehicleNumber": "1487-676202",
        "licensePlateNumber": "B97217Y",
        "regdDate": 1694110935356,
        "status": 1,
        "tenantUniqueName": "N546980211724797",
        "updatedOn": 1694110935272,
        "vehicleDetails": {
          "class": "Unknown"
        },
        "batteryToMasterSwitchDisconnected": 2
      },
      {
        "vin": "827991",
        "vehicleNumber": "827-887",
        "licensePlateNumber": "CD85881",
        "regdDate": 1694110935358,
        "status": 1,
        "tenantUniqueName": "N546980211724797",
        "updatedOn": 1694110935272,
        "vehicleDetails": {
          "class": "Unknown"
        },
        "batteryToMasterSwitchDisconnected": 2
      },
      {
        "vin": "846-3631",
        "vehicleNumber": "564-16",
        "licensePlateNumber": "42876K1",
        "regdDate": 1694110935361,
        "status": 1,
        "tenantUniqueName": "N546980211724797",
        "updatedOn": 1694110935272,
        "vehicleDetails": {
          "class": "Unknown"
        },
        "batteryToMasterSwitchDisconnected": 2
      },
      {
        "vin": "8463035",
        "vehicleNumber": "767-47",
        "licensePlateNumber": "C58881E",
        "regdDate": 1694110935363,
        "status": 1,
        "tenantUniqueName": "N546980211724797",
        "updatedOn": 1694110935272,
        "vehicleDetails": {
          "class": "Unknown"
        },
        "batteryToMasterSwitchDisconnected": 2
      },
      {
        "vin": "915-2304",
        "vehicleNumber": "25-9152304",
        "licensePlateNumber": "B78438U",
        "regdDate": 1694110935364,
        "status": 1,
        "tenantUniqueName": "N546980211724797",
        "updatedOn": 1694110935272,
        "vehicleDetails": {
          "class": "Unknown"
        },
        "batteryToMasterSwitchDisconnected": 2
      },
      {
        "vin": "999998",
        "vehicleNumber": "767-336",
        "licensePlateNumber": "C24427A",
        "regdDate": 1694110935366,
        "status": 1,
        "tenantUniqueName": "N546980211724797",
        "updatedOn": 1694110935272,
        "vehicleDetails": {
          "class": "Unknown"
        },
        "batteryToMasterSwitchDisconnected": 2
      },
      {
        "vin": "999999",
        "vehicleNumber": "767-104",
        "licensePlateNumber": "B54321W",
        "regdDate": 1694110935367,
        "status": 1,
        "tenantUniqueName": "N546980211724797",
        "updatedOn": 1694110935272,
        "vehicleDetails": {
          "class": "Unknown"
        },
        "batteryToMasterSwitchDisconnected": 2
      },
      {
        "vin": "101844555",
        "vehicleNumber": "115-101844",
        "licensePlateNumber": "C85214A",
        "regdDate": 1694110935369,
        "status": 1,
        "tenantUniqueName": "N546980211724797",
        "updatedOn": 1694110935272,
        "vehicleDetails": {
          "class": "Unknown"
        },
        "batteryToMasterSwitchDisconnected": 2
      },
      {
        "vin": "170365",
        "vehicleNumber": "595-170365",
        "licensePlateNumber": "None222233",
        "regdDate": 1694110935370,
        "status": 1,
        "tenantUniqueName": "N546980211724797",
        "updatedOn": 1694110935272,
        "vehicleDetails": {
          "class": "Unknown"
        },
        "batteryToMasterSwitchDisconnected": 2
      },
      {
        "vin": "170367",
        "vehicleNumber": "595-170367",
        "licensePlateNumber": "None2222",
        "regdDate": 1694110935371,
        "status": 1,
        "tenantUniqueName": "N546980211724797",
        "updatedOn": 1694110935272,
        "vehicleDetails": {
          "class": "Unknown"
        },
        "batteryToMasterSwitchDisconnected": 2
      },
      {
        "vin": "170368",
        "vehicleNumber": "595-170368",
        "licensePlateNumber": "111111",
        "regdDate": 1694110935373,
        "status": 1,
        "tenantUniqueName": "N546980211724797",
        "updatedOn": 1694110935272,
        "vehicleDetails": {
          "class": "Unknown"
        },
        "batteryToMasterSwitchDisconnected": 2
      },
      {
        "vin": "JM287",
        "vehicleNumber": "580-130599",
        "licensePlateNumber": "2374485",
        "regdDate": 1694110935374,
        "status": 1,
        "tenantUniqueName": "N546980211724797",
        "updatedOn": 1694110935272,
        "vehicleDetails": {
          "class": "Unknown"
        },
        "batteryToMasterSwitchDisconnected": 2
      },
      {
        "vin": "638094",
        "vehicleNumber": "1665-638094",
        "licensePlateNumber": "B49906W",
        "regdDate": 1694110935346,
        "status": 1,
        "tenantUniqueName": "N546980211724797",
        "updatedOn": 1694110935272,
        "vehicleDetails": {
          "class": "Unknown"
        },
        "batteryToMasterSwitchDisconnected": 2
      },
      {
        "vin": "170051",
        "vehicleNumber": "115-170051",
        "licensePlateNumber": "C98272G",
        "regdDate": 1694110935332,
        "status": 1,
        "tenantUniqueName": "N546980211724797",
        "updatedOn": 1694110935272,
        "vehicleDetails": {
          "class": "Unknown"
        },
        "batteryToMasterSwitchDisconnected": 2
      },
      {
        "vin": "1FTFW1ET7DKF98945",
        "vehicleNumber": "TESLA-MODEL-S",
        "licensePlateNumber": "JBOND007",
        "regdDate": 1661454087687,
        "status": 1,
        "tenantUniqueName": "N546980211724797",
        "updatedOn": 1692993273687,
        "vehicleDetails": {
          "class": "CLASS1",
          "gVM": "5000 lb"
        },
        "batteryToMasterSwitchDisconnected": 2
      },
      {
        "vin": "157465",
        "vehicleNumber": "157465",
        "licensePlateNumber": "W643NP",
        "regdDate": 1694119695305,
        "status": 1,
        "tenantUniqueName": "N546980211724797",
        "updatedOn": 1694119695290,
        "vehicleDetails": {
          "class": "Unknown",
          "gVM": "52000 lb"
        },
        "batteryToMasterSwitchDisconnected": 0
      },
      {
        "vin": "1002",
        "vehicleNumber": "1002",
        "licensePlateNumber": "CJ28559",
        "regdDate": 1694123204992,
        "status": 1,
        "tenantUniqueName": "N546980211724797",
        "updatedOn": 1694123204982,
        "vehicleDetails": {
          "class": "Unknown",
          "gVM": "52000 lb"
        },
        "batteryToMasterSwitchDisconnected": 0
      },
      {
        "vin": "164577",
        "vehicleNumber": "164577",
        "licensePlateNumber": "2385582",
        "regdDate": 1694124996237,
        "status": 1,
        "tenantUniqueName": "N546980211724797",
        "updatedOn": 1694124996219,
        "vehicleDetails": {
          "class": "Unknown",
          "gVM": "52000 lb"
        },
        "batteryToMasterSwitchDisconnected": 0
      },
      {
        "vin": "203605",
        "vehicleNumber": "203605",
        "licensePlateNumber": "123",
        "regdDate": 1694212437903,
        "status": 1,
        "tenantUniqueName": "N546980211724797",
        "updatedOn": 1694212437896,
        "vehicleDetails": {
          "class": "Unknown",
          "gVM": "52000 lb"
        },
        "batteryToMasterSwitchDisconnected": 0
      },
      {
        "vin": "137283",
        "vehicleNumber": "137283",
        "licensePlateNumber": "C54133E",
        "regdDate": 1694127005625,
        "status": 1,
        "tenantUniqueName": "N546980211724797",
        "updatedOn": 1694127005617,
        "vehicleDetails": {
          "class": "Unknown",
          "gVM": "52000 lb"
        },
        "batteryToMasterSwitchDisconnected": 0
      },
      {
        "vin": "116039",
        "vehicleNumber": "116039",
        "licensePlateNumber": "C70707B",
        "regdDate": 1694135020850,
        "status": 1,
        "tenantUniqueName": "N546980211724797",
        "updatedOn": 1694135020840,
        "vehicleDetails": {
          "class": "Unknown",
          "gVM": "52000 lb"
        },
        "batteryToMasterSwitchDisconnected": 0
      },
      {
        "vin": "JHMCP26748C047713",
        "vehicleNumber": "KFCAccord",
        "licensePlateNumber": "6DKM149",
        "regdDate": 1647339375272,
        "status": 1,
        "deviceId": "264094871",
        "camera": {
          "id": "264094871"
        },
        "tenantUniqueName": "N546980211724797",
        "updatedOn": 1695061928041,
        "vehicleDetails": {
          "class": "CLASS1",
          "gVM": "5000 lb"
        },
        "batteryToMasterSwitchDisconnected": 2
      }
    ]
}
```

This API response includes essential information about each vehicle, such as VIN (Vehicle Identification Number), vehicle number, license plate number, registration date, status, and additional details about the vehicle's class, gross vehicle weight (gVM), and battery status.

### Delivery Records Integration

The delivery records will be linked to the `jobs` parameter within NextBillion.ai's Route Optimization API. To facilitate testing and integration, we have generated a set of random jobs that can be employed for route optimization evaluation. However, for real-world scenarios, users have the flexibility to substitute these random jobs with their specific delivery addresses or job data.

Here are the key steps involved in this process:

- **Download Sample CSV File**: We provide a sample CSV file containing randomly generated job data. You can download this file to understand the format and structure required for the job data.
- **Upload Job Data in CSV Format**: After customizing your job data in CSV format, you can upload it into the system. This step ensures that your specific delivery addresses or job details are seamlessly integrated and optimized using NextBillion's Route Optimization API.

![documentation image](https://static.nextbillion.io/docs-next/integrations/netradyne/image2.webp)

### Configuration of Additional Parameters

In our technical integration process, apart from the core parameters, there are additional settings that play a crucial role in fine-tuning the route optimization. These settings allow for a more comprehensive and customized optimization process. Here's how to configure these parameters:

1.  **Driver's Shift Start and End Time**: Define the start and end times of the driver's shift within the application. This sets the timeframe during which the route optimization should take place, ensuring alignment with the driver's working hours.
2.  **Start and End Vehicle Locations**: Specify the initial and final locations for the vehicle. Typically, this corresponds to the vehicle's departure point (e.g., the warehouse) and its return location after completing deliveries. These locations serve as critical reference points for route calculation.
3.  **Service Time**: The service time represents the duration required by the delivery executive to fulfill each order. Accurate service time input is essential for realistic route optimization.

Once all these parameters are correctly configured to match your specific operational requirements, you're ready to proceed.

![documentation image](https://static.nextbillion.io/docs-next/integrations/netradyne/image3.webp)

### Integration with Route Optimization API

After successfully pulling the necessary data from Netradyne, integrate the fetched data with Route Optimization using the following API endpoint.

Map the fetched Netradyne data to the respective API parameters. Configure optimization settings such as shift start and end time, service time, and start and end location coordinates.

```javascript
let vehicles = [];
let shifts = [];
let starts = [];
let ends = [];
let veh_attr = [];
let stop_attr = [];
let vehicle_index = 1;
let shiftStart = new Date(dtShiftStart2.value).getTime() / 1000;
let shiftEnd = new Date(dtShiftEnd2.value).getTime() / 1000;

// START NBAI PROBLEM BUILD
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
addressess.data.forEach((planstop) => {
  let from = new Date(planstop.from).getTime() / 1000;
  let to = new Date(planstop.to).getTime() / 1000;

  let job = {
    id: parseInt(planstop.ID),
    description: planstop.Dropoff,
    location_index: location_index++,
    service: numberInput1.value,
    priority: 0,
    time_windows: [[from, to]],
  };
  location.push(`${planstop.dropoff_latitude},${planstop.dropoff_longitude}`);

  jobs.push(job);
});

// Add shift start/stop location to location index
location.push(`${txtVehicleStartPosition2.value}`);
location.push(`${txtVehicleEndPosition2.value}`);
location_index += 1;
let veh_fixed_cost = 0;
tblVehicles.data.forEach((v, idx) => {
  let breaks = [];
  let vehicle = {
    id: vehicle_index++,
    start_index: location_index,
    time_window: [shiftStart, shiftEnd],
    max_tasks: 25,
    costs: {
      fixed: veh_fixed_cost,
    },
  };
  vehicles.push(vehicle);
  veh_fixed_cost += 0;
});

locations = {
  id: 12,
  description: "Netradyne Test",
  location: location,
};

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

Follow these steps to achieve a successful integration:

#### Step 1: Define Data Structures

Begin by setting up the necessary data structures to facilitate the integration. These include arrays and variables for vehicles, shifts, start and end locations, vehicle attributes, and stop attributes.

```javascript
let vehicles = [];
let shifts = [];
let starts = [];
let ends = [];
let veh_attr = [];
let stop_attr = [];
```

#### Step 2: Configure Optimization Settings

Specify optimization settings to tailor the routing process to your specific needs. These settings typically include shift start and end times, service times, and the coordinates of start and end locations.

```javascript
let shiftStart = new Date(dtShiftStart2.value).getTime() / 1000;
let shiftEnd = new Date(dtShiftEnd2.value).getTime() / 1000;
```

#### Step 3: Prepare Data for Route Optimization

Assemble the data required for route optimization. This involves creating arrays for locations, jobs, and shipments. Additionally, you'll populate the vehicle and job attributes as needed.

```javascript
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
addressess.data.forEach((planstop) => {
  let from = new Date(planstop.from).getTime() / 1000;
  let to = new Date(planstop.to).getTime() / 1000;

  let job = {
    id: parseInt(planstop.ID),
    description: planstop.Dropoff,
    location_index: location_index++,
    service: numberInput1.value,
    priority: 0,
    time_windows: [[from, to]],
  };
  location.push(`${planstop.dropoff_latitude},${planstop.dropoff_longitude}`);

  jobs.push(job);
});

// Add shift start/stop location to location index
location.push(`${txtVehicleStartPosition2.value}`);
location.push(`${txtVehicleEndPosition2.value}`);
location_index += 1;
let veh_fixed_cost = 0;
tblVehicles.data.forEach((v, idx) => {
  let breaks = [];
  let vehicle = {
    id: vehicle_index++,
    start_index: location_index,
    time_window: [shiftStart, shiftEnd],
    max_tasks: 25,
    costs: {
      fixed: veh_fixed_cost,
    },
  };
  vehicles.push(vehicle);
  veh_fixed_cost += 0;
});

locations = {
  id: 12,
  description: "Netradyne Test",
  location: location,
};

let options = {
  routing: {
    mode: "car",
  },
};
```

#### Step 4: Store Data and Trigger Optimization

Store the prepared data structures in local storage for future reference and initiate the route optimization process.

```javascript
localStorage.setValue("vehiclesNBAI", vehicles);
localStorage.setValue("shipmentsNBAI", shipments);
localStorage.setValue("jobsNBAI", jobs);
localStorage.setValue("locationsNBAI", locations);
localStorage.setValue("nbaiOptions", options);
localStorage.setValue("nbaiVRPResult", null);

nbaiOptimizationRun.trigger();
```

By following these steps, you can effectively connect and integrate Netradyne data with the Route Optimization API, ensuring efficient routing and resource allocation for your tasks or deliveries.

### Create Jobs with Route Optimization API

The following API request sends data to NextBillion.ai’s Route Optimization API to create optimization jobs based on certain parameters. The response confirms the creation of jobs.

#### POST API Request

```bash
curl --request POST \
    --url https://api.nextbillion.io/optimization/v2?key={{localStorage.values.apiKey}}
```

#### POST API Response

```json
{
  "id": "cb35dbf1c45e6b86309e3bea880afb39",
  "message": "Optimization job created",
  "status": "Ok"
}
```

### Retrieving Optimized Route Result

To obtain the optimized route results after initiating a route optimization job, you can utilize the provided GET query. This query enables you to fetch the optimized route details from the Route Optimization API.

#### GET Query

```url
https://api.nextbillion.io/optimization/v2/result?id={{nbaiOptimizationRun.data.id}}&key={{localStorage.values.apiKey}}
```

In the above URL, two query parameters are used:

`id`: This parameter specifies the unique identifier associated with the optimization job. It is obtained from the `nbaiOptimizationRun.data.id` variable. `key`: The `localStorage.values.apiKey` variable provides the API key necessary for authentication.

#### Example JSON Response

Upon making the GET request, the API will respond with a JSON object containing the optimized route details. Here's an example of what the JSON response may look like.

```javascript

{
"totalCount": 46,
  "data": {
    "vehicles": [
      {
        "vin": "195192",
        "vehicleNumber": "195192",
        "licensePlateNumber": "string",
        "regdDate": 1694385610954,
        "status": 1,
        "tenantUniqueName": "N546980211724797",
        "updatedOn": 1694385610948,
        "vehicleDetails": {
          "class": "Unknown",
          "gVM": "52000 lb"
        },
        "batteryToMasterSwitchDisconnected": 0
      },
      {
        "vin": "123456789",
        "vehicleNumber": "2345",
        "licensePlateNumber": "4567890",
        "regdDate": 1668727922881,
        "status": 1,
        "tenantUniqueName": "N546980211724797",
        "updatedOn": 1668727922883,
        "vehicleDetails": {
          "class": "CLASS1"
        },
        "batteryToMasterSwitchDisconnected": 2
      },
      {
        "vin": "1J4HA6H1XAL130149",
        "vehicleNumber": "Vista430",
        "licensePlateNumber": "TBD",
        "regdDate": 1681235423863,
        "status": 1,
        "deviceId": "3633015376",
        "camera": {
          "id": "3633015376"
        },
        "tenantUniqueName": "N546980211724797",
        "updatedOn": 1691015788503,
        "vehicleDetails": {
          "class": "CLASS6",
          "gVM": "22000 lb"
        },
        "batteryToMasterSwitchDisconnected": 1
      },
      {
        "vin": "5TBBT54117S452443",
        "vehicleNumber": "IMUTestRandy",
        "licensePlateNumber": "u8002s",
        "regdDate": 1647339413982,
        "status": 1,
        "deviceId": "264015804",
        "camera": {
          "id": "264015804"
        },
        "tenantUniqueName": "N546980211724797",
        "updatedOn": 1685115792723,
        "vehicleDetails": {
          "class": "CLASS2",
          "gVM": "10001 lb"
        },
        "batteryToMasterSwitchDisconnected": 2
      },
      {
        "vin": "5YJ3E1EA4LF611371",
        "vehicleNumber": "KFCModel3",
        "licensePlateNumber": "Temp",
        "regdDate": 1666802973800,
        "status": 1,
        "tenantUniqueName": "N546980211724797",
        "updatedOn": 1692993365292,
        "vehicleDetails": {
          "class": "CLASS1",
          "gVM": "5000 lb"
        },
        "batteryToMasterSwitchDisconnected": 2
      },
      {
        "vin": "101844",
        "vehicleNumber": "101844",
        "licensePlateNumber": "CXAA123",
        "regdDate": 1694106162207,
        "status": 1,
        "tenantUniqueName": "N546980211724797",
        "updatedOn": 1694106162194,
        "vehicleDetails": {
          "class": "Unknown",
          "gVM": "52000 lb"
        },
        "batteryToMasterSwitchDisconnected": 0
      },
      {
        "vin": "0",
        "vehicleNumber": "580-130199",
        "licensePlateNumber": "2374484",
        "regdDate": 1694110935281,
        "status": 1,
        "tenantUniqueName": "N546980211724797",
        "updatedOn": 1694110935272,
        "vehicleDetails": {
          "class": "Unknown"
        },
        "batteryToMasterSwitchDisconnected": 2
      },
      {
        "vin": "1000",
        "vehicleNumber": "827-1000",
        "licensePlateNumber": "CJ28557",
        "regdDate": 1694110935318,
        "status": 1,
        "tenantUniqueName": "N546980211724797",
        "updatedOn": 1694110935272,
        "vehicleDetails": {
          "class": "Unknown"
        },
        "batteryToMasterSwitchDisconnected": 2
      },
      {
        "vin": "101845",
        "vehicleNumber": "115-101845",
        "licensePlateNumber": "C85252A",
        "regdDate": 1694110935326,
        "status": 1,
        "tenantUniqueName": "N546980211724797",
        "updatedOn": 1694110935272,
        "vehicleDetails": {
          "class": "Unknown"
        },
        "batteryToMasterSwitchDisconnected": 2
      },
      {
        "vin": "146660",
        "vehicleNumber": "115-146660",
        "licensePlateNumber": "C07232F",
        "regdDate": 1694110935328,
        "status": 1,
        "tenantUniqueName": "N546980211724797",
        "updatedOn": 1694110935272,
        "vehicleDetails": {
          "class": "Unknown"
        },
        "batteryToMasterSwitchDisconnected": 2
      },
      {
        "vin": "147451",
        "vehicleNumber": "115-147451",
        "licensePlateNumber": "C07234F",
        "regdDate": 1694110935329,
        "status": 1,
        "tenantUniqueName": "N546980211724797",
        "updatedOn": 1694110935272,
        "vehicleDetails": {
          "class": "Unknown"
        },
        "batteryToMasterSwitchDisconnected": 2
      },
      {
        "vin": "157463",
        "vehicleNumber": "729-01",
        "licensePlateNumber": "2385576",
        "regdDate": 1694110935330,
        "status": 1,
        "tenantUniqueName": "N546980211724797",
        "updatedOn": 1694110935272,
        "vehicleDetails": {
          "class": "Unknown"
        },
        "batteryToMasterSwitchDisconnected": 2
      },
      {
        "vin": "170364",
        "vehicleNumber": "595-170364",
        "licensePlateNumber": "None",
        "regdDate": 1694110935333,
        "status": 1,
        "tenantUniqueName": "N546980211724797",
        "updatedOn": 1694110935272,
        "vehicleDetails": {
          "class": "Unknown"
        },
        "batteryToMasterSwitchDisconnected": 2
      },
      {
        "vin": "192071",
        "vehicleNumber": "656-192071",
        "licensePlateNumber": "12345",
        "regdDate": 1694110935335,
        "status": 1,
        "tenantUniqueName": "N546980211724797",
        "updatedOn": 1694110935272,
        "vehicleDetails": {
          "class": "Unknown"
        },
        "batteryToMasterSwitchDisconnected": 2
      },
      {
        "vin": "193627",
        "vehicleNumber": "113-12",
        "licensePlateNumber": "V009DU",
        "regdDate": 1694110935336,
        "status": 1,
        "tenantUniqueName": "N546980211724797",
        "updatedOn": 1694110935272,
        "vehicleDetails": {
          "class": "Unknown"
        },
        "batteryToMasterSwitchDisconnected": 2
      },
      {
        "vin": "195189",
        "vehicleNumber": "767-909",
        "licensePlateNumber": "B77085V",
        "regdDate": 1694110935337,
        "status": 1,
        "tenantUniqueName": "N546980211724797",
        "updatedOn": 1694110935272,
        "vehicleDetails": {
          "class": "Unknown"
        },
        "batteryToMasterSwitchDisconnected": 2
      },
      {
        "vin": "2",
        "vehicleNumber": "650-560",
        "licensePlateNumber": "QTN600",
        "regdDate": 1694110935339,
        "status": 1,
        "tenantUniqueName": "N546980211724797",
        "updatedOn": 1694110935272,
        "vehicleDetails": {
          "class": "Unknown"
        },
        "batteryToMasterSwitchDisconnected": 2
      },
      {
        "vin": "23",
        "vehicleNumber": "848-01",
        "licensePlateNumber": "96089V1",
        "regdDate": 1694110935341,
        "status": 1,
        "tenantUniqueName": "N546980211724797",
        "updatedOn": 1694110935272,
        "vehicleDetails": {
          "class": "Unknown"
        },
        "batteryToMasterSwitchDisconnected": 2
      },
      {
        "vin": "5302023",
        "vehicleNumber": "650-674",
        "licensePlateNumber": "BHQ735",
        "regdDate": 1694110935342,
        "status": 1,
        "tenantUniqueName": "N546980211724797",
        "updatedOn": 1694110935272,
        "vehicleDetails": {
          "class": "Unknown"
        },
        "batteryToMasterSwitchDisconnected": 2
      },
      {
        "vin": "602",
        "vehicleNumber": "10-602",
        "licensePlateNumber": "02860H1",
        "regdDate": 1694110935344,
        "status": 1,
        "tenantUniqueName": "N546980211724797",
        "updatedOn": 1694110935272,
        "vehicleDetails": {
          "class": "Unknown"
        },
        "batteryToMasterSwitchDisconnected": 2
      },
      {
        "vin": "638098",
        "vehicleNumber": "115-638098",
        "licensePlateNumber": "B54314W",
        "regdDate": 1694110935347,
        "status": 1,
        "tenantUniqueName": "N546980211724797",
        "updatedOn": 1694110935272,
        "vehicleDetails": {
          "class": "Unknown"
        },
        "batteryToMasterSwitchDisconnected": 2
      },
      {
        "vin": "638102",
        "vehicleNumber": "115-638102",
        "licensePlateNumber": "B54318W",
        "regdDate": 1694110935348,
        "status": 1,
        "tenantUniqueName": "N546980211724797",
        "updatedOn": 1694110935272,
        "vehicleDetails": {
          "class": "Unknown"
        },
        "batteryToMasterSwitchDisconnected": 2
      },
      {
        "vin": "638103",
        "vehicleNumber": "115-638103",
        "licensePlateNumber": "B54319W",
        "regdDate": 1694110935350,
        "status": 1,
        "tenantUniqueName": "N546980211724797",
        "updatedOn": 1694110935272,
        "vehicleDetails": {
          "class": "Unknown"
        },
        "batteryToMasterSwitchDisconnected": 2
      },
      {
        "vin": "638107",
        "vehicleNumber": "564-08",
        "licensePlateNumber": "87060L1",
        "regdDate": 1694110935352,
        "status": 1,
        "tenantUniqueName": "N546980211724797",
        "updatedOn": 1694110935272,
        "vehicleDetails": {
          "class": "Unknown"
        },
        "batteryToMasterSwitchDisconnected": 2
      },
      {
        "vin": "676202",
        "vehicleNumber": "1487-676202",
        "licensePlateNumber": "B97217Y",
        "regdDate": 1694110935356,
        "status": 1,
        "tenantUniqueName": "N546980211724797",
        "updatedOn": 1694110935272,
        "vehicleDetails": {
          "class": "Unknown"
        },
        "batteryToMasterSwitchDisconnected": 2
      },
      {
        "vin": "827991",
        "vehicleNumber": "827-887",
        "licensePlateNumber": "CD85881",
        "regdDate": 1694110935358,
        "status": 1,
        "tenantUniqueName": "N546980211724797",
        "updatedOn": 1694110935272,
        "vehicleDetails": {
          "class": "Unknown"
        },
        "batteryToMasterSwitchDisconnected": 2
      },
      {
        "vin": "846-3631",
        "vehicleNumber": "564-16",
        "licensePlateNumber": "42876K1",
        "regdDate": 1694110935361,
        "status": 1,
        "tenantUniqueName": "N546980211724797",
        "updatedOn": 1694110935272,
        "vehicleDetails": {
          "class": "Unknown"
        },
        "batteryToMasterSwitchDisconnected": 2
      },
      {
        "vin": "8463035",
        "vehicleNumber": "767-47",
        "licensePlateNumber": "C58881E",
        "regdDate": 1694110935363,
        "status": 1,
        "tenantUniqueName": "N546980211724797",
        "updatedOn": 1694110935272,
        "vehicleDetails": {
          "class": "Unknown"
        },
        "batteryToMasterSwitchDisconnected": 2
      },
      {
        "vin": "915-2304",
        "vehicleNumber": "25-9152304",
        "licensePlateNumber": "B78438U",
        "regdDate": 1694110935364,
        "status": 1,
        "tenantUniqueName": "N546980211724797",
        "updatedOn": 1694110935272,
        "vehicleDetails": {
          "class": "Unknown"
        },
        "batteryToMasterSwitchDisconnected": 2
      },
      {
        "vin": "999998",
        "vehicleNumber": "767-336",
        "licensePlateNumber": "C24427A",
        "regdDate": 1694110935366,
        "status": 1,
        "tenantUniqueName": "N546980211724797",
        "updatedOn": 1694110935272,
        "vehicleDetails": {
          "class": "Unknown"
        },
        "batteryToMasterSwitchDisconnected": 2
      },
      {
        "vin": "999999",
        "vehicleNumber": "767-104",
        "licensePlateNumber": "B54321W",
        "regdDate": 1694110935367,
        "status": 1,
        "tenantUniqueName": "N546980211724797",
        "updatedOn": 1694110935272,
        "vehicleDetails": {
          "class": "Unknown"
        },
        "batteryToMasterSwitchDisconnected": 2
      },
      {
        "vin": "101844555",
        "vehicleNumber": "115-101844",
        "licensePlateNumber": "C85214A",
        "regdDate": 1694110935369,
        "status": 1,
        "tenantUniqueName": "N546980211724797",
        "updatedOn": 1694110935272,
        "vehicleDetails": {
          "class": "Unknown"
        },
        "batteryToMasterSwitchDisconnected": 2
      },
      {
        "vin": "170365",
        "vehicleNumber": "595-170365",
        "licensePlateNumber": "None222233",
        "regdDate": 1694110935370,
        "status": 1,
        "tenantUniqueName": "N546980211724797",
        "updatedOn": 1694110935272,
        "vehicleDetails": {
          "class": "Unknown"
        },
        "batteryToMasterSwitchDisconnected": 2
      },
      {
        "vin": "170367",
        "vehicleNumber": "595-170367",
        "licensePlateNumber": "None2222",
        "regdDate": 1694110935371,
        "status": 1,
        "tenantUniqueName": "N546980211724797",
        "updatedOn": 1694110935272,
        "vehicleDetails": {
          "class": "Unknown"
        },
        "batteryToMasterSwitchDisconnected": 2
      },
      {
        "vin": "170368",
        "vehicleNumber": "595-170368",
        "licensePlateNumber": "111111",
        "regdDate": 1694110935373,
        "status": 1,
        "tenantUniqueName": "N546980211724797",
        "updatedOn": 1694110935272,
        "vehicleDetails": {
          "class": "Unknown"
        },
        "batteryToMasterSwitchDisconnected": 2
      },
      {
        "vin": "JM287",
        "vehicleNumber": "580-130599",
        "licensePlateNumber": "2374485",
        "regdDate": 1694110935374,
        "status": 1,
        "tenantUniqueName": "N546980211724797",
        "updatedOn": 1694110935272,
        "vehicleDetails": {
          "class": "Unknown"
        },
        "batteryToMasterSwitchDisconnected": 2
      },
      {
        "vin": "638094",
        "vehicleNumber": "1665-638094",
        "licensePlateNumber": "B49906W",
        "regdDate": 1694110935346,
        "status": 1,
        "tenantUniqueName": "N546980211724797",
        "updatedOn": 1694110935272,
        "vehicleDetails": {
          "class": "Unknown"
        },
        "batteryToMasterSwitchDisconnected": 2
      },
      {
        "vin": "170051",
        "vehicleNumber": "115-170051",
        "licensePlateNumber": "C98272G",
        "regdDate": 1694110935332,
        "status": 1,
        "tenantUniqueName": "N546980211724797",
        "updatedOn": 1694110935272,
        "vehicleDetails": {
          "class": "Unknown"
        },
        "batteryToMasterSwitchDisconnected": 2
      },
      {
        "vin": "1FTFW1ET7DKF98945",
        "vehicleNumber": "TESLA-MODEL-S",
        "licensePlateNumber": "JBOND007",
        "regdDate": 1661454087687,
        "status": 1,
        "tenantUniqueName": "N546980211724797",
        "updatedOn": 1692993273687,
        "vehicleDetails": {
          "class": "CLASS1",
          "gVM": "5000 lb"
        },
        "batteryToMasterSwitchDisconnected": 2
      },
      {
        "vin": "157465",
        "vehicleNumber": "157465",
        "licensePlateNumber": "W643NP",
        "regdDate": 1694119695305,
        "status": 1,
        "tenantUniqueName": "N546980211724797",
        "updatedOn": 1694119695290,
        "vehicleDetails": {
          "class": "Unknown",
          "gVM": "52000 lb"
        },
        "batteryToMasterSwitchDisconnected": 0
      },
      {
        "vin": "1002",
        "vehicleNumber": "1002",
        "licensePlateNumber": "CJ28559",
        "regdDate": 1694123204992,
        "status": 1,
        "tenantUniqueName": "N546980211724797",
        "updatedOn": 1694123204982,
        "vehicleDetails": {
          "class": "Unknown",
          "gVM": "52000 lb"
        },
        "batteryToMasterSwitchDisconnected": 0
      },
      {
        "vin": "164577",
        "vehicleNumber": "164577",
        "licensePlateNumber": "2385582",
        "regdDate": 1694124996237,
        "status": 1,
        "tenantUniqueName": "N546980211724797",
        "updatedOn": 1694124996219,
        "vehicleDetails": {
          "class": "Unknown",
          "gVM": "52000 lb"
        },
        "batteryToMasterSwitchDisconnected": 0
      },
      {
        "vin": "203605",
        "vehicleNumber": "203605",
        "licensePlateNumber": "123",
        "regdDate": 1694212437903,
        "status": 1,
        "tenantUniqueName": "N546980211724797",
        "updatedOn": 1694212437896,
        "vehicleDetails": {
          "class": "Unknown",
          "gVM": "52000 lb"
        },
        "batteryToMasterSwitchDisconnected": 0
      },
      {
        "vin": "137283",
        "vehicleNumber": "137283",
        "licensePlateNumber": "C54133E",
        "regdDate": 1694127005625,
        "status": 1,
        "tenantUniqueName": "N546980211724797",
        "updatedOn": 1694127005617,
        "vehicleDetails": {
          "class": "Unknown",
          "gVM": "52000 lb"
        },
        "batteryToMasterSwitchDisconnected": 0
      },
      {
        "vin": "116039",
        "vehicleNumber": "116039",
        "licensePlateNumber": "C70707B",
        "regdDate": 1694135020850,
        "status": 1,
        "tenantUniqueName": "N546980211724797",
        "updatedOn": 1694135020840,
        "vehicleDetails": {
          "class": "Unknown",
          "gVM": "52000 lb"
        },
        "batteryToMasterSwitchDisconnected": 0
      },
      {
        "vin": "JHMCP26748C047713",
        "vehicleNumber": "KFCAccord",
        "licensePlateNumber": "6DKM149",
        "regdDate": 1647339375272,
        "status": 1,
        "deviceId": "264094871",
        "camera": {
          "id": "264094871"
        },
        "tenantUniqueName": "N546980211724797",
        "updatedOn": 1695061928041,
        "vehicleDetails": {
          "class": "CLASS1",
          "gVM": "5000 lb"
        },
        "batteryToMasterSwitchDisconnected": 2
      }
    ]
}
```

### Accessing Optimized Routes in NextBillion.ai’s Optimizer

To visualize and analyze the optimized routes generated by NextBillion's Optimizer, you can use the following URL.

```url
https://playground.nextbillion.ai/optimization-tester?apiKey={{localStorage.values.apiKey}}&requestID={{nbaiOptimizationRun.data.id}}
```

The above URL will take you to NextBillion's Optimizer interface where you can explore and interact with the optimized route results associated with your specific request ID and API key. This provides a convenient way to gain insights into your optimized routes for enhanced decision-making and resource management.

![documentation image](https://static.nextbillion.io/docs-next/integrations/netradyne/image1.webp)

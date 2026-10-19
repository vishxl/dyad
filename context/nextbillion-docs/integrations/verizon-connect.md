# Verizon Connect Integration with NB.ai’s Route Optimization API

## Introduction

[Verizon Connect](https://www.verizonconnect.com/) serves as a comprehensive fleet management software, empowering fleet owners to streamline their operations. Tailored for businesses with mobile workforce requirements, Verizon Connect harnesses GPS technology and telematics data to offer real-time insights into various facets of fleet management. From tracking vehicle locations to monitoring driver behavior, fuel consumption, and maintenance needs, Verizon Connect provides a holistic solution for optimizing fleet operations.

[Nextbillion's Route Optimization API](https://docs.nextbillion.ai/optimization/route-optimization-flexible-api) offers businesses accurate and efficient route planning, helping them save time, reduce costs, and enhance customer satisfaction. The API offers over 50 custom parameters that can help businesses to manage their fleet operations as per their requirements.

By combining the capabilities of Verizon Connect and Nextbillion's Route Optimization API, businesses can revolutionize their operations on the field and stay ahead in today's competitive market.

## Prerequisites

In order to successfully integrate Verizon Connect with NextBillion.ai's services, certain prerequisites must be met. These include:

1.  **Access to the Verizon Connect Developer Portal**
    - Ensure that you have the necessary credentials to access the Verizon Connect Developer Portal. This platform serves as the gateway to initiating the integration process seamlessly.

2.  **Reveal Integration User Credentials**
    - You'll need a Reveal Integration user account, complete with a username and password. These credentials are automatically shared with you via the Reveal Marketplace, streamlining the setup process.
    - For detailed information regarding Reveal Integration user credentials, refer to [this link](https://fim.us.fleetmatics.com/#/home/support).

3.  **NextBillion.ai's API Key**
    - Acquire a valid API key from NextBillion.ai, which acts as the authentication mechanism for connecting your Verizon Connect Field Service instance with NextBillion.ai's services.
    - This key establishes a secure and authorized communication channel between the two platforms, facilitating seamless data exchange and integration. [Contact support](https://nextbillion.ai/contact-us) to get your API key.

## Verizon Connection App

To integrate with Verizon, follow these steps to build a connection app within the Verizon developer portal and establish a connection using REST API queries. Refer to the [official documentation](https://fim.us.fleetmatics.com/#/home/support) for detailed steps.

1.  **Create a Verizon Connect App**

Navigate to the Verizon developer portal and create a new app dedicated to your integration.

![documentation image](https://static.nextbillion.io/docs-next/integrations/verizon-connect/verizon-connect-01.webp)

1.  **Retrieve Authorization Token**

Use Postman to retrieve the Authorization token by following these steps:

- Refer to the detailed instructions provided [here](https://fim.us.fleetmatics.com/#/home/support) for a visual guide.
- Once obtained, store the access token securely for future use.

![documentation image](https://static.nextbillion.io/docs-next/integrations/verizon-connect/verizon-connect-02.webp)

1.  **Test Connection via Curl Requests**

- With the access token in hand, proceed to test the connection by performing curl REST API requests.
- Use standard curl commands to interact with the Verizon APIs and ensure the connection functions correctly.

By following these steps, you'll successfully establish a connection app with Verizon for your integration.

## Integration Steps

### Step 1: Pull List of Vehicles from Verizon Connect

In this step, we retrieve vehicle data from the Verizon Connect account. The objective is to pull a comprehensive list of vehicles that provide essential details for further analysis and optimization.

![documentation image](https://static.nextbillion.io/docs-next/integrations/verizon-connect/verizon-connect-03.webp)

#### API Request

Use the following cURL command to retrieve vehicles data.

```bash
# Fetch Vehicles from Verizon Connect
curl --location 'https://fim.api.us.fleetmatics.com/cmd/v1/vehicles' \
--header 'Authorization: Atmosphere atmosphere_app_id=[Verizon Connect App ID], Bearer [Authorization Token]'
```

#### API Response

The following API response represents information about vehicles retrieved from Verizon Connect.

```json
[
  {
    "Name": "GPS History Vehicle 7",
    "VehicleNumber": "1007",
    "RegistrationNumber": "1007",
    "VIN": "1FAFP40664F177257",
    "Make": "Ford",
    "Year": 2004,
    "Model": "Mustang",
    "TankCapacity": 59.43,
    "HighwayMPG": 8.11,
    "CityMPG": 11.76,
    "FuelType": 0,
    "VehicleSize": 0,
    "HasNavigationDevice": false
  },
  {
    "Name": "GPS History Vehicle 9",
    "VehicleNumber": "1009",
    "RegistrationNumber": "1009",
    "VIN": "MMAYNKK40HH005494",
    "Make": "Mitsubishi",
    "Year": 2016,
    "Model": "Triton",
    "TankCapacity": 75.0,
    "HighwayMPG": 13.0,
    "CityMPG": 13.0,
    "FuelType": 0,
    "VehicleSize": 1,
    "HasNavigationDevice": false
  },
  {
    "Name": "GPS History Vehicle 11",
    "VehicleNumber": "1011",
    "RegistrationNumber": "1011",
    "VIN": "MMAYNKK40HH005413",
    "Make": "Mitsubishi",
    "Year": 2016,
    "Model": "Triton",
    "TankCapacity": 75.0,
    "HighwayMPG": 13.0,
    "CityMPG": 13.0,
    "FuelType": 0,
    "VehicleSize": 1,
    "HasNavigationDevice": false
  },
  {
    "Name": "GPS History Vehicle 21",
    "VehicleNumber": "1021",
    "RegistrationNumber": "1021",
    "VIN": "MMAYNKK40HH005416",
    "Make": "Audi",
    "Year": 2016,
    "Model": "A1",
    "TankCapacity": 75.0,
    "HighwayMPG": 15.0,
    "CityMPG": 13.0,
    "FuelType": 0,
    "VehicleSize": 1,
    "HasNavigationDevice": false
  },
  {
    "Name": "GPS History Vehicle 26",
    "VehicleNumber": "1026",
    "RegistrationNumber": "1026",
    "VIN": "MMAYNKK40HH005412",
    "Make": "Abarth",
    "Year": 2016,
    "Model": "Triton",
    "TankCapacity": 75.0,
    "HighwayMPG": 13.0,
    "CityMPG": 16.0,
    "FuelType": 0,
    "VehicleSize": 1,
    "HasNavigationDevice": false
  },
  {
    "Name": "US_Live Reporting_8_ECM_PTO",
    "VehicleNumber": "108",
    "RegistrationNumber": null,
    "VIN": null,
    "Make": null,
    "Year": null,
    "Model": null,
    "TankCapacity": null,
    "HighwayMPG": null,
    "CityMPG": null,
    "FuelType": 0,
    "VehicleSize": 0,
    "HasNavigationDevice": false
  },
  {
    "Name": "US_Live Rporting_9_ECM_PTO",
    "VehicleNumber": "109",
    "RegistrationNumber": null,
    "VIN": null,
    "Make": null,
    "Year": null,
    "Model": null,
    "TankCapacity": null,
    "HighwayMPG": null,
    "CityMPG": null,
    "FuelType": 0,
    "VehicleSize": 0,
    "HasNavigationDevice": false
  },
  {
    "Name": "MY VEHICLE",
    "VehicleNumber": "GDA36475-dousuniecia",
    "RegistrationNumber": "123333",
    "VIN": "5YJXCDE26LF250128",
    "Make": "MAKE",
    "Year": 1990,
    "Model": "MODEL",
    "TankCapacity": 0.0,
    "HighwayMPG": 0.0,
    "CityMPG": 0.0,
    "FuelType": 0,
    "VehicleSize": 0,
    "HasNavigationDevice": false
  }
]
```

### Step 2: Pull Work Order Records

In this step work-order records are fetched and mapped to the `jobs` and `shipments` parameter of NextBillion.ai’s Route Optimization API.

> Note: This integration guide includes mock work orders for the US region.

Users have the following flexibility to source work order data:

- **Pull from Existing Application**: Users can extract work orders directly from their existing application and integrate them with the route optimization process.
- **Upload Work Order Data**: Users can also upload work orders directly to the application, streamlining the route processing workflow.

The following image visualizes the mock work-orders on the dashboard.

![documentation image](https://static.nextbillion.io/docs-next/integrations/verizon-connect/verizon-connect-04.webp)

#### Sample Work orders

The following JSON data represents the work orders created for this integration guide.

```json
{
  "pointsArray": [
    {
      "country": "USA",
      "address": "600 Sycamore Turn Lane, Columbus, OH 43213, United States",
      "business": "Koepp Group",
      "city": "Columbus",
      "latitude": "39.9678541925",
      "postalCode": "43213",
      "houseNumber": "600",
      "priority": true,
      "phone": "083-162-4632",
      "street": "Sycamore Turn Lane",
      "name": "Mohammad Pfeffer",
      "attributes": [5],
      "id": 1,
      "state": "OH",
      "longitude": "-82.8386505870"
    },
    {
      "country": "USA",
      "address": "381 Rathmell Road, Lockbourne, OH 43137, United States",
      "business": "Hammes PLC",
      "city": "Lockbourne",
      "latitude": "39.8628433142",
      "postalCode": "43137",
      "houseNumber": "381",
      "priority": true,
      "phone": "242-293-3503",
      "street": "Rathmell Road",
      "name": "Leonor Weber",
      "attributes": [2],
      "id": 2,
      "state": "OH",
      "longitude": "-82.9966675126"
    },
    {
      "country": "USA",
      "address": "30161 Kesegs Way, Blacklick, OH 43004, United States",
      "business": "Kassulke and Sons",
      "city": "Blacklick",
      "latitude": "40.0367963253",
      "postalCode": "43004",
      "houseNumber": "30161",
      "priority": true,
      "phone": "695-651-6528",
      "street": "Kesegs Way",
      "name": "Nettie Jewess",
      "attributes": [3],
      "id": 3,
      "state": "OH",
      "longitude": "-82.7933560656"
    },
    {
      "country": "USA",
      "address": "3496 Old Dublin Granville Road, Westerville, OH 43081, United States",
      "business": "Larson Group",
      "city": "Westerville",
      "latitude": "40.0810091627",
      "postalCode": "43081",
      "houseNumber": "3496",
      "priority": false,
      "phone": "626-679-4651",
      "street": "Old Dublin Granville Road",
      "name": "Christina Stehr",
      "attributes": [4],
      "id": 4,
      "state": "OH",
      "longitude": "-82.9235980595"
    },
    {
      "country": "USA",
      "address": "37 Olentangy Street, Columbus, OH 43202, United States",
      "business": "Luettgen Group",
      "city": "Columbus",
      "latitude": "40.0195063137",
      "postalCode": "43202",
      "houseNumber": "37",
      "priority": true,
      "phone": "868-276-2791",
      "street": "Olentangy Street",
      "name": "Anastasia Orn",
      "attributes": [2],
      "id": 5,
      "state": "OH",
      "longitude": "-83.0113438753"
    },
    {
      "country": "USA",
      "address": "5545 Millington Road, Columbus, OH 43235, United States",
      "business": "Blick PLC",
      "city": "Columbus",
      "latitude": "40.0721924801",
      "postalCode": "43235",
      "houseNumber": "5545",
      "priority": false,
      "phone": "412-557-8192",
      "street": "Millington Road",
      "name": "Mercedes Botsford",
      "attributes": [3],
      "id": 6,
      "state": "OH",
      "longitude": "-83.0516754534"
    },
    {
      "country": "USA",
      "address": "620 McCutcheon Road, Columbus, OH 43230, United States",
      "business": "Streich Group",
      "city": "Columbus",
      "latitude": "40.0343357537",
      "postalCode": "43230",
      "houseNumber": "620",
      "priority": true,
      "phone": "547-666-7048",
      "street": "McCutcheon Road",
      "name": "Ned Koelpin",
      "attributes": [3],
      "id": 7,
      "state": "OH",
      "longitude": "-82.8986562967"
    },
    {
      "country": "USA",
      "address": "1 New Albany Farms Road, New Albany, OH 43054, United States",
      "business": "Klocko and Sons",
      "city": "New Albany",
      "latitude": "40.0564422735",
      "postalCode": "43054",
      "houseNumber": "1",
      "priority": true,
      "phone": "328-870-7975",
      "street": "New Albany Farms Road",
      "name": "Maurine Kozey",
      "attributes": [4],
      "id": 8,
      "state": "OH",
      "longitude": "-82.8030566054"
    },
    {
      "country": "USA",
      "address": "606 Valley Forge Court, Westerville, OH 43081, United States",
      "business": "Murazik LLC",
      "city": "Westerville",
      "latitude": "40.1121236193",
      "postalCode": "43081",
      "houseNumber": "606",
      "priority": true,
      "phone": "229-041-6660",
      "street": "Valley Forge Court",
      "name": "Alessandra Kassulke",
      "attributes": [5],
      "id": 9,
      "state": "OH",
      "longitude": "-82.9025803935"
    },
    {
      "country": "USA",
      "address": "1758 Demorest Road, Columbus, OH 43228, United States",
      "business": "Hudson PLC",
      "city": "Columbus",
      "latitude": "39.9224578996",
      "postalCode": "43228",
      "houseNumber": "1758",
      "priority": false,
      "phone": "789-369-8275",
      "street": "Demorest Road",
      "name": "Denis Thompson",
      "attributes": [3],
      "id": 10,
      "state": "OH",
      "longitude": "-83.1093680431"
    },
    {
      "country": "USA",
      "address": "6236 Delta Loop, Dublin, OH 43016, United States",
      "business": "Davis and Sons",
      "city": "Dublin",
      "latitude": "40.0655237611",
      "postalCode": "43016",
      "houseNumber": "6236",
      "priority": false,
      "phone": "951-127-5934",
      "street": "Delta Loop",
      "name": "Kayley Nikolaus",
      "attributes": [2],
      "id": 11,
      "state": "OH",
      "longitude": "-83.1621030848"
    },
    {
      "country": "USA",
      "address": "Outerbelt West, Columbus, OH 43085, United States",
      "business": "Legros Group",
      "city": "Columbus",
      "latitude": "40.1114834621",
      "postalCode": "43085",
      "priority": true,
      "phone": "708-659-3362",
      "street": "Outerbelt West",
      "name": "Madie Okuneva",
      "attributes": [2],
      "id": 12,
      "state": "OH",
      "longitude": "-82.9797177446"
    },
    {
      "country": "USA",
      "address": "1987 Reynoldsburg New Albany Road, Blacklick, OH 43004, United States",
      "business": "McDermott and Sons",
      "city": "Blacklick",
      "latitude": "40.0234242051",
      "postalCode": "43004",
      "houseNumber": "1987",
      "priority": false,
      "phone": "996-828-6380",
      "street": "Reynoldsburg New Albany Road",
      "name": "Patsy Gislason",
      "attributes": [1],
      "id": 13,
      "state": "OH",
      "longitude": "-82.8182528328"
    },
    {
      "country": "USA",
      "address": "3762 North Waggoner Road, Blacklick, OH 43004, United States",
      "business": "Halvorson PLC",
      "city": "Blacklick",
      "latitude": "40.0310186180",
      "postalCode": "43004",
      "houseNumber": "3762",
      "priority": false,
      "phone": "707-044-5008",
      "street": "North Waggoner Road",
      "name": "Maeve Kulas",
      "attributes": [3],
      "id": 14,
      "state": "OH",
      "longitude": "-82.7895214754"
    },
    {
      "country": "USA",
      "address": "1151 Forest Drive, Columbus, OH 43223, United States",
      "business": "Zieme LLC",
      "city": "Columbus",
      "latitude": "39.9321025685",
      "postalCode": "43223",
      "houseNumber": "1151",
      "priority": true,
      "phone": "403-902-1048",
      "street": "Forest Drive",
      "name": "Louisa Rau",
      "attributes": [3],
      "id": 15,
      "state": "OH",
      "longitude": "-83.0459698307"
    },
    {
      "country": "USA",
      "address": "2104 Winslow Drive, Columbus, OH 43207, United States",
      "business": "Dibbert Inc",
      "city": "Columbus",
      "latitude": "39.9256217809",
      "postalCode": "43207",
      "houseNumber": "2104",
      "priority": true,
      "phone": "090-276-4191",
      "street": "Winslow Drive",
      "name": "Tremayne Monahan",
      "attributes": [4],
      "id": 16,
      "state": "OH",
      "longitude": "-82.9395877341"
    },
    {
      "country": "USA",
      "address": "4501 Sullivant Avenue, Columbus, OH 43228, United States",
      "business": "Will Inc",
      "city": "Columbus",
      "latitude": "39.9394581257",
      "postalCode": "43228",
      "houseNumber": "4501",
      "priority": true,
      "phone": "720-927-4015",
      "street": "Sullivant Avenue",
      "name": "Earl Schoen",
      "attributes": [2],
      "id": 17,
      "state": "OH",
      "longitude": "-83.1188816672"
    },
    {
      "country": "USA",
      "address": "5115 Fisher Road, Columbus, OH 43228, United States",
      "business": "Abernathy PLC",
      "city": "Columbus",
      "latitude": "39.9716960535",
      "postalCode": "43228",
      "houseNumber": "5115",
      "priority": true,
      "phone": "493-948-3590",
      "street": "Fisher Road",
      "name": "Sage Bashirian",
      "attributes": [2],
      "id": 18,
      "state": "OH",
      "longitude": "-83.1314915086"
    },
    {
      "country": "USA",
      "address": "4298 Central College Road, Westerville, OH 43081, United States",
      "business": "Cormier Group",
      "city": "Westerville",
      "latitude": "40.1052962677",
      "postalCode": "43081",
      "houseNumber": "4298",
      "priority": true,
      "phone": "016-964-8521",
      "street": "Central College Road",
      "name": "Bethany Bins",
      "attributes": [5],
      "id": 19,
      "state": "OH",
      "longitude": "-82.8762428834"
    },
    {
      "country": "USA",
      "address": "647 Camden Yard Court, Columbus, OH 43235, United States",
      "business": "Mante and Sons",
      "city": "Columbus",
      "latitude": "40.0651771439",
      "postalCode": "43235",
      "houseNumber": "647",
      "priority": false,
      "phone": "347-266-3030",
      "street": "Camden Yard Court",
      "name": "Ocie DuBuque",
      "attributes": [4],
      "id": 20,
      "state": "OH",
      "longitude": "-83.0374290898"
    },
    {
      "country": "USA",
      "address": "4141 Tuller Road, Dublin, OH 43017, United States",
      "business": "Erdman PLC",
      "city": "Dublin",
      "latitude": "40.1076986289",
      "postalCode": "43017",
      "houseNumber": "4141",
      "priority": false,
      "phone": "718-750-8118",
      "street": "Tuller Road",
      "name": "Vaughn Swift",
      "attributes": [4],
      "id": 21,
      "state": "OH",
      "longitude": "-83.1009760497"
    },
    {
      "country": "USA",
      "address": "2934 Alkire Road, Grove City, OH 43123, United States",
      "business": "Gleichner Ltd",
      "city": "Grove City",
      "latitude": "39.9164178754",
      "postalCode": "43123",
      "houseNumber": "2934",
      "priority": true,
      "phone": "577-249-0113",
      "street": "Alkire Road",
      "name": "Merritt McLaughlin",
      "attributes": [1],
      "id": 22,
      "state": "OH",
      "longitude": "-83.0832632843"
    },
    {
      "country": "USA",
      "address": "402 Woodcliff Drive, Columbus, OH 43213, United States",
      "business": "Goodwin and Sons",
      "city": "Columbus",
      "latitude": "39.9811387931",
      "postalCode": "43213",
      "houseNumber": "402",
      "priority": true,
      "phone": "601-222-0476",
      "street": "Woodcliff Drive",
      "name": "Marcelo Hermann",
      "attributes": [2],
      "id": 23,
      "state": "OH",
      "longitude": "-82.8676189667"
    },
    {
      "country": "USA",
      "address": "4852 Honeysuckle Boulevard, Columbus, OH 43230, United States",
      "business": "Satterfield Ltd",
      "city": "Columbus",
      "latitude": "40.0708547749",
      "postalCode": "43230",
      "houseNumber": "4852",
      "priority": true,
      "phone": "775-825-7330",
      "street": "Honeysuckle Boulevard",
      "name": "Shayne Stoltenberg",
      "attributes": [4],
      "id": 24,
      "state": "OH",
      "longitude": "-82.9163915406"
    },
    {
      "country": "USA",
      "address": "30361 Aberdeen Avenue, Columbus, OH 43219, United States",
      "business": "Hayes LLC",
      "city": "Columbus",
      "latitude": "40.0188060807",
      "postalCode": "43219",
      "houseNumber": "30361",
      "priority": false,
      "phone": "193-877-1512",
      "street": "Aberdeen Avenue",
      "name": "Kristy Stanton",
      "attributes": [2],
      "id": 25,
      "state": "OH",
      "longitude": "-82.9106411128"
    }
  ]
}
```

### Step 3: Setup Additional Custom Parameters

Nextbillion's Route Optimization API provides a robust set of over 50 parameters, allowing users to tailor optimization to their specific requirements. In this integration, key parameters like `max_tasks`, `service time`, and `shift time window` are used to fine-tune the optimization process.

Additionally, it is important to define the vehicle's start location and end location. These locations can represent the warehouse from which the vehicle originates and returns after completing deliveries. The `service time` parameter is critical because it represents the time delivery personnel are required to complete an order.

With the help of these custom parameters, businesses can optimize their route planning and align their goals to meet their logistical objectives. Refer to our [Route Optimization API Tutorials](https://docs.nextbillion.ai/optimization/route-optimization-flexible-api/tutorials) to learn more about these custom parameters.

![documentation image](https://static.nextbillion.io/docs-next/integrations/verizon-connect/verizon-connect-05.webp)

Once all necessary data fields have been filled out with relevant information, the inputs can be sent to Nextbillion's Route Optimization API.

### Step 4: Data Preparation and Mapping with Route Optimization API

- After successfully pulling data from Verizon Connect, integrate the fetched data with Route Optimization API.
- Use the provided API endpoint to map the data to respective API parameters.
- Configure optimization settings, including shift start and end times, service time, and start and end location coordinates.

```javascript
let vehicles = [];
let shifts = [];
let starts = [];
let ends = [];
let veh_attr = [];
let stop_attr = [];
let jobs_index = 1;
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
workOrders.data.forEach((planstop) => {
  let job = {
    id: planstop.id,
    description: planstop.address,
    location_index: location_index++,
    service: numberInput1.value,
    priority: 0,
  };
  location.push(`${planstop.latitude},${planstop.longitude}`);

  jobs.push(job);
});

// Add shift start/stop location to location index
location.push(`${txtVehicleStartPosition2.value}`);
location.push(`${txtVehicleEndPosition2.value}`);
location_index += 1;
let veh_fixed_cost = 0;
tblDrivers.data.forEach((v, idx) => {
  let breaks = [];
  let vehicle = {
    id: vehicle_index++,
    start_index: location_index,
    end_index: tglRoundTrip.value ? location_index : null,
    time_window: [shiftStart, shiftEnd],
    max_tasks: max_tasks.value,
    costs: {
      fixed: veh_fixed_cost,
    },
  };
  vehicles.push(vehicle);
  veh_fixed_cost += 0;
});

locations = {
  id: 1,
  description: "Verizon Connect",
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

### Step 5: Create Optimization Job with Route Optimization API

In this step, the mapped data is sent to Route Optimization API to create an optimization job and response confirms the job creation and returns a unique job `id`.

#### API Request

The following cURL command sends a POST request to the Route Optimization API to create an optimization job.

```bash
#POST Query
curl --request POST \
  --url https://api.nextbillion.io/optimization/v2?key={{localStorage.values.apiKey}}
```

#### API Response

The following API response confirms the creation of an optimization job.

```json
{
  "id": "5321be606a4896572c84794d2d5ffa93",
  "message": "Optimization job created",
  "status": "Ok"
}
```

### Step 6: Retrieve Optimized Route Result

Retrieve the optimized route result by making a GET request to the NextBillion.ai Route Optimization API with the job ID and API key.

#### API Request

Use the following GET Query request to retrieve the optimized route result.

```bash
https://api.nextbillion.io/optimization/v2/result?id={{nbaiOptimizationRun.data.id}}&key={{localStorage.values.apiKey}}
```

#### API Response

Upon successful retrieval, the API responds with a JSON structure, providing important information about the optimized route.

```json
{
  "result": {
    "code": 0,
    "summary": {
      "cost": 24713,
      "routes": 5,
      "unassigned": 0,
      "setup": 0,
      "service": 3000,
      "duration": 24713,
      "waiting_time": 0,
      "priority": 0,
      "distance": 401736
    },
    "routes": [
      {
        "vehicle": 2,
        "cost": 5718,
        "steps": [
          {
            "type": "start",
            "arrival": 1707359400,
            "duration": 0,
            "service": 0,
            "waiting_time": 0,
            "location": [39.857, -83.016],
            "location_index": 26,
            "distance": 0
          },
          {
            "type": "job",
            "arrival": 1707361355,
            "duration": 1955,
            "service": 120,
            "waiting_time": 0,
            "location": [40.0205362958, -82.7770253173],
            "location_index": 2,
            "id": 3,
            "description": "8130 Havens Corners Road, Blacklick, OH 43004, United States",
            "distance": 37035,
            "long_id": "3"
          },
          {
            "type": "job",
            "arrival": 1707361884,
            "duration": 2364,
            "service": 120,
            "waiting_time": 0,
            "location": [40.0273895957, -82.8318612949],
            "location_index": 23,
            "id": 24,
            "description": "3515 Mann Road, Blacklick, OH 43004, United States",
            "distance": 43190,
            "long_id": "24"
          },
          {
            "type": "job",
            "arrival": 1707362166,
            "duration": 2526,
            "service": 120,
            "waiting_time": 0,
            "location": [40.0327426512, -82.845042013],
            "location_index": 4,
            "id": 5,
            "description": "5634 Clark State Road, Columbus, OH 43230, United States",
            "distance": 45004,
            "long_id": "5"
          },
          {
            "type": "job",
            "arrival": 1707362784,
            "duration": 3024,
            "service": 120,
            "waiting_time": 0,
            "location": [40.059031796, -82.8541518287],
            "location_index": 7,
            "id": 8,
            "description": "3888 Bufflehead Drive, Columbus, OH 43230, United States",
            "distance": 51787,
            "long_id": "8"
          },
          {
            "type": "job",
            "arrival": 1707363412,
            "duration": 3532,
            "service": 120,
            "waiting_time": 0,
            "location": [40.0845150292, -82.849768744],
            "location_index": 19,
            "id": 20,
            "description": "6030 North Hamilton Road, Westerville, OH 43081, United States",
            "distance": 57226,
            "long_id": "20"
          },
          {
            "type": "end",
            "arrival": 1707365718,
            "duration": 5718,
            "service": 0,
            "waiting_time": 0,
            "location": [39.857, -83.016],
            "location_index": 26,
            "distance": 102405
          }
        ],
        "service": 600,
        "duration": 5718,
        "waiting_time": 0,
        "priority": 0,
        "distance": 102405,
        "geometry": "eyfrFdouyNXEb@FjAZZBxFOtL`A~BNV?~@I~A_@xD}AvB_Aj@]X[Zi@p@sBJo@BW?YGg@K_Bi@aHKg@GYU[gDuDuAwAQUIYOaAKaAOcCY}CCw@Ae@BSFILKNEjAORGNMJOFOJOLI`@MRMNK\\o@r@{...",
        "long_vehicle_id": "2"
      },
      {
        "vehicle": 3,
        "cost": 5501,
        "steps": [
          {
            "type": "start",
            "arrival": 1707359400,
            "duration": 0,
            "service": 0,
            "waiting_time": 0,
            "location": [39.857, -83.016],
            "location_index": 26,
            "distance": 0
          },
          {
            "type": "job",
            "arrival": 1707360924,
            "duration": 1524,
            "service": 120,
            "waiting_time": 0,
            "location": [40.0009064766, -83.0148227715],
            "location_index": 11,
            "id": 12,
            "description": "305 West 17th Avenue, Columbus, OH 43210, United States",
            "distance": 25703,
            "long_id": "12"
          },
          {
            "type": "job",
            "arrival": 1707361990,
            "duration": 2470,
            "service": 120,
            "waiting_time": 0,
            "location": [40.1182441954, -83.0607233519],
            "location_index": 15,
            "id": 16,
            "description": "7856 Maplecreek Court, Powell, OH 43065, United States",
            "distance": 43412,
            "long_id": "16"
          },
          {
            "type": "job",
            "arrival": 1707362893,
            "duration": 3253,
            "service": 120,
            "waiting_time": 0,
            "location": [40.0900637228, -83.1625856861],
            "location_index": 18,
            "id": 19,
            "description": "6048 Anna Loop, Dublin, OH 43016, United States",
            "distance": 54931,
            "long_id": "19"
          },
          {
            "type": "job",
            "arrival": 1707363198,
            "duration": 3438,
            "service": 120,
            "waiting_time": 0,
            "location": [40.0963156075, -83.1504041829],
            "location_index": 21,
            "id": 22,
            "description": "5995 Shier Rings Road, Dublin, OH 43016, United States",
            "distance": 56816,
            "long_id": "22"
          },
          {
            "type": "job",
            "arrival": 1707363793,
            "duration": 3913,
            "service": 120,
            "waiting_time": 0,
            "location": [40.0328520288, -83.1292023454],
            "location_index": 16,
            "id": 17,
            "description": "3900 Lyman Drive, Hilliard, OH 43026, United States",
            "distance": 67289,
            "long_id": "17"
          },
          {
            "type": "end",
            "arrival": 1707365501,
            "duration": 5501,
            "service": 0,
            "waiting_time": 0,
            "location": [39.857, -83.016],
            "location_index": 26,
            "distance": 97774
          }
        ],
        "service": 600,
        "duration": 5501,
        "waiting_time": 0,
        "priority": 0,
        "distance": 97774,
        "geometry": "eyfrFdouyNXEb@FjAZZBxFOtL`A~BNV?~@I~A_@xD}AvB_Aj@]X[Zi@p@sBJo@BW?YGg@K_Bi@aHKg@GYU[gDuDuAwAQUIYOaAKaAOcCY}CCw@Ae@BSFILKNEjAORGNMJOFOJOLI`@MRMNK\\o@r@{...",
        "long_vehicle_id": "3"
      },
      {
        "vehicle": 4,
        "cost": 5050,
        "steps": [
          {
            "type": "start",
            "arrival": 1707359400,
            "duration": 0,
            "service": 0,
            "waiting_time": 0,
            "location": [39.857, -83.016],
            "location_index": 26,
            "distance": 0
          },
          {
            "type": "job",
            "arrival": 1707360751,
            "duration": 1351,
            "service": 120,
            "waiting_time": 0,
            "location": [39.9012240927, -82.890471931],
            "location_index": 24,
            "id": 25,
            "description": "3593 Winchester Bend Drive, Columbus, OH 43232, United States",
            "distance": 20923,
            "long_id": "25"
          },
          {
            "type": "job",
            "arrival": 1707361247,
            "duration": 1727,
            "service": 120,
            "waiting_time": 0,
            "location": [39.9055140889, -82.8638316921],
            "location_index": 3,
            "id": 4,
            "description": "3501 Wyncote Road, Columbus, OH 43232, United States",
            "distance": 25194,
            "long_id": "4"
          },
          {
            "type": "job",
            "arrival": 1707362230,
            "duration": 2590,
            "service": 120,
            "waiting_time": 0,
            "location": [39.9695232749, -82.8845216127],
            "location_index": 8,
            "id": 9,
            "description": "265 Saint Christopher Lane, Columbus, OH 43213, United States",
            "distance": 34561,
            "long_id": "9"
          },
          {
            "type": "job",
            "arrival": 1707363020,
            "duration": 3260,
            "service": 120,
            "waiting_time": 0,
            "location": [40.0055772761, -82.9197393195],
            "location_index": 17,
            "id": 18,
            "description": "2875 Drake Road, Columbus, OH 43219, United States",
            "distance": 42464,
            "long_id": "18"
          },
          {
            "type": "job",
            "arrival": 1707363435,
            "duration": 3555,
            "service": 120,
            "waiting_time": 0,
            "location": [39.9838950754, -82.9424145451],
            "location_index": 20,
            "id": 21,
            "description": "2299 Willamont Avenue, Columbus, OH 43219, United States",
            "distance": 46499,
            "long_id": "21"
          },
          {
            "type": "end",
            "arrival": 1707365050,
            "duration": 5050,
            "service": 0,
            "waiting_time": 0,
            "location": [39.857, -83.016],
            "location_index": 26,
            "distance": 74082
          }
        ],
        "service": 600,
        "duration": 5050,
        "waiting_time": 0,
        "priority": 0,
        "distance": 74082,
        "geometry": "eyfrFdouyNXEb@FjAZZBxFOtL`A~BNV?~@I~A_@xD}AvB_Aj@]X[Zi@p@sBJo@BW?YGg@K_Bi@aHKg@GYU[gDuDuAwAQUIYOaAKaAOcCY}CCw@Ae@BSFILKNEjAORGNMJOFOJOLI`@MRMNK\\o@r@{...",
        "long_vehicle_id": "4"
      },
      {
        "vehicle": 5,
        "cost": 4174,
        "steps": [
          {
            "type": "start",
            "arrival": 1707359400,
            "duration": 0,
            "service": 0,
            "waiting_time": 0,
            "location": [39.857, -83.016],
            "location_index": 26,
            "distance": 0
          },
          {
            "type": "job",
            "arrival": 1707360634,
            "duration": 1234,
            "service": 120,
            "waiting_time": 0,
            "location": [39.9683791648, -83.0136343846],
            "location_index": 12,
            "id": 13,
            "description": "448 West Nationwide Boulevard, Columbus, OH 43215, United States",
            "distance": 19708,
            "long_id": "13"
          },
          {
            "type": "job",
            "arrival": 1707361105,
            "duration": 1585,
            "service": 120,
            "waiting_time": 0,
            "location": [39.9790261832, -83.0514921062],
            "location_index": 22,
            "id": 23,
            "description": "1090 Elmwood Avenue, Columbus, OH 43212, United States",
            "distance": 23997,
            "long_id": "23"
          },
          {
            "type": "job",
            "arrival": 1707361865,
            "duration": 2225,
            "service": 120,
            "waiting_time": 0,
            "location": [39.9829391053, -83.1347601123],
            "location_index": 13,
            "id": 14,
            "description": "5100 Trabue Road, Columbus, OH 43228, United States",
            "distance": 33801,
            "long_id": "14"
          },
          {
            "type": "job",
            "arrival": 1707362117,
            "duration": 2357,
            "service": 120,
            "waiting_time": 0,
            "location": [39.9949285833, -83.1367883681],
            "location_index": 6,
            "id": 7,
            "description": "2070 Walcutt Road, Columbus, OH 43228, United States",
            "distance": 35584,
            "long_id": "7"
          },
          {
            "type": "job",
            "arrival": 1707362767,
            "duration": 2887,
            "service": 120,
            "waiting_time": 0,
            "location": [39.9399519952, -83.126812587],
            "location_index": 10,
            "id": 11,
            "description": "615 South Murray Hill Road, Columbus, OH 43228, United States",
            "distance": 45130,
            "long_id": "11"
          },
          {
            "type": "end",
            "arrival": 1707364174,
            "duration": 4174,
            "service": 0,
            "waiting_time": 0,
            "location": [39.857, -83.016],
            "location_index": 26,
            "distance": 66161
          }
        ],
        "service": 600,
        "duration": 4174,
        "waiting_time": 0,
        "priority": 0,
        "distance": 66161,
        "geometry": "eyfrFdouyNXEb@FjAZZBxFOtL`A~BNV?~@I~A_@xD}AvB_Aj@]X[Zi@p@sBJo@BW?YGg@K_Bi@aHKg@GYU[gDuDuAwAQUIYOaAKaAOcCY}CCw@Ae@BSFILKNEjAORGNMJOFOJOLI`@MRMNK\\o@r@...",
        "long_vehicle_id": "5"
      },
      {
        "vehicle": 6,
        "cost": 4270,
        "steps": [
          {
            "type": "start",
            "arrival": 1707359400,
            "duration": 0,
            "service": 0,
            "waiting_time": 0,
            "location": [39.857, -83.016],
            "location_index": 26,
            "distance": 0
          },
          {
            "type": "job",
            "arrival": 1707360625,
            "duration": 1225,
            "service": 120,
            "waiting_time": 0,
            "location": [39.912305246, -83.1051441243],
            "location_index": 1,
            "id": 2,
            "description": "4181 Alkire Road, Grove City, OH 43123, United States",
            "distance": 18504,
            "long_id": "2"
          },
          {
            "type": "job",
            "arrival": 1707361363,
            "duration": 1843,
            "service": 120,
            "waiting_time": 0,
            "location": [39.9361111939, -83.0262344422],
            "location_index": 14,
            "id": 15,
            "description": "1111 Stimmel Road, Columbus, OH 43223, United States",
            "distance": 27233,
            "long_id": "15"
          },
          {
            "type": "job",
            "arrival": 1707362016,
            "duration": 2376,
            "service": 120,
            "waiting_time": 0,
            "location": [39.9358150173, -82.9640045795],
            "location_index": 0,
            "id": 1,
            "description": "1460 Lockbourne Road, Columbus, OH 43206, United States",
            "distance": 33393,
            "long_id": "1"
          },
          {
            "type": "job",
            "arrival": 1707362402,
            "duration": 2642,
            "service": 120,
            "waiting_time": 0,
            "location": [39.9195325024, -82.9455258687],
            "location_index": 5,
            "id": 6,
            "description": "2148 Refugee Road, Columbus, OH 43207, United States",
            "distance": 36950,
            "long_id": "6"
          },
          {
            "type": "job",
            "arrival": 1707363152,
            "duration": 3272,
            "service": 120,
            "waiting_time": 0,
            "location": [39.8748064919, -83.0231501111],
            "location_index": 9,
            "id": 10,
            "description": "4070 Jackson Pike, Grove City, OH 43123, United States",
            "distance": 48414,
            "long_id": "10"
          },
          {
            "type": "end",
            "arrival": 1707364270,
            "duration": 4270,
            "service": 0,
            "waiting_time": 0,
            "location": [39.857, -83.016],
            "location_index": 26,
            "distance": 61314
          }
        ],
        "service": 600,
        "duration": 4270,
        "waiting_time": 0,
        "priority": 0,
        "distance": 61314,
        "geometry": "eyfrFdouyNXEb@FjAZZBxFOtL`A~BNV?~@I~A_@xD}AvB_Aj@]X[Zi@p@sBJo@BW?YGg@K_Bi@aHKg@GYU[gDuDuAwAQUIYOaAKaAOcCY}CCw@Ae@BSFILKNEjAORGNMJOFOJOLI`@MRMNK\\o@r@{...",
        "long_vehicle_id": "6"
      }
    ]
  },
  "status": "Ok",
  "message": ""
}
```

## Visualize Routes using Nextbillion.ai's Route Planner Tool

Explore and analyze optimized routes effortlessly using [NextBillion.ai's Route Planner Tool](https://console.nextbillion.ai/route-planner). This tool is accessible through [NextBillion.ai's Cloud Console (NCC)](https://iam.nextbillion.ai/start), providing a user-friendly interface for visualizing, reviewing, and fine-tuning routes generated by the optimization process.

Seamlessly navigate through the routes, gaining valuable insights into the geographical distribution and efficiency of planned tasks. Leverage the Route Planner Tool within NCC to enhance route visualization and optimize your field service operations with ease.

The following image showcases the optimized routes within the Route Planner Tool interface.

![documentation image](https://static.nextbillion.io/docs-next/integrations/verizon-connect/verizon-connect-06.webp)

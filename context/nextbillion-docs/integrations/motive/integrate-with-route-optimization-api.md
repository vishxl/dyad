# Integrate Fetched Data with Route Optimization API

After successfully retrieving the necessary data from Motive, the next step is to integrate this data with the NextBillion.ai Route Optimization API.

Follow the steps below to map the fetched Motive data to the API parameters and configure the optimization settings.

## Step 1: Map and Configure Parameters

First, prepare the data and configuration parameters. Here's an explanation of the key components:

```js
// Initialize arrays for storing data
let vehicles = [];
let shifts = [];
let starts = [];
let ends = [];
let veh_attr = [];
let stop_attr = [];
let vehicle_index = 1;

// Convert shift start and end times to UNIX timestamp
let shiftStart = new Date(dtShiftStart2.value).getTime() / 1000;
let shiftEnd = new Date(dtShiftEnd2.value).getTime() / 1000;

// Initialize arrays for jobs, locations, and shipments
let locations = [];
let jobs = [];
let shipments = [];
vehicles = [];
veh_attr = [];
stop_attr = [];
```

- **vehicles**: Array to store vehicle data.
- **shifts**, **starts**, **ends**: Arrays for storing shift-related data.
- **veh_attr**, **stop_attr**: Arrays for vehicle and stop attributes.
- **vehicle_index**: Index to track vehicles.
- **shiftStart**, **shiftEnd**: Convert shift times to UNIX timestamp format.

## Step 2: Build the Optimization Problem

Create job arrays and indexed lists of locations by iterating through all stops.

```javascript
let location_index = 0;
let location = [];

tblAddresses.selectedRows.forEach((planstop) => {
  let job = {
    id: parseInt(planstop.dispatch_location.id),
    description: planstop.dispatch_location.vendor_id,
    location_index: location_index++,
    service: numberInput1.value,
    priority: 0,
    // Optional: time_windows: [[from, to]]
  };
  location.push(
    `${planstop.dispatch_location.lat},${planstop.dispatch_location.lon}`,
  );
  jobs.push(job);
});
```

- **location_index**: Index to track locations.
- **location**: Array to store location data.
- **jobs**: Array to store job data including job ID, description, location index, and service time.

## Step 3: Add Shift Start/End Locations

Include shift start and end locations in the index.

```javascript
location.push(`${txtVehicleStartPosition2.value}`);
location.push(`${txtVehicleEndPosition2.value}`);
location_index += 1;
```

## Step 4: Define Vehicles and Their Attributes

Configure vehicle-related data including start index, time window, maximum tasks, and fixed costs.

```javascript
let veh_fixed_cost = 0;
tblDrivers.selectedRows.forEach((v) => {
  let vehicle = {
    id: parseInt(v.Driver_Id),
    start_index: location_index,
    time_window: [shiftStart, shiftEnd],
    max_tasks: 25,
    costs: {
      fixed: veh_fixed_cost,
    },
  };
  vehicles.push(vehicle);
  veh_fixed_cost += 2;
});
locations = {
  id: 12,
  description: "Motive Test",
  location: location,
};
let options = {
  routing: {
    mode: "car",
  },
};
```

- **veh_fixed_cost**: Incremental cost associated with each vehicle.
- **vehicles**: Array to store vehicle details including ID, start index, time window, max tasks, and costs.
- **locations**: Object to store all locations.
- **options**: Configuration for routing mode.

## Step 5: Store Data and Trigger Optimization

Store the configured data in local storage and trigger the optimization process.

```javascript
localStorage.setValue("vehiclesNBAI", vehicles);
localStorage.setValue("shipmentsNBAI", shipments);
localStorage.setValue("jobsNBAI", jobs);
localStorage.setValue("locationsNBAI", locations);
localStorage.setValue("nbaiOptions", options);
localStorage.setValue("nbaiVRPResult", null);

nbaiOptimizationRun.trigger();
```

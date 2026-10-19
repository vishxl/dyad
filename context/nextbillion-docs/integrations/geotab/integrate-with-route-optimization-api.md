# Integrate with Route Optimization API

After retrieving the lists of vehicles and delivery locations from Geotab, the next step is to map this data to the required format for the Nextbillion.ai’s Route Optimization API.

By using the advanced parameters of the API, you can further refine and customize the optimization process, ensuring efficient and cost-effective last-mile delivery operations.

## Step 1: Initialize Variables

Start by initializing the necessary variables to store vehicle and job data, shift times, and location indices.

```javascript
let vehicles = [];
let shifts = [];
let starts = [];
let ends = [];
let veh_attr = [];
let stop_attr = [];
let vehicle_index = 1;
let job_index = 1;
let shiftStart = new Date(dtShiftStart2.value).getTime() / 1000;
let shiftEnd = new Date(dtShiftEnd2.value).getTime() / 1000;
```

- vehicles, shifts, starts, ends: Arrays to store vehicle and shift information.
- veh_attr, stop_attr: Arrays to store vehicle and stop attributes.
- vehicle_index, job_index: Counters for indexing vehicles and jobs.
- shiftStart, shiftEnd: Convert shift start and end times to UNIX timestamps.

## Step 2: Reset and Initialize Job and Location Arrays

Initialize arrays to hold locations, jobs, and shipments data. Reset the previously defined arrays to ensure clean data processing.

```javascript
let locations = [];
let jobs = [];
let shipments = [];
vehicles = [];
veh_attr = [];
stop_attr = [];
```

## Step 3: Create Job Array and Indexed List of Locations

Iterate through each stop and create job objects while maintaining an indexed list of locations.

```javascript
let location_index = 0;
let location = [];
address.data.forEach((planstop) => {
  let job = {
    id: job_index++,
    description: planstop.id,
    location_index: location_index++,
    service: numberInput1.value,
    priority: 0,
    //time_windows: [[from,to]]
  };
  location.push(`${planstop.points[0].y},${planstop.points[0].x}`);

  jobs.push(job);
});
```

- `address.data.forEach`: Loop through each stop in the address data.
- `job`: Create a job object with unique ID, description, location index, service time, and priority.
- `location.push`: Add the coordinates of each stop to the location array.
- `jobs.push`: Add the job object to the jobs array.

## Step 4: Add Shift Start and End Locations

Add the start and end locations to the location index and store their indices.

```javascript
location.push(`${end_location.value}`);
let endLocationIndex = location_index; // Store the index for the end location
location_index += 1;

location.push(`${start_location.value}`);
let startLocationIndex = location_index; // Store the index for the start location
location_index += 1;
```

- `location.push`: Add the end and start locations to the location array.
- `endLocationIndex, startLocationIndex`: Store indices for end and start locations.

## Step 5: Create Vehicle Objects

Loop through each selected vehicle and create vehicle objects with start and end location indices, shift times, and costs.

```javascript
let veh_fixed_cost = 0;
trucks.selectedRows.forEach((v) => {
  let vehicle = {
    id: vehicle_index++,
    description: v.name,
    start_index: startLocationIndex,
    end_index: endLocationIndex,
    time_window: [shiftStart, shiftEnd],
    max_tasks: 25,
    costs: {
      fixed: veh_fixed_cost,
    },
  };
  vehicles.push(vehicle);
  veh_fixed_cost += 2;
});
```

- `trucks.selectedRows.forEach`: Loop through each selected vehicle.
- `vehicle`: Create a vehicle object with unique ID, description, start and end location indices, shift times, max tasks, and fixed costs.
- `vehicles.push`: Add the vehicle object to the vehicles array.
- `veh_fixed_cost`: Increment the fixed cost for each vehicle.

## Step 6: Create Locations Object

Create an object to store location data.

```javascript
locations = {
  id: 12,
  description: "GeoTab Test",
  location: location,
};
```

### Step 7: Define Optimization Options

Set up the optimization options, including the objective and routing mode.

```javascript
let options = {
  objective: {
    travel_cost: "duration",
    custom: {
      type: "min",
      value: "vehicles",
    },
  },
  routing: {
    mode: "car",
  },
};
```

### Step 8: Store Data in Local Storage

Save the vehicles, shipments, jobs, locations, and options data in local storage for use by the optimization process.

```javascript
localStorage.setValue('vehiclesNBAI', vehicles);
localStorage.setValue('shipmentsNBAI', shipments);
localStorage.setValue('jobsNBAI', jobs);
localStorage.setValue('locationsNBAI', locations);
localStorage.setValue('nbaiOptions', options);
localStorage.setValue('nbaiVRPResult', null);

`localStorage.setValue` stores the data in local storage for use by the Nextbillion Route Optimization API.
```

### Step 9: Trigger Optimization Process

Finally, trigger the optimization process using the saved data.

```javascript
nbaiOptimizationRun.trigger();
```

By following these detailed steps, you can effectively map and integrate the fetched data with the Nextbillion Route Optimization API, enabling efficient and optimized delivery route planning.

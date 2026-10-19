## Interface OptimizationMvrpRetrieveRequestV2

### Properties

| Name            |                                                                                                                        |
| --------------- | ---------------------------------------------------------------------------------------------------------------------- |
| apiKey Optional | Type: string<br> <br>api key for the request                                                                           |
| id              | Type: string<br> <br>Unique Reference ID for the submitted VRP. It is the id returned from optimization POST response. |

## Interface OptimizationMvrpRetrieveResultV2

Notes:  
the expected order for all coordinates arrays is \[lon, lat\]  
all timings are in seconds  
all distances are in meters  
a time_window object is a pair of timestamps in the form \[start, end\]  
cost values in output are the one used in the optimization objective (currently equal to duration)  
a "task" is either a job, a pickup or a delivery

### Properties

| Name                 |                                                                                                   |
| -------------------- | ------------------------------------------------------------------------------------------------- |
| description Optional | Type: string<br> <br>This will return a value if it is set in the description top level property. |
| message              | Type: string<br> <br>Describe the error if one occurs during processing data                      |
| result               | Type: [OptimizationMvrpRetrieveResultDataV2](#interface-optimizationmvrpretrieveresultdatav2)     |
| status               | Type: NBRequestStatus<br> <br>Describes the process status                                        |

## Interface OptimizationMvrpRetrieveResultDataV2

### Properties

| Name          |                                                                                       |
| ------------- | ------------------------------------------------------------------------------------- |
| code Optional | Type: number<br> <br>0: no error, 1: internal error, 2: input error, 3: routing error |
| error         | Type: string                                                                          |
| routes        | Type: Array<[OptimizationMvrpRouteV2](#interface-optimizationmvrproutev2)\>           |
| summary       | Type: [OptimizationMvrpSummaryV2](#interface-optimizationmvrpsummaryv2)               |
| unassigned    | Type: Array<[OptimizationMvrpUnassignedV2](#interface-optimizationmvrpunassignedv2)\> |

## Interface OptimizationMvrpUnassignedV2

### Properties

| Name                 |                     |
| -------------------- | ------------------- |
| description Optional | Type: string        |
| id Optional          | Type: number        |
| location Optional    | Type: Array<number> |
| task_type Optional   | Type: string        |

## Interface OptimizationMvrpOrderRequestV2

Notes:  
the expected order for all coordinates arrays is \[lon, lat\]  
all timings are in seconds  
all distances are in meters  
a time_window object is a pair of timestamps in the form \[start, end\]  
cost values in output are the one used in the optimization objective (currently equal to duration)  
a "task" is either a job, a pickup or a delivery

### Properties

| Name                 |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| apiKey Optional      | Type: string<br> <br>api key for the request                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| depots Optional      | Type: Array<[OptimizationMvrpOrderDepotV2](#interface-optimizationmvrporderdepotv2)\><br> <br>The Depot object describes a depot location that can be used as a starting point and/or ending point for the routes                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| description Optional | Type: string<br> <br>Describe the optimization job. The description will be returned in the response                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| jobs Optional        | Type: Array<[OptimizationMvrpOrderJobV2](#interface-optimizationmvrporderjobv2)\><br> <br>Describe the places to visit. The Job object describes a particular job or task that needs to be completed as part of the overall optimization process                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| locations            | Type: [OptimizationMvrpOrderLocationV2](#interface-optimizationmvrporderlocationv2)<br> <br>Indicate the locations that will be used for optimization                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| options              | Type: [OptimizationMvrpOrderOptionsV2](#interface-optimizationmvrporderoptionsv2)<br> <br>It represents the set of options that can be used to configure an optimization job                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| shipments Optional   | Type: Array<[OptimizationMvrpOrderShipmentV2](#interface-optimizationmvrpordershipmentv2)\><br> <br>Describe pickup and delivery tasks                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| solution             | Type: Array<[OptimizationMvrpRouteV2](#interface-optimizationmvrproutev2)\><br> <br>This parameter is related to the re-optimization feature. It allows for the previous optimization result to be provided in case new orders are received and the solution needs to be re-planned. The solution parameter should contain the same routes as the previous optimization result                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| unassigned           | Type: Array<[OptimizationMvrpOrderUnassignedV2](#interface-optimizationmvrporderunassignedv2)\><br> <br>The "Unassigned" field in the optimization request and response payloads are used to describe any tasks that were not assigned to a vehicle during the optimization process. This could happen because there were not enough vehicles available, the tasks could not be completed within their assigned time windows, or other constraints were not met. <br>If you're re-optimizing a previous job and there are unassigned tasks, the "Unassigned" field should be consistent with the previous optimization result, meaning that any previously unassigned tasks should still be unassigned in the new result. However, if you want to reduce the number of unassigned tasks, there are various strategies you can use, such as: <br>Extending the time windows for vehicles or tasks to give more flexibility <br>Adding more vehicles to the optimization problem <br>Adjusting the priority or weight of different tasks to balance the workload more evenly <br>Modifying other constraints or parameters to make the problem more solvable <br>Ultimately, the goal is to minimize the number of unassigned tasks while still meeting all the necessary constraints and objectives. |
| vehicles             | Type: Array<[OptimizationMvrpOrderVehicleV2](#interface-optimizationmvrpordervehiclev2)\><br> <br>Describe available vehicles                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |

## Interface OptimizationMvrpOrderResultV2

### Properties

| Name    |                       |
| ------- | --------------------- |
| id      | Type: string          |
| message | Type: string          |
| status  | Type: NBRequestStatus |

## Interface OptimizationMvrpOrderJobV2

### Properties

| Name                  |                                                                                                                                                                                                                                         |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| delivery Optional     | Type: Array<number><br> <br>Describe multidimensional quantities for delivery. The amount of delivery will be added to the assigned vehicle’s initial load                                                                              |
| description Optional  | Type: string<br> <br>Description of the job                                                                                                                                                                                             |
| id                    | Type: number<br> <br>Indicate the job id. It cannot be duplicated to another Job’s id                                                                                                                                                   |
| location_index        | Type: number<br> <br>Indicate the index of location in Locations. The valid value range is \[0, length of locations)                                                                                                                    |
| pickup Optional       | Type: Array<number><br> <br>Describe multidimensional quantities for pickup                                                                                                                                                             |
| priority Optional     | Type: number<br> <br>Describe the priority of this job. The valid value is in the range of \[0, 100\]. Its default value is 0. Priority only decides whether this job will be assigned, but has nothing to do with the sequence of jobs |
| service Optional      | Type: number<br> <br>Describe the job service duration. The unit is in second. The default value is 0                                                                                                                                   |
| skills Optional       | Type: Array<number><br> <br>Describe mandatory skills for this job                                                                                                                                                                      |
| time_windows Optional | Type: Array<Array<number>><br> <br>Describe available periods for this job <br> <br>Example: \[\[1656487800,1656516600\],\[1656570000,1656620000\]\]                                                                                    |

## Interface OptimizationMvrpOrderLocationV2

### Properties

| Name     |                                                                                                                                                       |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| id       | Type: number<br> <br>a unique identifier for the location                                                                                             |
| location | Type: Array<[LngLatLike](./geography-and-geometry#LngLatLike-lnglatlike)\><br> <br>Indicate the coordinates that will be used for route optimization. |

## Interface OptimizationMvrpOrderShipmentV2

### Properties

| Name              |                                                                                                                                                                                                                                                        |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| amount Optional   | Type: Array<number><br> <br>It describes multidimensional quantities of a shipment in different units.                                                                                                                                                 |
| delivery          | Type: { description: string,id: number,location_index: number,service: number,time_windows: Array<undefined> }<br> <br>Describe the delivery point for this shipment                                                                                   |
| pickup            | Type: { description: string,id: number,location_index: number,service: number,time_windows: Array<undefined> }<br> <br>Describe the pickup point for this shipment                                                                                     |
| priority Optional | Type: number<br> <br>Describe the priority of this shipment. The valid value is in the range of \[0, 100\]. Its default value is 0. Priority only decides whether this shipment will be assigned, but has nothing to do with the sequence of shipments |
| skills Optional   | Type: Array<number><br> <br>Describe the mandatory skills for this shipment                                                                                                                                                                            |

## Interface OptimizationMvrpOrderVehicleV2

### Properties

| Name                     |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| break Optional           | Type: { description: string,id: number,service: number,time_windows: Array<Array<number>> }<br> <br>Describe the breaks the driver will take                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| capacity Optional        | Type: Array<number><br> <br>The Capacity parameter is used to describe the multidimensional quantities of capacity for each vehicle.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| costs                    | Type: { fixed: number }<br> <br>Describe the cost for using this vehicle. The cost parameter represents the initial cost of using a vehicle and is used to limit the number of vehicles used for optimization. It is a positive integer value with no specific unit. The cost is added to the travel_cost, which is calculated based on user-defined values such as distance or duration. The cost parameter can be used in either absolute or relative values, allowing users to assign default relative values for different vehicle types or skills. Using relative costs provides flexibility for users to optimize their solution without knowing the actual costs of each vehicle, which may vary depending on other factors such as fuel cost or maintenance. The optimization engine will prefer using vehicles with a lower initial cost if some other parameters (location, time, etc) favor the configuration                                |
| depot Optional           | Type: number<br> <br>Describe the depot assigned to this vehicle. Note that if start_index is specified, then its value has to be the same as the specified depot’s location index. There is no restriction on the number of vehicles a depot can contain. One vehicle can only have one depot                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| description Optional     | Type: string<br> <br>Add some description on this vehicle                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| end_index Optional       | Type: number<br> <br>Indicate the index of the vehicle ending point in Locations. The valid value range is \[0, length of locations). If this optional parameter is not used, the resulting route will end at the last visited task, whose choice is determined by the optimization process                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| id                       | Type: number<br> <br>Describe this vehicle’s id. It cannot be duplicated to other vehicle’s IDs                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| max_tasks Optional       | Type: number<br> <br>Describe the max tasks that can be assigned to this vehicle                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| max_travel_cost Optional | Type: number<br> <br>It restricts the maximum distance or time a vehicle can operate during route optimization. This parameter is linked to the "travel_cost" parameter in "option.objective" which determines whether the "max_travel_cost" value will be considered as distance (in meters) or duration (in seconds). For example, if the "travel_cost" parameter is set to 'distance', the "max_travel_cost" value will be considered as the maximum allowable distance that a vehicle can travel during the route optimization. If the "travel_cost" parameter is set to 'duration', the "max_travel_cost" value will be considered as the maximum allowable time that a vehicle can operate during the route optimization. Setting a value for "max_travel_cost" can be useful in ensuring that vehicles do not exceed their operational limits, which can result in increased fuel costs, longer delivery times, and potential vehicle breakdowns |
| skills Optional          | Type: Array<number><br> <br>It is a multi-dimensional feature that describes the skills and abilities of drivers or vehicles                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| start_index              | Type: number<br> <br>Indicate the index of the vehicle starting point in Locations. The valid value range is \[0, length of locations).Please note that in V2 this is a required parameter                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| time_window Optional     | Type: undefined<br> <br>The time_window field is used to describe the time period during which a vehicle is available to perform deliveries or pickups. It is a one-dimensional array, meaning it has a single value that represents the time window for the vehicle. It's important to note that this field should not be confused with the time_windows field used for shipments/jobs, which is a two-dimensional array used to describe the time window for each individual shipment or job. If the time_windows field is incorrectly used for the time_window field, the shift period setting constraint may fail silently, meaning that the vehicle may be assigned to tasks outside of its available time period, leading to incorrect results                                                                                                                                                                                                    |

## Interface OptimizationMvrpOrderDepotV2

### Properties

| Name                 |                                                       |
| -------------------- | ----------------------------------------------------- |
| description Optional | Type: string<br> <br>Add a description for this depot |
| id                   | Type: number<br> <br>Describe the id of this depot    |
| location_index       | Type: number<br> <br>Describe the location of depot   |

## Interface OptimizationMvrpSummaryV2

### Properties

| Name                            |                                          |
| ------------------------------- | ---------------------------------------- |
| cost Optional                   | Type: number                             |
| delivery Optional               | Type: Array<number>                      |
| distance Optional               | Type: number                             |
| duration Optional               | Type: number                             |
| num_late_visits Optional        | Type: number                             |
| num_vehicle_overtime Optional   | Type: number                             |
| pickup Optional                 | Type: Array<number>                      |
| prioriy Optional                | Type: number                             |
| routes Optional                 | Type: number                             |
| service Optional                | Type: number                             |
| total_vehicle_overtime Optional | Type: number                             |
| total_visit_lateness Optional   | Type: number                             |
| unassigned Optional             | Type: number                             |
| violation Optional              | Type: { cause: string,duration: number } |
| waiting_time Optional           | Type: number                             |

## Interface OptimizationMvrpRouteV2

### Properties

| Name                  |                                                                                                                              |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| cost Optional         | Type: number<br> <br>Describe the cost of this route. Right now it is equal to duration                                      |
| delivery Optional     | Type: Array<number><br> <br>Describe the total deliveries in this route                                                      |
| description Optional  | Type: string<br> <br>Description of the vehicle on the route                                                                 |
| distance Optional     | Type: number<br> <br>Describe the total distance in this route                                                               |
| duration Optional     | Type: number<br> <br>Describe the duration of this route                                                                     |
| geometry Optional     | Type: string<br> <br>geometry                                                                                                |
| pickup Optional       | Type: Array<number><br> <br>Describe the total pickups in this route                                                         |
| priority Optional     | Type: number<br> <br>Describe the sum of priorities for this route                                                           |
| service Optional      | Type: number<br> <br>Describe the total service time for this route                                                          |
| steps Optional        | Type: Array<[OptimizationMvrpRouteStepV2](#interface-optimizationmvrproutestepv2)\><br> <br>Describe the steps in this route |
| vehicle               | Type: number<br> <br>Describe the vehicle ID                                                                                 |
| vehicle_overtime      | Type: number<br> <br>The vehicle-overtime of this route                                                                      |
| waiting_time Optional | Type: number<br> <br>Describe the waiting time at this step                                                                  |

## Interface OptimizationMvrpRouteStepV2

### Properties

| Name                    |                                                                                                                                                      |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| arrival Optional        | Type: number<br> <br>Describe the arrival time at this step                                                                                          |
| description Optional    | Type: string<br> <br>Describe this step                                                                                                              |
| duration Optional       | Type: number<br> <br>Describe the duration to this step. (The duration is accumulated here which means it includes the time spent on previous steps) |
| id Optional             | Type: number<br> <br>Describe the id of this task                                                                                                    |
| late_by Optional        | Type: number<br> <br>Describe the visit-lateness of this step                                                                                        |
| load Optional           | Type: Array<number><br> <br>Describe the load of the vehicle after the completion of this step                                                       |
| location Optional       | Type: Array<number><br> <br>Describe the coordinate at this step                                                                                     |
| location_index Optional | Type: number<br> <br>Describe the location index at this step                                                                                        |
| service                 | Type: number<br> <br>Describe the service duration at this step                                                                                      |
| type                    | Type: string<br> <br>Describe the task type of this step                                                                                             |
| violation Optional      | Type: Array<{ cause: string,duration: number }><br> <br>Describe the violations in this step                                                         |
| waiting_time Optional   | Type: number<br> <br>Describe the waiting time at this step                                                                                          |

## Interface OptimizationMvrpOrderOptionsV2

### Properties

| Name                |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| constraint Optional | Type: { max_vehicle_overtime: number,max_visit_lateness: number }<br> <br>Describes the soft constraints of the optimization job. Soft constraints are constraints that do not necessarily have to be satisfied, but the optimization algorithm will try to satisfy them as much as possible. For example, Suppose a vehicle exceeds this overtime limit of 300-time units while servicing a set of orders. In that case, it will be considered a violation of this constraint |
| objective Optional  | Type: { minimise_num_depots: boolean,travel_cost: string }<br> <br>It describes the objective for the optimization job. It specifies whether the optimization should minimize or maximize a particular objective, such as the total distance traveled or the number of vehicles used                                                                                                                                                                                           |
| routing             | Type: { mode: string,traffic_timestamp: number,truck_size: string,truck_weight: number }<br> <br>It describes the routing configurations for the optimization job. It specifies options such as whether to use time-dependent or time-independent routing, and whether to use a specific routing algorithm                                                                                                                                                                     |

## Interface OptimizationMvrpOrderUnassignedV2

### Properties

| Name               |                                                                            |
| ------------------ | -------------------------------------------------------------------------- |
| id Optional        | Type: number<br> <br>Indicate the id of unassigned task                    |
| location Optional  | Type: Array<number><br> <br>Describe the coordinate of the unassigned task |
| task_type Optional | Type: string<br> <br>Describe the unassigned task type                     |

## Constants TravelMode

The transportation mode for the route.

| Constants |                           |
| --------- | ------------------------- |
| AUTO      | default mode, same as car |
| CAR       | car mode                  |
| TRUCK     | truck mode                |

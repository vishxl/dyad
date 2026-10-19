# Clustering API

## Introduction

The Clustering API is designed to facilitate the bundling of orders or jobs based on a set of user-defined constraints. The API employs a clustering technique for selecting geo-locations within each cluster in a manner that minimizes the total distance or duration required to service each cluster from a predetermined central location. In situations where a central location is not specified, the API is equipped with an automatic algorithm that identifies an appropriate central location based on the constraints provided in the input problem. This API enables businesses to streamline their logistics operations and optimize their supply chain management processes.

## Clustering POST Method

Clustering API uses a POST method to accept an input payload with rules for bundling the jobs together along with their properties and locations. The result is a unique task ID that can be used in the _Clustering GET Method_ to retrieve the clustering result.

POST

https://api.nextbillion.io/clustering?key={your_api_key}

### Request Parameter

| Name  | Required | Format and Usage                                                                   | Description                                                                         |
| ----- | -------- | ---------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| `key` | Yes      | Type: `string`<br>Format: 32 character alphanumeric string<br>Example: key=API_KEY | A key is a unique identifier that is required to authenticate a request to the API. |

### Request Body

| Field                                         | Type            | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| --------------------------------------------- | --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `description`                                 | string          | Set a custom `description` for the clustering problem.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `options`                                     | object          | An object to configure the `routing` options, cost `objective` and `constraint` parameters enabling users to emulate their clustering requirements.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `options.routing`                             | object          | An object for users to customize the routing options for their clustering requirements. Users can define the rules like `mode`, `departure_time`, `truck_size`, and `truck_weight` using this object.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| `options.routing.mode`                        | string          | Set the driving mode which would be used to determine the cost of clustering the given jobs/locations. The cost type can be configured using the `travel_cost` parameter under the `routing` object. Please note that setting `mode:air` implies straight line travel between locations.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| `options.routing.option`                      | string          | Use this option to make use of truck dimension parameters like `truck_weight` or `truck size` or switch to time based routing.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `options.routing.departure_time`              | integer         | A UNIX epoch timestamp in seconds format that is used to set the departure time. The API will consider the typical traffic conditions at the given time to calculate the routing cost. If no input is provided, then the traffic conditions at the time of making the request are considered.<br>Please note that this parameter is effective only when the `option=flexible`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `options.routing.truck_size`                  | string          | This defines the dimensions of a truck in centimeters (cm). Describe the parameters in the format `height,width,length`.<br>This parameter is effective only when the `mode=truck` and `option=flexible`. Maximum dimensions are as follows: <br>Height = 1000 cm <br>Width = 1000 cm <br>Length = 5000 cm                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| `options.routing.truck_weight`                | integer         | This parameter defines the weight of the truck including trailers and shipped goods in kilograms. This parameter is effective only when `mode=truck` and `option=flexible`. Maximum allowed weight is 100000 kg (100 tonnes).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| `options.routing.approaches`                  | string          | Specify the side of the road from which to approach a given location while identifying the cost of a cluster. The approach configuration impacts the route to be taken and hence affects the distance / duration cost of the cluster as well. The acceptable values are "curb" and "unrestricted".<br>If provided, the number of input strings in `approaches` must be equal to the number of locations provided. Multiple approach values should be separated by a `;` (semi-colon). However, you can skip a coordinate and show its position in the list using `;` (semi-colon). Please note these values are case-sensitive.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `options.routing.hazmat_type`                 | string          | Specify the type of hazardous material being carried and the service will avoid roads which are not suitable for the type of goods specified. Provide multiple values separated by a pipe `\|` .<br>Please note that this parameter is effective only when `mode=truck` and `option=flexible` .                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `options.routing.avoid`                       | string          | Specify the type of objects/maneuvers that the service should avoid when identifying possible routes in a cluster. Use a pipe `\|` to add multiple objects. If `none` is provided along with other values, an error is returned as a valid route is not feasible. The values are case sensitive.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `options.routing.traffic_timestamp`           | integer         | Specify the general time when the jobs need to be carried out. The time should be expressed as an UNIX timestamp in seconds format. The service will take into account the general traffic conditions at the given time to determine the possible clusters and their costs.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `options.objective`                           | object          | This enables users to customize the cost objective for their clustering requirements.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| `options.objective.travel_cost`               | string          | This is used for specifying the type of cost associated with travel. The `travel_cost` parameter provides the API response with the unit which was used to estimate the cost, depending on the value provided.<br>- If the value is set to `distance`, the API will minimize the total distance travelled (in meters) while moving from `job` locations to the cluster center. <br>- If the value is set to `duration`, the API will minimize the total time taken (in seconds) to travel from `job` locations to the cluster center.<br>- If the value is set to `air_distance`, the API will minimize the total straight line distance (in meters) from `job` locations to the cluster center.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `options.constraint`                          | object          | An object to configure the cluster constraints. Please note that when the service is tasked with creating clusters automatically (i.e. when `clusters` attribute is not used), it will not create clusters containing less than 2 jobs. If needed, please use the `min_quantity` property of `clusters` attribute to override this constraint.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `options.constraint.hard_quantity_constraint` | boolean         | By default, the service will always assign all the jobs. When `hard_quantity_constraint` is `true`, it will strictly adhere to the `min_quantity` and `max_quantity` constraints configured in the `clusters` object. Please note that:<br>- when the sum of `quantity` of all `jobs` is less than the sum of `min_quantity` of all `clusters`, an error message is returned as no feasible solution is possible.<br>- `jobs` will not be added to a cluster if its `quantity` causes the total quantity assigned to that cluster to exceed the `max_quantity`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `options.constraint.max_cluster_radius`       | number          | A positive number denoting the maximum travelling cost that can be incurred when travelling from cluster’s center to any of its jobs . The travelling cost is determined using the metric specified in `travel_cost` parameter of `objective` property.<br>_ If the `travel_cost` is `distance` then, the `max_cluster_radius` is the maximum distance, in meters, allowed while travelling from the cluster’s center to any of its jobs.<br>_ If the `travel_cost` is `duration` then, the `max_cluster_radius` is the maximum duration, in seconds, allowed while travelling from the cluster’s center to any of its jobs.<br>\* If the `travel_cost` is `air_distance` then, the `max_cluster_radius` is the maximum straight line distance, in meters, allowed while travelling from the cluster’s center to any of its jobs.<br>Please note that `max_cluster_radius` is mandatory when the `clusters` attribute is not provided. It is ineffective when `clusters` attribute is provided.<br>This property is useful when users do not want to specify or are not sure of the properties of clusters to be created. In such cases, they can skip mentioning `clusters` object in the input and the service will create the required clusters automatically as per the given constraints. |
| `options.constraint.max_cluster_quantity`     | number          | Specify the maximum `quantity` (configured for each of the `jobs`) that can be assigned to a cluster. This is effective only when the `clusters` attribute is not provided.<br>Please note that when `hard_quantity_constraint` is true, jobs causing violation of `max_cluster_quantity` will remain unassigned.<br>This property is useful when users do not want to specify or are not sure of the properties of clusters to be created. In such cases, they can skip mentioning `clusters` object in the input and the service will create the required clusters automatically as per the given constraints.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `clusters`                                    | array of object | -                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `clusters[].id`                               | integer         | A non-zero, positive integer denoting the unique ID of the `cluster`. An error occurs if the same IDs for different clusters are provided. The `id` field is mandatory when using the `clusters` attribute.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `clusters[].max_quantity`                     | integer         | A positive integer to decide the maximum `quantity` that can be assigned to the `cluster`. Some `jobs` would remain unassigned if the sum of quantities of all the `jobs` exceeds the sum of `max_quantity` of all clusters.<br>If not specified, we would assume it to be highest possible integer value i.e. 2147483647 is assumed to be the default `max_quantity`.<br>Please note this is a soft constraint, unless `hard_quantity_constraint` property of the `constraint` attribute is `true`, in which case the API will strictly adhere to this constraint.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `clusters[].min_quantity`                     | integer         | A positive integer to decide the minimum `quantity` that can be assigned to the `cluster`. If the sum of `min_quantity` of all clusters is greater than the sum of the quantities of all the `jobs`, an error message is returned as no feasible solution is possible. If not specified, a default `min_quantity` of 0 is assumed.<br>Please note this is a soft constraint, unless `hard_quantity_constraint` property of the `constraint` attribute is `true`, in which case, the API will strictly adhere to this constraint.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `clusters[].center_location_index`            | integer         | A positive integer denoting the location index of the cluster’s center. If not specified, it leaves the algorithm to determine the cluster's center from the output. If the location index exceeds the count of input `locations`, the API will report an error.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `clusters[].description`                      | string          | Set a custom description for the `cluster`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `clusters[].max_travel_cost`                  | number          | A positive integer specifying the maximum travel cost that can be incurred when travelling to a `job` location in the cluster from its center. The unit of this parameter is determined by the input of `travel_cost` parameter.<br>- If `travel_cost` is set to `duration` then `max_travel_cost` is considered as maximum duration (in seconds) that is allowed to travel from the center of cluster to a `job` location.<br>- If `travel_cost` is set to `distance` then `max_travel_cost` is considered as maximum distance (in meters) that is allowed to travel from the center of cluster to a `job` location.<br>Please note that whenever `max_travel_cost` is specified for a cluster, then `min_quantity` for the cluster will always be considered as 0. Also, `max_travel_cost` is effective only when `hard_quantity_constraint` is false, otherwise an error is thrown.                                                                                                                                                                                                                                                                                                                                                                                                         |
| `jobs`                                        | array of object | -                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `jobs[].id`                                   | string          | Provide an unique ID for the job. Please note `id` is mandatory when using the `jobs` object. The IDs are case-sensitive.<br>**Note:** We have modified the data type of this field. However, the latest change is backward compatible and an integer type job ID is also valid.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `jobs[].location_index`                       | integer         | A positive integer denoting the location index of the `job`. If the location index exceeds the count of input locations, the API will report an error.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `jobs[].quantity`                             | number          | The quantity associated with each `job`. It is typically a measure of workload or potential sales.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| `jobs[].description`                          | string          | Set a custom description for the `job`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| `locations`                                   | array of string | An array of location coordinates in \[latitude,longitude\] format indicating all the geographical locations involved in the clustering problem.<br>A maximum of 1000 locations can be added to this object. However, when using `options.objective.travel_cost:air_distance`:<br>_ Up to 4,000 locations are supported<br>_ Up to 20,000 locations are supported if  `max_cluster_radius` is provided.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |

### Response Schema

| Field     | Type            | Description                                                                                                                                                                                                                                                                                          |
| --------- | --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`      | string          | It represents a unique ID of the `cluster` created. Use this `id` in the GET request to retrieve the clustering result.                                                                                                                                                                              |
| `msg`     | string          | Displays the error message in case of a failure while processing the request. If the request is successful, this field is not present in the response.                                                                                                                                               |
| `status`  | string          | It indicates the overall status or result of the API request. It provides an indication of whether the operation was successful or did it encounter any errors.                                                                                                                                      |
| `warning` | array of string | These warning messages serve as a precautionary measure for users, providing them with guidance on proper usage and potential pitfalls to avoid. It helps ensure that the API is utilized correctly and that users are aware of any constraints or requirements associated with specific parameters. |

### Sample Request

```bash
curl -X 'POST' \
    'https://api.nextbillion.io/clustering?key=<your_api_Key>' \
    -H 'accept: application/json' \
    -H 'Content-Type: application/json' \
    -d
    '{
    "description": "LA Test Clusters",
    "options": {
    "routing": {
        "mode": "truck",
    "truck_size": "500,200,300",
    "truck_weight": "5000"


    },
    "objective": {
        "travel_cost": "duration"
    }
    },
    "jobs": [
    {
        "id": 0,
        "quantity": 1,
        "location_index": 0,
        "description": "O-360437"
    },
    {
        "id": 1,
        "quantity": 1,
        "location_index": 1,
        "description": "O-140377"
    },
    {
        "id": 2,
        "quantity": 1,
        "location_index": 2,
        "description": "O-26976"
    },
    {
        "id": 3,
        "quantity": 3,
        "location_index": 3,
        "description": "O-297946"
    },
    {
        "id": 4,
        "quantity": 2,
        "location_index": 4,
        "description": "O-175367"
    },
    {
        "id": 5,
        "quantity": 3,
        "location_index": 5,
        "description": "O-250232"
    },
    {
        "id": 6,
        "quantity": 2,
        "location_index": 6,
        "description": "O-260537"
    },
    {
        "id": 7,
        "quantity": 3,
        "location_index": 7,
        "description": "O-205433"
    },
    {
        "id": 8,
        "quantity": 1,
        "location_index": 8,
        "description": "O-269948"
    },
    {
        "id": 9,
        "quantity": 1,
        "location_index": 9,
        "description": "O-6372"
    },
    {
        "id": 10,
        "quantity": 3,
        "location_index": 10,
        "description": "O-162188"
    },
    {
        "id": 11,
        "quantity": 1,
        "location_index": 11,
        "description": "O-88667"
    },
    {
        "id": 12,
        "quantity": 3,
        "location_index": 12,
        "description": "O-233477"
    },
    {
        "id": 13,
        "quantity": 3,
        "location_index": 13,
        "description": "O-230919"
    },
    {
        "id": 14,
        "quantity": 1,
        "location_index": 14,
        "description": "O-157783"
    },
    {
        "id": 15,
        "quantity": 2,
        "location_index": 15,
        "description": "O-40161"
    },
    {
        "id": 16,
        "quantity": 3,
        "location_index": 16,
        "description": "O-220592"
    },
    {
        "id": 17,
        "quantity": 2,
        "location_index": 17,
        "description": "O-66161"
    },
    {
        "id": 18,
        "quantity": 1,
        "location_index": 18,
        "description": "O-197718"
    },
    {
        "id": 19,
        "quantity": 2,
        "location_index": 19,
        "description": "O-324341"
    }

    ],
    "clusters": [
    {
        "id": 0,
        "max_quantity": 100
    },
    {
        "id": 1,
        "min_quantity": 20,
        "max_quantity": 100
    },
    {
        "id": 2,
        "min_quantity": 20,
        "max_quantity": 100
    },
    {
        "id": 3,
        "min_quantity": 20,
        "max_quantity": 100
    }
    ],
    "locations": [
    "34.0522,-118.2437",
    "34.0516,-118.2591",
    "34.0639,-118.3587",
    "34.0749,-118.2706",
    "34.0639,-118.2910",
    "34.0736,-118.2404",
    "34.0639,-118.2831",
    "34.0501,-118.2376",
    "34.0325,-118.2738",
    "34.0394,-118.2661",
    "34.0467,-118.2641",
    "34.0522,-118.2649",
    "34.0639,-118.2405",
    "34.0524,-118.3442",
    "34.0609,-118.3182",
    "34.0446,-118.2689",
    "34.0627,-118.2339",
    "34.0639,-118.3563",
    "34.0570,-118.2443",
    "34.0806,-118.3863"
    ]
    }'
```

### Sample Response

```json
{
  "id": "9a1408f62b3822c756f15bac0a17a720",
  "msg": "Clustering job created",
  "status": "Ok",
  "warning": [
    "truck_size only work with option=flexible and mode=truck",
    "truck_weight only work with option=flexible and mode=truck"
  ]
}
```

## Clustering GET Method

The GET method retrieves the result of a clustering task submitted previously using the Clustering POST method. The API returns a response object containing the result of the clustering task, including the optimal clusters and their respective jobs, as well as other metadata related to the task.

GET

https://api.nextbillion.io/clustering/result?id={id}&key={your_api_key}

### Request Parameter

| Name  | Required | Format and Usage                                                                   | Description                                                                         |
| ----- | -------- | ---------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| `id`  | Yes      | Type: `string`<br>Example: `id=9a1408f62b3822c756f15bac0a17a720`                   | Unique task ID generated when the clustering POST request was submitted.            |
| `key` | Yes      | Type: `string`<br>Format: 32 character alphanumeric string<br>Example: key=API_KEY | A key is a unique identifier that is required to authenticate a request to the API. |

### Response Schema

| Field                                     | Type             | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| ----------------------------------------- | ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`                                      | string           | Unique task ID generated when the clustering POST request was submitted.                                                                                                                                                                                                                                                                                                                                                                                                                       |
| `status`                                  | string           | A string indicating the state of the response. Can have one of "Processing", "Ok" or "Failed" values. An `Ok` value indicates the clustering result is generated successfully. `Processing` indicates that the clustering request is still being processed. A value of `Failed` means there was an error when processing the clustering request. Indicative error messages are returned for different errors. See the [API Errors Codes](#api-error-codes) section below for more information. |
| `description`                             | string           | Description of the clustering problem. This returns the same value set for `description` in the input request.                                                                                                                                                                                                                                                                                                                                                                                 |
| `message`                                 | string           | Displays the error message in case of a `Failed` request. If the request is successful, this field is not present in the response.                                                                                                                                                                                                                                                                                                                                                             |
| `result`                                  | object           | An object containing the clustering result information. It is returned only when `status` is `Ok`.                                                                                                                                                                                                                                                                                                                                                                                             |
| `result.clusters`                         | array of object  | An array of objects containing the clusters created to bundle the jobs as per the constraints specified in the input request. Each object represents one `cluster`.                                                                                                                                                                                                                                                                                                                            |
| `result.clusters[].id`                    | integer          | The `cluster` ID. This is the same ID that was set in the input `cluster` object.                                                                                                                                                                                                                                                                                                                                                                                                              |
| `result.clusters[].quantity`              | integer          | The total quantity allocated to the `cluster`. It is equal to the sum of the `quantity` associated to `jobs` that are assigned to the cluster.                                                                                                                                                                                                                                                                                                                                                 |
| `result.clusters[].job_ids`               | array of integer | An array of integers denoting the IDs of the `jobs` assigned to the `cluster`.                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `result.clusters[].center_location_index` | integer          | The index of the `center` location for the cluster. Will be `null` if a central location for the cluster was not feasible or if no cluster could be created with given input parameters.                                                                                                                                                                                                                                                                                                       |
| `result.clusters[].cost`                  | number           | It is the sum of total traveling cost from each location of this cluster to the `center` of the `cluster`. The value denotes the cost in seconds if the `travel_cost` was `duration` and it is denoted in meters if the `travel_cost` was set to `distance`.                                                                                                                                                                                                                                   |
| `result.clusters[].geometry`              | string           | Encoded polyline geometry of the cluster convex hull i.e. the cluster boundary.                                                                                                                                                                                                                                                                                                                                                                                                                |
| `result.summary`                          | object           | An object to describe the summarized result of the clustering request. This object can be useful to quickly get an overview of the clustering result.                                                                                                                                                                                                                                                                                                                                          |
| `result.summary.cost`                     | number           | The sum of the `cost` associated with all `cluster`created. The value denotes the cost in seconds if the `travel_cost` was `duration` and it is denoted in meters if the `travel_cost` was set to `distance`.                                                                                                                                                                                                                                                                                  |
| `result.summary.unassigned_quantity`      | integer          | The sum of the `quantity` of all the unassigned jobs.                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| `result.summary.unassigned_jobs`          | integer          | The number of unassigned jobs.                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `result.unassigned`                       | array of object  | An array of objects with the details of the unassigned jobs. Each object represents one job.<br>Please note this object will be empty if `hard_quantity_constraint` was `false` in the input request.                                                                                                                                                                                                                                                                                          |
| `result.unassigned[].id`                  | integer          | The `job` ID. This is the same ID that was set in the input `jobs` object.                                                                                                                                                                                                                                                                                                                                                                                                                     |
| `result.unassigned[].quantity`            | integer          | The quantity of the unassigned `job`.                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| `result.unassigned[].location`            | string           | Location coordinates of the unassigned `job` in `latitude,longitude` format.                                                                                                                                                                                                                                                                                                                                                                                                                   |

### Sample Request

```bash
curl --location --request GET 'https://api.nextbillion.io/clustering/result?id=9a1408f62b3822c756f15bac0a17a720&key=<your_api_key>'
```

### Sample Response

```json
{
  "id": "9a1408f62b3822c756f15bac0a17a720",
  "status": "ok",
  "description": "LA Test Clusters",
  "result": {
    "clusters": [
      {
        "id": 0,
        "quantity": 0.0,
        "cost": 0.0,
        "geometry": "",
        "job_ids": [],
        "center_location_index": null
      },
      {
        "id": 1,
        "quantity": 17.0,
        "cost": 1812.0,
        "geometry": "cg~nEfvzpUzlCcgDbLce@wmAcVccArg@cGv{D",
        "job_ids": [0, 3, 5, 7, 12, 16, 18],
        "center_location_index": 18
      },
      {
        "id": 2,
        "quantity": 13.0,
        "cost": 2126.0,
        "geometry": "kb|nEvu~pUfcEojBcj@co@gkAwj@{kA~tC?jp@",
        "job_ids": [1, 4, 6, 8, 9, 10, 11, 15],
        "center_location_index": 15
      },
      {
        "id": 3,
        "quantity": 9.0,
        "cost": 1911.0,
        "geometry": "wj_oEjiqqUfoDcfGct@oaDczBrhL",
        "job_ids": [2, 13, 14, 17, 19],
        "center_location_index": 17
      }
    ],
    "summary": {
      "cost": 5849.0,
      "unassigned_jobs": 0,
      "unassigned_quantity": 0
    },
    "unassigned": []
  }
}
```

## API Query Limits

- The maximum number of location coordinates that can be added to the `location` object is 1000. However, when `options.objective.travel_cost: air_distance`:
  - Up to 4,000 locations are supported.
  - Up to 20,000 locations are supported if `max_cluster_radius` is provided.

- In `routing` and `job` objects:
  - The values provided for `id` fields should be non-zero positive integers.
  - The values provided for parameters like `quantity`, `max_quantity`, `min_quantity`, `location_index`, and `center_location_index` should be a non-negative integer.

- Maximum dimensions allowed for `truck_size` are 5000 cm for length, 1000 cm for width, 1000 cm for height.
- Maximum weight allowed for `truck_weight` (including the trailer and shipped goods) is 100,000 kg.
- When using the service to create clusters automatically based on `max_cluster_radius`, the service will not create clusters containing less than 2 jobs.
- NextBillion.ai allows a maximum rate limit of 6000 queries per minute or 100 queries/second for continuous requests.
  _Note_: We can increase the quota if needed, on request. Contact [support@nextbillion.ai](mailto:support@nextbillion.ai) for more details.

## API Error Codes

| Response Code | Description                                                      | Additional Notes                                                                                                                                                           |
| ------------- | ---------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 200           | Normal success case.                                             | Normal success case.                                                                                                                                                       |
| 400           | Input validation failed.                                         | There is a missing or an invalid parameter or a parameter with an invalid value type is added to the request.                                                              |
| 401           | APIKEY not supplied or invalid.                                  | This error occurs when the wrong API key is passed in the request or the key is missing altogether                                                                         |
| 403           | APIKEY is valid but does not have access to requested resources. | You might be querying for a geographical region which is not valid for your account, or requesting a service which is not enabled for you.                                 |
| 404           | Requested host/path not found.                                   | This error occurs when a malformed hostname is used.                                                                                                                       |
| 422           | Could not process the request.                                   | The clustering request could not be completed successfully for the given set of locations or parameter configuration. Please check the API error message for more details. |
| 429           | Too many requests.                                               | QPM or API request count quota reached                                                                                                                                     |
| 500           | Internal Service error.                                          | There was an internal issue with NextBillion.ai services. You can reach out to [support@nextbillion.ai](mailto:support@nextbillion.ai) for an explanation.                 |

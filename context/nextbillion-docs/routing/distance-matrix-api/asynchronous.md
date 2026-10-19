# Asynchronous Distance Matrix API

NextBillion.ai’s Asynchronous Distance Matrix API computes distances and ETAs between a large set of origins and destinations — could be for one-to-many or many-to-many scenarios. The API call returns the ETAs and distances for each origin and destination pair.

For example, if a set has Origins {A,B} and Destinations {C,D,E} we can get the following matrix of results with distance (meters) and time (seconds) for each.

| #   | C      | D      | E      |
| --- | ------ | ------ | ------ |
| A   | A -> C | A -> D | A -> E |
| B   | B -> C | B -> D | B -> E |

As the name suggests, Asynchronous Distance Matrix API returns the result asynchronously. In the first step, users submit an HTTPS POST request containing the origin and destination coordinates. On successfully submitting the request the service would return a unique task ID. In the next step, the users can use this task ID to retrieve the result via an HTTPS GET request.

The Asynchronous Distance Matrix API has 2 versions - Fast and Flexible. We will be talking about both these services below.

## Asynchronous Distance Matrix Fast

POST

https://api.nextbillion.io/mdm/create?key={your_api_key}

The Fast version of Asynchronous Distance Matrix returns the ETAs and distances between all combinations of provided origin and destination pairs for the given driving mode. To utilize the service users can make a POST request with the required fields of `key` and `origins`. Additionally, users can customize their request by including other optional parameters as listed in the table below.

### Request Parameters

| Name  | Required | Format and Usage                                                                     | Description                                                                         |
| ----- | -------- | ------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------- |
| `key` | Yes      | Type: `string`<br>Format: 32 character alphanumeric string<br>Example: `key=API_KEY` | A key is a unique identifier that is required to authenticate a request to the API. |

### POST Request Body

| Field                   | Type   | Description                                                                                                                                                                                                                                                                                                                                                                                                                           |
| ----------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `origins`               | string | `origins` are the starting point of your route. Ensure that origins are routable land locations. Multiple origins should be separated by a pipe symbol (\|). **Format:** latitude_1,longitude_1\|latitude_2,longitude_2\|…                                                                                                                                                                                                            |
| `destinations`          | string | `destinations` are the ending coordinates of your route. Ensure that destinations are routable land locations. Multiple destinations should be separated by a pipe symbol (\|). In case `destinations` are not provided or if it is left empty, then the input value of `origins` will be copied to `destinations` to create the OD matrix pairs. **Format:** latitude_1,longitude_1\|latitude_2,longitude_2\|…                       |
| `mode`                  | string | Set which driving mode the service should use to determine a route. For example, if you use `car`, the API will return a route that a car can take. Using `truck` will return a route a truck can use, taking into account appropriate truck routing restrictions.                                                                                                                                                                    |
| `avoid`                 | string | Setting this will ensure the route avoids ferries, tolls, highways or nothing. Multiple values should be separated by a pipe (\|). If `none` is provided along with other values, an error is returned as a valid route is not feasible. Please note that when this parameter is not provided in the input, `ferry` routes are set to be avoided by default. When this parameter is provided, only the mentioned objects are avoided. |
| `origins_approach`      | string | Specify the side of the road from which to approach `origins` points. Please note that the given approach will be applied to all the points provided as `origins`.                                                                                                                                                                                                                                                                    |
| `destinations_approach` | string | Specify the side of the road from which to approach `destinations` points. Please note that the given approach will be applied to all the `destinations`.                                                                                                                                                                                                                                                                             |

### Response Schema

| Field     | Type            | Description                                                                                                                                                                                                                                     |
| --------- | --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `task_id` | string          | A unique ID which can be used in the Asynchronous Distance Matrix GET method to retrieve the final result.                                                                                                                                      |
| `code`    | string          | A string indicating the state of the response. On successful responses, the value will be `Ok`. Indicative error messages/codes are returned in case of errors. See the [API Error Codes](#api-error-codes) section below for more information. |
| `message` | string          | Returns the error message in case a request fails. This field will not be present in the response, if a request is successfully submitted.                                                                                                      |
| `warning` | array of string | Display the warnings, if any, for the given input parameters and values. In case there are no warnings then this field would not be present in the response.                                                                                    |

## Asynchronous Distance Matrix Flexible

POST

https://api.nextbillion.io/mdm/create?key={your_api_key}&option=flexible

The Flexible version of Asynchronous Distance Matrix allows users to make use of a few additional parameters like - truck specific constraints, add a departure time for the service to utilize the typical traffic conditions at the time, and add a preference for the `fastest` or the `shortest` route type. Users can send a HTTP POST request containing the mandatory parameters of `key`, `origins` and `option` along with other optional attributes to create a distance matrix task.

It is worth highlighting that to use the flexible version of the API users need to set the `option` parameter to `flexible`. Also, the Flexible-only attributes are not available in the Fast version and will be ineffective, if used.

### Request Parameters

| Name     | Required | Format and Usage                                                                     | Description                                                                                                                                      |
| -------- | -------- | ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `key`    | Yes      | Type: `string`<br>Format: 32 character alphanumeric string<br>Example: `key=API_KEY` | A key is a unique identifier that is required to authenticate a request to the API.                                                              |
| `option` | Yes      | Type: `string`<br>Allowed values: `flexible`<br>Example: `option=flexible`           | Use this option to switch to truck-specific routing or time based routing or if you want to choose between the fastest and shortest route types. |

### POST Request Body

| Field                   | Type    | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| ----------------------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `origins`               | string  | `origins` are the starting point of your route. Ensure that origins are routable land locations. Multiple origins should be separated by a pipe symbol (\|). **Format:** latitude_1,longitude_1\|latitude_2,longitude_2\|…                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `destinations`          | string  | `destinations` are the ending coordinates of your route. Ensure that destinations are routable land locations. Multiple destinations should be separated by a pipe symbol (\|). In case `destinations` are not provided or if it is left empty, then the input value of `origins` will be copied to `destinations` to create the OD matrix pairs. **Format:** latitude_1,longitude_1\|latitude_2,longitude_2\|…                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `mode`                  | string  | Set which driving mode the service should use to determine a route. For example, if you use `car`, the API will return a route that a car can take. Using `truck` will return a route a truck can use, taking into account appropriate truck routing restrictions.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `avoid`                 | string  | Setting this will ensure the route avoids the object(s) specified as input. Multiple values should be separated by a pipe (\|). If `none` is provided along with other values, an error is returned as a valid route is not feasible. _ **Note:** _ When this parameter is not provided in the input, ferries are set to be avoided by default. When `avoid` input is provided, only the mentioned objects are avoided. _ When using `avoid=bbox` users also need to specify the boundaries of the bounding box to be avoid. Multiple bounding boxes can be specified simultaneously. Please note that bounding box is a hard filter and if it blocks all possible routes between given locations, a 4xx error is returned. _ **Format:** bbox: min_latitude,min_longtitude,max_latitude,max_longitude. _ **Example:** avoid=bbox: 34.0635,-118.2547, 34.0679,-118.2478 \| bbox: 34.0521,-118.2342, 34.0478,-118.2437 _ When using `avoid=sharp_turn`, default range of permissible turn angles is \[120,240\]. |
| `departure_time`        | integer | This is a number in UNIX epoch timestamp in seconds format that can be used to provide the departure time. The response will return the `distance` and `duration` of the route based on typical traffic for at the given start time.If no input is provided for this parameter then the traffic conditions at the time of making the request are considered.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `route_type`            | string  | Set the route type that needs to be returned. Please note that `route_type` is effective only when `option=flexible`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `truck_size`            | string  | This defines the dimensions of a truck in centimeters (cm) in the format of "height,width,length". This parameter is effective only when `mode=truck` and `option=flexible`. Maximum dimensions are as follows: Height = 1000 cm Width = 5000 cm Length = 5000 cm                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `truck_weight`          | integer | This parameter defines the weight of the truck including trailers and shipped goods in kilograms (kg). This parameter is effective only when `mode=truck` and `option=flexible`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `origins_approach`      | string  | Specify the side of the road from which to approach `origins` points. Please note that the given approach will be applied to all the points provided as `origins`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `destinations_approach` | string  | Specify the side of the road from which to approach `destinations` points. Please note that the given approach will be applied to all the `destinations`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| `hazmat_type`           | string  | Specify the type of hazardous material being carried and the service will avoid roads which are not suitable for the type of goods specified. Multiple values can be separated using a pipe operator `\|` . Please note that this parameter is effective only when `mode=truck`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `cross_border`          | boolean | Specify if crossing an international border is expected for operations near border areas. When set to false, the API will prohibit routes going back & forth between countries. Consequently, routes within the same country will be preferred if they are feasible for the given set of `destination` or `waypoints` . When set to true, the routes will be allowed to go back & forth between countries as needed. This feature is available in North America region only. Please get in touch with [support@nextbillion.ai](mailto:support@nextbillion.ai) to enquire/enable other areas.                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `truck_axle_load`       | number  | Specify the total load per axle (including the weight of trailers and shipped goods) of the truck, in tonnes. When used, the service will return routes which are legally allowed to carry the load specified per axle. Please note this parameter is effective only when `mode=truck`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |

### Response Schema

| Field     | Type            | Description                                                                                                                                                                                                                                     |
| --------- | --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `task_id` | string          | A unique ID which can be used in the Asynchronous Distance Matrix GET method to retrieve the final result.                                                                                                                                      |
| `code`    | string          | A string indicating the state of the response. On successful responses, the value will be `Ok`. Indicative error messages/codes are returned in case of errors. See the [API Error Codes](#api-error-codes) section below for more information. |
| `message` | string          | Returns the error message in case a request fails. This field will not be present in the response, if a request is successfully submitted.                                                                                                      |
| `warning` | array of string | Display the warnings, if any, for the given input parameters and values. In case there are no warnings then this field would not be present in the response.                                                                                    |

## Sample POST Request

Let’s take a look at an example POST request, where we:

- Add just one pair of `origin` and `destination` for simplicity.
- Set `mode=truck` to get the ETA and distance of a route pliable by a truck
- Define the dimensions and weight of the truck.
- Add `option=flexible` to ensure that truck parameters are effective

```bash
curl --location 'https://api.nextbillion.io/mdm/create?key=<your_api_key>&option=flexible' \
--header 'Content-Type: application/json' \
--data '{
"origins":"13.03394916,77.58855989",
"destinations":"13.03935192,77.58939313",
"mode":"truck",
"truck_size":"100,220,213",
"truck_weight":5000
}'
```

## Sample POST Response

Here is the response that we receive on submitting the POST request. The ID received in the response will be used in subsequent sample examples for HTTPS GET method.

```json
{
  "code": "Ok",
  "task_id": "aW5kaWEtdHJ1Y2stZmxleGlibGUtMjYzZTRiZjgtNjFjOS0zNDZmLThkOTQtMWM2YTZhNWFmYjQ0"
}
```

## Asynchronous Distance Matrix GET Method

GET

https://api.nextbillion.io/mdm/status?key={your_api_key}&id={your_task_id}

Use this method to retrieve the Distance Matrix solution link for the tasks created using either of the Asynchronous Distance Matrix POST methods.

### Request Parameters

| Name  | Required | Format and Usage                                                                     | Description                                                                                                        |
| ----- | -------- | ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------ |
| `id`  | Yes      | Type: `string`                                                                       | Provide the unique ID that was returned on successful submission of the Asynchronous Distance Matrix POST request. |
| `key` | Yes      | Type: `string`<br>Format: 32 character alphanumeric string<br>Example: `key=API_KEY` | A key is a unique identifier that is required to authenticate a request to the API.                                |

### Response Schema

| Field         | Type   | Description                                                                                                                                                                              |
| ------------- | ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `code`        | string | A code representing the status of the request.                                                                                                                                           |
| `status`      | string | Returns the status detail of the result. Indicative error messages/codes are returned in case of errors. See the [API Error Codes](#api-error-codes) section below for more information. |
| `result_link` | string | Returns the link for the result file (csv format) once the task is completed successfully.                                                                                               |

## Sample GET Request

Let’s retrieve the result for the request submitted in the POST request example. We add the API Key and the id received from the response of the POST method.

```bash
curl --location 'https://api.nextbillion.io/mdm/status?key=<your_api_key>&id=aW5kaWEtdHJ1Y2stZmxleGlibGUtMjYzZTRiZjgtNjFjOS0zNDZmLThkOTQtMWM2YTZhNWFmYjQ0'
```

## Sample GET Response

Once the service is done with processing the request, following response is returned:

```json
{
  "code": "Ok",
  "status": "task fully succeeded",
  "result_link": "https://oregon-cdn.nextbillion.io/mdm/api-auto-oregon/aW5kaWEtdHJ1Y2stZmxleGlibGUtMjYzZTRiZjgtNjFjOS0zNDZmLThkOTQtMWM2YTZhNWFmYjQ0/result.csv"
}
```

## Read the Distance Matrix Results

Users can then copy the result link from the GET response and open it in a browser. The CSV file that the browser accesses contains the result of Asynchronous Distance Matrix request and the information is arranged as per the following column nomenclature and order

```text
origin index, destination index, origin location, destination location, durations, distances
```

Following is a sample result for reference:

```text
0, 0, 35.04651100,-106.64643000, 35.04651100,-106.64643000, 0, 0
0, 1, 35.04651100,-106.64643000, 40.76000000,-73.97000000, 131583, 3218636
0, 2, 35.04651100,-106.64643000, 41.13955180,-73.71247900, 133768, 3306569
0, 3, 35.04651100,-106.64643000, 41.79,-72.74, 137815, 3414733
1, 0, 40.76000000,-73.97000000, 35.04651100,-106.64643000, 130598, 3218029
1, 1, 40.76000000,-73.97000000, 40.76000000,-73.97000000, 0, 0
1, 2, 40.76000000,-73.97000000, 41.13955180,-73.71247900, 3700, 63364
1, 3, 40.76000000,-73.97000000, 41.79,-72.74, 8756, 185748
```

## API Query Limits

1. For both Asynchronous Distance Matrix Fast & Flexible methods, NextBillion.ai allows a default limit of up to 4000 x 4000 Origin and Destination set
2. Maximum dimensions allowed for `truck_size` are 5000 cm for length, 5000 cm for width, 1000 cm for height.
3. Maximum weight allowed for `truck_weight` (including the trailer and shipped goods) is 100,000 kg
4. NextBillion.ai allows a maximum rate limit of 10 queries per second for the POST method and 50 queries per second for the GET method for continuous requests.
   _Note_: We can increase the quota if needed, on request. Contact [support@nextbillion.ai](mailto:support@nextbillion.ai) for more details.

## API Error Codes

| Response Code | Description                                                      | Additional Notes                                                                                                                                                                                                         |
| ------------- | ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 200           | Normal success case.                                             | Normal success case.                                                                                                                                                                                                     |
| 400           | Input validation failed.                                         | There is a missing or an invalid parameter or a parameter with an invalid value type is added to the request.                                                                                                            |
| 401           | APIKEY not supplied or invalid.                                  | This error occurs when the wrong API key is passed in the request or the key is missing altogether                                                                                                                       |
| 403           | APIKEY is valid but does not have access to requested resources. | You might be querying for a geographical region which is not valid for your account, or requesting a service which is not enabled for you.                                                                               |
| 404           | Requested host/path not found.                                   | This error occurs when a malformed hostname is used.                                                                                                                                                                     |
| 413           | Request entity too large                                         | This error is caused when the length of input request URI or the request body is too large. Please modify the request. Reach out to [support@nextbillion.ai](mailto:support@nextbillion.ai) if the issue still persists. |
| 422           | Could not process the request.                                   | Unroutable coordinates provided in the request, please check API response for more details.                                                                                                                              |
| 429           | Too many requests.                                               | QPM limit or distance matrix size quota reached.                                                                                                                                                                         |
| 500           | Internal Service error.                                          | There was an internal issue with NextBillion.ai services. You can reach out to [support@nextbillion.ai](mailto:support@nextbillion.ai) for an explanation.                                                               |

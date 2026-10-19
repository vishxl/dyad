# Navigation API

## Introduction

NextBillion.ai offers a Navigation API that calculates routes between two locations and provides precise turn-by-turn directions for smooth navigation. This API can also serve as an input for your navigation application, enabling interactive route visualization. Alternatively, for a complete turn-by-turn navigation experience, you can directly utilize NextBillion.ai’s [Navigation SDK](https://docs.nextbillion.ai/routing/android-navigation-sdk/introduction).

Navigation API has two versions, both of which can be utilized for different use cases. First is the Flexible version, which offers an advanced feature set - including truck specific features and traffic aware routing - to meet complex as well as customized navigation requirements. The second version is called the Fast, which combines low-latency and efficiency to solve high-volume, standard navigation requirements.

Let’s go through each of these versions one-by-one in the following sections.

## Navigation Flexible API

The Navigation Flexible API is designed for scenarios demanding **precision, customization, and advanced navigation** constraints. It calculates routes using **live and historical traffic data**, and supports comprehensive **truck-specific** parameters (including size, weight, and hazardous cargo). The API also allows for **powerful routing preferences** such as avoiding tolls, sharp turns, or restricted roads.

With its versatility, the Flexible endpoint can optimize for the fastest or shortest path, provide alternative routes, and handle multiple travel modes, from walking and biking to motorbikes, cars, and trucks.

To access the Navigation Flexible API, set the option parameter to "flexible". This endpoint supports both HTTPS GET and POST methods, with identical request URL, parameters, and response schemas for both

GET

https://api.nextbillion.io/navigation?option=flexible&key={your_api_key}

_Use the GET method when the total number of `waypoints` is 50 or less. In case of `waypoints` more than 50, and up to 200, we recommend using the POST method._

### Request Parameters

| Name                  | Required | Format and Usage                                                                                                                                                                                                                                                                                                                                                                                                                           | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| --------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `key`                 | Yes      | Type: `string`<br>Format: 32 character alphanumeric string<br>Example: key=API_KEY                                                                                                                                                                                                                                                                                                                                                         | A key is a unique identifier that is required to authenticate a request to the API.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| `origin`              | No       | Type: `string`<br>Format: `latitude,longitude`<br>Example: `origin=41.349302,2.136480`                                                                                                                                                                                                                                                                                                                                                     | `origin` is the starting point of your route. Ensure that the `origin` is a routable land location. Please note that this parameter is mandatory if the `original_shape` parameter is not given.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `destination`         | No       | Type: `string`<br>Format: `latitude,longitude`<br>Example: `destination=41.349302,2.136480`                                                                                                                                                                                                                                                                                                                                                | `destination` is the ending coordinates of your route. Ensure that the `destination` is a routable land location. Please note that this parameter is mandatory if the `original_shape` parameter is not given.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| `mode`                | No       | Type: `string`<br>Default: `car`<br>Allowed values: `car`, `truck`, `motorcycle`, `bike`, `walk`<br>Example: `mode=car`                                                                                                                                                                                                                                                                                                                    | Set which driving mode the service should use to determine a route. For example, if you use `car`, the API will return a route that a car can take. Using `truck` will return a route a truck can use, taking into account appropriate truck routing restrictions. When using `truck` mode, default dimensions are assumed (height: 214 cm, width: 183 cm, length: 519 cm, weight: 5000 kg) unless overridden by `truck_size` and `truck_weight`.<br>\[**Note:** Only the `car` profile is enabled by default. Please note that other profiles might not be available for all regions. Please contact your [NextBillion.ai](https://nextbillion.ai) account manager, sales representative or reach out at [support@nextbillion.ai](mailto:support@nextbillion.ai) in case you need additional profiles\]                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| `waypoints`           | No       | Type: `string`<br>Format: `latitude_1,longitude_1\|latitude_2,longitude_2\|...`<br>Example: `waypoints=41.349302,2.136480\|41.349303,2.136481`                                                                                                                                                                                                                                                                                             | `waypoints` are coordinates along the route between the `origin` and `destination`. It is a pipe-separated list of coordinate pairs. Please note that all `waypoints` are treated as mandatory route points and the route will arrive at each `waypoints` in the sequence they are provided in the input request.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `approaches`          | No       | Type: `string`<br>Default: `unrestricted`<br>Format: `approaches_1;approaches_2;...`<br>Allowed values: `unrestricted`, `curb`<br>Example: `approaches=unrestricted;curb;;unrestricted`                                                                                                                                                                                                                                                    | A semicolon-separated list indicating the side of the road from which to approach `waypoints` in a requested route. When set to `unrestricted` a route can arrive at the waypoint from either side of the road and when set to `curb` the route will arrive at the waypoint on the driving side of the region. Please note the number of values provided must be one more than the number of `waypoints`. The last value of `approaches` will determine the approach for the `destination`. However, you can skip a coordinate and show its position in the list with the `;` separator.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| `geometry`            | No       | Type: `string`<br>Default: `polyline6`<br>Allowed values: `polyline`, `polyline6`<br>Example: `geometry=polyline`                                                                                                                                                                                                                                                                                                                          | Sets the output format of the route geometry in the response. On providing `polyline` and `polyline6` as input, respective encoded geometry is returned.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| `lang`                | No       | Type: `string`<br>Example: `lang=en`                                                                                                                                                                                                                                                                                                                                                                                                       | Language of the turn-by-turn instructions for route guidance. This parameter accepts two-lettered [ISO 639-1 codes](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) to identify the language for instructions.<br> Currently, Navigation API supports English(en), Spanish(es), French(fr), Catalan (ca), Mandarin(zh), German(de), Dutch(nl) and other languages available in [OSRM translations](https://github.com/Project-OSRM/osrm-text-instructions/tree/master/languages/translations). Please check with your [NextBillion.ai](https://nextbillion.ai) account manager, sales representative or reach out at [support@nextbillion.ai](mailto:support@nextbillion.ai) for additional languages.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `alternatives`        | No       | Type: `boolean`<br>Default: `false`                                                                                                                                                                                                                                                                                                                                                                                                        | When `true` the API will return alternate routes. The default value is `false`. You can set the number of alternate routes to be returned in the `altcount` property.<br>The `alternatives` is effective only when there are no `waypoints` included in the request.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `altcount`            | No       | Type: `integer`<br>Default: `3`<br>Example: `altcount=3`                                                                                                                                                                                                                                                                                                                                                                                   | Sets the number of alternative routes to return. It is effective only when `alternatives` is `true`. Please note that adding alternative route count does not guarantee matching number of routes to be returned if potential alternative routes do not exist.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| `avoid`               | No       | Type: `string`<br>Default: `ferry`<br>Format: `value_1\|value_2\|...`; for `bbox`, use `bbox:min_latitude,min_longitude,max_latitude,max_longitude`<br>Allowed values: `toll`, `highway`, `ferry`, `sharp_turn`, `uturn`, `service_road`, `left_turn`, `right_turn`, `bbox`, `geofence_id`, `tunnel`, `none`<br>Example: `avoid=toll\|highway\|bbox:34.0635,-118.2547,34.0679,-118.2478\|geofence_id:d887f0fa-fd4b-478e-a585-23835a5acd78` | Setting this will ensure the route avoids the object(s) specified as input. Multiple values should be separated by a pipe (\|). If `none` is provided along with other values, an error is returned as a valid route is not feasible.<br>**Note:**<br>_ When this parameter is not provided in the input, ferries are set to be avoided by default. When `avoid` input is provided, only the mentioned objects are avoided.<br>_ When using `avoid=bbox` users also need to specify the boundaries of the bounding box to be avoided. Multiple bounding boxes can be specified simultaneously. The perimeter of a bounding box can not exceed 500 kms. Please note that bounding box is a hard filter and if it blocks all possible routes between given locations, a 4xx error is returned.<br> _ **Format:** bbox: min_latitude,min_longtitude,max_latitude,max_longitude.<br> _ **Example:** avoid=bbox: 34.0635,-118.2547, 34.0679,-118.2478 \| bbox: 34.0478,-118.2437, 34.0521,-118.2342<br>_ When using `avoid=sharp_turn`, default range of permissible turn angles is \[120,240\] in the clockwise direction from the current road. In order to override default range, please use `turn_angle_range` parameter.<br>_ When using `avoid=geofence_id` , only the the geofences created using NextBillion.ai [Geofence API](https://docs.nextbillion.ai/docs/tracking/api/geofence) are valid.<br>\* When using `avoid=tunnel` , the service will respond with a 4xx error if there are no alternative routes available. |
| `option`              | Yes      | Type: `string`<br>Allowed values: `flexible`<br>Example: `option=flexible`                                                                                                                                                                                                                                                                                                                                                                 | Use this option to switch to truck-specific routing or time based routing or if you want to choose between the fastest and shortest route types.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `allow`               | No       | Type: `string`<br>Allowed values: `taxi`<br>Example: `allow=taxi`                                                                                                                                                                                                                                                                                                                                                                          | Use this parameter to let the API use taxi-specific lanes/roads for calculating routes. When not specified, the routes generated will not use any taxi specific lanes. It is effective only when `mode=car`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `departure_time`      | No       | Type: `integer`<br>Example: `departure_time=1563254734`                                                                                                                                                                                                                                                                                                                                                                                    | Use this parameter to set a departure time for your trip using a UNIX timestamp in seconds precision. The response will return a route based on typical traffic conditions at the given time. If no input is provided for this parameter then the traffic conditions at the time of making the request are considered.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| `honor_restrictions`  | No       | Type: `boolean`<br>Default: `false`                                                                                                                                                                                                                                                                                                                                                                                                        | Decide what the API should do if the `origin`, `destination`, or any `waypoints` falls inside a restricted area. When set to "false" (default behavior), the API overrides any restrictions to generate a full route, along with a warning in the response to indicate the same. When set to "true", all routing restrictions are honored and no route is generated for such cases.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| `route_type`          | No       | Type: `string`<br>Default: `fastest`<br>Allowed values: `fastest`, `shortest`<br>Example: `route_type=fastest`                                                                                                                                                                                                                                                                                                                             | Set the route type that needs to be returned.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `truck_size`          | No       | Type: `string`<br>Format: `height,width,length`<br>Example: `truck_size=200,210,600`                                                                                                                                                                                                                                                                                                                                                       | This defines the dimensions of a truck in centimeters (cm). This parameter is effective only when the `mode`=`truck`. Maximum dimensions are as follows:<br> Height = 1000 cm<br> Width = 5000 cm<br> Length = 5000 cm                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| `truck_weight`        | No       | Type: `integer`<br>Example: `truck_weight=11770`                                                                                                                                                                                                                                                                                                                                                                                           | This parameter defines the weight of the truck including trailers and shipped goods in kilograms (kg). This parameter is effective only when `mode`=`truck`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `road_info`           | No       | Type: `string`<br>Allowed values: `max_speed`, `toll_distance`, `toll_cost`, `toll_info`, `truck_route`, `stop_sign`, `traffic_light`<br>Example: `road_info=max_speed`                                                                                                                                                                                                                                                                    | Use this parameter to receive additional information about the road segments returned in the response. Currently, following inputs are supported:<br> 1. `max_speed`: segment-wise maximum speed information of roads in the response.<br> 2. `toll_distance`: returns the total distance travelled on the road segments having tolls.<br> 3. `toll_cost`: returns the range of toll charges, in local currency, that can be incurred for the suggested route.<br> 4. `toll_info`: returns information about toll like location coordinates and toll name. For most tolls, the location coordinates in the response represent the physical location of the toll. However, some regions support distance-based or zone-based tolls, and there are no physical gates or stations on the road. The coordinates returned for for such tolls are just references for locations where charges are levied.<br> 5. `truck_route`: returns all the available values for allowed truck types on each segment used in the suggested route.<br> 6. `stop_sign`: returns the locations of all "STOP" signs along the suggested route.<br> 7. `traffic_light`: returns the locations of all traffic lights along the suggested route.<br><br>Please note that this parameter is effective only when `option=flexible`.                                                                                                                                                                                                                        |
| `original_shape`      | No       | Type: `string`<br>Example: `original_shape=sbp}_Almgp`FnLuToKmKviB{eDlcGhpFvj@qbAwoA_mA`                                                                                                                                                                                                                                                                                                                                                   | Takes a route geometry as input and returns the navigation information for that route. Accepts `polyline` and `polyline6` encoded geometry as input. `original_shape_type` becomes mandatory when `original_shape` is used. If this parameter is provided, the only other parameters which will be considered are `original_shape_type`, `lang`, `geometry`. The rest of the parameters in the input request will be ignored. Please note `overview` verbosity will always be "full" when using this parameter.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `original_shape_type` | No       | Type: `string`<br>Allowed values: `polyline`, `polyline6`<br>Example: `original_shape_type=polyline`                                                                                                                                                                                                                                                                                                                                       | Specify the encoding type of route geometry provided in `original_shape` input. Please note that an error is returned when this parameter is not specified while an input is added to `original_shape` parameter.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `bearings`            | No       | Type: `string`<br>Default: `none`<br>Format: `degree0,range0;degree1,range1;...`<br>Example: `bearings=0,180;0,180`                                                                                                                                                                                                                                                                                                                        | Limits the search to road segments with given bearing, in degrees, towards true north in clockwise direction. Each `bearings` should be in the format of `degree,range`, where the `degree` should be a value between \[0, 360\] and `range` should be a value between \[0, 180\]. Please note that the number of `bearings` should be two more than the number of `waypoints`. This is to account for the bearing of `origin` and `destination`. If a route can approach a `waypoint` or the `destination` from any direction, the bearing for that point can be specified as "0,180".                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `hazmat_type`         | No       | Type: `string`<br>Allowed values: `explosives`, `gas`, `flammable_liquid`, `flammable_gas`, `organic`, `toxic`, `radioactive`, `corrosive`, `other`<br>Example: `hazmat_type=explosives \| corrosive`                                                                                                                                                                                                                                      | Specify the type of hazardous material being carried and the service will avoid roads which are not suitable for the type of goods specified. Multiple values can be separated using a pipe operator `\|`. Please note that this parameter is effective only when `mode=truck`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `cross_border`        | No       | Type: `boolean`<br>Default: `false`                                                                                                                                                                                                                                                                                                                                                                                                        | Specify if crossing an international border is expected for operations near border areas. When set to `false` (default value), the API will prohibit routes crossing the borders. When set to `true`, the service will return routes which cross the borders between countries, if required for the given set `destination` and `waypoints`. In case this feature is not available in your region, please get in touch with [support@nextbillion.ai](mailto:support@nextbillion.ai) to enquire/enable it.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| `truck_axle_load`     | No       | Type: `number`<br>Default: `0`<br>Example: `5.6`                                                                                                                                                                                                                                                                                                                                                                                           | Specify the total load per axle (including the weight of trailers and shipped goods) of the truck, in tonnes. When used, the service will return routes which are legally allowed to carry the load specified per axle. Please note this parameter is effective only when \`mode=truck\`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| `turn_angle_range`    | No       | Type: `integer`                                                                                                                                                                                                                                                                                                                                                                                                                            | Specify the turn angles that can be taken safely by the vehicle. The permissible turn angles are calculated as \[0 + turn_angle_range, 360 - turn_angle_range\]. Please note that this parameter is effective only when `avoid = sharp_turn`. It is worth highlighting here that providing smaller angles might lead to 4xx errors as route engine might not be able find routes satisfying the smaller turn angle criteria for all turns in the route.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `bearings`            | No       | Type: `string`<br>Default: `none`<br>Format: `degree0,range0;degree1,range1;...`<br>Example: `bearings=0,180;0,180`                                                                                                                                                                                                                                                                                                                        | Limits the search to road segments with given bearing, in degrees, towards true north in clockwise direction. Each `bearings` should be in the format of `degree,range`, where the `degree` should be a value between \[0, 360\] and `range` should be a value between \[0, 180\]. Please note that the number of `bearings` should be two more than the number of `waypoints`. This is to account for the bearing of `origin` and `destination`. If a route can approach a `waypoint` or the `destination` from any direction, the bearing for that point can be specified as "0,180".                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `prefer`              | No       | Type: `string`<br>Allowed values: `truck_route`                                                                                                                                                                                                                                                                                                                                                                                            | This configuration prioritizes truck-friendly roads when calculating routes, aiming to maximize their inclusion in the final route. It is effective only when `mode=truck`. Please note that the `truck_type` setting is ineffective without this parameter.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `truck_type`          | No       | Type: `string`<br>Allowed values: `rigid_truck`, `semi_trailer`, `b_double`, `road_train`, `generic_truck`<br>Example: `truck_type = rigid_truck\|semi_trailer`                                                                                                                                                                                                                                                                            | Define the truck type. This information is used for determining permissible roads and generating an appropriate route for the given truck type. It is effective only when `prefer=truck_route` and `mode=truck`. Multiple values can be provided using a pipe separator `\|`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |

### POST Request

The parameters and their properties for the Navigation Flexible POST method are the same as listed in the [Request Parameter](#request-parameters) section. The `key` and `option` parameters are passed as a request parameter and the rest of the parameters should be included in the Request Body. An example of a POST request is added in the [Sample Queries - Navigation Flexible section below](#sample-queries-navigation-flexible).

POST

https://api.nextbillion.io/navigation?option=flexible&key={your_api_key}

### Response Schema

| Field                                                                          | Type             | Description                                                                                                                                                                                                                                                                    |
| ------------------------------------------------------------------------------ | ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `status`                                                                       | string           | A string indicating the state of the response. On normal responses, the value will be `Ok`. Indicative HTTP error codes are returned for different errors. See the [API Errors Codes](#api-error-codes) section below for more information.                                    |
| `msg`                                                                          | string           | Displays the error message in case of a failed request or operation. Please note that this parameter is not returned in the response in case of a successful request.                                                                                                          |
| `warning`                                                                      | array of string  | warning when facing unexpected behaviour                                                                                                                                                                                                                                       |
| `routes`                                                                       | array of object  | An array of objects describing different possible routes from the starting location to the destination. Each object represents one route.                                                                                                                                      |
| `routes[].geometry`                                                            | string           | Encoded geometry of the returned route in the selected format in `geometry`.                                                                                                                                                                                                   |
| `routes[].distance`                                                            | number           | The distance, in meters, of the complete trip.                                                                                                                                                                                                                                 |
| `routes[].duration`                                                            | number           | The duration, in seconds, of the complete trip.                                                                                                                                                                                                                                |
| `routes[].start_location`                                                      | object           | Location coordinates of the point where the route starts.                                                                                                                                                                                                                      |
| `routes[].start_location.latitude`                                             | number           | Latitude of the`start_location`.                                                                                                                                                                                                                                               |
| `routes[].start_location.longitude`                                            | number           | Longitude of the`start_location`.                                                                                                                                                                                                                                              |
| `routes[].end_location`                                                        | object           | Location coordinates of the point where the route ends.                                                                                                                                                                                                                        |
| `routes[].end_location.latitude`                                               | number           | Latitude of the `end_location`.                                                                                                                                                                                                                                                |
| `routes[].end_location.longitude`                                              | number           | Longitude of the `end_location`.                                                                                                                                                                                                                                               |
| `routes[].legs`                                                                | array of object  | An array of objects returning the details about each `leg` of the route. `waypoints` split the route into legs.                                                                                                                                                                |
| `routes[].legs[].distance`                                                     | object           | An object containing leg distance value, in meters.                                                                                                                                                                                                                            |
| `routes[].legs[].distance.value`                                               | integer          | -                                                                                                                                                                                                                                                                              |
| `routes[].legs[].duration`                                                     | object           | An object containing leg duration value, in seocnds.                                                                                                                                                                                                                           |
| `routes[].legs[].duration.value`                                               | integer          | -                                                                                                                                                                                                                                                                              |
| `routes[].legs[].start_location`                                               | object           | Location coordinates of the point where the leg starts.                                                                                                                                                                                                                        |
| `routes[].legs[].start_location.latitude`                                      | number           | Latitude of `start_location` of the `leg`.                                                                                                                                                                                                                                     |
| `routes[].legs[].start_location.longitude`                                     | number           | Longitude of `start_location` of the `leg`.                                                                                                                                                                                                                                    |
| `routes[].legs[].end_location`                                                 | object           | Location coordinates of the point where the leg ends.                                                                                                                                                                                                                          |
| `routes[].legs[].end_location.latitude`                                        | number           | Latitude of `end_location` of the `leg`.                                                                                                                                                                                                                                       |
| `routes[].legs[].end_location.longitude`                                       | number           | Longitude of `end_location` of the `leg`.                                                                                                                                                                                                                                      |
| `routes[].legs[].steps`                                                        | array of object  | An array of step objects containing turn-by-turn guidance for easy navigation.                                                                                                                                                                                                 |
| `routes[].legs[].steps[].geometry`                                             | string           | Encoded geometry of the `step` in the selected format.                                                                                                                                                                                                                         |
| `routes[].legs[].steps[].start_location`                                       | object           | Location coordinates of the point where the `step` starts.                                                                                                                                                                                                                     |
| `routes[].legs[].steps[].start_location.latitude`                              | number           | Latitude of `start_location` of the `step`.                                                                                                                                                                                                                                    |
| `routes[].legs[].steps[].start_location.longitude`                             | number           | Longitude of `start_location` of the `step`.                                                                                                                                                                                                                                   |
| `routes[].legs[].steps[].end_location`                                         | object           | Location coordinates of the point where the `step` ends.                                                                                                                                                                                                                       |
| `routes[].legs[].steps[].end_location.latitude`                                | number           | Latitude of the `end_location` of the `step`.                                                                                                                                                                                                                                  |
| `routes[].legs[].steps[].end_location.longitude`                               | number           | Longitude of the `end_location` of the `step`.                                                                                                                                                                                                                                 |
| `routes[].legs[].steps[].distance`                                             | object           | An object containing step distance value, in meters.                                                                                                                                                                                                                           |
| `routes[].legs[].steps[].distance.value`                                       | integer          | -                                                                                                                                                                                                                                                                              |
| `routes[].legs[].steps[].duration`                                             | object           | An object containing step duration value, in seconds.                                                                                                                                                                                                                          |
| `routes[].legs[].steps[].duration.value`                                       | integer          | -                                                                                                                                                                                                                                                                              |
| `routes[].legs[].steps[].maneuver`                                             | object           | An object with maneuver details for the `step`.                                                                                                                                                                                                                                |
| `routes[].legs[].steps[].maneuver.instruction`                                 | string           | A text instruction describing the maneuver to be performed. It provides guidance on the action to take at the maneuver location, such as "Turn left," "Go straight," "Exit the roundabout," etc.                                                                               |
| `routes[].legs[].steps[].maneuver.voice_instruction`                           | array of object  | An array of voice instruction objects associated with the `maneuver`. Each object provides additional details about the voice instruction, including the distance along the geometry where the instruction applies, the instruction text, and the unit of measurement.         |
| `routes[].legs[].steps[].maneuver.voice_instruction[].distance_along_geometry` | integer          | The distance value at which the `instruction` would be triggered when trip is in-progress.                                                                                                                                                                                     |
| `routes[].legs[].steps[].maneuver.voice_instruction[].instruction`             | string           | The guidance instructions for the upcoming `maneuver`                                                                                                                                                                                                                          |
| `routes[].legs[].steps[].maneuver.voice_instruction[].unit`                    | string           | Unit of the `distance_along_geometry` metric                                                                                                                                                                                                                                   |
| `routes[].legs[].steps[].maneuver.bearing_before`                              | number           | The clockwise angle from true north to the direction of travel immediately before the `maneuver`. Range of values is between 0-359.                                                                                                                                            |
| `routes[].legs[].steps[].maneuver.bearing_after`                               | number           | The clockwise angle from true north to the direction of travel immediately after the `maneuver`. Range of values is between 0-359.                                                                                                                                             |
| `routes[].legs[].steps[].maneuver.coordinate`                                  | object           | A coordinate pair describing the location of the `maneuver`.                                                                                                                                                                                                                   |
| `routes[].legs[].steps[].maneuver.coordinate.latitude`                         | number           | The latitude coordinate of the `maneuver`.                                                                                                                                                                                                                                     |
| `routes[].legs[].steps[].maneuver.coordinate.longitude`                        | number           | The longitude coordinate of the `maneuver`.                                                                                                                                                                                                                                    |
| `routes[].legs[].steps[].maneuver.coordinate.name`                             | string           | The name or description of the maneuver location.                                                                                                                                                                                                                              |
| `routes[].legs[].steps[].maneuver.maneuver_type`                               | string           | A string indicating the type of `maneuver`.                                                                                                                                                                                                                                    |
| `routes[].legs[].steps[].name`                                                 | string           | The name of the `step`.                                                                                                                                                                                                                                                        |
| `routes[].legs[].steps[].intersections`                                        | array of object  | An array of objects representing intersections (or cross-way) that the route passes by along the `step`. For every `step`, the very first `intersection` corresponds to the location of the `maneuver`. All intersections until the next `maneuver` are listed in this object. |
| `routes[].legs[].steps[].intersections[].location`                             | object           | A [longitude, latitude] pair describing the location of the intersection.                                                                                                                                                                                                      |
| `routes[].legs[].steps[].intersections[].location.latitude`                    | number           | The latitude coordinate of the `intersection`.                                                                                                                                                                                                                                 |
| `routes[].legs[].steps[].intersections[].location.longitude`                   | number           | The longitude coordinate of the `intersection`.                                                                                                                                                                                                                                |
| `routes[].legs[].steps[].intersections[].location.name`                        | string           | The name or description of the `intersection`.                                                                                                                                                                                                                                 |
| `routes[].legs[].steps[].intersections[].bearings`                             | array of integer | A list of bearing values (e.g. [0,90,180,270]) that are available at the intersection. The `bearings` describe all available roads at the intersection.                                                                                                                        |
| `routes[].legs[].steps[].intersections[].classes`                              | array of string  | An array of strings representing the classes or types of roads or paths at the intersection. The classes can indicate the road hierarchy, such as a motorway, primary road, secondary road, etc.                                                                               |
| `routes[].legs[].steps[].intersections[].entry`                                | array of boolean | A value of `true` indicates that the respective road could be entered on a valid route. `false` indicates that the turn onto the respective road would violate a restriction. Each entry value corresponds to the bearing angle at the same index.                             |
| `routes[].legs[].steps[].intersections[].intersection_in`                      | integer          | The number of incoming roads or paths at the `intersection`.                                                                                                                                                                                                                   |
| `routes[].legs[].steps[].intersections[].intesection_out`                      | integer          | The number of outgoing roads or paths from the `intersection`.                                                                                                                                                                                                                 |
| `routes[].legs[].steps[].intersections[].lanes`                                | array of object  | An array of lane objects representing the lanes available at the intersection. If no lane information is available for an `intersection`, the `lanes` property will not be present.                                                                                            |
| `routes[].legs[].steps[].intersections[].lanes[].indications`                  | array of string  | It represents actions associated with the lane. These indications describe the permitted maneuvers or directions that can be taken from the lane. Common indications include "turn left," "turn right," "go straight," "merge," "exit," etc.                                   |
| `routes[].legs[].steps[].intersections[].lanes[].valid`                        | boolean          | This indicates the validity of the lane. It specifies whether the lane is considered valid for making the indicated maneuver or if there are any restrictions or limitations associated with it.                                                                               |
| `routes[].legs[].steps[].reference`                                            | string           | A reference for the `step`.                                                                                                                                                                                                                                                    |
| `routes[].legs[].steps[].road_shield_type`                                     | object           | An object containing road shield information.                                                                                                                                                                                                                                  |
| `routes[].legs[].steps[].road_shield_type.label`                               | string           | A label identifying the inscription on the road shield, such as containing the road number.                                                                                                                                                                                    |
| `routes[].legs[].steps[].road_shield_type.image_url`                           | string           | The URL to fetch the road shield image.                                                                                                                                                                                                                                        |
| `routes[].legs[].steps[].driving_side`                                         | string           | Indicates the driving side of the road in case bidirectional traffic is allowed on the given segment. It can have two values: "left" & "right".                                                                                                                                |
| `routes[].road_info`                                                           | object           | An object containing the maximum speed information for each road segment present in the route.                                                                                                                                                                                 |
| `routes[].road_info.max_speed`                                                 | array of object  | An array of objects containing maximum speed, in kilometres per hour, for each segment of the route. Each object represents a continuous set of road segments.                                                                                                                 |
| `routes[].road_info.max_speed[].offset`                                        | integer          | `offset` is the index value of the location coordinate, in decoded route geometry, which is the starting point of the road segment.                                                                                                                                            |
| `routes[].road_info.max_speed[].length`                                        | integer          | `length` refers to a sequence of 'n' consecutive vertices in the route geometry starting from the `offset`, forming a continuous section of route where the maximum speed is same and is indicated in `value`.                                                                 |
| `routes[].road_info.max_speed[].value`                                         | number           | `value` denotes the maximum speed of this segment, in kilometers per hour. - A value of "-1" indicates that the speed is unlimited for this road segment. - A value of "0" indicates that there is no information about the maximum speed for this road segment.               |
| `routes[].road_info.toll_distance`                                             | integer          | Returns the total distance travelled, in meters, on the road segments having a toll. This attribute is present in the response only when `road_info = toll_distance` .                                                                                                         |
| `routes[].road_info.toll_cost`                                                 | object           | Returns the range of toll charges that can be incurred when traveling on the suggested route. This field is present in the response only when `road_info = toll_cost`.                                                                                                         |
| `routes[].road_info.toll_cost.minimum_toll_cost`                               | number           | Returns the minimum toll charge to be paid when traveling on the suggested route.                                                                                                                                                                                              |
| `routes[].road_info.toll_cost.maximum_toll_cost`                               | number           | Returns the maximum toll charge that could be paid when traveling on the suggested route.                                                                                                                                                                                      |
| `routes[].road_info.toll_cost.currency`                                        | string           | Returns the currency used to calculate the toll costs.                                                                                                                                                                                                                         |
| `routes[].road_info.toll_info`                                                 | array of object  | An array of objects returning the name & location of all tolls on the suggested route. Each object carried the details of a single toll. This attribute is present in the response only when `road_info=toll_info` .                                                           |
| `routes[].road_info.toll_info[].name`                                          | string           | Returns the name of the toll.                                                                                                                                                                                                                                                  |
| `routes[].road_info.toll_info[].latitude`                                      | number           | Returns the latitude of the toll location.                                                                                                                                                                                                                                     |
| `routes[].road_info.toll_info[].longitude`                                     | number           | Returns the longitude of the toll location.                                                                                                                                                                                                                                    |
| `routes[].road_info.truck_route`                                               | array of object  | An array of objects returning the information about allowed truck types for each segment of the route. Each object represents a continuous set of road segments. This attribute is present in the response only when `road_info=truck_route` .                                 |
| `routes[].road_info.truck_route[].offset`                                      | integer          | Returns the index value of the location coordinate, in decoded route geometry, which is the starting point of the road segment.                                                                                                                                                |
| `routes[].road_info.truck_route[].length`                                      | integer          | Refers to a sequence of 'n' consecutive vertices in the route geometry starting from the `offset`, forming a continuous section of route for which allowed truck types are the same and is indicated in `value`.                                                               |
| `routes[].road_info.truck_route[].value`                                       | array of string  | An array of strings returning all available values for the allowed truck type on a given set of continuous road segments denoted by `offset` and `length` .                                                                                                                    |
| `routes[].road_info.stop_sign`                                                 | array of object  | An array of objects returning the information about all "STOP" signs on the route. Each object carried the details of a single stop sign. This attribute is present in the response only when `road_info=stop_sign` .                                                          |
| `routes[].road_info.stop_sign[].offset`                                        | integer          | Returns the index value of the location coordinate, in decoded route geometry, corresponding to the location of the stop sign.                                                                                                                                                 |
| `routes[].road_info.stop_sign[].latitude`                                      | number           | Returns the latitude of the stop sign location.                                                                                                                                                                                                                                |
| `routes[].road_info.stop_sign[].longitude`                                     | number           | Returns the longitude of the stop sign location.                                                                                                                                                                                                                               |
| `routes[].road_info.traffic_light`                                             | array of object  | An array of objects returning the information about all traffic lights on the route. Each object carried the details of a single traffic light. This attribute is present in the response only when `road_info=traffic_light` .                                                |
| `routes[].road_info.traffic_light[].offset`                                    | integer          | Returns the index value of the location coordinate, in decoded route geometry, corresponding to the location of the traffic light.                                                                                                                                             |
| `routes[].road_info.traffic_light[].latitude`                                  | number           | Returns the latitude of the traffic light location.                                                                                                                                                                                                                            |
| `routes[].road_info.traffic_light[].longitude`                                 | number           | Returns the longitude of the traffic light location.                                                                                                                                                                                                                           |

## Sample Queries-Navigation Flexible

### GET Request Example 1

Let’s create a basic navigation flexible request for a trip

- being made by a `truck`
- between a given `origin` and a `destination`
- at a specific `departure_time`

#### Request

```bash
https://api.nextbillion.io/navigation/json?departure_time=1688389200&option=flexible&origin=34.05605379,-118.24495386&destination=34.05037935,-118.24087972&key=<your_api_key>&mode=truck
```

#### Response

```json
{
  "status": "Ok",
  "routes": [
    {
      "geometry": "kqznE~uupUSQo@o@S_@`@k@\\g@JMJOX]PSFKJK^a@nAwANOd@i@^g@d@o@TY^e@f@k@LQTWLM\\_@DGHKd@o@f@m@X]PUNS`B{BPHDBF@NDz@V\\Lh@RXLn@VLHNHHFv@j@RPHH\\\\",
      "distance": 956.98,
      "duration": 208.356,
      "start_location": {
        "latitude": 34.05606,
        "longitude": -118.24496
      },
      "end_location": {
        "latitude": 34.05038,
        "longitude": -118.2409
      },
      "legs": [
        {
          "distance": {
            "value": 956
          },
          "duration": {
            "value": 208
          },
          "start_location": {
            "latitude": 34.05606,
            "longitude": -118.24496
          },
          "end_location": {
            "latitude": 34.05038,
            "longitude": -118.2409
          },
          "steps": [
            {
              "geometry": "kqznE~uupUSQo@o@S_@",
              "start_location": {
                "latitude": 34.05606,
                "longitude": -118.24496
              },
              "end_location": {
                "latitude": 34.0565,
                "longitude": -118.24447
              },
              "distance": {
                "value": 66
              },
              "duration": {
                "value": 20
              },
              "maneuver": {
                "instruction": "Head northeast on N Hill St, then use the right lane to turn right onto W Temple St",
                "voice_instruction": [],
                "bearing_before": 0,
                "bearing_after": 36,
                "coordinate": {
                  "latitude": 34.056058,
                  "longitude": -118.244961
                },
                "maneuver_type": "depart"
              },
              "name": "N Hill St",
              "intersections": [
                {
                  "location": {
                    "latitude": 34.056058,
                    "longitude": -118.244961
                  },
                  "bearings": [36],
                  "classes": [],
                  "entry": [true],
                  "intersection_in": 0,
                  "intersection_out": 0,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 34.056159,
                    "longitude": -118.244872
                  },
                  "bearings": [40, 216],
                  "classes": [],
                  "entry": [true, false],
                  "intersection_in": 1,
                  "intersection_out": 0,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 34.056395,
                    "longitude": -118.244633
                  },
                  "bearings": [52, 220],
                  "classes": [],
                  "entry": [true, false],
                  "intersection_in": 1,
                  "intersection_out": 0,
                  "lanes": []
                }
              ],
              "road_shield_type": {}
            },
            {
              "geometry": "ctznE|rupU`@k@\\g@JMJOX]PSFKJK^a@nAwANOd@i@^g@d@o@TY^e@f@k@LQTWLM\\_@DGHKd@o@f@m@X]PUNS`B{B",
              "start_location": {
                "latitude": 34.0565,
                "longitude": -118.24447
              },
              "end_location": {
                "latitude": 34.05243,
                "longitude": -118.23966
              },
              "distance": {
                "value": 633
              },
              "duration": {
                "value": 144
              },
              "maneuver": {
                "instruction": "Use the right lane to turn right onto W Temple St",
                "voice_instruction": [],
                "bearing_before": 52,
                "bearing_after": 133,
                "coordinate": {
                  "latitude": 34.056499,
                  "longitude": -118.244473
                },
                "maneuver_type": "turn",
                "modifier": "right"
              },
              "name": "W Temple St",
              "intersections": [
                {
                  "location": {
                    "latitude": 34.056499,
                    "longitude": -118.244473
                  },
                  "bearings": [55, 133, 232, 315],
                  "classes": [],
                  "entry": [true, true, false, true],
                  "intersection_in": 2,
                  "intersection_out": 1,
                  "lanes": [
                    {
                      "indications": ["left"],
                      "valid": false
                    },
                    {
                      "indications": ["straight"],
                      "valid": false
                    },
                    {
                      "indications": ["straight", "right"],
                      "valid": true
                    }
                  ]
                },
                {
                  "location": {
                    "latitude": 34.056327,
                    "longitude": -118.244251
                  },
                  "bearings": [132, 313],
                  "classes": [],
                  "entry": [true, false],
                  "intersection_in": 1,
                  "intersection_out": 0,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 34.056176,
                    "longitude": -118.244052
                  },
                  "bearings": [132, 312],
                  "classes": [],
                  "entry": [true, false],
                  "intersection_in": 1,
                  "intersection_out": 0,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 34.05612,
                    "longitude": -118.243978
                  },
                  "bearings": [133, 312],
                  "classes": [],
                  "entry": [true, false],
                  "intersection_in": 1,
                  "intersection_out": 0,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 34.05606,
                    "longitude": -118.2439
                  },
                  "bearings": [136, 313],
                  "classes": [],
                  "entry": [true, false],
                  "intersection_in": 1,
                  "intersection_out": 0,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 34.055929,
                    "longitude": -118.243747
                  },
                  "bearings": [136, 316],
                  "classes": [],
                  "entry": [true, false],
                  "intersection_in": 1,
                  "intersection_out": 0,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 34.055739,
                    "longitude": -118.243525
                  },
                  "bearings": [37, 140, 218, 316],
                  "classes": [],
                  "entry": [true, true, true, false],
                  "intersection_in": 3,
                  "intersection_out": 1,
                  "lanes": [
                    {
                      "indications": ["left"],
                      "valid": false
                    },
                    {
                      "indications": ["straight"],
                      "valid": true
                    },
                    {
                      "indications": ["straight", "right"],
                      "valid": true
                    }
                  ]
                },
                {
                  "location": {
                    "latitude": 34.05558,
                    "longitude": -118.243362
                  },
                  "bearings": [138, 320],
                  "classes": [],
                  "entry": [true, false],
                  "intersection_in": 1,
                  "intersection_out": 0,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 34.055177,
                    "longitude": -118.242921
                  },
                  "bearings": [137, 318],
                  "classes": [],
                  "entry": [true, false],
                  "intersection_in": 1,
                  "intersection_out": 0,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 34.055104,
                    "longitude": -118.24284
                  },
                  "bearings": [138, 317],
                  "classes": [],
                  "entry": [true, false],
                  "intersection_in": 1,
                  "intersection_out": 0,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 34.054913,
                    "longitude": -118.242631
                  },
                  "bearings": [38, 134, 217, 318],
                  "classes": [],
                  "entry": [false, true, true, false],
                  "intersection_in": 3,
                  "intersection_out": 1,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 34.054754,
                    "longitude": -118.242434
                  },
                  "bearings": [134, 314],
                  "classes": [],
                  "entry": [true, false],
                  "intersection_in": 1,
                  "intersection_out": 0,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 34.054559,
                    "longitude": -118.242192
                  },
                  "bearings": [134, 314],
                  "classes": [],
                  "entry": [true, false],
                  "intersection_in": 1,
                  "intersection_out": 0,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 34.05445,
                    "longitude": -118.242057
                  },
                  "bearings": [136, 314],
                  "classes": [],
                  "entry": [true, false],
                  "intersection_in": 1,
                  "intersection_out": 0,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 34.054291,
                    "longitude": -118.241873
                  },
                  "bearings": [138, 316],
                  "classes": [],
                  "entry": [true, false],
                  "intersection_in": 1,
                  "intersection_out": 0,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 34.05409,
                    "longitude": -118.241652
                  },
                  "bearings": [37, 134, 218, 318],
                  "classes": [],
                  "entry": [true, true, false, false],
                  "intersection_in": 3,
                  "intersection_out": 1,
                  "lanes": [
                    {
                      "indications": ["left"],
                      "valid": false
                    },
                    {
                      "indications": ["straight"],
                      "valid": true
                    },
                    {
                      "indications": ["straight"],
                      "valid": true
                    }
                  ]
                },
                {
                  "location": {
                    "latitude": 34.054016,
                    "longitude": -118.241558
                  },
                  "bearings": [38, 136, 314],
                  "classes": [],
                  "entry": [false, true, false],
                  "intersection_in": 2,
                  "intersection_out": 1,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 34.053914,
                    "longitude": -118.241439
                  },
                  "bearings": [140, 316],
                  "classes": [],
                  "entry": [true, false],
                  "intersection_in": 1,
                  "intersection_out": 0,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 34.053845,
                    "longitude": -118.241368
                  },
                  "bearings": [140, 320],
                  "classes": [],
                  "entry": [true, false],
                  "intersection_in": 1,
                  "intersection_out": 0,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 34.053694,
                    "longitude": -118.241213
                  },
                  "bearings": [37, 135, 320],
                  "classes": [],
                  "entry": [false, true, false],
                  "intersection_in": 2,
                  "intersection_out": 1,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 34.053657,
                    "longitude": -118.241168
                  },
                  "bearings": [39, 135, 218, 315],
                  "classes": [],
                  "entry": [false, true, false, false],
                  "intersection_in": 3,
                  "intersection_out": 1,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 34.053611,
                    "longitude": -118.241112
                  },
                  "bearings": [34, 135, 315],
                  "classes": [],
                  "entry": [false, true, false],
                  "intersection_in": 2,
                  "intersection_out": 1,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 34.053416,
                    "longitude": -118.240875
                  },
                  "bearings": [37, 136, 214, 315],
                  "classes": [],
                  "entry": [true, true, true, false],
                  "intersection_in": 3,
                  "intersection_out": 1,
                  "lanes": [
                    {
                      "indications": ["left"],
                      "valid": false
                    },
                    {
                      "indications": ["straight"],
                      "valid": true
                    },
                    {
                      "indications": ["straight", "right"],
                      "valid": true
                    }
                  ]
                },
                {
                  "location": {
                    "latitude": 34.053216,
                    "longitude": -118.240641
                  },
                  "bearings": [136, 316],
                  "classes": [],
                  "entry": [true, false],
                  "intersection_in": 1,
                  "intersection_out": 0,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 34.053087,
                    "longitude": -118.24049
                  },
                  "bearings": [133, 316],
                  "classes": [],
                  "entry": [true, false],
                  "intersection_in": 1,
                  "intersection_out": 0,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 34.053,
                    "longitude": -118.240379
                  },
                  "bearings": [134, 313],
                  "classes": [],
                  "entry": [true, false],
                  "intersection_in": 1,
                  "intersection_out": 0,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 34.052923,
                    "longitude": -118.240283
                  },
                  "bearings": [134, 314],
                  "classes": [],
                  "entry": [true, false],
                  "intersection_in": 1,
                  "intersection_out": 0,
                  "lanes": []
                }
              ],
              "road_shield_type": {}
            },
            {
              "geometry": "uzynEzttpUPHDBF@NDz@V\\Lh@RXLn@VLHNHHFv@j@RPHH\\\\",
              "start_location": {
                "latitude": 34.05243,
                "longitude": -118.23966
              },
              "end_location": {
                "latitude": 34.05038,
                "longitude": -118.2409
              },
              "distance": {
                "value": 257
              },
              "duration": {
                "value": 43
              },
              "maneuver": {
                "instruction": "Turn right onto Judge John Aiso St",
                "voice_instruction": [
                  {
                    "distance_along_geometry": 630,
                    "unit": "meters",
                    "instruction": "In 630 meters, Turn right onto Judge John Aiso St"
                  },
                  {
                    "distance_along_geometry": 200,
                    "unit": "meters",
                    "instruction": "In 200 meters, Turn right onto Judge John Aiso St"
                  },
                  {
                    "distance_along_geometry": 50,
                    "unit": "meters",
                    "instruction": "Turn right onto Judge John Aiso St"
                  }
                ],
                "bearing_before": 134,
                "bearing_after": 202,
                "coordinate": {
                  "latitude": 34.052434,
                  "longitude": -118.239663
                },
                "maneuver_type": "turn",
                "modifier": "right"
              },
              "name": "Judge John Aiso St",
              "intersections": [
                {
                  "location": {
                    "latitude": 34.052434,
                    "longitude": -118.239663
                  },
                  "bearings": [15, 135, 202, 314],
                  "classes": [],
                  "entry": [false, true, true, false],
                  "intersection_in": 3,
                  "intersection_out": 2,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 34.051745,
                    "longitude": -118.239959
                  },
                  "bearings": [21, 201, 322],
                  "classes": [],
                  "entry": [false, true, true],
                  "intersection_in": 0,
                  "intersection_out": 1,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 34.051401,
                    "longitude": -118.240127
                  },
                  "bearings": [24, 203, 289],
                  "classes": [],
                  "entry": [false, true, true],
                  "intersection_in": 0,
                  "intersection_out": 1,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 34.051162,
                    "longitude": -118.240252
                  },
                  "bearings": [23, 118, 209, 301],
                  "classes": [],
                  "entry": [false, true, true, true],
                  "intersection_in": 0,
                  "intersection_out": 2,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 34.051013,
                    "longitude": -118.24035
                  },
                  "bearings": [29, 120, 213],
                  "classes": [],
                  "entry": [false, true, true],
                  "intersection_in": 0,
                  "intersection_out": 2,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 34.050682,
                    "longitude": -118.240608
                  },
                  "bearings": [33, 217],
                  "classes": [],
                  "entry": [false, true],
                  "intersection_in": 0,
                  "intersection_out": 1,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 34.050576,
                    "longitude": -118.240704
                  },
                  "bearings": [37, 219],
                  "classes": [],
                  "entry": [false, true],
                  "intersection_in": 0,
                  "intersection_out": 1,
                  "lanes": []
                }
              ],
              "road_shield_type": {}
            },
            {
              "geometry": "{mynEr|tpU??",
              "start_location": {
                "latitude": 34.05038,
                "longitude": -118.2409
              },
              "end_location": {
                "latitude": 34.05038,
                "longitude": -118.2409
              },
              "distance": {
                "value": 0
              },
              "duration": {
                "value": 0
              },
              "maneuver": {
                "instruction": "You have arrived at Judge John Aiso St",
                "voice_instruction": [
                  {
                    "distance_along_geometry": 200,
                    "unit": "meters",
                    "instruction": "In 200 meters, You will arrive"
                  },
                  {
                    "distance_along_geometry": 50,
                    "unit": "meters",
                    "instruction": "You have arrived at Judge John Aiso St"
                  }
                ],
                "bearing_before": 221,
                "bearing_after": 0,
                "coordinate": {
                  "latitude": 34.05038,
                  "longitude": -118.2409
                },
                "maneuver_type": "arrive"
              },
              "name": "Judge John Aiso St",
              "intersections": [
                {
                  "location": {
                    "latitude": 34.05038,
                    "longitude": -118.2409
                  },
                  "bearings": [41],
                  "classes": [],
                  "entry": [true],
                  "intersection_in": 0,
                  "intersection_out": 0,
                  "lanes": []
                }
              ],
              "road_shield_type": {}
            }
          ]
        }
      ]
    }
  ]
}
```

When represented on a map the above response would look similar to below illustration

![navigation flexi example 1](https://static.nextbillion.io/docs-next/docs/navigation/api/navigation-flexi-api-example-1.webp)

### GET Request Example 2

In the next example, we will create a navigation flexible request for a trip where we want a truck to avoid hazmat roads. We configure:

- an `origin` and a `destination`
- `mode` as `truck`
- `hazmat_type` as “circumstantial”

#### Request

```bash
curl --location 'https://api.nextbillion.io/navigation/json?key=<your_api_key>&origin=48.22539980,-101.29602541&destination=48.24027183,-101.29608570&mode=truck&option=flexible&hazmat_type=circumstantial'
```

#### Response

```json
{
  "status": "Ok",
  "routes": [
    {
      "geometry": "ofm~zAfyre`ElGT~UXD?`Z?to@_@na@p@lK@hPBfn@iAzoBIF?pw@WjZKl[KrMFzz@b@xJFD?n[Pl~@?@?nQ?B?~^EB?zfAP??te@Kxa@CF?nCA??xa@?@?bIIF?fJK@?tIM@?pVW@?vEOF?tNk@F?|DvCBBjVSlEEp\\YvSND?jU\\jBHB?lEjAbEn@fDv@lDfCxAjDz@xFt@~Od@fStA~aA|@`e@t@|ZHtJ?@Fzl@]|jAgFpm@aLfrAgDv`@yOzdBkKfjAAJc@hF{Dre@?BuIr|@oL`mA{Ftl@ADsEfj@uI`|@aOxyAc]bmD?BoCj\\u@vI_D~\\a@~HAHcAtNAJ{BtV_AdKuCp\\AF{Frm@wEpd@cEt[?BkEd]_D|TuEdWiHx^iHv\\eE~PqDzNkC|K{D|MmFtQuH~TyHbTs@dBoEtKCF[t@sGfOSb@cJhRiNpYA@ku@|wAeBdD{y@x~Aoj@tgAEHgGlLswAdqCcTxa@oQp]AB_GfLcTf`@yIbPA@sHhNCB{@~Bk[fl@cm@thAYd@CDiRv[ySj_@yOt]CFyYpr@gGbQwEbPiFhRCJYdA{DlPoAhGAByAdH}ClRyCnUoAhKAFmA|Om@zL}@xR?HuAz]{NkEcEiAqNsEcCeFsAo@aa@gNiOoFCAo]gKw_@gKwg@qL}k@}MCAsm@wLybBwXiDo@CAcu@aNEAs_A}P??}e@uIwk@eKEA{MgCC?s_AoQyo@kN_y@{SgOuDEA{n@gQ}IaC{UiGCAoJkCsl@gPqd@eRo\\qM}LeGcKaHqN_KqDqDmEgEsEoFsKcNcL_N{DgFcAqAs@y@oBiALcLDgE?G?wF?_E?a\\@_QHqz@?IAch@AsI?oDIoT?KKaXCkHDsUDk]?AQecAQ_dAEgc@?KByo@Acn@B{o@AmTF}W?II_Z?K?sV?EBcU?eB?E@eS@qO@gH?GJsV?KEqVAyOAk]?K@yJ???we@?I?uk@??Ici@Iuj@?mg@?MXyj@Emr@?CC{_@?Ml@mkCX{qATuHd@}Gh@yDx@eGfC_KnBuFrA}B@AnAyBbFsHjKmMbNqMzHsK`F}KxCaKlB}Jt@iI@Gl@{JH{LMkBcByVc@{GqAmN]sGOiFEeMGoTb@sqA??`@cdB?KCgm@A{o@Nsf@?K@kERcn@Akm@?KCen@?IOaYm@gMi@kGaBoKeCmK}Nai@ACmJ_[CGsIwYqEyPgBwH??S{@yCeOaBsJy@kGi@kGq@aVE_TwPg@",
      "distance": 11037.742,
      "duration": 1043.4,
      "start_location": {
        "latitude": 48.2254,
        "longitude": -101.296036
      },
      "end_location": {
        "latitude": 48.240271,
        "longitude": -101.296066
      },
      "legs": [
        {
          "distance": {
            "value": 11037
          },
          "duration": {
            "value": 1043
          },
          "start_location": {
            "latitude": 48.2254,
            "longitude": -101.296036
          },
          "end_location": {
            "latitude": 48.240271,
            "longitude": -101.296066
          },
          "steps": [
            {
              "geometry": "ofm~zAfyre`ElGT~UXD?`Z?to@_@na@p@lK@hPBfn@iAzoBIF?pw@WjZKl[KrMFzz@b@xJFD?n[Pl~@?@?nQ?B?~^EB?zfAP??te@Kxa@CF?nCA??xa@?@?bIIF?fJK@?tIM@?pVW@?vEOF?tNk@F?|DvCBBjVSlEEp\\YvSND?jU\\jBHB?",
              "start_location": {
                "latitude": 48.2254,
                "longitude": -101.296036
              },
              "end_location": {
                "latitude": 48.208602,
                "longitude": -101.296058
              },
              "distance": {
                "value": 1870
              },
              "duration": {
                "value": 251
              },
              "maneuver": {
                "instruction": "Head south on S Broadway (US-83 N)",
                "voice_instruction": [],
                "bearing_before": 0,
                "bearing_after": 183,
                "bearing": 0,
                "coordinate": {
                  "latitude": 48.2254,
                  "longitude": -101.296036
                },
                "maneuver_type": "depart"
              },
              "name": "S Broadway",
              "intersections": [
                {
                  "location": {
                    "latitude": 48.2254,
                    "longitude": -101.296036
                  },
                  "bearings": [183],
                  "classes": [],
                  "entry": [true],
                  "intersection_in": 0,
                  "intersection_out": 0,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 48.225265,
                    "longitude": -101.296047
                  },
                  "bearings": [3, 181],
                  "classes": [],
                  "entry": [false, true],
                  "intersection_in": 0,
                  "intersection_out": 1,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 48.224894,
                    "longitude": -101.29606
                  },
                  "bearings": [1, 180],
                  "classes": [],
                  "entry": [false, true],
                  "intersection_in": 0,
                  "intersection_out": 1,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 48.223682,
                    "longitude": -101.296044
                  },
                  "bearings": [89, 182, 277, 359],
                  "classes": [],
                  "entry": [true, true, true, false],
                  "intersection_in": 3,
                  "intersection_out": 1,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 48.221898,
                    "longitude": -101.296035
                  },
                  "bearings": [92, 180, 270, 358],
                  "classes": [],
                  "entry": [true, true, true, false],
                  "intersection_in": 3,
                  "intersection_out": 1,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 48.220088,
                    "longitude": -101.29603
                  },
                  "bearings": [0, 179, 265],
                  "classes": [],
                  "entry": [false, true, true],
                  "intersection_in": 0,
                  "intersection_out": 1,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 48.219183,
                    "longitude": -101.296018
                  },
                  "bearings": [179, 359],
                  "classes": [],
                  "entry": [true, false],
                  "intersection_in": 1,
                  "intersection_out": 0,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 48.218745,
                    "longitude": -101.296012
                  },
                  "bearings": [179, 270, 359],
                  "classes": [],
                  "entry": [true, true, false],
                  "intersection_in": 2,
                  "intersection_out": 0,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 48.21829,
                    "longitude": -101.296006
                  },
                  "bearings": [92, 181, 270, 359],
                  "classes": [],
                  "entry": [true, true, true, false],
                  "intersection_in": 3,
                  "intersection_out": 1,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 48.217098,
                    "longitude": -101.296028
                  },
                  "bearings": [1, 181],
                  "classes": [],
                  "entry": [false, true],
                  "intersection_in": 0,
                  "intersection_out": 1,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 48.216906,
                    "longitude": -101.296032
                  },
                  "bearings": [1, 181],
                  "classes": [],
                  "entry": [false, true],
                  "intersection_in": 0,
                  "intersection_out": 1,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 48.21645,
                    "longitude": -101.296041
                  },
                  "bearings": [1, 89, 180, 270],
                  "classes": [],
                  "entry": [false, true, true, true],
                  "intersection_in": 0,
                  "intersection_out": 2,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 48.215434,
                    "longitude": -101.296041
                  },
                  "bearings": [0, 180, 267],
                  "classes": [],
                  "entry": [false, true, true],
                  "intersection_in": 0,
                  "intersection_out": 1,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 48.215136,
                    "longitude": -101.296041
                  },
                  "bearings": [0, 180, 270],
                  "classes": [],
                  "entry": [false, true, false],
                  "intersection_in": 0,
                  "intersection_out": 1,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 48.214622,
                    "longitude": -101.296038
                  },
                  "bearings": [0, 90, 180, 269],
                  "classes": [],
                  "entry": [false, true, true, true],
                  "intersection_in": 0,
                  "intersection_out": 2,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 48.213472,
                    "longitude": -101.296047
                  },
                  "bearings": [0, 180],
                  "classes": [],
                  "entry": [false, true],
                  "intersection_in": 0,
                  "intersection_out": 1,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 48.212853,
                    "longitude": -101.296041
                  },
                  "bearings": [0, 87, 180],
                  "classes": [],
                  "entry": [false, true, true],
                  "intersection_in": 0,
                  "intersection_out": 2,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 48.212292,
                    "longitude": -101.296039
                  },
                  "bearings": [0, 179, 270],
                  "classes": [],
                  "entry": [false, true, true],
                  "intersection_in": 0,
                  "intersection_out": 1,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 48.21222,
                    "longitude": -101.296038
                  },
                  "bearings": [180, 359],
                  "classes": [],
                  "entry": [true, false],
                  "intersection_in": 1,
                  "intersection_out": 0,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 48.211662,
                    "longitude": -101.296038
                  },
                  "bearings": [0, 90, 179],
                  "classes": [],
                  "entry": [false, true, true],
                  "intersection_in": 0,
                  "intersection_out": 2,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 48.211496,
                    "longitude": -101.296033
                  },
                  "bearings": [179, 267, 359],
                  "classes": [],
                  "entry": [true, true, false],
                  "intersection_in": 2,
                  "intersection_out": 0,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 48.211315,
                    "longitude": -101.296027
                  },
                  "bearings": [178, 359],
                  "classes": [],
                  "entry": [true, false],
                  "intersection_in": 1,
                  "intersection_out": 0,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 48.211143,
                    "longitude": -101.29602
                  },
                  "bearings": [179, 358],
                  "classes": [],
                  "entry": [true, false],
                  "intersection_in": 1,
                  "intersection_out": 0,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 48.210765,
                    "longitude": -101.296008
                  },
                  "bearings": [89, 177, 267, 359],
                  "classes": [],
                  "entry": [false, true, true, false],
                  "intersection_in": 3,
                  "intersection_out": 1,
                  "lanes": [
                    {
                      "indications": ["left"],
                      "valid": false
                    },
                    {
                      "indications": ["straight"],
                      "valid": true
                    },
                    {
                      "indications": ["straight"],
                      "valid": true
                    }
                  ]
                },
                {
                  "location": {
                    "latitude": 48.210653,
                    "longitude": -101.296
                  },
                  "bearings": [90, 177, 269, 357],
                  "classes": [],
                  "entry": [true, true, false, false],
                  "intersection_in": 3,
                  "intersection_out": 1,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 48.210398,
                    "longitude": -101.295978
                  },
                  "bearings": [145, 208, 357],
                  "classes": [],
                  "entry": [false, true, false],
                  "intersection_in": 2,
                  "intersection_out": 1,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 48.210301,
                    "longitude": -101.296056
                  },
                  "bearings": [28, 179],
                  "classes": [],
                  "entry": [false, true],
                  "intersection_in": 0,
                  "intersection_out": 1,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 48.209927,
                    "longitude": -101.296046
                  },
                  "bearings": [179, 359],
                  "classes": [],
                  "entry": [true, false],
                  "intersection_in": 1,
                  "intersection_out": 0,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 48.209824,
                    "longitude": -101.296043
                  },
                  "bearings": [179, 359],
                  "classes": [],
                  "entry": [true, false],
                  "intersection_in": 1,
                  "intersection_out": 0,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 48.209351,
                    "longitude": -101.29603
                  },
                  "bearings": [181, 204, 359],
                  "classes": [],
                  "entry": [true, true, false],
                  "intersection_in": 2,
                  "intersection_out": 0,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 48.209016,
                    "longitude": -101.296038
                  },
                  "bearings": [1, 93, 182, 265],
                  "classes": [],
                  "entry": [false, true, true, true],
                  "intersection_in": 0,
                  "intersection_out": 2,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 48.208658,
                    "longitude": -101.296053
                  },
                  "bearings": [2, 183, 332],
                  "classes": [],
                  "entry": [false, true, false],
                  "intersection_in": 0,
                  "intersection_out": 1,
                  "lanes": []
                }
              ],
              "reference": "US-83 N",
              "road_shield_type": {
                "label": "US-83 N"
              },
              "driving_side": "right"
            },
            {
              "geometry": "sll}zArzre`ElEjAbEn@fDv@lDfCxAjDz@xFt@~Od@fStA~aA|@`e@t@|ZHtJ?@Fzl@]|jAgFpm@aLfrAgDv`@yOzdBkKfjAAJc@hF{Dre@?BuIr|@oL`mA{Ftl@ADsEfj@uI`|@aOxyAc]bmD?BoCj\\u@vI_D~\\a@~HAHcAtNAJ{BtV_AdKuCp\\AF{Frm@wEpd@cEt[?BkEd]_D|TuEdWiHx^iHv\\eE~PqDzNkC|K{D|MmFtQuH~TyHbTs@dBoEtKCF[t@sGfOSb@cJhRiNpYA@ku@|wAeBdD{y@x~Aoj@tgAEHgGlLswAdqCcTxa@oQp]AB_GfLcTf`@yIbPA@sHhNCB{@~Bk[fl@cm@thAYd@CDiRv[ySj_@yOt]CFyYpr@gGbQwEbPiFhRCJYdA{DlPoAhGAByAdH}ClRyCnUoAhKAFmA|Om@zL}@xR?HuAz]",
              "start_location": {
                "latitude": 48.208602,
                "longitude": -101.296058
              },
              "end_location": {
                "latitude": 48.222362,
                "longitude": -101.343263
              },
              "distance": {
                "value": 4020
              },
              "duration": {
                "value": 238
              },
              "maneuver": {
                "instruction": "Take the ramp towards Williston",
                "voice_instruction": [
                  {
                    "distance_along_geometry": 1800,
                    "unit": "meters",
                    "instruction": "In 1.8 kilometer, Take the ramp towards Williston"
                  },
                  {
                    "distance_along_geometry": 200,
                    "unit": "meters",
                    "instruction": "In 200 meters, Take the ramp towards Williston"
                  },
                  {
                    "distance_along_geometry": 50,
                    "unit": "meters",
                    "instruction": "Take the ramp towards Williston"
                  }
                ],
                "bearing_before": 183,
                "bearing_after": 192,
                "bearing": 0,
                "coordinate": {
                  "latitude": 48.208602,
                  "longitude": -101.296058
                },
                "maneuver_type": "off ramp",
                "modifier": "slight right"
              },
              "name": "Highway 2 and 52 W",
              "intersections": [
                {
                  "location": {
                    "latitude": 48.208602,
                    "longitude": -101.296058
                  },
                  "bearings": [3, 182, 192],
                  "classes": [],
                  "entry": [false, true, true],
                  "intersection_in": 0,
                  "intersection_out": 2,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 48.208003,
                    "longitude": -101.299339
                  },
                  "bearings": [87, 270],
                  "classes": [],
                  "entry": [false, true],
                  "intersection_in": 0,
                  "intersection_out": 1,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 48.208014,
                    "longitude": -101.301288
                  },
                  "bearings": [91, 100, 283],
                  "classes": [],
                  "entry": [false, false, true],
                  "intersection_in": 0,
                  "intersection_out": 2,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 48.20813,
                    "longitude": -101.302033
                  },
                  "bearings": [103, 283],
                  "classes": [],
                  "entry": [false, true],
                  "intersection_in": 0,
                  "intersection_out": 1,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 48.208339,
                    "longitude": -101.303365
                  },
                  "bearings": [103, 283],
                  "classes": [],
                  "entry": [false, true],
                  "intersection_in": 0,
                  "intersection_out": 1,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 48.208692,
                    "longitude": -101.305535
                  },
                  "bearings": [104, 284],
                  "classes": [],
                  "entry": [false, true],
                  "intersection_in": 0,
                  "intersection_out": 1,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 48.208891,
                    "longitude": -101.306745
                  },
                  "bearings": [104, 283],
                  "classes": [],
                  "entry": [false, true],
                  "intersection_in": 0,
                  "intersection_out": 1,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 48.208909,
                    "longitude": -101.306862
                  },
                  "bearings": [103, 283],
                  "classes": [],
                  "entry": [false, true],
                  "intersection_in": 0,
                  "intersection_out": 1,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 48.209003,
                    "longitude": -101.307482
                  },
                  "bearings": [103, 285],
                  "classes": [],
                  "entry": [false, true],
                  "intersection_in": 0,
                  "intersection_out": 1,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 48.209174,
                    "longitude": -101.308468
                  },
                  "bearings": [105, 285],
                  "classes": [],
                  "entry": [false, true],
                  "intersection_in": 0,
                  "intersection_out": 1,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 48.20939,
                    "longitude": -101.309717
                  },
                  "bearings": [105, 285],
                  "classes": [],
                  "entry": [false, true],
                  "intersection_in": 0,
                  "intersection_out": 1,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 48.209517,
                    "longitude": -101.310451
                  },
                  "bearings": [105, 283],
                  "classes": [],
                  "entry": [false, true],
                  "intersection_in": 0,
                  "intersection_out": 1,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 48.209794,
                    "longitude": -101.31212
                  },
                  "bearings": [105, 285, 293],
                  "classes": [],
                  "entry": [false, true, true],
                  "intersection_in": 0,
                  "intersection_out": 1,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 48.210533,
                    "longitude": -101.316361
                  },
                  "bearings": [94, 105, 283],
                  "classes": [],
                  "entry": [false, false, true],
                  "intersection_in": 1,
                  "intersection_out": 2,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 48.210632,
                    "longitude": -101.317003
                  },
                  "bearings": [103, 284],
                  "classes": [],
                  "entry": [false, true],
                  "intersection_in": 0,
                  "intersection_out": 1,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 48.210712,
                    "longitude": -101.317483
                  },
                  "bearings": [104, 279],
                  "classes": [],
                  "entry": [false, true],
                  "intersection_in": 0,
                  "intersection_out": 1,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 48.21073,
                    "longitude": -101.317648
                  },
                  "bearings": [99, 282],
                  "classes": [],
                  "entry": [false, true],
                  "intersection_in": 0,
                  "intersection_out": 1,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 48.210765,
                    "longitude": -101.317905
                  },
                  "bearings": [102, 284],
                  "classes": [],
                  "entry": [false, true],
                  "intersection_in": 0,
                  "intersection_out": 1,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 48.210827,
                    "longitude": -101.318284
                  },
                  "bearings": [104, 284],
                  "classes": [],
                  "entry": [false, true],
                  "intersection_in": 0,
                  "intersection_out": 1,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 48.210935,
                    "longitude": -101.318956
                  },
                  "bearings": [103, 284],
                  "classes": [],
                  "entry": [false, true],
                  "intersection_in": 0,
                  "intersection_out": 1,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 48.211267,
                    "longitude": -101.320764
                  },
                  "bearings": [108, 199, 288],
                  "classes": [],
                  "entry": [false, false, true],
                  "intersection_in": 0,
                  "intersection_out": 2,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 48.211369,
                    "longitude": -101.321247
                  },
                  "bearings": [108, 289],
                  "classes": [],
                  "entry": [false, true],
                  "intersection_in": 0,
                  "intersection_out": 1,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 48.211705,
                    "longitude": -101.322494
                  },
                  "bearings": [114, 295],
                  "classes": [],
                  "entry": [false, true],
                  "intersection_in": 0,
                  "intersection_out": 1,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 48.212663,
                    "longitude": -101.324998
                  },
                  "bearings": [125, 290, 308],
                  "classes": [],
                  "entry": [false, true, true],
                  "intersection_in": 0,
                  "intersection_out": 2,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 48.212769,
                    "longitude": -101.325205
                  },
                  "bearings": [128, 308],
                  "classes": [],
                  "entry": [false, true],
                  "intersection_in": 0,
                  "intersection_out": 1,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 48.212931,
                    "longitude": -101.32551
                  },
                  "bearings": [129, 311],
                  "classes": [],
                  "entry": [false, true],
                  "intersection_in": 0,
                  "intersection_out": 1,
                  "lanes": [
                    {
                      "indications": ["left"],
                      "valid": false
                    },
                    {
                      "indications": ["straight"],
                      "valid": true
                    },
                    {
                      "indications": ["straight"],
                      "valid": true
                    }
                  ]
                },
                {
                  "location": {
                    "latitude": 48.213355,
                    "longitude": -101.326245
                  },
                  "bearings": [41, 131, 266, 313],
                  "classes": [],
                  "entry": [true, false, false, true],
                  "intersection_in": 1,
                  "intersection_out": 3,
                  "lanes": [
                    {
                      "indications": ["straight"],
                      "valid": true
                    },
                    {
                      "indications": ["straight"],
                      "valid": true
                    },
                    {
                      "indications": ["straight"],
                      "valid": true
                    },
                    {
                      "indications": ["right"],
                      "valid": false
                    }
                  ]
                },
                {
                  "location": {
                    "latitude": 48.214276,
                    "longitude": -101.327751
                  },
                  "bearings": [133, 313],
                  "classes": [],
                  "entry": [false, true],
                  "intersection_in": 0,
                  "intersection_out": 1,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 48.215218,
                    "longitude": -101.329284
                  },
                  "bearings": [133, 312],
                  "classes": [],
                  "entry": [false, true],
                  "intersection_in": 0,
                  "intersection_out": 1,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 48.215917,
                    "longitude": -101.330452
                  },
                  "bearings": [39, 132, 215, 313],
                  "classes": [],
                  "entry": [true, false, true, true],
                  "intersection_in": 1,
                  "intersection_out": 3,
                  "lanes": [
                    {
                      "indications": ["left"],
                      "valid": false
                    },
                    {
                      "indications": ["straight"],
                      "valid": true
                    },
                    {
                      "indications": ["straight", "right"],
                      "valid": true
                    }
                  ]
                },
                {
                  "location": {
                    "latitude": 48.216049,
                    "longitude": -101.330667
                  },
                  "bearings": [133, 312],
                  "classes": [],
                  "entry": [false, true],
                  "intersection_in": 0,
                  "intersection_out": 1,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 48.217467,
                    "longitude": -101.333006
                  },
                  "bearings": [132, 312],
                  "classes": [],
                  "entry": [false, true],
                  "intersection_in": 0,
                  "intersection_out": 1,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 48.217805,
                    "longitude": -101.333563
                  },
                  "bearings": [132, 312],
                  "classes": [],
                  "entry": [false, true],
                  "intersection_in": 0,
                  "intersection_out": 1,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 48.218102,
                    "longitude": -101.334054
                  },
                  "bearings": [132, 312],
                  "classes": [],
                  "entry": [false, true],
                  "intersection_in": 0,
                  "intersection_out": 1,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 48.218568,
                    "longitude": -101.334798
                  },
                  "bearings": [134, 314],
                  "classes": [],
                  "entry": [false, true],
                  "intersection_in": 0,
                  "intersection_out": 1,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 48.218742,
                    "longitude": -101.335073
                  },
                  "bearings": [134, 313],
                  "classes": [],
                  "entry": [false, true],
                  "intersection_in": 0,
                  "intersection_out": 1,
                  "lanes": [
                    {
                      "indications": ["left"],
                      "valid": false
                    },
                    {
                      "indications": ["straight"],
                      "valid": true
                    },
                    {
                      "indications": ["straight"],
                      "valid": true
                    },
                    {
                      "indications": ["right"],
                      "valid": false
                    }
                  ]
                },
                {
                  "location": {
                    "latitude": 48.218898,
                    "longitude": -101.33532
                  },
                  "bearings": [69, 133, 238, 311],
                  "classes": [],
                  "entry": [true, false, true, true],
                  "intersection_in": 1,
                  "intersection_out": 3,
                  "lanes": [
                    {
                      "indications": ["left"],
                      "valid": false
                    },
                    {
                      "indications": ["straight"],
                      "valid": true
                    },
                    {
                      "indications": ["straight"],
                      "valid": true
                    },
                    {
                      "indications": ["right"],
                      "valid": false
                    }
                  ]
                },
                {
                  "location": {
                    "latitude": 48.219382,
                    "longitude": -101.336108
                  },
                  "bearings": [133, 313],
                  "classes": [],
                  "entry": [false, true],
                  "intersection_in": 0,
                  "intersection_out": 1,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 48.220135,
                    "longitude": -101.337309
                  },
                  "bearings": [133, 315],
                  "classes": [],
                  "entry": [false, true],
                  "intersection_in": 0,
                  "intersection_out": 1,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 48.221048,
                    "longitude": -101.338782
                  },
                  "bearings": [129, 308],
                  "classes": [],
                  "entry": [false, true],
                  "intersection_in": 0,
                  "intersection_out": 1,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 48.221609,
                    "longitude": -101.339897
                  },
                  "bearings": [124, 283, 301],
                  "classes": [],
                  "entry": [false, true, true],
                  "intersection_in": 0,
                  "intersection_out": 2,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 48.221836,
                    "longitude": -101.340486
                  },
                  "bearings": [120, 297],
                  "classes": [],
                  "entry": [false, true],
                  "intersection_in": 0,
                  "intersection_out": 1,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 48.221984,
                    "longitude": -101.340935
                  },
                  "bearings": [116, 293],
                  "classes": [],
                  "entry": [false, true],
                  "intersection_in": 0,
                  "intersection_out": 1,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 48.222226,
                    "longitude": -101.341954
                  },
                  "bearings": [107, 282],
                  "classes": [],
                  "entry": [false, true],
                  "intersection_in": 0,
                  "intersection_out": 1,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 48.222319,
                    "longitude": -101.342769
                  },
                  "bearings": [98, 277],
                  "classes": [],
                  "entry": [false, true],
                  "intersection_in": 0,
                  "intersection_out": 1,
                  "lanes": []
                }
              ],
              "reference": "US-2 W",
              "road_shield_type": {
                "label": "US-2 W"
              },
              "driving_side": "right"
            },
            {
              "geometry": "shg~zA|`oh`E{NkEcEiAqNsEcCeFsAo@aa@gNiOoFCAo]gKw_@gKwg@qL}k@}MCAsm@wLybBwXiDo@CAcu@aNEAs_A}P??}e@uIwk@eKEA{MgCC?s_AoQyo@kN_y@{SgOuDEA{n@gQ}IaC{UiGCAoJkCsl@gP",
              "start_location": {
                "latitude": 48.222362,
                "longitude": -101.343263
              },
              "end_location": {
                "latitude": 48.237408,
                "longitude": -101.338239
              },
              "distance": {
                "value": 1719
              },
              "duration": {
                "value": 103
              },
              "maneuver": {
                "instruction": "Use the right lane to turn right onto N 83 Byp",
                "voice_instruction": [
                  {
                    "distance_along_geometry": 4000,
                    "unit": "meters",
                    "instruction": "In 4.0 kilometer, Use the right lane to turn right onto N 83 Byp"
                  },
                  {
                    "distance_along_geometry": 200,
                    "unit": "meters",
                    "instruction": "In 200 meters, Use the right lane to turn right onto N 83 Byp"
                  },
                  {
                    "distance_along_geometry": 50,
                    "unit": "meters",
                    "instruction": "Use the right lane to turn right onto N 83 Byp"
                  }
                ],
                "bearing_before": 277,
                "bearing_after": 15,
                "bearing": 0,
                "coordinate": {
                  "latitude": 48.222362,
                  "longitude": -101.343263
                },
                "maneuver_type": "turn",
                "modifier": "right"
              },
              "name": "N 83 Byp",
              "intersections": [
                {
                  "location": {
                    "latitude": 48.222362,
                    "longitude": -101.343263
                  },
                  "bearings": [15, 97, 194, 275],
                  "classes": [],
                  "entry": [true, false, true, true],
                  "intersection_in": 1,
                  "intersection_out": 0,
                  "lanes": [
                    {
                      "indications": ["straight"],
                      "valid": false
                    },
                    {
                      "indications": ["right"],
                      "valid": true
                    }
                  ]
                },
                {
                  "location": {
                    "latitude": 48.222714,
                    "longitude": -101.343124
                  },
                  "bearings": [16, 195],
                  "classes": [],
                  "entry": [true, false],
                  "intersection_in": 1,
                  "intersection_out": 0,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 48.222963,
                    "longitude": -101.343018
                  },
                  "bearings": [35, 196, 358],
                  "classes": [],
                  "entry": [true, false, false],
                  "intersection_in": 1,
                  "intersection_out": 0,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 48.223879,
                    "longitude": -101.342514
                  },
                  "bearings": [15, 197],
                  "classes": [],
                  "entry": [true, false],
                  "intersection_in": 1,
                  "intersection_out": 0,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 48.225543,
                    "longitude": -101.341905
                  },
                  "bearings": [13, 113, 193, 282],
                  "classes": [],
                  "entry": [true, true, false, true],
                  "intersection_in": 2,
                  "intersection_out": 0,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 48.226264,
                    "longitude": -101.341665
                  },
                  "bearings": [11, 193],
                  "classes": [],
                  "entry": [true, false],
                  "intersection_in": 1,
                  "intersection_out": 0,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 48.22701,
                    "longitude": -101.341445
                  },
                  "bearings": [10, 191],
                  "classes": [],
                  "entry": [true, false],
                  "intersection_in": 1,
                  "intersection_out": 0,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 48.228694,
                    "longitude": -101.341008
                  },
                  "bearings": [11, 190],
                  "classes": [],
                  "entry": [true, false],
                  "intersection_in": 1,
                  "intersection_out": 0,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 48.229563,
                    "longitude": -101.340766
                  },
                  "bearings": [10, 191],
                  "classes": [],
                  "entry": [true, false],
                  "intersection_in": 1,
                  "intersection_out": 0,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 48.230597,
                    "longitude": -101.340479
                  },
                  "bearings": [10, 190],
                  "classes": [],
                  "entry": [true, false],
                  "intersection_in": 1,
                  "intersection_out": 0,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 48.23122,
                    "longitude": -101.340308
                  },
                  "bearings": [10, 113, 190, 290],
                  "classes": [],
                  "entry": [true, true, false, true],
                  "intersection_in": 2,
                  "intersection_out": 0,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 48.231939,
                    "longitude": -101.340112
                  },
                  "bearings": [11, 190],
                  "classes": [],
                  "entry": [true, false],
                  "intersection_in": 1,
                  "intersection_out": 0,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 48.232179,
                    "longitude": -101.340044
                  },
                  "bearings": [11, 191],
                  "classes": [],
                  "entry": [true, false],
                  "intersection_in": 1,
                  "intersection_out": 0,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 48.235185,
                    "longitude": -101.339076
                  },
                  "bearings": [14, 193],
                  "classes": [],
                  "entry": [true, false],
                  "intersection_in": 1,
                  "intersection_out": 0,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 48.235951,
                    "longitude": -101.338784
                  },
                  "bearings": [14, 194],
                  "classes": [],
                  "entry": [true, false],
                  "intersection_in": 1,
                  "intersection_out": 0,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 48.236494,
                    "longitude": -101.338585
                  },
                  "bearings": [14, 194],
                  "classes": [],
                  "entry": [true, false],
                  "intersection_in": 1,
                  "intersection_out": 0,
                  "lanes": []
                }
              ],
              "road_shield_type": {},
              "driving_side": "right"
            },
            {
              "geometry": "_ud_{A|feh`Eqd@eRo\\qM}LeGcKaHqN_KqDqDmEgEsEoFsKcNcL_N{DgFcAqAs@y@oBiA",
              "start_location": {
                "latitude": 48.237408,
                "longitude": -101.338239
              },
              "end_location": {
                "latitude": 48.240067,
                "longitude": -101.336217
              },
              "distance": {
                "value": 336
              },
              "duration": {
                "value": 34
              },
              "maneuver": {
                "instruction": "Take the ramp towards 4th Avenue Northwest",
                "display_instruction": "Take the ramp towards 4th Avenue Northwest",
                "voice_instruction": [
                  {
                    "distance_along_geometry": 1700,
                    "unit": "meters",
                    "instruction": "In 1.7 kilometer, Take the ramp towards 4th Avenue Northwest"
                  },
                  {
                    "distance_along_geometry": 200,
                    "unit": "meters",
                    "instruction": "In 200 meters, Take the ramp towards 4th Avenue Northwest"
                  },
                  {
                    "distance_along_geometry": 50,
                    "unit": "meters",
                    "instruction": "Take the ramp towards 4th Avenue Northwest"
                  }
                ],
                "bearing_before": 14,
                "bearing_after": 19,
                "bearing": 0,
                "coordinate": {
                  "latitude": 48.237408,
                  "longitude": -101.338239
                },
                "maneuver_type": "off ramp",
                "modifier": "slight right"
              },
              "name": "",
              "intersections": [
                {
                  "location": {
                    "latitude": 48.237408,
                    "longitude": -101.338239
                  },
                  "bearings": [11, 19, 194],
                  "classes": [],
                  "entry": [true, true, false],
                  "intersection_in": 2,
                  "intersection_out": 1,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 48.239147,
                    "longitude": -101.337231
                  },
                  "bearings": [34, 207],
                  "classes": [],
                  "entry": [true, false],
                  "intersection_in": 1,
                  "intersection_out": 0,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 48.239236,
                    "longitude": -101.337142
                  },
                  "bearings": [34, 214],
                  "classes": [],
                  "entry": [true, false],
                  "intersection_in": 1,
                  "intersection_out": 0,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 48.239857,
                    "longitude": -101.33644
                  },
                  "bearings": [39, 217, 351],
                  "classes": [],
                  "entry": [true, false, true],
                  "intersection_in": 1,
                  "intersection_out": 0,
                  "lanes": [
                    {
                      "indications": ["slight left"],
                      "valid": false
                    },
                    {
                      "indications": ["right"],
                      "valid": true
                    }
                  ]
                }
              ],
              "road_shield_type": {},
              "driving_side": "right"
            },
            {
              "geometry": "e{i_{Aphah`ELcLDgE?G?wF?_E?a\\@_QHqz@?IAch@AsI?oDIoT?KKaXCkHDsUDk]?AQecAQ_dAEgc@?KByo@Acn@B{o@AmTF}W?II_Z?K?sV?EBcU?eB?E@eS@qO@gH?GJsV?KEqVAyOAk]?K@yJ???we@?I?uk@??Ici@Iuj@?mg@?MXyj@Emr@?CC{_@?Ml@mkCX{qATuHd@}Gh@yDx@eGfC_KnBuFrA}B@AnAyBbFsHjKmMbNqMzHsK`F}KxCaKlB}Jt@iI@Gl@{JH{LMkBcByVc@{GqAmN]sGOiFEeMGoTb@sqA??`@cdB?KCgm@A{o@Nsf@?K@kERcn@Akm@?KCen@?IOaYm@gMi@kGaBoKeCmK}Nai@ACmJ_[CGsIwYqEyPgBwH??S{@yCeOaBsJy@kGi@kGq@aVE_T",
              "start_location": {
                "latitude": 48.240067,
                "longitude": -101.336217
              },
              "end_location": {
                "latitude": 48.239987,
                "longitude": -101.296086
              },
              "distance": {
                "value": 3061
              },
              "duration": {
                "value": 405
              },
              "maneuver": {
                "instruction": "Turn right onto 4th Ave NW",
                "voice_instruction": [
                  {
                    "distance_along_geometry": 330,
                    "unit": "meters",
                    "instruction": "In 330 meters, Turn right onto 4th Ave NW"
                  },
                  {
                    "distance_along_geometry": 200,
                    "unit": "meters",
                    "instruction": "In 200 meters, Turn right onto 4th Ave NW"
                  },
                  {
                    "distance_along_geometry": 50,
                    "unit": "meters",
                    "instruction": "Turn right onto 4th Ave NW"
                  }
                ],
                "bearing_before": 34,
                "bearing_after": 93,
                "bearing": 0,
                "coordinate": {
                  "latitude": 48.240067,
                  "longitude": -101.336217
                },
                "maneuver_type": "turn",
                "modifier": "right"
              },
              "name": "4th Ave NW",
              "intersections": [
                {
                  "location": {
                    "latitude": 48.240067,
                    "longitude": -101.336217
                  },
                  "bearings": [93, 214, 270, 342],
                  "classes": [],
                  "entry": [true, false, true, true],
                  "intersection_in": 1,
                  "intersection_out": 0,
                  "lanes": [
                    {
                      "indications": ["right"],
                      "valid": true
                    }
                  ]
                },
                {
                  "location": {
                    "latitude": 48.240057,
                    "longitude": -101.335903
                  },
                  "bearings": [90, 273],
                  "classes": [],
                  "entry": [true, false],
                  "intersection_in": 1,
                  "intersection_out": 0,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 48.240057,
                    "longitude": -101.335218
                  },
                  "bearings": [90, 182, 270],
                  "classes": [],
                  "entry": [true, true, false],
                  "intersection_in": 2,
                  "intersection_out": 0,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 48.240051,
                    "longitude": -101.333972
                  },
                  "bearings": [90, 182, 270, 359],
                  "classes": [],
                  "entry": [true, true, false, true],
                  "intersection_in": 2,
                  "intersection_out": 0,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 48.240052,
                    "longitude": -101.333314
                  },
                  "bearings": [89, 270],
                  "classes": [],
                  "entry": [true, false],
                  "intersection_in": 1,
                  "intersection_out": 0,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 48.240053,
                    "longitude": -101.333144
                  },
                  "bearings": [89, 269],
                  "classes": [],
                  "entry": [true, false],
                  "intersection_in": 1,
                  "intersection_out": 0,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 48.240058,
                    "longitude": -101.332706
                  },
                  "bearings": [89, 269],
                  "classes": [],
                  "entry": [true, false],
                  "intersection_in": 1,
                  "intersection_out": 0,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 48.240064,
                    "longitude": -101.332305
                  },
                  "bearings": [90, 269],
                  "classes": [],
                  "entry": [true, false],
                  "intersection_in": 1,
                  "intersection_out": 0,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 48.24006,
                    "longitude": -101.331306
                  },
                  "bearings": [0, 89, 271],
                  "classes": [],
                  "entry": [true, true, false],
                  "intersection_in": 2,
                  "intersection_out": 1,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 48.240069,
                    "longitude": -101.330215
                  },
                  "bearings": [3, 89, 189, 269],
                  "classes": [],
                  "entry": [true, true, true, false],
                  "intersection_in": 3,
                  "intersection_out": 1,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 48.240078,
                    "longitude": -101.329111
                  },
                  "bearings": [0, 90, 180, 269],
                  "classes": [],
                  "entry": [true, true, true, false],
                  "intersection_in": 3,
                  "intersection_out": 1,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 48.240081,
                    "longitude": -101.328525
                  },
                  "bearings": [90, 270],
                  "classes": [],
                  "entry": [true, false],
                  "intersection_in": 1,
                  "intersection_out": 0,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 48.240079,
                    "longitude": -101.327744
                  },
                  "bearings": [0, 90, 180, 270],
                  "classes": [],
                  "entry": [true, true, true, false],
                  "intersection_in": 3,
                  "intersection_out": 1,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 48.24008,
                    "longitude": -101.32699
                  },
                  "bearings": [90, 270],
                  "classes": [],
                  "entry": [true, false],
                  "intersection_in": 1,
                  "intersection_out": 0,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 48.240078,
                    "longitude": -101.326208
                  },
                  "bearings": [0, 90, 270],
                  "classes": [],
                  "entry": [true, true, false],
                  "intersection_in": 2,
                  "intersection_out": 1,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 48.240075,
                    "longitude": -101.325461
                  },
                  "bearings": [89, 271],
                  "classes": [],
                  "entry": [true, false],
                  "intersection_in": 1,
                  "intersection_out": 0,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 48.24008,
                    "longitude": -101.325023
                  },
                  "bearings": [90, 182, 269],
                  "classes": [],
                  "entry": [true, true, false],
                  "intersection_in": 2,
                  "intersection_out": 0,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 48.24008,
                    "longitude": -101.324642
                  },
                  "bearings": [90, 270, 359],
                  "classes": [],
                  "entry": [true, false, true],
                  "intersection_in": 1,
                  "intersection_out": 0,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 48.240078,
                    "longitude": -101.324234
                  },
                  "bearings": [90, 270],
                  "classes": [],
                  "entry": [true, false],
                  "intersection_in": 1,
                  "intersection_out": 0,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 48.240077,
                    "longitude": -101.323911
                  },
                  "bearings": [90, 270],
                  "classes": [],
                  "entry": [true, false],
                  "intersection_in": 1,
                  "intersection_out": 0,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 48.240076,
                    "longitude": -101.323646
                  },
                  "bearings": [91, 270],
                  "classes": [],
                  "entry": [true, false],
                  "intersection_in": 1,
                  "intersection_out": 0,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 48.240075,
                    "longitude": -101.323494
                  },
                  "bearings": [91, 180, 271],
                  "classes": [],
                  "entry": [true, true, false],
                  "intersection_in": 2,
                  "intersection_out": 0,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 48.240069,
                    "longitude": -101.32311
                  },
                  "bearings": [0, 89, 271],
                  "classes": [],
                  "entry": [true, true, false],
                  "intersection_in": 2,
                  "intersection_out": 1,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 48.240072,
                    "longitude": -101.322733
                  },
                  "bearings": [90, 269],
                  "classes": [],
                  "entry": [true, false],
                  "intersection_in": 1,
                  "intersection_out": 0,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 48.240073,
                    "longitude": -101.322464
                  },
                  "bearings": [90, 270],
                  "classes": [],
                  "entry": [true, false],
                  "intersection_in": 1,
                  "intersection_out": 0,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 48.240074,
                    "longitude": -101.321972
                  },
                  "bearings": [90, 180, 270],
                  "classes": [],
                  "entry": [true, true, false],
                  "intersection_in": 2,
                  "intersection_out": 0,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 48.240073,
                    "longitude": -101.321783
                  },
                  "bearings": [0, 90, 270],
                  "classes": [],
                  "entry": [true, true, false],
                  "intersection_in": 2,
                  "intersection_out": 1,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 48.240073,
                    "longitude": -101.321158
                  },
                  "bearings": [90, 270],
                  "classes": [],
                  "entry": [true, false],
                  "intersection_in": 1,
                  "intersection_out": 0,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 48.240073,
                    "longitude": -101.320443
                  },
                  "bearings": [0, 89, 180, 270],
                  "classes": [],
                  "entry": [true, true, true, false],
                  "intersection_in": 3,
                  "intersection_out": 1,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 48.240078,
                    "longitude": -101.319769
                  },
                  "bearings": [89, 269],
                  "classes": [],
                  "entry": [true, false],
                  "intersection_in": 1,
                  "intersection_out": 0,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 48.240083,
                    "longitude": -101.31907
                  },
                  "bearings": [0, 90, 180, 269],
                  "classes": [],
                  "entry": [true, true, true, false],
                  "intersection_in": 3,
                  "intersection_out": 1,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 48.240083,
                    "longitude": -101.318416
                  },
                  "bearings": [92, 270],
                  "classes": [],
                  "entry": [true, false],
                  "intersection_in": 1,
                  "intersection_out": 0,
                  "lanes": [
                    {
                      "indications": ["left", "straight"],
                      "valid": true
                    },
                    {
                      "indications": ["straight", "right"],
                      "valid": true
                    }
                  ]
                },
                {
                  "location": {
                    "latitude": 48.24007,
                    "longitude": -101.317715
                  },
                  "bearings": [0, 90, 182, 272],
                  "classes": [],
                  "entry": [true, true, true, false],
                  "intersection_in": 3,
                  "intersection_out": 1,
                  "lanes": [
                    {
                      "indications": ["left", "straight"],
                      "valid": true
                    },
                    {
                      "indications": ["straight", "right"],
                      "valid": true
                    }
                  ]
                },
                {
                  "location": {
                    "latitude": 48.240073,
                    "longitude": -101.31689
                  },
                  "bearings": [90, 270],
                  "classes": [],
                  "entry": [true, false],
                  "intersection_in": 1,
                  "intersection_out": 0,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 48.240075,
                    "longitude": -101.316357
                  },
                  "bearings": [91, 270],
                  "classes": [],
                  "entry": [true, false],
                  "intersection_in": 1,
                  "intersection_out": 0,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 48.240052,
                    "longitude": -101.31411
                  },
                  "bearings": [91, 271],
                  "classes": [],
                  "entry": [true, false],
                  "intersection_in": 1,
                  "intersection_out": 0,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 48.239988,
                    "longitude": -101.312393
                  },
                  "bearings": [113, 283],
                  "classes": [],
                  "entry": [true, false],
                  "intersection_in": 1,
                  "intersection_out": 0,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 48.239792,
                    "longitude": -101.311883
                  },
                  "bearings": [30, 137, 307],
                  "classes": [],
                  "entry": [true, true, false],
                  "intersection_in": 2,
                  "intersection_out": 1,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 48.238767,
                    "longitude": -101.310242
                  },
                  "bearings": [98, 288],
                  "classes": [],
                  "entry": [true, false],
                  "intersection_in": 1,
                  "intersection_out": 0,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 48.238746,
                    "longitude": -101.309776
                  },
                  "bearings": [79, 270],
                  "classes": [],
                  "entry": [true, false],
                  "intersection_in": 1,
                  "intersection_out": 0,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 48.238796,
                    "longitude": -101.309395
                  },
                  "bearings": [78, 259],
                  "classes": [],
                  "entry": [true, false],
                  "intersection_in": 1,
                  "intersection_out": 0,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 48.23887,
                    "longitude": -101.308868
                  },
                  "bearings": [0, 87, 258],
                  "classes": [],
                  "entry": [true, true, false],
                  "intersection_in": 2,
                  "intersection_out": 1,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 48.238881,
                    "longitude": -101.308524
                  },
                  "bearings": [89, 268],
                  "classes": [],
                  "entry": [true, false],
                  "intersection_in": 1,
                  "intersection_out": 0,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 48.238885,
                    "longitude": -101.30818
                  },
                  "bearings": [1, 91, 177, 269],
                  "classes": [],
                  "entry": [true, true, true, false],
                  "intersection_in": 3,
                  "intersection_out": 1,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 48.238867,
                    "longitude": -101.306858
                  },
                  "bearings": [0, 91, 182, 271],
                  "classes": [],
                  "entry": [true, true, true, false],
                  "intersection_in": 3,
                  "intersection_out": 1,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 48.23885,
                    "longitude": -101.305234
                  },
                  "bearings": [1, 90, 180, 271],
                  "classes": [],
                  "entry": [true, true, true, false],
                  "intersection_in": 3,
                  "intersection_out": 1,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 48.238853,
                    "longitude": -101.303712
                  },
                  "bearings": [0, 91, 180, 270],
                  "classes": [],
                  "entry": [true, true, true, false],
                  "intersection_in": 3,
                  "intersection_out": 1,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 48.238845,
                    "longitude": -101.303072
                  },
                  "bearings": [91, 271],
                  "classes": [],
                  "entry": [true, false],
                  "intersection_in": 1,
                  "intersection_out": 0,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 48.238844,
                    "longitude": -101.30297
                  },
                  "bearings": [91, 271],
                  "classes": [],
                  "entry": [true, false],
                  "intersection_in": 1,
                  "intersection_out": 0,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 48.238834,
                    "longitude": -101.302216
                  },
                  "bearings": [0, 90, 180, 271],
                  "classes": [],
                  "entry": [true, true, true, false],
                  "intersection_in": 3,
                  "intersection_out": 1,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 48.238835,
                    "longitude": -101.301468
                  },
                  "bearings": [90, 270],
                  "classes": [],
                  "entry": [true, false],
                  "intersection_in": 1,
                  "intersection_out": 0,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 48.238837,
                    "longitude": -101.300708
                  },
                  "bearings": [88, 180, 270, 359],
                  "classes": [],
                  "entry": [true, true, false, true],
                  "intersection_in": 2,
                  "intersection_out": 0,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 48.239261,
                    "longitude": -101.298855
                  },
                  "bearings": [58, 172, 240, 352],
                  "classes": [],
                  "entry": [true, true, false, true],
                  "intersection_in": 2,
                  "intersection_out": 0,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 48.239446,
                    "longitude": -101.298403
                  },
                  "bearings": [59, 238],
                  "classes": [],
                  "entry": [true, false],
                  "intersection_in": 1,
                  "intersection_out": 0,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 48.239773,
                    "longitude": -101.297534
                  },
                  "bearings": [66, 243, 341],
                  "classes": [],
                  "entry": [true, false, true],
                  "intersection_in": 1,
                  "intersection_out": 0,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 48.239938,
                    "longitude": -101.296925
                  },
                  "bearings": [81, 166, 250],
                  "classes": [],
                  "entry": [true, true, false],
                  "intersection_in": 2,
                  "intersection_out": 0,
                  "lanes": []
                }
              ],
              "road_shield_type": {},
              "driving_side": "right"
            },
            {
              "geometry": "evi_{Aj|re`EwPg@",
              "start_location": {
                "latitude": 48.239987,
                "longitude": -101.296086
              },
              "end_location": {
                "latitude": 48.240271,
                "longitude": -101.296066
              },
              "distance": {
                "value": 31
              },
              "duration": {
                "value": 10
              },
              "maneuver": {
                "instruction": "Use the left lane to turn left onto N Broadway (US-83 N), then you will arrive",
                "voice_instruction": [
                  {
                    "distance_along_geometry": 3000,
                    "unit": "meters",
                    "instruction": "In 3.0 kilometer, Use the left lane to turn left onto N Broadway (US-83 N)"
                  },
                  {
                    "distance_along_geometry": 200,
                    "unit": "meters",
                    "instruction": "In 200 meters, Use the left lane to turn left onto N Broadway (US-83 N)"
                  },
                  {
                    "distance_along_geometry": 169,
                    "unit": "meters",
                    "instruction": "In 200 meters, You will arrive"
                  },
                  {
                    "distance_along_geometry": 50,
                    "unit": "meters",
                    "instruction": "Use the left lane to turn left onto N Broadway (US-83 N), then you will arrive"
                  }
                ],
                "bearing_before": 89,
                "bearing_after": 3,
                "bearing": 0,
                "coordinate": {
                  "latitude": 48.239987,
                  "longitude": -101.296086
                },
                "maneuver_type": "turn",
                "modifier": "left"
              },
              "name": "N Broadway",
              "intersections": [
                {
                  "location": {
                    "latitude": 48.239987,
                    "longitude": -101.296086
                  },
                  "bearings": [3, 86, 183, 269],
                  "classes": [],
                  "entry": [true, true, true, false],
                  "intersection_in": 3,
                  "intersection_out": 0,
                  "lanes": [
                    {
                      "indications": ["left"],
                      "valid": true
                    },
                    {
                      "indications": ["straight"],
                      "valid": false
                    },
                    {
                      "indications": ["right"],
                      "valid": false
                    }
                  ]
                }
              ],
              "reference": "US-83 N",
              "road_shield_type": {
                "label": "US-83 N"
              },
              "driving_side": "right"
            },
            {
              "geometry": "}gj_{Ab{re`E??",
              "start_location": {
                "latitude": 48.240271,
                "longitude": -101.296066
              },
              "end_location": {
                "latitude": 48.240271,
                "longitude": -101.296066
              },
              "distance": {
                "value": 0
              },
              "duration": {
                "value": 0
              },
              "maneuver": {
                "instruction": "You have arrived at N Broadway",
                "voice_instruction": [
                  {
                    "distance_along_geometry": 50,
                    "unit": "meters",
                    "instruction": "You have arrived at N Broadway"
                  }
                ],
                "bearing_before": 3,
                "bearing_after": 0,
                "bearing": 0,
                "coordinate": {
                  "latitude": 48.240271,
                  "longitude": -101.296066
                },
                "maneuver_type": "arrive"
              },
              "name": "N Broadway",
              "intersections": [
                {
                  "location": {
                    "latitude": 48.240271,
                    "longitude": -101.296066
                  },
                  "bearings": [183],
                  "classes": [],
                  "entry": [true],
                  "intersection_in": 0,
                  "intersection_out": 0,
                  "lanes": []
                }
              ],
              "reference": "US-83 N",
              "road_shield_type": {
                "label": "US-83 N"
              },
              "driving_side": "right"
            }
          ]
        }
      ]
    }
  ]
}
```

### GET Request Example 3

Next we will create a navigation flexible request for a trip where we want to avoid sharp turns which can be potentially dangerous for a truck to complete. We configure:

- an `origin` and a `destination`
- `mode` as `truck`
- `avoid` option set to “sharp_turn”

#### Request

```bash
curl --location 'https://api.nextbillion.io/navigation/json?key=<your_api_key>&origin=32.75800890,-117.14624755&destination=32.75777097,-117.14546261&mode=truck&option=flexible&avoid=sharp_turn'
```

#### Response

```json
{
  "status": "Ok",
  "routes": [
    {
      "geometry": "qnkn}@ng`m~EqDBC?yO@cE@iG@qLBE?iODE?@zBIvPHdPGtg@ztA?D?h]CB?i@qQLkb@AuE?EAgJCmB?IJ_C?AkBuBs@k@}@o@KKq@i@m@s@GMiA}AqMoXAA_EkI",
      "distance": 660.833,
      "duration": 127.174,
      "start_location": {
        "latitude": 32.758009,
        "longitude": -117.146248
      },
      "end_location": {
        "latitude": 32.757771,
        "longitude": -117.145463
      },
      "legs": [
        {
          "distance": {
            "value": 660
          },
          "duration": {
            "value": 127
          },
          "start_location": {
            "latitude": 32.758009,
            "longitude": -117.146248
          },
          "end_location": {
            "latitude": 32.757771,
            "longitude": -117.145463
          },
          "steps": [
            {
              "geometry": "qnkn}@ng`m~EqDBC?yO@cE@iG@qLBE?iODE?",
              "start_location": {
                "latitude": 32.758009,
                "longitude": -117.146248
              },
              "end_location": {
                "latitude": 32.759084,
                "longitude": -117.146258
              },
              "distance": {
                "value": 118
              },
              "duration": {
                "value": 19
              },
              "maneuver": {
                "instruction": "Head north on Park Blvd",
                "voice_instruction": [],
                "bearing_before": 0,
                "bearing_after": 359,
                "bearing": 0,
                "coordinate": {
                  "latitude": 32.758009,
                  "longitude": -117.146248
                },
                "maneuver_type": "depart"
              },
              "name": "Park Blvd",
              "intersections": [
                {
                  "location": {
                    "latitude": 32.758009,
                    "longitude": -117.146248
                  },
                  "bearings": [359],
                  "classes": [],
                  "entry": [true],
                  "intersection_in": 0,
                  "intersection_out": 0,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 32.7581,
                    "longitude": -117.14625
                  },
                  "bearings": [179, 360],
                  "classes": [],
                  "entry": [false, true],
                  "intersection_in": 0,
                  "intersection_out": 1,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 32.758467,
                    "longitude": -117.146252
                  },
                  "bearings": [180, 360],
                  "classes": [],
                  "entry": [false, true],
                  "intersection_in": 0,
                  "intersection_out": 1,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 32.75882,
                    "longitude": -117.146255
                  },
                  "bearings": [180, 359],
                  "classes": [],
                  "entry": [false, true],
                  "intersection_in": 0,
                  "intersection_out": 1,
                  "lanes": []
                }
              ],
              "road_shield_type": {},
              "driving_side": "right"
            },
            {
              "geometry": "wqmn}@bh`m~E@zBIvPHdPGtg@",
              "start_location": {
                "latitude": 32.759084,
                "longitude": -117.146258
              },
              "end_location": {
                "latitude": 32.759087,
                "longitude": -117.14753
              },
              "distance": {
                "value": 120
              },
              "duration": {
                "value": 21
              },
              "maneuver": {
                "instruction": "Turn left onto Monroe Ave",
                "voice_instruction": [
                  {
                    "distance_along_geometry": 50,
                    "unit": "meters",
                    "instruction": "Turn left onto Monroe Ave"
                  }
                ],
                "bearing_before": 359,
                "bearing_after": 269,
                "bearing": 0,
                "coordinate": {
                  "latitude": 32.759084,
                  "longitude": -117.146258
                },
                "maneuver_type": "turn",
                "modifier": "left"
              },
              "name": "Monroe Ave",
              "intersections": [
                {
                  "location": {
                    "latitude": 32.759084,
                    "longitude": -117.146258
                  },
                  "bearings": [1, 89, 179, 269],
                  "classes": [],
                  "entry": [true, true, false, true],
                  "intersection_in": 2,
                  "intersection_out": 3,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 32.759083,
                    "longitude": -117.14632
                  },
                  "bearings": [89, 271],
                  "classes": [],
                  "entry": [false, true],
                  "intersection_in": 0,
                  "intersection_out": 1,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 32.759088,
                    "longitude": -117.146604
                  },
                  "bearings": [91, 269],
                  "classes": [],
                  "entry": [false, true],
                  "intersection_in": 0,
                  "intersection_out": 1,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 32.759083,
                    "longitude": -117.146879
                  },
                  "bearings": [1, 89, 180, 270],
                  "classes": [],
                  "entry": [true, false, true, true],
                  "intersection_in": 1,
                  "intersection_out": 3,
                  "lanes": []
                }
              ],
              "road_shield_type": {},
              "driving_side": "right"
            },
            {
              "geometry": "}qmn}@rwbm~EztA?D?h]CB?",
              "start_location": {
                "latitude": 32.759087,
                "longitude": -117.14753
              },
              "end_location": {
                "latitude": 32.757223,
                "longitude": -117.147528
              },
              "distance": {
                "value": 207
              },
              "duration": {
                "value": 46
              },
              "maneuver": {
                "instruction": "Turn left onto North Ave",
                "voice_instruction": [
                  {
                    "distance_along_geometry": 50,
                    "unit": "meters",
                    "instruction": "Turn left onto North Ave"
                  }
                ],
                "bearing_before": 270,
                "bearing_after": 180,
                "bearing": 0,
                "coordinate": {
                  "latitude": 32.759087,
                  "longitude": -117.14753
                },
                "maneuver_type": "turn",
                "modifier": "left"
              },
              "name": "North Ave",
              "intersections": [
                {
                  "location": {
                    "latitude": 32.759087,
                    "longitude": -117.14753
                  },
                  "bearings": [0, 90, 180, 270],
                  "classes": [],
                  "entry": [true, false, true, true],
                  "intersection_in": 1,
                  "intersection_out": 2,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 32.75771,
                    "longitude": -117.14753
                  },
                  "bearings": [0, 90, 180, 270],
                  "classes": [],
                  "entry": [false, false, true, true],
                  "intersection_in": 0,
                  "intersection_out": 2,
                  "lanes": []
                }
              ],
              "road_shield_type": {},
              "driving_side": "right"
            },
            {
              "geometry": "m}in}@nwbm~Ei@qQLkb@AuE?EAgJCmB?IJ_C?A",
              "start_location": {
                "latitude": 32.757223,
                "longitude": -117.147528
              },
              "end_location": {
                "latitude": 32.757235,
                "longitude": -117.14625
              },
              "distance": {
                "value": 119
              },
              "duration": {
                "value": 24
              },
              "maneuver": {
                "instruction": "Turn left onto Meade Ave",
                "voice_instruction": [
                  {
                    "distance_along_geometry": 200,
                    "unit": "meters",
                    "instruction": "In 200 meters, Turn left onto Meade Ave"
                  },
                  {
                    "distance_along_geometry": 50,
                    "unit": "meters",
                    "instruction": "Turn left onto Meade Ave"
                  }
                ],
                "bearing_before": 180,
                "bearing_after": 85,
                "bearing": 0,
                "coordinate": {
                  "latitude": 32.757223,
                  "longitude": -117.147528
                },
                "maneuver_type": "end of road",
                "modifier": "left"
              },
              "name": "Meade Ave",
              "intersections": [
                {
                  "location": {
                    "latitude": 32.757223,
                    "longitude": -117.147528
                  },
                  "bearings": [0, 85, 269],
                  "classes": [],
                  "entry": [false, true, true],
                  "intersection_in": 0,
                  "intersection_out": 1,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 32.757237,
                    "longitude": -117.146665
                  },
                  "bearings": [89, 271],
                  "classes": [],
                  "entry": [true, false],
                  "intersection_in": 1,
                  "intersection_out": 0,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 32.757238,
                    "longitude": -117.146555
                  },
                  "bearings": [90, 269],
                  "classes": [],
                  "entry": [true, false],
                  "intersection_in": 1,
                  "intersection_out": 0,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 32.757241,
                    "longitude": -117.146315
                  },
                  "bearings": [96, 269],
                  "classes": [],
                  "entry": [true, false],
                  "intersection_in": 1,
                  "intersection_out": 0,
                  "lanes": []
                }
              ],
              "road_shield_type": {},
              "driving_side": "right"
            },
            {
              "geometry": "e~in}@rg`m~EkBuBs@k@}@o@KKq@i@m@s@GMiA}AqMoXAA_EkI",
              "start_location": {
                "latitude": 32.757235,
                "longitude": -117.14625
              },
              "end_location": {
                "latitude": 32.757771,
                "longitude": -117.145463
              },
              "distance": {
                "value": 95
              },
              "duration": {
                "value": 15
              },
              "maneuver": {
                "instruction": "Use the left lane to make a slight left onto Mission Ave, then you will arrive",
                "voice_instruction": [
                  {
                    "distance_along_geometry": 105,
                    "unit": "meters",
                    "instruction": "In 200 meters, You will arrive"
                  },
                  {
                    "distance_along_geometry": 50,
                    "unit": "meters",
                    "instruction": "Use the left lane to make a slight left onto Mission Ave, then you will arrive"
                  }
                ],
                "bearing_before": 96,
                "bearing_after": 39,
                "bearing": 0,
                "coordinate": {
                  "latitude": 32.757235,
                  "longitude": -117.14625
                },
                "maneuver_type": "turn",
                "modifier": "slight left"
              },
              "name": "Mission Ave",
              "intersections": [
                {
                  "location": {
                    "latitude": 32.757235,
                    "longitude": -117.14625
                  },
                  "bearings": [1, 39, 90, 180, 276],
                  "classes": [],
                  "entry": [true, true, true, true, false],
                  "intersection_in": 4,
                  "intersection_out": 1,
                  "lanes": [
                    {
                      "indications": ["left"],
                      "valid": true
                    },
                    {
                      "indications": ["straight", "right"],
                      "valid": false
                    }
                  ]
                },
                {
                  "location": {
                    "latitude": 32.757346,
                    "longitude": -117.146145
                  },
                  "bearings": [40, 219],
                  "classes": [],
                  "entry": [true, false],
                  "intersection_in": 1,
                  "intersection_out": 0,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 32.7574,
                    "longitude": -117.146092
                  },
                  "bearings": [53, 220],
                  "classes": [],
                  "entry": [true, false],
                  "intersection_in": 1,
                  "intersection_out": 0,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 32.757675,
                    "longitude": -117.145629
                  },
                  "bearings": [55, 236, 359],
                  "classes": [],
                  "entry": [true, false, true],
                  "intersection_in": 1,
                  "intersection_out": 0,
                  "lanes": []
                }
              ],
              "road_shield_type": {},
              "driving_side": "right"
            },
            {
              "geometry": "u_kn}@lv~l~E??",
              "start_location": {
                "latitude": 32.757771,
                "longitude": -117.145463
              },
              "end_location": {
                "latitude": 32.757771,
                "longitude": -117.145463
              },
              "distance": {
                "value": 0
              },
              "duration": {
                "value": 0
              },
              "maneuver": {
                "instruction": "You have arrived at Mission Ave",
                "voice_instruction": [
                  {
                    "distance_along_geometry": 50,
                    "unit": "meters",
                    "instruction": "You have arrived at Mission Ave"
                  }
                ],
                "bearing_before": 55,
                "bearing_after": 0,
                "bearing": 0,
                "coordinate": {
                  "latitude": 32.757771,
                  "longitude": -117.145463
                },
                "maneuver_type": "arrive"
              },
              "name": "Mission Ave",
              "intersections": [
                {
                  "location": {
                    "latitude": 32.757771,
                    "longitude": -117.145463
                  },
                  "bearings": [235],
                  "classes": [],
                  "entry": [true],
                  "intersection_in": 0,
                  "intersection_out": 0,
                  "lanes": []
                }
              ],
              "road_shield_type": {},
              "driving_side": "right"
            }
          ]
        }
      ]
    }
  ]
}
```

### POST Request Example

Following is a Navigation Flexible POST request configured for the same scenario from the example above:

```bash
curl --location --request POST 'https://api.nextbillion.io/navigation/json?key=<your_api_key>&option=flexible' \
--header 'Content-Type: application/json' \
--data-raw '{
    "origin":"34.05605379,-118.24495386",
    "destination":"34.05037935,-118.24087972",
    "departure_time":1688389200,
    "mode":"truck"
}'
```

## Navigation Fast API

The Navigation Fast API is built for real-time, **high-volume** navigation, prioritizing **low-latency**. It provides core navigation features for common use cases.

The Fast endpoint accounts for **historical traffic** to ensure timely routing and prevent delays under normal conditions. It supports both car and truck modes, with default truck routing parameters included. Users can also choose to avoid highways, tolls, and ferries, request alternative routes, and utilize intervening waypoints. Additionally, it offers curbside approach routing, which is ideal for precise pickup/drop-off needs in ride-hailing, delivery, or fleet applications.

> _We recommend using the [Navigation Flexible API](#navigation-flexible-api) for custom navigation requirements or if support for advanced features is essential._

GET

https://api.nextbillion.io/navigation/json?key={your_api_key}

> _Use the GET method when the total number of `waypoints` is 50 or less. In case of `waypoints` more than 50, we recommend using the POST method._

### Request Parameters

| Name                  | Required | Format and Usage                                                                                                                                                            | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| --------------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `key`                 | Yes      | Type: `string`<br>Format: `32 character alphanumeric string`<br>Example: `key=API_KEY`                                                                                      | A key is a unique identifier that is required to authenticate a request to the API.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `origin`              | No       | Type: `string`<br>Format: `latitude,longitude`<br>Example: `origin=41.349302,2.136480`                                                                                      | `origin` is the starting point of your route. Ensure that `origin` is a routable land location. Please note that this parameter is mandatory if the geometry parameter is not given.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| `destination`         | No       | Type: `string`<br>Format: `latitude,longitude`<br>Example: `destination=41.349302,2.136480`                                                                                 | `destination` is the ending point of your route. Ensure that the `destination` is a routable land location. Please note that this parameter is mandatory if the `original_shape` parameter is not given.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `mode`                | No       | Type: `string`<br>Default: `car`<br>Allowed values: `car`, `truck`<br>Example: `mode=car`                                                                                   | Set which driving mode the service should use to determine a route. For example, if you use `car`, the API will return a route that a car can take. Using `truck` will return a route a truck can use, taking into account appropriate truck routing restrictions. When `mode=truck`, the default truck dimensions applied are listed [here](https://docs.nextbillion.ai/routing/navigation-api#default-truck-dimensions-for-fast-api). Please use the [Navigation Flexible](https://docs.nextbillion.ai/routing/navigation-api#navigation-flexible-api) version if you want to use custom truck dimensions.<br> \[**Note:** Only the `car` profile is enabled by default. Please note that customized profiles (including `truck`) might not be available for all regions. Please contact your [NextBillion.ai](https://nextbillion.ai) account manager, sales representative or reach out at [support@nextbillion.ai](mailto:support@nextbillion.ai) in case you need additional profiles\] |
| `waypoints`           | No       | Type: `string`<br>Format: `latitude_1,longitude_1\|latitude_2,longitude_2\|...`<br>Example: `waypoints=41.349302,2.136480\|41.349303,2.136481`                              | `waypoints` are coordinates along the route between the `origin` and `destination`. It is a pipe-separated list of coordinate pairs. Please note that all `waypoints` are treated as mandatory route points and the route will arrive at each `waypoints` in the sequence they are provided in the input request.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| `approaches`          | No       | Type: `string`<br>Default: `unrestricted`<br>Format: `approaches_1;approaches_2;...`<br>Allowed values: `unrestricted`, `curb`<br>Example: `approaches=unrestricted;;curb;` | A semicolon-separated list indicating the side of the road from which to approach `waypoints` in a requested route. When set to `unrestricted` a route can arrive at the waypoint from either side of the road and when set to `curb` the route will arrive at the waypoint on the driving side of the region. Please note the number of values provided must be one more than the number of `waypoints`. The last value of `approaches` will determine the approach for the `destination`. However, you can skip a coordinate and show its position in the list with the `;` separator.                                                                                                                                                                                                                                                                                                                                                                                                      |
| `geometry`            | No       | Type: `string`<br>Default: `polyline`<br>Allowed values: `polyline`, `polyline6`, `geojson`<br>Example: `geometry=polyline`                                                 | Sets the output format of the route geometry in the response. On providing `polyline` and `polyline6` as input, respective encoded geometry is returned. However, when `geojson` is provided as the input value, `polyline` encoded geometry is returned in the response along with the geojson details of the route.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `lang`                | No       | Type: `string`<br>Example: `lang=fr`                                                                                                                                        | Language of the turn-by-turn instructions for route guidance. This parameter accepts two-lettered [ISO 639-1 codes](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) to identify the language for instructions. Currently, Navigation API supports English(en), Spanish(es), French(fr), Mandarin(zh), German(de), Dutch(nl), Catalan(ca) and other languages available in [OSRM translations](https://github.com/Project-OSRM/osrm-text-instructions/tree/master/languages/translations). Please check with your [NextBillion.ai](https://nextbillion.ai) account manager, sales representative or reach out at [support@nextbillion.ai](mailto:support@nextbillion.ai) for additional languages.                                                                                                                                                                                                                                                                                      |
| `alternatives`        | No       | Type: `boolean`<br>Default: `false`                                                                                                                                         | When `true` the API will return alternate routes. The default value is `false`. The `alternatives` is effective only when there are no `waypoints` included in the request. You can set the number of alternate routes to be returned in the `altcount` property.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| `altcount`            | No       | Type: `integer`<br>Default: `3`<br>Example: `altcount=3`                                                                                                                    | Sets the number of alternative routes to return. It is effective only when `alternatives` is `true`. Please note that adding alternative route count does not guarantee matching number of routes to be returned if potential alternative routes do not exist.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `avoid`               | No       | Type: `string`<br>Default: `ferry`<br>Format: `value_1\|value_2\|...`<br>Allowed values: `toll`, `ferry`, `highway`, `none`<br>Example: `avoid=highway\|toll`               | Setting this will ensure the route avoids ferries, tolls, highways or nothing. Multiple values should be separated by a pipe (\|). Please note that:<br> _ If `none` is provided along with other values, an error is returned as a valid route is not feasible.<br> _ If this parameter is not provided in the input, ferries are set to be avoided by default.<br> \* When this parameter is provided, only the mentioned objects are avoided.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `overview`            | No       | Type: `string`<br>Default: `full`<br>Allowed values: `full`, `simplified`, `false`<br>Example: `overview=full`                                                              | Specify the verbosity of route geometry. When set to `full`, the most detailed geometry available is returned. When set to `simplified`, a simplified version of the full geometry is returned. No overview geometry is returned when set to `false`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `bearings`            | No       | Type: `string`<br>Default: `none`<br>Format: `degree0,range0;degree1,range1;...`<br>Example: `bearings=0,180;0,180`                                                         | Limits the search to road segments with given bearing, in degrees, towards true north in clockwise direction. Each `bearings` should be in the format of `degree,range`, where the `degree` should be a value between \[0, 360\] and `range` should be a value between \[0, 180\]. Please note that the number of `bearings` should be two more than the number of `waypoints`. This is to account for the bearing of `origin` and `destination`. If a route can approach a `waypoint` or the `destination` from any direction, the bearing for that point can be specified as "0,180".                                                                                                                                                                                                                                                                                                                                                                                                       |
| `original_shape`      | No       | Type: `string`<br>Example: `original_shape=sbp}_Almgp`FnLuToKmKviB{eDlcGhpFvj@qbAwoA_mA`                                                                                    | Takes a route geometry as input and returns the navigation information for that route. Accepts `polyline` and `polyline6` encoded geometry as input. `original_shape_type` becomes mandatory when `original_shape` is used. If this parameter is provided, the only other parameters which will be considered are `original_shape_type`, `lang`, `geometry`. The rest of the parameters in the input request will be ignored. Please note overview verbosity will always be `full` when using this parameter.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `original_shape_type` | No       | Type: `string`<br>Allowed values: `polyline`, `polyline6`<br>Example: `original_shape_type=polyline`                                                                        | Specify the encoding format of route geometry provided in the request using `original_shape` parameter. Please note that an error is returned when this parameter is not specified while an input is added to `original_shape` parameter.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |

### POST Request

The parameters and their properties for the Navigation Fast POST method are the same as listed in the [Request Parameters](#request-parameters-1) section. The `key` is passed as a request parameter and the rest of the parameters should be included in the Request Body. An example of a POST request is added in the [Sample Queries - Navigation Fast section below](#sample-queries-navigation-fast)

POST

https://api.nextbillion.io/navigation/json?key={your_api_key}

### Response Schema

| Field                                                                          | Type             | Description                                                                                                                                                                                                                                                                    |
| ------------------------------------------------------------------------------ | ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `status`                                                                       | string           | A string indicating the state of the response. On normal responses, the value will be `Ok`. Indicative HTTP error codes are returned for different errors. See the [API Errors Codes](#api-error-codes) section below for more information.                                    |
| `msg`                                                                          | string           | Displays the error message in case of a failed request or operation. Please note that this parameter is not returned in the response in case of a successful request.                                                                                                          |
| `warning`                                                                      | array of string  | warning when facing unexpected behaviour                                                                                                                                                                                                                                       |
| `routes`                                                                       | array of object  | An array of objects describing different possible routes from the starting location to the destination. Each object represents one route.                                                                                                                                      |
| `routes[].geometry`                                                            | string           | Encoded geometry of the returned route as per the selected format in `geometry` and specified `overview` verbosity. Please note the `overview` will always be `full` when `original_shape` parameter is used in the input request.                                             |
| `routes[].distance`                                                            | number           | The distance, in meters, of the complete trip.                                                                                                                                                                                                                                 |
| `routes[].distance_full`                                                       | number           | The total distance of the route, including additional details such as extra maneuvers or loops, in meters.                                                                                                                                                                     |
| `routes[].duration`                                                            | integer          | The duration, in seconds, of the complete trip.                                                                                                                                                                                                                                |
| `routes[].start_location`                                                      | object           | Location coordinates of the point where the route starts.                                                                                                                                                                                                                      |
| `routes[].start_location.latitude`                                             | number           | Latitude of the`start_location`.                                                                                                                                                                                                                                               |
| `routes[].start_location.longitude`                                            | number           | Longitude of the `start_location`.                                                                                                                                                                                                                                             |
| `routes[].end_location`                                                        | object           | Location coordinates of the point where the route ends.                                                                                                                                                                                                                        |
| `routes[].end_location.latitude`                                               | number           | Latitude of the `end_location`.                                                                                                                                                                                                                                                |
| `routes[].end_location.longitude`                                              | number           | Longitude of the `end_location`.                                                                                                                                                                                                                                               |
| `routes[].legs`                                                                | array of object  | An array of objects returning the details about each `leg` of the route. `waypoints` split the route into legs.                                                                                                                                                                |
| `routes[].legs[].distance`                                                     | object           | An object containing leg distance value, in meters.                                                                                                                                                                                                                            |
| `routes[].legs[].distance.value`                                               | integer          | -                                                                                                                                                                                                                                                                              |
| `routes[].legs[].duration`                                                     | object           | An object containing leg duration value, in seconds.                                                                                                                                                                                                                           |
| `routes[].legs[].duration.value`                                               | integer          | -                                                                                                                                                                                                                                                                              |
| `routes[].legs[].start_location`                                               | object           | Location coordinates of the point where the leg starts.                                                                                                                                                                                                                        |
| `routes[].legs[].start_location.latitude`                                      | number           | Latitude of `start_location` of the `leg`.                                                                                                                                                                                                                                     |
| `routes[].legs[].start_location.longitude`                                     | number           | Longitude of `start_location` of the `leg`.                                                                                                                                                                                                                                    |
| `routes[].legs[].end_location`                                                 | object           | Location coordinates of the point where the leg ends.                                                                                                                                                                                                                          |
| `routes[].legs[].end_location.latitude`                                        | number           | Latitude of `end_location` of the `leg`.                                                                                                                                                                                                                                       |
| `routes[].legs[].end_location.longitude`                                       | number           | Longitude of `end_location` of the `leg`.                                                                                                                                                                                                                                      |
| `routes[].legs[].steps`                                                        | array of object  | An array of step objects containing turn-by-turn guidance for easy navigation.                                                                                                                                                                                                 |
| `routes[].legs[].steps[].geometry`                                             | string           | Encoded geometry of the `step` in the selected format.                                                                                                                                                                                                                         |
| `routes[].legs[].steps[].start_location`                                       | object           | Location coordinates of the point where the `step` starts.                                                                                                                                                                                                                     |
| `routes[].legs[].steps[].start_location.latitude`                              | number           | Latitude of `start_location` of the `step`.                                                                                                                                                                                                                                    |
| `routes[].legs[].steps[].start_location.longitude`                             | number           | Longitude of `start_location` of the `step`.                                                                                                                                                                                                                                   |
| `routes[].legs[].steps[].end_location`                                         | object           | Location coordinates of the point where the `step` ends.                                                                                                                                                                                                                       |
| `routes[].legs[].steps[].end_location.latitude`                                | number           | Latitude of the `end_location` of the `step`.                                                                                                                                                                                                                                  |
| `routes[].legs[].steps[].end_location.longitude`                               | number           | Longitude of the `end_location` of the `step`.                                                                                                                                                                                                                                 |
| `routes[].legs[].steps[].distance`                                             | object           | An object containing step distance value, in meters.                                                                                                                                                                                                                           |
| `routes[].legs[].steps[].distance.value`                                       | integer          | -                                                                                                                                                                                                                                                                              |
| `routes[].legs[].steps[].duration`                                             | object           | An object containing step duration value, in seconds.                                                                                                                                                                                                                          |
| `routes[].legs[].steps[].duration.value`                                       | integer          | -                                                                                                                                                                                                                                                                              |
| `routes[].legs[].steps[].maneuver`                                             | object           | An object with maneuver details for the `step`.                                                                                                                                                                                                                                |
| `routes[].legs[].steps[].maneuver.instruction`                                 | string           | A text instruction describing the maneuver to be performed. It provides guidance on the action to take at the maneuver location, such as "Turn left," "Go straight," "Exit the roundabout," etc.                                                                               |
| `routes[].legs[].steps[].maneuver.voice_instruction`                           | array of object  | An array of voice instruction objects associated with the `maneuver`. Each object provides additional details about the voice instruction, including the distance along the geometry where the instruction applies, the instruction text, and the unit of measurement.         |
| `routes[].legs[].steps[].maneuver.voice_instruction[].distance_along_geometry` | integer          | -                                                                                                                                                                                                                                                                              |
| `routes[].legs[].steps[].maneuver.voice_instruction[].instruction`             | string           | The guidance instructions for the upcoming `maneuver`                                                                                                                                                                                                                          |
| `routes[].legs[].steps[].maneuver.voice_instruction[].unit`                    | string           | Unit of the `distance_along_geometry` metric                                                                                                                                                                                                                                   |
| `routes[].legs[].steps[].maneuver.bearing_before`                              | number           | The clockwise angle from true north to the direction of travel immediately before the `maneuver`. Range of values is between 0-359.                                                                                                                                            |
| `routes[].legs[].steps[].maneuver.bearing_after`                               | number           | The clockwise angle from true north to the direction of travel immediately after the `maneuver`. Range of values is between 0-359.                                                                                                                                             |
| `routes[].legs[].steps[].maneuver.coordinate`                                  | object           | A coordinate pair describing the location of the `maneuver`.                                                                                                                                                                                                                   |
| `routes[].legs[].steps[].maneuver.coordinate.latitude`                         | number           | The latitude coordinate of the `maneuver`.                                                                                                                                                                                                                                     |
| `routes[].legs[].steps[].maneuver.coordinate.longitude`                        | number           | The longitude coordinate of the `maneuver`.                                                                                                                                                                                                                                    |
| `routes[].legs[].steps[].maneuver.coordinate.name`                             | string           | The name or description of the maneuver location.                                                                                                                                                                                                                              |
| `routes[].legs[].steps[].maneuver.maneuver_type`                               | string           | A string indicating the type of `maneuver`.                                                                                                                                                                                                                                    |
| `routes[].legs[].steps[].name`                                                 | string           | The name of the `step`.                                                                                                                                                                                                                                                        |
| `routes[].legs[].steps[].intersections`                                        | array of object  | An array of objects representing intersections (or cross-way) that the route passes by along the `step`. For every `step`, the very first `intersection` corresponds to the location of the `maneuver`. All intersections until the next `maneuver` are listed in this object. |
| `routes[].legs[].steps[].intersections[].location`                             | object           | A [longitude, latitude] pair describing the location of the intersection.                                                                                                                                                                                                      |
| `routes[].legs[].steps[].intersections[].location.latitude`                    | number           | The latitude coordinate of the `intersection`.                                                                                                                                                                                                                                 |
| `routes[].legs[].steps[].intersections[].location.longitude`                   | number           | The longitude coordinate of the `intersection`.                                                                                                                                                                                                                                |
| `routes[].legs[].steps[].intersections[].location.name`                        | string           | The name or description of the `intersection`.                                                                                                                                                                                                                                 |
| `routes[].legs[].steps[].intersections[].bearings`                             | array of integer | A list of bearing values (e.g. [0,90,180,270]) that are available at the intersection. The `bearings` describe all available roads at the intersection.                                                                                                                        |
| `routes[].legs[].steps[].intersections[].classes`                              | array of string  | An array of strings representing the classes or types of roads or paths at the intersection. The classes can indicate the road hierarchy, such as a motorway, primary road, secondary road, etc.                                                                               |
| `routes[].legs[].steps[].intersections[].entry`                                | array of boolean | A value of `true` indicates that the respective road could be entered on a valid route. `false` indicates that the turn onto the respective road would violate a restriction. Each entry value corresponds to the bearing angle at the same index.                             |
| `routes[].legs[].steps[].intersections[].intersection_in`                      | integer          | The number of incoming roads or paths at the `intersection`.                                                                                                                                                                                                                   |
| `routes[].legs[].steps[].intersections[].intersection_out`                     | integer          | The number of outgoing roads or paths from the `intersection`.                                                                                                                                                                                                                 |
| `routes[].legs[].steps[].intersections[].lanes`                                | array of object  | An array of lane objects representing the lanes available at the intersection. If no lane information is available for an `intersection`, the `lanes` property will not be present.                                                                                            |
| `routes[].legs[].steps[].intersections[].lanes[].indications`                  | array of string  | It represents actions associated with the lane. These indications describe the permitted maneuvers or directions that can be taken from the lane. Common indications include "turn left," "turn right," "go straight," "merge," "exit," etc.                                   |
| `routes[].legs[].steps[].intersections[].lanes[].valid`                        | boolean          | This indicates the validity of the lane. It specifies whether the lane is considered valid for making the indicated maneuver or if there are any restrictions or limitations associated with it.                                                                               |
| `routes[].legs[].steps[].reference`                                            | string           | A reference for the `step`.                                                                                                                                                                                                                                                    |
| `routes[].legs[].steps[].road_shield_type`                                     | object           | An object containing road shield information.                                                                                                                                                                                                                                  |
| `routes[].legs[].steps[].road_shield_type.label`                               | string           | A label identifying the inscription on the road shield, such as containing the road number.                                                                                                                                                                                    |
| `routes[].legs[].steps[].road_shield_type.image_url`                           | string           | The URL to fetch the road shield image.                                                                                                                                                                                                                                        |
| `routes[].legs[].steps[].driving_side`                                         | string           | Indicates the driving side of the road in case bidirectional traffic is allowed on the given segment. It can have two values: "left" & "right".                                                                                                                                |

### Default Truck Dimensions for Fast API

Following are the default truck dimensions used by the service to determine routes when mode=truck is used with Navigation Fast API endpoint:

| Dimension/Region | Height            | Width       | Length       | Weight        | Axles | Weight per Axle | Countries                                                                                                                                                                                                                                                                                                                                                                                                    |
| ---------------- | ----------------- | ----------- | ------------ | ------------- | ----- | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| North America    | 13 feet, 6 inches | 96 inches   | 48 feet      | 80,000 pounds | 5     | 34,000 pounds   | United States, Canada and Mexico                                                                                                                                                                                                                                                                                                                                                                             |
| Europe           | 4.00 meters       | 2.55 meters | 16.50 meters | 40 tonnes     | 5     | 11.5 tonnes     | Germany, France, Italy, Spain, United Kingdom, Netherlands, Belgium, Austria, Switzerland, Poland, Czechia, Portugal, Sweden, Norway, Denmark, Finland, Ireland, Greece, Hungary, Romania, Bulgaria, Slovakia, Slovenia, Croatia, Luxembourg, Estonia, Latvia, Lithuania, Serbia, Bosnia and Herzegovina, Montenegro, North Macedonia, Albania, Ukraine, Belarus, Moldova, Iceland, Malta, Cyprus and Russia |
| South America    | 4.00 meters       | 2.60 meters | 18.60 meters | 45 tonnes     | 6     | 11.5 tonnes     | Brazil, Argentina, Chile, Colombia, Peru, Venezuela, Ecuador, Bolivia, Paraguay, Uruguay, Guyana and Suriname                                                                                                                                                                                                                                                                                                |
| Oceania          | 4.30 meters       | 2.44 meters | 19.00 meters | 42.5 tonnes   | 6     | 11.5 tonnes     | Australia and New Zealand                                                                                                                                                                                                                                                                                                                                                                                    |
| Fallback         | 2.14 meters       | 1.83 meters | 5.19 meters  | 5 tonnes      | 2     | 2.5 tonnes      | Other Countries and Regions                                                                                                                                                                                                                                                                                                                                                                                  |

## Sample Queries-Navigation Fast

### GET Request Example 1

Let’s create a basic navigation request for a trip

- being made by a `car`
- between a given `origin` and a `destination`
- with a simplified `overview` of the route geometry

#### Request

```bash
https://api.nextbillion.io/navigation/json?key={your_api_key}&origin=34.05605379,-118.24495386&destination=34.05023939,-118.24885017&mode=car&overview=simplified
```

#### Response

```json
{
  "status": "Ok",
  "routes": [
    {
      "geometry": "svr}_A`ebp`F~p@jr@njAt_An|BjvBjj@w~@fhAl_A",
      "distance": 851.2,
      "duration": 213.8,
      "start_location": {
        "latitude": 34.056058,
        "longitude": -118.244961
      },
      "end_location": {
        "latitude": 34.050176,
        "longitude": -118.248739
      },
      "legs": [
        {
          "distance": {
            "value": 851
          },
          "duration": {
            "value": 213
          },
          "start_location": {
            "latitude": 34.056058,
            "longitude": -118.244961
          },
          "end_location": {
            "latitude": 34.050176,
            "longitude": -118.248739
          },
          "steps": [
            {
              "geometry": "svr}_A`ebp`FlDxCrFjGVzBhE`EtNxMdMlLlHxGfBpAhDj@dBnAxQ~PbPlN|@t@lOhM|g@ff@zKjKrD~DnUvSjNnM`CxBxBrBhS`R",
              "start_location": {
                "latitude": 34.056058,
                "longitude": -118.244961
              },
              "end_location": {
                "latitude": 34.052042,
                "longitude": -118.248728
              },
              "distance": {
                "value": 568
              },
              "duration": {
                "value": 122
              },
              "maneuver": {
                "instruction": "Head southwest on N Hill St",
                "voice_instruction": [],
                "bearing_before": 0,
                "bearing_after": 216,
                "coordinate": {
                  "latitude": 34.056058,
                  "longitude": -118.244961
                },
                "maneuver_type": "depart"
              },
              "name": "N Hill St",
              "intersections": [
                {
                  "location": {
                    "latitude": 34.056058,
                    "longitude": -118.244961
                  },
                  "bearings": [216],
                  "classes": [],
                  "entry": [],
                  "intersection_in": 0,
                  "intersection_out": 0,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 34.054919,
                    "longitude": -118.246027
                  },
                  "bearings": [30, 135, 225],
                  "classes": [],
                  "entry": [],
                  "intersection_in": 0,
                  "intersection_out": 2,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 34.054344,
                    "longitude": -118.246562
                  },
                  "bearings": [30, 135, 210, 315],
                  "classes": [],
                  "entry": [],
                  "intersection_in": 0,
                  "intersection_out": 2,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 34.053395,
                    "longitude": -118.247446
                  },
                  "bearings": [45, 225, 300],
                  "classes": [],
                  "entry": [],
                  "intersection_in": 0,
                  "intersection_out": 1,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 34.053189,
                    "longitude": -118.247644
                  },
                  "bearings": [45, 225, 315],
                  "classes": [],
                  "entry": [],
                  "intersection_in": 0,
                  "intersection_out": 1,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 34.053099,
                    "longitude": -118.24774
                  },
                  "bearings": [45, 135, 210, 315],
                  "classes": [],
                  "entry": [],
                  "intersection_in": 0,
                  "intersection_out": 2,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 34.052428,
                    "longitude": -118.248365
                  },
                  "bearings": [45, 135, 225],
                  "classes": [],
                  "entry": [],
                  "intersection_in": 0,
                  "intersection_out": 2,
                  "lanes": []
                }
              ],
              "road_shield_type": {}
            },
            {
              "geometry": "s{j}_Anpip`FlEeHdE{G^m@pC{E|IsOfMwS",
              "start_location": {
                "latitude": 34.052042,
                "longitude": -118.248728
              },
              "end_location": {
                "latitude": 34.051348,
                "longitude": -118.247708
              },
              "distance": {
                "value": 121
              },
              "duration": {
                "value": 46
              },
              "maneuver": {
                "instruction": "Turn left",
                "voice_instruction": [
                  {
                    "distance_along_geometry": 560,
                    "unit": "meters",
                    "instruction": "In 560 meters, Turn left"
                  },
                  {
                    "distance_along_geometry": 200,
                    "unit": "meters",
                    "instruction": "In 200 meters, Turn left"
                  },
                  {
                    "distance_along_geometry": 50,
                    "unit": "meters",
                    "instruction": "Turn left"
                  }
                ],
                "bearing_before": 216,
                "bearing_after": 129,
                "coordinate": {
                  "latitude": 34.052042,
                  "longitude": -118.248728
                },
                "maneuver_type": "turn",
                "modifier": "left"
              },
              "name": "",
              "intersections": [
                {
                  "location": {
                    "latitude": 34.052042,
                    "longitude": -118.248728
                  },
                  "bearings": [45, 135, 225],
                  "classes": [],
                  "entry": [],
                  "intersection_in": 0,
                  "intersection_out": 1,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 34.051939,
                    "longitude": -118.248581
                  },
                  "bearings": [45, 135, 210, 315],
                  "classes": [],
                  "entry": [],
                  "intersection_in": 3,
                  "intersection_out": 1,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 34.05184,
                    "longitude": -118.248439
                  },
                  "bearings": [30, 135, 210, 315],
                  "classes": [],
                  "entry": [],
                  "intersection_in": 3,
                  "intersection_out": 1,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 34.051751,
                    "longitude": -118.248306
                  },
                  "bearings": [30, 135, 210, 315],
                  "classes": [],
                  "entry": [],
                  "intersection_in": 3,
                  "intersection_out": 1,
                  "lanes": []
                }
              ],
              "road_shield_type": {}
            },
            {
              "geometry": "gpi}_Avpgp`F`O|MfGnFfKpJtc@l]",
              "start_location": {
                "latitude": 34.051348,
                "longitude": -118.247708
              },
              "end_location": {
                "latitude": 34.050176,
                "longitude": -118.248739
              },
              "distance": {
                "value": 161
              },
              "duration": {
                "value": 45
              },
              "maneuver": {
                "instruction": "Turn right onto S Broadway, then you will arrive",
                "voice_instruction": [
                  {
                    "distance_along_geometry": 50,
                    "unit": "meters",
                    "instruction": "Turn right onto S Broadway, then you will arrive"
                  }
                ],
                "bearing_before": 129,
                "bearing_after": 216,
                "coordinate": {
                  "latitude": 34.051348,
                  "longitude": -118.247708
                },
                "maneuver_type": "end of road",
                "modifier": "right"
              },
              "name": "S Broadway",
              "intersections": [
                {
                  "location": {
                    "latitude": 34.051348,
                    "longitude": -118.247708
                  },
                  "bearings": [45, 225, 315],
                  "classes": [],
                  "entry": [],
                  "intersection_in": 2,
                  "intersection_out": 1,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 34.050959,
                    "longitude": -118.248067
                  },
                  "bearings": [30, 120, 225, 315],
                  "classes": [],
                  "entry": [],
                  "intersection_in": 0,
                  "intersection_out": 2,
                  "lanes": [
                    {
                      "indications": ["none"],
                      "valid": true
                    },
                    {
                      "indications": ["right"],
                      "valid": false
                    }
                  ]
                }
              ],
              "road_shield_type": {}
            },
            {
              "geometry": "_gg}_Adqip`F",
              "start_location": {
                "latitude": 34.050176,
                "longitude": -118.248739
              },
              "end_location": {
                "latitude": 34.050176,
                "longitude": -118.248739
              },
              "distance": {
                "value": 0
              },
              "duration": {
                "value": 0
              },
              "maneuver": {
                "instruction": "You have arrived at S Broadway, on the right",
                "voice_instruction": [
                  {
                    "distance_along_geometry": 50,
                    "unit": "meters",
                    "instruction": "You have arrived at S Broadway, on the right"
                  }
                ],
                "bearing_before": 215,
                "bearing_after": 0,
                "coordinate": {
                  "latitude": 34.050176,
                  "longitude": -118.248739
                },
                "maneuver_type": "arrive",
                "modifier": "right"
              },
              "name": "S Broadway",
              "intersections": [
                {
                  "location": {
                    "latitude": 34.050176,
                    "longitude": -118.248739
                  },
                  "bearings": [35],
                  "classes": [],
                  "entry": [],
                  "intersection_in": 0,
                  "intersection_out": 0,
                  "lanes": []
                }
              ],
              "road_shield_type": {}
            }
          ]
        }
      ]
    }
  ]
}
```

Here is a visual representation of how the above response would look like on a map.

![navigation fast example 1](https://static.nextbillion.io/docs-next/docs/navigation/api/navigation-fast-api-example-1.webp)

### GET Request Example 2

Taking a step further for the same trip, let’s customize and

- add a `waypoints`
- request to `avoid` highways and tolls in the route

#### Request

```bash
curl --location 'https://api.nextbillion.io/navigation/json?waypoints=34.05264456,-118.24405323&overview=simplified&origin=34.05605379,-118.24495386&destination=34.05023939,-118.24885017&key=<your_api_key>&mode=car&avoid=highway|toll'
```

#### Response

```json
{
  "status": "Ok",
  "routes": [
    {
      "geometry": "svr}_A`ebp`F~p@jr@njAt_An|BjvBjj@w~@fhAl_A",
      "distance": 851.2,
      "duration": 213.8,
      "start_location": {
        "latitude": 34.056058,
        "longitude": -118.244961
      },
      "end_location": {
        "latitude": 34.050176,
        "longitude": -118.248739
      },
      "legs": [
        {
          "distance": {
            "value": 851
          },
          "duration": {
            "value": 213
          },
          "start_location": {
            "latitude": 34.056058,
            "longitude": -118.244961
          },
          "end_location": {
            "latitude": 34.050176,
            "longitude": -118.248739
          },
          "steps": [
            {
              "geometry": "svr}_A`ebp`FlDxCrFjGVzBhE`EtNxMdMlLlHxGfBpAhDj@dBnAxQ~PbPlN|@t@lOhM|g@ff@zKjKrD~DnUvSjNnM`CxBxBrBhS`R",
              "start_location": {
                "latitude": 34.056058,
                "longitude": -118.244961
              },
              "end_location": {
                "latitude": 34.052042,
                "longitude": -118.248728
              },
              "distance": {
                "value": 568
              },
              "duration": {
                "value": 122
              },
              "maneuver": {
                "instruction": "Head southwest on N Hill St",
                "voice_instruction": [],
                "bearing_before": 0,
                "bearing_after": 216,
                "coordinate": {
                  "latitude": 34.056058,
                  "longitude": -118.244961
                },
                "maneuver_type": "depart"
              },
              "name": "N Hill St",
              "intersections": [
                {
                  "location": {
                    "latitude": 34.056058,
                    "longitude": -118.244961
                  },
                  "bearings": [216],
                  "classes": [],
                  "entry": [],
                  "intersection_in": 0,
                  "intersection_out": 0,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 34.054919,
                    "longitude": -118.246027
                  },
                  "bearings": [30, 135, 225],
                  "classes": [],
                  "entry": [],
                  "intersection_in": 0,
                  "intersection_out": 2,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 34.054344,
                    "longitude": -118.246562
                  },
                  "bearings": [30, 135, 210, 315],
                  "classes": [],
                  "entry": [],
                  "intersection_in": 0,
                  "intersection_out": 2,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 34.053395,
                    "longitude": -118.247446
                  },
                  "bearings": [45, 225, 300],
                  "classes": [],
                  "entry": [],
                  "intersection_in": 0,
                  "intersection_out": 1,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 34.053189,
                    "longitude": -118.247644
                  },
                  "bearings": [45, 225, 315],
                  "classes": [],
                  "entry": [],
                  "intersection_in": 0,
                  "intersection_out": 1,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 34.053099,
                    "longitude": -118.24774
                  },
                  "bearings": [45, 135, 210, 315],
                  "classes": [],
                  "entry": [],
                  "intersection_in": 0,
                  "intersection_out": 2,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 34.052428,
                    "longitude": -118.248365
                  },
                  "bearings": [45, 135, 225],
                  "classes": [],
                  "entry": [],
                  "intersection_in": 0,
                  "intersection_out": 2,
                  "lanes": []
                }
              ],
              "road_shield_type": {}
            },
            {
              "geometry": "s{j}_Anpip`FlEeHdE{G^m@pC{E|IsOfMwS",
              "start_location": {
                "latitude": 34.052042,
                "longitude": -118.248728
              },
              "end_location": {
                "latitude": 34.051348,
                "longitude": -118.247708
              },
              "distance": {
                "value": 121
              },
              "duration": {
                "value": 46
              },
              "maneuver": {
                "instruction": "Turn left",
                "voice_instruction": [
                  {
                    "distance_along_geometry": 560,
                    "unit": "meters",
                    "instruction": "In 560 meters, Turn left"
                  },
                  {
                    "distance_along_geometry": 200,
                    "unit": "meters",
                    "instruction": "In 200 meters, Turn left"
                  },
                  {
                    "distance_along_geometry": 50,
                    "unit": "meters",
                    "instruction": "Turn left"
                  }
                ],
                "bearing_before": 216,
                "bearing_after": 129,
                "coordinate": {
                  "latitude": 34.052042,
                  "longitude": -118.248728
                },
                "maneuver_type": "turn",
                "modifier": "left"
              },
              "name": "",
              "intersections": [
                {
                  "location": {
                    "latitude": 34.052042,
                    "longitude": -118.248728
                  },
                  "bearings": [45, 135, 225],
                  "classes": [],
                  "entry": [],
                  "intersection_in": 0,
                  "intersection_out": 1,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 34.051939,
                    "longitude": -118.248581
                  },
                  "bearings": [45, 135, 210, 315],
                  "classes": [],
                  "entry": [],
                  "intersection_in": 3,
                  "intersection_out": 1,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 34.05184,
                    "longitude": -118.248439
                  },
                  "bearings": [30, 135, 210, 315],
                  "classes": [],
                  "entry": [],
                  "intersection_in": 3,
                  "intersection_out": 1,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 34.051751,
                    "longitude": -118.248306
                  },
                  "bearings": [30, 135, 210, 315],
                  "classes": [],
                  "entry": [],
                  "intersection_in": 3,
                  "intersection_out": 1,
                  "lanes": []
                }
              ],
              "road_shield_type": {}
            },
            {
              "geometry": "gpi}_Avpgp`F`O|MfGnFfKpJtc@l]",
              "start_location": {
                "latitude": 34.051348,
                "longitude": -118.247708
              },
              "end_location": {
                "latitude": 34.050176,
                "longitude": -118.248739
              },
              "distance": {
                "value": 161
              },
              "duration": {
                "value": 45
              },
              "maneuver": {
                "instruction": "Turn right onto S Broadway, then you will arrive",
                "voice_instruction": [
                  {
                    "distance_along_geometry": 50,
                    "unit": "meters",
                    "instruction": "Turn right onto S Broadway, then you will arrive"
                  }
                ],
                "bearing_before": 129,
                "bearing_after": 216,
                "coordinate": {
                  "latitude": 34.051348,
                  "longitude": -118.247708
                },
                "maneuver_type": "end of road",
                "modifier": "right"
              },
              "name": "S Broadway",
              "intersections": [
                {
                  "location": {
                    "latitude": 34.051348,
                    "longitude": -118.247708
                  },
                  "bearings": [45, 225, 315],
                  "classes": [],
                  "entry": [],
                  "intersection_in": 2,
                  "intersection_out": 1,
                  "lanes": []
                },
                {
                  "location": {
                    "latitude": 34.050959,
                    "longitude": -118.248067
                  },
                  "bearings": [30, 120, 225, 315],
                  "classes": [],
                  "entry": [],
                  "intersection_in": 0,
                  "intersection_out": 2,
                  "lanes": [
                    {
                      "indications": ["none"],
                      "valid": true
                    },
                    {
                      "indications": ["right"],
                      "valid": false
                    }
                  ]
                }
              ],
              "road_shield_type": {}
            },
            {
              "geometry": "_gg}_Adqip`F",
              "start_location": {
                "latitude": 34.050176,
                "longitude": -118.248739
              },
              "end_location": {
                "latitude": 34.050176,
                "longitude": -118.248739
              },
              "distance": {
                "value": 0
              },
              "duration": {
                "value": 0
              },
              "maneuver": {
                "instruction": "You have arrived at S Broadway, on the right",
                "voice_instruction": [
                  {
                    "distance_along_geometry": 50,
                    "unit": "meters",
                    "instruction": "You have arrived at S Broadway, on the right"
                  }
                ],
                "bearing_before": 215,
                "bearing_after": 0,
                "coordinate": {
                  "latitude": 34.050176,
                  "longitude": -118.248739
                },
                "maneuver_type": "arrive",
                "modifier": "right"
              },
              "name": "S Broadway",
              "intersections": [
                {
                  "location": {
                    "latitude": 34.050176,
                    "longitude": -118.248739
                  },
                  "bearings": [35],
                  "classes": [],
                  "entry": [],
                  "intersection_in": 0,
                  "intersection_out": 0,
                  "lanes": []
                }
              ],
              "road_shield_type": {}
            }
          ]
        }
      ]
    }
  ]
}
```

Following is a visual representation of how the above response would look like on a map.

![navigation fast example 2](https://static.nextbillion.io/docs-next/docs/navigation/api/navigation-fast-api-example-2.webp)

### POST Request Example

Following is a Navigation Fast POST request configured for the same scenario from Example 2 above:

```bash
curl --location --request POST 'https://api.nextbillion.io/navigation/json?key=<youir_api_key>'
--header 'Content-Type: application/json'
--data-raw '{
    "waypoints":"34.05264456,-118.24405323",
    "origin":"34.05605379,-118.24495386",
    "destination":"34.05023939,-118.24885017",
    "overview":"simplified",
    "mode":"car"
}'
```

## API Query Limits

- Maximum number of `waypoints` allowed in a GET request is 50, whether it is the Fast API or the Flexible API. However, when using the HTTPS POST method, there is a limit of 200 waypoints when using the Flexible API and no limits when using the Fast API.
- Maximum dimensions allowed for `truck_size` are 5000 cm for length, 5000 cm for width, 1000 cm for height.
- Maximum weight allowed for `truck_weight` (including the trailer and shipped goods) is 100,000 kg.
- When using `avoid=bbox`, the maximum perimeter allowed for the bounding box is 500 kilometers.
- At least one of the combinations from (`origin` + `destination`) or (`original_shape` + `original_shape_type`) should be provided to create a valid request.
- NextBillion.ai allows a maximum rate limit of 6000 queries per minute or 100 queries/second for continuous requests.

  _Note_: We can increase the quota if needed, on request. Contact [support@nextbillion.ai](mailto:support@nextbillion.ai) for more details.

## API Error Codes

| Response Code | Description                                                      | Additional Notes                                                                                                                                                                                                         |
| ------------- | ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 200           | Normal success case.                                             | Normal success case.                                                                                                                                                                                                     |
| 400           | Input validation failed.                                         | There is a missing or an invalid parameter or a parameter with an invalid value type is added to the request.                                                                                                            |
| 401           | APIKEY not supplied or invalid.                                  | This error occurs when the wrong API key is passed in the request or the key is missing altogether                                                                                                                       |
| 403           | APIKEY is valid but does not have access to requested resources. | You might be querying for a geographical region which is not valid for your account, or requesting a service which is not enabled for you.                                                                               |
| 404           | Requested host/path not found.                                   | This error occurs when there is a malformed host name used                                                                                                                                                               |
| 413           | Request entity too large                                         | This error is caused when the length of input request URI or the request body is too large. Please modify the request. Reach out to [support@nextbillion.ai](mailto:support@nextbillion.ai) if the issue still persists. |
| 422           | Could not process the request.                                   | Valid route could not be generated for the given parameters.                                                                                                                                                             |
| 429           | Too many requests.                                               | QPM or API request count quota reached                                                                                                                                                                                   |
| 500           | Internal Service error.                                          | There was an internal issue with NextBillion.ai services. You can reach out to [support@nextbillion.ai](mailto:support@nextbillion.ai) for an explanation.                                                               |

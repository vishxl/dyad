# Route Dispatch API

## Introduction

The Route Dispatch API allows sharing of complex routes, including tasks, locations, breaks, and layovers, to NextBillion.ai drivers. Routes can be linked to customizable forms for recording proof-of-completion and can include turn-by-turn navigation instructions to assist drivers.

Let’s take a look at the various methods available within Route Dispatch API below.

## Dispatch a new route

Dispatching a route to registered drivers is possible by submitting their registered email addresses in the input request. All valid routes must contain a `start` and an `end` step. The request can also include route data (stops, task type, instructions, routing characteristics) and a pre-created document template’s ID to record proof-of-completion at all route steps. If needed, the linked template can be overridden at a step level by providing a different template ID for the given step.

> To dispatch the routes to your drivers, register them at [NextBillion.ai Cloud Console](https://console.nextbillion.ai/)

> To create and manage document templates, check out our [Documents API](https://docs.nextbillion.ai/docs/dispatches/documents-api)

Once a route is successfully configured using the following endpoint, the driver can get all the details of the route on the Driver app, available on [Android](https://play.google.com/store/apps/details?id=ai.nextbillion.nb_fleet_driver_app&pcampaignid=web_share) & [iOS](https://apps.apple.com/us/app/nextbillion-ai-driver/id6474605815).

POST

https://api.nextbillion.io/fleetify/routes?key={your_api_key}

Let’s take a look at the available parameters.

### Request Parameters

| Name  | Required | Format and Usage | Description                                                                         |
| ----- | -------- | ---------------- | ----------------------------------------------------------------------------------- |
| `key` | Yes      | Type: `string`   | A key is a unique identifier that is required to authenticate a request to the API. |

### Request Body

| Field                                | Type            | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| ------------------------------------ | --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `driver_email`                       | string          | Specify the e-mail address of the driver who should receive the route. The e-mail address must be registered in [NextBillion.ai Cloud Console](https://console.nextbillion.ai/).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `steps`                              | array of object | An array of objects to collect the details about the intermediate steps in the route to be dispatched. Each object corresponds to a single step. The array must begin with a start-type step and end with an end-type step, to form a valid route.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| `steps[].type`                       | string          | Specify the step type. It can belong to one of the following: `start`, `job` , `pickup`, `delivery`, `end`. A `duration` is mandatory when the step type is either `layover` or a `break`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `steps[].arrival`                    | integer         | Specify the scheduled arrival time of the driver, as an UNIX timestamp in seconds, at the step. Please note that:<br>_ Arrival time for each step should be equal to or greater than the previous step.<br>_ Past times can not be provided.<br>\* The time provided is used only for informative display on the driver app and it does not impact or get affected by the route generated.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `steps[].location`                   | array of number | Specify the location coordinates where the steps should be performed in `[latitude, longitude]`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `steps[].address`                    | string          | Specify the postal address for the step.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `steps[].meta`                       | object          | An object to specify any additional details about the task to be associated with the step in the response. The information provided here will be available on the Driver's app under step details. This attribute can be used to provide context about or instructions to the driver for performing the task                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| `steps[].meta.customer_name`         | string          | Specify the name of the customer for which the step has to be performed.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `steps[].meta.customer_phone_number` | string          | Specify the phone number of the person to be contacted when at step location.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `steps[].meta.instructions`          | string          | Specify custom instructions to be carried out while performing the step.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `steps[].document_template_id`       | string          | Specify the ID of the document template to be used for collecting proof of completion for the step. If not specified, the document template specified at the route level will be used for the step. Use the [Documents API](https://docs.nextbillion.ai/docs/dispatches/documents-api) to create, read and manage the document templates.<br>Please note that the document template ID can not be assigned to following step types - `start`, `end`, `break`, `layover`.                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `steps[].duration`                   | integer         | Specify the duration of the `layover` or `break` type steps, in seconds. Please note it is mandatory when step type is either "layover" or "break".                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `steps[].completion_mode`            | string          | Specify the mode of completion to be used for the step. Currently, following values are allowed:<br>_ `manual`: Steps must be marked as completed manually through the Driver App.<br>_ `geofence`: Steps are marked as completed automatically based on the entry conditions and geofence specified.<br>\* `geofence_manual_fallback`: Steps will be marked as completed automatically based on geofence and entry condition configurations but there will also be a provision for manually updating the status in case, geofence detection fails.                                                                                                                                                                                                                                                                                                                                      |
| `steps[].geofence_config`            | object          | Specify the configurations of the geofence which will be used to detect presence of the driver and complete the tasks automatically. Please note that this attribute is required when `completion_mode` is either "geofence" or "geofence_manual_fallback".                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `steps[].geofence_config.type`       | string          | Specify the type of the geofence. Currently, `circle` is the only suppoeted value.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| `steps[].geofence_config.radius`     | number          | Specify the radius of the cicular geofence, in meters. Once specified, the service will create a geofence with task's location as the center of the circle having the given radius. Valid values for `radius` are \[10, 5000\].                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| `routing`                            | object          | The `routing` object allows defining the routing characteristics that should be used to generate a route when the Driver uses the in-app navigation. Only `car` mode is supported currently.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| `routing.mode`                       | string          | Specify the driving mode that the service should use to determine a route                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `routing.avoid`                      | string          | Setting this will ensure the generated route avoids the object(s) specified in the input. Multiple values should be separated by a pipe (\|). If `none` is provided along with other values, an error is returned as a valid route is not feasible.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `routing.truck_size`                 | string          | Specify the dimensions of a truck, in centimeters (cm), in the format of <height, width, length>. When specified, the dispatched route uses only those roads which allow trucks with specified dimensions.<br>Please note this parameter is effective only when `mode=truck`. Also, the maximum dimensions that can be specified are as follows:<br>Height = 1000 cm <br>Width = 5000 cm <br>Length = 5000 cm                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `routing.truck_weight`               | integer         | Specify the weight of the truck, including trailers and shipped goods, in kilograms (kg). When specified, the dispatched route uses only those roads which allow trucks with specified weight.<br>Please note this parameter is effective only when `mode=truck`. Also, the maximum weight that can be specified for a truck is 100,000 kgs.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| `routing.truck_axle_load`            | integer         | Specify the total load per axle (including the weight of trailers and shipped goods) of the truck, in tonnes. When specified, the dispatched route uses only those roads which can be used by a truck to carry the specified load per axle.<br>Please note this parameter is effective only when `mode=truck`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `routing.hazmat_type`                | string          | Specify the type of hazardous material being carried and the dispatch service will avoid roads which are not suitable for the type of goods specified. Multiple values can be separated using a pipe operator `\|` .<br>Please note that this parameter is effective only when `mode=truck`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| `distance`                           | integer         | Specify the total distance, in meters, for an informative display in Driver's app. The distance specified here has no effect on the actual route that the service generates.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| `document_template_id`               | string          | Specify the ID of the document template that should be used to collect proof of completion for all steps in the route. In order to complete each route step, the driver will need to submit a form generated by the rules defined in the given document template. Use the [Documents API](https://docs.nextbillion.ai/docs/dispatches/documents-api) to create, read and manage document templates.<br>Please note that the document template ID assigned to a route does not apply to following step types - `start`, `end`, `break`, `layover`.                                                                                                                                                                                                                                                                                                                                        |
| `ro_request_id`                      | string          | Specify the Route Optimization request ID. When this ID is provided, all other fields will be ignored (including the required fields) and the route optimization result will be used to form the routes and corresponding steps.<br>Please note that:<br>_ The driver's email ID must be provided in input `vehicle.metadata` as `user_email` such that the route optimization result must contain a valid driver email, step's arrival time, etc., to make a successful dispatch.<br>_ Document Template for collecting proof of delivery or completion can not be specified when using this field to dispatch a route.<br>_ In case of an error at any part among the routes, the API will immediately return the error with the index of the specific route or route step.<br>_ On a successful dispatch, the API returns the last route, if there are many, in the response payload. |

### Response Schema

| Field                                            | Type            | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| ------------------------------------------------ | --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `status`                                         | integer         | Returns the status code of the response.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `data`                                           | object          | An array of objects containing the details of each step in the dispatched route. Each object represents a single step.                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `data.id`                                        | string          | Returns the unique ID of the dispatched route.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `data.short_id`                                  | string          | Returns a shorter unique ID of the dispatched route for easier referencing and displaying purposes.                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `data.ro_request_id`                             | string          | Returns the route optimization request ID which was used to dispatch the route. An empty string is returned if the corresponding input was not provided.                                                                                                                                                                                                                                                                                                                                                                                            |
| `data.vehicle_id`                                | string          | Returns the ID of the vehicle to which the route was dispatched. The vehicle ID returned here is the same as the one used in the route optimization request for the given vehicle. An empty string is returned if the `ro_request_id` was not provided in the input.                                                                                                                                                                                                                                                                                |
| `data.distance`                                  | integer         | Returns the total route distance, in meters, for informative display in the driver app. It is the same as the value provided for `distance` field in the input request.                                                                                                                                                                                                                                                                                                                                                                             |
| `data.routing`                                   | object          | An object returning the routing characteristics that are used to generate the route and turn-by-turn navigation steps for the dispatched route. The route and navigation steps are available when driver uses the in-app navigation.<br>Please note the routing characteristics returned here are the same as those configured in the input request. The fields which were not specified in the input will be returned as blanks.                                                                                                                   |
| `data.routing.mode`                              | string          | Returns the driving mode that is used to build the route when driver starts the in-app turn-by-turn navigation.                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| `data.routing.avoid`                             | string          | Returns the objects and maneuvers that will be avoided in the route that is built when driver starts the in-app turn-by-turn navigation.                                                                                                                                                                                                                                                                                                                                                                                                            |
| `data.routing.truck_weight`                      | string          | Returns the truck weight that will determine compliant routes that can be used by the driver during navigation.                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| `data.routing.truck_size`                        | string          | Returns the truck dimensions, in centimeters, used to determine compliant routes that the driver can take when he starts navigating the dispatched route.                                                                                                                                                                                                                                                                                                                                                                                           |
| `data.routing.truck_axle_load`                   | string          | Returns the total load per axle of the truck, in tonnes, used to determine compliant routes that the driver can take when he starts navigating the dispatched route.                                                                                                                                                                                                                                                                                                                                                                                |
| `data.routing.hazmat_type`                       | string          | Returns the hazardous cargo type that the truck is carrying. The hazardous cargo type is used to determine the compliant routes that the driver can take while navigating the dispatched route.                                                                                                                                                                                                                                                                                                                                                     |
| `data.steps`                                     | array of object | An array of objects containing the details of all steps to be performed as part of the dispatched route. Each object represents a single step during the route.                                                                                                                                                                                                                                                                                                                                                                                     |
| `data.steps[].id`                                | string          | Returns the unique ID of the step.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| `data.steps[].short_id`                          | string          | Returns a unique short ID of the step for easier referencing and displaying purposes.                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `data.steps[].type`                              | string          | Returns the step type. It can belong to one of the following: `start`, `job` , `pickup`, `delivery`, `break`, `layover` , and `end`. For any given step, it would be the same as that specified in the input request while configuring the step details.                                                                                                                                                                                                                                                                                            |
| `data.steps[].arrival`                           | integer         | Returns the scheduled arrival time of the driver at the step as an UNIX timestamp, in seconds precision. It is the same as that specified in the input request while configuring the step details.<br>The timestamp returned here is only for informative display on the driver's app and it does not impact or get affected by the route generated.                                                                                                                                                                                                |
| `data.steps[].address`                           | string          | Returns the postal address where the step is executed. Its value is the same as that specified in the input request when configuring the step details.                                                                                                                                                                                                                                                                                                                                                                                              |
| `data.steps[].location`                          | array of number | Returns the location coordinates where the step is executed.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| `data.steps[].meta`                              | object          | An object returning custom details about the step that were configured in the input request while configuring the step details. The information returned here will be available for display on the Driver's app under step details.                                                                                                                                                                                                                                                                                                                 |
| `data.steps[].meta.customer_phone_number`        | string          | Returns the customer's phone number associated with the step. It can configured in the input request using the `metadata` attribute of the step.                                                                                                                                                                                                                                                                                                                                                                                                    |
| `data.steps[].meta.customer_name`                | string          | Returns the customer name associated with the step. It can configured in the input request using the `metadata` attribute of the step.                                                                                                                                                                                                                                                                                                                                                                                                              |
| `data.steps[].meta.instructions`                 | string          | Returns the custom instructions to carry out while performing the task. These instructions can be provided at the time of configuring the step details in the input request.                                                                                                                                                                                                                                                                                                                                                                        |
| `data.steps[].document_snapshot`                 | array of object | Returns the details of the document that was used for collecting the proof of completion for the step. In case no document template ID was provided for the given step, then a `null` value is returned. Each object represents a new field in the document.                                                                                                                                                                                                                                                                                        |
| `data.steps[].duration`                          | integer         | Returns the duration for `layover` or `break` type steps.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `data.steps[].updated_at`                        | integer         | Represents the timestamp of the last update in seconds since the Unix epoch. Example: `1738743999`.                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `data.steps[].created_at`                        | integer         | Represents the timestamp of the creation in seconds since the Unix epoch. Example: `1738743999`.                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `data.steps[].completion.status`                 | string          | Status of the step.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `data.steps[].completion.completed_at`           | integer         | Represents the timestamp of the completion in seconds since the Unix epoch. Example: `1738743999`.                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| `data.steps[].completion.document`               | object          | A key-value map storing form submission data, where keys correspond to field labels and values can be of any type depend on the type of according document item.                                                                                                                                                                                                                                                                                                                                                                                    |
| `data.steps[].completion.document_modified_at`   | integer         | Represents the timestamp of the last doc modification in seconds since the Unix epoch. Example: `1738743999`.                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| `data.steps[].completion.completion_mode`        | string          | Specify the mode of completion to be used for the step. Currently, following values are allowed:<br>_ `manual`: Steps must be marked as completed manually through the Driver App.<br>_ `geofence`: Steps are marked as completed automatically based on the entry conditions and geofence specified.<br>\* `geofence_manual_fallback`: Steps will be marked as completed automatically based on geofence and entry condition configurations but there will also be a provision for manually updating the status in case, geofence detection fails. |
| `data.steps[].completion.completed_by_mode`      | string          | Specify the mode of completion to be used for the step. Currently, following values are allowed:<br>_ `manual`: Steps must be marked as completed manually through the Driver App.<br>_ `geofence`: Steps are marked as completed automatically based on the entry conditions and geofence specified.<br>\* `geofence_manual_fallback`: Steps will be marked as completed automatically based on geofence and entry condition configurations but there will also be a provision for manually updating the status in case, geofence detection fails. |
| `data.steps[].completion.geofence_config`        | object          | Specify the configurations of the geofence which will be used to detect presence of the driver and complete the tasks automatically. Please note that this attribute is required when `completion_mode` is either "geofence" or "geofence_manual_fallback".                                                                                                                                                                                                                                                                                         |
| `data.steps[].completion.geofence_config.type`   | string          | Specify the type of the geofence. Currently, `circle` is the only suppoeted value.                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| `data.steps[].completion.geofence_config.radius` | number          | Specify the radius of the cicular geofence, in meters. Once specified, the service will create a geofence with task's location as the center of the circle having the given radius. Valid values for `radius` are \[10, 5000\].                                                                                                                                                                                                                                                                                                                     |
| `data.document_snapshot`                         | array of object | Returns the details of the document that was specified in the input for collecting the proof-of-completion for all steps in the dispatched routes. Each object represents a new field in the document.                                                                                                                                                                                                                                                                                                                                              |
| `data.total_steps`                               | integer         | Returns the total number of steps in the dispatched route.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| `data.updated_at`                                | integer         | Returns the UNIX timestamp, in seconds precision, at which this route dispatch request was updated.                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `data.created_at`                                | integer         | Returns the UNIX timestamp, in seconds precision, at which this route dispatch request was created.                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `data.driver`                                    | object          | An object returning the details of the driver to whom the route was dispatched.                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| `data.driver.id`                                 | string          | Returns the ID of the driver as specified in the [NextBillion.ai](http://NextBillion.ai) Cloud Console.                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| `data.driver.fullname`                           | string          | Returns the full name of the driver as specified in [NextBillion.ai](http://NextBillion.ai) Cloud Console.                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| `data.driver.email`                              | string          | Returns the email of the driver as specified in the [NextBillion.ai](http://NextBillion.ai) Cloud Console.                                                                                                                                                                                                                                                                                                                                                                                                                                          |

### Sample Request

```bash
curl --location 'https://api.nextbillion.io/fleetify/routes?key=<your_api_key>' \
--header 'Content-Type: application/json' \
--data-raw '{
  "driver_email": "johndoe@abc.com",
  "distance": 8775,
  "routing": {
    "mode": "car"
  },
  "steps": [
    {
      "type": "start",
      "arrival": 1740740400,
      "location": [34.0928, -118.2829]
    },
    {
      "type": "job",
      "arrival": 1740740400,
      "location": [34.0928, -118.2829],
      "address": "1234 Sunset Boulevard, Los Angeles, CA 90026",
      "meta": {
        "customer_name": "Matthew",
        "customer_phone_number": "779-408-9942",
        "instructions": "Knock on the door and pet the dog"
      }
    },
    {
      "type": "job",
      "arrival": 1740741300,
      "location": [34.1015, -118.3269],
      "address": "5678 Hollywood Boulevard, Los Angeles, CA 90028",
      "meta": {
        "customer_name": "David",
        "customer_phone_number": "453-567-1000",
        "instructions": "Call the customer before arrival"
      }
    },
    {
      "type": "end",
      "arrival": 1740741300,
      "location": [34.1015, -118.3269]
    }
  ],
  "document_template_id": "24c1615a-a031-43e7-ae97-834fdd600614"
}'
```

### Sample Response

```json
{
  "status": 201,
  "data": {
    "id": "be39c08c-1ca2-4a78-9d17-db4f17bec6ae",
    "short_id": "tqmn-597596",
    "ro_request_id": "",
    "vehicle_id": "",
    "distance": 8775,
    "routing": {
      "mode": "car"
    },
    "steps": [
      {
        "id": "722686a2-c2cd-4c41-93a9-79f87be79b0b",
        "short_id": "esyu-359768",
        "type": "start",
        "arrival": 1740740400,
        "address": "",
        "location": [34.0928, -118.2829],
        "meta": {
          "customer_phone_number": "",
          "customer_name": "",
          "instructions": ""
        },
        "updated_at": 1740313332,
        "created_at": 1740313332
      },
      {
        "id": "ae258f5c-b978-4c77-912f-b3b915a1ce96",
        "short_id": "keud-934809",
        "type": "job",
        "arrival": 1740740400,
        "address": "1234 Sunset Boulevard, Los Angeles, CA 90026",
        "location": [34.0928, -118.2829],
        "meta": {
          "customer_phone_number": "779-408-9942",
          "customer_name": "Matthew",
          "instructions": "Knock on the door and pet the dog"
        },
        "updated_at": 1740313332,
        "created_at": 1740313332
      },
      {
        "id": "35f40ee2-1e08-4089-809d-630e3f20d09c",
        "short_id": "bzyv-845051",
        "type": "job",
        "arrival": 1740741300,
        "address": "5678 Hollywood Boulevard, Los Angeles, CA 90028",
        "location": [34.1015, -118.3269],
        "meta": {
          "customer_phone_number": "453-567-1000",
          "customer_name": "David",
          "instructions": "Call the customer before arrival"
        },
        "updated_at": 1740313332,
        "created_at": 1740313332
      },
      {
        "id": "2c09cc64-e3ba-4d3d-aedf-492547ae61da",
        "short_id": "riiu-491234",
        "type": "end",
        "arrival": 1740741300,
        "address": "",
        "location": [34.1015, -118.3269],
        "meta": {
          "customer_phone_number": "",
          "customer_name": "",
          "instructions": ""
        },
        "updated_at": 1740313332,
        "created_at": 1740313332
      }
    ],
    "document_snapshot": [
      {
        "type": "multi_choices",
        "label": "Package Type",
        "required": true,
        "meta": {
          "options": [
            {
              "label": "Food",
              "value": "Food"
            },
            {
              "label": "Electronics",
              "value": "Electronics"
            },
            {
              "label": "Medicines",
              "value": "Medicines"
            }
          ]
        }
      },
      {
        "label": "Photos",
        "validation": {
          "max_items": 3,
          "min_items": 1
        },
        "name": "photos",
        "type": "photos",
        "required": true
      }
    ],
    "total_steps": 4,
    "updated_at": 1740313332,
    "created_at": 1740313332,
    "driver": {
      "id": "271107797150630408",
      "fullname": "John Doe",
      "email": "johndoe@abc.com"
    }
  }
}
```

## Modify a dispatched route

Once a route has been dispatched, its steps can be modified by sending a request to the following method:

POST

https://api.nextbillion.io/fleetify/v2/routes/{route_id}/redispatch?key={your_api_key}

The `operation` parameter allows adding new steps, updating and deleting steps from an already dispatched route. The steps can be modified as long as they have not been completed or started. Once a request is submitted successfully, the service responds with complete details of the modified route.

Let’s take a look at the available parameters under this method.

### Request Parameters

| Name      | Required | Format and Usage | Description                                                                                                                              |
| --------- | -------- | ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `routeID` | Yes      | Type: `string`   | Provide the ID of a previously dispatched route which needs to be modified. Both the `id` and `short_id` of the route are a valid input. |
| `key`     | Yes      | Type: `string`   | A key is a unique identifier that is required to authenticate a request to the API.                                                      |

### Request Body

| Field                                               | Type            | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| --------------------------------------------------- | --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `operations`                                        | array of object | A collection of objects with details of the steps to be modified. Each object corresponds to a single step.                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `operations[].operation`                            | string          | Specify the type of operation to be performed for the step.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `operations[].data.step_id`                         | string          | Specify the ID of the step to be updated or deleted. Either one of `id` or `short_id` of the step can be provided. This input will be ignored when `operation: create` .                                                                                                                                                                                                                                                                                                                                                                            |
| `operations[].data.step.type`                       | string          | Specify the step type. It can belong to one of the following: `start`, `job` , `pickup`, `delivery`, `end`. A `duration` is mandatory when the step type is either `layover` or a `break`.                                                                                                                                                                                                                                                                                                                                                          |
| `operations[].data.step.arrival`                    | integer         | Specify the scheduled arrival time of the driver, as an UNIX timestamp in seconds, at the step. Please note that:<br>_ Arrival time for each step should be equal to or greater than the previous step.<br>_ Past times can not be provided.<br>\* The time provided is used only for informative display on the driver app and it does not impact or get affected by the route generated.                                                                                                                                                          |
| `operations[].data.step.location`                   | array of number | Specify the location coordinates where the steps should be performed in `[latitude, longitude]`.                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `operations[].data.step.address`                    | string          | Specify the postal address for the step.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `operations[].data.step.meta`                       | object          | An object to specify any additional details about the task to be associated with the step in the response. The information provided here will be available on the Driver's app under step details. This attribute can be used to provide context about or instructions to the driver for performing the task                                                                                                                                                                                                                                        |
| `operations[].data.step.meta.customer_name`         | string          | Specify the name of the customer for which the step has to be performed.                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `operations[].data.step.meta.customer_phone_number` | string          | Specify the phone number of the person to be contacted when at step location.                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| `operations[].data.step.meta.instructions`          | string          | Specify custom instructions to be carried out while performing the step.                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `operations[].data.step.document_template_id`       | string          | Specify the ID of the document template to be used for collecting proof of completion for the step. If not specified, the document template specified at the route level will be used for the step. Use the [Documents API](https://docs.nextbillion.ai/docs/dispatches/documents-api) to create, read and manage the document templates.<br>Please note that the document template ID can not be assigned to following step types - `start`, `end`, `break`, `layover`.                                                                            |
| `operations[].data.step.duration`                   | integer         | Specify the duration of the `layover` or `break` type steps, in seconds. Please note it is mandatory when step type is either "layover" or "break".                                                                                                                                                                                                                                                                                                                                                                                                 |
| `operations[].data.step.completion_mode`            | string          | Specify the mode of completion to be used for the step. Currently, following values are allowed:<br>_ `manual`: Steps must be marked as completed manually through the Driver App.<br>_ `geofence`: Steps are marked as completed automatically based on the entry conditions and geofence specified.<br>\* `geofence_manual_fallback`: Steps will be marked as completed automatically based on geofence and entry condition configurations but there will also be a provision for manually updating the status in case, geofence detection fails. |
| `operations[].data.step.geofence_config`            | object          | Specify the configurations of the geofence which will be used to detect presence of the driver and complete the tasks automatically. Please note that this attribute is required when `completion_mode` is either "geofence" or "geofence_manual_fallback".                                                                                                                                                                                                                                                                                         |
| `operations[].data.step.geofence_config.type`       | string          | Specify the type of the geofence. Currently, `circle` is the only suppoeted value.                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| `operations[].data.step.geofence_config.radius`     | number          | Specify the radius of the cicular geofence, in meters. Once specified, the service will create a geofence with task's location as the center of the circle having the given radius. Valid values for `radius` are \[10, 5000\].                                                                                                                                                                                                                                                                                                                     |
| `operations[].data.completion_mode`                 | string          | Specify the mode of completion to be used for the step. Currently, following values are allowed:<br>_ `manual`: Steps must be marked as completed manually through the Driver App.<br>_ `geofence`: Steps are marked as completed automatically based on the entry conditions and geofence specified.<br>\* `geofence_manual_fallback`: Steps will be marked as completed automatically based on geofence and entry condition configurations but there will also be a provision for manually updating the status in case, geofence detection fails. |
| `operations[].data.document_template_id`            | string          | Specify the ID of the document template to be used for collecting proof of completion for the step. It would be applied to step which not be bind to document template. Use the [Documents API](https://docs.nextbillion.ai/docs/dispatches/documents-api) to create, read and manage the document templates.<br>Please note that the document template ID can not be assigned to following step types - `start`, `end`, `break`, `layover`.                                                                                                        |
| `distance`                                          | number          | Specify the distance of the route.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |

### Response Schema

| Field                                   | Type            | Description                                                                                                                                                                                                                                                                                                                                                                                                                       |
| --------------------------------------- | --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `status`                                | integer         | Returns the status code of the response.                                                                                                                                                                                                                                                                                                                                                                                          |
| `message`                               | string          | Returns the error message in case of a failed request. If the request is successful, this field is not present in the response.                                                                                                                                                                                                                                                                                                   |
| `data.id`                               | string          | Returns the unique ID of the route.                                                                                                                                                                                                                                                                                                                                                                                               |
| `data.short_id`                         | string          | Returns a shorter unique ID of the route for easier referencing and displaying purposes.                                                                                                                                                                                                                                                                                                                                          |
| `data.ro_request_id`                    | string          | Returns the route optimization request ID which was used to dispatch the route. An empty string is returned if the corresponding input was not provided.                                                                                                                                                                                                                                                                          |
| `data.vehicle_id`                       | string          | Returns the ID of the vehicle to which the route was dispatched. The vehicle ID returned here is the same as the one used in the route optimization request for the given vehicle. An empty string is returned if the `ro_request_id` was not provided in the input.                                                                                                                                                              |
| `data.distance`                         | integer         | Returns the total route distance, in meters, for informative display in the driver app. It is the same as the value provided for `distance` field in the input request.                                                                                                                                                                                                                                                           |
| `data.routing`                          | object          | An object returning the routing characteristics that are used to generate the route and turn-by-turn navigation steps for the dispatched route. The route and navigation steps are available when driver uses the in-app navigation.<br>Please note the routing characteristics returned here are the same as those configured in the input request. The fields which were not specified in the input will be returned as blanks. |
| `data.routing.mode`                     | string          | Returns the driving mode that is used to build the route when driver starts the in-app turn-by-turn navigation.                                                                                                                                                                                                                                                                                                                   |
| `data.routing.avoid`                    | string          | Returns the objects and maneuvers that will be avoided in the route that is built when driver starts the in-app turn-by-turn navigation.                                                                                                                                                                                                                                                                                          |
| `data.routing.truck_weight`             | string          | Returns the truck weight that will determine compliant routes that can be used by the driver during navigation.                                                                                                                                                                                                                                                                                                                   |
| `data.routing.truck_size`               | string          | Returns the truck dimensions, in centimeters, used to determine compliant routes that the driver can take when he starts navigating the dispatched route.                                                                                                                                                                                                                                                                         |
| `data.routing.truck_axle_load`          | string          | Returns the total load per axle of the truck, in tonnes, used to determine compliant routes that the driver can take when he starts navigating the dispatched route.                                                                                                                                                                                                                                                              |
| `data.routing.hazmat_type`              | string          | Returns the hazardous cargo type that the truck is carrying. The hazardous cargo type is used to determine the compliant routes that the driver can take while navigating the dispatched route.                                                                                                                                                                                                                                   |
| `data.steps.id`                         | string          | Returns the unique ID of the step.                                                                                                                                                                                                                                                                                                                                                                                                |
| `data.steps.short_id`                   | string          | Returns a unique short ID of the step for easier referencing and displaying purposes.                                                                                                                                                                                                                                                                                                                                             |
| `data.steps.type`                       | string          | Returns the step type. It can belong to one of the following: `start`, `job` , `pickup`, `delivery`, `break`, `layover` , and `end`. For any given step, it would be the same as that specified in the input request while configuring the step details.                                                                                                                                                                          |
| `data.steps.arrival`                    | integer         | Returns the scheduled arrival time of the driver at the step as an UNIX timestamp, in seconds precision. It is the same as that specified in the input request while configuring the step details.<br>The timestamp returned here is only for informative display on the driver's app and it does not impact or get affected by the route generated.                                                                              |
| `data.steps.address`                    | string          | Returns the postal address where the step is executed. Its value is the same as that specified in the input request when configuring the step details.                                                                                                                                                                                                                                                                            |
| `data.steps.location`                   | array of number | Returns the location coordinates where the step is executed.                                                                                                                                                                                                                                                                                                                                                                      |
| `data.steps.meta`                       | object          | An object returning custom details about the step that were configured in the input request while configuring the step details. The information returned here will be available for display on the Driver's app under step details.                                                                                                                                                                                               |
| `data.steps.meta.customer_phone_number` | string          | Returns the customer's phone number associated with the step. It can configured in the input request using the `metadata` attribute of the step.                                                                                                                                                                                                                                                                                  |
| `data.steps.meta.customer_name`         | string          | Returns the customer name associated with the step. It can configured in the input request using the `metadata` attribute of the step.                                                                                                                                                                                                                                                                                            |
| `data.steps.meta.instructions`          | string          | Returns the custom instructions to carry out while performing the task. These instructions can be provided at the time of configuring the step details in the input request.                                                                                                                                                                                                                                                      |
| `data.steps.completion`                 | object          | Returns the completion status of the step.                                                                                                                                                                                                                                                                                                                                                                                        |
| `data.steps.completion.status`          | string          | Returns the status of the step. It can take one of the following values - "scheduled", "completed".                                                                                                                                                                                                                                                                                                                               |
| `data.steps.document_snapshot`          | array of object | Returns the details of the document that was used for collecting the proof of completion for the step. In case no document template ID was provided for the given step, then a `null` value is returned. Each object represents a new field in the document.                                                                                                                                                                      |
| `data.steps.duration`                   | integer         | Returns the duration for `layover` or `break` type steps.                                                                                                                                                                                                                                                                                                                                                                         |
| `data.steps.updated_at`                 | integer         | Returns the UNIX timestamp, in seconds precision, at which this step was last updated.                                                                                                                                                                                                                                                                                                                                            |
| `data.steps.created_at`                 | integer         | Returns the UNIX timestamp, in seconds precision, at which this step was created.                                                                                                                                                                                                                                                                                                                                                 |
| `data.document_snapshot`                | array of object | Returns the details of the document that was specified in the input for collecting the proof-of-completion for all steps in the dispatched routes. Each object represents a new field in the document.                                                                                                                                                                                                                            |
| `data.completion`                       | object          | Returns the completion status of the route.                                                                                                                                                                                                                                                                                                                                                                                       |
| `data.completion.status`                | string          | Returns the status of the route. It can take one of the following values - "scheduled", "completed".                                                                                                                                                                                                                                                                                                                              |
| `data.total_steps`                      | integer         | Returns the total number of steps in the dispatched route.                                                                                                                                                                                                                                                                                                                                                                        |
| `data.completed_steps`                  | integer         | Returns the number of steps already completed in the route.                                                                                                                                                                                                                                                                                                                                                                       |
| `data.updated_at`                       | integer         | Returns the UNIX timestamp, in seconds precision, at which this route dispatch request was updated.                                                                                                                                                                                                                                                                                                                               |
| `data.created_at`                       | integer         | Returns the UNIX timestamp, in seconds precision, at which this route dispatch request was created.                                                                                                                                                                                                                                                                                                                               |
| `data.driver`                           | object          | An object returning the details of the driver to whom the route was dispatched.                                                                                                                                                                                                                                                                                                                                                   |
| `data.driver.id`                        | string          | Returns the ID of the driver as specified in the [NextBillion.ai](http://NextBillion.ai) Cloud Console.                                                                                                                                                                                                                                                                                                                           |
| `data.driver.fullname`                  | string          | Returns the full name of the driver as specified in [NextBillion.ai](http://NextBillion.ai) Cloud Console.                                                                                                                                                                                                                                                                                                                        |
| `data.driver.email`                     | string          | Returns the email of the driver as specified in the [NextBillion.ai](http://NextBillion.ai) Cloud Console.                                                                                                                                                                                                                                                                                                                        |

### Sample Request

```bash
curl --location 'https://api.nextbillion.io/fleetify/v2/routes/tqmn-597596/redispatch?key=<your_api_key>' \
--header 'Content-Type: application/json' \
--data '{
    "distance": 7834,
    "operations": [
        {
            "operation": "create",
            "data": {
                "step": {
                    "type": "delivery",
                    "arrival": 1740740700,
                    "location": [
                       34.09511876925524, -118.32605708487887
                    ],
                    "address": "1234 Sunset Blvd, Los Angeles, CA 90026",
                    "meta": {
                        "customer_name": "Costco",
                        "customer_phone_number": "654-542-0392",
                        "instructions": "Drop the box at the back door"
                    }
                }
            }
        },
        {
            "operation": "update",
            "data": {
                "step_id": "keud-934809",
                "step": {
                    "type": "job",
                    "arrival": 1740741000,
                    "location": [
                        34.042256346743166, -118.33157494526539
                    ],
                    "address": "5678 Hollywood Ave, Los Angeles, CA 90028",
                    "meta": {
                        "customer_name": "Ray Rogers",
                        "customer_phone_number": "111-093-5432",
                        "instructions": "knock on the door twice and pet the dog"
                    }
                }
            }
        },
        {
            "operation": "delete",
            "data": {
                "step_id": "bzyv-845051",
                "step": {
                    "type": "delivery",
                    "arrival": 1773208800,
                    "location": [
                       34.066903083673715, -118.27135829496032
                    ],
                    "address": "91011 Beverly Ln, Los Angeles, CA 90210"
                }
            }
        }
    ]
}'
```

### Sample Response

```json
{
  "status": 200,
  "data": {
    "id": "be39c08c-1ca2-4a78-9d17-db4f17bec6ae",
    "short_id": "tqmn-597596",
    "ro_request_id": "",
    "vehicle_id": "",
    "distance": 7834,
    "routing": {
      "mode": "car"
    },
    "steps": [
      {
        "id": "722686a2-c2cd-4c41-93a9-79f87be79b0b",
        "short_id": "esyu-359768",
        "type": "start",
        "arrival": 1740740400,
        "address": "",
        "location": [34.0928, -118.2829],
        "meta": {
          "customer_phone_number": "",
          "customer_name": "",
          "instructions": ""
        },
        "completion": {
          "status": "scheduled"
        },
        "updated_at": 1740313332,
        "created_at": 1740313332
      },
      {
        "id": "9bb8260e-1ccb-4252-8cd4-e1493efa16d4",
        "short_id": "tfij-737449",
        "type": "delivery",
        "arrival": 1740740700,
        "address": "1234 Sunset Blvd, Los Angeles, CA 90026",
        "location": [34.09511876925524, -118.32605708487887],
        "meta": {
          "customer_phone_number": "654-542-0392",
          "customer_name": "Costco",
          "instructions": "Drop the box at the back door"
        },
        "completion": {
          "status": "scheduled"
        },
        "updated_at": 1740313870,
        "created_at": 1740313870
      },
      {
        "id": "ae258f5c-b978-4c77-912f-b3b915a1ce96",
        "short_id": "keud-934809",
        "type": "job",
        "arrival": 1740741000,
        "address": "5678 Hollywood Ave, Los Angeles, CA 90028",
        "location": [34.0422563467432, -118.331574945265],
        "meta": {
          "customer_phone_number": "111-093-5432",
          "customer_name": "Ray Rogers",
          "instructions": "knock on the door twice and pet the dog"
        },
        "completion": {
          "status": "scheduled"
        },
        "updated_at": 1740313870,
        "created_at": 1740313332
      },
      {
        "id": "2c09cc64-e3ba-4d3d-aedf-492547ae61da",
        "short_id": "riiu-491234",
        "type": "end",
        "arrival": 1740741300,
        "address": "",
        "location": [34.1015, -118.3269],
        "meta": {
          "customer_phone_number": "",
          "customer_name": "",
          "instructions": ""
        },
        "completion": {
          "status": "scheduled"
        },
        "updated_at": 1740313332,
        "created_at": 1740313332
      }
    ],
    "document_snapshot": [
      {
        "type": "multi_choices",
        "label": "Package Type",
        "required": true,
        "meta": {
          "options": [
            {
              "label": "Food",
              "value": "Food"
            },
            {
              "label": "Electronics",
              "value": "Electronics"
            },
            {
              "label": "Medicines",
              "value": "Medicines"
            }
          ]
        }
      },
      {
        "label": "Photos",
        "validation": {
          "max_items": 3,
          "min_items": 1
        },
        "name": "photos",
        "type": "photos",
        "required": true
      }
    ],
    "completion": {
      "status": "scheduled"
    },
    "total_steps": 4,
    "completed_steps": 0,
    "updated_at": 1740313870,
    "created_at": 1740313332,
    "driver": {
      "id": "271107797150630408",
      "fullname": "John Doe",
      "email": "johndoe@abc.com"
    }
  }
}
```

## API Query Limits

1. The maximum number of steps that can be provided in the input are 1000.
2. `arrival` should always be either equal to or greater than the current time and it should increase monotonically for each step.
3. NextBillion.ai allows a maximum rate limit of 6000 queries per minute or 100 queries/second for continuous requests.
   1. _Note_: We can increase the quota if needed on request. Contact [support@nextbillion.ai](mailto:support@nextbillion.ai) for more details.

## API Error Codes

| Response code | Description                                                     | Additional notes                                                                                                                                           |
| ------------- | --------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 200           | Normal success case.                                            | Normal success case.                                                                                                                                       |
| 400           | Input validation failed.                                        | There is a missing or an invalid parameter or a parameter with an invalid value type is added to the request.                                              |
| 401           | APIKEY not supplied or invalid                                  | This error occurs when the wrong API key is passed in the request or the key is missing altogether.                                                        |
| 403           | APIKEY is valid but does not have access to requested resources | You might be querying for a geographical region which is not valid for your account or requesting a service which is not enabled for you.                  |
| 404           | Requested host/path not found                                   | This error occurs when a malformed hostname is used.                                                                                                       |
| 422           | Could not process the request                                   | A feasible solution could not be generated for the given set of locations or parameter configuration.                                                      |
| 429           | Too many requests                                               | QPM reached or API request count quota reached.                                                                                                            |
| 500           | Internal Service error.                                         | There was an internal issue with NextBillion.ai services. You can reach out to [support@nextbillion.ai](mailto:support@nextbillion.ai) for an explanation. |

# Live Tracking API

## Introduction

Live Tracking is an efficient system that offers a comprehensive solution for managing and monitoring various assets, including vehicles, users, and drivers. Live Tracking API provides real-time information on the location, status, and activity of assets. Additionally, users can also receive events based on the activity of the assets enabling real-time monitoring.

With its advanced capabilities, Live Tracking changes how businesses manage and monitor their assets, providing a powerful tool for optimizing operations and enhancing efficiency.

Current Live Tracking API version provides the following abilities:

1. Create and manage **assets**.
2. Query past track of **assets**.
3. Search for **assets** in an area.
4. Create **monitors** to track assets.
5. Create **alerts** based on asset activity.

[Live Tracking Examples

To see all tutorials related to the Live Tracking, click this banner](https://docs.nextbillion.ai/tracking/live-tracking-api/examples)

## Asset

The Asset services in Live Tracking API allow businesses to create and manage assets. An `asset` represents an entity that needs to be tracked in your project. Users can define assets using a variety of properties like a unique ID for the `asset`, custom attributes of the `asset` for easy search and filter, among other properties. Once an asset is created, users can configure it to be tracked by using the GPS information from the `asset`.

Live Tracking API helps businesses in tracking real-time information about the location of an `asset` including their exact position, speed, last location and among other details. The real-time information of an `asset` can then be used to generate events based on certain pre-defined criteria. A combination of real-time information and events based on this information can be utilized to optimize logistics and improve operational efficiency.

Let’s take a look at some of the methods available to monitor and manage assets.

### Create an Asset

Users can create new assets by sending a POST request with relevant details of the `asset` like name, ID, attributes, etc. The service responds with an `asset` ID which can be used to perform all other asset operations. A restaurant delivery service, for example, can utilize this API method to create a new set of assets representing each delivery vehicle in their fleet, simplifying management and tracking.

POST

https://api.nextbillion.io/skynet/asset?key={your_api_key}

#### Request Parameter

| Name  | Required | Format and Usage | Description                                                                                                                                                                                                                                              |
| ----- | -------- | ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `key` | Yes      | Type: `string`   | A key is a unique identifier that is required to authenticate a request to the API. The namespace created using this key can be managed using the APIs & Services > Credentials section of user’s [NextBillion Console](https://console.nextbillion.ai). |

#### Request Body

| Field         | Type            | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| ------------- | --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `custom_id`   | string          | Set a unique ID for the new `asset`. If not provided, an ID will be automatically generated in UUID format. A valid `custom_id` can contain letters, numbers, "-", & "\_" only. Please note that the ID of an `asset` can not be changed once it is created.                                                                                                                                                                                                                                                            |
| `description` | string          | Description for the `asset`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `name`        | string          | Name of the `asset`. Use this field to assign a meaningful, custom name to the `asset` being created.                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `attributes`  | object          | `attributes` can be used to store custom information about an asset in `key`:`value` format. Use `attributes` to add any useful information or context to your assets like the vehicle type, shift timing etc. Moreover, these attributes can be used to filter `assets` in **Search**, **Monitor**, and _Get Asset List_ queries. Please note that the maximum number of `key`:`value` pairs that can be added to an `attributes` object is 100. Also, the overall size of `attributes` object should not exceed 65kb. |
| `tags`        | array of string | **This parameter will be deprecated soon! Please use the `attributes` parameter to add labels or markers for the asset.** Tags of the `asset`. `tags` can be used for filtering assets in operations like _Get Asset List_ and asset **Search** methods. They can also be used for monitoring of assets using the **Monitor** methods after linking `tags` and `asset`. Valid `tags` are strings consisting of alphanumeric characters (A-Z, a-z, 0-9) along with the underscore ('\_') and hyphen ('-') symbols.       |

#### Response Schema

| Field     | Type   | Description                                                                                                                                                                                                                                  |
| --------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `status`  | string | A string indicating the state of the response. On successful responses, the value will be `Ok`. Indicative error messages are returned for different errors. See the [API Error Codes](#api-error-codes) section below for more information. |
| `data`    | object | An object containing the ID of the `asset` created.                                                                                                                                                                                          |
| `data.id` | string | Unique ID of the asset created. It will be the same as `custom_id`, if provided. Else it will be an auto generated UUID. Please note this ID cannot be updated.                                                                              |
| `message` | string | Displays the error message in case of a failed request. If the request is successful, this field is not present in the response.                                                                                                             |

#### Sample API Request

```bash
curl --location --request POST 'https://api.nextbillion.io/skynet/asset?key=<your_api_key>'
--header 'Content-Type: application/json'
--data-raw '{
  "name": "Delivery Vehicle 001",
  "description": "This vehicle is used for restaurant delivery services",
  "attributes":{"license":"AX 78 TR 5421",
                "driver_name":"David Smith",
                "driver_contact_no":"123-456-1234"}
}'
```

#### Sample API Response

```json
{
  "status": "Ok",
  "data": {
    "id": "4ba554b9-ef1c-48f0-9833-636edcf89256"
  }
}
```

### Get an Asset

Users can retrieve a specific asset and its related information by providing the `asset` ID as a path parameter. The response containing all the details of the requested `asset` can be easily consumed within the user’s software applications or platforms. For example, a logistics company that provides delivery services to restaurants can use this API method to retrieve the information of a specific delivery truck within its fleet management system.

GET

https://api.nextbillion.io/skynet/asset/{id}?key={your_api_key}

#### Request Parameter

| Name  | Required | Format and Usage | Description                                                                                                                                                                                                                                              |
| ----- | -------- | ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`  | Yes      | Type: `string`   | ID of the `asset` to be fetched. This is the same ID that was generated/provided at the time of creating the `asset`.                                                                                                                                    |
| `key` | Yes      | Type: `string`   | A key is a unique identifier that is required to authenticate a request to the API. The namespace created using this key can be managed using the APIs & Services > Credentials section of user’s [NextBillion Console](https://console.nextbillion.ai). |

#### Response Schema

| Field                                     | Type            | Description                                                                                                                                                                                                                                                                                                                                                                                                       |
| ----------------------------------------- | --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `status`                                  | string          | A string indicating the state of the response. On successful responses, the value will be `Ok`. Indicative error messages are returned for different errors. See the [API Error Codes](#api-error-codes) section below for more information.                                                                                                                                                                      |
| `data`                                    | object          | An object containing the information about the `asset` returned.                                                                                                                                                                                                                                                                                                                                                  |
| `data.asset`                              | object          | An object with details of the `asset` properties.                                                                                                                                                                                                                                                                                                                                                                 |
| `data.asset.id`                           | string          | ID of the `asset`. This is the same ID that was generated/provided at the time of creating the `asset`.                                                                                                                                                                                                                                                                                                           |
| `data.asset.device_id`                    | string          | ID of the `device` that is linked to this asset. Please note that there can be multiple `device_id` linked to a single `asset`. An empty response is returned if no devices are linked to the `asset`. User can link a device to an `asset` using the _Bind Asset to Device_ method.                                                                                                                              |
| `data.asset.state`                        | string          | State of the asset. It will be "active" when the asset is in use or available for use, and it will be "deleted" in case the asset has been deleted.                                                                                                                                                                                                                                                               |
| `data.asset.name`                         | string          | Name of the `asset`. The value would be the same as that provided for the `name` parameter at the time of creating or updating the `asset`.                                                                                                                                                                                                                                                                       |
| `data.asset.description`                  | string          | Description of the `asset`. The value would be the same as that provided for the `description` parameter at the time of creating or updating the `asset`.                                                                                                                                                                                                                                                         |
| `data.asset.created_at`                   | integer         | A UNIX epoch timestamp in seconds representing the time at which the `asset` was created.                                                                                                                                                                                                                                                                                                                         |
| `data.asset.updated_at`                   | integer         | A UNIX epoch timestamp in seconds representing the time at which the `asset` was last updated.                                                                                                                                                                                                                                                                                                                    |
| `data.asset.tracked_at`                   | integer         | A UNIX epoch timestamp in seconds representing the last time when the `asset` was tracked.                                                                                                                                                                                                                                                                                                                        |
| `data.asset.attributes`                   | object          | A string dictionary object containing `attributes` of the `asset`. These `attributes` were associated with the `asset` at the time of creating or updating it. `attributes` can be added to an `asset` using the _Update Asset Attributes_ method.                                                                                                                                                                |
| `data.asset.latest_location`              | object          | An object with details of the last tracked location of the asset.                                                                                                                                                                                                                                                                                                                                                 |
| `data.asset.latest_location.location`     | object          | An object with the coordinates of the last tracked location.                                                                                                                                                                                                                                                                                                                                                      |
| `data.asset.latest_location.location.lat` | number          | Latitude of the tracked location of the `asset`.                                                                                                                                                                                                                                                                                                                                                                  |
| `data.asset.latest_location.location.lon` | number          | Longitude of the tracked location of the `asset`.                                                                                                                                                                                                                                                                                                                                                                 |
| `data.asset.latest_location.timestamp`    | integer         | A UNIX epoch timestamp in milliseconds, representing the time at which the location was tracked.                                                                                                                                                                                                                                                                                                                  |
| `data.asset.latest_location.accuracy`     | number          | If available, this property returns the accuracy of the GPS information received at the last tracked location. It is represented as an estimated horizontal accuracy radius, in meters, at the 68th percentile confidence level.                                                                                                                                                                                  |
| `data.asset.latest_location.speed`        | number          | If available in the GPS information, this property returns the speed of the `asset`, in meters per second, at the last tracked location.                                                                                                                                                                                                                                                                          |
| `data.asset.latest_location.bearing`      | number          | If available in the GPS information, this property returns the heading of the `asset` calculated from true north in clockwise direction at the last tracked location. Please note that the bearing is not affected by the device orientation. The bearing will always be in the range of [0, 360).                                                                                                                |
| `data.asset.latest_location.altitude`     | number          | If available in the GPS information, this property returns the altitude of the `asset` at the last tracked location. It is represented as height, in meters, above the WGS84 reference ellipsoid.                                                                                                                                                                                                                 |
| `data.asset.tags`                         | array of string | **This parameter will be deprecated soon! Please move existing `tags` to `attributes` parameter.** Tags of the asset. These were associated with the `asset` when it was created or updated. `tags` can be used for filtering assets in operations like _Get Asset List_ and asset **Search** methods. They can also be used for monitoring of assets using **Monitor** methods after linking `tags` and `asset`. |
| `message`                                 | string          | Displays the error message in case of a failed request. If the request is successful, this field is not present in the response.                                                                                                                                                                                                                                                                                  |

#### Sample API Request

```bash
curl --location --request GET 'https://api.nextbillion.io/skynet/asset/38a530ca-18c4-482b-8fb4-c40c5b1349ee?key=<your_api_key>'
```

#### Sample API Response

```json
{
  "status": "Ok",
  "data": {
    "asset": {
      "id": "38a530ca-18c4-482b-8fb4-c40c5b1349ee",
      "device_id": "258c6471-8533-45df-8924-d0be8e508141",
      "name": "Delivery Vehicle 001",
      "description": "This vehicle is used for restaurant delivery services",
      "created_at": 1698692011,
      "updated_at": 1698771931,
      "attributes": {
        "driver_contact_no": "123-456-1234",
        "driver_name": "David Smith",
        "license": "AX 78 TR 5421"
      },
      "latest_location": {
        "location": {
          "lat": 34.022778,
          "lon": -118.28147
        },
        "timestamp": 1698773113917,
        "accuracy": 4.819578268302463,
        "altitude": 271.6402533762157
      }
    }
  }
}
```

### Update an Asset

Use this method to update the data related to an `asset` by sending a PUT request with the `asset` ID as a path parameter and `asset` details to be updated in the request body. For example, a restaurant delivery service can utilize this API method to update the metadata of their delivery vehicles. This would allow the service to manage the details of each vehicle more efficiently, ensuring that the information is up-to-date and relevant to their customers.

PUT

https://api.nextbillion.io/skynet/asset/{id}?key={your_api_key}

#### Request Parameter

| Name  | Required | Format and Usage | Description                                                                                                                                                                                                                                              |
| ----- | -------- | ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`  | Yes      | Type: `string`   | ID of the `asset` to be updated. This is the same ID that was generated/provided at the time of creating the `asset`.                                                                                                                                    |
| `key` | Yes      | Type: `string`   | A key is a unique identifier that is required to authenticate a request to the API. The namespace created using this key can be managed using the APIs & Services > Credentials section of user’s [NextBillion Console](https://console.nextbillion.ai). |

#### Request Body

| Field         | Type            | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| ------------- | --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `description` | string          | Use this param to update the `description` of an `asset`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| `name`        | string          | Use this param to update the `name` of an `asset`. Users can assign meaningful custom names to their assets.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| `tags`        | array of string | **This parameter will be deprecated soon! Please use the `attributes` parameter to add labels or markers for the asset.** Use this param to update the `tags` of an `asset`. `tags` can be used to filter `asset` in _Get Asset List_, **Search** and **Monitor** queries.                                                                                                                                                                                                                                                                                                                                                    |
| `attributes`  | object          | Use this param to update the `attributes` of an asset in `key`:`value` format. Users can maintain any useful information or context about the assets by utilising this parameter. Please be careful when using this parameter while updating an `asset` as the new `attributes` object provided will completely overwrite the old `attributes` object. Use the _Update Asset Attributes_ method to add new or modify existing attributes. Another point to note is that the overall size of the `attributes` object cannot exceed 65kb and the maximum number of `key`:`value` pairs that can be added to this object is 100. |

#### Response Schema

| Field     | Type   | Description                                                                                                                                                                                                                                  |
| --------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `message` | string | Displays the error message in case of a failed request. If the request is successful, this field is not present in the response.                                                                                                             |
| `status`  | string | A string indicating the state of the response. On successful responses, the value will be `Ok`. Indicative error messages are returned for different errors. See the [API Error Codes](#api-error-codes) section below for more information. |

#### Sample API Request

```bash
curl --location --request PUT 'https://api.nextbillion.io/skynet/asset/788bfcbb-e067-48fb-a4a8-a09d9530aee8/attributes?key=<your_api_key>' \
--header 'Content-Type: application/json'
--data-raw '{
    "attributes":{
                "driver_name": "Jack Hamlin",
                "license": "AR 30 TR 8080",
                "shift_timing": "0930 - 1830"
                }
}'
```

#### Sample API Response

```json
{
  "status": "Ok"
}
```

### Update Asset Attributes

This method enables users to update the `attributes` of an asset. Users can use this method to maintain custom attributes such as shift timing, driver name or any other useful information related to the `asset`. These attributes can be utilized for filtering assets in search queries, configuring monitors, and obtaining `asset` lists.

PUT

https://api.nextbillion.io/skynet/asset/{id}/attributes?key={your_api_key}

#### Request Parameter

| Name  | Required | Format and Usage | Description                                                                                                                                                                                                                                              |
| ----- | -------- | ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`  | Yes      | Type: `string`   | ID of the `asset` whose attributes need to be updated. This is the same ID that was generated/provided at the time of creating the `asset`.                                                                                                              |
| `key` | Yes      | Type: `string`   | A key is a unique identifier that is required to authenticate a request to the API. The namespace created using this key can be managed using the APIs & Services > Credentials section of user’s [NextBillion Console](https://console.nextbillion.ai). |

#### Request Body

| Field        | Type   | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| ------------ | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `attributes` | object | `attributes` can be used to add any useful information or context to your assets like the vehicle type, shift timing etc. These attributes can also be used to filter assets in **Search**, **Monitor**, and _Get Asset List_ queries. Provide the attributes to be added or updated, in `key`:`value` format. If an existing `key` is provided in the input, then the `value` will be modified as per the input value. If a new `key` is provided in the input, then the `key` would be added to the existing set. The contents of any `value` field are neither altered nor removed unless specifically referred to by its `key` in the input request. Please note that the maximum number of `key`:`value` pairs that can be added to an `attributes` object is 100. Also, the overall size of `attributes` object should not exceed 65kb. |

#### Response Schema

| Field     | Type   | Description                                                                                                                                                                                                                                  |
| --------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `message` | string | Displays the error message in case of a failed request. If the request is successful, this field is not present in the response.                                                                                                             |
| `status`  | string | A string indicating the state of the response. On successful responses, the value will be `Ok`. Indicative error messages are returned for different errors. See the [API Error Codes](#api-error-codes) section below for more information. |

#### Sample API Request

```bash
curl --location --request PUT 'https://api.nextbillion.io/skynet/asset/4ba554b9-ef1c-48f0-9833-636edcf89256?key=<your_api_key>'
--header 'Content-Type: application/json'
--data-raw '{"name": "Delivery Vehicle 001",
"description": "This vehicle is used for restaurant delivery services",
"created_at": 1687104162,
"updated_at": 1687104162,
"attributes": {
    "driver_contact_no": "123-456-1234",
    "driver_name": "David Smith",
    "license": "AX 78 TR 5421",
    "vehicle_type": "pickup_truck"
}
}'
```

#### Sample API Response

```json
{
  "status": "Ok"
}
```

### Bind Device to Asset

This method is used to bind a GPS device to an `asset` where, a `device` is any physical GPS device capable of sending tracking information and an `asset` is any vehicle or moving object that needs to be tracked. An `asset` needs to be linked to a GPS device to be able to upload location information of its movement. Users can bind one `device` to multiple `assets`, but it is not recommended to do so simultaneously (lest multiple assets will have the same tracking information). The devices bound to assets can be updated from time to time as the business requirements change. Users can use this method to do so by providing the new `device_id` in the request body. The service will overwrite the existing `device_id`.

This method has applications in fleet management, asset tracking, logistics, supply chain management, asset security and field service management. It enables users to bind GPS devices to assets such as vehicles, equipment, or shipments, allowing real-time tracking, monitoring, and optimization of asset movement.

POST

https://api.nextbillion.io/skynet/asset/{id}/bind?key={your_api_key}

#### Request Parameter

| Name  | Required | Format and Usage | Description                                                                                                                                                                                                                                              |
| ----- | -------- | ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`  | Yes      | Type: `string`   | ID of `asset` to which a device needs to be linked. This is the same ID that was generated/provided at the time of creating the `asset`.                                                                                                                 |
| `key` | Yes      | Type: `string`   | A key is a unique identifier that is required to authenticate a request to the API. The namespace created using this key can be managed using the APIs & Services > Credentials section of user’s [NextBillion Console](https://console.nextbillion.ai). |

#### Request Body

| Field       | Type   | Description                                                                                                                                                                                                                        |
| ----------- | ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `device_id` | string | Device ID to be linked to the `asset` identified by `id`. Please note that the device needs to be linked to an `asset` before using it in the _Upload locations of an Asset_ method for sending GPS information about the `asset`. |

#### Response Schema

| Field     | Type   | Description                                                                                                                                                                                                                                  |
| --------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `message` | string | Displays the error message in case of a failed request. If the request is successful, this field is not present in the response.                                                                                                             |
| `status`  | string | A string indicating the state of the response. On successful responses, the value will be `Ok`. Indicative error messages are returned for different errors. See the [API Error Codes](#api-error-codes) section below for more information. |

#### Sample API Request

```bash
curl --location --request POST 'https://api.nextbillion.io/skynet/asset/4ba554b9-ef1c-48f0-9833-636edcf89256/bind?key=<your_api_key>' \
--header 'Content-Type: application/json' \
--data-raw '{
    "device_id":"A1_543XST2"
}'
```

#### Sample API Response

```json
{
  "status": "Ok"
}
```

### Delete An asset

Users can send a DELETE request with the `asset` id as a path parameter to delete an existing `asset`. For example, a logistics service provider can leverage this API method to delete assets such as delivery vehicles that are no longer needed or are beyond repair. Please note that on deleting an asset the related tracking data is also deleted.

DELETE

https://api.nextbillion.io/skynet/asset/{id}?key={your_api_key}

#### Request Parameter

| Name  | Required | Format and Usage | Description                                                                                                                                                                                                                                              |
| ----- | -------- | ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`  | Yes      | Type: `string`   | ID of the `asset` to be deleted. This is the same ID that was generated/provided at the time of creating the `asset`.                                                                                                                                    |
| `key` | Yes      | Type: `string`   | A key is a unique identifier that is required to authenticate a request to the API. The namespace created using this key can be managed using the APIs & Services > Credentials section of user’s [NextBillion Console](https://console.nextbillion.ai). |

#### Response Schema

| Field     | Type   | Description                                                                                                                                                                                                                                  |
| --------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `message` | string | Displays the error message in case of a failed request. If the request is successful, this field is not present in the response.                                                                                                             |
| `status`  | string | A string indicating the state of the response. On successful responses, the value will be `Ok`. Indicative error messages are returned for different errors. See the [API Error Codes](#api-error-codes) section below for more information. |

#### Sample API Request

```bash
curl --location --request DELETE 'https://api.nextbillion.io/skynet/asset/cc2987a9-5fc7-438c-b026-09792c6687f8?key=<your_api_key>'
```

#### Sample API Response

```json
{
  "status": "Ok"
}
```

### Get Asset List

Use this method to get a list of assets by sending a GET request with filter criteria properties as request parameters. The service returns a paginated response containing a list of assets along with details of their latest tracked location. The pagination feature allows users to break down the list of assets into smaller, more manageable subsets, making it easier for users to navigate through larger sets of data on their software applications or platforms. For example, a restaurant delivery service can use this API method to retrieve a list of all their available delivery vehicles that have specific area attributes. This would enable them to efficiently manage their fleet and ensure that all available vehicles are properly accounted for.

GET

https://api.nextbillion.io/skynet/asset/list?key={your_api_key}

#### Request Parameter

| Name                        | Required | Format and Usage                                                                                                                          | Description                                                                                                                                                                                                                                                                                                                                                                                          |
| --------------------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `key`                       | Yes      | Type: `string`                                                                                                                            | A key is a unique identifier that is required to authenticate a request to the API. The namespace created using this key can be managed using the APIs & Services > Credentials section of user’s [NextBillion Console](https://console.nextbillion.ai).                                                                                                                                             |
| `pn`                        | No       | Type: `integer`<br>Default: 1<br>Example: pn=5                                                                                            | Denotes page number. Use this along with the `ps` parameter to implement pagination for your searched results. This parameter does not have a maximum limit but would return an empty response in case a higher value is provided when the result-set itself is smaller.                                                                                                                             |
| `ps`                        | No       | Type: `integer`<br>Default: 20<br>Example: ps=25                                                                                          | Denotes number of search results per page. Use this along with the `pn` parameter to implement pagination for your searched results.                                                                                                                                                                                                                                                                 |
| `sort`                      | No       | Type: `string`<br>Default: created_at:desc<br>Format: field:order<br>Example: updated_at:desc                                             | Provide a single field to sort the results by. Only `updated_at` or `created_at` fields can be selected for ordering the results. By default, the result is sorted by `created_at` field in the descending order. Allowed values for specifying the order are `asc` for ascending order and `desc` for descending order.                                                                             |
| `include_all_of_attributes` | No       | Type: `string`<br>Format: key_1:value_1\|key_2:value_2<br>Example: include_all_of_attributes=vehicle_type:pickup_truck\|driver_name:John  | Use this parameter to filter the assets by their `attributes`. Only the assets having all the `attributes` added to this parameter, will be returned in the response. Multiple `attributes` can be separated using pipes (`\|`). Please note the attributes are case sensitive. Also, this parameter can not be used in conjunction with `include_any_of_attributes` parameter.                      |
| `include_any_of_attributes` | No       | Type: `string`<br>Format: key1:value1\|key2:value2\|...<br>Example: include_any_of_attributes=vehicle_type:pickup_truck\|driver_name:John | Use this parameter to filter the assets by their `attributes`. Assets having at least one of the `attributes` added to this parameter, will be returned in the response. Multiple `attributes` can be separated using pipes (`\|`). Please note the attributes are case sensitive. Also, this parameter can not be used in conjunction with `include_all_of_attributes` parameter.                   |
| `tags`                      | No       | Type: `string`<br>Example: tags=tag_1,tag_2                                                                                               | **This parameter will be deprecated soon! Please use the `include_all_of_attributes` or `include_any_of_attributes` parameters to provide labels or markers for the assets to be retrieved.** `tags` can be used to filter the assets. Only those assets which have all the `tags` provided, will be included in the result. In case multiple `tags` need to be specified, use `,` to separate them. |

#### Response Schema

| Field                                      | Type            | Description                                                                                                                                                                                                                                                                                                                                                                                                       |
| ------------------------------------------ | --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `status`                                   | string          | A string indicating the state of the response. On successful responses, the value will be `Ok`. Indicative error messages are returned for different errors. See the [API Error Codes](#api-error-codes) section below for more information.                                                                                                                                                                      |
| `data`                                     | object          | A data object containing the list of assets.                                                                                                                                                                                                                                                                                                                                                                      |
| `data.list`                                | array of object | An array of objects, with each object representing one `asset`.                                                                                                                                                                                                                                                                                                                                                   |
| `data.list[].id`                           | string          | ID of the `asset`. This is the same ID that was generated/provided at the time of creating the `asset`.                                                                                                                                                                                                                                                                                                           |
| `data.list[].device_id`                    | string          | ID of the `device` that is linked to this asset. Please note that there can be multiple `device_id` linked to a single `asset`. An empty response is returned if no devices are linked to the `asset`. User can link a device to an `asset` using the _Bind Asset to Device_ method.                                                                                                                              |
| `data.list[].state`                        | string          | State of the asset. It will be "active" when the asset is in use or available for use, and it will be "deleted" in case the asset has been deleted.                                                                                                                                                                                                                                                               |
| `data.list[].name`                         | string          | Name of the `asset`. The value would be the same as that provided for the `name` parameter at the time of creating or updating the `asset`.                                                                                                                                                                                                                                                                       |
| `data.list[].description`                  | string          | Description of the `asset`. The value would be the same as that provided for the `description` parameter at the time of creating or updating the `asset`.                                                                                                                                                                                                                                                         |
| `data.list[].created_at`                   | integer         | A UNIX epoch timestamp in seconds representing the time at which the `asset` was created.                                                                                                                                                                                                                                                                                                                         |
| `data.list[].updated_at`                   | integer         | A UNIX epoch timestamp in seconds representing the time at which the `asset` was last updated.                                                                                                                                                                                                                                                                                                                    |
| `data.list[].tracked_at`                   | integer         | A UNIX epoch timestamp in seconds representing the last time when the `asset` was tracked.                                                                                                                                                                                                                                                                                                                        |
| `data.list[].attributes`                   | object          | A string dictionary object containing `attributes` of the `asset`. These `attributes` were associated with the `asset` at the time of creating or updating it. `attributes` can be added to an `asset` using the _Update Asset Attributes_ method.                                                                                                                                                                |
| `data.list[].latest_location`              | object          | An object with details of the last tracked location of the asset.                                                                                                                                                                                                                                                                                                                                                 |
| `data.list[].latest_location.location`     | object          | An object with the coordinates of the last tracked location.                                                                                                                                                                                                                                                                                                                                                      |
| `data.list[].latest_location.location.lat` | number          | Latitude of the tracked location of the `asset`.                                                                                                                                                                                                                                                                                                                                                                  |
| `data.list[].latest_location.location.lon` | number          | Longitude of the tracked location of the `asset`.                                                                                                                                                                                                                                                                                                                                                                 |
| `data.list[].latest_location.timestamp`    | integer         | A UNIX epoch timestamp in milliseconds, representing the time at which the location was tracked.                                                                                                                                                                                                                                                                                                                  |
| `data.list[].latest_location.accuracy`     | number          | If available, this property returns the accuracy of the GPS information received at the last tracked location. It is represented as an estimated horizontal accuracy radius, in meters, at the 68th percentile confidence level.                                                                                                                                                                                  |
| `data.list[].latest_location.speed`        | number          | If available in the GPS information, this property returns the speed of the `asset`, in meters per second, at the last tracked location.                                                                                                                                                                                                                                                                          |
| `data.list[].latest_location.bearing`      | number          | If available in the GPS information, this property returns the heading of the `asset` calculated from true north in clockwise direction at the last tracked location. Please note that the bearing is not affected by the device orientation. The bearing will always be in the range of [0, 360).                                                                                                                |
| `data.list[].latest_location.altitude`     | number          | If available in the GPS information, this property returns the altitude of the `asset` at the last tracked location. It is represented as height, in meters, above the WGS84 reference ellipsoid.                                                                                                                                                                                                                 |
| `data.list[].tags`                         | array of string | **This parameter will be deprecated soon! Please move existing `tags` to `attributes` parameter.** Tags of the asset. These were associated with the `asset` when it was created or updated. `tags` can be used for filtering assets in operations like _Get Asset List_ and asset **Search** methods. They can also be used for monitoring of assets using **Monitor** methods after linking `tags` and `asset`. |
| `data.page`                                | object          | An object with pagination details of the search results. Use this object to implement pagination in your application.                                                                                                                                                                                                                                                                                             |
| `data.page.total`                          | integer         | An integer value indicating the total number of items available in the data set. This parameter can be used to calculate the total number of pages available.                                                                                                                                                                                                                                                     |
| `data.page.offset`                         | integer         | An integer value indicating the number of items that need to be skipped while displaying the results of the current page.                                                                                                                                                                                                                                                                                         |
| `data.page.page`                           | integer         | An integer value indicating the current page number (starting at 0).                                                                                                                                                                                                                                                                                                                                              |
| `data.page.size`                           | integer         | An integer value indicating the maximum number of items retrieved per `page`.                                                                                                                                                                                                                                                                                                                                     |
| `data.page.hasmore`                        | boolean         | A boolean value indicating whether there are more items available beyond the current page.                                                                                                                                                                                                                                                                                                                        |
| `message`                                  | string          | Displays the error message in case of a failed request. If the request is successful, this field is not present in the response.                                                                                                                                                                                                                                                                                  |

#### Sample API Request

```bash
curl --location 'https://api.nextbillion.io/skynet/asset/list?include_all_of_attributes=vehicle_type:mini-bus&sort=created_at:desc&ps=500&pn=1&key=<your_api_key>'
```

#### Sample API Response

```json
{
  "status": "Ok",
  "data": {
    "list": [
      {
        "id": "9cbd6ed2-bf74-4083-85c9-9638668ace2d",
        "device_id": "APL-14-iOS-D430NUA",
        "name": "Staff Transportation 002",
        "description": "This vehicle is used for transporting hospital staff",
        "created_at": 1699433870,
        "updated_at": 1699433982,
        "attributes": {
          "driver_contact_no": "546-602-158",
          "driver_name": "Jack Reacher",
          "license": "9 IB 3719",
          "vehicle_type": "mini-bus"
        },
        "latest_location": {
          "location": {
            "lat": 33.90542689,
            "lon": -118.23184349
          },
          "timestamp": 1686730017000,
          "accuracy": 7,
          "speed": 12,
          "bearing": 25,
          "altitude": 100.5,
          "meta_data": {
            "test": "destination_patient_address"
          }
        }
      },
      {
        "id": "9a869933-8330-410e-a657-ca07898e31b3",
        "device_id": "APL-14-iOS-X43V21F",
        "name": "Staff Transportation 001",
        "description": "This vehicle is used for transporting hotel staff",
        "created_at": 1699433640,
        "updated_at": 1699433731,
        "attributes": {
          "driver_contact_no": "595-232-764",
          "driver_name": "Jack Shipley",
          "license": "7 BA 3352",
          "vehicle_type": "mini-bus"
        },
        "latest_location": {
          "location": {
            "lat": 34.04510936036783,
            "lon": -118.26998982639944
          },
          "timestamp": 1686730017000,
          "accuracy": 7,
          "speed": 12,
          "bearing": 25,
          "altitude": 100.5,
          "meta_data": {
            "test": "destination"
          }
        }
      }
    ],
    "page": {
      "total": 2,
      "offset": 0,
      "page": 1,
      "size": 2,
      "hasmore": false
    }
  }
}
```

### Upload locations of an Asset

Use this method to upload location information for assets by sending a POST request with `asset` ID as a path parameter and the details of the location details in the request body. This API method is useful for building applications that require location-based tracking and monitoring, such as fleet management systems, asset tracking platforms, and logistics management solutions.

For example, when a delivery truck starts its journey, the API method is used to upload the truck's id or external_id, service_id, name along with current location data, such as timestamp, accuracy, speed, bearing, altitude, and metadata. As the truck continues on its journey, the API method can be used to upload the updated location data at regular intervals.
The restaurant delivery service provider can use this real-time location data to optimize delivery routes, track the progress of their delivery trucks, and ensure that deliveries are made on time.

POST

https://api.nextbillion.io/skynet/asset/{id}/track?key={your_api_key}

#### Request Parameter

| Name  | Required | Format and Usage | Description                                                                                                                                                                                                                                              |
| ----- | -------- | ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`  | Yes      | Type: `string`   | ID of the `asset` whose track information is to be uploaded. This is the same ID that was generated/provided at the time of creating the `asset`.                                                                                                        |
| `key` | Yes      | Type: `string`   | A key is a unique identifier that is required to authenticate a request to the API. The namespace created using this key can be managed using the APIs & Services > Credentials section of user’s [NextBillion Console](https://console.nextbillion.ai). |

#### Request Body

| Field                     | Type    | Description                                                                                                                                                                                                                                       |
| ------------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `locations`               | object  | An array of objects to collect the location tracking information for an `asset`. Each object must correspond to details of only one location.                                                                                                     |
| `locations.accuracy`      | number  | Use this parameter to provide the accuracy of the GPS information at the tracked location. It is the estimated horizontal accuracy radius, in meters.                                                                                             |
| `locations.altitude`      | number  | Use this parameter to provide the altitude, in meters, of the `asset` at the tracked location.                                                                                                                                                    |
| `locations.bearing`       | number  | Use this parameter to provide the heading of the `asset`, in radians, calculated from true north in clockwise direction. This should always be in the range of [0, 360).                                                                          |
| `locations.location`      | object  | An object to collect the coordinate details of the tracked location. Please note this field is mandatory when uploading locations for an asset.                                                                                                   |
| `locations.location.lat`  | number  | Latitude of the tracked location of the `asset`.                                                                                                                                                                                                  |
| `locations.location.lon`  | number  | Longitude of the tracked location of the `asset`.                                                                                                                                                                                                 |
| `locations.speed`         | number  | Use this parameter to provide the speed of the `asset`, in meters per second, at the tracked location.                                                                                                                                            |
| `locations.timestamp`     | integer | Use this parameter to provide the time, expressed as UNIX epoch timestamp in milliseconds, when the location was tracked. Please note this field is mandatory when uploading locations for an asset.                                              |
| `locations.meta_data`     | object  | Use this object to add any custom data about the location that is being uploaded. Recommended to use the `key`:`value` format for adding the desired information. Please note that the maximum size of `meta_data` object should not exceed 65Kb. |
| `locations.battery_level` | integer | Use this parameter to provide the battery level of the GPS device, as a percentage, when the location is tracked. It should have a minimum value of 0 and a maximum value of 100.                                                                 |
| `device_id`               | string  | ID of the device used to upload the tracking information of the `asset`. Please note that the `device_id` used here must already be linked to the `asset`. Use the _Bind Device to Asset_ method to link a device with your `asset`.              |

#### Response Schema

| Field     | Type   | Description                                                                                                                                                                                                                                  |
| --------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `message` | string | Displays the error message in case of a failed request. If the request is successful, this field is not present in the response.                                                                                                             |
| `status`  | string | A string indicating the state of the response. On successful responses, the value will be `Ok`. Indicative error messages are returned for different errors. See the [API Error Codes](#api-error-codes) section below for more information. |

#### Sample API Request

```bash
curl --location --request POST 'https://api.nextbillion.io/skynet/asset/4ba554b9-ef1c-48f0-9833-636edcf89256/track?key=<your_api_key>'
--header 'Content-Type: application/json' \
--data-raw '{
            "locations":[
                {
                "location":{
                    "lat": 34.06848239,
                    "lon":-118.30956508
                },
                "timestamp":1686729177000,
                "accuracy":2,
                "speed":5,
                "bearing":25,
                "altitude":110.5,
                "meta_data":{
                    "test": "sample_location_1"
                }
                },
                {
                "location":{
                    "lat": 34.04413804,
                    "lon": -118.30956508
                },
                "timestamp":1686729477000,
                "accuracy":1,
                "speed":8,
                "bearing":25,
                "altitude":110.5,
                "meta_data":{
                    "test": "sample_location_2"
                }
                },
                {
                "location":{
                    "lat": 34.02235033,
                    "lon": -118.30904957
                },
                "timestamp":1686730017000,
                "accuracy":7,
                "speed":12,
                "bearing":25,
                "altitude":100.5,
                "meta_data":{
                    "test": "sample_location_3"
                }
                },
                {
                "location":{
                    "lat": 34.03281768,
                    "lon": -118.30595651
                },
                "timestamp":1686730257000,
                "accuracy":5,
                "speed":4,
                "bearing":115,
                "altitude":89.0,
                "meta_data":{
                    "test": "sample_location_4"
                }
                },
                {
                "location":{
                    "lat": 34.02277760,
                    "lon": -118.28146978
                },
                "timestamp":1686730737000,
                "accuracy":2,
                "speed":9,
                "bearing":95,
                "altitude":68.0,
                "meta_data":{
                    "test": "sample_location_5"
                }
                }
            ],
            "device_id":"A1_543XST2"
        }'
```

#### Sample API Response

```json
{
  "status": "Ok"
}
```

### Track locations of an Asset

This method allows users to retrieve the location data of an `asset` within their software applications or platforms with pagination support. This API endpoint supports optional filters such as `start_time`, `end_time`, and `geometry_type`, providing users with more control over the returned data.
For example, a restaurant delivery service provider that wants to track the location of their delivery vehicle can use this method to retrieve the current and past locations of a vehicle, as well as additional details such as accuracy, speed, and timestamp. They can also filter the results based on specific timeframes and choose to display the location data in various formats such as polyline, polyline6, or geojson. This information can help the company optimize its delivery routes, estimate delivery times, and ensure that its trucks are operating efficiently.

GET

https://api.nextbillion.io/skynet/asset/{id}/location/list?key={your_api_key}

#### Request Parameter

| Name            | Required | Format and Usage                                                                                                                                                                  | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| --------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `id`            | Yes      | Type: `string`                                                                                                                                                                    | ID of the `asset` for which the location track information needs to be retrieved. This is the same ID that was generated/provided at the time of creating the `asset`.                                                                                                                                                                                                                                                                                                                                 |
| `key`           | Yes      | Type: `string`                                                                                                                                                                    | A key is a unique identifier that is required to authenticate a request to the API. The namespace created using this key can be managed using the APIs & Services > Credentials section of user’s [NextBillion Console](https://console.nextbillion.ai).                                                                                                                                                                                                                                               |
| `start_time`    | No       | Type: `integer`<br>Example: start_time=1672124157543                                                                                                                              | Time after which the tracked locations of the `asset` need to be retrieved.                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `end_time`      | No       | Type: `integer`<br>Example: end_time= 1672124157765                                                                                                                               | Time until which the tracked locations of the `asset` need to be retrieved.                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `geometry_type` | No       | Type: `string`<br>Default: polyline6<br>Allowed values: `polyline`, `polyline6`, `geojson`                                                                                        | Set the geometry format to encode the path linking the tracked locations of the `asset`. Please note that `geometry_type` is effective only when `mapmatch` property of `correction` parameter is set to 1. geometry format to encode the path linking the tracked locations of the asset.                                                                                                                                                                                                             |
| `correction`    | No       | Type: `string`<br>Default: mapmatch=0,interpolate=0,mode=car<br>Format: mapmatch=boolean,interpolate=boolean,mode=string<br>Example: correction=mapmatch=1,interpolate=0,mode=car | Describe the geometry characteristics through a `,` separated list of properties. Setting `mapmatch` to 1 returns the geometry of the tracked points, snapped to the nearest road. Setting `interpolate` to 1 smoothens the snapped geometry by adding more points, as needed. Please note, `mapmatch` should be set to 1 for `interpolate` to be effective. `mode` is used to set the transport mode for which the snapped route will be determined. Allowed values for `mode` are `car` and `truck`. |
| `pn`            | No       | Type: `integer`<br>Default: 1<br>Example: pn=5                                                                                                                                    | Denotes page number. Use this along with the `ps` parameter to implement pagination for your searched results. This parameter does not have a maximum limit but would return an empty response in case a higher value is provided when the result-set itself is smaller.                                                                                                                                                                                                                               |
| `ps`            | No       | Type: `integer`<br>Default: 20<br>Example: ps=200                                                                                                                                 | Denotes number of search results per page. Use this along with the `pn` parameter to implement pagination for your searched results.                                                                                                                                                                                                                                                                                                                                                                   |

#### Response Schema

| Field                                 | Type            | Description                                                                                                                                                                                                                                                                                                                     |
| ------------------------------------- | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `status`                              | string          | A string indicating the state of the response. On successful responses, the value will be `Ok`. Indicative error messages are returned for different errors. See the [API Error Codes](#api-error-codes) section below for more information.                                                                                    |
| `data`                                | object          | -                                                                                                                                                                                                                                                                                                                               |
| `data.list`                           | array of object | An array of objects with details of the tracked locations of the `asset`. Each object represents one tracked location.                                                                                                                                                                                                          |
| `data.list[].accuracy`                | number          | If available, this property returns the accuracy of the GPS information received at the tracked location. It is represented as an estimated horizontal accuracy radius, in meters, at the 68th percentile confidence level.                                                                                                     |
| `data.list[].altitude`                | number          | If available in the GPS information, this property returns the altitude of the `asset` at the tracked location. It is represented as height, in meters, above the WGS84 reference ellipsoid.                                                                                                                                    |
| `data.list[].bearing`                 | number          | If available in the GPS information, this property returns the heading of the `asset` calculated from true north in clockwise direction at the tracked location. Please note that the bearing is not affected by the device orientation. The bearing will always be in the range of [0, 360).                                   |
| `data.list[].location`                | object          | An object with the coordinates of the last tracked location.                                                                                                                                                                                                                                                                    |
| `data.list[].location.lat`            | number          | Latitude of the tracked location of the `asset`.                                                                                                                                                                                                                                                                                |
| `data.list[].location.lon`            | number          | Longitude of the tracked location of the `asset`.                                                                                                                                                                                                                                                                               |
| `data.list[].meta_data`               | object          | Specifies the custom data about the location that was added when the location was uploaded.                                                                                                                                                                                                                                     |
| `data.list[].speed`                   | number          | If available in the GPS information, this property returns the speed of the `asset`, in meters per second, at the tracked location.                                                                                                                                                                                             |
| `data.list[].timestamp`               | integer         | A UNIX epoch timestamp in milliseconds, representing the time at which the location was tracked.                                                                                                                                                                                                                                |
| `data.list[].battery_level`           | integer         | Returns the battery level of the GPS device, as a percentage, when the location was tracked. It has a minimum value of 0 and a maximum value of 100.                                                                                                                                                                            |
| `data.page`                           | object          | An object with pagination details of the search results. Use this object to implement pagination in your application.                                                                                                                                                                                                           |
| `data.page.total`                     | integer         | An integer value indicating the total number of items available in the data set. This parameter can be used to calculate the total number of pages available.                                                                                                                                                                   |
| `data.page.offset`                    | integer         | An integer value indicating the number of items that need to be skipped while displaying the results of the current page.                                                                                                                                                                                                       |
| `data.page.page`                      | integer         | An integer value indicating the current page number (starting at 0).                                                                                                                                                                                                                                                            |
| `data.page.size`                      | integer         | An integer value indicating the maximum number of items retrieved per `page`.                                                                                                                                                                                                                                                   |
| `data.page.hasmore`                   | boolean         | A boolean value indicating whether there are more items available beyond the current page.                                                                                                                                                                                                                                      |
| `data.distance`                       | number          | Distance of the path, in meters, formed by connecting all tracked locations returned. Please note that `distance` is returned only when the `mapmatch` property of `correction` parameter is set to 1.                                                                                                                          |
| `data.snapped_points`                 | array of object | An array of objects with details about the snapped points for each of the tracked locations returned for the `asset`. Please note that this property is returned only when the `mapmatch` property of `correction` parameter is set to 1.                                                                                       |
| `data.snapped_points[].bearing`       | string          | The bearing angle of the snapped point from the original tracked location, in radians. It indicates the direction of the snapped point.                                                                                                                                                                                         |
| `data.snapped_points[].distance`      | number          | The distance of the snapped point from the original tracked location, in meters.                                                                                                                                                                                                                                                |
| `data.snapped_points[].name`          | string          | The name of the street or road of the snapped point.                                                                                                                                                                                                                                                                            |
| `data.snapped_points[].originalIndex` | string          | The index of the tracked location to which this snapped point corresponds to.                                                                                                                                                                                                                                                   |
| `data.snapped_points[].location`      | object          | The latitude and longitude coordinates of the snapped point.                                                                                                                                                                                                                                                                    |
| `data.snapped_points[].location.lat`  | number          | Latitude of the snapped point.                                                                                                                                                                                                                                                                                                  |
| `data.snapped_points[].location.lon`  | number          | Longitude of the snapped point.                                                                                                                                                                                                                                                                                                 |
| `data.geojson`                        | object          | An object with geoJSON details of the route. It is returned only when the `mapmatch` property of the `correction` parameter is set to 1 and `geometry_type` is `geojson, otherwise it is not present in the response. The contents of this object follow the [geoJSON standard](https://datatracker.ietf.org/doc/html/rfc7946). |
| `data.geojson.type`                   | string          | Type of the geoJSON object.                                                                                                                                                                                                                                                                                                     |
| `data.geojson.geometry`               | object          | An object with details of the geoJSON geometry of the route.                                                                                                                                                                                                                                                                    |
| `data.geojson.geometry.type`          | string          | Type of the geoJSON geometry.                                                                                                                                                                                                                                                                                                   |
| `data.geojson.geometry.coordinates`   | array of number | An array of coordinates in the [longitude, latitude] format, representing the route geometry.                                                                                                                                                                                                                                   |
| `data.geometry`                       | array of string | Geometry of tracked locations in the requested format. It is returned only if the `mapmatch` property of the ‘correction’ parameter is set to 1.                                                                                                                                                                                |
| `message`                             | string          | Displays the error message in case of a failed request. If the request is successful, this field is not present in the response.                                                                                                                                                                                                |

#### Sample API Request

```bash
curl --location --request GET 'https://api.nextbillion.io/skynet/asset/4ba554b9-ef1c-48f0-9833-636edcf89256/location/list?key=<your_api_key>&geometry_type=geojson&correction=mapmatch=1,interpolate=1,mode=car'
```

#### Sample API Response

```json
{
  "status": "Ok",
  "data": {
    "list": [
      {
        "location": {
          "lat": 34.068482,
          "lon": -118.309565
        },
        "timestamp": 1686729177000,
        "accuracy": 2,
        "speed": 5,
        "bearing": 25,
        "altitude": 110.5
      },
      {
        "location": {
          "lat": 34.044138,
          "lon": -118.309565
        },
        "timestamp": 1686729477000,
        "accuracy": 1,
        "speed": 8,
        "bearing": 25,
        "altitude": 110.5
      },
      {
        "location": {
          "lat": 34.02235,
          "lon": -118.30905
        },
        "timestamp": 1686730017000,
        "accuracy": 7,
        "speed": 12,
        "bearing": 25,
        "altitude": 100.5
      },
      {
        "location": {
          "lat": 34.032818,
          "lon": -118.305957
        },
        "timestamp": 1686730257000,
        "accuracy": 5,
        "speed": 4,
        "bearing": 115,
        "altitude": 89
      },
      {
        "location": {
          "lat": 34.022778,
          "lon": -118.28147
        },
        "timestamp": 1686730737000,
        "accuracy": 2,
        "speed": 9,
        "bearing": 95,
        "altitude": 68
      }
    ],
    "page": {
      "total": 5,
      "offset": 0,
      "page": 1,
      "size": 5,
      "hasmore": false
    },
    "geojson": {
      "type": "Feature",
      "geometry": {
        "type": "MultiLineString",
        "coordinates": [
          [
            [-118.309654, 34.068268],
            [-118.30977, 34.067144],
            [-118.309106, 34.067151],
            [-118.309024, 34.044518],
            [-118.30889, 34.022806],
            [-118.308972, 34.032682],
            [-118.30604, 34.032705],
            [-118.306021, 34.030873],
            [-118.305375, 34.03087],
            [-118.305339, 34.025512],
            [-118.28817, 34.025437],
            [-118.281616, 34.022555]
          ]
        ]
      },
      "properties": null
    },
    "distance": 9626,
    "geometry": [
      "wqj~_Ajp`t`FfeAfFMoh@pek@cD~ki@kGghRbDm@gvDnqBe@Dkg@zmIgAtCap`@bsDsxK"
    ],
    "snapped_points": [
      {
        "bearing": 0,
        "distance": 25,
        "name": "",
        "originalIndex": 0,
        "location": {
          "lat": 34.068268,
          "lon": -118.309654
        }
      },
      {
        "bearing": 0,
        "distance": 65,
        "name": "S Western Ave",
        "originalIndex": 1,
        "location": {
          "lat": 34.044518,
          "lon": -118.309024
        }
      },
      {
        "bearing": 0,
        "distance": 52,
        "name": "W 36th St",
        "originalIndex": 2,
        "location": {
          "lat": 34.022806,
          "lon": -118.30889
        }
      },
      {
        "bearing": 0,
        "distance": 14,
        "name": "",
        "originalIndex": 3,
        "location": {
          "lat": 34.032705,
          "lon": -118.30604
        }
      },
      {
        "bearing": 0,
        "distance": 28,
        "name": "W Jefferson Blvd",
        "originalIndex": 4,
        "location": {
          "lat": 34.022555,
          "lon": -118.281616
        }
      }
    ]
  }
}
```

### Track the last location of an Asset

Use this method to get the last known location of an `asset` by sendinging the `id` of the `asset` as a path parameter to get the last tracked location of the `asset` along with its details such as accuracy, speed, bearing along with other details of the `asset`. If there are no tracking records for an asset, no location data will be returned.

Suppose you are developing a restaurant delivery management software and want to display the last location of each delivery vehicle in real-time to the users of your application. You can use this method to fetch the last known location of each vehicle and display it on a map interface in your application. This will provide your users with accurate and up-to-date information about the last location of their delivery vehicles.

GET

https://api.nextbillion.io/skynet/asset/{id}/location/last?key={your_api_key}

#### Request Parameter

| Name  | Required | Format and Usage | Description                                                                                                                                                                                                                                              |
| ----- | -------- | ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`  | Yes      | Type: `string`   | ID of the `asset` whose last location is to be retrieved. This is the same ID that was generated/provided at the time of creating the `asset`.                                                                                                           |
| `key` | Yes      | Type: `string`   | A key is a unique identifier that is required to authenticate a request to the API. The namespace created using this key can be managed using the APIs & Services > Credentials section of user’s [NextBillion Console](https://console.nextbillion.ai). |

#### Response Schema

| Field                         | Type    | Description                                                                                                                                                                                                                                                                                   |
| ----------------------------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `status`                      | string  | A string indicating the state of the response. On successful responses, the value will be `Ok`. Indicative error messages are returned for different errors. See the [API Error Codes](#api-error-codes) section below for more information.                                                  |
| `data`                        | object  | An object containing the information about the last tracked location of the requested `asset`.                                                                                                                                                                                                |
| `data.location`               | object  | An object with details of the tracked location. Please note that if there are no tracking records for an asset, no location data will be returned.                                                                                                                                            |
| `data.location.accuracy`      | number  | If available, this property returns the accuracy of the GPS information received at the tracked location. It is represented as an estimated horizontal accuracy radius, in meters, at the 68th percentile confidence level.                                                                   |
| `data.location.altitude`      | number  | If available in the GPS information, this property returns the altitude of the `asset` at the tracked location. It is represented as height, in meters, above the WGS84 reference ellipsoid.                                                                                                  |
| `data.location.bearing`       | number  | If available in the GPS information, this property returns the heading of the `asset` calculated from true north in clockwise direction at the tracked location. Please note that the bearing is not affected by the device orientation. The bearing will always be in the range of [0, 360). |
| `data.location.location`      | object  | An object with the coordinates of the last tracked location.                                                                                                                                                                                                                                  |
| `data.location.location.lat`  | number  | Latitude of the tracked location of the `asset`.                                                                                                                                                                                                                                              |
| `data.location.location.lon`  | number  | Longitude of the tracked location of the `asset`.                                                                                                                                                                                                                                             |
| `data.location.meta_data`     | object  | Specifies the custom data about the location that was added when the location was uploaded.                                                                                                                                                                                                   |
| `data.location.speed`         | number  | If available in the GPS information, this property returns the speed of the `asset`, in meters per second, at the tracked location.                                                                                                                                                           |
| `data.location.timestamp`     | integer | A UNIX epoch timestamp in milliseconds, representing the time at which the location was tracked.                                                                                                                                                                                              |
| `data.location.battery_level` | integer | Returns the battery level of the GPS device, as a percentage, when the location was tracked. It has a minimum value of 0 and a maximum value of 100.                                                                                                                                          |
| `message`                     | string  | Displays the error message in case of a failed request. If the request is successful, this field is not present in the response.                                                                                                                                                              |

#### Sample API Request

```bash
curl --location --request GET 'https://api.nextbillion.io/skynet/asset/4ba554b9-ef1c-48f0-9833-636edcf89256/location/last?key=<your_api_key>'
```

#### Sample API Response

```json
{
  "status": "Ok",
  "data": {
    "location": {
      "location": {
        "lat": 34.022778,
        "lon": -118.28147
      },
      "timestamp": 1686730737000,
      "accuracy": 2,
      "speed": 9,
      "bearing": 95,
      "altitude": 68
    }
  }
}
```

### Event History of an Asset

Use this method to get the history of an asset’s events. An event refers to an occurrence or incident that is detected by the tracking system in real-time. Live Tracking API can generate events when an asset

1. moves into or out of a monitored geofence
2. exceeds the specified speed limits
3. is idle for a specified amount of time

Events form a crucial aspect of Live Tracking, as they provide real-time information about the movement and status of assets, enabling businesses to optimize their operations, improve safety and provide better customer service.

Users can send a GET request along with an `asset` ID as a path parameter to retrieve the event history of an `asset` within their software applications or platforms with pagination support. This method is useful in building software applications that need to track the movement of their assets to make further decisions like tracking compliance, disbursing reimbursements, ensuring service delivery, etc.

GET

https://api.nextbillion.io/skynet/asset/{id}/event/list?key={your_api_key}

#### Request Parameter

| Name         | Required | Format and Usage                                 | Description                                                                                                                                                                                                                                                                                      |
| ------------ | -------- | ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `id`         | Yes      | Type: `string`                                   | ID of the `asset` whose event history needs to be fetched. This is the same ID that was generated/provided at the time of creating the `asset`.                                                                                                                                                  |
| `key`        | Yes      | Type: `string`                                   | A key is a unique identifier that is required to authenticate a request to the API. The namespace created using this key can be managed using the APIs & Services > Credentials section of user’s [NextBillion Console](https://console.nextbillion.ai).                                         |
| `monitor_id` | No       | Type: `string`                                   | Filter the events by `monitor_id`. When provided, only the events triggered by the `monitor` will be returned in response. Please note that if the `attributes` of the asset identified by `id` and those of the `monitor` do not match, then no events might be returned for this `monitor_id`. |
| `start_time` | No       | Type: `integer`<br>Example: 1577836800000        | Time after which the events triggered by the `asset` need to be retrieved.                                                                                                                                                                                                                       |
| `end_time`   | No       | Type: `integer`<br>Example: 1577836800000        | Time before which the events triggered by the `asset` need to be retrieved.                                                                                                                                                                                                                      |
| `pn`         | No       | Type: `integer`<br>Default: 1<br>Example: pn=5   | Denotes page number. Use this along with the `ps` parameter to implement pagination for your searched results. This parameter does not have a maximum limit but would return an empty response in case a higher value is provided when the result-set itself is smaller.                         |
| `ps`         | No       | Type: `integer`<br>Default: 20<br>Example: ps=25 | Denotes number of search results per page. Use this along with the `pn` parameter to implement pagination for your searched results.                                                                                                                                                             |

#### Response Schema

| Field                                         | Type            | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| --------------------------------------------- | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `status`                                      | string          | A string indicating the state of the response. On successful responses, the value will be `Ok`. Indicative error messages are returned for different errors. See the [API Error Codes](#api-error-codes) section below for more information.                                                                                                                                                                                                                                                                        |
| `data`                                        | object          | An object containing the information about the event history for the requested `asset`.                                                                                                                                                                                                                                                                                                                                                                                                                             |
| `data.list`                                   | array of object | An array of objects with each object on the list representing one event.                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `data.list[].asset_id`                        | string          | ID of the `asset`. This is the same ID that was generated/provided at the time of creating the `asset`.                                                                                                                                                                                                                                                                                                                                                                                                             |
| `data.list[].event_type`                      | string          | Nature of the event triggered by the `asset`. It can have following values: - `enter`: When the `asset` enters a specific geofence - `exit`: When the `asset` moves out of a specific geofence. - `speeding`: When the `asset` exceeds the certain speed limit. - `idle`: When the `asset` exhibits idle or no activity.                                                                                                                                                                                            |
| `data.list[].geofence_id`                     | string          | ID of the `geofence` associated with the event.                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| `data.list[].monitor_id`                      | string          | ID of the `monitor` associated with the event.                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `data.list[].monitor_tags`                    | array of string | Tags associated with the `monitor`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `data.list[].prev_location`                   | object          | An object with details of the `asset` at the last tracked location before the event was triggered.                                                                                                                                                                                                                                                                                                                                                                                                                  |
| `data.list[].prev_location.location`          | object          | `prev_location` information of the `asset`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `data.list[].prev_location.location.lat`      | number          | Latitude of the `prev_location` tracked for the `asset`.                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `data.list[].prev_location.location.lon`      | number          | Longitude of the `prev_location` tracked for the `asset`.                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `data.list[].prev_location.timestamp`         | integer         | A UNIX epoch timestamp in milliseconds representing the time at which the `asset` was at the `prev_location`.                                                                                                                                                                                                                                                                                                                                                                                                       |
| `data.list[].prev_location.speed`             | number          | If available, this property returns the speed of the `asset`, in meters per second, at the `prev_location` of the `asset`.                                                                                                                                                                                                                                                                                                                                                                                          |
| `data.list[].prev_location.bearing`           | number          | If available, this property returns the heading of the `asset` from true north in clockwise direction, at the `prev_location` tracked for the `asset`.                                                                                                                                                                                                                                                                                                                                                              |
| `data.list[].prev_location.meta_data`         | object          | Returns the custom data added during the location information upload.                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `data.list[].timestamp`                       | integer         | A UNIX epoch timestamp in milliseconds representing the time at which the event was added/created.                                                                                                                                                                                                                                                                                                                                                                                                                  |
| `data.list[].triggered_location`              | object          | An object with details of the `asset` at the location where the event was triggered.                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `data.list[].triggered_location.location`     | object          | An object with information about the location at which the event was triggered.                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| `data.list[].triggered_location.location.lat` | number          | Latitude of the `triggered_location` of the event.                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| `data.list[].triggered_location.location.lon` | number          | Longitude of the `triggered_location` of the event.                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `data.list[].triggered_location.timestamp`    | integer         | A UNIX epoch timestamp in milliseconds representing the time at which the `asset` was at the `triggered_location`.                                                                                                                                                                                                                                                                                                                                                                                                  |
| `data.list[].triggered_location.speed`        | number          | If available, this property returns the speed of the `asset`, in meters per second, when the event was triggered.                                                                                                                                                                                                                                                                                                                                                                                                   |
| `data.list[].triggered_location.bearing`      | number          | If available, this property returns the heading of the `asset` from true north in clockwise direction, when the event was triggered.                                                                                                                                                                                                                                                                                                                                                                                |
| `data.list[].triggered_location.meta_data`    | object          | Returns the custom data added during the location information upload.                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `data.list[].triggered_timestamp`             | integer         | A UNIX epoch timestamp in milliseconds representing the time at which the event was triggered.                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `data.list[].extra`                           | object          | Additional information about the event. Currently, this object returns the speed limit that was used to generate the over-speeding events, for a `speeding` type event. It is worth highlighting that, when the `use_admin_speed_limit` is `true`, the speed limit value will be obtained from the underlying road information. Whereas, if the `use_admin_speed_limit` is `false`, the speed limit will be equal to the `customer_speed_limit` value provided by the user when creating or updating the `monitor`. |
| `data.page`                                   | object          | An object with pagination details of the search results. Use this object to implement pagination in your application.                                                                                                                                                                                                                                                                                                                                                                                               |
| `data.page.total`                             | integer         | An integer value indicating the total number of items available in the data set. This parameter can be used to calculate the total number of pages available.                                                                                                                                                                                                                                                                                                                                                       |
| `data.page.offset`                            | integer         | An integer value indicating the number of items that need to be skipped while displaying the results of the current page.                                                                                                                                                                                                                                                                                                                                                                                           |
| `data.page.page`                              | integer         | An integer value indicating the current page number (starting at 0).                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `data.page.size`                              | integer         | An integer value indicating the maximum number of items retrieved per `page`.                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| `data.page.hasmore`                           | boolean         | A boolean value indicating whether there are more items available beyond the current page.                                                                                                                                                                                                                                                                                                                                                                                                                          |
| `message`                                     | string          | Displays the error message in case of a failed request. If the request is successful, this field is not present in the response.                                                                                                                                                                                                                                                                                                                                                                                    |

#### Sample API Request

```bash
curl --location --request GET 'https://api.nextbillion.io/skynet/asset/e232b966-b30c-49b9-9e11-56065409519e/event/list?key=<your_api_key>&monitor_id=6ef9582e-f75e-4ca1-b4f1-e3aedec7274e'
```

#### Sample API Response

```json
{
  "status": "Ok",
  "data": {
    "list": [
      {
        "asset_id": "e232b966-b30c-49b9-9e11-56065409519e",
        "geofence_id": "bb456968-476f-4f02-b9bb-cc1b0cf9e8cb",
        "monitor_id": "6ef9582e-f75e-4ca1-b4f1-e3aedec7274e",
        "monitor_tags": ["monitor_tag"],
        "event_type": "enter",
        "timestamp": 1684390206813,
        "triggered_timestamp": 1683035625000,
        "triggered_location": {
          "location": {
            "lat": 1.3624458701362037,
            "lon": 103.86785626672408
          },
          "timestamp": 1683035625000,
          "speed": 20
        },
        "prev_location": {
          "location": {
            "lat": 1.3636439655170736,
            "lon": 103.8684361783896
          },
          "timestamp": 1683035385000,
          "speed": 20
        }
      },
      {
        "asset_id": "e232b966-b30c-49b9-9e11-56065409519e",
        "geofence_id": "bb456968-476f-4f02-b9bb-cc1b0cf9e8cb",
        "monitor_id": "6ef9582e-f75e-4ca1-b4f1-e3aedec7274e",
        "monitor_tags": ["monitor_tag"],
        "event_type": "exit",
        "timestamp": 1684390206814,
        "triggered_timestamp": 1683035865000,
        "triggered_location": {
          "location": {
            "lat": 1.3617174213906844,
            "lon": 103.86685855925109
          },
          "timestamp": 1683035865000,
          "speed": 20
        },
        "prev_location": {
          "location": {
            "lat": 1.3624458701362037,
            "lon": 103.86785626672408
          },
          "timestamp": 1683035625000,
          "speed": 20
        }
      },
      {
        "asset_id": "e232b966-b30c-49b9-9e11-56065409519e",
        "geofence_id": "bb456968-476f-4f02-b9bb-cc1b0cf9e8cb",
        "monitor_id": "6ef9582e-f75e-4ca1-b4f1-e3aedec7274e",
        "monitor_tags": ["monitor_tag"],
        "event_type": "enter",
        "timestamp": 1684411136922,
        "triggered_timestamp": 1683035625000,
        "triggered_location": {
          "location": {
            "lat": 1.3624458701362037,
            "lon": 103.86785626672408
          },
          "timestamp": 1683035625000,
          "speed": 20
        },
        "prev_location": {
          "location": {
            "lat": 1.3636439655170736,
            "lon": 103.8684361783896
          },
          "timestamp": 1683035385000,
          "speed": 20
        }
      },
      {
        "asset_id": "e232b966-b30c-49b9-9e11-56065409519e",
        "geofence_id": "bb456968-476f-4f02-b9bb-cc1b0cf9e8cb",
        "monitor_id": "6ef9582e-f75e-4ca1-b4f1-e3aedec7274e",
        "monitor_tags": ["monitor_tag"],
        "event_type": "exit",
        "timestamp": 1684411136923,
        "triggered_timestamp": 1683035865000,
        "triggered_location": {
          "location": {
            "lat": 1.3617174213906844,
            "lon": 103.86685855925109
          },
          "timestamp": 1683035865000,
          "speed": 20
        },
        "prev_location": {
          "location": {
            "lat": 1.3624458701362037,
            "lon": 103.86785626672408
          },
          "timestamp": 1683035625000,
          "speed": 20
        }
      },
      {
        "asset_id": "e232b966-b30c-49b9-9e11-56065409519e",
        "geofence_id": "bb456968-476f-4f02-b9bb-cc1b0cf9e8cb",
        "monitor_id": "6ef9582e-f75e-4ca1-b4f1-e3aedec7274e",
        "monitor_tags": ["monitor_tag"],
        "event_type": "enter",
        "timestamp": 1684411905807,
        "triggered_timestamp": 1683035625000,
        "triggered_location": {
          "location": {
            "lat": 1.3624458701362037,
            "lon": 103.86785626672408
          },
          "timestamp": 1683035625000,
          "speed": 20
        },
        "prev_location": {
          "location": {
            "lat": 1.3636439655170736,
            "lon": 103.8684361783896
          },
          "timestamp": 1683035385000,
          "speed": 20
        }
      },
      {
        "asset_id": "e232b966-b30c-49b9-9e11-56065409519e",
        "geofence_id": "bb456968-476f-4f02-b9bb-cc1b0cf9e8cb",
        "monitor_id": "6ef9582e-f75e-4ca1-b4f1-e3aedec7274e",
        "monitor_tags": ["monitor_tag"],
        "event_type": "exit",
        "timestamp": 1684411905808,
        "triggered_timestamp": 1683035865000,
        "triggered_location": {
          "location": {
            "lat": 1.3617174213906844,
            "lon": 103.86685855925109
          },
          "timestamp": 1683035865000,
          "speed": 20
        },
        "prev_location": {
          "location": {
            "lat": 1.3624458701362037,
            "lon": 103.86785626672408
          },
          "timestamp": 1683035625000,
          "speed": 20
        }
      },
      {
        "asset_id": "e232b966-b30c-49b9-9e11-56065409519e",
        "geofence_id": "bb456968-476f-4f02-b9bb-cc1b0cf9e8cb",
        "monitor_id": "6ef9582e-f75e-4ca1-b4f1-e3aedec7274e",
        "monitor_tags": ["monitor_tag"],
        "event_type": "enter",
        "timestamp": 1684414999763,
        "triggered_timestamp": 1683035625000,
        "triggered_location": {
          "location": {
            "lat": 1.3624458701362037,
            "lon": 103.86785626672408
          },
          "timestamp": 1683035625000,
          "speed": 20
        },
        "prev_location": {
          "location": {
            "lat": 1.3636439655170736,
            "lon": 103.8684361783896
          },
          "timestamp": 1683035385000,
          "speed": 20
        }
      },
      {
        "asset_id": "e232b966-b30c-49b9-9e11-56065409519e",
        "geofence_id": "bb456968-476f-4f02-b9bb-cc1b0cf9e8cb",
        "monitor_id": "6ef9582e-f75e-4ca1-b4f1-e3aedec7274e",
        "monitor_tags": ["monitor_tag"],
        "event_type": "exit",
        "timestamp": 1684414999764,
        "triggered_timestamp": 1683035865000,
        "triggered_location": {
          "location": {
            "lat": 1.3617174213906844,
            "lon": 103.86685855925109
          },
          "timestamp": 1683035865000,
          "speed": 20
        },
        "prev_location": {
          "location": {
            "lat": 1.3624458701362037,
            "lon": 103.86785626672408
          },
          "timestamp": 1683035625000,
          "speed": 20
        }
      },
      {
        "asset_id": "e232b966-b30c-49b9-9e11-56065409519e",
        "geofence_id": "bb456968-476f-4f02-b9bb-cc1b0cf9e8cb",
        "monitor_id": "6ef9582e-f75e-4ca1-b4f1-e3aedec7274e",
        "monitor_tags": ["monitor_tag"],
        "event_type": "enter",
        "timestamp": 1684415045127,
        "triggered_timestamp": 1683035625000,
        "triggered_location": {
          "location": {
            "lat": 1.3624458701362037,
            "lon": 103.86785626672408
          },
          "timestamp": 1683035625000,
          "speed": 20
        },
        "prev_location": {
          "location": {
            "lat": 1.3636439655170736,
            "lon": 103.8684361783896
          },
          "timestamp": 1683035385000,
          "speed": 20
        }
      },
      {
        "asset_id": "e232b966-b30c-49b9-9e11-56065409519e",
        "geofence_id": "bb456968-476f-4f02-b9bb-cc1b0cf9e8cb",
        "monitor_id": "6ef9582e-f75e-4ca1-b4f1-e3aedec7274e",
        "monitor_tags": ["monitor_tag"],
        "event_type": "exit",
        "timestamp": 1684415045128,
        "triggered_timestamp": 1683035865000,
        "triggered_location": {
          "location": {
            "lat": 1.3617174213906844,
            "lon": 103.86685855925109
          },
          "timestamp": 1683035865000,
          "speed": 20
        },
        "prev_location": {
          "location": {
            "lat": 1.3624458701362037,
            "lon": 103.86785626672408
          },
          "timestamp": 1683035625000,
          "speed": 20
        }
      },
      {
        "asset_id": "e232b966-b30c-49b9-9e11-56065409519e",
        "geofence_id": "bb456968-476f-4f02-b9bb-cc1b0cf9e8cb",
        "monitor_id": "6ef9582e-f75e-4ca1-b4f1-e3aedec7274e",
        "monitor_tags": ["monitor_tag"],
        "event_type": "enter",
        "timestamp": 1684415297271,
        "triggered_timestamp": 1683035625000,
        "triggered_location": {
          "location": {
            "lat": 1.3624458701362037,
            "lon": 103.86785626672408
          },
          "timestamp": 1683035625000,
          "speed": 20
        },
        "prev_location": {
          "location": {
            "lat": 1.3636439655170736,
            "lon": 103.8684361783896
          },
          "timestamp": 1683035385000,
          "speed": 20
        }
      },
      {
        "asset_id": "e232b966-b30c-49b9-9e11-56065409519e",
        "geofence_id": "bb456968-476f-4f02-b9bb-cc1b0cf9e8cb",
        "monitor_id": "6ef9582e-f75e-4ca1-b4f1-e3aedec7274e",
        "monitor_tags": ["monitor_tag"],
        "event_type": "exit",
        "timestamp": 1684415297272,
        "triggered_timestamp": 1683035865000,
        "triggered_location": {
          "location": {
            "lat": 1.3617174213906844,
            "lon": 103.86685855925109
          },
          "timestamp": 1683035865000,
          "speed": 20
        },
        "prev_location": {
          "location": {
            "lat": 1.3624458701362037,
            "lon": 103.86785626672408
          },
          "timestamp": 1683035625000,
          "speed": 20
        }
      },
      {
        "asset_id": "e232b966-b30c-49b9-9e11-56065409519e",
        "geofence_id": "bb456968-476f-4f02-b9bb-cc1b0cf9e8cb",
        "monitor_id": "6ef9582e-f75e-4ca1-b4f1-e3aedec7274e",
        "monitor_tags": ["monitor_tag"],
        "event_type": "enter",
        "timestamp": 1684416246089,
        "triggered_timestamp": 1683035625000,
        "triggered_location": {
          "location": {
            "lat": 1.3624458701362037,
            "lon": 103.86785626672408
          },
          "timestamp": 1683035625000,
          "speed": 20
        },
        "prev_location": {
          "location": {
            "lat": 1.3636439655170736,
            "lon": 103.8684361783896
          },
          "timestamp": 1683035385000,
          "speed": 20
        }
      },
      {
        "asset_id": "e232b966-b30c-49b9-9e11-56065409519e",
        "geofence_id": "bb456968-476f-4f02-b9bb-cc1b0cf9e8cb",
        "monitor_id": "6ef9582e-f75e-4ca1-b4f1-e3aedec7274e",
        "monitor_tags": ["monitor_tag"],
        "event_type": "exit",
        "timestamp": 1684416246090,
        "triggered_timestamp": 1683035865000,
        "triggered_location": {
          "location": {
            "lat": 1.3617174213906844,
            "lon": 103.86685855925109
          },
          "timestamp": 1683035865000,
          "speed": 20
        },
        "prev_location": {
          "location": {
            "lat": 1.3624458701362037,
            "lon": 103.86785626672408
          },
          "timestamp": 1683035625000,
          "speed": 20
        }
      }
    ],
    "page": {
      "total": 24,
      "offset": 0,
      "page": 1,
      "size": 14,
      "hasmore": true
    }
  }
}
```

## Search

The Search service of Live Tracking API allows users to search for active assets within a specific area or a bounding box. It uses a specified search area to return a list of active assets that fall within it. An asset is considered active if it has been tracked (location uploaded) at least once during the last 7 days. Once a search request is submitted successfully, the service responds with a paginated result listing all the assets found. This can be particularly useful for applications that require proximity-based search functionality such as restaurant or store locators, or for tracking the location of assets in a fleet management system.

### Around Search

Use this method to search for active assets within a specified radius of a location coordinate. For example, a restaurant delivery service can search for all available delivery vehicles that are within a 5000 m radius of a specified location using this API method. They can also apply a filter to their search to only retrieve assets that are currently available for use. The API will return a list of available delivery vehicles within the specified radius along with their location, metadata, and other details allowing the company to plan its logistics more efficiently.

GET

https://api.nextbillion.io/skynet/search/around?center={center}&radius={radius}&key={your_api_key}

#### Request Parameter

| Name                        | Required | Format and Usage                                                                                                                          | Description                                                                                                                                                                                                                                                                                                                                                                                                                       |
| --------------------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `key`                       | Yes      | Type: `string`                                                                                                                            | A key is a unique identifier that is required to authenticate a request to the API. The namespace created using this key can be managed using the APIs & Services > Credentials section of user’s [NextBillion Console](https://console.nextbillion.ai).                                                                                                                                                                          |
| `radius`                    | Yes      | Type: `number`                                                                                                                            | Radius, in meters, of the circular area to be searched.                                                                                                                                                                                                                                                                                                                                                                           |
| `center`                    | Yes      | Type: `string`<br>Format: latitude,longitude<br>Example: 56.597801,43.967836                                                              | Location coordinates of the point which would act as the center of the circular area to be searched.                                                                                                                                                                                                                                                                                                                              |
| `ps`                        | No       | Type: `integer`<br>Default: 20<br>Example: ps=25                                                                                          | Denotes number of search results per page. Use this along with the `pn` parameter to implement pagination for your searched results.                                                                                                                                                                                                                                                                                              |
| `pn`                        | No       | Type: `integer`<br>Default: 1<br>Example: pn=5                                                                                            | Denotes page number. Use this along with the `ps` parameter to implement pagination for your searched results. This parameter does not have a maximum limit but would return an empty response in case a higher value is provided when the result-set itself is smaller.                                                                                                                                                          |
| `include_any_of_attributes` | No       | Type: `string`<br>Format: key1:value1\|key2:value2\|...<br>Example: include_any_of_attributes=vehicle_type:pickup_truck\|driver_name:John | Use this parameter to filter the assets found inside the specified area by their `attributes`. Assets having at least one of the `attributes` added to this parameter, will be returned in the search results. Multiple `attributes` can be separated using pipes (`\|`). Please note the attributes are case sensitive. Also, this parameter can not be used in conjunction with `include_all_of_attributes` parameter.          |
| `include_all_of_attributes` | No       | Type: `string`<br>Format: key_1:value_1\|key_2:value_2<br>Example: include_all_of_attributes=vehicle_type:pickup_truck\|driver_name:John  | Use this parameter to filter the assets found inside the specified area by their `attributes`. Only the assets having all the `attributes` that are added to this parameter, will be returned in the search results. Multiple `attributes` can be separated using pipes (`\|`). Please note the attributes are case sensitive. Also, this parameter can not be used in conjunction with `include_any_of_attributes` parameter.    |
| `sort_by`                   | No       | Type: `string`<br>Allowed values: `distance`, `duration`, `straight_distance`<br>Example: sort_by=duration                                | Specify the metric to sort the assets returned in the search result. The valid values are:<br>_ **distance**: Sorts the assets by driving distance to the given `sort_destination`.<br>_ **duration**: Sorts the assets by travel time to the given `sort_destination`.<br>\* **straight_distance**: Sort the assets by straight-line distance to the given `sort-destination`.                                                   |
| `sort_driving_mode`         | No       | Type: `string`<br>Default: car<br>Allowed values: `car`, `truck`                                                                          | Specifies the driving mode to be used for determining travel duration or driving distance for sorting the assets in search result.                                                                                                                                                                                                                                                                                                |
| `sort_destination`          | No       | Type: `string`<br>Format: latitude,lontitude<br>Example: sort_destination= 34.0241,-118.2550                                              | Specifies the location coordinates of the point which acts as destination for sorting the assets in the search results. The service will sort each asset based on the driving distance or travel time to this destination, from its current location. Use the `sort_by` parameter to configure the metric that should be used for sorting the assets. Please note that `sort_destination` is required when `sort_by` is provided. |
| `filter`                    | No       | Type: `string`<br>Format: filter=tag:value_1,value_2...<br>Example: filter=tag:delivery,truck                                             | **`tags` parameter will be deprecated soon! Please use the `include_any_of_attributes` or `include_all_of_attributes` parameters to match assets based on their labels or markers.** Use this parameter to filter the assets found inside the specified area by their `tags`. Multiple `tags` can be separated using commas (`,`). Please note the tags are case sensitive.                                                       |

#### Response Schema

| Field                                         | Type            | Description                                                                                                                                                                                                                                                                                   |
| --------------------------------------------- | --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `status`                                      | string          | A string indicating the state of the response. On successful responses, the value will be `Ok`. Indicative error messages are returned for different errors. See the [API Error Codes](#api-error-codes) section below for more information.                                                  |
| `message`                                     | string          | Displays the error message in case of a failed request. If the request is successful, this field is not present in the response.                                                                                                                                                              |
| `data`                                        | object          | A data object containing the search result.                                                                                                                                                                                                                                                   |
| `data.assets`                                 | array of object | An array of objects with details of the asset(s) returned in the search result. Each object represents one `asset`                                                                                                                                                                            |
| `data.assets[].id`                            | string          | ID of `asset` which was last located inside the specified area in the input request. This is the same ID that was generated/provided at the time of creating the `asset`.                                                                                                                     |
| `data.assets[].name`                          | string          | Name of `asset`. The value would be the same as that provided for the `name` parameter at the time of creating or updating the `asset`.                                                                                                                                                       |
| `data.assets[].description`                   | string          | Description of the `asset`. The value would be the same as that provided for the `description` parameter at the time of creating or updating the `asset`.                                                                                                                                     |
| `data.assets[].latest_location`               | object          | An object with details of the tracked location. Please note that if there are no tracking records for an asset, no location data will be returned.                                                                                                                                            |
| `data.assets[].latest_location.accuracy`      | number          | If available, this property returns the accuracy of the GPS information received at the tracked location. It is represented as an estimated horizontal accuracy radius, in meters, at the 68th percentile confidence level.                                                                   |
| `data.assets[].latest_location.altitude`      | number          | If available in the GPS information, this property returns the altitude of the `asset` at the tracked location. It is represented as height, in meters, above the WGS84 reference ellipsoid.                                                                                                  |
| `data.assets[].latest_location.bearing`       | number          | If available in the GPS information, this property returns the heading of the `asset` calculated from true north in clockwise direction at the tracked location. Please note that the bearing is not affected by the device orientation. The bearing will always be in the range of [0, 360). |
| `data.assets[].latest_location.location`      | object          | An object with the coordinates of the last tracked location.                                                                                                                                                                                                                                  |
| `data.assets[].latest_location.location.lat`  | number          | Latitude of the tracked location of the `asset`.                                                                                                                                                                                                                                              |
| `data.assets[].latest_location.location.lon`  | number          | Longitude of the tracked location of the `asset`.                                                                                                                                                                                                                                             |
| `data.assets[].latest_location.meta_data`     | object          | Specifies the custom data about the location that was added when the location was uploaded.                                                                                                                                                                                                   |
| `data.assets[].latest_location.speed`         | number          | If available in the GPS information, this property returns the speed of the `asset`, in meters per second, at the tracked location.                                                                                                                                                           |
| `data.assets[].latest_location.timestamp`     | integer         | A UNIX epoch timestamp in milliseconds, representing the time at which the location was tracked.                                                                                                                                                                                              |
| `data.assets[].latest_location.battery_level` | integer         | Returns the battery level of the GPS device, as a percentage, when the location was tracked. It has a minimum value of 0 and a maximum value of 100.                                                                                                                                          |
| `data.assets[].created_at`                    | integer         | A UNIX timestamp in seconds representing the time at which the `asset` was created.                                                                                                                                                                                                           |
| `data.assets[].updated_at`                    | integer         | A UNIX timestamp in seconds representing the time at which the `asset` was last updated.                                                                                                                                                                                                      |
| `data.assets[].tracked_at`                    | integer         | A UNIX epoch timestamp in seconds representing the last time when the `asset` was tracked.                                                                                                                                                                                                    |
| `data.assets[].ranking_info`                  | object          | An object returning the sorting details of the asset as per the configuration specified in the input.                                                                                                                                                                                         |
| `data.assets[].ranking_info.index`            | integer         | Index of the ranked asset. The index value starts from 0.                                                                                                                                                                                                                                     |
| `data.assets[].ranking_info.distance`         | number          | Driving distance between the asset and the `sort_destination`.                                                                                                                                                                                                                                |
| `data.assets[].ranking_info.duration`         | number          | Driving duration between the asset and the `sort_destination`. Please note this field in not returned in the response when `sort_by = straight_distance` .                                                                                                                                    |
| `data.assets[].tags`                          | array of string | **This parameter will be deprecated soon! Please move existing `tags` to `attributes` parameter.** Tags associated with the `asset`.                                                                                                                                                          |
| `data.page`                                   | object          | An object with pagination details of the search results. Use this object to implement pagination in your application.                                                                                                                                                                         |
| `data.page.total`                             | integer         | An integer value indicating the total number of items available in the data set. This parameter can be used to calculate the total number of pages available.                                                                                                                                 |
| `data.page.offset`                            | integer         | An integer value indicating the number of items that need to be skipped while displaying the results of the current page.                                                                                                                                                                     |
| `data.page.page`                              | integer         | An integer value indicating the current page number (starting at 0).                                                                                                                                                                                                                          |
| `data.page.size`                              | integer         | An integer value indicating the maximum number of items retrieved per `page`.                                                                                                                                                                                                                 |
| `data.page.hasmore`                           | boolean         | A boolean value indicating whether there are more items available beyond the current page.                                                                                                                                                                                                    |

#### Sample API Request

```bash
curl --location 'https://api.nextbillion.io/skynet/search/around?key=<your_api_key>&center=34.04937853,-118.27333793&radius=5000&include_all_of_attributes=driver_name:John Blake|vehicle_type:Pickup'
```

#### Sample API Response

```json
{
  "status": "Ok",
  "msg": "",
  "data": {
    "assets": [
      {
        "id": "a39f8299-e19a-4484-9775-be8ae40f75c9",
        "device_id": "ADR-10-SND-SAM031",
        "name": "Staff Transportation 002",
        "description": "Live Tracking Around Search",
        "latest_location": {
          "location": {
            "lat": 34.04909446,
            "lon": -118.27008086
          },
          "timestamp": 1701100800000,
          "accuracy": 2,
          "speed": 5,
          "bearing": 25,
          "altitude": 110.5,
          "meta_data": {
            "test": "sample_location"
          }
        },
        "attributes": {
          "driver_contact_no": "422-761-938",
          "driver_name": "John Blake",
          "license": "2 BR 2049",
          "vehicle_type": "Pickup"
        },
        "created_at": 1694541056,
        "updated_at": 1694541187
      }
    ],
    "page": {
      "total": 1,
      "offset": 0,
      "page": 1,
      "size": 1,
      "hasmore": false
    }
  }
}
```

### Bound Search

Use this method to search for active assets within a specified geographic boundary. It takes a `bound` parameter which is a pipe (|) delimited string of two latitude and longitude coordinates, the first being the southwest coordinate and the second being the northeast coordinate of the bounding box. Please note that the bounding box area is limited to a maximum of 3000 km2. The API also supports filtering the search results based on multiple conditions specified in the ‘filter’ parameter as a pipe-delimited string of key-value pairs. Once a valid request is submitted, the service responds with a paginated list of assets found within the specified bound.

This service can be useful to, for example, a restaurant delivery service may use this API method to find all their delivery vehicles that are currently within a specific area. They can use the bound parameter to specify the coordinates of the boundary that defines the area and filter the search results to only include bikes or trucks. This would allow the service to efficiently allocate its resources and optimize its delivery routes. The API method returns a response with information about each asset that matches the search criteria including the asset's ID, name, last tracked location, and any `attributes` attached to the `asset`.

GET

https://api.nextbillion.io/skynet/search/bound?bound={bound}&key={your_api_key}

#### Request Parameter

| Name                        | Required | Format and Usage                                                                                                                          | Description                                                                                                                                                                                                                                                                                                                                                                                                                       |
| --------------------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `key`                       | Yes      | Type: `string`                                                                                                                            | A key is a unique identifier that is required to authenticate a request to the API. The namespace created using this key can be managed using the APIs & Services > Credentials section of user’s [NextBillion Console](https://console.nextbillion.ai).                                                                                                                                                                          |
| `bound`                     | Yes      | Type: `string`<br>Format: latitude_1,longitude_2\|latitude_1,longitude_2<br>Example: bounds=44.7664,-0.6941\|44.9206,-0.4639              | Specify two, pipe (\|) delimited location coordinates which would act as corners of the bounding box area to be searched. The first one should be the southwest coordinate of the `bounds` and the second one should be the northeast coordinate of the `bounds`.                                                                                                                                                                 |
| `ps`                        | No       | Type: `integer`<br>Default: 20<br>Example: ps=25                                                                                          | Denotes number of search results per page. Use this along with the `pn` parameter to implement pagination for your searched results.                                                                                                                                                                                                                                                                                              |
| `pn`                        | No       | Type: `integer`<br>Default: 1<br>Example: pn=5                                                                                            | Denotes page number. Use this along with the `ps` parameter to implement pagination for your searched results. This parameter does not have a maximum limit but would return an empty response in case a higher value is provided when the result-set itself is smaller.                                                                                                                                                          |
| `include_any_of_attributes` | No       | Type: `string`<br>Format: key1:value1\|key2:value2\|...<br>Example: include_any_of_attributes=vehicle_type:pickup_truck\|driver_name:John | Use this parameter to filter the assets found inside the specified area by their `attributes`. Assets having at least one of the `attributes` added to this parameter, will be returned in the search results. Multiple `attributes` can be separated using pipes (`\|`). Please note the attributes are case sensitive. Also, this parameter can not be used in conjunction with `include_all_of_attributes` parameter.          |
| `include_all_of_attributes` | No       | Type: `string`<br>Format: key_1:value_1\|key_2:value_2<br>Example: include_all_of_attributes=vehicle_type:pickup_truck\|driver_name:John  | Use this parameter to filter the assets found inside the specified area by their `attributes`. Only the assets having all the `attributes` that are added to this parameter, will be returned in the search results. Multiple `attributes` can be separated using pipes (`\|`). Please note the attributes are case sensitive. Also, this parameter can not be used in conjunction with `include_any_of_attributes` parameter.    |
| `sort_by`                   | No       | Type: `string`<br>Allowed values: `distance`, `duration`, `straight_distance`<br>Example: sort_by=duration                                | Specify the metric to sort the assets returned in the search result. The valid values are:<br> _ **distance**: Sorts the assets by driving distance to the given `sort_destination`.<br> _ **duration**: Sorts the assets by travel time to the given `sort_destination`.<br> \* **straight_distance**: Sort the assets by straight-line distance to the given `sort-destination`.                                                |
| `sort_driving_mode`         | No       | Type: `string`<br>Default: car<br>Allowed values: `car`, `truck`                                                                          | Specifies the driving mode to be used for determining travel duration or driving distance for sorting the assets in search result.                                                                                                                                                                                                                                                                                                |
| `sort_destination`          | No       | Type: `string`<br>Format: latitude,lontitude<br>Example: sort_destination= 34.0241,-118.2550                                              | Specifies the location coordinates of the point which acts as destination for sorting the assets in the search results. The service will sort each asset based on the driving distance or travel time to this destination, from its current location. Use the `sort_by` parameter to configure the metric that should be used for sorting the assets. Please note that `sort_destination` is required when `sort_by` is provided. |
| `filter`                    | No       | Type: `string`<br>Format: `filter=tag:value_1,value_2...`<br>Example: `filter=tag:delivery,truck`                                         | **`tags` parameter will be deprecated soon! Please use the `include_any_of_attributes` or `include_all_of_attributes` parameters to match assets based on their labels or markers.** Use this parameter to filter the assets found inside the specified area by their `tags`. Multiple `tags` can be separated using commas (`,`). Please note the tags are case sensitive.                                                       |

#### Response Schema

| Field                                         | Type            | Description                                                                                                                                                                                                                                                                                   |
| --------------------------------------------- | --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `status`                                      | string          | A string indicating the state of the response. On successful responses, the value will be `Ok`. Indicative error messages are returned for different errors. See the [API Error Codes](#api-error-codes) section below for more information.                                                  |
| `message`                                     | string          | Displays the error message in case of a failed request. If the request is successful, this field is not present in the response.                                                                                                                                                              |
| `data`                                        | object          | A data object containing the search result.                                                                                                                                                                                                                                                   |
| `data.assets`                                 | array of object | An array of objects with details of the asset(s) returned in the search result. Each object represents one `asset`                                                                                                                                                                            |
| `data.assets[].id`                            | string          | ID of `asset` which was last located inside the specified area in the input request. This is the same ID that was generated/provided at the time of creating the `asset`.                                                                                                                     |
| `data.assets[].name`                          | string          | Name of `asset`. The value would be the same as that provided for the `name` parameter at the time of creating or updating the `asset`.                                                                                                                                                       |
| `data.assets[].description`                   | string          | Description of the `asset`. The value would be the same as that provided for the `description` parameter at the time of creating or updating the `asset`.                                                                                                                                     |
| `data.assets[].latest_location`               | object          | An object with details of the tracked location. Please note that if there are no tracking records for an asset, no location data will be returned.                                                                                                                                            |
| `data.assets[].latest_location.accuracy`      | number          | If available, this property returns the accuracy of the GPS information received at the tracked location. It is represented as an estimated horizontal accuracy radius, in meters, at the 68th percentile confidence level.                                                                   |
| `data.assets[].latest_location.altitude`      | number          | If available in the GPS information, this property returns the altitude of the `asset` at the tracked location. It is represented as height, in meters, above the WGS84 reference ellipsoid.                                                                                                  |
| `data.assets[].latest_location.bearing`       | number          | If available in the GPS information, this property returns the heading of the `asset` calculated from true north in clockwise direction at the tracked location. Please note that the bearing is not affected by the device orientation. The bearing will always be in the range of [0, 360). |
| `data.assets[].latest_location.location`      | object          | An object with the coordinates of the last tracked location.                                                                                                                                                                                                                                  |
| `data.assets[].latest_location.location.lat`  | number          | Latitude of the tracked location of the `asset`.                                                                                                                                                                                                                                              |
| `data.assets[].latest_location.location.lon`  | number          | Longitude of the tracked location of the `asset`.                                                                                                                                                                                                                                             |
| `data.assets[].latest_location.meta_data`     | object          | Specifies the custom data about the location that was added when the location was uploaded.                                                                                                                                                                                                   |
| `data.assets[].latest_location.speed`         | number          | If available in the GPS information, this property returns the speed of the `asset`, in meters per second, at the tracked location.                                                                                                                                                           |
| `data.assets[].latest_location.timestamp`     | integer         | A UNIX epoch timestamp in milliseconds, representing the time at which the location was tracked.                                                                                                                                                                                              |
| `data.assets[].latest_location.battery_level` | integer         | Returns the battery level of the GPS device, as a percentage, when the location was tracked. It has a minimum value of 0 and a maximum value of 100.                                                                                                                                          |
| `data.assets[].created_at`                    | integer         | A UNIX timestamp in seconds representing the time at which the `asset` was created.                                                                                                                                                                                                           |
| `data.assets[].updated_at`                    | integer         | A UNIX timestamp in seconds representing the time at which the `asset` was last updated.                                                                                                                                                                                                      |
| `data.assets[].tracked_at`                    | integer         | A UNIX epoch timestamp in seconds representing the last time when the `asset` was tracked.                                                                                                                                                                                                    |
| `data.assets[].ranking_info`                  | object          | An object returning the sorting details of the asset as per the configuration specified in the input.                                                                                                                                                                                         |
| `data.assets[].ranking_info.index`            | integer         | Index of the ranked asset. The index value starts from 0.                                                                                                                                                                                                                                     |
| `data.assets[].ranking_info.distance`         | number          | Driving distance between the asset and the `sort_destination`.                                                                                                                                                                                                                                |
| `data.assets[].ranking_info.duration`         | number          | Driving duration between the asset and the `sort_destination`. Please note this field in not returned in the response when `sort_by = straight_distance` .                                                                                                                                    |
| `data.assets[].tags`                          | array of string | **This parameter will be deprecated soon! Please move existing `tags` to `attributes` parameter.** Tags associated with the `asset`.                                                                                                                                                          |
| `data.page`                                   | object          | An object with pagination details of the search results. Use this object to implement pagination in your application.                                                                                                                                                                         |
| `data.page.total`                             | integer         | An integer value indicating the total number of items available in the data set. This parameter can be used to calculate the total number of pages available.                                                                                                                                 |
| `data.page.offset`                            | integer         | An integer value indicating the number of items that need to be skipped while displaying the results of the current page.                                                                                                                                                                     |
| `data.page.page`                              | integer         | An integer value indicating the current page number (starting at 0).                                                                                                                                                                                                                          |
| `data.page.size`                              | integer         | An integer value indicating the maximum number of items retrieved per `page`.                                                                                                                                                                                                                 |
| `data.page.hasmore`                           | boolean         | A boolean value indicating whether there are more items available beyond the current page.                                                                                                                                                                                                    |

#### Sample API Request

```bash
curl --location 'https://api.nextbillion.io/skynet/search/bound?bound=34.04497533,-118.27710928|34.05875233,-118.26048106&include_all_of_attributes=driver_name:John Blake|vehicle_type:Pickup&key=<your_api_key>'
```

#### Sample API Response

```json
{
  "status": "Ok",
  "msg": "",
  "data": {
    "assets": [
      {
        "id": "a39f8299-e19a-4484-9775-be8ae40f75c9",
        "device_id": "ADR-10-SND-SAM031",
        "name": "Staff Transportation 002",
        "description": "Live Tracking Bound Search",
        "latest_location": {
          "location": {
            "lat": 34.04909446,
            "lon": -118.27008086
          },
          "timestamp": 1701100800000,
          "accuracy": 2,
          "speed": 5,
          "bearing": 25,
          "altitude": 110.5,
          "meta_data": {
            "test": "sample_location"
          }
        },
        "attributes": {
          "driver_contact_no": "422-761-938",
          "driver_name": "John Blake",
          "license": "2 BR 2049",
          "vehicle_type": "Pickup"
        },
        "created_at": 1694541056,
        "updated_at": 1694541187
      }
    ],
    "page": {
      "total": 1,
      "offset": 0,
      "page": 1,
      "size": 1,
      "hasmore": false
    }
  }
}
```

### GET Polygon Search

The "Polygon Search" API method allows you to search for active assets within a polygon defined by a set of coordinates. With this API, you can filter active assets based on multiple conditions and retrieve information like asset name, description, last tracked location, `tags`, and `attributes`.

This API is particularly useful for businesses that need to track assets and equipment in specific geographical areas. Please note that the search polygon size is limited to a maximum area of 3000 km2. For example, a restaurant delivery service can use this API to locate all their delivery vehicles within a specific delivery zone. In addition to location tracking, this API also enables the filtering of assets based on different parameters such as the asset's creation and update time, tags, and other details which can help the restaurant delivery service provider to efficiently manage their assets and delivery operations.

GET

https://api.nextbillion.io/skynet/search/polygon?polygon={polygon}&key={your_api_key}

#### Request Parameter

| Name                        | Required | Format and Usage                                                                                                                                                                      | Description                                                                                                                                                                                                                                                                                                                                                                                                                       |
| --------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `key`                       | Yes      | Type: `string`                                                                                                                                                                        | A key is a unique identifier that is required to authenticate a request to the API. The namespace created using this key can be managed using the APIs & Services > Credentials section of user’s [NextBillion Console](https://console.nextbillion.ai).                                                                                                                                                                          |
| `polygon`                   | Yes      | Type: `string`<br>Format: latitude_1,longitude_1\|latitude_2,longitude_2\|...<br>Example: polygon=17.4239,78.4590\|17.4575,78.4624\|17.4547,78.5483\|17.4076,78.5527\|17.4239,78.4590 | Define a custom polygon enclosing the area to be searched. It should be a pipe (`\|`) delimited list of location coordinates. Please ensure that the `polygon` provided is enclosed. This can be achieved by making the last location coordinate in the list equal to the first location coordinate of the list. Please note that the maximum area of the search polygon allowed is 3000 km<sup>2</sup>.                          |
| `pn`                        | No       | Type: `integer`<br>Default: 1<br>Example: pn=5                                                                                                                                        | Denotes page number. Use this along with the `ps` parameter to implement pagination for your searched results. This parameter does not have a maximum limit but would return an empty response in case a higher value is provided when the result-set itself is smaller.                                                                                                                                                          |
| `ps`                        | No       | Type: `integer`<br>Default: 20<br>Example: ps=25                                                                                                                                      | Denotes number of search results per page. Use this along with the `pn` parameter to implement pagination for your searched results.                                                                                                                                                                                                                                                                                              |
| `include_any_of_attributes` | No       | Type: `string`<br>Format: key1:value1\|key2:value2\|...<br>Example: include_any_of_attributes=vehicle_type:pickup_truck\|driver_name:John                                             | Use this parameter to filter the assets found inside the specified area by their `attributes`. Assets having at least one of the `attributes` added to this parameter, will be returned in the search results. Multiple `attributes` can be separated using pipes (`\|`). Please note the attributes are case sensitive. Also, this parameter can not be used in conjunction with `include_all_of_attributes` parameter.          |
| `include_all_of_attributes` | No       | Type: `string`<br>Format: key_1:value_1\|key_2:value_2<br>Example: include_all_of_attributes=vehicle_type:pickup_truck\|driver_name:John                                              | Use this parameter to filter the assets found inside the specified area by their `attributes`. Only the assets having all the `attributes` that are added to this parameter, will be returned in the search results. Multiple `attributes` can be separated using pipes (`\|`). Please note the attributes are case sensitive. Also, this parameter can not be used in conjunction with `include_any_of_attributes` parameter.    |
| `sort_by`                   | No       | Type: `string`<br>Allowed values: `distance`, `duration`, `straight_distance`<br>Example: sort_by=duration                                                                            | Specify the metric to sort the assets returned in the search result. The valid values are:<br> _ **distance**: Sorts the assets by driving distance to the given `sort_destination`.<br> _ **duration**: Sorts the assets by travel time to the given `sort_destination`.<br> \* **straight_distance**: Sort the assets by straight-line distance to the given `sort_destination`.                                                |
| `sort_driving_mode`         | No       | Type: `string`<br>Default: car<br>Allowed values: `car`, `truck`                                                                                                                      | Specifies the driving mode to be used for determining travel duration or driving distance for sorting the assets in search result.                                                                                                                                                                                                                                                                                                |
| `sort_destination`          | No       | Type: `string`<br>Format: latitude,lontitude<br>Example: sort_destination= 34.0241,-118.2550                                                                                          | Specifies the location coordinates of the point which acts as destination for sorting the assets in the search results. The service will sort each asset based on the driving distance or travel time to this destination, from its current location. Use the `sort_by` parameter to configure the metric that should be used for sorting the assets. Please note that `sort_destination` is required when `sort_by` is provided. |
| `filter`                    | No       | Type: `string`<br>Format: `filter=tag:value_1,value_2...`<br>Example: `filter=tag:delivery,truck`                                                                                     | **`tags` parameter will be deprecated soon! Please use the `include_any_of_attributes` or `include_all_of_attributes` parameters to match assets based on their labels or markers.** Use this parameter to filter the assets found inside the specified area by their `tags`. Multiple `tags` can be separated using commas (`,`). Please note the tags are case sensitive.                                                       |

#### Response Schema

| Field                                         | Type            | Description                                                                                                                                                                                                                                                                                   |
| --------------------------------------------- | --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `status`                                      | string          | A string indicating the state of the response. On successful responses, the value will be `Ok`. Indicative error messages are returned for different errors. See the [API Error Codes](#api-error-codes) section below for more information.                                                  |
| `message`                                     | string          | Displays the error message in case of a failed request. If the request is successful, this field is not present in the response.                                                                                                                                                              |
| `data`                                        | object          | A data object containing the search result.                                                                                                                                                                                                                                                   |
| `data.assets`                                 | array of object | An array of objects with details of the asset(s) returned in the search result. Each object represents one `asset`                                                                                                                                                                            |
| `data.assets[].id`                            | string          | ID of `asset` which was last located inside the specified area in the input request. This is the same ID that was generated/provided at the time of creating the `asset`.                                                                                                                     |
| `data.assets[].name`                          | string          | Name of `asset`. The value would be the same as that provided for the `name` parameter at the time of creating or updating the `asset`.                                                                                                                                                       |
| `data.assets[].description`                   | string          | Description of the `asset`. The value would be the same as that provided for the `description` parameter at the time of creating or updating the `asset`.                                                                                                                                     |
| `data.assets[].latest_location`               | object          | An object with details of the tracked location. Please note that if there are no tracking records for an asset, no location data will be returned.                                                                                                                                            |
| `data.assets[].latest_location.accuracy`      | number          | If available, this property returns the accuracy of the GPS information received at the tracked location. It is represented as an estimated horizontal accuracy radius, in meters, at the 68th percentile confidence level.                                                                   |
| `data.assets[].latest_location.altitude`      | number          | If available in the GPS information, this property returns the altitude of the `asset` at the tracked location. It is represented as height, in meters, above the WGS84 reference ellipsoid.                                                                                                  |
| `data.assets[].latest_location.bearing`       | number          | If available in the GPS information, this property returns the heading of the `asset` calculated from true north in clockwise direction at the tracked location. Please note that the bearing is not affected by the device orientation. The bearing will always be in the range of [0, 360). |
| `data.assets[].latest_location.location`      | object          | An object with the coordinates of the last tracked location.                                                                                                                                                                                                                                  |
| `data.assets[].latest_location.location.lat`  | number          | Latitude of the tracked location of the `asset`.                                                                                                                                                                                                                                              |
| `data.assets[].latest_location.location.lon`  | number          | Longitude of the tracked location of the `asset`.                                                                                                                                                                                                                                             |
| `data.assets[].latest_location.meta_data`     | object          | Specifies the custom data about the location that was added when the location was uploaded.                                                                                                                                                                                                   |
| `data.assets[].latest_location.speed`         | number          | If available in the GPS information, this property returns the speed of the `asset`, in meters per second, at the tracked location.                                                                                                                                                           |
| `data.assets[].latest_location.timestamp`     | integer         | A UNIX epoch timestamp in milliseconds, representing the time at which the location was tracked.                                                                                                                                                                                              |
| `data.assets[].latest_location.battery_level` | integer         | Returns the battery level of the GPS device, as a percentage, when the location was tracked. It has a minimum value of 0 and a maximum value of 100.                                                                                                                                          |
| `data.assets[].created_at`                    | integer         | A UNIX timestamp in seconds representing the time at which the `asset` was created.                                                                                                                                                                                                           |
| `data.assets[].updated_at`                    | integer         | A UNIX timestamp in seconds representing the time at which the `asset` was last updated.                                                                                                                                                                                                      |
| `data.assets[].tracked_at`                    | integer         | A UNIX epoch timestamp in seconds representing the last time when the `asset` was tracked.                                                                                                                                                                                                    |
| `data.assets[].ranking_info`                  | object          | An object returning the sorting details of the asset as per the configuration specified in the input.                                                                                                                                                                                         |
| `data.assets[].ranking_info.index`            | integer         | Index of the ranked asset. The index value starts from 0.                                                                                                                                                                                                                                     |
| `data.assets[].ranking_info.distance`         | number          | Driving distance between the asset and the `sort_destination`.                                                                                                                                                                                                                                |
| `data.assets[].ranking_info.duration`         | number          | Driving duration between the asset and the `sort_destination`. Please note this field in not returned in the response when `sort_by = straight_distance` .                                                                                                                                    |
| `data.assets[].tags`                          | array of string | **This parameter will be deprecated soon! Please move existing `tags` to `attributes` parameter.** Tags associated with the `asset`.                                                                                                                                                          |
| `data.page`                                   | object          | An object with pagination details of the search results. Use this object to implement pagination in your application.                                                                                                                                                                         |
| `data.page.total`                             | integer         | An integer value indicating the total number of items available in the data set. This parameter can be used to calculate the total number of pages available.                                                                                                                                 |
| `data.page.offset`                            | integer         | An integer value indicating the number of items that need to be skipped while displaying the results of the current page.                                                                                                                                                                     |
| `data.page.page`                              | integer         | An integer value indicating the current page number (starting at 0).                                                                                                                                                                                                                          |
| `data.page.size`                              | integer         | An integer value indicating the maximum number of items retrieved per `page`.                                                                                                                                                                                                                 |
| `data.page.hasmore`                           | boolean         | A boolean value indicating whether there are more items available beyond the current page.                                                                                                                                                                                                    |

#### Sample API Request

```bash
curl --location 'https://api.nextbillion.io/skynet/search/polygon?key=<your_api_key>&polygon=34.05875233,-118.26048106|34.04611166,-118.25533831|34.02778645,-118.25705256|34.02991749,-118.30796578|34.07309507,-118.30796578|34.05875233,-118.26048106&include_all_of_attributes=driver_name:John Blake|vehicle_type:Pickup'
```

#### Sample API Response

```json
{
  "status": "Ok",
  "msg": "",
  "data": {
    "assets": [
      {
        "id": "a39f8299-e19a-4484-9775-be8ae40f75c9",
        "device_id": "ADR-10-SND-SAM031",
        "name": "Staff Transportation 002",
        "description": "Live Tracking Polygon Search",
        "latest_location": {
          "location": {
            "lat": 34.04909446,
            "lon": -118.27008086
          },
          "timestamp": 1701100800000,
          "accuracy": 2,
          "speed": 5,
          "bearing": 25,
          "altitude": 110.5,
          "meta_data": {
            "test": "sample_location"
          }
        },
        "attributes": {
          "driver_contact_no": "422-761-938",
          "driver_name": "John Blake",
          "license": "2 BR 2049",
          "vehicle_type": "Pickup"
        },
        "created_at": 1694541056,
        "updated_at": 1694541187
      }
    ],
    "page": {
      "total": 1,
      "offset": 0,
      "page": 1,
      "size": 1,
      "hasmore": false
    }
  }
}
```

### POST Polygon Search

POST Polygon Search allows users to search for active assets in a large polygon with many coordinates. The underlying behavior is similar to the GET method. It is recommended to use the POST method in case of large or complex polygons with a big set of boundary coordinates which, otherwise, may cause the request to breach the URL limits of a GET endpoint. You can also use this method if you prefer to input polygon boundaries in GeoJSON format. Please note that the search polygon size is limited to a maximum area of 3000 km2.

POST

https://api.nextbillion.io/skynet/search/polygon?key={your_api_key}

#### Request Parameter

| Name  | Required | Format and Usage | Description                                                                                                                                                                                                                                              |
| ----- | -------- | ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `key` | Yes      | Type: `string`   | A key is a unique identifier that is required to authenticate a request to the API. The namespace created using this key can be managed using the APIs & Services > Credentials section of user’s [NextBillion Console](https://console.nextbillion.ai). |

#### Request Body

| Field                                    | Type            | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| ---------------------------------------- | --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `polygon`                                | object          | An object to collect geoJSON details of a custom polygon. Please ensure that: - the `polygon` provided is enclosed. This can be achieved by making the last location coordinate in the list equal to the first location coordinate of the list. - the 'polygon' provided does not contain multiple rings. The contents of this object follow the [geoJSON standard](https://datatracker.ietf.org/doc/html/rfc7946). Please note that the maximum area of the search polygon allowed is 3000 km<sup>2</sup>. |
| `polygon.type`                           | string          | Type of the geoJSON geometry. Should always be `polygon`.                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `polygon.coordinates`                    | array of number | An array of coordinates in the [longitude, latitude] format, representing the polygon boundary.                                                                                                                                                                                                                                                                                                                                                                                                             |
| `filter`                                 | string          | **`tags` parameter will be deprecated soon! Please use the `include_any_of_attributes` or `include_all_of_attributes` parameters to match assets based on their labels or markers.** Use this parameter to filter the assets found inside the specified area by their `tag`. Multiple `tag` can be separated using comma (`,`). Please note the tags are case sensitive.                                                                                                                                    |
| `match_filter`                           | object          | An object to define the `attributes` which will be used to filter the assets found within the `polygon`.                                                                                                                                                                                                                                                                                                                                                                                                    |
| `match_filter.include_all_of_attributes` | string          | Use this parameter to filter the assets found inside the specified area by their `attributes`. Only the assets having all the `attributes` that are added to this parameter, will be returned in the search results. Multiple `attributes` can be separated using commas (`,`). Please note the attributes are case sensitive. Also, this parameter can not be used in conjunction with `include_any_of_attributes` parameter.                                                                              |
| `match_filter.include_any_of_attributes` | string          | Use this parameter to filter the assets found inside the specified area by their `attributes`. Assets having at least one of the `attributes` added to this parameter, will be returned in the search results. Multiple `attributes` can be separated using commas (`,`). Please note the attributes are case sensitive. Also, this parameter can not be used in conjunction with `include_all_of_attributes` parameter.                                                                                    |
| `pn`                                     | integer         | Denotes page number. Use this along with the `ps` parameter to implement pagination for your searched results. This parameter does not have a maximum limit but would return an empty response in case a higher value is provided when the result-set itself is smaller.                                                                                                                                                                                                                                    |
| `ps`                                     | integer         | Denotes number of search results per page. Use this along with the `pn` parameter to implement pagination for your searched results. Please note that `ps` has a default value of 20 and accepts integers only in the range of [1, 100].                                                                                                                                                                                                                                                                    |
| `sort`                                   | object          | -                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `sort.sort_by`                           | string          | Specify the metric to sort the assets returned in the search result. The valid values are: _ **distance** : Sorts the assets by driving distance to the given `sort_destination` . _ **duration** : Sorts the assets by travel time to the given `sort_destination` . \* **straight_distance** : Sort the assets by straight-line distance to the given `sort-destination` .                                                                                                                                |
| `sort.sort_destination`                  | object          | Specifies the location coordinates of the point which acts as destination for sorting the assets in the search results. The service will sort each asset based on the driving distance or travel time to this destination, from its current location. Use the `sort_by` parameter to configure the metric that should be used for sorting the assets. Please note that `sort_destination` is required when `sort_by` is provided.                                                                           |
| `sort.sort_destination.lat`              | number          | Latitude of the destination location                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| `sort.sort_destination.lon`              | number          | Longitude of the destination location                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| `sort.sort_driving_mode`                 | string          | Specifies the driving mode to be used for determining travel duration or driving distance for sorting the assets in search result.                                                                                                                                                                                                                                                                                                                                                                          |

#### Response Schema

| Field                                         | Type            | Description                                                                                                                                                                                                                                                                                   |
| --------------------------------------------- | --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `status`                                      | string          | A string indicating the state of the response. On successful responses, the value will be `Ok`. Indicative error messages are returned for different errors. See the [API Error Codes](#api-error-codes) section below for more information.                                                  |
| `message`                                     | string          | Displays the error message in case of a failed request. If the request is successful, this field is not present in the response.                                                                                                                                                              |
| `data`                                        | object          | A data object containing the search result.                                                                                                                                                                                                                                                   |
| `data.assets`                                 | array of object | An array of objects with details of the asset(s) returned in the search result. Each object represents one `asset`                                                                                                                                                                            |
| `data.assets[].id`                            | string          | ID of `asset` which was last located inside the specified area in the input request. This is the same ID that was generated/provided at the time of creating the `asset`.                                                                                                                     |
| `data.assets[].name`                          | string          | Name of `asset`. The value would be the same as that provided for the `name` parameter at the time of creating or updating the `asset`.                                                                                                                                                       |
| `data.assets[].description`                   | string          | Description of the `asset`. The value would be the same as that provided for the `description` parameter at the time of creating or updating the `asset`.                                                                                                                                     |
| `data.assets[].latest_location`               | object          | An object with details of the tracked location. Please note that if there are no tracking records for an asset, no location data will be returned.                                                                                                                                            |
| `data.assets[].latest_location.accuracy`      | number          | If available, this property returns the accuracy of the GPS information received at the tracked location. It is represented as an estimated horizontal accuracy radius, in meters, at the 68th percentile confidence level.                                                                   |
| `data.assets[].latest_location.altitude`      | number          | If available in the GPS information, this property returns the altitude of the `asset` at the tracked location. It is represented as height, in meters, above the WGS84 reference ellipsoid.                                                                                                  |
| `data.assets[].latest_location.bearing`       | number          | If available in the GPS information, this property returns the heading of the `asset` calculated from true north in clockwise direction at the tracked location. Please note that the bearing is not affected by the device orientation. The bearing will always be in the range of [0, 360). |
| `data.assets[].latest_location.location`      | object          | An object with the coordinates of the last tracked location.                                                                                                                                                                                                                                  |
| `data.assets[].latest_location.location.lat`  | number          | Latitude of the tracked location of the `asset`.                                                                                                                                                                                                                                              |
| `data.assets[].latest_location.location.lon`  | number          | Longitude of the tracked location of the `asset`.                                                                                                                                                                                                                                             |
| `data.assets[].latest_location.meta_data`     | object          | Specifies the custom data about the location that was added when the location was uploaded.                                                                                                                                                                                                   |
| `data.assets[].latest_location.speed`         | number          | If available in the GPS information, this property returns the speed of the `asset`, in meters per second, at the tracked location.                                                                                                                                                           |
| `data.assets[].latest_location.timestamp`     | integer         | A UNIX epoch timestamp in milliseconds, representing the time at which the location was tracked.                                                                                                                                                                                              |
| `data.assets[].latest_location.battery_level` | integer         | Returns the battery level of the GPS device, as a percentage, when the location was tracked. It has a minimum value of 0 and a maximum value of 100.                                                                                                                                          |
| `data.assets[].created_at`                    | integer         | A UNIX timestamp in seconds representing the time at which the `asset` was created.                                                                                                                                                                                                           |
| `data.assets[].updated_at`                    | integer         | A UNIX timestamp in seconds representing the time at which the `asset` was last updated.                                                                                                                                                                                                      |
| `data.assets[].tracked_at`                    | integer         | A UNIX epoch timestamp in seconds representing the last time when the `asset` was tracked.                                                                                                                                                                                                    |
| `data.assets[].ranking_info`                  | object          | An object returning the sorting details of the asset as per the configuration specified in the input.                                                                                                                                                                                         |
| `data.assets[].ranking_info.index`            | integer         | Index of the ranked asset. The index value starts from 0.                                                                                                                                                                                                                                     |
| `data.assets[].ranking_info.distance`         | number          | Driving distance between the asset and the `sort_destination`.                                                                                                                                                                                                                                |
| `data.assets[].ranking_info.duration`         | number          | Driving duration between the asset and the `sort_destination`. Please note this field in not returned in the response when `sort_by = straight_distance` .                                                                                                                                    |
| `data.assets[].tags`                          | array of string | **This parameter will be deprecated soon! Please move existing `tags` to `attributes` parameter.** Tags associated with the `asset`.                                                                                                                                                          |
| `data.page`                                   | object          | An object with pagination details of the search results. Use this object to implement pagination in your application.                                                                                                                                                                         |
| `data.page.total`                             | integer         | An integer value indicating the total number of items available in the data set. This parameter can be used to calculate the total number of pages available.                                                                                                                                 |
| `data.page.offset`                            | integer         | An integer value indicating the number of items that need to be skipped while displaying the results of the current page.                                                                                                                                                                     |
| `data.page.page`                              | integer         | An integer value indicating the current page number (starting at 0).                                                                                                                                                                                                                          |
| `data.page.size`                              | integer         | An integer value indicating the maximum number of items retrieved per `page`.                                                                                                                                                                                                                 |
| `data.page.hasmore`                           | boolean         | A boolean value indicating whether there are more items available beyond the current page.                                                                                                                                                                                                    |

#### Sample API Request

```bash
curl --location 'https://api.nextbillion.io/skynet/search/polygon?key=<your_api_key>' \
--header 'Content-Type: application/json' \
--data '{
    "polygon":{
        "type":"polygon",
        "coordinates":[
            [
            [
             -118.26048106,
             34.05875233
            ],
            [
                -118.25533831,
                34.04611166
            ],
            [
                -118.25705256,
                34.02778645
            ],
            [
                -118.30796578,
                34.02991749
            ],
            [
                -118.30796578,
                34.07309507
            ],
            [
                -118.26048106,
                34.05875233
            ]
        ]
        ]
    },
    "match_filter":{
    "include_all_of_attributes":{
                "driver_name": "John Blake",
                "vehicle_type": "Pickup"
                }
}
}
```

#### Sample Response

```json
{
  "status": "Ok",
  "msg": "",
  "data": {
    "assets": [
      {
        "id": "a39f8299-e19a-4484-9775-be8ae40f75c9",
        "device_id": "ADR-10-SND-SAM031",
        "name": "Staff Transportation 002",
        "description": "Live Tracking Polygon Search",
        "latest_location": {
          "location": {
            "lat": 34.04909446,
            "lon": -118.27008086
          },
          "timestamp": 1701100800000,
          "accuracy": 2,
          "speed": 5,
          "bearing": 25,
          "altitude": 110.5,
          "meta_data": {
            "test": "sample_location"
          }
        },
        "attributes": {
          "driver_contact_no": "422-761-938",
          "driver_name": "John Blake",
          "license": "2 BR 2049",
          "vehicle_type": "Pickup"
        },
        "created_at": 1694541056,
        "updated_at": 1694541187
      }
    ],
    "page": {
      "total": 1,
      "offset": 0,
      "page": 1,
      "size": 1,
      "hasmore": false
    }
  }
}
```

## Monitor

The monitor service of Live Tracking API is a feature that enables users to define and manage monitoring zones or geofences for tracking assets in real-time. A geofence is a virtual boundary that can be defined around a specific area, such as a building, a parking lot, or a city block. When an asset enters or exits the geofence, the monitoring service generates an event that can be captured by the Live Tracking API. The monitoring service also allows tracking the asset activity while it is on move through the idle and speeding alerts.

The Monitor service can be used in a variety of industries such as logistics, transportation, and security, to track and monitor the movement of assets in real-time. For example, a logistics company may use the monitor service to track the movement of its delivery trucks and monitor their arrival and departure from different warehouses or distribution centers. A security company may use the monitor service to set up speeding and idle alerts to track the movements and flag any suspicious activity by the asset.

Let’s take a look at the methods and properties available for leveraging the Monitor service.

### Create a Monitor

This method enables users to create monitors that track specific activities, providing valuable functionality for various purposes. It is particularly beneficial for managing vehicle fleets, tracking deliveries and monitoring equipment in restricted areas. By assigning `attributes` to monitors, users can conveniently monitor assets that share common `attributes`, facilitating collective monitoring of asset activities. For instance, `attributes` like "shift_1" or "area_Los Angeles" can be employed to group assets and monitor their activities efficiently. The method also allows users to specify the `type` of activity the monitor should detect, enabling focused monitoring of specific events. For example, a monitor can be configured to create an event when an asset enters a geofence, enabling accurate tracking of asset movements or track the speed of the asset while it is moving or just raise a flag when it is idle.

POST

https://api.nextbillion.io/skynet/monitor?key={your_api_key}

#### Request Parameter

| Name  | Required | Format and Usage | Description                                                                                                                                                                                                                                              |
| ----- | -------- | ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `key` | Yes      | Type: `string`   | A key is a unique identifier that is required to authenticate a request to the API. The namespace created using this key can be managed using the APIs & Services > Credentials section of user’s [NextBillion Console](https://console.nextbillion.ai). |

#### Request Body

| Field                                    | Type            | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| ---------------------------------------- | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `custom_id`                              | string          | Set a unique ID for the new `monitor`. If not provided, an ID will be automatically generated in UUID format. A valid `custom_id` can contain letters, numbers, "-", & "\_" only. Please note that the ID of an `monitor` can not be changed once it is created.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| `type`                                   | string          | Specify the type of activity the `monitor` would detect. The `monitor` will be able to detect the specified `type` of activity and create events for eligible `asset`. A `monitor` can detect following types of asset activity: - `enter`: The `monitor` will create an event when a linked `asset` enters into the specified geofence. - `exit`: The `monitor` will create an event when a linked `asset` exits the specified geofence. - `enter_and_exit`: The `monitor` will create an event when a linked `asset` either enters or exits the specified geofence. - `speeding`: The `monitor` will create an event when a linked `asset` exceeds a given speed limit. - `idle`: The `monitor` will create an event when a linked `asset` exhibits idle activity. Please note that `assets` and geofences can be linked to a `monitor` using the `match_filter` and `geofence_config` attributes respectively.                                                                                                                                                                                            |
| `tags`                                   | array of string | Use this parameter to add `tags` to the `monitor`. `tags` can be used for filtering monitors in the _Get Monitor List_ operation. They can also be used for easy identification of monitors. Please note that valid `tags` are strings, consisting of alphanumeric characters (A-Z, a-z, 0-9) along with the underscore ('\_') and hyphen ('-') symbols.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| `description`                            | string          | Add a description for your `monitor` using this parameter.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `name`                                   | string          | Name of the `monitor`. Use this field to assign a meaningful, custom name to the `monitor` being created.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `match_filter`                           | object          | This object is used to identify the asset(s) on which the `monitor` would be applied.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| `match_filter.include_all_of_attributes` | object          | A string type dictionary object to specify the `attributes`. Only the assets having all of the `attributes` added to this parameter will be linked to this `monitor`. Once an `asset` is linked to a `monitor`, the `monitor` will be able to create events for that `asset` whenever an activity specified in `type` is detected. Multiple attributes should be separated by a comma `,`. Please note that this parameter can not be used in conjunction with `include_any_of_attributes`. Also, the maximum number of `key`:`value` pairs that this parameter can take is 100 and the overall size of the `match_filter` object should not exceed 65kb.                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `match_filter.include_any_of_attributes` | object          | A string type dictionary object to specify the `attributes`. The assets having at least one of the `attributes` added to this parameter will be linked to this `monitor`. Once an `asset` is linked to a `monitor`, the `monitor` will be able to create events for that `asset` whenever an activity specified in `type` is detected. Multiple attributes should be separated by a comma `,`. Please note that this parameter can not be used in conjunction with `include_all_of_attributes`. Also, the maximum number of `key`:`value` pairs that this parameter can take is 100 and the overall size of the `match_filter` object should not exceed 65kb.                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `speeding_config`                        | object          | `speeding_config` is used to set up constraints for creating over-speed events. When an `asset` associated with a `monitor` is traveling at a speed above the given limits, the Live Tracking API can create events to denote such instances. There is also an option to set up a tolerance before creating an event. Please note that this object is mandatory when `type=speeding`. Let's look at the properties of this object.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `speeding_config.time_tolerance`         | integer         | Use this parameter to configure a time tolerance before triggering an event. Adding a tolerance would make the Tracking service wait for the specified time before triggering the event. Consequently, an event is triggered only when the time for which the `asset` has been over-speeding continuously, exceeds the configured tolerance time. The unit for this parameter is milliseconds. It can be seen that this attribute is used to control the "sensitivity" of the `monitor` with respect to speed alerts. Higher the value of `time_tolerance` the less sensitive the `monitor` would be to instances of over-speeding. Conversely, if 'time_tolerance' is set to 0, the `monitor` will be extremely sensitive and will create an event as soon as tracking information with a speed value greater than the specified limit is received.                                                                                                                                                                                                                                                         |
| `speeding_config.customer_speed_limit`   | integer         | Use this parameter to establish the speed limit that will allow the `monitor` to create events, depending on the `time_tolerance` value, when an asset's tracked speed exceeds it. The speed limit should be specified in meters per second. Please note that `customer_speed_limit` is mandatory when `use_admin_speed_limit` is false. However, when `use_admin_speed_limit` is true, `customer_speed_limit` is ineffective.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `speeding_config.use_admin_speed_limit`  | boolean         | A boolean attribute to indicate which speed limit values should be used by the `monitor`. When `use_admin_speed_limit` is true, the administrative speed limit of the road on which the asset is located, will be used to generate events when the asset’s tracked speed exceeds it. Whereas, when `use_admin_speed_limit` is false, the `customer_speed_limit` specified will be used to generate events when the asset's tracked speed exceeds it. Please note that if `use_admin_speed_limit` is false, `customer_speed_limit` is mandatory, however, when `use_admin_speed_limit` is true then `customer_speed_limit` is ineffective.                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `idle_config`                            | object          | `idle_config` is used to set up constraints for creating idle events. When an asset associated with the `monitor` has not moved a given distance within a given time, the Live Tracking API can create events to denote such instances. Please note that this object is mandatory when the monitor `type` is `idle`. Let's look at the properties of this object.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `idle_config.distance_tolerance`         | number          | Use this parameter to configure a distance threshold that will be used to determine if the asset was idle or not. If the asset moves by a distance less than the value of this parameter within a certain time period, the `monitor` would create an idle event against the asset. The `distance_tolerance` should be provided in meters. Users can set an appropriate value for this parameter, along with appropriate `time_tolerance` value, to avoid triggering idle events when the asset is crossing a busy intersection or waiting at the traffic lights.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| `idle_config.time_tolerance`             | integer         | Use this parameter to configure a time duration for which the `monitor` would track the distance covered by an asset before triggering an idle event. The `time_tolerance` should be provided in milliseconds. If the distance covered by the asset during a `time_tolerance` is less than that specified in `distance_tolerance` the asset will be assumed to be idle. Please observe that this attribute along with `distance_tolerance` parameter can be used to control the "sensitivity" of the `monitor` with respect to idle alerts. If the `distance_tolerance` is set a high value, then setting `time_tolerance` to a low value may result in a situation where asset is always judged as idle. On the contrary, it might never be judged as idle if `distance_tolerance` is set to a low value but `time_tolerance` is set to a high value. It is recommended to use these properties with appropriate values to trigger genuine idle events. The appropriate values might depend on the traffic conditions, nature of operations that the asset is involved in, type of asset and other factors. |
| `geofence_config`                        | object          | Geofences are geographic boundaries surrounding an area of interest. `geofence_config` is used to specify the geofences for creating `enter` or `exit` type of events based on the asset's location. When an asset associated with the `monitor` enters the given geofence, an `enter` type event is created, whereas when the asset moves out of the geofence an `exit` type event is created. Please note that this object is mandatory when the monitor `type` belongs to one of `enter`, `exit` or `enter_and_exit`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| `geofence_config.geofence_ids`           | array of string | An array of strings to collect the geofence IDs that should be linked to the `monitor`. Please note `geofence_ids` are mandatory when using the `geofence_config` attribute.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |

#### Response Schema

| Field     | Type   | Description                                                                                                                                                                                                                                  |
| --------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `status`  | string | A string indicating the state of the response. On successful responses, the value will be `Ok`. Indicative error messages are returned for different errors. See the [API Error Codes](#api-error-codes) section below for more information. |
| `data`    | object | A data object containing the ID of the `monitor` created.                                                                                                                                                                                    |
| `data.id` | string | Unique ID of the `monitor` created. Please note this ID cannot be updated.                                                                                                                                                                   |
| `message` | string | Displays the error message in case of a failed request. If the request is successful, this field is not present in the response.                                                                                                             |

#### Example 1 - Create an _enter & exit_ type Monitor

Let’s create a monitor for tracking the entry and exit of an asset into a geofence. In the create request we:

1. Set the `type` to `enter_and_exit`
2. Add the ID of the geofence that would be used to determine the monitored area.
3. Add the `attributes` matching the asset whose activity needs to be monitored.

##### Request

```bash
curl --location 'https://api.nextbillion.io/skynet/monitor?key=<your_api_key>' \
--header 'Content-Type: application/json' \
--data '{
  "type": "enter_and_exit",
  "geofence_config":{
    "geofence_ids": [
    "1287cd61-fc73-48d2-a82f-6bb4eb0d6f69"
    ]
  },
  "name": "Sheraton Grand Los Angeles monitor",
  "description": "Track activity related to free staff transportation service",
  "match_filter":{
      "include_all_of_attributes":{
                "driver_contact_no": "595-232-764",
                "driver_name": "Jack Shipley",
                "license": "7 BA 3352",
                "vehicle_type": "mini-bus"}
                }
}'
```

##### Response

```json
{
  "status": "Ok",
  "data": {
    "id": "9a504acb-1889-4c79-a221-cd2c330f2a5b"
  }
}
```

#### Example 2 - Create a _speeding_ type Monitor

Next, we will create a monitor for tracking the entry and exit of an asset into a geofence. In the create request we:

1. Set the `type` to `speeding`
2. Add the desired configuration to the `speeding_config` attribute
3. Add the `attributes` matching the asset whose activity needs to be monitored.

##### Request

```bash
curl --location --request POST 'https://api.nextbillion.io/skynet/monitor?key=<your_api_key>' \
--header 'Content-Type: application/json' \
--data-raw '{
"type": "speeding",
"speeding_config": {
"time_tolerance": 55000,
"use_admin_speed_limit": false,
"customer_speed_limit": 25
},
  "name": "Sheraton Grand Los Angeles monitor",
  "description": "Track activity related to free staff transportation service",
  "match_filter":{
      "include_all_of_attributes":{
                "driver_contact_no": "595-232-764",
                "driver_name": "Jack Shipley",
                "license": "7 BA 3352",
                "vehicle_type": "mini-bus"}
                }
}'
```

##### Response

```json
{
  "status": "Ok",
  "data": {
    "id": "77202940-f2ec-4841-a8b7-f962def95006"
  }
}
```

#### Example 3 - Create an _idle_ type Monitor

Next, we will create a monitor for tracking the entry and exit of an asset into a geofence. In the create request we:

1. Set the `type` to `idle`
2. Add the desired configuration to the `idle_config` attribute
3. Add the `attributes` matching the asset whose activity needs to be monitored.

##### Request

```bash
curl --location --request POST 'https://api.nextbillion.io/skynet/monitor?key=<your_api_key>' \
--header 'Content-Type: application/json' \
--data-raw '{
   "type": "idle",
   "idle_config": {
    "distance_tolerance": 120,
    "time_tolerance": 70000
   },
  "name": "Sheraton Grand Los Angeles monitor",
  "description": "Track activity related to free staff transportation service",
  "match_filter":{
      "include_all_of_attributes":{
                "driver_contact_no": "595-232-764",
                "driver_name": "Jack Shipley",
                "license": "7 BA 3352",
                "vehicle_type": "mini-bus"}
                }
}'
```

##### Response

```json
{
"status": "Ok",
"data": {
"id": "a272012e-623a-4d74-b434-08801629dbb8"
}
```

### Get a Monitor

This method retrieves the details and information of a specific `monitor`. By using this method, users can access the associated data of a `monitor`. This allows for easy retrieval of monitor-specific information for analysis, monitoring purposes or making any necessary adjustments to the monitor's settings.

GET

https://api.nextbillion.io/skynet/monitor/{id}?key={your_api_key}

#### Request Parameter

| Name  | Required | Format and Usage | Description                                                                                                                                                                                                                                              |
| ----- | -------- | ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`  | Yes      | Type: `string`   | ID of the `monitor` to be fetched. This is the same ID that was generated at the time of creating the `monitor`.                                                                                                                                         |
| `key` | Yes      | Type: `string`   | A key is a unique identifier that is required to authenticate a request to the API. The namespace created using this key can be managed using the APIs & Services > Credentials section of user’s [NextBillion Console](https://console.nextbillion.ai). |

#### Response Schema

| Field                                                 | Type            | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| ----------------------------------------------------- | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `status`                                              | string          | A string indicating the state of the response. On successful responses, the value will be `Ok`. Indicative error messages are returned for different errors. See the [API Error Codes](#api-error-codes) section below for more information.                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| `data`                                                | object          | A data object containing the details of the `monitor`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `data.monitor`                                        | object          | -                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| `data.monitor.id`                                     | string          | Unique ID of the `monitor`. This is the same ID that was generated at the time of creating the `monitor`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `data.monitor.type`                                   | string          | Type of the `monitor`. It represents the type of `asset` activity that the `monitor` is configured to detect.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `data.monitor.name`                                   | string          | Name of the `monitor`. The value would be the same as that provided for the `name` parameter at the time of creating or updating the `monitor`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| `data.monitor.tags`                                   | array of string | Tags of the `monitor`. The values would be the same as that provided for the `tags` parameter at the time of creating or updating the `monitor`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `data.monitor.description`                            | string          | Description of the `monitor`. The value would be the same as that provided for the `description` parameter at the time of creating or updating the `monitor`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `data.monitor.geofences`                              | array of string | Geofence IDs that are linked to the `monitor`. These IDs were associated with the `monitor` at the time of creating or updating it. The `monitor` uses the geofences mentioned here to create events of `type` nature for the eligible asset(s).                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `data.monitor.updated_at`                             | integer         | A UNIX epoch timestamp in seconds representing the time at which the `monitor` was last updated.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `data.monitor.created_at`                             | integer         | A UNIX epoch timestamp in seconds representing the time at which the `monitor` was created.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `data.monitor.match_filter`                           | object          | Use this object to update the `attributes` of the `monitor`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| `data.monitor.match_filter.include_all_of_attributes` | object          | A string type dictionary object to specify the `attributes` which will be used to identify the asset(s) on which the `monitor` would be applied. Please note that using this parameter overwrites the existing `attributes` of the monitor. If the `attributes` added to a `monitor` do not match fully with the `attributes` added to any `asset`, the `monitor` will be ineffective. Please note that the maximum number of `key`:`value` pairs that 'include_all_of_attributes' can take is 100. Also, the overall size of the `match_filter` object should not exceed 65kb.                                                                                                                                          |
| `data.monitor.match_filter.include_any_of_attributes` | object          | A string dictionary object to specify the `attributes`, separated by a `,`. Only the `assets` with any one of the `attributes` added to this parameter will be linked to this `monitor`. Once an `asset` and a `monitor` are linked, the `monitor` will be able to create events for the `asset` when an activity specified in `type` is detected. If no input is provided for this object or if the `attributes` added here do not match at least one of the `attributes` added to any `asset`, the `monitor` will be ineffective. Please note that the maximum number of `key`:`value` pairs that `include_any_of_attributes` can take is 100. Also, the overall size of `match_filter` object should not exceed 65kb. |
| `data.monitor.speeding_config`                        | object          | An object returning the details of the over-speeding constraints for a `speeding` type of `monitor`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| `data.monitor.speeding_config.time_tolerance`         | integer         | This property returns the time duration value, in milliseconds, for which the `monitor` will track the speed of the asset. An event is triggered if the speed remains higher than the specified limit for a duration more than the tolerance value. The value returned for this parameter is the same as that provided while creating or updating a `speeding` type `monitor`.                                                                                                                                                                                                                                                                                                                                           |
| `data.monitor.speeding_config.customer_speed_limit`   | integer         | This property returns the actual speed limit that the `monitor` uses as a threshold for generating a speed limit event. The value returned for this parameter is the same as that provided while creating or updating a `speeding` type `monitor`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| `data.monitor.speeding_config.use_admin_speed_limit`  | boolean         | A boolean value denoting if the administrative speed limit of the road was used as speed limit threshold for triggering events. The value returned for this parameter is the same as that provided while creating or updating a `speeding` type `monitor`.                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `data.monitor.idle_config`                            | object          | An object returning the details of the idle activity constraints for a `idle` type of `monitor`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `data.monitor.idle_config.distance_tolerance`         | number          | This parameter returns the distance threshold that was used to determine if the asset was idle or not. The value returned for this parameter is the same as that provided while creating or updating a `idle` type `monitor`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `data.monitor.idle_config.time_tolerance`             | integer         | This parameter returns the time duration for which the `monitor` tracks the distance covered by an asset before triggering an idle event. The value returned for this parameter is the same as that provided while creating or updating a `idle` type `monitor`.                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `data.monitor.geofence_config`                        | object          | An object returning the details of the geofence that are associated with the `monitor` for an `enter`, `exit` or `enter_and_exit` type of monitor.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| `data.monitor.geofence_config.geofence_ids`           | array of string | An array of geofence IDs that are linked to the `monitor`. Geofences are geographic boundaries that can be used to trigger events based on an asset's location.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| `message`                                             | string          | Displays the error message in case of a failed request. If the request is successful, this field is not present in the response.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |

#### Sample Request

```bash
curl --location 'https://api.nextbillion.io/skynet/monitor/36c171d5-bdf1-47c2-9531-4c02820ab70e?key=<your_api_key>'
```

#### Sample Response

```json
{
  "status": "Ok",
  "data": {
    "monitor": {
      "id": "36c171d5-bdf1-47c2-9531-4c02820ab70e",
      "type": "speeding",
      "name": "Delivery Monitor The Ritz Hotel, Los Angeles",
      "description": "Track speeding activity of the delivery vehicle",
      "geofences": null,
      "tags": [],
      "created_at": 1694619817,
      "updated_at": 1694672213,
      "match_filter": {
        "include_all_of_attributes": {
          "driver_contact_no": "321-902-838",
          "driver_name": "James Smith",
          "license": "4 ES 7167",
          "vehicle_type": "Delivery"
        }
      },
      "speeding_config": {
        "customer_speed_limit": 18,
        "time_tolerance": 35000,
        "use_admin_speed_limit": false
      }
    }
  }
}
```

### Update a Monitor

This method enables users to modify the settings and parameters of an existing `monitor`. By using this method, users can make changes to the monitor's `type`, `attributes`, description, geofence associations, configurations for speed or idle events, among other properties of the `monitor`. This flexibility allows for updates and adjustments to the monitoring configuration based on changing requirements or evolving business needs.

PUT

https://api.nextbillion.io/skynet/monitor/{id}?key={your_api_key}

#### Request Parameter

| Name  | Required | Format and Usage | Description                                                                                                                                                                                                                                              |
| ----- | -------- | ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`  | Yes      | Type: `string`   | ID of the `monitor` to be updated. This is the same ID that was generated at the time of creating the `monitor`.                                                                                                                                         |
| `key` | Yes      | Type: `string`   | A key is a unique identifier that is required to authenticate a request to the API. The namespace created using this key can be managed using the APIs & Services > Credentials section of user’s [NextBillion Console](https://console.nextbillion.ai). |

#### Request Body

| Field                                    | Type            | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| ---------------------------------------- | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `description`                            | string          | Use this parameter to update the `description` of the `monitor`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `name`                                   | string          | Use this parameter to update the `name` of the `monitor`. Users can add meaningful names to the monitors like "warehouse_exit", "depot_entry" etc.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `tags`                                   | array of string | Use this parameter to update the `tags` of the `monitor`. `tags` can be used for filtering monitors in the _Get Monitor List_ operation. They can also be used for easy identification of monitors. Using this parameter overwrites the existing `tags` of the monitor. Please note that valid `tags` are strings, consisting of alphanumeric characters (A-Z, a-z, 0-9) along with the underscore ('\_') and hyphen ('-') symbols.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `type`                                   | string          | Use this parameter to update the `type` of the `monitor`. The `monitor` will be able to detect the specified `type` of activity and create events for eligible `asset`. A `monitor` can detect following types of asset activity: - `enter`: The `monitor` will create an event when a linked `asset` enters into the specified geofence. - `exit`: The `monitor` will create an event when a linked `asset` exits the specified geofence. - `enter_and_exit`: The `monitor` will create an event when a linked `asset` either enters or exits the specified geofence. - `speeding`: The `monitor` will create an event when a linked `asset` exceeds a given speed limit. - `idle`: The `monitor` will create an event when a linked `asset` exhibits idle activity. Please note that `assets` and geofences can be linked to a `monitor` using the `match_filter` and `geofence_config` attributes respectively. |
| `match_filter`                           | object          | Use this object to update the `attributes` of the `monitor`. Please note that using this property will overwrite the existing `attributes` that the monitor might be using currently to match any asset(s).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| `match_filter.include_all_of_attributes` | object          | A string type dictionary object to specify the `attributes`. Only the assets having all of the `attributes` added to this parameter will be linked to this `monitor`. Once an `asset` is linked to a `monitor`, the `monitor` will be able to create events for that `asset` whenever an activity specified in `type` is detected. Multiple attributes should be separated by a comma `,`. Please note that this parameter can not be used in conjunction with `include_any_of_attributes`. Also, the maximum number of `key`:`value` pairs that this parameter can take is 100 and the overall size of the `match_filter` object should not exceed 65kb.                                                                                                                                                                                                                                                          |
| `match_filter.include_any_of_attributes` | object          | A string type dictionary object to specify the `attributes`. The assets having at least one of the `attributes` added to this parameter will be linked to this `monitor`. Once an `asset` is linked to a `monitor`, the `monitor` will be able to create events for that `asset` whenever an activity specified in `type` is detected. Multiple attributes should be separated by a comma `,`. Please note that this parameter can not be used in conjunction with `include_all_of_attributes`. Also, the maximum number of `key`:`value` pairs that this parameter can take is 100 and the overall size of the `match_filter` object should not exceed 65kb.                                                                                                                                                                                                                                                      |
| `idle_config`                            | object          | `idle_config` is used to update the constraints for creating idle events. When an asset associated with the `monitor` has not moved a given distance within a given time, the Live Tracking API can create events to denote such instances. Please note that this object is mandatory when the monitor `type` is `idle`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `idle_config.distance_tolerance`         | number          | Use this parameter to update the distance threshold that will be used to determine if the asset was idle or not. When the asset, within `time_tolerance` duration, moves less than the value for this parameter, the `monitor` creates an idle event against the `asset`. The `distance_tolerance` should be provided in meters. Please note `distance_tolerance` is mandatory when `idle_config` attribute is used.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `idle_config.time_tolerance`             | integer         | Use this parameter to update the time duration for which the `monitor` would track the distance covered by an asset before triggering an idle event. The `time_tolerance` should be provided in milliseconds. If the distance covered by the asset during a `time_tolerance` is less than that specified in `distance_tolerance` the asset will be assumed to be idle. This attribute along with `distance_tolerance` parameter can be used to control the "sensitivity" of the `monitor` with respect to idle alerts. It is recommended to use these properties with appropriate values to trigger genuine idle events. The appropriate values might depend on the traffic conditions, nature of operations that the asset is involved in, type of asset and other factors.                                                                                                                                       |
| `speeding_config`                        | object          | `speeding_config` is used to update the tolerance values for creating over-speed events. When an asset associated with a `monitor` is traveling at a speed above the given limits, Live Tracking API creates events to indicate such instances. Please note that this object is mandatory when the monitor `type` is `speeding`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `speeding_config.time_tolerance`         | integer         | Use this parameter to update the time tolerance before triggering an event. Adding a tolerance would make the Tracking service wait for the specified time before triggering the event. Consequently, an event is triggered only when the time for which the asset has been over-speeding continuously, exceeds the configured tolerance time. The unit for this parameter is milliseconds. It can be seen that this attribute is used to control the "sensitivity" of the `monitor` with respect to speed alerts. Higher the value of `time_tolerance` the less sensitive the `monitor` would be to instances of over-speeding. Conversely, if 'time_tolerance' is set to 0, the `monitor` will be extremely sensitive and will create an event as soon as tracking information with a speed value greater than the specified limit is received.                                                                  |
| `speeding_config.customer_speed_limit`   | string          | Use this parameter to update the speed limit value that the `monitor` will use to create events, depending on the `time_tolerance` value. The speed limit should be specified in meters per second. Please note that `customer_speed_limit` is mandatory when `use_admin_speed_limit` is false. However, when `use_admin_speed_limit` is true, `customer_speed_limit` is ineffective.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `speeding_config.use_admin_speed_limit`  | boolean         | Use this attribute to update which speed limit values will be used by the `monitor`. When `use_admin_speed_limit` is true, the administrative speed limit of the road on which the asset is located, is used to generate events when the asset’s tracked speed exceeds it. Whereas, when `use_admin_speed_limit` is false, the `customer_speed_limit` specified will be used to generate events when the asset's tracked speed exceeds it. Please note that if `use_admin_speed_limit` is false, `customer_speed_limit` is mandatory, otherwise when `use_admin_speed_limit` is true then `customer_speed_limit` is ineffective.                                                                                                                                                                                                                                                                                   |
| `geofence_config`                        | object          | `geofence_config` is used to update the set of geofences linked to the `monitor` for creating `enter` or `exit` type of events based on the asset's location. Please note that this object is mandatory when the monitor `type` belongs to one of `enter`, `exit` or `enter_and_exit`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| `geofence_config.geofence_ids`           | array of string | Use this array to update the geofence IDs that should be linked to the `monitor`. Please note `geofence_ids` are mandatory when using the `geofence_config` attribute.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |

#### Response Schema

| Field     | Type   | Description                                                                                                                                                                                                                                  |
| --------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `message` | string | Displays the error message in case of a failed request. If the request is successful, this field is not present in the response.                                                                                                             |
| `status`  | string | A string indicating the state of the response. On successful responses, the value will be `Ok`. Indicative error messages are returned for different errors. See the [API Error Codes](#api-error-codes) section below for more information. |

#### Sample Request

```bash
curl --location --request PUT 'https://api.nextbillion.io/skynet/monitor/3123a566-1c64-4ada-846c-d1e9f6bcc049?key=<your_api_key>' \
--header 'Content-Type: application/json' \
--data-raw '{
     "name": "Los Angeles Geofence ",
     "match_filter":{
      "include_all_of_attributes":{
                "driver_name": "Ron Taylor",
                "license": "AR 30 TR 8389",
                "shift_timing": "0900 - 1800"
        }
      }
}
```

#### Sample Response

```json
{
  "status": "Ok"
}
```

### Get Monitor List

This method retrieves a list of monitors available in the system along with pagination information. It provides users with an overview of all the monitors that have been created. The method allows for easy access to `monitor` details such as their names, types, descriptions, and associated `attributes`. This information can be valuable for monitoring configurations, analyzing monitoring patterns and managing the monitoring system effectively.

GET

https://api.nextbillion.io/skynet/monitor/list?key={your_api_key}

#### Request Parameter

| Name   | Required | Format and Usage                                                                              | Description                                                                                                                                                                                                                                                                                                              |
| ------ | -------- | --------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `key`  | Yes      | Type: `string`                                                                                | A key is a unique identifier that is required to authenticate a request to the API. The namespace created using this key can be managed using the APIs & Services > Credentials section of user’s [NextBillion Console](https://console.nextbillion.ai).                                                                 |
| `tags` | No       | Type: `string`<br>Example: tags=tag_1,tag_2                                                   | `tags` can be used to filter the monitors. Only those monitors which have all the `tags` provided here, will be included in the search result. In case multiple `tags` need to be specified, use `,` to separate them.                                                                                                   |
| `pn`   | No       | Type: `integer`<br>Default: 1<br>Example: pn=5                                                | Denotes page number. Use this along with the `ps` parameter to implement pagination for your searched results. This parameter does not have a maximum limit but would return an empty response in case a higher value is provided when the result-set itself is smaller.                                                 |
| `ps`   | No       | Type: `integer`<br>Default: 20<br>Example: ps=25                                              | Denotes number of search results per page. Use this along with the `pn` parameter to implement pagination for your searched results.                                                                                                                                                                                     |
| `sort` | No       | Type: `string`<br>Default: created_at:desc<br>Format: field:order<br>Example: updated_at:desc | Provide a single field to sort the results by. Only `updated_at` or `created_at` fields can be selected for ordering the results. By default, the result is sorted by `created_at` field in the descending order. Allowed values for specifying the order are `asc` for ascending order and `desc` for descending order. |

#### Response Schema

| Field                                                | Type            | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| ---------------------------------------------------- | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `status`                                             | string          | A string indicating the state of the response. On successful responses, the value will be `Ok`. Indicative error messages are returned for different errors. See the [API Error Codes](#api-error-codes) section below for more information.                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| `data`                                               | object          | A data object containing the result.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| `data.list`                                          | array of object | An array of objects listing all the monitors. Each object represents one `monitor`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `data.list[].id`                                     | string          | Unique ID of the `monitor`. This is the same ID that was generated at the time of creating the `monitor`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `data.list[].type`                                   | string          | Type of the `monitor`. It represents the type of `asset` activity that the `monitor` is configured to detect.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `data.list[].name`                                   | string          | Name of the `monitor`. The value would be the same as that provided for the `name` parameter at the time of creating or updating the `monitor`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| `data.list[].tags`                                   | array of string | Tags of the `monitor`. The values would be the same as that provided for the `tags` parameter at the time of creating or updating the `monitor`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `data.list[].description`                            | string          | Description of the `monitor`. The value would be the same as that provided for the `description` parameter at the time of creating or updating the `monitor`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `data.list[].geofences`                              | array of string | Geofence IDs that are linked to the `monitor`. These IDs were associated with the `monitor` at the time of creating or updating it. The `monitor` uses the geofences mentioned here to create events of `type` nature for the eligible asset(s).                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `data.list[].updated_at`                             | integer         | A UNIX epoch timestamp in seconds representing the time at which the `monitor` was last updated.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `data.list[].created_at`                             | integer         | A UNIX epoch timestamp in seconds representing the time at which the `monitor` was created.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `data.list[].match_filter`                           | object          | Use this object to update the `attributes` of the `monitor`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| `data.list[].match_filter.include_all_of_attributes` | object          | A string type dictionary object to specify the `attributes` which will be used to identify the asset(s) on which the `monitor` would be applied. Please note that using this parameter overwrites the existing `attributes` of the monitor. If the `attributes` added to a `monitor` do not match fully with the `attributes` added to any `asset`, the `monitor` will be ineffective. Please note that the maximum number of `key`:`value` pairs that 'include_all_of_attributes' can take is 100. Also, the overall size of the `match_filter` object should not exceed 65kb.                                                                                                                                          |
| `data.list[].match_filter.include_any_of_attributes` | object          | A string dictionary object to specify the `attributes`, separated by a `,`. Only the `assets` with any one of the `attributes` added to this parameter will be linked to this `monitor`. Once an `asset` and a `monitor` are linked, the `monitor` will be able to create events for the `asset` when an activity specified in `type` is detected. If no input is provided for this object or if the `attributes` added here do not match at least one of the `attributes` added to any `asset`, the `monitor` will be ineffective. Please note that the maximum number of `key`:`value` pairs that `include_any_of_attributes` can take is 100. Also, the overall size of `match_filter` object should not exceed 65kb. |
| `data.list[].speeding_config`                        | object          | An object returning the details of the over-speeding constraints for a `speeding` type of `monitor`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| `data.list[].speeding_config.time_tolerance`         | integer         | This property returns the time duration value, in milliseconds, for which the `monitor` will track the speed of the asset. An event is triggered if the speed remains higher than the specified limit for a duration more than the tolerance value. The value returned for this parameter is the same as that provided while creating or updating a `speeding` type `monitor`.                                                                                                                                                                                                                                                                                                                                           |
| `data.list[].speeding_config.customer_speed_limit`   | integer         | This property returns the actual speed limit that the `monitor` uses as a threshold for generating a speed limit event. The value returned for this parameter is the same as that provided while creating or updating a `speeding` type `monitor`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| `data.list[].speeding_config.use_admin_speed_limit`  | boolean         | A boolean value denoting if the administrative speed limit of the road was used as speed limit threshold for triggering events. The value returned for this parameter is the same as that provided while creating or updating a `speeding` type `monitor`.                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `data.list[].idle_config`                            | object          | An object returning the details of the idle activity constraints for a `idle` type of `monitor`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `data.list[].idle_config.distance_tolerance`         | number          | This parameter returns the distance threshold that was used to determine if the asset was idle or not. The value returned for this parameter is the same as that provided while creating or updating a `idle` type `monitor`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `data.list[].idle_config.time_tolerance`             | integer         | This parameter returns the time duration for which the `monitor` tracks the distance covered by an asset before triggering an idle event. The value returned for this parameter is the same as that provided while creating or updating a `idle` type `monitor`.                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `data.list[].geofence_config`                        | object          | An object returning the details of the geofence that are associated with the `monitor` for an `enter`, `exit` or `enter_and_exit` type of monitor.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| `data.list[].geofence_config.geofence_ids`           | array of string | An array of geofence IDs that are linked to the `monitor`. Geofences are geographic boundaries that can be used to trigger events based on an asset's location.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| `data.page`                                          | object          | An object with pagination details of the search results. Use this object to implement pagination in your application.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `data.page.total`                                    | integer         | An integer value indicating the total number of items available in the data set. This parameter can be used to calculate the total number of pages available.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `data.page.offset`                                   | integer         | An integer value indicating the number of items that need to be skipped while displaying the results of the current page.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `data.page.page`                                     | integer         | An integer value indicating the current page number (starting at 0).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| `data.page.size`                                     | integer         | An integer value indicating the maximum number of items retrieved per `page`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `data.page.hasmore`                                  | boolean         | A boolean value indicating whether there are more items available beyond the current page.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `message`                                            | string          | Displays the error message in case of a failed request. If the request is successful, this field is not present in the response.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |

#### Sample Request

```bash
curl --location 'https://api.nextbillion.io/skynet/monitor/list?key=<your_api_key>&pn=1&ps=4&sort=created_at:desc'
```

#### Sample Response

```json
{
  "status": "Ok",
  "data": {
    "list": [
      {
        "id": "36c171d5-bdf1-47c2-9531-4c02820ab70e",
        "type": "speeding",
        "name": "Delivery Monitor The Ritz Hotel, Los Angeles",
        "description": "Track speeding activity of the delivery vehicle",
        "geofences": null,
        "tags": [],
        "created_at": 1694619817,
        "updated_at": 1694672213,
        "match_filter": {
          "include_all_of_attributes": {
            "driver_contact_no": "321-902-838",
            "driver_name": "James Smith",
            "license": "4 ES 7167",
            "vehicle_type": "Delivery"
          }
        },
        "speeding_config": {
          "customer_speed_limit": 18,
          "time_tolerance": 35000,
          "use_admin_speed_limit": false
        }
      },
      {
        "id": "1d1b20f1-5f33-4a37-833d-119898b18ff9",
        "type": "idle",
        "name": "Pickup Monitor The Ritz Hotel, Los Angeles",
        "description": "Track idle activity of the pickup vehicle",
        "geofences": null,
        "tags": [],
        "created_at": 1694541966,
        "updated_at": 1694614513,
        "match_filter": {
          "include_all_of_attributes": {
            "driver_contact_no": "422-761-938",
            "driver_name": "John Blake",
            "license": "2 BR 2049",
            "vehicle_type": "Pickup"
          }
        },
        "idle_config": {
          "distance_tolerance": 30,
          "time_tolerance": 10000
        }
      },
      {
        "id": "dae3b4bd-2402-4b53-83dd-c094b79d02cc",
        "type": "enter_and_exit",
        "name": "Monitor The Ritz Hotel, Los Angeles",
        "description": "Track activity related to free staff transportation service",
        "geofences": ["7d1b861c-67b8-4128-aef8-179a605263c4"],
        "tags": [],
        "created_at": 1694419506,
        "updated_at": 1694419506,
        "match_filter": {
          "include_all_of_attributes": {
            "driver_contact_no": "422-583-651",
            "driver_name": "John Luther",
            "license": "2 DS 3236",
            "vehicle_type": "SUV"
          }
        },
        "geofence_config": {
          "geofence_ids": ["7d1b861c-67b8-4128-aef8-179a605263c4"]
        }
      },
      {
        "id": "a39ef490-130b-4f03-aa91-434ae82ee757",
        "type": "speeding",
        "name": "Sheraton Grand Los Angeles monitor",
        "description": "Track activity related to free staff transportation service",
        "geofences": null,
        "tags": [],
        "created_at": 1694080768,
        "updated_at": 1694080768,
        "match_filter": {
          "include_all_of_attributes": {
            "driver_contact_no": "595-232-764",
            "driver_name": "Jack Shipley",
            "license": "7 BA 3352",
            "vehicle_type": "mini-bus"
          }
        },
        "speeding_config": {
          "customer_speed_limit": 10,
          "time_tolerance": 6000,
          "use_admin_speed_limit": false
        }
      }
    ],
    "page": {
      "total": 4,
      "offset": 0,
      "page": 1,
      "size": 4,
      "hasmore": false
    }
  }
}
```

### Delete a Monitor

This method allows users to delete an existing `monitor` from the system. It is useful when a `monitor` is no longer needed or if changes to monitoring requirements are necessary. By removing a monitor, users can effectively stop tracking specific activities associated with that `monitor`.

DELETE

https://api.nextbillion.io/skynet/monitor/{id}?key={your_api_key}

#### Request Parameter

| Name  | Required | Format and Usage | Description                                                                                                                                                                                                                                              |
| ----- | -------- | ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`  | Yes      | Type: `string`   | D of the `monitor` to be deleted. This is the same ID that was generated at the time of creating the `monitor`.                                                                                                                                          |
| `key` | Yes      | Type: `string`   | A key is a unique identifier that is required to authenticate a request to the API. The namespace created using this key can be managed using the APIs & Services > Credentials section of user’s [NextBillion Console](https://console.nextbillion.ai). |

#### Response Schema

| Field     | Type   | Description                                                                                                                                                                                                                                  |
| --------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `message` | string | Displays the error message in case of a failed request. If the request is successful, this field is not present in the response.                                                                                                             |
| `status`  | string | A string indicating the state of the response. On successful responses, the value will be `Ok`. Indicative error messages are returned for different errors. See the [API Error Codes](#api-error-codes) section below for more information. |

#### Sample Request

```bash
curl --location --request DELETE 'https://api.nextbillion.io/skynet/monitor/675c983c-8147-4d5a-9c14-d754a8e57c0d?key=<your_api_key>'
```

#### Sample Response

```json
{
  "status": "Ok"
}
```

## Capturing Events

Live Tracking API’s **Asset** and **Monitor** methods allow users to create events when a desired activity is exhibited by an `asset`. The events created can be accessed in 2 ways. First is the _Event History of an Asset_, which would give the requested events upon receiving a request. Another method is by using webhooks.

Webhooks are used for event-driven communication between applications. Therefore, webhooks play a key role in implementing live tracking based alerts. Let’s dive into the webhook capabilities offered by NextBillion’s Live Tracking API.

#### How does the Live Tracking API use a webhook?

A webhook enables Live Tracking API to push `event` information in real-time to the user’s application. An HTTPS POST method is used to deliver the JSON payload to a configured webhook URL as soon as an `event` is created. Live Tracking API currently supports following events:

- `enter` - Entry of an `asset` into a given geofence.
- `exit` - Exit of an `asset` from a given geofence.
- `speeding` - Asset is moving at a speed more than the specified limit
- `idle` - Asset is not moving or idle.

The information related to these events can be used to execute multiple actions in user’s application systems as needed.

#### Steps to set-up a webhook

- Get a webhook URL from the application that needs to receive the event information.
- Configure the URL to receive events from Live Tracking API using the configurations method listed below.
- Use the _Test Webhook Configuration_ method to verify that the webhook is able to receive events from the Live Tracking service.
- Start receiving information about the Live Tracking events through a HTTPS POST request on the webhook URL.

#### Live Tracking API’s configuration methods

Users can view and modify the webhooks configured for their account or key through the `config` methods available as part of NextBillion’s Live Tracking API.

### Add or Update Webhook Configuration

Use this method to add new or modify the existing webhooks. The new or the modified webhooks can be passed using the request body as an array of strings. Multiple webhooks can be configured to receive the events. Please note that the webhooks will be configured to the `key` that is passed as a request parameter. They will be eligible to receive only those events, through a POST request, that are associated with the same `key`.

PUT

https://api.nextbillion.io/skynet/config?key={your_api_key}

#### Request Parameter

| Name  | Required | Format and Usage | Description                                                                                                                                                                                                                                              |
| ----- | -------- | ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `key` | Yes      | Type: `string`   | A key is a unique identifier that is required to authenticate a request to the API. The namespace created using this key can be managed using the APIs & Services > Credentials section of user’s [NextBillion Console](https://console.nextbillion.ai). |

#### Request Body

| Field     | Type            | Description                                                                                                                                |
| --------- | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `webhook` | array of string | Use this array to update information about the webhooks. Please note that the webhooks will be overwritten every time this method is used. |

#### Response Schema

| Field     | Type   | Description                                                                                                                                                                                                                                  |
| --------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `message` | string | Displays the error message in case of a failed request. If the request is successful, this field is not present in the response.                                                                                                             |
| `status`  | string | A string indicating the state of the response. On successful responses, the value will be `Ok`. Indicative error messages are returned for different errors. See the [API Error Codes](#api-error-codes) section below for more information. |

#### Sample Request

```bash
curl --location --request PUT 'https://api.nextbillion.io/skynet/config?key=<your_api_key>'
--header 'Content-Type: application/json'
--data-raw '{
    "webhook":[
        "https://my-company/api/testhook",
        "https://my-company/api/testhook1"
    ]
}'
```

#### Sample Request

```json
{
  "status": "Ok"
}
```

### Get Webhook Configuration

Please note that the webhooks returned are associated with the `key` that is used in the input request. The webhooks returned can receive the event information through a POST request.

GET

https://api.nextbillion.io/skynet/config?key={your_api_key}

#### Request Parameter

| Name  | Required | Format and Usage | Description                                                                                                                                                                                                                                              |
| ----- | -------- | ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `key` | Yes      | Type: `string`   | A key is a unique identifier that is required to authenticate a request to the API. The namespace created using this key can be managed using the APIs & Services > Credentials section of user’s [NextBillion Console](https://console.nextbillion.ai). |

#### Response Schema

| Field                 | Type            | Description                                                                                                                                                                                                                                  |
| --------------------- | --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `status`              | string          | A string indicating the state of the response. On successful responses, the value will be `Ok`. Indicative error messages are returned for different errors. See the [API Error Codes](#api-error-codes) section below for more information. |
| `data`                | object          | A data object containing the `config` response.                                                                                                                                                                                              |
| `data.config`         | object          | -                                                                                                                                                                                                                                            |
| `data.config.webhook` | array of string | An array of strings representing the list of webhooks. Webhooks are used to receive information, through POST requests, whenever any event is triggered.                                                                                     |
| `message`             | string          | Displays the error message in case of a failed request. If the request is successful, this field is not present in the response.                                                                                                             |

#### Sample Request

```bash
curl --location --request GET 'https://api.nextbillion.io/skynet/config?key=<your_api_key>'
```

#### Sample Response

```json
{
  "status": "Ok",
  "data": {
    "config": {
      "webhook": [
        "https://my-company/api/testhook",
        "https://my-company/api/testhook1"
      ]
    }
  }
}
```

### Test Webhook Configuration

Use this method to test the webhooks configured. Once the webhooks are added the users can validate, if they are able to receive the events data, through the `test` service. The Live Tracking API will send a sample event to all the configured webhook URLs if they are validated successfully. Please note that API response will always be `Ok` and the actual event information will be sent to all the configured webhooks. Please verify the information received.

POST

https://api.nextbillion.io/skynet/config/testwebhook?key={your_api_key}

#### Request Parameter

| Name  | Required | Format and Usage | Description                                                                                                                                                                                                                                              |
| ----- | -------- | ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `key` | Yes      | Type: `string`   | A key is a unique identifier that is required to authenticate a request to the API. The namespace created using this key can be managed using the APIs & Services > Credentials section of user’s [NextBillion Console](https://console.nextbillion.ai). |

#### Response Schema

| Field    | Type   | Description                                                                                                                                                                                                                                                                                                                                                              |
| -------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `status` | string | A string indicating the state of the response. Please note this value will always be `Ok`. The sample event information will be received on the webhook, if they were successfully configured. If no event information is received by the webhook, please reconfigure the webhook or else reach out to [support@nextbillion.ai](mailto:support@nextbillion.ai) for help. |

#### Sample Request

```bash
curl --location --request POST 'https://api.nextbillion.io/skynet/config/testwebhook?key=<your_api_key>'
```

#### Sample Response

```json
{
  "status": "Ok"
}
```

#### Sample Event schema

This section gives a walkthrough of the POST request schema that will be used to carry the `event` information. Let’s take a look at the properties:

loading...

#### Example Event

```json
{
  "events": [
    {
      "asset_id": "f1ceb76d-2665-4f72-bc56-aae91c4953e3",
      "geofence_id": "350706bf-cc3b-4e74-a66c-c7f050944c47",
      "monitor_id": "8a8ecd4b-f8b2-49ed-8097-b114ce53e4db",
      "monitor_tags": ["america", "newyork"],
      "event_type": "enter",
      "timestamp": 1662629479859,
      "triggered_timestamp": 1662629479810,
      "triggered_location": {
        "location": {
          "lat": 40.7128,
          "lon": -74.0059
        },
        "timestamp": 1662629479859,
        "accuracy": 20,
        "speed": 20,
        "bearing": 30,
        "altitude": 10,
        "meta_data": {
          "test": "test"
        }
      },
      "prev_location": {
        "location": {
          "lat": 40.7127,
          "lon": -74.0049
        },
        "timestamp": 1662629478659,
        "accuracy": 20,
        "speed": 21,
        "bearing": 31,
        "altitude": 10,
        "meta_data": {
          "test": "test"
        }
      }
    }
  ],
  "timestamp": 1662629482859,
  "extra": { "speed_limit": 25 }
}
```

#### Leveraging event information

Once the `event` information is received on the webhook URL and the JSON payload is parsed into the end application, it can be leveraged in multiple ways as per the business need - notifications can be triggered for certain sensitive events on any desired medium, or the event information can be stored in a database, or the information can be pushed to a dashboard for real-time decision making etc.

## Trips

The trips feature of Live Tracking API provides increased flexibility to track specified periods or only the desired movements of an asset. When an asset is on the move users can start a trip by providing details like planned stops, name of the trip and any other custom details. Once the trip is ended, users can get tracking details along with distance, duration and geometries of the routes covered for analyzing the trip and deriving critical business insights.

Trips is a useful way to address business requirements related to service compliance, fleet tracking and safety. Let’s dive deeper into the methods available for this feature.

### Start a Trip

Users can start new trips by sending a POST request with relevant details of the `trip` like name, any custom ID, the asset which is making this trip, the stops that the asset needs to make and other attributes. The service will respond with a trip ID which can be used to perform other trip operations using the available methods. A food delivery service, for example, can utilize this API method to start a new trip whenever any of its delivery vans/bikes are on the move to deliver orders. The data generated can be used to analyze and establish service compliance and other business rules.

POST

https://api.nextbillion.io/skynet/trip/start?key={your_api_key}

#### Request Parameter

| Name  | Required | Format and Usage | Description                                                                                                                                                                                                                                              |
| ----- | -------- | ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `key` | Yes      | Type: `string`   | A key is a unique identifier that is required to authenticate a request to the API. The namespace created using this key can be managed using the APIs & Services > Credentials section of user’s [NextBillion Console](https://console.nextbillion.ai). |

#### Request Body

| Field                 | Type            | Description                                                                                                                                                                                                                                                                                                                                                                                    |
| --------------------- | --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `custom_id`           | string          | Set a unique ID for the new `trip`. If not provided, an ID will be automatically generated in UUID format. A valid `custom_id` can contain letters, numbers, “-”, & “\_” only. Please note that the ID of a `trip` can not be changed once it is created.                                                                                                                                      |
| `asset_id`            | string          | Specify the ID of the asset which is making this trip. The asset will be linked to this trip.                                                                                                                                                                                                                                                                                                  |
| `name`                | string          | Specify a name for the trip.                                                                                                                                                                                                                                                                                                                                                                   |
| `description`         | string          | Add a custom description for the trip.                                                                                                                                                                                                                                                                                                                                                         |
| `meta_data`           | object          | An JSON object to collect additional details about the trip. Use this property to add any custom information / context about the trip. The input will be passed on to the response as-is and can be used to display useful information on, for example, a UI app.                                                                                                                              |
| `attributes`          | object          | `attributes` can be used to store custom information about a trip in `key`:`value` format. Use `attributes` to add any useful information or context to your trips like the driver name, destination etc. Please note that the maximum number of `key`:`value` pairs that can be added to an `attributes` object is 100. Also, the overall size of `attributes` object should not exceed 65kb. |
| `stops`               | array of object | An array of objects to collect the details about all the stops that need to be made before the trip ends. Each object represents one stop.                                                                                                                                                                                                                                                     |
| `stops[].name`        | string          | Specify a custom name for the stop.                                                                                                                                                                                                                                                                                                                                                            |
| `stops[].meta_data`   | object          | An JSON object to collect additional details about the stop. Use this property to add any custom information / context about the stop. The input will be passed on to the response as-is and can be used to display useful information on, for example, a UI app.                                                                                                                              |
| `stops[].geofence_id` | string          | Specify the ID of the geofence indicating the area where the asset needs to make a stop, during the trip. Only the IDs of geofences created using [NextBillion.ai's Geofence API](https://docs.nextbillion.ai/docs/tracking/api/geofence#create-a-geofence) are accepted.                                                                                                                      |

#### Response Schema

| Field     | Type   | Description                                                                                                                                                                                                                                  |
| --------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `status`  | string | A string indicating the state of the response. On successful responses, the value will be `Ok`. Indicative error messages are returned for different errors. See the [API Error Codes](#api-error-codes) section below for more information. |
| `message` | string | Displays the error message in case of a failed request. If the request is successful, this field is not present in the response.                                                                                                             |
| `data`    | object | -                                                                                                                                                                                                                                            |
| `data.id` | string | Returns the ID of the newly created trip. It will be same as the `custom_id` if that input was provided in the input request. Use this ID to manage this trip using other available Trip methods.                                            |

#### Sample Request

```bash
curl --location 'https://api.nextbillion.io/skynet/trip/start?key=<your_api_key>' \
--header 'Content-Type: application/json' \
--data '{
    "custom_id":"Test_trip",
    "asset_id":"TestAsset",
      "attributes": {
        "shift_timing": "1000 - 1800",
            "driver_name": "John"
      },
      "name": "Test_trip",
      "description": "This is the first trip for this asset",
      "stops":[
    {
        "name":"stop_1",
        "meta_data":["Main Office Building","Checkpoint"],
        "geofence_id":"geofence_1"
      }
      ]
    }'
```

#### Sample Response

```json
{
  "status": "Ok",
  "data": {
    "id": "Test_trip"
  }
}
```

### Get a Trip

Retrieve the details of a trip using this method. Users need to make a GET request with the desired trip ID provided as a path parameter and the service will respond with all details about the trip like name, status of the trip, asset to which it is linked to and stops that were made or are to be made during the trip depending on its status.

GET

https://api.nextbillion.io/skynet/trip/{id}?key={your_api_key}

#### Request Parameter

| Name  | Required | Format and Usage | Description                                                                                                                                                                                                                                              |
| ----- | -------- | ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`  | Yes      | Type: `string`   | Specify the ID of trip that is to be retrieved.                                                                                                                                                                                                          |
| `key` | Yes      | Type: `string`   | A key is a unique identifier that is required to authenticate a request to the API. The namespace created using this key can be managed using the APIs & Services > Credentials section of user’s [NextBillion Console](https://console.nextbillion.ai). |

#### Response Schema

| Field                             | Type            | Description                                                                                                                                                                                                                                                                                            |
| --------------------------------- | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `status`                          | string          | A string indicating the state of the response. On successful responses, the value will be `Ok`. Indicative error messages are returned for different errors. See the [API Error Codes](#api-error-codes) section below for more information.                                                           |
| `message`                         | string          | Displays the error message in case of a failed request. If the request is successful, this field is not present in the response.                                                                                                                                                                       |
| `data`                            | object          | An container for the trip returned by the service.                                                                                                                                                                                                                                                     |
| `data.trip`                       | object          | An object containing the returned trip details.                                                                                                                                                                                                                                                        |
| `data.trip.id`                    | string          | Returns the unique identifier of the trip.                                                                                                                                                                                                                                                             |
| `data.trip.asset_id`              | string          | Returns the ID of the asset linked to the trip when the trip was started or updated.                                                                                                                                                                                                                   |
| `data.trip.state`                 | string          | Returns the current state of the trip. The value will be "active" if the trip is still going on, otherwise the value returned would be "ended".                                                                                                                                                        |
| `data.trip.name`                  | string          | Returns the name for the trip as provided at the time of starting or updating the trip.                                                                                                                                                                                                                |
| `data.trip.description`           | string          | Returns the custom description for the trip as provided at the time of starting or updating the trip.                                                                                                                                                                                                  |
| `data.trip.meta_data`             | object          | Returns the metadata containing additional information about the trip as provided at the time of starting or updating the trip.                                                                                                                                                                        |
| `data.trip.attributes`            | object          | Returns the `attributes` provided for the trip at the time of starting or updating it.                                                                                                                                                                                                                 |
| `data.trip.started_at`            | integer         | Returns the time, expressed as UNIX epoch timestamp in milliseconds, when the trip started.                                                                                                                                                                                                            |
| `data.trip.ended_at`              | integer         | Returns the time, expressed as UNIX epoch timestamp in milliseconds, when the trip ended.                                                                                                                                                                                                              |
| `data.trip.created_at`            | integer         | Returns the time, expressed as UNIX epoch timestamp in milliseconds, when the trip was created.                                                                                                                                                                                                        |
| `data.trip.updated_at`            | integer         | Returns the timeme, expressed as UNIX epoch timestamp in milliseconds, when the trip was last updated.                                                                                                                                                                                                 |
| `data.trip.stops`                 | array of object | An array of objects returning the details of the stops made during the trip. Each object represents a single stop.                                                                                                                                                                                     |
| `data.trip.stops[].name`          | string          | Returns the name of the stop that was provided when configuring this stop for the trip.                                                                                                                                                                                                                |
| `data.trip.stops[].meta_data`     | object          | Returns any meta data that was added to provide additional information about the stop.                                                                                                                                                                                                                 |
| `data.trip.stops[].geofence_id`   | string          | Returns the ID of the geofence that was used to indicate the area to make a stop.                                                                                                                                                                                                                      |
| `data.trip.route`                 | array of object | An array of object returning the details of the locations tracked for the asset during the trip which has ended. Each object represents a single location that was tracked. Please note that this attribute will not be present in the response if no locations were tracked/uploaded during the trip. |
| `data.trip.route[].accuracy`      | number          | If available, this property returns the accuracy of the GPS information received at the tracked location. It is represented as an estimated horizontal accuracy radius, in meters, at the 68th percentile confidence level.                                                                            |
| `data.trip.route[].altitude`      | number          | If available in the GPS information, this property returns the altitude of the `asset` at the tracked location. It is represented as height, in meters, above the WGS84 reference ellipsoid.                                                                                                           |
| `data.trip.route[].bearing`       | number          | If available in the GPS information, this property returns the heading of the `asset` calculated from true north in clockwise direction at the tracked location. Please note that the bearing is not affected by the device orientation. The bearing will always be in the range of [0, 360).          |
| `data.trip.route[].location`      | object          | An object with the coordinates of the last tracked location.                                                                                                                                                                                                                                           |
| `data.trip.route[].location.lat`  | number          | Latitude of the tracked location of the `asset`.                                                                                                                                                                                                                                                       |
| `data.trip.route[].location.lon`  | number          | Longitude of the tracked location of the `asset`.                                                                                                                                                                                                                                                      |
| `data.trip.route[].meta_data`     | object          | Specifies the custom data about the location that was added when the location was uploaded.                                                                                                                                                                                                            |
| `data.trip.route[].speed`         | number          | If available in the GPS information, this property returns the speed of the `asset`, in meters per second, at the tracked location.                                                                                                                                                                    |
| `data.trip.route[].timestamp`     | integer         | A UNIX epoch timestamp in milliseconds, representing the time at which the location was tracked.                                                                                                                                                                                                       |
| `data.trip.route[].battery_level` | integer         | Returns the battery level of the GPS device, as a percentage, when the location was tracked. It has a minimum value of 0 and a maximum value of 100.                                                                                                                                                   |

```bash
curl --location 'https://api.nextbillion.io/skynet/trip/Test_trip?key=<your_api_key>'
```

#### Sample Response

```json
{
  "status": "Ok",
  "data": {
    "trip": {
      "id": "Test_trip",
      "state": "active",
      "asset_id": "TestAsset",
      "attributes": {
        "shift_timing": "1000 - 1800",
        "driver_name": "John"
      },
      "name": "Test_trip",
      "description": "This is the first trip for this asset",
      "started_at": 1715252316,
      "created_at": 1715252316,
      "updated_at": 1715253320,
      "ended_at": 1715253320,
      "stops": [
        {
          "geofence_id": "geofence_1",
          "name": "stop_1",
          "meta_data": ["Main Office Building", "Checkpoint"]
        }
      ]
    }
  }
}
```

### Update a Trip

Update the details of a trip using this method by providing the details to be updated in the request body. Users can update the details of a trip while it is active, but not once it has ended. However, please be cautious when using this method as the information updated using this method will overwrite any existing information for the fields that were updated. Service will respond with an acknowledgement once the trip is successfully updated.

PUT

https://api.nextbillion.io/skynet/trip/{id}?key={your_api_key}

#### Request Parameter

| Name  | Required | Format and Usage | Description                                                                                                                                                                                                                                              |
| ----- | -------- | ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`  | Yes      | Type: `string`   | Specify the ID of the trip to be updated. Please note that a trip which has ended can not be updated.                                                                                                                                                    |
| `key` | Yes      | Type: `string`   | A key is a unique identifier that is required to authenticate a request to the API. The namespace created using this key can be managed using the APIs & Services > Credentials section of user’s [NextBillion Console](https://console.nextbillion.ai). |

#### Request Body

| Field                 | Type            | Description                                                                                                                                                                                                                                                                                                                                                                          |
| --------------------- | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `asset_id`            | string          | Use this param to update the ID of the asset which made this trip. Please be cautious when using this field as providing an ID other than what was provided at the time of starting the trip, will link a new asset to the trip and un-link the original asset, even if the trip is still active.                                                                                    |
| `name`                | string          | Use this property to update the name of the trip.                                                                                                                                                                                                                                                                                                                                    |
| `description`         | string          | Use this parameter to update the custom description of the trip.                                                                                                                                                                                                                                                                                                                     |
| `meta_data`           | object          | Use this JSON object to update additional details about the trip. This property is used to add any custom information / context about the trip. Please note that updating the `meta_data` field will overwrite the previously added information.                                                                                                                                     |
| `attributes`          | object          | Use this field to update the `attributes` of the trip. Please note that when updating the `attributes` field, previously added information will be overwritten.                                                                                                                                                                                                                      |
| `stops`               | array of object | Use this object to update the details of the stops made during the trip. Each object represents a single stop. Please note that when updating this field, the new stops will overwrite any existing stops configured for the trip.                                                                                                                                                   |
| `stops[].name`        | string          | Use this filed to update the name of the stop.                                                                                                                                                                                                                                                                                                                                       |
| `stops[].meta_data`   | object          | Use this JSON object to update additional details about the stop. This property is used to add any custom information / context about the stop. Please note that updating the `meta_data` field will overwrite the previously added information.                                                                                                                                     |
| `stops[].geofence_id` | string          | Use this parameter to update the ID of the geofence indicating the area where the asset needs to make a stop, during the trip. Only the IDs of geofences created using [NextBillion.ai's Geofence API](https://docs.nextbillion.ai/docs/tracking/api/geofence#create-a-geofence) are accepted. Please note that updating this field will overwrite the previously added information. |

#### Response Schema

| Field     | Type   | Description                                                                                                                                                                                                                                  |
| --------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `message` | string | Displays the error message in case of a failed request. If the request is successful, this field is not present in the response.                                                                                                             |
| `status`  | string | A string indicating the state of the response. On successful responses, the value will be `Ok`. Indicative error messages are returned for different errors. See the [API Error Codes](#api-error-codes) section below for more information. |

#### Sample Request

```bash
curl --location --request PUT 'https://api.nextbillion.io/skynet/trip/Test_trip?key=<you_api_key>' \
--header 'Content-Type: application/json' \
--data '{"attributes": {
    "shift_timing": "0800 - 1800",
        "driver_name": "Jake"
  },
  "name": "New_Trip",
  "description": "This is a new trip",
  "stops":[
{
    "name":"Office Building",
    "meta_data":["Last Stop","Dropoff Area"],
    "geofence_id":"geofence_2"
  }
  ]
}'
```

#### Sample Response

```json
{
  "status": "Ok"
}
```

### End a Trip

Users can end a trip by using this method and just the ID of the trip that they want to end.

POST

https://api.nextbillion.io/skynet/trip/end?key={your_api_key}

#### Request Parameter

| Name  | Required | Format and Usage | Description                                                                                                                                                                                                                                              |
| ----- | -------- | ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `key` | Yes      | Type: `string`   | A key is a unique identifier that is required to authenticate a request to the API. The namespace created using this key can be managed using the APIs & Services > Credentials section of user’s [NextBillion Console](https://console.nextbillion.ai). |

#### Request Body

| Field | Type   | Description                             |
| ----- | ------ | --------------------------------------- |
| `id`  | string | Specify the ID of the trip to be ended. |

#### Response Schema

| Field     | Type   | Description                                                                                                                                                                                                                                  |
| --------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `message` | string | Displays the error message in case of a failed request. If the request is successful, this field is not present in the response.                                                                                                             |
| `status`  | string | A string indicating the state of the response. On successful responses, the value will be `Ok`. Indicative error messages are returned for different errors. See the [API Error Codes](#api-error-codes) section below for more information. |

#### Sample Request

```bash
curl --location 'https://api.nextbillion.io/skynet/trip/end?key=<your_api_key>' \
--header 'Content-Type: application/json' \
--data '{
    "id":"Test_trip"
}'
```

#### Sample Response

```json
{
  "status": "Ok"
}
```

### Summary of a Trip

Once a trip has ended, users can retrieve the locations tracked, distance covered, stops made, route taken and a host of other relevant information by using this method. The summary can, however, only be generated for the trips that have ended. Also, the fields related to routes taken like tracked locations, distance, duration and geometry will only be returned if there are a minimum number of locations tracked so that a feasible movement trajectory can be generated.

GET

https://api.nextbillion.io/skynet/trip/{id}/summary?key={your_api_key}

#### Request Parameter

| Name  | Required | Format and Usage | Description                                                                                                                                                                                                                                              |
| ----- | -------- | ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`  | Yes      | Type: `string`   | Specify the ID of the trip whose summary needs to be generated. Please ensure the trip is already completed. Trip summary is not available for ongoing trips.                                                                                            |
| `key` | Yes      | Type: `string`   | A key is a unique identifier that is required to authenticate a request to the API. The namespace created using this key can be managed using the APIs & Services > Credentials section of user’s [NextBillion Console](https://console.nextbillion.ai). |

#### Response Schema

| Field                                          | Type            | Description                                                                                                                                                                                                                                                                                                                                                                                                       |
| ---------------------------------------------- | --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `status`                                       | string          | A string indicating the state of the response. On successful responses, the value will be `Ok`. Indicative error messages are returned for different errors. See the [API Error Codes](#api-error-codes) section below for more information.                                                                                                                                                                      |
| `message`                                      | string          | Displays the error message in case of a failed request. If the request is successful, this field is not present in the response.                                                                                                                                                                                                                                                                                  |
| `data`                                         | object          | An container for the trip returned by the service.                                                                                                                                                                                                                                                                                                                                                                |
| `data.trip`                                    | object          | An object containing the returned trip summary.                                                                                                                                                                                                                                                                                                                                                                   |
| `data.trip.id`                                 | string          | Returns the unique identifier of the trip.                                                                                                                                                                                                                                                                                                                                                                        |
| `data.trip.asset_id`                           | string          | Returns the ID of the asset linked to the trip when the trip was started or updated.                                                                                                                                                                                                                                                                                                                              |
| `data.trip.state`                              | string          | Returns the current state of the trip. The value will be "active" if the trip is still going on, otherwise the value returned would be "ended".                                                                                                                                                                                                                                                                   |
| `data.trip.name`                               | string          | Returns the name for the trip as provided at the time of starting or updating the trip.                                                                                                                                                                                                                                                                                                                           |
| `data.trip.description`                        | string          | Returns the custom description for the trip as provided at the time of starting or updating the trip.                                                                                                                                                                                                                                                                                                             |
| `data.trip.meta_data`                          | object          | Returns the metadata containing additional information about the trip as provided at the time of starting or updating the trip.                                                                                                                                                                                                                                                                                   |
| `data.trip.attributes`                         | object          | Returns the `attributes` provided for the trip at the time of starting or updating it.                                                                                                                                                                                                                                                                                                                            |
| `data.trip.started_at`                         | integer         | Returns the time, expressed as UNIX epoch timestamp in milliseconds, when the trip started.                                                                                                                                                                                                                                                                                                                       |
| `data.trip.ended_at`                           | integer         | Returns the time, expressed as UNIX epoch timestamp in milliseconds, when the trip ended.                                                                                                                                                                                                                                                                                                                         |
| `data.trip.created_at`                         | integer         | Returns the time, expressed as UNIX epoch timestamp in milliseconds, when the trip was created.                                                                                                                                                                                                                                                                                                                   |
| `data.trip.updated_at`                         | integer         | Returns the timeme, expressed as UNIX epoch timestamp in milliseconds, when the trip was last updated.                                                                                                                                                                                                                                                                                                            |
| `data.trip.stops`                              | array of object | An array of objects returning the details of the stops made during the trip. Each object represents a single stop.                                                                                                                                                                                                                                                                                                |
| `data.trip.stops[].name`                       | string          | Returns the name of the stop that was provided when configuring this stop for the trip.                                                                                                                                                                                                                                                                                                                           |
| `data.trip.stops[].meta_data`                  | object          | Returns any meta data that was added to provide additional information about the stop.                                                                                                                                                                                                                                                                                                                            |
| `data.trip.stops[].geofence_id`                | string          | Returns the ID of the geofence that was used to indicate the area to make a stop.                                                                                                                                                                                                                                                                                                                                 |
| `data.trip.route`                              | array of object | An array of object returning the details of the locations tracked for the asset during the trip which has ended. Each object represents a single location that was tracked. Please note that this attribute will not be present in the response if no locations were tracked/uploaded during the trip.                                                                                                            |
| `data.trip.route[].accuracy`                   | number          | If available, this property returns the accuracy of the GPS information received at the tracked location. It is represented as an estimated horizontal accuracy radius, in meters, at the 68th percentile confidence level.                                                                                                                                                                                       |
| `data.trip.route[].altitude`                   | number          | If available in the GPS information, this property returns the altitude of the `asset` at the tracked location. It is represented as height, in meters, above the WGS84 reference ellipsoid.                                                                                                                                                                                                                      |
| `data.trip.route[].bearing`                    | number          | If available in the GPS information, this property returns the heading of the `asset` calculated from true north in clockwise direction at the tracked location. Please note that the bearing is not affected by the device orientation. The bearing will always be in the range of [0, 360).                                                                                                                     |
| `data.trip.route[].location`                   | object          | An object with the coordinates of the last tracked location.                                                                                                                                                                                                                                                                                                                                                      |
| `data.trip.route[].location.lat`               | number          | Latitude of the tracked location of the `asset`.                                                                                                                                                                                                                                                                                                                                                                  |
| `data.trip.route[].location.lon`               | number          | Longitude of the tracked location of the `asset`.                                                                                                                                                                                                                                                                                                                                                                 |
| `data.trip.route[].meta_data`                  | object          | Specifies the custom data about the location that was added when the location was uploaded.                                                                                                                                                                                                                                                                                                                       |
| `data.trip.route[].speed`                      | number          | If available in the GPS information, this property returns the speed of the `asset`, in meters per second, at the tracked location.                                                                                                                                                                                                                                                                               |
| `data.trip.route[].timestamp`                  | integer         | A UNIX epoch timestamp in milliseconds, representing the time at which the location was tracked.                                                                                                                                                                                                                                                                                                                  |
| `data.trip.route[].battery_level`              | integer         | Returns the battery level of the GPS device, as a percentage, when the location was tracked. It has a minimum value of 0 and a maximum value of 100.                                                                                                                                                                                                                                                              |
| `data.trip.asset`                              | object          | An object with details of the `asset` properties.                                                                                                                                                                                                                                                                                                                                                                 |
| `data.trip.asset.id`                           | string          | ID of the `asset`. This is the same ID that was generated/provided at the time of creating the `asset`.                                                                                                                                                                                                                                                                                                           |
| `data.trip.asset.device_id`                    | string          | ID of the `device` that is linked to this asset. Please note that there can be multiple `device_id` linked to a single `asset`. An empty response is returned if no devices are linked to the `asset`. User can link a device to an `asset` using the _Bind Asset to Device_ method.                                                                                                                              |
| `data.trip.asset.state`                        | string          | State of the asset. It will be "active" when the asset is in use or available for use, and it will be "deleted" in case the asset has been deleted.                                                                                                                                                                                                                                                               |
| `data.trip.asset.name`                         | string          | Name of the `asset`. The value would be the same as that provided for the `name` parameter at the time of creating or updating the `asset`.                                                                                                                                                                                                                                                                       |
| `data.trip.asset.description`                  | string          | Description of the `asset`. The value would be the same as that provided for the `description` parameter at the time of creating or updating the `asset`.                                                                                                                                                                                                                                                         |
| `data.trip.asset.created_at`                   | integer         | A UNIX epoch timestamp in seconds representing the time at which the `asset` was created.                                                                                                                                                                                                                                                                                                                         |
| `data.trip.asset.updated_at`                   | integer         | A UNIX epoch timestamp in seconds representing the time at which the `asset` was last updated.                                                                                                                                                                                                                                                                                                                    |
| `data.trip.asset.tracked_at`                   | integer         | A UNIX epoch timestamp in seconds representing the last time when the `asset` was tracked.                                                                                                                                                                                                                                                                                                                        |
| `data.trip.asset.attributes`                   | object          | A string dictionary object containing `attributes` of the `asset`. These `attributes` were associated with the `asset` at the time of creating or updating it. `attributes` can be added to an `asset` using the _Update Asset Attributes_ method.                                                                                                                                                                |
| `data.trip.asset.latest_location`              | object          | An object with details of the last tracked location of the asset.                                                                                                                                                                                                                                                                                                                                                 |
| `data.trip.asset.latest_location.location`     | object          | An object with the coordinates of the last tracked location.                                                                                                                                                                                                                                                                                                                                                      |
| `data.trip.asset.latest_location.location.lat` | number          | Latitude of the tracked location of the `asset`.                                                                                                                                                                                                                                                                                                                                                                  |
| `data.trip.asset.latest_location.location.lon` | number          | Longitude of the tracked location of the `asset`.                                                                                                                                                                                                                                                                                                                                                                 |
| `data.trip.asset.latest_location.timestamp`    | integer         | A UNIX epoch timestamp in milliseconds, representing the time at which the location was tracked.                                                                                                                                                                                                                                                                                                                  |
| `data.trip.asset.latest_location.accuracy`     | number          | If available, this property returns the accuracy of the GPS information received at the last tracked location. It is represented as an estimated horizontal accuracy radius, in meters, at the 68th percentile confidence level.                                                                                                                                                                                  |
| `data.trip.asset.latest_location.speed`        | number          | If available in the GPS information, this property returns the speed of the `asset`, in meters per second, at the last tracked location.                                                                                                                                                                                                                                                                          |
| `data.trip.asset.latest_location.bearing`      | number          | If available in the GPS information, this property returns the heading of the `asset` calculated from true north in clockwise direction at the last tracked location. Please note that the bearing is not affected by the device orientation. The bearing will always be in the range of [0, 360).                                                                                                                |
| `data.trip.asset.latest_location.altitude`     | number          | If available in the GPS information, this property returns the altitude of the `asset` at the last tracked location. It is represented as height, in meters, above the WGS84 reference ellipsoid.                                                                                                                                                                                                                 |
| `data.trip.asset.tags`                         | array of string | **This parameter will be deprecated soon! Please move existing `tags` to `attributes` parameter.** Tags of the asset. These were associated with the `asset` when it was created or updated. `tags` can be used for filtering assets in operations like _Get Asset List_ and asset **Search** methods. They can also be used for monitoring of assets using **Monitor** methods after linking `tags` and `asset`. |
| `data.trip.distance`                           | number          | Returns the total distance covered during the trip, in meters. Please note that this field will be available in the response only if a minimum of 3 locations were tracked during the trip.                                                                                                                                                                                                                       |
| `data.trip.duration`                           | number          | Returns the total duration elapsed during the trip, in seconds. Please note that this field will be available in the response only if a minimum of 3 locations were tracked during the trip.                                                                                                                                                                                                                      |

#### Sample Request

```bash
curl --location 'https://api.nextbillion.io/skynet/trip/Test_trip/summary?key=<your_api_key>'
```

#### Sample Request

```json
{
   "status": "Ok",
   "data": {
       "trip": {
           "id": "trip_A",
           "state": "ended",
           "asset_id": "TestAsset",
           "attributes": {
               "shift_timing": "0800 - 1800",
               "driver_name": "Jake"
           },
           "name": "New_Trip",
           "description": "This is a new trip",
           "started_at": 1715336774,
           "created_at": 1715336774,
           "updated_at": 1715337519,
           "ended_at": 1715337519,
           "stops": [
               {
                   "geofence_id": "geofence_1",
                   "name": "stop_1",
                   "meta_data": [
                       "Main Office Building",
                       "Checkpoint"
                   ]
               }
           ],
           "route": [
               {
                   "location": {
                       "lat": 17.46915812,
                       "lon": 78.36441801
                   },
                   "timestamp": 1715336804000,
                   "speed": 20,
                   "bearing": 10
               },
               {
                   "location": {
                       "lat": 17.469321874065376,
                       "lon": 78.36597817814541
                   },
                   "timestamp": 1715336836000,
                   "speed": 5
               },
               {
                   "location": {
                       "lat": 17.46192848018246,
                       "lon": 78.36714973888324
                   },
                   "timestamp": 1715336922000,
                   "speed": 10
               },
               {
                   "location": {
                       "lat": 17.450776125840537,
                       "lon": 78.36379862238758
                   },
                   "timestamp": 1715336999000,
                   "speed": 50
               },
               {
                   "location": {
                       "lat": 17.445965512172606,
                       "lon": 78.36602403196639
                   },
                   "timestamp": 1715337109000,
                   "speed": 30
               },
               {
                   "location": {
                       "lat": 17.44135133576291,
                       "lon": 78.37416543069746
                   },
                   "timestamp": 1715337142000
               },
               {
                   "location": {
                       "lat": 17.435588888792527,
                       "lon": 78.38258300610302
                   },
                   "timestamp": 1715337218000,
                   "speed": 17
               },
               {
                   "location": {
                       "lat": 17.431970567264155,
                       "lon": 78.38864714902304
                   },
                   "timestamp": 1715337366000,
                   "speed": 26
               },
               {
                   "location": {
                       "lat": 17.437514449835533,
                       "lon": 78.38855455319276
                   },
                   "timestamp": 1715337419000,
                   "speed": 19
               },
               {
                   "location": {
                       "lat": 17.437888759114937,
                       "lon": 78.38784273027201
                   },
                   "timestamp": 1715337459000,
                   "speed": 34
               }
           ],
           "asset": {
               "id": "TestAsset",
               "device_id": "nb_track",
               "state": "active",
               "name": "New_Asset_01",
               "description": "Pickup vehicle",
               "tags": [
                  "shift_timing": "0800 - 1800",
                   "driver_name": "Jake"
               ],
               "created_at": 1715336763,
               "updated_at": 1715336778,
               "attributes": {
                   "Job": "Pickup",
                   "driver": "Jake",
                   "vType": "EV",
                   "vehicle": "Tesla"
               }
           },
           "duration": 655,
           "distance": 7021
       }
   }
}
```

### Delete a Trip

Users can delete an existing trip by providing its ID in the path parameter.

DELETE

https://api.nextbillion.io/skynet/trip/{id}?key={your_api_key}

#### Request Parameter

| Name  | Required | Format and Usage | Description                                                                                                                                                                                                                                              |
| ----- | -------- | ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`  | Yes      | Type: `string`   | Specify the ID of the trip to be deleted.                                                                                                                                                                                                                |
| `key` | Yes      | Type: `string`   | A key is a unique identifier that is required to authenticate a request to the API. The namespace created using this key can be managed using the APIs & Services > Credentials section of user’s [NextBillion Console](https://console.nextbillion.ai). |

#### Response Schema

| Field     | Type   | Description                                                                                                                                                                                                                                  |
| --------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `message` | string | Displays the error message in case of a failed request. If the request is successful, this field is not present in the response.                                                                                                             |
| `status`  | string | A string indicating the state of the response. On successful responses, the value will be `Ok`. Indicative error messages are returned for different errors. See the [API Error Codes](#api-error-codes) section below for more information. |

#### Sample Request

```bash
curl --location --request DELETE 'https://api.nextbillion.io/skynet/trip/Test_trip?key=<your_api_key>'
```

#### Sample Response

```json
{
  "status": "Ok"
}
```

### Trip Subscription

Users can subscribe to active trips to get real-time updates as the trips progress. To subscribe, users need to connect to a web-socket server. Once the connection is established, users can send the required action message to the web-socket. The action message, in general, contains information about the type of action to perform along with the required details to implement the action.

Upon successfully subscribing to a trip, users would receive real-time updates on the web-socket connection as new locations are tracked by the asset, while it is moving.

Let’s dive deep to understand the complete lifecycle of a subscription.

#### Connect to Web Socket Server

To connect to the web socket users can send a request to the following server from their application

wss://api.nextbillion.io/skynet/subscribe?key={your_api_key}

A few points regarding the connection and its characteristics

- A connection is valid for 5 minutes only.
- A `ping frame` is sent by the server to the client every 1 minute. Clients can choose to respond with a `pong frame` immediately or at any desired frequency higher than every 5 minutes.
- Alternatively, users can also send a heartbeat frame to the server to keep the connection alive at a frequency higher than every 5 minutes. See [here](#send-a-heartbeat-message) for an example heartbeat message.

#### Action Message Body

Once the connection is established users can send the appropriate action message to make the web-socket perform the desired behavior. Below is the input schema to configure action messages.

| Field       | Type   | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| ----------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`        | string | Specify a custom ID for the subscription. It can be used to reference a given subscription in the downstream applications / systems.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `action`    | string | Specify the behavior that needs to be achieved for the subscription. Following values are accepted: _ TRIP_SUBSCRIBE: Enable a trip subscription. _ TRIP_UNSUBSCRIBE: Unsubscribe from a trip \* HEARTBEAT: Enable heartbeat mechanism for a web-socket connection. The action message need to be sent at a frequency higher than every 5 mins to keep the connection alive. Alternatively, users can chose to respond to the ping frame sent by web socket server to keep the connection alive. Refer to [connection details](https://188--nbai-docs-stg.netlify.app/docs/tracking/api/live-tracking-api#connect-to-web-socket-server) for more details. |
| `params`    | object | -                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `params.id` | string | Specify the ID of an active trip that needs to be subscribed. The ID of a trip is returned in the response when _Start A Trip_ request is acknowledged. This attribute is mandatory when `action` is set to either "TRIP_SUBSCRIBE" or "TRIP_UNSUBSCRIBE"                                                                                                                                                                                                                                                                                                                                                                                                 |

#### Action Response Schema

| Field       | Type    | Description                                                                                          |
| ----------- | ------- | ---------------------------------------------------------------------------------------------------- |
| `id`        | string  | Subscription ID as provided in the input action message.                                             |
| `status`    | string  | Status of the action. It can have only two values - "success" or "error".                            |
| `error`     | string  | Returns the error message when `status: error`. Otherwise, response doesn't contain this field.      |
| `timestamp` | integer | Returns the UNIX timestamp, in milliseconds format, when the web-socket returns the action response. |

#### Stream Data Schema

When a trip is subscribed, the response from the web-socket containing the details about the trip will follow the below schema:

loading...

##### Sample stream data message

```json
{
  "type": "trip_update",
  "data": {
    "trip_id": "957ab197-08ff-4995-aece-676d68f76a10",
    "locations": [
      {
        "location": {
          "lat": 17.46915812,
          "lon": 78.36441801
        },
        "timestamp": 1720177320384,
        "speed": 20,
        "bearing": 10
      },
      {
        "location": {
          "lat": 17.469321874065376,
          "lon": 78.36597817814541
        },
        "timestamp": 1720177322384,
        "speed": 5
      }
    ]
  },
  "timestamp": 1720177325
}


// trip end event

{
  "type": "trip_event",
  "data": {
    "event_type": "trip_end",
    "timestamp": 1720177365330,
    "trip_id": "957ab197-08ff-4995-aece-676d68f76a10"
  },
  "timestamp": 1720177366
}
```

#### Send a Heartbeat message

In order to keep the connection with the web-socket server alive, users can choose to make use of a heartbeat action to do so. Following is an example of a heartbeat action message:

```json
{
  "id": "test_Subscription_1",
  "action": "HEARTBEAT"
}
```

### Unsubscribe from a trip

Users can also unsubscribe to a trip by sending the relevant action message over the web-socket connection. The action should be set to “TRIP_UNSUBSCRIBE” to achieve it. Following is a code snippet to unsubscribe from a sample trip ID.

```json
{
  "id": "Test Unsubscribe",
  "action": "TRIP_UNSUBSCRIBE",
  "params": {
    "id": "00fd9815-c482-48f6-8649-ccc134a24c79"
  }
}
```

## Namespaces

Namespaces help users to create multiple keys under one parent organization. This feature allows users to share the capabilities of Live Tracking API with multiple consumers (customers, teams, departments etc) while ensuring isolation of underlying data - a key belonging to a namespace can access the data belonging to that namespace only. However, using namespaces is **not** mandatory to access the capabilities of Live Tracking services.

### Create a namespaced key

Once a request for creating a new namespace key is successfully submitted, the service responds with a unique key for the namespace along with an expiration date for the key. The newly created keys are available for use in 15 minutes after they have been created.

Please note that once the namespace keys are created, users can manage them through the APIs & Services > Credentials section of their [NextBillion Console](https://console.nextbillion.ai).

POST

https://namespaces.nextbillion.io/namespaced-apikeys?namespace={namespace}&key={your_api_key}

#### Request Parameter

| Name        | Required | Format and Usage                               | Description                                                                                                                                                                                                                                                                                                             |
| ----------- | -------- | ---------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `namespace` | Yes      | Type: `string`<br>Example: namespace=test_name | Specify a name for the `namespace`. If the namespace specified is unique then a new namespace along with a new key is created. Whereas if the specified `namespace` is not unique, a new key will be created in the existing `namespace`. Please note that a `namespace` cannot be created using another namespace key. |
| `key`       | Yes      | Type: `string`                                 | A key is a unique identifier that is required to authenticate a request to the API. The namespace created using this key can be managed using the APIs & Services > Credentials section of user’s [NextBillion Console](https://console.nextbillion.ai).                                                                |

#### Response Schema

| Field               | Type    | Description                                                                                                      |
| ------------------- | ------- | ---------------------------------------------------------------------------------------------------------------- |
| `status`            | integer | Returns the API response code.                                                                                   |
| `result`            | object  | An object to return the details about the namespace key created.                                                 |
| `result.apikey`     | string  | Returns the unique `key` created for the specified namespace.                                                    |
| `result.namespace`  | string  | Returns the name of the `namespace` for which the key is created.                                                |
| `result.expires_at` | integer | Returns the time, expressed as UNIX epoch timestamp in seconds, when the namespace key will expire.              |
| `result.sub_id`     | string  | An internal subscription ID.                                                                                     |
| `result.created_at` | integer | Returns the time, expressed as UNIX epoch timestamp in seconds, when the namespace key was created.              |
| `message`           | string  | Returns the error message in case of any error. If there is no error, then this field is absent in the response. |
| `error`             | string  | Returns the error type in case of any error. If there is no error, then this field is absent in the response.    |

#### Sample API Request

Let’s create a new namespace called _sample_namespace_.

```bash
curl --location --request POST 'https://namespaces.nextbillion.io/namespaced-apikeys?key=<your_api_key>&namespace=sample_namespace'
```

#### Sample API Response

```json
{
  "status": 200,

  "result": {
    "apikey": "d8a89ced8e723dg6a857df20e0d91207",

    "namespace": "sample_namespace",

    "expired_at": 1735656412,

    "sub_id": 692,

    "created_at": 1732008505
  }
}
```

### Delete a namespace key

Users can also delete an existing namespace key using the HTTP DELETE method to the endpoint listed below. Users need to provide the key to be deleted and the namespace to which it belongs to . Please note that a namespace key can’t be used to delete another namespace key. The deleted key will be unavailable for use after 15 minutes once they have been deleted.

Please note that once the namespace keys are created, users can manage them through the APIs & Services > Credentials section of their [NextBillion Console](https://console.nextbillion.ai).

DELETE

https://namespaces.nextbillion.io/namespaced-apikeys?key={your_api_key}&namespace={namespace_name}&key_to_delete={key_to_delete}

#### Request Parameter

| Name            | Required | Format and Usage                                                                   | Description                                                                                                                                                                                                                                                                                                                                       |
| --------------- | -------- | ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `key`           | Yes      | Type: `string`<br>Format: 32 character alphanumeric string<br>Example: key=API_KEY | A key is a unique identifier that is required to authenticate a request to the API. Please note for the delete namespace key operation another namespace key cannot be used. The namespace created using this key can be managed using the APIs & Services > Credentials section of user’s [NextBillion Console](https://console.nextbillion.ai). |
| `namespace`     | Yes      | Type: `string`                                                                     | Specify the name of the `namespace` to which the \`key_to_delete\` belongs. Please note that a namespace key cannot be deleted using another namespace key.                                                                                                                                                                                       |
| `key_to_delete` | Yes      | Type: `string`                                                                     | Specify the key to be deleted.                                                                                                                                                                                                                                                                                                                    |

#### Response Schema

| Field    | Type    | Description                                                                                                                                                                                                                                                                         |
| -------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `status` | integer | A string indicating the state of the response. A successful delete operation ins indicated by an HTTP code of`200`. See the [API Error Codes](https://docs.nextbillion.ai/docs/tracking/api/live-tracking-api#api-error-codes) section below for possible values in case of errors. |
| `msg`    | string  | Its value is `OK` in case of a successful delete operation. Indicative error messages are returned otherwise, for different errors.                                                                                                                                                 |

#### Sample API Request

Let’s delete a key represented by _<namespace_key>_, belonging to a namespace called _sample_namespace_.

```bash
curl --location --request DELETE 'https://namespaces.nextbillion.io/namespaced-apikeys?key=<your_api_key>&namespace=sample_namespace&key_to_delete=<namespace_key>'
```

#### Sample API Response

```json
{
  "status": 200,
  "msg": "OK"
}
```

## API Query Limits

- Limitation for the `attributes` object:
  - The maximum number of `key`:`value` pairs that can be added is 100.
  - The overall size of the object should not exceed 65kb.
- For smooth tracking experience, it is recommended to keep the location service of your GPS application to always ON for a constant stream of location data.
- This page number parameter `pn` does not have a maximum limit per se, but would return an empty result set in case a higher value is provided when the result-set itself is smaller.
- The maximum value for page size `ps` parameter is 100, except in case of **Track locations of an Asset** method where it is 500.
- Only the `updated_at` or `created_at` fields can be used for sorting the results using the `sort` parameter.
- Search methods will only return active assets in the results. An asset is considered active if it has been tracked at least once in the last 7 days.
- In _Around Search_ method, the maximum `radius` of the search area can not be more than 5000 meters.
- In _Polygon Search_ and _Bound Search_ methods, the maximum area of the “polygon” and “bound box”, respectively, can not be more than 3000 km2.
- The maximum number of assets that can be created for a namespace is 10000, if namespaces are being used. If not, then the same limit applies to an organization as well.
- The maximum number of monitors that can be created for a namespace is 200, if namespaces are being used. If not, then the same limit applies to an organization as well.
- NextBillion.ai allows a maximum rate limit of 6000 queries per minute or 100 queries/second for continuous requests.

  _Note_: We can increase the quota if needed, on request. Contact [support@nextbillion.ai](mailto:support@nextbillion.ai) for more details.

## API Error Codes

| Response Code | Description                                                      | Additional Notes                                                                                                                                           |
| ------------- | ---------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 200           | Normal success case.                                             | Normal success case.                                                                                                                                       |
| 400           | Input validation failed.                                         | There is a missing or an invalid parameter or a parameter with an invalid value type is added to the request.                                              |
| 401           | APIKEY not supplied or invalid.                                  | This error occurs when the wrong API key is passed in the request or the key is missing altogether.                                                        |
| 403           | APIKEY is valid but does not have access to requested resources. | You might be querying for a geographical region which is not valid for your account or requesting a service which is not enabled for you.                  |
| 404           | Requested host/path not found.                                   | This error occurs when a malformed hostname is used.                                                                                                       |
| 422           | Could not process the request.                                   | The request could not be completed for the given set of locations or parameter configuration.                                                              |
| 429           | Too many requests.                                               | QPM reached or API request count quota reached.                                                                                                            |
| 460           | Incorrect device ID                                              | This error occurs when an unmatched device is used to upload locations for an asset. Please use the correct device ID which is bound to the asset.         |
| 500           | Internal Service error.                                          | There was an internal issue with NextBillion.ai services. You can reach out to [support@nextbillion.ai](mailto:support@nextbillion.ai) for an explanation. |

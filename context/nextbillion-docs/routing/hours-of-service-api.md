# Hours Of Service API

## Introduction

NextBillion.ai’s Hours of Service (HOS) API enables logistics platforms to optimize trip planning while ensuring compliance with Hours of Service regulations. By integrating the driver's current activity status, accumulated duty times, and detailed trip itineraries, the service evaluates the feasibility of planned stops. It allows users to choose which regulations that need to be applied for their fleets and accordingly identifies necessary HOS breaks, providing precise timing to maintain safety and regulatory adherence throughout the trip.

POST

https://api.nextbillion.io/hos/trip-plan?key={your_api_key}

## Request Parameters

| Name  | Required | Format and Usage                                                                       | Description                                                                         |
| ----- | -------- | -------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| `key` | Yes      | Type: `string`<br>Format: `32 character alphanumeric string`<br>Example: `key=API_KEY` | A key is a unique identifier that is required to authenticate a request to the API. |

## Request Body

| Field                                             | Type            | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| ------------------------------------------------- | --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `poi_stops`                                       | boolean         | Specify if appropriate POIs should be suggested in the response where inserted HOS breaks can be taken. When `true` (default):<br> - a maximum of 3 POIs/stops will be returned in the response for each stop inserted by the API.<br> - Please note that the POIs returned are an unprioritized list of suggestions regarding the places where a driver can take a given break.<br><br> When `false`, only the latitude and longitude of the point on the route where HOS limits kick in will be returned.                                                                                                                 |
| `hos_break_window`                                | integer         | Specify the duration, in seconds, before HOS time violation, within which the service can insert a break. For example, if a HOS break is to be taken at 10AM, and `hos_break_window: 1800`, then the service can insert HOS break anytime between 9:30 AM - 10 AM. Please note:<br> _ Default: 1800 sec<br> _ Min: 600 sec<br> \* Max: 3600 sec                                                                                                                                                                                                                                                                             |
| `hos_regulations`                                 | object          | An object to collect the details of the rules to be applied for HOS compliance.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| `hos_regulations.type`                            | string          | Select the HOS rule set to be applied. Following rules sets are supported currently:<br><br>_ US60H7D: Drivers can be on-duty for 60hrs during any period of 7 consecutive days time.<br><br>_ US70H8D: Drivers can be on-duty for 70hrs during any period of 8 consecutive days time.<br><br>Allowed values: `US60H7D`, `US70H8D`                                                                                                                                                                                                                                                                                          |
| `hos_regulations.include_cycle_reset`             | boolean         | Whether to add a cycle reset break (34-hour restart), if needed, while planning stops. Defaults to false.<br><br>Default: `false`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `driver_current_hos_state`                        | object          | An object to collect the current HOS state of the driver. Providing this input is mandatory for every request.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `driver_current_hos_state.daily_drive_time_used`  | integer         | Mandatory. Duration of driving time, in seconds, accumulated since the last daily, long-break.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `driver_current_hos_state.daily_duty_time_used`   | integer         | Mandatory. Duration of on-duty time (driving + non-driving), in seconds, accumulated since the last daily, long break                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| `driver_current_hos_state.time_since_last_break`  | integer         | Duration of continuous driving, in seconds, since the end of the last qualifying short break i.e. any on-duty-not-driving event which was more than 30 minutes. It is considered only when `driver_current_activity.type = driving` and some [more cases listed here](#short-break-qualification-for-a-given-current-driver-state).<br><br>If this input is not provided then we assume no short break was taken until the API call was made.                                                                                                                                                                               |
| `driver_current_hos_state.daily_cycle_duty_times` | integer         | Mandatory. Array of on-duty times, in seconds, for each completed day in the current cycle or since last cycle reset. It should **NOT** include today's duty time.<br><br>The maximum array length matches the cycle length as per selected `hos_regulations.type`. It would be 7 if `US60H7D` was selected and 8, if `US70H8D` was selected.                                                                                                                                                                                                                                                                               |
| `driver_current_activity`                         | object          | An object to collect the details of the current activity of the driver. Providing this input is mandatory for every request.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `driver_current_activity.type`                    | string          | Mandatory. Specify the type of activity driver is undertaking currently. One of the following activities can be chosen from:<br><br>_ `driving`: Driver is currently driving.<br><br>_ `on_duty_not_driving` : Driver is currently on-duty but not driving.<br><br>_ `off_duty` : Driver is off-duty for a short time.<br><br>_ `daily_break` : Driver is taking the daily 10hr continuous rest break<br><br>\* `cycle_break` : Driver is on a 34hr long break to reset cycle times.<br><br>Please check this section to know the [impact of different statuses on different timers](#current-driver-state-and-its-impact). |
| `driver_current_activity.time_elapsed`            | integer         | Time elapsed, in seconds, since the start of the current state.<br><br>Mandatory for all non-driving statuses: _on_duty_not_driving, off_duty, daily_break, cycle_break_.                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `trip`                                            | object          | An object to collect details of the planned trip and its stops or waypoints. Providing this input is mandatory for every request.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `trip.trip_start_time`                            | string          | Planned trip start time. Defaults to current time.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| `trip.stops`                                      | array of object | An array of objects to collect the ordered sequence of planned stops i.e. all on-duty-not-driving as well as any planned off-duty stops, in the trip. Each object corresponds to one stop.                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| `trip.stops[].stop_id`                            | string          | Specify an unique identifier for this stop.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `trip.stops[].stop_type`                          | string          | Specify the type of planned stop. Allows following values:<br><br>_ `origin` : Starting location of the trip.<br><br>_ `destination` : Destination of the trip<br><br>\* `planned_stop` : A planned on-duty-not-driving stop on the trip.<br><br>Providing `origin` and `destination` stop types is mandatory.                                                                                                                                                                                                                                                                                                              |
| `trip.stops[].stop_location`                      | string          | Specify the coordinates for the given stop in "latitude, longitude" format.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `trip.stops[].estimated_stop_duration`            | integer         | Specify the estimated time, in seconds, that would be spent at the given stop.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `routing`                                         | object          | An object to collect the routing preferences to be applied for route and ETA calculations for determining HOS compliance.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `routing.mode`                                    | string          | Specify the traveling mode to be used for the trip. Defaults to `car`.<br><br>Allowed values: `car`, `truck`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `routing.truck_size`                              | string          | Specify the dimensions of a truck, in centimeters (cm), in the format of "height,width,length". This parameter is effective only when `mode=truck`. Maximum dimensions are as follows: Height = 1000 cm Width = 5000 cm Length = 5000 cm<br><br>Format: `"height,width,length"`<br>Example: `“truck_size”: “215,180,380”`                                                                                                                                                                                                                                                                                                   |
| `routing.truck_weight`                            | integer         | Specify the truck weight inclusive of cargo and trailers, in kgs. Effective only when `mode=truck`<br><br>_Maximum value:_ 100,000 kg<br><br>Example: `“truck_weight”: 12500`                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `routing.hazmat_type`                             | string          | Specify the type of hazardous material being carried and the API will avoid roads which are not suitable for the type of goods specified, to calculate ETAs. Multiple values can be separated using a pipe operator `\|`.<br><br>Please note that this parameter is effective only when `mode=truck`.<br><br>Allowed values: `explosives`, `gas`, `flammable_liquid`, `flammable_gas`, `organic`, `toxic`, `radioactive`, `corrosive`, `other`<br>Example: `“hazmat_type”: “explosives\|corrosive”`                                                                                                                         |

## Response Schema

| Field                                                             | Type            | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| ----------------------------------------------------------------- | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `status`                                                          | string          | Returns the status of the request. In case of errors, the corresponding error code is returned.                                                                                                                                                                                                                                                                                                                                                               |
| `msg`                                                             | string          | Returns the error message in case of errors. This field is not present in the response for successful requests.                                                                                                                                                                                                                                                                                                                                               |
| `warnings`                                                        | array of string | An array of strings detailing the various warning, if any, returned for the given input request.                                                                                                                                                                                                                                                                                                                                                              |
| `hos_result`                                                      | object          | An object with details of the HoS compliance status for each planned stop along with stop inserted to comply with HoS.                                                                                                                                                                                                                                                                                                                                        |
| `hos_result.trip_stops`                                           | array of object | A array of objects with details of each stop. Each object corresponds to one stop.                                                                                                                                                                                                                                                                                                                                                                            |
| `hos_result.trip_stops[].type`                                    | string          | Indicatest the type of the stop. Possible enums:<br><br>_origin:_ Trip’s origin stop<br><br>_destination:_ Trip’s destination stop<br><br>_planned_stop:_ A stop that was provided in the input trip plan.<br><br>_off_duty:_ Inserted HOS stop to honor continuous driving regulations.<br><br>_daily_break:_ Inserted HOS stop to honor daily driving or duty limits.<br><br>_cycle_break:_ Inserted HOS stop to reset the cycle duty times rolling-window. |
| `hos_result.trip_stops[].stop_id`                                 | string          | Returns the unique ID of the stop.                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `hos_result.trip_stops[].hos_feasible`                            | boolean         | When type is `planned_stop`, this field indicates if the stop is feasible or not feasible under applicable `hos_regulations`.                                                                                                                                                                                                                                                                                                                                 |
| `hos_result.trip_stops[].drive_duration`                          | integer         | For planned stops, returns the total drive time, in seconds, up to this stop. This is only the trip's driving minutes and doesn’t consider any driver times before the trip.                                                                                                                                                                                                                                                                                  |
| `hos_result.trip_stops[].stop_duration`                           | integer         | Returns the duration, in seconds, spent at the stop.                                                                                                                                                                                                                                                                                                                                                                                                          |
| `hos_result.trip_stops[].arrival_time`                            | string          | Returns the arrival time at this stop                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `hos_result.trip_stops[].departure_time`                          | string          | Returns the departure time from this stop.                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `hos_result.trip_stops[].location`                                | array of number | Returns the location coordinates of the stop.                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `hos_result.trip_stops[].address`                                 | array of object | Returns the addresses of the POIs suggested for each inserted HOS break. A maximum of 3 POIs can be returned, if available. Each object represents one stop suggestion. `address` attribute is returned in the response only when `poi_stops=true`.                                                                                                                                                                                                           |
| `hos_result.trip_stops[].address[].label`                         | string          | Assembled address value built out of the individual address components according to the regional postal rules.                                                                                                                                                                                                                                                                                                                                                |
| `hos_result.trip_stops[].address[].countryName`                   | string          | The localized country name.                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `hos_result.trip_stops[].address[].state`                         | string          | Name of the state or primary division of the country.                                                                                                                                                                                                                                                                                                                                                                                                         |
| `hos_result.trip_stops[].address[].county`                        | string          | A division of a state; typically, a primary-level administrative division of a state or equivalent, if available.                                                                                                                                                                                                                                                                                                                                             |
| `hos_result.trip_stops[].address[].city`                          | string          | The name of the primary locality of the suggested stop, if available.                                                                                                                                                                                                                                                                                                                                                                                         |
| `hos_result.trip_stops[].address[].street`                        | string          | Name of street on which the suggested stop lies, if available.                                                                                                                                                                                                                                                                                                                                                                                                |
| `hos_result.trip_stops[].address[].postalCode`                    | string          | The zip or postal code of the suggested stop, if available.                                                                                                                                                                                                                                                                                                                                                                                                   |
| `hos_result.trip_stops[].address[].access`                        | array of number | Returns the location coordinates of the access point for the suggesetd stop.                                                                                                                                                                                                                                                                                                                                                                                  |
| `hos_result.trip_stops[].address[].categories`                    | array of string | The list of POI categories assigned to this place.                                                                                                                                                                                                                                                                                                                                                                                                            |
| `hos_result.post_trip_hos_state`                                  | object          | An object returning the status of different timers post the trip.                                                                                                                                                                                                                                                                                                                                                                                             |
| `hos_result.post_trip_hos_state.available_drive_time_until_break` | integer         | Returns the drive time available until the next short break, in seconds.                                                                                                                                                                                                                                                                                                                                                                                      |
| `hos_result.post_trip_hos_state.available_drive_time`             | integer         | Returns the drive time available for the day, in seconds.                                                                                                                                                                                                                                                                                                                                                                                                     |
| `hos_result.post_trip_hos_state.available_on_duty_time`           | integer         | Returns the on-duty time available for the day, in seconds.                                                                                                                                                                                                                                                                                                                                                                                                   |
| `hos_result.post_trip_hos_state.cycle_duty_time_used`             | integer         | Returns the cycle times consumed during the current trip, in seconds.                                                                                                                                                                                                                                                                                                                                                                                         |

## Current Driver State and its impact

All the different timers that determine and control HOS compliance - continuous driving, daily drive time, daily on-duty time and cycle duty time are impacted by the driver's current activity at the time of submitting an HOS request. Here is a quick summary of different driver states and its corresponding impact on different timers:

| **Driver Activity →** | _daily_drive_minutes_used_            | _daily_duty_minutes_used_        | _minutes_since_last_break_                                         | _cycle_time_                                 |
| --------------------- | ------------------------------------- | -------------------------------- | ------------------------------------------------------------------ | -------------------------------------------- |
| _driving_             | ⬆️ Continues increasing from API time | ⬆️ Continues increasing          | ⬆️ Continues increasing                                            | ⬆️ Continues increasing                      |
| _on_duty_not_driving_ | ⏸️ No increase until trip starts      | ⬆️ Continues increasing          | 🔁 Reset to 0 **if break qualifies**, else ⬆️ continues increasing | ⬆️ Continues increasing                      |
| _off_duty_            | ⏸️ No increase until trip starts      | ⏸️ No increase until trip starts | 🔁 Reset to 0 **if break qualifies**, else ⬆️ Continues increasing | ⬆️ Continues increasing                      |
| _daily_break_         | 🔁 Reset to 0 at trip start           | 🔁 Reset to 0 at trip start      | 🔁 Reset to 0                                                      | ⬆️ Continues to accumulate after trip starts |
| _cycle_break_         | 🔁 Reset to 0 at trip start           | 🔁 Reset to 0 at trip start      | 🔁 Reset to 0                                                      | 🔁 Clears the daily_cycle_duty_times array   |

## Short break qualification for a given current driver state

This section covers when a `off_duty` or `on_duty_not_driving` activity by the driver qualifies as a break against continuous driving limitations. Applies only when the driver current activity is one of the following:

- `on_duty_not_driving`
- `off_duty`

| Condition                                                                                          | Result                                                                            |
| -------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| `time_elapsed >= 1800 sec (30min)`                                                                 | Current break qualifies as a short break→ `minutes_since_last_break = 0`          |
| `time_elapsed < 1800 sec (30min)`                                                                  | Calculated projected time in the current status. Details in the next rows.        |
| `Projected total break time:(time_elapsed + (trip_start_time - current_time)) >= 1800 sec (30min)` | ✅ Current break will qualify before trip → reset `minutes_since_last_break` to 0 |
| `Otherwise`                                                                                        | Does NOT qualify → `minutes_since_last_break` keeps increasing                    |

## Sample API Query

```bash
curl --location 'https://api.nextbillion.io/hos/trip-plan?key=<your_api_key>' \
--header 'Content-Type: application/json' \
--data '{
  "poi_stops": true,
  "hos_break_window": 2100,
  "hos_regulations": {
    "type": "US70H8D",
    "include_cycle_reset": false
  },
  "driver_current_hos_state": {
    "daily_drive_time_used": 22000,
    "daily_duty_time_used": 26000,
    "daily_cycle_duty_times": [],
    "driver_current_activity": {
      "type": "driving",
      "time_elapsed": 1800
    }
  },
  "trip": {
    "routing": {
      "mode": "truck"
    },
    "stops": [
      {
        "stop_id": "origin",
        "stop_type": "origin",
        "stop_location": "35.2302,-100.2500"
      },
      {
        "stop_id": "destination",
        "stop_type": "destination",
        "stop_location": "35.4676,-97.5164"
      }
    ]
  }
}'
```

## Sample API Response

```json
{
  "status": "Ok",
  "warnings": [
    "driver is currently driving; trip_start_time is ignored, using current time instead"
  ],
  "hos_result": {
    "trip_stops": [
      {
        "type": "origin",
        "stop_id": "origin",
        "hos_feasible": true,
        "drive_duration": 0,
        "stop_duration": 0,
        "departure_time": "2026-08-10T04:38:56Z",
        "arrival_time": "2026-08-10T04:38:56Z",
        "location": [35.2302, -100.25]
      },
      {
        "type": "off_duty",
        "drive_duration": 6800,
        "stop_duration": 1800,
        "departure_time": "2026-08-10T07:02:16Z",
        "arrival_time": "2026-08-10T06:32:16Z",
        "location": [35.51826, -98.870888],
        "address": [
          {
            "label": "Loves; Clinton, OK; I-40",
            "access": [35.51826, -98.870888],
            "categories": ["Truck Stop"]
          },
          {
            "label": "10331 North 2310 Road, Clinton, OK 73601",
            "countryName": "United States",
            "state": "Oklahoma",
            "county": "Custer",
            "city": "Clinton",
            "street": "North 2310 Road",
            "postalCode": "73601-7557",
            "access": [35.51595, -98.8736],
            "categories": ["Truck Stop"]
          },
          {
            "label": "1501 North Airport Road, Weatherford, OK 73096",
            "countryName": "United States",
            "state": "Oklahoma",
            "county": "Custer",
            "city": "Weatherford",
            "street": "North Airport Road",
            "postalCode": "73096-3322",
            "access": [35.53612, -98.66204],
            "categories": ["Truck Stop"]
          }
        ]
      },
      {
        "type": "destination",
        "stop_id": "destination",
        "hos_feasible": true,
        "drive_duration": 10937,
        "stop_duration": 0,
        "departure_time": "2026-08-10T08:11:13Z",
        "arrival_time": "2026-08-10T08:11:13Z",
        "location": [35.4676, -97.5164]
      }
    ],
    "post_trip_hos_state": {
      "available_drive_time_until_break": 24663,
      "available_drive_time": 6663,
      "available_on_duty_time": 13463,
      "cycle_duty_time_used": 10937
    }
  }
}
```

## API Query Limits

- NextBillion.ai allows a maximum rate limit of 6000 queries per minute or 100 queries per second for continuous requests. _Note:_ We can increase the quota if needed on request. Contact [support@nextbillion.ai](mailto:support@nextbillion.ai) for more details.

## API Error Codes

| Response Code | Description                                                     | Additional Notes                                                                                                                                           |
| ------------- | --------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 200           | Normal success case.                                            | Normal success case.                                                                                                                                       |
| 400           | Input validation failed.                                        | There is a missing or an invalid parameter or a parameter with an invalid value type is added to the request.                                              |
| 401           | APIKEY not supplied or invalid                                  | This error occurs when the wrong API key is passed in the request or the key is missing altogether                                                         |
| 403           | APIKEY is valid but does not have access to requested resources | You might be querying for a geographical region which is not valid for your account, or requesting a service which is not enabled for you.                 |
| 404           | Requested host/path not found                                   | This error occurs when a malformed hostname is used.                                                                                                       |
| 422           | Could not process the request.                                  | A feasible solution could not be generated for the given set of locations or parameter configuration.                                                      |
| 429           | Too many requests.                                              | QPM reached or API request count quota reached.                                                                                                            |
| 500           | Internal Service error.                                         | There was an internal issue with NextBillion.ai services. You can reach out to [support@nextbillion.ai](mailto:support@nextbillion.ai) for an explanation. |

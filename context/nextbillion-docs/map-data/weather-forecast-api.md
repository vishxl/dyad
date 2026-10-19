# Weather Forecast API

## Introduction

NextBillion.ai's Weather Forecast API provides point-based weather forecast data for any location worldwide. The service offers two methods:

- **Hourly Weather Forecast**: returns hour-by-hour forecast information for up to the next 24 hours, including temperature, precipitation, wind, humidity, pressure, and UV index.
- **Daily Weather Forecast**: returns day-by-day forecast information for up to the next 14 days, including minimum and maximum temperature, precipitation, wind, UV index, and sun and moon timing.

Both methods share a common authentication scheme and accept a single coordinate point as input via the `at` parameter. They are designed to support a wide range of use cases such as trip planning, fleet routing, field operations, and weather-aware delivery scheduling.

## Hourly Weather Forecast

The Hourly Weather Forecast method returns hour-by-hour forecast information for the location specified by `at`. Forecast entries begin at the current hour and extend up to 24 hours into the future. Each entry includes both a UTC timestamp (`dateTime`) and the equivalent local time (`dateTimeLocal`).

```
GET https://api.nextbillion.io/map/weather/hourly?key={your_api_key}&at={lat},{lon}
```

### Request Parameters

| Name            | Required | Format and Usage                                                                   | Description                                                                                                                                                                          |
| --------------- | -------- | ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `key`           | Yes      | Type: `string`<br>Format: 32 character alphanumeric string<br>Example: key=API_KEY | A key is a unique identifier required to authenticate a request to the API.                                                                                                          |
| `at`            | Yes      | Type: `string`<br>Example: at=52.37,4.9                                            | The coordinates of the location for which the forecast is requested, formatted as `lat,lon`. Latitude must be in the range `-90` to `90` and longitude in the range `-180` to `180`. |
| `forecastHours` | No       | Type: `integer`<br>Default: 24<br>Example: forecastHours=12                        | The number of hours of forecast data to return, starting from the current hour. The accepted range is `1` to `24`.                                                                   |

### Response Schema

| Field                                               | Type             | Description                                                                                                                                                                                                                                                |
| --------------------------------------------------- | ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `data`                                              | object           | An object containing the forecast payload.                                                                                                                                                                                                                 |
| `data.stationCoordinates`                           | object           | The coordinates of the weather station whose data was used to generate the forecast. These may differ slightly from the requested coordinates.                                                                                                             |
| `data.stationCoordinates.lat`                       | float            | Latitude of the weather station.                                                                                                                                                                                                                           |
| `data.stationCoordinates.lon`                       | float            | Longitude of the weather station.                                                                                                                                                                                                                          |
| `data.hourlyWeatherInfo`                            | array of objects | An array of forecast entries, one per hour.                                                                                                                                                                                                                |
| `data.hourlyWeatherInfo[].dateTime`                 | string           | The forecast hour expressed as an ISO 8601 UTC timestamp. Example: `"2026-04-23T09:00:00Z"`                                                                                                                                                                |
| `data.hourlyWeatherInfo[].dateTimeLocal`            | string           | The same instant expressed in the station's local timezone (no offset). Example: `"2026-04-23T11:00:00"`                                                                                                                                                   |
| `data.hourlyWeatherInfo[].temperature`              | integer          | Air temperature, in degrees Celsius, rounded to the nearest integer.                                                                                                                                                                                       |
| `data.hourlyWeatherInfo[].feelsLike`                | integer          | The perceived (apparent) temperature, in degrees Celsius, rounded to the nearest integer.                                                                                                                                                                  |
| `data.hourlyWeatherInfo[].weatherCode`              | string           | A 9-character code describing the weather condition. Refer to the [Weather Codes](#weather-codes) section for the decoding scheme.                                                                                                                         |
| `data.hourlyWeatherInfo[].weatherDescription`       | string           | A human-readable description of the weather condition, derived from `weatherCode`. The description is provided in English only. To present the condition in another language, decode `weatherCode` directly. May be omitted if the code cannot be decoded. |
| `data.hourlyWeatherInfo[].windSpeed`                | number           | Average wind speed during the hour, in metres per second (m/s).                                                                                                                                                                                            |
| `data.hourlyWeatherInfo[].windDirection`            | string           | The direction the wind is blowing from, expressed as one of: `N`, `NNE`, `NE`, `ENE`, `E`, `ESE`, `SE`, `SSE`, `S`, `SSW`, `SW`, `WSW`, `W`, `WNW`, `NW`, `NNW`, `VAR` (variable), or `UNK` (unknown).                                                     |
| `data.hourlyWeatherInfo[].sunProbability`           | integer          | The likelihood of sunshine during the hour, expressed as a percentage (0–100).                                                                                                                                                                             |
| `data.hourlyWeatherInfo[].precipitationProbability` | integer          | The likelihood of any precipitation during the hour, expressed as a percentage (0–100).                                                                                                                                                                    |
| `data.hourlyWeatherInfo[].thunderProbability`       | integer          | The likelihood of thunderstorms during the hour, expressed as a percentage (0–100).                                                                                                                                                                        |
| `data.hourlyWeatherInfo[].precipitation`            | number           | Total precipitation expected during the hour, in millimetres (mm), reported with 0.1 mm precision.                                                                                                                                                         |
| `data.hourlyWeatherInfo[].pressure`                 | integer          | Barometric pressure during the hour, in hectopascals (hPa).                                                                                                                                                                                                |
| `data.hourlyWeatherInfo[].relativeHumidity`         | integer          | Relative humidity during the hour, expressed as a percentage (0–100).                                                                                                                                                                                      |
| `data.hourlyWeatherInfo[].uvIndex`                  | integer          | Solar UV exposure index during the hour. Higher values indicate stronger UV exposure.                                                                                                                                                                      |

### Example

The following query retrieves a 3-hour weather forecast for Amsterdam (`at=52.37,4.9`).

#### Sample API Request

```bash
curl --location 'https://api.nextbillion.io/map/weather/hourly?key=<your_api_key>&at=52.37,4.9&forecastHours=3'
```

#### Sample API Response

```json
{
  "data": {
    "stationCoordinates": {
      "lat": 52.37,
      "lon": 4.9
    },
    "hourlyWeatherInfo": [
      {
        "dateTime": "2026-04-30T07:00:00Z",
        "dateTimeLocal": "2026-04-30T09:00:00",
        "temperature": 11,
        "feelsLike": 11,
        "weatherCode": "D_CS_____",
        "weatherDescription": "Clear sky (day)",
        "windSpeed": 5.8,
        "windDirection": "E",
        "sunProbability": 100,
        "precipitationProbability": 2,
        "thunderProbability": 0,
        "precipitation": 0,
        "pressure": 1029,
        "relativeHumidity": 51,
        "uvIndex": 1
      },
      {
        "dateTime": "2026-04-30T08:00:00Z",
        "dateTimeLocal": "2026-04-30T10:00:00",
        "temperature": 13,
        "feelsLike": 13,
        "weatherCode": "D_CS_____",
        "weatherDescription": "Clear sky (day)",
        "windSpeed": 6.1,
        "windDirection": "E",
        "sunProbability": 100,
        "precipitationProbability": 2,
        "thunderProbability": 0,
        "precipitation": 0,
        "pressure": 1029,
        "relativeHumidity": 45,
        "uvIndex": 2
      },
      {
        "dateTime": "2026-04-30T09:00:00Z",
        "dateTimeLocal": "2026-04-30T11:00:00",
        "temperature": 14,
        "feelsLike": 14,
        "weatherCode": "D_CS_____",
        "weatherDescription": "Clear sky (day)",
        "windSpeed": 6.4,
        "windDirection": "E",
        "sunProbability": 100,
        "precipitationProbability": 2,
        "thunderProbability": 0,
        "precipitation": 0,
        "pressure": 1029,
        "relativeHumidity": 39,
        "uvIndex": 3
      }
    ]
  }
}
```

## Daily Weather Forecast

The Daily Weather Forecast method returns day-by-day forecast information for the location specified by `at`. Forecast entries begin on the current day (in the station's local time) and extend up to 14 days into the future.

```
GET https://api.nextbillion.io/map/weather/daily?key={your_api_key}&at={lat},{lon}
```

### Request Parameters

| Name           | Required | Format and Usage                                                                     | Description                                                                                                                                                                          |
| -------------- | -------- | ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `key`          | Yes      | Type: `string`<br>Format: 32 character alphanumeric string<br>Example: `key=API_KEY` | A key is a unique identifier required to authenticate a request to the API.                                                                                                          |
| `at`           | Yes      | Type: `string`<br>Example: `at=52.37,4.9`                                            | The coordinates of the location for which the forecast is requested, formatted as `lat,lon`. Latitude must be in the range `-90` to `90` and longitude in the range `-180` to `180`. |
| `forecastDays` | No       | Type: `integer`<br>Default: `14`<br>Example: `forecastDays=7`                        | The number of days of forecast data to return, starting from the current day in the station's local time. The accepted range is `1` to `14`.                                         |

### Response Schema

| Field                                              | Type             | Description                                                                                                                                                                                                                                                |
| -------------------------------------------------- | ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `data`                                             | object           | An object containing the forecast payload.                                                                                                                                                                                                                 |
| `data.stationCoordinates`                          | object           | The coordinates of the weather station whose data was used to generate the forecast. These may differ slightly from the requested coordinates.                                                                                                             |
| `data.stationCoordinates.lat`                      | float            | Latitude of the weather station.                                                                                                                                                                                                                           |
| `data.stationCoordinates.lon`                      | float            | Longitude of the weather station.                                                                                                                                                                                                                          |
| `data.dailyWeatherInfo`                            | array of objects | An array of forecast entries, one per day.                                                                                                                                                                                                                 |
| `data.dailyWeatherInfo[].date`                     | string           | The forecast date in the station's local timezone, formatted as `YYYY-MM-DD`.                                                                                                                                                                              |
| `data.dailyWeatherInfo[].minTemperature`           | integer          | The minimum temperature for the day, in degrees Celsius, rounded to the nearest integer.                                                                                                                                                                   |
| `data.dailyWeatherInfo[].maxTemperature`           | integer          | The maximum temperature for the day, in degrees Celsius, rounded to the nearest integer.                                                                                                                                                                   |
| `data.dailyWeatherInfo[].weatherCode`              | string           | A 9-character code describing the prevailing weather condition for the day. Refer to the [Weather Codes](#weather-codes) section for the decoding scheme.                                                                                                  |
| `data.dailyWeatherInfo[].weatherDescription`       | string           | A human-readable description of the weather condition, derived from `weatherCode`. The description is provided in English only. To present the condition in another language, decode `weatherCode` directly. May be omitted if the code cannot be decoded. |
| `data.dailyWeatherInfo[].windSpeed`                | number           | Average wind speed for the day, in metres per second (m/s).                                                                                                                                                                                                |
| `data.dailyWeatherInfo[].windDirection`            | string           | The direction the wind is blowing from, expressed as one of: `N`, `NNE`, `NE`, `ENE`, `E`, `ESE`, `SE`, `SSE`, `S`, `SSW`, `SW`, `WSW`, `W`, `WNW`, `NW`, `NNW`, `VAR` (variable), or `UNK` (unknown).                                                     |
| `data.dailyWeatherInfo[].sunProbability`           | integer          | The likelihood of sunshine during the day, expressed as a percentage (0–100).                                                                                                                                                                              |
| `data.dailyWeatherInfo[].precipitationProbability` | integer          | The likelihood of any precipitation during the day, expressed as a percentage (0–100).                                                                                                                                                                     |
| `data.dailyWeatherInfo[].thunderProbability`       | integer          | The likelihood of thunderstorms during the day, expressed as a percentage (0–100).                                                                                                                                                                         |
| `data.dailyWeatherInfo[].precipitation`            | number           | Total precipitation expected during the day, in millimetres (mm), reported with 0.1 mm precision.                                                                                                                                                          |
| `data.dailyWeatherInfo[].uvIndex`                  | integer          | Peak solar UV exposure index for the day. Higher values indicate stronger UV exposure.                                                                                                                                                                     |
| `data.dailyWeatherInfo[].sunRise`                  | string           | Local sunrise time, formatted as `HH:MM:SS`.                                                                                                                                                                                                               |
| `data.dailyWeatherInfo[].sunSet`                   | string           | Local sunset time, formatted as `HH:MM:SS`.                                                                                                                                                                                                                |
| `data.dailyWeatherInfo[].moonRise`                 | string           | Local moonrise time, formatted as `HH:MM:SS`.                                                                                                                                                                                                              |
| `data.dailyWeatherInfo[].moonSet`                  | string           | Local moonset time, formatted as `HH:MM:SS`.                                                                                                                                                                                                               |
| `data.dailyWeatherInfo[].moonPhase`                | integer          | The moon phase, expressed in degrees (0–360). `0` and `360` indicate a new moon, `90` indicates the first quarter, `180` indicates a full moon, and `270` indicates the last quarter.                                                                      |

### Example

The following query retrieves a 3-day weather forecast for Amsterdam (`at=52.37,4.9`).

#### Sample API Request

```bash
curl --location 'https://api.nextbillion.io/map/weather/daily?key=<your_api_key>&at=52.37,4.9&forecastDays=3'
```

#### Sample API Response

```json
{
  "data": {
    "stationCoordinates": {
      "lat": 52.37,
      "lon": 4.9
    },
    "dailyWeatherInfo": [
      {
        "date": "2026-04-30",
        "minTemperature": 9,
        "maxTemperature": 20,
        "weatherCode": "D_CS_____",
        "weatherDescription": "Clear sky (day)",
        "windSpeed": 7.3,
        "windDirection": "E",
        "sunProbability": 100,
        "precipitationProbability": 1,
        "thunderProbability": 0,
        "precipitation": 0,
        "uvIndex": 5,
        "sunRise": "06:12:00",
        "sunSet": "21:04:00",
        "moonRise": "20:12:00",
        "moonSet": "05:19:00",
        "moonPhase": 170
      },
      {
        "date": "2026-05-01",
        "minTemperature": 12,
        "maxTemperature": 24,
        "weatherCode": "D_CS_____",
        "weatherDescription": "Clear sky (day)",
        "windSpeed": 5.9,
        "windDirection": "SE",
        "sunProbability": 100,
        "precipitationProbability": 1,
        "thunderProbability": 0,
        "precipitation": 0,
        "uvIndex": 5,
        "sunRise": "06:10:00",
        "sunSet": "21:05:00",
        "moonRise": "21:28:00",
        "moonSet": "05:32:00",
        "moonPhase": 180
      },
      {
        "date": "2026-05-02",
        "minTemperature": 12,
        "maxTemperature": 20,
        "weatherCode": "D_CL_____",
        "weatherDescription": "Cloudy (day)",
        "windSpeed": 5.2,
        "windDirection": "SW",
        "sunProbability": 21,
        "precipitationProbability": 67,
        "thunderProbability": 0,
        "precipitation": 2,
        "uvIndex": 5,
        "sunRise": "06:08:00",
        "sunSet": "21:07:00",
        "moonRise": "22:43:00",
        "moonSet": "05:48:00",
        "moonPhase": 190
      }
    ]
  }
}
```

## Weather Codes

The `weatherCode` field is a 9-character string that encodes the weather condition in a structured form: `{T}_{XX}_{PPP}{L}`. The components are described below.

| Component | Position | Meaning                                      | Allowed Values                                                                                                                                                                                                                                                                                                       |
| --------- | -------- | -------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `{T}`     | 1        | Time of day                                  | `D` (day), `N` (night)                                                                                                                                                                                                                                                                                               |
| `{XX}`    | 3–4      | Sky / cloud condition                        | `CS` (clear sky), `MI` (mist), `FO` (fog), `SA` (sand or dust storm), `HZ` (hazy), `SC` (some clouds), `PC` (partly cloudy), `CL` (cloudy), `OC` (overcast), `ST` (storm), `CY` (cyclone)                                                                                                                            |
| `{PPP}`   | 6–8      | Precipitation type (optional; `___` if none) | `DRI` (drizzle), `RAI` (rain), `RAS` (rain showers), `RAT` (thunderstorm with rain), `SNO` (snow), `SNS` (snow showers), `SNT` (snow with thunderstorm), `SLE` (sleet), `SLS` (sleet showers), `SLT` (sleet with thunderstorm), `ICR` (ice rain), `HAI` (hail), `HAS` (hail showers), `HAT` (hail with thunderstorm) |
| `{L}`     | 9        | Precipitation level (optional; `_` if none)  | `1` (light), `2` (moderate), `3` (heavy)                                                                                                                                                                                                                                                                             |

The `weatherDescription` field provides a pre-decoded, human-readable English description of the same condition. The table below shows a few examples.

| `weatherCode` | `weatherDescription`            |
| ------------- | ------------------------------- |
| `D_CS_____`   | Clear sky (day)                 |
| `N_PC_____`   | Partly cloudy (night)           |
| `D_CL_RAI2`   | Cloudy with moderate rain (day) |
| `D_OC_SNO3`   | Overcast with heavy snow (day)  |

## API Query Limits

- The maximum value for `forecastHours` is **24**.
- The maximum value for `forecastDays` is **14**.
- NextBillion.ai allows a maximum rate limit of **6000 queries per minute** or **100 queries per second** for continuous requests.

_Note: Quotas can be increased on request. Contact [support@nextbillion.ai](mailto:support@nextbillion.ai) for more details._

## API Error Codes

Error responses are returned with the following JSON envelope:

```json
{
  "status": 400,
  "msg": "<description of the error>"
}
```

| Response Code | Description                                                          | Additional Notes                                                                                                                                                                                                                                                                                                            |
| ------------- | -------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 200           | Normal success case.                                                 | The request was processed successfully.                                                                                                                                                                                                                                                                                     |
| 400           | Input validation failed.                                             | A required parameter is missing, or a parameter value is malformed or outside its allowed range. Examples include a missing `at`, an `at` value that is not a valid `lat,lon` pair, latitude outside `[-90, 90]`, longitude outside `[-180, 180]`, `forecastHours` outside `[1, 24]`, and `forecastDays` outside `[1, 14]`. |
| 401           | API key not supplied or invalid.                                     | This error occurs when the API key is missing or incorrect.                                                                                                                                                                                                                                                                 |
| 403           | API key is valid but does not have access to the requested resource. | The account associated with the API key does not have access to the Weather Forecast service. Contact [support@nextbillion.ai](mailto:support@nextbillion.ai) to enable access.                                                                                                                                             |
| 404           | Requested host or path not found.                                    | This error occurs when a malformed hostname or path is used.                                                                                                                                                                                                                                                                |
| 422           | Could not process the request.                                       | A valid forecast could not be generated for the given parameters.                                                                                                                                                                                                                                                           |
| 429           | Too many requests.                                                   | The QPM or API request count quota has been reached.                                                                                                                                                                                                                                                                        |
| 500           | Internal service error.                                              | An internal issue occurred. Contact [support@nextbillion.ai](mailto:support@nextbillion.ai) for assistance.                                                                                                                                                                                                                 |

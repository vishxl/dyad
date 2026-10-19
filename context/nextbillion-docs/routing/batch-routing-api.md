# Batch Routing API

## Introduction

NextBillion.ai Batch Routing API is designed to support multiple requests in a single go. Users first need to submit a valid batch of multiple routing requests and retrieve the result asynchronously. Currently, this method accepts only [Isochrone API](https://docs.nextbillion.ai/routing/isochrone-api) requests.

Let’s take a look at the available methods to create batch requests and retrieve their results.

## Create a Batch request

The Batch Routing service allows users to submit a valid batch of routing requests using the HTTP POST method. The individual queries in a batch can be formed using the attributes supported by the standard routing endpoints. The limitations and validations applicable for individual queries in a batch are consistent with those for standard routing endpoints. Know more about these limitations by visiting the individual endpoint documentation which is being added in a batch routing request.

POST

https://api.nextbillion.io/batch?key={your_api_key}

### Request Parameters

| Name  | Required | Format and Usage                                                                   | Description                                                                         |
| ----- | -------- | ---------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| `key` | Yes      | Type: `string`<br>Format: 32 character alphanumeric string<br>Example: key=API_KEY | A key is a unique identifier that is required to authenticate a request to the API. |

### Request Body

| Field              | Type            | Description                                                                                                                                                                                                                                                                                                                         |
| ------------------ | --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `requests`         | array of object | An array of objects to collect the details of individual routing queries that will form a batch.                                                                                                                                                                                                                                    |
| `requests[].query` | string          | Specify the routing query in the form of a string. The supported attributes and their formats are consistent with the standard routing endpoint that is being used as part of the batch. Check the [Sample Request](https://docs.nextbillion.ai/docs/navigation/batch-routing-api#sample-request-1) section for an example request. |

### Response Schema

| Field      | Type   | Description                                                                                                                                                                                       |
| ---------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `status`   | string | Returns the overall status of the API request. Its value will belong to one of `success`, `failed`, and `pending`. It can also contain HTTP error codes in case of a failed request or operation. |
| `msg`      | string | Displays the error message in case of a failed request or operation. Please note that this parameter is not returned in the response in case of a successful request.                             |
| `track_id` | string | Returns the unique ID of the batch processing task. Use this ID using the GET request to retrieve the solution once the task processing is completed.                                             |

### Sample Request

```bash
curl --location 'https://api.nextbillion.io/batch?key=<your_api_key>' \
--header 'Content-Type: application/json' \
--data '{
"requests": [
{
"query": "/isochrone/json?mode=4w&coordinates=38.517410585895064,-121.48676022290115&denoise=1&contours_minutes=3&key=<your_api_key>"
},
{
"query": "/isochrone/json?mode=4w&coordinates=37.71775363,-122.20668736&denoise=1&contours_minutes=2&key=<your_api_key>"
}
]
}'
```

### Sample Response

```json
{
  "status": "pending",
  "track_id": "1f41eb60-334b-4f9c-ba8c-0d9ed59d2790"
}
```

## Retrieve a Batch result

In order to retrieve the result of a previously submitted batch routing request, users can submit a GET request to the following endpoint while specifying the `track_id` generated once the batch was successfully created.

GET

https://api.nextbillion.io/batch?track_id={track_id}&key={your_api_key}

### Request Parameters

| Name       | Required | Format and Usage                                                                   | Description                                                                                                      |
| ---------- | -------- | ---------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `key`      | Yes      | Type: `string`<br>Format: 32 character alphanumeric string<br>Example: key=API_KEY | A key is a unique identifier that is required to authenticate a request to the API.                              |
| `track_id` | Yes      | Type: `string`                                                                     | Specify the track ID of the batch that was returned in the response after submitting a successful batch request. |

### Response Schema

| Field                     | Type            | Description                                                                                                                                                                                                                                                                      |
| ------------------------- | --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `status`                  | string          | Returns the overall status of the API request. Its value will always be one of `success`, `failed`, and `pending`.                                                                                                                                                               |
| `msg`                     | string          | Displays the error message in case of a failed request or operation. Please note that this parameter is not returned in the response in case of a successful request.                                                                                                            |
| `track_id`                | string          | Returns the unique ID of the batch processing task.                                                                                                                                                                                                                              |
| `responses`               | array of object | An array of objects returning the results of all the individual routing queries specified in the input. Each object represents the solution to an individual query in the input.                                                                                                 |
| `responses[].status_code` | integer         | Returns the HTTP status code for the individual routing request. See the [API Errors Codes](#api-error-codes) section below for more information.                                                                                                                                |
| `responses[].response`    | object          | An object returning the routing solution of an individual query. The JSON format and structure of the `response` would vary depending on the routing endpoint used in each individual query. However, it will be consistent with standard response for a given routing endpoint. |

### Sample Request

```bash
curl --location 'https://api.nextbillion.io/batch?track_id=1f41eb60-334b-4f9c-ba8c-0d9ed59d2790&key=<your_api_key>'
```

### Sample Response

```json
{
"status": "success",
"track_id": "1f41eb60-334b-4f9c-ba8c-0d9ed59d2790",
"responses":[...]
}
```

## API Query Limits

1. Only the Isochrone API requests can be added as individual `queries` in a batch, for now.
2. The maximum number of individual `queries` that can be added to a single batch are limited to 20.
3. NextBillion.ai allows a maximum rate limit of 6000 queries per minute or 100 queries/second for continuous requests.
   _Note_: We can increase the quota if needed, on request. Contact [support@nextbillion.ai](mailto:support@nextbillion.ai) for more details.

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

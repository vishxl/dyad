# Multi Geocode API

## Introduction

NextBillion’s Multi-Geocode API allows you to find the geo-coordinates, and addresses(Place, Locality, administrative area) of POIs from multiple data sources. It also enables you to easily manage the places’ information to improve the utility of the search results based on custom business needs. For instance,

1. Create custom locations that your business needs
2. Get combined results for a searched text from all data sources i.e default and custom datasets
3. Override the results of default search provider in case of duplicate or similar places and prioritize custom places in search results

## Search Place

POST

https://api.nextbillion.io/multigeocode/search?key={your_api_key}

Use this method to find known places in default or your own custom (proprietary) dataset and get a combined search result. It accepts free-form, partially correct or even incomplete search texts. Results would be ranked based on the search score of a place.

### Request Parameters

| Name  | Required | Format and Usage                                                                     | Description                                                                         |
| ----- | -------- | ------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------- |
| `key` | Yes      | Type: `string`<br>Format: 32 character alphanumeric string<br>Example: `key=API_KEY` | A key is a unique identifier that is required to authenticate a request to the API. |

### Request Body

| Field         | Type    | Description                                                                                                                                                                                                                           |
| ------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `query`       | string  | A free-form, complete or incomplete string to be searched. It allows searching for places using keywords or names.                                                                                                                    |
| `at`          | object  | Specify the center of the search context expressed as coordinates.                                                                                                                                                                    |
| `at.lat`      | number  | Latitude coordinate of the location                                                                                                                                                                                                   |
| `at.lng`      | number  | Longitude coordinate of the location.                                                                                                                                                                                                 |
| `limit`       | integer | Sets the maximum number of results to be returned.                                                                                                                                                                                    |
| `radius`      | string  | Filters the results to places within the specified radius from the 'at' location.<br>Note: Supports 'meter' (m) and 'kilometer' (km) units. If no radius is given, the search method returns as many results as specified in `limit`. |
| `country`     | string  | Country of the search context provided as comma-separated [ISO 3166-1 alpha-3](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-3) country codes.<br>Note: Country codes should be provided in uppercase.                               |
| `state`       | string  | Specifies the state of the search place.                                                                                                                                                                                              |
| `city`        | string  | Specifies the primary city of the place.                                                                                                                                                                                              |
| `street`      | string  | Specifies the street name of the search place.                                                                                                                                                                                        |
| `district`    | string  | Specifies the district of the search place.                                                                                                                                                                                           |
| `subDistrict` | string  | Specifies the subDistrict of the search place.                                                                                                                                                                                        |

### Response Schema

| Field                             | Type            | Description                                                                                                                                                                                                                                                                                                         |
| --------------------------------- | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `entities`                        | array of object | An array of objects containing the search result response. Each object represents one place returned in the search response. An empty array would be returned if no matching place is found.                                                                                                                        |
| `entities[].docId`                | string          | The unique NextBillion ID for the result item. This ID can be used as input in “Get Place”, “Update Place”, “Delete Place” methods.                                                                                                                                                                                 |
| `entities[].place`                | array of object | This parameter represents the place details, including geographical information, address and other related information.                                                                                                                                                                                             |
| `entities[].place[].geopoint`     | object          | This parameter represents the geographical coordinates of the place. It includes the latitude and longitude values.                                                                                                                                                                                                 |
| `entities[].place[].geopoint.lat` | number          | This parameter represents the latitude value of the place.                                                                                                                                                                                                                                                          |
| `entities[].place[].geopoint.lng` | number          | This parameter represents the longitude value of the place.                                                                                                                                                                                                                                                         |
| `entities[].place[].country`      | string          | This parameter represents the country of the place.                                                                                                                                                                                                                                                                 |
| `entities[].place[].state`        | string          | This parameter represents the state or region of the place.                                                                                                                                                                                                                                                         |
| `entities[].place[].city`         | string          | This parameter represents the city or town of the place.                                                                                                                                                                                                                                                            |
| `entities[].place[].district`     | string          | This parameter represents the district of the place.                                                                                                                                                                                                                                                                |
| `entities[].place[].subDistrict`  | string          | This parameter represents the sub-district or locality of the place.                                                                                                                                                                                                                                                |
| `entities[].place[].street`       | string          | This parameter represents the street name of the place.                                                                                                                                                                                                                                                             |
| `entities[].place[].postalCode`   | string          | This parameter represents the postal code or ZIP code of the place.                                                                                                                                                                                                                                                 |
| `entities[].place[].house`        | string          | This parameter represents the house or building number of the place.                                                                                                                                                                                                                                                |
| `entities[].place[].building`     | string          | This parameter represents additional building information if applicable.                                                                                                                                                                                                                                            |
| `entities[].place[].poi`          | object          | This parameter represents a point of interest within the place. A Point of Interest (POI) refers to a specific location or area that is of interest to individuals for various reasons. It could be a landmark, tourist attraction, business, or any other location that people might find important or intriguing. |
| `entities[].place[].poi.title`    | string          | A title that describes the point of interest.                                                                                                                                                                                                                                                                       |
| `entities[].place[].address`      | string          | This parameter represents the complete address of the place, including the street, city, state, postal code and country.                                                                                                                                                                                            |
| `entities[].dataSource`           | object          | It contains information about the dataset that returns the specific result                                                                                                                                                                                                                                          |
| `entities[].dataSource.source`    | string          | This parameter represents the source of the data.                                                                                                                                                                                                                                                                   |
| `entities[].dataSource.refId`     | string          | This parameter represents the unique reference ID associated with the data source.                                                                                                                                                                                                                                  |
| `entities[].dataSource.status`    | string          | This parameter indicates if a place is searchable.                                                                                                                                                                                                                                                                  |
| `entities[].score`                | integer         | Integer value representing how good the result is. Higher score indicates a better match between the search query and the result. This can be used to accept or reject the results depending on how “relevant” a result is, for a given use case                                                                    |

### Sample Request

```bash
curl --location --request POST 'https://api.nextbillion.io/multigeocode/search?key=yourapikey'
      --header 'Content-Type: application/json'
      --data '{...}'
```

### Sample Response

```json
{
   "entities": [...]
}
```

## Add A Place

POST

https://api.nextbillion.io/multigeocode/place?key={your_api_key}

Add place method provides the flexibility to create custom places in a way that suits your business needs. The newly created place and its attributes can be added to custom (proprietary) dataset - to the effect of building your own places dataset (s) - or, to a default dataset. Overcome inaccurate ‘POI’ details from default search provider by creating custom, highly accurate ‘POIs’

### Request Parameters

| Name  | Required | Format and Usage                                                                     | Description                                                                         |
| ----- | -------- | ------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------- |
| `key` | Yes      | Type: `string`<br>Format: 32 character alphanumeric string<br>Example: `key=API_KEY` | A key is a unique identifier that is required to authenticate a request to the API. |

### Request Body

| Field                  | Type            | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| ---------------------- | --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `place`                | array of object | This parameter represents the place details, including geographical information, address and other related information.                                                                                                                                                                                                                                                                                                                                                                                           |
| `place[].geopoint`     | object          | This parameter represents the geographical coordinates of the place. It includes the latitude and longitude values.                                                                                                                                                                                                                                                                                                                                                                                               |
| `place[].geopoint.lat` | number          | This parameter represents the latitude value of the place.                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| `place[].geopoint.lng` | number          | This parameter represents the longitude value of the place.                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| `place[].country`      | string          | Country of the search context provided as comma-separated [ISO 3166-1 alpha-3](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-3) country codes.<br>Note: Country codes should be provided in uppercase.                                                                                                                                                                                                                                                                                                           |
| `place[].state`        | string          | This parameter represents the state or region of the place.                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| `place[].city`         | string          | This parameter represents the city or town of the place.                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| `place[].district`     | string          | This parameter represents the district of the place.                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `place[].subDistrict`  | string          | This parameter represents the sub-district or locality of the place.                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `place[].street`       | string          | This parameter represents the street name of the place.                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `place[].postalCode`   | string          | This parameter represents the postal code or ZIP code of the place.                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `place[].house`        | string          | This parameter represents the house or building number of the place.                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `place[].building`     | string          | This parameter represents additional building information if applicable.                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| `place[].poi`          | object          | This parameter represents a point of interest within the place. A Point of Interest (POI) refers to a specific location or area that is of interest to individuals for various reasons. It could be a landmark, tourist attraction, business, or any other location that people might find important or intriguing.                                                                                                                                                                                               |
| `place[].poi.title`    | string          | A title that describes the point of interest.                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| `place[].address`      | string          | This parameter represents the complete address of the place, including the street, city, state, postal code and country.                                                                                                                                                                                                                                                                                                                                                                                          |
| `dataSource`           | object          | It contains information about the dataset that returns the specific result                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| `dataSource.source`    | string          | This parameter represents the source of the data.                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `dataSource.refId`     | string          | This parameter represents the unique reference ID associated with the data source.                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `dataSource.status`    | string          | This parameter indicates if a place is searchable.                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `score`                | integer         | Search score of the place. This is calculated based on how ‘richly’ the place is defined. For instance, a place with - street name, city, state and country attributes set might be ranked lower than a place which has values of - house, building, street name, city, state and country attributes set. The score determines the rank of the place among search results. You can also use this field to set a custom score as per its relevance to rank it among the search results from multiple data sources. |
| `force`                | boolean         | When 2 places are located within 100 meters of each other and have more than 90% of matching attributes (at least 11 out of 12 attributes in the “place” object), they will be considered duplicates and any requests to add such a new place would be rejected. Set `force=true` to override this duplicate check. You can use this to create closely located POIs. For instance, places inside a mall, university or a government building etc.                                                                 |

### Response Schema

| Field   | Type   | Description                                                                                                                                                                                                                               |
| ------- | ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `docId` | string | A unique NextBillion DocID will be created for the POI. Use this ID to search this place through the “Get Place” method, to update attributes or ‘status’ through the “Update Place” method or delete it using the “Delete Place” method. |

### Sample Request

```bash
curl --location --request POST 'https://api.nextbillion.io/multigeocode/place?key=yourapikey'
--header 'Content-Type: application/json'   --data-raw '{...}'
```

### Sample Response

```json
{
  "docId": "MGA-41e325fd-77ee-475b-b386-9da926774e05"
}
```

## Get Place

POST

https://api.nextbillion.io/multigeocode/place?key={your_api_key}

Use this method to get the details of previously created custom places using its NextBillion ID.

### Request Parameters

| Name    | Required | Format and Usage                                                                     | Description                                                                         |
| ------- | -------- | ------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------- |
| `key`   | Yes      | Type: `string`<br>Format: 32 character alphanumeric string<br>Example: `key=API_KEY` | A key is a unique identifier that is required to authenticate a request to the API. |
| `docId` | Yes      | Type: `string`                                                                       | Unique NextBillion ID of the location to be looked up.                              |

### Response Schema

| Field                  | Type            | Description                                                                                                                                                                                                                                                                                                                                  |
| ---------------------- | --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `docId`                | string          | The unique NextBillion ID for the result item.                                                                                                                                                                                                                                                                                               |
| `place`                | array of object | This parameter represents the place details, including geographical information, address and other related information.                                                                                                                                                                                                                      |
| `place[].geopoint`     | object          | This parameter represents the geographical coordinates of the place. It includes the latitude and longitude values.                                                                                                                                                                                                                          |
| `place[].geopoint.lat` | number          | This parameter represents the latitude value of the place.                                                                                                                                                                                                                                                                                   |
| `place[].geopoint.lng` | number          | This parameter represents the longitude value of the place.                                                                                                                                                                                                                                                                                  |
| `place[].country`      | string          | This parameter represents the country of the place.                                                                                                                                                                                                                                                                                          |
| `place[].state`        | string          | This parameter represents the state or region of the place.                                                                                                                                                                                                                                                                                  |
| `place[].city`         | string          | This parameter represents the city or town of the place.                                                                                                                                                                                                                                                                                     |
| `place[].district`     | string          | This parameter represents the district of the place.                                                                                                                                                                                                                                                                                         |
| `place[].subDistrict`  | string          | This parameter represents the sub-district or locality of the place.                                                                                                                                                                                                                                                                         |
| `place[].street`       | string          | This parameter represents the street name of the place.                                                                                                                                                                                                                                                                                      |
| `place[].postalCode`   | string          | This parameter represents the postal code or ZIP code of the place.                                                                                                                                                                                                                                                                          |
| `place[].house`        | string          | This parameter represents the house or building number of the place.                                                                                                                                                                                                                                                                         |
| `place[].building`     | string          | This parameter represents additional building information if applicable.                                                                                                                                                                                                                                                                     |
| `place[].poi`          | object          | This parameter represents a point of interest within the place. A Point of Interest (POI) refers to a specific location or area that is of interest to individuals for various reasons. It could be a landmark, tourist attraction, business, or any other location that people might find important or intriguing.                          |
| `place[].poi.title`    | string          | A title that describes the point of interest.                                                                                                                                                                                                                                                                                                |
| `place[].address`      | string          | This parameter represents the complete address of the place, including the street, city, state, postal code and country.                                                                                                                                                                                                                     |
| `dataSource`           | object          | It displays the information about the current source and current status of the place. Use the “Update Place” method to change these values, as needed.                                                                                                                                                                                       |
| `dataSource.source`    | string          | This parameter represents the current dataset source of the information returned in the result.                                                                                                                                                                                                                                              |
| `dataSource.refId`     | string          | This parameter represents the unique reference ID associated with the data source.                                                                                                                                                                                                                                                           |
| `dataSource.status`    | string          | This parameter indicates if a place is currently discoverable by search API or not.                                                                                                                                                                                                                                                          |
| `score`                | integer         | It returns the system calculated weighted score of the place. It depends on how ‘richly’ the place was defined at the time of creation. In order to modify the score, use “Update Place” method and update information for parameters which are not set currently. As an alternative, you can directly update the `score` to a custom value. |

### Sample Request

```bash
curl --location --request GET 'https://api.nextbillion.io/multigeocode/place/MGA-d87c9011-4b9f-4e99-bd6e-510ae51341a7?key=yourapikey'
```

### Sample Response

```json
{
  "status": 200,
  "msg": "Ok"
}
```

## Update Place

PUT

https://api.nextbillion.io/multigeocode/place/{docId}?key={your_api_key}

Add place method provides the flexibility to create custom places in a way that suits your business needs. The newly created place and its attributes can be added to custom (proprietary) dataset - to the effect of building your own places dataset (s) - or, to a default dataset. Overcome inaccurate ‘POI’ details from default search provider by creating custom, highly accurate ‘POIs’

### Request Parameters

| Name    | Required | Format and Usage                                                                     | Description                                                                         |
| ------- | -------- | ------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------- |
| `key`   | Yes      | Type: `string`<br>Format: 32 character alphanumeric string<br>Example: `key=API_KEY` | A key is a unique identifier that is required to authenticate a request to the API. |
| `docId` | Yes      | Type: `string`                                                                       | Unique NextBillion ID of the location to be updated.                                |

### Request Body

| Field                  | Type            | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| ---------------------- | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `place`                | array of object | This parameter represents the place details, including geographical information, address and other related information.                                                                                                                                                                                                                                                                                                                                                                                       |
| `place[].geopoint`     | object          | This parameter represents the geographical coordinates of the place. It includes the latitude and longitude values.                                                                                                                                                                                                                                                                                                                                                                                           |
| `place[].geopoint.lat` | number          | This parameter represents the latitude value of the place.                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `place[].geopoint.lng` | number          | This parameter represents the longitude value of the place.                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `place[].country`      | string          | This parameter represents the country of the place.                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `place[].state`        | string          | This parameter represents the state or region of the place.                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `place[].city`         | string          | This parameter represents the city or town of the place.                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `place[].district`     | string          | This parameter represents the district of the place.                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| `place[].subDistrict`  | string          | This parameter represents the sub-district or locality of the place.                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| `place[].street`       | string          | This parameter represents the street name of the place.                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| `place[].postalCode`   | string          | This parameter represents the postal code or ZIP code of the place.                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `place[].house`        | string          | This parameter represents the house or building number of the place.                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| `place[].building`     | string          | This parameter represents additional building information if applicable.                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `place[].poi`          | object          | This parameter represents a point of interest within the place. A Point of Interest (POI) refers to a specific location or area that is of interest to individuals for various reasons. It could be a landmark, tourist attraction, business, or any other location that people might find important or intriguing.                                                                                                                                                                                           |
| `place[].poi.title`    | string          | A title that describes the point of interest.                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `place[].address`      | string          | This parameter represents the complete address of the place, including the street, city, state, postal code and country.                                                                                                                                                                                                                                                                                                                                                                                      |
| `dataSource`           | object          | dataSource values can be updated to enhance or prioritize the search results to better suit specific business use cases.                                                                                                                                                                                                                                                                                                                                                                                      |
| `dataSource.source`    | string          | Move the `place` to a new dataset by setting the value to a unique dataset name. You can also move the place to an existing dataset by using an existing dataset name other than the current one. In both cases, the current datasource will be replaced for the specified `docID`.<br><br>In order to just update the place in the existing dataset, just set the name to the current value.                                                                                                                 |
| `dataSource.refId`     | string          | This parameter represents the unique reference ID associated with the data source.                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `dataSource.status`    | string          | Set this to either `enable` or `disable` to allow the place to be retrieved by a search API or block it respectively.                                                                                                                                                                                                                                                                                                                                                                                         |
| `score`                | integer         | Search score of the place. This is calculated based on how ‘richly’ the place is defined. For instance, a place with street name, city, state and country attributes set might be ranked lower than a place which has values of house, building, street name, city, state and country attributes set. The score determines the rank of the place among search results. You can also use this field to set a custom score as per its relevance to rank it among the search results from multiple data sources. |

### Response Schema

| Field    | Type   | Description                                                                                          |
| -------- | ------ | ---------------------------------------------------------------------------------------------------- |
| `status` | string | Represents the status of the response.                                                               |
| `msg`    | string | This could be “Ok” representing success or “not found” representing error in processing the request. |

### Sample Request

```bash
curl --location --request PUT 'https://api.nextbillion.io/multigeocode/place/MGA-110a090c-657b-412d-a490-d3855322ff1b?key=your_api_key' --header 'Content-Type: application/json' --data '{...}'
```

### Sample Response

```json
{
  "docId": "MGA-d87c9011-4b9f-4e99-bd6e-510ae51341a7",
  "place": "{...}",
  "dataSource": "{...}",
  "score": 176
}
```

## Delete Place

DELETE

https://api.nextbillion.io/multigeocode/place/{docId}?key={your_api_key}

Use this method to delete a previously created place. Please note that the place associated with the specified docID only would be deleted. As a result, once a place is deleted, the search API can still return valid results from the default datasets or others, if present.

### Request Parameters

| Name    | Required | Format and Usage                                                                     | Description                                                                         |
| ------- | -------- | ------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------- |
| `docId` | Yes      | Type: `string`                                                                       | Unique NextBillion ID of the location to be deleted                                 |
| `key`   | Yes      | Type: `string`<br>Format: 32 character alphanumeric string<br>Example: `key=API_KEY` | A key is a unique identifier that is required to authenticate a request to the API. |

### Response Schema

| Field    | Type   | Description                                                                                          |
| -------- | ------ | ---------------------------------------------------------------------------------------------------- |
| `status` | string | Represents the status of the response.                                                               |
| `msg`    | string | This could be “Ok” representing success or “not found” representing error in processing the request. |

### Sample Request

```bash
curl --location --request DELETE 'https://api.nextbillion.io/multigeocode/place/MGA-d763feac-7b18-4bfb-b401-f27cea7154b6?key=yourapikey'
```

### Sample Response

```json
{
  "status": 200,
  "msg": "Ok"
}
```

## API Query Limits

1. Only 100 queries can be added to the input while using the [_Batch Geocode_](#batch-geocode) endpoint.
2. NextBillion.ai allows a maximum rate limit of 2400 queries per minute or 40 queries/second for continuous requests, except for the [_Batch Geocode_](#batch-geocode) endpoint which is limited to 1 query/second.

   _Note_: We can increase the quota if needed on request. Contact [support@nextbillion.ai](mailto:support@nextbillion.ai) for more details.

## API Error Codes

| Response Code | Description                                                      | Additional Notes                                                                                                                                                                                                                       |
| ------------- | ---------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 200           | Normal success case.                                             | Normal success case.                                                                                                                                                                                                                   |
| 400           | Input validation failed.                                         | There is a missing or an invalid parameter or a parameter with an invalid value type is added to the request.                                                                                                                          |
| 401           | APIKEY not supplied or invalid.                                  | This error occurs when the wrong API key is passed in the request or the key is missing altogether                                                                                                                                     |
| 403           | APIKEY is valid but does not have access to requested resources. | You might be querying for a geographical region which is not valid for your account, or requesting a service which is not enabled for you.                                                                                             |
| 404           | Requested host/path not found.                                   | This error occurs when there is a malformed host name used.                                                                                                                                                                            |
| 413           | Request entity too large                                         | This error is caused when the length of input request URI or the request body is too large. Please modify the request. Reach out to [support@nextbillion.ai](mailto:support@nextbillion.ai) if the issue still persists.               |
| 422           | Could not process the request.                                   | Could not process the request due to invalid search query or other parameter configurations. Please check the input values. Reach out to [support@nextbillion.ai](mailto:support@nextbillion.ai) for assistance if the issue persists. |
| 429           | Too many requests.                                               | QPM or API request count quota reached                                                                                                                                                                                                 |
| 500           | Internal Service error.                                          | There was an internal issue with NextBillion.ai services. You can reach out to [support@nextbillion.ai](mailto:support@nextbillion.ai) for an explanation.                                                                             |

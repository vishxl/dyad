## DistanceMatrixService

### Methods

| Method            |                                                                                                                                                                                                              |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| getDistanceMatrix | getDistanceMatrix(opt: [DistanceMatrixRequest](#interface-distancematrixrequest))<br> <br>Parameters<br> <br>1. opt: [DistanceMatrixRequest](#interface-distancematrixrequest)<br> <br>Return Value: Promise |

## Interface DistanceMatrixRequest

### Properties

| Name                   |                                                                                                                                                                                                                                                          |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| apiKey Optional        | Type: string<br> <br>api key for the request                                                                                                                                                                                                             |
| approaches Optional    | Type: Array<[ApproachType](#constants-approachtype)\><br> <br>A list indicating the side of the road from which to approach waypoints in a requested route. If provided, the number of approaches must be equal to the number of all points on the path. |
| avoid Optional         | Type: [AvoidType](#constants-avoidtype)<br> <br>Setting this will ensure the route avoids ferry, tolls or highways.                                                                                                                                      |
| departureTime Optional | Type: number<br> <br>Sets the time of departure. The response will return a route based on traffic for that specific departure time.                                                                                                                     |
| destinations           | Type: Array<[LngLatLike](./geography-and-geometry#LngLatLike-lnglatlike)\><br> <br>Destinations are the ending coordinates of your route. Ensure that destinations are at a valid land location. Multiple destinations are separated by a pipe symbol.   |
| mode Optional          | Type: string<br> <br>A parameter which which sets the transportation mode for the route. PS: Only the 4w/car profile is enabled by default. The other customised routing profiles are only supported in premium plan.                                    |
| origins                | Type: Array<[LngLatLike](./geography-and-geometry#LngLatLike-lnglatlike)\><br> <br>Origins are the starting point of your route. Ensure that origins are a valid land location to calculate a route. Multiple origins are separated by a pipe symbol.    |

## Interface DistanceMatrixResult

### Properties

| Name         |                                                                                                                                                                                                                                |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| msg Optional | Type: string<br> <br>error message if status is not 200.                                                                                                                                                                       |
| rows         | Type: Array<[DistanceMatrixResponseRow](#interface-distancematrixresponserow)\><br> <br>Container object for response. Array of elements. Each row corresponds to one Origin.Each element object corresponds to a destination. |
| status       | Type: NBRequestStatus<br> <br>A string indicating the state of the response. This is a separate code than the HTTP status code. On normal valid responses, the value will be `Ok` .                                            |

## Interface DistanceMatrixResponseRow

### Properties

| Name     |                                                                                                                               |
| -------- | ----------------------------------------------------------------------------------------------------------------------------- |
| elements | Type: Array<[DistanceMatrixResponseElement](#interface-distancematrixresponseelement)\><br> <br>elements for a particular row |

## Interface DistanceMatrixResponseElement

### Properties

| Name     |                                                                                                  |
| -------- | ------------------------------------------------------------------------------------------------ |
| distance | Type: { value: number }<br> <br>traveling distance between origin and destination. Unit: seconds |
| duration | Type: { value: number }<br> <br>traveling duration between origin and destination. Unit: seconds |

## Constants ApproachType

| Constants    |                                                                     |
| ------------ | ------------------------------------------------------------------- |
| CURB         | route will arrive at the waypoint on the driving_side of the region |
| UNRESTRICTED | route can arrive at the waypoint from either side of the road       |

## Constants AvoidType

| Constants |                         |
| --------- | ----------------------- |
| FERRY     | Avoid ferry in route.   |
| HIGHWAY   | Avoid highway in route. |
| TOLL      | Avoid toll in route.    |

## Constants TravelMode

The transportation mode for the route.

| Constants |                           |
| --------- | ------------------------- |
| AUTO      | default mode, same as car |
| CAR       | car mode                  |
| TRUCK     | truck mode                |

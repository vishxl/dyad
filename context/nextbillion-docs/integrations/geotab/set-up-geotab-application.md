# Geotab Integration with NextBillion.ai Route Optimization API

This document describes the steps for integrating Geotab GO device with NextBillion.ai’s Route Optimization API.

Geotab offers a suite of tools designed to enhance vehicle performance, safety, and efficiency. Central to their offerings is the Geotab GO device, which captures real-time data from vehicles and integrates seamlessly with the MyGeotab platform for comprehensive fleet management.

[NextBillion.ai's Route Optimization API](https://docs.nextbillion.ai/optimization/route-optimization-flexible-api) complements Geotab's capabilities by delivering precise and efficient route planning. This API enables businesses to save time, cut costs, and boost customer satisfaction through features like 50+ dynamic constraints, advanced optimization features and re-optimization capabilities.

The integration of Geotab's telematics with NextBillion.ai's Route Optimization API offers significant business benefits. This integration supports businesses in achieving superior route planning, reducing fuel consumption, minimizing vehicle wear and tear, and improving overall delivery performance.

## Prerequisites

Before starting with the integration, make sure you have the following prerequisites in place.

- **Access to MyGeotab Application**: Access to the MyGeotab application is essential for authenticating and interacting with Geotab’s fleet management platform. This access allows you to retrieve and manage data, such as vehicle information and delivery records.
- **NextBillion.ai’s API Key**: This key will be used to authenticate the requests sent to route optimization API endpoint.

Follow the steps below to setup your Geotab application and retrieve data from Geotab.

### Sign Up for MyGeotab Application

#### Create an Account

- Navigate to the MyGeotab application website.
- Follow the prompts to create a new account by providing the necessary information such as your name, email address, and company details.
- Once the account is created, you will receive a username and password.

#### Database Creation

Upon setting up your account, a database will be created within MyGeotab specifically for your fleet management needs.

Make a note of the database name, as it will be required for authentication and data retrieval.

#### Authentication

Use the username, password, and database name to log in to the MyGeotab platform.

These credentials will be used for subsequent API interactions.

### Authenticate with Geotab

#### Follow the Authentication Method

Detailed instructions on how to authenticate with Geotab can be found here.

Authentication typically involves sending a request with your credentials to obtain a `sessionId`.

#### CRUD Operations

Geotab supports basic Create, Read, Update, and Delete (CRUD) operations. Refer to the API Reference methods available [here](https://developers.geotab.com/myGeotab/apiReference/methods) to understand how to perform these operations.

### Test Basic Add and Get Requests

#### Perform Add Requests

Test adding new records to the Geotab database to ensure that your application can communicate with the API correctly.

Examples of Add requests can include adding a new vehicle or delivery record.

#### Perform Get Requests

Test retrieving existing records from the Geotab database. This will confirm that your application can successfully fetch data from the API.

### Populate the Application Components

#### Use ADD and POST Methods

Populate your application with the necessary data using the ADD and POST methods of the Geotab API.

#### Delivery Records

Retrieve delivery records from the `zone` entity in Geotab.

Ensure these records are correctly integrated into your application to facilitate route optimization.

#### Vehicles

Retrieve vehicle data from the `user` entity in Geotab.

This data is crucial for tracking and managing your fleet.

For detailed instructions and examples on how to perform these operations, refer to the API documentation [here](https://developers.geotab.com/myGeotab/apiReference/methods/Add).

By following these steps, you will be able to successfully setup your MyGeotab application for the integration.

> Note: The following integration is created in Retool. The actual integration will follow a similar structure and workflow.

## Pull List of Vehicles and Dispatch Locations from Geotab

### Fetch Vehicles

To fetch the list of vehicles from Geotab, you need to send a GET request to the Geotab API. Below is an example of how to perform this request using curl:

#### API Request

```bash
# Fetch vehicles
curl --location 'https://my.geotab.com/apiv1' \
--header 'Content-Type: application/json' \
--data-raw '{
    "method": "GET",
    "params":{
            "typeName":"User",
                "credentials": {
                    "database": "geotab_database",
            "sessionId": "session_id",
            "userName": "user_name"
                }
    }
}'
```

#### API Response

The response will contain a list of vehicles along with their details. An example response is shown below:

```json
{
  "result": [
    {
      "countryCode": "ca",
      "firstName": "Arnav",
      "id": "bC",
      "lastName": "Malik",
      "companyName": "Nextbillion.ai"
    },
    {
      "countryCode": "us",
      "firstName": "Buzz",
      "id": "b7",
      "lastName": "Lightyear",
      "companyName": "Nextbillion.ai"
    },
    {
      "countryCode": "us",
      "firstName": "Jim",
      "id": "b4",
      "lastName": "Welch",
      "companyName": "Nextbillion.ai"
    },
    {
      "countryCode": "",
      "firstName": "myadmindbsettingsprocessor",
      "id": "b5",
      "lastName": "",
      "companyName": "Nextbillion.ai"
    },
    {
      "countryCode": "",
      "firstName": "suhail-singhbains",
      "id": "b11",
      "lastName": "",
      "companyName": "Nextbillion.ai"
    },
    {
      "countryCode": "",
      "firstName": "sushantaghosh",
      "id": "b8",
      "lastName": "",
      "companyName": "Nextbillion.ai"
    },
    {
      "countryCode": "ca",
      "firstName": "Sid",
      "id": "bD",
      "lastName": "Phillips",
      "companyName": "Nextbillion.ai"
    }
  ],
  "jsonrpc": "2.0"
}
```

### Fetch Dispatch Locations

To fetch the list of dispatch locations from Geotab, you need to send another GET request to the Geotab API. Below is an example of how to perform this request using curl:

#### API Request

```bash
# Fetch Dispatch Locations
curl --location 'https://my.geotab.com/apiv1' \
--header 'Content-Type: application/json' \
--data-raw '{
    "method": "GET",
    "params":{
            "typeName":"Zone",
                "credentials": {
                    "database": "geotab_database",
            "sessionId": "session_id",
            "userName": "user_name"
                }
    }
}'
```

#### API Response

The response will contain a list of delivery locations along with their details. An example response is shown below:

```json
{
  "result": [
    {
      "activeFrom": "1986-01-01T00:00:00.000Z",
      "activeTo": "2050-01-01T00:00:00.000Z",
      "comment": "",
      "displayed": true,
      "externalReference": "",
      "fillColor": {
        "a": 191,
        "b": 0,
        "g": 69,
        "r": 255
      },
      "id": "b3",
      "mustIdentifyStops": true,
      "name": "John Glenn Columbus International Airport (CMH), 4600 International Gateway, Columbus, OH 43219, USA",
      "points": [
        {
          "x": -82.88800811767578,
          "y": 40.00126266479492
        },
        {
          "x": -82.88621520996094,
          "y": 40.00126266479492
        },
        {
          "x": -82.88621520996094,
          "y": 40.00006103515625
        },
        {
          "x": -82.88800811767578,
          "y": 40.00006103515625
        },
        {
          "x": -82.88800811767578,
          "y": 40.00126266479492
        }
      ],
      "zoneTypes": ["ZoneTypeCustomerId"],
      "groups": [
        {
          "id": "GroupCompanyId"
        }
      ],
      "geometryType": "Polygon"
    },
    {
      "activeFrom": "1986-01-01T00:00:00.000Z",
      "activeTo": "2050-01-01T00:00:00.000Z",
      "comment": "",
      "displayed": true,
      "externalReference": "",
      "fillColor": {
        "a": 191,
        "b": 0,
        "g": 69,
        "r": 255
      },
      "id": "b4",
      "mustIdentifyStops": true,
      "name": "7579 Coventry Woods Dr N, Dublin, OH 43017, USA",
      "points": [
        {
          "x": -83.12487030029297,
          "y": 40.122867584228516
        },
        {
          "x": -83.1230697631836,
          "y": 40.122867584228516
        },
        {
          "x": -83.1230697631836,
          "y": 40.12166976928711
        },
        {
          "x": -83.12487030029297,
          "y": 40.12166976928711
        },
        {
          "x": -83.12487030029297,
          "y": 40.122867584228516
        }
      ],
      "zoneTypes": ["ZoneTypeHomeId", "ZoneTypeCustomerId"],
      "groups": [
        {
          "id": "GroupCompanyId"
        }
      ],
      "geometryType": "Polygon"
    },
    {
      "activeFrom": "1986-01-01T00:00:00.000Z",
      "activeTo": "2050-01-01T00:00:00.000Z",
      "comment": "",
      "displayed": true,
      "externalReference": "",
      "fillColor": {
        "a": 191,
        "b": 0,
        "g": 69,
        "r": 255
      },
      "id": "b5",
      "mustIdentifyStops": true,
      "name": "5486 Cartwright Ln E, Dublin, OH 43016, USA",
      "points": [
        {
          "x": -83.16177368164062,
          "y": 40.07670211791992
        },
        {
          "x": -83.15997314453125,
          "y": 40.07670211791992
        },
        {
          "x": -83.15997314453125,
          "y": 40.07550048828125
        },
        {
          "x": -83.16177368164062,
          "y": 40.07550048828125
        },
        {
          "x": -83.16177368164062,
          "y": 40.07670211791992
        }
      ],
      "zoneTypes": ["ZoneTypeCustomerId"],
      "groups": [
        {
          "id": "GroupCompanyId"
        }
      ],
      "geometryType": "Polygon"
    },
    {
      "activeFrom": "1986-01-01T00:00:00.000Z",
      "activeTo": "2050-01-01T00:00:00.000Z",
      "comment": "",
      "displayed": true,
      "externalReference": "",
      "fillColor": {
        "a": 191,
        "b": 0,
        "g": 69,
        "r": 255
      },
      "id": "b6",
      "mustIdentifyStops": true,
      "name": "2769 Fisher Rd, Columbus, OH 43204, USA",
      "points": [
        {
          "x": -83.07879638671875,
          "y": 39.972984313964844
        },
        {
          "x": -83.07699584960938,
          "y": 39.972984313964844
        },
        {
          "x": -83.07699584960938,
          "y": 39.97178649902344
        },
        {
          "x": -83.07879638671875,
          "y": 39.97178649902344
        },
        {
          "x": -83.07879638671875,
          "y": 39.972984313964844
        }
      ],
      "zoneTypes": ["ZoneTypeCustomerId"],
      "groups": [
        {
          "id": "GroupCompanyId"
        }
      ],
      "geometryType": "Polygon"
    },
    {
      "activeFrom": "1986-01-01T00:00:00.000Z",
      "activeTo": "2050-01-01T00:00:00.000Z",
      "comment": "",
      "displayed": true,
      "externalReference": "",
      "fillColor": {
        "a": 191,
        "b": 0,
        "g": 69,
        "r": 255
      },
      "id": "b7",
      "mustIdentifyStops": true,
      "name": "6751 McVey Blvd, Columbus, OH 43235, USA",
      "points": [
        {
          "x": -83.06173706054688,
          "y": 40.10233688354492
        },
        {
          "x": -83.0599365234375,
          "y": 40.10233688354492
        },
        {
          "x": -83.0599365234375,
          "y": 40.101139068603516
        },
        {
          "x": -83.06173706054688,
          "y": 40.101139068603516
        },
        {
          "x": -83.06173706054688,
          "y": 40.10233688354492
        }
      ],
      "zoneTypes": ["ZoneTypeCustomerId"],
      "groups": [
        {
          "id": "GroupCompanyId"
        }
      ],
      "geometryType": "Polygon"
    },
    {
      "activeFrom": "1986-01-01T00:00:00.000Z",
      "activeTo": "2050-01-01T00:00:00.000Z",
      "comment": "",
      "displayed": true,
      "externalReference": "",
      "fillColor": {
        "a": 191,
        "b": 0,
        "g": 69,
        "r": 255
      },
      "id": "b8",
      "mustIdentifyStops": true,
      "name": "Home",
      "points": [
        {
          "x": -83.12360889734997,
          "y": 40.12344061874179
        },
        {
          "x": -83.12635547938122,
          "y": 40.1224725530247
        },
        {
          "x": -83.1213987571217,
          "y": 40.121422432253816
        },
        {
          "x": -83.12345869364513,
          "y": 40.12357188082861
        },
        {
          "x": -83.12360889734997,
          "y": 40.12344061874179
        }
      ],
      "zoneTypes": ["ZoneTypeCustomerId", "ZoneTypeHomeId"],
      "groups": [
        {
          "id": "GroupCompanyId"
        }
      ],
      "geometryType": "Polygon"
    },
    {
      "activeFrom": "1986-01-01T00:00:00.000Z",
      "activeTo": "2050-01-01T00:00:00.000Z",
      "comment": "",
      "displayed": true,
      "externalReference": "",
      "fillColor": {
        "a": 191,
        "b": 0,
        "g": 69,
        "r": 255
      },
      "id": "b9",
      "mustIdentifyStops": true,
      "name": "7592 Coventry Woods Drive North, Dublin, OH, USA",
      "points": [
        {
          "x": -83.12489318847656,
          "y": 40.122894287109375
        },
        {
          "x": -83.12309265136719,
          "y": 40.122894287109375
        },
        {
          "x": -83.12309265136719,
          "y": 40.1216926574707
        },
        {
          "x": -83.12489318847656,
          "y": 40.1216926574707
        },
        {
          "x": -83.12489318847656,
          "y": 40.122894287109375
        }
      ],
      "zoneTypes": ["ZoneTypeCustomerId"],
      "groups": [
        {
          "id": "GroupCompanyId"
        }
      ],
      "geometryType": "Polygon"
    },
    {
      "activeFrom": "1986-01-01T00:00:00.000Z",
      "activeTo": "2050-01-01T00:00:00.000Z",
      "comment": "",
      "displayed": true,
      "externalReference": "",
      "fillColor": {
        "a": 191,
        "b": 0,
        "g": 69,
        "r": 255
      },
      "id": "bA",
      "mustIdentifyStops": true,
      "name": "Glacier Ridge Metro Park, Hyland-Croy Road, Plain City, OH, USA",
      "points": [
        {
          "x": -83.18661499023438,
          "y": 40.156944274902344
        },
        {
          "x": -83.184814453125,
          "y": 40.156944274902344
        },
        {
          "x": -83.184814453125,
          "y": 40.15574645996094
        },
        {
          "x": -83.18661499023438,
          "y": 40.15574645996094
        },
        {
          "x": -83.18661499023438,
          "y": 40.156944274902344
        }
      ],
      "zoneTypes": ["ZoneTypeCustomerId"],
      "groups": [
        {
          "id": "GroupCompanyId"
        }
      ],
      "geometryType": "Polygon"
    }
  ],
  "jsonrpc": "2.0"
}
```

Once all the required data are fetched and populated, the inputs can be pushed to Nextbillion's Route Optimization (RO) API to generate the optimized routes. This will enhance the routes being optimized for the problem at hand.

The integration dashboard will resemble the following image.

![Delivery and Vehicles record in integration dashboard](https://static.nextbillion.io/docs-next/integrations/geotab/retool-dashboard.webp)

The additional parameters available with Nextbillion's Route Optimization API can be added to the Retool app for further customization and optimization.

![other additional route optimization API parameters in integration dashboard](https://static.nextbillion.io/docs-next/integrations/geotab/other-parameters.webp)

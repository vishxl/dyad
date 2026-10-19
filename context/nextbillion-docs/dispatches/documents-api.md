# Documents API

## Introduction

NextBillion.ai’s Documents API allows users to create form templates for collecting required information. Users can add fields and configure their names, data types and even validation rules to maintain data integrity and quality standards. Once created, these forms can be used for collecting information like - proof of completion or proof of delivery - while executing planned routes.

Users can link a document to a specific route via the [Dispatch API](https://docs.nextbillion.ai/dispatches/route-dispatch-api). Once linked successfully, the Driver would be required to record the information in the document for each task step on the dispatched route. The drivers can access the documents for each task step via their Driver app, available on [Android](https://play.google.com/store/apps/details?id=ai.nextbillion.nb_fleet_driver_app&pcampaignid=web_share) & [iOS](https://apps.apple.com/us/app/nextbillion-ai-driver/id6474605815), once the associated route is dispatched successfully.

> To dispatch the routes to your drivers, register them at [NextBillion.ai Cloud Console](https://console.nextbillion.ai/).

Let’s take a look at the methods available to manage documents.

## Create a Document Template

This endpoint allows users to create a document template. Users need to configure a unique name for the template. Once the request is successfully submitted, the service responds with an unique identifier for the document which can be used to reference this template when dispatching routes.

POST

https://api.nextbillion.io/fleetify/document_templates?key={your_api_key}

### Request Parameters

| Name  | Required | Format and Usage | Description                                                                         |
| ----- | -------- | ---------------- | ----------------------------------------------------------------------------------- |
| `key` | Yes      | Type: `string`   | A key is a unique identifier that is required to authenticate a request to the API. |

### Request Body

| Field                            | Type            | Description                                                                                                                                                                                                                      |
| -------------------------------- | --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`                           | string          | Specify a name for the document template to be created.                                                                                                                                                                          |
| `content`                        | array of object | A form field that drivers must complete when executing a route step. Defines the data structure and validation rules for collecting required information during route execution.                                                 |
| `content[].label`                | string          | Specify the label or the name of the field. The `label` specified here can be used as field name when rendering the document in the Driver app.                                                                                  |
| `content[].name`                 | string          | Specify the name of the document field. A field's`name` can be used for internal references to the document field.                                                                                                               |
| `content[].type`                 | string          | Specify the data type of the field. It corresponds to the type of information that the driver needs to collect.                                                                                                                  |
| `content[].required`             | boolean         | Specify if it is mandatory to fill the field. Default value is false.                                                                                                                                                            |
| `content[].validation`           | object          | Specify the validation rules for the field. This can be used to enforce data quality and integrity checks. For example, if the field is a number type, `validation` can define constraints like minimum / maximum number values. |
| `content[].validation.min`       | integer         | Specifies the minimum allowed value for `number` type document field. Input values must be greater than or equal to this threshold.                                                                                              |
| `content[].validation.max`       | integer         | Specifies the maximum allowed value for `number` type document field. Input values must be less than or equal to this threshold.                                                                                                 |
| `content[].validation.min_items` | integer         | Specifies the minimum number of items for `multi_choices`, `photos` type document fields. The number of provided input items must be greater than or equal to this threshold.                                                    |
| `content[].validation.max_items` | integer         | Specifies the maximum number of items for `multi_choices`, `photos` type document fields. The number of provided input items must be less than or equal to this threshold.                                                       |
| `content[].meta`                 | object          | An object to define additional information required for `single_choice` or `multi_choices` type document items.                                                                                                                  |
| `content[].meta.options`         | array of object | An array of objects to define options for a `multi_choices` or `single_choice` type document field. Each object represents one option.                                                                                           |
| `content[].meta.options[].label` | string          | Specify the label or name for the option.                                                                                                                                                                                        |
| `content[].meta.options[].value` | string          | Specify the value associated with the option. This value will be submitted when the option is checked in the Driver app.                                                                                                         |

### Response Schema

| Field                                 | Type            | Description                                                                                                                                                                                              |
| ------------------------------------- | --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `status`                              | integer         | Returns the HTTP response code.                                                                                                                                                                          |
| `msg`                                 | string          | Returns the error message in case of a failed request. If the request is successful, this field is not present in the response.                                                                          |
| `data`                                | object          | An object returning the details of the document template created.                                                                                                                                        |
| `data.id`                             | string          | Returns the unique ID of the document template created.                                                                                                                                                  |
| `data.name`                           | string          | Returns the name of the document template as specified in the input.                                                                                                                                     |
| `data.content`                        | array of object | An array of objects returning the details of data structures and validation rules and other properties of all document fields. Each object represents one document field.                                |
| `data.content[].label`                | string          | Returns the label of the document field.                                                                                                                                                                 |
| `data.content[].name`                 | string          | Returns the name of the document field.                                                                                                                                                                  |
| `data.content[].type`                 | string          | Returns the data type of the document field. It will always belong to one of `string`, `number`, `date_time`, `photos`, `multi_choices`, `signature`, `barcode`, and `single_choice.`                    |
| `data.content[].required`             | boolean         | Indicates if the document field is mandatory or not.                                                                                                                                                     |
| `data.content[].validation`           | object          | Returns the validation rules for `number` , `multi_choices` , and `photos` document field types.                                                                                                         |
| `data.content[].validation.min`       | integer         | Returns the minimum allowed value for `number` type document item, as specified at the time of configuring the field. This parameter is not present in the response if it was not provided in the input. |
| `data.content[].validation.max`       | integer         | Returns the maximum allowed value for `number` type document item, as specified at the time of configuring the field. This parameter is not present in the response if it was not provided in the input. |
| `data.content[].validation.min_items` | string          | Returns the minimum number of items required for `multi_choices`, `photos` type document items. This parameter will not be present in the response if it was not provided in the input.                  |
| `data.content[].validation.max_items` | string          | Returns the maximum number of items required for `multi_choices`, `photos` type document items. This parameter will not be present in the response if it was not provided in the input.                  |
| `data.content[].meta`                 | object          | Returns the options configured for `single_choice` or `multi_choices` type document items.                                                                                                               |
| `data.content[].meta.options`         | array of object | An array of objects returning the options for `multi_choices` or `single_choice` type document field. Each object represents one configured option.                                                      |
| `data.content[].meta.options[].label` | string          | Returns the label for the option.                                                                                                                                                                        |
| `data.content[].meta.options[].value` | string          | Returns the value associated with the option. This value gets submitted when the option is checked in the Driver app.                                                                                    |

### Sample Request

```bash
curl --location 'https://api.nextbillion.io/fleetify/document_templates?key=<your_api_key>' \
--header 'Content-Type: application/json' \
--data '{
  "name": "sample_template",
  "content": [
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
  ]
}'
```

### Sample Response

```json
{
  "status": 200,
  "data": {
    "id": "86eb43f2-c961-40a3-92c6-b039a3eb821b",
    "content": [
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
    "name": "sample_template"
  }
}
```

## Retrieve a Document Template

This endpoint allows users to retrieve a document template using its unique ID.

GET

https://api.nextbillion.io/fleetify/document_templates/{id}?key={your_api_key}

### Request Parameters

| Name  | Required | Format and Usage | Description                                                                         |
| ----- | -------- | ---------------- | ----------------------------------------------------------------------------------- |
| `key` | Yes      | Type: `string`   | A key is a unique identifier that is required to authenticate a request to the API. |

### Response Schema

| Field                                 | Type            | Description                                                                                                                                                                                              |
| ------------------------------------- | --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `status`                              | integer         | Returns the HTTP response code.                                                                                                                                                                          |
| `msg`                                 | string          | Returns the error message in case of a failed request. If the request is successful, this field is not present in the response.                                                                          |
| `data`                                | object          | An object returning the details of the requested document template.                                                                                                                                      |
| `data.id`                             | string          | Returns the unique identifier of the document template.                                                                                                                                                  |
| `data.name`                           | string          | Returns the name of the document template as specified at the time of creating the template.                                                                                                             |
| `data.content`                        | array of object | An array of objects returning the details of data structures and validation rules and other properties of all document fields. Each object represents one document field.                                |
| `data.content[].label`                | string          | Returns the label of the document field.                                                                                                                                                                 |
| `data.content[].name`                 | string          | Returns the name of the document field.                                                                                                                                                                  |
| `data.content[].type`                 | string          | Returns the data type of the document field. It will always belong to one of `string`, `number`, `date_time`, `photos`, `multi_choices`, `signature`, `barcode`, and `single_choice.`                    |
| `data.content[].required`             | boolean         | Indicates if the document field is mandatory or not.                                                                                                                                                     |
| `data.content[].validation`           | object          | Returns the validation rules for `number` , `multi_choices` , and `photos` document field types.                                                                                                         |
| `data.content[].validation.min`       | integer         | Returns the minimum allowed value for `number` type document item, as specified at the time of configuring the field. This parameter is not present in the response if it was not provided in the input. |
| `data.content[].validation.max`       | integer         | Returns the maximum allowed value for `number` type document item, as specified at the time of configuring the field. This parameter is not present in the response if it was not provided in the input. |
| `data.content[].validation.min_items` | string          | Returns the minimum number of items required for `multi_choices`, `photos` type document items. This parameter will not be present in the response if it was not provided in the input.                  |
| `data.content[].validation.max_items` | string          | Returns the maximum number of items required for `multi_choices`, `photos` type document items. This parameter will not be present in the response if it was not provided in the input.                  |
| `data.content[].meta`                 | object          | Returns the options configured for `single_choice` or `multi_choices` type document items.                                                                                                               |
| `data.content[].meta.options`         | array of object | An array of objects returning the options for `multi_choices` or `single_choice` type document field. Each object represents one configured option.                                                      |
| `data.content[].meta.options[].label` | string          | Returns the label for the option.                                                                                                                                                                        |
| `data.content[].meta.options[].value` | string          | Returns the value associated with the option. This value gets submitted when the option is checked in the Driver app.                                                                                    |

### Sample Request

```bash
curl --location 'https://api.nextbillion.io/fleetify/document_templates/86eb43f2-c961-40a3-92c6-b039a3eb821b?key=<your_api_key>'
```

### Sample Response

```json
{
  "status": 200,
  "data": {
    "id": "86eb43f2-c961-40a3-92c6-b039a3eb821b",
    "content": [
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
    "name": "sample_template"
  }
}
```

## Update a Document Template

This endpoint allows users to update a specific document template using its unique ID. Please note that updating the `content` attribute of a template overwrites all the existing items for the given template.

PUT

https://api.nextbillion.io/fleetify/document_templates/{id}?key={your_api_key}

### Request Parameters

| Name  | Required | Format and Usage | Description                                                                         |
| ----- | -------- | ---------------- | ----------------------------------------------------------------------------------- |
| `key` | Yes      | Type: `string`   | A key is a unique identifier that is required to authenticate a request to the API. |

### Request Body

| Field                            | Type            | Description                                                                                                                                                                                                                      |
| -------------------------------- | --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`                           | string          | Specify the document template name to be updated.                                                                                                                                                                                |
| `content`                        | array of object | An object to collect the details of form fields to be updated - data structures, validation rules. Please note that the details provided here will overwrite any existing document fields in the given template.                 |
| `content[].label`                | string          | Specify the label or the name of the field. The `label` specified here can be used as field name when rendering the document in the Driver app.                                                                                  |
| `content[].name`                 | string          | Specify the name of the document field. A field's`name` can be used for internal references to the document field.                                                                                                               |
| `content[].type`                 | string          | Specify the data type of the field. It corresponds to the type of information that the driver needs to collect.                                                                                                                  |
| `content[].required`             | boolean         | Specify if it is mandatory to fill the field. Default value is false.                                                                                                                                                            |
| `content[].validation`           | object          | Specify the validation rules for the field. This can be used to enforce data quality and integrity checks. For example, if the field is a number type, `validation` can define constraints like minimum / maximum number values. |
| `content[].validation.min`       | integer         | Specifies the minimum allowed value for `number` type document field. Input values must be greater than or equal to this threshold.                                                                                              |
| `content[].validation.max`       | integer         | Specifies the maximum allowed value for `number` type document field. Input values must be less than or equal to this threshold.                                                                                                 |
| `content[].validation.min_items` | integer         | Specifies the minimum number of items for `multi_choices`, `photos` type document fields. The number of provided input items must be greater than or equal to this threshold.                                                    |
| `content[].validation.max_items` | integer         | Specifies the maximum number of items for `multi_choices`, `photos` type document fields. The number of provided input items must be less than or equal to this threshold.                                                       |
| `content[].meta`                 | object          | An object to define additional information required for `single_choice` or `multi_choices` type document items.                                                                                                                  |
| `content[].meta.options`         | array of object | An array of objects to define options for a `multi_choices` or `single_choice` type document field. Each object represents one option.                                                                                           |
| `content[].meta.options[].label` | string          | Specify the label or name for the option.                                                                                                                                                                                        |
| `content[].meta.options[].value` | string          | Specify the value associated with the option. This value will be submitted when the option is checked in the Driver app.                                                                                                         |

### Response Schema

| Field                                 | Type            | Description                                                                                                                                                                                              |
| ------------------------------------- | --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `status`                              | integer         | Returns the HTTP response code.                                                                                                                                                                          |
| `msg`                                 | string          | Returns the error message in case of a failed request. If the request is successful, this field is not present in the response.                                                                          |
| `data`                                | object          | An object returning the details of the updated document template.                                                                                                                                        |
| `data.id`                             | string          | Returns the unique ID of the document template.                                                                                                                                                          |
| `data.name`                           | string          | Returns the updated name of the document template.                                                                                                                                                       |
| `data.content`                        | array of object | An array of object returning the details of updated data structures and validation rules for document fields. Each object represents one document field.                                                 |
| `data.content[].label`                | string          | Returns the label of the document field.                                                                                                                                                                 |
| `data.content[].name`                 | string          | Returns the name of the document field.                                                                                                                                                                  |
| `data.content[].type`                 | string          | Returns the data type of the document field. It will always belong to one of `string`, `number`, `date_time`, `photos`, `multi_choices`, `signature`, `barcode`, and `single_choice.`                    |
| `data.content[].required`             | boolean         | Indicates if the document field is mandatory or not.                                                                                                                                                     |
| `data.content[].validation`           | object          | Returns the validation rules for `number` , `multi_choices` , and `photos` document field types.                                                                                                         |
| `data.content[].validation.min`       | integer         | Returns the minimum allowed value for `number` type document item, as specified at the time of configuring the field. This parameter is not present in the response if it was not provided in the input. |
| `data.content[].validation.max`       | integer         | Returns the maximum allowed value for `number` type document item, as specified at the time of configuring the field. This parameter is not present in the response if it was not provided in the input. |
| `data.content[].validation.min_items` | string          | Returns the minimum number of items required for `multi_choices`, `photos` type document items. This parameter will not be present in the response if it was not provided in the input.                  |
| `data.content[].validation.max_items` | string          | Returns the maximum number of items required for `multi_choices`, `photos` type document items. This parameter will not be present in the response if it was not provided in the input.                  |
| `data.content[].meta`                 | object          | Returns the options configured for `single_choice` or `multi_choices` type document items.                                                                                                               |
| `data.content[].meta.options`         | array of object | An array of objects returning the options for `multi_choices` or `single_choice` type document field. Each object represents one configured option.                                                      |
| `data.content[].meta.options[].label` | string          | Returns the label for the option.                                                                                                                                                                        |
| `data.content[].meta.options[].value` | string          | Returns the value associated with the option. This value gets submitted when the option is checked in the Driver app.                                                                                    |

### Sample Request

```bash
curl --location --request PUT 'https://api.nextbillion.io/fleetify/document_templates/886abfe6-0068-48aa-988a-8639dad228c5?key=<your_api_key>' \
--header 'Content-Type: application/json' \
--data '{
    "name":"Sample_template_1",
    "content": [
                {
                    "type": "string",
                    "name": "OTP verification",
                    "label": "OTP",
                    "required": true
                },
                {
                    "type": "date_time",
                    "name": "Completion Time",
                    "label": "Completed at:",
                    "required": true
                }
            ]
}'
```

### Sample Response

```json
{
  "status": 200,
  "data": {
    "id": "886abfe6-0068-48aa-988a-8639dad228c5",
    "content": [
      {
        "type": "string",
        "name": "OTP verification",
        "label": "OTP",
        "required": true
      },
      {
        "type": "date_time",
        "name": "Completion Time",
        "label": "Completed at:",
        "required": true
      }
    ],
    "name": "Sample_template_1"
  }
}
```

## Retrieve all Document Templates

This endpoint allows users to retrieve all document templates associated with an API key.

GET

https://api.nextbillion.io/fleetify/document_templates?key={your_api_key}

### Request Parameters

| Name  | Required | Format and Usage | Description                                                                         |
| ----- | -------- | ---------------- | ----------------------------------------------------------------------------------- |
| `key` | Yes      | Type: `string`   | A key is a unique identifier that is required to authenticate a request to the API. |

### Response Schema

| Field                                   | Type            | Description                                                                                                                                                                                                                                       |
| --------------------------------------- | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `status`                                | integer         | Returns the HTTP response code.                                                                                                                                                                                                                   |
| `msg`                                   | string          | Returns the error message in case of a failed request. If the request is successful, this field is not present in the response.                                                                                                                   |
| `data`                                  | array of object | An array of objects returning the details of each document template associated with the specified API key. Each object represents one document template. In case there are no templates associated with the given key, a blank array is returned. |
| `data[].id`                             | string          | Returns the unique ID of the document template.                                                                                                                                                                                                   |
| `data[].name`                           | string          | Returns the name of the document template.                                                                                                                                                                                                        |
| `data[].content`                        | array of object | An array of objects returning the details of data structures and validation rules and other properties of all document fields. Each object represents one document field.                                                                         |
| `data[].content[].label`                | string          | Returns the label of the document field.                                                                                                                                                                                                          |
| `data[].content[].name`                 | string          | Returns the name of the document field.                                                                                                                                                                                                           |
| `data[].content[].type`                 | string          | Returns the data type of the document field. It will always belong to one of `string`, `number`, `date_time`, `photos`, `multi_choices`, `signature`, `barcode`, and `single_choice.`                                                             |
| `data[].content[].required`             | boolean         | Indicates if the document field is mandatory or not.                                                                                                                                                                                              |
| `data[].content[].validation`           | object          | Returns the validation rules for `number` , `multi_choices` , and `photos` document field types.                                                                                                                                                  |
| `data[].content[].validation.min`       | integer         | Returns the minimum allowed value for `number` type document item, as specified at the time of configuring the field. This parameter is not present in the response if it was not provided in the input.                                          |
| `data[].content[].validation.max`       | integer         | Returns the maximum allowed value for `number` type document item, as specified at the time of configuring the field. This parameter is not present in the response if it was not provided in the input.                                          |
| `data[].content[].validation.min_items` | string          | Returns the minimum number of items required for `multi_choices`, `photos` type document items. This parameter will not be present in the response if it was not provided in the input.                                                           |
| `data[].content[].validation.max_items` | string          | Returns the maximum number of items required for `multi_choices`, `photos` type document items. This parameter will not be present in the response if it was not provided in the input.                                                           |
| `data[].content[].meta`                 | object          | Returns the options configured for `single_choice` or `multi_choices` type document items.                                                                                                                                                        |
| `data[].content[].meta.options`         | array of object | An array of objects returning the options for `multi_choices` or `single_choice` type document field. Each object represents one configured option.                                                                                               |
| `data[].content[].meta.options[].label` | string          | Returns the label for the option.                                                                                                                                                                                                                 |
| `data[].content[].meta.options[].value` | string          | Returns the value associated with the option. This value gets submitted when the option is checked in the Driver app.                                                                                                                             |

### Sample Request

```bash
curl --location 'https://api.nextbillion.io/fleetify/document_templates?key=<your_api_key>'
```

### Sample Response

```json
{
  "status": 200,
  "data": [
    {
      "id": "86eb43f2-c961-40a3-92c6-b039a3eb821b",
      "content": [
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
      "name": "sample_template"
    },
    {
      "id": "886abfe6-0068-48aa-988a-8639dad228c5",
      "content": [
        {
          "type": "string",
          "name": "OTP verification",
          "label": "OTP",
          "required": true
        },
        {
          "type": "date_time",
          "name": "Completion Time",
          "label": "Completed at:",
          "required": true
        }
      ],
      "name": "Sample_template_1"
    }
  ]
}
```

## Delete a Document Template

This endpoint allows users to delete an existing document template using its unique ID.

DELETE

https://api.nextbillion.io/fleetify/document_templates/{id}?key={your_api_key}

### Request Parameters

| Name  | Required | Format and Usage | Description                                                                         |
| ----- | -------- | ---------------- | ----------------------------------------------------------------------------------- |
| `key` | Yes      | Type: `string`   | A key is a unique identifier that is required to authenticate a request to the API. |

### Response Schema

| Field    | Type    | Description                                                                                                                     |
| -------- | ------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `status` | integer | Returns the HTTP response code.                                                                                                 |
| `msg`    | string  | Returns the error message in case of a failed request. If the request is successful, this field is not present in the response. |

### Sample Request

```bash
curl --location --request DELETE 'https://api.nextbillion.io/fleetify/document_templates/886abfe6-0068-48aa-988a-8639dad228c5?key=<your_api_key>'
```

### Sample Response

```json
{
  "status": 200
}
```

## API Query Limits

1. NextBillion.ai allows a maximum rate limit of 6000 queries per minute or 100 queries/second for continuous requests.  
   _Note_: We can increase the quota if needed on request. Contact [support@nextbillion.ai](mailto:support@nextbillion.ai) for more details.

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

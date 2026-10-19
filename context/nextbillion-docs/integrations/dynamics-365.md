# Dynamic 365 Field Service Integration with NB.ai’s Route Optimization API

## Introduction

[Microsoft Dynamics 365 Field Service](https://www.microsoft.com/en-in/dynamics-365/products/field-service) serves as a robust solution to enhance the efficiency of field service operations. This platform empowers field service teams through real-time visibility into service activities, resource scheduling, and inventory management. Dynamics 365 Field Service equips businesses with tools for predictive maintenance, proactive issue resolution, and intelligent insights, thereby fostering productivity and ensuring a seamless end-to-end service delivery process. Whether managing work orders, dispatching technicians, or analyzing performance metrics, this dynamic solution enables organizations to adapt and excel in the ever-evolving landscape of field service management.

[Nextbillion's Route Optimization API](https://docs.nextbillion.ai/docs/optimization/api/route-optimization-v2) complements these capabilities, providing businesses with precise and efficient route planning to save time, reduce costs, and elevate customer satisfaction. Real-time tracking and analytics features allow businesses to monitor their fleet, gaining valuable insights for continuous operational improvement.

By integrating the capabilities of Dynamics 365 Field Service and Nextbillion's Route Optimization API, businesses can revolutionize their field operations, maintaining a competitive edge in today's market.

## Pre Requisites

In order to successfully integrate Dynamics 365 Field Service with NextBillion.ai's services, certain prerequisites must be met. These include:

1.  **Active Microsoft Dynamics 365 Field Service account:** Ensure that you have a functional and active account for Microsoft Dynamics 365 Field Service. This account serves as the foundational element for the integration, providing access to the necessary functionalities within the Dynamics 365 Field Service platform.
2.  **Valid API key from NextBillion.ai:** Acquire a valid API key from NextBillion.ai, which acts as the authentication mechanism for connecting your Dynamics 365 Field Service instance with NextBillion.ai's services. This key establishes a secure and authorized communication channel between the two platforms, facilitating seamless data exchange and integration. Contact support to get your API key.

By satisfying these prerequisites, you create the essential groundwork for a successful and secure integration between Dynamics 365 Field Service and NextBillion.ai's Route Optimization API.

## Integration Steps

### Step 1: Set Up Dynamic 365 Field Service Application

Assuming the availability of the Dynamics 365 Field Service application with the user, follow these steps to establish an external connection through OAuth:

**1\. Configure Connection in Microsoft Azure Cloud Platform**

- Log in to Microsoft Azure Cloud.
- Navigate to 'App registrations' and select 'New Registration.'

![documentation image](https://static.nextbillion.io/docs-next/integrations/dynamic-365/dynamic-365-1.webp)

**2\. Fill Application Details**

- Enter the required details for the application, including a suitable Name and Redirect URI (e.g., localhost or a chosen web platform).

![documentation image](https://static.nextbillion.io/docs-next/integrations/dynamic-365/dynamic-365-2.webp)

**3\. Application Registration**

- Upon registration, your application is created.

**4\. Create Client Secret**

- Generate a client secret for authentication by clicking 'Add.'
- Immediately copy and securely store the client secret, as it cannot be retrieved later.

![documentation image](https://static.nextbillion.io/docs-next/integrations/dynamic-365/dynamic-365-4.webp)  
![documentation image](https://static.nextbillion.io/docs-next/integrations/dynamic-365/dynamic-365-3.webp)

**5\. Authentication**

- Use the client ID and secret credentials to test the application and generate an access token.
- Utilize tools like Postman for generating and testing the access token.

![documentation image](https://static.nextbillion.io/docs-next/integrations/dynamic-365/dynamic-365-5.webp)

**6\. Validate Basic CRUD Operations**

- Verify basic CRUD operations using the generated access token.

By following these steps, you establish an OAuth connection for Dynamics 365 Field Service, facilitating secure external access and enabling essential operations through the generated access token.

> Note: The subsequent steps demonstrate the integration process using Retool, a custom software development platform. A parallel methodology can be applied when integrating NB.ai's Route Optimization API with Dynamic 365 Field Service Platform.

### Step 2: Pull List of Vehicles from Dynamic 365 Field Service

In this step, we retrieve work order tasks from the Dynamic 365 Field Service account. The objective is to pull a comprehensive list of vehicles that provide essential details for further analysis and optimization.

![documentation image](https://static.nextbillion.io/docs-next/integrations/dynamic-365/dynamic-365-6.webp)

#### API Request

Use the following cURL command to retrieve vehicles data.

```bash
# Fetch Vehicles from Dynamic 365 Field Service
curl --location 'https://org83f3f8a8.crm.dynamics.com/api/data/v9.0/bookableresources?$select=*&$filter=statuscode%20eq%201' \
--header 'Accept-Language: en-US' \
--header 'Authorization: Bearer <access_token>'
```

#### API Response

The following API response represents information about vehicles retrieved from Dynamics 365 Field Service.

```json
{
  "@odata.context": "https://org83f3f8a8.crm.dynamics.com/api/data/v9.0/$metadata#bookableresources(*)",
  "value": [
    {
      "@odata.etag": "W/\"4240179\"",
      "statecode": 0,
      "statuscode": 1,
      "msdyn_displayonscheduleboard": true,
      "createdon": "2023-05-02T14:24:09Z",
      "_msdyn_organizationalunit_value": "c16599ef-f3e8-ed11-a7c6-000d3a58268a",
      "_calendarid_value": "bb73775f-ffc0-49b0-b743-4f7a228d2d13",
      "_owningbusinessunit_value": "84a2cc2a-f4e0-ed11-a7c6-000d3a8bcaaa",
      "_ownerid_value": "755de630-f4e0-ed11-a7c6-000d3a8bcaaa",
      "name": "Mickey Mouse",
      "versionnumber": 4240179,
      "timezone": 35,
      "msdyn_enableoutlookschedules": 192350001,
      "_contactid_value": "d64f27bd-4de8-ed11-a7c6-000d3a58268a",
      "bookableresourceid": "d77417ff-f4e8-ed11-a7c6-000d3a58268a",
      "msdyn_derivecapacity": false,
      "_modifiedby_value": "755de630-f4e0-ed11-a7c6-000d3a8bcaaa",
      "msdyn_enabledripscheduling": false,
      "msdyn_enabledforfieldservicemobile": false,
      "modifiedon": "2023-05-02T14:24:09Z",
      "msdyn_endlocation": 690970001,
      "_createdby_value": "755de630-f4e0-ed11-a7c6-000d3a8bcaaa",
      "msdyn_displayonscheduleassistant": true,
      "resourcetype": 2,
      "processid": "00000000-0000-0000-0000-000000000000",
      "_owninguser_value": "755de630-f4e0-ed11-a7c6-000d3a8bcaaa",
      "msdyn_timeoffapprovalrequired": false,
      "msdyn_enableappointments": 192350001,
      "msdyn_startlocation": 690970001,
      "msdyn_generictype": null,
      "msdyn_pooltype": null,
      "_transactioncurrencyid_value": null,
      "stageid": null,
      "overriddencreatedon": null,
      "msdyn_crewstrategy": null,
      "msdyn_bookingstodrip": null,
      "msdyn_hourlyrate": null,
      "importsequencenumber": null,
      "msdyn_latitude": null,
      "_modifiedonbehalfby_value": null,
      "exchangerate": null,
      "msdyn_locationtimestamp": null,
      "utcconversiontimezonecode": null,
      "_msdyn_warehouse_value": null,
      "msdyn_longitude": null,
      "msdyn_hourlyrate_base": null,
      "_createdonbehalfby_value": null,
      "msdyn_internalflags": null,
      "traversedpath": null,
      "msdyn_targetutilization": null,
      "_accountid_value": null,
      "_userid_value": null,
      "_owningteam_value": null,
      "msdyn_primaryemail": null,
      "timezoneruleversionnumber": null
    },
    {
      "@odata.etag": "W/\"4240331\"",
      "statecode": 0,
      "statuscode": 1,
      "msdyn_displayonscheduleboard": true,
      "createdon": "2023-05-02T14:29:22Z",
      "_msdyn_organizationalunit_value": "c16599ef-f3e8-ed11-a7c6-000d3a58268a",
      "_calendarid_value": "7c918664-030d-4540-bca7-02a75031a3bb",
      "_owningbusinessunit_value": "84a2cc2a-f4e0-ed11-a7c6-000d3a8bcaaa",
      "_ownerid_value": "755de630-f4e0-ed11-a7c6-000d3a8bcaaa",
      "name": "Donald Duck",
      "versionnumber": 4240331,
      "timezone": 35,
      "msdyn_enableoutlookschedules": 192350001,
      "_contactid_value": "c09085b2-f5e8-ed11-a7c6-000d3a58268a",
      "bookableresourceid": "d7417aba-f5e8-ed11-a7c6-000d3a58268a",
      "msdyn_derivecapacity": false,
      "_modifiedby_value": "755de630-f4e0-ed11-a7c6-000d3a8bcaaa",
      "msdyn_enabledripscheduling": false,
      "msdyn_enabledforfieldservicemobile": false,
      "modifiedon": "2023-05-02T14:29:22Z",
      "msdyn_endlocation": 690970001,
      "_createdby_value": "755de630-f4e0-ed11-a7c6-000d3a8bcaaa",
      "msdyn_displayonscheduleassistant": true,
      "resourcetype": 2,
      "processid": "00000000-0000-0000-0000-000000000000",
      "_owninguser_value": "755de630-f4e0-ed11-a7c6-000d3a8bcaaa",
      "msdyn_timeoffapprovalrequired": false,
      "msdyn_enableappointments": 192350001,
      "msdyn_startlocation": 690970001,
      "msdyn_generictype": null,
      "msdyn_pooltype": null,
      "_transactioncurrencyid_value": null,
      "stageid": null,
      "overriddencreatedon": null,
      "msdyn_crewstrategy": null,
      "msdyn_bookingstodrip": null,
      "msdyn_hourlyrate": null,
      "importsequencenumber": null,
      "msdyn_latitude": null,
      "_modifiedonbehalfby_value": null,
      "exchangerate": null,
      "msdyn_locationtimestamp": null,
      "utcconversiontimezonecode": null,
      "_msdyn_warehouse_value": null,
      "msdyn_longitude": null,
      "msdyn_hourlyrate_base": null,
      "_createdonbehalfby_value": null,
      "msdyn_internalflags": null,
      "traversedpath": null,
      "msdyn_targetutilization": null,
      "_accountid_value": null,
      "_userid_value": null,
      "_owningteam_value": null,
      "msdyn_primaryemail": null,
      "timezoneruleversionnumber": null
    },
    {
      "@odata.etag": "W/\"4240411\"",
      "statecode": 0,
      "statuscode": 1,
      "msdyn_displayonscheduleboard": true,
      "createdon": "2023-05-02T14:40:25Z",
      "_msdyn_organizationalunit_value": "c16599ef-f3e8-ed11-a7c6-000d3a58268a",
      "_calendarid_value": "e780d181-6d9e-4838-b928-40fb18734cf6",
      "_owningbusinessunit_value": "84a2cc2a-f4e0-ed11-a7c6-000d3a8bcaaa",
      "_ownerid_value": "755de630-f4e0-ed11-a7c6-000d3a8bcaaa",
      "name": "Goofy",
      "versionnumber": 4240411,
      "timezone": 35,
      "msdyn_enableoutlookschedules": 192350001,
      "_contactid_value": "ee2eda66-13d0-eb11-bace-000d3a1be256",
      "bookableresourceid": "4589a345-f7e8-ed11-a7c6-000d3a58268a",
      "msdyn_derivecapacity": false,
      "_modifiedby_value": "755de630-f4e0-ed11-a7c6-000d3a8bcaaa",
      "msdyn_enabledripscheduling": false,
      "msdyn_enabledforfieldservicemobile": false,
      "modifiedon": "2023-05-02T14:40:25Z",
      "msdyn_endlocation": 690970001,
      "_createdby_value": "755de630-f4e0-ed11-a7c6-000d3a8bcaaa",
      "msdyn_displayonscheduleassistant": true,
      "resourcetype": 2,
      "processid": "00000000-0000-0000-0000-000000000000",
      "_owninguser_value": "755de630-f4e0-ed11-a7c6-000d3a8bcaaa",
      "msdyn_timeoffapprovalrequired": false,
      "msdyn_enableappointments": 192350001,
      "msdyn_startlocation": 690970001,
      "msdyn_generictype": null,
      "msdyn_pooltype": null,
      "_transactioncurrencyid_value": null,
      "stageid": null,
      "overriddencreatedon": null,
      "msdyn_crewstrategy": null,
      "msdyn_bookingstodrip": null,
      "msdyn_hourlyrate": null,
      "importsequencenumber": null,
      "msdyn_latitude": null,
      "_modifiedonbehalfby_value": null,
      "exchangerate": null,
      "msdyn_locationtimestamp": null,
      "utcconversiontimezonecode": null,
      "_msdyn_warehouse_value": null,
      "msdyn_longitude": null,
      "msdyn_hourlyrate_base": null,
      "_createdonbehalfby_value": null,
      "msdyn_internalflags": null,
      "traversedpath": null,
      "msdyn_targetutilization": null,
      "_accountid_value": null,
      "_userid_value": null,
      "_owningteam_value": null,
      "msdyn_primaryemail": null,
      "timezoneruleversionnumber": null
    },
    {
      "@odata.etag": "W/\"8406343\"",
      "statecode": 0,
      "statuscode": 1,
      "msdyn_displayonscheduleboard": true,
      "createdon": "2023-04-27T12:49:45Z",
      "_msdyn_organizationalunit_value": "c16599ef-f3e8-ed11-a7c6-000d3a58268a",
      "_calendarid_value": "f595fa70-d58f-42ff-809b-b47c504a1fb4",
      "_owningbusinessunit_value": "84a2cc2a-f4e0-ed11-a7c6-000d3a8bcaaa",
      "_ownerid_value": "755de630-f4e0-ed11-a7c6-000d3a8bcaaa",
      "name": "Buzz Lightyear",
      "versionnumber": 8406343,
      "timezone": 4,
      "msdyn_enableoutlookschedules": 192350001,
      "_contactid_value": null,
      "bookableresourceid": "3dd3bff4-f9e4-ed11-a7c7-000d3a58268a",
      "msdyn_derivecapacity": false,
      "_modifiedby_value": "755de630-f4e0-ed11-a7c6-000d3a8bcaaa",
      "msdyn_enabledripscheduling": false,
      "msdyn_enabledforfieldservicemobile": false,
      "modifiedon": "2023-08-03T15:00:37Z",
      "msdyn_endlocation": 690970001,
      "_createdby_value": "755de630-f4e0-ed11-a7c6-000d3a8bcaaa",
      "msdyn_displayonscheduleassistant": true,
      "resourcetype": 3,
      "processid": null,
      "_owninguser_value": "755de630-f4e0-ed11-a7c6-000d3a8bcaaa",
      "msdyn_timeoffapprovalrequired": false,
      "msdyn_enableappointments": 192350001,
      "msdyn_startlocation": 690970001,
      "msdyn_generictype": null,
      "msdyn_pooltype": null,
      "_transactioncurrencyid_value": null,
      "stageid": null,
      "overriddencreatedon": null,
      "msdyn_crewstrategy": null,
      "msdyn_bookingstodrip": null,
      "msdyn_hourlyrate": null,
      "importsequencenumber": null,
      "msdyn_latitude": null,
      "_modifiedonbehalfby_value": null,
      "exchangerate": null,
      "msdyn_locationtimestamp": null,
      "utcconversiontimezonecode": null,
      "_msdyn_warehouse_value": null,
      "msdyn_longitude": null,
      "msdyn_hourlyrate_base": null,
      "_createdonbehalfby_value": null,
      "msdyn_internalflags": null,
      "traversedpath": null,
      "msdyn_targetutilization": null,
      "_accountid_value": null,
      "_userid_value": "755de630-f4e0-ed11-a7c6-000d3a8bcaaa",
      "_owningteam_value": null,
      "msdyn_primaryemail": null,
      "timezoneruleversionnumber": null
    }
  ]
}
```

Here's an explanation of the key components:

- **`@odata.context`**: This specifies the OData metadata context, indicating the data model and version. In this case, it points to the metadata for bookable resources in Dynamics 365 Field Service.
- **`value`**: This is an array containing the details of individual resources. Each element within this array represents a separate resource (e.g., a vehicle or field service personnel).
  - **`@odata.etag`**: A unique identifier for the resource's current state. It helps in managing concurrency and ensuring data consistency.
  - **`statecode`**: Represents the state of the resource. A value of 0 typically indicates an active state.
  - **`statuscode`**: Indicates the status of the resource. A value of 1 commonly signifies an active status.
  - **`msdyn_displayonscheduleboard`**: Boolean indicating whether the resource should be displayed on the schedule board.
  - **`createdon`**: The timestamp indicating when the resource was created.
  - **`_msdyn_organizationalunit_value`, `_calendarid_value`, `_owningbusinessunit_value`, `_ownerid_value`**: These are unique identifiers referencing other entities within Dynamics 365 Field Service, such as organizational units, calendars, business units, and owners.
  - **`name`**: The name or identifier of the resource (e.g., "Mickey Mouse").
  - **`versionnumber`**: A numerical value representing the version of the resource.
  - **`timezone`**: An integer representing the timezone associated with the resource.
  - **`msdyn_enableoutlookschedules`, `msdyn_enabledripscheduling`, `msdyn_enabledforfieldservicemobile`**: Boolean values indicating specific functionalities enabled for the resource.
  - **`modifiedon`**: The timestamp indicating when the resource was last modified.
  - **`msdyn_endlocation`, `msdyn_startlocation`**: Numeric identifiers representing the end and start locations of the resource.
  - Other fields represent additional details about the resource, such as hourly rates, geographic coordinates, and organizational information.

This response provides a comprehensive set of data about each vehicle, allowing for detailed insights into their characteristics and configurations within the Dynamics 365 Field Service application.

### Step 3: Pull Work Order Records from Dynamic 365

> Note: We have created Mock work orders for this integration guide. A similar logic can be implemented for the real-world use case.

The work order records will be mapped to the jobs or shipments parameter in Nextbillion's Route Optimization API. The work order records are pulled from the Dynamic 365 Field Service application using the GET request.

![documentation image](https://static.nextbillion.io/docs-next/integrations/dynamic-365/dynamic-365-7.webp)

#### API Request

```bash
# Fetch WorkOrders from Dynamic 365 Field Service
curl --location 'https://org83f3f8a8.crm.dynamics.com/api/data/v9.0/msdyn_workorders' \
--header 'Accept-Language: en-US' \
--header 'Authorization: Bearer <access_token>'
```

#### API Response

The following API response contains information about a work order retrieved from the Dynamics 365 CRM system.

```json
{
  "@odata.context": "https://org83f3f8a8.crm.dynamics.com/api/data/v9.0/$metadata#msdyn_workorders",
  "value": [
    {
      "@odata.etag": "W/\"15877688\"",
      "_owningbusinessunit_value": "84a2cc2a-f4e0-ed11-a7c6-000d3a8bcaaa",
      "msdyn_longitude": -82.78538,
      "msdyn_productsservicesestimatedcost": 0,
      "msdyn_name": "00420",
      "msdyn_postalcode": "43004",
      "_msdyn_workordertype_value": "b820133e-c9c1-ea11-a812-000d3a1b14a2",
      "createdon": "2024-01-24T09:32:09Z",
      "msdyn_latitude": 39.99869,
      "msdyn_workordersummary": "Cory Roberts-Rice and Sons",
      "msdyn_productsservicescost_base": 0,
      "statecode": 0,
      "msdyn_timefrompromised": "2024-01-19T14:00:00Z",
      "msdyn_productsservicescost": 0,
      "msdyn_totalamount": 0,
      "msdyn_worklocation": 690970000,
      "msdyn_workorderid": "853b26c8-a4b6-47eb-b085-00d1f4cb4fe3",
      "_msdyn_primaryincidenttype_value": "11d3fb1f-c9c1-ea11-a812-000d3a1b14a2",
      "msdyn_taxable": false,
      "_ownerid_value": "755de630-f4e0-ed11-a7c6-000d3a8bcaaa",
      "msdyn_primaryincidentestimatedduration": 30,
      "modifiedon": "2024-01-25T05:25:52Z",
      "msdyn_stateorprovince": "OH",
      "msdyn_address1": "8239 Crete Lane",
      "_transactioncurrencyid_value": "ec8ba860-5ae1-ed11-a7c6-000d3a8bcaaa",
      "timezoneruleversionnumber": 0,
      "_msdyn_billingaccount_value": "228f3d7d-32e5-ed11-a7c7-000d3a58268a",
      "versionnumber": 15877688,
      "msdyn_totalestimatedaftertaxprice": 0,
      "exchangerate": 1,
      "msdyn_isfollowup": false,
      "msdyn_productsservicesestimatedcost_base": 0,
      "statuscode": 1,
      "_msdyn_serviceaccount_value": "228f3d7d-32e5-ed11-a7c7-000d3a58268a",
      "_modifiedby_value": "80e8b13a-8fd3-4d4e-bb70-ca271e507130",
      "msdyn_followuprequired": false,
      "msdyn_totalsalestax": 0,
      "msdyn_totalestimatedaftertaxprice_base": 0,
      "msdyn_city": "Blacklick",
      "msdyn_totalestimatedduration": 30,
      "msdyn_subtotalamount": 0,
      "msdyn_totalsalestax_base": 0,
      "_createdby_value": "755de630-f4e0-ed11-a7c6-000d3a8bcaaa",
      "processid": "00000000-0000-0000-0000-000000000000",
      "msdyn_timetopromised": "2024-01-19T21:00:00Z",
      "_owninguser_value": "755de630-f4e0-ed11-a7c6-000d3a8bcaaa",
      "msdyn_subtotalamount_base": 0,
      "msdyn_systemstatus": 690970001,
      "msdyn_autonumbering": "00420",
      "msdyn_timewindowstart": "2024-01-19T14:00:00Z",
      "msdyn_totalamount_base": 0,
      "msdyn_ismobile": false,
      "msdyn_timewindowend": "2024-01-19T23:00:00Z",
      "_msdyn_pricelist_value": null,
      "msdyn_childindex": null,
      "_msdyn_customerasset_value": null,
      "msdyn_nottoexceedcostamount_base": null,
      "msdyn_nottoexceedcostamount": null,
      "msdyn_internalflags": null,
      "_msdyn_priority_value": null,
      "_msdyn_parentworkorder_value": null,
      "msdyn_timeclosed": null,
      "_msdyn_primaryresolution_value": null,
      "msdyn_estimatesubtotalamount_base": null,
      "msdyn_country": null,
      "msdyn_costntepercent": null,
      "_msdyn_workorderresolutionkpiid_value": null,
      "msdyn_datewindowstart": null,
      "msdyn_address2": null,
      "_modifiedonbehalfby_value": null,
      "_msdyn_taxcode_value": null,
      "msdyn_bookingsummary": null,
      "importsequencenumber": null,
      "_msdyn_preferredresource_value": null,
      "_msdyn_workhourtemplate_value": null,
      "msdyn_instructions": null,
      "msdyn_followupnote": null,
      "utcconversiontimezonecode": null,
      "_msdyn_timegroupdetailselected_value": null,
      "traversedpath": null,
      "_createdonbehalfby_value": null,
      "_msdyn_timegroup_value": null,
      "msdyn_completedon": null,
      "msdyn_nottoexceedpriceamount": null,
      "_owningteam_value": null,
      "msdyn_phoneNumber": null,
      "_msdyn_substatus_value": null,
      "msdyn_estimatesubtotalamount": null,
      "msdyn_address3": null,
      "_msdyn_closedby_value": null,
      "msdyn_datewindowend": null,
      "_msdyn_supportcontact_value": null,
      "_msdyn_serviceterritory_value": null,
      "_msdyn_workorderarrivaltimekpiid_value": null,
      "overriddencreatedon": null,
      "msdyn_addressname": null,
      "msdyn_primaryincidentdescription": null,
      "_stageid_value": null,
      "_msdyn_servicerequest_value": null,
      "_msdyn_reportedbycontact_value": null,
      "_msdyn_opportunityid_value": null,
      "msdyn_pricentepercent": null,
      "msdyn_firstarrivedon": null,
      "_msdyn_trade_value": null,
      "_msdyn_iotalert_value": null,
      "_msdyn_agreement_value": null,
      "msdyn_mapcontrol": null,
      "msdyn_nottoexceedpriceamount_base": null,
      "_msdyn_functionallocation_value": null
    },
    {
      "@odata.etag": "W/\"15877607\"",
      "_owningbusinessunit_value": "84a2cc2a-f4e0-ed11-a7c6-000d3a8bcaaa",
      "msdyn_longitude": -83.04158,
      "msdyn_productsservicesestimatedcost": 0,
      "msdyn_name": "00396",
      "msdyn_postalcode": "43123",
      "_msdyn_workordertype_value": "b820133e-c9c1-ea11-a812-000d3a1b14a2",
      "createdon": "2024-01-24T09:15:00Z",
      "msdyn_latitude": 39.90562,
      "msdyn_workordersummary": "Geoffrey Hansen-Raynor and Sons",
      "msdyn_productsservicescost_base": 0,
      "statecode": 0,
      "msdyn_timefrompromised": "2023-05-05T14:00:00Z",
      "msdyn_productsservicescost": 0,
      "msdyn_totalamount": 0,
      "msdyn_worklocation": 690970000,
      "msdyn_workorderid": "37a131eb-8d57-4d08-ba1c-019431cd3ecd",
      "_msdyn_primaryincidenttype_value": "11d3fb1f-c9c1-ea11-a812-000d3a1b14a2",
      "msdyn_taxable": false,
      "_ownerid_value": "755de630-f4e0-ed11-a7c6-000d3a8bcaaa",
      "msdyn_primaryincidentestimatedduration": 40,
      "modifiedon": "2024-01-25T05:25:49Z",
      "msdyn_stateorprovince": "OH",
      "msdyn_address1": "1800 Willowside Drive",
      "_transactioncurrencyid_value": "ec8ba860-5ae1-ed11-a7c6-000d3a8bcaaa",
      "timezoneruleversionnumber": 0,
      "_msdyn_billingaccount_value": "228f3d7d-32e5-ed11-a7c7-000d3a58268a",
      "versionnumber": 15877607,
      "msdyn_totalestimatedaftertaxprice": 0,
      "exchangerate": 1,
      "msdyn_isfollowup": false,
      "msdyn_productsservicesestimatedcost_base": 0,
      "statuscode": 1,
      "_msdyn_serviceaccount_value": "228f3d7d-32e5-ed11-a7c7-000d3a58268a",
      "_modifiedby_value": "80e8b13a-8fd3-4d4e-bb70-ca271e507130",
      "msdyn_followuprequired": false,
      "msdyn_totalsalestax": 0,
      "msdyn_totalestimatedaftertaxprice_base": 0,
      "msdyn_city": "Grove City",
      "msdyn_totalestimatedduration": 40,
      "msdyn_subtotalamount": 0,
      "msdyn_totalsalestax_base": 0,
      "_createdby_value": "755de630-f4e0-ed11-a7c6-000d3a8bcaaa",
      "processid": "00000000-0000-0000-0000-000000000000",
      "msdyn_timetopromised": "2023-05-05T21:00:00Z",
      "_owninguser_value": "755de630-f4e0-ed11-a7c6-000d3a8bcaaa",
      "msdyn_subtotalamount_base": 0,
      "msdyn_systemstatus": 690970001,
      "msdyn_autonumbering": "00396",
      "msdyn_timewindowstart": "2023-05-05T14:00:00Z",
      "msdyn_totalamount_base": 0,
      "msdyn_ismobile": false,
      "msdyn_timewindowend": "2023-05-05T23:00:00Z",
      "_msdyn_pricelist_value": null,
      "msdyn_childindex": null,
      "_msdyn_customerasset_value": null,
      "msdyn_nottoexceedcostamount_base": null,
      "msdyn_nottoexceedcostamount": null,
      "msdyn_internalflags": null,
      "_msdyn_priority_value": null,
      "_msdyn_parentworkorder_value": null,
      "msdyn_timeclosed": null,
      "_msdyn_primaryresolution_value": null,
      "msdyn_estimatesubtotalamount_base": null,
      "msdyn_country": null,
      "msdyn_costntepercent": null,
      "_msdyn_workorderresolutionkpiid_value": null,
      "msdyn_datewindowstart": null,
      "msdyn_address2": null,
      "_modifiedonbehalfby_value": null,
      "_msdyn_taxcode_value": null,
      "msdyn_bookingsummary": null,
      "importsequencenumber": null,
      "_msdyn_preferredresource_value": null,
      "_msdyn_workhourtemplate_value": null,
      "msdyn_instructions": null,
      "msdyn_followupnote": null,
      "utcconversiontimezonecode": null,
      "_msdyn_timegroupdetailselected_value": null,
      "traversedpath": null,
      "_createdonbehalfby_value": null,
      "_msdyn_timegroup_value": null,
      "msdyn_completedon": null,
      "msdyn_nottoexceedpriceamount": null,
      "_owningteam_value": null,
      "msdyn_phoneNumber": null,
      "_msdyn_substatus_value": null,
      "msdyn_estimatesubtotalamount": null,
      "msdyn_address3": null,
      "_msdyn_closedby_value": null,
      "msdyn_datewindowend": null,
      "_msdyn_supportcontact_value": null,
      "_msdyn_serviceterritory_value": null,
      "_msdyn_workorderarrivaltimekpiid_value": null,
      "overriddencreatedon": null,
      "msdyn_addressname": null,
      "msdyn_primaryincidentdescription": null,
      "_stageid_value": null,
      "_msdyn_servicerequest_value": null,
      "_msdyn_reportedbycontact_value": null,
      "_msdyn_opportunityid_value": null,
      "msdyn_pricentepercent": null,
      "msdyn_firstarrivedon": null,
      "_msdyn_trade_value": null,
      "_msdyn_iotalert_value": null,
      "_msdyn_agreement_value": null,
      "msdyn_mapcontrol": null,
      "msdyn_nottoexceedpriceamount_base": null,
      "_msdyn_functionallocation_value": null
    },
    {
      "@odata.etag": "W/\"16106529\"",
      "_owningbusinessunit_value": "84a2cc2a-f4e0-ed11-a7c6-000d3a8bcaaa",
      "msdyn_longitude": -83.08326,
      "msdyn_productsservicesestimatedcost": 0,
      "msdyn_name": "00439",
      "msdyn_postalcode": "43220",
      "_msdyn_workordertype_value": "b820133e-c9c1-ea11-a812-000d3a1b14a2",
      "createdon": "2024-02-06T03:41:49Z",
      "msdyn_latitude": 40.04506,
      "msdyn_workordersummary": "Kylee Beer-Borer LLC",
      "msdyn_productsservicescost_base": 0,
      "statecode": 0,
      "msdyn_timefrompromised": "2024-01-19T14:00:00Z",
      "msdyn_productsservicescost": 0,
      "msdyn_totalamount": 0,
      "msdyn_worklocation": 690970000,
      "msdyn_workorderid": "89cb91f8-5e87-4734-9387-ff307f0e9cd5",
      "_msdyn_primaryincidenttype_value": "11d3fb1f-c9c1-ea11-a812-000d3a1b14a2",
      "msdyn_taxable": false,
      "_ownerid_value": "755de630-f4e0-ed11-a7c6-000d3a8bcaaa",
      "msdyn_primaryincidentestimatedduration": 30,
      "modifiedon": "2024-02-06T03:41:55Z",
      "msdyn_stateorprovince": "OH",
      "msdyn_address1": "2458 Wimbledon Road",
      "_transactioncurrencyid_value": "ec8ba860-5ae1-ed11-a7c6-000d3a8bcaaa",
      "timezoneruleversionnumber": 0,
      "_msdyn_billingaccount_value": "228f3d7d-32e5-ed11-a7c7-000d3a58268a",
      "versionnumber": 16106529,
      "msdyn_totalestimatedaftertaxprice": 0,
      "exchangerate": 1,
      "msdyn_isfollowup": false,
      "msdyn_productsservicesestimatedcost_base": 0,
      "statuscode": 1,
      "_msdyn_serviceaccount_value": "228f3d7d-32e5-ed11-a7c7-000d3a58268a",
      "_modifiedby_value": "80e8b13a-8fd3-4d4e-bb70-ca271e507130",
      "msdyn_followuprequired": false,
      "msdyn_totalsalestax": 0,
      "msdyn_totalestimatedaftertaxprice_base": 0,
      "msdyn_city": "Columbus",
      "msdyn_totalestimatedduration": 30,
      "msdyn_subtotalamount": 0,
      "msdyn_totalsalestax_base": 0,
      "_createdby_value": "755de630-f4e0-ed11-a7c6-000d3a8bcaaa",
      "processid": "00000000-0000-0000-0000-000000000000",
      "msdyn_timetopromised": "2024-01-19T21:00:00Z",
      "_owninguser_value": "755de630-f4e0-ed11-a7c6-000d3a8bcaaa",
      "msdyn_subtotalamount_base": 0,
      "msdyn_systemstatus": 690970000,
      "msdyn_autonumbering": "00439",
      "msdyn_timewindowstart": "2024-01-19T14:00:00Z",
      "msdyn_totalamount_base": 0,
      "msdyn_ismobile": false,
      "msdyn_timewindowend": "2024-01-19T23:00:00Z",
      "_msdyn_pricelist_value": null,
      "msdyn_childindex": null,
      "_msdyn_customerasset_value": null,
      "msdyn_nottoexceedcostamount_base": null,
      "msdyn_nottoexceedcostamount": null,
      "msdyn_internalflags": null,
      "_msdyn_priority_value": null,
      "_msdyn_parentworkorder_value": null,
      "msdyn_timeclosed": null,
      "_msdyn_primaryresolution_value": null,
      "msdyn_estimatesubtotalamount_base": null,
      "msdyn_country": null,
      "msdyn_costntepercent": null,
      "_msdyn_workorderresolutionkpiid_value": null,
      "msdyn_datewindowstart": null,
      "msdyn_address2": null,
      "_modifiedonbehalfby_value": null,
      "_msdyn_taxcode_value": null,
      "msdyn_bookingsummary": null,
      "importsequencenumber": null,
      "_msdyn_preferredresource_value": null,
      "_msdyn_workhourtemplate_value": null,
      "msdyn_instructions": null,
      "msdyn_followupnote": null,
      "utcconversiontimezonecode": null,
      "_msdyn_timegroupdetailselected_value": null,
      "traversedpath": null,
      "_createdonbehalfby_value": null,
      "_msdyn_timegroup_value": null,
      "msdyn_completedon": null,
      "msdyn_nottoexceedpriceamount": null,
      "_owningteam_value": null,
      "msdyn_phoneNumber": null,
      "_msdyn_substatus_value": null,
      "msdyn_estimatesubtotalamount": null,
      "msdyn_address3": null,
      "_msdyn_closedby_value": null,
      "msdyn_datewindowend": null,
      "_msdyn_supportcontact_value": null,
      "_msdyn_serviceterritory_value": null,
      "_msdyn_workorderarrivaltimekpiid_value": null,
      "overriddencreatedon": null,
      "msdyn_addressname": null,
      "msdyn_primaryincidentdescription": null,
      "_stageid_value": null,
      "_msdyn_servicerequest_value": null,
      "_msdyn_reportedbycontact_value": null,
      "_msdyn_opportunityid_value": null,
      "msdyn_pricentepercent": null,
      "msdyn_firstarrivedon": null,
      "_msdyn_trade_value": null,
      "_msdyn_iotalert_value": null,
      "_msdyn_agreement_value": null,
      "msdyn_mapcontrol": null,
      "msdyn_nottoexceedpriceamount_base": null,
      "_msdyn_functionallocation_value": null
    }
  ]
}
```

Here's a breakdown of the key fields and their meanings:

- **@odata.context**: Specifies the metadata URL of the Dynamics 365 CRM entity for work orders.
- **value**: An array containing the details of individual work orders. In this case, it includes information about a single work order.
- **@odata.etag**: Represents the entity tag for optimistic concurrency control. It's a unique identifier associated with the current state of the entity.
- **msdyn_name**: The name or title of the work order, in this case, "00420".
- **createdon**: The timestamp indicating when the work order was created.
- **msdyn_workordersummary**: A brief summary or description of the work order, often used for reference purposes.
- **msdyn_timefrompromised**: The promised start time for the work order.
- **msdyn_totalamount**: The total amount associated with the work order, typically reflecting the cost or value of the services.
- **msdyn_worklocation**: An identifier representing the location of the work, such as an address or geographical coordinates.
- **msdyn_timewindowstart/msdyn_timewindowend**: The start and end times of the time window during which the work needs to be completed.
- **msdyn_city/msdyn_stateorprovince/msdyn_postalcode**: Address details specifying the city, state/province, and postal code associated with the work order location.
- **statuscode**: Indicates the current status of the work order.
- **modifiedon**: Timestamp indicating the last modification time of the work order.
- **msdyn_longitude/msdyn_latitude**: Geographical coordinates specifying the longitude and latitude of the work order location.
- **msdyn\_...**: Various other fields providing additional details about the work order, such as billing information, priority, resolution details, and more.

Overall, this API response provides comprehensive information about a specific work order, including its details, status, location, and associated metadata.

### Step 4: Data Preparation and Mapping with Route Optimization API

- After successfully pulling data from Dynamics 365 Field Service, integrate the fetched data with Route Optimization API.
- Use the provided API endpoint to map the data to respective API parameters.
- Configure optimization settings, including shift start and end times, service time, and start and end location coordinates.

```js
if (localStorage.values.apiKey == "") {
  txtApiKey.setValue("**ENTER API KEY HERE**");
  return;
}
let vehicles = [];
let shifts = [];
let starts = [];
let ends = [];
let veh_attr = [];
let stop_attr = [];
let shiftStart = new Date(dtShiftStart.value).getTime() / 1000;
let shiftEnd = new Date(dtShiftEnd.value).getTime() / 1000;

// START NBAI PROBLEM BUILD
let locations = [];
let jobs = [];
vehicles = [];
veh_attr = [];
stop_attr = [];
// sequence through all stops and create job array while
// also creating the indexed list of locations
let location_index = 0;
let location = [];
let id = 1;

table3.selectedRows.forEach((planstop) => {
  let job = {
    id: id++,
    description: planstop.msdyn_workorderid,
    location_index: location_index++,
    service: planstop.msdyn_totalestimatedduration * 60,
    priority: 0,
    time_windows: [[shiftStart, shiftEnd]],
  };
  location.push(`${planstop.msdyn_latitude},${planstop.msdyn_longitude}`);

  jobs.push(job);
});

// Add shift start/stop location to location index
location.push(`${txtVehicleStartPosition.value}`);
location_index += 1;
location.push(`${txtVehicleEndPosition.value}`);
let vehicle_id = 1;
table4.selectedRows.forEach((v) => {
  let vehicle = {
    id: vehicle_id++,
    description: v.bookableresourceid,
    start_index: location_index,
    end_index: location_index,
    time_window: [shiftStart, shiftEnd],
    max_tasks: 25,
  };
  vehicles.push(vehicle);
});

locations = {
  id: 12,
  description: "NB.AI D365 DEMO",
  location: location,
};

let options = {
  routing: {
    mode: "4w",
  },
};

localStorage.setValue("vehiclesNBAI", vehicles);
localStorage.setValue("jobsNBAI", jobs);
localStorage.setValue("locationsNBAI", locations);
localStorage.setValue("nbaiVRPResult", null);
localStorage.setValue("nbaiOptions", options);
let vrpProblemNBAI = {
  locations: localStorage.values.locationsNBAI,
  jobs: localStorage.values.jobsNBAI,
  vehicles: localStorage.values.vehiclesNBAI,
  departure_time: 0,
};
localStorage.setValue("vrpProblemNBAI", vrpProblemNBAI);

nbaiOptimizationRun.trigger();
```

### Step 5: Create Optimization Job

In this step, the mapped data is sent to Route Optimization API to create an optimization job and response confirms the job creation and returns a unique job `id`.

#### API Request

The following cURL command sends a POST request to the Route Optimization API to create an optimization job.

```bash
curl --request POST \
    --url https://api.nextbillion.io/optimization/v2?key={{localStorage.values.apiKey}}
```

#### API Response

The following API response confirms the creation of optimization job.

```json
{
  "id": "26df14ca9575f2158a1235eef1022d79",
  "message": "Optimization job created",
  "status": "Ok"
}
```

### Step 6: Retrieve Optimized Route Result

Retrieve the optimized route result by making a GET request to the NextBillion.ai Route Optimization API with the job ID and API key.

#### API Request

```bash
https://api.nextbillion.io/optimization/v2/result?id={{nbaiOptimizationRun.data.id}}&key={{localStorage.values.apiKey}}
```

#### API Response

```json
{
  "result": {
    "code": 0,
    "summary": {
      "cost": 2102,
      "routes": 1,
      "unassigned": 0,
      "setup": 0,
      "service": 2400,
      "duration": 2102,
      "waiting_time": 0,
      "priority": 0,
      "distance": 39345
    },
    "routes": [
      {
        "vehicle": 1,
        "cost": 2102,
        "steps": [
          {
            "type": "start",
            "arrival": 1706149800,
            "duration": 0,
            "service": 0,
            "waiting_time": 0,
            "location": [39.98284, -83.1326],
            "location_index": 2,
            "distance": 0
          },
          {
            "type": "job",
            "arrival": 1706150858,
            "duration": 1058,
            "service": 2400,
            "waiting_time": 0,
            "location": [39.90562, -83.04158],
            "location_index": 0,
            "id": 1,
            "description": "37a131eb-8d57-4d08-ba1c-019431cd3ecd",
            "distance": 19145,
            "long_id": "1"
          },
          {
            "type": "end",
            "arrival": 1706154302,
            "duration": 2102,
            "service": 0,
            "waiting_time": 0,
            "location": [39.98284, -83.1326],
            "location_index": 2,
            "distance": 39345
          }
        ],
        "service": 2400,
        "duration": 2102,
        "waiting_time": 0,
        "priority": 0,
        "distance": 39345,
        "geometry": "_d`sFxykzNH|@Ht@BTH|@JjALfA?DJ`AFn@BVJdAFh@JnAFt@Bf@LzAJl@LxABPB\\Fl@Ft@F~@Dx@Bx@?D@X?^?HA\\AZM|BC^EXM|AEd@UhCE`@EpACj@Aj@@j@Bv@HdAFr@BZN`BCLFl@LdADn@D^Hp@Dx@?@L|A`@zDFp@@NFj@Fl@Dp@HdAB\\Bf@HN@TBPFhC?P?NdAA\\A~@EbBKz@Ef@Gj@Ef@AL?JAH?BAbAElBKnAIL?FAZ@P@R?h@?n@@d@BXDVFPHPHLLLNJRHRDTDTBT?T?TCVCTGTIPKPKNGFEDOHOFQDQ@O?QCQEMEOKMMKOKSISEUEUC[Ae@?kD?I?c@AkCHuGOyB@eB@wABuB@oA@cA@_B@w@?o@FgH@qADiF@{@?M@cA?aABmB@kBBkBBkB?}@@gA?a@@u@@iC?y@@kA@sA?{@@aA?aA@u@BsC?cA@u@BkB?O@wA?sC@kA@i@@]?_@BwA?C?G?I?I@G?G?K?W@g@?...",
        "description": "d77417ff-f4e8-ed11-a7c6-000d3a58268a",
        "long_vehicle_id": "1"
      }
    ]
  },
  "status": "Ok",
  "message": ""
}
```

## Visualize Routes using Nextbillion.ai's Route Planner Tool

Explore and analyse optimized routes effortlessly using NextBillion.ai's Route Planner Tool. This tool is accessible through NextBillion.ai's Cloud Console (NCC), providing a user-friendly interface for visualising, reviewing, and fine-tuning routes generated by the optimization process. Seamlessly navigate through the routes, gaining valuable insights into the geographical distribution and efficiency of planned tasks. Leverage the Route Planner Tool within NCC to enhance route visualisation and optimize your field service operations with ease.

The following image showcases the optimized routes within the Route Planner Tool interface.

![documentation image](https://static.nextbillion.io/docs-next/integrations/dynamic-365/dynamic-365-8.webp)

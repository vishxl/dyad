# Samsara-Fleet Hub Integration

This integration document will walk you through the steps of integrating Samsara telematics with NextBillion.ai’s Fleet Hub, accessible via [NextBillion.ai’s Cloud Console](https://console.nextbillion.ai/).

## Prerequisites

Before proceeding with the integration, ensure that you have the following prerequisites in place:

1. Access to a Samsara Account
2. Access to NextBillion.ai’s Cloud Console

## Setting up the Connection

To establish the connection between Samsara and NextBillion.ai, follow these steps:

1. Sign in to the NCC using your NextBillion.ai credentials.
2. From the NCC homepage, open the left navigation pane.
3. Select **Fleet Hub**, then choose **Integrations** under the **Setup** section.
4. On the **Telematics Integration** page, select **Add New Connection**.
5. - **Connection name:** Enter a descriptive name for the integration.
6. - **Choose a service from the list:** Select Samsara from the dropdown menu.
7. - Select the _Data Residency Region_ of your choice
8. - **API key:** Enter your Samsara API key.
9. Select **Save** to complete the setup

![documentation image](https://static.nextbillion.io/docs-next/integrations/samsara/fleet-integration-v3-01.webp)

> If Fleet Hub is not enabled for you, please contact support@nextbillion.ai for assistance.

## Upload Address and Vehicle Data

After setting up the connection, upload your address and vehicle data to the NextBillion.ai Cloud Console (NCC) by following these steps.

### Import Address Data

1. In the left navigation pane, select **Addresses** under the **Data** section.
2. On the **Addresses** page, select **Import Data** in the upper-right corner.
3. In the **From Connections** dropdown, select the Samsara connection you created during setup.

![documentation image](https://static.nextbillion.io/docs-next/integrations/samsara/fleet-integration-v3-02.webp)

1. In the **Import Addresses** dialog box, configure the following options:

- **Fetch all:** Select this checkbox to import all available addresses.
- **Created after:** Optionally, specify a date and time to import only addresses created after that timestamp.

2. Select **Import** to begin the import process. NCC will fetch and display address data from your Samsara account.

![documentation image](https://static.nextbillion.io/docs-next/integrations/samsara/fleet-integration-v3-03.webp)

You have successfully set up the connection between your Samsara account and NextBillion.ai’s Fleet Hub.

### Import Vehicle Data

1. In the left navigation pane, select **Vehicles** under the **Data** section.
2. On the **Vehicles** page, select **Import Data** in the upper-right corner.
3. In the **From Connections** dropdown, select the Samsara connection you created during setup. NCC will automatically fetch and update all vehicle data from your Samsara account.

![documentation image](https://static.nextbillion.io/docs-next/integrations/samsara/fleet-integration-v3-04.webp)

## Use Route Planner to Generate Optimized Routes

Once address and vehicle data are imported, head to **Route Planner** app in the left navigation pane. On the Route Planner page, follow the instructions for each page below, to generate optimized routes:

### Set Preferences Tab

1. Choose your preferred configuration.
2. Go on to select / configure different preferences like - objectives, constraints, grouping rules, depots, task relations and routing configurations, time-zones etc.
3. The last option on the **Set Preferences Tab** relates to sharing the optimized solution to external integrations. Select the Samsara connection configured previously and click “Next”.

![documentation image](https://static.nextbillion.io/docs-next/integrations/samsara/fleet-integration-v3-05.webp)

### Add Orders Tab

1. Use _Other ways to upload > Add from Addresses_ to fetch addresses from Samsara.
2. From the **Select from Addresses** page, choose to upload either Individual or Groups addresses.
3. Click ‘Upload’.

![documentation image](https://static.nextbillion.io/docs-next/integrations/samsara/fleet-integration-v3-06.webp)

4. Map the Optimization attributes to match the uploaded data fields, then click ‘Next’.

> Please note that **Stop Address** is a mandatory attribute and must be mapped to each of the uploaded Orders (along with other optional attributes). Refer to [Order Metadata](#order-metadata) section, to send the required information to Samsara when using the “Input JSON” method for configuring orders.

### Add Vehicles Tab

1. Use _Other ways to upload > Add from Vehicles_ to fetch addresses from Samsara.
2. From the Select from **Vehicles** page, choose to upload either _Individual_ or _Groups_ addresses.
3. Click ‘Upload’.

![documentation image](https://static.nextbillion.io/docs-next/integrations/samsara/fleet-integration-v3-07.webp)

4. Map the VRP attributes and click ‘Next’ to finalize the setup.

> Please note that **Route Name** is a mandatory attribute and must be mapped to each of the uploaded Vehicles. Refer to [Vehicle Metadata](#vehicle-metadata) section, to send the required information to Samsara when using the “Input JSON” method for configuring vehicles.

Once vehicles are uploaded, on the preview screen:

1. Verify the tasks, vehicles and preferences configured.
2. Click ‘Generate Route’ to execute and visualise optimized routes on the map.

## Sharing Routes from Route Planner to Samsara

To share routes from Route Planner to Samsara, proceed as follows:

1. On the “Solution” screen, view the optimized routes in Route Planner.
2. Select the Samsara connection from the _Share > Dispatch To Connection_ dropdown.

![documentation image](https://static.nextbillion.io/docs-next/integrations/samsara/fleet-integration-v3-08.webp)

This action will send the routes to the Samsara dashboard, where they will be assigned accordingly.

![documentation image](https://static.nextbillion.io/docs-next/integrations/samsara/fleet-integration-v3-09.webp)

![documentation image](https://static.nextbillion.io/docs-next/integrations/samsara/fleet-integration-v3-10.webp)

## Configure Metadata for JSON Input

When using the Input JSON method to configure order and vehicle inputs for optimization, we need to provide an additional `metadata` attribute for each of Orders and Vehicles to meet Samsara’s requirements of mandatory fields.

### Order Metadata

Add a “metadata” attribute for each job or shipment to specify any custom data that should be attached along with its fulfillment details in the “steps” attribute of the optimized solution. Please note that the metadata content must always be specified in a “key : value” pair format, where the "key" is always a string.

Users can leverage this property to provide additional details/context when sharing information about the Order external systems.In order to relay the information for specific fields in Samsara - “name”, “address”, and “notes” - we recommend users to add these fields in `metadata` attribute exactly like the below sample:

#### Example Jobs JSON

```json
{
  "jobs": [
    {
      "id": "Job 1",
      "description": "Delivery Job in Chicago",
      "location_index": 0,
      "delivery": [10],
      "priority": 2,
      "metadata": {
        "name": "John",
        "address": "205 N. Michigan Ave, Suite 810, Chicago, IL 60601",
        "notes": "9177940839"
      }
    }
  ]
}
```

#### Example Shipments JSON

```json
{
  "shipments": [
    {
      "pickup": {
        "id": "Pickup 1",
        "location_index": 6,
        "metadata": {
          "name": "John",
          "address": "Bridgeport, Chicago",
          "notes": "Find package near porch"
        }
      },
      "delivery": {
        "id": "Delivery 1",
        "location_index": 7,
        "metadata": {
          "name": "Jake",
          "address": "Kenwood, Chicago",
          "notes": "Place the package near porch"
        }
      },
      "amount": [5],
      "skills": [2],
      "priority": 1
    }
  ]
}
```

### Vehicle Metadata

Add a “metadata” attribute for each vehicle to specify any custom vehicle data that should be attached along in the “routes” attribute of the optimized solution. Please note that the metadata content must always be specified in a “key : value” pair format, where the "key" is always a string.

Users can leverage this property to provide additional details/context when sharing vehicle information with integrated systems (TMS, Fleet Management, Driver dispatch etc). Following is a sample vehicle configuration using the metadata attribute:

#### Example Vehicles JSON

```json
{
  "vehicles": [
    {
      "id": "Vehicle 1",
      "costs": {
        "fixed": 300
      },
      "metadata": {
        "id": "New Trip",
        "name": "Tim",
        "address": "1234, Elm Street, Los Angeles, CA 90001"
      },
      "capacity": [50],
      "time_window": [1715778715, 1715793115],
      "skills": [2, 3]
    }
  ]
}
```

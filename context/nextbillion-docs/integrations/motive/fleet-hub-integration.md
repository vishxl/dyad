# Motive-Fleet Hub Integration

This integration document will walk you through the steps of integrating Motive telematics with NextBillion.ai’s Fleet Hub, accessible via [NextBillion.ai’s Cloud Console](https://console.nextbillion.ai/).

## Prerequisites

Before proceeding with the integration, ensure that you have the following prerequisites in place:

1.  Access to a Motive Account and API Key
2.  Access to a NextBillion.ai’s Cloud Console

## Set Up a Connection

To set up a connection between Motive and the NextBillion.ai Cloud Console (NCC), follow these steps:

1.  Sign in to the NCC using your NextBillion.ai credentials.
2.  From the NCC homepage, open the left navigation pane.
3.  Select **Fleet Hub**, then choose **Integrations** under the **Setup** section.
4.  On the **Telematics Integration** page, select **Add New Connection**.
5.  In the **Add New Connection** dialog box, enter the following information:
    - **Connection name**: Enter a descriptive name for the integration.
    - **Choose a service from the list**: Select **Motive** from the dropdown menu.
    - **API key**: Enter your Motive API key.

6.  Select **Save** to complete the setup.

![documentation image](https://static.nextbillion.io/docs-next/integrations/motive/fleet-hub-integration-4.webp)

## Upload Address and Vehicle Data

After setting up the connection, upload your address and vehicle data to the NextBillion.ai Cloud Console (NCC) by following these steps.

### Upload Address Data

- In the left navigation pane, select **Addresses** under the **Data** section.
- On the **Addresses** page, select **Import Data** in the upper-right corner.
- In the **From Connections** dropdown, select the connection you created during setup.

  ![documentation image](https://static.nextbillion.io/docs-next/integrations/motive/fleet-hub-integration-9.webp)

- In the **Import Addresses** dialog box, configure the following options:
  - **Fetch all**: Select this checkbox to import all available addresses.
  - **Created after**: Optionally, specify a date and time to import only addresses created after that timestamp.

- Select **Import** to begin the import process.  
  NCC will fetch and display address data from your Motive account.

### Import Vehicle Data

![documentation image](https://static.nextbillion.io/docs-next/integrations/motive/fleet-hub-integration-6.webp)

- In the left navigation pane, select **Vehicles** under the **Data** section.
- On the **Vehicles** page, select **Import Data** in the upper-right corner.
- In the **From Connections** dropdown, select the connection you created during setup.  
  NCC will automatically fetch and update all vehicle data from your Motive account.

Use Route Planner to Generate Optimized Routes

Once address and vehicle data are imported, follow the steps below to generate optimized routes:

1.  Open the **‘Route Planner’** app from the left toolbar.
2.  Click **‘Start’** on the input screen.

![documentation image](https://static.nextbillion.io/docs-next/integrations/motive/fleet-hub-integration-7.webp)

#### Configure Tab

- Select the **API type**: Fast or Flexible.
- Choose your **Motive connection** from the **‘Select Connection’** dropdown.

![documentation image](https://static.nextbillion.io/docs-next/integrations/motive/fleet-hub-integration-8.webp)

#### Jobs Tab

- Use ‘Select Addresses’ to fetch addresses from Motive.
- Choose the addresses you want to include and click ‘Upload’.
- Map the VRP attributes to match the uploaded data fields, then click ‘Next’.

![documentation image](https://static.nextbillion.io/docs-next/integrations/motive/fleet-hub-integration-3.webp)

#### Shipments and Depots Tab

Upload shipments and depot data as required or click ‘Skip’ if not needed.

#### Vehicles Tab

- Use ‘Select Vehicles’ to fetch vehicle data from Motive.

![documentation image](https://static.nextbillion.io/docs-next/integrations/motive/fleet-hub-integration-2.webp)

- Select the vehicles you want to use and click ‘Upload’.

![documentation image](https://static.nextbillion.io/docs-next/integrations/motive/fleet-hub-integration-5.webp)

- Map the VRP attributes and click ‘Next’.

![documentation image](https://static.nextbillion.io/docs-next/integrations/motive/fleet-hub-integration-10.webp)

#### Options Tab

Configure additional parameters such as:

**Constraints**: Max vehicle overtime, max lateness, max waiting time.

**Objective**: Minimize travel cost (distance/duration) or set a custom optimization goal.

**Routing Mode**: Select **Car or Truck** and specify a **Traffic Timestamp**.

Click **‘Finish Import’** to finalize the setup.

#### Generate Optimized Routes

- Click **‘Compile’** to visualize routes on the map.
- Click **‘Run’** to execute the route planner and generate optimized routes.

![documentation image](https://static.nextbillion.io/docs-next/integrations/motive/fleet-hub-integration-1.webp)

## Dispatch Routes to Motive

Once you have the optimized routes, send them back to Motive:

1.  Click the **‘Share’** button and select ‘Dispatch to Connection.’
2.  Choose the Motive telematics connection you saved earlier in Fleet Hub.

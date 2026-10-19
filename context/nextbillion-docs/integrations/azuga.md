# Azuga Telematics Integration with Route Optimization API

## Overview

This document outlines how to integrate **Azuga**, a telematics and fleet management platform, with **NextBillion.ai’s Route Optimization API**. The integration leverages **n8n** as the orchestration layer to automate data flow and optimize vehicle routes using real-time data from Azuga.

## Prerequisites

Before starting the integration, ensure you have the following:

- **Azuga API Credentials:** You will need valid Azuga credentials, including a Client ID Client Secret and an Access Token. Access your [Azuga account](https://fleet.azuga.com/login) to retrieve your credentials.
- **Your NextBillion.ai API Key.** If you don't have one, contact [NextBillion.ai](http://NextBillion.ai) and get it now.
- An [n8n account](https://n8n.io/) to create and execute workflows.

## Integration Steps

The integration and data flow between Azuga and NextBillion.ai is managed using an n8n workflow that performs the following:

- Retrieves vehicle and job data from Azuga
- Modify the data formats and map it to the right properties of NextBillion.ai Route Optimization.
- Submit a request to NextBillion.ai’s Route Optimization API
- Polls for job completion and retrieves the Route Optimization solution
- Stores results in a Google Sheet or downstream system

### Step 1: Define Input Parameters

To start with, set up input nodes in n8n to define parameters such as region, time window, and vehicle type.

![Define parameters for the n8n workflow](https://static.nextbillion.io/docs-next/integrations/azug-1.webp)

_Define parameters for the n8n workflow_

### Step 2: Authenticate with Azuga

Use Azuga's OAuth or token-based authentication:

```bash
POST https://auth.azuga.com/azuga-as/oauth2/login/oauthtoken.json
```

### Step 3: Fetch required data from Azuga

Pull the latest location of desired vehicles from Azuga using the following endpoint:

```bash
POST https://services.azuga.com/azuga-ws-oauth/v3/vehicles/latestlocation
```

Refer to the [Azuga documentation](https://developer.azuga.com/reference/latest-location) for detailed information on features and supported properties for obtaining the most recent vehicle locations.

Users can also pull the geofence data that they maintain using Azuga with the help of following endpoint:

```bash
POST https://services.azuga.com/azuga-ws-oauth/v3/geomarks.json
```

Refer to the [Azuga documentation](https://developer.azuga.com/reference/view-geofences) for detailed information on features and supported properties for obtaining desired geofences.

### Step 4: Modify, Merge and Map Data Fields

Combine job and vehicle data into NextBillion-compatible format including:

- `jobs`
- `vehicles`
- `options`
- `locations`

Refer to the [Route Optimization API](https://docs.nextbillion.ai/optimization/route-optimization-api) documentation to learn more about the expected data formats for creating [NextBillion.ai](http://NextBillion.ai) Route Optimization jobs.

### Step 5: Submit a request to NextBillion.ai Route Optimization

Use the n8n workflow to submit a request to NextBillion.ai’s Route Optimization API and create optimization jobs based on certain parameters.

```bash
POST https://api.nextbillion.io/optimization/v2?key=<API_KEY>
```

Use the response from the POST endpoint above to retrieve the unique ID of the job submitted.

### Step 6: Retrieved Optimized Route Result

Use a loop or timed delay in n8n to check for job status for the unique ID obtained in the previous step:

```bash
GET https://api.nextbillion.io/optimization/v2/result?id=<request_id>&key=<API_KEY>
```

### Step 7: Store or Visualize Results

Store the optimized results into a Google Sheet or render them via the [Route Planner Tool](https://console.nextbillion.ai/route-planner) in [NextBillion.ai Cloud Console](https://console.nextbillion.ai/).

> Planned routes will be pushed into the Azuga Fleet Management platform and Driver Applications once support is available in the Azuga platform.

## Benefits

- **Real-time Optimization** using current Azuga telematics data
- **Low-Code Automation** using n8n
- **Customizable Logic** for filtering, mapping, and scheduling

## Resources

- [NextBillion.ai Route Optimization API Docs](https://docs.nextbillion.ai/optimization/route-optimization-flexible-api)
- [Azuga Developer Documentation](https://www.azuga.com/)
- n8n Workflow Hub

For questions or implementation support, please contact your solutions engineering team or [support@nextbillion.ai](mailto:support@nextbillion.ai).

# Integration of ServiceNow Field Service Management Software and NB.ai’s Route Optimization API

## Introduction

ServiceNow® Field Service Management (FSM) stands out as a comprehensive solution in the constantly evolving landscape of service management, streamlining operations and fostering collaboration. ServiceNow's FSM, a single-platform powerhouse, improves scheduling and dispatching efficiency, optimizes workforce management, empowers field service teams, and elevates service delivery. FSM caters to a wide range of organizational needs, from integrated service to a robust partner ecosystem, self-service capabilities, territory planning, and project management.

NextBillion.ai's Route Optimization API is a powerful tool designed to revolutionize business route planning. The API ensures optimal route selection for fleets by taking into account factors such as time windows, capacity, and vehicle availability when addressing the Single and/or Multi-Vehicle Routing Problem (VRP).

NextBillion.ai's API, which consists of two key components - input data and the optimization engine - integrates seamlessly with ServiceNow's FSM. The input data contains relevant information about jobs, vehicles, and shipments. Using this data, the optimization engine determines the most efficient routes while taking into account complex constraints and variables.

This document will provide a step-by-step guide as we dive into the integration details, ensuring a seamless integration of ServiceNow's FSM and NextBillion.ai's Route Optimization API. Organizations can achieve unparalleled efficiency, time savings, and cost reductions in their field service operations by combining the strengths of these two powerful tools.

## Prerequisites

The following prerequisites are mandatory requirements to ensure seamless integration between ServiceNow and NextBillion.ai.

1.  ServiceNow account with ServiceNow instance
2.  NextBillion.ai's API key: It is necessary to authenticate the API requests sent to the Route Optimization API.

These prerequisites lay the foundation for successful integration, facilitating the smooth exchange of data and functionalities between the two systems.

## Integration Steps

This section outlines the integration steps for incorporating ServiceNow records into NextBillion's Route Optimization API using the Retool development suite, generating optimized routes by triggering Route Optimization API and visualizing the result using Optimization Tester.

### Step 1: Setup Field Service Management Software

**1\. Create a ServiceNow Account**

Establish a ServiceNow account to initiate the integration process.

**2\. Set up Field Service**

- Navigate to `All` ➝ `Field Service` ➝ `Administration` ➝ `Guided Setup` within your ServiceNow account.
- Follow the guided setup to configure the database and populate relevant data records (e.g., user groups, field technicians, dispatchers, work order tasks).

![documentation image](https://static.nextbillion.io/docs-next/integrations/service-now/service-now-1.webp)

**3\. User Authentication**

- During guided setup, create a user with a specific user ID and password credentials.
- Record the username and password as they serve for authentication in REST API calls outside the ServiceNow instance.

**4\. User Management**

- In ServiceNow, locate `Users` under `All` ➝ `Organization` ➝ `Users`.
- Create a new user, assign a user ID, set a password, and assign necessary user roles (e.g., admin roles for comprehensive data access).

![documentation image](https://static.nextbillion.io/docs-next/integrations/service-now/service-now-2.webp)

**5\. API Connection Testing**

Verify API connectivity using Postman to ensure seamless integration.

![documentation image](https://static.nextbillion.io/docs-next/integrations/service-now/service-now-3.webp)

> **Note**: The subsequent steps demonstrate the integration process using Retool, a custom software development platform. A parallel methodology can be applied when integrating NB.ai's Route Optimization API with ServiceNow.

### Step 2: Retrieve Work Order Tasks

In this step, we retrieve work order tasks from the ServiceNow account. The objective is to pull a comprehensive list of work order tasks that provide essential details for further analysis and optimization.

![documentation image](https://static.nextbillion.io/docs-next/integrations/service-now/service-now-4.webp)

#### API Request

To fetch work order tasks from ServiceNow, use the following cURL command:

```bash
# Fetch work order tasks from ServiceNow

curl --location 'https://dev182540.service-now.com/api/now/table/wm_task?state=7'
--header 'Accept: application/json'
--header 'Authorization: Basic <your_authorization_value>'
```

#### API Response

The following API response contains a structured set of information, such as task details, associated links, and relevant attributes. This step lays the groundwork for subsequent actions.

```json
{
  "result": [
    {
      "parent": {
        "link": "https://dev182540.service-now.com/api/now/table/task/739e5638df113100dca6a5f59bf26323",
        "value": "739e5638df113100dca6a5f59bf26323"
      },
      "window_end": "",
      "watch_list": "",
      "upon_reject": "cancel",
      "sys_updated_on": "2023-11-12 03:58:25",
      "approval_history": "",
      "skills": "",
      "number": "WOT0008017",
      "estimated_onsite_arrival_buffer_duration": "",
      "previous_agent": "",
      "expected_travel_start": "",
      "state": "7",
      "sys_created_by": "david.loo",
      "work_order": "",
      "knowledge": "false",
      "order": "",
      "offline_device_timestamp": "",
      "cmdb_ci": "",
      "delivery_plan": "",
      "contract": "",
      "impact": "3",
      "scheduling_preference": "",
      "active": "false",
      "actual_work_duration": "",
      "work_notes_list": "",
      "priority": "4",
      "sys_domain_path": "/",
      "onsite_arrivl_geofence_distance_unit": "",
      "schedule_lock": "false",
      "display_work_end": "",
      "display_travel_start": "",
      "business_duration": "",
      "group_list": "",
      "allow_assignment_override": "false",
      "approval_set": "",
      "universal_request": "",
      "template": {
        "link": "https://dev182540.service-now.com/api/now/table/cmdb_model/6b260ef0df113100dca6a5f59bf263cf",
        "value": "6b260ef0df113100dca6a5f59bf263cf"
      },
      "short_description": "Site design",
      "acknowledged_on": "",
      "correlation_display": "",
      "delivery_task": "",
      "work_start": "",
      "additional_assignee_list": "",
      "actual_travel_start": "",
      "estimated_travel_duration": "",
      "assigned_vendor": "",
      "service_offering": "",
      "sys_class_name": "wm_task",
      "closed_by": {
        "link": "https://dev182540.service-now.com/api/now/table/sys_user/5137153cc611227c000bbd1bd8cd2007",
        "value": "5137153cc611227c000bbd1bd8cd2007"
      },
      "follow_up": "",
      "estimated_end": "2023-11-09 22:08:05",
      "vendor_reference": "",
      "dispatched_on": "",
      "reassignment_count": "0",
      "allow_work_overtime": "false",
      "ignore_travel": "false",
      "assigned_to": "",
      "sla_due": "",
      "scheduling_method": "",
      "comments_and_work_notes": "",
      "has_appointment": "false",
      "acceptance_due_date": "",
      "substate": "",
      "escalation": "0",
      "upon_approval": "proceed",
      "correlation_id": "",
      "asset": "",
      "made_sla": "true",
      "onsite_arrival_geofence_radius": "",
      "appointment": "",
      "task_effective_number": "WOT0008017",
      "sys_updated_by": "admin",
      "check_in_status": "",
      "opened_by": {
        "link": "https://dev182540.service-now.com/api/now/table/sys_user/5137153cc611227c000bbd1bd8cd2007",
        "value": "5137153cc611227c000bbd1bd8cd2007"
      },
      "user_input": "",
      "sys_created_on": "2023-11-09 20:06:02",
      "sys_domain": {
        "link": "https://dev182540.service-now.com/api/now/table/sys_user_group/global",
        "value": "global"
      },
      "route_reason": "",
      "is_fixed_window": "false",
      "closed_at": "2023-11-09 20:08:05",
      "work_type": "",
      "window_start": "2023-10-29 04:36:00",
      "business_service": "",
      "time_worked": "",
      "expected_start": "",
      "opened_at": "2023-11-09 20:06:02",
      "actual_onsite_arrival_buffer_duration": "",
      "work_end": "",
      "work_notes": "",
      "acceptance_duration": "",
      "initiated_from": "",
      "home_travel_duration": "",
      "assignment_group": "",
      "under_warranty": "false",
      "actual_travel_duration": "",
      "description": "",
      "calendar_duration": "",
      "close_notes": "",
      "dispatch_group": "",
      "sys_id": "16de5638df113100dca6a5f59bf2635a",
      "contact_type": "phone",
      "actual_onsite_arrival": "",
      "urgency": "3",
      "company": "",
      "activity_due": "",
      "comments": "",
      "approval": "not requested",
      "has_follow_on": "false",
      "due_date": "",
      "sys_mod_count": "3",
      "sys_tags": "",
      "estimated_work_duration": "1970-01-01 01:00:00",
      "routing_in_progress": "false",
      "location": {
        "link": "https://dev182540.service-now.com/api/now/table/cmn_location/f48b23490a0a0ba700c2d55e12860152",
        "value": "f48b23490a0a0ba700c2d55e12860152"
      },
      "cloned_from": ""
    },
    {
      "follow_up": "",
      "estimated_end": "2023-11-20 00:20:00",
      "vendor_reference": "",
      "dispatched_on": "",
      "reassignment_count": "0",
      "allow_work_overtime": "false",
      "ignore_travel": "false",
      "assigned_to": "",
      "sla_due": "",
      "scheduling_method": "",
      "comments_and_work_notes": "",
      "has_appointment": "false",
      "acceptance_due_date": "",
      "substate": "",
      "escalation": "0",
      "upon_approval": "proceed",
      "correlation_id": "",
      "asset": "",
      "made_sla": "true",
      "onsite_arrival_geofence_radius": "",
      "appointment": "",
      "task_effective_number": "WOT0008037",
      "sys_updated_by": "admin",
      "check_in_status": "",
      "opened_by": {
        "link": "https://dev182540.service-now.com/api/now/table/sys_user/8d56406a0a0a0a6b004070b354aada28",
        "value": "8d56406a0a0a0a6b004070b354aada28"
      },
      "user_input": "",
      "sys_created_on": "2023-11-08 19:32:59",
      "sys_domain": {
        "link": "https://dev182540.service-now.com/api/now/table/sys_user_group/global",
        "value": "global"
      },
      "route_reason": "",
      "is_fixed_window": "false",
      "closed_at": "2023-11-08 19:41:58",
      "work_type": "",
      "window_start": "2023-11-11 16:00:00",
      "business_service": "",
      "time_worked": "",
      "expected_start": "2023-11-19 17:20:00",
      "opened_at": "2023-11-08 19:32:44",
      "actual_onsite_arrival_buffer_duration": "",
      "work_end": "",
      "work_notes": "",
      "acceptance_duration": "",
      "initiated_from": "",
      "home_travel_duration": "",
      "assignment_group": {
        "link": "https://dev182540.service-now.com/api/now/table/sys_user_group/f253da061b13200050fdfbcd2c0713ab",
        "value": "f253da061b13200050fdfbcd2c0713ab"
      },
      "cloned_from": ""
    }
  ]
}
```

The following image displays the work order information accessible through the integration, allowing seamless visualization and manipulation within the Retool application.

![documentation image](https://static.nextbillion.io/docs-next/integrations/service-now/service-now-5.webp)

### Step 3: Retrieve Dispatchers Information

To optimize routes based on vehicle capacity and other parameters, it's crucial to obtain a list of dispatchers, representing your vehicles.

![documentation image](https://static.nextbillion.io/docs-next/integrations/service-now/service-now-6.webp)

#### API Request

Execute the following cURL command to fetch dispatcher information from ServiceNow:

```bash
curl --location 'https://dev182540.service-now.com/api/now/table/sys_user'
--header 'Authorization: Basic <your_authorization_value>'
```

#### API Response

The API response returns a comprehensive list of dispatchers, which represent field service vehicles. Name, contact information, geolocation coordinates, and organizational affiliations are all included in each dispatcher entry. Attributes like gender, employee count, and user roles are also returned in the API response. This data is used to optimize routes based on vehicle capacity and other parameters, increasing the efficiency of field service management.

```json
{
  "result": [
    {
      "phone": "",
      "name": "Lucius Bagnoli",
      "employee_number": "",
      "password_needs_reset": "false",
      "gender": "Male",
      "city": "",
      "failed_attempts": "",
      "user_name": "lucius.bagnoli",
      "latitude": "35.674989",
      "roles": "",
      "title": "",
      "sys_class_name": "sys_user",
      "sys_id": "02826bf03710200044e0bfc8bcbe5d3f",
      "federated_id": "f737nH9Kw1raNr82OZPt9fM0T6+ETZqw3746MB96ncQ=",
      "internal_integration_user": "false",
      "ldap_server": "",
      "mobile_phone": "",
      "street": "",
      "company": {
        "link": "https://dev182540.service-now.com/api/now/table/core_company/81fd65ecac1d55eb42a426568fc87a63",
        "value": "81fd65ecac1d55eb42a426568fc87a63"
      },
      "department": {
        "link": "https://dev182540.service-now.com/api/now/table/cmn_department/5d7f17f03710200044e0bfc8bcbe5d43",
        "value": "5d7f17f03710200044e0bfc8bcbe5d43"
      },
      "first_name": "Lucius",
      "email": "lucius.bagnoli@example.com",
      "introduction": "",
      "preferred_language": "",
      "manager": {
        "link": "https://dev182540.service-now.com/api/now/table/sys_user/02826bf03710200044e0bfc8bcbe5d88",
        "value": "02826bf03710200044e0bfc8bcbe5d88"
      },
      "locked_out": "false",
      "sys_mod_count": "7",
      "last_name": "Bagnoli",
      "photo": "",
      "avatar": "",
      "middle_name": "",
      "sys_tags": "",
      "time_zone": "",
      "schedule": "",
      "on_schedule": "",
      "date_format": "",
      "location": {
        "link": "https://dev182540.service-now.com/api/now/table/cmn_location/0002c0a93790200044e0bfc8bcbe5df5",
        "value": "0002c0a93790200044e0bfc8bcbe5df5"
      }
    },
    {
      "calendar_integration": "1",
      "country": "",
      "last_position_update": "",
      "user_password": "4hQ2bBs50o",
      "last_login_time": "",
      "source": "",
      "sys_updated_on": "2023-11-08 16:25:08",
      "building": "",
      "web_service_access_only": "false",
      "notification": "2",
      "enable_multifactor_authn": "false",
      "sys_updated_by": "system",
      "sys_created_on": "2012-02-18 03:04:50",
      "agent_status": "",
      "sys_domain": {
        "link": "https://dev182540.service-now.com/api/now/table/sys_user_group/global",
        "value": "global"
      },
      "state": "",
      "vip": "false",
      "sys_created_by": "admin",
      "longitude": "-117.037319",
      "zip": "",
      "home_phone": "",
      "time_format": "",
      "last_login": "",
      "default_perspective": "",
      "geolocation_tracked": "false",
      "active": "true",
      "time_sheet_policy": "",
      "sys_domain_path": "/",
      "cost_center": {
        "link": "https://dev182540.service-now.com/api/now/table/cmn_cost_center/d9d07bddc0a80a647cf932056ed24652",
        "value": "d9d07bddc0a80a647cf932056ed24652"
      },
      "phone": "",
      "name": "Christian Marnell",
      "employee_number": "",
      "password_needs_reset": "false",
      "gender": "Male",
      "city": "",
      "failed_attempts": "",
      "user_name": "christian.marnell",
      "latitude": "50.085273",
      "roles": "",
      "title": "",
      "sys_class_name": "sys_user",
      "sys_id": "02826bf03710200044e0bfc8bcbe5d91",
      "federated_id": "r5YjWYJmQKPaCji/lXNRUWBp28iaBOHCb5toQBebzx4=",
      "internal_integration_user": "false",
      "ldap_server": "",
      "mobile_phone": "",
      "street": "",
      "company": {
        "link": "https://dev182540.service-now.com/api/now/table/core_company/4b7d13f03710200044e0bfc8bcbe5db6",
        "value": "4b7d13f03710200044e0bfc8bcbe5db6"
      },
      "department": {
        "link": "https://dev182540.service-now.com/api/now/table/cmn_department/a581ab703710200044e0bfc8bcbe5de8",
        "value": "a581ab703710200044e0bfc8bcbe5de8"
      },
      "first_name": "Christian",
      "email": "christian.marnell@example.com",
      "introduction": "",
      "preferred_language": "",
      "manager": {
        "link": "https://dev182540.service-now.com/api/now/table/sys_user/fd826bf03710200044e0bfc8bcbe5d39",
        "value": "fd826bf03710200044e0bfc8bcbe5d39"
      },
      "locked_out": "false",
      "sys_mod_count": "7",
      "last_name": "Marnell",
      "photo": "",
      "avatar": "",
      "middle_name": "",
      "sys_tags": "",
      "time_zone": "",
      "schedule": "",
      "on_schedule": "",
      "date_format": "",
      "location": {
        "link": "https://dev182540.service-now.com/api/now/table/cmn_location/24018ca93790200044e0bfc8bcbe5d32",
        "value": "24018ca93790200044e0bfc8bcbe5d32"
      }
    }
  ]
}
```

The following image displays the dispatchers' data returned in the API response, presented on the Retool application, providing a user-friendly interface for further actions.

![documentation image](https://static.nextbillion.io/docs-next/integrations/service-now/service-now-7.webp)

### Step 4: Data Preparation and Mapping

After successfully pulling the necessary data from ServiceNow, the data is mapped with the respective Route Optimization API parameters. Configure optimization settings such as shift start and end time, service time, and start and end location coordinates.

```javascript
let vehicles = [];
let shifts = [];
let starts = [];
let ends = [];
let veh_attr = [];
let stop_attr = [];
let jobs_index = 1;
let vehicle_index = 1;
let shiftStart = new Date(dtShiftStart2.value).getTime() / 1000;
let shiftEnd = new Date(dtShiftEnd2.value).getTime() / 1000;

// START NBAI PROBLEM BUILD
let locations = [];
let jobs = [];
let shipments = [];
vehicles = [];
veh_attr = [];
stop_attr = [];
// sequence through all stops and create job array while
// also creating the indexed list of locations
let location_index = 0;
let location = [];
table2.data.forEach((planstop) => {
  let job = {
    id: jobs_index++,
    location_index: location_index++,
    service: numberInput1.value,
    priority: 0,
  };
  location.push(`${planstop.latitude},${planstop.longitude}`);

  jobs.push(job);
});

// Add shift start/stop location to location index
location.push(`${txtVehicleStartPosition2.value}`);
location.push(`${txtVehicleEndPosition2.value}`);
location_index += 1;
let veh_fixed_cost = 0;
tblDrivers.data.forEach((v, idx) => {
  let breaks = [];

  let vehicle = {
    id: vehicle_index++,
    start_index: location_index,
    time_window: [shiftStart, shiftEnd],
    max_tasks: 25,
    costs: {
      fixed: veh_fixed_cost,
    },
  };
  vehicles.push(vehicle);
  veh_fixed_cost += 0;
});

locations = {
  id: 12,
  description: "Servicenow Test",
  location: location,
};

let options = {
  routing: {
    mode: "car",
  },
};

localStorage.setValue("vehiclesNBAI", vehicles);
localStorage.setValue("shipmentsNBAI", shipments);
localStorage.setValue("jobsNBAI", jobs);
localStorage.setValue("locationsNBAI", locations);
localStorage.setValue("nbaiOptions", options);
localStorage.setValue("nbaiVRPResult", null);

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
  "id": "1a3905c5163dfc4aa5267e85c177ef7a",
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
      "cost": 18228,
      "routes": 4,
      "unassigned": 0,
      "setup": 0,
      "service": 5760,
      "duration": 18228,
      "waiting_time": 0,
      "priority": 0,
      "distance": 240497
    },
    "routes": [
      {
        "vehicle": 5,
        "cost": 4083,
        "steps": [
          {
            "type": "start",
            "arrival": 1702089000,
            "duration": 0,
            "service": 0,
            "waiting_time": 0,
            "location": [32.84, -117.098],
            "location_index": 49,
            "distance": 0
          },
          {
            "type": "job",
            "arrival": 1702089599,
            "duration": 599,
            "service": 120,
            "waiting_time": 0,
            "location": [32.916001, -117.128957],
            "location_index": 16,
            "id": 17,
            "distance": 12402
          },
          {
            "type": "job",
            "arrival": 1702089719,
            "duration": 599,
            "service": 120,
            "waiting_time": 0,
            "location": [32.916001, -117.128957],
            "location_index": 33,
            "id": 34,
            "distance": 12402
          },
          {
            "type": "job",
            "arrival": 1702090529,
            "duration": 1289,
            "service": 120,
            "waiting_time": 0,
            "location": [32.983225, -117.081855],
            "location_index": 8,
            "id": 9,
            "distance": 22753
          },
          {
            "type": "job",
            "arrival": 1702091249,
            "duration": 1889,
            "service": 120,
            "waiting_time": 0,
            "location": [33.020782, -117.077105],
            "location_index": 29,
            "id": 30,
            "distance": 29517
          },
          {
            "type": "job",
            "arrival": 1702092030,
            "duration": 2550,
            "service": 120,
            "waiting_time": 0,
            "location": [32.955437, -117.128841],
            "location_index": 30,
            "id": 31,
            "distance": 40327
          },
          {
            "type": "job",
            "arrival": 1702092931,
            "duration": 3331,
            "service": 120,
            "waiting_time": 0,
            "location": [32.953567, -117.230455],
            "location_index": 9,
            "id": 10,
            "distance": 52698
          },
          {
            "type": "job",
            "arrival": 1702093803,
            "duration": 4083,
            "service": 120,
            "waiting_time": 0,
            "location": [32.994402, -117.272434],
            "location_index": 4,
            "id": 5,
            "distance": 62331
          },
          {
            "type": "end",
            "arrival": 1702093923,
            "duration": 4083,
            "service": 0,
            "waiting_time": 0,
            "location": [32.994402, -117.272434],
            "location_index": 4,
            "distance": 62331
          }
        ],
        "service": 840,
        "duration": 4083,
        "waiting_time": 0,
        "priority": 0,
        "distance": 62331,
        "geometry": "camgEbvuiUVDHw@Ay@RD^JTFh@Rp@VJDp@ZHUeAi@q@Yc@Oq@Q[Gs@KGASA_@C]Au@AS@IDe@?O?K?W?Y?W@U?OBW@e@FMA]FK@IBC?E@E@CBCBCBADAF?D?H?L@J?"
      },
      {
        "vehicle": 3,
        "cost": 5445,
        "steps": [
          {
            "type": "start",
            "arrival": 1702089000,
            "duration": 0,
            "service": 0,
            "waiting_time": 0,
            "location": [32.84, -117.098],
            "location_index": 49,
            "distance": 0
          },
          {
            "type": "job",
            "arrival": 1702089627,
            "duration": 627,
            "service": 120,
            "waiting_time": 0,
            "location": [32.782863, -117.172306],
            "location_index": 11,
            "id": 12,
            "distance": 11936
          },
          {
            "type": "job",
            "arrival": 1702089845,
            "duration": 725,
            "service": 120,
            "waiting_time": 0,
            "location": [32.782302, -117.170992],
            "location_index": 14,
            "id": 15,
            "distance": 12311
          },
          {
            "type": "job",
            "arrival": 1702090342,
            "duration": 1102,
            "service": 120,
            "waiting_time": 0,
            "location": [32.750283, -117.162623],
            "location_index": 17,
            "id": 18,
            "distance": 17532
          },
          {
            "type": "job",
            "arrival": 1702090707,
            "duration": 1347,
            "service": 120,
            "waiting_time": 0,
            "location": [32.749386, -117.150514],
            "location_index": 38,
            "id": 39,
            "distance": 19366
          },
          {
            "type": "job",
            "arrival": 1702091321,
            "duration": 1841,
            "service": 120,
            "waiting_time": 0,
            "location": [32.71445, -117.162889],
            "location_index": 1,
            "id": 2,
            "distance": 24836
          },
          {
            "type": "job",
            "arrival": 1702091604,
            "duration": 2004,
            "service": 120,
            "waiting_time": 0,
            "location": [32.7153292, -117.1572551],
            "location_index": 44,
            "id": 45,
            "distance": 25478
          },
          {
            "type": "job",
            "arrival": 1702091724,
            "duration": 2004,
            "service": 120,
            "waiting_time": 0,
            "location": [32.7153292, -117.1572551],
            "location_index": 42,
            "id": 43,
            "distance": 25478
          },
          {
            "type": "job",
            "arrival": 1702091844,
            "duration": 2004,
            "service": 120,
            "waiting_time": 0,
            "location": [32.7153292, -117.1572551],
            "location_index": 0,
            "id": 1,
            "distance": 25478
          },
          {
            "type": "job",
            "arrival": 1702091964,
            "duration": 2004,
            "service": 120,
            "waiting_time": 0,
            "location": [32.7153292, -117.1572551],
            "location_index": 40,
            "id": 41,
            "distance": 25478
          },
          {
            "type": "job",
            "arrival": 1702092084,
            "duration": 2004,
            "service": 120,
            "waiting_time": 0,
            "location": [32.7153292, -117.1572551],
            "location_index": 41,
            "id": 42,
            "distance": 25478
          },
          {
            "type": "job",
            "arrival": 1702092204,
            "duration": 2004,
            "service": 120,
            "waiting_time": 0,
            "location": [32.7153292, -117.1572551],
            "location_index": 43,
            "id": 44,
            "distance": 25478
          },
          {
            "type": "job",
            "arrival": 1702092425,
            "duration": 2105,
            "service": 120,
            "waiting_time": 0,
            "location": [32.714258, -117.156955],
            "location_index": 47,
            "id": 48,
            "distance": 25793
          },
          {
            "type": "job",
            "arrival": 1702092545,
            "duration": 2105,
            "service": 120,
            "waiting_time": 0,
            "location": [32.71426, -117.156953],
            "location_index": 5,
            "id": 6,
            "distance": 25793
          },
          {
            "type": "job",
            "arrival": 1702093058,
            "duration": 2498,
            "service": 120,
            "waiting_time": 0,
            "location": [32.696727, -117.134012],
            "location_index": 15,
            "id": 16,
            "distance": 29810
          },
          {
            "type": "job",
            "arrival": 1702093608,
            "duration": 2928,
            "service": 120,
            "waiting_time": 0,
            "location": [32.681061, -117.122391],
            "location_index": 19,
            "id": 20,
            "distance": 32530
          },
          {
            "type": "job",
            "arrival": 1702094547,
            "duration": 3747,
            "service": 120,
            "waiting_time": 0,
            "location": [32.582634, -117.113495],
            "location_index": 45,
            "id": 46,
            "distance": 46790
          },
          {
            "type": "job",
            "arrival": 1702095253,
            "duration": 4333,
            "service": 120,
            "waiting_time": 0,
            "location": [32.5743, -117.069387],
            "location_index": 25,
            "id": 26,
            "distance": 52023
          },
          {
            "type": "job",
            "arrival": 1702095936,
            "duration": 4896,
            "service": 120,
            "waiting_time": 0,
            "location": [32.582376, -117.034507],
            "location_index": 46,
            "id": 47,
            "distance": 56526
          },
          {
            "type": "job",
            "arrival": 1702096605,
            "duration": 5445,
            "service": 120,
            "waiting_time": 0,
            "location": [32.544864, -117.041523],
            "location_index": 32,
            "id": 33,
            "distance": 63149
          },
          {
            "type": "end",
            "arrival": 1702096725,
            "duration": 5445,
            "service": 0,
            "waiting_time": 0,
            "location": [32.544864, -117.041523],
            "location_index": 32,
            "distance": 63149
          }
        ],
        "service": 2280,
        "duration": 5445,
        "waiting_time": 0,
        "priority": 0,
        "distance": 63149,
        "geometry": "camgEbvuiUVDHw@Ay@RD^JTFh@Rp@VJDp@ZHUeAi@q@Yc@Oq@Q[Gs@KGASA_@C]Au@AS@IDe@?O?K?W?Y?W@U?OBW@e@FMA]FK@IBC?E@E@CBCBCBADAF?D?H?L@J?"
      },
      {
        "vehicle": 4,
        "cost": 8682,
        "steps": [
          {
            "type": "start",
            "arrival": 1702089000,
            "duration": 0,
            "service": 0,
            "waiting_time": 0,
            "location": [32.84, -117.098],
            "location_index": 49,
            "distance": 0
          },
          {
            "type": "job",
            "arrival": 1702089564,
            "duration": 564,
            "service": 120,
            "waiting_time": 0,
            "location": [32.833404, -117.17349],
            "location_index": 7,
            "id": 8,
            "distance": 11466
          },
          {
            "type": "job",
            "arrival": 1702090060,
            "duration": 940,
            "service": 120,
            "waiting_time": 0,
            "location": [32.833757, -117.202292],
            "location_index": 20,
            "id": 21,
            "distance": 14650
          },
          {
            "type": "job",
            "arrival": 1702090660,
            "duration": 1420,
            "service": 120,
            "waiting_time": 0,
            "location": [32.868594, -117.214795],
            "location_index": 22,
            "id": 23,
            "distance": 19794
          },
          {
            "type": "job",
            "arrival": 1702091048,
            "duration": 1688,
            "service": 120,
            "waiting_time": 0,
            "location": [32.851191, -117.214428],
            "location_index": 37,
            "id": 38,
            "distance": 22763
          },
          {
            "type": "job",
            "arrival": 1702091826,
            "duration": 2346,
            "service": 120,
            "waiting_time": 0,
            "location": [32.798917, -117.252783],
            "location_index": 3,
            "id": 4,
            "distance": 33276
          },
          {
            "type": "job",
            "arrival": 1702091946,
            "duration": 2346,
            "service": 120,
            "waiting_time": 0,
            "location": [32.798917, -117.252783],
            "location_index": 26,
            "id": 27,
            "distance": 33276
          },
          {
            "type": "job",
            "arrival": 1702092684,
            "duration": 2964,
            "service": 120,
            "waiting_time": 0,
            "location": [32.745799, -117.247633],
            "location_index": 24,
            "id": 25,
            "distance": 41331
          },
          {
            "type": "job",
            "arrival": 1702092804,
            "duration": 2964,
            "service": 120,
            "waiting_time": 0,
            "location": [32.745799, -117.247633],
            "location_index": 28,
            "id": 29,
            "distance": 41331
          },
          {
            "type": "job",
            "arrival": 1702093574,
            "duration": 3614,
            "service": 120,
            "waiting_time": 0,
            "location": [32.772929, -117.135982],
            "location_index": 18,
            "id": 19,
            "distance": 53311
          },
          {
            "type": "job",
            "arrival": 1702093924,
            "duration": 3844,
            "service": 120,
            "waiting_time": 0,
            "location": [32.769192, -117.149377],
            "location_index": 2,
            "id": 3,
            "distance": 55103
          },
          {
            "type": "job",
            "arrival": 1702094537,
            "duration": 4337,
            "service": 120,
            "waiting_time": 0,
            "location": [32.801733, -117.13957],
            "location_index": 34,
            "id": 35,
            "distance": 60245
          },
          {
            "type": "job",
            "arrival": 1702095083,
            "duration": 4763,
            "service": 120,
            "waiting_time": 0,
            "location": [32.763623, -117.123052],
            "location_index": 21,
            "id": 22,
            "distance": 66581
          },
          {
            "type": "job",
            "arrival": 1702095441,
            "duration": 5001,
            "service": 120,
            "waiting_time": 0,
            "location": [32.766156, -117.111564],
            "location_index": 13,
            "id": 14,
            "distance": 68071
          },
          {
            "type": "job",
            "arrival": 1702095889,
            "duration": 5329,
            "service": 120,
            "waiting_time": 0,
            "location": [32.749339, -117.104866],
            "location_index": 10,
            "id": 11,
            "distance": 70531
          },
          {
            "type": "job",
            "arrival": 1702096435,
            "duration": 5755,
            "service": 120,
            "waiting_time": 0,
            "location": [32.781962, -117.090704],
            "location_index": 6,
            "id": 7,
            "distance": 76417
          },
          {
            "type": "job",
            "arrival": 1702097171,
            "duration": 6371,
            "service": 120,
            "waiting_time": 0,
            "location": [32.788819, -117.021608],
            "location_index": 31,
            "id": 32,
            "distance": 85388
          },
          {
            "type": "job",
            "arrival": 1702097776,
            "duration": 6856,
            "service": 120,
            "waiting_time": 0,
            "location": [32.764082, -117.06016],
            "location_index": 12,
            "id": 13,
            "distance": 90724
          },
          {
            "type": "job",
            "arrival": 1702098256,
            "duration": 7216,
            "service": 120,
            "waiting_time": 0,
            "location": [32.74199, -117.056227],
            "location_index": 23,
            "id": 24,
            "distance": 94452
          },
          {
            "type": "job",
            "arrival": 1702098841,
            "duration": 7681,
            "service": 120,
            "waiting_time": 0,
            "location": [32.708986, -117.077007],
            "location_index": 39,
            "id": 40,
            "distance": 100937
          },
          {
            "type": "job",
            "arrival": 1702099475,
            "duration": 8195,
            "service": 120,
            "waiting_time": 0,
            "location": [32.675371, -117.064873],
            "location_index": 27,
            "id": 28,
            "distance": 105887
          },
          {
            "type": "job",
            "arrival": 1702100082,
            "duration": 8682,
            "service": 120,
            "waiting_time": 0,
            "location": [32.707397, -117.0083],
            "location_index": 35,
            "id": 36,
            "distance": 114984
          },
          {
            "type": "end",
            "arrival": 1702100202,
            "duration": 8682,
            "service": 0,
            "waiting_time": 0,
            "location": [32.707397, -117.0083],
            "location_index": 35,
            "distance": 114984
          }
        ],
        "service": 2520,
        "duration": 8682,
        "waiting_time": 0,
        "priority": 0,
        "distance": 114984,
        "geometry": "camgEbvuiUVDHw@Ay@RD^JTFh@Rp@VJDp@ZHUeAi@q@Yc@Oq@Q[Gs@KGASA_@C]Au@AS@IDe@?O?K?W?Y?W@U?OBW@e@FMA]FK@IBC?E@E@CBCBCBADAF?D?H?L@J??"
      },
      {
        "vehicle": 6,
        "cost": 18,
        "steps": [
          {
            "type": "start",
            "arrival": 1702089000,
            "duration": 0,
            "service": 0,
            "waiting_time": 0,
            "location": [32.84, -117.098],
            "location_index": 49,
            "distance": 0
          },
          {
            "type": "job",
            "arrival": 1702089018,
            "duration": 18,
            "service": 120,
            "waiting_time": 0,
            "location": [32.840439, -117.098029],
            "location_index": 36,
            "id": 37,
            "distance": 33
          },
          {
            "type": "end",
            "arrival": 1702089138,
            "duration": 18,
            "service": 0,
            "waiting_time": 0,
            "location": [32.840439, -117.098029],
            "location_index": 36,
            "distance": 33
          }
        ],
        "service": 120,
        "duration": 18,
        "waiting_time": 0,
        "priority": 0,
        "distance": 33,
        "geometry": "camgEbvuiUu@M?D??"
      }
    ]
  },
  "status": "Ok",
  "message": ""
}
```

### Step 7: Visulaize Optimized Route Results

The optimized route results can be visulalized with the help of our Route Optimization Tester.

Use the following link to visualize the optimized routes.

```bash
https://playground.nextbillion.ai/optimization-tester?apiKey={{localStorage.values.apiKey}}&requestID={{nbaiOptimizationRun.data.id}}
```

The above link directs you to the Optimizer interface, providing a convenient way to inspect and analyze the optimized routes generated by the Route Optimization API. Simply replace the placeholders with your API key and the request ID obtained from the API response for seamless integration and route assessment. The following image visualizes the routes generated by the Route Optimization API within the Tester interface.

![documentation image](https://static.nextbillion.io/docs-next/integrations/service-now/service-now-8.webp)

ServiceNow and NextBillion.ai's Route Optimization API integration combines the strengths of a leading service management platform and cutting-edge route optimization technology. This integration enables organizations to improve their logistics and service delivery capabilities, resulting in operational excellence and, ultimately, a more agile and responsive business environment.

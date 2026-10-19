# Motive Fleet Management Integration with Route Optimization API

This document will guide you through integrating Motive’s Fleet Management Solution with NextBillion.ai’s Route Optimization API.

Motive provides a comprehensive set of fleet management solutions such as vehicle tracking, maintenance scheduling, fuel management, and driver behavior monitoring.

NextBillion.ai's Route Optimization API addresses both Single and Multi Vehicle Routing Problems (VRP). The API considers various constraints such as time windows, capacity, and vehicle availability to find the optimal set of routes for a fleet.

The integration of Motive Fleet Management with NextBillion.ai's Route Optimization API offers a robust solution for businesses looking to revolutionize their fleet operations. This partnership provides a strategic advantage in optimizing delivery routes, managing fleets efficiently, and achieving higher levels of operational excellence.

## Prerequisites

Before integrating Motive Fleet Management with NextBillion.ai's Route Optimization API, ensure you have the following things in place:

### Motive Access Token

Obtain an access token from Motive with both read and write scopes. This token is essential for authenticating and authorizing API requests to Motive's services.

### NextBillion.ai API Key

Acquire an API key from NextBillion.ai. This key will be used to access the Route Optimization API and enable route planning functionalities.

### Motive Driver App

Ensure that the Motive driver app is installed and configured on the driver's device. This app will facilitate communication between the driver's vehicle and the fleet management system.

Having these prerequisites in place is crucial for a smooth and successful integration, allowing seamless communication between Motive's and NextBillion.ai's systems.

## Setting Up Motive Dashboard and Fetching Information

### Step 1: Obtain Access Tokens and API Keys

[Create an account](https://developer.gomotive.com/portal/auth/login) on Motive’s Developer Portal.

![documentation image](https://static.nextbillion.io/docs-next/integrations/motive/image-1.webp)

Once registered, create an app for your organization and assign the necessary scopes.

#### API Authentication Scheme

Follow the [OAuth2 authentication](https://developer.gomotive.com/reference/authentication-oauth-20) scheme provided by Motive.

#### Generate API Access Token

Use the client ID created in Motive's Developer Portal to generate the access token.

Verify the token by performing basic CRUD operations to ensure it works correctly.

### Step 2: Set Up Motive Dashboard

[Create an account](https://account.gomotive.com/log-in) on the Motive Dashboard.

Use this account to manage assets, drivers, vehicles, and dispatches for the organization.

#### Populate Components

Use the Motive Dashboard or the GET and POST methods to populate the following components:

- Dispatch Locations
- Vehicles
- Drivers

Refer to the [Motive API documentation](https://developer.gomotive.com/reference/introduction) for detailed instructions.

### Step 3: Fetch Data from Motive

Fetch the fleet information from your Motive dashboard using the following curl commands.

#### Fetch Vehicles

Use the following API request to fetch the list of vehicles.

##### API Request

```bash
curl --location 'https://api.keeptruckin.com/v1/vehicles' \
--header 'Authorization: Bearer <Access token>'
```

##### API Response

```json
{
  "vehicles": [
    {
      "vehicle": {
        "id": 1535461,
        "company_id": 402178,
        "number": "1628",
        "status": "active",
        "ifta": false,
        "vin": "3ALXA7002GDGX7368",
        "make": "FRHT",
        "model": "TRACTOR",
        "year": "2016",
        "license_plate_state": "FL",
        "license_plate_number": "asdfsda",
        "metric_units": false,
        "fuel_type": "diesel",
        "prevent_auto_odometer_entry": false,
        "notes": null,
        "group_ids": [126687],
        "created_at": "2024-04-08T03:40:20Z",
        "updated_at": "2024-04-29T07:34:58Z",
        "permanent_driver": null,
        "eld_device": null,
        "current_driver": null,
        "external_ids": []
      }
    },
    {
      "vehicle": {
        "id": 1535463,
        "company_id": 402178,
        "number": "1648",
        "status": "active",
        "ifta": true,
        "vin": "3ALXA7002GDHH3755",
        "make": "FRHT",
        "model": "TRACTOR",
        "year": "2016",
        "license_plate_state": "FL",
        "license_plate_number": "awdfads",
        "metric_units": true,
        "fuel_type": "gasoline",
        "prevent_auto_odometer_entry": false,
        "notes": "Notes1",
        "group_ids": [126686],
        "created_at": "2024-04-08T03:43:08Z",
        "updated_at": "2024-05-10T17:02:04Z",
        "permanent_driver": null,
        "eld_device": null,
        "current_driver": null,
        "external_ids": []
      }
    },
    {
      "vehicle": {
        "id": 1535464,
        "company_id": 402178,
        "number": "1658",
        "status": "active",
        "ifta": true,
        "vin": "1FTCR15T4GPB29162",
        "make": "FRHT",
        "model": "TRACTOR",
        "year": "2016",
        "license_plate_state": "FL",
        "license_plate_number": "awdfads",
        "metric_units": true,
        "fuel_type": "lng",
        "prevent_auto_odometer_entry": false,
        "notes": null,
        "group_ids": [126687],
        "created_at": "2024-04-08T03:43:08Z",
        "updated_at": "2024-05-10T16:46:17Z",
        "permanent_driver": null,
        "eld_device": null,
        "current_driver": null,
        "external_ids": []
      }
    }
  ],
  "pagination": {
    "per_page": 25,
    "page_no": 1,
    "total": 3
  }
}
```

#### Fetch Drivers/Users

Fetch the list of Drivers using the following API request.

##### API Request

```bash
curl --location 'https://api.keeptruckin.com/v1/users' \
--header 'Authorization: Bearer <Access token>'
```

##### API Response

```json
{
  "users": [
    {
      "user": {
        "id": 4559226,
        "email": "kds@nextbillion.ai",
        "first_name": "Dhivya",
        "last_name": "Selvarajan",
        "group_ids": [],
        "company_reference_id": null,
        "phone": "(770) 844-3577",
        "phone_ext": "",
        "time_zone": null,
        "metric_units": false,
        "mobile_last_active_at": null,
        "mobile_current_sign_in_at": null,
        "mobile_last_sign_in_at": null,
        "web_last_active_at": "2024-05-14T05:27:56Z",
        "role": "admin",
        "status": "active",
        "web_current_sign_in_at": "2024-05-03T12:26:42Z",
        "web_last_sign_in_at": "2024-05-09T10:39:47Z",
        "external_ids": [],
        "created_at": "2024-01-19T07:04:37Z",
        "updated_at": "2024-05-14T05:27:56.842188Z"
      }
    },
    {
      "user": {
        "id": 4688484,
        "email": null,
        "first_name": "Nextbillion.ai",
        "last_name": "TMS",
        "group_ids": [],
        "company_reference_id": null,
        "phone": null,
        "phone_ext": null,
        "time_zone": null,
        "metric_units": false,
        "mobile_last_active_at": null,
        "mobile_current_sign_in_at": null,
        "mobile_last_sign_in_at": null,
        "web_last_active_at": null,
        "role": "admin",
        "status": "active",
        "web_current_sign_in_at": null,
        "web_last_sign_in_at": null,
        "external_ids": [],
        "created_at": "2024-03-26T18:43:16Z",
        "updated_at": "2024-03-26T18:43:16.814786Z"
      }
    },
    {
      "user": {
        "id": 4700955,
        "email": "axz@nextbillion.ai",
        "first_name": "Driver001",
        "last_name": "Test",
        "group_ids": [],
        "company_reference_id": null,
        "phone": "(770) 844-3577",
        "phone_ext": null,
        "time_zone": "Pacific Time (US & Canada)",
        "metric_units": true,
        "carrier_name": "Nextbillion.ai",
        "carrier_street": "3201 Elmbank Rd, Mississauga, ON L4V 1A6, Canada",
        "carrier_city": "Mississauga",
        "carrier_state": "ON",
        "carrier_zip": "",
        "violation_alerts": "1_hour",
        "terminal_street": "",
        "terminal_city": "",
        "terminal_state": null,
        "terminal_zip": "",
        "cycle": "Other",
        "exception_24_hour_restart": false,
        "exception_8_hour_break": false,
        "exception_wait_time": false,
        "exception_short_haul": false,
        "exception_ca_farm_school_bus": false,
        "cycle2": null,
        "exception_24_hour_restart2": false,
        "exception_8_hour_break2": false,
        "exception_wait_time2": false,
        "exception_short_haul2": false,
        "exception_ca_farm_school_bus2": false,
        "exception_adverse_driving": false,
        "exception_adverse_driving2": false,
        "export_combined": true,
        "export_recap": true,
        "export_odometers": true,
        "username": "nb_test_driver001",
        "driver_company_id": "D001",
        "minute_logs": false,
        "duty_status": "on_duty",
        "eld_mode": "none",
        "drivers_license_number": "Test01",
        "drivers_license_state": "NY",
        "yard_moves_enabled": false,
        "personal_conveyance_enabled": false,
        "manual_driving_enabled": false,
        "mobile_last_active_at": "2024-05-05T16:39:34Z",
        "mobile_current_sign_in_at": "2024-05-03T10:33:58Z",
        "mobile_last_sign_in_at": null,
        "web_last_active_at": "2024-05-03T10:33:58Z",
        "role": "driver",
        "status": "active",
        "web_current_sign_in_at": "2024-05-03T10:33:58Z",
        "web_last_sign_in_at": "2024-05-03T10:33:58Z",
        "external_ids": [],
        "created_at": "2024-04-02T10:46:43Z",
        "updated_at": "2024-05-05T16:40:28.992683Z"
      }
    },
    {
      "user": {
        "id": 4745137,
        "email": "abc@gmail.com",
        "first_name": "Driver002",
        "last_name": "Test",
        "group_ids": [],
        "company_reference_id": null,
        "phone": "(700) 816-0892",
        "phone_ext": null,
        "time_zone": "Pacific Time (US & Canada)",
        "metric_units": true,
        "carrier_name": "Nextbillion.ai",
        "carrier_street": "",
        "carrier_city": "",
        "carrier_state": null,
        "carrier_zip": "",
        "violation_alerts": "1_hour",
        "terminal_street": "",
        "terminal_city": "",
        "terminal_state": null,
        "terminal_zip": "",
        "cycle": "Other",
        "exception_24_hour_restart": false,
        "exception_8_hour_break": false,
        "exception_wait_time": false,
        "exception_short_haul": false,
        "exception_ca_farm_school_bus": false,
        "cycle2": null,
        "exception_24_hour_restart2": false,
        "exception_8_hour_break2": false,
        "exception_wait_time2": false,
        "exception_short_haul2": false,
        "exception_ca_farm_school_bus2": false,
        "exception_adverse_driving": false,
        "exception_adverse_driving2": false,
        "export_combined": true,
        "export_recap": true,
        "export_odometers": true,
        "username": "nb_test_driver002",
        "driver_company_id": "D002",
        "minute_logs": false,
        "duty_status": "off_duty",
        "eld_mode": "none",
        "drivers_license_number": "Test02",
        "drivers_license_state": "CA",
        "yard_moves_enabled": false,
        "personal_conveyance_enabled": false,
        "manual_driving_enabled": false,
        "mobile_last_active_at": "2024-05-13T11:44:17Z",
        "mobile_current_sign_in_at": "2024-05-03T10:34:22Z",
        "mobile_last_sign_in_at": "2024-04-23T07:24:06Z",
        "web_last_active_at": "2024-05-03T10:34:22Z",
        "role": "driver",
        "status": "active",
        "web_current_sign_in_at": "2024-05-03T10:34:22Z",
        "web_last_sign_in_at": "2024-04-23T07:24:07Z",
        "external_ids": [],
        "created_at": "2024-04-23T06:50:38Z",
        "updated_at": "2024-05-13T11:44:17.029744Z"
      }
    },
    {
      "user": {
        "id": 4764848,
        "email": "xyz@nextbillion.ai",
        "first_name": "Jim",
        "last_name": "Welch",
        "group_ids": [126687, 126686],
        "company_reference_id": null,
        "phone": "(614) 596-9141",
        "phone_ext": null,
        "time_zone": "Eastern Time (US & Canada)",
        "metric_units": false,
        "carrier_name": "Nextbillion.ai",
        "carrier_street": "Hyderabad",
        "carrier_city": "",
        "carrier_state": null,
        "carrier_zip": "",
        "violation_alerts": "1_hour",
        "terminal_street": "",
        "terminal_city": "",
        "terminal_state": null,
        "terminal_zip": "",
        "cycle": "us_short_haul_cdl",
        "exception_24_hour_restart": false,
        "exception_8_hour_break": false,
        "exception_wait_time": false,
        "exception_short_haul": false,
        "exception_ca_farm_school_bus": false,
        "cycle2": null,
        "exception_24_hour_restart2": false,
        "exception_8_hour_break2": false,
        "exception_wait_time2": false,
        "exception_short_haul2": false,
        "exception_ca_farm_school_bus2": false,
        "exception_adverse_driving": false,
        "exception_adverse_driving2": false,
        "export_combined": true,
        "export_recap": true,
        "export_odometers": true,
        "username": "jwelch86",
        "driver_company_id": "32134512",
        "minute_logs": false,
        "duty_status": "on_duty",
        "eld_mode": "none",
        "drivers_license_number": "PR32132",
        "drivers_license_state": "OH",
        "yard_moves_enabled": false,
        "personal_conveyance_enabled": false,
        "manual_driving_enabled": false,
        "mobile_last_active_at": "2024-05-13T17:10:38Z",
        "mobile_current_sign_in_at": "2024-05-03T12:30:10Z",
        "mobile_last_sign_in_at": null,
        "web_last_active_at": "2024-05-03T12:30:10Z",
        "role": "driver",
        "status": "active",
        "web_current_sign_in_at": "2024-05-03T12:30:10Z",
        "web_last_sign_in_at": "2024-05-03T12:30:10Z",
        "external_ids": [],
        "created_at": "2024-05-03T12:28:46Z",
        "updated_at": "2024-05-13T17:10:38.544334Z"
      }
    }
  ],
  "pagination": {
    "per_page": 25,
    "page_no": 1,
    "total": 5
  }
}
```

#### Fetch Dispatch Locations

Fetch the list of dispatch locations using the following API request.

##### API Request

```bash
curl --location 'https://api.keeptruckin.com/v1/dispatch_locations' \
--header 'Authorization: Bearer <Access token>'
```

##### API Response

```json
{
  "dispatch_locations": [
    {
      "dispatch_location": {
        "id": 1517113,
        "address1": "13610 S Western Ave",
        "address2": "Gardena",
        "city": "Gardena",
        "country": "US",
        "lat": 33.9080267864571,
        "lon": -118.309012757221,
        "name": "Depot",
        "phone": null,
        "state": "CA",
        "zip": "90249",
        "vendor_id": "V1",
        "arrive_radius": 656.168,
        "depart_radius": 656.168
      }
    },
    {
      "dispatch_location": {
        "id": 1517148,
        "address1": "4304 Arden Drive, El Monte, CA 91731, United States",
        "address2": "Arden Drive",
        "city": "El Monte",
        "country": "US",
        "lat": 34.0843516516,
        "lon": -118.0439987826,
        "name": "Adeline Botsford",
        "phone": null,
        "state": "CA",
        "zip": "91731",
        "vendor_id": "C2",
        "arrive_radius": 656.168,
        "depart_radius": 656.168
      }
    },
    {
      "dispatch_location": {
        "id": 1517182,
        "address1": "6333 Eastern Avenue, Bell Gardens, CA 90201, United States",
        "address2": "Eastern Avenue",
        "city": "Bell Gardens",
        "country": "US",
        "lat": 33.9773340361,
        "lon": -118.1638252632,
        "name": "Adrien Dietrich",
        "phone": null,
        "state": "CA",
        "zip": "90201",
        "vendor_id": "C22",
        "arrive_radius": 656.168,
        "depart_radius": 656.168
      }
    },
    {
      "dispatch_location": {
        "id": 1517226,
        "address1": "8140 Belford Avenue, Los Angeles, CA 90045, United States",
        "address2": "Belford Avenue",
        "city": "Los Angeles",
        "country": "US",
        "lat": 33.964525609,
        "lon": -118.3837089952,
        "name": "Ally Konopelski",
        "phone": null,
        "state": "CA",
        "zip": "90045",
        "vendor_id": "C7",
        "arrive_radius": 656.168,
        "depart_radius": 656.168
      }
    },
    {
      "dispatch_location": {
        "id": 1517259,
        "address1": "10909 South Hoover Street, Los Angeles, CA 90044, United States",
        "address2": "South Hoover Street",
        "city": "Los Angeles",
        "country": "US",
        "lat": 33.9370518181,
        "lon": -118.2866424007,
        "name": "Alyce Heathcote",
        "phone": null,
        "state": "CA",
        "zip": "90044",
        "vendor_id": "C20",
        "arrive_radius": 656.168,
        "depart_radius": 656.168
      }
    },
    {
      "dispatch_location": {
        "id": 1517260,
        "address1": "22400 Lucerne Street, Carson, CA 90745, United States",
        "address2": "Lucerne Street",
        "city": "Carson",
        "country": "US",
        "lat": 33.8228791657,
        "lon": -118.2513537751,
        "name": "Ansel West",
        "phone": null,
        "state": "CA",
        "zip": "90745",
        "vendor_id": "C12",
        "arrive_radius": 656.168,
        "depart_radius": 656.168
      }
    },
    {
      "dispatch_location": {
        "id": 1517261,
        "address1": "5761 Del Amo Boulevard, Lakewood, CA 90713, United States",
        "address2": "Del Amo Boulevard",
        "city": "Lakewood",
        "country": "US",
        "lat": 33.8473154856,
        "lon": -118.11941475,
        "name": "Ayla Kling",
        "phone": null,
        "state": "CA",
        "zip": "90713",
        "vendor_id": "C23",
        "arrive_radius": 656.168,
        "depart_radius": 656.168
      }
    },
    {
      "dispatch_location": {
        "id": 1517262,
        "address1": "12544 Rives Avenue, Downey, CA 90242, United States",
        "address2": "Rives Avenue",
        "city": "Downey",
        "country": "US",
        "lat": 33.9267459262,
        "lon": -118.1549039028,
        "name": "Beaulah Schmidt",
        "phone": null,
        "state": "CA",
        "zip": "90242",
        "vendor_id": "C5",
        "arrive_radius": 656.168,
        "depart_radius": 656.168
      }
    },
    {
      "dispatch_location": {
        "id": 1517263,
        "address1": "10317 Whittier Boulevard, Whittier, CA 90606, United States",
        "address2": "Whittier Boulevard",
        "city": "Whittier",
        "country": "US",
        "lat": 33.994806672,
        "lon": -118.069445333,
        "name": "Caitlyn Krajcik",
        "phone": null,
        "state": "CA",
        "zip": "90606",
        "vendor_id": "C1",
        "arrive_radius": 656.168,
        "depart_radius": 656.168
      }
    },
    {
      "dispatch_location": {
        "id": 1517265,
        "address1": "341 North 1st Street, Montebello, CA 90640, United States",
        "address2": "North 1st Street",
        "city": "Montebello",
        "country": "US",
        "lat": 34.0142845967,
        "lon": -118.099137225,
        "name": "Erica Carroll",
        "phone": null,
        "state": "CA",
        "zip": "90640",
        "vendor_id": "C25",
        "arrive_radius": 656.168,
        "depart_radius": 656.168
      }
    },
    {
      "dispatch_location": {
        "id": 1517273,
        "address1": "2650 Live Oak Street, Huntington Park, CA 90255, United States",
        "address2": "Live Oak Street",
        "city": "Huntington Park",
        "country": "US",
        "lat": 33.9713117009,
        "lon": -118.2234522241,
        "name": "Genoveva Koch",
        "phone": null,
        "state": "CA",
        "zip": "90255",
        "vendor_id": "C3",
        "arrive_radius": 656.168,
        "depart_radius": 656.168
      }
    },
    {
      "dispatch_location": {
        "id": 1517275,
        "address1": "4865 East 1st Street, Los Angeles, CA 90022, United States",
        "address2": "East 1st Street",
        "city": "Los Angeles",
        "country": "US",
        "lat": 34.0375115647,
        "lon": -118.1599203471,
        "name": "Graham Champlin",
        "phone": null,
        "state": "CA",
        "zip": "90022",
        "vendor_id": "C10",
        "arrive_radius": 656.168,
        "depart_radius": 656.168
      }
    },
    {
      "dispatch_location": {
        "id": 1517277,
        "address1": "15502 Dalwood Avenue, Norwalk, CA 90650, United States",
        "address2": "Dalwood Avenue",
        "city": "Norwalk",
        "country": "US",
        "lat": 33.8898854032,
        "lon": -118.0961963449,
        "name": "Isaias Spencer",
        "phone": null,
        "state": "CA",
        "zip": "90650",
        "vendor_id": "C24",
        "arrive_radius": 656.168,
        "depart_radius": 656.168
      }
    },
    {
      "dispatch_location": {
        "id": 1517278,
        "address1": "415 Waltonia Drive, Glendale, CA 91206, United States",
        "address2": "Waltonia Drive",
        "city": "Glendale",
        "country": "US",
        "lat": 34.1516230525,
        "lon": -118.2205332144,
        "name": "Javier Crona",
        "phone": null,
        "state": "CA",
        "zip": "91206",
        "vendor_id": "C17",
        "arrive_radius": 656.168,
        "depart_radius": 656.168
      }
    },
    {
      "dispatch_location": {
        "id": 1517280,
        "address1": "9938 Tecum Road, Downey, CA 90240, United States",
        "address2": "Tecum Road",
        "city": "Downey",
        "country": "US",
        "lat": 33.9593813921,
        "lon": -118.1390891541,
        "name": "Katrina Bogan",
        "phone": null,
        "state": "CA",
        "zip": "90240",
        "vendor_id": "C14",
        "arrive_radius": 656.168,
        "depart_radius": 656.168
      }
    },
    {
      "dispatch_location": {
        "id": 1517283,
        "address1": "14825 Olive Street, Baldwin Park, CA 91706, United States",
        "address2": "Olive Street",
        "city": "Baldwin Park",
        "country": "US",
        "lat": 34.0999260627,
        "lon": -117.9540154996,
        "name": "Keon Ebert",
        "phone": null,
        "state": "CA",
        "zip": "91706",
        "vendor_id": "C18",
        "arrive_radius": 656.168,
        "depart_radius": 656.168
      }
    },
    {
      "dispatch_location": {
        "id": 1517286,
        "address1": "5921 Fullerton Avenue, Buena Park, CA 90621, United States",
        "address2": "Fullerton Avenue",
        "city": "Buena Park",
        "country": "US",
        "lat": 33.874397511,
        "lon": -118.0002348148,
        "name": "Lourdes Johns",
        "phone": null,
        "state": "CA",
        "zip": "90621",
        "vendor_id": "C6",
        "arrive_radius": 656.168,
        "depart_radius": 656.168
      }
    },
    {
      "dispatch_location": {
        "id": 1517287,
        "address1": "Halliburton Road, Hacienda Heights, CA 91745, United States",
        "address2": "Halliburton Road",
        "city": "Hacienda Heights",
        "country": "US",
        "lat": 33.9957748099,
        "lon": -117.9611193144,
        "name": "Maxime Glover",
        "phone": null,
        "state": "CA",
        "zip": "91745",
        "vendor_id": "C16",
        "arrive_radius": 656.168,
        "depart_radius": 656.168
      }
    },
    {
      "dispatch_location": {
        "id": 1517288,
        "address1": "8002 Wilcox Avenue, Cudahy, CA 90201, United States",
        "address2": "Wilcox Avenue",
        "city": "Cudahy",
        "country": "US",
        "lat": 33.9611881852,
        "lon": -118.1786377789,
        "name": "Mitchell Medhurst",
        "phone": null,
        "state": "CA",
        "zip": "90201",
        "vendor_id": "C11",
        "arrive_radius": 656.168,
        "depart_radius": 656.168
      }
    },
    {
      "dispatch_location": {
        "id": 1517289,
        "address1": "500 West 232nd Street, Carson, CA 90745, United States",
        "address2": "West 232nd Street",
        "city": "Carson",
        "country": "US",
        "lat": 33.8154941964,
        "lon": -118.2842403081,
        "name": "Napoleon Sawayn",
        "phone": null,
        "state": "CA",
        "zip": "90745",
        "vendor_id": "C9",
        "arrive_radius": 656.168,
        "depart_radius": 656.168
      }
    },
    {
      "dispatch_location": {
        "id": 1517290,
        "address1": "Los Angeles Zoo, Los Angeles, CA 90027, United States",
        "address2": "Los Angeles Zoo",
        "city": "Los Angeles",
        "country": "US",
        "lat": 34.1480477281,
        "lon": -118.2889987561,
        "name": "Pablo Runte",
        "phone": null,
        "state": "CA",
        "zip": "90027",
        "vendor_id": "C13",
        "arrive_radius": 656.168,
        "depart_radius": 656.168
      }
    },
    {
      "dispatch_location": {
        "id": 1517291,
        "address1": "13512 Imperial Highway, Santa Fe Springs, CA 90670, United States",
        "address2": "Imperial Highway",
        "city": "Santa Fe Springs",
        "country": "US",
        "lat": 33.9158585984,
        "lon": -118.0437357557,
        "name": "Rebecca Terry",
        "phone": null,
        "state": "CA",
        "zip": "90670",
        "vendor_id": "C19",
        "arrive_radius": 656.168,
        "depart_radius": 656.168
      }
    },
    {
      "dispatch_location": {
        "id": 1517292,
        "address1": "15217 Fairgrove Avenue, La Puente, CA 91744, United States",
        "address2": "Fairgrove Avenue",
        "city": "La Puente",
        "country": "US",
        "lat": 34.0437467077,
        "lon": -117.9496315061,
        "name": "Shanie Conn",
        "phone": null,
        "state": "CA",
        "zip": "91744",
        "vendor_id": "C21",
        "arrive_radius": 656.168,
        "depart_radius": 656.168
      }
    },
    {
      "dispatch_location": {
        "id": 1517293,
        "address1": "2511 South Edison Way, Compton, CA 90220, United States",
        "address2": "South Edison Way",
        "city": "Compton",
        "country": "US",
        "lat": 33.8658148115,
        "lon": -118.2286499053,
        "name": "Uriel Collier",
        "phone": null,
        "state": "CA",
        "zip": "90220",
        "vendor_id": "C15",
        "arrive_radius": 656.168,
        "depart_radius": 656.168
      }
    },
    {
      "dispatch_location": {
        "id": 1517294,
        "address1": "Paramount, CA 90723, United States",
        "address2": "United States",
        "city": "Paramount",
        "country": "US",
        "lat": 33.9096142383,
        "lon": -118.1797313262,
        "name": "Vidal Casper",
        "phone": null,
        "state": "CA",
        "zip": "90723",
        "vendor_id": "C8",
        "arrive_radius": 656.168,
        "depart_radius": 656.168
      }
    }
  ],
  "pagination": {
    "per_page": 25,
    "page_no": 1,
    "total": 39
  }
}
```

The fetched information can be depicted on the integration dashboard as follows.

![documentation image](https://static.nextbillion.io/docs-next/integrations/motive/image-2.webp)

> Note: This integration dashboard has been created using the Retool app for demonstration purposes. The actual integration dashboard will have a similar structure and functionality.

By following these steps, you will have successfully set up the Motive Dashboard and fetched the necessary data to proceed with the integration.

### Configuration of Additional Parameters

Additional parameters can be added to fine-tune the optimization process. The following parameters are added to the dashboard.

![documentation image](https://static.nextbillion.io/docs-next/integrations/motive/image-3.webp)

**Shift Start Time**: The time when the driver’s shift begins. This parameter ensures that route planning aligns with the driver’s working hours, preventing assignments before the shift starts.

**Shift End Time**: The time when the driver’s shift ends. This parameter ensures that all planned routes can be completed within the driver’s working hours, avoiding overtime and ensuring compliance with labor regulations.

**Vehicle Fixed Cost**: A fixed cost associated with using a particular vehicle. This can include depreciation, insurance, and other overhead costs. Incorporating this parameter helps in calculating the total cost of the routes more accurately and optimizing the fleet's cost-efficiency.

**Maximum Tasks**: The maximum number of tasks or stops a vehicle can handle during a shift. This ensures that the vehicle is not overloaded and can complete all assigned tasks within the given timeframe.

**Start and End Locations**: The geographical coordinates or addresses where the vehicle starts and ends its route.

**Service Time**: The time required to complete a service at each stop. This includes loading, unloading, and any other activities performed at the stop. Accurate service time estimates ensure that the schedule accounts for all necessary activities and that routes are realistic and achievable within the shift hours.

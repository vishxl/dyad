# Create Optimization Job with NextBillion.ai's Route Optimization API

Prepare and send the API request to NextBillion.ai Route Optimization API to create optimization jobs.

#### API Request

The following API request sends the retrieved and mapped data to the API endpoint.

```bash
curl --request POST \
    --url 'https://api.nextbillion.io/optimization/v2?key=<nextbillion_api_key>'
```

#### API Response

The response will confirm the creation of optimization job.

```json
{
  "id": "1a3905c5163dfc4aa5267e85c177ef7a",
  "message": "Optimization job created",
  "status": "Ok"
}
```

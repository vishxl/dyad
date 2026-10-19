# Create Optimization Job with Route Optimization API

To create an optimization job, you'll need to send a POST request to the NextBillion.ai Route Optimization API. This request will include all necessary parameters and data for the optimization job.

#### API Request

```bash
curl --request POST \
    --url 'https://api.nextbillion.io/optimization/v2?key=<nextbillion.ai_api_key>'
```

Replace <nextbillion.ai_api_key> with your actual API key.

#### API Response

```json
{
  "id": "1a3905c5163dfc4aa5267e85c177ef7a",
  "message": "Optimization job created",
  "status": "Ok"
}
```

Upon successfully sending the request, the API will respond with a unique job `id`, status and a confirmation message indicating the creation of the optimization job.

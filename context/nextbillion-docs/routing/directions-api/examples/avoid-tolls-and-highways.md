# Avoid Tolls & Highways

_Implement Using:_ [Directions Fast API](https://docs.nextbillion.ai/routing/directions-api#directions-fast-api)

To get a route between two points which does not go through a toll road or a highway we can make use of the avoid parameter of the Directions API. The avoid parameter can take multiple values in input and then suggests the best feasible route while avoiding the specified objects/roads. We configure:

- `origin` & `destination` to to denote the starting and end locations of the trip
- `mode` set to “car” to get a route which a car can take
- `avoid` parameter specifying “toll” & “highway” as the criteria

### Request

```bash
curl --location 'https://api.nextbillion.io/directions/json?origin=34.03113938,-118.20745576&destination=34.02842053,-118.26701916&mode=car&key=<your_api_key>&avoid=toll|highway' \
--header 'Content-Type: application/json'
```

### Response

```json
{
  "status": "Ok",
  "routes": [
    {
      "geometry": "cvunEhknpUVy@@El@Zj@ZrAr@NJtAt@xC~AVNx@b@HDDBLFNHNJh@Xl@\\NHZPr@^XNZPRJXLl@ZjB`AlGdDj@Vc@nAGPELa@fAa@lAk@`Ba@nAELGNc@nAmApDSj@Wt@e@vAsA|DIVy@hCKVe@zA]hA[z@Od@c@pAKV[~@ITITGPELg@vA[fAENGTIVGZ@L@JBFBD@?PB|G\\nDPpBHh@DdAFRBGTGRAFCNCR?@Gn@MpACb@ATMvA?dC?H@lA?N?X?`@?v@?j@?`@Al@GhKChB?hB?`@?L?^Aj@X@J?X?fBHL@D?`@@l@@t@B`ABjCHz@BpBBrABV@R?hA@P?p@RnELF?h@Bn@BX@Z@?bF?\\@dD@rA@p@?hA?T@TAxAAz@CjAEl@Cj@Gp@CXKfAQvA?D[|Ba@`Co@tDG\\QdAAFKn@K`AEXGb@Gh@Eb@K|@Gh@Ir@Ir@OtACXCRCXIj@Gh@CVE^ARCNORCPKh@Kn@ELM`@Yl@mAhCc@~@S`@Sb@Ud@u@bBuBlEs@~AgBxDoAhC_@v@IR[p@Wn@]~@aAhCi@zAEJi@xAi@zAKVO^K\\MZSj@IVWr@cAnC_AjCi@rAk@zAQd@M^c@lAWr@[z@KXMZUn@Qd@]`Ai@tAY|@Wv@e@rAe@nAWl@ITa@fAGTIVKVQb@k@xAO\\ELIRm@hBIRIRUj@Un@IVO\\]dAEJOd@ZR^Th@ZHDXPXN\\TlAr@lAr@VNXNb@T`@TTNJF`@TVNGLe@pA",
      "distance": 7733.7,
      "duration": 936.4,
      "legs": [
        {
          "distance": {
            "value": 7733
          },
          "duration": {
            "value": 936
          },
          "steps": []
        }
      ]
    }
  ]
}
```

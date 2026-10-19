# Routes with multiple stops

_Implement Using:_ [Directions Fast API](https://docs.nextbillion.ai/routing/directions-api#directions-fast-api)

In this example, we will configure a request with multiple waypoints or stops that need to be made before the final destination. We will add 3 location coordinates which should be visited before the route ends at the destination location. To accomplish this we configure:

- `origin` to denote the starting point of the trip
- `waypoints` with location coordinates of 3 stops
- `destination` to denote the end point of the trip
- `mode` set to “car” to get a route which a car can take

### Request

```bash
curl --location 'https://api.nextbillion.io/directions/json?origin=34.06179645,-118.28182218&destination=34.01815592,-118.24560423&mode=car&key=<your_api_key>&waypoints=34.05004809,-118.25490318|34.03748485,-118.24975388|34.02888816,-118.24129738' \
--header 'Content-Type: application/json'
```

### Response

```json
{
  "status": "Ok",
  "routes": [
    {
      "geometry": "_u{nE|{|pUa@U[Q[Oa@UHSFQRm@j@cBEEGGGGWQeAm@A{DG]GqCKaDCqBQsGO}E?o@}@i@KGFQDMBIBODUDS@IL}@Hw@Ts@Nc@J]HWFSd@uATo@b@mADOp@mBXy@Ng@HUL_@To@??Xw@f@}ABGNa@T{@Ty@HUV{@Tq@J]Lc@BGFQZcATs@^iAV}@BIJ_@Ne@Ja@V_Ab@sAHWDOVu@XaAf@aBb@{AJ[Lc@Pm@Pq@L_@H[L_@\\gA\\kA`@mA`@uALa@Pi@FQL]Tm@PQJODGFIHIDCLKf@Wh@YXQ^U~@e@ZMZQTKRKFEHENITMHGFEFCPKRKFENMHGNMVWTYR]P_@R_@HOd@u@Zk@dAmANU`BmCr@qAj@|@n@n@FDDDB@D@B@DAHCT_@fAmBd@y@d@^PN`@^h@d@n@j@RRb@`@b@b@\\\\x@x@RPl@f@hAoB`AiBLSt@uAR]d@{@JSz@t@TTf@b@zAvAjAbAlAhAz@v@RPVTJHVVZXf@b@~@z@PNVT\\ZPNVTXXLJfA`Aj@cAXg@Ve@NWZi@Vg@Va@Pa@h@eALUNQFEFGdAgAJKJKdAiA^c@RQr@w@`@i@TW^c@TY`@e@n@y@dBkB~BkCFGVYtA}Af@k@e@e@QSGEFDPRd@d@\\_@LM^a@`@e@f@g@RS\\_@xAeBd@g@hCoCVYRUPUVYDGFILUHKXc@d@s@j@{@Zc@DGJONSTYh@q@f@q@bAoAh@s@PUPULM\\g@b@g@TYZ]T[j@u@PWX]Z_@l@y@h@o@T[z@eAX]\\a@TWPGLAJCH?F?N?J@`@DVN@@nAr@zAz@f@Xl@^vCdBTLt@b@rC`BPJfDnBZNt@b@RJf@\\NFXH^F\\FRDXL^Rn@d@ZV`@XrBzALJRPVg@jAcC|AeDBEL]BEH[H@D@f@@f@@rBFpBDH?F@HBHDDBd@b@DBRPnAhAu@~A",
      "distance": 8241.4,
      "duration": 1480.2,
      "legs": [
        {
          "distance": {
            "value": 3509
          },
          "duration": {
            "value": 528
          },
          "steps": []
        },
        {
          "distance": {
            "value": 1938
          },
          "duration": {
            "value": 493
          },
          "steps": []
        },
        {
          "distance": {
            "value": 1314
          },
          "duration": {
            "value": 227
          },
          "steps": []
        },
        {
          "distance": {
            "value": 1478
          },
          "duration": {
            "value": 230
          },
          "steps": []
        }
      ]
    }
  ]
}
```

Following is a visual representation of the above route on a map. We can observe that the route passes through all the given stops before arriving at the destination.

![documentation image](https://static.nextbillion.io/docs-next/docs/navigation/api/routes-with-multiple-stops.webp)

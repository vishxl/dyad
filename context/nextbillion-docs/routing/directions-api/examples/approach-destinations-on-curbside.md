# Approach destinations on curbside

_Implement Using:_ [Directions Fast API](https://docs.nextbillion.ai/routing/directions-api#directions-fast-api)

In this example, we will make a Directions Fast request to get a route where all stops are to be approached from the driving side only. We use the `approaches` parameter to configure the approach direction for each stop on the route. We prepare the request by adding:

- `origin` & `destination` to to denote the starting and end locations of the trip
- `waypoints` with location coordinates of 3 stops
- `mode` set to “car” to get a route which a car can take
- `approaches` parameter specifying “curbside” approach for all stops including the destination

### Request

```bash
curl --location 'https://api.nextbillion.io/directions/json?origin=34.06179645,-118.28182218&destination=34.01815592,-118.24560423&mode=car&key=<your_api_key>&waypoints=34.05004809,-118.25490318|34.03748485,-118.24975388|34.02888816,-118.24129738&approaches=curb;curb;curb;curb' \
--header 'Content-Type: application/json'
```

### Response

```json
{
  "status": "Ok",
  "routes": [
    {
      "geometry": "_u{nE|{|pUa@U[Q[Oa@UHSFQRm@j@cBEEGGGGWQeAm@A{DG]GqCKaDCqBQsGO}E?o@}@i@KGFQDMBIBODUDS@IL}@Hw@Ts@Nc@J]HWFSd@uATo@b@mADOp@mBXy@Ng@HUL_@To@??Xw@f@}ABGNa@T{@Ty@HUV{@Tq@J]Lc@BGFQZcATs@^iAV}@BIJ_@Ne@Ja@V_Ab@sAHWDOVu@XaAf@aBb@{AJ[Lc@Pm@Pq@L_@H[L_@\\gA\\kA`@mA`@uALa@Pi@FQL]Tm@PQJODGFIHIDCLKf@Wh@YZGZOh@UVKPE\\Mf@W\\OTKLGJCDCDCLEDEFELKPMVORMRMHGJIHIJMPSBEHKLQJOHOFKHSFSJSNYR[FMXk@\\k@~@sBNi@r@qAj@|@n@n@FDDDB@D@B@DAHCT_@fAmBd@y@d@^PN`@^h@d@n@j@RRb@`@b@b@\\\\x@x@RPl@f@dCrBLLn@j@f@b@v@n@~@~@p@l@RRVTv@r@NLNLj@h@x@t@h@d@XXd@`@f@d@NLJJNLBB^\\\\k@d@{@dAmBbAiBfAkBj@cAXg@Ve@NWZi@Vg@Va@Pa@h@eALUNQFEFGdAgAJKJKdAiA^c@RQr@w@`@i@TW^c@TY`@e@n@y@dBkB~BkCFGVYtA}Af@k@e@e@QSGEEG_@a@aAeASSm@o@JEJEJI^g@LOt@aANUxA~@jBjArAz@xAeBd@g@hCoCbAl@d@ZNJxAbAd@ZZRfCzAZRt@j@tAx@n@qBv@kCdAkDlAaEjA{DLa@H]FQFSJULQf@o@r@y@l@u@X]xBkC|AmBnBcCm@_@g@Y{A{@oAs@AAWOiAs@`@g@HHLFF@VBB?bDHvCHN@J?zADtADp@@H@F@\\Jd@LzAb@pBj@\\HJBNFTLx@`@\\Lb@LTLj@ZCdAAt@Cx@AVEFCLE^ANJApAJBJBFBBhCpB~BbBJFc@~@S`@Sb@Ud@RP|@n@pA|@XRp@f@`@XP_@DIFIDInA`AnAfAhF}K",
      "distance": 9294.1,
      "duration": 2078.7,
      "legs": [
        {
          "distance": {
            "value": 3519
          },
          "duration": {
            "value": 691
          },
          "steps": []
        },
        {
          "distance": {
            "value": 1933
          },
          "duration": {
            "value": 584
          },
          "steps": []
        },
        {
          "distance": {
            "value": 2030
          },
          "duration": {
            "value": 465
          },
          "steps": []
        },
        {
          "distance": {
            "value": 1811
          },
          "duration": {
            "value": 337
          },
          "steps": []
        }
      ]
    }
  ]
}
```

Following is a visual representation of the above route on a map

![documentation image](https://static.nextbillion.io/docs-next/docs/navigation/api/approach-destinations-on-curbside.webp)

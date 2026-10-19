# Basic Directions Fast - POST Request

_Implement Using:_ [Directions Fast API](https://docs.nextbillion.ai/routing/directions-api#directions-fast-api)

Let’s see how to build a POST method request for Direction Fast API for the same scenario from the [curbside example](https://docs.nextbillion.ai/routing/directions-api/examples/approach-destinations-on-curbside).

### Request

```bash
curl --location 'https://api.nextbillion.io/directions/json?key=<your_api_key>' \
--header 'Content-Type: application/json' \
--data '{
    "origin": "34.06179645,-118.28182218",
    "destination":"34.01815592,-118.24560423",
    "mode":"car",
 "waypoints":"34.05004809,-118.25490318|34.03748485,-118.24975388|34.02888816,-118.24129738",
    "approaches":"curb;curb;curb;curb"
}'
```

### Response

```json
{
  "status": "Ok",
  "routes": [
    {
      "geometry": "_u{nE|{|pUa@U[Q[Oa@UHSFQRm@j@cBEEGGGGWQeAm@A{DG]GqCKaDCqBQsGO}E?o@}@i@KGFQDMBIBODUDS@IL}@Hw@Ts@Nc@J]HWFSd@uATo@b@mADOp@mBXy@Ng@HUL_@To@??Xw@f@}ABGNa@T{@Ty@HUV{@Tq@J]Lc@BGFQZcATs@^iAV}@BIJ_@Ne@Ja@V_Ab@sAHWDOVu@XaAf@aBb@{AJ[Lc@Pm@Pq@L_@H[L_@\\gA\\kA`@mA`@uALa@Pi@FQL]Tm@PQJODGFIHIDCLKf@Wh@YXQ^U~@e@ZMZQTKRKFEHENITMHGFEFCPKRKFENMHGNMVWTYR]P_@R_@HOd@u@Zk@dAmANU`BmCr@qAj@|@n@n@FDDDB@D@B@DAHCT_@fAmBd@y@d@^PN`@^h@d@n@j@RRb@`@b@b@\\\\x@x@RPl@f@dCrBLLn@j@f@b@v@n@~@~@p@l@RRVTv@r@NLNLj@h@x@t@h@d@XXd@`@f@d@NLJJNLBB^\\\\k@d@{@dAmBbAiBfAkBj@cAXg@Ve@NWZi@Vg@Va@Pa@h@eALUNQFEFGdAgAJKJKdAiA^c@RQr@w@`@i@TW^c@TY`@e@n@y@dBkB~BkCFGVYtA}Af@k@e@e@QSGEEG_@a@aAeASSm@o@JEJEJI^g@LOt@aANUh@q@|@gARUh@u@v@cAV]hBaCPSfAqANSv@cARYb@i@rAeBPSf@m@RY`@k@JQl@w@j@Th@Xh@TTLr@\\b@R^Rh@Vb@g@TYZ]T[j@u@PWX]Z_@l@y@h@o@T[z@eA~@lAPRNPl@v@\\_@zBsCHOoAs@AAWOiAs@`@g@HHLFF@VBB?bDHvCHN@J?zADtADp@@H@F@\\Jd@LzAb@pBj@\\HJBNFTLx@`@\\Lb@LTLj@ZCdAAt@Cx@AVEFCLE^ANJApAJBJBFBBhCpB~BbBJFc@~@S`@Sb@Ud@RP|@n@pA|@XRp@f@`@XP_@DIFIDInA`AnAfAhF}K",
      "distance": 8932.9,
      "duration": 1910.6999999999998,
      "legs": [
        {
          "distance": {
            "value": 3509
          },
          "duration": {
            "value": 607
          },
          "steps": []
        },
        {
          "distance": {
            "value": 1933
          },
          "duration": {
            "value": 562
          },
          "steps": []
        },
        {
          "distance": {
            "value": 1679
          },
          "duration": {
            "value": 383
          },
          "steps": []
        },
        {
          "distance": {
            "value": 1811
          },
          "duration": {
            "value": 357
          },
          "steps": []
        }
      ]
    }
  ]
}
```

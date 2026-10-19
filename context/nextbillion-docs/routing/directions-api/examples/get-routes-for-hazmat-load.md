# Get routes for hazmat load

_Implement Using:_ [Directions Flexible API](https://docs.nextbillion.ai/routing/directions-api#directions-flexible-api)

To get routes for safely transporting hazardous material, use the `hazmat_type` parameter of the Directions Flexible API to avoid unsafe routes for your truck. Users need to provide the type of material that is being carried by the truck to get the legal routes as per the contents of the truck load. In this example, we will generate such a route by configuring:

- `origin` & `destination` to to denote the starting and end locations of the trip
- `mode` set to “truck” to get a route which a car can take
- `hazmat_type` parameter set to “circumstantial”
- `option` set to “flexible”

### Request

```bash
curl --location 'https://api.nextbillion.io/directions/json?origin=34.04990727,-96.37385973&destination=34.14289606,-96.37330388&mode=truck&key=<your_api_key>&option=flexible&hazmat_type=circumstantial' \
--header 'Content-Type: application/json'
```

### Response

```json
{
  "status": "Ok",
  "routes": [
    {
      "geometry": "}iynExzekQPB`@J\\Hz@Rb@Jz@TPF@?z@V??d@L`AX`Cp@TH@?rBdA?@t@R~Br@FB??v@ZdBn@JNdBh@r@R`ATFBhCd@LBfBRzBJ@?\\@`@???t@C??N?fBM~AOzAYTEn@ORG??`@QjAe@^OhAi@FC??LGRIj@Uh@Uj@W??GSGS??KMMKCCIEGCMESGWISGMGQGOIOGSMKGGEIGIGSOQQKKOSOW[e@OC??KQOW??Ye@[i@Wa@??sBkDi@_ACGy@uAuA{BQi@yC{EaE_H??kGqKu@oAm@aAeAeBkAgBmAeBmAcBqAaBQU_AiAuA}Au@{@YYOQ??u@y@SSc@c@?A{@{@iBiBsBkByAqAkA{@IIc@]m@c@uE}CiAw@eDwBiCcBMKiBoAoBsA??q@c@cDwBOMA?oCkBcDwBkScNyGoE??sBuA??[SECWQuDeC}KsH{FyDew@sh@yByA?Ac@YaDwBaD}B_D}B}CaCk@g@q@i@yAkAi@e@a@]_@]}@w@o@k@m@i@gBaBs@q@MMQQ_@]e@e@{@y@i@k@i@g@q@s@w@y@a@c@a@c@m@o@k@o@o@s@]_@Y]e@i@c@e@g@o@m@s@k@s@W[c@i@]a@MQQUa@e@c@m@q@{@cAsAw@cAg@s@[e@g@u@A?u@iA?A_@i@aAuAeBeC??cB}BkBmCwGiJA?eAwAuFsHsCkD?AsBiCm@w@A?[_@{BwCc@k@aEaF_@e@GIWYcCwCcDyDa@e@_@c@EGmD_EaG{GyKoLcKoKgEqEy@}@sEgF{DoEiDcEaD}DaDcE_AkA??w@gAAAc@m@eAwAwAmByCiEyCiEuCmEuCoEsCqEoCsEqCsEqCsEq@iAa@q@oAqBo@eAyAcCeAeBsA{Bs@kA_A}AsAyBcBoCs@mAmAqBcA{AYe@{A}BgA_B}@oAS[]e@gB_Ci@s@iA{A?AQe@A?AGSYQYU_@Q]Ye@oEmI{@}Ae@{@k@eAOYEKGKIOGMKOIQKOKSGOIMIOKSMUIMACEGCGEECEIKcAnAs@z@g@f@??c@h@o@l@SPcBzAg@d@s@f@sA`AID}BnA??y@b@}DdB_E|A{DzAwB`A}@f@m@`@sB~Ai@d@aBlBs@|@e@r@{@xAgAxBo@~AEN??u@`CQn@Sv@S`AYzACR?@[jCIv@IdAC|@EtDAV@vD???P??ElZ?|PErr@ClRGb`@ChO??Apg@??AltA?pV?@C|V@tR?nm@?~E???dK?@?`R???vH?@?pA???r@?tD?zDAn@???rC?dA?|@CjHBzM?tK?t@??@Z???lB?~@??CxCC|C?@S?",
      "distance": 25563.773,
      "duration": 1162.833,
      "start_location": {
        "latitude": 34.04975,
        "longitude": -96.37309
      },
      "end_location": {
        "latitude": 34.14289,
        "longitude": -96.37324
      },
      "legs": [
        {
          "distance": {
            "value": 25563
          },
          "duration": {
            "value": 1162
          },
          "start_location": {
            "latitude": 34.04975,
            "longitude": -96.37309
          },
          "end_location": {
            "latitude": 34.14289,
            "longitude": -96.37324
          },
          "steps": [
            {
              "geometry": "}iynExzekQPB`@J\\Hz@Rb@Jz@TPF@?z@V??d@L`AX`Cp@TH@?rBdA?@t@R~Br@FB??v@ZdBn@JNdBh@r@R`ATFBhCd@LBfBRzBJ@?\\@`@???t@C??N?fBM~AOzAYTEn@ORG??`@QjAe@^OhAi@FC??LGRIj@Uh@Uj@W??",
              "start_location": {
                "latitude": 34.04975,
                "longitude": -96.37309
              },
              "end_location": {
                "latitude": 34.03692,
                "longitude": -96.3747
              },
              "distance": {
                "value": 1500
              },
              "duration": {
                "value": 90
              }
            },
            {
              "geometry": "wyvnEzdfkQGSGS??KMMKCCIEGCMESGWISGMGQGOIOGSMKGGEIGIGSOQQKKOSOW[e@OC??KQOW??Ye@[i@Wa@??sBkDi@_ACGy@uAuA{BQi@yC{EaE_H??kGqKu@oAm@aAeAeBkAgBmAeBmAcBqAaBQU_AiAuA}Au@{@YYOQ??u@y@SSc@c@?A{@{@iBiBsBkByAqAkA{@IIc@]m@c@uE}CiAw@eDwBiCcBMKiBoAoBsA??q@c@cDwBOMA?oCkBcDwBkScNyGoE??sBuA??[SECWQuDeC}KsH{FyDew@sh@yByA?Ac@YaDwBaD}B_D}B}CaCk@g@q@i@yAkAi@e@a@]_@]}@w@o@k@m@i@gBaBs@q@MMQQ_@]e@e@{@y@i@k@i@g@q@s@w@y@a@c@a@c@m@o@k@o@o@s@]_@Y]e@i@c@e@g@o@m@s@k@s@W[c@i@]a@MQQUa@e@c@m@q@{@cAsAw@cAg@s@[e@g@u@A?u@iA?A_@i@aAuAeBeC??cB}BkBmCwGiJA?eAwAuFsHsCkD?AsBiCm@w@A?[_@{BwCc@k@aEaF_@e@GIWYcCwCcDyDa@e@_@c@EGmD_EaG{GyKoLcKoKgEqEy@}@sEgF{DoEiDcEaD}DaDcE_AkA??w@gAAAc@m@eAwAwAmByCiEyCiEuCmEuCoEsCqEoCsEqCsEqCsEq@iAa@q@oAqBo@eAyAcCeAeBsA{Bs@kA_A}AsAyBcBoCs@mAmAqBcA{AYe@{A}BgA_B}@oAS[]e@gB_Ci@s@iA{A?A",
              "start_location": {
                "latitude": 34.03692,
                "longitude": -96.3747
              },
              "end_location": {
                "latitude": 34.12794,
                "longitude": -96.27845
              },
              "distance": {
                "value": 13583
              },
              "duration": {
                "value": 571
              }
            },
            {
              "geometry": "srhoEjksjQQe@A?AGSYQYU_@Q]Ye@oEmI{@}Ae@{@k@eAOYEKGKIOGMKOIQKOKSGOIMIOKSMUIMACEGCGEECEIK",
              "start_location": {
                "latitude": 34.12794,
                "longitude": -96.27846
              },
              "end_location": {
                "latitude": 34.13127,
                "longitude": -96.2732
              },
              "distance": {
                "value": 612
              },
              "duration": {
                "value": 53
              }
            },
            {
              "geometry": "mgioEnjrjQcAnAs@z@g@f@??c@h@o@l@SPcBzAg@d@s@f@sA`AID}BnA??y@b@}DdB_E|A{DzAwB`A}@f@m@`@sB~Ai@d@aBlBs@|@e@r@{@xAgAxBo@~AEN??u@`CQn@Sv@S`AYzACR?@[jCIv@IdAC|@EtDAV@vD???P??ElZ?|PErr@ClRGb`@ChO??Apg@??AltA?pV?@C|V@tR?nm@?~E???dK?@?`R???vH?@?pA???r@?tD?zDAn@???rC?dA?|@CjHBzM?tK?t@??@Z???lB?~@??CxCC|C?@",
              "start_location": {
                "latitude": 34.13127,
                "longitude": -96.2732
              },
              "end_location": {
                "latitude": 34.1428,
                "longitude": -96.37324
              },
              "distance": {
                "value": 9857
              },
              "duration": {
                "value": 444
              }
            },
            {
              "geometry": "ookoEv{ekQS?",
              "start_location": {
                "latitude": 34.1428,
                "longitude": -96.37324
              },
              "end_location": {
                "latitude": 34.1429,
                "longitude": -96.37324
              },
              "distance": {
                "value": 10
              },
              "duration": {
                "value": 3
              }
            },
            {
              "geometry": "cpkoEv{ekQ??",
              "start_location": {
                "latitude": 34.14289,
                "longitude": -96.37324
              },
              "end_location": {
                "latitude": 34.14289,
                "longitude": -96.37324
              },
              "distance": {
                "value": 0
              },
              "duration": {
                "value": 0
              }
            }
          ]
        }
      ]
    }
  ]
}
```

Following is a visual representation of the above route on a map. We can observe that a direct route was avoided and a longer, but legal route was suggested due to the hazmat settings configured in the input request.

![documentation image](https://static.nextbillion.io/docs-next/docs/navigation/api/get-routes-for-hazmat-load.webp)

# Basic Directions Flexible - POST Request

_Implement Using:_ [Directions Flexible API](https://docs.nextbillion.ai/routing/directions-api#directions-flexible-api)

Let’s see how to build a POST method request for Directions Flexible API for the same scenario from the [trips in future](https://docs.nextbillion.ai/routing/directions-api/examples/plan-a-future-trip) example.

### Request

```bash
curl --location 'https://api.nextbillion.io/directions/json?key=<your_api_key>&option=flexible' \
--header 'Content-Type: application/json' \
--data '{
    "origin": "34.06219448,-118.29864009",
    "destination":"34.00680087,-118.27003189",
    "mode":"car",
    "departure_time": 1718640000
}'
```

### Response

```json
{
  "status": "Ok",
  "routes": [
    {
      "geometry": "_u{nEne`qU?H?@?`B??@f@???Z???j@???vBN?R?L?H@J@LDHF??h@^PPJJHFFDHBFBJBFBRBDAL?x@?d@?j@???rJA??`@?d@???X?~A?fE?`D?Z?ZAL???J?TANA@?RCPCNEPE?A@?LENGTIPKFCNIDCNGJG^SPK??NI??VK??PG??TG??LCNCH??Af@A^A??X???T?Z?jEA??hJ?zDAlA?B???t@?B?F@J?D@LBVHJD@?t@V??F@D@NBJ@??R@??V???rA???\\?|@?j@?N?R???`@@L?n@?Z@V@??L?H?B@@?@?J@LBH@F@b@Jp@P??RFFB`@JRD??NBJ@LBH@b@Bn@B??`@?JAP?|@@n@?b@C^Cb@GLC??PEPEHC~@WZI@?LCPC@AJAFA@?HAJ?`@AB?ZA??T@H?R?f@?zAAZ?f@?TA\\?@?VA??X???d@@??DA??XNN?^?@?V?N???\\GJ?XODD???aA??A{@EyAC_@??C_AEw@Cu@?u@AWAUCi@?OCo@A}@?AAm@?k@A}@CwB??IyA?A@mC?[@qA?ADmL?cCBsK@G?k@?qA??@gC?}DAaA?AAoA?O?ABk@??AOCcACsA??C}@Ey@?SBq@??AUEw@Ai@CWIs@AQEWCUCSIa@E]??I[??WsAYcB?AQgAAKCQCQCUCYC]?gB?OAI???q@AM?O?Y??Ae@@iB@u@@KBw@@a@D[@KBOHYJYFMFOHMDKFILQHMTWLQTSNUP[Pc@FSDQHSHUJ_@@?DI@?HGFGPIPGNERALAL?N@V@??J?T?t@Fb@B??~@DbADf@FN@J?J@pAAv@CdAE`@C??PArAIb@A~@GhAY??bAE??nAAdACx@Ct@ChACx@Al@@J?lBNP?H@L@b@FLB??ND??RDl@N`@Nj@Vv@`@~@h@n@^PJ??h@Zh@X`Ah@??~AfA??n@b@~Ar@x@d@b@RVJz@^x@Xf@PXHf@R??lAb@d@RPHPJNHb@V@?\\TRJXPx@d@^Rl@^XN??FBJHLHXNn@^f@Vb@Vh@XZPDBXPVNF@JF^N??f@T??v@XHDD@JB??n@R~@T`ATdARhAPh@H@?l@F\\DL@TBP?vCHt@@??H?R@??L@f@@pE@??Z?|B?^@bBAH?@?RA??Z?j@?zOCn@???x@?V?hD\\h@BbABx@B|BAp@@B?t@Bl@D^DVD??J?@?N??[?A?g@?O?SAS?k@?c@?Y?aA?A?U???]???_B?a@???]?AA}@???aA???g@?K?A?k@?cA??AwB?I?AAgC??AiG?o@???K???o@?W?g@???eB?A?K?I?A?]?A?S?IAm@?W?M?OUIKE??S?SMWK??k@_@i@[m@[??k@Yi@Y??_@SSK??}@i@{A{@UOA??IA_D",
      "distance": 10430.422,
      "duration": 1047.267,
      "start_location": {
        "latitude": 34.06176,
        "longitude": -118.29864
      },
      "end_location": {
        "latitude": 34.00657,
        "longitude": -118.27003
      },
      "legs": [
        {
          "distance": {
            "value": 10430
          },
          "duration": {
            "value": 1047
          },
          "start_location": {
            "latitude": 34.06176,
            "longitude": -118.29864
          },
          "end_location": {
            "latitude": 34.00657,
            "longitude": -118.27003
          },
          "steps": [
            {
              "geometry": "_u{nEne`qU?H?@?`B??@f@???Z???j@???vB",
              "start_location": {
                "latitude": 34.06176,
                "longitude": -118.29864
              },
              "end_location": {
                "latitude": 34.06174,
                "longitude": -118.30035
              },
              "distance": {
                "value": 157
              },
              "duration": {
                "value": 25
              }
            },
            {
              "geometry": "}t{nEdp`qUN?R?L?H@J@LDHF??h@^PPJJHFFDHBFBJBFBRBDAL?x@?d@?j@???rJA??`@?d@???X?~A?fE?`D?Z?ZAL???J?TANA@?RCPCNEPE?A@?LENGTIPKFCNIDCNGJG^SPK??NI??VK??PG??TG??LCNCH??Af@A^A??X???T?Z?jEA??hJ?zDAlA?B???t@?B?F@J?D@LBVHJD@?t@V??F@D@NBJ@??R@??V???rA???\\?|@?j@?N?R???`@@L?n@?Z@V@??L?H?B@@?@?J@LBH@F@b@Jp@P??RFFB`@JRD??NBJ@LBH@b@Bn@B??`@?JAP?|@@n@?b@C^Cb@GLC??PEPEHC~@WZI@?LCPC@AJAFA@?HAJ?`@AB?ZA??T@H?R?f@?zAAZ?f@?TA\\?@?VA??X???d@@??DA??XNN?^?@?V?N???\\GJ?XO",
              "start_location": {
                "latitude": 34.06175,
                "longitude": -118.30035
              },
              "end_location": {
                "latitude": 34.03659,
                "longitude": -118.30025
              },
              "distance": {
                "value": 2847
              },
              "duration": {
                "value": 480
              }
            },
            {
              "geometry": "wwvnEpo`qUDD??",
              "start_location": {
                "latitude": 34.0366,
                "longitude": -118.30025
              },
              "end_location": {
                "latitude": 34.03656,
                "longitude": -118.30028
              },
              "distance": {
                "value": 5
              },
              "duration": {
                "value": 1
              }
            },
            {
              "geometry": "qwvnEvo`qU?aA??A{@EyAC_@??C_AEw@Cu@?u@AWAUCi@?O",
              "start_location": {
                "latitude": 34.03656,
                "longitude": -118.30028
              },
              "end_location": {
                "latitude": 34.03674,
                "longitude": -118.29738
              },
              "distance": {
                "value": 270
              },
              "duration": {
                "value": 29
              }
            },
            {
              "geometry": "sxvnEr}_qUCo@A}@?AAm@?k@A}@CwB??IyA?A@mC?[@qA?ADmL?cCBsK@G?k@?qA??@gC?}DAaA?AAoA?O?A",
              "start_location": {
                "latitude": 34.03674,
                "longitude": -118.29738
              },
              "end_location": {
                "latitude": 34.03679,
                "longitude": -118.28576
              },
              "distance": {
                "value": 1070
              },
              "duration": {
                "value": 68
              }
            },
            {
              "geometry": "}xvnE`u}pUBk@??AOCcACsA??C}@Ey@?SBq@??AUEw@Ai@CWIs@AQEWCUCSIa@E]??I[??WsAYcB?AQgAAKCQCQCUCYC]",
              "start_location": {
                "latitude": 34.03679,
                "longitude": -118.28577
              },
              "end_location": {
                "latitude": 34.03763,
                "longitude": -118.27997
              },
              "distance": {
                "value": 546
              },
              "duration": {
                "value": 34
              }
            },
            {
              "geometry": "e~vnEzp|pU?gB?OAI???q@AM?O?Y??Ae@@iB@u@@KBw@@a@D[@KBOHYJYFM",
              "start_location": {
                "latitude": 34.03763,
                "longitude": -118.27998
              },
              "end_location": {
                "latitude": 34.03738,
                "longitude": -118.27669
              },
              "distance": {
                "value": 311
              },
              "duration": {
                "value": 20
              }
            },
            {
              "geometry": "u|vnEh|{pUFOHMDKFILQHMTWLQTSNUP[Pc@FSDQHSHUJ_@@?",
              "start_location": {
                "latitude": 34.03739,
                "longitude": -118.27669
              },
              "end_location": {
                "latitude": 34.03631,
                "longitude": -118.27497
              },
              "distance": {
                "value": 200
              },
              "duration": {
                "value": 15
              }
            },
            {
              "geometry": "_vvnEpq{pUDI@?HGFGPIPGNERALAL?N@V@??J?T?t@Fb@B??~@DbADf@FN@J?J@",
              "start_location": {
                "latitude": 34.03632,
                "longitude": -118.27497
              },
              "end_location": {
                "latitude": 34.03381,
                "longitude": -118.2749
              },
              "distance": {
                "value": 288
              },
              "duration": {
                "value": 17
              }
            },
            {
              "geometry": "ifvnEbq{pUpAAv@CdAE`@C??PArAIb@A~@GhAY??bAE??nAAdACx@Ct@ChACx@Al@@J?lBNP?H@L@b@FLB??ND??RDl@N`@Nj@Vv@`@~@h@n@^PJ??h@Zh@X`Ah@??~AfA??n@b@~Ar@x@d@b@RVJz@^x@Xf@PXHf@R??lAb@d@RPHPJNHb@V@?\\TRJXPx@d@^Rl@^XN??FBJHLHXNn@^f@Vb@Vh@XZPDBXPVNF@JF^N??f@T??",
              "start_location": {
                "latitude": 34.03381,
                "longitude": -118.2749
              },
              "end_location": {
                "latitude": 34.01799,
                "longitude": -118.28031
              },
              "distance": {
                "value": 1889
              },
              "duration": {
                "value": 72
              }
            },
            {
              "geometry": "mcsnE~r|pUv@XHDD@JB??n@R~@T`ATdARhAPh@H@?l@F\\DL@TBP?vCHt@@??H?R@??L@f@@pE@??Z?|B?^@bBAH?@?RA??Z?j@?zOCn@???x@?V?",
              "start_location": {
                "latitude": 34.01798,
                "longitude": -118.28032
              },
              "end_location": {
                "latitude": 34.00728,
                "longitude": -118.28124
              },
              "distance": {
                "value": 1202
              },
              "duration": {
                "value": 47
              }
            },
            {
              "geometry": "q`qnEvx|pUhD\\h@BbABx@B|BAp@@B?t@Bl@D^DVD??",
              "start_location": {
                "latitude": 34.00728,
                "longitude": -118.28124
              },
              "end_location": {
                "latitude": 34.00391,
                "longitude": -118.28156
              },
              "distance": {
                "value": 378
              },
              "duration": {
                "value": 36
              }
            },
            {
              "geometry": "okpnEvz|pUJ?@?N?",
              "start_location": {
                "latitude": 34.00392,
                "longitude": -118.28156
              },
              "end_location": {
                "latitude": 34.00377,
                "longitude": -118.28156
              },
              "distance": {
                "value": 16
              },
              "duration": {
                "value": 4
              }
            },
            {
              "geometry": "qjpnEvz|pU?[?A?g@?O?SAS?k@?c@?Y?aA?A?U???]???_B?a@???]?AA}@???aA???g@?K?A?k@?cA??AwB?I?AAgC??AiG?o@???K???o@?W?g@???eB?A?K?I?A?]?A?S?IAm@?W?M?O",
              "start_location": {
                "latitude": 34.00377,
                "longitude": -118.28156
              },
              "end_location": {
                "latitude": 34.00383,
                "longitude": -118.27253
              },
              "distance": {
                "value": 831
              },
              "duration": {
                "value": 134
              }
            },
            {
              "geometry": "}jpnEjb{pUUIKE??S?SMWK??k@_@i@[m@[??k@Yi@Y??_@SSK??}@i@{A{@UOA?",
              "start_location": {
                "latitude": 34.00383,
                "longitude": -118.27254
              },
              "end_location": {
                "latitude": 34.00656,
                "longitude": -118.27088
              },
              "distance": {
                "value": 341
              },
              "duration": {
                "value": 44
              }
            },
            {
              "geometry": "_|pnE~wzpU?IA_D",
              "start_location": {
                "latitude": 34.00656,
                "longitude": -118.27088
              },
              "end_location": {
                "latitude": 34.00657,
                "longitude": -118.27003
              },
              "distance": {
                "value": 79
              },
              "duration": {
                "value": 14
              }
            },
            {
              "geometry": "a|pnEtrzpU??",
              "start_location": {
                "latitude": 34.00657,
                "longitude": -118.27003
              },
              "end_location": {
                "latitude": 34.00657,
                "longitude": -118.27003
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

# Get Shortest Route

_Implement Using:_ [Directions Flexible API](https://docs.nextbillion.ai/routing/directions-api#directions-flexible-api)

When the business requirements are such that a shortest route between 2 places is most desirable, users can make use of the `route_type` parameter of Directions Flexible API to generate a route with least traveling distance. To configure the request for this example we add:

- `origin` & `destination` to to denote the starting and end locations of the trip
- `mode` set to “car” to get a route which a car can take
- `route_type` parameter set to “shortest”
- `option` set to “flexible”

### Request

```bash
curl --location 'https://api.nextbillion.io/directions/json?origin=34.03113938,-118.20745576&destination=34.02842053,-118.26701916&mode=car&key=<your_api_key>&route_type=shortest&option=flexible' \
--header 'Content-Type: application/json'
```

### Response

```json
{
  "status": "Ok",
  "routes": [
    {
      "geometry": "avunEhknpUSn@iEzLZPx@b@e@vAELe@rAk@|A]fAOb@Qf@Sh@Qf@M`@Ob@O`@[x@Qf@]dAUt@O\\c@rAKZGPELKZQ^Od@b@RJDJFJDRLbAd@NJxCbBw@zBs@|BrAt@y@lCWp@CH[~@CHYt@ELELGPWv@M`@KXCLAHCLCHCPCLAHGZId@CLETKd@Kl@Mt@Ot@GZAJANAJ?LAL?\\?~A?j@?z@?hAAN?f@?dAAhB?v@?x@?l@?H?dA?BAP?n@?hAAd@AzB?N?T?~@ClC?D@t@?LAh@?x@?Z?Z?fAAdB?d@?lAAd@?f@Ah@Cl@Ar@EzAGdBC\\CdBOlFMhFAd@AV?NAZ?NAPAVAV?FGf@AHIPELGJKRMRUZMP[j@m@~@w@nAq@fAU^ORU^Y`@ZRJFz@h@TN~@n@nAv@d@Zh@Z^Tn@ZPJJDXPLFRJ~@b@t@^j@Th@Xh@TTLr@\\b@R^Rh@Vh@Rb@P\\PVLd@Tl@Z|BfA^VNHTPJHXXbA|@XXXVrAnAhAbAh@h@j@h@jAhAf@b@XXHHf@d@r@p@p@j@NN_@bAEv@CNKf@Sz@GTMb@Y~@Wx@?@GRO`@O`@Ul@I^]p@Yn@Sb@GVADk@nAq@nBc@tBgBzD_AtBSb@Q`@OZO^KRaAdCUl@e@pAUp@GROd@s@zAIRKZiAhDIVGXSp@ELCNSz@Sr@CLWt@Sx@Mf@GTGXCNXRLNb@ZLJNLLJLJ\\V|@p@rAbARPFBZT`@VvAz@hAl@|EnCw@~An@d@HH@H?DIXe@jA`@TVNGLe@pA",
      "distance": 7011.831,
      "duration": 1593.718,
      "start_location": {
        "latitude": 34.03121,
        "longitude": -118.20741
      },
      "end_location": {
        "latitude": 34.02854,
        "longitude": -118.26694
      },
      "legs": [
        {
          "distance": {
            "value": 7011
          },
          "duration": {
            "value": 1593
          },
          "start_location": {
            "latitude": 34.03121,
            "longitude": -118.20741
          },
          "end_location": {
            "latitude": 34.02854,
            "longitude": -118.26694
          },
          "steps": [
            {
              "geometry": "avunEhknpUSn@iEzL",
              "start_location": {
                "latitude": 34.03121,
                "longitude": -118.20741
              },
              "end_location": {
                "latitude": 34.03232,
                "longitude": -118.20987
              },
              "distance": {
                "value": 258
              },
              "duration": {
                "value": 46
              }
            },
            {
              "geometry": "_}unEtznpUZPx@b@",
              "start_location": {
                "latitude": 34.03232,
                "longitude": -118.20987
              },
              "end_location": {
                "latitude": 34.03188,
                "longitude": -118.21014
              },
              "distance": {
                "value": 54
              },
              "duration": {
                "value": 17
              }
            },
            {
              "geometry": "izunEj|npUe@vAELe@rAk@|A]fAOb@Qf@Sh@Qf@M`@Ob@O`@[x@Qf@]dAUt@O\\c@rAKZGPELKZQ^Od@",
              "start_location": {
                "latitude": 34.03188,
                "longitude": -118.21014
              },
              "end_location": {
                "latitude": 34.03436,
                "longitude": -118.21568
              },
              "distance": {
                "value": 581
              },
              "duration": {
                "value": 94
              }
            },
            {
              "geometry": "yivnE~~opUb@RJDJFJDRLbAd@NJxCbB",
              "start_location": {
                "latitude": 34.03437,
                "longitude": -118.21568
              },
              "end_location": {
                "latitude": 34.03272,
                "longitude": -118.2167
              },
              "distance": {
                "value": 205
              },
              "duration": {
                "value": 34
              }
            },
            {
              "geometry": "o_vnEjeppUw@zBs@|B",
              "start_location": {
                "latitude": 34.03271,
                "longitude": -118.2167
              },
              "end_location": {
                "latitude": 34.03325,
                "longitude": -118.21795
              },
              "distance": {
                "value": 130
              },
              "duration": {
                "value": 53
              }
            },
            {
              "geometry": "{bvnEdmppUrAt@",
              "start_location": {
                "latitude": 34.03326,
                "longitude": -118.21795
              },
              "end_location": {
                "latitude": 34.03284,
                "longitude": -118.21822
              },
              "distance": {
                "value": 53
              },
              "duration": {
                "value": 26
              }
            },
            {
              "geometry": "g`vnEznppUy@lCWp@CH[~@CHYt@ELELGPWv@M`@KXCLAHCLCHCPCLAHGZId@CLETKd@Kl@Mt@Ot@GZAJANAJ?LAL?\\?~A?j@?z@?hAAN?f@?dAAhB?v@?x@?l@?H?dA?BAP?n@?hAAd@AzB?N?T?~@ClC?D@t@?LAh@?x@?Z?Z?fAAdB?d@?lAAd@?f@Ah@Cl@Ar@EzAGdBC\\CdBOlFMhFAd@AV?NAZ?NAPAVAV?FGf@AHIPELGJKRMRUZMP[j@m@~@w@nAq@fAU^ORU^Y`@",
              "start_location": {
                "latitude": 34.03284,
                "longitude": -118.21822
              },
              "end_location": {
                "latitude": 34.03678,
                "longitude": -118.24116
              },
              "distance": {
                "value": 2230
              },
              "duration": {
                "value": 464
              }
            },
            {
              "geometry": "{xvnEf~tpUZRJFz@h@TN~@n@nAv@d@Zh@Z^Tn@ZPJJDXPLFRJ~@b@t@^j@Th@Xh@TTLr@\\b@R^Rh@Vh@Rb@P\\PVLd@Tl@Z|BfA^VNHTPJHXXbA|@XXXVrAnAhAbAh@h@j@h@jAhAf@b@XXHHf@d@r@p@p@j@NN",
              "start_location": {
                "latitude": 34.03678,
                "longitude": -118.24116
              },
              "end_location": {
                "latitude": 34.02642,
                "longitude": -118.24874
              },
              "distance": {
                "value": 1350
              },
              "duration": {
                "value": 347
              }
            },
            {
              "geometry": "extnErmvpU_@bA",
              "start_location": {
                "latitude": 34.02643,
                "longitude": -118.24874
              },
              "end_location": {
                "latitude": 34.02659,
                "longitude": -118.24908
              },
              "distance": {
                "value": 36
              },
              "duration": {
                "value": 7
              }
            },
            {
              "geometry": "eytnEvovpUEv@CNKf@Sz@GTMb@Y~@Wx@?@GRO`@O`@Ul@I^]p@Yn@Sb@",
              "start_location": {
                "latitude": 34.02659,
                "longitude": -118.24908
              },
              "end_location": {
                "latitude": 34.02789,
                "longitude": -118.25235
              },
              "distance": {
                "value": 338
              },
              "duration": {
                "value": 41
              }
            },
            {
              "geometry": "kaunEddwpUGVADk@nAq@nBc@tBgBzD_AtBSb@Q`@OZO^KRaAdCUl@e@pAUp@GROd@",
              "start_location": {
                "latitude": 34.0279,
                "longitude": -118.25235
              },
              "end_location": {
                "latitude": 34.03071,
                "longitude": -118.25818
              },
              "distance": {
                "value": 624
              },
              "duration": {
                "value": 184
              }
            },
            {
              "geometry": "}runErhxpUs@zAIRKZiAhDIVGXSp@ELCNSz@Sr@CLWt@Sx@Mf@GTGXCN",
              "start_location": {
                "latitude": 34.03071,
                "longitude": -118.25818
              },
              "end_location": {
                "latitude": 34.0323,
                "longitude": -118.26208
              },
              "distance": {
                "value": 403
              },
              "duration": {
                "value": 51
              }
            },
            {
              "geometry": "{|unE`aypUXRLNb@ZLJNLLJLJ\\V|@p@rAbARPFBZT`@VvAz@hAl@|EnC",
              "start_location": {
                "latitude": 34.0323,
                "longitude": -118.26209
              },
              "end_location": {
                "latitude": 34.02838,
                "longitude": -118.26496
              },
              "distance": {
                "value": 509
              },
              "duration": {
                "value": 152
              }
            },
            {
              "geometry": "kdunE~rypUw@~A",
              "start_location": {
                "latitude": 34.02838,
                "longitude": -118.26496
              },
              "end_location": {
                "latitude": 34.02865,
                "longitude": -118.26544
              },
              "distance": {
                "value": 54
              },
              "duration": {
                "value": 14
              }
            },
            {
              "geometry": "cfunE~uypUn@d@HH@H?DIXe@jA",
              "start_location": {
                "latitude": 34.02866,
                "longitude": -118.26544
              },
              "end_location": {
                "latitude": 34.0286,
                "longitude": -118.26627
              },
              "distance": {
                "value": 100
              },
              "duration": {
                "value": 25
              }
            },
            {
              "geometry": "weunEd{ypU`@TVN",
              "start_location": {
                "latitude": 34.02859,
                "longitude": -118.26627
              },
              "end_location": {
                "latitude": 34.0283,
                "longitude": -118.26646
              },
              "distance": {
                "value": 36
              },
              "duration": {
                "value": 9
              }
            },
            {
              "geometry": "}cunEj|ypUGLe@pA",
              "start_location": {
                "latitude": 34.0283,
                "longitude": -118.26646
              },
              "end_location": {
                "latitude": 34.02854,
                "longitude": -118.26694
              },
              "distance": {
                "value": 50
              },
              "duration": {
                "value": 21
              }
            },
            {
              "geometry": "keunEj_zpU??",
              "start_location": {
                "latitude": 34.02854,
                "longitude": -118.26694
              },
              "end_location": {
                "latitude": 34.02854,
                "longitude": -118.26694
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

Following is a visual representation of the above route on a map. We can observe that the highway route which could have been faster but lengthier, is avoided because of the “route_type” setting.

![documentation image](https://static.nextbillion.io/docs-next/docs/navigation/api/get-shortest-route.webp)

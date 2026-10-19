# Basic Directions Fast Request

_Implement Using:_ [Directions Fast API](https://docs.nextbillion.ai/routing/directions-api#directions-fast-api)

To create a simple Directions Fast request we will provide an `origin` from where a trip starts and a `destination` where it ends. We also set \`mode=car’ to get a legal route which a car can take. Once a request is submitted successfully, the API responds with a route geometry and the trip duration and distance information.

### Request

```bash
curl --location 'https://api.nextbillion.io/directions/json?origin=34.05456317,-118.31528428&destination=33.96763110,-118.23215346&mode=car&key=<your_api_key>' \
--header 'Content-Type: application/json'
```

### Response

```json
{
  "status": "Ok",
  "routes": [
    {
      "geometry": "egznEnmcqU?mEj@?X?r@BZBF@VDHBNDPHNFJF@@NJNLRNbAz@VVLJ`@ZJHHDDBXNb@P^LfDhAVHfA^n@T`AZlBl@XJnC|@PFrBp@RHHBLDTHXHTFPDNBJ@XBT?nDAr@?tA?vA?|CAj@?`A?jA?\\?X?N?f@?|AAvD?hA?F?d@?`@?j@?P?T?p@?P?J?R?r@AjD?R?j@?P?JHd@@T?n@AT@f@@J?XAH?N?\\??EAE?C?CSeCQuBOwBCWKwAKaBMqAAe@CkBCq@GkDAuBAuACWAa@AyBAaBAeBCa@CKES?_@Ac@?u@@yCDwM?eB?U?U@yE@uC@}ABqE@}A?w@?y@?_@B_C?g@@}BBsD?oA?a@?a@@_@?aA?q@@_B@oD@mC?[@sABmL@cCBsK?G@k@?qA@gC?}DAcAAoA?QCe@Cu@CYCk@Ck@I_AKqAEa@Gk@MeAMcAOmACSG]Gm@AGGc@Ea@Gi@OsAKmACWAIKeBG}@Ek@AYEm@?GAWAUG{AAy@OmICeA?WCyBCmB?_@?_@?Y?W?W@Q@Q?QBQ@SDk@DYBUBUFWHc@F_@Le@Jc@L]HSBKDMHQHQXq@d@aAJQx@wAf@y@PWNWh@{@\\m@HMLOLWR[`@o@hBeDHMFMNWJWr@{AFKZq@JSl@qAZs@n@wAP]p@wAd@eATg@Te@NY\\w@Vg@Te@FQJUJWFOXw@^aADOTu@XgA\\sA`@oBl@_DFWLk@DWLg@VgAH_@HYDMHYDSJ]HUNi@Nc@L]Pg@BMPc@L[^aA`@eAP_@Rc@n@{AvAaDv@eBp@{AlAqC\\u@^}@Rc@HQh@oAf@iATc@b@aAr@{AlAgB^s@P[PYNWP[lAuBVc@Zg@NW|@yAVc@`@{@Vc@Jm@Fc@NcAViB@G`@aDB[Fm@Ba@@]?m@?e@?g@Ae@Iw@?]HuA@[?UEgCA[@SBSDQFQHOHMBCLKLI`@Yz@i@VQNOJOHOFQBSBW@Y?i@p@DpBBP@j@@T@r@@X@nADH@t@Bt@@T@X@X@t@@J@fELxC?bD@RAr@@JHn@@d@?Z?F?P?P?X?f@?N?L?d@@T@P@b@Av@?xDEhAA~FI|CCnCGdBGlAC`@An@A\\AV?l@Aj@Ch@AZAF?XAf@AhBGbBIhBGpAGPAh@Cf@Eb@Al@Cp@En@A~@CVA\\A`AChBGrBIdFSlBIjBGbEOjAEdFUl@ATA|@EpBGjEQhAE|AIf@CnAGr@Cl@CrAGLAX?dEMn@CZC~@Ix@G`@EvAKXCHAPAVCf@Gx@KXCh@GxAQhAQNAh@KD?XGTCVGTC\\Ed@EjAOfC[x@MvBYlBW^GNCr@IzASVEZEpAQNALC|@ILC~@QHATEb@GLAj@In@KRCbAMh@ILCh@GNCVCrASxAQZEf@IdDc@rAStAQf@Gj@KVCr@Mz@K`@GJAPCt@IRCTCRCfAINARANAl@CTCL?j@Gr@G`AO^IhBUpDe@nAMdCc@vAQvB[`AMxAUTCDAr@MHANC^GAU?W@g@Ak@?g@?a@]A??",
      "distance": 16213.4,
      "duration": 1305.6,
      "legs": [
        {
          "distance": {
            "value": 16213
          },
          "duration": {
            "value": 1305
          },
          "steps": []
        }
      ]
    }
  ]
}
```

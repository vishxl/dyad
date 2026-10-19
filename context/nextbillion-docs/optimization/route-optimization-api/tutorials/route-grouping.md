# Route Grouping

Route Grouping is a powerful feature which deals with how a route plan is actually executed and helps users in achieving highly efficient routes. When used, route grouping attributes tune the algorithm to avoid, as much as possible, overlapping of different routes as well as any back and forth movement of vehicles on a road segment. Using this feature aids in streamlining the execution of optimized route plans to achieve highly efficient routes and consequent cost savings. However, a caveat regarding the feature is that it works well with a large number of orders and its impact might not be apparent for a smaller set of tasks and vehicles. In the following example we will take a large set of vehicles and tasks to bring out the impact of this powerful feature.

## Setup

We will take a set of 180 tasks scattered across Los Angeles and 4 vehicles to fulfill them. We will define the locations, jobs, vehicles and options attributes one by one.

### Locations

We start by adding all the 180 task locations and another 4 locations which are the starting points for the vehicles.

```json
    "locations": {
        "id": 1,
        "location": [
            "33.9257000241,-118.05427619934",
            "33.90917560312,-118.14491340637",
            "34.0628996039,-117.91557380676",
            "33.93652463118,-118.09616157532",
            "34.08280642214,-117.87574836731",
            "33.76830333174,-118.32893440247",
            "34.05607333226,-117.96089241028",
            "33.94962626197,-118.31520149231",
            "33.99119633927,-118.33580085754",
            "33.87440688089,-118.04328987122",
            "33.81851926805,-117.86201545715",
            "34.11578456252,-118.04809638977",
            "33.92683952121,-118.20121833801",
            "33.86984599729,-118.00346443176",
            "33.78143079452,-117.94647285461",
            "33.97126801612,-118.24653694153",
            "34.01396584407,-118.35022041321",
            "33.76430761773,-117.97462532043",
            "33.79969174384,-118.13392707825",
            "34.03388415286,-118.44223091125",
            "34.03900524804,-118.29734870911",
            "33.93766398347,-117.95608589172",
            "34.09304239265,-118.21220466614",
            "34.01453500348,-118.40515205383",
            "34.08678722439,-118.24585029602",
            "34.07768797282,-118.024063797",
            "33.98037868641,-117.86476203918",
            "34.08621854981,-118.05290290833",
            "33.89150802366,-118.17237922668",
            "34.02762461669,-117.82630989075",
            "34.0179498798,-118.463516922",
            "34.04071221106,-118.22799751282",
            "33.8909380408,-118.31176826477",
            "33.82422376039,-118.02749702454",
            "33.88979806364,-118.07075569153",
            "33.9222814413,-118.11744758606",
            "33.85787251839,-117.93960639954",
            "34.05664220923,-117.94372627258",
            "33.93310648284,-118.15933296204",
            "33.8333501566,-117.79335090637",
            "34.05550445148,-117.86338874817",
            "33.8036858073,-118.28430244446",
            "33.95304374705,-118.28086921692",
            "34.04469499118,-117.96569892883",
            "33.83506124743,-118.28086921692",
            "34.02193372856,-117.86407539368",
            "34.11862690393,-117.95951911926",
            "33.94848706977,-118.34884712219",
            "33.84817847242,-118.07487556458",
            "33.74489721412,-117.90458747864",
            "34.11976381374,-118.00483772278",
            "33.98037868641,-118.21151802063",
            "33.92171166417,-117.92450019836",
            "33.79113240879,-117.90046760559",
            "34.0503843526,-117.76245185852",
            "33.94051229749,-118.23967048645",
            "34.02876274853,-118.33992073059",
            "33.85730231085,-118.24997016907",
            "33.73975843056,-117.96569892883",
            "34.05265999028,-118.31657478333",
            "33.86015331049,-118.38592597961",
            "33.82080111065,-118.06114265442",
            "34.09076783949,-118.17993232727",
            "33.96215636963,-118.41407844543",
            "33.93025792109,-118.04397651672",
            "33.81680784615,-117.93960639954",
            "34.07711923714,-118.32138130188",
            "34.07313798041,-118.06114265442",
            "33.90005730957,-117.89016792297",
            "33.80425637258,-118.02955696106",
            "34.09019919165,-117.93823310852",
            "33.91829292132,-118.25546333313",
            "34.0344531787,-118.24928352356",
            "33.91316454986,-118.2788092804",
            "34.06688134177,-118.1476599884",
            "34.0105508075,-118.09959480286",
            "33.84304588505,-117.97874519348",
            "34.04469499118,-117.89566108704",
            "33.95930877992,-118.14148017883",
            "33.99575072853,-118.2788092804",
            "34.05095326775,-117.8833014679",
            "33.80596804558,-118.33305427551",
            "34.08451250316,-117.89909431458",
            "33.82764627313,-118.30352851868",
            "34.00770483876,-117.85858222961",
            "34.11351062062,-117.91969367981",
            "33.98037868641,-118.30696174622",
            "33.99404286117,-117.96913215637",
            "33.74603912421,-117.93136665344",
            "34.11066810727,-118.10989448547",
            "33.99973561887,-118.19297859192",
            "33.89834752096,-117.94235298157",
            "33.81851926805,-117.81807014465",
            "34.03160801132,-117.76588508606",
            "34.04640183969,-118.35434028625",
            "33.7808600771,-118.38249275208",
            "34.10270856174,-117.85858222961",
            "34.07655049763,-118.3495337677",
            "34.03843625273,-118.26713630676",
            "33.81680784615,-118.37356636047",
            "33.91715330989,-118.01445075989",
            "34.04697078156,-118.42163154602",
            "33.97126801612,-118.37768623352",
            "33.89264797797,-118.05152961731",
            "33.78999109946,-117.99865791321",
            "34.07598175431,-118.29048225403",
            "34.01396584407,-118.42643806458",
            "34.09247376009,-117.96226570129",
            "33.92285121463,-118.22456428528",
            "34.04924651086,-118.18061897278",
            "33.8470379241,-118.34747383118",
            "33.83277978538,-118.00483772278",
            "34.05265999028,-118.14079353333",
            "33.99347356442,-118.07556221008",
            "34.05095326775,-117.91214057922",
            "33.86642517466,-118.13049385071",
            "34.04753971961,-117.81257698059",
            "33.78713775956,-118.34678718567",
            "33.87725730938,-118.27606269836",
            "33.80197408864,-118.22525093079",
            "34.08792456209,-117.91694709778",
            "33.85217027165,-118.18542549133",
            "34.04298810832,-117.98423835754",
            "34.00372032229,-118.30009529114",
            "33.99575072853,-117.93479988098",
            "33.78200150814,-117.83866950989",
            "34.11578456252,-118.07968208313",
            "33.92285121463,-118.3763129425",
            "33.8333501566,-118.14491340637",
            "33.79855054862,-117.82150337219",
            "33.99688928771,-118.25614997864",
            "33.73404830999,-118.34404060364",
            "34.09133648351,-117.83386299133",
            "34.07086289255,-118.37768623352",
            "34.04071221106,-118.28361579895",
            "33.93481557416,-117.9979712677",
            "33.78942043909,-118.17443916321",
            "34.05891767893,-118.40103218079",
            "34.00599721173,-118.44978401184",
            "33.9752540545,-118.04672309875",
            "33.808250223,-117.96981880188",
            "34.0014433718,-118.42163154602",
            "33.77344040457,-118.13118049622",
            "34.07939415697,-118.08654853821",
            "33.8977775838,-117.8311164093",
            "33.91829292132,-117.85858222961",
            "34.03559121894,-118.19503852844",
            "33.85901292206,-118.32756111145",
            "33.9758234733,-117.892914505",
            "34.07541300717,-118.1208808136",
            "33.87668723129,-117.90252754211",
            "33.85616188435,-118.16551277161",
            "33.88295788074,-118.10028144836",
            "33.85231240478,-118.21718233109",
            "34.03616023333,-117.83523628235",
            "33.97069856681,-118.09547492981",
            "33.9758234733,-118.27674934387",
            "33.84304588505,-118.25752326965",
            "34.01225834296,-117.89840766907",
            "34.0412811911,-118.00003120422",
            "33.89948738384,-118.33786079407",
            "34.00428955037,-118.22387763977",
            "33.7597408593,-117.8750617218",
            "34.11009959314,-117.88810798645",
            "33.8977775838,-118.39004585266",
            "33.82365332828,-118.19229194641",
            "33.82422376039,-117.89016792297",
            "34.06915653655,-117.78579780579",
            "33.96101734518,-118.18611213684",
            "33.88067769789,-117.96501228333",
            "33.8675654641,-117.79678413391",
            "34.02477922033,-118.37356636047",
            "33.74775196084,-118.01719734192",
            "33.99461215411,-118.43673774719",
            "33.95475243813,-118.02063056946",
            "33.82137156178,-118.10714790344",
            "34.10213999412,-118.15933296204",
            "34.00770483876,-118.38523933411",
            "33.84646764422,-117.8833014679",
            "33.78999109946,-118.09341499329",
            "33.79626811253,-117.92450019836",
            "34.03160801132,-117.91557380676",
            "33.94051229749,-118.12706062317",
            "33.91658349846,-118.32893440247"
        ]
    }
```

A distribution of all jobs and vehicle’s starting point when shown on the maps looks like below

![documentation image](https://static.nextbillion.io/docs-next/docs/route-optimization/route-grouping-3.webp)

### Jobs

Next we configure each of the 180 delivery tasks. For each task we add:

- A unique identifier
- Location index
- Delivery quantity
- A service time to carry out the delivery

Following is the `jobs` JSON used in the example

```json
    "jobs": [
        {
            "id": 1,
            "location_index": 0,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 2,
            "location_index": 1,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 3,
            "location_index": 2,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 4,
            "location_index": 3,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 5,
            "location_index": 4,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 6,
            "location_index": 5,
            "service": 20,
            "delivery": [
                1
            ]
        },
        {
            "id": 7,
            "location_index": 6,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 8,
            "location_index": 7,
            "service": 20,
            "delivery": [
                1
            ]
        },
        {
            "id": 9,
            "location_index": 8,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 10,
            "location_index": 9,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 11,
            "location_index": 10,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 12,
            "location_index": 11,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 13,
            "location_index": 12,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 14,
            "location_index": 13,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 15,
            "location_index": 14,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 16,
            "location_index": 15,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 17,
            "location_index": 16,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 18,
            "location_index": 17,
            "service": 20,
            "delivery": [
                1
            ]
        },
        {
            "id": 19,
            "location_index": 18,
            "service": 20,
            "delivery": [
                1
            ]
        },
        {
            "id": 20,
            "location_index": 19,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 21,
            "location_index": 20,
            "service": 20,
            "delivery": [
                1
            ]
        },
        {
            "id": 22,
            "location_index": 21,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 23,
            "location_index": 22,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 24,
            "location_index": 23,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 25,
            "location_index": 24,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 26,
            "location_index": 25,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 27,
            "location_index": 26,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 28,
            "location_index": 27,
            "service": 20,
            "delivery": [
                1
            ]
        },
        {
            "id": 29,
            "location_index": 28,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 30,
            "location_index": 29,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 31,
            "location_index": 30,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 32,
            "location_index": 31,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 33,
            "location_index": 32,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 34,
            "location_index": 33,
            "service": 20,
            "delivery": [
                1
            ]
        },
        {
            "id": 35,
            "location_index": 34,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 36,
            "location_index": 35,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 37,
            "location_index": 36,
            "service": 20,
            "delivery": [
                1
            ]
        },
        {
            "id": 38,
            "location_index": 37,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 39,
            "location_index": 38,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 40,
            "location_index": 39,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 41,
            "location_index": 40,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 42,
            "location_index": 41,
            "service": 20,
            "delivery": [
                1
            ]
        },
        {
            "id": 43,
            "location_index": 42,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 44,
            "location_index": 43,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 45,
            "location_index": 44,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 46,
            "location_index": 45,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 47,
            "location_index": 46,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 48,
            "location_index": 47,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 49,
            "location_index": 48,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 50,
            "location_index": 49,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 51,
            "location_index": 50,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 52,
            "location_index": 51,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 53,
            "location_index": 52,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 54,
            "location_index": 53,
            "service": 20,
            "delivery": [
                1
            ]
        },
        {
            "id": 55,
            "location_index": 54,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 56,
            "location_index": 55,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 57,
            "location_index": 56,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 58,
            "location_index": 57,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 59,
            "location_index": 58,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 60,
            "location_index": 59,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 61,
            "location_index": 60,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 62,
            "location_index": 61,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 63,
            "location_index": 62,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 64,
            "location_index": 63,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 65,
            "location_index": 64,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 66,
            "location_index": 65,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 67,
            "location_index": 66,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 68,
            "location_index": 67,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 69,
            "location_index": 68,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 70,
            "location_index": 69,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 71,
            "location_index": 70,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 72,
            "location_index": 71,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 73,
            "location_index": 72,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 74,
            "location_index": 73,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 75,
            "location_index": 74,
            "service": 30,
            "delivery": [
                1
            ]
        },
        {
            "id": 76,
            "location_index": 75,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 77,
            "location_index": 76,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 78,
            "location_index": 77,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 79,
            "location_index": 78,
            "service": 20,
            "delivery": [
                1
            ]
        },
        {
            "id": 80,
            "location_index": 79,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 81,
            "location_index": 80,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 82,
            "location_index": 81,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 83,
            "location_index": 82,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 84,
            "location_index": 83,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 85,
            "location_index": 84,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 86,
            "location_index": 85,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 87,
            "location_index": 86,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 88,
            "location_index": 87,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 89,
            "location_index": 88,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 90,
            "location_index": 89,
            "service": 20,
            "delivery": [
                1
            ]
        },
        {
            "id": 91,
            "location_index": 90,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 92,
            "location_index": 91,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 93,
            "location_index": 92,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 94,
            "location_index": 93,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 95,
            "location_index": 94,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 96,
            "location_index": 95,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 97,
            "location_index": 96,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 98,
            "location_index": 97,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 99,
            "location_index": 98,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 100,
            "location_index": 99,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 101,
            "location_index": 100,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 102,
            "location_index": 101,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 103,
            "location_index": 102,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 104,
            "location_index": 103,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 105,
            "location_index": 104,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 106,
            "location_index": 105,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 107,
            "location_index": 106,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 108,
            "location_index": 107,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 109,
            "location_index": 108,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 110,
            "location_index": 109,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 111,
            "location_index": 110,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 112,
            "location_index": 111,
            "service": 20,
            "delivery": [
                1
            ]
        },
        {
            "id": 113,
            "location_index": 112,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 114,
            "location_index": 113,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 115,
            "location_index": 114,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 116,
            "location_index": 115,
            "service": 20,
            "delivery": [
                1
            ]
        },
        {
            "id": 117,
            "location_index": 116,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 118,
            "location_index": 117,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 119,
            "location_index": 118,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 120,
            "location_index": 119,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 121,
            "location_index": 120,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 122,
            "location_index": 121,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 123,
            "location_index": 122,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 124,
            "location_index": 123,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 125,
            "location_index": 124,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 126,
            "location_index": 125,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 127,
            "location_index": 126,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 1288,
            "location_index": 127,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 128,
            "location_index": 128,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 129,
            "location_index": 129,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 130,
            "location_index": 130,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 131,
            "location_index": 131,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 132,
            "location_index": 132,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 133,
            "location_index": 133,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 134,
            "location_index": 134,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 135,
            "location_index": 135,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 136,
            "location_index": 136,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 137,
            "location_index": 137,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 138,
            "location_index": 138,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 139,
            "location_index": 139,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 140,
            "location_index": 140,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 141,
            "location_index": 141,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 142,
            "location_index": 142,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 143,
            "location_index": 143,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 144,
            "location_index": 144,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 145,
            "location_index": 145,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 146,
            "location_index": 146,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 147,
            "location_index": 147,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 148,
            "location_index": 148,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 149,
            "location_index": 149,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 150,
            "location_index": 150,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 151,
            "location_index": 151,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 152,
            "location_index": 152,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 153,
            "location_index": 153,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 154,
            "location_index": 154,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 155,
            "location_index": 155,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 156,
            "location_index": 156,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 157,
            "location_index": 157,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 158,
            "location_index": 158,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 159,
            "location_index": 159,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 160,
            "location_index": 160,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 161,
            "location_index": 161,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 162,
            "location_index": 162,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 163,
            "location_index": 163,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 164,
            "location_index": 164,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 165,
            "location_index": 165,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 166,
            "location_index": 166,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 167,
            "location_index": 167,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 168,
            "location_index": 168,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 169,
            "location_index": 169,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 170,
            "location_index": 170,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 171,
            "location_index": 171,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 172,
            "location_index": 172,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 173,
            "location_index": 173,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 174,
            "location_index": 174,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 175,
            "location_index": 175,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 176,
            "location_index": 176,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 177,
            "location_index": 177,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 178,
            "location_index": 178,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 179,
            "location_index": 179,
            "service": 10,
            "delivery": [
                1
            ]
        }
    ]
```

### Vehicles

Next, we add the details of the 4 vehicles that will be responsible for fulfilling these tasks. For each of the vehicles we add:

- A unique ID
- A `start_index` and `end_index` to denote the points from where the vehicle starts and ends its trip.
- A capacity for each vehicle

Once the vehicle and their properties are defined, the resulting `vehicles` JSON is:

```json
    "vehicles": [
        {
            "id": 1,
            "start_index": 180,
            "end_index": 180,
            "capacity": [
                50
            ]
        },
        {
            "id": 2,
            "start_index": 181,
            "end_index": 181,
            "capacity": [
                50
            ]
        },
        {
            "id": 3,
            "start_index": 182,
            "end_index": 182,
            "capacity": [
                50
            ]
        },
        {
            "id": 4,
            "start_index": 183,
            "end_index": 183,
            "capacity": [
                50
            ]
        }
    ]
```

### Options

And lastly, we configure the parameters for route grouping. For our example, we allow:

- A straight-line distance of 1500 meters as the diameter to group the routes together so that they don’t cross each other
- A penalty factor of 100 to be applied for any routes which violate the route grouping zones
- We use the “distance” as the cost to be minimized

Once the constraint properties are defined, the resulting `options` JSON is:

```json
"options": {
  "objective": {
    "travel_cost": "distance"
  },
  "grouping": {
      "route_grouping": {
      "zone_diameter": 1500,
      "penalty_factor": 100
    }
    }
}
```

## Optimization POST Request

Now let’s put all these components together and create the final POST request that we will submit to the optimizer.

```json

curl --location 'https://api.nextbillion.io/optimization/v2?key=<your_api_key>' \
--header 'Content-Type: application/json' \
--data '{
    "description": "Route Grouping Example",
    "locations": {
        "id": 1,
        "location": [
            "33.9257000241,-118.05427619934",
            "33.90917560312,-118.14491340637",
            "34.0628996039,-117.91557380676",
            "33.93652463118,-118.09616157532",
            "34.08280642214,-117.87574836731",
            "33.76830333174,-118.32893440247",
            "34.05607333226,-117.96089241028",
            "33.94962626197,-118.31520149231",
            "33.99119633927,-118.33580085754",
            "33.87440688089,-118.04328987122",
            "33.81851926805,-117.86201545715",
            "34.11578456252,-118.04809638977",
            "33.92683952121,-118.20121833801",
            "33.86984599729,-118.00346443176",
            "33.78143079452,-117.94647285461",
            "33.97126801612,-118.24653694153",
            "34.01396584407,-118.35022041321",
            "33.76430761773,-117.97462532043",
            "33.79969174384,-118.13392707825",
            "34.03388415286,-118.44223091125",
            "34.03900524804,-118.29734870911",
            "33.93766398347,-117.95608589172",
            "34.09304239265,-118.21220466614",
            "34.01453500348,-118.40515205383",
            "34.08678722439,-118.24585029602",
            "34.07768797282,-118.024063797",
            "33.98037868641,-117.86476203918",
            "34.08621854981,-118.05290290833",
            "33.89150802366,-118.17237922668",
            "34.02762461669,-117.82630989075",
            "34.0179498798,-118.463516922",
            "34.04071221106,-118.22799751282",
            "33.8909380408,-118.31176826477",
            "33.82422376039,-118.02749702454",
            "33.88979806364,-118.07075569153",
            "33.9222814413,-118.11744758606",
            "33.85787251839,-117.93960639954",
            "34.05664220923,-117.94372627258",
            "33.93310648284,-118.15933296204",
            "33.8333501566,-117.79335090637",
            "34.05550445148,-117.86338874817",
            "33.8036858073,-118.28430244446",
            "33.95304374705,-118.28086921692",
            "34.04469499118,-117.96569892883",
            "33.83506124743,-118.28086921692",
            "34.02193372856,-117.86407539368",
            "34.11862690393,-117.95951911926",
            "33.94848706977,-118.34884712219",
            "33.84817847242,-118.07487556458",
            "33.74489721412,-117.90458747864",
            "34.11976381374,-118.00483772278",
            "33.98037868641,-118.21151802063",
            "33.92171166417,-117.92450019836",
            "33.79113240879,-117.90046760559",
            "34.0503843526,-117.76245185852",
            "33.94051229749,-118.23967048645",
            "34.02876274853,-118.33992073059",
            "33.85730231085,-118.24997016907",
            "33.73975843056,-117.96569892883",
            "34.05265999028,-118.31657478333",
            "33.86015331049,-118.38592597961",
            "33.82080111065,-118.06114265442",
            "34.09076783949,-118.17993232727",
            "33.96215636963,-118.41407844543",
            "33.93025792109,-118.04397651672",
            "33.81680784615,-117.93960639954",
            "34.07711923714,-118.32138130188",
            "34.07313798041,-118.06114265442",
            "33.90005730957,-117.89016792297",
            "33.80425637258,-118.02955696106",
            "34.09019919165,-117.93823310852",
            "33.91829292132,-118.25546333313",
            "34.0344531787,-118.24928352356",
            "33.91316454986,-118.2788092804",
            "34.06688134177,-118.1476599884",
            "34.0105508075,-118.09959480286",
            "33.84304588505,-117.97874519348",
            "34.04469499118,-117.89566108704",
            "33.95930877992,-118.14148017883",
            "33.99575072853,-118.2788092804",
            "34.05095326775,-117.8833014679",
            "33.80596804558,-118.33305427551",
            "34.08451250316,-117.89909431458",
            "33.82764627313,-118.30352851868",
            "34.00770483876,-117.85858222961",
            "34.11351062062,-117.91969367981",
            "33.98037868641,-118.30696174622",
            "33.99404286117,-117.96913215637",
            "33.74603912421,-117.93136665344",
            "34.11066810727,-118.10989448547",
            "33.99973561887,-118.19297859192",
            "33.89834752096,-117.94235298157",
            "33.81851926805,-117.81807014465",
            "34.03160801132,-117.76588508606",
            "34.04640183969,-118.35434028625",
            "33.7808600771,-118.38249275208",
            "34.10270856174,-117.85858222961",
            "34.07655049763,-118.3495337677",
            "34.03843625273,-118.26713630676",
            "33.81680784615,-118.37356636047",
            "33.91715330989,-118.01445075989",
            "34.04697078156,-118.42163154602",
            "33.97126801612,-118.37768623352",
            "33.89264797797,-118.05152961731",
            "33.78999109946,-117.99865791321",
            "34.07598175431,-118.29048225403",
            "34.01396584407,-118.42643806458",
            "34.09247376009,-117.96226570129",
            "33.92285121463,-118.22456428528",
            "34.04924651086,-118.18061897278",
            "33.8470379241,-118.34747383118",
            "33.83277978538,-118.00483772278",
            "34.05265999028,-118.14079353333",
            "33.99347356442,-118.07556221008",
            "34.05095326775,-117.91214057922",
            "33.86642517466,-118.13049385071",
            "34.04753971961,-117.81257698059",
            "33.78713775956,-118.34678718567",
            "33.87725730938,-118.27606269836",
            "33.80197408864,-118.22525093079",
            "34.08792456209,-117.91694709778",
            "33.85217027165,-118.18542549133",
            "34.04298810832,-117.98423835754",
            "34.00372032229,-118.30009529114",
            "33.99575072853,-117.93479988098",
            "33.78200150814,-117.83866950989",
            "34.11578456252,-118.07968208313",
            "33.92285121463,-118.3763129425",
            "33.8333501566,-118.14491340637",
            "33.79855054862,-117.82150337219",
            "33.99688928771,-118.25614997864",
            "33.73404830999,-118.34404060364",
            "34.09133648351,-117.83386299133",
            "34.07086289255,-118.37768623352",
            "34.04071221106,-118.28361579895",
            "33.93481557416,-117.9979712677",
            "33.78942043909,-118.17443916321",
            "34.05891767893,-118.40103218079",
            "34.00599721173,-118.44978401184",
            "33.9752540545,-118.04672309875",
            "33.808250223,-117.96981880188",
            "34.0014433718,-118.42163154602",
            "33.77344040457,-118.13118049622",
            "34.07939415697,-118.08654853821",
            "33.8977775838,-117.8311164093",
            "33.91829292132,-117.85858222961",
            "34.03559121894,-118.19503852844",
            "33.85901292206,-118.32756111145",
            "33.9758234733,-117.892914505",
            "34.07541300717,-118.1208808136",
            "33.87668723129,-117.90252754211",
            "33.85616188435,-118.16551277161",
            "33.88295788074,-118.10028144836",
            "33.85231240478,-118.21718233109",
            "34.03616023333,-117.83523628235",
            "33.97069856681,-118.09547492981",
            "33.9758234733,-118.27674934387",
            "33.84304588505,-118.25752326965",
            "34.01225834296,-117.89840766907",
            "34.0412811911,-118.00003120422",
            "33.89948738384,-118.33786079407",
            "34.00428955037,-118.22387763977",
            "33.7597408593,-117.8750617218",
            "34.11009959314,-117.88810798645",
            "33.8977775838,-118.39004585266",
            "33.82365332828,-118.19229194641",
            "33.82422376039,-117.89016792297",
            "34.06915653655,-117.78579780579",
            "33.96101734518,-118.18611213684",
            "33.88067769789,-117.96501228333",
            "33.8675654641,-117.79678413391",
            "34.02477922033,-118.37356636047",
            "33.74775196084,-118.01719734192",
            "33.99461215411,-118.43673774719",
            "33.95475243813,-118.02063056946",
            "33.82137156178,-118.10714790344",
            "34.10213999412,-118.15933296204",
            "34.00770483876,-118.38523933411",
            "33.84646764422,-117.8833014679",
            "33.78999109946,-118.09341499329",
            "33.79626811253,-117.92450019836",
            "34.03160801132,-117.91557380676",
            "33.94051229749,-118.12706062317",
            "33.91658349846,-118.32893440247"
        ]
    },
    "jobs": [
        {
            "id": 1,
            "location_index": 0,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 2,
            "location_index": 1,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 3,
            "location_index": 2,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 4,
            "location_index": 3,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 5,
            "location_index": 4,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 6,
            "location_index": 5,
            "service": 20,
            "delivery": [
                1
            ]
        },
        {
            "id": 7,
            "location_index": 6,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 8,
            "location_index": 7,
            "service": 20,
            "delivery": [
                1
            ]
        },
        {
            "id": 9,
            "location_index": 8,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 10,
            "location_index": 9,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 11,
            "location_index": 10,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 12,
            "location_index": 11,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 13,
            "location_index": 12,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 14,
            "location_index": 13,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 15,
            "location_index": 14,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 16,
            "location_index": 15,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 17,
            "location_index": 16,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 18,
            "location_index": 17,
            "service": 20,
            "delivery": [
                1
            ]
        },
        {
            "id": 19,
            "location_index": 18,
            "service": 20,
            "delivery": [
                1
            ]
        },
        {
            "id": 20,
            "location_index": 19,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 21,
            "location_index": 20,
            "service": 20,
            "delivery": [
                1
            ]
        },
        {
            "id": 22,
            "location_index": 21,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 23,
            "location_index": 22,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 24,
            "location_index": 23,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 25,
            "location_index": 24,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 26,
            "location_index": 25,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 27,
            "location_index": 26,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 28,
            "location_index": 27,
            "service": 20,
            "delivery": [
                1
            ]
        },
        {
            "id": 29,
            "location_index": 28,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 30,
            "location_index": 29,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 31,
            "location_index": 30,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 32,
            "location_index": 31,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 33,
            "location_index": 32,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 34,
            "location_index": 33,
            "service": 20,
            "delivery": [
                1
            ]
        },
        {
            "id": 35,
            "location_index": 34,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 36,
            "location_index": 35,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 37,
            "location_index": 36,
            "service": 20,
            "delivery": [
                1
            ]
        },
        {
            "id": 38,
            "location_index": 37,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 39,
            "location_index": 38,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 40,
            "location_index": 39,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 41,
            "location_index": 40,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 42,
            "location_index": 41,
            "service": 20,
            "delivery": [
                1
            ]
        },
        {
            "id": 43,
            "location_index": 42,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 44,
            "location_index": 43,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 45,
            "location_index": 44,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 46,
            "location_index": 45,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 47,
            "location_index": 46,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 48,
            "location_index": 47,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 49,
            "location_index": 48,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 50,
            "location_index": 49,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 51,
            "location_index": 50,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 52,
            "location_index": 51,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 53,
            "location_index": 52,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 54,
            "location_index": 53,
            "service": 20,
            "delivery": [
                1
            ]
        },
        {
            "id": 55,
            "location_index": 54,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 56,
            "location_index": 55,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 57,
            "location_index": 56,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 58,
            "location_index": 57,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 59,
            "location_index": 58,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 60,
            "location_index": 59,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 61,
            "location_index": 60,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 62,
            "location_index": 61,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 63,
            "location_index": 62,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 64,
            "location_index": 63,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 65,
            "location_index": 64,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 66,
            "location_index": 65,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 67,
            "location_index": 66,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 68,
            "location_index": 67,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 69,
            "location_index": 68,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 70,
            "location_index": 69,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 71,
            "location_index": 70,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 72,
            "location_index": 71,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 73,
            "location_index": 72,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 74,
            "location_index": 73,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 75,
            "location_index": 74,
            "service": 30,
            "delivery": [
                1
            ]
        },
        {
            "id": 76,
            "location_index": 75,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 77,
            "location_index": 76,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 78,
            "location_index": 77,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 79,
            "location_index": 78,
            "service": 20,
            "delivery": [
                1
            ]
        },
        {
            "id": 80,
            "location_index": 79,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 81,
            "location_index": 80,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 82,
            "location_index": 81,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 83,
            "location_index": 82,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 84,
            "location_index": 83,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 85,
            "location_index": 84,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 86,
            "location_index": 85,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 87,
            "location_index": 86,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 88,
            "location_index": 87,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 89,
            "location_index": 88,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 90,
            "location_index": 89,
            "service": 20,
            "delivery": [
                1
            ]
        },
        {
            "id": 91,
            "location_index": 90,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 92,
            "location_index": 91,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 93,
            "location_index": 92,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 94,
            "location_index": 93,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 95,
            "location_index": 94,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 96,
            "location_index": 95,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 97,
            "location_index": 96,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 98,
            "location_index": 97,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 99,
            "location_index": 98,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 100,
            "location_index": 99,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 101,
            "location_index": 100,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 102,
            "location_index": 101,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 103,
            "location_index": 102,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 104,
            "location_index": 103,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 105,
            "location_index": 104,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 106,
            "location_index": 105,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 107,
            "location_index": 106,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 108,
            "location_index": 107,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 109,
            "location_index": 108,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 110,
            "location_index": 109,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 111,
            "location_index": 110,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 112,
            "location_index": 111,
            "service": 20,
            "delivery": [
                1
            ]
        },
        {
            "id": 113,
            "location_index": 112,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 114,
            "location_index": 113,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 115,
            "location_index": 114,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 116,
            "location_index": 115,
            "service": 20,
            "delivery": [
                1
            ]
        },
        {
            "id": 117,
            "location_index": 116,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 118,
            "location_index": 117,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 119,
            "location_index": 118,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 120,
            "location_index": 119,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 121,
            "location_index": 120,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 122,
            "location_index": 121,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 123,
            "location_index": 122,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 124,
            "location_index": 123,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 125,
            "location_index": 124,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 126,
            "location_index": 125,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 127,
            "location_index": 126,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 1288,
            "location_index": 127,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 128,
            "location_index": 128,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 129,
            "location_index": 129,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 130,
            "location_index": 130,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 131,
            "location_index": 131,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 132,
            "location_index": 132,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 133,
            "location_index": 133,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 134,
            "location_index": 134,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 135,
            "location_index": 135,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 136,
            "location_index": 136,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 137,
            "location_index": 137,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 138,
            "location_index": 138,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 139,
            "location_index": 139,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 140,
            "location_index": 140,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 141,
            "location_index": 141,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 142,
            "location_index": 142,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 143,
            "location_index": 143,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 144,
            "location_index": 144,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 145,
            "location_index": 145,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 146,
            "location_index": 146,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 147,
            "location_index": 147,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 148,
            "location_index": 148,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 149,
            "location_index": 149,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 150,
            "location_index": 150,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 151,
            "location_index": 151,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 152,
            "location_index": 152,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 153,
            "location_index": 153,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 154,
            "location_index": 154,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 155,
            "location_index": 155,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 156,
            "location_index": 156,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 157,
            "location_index": 157,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 158,
            "location_index": 158,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 159,
            "location_index": 159,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 160,
            "location_index": 160,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 161,
            "location_index": 161,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 162,
            "location_index": 162,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 163,
            "location_index": 163,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 164,
            "location_index": 164,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 165,
            "location_index": 165,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 166,
            "location_index": 166,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 167,
            "location_index": 167,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 168,
            "location_index": 168,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 169,
            "location_index": 169,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 170,
            "location_index": 170,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 171,
            "location_index": 171,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 172,
            "location_index": 172,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 173,
            "location_index": 173,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 174,
            "location_index": 174,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 175,
            "location_index": 175,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 176,
            "location_index": 176,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 177,
            "location_index": 177,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 178,
            "location_index": 178,
            "service": 10,
            "delivery": [
                1
            ]
        },
        {
            "id": 179,
            "location_index": 179,
            "service": 10,
            "delivery": [
                1
            ]
        }
    ],
    "vehicles": [
        {
            "id": 1,
            "start_index": 180,
            "end_index": 180,
            "capacity": [
                50
            ]
        },
        {
            "id": 2,
            "start_index": 181,
            "end_index": 181,
            "capacity": [
                50
            ]
        },
        {
            "id": 3,
            "start_index": 182,
            "end_index": 182,
            "capacity": [
                50
            ]
        },
        {
            "id": 4,
            "start_index": 183,
            "end_index": 183,
            "capacity": [
                50
            ]
        }
    ],
    "options": {
        "objective": {
            "travel_cost": "distance"
        },
        "grouping": {
            "route_grouping": {
                "zone_diameter": 1500,
                "penalty_factor": 100
            }
        }
    }
}'
```

## Optimization POST Response

Once the request is made, we get a unique ID in the API response:

```json
{
  "id": "7d2dd7788e69dc75dc6c22e8055562df",
  "message": "Optimization job created",
  "status": "Ok"
}
```

## Optimization GET Request

We take the ID and use the Optimization GET request to retrieve the result. Here is the GET request:

```bash
curl --location 'https://api.nextbillion.io/optimization/v2/result?id=7d2dd7788e69dc75dc6c22e8055562df
&key=<your_api_key>'
```

## Optimization GET Response

Following is the optimized route plan:

```json
{
    "description": "Route Grouping Example",
    "result": {
        "code": 0,
        "summary": {
            "cost": 874367,
            "routes": 4,
            "unassigned": 0,
            "setup": 0,
            "service": 1960,
            "duration": 101850,
            "waiting_time": 0,
            "priority": 0,
            "delivery": [
                180
            ],
            "pickup": [
                0
            ],
            "distance": 874367
        },
        "routes": [
            {
                "vehicle": 4,
                "cost": 246709,
                "steps": [
                    {
                        "type": "start",
                        "arrival": 0,
                        "duration": 0,
                        "service": 0,
                        "waiting_time": 0,
                        "location": [
                            33.91658349846,
                            -118.32893440247
                        ],
                        "location_index": 183,
                        "load": [
                            48
                        ],
                        "distance": 0,
                        "snapped_location": [
                            33.91645,
                            -118.32893
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 478,
                        "duration": 478,
                        "service": 20,
                        "waiting_time": 0,
                        "location": [
                            33.94962626197,
                            -118.31520149231
                        ],
                        "location_index": 7,
                        "id": 8,
                        "load": [
                            47
                        ],
                        "distance": 4939,
                        "long_id": "8",
                        "internal_id": 8,
                        "snapped_location": [
                            33.94981,
                            -118.3152
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 1128,
                        "duration": 1108,
                        "service": 10,
                        "waiting_time": 0,
                        "location": [
                            33.94848706977,
                            -118.34884712219
                        ],
                        "location_index": 47,
                        "id": 48,
                        "load": [
                            46
                        ],
                        "distance": 9755,
                        "long_id": "48",
                        "internal_id": 48,
                        "snapped_location": [
                            33.94848,
                            -118.34885
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 1777,
                        "duration": 1747,
                        "service": 10,
                        "waiting_time": 0,
                        "location": [
                            33.97126801612,
                            -118.37768623352
                        ],
                        "location_index": 102,
                        "id": 103,
                        "load": [
                            45
                        ],
                        "distance": 15380,
                        "long_id": "103",
                        "internal_id": 103,
                        "snapped_location": [
                            33.97127,
                            -118.37769
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 2668,
                        "duration": 2628,
                        "service": 10,
                        "waiting_time": 0,
                        "location": [
                            33.99461215411,
                            -118.43673774719
                        ],
                        "location_index": 173,
                        "id": 173,
                        "load": [
                            44
                        ],
                        "distance": 25078,
                        "long_id": "173",
                        "internal_id": 173,
                        "snapped_location": [
                            33.99477,
                            -118.43655
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 3010,
                        "duration": 2960,
                        "service": 10,
                        "waiting_time": 0,
                        "location": [
                            34.00599721173,
                            -118.44978401184
                        ],
                        "location_index": 138,
                        "id": 138,
                        "load": [
                            43
                        ],
                        "distance": 27144,
                        "long_id": "138",
                        "internal_id": 138,
                        "snapped_location": [
                            34.00609,
                            -118.44961
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 3299,
                        "duration": 3239,
                        "service": 10,
                        "waiting_time": 0,
                        "location": [
                            34.0179498798,
                            -118.463516922
                        ],
                        "location_index": 30,
                        "id": 31,
                        "load": [
                            42
                        ],
                        "distance": 29357,
                        "long_id": "31",
                        "internal_id": 31,
                        "snapped_location": [
                            34.01805,
                            -118.46334
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 3733,
                        "duration": 3663,
                        "service": 10,
                        "waiting_time": 0,
                        "location": [
                            34.03388415286,
                            -118.44223091125
                        ],
                        "location_index": 19,
                        "id": 20,
                        "load": [
                            41
                        ],
                        "distance": 32512,
                        "long_id": "20",
                        "internal_id": 20,
                        "snapped_location": [
                            34.03367,
                            -118.4422
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 4202,
                        "duration": 4122,
                        "service": 10,
                        "waiting_time": 0,
                        "location": [
                            34.04697078156,
                            -118.42163154602
                        ],
                        "location_index": 101,
                        "id": 102,
                        "load": [
                            40
                        ],
                        "distance": 36088,
                        "long_id": "102",
                        "internal_id": 102,
                        "snapped_location": [
                            34.04694,
                            -118.4216
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 4572,
                        "duration": 4482,
                        "service": 10,
                        "waiting_time": 0,
                        "location": [
                            34.05891767893,
                            -118.40103218079
                        ],
                        "location_index": 137,
                        "id": 137,
                        "load": [
                            39
                        ],
                        "distance": 38992,
                        "long_id": "137",
                        "internal_id": 137,
                        "snapped_location": [
                            34.05892,
                            -118.40128
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 5057,
                        "duration": 4957,
                        "service": 10,
                        "waiting_time": 0,
                        "location": [
                            34.07086289255,
                            -118.37768623352
                        ],
                        "location_index": 133,
                        "id": 133,
                        "load": [
                            38
                        ],
                        "distance": 42551,
                        "long_id": "133",
                        "internal_id": 133,
                        "snapped_location": [
                            34.07083,
                            -118.37769
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 5647,
                        "duration": 5537,
                        "service": 10,
                        "waiting_time": 0,
                        "location": [
                            34.07655049763,
                            -118.3495337677
                        ],
                        "location_index": 97,
                        "id": 98,
                        "load": [
                            37
                        ],
                        "distance": 46131,
                        "long_id": "98",
                        "internal_id": 98,
                        "snapped_location": [
                            34.07659,
                            -118.34953
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 6066,
                        "duration": 5946,
                        "service": 10,
                        "waiting_time": 0,
                        "location": [
                            34.07711923714,
                            -118.32138130188
                        ],
                        "location_index": 66,
                        "id": 67,
                        "load": [
                            36
                        ],
                        "distance": 48875,
                        "long_id": "67",
                        "internal_id": 67,
                        "snapped_location": [
                            34.07712,
                            -118.32168
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 6574,
                        "duration": 6444,
                        "service": 10,
                        "waiting_time": 0,
                        "location": [
                            34.07598175431,
                            -118.29048225403
                        ],
                        "location_index": 105,
                        "id": 106,
                        "load": [
                            35
                        ],
                        "distance": 51886,
                        "long_id": "106",
                        "internal_id": 106,
                        "snapped_location": [
                            34.07599,
                            -118.29048
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 7359,
                        "duration": 7219,
                        "service": 10,
                        "waiting_time": 0,
                        "location": [
                            34.08678722439,
                            -118.24585029602
                        ],
                        "location_index": 24,
                        "id": 25,
                        "load": [
                            34
                        ],
                        "distance": 57036,
                        "long_id": "25",
                        "internal_id": 25,
                        "snapped_location": [
                            34.08737,
                            -118.24657
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 8156,
                        "duration": 8006,
                        "service": 10,
                        "waiting_time": 0,
                        "location": [
                            34.04071221106,
                            -118.22799751282
                        ],
                        "location_index": 31,
                        "id": 32,
                        "load": [
                            33
                        ],
                        "distance": 66103,
                        "long_id": "32",
                        "internal_id": 32,
                        "snapped_location": [
                            34.04122,
                            -118.22723
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 8706,
                        "duration": 8546,
                        "service": 10,
                        "waiting_time": 0,
                        "location": [
                            34.0344531787,
                            -118.24928352356
                        ],
                        "location_index": 72,
                        "id": 73,
                        "load": [
                            32
                        ],
                        "distance": 69670,
                        "long_id": "73",
                        "internal_id": 73,
                        "snapped_location": [
                            34.03451,
                            -118.2494
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 9260,
                        "duration": 9090,
                        "service": 10,
                        "waiting_time": 0,
                        "location": [
                            34.03843625273,
                            -118.26713630676
                        ],
                        "location_index": 98,
                        "id": 99,
                        "load": [
                            31
                        ],
                        "distance": 72271,
                        "long_id": "99",
                        "internal_id": 99,
                        "snapped_location": [
                            34.03843,
                            -118.26711
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 9624,
                        "duration": 9444,
                        "service": 10,
                        "waiting_time": 0,
                        "location": [
                            34.04071221106,
                            -118.28361579895
                        ],
                        "location_index": 134,
                        "id": 134,
                        "load": [
                            30
                        ],
                        "distance": 74459,
                        "long_id": "134",
                        "internal_id": 134,
                        "snapped_location": [
                            34.04079,
                            -118.2838
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 9927,
                        "duration": 9737,
                        "service": 20,
                        "waiting_time": 0,
                        "location": [
                            34.03900524804,
                            -118.29734870911
                        ],
                        "location_index": 20,
                        "id": 21,
                        "load": [
                            29
                        ],
                        "distance": 75898,
                        "long_id": "21",
                        "internal_id": 21,
                        "snapped_location": [
                            34.03901,
                            -118.29741
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 10474,
                        "duration": 10264,
                        "service": 10,
                        "waiting_time": 0,
                        "location": [
                            34.05265999028,
                            -118.31657478333
                        ],
                        "location_index": 59,
                        "id": 60,
                        "load": [
                            28
                        ],
                        "distance": 79456,
                        "long_id": "60",
                        "internal_id": 60,
                        "snapped_location": [
                            34.05261,
                            -118.31646
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 11009,
                        "duration": 10789,
                        "service": 10,
                        "waiting_time": 0,
                        "location": [
                            34.04640183969,
                            -118.35434028625
                        ],
                        "location_index": 94,
                        "id": 95,
                        "load": [
                            27
                        ],
                        "distance": 83706,
                        "long_id": "95",
                        "internal_id": 95,
                        "snapped_location": [
                            34.04631,
                            -118.35438
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 11523,
                        "duration": 11293,
                        "service": 10,
                        "waiting_time": 0,
                        "location": [
                            34.02876274853,
                            -118.33992073059
                        ],
                        "location_index": 56,
                        "id": 57,
                        "load": [
                            26
                        ],
                        "distance": 87304,
                        "long_id": "57",
                        "internal_id": 57,
                        "snapped_location": [
                            34.02876,
                            -118.33946
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 11939,
                        "duration": 11699,
                        "service": 10,
                        "waiting_time": 0,
                        "location": [
                            34.01396584407,
                            -118.35022041321
                        ],
                        "location_index": 16,
                        "id": 17,
                        "load": [
                            25
                        ],
                        "distance": 89822,
                        "long_id": "17",
                        "internal_id": 17,
                        "snapped_location": [
                            34.01396,
                            -118.35009
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 12482,
                        "duration": 12232,
                        "service": 10,
                        "waiting_time": 0,
                        "location": [
                            34.02477922033,
                            -118.37356636047
                        ],
                        "location_index": 171,
                        "id": 171,
                        "load": [
                            24
                        ],
                        "distance": 93575,
                        "long_id": "171",
                        "internal_id": 171,
                        "snapped_location": [
                            34.02479,
                            -118.37392
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 13766,
                        "duration": 13506,
                        "service": 10,
                        "waiting_time": 0,
                        "location": [
                            34.00770483876,
                            -118.38523933411
                        ],
                        "location_index": 177,
                        "id": 177,
                        "load": [
                            23
                        ],
                        "distance": 101183,
                        "long_id": "177",
                        "internal_id": 177,
                        "snapped_location": [
                            34.00768,
                            -118.38534
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 15427,
                        "duration": 15157,
                        "service": 10,
                        "waiting_time": 0,
                        "location": [
                            34.01453500348,
                            -118.40515205383
                        ],
                        "location_index": 23,
                        "id": 24,
                        "load": [
                            22
                        ],
                        "distance": 113025,
                        "long_id": "24",
                        "internal_id": 24,
                        "snapped_location": [
                            34.01471,
                            -118.40543
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 16012,
                        "duration": 15732,
                        "service": 10,
                        "waiting_time": 0,
                        "location": [
                            34.01396584407,
                            -118.42643806458
                        ],
                        "location_index": 106,
                        "id": 107,
                        "load": [
                            21
                        ],
                        "distance": 116270,
                        "long_id": "107",
                        "internal_id": 107,
                        "snapped_location": [
                            34.01432,
                            -118.42579
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 16258,
                        "duration": 15968,
                        "service": 10,
                        "waiting_time": 0,
                        "location": [
                            34.0014433718,
                            -118.42163154602
                        ],
                        "location_index": 141,
                        "id": 141,
                        "load": [
                            20
                        ],
                        "distance": 118071,
                        "long_id": "141",
                        "internal_id": 141,
                        "snapped_location": [
                            34.00176,
                            -118.42091
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 17006,
                        "duration": 16706,
                        "service": 10,
                        "waiting_time": 0,
                        "location": [
                            33.96215636963,
                            -118.41407844543
                        ],
                        "location_index": 63,
                        "id": 64,
                        "load": [
                            19
                        ],
                        "distance": 124445,
                        "long_id": "64",
                        "internal_id": 64,
                        "snapped_location": [
                            33.96216,
                            -118.41368
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 17858,
                        "duration": 17548,
                        "service": 10,
                        "waiting_time": 0,
                        "location": [
                            33.92285121463,
                            -118.3763129425
                        ],
                        "location_index": 127,
                        "id": 1288,
                        "load": [
                            18
                        ],
                        "distance": 135866,
                        "long_id": "1288",
                        "internal_id": 1288,
                        "snapped_location": [
                            33.92299,
                            -118.37631
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 18578,
                        "duration": 18258,
                        "service": 10,
                        "waiting_time": 0,
                        "location": [
                            33.8977775838,
                            -118.39004585266
                        ],
                        "location_index": 164,
                        "id": 164,
                        "load": [
                            17
                        ],
                        "distance": 141143,
                        "long_id": "164",
                        "internal_id": 164,
                        "snapped_location": [
                            33.89777,
                            -118.39002
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 19444,
                        "duration": 19114,
                        "service": 10,
                        "waiting_time": 0,
                        "location": [
                            33.86015331049,
                            -118.38592597961
                        ],
                        "location_index": 60,
                        "id": 61,
                        "load": [
                            16
                        ],
                        "distance": 146868,
                        "long_id": "61",
                        "internal_id": 61,
                        "snapped_location": [
                            33.86021,
                            -118.38594
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 20180,
                        "duration": 19840,
                        "service": 10,
                        "waiting_time": 0,
                        "location": [
                            33.85901292206,
                            -118.32756111145
                        ],
                        "location_index": 147,
                        "id": 147,
                        "load": [
                            15
                        ],
                        "distance": 153004,
                        "long_id": "147",
                        "internal_id": 147,
                        "snapped_location": [
                            33.85902,
                            -118.3276
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 20470,
                        "duration": 20120,
                        "service": 10,
                        "waiting_time": 0,
                        "location": [
                            33.8470379241,
                            -118.34747383118
                        ],
                        "location_index": 110,
                        "id": 111,
                        "load": [
                            14
                        ],
                        "distance": 156172,
                        "long_id": "111",
                        "internal_id": 111,
                        "snapped_location": [
                            33.84716,
                            -118.34762
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 21188,
                        "duration": 20828,
                        "service": 10,
                        "waiting_time": 0,
                        "location": [
                            33.81680784615,
                            -118.37356636047
                        ],
                        "location_index": 99,
                        "id": 100,
                        "load": [
                            13
                        ],
                        "distance": 162249,
                        "long_id": "100",
                        "internal_id": 100,
                        "snapped_location": [
                            33.81674,
                            -118.37382
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 22032,
                        "duration": 21662,
                        "service": 10,
                        "waiting_time": 0,
                        "location": [
                            33.7808600771,
                            -118.38249275208
                        ],
                        "location_index": 95,
                        "id": 96,
                        "load": [
                            12
                        ],
                        "distance": 170860,
                        "long_id": "96",
                        "internal_id": 96,
                        "snapped_location": [
                            33.78085,
                            -118.3825
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 23155,
                        "duration": 22775,
                        "service": 10,
                        "waiting_time": 0,
                        "location": [
                            33.73404830999,
                            -118.34404060364
                        ],
                        "location_index": 131,
                        "id": 131,
                        "load": [
                            11
                        ],
                        "distance": 185594,
                        "long_id": "131",
                        "internal_id": 131,
                        "snapped_location": [
                            33.73429,
                            -118.34382
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 24164,
                        "duration": 23774,
                        "service": 20,
                        "waiting_time": 0,
                        "location": [
                            33.76830333174,
                            -118.32893440247
                        ],
                        "location_index": 5,
                        "id": 6,
                        "load": [
                            10
                        ],
                        "distance": 197842,
                        "long_id": "6",
                        "internal_id": 6,
                        "snapped_location": [
                            33.76823,
                            -118.32894
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 24783,
                        "duration": 24373,
                        "service": 10,
                        "waiting_time": 0,
                        "location": [
                            33.78713775956,
                            -118.34678718567
                        ],
                        "location_index": 117,
                        "id": 118,
                        "load": [
                            9
                        ],
                        "distance": 203772,
                        "long_id": "118",
                        "internal_id": 118,
                        "snapped_location": [
                            33.78517,
                            -118.34574
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 25392,
                        "duration": 24972,
                        "service": 10,
                        "waiting_time": 0,
                        "location": [
                            33.80596804558,
                            -118.33305427551
                        ],
                        "location_index": 81,
                        "id": 82,
                        "load": [
                            8
                        ],
                        "distance": 208320,
                        "long_id": "82",
                        "internal_id": 82,
                        "snapped_location": [
                            33.80586,
                            -118.33306
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 26256,
                        "duration": 25826,
                        "service": 20,
                        "waiting_time": 0,
                        "location": [
                            33.8036858073,
                            -118.28430244446
                        ],
                        "location_index": 41,
                        "id": 42,
                        "load": [
                            7
                        ],
                        "distance": 214715,
                        "long_id": "42",
                        "internal_id": 42,
                        "snapped_location": [
                            33.80368,
                            -118.28437
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 26924,
                        "duration": 26474,
                        "service": 10,
                        "waiting_time": 0,
                        "location": [
                            33.82764627313,
                            -118.30352851868
                        ],
                        "location_index": 83,
                        "id": 84,
                        "load": [
                            6
                        ],
                        "distance": 220604,
                        "long_id": "84",
                        "internal_id": 84,
                        "snapped_location": [
                            33.82752,
                            -118.30344
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 27447,
                        "duration": 26987,
                        "service": 10,
                        "waiting_time": 0,
                        "location": [
                            33.83506124743,
                            -118.28086921692
                        ],
                        "location_index": 44,
                        "id": 45,
                        "load": [
                            5
                        ],
                        "distance": 223733,
                        "long_id": "45",
                        "internal_id": 45,
                        "snapped_location": [
                            33.83523,
                            -118.28086
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 27967,
                        "duration": 27497,
                        "service": 10,
                        "waiting_time": 0,
                        "location": [
                            33.84304588505,
                            -118.25752326965
                        ],
                        "location_index": 157,
                        "id": 157,
                        "load": [
                            4
                        ],
                        "distance": 227679,
                        "long_id": "157",
                        "internal_id": 157,
                        "snapped_location": [
                            33.84297,
                            -118.25749
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 28414,
                        "duration": 27934,
                        "service": 10,
                        "waiting_time": 0,
                        "location": [
                            33.85730231085,
                            -118.24997016907
                        ],
                        "location_index": 57,
                        "id": 58,
                        "load": [
                            3
                        ],
                        "distance": 230079,
                        "long_id": "58",
                        "internal_id": 58,
                        "snapped_location": [
                            33.8572,
                            -118.24997
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 28985,
                        "duration": 28495,
                        "service": 10,
                        "waiting_time": 0,
                        "location": [
                            33.87725730938,
                            -118.27606269836
                        ],
                        "location_index": 118,
                        "id": 119,
                        "load": [
                            2
                        ],
                        "distance": 235131,
                        "long_id": "119",
                        "internal_id": 119,
                        "snapped_location": [
                            33.87718,
                            -118.27606
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 29653,
                        "duration": 29153,
                        "service": 10,
                        "waiting_time": 0,
                        "location": [
                            33.8909380408,
                            -118.31176826477
                        ],
                        "location_index": 32,
                        "id": 33,
                        "load": [
                            1
                        ],
                        "distance": 240179,
                        "long_id": "33",
                        "internal_id": 33,
                        "snapped_location": [
                            33.89102,
                            -118.31177
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 30062,
                        "duration": 29552,
                        "service": 10,
                        "waiting_time": 0,
                        "location": [
                            33.89948738384,
                            -118.33786079407
                        ],
                        "location_index": 160,
                        "id": 160,
                        "load": [
                            0
                        ],
                        "distance": 243506,
                        "long_id": "160",
                        "internal_id": 160,
                        "snapped_location": [
                            33.89929,
                            -118.33785
                        ]
                    },
                    {
                        "type": "end",
                        "arrival": 30447,
                        "duration": 29927,
                        "service": 0,
                        "waiting_time": 0,
                        "location": [
                            33.91658349846,
                            -118.32893440247
                        ],
                        "location_index": 183,
                        "load": [
                            0
                        ],
                        "distance": 246709,
                        "snapped_location": [
                            33.91645,
                            -118.32893
                        ]
                    }
                ],
                "service": 520,
                "duration": 29927,
                "waiting_time": 0,
                "priority": 0,
                "delivery": [
                    48
                ],
                "pickup": [
                    0
                ],
                "distance": 246709,
                "geometry": "<route_geometry>",
                "internal_id": 4
            },
            {
                "vehicle": 2,
                "cost": 222932,
                "steps": [
                    {
                        "type": "start",
                        "arrival": 0,
                        "duration": 0,
                        "service": 0,
                        "waiting_time": 0,
                        "location": [
                            34.03160801132,
                            -117.91557380676
                        ],
                        "location_index": 181,
                        "load": [
                            49
                        ],
                        "distance": 0,
                        "snapped_location": [
                            34.03163,
                            -117.91555
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 609,
                        "duration": 609,
                        "service": 10,
                        "waiting_time": 0,
                        "location": [
                            34.01225834296,
                            -117.89840766907
                        ],
                        "location_index": 158,
                        "id": 158,
                        "load": [
                            48
                        ],
                        "distance": 5405,
                        "long_id": "158",
                        "internal_id": 158,
                        "snapped_location": [
                            34.01198,
                            -117.89845
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 1421,
                        "duration": 1411,
                        "service": 10,
                        "waiting_time": 0,
                        "location": [
                            33.99575072853,
                            -117.93479988098
                        ],
                        "location_index": 124,
                        "id": 125,
                        "load": [
                            47
                        ],
                        "distance": 11818,
                        "long_id": "125",
                        "internal_id": 125,
                        "snapped_location": [
                            33.99568,
                            -117.93496
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 1878,
                        "duration": 1858,
                        "service": 10,
                        "waiting_time": 0,
                        "location": [
                            33.99404286117,
                            -117.96913215637
                        ],
                        "location_index": 87,
                        "id": 88,
                        "load": [
                            46
                        ],
                        "distance": 16388,
                        "long_id": "88",
                        "internal_id": 88,
                        "snapped_location": [
                            33.99398,
                            -117.96916
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 2887,
                        "duration": 2857,
                        "service": 10,
                        "waiting_time": 0,
                        "location": [
                            33.9758234733,
                            -117.892914505
                        ],
                        "location_index": 148,
                        "id": 148,
                        "load": [
                            45
                        ],
                        "distance": 26968,
                        "long_id": "148",
                        "internal_id": 148,
                        "snapped_location": [
                            33.97593,
                            -117.89238
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 3566,
                        "duration": 3526,
                        "service": 10,
                        "waiting_time": 0,
                        "location": [
                            33.98037868641,
                            -117.86476203918
                        ],
                        "location_index": 26,
                        "id": 27,
                        "load": [
                            44
                        ],
                        "distance": 31745,
                        "long_id": "27",
                        "internal_id": 27,
                        "snapped_location": [
                            33.98029,
                            -117.86463
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 4176,
                        "duration": 4126,
                        "service": 10,
                        "waiting_time": 0,
                        "location": [
                            34.00770483876,
                            -117.85858222961
                        ],
                        "location_index": 84,
                        "id": 85,
                        "load": [
                            43
                        ],
                        "distance": 35973,
                        "long_id": "85",
                        "internal_id": 85,
                        "snapped_location": [
                            34.00727,
                            -117.85878
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 4655,
                        "duration": 4595,
                        "service": 10,
                        "waiting_time": 0,
                        "location": [
                            34.02193372856,
                            -117.86407539368
                        ],
                        "location_index": 45,
                        "id": 46,
                        "load": [
                            42
                        ],
                        "distance": 38325,
                        "long_id": "46",
                        "internal_id": 46,
                        "snapped_location": [
                            34.02204,
                            -117.86363
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 5065,
                        "duration": 4995,
                        "service": 10,
                        "waiting_time": 0,
                        "location": [
                            34.03616023333,
                            -117.83523628235
                        ],
                        "location_index": 154,
                        "id": 154,
                        "load": [
                            41
                        ],
                        "distance": 42126,
                        "long_id": "154",
                        "internal_id": 154,
                        "snapped_location": [
                            34.0362,
                            -117.83521
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 5538,
                        "duration": 5458,
                        "service": 10,
                        "waiting_time": 0,
                        "location": [
                            34.02762461669,
                            -117.82630989075
                        ],
                        "location_index": 29,
                        "id": 30,
                        "load": [
                            40
                        ],
                        "distance": 44791,
                        "long_id": "30",
                        "internal_id": 30,
                        "snapped_location": [
                            34.02762,
                            -117.82631
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 6116,
                        "duration": 6026,
                        "service": 10,
                        "waiting_time": 0,
                        "location": [
                            34.04753971961,
                            -117.81257698059
                        ],
                        "location_index": 116,
                        "id": 117,
                        "load": [
                            39
                        ],
                        "distance": 49607,
                        "long_id": "117",
                        "internal_id": 117,
                        "snapped_location": [
                            34.04753,
                            -117.81246
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 6725,
                        "duration": 6625,
                        "service": 10,
                        "waiting_time": 0,
                        "location": [
                            34.03160801132,
                            -117.76588508606
                        ],
                        "location_index": 93,
                        "id": 94,
                        "load": [
                            38
                        ],
                        "distance": 55384,
                        "long_id": "94",
                        "internal_id": 94,
                        "snapped_location": [
                            34.03106,
                            -117.76677
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 7177,
                        "duration": 7067,
                        "service": 10,
                        "waiting_time": 0,
                        "location": [
                            34.0503843526,
                            -117.76245185852
                        ],
                        "location_index": 54,
                        "id": 55,
                        "load": [
                            37
                        ],
                        "distance": 59463,
                        "long_id": "55",
                        "internal_id": 55,
                        "snapped_location": [
                            34.05037,
                            -117.76299
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 7647,
                        "duration": 7527,
                        "service": 10,
                        "waiting_time": 0,
                        "location": [
                            34.06915653655,
                            -117.78579780579
                        ],
                        "location_index": 167,
                        "id": 167,
                        "load": [
                            36
                        ],
                        "distance": 63725,
                        "long_id": "167",
                        "internal_id": 167,
                        "snapped_location": [
                            34.06958,
                            -117.78592
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 8331,
                        "duration": 8201,
                        "service": 10,
                        "waiting_time": 0,
                        "location": [
                            34.09133648351,
                            -117.83386299133
                        ],
                        "location_index": 132,
                        "id": 132,
                        "load": [
                            35
                        ],
                        "distance": 73477,
                        "long_id": "132",
                        "internal_id": 132,
                        "snapped_location": [
                            34.09131,
                            -117.83381
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 8706,
                        "duration": 8566,
                        "service": 10,
                        "waiting_time": 0,
                        "location": [
                            34.10270856174,
                            -117.85858222961
                        ],
                        "location_index": 96,
                        "id": 97,
                        "load": [
                            34
                        ],
                        "distance": 77460,
                        "long_id": "97",
                        "internal_id": 97,
                        "snapped_location": [
                            34.10272,
                            -117.85896
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 9151,
                        "duration": 9001,
                        "service": 10,
                        "waiting_time": 0,
                        "location": [
                            34.11009959314,
                            -117.88810798645
                        ],
                        "location_index": 163,
                        "id": 163,
                        "load": [
                            33
                        ],
                        "distance": 81295,
                        "long_id": "163",
                        "internal_id": 163,
                        "snapped_location": [
                            34.11005,
                            -117.88851
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 9750,
                        "duration": 9590,
                        "service": 10,
                        "waiting_time": 0,
                        "location": [
                            34.08280642214,
                            -117.87574836731
                        ],
                        "location_index": 4,
                        "id": 5,
                        "load": [
                            32
                        ],
                        "distance": 85980,
                        "long_id": "5",
                        "internal_id": 5,
                        "snapped_location": [
                            34.08281,
                            -117.87574
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 10044,
                        "duration": 9874,
                        "service": 10,
                        "waiting_time": 0,
                        "location": [
                            34.08451250316,
                            -117.89909431458
                        ],
                        "location_index": 82,
                        "id": 83,
                        "load": [
                            31
                        ],
                        "distance": 88378,
                        "long_id": "83",
                        "internal_id": 83,
                        "snapped_location": [
                            34.08459,
                            -117.89909
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 10366,
                        "duration": 10186,
                        "service": 10,
                        "waiting_time": 0,
                        "location": [
                            34.08792456209,
                            -117.91694709778
                        ],
                        "location_index": 120,
                        "id": 121,
                        "load": [
                            30
                        ],
                        "distance": 90825,
                        "long_id": "121",
                        "internal_id": 121,
                        "snapped_location": [
                            34.08788,
                            -117.91695
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 10726,
                        "duration": 10536,
                        "service": 10,
                        "waiting_time": 0,
                        "location": [
                            34.11351062062,
                            -117.91969367981
                        ],
                        "location_index": 85,
                        "id": 86,
                        "load": [
                            29
                        ],
                        "distance": 94018,
                        "long_id": "86",
                        "internal_id": 86,
                        "snapped_location": [
                            34.11352,
                            -117.91987
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 11195,
                        "duration": 10995,
                        "service": 10,
                        "waiting_time": 0,
                        "location": [
                            34.09019919165,
                            -117.93823310852
                        ],
                        "location_index": 70,
                        "id": 71,
                        "load": [
                            28
                        ],
                        "distance": 98422,
                        "long_id": "71",
                        "internal_id": 71,
                        "snapped_location": [
                            34.09013,
                            -117.93824
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 11487,
                        "duration": 11277,
                        "service": 10,
                        "waiting_time": 0,
                        "location": [
                            34.09247376009,
                            -117.96226570129
                        ],
                        "location_index": 107,
                        "id": 108,
                        "load": [
                            27
                        ],
                        "distance": 101052,
                        "long_id": "108",
                        "internal_id": 108,
                        "snapped_location": [
                            34.09247,
                            -117.96229
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 12738,
                        "duration": 12518,
                        "service": 10,
                        "waiting_time": 0,
                        "location": [
                            34.11862690393,
                            -117.95951911926
                        ],
                        "location_index": 46,
                        "id": 47,
                        "load": [
                            26
                        ],
                        "distance": 107294,
                        "long_id": "47",
                        "internal_id": 47,
                        "snapped_location": [
                            34.11371,
                            -117.95732
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 14129,
                        "duration": 13899,
                        "service": 10,
                        "waiting_time": 0,
                        "location": [
                            34.11976381374,
                            -118.00483772278
                        ],
                        "location_index": 50,
                        "id": 51,
                        "load": [
                            25
                        ],
                        "distance": 116854,
                        "long_id": "51",
                        "internal_id": 51,
                        "snapped_location": [
                            34.11976,
                            -118.00447
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 14633,
                        "duration": 14393,
                        "service": 10,
                        "waiting_time": 0,
                        "location": [
                            34.11578456252,
                            -118.04809638977
                        ],
                        "location_index": 11,
                        "id": 12,
                        "load": [
                            24
                        ],
                        "distance": 121742,
                        "long_id": "12",
                        "internal_id": 12,
                        "snapped_location": [
                            34.11577,
                            -118.04853
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 15075,
                        "duration": 14825,
                        "service": 10,
                        "waiting_time": 0,
                        "location": [
                            34.11578456252,
                            -118.07968208313
                        ],
                        "location_index": 126,
                        "id": 127,
                        "load": [
                            23
                        ],
                        "distance": 124973,
                        "long_id": "127",
                        "internal_id": 127,
                        "snapped_location": [
                            34.11537,
                            -118.07994
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 15497,
                        "duration": 15237,
                        "service": 20,
                        "waiting_time": 0,
                        "location": [
                            34.11066810727,
                            -118.10989448547
                        ],
                        "location_index": 89,
                        "id": 90,
                        "load": [
                            22
                        ],
                        "distance": 128500,
                        "long_id": "90",
                        "internal_id": 90,
                        "snapped_location": [
                            34.11067,
                            -118.11016
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 16164,
                        "duration": 15884,
                        "service": 10,
                        "waiting_time": 0,
                        "location": [
                            34.10213999412,
                            -118.15933296204
                        ],
                        "location_index": 176,
                        "id": 176,
                        "load": [
                            21
                        ],
                        "distance": 134053,
                        "long_id": "176",
                        "internal_id": 176,
                        "snapped_location": [
                            34.10193,
                            -118.15956
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 16596,
                        "duration": 16306,
                        "service": 10,
                        "waiting_time": 0,
                        "location": [
                            34.09076783949,
                            -118.17993232727
                        ],
                        "location_index": 62,
                        "id": 63,
                        "load": [
                            20
                        ],
                        "distance": 137438,
                        "long_id": "63",
                        "internal_id": 63,
                        "snapped_location": [
                            34.09078,
                            -118.17996
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 17355,
                        "duration": 17055,
                        "service": 10,
                        "waiting_time": 0,
                        "location": [
                            34.09304239265,
                            -118.21220466614
                        ],
                        "location_index": 22,
                        "id": 23,
                        "load": [
                            19
                        ],
                        "distance": 144130,
                        "long_id": "23",
                        "internal_id": 23,
                        "snapped_location": [
                            34.09301,
                            -118.21232
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 18257,
                        "duration": 17947,
                        "service": 10,
                        "waiting_time": 0,
                        "location": [
                            34.03559121894,
                            -118.19503852844
                        ],
                        "location_index": 146,
                        "id": 146,
                        "load": [
                            18
                        ],
                        "distance": 155011,
                        "long_id": "146",
                        "internal_id": 146,
                        "snapped_location": [
                            34.03595,
                            -118.19481
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 18682,
                        "duration": 18362,
                        "service": 10,
                        "waiting_time": 0,
                        "location": [
                            34.04924651086,
                            -118.18061897278
                        ],
                        "location_index": 109,
                        "id": 110,
                        "load": [
                            17
                        ],
                        "distance": 157723,
                        "long_id": "110",
                        "internal_id": 110,
                        "snapped_location": [
                            34.04925,
                            -118.18065
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 19371,
                        "duration": 19041,
                        "service": 10,
                        "waiting_time": 0,
                        "location": [
                            34.05265999028,
                            -118.14079353333
                        ],
                        "location_index": 112,
                        "id": 113,
                        "load": [
                            16
                        ],
                        "distance": 163190,
                        "long_id": "113",
                        "internal_id": 113,
                        "snapped_location": [
                            34.05262,
                            -118.14057
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 19876,
                        "duration": 19536,
                        "service": 30,
                        "waiting_time": 0,
                        "location": [
                            34.06688134177,
                            -118.1476599884
                        ],
                        "location_index": 74,
                        "id": 75,
                        "load": [
                            15
                        ],
                        "distance": 167138,
                        "long_id": "75",
                        "internal_id": 75,
                        "snapped_location": [
                            34.06688,
                            -118.14774
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 20319,
                        "duration": 19949,
                        "service": 10,
                        "waiting_time": 0,
                        "location": [
                            34.07541300717,
                            -118.1208808136
                        ],
                        "location_index": 149,
                        "id": 149,
                        "load": [
                            14
                        ],
                        "distance": 171000,
                        "long_id": "149",
                        "internal_id": 149,
                        "snapped_location": [
                            34.07541,
                            -118.12079
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 20793,
                        "duration": 20413,
                        "service": 10,
                        "waiting_time": 0,
                        "location": [
                            34.07939415697,
                            -118.08654853821
                        ],
                        "location_index": 143,
                        "id": 143,
                        "load": [
                            13
                        ],
                        "distance": 176450,
                        "long_id": "143",
                        "internal_id": 143,
                        "snapped_location": [
                            34.07938,
                            -118.08655
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 21179,
                        "duration": 20789,
                        "service": 10,
                        "waiting_time": 0,
                        "location": [
                            34.07313798041,
                            -118.06114265442
                        ],
                        "location_index": 67,
                        "id": 68,
                        "load": [
                            12
                        ],
                        "distance": 179609,
                        "long_id": "68",
                        "internal_id": 68,
                        "snapped_location": [
                            34.07319,
                            -118.06115
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 21629,
                        "duration": 21229,
                        "service": 20,
                        "waiting_time": 0,
                        "location": [
                            34.08621854981,
                            -118.05290290833
                        ],
                        "location_index": 27,
                        "id": 28,
                        "load": [
                            11
                        ],
                        "distance": 182173,
                        "long_id": "28",
                        "internal_id": 28,
                        "snapped_location": [
                            34.08608,
                            -118.05295
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 22248,
                        "duration": 21828,
                        "service": 10,
                        "waiting_time": 0,
                        "location": [
                            34.07768797282,
                            -118.024063797
                        ],
                        "location_index": 25,
                        "id": 26,
                        "load": [
                            10
                        ],
                        "distance": 186468,
                        "long_id": "26",
                        "internal_id": 26,
                        "snapped_location": [
                            34.07779,
                            -118.02422
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 22942,
                        "duration": 22512,
                        "service": 10,
                        "waiting_time": 0,
                        "location": [
                            34.0412811911,
                            -118.00003120422
                        ],
                        "location_index": 159,
                        "id": 159,
                        "load": [
                            9
                        ],
                        "distance": 193634,
                        "long_id": "159",
                        "internal_id": 159,
                        "snapped_location": [
                            34.04104,
                            -118.00028
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 23305,
                        "duration": 22865,
                        "service": 10,
                        "waiting_time": 0,
                        "location": [
                            34.04298810832,
                            -117.98423835754
                        ],
                        "location_index": 122,
                        "id": 123,
                        "load": [
                            8
                        ],
                        "distance": 196048,
                        "long_id": "123",
                        "internal_id": 123,
                        "snapped_location": [
                            34.04314,
                            -117.98448
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 23743,
                        "duration": 23293,
                        "service": 10,
                        "waiting_time": 0,
                        "location": [
                            34.04469499118,
                            -117.96569892883
                        ],
                        "location_index": 43,
                        "id": 44,
                        "load": [
                            7
                        ],
                        "distance": 198640,
                        "long_id": "44",
                        "internal_id": 44,
                        "snapped_location": [
                            34.04492,
                            -117.96547
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 24095,
                        "duration": 23635,
                        "service": 10,
                        "waiting_time": 0,
                        "location": [
                            34.05607333226,
                            -117.96089241028
                        ],
                        "location_index": 6,
                        "id": 7,
                        "load": [
                            6
                        ],
                        "distance": 200383,
                        "long_id": "7",
                        "internal_id": 7,
                        "snapped_location": [
                            34.05625,
                            -117.96116
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 24414,
                        "duration": 23944,
                        "service": 10,
                        "waiting_time": 0,
                        "location": [
                            34.05664220923,
                            -117.94372627258
                        ],
                        "location_index": 37,
                        "id": 38,
                        "load": [
                            5
                        ],
                        "distance": 202888,
                        "long_id": "38",
                        "internal_id": 38,
                        "snapped_location": [
                            34.05662,
                            -117.94418
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 24886,
                        "duration": 24406,
                        "service": 10,
                        "waiting_time": 0,
                        "location": [
                            34.0628996039,
                            -117.91557380676
                        ],
                        "location_index": 2,
                        "id": 3,
                        "load": [
                            4
                        ],
                        "distance": 206376,
                        "long_id": "3",
                        "internal_id": 3,
                        "snapped_location": [
                            34.06291,
                            -117.91669
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 25084,
                        "duration": 24594,
                        "service": 10,
                        "waiting_time": 0,
                        "location": [
                            34.05095326775,
                            -117.91214057922
                        ],
                        "location_index": 114,
                        "id": 115,
                        "load": [
                            3
                        ],
                        "distance": 208300,
                        "long_id": "115",
                        "internal_id": 115,
                        "snapped_location": [
                            34.05095,
                            -117.91198
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 25523,
                        "duration": 25023,
                        "service": 10,
                        "waiting_time": 0,
                        "location": [
                            34.05095326775,
                            -117.8833014679
                        ],
                        "location_index": 80,
                        "id": 81,
                        "load": [
                            2
                        ],
                        "distance": 212267,
                        "long_id": "81",
                        "internal_id": 81,
                        "snapped_location": [
                            34.05117,
                            -117.88307
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 25973,
                        "duration": 25463,
                        "service": 10,
                        "waiting_time": 0,
                        "location": [
                            34.05550445148,
                            -117.86338874817
                        ],
                        "location_index": 40,
                        "id": 41,
                        "load": [
                            1
                        ],
                        "distance": 215165,
                        "long_id": "41",
                        "internal_id": 41,
                        "snapped_location": [
                            34.05605,
                            -117.86327
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 26455,
                        "duration": 25935,
                        "service": 10,
                        "waiting_time": 0,
                        "location": [
                            34.04469499118,
                            -117.89566108704
                        ],
                        "location_index": 77,
                        "id": 78,
                        "load": [
                            0
                        ],
                        "distance": 219362,
                        "long_id": "78",
                        "internal_id": 78,
                        "snapped_location": [
                            34.0447,
                            -117.89562
                        ]
                    },
                    {
                        "type": "end",
                        "arrival": 26978,
                        "duration": 26448,
                        "service": 0,
                        "waiting_time": 0,
                        "location": [
                            34.03160801132,
                            -117.91557380676
                        ],
                        "location_index": 181,
                        "load": [
                            0
                        ],
                        "distance": 222932,
                        "snapped_location": [
                            34.03163,
                            -117.91555
                        ]
                    }
                ],
                "service": 530,
                "duration": 26448,
                "waiting_time": 0,
                "priority": 0,
                "delivery": [
                    49
                ],
                "pickup": [
                    0
                ],
                "distance": 222932,
                "geometry": <route_geometry>,
                "internal_id": 2
            },
            {
                "vehicle": 1,
                "cost": 243247,
                "steps": [
                    {
                        "type": "start",
                        "arrival": 0,
                        "duration": 0,
                        "service": 0,
                        "waiting_time": 0,
                        "location": [
                            33.79626811253,
                            -117.92450019836
                        ],
                        "location_index": 180,
                        "load": [
                            46
                        ],
                        "distance": 0,
                        "snapped_location": [
                            33.79605,
                            -117.9245
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 295,
                        "duration": 295,
                        "service": 20,
                        "waiting_time": 0,
                        "location": [
                            33.79113240879,
                            -117.90046760559
                        ],
                        "location_index": 53,
                        "id": 54,
                        "load": [
                            45
                        ],
                        "distance": 2774,
                        "long_id": "54",
                        "internal_id": 54,
                        "snapped_location": [
                            33.79105,
                            -117.90047
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 891,
                        "duration": 871,
                        "service": 10,
                        "waiting_time": 0,
                        "location": [
                            33.81851926805,
                            -117.86201545715
                        ],
                        "location_index": 10,
                        "id": 11,
                        "load": [
                            44
                        ],
                        "distance": 10391,
                        "long_id": "11",
                        "internal_id": 11,
                        "snapped_location": [
                            33.81852,
                            -117.86204
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 1298,
                        "duration": 1268,
                        "service": 10,
                        "waiting_time": 0,
                        "location": [
                            33.82422376039,
                            -117.89016792297
                        ],
                        "location_index": 166,
                        "id": 166,
                        "load": [
                            43
                        ],
                        "distance": 14021,
                        "long_id": "166",
                        "internal_id": 166,
                        "snapped_location": [
                            33.82395,
                            -117.89008
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 1704,
                        "duration": 1664,
                        "service": 10,
                        "waiting_time": 0,
                        "location": [
                            33.84646764422,
                            -117.8833014679
                        ],
                        "location_index": 178,
                        "id": 178,
                        "load": [
                            42
                        ],
                        "distance": 17809,
                        "long_id": "178",
                        "internal_id": 178,
                        "snapped_location": [
                            33.84646,
                            -117.8833
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 2310,
                        "duration": 2260,
                        "service": 10,
                        "waiting_time": 0,
                        "location": [
                            33.87668723129,
                            -117.90252754211
                        ],
                        "location_index": 150,
                        "id": 150,
                        "load": [
                            41
                        ],
                        "distance": 22930,
                        "long_id": "150",
                        "internal_id": 150,
                        "snapped_location": [
                            33.87654,
                            -117.90233
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 2674,
                        "duration": 2614,
                        "service": 10,
                        "waiting_time": 0,
                        "location": [
                            33.90005730957,
                            -117.89016792297
                        ],
                        "location_index": 68,
                        "id": 69,
                        "load": [
                            40
                        ],
                        "distance": 26470,
                        "long_id": "69",
                        "internal_id": 69,
                        "snapped_location": [
                            33.90013,
                            -117.8903
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 3139,
                        "duration": 3069,
                        "service": 10,
                        "waiting_time": 0,
                        "location": [
                            33.91829292132,
                            -117.85858222961
                        ],
                        "location_index": 145,
                        "id": 145,
                        "load": [
                            39
                        ],
                        "distance": 31036,
                        "long_id": "145",
                        "internal_id": 145,
                        "snapped_location": [
                            33.91831,
                            -117.85858
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 3529,
                        "duration": 3449,
                        "service": 10,
                        "waiting_time": 0,
                        "location": [
                            33.8977775838,
                            -117.8311164093
                        ],
                        "location_index": 144,
                        "id": 144,
                        "load": [
                            38
                        ],
                        "distance": 35599,
                        "long_id": "144",
                        "internal_id": 144,
                        "snapped_location": [
                            33.89806,
                            -117.8311
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 4137,
                        "duration": 4047,
                        "service": 10,
                        "waiting_time": 0,
                        "location": [
                            33.8675654641,
                            -117.79678413391
                        ],
                        "location_index": 170,
                        "id": 170,
                        "load": [
                            37
                        ],
                        "distance": 41849,
                        "long_id": "170",
                        "internal_id": 170,
                        "snapped_location": [
                            33.86732,
                            -117.79721
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 4996,
                        "duration": 4896,
                        "service": 10,
                        "waiting_time": 0,
                        "location": [
                            33.8333501566,
                            -117.79335090637
                        ],
                        "location_index": 39,
                        "id": 40,
                        "load": [
                            36
                        ],
                        "distance": 49532,
                        "long_id": "40",
                        "internal_id": 40,
                        "snapped_location": [
                            33.83249,
                            -117.79508
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 5423,
                        "duration": 5313,
                        "service": 10,
                        "waiting_time": 0,
                        "location": [
                            33.81851926805,
                            -117.81807014465
                        ],
                        "location_index": 92,
                        "id": 93,
                        "load": [
                            35
                        ],
                        "distance": 54906,
                        "long_id": "93",
                        "internal_id": 93,
                        "snapped_location": [
                            33.81853,
                            -117.8178
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 5811,
                        "duration": 5691,
                        "service": 10,
                        "waiting_time": 0,
                        "location": [
                            33.79855054862,
                            -117.82150337219
                        ],
                        "location_index": 129,
                        "id": 129,
                        "load": [
                            34
                        ],
                        "distance": 57856,
                        "long_id": "129",
                        "internal_id": 129,
                        "snapped_location": [
                            33.79855,
                            -117.82128
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 6313,
                        "duration": 6183,
                        "service": 10,
                        "waiting_time": 0,
                        "location": [
                            33.78200150814,
                            -117.83866950989
                        ],
                        "location_index": 125,
                        "id": 126,
                        "load": [
                            33
                        ],
                        "distance": 62261,
                        "long_id": "126",
                        "internal_id": 126,
                        "snapped_location": [
                            33.782,
                            -117.83846
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 7033,
                        "duration": 6893,
                        "service": 10,
                        "waiting_time": 0,
                        "location": [
                            33.7597408593,
                            -117.8750617218
                        ],
                        "location_index": 162,
                        "id": 162,
                        "load": [
                            32
                        ],
                        "distance": 68476,
                        "long_id": "162",
                        "internal_id": 162,
                        "snapped_location": [
                            33.75974,
                            -117.87515
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 7630,
                        "duration": 7480,
                        "service": 10,
                        "waiting_time": 0,
                        "location": [
                            33.74489721412,
                            -117.90458747864
                        ],
                        "location_index": 49,
                        "id": 50,
                        "load": [
                            31
                        ],
                        "distance": 72975,
                        "long_id": "50",
                        "internal_id": 50,
                        "snapped_location": [
                            33.7449,
                            -117.90469
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 8012,
                        "duration": 7852,
                        "service": 10,
                        "waiting_time": 0,
                        "location": [
                            33.74603912421,
                            -117.93136665344
                        ],
                        "location_index": 88,
                        "id": 89,
                        "load": [
                            30
                        ],
                        "distance": 75864,
                        "long_id": "89",
                        "internal_id": 89,
                        "snapped_location": [
                            33.74609,
                            -117.93138
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 8500,
                        "duration": 8330,
                        "service": 10,
                        "waiting_time": 0,
                        "location": [
                            33.73975843056,
                            -117.96569892883
                        ],
                        "location_index": 58,
                        "id": 59,
                        "load": [
                            29
                        ],
                        "distance": 79741,
                        "long_id": "59",
                        "internal_id": 59,
                        "snapped_location": [
                            33.73976,
                            -117.96572
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 8990,
                        "duration": 8810,
                        "service": 20,
                        "waiting_time": 0,
                        "location": [
                            33.76430761773,
                            -117.97462532043
                        ],
                        "location_index": 17,
                        "id": 18,
                        "load": [
                            28
                        ],
                        "distance": 84170,
                        "long_id": "18",
                        "internal_id": 18,
                        "snapped_location": [
                            33.76439,
                            -117.97471
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 9589,
                        "duration": 9389,
                        "service": 10,
                        "waiting_time": 0,
                        "location": [
                            33.78999109946,
                            -117.99865791321
                        ],
                        "location_index": 104,
                        "id": 105,
                        "load": [
                            27
                        ],
                        "distance": 88986,
                        "long_id": "105",
                        "internal_id": 105,
                        "snapped_location": [
                            33.78999,
                            -117.99844
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 10273,
                        "duration": 10063,
                        "service": 10,
                        "waiting_time": 0,
                        "location": [
                            33.74775196084,
                            -118.01719734192
                        ],
                        "location_index": 172,
                        "id": 172,
                        "load": [
                            26
                        ],
                        "distance": 96619,
                        "long_id": "172",
                        "internal_id": 172,
                        "snapped_location": [
                            33.74775,
                            -118.01723
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 11074,
                        "duration": 10854,
                        "service": 10,
                        "waiting_time": 0,
                        "location": [
                            33.78999109946,
                            -118.09341499329
                        ],
                        "location_index": 179,
                        "id": 179,
                        "load": [
                            25
                        ],
                        "distance": 109037,
                        "long_id": "179",
                        "internal_id": 179,
                        "snapped_location": [
                            33.79007,
                            -118.09365
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 11679,
                        "duration": 11449,
                        "service": 10,
                        "waiting_time": 0,
                        "location": [
                            33.77344040457,
                            -118.13118049622
                        ],
                        "location_index": 142,
                        "id": 142,
                        "load": [
                            24
                        ],
                        "distance": 114354,
                        "long_id": "142",
                        "internal_id": 142,
                        "snapped_location": [
                            33.77344,
                            -118.13123
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 12095,
                        "duration": 11855,
                        "service": 20,
                        "waiting_time": 0,
                        "location": [
                            33.79969174384,
                            -118.13392707825
                        ],
                        "location_index": 18,
                        "id": 19,
                        "load": [
                            23
                        ],
                        "distance": 117758,
                        "long_id": "19",
                        "internal_id": 19,
                        "snapped_location": [
                            33.79969,
                            -118.13398
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 12581,
                        "duration": 12321,
                        "service": 10,
                        "waiting_time": 0,
                        "location": [
                            33.78942043909,
                            -118.17443916321
                        ],
                        "location_index": 136,
                        "id": 136,
                        "load": [
                            22
                        ],
                        "distance": 122196,
                        "long_id": "136",
                        "internal_id": 136,
                        "snapped_location": [
                            33.78946,
                            -118.17445
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 13834,
                        "duration": 13564,
                        "service": 10,
                        "waiting_time": 0,
                        "location": [
                            33.80197408864,
                            -118.22525093079
                        ],
                        "location_index": 119,
                        "id": 120,
                        "load": [
                            21
                        ],
                        "distance": 130116,
                        "long_id": "120",
                        "internal_id": 120,
                        "snapped_location": [
                            33.8019,
                            -118.22498
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 14806,
                        "duration": 14526,
                        "service": 10,
                        "waiting_time": 0,
                        "location": [
                            33.82365332828,
                            -118.19229194641
                        ],
                        "location_index": 165,
                        "id": 165,
                        "load": [
                            20
                        ],
                        "distance": 137974,
                        "long_id": "165",
                        "internal_id": 165,
                        "snapped_location": [
                            33.82361,
                            -118.19282
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 15449,
                        "duration": 15159,
                        "service": 10,
                        "waiting_time": 0,
                        "location": [
                            33.85231240478,
                            -118.21718233109
                        ],
                        "location_index": 153,
                        "id": 153,
                        "load": [
                            19
                        ],
                        "distance": 145263,
                        "long_id": "153",
                        "internal_id": 153,
                        "snapped_location": [
                            33.85218,
                            -118.21719
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 16063,
                        "duration": 15763,
                        "service": 10,
                        "waiting_time": 0,
                        "location": [
                            33.85217027165,
                            -118.18542549133
                        ],
                        "location_index": 121,
                        "id": 122,
                        "load": [
                            18
                        ],
                        "distance": 150821,
                        "long_id": "122",
                        "internal_id": 122,
                        "snapped_location": [
                            33.85244,
                            -118.18543
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 16428,
                        "duration": 16118,
                        "service": 10,
                        "waiting_time": 0,
                        "location": [
                            33.85616188435,
                            -118.16551277161
                        ],
                        "location_index": 151,
                        "id": 151,
                        "load": [
                            17
                        ],
                        "distance": 153030,
                        "long_id": "151",
                        "internal_id": 151,
                        "snapped_location": [
                            33.85616,
                            -118.16598
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 17019,
                        "duration": 16699,
                        "service": 10,
                        "waiting_time": 0,
                        "location": [
                            33.8333501566,
                            -118.14491340637
                        ],
                        "location_index": 128,
                        "id": 128,
                        "load": [
                            16
                        ],
                        "distance": 157475,
                        "long_id": "128",
                        "internal_id": 128,
                        "snapped_location": [
                            33.83333,
                            -118.14484
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 17626,
                        "duration": 17296,
                        "service": 10,
                        "waiting_time": 0,
                        "location": [
                            33.82137156178,
                            -118.10714790344
                        ],
                        "location_index": 175,
                        "id": 175,
                        "load": [
                            15
                        ],
                        "distance": 162993,
                        "long_id": "175",
                        "internal_id": 175,
                        "snapped_location": [
                            33.82133,
                            -118.10708
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 18207,
                        "duration": 17867,
                        "service": 10,
                        "waiting_time": 0,
                        "location": [
                            33.84817847242,
                            -118.07487556458
                        ],
                        "location_index": 48,
                        "id": 49,
                        "load": [
                            14
                        ],
                        "distance": 169711,
                        "long_id": "49",
                        "internal_id": 49,
                        "snapped_location": [
                            33.84795,
                            -118.07488
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 18730,
                        "duration": 18380,
                        "service": 10,
                        "waiting_time": 0,
                        "location": [
                            33.82080111065,
                            -118.06114265442
                        ],
                        "location_index": 61,
                        "id": 62,
                        "load": [
                            13
                        ],
                        "distance": 174216,
                        "long_id": "62",
                        "internal_id": 62,
                        "snapped_location": [
                            33.82085,
                            -118.06135
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 19276,
                        "duration": 18916,
                        "service": 10,
                        "waiting_time": 0,
                        "location": [
                            33.80425637258,
                            -118.02955696106
                        ],
                        "location_index": 69,
                        "id": 70,
                        "load": [
                            12
                        ],
                        "distance": 179223,
                        "long_id": "70",
                        "internal_id": 70,
                        "snapped_location": [
                            33.80426,
                            -118.0295
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 19587,
                        "duration": 19217,
                        "service": 20,
                        "waiting_time": 0,
                        "location": [
                            33.82422376039,
                            -118.02749702454
                        ],
                        "location_index": 33,
                        "id": 34,
                        "load": [
                            11
                        ],
                        "distance": 181617,
                        "long_id": "34",
                        "internal_id": 34,
                        "snapped_location": [
                            33.82421,
                            -118.02772
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 20057,
                        "duration": 19667,
                        "service": 20,
                        "waiting_time": 0,
                        "location": [
                            33.83277978538,
                            -118.00483772278
                        ],
                        "location_index": 111,
                        "id": 112,
                        "load": [
                            10
                        ],
                        "distance": 185176,
                        "long_id": "112",
                        "internal_id": 112,
                        "snapped_location": [
                            33.83264,
                            -118.0048
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 20600,
                        "duration": 20190,
                        "service": 10,
                        "waiting_time": 0,
                        "location": [
                            33.84304588505,
                            -117.97874519348
                        ],
                        "location_index": 76,
                        "id": 77,
                        "load": [
                            9
                        ],
                        "distance": 189059,
                        "long_id": "77",
                        "internal_id": 77,
                        "snapped_location": [
                            33.84306,
                            -117.97876
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 21244,
                        "duration": 20824,
                        "service": 10,
                        "waiting_time": 0,
                        "location": [
                            33.86984599729,
                            -118.00346443176
                        ],
                        "location_index": 13,
                        "id": 14,
                        "load": [
                            8
                        ],
                        "distance": 194876,
                        "long_id": "14",
                        "internal_id": 14,
                        "snapped_location": [
                            33.86964,
                            -118.00362
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 21796,
                        "duration": 21366,
                        "service": 10,
                        "waiting_time": 0,
                        "location": [
                            33.88067769789,
                            -117.96501228333
                        ],
                        "location_index": 169,
                        "id": 169,
                        "load": [
                            7
                        ],
                        "distance": 199842,
                        "long_id": "169",
                        "internal_id": 169,
                        "snapped_location": [
                            33.88069,
                            -117.96505
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 22727,
                        "duration": 22287,
                        "service": 10,
                        "waiting_time": 0,
                        "location": [
                            33.93766398347,
                            -117.95608589172
                        ],
                        "location_index": 21,
                        "id": 22,
                        "load": [
                            6
                        ],
                        "distance": 207642,
                        "long_id": "22",
                        "internal_id": 22,
                        "snapped_location": [
                            33.9372,
                            -117.95572
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 23413,
                        "duration": 22963,
                        "service": 10,
                        "waiting_time": 0,
                        "location": [
                            33.92171166417,
                            -117.92450019836
                        ],
                        "location_index": 52,
                        "id": 53,
                        "load": [
                            5
                        ],
                        "distance": 212852,
                        "long_id": "53",
                        "internal_id": 53,
                        "snapped_location": [
                            33.92171,
                            -117.92464
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 23966,
                        "duration": 23506,
                        "service": 10,
                        "waiting_time": 0,
                        "location": [
                            33.89834752096,
                            -117.94235298157
                        ],
                        "location_index": 91,
                        "id": 92,
                        "load": [
                            4
                        ],
                        "distance": 216928,
                        "long_id": "92",
                        "internal_id": 92,
                        "snapped_location": [
                            33.89835,
                            -117.94236
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 24427,
                        "duration": 23957,
                        "service": 20,
                        "waiting_time": 0,
                        "location": [
                            33.85787251839,
                            -117.93960639954
                        ],
                        "location_index": 36,
                        "id": 37,
                        "load": [
                            3
                        ],
                        "distance": 221747,
                        "long_id": "37",
                        "internal_id": 37,
                        "snapped_location": [
                            33.85788,
                            -117.93933
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 25238,
                        "duration": 24748,
                        "service": 10,
                        "waiting_time": 0,
                        "location": [
                            33.81680784615,
                            -117.93960639954
                        ],
                        "location_index": 65,
                        "id": 66,
                        "load": [
                            2
                        ],
                        "distance": 230195,
                        "long_id": "66",
                        "internal_id": 66,
                        "snapped_location": [
                            33.81681,
                            -117.93962
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 25719,
                        "duration": 25219,
                        "service": 10,
                        "waiting_time": 0,
                        "location": [
                            33.808250223,
                            -117.96981880188
                        ],
                        "location_index": 140,
                        "id": 140,
                        "load": [
                            1
                        ],
                        "distance": 234345,
                        "long_id": "140",
                        "internal_id": 140,
                        "snapped_location": [
                            33.80825,
                            -117.96959
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 26278,
                        "duration": 25768,
                        "service": 10,
                        "waiting_time": 0,
                        "location": [
                            33.78143079452,
                            -117.94647285461
                        ],
                        "location_index": 14,
                        "id": 15,
                        "load": [
                            0
                        ],
                        "distance": 239460,
                        "long_id": "15",
                        "internal_id": 15,
                        "snapped_location": [
                            33.78142,
                            -117.94647
                        ]
                    },
                    {
                        "type": "end",
                        "arrival": 26649,
                        "duration": 26129,
                        "service": 0,
                        "waiting_time": 0,
                        "location": [
                            33.79626811253,
                            -117.92450019836
                        ],
                        "location_index": 180,
                        "load": [
                            0
                        ],
                        "distance": 243247,
                        "snapped_location": [
                            33.79605,
                            -117.9245
                        ]
                    }
                ],
                "service": 520,
                "duration": 26129,
                "waiting_time": 0,
                "priority": 0,
                "delivery": [
                    46
                ],
                "pickup": [
                    0
                ],
                "distance": 243247,
                "geometry": <route_geometry>,
                "internal_id": 1
            },
            {
                "vehicle": 3,
                "cost": 161479,
                "steps": [
                    {
                        "type": "start",
                        "arrival": 0,
                        "duration": 0,
                        "service": 0,
                        "waiting_time": 0,
                        "location": [
                            33.94051229749,
                            -118.12706062317
                        ],
                        "location_index": 182,
                        "load": [
                            37
                        ],
                        "distance": 0,
                        "snapped_location": [
                            33.9408,
                            -118.12763
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 366,
                        "duration": 366,
                        "service": 10,
                        "waiting_time": 0,
                        "location": [
                            33.93652463118,
                            -118.09616157532
                        ],
                        "location_index": 3,
                        "id": 4,
                        "load": [
                            36
                        ],
                        "distance": 3945,
                        "long_id": "4",
                        "internal_id": 4,
                        "snapped_location": [
                            33.93669,
                            -118.09603
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 925,
                        "duration": 915,
                        "service": 10,
                        "waiting_time": 0,
                        "location": [
                            33.9222814413,
                            -118.11744758606
                        ],
                        "location_index": 35,
                        "id": 36,
                        "load": [
                            35
                        ],
                        "distance": 9145,
                        "long_id": "36",
                        "internal_id": 36,
                        "snapped_location": [
                            33.92205,
                            -118.11744
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 1419,
                        "duration": 1399,
                        "service": 10,
                        "waiting_time": 0,
                        "location": [
                            33.90917560312,
                            -118.14491340637
                        ],
                        "location_index": 1,
                        "id": 2,
                        "load": [
                            34
                        ],
                        "distance": 13538,
                        "long_id": "2",
                        "internal_id": 2,
                        "snapped_location": [
                            33.90881,
                            -118.14532
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 2051,
                        "duration": 2021,
                        "service": 10,
                        "waiting_time": 0,
                        "location": [
                            33.89150802366,
                            -118.17237922668
                        ],
                        "location_index": 28,
                        "id": 29,
                        "load": [
                            33
                        ],
                        "distance": 17983,
                        "long_id": "29",
                        "internal_id": 29,
                        "snapped_location": [
                            33.89154,
                            -118.17238
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 2805,
                        "duration": 2765,
                        "service": 20,
                        "waiting_time": 0,
                        "location": [
                            33.86642517466,
                            -118.13049385071
                        ],
                        "location_index": 115,
                        "id": 116,
                        "load": [
                            32
                        ],
                        "distance": 24704,
                        "long_id": "116",
                        "internal_id": 116,
                        "snapped_location": [
                            33.86642,
                            -118.1309
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 3432,
                        "duration": 3372,
                        "service": 10,
                        "waiting_time": 0,
                        "location": [
                            33.88295788074,
                            -118.10028144836
                        ],
                        "location_index": 152,
                        "id": 152,
                        "load": [
                            31
                        ],
                        "distance": 31715,
                        "long_id": "152",
                        "internal_id": 152,
                        "snapped_location": [
                            33.88296,
                            -118.10044
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 3990,
                        "duration": 3920,
                        "service": 10,
                        "waiting_time": 0,
                        "location": [
                            33.88979806364,
                            -118.07075569153
                        ],
                        "location_index": 34,
                        "id": 35,
                        "load": [
                            30
                        ],
                        "distance": 35451,
                        "long_id": "35",
                        "internal_id": 35,
                        "snapped_location": [
                            33.8898,
                            -118.07083
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 4478,
                        "duration": 4398,
                        "service": 10,
                        "waiting_time": 0,
                        "location": [
                            33.87440688089,
                            -118.04328987122
                        ],
                        "location_index": 9,
                        "id": 10,
                        "load": [
                            29
                        ],
                        "distance": 39875,
                        "long_id": "10",
                        "internal_id": 10,
                        "snapped_location": [
                            33.87441,
                            -118.04303
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 4915,
                        "duration": 4825,
                        "service": 10,
                        "waiting_time": 0,
                        "location": [
                            33.89264797797,
                            -118.05152961731
                        ],
                        "location_index": 103,
                        "id": 104,
                        "load": [
                            28
                        ],
                        "distance": 43137,
                        "long_id": "104",
                        "internal_id": 104,
                        "snapped_location": [
                            33.89264,
                            -118.05177
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 5596,
                        "duration": 5496,
                        "service": 10,
                        "waiting_time": 0,
                        "location": [
                            33.9257000241,
                            -118.05427619934
                        ],
                        "location_index": 0,
                        "id": 1,
                        "load": [
                            27
                        ],
                        "distance": 48581,
                        "long_id": "1",
                        "internal_id": 1,
                        "snapped_location": [
                            33.92598,
                            -118.05453
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 5858,
                        "duration": 5748,
                        "service": 10,
                        "waiting_time": 0,
                        "location": [
                            33.93025792109,
                            -118.04397651672
                        ],
                        "location_index": 64,
                        "id": 65,
                        "load": [
                            26
                        ],
                        "distance": 50461,
                        "long_id": "65",
                        "internal_id": 65,
                        "snapped_location": [
                            33.93026,
                            -118.0442
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 6215,
                        "duration": 6095,
                        "service": 10,
                        "waiting_time": 0,
                        "location": [
                            33.91715330989,
                            -118.01445075989
                        ],
                        "location_index": 100,
                        "id": 101,
                        "load": [
                            25
                        ],
                        "distance": 54310,
                        "long_id": "101",
                        "internal_id": 101,
                        "snapped_location": [
                            33.91712,
                            -118.01445
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 6598,
                        "duration": 6468,
                        "service": 10,
                        "waiting_time": 0,
                        "location": [
                            33.93481557416,
                            -117.9979712677
                        ],
                        "location_index": 135,
                        "id": 135,
                        "load": [
                            24
                        ],
                        "distance": 57608,
                        "long_id": "135",
                        "internal_id": 135,
                        "snapped_location": [
                            33.93504,
                            -117.99785
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 7059,
                        "duration": 6919,
                        "service": 10,
                        "waiting_time": 0,
                        "location": [
                            33.95475243813,
                            -118.02063056946
                        ],
                        "location_index": 174,
                        "id": 174,
                        "load": [
                            23
                        ],
                        "distance": 61390,
                        "long_id": "174",
                        "internal_id": 174,
                        "snapped_location": [
                            33.95484,
                            -118.02071
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 7482,
                        "duration": 7332,
                        "service": 10,
                        "waiting_time": 0,
                        "location": [
                            33.9752540545,
                            -118.04672309875
                        ],
                        "location_index": 139,
                        "id": 139,
                        "load": [
                            22
                        ],
                        "distance": 64913,
                        "long_id": "139",
                        "internal_id": 139,
                        "snapped_location": [
                            33.97526,
                            -118.04671
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 8023,
                        "duration": 7863,
                        "service": 10,
                        "waiting_time": 0,
                        "location": [
                            33.99347356442,
                            -118.07556221008
                        ],
                        "location_index": 113,
                        "id": 114,
                        "load": [
                            21
                        ],
                        "distance": 69181,
                        "long_id": "114",
                        "internal_id": 114,
                        "snapped_location": [
                            33.99356,
                            -118.07551
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 8603,
                        "duration": 8433,
                        "service": 10,
                        "waiting_time": 0,
                        "location": [
                            34.0105508075,
                            -118.09959480286
                        ],
                        "location_index": 75,
                        "id": 76,
                        "load": [
                            20
                        ],
                        "distance": 73268,
                        "long_id": "76",
                        "internal_id": 76,
                        "snapped_location": [
                            34.01017,
                            -118.09972
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 9263,
                        "duration": 9083,
                        "service": 10,
                        "waiting_time": 0,
                        "location": [
                            33.97069856681,
                            -118.09547492981
                        ],
                        "location_index": 155,
                        "id": 155,
                        "load": [
                            19
                        ],
                        "distance": 79158,
                        "long_id": "155",
                        "internal_id": 155,
                        "snapped_location": [
                            33.97065,
                            -118.0953
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 9936,
                        "duration": 9746,
                        "service": 20,
                        "waiting_time": 0,
                        "location": [
                            33.95930877992,
                            -118.14148017883
                        ],
                        "location_index": 78,
                        "id": 79,
                        "load": [
                            18
                        ],
                        "distance": 85669,
                        "long_id": "79",
                        "internal_id": 79,
                        "snapped_location": [
                            33.95932,
                            -118.14147
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 10634,
                        "duration": 10424,
                        "service": 10,
                        "waiting_time": 0,
                        "location": [
                            33.96101734518,
                            -118.18611213684
                        ],
                        "location_index": 168,
                        "id": 168,
                        "load": [
                            17
                        ],
                        "distance": 91104,
                        "long_id": "168",
                        "internal_id": 168,
                        "snapped_location": [
                            33.96102,
                            -118.18619
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 11143,
                        "duration": 10923,
                        "service": 10,
                        "waiting_time": 0,
                        "location": [
                            33.98037868641,
                            -118.21151802063
                        ],
                        "location_index": 51,
                        "id": 52,
                        "load": [
                            16
                        ],
                        "distance": 94969,
                        "long_id": "52",
                        "internal_id": 52,
                        "snapped_location": [
                            33.98038,
                            -118.2115
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 11639,
                        "duration": 11409,
                        "service": 10,
                        "waiting_time": 0,
                        "location": [
                            33.99973561887,
                            -118.19297859192
                        ],
                        "location_index": 90,
                        "id": 91,
                        "load": [
                            15
                        ],
                        "distance": 99161,
                        "long_id": "91",
                        "internal_id": 91,
                        "snapped_location": [
                            33.99972,
                            -118.19291
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 12070,
                        "duration": 11830,
                        "service": 10,
                        "waiting_time": 0,
                        "location": [
                            34.00428955037,
                            -118.22387763977
                        ],
                        "location_index": 161,
                        "id": 161,
                        "load": [
                            14
                        ],
                        "distance": 102696,
                        "long_id": "161",
                        "internal_id": 161,
                        "snapped_location": [
                            34.00415,
                            -118.22431
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 12866,
                        "duration": 12616,
                        "service": 10,
                        "waiting_time": 0,
                        "location": [
                            33.99688928771,
                            -118.25614997864
                        ],
                        "location_index": 130,
                        "id": 130,
                        "load": [
                            13
                        ],
                        "distance": 108258,
                        "long_id": "130",
                        "internal_id": 130,
                        "snapped_location": [
                            33.99688,
                            -118.25602
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 13270,
                        "duration": 13010,
                        "service": 10,
                        "waiting_time": 0,
                        "location": [
                            33.99575072853,
                            -118.2788092804
                        ],
                        "location_index": 79,
                        "id": 80,
                        "load": [
                            12
                        ],
                        "distance": 110461,
                        "long_id": "80",
                        "internal_id": 80,
                        "snapped_location": [
                            33.99575,
                            -118.27881
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 13641,
                        "duration": 13371,
                        "service": 10,
                        "waiting_time": 0,
                        "location": [
                            34.00372032229,
                            -118.30009529114
                        ],
                        "location_index": 123,
                        "id": 124,
                        "load": [
                            11
                        ],
                        "distance": 113281,
                        "long_id": "124",
                        "internal_id": 124,
                        "snapped_location": [
                            34.0037,
                            -118.3001
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 14180,
                        "duration": 13900,
                        "service": 10,
                        "waiting_time": 0,
                        "location": [
                            33.99119633927,
                            -118.33580085754
                        ],
                        "location_index": 8,
                        "id": 9,
                        "load": [
                            10
                        ],
                        "distance": 117932,
                        "long_id": "9",
                        "internal_id": 9,
                        "snapped_location": [
                            33.9912,
                            -118.33558
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 14687,
                        "duration": 14397,
                        "service": 10,
                        "waiting_time": 0,
                        "location": [
                            33.98037868641,
                            -118.30696174622
                        ],
                        "location_index": 86,
                        "id": 87,
                        "load": [
                            9
                        ],
                        "distance": 121787,
                        "long_id": "87",
                        "internal_id": 87,
                        "snapped_location": [
                            33.98038,
                            -118.30677
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 15168,
                        "duration": 14868,
                        "service": 10,
                        "waiting_time": 0,
                        "location": [
                            33.9758234733,
                            -118.27674934387
                        ],
                        "location_index": 156,
                        "id": 156,
                        "load": [
                            8
                        ],
                        "distance": 125502,
                        "long_id": "156",
                        "internal_id": 156,
                        "snapped_location": [
                            33.97605,
                            -118.27675
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 15697,
                        "duration": 15387,
                        "service": 10,
                        "waiting_time": 0,
                        "location": [
                            33.97126801612,
                            -118.24653694153
                        ],
                        "location_index": 15,
                        "id": 16,
                        "load": [
                            7
                        ],
                        "distance": 128787,
                        "long_id": "16",
                        "internal_id": 16,
                        "snapped_location": [
                            33.97167,
                            -118.24654
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 16377,
                        "duration": 16057,
                        "service": 10,
                        "waiting_time": 0,
                        "location": [
                            33.95304374705,
                            -118.28086921692
                        ],
                        "location_index": 42,
                        "id": 43,
                        "load": [
                            6
                        ],
                        "distance": 134113,
                        "long_id": "43",
                        "internal_id": 43,
                        "snapped_location": [
                            33.95304,
                            -118.28101
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 16909,
                        "duration": 16579,
                        "service": 10,
                        "waiting_time": 0,
                        "location": [
                            33.91316454986,
                            -118.2788092804
                        ],
                        "location_index": 73,
                        "id": 74,
                        "load": [
                            5
                        ],
                        "distance": 138863,
                        "long_id": "74",
                        "internal_id": 74,
                        "snapped_location": [
                            33.91316,
                            -118.27899
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 17342,
                        "duration": 17002,
                        "service": 10,
                        "waiting_time": 0,
                        "location": [
                            33.91829292132,
                            -118.25546333313
                        ],
                        "location_index": 71,
                        "id": 72,
                        "load": [
                            4
                        ],
                        "distance": 141779,
                        "long_id": "72",
                        "internal_id": 72,
                        "snapped_location": [
                            33.9185,
                            -118.25546
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 17868,
                        "duration": 17518,
                        "service": 10,
                        "waiting_time": 0,
                        "location": [
                            33.94051229749,
                            -118.23967048645
                        ],
                        "location_index": 55,
                        "id": 56,
                        "load": [
                            3
                        ],
                        "distance": 145957,
                        "long_id": "56",
                        "internal_id": 56,
                        "snapped_location": [
                            33.94051,
                            -118.23966
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 18251,
                        "duration": 17891,
                        "service": 10,
                        "waiting_time": 0,
                        "location": [
                            33.92285121463,
                            -118.22456428528
                        ],
                        "location_index": 108,
                        "id": 109,
                        "load": [
                            2
                        ],
                        "distance": 148750,
                        "long_id": "109",
                        "internal_id": 109,
                        "snapped_location": [
                            33.92285,
                            -118.22456
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 18744,
                        "duration": 18374,
                        "service": 10,
                        "waiting_time": 0,
                        "location": [
                            33.92683952121,
                            -118.20121833801
                        ],
                        "location_index": 12,
                        "id": 13,
                        "load": [
                            1
                        ],
                        "distance": 152492,
                        "long_id": "13",
                        "internal_id": 13,
                        "snapped_location": [
                            33.92665,
                            -118.20075
                        ]
                    },
                    {
                        "type": "job",
                        "arrival": 19291,
                        "duration": 18911,
                        "service": 10,
                        "waiting_time": 0,
                        "location": [
                            33.93310648284,
                            -118.15933296204
                        ],
                        "location_index": 38,
                        "id": 39,
                        "load": [
                            0
                        ],
                        "distance": 157197,
                        "long_id": "39",
                        "internal_id": 39,
                        "snapped_location": [
                            33.93306,
                            -118.15925
                        ]
                    },
                    {
                        "type": "end",
                        "arrival": 19736,
                        "duration": 19346,
                        "service": 0,
                        "waiting_time": 0,
                        "location": [
                            33.94051229749,
                            -118.12706062317
                        ],
                        "location_index": 182,
                        "load": [
                            0
                        ],
                        "distance": 161479,
                        "snapped_location": [
                            33.9408,
                            -118.12763
                        ]
                    }
                ],
                "service": 390,
                "duration": 19346,
                "waiting_time": 0,
                "priority": 0,
                "delivery": [
                    37
                ],
                "pickup": [
                    0
                ],
                "distance": 161479,
                "geometry": <route_geometry>,
                "internal_id": 3
            }
        ]
    },
    "status": "Ok",
    "message": ""
}
```

Following image shows a visual representation of the above route plan

![documentation image](https://static.nextbillion.io/docs-next/docs/route-optimization/route-grouping-1.webp)

## Analyzing the Solution

Looking at the result we can observe some interesting insights:

- All tasks were assigned using 4 routes with a total distance traveled of 874 km.
- We can see in the image above that the solution hardly has the routes crossing each other and avoid going back and forth on the same road segment as much as possible.
- The task distribution is good and it ensures that there are clear “operating zones” for each vehicle.

To understand the effect of using the Route Grouping feature, take a look at the below image representing a similar route plan suggested when route grouping was not used for the same set of tasks and vehicles.

![documentation image](https://static.nextbillion.io/docs-next/docs/route-optimization/route-grouping-2.webp)

We can observe that the routes cross each other at multiple places. Also, the distribution of tasks in this solution is such that there is no clear “operating zone” for vehicles and it overlaps at multiple places for at least a couple of vehicles.

This comparison shows how NextBillion.ai’s Route Optimization API uses its route grouping capabilities to execute a route plan using highly efficient routes. We encourage you to go ahead and try out different configurations of tasks, vehicles and zoning parameters to explore how the solution changes under different scenarios presented to Route Optimization API.

Learn more about the other [powerful features](https://docs.nextbillion.ai/optimization/route-optimization-api/tutorials) and the related use cases that Route Optimization API can solve for you.

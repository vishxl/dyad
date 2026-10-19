# Directions(Sample)

Use the `DirectionsService` to get route data and render it in the most simple way. Checkout the [DirectionsService](../references/directions) to learn more.

## Demo

<iframe style="border:none;width:100%;height:400px" src="https://fjgq7.csb.app/v2/directions.html"></iframe>

## Examples

### Plain HTML

You can find the live Demo on CodeSandbox [here](https://codesandbox.io/s/fjgq7?file=/v2/directions.html).

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta name="viewport" content="initial-scale=1.0" />
    <meta charset="UTF-8" />
    <title>Basic Map</title>
    <link
      href="https://maps-gl.nextbillion.io/maps/v2/api/css"
      rel="stylesheet"
    />
    <style>
      * {
        margin: 0;
        padding: 0;
      }
      #map {
        width: 100vw;
        height: 100vh;
      }
    </style>
  </head>
  <body>
    <div id="map"></div>
    <script src="https://maps-gl.nextbillion.io/maps/v2/api/js"></script>
    <script>
      (function () {
        // You need to replace the apiKey with yours
        nextbillion.apiKey = "<your_api_key>";
        var nbmap = new nextbillion.maps.Map({
          container: document.getElementById("map"),
          style: "https://api.nextbillion.io/maps/streets/style.json",
          zoom: 10,
          center: { lat: 34.08572, lng: -118.324569 },
        });

        nbmap.on("load", function () {
          const directionsService = new nextbillion.maps.DirectionsService();
          // request the directions api
          directionsService
            .route({
              origin: { lat: 34.06, lng: -118.424569 },
              waypoints: [{ lat: 33.98, lng: -118.354569 }],
              destination: { lat: 34.06, lng: -118.224569 },
            })
            .then((response) => {
              // render the result
              nbmap.map.addSource("route", {
                type: "geojson",
                data: {
                  type: "Feature",
                  properties: {},
                  geometry: {
                    type: "LineString",
                    coordinates: nextbillion.utils.polyline
                      .decode(response.routes[0].geometry, 6)
                      .map((c) => c.reverse()),
                  },
                },
              });
              nbmap.map.addLayer({
                id: "route",
                type: "line",
                source: "route",
                layout: {
                  "line-join": "round",
                  "line-cap": "round",
                },
                paint: {
                  "line-color": "#8D5A9E",
                  "line-width": 8,
                },
              });
            });
        });
      })();
    </script>
  </body>
</html>
```

### React

You can find the live Demo on CodeSandbox [here](https://codesandbox.io/p/sandbox/unruffled-cache-gvpy6k?file=/src/pages/Directions.js).

```javascript
import React, { useEffect } from "react";
import "@nbai/nbmap-gl/dist/nextbillion.css";
import nextbillion, { NBMap, DirectionsService } from "@nbai/nbmap-gl";

const DirectionsDemo = () => {
  useEffect(() => {
    nextbillion.apiKey = "<your_api_key>";
    const nbmap = new NBMap({
      container: document.getElementById("map"),
      style: "https://api.nextbillion.io/maps/streets/style.json",
      zoom: 10,
      center: { lat: 34.08572, lng: -118.324569 },
    });

    nbmap.on("load", function () {
      const directionsService = new DirectionsService();
      // request the directions api
      directionsService
        .route({
          origin: { lat: 34.06, lng: -118.424569 },
          waypoints: [{ lat: 33.98, lng: -118.354569 }],
          destination: { lat: 34.06, lng: -118.224569 },
        })
        .then((response) => {
          // render the result
          nbmap.map.addSource("route", {
            type: "geojson",
            data: {
              type: "Feature",
              properties: {},
              geometry: {
                type: "LineString",
                coordinates: nextbillion.utils.polyline
                  .decode(response.routes[0].geometry, 6)
                  .map((c) => c.reverse()),
              },
            },
          });
          nbmap.map.addLayer({
            id: "route",
            type: "line",
            source: "route",
            layout: {
              "line-join": "round",
              "line-cap": "round",
            },
            paint: {
              "line-color": "#8D5A9E",
              "line-width": 8,
            },
          });
        });
    });
  });

  return (
    <div className="app">
      <div
        style={{
          width: "100%",
          height: "100%",
          position: "fixed",
          top: "0",
          left: "0",
        }}
        id="map"
      ></div>
    </div>
  );
};
export default DirectionsDemo;
```

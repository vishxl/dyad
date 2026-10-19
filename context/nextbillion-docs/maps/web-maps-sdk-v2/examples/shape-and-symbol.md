# Shape & Symbol

Draw different shapes and symbol to the map.

## Demo

<iframe style="border:none;width:100%;height:400px" src="https://fjgq7.csb.app/v2/shape-and-symbol.html"></iframe>

### Plain HTML

You can find the live Demo on CodeSandbox [here](https://codesandbox.io/s/fjgq7?file=/v2/shape-and-symbol.html).

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
        // draw a polyline
        function drawPolyline(nbmap) {
          nbmap.map.addSource("polyline-source", {
            type: "geojson",
            data: {
              type: "FeatureCollection",
              features: [
                {
                  type: "Feature",
                  properties: {
                    color: "#e74747", // red clolor
                  },
                  geometry: {
                    type: "LineString",
                    coordinates: [
                      [-118.24648, 34.05815],
                      [-118.24556, 34.05739],
                      [-118.2445, 34.0565],
                      [-118.24397, 34.05605],
                      [-118.24359, 34.05573],
                      [-118.24372, 34.05559],
                      [-118.24385, 34.05544],
                      [-118.24427, 34.05501],
                      [-118.24509, 34.05412],
                      [-118.24555, 34.05361],
                    ],
                  },
                },
                {
                  type: "Feature",
                  properties: {
                    color: "#93a1ff", // blue clolor
                  },
                  geometry: {
                    type: "LineString",
                    coordinates: [
                      [-118.24648, 34.05815],
                      [-118.24748, 34.05725],
                      [-118.24763, 34.05712],
                      [-118.24797, 34.05678],
                      [-118.24823, 34.05641],
                      [-118.24836, 34.05623],
                      [-118.24874572, 34.05567155],
                      [-118.24637, 34.05417],
                      [-118.24571, 34.05376],
                      [-118.24553, 34.05363],
                      [-118.24555, 34.05361],
                    ],
                  },
                },
              ],
            },
          });

          // you can get more information about setting the style of lines here. https://maplibre.org/maplibre-gl-js-docs/style-spec/layers/#line
          nbmap.map.addLayer({
            id: "polyline-layer",
            type: "line",
            source: "polyline-source",
            paint: {
              "line-width": 3,
              // get color from the source
              "line-color": ["get", "color"],
            },
          });
        }

        // draw a polygon
        function drawPolygon(nbmap) {
          nbmap.map.addSource("polygon-source", {
            type: "geojson",
            data: {
              type: "FeatureCollection",
              features: [
                {
                  type: "Feature",
                  geometry: {
                    type: "Polygon",
                    coordinates: [
                      [
                        [-118.24455192, 34.05649731],
                        [-118.24646327, 34.05811205],
                        [-118.24751855, 34.05716641],
                        [-118.2479062, 34.05678279],
                        [-118.24834231, 34.05621183],
                        [-118.24870843, 34.05567655],
                        [-118.24661649, 34.05436717],
                        [-118.24455192, 34.05649731],
                      ],
                    ],
                  },
                },
              ],
            },
          });

          // you can get more information about setting the style of layers here. https://maplibre.org/maplibre-gl-js-docs/style-spec/layers/
          nbmap.map.addLayer({
            id: "polygon-layer",
            type: "fill",
            source: "polygon-source",
            paint: {
              // fill with green color and a opacity of 0.6
              "fill-color": "#469300",
              "fill-opacity": 0.6,
            },
          });
        }

        // draw a circle
        function drawCircle(nbmap) {
          nbmap.map.addSource("circle-source", {
            type: "geojson",
            data: {
              type: "FeatureCollection",
              features: [
                {
                  type: "Feature",
                  geometry: {
                    type: "Point",
                    coordinates: [-118.24501946, 34.05507342],
                  },
                },
              ],
            },
          });
          // you can get more information about setting the style of layers here. https://maplibre.org/maplibre-gl-js-docs/style-spec/layers/#circle
          nbmap.map.addLayer({
            id: "circle-layer",
            type: "circle",
            source: "circle-source",
            paint: {
              "circle-color": "#8d5a9e",
              "circle-radius": 40,
            },
          });
        }

        // draw symbol
        function drawSymbol(nbmap) {
          nbmap.map.addSource("symbol-source", {
            type: "geojson",
            data: {
              type: "FeatureCollection",
              features: [
                {
                  type: "Feature",
                  geometry: {
                    type: "Point",
                    coordinates: [-118.24501946, 34.05507342],
                  },
                },
              ],
            },
          });
          // you can get more information about setting the style of layers here. https://maplibre.org/maplibre-gl-js-docs/style-spec/layers/#symbol
          nbmap.map.addLayer({
            id: "symbol-layer",
            type: "symbol",
            source: "symbol-source",
            layout: {
              "symbol-placement": "point",
              visibility: "visible",
              "symbol-spacing": 1,
              "icon-allow-overlap": true,
              "icon-image": "nb-logo",
              "icon-size": 0.16,
            },
          });
        }

        // You need to replace the apiKey with yours
        nextbillion.setApiKey("your-api-key");
        var nbmap = new nextbillion.maps.Map({
          container: document.getElementById("map"),
          style: "https://api.nextbillion.io/maps/streets/style.json",
          zoom: 15,
          center: { lat: 34.05649731, lng: -118.24455192 },
        });

        nbmap.on("load", () => {
          drawPolyline(nbmap);
          drawPolygon(nbmap);
          drawCircle(nbmap);
          // load image so we can use it in the symbol layer
          nbmap.map.loadImage(
            "https://static.nextbillion.io/docs-next/nbai-logo-white.png",
            (err, image) => {
              if (err) {
                console.error("err image", err);
                return;
              }
              nbmap.map.addImage("nb-logo", image);
              drawSymbol(nbmap);
            },
          );
        });
      })();
    </script>
  </body>
</html>
```

### React

You can find the live Demo on CodeSandbox [here](https://codesandbox.io/p/sandbox/unruffled-cache-gvpy6k?file=/src/pages/ShapeAndSymbol.js).

```javascript
import React, { useEffect } from "react";
import "@nbai/nbmap-gl/dist/nextbillion.css";
import nextbillion, { NBMap } from "@nbai/nbmap-gl";

// draw a polyline
function drawPolyline(nbmap) {
  nbmap.map.addSource("polyline-source", {
    type: "geojson",
    data: {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: {
            color: "#e74747", // red clolor
          },
          geometry: {
            type: "LineString",
            coordinates: [
              [-118.24648, 34.05815],
              [-118.24556, 34.05739],
              [-118.2445, 34.0565],
              [-118.24397, 34.05605],
              [-118.24359, 34.05573],
              [-118.24372, 34.05559],
              [-118.24385, 34.05544],
              [-118.24427, 34.05501],
              [-118.24509, 34.05412],
              [-118.24555, 34.05361],
            ],
          },
        },
        {
          type: "Feature",
          properties: {
            color: "#93a1ff", // blue clolor
          },
          geometry: {
            type: "LineString",
            coordinates: [
              [-118.24648, 34.05815],
              [-118.24748, 34.05725],
              [-118.24763, 34.05712],
              [-118.24797, 34.05678],
              [-118.24823, 34.05641],
              [-118.24836, 34.05623],
              [-118.24874572, 34.05567155],
              [-118.24637, 34.05417],
              [-118.24571, 34.05376],
              [-118.24553, 34.05363],
              [-118.24555, 34.05361],
            ],
          },
        },
      ],
    },
  });

  // you can get more information about setting the style of lines here. https://maplibre.org/maplibre-gl-js-docs/style-spec/layers/#line
  nbmap.map.addLayer({
    id: "polyline-layer",
    type: "line",
    source: "polyline-source",
    paint: {
      "line-width": 3,
      // get color from the source
      "line-color": ["get", "color"],
    },
  });
}

// draw a polygon
function drawPolygon(nbmap) {
  nbmap.map.addSource("polygon-source", {
    type: "geojson",
    data: {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [-118.24455192, 34.05649731],
                [-118.24646327, 34.05811205],
                [-118.24751855, 34.05716641],
                [-118.2479062, 34.05678279],
                [-118.24834231, 34.05621183],
                [-118.24870843, 34.05567655],
                [-118.24661649, 34.05436717],
                [-118.24455192, 34.05649731],
              ],
            ],
          },
        },
      ],
    },
  });

  // you can get more information about setting the style of layers here. https://maplibre.org/maplibre-gl-js-docs/style-spec/layers/
  nbmap.map.addLayer({
    id: "polygon-layer",
    type: "fill",
    source: "polygon-source",
    paint: {
      // fill with green color and a opacity of 0.6
      "fill-color": "#469300",
      "fill-opacity": 0.6,
    },
  });
}

// draw a circle
function drawCircle(nbmap) {
  nbmap.map.addSource("circle-source", {
    type: "geojson",
    data: {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [-118.24501946, 34.05507342],
          },
        },
      ],
    },
  });
  // you can get more information about setting the style of layers here. https://maplibre.org/maplibre-gl-js-docs/style-spec/layers/#circle
  nbmap.map.addLayer({
    id: "circle-layer",
    type: "circle",
    source: "circle-source",
    paint: {
      "circle-color": "#8d5a9e",
      "circle-radius": 40,
    },
  });
}

// draw symbol
function drawSymbol(nbmap) {
  nbmap.map.addSource("symbol-source", {
    type: "geojson",
    data: {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [-118.24501946, 34.05507342],
          },
        },
      ],
    },
  });
  // you can get more information about setting the style of layers here. https://maplibre.org/maplibre-gl-js-docs/style-spec/layers/#symbol
  nbmap.map.addLayer({
    id: "symbol-layer",
    type: "symbol",
    source: "symbol-source",
    layout: {
      "symbol-placement": "point",
      visibility: "visible",
      "symbol-spacing": 1,
      "icon-allow-overlap": true,
      "icon-image": "nb-logo",
      "icon-size": 0.16,
    },
  });
}

const DrawDemo = () => {
  useEffect(() => {
    nextbillion.setApiKey("your-api-key");
    const nbmap = new NBMap({
      container: "map",
      style: "https://api.nextbillion.io/maps/streets/style.json",
      zoom: 15,
      center: { lat: 34.05649731, lng: -118.24455192 },
    });

    nbmap.on("load", () => {
      drawPolyline(nbmap);
      drawPolygon(nbmap);
      drawCircle(nbmap);
      // load image so we can use it in the symbol layer
      nbmap.map.loadImage(
        "https://static.nextbillion.io/docs-next/nbai-logo-white.png",
        (err, image) => {
          if (err) {
            console.error("err image", err);
            return;
          }
          nbmap.map.addImage("nb-logo", image);
          drawSymbol(nbmap);
        },
      );
    });
  }, []);

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
export default DrawDemo;
```

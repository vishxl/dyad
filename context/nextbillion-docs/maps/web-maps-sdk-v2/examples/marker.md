# Marker

Add markers to the map.

## Demo

<iframe style="border:none;width:100%;height:400px" src="https://fjgq7.csb.app/v2/marker.html"></iframe>

### Plain HTML

You can find the live Demo on CodeSandbox [here](https://codesandbox.io/s/fjgq7?file=/v2/marker.html).

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
        function addSimpleMarker(nbmap) {
          const popup = new nextbillion.maps.Popup({
            offset: 25,
            closeButton: false,
          }).setText("Simple Marker");
          const marker = new nextbillion.maps.Marker()
            .setLngLat({ lat: 34.08572, lng: -118.124569 })
            .setPopup(popup)
            .addTo(nbmap.map);
          marker.togglePopup();
        }

        function addDraggableMarker(nbmap) {
          const popup = new nextbillion.maps.Popup({
            offset: 25,
            closeButton: false,
          }).setText("Draggable Marker");
          const marker = new nextbillion.maps.Marker({
            draggable: true,
          })
            .setLngLat({ lat: 34.08572, lng: -118.224569 })
            .setPopup(popup)
            .addTo(nbmap.map);
          marker.togglePopup();
          marker.on("dragend", () => {
            console.log(marker.getLngLat());
          });
        }

        function addCustomMarkerWithDom(nbmap) {
          const popup = new nextbillion.maps.Popup({
            offset: 10,
            closeButton: false,
          }).setText("Custom Marker");
          const el = document.createElement("div");
          el.className = "marker";
          el.style.backgroundImage =
            "url(https://static.nextbillion.io/docs-next/navigation-arrow-icon.png)";
          el.style.backgroundSize = "cover";
          el.style.width = "36px";
          el.style.height = "36px";
          const marker = new nextbillion.maps.Marker({
            element: el,
          })
            .setLngLat({ lat: 34.08572, lng: -118.024569 })
            .setPopup(popup)
            .addTo(nbmap.map);

          marker.togglePopup();
        }
        // You need to replace the apiKey with yours
        nextbillion.setApiKey("your-api-key");
        var nbmap = new nextbillion.maps.Map({
          container: document.getElementById("map"),
          style: "https://api.nextbillion.io/maps/streets/style.json",
          zoom: 11,
          center: { lat: 34.08572, lng: -118.324569 },
        });

        nbmap.on("load", function () {
          addSimpleMarker(nbmap);
          addDraggableMarker(nbmap);
          addCustomMarkerWithDom(nbmap);
        });
      })();
    </script>
  </body>
</html>
```

### React

You can find the live Demo on CodeSandbox [here](https://codesandbox.io/p/sandbox/unruffled-cache-gvpy6k?file=/src/pages/Marker.js).

```javascript
import React, { useEffect } from "react";
import "@nbai/nbmap-gl/dist/nextbillion.css";
import nextbillion, { NBMap, Marker, Popup } from "@nbai/nbmap-gl";

function addSimpleMarker(nbmap) {
  const popup = new Popup({ offset: 25, closeButton: false }).setText(
    "Simple Marker",
  );
  const marker = new Marker()
    .setLngLat({ lat: 34.08572, lng: -118.124569 })
    .setPopup(popup)
    .addTo(nbmap.map);
  marker.togglePopup();
}

function addDraggableMarker(nbmap) {
  const popup = new Popup({ offset: 25, closeButton: false }).setText(
    "Draggable Marker",
  );
  const marker = new Marker({
    draggable: true,
  })
    .setLngLat({ lat: 34.08572, lng: -118.224569 })
    .setPopup(popup)
    .addTo(nbmap.map);
  marker.togglePopup();
  marker.on("dragend", () => {
    console.log(marker.getLngLat());
  });
}

function addCustomMarkerWithDom(nbmap) {
  const popup = new Popup({ offset: 10, closeButton: false }).setText(
    "Custom Marker",
  );
  const el = document.createElement("div");
  el.className = "marker";
  el.style.backgroundImage =
    "url(https://static.nextbillion.io/docs-next/navigation-arrow-icon.png)";
  el.style.backgroundSize = "cover";
  el.style.width = "36px";
  el.style.height = "36px";
  const marker = new Marker({
    element: el,
  })
    .setLngLat({ lat: 34.08572, lng: -118.024569 })
    .setPopup(popup)
    .addTo(nbmap.map);

  marker.togglePopup();
}

const MarkerDemo = () => {
  useEffect(() => {
    // Add your apiKey
    nextbillion.setApiKey("your-api-key");
    const nbmap = new NBMap({
      container: "map",
      style: "https://api.nextbillion.io/maps/streets/style.json",
      zoom: 11,
      center: { lat: 34.08572, lng: -118.124569 },
    });
    addSimpleMarker(nbmap);
    addDraggableMarker(nbmap);
    addCustomMarkerWithDom(nbmap);
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
export default MarkerDemo;
```

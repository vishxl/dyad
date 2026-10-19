# Popup

Add popups to the map.

## Demo

<iframe style="border:none;width:100%;height:400px" src="https://fjgq7.csb.app/v2/popup.html"></iframe>

## Examples

### Plain HTML

You can find the live Demo on CodeSandbox [here](https://codesandbox.io/s/fjgq7?file=/v2/popup.html).

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
        nextbillion.setApiKey("your-api-key");
        var nbmap = new nextbillion.maps.Map({
          container: document.getElementById("map"),
          style: "https://api.nextbillion.io/maps/streets/style.json",
          zoom: 11,
          center: { lat: 34.08572, lng: -118.324569 },
        });

        nbmap.on("load", function () {
          // add a popup
          const popupOffsets = {
            top: [0, 0],
            "top-left": [0, 0],
          };
          new nextbillion.maps.Popup({
            offset: popupOffsets,
            className: "my-class",
          })
            .setLngLat({ lat: 34.08572, lng: -118.324569 })
            .setHTML("<h1>Hello World!</h1>")
            .setMaxWidth("300px")
            .addTo(nbmap.map);
        });
      })();
    </script>
  </body>
</html>
```

### React

You can find the live Demo on CodeSandbox [here](https://codesandbox.io/p/sandbox/unruffled-cache-gvpy6k?file=/src/pages/Popup.js).

```javascript
import React, { useEffect } from "react";
import "@nbai/nbmap-gl/dist/nextbillion.css";
import nextbillion, { NBMap, Popup } from "@nbai/nbmap-gl";

const PopupDemo = () => {
  useEffect(() => {
    // You need to replace the apiKey with yours
    nextbillion.setApiKey("your-api-key");
    const nbmap = new NBMap({
      container: "map",
      style: "https://api.nextbillion.io/maps/streets/style.json",
      zoom: 11,
      center: { lat: 34.08572, lng: -118.324569 },
    });
    const popupOffsets = {
      top: [0, 0],
      "top-left": [0, 0],
    };
    // add a popup
    new Popup({
      offset: popupOffsets,
      className: "my-class",
    })
      .setLngLat({ lat: 34.08572, lng: -118.324569 })
      .setHTML("<h1>Hello World!</h1>")
      .setMaxWidth("300px")
      .addTo(nbmap.map);
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
export default PopupDemo;
```

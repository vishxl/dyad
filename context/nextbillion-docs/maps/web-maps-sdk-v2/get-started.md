# Get Started

## Introduction

The NextBillion.ai Maps provides a JavaScript library to render interactive maps that display raster or vector tiles, markers, static and dynamic graphic elements for your mapping and visualization needs. It is part of NextBillion.ai Maps platform, which provides hyper local geospatial AI in our mapping eco-system, including Routing and ETAs, Location Management, Map Production and Maintenance, and much more..

## Hello, World

Below is a basic map generated with NextBillion.ai Maps. It positions at Los Angeles. Try dragging and scrolling on it!

<iframe style="border:none;width:100%;height:280px" src="https://fjgq7.csb.app/v2/init-map.html"></iframe>

## Installation

### From CDN

You can use NextBillion.ai Maps SDK's features with our CDN. If the visitor to your web site has already downloaded NextBillion.ai Maps, it won't have to be re-downloaded.

Please note, you'll have to use your API key to run the code below

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
        // To use NextBillion Maps GL, an apiKey is required.
        nextbillion.setApiKey("your-api-key");
        var map = new nextbillion.maps.Map({
          container: document.getElementById("map"),
          style: "https://api.nextbillion.io/maps/streets/style.json",
          zoom: 12,
          center: { lat: 34.08572, lng: -118.324569 },
        });
      })();
    </script>
  </body>
</html>
```

### From NPM

NextBillion.ai Maps is also available as an NPM package. You can install it with the `npm` command:

```bash
npm install @nbai/nbmap-gl
```

Or if you prefer the `yarn` command:

```bash
yarn add @nbai/nbmap-gl
```

This will install NextBillion.ai Maps to the `node_modules` folder. You will find all released `JavaScript`, `map` and `CSS` files in `node_modules/@nbai/nbmap-gl/dist`.

In your project, taking a React.js one created with `create-react-app` for example, you can use NextBillion.ai Maps like this(replace your-api-key with your own API key):

```jsx
import React, { useEffect } from "react";
import nextbillion, { NBMap } from "@nbai/nbmap-gl";
// import the css of the map
import "@nbai/nbmap-gl/dist/nextbillion.css";
import "./App.css";

// set your nextbillion api key
nextbillion.setApiKey("your-api-key");

function App() {
  useEffect(() => {
    new NBMap({
      container: "map",
      zoom: 12,
      style: "https://api.nextbillion.io/maps/streets/style.json",
      center: { lat: 34.08572, lng: -118.324569 },
    });
  }, []);
  return (
    <div
      id="map"
      style={{
        width: "100%",
        height: "100%",
        position: "fixed",
        top: "0",
        left: "0",
      }}
    ></div>
  );
}

export default App;
```

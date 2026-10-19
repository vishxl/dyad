# Support Right To Left Text

Use the mapbox-gl-rtl-text plugin to support right-to-left languages such as Arabic and Hebrew.

By setting the `lazy` parameter to `true`, the plugin is only loaded when the map first encounters Hebrew or Arabic text.

## Demo

<iframe style="border:none;width:100%;height:400px" src="https://fjgq7.csb.app/v2/support-right-to-left-text.html"></iframe>

### Plain HTML

You can find the live Demo on CodeSandbox [here](https://codesandbox.io/s/fjgq7?file=/v2/support-right-to-left-text.html).

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Add support for right-to-left scripts</title>
    <meta
      name="viewport"
      content="initial-scale=1,maximum-scale=1,user-scalable=no"
    />
    <script src="https://maps-gl.nextbillion.io/maps/v2/api/js"></script>
    <link
      href="https://maps-gl.nextbillion.io/maps/v2/api/css"
      rel="stylesheet"
    />
    <style>
      body {
        margin: 0;
        padding: 0;
      }
      #map {
        position: absolute;
        top: 0;
        bottom: 0;
        width: 100%;
      }
    </style>
  </head>
  <body>
    <div id="map"></div>

    <script>
      nextbillion.maps.setRTLTextPlugin(
        "https://unpkg.com/@mapbox/mapbox-gl-rtl-text@0.2.3/mapbox-gl-rtl-text.min.js",
        null,
        true, // Lazy load the plugin
      );
      // You need to replace the apiKey with yours
      nextbillion.setApiKey("your-api-key");
      var nbmap = new nextbillion.maps.Map({
        container: document.getElementById("map"),
        style: "https://api.nextbillion.io/maps/default/style.json",
        zoom: 11,
        center: [44.3763, 33.2788],
      });
    </script>
  </body>
</html>
```

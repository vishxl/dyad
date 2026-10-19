# 3D Model

The example shows you how to render a 3D model to the map.

## Demo

<iframe style="border:none;width:100%;height:400px" src="https://fjgq7.csb.app/v2/3d-model.html"></iframe>

### Plain HTML

You can find the live Demo on CodeSandbox [here](https://codesandbox.io/s/fjgq7?file=/v2/3d-model.html).

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
    <script src="https://unpkg.com/three@0.106.2/build/three.min.js"></script>
    <script src="https://unpkg.com/three@0.106.2/examples/js/loaders/GLTFLoader.js"></script>
    <script src="https://maps-gl.nextbillion.io/maps/v2/api/js"></script>
    <script>
      // You need to replace the apiKey with yours
      nextbillion.setApiKey("your-api-key");
      var nbmap = new nextbillion.maps.Map({
        container: document.getElementById("map"),
        style: "https://api.nextbillion.io/maps/streets/style.json",
        zoom: 20,
        pitch: 52,
        center: { lat: 34.08572, lng: -118.324569 },
      });

      // parameters to ensure the model is georeferenced correctly on the map
      var modelOrigin = [-118.324424, 34.08572];
      var modelAltitude = 0;
      var modelRotate = [Math.PI / 2, 0, 0];

      var modelAsMercatorCoordinate =
        nextbillion.maps.MercatorCoordinate.fromLngLat(
          modelOrigin,
          modelAltitude,
        );

      // transformation parameters to position, rotate and scale the 3D model onto the map
      var modelTransform = {
        translateX: modelAsMercatorCoordinate.x,
        translateY: modelAsMercatorCoordinate.y,
        translateZ: modelAsMercatorCoordinate.z,
        rotateX: modelRotate[0],
        rotateY: modelRotate[1],
        rotateZ: modelRotate[2],
        /* Since our 3D model is in real world meters, a scale transform needs to be
         * applied since the CustomLayerInterface expects units in MercatorCoordinates.
         */
        scale: modelAsMercatorCoordinate.meterInMercatorCoordinateUnits(),
      };

      var THREE = window.THREE;

      // configuration of the custom layer for a 3D model per the CustomLayerInterface
      var customLayer = {
        id: "3d-model",
        type: "custom",
        renderingMode: "3d",
        onAdd: function (map, gl) {
          this.camera = new THREE.Camera();
          this.scene = new THREE.Scene();

          // create two three.js lights to illuminate the model
          var directionalLight = new THREE.DirectionalLight(0xffffff);
          directionalLight.position.set(0, -70, 100).normalize();
          this.scene.add(directionalLight);

          var directionalLight2 = new THREE.DirectionalLight(0xffffff);
          directionalLight2.position.set(0, 70, 100).normalize();
          this.scene.add(directionalLight2);

          // use the three.js GLTF loader to add the 3D model to the three.js scene
          var loader = new THREE.GLTFLoader();
          loader.load(
            "https://static.nextbillion.io/docs-next/3d-model-demo.gltf",
            function (gltf) {
              this.scene.add(gltf.scene);
            }.bind(this),
          );
          this.map = map;

          // use the MapLibre GL JS map canvas for three.js
          this.renderer = new THREE.WebGLRenderer({
            canvas: map.getCanvas(),
            context: gl,
            antialias: true,
          });

          this.renderer.autoClear = false;
        },
        render: function (gl, matrix) {
          var rotationX = new THREE.Matrix4().makeRotationAxis(
            new THREE.Vector3(1, 0, 0),
            modelTransform.rotateX,
          );
          var rotationY = new THREE.Matrix4().makeRotationAxis(
            new THREE.Vector3(0, 1, 0),
            modelTransform.rotateY,
          );
          var rotationZ = new THREE.Matrix4().makeRotationAxis(
            new THREE.Vector3(0, 0, 1),
            modelTransform.rotateZ,
          );

          var m = new THREE.Matrix4().fromArray(matrix);
          var l = new THREE.Matrix4()
            .makeTranslation(
              modelTransform.translateX,
              modelTransform.translateY,
              modelTransform.translateZ,
            )
            .scale(
              new THREE.Vector3(
                modelTransform.scale,
                -modelTransform.scale,
                modelTransform.scale,
              ),
            )
            .multiply(rotationX)
            .multiply(rotationY)
            .multiply(rotationZ);

          this.camera.projectionMatrix = m.multiply(l);
          this.renderer.state.reset();
          this.renderer.render(this.scene, this.camera);
          this.map.triggerRepaint();
        },
      };

      nbmap.on("style.load", function () {
        nbmap.map.addLayer(customLayer);
      });
    </script>
  </body>
</html>
```

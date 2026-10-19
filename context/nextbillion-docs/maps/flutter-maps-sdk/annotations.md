# Annotations

Annotations play a crucial role in enhancing the functionality and visual representation of your map-based SDK. They are elements like markers, lines, circles, and polygons that can be placed on the map to indicate specific locations, routes, or areas of interest.

To begin interacting with these annotations and control their behavior, you must first obtain the map controller. This controller acts as the gateway for managing and manipulating annotations on the map.

To operate the mapview, you need to get the map controller in the `onMapReady(NextBillionMapController controller)` callback.

By leveraging the `onMapReady` callback, you can access the **NextBillionMapController** instance, which grants you the authority to add, remove, and modify various annotations based on user interactions or programmatic requirements.

## Symbol Annotation

The Symbol annotation adds a symbol to the map. It is configured by the specified custom SymbolOptions. If you need to add an image symbol, you need to add the image source to the map style.

### Add image source

```dart
final ByteData bytes = await rootBundle.load("assets/image.png");
final Uint8List list = bytes.buffer.asUint8List();
await controller?.addImage("ic_marker", list);
```

The _addImage()_ function allows you to include custom images as map annotations (symbols) on the Flutter map. The image data is loaded from the **assets** directory and identified by a unique key, such as `ic_marker`. The _addImage()_ method is asynchronous, ensuring that the image is added before proceeding.

```dart
var symbol = controller.addSymbol(
      SymbolOptions(
          geometry: LatLng(-33.894372606072309, 151.17576679759523),
          iconImage: "ic_marker",
          iconSize: 2),
    );

//remove annotation
controller!.removeSymbol(symbol);

//update annotation
controller!.updateSymbol(symbol, updatedOptions)
```

The _addSymbol()_ function enables you to add a new annotation (symbol) to the map at a specified location with custom icon properties. The _addSymbol()_ method requires _SymbolOptions_ as its argument, containing information such as the `geometry` (latitude and longitude) and the `iconImage` (the previously added image key, e.g., `ic_marker`). Additionally, the `iconSize` property can be set to scale the icon size.

The _removeSymbol()_ function removes an existing annotation (symbol) from the map. It requires the symbol variable as its argument, representing the specific annotation to be removed. Ensure that the controller is initialized before calling this method to prevent runtime errors.

The _updateSymbol()_ function allows you to modify the properties of an existing annotation (symbol) on the map. The symbol variable must be provided as the first argument, representing the specific annotation to be updated. The `updatedOptions` variable contains the new options for the annotation, which could include changes to the _geometry_, _iconImage_, _iconSize_, or any other properties associated with the annotation. Ensure that the controller is initialized before calling this method to avoid runtime errors.

## Line Annotation

The Line Annotation lets you draw a line on the map, making it easy to mark paths or routes. You can customize the appearance of the line using the specified _LineOptions_.

```dart
var line = controller.addLine(
      LineOptions(
        geometry: [
          LatLng(-33.874867744475786, 151.170627211986584),
          LatLng(-33.881979408447314, 151.171361438502117),
          LatLng(-33.887058805548882, 151.175032571079726),
        ],
        lineColor: "#0000FF",
        lineWidth: 20,
      ),
    );
```

The Line Annotation enables you to create lines on the map by specifying a sequence of geographic coordinates as geometry. These coordinates represent the start and end points of the line. Additionally, you can add intermediate points to create complex paths. The appearance of the line can be customized with the following options:

- **lineColor:** Sets the color of the line. You can use standard color names or hexadecimal color codes.

- **lineWidth**: Determines the width of the line in dp (device-independent pixels).

To manage the Line Annotation on the map, you have the following options:

#### Remove Annotation:

```dart
controller!.removeLine(line);
```

If you wish to remove a previously added line from the map, use the _removeLine()_ function. Provide the line variable (representing the line to be removed) as the argument.

#### Update Annotation:

```dart
controller!.updateLine(line, updatedOptions)
```

If you want to modify the appearance or other properties of an existing line, use the _updateLine()_ function. The line variable should be the line you want to update, and `updatedOptions` should contain the new options you wish to apply to the line. This could include changes to the _geometry_, _lineColor_, _lineWidth_, or other properties associated with the line. Make sure to initialize the controller before using these functions to avoid any potential issues.

With these methods, you can easily create, manage, and customize lines on the map to suit your application's needs.

## Fill Annotation

The Fill Annotation allows you to create filled areas on the map, making it simple to highlight regions or boundaries. You can easily customize the appearance of the fill using the specified _FillOptions_.

```dart
var fill = controller!.addFill(
      FillOptions(
        geometry: [
          [
            LatLng(-33.901517742631846, 151.178099204457737),
            LatLng(-33.872845324482071, 151.179025547977773),
            LatLng(-33.868230472039514, 151.147000529140399),
            LatLng(-33.883172899638311, 151.150838238009328),
            LatLng(-33.901517742631846, 151.178099204457737),
          ],
        ],
        fillColor: "#FF0000",
        fillOutlineColor: "#000000",
      ),
    );
```

The Fill Annotation enables you to create filled regions on the map by specifying a list of geographic coordinates as geometry. These coordinates represent the boundary points of the filled area. You need to provide the coordinates in a list, and the last point should be the same as the first to close the region.

The appearance of the fill can be customized with the following options:

- **fillColor**: Sets the color to fill the area. You can use standard color names or hexadecimal color codes.

- **fillOutlineColor**: Determines the color of the outline surrounding the filled area.

#### Remove Annotation:

```dart
controller!.removeFill(fill);
```

If you want to remove a previously added fill from the map, use the _removeFill()_ function. Provide the fill variable (representing the fill to be removed) as the argument.

#### Update Annotation:

```dart
controller!.updateFill(fill, updatedOptions);
```

If you wish to modify the appearance or other properties of an existing fill, use the _updateFill()_ function. The fill variable should be the fill you want to update, and `updatedOptions` should contain the new options you wish to apply to the fill. This could include changes to the _geometry_, _fillColor_, _fillOutlineColor_, or other properties associated with the fill. Remember to initialize the controller before using these functions to ensure smooth functioning.

With these simple and intuitive methods, you can effortlessly create, manage, and customize filled regions on the map, making your map-based applications more informative and visually appealing.

## Circle Annotation

The Circle Annotation lets you display circles on the map, allowing you to highlight specific locations or areas with ease. You can customize the circle's appearance using the provided _CircleOptions_.

```dart
var addCircle = controller!.addCircle(
      CircleOptions(
        geometry: LatLng(-33.894372606072309, 151.17576679759523),
        circleStrokeColor: "#00FF00",
        circleStrokeWidth: 2,
        circleRadius: 30,
      ),
    );
```

With the Circle Annotation, you can place circles on the map by specifying a single geographic coordinate as geometry. This coordinate represents the center of the circle. You can further adjust the circle's appearance with the following options:

- _circleStrokeColor_: Sets the color of the circle's outline. You can use standard color names or hexadecimal color codes to choose the desired color.

- _circleStrokeWidth_: Determines the width of the circle's outline in dp (device-independent pixels).

- _circleRadius_: Sets the radius of the circle in dp (device-independent pixels), determining its size on the map.

By using these customizable options, you can easily add circles to the map and tailor their appearance to suit your application's requirements.

## Annotation onTap Callbacks

To handle tap events on annotations (such as _fills_, _circles_, _lines_, and _symbols_) in your map, you can easily set up callbacks. These callbacks allow you to respond to user interactions, making your map more interactive and user-friendly. Below is a code snippet demonstrating how to add these callbacks to your map and ensure they are properly removed when disposing of the map.

```dart
void _onMapCreated(NextBillionMapController controller) {
  // Store the map controller for later use
  this.controller = controller;

  // Add callbacks for different annotation types
  controller.onFillTapped.add(_onFillTapped);
  controller.onCircleTapped.add(_onCircleTapped);
  controller.onLineTapped.add(_onLineTapped);
  controller.onSymbolTapped.add(_onSymbolTapped);
}

// Callback function for Fill annotations
void _onFillTapped(Fill fill) {
  // Respond to the tap event on the Fill annotation here
  // For example, show additional information or navigate to a new screen
}

// Callback function for Circle annotations
void _onCircleTapped(Circle circle) {
  // Handle the tap event on the Circle annotation here
  // For instance, display a popup or perform some specific action
}

// Callback function for Line annotations
void _onLineTapped(Line line) {
  // Deal with the tap event on the Line annotation here
  // You can implement actions such as showing details or performing operations
}

// Callback function for Symbol annotations
void _onSymbolTapped(Symbol symbol) {
  // Process the tap event on the Symbol annotation here
  // You might want to display relevant information or execute a particular task
}

// Dispose method to remove the callbacks when the map is no longer needed
@override
void dispose() {
  // Remove the callbacks to avoid memory leaks
  controller.onFillTapped.remove(_onFillTapped);
  controller.onCircleTapped.remove(_onCircleTapped);
  controller.onLineTapped.remove(_onLineTapped);
  controller.onSymbolTapped.remove(_onSymbolTapped);

  // Call the super dispose method
  super.dispose();
}
```

The code snippet above demonstrates how to set up callbacks to handle tap events on different types of annotations in your map. When the map is created, you add the corresponding callbacks for _fill (onFillTapped)_, _circle (onCircleTapped)_, _line (onLineTapped)_, and _symbol (onSymbolTapped)_ annotations.

Each callback function, such as `_onFillTapped`, `_onCircleTapped`, `_onLineTapped`, and `_onSymbolTapped`, will be executed when the user taps on the respective annotation type. Inside these callback functions, you can implement the desired behavior, such as displaying additional information, navigating to new screens, showing popups, or performing specific actions based on the tapped annotation.

To prevent memory leaks, it's essential to remove these callbacks when the map is no longer in use. The _dispose()_ method serves this purpose by removing all the registered callbacks using the _remove()_ function.

By following this approach, you can easily handle tap events on different annotation types and create a more interactive and engaging map experience for your users.

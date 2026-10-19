# Add Custom Style

This example shows how to add customize style layer.

- Query features in Rect

- Add a list of features layer into map style

- Add Multi Shape Layers source
  - Circle style layer

  - Line style layer

  - Fill style layer

![documentation image](https://static.nextbillion.io/docs-next/docs/maps/ios/add-custom-style-layers.webp)

For all code examples, refer to [Maps Code Examples](https://github.com/nextbillion-ai/ios-map-example)

**AddMapStyleLayerViewController** [view source](https://github.com/nextbillion-ai/ios-map-example/blob/main/ios-map-example/AddMapStyleLayerViewController.swift)

```swift
//
//  AddMapStyleLayerViewController.swift
//  maps-ios-demo
//
import Foundation
import UIKit
import Nbmap
enum AddActionType{
    case AddQueryFeaturesLayer
    case AddMultiShapeLayers
    case UpdateMultiShapeLayers
}
class AddMapStyleLayerViewController: UIViewController {

    var nbMapView: NGLMapView! {
        didSet {
            oldValue?.removeFromSuperview()
            if let mapView = nbMapView {
                view.insertSubview(mapView, at: 0)
                mapView.delegate = self
            }
        }
    }
    var button: UIButton!

    let typeList = [
        AddActionType.AddQueryFeaturesLayer,
        AddActionType.AddMultiShapeLayers,
        AddActionType.UpdateMultiShapeLayers,
    ]


    var points : Array = [CLLocationCoordinate2D]()

    override func viewDidLoad() {
        super.viewDidLoad()
        nbMapView = NGLMapView(frame:self.view.bounds)
        button = UIButton(type: .system)
        button.setTitle("Settings", for: .normal)
        button.addTarget(self, action: #selector(showSetings), for: .touchUpInside)
        button.frame = CGRect(x: 0, y: 0, width: 100, height: 40)
        navigationItem.rightBarButtonItem = UIBarButtonItem(customView: button)
    }

    @objc func showSetings() {
        let tableViewController = UITableViewController(style: .plain)
        tableViewController.tableView.delegate = self
        tableViewController.tableView.dataSource = self
        tableViewController.title = "Camera Settings"
        self.present(tableViewController, animated: true)
    }

    func performeSettings(type: AddActionType) {
        switch type {
        case AddActionType.AddQueryFeaturesLayer :
            addQueryFeaturesLayer()
            break
        case AddActionType.AddMultiShapeLayers:
            addMultiShapeLayers()
            break
        case AddActionType.UpdateMultiShapeLayers:
            updateTheQueryFeaturesLayer()
            break
        }

    }

    func addQueryFeaturesLayer() {
        let queryRect = self.nbMapView.bounds.insetBy(dx: 100, dy: 200)
        let visibleFeatures = self.nbMapView.visibleFeatures(in: queryRect) as? [NGLShape & NGLFeature]

        let querySourceID = "query-source-id"
        let queryLayerID = "query-layer-id"

        if let layer = self.nbMapView.style?.layer(withIdentifier: queryLayerID) {
            self.nbMapView.style?.removeLayer(layer)
        }

        if let source = self.nbMapView.style?.source(withIdentifier: querySourceID) {
            self.nbMapView.style?.removeSource(source)
        }

        DispatchQueue.main.async {
            let shapeSource = NGLShapeSource(identifier: querySourceID, features: visibleFeatures!, options: nil)
            self.nbMapView.style?.addSource(shapeSource)

            let fillLayer = NGLFillStyleLayer(identifier: queryLayerID, source: shapeSource)
            fillLayer.fillColor = NSExpression(forConstantValue: UIColor.blue)
            fillLayer.fillOpacity = NSExpression(forConstantValue: 0.5)
            self.nbMapView.style?.addLayer(fillLayer)
        }

    }

    func updateTheQueryFeaturesLayer() {
        let querySourceID = "query-source-id"
        if let source = self.nbMapView.style?.source(withIdentifier: querySourceID) as? NGLShapeSource {
            let queryRect = self.nbMapView.bounds.insetBy(dx: 50, dy: 100)
            let visibleFeatures = self.nbMapView.visibleFeatures(in: queryRect) as? [NGLShape & NGLFeature]
            let shapeSource = NGLShapeSource(identifier: querySourceID, features: visibleFeatures!, options: nil)
            source.shape = shapeSource.shape
        }

    }

    func addMultiShapeLayers() {
        nbMapView.zoomLevel = 10
        nbMapView.centerCoordinate = CLLocationCoordinate2D(latitude: 51.068585180672635, longitude: -114.06074523925781)
        let leafCoords: [CLLocationCoordinate2D] = [
            CLLocationCoordinate2D(latitude: 50.9683733218221, longitude: -114.07035827636719),
            CLLocationCoordinate2D(latitude: 51.02325750523972, longitude: -114.06967163085938),
            CLLocationCoordinate2D(latitude: 51.009434536947786, longitude: -114.14245605468749),
            // ... Add the remaining coordinates here
        ]
        let feature = NGLPolygonFeature(coordinates: leafCoords, count: UInt(leafCoords.count))
        feature.identifier = "leaf-feature"
        feature.attributes = ["color": "red"]

        let source = NGLShapeSource(identifier: "leaf-source", shape: feature, options: nil)
        if nbMapView.style?.source(withIdentifier: "leaf-source") == nil {
            nbMapView.style?.addSource(source)
        }
        let layer = NGLFillStyleLayer(identifier: "leaf-fill-layer", source: source)
        if let shapeLayer = self.nbMapView.style?.layer(withIdentifier: "leaf-fill-layer") {
            self.nbMapView.style?.removeLayer(shapeLayer)
        }
        layer.predicate = NSPredicate(format: "color = 'red'")
        layer.fillColor = NSExpression(forConstantValue: UIColor.red)
        nbMapView.style?.addLayer(layer)
        let geoJSON = "{\"type\": \"Feature\", \"properties\": {\"color\": \"green\"}, \"geometry\": { \"type\": \"Point\", \"coordinates\": [ -114.06847000122069, 51.050459433092655 ] }}"
        let data = geoJSON.data(using: .utf8)!
        let shape = try? NGLShape(data: data, encoding: String.Encoding.utf8.rawValue)
        let pointSource = NGLShapeSource(identifier: "leaf-point-source", shape: shape, options: nil)
        if self.nbMapView.style?.source(withIdentifier: "leaf-point-source") == nil {
            nbMapView.style?.addSource(pointSource)
        }
        let circleLayer = NGLCircleStyleLayer(identifier: "leaf-circle-layer", source: pointSource)
        if let shapeLayer = self.nbMapView.style?.layer(withIdentifier: "leaf-circle-layer") {
            self.nbMapView.style?.removeLayer(shapeLayer)
        }
        circleLayer.circleColor = NSExpression(forConstantValue: UIColor.green)
        circleLayer.predicate = NSPredicate(format: "color = 'green'")
        circleLayer.circleRadius = NSExpression(forConstantValue: 10)
        nbMapView.style?.addLayer(circleLayer)
        let squareCoords: [CLLocationCoordinate2D] = [
            CLLocationCoordinate2D(latitude: 51.056070541830934, longitude: -114.0274429321289),
            CLLocationCoordinate2D(latitude: 51.07937094724242, longitude: -114.0274429321289),
            CLLocationCoordinate2D(latitude: 50.9683733218221, longitude: -114.07035827636719)
            // ... Add the remaining coordinates here
        ]
        let polygon = NGLPolyline(coordinates: squareCoords, count: UInt(squareCoords.count))
        let plainShapeSource = NGLShapeSource(identifier: "leaf-plain-shape-source", shape: polygon, options: nil)
        if self.nbMapView.style?.source(withIdentifier: "leaf-plain-shape-source") == nil {
            nbMapView.style?.addSource(plainShapeSource)
        }
        let plainLineLayer = NGLLineStyleLayer(identifier: "leaf-plain-fill-layer", source: plainShapeSource)
        if let shapeLayer = self.nbMapView.style?.layer(withIdentifier: "leaf-plain-fill-layer") {
            self.nbMapView.style?.removeLayer(shapeLayer)
        }
        plainLineLayer.lineColor = NSExpression(forConstantValue: UIColor.yellow)
        plainLineLayer.lineWidth = NSExpression(forConstantValue: 6)
        nbMapView.style?.addLayer(plainLineLayer)
    }

}
extension AddMapStyleLayerViewController: NGLMapViewDelegate {
    func mapView(_ mapView: NGLMapView, didFinishLoading style: NGLStyle){
        nbMapView.setCenter(CLLocationCoordinate2DMake(12.97880156, 77.59656748), zoomLevel: 13, animated: true)

    }
}
extension AddMapStyleLayerViewController: UITableViewDelegate, UITableViewDataSource {

    func settingsTitlesForRaw(index: Int) -> String {
        let type = typeList[index]
        switch type {
        case AddActionType.AddMultiShapeLayers :
            return "Add Multi Shape Layers"
        case AddActionType.AddQueryFeaturesLayer :
            return "Add Query Features Layer"
        case AddActionType.UpdateMultiShapeLayers :
            return "Update Query Features Layer"
        }
    }
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return typeList.count
    }

    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = UITableViewCell(style: .default, reuseIdentifier: nil)
        cell.textLabel?.text = settingsTitlesForRaw(index: indexPath.row)
        return cell
    }

    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        tableView.isHidden = true
        let type = typeList[indexPath.row]
        dismissSettings(type: type)
    }

    func dismissSettings(type: AddActionType) {
        dismiss(animated: true)
        performeSettings(type: type)
    }
}
```

This code example defines a view controller **(AddMapStyleLayerViewController)** that manages a map view (NGLMapView) and provides functionality to add different types of map style **layers**. It includes methods for adding query features **layers** and **multi-shape layers** to the map view. The code uses various classes and protocols from the Nbmap framework to handle map-related operations and display map features.

- Initializing the **mapView**:
  - The nbMapView property is declared as an **NGLMapView**.

  - In the **viewDidLoad()** method, the **nbMapView** is initialized with a frame equal to the bounds of the view.

  - The mapView is added as a subview to the view.

- Adding Query Features Layer:
  - A **query rectangle** is defined based on the bounds of the nbMapView.

  - Visible features within the query rectangle are retrieved using the **visibleFeatures(in:)** method. The existing query source and layer are removed from the nbMapView style, if they exist.

  - A new **NGLShapeSource** is created with the visible features and added to the style. And a **NGLFillStyleLayer** is created with the **NGLShapeSource** and customized properties such as fill color and opacity.

  - The fill layer is added to the style.

- Adding NGLPolygonFeature Layer:
  - An array of **CLLocationCoordinate2D** is created to define the leaf coordinates for a polygon feature.

  - A **NGLPolygonFeature** is created with the leaf coordinates and additional attributes.

  - A **NGLShapeSource** is created with the polygon feature and added to the style if it doesn't already exist. A **NGLFillStyleLayer** is created with the shape source, and properties such as fill color and predicate.

  - The fill layer is added to the style.

- Adding GeoJson Source Layer
  - A **GeoJSON** string is defined to create a point feature, and a NGLShape is created from the GeoJSON data.

  - A **NGLShapeSource** is created with the shape and added to the style if it doesn't already exist.

  - A **NGLCircleStyleLayer** is created with the point source, and properties such as circle color and predicate.

  - The circle layer is added to the style.

- Adding NGLPolyline feature layer
  - An array of **CLLocationCoordinate2D** is created to define the square coordinates for a polyline.

  - A **NGLPolyline** is created with the square coordinates.

  - A **NGLShapeSource** is created with the polyline and added to the style if it doesn't already exist.

  - A **NGLLineStyleLayer** is created with the plain shape source, and properties such as line color and width.

  - The line layer is added to the style.

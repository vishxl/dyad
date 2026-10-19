# Custom Runtime Style Layer

This example shows how to customize runtime map style layer.

- Custom building-3d layer style with zoom level

- Add building layer in Runtime style

- Custom water layer style with zoom level

- Custom roads layer with zoom level

![documentation image](https://static.nextbillion.io/docs-next/docs/maps/ios/custom-runtime-style-layer.webp)

For all code examples, refer to [Maps Code Examples](https://github.com/nextbillion-ai/ios-map-example)

**StyleMapLayerViewController** [view source](https://github.com/nextbillion-ai/ios-map-example/blob/main/ios-map-example/StyleMapLayerViewController.swift)

```swift
//
//  StyleMapLayerViewController.swift
//  maps-ios-demo
//
import Foundation
import UIKit
import Nbmap
enum ActionType{
    case StyleBuildingExtrusions
    case StyleWaterWithFunction
    case StyleRoadsWithFunction
    case AddBuildingExtrusions
}
class StyleMapLayerViewController: UIViewController {

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
        ActionType.StyleBuildingExtrusions,
        ActionType.AddBuildingExtrusions,
        ActionType.StyleWaterWithFunction,
        ActionType.StyleRoadsWithFunction,
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

    func performeSettings(type: ActionType) {
        switch type {
        case ActionType.StyleBuildingExtrusions :
            styleBuildingExtrusions()
            break
        case ActionType.StyleWaterWithFunction :
            styleWaterWithFunction()
            break
        case .StyleRoadsWithFunction:
            styleRoadsWithFunction()
            break
        case .AddBuildingExtrusions:
            addBuildingExtrusions()
            break
        }

    }

    func styleBuildingExtrusions() {
        let layer = self.nbMapView.style?.layer(withIdentifier: "building-3d") as? NGLFillExtrusionStyleLayer
        // Set the fill color to that of the existing building footprint layer, if it exists.
        layer?.fillExtrusionColor = NSExpression(forConstantValue: UIColor.purple)
        layer?.fillExtrusionOpacity = NSExpression(forConstantValue: 0.55)


        nbMapView.setCenter(CLLocationCoordinate2DMake(12.98780156, 77.59956748), zoomLevel: 18, animated: true)
    }

    func addBuildingExtrusions() {
        let source = self.nbMapView.style?.source(withIdentifier: "openmaptiles")
        if let source = source, self.nbMapView.style?.layer(withIdentifier: "extrudedBuildings") == nil {
            let layer = NGLFillExtrusionStyleLayer(identifier: "extrudedBuildings", source: source)
            layer.sourceLayerIdentifier = "building"
            layer.fillExtrusionBase = NSExpression(forConstantValue: 20)
            layer.fillExtrusionHeight = NSExpression(forConstantValue: 50)
            // Set the fill color to that of the existing building footprint layer, if it exists.
            layer.fillExtrusionColor = NSExpression(forConstantValue: UIColor.red)
            layer.fillExtrusionOpacity = NSExpression(forConstantValue: 0.75)
            self.nbMapView.style?.addLayer(layer)


        }
        let camera = NGLMapCamera(lookingAtCenter: CLLocationCoordinate2DMake(12.98780156, 77.59956748),
                                  acrossDistance:600,
                                  pitch:50,
                                  heading:0)
        nbMapView.fly(to: camera, withDuration: 2)
    }


    func styleWaterWithFunction() {

        let waterLayer = self.nbMapView.style?.layer(withIdentifier: "water") as? NGLFillStyleLayer
        let waterColorStops: [NSNumber: UIColor] = [
            6.0: UIColor.yellow,
            8.0: UIColor.blue,
            10.0: UIColor.red,
            12.0: UIColor.green,
            14.0: UIColor.blue
        ]
        let fillColorExpression = NSExpression(format: "ngl_interpolate:withCurveType:parameters:stops:($zoomLevel, 'linear', nil, %@)", waterColorStops)

        waterLayer?.fillColor = fillColorExpression

        let fillAntialiasedStops: [NSNumber: Any] = [
            11: true,
            12: false,
            13: true,
            14: false,
            15: true
        ]
        waterLayer?.fillAntialiased = NSExpression(forNGLStepping: .zoomLevelVariable, from: NSExpression(forConstantValue: false), stops: NSExpression(forConstantValue: fillAntialiasedStops))

    }

    func styleRoadsWithFunction() {

        let roadLayer = self.nbMapView.style?.layer(withIdentifier: "road_primary") as? NGLLineStyleLayer
        roadLayer?.lineColor = NSExpression(forConstantValue: UIColor.black)

        let lineWidthStops: [NSNumber: NSNumber] = [
            5: 5,
            10: 10,
            15: 15
        ]
        let lineWidthExpression = NSExpression(format: "ngl_interpolate:withCurveType:parameters:stops:($zoomLevel, 'linear', nil, %@)", lineWidthStops)
        roadLayer?.lineWidth = lineWidthExpression
        roadLayer?.lineGapWidth = lineWidthExpression

        let roadLineColorStops: [NSNumber: UIColor] = [
            5: UIColor.purple,
            10: UIColor.purple,
            13: UIColor.yellow,
            16: UIColor.cyan
        ]
        roadLayer?.lineColor = NSExpression(format: "ngl_interpolate:withCurveType:parameters:stops:($zoomLevel, 'linear', nil, %@)", roadLineColorStops)

        roadLayer?.isVisible = true

    }
}
extension StyleMapLayerViewController: NGLMapViewDelegate {
    func mapView(_ mapView: NGLMapView, didFinishLoading style: NGLStyle){

        nbMapView.setCenter(CLLocationCoordinate2DMake(12.97780156, 77.59656748), zoomLevel: 10, animated: true)

    }
}
extension StyleMapLayerViewController: UITableViewDelegate, UITableViewDataSource {

    func settingsTitlesForRaw(index: Int) -> String {
        let type = typeList[index]
        switch type {
        case ActionType.StyleBuildingExtrusions :
            return "Style Building Extrusions"
        case ActionType.StyleWaterWithFunction :
            return "Style Water with function"
        case ActionType.StyleRoadsWithFunction :
            return "Style Roads with function"
        case ActionType.AddBuildingExtrusions :
            return "Add Building Extrusions"
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

    func dismissSettings(type: ActionType) {
        dismiss(animated: true)
        performeSettings(type: type)
    }
}
```

- Initializing **mapView**: The nbMapView property is initialized in the **viewDidLoad()** method. It creates an instance of **NGLMapView** and sets it as the main view of the view controller.

- **styleBuildingExtrusions()** method: This method is called when the "Style Building Extrusions" option is selected. It retrieves the **“building-3d”** layer from the map style and sets the fill extrusion color and opacity. It also sets the map center and zoom level.

- **addBuildingExtrusions()** method: This method is called when the "Add Building Extrusions" option is selected. It adds a new **NGLFillExtrusionStyleLayer** to the map style with a source identifier of **"openmaptiles"**. It sets the fill extrusion base and height, fill extrusion color, and opacity. It also sets a specific map camera position for animation.

- **styleWaterWithFunction()** method: This method is called when the "Style Water with function" option is selected. It retrieves the **“water”** layer from the map style and sets the fill color using an interpolation function based on the zoom level. It also sets the fill antialiased property using a stepped interpolation.

- **styleRoadsWithFunction()** method: This method is called when the "Style Roads with function" option is selected. It retrieves the **“road_primary”** layer from the map style and sets the line color using an interpolation function based on the zoom level. It also sets the line width and line gap width using an interpolation function. Additionally, it sets the layer's visibility to true.

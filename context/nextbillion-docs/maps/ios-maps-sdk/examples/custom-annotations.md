# Custom Annotations

This example shows how to add custom annotations in MapView.

- Add Annotations from GeoJson

- Animate Annotations

- Query Visible Annotations in Rect

- Center Selected Annotation

![documentation image](https://static.nextbillion.io/docs-next/docs/maps/ios/custom-annotations.webp)

For all code examples, refer to [Maps Code Examples](https://github.com/nextbillion-ai/ios-map-example)

**AnnotationsViewController** [view source](https://github.com/nextbillion-ai/ios-map-example/blob/main/ios-map-example/AnnotationsViewController.swift)

```swift
//
//  StyleMapLayerViewController.swift
//  maps-ios-demo
//

import Foundation
import UIKit
import Nbmap

enum AnnotationActionType{
    case AddAnnotations
    case AddNumberAnnotations
    case AnimateAnnotations
    case QueryVisibleAnnotations
    case CenterSelectedAnnotations
    case AddVisibleAreaPolyline

}

class AnnotationsViewController: UIViewController {

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
        AnnotationActionType.AddAnnotations,
        AnnotationActionType.AddNumberAnnotations,
        AnnotationActionType.AnimateAnnotations,
        AnnotationActionType.QueryVisibleAnnotations,
        AnnotationActionType.CenterSelectedAnnotations,
        AnnotationActionType.AddVisibleAreaPolyline,
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

    func performeSettings(type: AnnotationActionType) {
        switch type {
        case AnnotationActionType.AddAnnotations :
            addAnnotations(count: 100)
            break
        case AnnotationActionType.AddNumberAnnotations :
            addAnnotations(count: 1000)
            break
        case .AnimateAnnotations:
            animateAnnotations()
            break
        case .QueryVisibleAnnotations:
            queryVisibleAnnotations()
            break
        case .CenterSelectedAnnotations:
            centerSelectedAnnotation()
            break
        case .AddVisibleAreaPolyline:
            addVisibleAreaPolyline()
            break
        }

    }

    func addAnnotations(count: Int32) {

        if let annotations = self.nbMapView.annotations {
            self.nbMapView.removeAnnotations(annotations)
        }

        DispatchQueue.global(qos: .default).async {
            if let featuresData = try? Data(contentsOf: Bundle.main.url(forResource: "points", withExtension: "geojson")!),
                let features = try? JSONSerialization.jsonObject(with: featuresData, options: []) as? [String: Any] {

                var annotations = [NGLPointAnnotation]()

                if let featureList = features["features"] as? [[String: Any]] {
                    for feature in featureList {
                        if let coordinates = feature["geometry"] as? [String: Any],
                           let coordinateList = coordinates["coordinates"] as? [Double],
                           let title = feature["properties"] as? [String: Any] {

                            let coordinate = CLLocationCoordinate2D(latitude: coordinateList[1], longitude: coordinateList[0])
                            let annotation = NGLPointAnnotation()
                            annotation.coordinate = coordinate
                            annotation.title = title["NAME"] as? String

                            annotations.append(annotation)

                            if annotations.count == count {
                                break
                            }
                        }
                    }

                    DispatchQueue.main.async {
                        self.nbMapView.addAnnotations(annotations)
                        self.nbMapView.showAnnotations(annotations, animated: true)
                    }
                }
            }
        }

    }

    func animateAnnotations () {
        let annot = NGLPointAnnotation()
        annot.coordinate = self.nbMapView.centerCoordinate
        self.nbMapView.addAnnotation(annot)

        let point = CGPoint(x: self.view.frame.origin.x + 200, y: self.view.frame.midY)
        let coord = self.nbMapView.convert(point, toCoordinateFrom: self.view)

        DispatchQueue.main.asyncAfter(deadline: .now() + 1) {
            UIView.animate(withDuration: 1) {
                annot.coordinate = coord
            }
        }

    }

    func queryVisibleAnnotations() {
        let visibleAnnotationCount = NSNumber(value: self.nbMapView.visibleAnnotations?.count ?? 0)
        var message: String

        if visibleAnnotationCount.intValue == 1 {
            message = "There is \(visibleAnnotationCount) visible annotation."
        } else {
            message = "There are \(visibleAnnotationCount) visible annotations."
        }

        let alertController = UIAlertController(title: "Visible Annotations", message: message, preferredStyle: .alert)
        alertController.addAction(UIAlertAction(title: "Ok", style: .cancel, handler: nil))
        self.present(alertController, animated: true, completion: nil)

    }

    func centerSelectedAnnotation() {

        if let annotation = self.nbMapView.selectedAnnotations.first {
            let point = self.nbMapView.convert(annotation.coordinate, toPointTo: self.nbMapView)
            let center = self.nbMapView.convert(point, toCoordinateFrom: self.nbMapView)
            self.nbMapView.setCenter(center, animated: true)
        }
    }

    func addVisibleAreaPolyline() {
        let constrainedRect = self.nbMapView.bounds.inset(by: self.nbMapView.contentInset)

        var lineCoords = [CLLocationCoordinate2D]()

        lineCoords.append(self.nbMapView.convert(CGPoint(x: constrainedRect.minX, y: constrainedRect.minY), toCoordinateFrom: self.nbMapView))
        lineCoords.append(self.nbMapView.convert(CGPoint(x: constrainedRect.maxX, y: constrainedRect.minY), toCoordinateFrom: self.nbMapView))
        lineCoords.append(self.nbMapView.convert(CGPoint(x: constrainedRect.maxX, y: constrainedRect.maxY), toCoordinateFrom: self.nbMapView))
        lineCoords.append(self.nbMapView.convert(CGPoint(x: constrainedRect.minX, y: constrainedRect.maxY), toCoordinateFrom: self.nbMapView))
        lineCoords.append(lineCoords[0])

        let line = NGLPolyline(coordinates: &lineCoords, count: UInt(lineCoords.count))
        self.nbMapView.addAnnotation(line)

    }


}

extension AnnotationsViewController: NGLMapViewDelegate {
    func mapView(_ mapView: NGLMapView, didFinishLoading style: NGLStyle){
        nbMapView.setCenter(CLLocationCoordinate2DMake(38.87031006108791, -77.00896639534831), zoomLevel: 10, animated: true)

    }

    func mapView(_ mapView: NGLMapView, didSelect annotation: NGLAnnotation) {
        let point = self.nbMapView.convert(annotation.coordinate, toPointTo: self.nbMapView)
        let center = self.nbMapView.convert(point, toCoordinateFrom: self.nbMapView)
        self.nbMapView.setCenter(center, zoomLevel: 14, animated: true)
    }

    func mapView(_ mapView: NGLMapView, annotationCanShowCallout annotation: NGLAnnotation) -> Bool {
        return true
    }
}

extension AnnotationsViewController: UITableViewDelegate, UITableViewDataSource {

    func settingsTitlesForRaw(index: Int) -> String {
        let type = typeList[index]
        switch type {
        case AnnotationActionType.AddAnnotations :
            return "Add 100 Annotations"
        case AnnotationActionType.AddNumberAnnotations :
            return "Add 1000 Annotations"
        case AnnotationActionType.AnimateAnnotations :
            return "Animate Annotations"
        case AnnotationActionType.QueryVisibleAnnotations :
            return "Query Visible Annotations"
        case AnnotationActionType.CenterSelectedAnnotations :
            return "Center Selected Annotations"
        case AnnotationActionType.AddVisibleAreaPolyline :
            return "Add Visible Area Polyline"
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

    func dismissSettings(type: AnnotationActionType) {
        dismiss(animated: true)
        performeSettings(type: type)
    }
}
```

1.  **Initializing nbMapView:**
    - The **nbMapView** is initialized with a frame that matches the bounds of the view controller's view.

    - The mapView is added as a subview of the view controller's view and set as the delegate of the map view.

2.  **addAnnotations:**
    - Removes any existing annotations from the map view.

    - Asynchronously loads a **GeoJSON** file named "points.geojson" from the main bundle.

    - Parses the GeoJSON data and extracts the coordinates and title for each feature.

    - Creates **NGLPointAnnotation** objects for each **feature** and adds them to an array.

    - Adds the annotations to the map view and shows them with an animated effect.

3 **queryVisibleAnnotations:**

- Retrieves the count of visible annotations on the map view using **nbMapView.visibleAnnotations**.

- Displays an alert controller with a message indicating the number of visible annotations.

1.  **centerSelectedAnnotation:**
    - Checks if there is a selected annotation on the map view using **nbMapView.selectedAnnotations**.

    - Converts the **coordinate** of the selected annotation to a point on the map view.

    - Converts the point to a coordinate on the map view.

    - Sets the map view's center coordinate to the new coordinate with an animated effect using **nbMapView.setCenter(center, animated: true)**.

4 **addVisibleAreaPolyline:**

- Creates a rectangle (constrainedRect) that represents the visible area of the map view.

- Converts the four corners of the rectangle to coordinates on the map view.

- Creates an **NGLPolyline** with the converted coordinates and adds it as an annotation to the map view.

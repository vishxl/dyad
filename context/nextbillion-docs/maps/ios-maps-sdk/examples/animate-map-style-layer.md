# Animate Map Style Layer

This example shows how to animate runtime map style layer.

- Add Image Source layer

- Update Image source every second

![documentation image](https://static.nextbillion.io/docs-next/docs/maps/ios/animate-map-style-layer.webp)

For all code examples, refer to [Maps Code Examples](https://github.com/nextbillion-ai/ios-map-example)

**AnimateMapLayerViewController** [view source](https://github.com/nextbillion-ai/ios-map-example/blob/main/ios-map-example/AnimateMapLayerViewController.swift)

```swift
//
//  AnimateMapLayerViewController.swift
//  maps-ios-demo
//
//
import Foundation
import UIKit
import Nbmap
class AnimateMapLayerViewController: UIViewController {

    var nbMapView: NGLMapView! {
        didSet {
            oldValue?.removeFromSuperview()
            if let mapView = nbMapView {
                view.insertSubview(mapView, at: 0)
                mapView.delegate = self
            }
        }
    }
    var radarSuffix = 0

    var points : Array = [CLLocationCoordinate2D]()

    override func viewDidLoad() {
        super.viewDidLoad()
        nbMapView = NGLMapView(frame:self.view.bounds)
    }

    func addImageSourceLayer() {
        let coordinateQuad: NGLCoordinateQuad = NGLCoordinateQuad(
            topLeft:CLLocationCoordinate2D(latitude: 46.437, longitude: -80.425),
            bottomLeft:CLLocationCoordinate2D(latitude: 37.936, longitude: -80.425),
            bottomRight:CLLocationCoordinate2D(latitude: 37.936, longitude: -71.516),
            topRight: CLLocationCoordinate2D(latitude: 46.437, longitude: -71.516)
        )

        let imageSource = NGLImageSource(identifier: "style-image-source-id", coordinateQuad: coordinateQuad, image: UIImage(named: "southeast_radar_0")!)
        if let source = nbMapView.style?.source(withIdentifier: "style-image-source-id") {
            nbMapView.style?.removeSource(source)
        }
        nbMapView.style?.addSource(imageSource)
        let rasterLayer = NGLRasterStyleLayer(identifier: "style-raster-image-layer-id", source: imageSource)
        if let layer = nbMapView.style?.layer(withIdentifier: "style-raster-image-layer-id") {
            nbMapView.style?.removeLayer(layer)
        }

        nbMapView.style?.addLayer(rasterLayer)
        Timer.scheduledTimer(timeInterval: 0.8, target: self, selector: #selector(updateAnimatedImageSource(_:)), userInfo: imageSource, repeats: true)
    }

    @objc func updateAnimatedImageSource(_ timer: Timer) {
        guard let imageSource = timer.userInfo as? NGLImageSource else { return }
        let uiImage = UIImage(named: "southeast_radar_\(radarSuffix)")
        imageSource.setValue(uiImage, forKey: "image")
        radarSuffix += 1
        if radarSuffix > 3 {
            radarSuffix = 0
        }
    }

}
extension AnimateMapLayerViewController: NGLMapViewDelegate {
    func mapView(_ mapView: NGLMapView, didFinishLoading style: NGLStyle){

        nbMapView.setCenter(CLLocationCoordinate2DMake(41.437, -76.425), zoomLevel: 5, animated: true)
        addImageSourceLayer()
    }
}
```

The main functionality of this example is to display a **map view** with an animated image overlay (radar images). The **addImageSourceLayer()** method sets up the image source and raster layer, and the **updateAnimatedImageSource(\_:)** method is called periodically to update the image source with new radar images.

1.  Declaration and initialization of **nbMapView**, radarSuffix, and points variables.

2.  **viewDidLoad()** method where the nbMapView is created and added as a subview to the view.

3.  **addImageSourceLayer()** method to add an image source and raster layer to the map view.

4.  **updateAnimatedImageSource(\_:)** method to update the image source with a new image.

5.  **mapView(\_:didFinishLoading:)** delegate method that sets the initial center and zoom level of the map and calls addImageSourceLayer().

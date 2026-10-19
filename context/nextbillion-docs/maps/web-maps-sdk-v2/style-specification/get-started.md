# Get Started

## Style Specification

A style is a document that defines the visual appearance of a map: what data to draw, the order to draw it in, and how to style the data when drawing it. A style document is a JSON object with specific root level and nested properties. This specification defines and describes these properties.

## Style document structure

A style consists of a set of root properties, some of which describe a single global property, and some of which contain nested properties. Some root properties, like version, name, and metadata, don't have any influence over the appearance or behavior of your map, but provide important descriptive information related to your map. Others, like layers and sources, are critical and determine which map features will appear on your map and what they will look like. Some properties, like center, zoom, pitch, and bearing, provide the map renderer with a set of defaults to be used when initially displaying the map.

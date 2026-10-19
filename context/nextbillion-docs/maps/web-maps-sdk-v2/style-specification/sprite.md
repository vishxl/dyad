# Sprite

A style's `sprite` property supplies a URL template for loading small images to use in rendering _background-pattern, fill-pattern, line-pattern, fill-extrusion-pattern_ and _icon-image_ style properties.

"sprite": `https://api.nextbillion.io/maps/streets/sprite`

A valid sprite source must supply two types of files:

1.  An **index file**, which is a JSON document containing a description of each image contained in the sprite. The content of this file must be a JSON object whose keys form identifiers to be used as the values of the above style properties, and whose values are objects describing the dimensions (`width` and `height` properties) and pixel ratio (`pixelRatio`) of the image and its location within the sprite (`x` and `y`). For example, a sprite containing a single image might have the following index file contents:

    ```json
    {
      "poi": {
        "width": 32,
        "height": 32,
        "x": 0,
        "y": 0,
        "pixelRatio": 1
      }
    }
    ```

    Then the `style` could refer to this sprite image by creating a symbol layer with the layout property _icon-image: poi_, or with the tokenized value _icon-image: {icon}_ and vector tile features with a `icon` property with the value `poi`.

2.  **Image files**, which are PNG images containing the sprite data. Apart from the required _width_, _height_, _x_, and _y_ properties, the following optional properties are supported:
    - _content_: An array of four numbers, with the first two specifying the left, top corner, and the last two specifying the right, bottom corner. If present, and if the icon uses [icon-text-fit](/maps/web-v2/style-specification/layers), the symbol's text will be fit inside the content box.
    - _stretchX_: An array of two-element arrays, consisting of two numbers that represent the from position and the to position of areas that can be stretched.
    - _stretchY_: Same as _stretchX_, but for the vertical dimension.

Nextbillion.ai SDKs will use the value of the `sprite` property in the style to generate the URLs for loading both files. First, for both file types, it will append _@2x_ to the URL on high-DPI devices. Second, it will append a file extension: _.json_ for the index file, and _.png_ for the image file.

For example, if you specified **sprite**: `https://example.com/sprite`, renderers would load `https://example.com/sprite.json` and `https://example.com/sprite.png`, or `https://example.com/sprite@2x.json` and `https://example.com/sprite@2x.png`

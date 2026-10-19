# Expressions

The value for any [layout property](/docs/maps/web-v2/style-specification/layers#layout-property), [paint property](/docs/maps/web-v2/style-specification/layers#paint-property), or [filter](/docs/maps/web-v2/style-specification/layers#filter) may be specified as an _expression_. An expression defines a formula for computing the value of the property using the _operators_ described below. The set of expression operators provided by Nextbillion.ai GL includes:

- Mathematical operators for performing arithmetic and other operations on numeric values
- Logical operators for manipulating boolean values and making conditional decisions
- String operators for manipulating strings
- Data operators, providing access to the properties of source features
- Camera operators, providing access to the parameters defining the current map view

Expressions are represented as JSON arrays. The first element of an expression array is a string naming the expression operator, e.g. [`"*"`](#*) or [`"case"`](#case). Elements that follow (if any) are the _arguments_ to the expression. Each argument is either a literal value (a string, number, boolean, or `null`), or another expression array.

```json
[expression_name, argument_0, argument_1, ...]
```

## Data expressions

A _data expression_ is any expression that access feature data -- that is, any expression that uses one of the data operators: [`get`](#get), [`has`](#has), [`id`](#id), [`geometry-type`](#geometry-type), [`properties`](#properties), or [`feature-state`](#feature-state). Data expressions allow a feature's properties or state to determine its appearance. They can be used to differentiate features within the same layer and to create data visualizations.

```json
{
  "circle-color": [
    "rgb",
    // red is higher when feature.properties.temperature is higher
    ["get", "temperature"],
    // green is always zero
    0,
    // blue is higher when feature.properties.temperature is lower
    ["-", 100, ["get", "temperature"]]
  ]
}
```

This example uses the [`get`](#get) operator to get the `temperature` value of each feature. That value is used to compute arguments to the [`rgb`](#rgb) operator, defining a color in terms of its red, green, and blue components.

Data expressions are allowed as the value of the [`filter`](/docs/maps/web-v2/style-specification/layers#filter) property, and as values for most paint and layout properties. However, some paint and layout properties do not yet support data expressions. The level of support is indicated by the "data-driven styling" row of the "SDK Support" table for each property. Data expressions with the [`feature-state`](#feature-state) operator are allowed only on paint properties.

## Camera expressions

A _camera expression_ is any expression that uses the [`zoom`](#zoom) operator. Such expressions allow the appearance of a layer to change with the map's zoom level. Camera expressions can be used to create the appearance of depth and to control data density.

```json
{
  "circle-radius": [
    "interpolate",
    ["linear"],
    ["zoom"],
    // zoom is 5 (or less) -> circle radius will be 1px
    5,
    1,
    // zoom is 10 (or greater) -> circle radius will be 5px
    10,
    5
  ]
}
```

This example uses the [`interpolate`](#interpolate) operator to define a linear relationship between zoom level and circle size using a set of input-output pairs. In this case, the expression indicates that the circle radius should be 1 pixel when the zoom level is 5 or below, and 5 pixels when the zoom is 10 or above. Between the two zoom levels, the circle radius will be linearly interpolated between 1 and 5 pixels

Camera expressions are allowed anywhere an expression may be used. When a camera expression used as the value of a layout or paint property, it must be in one of the following forms:

```json
[ "interpolate", interpolation, ["zoom"], ... ]
```

Or:

```json
[ "step", ["zoom"], ... ]
```

Or:

```json
[
    "let",
    ... variable bindings...,
    [ "interpolate", interpolation, ["zoom"], ... ]
]
```

Or:

```json
[
    "let",
    ... variable bindings...,
    [ "step", ["zoom"], ... ]
]
```

That is, in layout or paint properties, `["zoom"]` may appear only as the input to an outer [`interpolate`](#interpolate) or [`step`](#step) expression, or such an expression within a [`let`](#let) expression.

There is an important difference between layout and paint properties in the timing of camera expression evaluation. Paint property camera expressions are re-evaluated whenever the zoom level changes, even fractionally. For example, a paint property camera expression will be re-evaluated continuously as the map moves between zoom levels 4.1 and 4.6. A _layout property_ camera expression is evaluated only at integer zoom levels. It will _not_ be re-evaluated as the zoom changes from 4.1 to 4.6 -- only if it goes above 5 or below 4.

## Composition

A single expression may use a mix of data operators, camera operators, and other operators. Such composite expressions allows a layer's appearance to be determined by a combination of the zoom level _and_ individual feature properties.

```json
{
  "circle-radius": [
    "interpolate",
    ["linear"],
    ["zoom"],
    // when zoom is 0, set each feature's circle radius to the value of its "rating" property
    0,
    ["get", "rating"],
    // when zoom is 10, set each feature's circle radius to four times the value of its "rating" property
    10,
    ["*", 4, ["get", "rating"]]
  ]
}
```

An expression that uses both data and camera operators is considered both a data expression and a camera expression, and must adhere to the restrictions described above for both.

## Type system

The input arguments to expressions, and their result values, use the same set of [types](#types) as the rest of the style specification: boolean, string, number, color, and arrays of these types. Furthermore, expressions are _type safe_: each use of an expression has a known result type and required argument types, and the SDKs verify that the result type of an expression is appropriate for the context in which it is used. For example, the result type of an expression in the [`filter`](/docs/maps/web-v2/style-specification/layers#filter) property must be [boolean](#types-boolean), and the arguments to the [`+`](#+) operator must be [numbers](#types-number).

When working with feature data, the type of a feature property value is typically not known ahead of time by the SDK. To preserve type safety, when evaluating a data expression, the SDK will check that the property value is appropriate for the context. For example, if you use the expression `["get", "feature-color"]` for the [`circle-color`](#paint-circle-circle-color) property, the SDK will verify that the `feature-color` value of each feature is a string identifying a valid [color](#types-color). If this check fails, an error will be indicated in an SDK-specific way (typically a log message), and the default value for the property will be used instead.

In most cases, this verification will occur automatically wherever it is needed. However, in certain situations, the SDK may be unable to automatically determine the expected result type of a data expression from surrounding context. For example, it is not clear whether the expression `["&lt;", ["get", "a"], ["get", "b"]]` is attempting to compare strings or numbers. In situations like this, you can use one of the _type assertion_ expression operators to indicate the expected type of a data expression: `["&lt;", ["number", ["get", "a"]], ["number", ["get", "b"]]]`. A type assertion checks that the feature data matches the expected type of the data expression. If this check fails, it produces an error and causes the whole expression to fall back to the default value for the property being defined. The assertion operators are [`array`](#types-array), [`boolean`](#types-boolean), [`number`](#types-number), and [`string`](#types-string).

Expressions perform only one kind of implicit type conversion: a data expression used in a context where a [color](#types-color) is expected will convert a string representation of a color to a color value. In all other cases, if you want to convert between types, you must use one of the _type conversion_ expression operators: [`to-boolean`](#types-to-boolean), [`to-number`](#types-to-number), [`to-string`](#types-to-string), or [`to-color`](#types-to-color). For example, if you have a feature property that stores numeric values in string format, and you want to use those values as numbers rather than strings, you can use an expression such as `["to-number", ["get", "property-name"]]`.

If an expression accepts an array argument and the user supplies an array literal, that array _must_ be wrapped in a `literal` expression (see the examples below). When GL-JS encounters an array in a style-spec property value, it will assume that the array is an expression and try to parse it; the library has no way to distinguish between an expression which failed validation and an array literal unless the developer makes this distinction explicit with the `literal` operator. The `literal` operator is not necessary if the array is returned from a sub-expression, e.g. `["in", 1, ["get", "myArrayProp"]]`.

```json
// will throw an error
{
    "circle-color": ["in", 1, [1, 2, 3]]
}

// will work as expected
{
    "circle-color": ["in", 1, ["literal", [1, 2, 3]]]
}
```

# Expression reference

## Types

The expressions in this section are for testing for and converting between different data types like strings, numbers, and boolean values.

Often, such tests and conversions are unnecessary, but they may be necessary in some expressions where the type of a certain sub-expression is ambiguous. They can also be useful in cases where your feature data has inconsistent types; for example, you could use `to-number` to make sure that values like `"1.5"` (instead of `1.5`) are treated as numeric values.

### array

Asserts that the input is an array (optionally with a specific item type and length). If, when the input expression is evaluated, it is not of the asserted type, then this assertion will cause the whole expression to be aborted.

### Syntax

```bash
["array", value]: array
```

```bash
["array", type: "string" | "number" | "boolean", value]: array<type>
```

```bash
["array",
    type: "string" | "number" | "boolean",
    N: number (literal),
    value
]: array<type, N>
```

### boolean

Asserts that the input value is a boolean. If multiple values are provided, each one is evaluated in order until a boolean is obtained. If none of the inputs are booleans, the expression is an error.

#### Syntax

```bash
["boolean", value]: boolean
```

```bash
["boolean", value, fallback: value, fallback: value, ...]: boolean
```

### collator

Returns a collator for use in locale-dependent comparison operations. The case-sensitive and diacritic-sensitive options default to false. The locale argument specifies the IETF language tag of the locale to use. If none is provided, the default locale is used. If the requested locale is not available, the collator will use a system-defined fallback locale. Use resolved-locale to test the results of locale fallback behavior.

#### Syntax

```bash
["collator",
    { "case-sensitive": boolean, "diacritic-sensitive": boolean, "locale": string }
]: collator
```

### format

Returns formatted text containing annotations for use in mixed-format text-field entries. For a text-field entries of a string type, following option object's properties are supported: If set, the text-font value overrides the font specified by the root layout properties. If set, the font-scale value specifies a scaling factor relative to the text-size specified in the root layout properties. If set, the text-color value overrides the color specified by the root paint properties for this layer.

#### Syntax

```bash
["format",
    input_1: string | image, options_1: { "font-scale": number, "text-font": array<string>, "text-color": color },
    ...,
    input_n: string | image, options_n: { "font-scale": number, "text-font": array<string>, "text-color": color }
]: formatted
```

### image

Returns an image type for use in icon-image, \*-pattern entries and as a section in the format expression. If set, the image argument will check that the requested image exists in the style and will return either the resolved image name or null, depending on whether or not the image is currently in the style. This validation process is synchronous and requires the image to have been added to the style before requesting it in the image argument.

#### Syntax

```bash
["image", value]: image
```

### literal

Provides a literal array or object value.

###3 Syntax

```bash
["literal", [...] (JSON array literal)]: array<T, N>
["literal", {...} (JSON object literal)]: object
```

### number

Asserts that the input value is a number. If multiple values are provided, each one is evaluated in order until a number is obtained. If none of the inputs are numbers, the expression is an error.

#### Syntax

```bash
["number", value]: number
["number", value, fallback: value, fallback: value, ...]: number
```

### number-format

Converts the input number into a string representation using the providing formatting rules. If set, the locale argument specifies the locale to use, as a BCP 47 language tag. If set, the currency argument specifies an ISO 4217 code to use for currency-style formatting. If set, the min-fraction-digits and max-fraction-digits arguments specify the minimum and maximum number of fractional digits to include.

#### Syntax

object Asserts that the input value is an object. If multiple values are provided, each one is evaluated in order until an object is obtained. If none of the inputs are objects, the expression is an error.

#### Syntax

```bash
["object", value]: object
["object", value, fallback: value, fallback: value, ...]: object
```

### string

Asserts that the input value is a string. If multiple values are provided, each one is evaluated in order until a string is obtained. If none of the inputs are strings, the expression is an error.

#### Syntax

```bash
["string", value]: string
["string", value, fallback: value, fallback: value, ...]: string
```

### to-boolean

Converts the input value to a boolean. The result is false when then input is an empty string, 0, false, null, or NaN; otherwise it is true.

#### Syntax

```bash
["to-boolean", value]: boolean
```

### to-color

Converts the input value to a color. If multiple values are provided, each one is evaluated in order until the first successful conversion is obtained. If none of the inputs can be converted, the expression is an error.

#### Syntax

```bash
["to-color", value, fallback: value, fallback: value, ...]: color
```

### to-number

Converts the input value to a number, if possible. If the input is null or false, the result is 0. If the input is true, the result is 1. If the input is a string, it is converted to a number as specified by the "ToNumber Applied to the String Type" algorithm of the ECMAScript Language Specification. If multiple values are provided, each one is evaluated in order until the first successful conversion is obtained. If none of the inputs can be converted, the expression is an error.

#### Syntax

```bash
["to-number", value, fallback: value, fallback: value, ...]: number
```

### to-string

Converts the input value to a string. If the input is null, the result is "". If the input is a boolean, the result is "true" or "false". If the input is a number, it is converted to a string as specified by the "NumberToString" algorithm of the ECMAScript Language Specification. If the input is a color, it is converted to a string of the form "rgba(r,g,b,a)", where r, g, and b are numerals ranging from 0 to 255, and a ranges from 0 to 1. Otherwise, the input is converted to a string in the format specified by the JSON.stringify function of the ECMAScript Language Specification.

#### Syntax

```bash
["to-string", value]: string
```

### typeof

Returns a string describing the type of the given value.

#### Syntax

```bash
["typeof", value]: string
```

## Feature data

### accumulated

Gets the value of a cluster property accumulated so far. Can only be used in the clusterProperties option of a clustered GeoJSON source.

#### Syntax

```bash
["accumulated"]: value
```

### feature-state

Retrieves a property value from the current feature's state. Returns null if the requested property is not present on the feature's state. A feature's state is not part of the GeoJSON or vector tile data, and must be set programmatically on each feature. Features are identified by their id attribute, which must be an integer or a string that can be cast to an integer. Note that \["feature-state"\] can only be used with paint properties that support data-driven styling.

#### Syntax

```bash
["feature-state", string]: value
```

### geometry-type

Gets the feature's geometry type: Point, MultiPoint, LineString, MultiLineString, Polygon, MultiPolygon.

#### Syntax

```bash
["geometry-type"]: string
```

id Gets the feature's id, if it has one.

#### Syntax

```bash
["id"]: value
```

### line-progress

Gets the progress along a gradient line. Can only be used in the line-gradient property.

#### Syntax

```bash
["line-progress"]: number
```

### properties

Gets the feature properties object. Note that in some cases, it may be more efficient to use \["get", "property_name"\] directly.

#### Syntax

```bash
["properties"]: object
```

## Lookup

### at

Retrieves an item from an array.

#### Syntax

```bash
["at", number, array]: ItemType
```

### get

Retrieves a property value from the current feature's properties, or from another object if a second argument is provided. Returns null if the requested property is missing.

#### Syntax

```bash
["get", string]: value
["get", string, object]: value
```

### has

Tests for the presence of an property value in the current feature's properties, or from another object if a second argument is provided.

#### Syntax

```bash
["has", string]: boolean
["has", string, object]: boolean
```

### in

Determines whether an item exists in an array or a substring exists in a string.

#### Syntax

```bash
["in",
    keyword: InputType (boolean, string, or number),
    input: InputType (array or string)
]: boolean
```

### length

Gets the length of an array or string.

#### Syntax

```bash
["length", string | array | value]: number
```

## Decision

The expressions in this section can be used to add conditional logic to your styles. For example, the 'case' expression provides "if/then/else" logic, and 'match' allows you to map specific values of an input expression to different output expressions.

### not (`!`)

Logical negation. Returns true if the input is false, and false if the input is true.

#### Syntax

```bash
["!", boolean]: boolean
```

### notEqual (`!=`)

Returns true if the input values are not equal, false otherwise. The comparison is strictly typed: values of different runtime types are always considered unequal. Cases where the types are known to be different at parse time are considered invalid and will produce a parse error. Accepts an optional collator argument to control locale-dependent string comparisons.

#### Syntax

```bash
["!=", value, value]: boolean
["!=", value, value, collator]: boolean
```

### lessThan (`<`)

Returns true if the first input is strictly less than the second, false otherwise. The arguments are required to be either both strings or both numbers; if during evaluation they are not, expression evaluation produces an error. Cases where this constraint is known not to hold at parse time are considered in valid and will produce a parse error. Accepts an optional collator argument to control locale-dependent string comparisons.

#### Syntax

```bash
["<", value, value]: boolean
["<", value, value, collator]: boolean
```

### lessThanEqual (`<=`)

Returns true if the first input is less than or equal to the second, false otherwise. The arguments are required to be either both strings or both numbers; if during evaluation they are not, expression evaluation produces an error. Cases where this constraint is known not to hold at parse time are considered in valid and will produce a parse error. Accepts an optional collator argument to control locale-dependent string comparisons.

#### Syntax

```bash
["<=", value, value]: boolean
["<=", value, value, collator]: boolean
```

### equals (`==`)

Returns true if the input values are equal, false otherwise. The comparison is strictly typed: values of different runtime types are always considered unequal. Cases where the types are known to be different at parse time are considered invalid and will produce a parse error. Accepts an optional collator argument to control locale-dependent string comparisons.

#### Syntax

```bash
["==", value, value]: boolean
["==", value, value, collator]: boolean
```

### greaterthan(`>`)

Returns true if the first input is strictly greater than the second, false otherwise. The arguments are required to be either both strings or both numbers; if during evaluation they are not, expression evaluation produces an error. Cases where this constraint is known not to hold at parse time are considered in valid and will produce a parse error. Accepts an optional collator argument to control locale-dependent string comparisons.

#### Syntax

```bash
[">", value, value]: boolean
[">", value, value, collator]: boolean
```

### greaterOrEqual (`>=`)

Returns true if the first input is greater than or equal to the second, false otherwise. The arguments are required to be either both strings or both numbers; if during evaluation they are not, expression evaluation produces an error. Cases where this constraint is known not to hold at parse time are considered in valid and will produce a parse error. Accepts an optional collator argument to control locale-dependent string comparisons.

#### Syntax

```bash
[">=", value, value]: boolean
[">=", value, value, collator]: boolean
```

### all

Returns true if all the inputs are true, false otherwise. The inputs are evaluated in order, and evaluation is short-circuiting: once an input expression evaluates to false, the result is false and no further input expressions are evaluated.

#### Syntax

```bash
    ["all", boolean, boolean]: boolean
    ["all", boolean, boolean, ...]: boolean
```

any Returns true if any of the inputs are true, false otherwise. The inputs are evaluated in order, and evaluation is short-circuiting: once an input expression evaluates to true, the result is true and no further input expressions are evaluated.

#### Syntax

```bash
["any", boolean, boolean]: boolean
["any", boolean, boolean, ...]: boolean
```

### case

Selects the first output whose corresponding test condition evaluates to true, or the fallback value otherwise.

#### Syntax

```bash
["case",
    condition: boolean, output: OutputType,
    condition: boolean, output: OutputType,
    ...,
    fallback: OutputType
]: OutputType
```

### coalesce

Evaluates each expression in turn until the first non-null value is obtained, and returns that value.

#### Syntax

```bash
["coalesce", OutputType, OutputType, ...]: OutputType
```

### match

Selects the output whose label value matches the input value, or the fallback value if no match is found. The input can be any expression (e.g. \["get", "building_type"\]). Each label must be either:

a single literal value; or an array of literal values, whose values must be all strings or all numbers (e.g. \[100, 101\] or \["c", "b"\]). The input matches if any of the values in the array matches, similar to the "in" operator. Each label must be unique. If the input type does not match the type of the labels, the result will be the fallback value.

#### Syntax

```bash
["match",
    input: InputType (number or string),
    label: InputType | [InputType, InputType, ...], output: OutputType,
    label: InputType | [InputType, InputType, ...], output: OutputType,
    ...,
    fallback: OutputType
]: OutputType
```

## Ramps, scales, curves

### interpolate

Produces continuous, smooth results by interpolating between pairs of input and output values ("stops"). The input may be any numeric expression (e.g., \["get", "population"\]). Stop inputs must be numeric literals in strictly ascending order. The output type must be number, array<number\>, or color.

**Interpolation types:**

- \["linear"\]: interpolates linearly between the pair of stops just less than and just greater than the input.
- \["exponential", base\]: interpolates exponentially between the stops just less than and just greater than the input. base controls the rate at which the output increases: higher values make the output increase more towards the high end of the range. With values close to 1 the output increases linearly.
- \["cubic-bezier", x1, y1, x2, y2\]: interpolates using the cubic bezier curve defined by the given control points.

#### Syntax

```bash
["interpolate",
    interpolation: ["linear"] | ["exponential", base] | ["cubic-bezier", x1, y1, x2, y2],
    input: number,
    stop_input_1: number, stop_output_1: OutputType,
    stop_input_n: number, stop_output_n: OutputType, ...
]: OutputType (number, array<number>, or Color)
```

### interpolate-hcl

Produces continuous, smooth results by interpolating between pairs of input and output values ("stops"). Works like interpolate, but the output type must be color, and the interpolation is performed in the Hue-Chroma-Luminance color space.

#### Syntax

```bash
["interpolate-hcl",
    interpolation: ["linear"] | ["exponential", base] | ["cubic-bezier", x1, y1, x2, y2],
    input: number,
    stop_input_1: number, stop_output_1: Color,
    stop_input_n: number, stop_output_n: Color, ...
]: Color
```

### interpolate-lab

Produces continuous, smooth results by interpolating between pairs of input and output values ("stops"). Works like interpolate, but the output type must be color, and the interpolation is performed in the CIELAB color space.

#### Syntax

```bash
["interpolate-lab",
    interpolation: ["linear"] | ["exponential", base] | ["cubic-bezier", x1, y1, x2, y2 ],
    input: number,
    stop_input_1: number, stop_output_1: Color,
    stop_input_n: number, stop_output_n: Color, ...
]: Color
```

### step

Produces discrete, stepped results by evaluating a piecewise-constant function defined by pairs of input and output values ("stops"). The input may be any numeric expression (e.g., \["get", "population"\]). Stop inputs must be numeric literals in strictly ascending order. Returns the output value of the stop just less than the input, or the first output if the input is less than the first stop.

#### Syntax

```bash
["step",
    input: number,
    stop_output_0: OutputType,
    stop_input_1: number, stop_output_1: OutputType,
    stop_input_n: number, stop_output_n: OutputType, ...
]: OutputType
```

## Variable binding

### let

Binds expressions to named variables, which can then be referenced in the result expression using \["var", "variable_name"\].

#### Syntax

```bash
["let",
    string (alphanumeric literal), any, string (alphanumeric literal), any, ...,
    OutputType
]: OutputType
```

### var

References variable bound using "let".

#### Syntax

```bash
["var", previously bound variable name]: the type of the bound expression
```

## String

### concat

Returns a string consisting of the concatenation of the inputs. Each input is converted to a string as if by to-string.

#### Syntax

```bash
["concat", value, value, ...]: string
```

### downcase

Returns the input string converted to lowercase. Follows the Unicode Default Case Conversion algorithm and the locale-insensitive case mappings in the Unicode Character Database.

#### Syntax

```bash
["downcase", string]: string
```

### is-supported-script

Returns true if the input string is expected to render legibly. Returns false if the input string contains sections that cannot be rendered without potential loss of meaning.

#### Syntax

```bash
    ["is-supported-script", string]: boolean
```

### resolved-locale

Returns the IETF language tag of the locale being used by the provided collator. This can be used to determine the default system locale, or to determine if a requested locale was successfully loaded.

#### Syntax

```bash
["resolved-locale", collator]: string
```

### upcase

Returns the input string converted to uppercase. Follows the Unicode Default Case Conversion algorithm and the locale-insensitive case mappings in the Unicode Character Database.

#### Syntax

```bash
["upcase", string]: string
```

## Color

### rgb

Creates a color value from red, green, and blue components, which must range between 0 and 255, and an alpha component of 1. If any component is out of range, the expression is an error.

#### Syntax

`["rgb", number, number, number]: color`

### rgba

Creates a color value from red, green, blue components, which must range between 0 and 255, and an alpha component which must range between 0 and 1. If any component is out of range, the expression is an error.

#### Syntax

```bash
["rgba", number, number, number, number]: color
```

### to-rgba

Returns a four-element array containing the input color's red, green, blue, and alpha components, in that order.

#### Syntax

`["to-rgba", color]: array<number, 4>`

## Math

### (subtraction)-

For two inputs, returns the result of subtracting the second input from the first. For a single input, returns the result of subtracting it from 0.

#### Syntax

```bash
["-", number]: number
```

### (product)\*

Returns the product of the inputs.

#### Syntax

```bash
["*", number, number, ...]: number
```

### (division)/

Returns the result of floating point division of the first input by the second.

#### Syntax

```bash
["/", number, number]: number
```

### (remainder)%

Returns the remainder after integer division of the first input by the second.

#### Syntax

```bash
["%", number, number]: number
```

### (power)^

Returns the result of raising the first input to the power specified by the second.

#### Syntax

### (sum)+

Returns the sum of the inputs.

#### Syntax

```bash
["+", number, number, ...]: number
```

### abs

Returns the absolute value of the input.

#### Syntax

```bash
["abs", number]: number
```

### acos

Returns the arccosine of the input.

#### Syntax

```bash
["acos", number]: number
```

### asin

Returns the arcsine of the input.

#### Syntax

```bash
["asin", number]: number
```

### atan

Returns the arctangent of the input.

#### Syntax

```bash
["atan", number]: number
```

### ceil

Returns the smallest integer that is greater than or equal to the input.

#### Syntax

```bash
["ceil", number]: number
```

### cos

Returns the cosine of the input.

#### Syntax

```bash
["cos", number]: number
```

### e

Returns the mathematical constant e.

#### Syntax

```bash
["e"]: number
```

### floor

Returns the largest integer that is less than or equal to the input.

#### Syntax

```bash
["floor", number]: number
```

### ln

Returns the natural logarithm of the input.

#### Syntax

```bash
["ln", number]: number
```

### ln2

Returns mathematical constant ln(2).

#### Syntax

```bash
["ln2"]: number
```

### log10

Returns the base-ten logarithm of the input.

#### Syntax

```bash
["log10", number]: number
```

### log2

Returns the base-two logarithm of the input.

#### Syntax

```bash
["log2", number]: number
```

### max

Returns the maximum value of the inputs.

#### Syntax

```bash
["max", number, number, ...]: number
```

### min

Returns the minimum value of the inputs.

#### Syntax

```bash
["min", number, number, ...]: number
```

### pi

Returns the mathematical constant pi.

#### Syntax

```bash
["pi"]: number
```

### round

Rounds the input to the nearest integer. Halfway values are rounded away from zero. For example, \["round", -1.5\] evaluates to -2.

#### Syntax

```bash
["round", number]: number
```

### sin

Returns the sine of the input.

#### Syntax

```bash
["sin", number]: number
```

### sqrt

Returns the square root of the input.

#### Syntax

```bash
["sqrt", number]: number
```

### tan

Returns the tangent of the input.

#### Syntax

```bash
["tan", number]: number
```

## Zoom

### zoom

Gets the current zoom level. Note that in style layout and paint properties, \["zoom"\] may only appear as the input to a top-level "step" or "interpolate" expression.

#### Syntax

```bash
["zoom"]: number
```

## Heatmap

### heatmap-density

Gets the kernel density estimation of a pixel in a heatmap layer, which is a relative measure of how many data points are crowded around a particular pixel. Can only be used in the heatmap-color property.

#### Syntax

```bash
["heatmap-density"]: number
```

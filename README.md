# node-red-contrib-mapper
Node-red node that maps input to output value with multiple editable sections and graphical editor

## Overview

Mapper performs multi-segment value mapping from one value to another, from input to output range. Mapping function can be edited by drawing it in the editor. You can add many keyframes by clicking link with left mouse button, drag keyframes and delete it with right mouse button. It also has few more usefull tools included, used in typical applications.
    
![Editor](/img/editor.png)

## Features

- Graphical editor for mapping function
- Customizable input and output ranges (not only 0..1)
- Few different input's out of range behaviours
- Output rounding options
- Custom grid divisions
- Currently only lienear mapping function available

## Used libraries

- [SVG.JS](https://github.com/svgdotjs/svg.js)
- [svg.draggable.js](https://github.com/svgdotjs/svg.draggable.js)
  
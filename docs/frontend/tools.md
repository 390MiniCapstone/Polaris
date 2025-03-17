# Frontend Tools
## 1. Table of Contents
- [Frontend Tools](#frontend-tools)
  - [1. Table of Contents](#1-table-of-contents)
  - [2. SVG Coordinate Finder](#2-svg-coordinate-finder)

## 2. SVG Coordinate Finder
Finding an **SVG coordinate finder** is difficult because most tools return **screen coordinates** instead of **SVG coordinates**, leading to inaccuracies. Many solutions don’t handle scaling, `viewBox`, or transformations properly. Using an **`index.html` tool** allows full control, leveraging `getScreenCTM().inverse()` to map mouse positions accurately within the SVG.

You may find the tool under [`Polaris-FE/tools/SVGCoordinateTool.html`](/Polaris-FE/tools/SVGCoordinateTool.html)
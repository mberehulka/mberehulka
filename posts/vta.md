title: Voxel traversal algorithm
publishedAt: 2023-12-08
snippet: Fast voxel traversal algorithm with example
---

This algorithm is a 3d subpixel representation of the [DDA](https://en.wikipedia.org/wiki/Digital_differential_analyzer_(graphics_algorithm)) algorithm.

Useful for ray-tracing and voxel rendering.

<canvas id="ctx" class="full-width" height="400"></canvas>
<script src="js/3d/vta/main.js" type="module"></script>

<details>
<summary>code</summary>

```js
---replace("js/3d/vta/algorithm.js")---
```
</details>

</br>

- references:
  - <http://www.cs.yorku.ca/~amana/research/grid.pdf>
  - <https://stackoverflow.com/a/55277311>
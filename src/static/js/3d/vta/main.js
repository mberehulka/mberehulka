import * as _TRHEE from "../../libs/three.module.js"
const { Vector3, Color, ...THREE } = _TRHEE
import { scene, loop, gui, camera } from "../boilerplate.js"
import start_end from "./algorithm.js"

// Cube
const cube_geo = new THREE.BoxGeometry(1, 1, 1)
const cubes = {}
const grid_size = 10
const grid_space = 1
const cube_mat = new THREE.MeshBasicMaterial({
  color: 0xffffff,
  opacity: 0.5,
  transparent: true
})
const new_cube = pos => {
  const cube = new THREE.Mesh(cube_geo, cube_mat)
  cube.position.copy(pos).multiplyScalar(grid_space)
  scene.add(cube)
  cubes[pos.z + '' + pos.y + '' + pos.x] = cube
}
const get_cube = pos => {
  return cubes[
    Math.round(pos.z) + '' +
    Math.round(pos.y) + '' +
    Math.round(pos.x)
  ]
}
const show_cube = (x, y, z) => {
  const cube = get_cube(new Vector3(x, y, z))
  if (cube) cube.visible = true
}
const grid_loop = f => {
  for (let z = -grid_size/2; z <= grid_size/2; z++)
    for (let y = -grid_size/2; y <= grid_size/2; y++)
      for (let x = -grid_size / 2; x <= grid_size / 2; x++)
        f(new Vector3(x, y, z))
}
grid_loop(new_cube)
camera.position.set(grid_size/2, grid_size/2, grid_size/2)

// Line
const start_point = new Vector3( grid_size/2, -grid_size/2, -grid_size/2)
const end_point   = new Vector3(-grid_size/2,  grid_size/3,  grid_size/2)
const start_point_color = new Color(0x0000ff)
const end_point_color   = new Color(0x00ff00)
const line_mat = new THREE.LineBasicMaterial({
  vertexColors: true,
  // scale: 4,
  // dashSize: 1,
  // gapSize: 1
})
const line_geo = new THREE.BufferGeometry()
  .setFromPoints([start_point, end_point])
  .setAttribute("color", new THREE.Float32BufferAttribute([
    start_point_color.r, start_point_color.g, start_point_color.b,
    end_point_color.r,   end_point_color.g,   end_point_color.b
  ], 3))
const line = new THREE.Line(line_geo, line_mat)
line.computeLineDistances()
scene.add(line)

// GUI
const start_point_folder = gui.addFolder('Start point')
start_point_folder.add(start_point, 'x', -grid_size/2, grid_size/2, 1)
start_point_folder.add(start_point, 'y', -grid_size/2, grid_size/2, 1)
start_point_folder.add(start_point, 'z', -grid_size/2, grid_size/2, 1)
start_point_folder.open()
const end_point_folder = gui.addFolder('End point')
end_point_folder.add(end_point, 'x', -grid_size/2, grid_size/2, 1)
end_point_folder.add(end_point, 'y', -grid_size/2, grid_size/2, 1)
end_point_folder.add(end_point, 'z', -grid_size/2, grid_size/2, 1)
end_point_folder.open()
gui.close()

// Main loop
const last_start_point = new Vector3().copy(-start_point)
const last_end_point = new Vector3().copy(-end_point)
function grid_needs_update() {
  if (
    start_point.distanceTo(last_start_point) <= 0 &&
    end_point.distanceTo(last_end_point) <= 0
  ) {
    return false
  } else {
    last_start_point.copy(start_point)
    last_end_point.copy(end_point)
    return true
  }
}
loop(_delta => {
  if (!grid_needs_update()) return;
  
  line_geo.setFromPoints([start_point, end_point])
  grid_loop(pos => get_cube(pos).visible = false)

  start_end(... start_point, ...end_point, show_cube)
})
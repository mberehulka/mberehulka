import * as _TRHEE from "../libs/three.module.js"
const { Vector3, Color, ...THREE } = _TRHEE
import { scene, loop, gui } from "./base.js"

// Cube
const cube_geo = new THREE.BoxGeometry(1, 1, 1)
const cubes = {}
const grid_size = 10
const grid_space = 1.2
const new_cube = pos => {
  const cube_mat = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    specular: 0xffffff,
    shininess: 10,
    opacity: 1,
    transparent: true
  })
  const cube = new THREE.Mesh(cube_geo, cube_mat)
  cube.position.copy(pos).multiplyScalar(grid_space)
  cube.castShadow = true
  cube.receiveShadow = true
  scene.add(cube)
  cubes[pos.z + '' + pos.y + '' + pos.x] = cube
}
const get_cube = pos => { return cubes[pos.z + '' + pos.y + '' + pos.x] }
const set_cube_visibility = (pos, v) => {
  const cube = get_cube(pos)
  cube.material.color = new Color(v ? 0x00ff00: 0xffffff)
  cube.material.opacity = v ? 1: 0.02
  cube.material.wireframe = !v
}
const grid_loop = f => {
  for (let z = -grid_size/2; z < grid_size/2; z++)
    for (let y = -grid_size/2; y < grid_size/2; y++)
      for (let x = -grid_size / 2; x < grid_size / 2; x++)
        f(new Vector3(x, y, z))
}
grid_loop(new_cube)
      
// GUI
const start_point = new Vector3()
const end_point = new Vector3()
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

// Main loop
loop(_delta => {
  grid_loop(pos => {
    set_cube_visibility(pos, pos.x == pos.y && pos.x == pos.z)
  })
})
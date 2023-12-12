import { Color, Euler, Vector3 } from "../../libs/three.module.js"
import { camera, gui_add_vector3, loop } from "../utils/boilerplate.js"
import Chunk from "../utils/voxel_chunk.js"
import Point from "../utils/point.js"
import Noise from "../utils/noise.js"
import Line from "../utils/line.js"
import start_dir_dis from "../vta/start_dir_dis.js"

const noise = new Noise()
noise.seed(Math.random() * 1000)
const noise_density = 0.1

const chunk = new Chunk()
chunk.for_each((x, y, z) => {
  const value = noise.simplex3(x * noise_density, y * noise_density, z * noise_density)
  const cube = chunk.get(x, y, z)
  cube.visible = value > 0
  cube.material.color = new Color(Math.random(), Math.random(), Math.random())
  cube.material.opacity = 0.1
  cube.material.needsUpdate = true
})
camera.position.set(chunk.size, chunk.size, chunk.size)

const camera_position = new Point(new Vector3(chunk.size, 0, 0), 0xff0000)
gui_add_vector3("Camera position", camera_position.value, -chunk.size, chunk.size, 1)
const camera_rotation = new Euler(0, Math.PI / 2, 0, "XYZ")
gui_add_vector3("Camera rotation", camera_rotation, -Math.PI, Math.PI, 0.1)
const last_camera_rotation = new Euler(1, 1, 1, "XYZ")

const width = 10
const height = 10
const fov = 90

const rays = []
for (let y = 0; y < height; y++){
  const row = []
  for (let x = 0; x < width; x++){
    row.push({
      line: new Line(camera_position.position),
      point: new Point(camera_position.position, 0xffff00, 0.25)
    })
  }
  rays.push(row)
}
function rays_loop(f) {
  for (let y = 0; y < height; y++){
    for (let x = 0; x < width; x++){
      f(rays[y][x], x, y)
    }
  }
}

loop(_delta => {
  if (
    !camera_position.update() &&
    camera_rotation.equals(last_camera_rotation)
  ) return;
  last_camera_rotation.copy(camera_rotation)

  console.log("updating")

  rays_loop((ray, rx, ry) => {
    // rx, ry => raster space, 0 < rx < width, 0 < ry < height
    
    // ndc space, 0 < v < 1
    const nx = (rx + 0.5) / width
    const ny = (ry + 0.5) / height

    const aspect_ratio = width / height
    const _fov = Math.tan(fov / 2 * Math.PI / 180)
    
    // screen space, -1 < v < 1
    const sx = (nx * 2 - 1) * _fov * aspect_ratio
    const sy = (1 - ny * 2) * _fov
    
    const origin = camera_position.value
    const direction = new Vector3(sx, sy, -1).applyEuler(camera_rotation).normalize()
    const max_distance = chunk.size * 2

    let hit_point;
    start_dir_dis(...origin, ...direction, max_distance, (x, y, z) => {
      const cube = chunk.get(x, y, z)
      if(cube && cube.visible)
        if (!hit_point) {
          hit_point = new Vector3(x, y, z)
          cube.material.opacity = 0.5
        }
    })
    if(!hit_point) hit_point = new Vector3().copy(origin).add(direction.clone().multiplyScalar(max_distance))
    
    ray.line.start.copy(origin)
    ray.line.end.copy(hit_point)
    ray.line.update()
    ray.point.set(hit_point)
  })

})
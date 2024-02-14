import { Vector3 } from "../../libs/three.module.js"
import { camera, loop } from "../utils/boilerplate.js"
import Chunk from "../utils/voxel_chunk.js"
import start_dir_dis from "./start_dir_dis.js"
import Line from "../utils/line.js"

const chunk = new Chunk()

camera.position.set(chunk.size/2, chunk.size/2, chunk.size/2)

const line = new Line(
  new Vector3(chunk.size / 2, -chunk.size / 2, -chunk.size / 2),
  new Vector3(-chunk.size / 2, chunk.size / 3, chunk.size / 2)
)
line.add_controls("Line", -chunk.size/2, chunk.size/2, 1)

loop(_delta => {
  if (!line.update()) return;
  
  chunk.for_each((x, y, z) => chunk.hide(x, y, z))

  const direction = new Vector3().copy(line.end).sub(line.start).normalize()
  const distance = new Vector3().copy(line.start).distanceTo(line.end)
  start_dir_dis(...line.start, ...direction, distance, (x, y, z) => chunk.show(x, y, z))
})
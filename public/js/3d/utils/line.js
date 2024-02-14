import * as _TRHEE from "../../libs/three.module.js"
const { Vector3, Color, ...THREE } = _TRHEE
import { gui_add_vector3, scene } from "./boilerplate.js"

export default class Line {
  geometry = new THREE.BufferGeometry()
  material = new THREE.LineBasicMaterial({ vertexColors: true })
  line = new THREE.Line(this.geometry, this.material)
  start = new Vector3()
  end = new Vector3()
  
  last_start = new Vector3()
  last_end = new Vector3()

  constructor(
    start = new Vector3(),
    end = new Vector3(),
    start_color = 0x0000ff,
    end_color = 0x00ff00
  ) {
    this.start = start
    this.end = end
    const start_point_color = new Color(start_color)
    const end_point_color = new Color(end_color)
    this.geometry
      .setFromPoints([start, end])
      .setAttribute("color", new THREE.Float32BufferAttribute([
        start_point_color.r, start_point_color.g, start_point_color.b,
        end_point_color.r,   end_point_color.g,   end_point_color.b
      ], 3))
    this.line.computeLineDistances()
    scene.add(this.line)
  }
  
  update() {
    if (
      this.start.distanceTo(this.last_start) <= 0 &&
      this.end.distanceTo(this.last_end) <= 0
    ) {
      return false
    } else {
      this.last_start.copy(this.start)
      this.last_end.copy(this.end)
      this.geometry.setFromPoints([this.start, this.end])
      this.line.computeLineDistances()
      return true
    }
  }

  add_controls(name, min, max, step) {
    gui_add_vector3(name + " start", this.start, min, max, step)
    gui_add_vector3(name + " end", this.end, min, max, step)
  }
}
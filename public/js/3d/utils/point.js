import * as _TRHEE from "../../libs/three.module.js"
const { Vector3, ...THREE } = _TRHEE
import { scene } from "./boilerplate.js"

export default class Point {
  geometry = new THREE.BufferGeometry()
  material = new THREE.PointsMaterial({
    size: 0.5,
    sizeAttenuation: true
  })
  point = new THREE.Points(this.geometry, this.material)
  value = new Vector3()
  last_value = new Vector3()

  constructor(
    value = new Vector3(),
    color = 0xffffff,
    size = this.material.size
  ) {
    this.value.copy(value)
    this.last_value.copy(value).multiplyScalar(-1)
    this.geometry.setFromPoints([value])
    this.material.color.setHex(color)
    this.material.size = size
    this.material.needsUpdate = true
    scene.add(this.point)
  }

  update() {
    if (this.value.equals(this.last_value))
      return false
    else {
      this.last_value.copy(this.value)
      this.geometry.setFromPoints([this.value])
      return true
    }
  }

  set(value) {
    this.value = value
    this.last_value = value
    this.geometry.setFromPoints([value])
  }
}
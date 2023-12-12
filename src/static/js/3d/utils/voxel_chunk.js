import * as THREE from "../../libs/three.module.js"
import { scene } from "./boilerplate.js"

const geometry = new THREE.BoxGeometry(1, 1, 1)

export default class Chunk {
  cubes = {}
  size = 10
  space = 1

  constructor(
    size = this.size,
    space = this.space
  ) {
    this.size = size
    this.space = space
    this.for_each((x, y, z) => {
      const material = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        opacity: 0.5,
        transparent: true
      })
      const cube = new THREE.Mesh(geometry, material)
      cube.position.set(x, y, z).multiplyScalar(this.space)
      scene.add(cube)
      this.cubes[z + '' + y + '' + x] = cube
    })
  }
  
  get(x, y, z) {
    return this.cubes[
      Math.round(z) + '' +
      Math.round(y) + '' +
      Math.round(x)
    ]
  }
  show(x, y, z) {
    const cube = this.get(x, y, z)
    if (cube) cube.visible = true
  }
  hide(x, y, z) {
    const cube = this.get(x, y, z)
    if (cube) cube.visible = false
  }
  for_each(f) {
    const s2 = Math.round(this.size/2)
    for (let z = -s2; z <= s2; z++)
      for (let y = -s2; y <= s2; y++)
        for (let x = -s2; x <= s2; x++)
          f(x, y, z)
  }
}
import * as THREE from "../libs/three.module.js"
import { GUI } from "../libs/dat.gui.module.js"
import { OrbitControls } from "../libs/orbit_controls.js"

// Canvas
const canvas = document.getElementById('ctx')
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: false
})
let canvas_rect = canvas.getBoundingClientRect()
function enable_shadow() {
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
}
export { canvas, enable_shadow }

// Utils
const pressed_keys = {}
window.onkeyup = e => pressed_keys[e.code] = false
window.onkeydown = e => pressed_keys[e.code] = true
const frame = {
  fps: 0,
  fps_values: [],
  fps_average: 0,
  ms: 0,
  ms_values: [],
  ms_average: 0,
  delta: 0,
  last_time: performance.now()
}
export { pressed_keys, frame }

// Scene
const scene = new THREE.Scene()
scene.add(new THREE.AmbientLight(0xffffff))
export { scene }

// Camera
const camera = new THREE.PerspectiveCamera(75, canvas.width / canvas.height, 0.1, 100)
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
controls.minDistance = 10
controls.maxDistance = 50
export { camera, controls }

// Directional light
const dir_light = new THREE.DirectionalLight(0xffffff, 2)
dir_light.position.set(10, 10, 10)
dir_light.castShadow = true
scene.add(dir_light)
function update_dir_light(size) {
  dir_light.position.set(size / 2, size / 2, size / 2)
  dir_light.shadow.mapSize.width = size * 128
  dir_light.shadow.mapSize.height = size * 128
  dir_light.shadow.camera.top = size
  dir_light.shadow.camera.bottom = - size
  dir_light.shadow.camera.left = - size
  dir_light.shadow.camera.right = size
  dir_light.shadow.camera.near = 0.1
  dir_light.shadow.camera.far = size * 2
}
update_dir_light(10)
export { dir_light, update_dir_light }

// GUI
const gui = new GUI({
  resizable: false,
  hidable: true
})
const frame_folder = gui.addFolder('Frame')
frame_folder.add(frame, "fps_average").listen()
frame_folder.add(frame, "ms_average").listen()
frame_folder.open()
export { gui }

// Resize
window.onresize = _ => {
  canvas.width = canvas.parentElement.clientWidth
  canvas_rect = canvas.getBoundingClientRect()
  const canvas_y = canvas_rect.top + window.scrollY
  renderer.setSize(canvas.width, canvas.height)
  camera.aspect = canvas.width / canvas.height
  camera.updateProjectionMatrix()
  gui.domElement.style = `
    position:absolute;
    top:${canvas_y}px;
    left:${canvas_rect.left + canvas.width - gui.domElement.getBoundingClientRect().width}px;
  `
}
window.onresize()

// Loop
function update_time() {
  const now = performance.now()
  frame.ms = now - frame.last_time
  frame.delta = frame.ms / 1000
  frame.last_time = now
  frame.fps = 1 / frame.delta

  frame.fps_values.push(frame.fps)
  if (frame.fps_values.length > 60) frame.fps_values.shift()
  frame.fps_average = frame.fps_values.reduce((a, b) => a + b, 0) / frame.fps_values.length
}
function update_ms() {
  const ms = performance.now() - frame.last_time
  frame.ms_values.push(ms)
  if (frame.ms_values.length > 60) frame.ms_values.shift()
  frame.ms_average = frame.ms_values.reduce((a, b) => a + b, 0) / frame.ms_values.length
}
function loop(update) {
  update_time()
  
  controls.update(frame.delta)
  update(frame.delta)
  renderer.render(scene, camera)

  update_ms()
	requestAnimationFrame(() => loop(update))
}
export { loop }
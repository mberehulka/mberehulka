import * as _TRHEE from "../libs/three.module.js"
const { Vector2, Vector3, Euler, ...THREE } = _TRHEE
import Stats from "../libs/stats.js"
import { GUI } from "../libs/dat.gui.module.js"

// Canvas
const canvas = document.getElementById('ctx')
const renderer = new THREE.WebGLRenderer({ canvas })
// renderer.shadowMap.enabled = true
// renderer.shadowMap.type = THREE.PCFSoftShadowMap
let canvas_rect = canvas.getBoundingClientRect()
export { canvas, renderer, canvas_rect }

// Utils
const pressed_keys = {}
window.onkeyup = e => pressed_keys[e.code] = false
window.onkeydown = e => pressed_keys[e.code] = true
const clock = new THREE.Clock()
export { pressed_keys, clock }

// Scene
const scene = new THREE.Scene()
scene.add(new THREE.AmbientLight(0xffffff))
export { scene }

// Camera
const camera = new THREE.PerspectiveCamera(75, canvas.width / canvas.height, 0.1, 1000)
camera.position.set(7, 10, 15)
camera.rotation.order = "YXZ"
const camera_movement_speed = 20
const camera_rotation_speed = 0.2
const last_mouse_position = new Vector2()
const mouse_movement_direction = new Vector2()
canvas.onmousedown = canvas.onmouseenter = canvas.onmouseover = e => {
  last_mouse_position.set(e.x, e.y)
}
canvas.onmousemove = e => {
  if (e.buttons != 1) return;
  mouse_movement_direction.set(e.x - last_mouse_position.x, e.y - last_mouse_position.y)
  last_mouse_position.set(e.x, e.y)
}
window.onmouseup = _ => {
  last_mouse_position.set(0, 0)
  mouse_movement_direction.set(0, 0)
}
camera.lookAt(0, 0, 0)
function udpate_camera_movement(delta) {
  const _camera_movement_speed = camera_movement_speed * delta
  const _camera_rotation_speed = camera_rotation_speed * delta
  
  camera.rotation.x -= mouse_movement_direction.y * _camera_rotation_speed
  camera.rotation.y -= mouse_movement_direction.x * _camera_rotation_speed
  if (pressed_keys["KeyJ"]) camera.rotation.y += _camera_rotation_speed
  if (pressed_keys["KeyL"]) camera.rotation.y -= _camera_rotation_speed
  if (pressed_keys["KeyI"]) camera.rotation.x += _camera_rotation_speed
  if (pressed_keys["KeyK"]) camera.rotation.x -= _camera_rotation_speed

  const camera_movement_rotation = new Euler(0, camera.rotation.y, 0, "YXZ");
  
  if (pressed_keys["KeyW"]) camera.position.add(new Vector3(0, 0, -_camera_movement_speed).applyEuler(camera_movement_rotation))
  if (pressed_keys["KeyS"]) camera.position.add(new Vector3(0, 0,  _camera_movement_speed).applyEuler(camera_movement_rotation))
  if (pressed_keys["KeyA"]) camera.position.add(new Vector3(-_camera_movement_speed, 0, 0).applyEuler(camera_movement_rotation))
  if (pressed_keys["KeyD"]) camera.position.add(new Vector3( _camera_movement_speed, 0, 0).applyEuler(camera_movement_rotation))
  if (pressed_keys["KeyQ"]) camera.position.add(new Vector3(0, -_camera_movement_speed, 0))
  if (pressed_keys["KeyE"]) camera.position.add(new Vector3(0,  _camera_movement_speed, 0))
}
udpate_camera_movement(0)
function update_camera(delta) {
  if (mouse_movement_direction.length() <= 0) return;
  udpate_camera_movement(delta)
}
export { camera, update_camera }

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

// Stats
const stats = new Stats()
stats.showPanel(0)
document.body.appendChild(stats.dom)
export { stats }

// GUI
const gui = new GUI({
  resizable: false,
  hidable: true,
  closeOnTop: false
})
export { gui }

// Resize
window.onresize = _ => {
  canvas.width = canvas.parentElement.clientWidth
  canvas_rect = canvas.getBoundingClientRect()
  const canvas_y = canvas_rect.top + window.scrollY
  renderer.setSize(canvas.width, canvas.height)
  camera.aspect = canvas.width / canvas.height
  camera.updateProjectionMatrix()
  stats.domElement.style = `
    position:absolute;
    top:${canvas_y}px;
    left:${canvas_rect.left}px;
  `
  gui.domElement.style = `
    position:absolute;
    top:${canvas_y}px;
    left:${canvas_rect.left + canvas.width - gui.domElement.getBoundingClientRect().width}px;
  `
}
window.onresize()

// Loop
function loop(update) {
  stats.begin()
  const delta = clock.getDelta()

  update_camera(delta)
  update(delta)
  renderer.render(scene, camera)

  stats.end()
	requestAnimationFrame(() => loop(update))
}
export { loop }
import * as _TRHEE from "./libs/three.module.js"
const { Vector2, Vector3, Quaternion, Euler, ...THREE } = _TRHEE
import Stats from "./libs/stats.js"
import { GUI } from './libs/dat.gui.module.js'

const canvas = document.getElementById('ctx')
canvas.width = canvas.parentElement.clientWidth
const renderer = new THREE.WebGLRenderer({ canvas })
renderer.setSize(canvas.width, canvas.height)
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
const canvas_rect = canvas.getBoundingClientRect()

// Utils
const pressed_keys = {}
window.onkeyup = e => pressed_keys[e.code] = false
window.onkeydown = e => pressed_keys[e.code] = true
const clock = new THREE.Clock()

// Scene
const scene = new THREE.Scene()
scene.add(new THREE.AmbientLight(0xffffff))

// Stats
const stats = new Stats()
stats.showPanel(0)
stats.domElement.style.cssText = `
  position:absolute;
  top:${canvas_rect.top}px;
  left:${canvas_rect.left}px;
`
document.body.appendChild(stats.dom)

// Camera
const camera = new THREE.PerspectiveCamera(75, canvas.width / canvas.height, 0.1, 1000)
camera.position.z = 20
const camera_movement_speed = 20
const camera_rotation_speed = 0.2 
const camera_rotation_angle = new Euler()
camera_rotation_angle.order = "YXZ"
const camera_rotation = new Quaternion()
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
function udpate_camera_movement(delta) {
  if (mouse_movement_direction.length() <= 0) return;
  const _camera_movement_speed = camera_movement_speed * delta
  const _camera_rotation_speed = camera_rotation_speed * delta
  
  camera_rotation_angle.x -= mouse_movement_direction.y * _camera_rotation_speed
  camera_rotation_angle.y -= mouse_movement_direction.x * _camera_rotation_speed
  
  if (pressed_keys["KeyJ"]) camera_rotation_angle.y += _camera_rotation_speed
  if (pressed_keys["KeyL"]) camera_rotation_angle.y -= _camera_rotation_speed
  if (pressed_keys["KeyI"]) camera_rotation_angle.x += _camera_rotation_speed
  if (pressed_keys["KeyK"]) camera_rotation_angle.x -= _camera_rotation_speed

  camera_rotation.copy(new Quaternion().setFromEuler(camera_rotation_angle, true))
  
  const camera_movement_rotation = new Quaternion().setFromEuler(new Euler(0, camera_rotation_angle.y), true);
  
  if (pressed_keys["KeyW"]) camera.position.add(new Vector3(0, 0, -_camera_movement_speed).applyQuaternion(camera_movement_rotation))
  if (pressed_keys["KeyS"]) camera.position.add(new Vector3(0, 0,  _camera_movement_speed).applyQuaternion(camera_movement_rotation))
  if (pressed_keys["KeyA"]) camera.position.add(new Vector3(-_camera_movement_speed, 0, 0).applyQuaternion(camera_movement_rotation))
  if (pressed_keys["KeyD"]) camera.position.add(new Vector3( _camera_movement_speed, 0, 0).applyQuaternion(camera_movement_rotation))
  if (pressed_keys["KeyQ"]) camera.position.add(new Vector3(0, -_camera_movement_speed, 0))
  if (pressed_keys["KeyE"]) camera.position.add(new Vector3(0,  _camera_movement_speed, 0))

  camera.setRotationFromQuaternion(camera_rotation)
}

// Cube
const cube_geo = new THREE.BoxGeometry(1, 1, 1)
const cube_mat = new THREE.MeshPhongMaterial({
  color: 0xffffff,
  specular: 0xffffff,
  flatShading: true,
  shininess: 10,
  opacity: 0.5,
  transparent: true
})
const cubes = {}
const new_cube = (id, position) => {
  const cube = new THREE.Mesh(cube_geo, cube_mat)
  Object.assign(cube.position, position)
  cube.castShadow = true
  cube.receiveShadow = true
  scene.add(cube)
  cubes[id] = cube
}
const grid_size = 10
const grid_space = 1.2
for (let z = -grid_size/2; z < grid_size/2; z++)
  for (let y = -grid_size/2; y < grid_size/2; y++)
    for (let x = -grid_size/2; x < grid_size/2; x++)
      new_cube([x, y, z], {
        x: x * grid_space,
        y: y * grid_space,
        z: z * grid_space
      })

// Directional light
const dir_light = new THREE.DirectionalLight(0xffffff, 2)
dir_light.position.set(grid_size / 2, grid_size / 2, grid_size / 2)
dir_light.castShadow = true
dir_light.shadow.mapSize.width = grid_size * 128
dir_light.shadow.mapSize.height = grid_size * 128
dir_light.shadow.camera.top = grid_size
dir_light.shadow.camera.bottom = - grid_size
dir_light.shadow.camera.left = - grid_size
dir_light.shadow.camera.right = grid_size
dir_light.shadow.camera.near = 0.1
dir_light.shadow.camera.far = grid_size * 2
dir_light.isDirectionalLight = true
scene.add(dir_light)

// GUI
const start_point = new Vector3()
const end_point = new Vector3()
const gui = new GUI()
gui.domElement.style = `
  position:absolute;
  top:${canvas_rect.top}px;
  left:${canvas_rect.left + canvas.width}px;
  transform: translateX(-100%)
`
const start_point_folder = gui.addFolder('Start point')
start_point_folder.add(start_point, 'x', -grid_size/2, grid_size/2)
start_point_folder.add(start_point, 'y', -grid_size/2, grid_size/2)
start_point_folder.add(start_point, 'z', -grid_size/2, grid_size/2)
start_point_folder.open()
const end_point_folder = gui.addFolder('End point')
end_point_folder.add(end_point, 'x', -grid_size/2, grid_size/2)
end_point_folder.add(end_point, 'y', -grid_size/2, grid_size/2)
end_point_folder.add(end_point, 'z', -grid_size/2, grid_size/2)
end_point_folder.open()

// Main loop
function update() {
  const delta = clock.getDelta()

  udpate_camera_movement(delta)

	renderer.render(scene, camera)
}
function loop() {
  stats.begin()
  update()
  stats.end()
	requestAnimationFrame(loop)
}
loop()
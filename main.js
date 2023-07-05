import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'
import fontSrc from 'three/examples/fonts/helvetiker_bold.typeface.json?url'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader'
import { Vector3 } from 'three/src/math/Vector3'

/**
 * Scene
 */
const scene = new THREE.Scene()

let font

/**
 * Cube
 */
// const material = new THREE.MeshNormalMaterial({
// 	wireframe: true,
// })

// const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5)

// const mesh = new THREE.Mesh(geometry, material)
// // scene.add(mesh)

// mesh.add(new THREE.AxesHelper(2))
// mesh.rotation.x = 2.3
// mesh.rotation.y = 0.78

/**
 * Axes Helper
 */
const axesHelper = new THREE.AxesHelper(6)
scene.add(axesHelper)

/**
 * Grid helper
 */
const gridHelper = new THREE.GridHelper(6, 6)
gridHelper.rotation.x = Math.PI * 0.5
gridHelper.position.set(3, 3, -0.01)
scene.add(gridHelper)

/**
 * render sizes
 */
const sizes = {
	width: window.innerWidth,
	height: window.innerHeight,
}
/**
 * Camera
 */
const fov = 60
const camera = new THREE.PerspectiveCamera(fov, sizes.width / sizes.height, 0.1)

camera.position.set(3, 3, 6)

/**
 * renderer
 */
const renderer = new THREE.WebGLRenderer({
	antialias: window.devicePixelRatio < 2,
	logarithmicDepthBuffer: true,
})
renderer.setSize(sizes.width, sizes.height)

const pixelRatio = Math.min(window.devicePixelRatio, 2)
renderer.setPixelRatio(pixelRatio)
document.body.appendChild(renderer.domElement)

/**
 * OrbitControls
 */
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
controls.target.set(3, 3, 3)

/**
 * frame loop
 */
function tic() {
	controls.update()

	renderer.render(scene, camera)

	requestAnimationFrame(tic)
}

requestAnimationFrame(tic)

window.addEventListener('resize', onResize)

function onResize() {
	sizes.width = window.innerWidth
	sizes.height = window.innerHeight

	camera.aspect = sizes.width / sizes.height
	camera.updateProjectionMatrix()

	renderer.setSize(sizes.width, sizes.height)

	const pixelRatio = Math.min(window.devicePixelRatio, 2)
	renderer.setPixelRatio(pixelRatio)
}

/**
 * Create the ArrowHelper for the vector
 * @param {String} name
 * @param {Vector3} v
 * @param {Vector3} origin
 * @returns
 */
function createVector(
	name,
	v = new THREE.Vector3(),
	origin = new THREE.Vector3()
) {
	const color = new THREE.Color(Math.random(), Math.random(), Math.random())

	const h = new THREE.ArrowHelper(
		v.clone().normalize(),
		origin.clone(),
		v.length(),
		color.getHex(),
		0.3,
		0.2
	)

	const textPos = v.clone().multiplyScalar(0.65).add(origin)

	createText(name, textPos, color)
	scene.add(h)

	return h
}

/**
 * Load font
 */
const loader = new FontLoader()
loader.load(fontSrc, function (res) {
	font = res

	init()
})

/**
 * create Label for the ArrowHelper
 * @param {String} text
 * @param {Vector3} position
 * @param {THREE.Color} color
 */
function createText(text, position, color) {
	const geometry = new TextGeometry(text, {
		font,
		size: 0.3,
		height: 0.05,
	})

	geometry.computeBoundingBox()

	let mesh = new THREE.Mesh(
		geometry,
		new THREE.MeshBasicMaterial({
			color: color.getHex(),
		})
	)

	console.log(geometry.boundingBox)

	mesh.position.copy(position)

	mesh.position.y += 0.2
	mesh.position.x -=
		(geometry.boundingBox.max.x - geometry.boundingBox.min.x) / 2

	scene.add(mesh)
}

function init() {
	const positionA = new THREE.Vector3(3, 1, 0)
	const s = new THREE.Vector3(1, 2, 0)

	s.multiplyScalar(2)

	console.log(s.length())

	createVector('A', positionA)
	createVector('s', s)

	const positionB = positionA.clone().add(s)

	createVector('B', positionB)

	// const normalizedB = positionB.multiplyScalar(1 / positionB.length())
	const normalizedB = positionB.normalize()
	createVector('nB', normalizedB)

	// s.negate()

	// createVector('-s', s)

	// const positionC = positionA.clone().add(s)
	// createVector('C', positionC)
}

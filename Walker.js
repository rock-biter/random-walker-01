import { gsap } from 'gsap'
import { BoxGeometry, Mesh, MeshNormalMaterial, Vector3 } from 'three'

export default class Walker {
	directions = {
		0: new Vector3(0, 1, 0),
		1: new Vector3(0, -1, 0),
		2: new Vector3(1, 0, 0),
		3: new Vector3(-1, 0, 0),
		4: new Vector3(0, 0, -1),
		5: new Vector3(0, 0, 1),
	}

	constructor(scene) {
		this.scene = scene
		this.geometry = new BoxGeometry(1, 1, 1)
		this.material = new MeshNormalMaterial({ transparent: true, opacity: 0.7 })
		this.mesh = new Mesh(this.geometry, this.material)
	}

	get position() {
		return this.mesh.position
	}

	set position(pos) {
		this.mesh.position.copy(pos)
	}

	step() {
		const pos2 = this.position.clone().add(this.direction)

		this.mesh.lookAt(pos2)
		gsap.to(this.position, {
			x: pos2.x,
			y: pos2.y,
			z: pos2.z,
			duration: 1,
		})

		setTimeout(() => {
			this.step()
		}, Math.random() * 3000 + 1000)

		return pos2
	}

	get direction() {
		// const n = Math.floor(Math.random() * 6)
		// // console.log(n)
		// return this.directions[n].clone().multiplyScalar(1 + Math.random() * 3)
		return new Vector3().randomDirection().multiplyScalar(2 + Math.random() * 5)
		// .setY(0)
	}
}

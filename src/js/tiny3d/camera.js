
class Camera {
	constructor(aspect=1, fov=45, near=.1, far=100) {
		this.fov = fov;
		this.aspect = aspect;
		this.near = near;
		this.far = far;

		this.rotate = new Vec3();
		this.position = new Vec3();
	}

	transform(transform) {
		return transform.matrix()
			.rotate(this.rotate.clone().invert())
			.translate(this.position.clone().invert());
	}

	perspective(){
		let near = this.near;
		let far = this.far;
		let f = Math.tan(Math.PI * 0.5 - 0.5 * this.fov);
		let rangeInv = 1.0 / (near - far);
		return new Mat4().multiply([
			f / this.aspect, 0, 0, 0,
			0, f, 0, 0,
			0, 0, (near + far) * rangeInv, -1,
			0, 0, near * far * rangeInv * 2, 0
		]);
	}
}

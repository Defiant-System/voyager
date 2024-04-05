
class Vec3 {
	constructor(x, y, z) {
		this.x = x || 0;
		this.y = y || 0;
		this.z = z || 0;
	}

	set(xOrVec, y, z) {
		if (xOrVec instanceof Vec3) {
			this.x = xOrVec.x;
			this.y = xOrVec.y;
			this.z = xOrVec.z;
			return this;
		}
		if (typeof xOrVec == 'number') {
			this.x = xOrVec;
		}
		if (typeof y == 'number') {
			this.y = y;
		}
		if (typeof z == 'number') {
			this.z = z;
		}
		return this;
	}

	max() {
		return Math.max(this.x, this.y, this.z);
	}

	add(vec) {
		this.x += vec.x;
		this.y += vec.y;
		this.z += vec.z;
		return this;
	}

	sub(vec) {
		this.x -= vec.x;
		this.y -= vec.y;
		this.z -= vec.z;
		return this;
	}

	distance(vec) {
		return Math.sqrt(
			(this.x - vec.x) * (this.x - vec.x) +
			(this.y - vec.y) * (this.y - vec.y) +
			(this.z - vec.z) * (this.z - vec.z)
		);
	}

	dot(vec) {
		return this.x * vec.x + this.y * vec.y + this.z * vec.z;
	}

	cross(vec) {
		let x = this.x;
		let y = this.y;
		let z = this.z;
		let vx = vec.x;
		let vy = vec.y;
		let vz = vec.z;
		this.x = y * vz - z * vy;
		this.y = z * vx - x * vz;
		this.z = x * vy - y * vx;
		return this;
	};

	length() {
		return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
	}

	scale(value) {
		this.x *= value instanceof Vec3 ? value.x : value;
		this.y *= value instanceof Vec3 ? value.y : value;
		this.z *= value instanceof Vec3 ? value.z : value;
		return this;
	}

	normalize() {
		var length = this.length();
		if (length > 0) {
			this.scale(1 / length);
		}
		return this;
	}

	clone() {
		return new Vec3(this.x, this.y, this.z);
	}

	invert() {
		this.x = -this.x;
		this.y = -this.y;
		this.z = -this.z;
		return this;
	}

	toArray() {
		return [this.x, this.y, this.z];
	}
}

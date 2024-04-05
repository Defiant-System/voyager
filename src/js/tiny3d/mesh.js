
class Face {
	constructor(v1, v2, v3) {

		this.verts = [];
		this.normal;
		this.normals = [];

		v1.addFace(this);
		v2.addFace(this);
		v3.addFace(this);
		this.verts.push(v1, v2, v3);
		this.normal = v2.clone().sub(v1).cross(v3.clone().sub(v1)).normalize();
	}

	calcNormals(angleCos) {
		this.verts.forEach((vert, i) => {
			let normal;
			vert.faces.forEach(face => {
				if (this.normal.dot(face.normal) > angleCos) {
					normal = normal ? normal.add(face.normal) : face.normal.clone();
				}
			});
			this.normals.push(normal ? normal.normalize() : this.normal);
		});
		return this;
	}

	pushVerts(data) {
		this.verts.forEach((vec) => {
			data.push(...vec.toArray());
		});
		return this;
	}

	pushNormals(data) {
		this.normals.forEach((vec) => {
			data.push(...vec.toArray());
		});
		return this;
	}
}


class Vert {
	constructor() {
		this.faces = [];
	}

	addFace(face) {
		this.faces.push(face);
		return this;
	}
}


class Mesh {
	constructor(gl, divide, path=[], smooth=0, angle=360) {
		this.verts;
		this.normals;
		this.length;

		if (divide < 2) {
			return;
		}
		if (path.length < 2) {
			path = this.sphere(path.length > 0 ? path[0] + 2 : Math.ceil(divide / 2) + 1);
		}
		const verts = this.createVerts(divide, path, 0, angle);
		const faces = this.createFaces(verts, divide, path.length / 2);
		const cos = Math.cos(smooth * RAD_SCALE);
		const vertData = [];
		const normalData = [];
		faces.forEach((face) => {
			face.calcNormals(cos)
				.pushVerts(vertData)
				.pushNormals(normalData);
		});
		this.verts = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.verts);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertData), gl.STATIC_DRAW);
		this.normals = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.normals);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normalData), gl.STATIC_DRAW);
		this.length = vertData.length / 3;
	}

	sphere(divide) {
		const path = [];
		if (divide < 3) {
			return;
		}
		let angle = Math.PI / (divide - 1);
		for (let i = 1; i < divide - 1; i++) {
			let a = angle * i;
			path.push(Math.sin(a) / 2);
			path.push(Math.cos(a) / 2);
		}
		return path;
	}

	createVerts(divide, path, start, end) {
		start *= RAD_SCALE;
		end *= RAD_SCALE;
		let verts = [];
		let angle = (end - start) / divide;
		verts.push(new Vert(0, .5, 0));
		verts.push(new Vert(0, -.5, 0));
		for (let i = 0; i < divide; i++) {
			let a = angle * i + start;
			let x = Math.cos(a);
			let z = Math.sin(a);
			for (let j = 0; j < path.length; j += 2) {
				let vert = new Vert(x, 0, z);
				vert.scale(path[j]).y = path[j + 1];
				verts.push(vert);
			}
		}
		return verts;
	}

	createFaces(verts, divide, length) {
		const faces = [];
		let index;
		for (let i = 1; i < divide; ++i) {
			index = i * length + 2;
			faces.push(new Face(verts[0], verts[index], verts[index - length]));
			faces.push(new Face(verts[1], verts[index - 1], verts[index + length - 1]));
			for (let j = 0; j < length - 1; j++) {
				let add = index + j;
				faces.push(new Face(verts[add + 1], verts[add - length], verts[add]));
				faces.push(new Face(verts[add - length + 1], verts[add - length], verts[add + 1]));
			}
		}
		faces.push(new Face(verts[0], verts[2], verts[index]));
		faces.push(new Face(verts[1], verts[index + length - 1], verts[length + 1]));
		for (let j = 0; j < length - 1; j++) {
			let add = index + j;
			faces.push(new Face(verts[j + 3], verts[add], verts[j + 2]));
			faces.push(new Face(verts[add + 1], verts[add], verts[j + 3]));
		}
		return faces;
	}
}

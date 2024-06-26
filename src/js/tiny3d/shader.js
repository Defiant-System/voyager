
class Shader {
	constructor(gl, vertexShader, fragmentShader) {
		this.gl = gl;
		this.program = gl.createProgram();
		this.indices = gl.createBuffer();
		this.attribs = {};
		this.location = {};

		let program = this.program;
		gl.attachShader(program, this.create(gl.VERTEX_SHADER, vertexShader));
		gl.attachShader(program, this.create(gl.FRAGMENT_SHADER, fragmentShader));
		gl.linkProgram(program);
		if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
			console.log(gl.getProgramInfoLog(program));
			gl.deleteProgram(program);
		}
	}

	create(type, source) {
		const gl = this.gl;
		const shader = gl.createShader(type);
		gl.shaderSource(shader, source);
		gl.compileShader(shader);
		if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
			console.log(gl.getShaderInfoLog(shader));
		}
		return shader;
	}

	attrib(name, values, size) {
		const gl = this.gl;
		if (!this.location[name]) {
			this.location[name] = gl.getAttribLocation(this.program, name);
		}
		const location = this.location[name];
		gl.bindBuffer(gl.ARRAY_BUFFER, values);
		gl.enableVertexAttribArray(location);
		gl.vertexAttribPointer(location, size, gl.FLOAT, false, 0, 0);
		return this;
	}

	uniform(name, value) {
		const gl = this.gl;
		if (!this.location[name]) {
			this.location[name] = gl.getUniformLocation(this.program, name);
		}
		const location = this.location[name];
		if (typeof value == "number") {
			gl.uniform1f(location, value);
			return this;
		}
		switch (value.length) {
			case 2: gl.uniform2fv(location, value); break;
			case 3: gl.uniform3fv(location, value); break;
			case 4: gl.uniform4fv(location, value); break;
			case 9: gl.uniformMatrix3fv(location, false, value); break;
			case 16: gl.uniformMatrix4fv(location, false, value); break;
		}
		return this;
	}
}

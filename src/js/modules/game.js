
let Game = {
	init() {
		this.cvs = window.find(".game-view canvas");
		// this.ctx = this.cvs[0].getContext("2d");

		let { width, height } = this.cvs.parent().offset();
		this.cvs.attr({ width, height });

		// set viewport
		gl.viewport(0, 0, width, height);
		gl.clearColor(0, 0, 0, 0);
		gl.enable(gl.CULL_FACE);
		gl.enable(gl.DEPTH_TEST);

		camera.aspect = width / height;
		camera.rotate.x = -.7;
		camera.position.set(0, 0, 1.2);

		hero.init();
		hero.transform.rotate.set(10, 22, 30);
		this.render(hero);
		this.render(hero, .02);

		camera.position.set(0, .5, 5);

		let that = this;
		this.fpsControl = karaqu.FpsControl({
			fps: 1,
			autoplay: true,
			callback() {
				that.update();
			}
		});
	},
	update() {
		gl.clear(gl.COLOR_BUFFER_BIT);

		hero.mesh = mesh.hero[0];
		hero.preview();
		this.render(hero);
		this.render(hero, .01);


		// let now = new Date().getTime();
		// if (now - time > 30) scene.update();
		// time = now;
		// scene.update();
		// this.render(scene);
		// this.render(scene, .01);
	},
	render(item, stroke=0) {
		item.childs.forEach(child => this.render(child, stroke));
		if (!item.active || !item.mesh) return;

		let invert = item.transform.matrix().invert();
		if (!invert) return;
		
		gl.cullFace(stroke > 0 ? gl.FRONT : gl.BACK);
		gl.useProgram(shader.program);
		shader.attrib("aPos", item.mesh.verts, 3)
			.attrib("aNorm", item.mesh.normals, 3)
			.uniform("uWorld", camera.transform(item.transform).data)
			.uniform("uProj", camera.perspective().data)
			.uniform("uInverse", invert)
			.uniform("uColor", stroke ? [0, 0, 0, 1] : item.color)
			.uniform("uLight", light.clone().sub(camera.position).toArray())
			.uniform("uStroke", stroke + item.stroke);
		gl.drawArrays(gl.TRIANGLES, 0, item.mesh.length);
	}
};

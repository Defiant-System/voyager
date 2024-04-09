
let Game = {
	init() {
		// fast references
		this.els = {
			content: window.find("content"),
			hudScore: window.find(".hud .score span"),
			hudTokens: window.find(".hud .tokens span"),
			countdown: window.find(".countdown-view"),
		};

		// init GL
		gl.clearColor(0, 0, 0, 0);
		gl.enable(gl.CULL_FACE);
		gl.enable(gl.DEPTH_TEST);
		gl.viewport(0, 0, width, height);

		// camera & set viewport
		camera.rotate.x = -.45;
		camera.aspect = width / height;

		// our hero
		hero.init();
		hero.transform.rotate.set(10, 22, 30);

		// setup scene
		this.scene = new Scene(hero, factory, map);
		this.time = Date.now();

		// temp
		// let token = new Token(mesh.token, COLOR.YELLOW, [,1,,90,,,.5,.1,.5]);
		// token.transform.translate.set(0, 1, 0);
		// token.transform.rotate.y += 180;
		// this.render(token);


		// FPS controller
		let that = this;
		this.fpsControl = karaqu.FpsControl({
			fps: 30,
			// autoplay: true,
			callback() { that.update(); }
		});
	},
	setState(state) {
		// save state
		this.state = state;
		// update UI
		this.els.content.data({ show: state });

		switch (state) {
			case "countdown":
				this.els.content.addClass("countdown");
				this.els.countdown.cssSequence("start", "transitionend", el => {
					// reset countdown element
					el.removeClass("start");
					// update game state
					this.setState("play");
				});
				break;
			case "start":
				camera.position.set(0, -1, 5);
				this.fpsControl.start();
				break;
			case "play":
				// change camera position
				camera.position.set(0, .65, 3);
				// update game state
				this.fpsControl.start();
				break;
			case "pause":
				this.fpsControl.stop();
				break;
			case "over":
				this.fpsControl.stop();
				break;
		}
	},
	update() {
		// reset GL view
		gl.clear(gl.COLOR_BUFFER_BIT);

		switch (this.state) {
			case "start":
				// update hero
				hero.mesh = mesh.hero[2];
				hero.preview();
				this.render(hero);
				this.render(hero, .01);
				break;
			case "play":
				let now = Date.now();
				if (now - this.time > 30) this.scene.update();
				this.time = now;

				this.scene.update();
				this.render(this.scene);
				this.render(this.scene, .01);
				break;
		}
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

		if (this.scene.ended()) {
			this.setState("over");
		}
	}
};

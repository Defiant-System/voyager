
let Game = {
	init() {
		// fast references
		this.els = {
			content: window.find("content"),
			hudScore: window.find(".hud .score span"),
			hudTokens: window.find(".hud .tokens span"),
			countdown: window.find(".countdown-view"),
			over: window.find(".over-view"),
		};

		// init GL
		gl.clearColor(0, 0, 0, 0);
		gl.enable(gl.CULL_FACE);
		gl.enable(gl.DEPTH_TEST);
		gl.viewport(0, 0, width, height);

		// camera & set viewport
		camera.aspect = width / height;

		// setup start reel
		this.reel = new Reel();

		// setup scene
		this.scene = new Scene(factory, map);
		this.time = Date.now();

		// temp
		this.scene.update();
		this.render(this.scene);
		
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
				// reset game over view
				this.els.over.removeClass("congrats");

				camera.rotate.x = -.215;
				camera.position.set(0, -1.5, 7);
				this.fpsControl.start();
				break;
			case "play":
				// change camera position
				camera.rotate.x = -.45;
				camera.position.set(0, .65, 3);
				// set game "hero"
				this.scene.hero.mesh = mesh.hero[this.reel.active];
				// update game state
				this.fpsControl.start();
				break;
			case "pause":
				this.fpsControl.stop();
				requestAnimationFrame(() => {
					this.render(this.scene);
					this.render(this.scene, .01);
				});
				break;
			case "over":
				this.fpsControl.stop();

				let score = +this.els.hudScore.text();
				if (score > voyager.settings["best-score"]) {
					this.els.over.find("h3 span").text(score);
					this.els.over.addClass("congrats");
				}
				voyager.settings["best-score"] = score;
				break;
		}
	},
	update() {
		// reset GL view
		gl.clear(gl.COLOR_BUFFER_BIT);

		switch (this.state) {
			case "start":
				// update reel
				this.reel.update();
				this.render(this.reel);
				this.render(this.reel, .01);
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

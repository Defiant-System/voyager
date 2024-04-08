
@import "./tiny3d/vec3.js"
@import "./tiny3d/transform.js"
@import "./tiny3d/mesh.js"
@import "./tiny3d/shader.js"
@import "./tiny3d/mat4.js"
@import "./tiny3d/item.js"
@import "./tiny3d/collider.js"
@import "./tiny3d/camera.js"

@import "./classes/token.js"
@import "./classes/scene.js"
// @impor1t "./classes/task.js"
// @impo1rt "./classes/menu.js"
@import "./classes/platform.js"
@import "./classes/hero.js"
@import "./classes/map.js"
@import "./classes/enemy.js"
// @imp1ort "./classes/event.js"

@import "./modules/variables.js"
@import "./modules/bg.js"
@import "./modules/game.js"
@import "./modules/test.js"


const voyager = {
	init() {
		// fast references
		this.content = window.find("content");

		// init objects
		Bg.init();
		Game.init();

		// Game.setState("start");

		// DEV-ONLY-START
		Test.init(this);
		// DEV-ONLY-END
	},
	dispatch(event) {
		switch (event.type) {
			// system events
			case "window.init":
				break;
			case "window.keydown":
				// console.log(event);
				switch (event.char) {
					case "w":
					case "up":    Game.scene.hero.jump(); break;
					case "s":
					case "down":  Game.scene.hero.dash(); break;
					case "a":
					case "left":  Game.scene.hero.left(); break;
					case "d":
					case "right": Game.scene.hero.right(); break;
					case "space":
						Game.scene.hero.boost();
						break;
					case "esc":
						Game.setState("play");
						break;
					case "p":
						if (Game.state === "play") Game.setState("pause");
						break;
				}
				break;
			// custom events
			case "open-help":
				karaqu.shell("fs -u '~/help/index.md'");
				break;
		}
	}
};

window.exports = voyager;

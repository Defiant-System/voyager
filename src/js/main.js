
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
@import "./classes/task.js"
@import "./classes/menu.js"
@import "./classes/platform.js"
@import "./classes/hero.js"
@import "./classes/map.js"
@import "./classes/enemy.js"
@import "./classes/event.js"

@import "./modules/variables.js"
@import "./modules/game.js"
@import "./modules/test.js"


const voyager = {
	init() {
		// fast references
		this.content = window.find("content");

		// init objects
		Game.init();

		// DEV-ONLY-START
		Test.init(this);
		// DEV-ONLY-END
	},
	dispatch(event) {
		switch (event.type) {
			// system events
			case "window.init":
				break;
			// custom events
			case "open-help":
				karaqu.shell("fs -u '~/help/index.md'");
				break;
		}
	}
};

window.exports = voyager;

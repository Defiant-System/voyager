
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


// default settings
const defaultSettings = {
	"music": "off",
	"sound-fx": "on",
	"best-score": 0,
};


const voyager = {
	init() {
		// fast references
		this.content = window.find("content");
		
		// get settings, if any
		this.settings = window.settings.getItem("settings") || defaultSettings;
		// apply settings
		this.dispatch({ type: "apply-settings" });

		// init objects
		Bg.init();
		Game.init();

		Game.setState("start");

		// DEV-ONLY-START
		Test.init(this);
		// DEV-ONLY-END
	},
	dispatch(event) {
		let Self = voyager,
			name,
			value;
		// console.log(event);
		switch (event.type) {
			// system events
			case "window.init":
				break;
			case "window.close":
				// save settings
				// window.settings.setItem("settings", Self.settings);
				break;
			case "window.keydown":
				// console.log(event);
				switch (event.char) {
					case "w":
					case "up":
						if (Game.state === "play") Game.scene.hero.jump();
						break;
					case "s":
					case "down":
						if (Game.state === "play") Game.scene.hero.dash();
						break;
					case "a":
					case "left":
						if (Game.state === "play") Game.scene.hero.left();
						break;
					case "d":
					case "right":
						if (Game.state === "play") Game.scene.hero.right();
						break;
					case "space":
						if (Game.state === "play") Game.scene.hero.boost();
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
			case "apply-settings":
				// apply settings
				for (name in Self.settings) {
					value = Self.settings[name];
					// update menu
					window.bluePrint.selectNodes(`//Menu[@check-group="${name}"]`).map(xMenu => {
						let xArg = xMenu.getAttribute("arg");
						xMenu.removeAttribute("is-checked");
						if (xArg == value) {
							// update menu item
							xMenu.setAttribute("is-checked", 1);
							// call dispatch
							let type = xMenu.getAttribute("click");
							Self.dispatch({ type, arg: value});
						}
					});
				}
				break;
			case "toggle-music":
			case "toggle-fx":
			case "goto-start":
				console.log(event);
				break;
			case "open-help":
				karaqu.shell("fs -u '~/help/index.md'");
				break;
		}
	}
};

window.exports = voyager;

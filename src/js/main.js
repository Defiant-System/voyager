
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
@import "./classes/reel.js"
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
		// get settings, if any
		this.settings = window.settings.getItem("settings") || defaultSettings;
		// apply settings
		this.dispatch({ type: "apply-settings" });

		// init objects
		Bg.init();
		Game.init();

		// set game state
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
						value = Game.state === "play" ? "start" : "play";
						Game.setState(value);
						break;
					case "p":
						if (["play", "pause"].includes(Game.state)) {
							value = Game.state === "play" ? "pause" : "play";
							Game.setState(value);
						}
						break;
				}
				break;
			// gamepad support
			case "gamepad.down":
				switch (event.button) {
					case "b9": Self.dispatch({ type: "window.keydown", char: "p" }); break;
					case "b12": Self.dispatch({ type: "window.keydown", char: "up" }); break;
					case "b15": Self.dispatch({ type: "window.keydown", char: "left" }); break;
					case "b13": Self.dispatch({ type: "window.keydown", char: "down" }); break;
					case "b14": Self.dispatch({ type: "window.keydown", char: "right" }); break;
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
			case "reel-prev":
			case "reel-next":
				Game.reel.go(event.type.split("-")[1]);
				break;
			case "toggle-music":
			case "toggle-fx":
				console.log(event);
				break;
			case "goto-start":
				Game.setState("start");
				break;
			case "open-help":
				karaqu.shell("fs -u '~/help/index.md'");
				break;
		}
	}
};

window.exports = voyager;

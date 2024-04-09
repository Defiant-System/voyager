
const RAD_SCALE = Math.PI / 180;

const COLOR = {
		WHITE:  [1, 1, 1, 10],
		GRAY:  [.5, .5, .5, 10],
		PINK: [1, .3, 1, 30],
		BLUE: [.3, .3, 1, 30],
		YELLOW: [1, 1, .3, 30],
		RED: [1, .3, .3, 0],
		CYAN: [.3, 1, 1, 30]
	};


const Shaders = {
		Fragment: { tiny: `@import "../shaders/tiny.frag"` },
		Vertex: { tiny: `@import "../shaders/tiny.vert"` }
	};


const Rand = {
		seed: Math.random(),
		get(max=1, min=0, round=true) {
			if (max <= min) return max;
			this.seed = (this.seed * 9301 + 49297) % 233280;
			let value = min + (this.seed / 233280) * (max - min);
			return round ? Math.round(value) : value;
		}
	};


let cvs = window.find(".game-view .gl-cvs"),
	{ width, height } = cvs.parent().offset(),
	gl = cvs[0].getContext("webgl"),
	running = false,
	light = new Vec3(5, 15, 7),
	camera = new Camera(width / height),
	shader = new Shader(gl, Shaders.Vertex.tiny, Shaders.Fragment.tiny),
	mesh = {
		hero: [
			new Mesh(gl, 10),
			new Mesh(gl, 10, [.5, .15, .5, .1, .5, -.1, .5, -.15]),
			new Mesh(gl, 10, [.2, .5, .48, .2, .5, .1, .2, .1, .2, -.1, .5, -.1, .48, -.2, .2, -.5]),
			new Mesh(gl, 10, [.3, .44, .43, .3, .45, .2, .49, .2, .5, .1, .45, .1, .45, -.1, .5, -.1, .49, -.2, .45, -.2, .43, -.3, .3, -.44]),
		],
		block: new Mesh(gl, 4, [.55, .5, .65, .4, .65, -.4, .55, -.5]),
		fence: new Mesh(gl, 12, [.4, .5, .5, .4, .5, -.4, .4, -.5], 40),
		token: new Mesh(gl, 9, [.45, .3, .45, .5, .5, .5, .5, -.5, .45, -.5, .45, -.3], 30),
		enemy: new Mesh(gl, 6),
	};

let factory = () => {
		let platform = new Platform(),
			block = new Item(mesh.block, COLOR.BLUE, [,,,,45]),
			enemy = new Enemy(mesh.enemy, COLOR.CYAN, [,1,,,,,.7,.7,.7]),
			token = new Token(mesh.token, COLOR.YELLOW, [,1,,90,,,.5,.1,.5]),
			fence = new Item(mesh.fence, COLOR.RED, [,1.4,,,,,.8,1,.8]);
		block.collider = new Box(block.transform);
		enemy.collider = new Sphere(enemy.transform);
		token.collider = new Sphere(token.transform);
		fence.collider = new Box(fence.transform);
		platform.block = block;
		platform.token = token;
		platform.fence = fence;
		platform.enemy = enemy;
		return platform.add(block).add(token).add(fence).add(enemy);
	},
	map = new Map(
		"311737173711|4111|5711|3111|"+
		"211135012111|2111|301531513510|"+
		"311119973111|5111111d|311120003115|"+
		"551111dd|305130053051|3111139b3511|"+
		"211130002115|401510004510"
	);

// canvas dim
cvs.attr({ width, height });

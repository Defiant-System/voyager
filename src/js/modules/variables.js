
const RAD_SCALE = Math.PI / 180;

const COLOR = {
	WHITE:  [1, 1, 1, 10],
	PINK: [1, .3, 1, 30],
	BLUE: [.3, .3, 1, 30],
	YELLOW: [1, 1, .3, 30],
	RED: [1, .3, .3, 0],
	CYAN: [.3, 1, 1, 30]
};


const Shaders = {
	Fragment: {
		tiny: `@import "../shaders/tiny.frag"`,
	},
	Vertex: {
		tiny: `@import "../shaders/tiny.vert"`,
	}
};


class Rand {
	static seed = Math.random()

	get(max=1, min=0, round=true) {
		if (max <= min) {
			return max;
		}
		Rand.seed = (Rand.seed * 9301 + 49297) % 233280;
		let value = min + (Rand.seed / 233280) * (max - min);
		return round ? Math.round(value) : value;
	}

}

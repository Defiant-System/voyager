
class Sound {
	constructor(type, curve, length) {
		this.type = type;
		this.curve = Float32Array.from(curve);
		this.length = length;
	}

	getTime(max) {
		return (max < this.length ? max : this.length) - .01;
	}
}


let Sfx = {
	async init() {
		this.out = new AudioContext();
		this.gains = {};
		this.buffers = {};
		this.bitrate = 44100;

		// prepare sound effects
		await Promise.all([
			this.sound("exp", new Sound("custom", [5, 1, 0], 1), [220, 0], 1),
			this.sound("hit", new Sound("custom", [3, 1, 0], 1), [1760, 0], .3),
			this.sound("power", new Sound("square", [.5, .1, 0], 1), [440, 880, 440, 880, 440, 880, 440, 880], .3),
			this.sound("jump", new Sound("triangle", [.5, .1, 0], 1), [220, 880], .3),
			this.sound("coin", new Sound("square", [.2, .1, 0], .2), [1760, 1760], .2),
			this.sound("move", new Sound("custom", [.1, .5, 0], .3), [1760, 440], .3),
		]);

		// this noise
		this.noise = this.out.createBuffer(1, this.bitrate * 2, this.bitrate);
	},
	async sound(id, sound, freq, time) {
		let ctx = new OfflineAudioContext(1, this.bitrate * time, this.bitrate);
		let vol = ctx.createGain();
		let curve = Float32Array.from(freq);
		vol.connect(ctx.destination);
		
		if (sound.curve) {
			vol.gain.setValueCurveAtTime(sound.curve, 0, sound.getTime(time));
		}
		
		ctx.addEventListener("complete", e => this.buffers[id] = e.renderedBuffer);
		
		if (sound.type == "custom") {
			let filter = ctx.createBiquadFilter();
			filter.connect(vol);
			filter.detune.setValueCurveAtTime(curve, 0, time);
			let src = ctx.createBufferSource();
			src.buffer = this.noise;
			src.loop = true;
			src.connect(filter);
			src.start();
		} else {
			let osc = ctx.createOscillator();
			osc.type = sound.type;
			osc.frequency.setValueCurveAtTime(curve, 0, time);
			osc.connect(vol);
			osc.start();
			osc.stop(time);
		}
		await ctx.startRendering();
	},
	mixer(id) {
		if (!(id in this.gains)) {
			this.gains[id] = this.out.createGain();
			this.gains[id].connect(this.out.destination);
		}
		return this.gains[id];
	},
	play(id, loop, mixerId="master") {
		if (id in this.buffers) {
			let src = this.out.createBufferSource();
			src.loop = loop;
			src.buffer = this.buffers[id];
			src.connect(this.mixer(mixerId));
			src.start();

			return src;
		}
		return null;
	}
}

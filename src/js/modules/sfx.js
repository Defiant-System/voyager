
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


class Channel {
	constructor(inst, notes, tempo) {
		this.inst = inst;
		this.size = 0;
		this.length = 0;
		this.data = [];
		this.freq = [];
		this.keys = { c: 0, db: 1, d: 2, eb: 3, e: 4, f: 5, gb: 6, g: 7, ab: 8, a: 9, bb: 10, b: 11 };

		let a = Math.pow(2, 1 / 12);
		for (let n = -57; n < 50; n++) {
			this.freq.push(Math.pow(a, n) * 440);
		}
		
		let sheet = notes.split("|");
		if (sheet.length > 1) {
			notes = "";
			for (let i = 0; i < sheet.length; i++) {
				notes += i % 2
					? ("," + sheet[i-1]).repeat(parseInt(sheet[i]) - 1)
					: (notes ? "," : "") + sheet[i];
			}
		}
		notes.split(",").forEach((code) => {
			let div = code.match(/^(\d+)/),
				freqs = code.match(/([a-z]+\d+)/g);
			if (div) {
				let time = tempo / parseInt(div[1]),
					row = [time];
				this.length += time;
				if (freqs) {
					if (freqs.length > this.size) {
						this.size = freqs.length;
					}
					for (let i = 0; i < freqs.length; i++) {
						let note = freqs[i].match(/([a-z]+)(\d+)/);
						if (note) {
							row.push(this.freq[parseInt(note[2]) * 12 + this.keys[note[1]]]);
						}
					}
				}
				this.data.push(row);
			}
		});
	}

	play(ctx) {
		let length = 0;
		let inst = this.inst;
		let vol = ctx.createGain();
		let osc = [];
		vol.connect(ctx.destination);
		for (let i=0; i<this.size; i++) {
			osc[i] = ctx.createOscillator();
			osc[i].type = inst.type;
			osc[i].connect(vol);
		}
		this.data.forEach(note => {
			if (inst.curve) {
				vol.gain.setValueCurveAtTime(inst.curve, length, inst.getTime(note[0]));
			}
			osc.forEach((o, i) => {
				o.frequency.setValueAtTime(note[i + 1] || 0, length);
			});
			length += note[0];
		});
		osc.forEach(o => {
			o.start();
			o.stop(length);
		});
	}
}


let Sfx = {
	async init() {
		this.out = new AudioContext();
		this.gains = {};
		this.buffers = {};
		this.bitrate = 44100;
		this.volume = .1;
		// this noise
		this.noise = this.out.createBuffer(1, this.bitrate * 2, this.bitrate);

		let output = this.noise.getChannelData(0);
		for (let i = 0; i<this.bitrate * 2; i++) {
			output[i] = Math.random() * 2 - 1;
		}
		
		// prepare sound effects
		await Promise.all([
			this.sound("exp", new Sound("custom", [5, 1, 0], 1), [220, 0], 1),
			this.sound("hit", new Sound("custom", [3, 1, 0], 1), [1760, 0], .3),
			this.sound("power", new Sound("square", [.5, .1, 0], 1), [440, 880, 440, 880, 440, 880, 440, 880], .3),
			this.sound("jump", new Sound("triangle", [.5, .1, 0], 1), [220, 880], .3),
			this.sound("coin", new Sound("square", [.2, .1, 0], .2), [1760, 1760], .2),
			this.sound("move", new Sound("custom", [.1, .5, 0], .3), [1760, 440], .3),
			this.music("music", [
				new Channel(new Sound("sawtooth", [1, .3], .2), "8a2,8a2,8b2,8c3|8|8g2,8g2,8a2,8b2|8|8e2,8e2,8f2,8g2|4|8g2,8g2,8a2,8b2|4|".repeat(4), 1),
				new Channel(new Sound("sawtooth", [.5, .5], 1), "1a3,1g3,2e3,4b3,4c4,1a3c3e3,1g3b3d4,2e3g3b3,4d3g3b3,4g3c4e4|1|" + "8a3,8a3e4,8a3d4,8a3e4|2|8g3,8g3d4,8g3c4,8g3d4|2|8e3,8e3a3,8e3b3,8e3a3,4g3b3,4g3c4|1|".repeat(2), 4),
			])
		]);
	},
	start() {
		let music = this.play("music", true, "music"),
			mixer = this.mixer("music"),
			time = mixer.context.currentTime;
		mixer.gain.setValueAtTime(this.volume, time);
		// save reference
		this.music = music;
		// return object
		return this;
	},
	vol(v) {
		this.volume = v;
		let mixer = this.mixer("music");
		if (mixer) {
			let time = mixer.context.currentTime;
			mixer.gain.setValueAtTime(this.volume, time);
		}
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
		
		if (sound.type === "custom") {
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
	async music(id, channels) {
		let length = channels.reduce((length, channel) => channel.length > length ? channel.length : length, 0);
		let ctx = new OfflineAudioContext(1, this.bitrate * length, this.bitrate);
		
		ctx.addEventListener("complete", e => this.buffers[id] = e.renderedBuffer);
		channels.forEach((channel, i) => channel.play(ctx));
		await ctx.startRendering();
	},
	mixer(id) {
		if (!this.gains) return;
		if (!(id in this.gains)) {
			this.gains[id] = this.out.createGain();
			this.gains[id].connect(this.out.destination);
		}
		return this.gains[id];
	},
	play(id, loop, mixerId="master") {
		if (this.volume <= 0) return;

		if (id in this.buffers) {
			// console.log(id, this.buffers[id]);
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

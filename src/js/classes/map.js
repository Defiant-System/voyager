
class Map {
	constructor(config, length=7, steps=150) {
		this.config = config.split("|");
		this.length = length;
		this.steps = steps;
	}

	init() {
		this.row = [1, 1, 1];
		this.count = 10;
		this.data = [];
		this.step = 0;
		this.min = 0;
		this.update();
	}

	max() {
		let max = this.min + this.length,
			length = this.config.length;
		return max < length ? max : length - 1;
	}

	update() {
		let next = false;
		if (++this.step > this.steps) {
			next = true;
			this.step = 0;
			if (this.min + this.length < this.config.length - 1) {
				this.min++;
			}
		}
		if (--this.count > 0) {
			return next;
		}
		if (!this.data.length) {
			this.mirror = Rand.get() > .5;
			let index = Rand.get(this.max(), this.min, true);
			this.data = this.config[index].match(/.{1,4}/g);
		}
		this.row = this.data.shift().split("").map(c => parseInt(c, 36));
		this.count = this.row.shift();
		if (this.mirror) {
			this.row.reverse();
		}
		return next;
	}
}

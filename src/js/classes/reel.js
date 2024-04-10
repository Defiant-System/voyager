
class Reel extends Item {
	constructor() {
		super();

		// active hero index
		this.active = 0;

		let pos = [
			[0, 0, 2],
			[2, 0, 0],
			[0, 0, -2],
			[-2, 0, 0],
		];

		mesh.hero.map((m, i) => {
			let c = i === 0 ? COLOR.CYAN : COLOR.GRAY,
				hero = new Hero(m, c);
			hero.init();
			hero.transform.translate.set(...pos[i]);
			hero.transform.rotate.set(10, 22, 30);
			// add as child to reel
			this.add(hero);
		});
	}

	go(which) {
		// exit if animating
		if (this.anim) return;

		let time = Date.now(),
			duration = 1000,
			start = this.transform.rotate.y,
			end = start + (which === "next" ? -90 : 90),
			index = this.active + (which === "next" ? 1 : -1);
		// make sure of index limits
		if (index < 0) index = this.childs.length - 1;
		if (index > this.childs.length - 1) index = 0;
		// dim down
		this.childs[this.active].color = COLOR.GRAY;
		// rotation animation
		this.anim = { time, duration, start, end, index };
	}

	update() {
		if (this.anim) {
			let t = Date.now() - this.anim.time,
				d = this.anim.duration,
				w = Math.tween.easeInOut(t, 0, 1, d),
				v = Math.lerp(this.anim.start, this.anim.end, w);
			// check value
			if (t >= d) {
				// change active hero index
				this.active = this.anim.index;
				// light up
				this.childs[this.active].color = COLOR.CYAN;
				// reset value
				v = this.anim.end;
				delete this.anim;
			}
			this.transform.rotate.y = v;
		} else {
			this.childs[this.active].preview();
		}
	}
}


class Reel extends Item {
	constructor() {
		super();

		let pos = [
			[0, 0, 2],
			[-2, 0, 0],
			[2, 0, 0],
			[0, 0, -2],
		];

		mesh.hero.map((m, i) => {
			let c = i === 0 ? COLOR.WHITE : COLOR.GRAY,
				hero = new Hero(m, c);
			hero.init();
			hero.transform.translate.set(...pos[i]);
			hero.transform.rotate.set(10, 22, 30);
			// add as child to reel
			this.add(hero);
		});
	}

	go(which) {
		let time = Date.now(),
			start = this.transform.rotate.y,
			end = start + (which === "next" ? 90 : -90),
			duration = 1000;
		console.log({ time, duration, start, end });
		this.anim = { time, duration, start, end };
	}

	update() {
		if (this.anim) {
			let t = Date.now() - this.anim.time,
				b = this.anim.start,
				c = this.anim.end,
				d = this.anim.duration,
				value = Math.floor(Math.tween.easeInOut(t, b, c, d));
			
			if (value >= this.anim.end) {
				value = this.anim.end;
				delete this.anim;
			}

			this.transform.rotate.y = value;
		} else {
			this.childs[0].preview();
		}

		// this.childs.map(e => e.preview());
	}
}

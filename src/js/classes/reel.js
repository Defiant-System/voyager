
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
		this.transform.rotate.y = 15;
	}

	update() {
		this.childs[0].preview();

		// this.childs.map(e => e.preview());
	}
}

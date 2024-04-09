
class Reel extends Item {
	constructor() {
		super();

		let pos = [
			[0, 0, 0],
			[-2.25, -.65, -3],
			[2.25, -.65, -3],
			[0, -1, -5],
		];

		mesh.hero.map((m, i) => {
			let c = i === 0 ? COLOR.WHITE : COLOR.GRAY,
				hero = new Hero(m, c);
			hero.init();
			hero.transform.translate.set(...pos[i]);
			hero.transform.rotate.set(10, 22, 30);

			this.add(hero);
		});

	}

	update() {
		// this.hero.update();
		this.childs[0].preview();
		// this.render(this.hero);
		// this.render(this.hero, .01);
	}
}

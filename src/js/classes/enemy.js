
class Enemy extends Item {
	init(active) {
		this.active = active;
		this.stroke = 0;
		this.explode = 0;
		this.transform.rotate.set(0, 0, 0);
		this.transform.translate.set(0, 1, 0);
	}

	update(speed, end) {
		if (!this.active) return;
		
		this.stroke += (this.explode - this.stroke) / 25;
		if (this.stroke) return;
		
		let pos = this.transform.translate,
			rotate = this.transform.rotate;
		pos.z = end ? 0 : pos.z + speed / 2;
		rotate.z = (rotate.z + 5) % 360;
		rotate.x = (rotate.x + 3) % 360;
	}

	intersect(hero) {
		if (this.active && !this.explode && !hero.explode && this.collider.intersect(hero.collider)) {
			if (hero.speedTime) {
				this.explode = 7;
				// Event.trigger("hit", hero);
				return;
			}
			hero.explode = 7;
			// Event.trigger("exp", hero);
		}
	}
}

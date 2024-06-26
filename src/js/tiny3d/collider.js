
class Collider {
	constructor(transform, scale) {
		this.transform = transform;
		this.scale = transform.scale;
	}

	getTranslate() {
		let translate = this.transform.translate.clone(),
			parent = this.transform.parent;
		while (parent) {
			translate.scale(parent.scale).add(parent.translate);
			parent = parent.parent;
		}
		return translate;
	}

	getScale() {
		let scale = this.scale.clone().scale(.5),
			parent = this.transform.parent;
		while (parent) {
			scale.scale(parent.scale);
			parent = parent.parent;
		}
		return scale;
	}

	// intersect(other: Sphere);
}

class Sphere extends Collider {
	intersect(other) {
		let collide = null,
			translate = this.getTranslate(),
			otherTranslate = other.getTranslate(),
			distance = translate.distance(otherTranslate),
			minDistance = this.getScale().max() + other.getScale().max();
		if (distance < minDistance) {
			collide = otherTranslate.sub(translate).normalize().scale(minDistance - distance);
		}
		return collide;
	}
}

class Box extends Collider {
	intersect(other) {
		let pos = this.getTranslate(),
			scale = this.getScale(),
			otherPos = other.getTranslate(),
			otherScale = other.getScale().max(),
			closest = new Vec3(
				Math.max(pos.x - scale.x, Math.min(otherPos.x, pos.x + scale.x)),
				Math.max(pos.y - scale.y, Math.min(otherPos.y, pos.y + scale.y)),
				Math.max(pos.z - scale.z, Math.min(otherPos.z, pos.z + scale.z))
			),
			distance = closest.distance(otherPos),
			collide = null;
		if (distance < otherScale) {
			collide = otherPos.sub(closest).normalize().scale(otherScale - distance);
		}
		return collide;
	}
}


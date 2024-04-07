
class Item {
	constructor(mesh, color, transform) {
		this.mesh = mesh;
		this.color = color;
		this.transform = new Transform(transform);

		this.collider;
		this.childs = [];
		this.active = true;
		this.stroke = 0;
	}

	add(child) {
		this.childs.push(child);
		child.transform.parent = this.transform;
		return this;
	}
}


let Game = {
	init() {
		this.cvs = window.find(".game-view canvas");
		this.ctx = this.cvs[0].getContext("2d");

		let { width, height } = this.cvs.parent().offset();
		this.cvs.attr({ width, height });
	}
};

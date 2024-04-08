
class Event {
	constructor() {
		this.listener = [];
	}

	on(event, listener) {
		const events = event.match(/[a-zA-Z]+/g);
		if (!events) {
			return;
		}
		events.forEach(event => {
			if (!(event in Event.listener)) {
				Event.listener[event] = [];
			}
			Event.listener[event].push(listener);
		});
	}

	trigger(event, params) {
		Event.listener["all"].forEach(listener => {
			listener(event, params);
		});
		if (event in Event.listener) {
			Event.listener[event].forEach(listener => {
				listener(event, params);
			});
		}
	}
}

//	@ghasemkiani/dox/context

const {cutil} = require("@ghasemkiani/base/cutil");
const {Obj: Base} = require("@ghasemkiani/base/obj");
const {pubsub} = require("@ghasemkiani/base-utils/pubsub");

class Context extends cutil.mixin(Base, pubsub) {
	constructor(...args) {
		super(...args);
		this.root = this;
	}
	get parent() {
		return Object.getPrototypeOf(this);
	}
	createChild() {
		return Object.create(this);
	}
	renderText(wnode, text) {
		wnode.t(text);
	}
}

module.exports = {Context};

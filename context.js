//	@ghasemkiani/dox/context

const {cutil} = require("@ghasemkiani/commonbase/cutil");
const {Base} = require("@ghasemkiani/commonbase/base");
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

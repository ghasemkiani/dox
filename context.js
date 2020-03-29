//	@ghasemkiani/dox/context

const {Base} = require("@ghasemkiani/commonbase/base");
const {cutil} = require("@ghasemkiani/commonbase/cutil");
const {pubsub} = require("@ghasemkiani/base-utils/pubsub");

class Context extends cutil.mixin(Base, pubsub) {
	get parent() {
		return Object.getPrototypeOf(this);
	}
}

module.exports = {Context};

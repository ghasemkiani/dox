//	@ghasemkiani/dox/context

import {cutil} from "@ghasemkiani/base";
import {Obj} from "@ghasemkiani/base";
import {pubsub} from "@ghasemkiani/base-utils";

class Context extends cutil.mixin(Obj, pubsub) {
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
	renderText(node, text) {
		node.t(text);
	}
}

export {Context};

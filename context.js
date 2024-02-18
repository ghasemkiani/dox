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
	createChild(f) {
		let ctx = Object.create(this);
		if (f) {
			f(ctx);
		}
		return ctx;
	}
	async toRenderText(node, text) {
		this.renderer.x.t(node, text);
	}
}

export {Context};

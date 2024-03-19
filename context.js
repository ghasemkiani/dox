//	@ghasemkiani/dox/context

import {cutil} from "@ghasemkiani/base";
import {Obj} from "@ghasemkiani/base";
import {pubsub} from "@ghasemkiani/base-utils";

class Context extends cutil.mixin(Obj, pubsub) {
	static {
		cutil.extend(this.prototype, {
			renderer: null,
			component: null,
			parent: null,
		});
	}
	get root() {
		return this.parent?.root || this;
	}
	get parentComponent() {
		return this.parent?.component;
	}
	createChild(f) {
		let ctx = Object.create(this);
		ctx.parent = this;
		if (typeof f === "function") {
			f(ctx);
		}
		return ctx;
	}
	async toRenderText(node, text) {
		this.renderer.x.t(node, text);
	}
}

export {Context};

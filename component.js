//	@ghasemkiani/dox/component

import {cutil} from "@ghasemkiani/base";
import {Obj} from "@ghasemkiani/base";
import {pubsub} from "@ghasemkiani/base-utils";

class Component extends cutil.mixin(Obj, pubsub) {
	static {
		cutil.extend(this.prototype, {
			wnode: null,
		});
	}
	get wdocument() {
		return this.wnode.wdocument;
	}
	async toRender(wnode) {
		//
	}
	async toRenderBody(wnode, f) {
		let ctx = this.context.createChild();
		if(typeof f === "function") {
			f(ctx);
		}
		for(let wn of this.wnode.wnodes) {
			await this.context.renderer.translate(wn, ctx).toRender(wnode);
		}
	}
	async toRenderAgain(wn, wnode, f) {
		let ctx = this.context.createChild();
		if(typeof f === "function") {
			f(ctx);
		}
		if(!wnode) {
			wnode = wn.parent;
			wn.del();
		}
		await this.context.renderer.translate(wn, ctx).toRender(wnode);
	}
}

class TextComponent extends Component {
	static {
		cutil.extend(this.prototype, {
			//
		});
	}
	async toRender(wnode) {
		if(this.context.renderText) {
			this.context.renderText(wnode, this.wnode.text);
		} else {
			wnode.t(this.wnode.text);
		}
	}
}

class CommentComponent extends Component {
	static {
		cutil.extend(this.prototype, {
			//
		});
	}
	async toRender(wnode) {
		wnode.comment(this.wnode.text);
	}
}

class ElementComponent extends Component {
	static {
		cutil.extend(this.prototype, {
			//
		});
	}
	async toRender(wnode) {
		let wn;
		wnode.cx(this.wnode.tag, this.wnode.ns, wnode => {
			for(let k of this.wnode.node.getAttributeNames()) {
				wnode.attr(k, this.wnode.attr(k));
			}
			wn = wnode;
		});
		await this.toRenderBody(wn);
	}
}

class TemplateComponent extends Component {
	static {
		cutil.extend(this.prototype, {
			template: null,
			props: null,
		});
	}
	async toRender(wnode) {
		let component = this;
		let {template} = component;
		let {context} = component;
		let {renderer} = context;
		
		
		let cmp = renderer.translate(template, context);
		component.props = {};
		for (let {name, value} of component.wnode.attrs()) {
			let checkCode = /^\s*{(.*)}\s*$/.exec(value);
			if (checkCode) {
				value = checkCode[1];
				const AsyncFunction = async function () {}.constructor;
				let f = new AsyncFunction ("wnode", "component", "context", "renderer", "templateComponent", "props", `return (${value});`);
				value = await (f.call(cmp, wnode, cmp, context, renderer, component, component.props));
			}
			if (name === "wnode") {
				wnode = value;
			} else {
				component.props[name] = value;
			}
		}
		context.templateComponent = component;
		await cmp.toRender(wnode);
		delete context.templateComponent;
	}
}

export {Component, TextComponent, CommentComponent, ElementComponent, TemplateComponent};

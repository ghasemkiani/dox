//	@ghasemkiani/dox/component

import {cutil} from "@ghasemkiani/base";
import {Obj} from "@ghasemkiani/base";
import {pubsub} from "@ghasemkiani/base-utils";
import {iwx} from "@ghasemkiani/xdom";

class Component extends cutil.mixin(Obj, pubsub, iwx) {
	static {
		cutil.extend(this.prototype, {
			node: null,
			context: null,
		});
	}
	get parent() {
		return this.context?.parentComponent;
	}
	async toRender(node) {
		//
	}
	async toRenderBodyWith(node, ctx) {
		let {x} = this;
		for(let n of x.nodes(this.node)) {
			await ctx.renderer.translate(n, ctx).toRender(node);
		}
	}
	async toRenderBody(node, f) {
		let {x} = this;
		let ctx = this.context.createChild(f);
		await this.toRenderBodyWith(node, ctx);
	}
	async toRenderAgain(n, node, f) {
		let {x} = this;
		let ctx = this.context.createChild(f);
		if(!node) {
			node = x.pnode(n);
			x.del(n);
		}
		await this.context.renderer.translate(n, ctx).toRender(node);
	}
}

class TextComponent extends Component {
	async toRender(node) {
		let {x} = this;
		let text = this.node.data;
		if(this.context.toRenderText) {
			await this.context.toRenderText(node, text);
		} else {
			x.t(node, text);
		}
	}
}

class CommentComponent extends Component {
	async toRender(node) {
		let {x} = this;
		x.comment(node, this.node.data);
	}
}

class ElementComponent extends Component {
	async toRender(node) {
		let {x} = this;
		let n = x.cx(node, x.name(this.node), x.ns(this.node), node => {
			x.attrs(node, x.attrs(this.node));
		});
		await this.toRenderBody(n);
	}
}

class TemplateComponent extends Component {
	static {
		cutil.extend(this.prototype, {
			template: null,
			props: null,
		});
	}
	async toRender(node) {
		let component = this;
		let {x} = component;
		let {template} = component;
		let {context} = component;
		let {renderer} = context;
		
		
		let cmp = renderer.translate(template, context);
		component.props = {};
		for (let [k, v] of x.attrs(component.node)) {
			let checkCode = /^\s*{(.*)}\s*$/.exec(v);
			if (checkCode) {
				v = checkCode[1];
				const AsyncFunction = async function () {}.constructor;
				let f = new AsyncFunction ("node", "component", "context", "renderer", "templateComponent", "props", `return (${v});`);
				try {
					v = await (f.call(cmp, node, cmp, context, renderer, component, component.props));
				} catch (e) {
					console.log(renderer.x.toStr(component.node));
					throw e;
				}
			}
			if (k === "node") {
				node = v;
			} else {
				component.props[k] = v;
			}
		}
		context.templateComponent = component;
		await cmp.toRender(node);
		delete context.templateComponent;
	}
}

export {Component, TextComponent, CommentComponent, ElementComponent, TemplateComponent};

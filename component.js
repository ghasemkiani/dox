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
	render(wnode) {
		//
	}
	renderBody(wnode, f) {
		let ctx = this.context.createChild();
		if(typeof f === "function") {
			f(ctx);
		}
		for(let wn of this.wnode.wnodes) {
			this.context.renderer.translate(wn, ctx).render(wnode);
		}
	}
	renderAgain(wn, wnode, f) {
		let ctx = this.context.createChild();
		if(typeof f === "function") {
			f(ctx);
		}
		if(!wnode) {
			wnode = wn.parent;
			wn.del();
		}
		this.context.renderer.translate(wn, ctx).render(wnode);
	}
}

class TextComponent extends Component {
	static {
		cutil.extend(this.prototype, {
			//
		});
	}
	render(wnode) {
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
	render(wnode) {
		wnode.comment(this.wnode.text);
	}
}

class ElementComponent extends Component {
	static {
		cutil.extend(this.prototype, {
			//
		});
	}
	render(wnode) {
		wnode.cx(this.wnode.name, this.wnode.ns, wnode => {
			for(let k of this.wnode.node.getAttributeNames()) {
				wnode.attr(k, this.wnode.attr(k));
			}
			this.renderBody(wnode);
		});
	}
}

class TemplateComponent extends Component {
	static {
		cutil.extend(this.prototype, {
			template: null,
			props: null,
		});
	}
	render(wnode) {
		let component = this;
		let {template} = component;
		let {context} = component;
		let {renderer} = context;
		
		context.component = component;
		
		let cmp = renderer.translate(template, context);
		component.props = {};
		for (let {name, value} of component.wnode.attrs()) {
			if (/^{/.test(value)) {
				let f = new Function("wnode", `return (${value});`);
				value = f.call(cmp, wnode);
			}
			component.props[name] = value;
		}
		cmp.render(wnode);
		
		delete context.component;
	}
}

export {Component, TextComponent, CommentComponent, ElementComponent, TemplateComponent};

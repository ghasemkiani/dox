//	@ghasemkiani/dox/component

const {cutil} = require("@ghasemkiani/base/cutil");
const {Obj: Base} = require("@ghasemkiani/base/obj");
const {pubsub} = require("@ghasemkiani/base-utils/pubsub");

class Component extends cutil.mixin(Base, pubsub) {
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
cutil.extend(Component.prototype, {
	wnode: null,
});

class TextComponent extends Component {
	render(wnode) {
		if(this.context.renderText) {
			this.context.renderText(wnode, this.wnode.text);
		} else {
			wnode.t(this.wnode.text);
		}
	}
}
cutil.extend(TextComponent.prototype, {
	//
});

class CommentComponent extends Component {
	render(wnode) {
		wnode.comment(this.wnode.text);
	}
}
cutil.extend(CommentComponent.prototype, {
	//
});

class ElementComponent extends Component {
	render(wnode) {
		wnode.cx(this.wnode.name, this.wnode.ns, wnode => {
			for(let k of this.wnode.node.getAttributeNames()) {
				wnode.attr(k, this.wnode.attr(k));
			}
			this.renderBody(wnode);
		});
	}
}
cutil.extend(ElementComponent.prototype, {
	//
});

module.exports = {
	Component,
	TextComponent,
	CommentComponent,
	ElementComponent,
};

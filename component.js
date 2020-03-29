//	@ghasemkiani/dox/component

const {cutil} = require("@ghasemkiani/commonbase/cutil");
const {Base} = require("@ghasemkiani/commonbase/base");
const {pubsub} = require("@ghasemkiani/base-utils/pubsub");

class Component extends cutil.mixin(Base, pubsub) {
	get wdocument() {
		return this.wnode.wdocument;
	}
	render(wnode) {
		//
	}
	renderBody(wnode) {
		let ctx = Object.create(this.context);
		for(let wn of this.wnode.wnodes) {
			this.context.renderer.translate(wn, ctx).render(wnode);
		}
	}
	renderAgain(wnode) {
		let ctx = Object.create(this.context);
		let wn = wnode;
		wnode = wn.parent;
		wn.del();
		this.context.renderer.translate(wn, ctx).render(wnode);
	}
}
cutil.extend(Component.prototype, {
	wnode: null,
});

class TextComponent extends Component {
	render(wnode) {
		if(this.context.renderText) {
			this.context.renderText(this.wnode.text, wnode);
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

//	@ghasemkiani/dox/component

const {cutil} = require("@ghasemkiani/commonbase/cutil");
const {Base} = require("@ghasemkiani/commonbase/base");

class Component extends Base {
	get wdocument() {
		return this.wnode.wdocument;
	}
	render(wnode, ctx, renderBody) {
		//
	}
}
cutil.extend(Component.prototype, {
	wnode: null,
});

class TextComponent extends Component {
	render(wnode, ctx, renderBody) {
		if(ctx.renderText) {
			ctx.renderText(this.wnode.text, wnode);
		} else {
			wnode.t(this.wnode.text);
		}
	}
}
cutil.extend(TextComponent.prototype, {
	//
});

class CommentComponent extends Component {
	render(wnode, ctx, renderBody) {
		wnode.comment(this.wnode.text);
	}
}
cutil.extend(CommentComponent.prototype, {
	//
});

class ElementComponent extends Component {
	render(wnode, ctx, renderBody, renderAgain) {
		wnode.cx(this.wnode.name, this.wnode.ns, wnode => {
			for(let k of this.wnode.node.getAttributeNames()) {
				wnode.attr(k, this.wnode.attr(k));
			}
			renderBody(wnode);
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

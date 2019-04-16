//	@ghasemkiani/dox/component

const {cutil} = require("@ghasemkiani/commonbase/cutil");
const {WElement} = require("@ghasemkiani/wdom/element");

class Component extends WElement {
	render(wnode, ctx) {
		//
	}
	renderBody(wnode, ctx) {
		ctx = this.createContext(ctx);
		return this.wnodes.map(wnode => {
			let wn;
			if(wnode.kind === "element") {
				wn = wnode.render(wnode, ctx);
			} else if(wnode.kind === "text") {
				if(ctx.renderText) {
					wn = ctx.renderText(wnode);
				} else {
					wn = wnode.wdocument.t(wnode.text);
				}
			} else if(wnode.kind === "comment") {
				wn = wnode.wdocument.comment(wnode.text);
			}
			return wn;
		});
	}
	createContext(ctx) {
		return Object.create(ctx);
	}
}
cutil.extend(Component.prototype, {
	//
});

module.exports = {Component};

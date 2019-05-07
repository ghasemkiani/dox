//	@ghasemkiani/dox/renderer

const {cutil} = require("@ghasemkiani/commonbase/cutil");
const {Base} = require("@ghasemkiani/commonbase/base");
const {WDocument} = require("@ghasemkiani/wdom/document");
const {Component, TextComponent, CommentComponent, ElementComponent} = require("@ghasemkiani/dox/component");

class Renderer extends Base {
	createWDocument() {
		return new WDocument();
	}
	get wdocument() {
		if(!this._wdocument) {
			this._wdocument = this.createWDocument();
		}
		return this._wdocument;
	}
	set wdocument(wdocument) {
		this._wdocument = wdocument;
	}
	render(wnode) {
		let render;
		let renderBody;
		let renderAgain;
		render = (wnode1, wnode2, ctx) => {
			let component = this.translate(wnode1);
			component.render(wnode2, ctx, renderBody(wnode1, ctx), renderAgain(ctx));
		};
		renderBody = (wnode1, ctx) => {
			ctx = Object.create(ctx);
			return (wn2) => {
				for(let wn1 of wnode1.wnodes) {
					render(wn1, wn2, ctx);
				}
			};
		};
		renderAgain = (ctx) => {
			ctx = Object.create(ctx);
			return (wnode1, wnode2) => {
				render(wnode1, wnode2, ctx);
			};
		};
		let wnode1 = wnode;
		let wnode2 = this.wdocument.root.cl();
		let ctx = this.createContext();
		render(wnode1, wnode2, ctx);
	}
	getComponent(wnode) {
		return (
			wnode.kind === "text" ? TextComponent :
			wnode.kind === "comment" ? CommentComponent :
			wnode.kind === "element" ?
				this.translator && wnode.ns in this.translator && wnode.name in this.translator[wnode.ns] ?
					this.translator[wnode.ns][wnode.name] :
					ElementComponent
			: Component
		);
	}
	translate(wnode) {
		let Component = this.getComponent(wnode);
		return new Component({wnode});
	}
	createContext() {
		return {};
	}
}
cutil.extend(Renderer.prototype, {
	translator: null,
	_wdocument: null,
});

module.exports = {Renderer};

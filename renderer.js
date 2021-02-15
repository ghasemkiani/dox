//	@ghasemkiani/dox/renderer

const {cutil} = require("@ghasemkiani/commonbase/cutil");
const {Base} = require("@ghasemkiani/commonbase/base");
const {pubsub} = require("@ghasemkiani/base-utils/pubsub");
const {WDocument} = require("@ghasemkiani/wdom/document");
const {Component, TextComponent, CommentComponent, ElementComponent} = require("@ghasemkiani/dox/component");
const {Context} = require("@ghasemkiani/dox/context");

class Renderer extends cutil.mixin(Base, pubsub) {
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
		let context = this.createContext();
		this.setupContext(context);
		let component = this.translate(wnode, context);
		component.render(this.wdocument.root.cl());
		return context;
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
	translate(wnode, context) {
		let Component = this.getComponent(wnode);
		let component = new Component({wnode, context});
		context.component = component;
		return component;
	}
	get Context() {
		if(!this._Context) {
			this._Context = Context;
		}
		return this._Context;
	}
	set Context(Context) {
		this._Context = Context;
	}
	createContext() {
		let renderer = this;
		return new this.Context({renderer});
	}
	setupContext(context) {
		//
	}
}
cutil.extend(Renderer.prototype, {
	translator: null,
	_wdocument: null,
	_Context: null,
});

module.exports = {Renderer};

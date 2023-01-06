//	@ghasemkiani/dox/renderer

import {cutil} from "@ghasemkiani/base";
import {Obj} from "@ghasemkiani/base";
import {pubsub} from "@ghasemkiani/base-utils";
import {WDocument} from "@ghasemkiani/wdom";
import {Component, TextComponent, CommentComponent, ElementComponent} from "./component.js";
import {Context} from "./context.js";

class Renderer extends cutil.mixin(Obj, pubsub) {
	static {
		cutil.extend(this.prototype, {
			translator: null,
			_wdocument: null,
			_Context: null,
			_wnodeRoot: null,
		});
	}
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
	get wnodeRoot() {
		return this._wnodeRoot || (this.wdocument ? this.wdocument.root.cl() : null);
	}
	set wnodeRoot(wnodeRoot) {
		this._wnodeRoot = wnodeRoot;
	}
	render(wnode) {
		let context = this.createContext();
		this.setupContext(context);
		let component = this.translate(wnode, context);
		component.render(this.wnodeRoot);
		// this.iter();
		return context;
	}
	iter() {
		this.pub("iter-start");
		this.pub("iter1");
		this.pub("iter2");
		this.pub("iter3");
		this.pub("iter4");
		this.pub("iter5");
		this.pub("iter-finish");
	}
	getComponent(wnode) {
		return (
			wnode.kind === "text" ? TextComponent :
			wnode.kind === "comment" ? CommentComponent :
			wnode.kind === "element" ?
				this.translator && wnode.ns in this.translator && wnode.name in this.translator[wnode.ns] ?
					this.translator[wnode.ns][wnode.name] :
					this.getElementComponent(wnode)
			: Component
		);
	}
	getElementComponent(wnode) {
		return ElementComponent;
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
		let {Context} = renderer;
		let context = new Context({renderer});
		return context;
	}
	setupContext(context) {
		//
	}
}

export {Renderer};

import path from "node:path";
import fs from "node:fs";

import {cutil} from "@ghasemkiani/base";
import {Obj} from "@ghasemkiani/base";
import {Textual} from "@ghasemkiani/base";
import {pubsub} from "@ghasemkiani/base-utils";
import {iwx} from "@ghasemkiani/xdom";
import {Component, TextComponent, CommentComponent, ElementComponent, TemplateComponent} from "./component.js";
import {Context} from "./context.js";

class Renderer extends cutil.mixin(Obj, pubsub, iwx) {
	static {
		cutil.extend(this.prototype, {
			translator: null,
			Context: null,
		});
	}
	async toPrepareDocument() {
		let renderer = this;
		let {x} = renderer;
		let root = x.root();
		x.cl(root);
		return root;
	}
	async toRender(node, context) {
		let renderer = this;
		let {x} = renderer;
		let root = await renderer.toPrepareDocument();
		if (cutil.na(context)) {
			context = renderer.createContext();
			renderer.setupContext(context);
		}
		let component = renderer.translate(node, context);
		await component.toRender(root);
		// renderer.iter();
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
	getComponent(node) {
		let {x} = this;
		return (
			x.kind(node) === "text" ? TextComponent :
			x.kind(node) === "comment" ? CommentComponent :
			x.kind(node) === "element" ?
				this.translator && x.ns(node) in this.translator && x.nm(node) in this.translator[x.ns(node)] ?
					this.translator[x.ns(node)][x.nm(node)] :
					this.getElementComponent(node)
			: Component
		);
	}
	getElementComponent(node) {
		return ElementComponent;
	}
	translate(node, context) {
		let {x} = this;
		let Component = this.getComponent(node);
		let component = new Component({node, context, x});
		context.component = component;
		return component;
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
	addTemplateFolder(ns, folder, cs = "UTF-8") {
		let renderer = this;
		let {x} = renderer;
		function dir(folder, prefix) {
			for (let dirent of fs.readdirSync(folder, {withFileTypes: true})) {
				let fn = path.join(dirent.path, dirent.name);
				let tag = prefix + path.parse(dirent.name).name;
				if (dirent.isDirectory()) {
					dir(fn, tag + ".");
				} else if (dirent.isFile() && /\.dox/i.test(fn)) {
					let template = x.root(x.fromStr(new Textual({fn, cs}).read().string));
					((renderer.translator ||= {})[ns] ||= {})[tag] = class extends TemplateComponent {
						static {
							cutil.extend(this.prototype, {template});
						}
					};
				}
			}
		}
		dir(folder, "");
	}
}

export {Renderer};

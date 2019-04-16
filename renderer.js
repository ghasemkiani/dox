//	@ghasemkiani/dox/renderer

const {cutil} = require("@ghasemkiani/commonbase/cutil");
const {Base} = require("@ghasemkiani/commonbase/base");
const {WDocument} = require("@ghasemkiani/wdom/document");

class Renderer extends Base {
	get wdocument() {
		if(!this._wdocument) {
			this._wdocument = new WDocument();
		}
		return this._wdocument;
	}
	set wdocument(wdocument) {
		this._wdocument = wdocument;
	}
	render(wnode) {
		return this.translate(wnode).render({
			wnode: this.wdocument,
			ctx: this.createContext(),
		});
	}
	translate(wnode) {
		let component;
		if(wnode.kind === "element") {
			let Component = this.translator[wnode.ns][wnode.tag];
			component = new Component({wnode});
			for(let k of wnode.node.getAttributeNames()) {
				let v = wnode.attr(k);
				component.attr(k, v);
			}
			for(let wn of wnode.wnodes) {
				component.append(this.translate(wn));
			}
		} else if(wnode.kind === "text") {
			component = this.wdocument.t(wnode.text);
		} else if(wnode.kind === "comment") {
			component = this.wdocument.comment(wnode.text);
		}
		return component;
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

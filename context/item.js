//	@ghasemkiani/dox/context/item

const {cutil} = require("@ghasemkiani/commonbase/cutil");
const {Base} = require("@ghasemkiani/commonbase/base");

class Item extends Base {
	constructor(...args) {
		super(...args);
		if (!this.nonum) {
			if (cutil.isNil(this.num)) {
				this.num = ++this.sequence.num;
			} else {
				if (cutil.isNumber(this.num)) {
					this.sequence.num = this.num;
				}
			}
		}
	}
	get id() {
		if(!this._id) {
			this._id = `${this.sequence.tag}${this.nonum ? "_" + cutil.srand(6) : cutil.strn(this.num, 3)}`;
		}
		return this._id;
	}
	set id(id) {
		this._id = id;
	}
	get index() {
		return this.sequence.items.indexOf(this);
	}
}
cutil.extend(Item.prototype, {
	_id: null,
	sequence: null,
	nonum: false,
	num: null,
});

module.exports = {Item};

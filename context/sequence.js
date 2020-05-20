//	@ghasemkiani/dox/context/sequence

const {cutil} = require("@ghasemkiani/commonbase/cutil");
const {Base} = require("@ghasemkiani/commonbase/base");
const {Item} = require("@ghasemkiani/dox/context/item");

class Sequence extends Base {
	get items() {
		if(!this._idMap) {
			this._idMap = [];
		}
		return this._idMap;
	}
	set items(items) {
		this._idMap = items;
	}
	get idMap() {
		if(!this._idMap) {
			this._idMap = {};
		}
		return this._idMap;
	}
	set idMap(idMap) {
		this._idMap = idMap;
	}
	get last() {
		return this.items[this.items.length - 1] || null;
	}
	newItem(data) {
		let item = new Item(Object.assign({
			sequence : this,
			nonum : false,
			num : null,
			id : "",
		}, Object(data)));
		this.items.push(item);
		this.prepItem(item);
		return item;
	}
	prepItem(item) {
		return item;
	}
	setNonum() {
		if(this.las) {
			this.num--;
			delete this.last.num;
			this.last.nonum = true;
		} else {
			console.log("Sequence.setNonum called with no items!")
		}
	}
	setNum(num) {
		this.num--;
		this.last.num = num;
		this.last.nonum = false;
		if (cutil.isNumber(num)) {
			this.num = num;
		}
	}
	setId(id) {
		this.last.id = id;
	}
	find(k, v) {
		return this.items.find(item => item[k] == v);
	}
	format(num) {
		return num;
	}
	forEach(f) {
		return this.items.forEach(f);
	}
}
cutil.extend(Sequence.prototype, {
	context: null,
	tag : "item",
	_items : null,
	num : 0,
	_idMap : null,
});

module.exports = {Sequence};

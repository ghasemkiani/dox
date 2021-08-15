//	@ghasemkiani/dox/context/sequence

import {cutil} from "@ghasemkiani/base";
import {Obj as Base} from "@ghasemkiani/base";

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
			this._id = `${this.sequence.tag}${this.nonum ? "_" + cutil.srand(6) : cutil.asNumber(this.num).toFixed(0).padStart(3, "0")}`;
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

class Sequence extends Base {
	get items() {
		if(!this._items) {
			this._items = [];
		}
		return this._items;
	}
	set items(items) {
		this._items = items;
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
	get first() {
		return this.items[0] || null;
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
		if(this.last) {
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
	ftag : "Item",
	_items : null,
	num : 0,
	_idMap : null,
	parent: null,
	level: 0,
});

module.exports = {Item, Sequence};

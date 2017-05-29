VHV.Panel = function(settings){

	VHV.Panel.prototype.constructor.call(this, settings);
	//VHV.initGlobalProperties(this, ["Title"]);
};

VHV.initClass("Panel", "DomElement");


var panel = VHV.Panel.prototype;

panel.onShow = function(){
	var node = this.getDomNode();
	console.log(node);
	VHV.Panel.prototype.onShow.call(this, settings);
};
panel = null;
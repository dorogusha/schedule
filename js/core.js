var VHV = {};

VHV.objects = {}; // хранилище созданных объектов, чтобы отслеживать висяки в памяти

// примеси для классов
VHV.mixed = {

};

VHV.vocabulary = {
	"initClass_1": "Error init class",
	"initClass_2": "Such class was created already"
};

VHV.nameSpaces = {};

VHV.Error = function(err) {
	throw Error(err);
}

VHV.isObject = function(val){
	return (val && typeof val == "object" && val != null);
};

VHV.isArray = function(val){
	return (val && typeof val == "object" && Array.isArray(val));
};

VHV.isString = function(val){
	return (val && typeof val == "string");
};

VHV.initClass = function(cls, proto, mixed) {
	if (!cls)
		new VHV.Error (VHV.vocabulary.initClass_1);

	mixed = mixed || [];

	if (proto) {
		var F = function() {};
		F.prototype = proto.prototype;
		cls.prototype = new F();
		cls.prototype.constructor = cls;
		cls.base = proto.prototype;
		cls.baseClass = proto;
	}

	mixed.forEach(function(m){
		var mixedData = VHV[m]
		if (mixedData) {
			for (var mProperty in mixedData)
				cls.prototype[mProperty] = mixedData[mProperty];
		}
	});
}

VHV._initProperties = VHV.initProperties = function(cls, properties){
	if (!cls || !cls.prototype || !VHV.isObject(properties))
		return;
	for (var p in properties) {
		var prop = properties[p],
			defaultValue = prop.value,
			validPropName = p[0].toUpperCase() + p.substr(1);

		cls.prototype[prop] = defaultValue;

		if (prop.get)
			cls.prototype["get" + validPropName] = function(){
				return this[validPropName];
			};

		if (prop.set)
			cls.prototype["set" + validPropName] = function(value){
				this[validPropName] = value;
			};
	}
};

VHV.templates = {
	"panel": "<div class='VHV-Panel-Title'></div>" +
			 "<div class='VHV-Panel-Content'></div>"
}

// Базовые классы
VHV.Base = function(){

};
VHV.initClass(VHV.Base);
var bP = VHV.Base.prototype;

bP.destroy = function(){
	for (var o in this) {
		var prop = this[o];
		if (VHV.isObject(prop) && prop.destroy && typeof prop.destroy == "function")
			prop.destroy();
		delete prop;
	}
};
bP = null;

VHV.Ui = function(settings) {
	if (settings) {
		if (settings.size)
			this.size = settings.size;
		if (settings.template)
			this.template = settings.template;
	}

	VHV.Ui.base.constructor.apply(this, arguments);
};

VHV.initClass(VHV.Ui, VHV.Base);
VHV._initProperties(VHV.Ui, {
	"domNode": {get: true, set: true},
	"content": {get: true},
	"size": {get: true, set: true, value: {w: "auto", h: "auto"}}
});

var dEl = VHV.Ui.prototype;

dEl.setContent = function(value){
	if (this.domNode){
		if (VHV.isString(value))
			this.domNode.innerHTML = value || "";
		else if (value.innerHTML)
			this.domNode.appendChild(value);
	}
};

dEl.setWidth = function(value){
	$(this.domNode).width(value);
	this.size.w = $(this.domNode).width();
};

dEl.setHeight = function(value){
	$(this.domNode).height(value);
	this.size.h = $(this.domNode).height();
};

dEl.updateSize = function(){
	this.setWidth(this.size.w);
	this.setHeight(this.size.h);
};

dEl.onShow = function(){
	document.body.appendChild(this.domNode);
};

dEl = null;

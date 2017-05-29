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

VHV.initClass = function(className, prototypeName, mixed) {
	var cls = VHV[className],
		proto = VHV[prototypeName];

	if (!cls)
		new VHV.Error (VHV.vocabulary.initClass_1);

	mixed = mixed || [];

	if (proto) {
		var F = function() {};
		F.prototype = proto.prototype;
		cls.prototype = new F();
		cls.prototype.constructor = cls;
		cls.superclass = proto.prototype;
	}

	mixed.forEach(function(m){
		var mixedData = VHV[m]
		if (mixedData) {
			for (var mProperty in mixedData)
				cls.prototype[mProperty] = mixedData[mProperty];
		}
	});

	VHV.nameSpaces[className] = {proto: prototypeName, mixed: mixed || []};
}

VHV.initPrivateProperties = function(cls, properties, defaultValues){
	if (!VHV.isObject(cls) || !VHV.isArray(properties))
		return;
	for (var i = 0, l = properties.length; i < l; i++) {
		var prop = properties[i],
			defaultVal = defaultValues ? defaultValues[prop] : undefined;
		cls[prop] = defaultVal;
	}
};

VHV.initGlobalProperties = VHV.initProperties = function(className, properties, defaultValues){
	var cls = VHV[className];
	if (!cls || !VHV.isArray(properties))
		return;
	for (var i = 0, l = properties.length; i < l; i++) {
		var prop = properties[i],
			defaultVal = defaultValues ? defaultValues[prop] : undefined;
		cls.prototype[prop] = defaultVal;
	}
};

VHV.initGetter = function(className, properties){
	var cls = VHV[className];
	if (!cls || !VHV.isArray(properties))
		return;

	for (var i = 0, l = properties.length; i < l; i++) {
		var prop = properties[i],
			validPropName = prop[0].toUpperCase() + prop.substr(1);
		cls.prototype["get" + validPropName] = function(){
			return this[validPropName];
		};
	}
};

VHV.initSetter = function(className, properties){
	var cls = VHV[className];
	if (!cls || !VHV.isArray(properties))
		return;

	for (var i = 0, l = properties.length; i < l; i++) {
		var prop = properties[i],
			validPropName = prop[0].toUpperCase() + prop.substr(1);
		cls.prototype["set" + validPropName] = function(value){
			this[validPropName] = value;
		};
	}
};

// Базовые классы
VHV.Base = function(){

};
VHV.initClass("Base");
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

VHV.DomElement = function(settings) {
	if (settings) {
		if (settings.size)
			this.size = settings.size;
		if (settings.template)
			this.template = settings.template;
	}

	VHV.DomElement.prototype.constructor.call(this, settings);
};

VHV.initClass("DomElement", "Base");
VHV.initGlobalProperties("DomElement", ["domNode", "Content", "Size"]);
VHV.initGetter("DomElement", ["domNode", "Content", "Size"]);
VHV.initSetter("DomElement", ["domNode", "Content", "Size"]);

var dEl = VHV.DomElement.prototype;

dEl.onShow = function(){
	documentt.body.appendChild(this.domNode);
};

dEl = null;

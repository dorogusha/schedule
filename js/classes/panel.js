VHV.Panel = function(settings){
	VHV.Panel.base.constructor.apply(this, settings);

	this.domNode = document.createElement("div");
	this.domNode.className = "VHV-Panel";

	this.setContent();

	this.updateSize();
};

VHV.initClass(VHV.Panel, VHV.Ui);
VHV._initProperties(VHV.Ui, {
	"title": {get: true}
});

var panel = VHV.Panel.prototype;

panel.setContent = function(value){
	if (this.contentNode) {
		value = value + "";
		$(this.contentNode).html(value);
		this.content = value;
	} else {

		VHV.Panel.base.setContent.apply(this, arguments);

		this.titleNode = this.domNode.firstChild;
		this.contentNode = this.domNode.lastChild;
	}
};

panel.setTitle = function(value){
	value = value + "";
	$(this.titleNode).html(value);
	this.title = value;
};

panel.onShow = function(){
	VHV.Panel.base.onShow.apply(this, arguments);

};
panel = null;
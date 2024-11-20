sap.ui.define([
    "sap/m/HBox",
    "sap/m/Avatar",
    "sap/m/Text"
], function(HBox, Avatar, Text) {
    "use strict";
    return HBox.extend("zjblessons.Lesson14.controller.controls.CustomATHBox", {
        metadata: {
            properties: {
                src: { type: "string", defaultValue: "" },
                initials: { type: "string", defaultValue: "" },
                showBorder: { type: "boolean", defaultValue: false },
                decorative: { type: "boolean", defaultValue: false },
                active: { type: "boolean", defaultValue: false },
                displaySize: { type: "sap.m.AvatarSize", defaultValue: sap.m.AvatarSize.S },
                text: { type: "string", defaultValue: "" },
                maxLines: { type: "int", defaultValue: null },
                textAlign: {type: "sap.ui.core.TextAlign", defaultValue: sap.ui.core.TextAlign.Begin},
                textDirection: {type: "sap.ui.core.TextDirection", defaultValue: sap.ui.core.TextDirection.Inherit},
                renderWhitespace: {type: "boolean", defaultValue: false},
                width: { type: "sap.ui.core.CSSSize", defaultValue: "" },
                displayShape: { type: "sap.m.AvatarShape", defaultValue: "Circle" },
                backgroundColor:{ type: "sap.m.AvatarColor", defaultValue: "Accent6" }
            },
            aggregations: {
                _avatar: { type: "sap.m.Avatar", multiple: false, visibility: "hidden" },
                _text: { type: "sap.m.Text", multiple: false, visibility: "hidden" }
            },
            events: {}
        },
        init: function() {
            this.setAggregation("_avatar", new Avatar());
            this.setAggregation("_text", new Text());
        },
        setSrc: function(sValue) {
            this.setProperty("src", sValue, true);
            this.getAggregation("_avatar").setSrc(sValue);
            return this;
        },

        setInitials: function(sValue) {
            this.setProperty("initials", sValue, true);
            this.getAggregation("_avatar").setInitials(sValue);
            return this;
        },
        setShowBorder: function(bValue) {
            this.setProperty("showBorder", bValue, true);
            this.getAggregation("_avatar").setShowBorder(bValue);
            return this;
        },
        setDecorative: function(bValue) {
            this.setProperty("decorative", bValue, true);
            this.getAggregation("_avatar").setDecorative(bValue);
            return this;
        },
        setActive: function(bValue) {
            this.setProperty("active", bValue, true);
            this.getAggregation("_avatar").setActive(bValue);
            return this;
        },
        setDisplaySize: function(sValue) {
            this.setProperty("displaySize", sValue, true);
            this.getAggregation("_avatar").setDisplaySize(sValue);
            return this;
        },
        setDisplayShape: function(sValue) {
            this.setProperty("displayShape", sValue, true);
            this.getAggregation("_avatar").setDisplayShape(sValue);
            return this;
        },
        setBackgroundColor: function(sValue) {
            this.setProperty("backgroundColor", sValue, true);
            this.getAggregation("_avatar").setBackgroundColor(sValue);
            return this;
        },
        setTextAlign: function(sValue) {
            this.setProperty("textAlign", sValue, true);
            this.getAggregation("_text").setTextAlign(sValue);
            return this;
        },
        setTextDirection: function(sValue) {
            this.setProperty("textDirection", sValue, true);
            this.getAggregation("_text").setTextDirection(sValue);
            return this;
        },
        setRenderWhitespace: function(bValue) {
            this.setProperty("renderWhitespace", bValue, true);
            this.getAggregation("_text").setRenderWhitespace(bValue);
            return this;
        },
        setText: function(sValue) {
            this.setProperty("text", sValue, true);
            this.getAggregation("_text").setText(sValue);
            return this;
        },

        setMaxLines: function(iValue) {
            this.setProperty("maxLines", iValue, true);
            this.getAggregation("_text").setMaxLines(iValue);
            return this;
        },
        setWidth: function(sValue) {
            this.setProperty("width", sValue, true);
            this.getAggregation("_text").setWidth(sValue);
            return this;
        },
        renderer(oRm, oControl) {
            const oAvatar = oControl.getAggregation("_avatar");
            const oText = oControl.getAggregation("_text");
      
            oAvatar.setSrc(oControl.getSrc());
            oAvatar.setInitials(oControl.getInitials());
            oAvatar.setDecorative(oControl.getDecorative());
            oAvatar.setActive(oControl.getActive());
            oAvatar.setDisplaySize(oControl.getDisplaySize());
            
            oText.setText(oControl.getText());
            oText.setMaxLines(oControl.getMaxLines());
            oText.setTextAlign(oControl.getTextAlign());
            oText.setTextDirection(oControl.getTextDirection());
            oText.setRenderWhitespace(oControl.getRenderWhitespace());
			oRm.openStart("div", oControl);
			oRm.openEnd();
			oRm.renderControl(oControl.getAggregation("_avatar"));
			oRm.renderControl(oControl.getAggregation("_text"));
			oRm.close("div");
		}
    });
});
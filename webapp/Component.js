/* global document */
sap.ui.define([
		"sap/ui/core/UIComponent",
		"sap/ui/Device",
		"sap/ui/model/json/JSONModel",
		"zjblessons/Lesson5/controller/ErrorHandler"
	], function (UIComponent, Device, JSONModel, ErrorHandler) {
		"use strict";

		return UIComponent.extend("zjblessons.Lesson5.Component", {

			metadata : {
				manifest: "json"
			},

			init : function () {
				UIComponent.prototype.init.apply(this, arguments);
				this._oErrorHandler = new ErrorHandler(this);
				this.setModel(this.createDeviceModel(), "device");
				this.getRouter().initialize();
			},

			destroy : function () {
				this._oErrorHandler.destroy();
				UIComponent.prototype.destroy.apply(this, arguments);
			},

			createDeviceModel : function () {
				const oModel = new JSONModel(Device);
				return oModel;
			},
			getContentDensityClass : function() {
				if (this._sContentDensityClass === undefined) {
					if (jQuery(document.body).hasClass("sapUiSizeCozy") || jQuery(document.body).hasClass("sapUiSizeCompact")) {
						this._sContentDensityClass = "";
					} else if (!Device.support.touch) { // apply "compact" mode if touch is not supported
						this._sContentDensityClass = "sapUiSizeCompact";
					} else {
						this._sContentDensityClass = "sapUiSizeCozy";
					}
				}
				return this._sContentDensityClass;
			}

		});

	}
);
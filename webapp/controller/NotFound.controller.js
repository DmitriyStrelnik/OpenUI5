sap.ui.define([
		"zjblessons/Lesson6/controller/BaseController"
	], function (BaseController) {
		"use strict";

		return BaseController.extend("zjblessons.Lesson6.controller.NotFound", {

			onLinkPressed : function () {
				this.getRouter().navTo("worklist");
			}

		});

	}
);
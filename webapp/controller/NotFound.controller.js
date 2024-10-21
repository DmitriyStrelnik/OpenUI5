sap.ui.define([
		"zjblessons/Lesson5/controller/BaseController"
	], function (BaseController) {
		"use strict";

		return BaseController.extend("zjblessons.Lesson5.controller.NotFound", {

			onLinkPressed : function () {
				this.getRouter().navTo("worklist");
			}

		});

	}
);
sap.ui.define([
		"zjblessons/Lesson14/controller/BaseController"
	], function (BaseController) {
		"use strict";

		return BaseController.extend("zjblessons.Lesson14.controller.NotFound", {

			/**
			 * Navigates to the worklist when the link is pressed
			 * @public
			 */
			onLinkPressed : function () {
				this.getRouter().navTo("worklist");
			}

		});

	}
);
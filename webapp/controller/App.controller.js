sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller) {
	"use strict";

	return Controller.extend("sap.ui.demo.fiori2.controller.App", {
		onInit: function () {
			this.oOwnerComponent = this.getOwnerComponent();
			this.oRouter = this.oOwnerComponent.getRouter();
			this.oRouter.attachRouteMatched(this.onRouteMatched, this);
		},
		onRouteMatched: function (oEvent) {
			var sRouteName = oEvent.getParameter("name"),
				oArguments = oEvent.getParameter("arguments");
			this._updateUIElements();
			this.currentRouteName = sRouteName;
			this.currentProduct = oArguments.product;
			this.currentSupplier = oArguments.supplier;
		},
		onStateChanged: function (oEvent) {
			var bIsNavigationArrow = oEvent.getParameter("isNavigationArrow"),
				sLayout = oEvent.getParameter("layout");

			this._updateUIElements();
			if (bIsNavigationArrow) {
				this.oRouter.navTo(this.currentRouteName, {layout: sLayout, product: this.currentProduct, supplier: this.currentSupplier}, true);
			}
		},
		_updateUIElements: function () {
			var oModel = this.oOwnerComponent.getModel("design"),
				oUIState;
			this.oOwnerComponent.getHelper().then(function(oHelper) {
				oUIState = oHelper.getCurrentUIState();
				oModel.setData(oUIState);
			});
		},
		onExit: function () {
			this.oRouter.detachRouteMatched(this.onRouteMatched, this);
			this.oRouter.detachBeforeRouteMatched(this.onBeforeRouteMatched, this);
		}
	});
});

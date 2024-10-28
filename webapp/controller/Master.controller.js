sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/Sorter",
	"sap/m/MessageBox"
], function (Controller, Filter, FilterOperator, Sorter, MessageBox) {
	"use strict";

	return Controller.extend("sap.ui.demo.fiori2.controller.Master", {
		onInit: function () {
			this.oView = this.getView();
			this._bDescendingSort = false;
			this.oItemsTable = this.oView.byId("itemsTable");
			this.oModel = this.getOwnerComponent().getModel();
			this.oRouter = this.getOwnerComponent().getRouter();
			
		},

		onSearch: function (oEvent) {
			var sQuery = oEvent.getParameter("query"),
				oTable = this.byId("itemsTable"),
				oBinding = oTable.getBinding("items"),
				aFilters = [];
		
			if (sQuery && sQuery.length > 0) {
				var oFilter = new sap.ui.model.Filter("ItemID", sap.ui.model.FilterOperator.Contains, sQuery);
				aFilters.push(oFilter);
			}
		
			oBinding.filter(aFilters);
		},
		


		onAdd: function () {
			MessageBox.information("This functionality is not ready yet.", {title: "Aw, Snap!"});
		},

		onSort: function () {
			this._bDescendingSort = !this._bDescendingSort;
			var oBinding = this.oItemsTable.getBinding(),
				oSorter = new Sorter("Name", this._bDescendingSort);

			oBinding.sort(oSorter);
		},

		onListItemPress: function (oEvent) {
			var productPath = oEvent.getSource().getBindingContext().getPath(),
				product = productPath.split("/").slice(-1).pop();
			this.getOwnerComponent().getHelper().then(function (oHelper) {
				var oNextUIState = oHelper.getNextUIState(1);
				this.oRouter.navTo("detail", {
					layout: oNextUIState.layout,
					product: product
				});
			}.bind(this));
		}
		
		
	});
});

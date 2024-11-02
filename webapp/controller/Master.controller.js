sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/Sorter",
	"sap/ui/core/Fragment"
], function (Controller,  Sorter,  Fragment) {
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
		
		onPressCreate: function() {
			this._loadCreateDialog();
		},

		_loadCreateDialog : async function () {
				this._oDialog = await Fragment.load({
					name: "sap.ui.demo.fiori2.view.fragment.CreateDialog",
					controller: this,
					id: "CreateNewFields"
				}).then(oDialog => {
					this.getView().addDependent(oDialog);
					return oDialog;
				})	
			this._oDialog.open();
		},
		onDialogBeforeOpen: function(oEvent) {
			const oDialog = oEvent.getSource();
			const oParams = {
						ItemID: "0",
						Created: new Date(),
						IntegrationID: null,
					},
					oEntry = this.getOwnerComponent().getModel().createEntry("/zjblessons_base_Items", {
						properties: oParams
					});

			oDialog.setBindingContext(oEntry);
		},
		onSavePress: function (oEvent)
		{
			this.getOwnerComponent().getModel().submitChanges();
			this._oDialog.close();
			this._oDialog.destroy();
			this._oDialog = null;   
		},
		onPressCancel: function()
		{
			this.getOwnerComponent().getModel().resetChanges();
			this._oDialog.close();
			this._oDialog.destroy(); 
			this._oDialog = null;   
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

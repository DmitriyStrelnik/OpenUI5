sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel"
], function (Controller, JSONModel) {
	"use strict";

	return Controller.extend("sap.ui.demo.fiori2.controller.Detail", {
		onInit: function () {
			this.oOwnerComponent = this.getOwnerComponent();
			this.oRouter = this.oOwnerComponent.getRouter();
			this.oModel = this.oOwnerComponent.getModel();
			this.oDesignModel = this.oOwnerComponent.getModel("design");
			this.oRouter.getRoute("master").attachPatternMatched(this._onProductMatched, this);
			this.oRouter.getRoute("detail").attachPatternMatched(this._onProductMatched, this);
			const oViewModel = new JSONModel();
			this._iPendingRequests = 0;
			this.getOwnerComponent().setModel(oViewModel, "objectView");
			this.getOwnerComponent().getModel().metadataLoaded();
		},
		_onProductMatched: function (oEvent) {
			const	oViewModel = this.getView().getModel("objectView");
			this._product = oEvent.getParameter("arguments").product || this._product || "0";
			this.getView().bindElement({
				path: '/' + this._product,
				events: {
					change: this._onBindingChange.bind(this),
					dataRequested: function () {
						oViewModel.setProperty("/busy", true);
					},
					dataReceived: function () {
						oViewModel.setProperty("/busy", false);
					}
				}
			});
		},
		_onBindingChange: function () {
			const	oView = this.getView();
			const	oElementBinding = this.getView().getElementBinding();
			const	oViewModel = this.getView().getModel("objectView");
			if (!oElementBinding.getBoundContext()) {
				this.getOwnerComponent().getRouter().getTargets().display("objectNotFound");
				return;
			}
			oViewModel.setProperty("/busy", true);
			this._iPendingRequests = 0; 
			const oItemData = oElementBinding.getBoundContext().getObject();
			const sGroupID = oItemData.GroupID;
			const sHeaderID = oItemData.HeaderID;
			const sMaterialID = oItemData.MaterialID;
			const oModel = this.getView().getModel();
			const fnSuccess = function () {
				this._iPendingRequests--;
				if (this._iPendingRequests === 0) {
					oViewModel.setProperty("/busy", false);
				}
			}.bind(this);
			const fnError = function (oError) {
				console.error("Error loading data indormation:", oError);
				this._iPendingRequests--;
				if (this._iPendingRequests === 0) {
					oViewModel.setProperty("/busy", false);
				}
			}.bind(this);
			if (sGroupID) {
				this._iPendingRequests++;
				const sGroupPath = "/zjblessons_base_Groups('" + sGroupID + "')";
				oModel.read(sGroupPath, {
					success: function (oGroupData) {
						const oGroupModel = new JSONModel(oGroupData);
						oView.setModel(oGroupModel, "groupModel");
						fnSuccess();
					},
					error: fnError
				});
			}
			if (sHeaderID) {
				this._iPendingRequests++;
				const sHeaderPath = "/zjblessons_base_Headers('" + sHeaderID + "')";
				oModel.read(sHeaderPath, {
					success: function (oHeaderData) {
						const oHeaderModel = new JSONModel(oHeaderData);
						oView.setModel(oHeaderModel, "headerModel");
						fnSuccess();
					},
					error: fnError
				});
			}
			if (sMaterialID) {
				this._iPendingRequests++;
				const sMaterialPath = "/zjblessons_base_Materials('" + sMaterialID + "')";
				oModel.read(sMaterialPath, {
					success: function (oMaterialData) {
						const oMaterialModel = new JSONModel(oMaterialData);
						oView.setModel(oMaterialModel, "materialModel");
						fnSuccess();
					},
					error: fnError
				});
			}
			if (this._iPendingRequests === 0) {
				oViewModel.setProperty("/busy", false);
			}
		},
		onShowCostInBYN: function () {
			const oItemData = this.getView().getBindingContext().getObject();
			const sPrice = oItemData.Price;
			const sQuantity = oItemData.Quantity;
			const fAmountEUR = parseFloat(sPrice) * parseFloat(sQuantity);
			jQuery.ajax({
				url: "https://api.nbrb.by/exrates/rates/EUR?parammode=2",
				method: "GET",
				dataType: "json",
				success: function (oData) {
					const fAmountBYN = fAmountEUR * (oData.Cur_OfficialRate / oData.Cur_Scale);
					const sMessage = "Price of products in BYN: " + fAmountBYN.toFixed(2) + " BYN";
					sap.m.MessageToast.show(sMessage);
				},
				error: function (oError) {
					sap.m.MessageToast.show("Failed to get the exchange rate.");
					console.error("Error:", oError);
				}
			});
		},

		handleFullScreen: function () {
			var sNextLayout = this.oDesignModel.getProperty("/actionButtonsInfo/midColumn/fullScreen");
			this.oRouter.navTo("detail", {layout: sNextLayout, product: this._product});
		},

		handleExitFullScreen: function () {
			var sNextLayout = this.oDesignModel.getProperty("/actionButtonsInfo/midColumn/exitFullScreen");
			this.oRouter.navTo("detail", {layout: sNextLayout, product: this._product});
		},

		handleClose: function () {
			var sNextLayout = this.oDesignModel.getProperty("/actionButtonsInfo/midColumn/closeColumn");
			this.oRouter.navTo("master", {layout: sNextLayout});
		},

		onExit: function () {
			this.oRouter.getRoute("master").detachPatternMatched(this._onProductMatched, this);
			this.oRouter.getRoute("detail").detachPatternMatched(this._onProductMatched, this);
		}
	});
});

/*global location history */
sap.ui.define([
		"zjblessons/Lesson4/controller/BaseController",
		"sap/ui/model/json/JSONModel",
		"zjblessons/Lesson4/model/formatter",
		"sap/ui/model/Filter",
		"sap/ui/model/Sorter",
		"sap/ui/model/FilterOperator"
	], function (BaseController, JSONModel, formatter, Filter, Sorter, FilterOperator) {
		"use strict";

		return BaseController.extend("zjblessons.Lesson4.controller.Worklist", {

			formatter: formatter,
 
			onInit : function () {
				var oViewModel,
					iOriginalBusyDelay,
					oTable = this.byId("table");
 
				iOriginalBusyDelay = oTable.getBusyIndicatorDelay();
  
				this._aTableSearchState = [];
				oViewModel = new JSONModel({
					worklistTableTitle : this.getResourceBundle().getText("worklistTableTitle"),
					shareOnJamTitle: this.getResourceBundle().getText("worklistTitle"),
					tableNoDataText : this.getResourceBundle().getText("tableNoDataText"),
					tableBusyDelay : 0
				});
				this.setModel(oViewModel, "worklistView");
				oTable.attachEventOnce("updateFinished", function(){
 
					oViewModel.setProperty("/tableBusyDelay", iOriginalBusyDelay);
				});
			},

			onUpdateFinished : function (oEvent) {
				 
				var sTitle,
					oTable = oEvent.getSource(),
					iTotalItems = oEvent.getParameter("total");
 
				if (iTotalItems && oTable.getBinding("items").isLengthFinal()) {
					sTitle = this.getResourceBundle().getText("worklistTableTitleCount", [iTotalItems]);
				} else {
					sTitle = this.getResourceBundle().getText("worklistTableTitle");
				}
				this.getModel("worklistView").setProperty("/worklistTableTitle", sTitle);
			},

			
			onPress : function (oEvent) {
				// The source is the list item that got pressed
				this._showObject(oEvent.getSource());
			},
 
			onNavBack : function() {
				history.go(-1);
			},


			onSearchDocumentDate : function (oEvent) 
			{
				const sValue = oEvent.getParameter('value');
				this._searchHandlerDocumentNumber(sValue);
			},
			
			onSearchPlantText : function (oEvent) 
			{
				const sValue = oEvent.getParameter('value');
				this._searchHandlerPlantText(sValue);
			},
			onNewSearchDocumentNumber : function (oEvent)
			{
			const sValue = oEvent.getParameter('newValue');
			this._searchHandler("DocumentNumber",sValue);
			},
			
			onNewSearchPlantText : function (oEvent)
			{
			const sValue = oEvent.getParameter('newValue');
			this._searchHandler("PlantText",sValue);
			},
			
			_searchHandler : function(sField, sValue){
				const oTable= this.getView().byId("table"),
					oFilter = sValue && sValue.length > 0 ?  [new Filter(sField, sField === "DocumentNumber" ? FilterOperator.Contains : FilterOperator.EQ, sValue)] : [];
				oTable.getBinding('items').filter(oFilter);
			},

		});
	}
);
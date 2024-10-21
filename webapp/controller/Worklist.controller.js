/*global location history */
sap.ui.define([
		"zjblessons/Lesson5/controller/BaseController",
		"sap/ui/model/json/JSONModel",
		"zjblessons/Lesson5/model/formatter",
		"sap/ui/model/Filter",
		"sap/ui/model/Sorter",
		"sap/ui/model/FilterOperator",
		"sap/ui/core/Fragment"
	], function (BaseController, JSONModel, formatter, Filter, Sorter, FilterOperator, Fragment) {
		"use strict";

		return BaseController.extend("zjblessons.Lesson5.controller.Worklist", {

			formatter: formatter,
 
			onInit : function () {
				const oViewModel = new JSONModel({
					sTotal: 0
				});
				this.setModel(oViewModel, "worklistView");
					
			},
			onBeforeRendering: function(){
				this._bindTable();
			},
			_bindTable : function(bIsRefresh = false){
			const oTable = this.getView().byId('table');

				oTable.bindItems({
				path: '/zjblessons_base_Headers',	
				sorter: [new Sorter('DocumentDate', true)],
				template: this._getTableTemplate(),
				urlParameters:{
					$select:'HeaderID,DocumentNumber,DocumentDate,PlantText,RegionText,Description,Created'
					},
				events: 
					{
						dataRequested: (oData) => {
							this._getTotalItems();
						},
						dataReceived: () => {
							if (bIsRefresh) {
								sap.m.MessageToast.show("Table successfully updated");
							}
						}
					},
				})
			},
			_getTotalItems: function()
			{
				this.getModel().read(
					'/zjblessons_base_Headers/$count',
					{
					success: (sTotal) => 
						{this.getModel('worklistView').setProperty('/sTotal', sTotal)}
					})
			},
			_getTableTemplate: function()
			{
				const oTemplate= new sap.m.ColumnListItem({
					type: 'Navigation',
					navigated: true,
					cells: [
					new sap.m.Text({ text: "{DocumentNumber}" }),
					new sap.m.Text({
						text: {
							path: "DocumentDate",
							formatter: function(sDate) {
								if (sDate) {
									var oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({
										pattern: "yyyy-MM-dd"
									});
									return oDateFormat.format(new Date(sDate));
								}
								return "";
							}
						}
					}),
					new sap.m.Text({ text: "{PlantText}" }),
					new sap.m.Text({ text: "{RegionText}" }),
					new sap.m.Text({ text: "{Description}" }),
					new sap.m.Text({ text: "{Created}" }),
					new sap.m.Button({icon: this.getResourceBundle().getText('deleteIcon'),
						press: this.onPressDeleteItem.bind(this),
						type:'Transparent'
					}),
					]	
				})
				return oTemplate;
			},
			onPressDeleteItem: function(oEvent){
				const oBindingContext= oEvent.getSource().getBindingContext();
				const sKey= this.getModel().createKey('/zjblessons_base_Headers', {HeaderID: oBindingContext.getProperty('HeaderID')});
				this.getModel().remove(sKey);
			},
			onRefresh: function() {
				this._bindTable(true);
			},
			onPressCreate() {
				this._loadCreateDialog();
			},
	
			_loadCreateDialog : async function () {
					this._oDialog = await Fragment.load({
						name: "zjblessons.Lesson5.view.fragment.CreateDialog",
						controller: this,
						id: "CreateNewFields"
					}).then(oDialog => {
						this.getView().addDependent(oDialog);
						return oDialog;
					})	
				this._oDialog.open();
			},
	
			onDialogBeforeOpen(oEvent) {
				const oDialog = oEvent.getSource();
				const oParams = {
							Version: "A",
							HeaderID: "0", 
							Created: new Date(),
							IntegrationID: null,
						},
						oEntry = this.getModel().createEntry("/zjblessons_base_Headers", {
							properties: oParams
						});
	
				oDialog.setBindingContext(oEntry);
			},
			onSavePress(oEvent) {
				this.getModel().submitChanges();
				this._oDialog.close();
				this._oDialog.destroy();
				this._oDialog = null;   
			},
			onPressCancel: function()
			{
				this.getModel().resetChanges();
				this._oDialog.close();
				this._oDialog.destroy(); 
				this._oDialog = null;   
			},
			_onDateRangeChange: function (oEvent) {
				const oDateRangeSelection = oEvent.getSource();
				const oStartDate = oDateRangeSelection.getDateValue();
				const oEndDate = oDateRangeSelection.getSecondDateValue();
				const oTable = this.getView().byId("table");
			
				if (oStartDate && oEndDate) {
					const oFilter = new Filter({
						path: "DocumentDate",
						operator: FilterOperator.BT,
						value1: oStartDate,
						value2: oEndDate
					});
					oTable.getBinding("items").filter([oFilter]);
				} else {
					oTable.getBinding("items").filter([]);
				}
			}

		});
	}
);
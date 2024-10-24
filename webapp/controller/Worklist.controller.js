/*global location history */
sap.ui.define([
		"zjblessons/Lesson6/controller/BaseController",
		"sap/ui/model/json/JSONModel",
		"zjblessons/Lesson6/model/formatter",
		"sap/ui/model/Filter",
		"sap/ui/model/Sorter",
		"sap/ui/model/FilterOperator",
		"sap/ui/core/Fragment"
	], function (BaseController, JSONModel, formatter, Filter, Sorter, FilterOperator, Fragment) {
		"use strict";

		return BaseController.extend("zjblessons.Lesson6.controller.Worklist", {

			formatter: formatter,
 
			onInit : function () {
				const oViewModel = new JSONModel({
					sTotal: 0,
					sITBKey: 'All'
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
				filters: this._getTableFilters(),
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
			_getTableFilters: function()
			{
				const oWorkListModel = this.getModel('worklistView');
				const sSelectedKey = oWorkListModel.getProperty('/sITBKey');
				return sSelectedKey === 'All' ? [] : [new Filter('Version', 'EQ', 'D')];
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
					highlight: "{= ${Version} ===  'A' ? 'Success' : 'Error'}",
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
					new sap.m.Switch({ switchType: "AcceptReject",
						state: "{= ${Version} === 'D'}",
						change: this.ChangeVersion.bind(this)
					 }),
					new sap.m.Button({icon: this.getResourceBundle().getText('deleteIcon'),
						press: this.onPressDeleteItem.bind(this),
						type:'Transparent'
					}),
					]	
				})
				return oTemplate;
			},
			ChangeVersion: function(oEvent){
				const sVersion = oEvent.getParameter('state') ? 'D': 'A';
				const sPath= oEvent.getSource().getBindingContext().getPath();
				this.getModel().setProperty(`${sPath}/Version`, sVersion);
				this.getModel().submitChanges({
					success: () => {
						sap.m.MessageToast.show("Version successfully updated.");
					},
					error: () => {
						sap.m.MessageToast.show("Error updating version.");
					}
				});
			},
			onPressDeleteItem: function(oEvent){
				const oBindingContext= oEvent.getSource().getBindingContext();
				const sKey= this.getModel().createKey('/zjblessons_base_Headers', {HeaderID: oBindingContext.getProperty('HeaderID')});
				this.getModel().remove(sKey);
			},
			onRefresh: function() {
				this._bindTable(true);
			},
			onPressCreate: function() {
				this._loadCreateDialog();
			},
	
			_loadCreateDialog : async function () {
					this._oDialog = await Fragment.load({
						name: "zjblessons.Lesson6.view.fragment.CreateDialog",
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
			},
			onItemSelect: function(oEvent){
				const oSelectedItem = oEvent.getParameter('listItem');
				const sHeaderID = oSelectedItem.getBindingContext().getProperty('HeaderID');
				this.getRouter().navTo('object',{
					objectId: sHeaderID
				})
			},
			
			OnIconTabHeaderSelect: function(oEvent)
			{
				const oSelctedKey= oEvent.getParameter('key');
				this.getModel('worklistView').setProperty('/sITBKey', oSelctedKey);
				this._bindTable();
			}

		});
	}
);
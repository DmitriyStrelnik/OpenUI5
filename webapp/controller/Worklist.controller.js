/*global location history */
sap.ui.define([
	"zjblessons/Lesson14/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"zjblessons/Lesson14/model/formatter",
	"sap/ui/model/Filter",
	"sap/ui/model/Sorter",
	"sap/ui/model/FilterOperator",
	"sap/ui/core/Fragment",
	"sap/m/MessageToast"
], function (BaseController, JSONModel, formatter, Filter, Sorter, FilterOperator, Fragment, MessageToast) {
	"use strict";

	return BaseController.extend("zjblessons.Lesson14.controller.Worklist", {
		formatter: formatter,

        onInit: function () {
            const oViewModel = new JSONModel({
                sTotal: 0,
                sITBKey: 'All',
                selection: {}
            });
            this.setModel(oViewModel, "worklistView");
            this.getOwnerComponent().getModel().setDefaultBindingMode(sap.ui.model.BindingMode.OneWay);
        },
        onBeforeRendering: function () {
            this._bindTable();
        },
        _bindTable: function (bIsRefresh = false) {
            const oTable = this.getView().byId('table');

            const oGroupSorter = new Sorter('RegionText', true, true);

            oTable.bindItems({
                path: '/zjblessons_base_Headers',
                sorter: oGroupSorter,
                templateShareable: false,
                template: this._getTableTemplate(),
                filters: this._getTableFilters(),
                urlParameters: {
                    $select: 'HeaderID,DocumentNumber,DocumentDate,PlantText,RegionText,Description,Created,Version'
                },
                events: {
                    dataReceived: () => {
                        this._getTotalItems();
                        if (bIsRefresh) {
                            sap.m.MessageToast.show("Table successfully updated");
                        }
                    }
                },
            });
        },

        _getTableTemplate: function () {
            const oTemplate = new sap.m.ColumnListItem({
                highlight: "{= ${Version} ===  'A' ? 'Success' : 'Error'}",
                type: 'Inactive', 
                cells: [
                    new sap.m.Text({
                        text: "{DocumentNumber}"
                    }),
                    new sap.m.Text({
                        text: {
                            path: "DocumentDate",
                            type: "sap.ui.model.type.Date",
                            formatOptions: { pattern: "yyyy-MM-dd" }
                        }
                    }),
                    new sap.m.Text({
                        text: "{PlantText}"
                    }),
                    new sap.m.Text({
                        text: "{RegionText}"
                    }),
                    new sap.m.Input({
                        value: {
                            path: "Description",
                            mode: 'TwoWay'
                        }
                    }),
                    new sap.m.Text({
						text: {
                            path: "Created",
                            type: "sap.ui.model.type.Date",
                            formatOptions: { pattern: "yyyy-MM-dd" }
                        }
                    }),
                    new sap.m.Switch({
                        switchType: "AcceptReject",
                        state: "{= ${Version} === 'D'}",
                        change: this.ChangeVersion.bind(this)
                    }),
                ]
            });
            return oTemplate;
        },
        onSaveChanges: function () {
            const oModel = this.getModel();
            const oPendingChanges = oModel.getPendingChanges();

            if (oPendingChanges && Object.keys(oPendingChanges).length > 0) {
                this.getView().setBusy(true);
                oModel.submitChanges({
                    success: () => {
                        this.getView().setBusy(false);
						this.getModel().refresh(true);
                        MessageToast.show("Changes saved successfully.");
						
                    },
                    error: () => {
                        this.getView().setBusy(false);
                        MessageToast.show("Error saving changes.");
                    }
                });
            } else {
                MessageToast.show("No changes to save.");
            }
        },
		_getTableFilters: function () {
			const oWorkListModel = this.getModel('worklistView');
			const sSelectedKey = oWorkListModel.getProperty('/sITBKey');
			return sSelectedKey === 'All' ? [] : [new Filter('Version', 'EQ', 'D')];
		},
		_getTotalItems: function () {
			// CountMode - Inline установил в моделе в manifest.json
			const oBinding = this.getView().byId("table").getBinding("items");
			var sTotal = oBinding.getLength(); 
			this.getModel('worklistView').setProperty('/sTotal', sTotal)
		},
		ChangeVersion: function (oEvent) {
			const sVersion = oEvent.getParameter('state') ? 'D' : 'A';
			const sPath = oEvent.getSource().getBindingContext().getPath();
			this.getModel().setProperty(`${sPath}/Version`, sVersion);
			this.getModel().submitChanges({
				success: () => {
					sap.m.MessageToast.show("Version successfully updated.");
					this.getModel().refresh(true);
				},
				error: () => {
					sap.m.MessageToast.show("Error updating version.");
				}
			});
		},	
		onRefresh: function () {
			this._bindTable(true);
		},
		OnIconTabHeaderSelect: function (oEvent) {
			const oSelctedKey = oEvent.getParameter('key');
			this.getModel('worklistView').setProperty('/sITBKey', oSelctedKey);
			this._bindTable();
		},

	});
});
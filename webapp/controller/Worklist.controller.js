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

			var oViewModel = new JSONModel({
				sTotal: '0',
			});
    		this.setModel(oViewModel, "worklistView");
			this.getOwnerComponent().getModel().setDefaultBindingMode(sap.ui.model.BindingMode.OneWay);
   			 this._loadData();
        },
		_loadData: function() {
			this.getOwnerComponent().getModel().read("/zjblessons_base_Headers", {
				success: function(oData) {
					oData.results.forEach(function(item, index) {
						item.order = index+1;
					});
					this.getModel("worklistView").setData({ items: oData.results });
					this._getTotalItems();
				}.bind(this),
				error: function(oError) {
					sap.m.MessageToast.show("Ошибка загрузки данных.");
				}
			});
		},
        onBeforeRendering: function () {
            this._bindTable();
        },
        _bindTable: function (bIsRefresh = false) {
			const oTable = this.getView().byId('table');
			oTable.bindItems({
				path: 'worklistView>/items',
				templateShareable: false,
				template: this._getTableTemplate(),
				events: {
					dataReceived: () => {
						if (bIsRefresh) {
							sap.m.MessageToast.show("Таблица успешно обновлена");
						}
					}
				},
			});
		},
		onDrop: function(oEvent) {
            var oDragged = oEvent.getParameter("draggedControl");
            var oDropped = oEvent.getParameter("droppedControl");
            var sInsertPosition = oEvent.getParameter("dropPosition");

            var oTable = this.byId("table");
            var aItems = this.getModel("worklistView").getProperty("/items");

            var iDraggedIndex = oTable.indexOfItem(oDragged);
            var iDroppedIndex = oTable.indexOfItem(oDropped);

            if (sInsertPosition === "After") {
                iDroppedIndex++;
            }

            var aMovedItem = aItems.splice(iDraggedIndex, 1);
            aItems.splice(iDroppedIndex, 0, aMovedItem[0]);

            this.getModel("worklistView").setProperty("/items", aItems);
        },
				

        _getTableTemplate: function () {
            const oTemplate = new sap.m.ColumnListItem({
                highlight: "{= ${worklistView>Version} ===  'D' ? 'Error' : 'Success'}",
                type: 'Inactive', 
                cells: [
					new sap.m.Text({
                        text: "{worklistView>order}"
                    }),
                    new sap.m.Text({
                        text: "{worklistView>DocumentNumber}"
                    }),
                    new sap.m.Text({
                        text: {
                            path: "worklistView>DocumentDate",
                            type: "sap.ui.model.type.Date",
                            formatOptions: { pattern: "yyyy-MM-dd" }
                        }
                    }),
                    new sap.m.Text({
                        text: "{worklistView>PlantText}"
                    }),
                    new sap.m.Text({
                        text: "{worklistView>RegionText}"
                    }),
                    new sap.m.Text({
                        text:  "{worklistView>Description}"   
                    }),
                    new sap.m.Text({
						text: {
                            path: "worklistView>Created",
                            type: "sap.ui.model.type.Date",
                            formatOptions: { pattern: "yyyy-MM-dd" }
                        }
                    }),
                    new sap.m.Switch({
                        state: "{= ${worklistView>Version} === 'D'}",
                        change: this.ChangeVersion.bind(this)
                    }),
                ]
            });
            return oTemplate;
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
		onApplyFilter: function() {
            var oCombinedFilter = new Filter({
                filters: [new Filter("Version", FilterOperator.EQ, "D"), new Filter("Description", FilterOperator.EQ, "333")],
                and: true
            });

            var oTable = this.byId("table");
            var oBinding = oTable.getBinding("items");
            oBinding.filter([oCombinedFilter]);

            this._getTotalItems();
        },
		onApplyPartialFilter: function() {
            var oCombinedFilter = new Filter({
                filters: [new Filter("Version", FilterOperator.EQ, "D"), new Filter("Description", FilterOperator.EQ, "333")],
                and: false
            });

            var oTable = this.byId("table");
            var oBinding = oTable.getBinding("items");
            oBinding.filter([oCombinedFilter]);

            this._getTotalItems();
        },
        onClear: function() {
            var oTable = this.byId("table");
            var oBinding = oTable.getBinding("items");
            oBinding.filter([]);
			oBinding.sort(null)
            this._getTotalItems();
        },

        onApplySort: function() {
            var oSorter1 = new Sorter("RegionText", false);
            var oSorter2 = new Sorter("DocumentNumber", true);

            var oTable = this.byId("table");
            var oBinding = oTable.getBinding("items");
            oBinding.sort([oSorter1, oSorter2]);

            this._getTotalItems();
        },

	});
});
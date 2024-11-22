/*global location history */
sap.ui.define([
		"zjblessons/Lesson18/controller/BaseController",
		"sap/ui/model/json/JSONModel",
	], function (BaseController, JSONModel) {
		"use strict";

		return BaseController.extend("zjblessons.Lesson18.controller.Worklist", {
			// Таблицы jbcommon_auth_CreatedBy и jbcommon_auth_ModifiedBy не имеют поля CreatedByAvatar и ModifiedByAvatar. 
			// Так как по заданию требовалось указывать эти таблицы и Аватары из других таблиц пусты(Items), я оставил таблицы по условию.
			jsonAnnotation: new JSONModel({
				RequestAtLeast: "",
				Annotation: [
				  {
					"id": "HeaderID",
					"label": "{i18n>HeaderID}",
					"Filter": {
					  "order": 1,
					  "visible": true,
					  "hidden": false,
					  "mode": "SingleSelectMaster",
					  "filter": "HeaderID",
					  "text": "HeaderID",
					  "sort": "HeaderID",
					  "key": "HeaderID",
					  "entitySet": "zjblessons_base_Headers",
					  
					},
					"Column": {
					  "order": 1,
					  "sortProperty": "HeaderID",
					  "visible": true,
					  "type": "text",
					  "select": "HeaderID",
					  "text": "{HeaderID}"
					}					
				  },
				  {
					"id": "MaterialID",
					"label": "{i18n>MaterialID}",
					"Filter": {
					  "order": 2,
					  "visible": true,
					  "hidden": false,
					  "mode": "MultiSelect",
					  "filter": "MaterialID",
					  "text": "MaterialID",
					  "sort": "MaterialID",
					  "key": "MaterialID",
					  "entitySet": "zjblessons_base_Materials",
					  
					},
					"Column": {
					  "order": 2,
					  "sortProperty": "MaterialID",
					  "visible": true,
					  "type": "text",
					  "select": "MaterialID",
					  "text": "{MaterialID}"
					}					
				  },
				  {
					"id": "GroupID",
					"label": "{i18n>GroupID}",
					"Filter": {
					  "order": 3,
					  "visible": true,
					  "hidden": false,
					  "mode": "MultiSelect",
					  "filter": "GroupID",
					  "text": "GroupID",
					  "sort": "GroupID",
					  "key": "GroupID",
					  "entitySet": "zjblessons_base_Groups",
					  
					},
					"Column": {
					  "order": 3,
					  "sortProperty": "GroupID",
					  "visible": true,
					  "type": "text",
					  "select": "GroupID",
					  "text": "{GroupID}"
					}					
				  },
				  {
					"id": "SubGroupID",
					"label": "{i18n>SubGroupID}",
					"Filter": {
					  "order": 4,
					  "visible": true,
					  "hidden": false,
					  "mode": "MultiSelect",
					  "filter": "SubGroupID",
					  "text": "SubGroupID",
					  "sort": "SubGroupID",
					  "key": "SubGroupID",
					  "entitySet": "zjblessons_base_SubGroups",
					  
					},
					"Column": {
					  "order": 4,
					  "sortProperty": "SubGroupID",
					  "visible": true,
					  "type": "text",
					  "select": "SubGroupID",
					  "text": "{SubGroupID}"
					}					
				  },
				  {
					"id": "Quantity",
					"label": "{i18n>Quantity}",
					"Filter": {
					  "order": 5,
					  "visible": true,
					  "hidden": false,
					  "mode": "SearchField",
					  "filter": "Quantity",
					  "text": "Quantity",
					  "sort": "Quantity",
					  "key": "Quantity",
					  "filterKey": "Quantity",
					  "entitySet": "zjblessons_base_Items",
					  
					},
					"Column": {
					  "order": 5,
					  "sortProperty": "Quantity",
					  "visible": true,
					  "type": "number",
					  "select": "Quantity",
					  "text": "{Quantity}"
					}					
				  },
				  {
					"id": "Price",
					"label": "{i18n>Price}",
					"Filter": {
					  "order": 6,
					  "visible": true,
					  "hidden": false,
					  "mode": "SearchField",
					  "filter": "Price",
					  "text": "Price",
					  "sort": "Price",
					  "key": "Price",
					  "filterKey": "Price",
					  "entitySet": "zjblessons_base_Items",
					  
					},
					"Column": {
					  "order": 6,
					  "sortProperty": "Price",
					  "visible": true,
					  "type": "number",
					  "select": "Price",
					  "text": "{Price}"
					}					
				  },
				  {
					"id": "Created",
					"label": "{i18n>Created}",
					"Filter": {
					  "order": 7,
					  "visible": true,
					  "hidden": false,
					  "mode": "DateFilter",
					  "entitySet": "zjblessons_base_Items",
					  "datePath": "Created",
            		  "dateMode": true,
					  "selectedPeriod": "all",
            		  "visiblePeriodButtons": "day, week, month, year, all"
					},
					"Column": {
					  "order": 7,
					  "sortProperty": "Created",
					  "visible": true,
					  "type": "date",
					  "select": "Created",
					  "text": "{Created}",
					   "sortOrder": 1,
    				   "sort": "desc"  
					}					
				  },
				  {
					"id": "CreatedBy",
					"label": "{i18n>CreatedBy}",
					"Filter": {
					  "order": 8,
					  "visible": true,
					  "hidden": false,
					  "mode": "MultiSelect",
					  "filter": "CreatedBy",
					  "text": "CreatedByFullName",
					  "sort": "CreatedByFullName",
					  "key": "CreatedBy",
					  "entitySet": "jbcommon_auth_CreatedBy",
					  "image": "CreatedByAvatar"
					},
					"Column": {
					  "order": 8,
					  "sortProperty": "CreatedByFullName",
					  "visible": true,
					  "type": "avatarAndLink",
					  "select": "CreatedByAvatar,CreatedByFullName",
					}					
				  },
				  {
					"id": "Modified",
					"label": "{i18n>Modified}",
					"Filter": {
					  "order": 9,
					  "visible": true,
					  "hidden": false,
					  "mode": "DateFilter",
					  "filter": "Modified",
					  "text": "Modified",
					  "sort": "Modified",
					  "key": "Modified",
					  "entitySet": "zjblessons_base_Items",
					  "datePath": "Modified",
            		  "dateMode": true,
					  "selectedPeriod": "all",
            		  "visiblePeriodButtons": "day, week, month, year, all"
					  
					},
					"Column": {
					  "order": 9,
					  "sortProperty": "Modified",
					  "visible": true,
					  "type": "dateTime",
					  "select": "Modified",
					  "text": "{Modified}"
					}					
				  },
				  {
					"id": "ModifiedBy",
					"label": "{i18n>ModifiedBy}",
					"Filter": {
					  "order": 10,
					  "visible": true,
					  "hidden": false,
					  "mode": "MultiSelect",
					  "filter": "ModifiedBy",
					  "text": "ModifiedByFullName",
					  "sort": "ModifiedByFullName",
					  "key": "ModifiedBy",
					  "entitySet": "jbcommon_auth_ModifiedBy",
					  "image": "ModifiedByAvatar"
					},
					"Column": {
					  "order": 10,
					  "sortProperty": "ModifiedByFullName",
					  "visible": true,
					  "type": "avatarAndLink",
					  "select": "ModifiedByAvatar, ModifiedByFullName",
					}					
				  },
				],
			}),
			onInit : function () {
				const oViewModel = new JSONModel({});
				this.setModel(oViewModel, "worklistView");
				this.setModel(this.jsonAnnotation, "annotation");
			},
			onPressRefresh:function(){
				this.byId('table').getBinding('rows').refresh();
			  },
		
			  prepareSelect: function (oEvent) {
				this.aSorter = oEvent.getParameter("aSorts");
				this.sSelect = oEvent.getParameter("sSelect");
		
				this.callBindTable();
			  },
		
			  callBindTable: function (sPath) {
				if (this.sSelect && this.aFilters) {
				let sRequestAtLeast = this.getModel('annotation').getData().RequestAtLeast;
				  this.byId("table").bindRows({
					path: "/zjblessons_base_Items",
					template: new sap.ui.table.Row({}),
					filters: this.aFilters,
					sorter: this.aSorter,
					parameters: {
					  select: this.sSelect + (sRequestAtLeast ? ","+ sRequestAtLeast: ''),
					},
				  });
				}
			  },
		
			  onPressFilterBarChange: function (oEvent) {
				  this.aFilters = oEvent.getParameter("OdataFilters");
				  
				  this.callBindTable();
			  }
		

		});
	}
);
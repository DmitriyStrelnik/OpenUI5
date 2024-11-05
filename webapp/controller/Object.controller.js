/*global location*/
sap.ui.define([
	"zjblessons/Lesson6/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/routing/History",
	"zjblessons/Lesson6/model/formatter",
	"sap/ui/core/Fragment",
	"sap/m/MessageBox",
], function (
	BaseController,
	JSONModel,
	History,
	formatter,
	Fragment,
	MessageBox
) {
	"use strict";

	return BaseController.extend("zjblessons.Lesson6.controller.Object", {

		formatter: formatter,


		onInit: function () {
			var iOriginalBusyDelay,
				oViewModel = new JSONModel({
					busy: true,
					delay: 0,
					bEditMode: false,
					sSelectedTab: 'List'
				});

			this.getRouter().getRoute("object").attachPatternMatched(this._onObjectMatched, this);
			iOriginalBusyDelay = this.getView().getBusyIndicatorDelay();
			this.setModel(oViewModel, "objectView");
			this.getOwnerComponent().getModel().metadataLoaded().then(function () {
				oViewModel.setProperty("/delay", iOriginalBusyDelay);
			});
		},


		onNavBack: function () {
			this._NavBack();
		},
		_NavBack: function()
		{
			var sPreviousHash = History.getInstance().getPreviousHash();

			if (sPreviousHash !== undefined) {
				history.go(-1);
			} else {
				this.getRouter().navTo("worklist", {}, true);
			}
		},
		_onObjectMatched: function (oEvent) {
			var sObjectId = oEvent.getParameter("arguments").objectId;
			this.getModel().metadataLoaded().then(function () {
				var sObjectPath = this.getModel().createKey("zjblessons_base_Headers", {
					HeaderID: sObjectId
				});
				this._bindView("/" + sObjectPath);
			}.bind(this));
		},

		_bindView: function (sObjectPath) {
			var oViewModel = this.getModel("objectView"),
				oDataModel = this.getModel();

			this.getView().bindElement({
				path: sObjectPath,
				events: {
					change: this._onBindingChange.bind(this),
					dataRequested: function () {
						oDataModel.metadataLoaded().then(function () {
							oViewModel.setProperty("/busy", true);
						});
					},
					dataReceived: function () {
						oViewModel.setProperty("/busy", false);
					}
				}
			});
		},

		_onBindingChange: function () {
			var oView = this.getView(),
				oViewModel = this.getModel("objectView"),
				oElementBinding = oView.getElementBinding();
			if (!oElementBinding.getBoundContext()) {
				this.getRouter().getTargets().display("objectNotFound");
				return;
			}
		},

		onPressEdit: function () {
			this._setEditModel(true)
		},

		onPressSave: function () {
			
			const oModel = this.getModel();
    		const oView = this.getView();
    		const oBindingContext = oView.getBindingContext();
    		const sPath = oBindingContext.getPath();
    		const oPendingChanges = oModel.getPendingChanges();
			if (oPendingChanges.hasOwnProperty(sPath.slice(1))) {
				oView.setBusy(true);
				oModel.submitChanges({
					success: () => {
						oView.setBusy(false);
						this._setEditModel(false); 
					},
					error: () => {
						oView.setBusy(false);
					}
				})
			}
			this._setEditModel(false)
		},
		onPressCancel: function () {
			this._setEditModel(false);
			this.getModel().resetChanges();
		},
		onPressDelete: function(){
			const oView= this.getView();
			const sPath= oView.getBindingContext().getPath();
			MessageBox.confirm("Are you sure you want to delete this document?",
				{
					title:	'Confirmation',
					styleClass: 'SapUiSizeCozy',
					actions: [MessageBox.Action.DELETE, MessageBox.Action.NO],
					onClose: function(sDecision) {
						if(sDecision === 'DELETE'){
							oView.setBusy(true);
							this.getModel().remove(sPath, {
								success: function(){
									oView.setBusy(false);
									this._NavBack();
								}.bind(this),
								error: function(){
								}.bind(this)

							});
						}
					}.bind(this)
					
					
				}
			);
		},
		_setEditModel: function (bValue) {
			const oModel = this.getModel("objectView");
			const oIconTabBar = this.getView().byId('idIconTabBar')._getIconTabHeader();

			oIconTabBar.setBlocked(bValue);
			oModel.setProperty('/bEditMode', bValue)
		},
		onIconTabBarSelect: function (oEvent) {
			const sSelectedKey = oEvent.getParameter('selctedKey');
			this.getModel('objectView').setProperty('/sSelectedTab', sSelectedKey);
		},
		onBeforeRendering: function () {
			this._bindTemplate();
		},
		_bindTemplate: async function () {
			const oComboBox = this.getView().byId('idComboBoxList');
			const oTemplate = await this._getPlantTemplate();
			oComboBox.bindItems({
				path: '/zjblessons_base_Plants',
				template: oTemplate,
				events: {
					dataReceived: () => {
						oComboBox.setBusy(false);
					},
					dataRequested: () => {
						oComboBox.setBusy(true);
					}

				}
			})
		},
		_getPlantTemplate: async function () {

			this._pPlantTempalte ??= Fragment.load({
				name: 'zjblessons.Lesson6.view.fragment.template.ComboBoxItem',
				id: 'idGetPlants',
				controller: this
			}).then((oTemplate) => {
				this.getView().addDependent(oTemplate);
				return oTemplate;
			})
			return this._pPlantTempalte;
		}

	});

});
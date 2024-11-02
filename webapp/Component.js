sap.ui.define([
    'sap/ui/core/UIComponent',
    'sap/f/FlexibleColumnLayoutSemanticHelper',
    'sap/f/library'
], function(UIComponent, FlexibleColumnLayoutSemanticHelper, fioriLibrary) {
    'use strict';

    return UIComponent.extend('sap.ui.demo.fiori2.Component', {

        metadata: {
            manifest: 'json'
        },

        init: function () {
            UIComponent.prototype.init.apply(this, arguments);
            this.getRootControl().loaded().then(function(oRootControl) {
                const oRouter = this.getRouter();
                oRouter.attachBeforeRouteMatched(this._onBeforeRouteMatched, this);
                oRouter.initialize();
            }.bind(this));
        },

        getHelper: function () {
            return this.getRootControl().loaded().then(function(oRootControl) {
                var oFCL = oRootControl.byId("flexibleColumnLayout");
                if (!oFCL) {
                    return Promise.reject("FlexibleColumnLayout not found.");
                }
                var oSettings = {
                    defaultTwoColumnLayoutType: fioriLibrary.LayoutType.TwoColumnsMidExpanded,
                    defaultThreeColumnLayoutType: fioriLibrary.LayoutType.ThreeColumnsMidExpanded
                };
                return FlexibleColumnLayoutSemanticHelper.getInstanceFor(oFCL, oSettings);
            });
        },

        _onBeforeRouteMatched: function(oEvent) {
            var oModel = this.getModel("design"),
                sLayout = oEvent.getParameters().arguments.layout;
            if (!sLayout) {
                this.getHelper().then(function(oHelper) {
                    var oNextUIState = oHelper.getNextUIState(0);
                    oModel.setProperty("/layout", oNextUIState.layout);
                });
                return;
            }
            oModel.setProperty("/layout", sLayout);
        }
    });
});

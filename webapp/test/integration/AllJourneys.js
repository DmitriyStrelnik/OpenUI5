/*global QUnit*/

jQuery.sap.require("sap.ui.qunit.qunit-css");
jQuery.sap.require("sap.ui.thirdparty.qunit");
jQuery.sap.require("sap.ui.qunit.qunit-junit");
QUnit.config.autostart = false;

sap.ui.require([
	"sap/ui/test/Opa5",
	"zjblessons/Lesson4/test/integration/pages/Common",
	"sap/ui/test/opaQunit",
	"zjblessons/Lesson4/test/integration/pages/Worklist",
	"zjblessons/Lesson4/test/integration/pages/Object",
	"zjblessons/Lesson4/test/integration/pages/NotFound",
	"zjblessons/Lesson4/test/integration/pages/Browser",
	"zjblessons/Lesson4/test/integration/pages/App"
], function (Opa5, Common) {
	"use strict";
	Opa5.extendConfig({
		arrangements: new Common(),
		viewNamespace: "zjblessons.Lesson4.view."
	});

	sap.ui.require([
		"zjblessons/Lesson4/test/integration/WorklistJourney",
		"zjblessons/Lesson4/test/integration/ObjectJourney",
		"zjblessons/Lesson4/test/integration/NavigationJourney",
		"zjblessons/Lesson4/test/integration/NotFoundJourney"
	], function () {
		QUnit.start();
	});
});
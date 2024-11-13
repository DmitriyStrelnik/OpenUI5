/*global QUnit*/

jQuery.sap.require("sap.ui.qunit.qunit-css");
jQuery.sap.require("sap.ui.thirdparty.qunit");
jQuery.sap.require("sap.ui.qunit.qunit-junit");
QUnit.config.autostart = false;

sap.ui.require([
	"sap/ui/test/Opa5",
	"zjblessons/Lesson14/test/integration/pages/Common",
	"sap/ui/test/opaQunit",
	"zjblessons/Lesson14/test/integration/pages/Worklist",
	"zjblessons/Lesson14/test/integration/pages/Object",
	"zjblessons/Lesson14/test/integration/pages/NotFound",
	"zjblessons/Lesson14/test/integration/pages/Browser",
	"zjblessons/Lesson14/test/integration/pages/App"
], function (Opa5, Common) {
	"use strict";
	Opa5.extendConfig({
		arrangements: new Common(),
		viewNamespace: "zjblessons.Lesson14.view."
	});

	sap.ui.require([
		"zjblessons/Lesson14/test/integration/WorklistJourney",
		"zjblessons/Lesson14/test/integration/ObjectJourney",
		"zjblessons/Lesson14/test/integration/NavigationJourney",
		"zjblessons/Lesson14/test/integration/NotFoundJourney"
	], function () {
		QUnit.start();
	});
});
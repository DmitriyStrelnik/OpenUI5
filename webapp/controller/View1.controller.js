sap.ui.define([
	"sap/ui/core/mvc/Controller",
	'sap/ui/model/json/JSONModel'
], function (Controller, JSONModel) {
	"use strict";

	return Controller.extend("zjblessonsLesson9.controller.View1", {
		onInit: function () {
			var oData = {
				"CheckboxText": "<p> Я согласен с <a href=\"./src/pdf/UsersAgreement.pdf\" target=\"_blank\"> условиями пользовательского соглашения </a> и	<a href=\"./src/pdf/PlatformRules.pdf\" target=\"_blank\">правилами платформы</a></p>",
				"SelectedCity": "Minsk",
				"CityCollection": [{
						"CityId": "Minsk",
						"Name": "Minsk"
					},
					{
						"CityId": "Grodno",
						"Name": "Grodno"
					},
					{
						"CityId": "Brest",
						"Name": "Brest"
					},
					{
						"CityId": "Gomel",
						"Name": "Gomel"
					},
					{
						"CityId": "Mogilev",
						"Name": "Mogilev"
					},
					{
						"CityId": "Vitebsk",
						"Name": "Vitebsk"
					}
				],
				"Editable": true,
				"Enabled": true
			};

			var oModel = new JSONModel(oData);
			this.getView().setModel(oModel);
			var oStateModel = new JSONModel({
				agreementChecked: false
			});
			this.getView().setModel(oStateModel, "state");
			var sPromoCode = this._getPromoCodeFromURL();
			if (sPromoCode) {
				oModel.setProperty("/promocodeValue", sPromoCode);
				oModel.setProperty("/promoCodeEnabled", false);
			} else {
				oModel.setProperty("/promocodeValue", "");
				oModel.setProperty("/promoCodeEnabled", true);
			}

		},
		onCancel: function () {
			this._resetForm();
		},
		_resetForm: function () {
			const oView = this.getView();
			["nameInput", "surnameInput", "phoneInput", "emailInput", "passwordInput", "confirmPasswordInput"]
			.forEach(id => {
				const oInput = oView.byId(id);
				oInput.setValue("");
				oInput.setValueState(sap.ui.core.ValueState.None);
			});
			oView.byId("citySelect").setSelectedKey("Minsk");
			oView.byId("citySelect").setValueState(sap.ui.core.ValueState.None);
		
			oView.byId("agreementCheckbox").setSelected(false);
		},	

		onRegister: function () {
			var oView = this.getView();
			var bValid = this._validateForm();

			if (bValid) {
				oView.setBusy(true);
				setTimeout(function () {
					oView.setBusy(false);
					this._resetForm();
					this._showSuccessMessage();
				}.bind(this), 3000);
			}
		},
		_showSuccessMessage: function () {
			var sMessage = "Регистрация прошла успешно.";
			var sPromoCode = this.getView().byId("promocodeInput").getValue();
			if (sPromoCode) {
				this._validatePromoCode(sPromoCode).then(function (bValidPromo) {
					if (bValidPromo) {
						sMessage += " Промокод \"" + sPromoCode + "\" успешно применен.";
					} else {
						sMessage += " Промокод \"" + sPromoCode + "\" не найден.";
					}
					this._showMessageStrip(sMessage, "Success");
				}.bind(this));
			} else {
				this._showMessageStrip(sMessage, "Success");
			}
		},
		_validateForm: function () {
			var oView = this.getView();
			var bValid = true;
			var aFields = [{
					id: "nameInput",
					required: true,
					maxLength: 64,
					errorMessage: "Введите имя (не более 64 символов)"
				},
				{
					id: "surnameInput",
					required: true,
					maxLength: 64,
					errorMessage: "Введите фамилию (не более 64 символов)"
				},
				{
					id: "phoneInput",
					required: true,
					pattern: /^\+375\d{9}$/,
					errorMessage: "Введите номер телефона в формате +375XXXXXXXXX"
				},
				{
					id: "emailInput",
					required: true,
					pattern: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
					errorMessage: "Введите корректный email"
				},
				{
					id: "passwordInput",
					required: true,
					minLength: 8,
					errorMessage: "Пароль должен содержать минимум 8 символов"
				},
				{
					id: "confirmPasswordInput",
					required: true,
					matchWith: "passwordInput",
					errorMessage: "Пароли должны совпадать"
				}
			];

			aFields.forEach(function (oField) {
				var oInput = oView.byId(oField.id);
				var sValue = oInput.getValue();
				var sErrorMessage = oField.errorMessage;
				var bFieldValid = true;
				if (oField.required && !sValue) {
					bFieldValid = false;
				}
				if (bFieldValid && oField.maxLength && sValue.length > oField.maxLength) {
					bFieldValid = false;
				}
				if (bFieldValid && oField.minLength && sValue.length < oField.minLength) {
					bFieldValid = false;
				}
				if (bFieldValid && oField.pattern && !oField.pattern.test(sValue)) {
					bFieldValid = false;
				}
				if (bFieldValid && oField.matchWith) {
					var sMatchValue = oView.byId(oField.matchWith).getValue();
					if (sValue !== sMatchValue) {
						bFieldValid = false;
					}
				}
				if (!bFieldValid) {
					oInput.setValueState(sap.ui.core.ValueState.Error);
					oInput.setValueStateText(sErrorMessage);
					if (bValid) {
						oInput.focus();
					}
					bValid = false;
				} else {
					oInput.setValueState(sap.ui.core.ValueState.None);
				}
			});

			return bValid;
		},
		onInputLiveChange: function (oEvent) {
			const oInput = oEvent.getSource();
			oInput.setValueState(sap.ui.core.ValueState.None);
		},
		_getPromoCodeFromURL: function () {
			var sQuery = window.location.search;
			var oUrlParams = new URLSearchParams(sQuery);
			return oUrlParams.get('promocode');
		},
		_showMessageStrip: function (sText, sType) {
			var oMessageStrip = new sap.m.MessageStrip({
				text: sText,
				type: sType,
				showCloseButton: true,
				showIcon: true
			});
			this.getView().byId("messageStripContainer").addItem(oMessageStrip);
		},
		_validatePromoCode: function (sPromoCode) {
			return new Promise(function (resolve, reject) {
				var sTargetUrl = "https://www.vocabulary.com/word-of-the-day/";

				jQuery.ajax({
					url: sTargetUrl,
					method: "GET",
					success: function (data) {
						var sWordOfTheDay = this._extractWordOfTheDay(data);
						var bValidPromo = sPromoCode.toLowerCase() === sWordOfTheDay.toLowerCase();
						resolve(bValidPromo);
					}.bind(this),
					error: function (error) {
						console.error("Ошибка при получении слова дня:", error);
						resolve(false);
					}
				});
			}.bind(this));
		},
		_extractWordOfTheDay: function (data) {
			var sHtml = data;
			var oParser = new DOMParser();
			var oDoc = oParser.parseFromString(sHtml, "text/html");
			var sWord = oDoc.querySelector("a.word-of-the-day").textContent.trim();
			console.log(sWord)
			return sWord;
		},


	});
});
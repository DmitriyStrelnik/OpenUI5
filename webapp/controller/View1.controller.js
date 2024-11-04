sap.ui.define([
	"sap/ui/core/mvc/Controller",
	'sap/ui/model/json/JSONModel',
	'sap/ui/core/Fragment'
], function (Controller, JSONModel, Fragment) {
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

			const oModel = new JSONModel(oData);
			this.getView().setModel(oModel);
			const oStateModel = new JSONModel({
				agreementChecked: false
			});
			this.getView().setModel(oStateModel, "state");
			const sPromoCode = this._getPromoCodeFromURL();
			if (sPromoCode) {
				oModel.setProperty("/promocodeValue", sPromoCode);
				oModel.setProperty("/promoCodeEnabled", false);
			} else {
				oModel.setProperty("/promocodeValue", "");
				oModel.setProperty("/promoCodeEnabled", true);
			}

		},
		onLogoPress: function (oEvent) {
			const sPopoverId = this.getView().createId("PopoverID");
			if (!this._oPopover) {
				Fragment.load({
					id: sPopoverId,
					name: "zjblessonsLesson9.view.fragment.PopoverMenu",
					controller: this
				}).then(oPopover => {
					this._oPopover = oPopover;
					this.getView().addDependent(this._oPopover);
					this._oPopover.openBy(oEvent.getSource());
				});
			} else {
				this._oPopover.openBy(oEvent.getSource());
			}



		},
		onPopoverItemPress: function (oEvent) {
			const sItemText = oEvent.getSource().getTitle();
			sap.m.MessageToast.show("Вы нажали: " + sItemText);
			this._oPopover.close();
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
		onInstagramIconPress: function () {
			window.open("https://www.instagram.com", "_blank");
		},
		onYouTubeIconPress: function () {
			window.open("https://www.youtube.com", "_blank");
		},
		onTelegramIconPress: function () {
			window.open("https://telegram.org", "_blank");
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
			var oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
			var aFields = [
                {
                    id: "nameInput",
                    required: true,
                    maxLength: 64,
                    errorMessage: oBundle.getText("errorName")
                },
                {
                    id: "surnameInput",
                    required: true,
                    maxLength: 64,
                    errorMessage: oBundle.getText("errorSurname")
                },
                {
                    id: "phoneInput",
                    required: true,
                    pattern: /^\+375\d{9}$/,
                    errorMessage: oBundle.getText("errorPhone")
                },
                {
                    id: "emailInput",
                    required: true,
                    pattern: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
                    errorMessage: oBundle.getText("errorEmail")
                },
                {
                    id: "passwordInput",
                    required: true,
                    minLength: 8,
                    errorMessage: oBundle.getText("errorPassword")
                },
                {
                    id: "confirmPasswordInput",
                    required: true,
                    matchWith: "passwordInput",
                    errorMessage: oBundle.getText("errorConfirmPassword")
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
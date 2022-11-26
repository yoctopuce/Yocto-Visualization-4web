"use strict";
/*
*   Yocto-Visualization (for web), a free web-based application
*   to visualize Yoctopuce Sensors.
*
*  Hub edition UI
*
*   - - - - - - - - - License information: - - - - - - - - -
*
*  Copyright (C) 2021 and beyond by Yoctopuce Sarl, Switzerland.
*
*  Yoctopuce Sarl (hereafter Licensor) grants to you a perpetual
*  non-exclusive license to use, modify, copy and integrate this
*  file into your software for the sole purpose of interfacing
*  with Yoctopuce products.
*
*  You may reproduce and distribute copies of this file in
*  source or object form, as long as the sole purpose of this
*  code is to interface with Yoctopuce products. You must retain
*  this notice in the distributed source file.
*
*  You should refer to Yoctopuce General Terms and Conditions
*  for additional information regarding your rights and
*  obligations.
*
*  THE SOFTWARE AND DOCUMENTATION ARE PROVIDED "AS IS" WITHOUT
*  WARRANTY OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING
*  WITHOUT LIMITATION, ANY WARRANTY OF MERCHANTABILITY, FITNESS
*  FOR A PARTICULAR PURPOSE, TITLE AND NON-INFRINGEMENT. IN NO
*  EVENT SHALL LICENSOR BE LIABLE FOR ANY INCIDENTAL, SPECIAL,
*  INDIRECT OR CONSEQUENTIAL DAMAGES, LOST PROFITS OR LOST DATA,
*  COST OF PROCUREMENT OF SUBSTITUTE GOODS, TECHNOLOGY OR
*  SERVICES, ANY CLAIMS BY THIRD PARTIES (INCLUDING BUT NOT
*  LIMITED TO ANY DEFENSE THEREOF), ANY CLAIMS FOR INDEMNITY OR
*  CONTRIBUTION, OR OTHER SIMILAR COSTS, WHETHER ASSERTED ON THE
*  BASIS OF CONTRACT, TORT (INCLUDING NEGLIGENCE), BREACH OF
*  WARRANTY, OR OTHERWISE.
*/
//#ifndef READONLY
//
//import * as YoctoVisualization from "./YoctoVisualizationFull.js";
//
//export interface HubEditDone {(): void;}
//
//export class HubEdit
//{
//
//    private static readonly FakePassword = "******"
//    private static _window: YoctoVisualization.YWindow
//    private static _contents: HTMLDivElement
//
//    private static _okButton: YoctoVisualization.button;
//    private static _cancelButton: YoctoVisualization.button;
//    private static _currenthub: YoctoVisualization.Hub;
//    private static _protocolSelect: HTMLSelectElement
//    private static _addressInput: HTMLInputElement;
//    private static _portInput: HTMLInputElement;
//    private static _pathInput: HTMLInputElement;
//    private static _usernameInput: HTMLInputElement;
//    private static _passwordInput: HTMLInputElement;
//    private static _thisIsEditing: boolean = false;
//    private static _whenDone: HubEditDone | null = null;
//
//    private static fontSize: number = YoctoVisualization.constants.generalFontSize;
//    public static get activeBorderColor(): string { return YoctoVisualization.constants.WindowInnerBorderColor;}
//    public static get inactiveBorderColor(): string { return "#b0b0b0";}
//    public static get activeColor(): string { return "black";}
//    public static get inactiveColor(): string { return "grey";}
//    public static get activeBackgroundColor(): string { return YoctoVisualization.constants.WindowInnerBackgroundColor;}
//    public static get inactiveBackgroundColor(): string { return YoctoVisualization.constants.WindowBackgroundColor;}
//
//    public static newHub(whenDone: HubEditDone | null)
//    {
//        HubEdit._currenthub = new YoctoVisualization.Hub(YoctoVisualization.HubType.REMOTEHUB, "ws", "", "", true, "", "", "")
//        HubEdit.show(HubEdit._currenthub);
//        HubEdit._window.title = "New Connection"
//        HubEdit._thisIsEditing = false;
//        HubEdit._whenDone = whenDone;
//
//    }
//
//    public static editHub(hub: YoctoVisualization.Hub, whenDone: HubEditDone | null)
//    {
//        HubEdit._currenthub = hub;
//        HubEdit.show(HubEdit._currenthub);
//        HubEdit._window.title = "Edit Connection"
//        HubEdit._thisIsEditing = true;
//        HubEdit._whenDone = whenDone;
//    }
//
//    private static show(hub: YoctoVisualization.Hub)
//    {
//        if (HubEdit._window == null)
//        {
//            HubEdit._okButton = new YoctoVisualization.button("Ok", () => {HubEdit.okClicked()});
//            HubEdit._cancelButton = new YoctoVisualization.button("Cancel", () => { HubEdit.hide()});
//            let params: YoctoVisualization.newWindowParam = new YoctoVisualization.newWindowParam();
//            params.positionType = YoctoVisualization.WindowPositionType.CENTERED
//            params.width = Math.round(450 * YoctoVisualization.constants.generalSizeCoef);
//            params.height = Math.round(280 * YoctoVisualization.constants.generalSizeCoef);
//            params.isModal = true;
//            params.closeIcon = false;
//            params.title = "...";
//            params.buttons.push(HubEdit._okButton);
//            params.buttons.push(HubEdit._cancelButton);
//
//            HubEdit._window = new YoctoVisualization.YWindow(params)
//
//            HubEdit._contents = HubEdit._window.innerContentDiv;
//
//            let p: HTMLParagraphElement = document.createElement("P") as HTMLParagraphElement;
//            p.style.paddingTop = "0px";
//            p.style.marginTop = Math.round(3 * YoctoVisualization.constants.generalSizeCoef).toString() + "px";
//
//            p.style.lineHeight = Math.round(12 * YoctoVisualization.constants.generalSizeCoef).toString() + "px";
//            p.innerText = "Enter the hub connection parameter, The only mandatory parameter is the address, just leave the other fields empty if you want to use default values";
//            p.style.textAlign = "justify"
//            HubEdit._contents.appendChild(p);
//
//            p.appendChild(document.createElement("BR"))
//            p.appendChild(document.createElement("BR"))
//
//            let span: HTMLSpanElement = document.createElement("SPAN") as HTMLSpanElement;
//            span.innerText = "Protocol:";
//            span.style.marginLeft = "20px";
//            p.appendChild(span)
//
//            HubEdit._protocolSelect = document.createElement("SELECT") as HTMLSelectElement;
//            HubEdit._protocolSelect.style.border = "1px solid grey";
//            HubEdit._protocolSelect.style.fontFamily = YoctoVisualization.constants.generalFontFamily;
//            HubEdit._protocolSelect.style.fontSize = YoctoVisualization.constants.generalFontSize.toString() + "px";
//
//            let httpOption: HTMLOptionElement = document.createElement("OPTION") as HTMLOptionElement;
//            httpOption.text = "http";
//            httpOption.value = "http";
//            HubEdit._protocolSelect.appendChild(httpOption);
//
//            let httpsOption: HTMLOptionElement = document.createElement("OPTION") as HTMLOptionElement;
//            httpsOption.text = "https";
//            httpsOption.value = "https";
//            HubEdit._protocolSelect.appendChild(httpsOption);
//
//            let wsOption: HTMLOptionElement = document.createElement("OPTION") as HTMLOptionElement;
//            wsOption.text = "ws";
//            wsOption.value = "ws";
//            HubEdit._protocolSelect.appendChild(wsOption);
//
//            let wssOption: HTMLOptionElement = document.createElement("OPTION") as HTMLOptionElement;
//            wssOption.text = "wss";
//            wssOption.value = "wss";
//            HubEdit._protocolSelect.appendChild(wssOption);
//
//            p.appendChild(HubEdit._protocolSelect);
//
//            span = document.createElement("SPAN") as HTMLSpanElement;
//            span.style.marginLeft = "20px";
//            span.innerText = "Address:";
//            p.appendChild(span)
//            HubEdit._addressInput = document.createElement("INPUT") as HTMLInputElement;
//            HubEdit._addressInput.style.border = "1px solid grey";
//            HubEdit._addressInput.style.fontFamily = YoctoVisualization.constants.generalFontFamily;
//            HubEdit._addressInput.style.fontSize = YoctoVisualization.constants.generalFontSize.toString() + "px";
//            HubEdit._addressInput.maxLength = 15;
//            HubEdit._addressInput.size = 15;
//            HubEdit._addressInput.value = hub.addr;
//            new YoctoVisualization.InputFieldManager(HubEdit._addressInput, YoctoVisualization.InputFieldManager.dataType.DATA_STRING, false, Number.NaN, Number.NaN, null);
//
//            p.appendChild(HubEdit._addressInput)
//
//            span = document.createElement("SPAN") as HTMLSpanElement;
//            span.style.marginLeft = Math.round(20 * YoctoVisualization.constants.generalSizeCoef).toString() + "px";
//            span.innerText = "Port:";
//            p.appendChild(span)
//            HubEdit._portInput = document.createElement("INPUT") as HTMLInputElement;
//            HubEdit._portInput.style.border = "1px solid grey";
//            HubEdit._portInput.style.fontFamily = YoctoVisualization.constants.generalFontFamily;
//            HubEdit._portInput.style.fontSize = YoctoVisualization.constants.generalFontSize.toString() + "px";
//            HubEdit._portInput.style.textAlign = "right";
//            HubEdit._portInput.maxLength = 5;
//
//            HubEdit._portInput.size = 5;
//            new YoctoVisualization.InputFieldManager(HubEdit._portInput, YoctoVisualization.InputFieldManager.dataType.DATA_STRICT_POSITIVE_INT, true, Number.NaN, Number.NaN, null);
//
//            p.appendChild(HubEdit._portInput)
//
//            p.appendChild(document.createElement("BR"))
//            p.appendChild(document.createElement("BR"))
//
//            span = document.createElement("SPAN") as HTMLSpanElement;
//            span.innerText = "Path:";
//            span.style.marginLeft = Math.round(20 * YoctoVisualization.constants.generalSizeCoef).toString() + "px";
//            p.appendChild(span)
//            HubEdit._pathInput = document.createElement("INPUT") as HTMLInputElement;
//            HubEdit._pathInput.style.border = "1px solid grey";
//            HubEdit._pathInput.style.fontFamily = YoctoVisualization.constants.generalFontFamily;
//            HubEdit._pathInput.style.fontSize = YoctoVisualization.constants.generalFontSize.toString() + "px";
//            HubEdit._pathInput.size = 45;
//            p.appendChild(HubEdit._pathInput)
//
//            p.appendChild(document.createElement("BR"))
//            p.appendChild(document.createElement("BR"))
//
//            span = document.createElement("SPAN") as HTMLSpanElement;
//            span.innerText = "Username:";
//            span.style.marginLeft = Math.round(20 * YoctoVisualization.constants.generalSizeCoef).toString() + "px";
//            p.appendChild(span)
//            HubEdit._usernameInput = document.createElement("INPUT") as HTMLInputElement;
//            HubEdit._usernameInput.style.border = "1px solid grey";
//            HubEdit._usernameInput.style.fontFamily = YoctoVisualization.constants.generalFontFamily;
//            HubEdit._usernameInput.style.fontSize = YoctoVisualization.constants.generalFontSize.toString() + "px";
//            HubEdit._usernameInput.size = 15;
//            p.appendChild(HubEdit._usernameInput);
//
//            span = document.createElement("SPAN") as HTMLSpanElement;
//            span.innerText = "Password:";
//            span.style.marginLeft = Math.round(20 * YoctoVisualization.constants.generalSizeCoef).toString() + "px";
//            p.appendChild(span)
//            HubEdit._passwordInput = document.createElement("INPUT") as HTMLInputElement;
//            HubEdit._passwordInput.type = "password"
//            HubEdit._passwordInput.style.border = "1px solid grey";
//            HubEdit._passwordInput.style.fontFamily = YoctoVisualization.constants.generalFontFamily;
//            HubEdit._passwordInput.style.fontSize = YoctoVisualization.constants.generalFontSize.toString() + "px";
//            HubEdit._passwordInput.size = 15;
//
//            p.appendChild(HubEdit._passwordInput);
//
//            p = document.createElement("P") as HTMLParagraphElement;
//            p.style.paddingTop = "0px";
//            p.style.marginTop = Math.round(3 * YoctoVisualization.constants.generalSizeCoef).toString() + "px";
//            p.style.lineHeight = Math.round(12 * YoctoVisualization.constants.generalSizeCoef).toString() + "px";
//            p.innerText = "Important note: credentials are saved in the configuration file wich is easily accessible. Therefore, if hub is write-protected, it might be wise to use ReadOnly credentials here. When installed on a Yoctopuce hub, Yocto-Visualization (for web) will automatically ask for read/write credentials at save time if neccessary.";
//            p.style.textAlign = "justify"
//            HubEdit._contents.appendChild(p);
//        }
//        HubEdit._protocolSelect.value = hub.protocol;
//        HubEdit._addressInput.value = hub.addr;
//        HubEdit._portInput.value = hub.port;
//        HubEdit._pathInput.value = hub.path;
//        HubEdit._usernameInput.value = hub.user;
//
//        HubEdit._passwordInput.value = hub.encryptedPassword != "" ? HubEdit.FakePassword : "";
//        HubEdit._window.show();
//    }
//
//    static hide(): void
//    {
//        if (HubEdit._window == null) return;
//        HubEdit._window.hide();
//        HubEdit._passwordInput.value = "";
//        if (HubEdit._whenDone != null) HubEdit._whenDone();
//    }
//
//    static okClicked(): void
//    {
//        HubEdit._currenthub.protocol = HubEdit._protocolSelect.value;
//        HubEdit._currenthub.addr = HubEdit._addressInput.value;
//        HubEdit._currenthub.port = HubEdit._portInput.value;
//        HubEdit._currenthub.path = HubEdit._pathInput.value;
//        HubEdit._currenthub.user = HubEdit._usernameInput.value;
//        if (HubEdit._currenthub.user != "")
//        {
//            if (HubEdit._passwordInput.value != HubEdit.FakePassword)
//            {
//                HubEdit._currenthub.encryptedPassword = YoctoVisualization.Hub.Encrypt(HubEdit._passwordInput.value, YoctoVisualization.Hub.loginCypherPassword);
//            }
//        }
//        else
//        {
//            HubEdit._currenthub.encryptedPassword = "";
//        }
//
//        if (HubEdit._thisIsEditing)
//        {
//            YoctoVisualization.configForm.hubGotEdited(HubEdit._currenthub)
//        }
//        else
//        {
//            YoctoVisualization.configForm.hubWasAdded(HubEdit._currenthub);
//        }
//
//        HubEdit.hide();
//        if (HubEdit._whenDone != null) HubEdit._whenDone();
//    }
//
//}
//
////#endif

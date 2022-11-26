/*
*   Yocto-Visualization (for web), a free web-based application
*   to visualize Yoctopuce Sensors.
*
*   Application windows management
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
import * as YoctoVisualization from "./YoctoVisualizationFull.js";
export class button {
    constructor(caption, action, sizeCoefOverload) {
        this._enabled = true;
        this._visible = true;
        this._caption = "";
        this._caption = caption;
        this._action = action;
        let GUIcoef = YoctoVisualization.constants.generalSizeCoef;
        if (typeof (sizeCoefOverload) !== "undefined")
            GUIcoef = sizeCoefOverload;
        this._link = document.createElement("A");
        this._link.innerText = this._caption;
        this._link.style.cursor = "pointer";
        this._link.style.display = "inlineblock";
        let padding = Math.round(5 * GUIcoef).toString() + "px";
        let margin = Math.round(3 * GUIcoef).toString() + "px";
        this._link.tabIndex = 0;
        this._link.style.padding = padding + " " + padding + " " + padding + " " + padding;
        this._link.style.margin = margin + " " + margin + " " + margin + " " + margin;
        this._link.style.borderColor = "#808080";
        this._link.style.backgroundColor = "#f0f0f0";
        this._link.style.fontFamily = YoctoVisualization.constants.generalFontFamily;
        this._link.style.fontSize = (16 * GUIcoef).toString() + "px";
        this._link.style.cursor = "pointer";
        this._link.style.border = YoctoVisualization.constants.WindowInnerBorder;
        this._link.addEventListener('mouseover', () => { if (this._enabled)
            this._link.style.backgroundColor = "white"; });
        this._link.addEventListener('mouseout', () => { if (this._enabled)
            this._link.style.backgroundColor = "#f0f0f0"; });
        this._link.addEventListener('click', () => { if (this._enabled)
            this._action(this); });
        this._link.addEventListener('keypress', (e) => { if (this._enabled && ((e.key == 'Enter') || (e.key == ' ')))
            this._action(this); });
    }
    get Element() { return this._link; }
    set tabIndex(index) {
        this._link.tabIndex = index;
    }
    focus() {
        this._link.focus();
    }
    get visible() { return this._visible; }
    set visible(value) {
        this._visible = value;
        this._link.style.display = this._visible ? "" : "none";
    }
    get enabled() { return this._enabled; }
    set enabled(value) { this.enable(value); }
    performAction() {
        if (!this._enabled)
            return;
        this._action(this);
    }
    showShortcut(enable) {
        if (!this._enabled)
            enable = false;
        if (enable) {
            this._link.innerHTML = "<u>" + this._caption.substring(0, 1) + "</u>" + this._caption.substring(1);
        }
        else {
            this._link.innerText = this._caption;
        }
    }
    enable(state) {
        if (state == this._enabled)
            return;
        this._enabled = state;
        this._link.tabIndex = state ? 0 : -1;
        if (this._enabled) {
            this._link.style.cursor = "pointer";
            this._link.style.backgroundColor = "#f0f0f0";
            this._link.style.color = "black";
        }
        else {
            this._link.style.backgroundColor = "#e0e0e0";
            this._link.style.cursor = "default";
            this._link.style.color = "#A0A0A0";
        }
    }
}
export class newWindowParam {
    get GUICoef() {
        return this._GUICoef;
    }
    constructor(sizeCoefOverload) {
        this.createNow = false; // force all the window UI Element to be allocated now instead of when show() is called
        this.left = 100;
        this.top = 100;
        this.positionType = 0 /* WindowPositionType.REGULAR */;
        this.width = 400;
        this.height = 300;
        this.isModal = false;
        this.showShadow = true;
        this.showContainerBorders = true;
        this.showHeader = true;
        this.title = "new Window";
        this.closeIcon = true;
        this.headerBgColor = "";
        this.bottomKeepClear = 0;
        this.contentsDefaultFontSize = YoctoVisualization.constants.generalFontSize;
        this.contentsDefaultFontFamily = YoctoVisualization.constants.generalFontFamily;
        this.closingCallBack = null;
        this.WindowBackgroundColor = "#f0f0f0";
        this.WindowBorder = "1px solid #808080";
        this.WindowPadding = 2;
        this.WindowInnerBorderColor = " #A0A0A0";
        this.WindowInnerBackgroundColor = "#fAfAfA";
        this.WindowInnerBorder = "1px solid " + this.WindowInnerBorderColor;
        this.WindowHeaderBackgroundColor = "#0072ca";
        this.WindowHeaderColor = "white";
        this.WindowHeaderBorder = "1px solid #0072ca";
        this._GUICoef = YoctoVisualization.constants.generalSizeCoef;
        this.WindowHeaderHeight = Math.round(20 * YoctoVisualization.constants.generalSizeCoef);
        this.WindowHeaderFontSize = 16 * YoctoVisualization.constants.generalSizeCoef;
        this.WindowHeaderFontFamily = YoctoVisualization.constants.generalFontFamily;
        this.buttons = [];
        if (typeof (sizeCoefOverload) !== "undefined") {
            this.WindowHeaderHeight = 20 * sizeCoefOverload;
            this.WindowHeaderFontSize = 16 * sizeCoefOverload;
            this._GUICoef = sizeCoefOverload;
        }
    }
    clone() {
        let it = new newWindowParam();
        let keys = Object.keys(this);
        for (let i = 0; i < keys.length; i++) {
            if (keys[i] != "buttons")
                it[keys[i]] = this[keys[i]];
        }
        for (let i = 0; i < this.buttons.length; i++) {
            it.buttons.push(this.buttons[i]);
        }
        return it;
    }
}
export class YWindow {
    static get ConTextMenuBestZindex() {
        for (let i = 0; i < YWindow.windowList.length; i++) {
            if (YWindow.windowList[i].isModal())
                return -1;
        }
        return 100000 + 2 * YWindow.windowList.length;
    }
    constructor(params) {
        this._div = null; // main contain
        this._titleSpan = null;
        this._ModalDivShield = null;
        this._switchSideDiv = null;
        this._buttonsContainer = null;
        this._params = params.clone();
        YWindow.windowList.push(this);
        this._contents = document.createElement("DIV");
        if (params.createNow)
            this.allocate();
    }
    get innerContentDiv() { return this._contents; }
    get bottomKeepClear() { return this._params.bottomKeepClear; }
    set bottomKeepClear(value) {
        this._params.bottomKeepClear = value;
        if (this._contents != null) {
            this._contents.style.bottom = (this._params.WindowPadding + this._params.bottomKeepClear).toString() + "px";
        }
    }
    get outterContentDiv() { return this._div; }
    isModal() {
        if (this._div == null)
            return false;
        return (this._div.style.display == "") && (this._params.isModal);
    }
    get visible() {
        if (this._div == null)
            return false;
        return this._div.style.display == "";
    }
    set visible(v) {
        v ? this.show() : this.hide();
    }
    show(width) {
        if (this._div == null)
            this.allocate();
        this._div.style.display = "";
        if (this._ModalDivShield != null)
            this._ModalDivShield.style.display = "";
        this.brintToFront();
        if ((typeof (width) !== "undefined") && (this._params.positionType == 2 /* WindowPositionType.SIDEANCHORED */)) {
            this._div.style.width = width.toString() + "px";
        }
    }
    allocate() {
        if (this._div != null)
            return;
        if (this._params.isModal) {
            this._ModalDivShield = document.createElement("DIV");
            this._ModalDivShield.style.position = "fixed";
            this._ModalDivShield.style.left = "0px";
            this._ModalDivShield.style.top = "0px";
            this._ModalDivShield.style.right = "0px";
            this._ModalDivShield.style.bottom = "0px";
            this._ModalDivShield.style.backgroundColor = "rgba(255,255,255,0.85) ";
            document.body.appendChild(this._ModalDivShield);
        }
        this._div = document.createElement("DIV");
        this._div.style.display = "none";
        switch (this._params.positionType) {
            case 0 /* WindowPositionType.REGULAR */:
                this._div.style.position = "absolute";
                this._div.style.left = this._params.left.toString() + "px";
                this._div.style.top = this._params.top.toString() + "px";
                this._div.style.width = this._params.width.toString() + "px";
                this._div.style.height = this._params.height.toString() + "px";
                break;
            case 1 /* WindowPositionType.CENTERED */:
                this._div.style.position = "absolute";
                this._div.style.left = "50%";
                this._div.style.top = "50%";
                this._div.style.transform = "translate(-50%, -50%)";
                this._div.style.width = this._params.width.toString() + "px";
                this._div.style.height = this._params.height.toString() + "px";
                break;
            case 2 /* WindowPositionType.SIDEANCHORED */:
                this._div.style.position = "fixed";
                this._div.style.top = "5px";
                this._div.style.right = "5px";
                this._div.style.bottom = "5px";
                this._div.style.width = this._params.width.toString() + "px";
                break;
        }
        this._div.style.border = this._params.WindowBorder;
        this._div.style.backgroundColor = this._params.WindowBackgroundColor;
        if (this._params.showShadow)
            this._div.style.boxShadow = " 4px 4px 4px 1px rgba(0,0,0,0.05)";
        let containerTop = this._params.WindowPadding;
        if (this._params.showHeader) {
            containerTop = this._params.WindowHeaderHeight + 3 * this._params.WindowPadding;
            let title = document.createElement("DIV");
            title.style.position = "absolute";
            title.style.left = this._params.WindowPadding.toString() + "px";
            title.style.top = this._params.WindowPadding.toString() + "px";
            title.style.right = this._params.WindowPadding.toString() + "px";
            title.style.height = this._params.WindowHeaderHeight.toString() + "px";
            title.style.border = this._params.WindowHeaderBorder;
            title.style.backgroundColor = this._params.WindowHeaderBackgroundColor;
            title.style.fontFamily = this._params.WindowHeaderFontFamily;
            title.style.color = this._params.WindowHeaderColor;
            title.style.fontSize = this._params.WindowHeaderFontSize.toString() + "px";
            title.style.paddingLeft = "5px";
            title.style.whiteSpace = "nowrap";
            title.addEventListener("click", () => { this.brintToFront(); });
            this._titleSpan = document.createElement("SPAN");
            this._titleSpan.innerText = this._params.title;
            title.appendChild(this._titleSpan);
            if (this._params.closeIcon) {
                let closeDiv = document.createElement("DIV");
                closeDiv.style.position = "absolute";
                closeDiv.style.right = "0px";
                closeDiv.style.top = "0px";
                closeDiv.style.width = Math.round(this._params.WindowHeaderHeight + 5).toString() + "px";
                closeDiv.style.height = this._params.WindowHeaderHeight.toString() + "px";
                closeDiv.style.overflow = "hide";
                closeDiv.style.paddingLeft = "5px";
                closeDiv.tabIndex = 0;
                closeDiv.style.cursor = "pointer";
                closeDiv.style.backgroundColor = this._params.WindowHeaderBackgroundColor;
                closeDiv.innerHTML = YoctoVisualization.ressources.CloseIcon(this._params.WindowHeaderHeight.toString(), false, false, false, false, "Click to close this window");
                closeDiv.addEventListener("click", () => { this.hide(); });
                closeDiv.addEventListener("keypress", (e) => { if (e.key == "Enter")
                    this.hide(); });
                title.appendChild(closeDiv);
            }
            if (this._params.positionType == 2 /* WindowPositionType.SIDEANCHORED */) {
                this._switchSideDiv = document.createElement("DIV");
                this._switchSideDiv.style.position = "absolute";
                this._switchSideDiv.style.width = Math.round(this._params.WindowHeaderHeight + 5).toString() + "px";
                this._switchSideDiv.style.right = Math.round(this._params.WindowHeaderHeight + 5) + "px";
                this._switchSideDiv.style.height = this._params.WindowHeaderHeight.toString() + "px";
                this._switchSideDiv.style.overflow = "hide";
                this._switchSideDiv.style.paddingLeft = "5px";
                this._switchSideDiv.style.top = "0px";
                this._switchSideDiv.style.cursor = "pointer";
                this._switchSideDiv.style.backgroundColor = this._params.WindowHeaderBackgroundColor;
                this._switchSideDiv.innerHTML = YoctoVisualization.ressources.MoveToLeftIcon(this._params.WindowHeaderHeight.toString(), false, false, false, false, "Click to move editor on left side");
                this._switchSideDiv.addEventListener("click", () => { this.switchSide(); });
                title.appendChild(this._switchSideDiv);
            }
            this._div.appendChild(title);
        }
        if (this._params.buttons.length > 0) {
            this._buttonsContainer = document.createElement("DIV");
            this._buttonsContainer.style.position = "absolute";
            this._buttonsContainer.style.bottom = Math.round(this._params.WindowPadding).toString() + "px";
            this._buttonsContainer.style.right = Math.round(this._params.WindowPadding).toString() + "px";
            this._buttonsContainer.style.textAlign = "right";
            for (let i = 0; i < this._params.buttons.length; i++) {
                this._buttonsContainer.appendChild(this._params.buttons[i].Element);
            }
            this._div.appendChild(this._buttonsContainer);
            this._buttonsContainer.style.height = (25 * this._params.GUICoef).toString() + "px";
            this._params.bottomKeepClear += Math.round(35 * this._params.GUICoef);
        }
        this._contents.style.position = "absolute";
        this._contents.style.left = this._params.WindowPadding.toString() + "px";
        this._contents.style.right = this._params.WindowPadding.toString() + "px";
        this._contents.style.top = containerTop.toString() + "px";
        this._contents.style.bottom = (this._params.WindowPadding + this._params.bottomKeepClear).toString() + "px";
        this._contents.style.paddingLeft = "5px";
        this._contents.style.paddingRight = "5px";
        if (this._contents.style.fontSize == "") {
            this._contents.style.fontSize = this._params.contentsDefaultFontSize.toString() + "px";
        }
        if (this._contents.style.fontFamily == "") {
            this._contents.style.fontFamily = this._params.contentsDefaultFontFamily;
        }
        if (this._params.showContainerBorders) {
            this._contents.style.border = this._params.WindowInnerBorder;
            this._contents.style.backgroundColor = this._params.WindowInnerBackgroundColor;
        }
        else {
            this._contents.style.border = "1px solid rgba(0, 0, 0, 0)";
            this._contents.style.backgroundColor = "";
        }
        this._contents.style.overflow = "hide";
        this._div.append(this._contents);
        document.body.appendChild(this._div);
    }
    hide() {
        if (this._div == null)
            return;
        this._div.style.display = "none";
        if (this._ModalDivShield != null)
            this._ModalDivShield.style.display = "none";
        if (this._params.closingCallBack != null)
            this._params.closingCallBack(this);
    }
    set title(value) {
        this._params.title = value;
        if (this._titleSpan != null) {
            this._titleSpan.innerText = value;
        }
    }
    brintToFront() {
        let n = -1;
        for (let i = 0; i < YWindow.windowList.length; i++) {
            if (YWindow.windowList[i] == this)
                n = i;
        }
        if (n < 0)
            return;
        YWindow.windowList.splice(n, 1);
        YWindow.windowList.push(this);
        for (let i = 0; i < YWindow.windowList.length; i++) {
            YWindow.windowList[i].zIndex = i;
        }
    }
    set zIndex(index) {
        if (this._div == null)
            return;
        this._div.style.zIndex = (100001 + 2 * index).toString();
        if (this._params.isModal)
            this._ModalDivShield.style.zIndex = (100000 + 2 * index).toString();
    }
    switchSide() {
        if (this._div.style.left == "") {
            this._div.style.left = "5px";
            this._div.style.right = "";
            this._switchSideDiv.innerHTML = YoctoVisualization.ressources.MoveToRightIcon(Math.round(20 * this._params.GUICoef).toString(), false, false, false, false, "Click to move editor on right side");
        }
        else {
            this._div.style.left = "";
            this._div.style.right = "5px";
            this._switchSideDiv.innerHTML = YoctoVisualization.ressources.MoveToLeftIcon(Math.round(20 * this._params.GUICoef).toString(), false, false, false, false, "Click to move editor on left side");
        }
    }
}
YWindow.windowList = [];
export class confirm {
    static ask(message, yes, no, userdata) {
        let params = new YoctoVisualization.newWindowParam();
        params.positionType = 1 /* WindowPositionType.CENTERED */;
        params.width = Math.min(Math.round(400 * YoctoVisualization.constants.generalSizeCoef), Math.round(screen.width * 0.9));
        params.height = Math.min(Math.round(160 * YoctoVisualization.constants.generalSizeCoef), Math.round(screen.height * 0.7));
        params.isModal = true;
        params.showHeader = false;
        params.showContainerBorders = false;
        let YesButton = new button("Yes", () => {
            confirm._window.hide();
            if (yes != null)
                yes(userdata);
        });
        let NoButton = new button("No", () => {
            confirm._window.hide();
            if (no != null)
                no(userdata);
        });
        params.buttons.push(YesButton);
        params.buttons.push(NoButton);
        confirm._window = new YWindow(params);
        let contents = confirm._window.innerContentDiv;
        let table = document.createElement("TABLE");
        table.style.width = "100%";
        let TR = document.createElement("TR");
        let TD = document.createElement("TD");
        TD.style.width = "10";
        TD.innerHTML = YoctoVisualization.ressources.DontKnowIcon(Math.round(80 * YoctoVisualization.constants.generalSizeCoef).toString(), true, false, false, false, "");
        TR.appendChild(TD);
        TD = document.createElement("TD");
        TD.style.paddingLeft = "20px";
        TD.style.fontFamily = YoctoVisualization.constants.generalFontFamily;
        TD.style.fontSize = YoctoVisualization.constants.generalFontSize.toString() + "px";
        TD.style.textAlign = "justify";
        TD.innerText = message;
        TR.appendChild(TD);
        table.appendChild(TR);
        contents.appendChild(table);
        confirm._window.show();
        return confirm._window;
    }
}
class notififaction {
    static show(icon, message) {
        let params = new YoctoVisualization.newWindowParam();
        params.positionType = 1 /* WindowPositionType.CENTERED */;
        params.width = Math.min(Math.round(400 * YoctoVisualization.constants.generalSizeCoef), screen.width);
        params.height = Math.min(Math.round(160 * YoctoVisualization.constants.generalSizeCoef), screen.height);
        params.isModal = true;
        params.showHeader = false;
        params.showContainerBorders = false;
        let okButton = new button("OK", () => { alert._window.hide(); });
        params.buttons.push(okButton);
        alert._window = new YWindow(params);
        let contents = alert._window.innerContentDiv;
        let table = document.createElement("TABLE");
        table.style.width = "100%";
        let TR = document.createElement("TR");
        let TD = document.createElement("TD");
        TD.style.width = "10";
        TD.innerHTML = icon;
        TR.appendChild(TD);
        TD = document.createElement("TD");
        TD.style.paddingLeft = "20px";
        TD.style.fontFamily = YoctoVisualization.constants.generalFontFamily;
        TD.style.fontSize = YoctoVisualization.constants.generalFontSize.toString() + "px";
        TD.style.textAlign = "justify";
        TD.innerText = message;
        TR.appendChild(TD);
        table.appendChild(TR);
        contents.appendChild(table);
        alert._window.show();
        return alert._window;
    }
}
export class alert extends notififaction {
    static show(message) {
        return super.show(YoctoVisualization.ressources.FailedIcon(Math.round(80 * YoctoVisualization.constants.generalSizeCoef).toString(), true, false, false, false, ""), message);
    }
}
export class info extends notififaction {
    static show(message) {
        return super.show(YoctoVisualization.ressources.OkIcon(Math.round(80 * YoctoVisualization.constants.generalSizeCoef).toString(), true, false, false, false, ""), message);
    }
}

/*
*   Yocto-Visualization (for web), a free web-based application
*   to visualize Yoctopuce Sensors.
*
*  Color chooser UI
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
import * as YDataRendering from "./Renderer/YDataRendererFull.js";
import * as YoctoVisualization from "./YoctoVisualizationFull.js";
class ColorEditorTab {
    constructor(editor, label, fontSize) {
        this._realTab = false;
        this._div = null;
        this._tabLabel = null;
        this._td = document.createElement("TD");
        this._editor = editor;
        if (label != "") {
            this._div = document.createElement("DIV");
            this._div.style.display = "none";
            this._td.style.paddingTop = "4px";
            this._td.style.fontSize = fontSize.toString() + "px";
            this._td.style.paddingBottom = "2px";
            this._td.style.borderLeft = "1px solid " + this._editor.inactiveBorderColor;
            this._td.style.borderRight = "1px solid " + this._editor.inactiveBorderColor;
            this._td.style.borderTop = "1px solid " + this._editor.inactiveBorderColor;
            this._td.style.borderBottom = "1px solid " + this._editor.activeBorderColor;
            this._td.style.color = this._editor.inactiveColor;
            this._td.style.backgroundColor = this._editor.inactiveBackgroundColor;
            this._td.style.borderTopLeftRadius = "3px";
            this._td.style.borderTopRightRadius = "3px";
            this._td.style.paddingLeft = "5px";
            this._td.style.paddingRight = "5px";
            this._realTab = true;
            this._tabLabel = document.createElement("ANCHOR");
            this._tabLabel.innerText = label;
            this._tabLabel.addEventListener("click", () => { this._editor.tabSelected(this); });
            this._tabLabel.addEventListener('keyup', (e) => {
                if ((e.key === "Enter") || (e.key === " "))
                    this._editor.tabSelected(this);
            });
            this._tabLabel.style.cursor = "pointer";
            this._td.appendChild(this._tabLabel);
        }
        else {
            this._td.style.borderBottom = "1px solid " + this._editor.activeBorderColor;
            this._td.innerHTML = "<span>&nbsp;</span>";
        }
    }
    setTabIndex(index) {
        this._tabLabel.tabIndex = index++;
        return index;
    }
    set active(value) {
        if (!this._realTab)
            return;
        this._td.style.borderLeftColor = value ? this._editor.activeBorderColor : this._editor.inactiveBorderColor;
        this._td.style.borderTopColor = value ? this._editor.activeBorderColor : this._editor.inactiveBorderColor;
        this._td.style.borderRightColor = value ? this._editor.activeBorderColor : this._editor.inactiveBorderColor;
        this._td.style.borderBottomColor = value ? "rgba(0, 0, 0, 0)" : this._editor.activeBorderColor;
        this._td.style.color = value ? this._editor.activeColor : this._editor.inactiveColor;
        this._td.style.backgroundColor = value ? this._editor.activeBackgroundColor : this._editor.inactiveBackgroundColor;
        this._div.style.display = value ? "" : "none";
    }
    get active() { return this._div.style.display == ""; }
    get tabElement() { return this._td; }
    get divElement() { return this._div; }
}
export class ColorEditorSroll {
    setTabIndex(index) {
        this._anchor.tabIndex = index++;
        this._input.tabIndex = index++;
        return index;
    }
    constructor(div, anchor, input, colorCallback, changeCallBack, checkerBoardBg, value) {
        this._value = 0;
        this._colorCallback = colorCallback;
        this._changeCallBack = changeCallBack;
        this._value = value;
        this._div = div;
        let s = ColorEditorSroll.scrollHeight;
        if (checkerBoardBg)
            this._div.style.background = "url('data:image/svg+xml;utf8," + ColorSampler.checkerboardImage(s, s) + "')";
        this._anchor = anchor;
        this._input = input;
        this._input.size = 3;
        this._input.maxLength = 3;
        this._input.type = "number";
        this._input.min = "0";
        this._input.max = "255";
        this._input.style.fontSize = (12 * YoctoVisualization.constants.guiDPIFactor).toString() + "px";
        this._input.style.textAlign = "right";
        this._input.value = this._value.toString();
        this._input.style.marginLeft = "10px";
        this._div.style.width = "100%";
        this._div.style.position = "relative";
        this._div.style.height = ColorEditorSroll.scrollHeight.toString() + "px";
        this._div.style.border = "1px solid black";
        this._canvasBg = document.createElement("CANVAS");
        this._div.appendChild(this._canvasBg);
        // this._canvasBg.style.position ="absolute";
        this._canvasBg.style.left = "0px";
        this._canvasBg.style.top = "0px";
        this._canvasBg.style.width = "100%";
        this._canvasBg.style.height = "100%";
        this._canvasBg.width = 256;
        this._canvasBg.height = ColorEditorSroll.scrollHeight;
        this._canvasCursor = document.createElement("CANVAS");
        this._div.appendChild(this._canvasCursor);
        this._canvasCursor.style.position = "absolute";
        this._canvasCursor.style.width = "100%";
        this._canvasCursor.style.height = "100%";
        this._canvasCursor.style.left = "0px";
        this._canvasCursor.style.top = "0px";
        this._canvasCursor.style.display = "block";
        this._div.addEventListener("mousedown", (e) => { this.MouseDown(this._div, e); });
        this._div.addEventListener("mousemove", (e) => { this.MouseMove(this._div, e); });
        // coulor sliders are way too small for multi-touch drag.
        // this._div.addEventListener("touchstart",(e:TouchEvent) => {this.TouchStart(this._div, e)});
        // document.addEventListener("touchmove", (e:TouchEvent)=>{ this.TouchCaptureRun(this._div,e);});
        // document.addEventListener("touchend", (e:TouchEvent)=>{ this.TouchCaptureRun(this._div,e);});
        this._anchor.addEventListener("wheel", (e) => { this.mouseWheelEvent(this._div, e); });
        this._anchor.addEventListener("keydown", (e) => { this.KeyDown(this._div, e); });
        this._input.addEventListener("keyup", (e) => { this.inputKeyUp(); });
        this._input.addEventListener("change", (e) => { this.inputKeyUp(); });
        this._anchor.tabIndex = 4;
    }
    get value() { return this._value; }
    set value(v) {
        if (v < 0)
            v = 0;
        if (v > 255)
            v = 255;
        this._value = v;
        this._input.value = this._value.toString();
    }
    inputKeyUp() {
        let value = parseInt(this._input.value);
        if (isNaN(value))
            return;
        if (value < 0)
            value = 0;
        if (value > 255)
            value = 255;
        this._value = value;
        this.refresh();
        this._changeCallBack(this);
    }
    TouchStart(div, e) {
        if (e.touches.length == 1)
            this.handleMouseStartCapture(div, e.touches[0].clientX, e.touches[0].clientY);
    }
    TouchCaptureRun(div, e) {
        if (e.touches.length == 1)
            this.handleMouseRun(div, e.touches[0].clientX, e.touches[0].clientY);
    }
    TouchCaptureEnd(div, e) {
    }
    MouseDown(sender, e) {
        if (e.buttons != 1)
            return;
        this.handleMouseStartCapture(sender, e.clientX, e.clientY);
    }
    handleMouseStartCapture(sender, x, y) {
        let SenderRect = sender.getBoundingClientRect();
        let eX = Math.round(x - SenderRect.left);
        let index = Math.round(256 * eX / this._div.offsetWidth) >> 0;
        if (index < 0)
            index = 0;
        if (index > 255)
            index = 255;
        this._value = index;
        this._input.value = index.toString();
        this.refresh();
        this._changeCallBack(this);
    }
    MouseMove(sender, e) {
        if (e.buttons != 1)
            return;
        this.handleMouseRun(sender, e.clientX, e.clientY);
    }
    handleMouseRun(sender, x, y) {
        let SenderRect = sender.getBoundingClientRect();
        let eX = Math.round(x - SenderRect.left);
        let index = Math.round(256 * eX / this._div.offsetWidth) >> 0;
        if (index < 0)
            index = 0;
        if (index > 255)
            index = 255;
        this._value = index;
        this._input.value = index.toString();
        this.refresh();
        this._changeCallBack(this);
    }
    mouseWheelEvent(sender, e) {
        this._value += e.deltaY > 0 ? -1 : 1;
        if (this._value < 0) {
            this._value = 0;
        }
        else if (this._value > 255) {
            this._value = 255;
        }
        else {
            e.preventDefault();
        }
        this._input.value = this._value.toString();
        this.refresh();
        this._changeCallBack(this);
    }
    KeyDown(sender, e) {
        if (e.code == "ArrowRight") {
            this._value++;
            if (this._value > 255)
                this._value = 255;
        }
        if (e.code == "ArrowLeft") {
            this._value--;
            if (this._value < 0)
                this._value = 0;
        }
        this._input.value = this._value.toString();
        this.refresh();
        this._changeCallBack(this);
    }
    refresh() {
        let color = this._colorCallback(this);
        let ctx = this._canvasBg.getContext('2d');
        ctx.clearRect(0, 0, this._canvasBg.width, this._canvasBg.height);
        for (let i = 0; i < 256; i++) {
            ctx.beginPath();
            ctx.moveTo(i + 0.5, 0);
            ctx.lineTo(i + 0.5, ColorEditorSroll.scrollHeight);
            ctx.strokeStyle = color[i];
            ctx.stroke();
        }
        this._canvasCursor.width = this._div.offsetWidth;
        this._canvasCursor.height = this._div.offsetHeight;
        ctx = this._canvasCursor.getContext('2d');
        let x = 0.5 + (this._value / 255.0) * this._canvasCursor.width;
        ctx.beginPath();
        let y = 0.5;
        ctx.moveTo(x, y + 5);
        ctx.lineTo(x + 3, y);
        ctx.lineTo(x - 3, y);
        ctx.fillStyle = "black";
        ctx.strokeStyle = "white";
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        y = this._canvasCursor.height - 0.5;
        ctx.beginPath();
        ctx.moveTo(x, y - 5);
        ctx.lineTo(x + 3, y);
        ctx.lineTo(x - 3, y);
        ctx.fillStyle = "black";
        ctx.strokeStyle = "white";
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }
}
ColorEditorSroll.scrollHeight = 26 * YoctoVisualization.constants.guiDPIFactor;
export class ColorSampler {
    setTabIndex(index) {
        this._colorDiv.tabIndex = index++;
        return index;
    }
    static checkerboardImage(width, height) {
        let halfWidth = width >> 1;
        let halfHeight = height >> 1;
        return '<svg xmlns="http://www.w3.org/2000/svg"   viewbox="0 0 ' + width + ' ' + height + '" width="' + width + 'px"  height="' + height + 'px" >'
            + '<rect x="0" y="0" width="' + width + '" height="' + height + '" style="fill:white"/>'
            + '<rect x="0" y="0" width="' + halfWidth + '" height="' + halfHeight + '" style="fill:black"/>'
            + '<rect x="' + halfWidth + '" y="' + halfHeight + '" width="' + halfWidth + '" height="' + halfHeight + '" style="fill:black"/>'
            + "</svg>";
    }
    constructor(containerDiv, selectCallback) {
        this._containerDiv = containerDiv;
        this._selectCallback = selectCallback;
        this._containerDiv.style.border = "1px solid grey";
        this._containerDiv.style.background = "url('data:image/svg+xml;utf8," + ColorSampler.checkerboardImage(100, 100) + "')";
        this._containerDiv.style.backgroundSize = "cover";
        this._containerDiv.style.backgroundPosition = "center";
        this._containerDiv.style.backgroundRepeat = "no-repeat";
        this._color = YDataRendering.YColor.Transparent;
        this._colorDiv = document.createElement("DIV");
        this._colorDiv.style.display = "display-block";
        this._colorDiv.style.position = "relative";
        this._colorDiv.style.width = "100%";
        this._colorDiv.style.height = "100%";
        this._colorDiv.style.backgroundColor = "rgba(0,0,0,0)";
        this._containerDiv.appendChild(this._colorDiv);
        if (this._selectCallback != null) {
            this._colorDiv.addEventListener("click", () => { this._selectCallback(this.color); });
            this._colorDiv.addEventListener('keyup', (e) => { if ((e.key === "Enter") || (e.key === " "))
                this._selectCallback(this.color); });
            this._colorDiv.style.cursor = "pointer";
        }
    }
    set color(value) {
        this._color = value.clone();
        this._colorDiv.style.backgroundColor = this._color.htmlCode;
    }
    get color() { return this._color.clone(); }
}
export class colorEditor {
    static AddColorToHistory(c) {
        for (let i = 0; i < colorEditor._colorHistory.length; i++) {
            if (c.equal(colorEditor._colorHistory[i]))
                return;
        }
        colorEditor._colorHistory.splice(colorEditor._colorHistory.length - 1, 1);
        colorEditor._colorHistory.splice(0, 0, c);
        for (let i = colorEditor._editorsList.length - 1; i >= 0; i--) {
            colorEditor._editorsList[i].refreshColorHistory();
        }
    }
    static get colorHistory() { return colorEditor._colorHistory; }
    get activeBorderColor() { return "#767676"; }
    get inactiveBorderColor() { return "#b0b0b0"; }
    get activeColor() { return "black"; }
    get inactiveColor() { return "grey"; }
    get activeBackgroundColor() { return "white"; }
    get inactiveBackgroundColor() { return "#f8f8f8"; }
    tabSelected(source) {
        if (source == this._tabRGB) {
            this._tabRGB.active = true;
            this._rgb_R_editor.refresh();
            this._rgb_G_editor.refresh();
            this._rgb_B_editor.refresh();
            this._rgb_T_editor.refresh();
        }
        else {
            this._tabRGB.active = false;
        }
        if (source == this._tabHSL) {
            this._tabHSL.active = true;
            this._hsl_H_editor.refresh();
            this._hsl_S_editor.refresh();
            this._hsl_L_editor.refresh();
            this._hsl_T_editor.refresh();
        }
        else {
            this._tabHSL.active = false;
        }
        this._tabPredef.active = source == this._tabPredef;
    }
    HueScrollBg() {
        let s = 100; //(100*this._hsl_S_editor.value/255.0);
        let l = 50; //(100*this._hsl_L_editor.value/255.0);
        let t = this._hsl_T_editor.value / 255.0;
        let res = new Array(256);
        for (let i = 0; i < 256; i++) {
            res[i] = "hsl(" + (360 * i / 256.0).toString() + "," + s.toString() + "%," + l.toString() + "%)";
        }
        return res;
    }
    SaturationScrollBg() {
        let h = 360 * this._hsl_H_editor.value / 256.0;
        let l = 100 * this._hsl_L_editor.value / 255.0;
        let t = this._hsl_T_editor.value / 255.0;
        let res = new Array(256);
        for (let i = 0; i < 256; i++) {
            res[i] = "hsl(" + h.toString() + "," + (100 * i / 255.0).toString() + "%," + l.toString() + "%)";
        }
        return res;
    }
    LuminosityScrollBg() {
        let h = 360 * this._hsl_H_editor.value / 256.0;
        let s = 100 * this._hsl_S_editor.value / 255.0;
        let t = this._hsl_T_editor.value / 255.0;
        let res = new Array(256);
        for (let i = 0; i < 256; i++) {
            res[i] = "hsl(" + h.toString() + "," + s.toString() + "%," + (100 * i / 255.0).toString() + "%)";
        }
        return res;
    }
    HSLTranspScrollBg() {
        let h = 360 * this._hsl_H_editor.value / 256;
        let s = 100 * this._hsl_S_editor.value / 255.0;
        let l = 100 * this._hsl_L_editor.value / 255.0;
        let res = new Array(256);
        for (let i = 0; i < 256; i++) {
            res[i] = "hsla(" + h.toString() + "," + l.toString() + "%," + s.toString() + "%," + (i / 255.0).toString() + ")";
        }
        return res;
    }
    RedScrollBg() {
        let g = this._rgb_G_editor.value;
        let b = this._rgb_B_editor.value;
        let t = this._rgb_T_editor.value / 255.0;
        let res = new Array(256);
        for (let i = 0; i < 256; i++) {
            res[i] = "rgb(" + i.toString() + "," + g.toString() + "," + b.toString() + ")";
        }
        return res;
    }
    GreenScrollBg() {
        let r = this._rgb_R_editor.value;
        let b = this._rgb_B_editor.value;
        let t = this._rgb_T_editor.value / 255.0;
        let res = new Array(256);
        for (let i = 0; i < 256; i++) {
            res[i] = "rgb(" + r.toString() + "," + i.toString() + "," + b.toString() + ")";
        }
        return res;
    }
    BlueScrollBg() {
        let r = this._rgb_R_editor.value;
        let g = this._rgb_G_editor.value;
        let t = this._rgb_T_editor.value / 255.0;
        let res = new Array(256);
        for (let i = 0; i < 256; i++) {
            res[i] = "rgb(" + r.toString() + "," + g.toString() + "," + i.toString() + ")";
        }
        return res;
    }
    RGBTranspScrollBg() {
        let r = this._rgb_R_editor.value;
        let g = this._rgb_G_editor.value;
        let b = this._rgb_B_editor.value;
        let res = new Array(256);
        for (let i = 0; i < 256; i++) {
            res[i] = "rgba(" + r.toString() + "," + g.toString() + "," + b.toString() + "," + (i / 255.0).toString() + ")";
        }
        return res;
    }
    static defaultColorHistory() {
        let defaultHistory = [];
        defaultHistory.push(YDataRendering.YColor.FromAhsl(100, 0, 0, 0));
        defaultHistory.push(YDataRendering.YColor.FromAhsl(100, 0, 0, 51));
        defaultHistory.push(YDataRendering.YColor.FromAhsl(100, 0, 0, 102));
        defaultHistory.push(YDataRendering.YColor.FromAhsl(100, 0, 0, 153));
        defaultHistory.push(YDataRendering.YColor.FromAhsl(100, 0, 0, 204));
        defaultHistory.push(YDataRendering.YColor.FromAhsl(100, 0, 0, 255));
        defaultHistory.push(YDataRendering.YColor.FromAhsl(100, 0, 255, 127));
        defaultHistory.push(YDataRendering.YColor.FromAhsl(100, 42, 255, 127));
        defaultHistory.push(YDataRendering.YColor.FromAhsl(100, 85, 255, 127));
        defaultHistory.push(YDataRendering.YColor.FromAhsl(100, 96, 255, 127));
        defaultHistory.push(YDataRendering.YColor.FromAhsl(100, 127, 255, 127));
        defaultHistory.push(YDataRendering.YColor.FromAhsl(100, 170, 255, 127));
        defaultHistory.push(YDataRendering.YColor.FromAhsl(100, 192, 255, 127));
        defaultHistory.push(YDataRendering.YColor.FromAhsl(100, 212, 255, 127));
        defaultHistory.push(YDataRendering.YColor.FromAhsl(255, 226, 217, 214));
        return defaultHistory;
    }
    destroy() {
        for (let i = colorEditor._editorsList.length - 1; i >= 0; i--) {
            if (colorEditor._editorsList[i] == this) {
                colorEditor._editorsList.splice(i, 1);
            }
        }
    }
    refreshColorHistory() {
        for (let i = 0; i < this._samples.length; i++) {
            if (i < colorEditor._colorHistory.length) {
                this._samples[i].color = colorEditor._colorHistory[i].clone();
            }
        }
    }
    constructor(container, fontSize, initialColor, colorChangeCallback) {
        this._firstTabIndex = 0;
        this._memorizeTimer = null;
        colorEditor._editorsList.push(this);
        this._colorChangeCallback = colorChangeCallback;
        this._container = container;
        this._table = document.createElement("TABLE");
        this._table.style.width = "100%";
        this._table.style.borderSpacing = "0";
        this._table.style.paddingLeft = "5px";
        this._table.style.paddingTop = "5px";
        this._table.style.paddingRight = "5px";
        this._table.style.borderCollapse = "separate";
        this._tr1 = document.createElement("TR");
        this._tr2 = document.createElement("TR");
        this._tabRGB = new ColorEditorTab(this, "RGB", fontSize);
        this._tabHSL = new ColorEditorTab(this, "HSL", fontSize);
        this._tabPredef = new ColorEditorTab(this, "Predefined", fontSize);
        this._tabStub = new ColorEditorTab(this, "", fontSize);
        this._contents = document.createElement("TD");
        this._contents.colSpan = 4;
        this._contents.style.borderLeft = "1px solid " + this.activeBorderColor;
        this._contents.style.borderRight = "1px solid " + this.activeBorderColor;
        this._contents.style.borderBottom = "1px solid " + this.activeBorderColor;
        this._contents.style.backgroundColor = this.activeBackgroundColor;
        this._tr1.appendChild(this._tabRGB.tabElement);
        this._tr1.appendChild(this._tabHSL.tabElement);
        this._tr1.appendChild(this._tabPredef.tabElement);
        this._tr1.appendChild(this._tabStub.tabElement);
        this._tr2.appendChild(this._contents);
        this._table.appendChild(this._tr1);
        this._table.appendChild(this._tr2);
        this._contents.appendChild(this._tabRGB.divElement);
        this._contents.appendChild(this._tabHSL.divElement);
        this._contents.appendChild(this._tabPredef.divElement);
        let RGBtable = document.createElement("TABLE");
        RGBtable.style.width = "100%";
        RGBtable.style.borderSpacing = "1";
        this._tabRGB.divElement.appendChild(RGBtable);
        let HSLtable = document.createElement("TABLE");
        HSLtable.style.width = "100%";
        HSLtable.style.borderSpacing = "1";
        this._tabHSL.divElement.appendChild(HSLtable);
        let predefTable = document.createElement("TABLE");
        this._tabPredef.divElement.appendChild(predefTable);
        predefTable.style.width = "100%";
        predefTable.style.borderSpacing = "1";
        predefTable.style.tableLayout = "fixed";
        this._container.appendChild(this._table);
        this._rgb_R_editor = this.AddColorScroll(RGBtable, "R", () => { return this.RedScrollBg(); }, (src) => { this.RgbColorChangeCallBack(src); }, false, 1);
        this._rgb_G_editor = this.AddColorScroll(RGBtable, "G", () => { return this.GreenScrollBg(); }, (src) => { this.RgbColorChangeCallBack(src); }, false, 2);
        this._rgb_B_editor = this.AddColorScroll(RGBtable, "B", () => { return this.BlueScrollBg(); }, (src) => { this.RgbColorChangeCallBack(src); }, false, 3);
        this._rgb_T_editor = this.AddColorScroll(RGBtable, "T", () => { return this.RGBTranspScrollBg(); }, (src) => { this.RgbColorChangeCallBack(src); }, true, 3);
        this._rgb_R_editor.value = initialColor.red;
        this._rgb_G_editor.value = initialColor.green;
        this._rgb_B_editor.value = initialColor.blue;
        this._rgb_T_editor.value = initialColor.alpha;
        this._rgb_R_editor.refresh();
        this._rgb_G_editor.refresh();
        this._rgb_B_editor.refresh();
        this._rgb_T_editor.refresh();
        this._hsl_H_editor = this.AddColorScroll(HSLtable, "H", () => { return this.HueScrollBg(); }, (src) => { this.HslColorChangeCallBack(src); }, false, 1);
        this._hsl_S_editor = this.AddColorScroll(HSLtable, "S", () => { return this.SaturationScrollBg(); }, (src) => { this.HslColorChangeCallBack(src); }, false, 2);
        this._hsl_L_editor = this.AddColorScroll(HSLtable, "L", () => { return this.LuminosityScrollBg(); }, (src) => { this.HslColorChangeCallBack(src); }, false, 3);
        this._hsl_T_editor = this.AddColorScroll(HSLtable, "T", () => { return this.HSLTranspScrollBg(); }, (src) => { this.HslColorChangeCallBack(src); }, true, 3);
        this._hsl_H_editor.value = initialColor.hue;
        this._hsl_S_editor.value = initialColor.saturation;
        this._hsl_L_editor.value = initialColor.luminosity;
        this._hsl_T_editor.value = initialColor.alpha;
        this._hsl_H_editor.refresh();
        this._hsl_S_editor.refresh();
        this._hsl_L_editor.refresh();
        this._hsl_T_editor.refresh();
        // construct Color samples table at to bottom of the UI
        let samplesTable = document.createElement("TABLE");
        samplesTable.style.position = "relative";
        samplesTable.style.width = "100%";
        samplesTable.style.paddingLeft = "3px";
        samplesTable.style.paddingRight = "3px";
        samplesTable.style.paddingTop = "10px";
        samplesTable.style.bottom = "3px";
        samplesTable.style.tableLayout = "fixed";
        let samplesTD = [];
        let previewTD = null;
        let sampleHeight = 30;
        let sampletr1 = document.createElement("TR");
        sampletr1.style.height = sampleHeight.toString() + "px";
        for (let i = 0; i < 6; i++) {
            let td = document.createElement("TD");
            //td.style.border="1px solid red";
            if (i == 5) {
                td.colSpan = 2;
                td.rowSpan = 3;
                previewTD = td;
            }
            else {
                samplesTD.push(td);
            }
            sampletr1.appendChild(td);
        }
        samplesTable.appendChild(sampletr1);
        let sampletr2 = document.createElement("TR");
        sampletr2.style.height = sampleHeight.toString() + "px";
        for (let i = 0; i < 5; i++) {
            let td = document.createElement("TD");
            //td.style.border="1px solid red";
            samplesTD.push(td);
            sampletr2.appendChild(td);
        }
        samplesTable.appendChild(sampletr2);
        let sampletr3 = document.createElement("TR");
        sampletr3.style.height = sampleHeight.toString() + "px";
        for (let i = 0; i < 5; i++) {
            let td = document.createElement("TD");
            //td.style.border="1px solid red";
            samplesTD.push(td);
            sampletr3.appendChild(td);
        }
        samplesTable.appendChild(sampletr3);
        this._container.appendChild(samplesTable);
        this._samples = [];
        for (let i = 0; i < samplesTD.length; i++) {
            let div = document.createElement("DIV");
            div.style.position = "relative";
            div.style.width = "100%";
            div.style.height = (sampleHeight - 4).toString() + "px";
            div.style.display = "inline-block";
            div.title = "Color history";
            samplesTD[i].appendChild(div);
            let sampler = new ColorSampler(div, (c) => { this.sampleWasSelectedCallback(c); });
            sampler.color = colorEditor._colorHistory[i];
            this._samples.push(sampler);
        }
        // predefined colors
        let prefinedColors = YDataRendering.YColor.predefinedColors;
        let colors = [];
        let predefinedColorNames = Object.keys(prefinedColors);
        for (let i = 0; i < predefinedColorNames.length; i++) {
            colors.push(prefinedColors[predefinedColorNames[i]]);
        }
        colors.sort((c1, c2) => {
            if (c1.alpha < c2.alpha)
                return 1;
            if (c1.alpha > c2.alpha)
                return -1;
            if (c1.luminosity < c2.luminosity)
                return 1;
            if (c1.luminosity > c2.luminosity)
                return -1;
            if (c1.saturation < c2.saturation)
                return 1;
            if (c1.saturation > c2.saturation)
                return -1;
            if (c1.hue < c2.hue)
                return 1;
            if (c1.hue > c2.hue)
                return -1;
            return 0;
        });
        let currenTR = null;
        this._prefedDivs = [];
        //debugger;
        for (let i = 0; i < colors.length; i++) {
            let c = colors[i];
            if ((i % 16) == 0) {
                currenTR = document.createElement("TR");
                predefTable.appendChild(currenTR);
            }
            let td = document.createElement("TD");
            currenTR.appendChild(td);
            let div = document.createElement("DIV");
            this._prefedDivs.push(div);
            div.style.position = "relative";
            div.style.width = "100%";
            div.style.height = Math.round(10 * YoctoVisualization.constants.guiDPIFactor).toString() + "px";
            div.style.display = "inline-block";
            div.title = c.name;
            td.appendChild(div);
            let sampler = new ColorSampler(div, (c) => { this.sampleWasSelectedCallback(c); });
            sampler.color = c;
        }
        // preview
        let div = document.createElement("DIV");
        div.style.position = "relative";
        div.style.width = "100%";
        div.style.height = (3 * sampleHeight).toString() + "px";
        div.style.display = "inline-block";
        div.title = "Color preview";
        previewTD.appendChild(div);
        this._preview = new ColorSampler(div, null);
        this._preview.color = initialColor;
        this.selectApropriateTab(initialColor);
    }
    selectApropriateTab(color) {
        if (color.isPredefined) {
            this._tabPredef.active = true;
            this.tabSelected(this._tabPredef);
        }
        else {
            this._tabPredef.active = false;
            if (color.isRGB) {
                this._tabRGB.active = true;
                this._tabHSL.active = false;
                this.tabSelected(this._tabRGB);
            }
            else {
                this._tabRGB.active = false;
                this._tabHSL.active = true;
                this.tabSelected(this._tabHSL);
            }
        }
    }
    sampleWasSelectedCallback(color) {
        this._rgb_R_editor.value = color.red;
        this._rgb_G_editor.value = color.green;
        this._rgb_B_editor.value = color.blue;
        this._rgb_T_editor.value = color.alpha;
        this._hsl_H_editor.value = color.hue;
        this._hsl_S_editor.value = color.saturation;
        this._hsl_L_editor.value = color.luminosity;
        this._hsl_T_editor.value = color.alpha;
        this._preview.color = color;
        this._rgb_R_editor.refresh();
        this._rgb_G_editor.refresh();
        this._rgb_B_editor.refresh();
        this._rgb_T_editor.refresh();
        this._hsl_H_editor.refresh();
        this._hsl_S_editor.refresh();
        this._hsl_L_editor.refresh();
        this._hsl_T_editor.refresh();
        this.initColorMemorization(color);
        if (this._colorChangeCallback != null)
            this._colorChangeCallback(color);
    }
    initColorMemorization(color) {
        if (this._memorizeTimer != null)
            clearTimeout(this._memorizeTimer);
        this._memorizeTimer = setTimeout(() => {
            this._memorizeTimer = null;
            colorEditor.AddColorToHistory(color);
        }, 2000);
    }
    RgbColorChangeCallBack(src) {
        if (src != this._rgb_R_editor)
            this._rgb_R_editor.refresh();
        if (src != this._rgb_G_editor)
            this._rgb_G_editor.refresh();
        if (src != this._rgb_B_editor)
            this._rgb_B_editor.refresh();
        if (src != this._rgb_T_editor)
            this._rgb_T_editor.refresh();
        let color = YDataRendering.YColor.FromArgb(this._rgb_T_editor.value, this._rgb_R_editor.value, this._rgb_G_editor.value, this._rgb_B_editor.value);
        this._preview.color = color;
        this.initColorMemorization(color);
        if (this._colorChangeCallback != null)
            this._colorChangeCallback(color);
    }
    HslColorChangeCallBack(src) {
        if (src != this._hsl_H_editor)
            this._hsl_H_editor.refresh();
        if (src != this._hsl_S_editor)
            this._hsl_S_editor.refresh();
        if (src != this._hsl_L_editor)
            this._hsl_L_editor.refresh();
        if (src != this._hsl_T_editor)
            this._hsl_T_editor.refresh();
        let color = YDataRendering.YColor.FromAhsl(this._hsl_T_editor.value, this._hsl_H_editor.value, this._hsl_S_editor.value, this._hsl_L_editor.value);
        this._preview.color = color;
        this.initColorMemorization(color);
        if (this._colorChangeCallback != null)
            this._colorChangeCallback(color);
    }
    set color(color) {
        this._preview.color = color;
        this._hsl_H_editor.value = color.hue;
        this._hsl_S_editor.value = color.saturation;
        this._hsl_L_editor.value = color.luminosity;
        this._hsl_T_editor.value = color.alpha;
        this._rgb_R_editor.value = color.red;
        this._rgb_G_editor.value = color.green;
        this._rgb_B_editor.value = color.blue;
        this._rgb_T_editor.value = color.alpha;
        this._hsl_H_editor.refresh();
        this._hsl_S_editor.refresh();
        this._hsl_L_editor.refresh();
        this._hsl_T_editor.refresh();
        this._rgb_R_editor.refresh();
        this._rgb_G_editor.refresh();
        this._rgb_B_editor.refresh();
        this._rgb_T_editor.refresh();
        this.selectApropriateTab(color);
    }
    AddColorScroll(container, label, colorCallback, changeCallBack, checkerBoardBg, value) {
        let RGB_R_Row = document.createElement("TR");
        let RGB_R_Col1 = document.createElement("TD");
        RGB_R_Col1.innerHTML = "&nbsp;" + label + "&nbsp;";
        let RGB_R_Col2 = document.createElement("TD");
        let RGB_R_Anchor = document.createElement("ANCHOR");
        RGB_R_Col2.appendChild(RGB_R_Anchor);
        let RGB_R_Div = document.createElement("DIV");
        RGB_R_Col2.style.width = "100%";
        RGB_R_Anchor.appendChild(RGB_R_Div);
        let RGB_R_Col3 = document.createElement("TD");
        let RGB_R_Input = document.createElement("INPUT");
        RGB_R_Col3.appendChild(RGB_R_Input);
        RGB_R_Row.appendChild(RGB_R_Col1);
        RGB_R_Row.appendChild(RGB_R_Col2);
        RGB_R_Row.appendChild(RGB_R_Col3);
        container.appendChild(RGB_R_Row);
        return new ColorEditorSroll(RGB_R_Div, RGB_R_Anchor, RGB_R_Input, colorCallback, changeCallBack, checkerBoardBg, value);
    }
    setTabIndex(index) {
        this._firstTabIndex = index;
        index = this._tabRGB.setTabIndex(index);
        index = this._tabHSL.setTabIndex(index);
        index = this._tabPredef.setTabIndex(index);
        if (this._tabRGB.active) {
            index = this._rgb_R_editor.setTabIndex(index);
            index = this._rgb_G_editor.setTabIndex(index);
            index = this._rgb_B_editor.setTabIndex(index);
            index = this._rgb_T_editor.setTabIndex(index);
        }
        else if (this._tabHSL.active) {
            index = this._hsl_H_editor.setTabIndex(index);
            index = this._hsl_S_editor.setTabIndex(index);
            index = this._hsl_L_editor.setTabIndex(index);
            index = this._hsl_T_editor.setTabIndex(index);
        }
        else {
            for (let i = 0; i < this._prefedDivs.length; i++) {
                this._prefedDivs[i].tabIndex = index++;
            }
        }
        for (let i = 0; i < this._samples.length; i++) {
            index = this._samples[i].setTabIndex(index);
        }
        return index;
    }
}
colorEditor._colorHistory = colorEditor.defaultColorHistory();
colorEditor._editorsList = [];
//#endif

/*
*   Yocto-Visualization (for web), a free web-based application
*   to visualize Yoctopuce Sensors.
*
*  Digital display  widget renderer
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
import * as YDataRendering from "./YDataRendererCommon.js";
export class YDigitalDisplay extends YDataRendering.YDataRenderer {
    get backgroundColor1() { return this._backgroundColor1; }
    set backgroundColor1(value) {
        this._backgroundColor1 = value;
        this._bgBrush = null;
        this.redraw();
    }
    get backgroundColor2() { return this._backgroundColor2; }
    set backgroundColor2(value) {
        this._backgroundColor2 = value;
        this._bgBrush = null;
        this.redraw();
    }
    get alternateValue() { return this._alternateValue; }
    set alternateValue(value) {
        this._alternateValue = value;
        this.redraw();
    }
    get valueFormater() { return this._valueFormater; }
    set valueFormater(value) {
        this._valueFormater = value;
        this.redraw();
    }
    get hrzAlignmentOfset() { return this._hrzAlignmentOfset; }
    set hrzAlignmentOfset(value) {
        this._hrzAlignmentOfset = value;
        this.redraw();
    }
    get hrzAlignment() { return this._hrzAlignment; }
    set hrzAlignment(value) {
        this._hrzAlignment = value;
        this.redraw();
    }
    get outOfRangeMin() { return this._outOfRangeMin; }
    set outOfRangeMin(value) {
        if (!Number.isNaN(value) && !Number.isNaN(this._outOfRangeMax) && !YDataRendering.YDataRenderer.minMaxCheckDisabled) {
            if (value >= this._outOfRangeMax)
                throw new RangeError("Min cannot be greater than max (" + this._outOfRangeMax.toString() + ")");
        }
        this._outOfRangeMin = value;
        this.redraw();
    }
    get outOfRangeMax() { return this._outOfRangeMax; }
    set outOfRangeMax(value) {
        if (!Number.isNaN(value) && !Number.isNaN(this._outOfRangeMin) && !YDataRendering.YDataRenderer.minMaxCheckDisabled) {
            if (value <= this._outOfRangeMin)
                throw new RangeError("Min cannot be less than max (" + this._outOfRangeMin.toString() + ")");
        }
        this._outOfRangeMax = value;
        this.redraw();
    }
    get outOfRangeColor() { return this._outOfRangeColor; }
    set outOfRangeColor(value) {
        this._outOfRangeColor = value;
        this.redraw();
    }
    get value() { return this._value; }
    set value(value) {
        this._value = value;
        this.redraw();
    }
    get font() { return this._font; }
    constructor(UIContainer, logFunction) {
        super(UIContainer, logFunction);
        this._bgBrush = null;
        this._backgroundColor1 = YDataRendering.YColor.Black;
        this._backgroundColor2 = YDataRendering.YColor.FromArgb(255, 48, 48, 48);
        this._alternateValue = null;
        this._valueFormater = null;
        this._hrzAlignmentOfset = 5.0;
        this._hrzAlignment = YDigitalDisplay.HrzAlignment.DECIMAL;
        this._outOfRangeMin = Number.NaN;
        this._outOfRangeMax = Number.NaN;
        this._outOfRangeColor = YDataRendering.YColor.Red;
        this._value = 0.0;
        this._font = new YDataRendering.YFont(this, this, Math.min(UIContainer.width / 5, UIContainer.height / 2), null);
        this._font.color = YDataRendering.YColor.LightGreen;
        this.resizeRule = YDataRendering.Proportional.ResizeRule.RELATIVETOBOTH;
    }
    clearCachedObjects() {
        if (this.font != null)
            this.font.ResetFont(null);
        this._bgBrush = null;
    }
    Render(g, w, h) {
        let mainViewPort = new YDataRendering.ViewPortSettings();
        mainViewPort.Lmargin = 0;
        mainViewPort.Rmargin = 0;
        mainViewPort.Tmargin = 0;
        mainViewPort.Bmargin = 0;
        g.SmoothingMode = YDataRendering.YSmoothingMode.HighQuality;
        g.TextRenderingHint = YDataRendering.YTextRenderingHint.AntiAlias;
        let stringFormat = new YDataRendering.YStringFormat(16384 /* YDataRendering.YStringFormat.StringFormatFlags.NoClip */);
        stringFormat.Alignment = 1 /* YDataRendering.YStringFormat.StringAlignment.Center */;
        stringFormat.LineAlignment = 1 /* YDataRendering.YStringFormat.StringAlignment.Center */;
        if (this._bgBrush == null) {
            this._bgBrush = new YDataRendering.YLinearGradientBrush(this._backgroundColor1, this._backgroundColor2);
        }
        g.FillRectangleXYHW(this._bgBrush, 0, 0, w, h);
        this.drawAnnotationPanels(g, this._annotationPanels, w, h, false, mainViewPort);
        if (mainViewPort.Tmargin >= 20)
            mainViewPort.Tmargin -= 10; // AnnotationPanels adds at least 20px warnings
        if (mainViewPort.Bmargin >= 20)
            mainViewPort.Bmargin -= 10; // which is a bit much for digital display
        g.TextRenderingHint = YDataRendering.YTextRenderingHint.AntiAlias;
        let availWidth = w - (mainViewPort.Lmargin + mainViewPort.Rmargin);
        let availHeight = h - (mainViewPort.Tmargin + mainViewPort.Bmargin);
        if ((availWidth > 10) && (availHeight > 10)) { // draw unit
            let svalue;
            if (this._alternateValue == null) {
                svalue = this._valueFormater == null ? this.value.toFixed(3) : this._valueFormater(this, this.value);
                if ((!Number.isNaN(this._outOfRangeMin)) && (this.value < this._outOfRangeMin)) {
                    this.font.alternateColor = this._outOfRangeColor;
                }
                else if ((!Number.isNaN(this._outOfRangeMax)) && (this.value > this._outOfRangeMax)) {
                    this.font.alternateColor = this._outOfRangeColor;
                }
                else {
                    this.font.alternateColor = null;
                }
            }
            else {
                this._font.alternateColor = null;
                svalue = this._alternateValue;
            }
            let size = g.MeasureStringSF(svalue, this.font, 10000, stringFormat);
            let pos;
            let align = this._hrzAlignment;
            if ((this._alternateValue != null) && (align == YDigitalDisplay.HrzAlignment.DECIMAL))
                align = YDigitalDisplay.HrzAlignment.RIGHT;
            if ((align == YDigitalDisplay.HrzAlignment.DECIMAL) && (svalue.indexOf(".") < 0))
                align = YDigitalDisplay.HrzAlignment.RIGHT;
            switch (align) {
                case YDigitalDisplay.HrzAlignment.LEFT:
                    pos = new YDataRendering.YRectangle(mainViewPort.Lmargin + ((availWidth * this.hrzAlignmentOfset / 100) >> 0), mainViewPort.Tmargin + ((availHeight - size.height) / 2) >> 0, (size.width + 1) >> 0, (size.height + 1) >> 0);
                    g.DrawStringRect(svalue, this.font, this.font.brush, pos, stringFormat);
                    break;
                case YDigitalDisplay.HrzAlignment.CENTER:
                    pos = new YDataRendering.YRectangle(mainViewPort.Lmargin + ((availWidth - size.width) / 2) >> 0, mainViewPort.Tmargin + ((availHeight - size.height) / 2) >> 0, (size.width + 1) >> 0, (size.height + 1) >> 0);
                    g.DrawStringRect(svalue, this.font, this.font.brush, pos, stringFormat);
                    break;
                case YDigitalDisplay.HrzAlignment.DECIMAL:
                    let left = "";
                    let p = svalue.lastIndexOf(',');
                    if (p < 0)
                        p = svalue.lastIndexOf('.');
                    if (p >= 0) {
                        left = svalue.substring(0, p + 1);
                    }
                    else {
                        p = 0;
                        while ((p < svalue.length) && ((svalue[p] >= '0' && svalue[p] <= '9') || (svalue[p] == '-') || (svalue[p] == '\'') || (svalue[p] == ' '))) {
                            p++;
                        }
                        left = svalue.substring(0, p);
                    }
                    let lsize = g.MeasureStringSF(left, this.font, 10000, stringFormat);
                    pos = new YDataRendering.YRectangle(mainViewPort.Lmargin + (availWidth - lsize.width - availWidth * this.hrzAlignmentOfset / 100) >> 0, mainViewPort.Tmargin + ((availHeight - size.height) / 2) >> 0, (size.width + 1) >> 0, (size.height + 1) >> 0);
                    g.DrawStringRect(svalue, this.font, this.font.brush, pos, stringFormat);
                    break;
                case YDigitalDisplay.HrzAlignment.RIGHT:
                    pos = new YDataRendering.YRectangle(mainViewPort.Lmargin + (availWidth - size.width - availWidth * this.hrzAlignmentOfset / 100) >> 0, mainViewPort.Tmargin + ((availHeight - size.height) / 2) >> 0, (size.width + 1) >> 0, (size.height + 1) >> 0);
                    g.DrawStringRect(svalue, this.font, this.font.brush, pos, stringFormat);
                    break;
            }
        }
        this.drawAnnotationPanels(g, this._annotationPanels, w, h, true, mainViewPort);
        this.DrawMessagePanels(g, w, h);
        return 0;
    }
}
(function (YDigitalDisplay) {
    class HrzAlignmentEnumItem extends YDataRendering.YEnumItem {
        constructor(value, humanreadable, container) {
            super(value, humanreadable, HrzAlignment);
        }
    }
    YDigitalDisplay.HrzAlignmentEnumItem = HrzAlignmentEnumItem;
    class HrzAlignment extends YDataRendering.YEnum {
    }
    HrzAlignment.LEFT = new HrzAlignmentEnumItem("LEFT", "Left");
    HrzAlignment.CENTER = new HrzAlignmentEnumItem("CENTER", "Center");
    HrzAlignment.DECIMAL = new HrzAlignmentEnumItem("DECIMAL", "Decimal");
    HrzAlignment.RIGHT = new HrzAlignmentEnumItem("RIGHT", "Right");
    YDigitalDisplay.HrzAlignment = HrzAlignment;
    //export const enum HrzAlignment { LEFT = "Left", CENTER = "Center", DECIMAL="Decimal", RIGHT ="Right"  }
})(YDigitalDisplay || (YDigitalDisplay = {}));

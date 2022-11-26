/*
*   Yocto-Visualization (for web), a free web-based application
*   to visualize Yoctopuce Sensors.
*
*  Solid gauge widget renderer
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
class DrawPrameters {
    constructor() {
        this.outerRadius = 0;
        this.innerRadius = 0;
        this.angleStart = 0;
        this.angleEnd = 0;
        this.ycenter = 0;
        this.xcenter = 0;
        this.heightTop = 0;
        this.heightBottom = 0;
        this.valueRectangle = new YDataRendering.YRectangle(0, 0, 0, 0);
        this.valueFormat = new YDataRendering.YStringFormat(16384 /* YDataRendering.YStringFormat.StringFormatFlags.NoClip */);
        this.minValueRectangle = new YDataRendering.YRectangle(0, 0, 0, 0);
        this.minValueFormat = new YDataRendering.YStringFormat(16384 /* YDataRendering.YStringFormat.StringFormatFlags.NoClip */);
        this.maxValueRectangle = new YDataRendering.YRectangle(0, 0, 0, 0);
        this.maxValueFormat = new YDataRendering.YStringFormat(16384 /* YDataRendering.YStringFormat.StringFormatFlags.NoClip */);
        this.minValue = "";
        this.maxValue = "";
        this.value = "";
    }
}
export class YSolidGauge extends YDataRendering.YDataRenderer {
    get min() { return this._min; }
    set min(value) {
        if ((value >= this._max) && (!YDataRendering.YDataRenderer.minMaxCheckDisabled)) {
            throw new RangeError("Min cannot be greater than max (" + this._max.toString() + ")");
        }
        this._min = value;
        if (this._shownValue < this._min)
            this._shownValue = this._min;
        this.redraw();
    }
    get max() { return this._max; }
    set max(value) {
        if ((value <= this._min) && (!YDataRendering.YDataRenderer.minMaxCheckDisabled)) {
            throw new RangeError("Max cannot be less than min (" + this._min.toString() + ")");
        }
        this._max = value;
        if (this._shownValue > this._max)
            this._shownValue = this._max;
        this.redraw();
    }
    get borderpen() {
        if (this._borderpen == null) {
            this._borderpen = new YDataRendering.YPen(this._borderColor, this._borderThickness);
            this._borderpen.startCap = 1 /* YDataRendering.YPen.LineCap.Square */;
            this._borderpen.endCap = 1 /* YDataRendering.YPen.LineCap.Square */;
        }
        return this._borderpen;
    }
    get borderColor() { return this._borderColor; }
    set borderColor(value) {
        this._borderColor = value;
        this._borderpen = null;
        this.redraw();
    }
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
    get borderThickness() { return this._borderThickness; }
    set borderThickness(value) {
        if (value < 0)
            throw new RangeError("Thickness must be a positive value");
        this._borderThickness = value;
        this._borderpen = null;
        this._path = null;
        this.redraw();
    }
    get valueFormater() { return this._valueFormater; }
    set valueFormater(value) {
        this._valueFormater = value;
        this.redraw();
    }
    get minmaxFormater() { return this._minmaxFormater; }
    set minmaxFormater(value) {
        this._minmaxFormater = value;
        this.redraw();
    }
    get thickness() { return this._thickness; }
    set thickness(value) {
        if (value < 0)
            throw new RangeError("Thickness must be a positive value");
        this._thickness = Math.max(Math.min(value, 80), 1);
        this._path = null;
        this.redraw();
    }
    get maxSpeed() { return this._maxSpeed; }
    set maxSpeed(value) {
        if (value <= 0)
            throw new RangeError("Speed must be a positive value");
        this._maxSpeed = value;
    }
    get value() { return this._value; }
    set value(value) {
        this._value = value;
        this.redraw();
    }
    get color1() { return this._color1; }
    set color1(value) {
        this._color1 = value;
        this.redraw();
    }
    get color2() { return this._color2; }
    set color2(value) {
        this._color2 = value;
        this.redraw();
    }
    get font() { return this._font; }
    get minMaxFont() { return this._minMaxFont; }
    get showMinMax() { return this._showMinMax; }
    set showMinMax(value) {
        this._showMinMax = value;
        this._path = null;
        this.redraw();
    }
    get displayMode() { return this._displayMode; }
    set displayMode(value) {
        this._displayMode = value;
        this._path = null;
        this._bgBrush = null;
        this.redraw();
    }
    FontsizeChange(source) { this._path = null; }
    constructor(UIContainer, mode, logFunction) {
        super(UIContainer, logFunction);
        this._shownValue = 0;
        this._min = 0;
        this._max = 100;
        this.SegmentMaxLength = 8;
        this.mainViewPort = new YDataRendering.ViewPortSettings();
        this._borderpen = null;
        this._borderColor = YDataRendering.YColor.Black;
        this._bgBrush = null;
        this._backgroundColor1 = YDataRendering.YColor.FromArgb(255, 240, 240, 240);
        this._backgroundColor2 = YDataRendering.YColor.FromArgb(255, 200, 200, 200);
        this._borderThickness = 5;
        this._valueFormater = null;
        this._minmaxFormater = null;
        this._thickness = 25;
        this._maxSpeed = 0.1;
        this._value = 0;
        this._color1 = YDataRendering.YColor.Green;
        this._color2 = YDataRendering.YColor.Red;
        this._font = null;
        this._minMaxFont = null;
        this._showMinMax = true;
        this._path = null;
        this.lastDrawParameters = new DrawPrameters();
        this._displayMode = YSolidGauge.DisplayMode.DISPLAY90;
        this._minMaxFont = new YDataRendering.YFont(this, this, Math.min(UIContainer.width, UIContainer.height) / 15, () => { this.FontsizeChange(this._minMaxFont); });
        this._displayMode = mode;
        this._font = new YDataRendering.YFont(this, this, Math.min(UIContainer.width, UIContainer.height) / 5, null);
        this.resizeRule = YDataRendering.Proportional.ResizeRule.RELATIVETOBOTH;
        let g = new YDataRendering.YGraphics(UIContainer, UIContainer.width, UIContainer.height, 90);
        let p = this.ComputeDrawParameters(g, UIContainer.width, UIContainer.height, this.mainViewPort);
        g.Dispose();
    }
    clearCachedObjects() {
        this._bgBrush = null;
        this._path = null;
    }
    ComputeDrawParameters(g, UIw, UIh, mainViewPort) {
        UIw -= mainViewPort.Lmargin + mainViewPort.Rmargin;
        UIh -= mainViewPort.Tmargin + mainViewPort.Bmargin;
        let w = UIw - 5 - this._borderThickness;
        let h = UIh - 5 - this._borderThickness;
        let xcenter = UIw / 2;
        let outerRadius = 0;
        let angleStart = 0;
        let angleEnd = 0;
        let ycenter = 0;
        let ValueRectangle = new YDataRendering.YRectangle(0, 0, 0, 0);
        let valueFormat = new YDataRendering.YStringFormat(16384 /* YDataRendering.YStringFormat.StringFormatFlags.NoClip */);
        let innerRadius = 0;
        let minMaxHeight = 0;
        let s1 = new YDataRendering.YSizeF(null, "");
        let s2 = new YDataRendering.YSizeF(null, "");
        this.lastDrawParameters.value = this._valueFormater == null ? this._value.toFixed(0) : this._valueFormater(this, this._value);
        if (this._showMinMax) {
            this.lastDrawParameters.minValue = this._minmaxFormater == null ? this._min.toFixed(0) : this._minmaxFormater(this, this._min);
            this.lastDrawParameters.maxValue = this._minmaxFormater == null ? this._max.toFixed(0) : this._minmaxFormater(this, this._max);
            s1 = g.MeasureString(this.lastDrawParameters.minValue, this._minMaxFont, 100000);
            s2 = g.MeasureString(this.lastDrawParameters.maxValue, this._minMaxFont, 100000);
            this.lastDrawParameters.minValueFormat = new YDataRendering.YStringFormat(16384 /* YDataRendering.YStringFormat.StringFormatFlags.NoClip */);
            this.lastDrawParameters.maxValueFormat = new YDataRendering.YStringFormat(16384 /* YDataRendering.YStringFormat.StringFormatFlags.NoClip */);
            minMaxHeight = s1.height;
            if (s2.height > minMaxHeight)
                minMaxHeight = s2.height;
        }
        switch (this._displayMode) {
            case YSolidGauge.DisplayMode.DISPLAY90:
                h = h - minMaxHeight;
                w = w - minMaxHeight;
                outerRadius = w;
                if (outerRadius > h - this._borderThickness)
                    outerRadius = h - this.borderThickness;
                if (outerRadius > w - this.borderThickness)
                    outerRadius = w - this.borderThickness;
                angleStart = Math.PI / 2;
                angleEnd = Math.PI;
                this.lastDrawParameters.heightTop = outerRadius;
                this.lastDrawParameters.heightBottom = 0;
                ycenter = mainViewPort.Tmargin + h;
                xcenter = mainViewPort.Lmargin + UIw / 2 + outerRadius / 2 - minMaxHeight + this._borderThickness;
                innerRadius = outerRadius * (100 - this._thickness) / 100;
                ValueRectangle = new YDataRendering.YRectangle((xcenter - innerRadius) >> 0, (ycenter - innerRadius) >> 0, innerRadius >> 0, innerRadius >> 0);
                valueFormat.Alignment = 2 /* YDataRendering.YStringFormat.StringAlignment.Far */;
                valueFormat.LineAlignment = 2 /* YDataRendering.YStringFormat.StringAlignment.Far */;
                if (this._showMinMax) {
                    this.lastDrawParameters.minValueRectangle = new YDataRendering.YRectangle((xcenter - ((outerRadius + innerRadius + s1.width) / 2)) >> 0, (ycenter + this._borderThickness) >> 0, (s1.width + 1) >> 0, (minMaxHeight + 1) >> 0);
                    this.lastDrawParameters.minValueFormat.Alignment = 0 /* YDataRendering.YStringFormat.StringAlignment.Near */;
                    this.lastDrawParameters.minValueFormat.LineAlignment = 0 /* YDataRendering.YStringFormat.StringAlignment.Near */;
                    this.lastDrawParameters.maxValueRectangle = new YDataRendering.YRectangle((xcenter + this._borderThickness) >> 0, (ycenter - outerRadius + (outerRadius - innerRadius - s2.width) / 2) >> 0, (minMaxHeight + 1) >> 0, (s2.width + 1) >> 0);
                    this.lastDrawParameters.maxValueFormat.Alignment = 0 /* YDataRendering.YStringFormat.StringAlignment.Near */;
                    this.lastDrawParameters.maxValueFormat.LineAlignment = 0 /* YDataRendering.YStringFormat.StringAlignment.Near */;
                    this.lastDrawParameters.maxValueFormat.FormatFlags = 2 /* YDataRendering.YStringFormat.StringFormatFlags.DirectionVertical */;
                }
                break;
            case YSolidGauge.DisplayMode.DISPLAY180:
                h = h - minMaxHeight;
                let s0 = new YDataRendering.YSizeF(null, "");
                s0 = g.MeasureString(this.lastDrawParameters.value, this._font, 100000);
                outerRadius = (w / 2) - this.borderThickness;
                if (outerRadius > h - this._borderThickness)
                    outerRadius = h - this._borderThickness;
                if (outerRadius > w - this.borderThickness)
                    outerRadius = w - this.borderThickness;
                angleStart = 0;
                angleEnd = Math.PI;
                ycenter = outerRadius + this._borderThickness / 2;
                innerRadius = outerRadius * (100 - this._thickness) / 100;
                this.lastDrawParameters.heightTop = outerRadius;
                this.lastDrawParameters.heightBottom = 0;
                ValueRectangle = new YDataRendering.YRectangle((xcenter - innerRadius) >> 0, (ycenter + this._borderThickness + minMaxHeight - s0.height) >> 0, (2 * innerRadius) >> 0, (s0.height + 1) >> 0);
                valueFormat.Alignment = 1 /* YDataRendering.YStringFormat.StringAlignment.Center */;
                valueFormat.LineAlignment = 2 /* YDataRendering.YStringFormat.StringAlignment.Far */;
                if (this._showMinMax) {
                    this.lastDrawParameters.minValueRectangle = new YDataRendering.YRectangle((xcenter - ((outerRadius + innerRadius + s1.width) / 2)) >> 0, (ycenter + this._borderThickness) >> 0, (s1.width + 1) >> 0, (minMaxHeight + 1) >> 0);
                    this.lastDrawParameters.minValueFormat.Alignment = 0 /* YDataRendering.YStringFormat.StringAlignment.Near */;
                    this.lastDrawParameters.minValueFormat.LineAlignment = 0 /* YDataRendering.YStringFormat.StringAlignment.Near */;
                    this.lastDrawParameters.maxValueRectangle = new YDataRendering.YRectangle((xcenter + ((outerRadius + innerRadius - s2.width) / 2)) >> 0, (ycenter + this._borderThickness) >> 0, (s2.width + 1) >> 0, (minMaxHeight + 1) >> 0);
                    this.lastDrawParameters.maxValueFormat.Alignment = 0 /* YDataRendering.YStringFormat.StringAlignment.Near */;
                    this.lastDrawParameters.maxValueFormat.LineAlignment = 0 /* YDataRendering.YStringFormat.StringAlignment.Near */;
                }
                break;
            case YSolidGauge.DisplayMode.DISPLAY270:
                outerRadius = w;
                if (outerRadius > h / 2)
                    outerRadius = h / 2;
                if (outerRadius > w / 2)
                    outerRadius = w / 2;
                this.lastDrawParameters.heightTop = outerRadius;
                this.lastDrawParameters.heightBottom = outerRadius;
                angleStart = 0;
                angleEnd = 3 * Math.PI / 2;
                ycenter = mainViewPort.Tmargin + UIh / 2;
                innerRadius = outerRadius * (100 - this._thickness) / 100;
                ValueRectangle = new YDataRendering.YRectangle((xcenter - innerRadius) >> 0, (ycenter - innerRadius) >> 0, (2 * innerRadius) >> 0, (2 * innerRadius) >> 0);
                valueFormat.Alignment = 1 /* YDataRendering.YStringFormat.StringAlignment.Center */;
                valueFormat.LineAlignment = 1 /* YDataRendering.YStringFormat.StringAlignment.Center */;
                if (this._showMinMax) {
                    this.lastDrawParameters.minValueRectangle = new YDataRendering.YRectangle((xcenter + this._borderThickness) >> 0, (ycenter + (innerRadius + innerRadius + s1.height) / 2) >> 0, (s1.width + 1) >> 0, (s1.height + 1) >> 0);
                    this.lastDrawParameters.minValueFormat.Alignment = 0 /* YDataRendering.YStringFormat.StringAlignment.Near */;
                    this.lastDrawParameters.minValueFormat.LineAlignment = 0 /* YDataRendering.YStringFormat.StringAlignment.Near */;
                    this.lastDrawParameters.maxValueRectangle = new YDataRendering.YRectangle((xcenter + (innerRadius + innerRadius + s1.height) / 2) >> 0, (ycenter + this._borderThickness) >> 0, (s2.height + 1) >> 0, (s2.width + 1) >> 0);
                    this.lastDrawParameters.maxValueFormat.Alignment = 0 /* YDataRendering.YStringFormat.StringAlignment.Near */;
                    this.lastDrawParameters.maxValueFormat.LineAlignment = 0 /* YDataRendering.YStringFormat.StringAlignment.Near */;
                    this.lastDrawParameters.maxValueFormat.FormatFlags = 2 /* YDataRendering.YStringFormat.StringFormatFlags.DirectionVertical */;
                }
                break;
            case YSolidGauge.DisplayMode.DISPLAY360:
                outerRadius = w;
                if (outerRadius > (h / .85) / 2)
                    outerRadius = (h / .85) / 2;
                if (outerRadius > w / 2)
                    outerRadius = w / 2;
                this.lastDrawParameters.heightTop = outerRadius;
                this.lastDrawParameters.heightBottom = outerRadius * 0.7;
                ycenter = mainViewPort.Tmargin + outerRadius + this._borderThickness / 2;
                angleStart = -Math.PI / 4;
                angleEnd = 5 * Math.PI / 4;
                innerRadius = outerRadius * (100 - this._thickness) / 100;
                ValueRectangle = new YDataRendering.YRectangle((xcenter - innerRadius) >> 0, (ycenter - innerRadius) >> 0, (2 * innerRadius) >> 0, (2 * innerRadius) >> 0);
                valueFormat.Alignment = 1 /* YDataRendering.YStringFormat.StringAlignment.Center */;
                valueFormat.LineAlignment = 1 /* YDataRendering.YStringFormat.StringAlignment.Center */;
                if (this._showMinMax) {
                    let dx = Math.abs(innerRadius * Math.cos(angleStart));
                    let dy = innerRadius * Math.abs(Math.sin(angleStart)) + 2 * Math.abs((outerRadius - innerRadius) * Math.sin(angleStart) / 3);
                    this.lastDrawParameters.minValueRectangle = new YDataRendering.YRectangle((xcenter - dx) >> 0, (ycenter + dy - minMaxHeight / 2) >> 0, (s1.width + 1) >> 0, (minMaxHeight + 1) >> 0);
                    this.lastDrawParameters.minValueFormat.Alignment = 0 /* YDataRendering.YStringFormat.StringAlignment.Near */;
                    this.lastDrawParameters.minValueFormat.LineAlignment = 1 /* YDataRendering.YStringFormat.StringAlignment.Center */;
                    this.lastDrawParameters.maxValueRectangle = new YDataRendering.YRectangle((xcenter + dx - s2.width) >> 0, (ycenter + dy - minMaxHeight / 2) >> 0, (s2.width + 1) >> 0, (minMaxHeight + 1) >> 0);
                    this.lastDrawParameters.maxValueFormat.Alignment = 0 /* YDataRendering.YStringFormat.StringAlignment.Near */;
                    this.lastDrawParameters.maxValueFormat.LineAlignment = 1 /* YDataRendering.YStringFormat.StringAlignment.Center */;
                }
                break;
        }
        this.lastDrawParameters.outerRadius = outerRadius;
        this.lastDrawParameters.innerRadius = innerRadius;
        this.lastDrawParameters.angleStart = angleStart;
        this.lastDrawParameters.angleEnd = angleEnd;
        this.lastDrawParameters.ycenter = ycenter;
        this.lastDrawParameters.xcenter = xcenter;
        this.lastDrawParameters.valueRectangle = ValueRectangle;
        this.lastDrawParameters.valueFormat = valueFormat;
        return this.lastDrawParameters;
    }
    Render(g, w, h) {
        this.mainViewPort = new YDataRendering.ViewPortSettings();
        g.SmoothingMode = YDataRendering.YSmoothingMode.HighQuality;
        g.TextRenderingHint = YDataRendering.YTextRenderingHint.AntiAlias;
        this.drawAnnotationPanels(g, this._annotationPanels, w, h, false, this.mainViewPort);
        let p = this.ComputeDrawParameters(g, w, h, this.mainViewPort);
        if (this._path == null) {
            let outterlength = (2 * p.outerRadius * Math.PI) * (p.angleEnd - p.angleStart) / (2 * Math.PI);
            let stepCount = (outterlength / this.SegmentMaxLength) >> 0;
            let stepsize = (p.angleEnd - p.angleStart) / stepCount;
            this._path = new Array(2 * (stepCount + 1));
            let n = 0;
            for (let i = 0; i <= stepCount; i++) {
                let a = p.angleStart + i * stepsize;
                this._path[n++] = new YDataRendering.PointF((p.xcenter + p.outerRadius * Math.cos(a)), (p.ycenter - p.outerRadius * Math.sin(a)));
            }
            for (let i = stepCount; i >= 0; i--) {
                let a = p.angleStart + i * stepsize;
                this._path[n++] = new YDataRendering.PointF((p.xcenter + p.innerRadius * Math.cos(a)), (p.ycenter - p.innerRadius * Math.sin(a)));
            }
        }
        if (this._bgBrush == null) {
            this._bgBrush = new YDataRendering.YLinearGradientBrush(this._backgroundColor1, this._backgroundColor2);
        }
        if (this._borderpen == null) {
            this._borderpen = new YDataRendering.YPen(this._borderColor, this._borderThickness);
            this._borderpen.linejoin = YDataRendering.YPen.LineJoin.Round;
        }
        g.FillPolygon(this._bgBrush, this._path);
        if (this._shownValue != this._value) {
            let step = this._maxSpeed * (this._max - this._min) / 100;
            if (Math.abs(this._value - this._shownValue) < step) {
                this._shownValue = this._value;
            }
            else if (this._shownValue < this._value) {
                this._shownValue += step;
            }
            else {
                this._shownValue -= step;
            }
        }
        let v = this._shownValue;
        if (v >= this._min) {
            if (v > this._max)
                v = this._max;
            let valueFactor = (v - this._min) / (this._max - this.min);
            let angleValue = p.angleStart + (p.angleEnd - p.angleStart) * valueFactor;
            let outterlength = (2 * p.outerRadius * Math.PI) * (angleValue - p.angleStart) / (2 * Math.PI);
            let stepCount = (outterlength / this.SegmentMaxLength) >> 0;
            let stepsize = (angleValue - p.angleStart) / stepCount;
            let pt = new Array(2 * (stepCount + 1));
            let n = 0;
            for (let i = 0; i <= stepCount; i++) {
                let a = p.angleEnd - i * stepsize;
                pt[n++] = new YDataRendering.PointF((p.xcenter + p.outerRadius * Math.cos(a)), (p.ycenter - p.outerRadius * Math.sin(a)));
            }
            for (let i = stepCount; i >= 0; i--) {
                let a = p.angleEnd - i * stepsize;
                pt[n++] = new YDataRendering.PointF((p.xcenter + p.innerRadius * Math.cos(a)), (p.ycenter - p.innerRadius * Math.sin(a)));
            }
            let b;
            if (this._color1 == this._color2) {
                b = new YDataRendering.YSolidBrush(this._color1);
            }
            else {
                let A1 = this._color1.alpha;
                let H1 = this._color1.hue;
                let S1 = this._color1.saturation;
                let L1 = this._color1.luminosity;
                let A2 = this._color2.alpha;
                let H2 = this._color2.hue;
                let S2 = this._color2.saturation;
                let L2 = this._color2.luminosity;
                let A = (Math.round(A1 + (A2 - A1) * valueFactor) >> 0) & 0xff;
                let H;
                if (Math.abs(H2 - H1) <= 127) {
                    H = (H1 + (H2 - H1) * valueFactor) >> 0;
                }
                else {
                    H = (H1 + 256 + (H2 - H1 + 256) * valueFactor) >> 0;
                    if (H > 256)
                        H -= 256;
                }
                let S = (S1 + (S2 - S1) * valueFactor) >> 0;
                let L = (L1 + (L2 - L1) * valueFactor) >> 0;
                //console.log(H+" "+S+" "+L) ;
                b = new YDataRendering.YSolidBrush(new YDataRendering.YColor(true, A, H, S, L));
            }
            g.FillPolygon(b, pt);
        }
        if (this._borderThickness > 0)
            g.DrawPolygon(this._borderpen, this._path);
        g.DrawStringRect(this.lastDrawParameters.value, this._font, this._font.brush, p.valueRectangle, p.valueFormat);
        if (this._showMinMax) {
            //YDataRendering.YPen pn = new YDataRendering.YPen(YDataRendering.YColor.Red);
            //g.DrawRectangle(pn,lastDrawParameters.minValueRectangle);
            //g.DrawRectangle(pn, lastDrawParameters.maxValueRectangle);
            g.DrawStringRect(this.lastDrawParameters.minValue, this._minMaxFont, this._minMaxFont.brush, this.lastDrawParameters.minValueRectangle, this.lastDrawParameters.minValueFormat);
            g.DrawStringRect(this.lastDrawParameters.maxValue, this._minMaxFont, this._minMaxFont.brush, this.lastDrawParameters.maxValueRectangle, this.lastDrawParameters.maxValueFormat);
        }
        this.drawAnnotationPanels(g, this._annotationPanels, w, h, true, this.mainViewPort);
        this.DrawMessagePanels(g, w, h);
        return 0;
    }
    renderingPostProcessing() {
        if (this._shownValue != this._value)
            this.redraw();
    }
}
(function (YSolidGauge) {
    // export enum DisplayMode {DISPLAY90 = "90\u00B0", DISPLAY180 = "180\u00B0", DISPLAY270 = "270\u00B0", DISPLAY360 = "360\u00B0" };
    class DisplayModeEnumItem extends YDataRendering.YEnumItem {
        constructor(value, humanreadable, container) {
            super(value, humanreadable, DisplayMode);
        }
    }
    YSolidGauge.DisplayModeEnumItem = DisplayModeEnumItem;
    class DisplayMode extends YDataRendering.YEnum {
    }
    DisplayMode.DISPLAY90 = new DisplayModeEnumItem("DISPLAY90", "90\u00B0");
    DisplayMode.DISPLAY180 = new DisplayModeEnumItem("DISPLAY180", "180\u00B0");
    DisplayMode.DISPLAY270 = new DisplayModeEnumItem("DISPLAY270", "270\u00B0");
    DisplayMode.DISPLAY360 = new DisplayModeEnumItem("DISPLAY360", "360\u00B0");
    YSolidGauge.DisplayMode = DisplayMode;
})(YSolidGauge || (YSolidGauge = {}));

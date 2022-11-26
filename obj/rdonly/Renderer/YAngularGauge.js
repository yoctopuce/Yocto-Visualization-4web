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
export class YAngularZone extends YDataRendering.Zone {
    get path() {
        return this._path;
    }
    setPathSize(count) {
        this._path = new Array(count).fill(null);
    }
    setPathPoint(index, p) {
        this._path[index] = p;
    }
    resetPath() {
        this._path = null;
    }
    resetCache() {
        this.resetPath();
    }
    get width() {
        return this._width;
    }
    set width(value) {
        if (value <= 0)
            throw new RangeError("Width must be a positive value");
        this._width = value;
        this._path = null;
        this._parentRenderer.redraw();
    }
    get outerRadius() {
        return this._outerRadius;
    }
    set outerRadius(value) {
        this._outerRadius = Math.max(0, Math.min(100, value));
        this._path = null;
        this._parentRenderer.redraw();
    }
    constructor(parentRenderer, directParent) {
        super(parentRenderer, directParent);
        this._path = null;
        this._width = 10;
        this._outerRadius = 98;
    }
}
export class YAngularGauge extends YDataRendering.YDataRenderer {
    get min() {
        return this._min;
    }
    set min(value) {
        if ((value >= this._max) && (!YDataRendering.YDataRenderer.minMaxCheckDisabled)) {
            throw new RangeError("Min cannot be greater than max (" + this._max.toString() + ")");
        }
        this._min = value;
        for (let i = 0; i < this._zones.length; i++) {
            this._zones[i].resetPath();
        }
        if (this._needleValue < this._min) {
            this._needleValue = this._min;
        }
        this.redraw();
    }
    get max() {
        return this._max;
    }
    set max(value) {
        if ((value <= this._min) && (!YDataRendering.YDataRenderer.minMaxCheckDisabled)) {
            throw new RangeError("Max cannot be less than min (" + this._min.toString() + ")");
        }
        this._max = value;
        for (let i = 0; i < this._zones.length; i++) {
            this._zones[i].resetPath();
        }
        if (this._needleValue > this._max) {
            this._needleValue = this._max;
        }
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
    get borderColor() {
        return this._borderColor;
    }
    set borderColor(value) {
        this._borderColor = value;
        this._borderpen = null;
        this.redraw();
    }
    get backgroundColor1() {
        return this._backgroundColor1;
    }
    set backgroundColor1(value) {
        this._backgroundColor1 = value;
        this._bgBrush = null;
        this.redraw();
    }
    get backgroundColor2() {
        return this._backgroundColor2;
    }
    set backgroundColor2(value) {
        this._backgroundColor2 = value;
        this._bgBrush = null;
        this.redraw();
    }
    get borderThickness() {
        return this._borderThickness;
    }
    set borderThickness(value) {
        if (value < 0)
            throw new RangeError("thickness must be a positive value");
        this._borderThickness = value;
        this._borderpen = null;
        this.redraw();
    }
    get valueFormater() {
        return this._valueFormater;
    }
    set valueFormater(value) {
        this._valueFormater = value;
        this.redraw();
    }
    get minmaxFormater() {
        return this._minmaxFormater;
    }
    set minmaxFormater(value) {
        this._minmaxFormater = value;
        this.redraw();
    }
    get thickness() {
        return this._thickness;
    }
    set thickness(value) {
        if (value < 0)
            throw new RangeError("Thickness must be a positive value");
        this._thickness = Math.max(Math.min(value, 80), 1);
        this.redraw();
    }
    get value() {
        return this._value;
    }
    set value(value) {
        this._value = value;
        this.redraw();
    }
    get color1() {
        return this._color1;
    }
    set color1(value) {
        this._color1 = value;
        this.redraw();
    }
    get color2() {
        return this._color2;
    }
    set color2(value) {
        this._color2 = value;
        this.redraw();
    }
    get graduationColor() {
        return this._graduationColor;
    }
    set graduationColor(value) {
        this._graduationColor = value;
        this._graduationPen = null;
        this.redraw();
    }
    get graduationThickness() {
        return this._graduationThickness;
    }
    set graduationThickness(value) {
        if (value < 0)
            throw new RangeError("Thickness must be a positive value");
        this._graduationThickness = value;
        this._graduationPen = null;
        this.redraw();
    }
    get graduationSize() {
        return this._graduationSize;
    }
    set graduationSize(value) {
        if (value <= 0)
            throw new RangeError("Graduation size must be a positive value");
        this._graduationSize = value;
        this.redraw();
    }
    get graduation() {
        return this._graduation;
    }
    set graduation(value) {
        this._graduation = value;
        this.redraw();
    }
    get unitFactor() {
        return this._unitFactor;
    }
    set unitFactor(value) {
        if (value == 0)
            throw new RangeError("Factor cannot be zero.");
        this._unitFactor = value;
        this.redraw();
    }
    get unit() {
        return this._unit;
    }
    set unit(value) {
        this._unit = value;
        this.redraw();
    }
    get unitFont() {
        return this._unitFont;
    }
    get subgraduationColor() {
        return this._subgraduationColor;
    }
    set subgraduationColor(value) {
        this._subgraduationColor = value;
        this._subgraduationPen = null;
        this.redraw();
    }
    get subgraduationThickness() {
        return this._subgraduationThickness;
    }
    set subgraduationThickness(value) {
        if (value < 0)
            throw new RangeError("Thickness must be a positive value");
        this._subgraduationThickness = value;
        this._subgraduationPen = null;
        this.redraw();
    }
    get subgraduationSize() {
        return this._subgraduationSize;
    }
    set subgraduationSize(value) {
        if (value <= 0)
            throw new RangeError("Size must be a positive value");
        this._subgraduationSize = value;
        this.redraw();
    }
    get graduationOuterRadiusSize() {
        return this._graduationOuterRadiusSize;
    }
    set graduationOuterRadiusSize(value) {
        this._graduationOuterRadiusSize = Math.max(0, Math.min(100, value));
        this.redraw();
    }
    get subgraduationCount() {
        return this._subgraduationCount;
    }
    set subgraduationCount(value) {
        if (value < 0)
            throw new RangeError("Count must be a positive value");
        this._subgraduationCount = value;
        this.redraw();
    }
    get statusColor() {
        return this._statusColor;
    }
    set statusColor(value) {
        this._statusColor = value;
        this.redraw();
    }
    get statusFont() {
        return this._unitFont;
    }
    get statusLine() {
        return this._statusLine;
    }
    set statusLine(value) {
        this._statusLine = value;
        this.redraw();
    }
    get showNeedle() {
        return this._showNeedle;
    }
    set showNeedle(value) {
        this._showNeedle = value;
        this.redraw();
    }
    get needleColor() {
        return this._needleColor;
    }
    set needleColor(value) {
        this._needleColor = value;
        this._needleBrush = null;
        this.redraw();
    }
    get needleMaxSpeed() {
        return this._needleMaxSpeed;
    }
    set needleMaxSpeed(value) {
        if (value <= 0)
            throw new RangeError("Speed must be a positive value");
        this._needleMaxSpeed = value;
        this.redraw();
    }
    get needleLength1() {
        return this._needleLength1;
    }
    set needleLength1(value) {
        this._needleLength1 = value;
        this.redraw();
    }
    get needleLength2() {
        return this._needleLength2;
    }
    set needleLength2(value) {
        this._needleLength2 = value;
        this.redraw();
    }
    get needleWidth() {
        return this._needleWidth;
    }
    set needleWidth(value) {
        if (value <= 0)
            throw new RangeError("Width must be a positive value");
        this._needleWidth = value;
        this.redraw();
    }
    get needleContourColor() {
        return this._needleContourColor;
    }
    set needleContourColor(value) {
        this._needleContourColor = value;
        this._needleContourPen = null;
        this.redraw();
    }
    get needleContourThickness() {
        return this._needleContourThickness;
    }
    set needleContourThickness(value) {
        if (value < 0)
            throw new RangeError("Thickness must be a positive value");
        this._needleContourThickness = value;
        this._needleContourPen = null;
        this.redraw();
    }
    get graduationFont() {
        return this._graduationFont;
    }
    get showMinMax() {
        return this._showMinMax;
    }
    set showMinMax(value) {
        this._showMinMax = value;
        this.redraw();
    }
    constructor(UIContainer, logFunction) {
        super(UIContainer, logFunction);
        this._min = 0;
        this._max = 100;
        this.SegmentMaxLength = 8;
        this._borderpen = null;
        this._borderColor = YDataRendering.YColor.Black;
        this._bgBrush = null;
        this._backgroundColor1 = YDataRendering.YColor.FromArgb(255, 240, 240, 240);
        this._backgroundColor2 = YDataRendering.YColor.FromArgb(255, 200, 200, 200);
        this._borderThickness = 5;
        this._valueFormater = null;
        this._minmaxFormater = null;
        this._thickness = 20;
        this._value = 0;
        this._needleValue = 0;
        this._color1 = YDataRendering.YColor.Green;
        this._color2 = YDataRendering.YColor.Red;
        this._graduationPen = null;
        this._graduationColor = YDataRendering.YColor.Black;
        this._graduationThickness = 2;
        this._graduationSize = 10;
        this._graduation = 10;
        this._unitFactor = 1;
        this._unit = "";
        this._subgraduationPen = null;
        this._subgraduationColor = YDataRendering.YColor.Black;
        this._subgraduationThickness = 1;
        this._subgraduationSize = 5;
        this._graduationOuterRadiusSize = 98;
        this._subgraduationCount = 5;
        this._statusColor = YDataRendering.YColor.Gray;
        this._statusLine = "";
        this._showNeedle = true;
        this._needleBrush = null;
        this._needleColor = YDataRendering.YColor.Red;
        this._needleMaxSpeed = 5;
        this._needleLength1 = 90;
        this._needleLength2 = 5;
        this._needleWidth = 5;
        this._needleContourPen = null;
        this._needleContourColor = YDataRendering.YColor.DarkRed;
        this._needleContourThickness = 1;
        this._showMinMax = true;
        this._path = null;
        this._graduationFont = new YDataRendering.YFont(this, this, Math.min(this.getContainerInnerWidth(), this.getContainerInnerHeight()) / 15, null);
        this._unitFont = new YDataRendering.YFont(this, this, Math.min(this.getContainerInnerWidth(), this.getContainerInnerHeight()) / 20, null);
        this._statusFont = new YDataRendering.YFont(this, this, Math.min(this.getContainerInnerWidth(), this.getContainerInnerHeight()) / 15, null);
        this.unitFont.color = YDataRendering.YColor.DarkGray;
        this._statusFont.color = YDataRendering.YColor.DarkGray;
        this.resizeRule = YDataRendering.Proportional.ResizeRule.RELATIVETOBOTH;
        this._zones = [];
    }
    clearCachedObjects() {
        if (this._zones != null) {
            for (let i = 0; i < this._zones.length; i++) {
                this._zones[i].resetPath();
            }
        }
        this._path = null;
        this._bgBrush = null;
    }
    get zones() {
        return this._zones;
    }
    AddZone() {
        let z = new YAngularZone(this, this);
        this._zones.push(z);
        return z;
    }
    Render(g, w, h) {
        let mainViewPort = new YDataRendering.ViewPortSettings();
        mainViewPort.Lmargin = 0;
        mainViewPort.Rmargin = 0;
        mainViewPort.Tmargin = 0;
        mainViewPort.Bmargin = 0;
        g.SmoothingMode = YDataRendering.YSmoothingMode.HighQuality;
        g.TextRenderingHint = YDataRendering.YTextRenderingHint.AntiAlias;
        let stringFormat4Sizing = new YDataRendering.YStringFormat(16384 /* YDataRendering.YStringFormat.StringFormatFlags.NoClip */);
        let stringFormat = new YDataRendering.YStringFormat(16384 /* YDataRendering.YStringFormat.StringFormatFlags.NoClip */);
        stringFormat.Alignment = 1 /* YDataRendering.YStringFormat.StringAlignment.Center */;
        stringFormat.LineAlignment = 1 /* YDataRendering.YStringFormat.StringAlignment.Center */;
        this.drawAnnotationPanels(g, this._annotationPanels, w, h, false, mainViewPort);
        g.TextRenderingHint = YDataRendering.YTextRenderingHint.AntiAlias;
        let xcenter = mainViewPort.Lmargin + (w - mainViewPort.Lmargin - mainViewPort.Rmargin) / 2;
        let ycenter = mainViewPort.Tmargin + (h - mainViewPort.Tmargin - mainViewPort.Bmargin) / 2;
        let radius = Math.min((w - mainViewPort.Lmargin - mainViewPort.Rmargin) / 2, (h - mainViewPort.Tmargin - mainViewPort.Bmargin) / 2) - this.borderThickness;
        let circonference = (2 * radius * 3.14) >> 0;
        let AngleAperture = 4 * 2 * Math.PI / 5;
        if (this._path == null) {
            let outterlength = (2 * radius * Math.PI);
            let stepCount = (outterlength / this.SegmentMaxLength) >> 0;
            let stepsize = (2 * Math.PI) / stepCount;
            this._path = new Array(stepCount).fill(null);
            let n = 0;
            for (let i = 0; i < stepCount; i++) {
                let a = (2 * i * Math.PI) / stepCount;
                this._path[n++] = new YDataRendering.PointF((xcenter + radius * Math.cos(a)), (ycenter - radius * Math.sin(a)));
            }
        }
        if (this._bgBrush == null)
            this._bgBrush = new YDataRendering.YLinearGradientBrush(this._backgroundColor1, this._backgroundColor2);
        if (this._borderpen == null) {
            this._borderpen = new YDataRendering.YPen(this._borderColor, this._borderThickness);
            this._borderpen.linejoin = YDataRendering.YPen.LineJoin.Round;
        }
        if (this._path.length > 3)
            g.FillPolygon(this._bgBrush, this._path);
        if (this._graduationPen == null)
            this._graduationPen = new YDataRendering.YPen(this._graduationColor, this._graduationThickness);
        if (this._subgraduationPen == null)
            this._subgraduationPen = new YDataRendering.YPen(this._subgraduationColor, this._subgraduationThickness);
        // draw unit
        let unitDesc = ((this._unitFactor != 1) ? "x" + this._unitFactor.toString() + " " : "") + this._unit;
        let size = g.MeasureStringSF(unitDesc.toString(), this._unitFont, 10000, stringFormat4Sizing);
        let unitPos = new YDataRendering.YRectangle((xcenter - size.width / 2) >> 0, (ycenter + radius / 2 - size.height / 2) >> 0, (size.width + 1) >> 0, (size.height + 1) >> 0);
        g.DrawStringRect(unitDesc, this._unitFont, this._unitFont.brush, unitPos, stringFormat);
        // draw status line
        if (this._statusLine != "") {
            size = g.MeasureStringSF(this._statusLine, this._statusFont, 10000, stringFormat4Sizing);
            let statusPos = new YDataRendering.YRectangle((xcenter - size.width / 2) >> 0, (ycenter - radius / 3 - size.height / 2) >> 0, (size.width + 1), (size.height + 1));
            g.DrawStringRect(this._statusLine, this._statusFont, this._statusFont.brush, statusPos, stringFormat);
        }
        let firstGraduation;
        let gratuationCount;
        let Angle, C, S, R1, R2;
        let outerCoef = this._graduationOuterRadiusSize / 100;
        // draw zones
        for (let i = 0; i < this._zones.length; i++) {
            if (this._zones[i].visible) {
                if (this._zones[i].path == null) {
                    let zmin = Math.max(this._min, Math.min(this._max, this._zones[i].min));
                    let zmax = Math.max(this._min, Math.min(this._max, this._zones[i].max));
                    if (zmax > zmin) {
                        let zOuterCoef = this._zones[i].outerRadius / 100;
                        let Angle1 = ((Math.PI - AngleAperture) / 2) + AngleAperture * (zmin - this._min) / (this._max - this._min);
                        let Angle2 = ((Math.PI - AngleAperture) / 2) + AngleAperture * (zmax - this._min) / (this._max - this._min);
                        let outterlength = (Angle2 - Angle1) * radius;
                        let stepCount = (outterlength / this.SegmentMaxLength) >> 0;
                        if (stepCount < 2)
                            stepCount = 2;
                        this._zones[i].setPathSize(2 * stepCount + 2);
                        // let Path: YDataRendering.PointF[] = new Array(2 * stepCount + 2).fill(null);
                        for (let j = 0; j <= stepCount; j++) {
                            let A = Angle1 + ((Angle2 - Angle1) * j) / stepCount;
                            this._zones[i].setPathPoint(j, new YDataRendering.PointF((xcenter - radius * zOuterCoef * Math.cos(A)), (ycenter - radius * zOuterCoef * Math.sin(A))));
                        }
                        let innerRadiusCoef = zOuterCoef - (this._zones[i].width / 100);
                        for (let j = stepCount; j >= 0; j--) {
                            let A = Angle1 + ((Angle2 - Angle1) * j) / stepCount;
                            this._zones[i].setPathPoint(2 * stepCount + 1 - j, new YDataRendering.PointF((xcenter - radius * innerRadiusCoef * Math.cos(A)), (ycenter - radius * innerRadiusCoef * Math.sin(A))));
                        }
                    }
                }
                if (this._zones[i].path != null)
                    g.FillPolygon(this._zones[i].zoneBrush, this._zones[i].path);
            }
        }
        firstGraduation = this._graduation * (this._min / this._graduation) >> 0;
        if (this._min < 0)
            firstGraduation -= this._graduation;
        while (firstGraduation < this._min) {
            firstGraduation += this._graduation;
        }
        gratuationCount = 1 + ((this._max - this._min) / this._graduation) >> 0;
        // draw sub graduations
        if ((this._subgraduationCount > 0) && ((this._subgraduationCount * gratuationCount) < circonference)) {
            let subgraduation = this._graduation / this._subgraduationCount;
            firstGraduation = subgraduation * ((this._min / subgraduation) >> 0);
            if (this._min < 0)
                firstGraduation -= subgraduation;
            while (firstGraduation < this._min) {
                firstGraduation += subgraduation;
            }
            gratuationCount = 1 + ((this._max - this._min) / subgraduation) >> 0;
            for (let i = 0; i < gratuationCount; i++) {
                let value = firstGraduation + i * subgraduation;
                if (value <= this._max) {
                    Angle = ((Math.PI - AngleAperture) / 2) + AngleAperture * (value - this._min) / (this._max - this._min);
                    C = Math.cos(Angle);
                    S = Math.sin(Angle);
                    R1 = (outerCoef * (radius - this._borderThickness / 2));
                    R2 = (100 - this._subgraduationSize) * (outerCoef * (radius - this._borderThickness / 2)) / 100;
                    g.DrawLineXY(this._subgraduationPen, (xcenter - R1 * C), (ycenter - R1 * S), (xcenter - R2 * C), (ycenter - R2 * S));
                }
            }
        }
        // draw Main graduations
        if (gratuationCount < circonference) // stop drawing graduation if too many
         {
            for (let i = 0; i < gratuationCount; i++) {
                let gvalue = firstGraduation + i * this._graduation;
                if (gvalue <= this._max) {
                    Angle = ((Math.PI - AngleAperture) / 2) + AngleAperture * (gvalue - this._min) / (this._max - this._min);
                    C = Math.cos(Angle);
                    S = Math.sin(Angle);
                    R1 = (outerCoef * (radius - this._borderThickness / 2));
                    R2 = (100 - this._graduationSize) * (outerCoef * (radius - this._borderThickness / 2)) / 100;
                    g.DrawLineXY(this._graduationPen, (xcenter - R1 * C), (ycenter - R1 * S), (xcenter - R2 * C), (ycenter - R2 * S));
                    size = g.MeasureStringSF(gvalue.toString().trim(), this._graduationFont, 1000, stringFormat4Sizing);
                    let HalfDiagonal = 0.4 * Math.sqrt(size.width * size.width + size.height * size.height);
                    let position = new YDataRendering.YRectangle((xcenter - (R2 - HalfDiagonal) * C - (size.width / 2)) >> 0, (ycenter - (R2 - HalfDiagonal) * S - (size.height / 2)) >> 0, (size.width >> 0) + 1, size.height >> 0);
                    //  g.DrawRectangle(new YDataRendering.YPen(Color.Red, 1), position);
                    g.DrawStringRect(gvalue.toString(), this._graduationFont, this._graduationFont.brush, position, stringFormat);
                }
            }
        }
        // draw Border
        if ((this._borderThickness > 0) && (this._path.length > 3))
            g.DrawPolygon(this._borderpen, this._path);
        this.drawAnnotationPanels(g, this._annotationPanels, w, h, true, mainViewPort);
        // draw Needle
        if (this._showNeedle) {
            if (this._needleValue != this._value) {
                let step = this._unitFactor * this._needleMaxSpeed * (this._max - this._min) / 100;
                if (Math.abs(this._value - this._needleValue) < step) {
                    this._needleValue = this._value;
                }
                else if (this._needleValue < this.value) {
                    this._needleValue += step;
                }
                else {
                    this._needleValue -= step;
                }
            }
            let needlevalue = this._needleValue / this._unitFactor;
            let allowedOverflow = (this._max - this.min) * 0.05;
            if (needlevalue < this._min - allowedOverflow)
                needlevalue = this._min - allowedOverflow;
            if (needlevalue > this._max + allowedOverflow)
                needlevalue = this._max + allowedOverflow;
            Angle = ((Math.PI - AngleAperture) / 2) + AngleAperture * (needlevalue - this._min) / (this._max - this._min);
            C = Math.cos(Angle);
            S = Math.sin(Angle);
            R1 = (radius * this._needleLength1) / 100;
            R2 = (radius * this._needleLength2) / 100;
            let R3 = (radius * this._needleWidth) / 200;
            let needlepath = new Array(4).fill(null);
            needlepath[0] = new YDataRendering.PointF((xcenter - R1 * C), (ycenter - R1 * S));
            needlepath[1] = new YDataRendering.PointF((xcenter + R3 * S), (ycenter - R3 * C));
            needlepath[2] = new YDataRendering.PointF((xcenter + R2 * C), (ycenter + R2 * S));
            needlepath[3] = new YDataRendering.PointF((xcenter - R3 * S), (ycenter + R3 * C));
            if (this._needleBrush == null)
                this._needleBrush = new YDataRendering.YSolidBrush(this._needleColor);
            g.FillPolygon(this._needleBrush, needlepath);
            if (this._needleContourThickness > 0) {
                if (this._needleContourPen == null) {
                    this._needleContourPen = new YDataRendering.YPen(this._needleContourColor, this._needleContourThickness);
                    this._needleContourPen.startCap = 2 /* YDataRendering.YPen.LineCap.Round */;
                    this._needleContourPen.endCap = 2 /* YDataRendering.YPen.LineCap.Round */;
                    this._needleContourPen.linejoin = YDataRendering.YPen.LineJoin.Round;
                }
                let needlepath2 = new Array(5).fill(null);
                needlepath2[0] = needlepath[0];
                needlepath2[1] = needlepath[1];
                needlepath2[2] = needlepath[2];
                needlepath2[3] = needlepath[3];
                needlepath2[4] = needlepath[0];
                g.DrawLines(this._needleContourPen, needlepath2);
            }
        }
        this.DrawMessagePanels(g, w, h);
        return 0;
    }
    renderingPostProcessing() {
        if (this._needleValue != this._value)
            this.redraw();
    }
}

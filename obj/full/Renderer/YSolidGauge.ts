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

class DrawPrameters
{
    public outerRadius: number = 0;
    public innerRadius: number = 0;
    public angleStart: number = 0;
    public angleEnd: number = 0;
    public ycenter: number = 0;
    public xcenter: number = 0;
    public heightTop: number = 0;
    public heightBottom: number = 0;
    public valueRectangle: YDataRendering.YRectangle = new YDataRendering.YRectangle(0, 0, 0, 0)
    public valueFormat: YDataRendering.YStringFormat = new YDataRendering.YStringFormat(YDataRendering.YStringFormat.StringFormatFlags.NoClip);
    public minValueRectangle: YDataRendering.YRectangle = new YDataRendering.YRectangle(0, 0, 0, 0)
    public minValueFormat: YDataRendering.YStringFormat = new YDataRendering.YStringFormat(YDataRendering.YStringFormat.StringFormatFlags.NoClip);
    public maxValueRectangle: YDataRendering.YRectangle = new YDataRendering.YRectangle(0, 0, 0, 0)
    public maxValueFormat: YDataRendering.YStringFormat = new YDataRendering.YStringFormat(YDataRendering.YStringFormat.StringFormatFlags.NoClip);
    public minValue: string = "";
    public maxValue: string = "";
    public value: string = "";
}

export class YSolidGauge extends YDataRendering.YDataRenderer
{
    private _shownValue: number = 0;

    protected _min: number = 0;
    get min(): number { return this._min; }
    set min(value: number)
    {
        if ((value >= this._max) && (!YDataRendering.YDataRenderer.minMaxCheckDisabled))
        {
            throw new RangeError("Min cannot be greater than max (" + this._max.toString() + ")");
        }
        this._min = value;
        if (this._shownValue < this._min) this._shownValue = this._min;
        this.redraw();
    }

    protected _max: number = 100;
    get max(): number { return this._max; }
    set max(value: number)
    {
        if ((value <= this._min) && (!YDataRendering.YDataRenderer.minMaxCheckDisabled))
        {
            throw new RangeError("Max cannot be less than min (" + this._min.toString() + ")");
        }
        this._max = value;
        if (this._shownValue > this._max) this._shownValue = this._max;
        this.redraw();
    }

    private readonly SegmentMaxLength: number = 8;
    private mainViewPort: YDataRendering.ViewPortSettings = new YDataRendering.ViewPortSettings();
    private _borderpen: YDataRendering.YPen | null = null;
    public get borderpen(): YDataRendering.YPen
    {
        if (this._borderpen == null)
        {
            this._borderpen = new YDataRendering.YPen(this._borderColor, this._borderThickness);
            this._borderpen.startCap = YDataRendering.YPen.LineCap.Square;
            this._borderpen.endCap = YDataRendering.YPen.LineCap.Square;

        }
        return this._borderpen;
    }

    private _borderColor: YDataRendering.YColor = YDataRendering.YColor.Black;
    public get borderColor(): YDataRendering.YColor {return this._borderColor;}
    public set borderColor(value: YDataRendering.YColor)
    {
        this._borderColor = value;
        this._borderpen = null;
        this.redraw();
    }

    private _bgBrush: YDataRendering.YBrush | null = null;

    private _backgroundColor1: YDataRendering.YColor = YDataRendering.YColor.FromArgb(255, 240, 240, 240);
    public get backgroundColor1(): YDataRendering.YColor {return this._backgroundColor1; }
    public set backgroundColor1(value: YDataRendering.YColor)
    {
        this._backgroundColor1 = value;
        this._bgBrush = null;
        this.redraw();
    }

    private _backgroundColor2: YDataRendering.YColor = YDataRendering.YColor.FromArgb(255, 200, 200, 200);
    public get backgroundColor2(): YDataRendering.YColor {return this._backgroundColor2; }
    public set backgroundColor2(value: YDataRendering.YColor)
    {
        this._backgroundColor2 = value;
        this._bgBrush = null;
        this.redraw();
    }

    private _borderThickness: number = 5;
    public get borderThickness(): number { return this._borderThickness; }
    public set borderThickness(value: number)
    {
        if (value < 0) throw new RangeError("Thickness must be a positive value");
        this._borderThickness = value;
        this._borderpen = null;
        this._path = null;
        this.redraw();
    }

    private _valueFormater: YDataRendering.ValueFormater | null = null;
    public get valueFormater(): YDataRendering.ValueFormater | null { return this._valueFormater;}
    public set valueFormater(value: YDataRendering.ValueFormater | null)
    {
        this._valueFormater = value;
        this.redraw();
    }

    private _minmaxFormater: YDataRendering.ValueFormater | null = null;
    public get minmaxFormater(): YDataRendering.ValueFormater | null { return this._minmaxFormater;}
    public set minmaxFormater(value: YDataRendering.ValueFormater | null)
    {
        this._minmaxFormater = value;
        this.redraw();
    }

    private _thickness: number = 25;
    public get thickness(): number { return this._thickness;}
    public set thickness(value: number)
    {
        if (value < 0) throw new RangeError("Thickness must be a positive value");
        this._thickness = Math.max(Math.min(value, 80), 1);
        this._path = null;
        this.redraw();
    }

    private _maxSpeed: number = 0.1;
    public get maxSpeed(): number { return this._maxSpeed; }
    public set maxSpeed(value: number)
    {
        if (value <= 0) throw new RangeError("Speed must be a positive value");
        this._maxSpeed = value;
    }

    private _value: number = 0;
    public get value(): number { return this._value; }
    public set value(value: number)
    {
        this._value = value;
        this.redraw();
    }

    private _color1: YDataRendering.YColor = YDataRendering.YColor.Green;
    public get color1(): YDataRendering.YColor { return this._color1; }
    public set color1(value: YDataRendering.YColor)
    {
        this._color1 = value;
        this.redraw();
    }

    private _color2: YDataRendering.YColor = YDataRendering.YColor.Red;
    public get color2(): YDataRendering.YColor { return this._color2; }
    public set color2(value: YDataRendering.YColor)
    {
        this._color2 = value;
        this.redraw();
    }

    private _font: YDataRendering.YFont | null = null;
    public get font(): YDataRendering.YFont | null { return this._font;}

    private _minMaxFont: YDataRendering.YFont | null = null;
    public get minMaxFont(): YDataRendering.YFont | null { return this._minMaxFont;}

    private _showMinMax: boolean = true;
    public get showMinMax() {return this._showMinMax;}
    public set showMinMax(value)
    {
        this._showMinMax = value;
        this._path = null;
        this.redraw();
    }

    private _path: YDataRendering.PointF[] | null = null;

    private lastDrawParameters: DrawPrameters = new DrawPrameters();

    private _displayMode: YSolidGauge.DisplayModeEnumItem = YSolidGauge.DisplayMode.DISPLAY90;
    public get displayMode(): YSolidGauge.DisplayModeEnumItem { return this._displayMode;}
    public set displayMode(value: YSolidGauge.DisplayModeEnumItem)
    {
        this._displayMode = value;
        this._path = null;
        this._bgBrush = null;
        this.redraw();
    }

    public FontsizeChange(source: YDataRendering.YFont): void
    { this._path = null;}

    constructor(UIContainer: HTMLCanvasElement, mode: YSolidGauge.DisplayModeEnumItem, logFunction: YDataRendering.logFct)
    {
        super(UIContainer, logFunction);
        this._minMaxFont = new YDataRendering.YFont(this, this, Math.min(UIContainer.width, UIContainer.height) / 15, () => {this.FontsizeChange(<YDataRendering.YFont>this._minMaxFont);});
        this._displayMode = mode;
        this._font = new YDataRendering.YFont(this, this, Math.min(UIContainer.width, UIContainer.height) / 5, null);
        this.resizeRule = YDataRendering.Proportional.ResizeRule.RELATIVETOBOTH;
        let g: YDataRendering.YGraphics = new YDataRendering.YGraphics(UIContainer, UIContainer.width, UIContainer.height, 90);
        let p: DrawPrameters = this.ComputeDrawParameters(g, UIContainer.width, UIContainer.height, this.mainViewPort);
        g.Dispose();

    }

    public clearCachedObjects(): void
    {
        this._bgBrush = null;
        this._path = null;
    }

    private ComputeDrawParameters(g: YDataRendering.YGraphics, UIw: number, UIh: number, mainViewPort: YDataRendering.ViewPortSettings): DrawPrameters
    {
        UIw -= mainViewPort.Lmargin + mainViewPort.Rmargin;
        UIh -= mainViewPort.Tmargin + mainViewPort.Bmargin;

        let w: number = UIw - 5 - this._borderThickness;
        let h: number = UIh - 5 - this._borderThickness;

        let xcenter = UIw / 2;
        let outerRadius: number = 0;
        let angleStart: number = 0;
        let angleEnd: number = 0;
        let ycenter: number = 0;
        let ValueRectangle: YDataRendering.YRectangle = new YDataRendering.YRectangle(0, 0, 0, 0);

        let valueFormat: YDataRendering.YStringFormat = new YDataRendering.YStringFormat(YDataRendering.YStringFormat.StringFormatFlags.NoClip);
        let innerRadius: number = 0;
        let minMaxHeight: number = 0;
        let s1: YDataRendering.YSizeF = new YDataRendering.YSizeF(null, "");
        let s2: YDataRendering.YSizeF = new YDataRendering.YSizeF(null, "");

        this.lastDrawParameters.value = this._valueFormater == null ? this._value.toFixed(0) : this._valueFormater(this, this._value);

        if (this._showMinMax)
        {
            this.lastDrawParameters.minValue = this._minmaxFormater == null ? this._min.toFixed(0) : this._minmaxFormater(this, this._min);
            this.lastDrawParameters.maxValue = this._minmaxFormater == null ? this._max.toFixed(0) : this._minmaxFormater(this, this._max);
            s1 = g.MeasureString(this.lastDrawParameters.minValue, <YDataRendering.YFont>this._minMaxFont, 100000);
            s2 = g.MeasureString(this.lastDrawParameters.maxValue, <YDataRendering.YFont>this._minMaxFont, 100000);
            this.lastDrawParameters.minValueFormat = new YDataRendering.YStringFormat(YDataRendering.YStringFormat.StringFormatFlags.NoClip);
            this.lastDrawParameters.maxValueFormat = new YDataRendering.YStringFormat(YDataRendering.YStringFormat.StringFormatFlags.NoClip);
            minMaxHeight = s1.height;
            if (s2.height > minMaxHeight) minMaxHeight = s2.height;

        }

        switch (this._displayMode)
        {
        case YSolidGauge.DisplayMode.DISPLAY90:
            h = h - minMaxHeight;
            w = w - minMaxHeight;
            outerRadius = w;
            if (outerRadius > h - this._borderThickness) outerRadius = h - this.borderThickness;
            if (outerRadius > w - this.borderThickness) outerRadius = w - this.borderThickness;
            angleStart = Math.PI / 2;
            angleEnd = Math.PI;
            this.lastDrawParameters.heightTop = outerRadius;
            this.lastDrawParameters.heightBottom = 0;
            ycenter = mainViewPort.Tmargin + h;
            xcenter = mainViewPort.Lmargin + UIw / 2 + outerRadius / 2 - minMaxHeight + this._borderThickness;
            innerRadius = outerRadius * (100 - this._thickness) / 100;
            ValueRectangle = new YDataRendering.YRectangle((xcenter - innerRadius) >> 0, (ycenter - innerRadius) >> 0, innerRadius >> 0, innerRadius >> 0);
            valueFormat.Alignment = YDataRendering.YStringFormat.StringAlignment.Far;
            valueFormat.LineAlignment = YDataRendering.YStringFormat.StringAlignment.Far;
            if (this._showMinMax)
            {

                this.lastDrawParameters.minValueRectangle = new YDataRendering.YRectangle((xcenter - ((outerRadius + innerRadius + s1.width) / 2)) >> 0,
                    (ycenter + this._borderThickness) >> 0, (s1.width + 1) >> 0, (minMaxHeight + 1) >> 0);
                this.lastDrawParameters.minValueFormat.Alignment = YDataRendering.YStringFormat.StringAlignment.Near;
                this.lastDrawParameters.minValueFormat.LineAlignment = YDataRendering.YStringFormat.StringAlignment.Near;
                this.lastDrawParameters.maxValueRectangle = new YDataRendering.YRectangle((xcenter + this._borderThickness) >> 0,
                    (ycenter - outerRadius + (outerRadius - innerRadius - s2.width) / 2) >> 0, (minMaxHeight + 1) >> 0, (s2.width + 1) >> 0);
                this.lastDrawParameters.maxValueFormat.Alignment = YDataRendering.YStringFormat.StringAlignment.Near;
                this.lastDrawParameters.maxValueFormat.LineAlignment = YDataRendering.YStringFormat.StringAlignment.Near;
                this.lastDrawParameters.maxValueFormat.FormatFlags = YDataRendering.YStringFormat.StringFormatFlags.DirectionVertical;
            }
            break;
        case YSolidGauge.DisplayMode.DISPLAY180:
            h = h - minMaxHeight;
            let s0: YDataRendering.YSizeF = new YDataRendering.YSizeF(null, "");
            s0 = g.MeasureString(this.lastDrawParameters.value, <YDataRendering.YFont>this._font, 100000);
            outerRadius = (w / 2) - this.borderThickness;
            if (outerRadius > h - this._borderThickness) outerRadius = h - this._borderThickness;
            if (outerRadius > w - this.borderThickness) outerRadius = w - this.borderThickness;
            angleStart = 0;
            angleEnd = Math.PI;
            ycenter = outerRadius + this._borderThickness / 2;
            innerRadius = outerRadius * (100 - this._thickness) / 100;
            this.lastDrawParameters.heightTop = outerRadius;
            this.lastDrawParameters.heightBottom = 0;
            ValueRectangle = new YDataRendering.YRectangle((xcenter - innerRadius) >> 0, (ycenter + this._borderThickness + minMaxHeight - s0.height) >> 0,
                (2 * innerRadius) >> 0, (s0.height + 1) >> 0);
            valueFormat.Alignment = YDataRendering.YStringFormat.StringAlignment.Center;
            valueFormat.LineAlignment = YDataRendering.YStringFormat.StringAlignment.Far;
            if (this._showMinMax)
            {

                this.lastDrawParameters.minValueRectangle = new YDataRendering.YRectangle((xcenter - ((outerRadius + innerRadius + s1.width) / 2)) >> 0,
                    (ycenter + this._borderThickness) >> 0, (s1.width + 1) >> 0, (minMaxHeight + 1) >> 0);
                this.lastDrawParameters.minValueFormat.Alignment = YDataRendering.YStringFormat.StringAlignment.Near;
                this.lastDrawParameters.minValueFormat.LineAlignment = YDataRendering.YStringFormat.StringAlignment.Near;
                this.lastDrawParameters.maxValueRectangle = new YDataRendering.YRectangle((xcenter + ((outerRadius + innerRadius - s2.width) / 2)) >> 0,
                    (ycenter + this._borderThickness) >> 0, (s2.width + 1) >> 0, (minMaxHeight + 1) >> 0);
                this.lastDrawParameters.maxValueFormat.Alignment = YDataRendering.YStringFormat.StringAlignment.Near;
                this.lastDrawParameters.maxValueFormat.LineAlignment = YDataRendering.YStringFormat.StringAlignment.Near;
            }
            break;
        case YSolidGauge.DisplayMode.DISPLAY270:

            outerRadius = w;
            if (outerRadius > h / 2) outerRadius = h / 2;
            if (outerRadius > w / 2) outerRadius = w / 2;
            this.lastDrawParameters.heightTop = outerRadius;
            this.lastDrawParameters.heightBottom = outerRadius;
            angleStart = 0;
            angleEnd = 3 * Math.PI / 2;
            ycenter = mainViewPort.Tmargin + UIh / 2;
            innerRadius = outerRadius * (100 - this._thickness) / 100;
            ValueRectangle = new YDataRendering.YRectangle((xcenter - innerRadius) >> 0, (ycenter - innerRadius) >> 0,
                (2 * innerRadius) >> 0, (2 * innerRadius) >> 0);
            valueFormat.Alignment = YDataRendering.YStringFormat.StringAlignment.Center;
            valueFormat.LineAlignment = YDataRendering.YStringFormat.StringAlignment.Center;

            if (this._showMinMax)
            {

                this.lastDrawParameters.minValueRectangle = new YDataRendering.YRectangle((xcenter + this._borderThickness) >> 0, (ycenter + (innerRadius + innerRadius + s1.height) / 2) >> 0,
                    (s1.width + 1) >> 0, (s1.height + 1) >> 0);
                this.lastDrawParameters.minValueFormat.Alignment = YDataRendering.YStringFormat.StringAlignment.Near;
                this.lastDrawParameters.minValueFormat.LineAlignment = YDataRendering.YStringFormat.StringAlignment.Near;
                this.lastDrawParameters.maxValueRectangle = new YDataRendering.YRectangle((xcenter + (innerRadius + innerRadius + s1.height) / 2) >> 0,
                    (ycenter + this._borderThickness) >> 0, (s2.height + 1) >> 0, (s2.width + 1) >> 0);
                this.lastDrawParameters.maxValueFormat.Alignment = YDataRendering.YStringFormat.StringAlignment.Near;
                this.lastDrawParameters.maxValueFormat.LineAlignment = YDataRendering.YStringFormat.StringAlignment.Near;
                this.lastDrawParameters.maxValueFormat.FormatFlags = YDataRendering.YStringFormat.StringFormatFlags.DirectionVertical;
            }

            break;
        case YSolidGauge.DisplayMode.DISPLAY360:

            outerRadius = w;
            if (outerRadius > (h / .85) / 2) outerRadius = (h / .85) / 2;
            if (outerRadius > w / 2) outerRadius = w / 2;
            this.lastDrawParameters.heightTop = outerRadius;
            this.lastDrawParameters.heightBottom = outerRadius * 0.7;
            ycenter = mainViewPort.Tmargin + outerRadius + this._borderThickness / 2;
            angleStart = -Math.PI / 4;
            angleEnd = 5 * Math.PI / 4;
            innerRadius = outerRadius * (100 - this._thickness) / 100;
            ValueRectangle = new YDataRendering.YRectangle((xcenter - innerRadius) >> 0, (ycenter - innerRadius) >> 0,
                (2 * innerRadius) >> 0, (2 * innerRadius) >> 0);
            valueFormat.Alignment = YDataRendering.YStringFormat.StringAlignment.Center;
            valueFormat.LineAlignment = YDataRendering.YStringFormat.StringAlignment.Center;
            if (this._showMinMax)
            {
                let dx: number = Math.abs(innerRadius * Math.cos(angleStart));
                let dy: number = innerRadius * Math.abs(Math.sin(angleStart)) + 2 * Math.abs((outerRadius - innerRadius) * Math.sin(angleStart) / 3);
                this.lastDrawParameters.minValueRectangle = new YDataRendering.YRectangle((xcenter - dx) >> 0, (ycenter + dy - minMaxHeight / 2) >> 0,
                    (s1.width + 1) >> 0, (minMaxHeight + 1) >> 0);
                this.lastDrawParameters.minValueFormat.Alignment = YDataRendering.YStringFormat.StringAlignment.Near;
                this.lastDrawParameters.minValueFormat.LineAlignment = YDataRendering.YStringFormat.StringAlignment.Center;
                this.lastDrawParameters.maxValueRectangle = new YDataRendering.YRectangle((xcenter + dx - s2.width) >> 0, (ycenter + dy - minMaxHeight / 2) >> 0,
                    (s2.width + 1) >> 0, (minMaxHeight + 1) >> 0);
                this.lastDrawParameters.maxValueFormat.Alignment = YDataRendering.YStringFormat.StringAlignment.Near;
                this.lastDrawParameters.maxValueFormat.LineAlignment = YDataRendering.YStringFormat.StringAlignment.Center;
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

    protected Render(g: YDataRendering.YGraphics, w: number, h: number): number
    {
        this.mainViewPort = new YDataRendering.ViewPortSettings();
        g.SmoothingMode = YDataRendering.YSmoothingMode.HighQuality;
        g.TextRenderingHint = YDataRendering.YTextRenderingHint.AntiAlias;

        this.drawAnnotationPanels(g, this._annotationPanels, w, h, false, this.mainViewPort);
        let p: DrawPrameters = this.ComputeDrawParameters(g, w, h, this.mainViewPort);
        if (this._path == null)
        {
            let outterlength: number = (2 * p.outerRadius * Math.PI) * (p.angleEnd - p.angleStart) / (2 * Math.PI);
            let stepCount: number = (outterlength / this.SegmentMaxLength) >> 0;
            let stepsize: number = (p.angleEnd - p.angleStart) / stepCount;
            this._path = new Array(2 * (stepCount + 1));
            let n: number = 0;
            for (let i: number = 0; i <= stepCount; i++)
            {
                let a: number = p.angleStart + i * stepsize;
                this._path[n++] = new YDataRendering.PointF((p.xcenter + p.outerRadius * Math.cos(a)), (p.ycenter - p.outerRadius * Math.sin(a)));
            }
            for (let i: number = stepCount; i >= 0; i--)
            {
                let a: number = p.angleStart + i * stepsize;
                this._path[n++] = new YDataRendering.PointF((p.xcenter + p.innerRadius * Math.cos(a)), (p.ycenter - p.innerRadius * Math.sin(a)));
            }
        }

        if (this._bgBrush == null)
        {
            this._bgBrush = new YDataRendering.YLinearGradientBrush(this._backgroundColor1, this._backgroundColor2);
        }

        if (this._borderpen == null)
        {
            this._borderpen = new YDataRendering.YPen(this._borderColor, this._borderThickness);
            this._borderpen.linejoin = YDataRendering.YPen.LineJoin.Round;
        }

        g.FillPolygon(this._bgBrush, this._path);

        if (this._shownValue != this._value)
        {
            let step: number = this._maxSpeed * (this._max - this._min) / 100;
            if (Math.abs(this._value - this._shownValue) < step)
            {
                this._shownValue = this._value;
            }
            else if (this._shownValue < this._value)
            {
                this._shownValue += step;
            }
            else
            {
                this._shownValue -= step;
            }

        }

        let v: number = this._shownValue;
        if (v >= this._min)
        {
            if (v > this._max) v = this._max;
            let valueFactor: number = (v - this._min) / (this._max - this.min);
            let angleValue: number = p.angleStart + (p.angleEnd - p.angleStart) * valueFactor;
            let outterlength: number = (2 * p.outerRadius * Math.PI) * (angleValue - p.angleStart) / (2 * Math.PI);
            let stepCount: number = (outterlength / this.SegmentMaxLength) >> 0;
            let stepsize: number = (angleValue - p.angleStart) / stepCount;
            let pt: YDataRendering.PointF[] = new Array(2 * (stepCount + 1));
            let n: number = 0;
            for (let i: number = 0; i <= stepCount; i++)
            {
                let a: number = p.angleEnd - i * stepsize;
                pt[n++] = new YDataRendering.PointF((p.xcenter + p.outerRadius * Math.cos(a)), (p.ycenter - p.outerRadius * Math.sin(a)));
            }
            for (let i: number = stepCount; i >= 0; i--)
            {
                let a: number = p.angleEnd - i * stepsize;
                pt[n++] = new YDataRendering.PointF((p.xcenter + p.innerRadius * Math.cos(a)), (p.ycenter - p.innerRadius * Math.sin(a)));
            }
            let b: YDataRendering.YBrush;
            if (this._color1 == this._color2)
            {
                b = new YDataRendering.YSolidBrush(this._color1);
            }
            else
            {
                let A1: number = this._color1.alpha;
                let H1: number = this._color1.hue;
                let S1: number = this._color1.saturation;
                let L1: number = this._color1.luminosity;
                let A2: number = this._color2.alpha;
                let H2: number = this._color2.hue;
                let S2: number = this._color2.saturation;
                let L2: number = this._color2.luminosity;
                let A: number = (Math.round(A1 + (A2 - A1) * valueFactor) >> 0) & 0xff;

                let H: number;
                if (Math.abs(H2 - H1) <= 127)
                {
                    H = (H1 + (H2 - H1) * valueFactor) >> 0;
                }
                else
                {
                    H = (H1 + 256 + (H2 - H1 + 256) * valueFactor) >> 0;
                    if (H > 256) H -= 256;
                }

                let S: number = (S1 + (S2 - S1) * valueFactor) >> 0;
                let L: number = (L1 + (L2 - L1) * valueFactor) >> 0;

                //console.log(H+" "+S+" "+L) ;
                b = new YDataRendering.YSolidBrush(new YDataRendering.YColor(true, A, H, S, L));
            }
            g.FillPolygon(b, pt);
        }

        if (this._borderThickness > 0) g.DrawPolygon(this._borderpen, this._path);
        g.DrawStringRect(this.lastDrawParameters.value, <YDataRendering.YFont>this._font, (<YDataRendering.YFont>this._font).brush, p.valueRectangle, p.valueFormat);

        if (this._showMinMax)
        {
            //YDataRendering.YPen pn = new YDataRendering.YPen(YDataRendering.YColor.Red);
            //g.DrawRectangle(pn,lastDrawParameters.minValueRectangle);
            //g.DrawRectangle(pn, lastDrawParameters.maxValueRectangle);
            g.DrawStringRect(this.lastDrawParameters.minValue, <YDataRendering.YFont>this._minMaxFont, (<YDataRendering.YFont>this._minMaxFont).brush, this.lastDrawParameters.minValueRectangle, this.lastDrawParameters.minValueFormat);
            g.DrawStringRect(this.lastDrawParameters.maxValue, <YDataRendering.YFont>this._minMaxFont, (<YDataRendering.YFont>this._minMaxFont).brush, this.lastDrawParameters.maxValueRectangle, this.lastDrawParameters.maxValueFormat);

        }
        this.drawAnnotationPanels(g, this._annotationPanels, w, h, true, this.mainViewPort);
        this.DrawMessagePanels(g, w, h);
        return 0;
    }
    protected renderingPostProcessing(): void
    {
        if (this._shownValue != this._value) this.redraw();
    }
}

export namespace YSolidGauge
{

    // export enum DisplayMode {DISPLAY90 = "90\u00B0", DISPLAY180 = "180\u00B0", DISPLAY270 = "270\u00B0", DISPLAY360 = "360\u00B0" };

    export class DisplayModeEnumItem extends YDataRendering.YEnumItem
    {
        constructor(value: any, humanreadable: string, container?: object)
        {
            super(value, humanreadable, DisplayMode)

        }
    }

    export class DisplayMode extends YDataRendering.YEnum
    {
        public static readonly DISPLAY90: DisplayModeEnumItem = new DisplayModeEnumItem("DISPLAY90", "90\u00B0");
        public static readonly DISPLAY180: DisplayModeEnumItem = new DisplayModeEnumItem("DISPLAY180", "180\u00B0");
        public static readonly DISPLAY270: DisplayModeEnumItem = new DisplayModeEnumItem("DISPLAY270", "270\u00B0",);
        public static readonly DISPLAY360: DisplayModeEnumItem = new DisplayModeEnumItem("DISPLAY360", "360\u00B0");

    }
}
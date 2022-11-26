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

export class YAngularZone extends YDataRendering.Zone
{
    private _path: YDataRendering.PointF[] | null = null;
    public get path(): YDataRendering.PointF[] | null
    {
        return this._path;
    }

    public setPathSize(count: number): void
    {
        this._path = new Array(count).fill(null);
    }

    public setPathPoint(index: number, p: YDataRendering.PointF)
    {
        (<YDataRendering.PointF[]>this._path)[index] = p;
    }

    public resetPath(): void
    {
        this._path = null;
    }

    protected resetCache(): void
    {
        this.resetPath();
    }

    private _width: number = 10;
    public get width(): number
    {
        return this._width;
    }

    public set width(value: number)
    {
        if (value <= 0) throw new RangeError("Width must be a positive value");
        this._width = value;
        this._path = null;
        this._parentRenderer.redraw();
    }

    private _outerRadius: number = 98;
    public get outerRadius(): number
    {
        return this._outerRadius;
    }

    public set outerRadius(value: number)
    {
        this._outerRadius = Math.max(0, Math.min(100, value));
        this._path = null;
        this._parentRenderer.redraw();
    }

    constructor(parentRenderer: YDataRendering.YDataRenderer, directParent: object)
    {
        super(parentRenderer, directParent);
    }

}

export class YAngularGauge extends YDataRendering.YDataRenderer
{
    protected _min: number = 0;
    get min(): number
    {
        return this._min;
    }

    set min(value: number)
    {
        if ((value >= this._max) && (!YDataRendering.YDataRenderer.minMaxCheckDisabled))
        {
            throw new RangeError("Min cannot be greater than max (" + this._max.toString() + ")");
        }
        this._min = value;
        for (let i: number = 0; i < this._zones.length; i++)
        {
            this._zones[i].resetPath();
        }
        if (this._needleValue < this._min)
        {
            this._needleValue = this._min;
        }
        this.redraw();
    }

    protected _max: number = 100;
    get max(): number
    {
        return this._max;
    }

    set max(value: number)
    {
        if ((value <= this._min) && (!YDataRendering.YDataRenderer.minMaxCheckDisabled))
        {
            throw new RangeError("Max cannot be less than min (" + this._min.toString() + ")");
        }
        this._max = value;
        for (let i: number = 0; i < this._zones.length; i++)
        {
            this._zones[i].resetPath();
        }
        if (this._needleValue > this._max)
        {
            this._needleValue = this._max;
        }
        this.redraw();
    }

    private readonly SegmentMaxLength: number = 8;
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
    public get borderColor(): YDataRendering.YColor
    {
        return this._borderColor;
    }

    public set borderColor(value: YDataRendering.YColor)
    {
        this._borderColor = value;
        this._borderpen = null;
        this.redraw();
    }

    private _bgBrush: YDataRendering.YBrush | null = null;

    private _backgroundColor1: YDataRendering.YColor = YDataRendering.YColor.FromArgb(255, 240, 240, 240);
    public get backgroundColor1(): YDataRendering.YColor
    {
        return this._backgroundColor1;
    }

    public set backgroundColor1(value: YDataRendering.YColor)
    {
        this._backgroundColor1 = value;
        this._bgBrush = null;
        this.redraw();
    }

    private _backgroundColor2: YDataRendering.YColor = YDataRendering.YColor.FromArgb(255, 200, 200, 200);
    public get backgroundColor2(): YDataRendering.YColor
    {
        return this._backgroundColor2;
    }

    public set backgroundColor2(value: YDataRendering.YColor)
    {
        this._backgroundColor2 = value;
        this._bgBrush = null;
        this.redraw();
    }

    private _borderThickness: number = 5;
    private get borderThickness(): number
    {
        return this._borderThickness;
    }

    private set borderThickness(value: number)
    {
        if (value < 0) throw new RangeError("thickness must be a positive value");
        this._borderThickness = value;
        this._borderpen = null;
        this.redraw();
    }

    private _valueFormater: YDataRendering.ValueFormater | null = null;
    public get valueFormater(): YDataRendering.ValueFormater | null
    {
        return this._valueFormater;
    }

    public set valueFormater(value: YDataRendering.ValueFormater | null)
    {
        this._valueFormater = value;
        this.redraw();
    }

    private _minmaxFormater: YDataRendering.ValueFormater | null = null;
    public get minmaxFormater(): YDataRendering.ValueFormater | null
    {
        return this._minmaxFormater;
    }

    public set minmaxFormater(value: YDataRendering.ValueFormater | null)
    {
        this._minmaxFormater = value;
        this.redraw();
    }

    private _thickness: number = 20;
    public get thickness(): number
    {
        return this._thickness;
    }

    public set thickness(value: number)
    {
        if (value < 0) throw new RangeError("Thickness must be a positive value");
        this._thickness = Math.max(Math.min(value, 80), 1);
        this.redraw();
    }

    private _value: number = 0;
    public get value(): number
    {
        return this._value;
    }

    public set value(value: number)
    {
        this._value = value;
        this.redraw();
    }

    private _needleValue: number = 0;

    private _color1: YDataRendering.YColor = YDataRendering.YColor.Green;
    public get color1(): YDataRendering.YColor
    {
        return this._color1;
    }

    public set color1(value: YDataRendering.YColor)
    {
        this._color1 = value;
        this.redraw();
    }

    private _color2: YDataRendering.YColor = YDataRendering.YColor.Red;
    public get color2(): YDataRendering.YColor
    {
        return this._color2;
    }

    public set color2(value: YDataRendering.YColor)
    {
        this._color2 = value;
        this.redraw();
    }

    private _graduationPen: YDataRendering.YPen | null = null;

    private _graduationColor: YDataRendering.YColor = YDataRendering.YColor.Black;
    public get graduationColor(): YDataRendering.YColor
    {
        return this._graduationColor;
    }

    public set graduationColor(value: YDataRendering.YColor)
    {
        this._graduationColor = value;
        this._graduationPen = null;
        this.redraw();
    }

    private _graduationThickness: number = 2;
    public get graduationThickness(): number
    {
        return this._graduationThickness;
    }

    public set graduationThickness(value: number)
    {
        if (value < 0) throw new RangeError("Thickness must be a positive value");
        this._graduationThickness = value;
        this._graduationPen = null;
        this.redraw();
    }

    private _graduationSize: number = 10;
    public get graduationSize(): number
    {
        return this._graduationSize;
    }

    public set graduationSize(value: number)
    {
        if (value <= 0) throw new RangeError("Graduation size must be a positive value");
        this._graduationSize = value;
        this.redraw();
    }

    private _graduation: number = 10;
    public get graduation(): number
    {
        return this._graduation;
    }

    public set graduation(value: number)
    {
        this._graduation = value;
        this.redraw();
    }

    private _unitFactor: number = 1;
    public get unitFactor()
    {
        return this._unitFactor;
    }

    public set unitFactor(value)
    {
        if (value == 0) throw new RangeError("Factor cannot be zero.");
        this._unitFactor = value;
        this.redraw();
    }

    private _unit: string = "";
    public get unit()
    {
        return this._unit;
    }

    public set unit(value)
    {
        this._unit = value;
        this.redraw();
    }

    private _unitFont: YDataRendering.YFont;
    public get unitFont(): YDataRendering.YFont
    {
        return this._unitFont;
    }

    private _subgraduationPen: YDataRendering.YPen | null = null;

    private _subgraduationColor: YDataRendering.YColor = YDataRendering.YColor.Black;
    public get subgraduationColor(): YDataRendering.YColor
    {
        return this._subgraduationColor;
    }

    public set subgraduationColor(value: YDataRendering.YColor)
    {
        this._subgraduationColor = value;
        this._subgraduationPen = null;
        this.redraw();
    }

    private _subgraduationThickness: number = 1;
    public get subgraduationThickness()
    {
        return this._subgraduationThickness;
    }

    public set subgraduationThickness(value)
    {
        if (value < 0) throw new RangeError("Thickness must be a positive value");
        this._subgraduationThickness = value;
        this._subgraduationPen = null;
        this.redraw();
    }

    private _subgraduationSize: number = 5;
    public get subgraduationSize(): number
    {
        return this._subgraduationSize;
    }

    public set subgraduationSize(value: number)
    {
        if (value <= 0) throw new RangeError("Size must be a positive value");
        this._subgraduationSize = value;
        this.redraw();
    }

    private _graduationOuterRadiusSize: number = 98;
    public get graduationOuterRadiusSize(): number
    {
        return this._graduationOuterRadiusSize;
    }

    public set graduationOuterRadiusSize(value: number)
    {
        this._graduationOuterRadiusSize = Math.max(0, Math.min(100, value));
        this.redraw();
    }

    private _subgraduationCount: number = 5;
    public get subgraduationCount(): number
    {
        return this._subgraduationCount;
    }

    public set subgraduationCount(value: number)
    {
        if (value < 0) throw new RangeError("Count must be a positive value");
        this._subgraduationCount = value;
        this.redraw();
    }

    private _statusColor: YDataRendering.YColor = YDataRendering.YColor.Gray;
    public get statusColor(): YDataRendering.YColor
    {
        return this._statusColor;
    }

    public set statusColor(value: YDataRendering.YColor)
    {
        this._statusColor = value;
        this.redraw();
    }

    private _statusFont: YDataRendering.YFont;
    public get statusFont(): YDataRendering.YFont
    {
        return this._unitFont;
    }

    private _statusLine: string = "";
    public get statusLine(): string
    {
        return this._statusLine;
    }

    public set statusLine(value: string)
    {
        this._statusLine = value;
        this.redraw();
    }

    private _showNeedle: boolean = true;
    public get showNeedle(): boolean
    {
        return this._showNeedle;
    }

    public set showNeedle(value: boolean)
    {
        this._showNeedle = value;
        this.redraw();
    }

    private _needleBrush: YDataRendering.YBrush | null = null;

    private _needleColor: YDataRendering.YColor = YDataRendering.YColor.Red;
    public get needleColor(): YDataRendering.YColor
    {
        return this._needleColor;
    }

    public set needleColor(value: YDataRendering.YColor)
    {
        this._needleColor = value;
        this._needleBrush = null;
        this.redraw();
    }

    private _needleMaxSpeed: number = 5;
    public get needleMaxSpeed(): number
    {
        return this._needleMaxSpeed;
    }

    public set needleMaxSpeed(value: number)
    {
        if (value <= 0) throw new RangeError("Speed must be a positive value");
        this._needleMaxSpeed = value;
        this.redraw();
    }

    private _needleLength1: number = 90;
    public get needleLength1(): number
    {
        return this._needleLength1;
    }

    public set needleLength1(value: number)
    {
        this._needleLength1 = value;
        this.redraw();
    }

    private _needleLength2: number = 5;
    public get needleLength2(): number
    {
        return this._needleLength2;
    }

    public set needleLength2(value: number)
    {
        this._needleLength2 = value;
        this.redraw();
    }

    private _needleWidth: number = 5;
    public get needleWidth()
    {
        return this._needleWidth;
    }

    public set needleWidth(value)
    {
        if (value <= 0) throw new RangeError("Width must be a positive value");
        this._needleWidth = value;
        this.redraw();
    }

    private _needleContourPen: YDataRendering.YPen | null = null;

    private _needleContourColor: YDataRendering.YColor = YDataRendering.YColor.DarkRed;
    public get needleContourColor(): YDataRendering.YColor
    {
        return this._needleContourColor;
    }

    public set needleContourColor(value: YDataRendering.YColor)
    {
        this._needleContourColor = value;
        this._needleContourPen = null;
        this.redraw();
    }

    private _needleContourThickness: number = 1;
    public get needleContourThickness()
    {
        return this._needleContourThickness;
    }

    public set needleContourThickness(value)
    {
        if (value < 0) throw new RangeError("Thickness must be a positive value");
        this._needleContourThickness = value;
        this._needleContourPen = null;
        this.redraw();
    }

    _graduationFont: YDataRendering.YFont;
    public get graduationFont(): YDataRendering.YFont
    {
        return this._graduationFont;
    }

    private _showMinMax: boolean = true;
    public get showMinMax()
    {
        return this._showMinMax;
    }

    public set showMinMax(value)
    {
        this._showMinMax = value;
        this.redraw();
    }

    private _path: YDataRendering.PointF[] | null = null;

    constructor(UIContainer: HTMLCanvasElement, logFunction: YDataRendering.logFct)
    {
        super(UIContainer, logFunction);
        this._graduationFont = new YDataRendering.YFont(this, this, Math.min(this.getContainerInnerWidth(), this.getContainerInnerHeight()) / 15, null);
        this._unitFont = new YDataRendering.YFont(this, this, Math.min(this.getContainerInnerWidth(), this.getContainerInnerHeight()) / 20, null);
        this._statusFont = new YDataRendering.YFont(this, this, Math.min(this.getContainerInnerWidth(), this.getContainerInnerHeight()) / 15, null);
        this.unitFont.color = YDataRendering.YColor.DarkGray;
        this._statusFont.color = YDataRendering.YColor.DarkGray;
        this.resizeRule = YDataRendering.Proportional.ResizeRule.RELATIVETOBOTH;
        this._zones = [];
    }

    public clearCachedObjects(): void
    {
        if (this._zones != null)
        {
            for (let i: number = 0; i < this._zones.length; i++)
            {
                this._zones[i].resetPath();
            }
        }
        this._path = null;
        this._bgBrush = null;
    }

    private _zones: YAngularZone[];
    public get zones(): YAngularZone[]
    {
        return this._zones;
    }

    public AddZone(): YAngularZone
    {
        let z: YAngularZone = new YAngularZone(this, this);
        this._zones.push(z);
        return z;
    }

    protected Render(g: YDataRendering.YGraphics, w: number, h: number): number
    { //console.log("render("+w.toString()+"/"+h.toString()+")");
        let mainViewPort: YDataRendering.ViewPortSettings = new YDataRendering.ViewPortSettings()
        mainViewPort.Lmargin = 0;
        mainViewPort.Rmargin = 0;
        mainViewPort.Tmargin = 0;
        mainViewPort.Bmargin = 0;

        g.SmoothingMode = YDataRendering.YSmoothingMode.HighQuality;
        g.TextRenderingHint = YDataRendering.YTextRenderingHint.AntiAlias;

        let stringFormat4Sizing: YDataRendering.YStringFormat = new YDataRendering.YStringFormat(YDataRendering.YStringFormat.StringFormatFlags.NoClip);
        let stringFormat: YDataRendering.YStringFormat = new YDataRendering.YStringFormat(YDataRendering.YStringFormat.StringFormatFlags.NoClip);
        stringFormat.Alignment = YDataRendering.YStringFormat.StringAlignment.Center;
        stringFormat.LineAlignment = YDataRendering.YStringFormat.StringAlignment.Center;

        this.drawAnnotationPanels(g, this._annotationPanels, w, h, false, mainViewPort);
        g.TextRenderingHint = YDataRendering.YTextRenderingHint.AntiAlias;

        let xcenter: number = mainViewPort.Lmargin + (w - mainViewPort.Lmargin - mainViewPort.Rmargin) / 2;
        let ycenter: number = mainViewPort.Tmargin + (h - mainViewPort.Tmargin - mainViewPort.Bmargin) / 2;

        let radius: number = Math.min((w - mainViewPort.Lmargin - mainViewPort.Rmargin) / 2,
            (h - mainViewPort.Tmargin - mainViewPort.Bmargin) / 2) - this.borderThickness;

        let circonference: number = (2 * radius * 3.14) >> 0;
        let AngleAperture: number = 4 * 2 * Math.PI / 5;

        if (this._path == null)
        {
            let outterlength: number = (2 * radius * Math.PI);
            let stepCount: number = (outterlength / this.SegmentMaxLength) >> 0;
            let stepsize: number = (2 * Math.PI) / stepCount;

            this._path = new Array(stepCount).fill(null);
            let n: number = 0;
            for (let i: number = 0; i < stepCount; i++)
            {
                let a: number = (2 * i * Math.PI) / stepCount;
                this._path[n++] = new YDataRendering.PointF((xcenter + radius * Math.cos(a)), (ycenter - radius * Math.sin(a)));
            }
        }

        if (this._bgBrush == null) this._bgBrush = new YDataRendering.YLinearGradientBrush(this._backgroundColor1, this._backgroundColor2);

        if (this._borderpen == null)
        {
            this._borderpen = new YDataRendering.YPen(this._borderColor, this._borderThickness);
            this._borderpen.linejoin = YDataRendering.YPen.LineJoin.Round;
        }

        if (this._path.length > 3) g.FillPolygon(this._bgBrush, this._path);

        if (this._graduationPen == null) this._graduationPen = new YDataRendering.YPen(this._graduationColor, this._graduationThickness);
        if (this._subgraduationPen == null) this._subgraduationPen = new YDataRendering.YPen(this._subgraduationColor, this._subgraduationThickness);

        // draw unit
        let unitDesc: string = ((this._unitFactor != 1) ? "x" + this._unitFactor.toString() + " " : "") + this._unit;
        let size: YDataRendering.YSizeF = g.MeasureStringSF(unitDesc.toString(), this._unitFont, 10000, stringFormat4Sizing);
        let unitPos: YDataRendering.YRectangle = new YDataRendering.YRectangle((xcenter - size.width / 2) >> 0, (ycenter + radius / 2 - size.height / 2) >> 0,
            (size.width + 1) >> 0, (size.height + 1) >> 0);
        g.DrawStringRect(unitDesc, this._unitFont, this._unitFont.brush, unitPos, stringFormat);

        // draw status line
        if (this._statusLine != "")
        {
            size = g.MeasureStringSF(this._statusLine, this._statusFont, 10000, stringFormat4Sizing);
            let statusPos: YDataRendering.YRectangle = new YDataRendering.YRectangle((xcenter - size.width / 2) >> 0, (ycenter - radius / 3 - size.height / 2) >> 0,
                (size.width + 1), (size.height + 1));
            g.DrawStringRect(this._statusLine, this._statusFont, this._statusFont.brush, statusPos, stringFormat);
        }

        let firstGraduation: number;
        let gratuationCount: number;
        let Angle, C, S, R1, R2: number;

        let outerCoef: number = this._graduationOuterRadiusSize / 100;

        // draw zones

        for (let i: number = 0; i < this._zones.length; i++)
        {
            if (this._zones[i].visible)
            {
                if (this._zones[i].path == null)
                {
                    let zmin: number = Math.max(this._min, Math.min(this._max, this._zones[i].min));
                    let zmax: number = Math.max(this._min, Math.min(this._max, this._zones[i].max));

                    if (zmax > zmin)
                    {

                        let zOuterCoef: number = this._zones[i].outerRadius / 100;
                        let Angle1: number = ((Math.PI - AngleAperture) / 2) + AngleAperture * (zmin - this._min) / (this._max - this._min);
                        let Angle2: number = ((Math.PI - AngleAperture) / 2) + AngleAperture * (zmax - this._min) / (this._max - this._min);
                        let outterlength: number = (Angle2 - Angle1) * radius;
                        let stepCount: number = (outterlength / this.SegmentMaxLength) >> 0;
                        if (stepCount < 2) stepCount = 2;
                        this._zones[i].setPathSize(2 * stepCount + 2);

                        // let Path: YDataRendering.PointF[] = new Array(2 * stepCount + 2).fill(null);
                        for (let j: number = 0; j <= stepCount; j++)
                        {
                            let A: number = Angle1 + ((Angle2 - Angle1) * j) / stepCount;
                            this._zones[i].setPathPoint(j, new YDataRendering.PointF((xcenter - radius * zOuterCoef * Math.cos(A)), (ycenter - radius * zOuterCoef * Math.sin(A))));

                        }
                        let innerRadiusCoef: number = zOuterCoef - (this._zones[i].width / 100);

                        for (let j: number = stepCount; j >= 0; j--)
                        {
                            let A: number = Angle1 + ((Angle2 - Angle1) * j) / stepCount;
                            this._zones[i].setPathPoint(2 * stepCount + 1 - j, new YDataRendering.PointF((xcenter - radius * innerRadiusCoef * Math.cos(A)), (ycenter - radius * innerRadiusCoef * Math.sin(A))));

                        }
                    }
                }
                if (this._zones[i].path != null) g.FillPolygon(this._zones[i].zoneBrush, <YDataRendering.PointF[]>this._zones[i].path);

            }
        }

        firstGraduation = this._graduation * (this._min / this._graduation) >> 0;
        if (this._min < 0) firstGraduation -= this._graduation;

        while (firstGraduation < this._min)
        {
            firstGraduation += this._graduation;
        }
        gratuationCount = 1 + ((this._max - this._min) / this._graduation) >> 0;

        // draw sub graduations

        if ((this._subgraduationCount > 0) && ((this._subgraduationCount * gratuationCount) < circonference))
        {
            let subgraduation: number = this._graduation / this._subgraduationCount;
            firstGraduation = subgraduation * ((this._min / subgraduation) >> 0);
            if (this._min < 0) firstGraduation -= subgraduation;
            while (firstGraduation < this._min)
            {
                firstGraduation += subgraduation;
            }

            gratuationCount = 1 + ((this._max - this._min) / subgraduation) >> 0;

            for (let i: number = 0; i < gratuationCount; i++)
            {
                let value: number = firstGraduation + i * subgraduation;
                if (value <= this._max)
                {
                    Angle = ((Math.PI - AngleAperture) / 2) + AngleAperture * (value - this._min) / (this._max - this._min);
                    C = Math.cos(Angle);
                    S = Math.sin(Angle);
                    R1 = (outerCoef * (radius - this._borderThickness / 2));
                    R2 = (100 - this._subgraduationSize) * (outerCoef * (radius - this._borderThickness / 2)) / 100;
                    g.DrawLineXY(this._subgraduationPen, (xcenter - R1 * C), (ycenter - R1 * S),
                        (xcenter - R2 * C), (ycenter - R2 * S));
                }
            }
        }

        // draw Main graduations

        if (gratuationCount < circonference)  // stop drawing graduation if too many
        {
            for (let i: number = 0; i < gratuationCount; i++)
            {
                let gvalue: number = firstGraduation + i * this._graduation;
                if (gvalue <= this._max)
                {
                    Angle = ((Math.PI - AngleAperture) / 2) + AngleAperture * (gvalue - this._min) / (this._max - this._min);
                    C = Math.cos(Angle);
                    S = Math.sin(Angle);
                    R1 = (outerCoef * (radius - this._borderThickness / 2));
                    R2 = (100 - this._graduationSize) * (outerCoef * (radius - this._borderThickness / 2)) / 100;

                    g.DrawLineXY(this._graduationPen, (xcenter - R1 * C), (ycenter - R1 * S),
                        (xcenter - R2 * C), (ycenter - R2 * S));

                    size = g.MeasureStringSF(gvalue.toString().trim(), this._graduationFont, 1000, stringFormat4Sizing);

                    let HalfDiagonal: number = 0.4 * Math.sqrt(size.width * size.width + size.height * size.height);
                    let position: YDataRendering.YRectangle = new YDataRendering.YRectangle((xcenter - (R2 - HalfDiagonal) * C - (size.width / 2)) >> 0,
                        (ycenter - (R2 - HalfDiagonal) * S - (size.height / 2)) >> 0,
                        (size.width >> 0) + 1, size.height >> 0);

                    //  g.DrawRectangle(new YDataRendering.YPen(Color.Red, 1), position);

                    g.DrawStringRect(gvalue.toString(), this._graduationFont, this._graduationFont.brush, position, stringFormat);
                }
            }
        }

        // draw Border

        if ((this._borderThickness > 0) && (this._path.length > 3)) g.DrawPolygon(this._borderpen, this._path);

        this.drawAnnotationPanels(g, this._annotationPanels, w, h, true, mainViewPort);

        // draw Needle
        if (this._showNeedle)
        {
            if (this._needleValue != this._value)
            {
                let step: number = this._unitFactor * this._needleMaxSpeed * (this._max - this._min) / 100;
                if (Math.abs(this._value - this._needleValue) < step)
                {
                    this._needleValue = this._value;
                }
                else if (this._needleValue < this.value)
                {
                    this._needleValue += step;
                }
                else
                {
                    this._needleValue -= step;
                }

            }

            let needlevalue: number = this._needleValue / this._unitFactor;
            let allowedOverflow: number = (this._max - this.min) * 0.05;
            if (needlevalue < this._min - allowedOverflow) needlevalue = this._min - allowedOverflow;
            if (needlevalue > this._max + allowedOverflow) needlevalue = this._max + allowedOverflow;

            Angle = ((Math.PI - AngleAperture) / 2) + AngleAperture * (needlevalue - this._min) / (this._max - this._min);
            C = Math.cos(Angle);
            S = Math.sin(Angle);
            R1 = (radius * this._needleLength1) / 100;
            R2 = (radius * this._needleLength2) / 100;
            let R3: number = (radius * this._needleWidth) / 200;

            let needlepath: YDataRendering.PointF[] = new Array(4).fill(null);
            needlepath[0] = new YDataRendering.PointF((xcenter - R1 * C), (ycenter - R1 * S));
            needlepath[1] = new YDataRendering.PointF((xcenter + R3 * S), (ycenter - R3 * C));
            needlepath[2] = new YDataRendering.PointF((xcenter + R2 * C), (ycenter + R2 * S));
            needlepath[3] = new YDataRendering.PointF((xcenter - R3 * S), (ycenter + R3 * C));

            if (this._needleBrush == null) this._needleBrush = new YDataRendering.YSolidBrush(this._needleColor);
            g.FillPolygon(this._needleBrush, needlepath);

            if (this._needleContourThickness > 0)
            {
                if (this._needleContourPen == null)
                {
                    this._needleContourPen = new YDataRendering.YPen(this._needleContourColor, this._needleContourThickness);
                    this._needleContourPen.startCap = YDataRendering.YPen.LineCap.Round;

                    this._needleContourPen.endCap = YDataRendering.YPen.LineCap.Round;
                    this._needleContourPen.linejoin = YDataRendering.YPen.LineJoin.Round;
                }

                let needlepath2: YDataRendering.PointF[] = new Array(5).fill(null);
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

    protected renderingPostProcessing()
    {
        if (this._needleValue != this._value) this.redraw();
    }

}

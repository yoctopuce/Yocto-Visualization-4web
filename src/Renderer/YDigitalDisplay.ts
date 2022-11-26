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

export class YDigitalDisplay extends YDataRendering.YDataRenderer
{
    private _bgBrush: YDataRendering.YBrush | null = null;

    private _backgroundColor1: YDataRendering.YColor = YDataRendering.YColor.Black;
    public get backgroundColor1(): YDataRendering.YColor { return this._backgroundColor1;}
    public set backgroundColor1(value: YDataRendering.YColor)
    {
        this._backgroundColor1 = value;
        this._bgBrush = null;
        this.redraw();
    }

    private _backgroundColor2: YDataRendering.YColor = YDataRendering.YColor.FromArgb(255, 48, 48, 48);
    public get backgroundColor2(): YDataRendering.YColor { return this._backgroundColor2;}
    public set backgroundColor2(value: YDataRendering.YColor)
    {
        this._backgroundColor2 = value;
        this._bgBrush = null;
        this.redraw();
    }

    private _alternateValue: string | null = null
    get alternateValue(): string | null { return this._alternateValue; }
    set alternateValue(value: string | null)
    {
        this._alternateValue = value;
        this.redraw();
    }

    private _valueFormater: YDataRendering.ValueFormater | null = null;
    get valueFormater(): YDataRendering.ValueFormater | null { return this._valueFormater;}
    set valueFormater(value: YDataRendering.ValueFormater | null)
    {
        this._valueFormater = value;
        this.redraw();
    }

    private _hrzAlignmentOfset: number = 5.0;
    get hrzAlignmentOfset() { return this._hrzAlignmentOfset; }
    set hrzAlignmentOfset(value)
    {
        this._hrzAlignmentOfset = value;
        this.redraw();
    }

    private _hrzAlignment: YDigitalDisplay.HrzAlignmentEnumItem = YDigitalDisplay.HrzAlignment.DECIMAL;
    get hrzAlignment(): YDigitalDisplay.HrzAlignmentEnumItem { return this._hrzAlignment; }
    set hrzAlignment(value: YDigitalDisplay.HrzAlignmentEnumItem)
    {
        this._hrzAlignment = value;
        this.redraw();
    }

    private _outOfRangeMin: number = Number.NaN;
    get outOfRangeMin(): number { return this._outOfRangeMin; }
    set outOfRangeMin(value: number)
    {
        if (!Number.isNaN(value) && !Number.isNaN(this._outOfRangeMax) && !YDataRendering.YDataRenderer.minMaxCheckDisabled)
        {
            if (value >= this._outOfRangeMax) throw new RangeError("Min cannot be greater than max (" + this._outOfRangeMax.toString() + ")");
        }
        this._outOfRangeMin = value;
        this.redraw();
    }

    private _outOfRangeMax: number = Number.NaN;
    get outOfRangeMax(): number { return this._outOfRangeMax; }
    set outOfRangeMax(value: number)
    {
        if (!Number.isNaN(value) && !Number.isNaN(this._outOfRangeMin) && !YDataRendering.YDataRenderer.minMaxCheckDisabled)
        {
            if (value <= this._outOfRangeMin) throw new RangeError("Min cannot be less than max (" + this._outOfRangeMin.toString() + ")");
        }
        this._outOfRangeMax = value;
        this.redraw();
    }

    private _outOfRangeColor: YDataRendering.YColor = YDataRendering.YColor.Red;
    public get outOfRangeColor(): YDataRendering.YColor { return this._outOfRangeColor;}
    public set outOfRangeColor(value: YDataRendering.YColor)
    {
        this._outOfRangeColor = value;
        this.redraw();
    }

    private _value: number = 0.0;
    get value(): number { return this._value; }
    set value(value: number)
    {
        this._value = value;
        this.redraw();
    }

    private _font: YDataRendering.YFont;
    get font(): YDataRendering.YFont { return this._font; }

    constructor(UIContainer: HTMLCanvasElement, logFunction: YDataRendering.logFct)
    {
        super(UIContainer, logFunction);

        this._font = new YDataRendering.YFont(this, this, Math.min(UIContainer.width / 5, UIContainer.height / 2), null);
        this._font.color = YDataRendering.YColor.LightGreen;
        this.resizeRule = YDataRendering.Proportional.ResizeRule.RELATIVETOBOTH;

    }

    public clearCachedObjects(): void
    {
        if (this.font != null) this.font.ResetFont(null);
        this._bgBrush = null;
    }

    protected Render(g: YDataRendering.YGraphics, w: number, h: number): number
    {

        let mainViewPort: YDataRendering.ViewPortSettings = new YDataRendering.ViewPortSettings()
        mainViewPort.Lmargin = 0;
        mainViewPort.Rmargin = 0;
        mainViewPort.Tmargin = 0;
        mainViewPort.Bmargin = 0;

        g.SmoothingMode = YDataRendering.YSmoothingMode.HighQuality;
        g.TextRenderingHint = YDataRendering.YTextRenderingHint.AntiAlias;

        let stringFormat: YDataRendering.YStringFormat = new YDataRendering.YStringFormat(YDataRendering.YStringFormat.StringFormatFlags.NoClip);
        stringFormat.Alignment = YDataRendering.YStringFormat.StringAlignment.Center;
        stringFormat.LineAlignment = YDataRendering.YStringFormat.StringAlignment.Center;

        if (this._bgBrush == null)
        {
            this._bgBrush = new YDataRendering.YLinearGradientBrush(this._backgroundColor1, this._backgroundColor2);
        }
        g.FillRectangleXYHW(this._bgBrush, 0, 0, w, h);

        this.drawAnnotationPanels(g, this._annotationPanels, w, h, false, mainViewPort);
        if (mainViewPort.Tmargin >= 20) mainViewPort.Tmargin -= 10;  // AnnotationPanels adds at least 20px warnings
        if (mainViewPort.Bmargin >= 20) mainViewPort.Bmargin -= 10;  // which is a bit much for digital display

        g.TextRenderingHint = YDataRendering.YTextRenderingHint.AntiAlias;

        let availWidth: number = w - (mainViewPort.Lmargin + mainViewPort.Rmargin);
        let availHeight: number = h - (mainViewPort.Tmargin + mainViewPort.Bmargin);

        if ((availWidth > 10) && (availHeight > 10))
        {// draw unit
            let svalue: string;
            if (this._alternateValue == null)
            {
                svalue = this._valueFormater == null ? this.value.toFixed(3) : this._valueFormater(this, this.value);
                if ((!Number.isNaN(this._outOfRangeMin)) && (this.value < this._outOfRangeMin))
                {
                    this.font.alternateColor = this._outOfRangeColor;
                }
                else if ((!Number.isNaN(this._outOfRangeMax)) && (this.value > this._outOfRangeMax))
                {
                    this.font.alternateColor = this._outOfRangeColor;
                }
                else
                {
                    this.font.alternateColor = null;
                }

            }
            else
            {
                this._font.alternateColor = null;
                svalue = this._alternateValue;
            }

            let size: YDataRendering.YSizeF = g.MeasureStringSF(svalue, this.font, 10000, stringFormat);
            let pos: YDataRendering.YRectangle;

            let align: YDigitalDisplay.HrzAlignment = this._hrzAlignment;
            if ((this._alternateValue != null) && (align == YDigitalDisplay.HrzAlignment.DECIMAL)) align = YDigitalDisplay.HrzAlignment.RIGHT;

            if ((align == YDigitalDisplay.HrzAlignment.DECIMAL) && (svalue.indexOf(".") < 0)) align = YDigitalDisplay.HrzAlignment.RIGHT;

            switch (align)
            {
            case YDigitalDisplay.HrzAlignment.LEFT:
                pos = new YDataRendering.YRectangle(mainViewPort.Lmargin + ((availWidth * this.hrzAlignmentOfset / 100) >> 0),
                    mainViewPort.Tmargin + ((availHeight - size.height) / 2) >> 0,
                    (size.width + 1) >> 0, (size.height + 1) >> 0);
                g.DrawStringRect(svalue, this.font, this.font.brush, pos, stringFormat);
                break;
            case YDigitalDisplay.HrzAlignment.CENTER:
                pos = new YDataRendering.YRectangle(mainViewPort.Lmargin + ((availWidth - size.width) / 2) >> 0,
                    mainViewPort.Tmargin + ((availHeight - size.height) / 2) >> 0,
                    (size.width + 1) >> 0, (size.height + 1) >> 0);
                g.DrawStringRect(svalue, this.font, this.font.brush, pos, stringFormat);
                break;
            case YDigitalDisplay.HrzAlignment.DECIMAL:

                let left: string = "";

                let p: number = svalue.lastIndexOf(',');
                if (p < 0) p = svalue.lastIndexOf('.');
                if (p >= 0)
                {
                    left = svalue.substring(0, p + 1);

                }
                else
                {
                    p = 0;
                    while ((p < svalue.length) && ((svalue[p] >= '0' && svalue[p] <= '9') || (svalue[p] == '-') || (svalue[p] == '\'') || (svalue[p] == ' ')))
                    {
                        p++;
                    }
                    left = svalue.substring(0, p);

                }

                let lsize: YDataRendering.YSizeF = g.MeasureStringSF(left, this.font, 10000, stringFormat);
                pos = new YDataRendering.YRectangle(mainViewPort.Lmargin + (availWidth - lsize.width - availWidth * this.hrzAlignmentOfset / 100) >> 0,
                    mainViewPort.Tmargin + ((availHeight - size.height) / 2) >> 0,
                    (size.width + 1) >> 0, (size.height + 1) >> 0);
                g.DrawStringRect(svalue, this.font, this.font.brush, pos, stringFormat);
                break;

            case YDigitalDisplay.HrzAlignment.RIGHT:
                pos = new YDataRendering.YRectangle(mainViewPort.Lmargin + (availWidth - size.width - availWidth * this.hrzAlignmentOfset / 100) >> 0,
                    mainViewPort.Tmargin + ((availHeight - size.height) / 2) >> 0,
                    (size.width + 1) >> 0, (size.height + 1) >> 0);

                g.DrawStringRect(svalue, this.font, this.font.brush, pos, stringFormat);
                break;

            }
        }
        this.drawAnnotationPanels(g, this._annotationPanels, w, h, true, mainViewPort);
        this.DrawMessagePanels(g, w, h);
        return 0;
    }

}

export namespace YDigitalDisplay
{

    export class HrzAlignmentEnumItem extends YDataRendering.YEnumItem
    {
        constructor(value: any, humanreadable: string, container?: object)
        {
            super(value, humanreadable, HrzAlignment)

        }
    }

    export class HrzAlignment extends YDataRendering.YEnum
    {
        public static readonly LEFT: HrzAlignmentEnumItem = new HrzAlignmentEnumItem("LEFT", "Left");
        public static readonly CENTER: HrzAlignmentEnumItem = new HrzAlignmentEnumItem("CENTER", "Center");
        public static readonly DECIMAL: HrzAlignmentEnumItem = new HrzAlignmentEnumItem("DECIMAL", "Decimal");
        public static readonly RIGHT: HrzAlignmentEnumItem = new HrzAlignmentEnumItem("RIGHT", "Right");
    }

    //export const enum HrzAlignment { LEFT = "Left", CENTER = "Center", DECIMAL="Decimal", RIGHT ="Right"  }

}


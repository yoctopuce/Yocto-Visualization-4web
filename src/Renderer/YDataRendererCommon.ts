/*
*   Yocto-Visualization (for web), a free web-based application
*   to visualize Yoctopuce Sensors.
*
*  Renderer common functions
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

export interface logFct {(msg: string): void}

export interface ResetCallBack {(source: Proportional): void}

export interface fontChangeResetCallBack {(source: YFont): void}

export interface ProportionnalValueChangeCallback {(source: Proportional): void}

export interface PatchAnnotationCallback {(text: string): string}

export interface ValueFormater {(source: YDataRenderer, value: number): string}

export class Vector3
{
    public readonly a: number;
    public readonly b: number;
    public readonly c: number;

    constructor(a: number, b: number, c: number)
    {
        this.a = a;
        this.b = b;
        this.c = c;
    }

    static FromXYCoord(x: number, y: number) {return new Vector3(x, y, 1);}

    public multiplyByM(m: Matrix3x3): Vector3
    {
        return new Vector3(
            m.a * this.a + m.b * this.b + m.c * this.c,
            m.d * this.a + m.e * this.b + m.f * this.c,
            m.g * this.a + m.h * this.b + m.i * this.c);
    }

    public multiplyByN(n: number): Vector3
    {
        return new Vector3(this.a * n, this.b * n, this.c * n);
    }

    public AddV(v: Vector3): Vector3
    {
        return new Vector3(this.a + v.a, this.b + v.b, this.c + v.c);
    }

    public SubstractV(v: Vector3): Vector3
    {
        return new Vector3(this.a - v.a, this.b - v.b, this.c - v.c);
    }

    public toPointF(): PointF
    {return new PointF(this.a, this.b); }

    public toPoint(): Point
    {return new Point(this.a, this.b); }

}

export class Matrix3x3
{  // | a b c |
   // | d e f |
   // | g h i |

    public readonly a: number;
    public readonly b: number;
    public readonly c: number;
    public readonly d: number;
    public readonly e: number;
    public readonly f: number;
    public readonly g: number;
    public readonly h: number;
    public readonly i: number;

    private static readonly Flag_NONE = 0;
    private static readonly Flag_IDENTITY = 1;
    private static readonly Flag_TRANSLATION = 2;
    public readonly isTranslation: boolean;
    public readonly isIdentity: boolean;

    // don't use the constructor directly but newMatrix, newTranslateMatrix, newRotateMatrix etc...
    private constructor(a: number, b: number, c: number,
                        d: number, e: number, f: number,
                        g: number, h: number, i: number, flags: number)
    {
        this.a = a;
        this.b = b;
        this.c = c;
        this.d = d;
        this.e = e;
        this.f = f;
        this.g = g;
        this.h = h;
        this.i = i;

        if ((b == 0) && (d == 0) && (a == 1) && (e == 1) && (i == 1) && (g == 0) && (h == 0))
        {
            flags |= Matrix3x3.Flag_TRANSLATION;
            if ((c == 0) && (f == 0)) flags |= Matrix3x3.Flag_IDENTITY;
        }

        this.isTranslation = (flags & Matrix3x3.Flag_TRANSLATION) != 0;
        this.isIdentity = (flags & Matrix3x3.Flag_IDENTITY) != 0;
    }

    public clone(): Matrix3x3
    {
        let flag: number = 0;
        if (this.isTranslation) flag |= Matrix3x3.Flag_TRANSLATION;
        if (this.isIdentity) flag |= Matrix3x3.Flag_IDENTITY;
        return new Matrix3x3(this.a, this.b, this.c,
            this.d, this.e, this.f,
            this.g, this.h, this.i, flag);
    }
    public get determinant(): number
    {
        let detA: number = this.e * this.i - this.h * this.f;
        let detB: number = this.d * this.i - this.g * this.f;
        let detC: number = this.d * this.h - this.g * this.e;
        return this.a * detA + -this.b * detB + this.c * detC
    }

    public get transpose(): Matrix3x3
    {
        if (this.isIdentity) return Matrix3x3.newIdentityMatrix();
        return new Matrix3x3(this.a, this.d, this.g, this.b, this.e, this.h, this.c, this.f, this.i, Matrix3x3.Flag_NONE);
    }

    public multiplyByV(v: Vector3): Vector3
    {

        if (this.isTranslation) return new Vector3(this.c + v.a, this.f + v.b, 1);

        return new Vector3(this.a * v.a + this.b * v.b + this.c * v.c,
            this.d * v.a + this.e * v.b + this.f * v.c,
            this.g * v.a + this.h * v.b + this.i * v.c);
    }

    static newMatrix(a: number, b: number, c: number,
                     d: number, e: number, f: number,
                     g: number, h: number, i: number): Matrix3x3
    {
        return new Matrix3x3(a, b, c, d, e, f, g, h, i, Matrix3x3.Flag_NONE)
    }

    static newTranslateMatrix(offsetX: number, offsetY: number): Matrix3x3
    {
        let flag: number = Matrix3x3.Flag_TRANSLATION;
        if ((offsetX == 0) && (offsetY == 0)) flag |= Matrix3x3.Flag_IDENTITY;
        return new Matrix3x3(1, 0, offsetX, 0, 1, offsetY, 0, 0, 1, flag);
    }

    static newRotateMatrix(AngleDeg: number): Matrix3x3
    {
        AngleDeg = Math.PI * AngleDeg / 180;
        return new Matrix3x3(Math.cos(AngleDeg), -Math.sin(AngleDeg), 0,
            Math.sin(AngleDeg), -Math.cos(AngleDeg), 0,
            0, 0, 1, Matrix3x3.Flag_NONE);
    }

    static newScaleMatrix(Coef: number): Matrix3x3
    {
        return new Matrix3x3(Coef, 0, 0,
            0, Coef, 0,
            0, 0, 1, Matrix3x3.Flag_NONE);
    }

    static newIdentityMatrix(): Matrix3x3
    {
        return new Matrix3x3(1, 0, 0,
            0, 1, 0,
            0, 0, 1, Matrix3x3.Flag_IDENTITY | Matrix3x3.Flag_TRANSLATION);
    }

    public toCSS()
    {
        return "matrix(" + this.a.toString() + "," + this.d.toString() + ","
            + this.b.toString() + "," + this.e.toString() + ","
            + this.c.toString() + "," + this.f.toString() + ")"

    }

    public toString()
    {
        return "| " + this.a.toFixed(2) + " " + this.b.toFixed(2) + " " + this.c.toFixed(2) + " |" + (this.isIdentity ? " I" : "") + "\n"
            + "| " + this.d.toFixed(2) + " " + this.e.toFixed(2) + " " + this.f.toFixed(2) + " |" + (this.isTranslation ? " T" : "") + "\n"
            + "| " + this.g.toFixed(2) + " " + this.g.toFixed(2) + " " + this.i.toFixed(2) + " |\n"
    }

    public multiplyByM(m: Matrix3x3): Matrix3x3
    {
        // | a b c |
        // | d e f |
        // | g h i |

        if (this.isIdentity) return m.clone();
        if (m.isIdentity) return this.clone();
        if ((this.isTranslation) && (m.isTranslation)) return Matrix3x3.newTranslateMatrix(this.c + m.c, this.f + m.f);

        return new Matrix3x3(this.a * m.a + this.b * m.d + this.c * m.g, this.a * m.b + this.b * m.e + this.c * m.h, this.a * m.c + this.b * m.f + this.c * m.i,
            this.d * m.a + this.e * m.d + this.f * m.g, this.d * m.b + this.e * m.e + this.f * m.h, this.d * m.c + this.e * m.f + this.f * m.i,
            this.g * m.a + this.h * m.d + this.i * m.g, this.g * m.b + this.h * m.e + this.i * m.h, this.g * m.c + this.h * m.f + this.i * m.i, Matrix3x3.Flag_NONE);
    }

    public get inverse(): Matrix3x3
    {
        // | a b c |   | a d g |
        // | d e f |   | b e h |
        // | g h i |   | c f i |

        if (this.isIdentity) return Matrix3x3.newIdentityMatrix();
        if (this.isTranslation) return Matrix3x3.newTranslateMatrix(-this.c, -this.f);

        let det: number = this.determinant;
        if (det == 0) throw "matrix cannot be inverted"
        let detA: number = this.e * this.i - this.f * this.h;
        let detB: number = this.b * this.i - this.c * this.h;
        let detC: number = this.b * this.f - this.c * this.e;
        let detD: number = this.d * this.i - this.f * this.g;
        let detE: number = this.a * this.i - this.c * this.g;
        let detF: number = this.a * this.f - this.c * this.d;
        let detG: number = this.d * this.h - this.e * this.g;
        let detH: number = this.a * this.h - this.b * this.g;
        let detI: number = this.a * this.e - this.b * this.d;

        return new Matrix3x3(detA / det, -detB / det, detC / det,
            -detD / det, detE / det, -detF / det,
            detG / det, -detH / det, detI / det, Matrix3x3.Flag_NONE);

    }

    public log()
    {
        console.log(this.toString());

    }

}

// enum emulation (javascript enum are so lame, we had to make ours)
//  usage example
//
//  export class  HrzAlignment extends YDataRendering.YEnum
//      { public static readonly LEFT   = new  YDataRendering.YEnumItem("LEFT","Left");
//        public static readonly CENTER = new  YDataRendering.YEnumItem("CENTER","Center");
//        public static readonly DECIMAL= new  YDataRendering.YEnumItem("DECIMAL","Decimal");
//        public static readonly RIGHT  = new  YDataRendering.YEnumItem("RIGHT","Right");
//     }

export class YEnum
{
    public static fromString(container: any, value: string): YEnumItem
    {
        let p = Object.getOwnPropertyNames(container);

        for (let i: number = 0; i < p.length; i++)
        {
            if (p[i] == value) return container[value];
        }
        throw "YEnum" + value + " is not a " + container + " value";
    }

    public static siblings(container: any)
    {
        let res: YEnumItem[] = []
        let p: string[] = Object.getOwnPropertyNames(container);

        for (let i: number = 0; i < p.length; i++)
        {
            if (container[p[i]] instanceof YEnumItem)
            {
                res.push(container[p[i]]);
            }
        }
        return res;

    }

}

export class YEnumItem
{
    private _value: any;
    private _humanreadable: string;
    private _container: object;

    constructor(value: any, humanreadable: string, container: object)
    {
        this._value = value;
        this._container = container;

        this._humanreadable = humanreadable;
    }

    public fromString(value: string): YEnumItem { return YEnum.fromString(this._container, value);}
    public get toString(): string { return this._value.toString();}
    public get description(): string { return this._humanreadable;}
    public get sibblings(): YEnumItem[] {return YEnum.siblings(this._container);}

}

export class ViewPortSettings
{
    public IRLx: number = 0;
    public IRLy: number = 0;

    public zoomx: number = 0;
    public zoomy: number = 0;
    public Lmargin: number = 0;
    public Rmargin: number = 0;
    public Tmargin: number = 0;
    public Bmargin: number = 0;
    public Width: number = 0;
    public Height: number = 0;
    public Capture: boolean = false;
    public IRLCaptureStartX: number = 0;
    public CaptureStartY: number = 0;
    public OriginalXAxisMin: number = 0;
    public OriginalXAxisMax: number = 0;
    public OriginalIRLx: number = 0;
    public OriginalLmargin: number = 0;
    public OriginalZoomx: number = 0;

}

export class YFont
{
    private _userData: any = null;
    get userData(): any { return this._userData; }
    set userData(value: any) { this._userData = value; }
    private _parentRenderer: YDataRenderer;
    private _fontChangeCallback: fontChangeResetCallBack | null = null;
    private _directParent: object;
    get directParent(): object { return this._directParent; }

    constructor(parentRenderer: YDataRenderer, directParent: object, size?: number, fontChangeCallback?: fontChangeResetCallBack | null)
    {
        this._parentRenderer = parentRenderer;
        this._directParent = directParent;
        this._fontChangeCallback = fontChangeCallback ? fontChangeCallback : null;
        this._size = new Proportional(size ? size : 10, Proportional.ResizeRule.FIXED, parentRenderer, this, this.ResetFont);
    }

    public ResetFont(source: Proportional | null): void
    {
        this._font = null;
        if (source != null) this._parentRenderer.ProportionnalValueChanged(source);
    }

    private _name: string = "Arial";
    get name(): string {return this._name;}

    set name(value: string)
    {
        this._name = value;
        this.ResetFont(null);
        this._parentRenderer.redraw();
    }

    get hasChanged() : boolean
     { return  this._font == null;}

    private _size: Proportional;
    get size(): number {return this._size.value;}



    set size(value: number)
    {
        if (value <= 0) throw new RangeError("Size must be a positive value");
        value = (Math.round(100 * value) / 100)
        this._size.value = value;
        this.ResetFont(null);
        if (this._fontChangeCallback != null) this._fontChangeCallback(this);
        this._parentRenderer.redraw();
    }

    private _italic: boolean = false;
    get italic(): boolean { return this._italic; }

    set italic(value: boolean)
    {
        if (this._italic != value)
        {
            this._italic = value;
            this.ResetFont(null);
            this._parentRenderer.redraw();
        }
    }

    private _bold: boolean = false;
    get bold(): boolean { return this._bold; }

    set bold(value: boolean)
    {
        if (this._bold != value)
        {
            this._bold = value;
            this.ResetFont(null);
            this._parentRenderer.redraw();
        }
    }

    private _color: YColor = YColor.Black;
    get color(): YColor {return this._color;}

    set color(value: YColor)
    {
        if (this._color != value)
        {
            this._color = value;
            this._brush = null;
            this._parentRenderer.redraw();
        }
    }

    // if alternate color si set, then it will be used instead of regular color
    private _alternateColor: YColor | null = null;
    get alternateColor(): YColor | null {return this._alternateColor;}
    set alternateColor(value: YColor | null)
    {
        if (this._alternateColor != value)
        {
            this._alternateColor = value;
            this._brush = null;
            this._parentRenderer.redraw();
        }
    }

    private _font: string | null = null;

    get fontObject(): string { return this._name ? this._name : "Arial"; }

    private _brush: YBrush | null = new YSolidBrush(YColor.Black);
    public get brush(): YBrush
    {
        if (this._brush == null) this._brush = new YSolidBrush(this._alternateColor != null ? this._alternateColor : this._color);
        return this._brush;
    }

    public get sizeInPoints(): number {return this._size.value * 0.75;}

    public get sizeForCanvas(): number {return this._size.value * 1.15;}

    public get htmlCode(): string
    {
        return (this._italic ? "italic " : "") + (this._bold ? "bold " : "") + this.sizeForCanvas.toString() + "px " + this._name;
    }

}

export class YSizeF
{

    private _w: number = 0;
    private _h: number = 0;
    private _lines: string[] = [];
    private _linesCount: number = 0;
    private _lineHeight: number = 0;
    private _firstlineHeight: number = 0;

    constructor(font: YFont | null, st: string)
    {
        if (font != null)
        {
            this._lineHeight = font.size * 1.25;
            this._firstlineHeight = this._lineHeight * 0.75;
            if (st.indexOf("\n") < 0)
            {
                this._lines = [st];
                this._linesCount = 1
            }
            else
            {
                this._lines = st.split("\n");
                this._linesCount = this._lines.length;
            }
        }
    }

    get lines(): string[] { return this._lines }
    get linesCount(): number { return this._linesCount }

    get firstLineHeight(): number { return this._firstlineHeight; }
    get lineHeight(): number { return this._lineHeight; }
    get height(): number { return this._h }

    get width(): number { return this._w}

    set width(value: number)
    {
        this._w = value;
    }
    set height(value: number)
    {
        this._h = value;
    }
}

export class YTextRenderingHint
{
    _value = 0;
    static readonly SystemDefault: YTextRenderingHint = new YTextRenderingHint(0);
    static readonly SingleBitPerPixelGridFit: YTextRenderingHint = new YTextRenderingHint(1);
    static readonly SingleBitPerPixel: YTextRenderingHint = new YTextRenderingHint(2);
    static readonly AntiAliasGridFit: YTextRenderingHint = new YTextRenderingHint(3);
    static readonly AntiAlias: YTextRenderingHint = new YTextRenderingHint(4);
    static readonly ClearTypeGridFit: YTextRenderingHint = new YTextRenderingHint(5);
    constructor(value: number) {this._value = value};

}

export class YSmoothingMode
{
    _value = 0;
    static readonly Invalid: YSmoothingMode = new YSmoothingMode(-1);
    static readonly Default: YSmoothingMode = new YSmoothingMode(0);
    static readonly HighSpeed: YSmoothingMode = new YSmoothingMode(1);
    static readonly HighQuality: YSmoothingMode = new YSmoothingMode(2);
    static readonly None: YSmoothingMode = new YSmoothingMode(3);
    static readonly AntiAlias: YSmoothingMode = new YSmoothingMode(4);
    constructor(value: number) {this._value = value};

}

class YStringBuilder
{
    private _str: string = "";

    public AppendLine(s: string) { this._str += s + "\n";}

    public Append(s: string) { this._str += s;}

    public get contents(): string {return this._str;}

}

export class YStringFormat
{
    private _Alignment: YStringFormat.StringAlignment = YStringFormat.StringAlignment.Near;
    get Alignment(): YStringFormat.StringAlignment {return this._Alignment; }
    set Alignment(value: YStringFormat.StringAlignment) { this._Alignment = value;}

    private _LineAlignment: YStringFormat.StringAlignment = YStringFormat.StringAlignment.Near;
    get LineAlignment(): YStringFormat.StringAlignment { return this._LineAlignment; }
    set LineAlignment(value: YStringFormat.StringAlignment) { this._LineAlignment = value; }

    private _formatFlags: YStringFormat.StringFormatFlags = YStringFormat.StringFormatFlags.default;
    get FormatFlags(): YStringFormat.StringFormatFlags { return this._formatFlags; }
    set FormatFlags(value: YStringFormat.StringFormatFlags) { this._formatFlags = value; }

    private _Trimming: YStringFormat.StringTrimming = YStringFormat.StringTrimming.None;
    public get Trimming(): YStringFormat.StringTrimming {return this._Trimming; }
    public set Trimming(value: YStringFormat.StringTrimming) { this._Trimming = value; }

    private _clip: YStringFormat.StringFormatFlags = YStringFormat.StringFormatFlags.NoClip;
    constructor(clip: YStringFormat.StringFormatFlags) {this._clip = clip}
}

export namespace YStringFormat
{
    export const enum StringAlignment { Near = 0, Center = 1, Far = 2 }

    export const enum StringFormatFlags
    {
        default = 0, DirectionRightToLeft = 1, DirectionVertical = 2, FitBlackBox = 4,

        DisplayFormatControl = 32, NoFontFallback = 1024, MeasureTrailingSpaces = 2048, NoWrap = 4096, LineLimit = 8192,

        NoClip = 16384
    }

    export const enum StringTrimming
    {

        None = 0,

        Character = 1,

        Word = 2,

        EllipsisCharacter = 3,

        EllipsisWord = 4,

        EllipsisPath = 5
    }

}

export const enum YGraphicsUnit
{
    World = 0,
    Display = 1,
    Pixel = 2,
    Point = 3,
    Inch = 4,
    Document = 5,
    Millimeter = 6
}

export class YColor
{
    public static readonly AliceBlue: YColor = new YColor(false, 0xFF, 0xF0, 0xF8, 0xFF, true);
    public static readonly AntiqueWhite: YColor = new YColor(false, 0xFF, 0xFA, 0xEB, 0xD7, true);
    public static readonly Aqua: YColor = new YColor(false, 0xFF, 0x00, 0xFF, 0xFF, true);
    public static readonly Aquamarine: YColor = new YColor(false, 0xFF, 0x7F, 0xFF, 0xD4, true);
    public static readonly Azure: YColor = new YColor(false, 0xFF, 0xF0, 0xFF, 0xFF, true);
    public static readonly Beige: YColor = new YColor(false, 0xFF, 0xF5, 0xF5, 0xDC, true);
    public static readonly Bisque: YColor = new YColor(false, 0xFF, 0xFF, 0xE4, 0xC4, true);
    public static readonly Black: YColor = new YColor(false, 0xFF, 0x00, 0x00, 0x00, true);
    public static readonly BlanchedAlmond: YColor = new YColor(false, 0xFF, 0xFF, 0xEB, 0xCD, true);
    public static readonly Blue: YColor = new YColor(false, 0xFF, 0x00, 0x00, 0xFF, true);
    public static readonly BlueViolet: YColor = new YColor(false, 0xFF, 0x8A, 0x2B, 0xE2, true);
    public static readonly Brown: YColor = new YColor(false, 0xFF, 0xA5, 0x2A, 0x2A, true);
    public static readonly BurlyWood: YColor = new YColor(false, 0xFF, 0xDE, 0xB8, 0x87, true);
    public static readonly CadetBlue: YColor = new YColor(false, 0xFF, 0x5F, 0x9E, 0xA0, true);
    public static readonly Chartreuse: YColor = new YColor(false, 0xFF, 0x7F, 0xFF, 0x00, true);
    public static readonly Chocolate: YColor = new YColor(false, 0xFF, 0xD2, 0x69, 0x1E, true);
    public static readonly Coral: YColor = new YColor(false, 0xFF, 0xFF, 0x7F, 0x50, true);
    public static readonly CornflowerBlue: YColor = new YColor(false, 0xFF, 0x64, 0x95, 0xED, true);
    public static readonly Cornsilk: YColor = new YColor(false, 0xFF, 0xFF, 0xF8, 0xDC, true);
    public static readonly Crimson: YColor = new YColor(false, 0xFF, 0xDC, 0x14, 0x3C, true);
    public static readonly Cyan: YColor = new YColor(false, 0xFF, 0x00, 0xFF, 0xFF, true);
    public static readonly DarkBlue: YColor = new YColor(false, 0xFF, 0x00, 0x00, 0x8B, true);
    public static readonly DarkCyan: YColor = new YColor(false, 0xFF, 0x00, 0x8B, 0x8B, true);
    public static readonly DarkGoldenrod: YColor = new YColor(false, 0xFF, 0xB8, 0x86, 0x0B, true);
    public static readonly DarkGray: YColor = new YColor(false, 0xFF, 0xA9, 0xA9, 0xA9, true);
    public static readonly DarkGreen: YColor = new YColor(false, 0xFF, 0x00, 0x64, 0x00, true);
    public static readonly DarkKhaki: YColor = new YColor(false, 0xFF, 0xBD, 0xB7, 0x6B, true);
    public static readonly DarkMagenta: YColor = new YColor(false, 0xFF, 0x8B, 0x00, 0x8B, true);
    public static readonly DarkOliveGreen: YColor = new YColor(false, 0xFF, 0x55, 0x6B, 0x2F, true);
    public static readonly DarkOrange: YColor = new YColor(false, 0xFF, 0xFF, 0x8C, 0x00, true);
    public static readonly DarkOrchid: YColor = new YColor(false, 0xFF, 0x99, 0x32, 0xCC, true);
    public static readonly DarkRed: YColor = new YColor(false, 0xFF, 0x8B, 0x00, 0x00, true);
    public static readonly DarkSalmon: YColor = new YColor(false, 0xFF, 0xE9, 0x96, 0x7A, true);
    public static readonly DarkSeaGreen: YColor = new YColor(false, 0xFF, 0x8F, 0xBC, 0x8F, true);
    public static readonly DarkSlateBlue: YColor = new YColor(false, 0xFF, 0x48, 0x3D, 0x8B, true);
    public static readonly DarkSlateGray: YColor = new YColor(false, 0xFF, 0x2F, 0x4F, 0x4F, true);
    public static readonly DarkTurquoise: YColor = new YColor(false, 0xFF, 0x00, 0xCE, 0xD1, true);
    public static readonly DarkViolet: YColor = new YColor(false, 0xFF, 0x94, 0x00, 0xD3, true);
    public static readonly DeepPink: YColor = new YColor(false, 0xFF, 0xFF, 0x14, 0x93, true);
    public static readonly DeepSkyBlue: YColor = new YColor(false, 0xFF, 0x00, 0xBF, 0xFF, true);
    public static readonly DimGray: YColor = new YColor(false, 0xFF, 0x69, 0x69, 0x69, true);
    public static readonly DodgerBlue: YColor = new YColor(false, 0xFF, 0x1E, 0x90, 0xFF, true);
    public static readonly Firebrick: YColor = new YColor(false, 0xFF, 0xB2, 0x22, 0x22, true);
    public static readonly FloralWhite: YColor = new YColor(false, 0xFF, 0xFF, 0xFA, 0xF0, true);
    public static readonly ForestGreen: YColor = new YColor(false, 0xFF, 0x22, 0x8B, 0x22, true);
    public static readonly Fuchsia: YColor = new YColor(false, 0xFF, 0xFF, 0x00, 0xFF, true);
    public static readonly Gainsboro: YColor = new YColor(false, 0xFF, 0xDC, 0xDC, 0xDC, true);
    public static readonly GhostWhite: YColor = new YColor(false, 0xFF, 0xF8, 0xF8, 0xFF, true);
    public static readonly Gold: YColor = new YColor(false, 0xFF, 0xFF, 0xD7, 0x00, true);
    public static readonly Goldenrod: YColor = new YColor(false, 0xFF, 0xDA, 0xA5, 0x20, true);
    public static readonly Gray: YColor = new YColor(false, 0xFF, 0x80, 0x80, 0x80, true);
    public static readonly Green: YColor = new YColor(false, 0xFF, 0x00, 0x80, 0x00, true);
    public static readonly GreenYellow: YColor = new YColor(false, 0xFF, 0xAD, 0xFF, 0x2F, true);
    public static readonly Honeydew: YColor = new YColor(false, 0xFF, 0xF0, 0xFF, 0xF0, true);
    public static readonly HotPink: YColor = new YColor(false, 0xFF, 0xFF, 0x69, 0xB4, true);
    public static readonly IndianRed: YColor = new YColor(false, 0xFF, 0xCD, 0x5C, 0x5C, true);
    public static readonly Indigo: YColor = new YColor(false, 0xFF, 0x4B, 0x00, 0x82, true);
    public static readonly Ivory: YColor = new YColor(false, 0xFF, 0xFF, 0xFF, 0xF0, true);
    public static readonly Khaki: YColor = new YColor(false, 0xFF, 0xF0, 0xE6, 0x8C, true);
    public static readonly Lavender: YColor = new YColor(false, 0xFF, 0xE6, 0xE6, 0xFA, true);
    public static readonly LavenderBlush: YColor = new YColor(false, 0xFF, 0xFF, 0xF0, 0xF5, true);
    public static readonly LawnGreen: YColor = new YColor(false, 0xFF, 0x7C, 0xFC, 0x00, true);
    public static readonly LemonChiffon: YColor = new YColor(false, 0xFF, 0xFF, 0xFA, 0xCD, true);
    public static readonly LightBlue: YColor = new YColor(false, 0xFF, 0xAD, 0xD8, 0xE6, true);
    public static readonly LightCoral: YColor = new YColor(false, 0xFF, 0xF0, 0x80, 0x80, true);
    public static readonly LightCyan: YColor = new YColor(false, 0xFF, 0xE0, 0xFF, 0xFF, true);
    public static readonly LightGoldenrodYellow: YColor = new YColor(false, 0xFF, 0xFA, 0xFA, 0xD2, true);
    public static readonly LightGray: YColor = new YColor(false, 0xFF, 0xD3, 0xD3, 0xD3, true);
    public static readonly LightGreen: YColor = new YColor(false, 0xFF, 0x90, 0xEE, 0x90, true);
    public static readonly LightPink: YColor = new YColor(false, 0xFF, 0xFF, 0xB6, 0xC1, true);
    public static readonly LightSalmon: YColor = new YColor(false, 0xFF, 0xFF, 0xA0, 0x7A, true);
    public static readonly LightSeaGreen: YColor = new YColor(false, 0xFF, 0x20, 0xB2, 0xAA, true);
    public static readonly LightSkyBlue: YColor = new YColor(false, 0xFF, 0x87, 0xCE, 0xFA, true);
    public static readonly LightSlateGray: YColor = new YColor(false, 0xFF, 0x77, 0x88, 0x99, true);
    public static readonly LightSteelBlue: YColor = new YColor(false, 0xFF, 0xB0, 0xC4, 0xDE, true);
    public static readonly LightYellow: YColor = new YColor(false, 0xFF, 0xFF, 0xFF, 0xE0, true);
    public static readonly Lime: YColor = new YColor(false, 0xFF, 0x00, 0xFF, 0x00, true);
    public static readonly LimeGreen: YColor = new YColor(false, 0xFF, 0x32, 0xCD, 0x32, true);
    public static readonly Linen: YColor = new YColor(false, 0xFF, 0xFA, 0xF0, 0xE6, true);
    public static readonly Magenta: YColor = new YColor(false, 0xFF, 0xFF, 0x00, 0xFF, true);
    public static readonly Maroon: YColor = new YColor(false, 0xFF, 0x80, 0x00, 0x00, true);
    public static readonly MediumAquamarine: YColor = new YColor(false, 0xFF, 0x66, 0xCD, 0xAA, true);
    public static readonly MediumBlue: YColor = new YColor(false, 0xFF, 0x00, 0x00, 0xCD, true);
    public static readonly MediumOrchid: YColor = new YColor(false, 0xFF, 0xBA, 0x55, 0xD3, true);
    public static readonly MediumPurple: YColor = new YColor(false, 0xFF, 0x93, 0x70, 0xDB, true);
    public static readonly MediumSeaGreen: YColor = new YColor(false, 0xFF, 0x3C, 0xB3, 0x71, true);
    public static readonly MediumSlateBlue: YColor = new YColor(false, 0xFF, 0x7B, 0x68, 0xEE, true);
    public static readonly MediumSpringGreen: YColor = new YColor(false, 0xFF, 0x00, 0xFA, 0x9A, true);
    public static readonly MediumTurquoise: YColor = new YColor(false, 0xFF, 0x48, 0xD1, 0xCC, true);
    public static readonly MediumVioletRed: YColor = new YColor(false, 0xFF, 0xC7, 0x15, 0x85, true);
    public static readonly MidnightBlue: YColor = new YColor(false, 0xFF, 0x19, 0x19, 0x70, true);
    public static readonly MintCream: YColor = new YColor(false, 0xFF, 0xF5, 0xFF, 0xFA, true);
    public static readonly MistyRose: YColor = new YColor(false, 0xFF, 0xFF, 0xE4, 0xE1, true);
    public static readonly Moccasin: YColor = new YColor(false, 0xFF, 0xFF, 0xE4, 0xB5, true);
    public static readonly NavajoWhite: YColor = new YColor(false, 0xFF, 0xFF, 0xDE, 0xAD, true);
    public static readonly Navy: YColor = new YColor(false, 0xFF, 0x00, 0x00, 0x80, true);
    public static readonly OldLace: YColor = new YColor(false, 0xFF, 0xFD, 0xF5, 0xE6, true);
    public static readonly Olive: YColor = new YColor(false, 0xFF, 0x80, 0x80, 0x00, true);
    public static readonly OliveDrab: YColor = new YColor(false, 0xFF, 0x6B, 0x8E, 0x23, true);
    public static readonly Orange: YColor = new YColor(false, 0xFF, 0xFF, 0xA5, 0x00, true);
    public static readonly OrangeRed: YColor = new YColor(false, 0xFF, 0xFF, 0x45, 0x00, true);
    public static readonly Orchid: YColor = new YColor(false, 0xFF, 0xDA, 0x70, 0xD6, true);
    public static readonly PaleGoldenrod: YColor = new YColor(false, 0xFF, 0xEE, 0xE8, 0xAA, true);
    public static readonly PaleGreen: YColor = new YColor(false, 0xFF, 0x98, 0xFB, 0x98, true);
    public static readonly PaleTurquoise: YColor = new YColor(false, 0xFF, 0xAF, 0xEE, 0xEE, true);
    public static readonly PaleVioletRed: YColor = new YColor(false, 0xFF, 0xDB, 0x70, 0x93, true);
    public static readonly PapayaWhip: YColor = new YColor(false, 0xFF, 0xFF, 0xEF, 0xD5, true);
    public static readonly PeachPuff: YColor = new YColor(false, 0xFF, 0xFF, 0xDA, 0xB9, true);
    public static readonly Peru: YColor = new YColor(false, 0xFF, 0xCD, 0x85, 0x3F, true);
    public static readonly Pink: YColor = new YColor(false, 0xFF, 0xFF, 0xC0, 0xCB, true);
    public static readonly Plum: YColor = new YColor(false, 0xFF, 0xDD, 0xA0, 0xDD, true);
    public static readonly PowderBlue: YColor = new YColor(false, 0xFF, 0xB0, 0xE0, 0xE6, true);
    public static readonly Purple: YColor = new YColor(false, 0xFF, 0x80, 0x00, 0x80, true);
    public static readonly Red: YColor = new YColor(false, 0xFF, 0xFF, 0x00, 0x00, true);
    public static readonly RosyBrown: YColor = new YColor(false, 0xFF, 0xBC, 0x8F, 0x8F, true);
    public static readonly RoyalBlue: YColor = new YColor(false, 0xFF, 0x41, 0x69, 0xE1, true);
    public static readonly SaddleBrown: YColor = new YColor(false, 0xFF, 0x8B, 0x45, 0x13, true);
    public static readonly Salmon: YColor = new YColor(false, 0xFF, 0xFA, 0x80, 0x72, true);
    public static readonly SandyBrown: YColor = new YColor(false, 0xFF, 0xF4, 0xA4, 0x60, true);
    public static readonly SeaGreen: YColor = new YColor(false, 0xFF, 0x2E, 0x8B, 0x57, true);
    public static readonly SeaShell: YColor = new YColor(false, 0xFF, 0xFF, 0xF5, 0xEE, true);
    public static readonly Sienna: YColor = new YColor(false, 0xFF, 0xA0, 0x52, 0x2D, true);
    public static readonly Silver: YColor = new YColor(false, 0xFF, 0xC0, 0xC0, 0xC0, true);
    public static readonly SkyBlue: YColor = new YColor(false, 0xFF, 0x87, 0xCE, 0xEB, true);
    public static readonly SlateBlue: YColor = new YColor(false, 0xFF, 0x6A, 0x5A, 0xCD, true);
    public static readonly SlateGray: YColor = new YColor(false, 0xFF, 0x70, 0x80, 0x90, true);
    public static readonly Snow: YColor = new YColor(false, 0xFF, 0xFF, 0xFA, 0xFA, true);
    public static readonly SpringGreen: YColor = new YColor(false, 0xFF, 0x00, 0xFF, 0x7F, true);
    public static readonly SteelBlue: YColor = new YColor(false, 0xFF, 0x46, 0x82, 0xB4, true);
    public static readonly Tan: YColor = new YColor(false, 0xFF, 0xD2, 0xB4, 0x8C, true);
    public static readonly Teal: YColor = new YColor(false, 0xFF, 0x00, 0x80, 0x80, true);
    public static readonly Thistle: YColor = new YColor(false, 0xFF, 0xD8, 0xBF, 0xD8, true);
    public static readonly Tomato: YColor = new YColor(false, 0xFF, 0xFF, 0x63, 0x47, true);
    public static readonly Transparent: YColor = new YColor(false, 0x00, 0xFF, 0xFF, 0xFF, true);
    public static readonly Turquoise: YColor = new YColor(false, 0xFF, 0x40, 0xE0, 0xD0, true);
    public static readonly Violet: YColor = new YColor(false, 0xFF, 0xEE, 0x82, 0xEE, true);
    public static readonly Wheat: YColor = new YColor(false, 0xFF, 0xF5, 0xDE, 0xB3, true);
    public static readonly White: YColor = new YColor(false, 0xFF, 0xFF, 0xFF, 0xFF, true);
    public static readonly WhiteSmoke: YColor = new YColor(false, 0xFF, 0xF5, 0xF5, 0xF5, true);
    public static readonly Yellow: YColor = new YColor(false, 0xFF, 0xFF, 0xFF, 0x00, true);
    public static readonly YellowGreen: YColor = new YColor(false, 0xFF, 0x9A, 0xCD, 0x32, true);

    private isHSLColor: boolean
    private _isPredefined: boolean;
    private hslConvertionDone: boolean = false;
    private rgbConvertionDone: boolean = false;
    private transparency: number = 0;
    private r: number = 0;
    private g: number = 0;
    private b: number = 0;
    private h: number = 0;
    private s: number = 0;
    private l: number = 0;
    private _name: string = "";

    public get name(): string {return this._name; }
    private set predefname(value: string) { this._name = value; }

    private static _predefinedColors: { [name: string]: YColor } | null = null;

    static get predefinedColors(): { [name: string]: YColor }
    {
        if (YColor._predefinedColors == null)
        {
            YColor._predefinedColors = {};
            let names: string[] = Object.getOwnPropertyNames(YColor)
            for (let i: number = 0; i < names.length; i++)
            {
                if ((<any>YColor)[names[i]] instanceof YColor)
                {
                    YColor._predefinedColors[names[i]] = (<any>YColor)[names[i]];
                    YColor._predefinedColors[names[i]].predefname = names[i];
                }
            }
        }
        return YColor._predefinedColors;
    }

    static FromString(value: string): YColor | null
    {
        let valueUpper: string = value.toUpperCase();
        let propNames: string [] = Object.getOwnPropertyNames(YColor)

        for (let i: number = 0; i < propNames.length; i++)
        {
            if (propNames[i].toUpperCase() == valueUpper)
            {
                if ((<any>YColor)[propNames[i]] instanceof YColor)
                {
                    return (<any>YColor)[propNames[i]];
                    //let o: object = Reflect.get(YColor, value);
                    //if (o instanceof YColor) return o as YColor;
                }
            }
        }

        if ((value.length == 7) && (value.substr(0, 1).toUpperCase() == '#'))
        {
            let r: number = parseInt(value.substr(1, 2), 16);
            let g: number = parseInt(value.substr(3, 2), 16);
            let b: number = parseInt(value.substr(5, 2), 16);
            return new YColor(false, 255, r, g, b);
        }

        if (value.length == 12)
        {
            if (value.substr(0, 4).toUpperCase() == 'RGB:')
            {
                let alpha: number = parseInt(value.substr(4, 2), 16);
                let r: number = parseInt(value.substr(6, 2), 16);
                let g: number = parseInt(value.substr(8, 2), 16);
                let b: number = parseInt(value.substr(10, 2), 16);
                return new YColor(false, alpha, r, g, b);
            }
            else if (value.substr(0, 4).toUpperCase() == 'HSL:')
            {
                let alpha: number = parseInt(value.substr(4, 2), 16);
                let h: number = parseInt(value.substr(6, 2), 16);
                let s: number = parseInt(value.substr(8, 2), 16);
                let l: number = parseInt(value.substr(10, 2), 16);
                return new YColor(true, alpha, h, s, l);
            }
        }

        return null;

        // return   YColor.Black;  // unknown color, sorry
    }

    private static hex(v: number): string
    {
        let s: string = v.toString(16);
        if (s.length <= 1) return "0" + s;
        return s;

    }

    public toString(): string
    {
        if (this.isHSLColor)
        {
            return "HSL:" + (YColor.hex(this.transparency) + YColor.hex(this.h) + YColor.hex(this.s) + YColor.hex(this.l)).toUpperCase();
        }
        else
        { // might need some optimization
            let propNames: string [] = Object.getOwnPropertyNames(YColor)
            for (let i: number = 0; i < propNames.length; i++)
            {
                let o: object = Reflect.get(YColor, propNames[i]);
                let c: YColor = o as YColor
                if ((c.alpha == this.alpha) && (c.red == this.red) && (c.green == this.green) && (c.blue == this.blue)) return propNames[i];
            }

        }
        return "RGB:" + (YColor.hex(this.transparency) + YColor.hex(this.r) + YColor.hex(this.g) + YColor.hex(this.b)).toUpperCase();
    }

    get svgCode(): string { return "rgb(" + this.r.toString() + ", " + this.g.toString() + ", " + this.b.toString() + ")"; }

    get alphaCode(): string { return (this.transparency / 255.0).toFixed(3); }

    private static hsl2rgbInt(temp1: number, temp2: number, temp3: number): number
    {
        if (temp3 >= 170) return ((temp1 + 127) / 255) >> 0;
        if (temp3 > 42)
        {
            if (temp3 <= 127) return ((temp2 + 127) / 255) >> 0;
            temp3 = 170 - temp3;
        }
        return ((temp1 * 255 + (temp2 - temp1) * (6 * temp3) + 32512) / 65025) >> 0;
    }

    private hsl2rgb(): void
    {

        let temp1: number;
        let temp2: number;
        let temp3: number;

        this.rgbConvertionDone = true;

        if (this.s == 0)
        {
            this.r = this.l;
            this.g = this.l;
            this.b = this.l;

            return
        }
        if (this.l <= 127)
        {
            temp2 = this.l * (255 + this.s);
        }
        else
        {
            temp2 = (this.l + this.s) * (255) - this.l * this.s;
        }

        temp1 = (510) * this.l - temp2;

        // R
        temp3 = (this.h + 85);
        if (temp3 > 255) temp3 = temp3 - 255;
        this.r = YColor.hsl2rgbInt(temp1, temp2, temp3);

        // G
        temp3 = this.h;
        if (temp3 > 255) temp3 = temp3 - 255;
        this.g = YColor.hsl2rgbInt(temp1, temp2, temp3);

        // B
        if (this.h >= 85)
        {
            temp3 = this.h - 85;
        }
        else
        {
            temp3 = this.h + 170;
        }
        this.b = YColor.hsl2rgbInt(temp1, temp2, temp3);

        if (this.r > 255) this.r = 255;  // just in case
        if (this.g > 255) this.g = 255;
        if (this.b > 255) this.b = 255;

    }

    private computeHSL(): void
    {
        let R = this.r;
        let G = this.g;
        let B = this.b;
        let H: number;
        let S: number;
        let L: number;
        let max: number = (R > G ? R : G);
        let min: number = (R < G ? R : G);
        let correction: number = 0;
        let divisor: number = 0;
        this.hslConvertionDone = true;
        if (B > max) max = B;
        if (B < min) min = B;

        L = ((max + min + 1) / 2) >> 0;
        if (max == min)
        {
            this.h = 0;
            this.s = 0;
            this.l = L;
            return;
        }

        correction = ((max + min) / 2) >> 0;

        if (L <= 127)
        {
            S = ((255 * (max - min) + correction) / (max + min)) >> 0;
        }
        else
        {
            S = ((255 * (max - min) + 255 - correction) / (510 - (max + min))) >> 0;
        }

        correction = 3 * (max - min);
        divisor = 2 * correction;

        if (R == max)
        {
            H = 0;
            R = G;
            G = B;
        }
        else if (G == max)
        {
            H = 85;
            G = R;
            R = B;
        }
        else
        { H = 170; }
        if (R >= G)
        {
            H += ((255 * (R - G) + correction) / divisor) >> 0;
        }
        else
        {
            H += 255 - ((255 * (G - R) - correction) / divisor) >> 0;
        }

        if (H > 255) H -= 255;
        if (S > 255) S = 255; // just in case
        if (L > 255) L = 255;

        this.h = H;
        this.s = S;
        this.l = L;

    }

    public get hue(): number
    {
        if (!this.hslConvertionDone) this.computeHSL();
        return this.h;
    }

    public get saturation(): number
    {
        if (!this.hslConvertionDone) this.computeHSL();
        return this.s;
    }

    public get luminosity(): number
    {
        if (!this.hslConvertionDone) this.computeHSL();
        return this.l;
    }

    public get red(): number
    {
        if (!this.rgbConvertionDone) this.hsl2rgb();
        return this.r;
    }

    public get green(): number
    {
        if (!this.rgbConvertionDone) this.hsl2rgb();
        return this.g;
    }

    public get blue(): number
    {
        if (!this.rgbConvertionDone) this.hsl2rgb();
        return this.b;
    }

    public get alpha(): number
    {
        return this.transparency;
    }

    static FromArgb(a: number, r: number, g: number, b: number): YColor
    {
        return new YColor(false, a, r, g, b);

    }

    static FromAhsl(a: number, h: number, s: number, l: number): YColor
    {
        return new YColor(true, a, h, s, l);

    }

    public get isHSL(): boolean { return this.isHSLColor;}
    public get isRGB(): boolean { return !this.isHSLColor;}

    public equal(c: YColor)
    {
        if (this.isHSLColor)
        {
            if (!c.isHSLColor) return false;
            if (c.hue != this.hue) return false;
            if (c.saturation != this.saturation) return false;
            if (c.luminosity != this.luminosity) return false;
            if (c.alpha != this.alpha) return false;
        }
        else
        {
            if (c.isHSLColor) return false;
            if (c.red != this.red) return false;
            if (c.green != this.green) return false;
            if (c.blue != this.blue) return false;
            if (c.alpha != this.alpha) return false;
        }
        return true;
    }

    public clone(): YColor
    {
        if (this.isHSLColor) return new YColor(true, this.transparency, this.h, this.s, this.l, this.isPredefined);
        return new YColor(false, this.transparency, this.r, this.g, this.b, this.isPredefined);
    }

    public get isPredefined(): boolean {return this._isPredefined;}

    constructor(isHsl: boolean, transparency: number, r_h: number, g_s: number, b_l: number, isPredefined?: boolean)
    {
        this.hslConvertionDone = isHsl;
        this.isHSLColor = isHsl;
        this.transparency = transparency;
        this._isPredefined = isPredefined === true;
        if (isHsl)
        {
            this.h = r_h;
            this.s = g_s;
            this.l = b_l;
            this.hsl2rgb();
        }
        else
        {
            this.r = r_h;
            this.g = g_s;
            this.b = b_l;
            this.rgbConvertionDone = true;
        }
        this._htmlcode = this.computeHTMLCode();
    }

    private computeHTMLCode(): string
    {
        let a: number = this.transparency / 255;
        let r: number = this.r;
        let g: number = this.g;
        let b: number = this.b;
        return "rgba(" + r + "," + g + "," + b + "," + a.toFixed(3) + ")";
    }

    private _htmlcode: string = this.computeHTMLCode();

    public get htmlCode(): string {return this._htmlcode; }

}

export abstract class YBrush
{
    private _color: YColor;
    private _noAntiAlias = false;

    constructor(c: YColor, disableAntialias?: boolean)
    {
        this._color = c;
        if (typeof (disableAntialias) != "undefined")
        {
            this._noAntiAlias = disableAntialias;
        }
    }
    public get noAntiAlias(): boolean {return this._noAntiAlias}
    public get color(): YColor {return this._color}

}

export class YSolidBrush extends YBrush
{

}

export class YLinearGradientBrush extends YBrush
{
    private _color1: YColor;
    private _color2: YColor;

    constructor(c1: YColor, c2: YColor)
    {
        super(c1);
        this._color1 = c1;
        this._color2 = c2;

    }

    public get color1(): YColor {return this._color1}

    public get color2(): YColor {return this._color2}
}

export class YPen
{
    private _thickness: number = 1.0;
    private _color = YColor.Black;
    private _noAntiAlias = false;

    constructor(color: YColor, thickness: number, disableAntialias?: boolean)
    {
        this._thickness = thickness;
        this._color = thickness > 0 ? color : YColor.Transparent;
        if (typeof (disableAntialias) != "undefined")
        {
            this._noAntiAlias = disableAntialias;
        }

    }

    public get noAntiAlias(): boolean {return this._noAntiAlias}
    public get lineWidth(): number { return this._thickness;}

    public get strokeStyle(): string {return this._color.htmlCode;}

    public get color(): YColor {return this._color;}

    private _startCap = YPen.LineCap.Square;
    public set startCap(value: YPen.LineCap) {this._startCap = value; }

    private _endCap = YPen.LineCap.Square;
    public set endCap(value: YPen.LineCap) {this._endCap = value; }

    private _linejoin = YPen.LineJoin.Miter;
    public set linejoin(value: YPen.LineJoin) {this._linejoin = value; }

}

export namespace YPen
{
    export const enum LineCap
    {
        Flat = 0, Square = 1, Round = 2, Triangle = 3, NoAnchor = 16, SquareAnchor = 17,
        RoundAnchor = 18, DiamondAnchor = 19, ArrowAnchor = 20, AnchorMask = 240, Custom = 255
    }

    export enum LineJoin { Miter = 0, Bevel = 1, Round = 2, MiterClipped = 3 }
}

export class YRectangle
{
    x: number;
    y: number;
    w: number;
    h: number;

    constructor(x: number, y: number, w: number, h: number)
    {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

}

export interface RendererDblClickCallBack {(event: object): void}

export interface RendererRightClickCallBack {(event: object): void}

export class Point
{
    public X: number;
    public Y: number;

    constructor(valueX: number, valueY: number)
    {
        this.X = valueX >> 0;
        this.Y = valueY >> 0;
    }

}

export class PointF
{
    public X: number;
    public Y: number;

    constructor(valueX: number, valueY: number)
    {
        this.X = valueX;
        this.Y = valueY;
    }

}

export class captureParametersSet
{
    public captureType: YDataRenderer.CaptureTypeEnumItem = YDataRenderer.CaptureType.SVG;

    public captureFolder: string = "/"; //Environment.GetFolderPath(Environment.SpecialFolder.MyPictures);
    public captureWidth: number = 1024;
    public captureHeight: number = 1024;
    public captureDPI: number = 96;
}

export interface getCaptureParamaters {(source: YDataRenderer, p: captureParametersSet): void}

export abstract class GenericPanel
{

    private _userData: any = null;
    get userData(): object { return this._userData; }

    set userData(value: object) { this._userData = value; }

    protected _parentRenderer: YDataRenderer;

    private _directParent: object;
    get directParent(): object { return this._directParent; }

    protected constructor(parent: YDataRenderer, directParent: object)
    {
        this._directParent = directParent;
        this._parentRenderer = parent;
        this._font = new YFont(parent, this, 8, null);
    }

    protected _enabled: boolean = false;
    get enabled(): boolean
    {
        return this._enabled;
    }

    set enabled(value: boolean)
    {
        if (this._enabled != value)
        {
            this._enabled = value;
            this._parentRenderer.clearCachedObjects();
            this._parentRenderer.redraw();

        }
    }

    private _panelTextAlign: GenericPanel.TextAlignEnumItem = GenericPanel.TextAlign.LEFT;
    get panelTextAlign(): GenericPanel.TextAlignEnumItem {return this._panelTextAlign; }

    set panelTextAlign(value: GenericPanel.TextAlignEnumItem)
    {
        this._panelTextAlign = value;
        if (this._enabled) this._parentRenderer.redraw();
    }

    private _text: string = "";
    get text(): string {return this._text; }

    set text(value: string)
    {
        this._text = value;
        this._parentRenderer.clearCachedObjects();
        if (this._enabled) this._parentRenderer.redraw();
    }

    private _bgColor: YColor = new YColor(false, 255, 255, 255, 192)
    get bgColor(): YColor { return this._bgColor; }

    set bgColor(value: YColor)
    {
        this._bgColor = value;
        this._bgBrush = null;
        if (this._enabled) this._parentRenderer.redraw();
    }

    private _borderColor: YColor = YColor.Black;
    get borderColor(): YColor { return this._borderColor; }

    set borderColor(value: YColor)
    {
        this._borderColor = value;
        this._pen = null;
        if (this._enabled) this._parentRenderer.redraw();
    }

    private _borderthickness: number = 1.0;
    get borderthickness(): number {return this._borderthickness;}

    set borderthickness(value: number)
    {
        if (value < 0) throw "Border thickness must be a positive value";
        this._borderthickness = value;
        this._parentRenderer.clearCachedObjects();
        this._pen = null;
        if (this._enabled) this._parentRenderer.redraw();
    }

    private _padding: number = 10;
    get padding(): number { return this._padding;}

    set padding(value: number)
    {
        if (value < 0) throw new RangeError("Padding must be a positive value");
        this._padding = value;
        this._parentRenderer.clearCachedObjects();
        if (this._enabled) this._parentRenderer.redraw();
    }

    private _verticalMargin: number = 10;
    get verticalMargin() {return this._verticalMargin;}

    set verticalMargin(value: number)
    {
        this._verticalMargin = value;
        if (this._enabled) this._parentRenderer.redraw();
    }

    private _horizontalMargin: number = 10;
    get horizontalMargin() {return this._horizontalMargin; }

    set horizontalMargin(value: number)
    {
        this._horizontalMargin = value;
        if (this._enabled) this._parentRenderer.redraw();
    }

    private _bgBrush: YBrush | null = null;
    get bgBrush(): YBrush
    {
        if (this._bgBrush == null) this._bgBrush = new YSolidBrush(this._bgColor);
        return this._bgBrush;
    }

    private _pen: YPen | null = null;
    get pen(): YPen
    {
        if (this._pen == null)
        {
            this._pen = new YPen(this._borderColor, this._borderthickness, true);
        }
        return this._pen;
    }

    private _font: YFont | null = null;
    get font(): YFont { return <YFont>this._font; }

}

export namespace GenericPanel
{

    export class HorizontalAlignPosEnumItem extends YEnumItem
    {
        constructor(value: any, humanreadable: string, container?: object)
        {
            super(value, humanreadable, HorizontalAlignPos)

        }
    }

    export class HorizontalAlignPos extends YEnum
    {
        public static readonly LEFT: HorizontalAlignPosEnumItem = new HorizontalAlignPosEnumItem("LEFT", "Left");
        public static readonly CENTER: HorizontalAlignPosEnumItem = new HorizontalAlignPosEnumItem("CENTER", "Center");
        public static readonly RIGHT: HorizontalAlignPosEnumItem = new HorizontalAlignPosEnumItem("RIGHT", "Right");
    }

    export class VerticalAlignPosEnumItem extends YEnumItem
    {
        constructor(value: any, humanreadable: string, container?: object)
        {
            super(value, humanreadable, VerticalAlignPos)

        }
    }

    export class VerticalAlignPos extends YEnum
    {
        public static readonly TOP: VerticalAlignPosEnumItem = new VerticalAlignPosEnumItem("TOP", "Top");
        public static readonly CENTER: VerticalAlignPosEnumItem = new VerticalAlignPosEnumItem("CENTER", "Center");
        public static readonly BOTTOM: VerticalAlignPosEnumItem = new VerticalAlignPosEnumItem("BOTTOM", "Bottom");
    }

    export class TextAlignEnumItem extends YEnumItem
    {
        constructor(value: any, humanreadable: string, container?: object)
        {
            super(value, humanreadable, TextAlign)

        }
    }

    export class TextAlign extends YEnum
    {
        public static readonly LEFT: TextAlignEnumItem = new TextAlignEnumItem("LEFT", "Left");
        public static readonly CENTER: TextAlignEnumItem = new TextAlignEnumItem("CENTER", "Center");
        public static readonly RIGHT: TextAlignEnumItem = new TextAlignEnumItem("RIGHT", "Right");

    }

}

export class MessagePanel extends GenericPanel
{
    constructor(parent: YDataRenderer, directParent: object)
    { super(parent, directParent)}

    private _panelHrzAlign: GenericPanel.HorizontalAlignPosEnumItem = GenericPanel.HorizontalAlignPos.CENTER;
    get panelHrzAlign(): GenericPanel.HorizontalAlignPosEnumItem {return this._panelHrzAlign;}
    set panelHrzAlign(value: GenericPanel.HorizontalAlignPosEnumItem)
    {
        this._panelHrzAlign = value;
        if (this._enabled) this._parentRenderer.redraw();
    }

    private _panelVrtAlign: GenericPanel.VerticalAlignPosEnumItem = GenericPanel.VerticalAlignPos.CENTER;
    get panelVrtAlign(): GenericPanel.VerticalAlignPosEnumItem { return this._panelVrtAlign; }
    set panelVrtAlign(value: GenericPanel.VerticalAlignPosEnumItem)
    {
        this._panelVrtAlign = value;
        if (this._enabled) this._parentRenderer.redraw();
    }
}

export class AnnotationPanel extends GenericPanel
{

    constructor(parent: YDataRenderer, directParent: object)
    { super(parent, directParent)}

    private _overlap: boolean = false;
    get overlap(): boolean {return this._overlap; }

    set overlap(value: boolean)
    {
        if ((!value) && (this._panelHrzAlign == GenericPanel.HorizontalAlignPos.CENTER) && (this._panelVrtAlign == GenericPanel.VerticalAlignPos.CENTER))
        {
            this._panelVrtAlign = GenericPanel.VerticalAlignPos.TOP;

        }
        this._overlap = value;
        this._parentRenderer.clearCachedObjects();
        this._parentRenderer.redraw();
    }

    private _positionOffsetX: number = 50;
    get positionOffsetX(): number {return this._positionOffsetX; }

    set positionOffsetX(value: number)
    {
        this._positionOffsetX = value;
        this._parentRenderer.clearCachedObjects();
        if (this._enabled) this._parentRenderer.redraw();
    }

    private _positionOffsetY: number = 50;
    get positionOffsetY(): number { return this._positionOffsetY; }

    set positionOffsetY(value: number)
    {
        this._positionOffsetY = value;
        this._parentRenderer.clearCachedObjects();
        if (this._enabled) this._parentRenderer.redraw();
    }

    private _panelHrzAlign: GenericPanel.HorizontalAlignPos = GenericPanel.HorizontalAlignPos.CENTER;
    get panelHrzAlign(): GenericPanel.HorizontalAlignPos {return this._panelHrzAlign; }

    set panelHrzAlign(value: GenericPanel.HorizontalAlignPos)
    {
        if ((!this._overlap) && (value == GenericPanel.HorizontalAlignPos.CENTER) && (this._panelVrtAlign == GenericPanel.VerticalAlignPos.CENTER))
        {
            this._panelVrtAlign = GenericPanel.VerticalAlignPos.TOP;
        }
        this._panelHrzAlign = value;
        this._parentRenderer.clearCachedObjects();
        if (this._enabled) this._parentRenderer.redraw();
    }

    private _panelVrtAlign: GenericPanel.VerticalAlignPos = GenericPanel.VerticalAlignPos.TOP;
    get panelVrtAlign(): GenericPanel.VerticalAlignPos { return this._panelVrtAlign; }

    set panelVrtAlign(value: GenericPanel.VerticalAlignPos)
    {
        if ((!this._overlap) && (value == GenericPanel.VerticalAlignPos.CENTER) && (this._panelHrzAlign == GenericPanel.HorizontalAlignPos.CENTER))
        {
            this._panelHrzAlign = GenericPanel.HorizontalAlignPos.RIGHT;
        }
        this._panelVrtAlign = value;
        this._parentRenderer.clearCachedObjects();
        if (this._enabled) this._parentRenderer.redraw();
    }

}

export class Zone
{

    protected _parentRenderer: YDataRenderer;
    private _directParent: object;
    get directParent(): object {return this._directParent; }

    private _userData: any = null;
    get userData(): object { return this._userData; }

    set userData(value: object) { this._userData = value; }

    protected resetCache(): void { }

    constructor(parentRenderer: YDataRenderer, directParent: object)
    {
        this._directParent = directParent;
        this._parentRenderer = parentRenderer;
    }

    private _zoneBrush: YBrush | null = null;
    get zoneBrush(): YBrush
    {
        if (this._zoneBrush == null) this._zoneBrush = new YSolidBrush(this._color);
        return this._zoneBrush;
    }

    private _color: YColor = YColor.Red;
    get color(): YColor { return this._color;}

    set color(value: YColor)
    {
        this._color = value;
        this._zoneBrush = null;
        if (this.visible) this._parentRenderer.redraw();
    }

    private _visible: boolean = false;
    get visible(): boolean { return this._visible; }

    set visible(value: boolean)
    {
        this._visible = value;
        this._parentRenderer.redraw();
    }

    public set_minMax(min: number, max: number): void
    {
        if (min > max) throw new RangeError("Min cannot be greater than max ");
        this._min = min;
        this._max = max;
        this.resetCache();
        if (this.visible) this._parentRenderer.redraw();

    }

    private _min: number = 0;
    get min(): number {return this._min; }

    set min(value: number)
    {
        if ((value >= this._max) && !YDataRenderer.minMaxCheckDisabled)
        {
            throw new RangeError("Min cannot be greater than max (" + this._max.toString() + ")");
        }
        this._min = value;
        this.resetCache();
        if (this.visible) this._parentRenderer.redraw();
    }

    private _max: number = 100;
    get max(): number { return this._max;}

    set max(value: number)
    {
        if ((value <= this._min) && !YDataRenderer.minMaxCheckDisabled)
        {
            throw new RangeError("Max cannot be greater than min (" + this._min.toString() + ")");
        }
        this._max = value;
        this.resetCache();
        if (this.visible) this._parentRenderer.redraw();
    }

}

export class Proportional
{

    private _reset: ResetCallBack | null = null;
    private _parentRenderer: YDataRenderer;
    private _directParent: object;
    private _refWidth: number = 1;
    private _refHeight: number = 1;
    private _refValue: number = 1;
    private _value: number;
    private valueStack: number[] = [];
    private _resizeRule: Proportional.ResizeRuleEnumItem = Proportional.ResizeRule.FIXED

    private _userData: any = null;
    get userData(): any {return this._userData;}

    set userData(value: any) {this._userData = value; }

    get directParent() { return this._directParent; }

    get value(): number { return this._value;}

    set value(v: number)
    {
        this._value = v;
        this.set_refPoint();
        if (this._reset != null) this._reset(this);
    }

    get resizeRule(): Proportional.ResizeRuleEnumItem {return this._resizeRule;}

    set resizeRule(value: Proportional.ResizeRuleEnumItem)
    {
        this.set_refPoint();
        this._resizeRule = value;
    }

    private set_refPoint(): void
    {
        this._refWidth = Math.max(1, this._parentRenderer.usableUiWidth());
        this._refHeight = Math.max(1, this._parentRenderer.usableUiHeight());
        this._refValue = this._value;
    }

    constructor(value: number, resizeRule: Proportional.ResizeRuleEnumItem, parentRenderer: YDataRenderer, directParent: Object, resetCallBack: ResetCallBack)
    {
        this._reset = resetCallBack;
        this._parentRenderer = parentRenderer;
        this._value = value;
        this._resizeRule = resizeRule;
        this._directParent = directParent;
        this.set_refPoint();
        this._parentRenderer.AddNewProportionalToSizeValue(this);

    }

    public containerResizedPushNewCoef(coef: number): void
    {
        this.valueStack.push(this._value);
        this._value = Math.round(100 * this._refValue * coef) / 100;
        if (this._reset != null) this._reset(this);
    }

    public containerResizedPop(): void
    {
        if (this.valueStack.length <= 0) throw new RangeError("Can't pop, empty stack.");
        this._value = <number>this.valueStack.pop();
        if (this._reset != null) this._reset(this);
    }

    static resizeCoef(rule: Proportional.ResizeRuleEnumItem, refWidth: number, refHeight: number, newWidth: number, newHeight: number): number
    {

        switch (rule)
        {
        case Proportional.ResizeRule.RELATIVETOWIDTH:
            return newWidth / refWidth;
        case Proportional.ResizeRule.RELATIVETOHEIGHT:
            return newHeight / refHeight;
        case Proportional.ResizeRule.RELATIVETOBOTH:
            return Math.min(newHeight / refHeight, newWidth / refWidth); // original
        }
        return 1.0;
    }

    public containerResized(newWidth: number, newHeight: number): void
    {
        this._value = Math.round(100 * this._refValue * Proportional.resizeCoef(this._resizeRule, this._refWidth, this._refHeight, newWidth, newHeight)) / 100;
        if (this._reset != null) this._reset(this);
    }

    public forceChangeCallback(): void
    {
        if (this._reset != null) this._reset(this);

    }

    /*


  */
}

export namespace Proportional
{

    export class ResizeRuleEnumItem extends YEnumItem
    {
        constructor(value: any, humanreadable: string, container?: object)
        {
            super(value, humanreadable, ResizeRule)

        }
    }

    export class ResizeRule extends YEnum
    {

        public static readonly FIXED: ResizeRuleEnumItem = new ResizeRuleEnumItem("FIXED", "Fixed");
        public static readonly RELATIVETOWIDTH: ResizeRuleEnumItem = new ResizeRuleEnumItem("RELATIVETOWIDTH", "Relative to Width");
        public static readonly RELATIVETOHEIGHT: ResizeRuleEnumItem = new ResizeRuleEnumItem("RELATIVETOHEIGHT", "Relative to height");
        public static readonly RELATIVETOBOTH: ResizeRuleEnumItem = new ResizeRuleEnumItem("RELATIVETOBOTH", "Relative to Width and Height");
    }

}

interface documentVisibiltyChangeCallBack {(): void}

interface containerResizedChangeCallBack {(): void}

export abstract class YDataRenderer
{
    protected _redrawAllowed: number = 1;
    private _refWidth: number = 1;
    private _refHeight: number = 1;
    private rendererTimingTotal: number = 0;
    private rendererTimingCount: number = 0;
    public static RendererDebug: boolean = false;
    static readonly FloatToStrformats: string[] = ["0", "0", "0", "0.0", "0.00", "0.000", "0.0000"];
    protected _PatchAnnotationCallback: PatchAnnotationCallback | null = null;

    protected _logFunction: logFct | null = null;

    protected _annotationPanels: AnnotationPanel[] = [];
    get annotationPanels(): AnnotationPanel[] { return this._annotationPanels; }

    private _userData: any = null;
    get userData(): any {return this._userData;}
    private documentVisibiltyChangeFct: documentVisibiltyChangeCallBack | null = null
    private containerResizedFct: containerResizedChangeCallBack | null = null
    private static _disableMinMaxCheck: boolean = false;
    static get minMaxCheckDisabled(): boolean {return YDataRenderer._disableMinMaxCheck}
    static set minMaxCheckDisabled(value: boolean) { YDataRenderer._disableMinMaxCheck = value;}
    public resetlegendPens(): void { }
    private _getCaptureParameters: getCaptureParamaters | null = null;
    get getCaptureParameters(): getCaptureParamaters | null { return this._getCaptureParameters }
    set getCaptureParameters(value: getCaptureParamaters | null) { this._getCaptureParameters = value; }
    public OnDblClick: RendererDblClickCallBack | null = null;
    public OnRightClick: RendererRightClickCallBack | null = null;

    protected _messagePanels: MessagePanel[] = [];
    get messagePanels(): MessagePanel[] { return this._messagePanels; }

    private static globalMouseMoveSet: boolean = false;
    private static globalMouseX: number = -1;
    private static globalMouseY: number = -1;
    private static globalMouseMove(e: MouseEvent)
    {
        YDataRenderer.globalMouseX = e.pageX;
        YDataRenderer.globalMouseY = e.pageY;
    }

    private _Scr2ElmMatrix: Matrix3x3 | null = null;
    private _Elm2ScrMatrix: Matrix3x3 | null = null;

    public clearTransformationMatrix()
    {
        this._Scr2ElmMatrix = null;
        this._Elm2ScrMatrix = null;
    }

    // This is the one of the "magic" parts, instead on relying
    // on each HTML element offsetLeft and offsetTop coordinates,we
    // compute the whole transformation matrix for the canvas Element,
    // this way, CSS transformations, including scale and rotation are
    // handled property.  This is important since Yocto-Visualization
    // allows in to inject a widget inside an arbitrary DIV. This
    // also importnat to be able to make these convertion from
    // any position on the whole page because of drag operations


    private findElementAbsolutePosition(el :HTMLElement | null) : PointF
        {
          let  staticFound = false;
          let  relativeFound = false;
          let dx:number=0;
          let dy:number=0;

          while (el != null)
           {  let style: CSSStyleDeclaration = window.getComputedStyle(el);
              if ((!relativeFound) && (style.position == "static") && (!staticFound))
                  { dx = el.offsetLeft + parseFloat(style.borderLeftWidth);
                    dy = el.offsetTop + parseFloat(style.borderTopWidth);
                    staticFound = true;
                  }
               if ((style.position=="relative") || (style.position=="absolute"))
                  { dx += el.offsetLeft +  parseFloat(style.borderLeftWidth)
                    dy += el.offsetTop  +  parseFloat(style.borderTopWidth)
                    relativeFound = true;
                  }
               el=el.parentElement;
           }
          return new PointF(dx,dy);
        }

    public get Elm2ScrMatrix(): Matrix3x3
    {
        if (this._Elm2ScrMatrix == null)
        {
            let el: HTMLElement | null = <HTMLElement>this.UIContainer;

            // compute el and its parents absolute absolution relative to page origin
            // turns out it is a bit tricky when nested div have diffrent style.position
            // values static/relative/absolute

            let AsolutePositionsStack : PointF[] = []
            while (el != null)
            {   AsolutePositionsStack.push(this.findElementAbsolutePosition(el))
                el = el.parentElement;
            }

            el = this.UIContainer;
            let MatrixStack: Matrix3x3[] = [];
            let  staticFound = false;
            let  relativeFound = false;

            let index = 0;
            while (el != null)
            { //console.log("UP "+el.id);
                let parent: HTMLElement | null = el.parentElement;
                let style: CSSStyleDeclaration = window.getComputedStyle(el)

                //console.log(el.id+": position="+style.position+" offset= ("+el.offsetLeft.toString(2).padStart(16)+","+el.offsetTop.toString(2).padStart(16)+") ("+el.offsetLeft+","+el.offsetTop+")  border= ("+parseFloat(style.borderLeftWidth)+","+parseFloat(style.borderTopWidth)+") computed pos=("+AsolutePositionsStack[index].X+","+AsolutePositionsStack[index].Y+")" );

                let dx: number =  AsolutePositionsStack[index].X;
                let dy: number =  AsolutePositionsStack[index].Y;
                if   (index<AsolutePositionsStack.length-1)
                {  dx-=  AsolutePositionsStack[index+1].X;
                   dy-=  AsolutePositionsStack[index+1].Y;
                }

                //console.log("offset="+dx.toString()+","+dy.toString());
                let matrix: string = style['transform']
                if (matrix != "none")
                { //console.log("matrix="+matrix)
                    let matrixStr: string[] = (<RegExpMatchArray>matrix.match(/matrix.*\((.+)\)/))[1].split(', ');
                    let matrixValues: number[] = [];
                    for (let i: number = 0; i < 6; i++)
                    {
                        matrixValues.push(parseFloat(matrixStr[i]));
                    }

                    let OriginMatrixMatrixBefore: Matrix3x3 | null = null;
                    let TransformMatrix: Matrix3x3 = Matrix3x3.newMatrix(matrixValues[0], matrixValues[2], matrixValues[4],
                        matrixValues[1], matrixValues[3], matrixValues[5],
                        0, 0, 1)
                    let OriginMatrixMatrixAfter: Matrix3x3 | null = null;
                    if (style.transformOrigin)
                    {//console.log("transformOrigin="+style.transformOrigin)
                        let parts: string[] = style.transformOrigin.split(" ");
                        let Ox = Number.parseFloat(parts[0]);
                        let Oy = Number.parseFloat(parts[1]);
                        OriginMatrixMatrixBefore = Matrix3x3.newTranslateMatrix(-Ox, -Oy);
                        OriginMatrixMatrixAfter = Matrix3x3.newTranslateMatrix(Ox, Oy);
                    } //else  console.log("No transform");

                    if (OriginMatrixMatrixBefore != null) MatrixStack.push(OriginMatrixMatrixBefore);
                    if (TransformMatrix != null) MatrixStack.push(TransformMatrix);
                    if (OriginMatrixMatrixAfter != null) MatrixStack.push(OriginMatrixMatrixAfter);
                } // else  console.log("No matrix");
                if ((dx != 0) || (dy != 0)) MatrixStack.push(Matrix3x3.newTranslateMatrix(dx, dy));
                el = parent;
                index++;
            }




            this._Elm2ScrMatrix = Matrix3x3.newIdentityMatrix()
            for (let i: number = MatrixStack.length - 1; i >= 0; i--)
            {
                this._Elm2ScrMatrix = this._Elm2ScrMatrix.multiplyByM(MatrixStack[i]);
            }
        }
        return this._Elm2ScrMatrix;
    }

    public get Scr2ElmMatrix(): Matrix3x3
    {
        if (this._Scr2ElmMatrix == null)
        {
            this._Scr2ElmMatrix = this.Elm2ScrMatrix.inverse;

        }
        return this._Scr2ElmMatrix;
    }

    public addAnnotationPanel(): AnnotationPanel
    {
        let p: AnnotationPanel = new AnnotationPanel(this, this);
        this._annotationPanels.push(p);
        this.redraw();
        return p;
    }

    public AllowRedraw(): void
    {
        this._redrawAllowed--;
        if (this._redrawAllowed < 0) throw new RangeError("Too many AllowRedraw calls");
        if (this._redrawAllowed == 0) this.redraw();

    }

    public AllowRedrawNoRefresh(): void
    {
        this._redrawAllowed--;
        if (this._redrawAllowed < 0) throw new RangeError("Too many AllowRedraw calls");
    }

    public DisableRedraw(): void
    {
        this._redrawAllowed++;

    }

    private ProportionalToSizeValues: Proportional[] = [];

    public AddNewProportionalToSizeValue(v: Proportional): void
    {
        if (this.ProportionalToSizeValues.indexOf(v) < 0) this.ProportionalToSizeValues.push(v);

    }

    protected canRedraw(): boolean
    {
        return (this._redrawAllowed == 0);

    }
    protected UIContainer: HTMLCanvasElement; // canvas
    protected parentForm: HTMLDocument; // document?
    public setPatchAnnotationCallback(callback: PatchAnnotationCallback): void
    { this._PatchAnnotationCallback = callback; }

    public patchAnnotation(text: string): string
    {
        text = text.replace("\\n", "\n");
        if (text.indexOf('$') < 0) return text;
        let now: Date = new Date();
        text = text.replace("$DAY$", now.getDay().toString());
        text = text.replace("$MONTH$", now.getMonth().toString());
        text = text.replace("$YEAR$", now.getFullYear().toString());
        text = text.replace("$HOUR$", now.getHours().toString());
        text = text.replace("$MINUTE$", now.getMinutes().toString());
        text = text.replace("$SECOND$", now.getSeconds().toString());
        if (this._PatchAnnotationCallback != null) text = this._PatchAnnotationCallback(text);
        return text;

    }

    protected mouseLocalPosition(): Point | null
    {
        let v: Vector3 = Vector3.FromXYCoord(YDataRenderer.globalMouseX, YDataRenderer.globalMouseY)
        let m: Matrix3x3 = this.Scr2ElmMatrix;

        //   let canvasRect :  ClientRect = this.UIContainer.getBoundingClientRect();
        //   if (YDataRenderer.globalMouseX<= canvasRect.left) return null;
        //   if (YDataRenderer.globalMouseX>= canvasRect.left+canvasRect.width) return null;
        //   if (YDataRenderer.globalMouseY<= canvasRect.top) return null;
        //   if (YDataRenderer.globalMouseY>= canvasRect.top+canvasRect.height) return null;

        let p: Point = m.multiplyByV(v).toPoint()
        //     console.log(" Traditional : "+ (YDataRenderer.globalMouseX- canvasRect.left).toString()+","+(YDataRenderer.globalMouseY- canvasRect.top).toString()
        //     +" Matrix : "+ p.X.toString()+", "+ p.Y.toString());

        if ((p.X < 0) || (p.Y < 0) || (p.X > this.UIContainer.offsetWidth) || (p.Y > this.UIContainer.offsetHeight)) return null;
        return p;

        //   return new Point( YDataRenderer.globalMouseX- canvasRect.left,
        //                      YDataRenderer.globalMouseY- canvasRect.top);
    }

    private _proportionnalValueChangeCallback: ProportionnalValueChangeCallback | null = null;
    set proportionnalValueChangeCallback(value: ProportionnalValueChangeCallback)
    {
        this._proportionnalValueChangeCallback = value;

    }

    public ProportionnalValueChanged(source: Proportional): void
    {
        if (this._proportionnalValueChangeCallback != null) this._proportionnalValueChangeCallback(source);

    }

    public getContainerInnerWidth(): number
    {
        return this.UIContainer.offsetWidth;
        // let r: DOMRect  = this.UIContainer.getBoundingClientRect();
        //  return r.width;
        // return  this.UIContainer.width;
    }

    public getContainerInnerHeight(): number
    {
        return this.UIContainer.offsetHeight;
        //let r: DOMRect  = this.UIContainer.getBoundingClientRect();
        //return r.height;
        //return  this.UIContainer.height;

    }

    public Draw(timestamp: number): number
    {

        if (!this.canRedraw()) return 0;

        let w: number = this.getContainerInnerWidth();
        let h: number = this.getContainerInnerHeight();

        if ((w <= 5) || (h <= 5)) return 0;

        this.DisableRedraw();

        let offscreenCanvas: HTMLCanvasElement = document.createElement('canvas');
        offscreenCanvas.width = w;
        offscreenCanvas.height = h;

        //let DrawArea : CanvasRenderingContext2D = this.UIContainer.getContext('2d');
        let g: YGraphics = new YGraphics(offscreenCanvas, w, h, 90);
        let start: number = performance.now();

        try
        {
            this.Render(g, w, h);
            /*
          let p: Point | null = this.mouseLocalPosition();
          if (p!=null)
          {
            let ctx: CanvasRenderingContext2D = <CanvasRenderingContext2D>offscreenCanvas.getContext("2d");
            ctx.fillStyle = "red";
            ctx.font = " 24px Arial";
            ctx.fillText(p.X.toString()+","+p.Y.toString(), 1, 1);
          }*/

        }
        catch (e)
        {
            debugger
            this.log("Rendering error: " + (e as Error).message);
        }

        let elapsed: number = performance.now() - start;
        let drawArea: CanvasRenderingContext2D = <CanvasRenderingContext2D>this.UIContainer.getContext('2d');
        drawArea.clearRect(0, 0, w, h)
        drawArea.drawImage(offscreenCanvas, 0, 0);
        this.rendererTimingTotal += elapsed;
        this.rendererTimingCount++;
        let avg: number = this.rendererTimingTotal / this.rendererTimingCount;
        g.Dispose();
        this.AllowRedrawNoRefresh();
        this.renderingPostProcessing();
        return 0;

    }

    protected renderingPostProcessing(): void { }

    protected abstract Render(g: YGraphics, w: number, h: number): number;

    public abstract clearCachedObjects(): void;

    private _resizeRule: Proportional.ResizeRuleEnumItem = Proportional.ResizeRule.FIXED;
    get resizeRule(): Proportional.ResizeRuleEnumItem {return this._resizeRule;}

    set resizeRule(value: Proportional.ResizeRuleEnumItem)
    {

        if (value != this._resizeRule)
        {
            this.DisableRedraw();
            this._resizeRule = value;
            for (let i: number = 0; i < this.ProportionalToSizeValues.length; i++)
            { this.ProportionalToSizeValues[i].resizeRule = this._resizeRule; }
            this.AllowRedraw();
            this.redraw();

        }

    }

    private requestAnimationFrameID : number |null =null;
    public redraw(): void
    {
        if (!(document.visibilityState === 'visible')) return;
        if (this._redrawAllowed > 0) return;
        if (this.getContainerInnerWidth() < 2) return;
        if (this.getContainerInnerHeight() < 2) return;
        if (this.requestAnimationFrameID!=null)
        {   window.cancelAnimationFrame(this.requestAnimationFrameID) ;
            //#ifdef PROFILING
            console.log("canceled cancelAnimationFrame ");
            //#endif
        }
        this.requestAnimationFrameID = window.requestAnimationFrame((timestamp: number) => {
            try {
                this.Draw(timestamp);
	
            } catch(e) {
                console.log('caught');
                this.requestAnimationFrameID=null;
                throw(e);
            }
            this.requestAnimationFrameID=null;
        });
    }

    public usableUiWidth(): number { return this.getContainerInnerWidth(); }

    public usableUiHeight(): number { return this.getContainerInnerHeight(); }

    public resetProportionalSizeObjectsCachePush(newcoef: number): void
    {
        this.clearCachedObjects();
        if (this._resizeRule != Proportional.ResizeRule.FIXED)
        {
            for (let i: number = 0; i < this.ProportionalToSizeValues.length; i++)
            {
                this.ProportionalToSizeValues[i].containerResizedPushNewCoef(newcoef);
            }
        }
    }

    public resetProportionalSizeObjectsCachePop(): void
    {
        this.clearCachedObjects();
        if (this._resizeRule != Proportional.ResizeRule.FIXED)
        {
            for (let i: number = 0; i < this.ProportionalToSizeValues.length; i++)
            {
                this.ProportionalToSizeValues[i].containerResizedPop();
            }
        }
    }

    protected resetProportionalSizeObjectsCache(w: number, h: number): void
    {
        this.clearCachedObjects();
        if (this._resizeRule != Proportional.ResizeRule.FIXED)
        {
            for (let i: number = 0; i < this.ProportionalToSizeValues.length; i++)
            {
                this.ProportionalToSizeValues[i].containerResized(w, h);
            }
        }
    }

    public containerResized(): void
    {
        this.containerResize(null, null);
    }

    private containerResize(sender: object | null, e: object | null): void
    {
        //if (((Form)sender).WindowState == FormWindowState.Minimized) return;
        this.clearTransformationMatrix();
        this.DisableRedraw();
        //let r: DOMRect  = this.UIContainer.getBoundingClientRect();
        this.UIContainer.width = this.UIContainer.offsetWidth;
        this.UIContainer.height = this.UIContainer.offsetHeight;
        // console.log("resize " + this.usableUiWidth().toString() + "/" + this.usableUiHeight().toString());
        this.resetProportionalSizeObjectsCache(this.usableUiWidth(), this.usableUiHeight());
        this.AllowRedraw();
        this.redraw();

    }

    public proportionnalsizeReset(): void
    {
        this.resetProportionalSizeObjectsCache(this.usableUiWidth(), this.usableUiHeight());
    }

    public captureAndDownloadImage(captureType: YDataRenderer.CaptureTypeEnumItem,
                                   defaultFilename?: string, // or null
                                   captureWidth?: number, // or null
                                   captureHeight?: number,  // or null
                                   captureDPI?: number, // or null
    ): void
    {
        let error: string = "";
        let w: number;
        let h: number;
        let ratio: number = this.getContainerInnerWidth() / this.getContainerInnerHeight();
        if (captureDPI == null) captureDPI = 90;
        if ((defaultFilename == null) || (typeof defaultFilename == "undefined"))
        {
            defaultFilename = "capture.";
            if (captureType == YDataRenderer.CaptureType.PNG)
            {defaultFilename = defaultFilename + "png";}
            if (captureType == YDataRenderer.CaptureType.SVG)
            {defaultFilename = defaultFilename + "svg";}
        }
        if ((captureWidth == null) || (typeof (captureWidth) == "undefined"))
        {
            w = this.getContainerInnerWidth()
            if ((captureHeight == null) || (typeof (captureHeight) == "undefined"))
            {
                h = this.getContainerInnerHeight();
            }
            else
            {
                h = captureHeight >> 0;
                w = (h * ratio) >> 0;
            }
        }
        else
        {
            w = captureWidth >> 0;
            if ((captureHeight == null) || (typeof (captureHeight) == "undefined"))
            {
                h = (w * ratio) >> 0;
            }
            else
            {
                h = captureHeight >> 0;
            }
        }

        if ((w <= 5) || (h <= 5)) return;

        this.DisableRedraw();

        let DrawArea = document.createElement('canvas');
        DrawArea.width = w;
        DrawArea.height = h;

        let g: YGraphics;
        switch (captureType)
        {
        case YDataRenderer.CaptureType.PNG:
            g = new YGraphics(DrawArea, w, h, captureDPI);
            break;
        case YDataRenderer.CaptureType.SVG:
            g = new YGraphicsSVG(DrawArea, w, h, captureDPI);
            break;
        default:
            throw new RangeError("capture :unknown type");
        }

        let newCoef: number = Proportional.resizeCoef(Proportional.ResizeRule.RELATIVETOBOTH, this.refWidth, this.refHeight, w, h);

        this.log("start capture");
        this.resetProportionalSizeObjectsCachePush(newCoef);  // reset all size related cached objects
        let renderok: boolean = false;
        (<MessagePanel>this._snapshotPanel).enabled = false;
        try
        {

            let t: number = this.Render(g, w, h);
            renderok = true;

        }
        catch (e)
        {
            error = (e as Error).message;
            this.log("Render error: " + error);
        }
        this.log("capture completed");
        this.resetProportionalSizeObjectsCachePop(); // reset all size related cached objects, again

        if (renderok)
        {
            let element = document.createElement('a');
            let data = g.get_downloadableData();
            element.setAttribute('href', data);
            element.setAttribute('download', defaultFilename);
            element.style.display = 'none';
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);
        }

        g.Dispose();
        this.AllowRedraw();

    }

    private getFocus(sender: object, e: Event): void
    {
        this.log("got focus")

    }

    public gainFocus(): void
    {
        //if (parentForm.Focused) return;
        //this.parentForm.Focus();
    }

    private lostFocus(sender: object, e: Event): void
    {
        //if (_AllowPrintScreenCapture) _RegisKey.StopHotKey();
    }

    private _snapshotPanel: MessagePanel | null = null;
    private _snapshotTimer: number | null = null;

    private _AllowPrintScreenCapture: boolean = false;
    public get AllowPrintScreenCapture(): boolean { return this._AllowPrintScreenCapture; }

    public set AllowPrintScreenCapture(value: boolean) { this._AllowPrintScreenCapture = value; }

    protected constructor(UIContainer: HTMLCanvasElement, logFunction: logFct)
    {

        if (!YDataRenderer.globalMouseMoveSet)
        {
            document.addEventListener("mousemove", e => {YDataRenderer.globalMouseMove(e)});
            YDataRenderer.globalMouseMoveSet = true;
        }

        this.UIContainer = UIContainer;
        this.UIContainer.width = this.getContainerInnerWidth();
        this.UIContainer.height = this.getContainerInnerHeight();

        //this.UIContainer.SizeMode = PictureBoxSizeMode.Normal;
        this._logFunction = logFunction;
        this.parentForm = UIContainer.ownerDocument;
        this._annotationPanels = [];
        this._messagePanels = [];

        this.DisableRedraw();
        this._snapshotPanel = this.addMessagePanel();
        this._snapshotPanel.panelTextAlign = MessagePanel.TextAlign.CENTER;
        this._snapshotPanel.text = "Captured to clipboard";
        this._snapshotPanel.panelHrzAlign = MessagePanel.HorizontalAlignPos.CENTER;
        this._snapshotPanel.panelVrtAlign = MessagePanel.VerticalAlignPos.CENTER;
        this._snapshotPanel.bgColor = new YColor(false, 200, 0xcc, 0xf7, 0xa1);
        (<YFont>this._snapshotPanel.font).size = 16;
        this.AllowRedrawNoRefresh();

        this.containerResizedFct = () => {this.containerResize(null, null);}
        document.addEventListener('resize', this.containerResizedFct);
        this.resetRefrenceSize();

        this.documentVisibiltyChangeFct = () =>
        {
            if (document.visibilityState === 'visible')
            {this.redraw();}
        }
        document.addEventListener('visibilitychange', this.documentVisibiltyChangeFct);

    }

    public destroy()
    {
        document.removeEventListener('visibilitychange', <any>this.documentVisibiltyChangeFct);
        document.removeEventListener('resize', this.containerResized);
        (<Node>this.UIContainer.parentNode).removeChild(this.UIContainer);
        (<any>this.UIContainer) = null;
        (<any>this.parentForm) = null;
        (<any>this._annotationPanels) = null;
        (<any>this._messagePanels) = null;
        this._Scr2ElmMatrix = null;
        this._Elm2ScrMatrix = null;
    }

    public resetRefrenceSize(): void
    {
        this._refWidth = this.getContainerInnerWidth();
        this._refHeight = this.getContainerInnerHeight();
    }

    public get refWidth(): number { return this._refWidth; }

    public get refHeight(): number { return this._refHeight; }

    private RendererCanvas_Click(sender: object, e: Event): void
    { /*
  MouseEventArgs m = (MouseEventArgs)e;
  if(OnRightClick != null && m.Button == MouseButtons.Right) {
    OnRightClick(this, m);
    return;
  }

  // emulates a a double click, which not does seem to exist on touch-screens
  if (DblClickWatch == null)
  {
    DblClickWatch = System.Diagnostics.Stopwatch.StartNew();
    return;
  }

  DblClickWatch.Stop();
  var elapsedMs = DblClickWatch.ElapsedMilliseconds;
  DblClickWatch = System.Diagnostics.Stopwatch.StartNew();

  if (elapsedMs < 330) RendererCanvas_DoubleClick(sender, e);
  */
    }

    private RendererCanvas_DoubleClick(sender: object, e: Event): void
    {
        // MouseEventArgs m = (MouseEventArgs)e;
        // if (OnDblClick != null) OnDblClick(this, m);
    }

    public addMessagePanel(): MessagePanel
    {
        let p: MessagePanel = new MessagePanel(this, this);
        this._messagePanels.push(p);
        return p;

    }

    public DrawMessagePanels(g: YGraphics, viewPortWidth: number, viewPortHeight: number): void
    {

        //g.SetClip(new YRectangle(0, 0, viewPortWidth, viewPortHeight));

        for (let i: number = 0; i < this._messagePanels.length; i++)
        {
            if (this._messagePanels[i].enabled)
            {
                let p: MessagePanel = this._messagePanels[i];

                let AvailableWidth: number = viewPortWidth - 2 * p.padding - p.borderthickness;
                if (AvailableWidth < 100) AvailableWidth = 100;

                let ssize : YSizeF  | null= null ;
                let sizeok=false;

                // if panel ends up larger than avaliable space, lets reduce font size.
                while (!sizeok)
                 { ssize = g.MeasureString(p.text, <YFont>p.font, AvailableWidth);
                   if (((ssize.width >= this.UIContainer.width) ||
                       (ssize.height >= this.UIContainer.height))
                       && (p.font.size>5))
                      {  p.font.size= Math.round(p.font.size*9)/10;
                      }  else sizeok=true;

                 }

                if (ssize==null)  return; // not supposed to happen
                let panelWidth: number = ssize.width + 2 * p.padding + p.borderthickness;
                let panelHeight: number = ssize.height + 2 * p.padding + p.borderthickness;




                let x: number = 0;
                switch (p.panelHrzAlign)
                {
                case MessagePanel.HorizontalAlignPos.LEFT:
                    x = p.horizontalMargin;
                    break;
                case MessagePanel.HorizontalAlignPos.RIGHT:
                    x = viewPortWidth - panelWidth - p.horizontalMargin;
                    break;
                default:
                    x = (viewPortWidth - panelWidth) / 2;
                    break;
                }

                let y: number = 0;
                switch (p.panelVrtAlign)
                {
                case MessagePanel.VerticalAlignPos.TOP:
                    y = p.verticalMargin;
                    break;
                case MessagePanel.VerticalAlignPos.BOTTOM:
                    y = viewPortHeight - panelHeight - p.verticalMargin;
                    break;
                default:
                    y = (viewPortHeight - panelHeight) / 2;
                    break;
                }

                g.FillRectangleXYHW(p.bgBrush, x, y, panelWidth, panelHeight);
                if (p.borderthickness > 0) g.DrawRectangleXYHW(p.pen, x, y, panelWidth, panelHeight);

                let sf: YStringFormat = new YStringFormat(YStringFormat.StringFormatFlags.NoClip);
                switch (p.panelTextAlign)
                {
                case MessagePanel.TextAlign.LEFT:
                    sf.LineAlignment = YStringFormat.StringAlignment.Near;
                    sf.Alignment = YStringFormat.StringAlignment.Near;
                    break;
                case MessagePanel.TextAlign.RIGHT:
                    sf.LineAlignment = YStringFormat.StringAlignment.Far;
                    sf.Alignment = YStringFormat.StringAlignment.Far;
                    break;
                default:
                    sf.LineAlignment = YStringFormat.StringAlignment.Center;
                    sf.Alignment = YStringFormat.StringAlignment.Center;
                    break;
                }
                let r: YRectangle = new YRectangle(
                    ((x + p.padding + p.borderthickness / 2) >> 0),
                    ((y + p.padding + p.borderthickness / 2) >> 0),
                    ssize.width + 1, ssize.height + 1);
                g.DrawStringRect(p.text, <YFont>p.font, (<YFont>p.font).brush, r, sf);

            }
        }
    }

    public drawAnnotationPanels(g: YGraphics, annotationPanels: AnnotationPanel[], viewPortWidth: number,
                                viewPortHeight: number, overlap: boolean, mainViewPort: ViewPortSettings): void
    {

        //g.TextRenderingHint = YGraphics.TextRenderingHint.SingleBitPerPixelGridFit;
        let active: boolean = false;
        for (let i: number = 0; i < this.annotationPanels.length; i++)
        {
            if (this.annotationPanels[i].enabled) active = true;
        }
        if (!active) return;

        //g.SetClip(new YRectangle(0, 0, viewPortWidth, viewPortHeight));

        for (let i: number = 0; i < this.annotationPanels.length; i++)
        {
            if ((annotationPanels[i].enabled) && (annotationPanels[i].overlap == overlap))
            {
                let p: AnnotationPanel = annotationPanels[i];
                let AvailableWidth: number = viewPortWidth - 2 * p.padding - p.borderthickness;
                if (AvailableWidth < 100) AvailableWidth = 100;

                let textToDisplay: string = p.text.replace("\\n", "\n");

                if (textToDisplay.indexOf('$') >= 0)
                {
                    textToDisplay = textToDisplay.replace("\\n", "\n");
                    textToDisplay = this.patchAnnotation(textToDisplay);

                }

                let ssize: YSizeF = g.MeasureString(textToDisplay, <YFont>p.font, AvailableWidth);
                let panelWidth: number = ssize.width + 2 * p.padding + p.borderthickness;
                let panelHeight: number = ssize.height + 2 * p.padding + p.borderthickness;

                let x: number = 0;
                switch (p.panelHrzAlign)
                {
                case MessagePanel.HorizontalAlignPos.LEFT:
                    x = p.horizontalMargin;
                    if (!annotationPanels[i].overlap && (mainViewPort.Lmargin < panelWidth + 10))
                    {
                        mainViewPort.Lmargin = panelWidth + 10;
                    }
                    break;
                case MessagePanel.HorizontalAlignPos.RIGHT:
                    x = viewPortWidth - panelWidth - p.horizontalMargin;
                    if (!annotationPanels[i].overlap && (mainViewPort.Rmargin < panelWidth + 20))
                    {
                        mainViewPort.Rmargin = panelWidth + 20;
                    }
                    break;

                default:
                    x = (viewPortWidth - panelWidth) / 2;
                    break;
                }

                let y: number = 0;
                switch (p.panelVrtAlign)
                {
                case MessagePanel.VerticalAlignPos.TOP:
                    y = p.verticalMargin;
                    if (!annotationPanels[i].overlap && (mainViewPort.Tmargin < panelHeight + 20))
                    {
                        mainViewPort.Tmargin = panelHeight + 20;
                    }
                    break;
                case MessagePanel.VerticalAlignPos.BOTTOM:
                    y = viewPortHeight - panelHeight - p.verticalMargin;
                    if (!annotationPanels[i].overlap && (mainViewPort.Bmargin < panelHeight + 20))
                    {
                        mainViewPort.Bmargin = panelHeight + 20;
                    }
                    break;
                default:
                    y = (viewPortHeight - panelHeight) / 2;
                    break;
                }

                if (annotationPanels[i].overlap)
                {
                    x += (annotationPanels[i].positionOffsetX / 100) * (viewPortWidth - panelWidth);
                    y += (annotationPanels[i].positionOffsetY / 100) * (viewPortHeight - panelHeight);

                    if (x < 0) x = 0;
                    if (y < 0) y = 0;
                    if (x > viewPortWidth - panelWidth) x = viewPortWidth - panelWidth;
                    if (y > viewPortHeight - panelHeight) y = viewPortHeight - panelHeight;

                }

                g.FillRectangleXYHW(p.bgBrush, x, y, panelWidth, panelHeight);
                if (p.borderthickness > 0) g.DrawRectangleXYHW(p.pen, x, y, panelWidth, panelHeight);
                //g.TextRenderingHint = YGraphics.TextRenderingHint.AntiAlias;

                let sf: YStringFormat = new YStringFormat(YStringFormat.StringFormatFlags.NoClip);
                switch (p.panelTextAlign)
                {
                case MessagePanel.TextAlign.LEFT:
                    sf.LineAlignment = YStringFormat.StringAlignment.Near;
                    sf.Alignment = YStringFormat.StringAlignment.Near;
                    break;
                case MessagePanel.TextAlign.RIGHT:
                    sf.LineAlignment = YStringFormat.StringAlignment.Far;
                    sf.Alignment = YStringFormat.StringAlignment.Far;
                    break;
                default:
                    sf.LineAlignment = YStringFormat.StringAlignment.Center;
                    sf.Alignment = YStringFormat.StringAlignment.Center;
                    break;
                }
                let r: YRectangle = new YRectangle((x + p.padding + p.borderthickness / 2),
                    (y + p.padding + p.borderthickness / 2),
                    ssize.width + 1, ssize.height + 1);
                g.DrawStringRect(textToDisplay, <YFont>p.font, (<YFont>p.font).brush, r, sf);

            }
        }

    }

    public log(s: string): void
    {
        if (this._logFunction == null) return;
        this._logFunction(s);

    }

}

export namespace YDataRenderer
{

    export class CaptureTypeEnumItem extends YEnumItem
    {
        constructor(value: any, humanreadable: string, container?: object)
        {
            super(value, humanreadable, CaptureType)

        }
    }

    export class CaptureType extends YEnum
    {
        public static readonly PNG: CaptureTypeEnumItem = new CaptureTypeEnumItem("PNG", "Bitmap (PNG)");
        public static readonly SVG: CaptureTypeEnumItem = new CaptureTypeEnumItem("SVG", "Vector (SVG)");
    }

    export class CaptureTargetEnumItem extends YEnumItem
    {
        constructor(value: any, humanreadable: string, container?: object)
        {
            super(value, humanreadable, CaptureTarget)

        }
    }

    export class CaptureTarget extends YEnum
    {
        public static readonly ToClipBoard: CaptureTargetEnumItem = new CaptureTargetEnumItem("ToClipBoard", "ClipBoard");
        public static readonly ToFile: CaptureTargetEnumItem = new CaptureTargetEnumItem("ToFile", "File");
    }

    export class CaptureFormatsEnumItem extends YEnumItem
    {
        constructor(value: any, humanreadable: string, container?: object)
        {
            super(value, humanreadable, CaptureFormats)
        }
    }

    export class CaptureFormats extends YEnum
    {

        public static readonly Keep: CaptureFormatsEnumItem = new CaptureFormatsEnumItem("Keep", "Keep original size");
        public static readonly Fixed: CaptureFormatsEnumItem = new CaptureFormatsEnumItem("Fixed", "Fixed size");
        public static readonly FixedWidth: CaptureFormatsEnumItem = new CaptureFormatsEnumItem("FixedWidth", "Fixed width, keep ration aspect");
        public static readonly FixedHeight: CaptureFormatsEnumItem = new CaptureFormatsEnumItem("FixedHeight", "Fixed height, keep ration aspect");

    }

}

/*
    *  abstraction layer allowing to render in both bitmap and Vector(SVG) format
    *
    */
export class YGraphics
{
    protected _c: HTMLCanvasElement | null = null;
    protected _g: CanvasRenderingContext2D | null = null;
    protected _width: number = 0;
    protected _height: number = 0;
    protected _dpi: number = 0;
    protected _image: HTMLCanvasElement | null = null;
    private _lastPen: YPen | null = null;
    private _lastBrush: YBrush | null = null;
    private _lastFont: YFont | null = null;
    private _clipCounter = 0;
    private _textRenderingHint: YTextRenderingHint | null = null;
    private _smoothingMode: YSmoothingMode = YSmoothingMode.Default;

    constructor(canvas: HTMLCanvasElement, width: number, height: number, dpi: number)
    {
        this._c = canvas;

        this._g = <CanvasRenderingContext2D>this._c.getContext("2d");

        (<CanvasRenderingContext2D>this._g).textBaseline = 'top';
        this._width = width;
        this._height = height;
        this._dpi = dpi;

    }

    public get_downloadableData(): string
    {
        return (<HTMLCanvasElement>this._c).toDataURL('image/png');

    }

    get graphics(): CanvasRenderingContext2D { return <CanvasRenderingContext2D>this._g; }

    private setPen(p: YPen | null): void
    {
        if (p == this._lastPen) return;
        if (p != null)
        { //if (YDataRenderer.RendererDebug)  console.log("set Pen to "+p.lineWidth+"/"+p.strokeStyle)
            (<CanvasRenderingContext2D>this._g).lineWidth = p.lineWidth;
            let st: string = p.strokeStyle;

            (<CanvasRenderingContext2D>this._g).strokeStyle = p.strokeStyle;
        }
        else
        {
            (<CanvasRenderingContext2D>this._g).lineWidth = 0;
        }
        this._lastPen = p;
    }

    private setBrush(b: YBrush): void
    {
        if (b == this._lastBrush) return
        if (b instanceof YSolidBrush)
        {
            (<CanvasRenderingContext2D>this._g).fillStyle = b.color.htmlCode;
        }
        else if (b instanceof YLinearGradientBrush)
        {
            let lingrad: CanvasGradient = (<CanvasRenderingContext2D>this._g).createLinearGradient(0, 0, 0, this._height);

            lingrad.addColorStop(0, b.color1.htmlCode);
            lingrad.addColorStop(1, b.color2.htmlCode);

            (<CanvasRenderingContext2D>this._g).fillStyle = lingrad;
        }
        else
        {
            throw  new Error("invalid / insupported brush type");
        }

        this._lastBrush = b;

    }

    private setFont(f: YFont): void
    {
        if ((f == this._lastFont) && !f.hasChanged) return

        (<CanvasRenderingContext2D>this._g).font = f.htmlCode;
        this._lastFont = f;

    }

    public DrawLineXY(p: YPen, x1: number, y1: number, x2: number, y2: number): void
    {

        if (p.noAntiAlias)
        {
            let offset = (p.lineWidth == p.lineWidth >> 0) && ((p.lineWidth & 1) == 1) ? 0.5 : 0;
            x1 = Math.round(x1) + offset;
            y1 = Math.round(y1) + offset;
            x2 = Math.round(x2) + offset;
            y2 = Math.round(y2) + offset;
        }

        this.setPen(p);

        (<CanvasRenderingContext2D>this._g).beginPath();

        (<CanvasRenderingContext2D>this._g).moveTo(x1, y1);
        (<CanvasRenderingContext2D>this._g).lineTo(x2, y2);
        (<CanvasRenderingContext2D>this._g).stroke();
    }

    public DrawLine(p: YPen, p1: PointF, p2: PointF): void
    {
        this.setPen(p);
        (<CanvasRenderingContext2D>this._g).beginPath();
        (<CanvasRenderingContext2D>this._g).moveTo(p1.X, p1.Y);
        (<CanvasRenderingContext2D>this._g).lineTo(p2.X, p2.Y);
        (<CanvasRenderingContext2D>this._g).stroke();

    }

    public SetClip(rect: YRectangle): void
    {
        (<CanvasRenderingContext2D>this._g).save(); // save the context
        (<CanvasRenderingContext2D>this._g).beginPath();
        (<CanvasRenderingContext2D>this._g).rect(rect.x, rect.y, rect.w, rect.h);
        (<CanvasRenderingContext2D>this._g).clip();
        this._clipCounter++;

    }

    public ResetClip(): void
    {
        if (this._clipCounter <= 0) throw new Error("clipping stack error");
        (<CanvasRenderingContext2D>this._g).restore(); // restore the context including previous clipping
        this._clipCounter--;
        //console.log("-ResetClip , counter = "+this._clipCounter);
    }

    public MeasureString(text: string, font: YFont, width: number): YSizeF
    {
        this.setFont(font);
        let res: YSizeF = new YSizeF(font, text);
        let count = res.linesCount;
        if (count == 0) return res;

        res.height = res.firstLineHeight * 1.2 + (count - 1) * res.lineHeight;
        let max = 0;
        let dim: TextMetrics;
        for (let i: number = 0; i < count; i++)
        {
            dim = (<CanvasRenderingContext2D>this._g).measureText(res.lines[i]);
            max = Math.max(max, dim.width)

        }
        res.width = max;
        return res;

    }

    public MeasureStringSF(text: string, font: YFont, width: number, stringFormat: YStringFormat): YSizeF
    { // not properly implemented
        return this.MeasureString(text, font, width);
    }

    public FillRectangle(brush: YBrush, rect: YRectangle): void
    {
        this.setBrush(brush);
        (<CanvasRenderingContext2D>this._g).beginPath();
        (<CanvasRenderingContext2D>this._g).fillRect(rect.x, rect.y, rect.w, rect.h);
        (<CanvasRenderingContext2D>this._g).fill();
    }

    public FillRectangleXYHW(brush: YBrush, x: number, y: number, width: number, height: number)
    {
        this.setBrush(brush);
        (<CanvasRenderingContext2D>this._g).beginPath();
        (<CanvasRenderingContext2D>this._g).fillRect(x, y, width, height);
        (<CanvasRenderingContext2D>this._g).fill();

    }

    public DrawRectangle(p: YPen, rect: YRectangle): void
    {
        this.setPen(p);

        (<CanvasRenderingContext2D>this._g).beginPath();

        if (p.noAntiAlias)
        {
            let offset = (p.lineWidth == p.lineWidth >> 0) && ((p.lineWidth & 1) == 1) ? 0.5 : 0;
            (<CanvasRenderingContext2D>this._g).rect(Math.round(rect.x) + offset, Math.round(rect.y) + offset, Math.round(rect.w), Math.round(rect.h));
        }
        else
        {
            (<CanvasRenderingContext2D>this._g).rect(rect.x, rect.y, rect.w, rect.h);
        }

        (<CanvasRenderingContext2D>this._g).stroke();
    }

    public DrawRectangleXYHW(p: YPen, x: number, y: number, width: number, height: number): void
    {

        if (p.noAntiAlias)
        {
            let offset = (p.lineWidth == p.lineWidth >> 0) && ((p.lineWidth & 1) == 1) ? 0.5 : 0;
            x = Math.round(x) + offset;
            y = Math.round(y) + offset;
            width = Math.round(width);
            height = Math.round(height);

        }
        this.setPen(p);

        (<CanvasRenderingContext2D>this._g).beginPath();
        (<CanvasRenderingContext2D>this._g).rect(x, y, width, height);
        (<CanvasRenderingContext2D>this._g).stroke();
    }

    public DrawStringXY(s: string, font: YFont, brush: YBrush, x: number, y: number): void
    {

        this.setPen(null);
        this.setBrush(brush);
        this.setFont(font);
        let totalsz: YSizeF = this.MeasureString(s, font, 0);
        let dy: number = totalsz.lineHeight;

        for (let i: number = 0; i < totalsz.linesCount; i++)
        {
            (<CanvasRenderingContext2D>this._g).fillText(totalsz.lines[i], x, y);
            y += dy;
        }
    }

    public DrawStringXYF(s: string, font: YFont, brush: YBrush, x: number, y: number, format: YStringFormat): void
    {
        if (YGraphics._debugDrawString)
        {
            let pen = new YPen(YColor.Red, 1);
            this.DrawLineXY(pen, x - 5, y, x + 5, y);
            this.DrawLineXY(pen, x, y - 5, x, y + 5);
        }
        let sz: YSizeF = this.MeasureString(s, font, 10000);
        if (format.Alignment == YStringFormat.StringAlignment.Center)
        {
            x -= sz.width >> 1;
        }
        else if (format.Alignment == YStringFormat.StringAlignment.Far) x -= sz.width;

        if (format.LineAlignment == YStringFormat.StringAlignment.Center)
        {
            y -= (sz.height / 2) >> 0;
        }
        else if (format.LineAlignment == YStringFormat.StringAlignment.Far) y -= sz.height;

        this.DrawStringXY(s, font, brush, x, y);

    }
    public DrawStringPF(s: string, font: YFont, brush: YBrush, p: PointF, format: YStringFormat): void
    {
        this.DrawStringXYF(s, font, brush, p.X, p.Y, format);
    }

    protected static readonly _debugDrawString = false;

    public DrawString(s: string, font: YFont, brush: YBrush, p: PointF): void
    {
        if (YGraphics._debugDrawString)
        {
            let pen = new YPen(YColor.Red, 1);
            this.DrawLineXY(pen, p.X - 5, p.Y, p.X + 5, p.Y);
            this.DrawLineXY(pen, p.X, p.Y - 5, p.X, p.Y + 5);
        }
        this.setPen(null);
        this.setBrush(brush);
        this.setFont(font);
        (<CanvasRenderingContext2D>this._g).fillText(s, p.X, p.Y);
    }

    public DrawStringRect(s: string, font: YFont, brush: YBrush, layoutRectangle: YRectangle, format: YStringFormat)
    {

        if (YGraphics._debugDrawString)
        {
            let pen = new YPen(YColor.Red, 1);
            this.DrawRectangle(pen, layoutRectangle);
        }

        this.setPen(null);
        this.setBrush(brush);
        this.setFont(font);

        let totalsz: YSizeF = this.MeasureString(s, font, 0);
        let dy: number = totalsz.lineHeight;
        let y: number = layoutRectangle.y;
        switch (format.LineAlignment)
        {
        case YStringFormat.StringAlignment.Near:
            break;
        case YStringFormat.StringAlignment.Center:
            y += (layoutRectangle.h - totalsz.height) / 2;
            break;
        case YStringFormat.StringAlignment.Far:
            y += (layoutRectangle.h - totalsz.height);
            break;
        }

        let xOrigin: number = layoutRectangle.x;
        if (format.FormatFlags & YStringFormat.StringFormatFlags.DirectionVertical)
        {
            this.Transform(layoutRectangle.x, layoutRectangle.y, Math.PI / 2);
            y -= (layoutRectangle.y + layoutRectangle.w);
            xOrigin -= layoutRectangle.x;
        }

        for (let i: number = 0; i < totalsz.linesCount; i++)
        {
            let s: string = totalsz.lines[i];
            let sz: YSizeF = this.MeasureString(s, font, 0);
            let x: number = xOrigin;
            switch (format.Alignment)
            {
            case YStringFormat.StringAlignment.Near:
                break;
            case YStringFormat.StringAlignment.Center:
                x += (layoutRectangle.w - sz.width) / 2;
                break;
            case YStringFormat.StringAlignment.Far:
                x += (layoutRectangle.w - sz.width);
                break;

            }

            (<CanvasRenderingContext2D>this._g).fillText(s, x, y);

            y += dy;
        }
        if (format.FormatFlags & YStringFormat.StringFormatFlags.DirectionVertical) this.ResetTransform();

    }

    public Transform(dx: number, dy: number, angle: number): void
    {

        let sin = Math.sin(angle);
        let cos = Math.cos(angle);
        (<CanvasRenderingContext2D>this._g).save();
        (<CanvasRenderingContext2D>this._g).transform(cos, sin, -sin, cos, dx, dy);
    }

    public ResetTransform(): void
    {
        (<CanvasRenderingContext2D>this._g).restore();
    }

    public FillEllipse(brush: YBrush, x: number, y: number, width: number, height: number): void
    {
        this.setBrush(brush);
        (<CanvasRenderingContext2D>this._g).beginPath();
        (<CanvasRenderingContext2D>this._g).ellipse(x + width / 2, y + height / 2, width / 2, height / 2, 0, 0, 2 * Math.PI);
        (<CanvasRenderingContext2D>this._g).fill();
    }

    public DrawEllipse(pen: YPen, x: number, y: number, width: number, height: number): void
    {
        this.setPen(pen);
        (<CanvasRenderingContext2D>this._g).beginPath();
        (<CanvasRenderingContext2D>this._g).ellipse(x + width / 2, y + height / 2, width / 2, height / 2, 0, 0, 2 * Math.PI);
        (<CanvasRenderingContext2D>this._g).stroke();
    }

    public FillPolygon(brush: YBrush, points: PointF[]): void
    {

        this.setBrush(brush);
        if (points.length <= 2) return;
        (<CanvasRenderingContext2D>this._g).beginPath();

        if (brush.noAntiAlias)
        {
            (<CanvasRenderingContext2D>this._g).moveTo(Math.round(points[0].X) + 0.5, Math.round(points[0].Y) + 0.5);
            for (let i = 1; i < points.length; i++)
            {
                (<CanvasRenderingContext2D>this._g).lineTo(Math.round(points[i].X) + 0.5, Math.round(points[i].Y) + 0.5);
            }
        }
        else
        {
            (<CanvasRenderingContext2D>this._g).moveTo(points[0].X, points[0].Y);
            for (let i = 1; i < points.length; i++)
            {
                (<CanvasRenderingContext2D>this._g).lineTo(points[i].X, points[i].Y);
            }
        }
        (<CanvasRenderingContext2D>this._g).closePath();
        (<CanvasRenderingContext2D>this._g).fill();

    }

    public DrawPolygon(pen: YPen, points: PointF[]): void
    {

        this.setPen(pen);
        if (points.length <= 1) return;
        (<CanvasRenderingContext2D>this._g).beginPath();
        if (pen.noAntiAlias)
        {
            let offset = (pen.lineWidth == pen.lineWidth >> 0) && ((pen.lineWidth & 1) == 1) ? 0.5 : 0;
            (<CanvasRenderingContext2D>this._g).moveTo(Math.round(points[0].X) + offset, Math.round(points[0].Y) + offset);
            for (let i = 1; i < points.length; i++)
            {
                (<CanvasRenderingContext2D>this._g).lineTo(Math.round(points[i].X) + offset, Math.round(points[i].Y) + offset);
            }
        }
        else
        {
            (<CanvasRenderingContext2D>this._g).moveTo(points[0].X, points[0].Y);
            for (let i = 1; i < points.length; i++)
            {
                (<CanvasRenderingContext2D>this._g).lineTo(points[i].X, points[i].Y);
            }
        }
        (<CanvasRenderingContext2D>this._g).closePath();
        (<CanvasRenderingContext2D>this._g).stroke();

    }

    public DrawLines(pen: YPen, points: PointF[]): void
    {

        this.setPen(pen);
        if (points.length <= 1) return;
        (<CanvasRenderingContext2D>this._g).beginPath();
        (<CanvasRenderingContext2D>this._g).lineCap = "round";
        (<CanvasRenderingContext2D>this._g).lineJoin = "round";
        (<CanvasRenderingContext2D>this._g).moveTo(points[0].X, points[0].Y);
        for (let i = 1; i < points.length; i++)
        {
            (<CanvasRenderingContext2D>this._g).lineTo(points[i].X, points[i].Y);
        }
        (<CanvasRenderingContext2D>this._g).stroke();
    }

    public Dispose(): void
    {
        this._c = null;
        this._g = null;
        this._width = 0;
        this._height = 0;
        this._dpi = 0;
    }

    public get TextRenderingHint(): YTextRenderingHint | null { return this._textRenderingHint; }

    public set TextRenderingHint(value: YTextRenderingHint | null) { this._textRenderingHint = value; }

    public get SmoothingMode(): YSmoothingMode { return this._smoothingMode; }

    public set SmoothingMode(value: YSmoothingMode) { this._smoothingMode = value; }

    public DrawImage(srcimage: HTMLCanvasElement, destRect: YRectangle, srcRect: YRectangle, srcUnit: YGraphicsUnit): void
    {
        // implementation is not complete (coordinates and sizes)
        (<CanvasRenderingContext2D>this._g).drawImage(srcimage, srcRect.x, srcRect.y, srcRect.w, srcRect.h,
            destRect.x, destRect.y, destRect.w, destRect.h)
    }

    public comment(s: string): void { }

}

export class YGraphicsSVG extends YGraphics
{
    private _SVGdefs: YStringBuilder;
    private _SVGcontents: YStringBuilder;
    private _clipcount: number = 0;
    private _clipSectionsToClose: number = 0;
    private _transformSectionsToClose: number = 0;
    private _gradientCount: number = 0;
    static SVGID: number = 0;

    constructor(canvas: HTMLCanvasElement, width: number, height: number, dpi: number)
    {

        super(canvas, width, height, dpi);

        YGraphicsSVG.SVGID++;
        this._SVGdefs = new YStringBuilder();
        this._SVGcontents = new YStringBuilder();
        this._SVGdefs.AppendLine("<clipPath id=\"pageClip_" + YGraphicsSVG.SVGID.toString() + "\"><rect x=\"0\" y=\"0\"  width=\"" + width.toString() + "\" height=\"" + height.toString() + "\"/></clipPath>");
    }

   public static escapeXml(unsafe: string)
    {
     return unsafe.replace(/[^ !#$%(-;=?-z]/g,(c)=>'&#'+c.charCodeAt(0)+';') // MV power!  :-)
    }

    public get_downloadableData(): string
    {
        return "data:image/svg+xml;base64," + btoa(this.get_svgContents());
    }

    public DrawLineXY(p: YPen, x1: number, y1: number, x2: number, y2: number): void
    {
        this._SVGcontents.AppendLine("<line x1=\"" + x1.toString() + "\" "
            + " y1 =\"" + y1.toString() + "\" "
            + " x2 =\"" + x2.toString() + "\" "
            + " y2 =\"" + y2.toString() + "\" "
            + "style = \"stroke:" + p.color.svgCode + ";stroke-opacity:" + p.color.alphaCode + "; stroke-width:" + p.lineWidth.toString() + "\"/>");
    }

    public DrawLine(p: YPen, p1: PointF, p2: PointF): void
    { this.DrawLineXY(p, p1.X, p1.Y, p2.X, p2.Y); }

    public SetClip(rect: YRectangle): void
    {
        this.ResetClip();

        this._SVGdefs.AppendLine("<clipPath id=\"clip_" + YGraphicsSVG.SVGID.toString() + "_" + this._clipcount.toString() + "\"><rect x=\"" + rect.x.toString() + "\" y=\"" + rect.y.toString()
            + "\"  width=\"" + rect.w.toString() + "\" height=\"" + rect.h.toString() + "\"/></clipPath>");
        this._SVGcontents.AppendLine("<g clip-path=\"url(#clip_" + YGraphicsSVG.SVGID.toString() + "_" + this._clipcount.toString() + ")\">");
        this._clipcount++;
        this._clipSectionsToClose++;
    }

    public ResetClip(): void
    {
        if (this._clipSectionsToClose > 0)
        {
            this._SVGcontents.AppendLine("</g>");
            this._clipSectionsToClose--;
        }
    }

    private BrushToSVG(brush: YBrush, revert: boolean): string
    {
        let fillParam: string = "";
        if (brush instanceof YSolidBrush)
        {
            fillParam = "fill = \"" + brush.color.svgCode + "\" fill-opacity=\"" + brush.color.alphaCode + "\" ";
        }
        else if (brush instanceof YLinearGradientBrush)
        {

            this._SVGdefs.AppendLine("<linearGradient id=\"grad_" + YGraphicsSVG.SVGID.toString() + "_" + this._gradientCount + "\" "
                + "x1=\"0%\" "                                 // over-simplified gradient translation as we only use full size vertical gradients.
                + (revert ? "y1=\"100%\" " : "y1=\"0%\" ")    // Yes, I know, it's cheap.
                + "x2=\"0%\" "
                + (revert ? "y2=\"0%\" " : "y2=\"100%\" ") + ">\r\n"
                + "<stop offset=\"0%\" style =\"stop-color:" + brush.color1.svgCode + ";stop-opacity:" + brush.color1.alphaCode + "\"/>\r\n"
                + "<stop offset=\"100%\" style =\"stop-color:" + brush.color2.svgCode + ";stop-opacity:" + brush.color2.alphaCode + "\"/>\r\n"
                + "</linearGradient>");

            fillParam = "fill=\"url(#grad_" + YGraphicsSVG.SVGID.toString() + "_" + this._gradientCount + ")\" ";

            this._gradientCount++;

        }
        else
        {
            throw new ReferenceError("unsupported brush type.");
        }
        return fillParam;
    }

    public FillRectangle(brush: YBrush, rect: YRectangle): void
    {
        this._SVGcontents.AppendLine("<rect x=\"" + rect.x.toString() + "\" "
            + " y =\"" + rect.y.toString() + "\" "
            + " width =\"" + rect.w.toString() + "\" "
            + " height =\"" + rect.h.toString() + "\" "
            + this.BrushToSVG(brush, true)
            + "style=\"stroke-width:0\"/>");

    }

    public FillRectangleXYHW(brush: YBrush, x: number, y: number, width: number, height: number)
    { this.FillRectangle(brush, new YRectangle(x, y, width, height)); }

    public DrawRectangle(p: YPen, rect: YRectangle): void
    {
        this._SVGcontents.AppendLine("<rect x=\"" + rect.x.toString() + "\" "
            + " y =\"" + rect.y.toString() + "\" "
            + " width =\"" + rect.w.toString() + "\" "
            + " height =\"" + rect.h.toString() + "\" "
            + " fill=\"none\" "
            + "style = \"stroke:" + p.color.svgCode + ";stroke-opacity:" + p.color.alphaCode + "; stroke-width:" + p.lineWidth.toString() + "\"/>");

    }

    public DrawRectangleXYHW(p: YPen, x: number, y: number, width: number, height: number): void
    { this.DrawRectangle(p, new YRectangle(x, y, width, height)); }

    public DrawEllipse(pen: YPen, x: number, y: number, width: number, height: number): void

    {
        this._SVGcontents.AppendLine("<ellipse  cx=\"" + (x + width / 2.0).toString() + "\" "
            + " cy =\"" + (y + height / 2.0).toString() + "\" "
            + " rx =\"" + (width / 2).toString() + "\" "
            + " ry =\"" + (height / 2).toString() + "\" "
            + " fill=\"none\" "
            + "style = \"stroke:" + pen.color.svgCode + ";stroke-opacity:" + pen.color.alphaCode + "; stroke-width:" + pen.lineWidth.toString() + "\"/>");
    }

    public FillEllipse(brush: YBrush, x: number, y: number, width: number, height: number): void

    {
        this._SVGcontents.AppendLine("<ellipse  cx=\"" + (x + width / 2.0).toString() + "\" "
            + " cy =\"" + (y + height / 2.0).toString() + "\" "
            + " rx =\"" + (width / 2).toString() + "\" "
            + " ry =\"" + (height / 2).toString() + "\" "
            + this.BrushToSVG(brush, false)
            + "style=\"stroke-width:0\"/>");
    }



    public DrawStringXY(s: string, font: YFont, brush: YBrush, x: number, y: number): void
    {

        let tokens: string[] = s.split('\n');
        for (let i: number = 0; i < tokens.length; i++)
        {
            s = tokens[i];
            this._SVGcontents.AppendLine("<text x=\"" + x.toString() + "\" y=\"" + (y + font.sizeInPoints).toString() + "\" text-anchor=\"start\" "  // dominant-baseline=\"hanging\" " //Not supported in  Inkscape :-(
                + "font-family=\"" + font.name.toString() + "\" "
                + "font-size=\"" + font.sizeInPoints.toString() + "pt\" "
                + "font-weight=\"" + (font.bold ? "bold" : "normal") + "\" "
                + "font-style=\"" + (font.italic ? "italic" : "normal") + "\" "
                + this.BrushToSVG(brush, false)
                + "style=\"stroke-width:0\">\r\n"
                + YGraphicsSVG.escapeXml(s)
                + "\r\n</text>");
            y += (font.sizeInPoints * 1.75);
        }

    }

    public DrawString(s: string, font: YFont, brush: YBrush, p: PointF): void
    {
        if (YGraphics._debugDrawString)
        {
            let pen = new YPen(YColor.Red, 1);
            this.DrawLineXY(pen, p.X - 5, p.Y, p.X + 5, p.Y);
            this.DrawLineXY(pen, p.X, p.Y - 5, p.X, p.Y + 5);
        }
        this.DrawStringXY(s, font, brush, p.X, p.Y);
    }

    public DrawStringF(s: string, font: YFont, brush: YBrush, point: PointF, format: YStringFormat)
    {

        let totalsz: YSizeF = this.MeasureString(s, font, 0);

        let y: number = point.Y + font.size * 1.25;

        switch (format.LineAlignment)
        {
        case YStringFormat.StringAlignment.Near:
            break;
        case YStringFormat.StringAlignment.Center:
            y += -totalsz.height / 2;
            break;
        case YStringFormat.StringAlignment.Far:
            y += -totalsz.height;
            break;

        }

        let tokens: string[] = s.split('\n');

        for (let i: number = 0; i < tokens.length; i++)
        {
            let s: string = tokens[i];
            let sz: YSizeF = this.MeasureString(s, font, 0);
            let x: number = point.X;

            switch (format.Alignment)
            {
            case YStringFormat.StringAlignment.Near:
                break;
            case YStringFormat.StringAlignment.Center:
                x += -sz.width / 2;
                break;
            case YStringFormat.StringAlignment.Far:
                x += -sz.width;
                break;

            }

            this._SVGcontents.AppendLine("<text x=\"" + x.toString() + "\" y=\"" + y.toString() + "\" text-anchor=\"start\" "  // dominant-baseline=\"hanging\" " //Not supported in  Inkscape :-(
                + "font-family=\"" + font.name.toString() + "\" "
                + "font-size=\"" + font.sizeInPoints.toString() + "pt\" "
                + "font-weight=\"" + (font.bold ? "bold" : "normal") + "\" "
                + "font-style=\"" + (font.italic ? "italic" : "normal") + "\" "
                + this.BrushToSVG(brush, false)
                + "style=\"stroke-width:0\">\r\n"
                + YGraphicsSVG.escapeXml(s)
                + "\r\n</text>");

            y += (font.sizeInPoints * 1.75);
        }

    }

    public DrawStringRect(s: string, font: YFont, brush: YBrush, layoutRectangle: YRectangle, format: YStringFormat)

    {
        if (YGraphics._debugDrawString)
        {
            let pen = new YPen(YColor.Red, 1);
            this.DrawRectangle(pen, layoutRectangle);
        }

        let totalsz: YSizeF = this.MeasureString(s, font, 0);

        let y: number = layoutRectangle.y + font.sizeInPoints * 1.1;

        switch (format.LineAlignment)
        {
        case YStringFormat.StringAlignment.Near:
            break;
        case YStringFormat.StringAlignment.Center:
            y += (layoutRectangle.h - totalsz.height) / 2;
            break;
        case YStringFormat.StringAlignment.Far:
            y += (layoutRectangle.h - totalsz.height);
            break;

        }

        let tokens: string[] = s.split('\n');

        for (let i: number = 0; i < tokens.length; i++)
        {
            let s: string = tokens[i];
            let sz: YSizeF = this.MeasureString(s, font, 0);
            let x: number = layoutRectangle.x;
            switch (format.Alignment)
            {
            case YStringFormat.StringAlignment.Near:
                break;
            case YStringFormat.StringAlignment.Center:
                x += (layoutRectangle.w - sz.width) / 2;
                break;
            case YStringFormat.StringAlignment.Far:
                x += (layoutRectangle.w - sz.width);
                break;

            }

            this._SVGcontents.AppendLine("<text x=\"" + x.toString() + "\" y=\"" + y.toString() + "\" text-anchor=\"start\" "  // dominant-baseline=\"hanging\" " //Not supported in  Inkscape :-(
                + "font-family=\"" + font.name.toString() + "\" "
                + "font-size=\"" + (font.sizeInPoints * 1.1).toString() + "pt\" "
                + "font-weight=\"" + (font.bold ? "bold" : "normal") + "\" "
                + "font-style=\"" + (font.italic ? "italic" : "normal") + "\" "
                + this.BrushToSVG(brush, false)
                + "style=\"stroke-width:0\">\r\n"
                + YGraphicsSVG.escapeXml(s)
                + "\r\n</text>");
            y += (font.sizeInPoints * 1.75);
        }

    }

    public Transform(dx: number, dy: number, angle: number): void
    {
        this._SVGcontents.AppendLine("<g transform=\"translate(" + dx.toString() + " " + dy.toString() + ") rotate(" + (180 * angle / Math.PI).toString() + ")\">");
        this._transformSectionsToClose++;

    }

    public ResetTransform(): void
    {
        if (this._transformSectionsToClose > 0)
        {
            this._SVGcontents.AppendLine("</g>");
            this._transformSectionsToClose--;
        }
    }

    public DrawPolygon(pen: YPen, points: PointF[]): void
    {
        if (points.length < 2) return;

        this._SVGcontents.Append("<path  d=\"M " + points[0].X.toString() + " " + points[0].Y.toString());
        for (let i: number = 1; i < points.length; i += 1)
        {
            this._SVGcontents.Append(" L " + points[i].X.toString() + " " + points[i].Y.toString());
        }

        this._SVGcontents.AppendLine(" z\" fill=\"none\" "
            + "style=\"stroke:" + pen.color.svgCode + ";stroke-opacity:" + pen.color.alphaCode + "; stroke-width:" + pen.lineWidth.toString() + "\"/>");
    }

    public DrawLines(pen: YPen, points: PointF[]): void
    {
        if (points.length < 2) return;

        this._SVGcontents.Append("<path  d=\"M " + points[0].X.toString() + " " + points[0].Y.toString());
        for (let i: number = 1; i < points.length; i++)
        {
            this._SVGcontents.Append(" L " + points[i].X.toString() + " " + points[i].Y.toString());
        }

        this._SVGcontents.AppendLine("\" fill=\"none\" "
            + "style=\"stroke:" + pen.color.svgCode + ";stroke-opacity:" + pen.color.alphaCode + "; stroke-linecap:round; stroke-linejoin:round;stroke-width:" + pen.lineWidth.toString() + "\"/>");
    }

    public FillPolygon(brush: YBrush, points: PointF[]): void
    {
        if (points.length < 2) return;

        this._SVGcontents.Append("<path  d=\"M " + points[0].X.toString() + " " + points[0].Y.toString());
        for (let i: number = 1; i < points.length; i++)
        {
            this._SVGcontents.Append(" L " + points[i].X.toString() + " " + points[i].Y.toString());
        }
        this._SVGcontents.AppendLine(" z\" " + this.BrushToSVG(brush, false)
            + "style=\"stroke-width:0\"/>\r\n");
    }

    public DrawImage(image: HTMLCanvasElement, destRect: YRectangle, srcRect: YRectangle, srcUnit: YGraphicsUnit): void
    { throw new Error("DrawImage not supported, find an other way."); }

    public save(filename: string): void
    {
        throw new Error("Direct save to file not supported.");
    }

    public comment(s: string): void { this._SVGcontents.AppendLine("<!--" + s + "-->"); }

    public get_svgContents(): string
    {
        let physicalWidth: string = (2.54 * (this._width / this._dpi)).toFixed(3);
        let physicalheight: string = (2.54 * (this._height / this._dpi)).toFixed(3);

        while (this._clipSectionsToClose > 0)
        {
            this._SVGcontents.AppendLine("</g>");
            this._clipSectionsToClose--;
        }
        while (this._transformSectionsToClose > 0)
        {
            this._SVGcontents.AppendLine("</g>");
            this._transformSectionsToClose--;
        }

        return "<?xml version = \"1.0\" standalone = \"no\" ?>\r\n"
            + "<!DOCTYPE svg PUBLIC \"-//W3C//DTD SVG 1.1//EN\" \"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd\">\r\n"
            + "<svg width = \"" + physicalWidth + "cm\" height = \"" + physicalheight + "cm\" viewBox = \"0 0 " + this._width.toString() + " " + this._height.toString() + "\" "
            + "xmlns = \"http://www.w3.org/2000/svg\" version = \"1.1\" >\r\n"
            + "<defs>\r\n"
            + this._SVGdefs.contents
            + "</defs>\r\n"
            + "<g clip-path=\"url(#pageClip_" + YGraphicsSVG.SVGID.toString() + ")\">\r\n"
            + this._SVGcontents.contents
            + "</g>\r\n"
            + "</svg>\n";

    }
}


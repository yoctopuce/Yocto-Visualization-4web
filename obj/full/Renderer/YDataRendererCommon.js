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
export class Vector3 {
    constructor(a, b, c) {
        this.a = a;
        this.b = b;
        this.c = c;
    }
    static FromXYCoord(x, y) { return new Vector3(x, y, 1); }
    multiplyByM(m) {
        return new Vector3(m.a * this.a + m.b * this.b + m.c * this.c, m.d * this.a + m.e * this.b + m.f * this.c, m.g * this.a + m.h * this.b + m.i * this.c);
    }
    multiplyByN(n) {
        return new Vector3(this.a * n, this.b * n, this.c * n);
    }
    AddV(v) {
        return new Vector3(this.a + v.a, this.b + v.b, this.c + v.c);
    }
    SubstractV(v) {
        return new Vector3(this.a - v.a, this.b - v.b, this.c - v.c);
    }
    toPointF() { return new PointF(this.a, this.b); }
    toPoint() { return new Point(this.a, this.b); }
}
export class Matrix3x3 {
    // don't use the constructor directly but newMatrix, newTranslateMatrix, newRotateMatrix etc...
    constructor(a, b, c, d, e, f, g, h, i, flags) {
        this.a = a;
        this.b = b;
        this.c = c;
        this.d = d;
        this.e = e;
        this.f = f;
        this.g = g;
        this.h = h;
        this.i = i;
        if ((b == 0) && (d == 0) && (a == 1) && (e == 1) && (i == 1) && (g == 0) && (h == 0)) {
            flags |= Matrix3x3.Flag_TRANSLATION;
            if ((c == 0) && (f == 0))
                flags |= Matrix3x3.Flag_IDENTITY;
        }
        this.isTranslation = (flags & Matrix3x3.Flag_TRANSLATION) != 0;
        this.isIdentity = (flags & Matrix3x3.Flag_IDENTITY) != 0;
    }
    clone() {
        let flag = 0;
        if (this.isTranslation)
            flag |= Matrix3x3.Flag_TRANSLATION;
        if (this.isIdentity)
            flag |= Matrix3x3.Flag_IDENTITY;
        return new Matrix3x3(this.a, this.b, this.c, this.d, this.e, this.f, this.g, this.h, this.i, flag);
    }
    get determinant() {
        let detA = this.e * this.i - this.h * this.f;
        let detB = this.d * this.i - this.g * this.f;
        let detC = this.d * this.h - this.g * this.e;
        return this.a * detA + -this.b * detB + this.c * detC;
    }
    get transpose() {
        if (this.isIdentity)
            return Matrix3x3.newIdentityMatrix();
        return new Matrix3x3(this.a, this.d, this.g, this.b, this.e, this.h, this.c, this.f, this.i, Matrix3x3.Flag_NONE);
    }
    multiplyByV(v) {
        if (this.isTranslation)
            return new Vector3(this.c + v.a, this.f + v.b, 1);
        return new Vector3(this.a * v.a + this.b * v.b + this.c * v.c, this.d * v.a + this.e * v.b + this.f * v.c, this.g * v.a + this.h * v.b + this.i * v.c);
    }
    static newMatrix(a, b, c, d, e, f, g, h, i) {
        return new Matrix3x3(a, b, c, d, e, f, g, h, i, Matrix3x3.Flag_NONE);
    }
    static newTranslateMatrix(offsetX, offsetY) {
        let flag = Matrix3x3.Flag_TRANSLATION;
        if ((offsetX == 0) && (offsetY == 0))
            flag |= Matrix3x3.Flag_IDENTITY;
        return new Matrix3x3(1, 0, offsetX, 0, 1, offsetY, 0, 0, 1, flag);
    }
    static newRotateMatrix(AngleDeg) {
        AngleDeg = Math.PI * AngleDeg / 180;
        return new Matrix3x3(Math.cos(AngleDeg), -Math.sin(AngleDeg), 0, Math.sin(AngleDeg), -Math.cos(AngleDeg), 0, 0, 0, 1, Matrix3x3.Flag_NONE);
    }
    static newScaleMatrix(Coef) {
        return new Matrix3x3(Coef, 0, 0, 0, Coef, 0, 0, 0, 1, Matrix3x3.Flag_NONE);
    }
    static newIdentityMatrix() {
        return new Matrix3x3(1, 0, 0, 0, 1, 0, 0, 0, 1, Matrix3x3.Flag_IDENTITY | Matrix3x3.Flag_TRANSLATION);
    }
    toCSS() {
        return "matrix(" + this.a.toString() + "," + this.d.toString() + ","
            + this.b.toString() + "," + this.e.toString() + ","
            + this.c.toString() + "," + this.f.toString() + ")";
    }
    toString() {
        return "| " + this.a.toFixed(2) + " " + this.b.toFixed(2) + " " + this.c.toFixed(2) + " |" + (this.isIdentity ? " I" : "") + "\n"
            + "| " + this.d.toFixed(2) + " " + this.e.toFixed(2) + " " + this.f.toFixed(2) + " |" + (this.isTranslation ? " T" : "") + "\n"
            + "| " + this.g.toFixed(2) + " " + this.g.toFixed(2) + " " + this.i.toFixed(2) + " |\n";
    }
    multiplyByM(m) {
        // | a b c |
        // | d e f |
        // | g h i |
        if (this.isIdentity)
            return m.clone();
        if (m.isIdentity)
            return this.clone();
        if ((this.isTranslation) && (m.isTranslation))
            return Matrix3x3.newTranslateMatrix(this.c + m.c, this.f + m.f);
        return new Matrix3x3(this.a * m.a + this.b * m.d + this.c * m.g, this.a * m.b + this.b * m.e + this.c * m.h, this.a * m.c + this.b * m.f + this.c * m.i, this.d * m.a + this.e * m.d + this.f * m.g, this.d * m.b + this.e * m.e + this.f * m.h, this.d * m.c + this.e * m.f + this.f * m.i, this.g * m.a + this.h * m.d + this.i * m.g, this.g * m.b + this.h * m.e + this.i * m.h, this.g * m.c + this.h * m.f + this.i * m.i, Matrix3x3.Flag_NONE);
    }
    get inverse() {
        // | a b c |   | a d g |
        // | d e f |   | b e h |
        // | g h i |   | c f i |
        if (this.isIdentity)
            return Matrix3x3.newIdentityMatrix();
        if (this.isTranslation)
            return Matrix3x3.newTranslateMatrix(-this.c, -this.f);
        let det = this.determinant;
        if (det == 0)
            throw "matrix cannot be inverted";
        let detA = this.e * this.i - this.f * this.h;
        let detB = this.b * this.i - this.c * this.h;
        let detC = this.b * this.f - this.c * this.e;
        let detD = this.d * this.i - this.f * this.g;
        let detE = this.a * this.i - this.c * this.g;
        let detF = this.a * this.f - this.c * this.d;
        let detG = this.d * this.h - this.e * this.g;
        let detH = this.a * this.h - this.b * this.g;
        let detI = this.a * this.e - this.b * this.d;
        return new Matrix3x3(detA / det, -detB / det, detC / det, -detD / det, detE / det, -detF / det, detG / det, -detH / det, detI / det, Matrix3x3.Flag_NONE);
    }
    log() {
        console.log(this.toString());
    }
}
Matrix3x3.Flag_NONE = 0;
Matrix3x3.Flag_IDENTITY = 1;
Matrix3x3.Flag_TRANSLATION = 2;
// enum emulation (javascript enum are so lame, we had to make ours)
//  usage example
//
//  export class  HrzAlignment extends YDataRendering.YEnum
//      { public static readonly LEFT   = new  YDataRendering.YEnumItem("LEFT","Left");
//        public static readonly CENTER = new  YDataRendering.YEnumItem("CENTER","Center");
//        public static readonly DECIMAL= new  YDataRendering.YEnumItem("DECIMAL","Decimal");
//        public static readonly RIGHT  = new  YDataRendering.YEnumItem("RIGHT","Right");
//     }
export class YEnum {
    static fromString(container, value) {
        let p = Object.getOwnPropertyNames(container);
        for (let i = 0; i < p.length; i++) {
            if (p[i] == value)
                return container[value];
        }
        throw "YEnum" + value + " is not a " + container + " value";
    }
    static siblings(container) {
        let res = [];
        let p = Object.getOwnPropertyNames(container);
        for (let i = 0; i < p.length; i++) {
            if (container[p[i]] instanceof YEnumItem) {
                res.push(container[p[i]]);
            }
        }
        return res;
    }
}
export class YEnumItem {
    constructor(value, humanreadable, container) {
        this._value = value;
        this._container = container;
        this._humanreadable = humanreadable;
    }
    fromString(value) { return YEnum.fromString(this._container, value); }
    get toString() { return this._value.toString(); }
    get description() { return this._humanreadable; }
    get sibblings() { return YEnum.siblings(this._container); }
}
export class ViewPortSettings {
    constructor() {
        this.IRLx = 0;
        this.IRLy = 0;
        this.zoomx = 0;
        this.zoomy = 0;
        this.Lmargin = 0;
        this.Rmargin = 0;
        this.Tmargin = 0;
        this.Bmargin = 0;
        this.Width = 0;
        this.Height = 0;
        this.Capture = false;
        this.IRLCaptureStartX = 0;
        this.CaptureStartY = 0;
        this.OriginalXAxisMin = 0;
        this.OriginalXAxisMax = 0;
        this.OriginalIRLx = 0;
        this.OriginalLmargin = 0;
        this.OriginalZoomx = 0;
    }
}
export class YFont {
    get userData() { return this._userData; }
    set userData(value) { this._userData = value; }
    get directParent() { return this._directParent; }
    constructor(parentRenderer, directParent, size, fontChangeCallback) {
        this._userData = null;
        this._fontChangeCallback = null;
        this._name = "Arial";
        this._italic = false;
        this._bold = false;
        this._color = YColor.Black;
        // if alternate color si set, then it will be used instead of regular color
        this._alternateColor = null;
        this._font = null;
        this._brush = new YSolidBrush(YColor.Black);
        this._parentRenderer = parentRenderer;
        this._directParent = directParent;
        this._fontChangeCallback = fontChangeCallback ? fontChangeCallback : null;
        this._size = new Proportional(size ? size : 10, Proportional.ResizeRule.FIXED, parentRenderer, this, this.ResetFont);
    }
    ResetFont(source) {
        this._font = null;
        if (source != null)
            this._parentRenderer.ProportionnalValueChanged(source);
    }
    get name() { return this._name; }
    set name(value) {
        this._name = value;
        this.ResetFont(null);
        this._parentRenderer.redraw();
    }
    get hasChanged() { return this._font == null; }
    get size() { return this._size.value; }
    set size(value) {
        if (value <= 0)
            throw new RangeError("Size must be a positive value");
        value = (Math.round(100 * value) / 100);
        this._size.value = value;
        this.ResetFont(null);
        if (this._fontChangeCallback != null)
            this._fontChangeCallback(this);
        this._parentRenderer.redraw();
    }
    get italic() { return this._italic; }
    set italic(value) {
        if (this._italic != value) {
            this._italic = value;
            this.ResetFont(null);
            this._parentRenderer.redraw();
        }
    }
    get bold() { return this._bold; }
    set bold(value) {
        if (this._bold != value) {
            this._bold = value;
            this.ResetFont(null);
            this._parentRenderer.redraw();
        }
    }
    get color() { return this._color; }
    set color(value) {
        if (this._color != value) {
            this._color = value;
            this._brush = null;
            this._parentRenderer.redraw();
        }
    }
    get alternateColor() { return this._alternateColor; }
    set alternateColor(value) {
        if (this._alternateColor != value) {
            this._alternateColor = value;
            this._brush = null;
            this._parentRenderer.redraw();
        }
    }
    get fontObject() { return this._name ? this._name : "Arial"; }
    get brush() {
        if (this._brush == null)
            this._brush = new YSolidBrush(this._alternateColor != null ? this._alternateColor : this._color);
        return this._brush;
    }
    get sizeInPoints() { return this._size.value * 0.75; }
    get sizeForCanvas() { return this._size.value * 1.15; }
    get htmlCode() {
        return (this._italic ? "italic " : "") + (this._bold ? "bold " : "") + this.sizeForCanvas.toString() + "px " + this._name;
    }
}
export class YSizeF {
    constructor(font, st) {
        this._w = 0;
        this._h = 0;
        this._lines = [];
        this._linesCount = 0;
        this._lineHeight = 0;
        this._firstlineHeight = 0;
        if (font != null) {
            this._lineHeight = font.size * 1.25;
            this._firstlineHeight = this._lineHeight * 0.75;
            if (st.indexOf("\n") < 0) {
                this._lines = [st];
                this._linesCount = 1;
            }
            else {
                this._lines = st.split("\n");
                this._linesCount = this._lines.length;
            }
        }
    }
    get lines() { return this._lines; }
    get linesCount() { return this._linesCount; }
    get firstLineHeight() { return this._firstlineHeight; }
    get lineHeight() { return this._lineHeight; }
    get height() { return this._h; }
    get width() { return this._w; }
    set width(value) {
        this._w = value;
    }
    set height(value) {
        this._h = value;
    }
}
export class YTextRenderingHint {
    constructor(value) {
        this._value = 0;
        this._value = value;
    }
    ;
}
YTextRenderingHint.SystemDefault = new YTextRenderingHint(0);
YTextRenderingHint.SingleBitPerPixelGridFit = new YTextRenderingHint(1);
YTextRenderingHint.SingleBitPerPixel = new YTextRenderingHint(2);
YTextRenderingHint.AntiAliasGridFit = new YTextRenderingHint(3);
YTextRenderingHint.AntiAlias = new YTextRenderingHint(4);
YTextRenderingHint.ClearTypeGridFit = new YTextRenderingHint(5);
export class YSmoothingMode {
    constructor(value) {
        this._value = 0;
        this._value = value;
    }
    ;
}
YSmoothingMode.Invalid = new YSmoothingMode(-1);
YSmoothingMode.Default = new YSmoothingMode(0);
YSmoothingMode.HighSpeed = new YSmoothingMode(1);
YSmoothingMode.HighQuality = new YSmoothingMode(2);
YSmoothingMode.None = new YSmoothingMode(3);
YSmoothingMode.AntiAlias = new YSmoothingMode(4);
class YStringBuilder {
    constructor() {
        this._str = "";
    }
    AppendLine(s) { this._str += s + "\n"; }
    Append(s) { this._str += s; }
    get contents() { return this._str; }
}
export class YStringFormat {
    get Alignment() { return this._Alignment; }
    set Alignment(value) { this._Alignment = value; }
    get LineAlignment() { return this._LineAlignment; }
    set LineAlignment(value) { this._LineAlignment = value; }
    get FormatFlags() { return this._formatFlags; }
    set FormatFlags(value) { this._formatFlags = value; }
    get Trimming() { return this._Trimming; }
    set Trimming(value) { this._Trimming = value; }
    constructor(clip) {
        this._Alignment = 0 /* YStringFormat.StringAlignment.Near */;
        this._LineAlignment = 0 /* YStringFormat.StringAlignment.Near */;
        this._formatFlags = 0 /* YStringFormat.StringFormatFlags.default */;
        this._Trimming = 0 /* YStringFormat.StringTrimming.None */;
        this._clip = 16384 /* YStringFormat.StringFormatFlags.NoClip */;
        this._clip = clip;
    }
}
export class YColor {
    get name() { return this._name; }
    set predefname(value) { this._name = value; }
    static get predefinedColors() {
        if (YColor._predefinedColors == null) {
            YColor._predefinedColors = {};
            let names = Object.getOwnPropertyNames(YColor);
            for (let i = 0; i < names.length; i++) {
                if (YColor[names[i]] instanceof YColor) {
                    YColor._predefinedColors[names[i]] = YColor[names[i]];
                    YColor._predefinedColors[names[i]].predefname = names[i];
                }
            }
        }
        return YColor._predefinedColors;
    }
    static FromString(value) {
        let valueUpper = value.toUpperCase();
        let propNames = Object.getOwnPropertyNames(YColor);
        for (let i = 0; i < propNames.length; i++) {
            if (propNames[i].toUpperCase() == valueUpper) {
                if (YColor[propNames[i]] instanceof YColor) {
                    return YColor[propNames[i]];
                    //let o: object = Reflect.get(YColor, value);
                    //if (o instanceof YColor) return o as YColor;
                }
            }
        }
        if ((value.length == 7) && (value.substr(0, 1).toUpperCase() == '#')) {
            let r = parseInt(value.substr(1, 2), 16);
            let g = parseInt(value.substr(3, 2), 16);
            let b = parseInt(value.substr(5, 2), 16);
            return new YColor(false, 255, r, g, b);
        }
        if (value.length == 12) {
            if (value.substr(0, 4).toUpperCase() == 'RGB:') {
                let alpha = parseInt(value.substr(4, 2), 16);
                let r = parseInt(value.substr(6, 2), 16);
                let g = parseInt(value.substr(8, 2), 16);
                let b = parseInt(value.substr(10, 2), 16);
                return new YColor(false, alpha, r, g, b);
            }
            else if (value.substr(0, 4).toUpperCase() == 'HSL:') {
                let alpha = parseInt(value.substr(4, 2), 16);
                let h = parseInt(value.substr(6, 2), 16);
                let s = parseInt(value.substr(8, 2), 16);
                let l = parseInt(value.substr(10, 2), 16);
                return new YColor(true, alpha, h, s, l);
            }
        }
        return null;
        // return   YColor.Black;  // unknown color, sorry
    }
    static hex(v) {
        let s = v.toString(16);
        if (s.length <= 1)
            return "0" + s;
        return s;
    }
    toString() {
        if (this.isHSLColor) {
            return "HSL:" + (YColor.hex(this.transparency) + YColor.hex(this.h) + YColor.hex(this.s) + YColor.hex(this.l)).toUpperCase();
        }
        else { // might need some optimization
            let propNames = Object.getOwnPropertyNames(YColor);
            for (let i = 0; i < propNames.length; i++) {
                let o = Reflect.get(YColor, propNames[i]);
                let c = o;
                if ((c.alpha == this.alpha) && (c.red == this.red) && (c.green == this.green) && (c.blue == this.blue))
                    return propNames[i];
            }
        }
        return "RGB:" + (YColor.hex(this.transparency) + YColor.hex(this.r) + YColor.hex(this.g) + YColor.hex(this.b)).toUpperCase();
    }
    get svgCode() { return "rgb(" + this.r.toString() + ", " + this.g.toString() + ", " + this.b.toString() + ")"; }
    get alphaCode() { return (this.transparency / 255.0).toFixed(3); }
    static hsl2rgbInt(temp1, temp2, temp3) {
        if (temp3 >= 170)
            return ((temp1 + 127) / 255) >> 0;
        if (temp3 > 42) {
            if (temp3 <= 127)
                return ((temp2 + 127) / 255) >> 0;
            temp3 = 170 - temp3;
        }
        return ((temp1 * 255 + (temp2 - temp1) * (6 * temp3) + 32512) / 65025) >> 0;
    }
    hsl2rgb() {
        let temp1;
        let temp2;
        let temp3;
        this.rgbConvertionDone = true;
        if (this.s == 0) {
            this.r = this.l;
            this.g = this.l;
            this.b = this.l;
            return;
        }
        if (this.l <= 127) {
            temp2 = this.l * (255 + this.s);
        }
        else {
            temp2 = (this.l + this.s) * (255) - this.l * this.s;
        }
        temp1 = (510) * this.l - temp2;
        // R
        temp3 = (this.h + 85);
        if (temp3 > 255)
            temp3 = temp3 - 255;
        this.r = YColor.hsl2rgbInt(temp1, temp2, temp3);
        // G
        temp3 = this.h;
        if (temp3 > 255)
            temp3 = temp3 - 255;
        this.g = YColor.hsl2rgbInt(temp1, temp2, temp3);
        // B
        if (this.h >= 85) {
            temp3 = this.h - 85;
        }
        else {
            temp3 = this.h + 170;
        }
        this.b = YColor.hsl2rgbInt(temp1, temp2, temp3);
        if (this.r > 255)
            this.r = 255; // just in case
        if (this.g > 255)
            this.g = 255;
        if (this.b > 255)
            this.b = 255;
    }
    computeHSL() {
        let R = this.r;
        let G = this.g;
        let B = this.b;
        let H;
        let S;
        let L;
        let max = (R > G ? R : G);
        let min = (R < G ? R : G);
        let correction = 0;
        let divisor = 0;
        this.hslConvertionDone = true;
        if (B > max)
            max = B;
        if (B < min)
            min = B;
        L = ((max + min + 1) / 2) >> 0;
        if (max == min) {
            this.h = 0;
            this.s = 0;
            this.l = L;
            return;
        }
        correction = ((max + min) / 2) >> 0;
        if (L <= 127) {
            S = ((255 * (max - min) + correction) / (max + min)) >> 0;
        }
        else {
            S = ((255 * (max - min) + 255 - correction) / (510 - (max + min))) >> 0;
        }
        correction = 3 * (max - min);
        divisor = 2 * correction;
        if (R == max) {
            H = 0;
            R = G;
            G = B;
        }
        else if (G == max) {
            H = 85;
            G = R;
            R = B;
        }
        else {
            H = 170;
        }
        if (R >= G) {
            H += ((255 * (R - G) + correction) / divisor) >> 0;
        }
        else {
            H += 255 - ((255 * (G - R) - correction) / divisor) >> 0;
        }
        if (H > 255)
            H -= 255;
        if (S > 255)
            S = 255; // just in case
        if (L > 255)
            L = 255;
        this.h = H;
        this.s = S;
        this.l = L;
    }
    get hue() {
        if (!this.hslConvertionDone)
            this.computeHSL();
        return this.h;
    }
    get saturation() {
        if (!this.hslConvertionDone)
            this.computeHSL();
        return this.s;
    }
    get luminosity() {
        if (!this.hslConvertionDone)
            this.computeHSL();
        return this.l;
    }
    get red() {
        if (!this.rgbConvertionDone)
            this.hsl2rgb();
        return this.r;
    }
    get green() {
        if (!this.rgbConvertionDone)
            this.hsl2rgb();
        return this.g;
    }
    get blue() {
        if (!this.rgbConvertionDone)
            this.hsl2rgb();
        return this.b;
    }
    get alpha() {
        return this.transparency;
    }
    static FromArgb(a, r, g, b) {
        return new YColor(false, a, r, g, b);
    }
    static FromAhsl(a, h, s, l) {
        return new YColor(true, a, h, s, l);
    }
    get isHSL() { return this.isHSLColor; }
    get isRGB() { return !this.isHSLColor; }
    equal(c) {
        if (this.isHSLColor) {
            if (!c.isHSLColor)
                return false;
            if (c.hue != this.hue)
                return false;
            if (c.saturation != this.saturation)
                return false;
            if (c.luminosity != this.luminosity)
                return false;
            if (c.alpha != this.alpha)
                return false;
        }
        else {
            if (c.isHSLColor)
                return false;
            if (c.red != this.red)
                return false;
            if (c.green != this.green)
                return false;
            if (c.blue != this.blue)
                return false;
            if (c.alpha != this.alpha)
                return false;
        }
        return true;
    }
    clone() {
        if (this.isHSLColor)
            return new YColor(true, this.transparency, this.h, this.s, this.l, this.isPredefined);
        return new YColor(false, this.transparency, this.r, this.g, this.b, this.isPredefined);
    }
    get isPredefined() { return this._isPredefined; }
    constructor(isHsl, transparency, r_h, g_s, b_l, isPredefined) {
        this.hslConvertionDone = false;
        this.rgbConvertionDone = false;
        this.transparency = 0;
        this.r = 0;
        this.g = 0;
        this.b = 0;
        this.h = 0;
        this.s = 0;
        this.l = 0;
        this._name = "";
        this._htmlcode = this.computeHTMLCode();
        this.hslConvertionDone = isHsl;
        this.isHSLColor = isHsl;
        this.transparency = transparency;
        this._isPredefined = isPredefined === true;
        if (isHsl) {
            this.h = r_h;
            this.s = g_s;
            this.l = b_l;
            this.hsl2rgb();
        }
        else {
            this.r = r_h;
            this.g = g_s;
            this.b = b_l;
            this.rgbConvertionDone = true;
        }
        this._htmlcode = this.computeHTMLCode();
    }
    computeHTMLCode() {
        let a = this.transparency / 255;
        let r = this.r;
        let g = this.g;
        let b = this.b;
        return "rgba(" + r + "," + g + "," + b + "," + a.toFixed(3) + ")";
    }
    get htmlCode() { return this._htmlcode; }
}
YColor.AliceBlue = new YColor(false, 0xFF, 0xF0, 0xF8, 0xFF, true);
YColor.AntiqueWhite = new YColor(false, 0xFF, 0xFA, 0xEB, 0xD7, true);
YColor.Aqua = new YColor(false, 0xFF, 0x00, 0xFF, 0xFF, true);
YColor.Aquamarine = new YColor(false, 0xFF, 0x7F, 0xFF, 0xD4, true);
YColor.Azure = new YColor(false, 0xFF, 0xF0, 0xFF, 0xFF, true);
YColor.Beige = new YColor(false, 0xFF, 0xF5, 0xF5, 0xDC, true);
YColor.Bisque = new YColor(false, 0xFF, 0xFF, 0xE4, 0xC4, true);
YColor.Black = new YColor(false, 0xFF, 0x00, 0x00, 0x00, true);
YColor.BlanchedAlmond = new YColor(false, 0xFF, 0xFF, 0xEB, 0xCD, true);
YColor.Blue = new YColor(false, 0xFF, 0x00, 0x00, 0xFF, true);
YColor.BlueViolet = new YColor(false, 0xFF, 0x8A, 0x2B, 0xE2, true);
YColor.Brown = new YColor(false, 0xFF, 0xA5, 0x2A, 0x2A, true);
YColor.BurlyWood = new YColor(false, 0xFF, 0xDE, 0xB8, 0x87, true);
YColor.CadetBlue = new YColor(false, 0xFF, 0x5F, 0x9E, 0xA0, true);
YColor.Chartreuse = new YColor(false, 0xFF, 0x7F, 0xFF, 0x00, true);
YColor.Chocolate = new YColor(false, 0xFF, 0xD2, 0x69, 0x1E, true);
YColor.Coral = new YColor(false, 0xFF, 0xFF, 0x7F, 0x50, true);
YColor.CornflowerBlue = new YColor(false, 0xFF, 0x64, 0x95, 0xED, true);
YColor.Cornsilk = new YColor(false, 0xFF, 0xFF, 0xF8, 0xDC, true);
YColor.Crimson = new YColor(false, 0xFF, 0xDC, 0x14, 0x3C, true);
YColor.Cyan = new YColor(false, 0xFF, 0x00, 0xFF, 0xFF, true);
YColor.DarkBlue = new YColor(false, 0xFF, 0x00, 0x00, 0x8B, true);
YColor.DarkCyan = new YColor(false, 0xFF, 0x00, 0x8B, 0x8B, true);
YColor.DarkGoldenrod = new YColor(false, 0xFF, 0xB8, 0x86, 0x0B, true);
YColor.DarkGray = new YColor(false, 0xFF, 0xA9, 0xA9, 0xA9, true);
YColor.DarkGreen = new YColor(false, 0xFF, 0x00, 0x64, 0x00, true);
YColor.DarkKhaki = new YColor(false, 0xFF, 0xBD, 0xB7, 0x6B, true);
YColor.DarkMagenta = new YColor(false, 0xFF, 0x8B, 0x00, 0x8B, true);
YColor.DarkOliveGreen = new YColor(false, 0xFF, 0x55, 0x6B, 0x2F, true);
YColor.DarkOrange = new YColor(false, 0xFF, 0xFF, 0x8C, 0x00, true);
YColor.DarkOrchid = new YColor(false, 0xFF, 0x99, 0x32, 0xCC, true);
YColor.DarkRed = new YColor(false, 0xFF, 0x8B, 0x00, 0x00, true);
YColor.DarkSalmon = new YColor(false, 0xFF, 0xE9, 0x96, 0x7A, true);
YColor.DarkSeaGreen = new YColor(false, 0xFF, 0x8F, 0xBC, 0x8F, true);
YColor.DarkSlateBlue = new YColor(false, 0xFF, 0x48, 0x3D, 0x8B, true);
YColor.DarkSlateGray = new YColor(false, 0xFF, 0x2F, 0x4F, 0x4F, true);
YColor.DarkTurquoise = new YColor(false, 0xFF, 0x00, 0xCE, 0xD1, true);
YColor.DarkViolet = new YColor(false, 0xFF, 0x94, 0x00, 0xD3, true);
YColor.DeepPink = new YColor(false, 0xFF, 0xFF, 0x14, 0x93, true);
YColor.DeepSkyBlue = new YColor(false, 0xFF, 0x00, 0xBF, 0xFF, true);
YColor.DimGray = new YColor(false, 0xFF, 0x69, 0x69, 0x69, true);
YColor.DodgerBlue = new YColor(false, 0xFF, 0x1E, 0x90, 0xFF, true);
YColor.Firebrick = new YColor(false, 0xFF, 0xB2, 0x22, 0x22, true);
YColor.FloralWhite = new YColor(false, 0xFF, 0xFF, 0xFA, 0xF0, true);
YColor.ForestGreen = new YColor(false, 0xFF, 0x22, 0x8B, 0x22, true);
YColor.Fuchsia = new YColor(false, 0xFF, 0xFF, 0x00, 0xFF, true);
YColor.Gainsboro = new YColor(false, 0xFF, 0xDC, 0xDC, 0xDC, true);
YColor.GhostWhite = new YColor(false, 0xFF, 0xF8, 0xF8, 0xFF, true);
YColor.Gold = new YColor(false, 0xFF, 0xFF, 0xD7, 0x00, true);
YColor.Goldenrod = new YColor(false, 0xFF, 0xDA, 0xA5, 0x20, true);
YColor.Gray = new YColor(false, 0xFF, 0x80, 0x80, 0x80, true);
YColor.Green = new YColor(false, 0xFF, 0x00, 0x80, 0x00, true);
YColor.GreenYellow = new YColor(false, 0xFF, 0xAD, 0xFF, 0x2F, true);
YColor.Honeydew = new YColor(false, 0xFF, 0xF0, 0xFF, 0xF0, true);
YColor.HotPink = new YColor(false, 0xFF, 0xFF, 0x69, 0xB4, true);
YColor.IndianRed = new YColor(false, 0xFF, 0xCD, 0x5C, 0x5C, true);
YColor.Indigo = new YColor(false, 0xFF, 0x4B, 0x00, 0x82, true);
YColor.Ivory = new YColor(false, 0xFF, 0xFF, 0xFF, 0xF0, true);
YColor.Khaki = new YColor(false, 0xFF, 0xF0, 0xE6, 0x8C, true);
YColor.Lavender = new YColor(false, 0xFF, 0xE6, 0xE6, 0xFA, true);
YColor.LavenderBlush = new YColor(false, 0xFF, 0xFF, 0xF0, 0xF5, true);
YColor.LawnGreen = new YColor(false, 0xFF, 0x7C, 0xFC, 0x00, true);
YColor.LemonChiffon = new YColor(false, 0xFF, 0xFF, 0xFA, 0xCD, true);
YColor.LightBlue = new YColor(false, 0xFF, 0xAD, 0xD8, 0xE6, true);
YColor.LightCoral = new YColor(false, 0xFF, 0xF0, 0x80, 0x80, true);
YColor.LightCyan = new YColor(false, 0xFF, 0xE0, 0xFF, 0xFF, true);
YColor.LightGoldenrodYellow = new YColor(false, 0xFF, 0xFA, 0xFA, 0xD2, true);
YColor.LightGray = new YColor(false, 0xFF, 0xD3, 0xD3, 0xD3, true);
YColor.LightGreen = new YColor(false, 0xFF, 0x90, 0xEE, 0x90, true);
YColor.LightPink = new YColor(false, 0xFF, 0xFF, 0xB6, 0xC1, true);
YColor.LightSalmon = new YColor(false, 0xFF, 0xFF, 0xA0, 0x7A, true);
YColor.LightSeaGreen = new YColor(false, 0xFF, 0x20, 0xB2, 0xAA, true);
YColor.LightSkyBlue = new YColor(false, 0xFF, 0x87, 0xCE, 0xFA, true);
YColor.LightSlateGray = new YColor(false, 0xFF, 0x77, 0x88, 0x99, true);
YColor.LightSteelBlue = new YColor(false, 0xFF, 0xB0, 0xC4, 0xDE, true);
YColor.LightYellow = new YColor(false, 0xFF, 0xFF, 0xFF, 0xE0, true);
YColor.Lime = new YColor(false, 0xFF, 0x00, 0xFF, 0x00, true);
YColor.LimeGreen = new YColor(false, 0xFF, 0x32, 0xCD, 0x32, true);
YColor.Linen = new YColor(false, 0xFF, 0xFA, 0xF0, 0xE6, true);
YColor.Magenta = new YColor(false, 0xFF, 0xFF, 0x00, 0xFF, true);
YColor.Maroon = new YColor(false, 0xFF, 0x80, 0x00, 0x00, true);
YColor.MediumAquamarine = new YColor(false, 0xFF, 0x66, 0xCD, 0xAA, true);
YColor.MediumBlue = new YColor(false, 0xFF, 0x00, 0x00, 0xCD, true);
YColor.MediumOrchid = new YColor(false, 0xFF, 0xBA, 0x55, 0xD3, true);
YColor.MediumPurple = new YColor(false, 0xFF, 0x93, 0x70, 0xDB, true);
YColor.MediumSeaGreen = new YColor(false, 0xFF, 0x3C, 0xB3, 0x71, true);
YColor.MediumSlateBlue = new YColor(false, 0xFF, 0x7B, 0x68, 0xEE, true);
YColor.MediumSpringGreen = new YColor(false, 0xFF, 0x00, 0xFA, 0x9A, true);
YColor.MediumTurquoise = new YColor(false, 0xFF, 0x48, 0xD1, 0xCC, true);
YColor.MediumVioletRed = new YColor(false, 0xFF, 0xC7, 0x15, 0x85, true);
YColor.MidnightBlue = new YColor(false, 0xFF, 0x19, 0x19, 0x70, true);
YColor.MintCream = new YColor(false, 0xFF, 0xF5, 0xFF, 0xFA, true);
YColor.MistyRose = new YColor(false, 0xFF, 0xFF, 0xE4, 0xE1, true);
YColor.Moccasin = new YColor(false, 0xFF, 0xFF, 0xE4, 0xB5, true);
YColor.NavajoWhite = new YColor(false, 0xFF, 0xFF, 0xDE, 0xAD, true);
YColor.Navy = new YColor(false, 0xFF, 0x00, 0x00, 0x80, true);
YColor.OldLace = new YColor(false, 0xFF, 0xFD, 0xF5, 0xE6, true);
YColor.Olive = new YColor(false, 0xFF, 0x80, 0x80, 0x00, true);
YColor.OliveDrab = new YColor(false, 0xFF, 0x6B, 0x8E, 0x23, true);
YColor.Orange = new YColor(false, 0xFF, 0xFF, 0xA5, 0x00, true);
YColor.OrangeRed = new YColor(false, 0xFF, 0xFF, 0x45, 0x00, true);
YColor.Orchid = new YColor(false, 0xFF, 0xDA, 0x70, 0xD6, true);
YColor.PaleGoldenrod = new YColor(false, 0xFF, 0xEE, 0xE8, 0xAA, true);
YColor.PaleGreen = new YColor(false, 0xFF, 0x98, 0xFB, 0x98, true);
YColor.PaleTurquoise = new YColor(false, 0xFF, 0xAF, 0xEE, 0xEE, true);
YColor.PaleVioletRed = new YColor(false, 0xFF, 0xDB, 0x70, 0x93, true);
YColor.PapayaWhip = new YColor(false, 0xFF, 0xFF, 0xEF, 0xD5, true);
YColor.PeachPuff = new YColor(false, 0xFF, 0xFF, 0xDA, 0xB9, true);
YColor.Peru = new YColor(false, 0xFF, 0xCD, 0x85, 0x3F, true);
YColor.Pink = new YColor(false, 0xFF, 0xFF, 0xC0, 0xCB, true);
YColor.Plum = new YColor(false, 0xFF, 0xDD, 0xA0, 0xDD, true);
YColor.PowderBlue = new YColor(false, 0xFF, 0xB0, 0xE0, 0xE6, true);
YColor.Purple = new YColor(false, 0xFF, 0x80, 0x00, 0x80, true);
YColor.Red = new YColor(false, 0xFF, 0xFF, 0x00, 0x00, true);
YColor.RosyBrown = new YColor(false, 0xFF, 0xBC, 0x8F, 0x8F, true);
YColor.RoyalBlue = new YColor(false, 0xFF, 0x41, 0x69, 0xE1, true);
YColor.SaddleBrown = new YColor(false, 0xFF, 0x8B, 0x45, 0x13, true);
YColor.Salmon = new YColor(false, 0xFF, 0xFA, 0x80, 0x72, true);
YColor.SandyBrown = new YColor(false, 0xFF, 0xF4, 0xA4, 0x60, true);
YColor.SeaGreen = new YColor(false, 0xFF, 0x2E, 0x8B, 0x57, true);
YColor.SeaShell = new YColor(false, 0xFF, 0xFF, 0xF5, 0xEE, true);
YColor.Sienna = new YColor(false, 0xFF, 0xA0, 0x52, 0x2D, true);
YColor.Silver = new YColor(false, 0xFF, 0xC0, 0xC0, 0xC0, true);
YColor.SkyBlue = new YColor(false, 0xFF, 0x87, 0xCE, 0xEB, true);
YColor.SlateBlue = new YColor(false, 0xFF, 0x6A, 0x5A, 0xCD, true);
YColor.SlateGray = new YColor(false, 0xFF, 0x70, 0x80, 0x90, true);
YColor.Snow = new YColor(false, 0xFF, 0xFF, 0xFA, 0xFA, true);
YColor.SpringGreen = new YColor(false, 0xFF, 0x00, 0xFF, 0x7F, true);
YColor.SteelBlue = new YColor(false, 0xFF, 0x46, 0x82, 0xB4, true);
YColor.Tan = new YColor(false, 0xFF, 0xD2, 0xB4, 0x8C, true);
YColor.Teal = new YColor(false, 0xFF, 0x00, 0x80, 0x80, true);
YColor.Thistle = new YColor(false, 0xFF, 0xD8, 0xBF, 0xD8, true);
YColor.Tomato = new YColor(false, 0xFF, 0xFF, 0x63, 0x47, true);
YColor.Transparent = new YColor(false, 0x00, 0xFF, 0xFF, 0xFF, true);
YColor.Turquoise = new YColor(false, 0xFF, 0x40, 0xE0, 0xD0, true);
YColor.Violet = new YColor(false, 0xFF, 0xEE, 0x82, 0xEE, true);
YColor.Wheat = new YColor(false, 0xFF, 0xF5, 0xDE, 0xB3, true);
YColor.White = new YColor(false, 0xFF, 0xFF, 0xFF, 0xFF, true);
YColor.WhiteSmoke = new YColor(false, 0xFF, 0xF5, 0xF5, 0xF5, true);
YColor.Yellow = new YColor(false, 0xFF, 0xFF, 0xFF, 0x00, true);
YColor.YellowGreen = new YColor(false, 0xFF, 0x9A, 0xCD, 0x32, true);
YColor._predefinedColors = null;
export class YBrush {
    constructor(c, disableAntialias) {
        this._noAntiAlias = false;
        this._color = c;
        if (typeof (disableAntialias) != "undefined") {
            this._noAntiAlias = disableAntialias;
        }
    }
    get noAntiAlias() { return this._noAntiAlias; }
    get color() { return this._color; }
}
export class YSolidBrush extends YBrush {
}
export class YLinearGradientBrush extends YBrush {
    constructor(c1, c2) {
        super(c1);
        this._color1 = c1;
        this._color2 = c2;
    }
    get color1() { return this._color1; }
    get color2() { return this._color2; }
}
export class YPen {
    constructor(color, thickness, disableAntialias) {
        this._thickness = 1.0;
        this._color = YColor.Black;
        this._noAntiAlias = false;
        this._startCap = 1 /* YPen.LineCap.Square */;
        this._endCap = 1 /* YPen.LineCap.Square */;
        this._linejoin = YPen.LineJoin.Miter;
        this._thickness = thickness;
        this._color = thickness > 0 ? color : YColor.Transparent;
        if (typeof (disableAntialias) != "undefined") {
            this._noAntiAlias = disableAntialias;
        }
    }
    get noAntiAlias() { return this._noAntiAlias; }
    get lineWidth() { return this._thickness; }
    get strokeStyle() { return this._color.htmlCode; }
    get color() { return this._color; }
    set startCap(value) { this._startCap = value; }
    set endCap(value) { this._endCap = value; }
    set linejoin(value) { this._linejoin = value; }
}
(function (YPen) {
    let LineJoin;
    (function (LineJoin) {
        LineJoin[LineJoin["Miter"] = 0] = "Miter";
        LineJoin[LineJoin["Bevel"] = 1] = "Bevel";
        LineJoin[LineJoin["Round"] = 2] = "Round";
        LineJoin[LineJoin["MiterClipped"] = 3] = "MiterClipped";
    })(LineJoin = YPen.LineJoin || (YPen.LineJoin = {}));
})(YPen || (YPen = {}));
export class YRectangle {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }
}
export class Point {
    constructor(valueX, valueY) {
        this.X = valueX >> 0;
        this.Y = valueY >> 0;
    }
}
export class PointF {
    constructor(valueX, valueY) {
        this.X = valueX;
        this.Y = valueY;
    }
}
export class captureParametersSet {
    constructor() {
        this.captureType = YDataRenderer.CaptureType.SVG;
        this.captureFolder = "/"; //Environment.GetFolderPath(Environment.SpecialFolder.MyPictures);
        this.captureWidth = 1024;
        this.captureHeight = 1024;
        this.captureDPI = 96;
    }
}
export class GenericPanel {
    get userData() { return this._userData; }
    set userData(value) { this._userData = value; }
    get directParent() { return this._directParent; }
    constructor(parent, directParent) {
        this._userData = null;
        this._enabled = false;
        this._panelTextAlign = GenericPanel.TextAlign.LEFT;
        this._text = "";
        this._bgColor = new YColor(false, 255, 255, 255, 192);
        this._borderColor = YColor.Black;
        this._borderthickness = 1.0;
        this._padding = 10;
        this._verticalMargin = 10;
        this._horizontalMargin = 10;
        this._bgBrush = null;
        this._pen = null;
        this._font = null;
        this._directParent = directParent;
        this._parentRenderer = parent;
        this._font = new YFont(parent, this, 8, null);
    }
    get enabled() {
        return this._enabled;
    }
    set enabled(value) {
        if (this._enabled != value) {
            this._enabled = value;
            this._parentRenderer.clearCachedObjects();
            this._parentRenderer.redraw();
        }
    }
    get panelTextAlign() { return this._panelTextAlign; }
    set panelTextAlign(value) {
        this._panelTextAlign = value;
        if (this._enabled)
            this._parentRenderer.redraw();
    }
    get text() { return this._text; }
    set text(value) {
        this._text = value;
        this._parentRenderer.clearCachedObjects();
        if (this._enabled)
            this._parentRenderer.redraw();
    }
    get bgColor() { return this._bgColor; }
    set bgColor(value) {
        this._bgColor = value;
        this._bgBrush = null;
        if (this._enabled)
            this._parentRenderer.redraw();
    }
    get borderColor() { return this._borderColor; }
    set borderColor(value) {
        this._borderColor = value;
        this._pen = null;
        if (this._enabled)
            this._parentRenderer.redraw();
    }
    get borderthickness() { return this._borderthickness; }
    set borderthickness(value) {
        if (value < 0)
            throw "Border thickness must be a positive value";
        this._borderthickness = value;
        this._parentRenderer.clearCachedObjects();
        this._pen = null;
        if (this._enabled)
            this._parentRenderer.redraw();
    }
    get padding() { return this._padding; }
    set padding(value) {
        if (value < 0)
            throw new RangeError("Padding must be a positive value");
        this._padding = value;
        this._parentRenderer.clearCachedObjects();
        if (this._enabled)
            this._parentRenderer.redraw();
    }
    get verticalMargin() { return this._verticalMargin; }
    set verticalMargin(value) {
        this._verticalMargin = value;
        if (this._enabled)
            this._parentRenderer.redraw();
    }
    get horizontalMargin() { return this._horizontalMargin; }
    set horizontalMargin(value) {
        this._horizontalMargin = value;
        if (this._enabled)
            this._parentRenderer.redraw();
    }
    get bgBrush() {
        if (this._bgBrush == null)
            this._bgBrush = new YSolidBrush(this._bgColor);
        return this._bgBrush;
    }
    get pen() {
        if (this._pen == null) {
            this._pen = new YPen(this._borderColor, this._borderthickness, true);
        }
        return this._pen;
    }
    get font() { return this._font; }
}
(function (GenericPanel) {
    class HorizontalAlignPosEnumItem extends YEnumItem {
        constructor(value, humanreadable, container) {
            super(value, humanreadable, HorizontalAlignPos);
        }
    }
    GenericPanel.HorizontalAlignPosEnumItem = HorizontalAlignPosEnumItem;
    class HorizontalAlignPos extends YEnum {
    }
    HorizontalAlignPos.LEFT = new HorizontalAlignPosEnumItem("LEFT", "Left");
    HorizontalAlignPos.CENTER = new HorizontalAlignPosEnumItem("CENTER", "Center");
    HorizontalAlignPos.RIGHT = new HorizontalAlignPosEnumItem("RIGHT", "Right");
    GenericPanel.HorizontalAlignPos = HorizontalAlignPos;
    class VerticalAlignPosEnumItem extends YEnumItem {
        constructor(value, humanreadable, container) {
            super(value, humanreadable, VerticalAlignPos);
        }
    }
    GenericPanel.VerticalAlignPosEnumItem = VerticalAlignPosEnumItem;
    class VerticalAlignPos extends YEnum {
    }
    VerticalAlignPos.TOP = new VerticalAlignPosEnumItem("TOP", "Top");
    VerticalAlignPos.CENTER = new VerticalAlignPosEnumItem("CENTER", "Center");
    VerticalAlignPos.BOTTOM = new VerticalAlignPosEnumItem("BOTTOM", "Bottom");
    GenericPanel.VerticalAlignPos = VerticalAlignPos;
    class TextAlignEnumItem extends YEnumItem {
        constructor(value, humanreadable, container) {
            super(value, humanreadable, TextAlign);
        }
    }
    GenericPanel.TextAlignEnumItem = TextAlignEnumItem;
    class TextAlign extends YEnum {
    }
    TextAlign.LEFT = new TextAlignEnumItem("LEFT", "Left");
    TextAlign.CENTER = new TextAlignEnumItem("CENTER", "Center");
    TextAlign.RIGHT = new TextAlignEnumItem("RIGHT", "Right");
    GenericPanel.TextAlign = TextAlign;
})(GenericPanel || (GenericPanel = {}));
export class MessagePanel extends GenericPanel {
    constructor(parent, directParent) {
        super(parent, directParent);
        this._panelHrzAlign = GenericPanel.HorizontalAlignPos.CENTER;
        this._panelVrtAlign = GenericPanel.VerticalAlignPos.CENTER;
    }
    get panelHrzAlign() { return this._panelHrzAlign; }
    set panelHrzAlign(value) {
        this._panelHrzAlign = value;
        if (this._enabled)
            this._parentRenderer.redraw();
    }
    get panelVrtAlign() { return this._panelVrtAlign; }
    set panelVrtAlign(value) {
        this._panelVrtAlign = value;
        if (this._enabled)
            this._parentRenderer.redraw();
    }
}
export class AnnotationPanel extends GenericPanel {
    constructor(parent, directParent) {
        super(parent, directParent);
        this._overlap = false;
        this._positionOffsetX = 50;
        this._positionOffsetY = 50;
        this._panelHrzAlign = GenericPanel.HorizontalAlignPos.CENTER;
        this._panelVrtAlign = GenericPanel.VerticalAlignPos.TOP;
    }
    get overlap() { return this._overlap; }
    set overlap(value) {
        if ((!value) && (this._panelHrzAlign == GenericPanel.HorizontalAlignPos.CENTER) && (this._panelVrtAlign == GenericPanel.VerticalAlignPos.CENTER)) {
            this._panelVrtAlign = GenericPanel.VerticalAlignPos.TOP;
        }
        this._overlap = value;
        this._parentRenderer.clearCachedObjects();
        this._parentRenderer.redraw();
    }
    get positionOffsetX() { return this._positionOffsetX; }
    set positionOffsetX(value) {
        this._positionOffsetX = value;
        this._parentRenderer.clearCachedObjects();
        if (this._enabled)
            this._parentRenderer.redraw();
    }
    get positionOffsetY() { return this._positionOffsetY; }
    set positionOffsetY(value) {
        this._positionOffsetY = value;
        this._parentRenderer.clearCachedObjects();
        if (this._enabled)
            this._parentRenderer.redraw();
    }
    get panelHrzAlign() { return this._panelHrzAlign; }
    set panelHrzAlign(value) {
        if ((!this._overlap) && (value == GenericPanel.HorizontalAlignPos.CENTER) && (this._panelVrtAlign == GenericPanel.VerticalAlignPos.CENTER)) {
            this._panelVrtAlign = GenericPanel.VerticalAlignPos.TOP;
        }
        this._panelHrzAlign = value;
        this._parentRenderer.clearCachedObjects();
        if (this._enabled)
            this._parentRenderer.redraw();
    }
    get panelVrtAlign() { return this._panelVrtAlign; }
    set panelVrtAlign(value) {
        if ((!this._overlap) && (value == GenericPanel.VerticalAlignPos.CENTER) && (this._panelHrzAlign == GenericPanel.HorizontalAlignPos.CENTER)) {
            this._panelHrzAlign = GenericPanel.HorizontalAlignPos.RIGHT;
        }
        this._panelVrtAlign = value;
        this._parentRenderer.clearCachedObjects();
        if (this._enabled)
            this._parentRenderer.redraw();
    }
}
export class Zone {
    get directParent() { return this._directParent; }
    get userData() { return this._userData; }
    set userData(value) { this._userData = value; }
    resetCache() { }
    constructor(parentRenderer, directParent) {
        this._userData = null;
        this._zoneBrush = null;
        this._color = YColor.Red;
        this._visible = false;
        this._min = 0;
        this._max = 100;
        this._directParent = directParent;
        this._parentRenderer = parentRenderer;
    }
    get zoneBrush() {
        if (this._zoneBrush == null)
            this._zoneBrush = new YSolidBrush(this._color);
        return this._zoneBrush;
    }
    get color() { return this._color; }
    set color(value) {
        this._color = value;
        this._zoneBrush = null;
        if (this.visible)
            this._parentRenderer.redraw();
    }
    get visible() { return this._visible; }
    set visible(value) {
        this._visible = value;
        this._parentRenderer.redraw();
    }
    set_minMax(min, max) {
        if (min > max)
            throw new RangeError("Min cannot be greater than max ");
        this._min = min;
        this._max = max;
        this.resetCache();
        if (this.visible)
            this._parentRenderer.redraw();
    }
    get min() { return this._min; }
    set min(value) {
        if ((value >= this._max) && !YDataRenderer.minMaxCheckDisabled) {
            throw new RangeError("Min cannot be greater than max (" + this._max.toString() + ")");
        }
        this._min = value;
        this.resetCache();
        if (this.visible)
            this._parentRenderer.redraw();
    }
    get max() { return this._max; }
    set max(value) {
        if ((value <= this._min) && !YDataRenderer.minMaxCheckDisabled) {
            throw new RangeError("Max cannot be greater than min (" + this._min.toString() + ")");
        }
        this._max = value;
        this.resetCache();
        if (this.visible)
            this._parentRenderer.redraw();
    }
}
export class Proportional {
    get userData() { return this._userData; }
    set userData(value) { this._userData = value; }
    get directParent() { return this._directParent; }
    get value() { return this._value; }
    set value(v) {
        this._value = v;
        this.set_refPoint();
        if (this._reset != null)
            this._reset(this);
    }
    get resizeRule() { return this._resizeRule; }
    set resizeRule(value) {
        this.set_refPoint();
        this._resizeRule = value;
    }
    set_refPoint() {
        this._refWidth = Math.max(1, this._parentRenderer.usableUiWidth());
        this._refHeight = Math.max(1, this._parentRenderer.usableUiHeight());
        this._refValue = this._value;
    }
    constructor(value, resizeRule, parentRenderer, directParent, resetCallBack) {
        this._reset = null;
        this._refWidth = 1;
        this._refHeight = 1;
        this._refValue = 1;
        this.valueStack = [];
        this._resizeRule = Proportional.ResizeRule.FIXED;
        this._userData = null;
        this._reset = resetCallBack;
        this._parentRenderer = parentRenderer;
        this._value = value;
        this._resizeRule = resizeRule;
        this._directParent = directParent;
        this.set_refPoint();
        this._parentRenderer.AddNewProportionalToSizeValue(this);
    }
    containerResizedPushNewCoef(coef) {
        this.valueStack.push(this._value);
        this._value = Math.round(100 * this._refValue * coef) / 100;
        if (this._reset != null)
            this._reset(this);
    }
    containerResizedPop() {
        if (this.valueStack.length <= 0)
            throw new RangeError("Can't pop, empty stack.");
        this._value = this.valueStack.pop();
        if (this._reset != null)
            this._reset(this);
    }
    static resizeCoef(rule, refWidth, refHeight, newWidth, newHeight) {
        switch (rule) {
            case Proportional.ResizeRule.RELATIVETOWIDTH:
                return newWidth / refWidth;
            case Proportional.ResizeRule.RELATIVETOHEIGHT:
                return newHeight / refHeight;
            case Proportional.ResizeRule.RELATIVETOBOTH:
                return Math.min(newHeight / refHeight, newWidth / refWidth); // original
        }
        return 1.0;
    }
    containerResized(newWidth, newHeight) {
        this._value = Math.round(100 * this._refValue * Proportional.resizeCoef(this._resizeRule, this._refWidth, this._refHeight, newWidth, newHeight)) / 100;
        if (this._reset != null)
            this._reset(this);
    }
    forceChangeCallback() {
        if (this._reset != null)
            this._reset(this);
    }
}
(function (Proportional) {
    class ResizeRuleEnumItem extends YEnumItem {
        constructor(value, humanreadable, container) {
            super(value, humanreadable, ResizeRule);
        }
    }
    Proportional.ResizeRuleEnumItem = ResizeRuleEnumItem;
    class ResizeRule extends YEnum {
    }
    ResizeRule.FIXED = new ResizeRuleEnumItem("FIXED", "Fixed");
    ResizeRule.RELATIVETOWIDTH = new ResizeRuleEnumItem("RELATIVETOWIDTH", "Relative to Width");
    ResizeRule.RELATIVETOHEIGHT = new ResizeRuleEnumItem("RELATIVETOHEIGHT", "Relative to height");
    ResizeRule.RELATIVETOBOTH = new ResizeRuleEnumItem("RELATIVETOBOTH", "Relative to Width and Height");
    Proportional.ResizeRule = ResizeRule;
})(Proportional || (Proportional = {}));
export class YDataRenderer {
    get annotationPanels() { return this._annotationPanels; }
    get userData() { return this._userData; }
    static get minMaxCheckDisabled() { return YDataRenderer._disableMinMaxCheck; }
    static set minMaxCheckDisabled(value) { YDataRenderer._disableMinMaxCheck = value; }
    resetlegendPens() { }
    get getCaptureParameters() { return this._getCaptureParameters; }
    set getCaptureParameters(value) { this._getCaptureParameters = value; }
    get messagePanels() { return this._messagePanels; }
    static globalMouseMove(e) {
        YDataRenderer.globalMouseX = e.pageX;
        YDataRenderer.globalMouseY = e.pageY;
    }
    clearTransformationMatrix() {
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
    findElementAbsolutePosition(el) {
        let staticFound = false;
        let relativeFound = false;
        let dx = 0;
        let dy = 0;
        while (el != null) {
            let style = window.getComputedStyle(el);
            if ((!relativeFound) && (style.position == "static") && (!staticFound)) {
                dx = el.offsetLeft + parseFloat(style.borderLeftWidth);
                dy = el.offsetTop + parseFloat(style.borderTopWidth);
                staticFound = true;
            }
            if ((style.position == "relative") || (style.position == "absolute")) {
                dx += el.offsetLeft + parseFloat(style.borderLeftWidth);
                dy += el.offsetTop + parseFloat(style.borderTopWidth);
                relativeFound = true;
            }
            el = el.parentElement;
        }
        return new PointF(dx, dy);
    }
    get Elm2ScrMatrix() {
        if (this._Elm2ScrMatrix == null) {
            let el = this.UIContainer;
            // compute el and its parents absolute absolution relative to page origin
            // turns out it is a bit tricky when nested div have diffrent style.position
            // values static/relative/absolute
            let AsolutePositionsStack = [];
            while (el != null) {
                AsolutePositionsStack.push(this.findElementAbsolutePosition(el));
                el = el.parentElement;
            }
            el = this.UIContainer;
            let MatrixStack = [];
            let staticFound = false;
            let relativeFound = false;
            let index = 0;
            while (el != null) { //console.log("UP "+el.id);
                let parent = el.parentElement;
                let style = window.getComputedStyle(el);
                //console.log(el.id+": position="+style.position+" offset= ("+el.offsetLeft.toString(2).padStart(16)+","+el.offsetTop.toString(2).padStart(16)+") ("+el.offsetLeft+","+el.offsetTop+")  border= ("+parseFloat(style.borderLeftWidth)+","+parseFloat(style.borderTopWidth)+") computed pos=("+AsolutePositionsStack[index].X+","+AsolutePositionsStack[index].Y+")" );
                let dx = AsolutePositionsStack[index].X;
                let dy = AsolutePositionsStack[index].Y;
                if (index < AsolutePositionsStack.length - 1) {
                    dx -= AsolutePositionsStack[index + 1].X;
                    dy -= AsolutePositionsStack[index + 1].Y;
                }
                //console.log("offset="+dx.toString()+","+dy.toString());
                let matrix = style['transform'];
                if (matrix != "none") { //console.log("matrix="+matrix)
                    let matrixStr = matrix.match(/matrix.*\((.+)\)/)[1].split(', ');
                    let matrixValues = [];
                    for (let i = 0; i < 6; i++) {
                        matrixValues.push(parseFloat(matrixStr[i]));
                    }
                    let OriginMatrixMatrixBefore = null;
                    let TransformMatrix = Matrix3x3.newMatrix(matrixValues[0], matrixValues[2], matrixValues[4], matrixValues[1], matrixValues[3], matrixValues[5], 0, 0, 1);
                    let OriginMatrixMatrixAfter = null;
                    if (style.transformOrigin) { //console.log("transformOrigin="+style.transformOrigin)
                        let parts = style.transformOrigin.split(" ");
                        let Ox = Number.parseFloat(parts[0]);
                        let Oy = Number.parseFloat(parts[1]);
                        OriginMatrixMatrixBefore = Matrix3x3.newTranslateMatrix(-Ox, -Oy);
                        OriginMatrixMatrixAfter = Matrix3x3.newTranslateMatrix(Ox, Oy);
                    } //else  console.log("No transform");
                    if (OriginMatrixMatrixBefore != null)
                        MatrixStack.push(OriginMatrixMatrixBefore);
                    if (TransformMatrix != null)
                        MatrixStack.push(TransformMatrix);
                    if (OriginMatrixMatrixAfter != null)
                        MatrixStack.push(OriginMatrixMatrixAfter);
                } // else  console.log("No matrix");
                if ((dx != 0) || (dy != 0))
                    MatrixStack.push(Matrix3x3.newTranslateMatrix(dx, dy));
                el = parent;
                index++;
            }
            this._Elm2ScrMatrix = Matrix3x3.newIdentityMatrix();
            for (let i = MatrixStack.length - 1; i >= 0; i--) {
                this._Elm2ScrMatrix = this._Elm2ScrMatrix.multiplyByM(MatrixStack[i]);
            }
        }
        return this._Elm2ScrMatrix;
    }
    get Scr2ElmMatrix() {
        if (this._Scr2ElmMatrix == null) {
            this._Scr2ElmMatrix = this.Elm2ScrMatrix.inverse;
        }
        return this._Scr2ElmMatrix;
    }
    addAnnotationPanel() {
        let p = new AnnotationPanel(this, this);
        this._annotationPanels.push(p);
        this.redraw();
        return p;
    }
    AllowRedraw() {
        this._redrawAllowed--;
        if (this._redrawAllowed < 0)
            throw new RangeError("Too many AllowRedraw calls");
        if (this._redrawAllowed == 0)
            this.redraw();
    }
    AllowRedrawNoRefresh() {
        this._redrawAllowed--;
        if (this._redrawAllowed < 0)
            throw new RangeError("Too many AllowRedraw calls");
    }
    DisableRedraw() {
        this._redrawAllowed++;
    }
    AddNewProportionalToSizeValue(v) {
        if (this.ProportionalToSizeValues.indexOf(v) < 0)
            this.ProportionalToSizeValues.push(v);
    }
    canRedraw() {
        return (this._redrawAllowed == 0);
    }
    setPatchAnnotationCallback(callback) { this._PatchAnnotationCallback = callback; }
    patchAnnotation(text) {
        text = text.replace("\\n", "\n");
        if (text.indexOf('$') < 0)
            return text;
        let now = new Date();
        text = text.replace("$DAY$", now.getDay().toString());
        text = text.replace("$MONTH$", now.getMonth().toString());
        text = text.replace("$YEAR$", now.getFullYear().toString());
        text = text.replace("$HOUR$", now.getHours().toString());
        text = text.replace("$MINUTE$", now.getMinutes().toString());
        text = text.replace("$SECOND$", now.getSeconds().toString());
        if (this._PatchAnnotationCallback != null)
            text = this._PatchAnnotationCallback(text);
        return text;
    }
    mouseLocalPosition() {
        let v = Vector3.FromXYCoord(YDataRenderer.globalMouseX, YDataRenderer.globalMouseY);
        let m = this.Scr2ElmMatrix;
        //   let canvasRect :  ClientRect = this.UIContainer.getBoundingClientRect();
        //   if (YDataRenderer.globalMouseX<= canvasRect.left) return null;
        //   if (YDataRenderer.globalMouseX>= canvasRect.left+canvasRect.width) return null;
        //   if (YDataRenderer.globalMouseY<= canvasRect.top) return null;
        //   if (YDataRenderer.globalMouseY>= canvasRect.top+canvasRect.height) return null;
        let p = m.multiplyByV(v).toPoint();
        //     console.log(" Traditional : "+ (YDataRenderer.globalMouseX- canvasRect.left).toString()+","+(YDataRenderer.globalMouseY- canvasRect.top).toString()
        //     +" Matrix : "+ p.X.toString()+", "+ p.Y.toString());
        if ((p.X < 0) || (p.Y < 0) || (p.X > this.UIContainer.offsetWidth) || (p.Y > this.UIContainer.offsetHeight))
            return null;
        return p;
        //   return new Point( YDataRenderer.globalMouseX- canvasRect.left,
        //                      YDataRenderer.globalMouseY- canvasRect.top);
    }
    set proportionnalValueChangeCallback(value) {
        this._proportionnalValueChangeCallback = value;
    }
    ProportionnalValueChanged(source) {
        if (this._proportionnalValueChangeCallback != null)
            this._proportionnalValueChangeCallback(source);
    }
    getContainerInnerWidth() {
        return this.UIContainer.offsetWidth;
        // let r: DOMRect  = this.UIContainer.getBoundingClientRect();
        //  return r.width;
        // return  this.UIContainer.width;
    }
    getContainerInnerHeight() {
        return this.UIContainer.offsetHeight;
        //let r: DOMRect  = this.UIContainer.getBoundingClientRect();
        //return r.height;
        //return  this.UIContainer.height;
    }
    Draw(timestamp) {
        if (!this.canRedraw())
            return 0;
        let w = this.getContainerInnerWidth();
        let h = this.getContainerInnerHeight();
        if ((w <= 5) || (h <= 5))
            return 0;
        this.DisableRedraw();
        let offscreenCanvas = document.createElement('canvas');
        offscreenCanvas.width = w;
        offscreenCanvas.height = h;
        //let DrawArea : CanvasRenderingContext2D = this.UIContainer.getContext('2d');
        let g = new YGraphics(offscreenCanvas, w, h, 90);
        let start = performance.now();
        try {
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
        catch (e) {
            debugger;
            this.log("Rendering error: " + e.message);
        }
        let elapsed = performance.now() - start;
        let drawArea = this.UIContainer.getContext('2d');
        drawArea.clearRect(0, 0, w, h);
        drawArea.drawImage(offscreenCanvas, 0, 0);
        this.rendererTimingTotal += elapsed;
        this.rendererTimingCount++;
        let avg = this.rendererTimingTotal / this.rendererTimingCount;
        g.Dispose();
        this.AllowRedrawNoRefresh();
        this.renderingPostProcessing();
        return 0;
    }
    renderingPostProcessing() { }
    get resizeRule() { return this._resizeRule; }
    set resizeRule(value) {
        if (value != this._resizeRule) {
            this.DisableRedraw();
            this._resizeRule = value;
            for (let i = 0; i < this.ProportionalToSizeValues.length; i++) {
                this.ProportionalToSizeValues[i].resizeRule = this._resizeRule;
            }
            this.AllowRedraw();
            this.redraw();
        }
    }
    redraw() {
        if (!(document.visibilityState === 'visible'))
            return;
        if (this._redrawAllowed > 0)
            return;
        if (this.getContainerInnerWidth() < 2)
            return;
        if (this.getContainerInnerHeight() < 2)
            return;
        if (this.requestAnimationFrameID != null) {
            window.cancelAnimationFrame(this.requestAnimationFrameID);
            //#ifdef PROFILING
            //            console.log("canceled cancelAnimationFrame ");
            //            //#endif
        }
        this.requestAnimationFrameID = window.requestAnimationFrame((timestamp) => {
            try {
                this.Draw(timestamp);
            }
            catch (e) {
                console.log('caught');
                this.requestAnimationFrameID = null;
                throw (e);
            }
            this.requestAnimationFrameID = null;
        });
    }
    usableUiWidth() { return this.getContainerInnerWidth(); }
    usableUiHeight() { return this.getContainerInnerHeight(); }
    resetProportionalSizeObjectsCachePush(newcoef) {
        this.clearCachedObjects();
        if (this._resizeRule != Proportional.ResizeRule.FIXED) {
            for (let i = 0; i < this.ProportionalToSizeValues.length; i++) {
                this.ProportionalToSizeValues[i].containerResizedPushNewCoef(newcoef);
            }
        }
    }
    resetProportionalSizeObjectsCachePop() {
        this.clearCachedObjects();
        if (this._resizeRule != Proportional.ResizeRule.FIXED) {
            for (let i = 0; i < this.ProportionalToSizeValues.length; i++) {
                this.ProportionalToSizeValues[i].containerResizedPop();
            }
        }
    }
    resetProportionalSizeObjectsCache(w, h) {
        this.clearCachedObjects();
        if (this._resizeRule != Proportional.ResizeRule.FIXED) {
            for (let i = 0; i < this.ProportionalToSizeValues.length; i++) {
                this.ProportionalToSizeValues[i].containerResized(w, h);
            }
        }
    }
    containerResized() {
        this.containerResize(null, null);
    }
    containerResize(sender, e) {
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
    proportionnalsizeReset() {
        this.resetProportionalSizeObjectsCache(this.usableUiWidth(), this.usableUiHeight());
    }
    captureAndDownloadImage(captureType, defaultFilename, // or null
    captureWidth, // or null
    captureHeight, // or null
    captureDPI) {
        let error = "";
        let w;
        let h;
        let ratio = this.getContainerInnerWidth() / this.getContainerInnerHeight();
        if (captureDPI == null)
            captureDPI = 90;
        if ((defaultFilename == null) || (typeof defaultFilename == "undefined")) {
            defaultFilename = "capture.";
            if (captureType == YDataRenderer.CaptureType.PNG) {
                defaultFilename = defaultFilename + "png";
            }
            if (captureType == YDataRenderer.CaptureType.SVG) {
                defaultFilename = defaultFilename + "svg";
            }
        }
        if ((captureWidth == null) || (typeof (captureWidth) == "undefined")) {
            w = this.getContainerInnerWidth();
            if ((captureHeight == null) || (typeof (captureHeight) == "undefined")) {
                h = this.getContainerInnerHeight();
            }
            else {
                h = captureHeight >> 0;
                w = (h * ratio) >> 0;
            }
        }
        else {
            w = captureWidth >> 0;
            if ((captureHeight == null) || (typeof (captureHeight) == "undefined")) {
                h = (w * ratio) >> 0;
            }
            else {
                h = captureHeight >> 0;
            }
        }
        if ((w <= 5) || (h <= 5))
            return;
        this.DisableRedraw();
        let DrawArea = document.createElement('canvas');
        DrawArea.width = w;
        DrawArea.height = h;
        let g;
        switch (captureType) {
            case YDataRenderer.CaptureType.PNG:
                g = new YGraphics(DrawArea, w, h, captureDPI);
                break;
            case YDataRenderer.CaptureType.SVG:
                g = new YGraphicsSVG(DrawArea, w, h, captureDPI);
                break;
            default:
                throw new RangeError("capture :unknown type");
        }
        let newCoef = Proportional.resizeCoef(Proportional.ResizeRule.RELATIVETOBOTH, this.refWidth, this.refHeight, w, h);
        this.log("start capture");
        this.resetProportionalSizeObjectsCachePush(newCoef); // reset all size related cached objects
        let renderok = false;
        this._snapshotPanel.enabled = false;
        try {
            let t = this.Render(g, w, h);
            renderok = true;
        }
        catch (e) {
            error = e.message;
            this.log("Render error: " + error);
        }
        this.log("capture completed");
        this.resetProportionalSizeObjectsCachePop(); // reset all size related cached objects, again
        if (renderok) {
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
    getFocus(sender, e) {
        this.log("got focus");
    }
    gainFocus() {
        //if (parentForm.Focused) return;
        //this.parentForm.Focus();
    }
    lostFocus(sender, e) {
        //if (_AllowPrintScreenCapture) _RegisKey.StopHotKey();
    }
    get AllowPrintScreenCapture() { return this._AllowPrintScreenCapture; }
    set AllowPrintScreenCapture(value) { this._AllowPrintScreenCapture = value; }
    constructor(UIContainer, logFunction) {
        this._redrawAllowed = 1;
        this._refWidth = 1;
        this._refHeight = 1;
        this.rendererTimingTotal = 0;
        this.rendererTimingCount = 0;
        this._PatchAnnotationCallback = null;
        this._logFunction = null;
        this._annotationPanels = [];
        this._userData = null;
        this.documentVisibiltyChangeFct = null;
        this.containerResizedFct = null;
        this._getCaptureParameters = null;
        this.OnDblClick = null;
        this.OnRightClick = null;
        this._messagePanels = [];
        this._Scr2ElmMatrix = null;
        this._Elm2ScrMatrix = null;
        this.ProportionalToSizeValues = [];
        this._proportionnalValueChangeCallback = null;
        this._resizeRule = Proportional.ResizeRule.FIXED;
        this.requestAnimationFrameID = null;
        this._snapshotPanel = null;
        this._snapshotTimer = null;
        this._AllowPrintScreenCapture = false;
        if (!YDataRenderer.globalMouseMoveSet) {
            document.addEventListener("mousemove", e => { YDataRenderer.globalMouseMove(e); });
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
        this._snapshotPanel.font.size = 16;
        this.AllowRedrawNoRefresh();
        this.containerResizedFct = () => { this.containerResize(null, null); };
        document.addEventListener('resize', this.containerResizedFct);
        this.resetRefrenceSize();
        this.documentVisibiltyChangeFct = () => {
            if (document.visibilityState === 'visible') {
                this.redraw();
            }
        };
        document.addEventListener('visibilitychange', this.documentVisibiltyChangeFct);
    }
    destroy() {
        document.removeEventListener('visibilitychange', this.documentVisibiltyChangeFct);
        document.removeEventListener('resize', this.containerResized);
        this.UIContainer.parentNode.removeChild(this.UIContainer);
        this.UIContainer = null;
        this.parentForm = null;
        this._annotationPanels = null;
        this._messagePanels = null;
        this._Scr2ElmMatrix = null;
        this._Elm2ScrMatrix = null;
    }
    resetRefrenceSize() {
        this._refWidth = this.getContainerInnerWidth();
        this._refHeight = this.getContainerInnerHeight();
    }
    get refWidth() { return this._refWidth; }
    get refHeight() { return this._refHeight; }
    RendererCanvas_Click(sender, e) {
    }
    RendererCanvas_DoubleClick(sender, e) {
        // MouseEventArgs m = (MouseEventArgs)e;
        // if (OnDblClick != null) OnDblClick(this, m);
    }
    addMessagePanel() {
        let p = new MessagePanel(this, this);
        this._messagePanels.push(p);
        return p;
    }
    DrawMessagePanels(g, viewPortWidth, viewPortHeight) {
        //g.SetClip(new YRectangle(0, 0, viewPortWidth, viewPortHeight));
        for (let i = 0; i < this._messagePanels.length; i++) {
            if (this._messagePanels[i].enabled) {
                let p = this._messagePanels[i];
                let AvailableWidth = viewPortWidth - 2 * p.padding - p.borderthickness;
                if (AvailableWidth < 100)
                    AvailableWidth = 100;
                let ssize = null;
                let sizeok = false;
                // if panel ends up larger than avaliable space, lets reduce font size.
                while (!sizeok) {
                    ssize = g.MeasureString(p.text, p.font, AvailableWidth);
                    if (((ssize.width >= this.UIContainer.width) ||
                        (ssize.height >= this.UIContainer.height))
                        && (p.font.size > 5)) {
                        p.font.size = Math.round(p.font.size * 9) / 10;
                    }
                    else
                        sizeok = true;
                }
                if (ssize == null)
                    return; // not supposed to happen
                let panelWidth = ssize.width + 2 * p.padding + p.borderthickness;
                let panelHeight = ssize.height + 2 * p.padding + p.borderthickness;
                let x = 0;
                switch (p.panelHrzAlign) {
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
                let y = 0;
                switch (p.panelVrtAlign) {
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
                if (p.borderthickness > 0)
                    g.DrawRectangleXYHW(p.pen, x, y, panelWidth, panelHeight);
                let sf = new YStringFormat(16384 /* YStringFormat.StringFormatFlags.NoClip */);
                switch (p.panelTextAlign) {
                    case MessagePanel.TextAlign.LEFT:
                        sf.LineAlignment = 0 /* YStringFormat.StringAlignment.Near */;
                        sf.Alignment = 0 /* YStringFormat.StringAlignment.Near */;
                        break;
                    case MessagePanel.TextAlign.RIGHT:
                        sf.LineAlignment = 2 /* YStringFormat.StringAlignment.Far */;
                        sf.Alignment = 2 /* YStringFormat.StringAlignment.Far */;
                        break;
                    default:
                        sf.LineAlignment = 1 /* YStringFormat.StringAlignment.Center */;
                        sf.Alignment = 1 /* YStringFormat.StringAlignment.Center */;
                        break;
                }
                let r = new YRectangle(((x + p.padding + p.borderthickness / 2) >> 0), ((y + p.padding + p.borderthickness / 2) >> 0), ssize.width + 1, ssize.height + 1);
                g.DrawStringRect(p.text, p.font, p.font.brush, r, sf);
            }
        }
    }
    drawAnnotationPanels(g, annotationPanels, viewPortWidth, viewPortHeight, overlap, mainViewPort) {
        //g.TextRenderingHint = YGraphics.TextRenderingHint.SingleBitPerPixelGridFit;
        let active = false;
        for (let i = 0; i < this.annotationPanels.length; i++) {
            if (this.annotationPanels[i].enabled)
                active = true;
        }
        if (!active)
            return;
        //g.SetClip(new YRectangle(0, 0, viewPortWidth, viewPortHeight));
        for (let i = 0; i < this.annotationPanels.length; i++) {
            if ((annotationPanels[i].enabled) && (annotationPanels[i].overlap == overlap)) {
                let p = annotationPanels[i];
                let AvailableWidth = viewPortWidth - 2 * p.padding - p.borderthickness;
                if (AvailableWidth < 100)
                    AvailableWidth = 100;
                let textToDisplay = p.text.replace("\\n", "\n");
                if (textToDisplay.indexOf('$') >= 0) {
                    textToDisplay = textToDisplay.replace("\\n", "\n");
                    textToDisplay = this.patchAnnotation(textToDisplay);
                }
                let ssize = g.MeasureString(textToDisplay, p.font, AvailableWidth);
                let panelWidth = ssize.width + 2 * p.padding + p.borderthickness;
                let panelHeight = ssize.height + 2 * p.padding + p.borderthickness;
                let x = 0;
                switch (p.panelHrzAlign) {
                    case MessagePanel.HorizontalAlignPos.LEFT:
                        x = p.horizontalMargin;
                        if (!annotationPanels[i].overlap && (mainViewPort.Lmargin < panelWidth + 10)) {
                            mainViewPort.Lmargin = panelWidth + 10;
                        }
                        break;
                    case MessagePanel.HorizontalAlignPos.RIGHT:
                        x = viewPortWidth - panelWidth - p.horizontalMargin;
                        if (!annotationPanels[i].overlap && (mainViewPort.Rmargin < panelWidth + 20)) {
                            mainViewPort.Rmargin = panelWidth + 20;
                        }
                        break;
                    default:
                        x = (viewPortWidth - panelWidth) / 2;
                        break;
                }
                let y = 0;
                switch (p.panelVrtAlign) {
                    case MessagePanel.VerticalAlignPos.TOP:
                        y = p.verticalMargin;
                        if (!annotationPanels[i].overlap && (mainViewPort.Tmargin < panelHeight + 20)) {
                            mainViewPort.Tmargin = panelHeight + 20;
                        }
                        break;
                    case MessagePanel.VerticalAlignPos.BOTTOM:
                        y = viewPortHeight - panelHeight - p.verticalMargin;
                        if (!annotationPanels[i].overlap && (mainViewPort.Bmargin < panelHeight + 20)) {
                            mainViewPort.Bmargin = panelHeight + 20;
                        }
                        break;
                    default:
                        y = (viewPortHeight - panelHeight) / 2;
                        break;
                }
                if (annotationPanels[i].overlap) {
                    x += (annotationPanels[i].positionOffsetX / 100) * (viewPortWidth - panelWidth);
                    y += (annotationPanels[i].positionOffsetY / 100) * (viewPortHeight - panelHeight);
                    if (x < 0)
                        x = 0;
                    if (y < 0)
                        y = 0;
                    if (x > viewPortWidth - panelWidth)
                        x = viewPortWidth - panelWidth;
                    if (y > viewPortHeight - panelHeight)
                        y = viewPortHeight - panelHeight;
                }
                g.FillRectangleXYHW(p.bgBrush, x, y, panelWidth, panelHeight);
                if (p.borderthickness > 0)
                    g.DrawRectangleXYHW(p.pen, x, y, panelWidth, panelHeight);
                //g.TextRenderingHint = YGraphics.TextRenderingHint.AntiAlias;
                let sf = new YStringFormat(16384 /* YStringFormat.StringFormatFlags.NoClip */);
                switch (p.panelTextAlign) {
                    case MessagePanel.TextAlign.LEFT:
                        sf.LineAlignment = 0 /* YStringFormat.StringAlignment.Near */;
                        sf.Alignment = 0 /* YStringFormat.StringAlignment.Near */;
                        break;
                    case MessagePanel.TextAlign.RIGHT:
                        sf.LineAlignment = 2 /* YStringFormat.StringAlignment.Far */;
                        sf.Alignment = 2 /* YStringFormat.StringAlignment.Far */;
                        break;
                    default:
                        sf.LineAlignment = 1 /* YStringFormat.StringAlignment.Center */;
                        sf.Alignment = 1 /* YStringFormat.StringAlignment.Center */;
                        break;
                }
                let r = new YRectangle((x + p.padding + p.borderthickness / 2), (y + p.padding + p.borderthickness / 2), ssize.width + 1, ssize.height + 1);
                g.DrawStringRect(textToDisplay, p.font, p.font.brush, r, sf);
            }
        }
    }
    log(s) {
        if (this._logFunction == null)
            return;
        this._logFunction(s);
    }
}
YDataRenderer.RendererDebug = false;
YDataRenderer.FloatToStrformats = ["0", "0", "0", "0.0", "0.00", "0.000", "0.0000"];
YDataRenderer._disableMinMaxCheck = false;
YDataRenderer.globalMouseMoveSet = false;
YDataRenderer.globalMouseX = -1;
YDataRenderer.globalMouseY = -1;
(function (YDataRenderer) {
    class CaptureTypeEnumItem extends YEnumItem {
        constructor(value, humanreadable, container) {
            super(value, humanreadable, CaptureType);
        }
    }
    YDataRenderer.CaptureTypeEnumItem = CaptureTypeEnumItem;
    class CaptureType extends YEnum {
    }
    CaptureType.PNG = new CaptureTypeEnumItem("PNG", "Bitmap (PNG)");
    CaptureType.SVG = new CaptureTypeEnumItem("SVG", "Vector (SVG)");
    YDataRenderer.CaptureType = CaptureType;
    class CaptureTargetEnumItem extends YEnumItem {
        constructor(value, humanreadable, container) {
            super(value, humanreadable, CaptureTarget);
        }
    }
    YDataRenderer.CaptureTargetEnumItem = CaptureTargetEnumItem;
    class CaptureTarget extends YEnum {
    }
    CaptureTarget.ToClipBoard = new CaptureTargetEnumItem("ToClipBoard", "ClipBoard");
    CaptureTarget.ToFile = new CaptureTargetEnumItem("ToFile", "File");
    YDataRenderer.CaptureTarget = CaptureTarget;
    class CaptureFormatsEnumItem extends YEnumItem {
        constructor(value, humanreadable, container) {
            super(value, humanreadable, CaptureFormats);
        }
    }
    YDataRenderer.CaptureFormatsEnumItem = CaptureFormatsEnumItem;
    class CaptureFormats extends YEnum {
    }
    CaptureFormats.Keep = new CaptureFormatsEnumItem("Keep", "Keep original size");
    CaptureFormats.Fixed = new CaptureFormatsEnumItem("Fixed", "Fixed size");
    CaptureFormats.FixedWidth = new CaptureFormatsEnumItem("FixedWidth", "Fixed width, keep ration aspect");
    CaptureFormats.FixedHeight = new CaptureFormatsEnumItem("FixedHeight", "Fixed height, keep ration aspect");
    YDataRenderer.CaptureFormats = CaptureFormats;
})(YDataRenderer || (YDataRenderer = {}));
/*
    *  abstraction layer allowing to render in both bitmap and Vector(SVG) format
    *
    */
export class YGraphics {
    constructor(canvas, width, height, dpi) {
        this._c = null;
        this._g = null;
        this._width = 0;
        this._height = 0;
        this._dpi = 0;
        this._image = null;
        this._lastPen = null;
        this._lastBrush = null;
        this._lastFont = null;
        this._clipCounter = 0;
        this._textRenderingHint = null;
        this._smoothingMode = YSmoothingMode.Default;
        this._c = canvas;
        this._g = this._c.getContext("2d");
        this._g.textBaseline = 'top';
        this._width = width;
        this._height = height;
        this._dpi = dpi;
    }
    get_downloadableData() {
        return this._c.toDataURL('image/png');
    }
    get graphics() { return this._g; }
    setPen(p) {
        if (p == this._lastPen)
            return;
        if (p != null) { //if (YDataRenderer.RendererDebug)  console.log("set Pen to "+p.lineWidth+"/"+p.strokeStyle)
            this._g.lineWidth = p.lineWidth;
            let st = p.strokeStyle;
            this._g.strokeStyle = p.strokeStyle;
        }
        else {
            this._g.lineWidth = 0;
        }
        this._lastPen = p;
    }
    setBrush(b) {
        if (b == this._lastBrush)
            return;
        if (b instanceof YSolidBrush) {
            this._g.fillStyle = b.color.htmlCode;
        }
        else if (b instanceof YLinearGradientBrush) {
            let lingrad = this._g.createLinearGradient(0, 0, 0, this._height);
            lingrad.addColorStop(0, b.color1.htmlCode);
            lingrad.addColorStop(1, b.color2.htmlCode);
            this._g.fillStyle = lingrad;
        }
        else {
            throw new Error("invalid / insupported brush type");
        }
        this._lastBrush = b;
    }
    setFont(f) {
        if ((f == this._lastFont) && !f.hasChanged)
            return;
        this._g.font = f.htmlCode;
        this._lastFont = f;
    }
    DrawLineXY(p, x1, y1, x2, y2) {
        if (p.noAntiAlias) {
            let offset = (p.lineWidth == p.lineWidth >> 0) && ((p.lineWidth & 1) == 1) ? 0.5 : 0;
            x1 = Math.round(x1) + offset;
            y1 = Math.round(y1) + offset;
            x2 = Math.round(x2) + offset;
            y2 = Math.round(y2) + offset;
        }
        this.setPen(p);
        this._g.beginPath();
        this._g.moveTo(x1, y1);
        this._g.lineTo(x2, y2);
        this._g.stroke();
    }
    DrawLine(p, p1, p2) {
        this.setPen(p);
        this._g.beginPath();
        this._g.moveTo(p1.X, p1.Y);
        this._g.lineTo(p2.X, p2.Y);
        this._g.stroke();
    }
    SetClip(rect) {
        this._g.save(); // save the context
        this._g.beginPath();
        this._g.rect(rect.x, rect.y, rect.w, rect.h);
        this._g.clip();
        this._clipCounter++;
    }
    ResetClip() {
        if (this._clipCounter <= 0)
            throw new Error("clipping stack error");
        this._g.restore(); // restore the context including previous clipping
        this._clipCounter--;
        //console.log("-ResetClip , counter = "+this._clipCounter);
    }
    MeasureString(text, font, width) {
        this.setFont(font);
        let res = new YSizeF(font, text);
        let count = res.linesCount;
        if (count == 0)
            return res;
        res.height = res.firstLineHeight * 1.2 + (count - 1) * res.lineHeight;
        let max = 0;
        let dim;
        for (let i = 0; i < count; i++) {
            dim = this._g.measureText(res.lines[i]);
            max = Math.max(max, dim.width);
        }
        res.width = max;
        return res;
    }
    MeasureStringSF(text, font, width, stringFormat) {
        return this.MeasureString(text, font, width);
    }
    FillRectangle(brush, rect) {
        this.setBrush(brush);
        this._g.beginPath();
        this._g.fillRect(rect.x, rect.y, rect.w, rect.h);
        this._g.fill();
    }
    FillRectangleXYHW(brush, x, y, width, height) {
        this.setBrush(brush);
        this._g.beginPath();
        this._g.fillRect(x, y, width, height);
        this._g.fill();
    }
    DrawRectangle(p, rect) {
        this.setPen(p);
        this._g.beginPath();
        if (p.noAntiAlias) {
            let offset = (p.lineWidth == p.lineWidth >> 0) && ((p.lineWidth & 1) == 1) ? 0.5 : 0;
            this._g.rect(Math.round(rect.x) + offset, Math.round(rect.y) + offset, Math.round(rect.w), Math.round(rect.h));
        }
        else {
            this._g.rect(rect.x, rect.y, rect.w, rect.h);
        }
        this._g.stroke();
    }
    DrawRectangleXYHW(p, x, y, width, height) {
        if (p.noAntiAlias) {
            let offset = (p.lineWidth == p.lineWidth >> 0) && ((p.lineWidth & 1) == 1) ? 0.5 : 0;
            x = Math.round(x) + offset;
            y = Math.round(y) + offset;
            width = Math.round(width);
            height = Math.round(height);
        }
        this.setPen(p);
        this._g.beginPath();
        this._g.rect(x, y, width, height);
        this._g.stroke();
    }
    DrawStringXY(s, font, brush, x, y) {
        this.setPen(null);
        this.setBrush(brush);
        this.setFont(font);
        let totalsz = this.MeasureString(s, font, 0);
        let dy = totalsz.lineHeight;
        for (let i = 0; i < totalsz.linesCount; i++) {
            this._g.fillText(totalsz.lines[i], x, y);
            y += dy;
        }
    }
    DrawStringXYF(s, font, brush, x, y, format) {
        if (YGraphics._debugDrawString) {
            let pen = new YPen(YColor.Red, 1);
            this.DrawLineXY(pen, x - 5, y, x + 5, y);
            this.DrawLineXY(pen, x, y - 5, x, y + 5);
        }
        let sz = this.MeasureString(s, font, 10000);
        if (format.Alignment == 1 /* YStringFormat.StringAlignment.Center */) {
            x -= sz.width >> 1;
        }
        else if (format.Alignment == 2 /* YStringFormat.StringAlignment.Far */)
            x -= sz.width;
        if (format.LineAlignment == 1 /* YStringFormat.StringAlignment.Center */) {
            y -= (sz.height / 2) >> 0;
        }
        else if (format.LineAlignment == 2 /* YStringFormat.StringAlignment.Far */)
            y -= sz.height;
        this.DrawStringXY(s, font, brush, x, y);
    }
    DrawStringPF(s, font, brush, p, format) {
        this.DrawStringXYF(s, font, brush, p.X, p.Y, format);
    }
    DrawString(s, font, brush, p) {
        if (YGraphics._debugDrawString) {
            let pen = new YPen(YColor.Red, 1);
            this.DrawLineXY(pen, p.X - 5, p.Y, p.X + 5, p.Y);
            this.DrawLineXY(pen, p.X, p.Y - 5, p.X, p.Y + 5);
        }
        this.setPen(null);
        this.setBrush(brush);
        this.setFont(font);
        this._g.fillText(s, p.X, p.Y);
    }
    DrawStringRect(s, font, brush, layoutRectangle, format) {
        if (YGraphics._debugDrawString) {
            let pen = new YPen(YColor.Red, 1);
            this.DrawRectangle(pen, layoutRectangle);
        }
        this.setPen(null);
        this.setBrush(brush);
        this.setFont(font);
        let totalsz = this.MeasureString(s, font, 0);
        let dy = totalsz.lineHeight;
        let y = layoutRectangle.y;
        switch (format.LineAlignment) {
            case 0 /* YStringFormat.StringAlignment.Near */:
                break;
            case 1 /* YStringFormat.StringAlignment.Center */:
                y += (layoutRectangle.h - totalsz.height) / 2;
                break;
            case 2 /* YStringFormat.StringAlignment.Far */:
                y += (layoutRectangle.h - totalsz.height);
                break;
        }
        let xOrigin = layoutRectangle.x;
        if (format.FormatFlags & 2 /* YStringFormat.StringFormatFlags.DirectionVertical */) {
            this.Transform(layoutRectangle.x, layoutRectangle.y, Math.PI / 2);
            y -= (layoutRectangle.y + layoutRectangle.w);
            xOrigin -= layoutRectangle.x;
        }
        for (let i = 0; i < totalsz.linesCount; i++) {
            let s = totalsz.lines[i];
            let sz = this.MeasureString(s, font, 0);
            let x = xOrigin;
            switch (format.Alignment) {
                case 0 /* YStringFormat.StringAlignment.Near */:
                    break;
                case 1 /* YStringFormat.StringAlignment.Center */:
                    x += (layoutRectangle.w - sz.width) / 2;
                    break;
                case 2 /* YStringFormat.StringAlignment.Far */:
                    x += (layoutRectangle.w - sz.width);
                    break;
            }
            this._g.fillText(s, x, y);
            y += dy;
        }
        if (format.FormatFlags & 2 /* YStringFormat.StringFormatFlags.DirectionVertical */)
            this.ResetTransform();
    }
    Transform(dx, dy, angle) {
        let sin = Math.sin(angle);
        let cos = Math.cos(angle);
        this._g.save();
        this._g.transform(cos, sin, -sin, cos, dx, dy);
    }
    ResetTransform() {
        this._g.restore();
    }
    FillEllipse(brush, x, y, width, height) {
        this.setBrush(brush);
        this._g.beginPath();
        this._g.ellipse(x + width / 2, y + height / 2, width / 2, height / 2, 0, 0, 2 * Math.PI);
        this._g.fill();
    }
    DrawEllipse(pen, x, y, width, height) {
        this.setPen(pen);
        this._g.beginPath();
        this._g.ellipse(x + width / 2, y + height / 2, width / 2, height / 2, 0, 0, 2 * Math.PI);
        this._g.stroke();
    }
    FillPolygon(brush, points) {
        this.setBrush(brush);
        if (points.length <= 2)
            return;
        this._g.beginPath();
        if (brush.noAntiAlias) {
            this._g.moveTo(Math.round(points[0].X) + 0.5, Math.round(points[0].Y) + 0.5);
            for (let i = 1; i < points.length; i++) {
                this._g.lineTo(Math.round(points[i].X) + 0.5, Math.round(points[i].Y) + 0.5);
            }
        }
        else {
            this._g.moveTo(points[0].X, points[0].Y);
            for (let i = 1; i < points.length; i++) {
                this._g.lineTo(points[i].X, points[i].Y);
            }
        }
        this._g.closePath();
        this._g.fill();
    }
    DrawPolygon(pen, points) {
        this.setPen(pen);
        if (points.length <= 1)
            return;
        this._g.beginPath();
        if (pen.noAntiAlias) {
            let offset = (pen.lineWidth == pen.lineWidth >> 0) && ((pen.lineWidth & 1) == 1) ? 0.5 : 0;
            this._g.moveTo(Math.round(points[0].X) + offset, Math.round(points[0].Y) + offset);
            for (let i = 1; i < points.length; i++) {
                this._g.lineTo(Math.round(points[i].X) + offset, Math.round(points[i].Y) + offset);
            }
        }
        else {
            this._g.moveTo(points[0].X, points[0].Y);
            for (let i = 1; i < points.length; i++) {
                this._g.lineTo(points[i].X, points[i].Y);
            }
        }
        this._g.closePath();
        this._g.stroke();
    }
    DrawLines(pen, points) {
        this.setPen(pen);
        if (points.length <= 1)
            return;
        this._g.beginPath();
        this._g.lineCap = "round";
        this._g.lineJoin = "round";
        this._g.moveTo(points[0].X, points[0].Y);
        for (let i = 1; i < points.length; i++) {
            this._g.lineTo(points[i].X, points[i].Y);
        }
        this._g.stroke();
    }
    Dispose() {
        this._c = null;
        this._g = null;
        this._width = 0;
        this._height = 0;
        this._dpi = 0;
    }
    get TextRenderingHint() { return this._textRenderingHint; }
    set TextRenderingHint(value) { this._textRenderingHint = value; }
    get SmoothingMode() { return this._smoothingMode; }
    set SmoothingMode(value) { this._smoothingMode = value; }
    DrawImage(srcimage, destRect, srcRect, srcUnit) {
        // implementation is not complete (coordinates and sizes)
        this._g.drawImage(srcimage, srcRect.x, srcRect.y, srcRect.w, srcRect.h, destRect.x, destRect.y, destRect.w, destRect.h);
    }
    comment(s) { }
}
YGraphics._debugDrawString = false;
export class YGraphicsSVG extends YGraphics {
    constructor(canvas, width, height, dpi) {
        super(canvas, width, height, dpi);
        this._clipcount = 0;
        this._clipSectionsToClose = 0;
        this._transformSectionsToClose = 0;
        this._gradientCount = 0;
        YGraphicsSVG.SVGID++;
        this._SVGdefs = new YStringBuilder();
        this._SVGcontents = new YStringBuilder();
        this._SVGdefs.AppendLine("<clipPath id=\"pageClip_" + YGraphicsSVG.SVGID.toString() + "\"><rect x=\"0\" y=\"0\"  width=\"" + width.toString() + "\" height=\"" + height.toString() + "\"/></clipPath>");
    }
    static escapeXml(unsafe) {
        return unsafe.replace(/[^ !#$%(-;=?-z]/g, (c) => '&#' + c.charCodeAt(0) + ';'); // MV power!  :-)
    }
    get_downloadableData() {
        return "data:image/svg+xml;base64," + btoa(this.get_svgContents());
    }
    DrawLineXY(p, x1, y1, x2, y2) {
        this._SVGcontents.AppendLine("<line x1=\"" + x1.toString() + "\" "
            + " y1 =\"" + y1.toString() + "\" "
            + " x2 =\"" + x2.toString() + "\" "
            + " y2 =\"" + y2.toString() + "\" "
            + "style = \"stroke:" + p.color.svgCode + ";stroke-opacity:" + p.color.alphaCode + "; stroke-width:" + p.lineWidth.toString() + "\"/>");
    }
    DrawLine(p, p1, p2) { this.DrawLineXY(p, p1.X, p1.Y, p2.X, p2.Y); }
    SetClip(rect) {
        this.ResetClip();
        this._SVGdefs.AppendLine("<clipPath id=\"clip_" + YGraphicsSVG.SVGID.toString() + "_" + this._clipcount.toString() + "\"><rect x=\"" + rect.x.toString() + "\" y=\"" + rect.y.toString()
            + "\"  width=\"" + rect.w.toString() + "\" height=\"" + rect.h.toString() + "\"/></clipPath>");
        this._SVGcontents.AppendLine("<g clip-path=\"url(#clip_" + YGraphicsSVG.SVGID.toString() + "_" + this._clipcount.toString() + ")\">");
        this._clipcount++;
        this._clipSectionsToClose++;
    }
    ResetClip() {
        if (this._clipSectionsToClose > 0) {
            this._SVGcontents.AppendLine("</g>");
            this._clipSectionsToClose--;
        }
    }
    BrushToSVG(brush, revert) {
        let fillParam = "";
        if (brush instanceof YSolidBrush) {
            fillParam = "fill = \"" + brush.color.svgCode + "\" fill-opacity=\"" + brush.color.alphaCode + "\" ";
        }
        else if (brush instanceof YLinearGradientBrush) {
            this._SVGdefs.AppendLine("<linearGradient id=\"grad_" + YGraphicsSVG.SVGID.toString() + "_" + this._gradientCount + "\" "
                + "x1=\"0%\" " // over-simplified gradient translation as we only use full size vertical gradients.
                + (revert ? "y1=\"100%\" " : "y1=\"0%\" ") // Yes, I know, it's cheap.
                + "x2=\"0%\" "
                + (revert ? "y2=\"0%\" " : "y2=\"100%\" ") + ">\r\n"
                + "<stop offset=\"0%\" style =\"stop-color:" + brush.color1.svgCode + ";stop-opacity:" + brush.color1.alphaCode + "\"/>\r\n"
                + "<stop offset=\"100%\" style =\"stop-color:" + brush.color2.svgCode + ";stop-opacity:" + brush.color2.alphaCode + "\"/>\r\n"
                + "</linearGradient>");
            fillParam = "fill=\"url(#grad_" + YGraphicsSVG.SVGID.toString() + "_" + this._gradientCount + ")\" ";
            this._gradientCount++;
        }
        else {
            throw new ReferenceError("unsupported brush type.");
        }
        return fillParam;
    }
    FillRectangle(brush, rect) {
        this._SVGcontents.AppendLine("<rect x=\"" + rect.x.toString() + "\" "
            + " y =\"" + rect.y.toString() + "\" "
            + " width =\"" + rect.w.toString() + "\" "
            + " height =\"" + rect.h.toString() + "\" "
            + this.BrushToSVG(brush, true)
            + "style=\"stroke-width:0\"/>");
    }
    FillRectangleXYHW(brush, x, y, width, height) { this.FillRectangle(brush, new YRectangle(x, y, width, height)); }
    DrawRectangle(p, rect) {
        this._SVGcontents.AppendLine("<rect x=\"" + rect.x.toString() + "\" "
            + " y =\"" + rect.y.toString() + "\" "
            + " width =\"" + rect.w.toString() + "\" "
            + " height =\"" + rect.h.toString() + "\" "
            + " fill=\"none\" "
            + "style = \"stroke:" + p.color.svgCode + ";stroke-opacity:" + p.color.alphaCode + "; stroke-width:" + p.lineWidth.toString() + "\"/>");
    }
    DrawRectangleXYHW(p, x, y, width, height) { this.DrawRectangle(p, new YRectangle(x, y, width, height)); }
    DrawEllipse(pen, x, y, width, height) {
        this._SVGcontents.AppendLine("<ellipse  cx=\"" + (x + width / 2.0).toString() + "\" "
            + " cy =\"" + (y + height / 2.0).toString() + "\" "
            + " rx =\"" + (width / 2).toString() + "\" "
            + " ry =\"" + (height / 2).toString() + "\" "
            + " fill=\"none\" "
            + "style = \"stroke:" + pen.color.svgCode + ";stroke-opacity:" + pen.color.alphaCode + "; stroke-width:" + pen.lineWidth.toString() + "\"/>");
    }
    FillEllipse(brush, x, y, width, height) {
        this._SVGcontents.AppendLine("<ellipse  cx=\"" + (x + width / 2.0).toString() + "\" "
            + " cy =\"" + (y + height / 2.0).toString() + "\" "
            + " rx =\"" + (width / 2).toString() + "\" "
            + " ry =\"" + (height / 2).toString() + "\" "
            + this.BrushToSVG(brush, false)
            + "style=\"stroke-width:0\"/>");
    }
    DrawStringXY(s, font, brush, x, y) {
        let tokens = s.split('\n');
        for (let i = 0; i < tokens.length; i++) {
            s = tokens[i];
            this._SVGcontents.AppendLine("<text x=\"" + x.toString() + "\" y=\"" + (y + font.sizeInPoints).toString() + "\" text-anchor=\"start\" " // dominant-baseline=\"hanging\" " //Not supported in  Inkscape :-(
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
    DrawString(s, font, brush, p) {
        if (YGraphics._debugDrawString) {
            let pen = new YPen(YColor.Red, 1);
            this.DrawLineXY(pen, p.X - 5, p.Y, p.X + 5, p.Y);
            this.DrawLineXY(pen, p.X, p.Y - 5, p.X, p.Y + 5);
        }
        this.DrawStringXY(s, font, brush, p.X, p.Y);
    }
    DrawStringF(s, font, brush, point, format) {
        let totalsz = this.MeasureString(s, font, 0);
        let y = point.Y + font.size * 1.25;
        switch (format.LineAlignment) {
            case 0 /* YStringFormat.StringAlignment.Near */:
                break;
            case 1 /* YStringFormat.StringAlignment.Center */:
                y += -totalsz.height / 2;
                break;
            case 2 /* YStringFormat.StringAlignment.Far */:
                y += -totalsz.height;
                break;
        }
        let tokens = s.split('\n');
        for (let i = 0; i < tokens.length; i++) {
            let s = tokens[i];
            let sz = this.MeasureString(s, font, 0);
            let x = point.X;
            switch (format.Alignment) {
                case 0 /* YStringFormat.StringAlignment.Near */:
                    break;
                case 1 /* YStringFormat.StringAlignment.Center */:
                    x += -sz.width / 2;
                    break;
                case 2 /* YStringFormat.StringAlignment.Far */:
                    x += -sz.width;
                    break;
            }
            this._SVGcontents.AppendLine("<text x=\"" + x.toString() + "\" y=\"" + y.toString() + "\" text-anchor=\"start\" " // dominant-baseline=\"hanging\" " //Not supported in  Inkscape :-(
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
    DrawStringRect(s, font, brush, layoutRectangle, format) {
        if (YGraphics._debugDrawString) {
            let pen = new YPen(YColor.Red, 1);
            this.DrawRectangle(pen, layoutRectangle);
        }
        let totalsz = this.MeasureString(s, font, 0);
        let y = layoutRectangle.y + font.sizeInPoints * 1.1;
        switch (format.LineAlignment) {
            case 0 /* YStringFormat.StringAlignment.Near */:
                break;
            case 1 /* YStringFormat.StringAlignment.Center */:
                y += (layoutRectangle.h - totalsz.height) / 2;
                break;
            case 2 /* YStringFormat.StringAlignment.Far */:
                y += (layoutRectangle.h - totalsz.height);
                break;
        }
        let tokens = s.split('\n');
        for (let i = 0; i < tokens.length; i++) {
            let s = tokens[i];
            let sz = this.MeasureString(s, font, 0);
            let x = layoutRectangle.x;
            switch (format.Alignment) {
                case 0 /* YStringFormat.StringAlignment.Near */:
                    break;
                case 1 /* YStringFormat.StringAlignment.Center */:
                    x += (layoutRectangle.w - sz.width) / 2;
                    break;
                case 2 /* YStringFormat.StringAlignment.Far */:
                    x += (layoutRectangle.w - sz.width);
                    break;
            }
            this._SVGcontents.AppendLine("<text x=\"" + x.toString() + "\" y=\"" + y.toString() + "\" text-anchor=\"start\" " // dominant-baseline=\"hanging\" " //Not supported in  Inkscape :-(
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
    Transform(dx, dy, angle) {
        this._SVGcontents.AppendLine("<g transform=\"translate(" + dx.toString() + " " + dy.toString() + ") rotate(" + (180 * angle / Math.PI).toString() + ")\">");
        this._transformSectionsToClose++;
    }
    ResetTransform() {
        if (this._transformSectionsToClose > 0) {
            this._SVGcontents.AppendLine("</g>");
            this._transformSectionsToClose--;
        }
    }
    DrawPolygon(pen, points) {
        if (points.length < 2)
            return;
        this._SVGcontents.Append("<path  d=\"M " + points[0].X.toString() + " " + points[0].Y.toString());
        for (let i = 1; i < points.length; i += 1) {
            this._SVGcontents.Append(" L " + points[i].X.toString() + " " + points[i].Y.toString());
        }
        this._SVGcontents.AppendLine(" z\" fill=\"none\" "
            + "style=\"stroke:" + pen.color.svgCode + ";stroke-opacity:" + pen.color.alphaCode + "; stroke-width:" + pen.lineWidth.toString() + "\"/>");
    }
    DrawLines(pen, points) {
        if (points.length < 2)
            return;
        this._SVGcontents.Append("<path  d=\"M " + points[0].X.toString() + " " + points[0].Y.toString());
        for (let i = 1; i < points.length; i++) {
            this._SVGcontents.Append(" L " + points[i].X.toString() + " " + points[i].Y.toString());
        }
        this._SVGcontents.AppendLine("\" fill=\"none\" "
            + "style=\"stroke:" + pen.color.svgCode + ";stroke-opacity:" + pen.color.alphaCode + "; stroke-linecap:round; stroke-linejoin:round;stroke-width:" + pen.lineWidth.toString() + "\"/>");
    }
    FillPolygon(brush, points) {
        if (points.length < 2)
            return;
        this._SVGcontents.Append("<path  d=\"M " + points[0].X.toString() + " " + points[0].Y.toString());
        for (let i = 1; i < points.length; i++) {
            this._SVGcontents.Append(" L " + points[i].X.toString() + " " + points[i].Y.toString());
        }
        this._SVGcontents.AppendLine(" z\" " + this.BrushToSVG(brush, false)
            + "style=\"stroke-width:0\"/>\r\n");
    }
    DrawImage(image, destRect, srcRect, srcUnit) { throw new Error("DrawImage not supported, find an other way."); }
    save(filename) {
        throw new Error("Direct save to file not supported.");
    }
    comment(s) { this._SVGcontents.AppendLine("<!--" + s + "-->"); }
    get_svgContents() {
        let physicalWidth = (2.54 * (this._width / this._dpi)).toFixed(3);
        let physicalheight = (2.54 * (this._height / this._dpi)).toFixed(3);
        while (this._clipSectionsToClose > 0) {
            this._SVGcontents.AppendLine("</g>");
            this._clipSectionsToClose--;
        }
        while (this._transformSectionsToClose > 0) {
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
YGraphicsSVG.SVGID = 0;

/* Yocto-Visualization-4web (ES2015 read-only 1.10.51983) - www.yoctopuce.com */
// obj/rdonly/Renderer/YDataRendererCommon.js
var Vector3 = class {
  constructor(a, b, c) {
    this.a = a;
    this.b = b;
    this.c = c;
  }
  static FromXYCoord(x, y) {
    return new Vector3(x, y, 1);
  }
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
  toPointF() {
    return new PointF(this.a, this.b);
  }
  toPoint() {
    return new Point(this.a, this.b);
  }
};
var Matrix3x3 = class {
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
    if (b == 0 && d == 0 && a == 1 && e == 1 && i == 1 && g == 0 && h == 0) {
      flags |= Matrix3x3.Flag_TRANSLATION;
      if (c == 0 && f == 0)
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
    if (offsetX == 0 && offsetY == 0)
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
    return "matrix(" + this.a.toString() + "," + this.d.toString() + "," + this.b.toString() + "," + this.e.toString() + "," + this.c.toString() + "," + this.f.toString() + ")";
  }
  toString() {
    return "| " + this.a.toFixed(2) + " " + this.b.toFixed(2) + " " + this.c.toFixed(2) + " |" + (this.isIdentity ? " I" : "") + "\n| " + this.d.toFixed(2) + " " + this.e.toFixed(2) + " " + this.f.toFixed(2) + " |" + (this.isTranslation ? " T" : "") + "\n| " + this.g.toFixed(2) + " " + this.g.toFixed(2) + " " + this.i.toFixed(2) + " |\n";
  }
  multiplyByM(m) {
    if (this.isIdentity)
      return m.clone();
    if (m.isIdentity)
      return this.clone();
    if (this.isTranslation && m.isTranslation)
      return Matrix3x3.newTranslateMatrix(this.c + m.c, this.f + m.f);
    return new Matrix3x3(this.a * m.a + this.b * m.d + this.c * m.g, this.a * m.b + this.b * m.e + this.c * m.h, this.a * m.c + this.b * m.f + this.c * m.i, this.d * m.a + this.e * m.d + this.f * m.g, this.d * m.b + this.e * m.e + this.f * m.h, this.d * m.c + this.e * m.f + this.f * m.i, this.g * m.a + this.h * m.d + this.i * m.g, this.g * m.b + this.h * m.e + this.i * m.h, this.g * m.c + this.h * m.f + this.i * m.i, Matrix3x3.Flag_NONE);
  }
  get inverse() {
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
};
Matrix3x3.Flag_NONE = 0;
Matrix3x3.Flag_IDENTITY = 1;
Matrix3x3.Flag_TRANSLATION = 2;
var YEnum = class {
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
};
var YEnumItem = class {
  constructor(value, humanreadable, container) {
    this._value = value;
    this._container = container;
    this._humanreadable = humanreadable;
  }
  fromString(value) {
    return YEnum.fromString(this._container, value);
  }
  get toString() {
    return this._value.toString();
  }
  get description() {
    return this._humanreadable;
  }
  get sibblings() {
    return YEnum.siblings(this._container);
  }
};
var ViewPortSettings = class {
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
};
var YFont = class {
  constructor(parentRenderer, directParent, size, fontChangeCallback) {
    this._userData = null;
    this._fontChangeCallback = null;
    this._name = "Arial";
    this._italic = false;
    this._bold = false;
    this._color = YColor.Black;
    this._alternateColor = null;
    this._font = null;
    this._brush = new YSolidBrush(YColor.Black);
    this._parentRenderer = parentRenderer;
    this._directParent = directParent;
    this._fontChangeCallback = fontChangeCallback ? fontChangeCallback : null;
    this._size = new Proportional(size ? size : 10, Proportional.ResizeRule.FIXED, parentRenderer, this, this.ResetFont);
  }
  get userData() {
    return this._userData;
  }
  set userData(value) {
    this._userData = value;
  }
  get directParent() {
    return this._directParent;
  }
  ResetFont(source) {
    this._font = null;
    if (source != null)
      this._parentRenderer.ProportionnalValueChanged(source);
  }
  get name() {
    return this._name;
  }
  set name(value) {
    this._name = value;
    this.ResetFont(null);
    this._parentRenderer.redraw();
  }
  get hasChanged() {
    return this._font == null;
  }
  get size() {
    return this._size.value;
  }
  set size(value) {
    if (value <= 0)
      throw new RangeError("Size must be a positive value");
    value = Math.round(100 * value) / 100;
    this._size.value = value;
    this.ResetFont(null);
    if (this._fontChangeCallback != null)
      this._fontChangeCallback(this);
    this._parentRenderer.redraw();
  }
  get italic() {
    return this._italic;
  }
  set italic(value) {
    if (this._italic != value) {
      this._italic = value;
      this.ResetFont(null);
      this._parentRenderer.redraw();
    }
  }
  get bold() {
    return this._bold;
  }
  set bold(value) {
    if (this._bold != value) {
      this._bold = value;
      this.ResetFont(null);
      this._parentRenderer.redraw();
    }
  }
  get color() {
    return this._color;
  }
  set color(value) {
    if (this._color != value) {
      this._color = value;
      this._brush = null;
      this._parentRenderer.redraw();
    }
  }
  get alternateColor() {
    return this._alternateColor;
  }
  set alternateColor(value) {
    if (this._alternateColor != value) {
      this._alternateColor = value;
      this._brush = null;
      this._parentRenderer.redraw();
    }
  }
  get fontObject() {
    return this._name ? this._name : "Arial";
  }
  get brush() {
    if (this._brush == null)
      this._brush = new YSolidBrush(this._alternateColor != null ? this._alternateColor : this._color);
    return this._brush;
  }
  get sizeInPoints() {
    return this._size.value * 0.75;
  }
  get sizeForCanvas() {
    return this._size.value * 1.15;
  }
  get htmlCode() {
    return (this._italic ? "italic " : "") + (this._bold ? "bold " : "") + this.sizeForCanvas.toString() + "px " + this._name;
  }
};
var YSizeF = class {
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
      } else {
        this._lines = st.split("\n");
        this._linesCount = this._lines.length;
      }
    }
  }
  get lines() {
    return this._lines;
  }
  get linesCount() {
    return this._linesCount;
  }
  get firstLineHeight() {
    return this._firstlineHeight;
  }
  get lineHeight() {
    return this._lineHeight;
  }
  get height() {
    return this._h;
  }
  get width() {
    return this._w;
  }
  set width(value) {
    this._w = value;
  }
  set height(value) {
    this._h = value;
  }
};
var YTextRenderingHint = class {
  constructor(value) {
    this._value = 0;
    this._value = value;
  }
};
YTextRenderingHint.SystemDefault = new YTextRenderingHint(0);
YTextRenderingHint.SingleBitPerPixelGridFit = new YTextRenderingHint(1);
YTextRenderingHint.SingleBitPerPixel = new YTextRenderingHint(2);
YTextRenderingHint.AntiAliasGridFit = new YTextRenderingHint(3);
YTextRenderingHint.AntiAlias = new YTextRenderingHint(4);
YTextRenderingHint.ClearTypeGridFit = new YTextRenderingHint(5);
var YSmoothingMode = class {
  constructor(value) {
    this._value = 0;
    this._value = value;
  }
};
YSmoothingMode.Invalid = new YSmoothingMode(-1);
YSmoothingMode.Default = new YSmoothingMode(0);
YSmoothingMode.HighSpeed = new YSmoothingMode(1);
YSmoothingMode.HighQuality = new YSmoothingMode(2);
YSmoothingMode.None = new YSmoothingMode(3);
YSmoothingMode.AntiAlias = new YSmoothingMode(4);
var YStringBuilder = class {
  constructor() {
    this._str = "";
  }
  AppendLine(s) {
    this._str += s + "\n";
  }
  Append(s) {
    this._str += s;
  }
  get contents() {
    return this._str;
  }
};
var YStringFormat = class {
  constructor(clip) {
    this._Alignment = 0;
    this._LineAlignment = 0;
    this._formatFlags = 0;
    this._Trimming = 0;
    this._clip = 16384;
    this._clip = clip;
  }
  get Alignment() {
    return this._Alignment;
  }
  set Alignment(value) {
    this._Alignment = value;
  }
  get LineAlignment() {
    return this._LineAlignment;
  }
  set LineAlignment(value) {
    this._LineAlignment = value;
  }
  get FormatFlags() {
    return this._formatFlags;
  }
  set FormatFlags(value) {
    this._formatFlags = value;
  }
  get Trimming() {
    return this._Trimming;
  }
  set Trimming(value) {
    this._Trimming = value;
  }
};
var YColor = class {
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
    } else {
      this.r = r_h;
      this.g = g_s;
      this.b = b_l;
      this.rgbConvertionDone = true;
    }
    this._htmlcode = this.computeHTMLCode();
  }
  get name() {
    return this._name;
  }
  set predefname(value) {
    this._name = value;
  }
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
        }
      }
    }
    if (value.length == 7 && value.substr(0, 1).toUpperCase() == "#") {
      let r = parseInt(value.substr(1, 2), 16);
      let g = parseInt(value.substr(3, 2), 16);
      let b = parseInt(value.substr(5, 2), 16);
      return new YColor(false, 255, r, g, b);
    }
    if (value.length == 12) {
      if (value.substr(0, 4).toUpperCase() == "RGB:") {
        let alpha = parseInt(value.substr(4, 2), 16);
        let r = parseInt(value.substr(6, 2), 16);
        let g = parseInt(value.substr(8, 2), 16);
        let b = parseInt(value.substr(10, 2), 16);
        return new YColor(false, alpha, r, g, b);
      } else if (value.substr(0, 4).toUpperCase() == "HSL:") {
        let alpha = parseInt(value.substr(4, 2), 16);
        let h = parseInt(value.substr(6, 2), 16);
        let s = parseInt(value.substr(8, 2), 16);
        let l = parseInt(value.substr(10, 2), 16);
        return new YColor(true, alpha, h, s, l);
      }
    }
    return null;
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
    } else {
      let propNames = Object.getOwnPropertyNames(YColor);
      for (let i = 0; i < propNames.length; i++) {
        let o = Reflect.get(YColor, propNames[i]);
        let c = o;
        if (c.alpha == this.alpha && c.red == this.red && c.green == this.green && c.blue == this.blue)
          return propNames[i];
      }
    }
    return "RGB:" + (YColor.hex(this.transparency) + YColor.hex(this.r) + YColor.hex(this.g) + YColor.hex(this.b)).toUpperCase();
  }
  get svgCode() {
    return "rgb(" + this.r.toString() + ", " + this.g.toString() + ", " + this.b.toString() + ")";
  }
  get alphaCode() {
    return (this.transparency / 255).toFixed(3);
  }
  static hsl2rgbInt(temp1, temp2, temp3) {
    if (temp3 >= 170)
      return (temp1 + 127) / 255 >> 0;
    if (temp3 > 42) {
      if (temp3 <= 127)
        return (temp2 + 127) / 255 >> 0;
      temp3 = 170 - temp3;
    }
    return (temp1 * 255 + (temp2 - temp1) * (6 * temp3) + 32512) / 65025 >> 0;
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
    } else {
      temp2 = (this.l + this.s) * 255 - this.l * this.s;
    }
    temp1 = 510 * this.l - temp2;
    temp3 = this.h + 85;
    if (temp3 > 255)
      temp3 = temp3 - 255;
    this.r = YColor.hsl2rgbInt(temp1, temp2, temp3);
    temp3 = this.h;
    if (temp3 > 255)
      temp3 = temp3 - 255;
    this.g = YColor.hsl2rgbInt(temp1, temp2, temp3);
    if (this.h >= 85) {
      temp3 = this.h - 85;
    } else {
      temp3 = this.h + 170;
    }
    this.b = YColor.hsl2rgbInt(temp1, temp2, temp3);
    if (this.r > 255)
      this.r = 255;
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
    let max = R > G ? R : G;
    let min = R < G ? R : G;
    let correction = 0;
    let divisor = 0;
    this.hslConvertionDone = true;
    if (B > max)
      max = B;
    if (B < min)
      min = B;
    L = (max + min + 1) / 2 >> 0;
    if (max == min) {
      this.h = 0;
      this.s = 0;
      this.l = L;
      return;
    }
    correction = (max + min) / 2 >> 0;
    if (L <= 127) {
      S = (255 * (max - min) + correction) / (max + min) >> 0;
    } else {
      S = (255 * (max - min) + 255 - correction) / (510 - (max + min)) >> 0;
    }
    correction = 3 * (max - min);
    divisor = 2 * correction;
    if (R == max) {
      H = 0;
      R = G;
      G = B;
    } else if (G == max) {
      H = 85;
      G = R;
      R = B;
    } else {
      H = 170;
    }
    if (R >= G) {
      H += (255 * (R - G) + correction) / divisor >> 0;
    } else {
      H += 255 - (255 * (G - R) - correction) / divisor >> 0;
    }
    if (H > 255)
      H -= 255;
    if (S > 255)
      S = 255;
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
  get isHSL() {
    return this.isHSLColor;
  }
  get isRGB() {
    return !this.isHSLColor;
  }
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
    } else {
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
  get isPredefined() {
    return this._isPredefined;
  }
  computeHTMLCode() {
    let a = this.transparency / 255;
    let r = this.r;
    let g = this.g;
    let b = this.b;
    return "rgba(" + r + "," + g + "," + b + "," + a.toFixed(3) + ")";
  }
  get htmlCode() {
    return this._htmlcode;
  }
};
YColor.AliceBlue = new YColor(false, 255, 240, 248, 255, true);
YColor.AntiqueWhite = new YColor(false, 255, 250, 235, 215, true);
YColor.Aqua = new YColor(false, 255, 0, 255, 255, true);
YColor.Aquamarine = new YColor(false, 255, 127, 255, 212, true);
YColor.Azure = new YColor(false, 255, 240, 255, 255, true);
YColor.Beige = new YColor(false, 255, 245, 245, 220, true);
YColor.Bisque = new YColor(false, 255, 255, 228, 196, true);
YColor.Black = new YColor(false, 255, 0, 0, 0, true);
YColor.BlanchedAlmond = new YColor(false, 255, 255, 235, 205, true);
YColor.Blue = new YColor(false, 255, 0, 0, 255, true);
YColor.BlueViolet = new YColor(false, 255, 138, 43, 226, true);
YColor.Brown = new YColor(false, 255, 165, 42, 42, true);
YColor.BurlyWood = new YColor(false, 255, 222, 184, 135, true);
YColor.CadetBlue = new YColor(false, 255, 95, 158, 160, true);
YColor.Chartreuse = new YColor(false, 255, 127, 255, 0, true);
YColor.Chocolate = new YColor(false, 255, 210, 105, 30, true);
YColor.Coral = new YColor(false, 255, 255, 127, 80, true);
YColor.CornflowerBlue = new YColor(false, 255, 100, 149, 237, true);
YColor.Cornsilk = new YColor(false, 255, 255, 248, 220, true);
YColor.Crimson = new YColor(false, 255, 220, 20, 60, true);
YColor.Cyan = new YColor(false, 255, 0, 255, 255, true);
YColor.DarkBlue = new YColor(false, 255, 0, 0, 139, true);
YColor.DarkCyan = new YColor(false, 255, 0, 139, 139, true);
YColor.DarkGoldenrod = new YColor(false, 255, 184, 134, 11, true);
YColor.DarkGray = new YColor(false, 255, 169, 169, 169, true);
YColor.DarkGreen = new YColor(false, 255, 0, 100, 0, true);
YColor.DarkKhaki = new YColor(false, 255, 189, 183, 107, true);
YColor.DarkMagenta = new YColor(false, 255, 139, 0, 139, true);
YColor.DarkOliveGreen = new YColor(false, 255, 85, 107, 47, true);
YColor.DarkOrange = new YColor(false, 255, 255, 140, 0, true);
YColor.DarkOrchid = new YColor(false, 255, 153, 50, 204, true);
YColor.DarkRed = new YColor(false, 255, 139, 0, 0, true);
YColor.DarkSalmon = new YColor(false, 255, 233, 150, 122, true);
YColor.DarkSeaGreen = new YColor(false, 255, 143, 188, 143, true);
YColor.DarkSlateBlue = new YColor(false, 255, 72, 61, 139, true);
YColor.DarkSlateGray = new YColor(false, 255, 47, 79, 79, true);
YColor.DarkTurquoise = new YColor(false, 255, 0, 206, 209, true);
YColor.DarkViolet = new YColor(false, 255, 148, 0, 211, true);
YColor.DeepPink = new YColor(false, 255, 255, 20, 147, true);
YColor.DeepSkyBlue = new YColor(false, 255, 0, 191, 255, true);
YColor.DimGray = new YColor(false, 255, 105, 105, 105, true);
YColor.DodgerBlue = new YColor(false, 255, 30, 144, 255, true);
YColor.Firebrick = new YColor(false, 255, 178, 34, 34, true);
YColor.FloralWhite = new YColor(false, 255, 255, 250, 240, true);
YColor.ForestGreen = new YColor(false, 255, 34, 139, 34, true);
YColor.Fuchsia = new YColor(false, 255, 255, 0, 255, true);
YColor.Gainsboro = new YColor(false, 255, 220, 220, 220, true);
YColor.GhostWhite = new YColor(false, 255, 248, 248, 255, true);
YColor.Gold = new YColor(false, 255, 255, 215, 0, true);
YColor.Goldenrod = new YColor(false, 255, 218, 165, 32, true);
YColor.Gray = new YColor(false, 255, 128, 128, 128, true);
YColor.Green = new YColor(false, 255, 0, 128, 0, true);
YColor.GreenYellow = new YColor(false, 255, 173, 255, 47, true);
YColor.Honeydew = new YColor(false, 255, 240, 255, 240, true);
YColor.HotPink = new YColor(false, 255, 255, 105, 180, true);
YColor.IndianRed = new YColor(false, 255, 205, 92, 92, true);
YColor.Indigo = new YColor(false, 255, 75, 0, 130, true);
YColor.Ivory = new YColor(false, 255, 255, 255, 240, true);
YColor.Khaki = new YColor(false, 255, 240, 230, 140, true);
YColor.Lavender = new YColor(false, 255, 230, 230, 250, true);
YColor.LavenderBlush = new YColor(false, 255, 255, 240, 245, true);
YColor.LawnGreen = new YColor(false, 255, 124, 252, 0, true);
YColor.LemonChiffon = new YColor(false, 255, 255, 250, 205, true);
YColor.LightBlue = new YColor(false, 255, 173, 216, 230, true);
YColor.LightCoral = new YColor(false, 255, 240, 128, 128, true);
YColor.LightCyan = new YColor(false, 255, 224, 255, 255, true);
YColor.LightGoldenrodYellow = new YColor(false, 255, 250, 250, 210, true);
YColor.LightGray = new YColor(false, 255, 211, 211, 211, true);
YColor.LightGreen = new YColor(false, 255, 144, 238, 144, true);
YColor.LightPink = new YColor(false, 255, 255, 182, 193, true);
YColor.LightSalmon = new YColor(false, 255, 255, 160, 122, true);
YColor.LightSeaGreen = new YColor(false, 255, 32, 178, 170, true);
YColor.LightSkyBlue = new YColor(false, 255, 135, 206, 250, true);
YColor.LightSlateGray = new YColor(false, 255, 119, 136, 153, true);
YColor.LightSteelBlue = new YColor(false, 255, 176, 196, 222, true);
YColor.LightYellow = new YColor(false, 255, 255, 255, 224, true);
YColor.Lime = new YColor(false, 255, 0, 255, 0, true);
YColor.LimeGreen = new YColor(false, 255, 50, 205, 50, true);
YColor.Linen = new YColor(false, 255, 250, 240, 230, true);
YColor.Magenta = new YColor(false, 255, 255, 0, 255, true);
YColor.Maroon = new YColor(false, 255, 128, 0, 0, true);
YColor.MediumAquamarine = new YColor(false, 255, 102, 205, 170, true);
YColor.MediumBlue = new YColor(false, 255, 0, 0, 205, true);
YColor.MediumOrchid = new YColor(false, 255, 186, 85, 211, true);
YColor.MediumPurple = new YColor(false, 255, 147, 112, 219, true);
YColor.MediumSeaGreen = new YColor(false, 255, 60, 179, 113, true);
YColor.MediumSlateBlue = new YColor(false, 255, 123, 104, 238, true);
YColor.MediumSpringGreen = new YColor(false, 255, 0, 250, 154, true);
YColor.MediumTurquoise = new YColor(false, 255, 72, 209, 204, true);
YColor.MediumVioletRed = new YColor(false, 255, 199, 21, 133, true);
YColor.MidnightBlue = new YColor(false, 255, 25, 25, 112, true);
YColor.MintCream = new YColor(false, 255, 245, 255, 250, true);
YColor.MistyRose = new YColor(false, 255, 255, 228, 225, true);
YColor.Moccasin = new YColor(false, 255, 255, 228, 181, true);
YColor.NavajoWhite = new YColor(false, 255, 255, 222, 173, true);
YColor.Navy = new YColor(false, 255, 0, 0, 128, true);
YColor.OldLace = new YColor(false, 255, 253, 245, 230, true);
YColor.Olive = new YColor(false, 255, 128, 128, 0, true);
YColor.OliveDrab = new YColor(false, 255, 107, 142, 35, true);
YColor.Orange = new YColor(false, 255, 255, 165, 0, true);
YColor.OrangeRed = new YColor(false, 255, 255, 69, 0, true);
YColor.Orchid = new YColor(false, 255, 218, 112, 214, true);
YColor.PaleGoldenrod = new YColor(false, 255, 238, 232, 170, true);
YColor.PaleGreen = new YColor(false, 255, 152, 251, 152, true);
YColor.PaleTurquoise = new YColor(false, 255, 175, 238, 238, true);
YColor.PaleVioletRed = new YColor(false, 255, 219, 112, 147, true);
YColor.PapayaWhip = new YColor(false, 255, 255, 239, 213, true);
YColor.PeachPuff = new YColor(false, 255, 255, 218, 185, true);
YColor.Peru = new YColor(false, 255, 205, 133, 63, true);
YColor.Pink = new YColor(false, 255, 255, 192, 203, true);
YColor.Plum = new YColor(false, 255, 221, 160, 221, true);
YColor.PowderBlue = new YColor(false, 255, 176, 224, 230, true);
YColor.Purple = new YColor(false, 255, 128, 0, 128, true);
YColor.Red = new YColor(false, 255, 255, 0, 0, true);
YColor.RosyBrown = new YColor(false, 255, 188, 143, 143, true);
YColor.RoyalBlue = new YColor(false, 255, 65, 105, 225, true);
YColor.SaddleBrown = new YColor(false, 255, 139, 69, 19, true);
YColor.Salmon = new YColor(false, 255, 250, 128, 114, true);
YColor.SandyBrown = new YColor(false, 255, 244, 164, 96, true);
YColor.SeaGreen = new YColor(false, 255, 46, 139, 87, true);
YColor.SeaShell = new YColor(false, 255, 255, 245, 238, true);
YColor.Sienna = new YColor(false, 255, 160, 82, 45, true);
YColor.Silver = new YColor(false, 255, 192, 192, 192, true);
YColor.SkyBlue = new YColor(false, 255, 135, 206, 235, true);
YColor.SlateBlue = new YColor(false, 255, 106, 90, 205, true);
YColor.SlateGray = new YColor(false, 255, 112, 128, 144, true);
YColor.Snow = new YColor(false, 255, 255, 250, 250, true);
YColor.SpringGreen = new YColor(false, 255, 0, 255, 127, true);
YColor.SteelBlue = new YColor(false, 255, 70, 130, 180, true);
YColor.Tan = new YColor(false, 255, 210, 180, 140, true);
YColor.Teal = new YColor(false, 255, 0, 128, 128, true);
YColor.Thistle = new YColor(false, 255, 216, 191, 216, true);
YColor.Tomato = new YColor(false, 255, 255, 99, 71, true);
YColor.Transparent = new YColor(false, 0, 255, 255, 255, true);
YColor.Turquoise = new YColor(false, 255, 64, 224, 208, true);
YColor.Violet = new YColor(false, 255, 238, 130, 238, true);
YColor.Wheat = new YColor(false, 255, 245, 222, 179, true);
YColor.White = new YColor(false, 255, 255, 255, 255, true);
YColor.WhiteSmoke = new YColor(false, 255, 245, 245, 245, true);
YColor.Yellow = new YColor(false, 255, 255, 255, 0, true);
YColor.YellowGreen = new YColor(false, 255, 154, 205, 50, true);
YColor._predefinedColors = null;
var YBrush = class {
  constructor(c, disableAntialias) {
    this._noAntiAlias = false;
    this._color = c;
    if (typeof disableAntialias != "undefined") {
      this._noAntiAlias = disableAntialias;
    }
  }
  get noAntiAlias() {
    return this._noAntiAlias;
  }
  get color() {
    return this._color;
  }
};
var YSolidBrush = class extends YBrush {
};
var YLinearGradientBrush = class extends YBrush {
  constructor(c1, c2) {
    super(c1);
    this._color1 = c1;
    this._color2 = c2;
  }
  get color1() {
    return this._color1;
  }
  get color2() {
    return this._color2;
  }
};
var YPen = class {
  constructor(color, thickness, disableAntialias) {
    this._thickness = 1;
    this._color = YColor.Black;
    this._noAntiAlias = false;
    this._startCap = 1;
    this._endCap = 1;
    this._linejoin = YPen.LineJoin.Miter;
    this._thickness = thickness;
    this._color = thickness > 0 ? color : YColor.Transparent;
    if (typeof disableAntialias != "undefined") {
      this._noAntiAlias = disableAntialias;
    }
  }
  get noAntiAlias() {
    return this._noAntiAlias;
  }
  get lineWidth() {
    return this._thickness;
  }
  get strokeStyle() {
    return this._color.htmlCode;
  }
  get color() {
    return this._color;
  }
  set startCap(value) {
    this._startCap = value;
  }
  set endCap(value) {
    this._endCap = value;
  }
  set linejoin(value) {
    this._linejoin = value;
  }
};
(function(YPen2) {
  let LineJoin;
  (function(LineJoin2) {
    LineJoin2[LineJoin2["Miter"] = 0] = "Miter";
    LineJoin2[LineJoin2["Bevel"] = 1] = "Bevel";
    LineJoin2[LineJoin2["Round"] = 2] = "Round";
    LineJoin2[LineJoin2["MiterClipped"] = 3] = "MiterClipped";
  })(LineJoin = YPen2.LineJoin || (YPen2.LineJoin = {}));
})(YPen || (YPen = {}));
var YRectangle = class {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }
};
var Point = class {
  constructor(valueX, valueY) {
    this.X = valueX >> 0;
    this.Y = valueY >> 0;
  }
};
var PointF = class {
  constructor(valueX, valueY) {
    this.X = valueX;
    this.Y = valueY;
  }
};
var captureParametersSet = class {
  constructor() {
    this.captureType = YDataRenderer.CaptureType.SVG;
    this.captureFolder = "/";
    this.captureWidth = 1024;
    this.captureHeight = 1024;
    this.captureDPI = 96;
  }
};
var GenericPanel = class {
  constructor(parent, directParent) {
    this._userData = null;
    this._enabled = false;
    this._panelTextAlign = GenericPanel.TextAlign.LEFT;
    this._text = "";
    this._bgColor = new YColor(false, 255, 255, 255, 192);
    this._borderColor = YColor.Black;
    this._borderthickness = 1;
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
  get userData() {
    return this._userData;
  }
  set userData(value) {
    this._userData = value;
  }
  get directParent() {
    return this._directParent;
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
  get panelTextAlign() {
    return this._panelTextAlign;
  }
  set panelTextAlign(value) {
    this._panelTextAlign = value;
    if (this._enabled)
      this._parentRenderer.redraw();
  }
  get text() {
    return this._text;
  }
  set text(value) {
    this._text = value;
    this._parentRenderer.clearCachedObjects();
    if (this._enabled)
      this._parentRenderer.redraw();
  }
  get bgColor() {
    return this._bgColor;
  }
  set bgColor(value) {
    this._bgColor = value;
    this._bgBrush = null;
    if (this._enabled)
      this._parentRenderer.redraw();
  }
  get borderColor() {
    return this._borderColor;
  }
  set borderColor(value) {
    this._borderColor = value;
    this._pen = null;
    if (this._enabled)
      this._parentRenderer.redraw();
  }
  get borderthickness() {
    return this._borderthickness;
  }
  set borderthickness(value) {
    if (value < 0)
      throw "Border thickness must be a positive value";
    this._borderthickness = value;
    this._parentRenderer.clearCachedObjects();
    this._pen = null;
    if (this._enabled)
      this._parentRenderer.redraw();
  }
  get padding() {
    return this._padding;
  }
  set padding(value) {
    if (value < 0)
      throw new RangeError("Padding must be a positive value");
    this._padding = value;
    this._parentRenderer.clearCachedObjects();
    if (this._enabled)
      this._parentRenderer.redraw();
  }
  get verticalMargin() {
    return this._verticalMargin;
  }
  set verticalMargin(value) {
    this._verticalMargin = value;
    if (this._enabled)
      this._parentRenderer.redraw();
  }
  get horizontalMargin() {
    return this._horizontalMargin;
  }
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
  get font() {
    return this._font;
  }
};
(function(GenericPanel2) {
  class HorizontalAlignPosEnumItem extends YEnumItem {
    constructor(value, humanreadable, container) {
      super(value, humanreadable, HorizontalAlignPos);
    }
  }
  GenericPanel2.HorizontalAlignPosEnumItem = HorizontalAlignPosEnumItem;
  class HorizontalAlignPos extends YEnum {
  }
  HorizontalAlignPos.LEFT = new HorizontalAlignPosEnumItem("LEFT", "Left");
  HorizontalAlignPos.CENTER = new HorizontalAlignPosEnumItem("CENTER", "Center");
  HorizontalAlignPos.RIGHT = new HorizontalAlignPosEnumItem("RIGHT", "Right");
  GenericPanel2.HorizontalAlignPos = HorizontalAlignPos;
  class VerticalAlignPosEnumItem extends YEnumItem {
    constructor(value, humanreadable, container) {
      super(value, humanreadable, VerticalAlignPos);
    }
  }
  GenericPanel2.VerticalAlignPosEnumItem = VerticalAlignPosEnumItem;
  class VerticalAlignPos extends YEnum {
  }
  VerticalAlignPos.TOP = new VerticalAlignPosEnumItem("TOP", "Top");
  VerticalAlignPos.CENTER = new VerticalAlignPosEnumItem("CENTER", "Center");
  VerticalAlignPos.BOTTOM = new VerticalAlignPosEnumItem("BOTTOM", "Bottom");
  GenericPanel2.VerticalAlignPos = VerticalAlignPos;
  class TextAlignEnumItem extends YEnumItem {
    constructor(value, humanreadable, container) {
      super(value, humanreadable, TextAlign);
    }
  }
  GenericPanel2.TextAlignEnumItem = TextAlignEnumItem;
  class TextAlign extends YEnum {
  }
  TextAlign.LEFT = new TextAlignEnumItem("LEFT", "Left");
  TextAlign.CENTER = new TextAlignEnumItem("CENTER", "Center");
  TextAlign.RIGHT = new TextAlignEnumItem("RIGHT", "Right");
  GenericPanel2.TextAlign = TextAlign;
})(GenericPanel || (GenericPanel = {}));
var MessagePanel = class extends GenericPanel {
  constructor(parent, directParent) {
    super(parent, directParent);
    this._panelHrzAlign = GenericPanel.HorizontalAlignPos.CENTER;
    this._panelVrtAlign = GenericPanel.VerticalAlignPos.CENTER;
  }
  get panelHrzAlign() {
    return this._panelHrzAlign;
  }
  set panelHrzAlign(value) {
    this._panelHrzAlign = value;
    if (this._enabled)
      this._parentRenderer.redraw();
  }
  get panelVrtAlign() {
    return this._panelVrtAlign;
  }
  set panelVrtAlign(value) {
    this._panelVrtAlign = value;
    if (this._enabled)
      this._parentRenderer.redraw();
  }
};
var AnnotationPanel = class extends GenericPanel {
  constructor(parent, directParent) {
    super(parent, directParent);
    this._overlap = false;
    this._positionOffsetX = 50;
    this._positionOffsetY = 50;
    this._panelHrzAlign = GenericPanel.HorizontalAlignPos.CENTER;
    this._panelVrtAlign = GenericPanel.VerticalAlignPos.TOP;
  }
  get overlap() {
    return this._overlap;
  }
  set overlap(value) {
    if (!value && this._panelHrzAlign == GenericPanel.HorizontalAlignPos.CENTER && this._panelVrtAlign == GenericPanel.VerticalAlignPos.CENTER) {
      this._panelVrtAlign = GenericPanel.VerticalAlignPos.TOP;
    }
    this._overlap = value;
    this._parentRenderer.clearCachedObjects();
    this._parentRenderer.redraw();
  }
  get positionOffsetX() {
    return this._positionOffsetX;
  }
  set positionOffsetX(value) {
    this._positionOffsetX = value;
    this._parentRenderer.clearCachedObjects();
    if (this._enabled)
      this._parentRenderer.redraw();
  }
  get positionOffsetY() {
    return this._positionOffsetY;
  }
  set positionOffsetY(value) {
    this._positionOffsetY = value;
    this._parentRenderer.clearCachedObjects();
    if (this._enabled)
      this._parentRenderer.redraw();
  }
  get panelHrzAlign() {
    return this._panelHrzAlign;
  }
  set panelHrzAlign(value) {
    if (!this._overlap && value == GenericPanel.HorizontalAlignPos.CENTER && this._panelVrtAlign == GenericPanel.VerticalAlignPos.CENTER) {
      this._panelVrtAlign = GenericPanel.VerticalAlignPos.TOP;
    }
    this._panelHrzAlign = value;
    this._parentRenderer.clearCachedObjects();
    if (this._enabled)
      this._parentRenderer.redraw();
  }
  get panelVrtAlign() {
    return this._panelVrtAlign;
  }
  set panelVrtAlign(value) {
    if (!this._overlap && value == GenericPanel.VerticalAlignPos.CENTER && this._panelHrzAlign == GenericPanel.HorizontalAlignPos.CENTER) {
      this._panelHrzAlign = GenericPanel.HorizontalAlignPos.RIGHT;
    }
    this._panelVrtAlign = value;
    this._parentRenderer.clearCachedObjects();
    if (this._enabled)
      this._parentRenderer.redraw();
  }
};
var Zone = class {
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
  get directParent() {
    return this._directParent;
  }
  get userData() {
    return this._userData;
  }
  set userData(value) {
    this._userData = value;
  }
  resetCache() {
  }
  get zoneBrush() {
    if (this._zoneBrush == null)
      this._zoneBrush = new YSolidBrush(this._color);
    return this._zoneBrush;
  }
  get color() {
    return this._color;
  }
  set color(value) {
    this._color = value;
    this._zoneBrush = null;
    if (this.visible)
      this._parentRenderer.redraw();
  }
  get visible() {
    return this._visible;
  }
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
  get min() {
    return this._min;
  }
  set min(value) {
    if (value >= this._max && !YDataRenderer.minMaxCheckDisabled) {
      throw new RangeError("Min cannot be greater than max (" + this._max.toString() + ")");
    }
    this._min = value;
    this.resetCache();
    if (this.visible)
      this._parentRenderer.redraw();
  }
  get max() {
    return this._max;
  }
  set max(value) {
    if (value <= this._min && !YDataRenderer.minMaxCheckDisabled) {
      throw new RangeError("Max cannot be greater than min (" + this._min.toString() + ")");
    }
    this._max = value;
    this.resetCache();
    if (this.visible)
      this._parentRenderer.redraw();
  }
};
var Proportional = class {
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
  get userData() {
    return this._userData;
  }
  set userData(value) {
    this._userData = value;
  }
  get directParent() {
    return this._directParent;
  }
  get value() {
    return this._value;
  }
  set value(v) {
    this._value = v;
    this.set_refPoint();
    if (this._reset != null)
      this._reset(this);
  }
  get resizeRule() {
    return this._resizeRule;
  }
  set resizeRule(value) {
    this.set_refPoint();
    this._resizeRule = value;
  }
  set_refPoint() {
    this._refWidth = Math.max(1, this._parentRenderer.usableUiWidth());
    this._refHeight = Math.max(1, this._parentRenderer.usableUiHeight());
    this._refValue = this._value;
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
        return Math.min(newHeight / refHeight, newWidth / refWidth);
    }
    return 1;
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
};
(function(Proportional2) {
  class ResizeRuleEnumItem extends YEnumItem {
    constructor(value, humanreadable, container) {
      super(value, humanreadable, ResizeRule);
    }
  }
  Proportional2.ResizeRuleEnumItem = ResizeRuleEnumItem;
  class ResizeRule extends YEnum {
  }
  ResizeRule.FIXED = new ResizeRuleEnumItem("FIXED", "Fixed");
  ResizeRule.RELATIVETOWIDTH = new ResizeRuleEnumItem("RELATIVETOWIDTH", "Relative to Width");
  ResizeRule.RELATIVETOHEIGHT = new ResizeRuleEnumItem("RELATIVETOHEIGHT", "Relative to height");
  ResizeRule.RELATIVETOBOTH = new ResizeRuleEnumItem("RELATIVETOBOTH", "Relative to Width and Height");
  Proportional2.ResizeRule = ResizeRule;
})(Proportional || (Proportional = {}));
var YDataRenderer = class {
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
      document.addEventListener("mousemove", (e) => {
        YDataRenderer.globalMouseMove(e);
      });
      YDataRenderer.globalMouseMoveSet = true;
    }
    this.UIContainer = UIContainer;
    this.UIContainer.width = this.getContainerInnerWidth();
    this.UIContainer.height = this.getContainerInnerHeight();
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
    this._snapshotPanel.bgColor = new YColor(false, 200, 204, 247, 161);
    this._snapshotPanel.font.size = 16;
    this.AllowRedrawNoRefresh();
    this.containerResizedFct = () => {
      this.containerResize(null, null);
    };
    document.addEventListener("resize", this.containerResizedFct);
    this.resetRefrenceSize();
    this.documentVisibiltyChangeFct = () => {
      if (document.visibilityState === "visible") {
        this.redraw();
      }
    };
    document.addEventListener("visibilitychange", this.documentVisibiltyChangeFct);
  }
  get annotationPanels() {
    return this._annotationPanels;
  }
  get userData() {
    return this._userData;
  }
  static get minMaxCheckDisabled() {
    return YDataRenderer._disableMinMaxCheck;
  }
  static set minMaxCheckDisabled(value) {
    YDataRenderer._disableMinMaxCheck = value;
  }
  resetlegendPens() {
  }
  get getCaptureParameters() {
    return this._getCaptureParameters;
  }
  set getCaptureParameters(value) {
    this._getCaptureParameters = value;
  }
  get messagePanels() {
    return this._messagePanels;
  }
  static globalMouseMove(e) {
    YDataRenderer.globalMouseX = e.pageX;
    YDataRenderer.globalMouseY = e.pageY;
  }
  clearTransformationMatrix() {
    this._Scr2ElmMatrix = null;
    this._Elm2ScrMatrix = null;
  }
  findElementAbsolutePosition(el) {
    let staticFound = false;
    let relativeFound = false;
    let dx = 0;
    let dy = 0;
    while (el != null) {
      let style = window.getComputedStyle(el);
      if (!relativeFound && style.position == "static" && !staticFound) {
        dx = el.offsetLeft + parseFloat(style.borderLeftWidth);
        dy = el.offsetTop + parseFloat(style.borderTopWidth);
        staticFound = true;
      }
      if (style.position == "relative" || style.position == "absolute") {
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
      while (el != null) {
        let parent = el.parentElement;
        let style = window.getComputedStyle(el);
        let dx = AsolutePositionsStack[index].X;
        let dy = AsolutePositionsStack[index].Y;
        if (index < AsolutePositionsStack.length - 1) {
          dx -= AsolutePositionsStack[index + 1].X;
          dy -= AsolutePositionsStack[index + 1].Y;
        }
        let matrix = style["transform"];
        if (matrix != "none") {
          let matrixStr = matrix.match(/matrix.*\((.+)\)/)[1].split(", ");
          let matrixValues = [];
          for (let i = 0; i < 6; i++) {
            matrixValues.push(parseFloat(matrixStr[i]));
          }
          let OriginMatrixMatrixBefore = null;
          let TransformMatrix = Matrix3x3.newMatrix(matrixValues[0], matrixValues[2], matrixValues[4], matrixValues[1], matrixValues[3], matrixValues[5], 0, 0, 1);
          let OriginMatrixMatrixAfter = null;
          if (style.transformOrigin) {
            let parts = style.transformOrigin.split(" ");
            let Ox = Number.parseFloat(parts[0]);
            let Oy = Number.parseFloat(parts[1]);
            OriginMatrixMatrixBefore = Matrix3x3.newTranslateMatrix(-Ox, -Oy);
            OriginMatrixMatrixAfter = Matrix3x3.newTranslateMatrix(Ox, Oy);
          }
          if (OriginMatrixMatrixBefore != null)
            MatrixStack.push(OriginMatrixMatrixBefore);
          if (TransformMatrix != null)
            MatrixStack.push(TransformMatrix);
          if (OriginMatrixMatrixAfter != null)
            MatrixStack.push(OriginMatrixMatrixAfter);
        }
        if (dx != 0 || dy != 0)
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
    return this._redrawAllowed == 0;
  }
  setPatchAnnotationCallback(callback) {
    this._PatchAnnotationCallback = callback;
  }
  patchAnnotation(text) {
    text = text.replace("\\n", "\n");
    if (text.indexOf("$") < 0)
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
    let p = m.multiplyByV(v).toPoint();
    if (p.X < 0 || p.Y < 0 || p.X > this.UIContainer.offsetWidth || p.Y > this.UIContainer.offsetHeight)
      return null;
    return p;
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
  }
  getContainerInnerHeight() {
    return this.UIContainer.offsetHeight;
  }
  Draw(timestamp) {
    if (!this.canRedraw())
      return 0;
    let w = this.getContainerInnerWidth();
    let h = this.getContainerInnerHeight();
    if (w <= 5 || h <= 5)
      return 0;
    this.DisableRedraw();
    let offscreenCanvas = document.createElement("canvas");
    offscreenCanvas.width = w;
    offscreenCanvas.height = h;
    let g = new YGraphics(offscreenCanvas, w, h, 90);
    let start = performance.now();
    try {
      this.Render(g, w, h);
    } catch (e) {
      debugger;
      this.log("Rendering error: " + e.message);
    }
    let elapsed = performance.now() - start;
    let drawArea = this.UIContainer.getContext("2d");
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
  renderingPostProcessing() {
  }
  get resizeRule() {
    return this._resizeRule;
  }
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
    if (!(document.visibilityState === "visible"))
      return;
    if (this._redrawAllowed > 0)
      return;
    if (this.getContainerInnerWidth() < 2)
      return;
    if (this.getContainerInnerHeight() < 2)
      return;
    if (this.requestAnimationFrameID != null) {
      window.cancelAnimationFrame(this.requestAnimationFrameID);
    }
    this.requestAnimationFrameID = window.requestAnimationFrame((timestamp) => {
      try {
        this.Draw(timestamp);
      } catch (e) {
        console.log("caught");
        this.requestAnimationFrameID = null;
        throw e;
      }
      this.requestAnimationFrameID = null;
    });
  }
  usableUiWidth() {
    return this.getContainerInnerWidth();
  }
  usableUiHeight() {
    return this.getContainerInnerHeight();
  }
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
    this.clearTransformationMatrix();
    this.DisableRedraw();
    this.UIContainer.width = this.UIContainer.offsetWidth;
    this.UIContainer.height = this.UIContainer.offsetHeight;
    this.resetProportionalSizeObjectsCache(this.usableUiWidth(), this.usableUiHeight());
    this.AllowRedraw();
    this.redraw();
  }
  proportionnalsizeReset() {
    this.resetProportionalSizeObjectsCache(this.usableUiWidth(), this.usableUiHeight());
  }
  captureAndDownloadImage(captureType, defaultFilename, captureWidth, captureHeight, captureDPI) {
    let error = "";
    let w;
    let h;
    let ratio = this.getContainerInnerWidth() / this.getContainerInnerHeight();
    if (captureDPI == null)
      captureDPI = 90;
    if (defaultFilename == null || typeof defaultFilename == "undefined") {
      defaultFilename = "capture.";
      if (captureType == YDataRenderer.CaptureType.PNG) {
        defaultFilename = defaultFilename + "png";
      }
      if (captureType == YDataRenderer.CaptureType.SVG) {
        defaultFilename = defaultFilename + "svg";
      }
    }
    if (captureWidth == null || typeof captureWidth == "undefined") {
      w = this.getContainerInnerWidth();
      if (captureHeight == null || typeof captureHeight == "undefined") {
        h = this.getContainerInnerHeight();
      } else {
        h = captureHeight >> 0;
        w = h * ratio >> 0;
      }
    } else {
      w = captureWidth >> 0;
      if (captureHeight == null || typeof captureHeight == "undefined") {
        h = w * ratio >> 0;
      } else {
        h = captureHeight >> 0;
      }
    }
    if (w <= 5 || h <= 5)
      return;
    this.DisableRedraw();
    let DrawArea = document.createElement("canvas");
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
    this.resetProportionalSizeObjectsCachePush(newCoef);
    let renderok = false;
    this._snapshotPanel.enabled = false;
    try {
      let t = this.Render(g, w, h);
      renderok = true;
    } catch (e) {
      error = e.message;
      this.log("Render error: " + error);
    }
    this.log("capture completed");
    this.resetProportionalSizeObjectsCachePop();
    if (renderok) {
      let element = document.createElement("a");
      let data = g.get_downloadableData();
      element.setAttribute("href", data);
      element.setAttribute("download", defaultFilename);
      element.style.display = "none";
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
  }
  lostFocus(sender, e) {
  }
  get AllowPrintScreenCapture() {
    return this._AllowPrintScreenCapture;
  }
  set AllowPrintScreenCapture(value) {
    this._AllowPrintScreenCapture = value;
  }
  destroy() {
    document.removeEventListener("visibilitychange", this.documentVisibiltyChangeFct);
    document.removeEventListener("resize", this.containerResized);
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
  get refWidth() {
    return this._refWidth;
  }
  get refHeight() {
    return this._refHeight;
  }
  RendererCanvas_Click(sender, e) {
  }
  RendererCanvas_DoubleClick(sender, e) {
  }
  addMessagePanel() {
    let p = new MessagePanel(this, this);
    this._messagePanels.push(p);
    return p;
  }
  DrawMessagePanels(g, viewPortWidth, viewPortHeight) {
    for (let i = 0; i < this._messagePanels.length; i++) {
      if (this._messagePanels[i].enabled) {
        let p = this._messagePanels[i];
        let AvailableWidth = viewPortWidth - 2 * p.padding - p.borderthickness;
        if (AvailableWidth < 100)
          AvailableWidth = 100;
        let ssize = null;
        let sizeok = false;
        while (!sizeok) {
          ssize = g.MeasureString(p.text, p.font, AvailableWidth);
          if ((ssize.width >= this.UIContainer.width || ssize.height >= this.UIContainer.height) && p.font.size > 5) {
            p.font.size = Math.round(p.font.size * 9) / 10;
          } else
            sizeok = true;
        }
        if (ssize == null)
          return;
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
        let sf = new YStringFormat(16384);
        switch (p.panelTextAlign) {
          case MessagePanel.TextAlign.LEFT:
            sf.LineAlignment = 0;
            sf.Alignment = 0;
            break;
          case MessagePanel.TextAlign.RIGHT:
            sf.LineAlignment = 2;
            sf.Alignment = 2;
            break;
          default:
            sf.LineAlignment = 1;
            sf.Alignment = 1;
            break;
        }
        let r = new YRectangle(x + p.padding + p.borderthickness / 2 >> 0, y + p.padding + p.borderthickness / 2 >> 0, ssize.width + 1, ssize.height + 1);
        g.DrawStringRect(p.text, p.font, p.font.brush, r, sf);
      }
    }
  }
  drawAnnotationPanels(g, annotationPanels, viewPortWidth, viewPortHeight, overlap, mainViewPort) {
    let active = false;
    for (let i = 0; i < this.annotationPanels.length; i++) {
      if (this.annotationPanels[i].enabled)
        active = true;
    }
    if (!active)
      return;
    for (let i = 0; i < this.annotationPanels.length; i++) {
      if (annotationPanels[i].enabled && annotationPanels[i].overlap == overlap) {
        let p = annotationPanels[i];
        let AvailableWidth = viewPortWidth - 2 * p.padding - p.borderthickness;
        if (AvailableWidth < 100)
          AvailableWidth = 100;
        let textToDisplay = p.text.replace("\\n", "\n");
        if (textToDisplay.indexOf("$") >= 0) {
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
            if (!annotationPanels[i].overlap && mainViewPort.Lmargin < panelWidth + 10) {
              mainViewPort.Lmargin = panelWidth + 10;
            }
            break;
          case MessagePanel.HorizontalAlignPos.RIGHT:
            x = viewPortWidth - panelWidth - p.horizontalMargin;
            if (!annotationPanels[i].overlap && mainViewPort.Rmargin < panelWidth + 20) {
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
            if (!annotationPanels[i].overlap && mainViewPort.Tmargin < panelHeight + 20) {
              mainViewPort.Tmargin = panelHeight + 20;
            }
            break;
          case MessagePanel.VerticalAlignPos.BOTTOM:
            y = viewPortHeight - panelHeight - p.verticalMargin;
            if (!annotationPanels[i].overlap && mainViewPort.Bmargin < panelHeight + 20) {
              mainViewPort.Bmargin = panelHeight + 20;
            }
            break;
          default:
            y = (viewPortHeight - panelHeight) / 2;
            break;
        }
        if (annotationPanels[i].overlap) {
          x += annotationPanels[i].positionOffsetX / 100 * (viewPortWidth - panelWidth);
          y += annotationPanels[i].positionOffsetY / 100 * (viewPortHeight - panelHeight);
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
        let sf = new YStringFormat(16384);
        switch (p.panelTextAlign) {
          case MessagePanel.TextAlign.LEFT:
            sf.LineAlignment = 0;
            sf.Alignment = 0;
            break;
          case MessagePanel.TextAlign.RIGHT:
            sf.LineAlignment = 2;
            sf.Alignment = 2;
            break;
          default:
            sf.LineAlignment = 1;
            sf.Alignment = 1;
            break;
        }
        let r = new YRectangle(x + p.padding + p.borderthickness / 2, y + p.padding + p.borderthickness / 2, ssize.width + 1, ssize.height + 1);
        g.DrawStringRect(textToDisplay, p.font, p.font.brush, r, sf);
      }
    }
  }
  log(s) {
    if (this._logFunction == null)
      return;
    this._logFunction(s);
  }
};
YDataRenderer.RendererDebug = false;
YDataRenderer.FloatToStrformats = ["0", "0", "0", "0.0", "0.00", "0.000", "0.0000"];
YDataRenderer._disableMinMaxCheck = false;
YDataRenderer.globalMouseMoveSet = false;
YDataRenderer.globalMouseX = -1;
YDataRenderer.globalMouseY = -1;
(function(YDataRenderer2) {
  class CaptureTypeEnumItem extends YEnumItem {
    constructor(value, humanreadable, container) {
      super(value, humanreadable, CaptureType);
    }
  }
  YDataRenderer2.CaptureTypeEnumItem = CaptureTypeEnumItem;
  class CaptureType extends YEnum {
  }
  CaptureType.PNG = new CaptureTypeEnumItem("PNG", "Bitmap (PNG)");
  CaptureType.SVG = new CaptureTypeEnumItem("SVG", "Vector (SVG)");
  YDataRenderer2.CaptureType = CaptureType;
  class CaptureTargetEnumItem extends YEnumItem {
    constructor(value, humanreadable, container) {
      super(value, humanreadable, CaptureTarget);
    }
  }
  YDataRenderer2.CaptureTargetEnumItem = CaptureTargetEnumItem;
  class CaptureTarget extends YEnum {
  }
  CaptureTarget.ToClipBoard = new CaptureTargetEnumItem("ToClipBoard", "ClipBoard");
  CaptureTarget.ToFile = new CaptureTargetEnumItem("ToFile", "File");
  YDataRenderer2.CaptureTarget = CaptureTarget;
  class CaptureFormatsEnumItem extends YEnumItem {
    constructor(value, humanreadable, container) {
      super(value, humanreadable, CaptureFormats);
    }
  }
  YDataRenderer2.CaptureFormatsEnumItem = CaptureFormatsEnumItem;
  class CaptureFormats extends YEnum {
  }
  CaptureFormats.Keep = new CaptureFormatsEnumItem("Keep", "Keep original size");
  CaptureFormats.Fixed = new CaptureFormatsEnumItem("Fixed", "Fixed size");
  CaptureFormats.FixedWidth = new CaptureFormatsEnumItem("FixedWidth", "Fixed width, keep ration aspect");
  CaptureFormats.FixedHeight = new CaptureFormatsEnumItem("FixedHeight", "Fixed height, keep ration aspect");
  YDataRenderer2.CaptureFormats = CaptureFormats;
})(YDataRenderer || (YDataRenderer = {}));
var YGraphics = class {
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
    this._g.textBaseline = "top";
    this._width = width;
    this._height = height;
    this._dpi = dpi;
  }
  get_downloadableData() {
    return this._c.toDataURL("image/png");
  }
  get graphics() {
    return this._g;
  }
  setPen(p) {
    if (p == this._lastPen)
      return;
    if (p != null) {
      this._g.lineWidth = p.lineWidth;
      let st = p.strokeStyle;
      this._g.strokeStyle = p.strokeStyle;
    } else {
      this._g.lineWidth = 0;
    }
    this._lastPen = p;
  }
  setBrush(b) {
    if (b == this._lastBrush)
      return;
    if (b instanceof YSolidBrush) {
      this._g.fillStyle = b.color.htmlCode;
    } else if (b instanceof YLinearGradientBrush) {
      let lingrad = this._g.createLinearGradient(0, 0, 0, this._height);
      lingrad.addColorStop(0, b.color1.htmlCode);
      lingrad.addColorStop(1, b.color2.htmlCode);
      this._g.fillStyle = lingrad;
    } else {
      throw new Error("invalid / insupported brush type");
    }
    this._lastBrush = b;
  }
  setFont(f) {
    if (f == this._lastFont && !f.hasChanged)
      return;
    this._g.font = f.htmlCode;
    this._lastFont = f;
  }
  DrawLineXY(p, x1, y1, x2, y2) {
    if (p.noAntiAlias) {
      let offset = p.lineWidth == p.lineWidth >> 0 && (p.lineWidth & 1) == 1 ? 0.5 : 0;
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
    this._g.save();
    this._g.beginPath();
    this._g.rect(rect.x, rect.y, rect.w, rect.h);
    this._g.clip();
    this._clipCounter++;
  }
  ResetClip() {
    if (this._clipCounter <= 0)
      throw new Error("clipping stack error");
    this._g.restore();
    this._clipCounter--;
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
      let offset = p.lineWidth == p.lineWidth >> 0 && (p.lineWidth & 1) == 1 ? 0.5 : 0;
      this._g.rect(Math.round(rect.x) + offset, Math.round(rect.y) + offset, Math.round(rect.w), Math.round(rect.h));
    } else {
      this._g.rect(rect.x, rect.y, rect.w, rect.h);
    }
    this._g.stroke();
  }
  DrawRectangleXYHW(p, x, y, width, height) {
    if (p.noAntiAlias) {
      let offset = p.lineWidth == p.lineWidth >> 0 && (p.lineWidth & 1) == 1 ? 0.5 : 0;
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
    let sz = this.MeasureString(s, font, 1e4);
    if (format.Alignment == 1) {
      x -= sz.width >> 1;
    } else if (format.Alignment == 2)
      x -= sz.width;
    if (format.LineAlignment == 1) {
      y -= sz.height / 2 >> 0;
    } else if (format.LineAlignment == 2)
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
      case 0:
        break;
      case 1:
        y += (layoutRectangle.h - totalsz.height) / 2;
        break;
      case 2:
        y += layoutRectangle.h - totalsz.height;
        break;
    }
    let xOrigin = layoutRectangle.x;
    if (format.FormatFlags & 2) {
      this.Transform(layoutRectangle.x, layoutRectangle.y, Math.PI / 2);
      y -= layoutRectangle.y + layoutRectangle.w;
      xOrigin -= layoutRectangle.x;
    }
    for (let i = 0; i < totalsz.linesCount; i++) {
      let s2 = totalsz.lines[i];
      let sz = this.MeasureString(s2, font, 0);
      let x = xOrigin;
      switch (format.Alignment) {
        case 0:
          break;
        case 1:
          x += (layoutRectangle.w - sz.width) / 2;
          break;
        case 2:
          x += layoutRectangle.w - sz.width;
          break;
      }
      this._g.fillText(s2, x, y);
      y += dy;
    }
    if (format.FormatFlags & 2)
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
    } else {
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
      let offset = pen.lineWidth == pen.lineWidth >> 0 && (pen.lineWidth & 1) == 1 ? 0.5 : 0;
      this._g.moveTo(Math.round(points[0].X) + offset, Math.round(points[0].Y) + offset);
      for (let i = 1; i < points.length; i++) {
        this._g.lineTo(Math.round(points[i].X) + offset, Math.round(points[i].Y) + offset);
      }
    } else {
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
  get TextRenderingHint() {
    return this._textRenderingHint;
  }
  set TextRenderingHint(value) {
    this._textRenderingHint = value;
  }
  get SmoothingMode() {
    return this._smoothingMode;
  }
  set SmoothingMode(value) {
    this._smoothingMode = value;
  }
  DrawImage(srcimage, destRect, srcRect, srcUnit) {
    this._g.drawImage(srcimage, srcRect.x, srcRect.y, srcRect.w, srcRect.h, destRect.x, destRect.y, destRect.w, destRect.h);
  }
  comment(s) {
  }
};
YGraphics._debugDrawString = false;
var YGraphicsSVG = class extends YGraphics {
  constructor(canvas, width, height, dpi) {
    super(canvas, width, height, dpi);
    this._clipcount = 0;
    this._clipSectionsToClose = 0;
    this._transformSectionsToClose = 0;
    this._gradientCount = 0;
    YGraphicsSVG.SVGID++;
    this._SVGdefs = new YStringBuilder();
    this._SVGcontents = new YStringBuilder();
    this._SVGdefs.AppendLine('<clipPath id="pageClip_' + YGraphicsSVG.SVGID.toString() + '"><rect x="0" y="0"  width="' + width.toString() + '" height="' + height.toString() + '"/></clipPath>');
  }
  static escapeXml(unsafe) {
    return unsafe.replace(/[^ !#$%(-;=?-z]/g, (c) => "&#" + c.charCodeAt(0) + ";");
  }
  get_downloadableData() {
    return "data:image/svg+xml;base64," + btoa(this.get_svgContents());
  }
  DrawLineXY(p, x1, y1, x2, y2) {
    this._SVGcontents.AppendLine('<line x1="' + x1.toString() + '"  y1 ="' + y1.toString() + '"  x2 ="' + x2.toString() + '"  y2 ="' + y2.toString() + '" style = "stroke:' + p.color.svgCode + ";stroke-opacity:" + p.color.alphaCode + "; stroke-width:" + p.lineWidth.toString() + '"/>');
  }
  DrawLine(p, p1, p2) {
    this.DrawLineXY(p, p1.X, p1.Y, p2.X, p2.Y);
  }
  SetClip(rect) {
    this.ResetClip();
    this._SVGdefs.AppendLine('<clipPath id="clip_' + YGraphicsSVG.SVGID.toString() + "_" + this._clipcount.toString() + '"><rect x="' + rect.x.toString() + '" y="' + rect.y.toString() + '"  width="' + rect.w.toString() + '" height="' + rect.h.toString() + '"/></clipPath>');
    this._SVGcontents.AppendLine('<g clip-path="url(#clip_' + YGraphicsSVG.SVGID.toString() + "_" + this._clipcount.toString() + ')">');
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
      fillParam = 'fill = "' + brush.color.svgCode + '" fill-opacity="' + brush.color.alphaCode + '" ';
    } else if (brush instanceof YLinearGradientBrush) {
      this._SVGdefs.AppendLine('<linearGradient id="grad_' + YGraphicsSVG.SVGID.toString() + "_" + this._gradientCount + '" x1="0%" ' + (revert ? 'y1="100%" ' : 'y1="0%" ') + 'x2="0%" ' + (revert ? 'y2="0%" ' : 'y2="100%" ') + '>\r\n<stop offset="0%" style ="stop-color:' + brush.color1.svgCode + ";stop-opacity:" + brush.color1.alphaCode + '"/>\r\n<stop offset="100%" style ="stop-color:' + brush.color2.svgCode + ";stop-opacity:" + brush.color2.alphaCode + '"/>\r\n</linearGradient>');
      fillParam = 'fill="url(#grad_' + YGraphicsSVG.SVGID.toString() + "_" + this._gradientCount + ')" ';
      this._gradientCount++;
    } else {
      throw new ReferenceError("unsupported brush type.");
    }
    return fillParam;
  }
  FillRectangle(brush, rect) {
    this._SVGcontents.AppendLine('<rect x="' + rect.x.toString() + '"  y ="' + rect.y.toString() + '"  width ="' + rect.w.toString() + '"  height ="' + rect.h.toString() + '" ' + this.BrushToSVG(brush, true) + 'style="stroke-width:0"/>');
  }
  FillRectangleXYHW(brush, x, y, width, height) {
    this.FillRectangle(brush, new YRectangle(x, y, width, height));
  }
  DrawRectangle(p, rect) {
    this._SVGcontents.AppendLine('<rect x="' + rect.x.toString() + '"  y ="' + rect.y.toString() + '"  width ="' + rect.w.toString() + '"  height ="' + rect.h.toString() + '"  fill="none" style = "stroke:' + p.color.svgCode + ";stroke-opacity:" + p.color.alphaCode + "; stroke-width:" + p.lineWidth.toString() + '"/>');
  }
  DrawRectangleXYHW(p, x, y, width, height) {
    this.DrawRectangle(p, new YRectangle(x, y, width, height));
  }
  DrawEllipse(pen, x, y, width, height) {
    this._SVGcontents.AppendLine('<ellipse  cx="' + (x + width / 2).toString() + '"  cy ="' + (y + height / 2).toString() + '"  rx ="' + (width / 2).toString() + '"  ry ="' + (height / 2).toString() + '"  fill="none" style = "stroke:' + pen.color.svgCode + ";stroke-opacity:" + pen.color.alphaCode + "; stroke-width:" + pen.lineWidth.toString() + '"/>');
  }
  FillEllipse(brush, x, y, width, height) {
    this._SVGcontents.AppendLine('<ellipse  cx="' + (x + width / 2).toString() + '"  cy ="' + (y + height / 2).toString() + '"  rx ="' + (width / 2).toString() + '"  ry ="' + (height / 2).toString() + '" ' + this.BrushToSVG(brush, false) + 'style="stroke-width:0"/>');
  }
  DrawStringXY(s, font, brush, x, y) {
    let tokens = s.split("\n");
    for (let i = 0; i < tokens.length; i++) {
      s = tokens[i];
      this._SVGcontents.AppendLine('<text x="' + x.toString() + '" y="' + (y + font.sizeInPoints).toString() + '" text-anchor="start" font-family="' + font.name.toString() + '" font-size="' + font.sizeInPoints.toString() + 'pt" font-weight="' + (font.bold ? "bold" : "normal") + '" font-style="' + (font.italic ? "italic" : "normal") + '" ' + this.BrushToSVG(brush, false) + 'style="stroke-width:0">\r\n' + YGraphicsSVG.escapeXml(s) + "\r\n</text>");
      y += font.sizeInPoints * 1.75;
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
      case 0:
        break;
      case 1:
        y += -totalsz.height / 2;
        break;
      case 2:
        y += -totalsz.height;
        break;
    }
    let tokens = s.split("\n");
    for (let i = 0; i < tokens.length; i++) {
      let s2 = tokens[i];
      let sz = this.MeasureString(s2, font, 0);
      let x = point.X;
      switch (format.Alignment) {
        case 0:
          break;
        case 1:
          x += -sz.width / 2;
          break;
        case 2:
          x += -sz.width;
          break;
      }
      this._SVGcontents.AppendLine('<text x="' + x.toString() + '" y="' + y.toString() + '" text-anchor="start" font-family="' + font.name.toString() + '" font-size="' + font.sizeInPoints.toString() + 'pt" font-weight="' + (font.bold ? "bold" : "normal") + '" font-style="' + (font.italic ? "italic" : "normal") + '" ' + this.BrushToSVG(brush, false) + 'style="stroke-width:0">\r\n' + YGraphicsSVG.escapeXml(s2) + "\r\n</text>");
      y += font.sizeInPoints * 1.75;
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
      case 0:
        break;
      case 1:
        y += (layoutRectangle.h - totalsz.height) / 2;
        break;
      case 2:
        y += layoutRectangle.h - totalsz.height;
        break;
    }
    let tokens = s.split("\n");
    for (let i = 0; i < tokens.length; i++) {
      let s2 = tokens[i];
      let sz = this.MeasureString(s2, font, 0);
      let x = layoutRectangle.x;
      switch (format.Alignment) {
        case 0:
          break;
        case 1:
          x += (layoutRectangle.w - sz.width) / 2;
          break;
        case 2:
          x += layoutRectangle.w - sz.width;
          break;
      }
      this._SVGcontents.AppendLine('<text x="' + x.toString() + '" y="' + y.toString() + '" text-anchor="start" font-family="' + font.name.toString() + '" font-size="' + (font.sizeInPoints * 1.1).toString() + 'pt" font-weight="' + (font.bold ? "bold" : "normal") + '" font-style="' + (font.italic ? "italic" : "normal") + '" ' + this.BrushToSVG(brush, false) + 'style="stroke-width:0">\r\n' + YGraphicsSVG.escapeXml(s2) + "\r\n</text>");
      y += font.sizeInPoints * 1.75;
    }
  }
  Transform(dx, dy, angle) {
    this._SVGcontents.AppendLine('<g transform="translate(' + dx.toString() + " " + dy.toString() + ") rotate(" + (180 * angle / Math.PI).toString() + ')">');
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
    this._SVGcontents.Append('<path  d="M ' + points[0].X.toString() + " " + points[0].Y.toString());
    for (let i = 1; i < points.length; i += 1) {
      this._SVGcontents.Append(" L " + points[i].X.toString() + " " + points[i].Y.toString());
    }
    this._SVGcontents.AppendLine(' z" fill="none" style="stroke:' + pen.color.svgCode + ";stroke-opacity:" + pen.color.alphaCode + "; stroke-width:" + pen.lineWidth.toString() + '"/>');
  }
  DrawLines(pen, points) {
    if (points.length < 2)
      return;
    this._SVGcontents.Append('<path  d="M ' + points[0].X.toString() + " " + points[0].Y.toString());
    for (let i = 1; i < points.length; i++) {
      this._SVGcontents.Append(" L " + points[i].X.toString() + " " + points[i].Y.toString());
    }
    this._SVGcontents.AppendLine('" fill="none" style="stroke:' + pen.color.svgCode + ";stroke-opacity:" + pen.color.alphaCode + "; stroke-linecap:round; stroke-linejoin:round;stroke-width:" + pen.lineWidth.toString() + '"/>');
  }
  FillPolygon(brush, points) {
    if (points.length < 2)
      return;
    this._SVGcontents.Append('<path  d="M ' + points[0].X.toString() + " " + points[0].Y.toString());
    for (let i = 1; i < points.length; i++) {
      this._SVGcontents.Append(" L " + points[i].X.toString() + " " + points[i].Y.toString());
    }
    this._SVGcontents.AppendLine(' z" ' + this.BrushToSVG(brush, false) + 'style="stroke-width:0"/>\r\n');
  }
  DrawImage(image, destRect, srcRect, srcUnit) {
    throw new Error("DrawImage not supported, find an other way.");
  }
  save(filename) {
    throw new Error("Direct save to file not supported.");
  }
  comment(s) {
    this._SVGcontents.AppendLine("<!--" + s + "-->");
  }
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
    return '<?xml version = "1.0" standalone = "no" ?>\r\n<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\r\n<svg width = "' + physicalWidth + 'cm" height = "' + physicalheight + 'cm" viewBox = "0 0 ' + this._width.toString() + " " + this._height.toString() + '" xmlns = "http://www.w3.org/2000/svg" version = "1.1" >\r\n<defs>\r\n' + this._SVGdefs.contents + '</defs>\r\n<g clip-path="url(#pageClip_' + YGraphicsSVG.SVGID.toString() + ')">\r\n' + this._SVGcontents.contents + "</g>\r\n</svg>\n";
  }
};
YGraphicsSVG.SVGID = 0;

// obj/rdonly/Renderer/YAngularGauge.js
var YAngularZone = class extends Zone {
  constructor(parentRenderer, directParent) {
    super(parentRenderer, directParent);
    this._path = null;
    this._width = 10;
    this._outerRadius = 98;
  }
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
};
var YAngularGauge = class extends YDataRenderer {
  constructor(UIContainer, logFunction) {
    super(UIContainer, logFunction);
    this._min = 0;
    this._max = 100;
    this.SegmentMaxLength = 8;
    this._borderpen = null;
    this._borderColor = YColor.Black;
    this._bgBrush = null;
    this._backgroundColor1 = YColor.FromArgb(255, 240, 240, 240);
    this._backgroundColor2 = YColor.FromArgb(255, 200, 200, 200);
    this._borderThickness = 5;
    this._valueFormater = null;
    this._minmaxFormater = null;
    this._thickness = 20;
    this._value = 0;
    this._needleValue = 0;
    this._color1 = YColor.Green;
    this._color2 = YColor.Red;
    this._graduationPen = null;
    this._graduationColor = YColor.Black;
    this._graduationThickness = 2;
    this._graduationSize = 10;
    this._graduation = 10;
    this._unitFactor = 1;
    this._unit = "";
    this._subgraduationPen = null;
    this._subgraduationColor = YColor.Black;
    this._subgraduationThickness = 1;
    this._subgraduationSize = 5;
    this._graduationOuterRadiusSize = 98;
    this._subgraduationCount = 5;
    this._statusColor = YColor.Gray;
    this._statusLine = "";
    this._showNeedle = true;
    this._needleBrush = null;
    this._needleColor = YColor.Red;
    this._needleMaxSpeed = 5;
    this._needleLength1 = 90;
    this._needleLength2 = 5;
    this._needleWidth = 5;
    this._needleContourPen = null;
    this._needleContourColor = YColor.DarkRed;
    this._needleContourThickness = 1;
    this._showMinMax = true;
    this._path = null;
    this._graduationFont = new YFont(this, this, Math.min(this.getContainerInnerWidth(), this.getContainerInnerHeight()) / 15, null);
    this._unitFont = new YFont(this, this, Math.min(this.getContainerInnerWidth(), this.getContainerInnerHeight()) / 20, null);
    this._statusFont = new YFont(this, this, Math.min(this.getContainerInnerWidth(), this.getContainerInnerHeight()) / 15, null);
    this.unitFont.color = YColor.DarkGray;
    this._statusFont.color = YColor.DarkGray;
    this.resizeRule = Proportional.ResizeRule.RELATIVETOBOTH;
    this._zones = [];
  }
  get min() {
    return this._min;
  }
  set min(value) {
    if (value >= this._max && !YDataRenderer.minMaxCheckDisabled) {
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
    if (value <= this._min && !YDataRenderer.minMaxCheckDisabled) {
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
      this._borderpen = new YPen(this._borderColor, this._borderThickness);
      this._borderpen.startCap = 1;
      this._borderpen.endCap = 1;
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
    let mainViewPort = new ViewPortSettings();
    mainViewPort.Lmargin = 0;
    mainViewPort.Rmargin = 0;
    mainViewPort.Tmargin = 0;
    mainViewPort.Bmargin = 0;
    g.SmoothingMode = YSmoothingMode.HighQuality;
    g.TextRenderingHint = YTextRenderingHint.AntiAlias;
    let stringFormat4Sizing = new YStringFormat(16384);
    let stringFormat = new YStringFormat(16384);
    stringFormat.Alignment = 1;
    stringFormat.LineAlignment = 1;
    this.drawAnnotationPanels(g, this._annotationPanels, w, h, false, mainViewPort);
    g.TextRenderingHint = YTextRenderingHint.AntiAlias;
    let xcenter = mainViewPort.Lmargin + (w - mainViewPort.Lmargin - mainViewPort.Rmargin) / 2;
    let ycenter = mainViewPort.Tmargin + (h - mainViewPort.Tmargin - mainViewPort.Bmargin) / 2;
    let radius = Math.min((w - mainViewPort.Lmargin - mainViewPort.Rmargin) / 2, (h - mainViewPort.Tmargin - mainViewPort.Bmargin) / 2) - this.borderThickness;
    let circonference = 2 * radius * 3.14 >> 0;
    let AngleAperture = 4 * 2 * Math.PI / 5;
    if (this._path == null) {
      let outterlength = 2 * radius * Math.PI;
      let stepCount = outterlength / this.SegmentMaxLength >> 0;
      let stepsize = 2 * Math.PI / stepCount;
      this._path = new Array(stepCount).fill(null);
      let n = 0;
      for (let i = 0; i < stepCount; i++) {
        let a = 2 * i * Math.PI / stepCount;
        this._path[n++] = new PointF(xcenter + radius * Math.cos(a), ycenter - radius * Math.sin(a));
      }
    }
    if (this._bgBrush == null)
      this._bgBrush = new YLinearGradientBrush(this._backgroundColor1, this._backgroundColor2);
    if (this._borderpen == null) {
      this._borderpen = new YPen(this._borderColor, this._borderThickness);
      this._borderpen.linejoin = YPen.LineJoin.Round;
    }
    if (this._path.length > 3)
      g.FillPolygon(this._bgBrush, this._path);
    if (this._graduationPen == null)
      this._graduationPen = new YPen(this._graduationColor, this._graduationThickness);
    if (this._subgraduationPen == null)
      this._subgraduationPen = new YPen(this._subgraduationColor, this._subgraduationThickness);
    let unitDesc = (this._unitFactor != 1 ? "x" + this._unitFactor.toString() + " " : "") + this._unit;
    let size = g.MeasureStringSF(unitDesc.toString(), this._unitFont, 1e4, stringFormat4Sizing);
    let unitPos = new YRectangle(xcenter - size.width / 2 >> 0, ycenter + radius / 2 - size.height / 2 >> 0, size.width + 1 >> 0, size.height + 1 >> 0);
    g.DrawStringRect(unitDesc, this._unitFont, this._unitFont.brush, unitPos, stringFormat);
    if (this._statusLine != "") {
      size = g.MeasureStringSF(this._statusLine, this._statusFont, 1e4, stringFormat4Sizing);
      let statusPos = new YRectangle(xcenter - size.width / 2 >> 0, ycenter - radius / 3 - size.height / 2 >> 0, size.width + 1, size.height + 1);
      g.DrawStringRect(this._statusLine, this._statusFont, this._statusFont.brush, statusPos, stringFormat);
    }
    let firstGraduation;
    let gratuationCount;
    let Angle, C, S, R1, R2;
    let outerCoef = this._graduationOuterRadiusSize / 100;
    for (let i = 0; i < this._zones.length; i++) {
      if (this._zones[i].visible) {
        if (this._zones[i].path == null) {
          let zmin = Math.max(this._min, Math.min(this._max, this._zones[i].min));
          let zmax = Math.max(this._min, Math.min(this._max, this._zones[i].max));
          if (zmax > zmin) {
            let zOuterCoef = this._zones[i].outerRadius / 100;
            let Angle1 = (Math.PI - AngleAperture) / 2 + AngleAperture * (zmin - this._min) / (this._max - this._min);
            let Angle2 = (Math.PI - AngleAperture) / 2 + AngleAperture * (zmax - this._min) / (this._max - this._min);
            let outterlength = (Angle2 - Angle1) * radius;
            let stepCount = outterlength / this.SegmentMaxLength >> 0;
            if (stepCount < 2)
              stepCount = 2;
            this._zones[i].setPathSize(2 * stepCount + 2);
            for (let j = 0; j <= stepCount; j++) {
              let A = Angle1 + (Angle2 - Angle1) * j / stepCount;
              this._zones[i].setPathPoint(j, new PointF(xcenter - radius * zOuterCoef * Math.cos(A), ycenter - radius * zOuterCoef * Math.sin(A)));
            }
            let innerRadiusCoef = zOuterCoef - this._zones[i].width / 100;
            for (let j = stepCount; j >= 0; j--) {
              let A = Angle1 + (Angle2 - Angle1) * j / stepCount;
              this._zones[i].setPathPoint(2 * stepCount + 1 - j, new PointF(xcenter - radius * innerRadiusCoef * Math.cos(A), ycenter - radius * innerRadiusCoef * Math.sin(A)));
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
    gratuationCount = 1 + (this._max - this._min) / this._graduation >> 0;
    if (this._subgraduationCount > 0 && this._subgraduationCount * gratuationCount < circonference) {
      let subgraduation = this._graduation / this._subgraduationCount;
      firstGraduation = subgraduation * (this._min / subgraduation >> 0);
      if (this._min < 0)
        firstGraduation -= subgraduation;
      while (firstGraduation < this._min) {
        firstGraduation += subgraduation;
      }
      gratuationCount = 1 + (this._max - this._min) / subgraduation >> 0;
      for (let i = 0; i < gratuationCount; i++) {
        let value = firstGraduation + i * subgraduation;
        if (value <= this._max) {
          Angle = (Math.PI - AngleAperture) / 2 + AngleAperture * (value - this._min) / (this._max - this._min);
          C = Math.cos(Angle);
          S = Math.sin(Angle);
          R1 = outerCoef * (radius - this._borderThickness / 2);
          R2 = (100 - this._subgraduationSize) * (outerCoef * (radius - this._borderThickness / 2)) / 100;
          g.DrawLineXY(this._subgraduationPen, xcenter - R1 * C, ycenter - R1 * S, xcenter - R2 * C, ycenter - R2 * S);
        }
      }
    }
    if (gratuationCount < circonference) {
      for (let i = 0; i < gratuationCount; i++) {
        let gvalue = firstGraduation + i * this._graduation;
        if (gvalue <= this._max) {
          Angle = (Math.PI - AngleAperture) / 2 + AngleAperture * (gvalue - this._min) / (this._max - this._min);
          C = Math.cos(Angle);
          S = Math.sin(Angle);
          R1 = outerCoef * (radius - this._borderThickness / 2);
          R2 = (100 - this._graduationSize) * (outerCoef * (radius - this._borderThickness / 2)) / 100;
          g.DrawLineXY(this._graduationPen, xcenter - R1 * C, ycenter - R1 * S, xcenter - R2 * C, ycenter - R2 * S);
          size = g.MeasureStringSF(gvalue.toString().trim(), this._graduationFont, 1e3, stringFormat4Sizing);
          let HalfDiagonal = 0.4 * Math.sqrt(size.width * size.width + size.height * size.height);
          let position = new YRectangle(xcenter - (R2 - HalfDiagonal) * C - size.width / 2 >> 0, ycenter - (R2 - HalfDiagonal) * S - size.height / 2 >> 0, (size.width >> 0) + 1, size.height >> 0);
          g.DrawStringRect(gvalue.toString(), this._graduationFont, this._graduationFont.brush, position, stringFormat);
        }
      }
    }
    if (this._borderThickness > 0 && this._path.length > 3)
      g.DrawPolygon(this._borderpen, this._path);
    this.drawAnnotationPanels(g, this._annotationPanels, w, h, true, mainViewPort);
    if (this._showNeedle) {
      if (this._needleValue != this._value) {
        let step = this._unitFactor * this._needleMaxSpeed * (this._max - this._min) / 100;
        if (Math.abs(this._value - this._needleValue) < step) {
          this._needleValue = this._value;
        } else if (this._needleValue < this.value) {
          this._needleValue += step;
        } else {
          this._needleValue -= step;
        }
      }
      let needlevalue = this._needleValue / this._unitFactor;
      let allowedOverflow = (this._max - this.min) * 0.05;
      if (needlevalue < this._min - allowedOverflow)
        needlevalue = this._min - allowedOverflow;
      if (needlevalue > this._max + allowedOverflow)
        needlevalue = this._max + allowedOverflow;
      Angle = (Math.PI - AngleAperture) / 2 + AngleAperture * (needlevalue - this._min) / (this._max - this._min);
      C = Math.cos(Angle);
      S = Math.sin(Angle);
      R1 = radius * this._needleLength1 / 100;
      R2 = radius * this._needleLength2 / 100;
      let R3 = radius * this._needleWidth / 200;
      let needlepath = new Array(4).fill(null);
      needlepath[0] = new PointF(xcenter - R1 * C, ycenter - R1 * S);
      needlepath[1] = new PointF(xcenter + R3 * S, ycenter - R3 * C);
      needlepath[2] = new PointF(xcenter + R2 * C, ycenter + R2 * S);
      needlepath[3] = new PointF(xcenter - R3 * S, ycenter + R3 * C);
      if (this._needleBrush == null)
        this._needleBrush = new YSolidBrush(this._needleColor);
      g.FillPolygon(this._needleBrush, needlepath);
      if (this._needleContourThickness > 0) {
        if (this._needleContourPen == null) {
          this._needleContourPen = new YPen(this._needleContourColor, this._needleContourThickness);
          this._needleContourPen.startCap = 2;
          this._needleContourPen.endCap = 2;
          this._needleContourPen.linejoin = YPen.LineJoin.Round;
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
};

// obj/rdonly/Renderer/YDigitalDisplay.js
var YDigitalDisplay = class extends YDataRenderer {
  constructor(UIContainer, logFunction) {
    super(UIContainer, logFunction);
    this._bgBrush = null;
    this._backgroundColor1 = YColor.Black;
    this._backgroundColor2 = YColor.FromArgb(255, 48, 48, 48);
    this._alternateValue = null;
    this._valueFormater = null;
    this._hrzAlignmentOfset = 5;
    this._hrzAlignment = YDigitalDisplay.HrzAlignment.DECIMAL;
    this._outOfRangeMin = Number.NaN;
    this._outOfRangeMax = Number.NaN;
    this._outOfRangeColor = YColor.Red;
    this._value = 0;
    this._font = new YFont(this, this, Math.min(UIContainer.width / 5, UIContainer.height / 2), null);
    this._font.color = YColor.LightGreen;
    this.resizeRule = Proportional.ResizeRule.RELATIVETOBOTH;
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
  get alternateValue() {
    return this._alternateValue;
  }
  set alternateValue(value) {
    this._alternateValue = value;
    this.redraw();
  }
  get valueFormater() {
    return this._valueFormater;
  }
  set valueFormater(value) {
    this._valueFormater = value;
    this.redraw();
  }
  get hrzAlignmentOfset() {
    return this._hrzAlignmentOfset;
  }
  set hrzAlignmentOfset(value) {
    this._hrzAlignmentOfset = value;
    this.redraw();
  }
  get hrzAlignment() {
    return this._hrzAlignment;
  }
  set hrzAlignment(value) {
    this._hrzAlignment = value;
    this.redraw();
  }
  get outOfRangeMin() {
    return this._outOfRangeMin;
  }
  set outOfRangeMin(value) {
    if (!Number.isNaN(value) && !Number.isNaN(this._outOfRangeMax) && !YDataRenderer.minMaxCheckDisabled) {
      if (value >= this._outOfRangeMax)
        throw new RangeError("Min cannot be greater than max (" + this._outOfRangeMax.toString() + ")");
    }
    this._outOfRangeMin = value;
    this.redraw();
  }
  get outOfRangeMax() {
    return this._outOfRangeMax;
  }
  set outOfRangeMax(value) {
    if (!Number.isNaN(value) && !Number.isNaN(this._outOfRangeMin) && !YDataRenderer.minMaxCheckDisabled) {
      if (value <= this._outOfRangeMin)
        throw new RangeError("Min cannot be less than max (" + this._outOfRangeMin.toString() + ")");
    }
    this._outOfRangeMax = value;
    this.redraw();
  }
  get outOfRangeColor() {
    return this._outOfRangeColor;
  }
  set outOfRangeColor(value) {
    this._outOfRangeColor = value;
    this.redraw();
  }
  get value() {
    return this._value;
  }
  set value(value) {
    this._value = value;
    this.redraw();
  }
  get font() {
    return this._font;
  }
  clearCachedObjects() {
    if (this.font != null)
      this.font.ResetFont(null);
    this._bgBrush = null;
  }
  Render(g, w, h) {
    let mainViewPort = new ViewPortSettings();
    mainViewPort.Lmargin = 0;
    mainViewPort.Rmargin = 0;
    mainViewPort.Tmargin = 0;
    mainViewPort.Bmargin = 0;
    g.SmoothingMode = YSmoothingMode.HighQuality;
    g.TextRenderingHint = YTextRenderingHint.AntiAlias;
    let stringFormat = new YStringFormat(16384);
    stringFormat.Alignment = 1;
    stringFormat.LineAlignment = 1;
    if (this._bgBrush == null) {
      this._bgBrush = new YLinearGradientBrush(this._backgroundColor1, this._backgroundColor2);
    }
    g.FillRectangleXYHW(this._bgBrush, 0, 0, w, h);
    this.drawAnnotationPanels(g, this._annotationPanels, w, h, false, mainViewPort);
    if (mainViewPort.Tmargin >= 20)
      mainViewPort.Tmargin -= 10;
    if (mainViewPort.Bmargin >= 20)
      mainViewPort.Bmargin -= 10;
    g.TextRenderingHint = YTextRenderingHint.AntiAlias;
    let availWidth = w - (mainViewPort.Lmargin + mainViewPort.Rmargin);
    let availHeight = h - (mainViewPort.Tmargin + mainViewPort.Bmargin);
    if (availWidth > 10 && availHeight > 10) {
      let svalue;
      if (this._alternateValue == null) {
        svalue = this._valueFormater == null ? this.value.toFixed(3) : this._valueFormater(this, this.value);
        if (!Number.isNaN(this._outOfRangeMin) && this.value < this._outOfRangeMin) {
          this.font.alternateColor = this._outOfRangeColor;
        } else if (!Number.isNaN(this._outOfRangeMax) && this.value > this._outOfRangeMax) {
          this.font.alternateColor = this._outOfRangeColor;
        } else {
          this.font.alternateColor = null;
        }
      } else {
        this._font.alternateColor = null;
        svalue = this._alternateValue;
      }
      let size = g.MeasureStringSF(svalue, this.font, 1e4, stringFormat);
      let pos;
      let align = this._hrzAlignment;
      if (this._alternateValue != null && align == YDigitalDisplay.HrzAlignment.DECIMAL)
        align = YDigitalDisplay.HrzAlignment.RIGHT;
      if (align == YDigitalDisplay.HrzAlignment.DECIMAL && svalue.indexOf(".") < 0)
        align = YDigitalDisplay.HrzAlignment.RIGHT;
      switch (align) {
        case YDigitalDisplay.HrzAlignment.LEFT:
          pos = new YRectangle(mainViewPort.Lmargin + (availWidth * this.hrzAlignmentOfset / 100 >> 0), mainViewPort.Tmargin + (availHeight - size.height) / 2 >> 0, size.width + 1 >> 0, size.height + 1 >> 0);
          g.DrawStringRect(svalue, this.font, this.font.brush, pos, stringFormat);
          break;
        case YDigitalDisplay.HrzAlignment.CENTER:
          pos = new YRectangle(mainViewPort.Lmargin + (availWidth - size.width) / 2 >> 0, mainViewPort.Tmargin + (availHeight - size.height) / 2 >> 0, size.width + 1 >> 0, size.height + 1 >> 0);
          g.DrawStringRect(svalue, this.font, this.font.brush, pos, stringFormat);
          break;
        case YDigitalDisplay.HrzAlignment.DECIMAL:
          let left = "";
          let p = svalue.lastIndexOf(",");
          if (p < 0)
            p = svalue.lastIndexOf(".");
          if (p >= 0) {
            left = svalue.substring(0, p + 1);
          } else {
            p = 0;
            while (p < svalue.length && (svalue[p] >= "0" && svalue[p] <= "9" || svalue[p] == "-" || svalue[p] == "'" || svalue[p] == " ")) {
              p++;
            }
            left = svalue.substring(0, p);
          }
          let lsize = g.MeasureStringSF(left, this.font, 1e4, stringFormat);
          pos = new YRectangle(mainViewPort.Lmargin + (availWidth - lsize.width - availWidth * this.hrzAlignmentOfset / 100) >> 0, mainViewPort.Tmargin + (availHeight - size.height) / 2 >> 0, size.width + 1 >> 0, size.height + 1 >> 0);
          g.DrawStringRect(svalue, this.font, this.font.brush, pos, stringFormat);
          break;
        case YDigitalDisplay.HrzAlignment.RIGHT:
          pos = new YRectangle(mainViewPort.Lmargin + (availWidth - size.width - availWidth * this.hrzAlignmentOfset / 100) >> 0, mainViewPort.Tmargin + (availHeight - size.height) / 2 >> 0, size.width + 1 >> 0, size.height + 1 >> 0);
          g.DrawStringRect(svalue, this.font, this.font.brush, pos, stringFormat);
          break;
      }
    }
    this.drawAnnotationPanels(g, this._annotationPanels, w, h, true, mainViewPort);
    this.DrawMessagePanels(g, w, h);
    return 0;
  }
};
(function(YDigitalDisplay2) {
  class HrzAlignmentEnumItem extends YEnumItem {
    constructor(value, humanreadable, container) {
      super(value, humanreadable, HrzAlignment);
    }
  }
  YDigitalDisplay2.HrzAlignmentEnumItem = HrzAlignmentEnumItem;
  class HrzAlignment extends YEnum {
  }
  HrzAlignment.LEFT = new HrzAlignmentEnumItem("LEFT", "Left");
  HrzAlignment.CENTER = new HrzAlignmentEnumItem("CENTER", "Center");
  HrzAlignment.DECIMAL = new HrzAlignmentEnumItem("DECIMAL", "Decimal");
  HrzAlignment.RIGHT = new HrzAlignmentEnumItem("RIGHT", "Right");
  YDigitalDisplay2.HrzAlignment = HrzAlignment;
})(YDigitalDisplay || (YDigitalDisplay = {}));

// obj/rdonly/Renderer/YGraph.js
var pointXY = class {
  constructor(X, Y) {
    this.x = X === void 0 ? 0 : X;
    this.y = Y === void 0 ? 0 : Y;
  }
  clone() {
    return new pointXY(this.x, this.y);
  }
};
var TimeConverterParseResult = class {
  constructor() {
    this.success = false;
    this.result = 0;
  }
};
var TimeResolution = class {
  constructor() {
    this.step = 0;
    this.format = 0;
  }
};
var YDate = class extends Date {
  ToString(format) {
    let res = "";
    let ampm = "";
    if (format & YDate.D)
      res = res + this.getDate() + " ";
    if (format & YDate.M)
      res = res + YDate.months[this.getMonth()] + " ";
    if (format & YDate.YY) {
      let y = this.getFullYear().toString();
      res = res + y.substr(y.length - 2) + " ";
    } else if (format & YDate.YYYY) {
      let y = this.getFullYear().toString();
      res = res + y + " ";
    }
    if (format & YDate.CR)
      res = res + "\n";
    if (format & YDate.h) {
      if (YDate.use24Hformat) {
        let h = "0" + this.getHours().toString();
        res = res + h.substring(h.length - 2);
        if (!(format & YDate.m))
          res = res + "H";
      } else {
        let hour = this.getHours();
        ampm = "AM";
        if (hour > 11)
          ampm = "PM";
        if (hour > 12)
          hour = hour - 12;
        if (hour == 0)
          hour = 12;
        res = res + hour.toString();
      }
    }
    if (format & YDate.m) {
      let m = "0" + this.getMinutes().toString();
      res = res + ":" + m.substring(m.length - 2);
    }
    if (format & YDate.s) {
      let s = "0" + this.getSeconds().toString();
      res = res + ":" + s.substring(s.length - 2);
    }
    if (format & YDate.ms1) {
      let ms = "00" + this.getMilliseconds().toString();
      res = res + "." + ms.substring(ms.length - 3).substring(1);
    } else if (format & YDate.ms01) {
      let ms = "00" + this.getMilliseconds().toString();
      res = res + "." + ms.substring(ms.length - 3).substring(2);
    } else if (format & YDate.ms001) {
      let ms = "00" + this.getMilliseconds().toString();
      res = res + "." + ms.substring(ms.length - 3).substring(3);
    }
    if (format & YDate.h && !YDate.use24Hformat) {
      res = res + ampm;
    }
    return res;
  }
};
YDate.D = 1;
YDate.DD = 2;
YDate.M = 4;
YDate.YY = 8;
YDate.h = 16;
YDate.m = 32;
YDate.s = 64;
YDate.ms1 = 128;
YDate.ms01 = 256;
YDate.ms001 = 512;
YDate.CR = 1024;
YDate.isRelative = 2048;
YDate.YYYY = 4096;
YDate.d = new Date().toLocaleTimeString().toUpperCase();
YDate.use24Hformat = YDate.d.indexOf("AM") < 0 && YDate.d.indexOf("PM") < 0;
YDate.months = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
var TimeConverter = class {
  static UTCNow() {
    return new YDate();
  }
  static ToUnixTime(datetime) {
    return datetime.getTime() / 1e3;
  }
  static FromUnixTime(unixtime) {
    let t = new YDate();
    t.setTime(unixtime * 1e3);
    return t;
  }
  static tryParseStringToAbsDateTime(str) {
    let res = new TimeConverterParseResult();
    res.success = false;
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth();
    let day = date.getDate();
    let hours = 0;
    let minutes = 0;
    let seconds = 0;
    str = str.trim();
    while (str.indexOf("  ") > 0) {
      str = str.replace("  ", " ");
    }
    let dateFound = false;
    let timeFound = false;
    let it = str.split(" ");
    if (it.length <= 0)
      return res;
    for (let i = 0; i < it.length && i < 2; i++) {
      if (it[i].indexOf("-") > 0) {
        let tokens = it[i].split("-");
        if (tokens.length == 1) {
          day = parseInt(tokens[0]);
        } else if (tokens.length == 2) {
          day = parseInt(tokens[1]);
          month = parseInt(tokens[0]) - 1;
        } else {
          day = parseInt(tokens[2]);
          month = parseInt(tokens[1]) - 1;
          year = parseInt(tokens[0]);
        }
        dateFound = true;
      } else if (it[i].indexOf(":") > 0) {
        let tokens = it[i].split(":");
        if (tokens.length == 1) {
          hours = parseInt(tokens[0]);
        } else if (tokens.length == 2) {
          hours = parseInt(tokens[0]);
          minutes = parseInt(tokens[1]);
        } else {
          hours = parseInt(tokens[0]);
          minutes = parseInt(tokens[1]);
          seconds = parseFloat(tokens[2]);
        }
        timeFound = true;
      }
    }
    if (!timeFound && !dateFound)
      return res;
    if (isNaN(year) || isNaN(month) || isNaN(day) || isNaN(hours) || isNaN(minutes) || isNaN(seconds))
      return res;
    date.setFullYear(year, month, day);
    date.setHours(hours, minutes, seconds >> 0, 1e3 * (seconds % 1) >> 0);
    res.result = date.getTime() / 1e3;
    res.success = true;
    return res;
  }
  static tryParseStringToSecTimeSpan(st) {
    let res = new TimeConverterParseResult();
    let d = 0;
    st = st.toUpperCase();
    let n = st.indexOf("D");
    if (n > 0) {
      d = parseFloat(st.substring(0, n));
      if (isNaN(d)) {
        return res;
      }
      res.result += +d * 86400;
      if (n == st.length - 1) {
        res.success = true;
        return res;
      }
      st = st.substring(n + 1);
    }
    n = st.indexOf("H");
    if (n > 0) {
      d = parseFloat(st.substring(0, n));
      if (isNaN(d)) {
        return res;
      }
      res.result += d * 3600;
      if (n == st.length - 1) {
        res.success = true;
        return res;
      }
      st = st.substring(n + 1);
    }
    n = st.indexOf("M");
    if (n > 0) {
      d = parseFloat(st.substring(0, n));
      if (isNaN(d)) {
        return res;
      }
      res.result += d * 60;
      if (n == st.length - 1) {
        res.success = true;
        return res;
      }
      st = st.substring(n + 1);
    }
    n = st.indexOf("S");
    if (n < 0)
      n = st.length;
    d = parseFloat(st.substring(0, n));
    if (isNaN(d)) {
      return res;
    }
    res.result += d;
    res.success = true;
    return res;
  }
  static secTimeSpanToString(timespan, resolution) {
    let started = false;
    let res = "";
    if (timespan < 0) {
      res = "-";
      timespan = -timespan;
    }
    if (timespan >= 86400) {
      let d = timespan / 86400 >> 0;
      res = res + d.toString() + "d";
      timespan -= 86400 * d;
      started = true;
    }
    if (resolution >= 86400)
      return res != "" ? res : "0d";
    if (timespan >= 3600) {
      let d = timespan / 3600 >> 0;
      let ds = d.toString();
      if (started && ds.length == 1)
        ds = "0" + ds;
      res = res + ds + "h";
      timespan -= 3600 * d;
      started = true;
    }
    if (resolution >= 3600)
      return res != "" ? res : "0h";
    if (timespan < resolution)
      return res != "" ? res : "0h";
    if (timespan >= 60) {
      let d = timespan / 60 >> 0;
      let ds = d.toString();
      if (started && ds.length == 1)
        ds = "0" + ds;
      res = res + ds + "m";
      timespan -= 60 * d;
      started = true;
    }
    if (resolution >= 60)
      return res != "" ? res : "0m";
    if (timespan < resolution)
      return res != "" ? res : "0m";
    timespan = Math.round(timespan * 100) / 100;
    let s;
    if (resolution > 0.1) {
      s = timespan.toFixed(0);
    } else if (resolution > 0.01) {
      s = timespan.toFixed(1);
    } else if (resolution > 1e-3) {
      s = timespan.toFixed(2);
    } else {
      s = timespan.toString();
    }
    if (started && timespan < 10)
      s = "0" + s;
    res = res + s + "s";
    return res;
  }
  static RelativeFormat(dataDeltaTime, viewportDeltaTime, resolution) {
    let ShowSecondsTenth = true;
    let ShowSecondsHundredth = true;
    let ShowSeconds = true;
    let ShowMinutes = false;
    let ShowHours = false;
    let ShowDays = false;
    if (dataDeltaTime <= 0.1) {
      ShowSecondsHundredth = true;
    }
    if (dataDeltaTime <= 1) {
      ShowSecondsTenth = true;
    }
    if (dataDeltaTime >= 60 || viewportDeltaTime >= 60) {
      ShowMinutes = true;
    }
    if (dataDeltaTime >= 3600 || viewportDeltaTime >= 3600) {
      ShowHours = true;
    }
    if (dataDeltaTime >= 86400 || viewportDeltaTime >= 86400) {
      ShowDays = true;
    }
    if (resolution >= 0.1)
      ShowSecondsHundredth = false;
    if (resolution >= 1)
      ShowSecondsTenth = false;
    if (resolution >= 60)
      ShowSeconds = false;
    if (resolution >= 3600)
      ShowMinutes = false;
    if (resolution >= 86400)
      ShowHours = false;
    let format = 0;
    format |= YDate.isRelative;
    if (ShowSecondsTenth)
      format |= YDate.ms1;
    if (ShowSecondsHundredth)
      format |= YDate.ms01;
    if (ShowSeconds)
      format |= YDate.s;
    if (ShowMinutes)
      format |= YDate.m;
    if (ShowHours)
      format |= YDate.h;
    if (ShowDays)
      format |= YDate.D;
    return format;
  }
  static BestTimeformat(dataDeltaTime, viewportDeltaTime, tref) {
    let res = new TimeResolution();
    let ShowSecondsTenth = true;
    let ShowSecondsHundredth = true;
    let ShowSeconds = true;
    let ShowMinutes = false;
    let ShowHours = false;
    let ShowDays = false;
    let ShowMonths = false;
    let ShowYears = false;
    if (viewportDeltaTime <= 0.1) {
      res.step = 0.01;
    } else if (viewportDeltaTime <= 1) {
      res.step = 0.1;
    } else if (viewportDeltaTime <= 2) {
      res.step = 0.2;
    } else if (viewportDeltaTime <= 5) {
      res.step = 0.5;
    } else if (viewportDeltaTime <= 10) {
      res.step = 1;
    } else if (viewportDeltaTime <= 20) {
      res.step = 2;
    } else if (viewportDeltaTime <= 30) {
      res.step = 3;
    } else if (viewportDeltaTime <= 40) {
      res.step = 4;
    } else if (viewportDeltaTime <= 60) {
      res.step = 5;
    } else if (viewportDeltaTime <= 120) {
      res.step = 10;
    } else if (viewportDeltaTime <= 300) {
      res.step = 30;
    } else if (viewportDeltaTime <= 900) {
      res.step = 60;
    } else if (viewportDeltaTime <= 1800) {
      res.step = 180;
    } else if (viewportDeltaTime <= 3600) {
      res.step = 300;
    } else if (viewportDeltaTime <= 7200) {
      res.step = 600;
    } else if (viewportDeltaTime <= 14e3) {
      res.step = 900;
    } else if (viewportDeltaTime <= 21600) {
      res.step = 1800;
    } else if (viewportDeltaTime <= 43200) {
      res.step = 3600;
    } else if (viewportDeltaTime <= 86400) {
      res.step = 7200;
    } else if (viewportDeltaTime <= 2 * 86400) {
      res.step = 2 * 7200;
    } else if (viewportDeltaTime <= 4 * 86400) {
      res.step = 4 * 7200;
    } else if (viewportDeltaTime <= 7 * 86400) {
      res.step = 86400;
    } else if (viewportDeltaTime <= 14 * 86400) {
      res.step = 2 * 86400;
    } else if (viewportDeltaTime <= 28 * 86400) {
      res.step = 4 * 86400;
    } else if (viewportDeltaTime <= 56 * 86400) {
      res.step = 7 * 86400;
    } else if (viewportDeltaTime <= 112 * 86400) {
      res.step = 14 * 86400;
    } else if (viewportDeltaTime <= 224 * 86400) {
      res.step = 31 * 86400;
    } else if (viewportDeltaTime <= 448 * 86400) {
      res.step = 62 * 86400;
    } else if (viewportDeltaTime <= 896 * 86400) {
      res.step = 93 * 86400;
    } else {
      res.step = 365 * 86400;
    }
    if (tref == TimeConverter.TimeReference.ABSOLUTE) {
      ShowSecondsHundredth = true;
      ShowSecondsTenth = true;
      ShowMinutes = true;
      ShowHours = true;
      ShowDays = dataDeltaTime > 86400;
      ShowMonths = dataDeltaTime > 86400;
      ShowYears = dataDeltaTime > 28 * 6 * 86400;
      if (res.step >= 0.1)
        ShowSecondsHundredth = false;
      if (res.step >= 1)
        ShowSecondsTenth = false;
      if (res.step >= 60)
        ShowSeconds = false;
      if (res.step >= 3600)
        ShowMinutes = false;
      if (res.step >= 86400)
        ShowHours = false;
      if (res.step >= 31 * 86400)
        ShowDays = false;
      if (res.step >= 365 * 86400)
        ShowMonths = false;
      res.format = 0;
      if (ShowSecondsHundredth)
        res.format |= YDate.ms01;
      if (ShowSecondsTenth)
        res.format |= YDate.ms1;
      if (ShowSeconds)
        res.format |= YDate.s;
      if (ShowMinutes)
        res.format = res.format |= YDate.m;
      if (ShowHours)
        res.format = res.format |= YDate.h;
      if (res.format != 0 && (ShowDays || ShowMonths))
        res.format |= YDate.CR;
      if (ShowDays)
        res.format |= YDate.D;
      if (ShowMonths)
        res.format |= YDate.M;
      if (ShowYears)
        res.format |= YDate.YY;
      if (res.format == YDate.YY)
        res.format = YDate.YYYY;
    } else {
      res.format = TimeConverter.RelativeFormat(dataDeltaTime, viewportDeltaTime, res.step);
    }
    return res;
  }
};
(function(TimeConverter2) {
  class TimeReferenceEnumItem extends YEnumItem {
    constructor(value, humanreadable, container) {
      super(value, humanreadable, TimeReference);
    }
  }
  TimeConverter2.TimeReferenceEnumItem = TimeReferenceEnumItem;
  class TimeReference extends YEnum {
  }
  TimeReference.ABSOLUTE = new TimeReferenceEnumItem("ABSOLUTE", "Absolute");
  TimeReference.RELATIVE = new TimeReferenceEnumItem("RELATIVE", "Relative to first data");
  TimeConverter2.TimeReference = TimeReference;
})(TimeConverter || (TimeConverter = {}));
var MinMax = class {
  constructor(minimum, maximum) {
    this.Min = 0;
    this.Max = 0;
    this.Min = minimum;
    this.Max = maximum;
  }
};
var MinMaxHandler = class {
  static extend(M, factor) {
    if (isNaN(M.Min))
      return M;
    let delta = M.Max - M.Min;
    return new MinMax(M.Min - delta * (factor - 1) / 2, M.Max + delta * (factor - 1) / 2);
  }
  static DefaultValue(value1, value2) {
    if (typeof value2 === "undefined") {
      if (typeof value1 === "undefined")
        return new MinMax(Number.NaN, Number.NaN);
      return new MinMax(value1, value1);
    }
    if (typeof value1 === "undefined")
      return new MinMax(value2, value2);
    if (value2 < value1)
      throw new RangeError("MinMax invalid parameters (" + value1.toString() + ">" + value2.toString());
    return new MinMax(value1, value2);
  }
  static isDefined(v) {
    return !isNaN(v.Min);
  }
  static Combine(M1, M2) {
    if (isNaN(M1.Min))
      return new MinMax(M2.Min, M2.Max);
    if (isNaN(M2.Min))
      return new MinMax(M1.Min, M1.Max);
    let res = new MinMax(M2.Min, M2.Max);
    if (M1.Min < res.Min)
      res.Min = M1.Min;
    if (M1.Max < res.Min)
      res.Min = M1.Max;
    if (M1.Min > res.Max)
      res.Max = M1.Min;
    if (M1.Max > res.Max)
      res.Max = M1.Max;
    return res;
  }
  static CombineWithNumber(M1, value) {
    if (isNaN(M1.Min))
      return new MinMax(value, value);
    if (value < M1.Min)
      return new MinMax(value, M1.Max);
    if (value > M1.Max)
      return new MinMax(M1.Min, value);
    return new MinMax(M1.Min, M1.Max);
  }
};
var DataSegment = class {
  constructor(p) {
    this.data = [];
    this.count = 0;
    if (p instanceof Array) {
      this.data = new Array(p.length);
      DataSegment.ArrayCopy(p, 0, this.data, 0, p.length);
      this.count = p.length;
    } else if (p instanceof pointXY) {
      this.data = new Array(DataSegment.SegmentGranularity);
      this.data[0] = p;
      this.count = 1;
    } else {
      throw new Error("invalid constructor paramter type");
    }
  }
  static ArrayCopy(sourceArray, sourceIndex, destinationArray, destinationIndex, length) {
    for (let i = 0; i < length; i++) {
      destinationArray[destinationIndex + i] = sourceArray[sourceIndex + i].clone();
    }
  }
  grow() {
    let targetCount = this.data.length + DataSegment.SegmentGranularity;
    while (this.data.length < targetCount) {
      this.data.push(null);
    }
  }
};
DataSegment.SegmentGranularity = 1e3;
var DataSerie = class {
  constructor(parent) {
    this.totalPointCount = 0;
    this._userData = null;
    this._yAxisIndex = 0;
    this._pen = null;
    this._legendPen = null;
    this._brush = null;
    this._navigatorpen = null;
    this._visible = true;
    this._disabled = false;
    this._color = YColor.Black;
    this._thickness = 1;
    this._legend = "";
    this._unit = "";
    this.segments = [];
    if (parent.yAxes.length <= 0)
      throw new Error("Define at least one yAxis");
    this._timeRange = MinMaxHandler.DefaultValue();
    this._valueRange = MinMaxHandler.DefaultValue();
    this.parent = parent;
  }
  get userData() {
    return this._userData;
  }
  set userData(value) {
    this._userData = value;
  }
  static get MaxPointsPerSeries() {
    return DataSerie._MaxPointsPerSeries;
  }
  static set MaxPointsPerSeries(value) {
    DataSerie._MaxPointsPerSeries = value;
  }
  get timeRange() {
    return this._timeRange;
  }
  get valueRange() {
    return this._valueRange;
  }
  get yAxisIndex() {
    return this._yAxisIndex;
  }
  set yAxisIndex(value) {
    if (value >= this.parent.yAxes.length)
      throw new RangeError("No such yAxis (" + value.toString() + ")");
    this._yAxisIndex = value;
    this.parent.yAxes[this._yAxisIndex].AutoShow();
  }
  get pen() {
    if (this._pen == null) {
      this._pen = new YPen(this._color, this._thickness);
      this._pen.endCap = 2;
      this._pen.linejoin = YPen.LineJoin.Round;
    }
    return this._pen;
  }
  get legendPen() {
    if (this._legendPen == null) {
      this._legendPen = new YPen(this._color, this._thickness * this.parent.legendPanel.traceWidthFactor);
    }
    return this._legendPen;
  }
  resetlegendPen() {
    this._legendPen = null;
  }
  get brush() {
    if (this._brush == null)
      this._brush = new YSolidBrush(this._color);
    return this._brush;
  }
  get navigatorpen() {
    if (this._navigatorpen == null) {
      this._navigatorpen = new YPen(YColor.FromArgb(100, this._color.red, this._color.green, this._color.blue), 1);
    }
    return this._navigatorpen;
  }
  get visible() {
    return this._visible;
  }
  set visible(value) {
    this._visible = value;
    this.parent.redraw();
  }
  get disabled() {
    return this._disabled;
  }
  set disabled(value) {
    this._disabled = value;
    this.parent.redraw();
  }
  get color() {
    return this._color;
  }
  set color(value) {
    this._color = value;
    this._pen = null;
    this._legendPen = null;
    this._brush = null;
    this._navigatorpen = null;
    this.parent.redraw();
  }
  get thickness() {
    return this._thickness;
  }
  set thickness(value) {
    if (value < 0)
      throw new RangeError("Thickness must be a positive value");
    this._thickness = value;
    this._pen = null;
    this._legendPen = null;
    this.parent.redraw();
  }
  get legend() {
    return this._legend;
  }
  set legend(value) {
    this._legend = value;
    this.parent.redraw();
  }
  get unit() {
    return this._unit;
  }
  set unit(value) {
    this._unit = value;
    this.parent.redraw();
  }
  AddNewSegment(p) {
    this.segments.splice(0, 0, new DataSegment(p));
  }
  getlastPoint() {
    if (this.segments.length <= 0) {
      return new pointXY(NaN, NaN);
    }
    return this.segments[this.segments.length - 1].data[this.segments[this.segments.length - 1].count - 1];
  }
  AddPoint(p) {
    this._timeRange = MinMaxHandler.CombineWithNumber(this._timeRange, p.x);
    this._valueRange = MinMaxHandler.CombineWithNumber(this._valueRange, p.y);
    if (this.segments.length <= 0) {
      this.AddNewSegment(p);
      this.totalPointCount++;
      return;
    } else if (this.segments[0].count > 1) {
      let delta1 = this.segments[0].data[this.segments[0].count - 1].x - this.segments[0].data[this.segments[0].count - 2].x;
      let delta2 = p.x - this.segments[0].data[this.segments[0].count - 1].x;
      if (delta2 > 0.1 && (delta2 < 0 || delta2 > 2 * delta1)) {
        this.AddNewSegment(p);
        return;
      } else if (this.segments[0].count >= this.segments[0].data.length)
        this.segments[0].grow();
    }
    this.segments[0].data[this.segments[0].count] = p;
    this.segments[0].count++;
    this.totalPointCount++;
    if (DataSerie._MaxPointsPerSeries > 0 && this.totalPointCount > DataSerie._MaxPointsPerSeries)
      this.dataCleanUp();
    this.parent.adjustGlobalTimeRange(p.x);
    this.parent.redraw();
  }
  dataCleanUp() {
    if (this.segments.length <= 0)
      return;
    let newLimit = DataSerie._MaxPointsPerSeries * 90 / 100;
    while (this.segments[this.segments.length - 1].count <= this.totalPointCount - newLimit) {
      this.totalPointCount -= this.segments[this.segments.length - 1].count;
      this.segments.splice(this.segments.length - 1, 1);
    }
    if (this.totalPointCount > newLimit) {
      let delta = this.totalPointCount - newLimit;
      let newsize = this.segments[this.segments.length - 1].count - delta;
      let newdata = new Array(newsize);
      DataSegment.ArrayCopy(this.segments[this.segments.length - 1].data, delta, newdata, 0, this.segments[this.segments.length - 1].count - delta);
      this.segments[this.segments.length - 1].data = newdata;
      this.segments[this.segments.length - 1].count -= delta;
      this.totalPointCount -= delta;
    }
    let tmin = this.segments[0].data[0].x;
    let tmax = this.segments[0].data[0].x;
    let ymin = this.segments[0].data[0].y;
    let ymax = this.segments[0].data[0].y;
    for (let i = 0; i < this.segments.length; i++) {
      let count = this.segments[i].count;
      if (tmin > this.segments[i].data[0].x)
        tmin = this.segments[i].data[0].x;
      if (tmax < this.segments[i].data[count - 1].x)
        tmax = this.segments[i].data[count - 1].x;
      for (let j = 0; j < count; j++) {
        if (ymin > this.segments[i].data[j].y)
          ymin = this.segments[i].data[j].y;
        if (ymax < this.segments[i].data[j].y)
          ymax = this.segments[i].data[j].y;
      }
    }
    this._timeRange.Min = tmin;
    this._timeRange.Max = tmax;
    this._valueRange.Min = ymin;
    this._valueRange.Max = ymax;
  }
  InsertPoints(points) {
    if (points.length == 0)
      return;
    if (points.length == 1) {
      this._timeRange = MinMaxHandler.CombineWithNumber(this._timeRange, points[0].x);
      this._valueRange = MinMaxHandler.CombineWithNumber(this._valueRange, points[0].y);
      return;
    }
    let FirstStep = points[1].x - points[0].x;
    let LastStep = points[points.length - 1].x - points[points.length - 2].x;
    let InsertAtBegining = -1;
    let InsertAtEnd = -1;
    for (let i = 0; i < this.segments.length; i++) {
      if (this.segments[i].count > 1) {
        let DeltaInsertAtBegining = this.segments[i].data[0].x - points[points.length - 1].x;
        let DeltaInsertAtEnd = points[0].x - this.segments[i].data[this.segments[i].count - 1].x;
        if (DeltaInsertAtBegining > 0 && DeltaInsertAtBegining < 2 * FirstStep)
          InsertAtBegining = i;
        if (DeltaInsertAtEnd > 0 && DeltaInsertAtEnd < 2 * LastStep)
          InsertAtEnd = i;
      }
    }
    if (InsertAtBegining >= 0) {
      if (this.segments[InsertAtBegining].count + points.length >= this.segments[InsertAtBegining].data.length)
        this.segments[InsertAtBegining].grow();
      DataSegment.ArrayCopy(this.segments[InsertAtBegining].data, 0, this.segments[InsertAtBegining].data, points.length, this.segments[InsertAtBegining].count);
      DataSegment.ArrayCopy(points, 0, this.segments[InsertAtBegining].data, 0, points.length);
      this.segments[InsertAtBegining].count += points.length;
      this.totalPointCount += points.length;
    } else if (InsertAtEnd >= 0) {
      if (this.segments[InsertAtEnd].count + points.length >= this.segments[InsertAtEnd].data.length)
        this.segments[InsertAtEnd].grow();
      DataSegment.ArrayCopy(points, 0, this.segments[InsertAtEnd].data, this.segments[InsertAtEnd].count, points.length);
      this.segments[InsertAtEnd].count += points.length;
      this.totalPointCount += points.length;
    } else {
      this.segments.push(new DataSegment(points));
      this.totalPointCount += points.length;
    }
    this._timeRange = MinMaxHandler.CombineWithNumber(this._timeRange, points[0].x);
    this._timeRange = MinMaxHandler.CombineWithNumber(this._timeRange, points[points.length - 1].x);
    for (let i = 0; i < points.length; i++) {
      this._valueRange = MinMaxHandler.CombineWithNumber(this._valueRange, points[i].y);
    }
    if (DataSerie._MaxPointsPerSeries > 0 && this.totalPointCount > DataSerie._MaxPointsPerSeries)
      this.dataCleanUp();
    this.parent.redraw();
  }
  static CompareSegments(a, b) {
    if (a.data[0].x > b.data[0].x)
      return -1;
    if (a.data[0].x < b.data[0].x)
      return 1;
    return 0;
  }
  getData() {
    let res = [];
    this.segments.sort(DataSerie.CompareSegments);
    for (let i = this.segments.length - 1; i >= 0; i--) {
      for (let j = 0; j < this.segments[i].count; j++) {
        res.push(this.segments[i].data[j]);
      }
    }
    return res;
  }
  findClosestValue(x, AllowInterpolation) {
    let N1 = 0;
    let N2 = 0;
    let Pos = 0;
    if (this.segments.length <= 0)
      return null;
    for (let i = 0; i < this.segments.length; i++) {
      if (x >= this.segments[i].data[0].x && x <= this.segments[i].data[this.segments[i].count - 1].x) {
        let data = this.segments[i].data;
        N1 = 0;
        N2 = this.segments[i].count - 1;
        while (N2 - N1 > 1) {
          let N = N1 + N2 >> 1;
          if (data[N].x > x)
            N2 = N;
          else
            N1 = N;
        }
        Pos = N1 - 1;
        if (Pos < 0)
          Pos = 0;
        if (!AllowInterpolation) {
          if (x - data[Pos].x < data[Pos + 1].x - x)
            return data[Pos];
          else
            return data[Pos + 1];
        } else {
          Pos++;
          if (x == data[Pos].x)
            return data[Pos];
          if (x == data[Pos + 1].x)
            return data[Pos + 1];
          let p = new pointXY();
          p.x = x;
          p.y = data[Pos].y + (data[Pos + 1].y - data[Pos].y) * (x - data[Pos].x) / (data[Pos + 1].x - data[Pos].x);
          return p;
        }
      }
    }
    if (AllowInterpolation)
      return null;
    try {
      this.segments[0].data[0].clone();
    } catch (e) {
      debugger;
    }
    let match = this.segments[0].data[0];
    let delta = Math.abs(this.segments[0].data[0].x - x);
    for (let i = 0; i < this.segments.length; i++) {
      let d1 = Math.abs(this.segments[i].data[0].x - x);
      let d2 = Math.abs(this.segments[i].data[this.segments[i].count - 1].x - x);
      if (d1 < delta) {
        match = this.segments[i].data[0];
        delta = d1;
      }
      if (d2 < delta) {
        match = this.segments[i].data[this.segments[i].count - 1];
        delta = d2;
      }
    }
    return match.clone();
  }
  clear() {
    this.segments = [];
    this._timeRange = MinMaxHandler.DefaultValue();
    this._valueRange = MinMaxHandler.DefaultValue();
    this.parent.clearCachedObjects();
    this.totalPointCount = 0;
  }
};
DataSerie._MaxPointsPerSeries = 0;
var DataTracker = class {
  constructor(parent, directParent) {
    this._userData = null;
    this._enabled = false;
    this._showSerieName = false;
    this._showTimeStamp = false;
    this._dataPrecisionString = "";
    this._dataPrecision = DataTracker.DataPrecision.PRECISION_NOLIMIT;
    this._diameter = 5;
    this._handleLength = 25;
    this._detectionDistance = 50;
    this._bgColor = YColor.FromArgb(200, 255, 255, 255);
    this._borderColor = YColor.Black;
    this._borderthickness = 1;
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
  get directParent() {
    return this._directParent;
  }
  get userData() {
    return this._userData;
  }
  set userData(value) {
    this._userData = value;
  }
  get enabled() {
    return this._enabled;
  }
  set enabled(value) {
    this._enabled = value;
    this._parentRenderer.redraw();
  }
  get showSerieName() {
    return this._showSerieName;
  }
  set showSerieName(value) {
    this._showSerieName = value;
    this._parentRenderer.redraw();
  }
  get showTimeStamp() {
    return this._showTimeStamp;
  }
  set showTimeStamp(value) {
    this._showTimeStamp = value;
    this._parentRenderer.redraw();
  }
  get dataPrecisionString() {
    return this._dataPrecisionString;
  }
  get dataPrecision() {
    return this._dataPrecision;
  }
  set dataPrecision(value) {
    this._dataPrecision = value;
    this.compute_dataPrecisionString();
    this._parentRenderer.redraw();
  }
  compute_dataPrecisionString() {
    if (this._dataPrecision == DataTracker.DataPrecision.PRECISION_NOLIMIT) {
      this._dataPrecisionString = "";
      return;
    }
    this._dataPrecisionString = "0.";
  }
  get diameter() {
    return this._diameter;
  }
  set diameter(value) {
    if (value < 0)
      throw new RangeError("Diameter must be a positive value");
    this._diameter = value;
    this._parentRenderer.redraw();
  }
  get handleLength() {
    return this._handleLength;
  }
  set handleLength(value) {
    if (value < 0)
      throw new RangeError("Hanle length must be a positive value");
    this._handleLength = value;
    this._parentRenderer.redraw();
  }
  get detectionDistance() {
    return this._detectionDistance;
  }
  set detectionDistance(value) {
    if (value <= 0)
      throw new RangeError("Distance must be a positive value");
    this._detectionDistance = value;
  }
  get bgColor() {
    return this._bgColor;
  }
  set bgColor(value) {
    this._bgColor = value;
    this._bgBrush = null;
    this._parentRenderer.redraw();
  }
  get borderColor() {
    return this._borderColor;
  }
  set borderColor(value) {
    this._borderColor = value;
    this._pen = null;
    this._parentRenderer.redraw();
  }
  get borderthickness() {
    return this._borderthickness;
  }
  set borderthickness(value) {
    if (value < 0)
      throw new RangeError("Thickness must be a positive value");
    this._borderthickness = value;
    this._pen = null;
    this._parentRenderer.redraw();
  }
  get padding() {
    return this._padding;
  }
  set padding(value) {
    if (value < 0)
      throw new RangeError("Padding must be a positive value");
    this._padding = value;
    this._parentRenderer.redraw();
  }
  get verticalMargin() {
    return this._verticalMargin;
  }
  set verticalMargin(value) {
    if (value < 0)
      throw new RangeError("Margin must be a positive value");
    this._verticalMargin = value;
    this._parentRenderer.redraw();
  }
  get horizontalMargin() {
    return this._horizontalMargin;
  }
  set horizontalMargin(value) {
    if (value < 0)
      throw new RangeError("Margin must be a positive value");
    this._horizontalMargin = value;
    this._parentRenderer.redraw();
  }
  get bgBrush() {
    if (this._bgBrush == null) {
      this._bgBrush = new YSolidBrush(this._bgColor);
    }
    return this._bgBrush;
  }
  get pen() {
    if (this._pen == null)
      this._pen = new YPen(this._borderColor, this._borderthickness, true);
    return this._pen;
  }
  get font() {
    return this._font;
  }
};
(function(DataTracker2) {
  class DataPrecisionEnumItem extends YEnumItem {
    constructor(value, humanreadable, container) {
      super(value, humanreadable, DataPrecision);
    }
  }
  DataTracker2.DataPrecisionEnumItem = DataPrecisionEnumItem;
  class DataPrecision extends YEnum {
  }
  DataPrecision.PRECISION_NOLIMIT = new DataPrecisionEnumItem("PRECISION_NOLIMIT", "As is");
  DataPrecision.PRECISION_1 = new DataPrecisionEnumItem("PRECISION_1", "1");
  DataPrecision.PRECISION_01 = new DataPrecisionEnumItem("PRECISION_01", "0.1");
  DataPrecision.PRECISION_001 = new DataPrecisionEnumItem("PRECISION_001", "0.01");
  DataPrecision.PRECISION_0001 = new DataPrecisionEnumItem("PRECISION_0001", "0.001");
  DataPrecision.PRECISION_00001 = new DataPrecisionEnumItem("PRECISION_00001", "0.0001");
  DataPrecision.PRECISION_000001 = new DataPrecisionEnumItem("PRECISION_000001", "0.00001");
  DataPrecision.PRECISION_0000001 = new DataPrecisionEnumItem("PRECISION_0000001", "0.000001");
  DataPrecision.PRECISION_00000001 = new DataPrecisionEnumItem("PRECISION_00000001", "0.0000001");
  DataPrecision.PRECISION_000000001 = new DataPrecisionEnumItem("PRECISION_000000001", "0.00000001");
  DataPrecision.PRECISION_0000000001 = new DataPrecisionEnumItem("PRECISION_0000000001", "0.000000001");
  DataTracker2.DataPrecision = DataPrecision;
})(DataTracker || (DataTracker = {}));
var LegendPanel = class {
  constructor(parent, directParent) {
    this._userData = null;
    this._traceWidth = 1;
    this._enabled = false;
    this._position = LegendPanel.Position.BOTTOM;
    this._overlap = false;
    this._bgColor = YColor.FromArgb(200, 255, 255, 255);
    this._borderColor = YColor.Black;
    this._borderthickness = 1;
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
  get directParent() {
    return this._directParent;
  }
  get userData() {
    return this._userData;
  }
  set userData(value) {
    this._userData = value;
  }
  get traceWidthFactor() {
    return this._traceWidth;
  }
  set traceWidthFactor(value) {
    if (value <= 0)
      throw new RangeError("This has to be a strictly positive value");
    this._traceWidth = value;
    this._parentRenderer.resetlegendPens();
    this._parentRenderer.redraw();
  }
  get enabled() {
    return this._enabled;
  }
  set enabled(value) {
    this._enabled = value;
    this._parentRenderer.redraw();
  }
  get position() {
    return this._position;
  }
  set position(value) {
    this._position = value;
    this._parentRenderer.redraw();
  }
  get overlap() {
    return this._overlap;
  }
  set overlap(value) {
    this._overlap = value;
    this._parentRenderer.redraw();
  }
  get bgColor() {
    return this._bgColor;
  }
  set bgColor(value) {
    this._bgColor = value;
    this._bgBrush = null;
    this._parentRenderer.redraw();
  }
  get borderColor() {
    return this._borderColor;
  }
  set borderColor(value) {
    this._borderColor = value;
    this._pen = null;
    this._parentRenderer.redraw();
  }
  get borderthickness() {
    return this._borderthickness;
  }
  set borderthickness(value) {
    if (value < 0)
      throw new RangeError("Thickness must be a positive value");
    this._borderthickness = value;
    this._pen = null;
    this._parentRenderer.redraw();
  }
  get padding() {
    return this._padding;
  }
  set padding(value) {
    if (value < 0)
      throw new RangeError("Padding must be a positive value");
    this._padding = value;
    this._parentRenderer.redraw();
  }
  get verticalMargin() {
    return this._verticalMargin;
  }
  set verticalMargin(value) {
    if (value < 0)
      throw new RangeError("Margin must be a positive value");
    this._verticalMargin = value;
    this._parentRenderer.redraw();
  }
  get horizontalMargin() {
    return this._horizontalMargin;
  }
  set horizontalMargin(value) {
    if (value < 0)
      throw new RangeError("Margin must be a positive value");
    this._horizontalMargin = value;
    this._parentRenderer.redraw();
  }
  get bgBrush() {
    if (this._bgBrush == null) {
      this._bgBrush = new YSolidBrush(this._bgColor);
    }
    return this._bgBrush;
  }
  get pen() {
    if (this._pen == null)
      this._pen = new YPen(this._borderColor, this._borderthickness, true);
    return this._pen;
  }
  get font() {
    return this._font;
  }
};
(function(LegendPanel2) {
  class PositionEnumItem extends YEnumItem {
    constructor(value, humanreadable, container) {
      super(value, humanreadable, Position);
    }
  }
  LegendPanel2.PositionEnumItem = PositionEnumItem;
  class Position extends YEnum {
  }
  Position.LEFT = new PositionEnumItem("LEFT", "Left");
  Position.TOPLEFT = new PositionEnumItem("TOPLEFT", "Top-Left");
  Position.TOP = new PositionEnumItem("TOP", "Top");
  Position.TOPRIGHT = new PositionEnumItem("TOPRIGHT", "Top-Right");
  Position.RIGHT = new PositionEnumItem("RIGHT", "Right");
  Position.BOTTOMRIGHT = new PositionEnumItem("BOTTOMRIGHT", "Bottom-Right");
  Position.BOTTOM = new PositionEnumItem("BOTTOM", "Bottom");
  Position.BOTTOMLEFT = new PositionEnumItem("BOTTOMLEFT", "Bottom-Left");
  LegendPanel2.Position = Position;
})(LegendPanel || (LegendPanel = {}));
var Navigator = class {
  constructor(parent, directParent) {
    this._userData = null;
    this._viewport = new ViewPortSettings();
    this.Xrange = null;
    this._showXAxisZones = true;
    this._relativeheight = 10;
    this._enabled = false;
    this._bgColor1 = YColor.FromArgb(255, 225, 225, 225);
    this._cursorBorderColor = YColor.FromArgb(255, 40, 40, 40);
    this._yAxisHandling = Navigator.YAxisHandling.AUTO;
    this._bgColor2 = YColor.FromArgb(255, 225, 225, 225);
    this._cursorColor = YColor.FromArgb(100, 0, 255, 0);
    this._cursorBrush = null;
    this._pen = null;
    this._cursorBorderPen = null;
    this._xAxisColor = YColor.Black;
    this._xAxisThickness = 1;
    this._borderPen = null;
    this._borderColor = YColor.DimGray;
    this._borderThickness = 1;
    this._bgBrush = null;
    this._font = null;
    this._directParent = directParent;
    this._parentRenderer = parent;
    this._font = new YFont(parent, this, 8, null);
  }
  get directParent() {
    return this._directParent;
  }
  get userData() {
    return this._userData;
  }
  set userData(value) {
    this._userData = value;
  }
  get showXAxisZones() {
    return this._showXAxisZones;
  }
  set showXAxisZones(value) {
    this._showXAxisZones = value;
  }
  get relativeheight() {
    return this._relativeheight;
  }
  set relativeheight(value) {
    if (value < 10)
      value = 10;
    if (value > 50)
      value = 50;
    this._relativeheight = value;
    this._parentRenderer.redraw();
  }
  get enabled() {
    return this._enabled;
  }
  set enabled(value) {
    this._enabled = value;
    this._parentRenderer.redraw();
  }
  get bgColor1() {
    return this._bgColor1;
  }
  set bgColor1(value) {
    this._bgColor1 = value;
    this._bgBrush = null;
    this._parentRenderer.redraw();
  }
  get cursorBorderColor() {
    return this._cursorBorderColor;
  }
  set cursorBorderColor(value) {
    this._cursorBorderColor = value;
    this._cursorBorderPen = null;
    this._parentRenderer.redraw();
  }
  get yAxisHandling() {
    return this._yAxisHandling;
  }
  set yAxisHandling(value) {
    this._yAxisHandling = value;
    this._parentRenderer.redraw();
  }
  get bgColor2() {
    return this._bgColor2;
  }
  set bgColor2(value) {
    this._bgColor2 = value;
    this._bgBrush = null;
    this._parentRenderer.redraw();
  }
  get cursorColor() {
    return this._cursorColor;
  }
  set cursorColor(value) {
    this._cursorColor = value;
    this._cursorBrush = null;
    this._parentRenderer.redraw();
  }
  get cursorBrush() {
    if (this._cursorBrush == null) {
      this._cursorBrush = new YSolidBrush(this._cursorColor);
    }
    return this._cursorBrush;
  }
  get pen() {
    if (this._pen == null)
      this._pen = new YPen(this._xAxisColor, this._xAxisThickness, true);
    return this._pen;
  }
  get cursorBorderPen() {
    if (this._cursorBorderPen == null)
      this._cursorBorderPen = new YPen(this._cursorBorderColor, 1, true);
    return this._cursorBorderPen;
  }
  get xAxisColor() {
    return this._xAxisColor;
  }
  set xAxisColor(value) {
    this._xAxisColor = value;
    this._pen = null;
    this._parentRenderer.redraw();
  }
  get xAxisThickness() {
    return this._xAxisThickness;
  }
  set xAxisThickness(value) {
    if (value < 0)
      throw new RangeError("Thickness must be a positive value");
    this._xAxisThickness = value;
    this._pen = null;
    this._parentRenderer.redraw();
  }
  get borderPen() {
    if (this._borderPen == null)
      this._borderPen = new YPen(this._borderColor, this._borderThickness, true);
    return this._borderPen;
  }
  get borderColor() {
    return this._borderColor;
  }
  set borderColor(value) {
    this._borderColor = value;
    this._borderPen = null;
    this._parentRenderer.redraw();
  }
  get borderThickness() {
    return this._borderThickness;
  }
  set borderThickness(value) {
    if (value < 0)
      throw new RangeError("Thickness must be a positive value");
    this._borderThickness = value;
    this._borderPen = null;
    this._parentRenderer.redraw();
  }
  setPosition(ParentWidth, ParentHeight, Lmargin, Rmargin, Tmargin, Bmargin) {
    if (this._viewport.Lmargin != Lmargin || this._viewport.Rmargin != Rmargin || this._viewport.Tmargin != Tmargin || this._viewport.Bmargin != Bmargin) {
      this._bgBrush = null;
    }
    this._viewport.Lmargin = Lmargin;
    this._viewport.Rmargin = Rmargin;
    this._viewport.Bmargin = Bmargin;
    this._viewport.Tmargin = Tmargin;
    this._viewport.Width = ParentWidth;
    this._viewport.Height = ParentHeight;
  }
  setIRLPosition(IRLx, IRLy, xZoom, yZoom) {
    this._viewport.IRLx = IRLx;
    this._viewport.IRLy = IRLy;
    this._viewport.zoomx = xZoom;
    this._viewport.zoomy = yZoom;
  }
  startCapture(IRLStartPoint, xAxisMin, xAxisMax) {
    this._viewport.OriginalXAxisMin = xAxisMin;
    this._viewport.OriginalXAxisMax = xAxisMax;
    this._viewport.OriginalIRLx = this._viewport.IRLx;
    this._viewport.OriginalLmargin = this._viewport.Lmargin;
    this._viewport.OriginalZoomx = this._viewport.zoomx;
    this._viewport.IRLCaptureStartX = IRLStartPoint.x;
    this._viewport.Capture = true;
  }
  get Capture() {
    return this._viewport.Capture;
  }
  stopCapture() {
    this._viewport.Capture = false;
  }
  get viewport() {
    return this._viewport;
  }
  get bgBrush() {
    if (this._bgBrush == null) {
      this._bgBrush = new YLinearGradientBrush(this._bgColor1, this._bgColor2);
    }
    return this._bgBrush;
  }
  get font() {
    return this._font;
  }
};
(function(Navigator2) {
  class YAxisHandlingEnumItem extends YEnumItem {
    constructor(value, humanreadable, container) {
      super(value, humanreadable, YAxisHandling);
    }
  }
  Navigator2.YAxisHandlingEnumItem = YAxisHandlingEnumItem;
  class YAxisHandling extends YEnum {
  }
  YAxisHandling.AUTO = new YAxisHandlingEnumItem("AUTO", "Automatic");
  YAxisHandling.INHERIT = new YAxisHandlingEnumItem("INHERIT", "Inherit from main view");
  Navigator2.YAxisHandling = YAxisHandling;
})(Navigator || (Navigator = {}));
var Marker = class {
  constructor(parent, directParent) {
    this._userData = null;
    this._stringFormat = null;
    this._MarkerTextCallback = null;
    this._enabled = false;
    this._xposition = 0;
    this._xpositionIsRelative = false;
    this._yposition = 92;
    this._text = "Marker";
    this._textAlign = Marker.TextAlign.CENTER;
    this._bgColor = YColor.FromArgb(255, 255, 255, 192);
    this._borderColor = YColor.DarkRed;
    this._borderthickness = 1;
    this._arrowSize = 5;
    this._padding = 5;
    this._verticalMargin = 5;
    this._horizontalMargin = 5;
    this._bgBrush = null;
    this._arrowBrush = null;
    this._pen = null;
    this._navigatorpen = null;
    this._font = null;
    this._directParent = directParent;
    this._parentRenderer = parent;
    this._font = new YFont(parent, this, 8, null);
  }
  get userData() {
    return this._userData;
  }
  set userData(value) {
    this._userData = value;
  }
  static _round100(v) {
    return Math.round(100 * v) / 100;
  }
  get stringFormat() {
    if (this._stringFormat != null)
      return this._stringFormat;
    this._stringFormat = new YStringFormat(16384);
    this._stringFormat.LineAlignment = 1;
    switch (this._textAlign) {
      case Marker.TextAlign.LEFT:
        this._stringFormat.Alignment = 0;
        break;
      case Marker.TextAlign.CENTER:
        this._stringFormat.Alignment = 1;
        break;
      case Marker.TextAlign.RIGHT:
        this._stringFormat.Alignment = 2;
        break;
    }
    return this._stringFormat;
  }
  get PatchTextCallback() {
    return this._MarkerTextCallback;
  }
  set PatchTextCallback(callback) {
    this._MarkerTextCallback = callback;
  }
  get directParent() {
    return this._directParent;
  }
  startCapture() {
    this._parentRenderer.startMarkerCapture(this);
  }
  setCapturedPosition(position, axis) {
    this.enabled = true;
    this._xpositionIsRelative = axis.timeReference == TimeConverter.TimeReference.RELATIVE && axis.zeroTime > 0;
    this._xposition = Marker._round100(this._xpositionIsRelative ? position - axis.zeroTime : position);
    this._parentRenderer.clearCachedObjects();
    this._parentRenderer.redraw();
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
  get xposition() {
    return this._xposition;
  }
  set xposition(value) {
    this._xposition = Marker._round100(value);
    if (this._enabled)
      this._parentRenderer.redraw();
  }
  get timereference() {
    return this._xpositionIsRelative ? TimeConverter.TimeReference.RELATIVE : TimeConverter.TimeReference.ABSOLUTE;
  }
  set timereference(value) {
    let v = value == TimeConverter.TimeReference.RELATIVE;
    if (this._xpositionIsRelative != v) {
      let ZeroPosition = this._directParent.zeroTime;
      if (isNaN(ZeroPosition))
        ZeroPosition = 0;
      if (v) {
        this._xpositionIsRelative = true;
        this._xposition -= ZeroPosition;
      } else {
        this._xpositionIsRelative = false;
        this._xposition += ZeroPosition;
      }
      this._xposition = Marker._round100(this._xposition);
      this._parentRenderer.redraw();
    }
  }
  get positionOnXAxis() {
    return new xAxisPosition(this._xposition, this._xpositionIsRelative);
  }
  set positionOnXAxis(value) {
    if (value.capture) {
      this.startCapture();
    } else {
      let v = Marker._round100(value.value);
      if (this._xpositionIsRelative != value.relative || this._xposition != v) {
        this._xposition = v;
        this._xpositionIsRelative = value.relative;
        if (this._enabled)
          this._parentRenderer.redraw();
      }
    }
  }
  get yposition() {
    return this._yposition;
  }
  set yposition(value) {
    this._yposition = Math.min(100, Math.max(0, value));
    if (this._enabled)
      this._parentRenderer.redraw();
  }
  get text() {
    return this._text;
  }
  set text(value) {
    this._text = value;
    this._parentRenderer.clearCachedObjects();
    if (this._enabled)
      this._parentRenderer.redraw();
  }
  get textAlign() {
    return this._textAlign;
  }
  set textAlign(value) {
    this._textAlign = value;
    this._stringFormat = null;
    if (this._enabled)
      this._parentRenderer.redraw();
  }
  get shortText() {
    if (this._text.length <= 20)
      return this._text;
    return this._text.substring(0, 18) + "..";
  }
  get bgColor() {
    return this._bgColor;
  }
  set bgColor(value) {
    this._bgColor = value;
    this._bgBrush = null;
    if (this._enabled)
      this._parentRenderer.redraw();
  }
  get borderColor() {
    return this._borderColor;
  }
  set borderColor(value) {
    this._borderColor = value;
    this._arrowBrush = null;
    this._pen = null;
    this._navigatorpen = null;
    if (this._enabled)
      this._parentRenderer.redraw();
  }
  get borderthickness() {
    return this._borderthickness;
  }
  set borderthickness(value) {
    if (value < 0)
      throw new RangeError("thickness must be a positive value");
    this._borderthickness = value;
    this._parentRenderer.clearCachedObjects();
    this._pen = null;
    if (this._enabled)
      this._parentRenderer.redraw();
  }
  get arrowSize() {
    return this._arrowSize;
  }
  set arrowSize(value) {
    this._arrowSize = value;
    if (this._enabled)
      this._parentRenderer.redraw();
  }
  get padding() {
    return this._padding;
  }
  set padding(value) {
    if (value < 0)
      throw new RangeError("Padding must be a positive value");
    this._padding = value;
    this._parentRenderer.clearCachedObjects();
    if (this._enabled)
      this._parentRenderer.redraw();
  }
  get verticalMargin() {
    return this._verticalMargin;
  }
  set verticalMargin(value) {
    this._verticalMargin = value;
    if (this._enabled)
      this._parentRenderer.redraw();
  }
  get horizontalMargin() {
    return this._horizontalMargin;
  }
  set horizontalMargin(value) {
    this._horizontalMargin = value;
    if (this._enabled)
      this._parentRenderer.redraw();
  }
  get bgBrush() {
    if (this._bgBrush == null) {
      this._bgBrush = new YSolidBrush(this._bgColor);
    }
    return this._bgBrush;
  }
  get arrowBrush() {
    if (this._arrowBrush == null) {
      this._arrowBrush = new YSolidBrush(this._borderColor, true);
    }
    return this._arrowBrush;
  }
  get pen() {
    if (this._pen == null)
      this._pen = new YPen(this._borderColor, this._borderthickness, true);
    return this._pen;
  }
  get navigatorpen() {
    if (this._navigatorpen == null)
      this._navigatorpen = new YPen(this._borderColor, 1);
    return this._navigatorpen;
  }
  get font() {
    return this._font;
  }
};
(function(Marker2) {
  class TextAlignEnumItem extends YEnumItem {
    constructor(value, humanreadable, container) {
      super(value, humanreadable, TextAlign);
    }
  }
  Marker2.TextAlignEnumItem = TextAlignEnumItem;
  class TextAlign extends YEnum {
  }
  TextAlign.LEFT = new TextAlignEnumItem("LEFT", "Left");
  TextAlign.CENTER = new TextAlignEnumItem("CENTER", "Center");
  TextAlign.RIGHT = new TextAlignEnumItem("RIGHT", "Right");
  Marker2.TextAlign = TextAlign;
})(Marker || (Marker = {}));
var Legend = class {
  constructor(parent, directParent) {
    this._userData = null;
    this._title = "";
    this._font = null;
    this._directParent = directParent;
    this._parentRenderer = parent;
    this._font = new YFont(parent, this, 12, null);
  }
  get directParent() {
    return this._directParent;
  }
  get userData() {
    return this._userData;
  }
  set userData(value) {
    this._userData = value;
  }
  get title() {
    return this._title;
  }
  set title(value) {
    this._title = value;
    this._parentRenderer.redraw();
  }
  get font() {
    return this._font;
  }
};
var GenericAxis = class {
  constructor(parent, directParent) {
    this._userData = null;
    this._AxisChanged = null;
    this._pen = null;
    this._gridPen = null;
    this._visible = true;
    this._AllowAutoShow = false;
    this._min = Number.NaN;
    this._max = Number.NaN;
    this._step = Number.NaN;
    this._thickness = 1;
    this._color = YColor.Black;
    this._showGrid = false;
    this._gridColor = YColor.FromArgb(50, 0, 0, 0);
    this._gridThickness = 1;
    this._font = null;
    this._zones = [];
    this._directParent = directParent;
    this._parentRenderer = parent;
    this._legend = new Legend(parent, this);
    this._font = new YFont(parent, this);
  }
  get directParent() {
    return this._directParent;
  }
  get zones() {
    return this._zones;
  }
  AddZone() {
    let z = new Zone(this._parentRenderer, this);
    this._zones.push(z);
    return z;
  }
  get userData() {
    return this._userData;
  }
  set userData(value) {
    this._userData = value;
  }
  get AxisChanged() {
    return this._AxisChanged;
  }
  set AxisChanged(value) {
    this._AxisChanged = value;
  }
  get pen() {
    if (this._pen == null)
      this._pen = new YPen(this._color, this._thickness, true);
    return this._pen;
  }
  get gridPen() {
    if (this._gridPen == null)
      this._gridPen = new YPen(this._gridColor, this._gridThickness, true);
    return this._gridPen;
  }
  get visible() {
    return this._visible;
  }
  set visible(value) {
    this._visible = value;
    if (!value) {
      this._AllowAutoShow = false;
    }
    this._parentRenderer.redraw();
  }
  get AllowAutoShow() {
    return this._AllowAutoShow;
  }
  set AllowAutoShow(value) {
    this._AllowAutoShow = value;
  }
  AutoShow() {
    if (this._AllowAutoShow) {
      this.visible = true;
      if (this._AxisChanged != null)
        this._AxisChanged(this);
    }
  }
  set_minMax(value_min, value_max) {
    if (!isNaN(value_min) && !isNaN(value_max) && value_min >= value_max) {
      throw new RangeError("Min (" + value_min.toString() + ") cannot be greater than max (" + value_max.toString() + ")");
    }
    this._min = value_min;
    this._max = value_max;
    this._parentRenderer.redraw();
  }
  get min() {
    return this._min;
  }
  set min(value) {
    if (!isNaN(value) && !isNaN(this._max) && !YDataRenderer.minMaxCheckDisabled) {
      if (value >= this._max) {
        throw new RangeError("Min cannot be greater than max (" + this._max.toString() + ")");
      }
    }
    this._min = value;
    this._parentRenderer.redraw();
  }
  setMinMax(min, max) {
    if (min < max) {
      this._min = min;
      this._max = max;
      this._parentRenderer.redraw();
    }
  }
  get max() {
    return this._max;
  }
  set max(value) {
    if (!isNaN(value) && !isNaN(this._min) && !YDataRenderer.minMaxCheckDisabled) {
      if (value <= this._min)
        throw new RangeError("Max cannot be less than min (" + this._min.toString() + ")");
    }
    this._max = value;
    this._parentRenderer.redraw();
  }
  get step() {
    return this._step;
  }
  set step(value) {
    if (!isNaN(value) && value < 0)
      throw new RangeError("Steps must be a strictely positive value");
    this._step = value;
    this._parentRenderer.redraw();
  }
  get thickness() {
    return this._thickness;
  }
  set thickness(value) {
    if (value < 0)
      throw new RangeError("Thickness must be a positive value");
    this._thickness = value;
    this._pen = null;
    this._parentRenderer.redraw();
  }
  get color() {
    return this._color;
  }
  set color(value) {
    this._color = value;
    this._pen = null;
    this._parentRenderer.redraw();
  }
  get showGrid() {
    return this._showGrid;
  }
  set showGrid(value) {
    this._showGrid = value;
    this._parentRenderer.redraw();
  }
  get gridColor() {
    return this._gridColor;
  }
  set gridColor(value) {
    this._gridColor = value;
    this._gridPen = null;
    this._parentRenderer.redraw();
  }
  get gridThickness() {
    return this._gridThickness;
  }
  set gridThickness(value) {
    if (value < 0)
      throw new RangeError("Thickness must be a positive value");
    this._gridThickness = value;
    this._gridPen = null;
    this._parentRenderer.redraw();
  }
  get font() {
    return this._font;
  }
  get legend() {
    return this._legend;
  }
};
var StartStopStep = class {
  constructor() {
    this.dataMin = 0;
    this.dataMax = 0;
    this.absMin = 0;
    this.absMax = 0;
    this.step = 0;
    this.start = 0;
    this.stop = 0;
    this.precision = 0;
  }
};
var xAxisPosition = class {
  constructor(v, rel, capture) {
    this._isRelative = false;
    this._value = 0;
    this._capture = false;
    this._isRelative = rel;
    this._value = v;
    this._capture = typeof capture == "undefined" ? false : capture;
  }
  get relative() {
    return this._isRelative;
  }
  set relative(value) {
    this._isRelative = value;
  }
  get value() {
    return this._value;
  }
  set value(value) {
    this._value = value;
  }
  clone() {
    return new xAxisPosition(this._value, this._isRelative, this._capture);
  }
  toString() {
    if (this._isRelative) {
      return TimeConverter.secTimeSpanToString(this._value, 0);
    } else {
      let date = TimeConverter.FromUnixTime(this._value);
      let res = date.getFullYear().toString() + "-" + (date.getMonth() + 1).toString() + "-" + date.getDate().toString() + " " + date.getHours().toString() + ":";
      let st = date.getMinutes().toString();
      if (st.length <= 1)
        st = "0" + st;
      res = res + st + ":";
      let s = date.getSeconds();
      let ms = date.getMilliseconds();
      s = s + ms / 1e3;
      if (s < 10)
        res = res + "0";
      if (ms == 0) {
        res = res + s.toString();
      } else {
        res = res + s.toFixed(3);
      }
      return res;
    }
  }
  TryParse(str) {
    if (this._isRelative)
      return TimeConverter.tryParseStringToSecTimeSpan(str);
    return TimeConverter.tryParseStringToAbsDateTime(str);
  }
  get capture() {
    return this._capture;
  }
  set capture(value) {
    this._capture = value;
  }
};
xAxisPosition.DTdisplayformat = "DD/MM/YY hh:mm:ss.ff";
xAxisPosition.TSdisplayformat = "dd.hh:mm:ss.ff";
var YNumberFormatInfo = class {
  constructor() {
    this.NumberDecimalSeparator = ".";
  }
};
var YAxis = class extends GenericAxis {
  constructor(parent, directParent, index) {
    super(parent, directParent);
    this._index = 0;
    this._highlightZero = false;
    this._position = YAxis.HrzPosition.LEFT;
    this.innerWidth = 0;
    this.zoom = 0;
    this.IRLy = 0;
    this._index = index;
    this.nfi = new YNumberFormatInfo();
    this.nfi.NumberDecimalSeparator = ".";
    this.startStopStep = new StartStopStep();
    this.startStopStep.start = 0;
    this.startStopStep.stop = 1;
    this.startStopStep.step = 0.1;
  }
  get index() {
    return this._index;
  }
  lockMinMax() {
    this._min = this.startStopStep.absMin;
    this._max = this.startStopStep.absMax;
    this._parentRenderer.redraw();
  }
  unlockMinMax() {
    this._min = Number.NaN;
    this._max = Number.NaN;
    this._parentRenderer.redraw();
  }
  get highlightZero() {
    return this._highlightZero;
  }
  set highlightZero(value) {
    this._highlightZero = value;
    this._parentRenderer.redraw();
  }
  get position() {
    return this._position;
  }
  set position(value) {
    this._position = value;
    this._parentRenderer.redraw();
  }
  computeStartAndStep(M) {
    let res = new StartStopStep();
    let min = this.min;
    let max = this.max;
    res.step = this.step;
    res.precision = 0;
    if (!MinMaxHandler.isDefined(M)) {
      M = MinMaxHandler.DefaultValue();
      M.Min = 0;
      M.Max = 100;
    }
    if (isNaN(min))
      min = M.Min;
    if (isNaN(max))
      max = M.Max;
    res.absMax = max;
    res.absMin = min;
    if (min == max) {
      min -= 0.5;
      max += 0.5;
    }
    if (min != 0)
      min -= (max - min) * 0.025;
    if (max != 0)
      max += (max - min) * 0.025;
    res.start = min;
    res.stop = max;
    res.dataMin = min;
    res.dataMax = max;
    let Delta = max - min;
    if (isNaN(res.step)) {
      let MagnitudePwr = Math.log10(Delta);
      if (MagnitudePwr - Math.floor(MagnitudePwr) != 0)
        MagnitudePwr = Math.floor(MagnitudePwr) + 1;
      res.precision = MagnitudePwr - 1 >> 0;
      let Magnitude = Math.pow(10, res.precision);
      let C = Delta / Magnitude;
      if (C <= 2) {
        res.step = Magnitude / 5;
        res.precision--;
      } else if (C <= 5) {
        res.step = Magnitude / 2;
        res.precision--;
      } else {
        res.step = Magnitude;
      }
      if (isNaN(this.min)) {
        let c = min / res.step;
        if (c - Math.floor(c) != 0)
          c = c > 0 ? Math.floor(c) + 1 : Math.floor(c) - 1;
        res.start = res.step * c;
      }
    } else {
      let v = res.step.toString();
      let p = v.indexOf(".");
      if (p >= 0) {
        res.precision = -(v.length - p - 1);
      } else {
        res.precision = 0;
      }
    }
    this.startStopStep = res;
    return res;
  }
};
(function(YAxis2) {
  class HrzPositionEnumItem extends YEnumItem {
    constructor(value, humanreadable, container) {
      super(value, humanreadable, HrzPosition);
    }
  }
  YAxis2.HrzPositionEnumItem = HrzPositionEnumItem;
  class HrzPosition extends YEnum {
  }
  HrzPosition.LEFT = new HrzPositionEnumItem("LEFT", "Left");
  HrzPosition.RIGHT = new HrzPositionEnumItem("RIGHT", "Right");
  YAxis2.HrzPosition = HrzPosition;
})(YAxis || (YAxis = {}));
var XAxis = class extends GenericAxis {
  constructor(parent, directParent) {
    super(parent, directParent);
    this._position = XAxis.VrtPosition.BOTTOM;
    this._markers = [];
    this._initialZoom = 300;
    this._initialOffset = 0;
    this._format = XAxis.FORMATAUTO;
    this._timeReference = TimeConverter.TimeReference.ABSOLUTE;
    this._zeroTime = 0;
    this._fullSize = 0;
    this.innerHeight = 0;
    this._overflowHandling = XAxis.OverflowHandling.DONOTHING;
    this._parentGraph = parent;
    this._markers = [];
    this.min = TimeConverter.ToUnixTime(TimeConverter.UTCNow());
    this.max = this.min + this.initialZoom;
    this.step = 30;
  }
  get position() {
    return this._position;
  }
  set position(value) {
    this._position = value;
    this._parentRenderer.redraw();
  }
  get markers() {
    return this._markers;
  }
  AddMarker() {
    let m = new Marker(this._parentGraph, this);
    this._markers.push(m);
    this._parentGraph.clearCachedObjects();
    this._parentGraph.redraw();
    return m;
  }
  get initialZoom() {
    return this._initialZoom;
  }
  set initialZoom(value) {
    if (value <= 0)
      throw new RangeError("Zoom must be a positive value");
    this._initialZoom = value;
    this.min = this.min - this._initialZoom * this._initialOffset / 100;
    this.max = this.min + this.initialZoom;
    this._parentRenderer.redraw();
  }
  get initialOffset() {
    return this._initialOffset;
  }
  set initialOffset(value) {
    this._initialOffset = value;
    let p = this._parentGraph.getMostRecentPoint();
    if (isNaN(p.x)) {
      this._min = this._min - this._initialZoom * this._initialOffset / 100;
      this._max = this._min + this._initialZoom;
      this._parentRenderer.redraw();
    } else {
      let zoom = this._max - this._min;
      this._min = p.x - zoom * this._initialOffset / 100;
      this._max = this._min + zoom;
    }
    this._parentRenderer.redraw();
  }
  get labelFormat() {
    return this._format;
  }
  set labelFormat(value) {
    this._format = value;
    this._parentRenderer.redraw();
  }
  get timeReference() {
    return this._timeReference;
  }
  set timeReference(value) {
    this._timeReference = value;
    this._parentRenderer.redraw();
  }
  get zeroTime() {
    return this._zeroTime;
  }
  set zeroTime(value) {
    this._zeroTime = value;
  }
  get fullSize() {
    return this._fullSize;
  }
  set fullSize(value) {
    this._fullSize = value;
  }
  bestFormat(dataTimedelta, viewportTimedelta) {
    return TimeConverter.BestTimeformat(dataTimedelta, viewportTimedelta, this._timeReference);
  }
  get overflowHandling() {
    return this._overflowHandling;
  }
  set overflowHandling(value) {
    this._overflowHandling = value;
  }
};
XAxis.FORMATAUTO = 0;
(function(XAxis2) {
  class VrtPositionEnumItem extends YEnumItem {
    constructor(value, humanreadable, container) {
      super(value, humanreadable, VrtPosition);
    }
  }
  XAxis2.VrtPositionEnumItem = VrtPositionEnumItem;
  class VrtPosition extends YEnum {
  }
  VrtPosition.TOP = new VrtPositionEnumItem("TOP", "Top");
  VrtPosition.BOTTOM = new VrtPositionEnumItem("BOTTOM", "Bottom");
  XAxis2.VrtPosition = VrtPosition;
  class OverflowHandlingEnumItem extends YEnumItem {
    constructor(value, humanreadable, container) {
      super(value, humanreadable, OverflowHandling);
    }
  }
  XAxis2.OverflowHandlingEnumItem = OverflowHandlingEnumItem;
  class OverflowHandling extends YEnum {
  }
  OverflowHandling.DONOTHING = new OverflowHandlingEnumItem("DONOTHING", "Do nothing");
  OverflowHandling.SCROLL = new OverflowHandlingEnumItem("SCROLL", "Scroll contents");
  OverflowHandling.CONTRACT = new OverflowHandlingEnumItem("CONTRACT", "Squeeze contents");
  XAxis2.OverflowHandling = OverflowHandling;
})(XAxis || (XAxis = {}));
var DataPanel = class extends GenericPanel {
  constructor(parent, directParent) {
    super(parent, directParent);
    this._panelHrzAlign = DataPanel.HorizontalAlign.CENTERED;
    this._panelVrtAlign = DataPanel.VerticalAlign.CENTERED;
    this._horizontalPosition = DataPanel.HorizontalPosition.ABSOLUTEX;
    this._verticalPosition = DataPanel.VerticalPosition.ABSOLUTEY;
    this._AbsoluteXposition = 0;
    this._AbsoluteYposition = 0;
    this._YScaleIndex = 0;
  }
  get panelHrzAlign() {
    return this._panelHrzAlign;
  }
  set panelHrzAlign(value) {
    this._panelHrzAlign = value;
    if (this._enabled)
      this._parentRenderer.redraw();
  }
  get panelVrtAlign() {
    return this._panelVrtAlign;
  }
  set panelVrtAlign(value) {
    this._panelVrtAlign = value;
    if (this._enabled)
      this._parentRenderer.redraw();
  }
  get horizontalPosition() {
    return this._horizontalPosition;
  }
  set horizontalPosition(value) {
    this._horizontalPosition = value;
    if (this._enabled)
      this._parentRenderer.redraw();
  }
  get verticalPosition() {
    return this._verticalPosition;
  }
  set verticalPosition(value) {
    this._verticalPosition = value;
    if (this._enabled)
      this._parentRenderer.redraw();
  }
  get AbsoluteXposition() {
    return this._AbsoluteXposition;
  }
  set AbsoluteXposition(value) {
    this._AbsoluteXposition = value;
    if (this._enabled)
      this._parentRenderer.redraw();
  }
  get AbsoluteYposition() {
    return this._AbsoluteYposition;
  }
  set AbsoluteYposition(value) {
    this._AbsoluteYposition = value;
    if (this._enabled)
      this._parentRenderer.redraw();
  }
  get yScaleIndex() {
    return this._YScaleIndex;
  }
  set yScaleIndex(value) {
    this._YScaleIndex = value;
    if (this._enabled)
      this._parentRenderer.redraw();
  }
};
(function(DataPanel2) {
  class HorizontalAlignEnumItem extends YEnumItem {
    constructor(value, humanreadable, container) {
      super(value, humanreadable, HorizontalAlign);
    }
  }
  DataPanel2.HorizontalAlignEnumItem = HorizontalAlignEnumItem;
  class HorizontalAlign extends YEnum {
  }
  HorizontalAlign.LEFTOF = new HorizontalAlignEnumItem("LEFTOF", "Left");
  HorizontalAlign.CENTERED = new HorizontalAlignEnumItem("CENTERED", "Center");
  HorizontalAlign.RIGHTOF = new HorizontalAlignEnumItem("RIGHTOF", "Right");
  DataPanel2.HorizontalAlign = HorizontalAlign;
  class VerticalAlignEnumItem extends YEnumItem {
    constructor(value, humanreadable, container) {
      super(value, humanreadable, VerticalAlign);
    }
  }
  DataPanel2.VerticalAlignEnumItem = VerticalAlignEnumItem;
  class VerticalAlign extends YEnum {
  }
  VerticalAlign.ABOVE = new VerticalAlignEnumItem("ABOVE", "Top");
  VerticalAlign.CENTERED = new VerticalAlignEnumItem("CENTERED", "Center");
  VerticalAlign.BELOW = new VerticalAlignEnumItem("BELOW", "Bottom");
  DataPanel2.VerticalAlign = VerticalAlign;
  class HorizontalPositionEnumItem extends YEnumItem {
    constructor(value, humanreadable, container) {
      super(value, humanreadable, HorizontalPosition);
    }
  }
  DataPanel2.HorizontalPositionEnumItem = HorizontalPositionEnumItem;
  class HorizontalPosition extends YEnum {
  }
  HorizontalPosition.LEFTBORDER = new HorizontalPositionEnumItem("LEFTBORDER", "Left border");
  HorizontalPosition.ABSOLUTEX = new HorizontalPositionEnumItem("ABSOLUTEX", "Absolute X position");
  HorizontalPosition.RIGHTBORDER = new HorizontalPositionEnumItem("RIGHTBORDER", "Right borde");
  DataPanel2.HorizontalPosition = HorizontalPosition;
  class VerticalPositionEnumItem extends YEnumItem {
    constructor(value, humanreadable, container) {
      super(value, humanreadable, VerticalPosition);
    }
  }
  DataPanel2.VerticalPositionEnumItem = VerticalPositionEnumItem;
  class VerticalPosition extends YEnum {
  }
  VerticalPosition.TOPBORDER = new VerticalPositionEnumItem("TOPBORDER", "Top border");
  VerticalPosition.ABSOLUTEY = new VerticalPositionEnumItem("ABSOLUTEY", "Absolute Y position");
  VerticalPosition.BOTTOMBORDER = new VerticalPositionEnumItem("BOTTOMBORDER", "Bottom border");
  DataPanel2.VerticalPosition = VerticalPosition;
})(DataPanel || (DataPanel = {}));
var YCursor = class {
  constructor(pngImageData) {
  }
  get handle() {
    return "crosshair";
  }
};
var YTimeSpan = class {
  constructor(value) {
    this._value = 0;
    this._value = value;
  }
  toString(format) {
    let res = "";
    let v = Math.abs(this._value / 1e3);
    let dec = Math.floor(v);
    let frac = Math.round(1e3 * (v - Math.floor(v)));
    if (format & YDate.ms1) {
      let ms = "00" + frac.toString();
      res = "." + ms.substring(ms.length - 3).substring(0, 1);
    } else if (format & YDate.ms01) {
      let ms = "00" + frac.toString();
      res = "." + ms.substring(ms.length - 3).substring(0, 2);
    } else if (format & YDate.ms001) {
      let ms = "00" + frac.toString();
      res = "." + ms.substring(ms.length - 3).substring(0, 3);
    }
    if (format & YDate.s) {
      let sec = dec % 60;
      let s = "0" + sec.toString();
      res = s.substring(s.length - 2) + res + "s";
    }
    dec = Math.floor(dec / 60);
    if (format & YDate.m) {
      let min = dec % 60;
      let s = "0" + min.toString();
      res = s.substring(s.length - 2) + "m" + res;
    }
    dec = Math.floor(dec / 60);
    if (format & YDate.h) {
      let hrs = dec % 24;
      let s = "0" + hrs.toString();
      res = s.substring(s.length - 2) + "h" + res;
    }
    dec = Math.floor(dec / 24);
    if (format & YDate.D) {
      let s = dec.toString();
      res = s.substring(s.length - 2) + "d" + res;
    }
    return res;
  }
};
YTimeSpan.TicksPerSecond = 1e3;
var YGraph = class extends YDataRenderer {
  constructor(ChartContainer, logFunction) {
    super(ChartContainer, logFunction);
    this._markerCaptureStartedCallback = null;
    this._markerCaptureStoppedCallback = null;
    this.lastPointCount = -1;
    this.lastTopMargin = -1;
    this.lastBottomMargin = -1;
    this.navigatorCache = null;
    this.markerCapture = null;
    this._borderPen = null;
    this._borderColor = YColor.LightGray;
    this._borderThickness = 1;
    this._touchStartfct = null;
    this._touchMovefct = null;
    this._touchEndfct = null;
    this._mouseDownfct = null;
    this._mouseMovefct = null;
    this._mouseWheelfct = null;
    this._mouseKeyDownfct = null;
    this.mainViewPort = new ViewPortSettings();
    this._timeRange = null;
    this._bgBrush = null;
    this._bgColor1 = YColor.FromArgb(255, 200, 200, 200);
    this._bgColor2 = YColor.FromArgb(255, 255, 255, 255);
    this._touchStartPinchDistance = -1;
    this._touchStartPinchCenter = new Point(0, 0);
    this._touchStartPinchZoom = 1;
    this._touchStartPinchIRLx = 0;
    this._touchStartPinchRange = 0;
    this.dataTrackerRefreshtimeout = null;
    YGraph.createCaptureCursor();
    this._xAxis = new XAxis(this, this);
    this._yAxes = [];
    this._series = [];
    this._dataPanels = [];
    this._navigator = new Navigator(this, this);
    this._legendPanel = new LegendPanel(this, this);
    this._dataTracker = new DataTracker(this, this);
    this._touchStartfct = (e) => {
      this.TouchStart(this.UIContainer, e);
    };
    this._touchMovefct = (e) => {
      this.TouchMove(this.UIContainer, e);
    };
    this._touchEndfct = (e) => {
      this.TouchEnd(this.UIContainer, e);
    };
    this._mouseDownfct = (e) => {
      this.MouseDown(this.UIContainer, e);
    };
    this._mouseMovefct = (e) => {
      this.MouseMove(this.UIContainer, e);
    };
    this._mouseWheelfct = (e) => {
      this.mouseWheelEvent(this.UIContainer, e);
    };
    this._mouseKeyDownfct = (e) => {
      this.KeyDown(this.UIContainer, e);
    };
    this.UIContainer.addEventListener("touchstart", this._touchStartfct);
    this.UIContainer.addEventListener("touchmove", this._touchMovefct);
    this.UIContainer.addEventListener("touchend", this._touchEndfct);
    this.UIContainer.addEventListener("mousedown", this._mouseDownfct);
    this.UIContainer.addEventListener("mousemove", this._mouseMovefct);
    this.UIContainer.addEventListener("wheel", this._mouseWheelfct);
    this.UIContainer.addEventListener("keydown", this._mouseKeyDownfct);
    this._timeRange = MinMaxHandler.DefaultValue();
    let originalContainerWidth = ChartContainer.width;
    let originalContainerHeight = ChartContainer.height;
    let originalFormWidth = ChartContainer.width;
    let originalFormHeight = ChartContainer.height;
  }
  get legendPanel() {
    return this._legendPanel;
  }
  get dataTracker() {
    return this._dataTracker;
  }
  get borderColor() {
    return this._borderColor;
  }
  set borderColor(value) {
    this._borderColor = value;
    this._borderPen = null;
    this.redraw();
  }
  get borderThickness() {
    return this._borderThickness;
  }
  set borderThickness(value) {
    if (value < 0)
      throw new RangeError("thickness must be a positive value");
    this._borderThickness = value;
    this._borderPen = null;
    this.redraw();
  }
  static get verticalDragZoomEnabled() {
    return YGraph._defaultVerticalDragZoomEnabled;
  }
  static set verticalDragZoomEnabled(value) {
    YGraph._defaultVerticalDragZoomEnabled = value;
  }
  static createCaptureCursor() {
    if (YGraph.captureCursor != null)
      return;
    let base64png = "iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAALHRFWHRDcmVhdGlvbiBUaW1lAFRodSAyMCBBdWcgMjAyMCAxMjoxNTo1MCArMDEwMP38NhoAAAAHdElNRQfkCBQOJAvCrm0ZAAAACXBIWXMAAFxGAABcRgEUlENBAAAABGdBTUEAALGPC / xhBQAAAmVJREFUeNrtVrFuFDEQHd9eBImAIBFoAgVC0NJQUFDwL / QgRXzAfUz + Iy0pQwsIJAhCQMQBUS5c2DXv7T5fzN5qs / Fxdw0jPY3ttT3jt54ZmyXIYDDoQXnodWBV / SRJXZhJbwCXov65pZ + 4zklfBsZRf2EMxOuTjc / igIu0s0UygAvnonWZ0NP4fB2QkQz6yHvP / i76V4E1jZ / bic4LIuMnND7ZwDl + u4 / me + AnkKPvu + 7rFMNZBzZ64eRTm5w6sQ8cAcUZexVytOCpOnv7j + QdDD + CHgKjMg80nWpeQrYgd4A3wHjWPJAqN4BVoLcsB1ZMd25ZDkzkvwNLd6AMQ4XGIuXElKz6SAo3rYpLhsZKyyJmwu2WTLiF5g / g2NozIY1 / BkacRwaYkZgUPlr7L2EdeAhjLxpqwTOr0vAHOZG37FPIOO3mfXXG1qEWAGvM + TC6Rydk / KmMv7bmWlD / v95qtaCThGpo1TPsFvp7wBO0v4nBqWoYvR0yOeLFThHmdH4TcgGQy8i + hkn5V / WbSjGr7e9oD96372LJB1o7izbPtYHpPw7V / 8u4yvzFkvPTO3MXuMbx8JRPij8svgAcAw / EwCe0f8XGxZYFB6JQZzl + rHWj1Gf5WZLVTj5py5HbVoXjeF4OuMhYnQHKulW / x6U64CPtbfpVxQu7CX0PeicMov3cKup5EZmw / KwMFNb8pMtl5G3MhIyHkOX3PPUSMmXzOX7Fqsw35Gu5NidEwXWr / jnnD + XUFzLARJRaDXnCQ53o0BpSLzcXzQfAK + Cl9EEwXrKTyr1OWGa3sFnLvPDsn6Tg8P0PrBcSMR2NtfsAAAAASUVORK5CYII =";
    try {
      YGraph.captureCursor = new YCursor(atob(base64png));
    } catch (Exception) {
      console.log("Cannot create custom cursor");
    }
  }
  get dataPanels() {
    return this._dataPanels;
  }
  addDataPanel() {
    let p = new DataPanel(this, this);
    this._dataPanels.push(p);
    return p;
  }
  setMarkerCaptureCallbacks(start, stop) {
    this._markerCaptureStartedCallback = start;
    this._markerCaptureStoppedCallback = stop;
  }
  startMarkerCapture(m) {
    if (this._markerCaptureStartedCallback != null)
      this._markerCaptureStartedCallback(m);
    this.markerCapture = m;
    this.UIContainer.focus();
  }
  destroy() {
    if (this._touchStartfct != null)
      this.UIContainer.removeEventListener("touchstart", this._touchStartfct);
    if (this._touchMovefct != null)
      this.UIContainer.removeEventListener("touchstart", this._touchMovefct);
    if (this._touchEndfct != null)
      this.UIContainer.removeEventListener("touchstart", this._touchEndfct);
    if (this._mouseDownfct != null)
      this.UIContainer.removeEventListener("mousedown", this._mouseDownfct);
    if (this._mouseMovefct != null)
      this.UIContainer.removeEventListener("mousemove", this._mouseMovefct);
    if (this._mouseWheelfct != null)
      this.UIContainer.removeEventListener("wheel", this._mouseWheelfct);
    if (this._mouseKeyDownfct != null)
      this.UIContainer.removeEventListener("keydown", this._mouseKeyDownfct);
    super.destroy();
    Object.entries(this).forEach((pair) => {
      Reflect.set(this, pair[0], null);
    });
  }
  getMostRecentPoint() {
    let res = new pointXY(NaN, NaN);
    for (let i = 0; i < this._series.length; i++)
      if (!this.series[i].disabled) {
        let p = this.series[i].getlastPoint();
        if (!isNaN(p.x)) {
          if (isNaN(res.x))
            res = p;
          else if (p.x > res.x)
            res = p;
        }
      }
    return res;
  }
  adjustGlobalTimeRange(x) {
    let max = this._timeRange.Max;
    this._timeRange = MinMaxHandler.CombineWithNumber(this._timeRange, x);
    if (isNaN(max))
      return;
    let ofset = x - max;
    if (ofset > 0) {
      switch (this._xAxis.overflowHandling) {
        case XAxis.OverflowHandling.SCROLL:
          if (max > this._xAxis.min + (this._xAxis.max - this._xAxis.min) * 0.85 && max <= this._xAxis.max) {
            this.DisableRedraw();
            this._xAxis.set_minMax(this._xAxis.min + ofset, this._xAxis.max + ofset);
            this.AllowRedraw();
          }
          break;
        case XAxis.OverflowHandling.CONTRACT:
          if (max > this._xAxis.min + (this._xAxis.max - this._xAxis.min) * 0.95 && max <= this._xAxis.max) {
            this.DisableRedraw();
            this._xAxis.max += ofset;
            this.AllowRedraw();
          }
          break;
      }
    }
  }
  get bgColor1() {
    return this._bgColor1;
  }
  set bgColor1(value) {
    this._bgColor1 = value;
    this._bgBrush = null;
    this.redraw();
  }
  get bgColor2() {
    return this._bgColor2;
  }
  set bgColor2(value) {
    this._bgColor2 = value;
    this._bgBrush = null;
    this.redraw();
  }
  get xAxis() {
    return this._xAxis;
  }
  get navigator() {
    return this._navigator;
  }
  get yAxes() {
    return this._yAxes;
  }
  get series() {
    return this._series;
  }
  addYAxis() {
    let s = new YAxis(this, this, this._yAxes.length);
    this._yAxes.push(s);
    this.redraw();
    return s;
  }
  addSerie() {
    let s = new DataSerie(this);
    this._series.push(s);
    this.redraw();
    return s;
  }
  clearCachedObjects() {
    this._bgBrush = null;
    this.navigatorCache = null;
  }
  TouchStart(sender, e) {
    if (e.touches.length == 1) {
      this.HandleMouseDown(sender, e.touches[0].pageX, e.touches[0].pageY);
    } else if (e.touches.length == 2) {
      e.preventDefault();
      this.HandleEndOfMouseCapture();
      this._touchStartPinchDistance = Math.sqrt(Math.pow(e.touches[1].pageX - e.touches[0].pageX, 2) + Math.pow(e.touches[1].pageY - e.touches[0].pageY, 2));
      this._touchStartPinchCenter = new Point(e.touches[1].pageX + e.touches[0].pageX >> 2, e.touches[1].pageY + e.touches[0].pageY >> 2);
      this._touchStartPinchZoom = this.mainViewPort.zoomx;
      this._touchStartPinchIRLx = this.mainViewPort.IRLx;
      this._touchStartPinchRange = this._xAxis.max - this._xAxis.min;
    }
  }
  MouseDown(sender, e) {
    if (e.buttons == 2 && this.markerCapture != null) {
      this.markerCapture = null;
      if (this._markerCaptureStoppedCallback != null)
        this._markerCaptureStoppedCallback(null);
    }
    if (e.buttons != 1)
      return;
    this.HandleMouseDown(sender, e.pageX, e.pageY);
  }
  HandleMouseDown(sender, pageX, pageY) {
    let p = this.Scr2ElmMatrix.multiplyByV(Vector3.FromXYCoord(pageX, pageY)).toPoint();
    let eX = p.X;
    let eY = p.Y;
    if (eX >= this.mainViewPort.Lmargin && eX <= this.mainViewPort.Width - this.mainViewPort.Rmargin && eY >= this.mainViewPort.Tmargin && eY <= this.mainViewPort.Height - this.mainViewPort.Bmargin) {
      if (this.markerCapture != null) {
        let p22 = YGraph.ViewPortPointToIRL(this.mainViewPort, new Point(eX, eY));
        this.markerCapture.setCapturedPosition(p22.x, this.xAxis);
        if (this._markerCaptureStoppedCallback != null)
          this._markerCaptureStoppedCallback(this.markerCapture);
        this.markerCapture = null;
        return;
      }
      let p2 = YGraph.ViewPortPointToIRL(this.mainViewPort, new Point(eX, eY));
      this.mainViewPort.OriginalXAxisMin = this.xAxis.min;
      this.mainViewPort.OriginalXAxisMax = this.xAxis.max;
      this.mainViewPort.OriginalIRLx = this.mainViewPort.IRLx;
      this.mainViewPort.OriginalLmargin = this.mainViewPort.Lmargin;
      this.mainViewPort.OriginalZoomx = this.mainViewPort.zoomx;
      this.mainViewPort.CaptureStartY = eY;
      this.mainViewPort.IRLCaptureStartX = p2.x;
      this.mainViewPort.Capture = true;
    } else if (eX >= this._navigator.viewport.Lmargin && eX <= this._navigator.viewport.Width - this._navigator.viewport.Rmargin && eY >= this._navigator.viewport.Lmargin && eY <= this._navigator.viewport.Height - this._navigator.viewport.Bmargin) {
      let p2 = YGraph.ViewPortPointToIRL(this._navigator.viewport, new Point(eX, eY));
      let p22 = YGraph.ViewPortPointToIRL(this.mainViewPort, new Point(this.mainViewPort.Lmargin, 0));
      let p3 = YGraph.ViewPortPointToIRL(this.mainViewPort, new Point(this.mainViewPort.Width - this.mainViewPort.Rmargin, 0));
      if (p2.x >= p22.x && p2.x <= p3.x) {
        this._navigator.startCapture(p2, this._xAxis.min, this._xAxis.max);
      } else {
        this.DisableRedraw();
        let min = p2.x - (p3.x - p22.x) / 2;
        let max = min + (p3.x - p22.x);
        this._xAxis.set_minMax(min, max);
        this.AllowRedraw();
        this.Draw(0);
      }
    }
  }
  TouchMove(sender, e) {
    if (e.touches.length == 1) {
      e.preventDefault();
      this.HandleMouseMove(sender, e.touches[0].pageX, e.touches[0].pageY);
    } else if (e.touches.length == 2) {
      e.preventDefault();
      let newdistance = Math.sqrt(Math.pow(e.touches[1].pageX - e.touches[0].pageX, 2) + Math.pow(e.touches[1].pageY - e.touches[0].pageY, 2));
      let ZoomFactor = newdistance / this._touchStartPinchDistance;
      let NextZoomX = this._touchStartPinchZoom * ZoomFactor;
      if (NextZoomX > this.mainViewPort.zoomx && NextZoomX > 1e3)
        return;
      let currentRange = this._xAxis.max - this._xAxis.min;
      this.mainViewPort.IRLx = this._touchStartPinchIRLx + (this._touchStartPinchCenter.X - this.mainViewPort.Lmargin) / this._touchStartPinchZoom - (this._touchStartPinchCenter.X - this.mainViewPort.Lmargin) / NextZoomX;
      this._xAxis.set_minMax(this.mainViewPort.IRLx, this.mainViewPort.IRLx + this._touchStartPinchRange / ZoomFactor);
      this.mainViewPort.zoomx = NextZoomX;
      this.redraw();
    }
  }
  TouchEnd(sender, e) {
    this.HandleEndOfMouseCapture();
  }
  MouseMove(sender, e) {
    if (e.buttons != 1 && (this.mainViewPort.Capture || this._navigator.Capture))
      this.HandleEndOfMouseCapture();
    this.HandleMouseMove(sender, e.pageX, e.pageY);
    if (this.dataTracker.enabled) {
      if (this.dataTrackerRefreshtimeout != null)
        clearTimeout(this.dataTrackerRefreshtimeout);
      this.dataTrackerRefreshtimeout = setTimeout(() => {
        this.redraw();
      }, 100);
    }
  }
  HandleEndOfMouseCapture() {
    this.mainViewPort.Capture = false;
    this._navigator.stopCapture();
    if (this._dataTracker.enabled)
      this.redraw();
  }
  HandleMouseMove(sender, pageX, pageY) {
    let p = this.Scr2ElmMatrix.multiplyByV(Vector3.FromXYCoord(pageX, pageY)).toPoint();
    let eX = p.X;
    let eY = p.Y;
    if (this.markerCapture != null) {
      if (eX > this.mainViewPort.Lmargin && eX < this.mainViewPort.Width - this.mainViewPort.Rmargin && eY > this.mainViewPort.Tmargin && eY < this.mainViewPort.Height - this.mainViewPort.Bmargin) {
        if (this.UIContainer.style.cursor != YGraph.captureCursor.handle && this.UIContainer.style.cursor != "crosshair") {
          this.UIContainer.style.cursor = YGraph.captureCursor != null ? YGraph.captureCursor.handle : "crosshair";
        }
      } else if (this.UIContainer.style.cursor != "default")
        this.UIContainer.style.cursor = "default";
    } else if (this.UIContainer.style.cursor != "default")
      this.UIContainer.style.cursor = "default";
    if (this.mainViewPort.Capture) {
      let x1 = this.mainViewPort.OriginalIRLx + (eX - this.mainViewPort.OriginalLmargin) / this.mainViewPort.OriginalZoomx;
      let deltaX = x1 - this.mainViewPort.IRLCaptureStartX;
      let deltaY = eY - this.mainViewPort.CaptureStartY;
      this.DisableRedraw();
      let halfAxisDelta = (this.mainViewPort.OriginalXAxisMax - this.mainViewPort.OriginalXAxisMin) / 2;
      let Axismiddle = (this.mainViewPort.OriginalXAxisMax + this.mainViewPort.OriginalXAxisMin) / 2;
      let deltaCoef = YGraph._defaultVerticalDragZoomEnabled && Math.abs(deltaY) > 10 ? Math.pow(1.01, deltaY) : 1;
      this._xAxis.set_minMax(Axismiddle - halfAxisDelta * deltaCoef - deltaX, Axismiddle + halfAxisDelta * deltaCoef - deltaX);
      this.AllowRedraw();
      this.redraw();
      return;
    }
    if (this._navigator.viewport.Capture) {
      let x1 = this._navigator.viewport.OriginalIRLx + (eX - this._navigator.viewport.OriginalLmargin) / this._navigator.viewport.OriginalZoomx;
      let delta = x1 - this._navigator.viewport.IRLCaptureStartX;
      this.DisableRedraw();
      this._xAxis.set_minMax(this._navigator.viewport.OriginalXAxisMin + delta, this._navigator.viewport.OriginalXAxisMax + delta);
      this.AllowRedraw();
      this.redraw();
      return;
    }
  }
  cross(p) {
  }
  static IRLPointToViewPort(viewport, p, IRLy, zoomy) {
    if (IRLy === void 0) {
      let xx2 = viewport.Lmargin + Math.round((p.x - viewport.IRLx) * viewport.zoomx);
      let yy2 = viewport.Height - viewport.Bmargin - Math.round((p.y - viewport.IRLy) * viewport.zoomy);
      return new Point(xx2 >> 0, yy2 >> 0);
    }
    let xx = viewport.Lmargin + Math.round((p.x - viewport.IRLx) * viewport.zoomx);
    let yy = viewport.Height - viewport.Bmargin - Math.round((p.y - IRLy) * zoomy);
    return new Point(xx >> 0, yy >> 0);
  }
  static ViewPortPointToIRL(viewport, p, IRLy, zoomy) {
    if (IRLy === void 0) {
      return new pointXY(viewport.IRLx + (p.X - viewport.Lmargin) / viewport.zoomx, viewport.IRLy + (+viewport.Height - p.Y - viewport.Bmargin) / viewport.zoomy);
    }
    return new pointXY(viewport.IRLx + (p.X - viewport.Lmargin) / viewport.zoomx, IRLy + (+viewport.Height - p.Y - viewport.Bmargin) / zoomy);
  }
  static FindMinMax(start, end, data, count) {
    let res = MinMaxHandler.DefaultValue();
    if (!(data[0].x < end) && data[count - 1].x > start)
      return res;
    let N1 = 0;
    let N2 = 0;
    let First = 0;
    if (data[0].x < start) {
      N1 = 0;
      N2 = count - 1;
      while (N2 - N1 > 1) {
        let N = N1 + N2 >> 1;
        if (data[N].x > start)
          N2 = N;
        else
          N1 = N;
      }
      First = N1 - 1;
      if (First < 0)
        First = 0;
    }
    let Last = count - 1;
    if (data[Last] === void 0) {
      debugger;
    }
    if (data[Last].x > end) {
      N1 = 0;
      N2 = count - 1;
      while (N2 - N1 > 1) {
        let N = N1 + N2 >> 1;
        if (data[N].x < end)
          N1 = N;
        else
          N2 = N;
      }
      Last = N2 + 1;
      if (Last > count - 1)
        Last = count - 1;
    }
    res.Min = data[First].y;
    res.Max = data[First].y;
    for (let i = First + 1; i <= Last; i++) {
      if (data[i].y < res.Min)
        res.Min = data[i].y;
      if (data[i].y > res.Max)
        res.Max = data[i].y;
    }
    return res;
  }
  resetlegendPens() {
    for (let i = 0; i < this._series.length; i++) {
      this._series[i].resetlegendPen();
    }
  }
  drawLegendPanel(g, viewPortWidth, viewPortHeight, mainViewPort) {
    let verticalRatio = 1.25;
    if (!this._legendPanel.enabled)
      return;
    let legendWidths = new Array(this._series.length);
    let legendHeight = new Array(this._series.length);
    let ofsetx = new Array(this._series.length);
    let ofsety = new Array(this._series.length);
    let legends = new Array(this._series.length);
    let totalHeight = 0;
    let totalWidth = 0;
    let maxWidth = 0;
    let maxHeight = 0;
    g.TextRenderingHint = YTextRenderingHint.SingleBitPerPixelGridFit;
    g.SetClip(new YRectangle(0, 0, viewPortWidth, viewPortHeight));
    for (let i = 0; i < this._series.length; i++) {
      if (this._series[i].legend != "")
        legends[i] = this._series[i].legend;
      else
        legends[i] = "Series " + (i + 1).toString();
    }
    if (this._legendPanel.position == LegendPanel.Position.TOP || this._legendPanel.position == LegendPanel.Position.BOTTOM) {
      let availableWidth = viewPortWidth - 2 * this._legendPanel.padding + this._legendPanel.borderthickness;
      if (this._legendPanel.overlap)
        availableWidth = availableWidth - mainViewPort.Lmargin - mainViewPort.Rmargin;
      totalHeight = 0;
      let xx = 0;
      let yy = 0;
      for (let i = 0; i < this._series.length; i++) {
        if (this._series[i].segments.length > 0 && this._series[i].visible && !this._series[i].disabled) {
          let ssize = g.MeasureString(legends[i], this._legendPanel.font, 1e5);
          legendHeight[i] = ssize.height + 1;
          let ww = ssize.width + 20;
          if (xx == 0)
            totalHeight += ssize.height;
          if (availableWidth - xx < ww) {
            if (xx == 0) {
              ofsetx[i] = xx;
              ofsety[i] = yy;
              yy += ssize.height;
              if (maxWidth < ww)
                maxWidth = ww;
            } else {
              yy += ssize.height;
              ofsetx[i] = 0;
              ofsety[i] = yy;
              xx = ww;
              totalHeight += ssize.height;
              if (maxWidth < xx)
                maxWidth = xx;
            }
          } else {
            ofsetx[i] = xx;
            ofsety[i] = yy;
            xx += ww;
            if (maxWidth < xx)
              maxWidth = xx;
          }
        }
      }
      if (totalWidth > availableWidth) {
        totalWidth = availableWidth;
      }
    } else {
      let ty = 0;
      for (let i = 0; i < this._series.length; i++) {
        if (this._series[i].segments.length > 0 && this._series[i].visible && !this._series[i].disabled) {
          let ssize = g.MeasureString(legends[i], this._legendPanel.font, 1e5);
          legendWidths[i] = ssize.width + 1;
          if (maxWidth < legendWidths[i] + 20)
            maxWidth = legendWidths[i] + 20;
          legendHeight[i] = ssize.height + 1;
          if (maxHeight < legendHeight[i])
            maxHeight = legendHeight[i];
          ofsetx[i] = 0;
          ofsety[i] = ty;
          ty += ssize.height * verticalRatio;
          totalHeight += i == 0 ? ssize.height : ssize.height * verticalRatio;
        }
      }
    }
    let w = maxWidth + 2 * this._legendPanel.padding + this._legendPanel.borderthickness;
    let h = totalHeight + 2 * this._legendPanel.padding + this._legendPanel.borderthickness;
    let x = 0;
    let y = 0;
    switch (this._legendPanel.position) {
      case LegendPanel.Position.LEFT:
        x = this._legendPanel.horizontalMargin;
        if (!this._legendPanel.overlap) {
          mainViewPort.Lmargin += w + 2 * this.legendPanel.horizontalMargin + this.legendPanel.borderthickness >> 0;
          y = (viewPortHeight - h) / 2;
        } else {
          x += mainViewPort.Lmargin;
          y = mainViewPort.Tmargin + (viewPortHeight - mainViewPort.Tmargin - mainViewPort.Bmargin - h) / 2;
        }
        break;
      case LegendPanel.Position.TOPLEFT:
        x = this._legendPanel.horizontalMargin;
        y = this._legendPanel.verticalMargin;
        if (!this._legendPanel.overlap) {
          mainViewPort.Lmargin += w + 2 * this.legendPanel.horizontalMargin + this.legendPanel.borderthickness >> 0;
        } else {
          x += mainViewPort.Lmargin;
          y += mainViewPort.Tmargin;
        }
        break;
      case LegendPanel.Position.TOP:
        if (!this._legendPanel.overlap) {
          x = (viewPortWidth - w) / 2 - this._legendPanel.horizontalMargin - this._legendPanel.borderthickness;
          y = this._legendPanel.verticalMargin + this._legendPanel.borderthickness;
          mainViewPort.Tmargin += totalHeight + this._legendPanel.verticalMargin + 2 * this._legendPanel.verticalMargin + this._legendPanel.borderthickness >> 0;
        } else {
          x = mainViewPort.Lmargin + (viewPortWidth - mainViewPort.Lmargin - mainViewPort.Rmargin - w) / 2 - this._legendPanel.horizontalMargin - this._legendPanel.borderthickness;
          y = mainViewPort.Tmargin + this._legendPanel.verticalMargin - this._legendPanel.borderthickness;
        }
        break;
      case LegendPanel.Position.TOPRIGHT:
        x = viewPortWidth - this._legendPanel.horizontalMargin - w;
        y = this._legendPanel.verticalMargin;
        if (!this._legendPanel.overlap) {
          mainViewPort.Rmargin += w + 2 * this._legendPanel.horizontalMargin + this._legendPanel.borderthickness >> 0;
        } else {
          x -= mainViewPort.Rmargin;
          y += mainViewPort.Tmargin;
        }
        break;
      case LegendPanel.Position.RIGHT:
        x = viewPortWidth - this._legendPanel.horizontalMargin - w;
        if (!this._legendPanel.overlap) {
          mainViewPort.Rmargin += w + 2 * this._legendPanel.horizontalMargin + this._legendPanel.borderthickness >> 0;
          y = (viewPortHeight - h) / 2;
        } else {
          x -= mainViewPort.Rmargin;
          y = mainViewPort.Tmargin + (viewPortHeight - mainViewPort.Tmargin - mainViewPort.Bmargin - h) / 2;
        }
        break;
      case LegendPanel.Position.BOTTOMRIGHT:
        x = viewPortWidth - this._legendPanel.horizontalMargin - w;
        if (!this._legendPanel.overlap) {
          mainViewPort.Rmargin += w + 2 * this._legendPanel.horizontalMargin + this._legendPanel.borderthickness >> 0;
          y = viewPortHeight - this._legendPanel.verticalMargin - h;
        } else {
          x -= mainViewPort.Rmargin;
          y = viewPortHeight - mainViewPort.Bmargin - h - this._legendPanel.verticalMargin;
        }
        break;
      case LegendPanel.Position.BOTTOM:
        if (!this._legendPanel.overlap) {
          x = (viewPortWidth - w) / 2 - this._legendPanel.horizontalMargin - this._legendPanel.borderthickness;
          y = viewPortHeight - this._legendPanel.verticalMargin - 2 * this._legendPanel.padding - this._legendPanel.borderthickness - totalHeight;
          mainViewPort.Bmargin += totalHeight + 2 * this._legendPanel.padding + 2 * this._legendPanel.verticalMargin + this._legendPanel.borderthickness;
        } else {
          x = mainViewPort.Lmargin + (viewPortWidth - mainViewPort.Lmargin - mainViewPort.Rmargin - w) / 2 - this._legendPanel.horizontalMargin - this._legendPanel.borderthickness;
          y = viewPortHeight - mainViewPort.Bmargin - totalHeight - 2 * this._legendPanel.padding - 2 * this._legendPanel.verticalMargin - this._legendPanel.borderthickness;
        }
        break;
      case LegendPanel.Position.BOTTOMLEFT:
        x = this._legendPanel.horizontalMargin;
        y = this._legendPanel.verticalMargin;
        if (!this._legendPanel.overlap) {
          mainViewPort.Lmargin += w + 2 * this._legendPanel.horizontalMargin + this._legendPanel.borderthickness;
          y = viewPortHeight - this._legendPanel.verticalMargin - h;
        } else {
          x += mainViewPort.Lmargin;
          y = viewPortHeight - mainViewPort.Bmargin - h - this._legendPanel.verticalMargin;
        }
        break;
    }
    let rect = new YRectangle(x >> 0, y >> 0, w >> 0, h >> 0);
    g.FillRectangle(this._legendPanel.bgBrush, rect);
    g.DrawRectangle(this._legendPanel.pen, rect);
    g.TextRenderingHint = YTextRenderingHint.AntiAlias;
    for (let i = 0; i < this._series.length; i++) {
      if (this._series[i].segments.length > 0 && this._series[i].visible && !this._series[i].disabled) {
        g.DrawStringXY(legends[i], this._legendPanel.font, this._legendPanel.font.brush, x + ofsetx[i] + 20 + this._legendPanel.padding >> 0, y + ofsety[i] + this._legendPanel.padding >> 0);
        let px = x + ofsetx[i] + this._legendPanel.borderthickness / 2 + this._legendPanel.padding + 6 >> 0;
        let py = y + ofsety[i] + this._legendPanel.padding + legendHeight[i] / 2 >> 0;
        g.DrawLine(this._series[i].legendPen, new PointF(px, py), new PointF(px + 12, py));
      }
    }
  }
  static DoSegmentRendering(w, g, p, data, count, xTimeStart, xTimeEnd) {
    if (data[0].x > xTimeEnd || data[count - 1].x < xTimeStart)
      return 0;
    let isSVG = g instanceof YGraphicsSVG;
    let N1 = 0;
    let N2 = 0;
    let First = 0;
    if (data[0].x < xTimeStart) {
      N1 = 0;
      N2 = count - 1;
      while (N2 - N1 > 1) {
        let N = N1 + N2 >> 1;
        if (data[N].x > xTimeStart)
          N2 = N;
        else
          N1 = N;
      }
      First = N1 - 1;
      if (First < 0)
        First = 0;
    }
    let Last = count - 1;
    if (data[Last].x > xTimeEnd) {
      N1 = 0;
      N2 = count - 1;
      while (N2 - N1 > 1) {
        let N = N1 + N2 >> 1;
        if (data[N].x < xTimeEnd)
          N1 = N;
        else
          N2 = N;
      }
      Last = N2 + 1;
      if (Last > count - 1)
        Last = count - 1;
    }
    if (Last - First > 2 * w.Width - w.Lmargin - w.Rmargin) {
      let ToDraw = new Array(3 * (Last - First + 1));
      let Current = YGraph.IRLPointToViewPort(w, data[First]);
      let New;
      let i = First + 1;
      let n = 0;
      let max;
      let min;
      let limit;
      while (i < Last) {
        ToDraw[n++] = new PointF(Current.X, Current.Y);
        min = data[i].y;
        max = min;
        limit = YGraph.ViewPortPointToIRL(w, new Point(Current.X + 1, Current.Y + 1)).x;
        do {
          if (data[i].y > max)
            max = data[i].y;
          if (data[i].y < min)
            min = data[i].y;
          i++;
        } while (i < Last && data[i].x < limit);
        let p1 = YGraph.IRLPointToViewPort(w, new pointXY(data[i].x, min));
        let p2 = YGraph.IRLPointToViewPort(w, new pointXY(data[i].x, max));
        if (Math.abs(p1.Y - p2.Y) > 2) {
          ToDraw[n++] = new PointF(p1.X, p1.Y);
          ToDraw[n++] = new PointF(p2.X, p2.Y);
        }
        Current = YGraph.IRLPointToViewPort(w, data[i]);
      }
      ToDraw[n++] = Current;
      ToDraw = ToDraw.slice(0, n);
      if (n > 1)
        g.DrawLines(p, ToDraw);
      return n;
    } else {
      if (isSVG) {
        let ToDraw = new Array(Last - First + 1);
        for (let i = First; i <= Last; i++) {
          ToDraw[i - First] = YGraph.IRLPointToViewPort(w, data[i]);
        }
        g.DrawLines(p, ToDraw);
      } else {
        for (let i = First; i < Last; i++) {
          g.DrawLine(p, YGraph.IRLPointToViewPort(w, data[i]), YGraph.IRLPointToViewPort(w, data[i + 1]));
        }
      }
    }
    return Last - First;
  }
  DrawYAxisZones(w, g, scale) {
    if (!scale.visible)
      return;
    let Delta = scale.startStopStep.dataMax - scale.startStopStep.dataMin;
    let YZoom = Delta / (w.Height - w.Bmargin - w.Tmargin);
    for (let i = 0; i < scale.zones.length; i++) {
      if (scale.zones[i].visible) {
        let max = scale.zones[i].max;
        let min = scale.zones[i].min;
        if (Number.isNaN(max)) {
          max = scale.startStopStep.dataMax;
        }
        if (Number.isNaN(min))
          min = scale.startStopStep.dataMin;
        if (max < min) {
          let t = max;
          max = min;
          min = t;
        }
        let y0 = w.Height - w.Bmargin - Math.round((max - scale.startStopStep.dataMin) / YZoom) >> 0;
        let h = Math.round((max - min) / YZoom) >> 0;
        g.FillRectangleXYHW(scale.zones[i].zoneBrush, this.mainViewPort.Lmargin, y0, this.mainViewPort.Width - this.mainViewPort.Rmargin - this.mainViewPort.Lmargin + 1, h);
      }
    }
  }
  DrawXAxisZones(w, g, scale) {
    if (!scale.visible)
      return;
    let delta = scale.max - scale.min;
    let XZoom = delta / (w.Width - w.Lmargin - w.Rmargin);
    for (let i = 0; i < scale.zones.length; i++) {
      if (scale.zones[i].visible) {
        let max = scale.zones[i].max;
        let min = scale.zones[i].min;
        if (Number.isNaN(max))
          max = scale.min;
        if (Number.isNaN(min))
          min = scale.max;
        if (max < min) {
          let t = max;
          max = min;
          min = t;
        }
        let x0 = w.Lmargin + Math.round((min - scale.min) / XZoom) >> 0;
        g.FillRectangleXYHW(scale.zones[i].zoneBrush, x0, this.mainViewPort.Tmargin, (max - min) / XZoom >> 0, this.mainViewPort.Height - this.mainViewPort.Tmargin - this.mainViewPort.Bmargin);
      }
    }
  }
  static DrawYAxis(w, g, axis, ofset, simulation) {
    if (!axis.visible) {
      axis.innerWidth = 0;
      return axis.innerWidth;
    }
    let Delta = axis.startStopStep.dataMax - axis.startStopStep.dataMin;
    let YZoom = Delta / (w.Height - w.Bmargin - w.Tmargin);
    let leftSide = axis.position == YAxis.HrzPosition.LEFT;
    let x = leftSide ? w.Lmargin - ofset : w.Width - w.Rmargin + ofset;
    if (!simulation)
      g.DrawLineXY(axis.pen, x, w.Tmargin, x, w.Height - w.Bmargin);
    let format = new YStringFormat(16384);
    format.LineAlignment = 1;
    format.Alignment = leftSide ? 2 : 0;
    let FirstStep = axis.startStopStep.step * Math.floor(axis.startStopStep.start / axis.startStopStep.step);
    if (FirstStep < 0) {
      FirstStep -= axis.startStopStep.step;
    }
    let stepCount = ((Delta - (FirstStep - axis.startStopStep.dataMin)) / axis.startStopStep.step >> 0) + 1;
    if (!simulation)
      g.TextRenderingHint = YTextRenderingHint.AntiAlias;
    let UnitWidth = 0;
    let labelPrecision = 0;
    if (axis.startStopStep.precision < 0)
      labelPrecision = -axis.startStopStep.precision;
    if (stepCount < w.Height) {
      for (let i = 0; i < stepCount; i++) {
        let y = Math.round((FirstStep + i * axis.startStopStep.step - axis.startStopStep.dataMin) / YZoom) >> 0;
        if (y >= 0) {
          y = w.Height - w.Bmargin - y;
          let v = FirstStep + i * axis.startStopStep.step;
          if (!simulation) {
            if (axis.showGrid && (i > 0 || axis.startStopStep.dataMin != 0))
              g.DrawLineXY(axis.gridPen, w.Lmargin, y, w.Width - w.Rmargin, y);
            if (Math.abs(v) < 1e-6 && axis.highlightZero) {
              g.DrawLineXY(axis.pen, w.Lmargin, y, w.Width - w.Rmargin, y);
            }
            g.DrawLineXY(axis.pen, x + (leftSide ? -2 : 2), y, x + (leftSide ? 5 : -5), y);
          }
          let label = v.toFixed(labelPrecision);
          let ssize = g.MeasureString(label, axis.font, 1e5);
          if (ssize.width > UnitWidth)
            UnitWidth = ssize.width;
          if (!simulation) {
            let p = new Point(x + (leftSide ? -3 : 3), y);
            g.DrawStringPF(label, axis.font, axis.font.brush, p, format);
          }
        }
      }
    }
    if (axis.legend.title != "") {
      let size = g.MeasureString(axis.legend.title, axis.legend.font, 1e5);
      if (!simulation) {
        let format2 = new YStringFormat(16384);
        format2.Alignment = 1;
        format2.LineAlignment = 1;
        format2.Trimming = 0;
        let legendX = x + (leftSide ? -UnitWidth - size.height : UnitWidth + size.height + 2) >> 0;
        let legendY = w.Tmargin + (w.Height - w.Tmargin - w.Bmargin) / 2 >> 0;
        g.Transform(legendX, legendY, leftSide ? -Math.PI / 2 : Math.PI / 2);
        g.DrawStringPF(axis.legend.title, axis.legend.font, axis.legend.font.brush, new Point(0, 0), format2);
        g.ResetTransform();
      }
      UnitWidth += size.height;
    }
    axis.innerWidth = (UnitWidth >> 0) + 10;
    return axis.innerWidth;
  }
  DrawMonitorXAxis(w, g, xRange, format) {
    let delta = xRange.Max - xRange.Min;
    let scale = TimeConverter.BestTimeformat(delta, delta, this.xAxis.timeReference);
    let XZoom = delta / (w.Width - w.Lmargin - w.Rmargin);
    let stepCount = (delta / scale.step >> 0) + 2;
    let FirstStep = scale.step * Math.floor(xRange.Min / scale.step);
    if (FirstStep < xRange.Min)
      FirstStep += scale.step;
    g.TextRenderingHint = YTextRenderingHint.AntiAlias;
    let y = w.Height - w.Bmargin;
    g.DrawLineXY(this._navigator.pen, w.Lmargin, w.Height - w.Bmargin - 1, w.Width - w.Rmargin, w.Height - w.Bmargin - 1);
    let label;
    let t = FirstStep;
    do {
      let d = TimeConverter.FromUnixTime(t);
      if (scale.step > 30 * 86400) {
        t = TimeConverter.ToUnixTime(new Date(d.getFullYear(), d.getMonth(), 1));
      }
      if (t >= xRange.Min) {
        let x = w.Lmargin + Math.round((t - xRange.Min) / XZoom);
        g.DrawLineXY(this._navigator.pen, x, y, x, y - 4);
        if (format == XAxis.FORMATAUTO) {
          label = TimeConverter.FromUnixTime(t).ToString(scale.format);
        } else {
          label = TimeConverter.FromUnixTime(t).ToString(format);
        }
        let ssize = g.MeasureString(label, this._navigator.font, 1e5);
        g.DrawString(label, this._navigator.font, this._navigator.font.brush, new Point(x - ssize.width / 2, y - ssize.height - 1));
      }
      t += scale.step;
    } while (t < xRange.Max);
  }
  static XLabel(t, scale, scaleFormat, timeRange) {
    let label;
    if (scale.timeReference == TimeConverter.TimeReference.ABSOLUTE) {
      if (scale.labelFormat == XAxis.FORMATAUTO) {
        label = TimeConverter.FromUnixTime(t).ToString(scaleFormat.format);
      } else {
        label = t.toString();
      }
    } else {
      let ticks = YTimeSpan.TicksPerSecond * (Math.round(1e3 * (t - scale.zeroTime)) / 1e3);
      label = ticks < 0 ? "-" + new YTimeSpan(-ticks).toString(scaleFormat.format) : new YTimeSpan(ticks).toString(scaleFormat.format);
    }
    return label;
  }
  DrawXAxis(w, g, scale, simulation) {
    if (w.Width - w.Rmargin - w.Lmargin < 10)
      return 1;
    let stringFormat = new YStringFormat(16384);
    stringFormat.Alignment = 1;
    let bottomSide = scale.position == XAxis.VrtPosition.BOTTOM;
    let y = bottomSide ? w.Height - w.Bmargin : w.Tmargin;
    if (!simulation)
      g.DrawLineXY(scale.pen, w.Lmargin, y, w.Width - w.Rmargin, y);
    let delta = scale.max - scale.min;
    let XZoom = delta / (w.Width - w.Lmargin - w.Rmargin);
    let stepCount = (delta / scale.step >> 0) + 1;
    let FirstStep = 0;
    let timeRange = MinMaxHandler.DefaultValue();
    for (let i = 0; i < this._series.length; i++) {
      if (!this._series[i].disabled) {
        timeRange = MinMaxHandler.Combine(timeRange, this._series[i].timeRange);
      }
    }
    scale.zeroTime = timeRange.Min;
    if (scale.timeReference == TimeConverter.TimeReference.ABSOLUTE) {
      FirstStep = scale.step * Math.floor(scale.min / scale.step);
      timeRange.Min = scale.min;
      timeRange.Max = scale.max;
    } else {
      if (Number.isNaN(timeRange.Min))
        return 0;
      FirstStep = timeRange.Min + scale.step * Math.floor((scale.min - scale.zeroTime) / scale.step);
    }
    if (FirstStep < scale.min)
      FirstStep += scale.step;
    let timeOffset = 0;
    if (scale.timeReference != TimeConverter.TimeReference.ABSOLUTE) {
      timeOffset = FirstStep;
    }
    scale.fullSize = timeRange.Max - timeRange.Min;
    let scaleFormat = scale.bestFormat(timeRange.Max - timeRange.Min, scale.max - scale.min);
    if (!simulation)
      g.TextRenderingHint = YTextRenderingHint.AntiAlias;
    let UnitHeight = 0;
    let label;
    scale.step = scaleFormat.step;
    let t = parseFloat(FirstStep.toString());
    label = YGraph.XLabel(t, scale, scaleFormat, timeRange);
    let ssize = g.MeasureString(label, scale.font, 1e5);
    let mod = 1;
    while (mod * (w.Width - w.Rmargin - w.Lmargin) / stepCount < ssize.width) {
      mod++;
    }
    let steps = Math.round((t - timeOffset) / scale.step) >> 0;
    let previousT = 0;
    do {
      let d = TimeConverter.FromUnixTime(t);
      if (scale.step > 32 * 86400 && scale.timeReference == TimeConverter.TimeReference.ABSOLUTE) {
        if (scale.step >= 365 * 86400) {
          let m = d.getMonth();
          t = TimeConverter.ToUnixTime(new Date(d.getFullYear() + (m > 5 ? 1 : 0), 0, 1));
        } else
          t = TimeConverter.ToUnixTime(new Date(d.getFullYear(), d.getMonth(), 1));
        if (t < previousT) {
          debugger;
        }
      }
      if (t >= scale.min) {
        let x = w.Lmargin + Math.round((t - scale.min) / XZoom) >> 0;
        if (x <= w.Width - w.Rmargin) {
          if (!simulation) {
            if (scale.showGrid)
              g.DrawLineXY(scale.gridPen, x, w.Tmargin, x, w.Height - w.Bmargin);
            g.DrawLineXY(scale.pen, x, y + (bottomSide ? 2 : -2), x, y + (bottomSide ? -5 : 5));
          }
          label = YGraph.XLabel(t, scale, scaleFormat, timeRange);
          ssize = g.MeasureString(label, scale.font, 1e5);
          if (ssize.height > UnitHeight)
            UnitHeight = ssize.height;
          if (!simulation) {
            if (steps % mod == 0) {
              g.DrawStringPF(label, scale.font, scale.font.brush, new PointF(x, y + (bottomSide ? 5 : -ssize.height >> 0) - 2), stringFormat);
            }
          }
        }
      }
      previousT = t;
      t += scale.step;
      if (t < previousT)
        debugger;
      steps++;
    } while (t <= scale.max);
    if (scale.legend.title != "") {
      let size = g.MeasureString(scale.legend.title, scale.legend.font, 1e5);
      if (!simulation) {
        let legendX = w.Lmargin + (w.Width - w.Lmargin - w.Rmargin - size.width) / 2 >> 0;
        let legendY = bottomSide ? w.Height - w.Bmargin + UnitHeight + 5 : w.Tmargin - UnitHeight - size.height * 1.5;
        g.DrawString(scale.legend.title, scale.legend.font, scale.legend.font.brush, new PointF(legendX, legendY));
      }
      UnitHeight += size.height >> 0;
    }
    scale.innerHeight = (UnitHeight >> 0) + 10;
    return scale.innerHeight;
  }
  pixelxSize(mainViewPort, scaleX) {
    let dtime = scaleX.max - scaleX.min;
    let dview = mainViewPort.Width - mainViewPort.Lmargin - mainViewPort.Rmargin;
    if (dview > 0)
      return dtime / dview;
    return 0;
  }
  TimeToAutoSting(t, mainViewPort, scaleX) {
    let strValue = "";
    let dtime = scaleX.max - scaleX.min;
    let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    if (dtime > 0) {
      let pixelSize = this.pixelxSize(mainViewPort, scaleX);
      if (pixelSize > 0) {
        if (scaleX.timeReference == TimeConverter.TimeReference.ABSOLUTE) {
          let date = TimeConverter.FromUnixTime(t);
          let MMMM = months[date.getMonth()];
          let dd = date.getDate().toString();
          let HH = date.getHours().toString();
          if (HH.length < 2)
            HH = "0" + HH;
          let mm = date.getMinutes().toString();
          if (mm.length < 2)
            mm = "0" + mm;
          let ss = date.getSeconds().toString();
          if (ss.length < 2)
            ss = "0" + ss;
          let ff = Math.round(date.getMilliseconds() / 10).toString();
          if (ff.length < 2)
            ff = "0" + ss;
          let f = Math.round(date.getMilliseconds() / 100).toString();
          if (dtime >= 86400)
            strValue += MMMM + " " + dd;
          if (pixelSize < 0.1) {
            strValue += (strValue != "" ? " " : "") + HH + ":" + mm + ":" + ss + "." + ff;
          } else if (pixelSize < 1) {
            strValue += (strValue != "" ? " " : "") + HH + ":" + mm + ":" + ss + "." + f;
          } else if (pixelSize < 60) {
            strValue += (strValue != "" ? " " : "") + HH + ":" + mm + ":" + ss;
          } else if (pixelSize < 3600) {
            strValue += (strValue != "" ? " " : "") + HH + ":" + mm;
          } else if (pixelSize < 86400)
            strValue += (strValue != "" ? " " : "") + HH + "H";
        } else {
          let format = TimeConverter.RelativeFormat(scaleX.fullSize, dtime, pixelSize);
          let ticks = YTimeSpan.TicksPerSecond * (Math.round(100 * (t - scaleX.zeroTime)) / 100);
          strValue += ticks < 0 ? "-" + new YTimeSpan(-ticks).toString(format) : new YTimeSpan(ticks).toString(format);
        }
      }
    }
    return strValue;
  }
  DrawDataTracker(g, viewPortWidth, viewPortHeight, scaleX) {
    if (!this._dataTracker.enabled) {
      return;
    }
    let p = this.mouseLocalPosition();
    if (p == null) {
      return;
    }
    if (p.X <= this.mainViewPort.Lmargin) {
      return;
    }
    if (p.Y <= this.mainViewPort.Tmargin) {
      return;
    }
    if (p.X >= this.UIContainer.width - this.mainViewPort.Rmargin) {
      return;
    }
    if (p.Y >= this.UIContainer.height - this.mainViewPort.Bmargin) {
      return;
    }
    g.SetClip(new YRectangle(0, 0, viewPortWidth, viewPortHeight));
    let DataPoint = YGraph.ViewPortPointToIRL(this.mainViewPort, p);
    let delta = -1;
    let bestindex = -1;
    let bestmatch = new Array(this._series.length);
    let IRLmatch = new Array(this._series.length);
    for (let i = 0; i < this._series.length; i++) {
      if (this._series[i].visible && !this._series[i].disabled) {
        let p2 = this._series[i].findClosestValue(DataPoint.x, false);
        if (p2 != null) {
          IRLmatch[i] = p2;
          bestmatch[i] = YGraph.IRLPointToViewPort(this.mainViewPort, IRLmatch[i], this.yAxes[this._series[i].yAxisIndex].IRLy, this.yAxes[this._series[i].yAxisIndex].zoom);
          if (bestindex < 0 || delta > Math.abs(bestmatch[i].Y - p.Y)) {
            delta = Math.abs(bestmatch[i].Y - p.Y);
            if (this._dataTracker.detectionDistance == 0 || delta <= this._dataTracker.detectionDistance && Math.abs(bestmatch[i].X - p.X) < this._dataTracker.detectionDistance) {
              bestindex = i;
            }
          }
        }
      }
    }
    if (bestindex >= 0) {
      let xx = bestmatch[bestindex].X - this._dataTracker.diameter / 2 >> 0;
      let yy = bestmatch[bestindex].Y - this._dataTracker.diameter / 2 >> 0;
      let dd = this._dataTracker.diameter;
      g.FillEllipse(this._series[bestindex].brush, xx, yy, dd, dd);
      g.DrawEllipse(this._dataTracker.pen, xx, yy, dd, dd);
      let dx;
      let dy;
      if (p.X > this.mainViewPort.Lmargin + (viewPortWidth - this.mainViewPort.Lmargin - this.mainViewPort.Rmargin) / 2)
        dx = -1;
      else
        dx = 1;
      if (p.Y > this.mainViewPort.Tmargin + (viewPortHeight - this.mainViewPort.Tmargin - this.mainViewPort.Bmargin) / 2)
        dy = -1;
      else
        dy = 1;
      let xx2 = bestmatch[bestindex].X + dx * (this._dataTracker.handleLength * 1.5) >> 0;
      let yy2 = bestmatch[bestindex].Y + dy * this._dataTracker.handleLength >> 0;
      g.DrawLineXY(this._dataTracker.pen, bestmatch[bestindex].X + dx * 0.707 * this._dataTracker.diameter / 2 >> 0, bestmatch[bestindex].Y + dy * 0.707 * this._dataTracker.diameter / 2 >> 0, bestmatch[bestindex].X + dx * this._dataTracker.handleLength >> 0, bestmatch[bestindex].Y + dy * this._dataTracker.handleLength >> 0);
      g.DrawLineXY(this._dataTracker.pen, bestmatch[bestindex].X + dx * this._dataTracker.handleLength >> 0, bestmatch[bestindex].Y + dy * this._dataTracker.handleLength >> 0, xx2, yy2);
      let strValue = "";
      if (this._dataTracker.showSerieName)
        strValue += this._series[bestindex].legend + "\r\n";
      if (this._dataTracker.showTimeStamp) {
        let t = IRLmatch[bestindex].x;
        strValue += this.TimeToAutoSting(t, this.mainViewPort, scaleX) + "\r\n";
      }
      if (this._dataTracker.dataPrecision.toString == DataTracker.DataPrecision.PRECISION_NOLIMIT.toString) {
        strValue += IRLmatch[bestindex].y.toString() + this._series[bestindex].unit;
      } else {
        let strvalue = this._dataTracker.dataPrecision.description;
        let precision = -Math.log10(Number(strvalue));
        strValue += IRLmatch[bestindex].y.toFixed(precision) + this._series[bestindex].unit;
      }
      let ssize = g.MeasureString(strValue, this._dataTracker.font, 1e4);
      let labelwidth = ssize.width + 2 * this._dataTracker.padding + this._dataTracker.borderthickness;
      let labelHeight = ssize.height + 2 * this._dataTracker.padding + this._dataTracker.borderthickness;
      if (dx > 0) {
        g.FillRectangleXYHW(this._dataTracker.bgBrush, xx2, yy2 - (labelHeight >> 1), labelwidth, labelHeight);
        g.DrawRectangleXYHW(this._dataTracker.pen, xx2, yy2 - (labelHeight >> 1), labelwidth, labelHeight);
        g.DrawStringXY(strValue, this._dataTracker.font, this._dataTracker.font.brush, xx2 + this._dataTracker.padding >> 0, yy2 - (labelHeight >> 1) + this._dataTracker.padding >> 0);
      } else {
        g.FillRectangleXYHW(this._dataTracker.bgBrush, xx2 - labelwidth, yy2 - (labelHeight >> 1), labelwidth, labelHeight);
        g.DrawRectangleXYHW(this._dataTracker.pen, xx2 - labelwidth, yy2 - (labelHeight >> 1), labelwidth, labelHeight);
        g.DrawStringXY(strValue, this._dataTracker.font, this.dataTracker.font.brush, xx2 + this._dataTracker.padding - labelwidth >> 0, yy2 - (labelHeight >> 1) + this._dataTracker.padding >> 0);
      }
    }
  }
  DrawMarkers(w, g, scaleX, viewPortWidth, viewPortHeight) {
    if (this._xAxis.markers.length == 0)
      return;
    g.SetClip(new YRectangle(w.Lmargin, w.Tmargin, w.Width - w.Rmargin - w.Lmargin, w.Height - w.Bmargin - w.Tmargin));
    let Bottomleft = YGraph.ViewPortPointToIRL(w, new Point(w.Lmargin, w.Height - w.Bmargin));
    let TopRight = YGraph.ViewPortPointToIRL(w, new Point(w.Width - w.Rmargin, w.Tmargin));
    let dy = (w.Height - w.Bmargin - w.Tmargin) / 100;
    let pixelSize = -1;
    g.TextRenderingHint = YTextRenderingHint.AntiAlias;
    for (let i = 0; i < this._xAxis.markers.length; i++) {
      if (this._xAxis.markers[i].enabled) {
        if (pixelSize < 0)
          pixelSize = this.pixelxSize(this.mainViewPort, scaleX);
        let mustdraw = true;
        let xpos = 0;
        if (this._xAxis.markers[i].timereference == TimeConverter.TimeReference.RELATIVE) {
          if (this._xAxis.zeroTime > 0) {
            xpos = this._xAxis.markers[i].xposition + this._xAxis.zeroTime;
          } else {
            mustdraw = false;
          }
        } else {
          xpos = this._xAxis.markers[i].xposition;
        }
        if (xpos > Bottomleft.x - 100 * pixelSize && xpos < TopRight.x + 100 * pixelSize && mustdraw) {
          let p = YGraph.IRLPointToViewPort(w, new pointXY(xpos, 0));
          let xxCenter = p.X >> 0;
          let yyCenter = w.Height - w.Bmargin - this._xAxis.markers[i].yposition * dy >> 0;
          let strValue = this._xAxis.markers[i].text.replace("\\n", "\n");
          let now = new Date();
          if (strValue.indexOf("$") >= 0) {
            if (strValue.indexOf("$MARKERTIME$") >= 0) {
              let s = this._xAxis.markers[i].timereference == TimeConverter.TimeReference.RELATIVE ? TimeConverter.secTimeSpanToString(this._xAxis.markers[i].xposition, pixelSize) : this.TimeToAutoSting(this._xAxis.markers[i].xposition, this.mainViewPort, scaleX);
              strValue = strValue.replace("$MARKERTIME$", s);
            }
            if (strValue.indexOf("$VALUE") >= 0) {
              for (let j = 0; j < this._series.length; j++) {
                if (!this._series[j].disabled) {
                  let pt = this._series[j].findClosestValue(xpos, true);
                  let st = pt != null ? pt.y.toFixed(0) : "--";
                  strValue = strValue.replace("$VALUE" + (j + 1).toString() + "$", st);
                } else {
                  strValue = strValue.replace("$VALUE" + (j + 1).toString() + "$", "");
                }
              }
            }
            if (strValue.indexOf("$UNIT") >= 0) {
              for (let j = 0; j < this._series.length; j++) {
                if (!this._series[j].disabled) {
                  strValue = strValue.replace("$UNIT" + (j + 1).toString() + "$", this._series[j].unit);
                } else {
                  strValue = strValue.replace("$UNIT" + (j + 1).toString() + "$", "");
                }
              }
            }
            if (strValue.indexOf("$LEGEND") >= 0) {
              for (let j = 0; j < this._series.length; j++) {
                if (!this._series[j].disabled) {
                  strValue = strValue.replace("$LEGEND" + (j + 1).toString() + "$", this._series[j].legend);
                } else {
                  strValue = strValue.replace("$LEGEND" + (j + 1).toString() + "$", "");
                }
              }
            }
            if (this._xAxis.markers[i].PatchTextCallback != null) {
              strValue = this._xAxis.markers[i].PatchTextCallback(strValue);
            }
          }
          let ssize = g.MeasureString(strValue, this._xAxis.markers[i].font, 1e4);
          let labelWidth = ssize.width + 2 * this._xAxis.markers[i].padding + this._xAxis.markers[i].borderthickness;
          let labelHeight = ssize.height + 2 * this._xAxis.markers[i].padding + this._xAxis.markers[i].borderthickness;
          g.FillRectangleXYHW(this._xAxis.markers[i].bgBrush, xxCenter - (labelWidth >> 1), yyCenter - (labelHeight >> 1), labelWidth >> 0, labelHeight >> 0);
          g.DrawRectangleXYHW(this._xAxis.markers[i].pen, xxCenter - (labelWidth >> 1), yyCenter - (labelHeight >> 1), labelWidth >> 0, labelHeight >> 0);
          let xText;
          switch (this._xAxis.markers[i].textAlign) {
            case Marker.TextAlign.LEFT:
              xText = xxCenter - (labelWidth >> 1) + this._xAxis.markers[i].padding;
              break;
            case Marker.TextAlign.RIGHT:
              xText = xxCenter + (labelWidth >> 1) - this._xAxis.markers[i].padding;
              break;
            default:
              xText = xxCenter;
              break;
          }
          g.DrawStringPF(strValue, this._xAxis.markers[i].font, this._xAxis.markers[i].font.brush, new PointF(xText, yyCenter), this._xAxis.markers[i].stringFormat);
          g.DrawLineXY(this._xAxis.markers[i].pen, xxCenter, w.Tmargin >> 0, xxCenter, yyCenter - (labelHeight >> 1));
          g.DrawLineXY(this._xAxis.markers[i].pen, xxCenter, yyCenter + (labelHeight >> 1), xxCenter, w.Height - w.Bmargin >> 0);
          if (this._xAxis.markers[i].arrowSize > 0) {
            if (this._xAxis.markers[i].yposition > 25) {
              let triangle = [
                new PointF(xxCenter - this._xAxis.markers[i].arrowSize, yyCenter + (labelHeight >> 1)),
                new PointF(xxCenter + this._xAxis.markers[i].arrowSize, yyCenter + (labelHeight >> 1)),
                new PointF(xxCenter, yyCenter + (labelHeight >> 1) + this._xAxis.markers[i].arrowSize)
              ];
              g.FillPolygon(this._xAxis.markers[i].arrowBrush, triangle);
            }
            if (this._xAxis.markers[i].yposition < 75) {
              let triangle = [
                new PointF(xxCenter - this._xAxis.markers[i].arrowSize, yyCenter + (labelHeight >> 1)),
                new PointF(xxCenter + this._xAxis.markers[i].arrowSize, yyCenter + (labelHeight >> 1)),
                new PointF(xxCenter, yyCenter - (labelHeight >> 1) - this._xAxis.markers[i].arrowSize)
              ];
              g.FillPolygon(this._xAxis.markers[i].arrowBrush, triangle);
            }
          }
        }
      }
    }
    g.ResetClip();
  }
  DrawDataPanels(w, g, scaleX, scalesY, viewPortWidth, viewPortHeight) {
    if (this._dataPanels.length == 0)
      return;
    g.SetClip(new YRectangle(w.Lmargin, w.Tmargin, w.Width - w.Rmargin - w.Lmargin, w.Height - w.Bmargin - w.Tmargin));
    for (let i = 0; i < this._dataPanels.length; i++) {
      if (this._dataPanels[i].enabled) {
        let p = this._dataPanels[i];
        if (p.yScaleIndex < scalesY.length) {
          let AvailableWidth = w.Width - 2 * p.padding - p.borderthickness;
          if (AvailableWidth < 100)
            AvailableWidth = 100;
          let ssize = g.MeasureString(p.text, p.font, AvailableWidth >> 0);
          let panelWidth = ssize.width + 2 * p.padding + p.borderthickness;
          let panelHeight = ssize.height + 2 * p.padding + p.borderthickness;
          let x = 0;
          switch (p.horizontalPosition) {
            case DataPanel.HorizontalPosition.LEFTBORDER:
              x = w.Lmargin;
              break;
            case DataPanel.HorizontalPosition.RIGHTBORDER:
              x = w.Width - w.Rmargin;
              break;
            case DataPanel.HorizontalPosition.ABSOLUTEX:
              let delta = scaleX.max - scaleX.min;
              let XZoom = delta / (w.Width - w.Lmargin - w.Rmargin);
              x = w.Lmargin + Math.round((p.AbsoluteXposition - scaleX.min) / XZoom) >> 0;
              break;
          }
          let y = 0;
          switch (p.verticalPosition) {
            case DataPanel.VerticalPosition.TOPBORDER:
              y = w.Tmargin;
              break;
            case DataPanel.VerticalPosition.BOTTOMBORDER:
              y = w.Height - w.Bmargin;
              break;
            case DataPanel.VerticalPosition.ABSOLUTEY:
              y = w.Height - w.Bmargin - Math.round((p.AbsoluteYposition - scalesY[p.yScaleIndex].IRLy) * scalesY[p.yScaleIndex].zoom) >> 0;
              break;
          }
          switch (p.panelHrzAlign) {
            case DataPanel.HorizontalAlign.LEFTOF:
              x -= panelWidth + p.horizontalMargin;
              break;
            case DataPanel.HorizontalAlign.RIGHTOF:
              x += p.horizontalMargin;
              break;
            default:
              x -= panelWidth / 2;
              break;
          }
          switch (p.panelVrtAlign) {
            case DataPanel.VerticalAlign.ABOVE:
              y -= panelHeight + p.verticalMargin;
              break;
            case DataPanel.VerticalAlign.BELOW:
              y += p.verticalMargin;
              break;
            default:
              y -= panelHeight / 2;
              break;
          }
          g.FillRectangleXYHW(p.bgBrush, x >> 0, y >> 0, panelWidth >> 0, panelHeight >> 0);
          if (p.borderthickness > 0)
            g.DrawRectangleXYHW(p.pen, x >> 0, y >> 0, panelWidth >> 0, panelHeight >> 0);
          let sf = new YStringFormat(16384);
          switch (p.panelTextAlign) {
            case MessagePanel.TextAlign.LEFT:
              sf.LineAlignment = 0;
              sf.Alignment = 0;
              break;
            case MessagePanel.TextAlign.RIGHT:
              sf.LineAlignment = 2;
              sf.Alignment = 2;
              break;
            default:
              sf.LineAlignment = 1;
              sf.Alignment = 1;
              break;
          }
          let rect = new YRectangle(x + p.padding + p.borderthickness / 2 >> 0, y + p.padding + p.borderthickness / 2 >> 0, ssize.width >>= 1, (ssize.height >> 0) + 1);
          g.DrawStringRect(p.text, p.font, p.font.brush, rect, sf);
        } else {
          throw new RangeError("Cannot renderer data panel #" + i.toString() + ", no such Y axis");
        }
      }
    }
  }
  Render(g, UIw, UIh) {
    if (UIw < 50 || UIh < 50)
      return 0;
    let lastLmargin = this.mainViewPort.Lmargin;
    let lastRmargin = this.mainViewPort.Rmargin;
    this.mainViewPort.Width = UIw;
    this.mainViewPort.Height = UIh;
    this.mainViewPort.Lmargin = 0;
    this.mainViewPort.Rmargin = 0;
    g.SmoothingMode = YSmoothingMode.HighQuality;
    let yMarginOffset = 5;
    for (let i = 0; i < this._yAxes.length; i++) {
      if (this._yAxes[i].visible) {
        let s = g.MeasureString("8", this._yAxes[i].font, 1e5);
        let o = (s.height + 1) / 2 >> 0;
        if (yMarginOffset < o)
          yMarginOffset = o;
      }
    }
    this.mainViewPort.Tmargin = this._xAxis.position == XAxis.VrtPosition.TOP ? 0 : yMarginOffset;
    this.mainViewPort.Bmargin = this._xAxis.position == XAxis.VrtPosition.BOTTOM ? 0 : yMarginOffset;
    if (!this._legendPanel.overlap)
      this.drawLegendPanel(g, UIw, UIh, this.mainViewPort);
    this.drawAnnotationPanels(g, this._annotationPanels, UIw, UIh, false, this.mainViewPort);
    if (this.mainViewPort.Bmargin == 0)
      this.mainViewPort.Bmargin = 5;
    if (this.mainViewPort.Tmargin == 0)
      this.mainViewPort.Tmargin = 5;
    let h = this.DrawXAxis(this.mainViewPort, g, this._xAxis, true);
    if (this._xAxis.position == XAxis.VrtPosition.TOP)
      this.mainViewPort.Tmargin += h;
    else
      this.mainViewPort.Bmargin += h;
    this.mainViewPort.IRLx = this._xAxis.min;
    let M;
    for (let i = 0; i < this._yAxes.length; i++) {
      M = MinMaxHandler.DefaultValue();
      for (let k = 0; k < this._series.length; k++) {
        if (this._series[k].yAxisIndex == i && !this._series[k].disabled) {
          for (let j = 0; j < this._series[k].segments.length; j++) {
            M = MinMaxHandler.Combine(M, YGraph.FindMinMax(this._xAxis.min, this._xAxis.max, this._series[k].segments[j].data, this._series[k].segments[j].count));
          }
        }
      }
      this._yAxes[i].computeStartAndStep(M);
    }
    if (this.mainViewPort.Lmargin == 0)
      this.mainViewPort.Lmargin = 5;
    if (this.mainViewPort.Rmargin == 0)
      this.mainViewPort.Rmargin = 5;
    for (let i = 0; i < this._yAxes.length; i++) {
      let sw = YGraph.DrawYAxis(this.mainViewPort, g, this._yAxes[i], 0, true);
      this.mainViewPort.Lmargin += this._yAxes[i].position == YAxis.HrzPosition.LEFT ? sw : 0;
      this.mainViewPort.Rmargin += this._yAxes[i].position == YAxis.HrzPosition.RIGHT ? sw : 0;
    }
    if (this._navigator.enabled) {
      if (lastLmargin != this.mainViewPort.Lmargin || lastRmargin != this.mainViewPort.Rmargin) {
        this.navigatorCache = null;
      }
      let nh = this._navigator.relativeheight * this.UIContainer.height / 100 >> 0;
      let ofset = this.xAxis.position == XAxis.VrtPosition.BOTTOM ? h : 0;
      this._navigator.setPosition(UIw, UIh, this.mainViewPort.Lmargin, this.mainViewPort.Rmargin, this.mainViewPort.Height - nh - this.mainViewPort.Bmargin + ofset, this.mainViewPort.Bmargin - ofset);
      this.mainViewPort.Bmargin += nh;
    }
    if (this.lastTopMargin != this.mainViewPort.Tmargin || this.lastBottomMargin != this.mainViewPort.Bmargin) {
      this._bgBrush = null;
      this.lastTopMargin = this.mainViewPort.Tmargin;
      this.lastBottomMargin = this.mainViewPort.Bmargin;
    }
    if (this._bgBrush == null) {
      this._bgBrush = new YLinearGradientBrush(this._bgColor2, this._bgColor1);
    }
    g.FillRectangleXYHW(this._bgBrush, this.mainViewPort.Lmargin, this.mainViewPort.Tmargin, this.mainViewPort.Width - this.mainViewPort.Rmargin - this.mainViewPort.Lmargin, this.mainViewPort.Height - this.mainViewPort.Bmargin - this.mainViewPort.Tmargin);
    if (this._borderThickness > 0) {
      if (this._borderPen == null)
        this._borderPen = new YPen(this._borderColor, this._borderThickness);
      g.DrawRectangleXYHW(this._borderPen, this.mainViewPort.Lmargin, this.mainViewPort.Tmargin, this.mainViewPort.Width - this.mainViewPort.Rmargin - this.mainViewPort.Lmargin, this.mainViewPort.Height - this.mainViewPort.Bmargin - this.mainViewPort.Tmargin);
    }
    g.SetClip(new YRectangle(this.mainViewPort.Lmargin, this.mainViewPort.Tmargin, this.mainViewPort.Width - this.mainViewPort.Rmargin - this.mainViewPort.Lmargin, this.mainViewPort.Height - this.mainViewPort.Bmargin - this.mainViewPort.Tmargin));
    for (let i = 0; i < this._yAxes.length; i++) {
      this.DrawYAxisZones(this.mainViewPort, g, this._yAxes[i]);
    }
    this.DrawXAxisZones(this.mainViewPort, g, this.xAxis);
    g.ResetClip();
    this.DrawXAxis(this.mainViewPort, g, this._xAxis, false);
    let leftOffset = 0;
    let rightOffset = 0;
    for (let i = 0; i < this._yAxes.length; i++) {
      let ww = YGraph.DrawYAxis(this.mainViewPort, g, this._yAxes[i], this._yAxes[i].position == YAxis.HrzPosition.LEFT ? leftOffset : rightOffset, false);
      if (this._yAxes[i].position == YAxis.HrzPosition.LEFT)
        leftOffset += ww;
      if (this._yAxes[i].position == YAxis.HrzPosition.RIGHT)
        rightOffset += ww;
    }
    g.SetClip(new YRectangle(this.mainViewPort.Lmargin, this.mainViewPort.Tmargin, this.mainViewPort.Width - this.mainViewPort.Rmargin - this.mainViewPort.Lmargin, this.mainViewPort.Height - this.mainViewPort.Bmargin - this.mainViewPort.Tmargin));
    this.mainViewPort.zoomx = (this.mainViewPort.Width - this.mainViewPort.Lmargin - this.mainViewPort.Rmargin) / (this._xAxis.max - this._xAxis.min);
    let mypenb = null;
    let lineCount = 0;
    let pointCount = 0;
    let Bottomleft = YGraph.ViewPortPointToIRL(this.mainViewPort, new Point(this.mainViewPort.Lmargin, this.mainViewPort.Height - this.mainViewPort.Bmargin));
    let TopRight = YGraph.ViewPortPointToIRL(this.mainViewPort, new Point(this.mainViewPort.Width - this.mainViewPort.Rmargin, this.mainViewPort.Tmargin));
    let xTimeStart = Bottomleft.x;
    let xTimeEnd = TopRight.x;
    for (let k = 0; k < this._series.length; k++) {
      if (this._series[k].visible && !this._series[k].disabled) {
        let scaleIndex = this._series[k].yAxisIndex;
        mypenb = this._series[k].pen;
        this.mainViewPort.IRLy = this._yAxes[scaleIndex].startStopStep.dataMin;
        this._yAxes[this._series[k].yAxisIndex].IRLy = this.mainViewPort.IRLy;
        let delta = this._yAxes[scaleIndex].startStopStep.dataMax - this._yAxes[scaleIndex].startStopStep.dataMin;
        if (delta == 0) {
          delta = 1;
          this.mainViewPort.IRLy -= delta / 2;
        }
        this.mainViewPort.zoomy = (this.mainViewPort.Height - this.mainViewPort.Tmargin - this.mainViewPort.Bmargin) / delta;
        this._yAxes[this._series[k].yAxisIndex].zoom = this.mainViewPort.zoomy;
        g.comment("** main view-port series " + k.toString());
        for (let i = 0; i < this._series[k].segments.length; i++) {
          lineCount += YGraph.DoSegmentRendering(this.mainViewPort, g, mypenb, this._series[k].segments[i].data, this._series[k].segments[i].count, xTimeStart, xTimeEnd);
          pointCount += this._series[k].segments[i].count;
        }
      }
    }
    g.ResetClip();
    if (this._navigator.enabled) {
      g.comment("** navigator **");
      let v = this._navigator.viewport;
      let range = MinMaxHandler.DefaultValue();
      for (let i = 0; i < this._series.length; i++) {
        if (!this._series[i].disabled)
          range = MinMaxHandler.Combine(range, this._series[i].timeRange);
      }
      this._navigator.Xrange = MinMaxHandler.extend(range, 1.05);
      v.zoomx = (v.Width - v.Lmargin - v.Rmargin) / (this._navigator.Xrange.Max - this._navigator.Xrange.Min);
      if (this.lastPointCount != pointCount && !this.mainViewPort.Capture && !this._navigator.Capture || this.navigatorCache == null || g instanceof YGraphicsSVG) {
        g.comment("Redraw navigator");
        if (this.navigatorCache != null)
          this.navigatorCache = null;
        this.navigatorCache = document.createElement("canvas");
        this.navigatorCache.width = v.Width;
        this.navigatorCache.height = v.Height;
        this.lastPointCount = pointCount;
        let ng;
        if (g instanceof YGraphicsSVG) {
          ng = g;
        } else {
          ng = new YGraphics(this.navigatorCache, v.Width, v.Height, 90);
        }
        ng.FillRectangleXYHW(this._navigator.bgBrush, v.Lmargin, v.Tmargin, v.Width - v.Rmargin - v.Lmargin, v.Height - v.Bmargin - v.Tmargin);
        if (this.xAxis.zones.length > 0 && this._navigator.showXAxisZones) {
          let delta = this._navigator.Xrange.Max - this._navigator.Xrange.Min;
          let XZoom = delta / (v.Width - v.Lmargin - v.Rmargin);
          for (let i = 0; i < this.xAxis.zones.length; i++) {
            if (this.xAxis.zones[i].visible) {
              let min = this.xAxis.zones[i].min;
              let max = this.xAxis.zones[i].max;
              if (isNaN(min))
                min = this._navigator.Xrange.Min;
              if (isNaN(max))
                max = this._navigator.Xrange.Max;
              ng.FillRectangleXYHW(this.xAxis.zones[i].zoneBrush, v.Lmargin + (min - this._navigator.Xrange.Min) / XZoom >> 0, v.Tmargin >> 0, (max - min) / XZoom >> 0, v.Height - v.Bmargin - v.Tmargin);
            }
          }
        }
        if (MinMaxHandler.isDefined(this._navigator.Xrange) && this._navigator.Xrange.Max - this._navigator.Xrange.Min > 0) {
          let Min;
          let Max;
          v.IRLx = this._navigator.Xrange.Min;
          let dontSticktoBorderZoom = 4 / (v.Height - v.Bmargin - v.Tmargin);
          let Bottomleft2 = YGraph.ViewPortPointToIRL(v, new Point(v.Lmargin, v.Height - v.Bmargin));
          let TopRight2 = YGraph.ViewPortPointToIRL(v, new Point(v.Width - v.Rmargin, v.Tmargin));
          let xTimeStart2 = Bottomleft2.x;
          let xTimeEnd2 = TopRight2.x;
          if (this._navigator.yAxisHandling == Navigator.YAxisHandling.AUTO) {
            for (let k = 0; k < this._series.length; k++) {
              if (!this._series[k].disabled) {
                ng.comment("** navigator series " + k.toString());
                v.IRLy = this._series[k].valueRange.Min;
                let yAxisIndex = this._series[k].yAxisIndex;
                mypenb = this._series[k].navigatorpen;
                Min = this._series[k].valueRange.Min;
                Max = this._series[k].valueRange.Max;
                if (Max - Min <= 0) {
                  v.IRLy = Min - 0.5;
                  Max = Min + 0.5;
                } else {
                  let delta = Max - Min;
                  Min -= delta * dontSticktoBorderZoom;
                  Max += delta * dontSticktoBorderZoom;
                }
                v.IRLy = Min;
                v.zoomy = (v.Height - v.Tmargin - v.Bmargin) / (Max - Min);
                for (let i = 0; i < this._series[k].segments.length; i++) {
                  lineCount += YGraph.DoSegmentRendering(v, ng, mypenb, this._series[k].segments[i].data, this._series[k].segments[i].count, xTimeStart2, xTimeEnd2);
                }
              }
            }
          } else {
            for (let i = 0; i < this._yAxes.length; i++) {
              let Yrange = MinMaxHandler.DefaultValue();
              for (let j = 0; j < this._series.length; j++) {
                if (this._series[j].yAxisIndex == i && !this._series[j].disabled) {
                  Yrange = MinMaxHandler.Combine(Yrange, this._series[j].valueRange);
                }
              }
              Yrange = MinMaxHandler.extend(Yrange, 1 + 2 * dontSticktoBorderZoom);
              Min = this._yAxes[i].min;
              if (isNaN(Min))
                Min = Yrange.Min;
              Max = this._yAxes[i].max;
              if (isNaN(Max))
                Max = Yrange.Max;
              if (Number.isNaN(Min)) {
                Min = 0;
                Max = 1;
              }
              if (Max - Min <= 0) {
                Min = Min - 0.5;
                Max = Min + 0.5;
              }
              v.IRLy = Min;
              v.zoomy = (v.Height - v.Tmargin - v.Bmargin) / (Max - Min);
              for (let j = 0; j < this._series.length; j++) {
                if (this._series[j].yAxisIndex == i && !this._series[j].disabled && this._series[j].visible) {
                  ng.comment("** navigator series " + j.toString());
                  mypenb = this._series[j].navigatorpen;
                  for (let k = 0; k < this._series[j].segments.length; k++) {
                    lineCount += YGraph.DoSegmentRendering(v, ng, mypenb, this._series[j].segments[k].data, this._series[j].segments[k].count, xTimeStart2, xTimeEnd2);
                  }
                }
              }
            }
          }
          for (let i = 0; i < this._xAxis.markers.length; i++) {
            if (this._xAxis.markers[i].enabled) {
              let p = YGraph.IRLPointToViewPort(v, new pointXY(this._xAxis.markers[i].xposition + (this._xAxis.markers[i].timereference == TimeConverter.TimeReference.RELATIVE ? this._xAxis.zeroTime : 0), 0));
              ng.DrawLineXY(this._xAxis.markers[i].navigatorpen, p.X, v.Tmargin, p.X, v.Height - v.Bmargin);
            }
          }
          if (this._navigator.borderThickness > 0) {
            ng.DrawLineXY(this._navigator.borderPen, v.Lmargin, v.Tmargin, v.Width - v.Rmargin, v.Tmargin);
          }
          this.DrawMonitorXAxis(v, ng, this._navigator.Xrange, this.xAxis.labelFormat);
          this._navigator.setIRLPosition(v.IRLx, v.IRLy, v.zoomx, v.zoomy);
        }
        if (!(g instanceof YGraphicsSVG))
          ng.Dispose();
      }
      let cacheW = v.Width - v.Rmargin - v.Lmargin + 1;
      let cacheH = v.Width - v.Rmargin - v.Lmargin + 1;
      let rectsrc = new YRectangle(v.Lmargin, v.Tmargin - 1, cacheW, cacheH);
      let rectdst = new YRectangle(v.Lmargin, v.Tmargin, cacheW, cacheH);
      g.SetClip(rectdst);
      if (!(g instanceof YGraphicsSVG)) {
        g.DrawImage(this.navigatorCache, rectsrc, rectdst, 2);
      }
      if (this._navigator.borderThickness > 0) {
        g.DrawLineXY(this._navigator.borderPen, v.Lmargin + 1, v.Tmargin, v.Lmargin + 1, v.Height - v.Bmargin - 1);
        g.DrawLineXY(this._navigator.borderPen, v.Width - v.Rmargin, v.Tmargin, v.Width - v.Rmargin, v.Height - v.Bmargin - 1);
        g.DrawLineXY(this._navigator.borderPen, v.Lmargin + 1, v.Tmargin, v.Width - v.Rmargin, v.Tmargin);
      }
      let IRLCursorStart = YGraph.ViewPortPointToIRL(this.mainViewPort, new Point(this.mainViewPort.Lmargin, 0));
      let IRLCursorEnd = YGraph.ViewPortPointToIRL(this.mainViewPort, new Point(this.mainViewPort.Width - this.mainViewPort.Rmargin, 0));
      let CursorStart = YGraph.IRLPointToViewPort(this._navigator.viewport, new pointXY(IRLCursorStart.x, 0));
      let CursorEnd = YGraph.IRLPointToViewPort(this._navigator.viewport, new pointXY(IRLCursorEnd.x, 0));
      g.FillRectangle(this._navigator.cursorBrush, new YRectangle(CursorStart.X - 1, v.Tmargin, CursorEnd.X - CursorStart.X + 2, v.Height - v.Bmargin - v.Tmargin - 1));
      g.DrawLineXY(this._navigator.cursorBorderPen, CursorStart.X - 1 >> 0, v.Tmargin >> 0, CursorStart.X - 1 >> 0, v.Height - v.Bmargin - 1);
      g.DrawLineXY(this._navigator.cursorBorderPen, CursorEnd.X + 1 >> 0, v.Tmargin >> 0, CursorEnd.X + 1 >> 0, v.Height - v.Bmargin - 1);
      g.ResetClip();
    }
    if (this._legendPanel.overlap)
      this.drawLegendPanel(g, UIw, UIh, this.mainViewPort);
    g.TextRenderingHint = YTextRenderingHint.SingleBitPerPixelGridFit;
    this.DrawMarkers(this.mainViewPort, g, this.xAxis, UIw, UIh);
    this.drawAnnotationPanels(g, this._annotationPanels, UIw, UIh, true, this.mainViewPort);
    this.DrawDataPanels(this.mainViewPort, g, this.xAxis, this._yAxes, UIw, UIh);
    this.DrawDataTracker(g, UIw, UIh, this.xAxis);
    this.DrawMessagePanels(g, UIw, UIh);
    return 0;
  }
  KeyDown(sender, e) {
    if (e.code == "ArrowLeft") {
      let delta = 0.2 * (this._xAxis.max - this._xAxis.min);
      this._xAxis.set_minMax(this._xAxis.min - delta, this._xAxis.max - delta);
      this.redraw();
    }
    if (e.code == "ArrowRight") {
      let delta = 0.2 * (this._xAxis.max - this._xAxis.min);
      this._xAxis.set_minMax(this._xAxis.min + delta, this._xAxis.max + delta);
      this.redraw();
    }
    if (e.code == "ArrowUp") {
      this.mouseWheel(new Point(this.UIContainer.width >> 1, this.UIContainer.height >> 1), 10);
    }
    if (e.code == "ArrowDown") {
      this.mouseWheel(new Point(this.UIContainer.width >> 1, this.UIContainer.height >> 1), -10);
    }
  }
  mouseWheel(pos, delta) {
    let ZoomFactor = Math.pow(1.25, delta / 120);
    let NextZoomX = this.mainViewPort.zoomx * ZoomFactor;
    if (NextZoomX > this.mainViewPort.zoomx && NextZoomX > 1e3)
      return;
    let currentRange = this._xAxis.max - this._xAxis.min;
    if (currentRange / ZoomFactor > 25 * 365 * 86400)
      return;
    this.mainViewPort.IRLx += (pos.X - this.mainViewPort.Lmargin) / this.mainViewPort.zoomx - (pos.X - this.mainViewPort.Lmargin) / NextZoomX;
    let range = this._xAxis.max - this._xAxis.min;
    this._xAxis.set_minMax(this.mainViewPort.IRLx, this.mainViewPort.IRLx + range / ZoomFactor);
    this.mainViewPort.zoomx = NextZoomX;
    this.redraw();
  }
  mouseWheelEvent(sender, e) {
    let p = this.Scr2ElmMatrix.multiplyByV(Vector3.FromXYCoord(e.pageX, e.pageY)).toPoint();
    let eX = p.X;
    let eY = p.Y;
    this.mouseWheel(new Point(eX, eY), e.deltaY > 0 ? -150 : 150);
    e.preventDefault();
  }
};
YGraph._defaultVerticalDragZoomEnabled = false;
YGraph.captureCursor = null;

// obj/rdonly/Renderer/YSolidGauge.js
var DrawPrameters = class {
  constructor() {
    this.outerRadius = 0;
    this.innerRadius = 0;
    this.angleStart = 0;
    this.angleEnd = 0;
    this.ycenter = 0;
    this.xcenter = 0;
    this.heightTop = 0;
    this.heightBottom = 0;
    this.valueRectangle = new YRectangle(0, 0, 0, 0);
    this.valueFormat = new YStringFormat(16384);
    this.minValueRectangle = new YRectangle(0, 0, 0, 0);
    this.minValueFormat = new YStringFormat(16384);
    this.maxValueRectangle = new YRectangle(0, 0, 0, 0);
    this.maxValueFormat = new YStringFormat(16384);
    this.minValue = "";
    this.maxValue = "";
    this.value = "";
  }
};
var YSolidGauge = class extends YDataRenderer {
  constructor(UIContainer, mode, logFunction) {
    super(UIContainer, logFunction);
    this._shownValue = 0;
    this._min = 0;
    this._max = 100;
    this.SegmentMaxLength = 8;
    this.mainViewPort = new ViewPortSettings();
    this._borderpen = null;
    this._borderColor = YColor.Black;
    this._bgBrush = null;
    this._backgroundColor1 = YColor.FromArgb(255, 240, 240, 240);
    this._backgroundColor2 = YColor.FromArgb(255, 200, 200, 200);
    this._borderThickness = 5;
    this._valueFormater = null;
    this._minmaxFormater = null;
    this._thickness = 25;
    this._maxSpeed = 0.1;
    this._value = 0;
    this._color1 = YColor.Green;
    this._color2 = YColor.Red;
    this._font = null;
    this._minMaxFont = null;
    this._showMinMax = true;
    this._path = null;
    this.lastDrawParameters = new DrawPrameters();
    this._displayMode = YSolidGauge.DisplayMode.DISPLAY90;
    this._minMaxFont = new YFont(this, this, Math.min(UIContainer.width, UIContainer.height) / 15, () => {
      this.FontsizeChange(this._minMaxFont);
    });
    this._displayMode = mode;
    this._font = new YFont(this, this, Math.min(UIContainer.width, UIContainer.height) / 5, null);
    this.resizeRule = Proportional.ResizeRule.RELATIVETOBOTH;
    let g = new YGraphics(UIContainer, UIContainer.width, UIContainer.height, 90);
    let p = this.ComputeDrawParameters(g, UIContainer.width, UIContainer.height, this.mainViewPort);
    g.Dispose();
  }
  get min() {
    return this._min;
  }
  set min(value) {
    if (value >= this._max && !YDataRenderer.minMaxCheckDisabled) {
      throw new RangeError("Min cannot be greater than max (" + this._max.toString() + ")");
    }
    this._min = value;
    if (this._shownValue < this._min)
      this._shownValue = this._min;
    this.redraw();
  }
  get max() {
    return this._max;
  }
  set max(value) {
    if (value <= this._min && !YDataRenderer.minMaxCheckDisabled) {
      throw new RangeError("Max cannot be less than min (" + this._min.toString() + ")");
    }
    this._max = value;
    if (this._shownValue > this._max)
      this._shownValue = this._max;
    this.redraw();
  }
  get borderpen() {
    if (this._borderpen == null) {
      this._borderpen = new YPen(this._borderColor, this._borderThickness);
      this._borderpen.startCap = 1;
      this._borderpen.endCap = 1;
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
      throw new RangeError("Thickness must be a positive value");
    this._borderThickness = value;
    this._borderpen = null;
    this._path = null;
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
    this._path = null;
    this.redraw();
  }
  get maxSpeed() {
    return this._maxSpeed;
  }
  set maxSpeed(value) {
    if (value <= 0)
      throw new RangeError("Speed must be a positive value");
    this._maxSpeed = value;
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
  get font() {
    return this._font;
  }
  get minMaxFont() {
    return this._minMaxFont;
  }
  get showMinMax() {
    return this._showMinMax;
  }
  set showMinMax(value) {
    this._showMinMax = value;
    this._path = null;
    this.redraw();
  }
  get displayMode() {
    return this._displayMode;
  }
  set displayMode(value) {
    this._displayMode = value;
    this._path = null;
    this._bgBrush = null;
    this.redraw();
  }
  FontsizeChange(source) {
    this._path = null;
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
    let ValueRectangle = new YRectangle(0, 0, 0, 0);
    let valueFormat = new YStringFormat(16384);
    let innerRadius = 0;
    let minMaxHeight = 0;
    let s1 = new YSizeF(null, "");
    let s2 = new YSizeF(null, "");
    this.lastDrawParameters.value = this._valueFormater == null ? this._value.toFixed(0) : this._valueFormater(this, this._value);
    if (this._showMinMax) {
      this.lastDrawParameters.minValue = this._minmaxFormater == null ? this._min.toFixed(0) : this._minmaxFormater(this, this._min);
      this.lastDrawParameters.maxValue = this._minmaxFormater == null ? this._max.toFixed(0) : this._minmaxFormater(this, this._max);
      s1 = g.MeasureString(this.lastDrawParameters.minValue, this._minMaxFont, 1e5);
      s2 = g.MeasureString(this.lastDrawParameters.maxValue, this._minMaxFont, 1e5);
      this.lastDrawParameters.minValueFormat = new YStringFormat(16384);
      this.lastDrawParameters.maxValueFormat = new YStringFormat(16384);
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
        ValueRectangle = new YRectangle(xcenter - innerRadius >> 0, ycenter - innerRadius >> 0, innerRadius >> 0, innerRadius >> 0);
        valueFormat.Alignment = 2;
        valueFormat.LineAlignment = 2;
        if (this._showMinMax) {
          this.lastDrawParameters.minValueRectangle = new YRectangle(xcenter - (outerRadius + innerRadius + s1.width) / 2 >> 0, ycenter + this._borderThickness >> 0, s1.width + 1 >> 0, minMaxHeight + 1 >> 0);
          this.lastDrawParameters.minValueFormat.Alignment = 0;
          this.lastDrawParameters.minValueFormat.LineAlignment = 0;
          this.lastDrawParameters.maxValueRectangle = new YRectangle(xcenter + this._borderThickness >> 0, ycenter - outerRadius + (outerRadius - innerRadius - s2.width) / 2 >> 0, minMaxHeight + 1 >> 0, s2.width + 1 >> 0);
          this.lastDrawParameters.maxValueFormat.Alignment = 0;
          this.lastDrawParameters.maxValueFormat.LineAlignment = 0;
          this.lastDrawParameters.maxValueFormat.FormatFlags = 2;
        }
        break;
      case YSolidGauge.DisplayMode.DISPLAY180:
        h = h - minMaxHeight;
        let s0 = new YSizeF(null, "");
        s0 = g.MeasureString(this.lastDrawParameters.value, this._font, 1e5);
        outerRadius = w / 2 - this.borderThickness;
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
        ValueRectangle = new YRectangle(xcenter - innerRadius >> 0, ycenter + this._borderThickness + minMaxHeight - s0.height >> 0, 2 * innerRadius >> 0, s0.height + 1 >> 0);
        valueFormat.Alignment = 1;
        valueFormat.LineAlignment = 2;
        if (this._showMinMax) {
          this.lastDrawParameters.minValueRectangle = new YRectangle(xcenter - (outerRadius + innerRadius + s1.width) / 2 >> 0, ycenter + this._borderThickness >> 0, s1.width + 1 >> 0, minMaxHeight + 1 >> 0);
          this.lastDrawParameters.minValueFormat.Alignment = 0;
          this.lastDrawParameters.minValueFormat.LineAlignment = 0;
          this.lastDrawParameters.maxValueRectangle = new YRectangle(xcenter + (outerRadius + innerRadius - s2.width) / 2 >> 0, ycenter + this._borderThickness >> 0, s2.width + 1 >> 0, minMaxHeight + 1 >> 0);
          this.lastDrawParameters.maxValueFormat.Alignment = 0;
          this.lastDrawParameters.maxValueFormat.LineAlignment = 0;
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
        ValueRectangle = new YRectangle(xcenter - innerRadius >> 0, ycenter - innerRadius >> 0, 2 * innerRadius >> 0, 2 * innerRadius >> 0);
        valueFormat.Alignment = 1;
        valueFormat.LineAlignment = 1;
        if (this._showMinMax) {
          this.lastDrawParameters.minValueRectangle = new YRectangle(xcenter + this._borderThickness >> 0, ycenter + (innerRadius + innerRadius + s1.height) / 2 >> 0, s1.width + 1 >> 0, s1.height + 1 >> 0);
          this.lastDrawParameters.minValueFormat.Alignment = 0;
          this.lastDrawParameters.minValueFormat.LineAlignment = 0;
          this.lastDrawParameters.maxValueRectangle = new YRectangle(xcenter + (innerRadius + innerRadius + s1.height) / 2 >> 0, ycenter + this._borderThickness >> 0, s2.height + 1 >> 0, s2.width + 1 >> 0);
          this.lastDrawParameters.maxValueFormat.Alignment = 0;
          this.lastDrawParameters.maxValueFormat.LineAlignment = 0;
          this.lastDrawParameters.maxValueFormat.FormatFlags = 2;
        }
        break;
      case YSolidGauge.DisplayMode.DISPLAY360:
        outerRadius = w;
        if (outerRadius > h / 0.85 / 2)
          outerRadius = h / 0.85 / 2;
        if (outerRadius > w / 2)
          outerRadius = w / 2;
        this.lastDrawParameters.heightTop = outerRadius;
        this.lastDrawParameters.heightBottom = outerRadius * 0.7;
        ycenter = mainViewPort.Tmargin + outerRadius + this._borderThickness / 2;
        angleStart = -Math.PI / 4;
        angleEnd = 5 * Math.PI / 4;
        innerRadius = outerRadius * (100 - this._thickness) / 100;
        ValueRectangle = new YRectangle(xcenter - innerRadius >> 0, ycenter - innerRadius >> 0, 2 * innerRadius >> 0, 2 * innerRadius >> 0);
        valueFormat.Alignment = 1;
        valueFormat.LineAlignment = 1;
        if (this._showMinMax) {
          let dx = Math.abs(innerRadius * Math.cos(angleStart));
          let dy = innerRadius * Math.abs(Math.sin(angleStart)) + 2 * Math.abs((outerRadius - innerRadius) * Math.sin(angleStart) / 3);
          this.lastDrawParameters.minValueRectangle = new YRectangle(xcenter - dx >> 0, ycenter + dy - minMaxHeight / 2 >> 0, s1.width + 1 >> 0, minMaxHeight + 1 >> 0);
          this.lastDrawParameters.minValueFormat.Alignment = 0;
          this.lastDrawParameters.minValueFormat.LineAlignment = 1;
          this.lastDrawParameters.maxValueRectangle = new YRectangle(xcenter + dx - s2.width >> 0, ycenter + dy - minMaxHeight / 2 >> 0, s2.width + 1 >> 0, minMaxHeight + 1 >> 0);
          this.lastDrawParameters.maxValueFormat.Alignment = 0;
          this.lastDrawParameters.maxValueFormat.LineAlignment = 1;
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
    this.mainViewPort = new ViewPortSettings();
    g.SmoothingMode = YSmoothingMode.HighQuality;
    g.TextRenderingHint = YTextRenderingHint.AntiAlias;
    this.drawAnnotationPanels(g, this._annotationPanels, w, h, false, this.mainViewPort);
    let p = this.ComputeDrawParameters(g, w, h, this.mainViewPort);
    if (this._path == null) {
      let outterlength = 2 * p.outerRadius * Math.PI * (p.angleEnd - p.angleStart) / (2 * Math.PI);
      let stepCount = outterlength / this.SegmentMaxLength >> 0;
      let stepsize = (p.angleEnd - p.angleStart) / stepCount;
      this._path = new Array(2 * (stepCount + 1));
      let n = 0;
      for (let i = 0; i <= stepCount; i++) {
        let a = p.angleStart + i * stepsize;
        this._path[n++] = new PointF(p.xcenter + p.outerRadius * Math.cos(a), p.ycenter - p.outerRadius * Math.sin(a));
      }
      for (let i = stepCount; i >= 0; i--) {
        let a = p.angleStart + i * stepsize;
        this._path[n++] = new PointF(p.xcenter + p.innerRadius * Math.cos(a), p.ycenter - p.innerRadius * Math.sin(a));
      }
    }
    if (this._bgBrush == null) {
      this._bgBrush = new YLinearGradientBrush(this._backgroundColor1, this._backgroundColor2);
    }
    if (this._borderpen == null) {
      this._borderpen = new YPen(this._borderColor, this._borderThickness);
      this._borderpen.linejoin = YPen.LineJoin.Round;
    }
    g.FillPolygon(this._bgBrush, this._path);
    if (this._shownValue != this._value) {
      let step = this._maxSpeed * (this._max - this._min) / 100;
      if (Math.abs(this._value - this._shownValue) < step) {
        this._shownValue = this._value;
      } else if (this._shownValue < this._value) {
        this._shownValue += step;
      } else {
        this._shownValue -= step;
      }
    }
    let v = this._shownValue;
    if (v >= this._min) {
      if (v > this._max)
        v = this._max;
      let valueFactor = (v - this._min) / (this._max - this.min);
      let angleValue = p.angleStart + (p.angleEnd - p.angleStart) * valueFactor;
      let outterlength = 2 * p.outerRadius * Math.PI * (angleValue - p.angleStart) / (2 * Math.PI);
      let stepCount = outterlength / this.SegmentMaxLength >> 0;
      let stepsize = (angleValue - p.angleStart) / stepCount;
      let pt = new Array(2 * (stepCount + 1));
      let n = 0;
      for (let i = 0; i <= stepCount; i++) {
        let a = p.angleEnd - i * stepsize;
        pt[n++] = new PointF(p.xcenter + p.outerRadius * Math.cos(a), p.ycenter - p.outerRadius * Math.sin(a));
      }
      for (let i = stepCount; i >= 0; i--) {
        let a = p.angleEnd - i * stepsize;
        pt[n++] = new PointF(p.xcenter + p.innerRadius * Math.cos(a), p.ycenter - p.innerRadius * Math.sin(a));
      }
      let b;
      if (this._color1 == this._color2) {
        b = new YSolidBrush(this._color1);
      } else {
        let A1 = this._color1.alpha;
        let H1 = this._color1.hue;
        let S1 = this._color1.saturation;
        let L1 = this._color1.luminosity;
        let A2 = this._color2.alpha;
        let H2 = this._color2.hue;
        let S2 = this._color2.saturation;
        let L2 = this._color2.luminosity;
        let A = Math.round(A1 + (A2 - A1) * valueFactor) >> 0 & 255;
        let H;
        if (Math.abs(H2 - H1) <= 127) {
          H = H1 + (H2 - H1) * valueFactor >> 0;
        } else {
          H = H1 + 256 + (H2 - H1 + 256) * valueFactor >> 0;
          if (H > 256)
            H -= 256;
        }
        let S = S1 + (S2 - S1) * valueFactor >> 0;
        let L = L1 + (L2 - L1) * valueFactor >> 0;
        b = new YSolidBrush(new YColor(true, A, H, S, L));
      }
      g.FillPolygon(b, pt);
    }
    if (this._borderThickness > 0)
      g.DrawPolygon(this._borderpen, this._path);
    g.DrawStringRect(this.lastDrawParameters.value, this._font, this._font.brush, p.valueRectangle, p.valueFormat);
    if (this._showMinMax) {
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
};
(function(YSolidGauge2) {
  class DisplayModeEnumItem extends YEnumItem {
    constructor(value, humanreadable, container) {
      super(value, humanreadable, DisplayMode);
    }
  }
  YSolidGauge2.DisplayModeEnumItem = DisplayModeEnumItem;
  class DisplayMode extends YEnum {
  }
  DisplayMode.DISPLAY90 = new DisplayModeEnumItem("DISPLAY90", "90\xB0");
  DisplayMode.DISPLAY180 = new DisplayModeEnumItem("DISPLAY180", "180\xB0");
  DisplayMode.DISPLAY270 = new DisplayModeEnumItem("DISPLAY270", "270\xB0");
  DisplayMode.DISPLAY360 = new DisplayModeEnumItem("DISPLAY360", "360\xB0");
  YSolidGauge2.DisplayMode = DisplayMode;
})(YSolidGauge || (YSolidGauge = {}));

// obj/rdonly/Api/yocto_api.js
var __awaiter = function(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
var YAPI_SUCCESS = 0;
var YAPI_NOT_INITIALIZED = -1;
var YAPI_INVALID_ARGUMENT = -2;
var YAPI_NOT_SUPPORTED = -3;
var YAPI_DEVICE_NOT_FOUND = -4;
var YAPI_VERSION_MISMATCH = -5;
var YAPI_DEVICE_BUSY = -6;
var YAPI_TIMEOUT = -7;
var YAPI_IO_ERROR = -8;
var YAPI_NO_MORE_DATA = -9;
var YAPI_EXHAUSTED = -10;
var YAPI_DOUBLE_ACCES = -11;
var YAPI_UNAUTHORIZED = -12;
var YAPI_RTC_NOT_READY = -13;
var YAPI_FILE_NOT_FOUND = -14;
var YAPI_SSL_ERROR = -15;
var YAPI_INVALID_INT = 2147483647;
var YAPI_INVALID_UINT = -1;
var YAPI_INVALID_LONG = 9223372036854776e3;
var YAPI_INVALID_DOUBLE = -Number.MAX_VALUE;
var YAPI_INVALID_STRING = "!INVALID!";
var YAPI_MIN_DOUBLE = -Number.MAX_VALUE;
var YAPI_MAX_DOUBLE = Number.MAX_VALUE;
var Y_FUNCTIONDESCRIPTOR_INVALID = YAPI_INVALID_STRING;
var Y_DETECT_NONE = 0;
var Y_DETECT_USB = 1;
var Y_DETECT_NET = 2;
var Y_DETECT_ALL = Y_DETECT_USB | Y_DETECT_NET;
var DEFAULT_DEVICE_LIST_VALIDITY_MS = 1e4;
var DEFAULT_NETWORK_TIMEOUT_MS = 2e4;
var YOCTO_CALIB_TYPE_OFS = 30;
var NOTIFY_NETPKT_CONFCHGYDX = "s";
var NOTIFY_NETPKT_FLUSHV2YDX = "t";
var NOTIFY_NETPKT_FUNCV2YDX = "u";
var NOTIFY_NETPKT_TIMEV2YDX = "v";
var NOTIFY_NETPKT_DEVLOGYDX = "w";
var NOTIFY_NETPKT_TIMEVALYDX = "x";
var NOTIFY_NETPKT_FUNCVALYDX = "y";
var NOTIFY_NETPKT_TIMEAVGYDX = "z";
var NOTIFY_NETPKT_STOP = 10;
var NOTIFY_V2_6RAWBYTES = 1;
var NOTIFY_V2_TYPEDDATA = 2;
var PUBVAL_LEGACY = 0;
var PUBVAL_1RAWBYTE = 1;
var PUBVAL_2RAWBYTES = 2;
var PUBVAL_3RAWBYTES = 3;
var PUBVAL_4RAWBYTES = 4;
var PUBVAL_5RAWBYTES = 5;
var PUBVAL_6RAWBYTES = 6;
var PUBVAL_C_LONG = 7;
var PUBVAL_C_FLOAT = 8;
var PUBVAL_YOCTO_FLOAT_E3 = 9;
var YOCTO_PUBVAL_SIZE = 6;
var YOCTO_HASH_BUF_SIZE = 28;
var YOCTO_BASETYPE_FUNCTION = 0;
var YOCTO_BASETYPE_SENSOR = 1;
var Y_BASETYPES = {
  Function: YOCTO_BASETYPE_FUNCTION,
  Sensor: YOCTO_BASETYPE_SENSOR
};
var YErrorMsg = class {
  constructor(msg = "") {
    this.msg = msg;
  }
};
var YoctoError = class extends Error {
  constructor(...params) {
    super(...params);
    this.errorMsg = this.name;
    this.name = "YoctoError";
    if ("captureStackTrace" in Error) {
      Error.captureStackTrace(this, YoctoError);
    }
  }
};
var Y_MD5Ctx = class {
  constructor() {
    this.buf = new Uint32Array(4);
    this.bits = new Uint32Array(2);
    this.inBuf = new ArrayBuffer(64);
    this.in8 = new Uint8Array(this.inBuf);
    this.in32 = new Uint32Array(this.inBuf);
    this.in32[0] = 1;
    this.bigEndian = this.in8[0] != 1;
    this.buf[0] = 1732584193 >>> 0;
    this.buf[1] = 4023233417 >>> 0;
    this.buf[2] = 2562383102 >>> 0;
    this.buf[3] = 271733878 >>> 0;
    this.bits[0] = 0;
    this.bits[1] = 0;
  }
  _byteReverseIn() {
    for (let i = 0; i < 16; i++) {
      let a = this.in32[i];
      this.in32[i] = (a >>> 24 | (a & 255) << 24 | (a & 16711680) >>> 8 | (a & 65280) << 8) >>> 0;
    }
  }
  _transform() {
    let F1 = (x, y, z) => (z ^ x & (y ^ z)) >>> 0;
    let F2 = (x, y, z) => F1(z, x, y);
    let F3 = (x, y, z) => (x ^ y ^ z) >>> 0;
    let F4 = (x, y, z) => (y ^ (x | ~z)) >>> 0;
    let MD5STEP = (f, w, x, y, z, data, s) => {
      w = w + f(x, y, z) + (data >>> 0) >>> 0;
      w = (w << s >>> 0 | w >>> 32 - s) >>> 0;
      return w + x >>> 0;
    };
    let a = this.buf[0];
    let b = this.buf[1];
    let c = this.buf[2];
    let d = this.buf[3];
    let dataIn = this.in32;
    a = MD5STEP(F1, a, b, c, d, dataIn[0] + 3614090360, 7);
    d = MD5STEP(F1, d, a, b, c, dataIn[1] + 3905402710, 12);
    c = MD5STEP(F1, c, d, a, b, dataIn[2] + 606105819, 17);
    b = MD5STEP(F1, b, c, d, a, dataIn[3] + 3250441966, 22);
    a = MD5STEP(F1, a, b, c, d, dataIn[4] + 4118548399, 7);
    d = MD5STEP(F1, d, a, b, c, dataIn[5] + 1200080426, 12);
    c = MD5STEP(F1, c, d, a, b, dataIn[6] + 2821735955, 17);
    b = MD5STEP(F1, b, c, d, a, dataIn[7] + 4249261313, 22);
    a = MD5STEP(F1, a, b, c, d, dataIn[8] + 1770035416, 7);
    d = MD5STEP(F1, d, a, b, c, dataIn[9] + 2336552879, 12);
    c = MD5STEP(F1, c, d, a, b, dataIn[10] + 4294925233, 17);
    b = MD5STEP(F1, b, c, d, a, dataIn[11] + 2304563134, 22);
    a = MD5STEP(F1, a, b, c, d, dataIn[12] + 1804603682, 7);
    d = MD5STEP(F1, d, a, b, c, dataIn[13] + 4254626195, 12);
    c = MD5STEP(F1, c, d, a, b, dataIn[14] + 2792965006, 17);
    b = MD5STEP(F1, b, c, d, a, dataIn[15] + 1236535329, 22);
    a = MD5STEP(F2, a, b, c, d, dataIn[1] + 4129170786, 5);
    d = MD5STEP(F2, d, a, b, c, dataIn[6] + 3225465664, 9);
    c = MD5STEP(F2, c, d, a, b, dataIn[11] + 643717713, 14);
    b = MD5STEP(F2, b, c, d, a, dataIn[0] + 3921069994, 20);
    a = MD5STEP(F2, a, b, c, d, dataIn[5] + 3593408605, 5);
    d = MD5STEP(F2, d, a, b, c, dataIn[10] + 38016083, 9);
    c = MD5STEP(F2, c, d, a, b, dataIn[15] + 3634488961, 14);
    b = MD5STEP(F2, b, c, d, a, dataIn[4] + 3889429448, 20);
    a = MD5STEP(F2, a, b, c, d, dataIn[9] + 568446438, 5);
    d = MD5STEP(F2, d, a, b, c, dataIn[14] + 3275163606, 9);
    c = MD5STEP(F2, c, d, a, b, dataIn[3] + 4107603335, 14);
    b = MD5STEP(F2, b, c, d, a, dataIn[8] + 1163531501, 20);
    a = MD5STEP(F2, a, b, c, d, dataIn[13] + 2850285829, 5);
    d = MD5STEP(F2, d, a, b, c, dataIn[2] + 4243563512, 9);
    c = MD5STEP(F2, c, d, a, b, dataIn[7] + 1735328473, 14);
    b = MD5STEP(F2, b, c, d, a, dataIn[12] + 2368359562, 20);
    a = MD5STEP(F3, a, b, c, d, dataIn[5] + 4294588738, 4);
    d = MD5STEP(F3, d, a, b, c, dataIn[8] + 2272392833, 11);
    c = MD5STEP(F3, c, d, a, b, dataIn[11] + 1839030562, 16);
    b = MD5STEP(F3, b, c, d, a, dataIn[14] + 4259657740, 23);
    a = MD5STEP(F3, a, b, c, d, dataIn[1] + 2763975236, 4);
    d = MD5STEP(F3, d, a, b, c, dataIn[4] + 1272893353, 11);
    c = MD5STEP(F3, c, d, a, b, dataIn[7] + 4139469664, 16);
    b = MD5STEP(F3, b, c, d, a, dataIn[10] + 3200236656, 23);
    a = MD5STEP(F3, a, b, c, d, dataIn[13] + 681279174, 4);
    d = MD5STEP(F3, d, a, b, c, dataIn[0] + 3936430074, 11);
    c = MD5STEP(F3, c, d, a, b, dataIn[3] + 3572445317, 16);
    b = MD5STEP(F3, b, c, d, a, dataIn[6] + 76029189, 23);
    a = MD5STEP(F3, a, b, c, d, dataIn[9] + 3654602809, 4);
    d = MD5STEP(F3, d, a, b, c, dataIn[12] + 3873151461, 11);
    c = MD5STEP(F3, c, d, a, b, dataIn[15] + 530742520, 16);
    b = MD5STEP(F3, b, c, d, a, dataIn[2] + 3299628645, 23);
    a = MD5STEP(F4, a, b, c, d, dataIn[0] + 4096336452, 6);
    d = MD5STEP(F4, d, a, b, c, dataIn[7] + 1126891415, 10);
    c = MD5STEP(F4, c, d, a, b, dataIn[14] + 2878612391, 15);
    b = MD5STEP(F4, b, c, d, a, dataIn[5] + 4237533241, 21);
    a = MD5STEP(F4, a, b, c, d, dataIn[12] + 1700485571, 6);
    d = MD5STEP(F4, d, a, b, c, dataIn[3] + 2399980690, 10);
    c = MD5STEP(F4, c, d, a, b, dataIn[10] + 4293915773, 15);
    b = MD5STEP(F4, b, c, d, a, dataIn[1] + 2240044497, 21);
    a = MD5STEP(F4, a, b, c, d, dataIn[8] + 1873313359, 6);
    d = MD5STEP(F4, d, a, b, c, dataIn[15] + 4264355552, 10);
    c = MD5STEP(F4, c, d, a, b, dataIn[6] + 2734768916, 15);
    b = MD5STEP(F4, b, c, d, a, dataIn[13] + 1309151649, 21);
    a = MD5STEP(F4, a, b, c, d, dataIn[4] + 4149444226, 6);
    d = MD5STEP(F4, d, a, b, c, dataIn[11] + 3174756917, 10);
    c = MD5STEP(F4, c, d, a, b, dataIn[2] + 718787259, 15);
    b = MD5STEP(F4, b, c, d, a, dataIn[9] + 3951481745, 21);
    this.buf[0] = (this.buf[0] + a & 4294967295) >>> 0;
    this.buf[1] = (this.buf[1] + b & 4294967295) >>> 0;
    this.buf[2] = (this.buf[2] + c & 4294967295) >>> 0;
    this.buf[3] = (this.buf[3] + d & 4294967295) >>> 0;
  }
  addData(buf) {
    let len = buf.length;
    let pos = 0;
    let t = this.bits[0];
    this.bits[0] = t + (len << 3) >>> 0;
    if (this.bits[0] < t) {
      this.bits[1]++;
    }
    this.bits[1] += len >>> 29;
    t = t >>> 3 & 63;
    while (pos < len) {
      while (pos < len && t < 64) {
        this.in8[t++] = buf[pos++];
      }
      if (t < 64)
        return;
      if (this.bigEndian)
        this._byteReverseIn();
      this._transform();
      t = 0;
    }
  }
  calculate() {
    let t = this.bits[0] >>> 3 & 63;
    this.in8[t++] = 128;
    if (t > 56) {
      while (t < 64) {
        this.in8[t++] = 0;
      }
      if (this.bigEndian)
        this._byteReverseIn();
      this._transform();
      for (t = 0; t < 14; t++) {
        this.in32[t] = 0;
      }
    } else {
      while (t < 56) {
        this.in8[t++] = 0;
      }
      if (this.bigEndian)
        this._byteReverseIn();
    }
    this.in32[14] = this.bits[0];
    this.in32[15] = this.bits[1];
    this._transform();
    let res = new Uint8Array(16);
    for (t = 0; t < 16; t++) {
      res[t] = this.buf[t >>> 2] >>> 8 * (t & 3) & 255;
    }
    return res;
  }
};
var YFunctionType = class {
  constructor(yapi, classname) {
    this._yapi = yapi;
    this._className = classname;
    this._connectedFns = {};
    this._requestedFns = {};
    this._hwIdByName = {};
    this._nameByHwId = {};
    this._valueByHwId = {};
    this._baseType = 0;
  }
  imm_reindexFunction(str_hwid, str_name, str_val, int_basetype) {
    let currname = this._nameByHwId[str_hwid];
    let res = false;
    if (currname == void 0 || currname == "") {
      if (str_name != "") {
        this._nameByHwId[str_hwid] = str_name;
        res = true;
      }
    } else if (currname != str_name) {
      if (this._hwIdByName[currname] == str_hwid)
        delete this._hwIdByName[currname];
      if (str_name != "") {
        this._nameByHwId[str_hwid] = str_name;
      } else {
        delete this._nameByHwId[str_hwid];
      }
      res = true;
    }
    if (str_name != "") {
      this._hwIdByName[str_name] = str_hwid;
    }
    if (str_val) {
      this._valueByHwId[str_hwid] = str_val;
    } else {
      if (this._valueByHwId[str_hwid] == void 0) {
        this._valueByHwId[str_hwid] = "";
      }
    }
    if (int_basetype) {
      if (this._baseType == 0) {
        this._baseType = int_basetype;
      }
    }
    return res;
  }
  imm_forgetFunction(str_hwid) {
    let currname = this._nameByHwId[str_hwid];
    if (currname != void 0) {
      if (currname != "" && this._hwIdByName[currname] == str_hwid) {
        delete this._hwIdByName[currname];
      }
      delete this._nameByHwId[str_hwid];
    }
    if (this._valueByHwId[str_hwid] != void 0) {
      delete this._valueByHwId[str_hwid];
    }
    let con_fn = this._connectedFns[str_hwid];
    if (con_fn) {
      this._requestedFns[str_hwid] = con_fn;
      delete this._connectedFns[str_hwid];
    }
  }
  imm_resolve(str_func) {
    let res;
    let dotpos = str_func.indexOf(".");
    if (dotpos < 0) {
      res = this._hwIdByName[str_func];
      if (res != void 0) {
        return {
          errorType: YAPI_SUCCESS,
          errorMsg: "no error",
          result: String(res)
        };
      }
      dotpos = str_func.length;
      str_func += "." + this._className.substr(0, 1).toLowerCase() + this._className.substr(1);
    }
    if (this._valueByHwId[str_func] != void 0) {
      return {
        errorType: YAPI_SUCCESS,
        errorMsg: "no error",
        result: String(str_func)
      };
    }
    let serial = "";
    let funcid;
    if (dotpos > 0) {
      let devid = str_func.substr(0, dotpos);
      funcid = str_func.substr(dotpos + 1);
      let dev = this._yapi.imm_getDevice(devid);
      if (!dev) {
        return {
          errorType: YAPI_DEVICE_NOT_FOUND,
          errorMsg: "Device [" + devid + "] not online",
          result: ""
        };
      }
      serial = dev.imm_getSerialNumber();
      res = serial + "." + funcid;
      if (this._valueByHwId[res] != void 0) {
        return {
          errorType: YAPI_SUCCESS,
          errorMsg: "no error",
          result: String(res)
        };
      }
      let i, nfun = dev.imm_functionCount();
      for (i = 0; i < nfun; i++) {
        res = serial + "." + dev.imm_functionId(i);
        let name = this._nameByHwId[res];
        if (name != void 0 && name == funcid) {
          return {
            errorType: YAPI_SUCCESS,
            errorMsg: "no error",
            result: String(res)
          };
        }
      }
    } else {
      funcid = str_func.substr(1);
      for (let hwid_str in this._connectedFns) {
        let pos = hwid_str.indexOf(".");
        let str_function = hwid_str.substr(pos + 1);
        if (str_function == funcid) {
          return {
            errorType: YAPI_SUCCESS,
            errorMsg: "no error",
            result: String(hwid_str)
          };
        }
      }
    }
    return {
      errorType: YAPI_DEVICE_NOT_FOUND,
      errorMsg: "No function [" + funcid + "] found on device [" + serial + "]",
      result: ""
    };
  }
  imm_getFriendlyName(str_func) {
    let resolved = this.imm_resolve(str_func);
    let name;
    if (resolved.errorType != YAPI_SUCCESS) {
      return resolved;
    }
    let hwId = resolved.result;
    if (this._className == "Module") {
      let friend = hwId;
      name = this._nameByHwId[friend];
      if (name != void 0 && name != "") {
        friend = this._nameByHwId[friend];
      }
      return {
        errorType: YAPI_SUCCESS,
        errorMsg: "no error",
        result: String(friend)
      };
    } else {
      let pos = hwId.indexOf(".");
      let str_serialMod = hwId.substr(0, pos);
      let str_friendModFull = this._yapi.imm_getFriendlyNameFunction("Module", str_serialMod).result;
      let int_friendModDot = str_friendModFull.indexOf(".");
      let str_friendMod = int_friendModDot > 0 ? str_friendModFull.substr(0, int_friendModDot) : str_friendModFull;
      let str_friendFunc = hwId.substr(pos + 1);
      name = this._nameByHwId[hwId];
      if (name != void 0 && name != "") {
        str_friendFunc = name;
      }
      return {
        errorType: YAPI_SUCCESS,
        errorMsg: "no error",
        result: String(str_friendMod + "." + str_friendFunc)
      };
    }
  }
  imm_setFunction(str_func, obj_func) {
    let funres = this.imm_resolve(str_func);
    if (funres.result) {
      this._connectedFns[funres.result] = obj_func;
    } else {
      this._requestedFns[str_func] = obj_func;
    }
  }
  imm_getFunction(str_func) {
    let funres = this.imm_resolve(str_func);
    if (funres.errorType == YAPI_SUCCESS) {
      let conn_fn = this._connectedFns[funres.result];
      if (conn_fn != void 0) {
        return conn_fn;
      }
      let req_fn = this._requestedFns[str_func];
      if (req_fn != void 0) {
        this._connectedFns[funres.result] = req_fn;
        delete this._requestedFns[str_func];
      }
      return req_fn;
    } else {
      return this._requestedFns[str_func];
    }
  }
  imm_setFunctionValue(str_hwid, str_pubval) {
    let currval = this._valueByHwId[str_hwid];
    if (!(currval == void 0) && currval == str_pubval) {
      return false;
    }
    this._valueByHwId[str_hwid] = str_pubval;
    return true;
  }
  imm_getFunctionValue(str_hwid) {
    return this._valueByHwId[str_hwid];
  }
  imm_getBaseType() {
    return this._baseType;
  }
  imm_matchBaseType(baseclass) {
    return baseclass == YOCTO_BASETYPE_FUNCTION || baseclass == this._baseType;
  }
  imm_getFirstHardwareId() {
    let res = null;
    for (res in this._valueByHwId)
      break;
    return res;
  }
  imm_getNextHardwareId(str_hwid) {
    for (let iter_hwid in this._valueByHwId) {
      if (str_hwid == "!")
        return iter_hwid;
      if (str_hwid == iter_hwid)
        str_hwid = "!";
    }
    return null;
  }
};
var YHTTPBody = class {
  constructor(str_fname, bin_data, fun_progressCb) {
    this.fname = str_fname;
    this.data = bin_data;
    this.progressCb = fun_progressCb;
  }
};
var YHTTPRequest = class {
  constructor(bin_res, int_errType = YAPI_SUCCESS, str_errMsg = "no error") {
    this.devUrl = null;
    this.obj_result = null;
    this.asyncId = 0;
    this.acceptor = null;
    this.toBeSent = null;
    this.sendPos = 0;
    this.progressCb = null;
    this.timeoutId = null;
    this.sendTimeoutId = null;
    this.next = null;
    this._creat = "";
    this._sent = "";
    this.bin_result = bin_res;
    this.errorType = int_errType;
    this.errorMsg = str_errMsg;
  }
};
var YFuncRequest = class {
  constructor(obj_res, int_errType = YAPI_SUCCESS, str_errMsg = "no error") {
    this.errorType = int_errType;
    this.errorMsg = str_errMsg;
    this.obj_result = obj_res;
  }
};
var YDataStream = class {
  constructor(obj_parent, obj_dataset, encoded) {
    this._runNo = 0;
    this._utcStamp = 0;
    this._nCols = 0;
    this._nRows = 0;
    this._startTime = 0;
    this._duration = 0;
    this._dataSamplesInterval = 0;
    this._firstMeasureDuration = 0;
    this._columnNames = [];
    this._functionId = "";
    this._isClosed = false;
    this._isAvg = false;
    this._minVal = 0;
    this._avgVal = 0;
    this._maxVal = 0;
    this._caltyp = 0;
    this._calpar = [];
    this._calraw = [];
    this._calref = [];
    this._values = [];
    this._isLoaded = false;
    this.DATA_INVALID = YAPI_INVALID_DOUBLE;
    this.DURATION_INVALID = YAPI_INVALID_DOUBLE;
    this._parent = obj_parent;
    this._yapi = this._parent._yapi;
    this.imm_calhdl = null;
    if (typeof obj_dataset != "undefined") {
      this.imm_initFromDataSet(obj_dataset, encoded);
    }
  }
  imm_initFromDataSet(dataset, encoded) {
    let val;
    let i;
    let maxpos;
    let ms_offset;
    let samplesPerHour;
    let fRaw;
    let fRef;
    let iCalib = [];
    this._runNo = encoded[0] + (encoded[1] << 16);
    this._utcStamp = encoded[2] + (encoded[3] << 16);
    val = encoded[4];
    this._isAvg = (val & 256) == 0;
    samplesPerHour = val & 255;
    if ((val & 256) != 0) {
      samplesPerHour = samplesPerHour * 3600;
    } else {
      if ((val & 512) != 0) {
        samplesPerHour = samplesPerHour * 60;
      }
    }
    this._dataSamplesInterval = 3600 / samplesPerHour;
    ms_offset = encoded[6];
    if (ms_offset < 1e3) {
      this._startTime = this._utcStamp + ms_offset / 1e3;
    } else {
      this._startTime = this._utcStamp - this._dataSamplesInterval;
    }
    this._firstMeasureDuration = encoded[5];
    if (!this._isAvg) {
      this._firstMeasureDuration = this._firstMeasureDuration / 1e3;
    }
    val = encoded[7];
    this._isClosed = val != 65535;
    if (val == 65535) {
      val = 0;
    }
    this._nRows = val;
    if (this._nRows > 0) {
      if (this._firstMeasureDuration > 0) {
        this._duration = this._firstMeasureDuration + (this._nRows - 1) * this._dataSamplesInterval;
      } else {
        this._duration = this._nRows * this._dataSamplesInterval;
      }
    } else {
      this._duration = 0;
    }
    iCalib = dataset.imm_get_calibration();
    this._caltyp = iCalib[0];
    if (this._caltyp != 0) {
      this.imm_calhdl = this._yapi.imm_getCalibrationHandler(this._caltyp);
      maxpos = iCalib.length;
      this._calpar.length = 0;
      this._calraw.length = 0;
      this._calref.length = 0;
      i = 1;
      while (i < maxpos) {
        this._calpar.push(iCalib[i]);
        i = i + 1;
      }
      i = 1;
      while (i + 1 < maxpos) {
        fRaw = iCalib[i];
        fRaw = fRaw / 1e3;
        fRef = iCalib[i + 1];
        fRef = fRef / 1e3;
        this._calraw.push(fRaw);
        this._calref.push(fRef);
        i = i + 2;
      }
    }
    this._functionId = dataset.imm_get_functionId();
    if (this._isAvg) {
      this._columnNames.length = 0;
      this._columnNames.push(this._functionId + "_min");
      this._columnNames.push(this._functionId + "_avg");
      this._columnNames.push(this._functionId + "_max");
      this._nCols = 3;
    } else {
      this._columnNames.length = 0;
      this._columnNames.push(this._functionId);
      this._nCols = 1;
    }
    if (this._nRows > 0) {
      this._avgVal = this.imm_decodeAvg(encoded[8] + ((encoded[9] ^ 32768) << 16), 1);
      this._minVal = this.imm_decodeVal(encoded[10] + (encoded[11] << 16));
      this._maxVal = this.imm_decodeVal(encoded[12] + (encoded[13] << 16));
    }
    return 0;
  }
  imm_parseStream(sdata) {
    let idx;
    let udat = [];
    let dat = [];
    if (this._isLoaded && !this._isClosed) {
      return YAPI_SUCCESS;
    }
    if (sdata.length == 0) {
      this._nRows = 0;
      return YAPI_SUCCESS;
    }
    udat = this._yapi.imm_decodeWords(this._parent.imm_json_get_string(sdata));
    this._values.length = 0;
    idx = 0;
    if (this._isAvg) {
      while (idx + 3 < udat.length) {
        dat.length = 0;
        if (udat[idx] == 65535 && udat[idx + 1] == 65535) {
          dat.push(NaN);
          dat.push(NaN);
          dat.push(NaN);
        } else {
          dat.push(this.imm_decodeVal(udat[idx + 2] + (udat[idx + 3] << 16)));
          dat.push(this.imm_decodeAvg(udat[idx] + ((udat[idx + 1] ^ 32768) << 16), 1));
          dat.push(this.imm_decodeVal(udat[idx + 4] + (udat[idx + 5] << 16)));
        }
        idx = idx + 6;
        this._values.push(dat.slice());
      }
    } else {
      while (idx + 1 < udat.length) {
        dat.length = 0;
        if (udat[idx] == 65535 && udat[idx + 1] == 65535) {
          dat.push(NaN);
        } else {
          dat.push(this.imm_decodeAvg(udat[idx] + ((udat[idx + 1] ^ 32768) << 16), 1));
        }
        this._values.push(dat.slice());
        idx = idx + 2;
      }
    }
    this._nRows = this._values.length;
    this._isLoaded = true;
    return YAPI_SUCCESS;
  }
  imm_wasLoaded() {
    return this._isLoaded;
  }
  imm_get_url() {
    let url;
    url = "logger.json?id=" + this._functionId + "&run=" + String(Math.round(this._runNo)) + "&utc=" + String(Math.round(this._utcStamp));
    return url;
  }
  imm_get_baseurl() {
    let url;
    url = "logger.json?id=" + this._functionId + "&run=" + String(Math.round(this._runNo)) + "&utc=";
    return url;
  }
  imm_get_urlsuffix() {
    let url;
    url = String(Math.round(this._utcStamp));
    return url;
  }
  loadStream() {
    return __awaiter(this, void 0, void 0, function* () {
      return this.imm_parseStream(yield this._parent._download(this.imm_get_url()));
    });
  }
  imm_decodeVal(w) {
    let val;
    val = w;
    val = val / 1e3;
    if (this._caltyp != 0) {
      if (this.imm_calhdl != null) {
        val = this.imm_calhdl(val, this._caltyp, this._calpar, this._calraw, this._calref);
      }
    }
    return val;
  }
  imm_decodeAvg(dw, count) {
    let val;
    val = dw;
    val = val / 1e3;
    if (this._caltyp != 0) {
      if (this.imm_calhdl != null) {
        val = this.imm_calhdl(val, this._caltyp, this._calpar, this._calraw, this._calref);
      }
    }
    return val;
  }
  isClosed() {
    return __awaiter(this, void 0, void 0, function* () {
      return this._isClosed;
    });
  }
  get_runIndex() {
    return __awaiter(this, void 0, void 0, function* () {
      return this._runNo;
    });
  }
  get_startTime() {
    return __awaiter(this, void 0, void 0, function* () {
      return this._utcStamp - (Date.now() / 1e3 >> 0);
    });
  }
  get_startTimeUTC() {
    return __awaiter(this, void 0, void 0, function* () {
      return Math.round(this._startTime);
    });
  }
  get_realStartTimeUTC() {
    return __awaiter(this, void 0, void 0, function* () {
      return this._startTime;
    });
  }
  get_dataSamplesIntervalMs() {
    return __awaiter(this, void 0, void 0, function* () {
      return Math.round(this._dataSamplesInterval * 1e3);
    });
  }
  get_dataSamplesInterval() {
    return __awaiter(this, void 0, void 0, function* () {
      return this._dataSamplesInterval;
    });
  }
  get_firstDataSamplesInterval() {
    return __awaiter(this, void 0, void 0, function* () {
      return this._firstMeasureDuration;
    });
  }
  get_rowCount() {
    return __awaiter(this, void 0, void 0, function* () {
      if (this._nRows != 0 && this._isClosed) {
        return this._nRows;
      }
      yield this.loadStream();
      return this._nRows;
    });
  }
  get_columnCount() {
    return __awaiter(this, void 0, void 0, function* () {
      if (this._nCols != 0) {
        return this._nCols;
      }
      yield this.loadStream();
      return this._nCols;
    });
  }
  get_columnNames() {
    return __awaiter(this, void 0, void 0, function* () {
      if (this._columnNames.length != 0) {
        return this._columnNames;
      }
      yield this.loadStream();
      return this._columnNames;
    });
  }
  get_minValue() {
    return __awaiter(this, void 0, void 0, function* () {
      return this._minVal;
    });
  }
  get_averageValue() {
    return __awaiter(this, void 0, void 0, function* () {
      return this._avgVal;
    });
  }
  get_maxValue() {
    return __awaiter(this, void 0, void 0, function* () {
      return this._maxVal;
    });
  }
  get_realDuration() {
    return __awaiter(this, void 0, void 0, function* () {
      if (this._isClosed) {
        return this._duration;
      }
      return (Date.now() / 1e3 >> 0) - this._utcStamp;
    });
  }
  get_dataRows() {
    return __awaiter(this, void 0, void 0, function* () {
      if (this._values.length == 0 || !this._isClosed) {
        yield this.loadStream();
      }
      return this._values;
    });
  }
  get_data(row, col) {
    return __awaiter(this, void 0, void 0, function* () {
      if (this._values.length == 0 || !this._isClosed) {
        yield this.loadStream();
      }
      if (row >= this._values.length) {
        return YDataStream.DATA_INVALID;
      }
      if (col >= this._values[row].length) {
        return YDataStream.DATA_INVALID;
      }
      return this._values[row][col];
    });
  }
};
YDataStream.DATA_INVALID = YAPI_INVALID_DOUBLE;
YDataStream.DURATION_INVALID = YAPI_INVALID_DOUBLE;
var YDataSet = class {
  constructor(obj_parent, str_functionId = "", str_unit = "", double_startTime = 0, double_endTime = 0) {
    this._hardwareId = "";
    this._functionId = "";
    this._unit = "";
    this._bulkLoad = 0;
    this._startTimeMs = 0;
    this._endTimeMs = 0;
    this._progress = 0;
    this._calib = [];
    this._streams = [];
    this._preview = [];
    this._measures = [];
    this._summaryMinVal = 0;
    this._summaryMaxVal = 0;
    this._summaryTotalAvg = 0;
    this._summaryTotalTime = 0;
    this.DATA_INVALID = YAPI_INVALID_DOUBLE;
    this.DURATION_INVALID = YAPI_INVALID_DOUBLE;
    this.HARDWAREID_INVALID = YAPI_INVALID_STRING;
    this.FUNCTIONID_INVALID = YAPI_INVALID_STRING;
    this.UNIT_INVALID = YAPI_INVALID_STRING;
    this._summary = new YMeasure(0, 0, 0, 0, 0);
    if (str_functionId == "") {
      this._parent = obj_parent;
      this._yapi = obj_parent._yapi;
      this._startTimeMs = 0;
      this._endTimeMs = 0;
    } else {
      this._parent = obj_parent;
      this._yapi = obj_parent._yapi;
      this._functionId = str_functionId;
      this._unit = str_unit;
      this._startTimeMs = double_startTime * 1e3;
      this._endTimeMs = double_endTime * 1e3;
      this._progress = -1;
    }
  }
  imm_get_functionId() {
    return this._functionId;
  }
  imm_get_calibration() {
    return this._calib;
  }
  loadSummary(data) {
    return __awaiter(this, void 0, void 0, function* () {
      let dataRows = [];
      let tim;
      let mitv;
      let itv;
      let fitv;
      let end_;
      let nCols;
      let minCol;
      let avgCol;
      let maxCol;
      let res;
      let m_pos;
      let previewTotalTime;
      let previewTotalAvg;
      let previewMinVal;
      let previewMaxVal;
      let previewAvgVal;
      let previewStartMs;
      let previewStopMs;
      let previewDuration;
      let streamStartTimeMs;
      let streamDuration;
      let streamEndTimeMs;
      let minVal;
      let avgVal;
      let maxVal;
      let summaryStartMs;
      let summaryStopMs;
      let summaryTotalTime;
      let summaryTotalAvg;
      let summaryMinVal;
      let summaryMaxVal;
      let url;
      let strdata;
      let measure_data = [];
      if (this._progress < 0) {
        strdata = this._yapi.imm_bin2str(data);
        if (strdata == "{}") {
          this._parent._throw(YAPI_VERSION_MISMATCH, "device firmware is too old");
          return YAPI_VERSION_MISMATCH;
        }
        res = yield this._parse(strdata);
        if (res < 0) {
          return res;
        }
      }
      summaryTotalTime = 0;
      summaryTotalAvg = 0;
      summaryMinVal = YAPI_MAX_DOUBLE;
      summaryMaxVal = YAPI_MIN_DOUBLE;
      summaryStartMs = YAPI_MAX_DOUBLE;
      summaryStopMs = YAPI_MIN_DOUBLE;
      for (let ii in this._streams) {
        streamStartTimeMs = Math.round((yield this._streams[ii].get_realStartTimeUTC()) * 1e3);
        streamDuration = yield this._streams[ii].get_realDuration();
        streamEndTimeMs = streamStartTimeMs + Math.round(streamDuration * 1e3);
        if (streamStartTimeMs >= this._startTimeMs && (this._endTimeMs == 0 || streamEndTimeMs <= this._endTimeMs)) {
          previewMinVal = yield this._streams[ii].get_minValue();
          previewAvgVal = yield this._streams[ii].get_averageValue();
          previewMaxVal = yield this._streams[ii].get_maxValue();
          previewStartMs = streamStartTimeMs;
          previewStopMs = streamEndTimeMs;
          previewDuration = streamDuration;
        } else {
          if (!this._streams[ii].imm_wasLoaded()) {
            url = this._streams[ii].imm_get_url();
            data = yield this._parent._download(url);
            this._streams[ii].imm_parseStream(data);
          }
          dataRows = yield this._streams[ii].get_dataRows();
          if (dataRows.length == 0) {
            return yield this.get_progress();
          }
          tim = streamStartTimeMs;
          fitv = Math.round((yield this._streams[ii].get_firstDataSamplesInterval()) * 1e3);
          itv = Math.round((yield this._streams[ii].get_dataSamplesInterval()) * 1e3);
          nCols = dataRows[0].length;
          minCol = 0;
          if (nCols > 2) {
            avgCol = 1;
          } else {
            avgCol = 0;
          }
          if (nCols > 2) {
            maxCol = 2;
          } else {
            maxCol = 0;
          }
          previewTotalTime = 0;
          previewTotalAvg = 0;
          previewStartMs = streamEndTimeMs;
          previewStopMs = streamStartTimeMs;
          previewMinVal = YAPI_MAX_DOUBLE;
          previewMaxVal = YAPI_MIN_DOUBLE;
          m_pos = 0;
          while (m_pos < dataRows.length) {
            measure_data = dataRows[m_pos];
            if (m_pos == 0) {
              mitv = fitv;
            } else {
              mitv = itv;
            }
            end_ = tim + mitv;
            if (end_ > this._startTimeMs && (this._endTimeMs == 0 || tim < this._endTimeMs)) {
              minVal = measure_data[minCol];
              avgVal = measure_data[avgCol];
              maxVal = measure_data[maxCol];
              if (previewStartMs > tim) {
                previewStartMs = tim;
              }
              if (previewStopMs < end_) {
                previewStopMs = end_;
              }
              if (previewMinVal > minVal) {
                previewMinVal = minVal;
              }
              if (previewMaxVal < maxVal) {
                previewMaxVal = maxVal;
              }
              if (!isNaN(avgVal)) {
                previewTotalAvg = previewTotalAvg + avgVal * mitv;
                previewTotalTime = previewTotalTime + mitv;
              }
            }
            tim = end_;
            m_pos = m_pos + 1;
          }
          if (previewTotalTime > 0) {
            previewAvgVal = previewTotalAvg / previewTotalTime;
            previewDuration = (previewStopMs - previewStartMs) / 1e3;
          } else {
            previewAvgVal = 0;
            previewDuration = 0;
          }
        }
        this._preview.push(new YMeasure(previewStartMs / 1e3, previewStopMs / 1e3, previewMinVal, previewAvgVal, previewMaxVal));
        if (summaryMinVal > previewMinVal) {
          summaryMinVal = previewMinVal;
        }
        if (summaryMaxVal < previewMaxVal) {
          summaryMaxVal = previewMaxVal;
        }
        if (summaryStartMs > previewStartMs) {
          summaryStartMs = previewStartMs;
        }
        if (summaryStopMs < previewStopMs) {
          summaryStopMs = previewStopMs;
        }
        summaryTotalAvg = summaryTotalAvg + previewAvgVal * previewDuration;
        summaryTotalTime = summaryTotalTime + previewDuration;
      }
      if (this._startTimeMs == 0 || this._startTimeMs > summaryStartMs) {
        this._startTimeMs = summaryStartMs;
      }
      if (this._endTimeMs == 0 || this._endTimeMs < summaryStopMs) {
        this._endTimeMs = summaryStopMs;
      }
      if (summaryTotalTime > 0) {
        this._summary = new YMeasure(summaryStartMs / 1e3, summaryStopMs / 1e3, summaryMinVal, summaryTotalAvg / summaryTotalTime, summaryMaxVal);
      } else {
        this._summary = new YMeasure(0, 0, YAPI_INVALID_DOUBLE, YAPI_INVALID_DOUBLE, YAPI_INVALID_DOUBLE);
      }
      return yield this.get_progress();
    });
  }
  processMore(progress, data) {
    return __awaiter(this, void 0, void 0, function* () {
      let stream;
      let dataRows = [];
      let tim;
      let itv;
      let fitv;
      let avgv;
      let end_;
      let nCols;
      let minCol;
      let avgCol;
      let maxCol;
      let firstMeasure;
      let baseurl;
      let url;
      let suffix;
      let suffixes = [];
      let idx;
      let bulkFile;
      let streamStr = [];
      let urlIdx;
      let streamBin;
      if (progress != this._progress) {
        return this._progress;
      }
      if (this._progress < 0) {
        return yield this.loadSummary(data);
      }
      stream = this._streams[this._progress];
      if (!stream.imm_wasLoaded()) {
        stream.imm_parseStream(data);
      }
      dataRows = yield stream.get_dataRows();
      this._progress = this._progress + 1;
      if (dataRows.length == 0) {
        return yield this.get_progress();
      }
      tim = Math.round((yield stream.get_realStartTimeUTC()) * 1e3);
      fitv = Math.round((yield stream.get_firstDataSamplesInterval()) * 1e3);
      itv = Math.round((yield stream.get_dataSamplesInterval()) * 1e3);
      if (fitv == 0) {
        fitv = itv;
      }
      if (tim < itv) {
        tim = itv;
      }
      nCols = dataRows[0].length;
      minCol = 0;
      if (nCols > 2) {
        avgCol = 1;
      } else {
        avgCol = 0;
      }
      if (nCols > 2) {
        maxCol = 2;
      } else {
        maxCol = 0;
      }
      firstMeasure = true;
      for (let ii in dataRows) {
        if (firstMeasure) {
          end_ = tim + fitv;
          firstMeasure = false;
        } else {
          end_ = tim + itv;
        }
        avgv = dataRows[ii][avgCol];
        if (end_ > this._startTimeMs && (this._endTimeMs == 0 || tim < this._endTimeMs) && !isNaN(avgv)) {
          this._measures.push(new YMeasure(tim / 1e3, end_ / 1e3, dataRows[ii][minCol], avgv, dataRows[ii][maxCol]));
        }
        tim = end_;
      }
      if (this._bulkLoad > 0 && this._progress < this._streams.length) {
        stream = this._streams[this._progress];
        if (stream.imm_wasLoaded()) {
          return yield this.get_progress();
        }
        baseurl = stream.imm_get_baseurl();
        url = stream.imm_get_url();
        suffix = stream.imm_get_urlsuffix();
        suffixes.push(suffix);
        idx = this._progress + 1;
        while (idx < this._streams.length && suffixes.length < this._bulkLoad) {
          stream = this._streams[idx];
          if (!stream.imm_wasLoaded() && stream.imm_get_baseurl() == baseurl) {
            suffix = stream.imm_get_urlsuffix();
            suffixes.push(suffix);
            url = url + "," + suffix;
          }
          idx = idx + 1;
        }
        bulkFile = yield this._parent._download(url);
        streamStr = this._parent.imm_json_get_array(bulkFile);
        urlIdx = 0;
        idx = this._progress;
        while (idx < this._streams.length && urlIdx < suffixes.length && urlIdx < streamStr.length) {
          stream = this._streams[idx];
          if (stream.imm_get_baseurl() == baseurl && stream.imm_get_urlsuffix() == suffixes[urlIdx]) {
            streamBin = this._yapi.imm_str2bin(streamStr[urlIdx]);
            stream.imm_parseStream(streamBin);
            urlIdx = urlIdx + 1;
          }
          idx = idx + 1;
        }
      }
      return yield this.get_progress();
    });
  }
  get_privateDataStreams() {
    return __awaiter(this, void 0, void 0, function* () {
      return this._streams;
    });
  }
  get_hardwareId() {
    return __awaiter(this, void 0, void 0, function* () {
      let mo;
      if (!(this._hardwareId == "")) {
        return this._hardwareId;
      }
      mo = yield this._parent.get_module();
      this._hardwareId = (yield mo.get_serialNumber()) + "." + (yield this.get_functionId());
      return this._hardwareId;
    });
  }
  get_functionId() {
    return __awaiter(this, void 0, void 0, function* () {
      return this._functionId;
    });
  }
  get_unit() {
    return __awaiter(this, void 0, void 0, function* () {
      return this._unit;
    });
  }
  get_startTimeUTC() {
    return __awaiter(this, void 0, void 0, function* () {
      return this.imm_get_startTimeUTC();
    });
  }
  imm_get_startTimeUTC() {
    return this._startTimeMs / 1e3;
  }
  get_endTimeUTC() {
    return __awaiter(this, void 0, void 0, function* () {
      return this.imm_get_endTimeUTC();
    });
  }
  imm_get_endTimeUTC() {
    return Math.round(this._endTimeMs / 1e3);
  }
  get_progress() {
    return __awaiter(this, void 0, void 0, function* () {
      if (this._progress < 0) {
        return 0;
      }
      if (this._progress >= this._streams.length) {
        return 100;
      }
      return (1 + (1 + this._progress) * 98) / (1 + this._streams.length) >> 0;
    });
  }
  loadMore() {
    return __awaiter(this, void 0, void 0, function* () {
      let url;
      let stream;
      if (this._progress < 0) {
        url = "logger.json?id=" + this._functionId;
        if (this._startTimeMs != 0) {
          url = url + "&from=" + String(Math.round(this.imm_get_startTimeUTC()));
        }
        if (this._endTimeMs != 0) {
          url = url + "&to=" + String(Math.round(this.imm_get_endTimeUTC() + 1));
        }
      } else {
        if (this._progress >= this._streams.length) {
          return 100;
        } else {
          stream = this._streams[this._progress];
          if (stream.imm_wasLoaded()) {
            return yield this.processMore(this._progress, this._yapi.imm_str2bin(""));
          }
          url = stream.imm_get_url();
        }
      }
      try {
        return yield this.processMore(this._progress, yield this._parent._download(url));
      } catch (e) {
        return yield this.processMore(this._progress, yield this._parent._download(url));
      }
    });
  }
  get_summary() {
    return __awaiter(this, void 0, void 0, function* () {
      return this._summary;
    });
  }
  get_preview() {
    return __awaiter(this, void 0, void 0, function* () {
      return this._preview;
    });
  }
  get_measuresAt(measure) {
    return __awaiter(this, void 0, void 0, function* () {
      let startUtcMs;
      let stream;
      let dataRows = [];
      let measures = [];
      let tim;
      let itv;
      let end_;
      let nCols;
      let minCol;
      let avgCol;
      let maxCol;
      startUtcMs = measure.get_startTimeUTC() * 1e3;
      stream = null;
      for (let ii in this._streams) {
        if (Math.round((yield this._streams[ii].get_realStartTimeUTC()) * 1e3) == startUtcMs) {
          stream = this._streams[ii];
        }
      }
      if (stream == null) {
        return measures;
      }
      dataRows = yield stream.get_dataRows();
      if (dataRows.length == 0) {
        return measures;
      }
      tim = Math.round((yield stream.get_realStartTimeUTC()) * 1e3);
      itv = Math.round((yield stream.get_dataSamplesInterval()) * 1e3);
      if (tim < itv) {
        tim = itv;
      }
      nCols = dataRows[0].length;
      minCol = 0;
      if (nCols > 2) {
        avgCol = 1;
      } else {
        avgCol = 0;
      }
      if (nCols > 2) {
        maxCol = 2;
      } else {
        maxCol = 0;
      }
      for (let ii in dataRows) {
        end_ = tim + itv;
        if (end_ > this._startTimeMs && (this._endTimeMs == 0 || tim < this._endTimeMs)) {
          measures.push(new YMeasure(tim / 1e3, end_ / 1e3, dataRows[ii][minCol], dataRows[ii][avgCol], dataRows[ii][maxCol]));
        }
        tim = end_;
      }
      return measures;
    });
  }
  get_measures() {
    return __awaiter(this, void 0, void 0, function* () {
      return this._measures;
    });
  }
  _parse(str_json) {
    return __awaiter(this, void 0, void 0, function* () {
      let loadval = null;
      try {
        loadval = JSON.parse(str_json);
      } catch (err) {
      }
      if (!loadval) {
        this._progress = 0;
        return yield this.get_progress();
      }
      this._functionId = loadval.id;
      this._unit = loadval.unit;
      this._bulkLoad = loadval.bulk ? parseInt(loadval.bulk) : 0;
      if (loadval.calib) {
        this._calib = this._yapi.imm_decodeFloats(loadval.calib);
        this._calib[0] = this._calib[0] / 1e3 >> 0;
      } else {
        this._calib = this._yapi.imm_decodeWords(loadval.cal);
      }
      this._summary = new YMeasure(0, 0, 0, 0, 0);
      this._streams = [];
      this._preview = [];
      this._measures = [];
      for (let i = 0; i < loadval.streams.length; i++) {
        let stream = this._parent.imm_findDataStream(this, loadval.streams[i]);
        if (!stream)
          continue;
        let streamStartTime = (yield stream.get_realStartTimeUTC()) * 1e3;
        let streamEndTime = streamStartTime + (yield stream.get_realDuration()) * 1e3;
        if (this._startTimeMs > 0 && streamEndTime <= this._startTimeMs) {
        } else if (this._endTimeMs > 0 && streamStartTime >= this._endTimeMs) {
        } else {
          this._streams.push(stream);
        }
      }
      this._progress = 0;
      return this.get_progress();
    });
  }
};
YDataSet.DATA_INVALID = YAPI_INVALID_DOUBLE;
YDataSet.DURATION_INVALID = YAPI_INVALID_DOUBLE;
YDataSet.HARDWAREID_INVALID = YAPI_INVALID_STRING;
YDataSet.FUNCTIONID_INVALID = YAPI_INVALID_STRING;
YDataSet.UNIT_INVALID = YAPI_INVALID_STRING;
YDataSet.DATA_INVALID = YAPI_INVALID_DOUBLE;
YDataSet.DURATION_INVALID = YAPI_INVALID_DOUBLE;
YDataSet.HARDWAREID_INVALID = YAPI_INVALID_STRING;
YDataSet.FUNCTIONID_INVALID = YAPI_INVALID_STRING;
YDataSet.UNIT_INVALID = YAPI_INVALID_STRING;
var YConsolidatedDataSet = class {
  constructor(double_startTime, double_endTime, obj_sensorList) {
    this._start = 0;
    this._end = 0;
    this._nsensors = 0;
    this._sensors = [];
    this._datasets = [];
    this._progresss = [];
    this._nextidx = [];
    this._nexttim = [];
    this.imm_init(double_startTime, double_endTime, obj_sensorList);
  }
  imm_init(startt, endt, sensorList) {
    this._start = startt;
    this._end = endt;
    this._sensors = sensorList;
    this._nsensors = -1;
    return YAPI_SUCCESS;
  }
  static Init(sensorNames, startTime, endTime) {
    let nSensors;
    let sensorList = [];
    let idx;
    let sensorName;
    let s;
    let obj;
    nSensors = sensorNames.length;
    sensorList.length = 0;
    idx = 0;
    while (idx < nSensors) {
      sensorName = sensorNames[idx];
      s = YSensor.FindSensor(sensorName);
      sensorList.push(s);
      idx = idx + 1;
    }
    obj = new YConsolidatedDataSet(startTime, endTime, sensorList);
    return obj;
  }
  nextRecord(datarec) {
    return __awaiter(this, void 0, void 0, function* () {
      let s;
      let idx;
      let sensor;
      let newdataset;
      let globprogress;
      let currprogress;
      let currnexttim;
      let newvalue;
      let measures = [];
      let nexttime;
      if (this._nsensors == -1) {
        this._nsensors = this._sensors.length;
        this._datasets.length = 0;
        this._progresss.length = 0;
        this._nextidx.length = 0;
        this._nexttim.length = 0;
        s = 0;
        while (s < this._nsensors) {
          sensor = this._sensors[s];
          newdataset = yield sensor.get_recordedData(this._start, this._end);
          this._datasets.push(newdataset);
          this._progresss.push(0);
          this._nextidx.push(0);
          this._nexttim.push(0);
          s = s + 1;
        }
      }
      datarec.length = 0;
      nexttime = 0;
      s = 0;
      while (s < this._nsensors) {
        currnexttim = this._nexttim[s];
        if (currnexttim == 0) {
          idx = this._nextidx[s];
          measures = yield this._datasets[s].get_measures();
          currprogress = this._progresss[s];
          while (idx >= measures.length && currprogress < 100) {
            currprogress = yield this._datasets[s].loadMore();
            if (currprogress < 0) {
              currprogress = 100;
            }
            this._progresss[s] = currprogress;
            measures = yield this._datasets[s].get_measures();
          }
          if (idx < measures.length) {
            currnexttim = yield measures[idx].get_endTimeUTC();
            this._nexttim[s] = currnexttim;
          }
        }
        if (currnexttim > 0) {
          if (nexttime == 0 || nexttime > currnexttim) {
            nexttime = currnexttim;
          }
        }
        s = s + 1;
      }
      if (nexttime == 0) {
        return 100;
      }
      datarec.length = 0;
      datarec.push(nexttime);
      globprogress = 0;
      s = 0;
      while (s < this._nsensors) {
        if (this._nexttim[s] == nexttime) {
          idx = this._nextidx[s];
          measures = yield this._datasets[s].get_measures();
          newvalue = yield measures[idx].get_averageValue();
          datarec.push(newvalue);
          this._nexttim[s] = 0;
          this._nextidx[s] = idx + 1;
        } else {
          datarec.push(NaN);
        }
        currprogress = this._progresss[s];
        globprogress = globprogress + currprogress;
        s = s + 1;
      }
      if (globprogress > 0) {
        globprogress = globprogress / this._nsensors >> 0;
        if (globprogress > 99) {
          globprogress = 99;
        }
      }
      return globprogress;
    });
  }
};
var YDevice = class {
  constructor(obj_yapi, str_rooturl, obj_wpRec, obj_ypRecs) {
    this._yapi = obj_yapi;
    this._rootUrl = str_rooturl;
    this._serialNumber = "";
    this._logicalName = "";
    this._productName = "";
    this._productId = 0;
    this._beacon = 0;
    this._devYdx = -1;
    this._lastErrorType = YAPI_SUCCESS;
    this._lastErrorMsg = "no error";
    this._cache = {_expiration: 0, _json: new Uint8Array(0), _precooked: {}};
    this._functions = [];
    this._busy = 0;
    this._pendingQueries = Promise.resolve();
    this._lastTimeRef = 0;
    this._lastDuration = 0;
    this._logCallback = null;
    this._logIsPulling = false;
    this._logpos = 0;
    if (obj_wpRec && obj_ypRecs) {
      this._serialNumber = obj_wpRec.serialNumber;
      this._logicalName = obj_wpRec.logicalName;
      this._productName = obj_wpRec.productName;
      this._productId = obj_wpRec.productId;
      this._beacon = obj_wpRec.beacon;
      this._devYdx = obj_wpRec.index == void 0 ? -1 : obj_wpRec.index;
      this.imm_updateFromYP(obj_ypRecs);
      this._yapi.imm_reindexDevice(this);
    }
  }
  _throw(int_errType, str_errMsg, obj_retVal) {
    this._lastErrorType = int_errType;
    this._lastErrorMsg = str_errMsg;
    return this._yapi._throw(int_errType, str_errMsg, obj_retVal);
  }
  imm_getRootUrl() {
    return this._rootUrl;
  }
  imm_getSerialNumber() {
    return this._serialNumber;
  }
  imm_getLogicalName() {
    return this._logicalName;
  }
  getLogicalName() {
    return __awaiter(this, void 0, void 0, function* () {
      if (this._cache._expiration == 0) {
        yield this.refresh();
      }
      return this._logicalName;
    });
  }
  imm_getProductName() {
    return this._productName;
  }
  imm_getProductId() {
    return this._productId;
  }
  imm_getBeacon() {
    return this._beacon;
  }
  getBeacon() {
    return __awaiter(this, void 0, void 0, function* () {
      if (this._cache._expiration == 0) {
        yield this.refresh();
      }
      return this._beacon;
    });
  }
  imm_getLastTimeRef() {
    return this._lastTimeRef;
  }
  imm_getLastDuration() {
    return this._lastDuration;
  }
  imm_triggerLogPull() {
    if (this._logCallback == null || this._logIsPulling) {
      return;
    }
    this._logIsPulling = true;
    let request = "GET logs.txt?pos=" + this._logpos;
    let prom = this._yapi.devRequest(this._rootUrl, request, null, 0);
    prom.then((yreq) => __awaiter(this, void 0, void 0, function* () {
      if (yreq.errorType != YAPI_SUCCESS) {
        this._logIsPulling = false;
        return;
      }
      if (this._logCallback == null) {
        this._logIsPulling = false;
        return;
      }
      let resultStr = YAPI.imm_bin2str(yreq.bin_result);
      let pos = resultStr.lastIndexOf("\n@");
      if (pos < 0) {
        this._logIsPulling = false;
        return;
      }
      let logs = resultStr.substring(0, pos);
      let posStr = resultStr.substring(pos + 2);
      this._logpos = parseInt(posStr);
      let module = YModule.FindModuleInContext(this._yapi, this._serialNumber);
      let lines = logs.trim().split("\n");
      try {
        for (let i = 0; i < lines.length; i++) {
          yield this._logCallback(module, lines[i]);
        }
      } catch (e) {
        this._yapi.imm_log("Exception in device log callback:", e);
      }
      this._logIsPulling = false;
    }));
  }
  imm_registerLogCallback(callback) {
    this._logCallback = callback;
    if (callback != null) {
      this.imm_triggerLogPull();
    }
  }
  imm_setTimeRef(float_timestamp, float_duration) {
    this._lastTimeRef = float_timestamp;
    this._lastDuration = float_duration;
  }
  imm_getDevYdx() {
    return this._devYdx;
  }
  imm_describe() {
    let res = this._rootUrl;
    if (this._serialNumber != "") {
      res = this._serialNumber;
      if (this._logicalName != "") {
        res = res + " (" + this._logicalName + ")";
      }
    }
    return this._productName + " " + res;
  }
  imm_updateFromYP(obj_ypRecs) {
    let funidx = 0;
    for (let categ in obj_ypRecs) {
      for (let key in obj_ypRecs[categ]) {
        let rec = obj_ypRecs[categ][key];
        let hwid = rec["hardwareId"];
        let dotpos = hwid.indexOf(".");
        if (hwid.substr(0, dotpos) == this._serialNumber) {
          let funydx = rec["index"];
          if (funydx == void 0)
            funydx = funidx;
          this._functions[funydx] = [hwid.substr(dotpos + 1), rec["logicalName"]];
          funidx++;
        }
      }
    }
  }
  updateFromReq(yreq, loadval) {
    return __awaiter(this, void 0, void 0, function* () {
      this._cache._expiration = this._yapi.GetTickCount() + this._yapi.defaultCacheValidity;
      this._cache._json = yreq.bin_result;
      let func;
      let reindex = false;
      if (this._productName == "") {
        for (func in loadval) {
          if (func == "module") {
            this._serialNumber = loadval.module.serialNumber;
            this._logicalName = loadval.module.logicalName;
            this._productName = loadval.module.productName;
            this._productId = loadval.module.productId;
            this._beacon = loadval.module.beacon;
          } else if (func == "services") {
            this.imm_updateFromYP(loadval.services.yellowPages);
          }
        }
        reindex = true;
      } else {
        let renamed = false;
        for (func in loadval) {
          if (func == "module") {
            if (this._logicalName != loadval.module.logicalName) {
              this._logicalName = loadval.module.logicalName;
              reindex = true;
            }
            this._beacon = loadval.module.beacon;
          } else if (func != "services") {
            let name = loadval[func]["logicalName"];
            if (name == void 0)
              name = loadval.module.logicalName;
            let pubval = loadval[func]["advertisedValue"];
            if (pubval != void 0) {
              yield this._yapi.setFunctionValue(loadval.module.serialNumber + "." + func, pubval);
            }
            let funydx;
            for (funydx in this._functions) {
              if (this._functions[funydx][0] == func) {
                if (this._functions[funydx][1] != name) {
                  this._functions[funydx][1] = name;
                  reindex = true;
                }
                break;
              }
            }
          }
        }
      }
      if (reindex) {
        this._yapi.imm_reindexDevice(this);
      }
    });
  }
  imm_dropCache() {
    this._cache._expiration = 0;
    this._cache._precooked = {};
  }
  imm_functionCount() {
    let funcPos = 0;
    for (let key in this._functions) {
      funcPos++;
    }
    return funcPos;
  }
  imm_functionId(int_idx) {
    let funcPos = 0;
    for (let key in this._functions) {
      if (int_idx === funcPos) {
        return this._functions[key][0];
      }
      funcPos++;
    }
    return "";
  }
  imm_functionBaseType(int_idx) {
    let funid = this.imm_functionId(int_idx);
    if (funid !== "") {
      let ftype = this._yapi.imm_getFunctionBaseType(this._serialNumber + "." + funid);
      for (let baseType in Y_BASETYPES) {
        if (Y_BASETYPES[baseType] === ftype) {
          return baseType;
        }
      }
    }
    return "Function";
  }
  imm_functionType(int_idx) {
    let funid = this.imm_functionId(int_idx);
    if (funid !== "") {
      let i;
      for (i = funid.length; i > 0; i--) {
        if (funid[i - 1] > "9") {
          break;
        }
      }
      let functionType = funid[0].toUpperCase() + funid.substr(1, i - 1);
      return functionType;
    }
    return "";
  }
  imm_functionName(int_idx) {
    let funcPos = 0;
    for (let key in this._functions) {
      if (int_idx === funcPos) {
        return this._functions[key][1];
      }
      funcPos++;
    }
    return "";
  }
  imm_functionValue(int_idx) {
    let funid = this.imm_functionId(int_idx);
    if (funid !== "") {
      return this._yapi.imm_getFunctionValue(this._serialNumber + "." + funid);
    }
    return "";
  }
  imm_functionIdByFunYdx(int_funydx) {
    if (this._functions[int_funydx]) {
      return this._functions[int_funydx][0];
    }
    return "";
  }
  imm_jzon2json(jzon, json) {
    if (Array.isArray(jzon)) {
      let sz = jzon.length;
      if (Array.isArray(json)) {
        let defval = json.length > 0 ? json[0] : null;
        let res = [];
        for (let idx = 0; idx < sz; idx++) {
          res[idx] = this.imm_jzon2json(jzon[idx], defval);
        }
        return res;
      } else if (typeof json === "object") {
        let idx = 0;
        let res = {};
        for (let key in json) {
          if (json.hasOwnProperty(key)) {
            res[key] = this.imm_jzon2json(jzon[idx], json[key]);
            idx++;
          }
        }
        return res;
      } else {
        return jzon;
      }
    } else if (typeof jzon === "object") {
      if (Array.isArray(json)) {
        return jzon;
      } else if (typeof json === "object") {
        let defval = null;
        for (let key in json) {
          if (json.hasOwnProperty(key)) {
            defval = json[key];
            break;
          }
        }
        let res = {};
        for (let key in jzon) {
          if (jzon.hasOwnProperty(key)) {
            if (json.hasOwnProperty(key) && (!Array.isArray(json[key]) || json[key].length > 0)) {
              res[key] = this.imm_jzon2json(jzon[key], json[key]);
            } else {
              res[key] = this.imm_jzon2json(jzon[key], defval);
            }
          }
        }
        return res;
      } else {
        return jzon;
      }
    }
    return jzon;
  }
  requestAPI(int_msValidity) {
    return __awaiter(this, void 0, void 0, function* () {
      if (this._cache._expiration > this._yapi.GetTickCount()) {
        let res = new YHTTPRequest(this._cache._json);
        res.obj_result = JSON.parse(JSON.stringify(this._cache._precooked));
        return res;
      }
      let req = "GET /api.json";
      let precooked = this._cache._precooked;
      if (precooked.module && precooked.module.firmwareRelease) {
        req += "?fw=" + encodeURIComponent(precooked.module.firmwareRelease);
      }
      let yreq = yield this._yapi.devRequest(this._rootUrl, req, null, 0);
      if (yreq.errorType != YAPI_SUCCESS)
        return yreq;
      if (!int_msValidity) {
        int_msValidity = this._yapi.defaultCacheValidity;
      }
      this._cache._json = yreq.bin_result;
      try {
        yreq.obj_result = JSON.parse(this._yapi.imm_bin2str(yreq.bin_result));
        if (Array.isArray(yreq.obj_result)) {
          if (precooked.module) {
            let objres = this.imm_jzon2json(yreq.obj_result, precooked);
            yreq.obj_result = objres;
            if (objres.module && objres.module.serialNumber === objres.module.serialNumber && objres.module.firmwareRelease === objres.module.firmwareRelease) {
              let jsonstr = JSON.stringify(yreq.obj_result);
              this._cache._json = yreq.bin_result = this._yapi.imm_str2bin(jsonstr);
              this._cache._precooked = JSON.parse(jsonstr);
            } else {
              this.imm_dropCache();
              yreq.errorType = YAPI_IO_ERROR;
              yreq.errorMsg = "Request failed, could not parse API JZON result for " + this._rootUrl;
            }
          } else {
            yreq.errorType = YAPI_IO_ERROR;
            yreq.errorMsg = "Request failed, could not parse API array result for " + this._rootUrl;
          }
        } else if (yreq.obj_result.module && yreq.obj_result.module.firmwareRelease) {
          this._cache._precooked = JSON.parse(JSON.stringify(yreq.obj_result));
        }
        this._cache._expiration = this._yapi.GetTickCount() + int_msValidity;
        this._logicalName = yreq.obj_result.module.logicalName;
        this._beacon = yreq.obj_result.module.beacon;
      } catch (err) {
        yreq.errorType = YAPI_IO_ERROR;
        yreq.errorMsg = "Request failed, could not parse API JSON result for " + this._rootUrl;
      }
      return yreq;
    });
  }
  refresh() {
    return __awaiter(this, void 0, void 0, function* () {
      let yreq = yield this.requestAPI(this._yapi.defaultCacheValidity);
      if (yreq.errorType != YAPI_SUCCESS) {
        return this._throw(yreq.errorType, yreq.errorMsg, yreq.errorType);
      }
      yield this.updateFromReq(yreq, yreq.obj_result);
      return YAPI_SUCCESS;
    });
  }
};
var YFirmwareFile = class {
  constructor(path, serial, pictype, product, firmware, prog_version, ROM_nb_zone, FLA_nb_zone, ROM_total_size, FLA_total_size, data, zone_ofs) {
    this._path = path;
    this._serial = serial;
    this._pictype = pictype;
    this._product = product;
    this._firmware = firmware;
    this._prog_version = prog_version;
    this._ROM_nb_zone = ROM_nb_zone;
    this._FLA_nb_zone = FLA_nb_zone;
    this._ROM_total_size = ROM_total_size;
    this._FLA_total_size = FLA_total_size;
    this._data = data;
    this._zone_ofs = zone_ofs;
  }
  static imm_Parse(path, data, force) {
    const BYN_REV_V4 = 4;
    const BYN_REV_V5 = 5;
    const BYN_REV_V6 = 6;
    const MAX_ROM_ZONES_PER_FILES = 16;
    const MAX_FLASH_ZONES_PER_FILES = 4;
    const BYN_HEAD_SIZE_V4 = 96 + 8;
    const BYN_HEAD_SIZE_V5 = 96 + 32;
    const BYN_HEAD_SIZE_V6 = 96 + 48;
    const BYN_MD5_OFS_V6 = 96 + 16;
    let pos = 0;
    let getShort = () => {
      let res = data[pos] + (data[pos + 1] << 8);
      pos += 2;
      return res;
    };
    let getInt = () => {
      let res = data[pos] + (data[pos + 1] << 8) + (data[pos + 2] << 16) + (data[pos + 3] << 24);
      pos += 4;
      return res;
    };
    let getString = (maxlen) => {
      let end = pos + maxlen;
      while (end > pos && data[end - 1] == 0)
        end--;
      let res = YAPI.imm_bin2str(data.subarray(pos, end));
      pos += maxlen;
      return res;
    };
    let sign = getString(4);
    if (sign != "BYN")
      return null;
    let rev = getShort();
    let serial = getString(20);
    let pictype = getString(20);
    let product = getString(28);
    let firmware = getString(22);
    if (serial.length >= 20)
      return null;
    if (product.length >= 28)
      return null;
    if (firmware.length >= 22)
      return null;
    let ROM_nb_zone = 0;
    let FLA_nb_zone = 0;
    let ROM_total_size = 0;
    let FLA_total_size = 0;
    let prog_buf;
    let prog_version = "";
    let zone_ofs;
    let datasize;
    switch (rev) {
      case BYN_REV_V4:
        zone_ofs = BYN_HEAD_SIZE_V4;
        ROM_nb_zone = getInt();
        datasize = getInt();
        if (ROM_nb_zone > MAX_ROM_ZONES_PER_FILES)
          return null;
        if (datasize != data.length - BYN_HEAD_SIZE_V4)
          return null;
        break;
      case BYN_REV_V5:
        zone_ofs = BYN_HEAD_SIZE_V5;
        prog_version = getString(22);
        if (!force && !YFirmwareFile.imm_progCompatible(prog_version))
          return null;
        getShort();
        ROM_nb_zone = getInt();
        datasize = getInt();
        if (ROM_nb_zone > MAX_ROM_ZONES_PER_FILES)
          return null;
        if (datasize != data.length - BYN_HEAD_SIZE_V5)
          return null;
        break;
      case BYN_REV_V6:
        zone_ofs = BYN_HEAD_SIZE_V6;
        let md5hdr = data.subarray(pos, pos + 16);
        pos += 16;
        let md5hdrstr = YAPI.imm_bin2hexstr(md5hdr);
        let md5ctx = new Y_MD5Ctx();
        md5ctx.addData(data.subarray(BYN_MD5_OFS_V6));
        let md5bynstr = YAPI.imm_bin2hexstr(md5ctx.calculate());
        if (md5hdrstr != md5bynstr) {
          YAPI.imm_log("Invalid firmware image signature, file is corrupt");
          if (YAPI._logLevel >= 2) {
            YAPI.imm_log("hdr MD5: " + md5hdrstr);
            YAPI.imm_log("byn MD5: " + md5bynstr);
            YAPI.imm_log("byn size: " + data.length);
          }
          return null;
        }
        prog_version = getString(22);
        if (!force && !YFirmwareFile.imm_progCompatible(prog_version))
          return null;
        ROM_nb_zone = data[pos++];
        FLA_nb_zone = data[pos++];
        ROM_total_size = getInt();
        FLA_total_size = getInt();
        if (ROM_nb_zone > MAX_ROM_ZONES_PER_FILES)
          return null;
        if (FLA_nb_zone > MAX_FLASH_ZONES_PER_FILES)
          return null;
        break;
      default:
        return null;
    }
    return new YFirmwareFile(path, serial, pictype, product, firmware, prog_version, ROM_nb_zone, FLA_nb_zone, ROM_total_size, FLA_total_size, data, zone_ofs);
  }
  static imm_progCompatible(prog_version) {
    if (prog_version == "")
      return true;
    let apiVer = YAPI.imm_GetAPIVersion();
    let dashpos = apiVer.indexOf("-");
    if (dashpos > 0) {
      apiVer = apiVer.slice(0, dashpos);
    }
    apiVer = apiVer.slice(apiVer.lastIndexOf(".") + 1);
    if (parseInt(prog_version) > parseInt(apiVer)) {
      YAPI.imm_log("checkProgField: byn=" + prog_version + " api=" + apiVer);
      return false;
    }
    return true;
  }
  imm_getSerial() {
    return this._serial;
  }
  imm_getPictype() {
    return this._pictype;
  }
  imm_getProduct() {
    return this._product;
  }
  imm_getFirmwareRelease() {
    return this._firmware;
  }
  imm_getFirmwareReleaseAsInt() {
    return parseInt(this._firmware);
  }
  imm_getProg_version() {
    return this._prog_version;
  }
  imm_getROM_nb_zone() {
    return this._ROM_nb_zone;
  }
  imm_getFLA_nb_zone() {
    return this._FLA_nb_zone;
  }
  imm_getROM_total_size() {
    return this._ROM_total_size;
  }
  imm_getFLA_total_size() {
    return this._FLA_total_size;
  }
  imm_getData() {
    return this._data;
  }
  imm_getPath() {
    return this._path;
  }
};
var YFirmwareUpdate = class {
  constructor(obj_yapi, str_serial, str_path, bin_settings, bool_force) {
    this._serial = "";
    this._settings = new Uint8Array(0);
    this._firmwarepath = "";
    this._progress_msg = "";
    this._progress_c = 0;
    this._progress = 0;
    this._restore_step = 0;
    this._force = false;
    this._yapi = obj_yapi;
    this._serial = str_serial;
    this._firmwarepath = str_path;
    this._settings = bin_settings;
    this._force = bool_force;
  }
  imm_progress(progress, msg) {
    this._progress = progress;
    this._progress_msg = msg;
  }
  _processMore_internal(newupdate) {
    return __awaiter(this, void 0, void 0, function* () {
      if (!newupdate)
        return YAPI_SUCCESS;
      let bytes;
      this.imm_progress(0, "Firmware update started");
      if (typeof this._firmwarepath == "string" && this._firmwarepath.indexOf("yoctopuce.com") >= 0) {
        this.imm_progress(1, "Downloading firmware");
        bytes = yield this._yapi.system_env.downloadfile(this._firmwarepath);
      } else {
        this.imm_progress(1, "Loading firmware");
        bytes = yield this._yapi.system_env.loadfile(this._firmwarepath);
      }
      let firmware = YFirmwareFile.imm_Parse(this._firmwarepath, bytes, this._force);
      if (!firmware) {
        return this._yapi._throw(YAPI_DEVICE_NOT_FOUND, "Device " + this._serial + " is not detected", YAPI_DEVICE_NOT_FOUND);
      }
      this.imm_progress(5, "Check if module is already in bootloader");
      let hub = null;
      let module = YModule.FindModuleInContext(this._yapi, this._serial + ".module");
      if (yield module.isOnline()) {
        let dev = this._yapi.imm_getDevice(this._serial);
        let baseUrl = dev.imm_getRootUrl();
        let byPos = baseUrl.indexOf("/bySerial/");
        if (byPos >= 0)
          baseUrl = baseUrl.slice(0, byPos + 1);
        else if (baseUrl.slice(-1) != "/")
          baseUrl = baseUrl + "/";
        let urlInfo = this._yapi.imm_parseRegisteredUrl(baseUrl);
        hub = this._yapi.imm_getHub(urlInfo);
      } else {
        let hubs = this._yapi._hubs;
        for (let i = 0; i < hubs.length; i++) {
          let ldrs = yield hubs[i].getBootloaders();
          if (ldrs.indexOf(this._serial) >= 0) {
            hub = hubs[i];
            break;
          }
        }
      }
      if (hub == null) {
        this.imm_progress(-1, "Device " + this._serial + " is not detected");
        return this._yapi._throw(YAPI_DEVICE_NOT_FOUND, "Device " + this._serial + " is not detected", YAPI_DEVICE_NOT_FOUND);
      }
      try {
        yield hub.firmwareUpdate(this._serial, firmware, this._settings, (percent, msg) => {
          this.imm_progress(5 + (percent * 80 + 50) / 100 >> 0, msg);
        });
      } catch (e) {
        this.imm_progress(-1, e.message);
        return this._yapi._throw(YAPI_IO_ERROR, e.message, YAPI_IO_ERROR);
      }
      this.imm_progress(80, "Wait for the device to restart");
      let timeout = this._yapi.GetTickCount() + 6e4;
      yield module.clearCache();
      while (!(yield module.isOnline()) && timeout > this._yapi.GetTickCount()) {
        yield this._yapi.Sleep(500);
        yield this._yapi.UpdateDeviceList();
      }
      if (yield module.isOnline()) {
        if (this._settings != null) {
          this.imm_progress(95, "Restoring device settings");
          yield module.set_allSettingsAndFiles(this._settings);
          yield module.saveToFlash();
        }
        let real_fw = yield module.get_firmwareRelease();
        if (real_fw == firmware.imm_getFirmwareRelease()) {
          this.imm_progress(100, "Success");
        } else {
          this.imm_progress(-1, "Unable to update firmware");
        }
      } else {
        this.imm_progress(-1, "Device did not reboot correctly");
      }
      return YAPI_SUCCESS;
    });
  }
  static checkFirmware_r(file, serial_base, force) {
    return __awaiter(this, void 0, void 0, function* () {
      if (file.substr(-4).toLowerCase() != ".byn")
        return null;
      let bynfile = yield YAPI.system_env.loadfile(file);
      let firmware = YFirmwareFile.imm_Parse(file, bynfile, force);
      if (!firmware)
        return null;
      if (firmware.imm_getSerial().slice(0, serial_base.length) != serial_base)
        return null;
      return firmware;
    });
  }
  static CheckFirmwareEx(serial, path, minrelease, force) {
    return __awaiter(this, void 0, void 0, function* () {
      let link = "";
      let best_rev = 0;
      let current_rev;
      if (typeof path == "string" && path.indexOf("yoctopuce.com") >= 0) {
        try {
          let data = yield YAPI.system_env.downloadfile("http://www.yoctopuce.com/FR/common/getLastFirmwareLink.php?serial=" + serial);
          let obj = JSON.parse(YAPI.imm_bin2str(data));
          link = obj["link"];
          best_rev = obj["version"];
        } catch (e) {
          YAPI.imm_log("failed to retrieve firmware information from www.yoctopuce.com", e);
          YAPI._throw(YAPI_IO_ERROR, "failed to retrieve firmware information from www.yoctopuce.com", "");
          return "";
        }
      } else {
        let firmware = yield YFirmwareUpdate.checkFirmware_r(path, serial.substring(0, 8), force);
        if (firmware != null) {
          best_rev = firmware.imm_getFirmwareReleaseAsInt();
          link = firmware.imm_getPath();
        }
      }
      if (minrelease != 0) {
        if (minrelease < best_rev)
          return link;
        else
          return "";
      }
      return link;
    });
  }
  static CheckFirmware_internal(serial, path, minrelease) {
    return __awaiter(this, void 0, void 0, function* () {
      return YFirmwareUpdate.CheckFirmwareEx(serial, path, minrelease, false);
    });
  }
  static GetAllBootLoadersInContext_internal(yctx) {
    return __awaiter(this, void 0, void 0, function* () {
      let hubs = yctx._hubs;
      let res = [];
      for (let i = 0; i < hubs.length; i++) {
        let ldrs = yield hubs[i].getBootloaders();
        for (let j = 0; j < ldrs.length; j++) {
          res.push(ldrs[j]);
        }
      }
      return res;
    });
  }
  static GetAllBootLoaders_internal() {
    return __awaiter(this, void 0, void 0, function* () {
      return YFirmwareUpdate.GetAllBootLoadersInContext(YAPI);
    });
  }
  _processMore(newupdate) {
    return __awaiter(this, void 0, void 0, function* () {
      return yield this._processMore_internal(newupdate);
    });
  }
  static GetAllBootLoaders() {
    return __awaiter(this, void 0, void 0, function* () {
      return yield this.GetAllBootLoaders_internal();
    });
  }
  static GetAllBootLoadersInContext(yctx) {
    return __awaiter(this, void 0, void 0, function* () {
      return yield this.GetAllBootLoadersInContext_internal(yctx);
    });
  }
  static CheckFirmware(serial, path, minrelease) {
    return __awaiter(this, void 0, void 0, function* () {
      return yield this.CheckFirmware_internal(serial, path, minrelease);
    });
  }
  get_progress() {
    return __awaiter(this, void 0, void 0, function* () {
      if (this._progress >= 0) {
        yield this._processMore(0);
      }
      return this._progress;
    });
  }
  get_progressMessage() {
    return __awaiter(this, void 0, void 0, function* () {
      return this._progress_msg;
    });
  }
  startUpdate() {
    return __awaiter(this, void 0, void 0, function* () {
      let err;
      let leng;
      err = this._yapi.imm_bin2str(this._settings);
      leng = err.length;
      if (leng >= 6 && err.substr(0, 6) == "error:") {
        this._progress = -1;
        this._progress_msg = err.substr(6, leng - 6);
      } else {
        this._progress = 0;
        this._progress_c = 0;
        yield this._processMore(1);
      }
      return this._progress;
    });
  }
};
var YFunction = class {
  constructor(obj_yapi, str_func) {
    this._logicalName = YFunction.LOGICALNAME_INVALID;
    this._advertisedValue = YFunction.ADVERTISEDVALUE_INVALID;
    this._valueCallbackFunction = null;
    this._cacheExpiration = 0;
    this._serial = "";
    this._funId = "";
    this._hwId = "";
    this.LOGICALNAME_INVALID = YAPI_INVALID_STRING;
    this.ADVERTISEDVALUE_INVALID = YAPI_INVALID_STRING;
    this._yapi = obj_yapi;
    this._className = "Function";
    this._func = str_func;
    this._lastErrorType = YAPI_SUCCESS;
    this._lastErrorMsg = "no error";
    this._dataStreams = {};
    this._userData = null;
    this._cache = {_expiration: -1, functionid: "", hwid: ""};
    this._valueCallbackFunction = null;
  }
  _throw(int_errType, str_errMsg, obj_retVal) {
    this._lastErrorType = int_errType;
    this._lastErrorMsg = str_errMsg;
    return this._yapi._throw(int_errType, str_errMsg, obj_retVal);
  }
  isReadOnly_internal() {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        let serial = yield this.get_serialNumber();
        return this._yapi.isReadOnly(serial);
      } catch (e) {
        return true;
      }
    });
  }
  imm_parseAttr(name, val) {
    switch (name) {
      case "_expiration":
        this._cacheExpiration = val;
        return 1;
      case "logicalName":
        this._logicalName = val;
        return 1;
      case "advertisedValue":
        this._advertisedValue = val;
        return 1;
    }
    return 0;
  }
  get_logicalName() {
    return __awaiter(this, void 0, void 0, function* () {
      let res;
      if (this._cacheExpiration <= this._yapi.GetTickCount()) {
        if ((yield this.load(this._yapi.defaultCacheValidity)) != YAPI_SUCCESS) {
          return YFunction.LOGICALNAME_INVALID;
        }
      }
      res = this._logicalName;
      return res;
    });
  }
  set_logicalName(newval) {
    return __awaiter(this, void 0, void 0, function* () {
      let rest_val;
      if (!(yield YAPI.CheckLogicalName(newval))) {
        return this._throw(YAPI.INVALID_ARGUMENT, "Invalid name :" + newval, YAPI.INVALID_ARGUMENT);
      }
      rest_val = String(newval);
      return yield this._setAttr("logicalName", rest_val);
    });
  }
  get_advertisedValue() {
    return __awaiter(this, void 0, void 0, function* () {
      let res;
      if (this._cacheExpiration <= this._yapi.GetTickCount()) {
        if ((yield this.load(this._yapi.defaultCacheValidity)) != YAPI_SUCCESS) {
          return YFunction.ADVERTISEDVALUE_INVALID;
        }
      }
      res = this._advertisedValue;
      return res;
    });
  }
  set_advertisedValue(newval) {
    return __awaiter(this, void 0, void 0, function* () {
      let rest_val;
      rest_val = String(newval);
      return yield this._setAttr("advertisedValue", rest_val);
    });
  }
  static FindFunction(func) {
    let obj;
    obj = YFunction._FindFromCache("Function", func);
    if (obj == null) {
      obj = new YFunction(YAPI, func);
      YFunction._AddToCache("Function", func, obj);
    }
    return obj;
  }
  static FindFunctionInContext(yctx, func) {
    let obj;
    obj = YFunction._FindFromCacheInContext(yctx, "Function", func);
    if (obj == null) {
      obj = new YFunction(yctx, func);
      YFunction._AddToCache("Function", func, obj);
    }
    return obj;
  }
  registerValueCallback(callback) {
    return __awaiter(this, void 0, void 0, function* () {
      let val;
      if (callback != null) {
        yield YFunction._UpdateValueCallbackList(this, true);
      } else {
        yield YFunction._UpdateValueCallbackList(this, false);
      }
      this._valueCallbackFunction = callback;
      if (callback != null && (yield this.isOnline())) {
        val = this._advertisedValue;
        if (!(val == "")) {
          yield this._invokeValueCallback(val);
        }
      }
      return 0;
    });
  }
  _invokeValueCallback(value) {
    return __awaiter(this, void 0, void 0, function* () {
      if (this._valueCallbackFunction != null) {
        try {
          yield this._valueCallbackFunction(this, value);
        } catch (e) {
          this._yapi.imm_log("Exception in valueCallback:", e);
        }
      } else {
      }
      return 0;
    });
  }
  muteValueCallbacks() {
    return __awaiter(this, void 0, void 0, function* () {
      return yield this.set_advertisedValue("SILENT");
    });
  }
  unmuteValueCallbacks() {
    return __awaiter(this, void 0, void 0, function* () {
      return yield this.set_advertisedValue("");
    });
  }
  loadAttribute(attrName) {
    return __awaiter(this, void 0, void 0, function* () {
      let url;
      let attrVal;
      url = "api/" + (yield this.get_functionId()) + "/" + attrName;
      attrVal = yield this._download(url);
      return this._yapi.imm_bin2str(attrVal);
    });
  }
  isReadOnly() {
    return __awaiter(this, void 0, void 0, function* () {
      return yield this.isReadOnly_internal();
    });
  }
  get_serialNumber() {
    return __awaiter(this, void 0, void 0, function* () {
      let m;
      m = yield this.get_module();
      return yield m.get_serialNumber();
    });
  }
  _parserHelper() {
    return __awaiter(this, void 0, void 0, function* () {
      return 0;
    });
  }
  nextFunction() {
    let resolve = this._yapi.imm_resolveFunction(this._className, this._func);
    if (resolve.errorType != YAPI.SUCCESS)
      return null;
    let next_hwid = this._yapi.imm_getNextHardwareId(this._className, resolve.result);
    if (next_hwid == null)
      return null;
    return YFunction.FindFunctionInContext(this._yapi, next_hwid);
  }
  static FirstFunction() {
    let next_hwid = YAPI.imm_getFirstHardwareId("Function");
    if (next_hwid == null)
      return null;
    return YFunction.FindFunction(next_hwid);
  }
  static FirstFunctionInContext(yctx) {
    let next_hwid = yctx.imm_getFirstHardwareId("Function");
    if (next_hwid == null)
      return null;
    return YFunction.FindFunctionInContext(yctx, next_hwid);
  }
  static _FindFromCacheInContext(yctx, className, func) {
    return yctx.imm_getFunction(className, func);
  }
  static _FindFromCache(className, func) {
    return YAPI.imm_getFunction(className, func);
  }
  static _AddToCache(className, func, obj) {
    obj._yapi.imm_setFunction(className, func, obj);
  }
  static _ClearCache(obj_yapi = null) {
    if (!obj_yapi)
      obj_yapi = YAPI;
    obj_yapi.imm_ResetToDefaults();
  }
  static _UpdateValueCallbackList(obj_func, bool_add) {
    return __awaiter(this, void 0, void 0, function* () {
      yield obj_func._yapi._UpdateValueCallbackList(obj_func, bool_add);
    });
  }
  static _UpdateTimedReportCallbackList(obj_func, bool_add) {
    return __awaiter(this, void 0, void 0, function* () {
      yield obj_func._yapi._UpdateTimedReportCallbackList(obj_func, bool_add);
    });
  }
  describe() {
    return __awaiter(this, void 0, void 0, function* () {
      if (this._hwId != "") {
        return this._className + "(" + this._func + ")=" + this._hwId;
      }
      let resolve = this._yapi.imm_resolveFunction(this._className, this._func);
      if (resolve.errorType != YAPI_SUCCESS && resolve.result != this._func) {
        return this._className + "(" + this._func + ")=unresolved";
      }
      return this._className + "(" + this._func + ")=" + resolve.result;
    });
  }
  get_hardwareId() {
    return __awaiter(this, void 0, void 0, function* () {
      if (this._hwId != "") {
        return this._hwId;
      }
      let resolve = this._yapi.imm_resolveFunction(this._className, this._func);
      if (resolve.errorType != YAPI_SUCCESS) {
        yield this.isOnline();
        resolve = this._yapi.imm_resolveFunction(this._className, this._func);
        if (resolve.errorType != YAPI_SUCCESS) {
          return this._throw(resolve.errorType, resolve.errorMsg, YFunction.HARDWAREID_INVALID);
        }
      }
      return resolve.result;
    });
  }
  get_functionId() {
    return __awaiter(this, void 0, void 0, function* () {
      if (this._funId != "") {
        return this._funId;
      }
      let resolve = this._yapi.imm_resolveFunction(this._className, this._func);
      if (resolve.errorType != YAPI_SUCCESS) {
        yield this.isOnline();
        resolve = this._yapi.imm_resolveFunction(this._className, this._func);
        if (resolve.errorType != YAPI_SUCCESS) {
          return this._throw(resolve.errorType, resolve.errorMsg, YFunction.FUNCTIONID_INVALID);
        }
      }
      let hardwareId = resolve.result;
      let pos = hardwareId.indexOf(".");
      return hardwareId.substr(pos + 1);
    });
  }
  imm_get_functionId() {
    if (this._funId != "") {
      return this._funId;
    }
    let resolve = this._yapi.imm_resolveFunction(this._className, this._func);
    if (resolve.errorType != YAPI_SUCCESS) {
      return this._throw(resolve.errorType, resolve.errorMsg, YFunction.FUNCTIONID_INVALID);
    }
    let hardwareId = resolve.result;
    let pos = hardwareId.indexOf(".");
    return hardwareId.substr(pos + 1);
  }
  get_friendlyName() {
    return __awaiter(this, void 0, void 0, function* () {
      let resolve = this._yapi.imm_getFriendlyNameFunction(this._className, this._func);
      if (resolve.errorType != YAPI_SUCCESS) {
        yield this.isOnline();
        resolve = this._yapi.imm_getFriendlyNameFunction(this._className, this._func);
        if (resolve.errorType != YAPI_SUCCESS) {
          return this._throw(resolve.errorType, resolve.errorMsg, YFunction.FRIENDLYNAME_INVALID);
        }
      }
      return resolve.result;
    });
  }
  _parse(yreq, msValidity) {
    return __awaiter(this, void 0, void 0, function* () {
      if (!yreq.obj_result)
        return;
      yreq.obj_result._expiration = this._yapi.GetTickCount() + msValidity;
      this._cache = yreq.obj_result;
      this._serial = yreq.obj_result.deviceid;
      this._funId = yreq.obj_result.functionid;
      this._hwId = yreq.obj_result.hwid;
      for (let key in yreq.obj_result) {
        this.imm_parseAttr(key, yreq.obj_result[key]);
      }
      yield this._parserHelper();
    });
  }
  isOnline_async(func, ctx) {
    this.isOnline().then((res) => {
      func(ctx, this, res);
    }).catch((e) => {
      func(ctx, this, false);
    });
  }
  load_async(ms_validiy, func, ctx) {
    this.load(ms_validiy).then((res) => {
      func(ctx, this, YAPI_SUCCESS);
    }).catch((e) => {
      func(ctx, this, this.get_errorType());
    });
  }
  _getAttr(str_attr) {
    return __awaiter(this, void 0, void 0, function* () {
      if (this._cacheExpiration <= this._yapi.GetTickCount()) {
        if ((yield this.load(this._yapi.defaultCacheValidity)) != YAPI_SUCCESS)
          return null;
      }
      if (typeof this._cache[str_attr] == "undefined") {
        this._throw(YAPI_VERSION_MISMATCH, "No such attribute " + str_attr + " in function", null);
      }
      return this._cache[str_attr];
    });
  }
  _getFixedAttr(str_attr) {
    return __awaiter(this, void 0, void 0, function* () {
      if (this._cacheExpiration == 0) {
        if ((yield this.load(this._yapi.defaultCacheValidity)) != YAPI_SUCCESS)
          return null;
      }
      if (typeof this._cache[str_attr] == "undefined") {
        this._throw(YAPI_VERSION_MISMATCH, "No such attribute " + str_attr + " in function", null);
      }
      return this._cache[str_attr];
    });
  }
  imm_escapeAttr(str_newval) {
    return escape(str_newval).replace(/[+]/g, "%2B").replace(/%20/g, "+").replace(/%21/g, "!").replace(/%24/g, "$").replace(/%27/g, "'").replace(/%28/g, "(").replace(/%29/g, ")").replace(/%2[cC]/g, ",").replace(/%2[fF]/g, "/").replace(/%3[aA]/g, ":").replace(/%3[bB]/g, ";").replace(/%3[fF]/g, "?").replace(/%5[bB]/g, "[").replace(/%5[dD]/g, "]");
  }
  _setAttr(str_attr, str_newval) {
    return __awaiter(this, void 0, void 0, function* () {
      if (str_newval == void 0) {
        return this._throw(YAPI_INVALID_ARGUMENT, "Undefined value to set for attribute " + str_attr, null);
      }
      let attrname = encodeURIComponent(str_attr);
      let attrval = this.imm_escapeAttr(str_newval);
      let extra = "/" + attrname + "?" + attrname + "=" + attrval + "&.";
      if (this._cacheExpiration != 0) {
        this._cacheExpiration = this._yapi.GetTickCount();
        this._cache._expiration = this._cacheExpiration;
      }
      let yreq = yield this._yapi.funcRequest(this._className, this._func, extra);
      if (yreq.errorType != YAPI_SUCCESS) {
        return this._throw(yreq.errorType, yreq.errorMsg, yreq.errorType);
      }
      return YAPI_SUCCESS;
    });
  }
  _download(str_path) {
    return __awaiter(this, void 0, void 0, function* () {
      let devid = this._serial;
      if (devid == "") {
        devid = yield (yield this.module()).get_serialNumber();
      }
      if (devid == YAPI_INVALID_STRING) {
        return new Uint8Array(0);
      }
      let yreq = yield this._yapi.devRequest(devid, "GET /" + str_path, null, 0);
      if (yreq.errorType != YAPI_SUCCESS) {
        return this._throw(yreq.errorType, yreq.errorMsg, "");
      }
      return yreq.bin_result;
    });
  }
  _downloadOutOfBand(str_path) {
    return __awaiter(this, void 0, void 0, function* () {
      let devid = this._serial;
      if (devid == "") {
        devid = yield (yield this.module()).get_serialNumber();
      }
      if (devid == YAPI_INVALID_STRING) {
        return new Uint8Array(0);
      }
      let yreq = yield this._yapi.devRequest(devid, "GET /" + str_path, null, 1);
      if (yreq.errorType != YAPI_SUCCESS) {
        return this._throw(yreq.errorType, yreq.errorMsg, "");
      }
      return yreq.bin_result;
    });
  }
  _uploadWithProgress(str_path, bin_content, fun_progressCb) {
    return __awaiter(this, void 0, void 0, function* () {
      let devid = this._serial;
      if (devid == "") {
        devid = yield (yield this.module()).get_serialNumber();
      }
      if (devid == YAPI_INVALID_STRING) {
        let res = new YHTTPRequest(null);
        res.errorType = this.get_errorType();
        res.errorMsg = this.get_errorMessage();
        return res;
      }
      let httpreq = "POST /upload.html";
      let len = bin_content.length;
      if (typeof bin_content == "string" || bin_content instanceof String) {
        bin_content = this._yapi.imm_str2bin(bin_content);
      } else if (bin_content instanceof Array) {
        bin_content = new Uint8Array(bin_content);
      }
      return this._yapi.devRequest(devid, httpreq, new YHTTPBody(str_path, bin_content, fun_progressCb), 0);
    });
  }
  _uploadEx(str_path, bin_content) {
    return __awaiter(this, void 0, void 0, function* () {
      let yreq = yield this._uploadWithProgress(str_path, bin_content, null);
      if (yreq.errorType != YAPI_SUCCESS) {
        return this._throw(yreq.errorType, yreq.errorMsg, null);
      }
      return yreq.bin_result;
    });
  }
  _upload(str_path, bin_content) {
    return __awaiter(this, void 0, void 0, function* () {
      let yreq = yield this._uploadWithProgress(str_path, bin_content, null);
      if (yreq.errorType != YAPI_SUCCESS) {
        return this._throw(yreq.errorType, yreq.errorMsg, null);
      }
      return yreq.errorType;
    });
  }
  wait_async(callback, context) {
    let devid = this._serial;
    if (devid == "") {
      this.module().then((module) => module.get_serialNumber().then(() => this.wait_async(callback, context)));
      return YAPI_SUCCESS;
    }
    if (devid == YAPI_INVALID_STRING) {
      callback(context, this);
      return YAPI_SUCCESS;
    }
    let lockdev = this._yapi.imm_getDevice(devid);
    let delayedCode = () => {
      callback(context, this);
    };
    lockdev._pendingQueries = lockdev._pendingQueries.then(delayedCode, delayedCode);
    return YAPI_SUCCESS;
  }
  imm_json_get_key(bin_jsonbuff, str_key) {
    let loadval = JSON.parse(this._yapi.imm_bin2str(bin_jsonbuff));
    if (typeof loadval[str_key] != "undefined") {
      return loadval[str_key];
    }
    return "";
  }
  imm_json_get_string(bin_jsonbuff) {
    return JSON.parse(this._yapi.imm_bin2str(bin_jsonbuff));
  }
  imm_json_get_array(bin_jsonbuff) {
    let loadval = JSON.parse(this._yapi.imm_bin2str(bin_jsonbuff));
    let res = [];
    for (let idx in loadval) {
      res.push(JSON.stringify(loadval[idx]));
    }
    return res;
  }
  imm_get_json_path(str_json, str_path) {
    let json = JSON.parse(str_json);
    let paths = str_path.split("|");
    for (let i = 0; i < paths.length; i++) {
      let tmp = paths[i];
      json = json[tmp];
      if (json == void 0) {
        return "";
      }
    }
    return JSON.stringify(json);
  }
  imm_decode_json_string(str_json) {
    if (str_json === "") {
      return "";
    }
    return JSON.parse(str_json);
  }
  imm_findDataStream(obj_dataset, str_def) {
    let key = obj_dataset.imm_get_functionId() + ":" + str_def;
    if (this._dataStreams[key])
      return this._dataStreams[key];
    let words = this._yapi.imm_decodeWords(str_def);
    if (words.length < 14) {
      this._throw(YAPI.VERSION_MISMATCH, "device firwmare is too old", null);
      return null;
    }
    let newDataStream = new YDataStream(this, obj_dataset, words);
    this._dataStreams[key] = newDataStream;
    return newDataStream;
  }
  clearDataStreamCache() {
    return __awaiter(this, void 0, void 0, function* () {
      this._dataStreams = {};
    });
  }
  isOnline() {
    return __awaiter(this, void 0, void 0, function* () {
      if (this._cacheExpiration > this._yapi.GetTickCount())
        return true;
      let yreq = yield this._yapi.funcRequest(this._className, this._func, "", this._yapi.defaultCacheValidity);
      if (yreq.errorType != YAPI_SUCCESS) {
        return yreq.errorType == YAPI_DEVICE_BUSY;
      }
      yield this._parse(yreq, this._yapi.defaultCacheValidity);
      return true;
    });
  }
  get_errorType() {
    return this._lastErrorType;
  }
  get_errorMessage() {
    return this._lastErrorMsg;
  }
  load(msValidity) {
    return __awaiter(this, void 0, void 0, function* () {
      let yreq = yield this._yapi.funcRequest(this._className, this._func, "", msValidity);
      if (yreq.errorType != YAPI_SUCCESS) {
        return this._throw(yreq.errorType, yreq.errorMsg, yreq.errorType);
      }
      yield this._parse(yreq, msValidity);
      return YAPI_SUCCESS;
    });
  }
  clearCache() {
    return __awaiter(this, void 0, void 0, function* () {
      let devreq = yield this._yapi._funcDev(this._className, this._func);
      if (devreq.errorType != YAPI_SUCCESS) {
        return;
      }
      devreq.obj_result.device.imm_dropCache();
      if (this._cacheExpiration > 0) {
        this._cacheExpiration = this._yapi.GetTickCount();
      }
    });
  }
  module() {
    return __awaiter(this, void 0, void 0, function* () {
      if (this._serial != "") {
        return YModule.FindModuleInContext(this._yapi, this._serial + ".module");
      }
      let hwid = this._func;
      let resolve;
      if (hwid.indexOf(".") < 0) {
        resolve = this._yapi.imm_resolveFunction(this._className, this._func);
        if (resolve.errorType == YAPI_SUCCESS)
          hwid = resolve.result;
      }
      let dotidx = hwid.indexOf(".");
      if (dotidx >= 0) {
        return YModule.FindModuleInContext(this._yapi, hwid.substr(0, dotidx) + ".module");
      }
      if ((yield this.load(this._yapi.defaultCacheValidity)) == YAPI_SUCCESS) {
        resolve = this._yapi.imm_resolveFunction(this._className, this._func);
        if (resolve.result)
          hwid = resolve.result;
      }
      dotidx = hwid.indexOf(".");
      if (dotidx >= 0) {
        return YModule.FindModuleInContext(this._yapi, hwid.substr(0, dotidx) + ".module");
      }
      return YModule.FindModuleInContext(this._yapi, "module_of_" + this._className + "_" + this._func);
    });
  }
  get_module() {
    return __awaiter(this, void 0, void 0, function* () {
      return this.module();
    });
  }
  get_functionDescriptor() {
    return __awaiter(this, void 0, void 0, function* () {
      if (this._hwId != "") {
        return this._hwId;
      }
      let hwid = this._func;
      if (hwid.indexOf(".") < 0) {
        let resolve = this._yapi.imm_resolveFunction(this._className, this._func);
        if (resolve.errorType != YAPI_SUCCESS)
          hwid = resolve.result;
      }
      let dotidx = hwid.indexOf(".");
      if (dotidx >= 0) {
        return hwid;
      }
      return Y_FUNCTIONDESCRIPTOR_INVALID;
    });
  }
  get_userData() {
    return __awaiter(this, void 0, void 0, function* () {
      return this._userData;
    });
  }
  set_userData(data) {
    return __awaiter(this, void 0, void 0, function* () {
      this._userData = data;
    });
  }
};
YFunction.LOGICALNAME_INVALID = YAPI_INVALID_STRING;
YFunction.ADVERTISEDVALUE_INVALID = YAPI_INVALID_STRING;
(function(YFunction2) {
  YFunction2.FUNCTIONDESCRIPTOR_INVALID = YAPI_INVALID_STRING;
  YFunction2.HARDWAREID_INVALID = YAPI_INVALID_STRING;
  YFunction2.FUNCTIONID_INVALID = YAPI_INVALID_STRING;
  YFunction2.FRIENDLYNAME_INVALID = YAPI_INVALID_STRING;
})(YFunction || (YFunction = {}));
var YModule = class extends YFunction {
  constructor(yapi, func) {
    super(yapi, func);
    this._productName = YModule.PRODUCTNAME_INVALID;
    this._serialNumber = YModule.SERIALNUMBER_INVALID;
    this._productId = YModule.PRODUCTID_INVALID;
    this._productRelease = YModule.PRODUCTRELEASE_INVALID;
    this._firmwareRelease = YModule.FIRMWARERELEASE_INVALID;
    this._persistentSettings = YModule.PERSISTENTSETTINGS_INVALID;
    this._luminosity = YModule.LUMINOSITY_INVALID;
    this._beacon = YModule.BEACON_INVALID;
    this._upTime = YModule.UPTIME_INVALID;
    this._usbCurrent = YModule.USBCURRENT_INVALID;
    this._rebootCountdown = YModule.REBOOTCOUNTDOWN_INVALID;
    this._userVar = YModule.USERVAR_INVALID;
    this._valueCallbackModule = null;
    this._logCallback = null;
    this._confChangeCallback = null;
    this._beaconCallback = null;
    this.PRODUCTNAME_INVALID = YAPI_INVALID_STRING;
    this.SERIALNUMBER_INVALID = YAPI_INVALID_STRING;
    this.PRODUCTID_INVALID = YAPI_INVALID_UINT;
    this.PRODUCTRELEASE_INVALID = YAPI_INVALID_UINT;
    this.FIRMWARERELEASE_INVALID = YAPI_INVALID_STRING;
    this.PERSISTENTSETTINGS_LOADED = 0;
    this.PERSISTENTSETTINGS_SAVED = 1;
    this.PERSISTENTSETTINGS_MODIFIED = 2;
    this.PERSISTENTSETTINGS_INVALID = -1;
    this.LUMINOSITY_INVALID = YAPI_INVALID_UINT;
    this.BEACON_OFF = 0;
    this.BEACON_ON = 1;
    this.BEACON_INVALID = -1;
    this.UPTIME_INVALID = YAPI_INVALID_LONG;
    this.USBCURRENT_INVALID = YAPI_INVALID_UINT;
    this.REBOOTCOUNTDOWN_INVALID = YAPI_INVALID_INT;
    this.USERVAR_INVALID = YAPI_INVALID_INT;
    this._className = "Module";
    let devid = this._func;
    let dotidx = devid.indexOf(".");
    if (dotidx > 0)
      devid = devid.substr(0, dotidx);
    let dev = this._yapi.imm_getDevice(devid);
    if (dev) {
      this._serial = dev.imm_getSerialNumber();
      this._funId = "module";
      this._hwId = this._serial + ".module";
    }
  }
  _throw(int_errType, str_errMsg, obj_retVal) {
    this._lastErrorType = int_errType;
    this._lastErrorMsg = str_errMsg;
    return this._yapi._throw(int_errType, str_errMsg, obj_retVal);
  }
  static _updateModuleCallbackList(YModule_module, bool_add) {
    return __awaiter(this, void 0, void 0, function* () {
    });
  }
  imm_getDev() {
    let devid = this._func;
    let dotidx = devid.indexOf(".");
    if (dotidx > 0)
      devid = devid.substr(0, dotidx);
    let dev = this._yapi.imm_getDevice(devid);
    if (!dev) {
      this._throw(YAPI_DEVICE_NOT_FOUND, "Device [" + devid + "] is not online", null);
    }
    return dev;
  }
  forceDeviceRefresh() {
    return __awaiter(this, void 0, void 0, function* () {
      let dev = this.imm_getDev();
      if (!dev || !this._serial)
        return;
      yield this._yapi.ForceDeviceRefresh(this._serial);
      if (this._cacheExpiration > 0) {
        this._cacheExpiration = this._yapi.GetTickCount();
      }
    });
  }
  functionCount() {
    return __awaiter(this, void 0, void 0, function* () {
      let dev = this.imm_getDev();
      if (!dev)
        return YAPI_DEVICE_NOT_FOUND;
      return dev.imm_functionCount();
    });
  }
  functionId(functionIndex) {
    return __awaiter(this, void 0, void 0, function* () {
      let dev = this.imm_getDev();
      if (!dev)
        return "";
      return dev.imm_functionId(functionIndex);
    });
  }
  functionType(functionIndex) {
    return __awaiter(this, void 0, void 0, function* () {
      let dev = this.imm_getDev();
      if (!dev)
        return "";
      return dev.imm_functionType(functionIndex);
    });
  }
  functionBaseType(functionIndex) {
    return __awaiter(this, void 0, void 0, function* () {
      let dev = this.imm_getDev();
      if (!dev)
        return "";
      return dev.imm_functionBaseType(functionIndex);
    });
  }
  functionName(functionIndex) {
    return __awaiter(this, void 0, void 0, function* () {
      let dev = this.imm_getDev();
      if (!dev)
        return "";
      return dev.imm_functionName(functionIndex);
    });
  }
  functionValue(functionIndex) {
    return __awaiter(this, void 0, void 0, function* () {
      let dev = this.imm_getDev();
      if (!dev)
        return "";
      return dev.imm_functionValue(functionIndex);
    });
  }
  get_logicalName() {
    return __awaiter(this, void 0, void 0, function* () {
      let dev = this.imm_getDev();
      if (dev != null && this._cache._expiration <= this._yapi.GetTickCount()) {
        return dev.getLogicalName();
      }
      let json_val = yield this._getAttr("logicalName");
      return json_val == null ? YModule.LOGICALNAME_INVALID : json_val;
    });
  }
  set_logicalName(newval) {
    const _super = Object.create(null, {
      set_logicalName: {get: () => super.set_logicalName}
    });
    return __awaiter(this, void 0, void 0, function* () {
      let res = yield _super.set_logicalName.call(this, newval);
      let dev = this.imm_getDev();
      if (dev != null) {
        dev.imm_dropCache();
      }
      return res;
    });
  }
  imm_flattenJsonStruct_internal(jsoncomplex) {
    let decoded = JSON.parse(this._yapi.imm_bin2str(jsoncomplex));
    let attrs = [];
    for (let function_name in decoded) {
      if (function_name == "services")
        continue;
      let function_attrs = decoded[function_name];
      for (let attr_name in function_attrs) {
        let attr_value = function_attrs[attr_name];
        if (attr_value === null || typeof attr_value === "object") {
          continue;
        }
        let flat = function_name + "/" + attr_name + "=" + attr_value;
        attrs.push(flat);
      }
    }
    return this._yapi.imm_str2bin(JSON.stringify(attrs));
  }
  get_subDevices_internal() {
    return __awaiter(this, void 0, void 0, function* () {
      let baseUrl = yield this.get_url_internal();
      if (!baseUrl) {
        return [];
      }
      let hub = null;
      let hubUrl = "";
      for (let i = 0; i < this._yapi._hubs.length; i++) {
        hubUrl = this._yapi._hubs[i].urlInfo.url;
        if (baseUrl.slice(0, hubUrl.length) == hubUrl) {
          hub = this._yapi._hubs[i];
          break;
        }
      }
      if (!hub || !hubUrl) {
        return [];
      }
      let hubSerial = hub.serialByYdx[0];
      if (hubSerial != this._serial) {
        return [];
      }
      let res = [];
      for (let serial in this._yapi._devs) {
        let rooturl = this._yapi._devs[serial].imm_getRootUrl();
        if (rooturl.substr(0, hubUrl.length) == hubUrl) {
          res.push(serial);
        }
      }
      return res;
    });
  }
  get_parentHub_internal() {
    return __awaiter(this, void 0, void 0, function* () {
      let baseUrl = yield this.get_url_internal();
      if (!baseUrl) {
        return "";
      }
      let hub = null;
      for (let i = 0; i < this._yapi._hubs.length; i++) {
        let hubUrl = this._yapi._hubs[i].urlInfo.url;
        if (baseUrl.slice(0, hubUrl.length) == hubUrl) {
          hub = this._yapi._hubs[i];
          break;
        }
      }
      if (!hub) {
        return "";
      }
      let hubSerial = hub.serialByYdx[0];
      if (hubSerial == this._serial) {
        return "";
      }
      return hubSerial;
    });
  }
  get_url_internal() {
    return __awaiter(this, void 0, void 0, function* () {
      let devid = this._serial;
      if (devid == "") {
        devid = yield this.get_serialNumber();
      }
      if (devid == YAPI_INVALID_STRING) {
        return "";
      }
      let lockdev = this._yapi.imm_getDevice(devid);
      if (!lockdev) {
        return "";
      }
      return lockdev.imm_getRootUrl();
    });
  }
  _startStopDevLog_internal(str_serial, bool_start) {
    return __awaiter(this, void 0, void 0, function* () {
      let dev = this.imm_getDev();
      if (dev != null) {
        return dev.imm_registerLogCallback(this._logCallback);
      }
    });
  }
  imm_parseAttr(name, val) {
    switch (name) {
      case "productName":
        this._productName = val;
        return 1;
      case "serialNumber":
        this._serialNumber = val;
        return 1;
      case "productId":
        this._productId = val;
        return 1;
      case "productRelease":
        this._productRelease = val;
        return 1;
      case "firmwareRelease":
        this._firmwareRelease = val;
        return 1;
      case "persistentSettings":
        this._persistentSettings = val;
        return 1;
      case "luminosity":
        this._luminosity = val;
        return 1;
      case "beacon":
        this._beacon = val;
        return 1;
      case "upTime":
        this._upTime = val;
        return 1;
      case "usbCurrent":
        this._usbCurrent = val;
        return 1;
      case "rebootCountdown":
        this._rebootCountdown = val;
        return 1;
      case "userVar":
        this._userVar = val;
        return 1;
    }
    return super.imm_parseAttr(name, val);
  }
  get_productName() {
    return __awaiter(this, void 0, void 0, function* () {
      let res;
      let dev;
      if (this._cacheExpiration == 0) {
        dev = this.imm_getDev();
        if (!(dev == null)) {
          return dev.imm_getProductName();
        }
        if ((yield this.load(this._yapi.defaultCacheValidity)) != YAPI_SUCCESS) {
          return YModule.PRODUCTNAME_INVALID;
        }
      }
      res = this._productName;
      return res;
    });
  }
  get_serialNumber() {
    return __awaiter(this, void 0, void 0, function* () {
      let res;
      let dev;
      if (this._cacheExpiration == 0) {
        dev = this.imm_getDev();
        if (!(dev == null)) {
          return dev.imm_getSerialNumber();
        }
        if ((yield this.load(this._yapi.defaultCacheValidity)) != YAPI_SUCCESS) {
          return YModule.SERIALNUMBER_INVALID;
        }
      }
      res = this._serialNumber;
      return res;
    });
  }
  get_productId() {
    return __awaiter(this, void 0, void 0, function* () {
      let res;
      let dev;
      if (this._cacheExpiration == 0) {
        dev = this.imm_getDev();
        if (!(dev == null)) {
          return dev.imm_getProductId();
        }
        if ((yield this.load(this._yapi.defaultCacheValidity)) != YAPI_SUCCESS) {
          return YModule.PRODUCTID_INVALID;
        }
      }
      res = this._productId;
      return res;
    });
  }
  get_productRelease() {
    return __awaiter(this, void 0, void 0, function* () {
      let res;
      if (this._cacheExpiration == 0) {
        if ((yield this.load(this._yapi.defaultCacheValidity)) != YAPI_SUCCESS) {
          return YModule.PRODUCTRELEASE_INVALID;
        }
      }
      res = this._productRelease;
      return res;
    });
  }
  get_firmwareRelease() {
    return __awaiter(this, void 0, void 0, function* () {
      let res;
      if (this._cacheExpiration <= this._yapi.GetTickCount()) {
        if ((yield this.load(this._yapi.defaultCacheValidity)) != YAPI_SUCCESS) {
          return YModule.FIRMWARERELEASE_INVALID;
        }
      }
      res = this._firmwareRelease;
      return res;
    });
  }
  get_persistentSettings() {
    return __awaiter(this, void 0, void 0, function* () {
      let res;
      if (this._cacheExpiration <= this._yapi.GetTickCount()) {
        if ((yield this.load(this._yapi.defaultCacheValidity)) != YAPI_SUCCESS) {
          return YModule.PERSISTENTSETTINGS_INVALID;
        }
      }
      res = this._persistentSettings;
      return res;
    });
  }
  set_persistentSettings(newval) {
    return __awaiter(this, void 0, void 0, function* () {
      let rest_val;
      rest_val = String(newval);
      return yield this._setAttr("persistentSettings", rest_val);
    });
  }
  get_luminosity() {
    return __awaiter(this, void 0, void 0, function* () {
      let res;
      if (this._cacheExpiration <= this._yapi.GetTickCount()) {
        if ((yield this.load(this._yapi.defaultCacheValidity)) != YAPI_SUCCESS) {
          return YModule.LUMINOSITY_INVALID;
        }
      }
      res = this._luminosity;
      return res;
    });
  }
  set_luminosity(newval) {
    return __awaiter(this, void 0, void 0, function* () {
      let rest_val;
      rest_val = String(newval);
      return yield this._setAttr("luminosity", rest_val);
    });
  }
  get_beacon() {
    return __awaiter(this, void 0, void 0, function* () {
      let res;
      let dev;
      if (this._cacheExpiration <= this._yapi.GetTickCount()) {
        dev = this.imm_getDev();
        if (!(dev == null)) {
          return dev.imm_getBeacon();
        }
        if ((yield this.load(this._yapi.defaultCacheValidity)) != YAPI_SUCCESS) {
          return YModule.BEACON_INVALID;
        }
      }
      res = this._beacon;
      return res;
    });
  }
  set_beacon(newval) {
    return __awaiter(this, void 0, void 0, function* () {
      let rest_val;
      rest_val = String(newval);
      return yield this._setAttr("beacon", rest_val);
    });
  }
  get_upTime() {
    return __awaiter(this, void 0, void 0, function* () {
      let res;
      if (this._cacheExpiration <= this._yapi.GetTickCount()) {
        if ((yield this.load(this._yapi.defaultCacheValidity)) != YAPI_SUCCESS) {
          return YModule.UPTIME_INVALID;
        }
      }
      res = this._upTime;
      return res;
    });
  }
  get_usbCurrent() {
    return __awaiter(this, void 0, void 0, function* () {
      let res;
      if (this._cacheExpiration <= this._yapi.GetTickCount()) {
        if ((yield this.load(this._yapi.defaultCacheValidity)) != YAPI_SUCCESS) {
          return YModule.USBCURRENT_INVALID;
        }
      }
      res = this._usbCurrent;
      return res;
    });
  }
  get_rebootCountdown() {
    return __awaiter(this, void 0, void 0, function* () {
      let res;
      if (this._cacheExpiration <= this._yapi.GetTickCount()) {
        if ((yield this.load(this._yapi.defaultCacheValidity)) != YAPI_SUCCESS) {
          return YModule.REBOOTCOUNTDOWN_INVALID;
        }
      }
      res = this._rebootCountdown;
      return res;
    });
  }
  set_rebootCountdown(newval) {
    return __awaiter(this, void 0, void 0, function* () {
      let rest_val;
      rest_val = String(newval);
      return yield this._setAttr("rebootCountdown", rest_val);
    });
  }
  get_userVar() {
    return __awaiter(this, void 0, void 0, function* () {
      let res;
      if (this._cacheExpiration <= this._yapi.GetTickCount()) {
        if ((yield this.load(this._yapi.defaultCacheValidity)) != YAPI_SUCCESS) {
          return YModule.USERVAR_INVALID;
        }
      }
      res = this._userVar;
      return res;
    });
  }
  set_userVar(newval) {
    return __awaiter(this, void 0, void 0, function* () {
      let rest_val;
      rest_val = String(newval);
      return yield this._setAttr("userVar", rest_val);
    });
  }
  static FindModule(func) {
    let obj;
    let cleanHwId;
    let modpos;
    cleanHwId = func;
    modpos = func.indexOf(".module");
    if (modpos != func.length - 7) {
      cleanHwId = func + ".module";
    }
    obj = YFunction._FindFromCache("Module", cleanHwId);
    if (obj == null) {
      obj = new YModule(YAPI, cleanHwId);
      YFunction._AddToCache("Module", cleanHwId, obj);
    }
    return obj;
  }
  static FindModuleInContext(yctx, func) {
    let obj;
    let cleanHwId;
    let modpos;
    cleanHwId = func;
    modpos = func.indexOf(".module");
    if (modpos != func.length - 7) {
      cleanHwId = func + ".module";
    }
    obj = YFunction._FindFromCacheInContext(yctx, "Module", cleanHwId);
    if (obj == null) {
      obj = new YModule(yctx, cleanHwId);
      YFunction._AddToCache("Module", cleanHwId, obj);
    }
    return obj;
  }
  registerValueCallback(callback) {
    return __awaiter(this, void 0, void 0, function* () {
      let val;
      if (callback != null) {
        yield YFunction._UpdateValueCallbackList(this, true);
      } else {
        yield YFunction._UpdateValueCallbackList(this, false);
      }
      this._valueCallbackModule = callback;
      if (callback != null && (yield this.isOnline())) {
        val = this._advertisedValue;
        if (!(val == "")) {
          yield this._invokeValueCallback(val);
        }
      }
      return 0;
    });
  }
  _invokeValueCallback(value) {
    const _super = Object.create(null, {
      _invokeValueCallback: {get: () => super._invokeValueCallback}
    });
    return __awaiter(this, void 0, void 0, function* () {
      if (this._valueCallbackModule != null) {
        try {
          yield this._valueCallbackModule(this, value);
        } catch (e) {
          this._yapi.imm_log("Exception in valueCallback:", e);
        }
      } else {
        _super._invokeValueCallback.call(this, value);
      }
      return 0;
    });
  }
  get_productNameAndRevision() {
    return __awaiter(this, void 0, void 0, function* () {
      let prodname;
      let prodrel;
      let fullname;
      prodname = yield this.get_productName();
      prodrel = yield this.get_productRelease();
      if (prodrel > 1) {
        fullname = prodname + " rev. " + String.fromCharCode(64 + prodrel);
      } else {
        fullname = prodname;
      }
      return fullname;
    });
  }
  saveToFlash() {
    return __awaiter(this, void 0, void 0, function* () {
      return yield this.set_persistentSettings(1);
    });
  }
  revertFromFlash() {
    return __awaiter(this, void 0, void 0, function* () {
      return yield this.set_persistentSettings(0);
    });
  }
  reboot(secBeforeReboot) {
    return __awaiter(this, void 0, void 0, function* () {
      return yield this.set_rebootCountdown(secBeforeReboot);
    });
  }
  triggerFirmwareUpdate(secBeforeReboot) {
    return __awaiter(this, void 0, void 0, function* () {
      return yield this.set_rebootCountdown(-secBeforeReboot);
    });
  }
  _startStopDevLog(serial, start) {
    return __awaiter(this, void 0, void 0, function* () {
      return yield this._startStopDevLog_internal(serial, start);
    });
  }
  registerLogCallback(callback) {
    return __awaiter(this, void 0, void 0, function* () {
      let serial;
      serial = yield this.get_serialNumber();
      if (serial == YAPI_INVALID_STRING) {
        return YAPI_DEVICE_NOT_FOUND;
      }
      this._logCallback = callback;
      yield this._startStopDevLog(serial, callback != null);
      return 0;
    });
  }
  get_logCallback() {
    return __awaiter(this, void 0, void 0, function* () {
      return this._logCallback;
    });
  }
  registerConfigChangeCallback(callback) {
    return __awaiter(this, void 0, void 0, function* () {
      if (callback != null) {
        yield YModule._updateModuleCallbackList(this, true);
      } else {
        yield YModule._updateModuleCallbackList(this, false);
      }
      this._confChangeCallback = callback;
      return 0;
    });
  }
  _invokeConfigChangeCallback() {
    return __awaiter(this, void 0, void 0, function* () {
      if (this._confChangeCallback != null) {
        try {
          yield this._confChangeCallback(this);
        } catch (e) {
          this._yapi.imm_log("Exception in configChangeCallback:", e);
        }
      }
      return 0;
    });
  }
  registerBeaconCallback(callback) {
    return __awaiter(this, void 0, void 0, function* () {
      if (callback != null) {
        yield YModule._updateModuleCallbackList(this, true);
      } else {
        yield YModule._updateModuleCallbackList(this, false);
      }
      this._beaconCallback = callback;
      return 0;
    });
  }
  _invokeBeaconCallback(beaconState) {
    return __awaiter(this, void 0, void 0, function* () {
      if (this._beaconCallback != null) {
        try {
          yield this._beaconCallback(this, beaconState);
        } catch (e) {
          this._yapi.imm_log("Exception in beaconCallback:", e);
        }
      }
      return 0;
    });
  }
  triggerConfigChangeCallback() {
    return __awaiter(this, void 0, void 0, function* () {
      yield this._setAttr("persistentSettings", "2");
      return 0;
    });
  }
  checkFirmware(path, onlynew) {
    return __awaiter(this, void 0, void 0, function* () {
      let serial;
      let release;
      let tmp_res;
      if (onlynew) {
        release = this._yapi.imm_atoi(yield this.get_firmwareRelease());
      } else {
        release = 0;
      }
      serial = yield this.get_serialNumber();
      tmp_res = yield YFirmwareUpdate.CheckFirmware(serial, path, release);
      if (tmp_res.indexOf("error:") == 0) {
        this._throw(YAPI_INVALID_ARGUMENT, tmp_res);
      }
      return tmp_res;
    });
  }
  updateFirmwareEx(path, force) {
    return __awaiter(this, void 0, void 0, function* () {
      let serial;
      let settings;
      serial = yield this.get_serialNumber();
      settings = yield this.get_allSettings();
      if (settings.length == 0) {
        this._throw(YAPI_IO_ERROR, "Unable to get device settings");
        settings = this._yapi.imm_str2bin("error:Unable to get device settings");
      }
      return new YFirmwareUpdate(this._yapi, serial, path, settings, force);
    });
  }
  updateFirmware(path) {
    return __awaiter(this, void 0, void 0, function* () {
      return yield this.updateFirmwareEx(path, false);
    });
  }
  get_allSettings() {
    return __awaiter(this, void 0, void 0, function* () {
      let settings;
      let json;
      let res;
      let sep;
      let name;
      let item;
      let t_type;
      let id;
      let url;
      let file_data;
      let file_data_bin;
      let temp_data_bin;
      let ext_settings;
      let filelist = [];
      let templist = [];
      settings = yield this._download("api.json");
      if (settings.length == 0) {
        return settings;
      }
      ext_settings = ', "extras":[';
      templist = yield this.get_functionIds("Temperature");
      sep = "";
      for (let ii in templist) {
        if (this._yapi.imm_atoi(yield this.get_firmwareRelease()) > 9e3) {
          url = "api/" + templist[ii] + "/sensorType";
          t_type = this._yapi.imm_bin2str(yield this._download(url));
          if (t_type == "RES_NTC" || t_type == "RES_LINEAR") {
            id = templist[ii].substr(11, templist[ii].length - 11);
            if (id == "") {
              id = "1";
            }
            temp_data_bin = yield this._download("extra.json?page=" + id);
            if (temp_data_bin.length > 0) {
              item = sep + '{"fid":"' + templist[ii] + '", "json":' + this._yapi.imm_bin2str(temp_data_bin) + "}\n";
              ext_settings = ext_settings + item;
              sep = ",";
            }
          }
        }
      }
      ext_settings = ext_settings + '],\n"files":[';
      if (yield this.hasFunction("files")) {
        json = yield this._download("files.json?a=dir&f=");
        if (json.length == 0) {
          return json;
        }
        filelist = this.imm_json_get_array(json);
        sep = "";
        for (let ii in filelist) {
          name = this.imm_json_get_key(this._yapi.imm_str2bin(filelist[ii]), "name");
          if (name.length > 0 && !(name == "startupConf.json")) {
            file_data_bin = yield this._download(this.imm_escapeAttr(name));
            file_data = this._yapi.imm_bin2hexstr(file_data_bin);
            item = sep + '{"name":"' + name + '", "data":"' + file_data + '"}\n';
            ext_settings = ext_settings + item;
            sep = ",";
          }
        }
      }
      res = this._yapi.imm_str2bin('{ "api":' + this._yapi.imm_bin2str(settings) + ext_settings + "]}");
      return res;
    });
  }
  loadThermistorExtra(funcId, jsonExtra) {
    return __awaiter(this, void 0, void 0, function* () {
      let values = [];
      let url;
      let curr;
      let currTemp;
      let ofs;
      let size;
      url = "api/" + funcId + ".json?command=Z";
      yield this._download(url);
      values = this.imm_json_get_array(this._yapi.imm_str2bin(jsonExtra));
      ofs = 0;
      size = values.length;
      while (ofs + 1 < size) {
        curr = values[ofs];
        currTemp = values[ofs + 1];
        url = "api/" + funcId + ".json?command=m" + curr + ":" + currTemp;
        yield this._download(url);
        ofs = ofs + 2;
      }
      return YAPI_SUCCESS;
    });
  }
  set_extraSettings(jsonExtra) {
    return __awaiter(this, void 0, void 0, function* () {
      let extras = [];
      let functionId;
      let data;
      extras = this.imm_json_get_array(this._yapi.imm_str2bin(jsonExtra));
      for (let ii in extras) {
        functionId = this.imm_get_json_path(extras[ii], "fid");
        functionId = this.imm_decode_json_string(functionId);
        data = this.imm_get_json_path(extras[ii], "json");
        if (yield this.hasFunction(functionId)) {
          yield this.loadThermistorExtra(functionId, data);
        }
      }
      return YAPI_SUCCESS;
    });
  }
  set_allSettingsAndFiles(settings) {
    return __awaiter(this, void 0, void 0, function* () {
      let down;
      let json;
      let json_api;
      let json_files;
      let json_extra;
      let fuperror;
      let globalres;
      fuperror = 0;
      json = this._yapi.imm_bin2str(settings);
      json_api = this.imm_get_json_path(json, "api");
      if (json_api == "") {
        return yield this.set_allSettings(settings);
      }
      json_extra = this.imm_get_json_path(json, "extras");
      if (!(json_extra == "")) {
        yield this.set_extraSettings(json_extra);
      }
      yield this.set_allSettings(this._yapi.imm_str2bin(json_api));
      if (yield this.hasFunction("files")) {
        let files = [];
        let res;
        let name;
        let data;
        down = yield this._download("files.json?a=format");
        res = this.imm_get_json_path(this._yapi.imm_bin2str(down), "res");
        res = this.imm_decode_json_string(res);
        if (!(res == "ok")) {
          return this._throw(YAPI_IO_ERROR, "format failed", YAPI_IO_ERROR);
        }
        json_files = this.imm_get_json_path(json, "files");
        files = this.imm_json_get_array(this._yapi.imm_str2bin(json_files));
        for (let ii in files) {
          name = this.imm_get_json_path(files[ii], "name");
          name = this.imm_decode_json_string(name);
          data = this.imm_get_json_path(files[ii], "data");
          data = this.imm_decode_json_string(data);
          if (name == "") {
            fuperror = fuperror + 1;
          } else {
            yield this._upload(name, this._yapi.imm_hexstr2bin(data));
          }
        }
      }
      globalres = yield this.set_allSettings(this._yapi.imm_str2bin(json_api));
      if (!(fuperror == 0)) {
        return this._throw(YAPI_IO_ERROR, "Error during file upload", YAPI_IO_ERROR);
      }
      return globalres;
    });
  }
  hasFunction(funcId) {
    return __awaiter(this, void 0, void 0, function* () {
      let count;
      let i;
      let fid;
      count = yield this.functionCount();
      i = 0;
      while (i < count) {
        fid = yield this.functionId(i);
        if (fid == funcId) {
          return true;
        }
        i = i + 1;
      }
      return false;
    });
  }
  get_functionIds(funType) {
    return __awaiter(this, void 0, void 0, function* () {
      let count;
      let i;
      let ftype;
      let res = [];
      count = yield this.functionCount();
      i = 0;
      while (i < count) {
        ftype = yield this.functionType(i);
        if (ftype == funType) {
          res.push(yield this.functionId(i));
        } else {
          ftype = yield this.functionBaseType(i);
          if (ftype == funType) {
            res.push(yield this.functionId(i));
          }
        }
        i = i + 1;
      }
      return res;
    });
  }
  imm_flattenJsonStruct(jsoncomplex) {
    return this.imm_flattenJsonStruct_internal(jsoncomplex);
  }
  calibVersion(cparams) {
    return __awaiter(this, void 0, void 0, function* () {
      if (cparams == "0,") {
        return 3;
      }
      if (cparams.indexOf(",") >= 0) {
        if (cparams.indexOf(" ") > 0) {
          return 3;
        } else {
          return 1;
        }
      }
      if (cparams == "" || cparams == "0") {
        return 1;
      }
      if (cparams.length < 2 || cparams.indexOf(".") >= 0) {
        return 0;
      } else {
        return 2;
      }
    });
  }
  calibScale(unit_name, sensorType) {
    return __awaiter(this, void 0, void 0, function* () {
      if (unit_name == "g" || unit_name == "gauss" || unit_name == "W") {
        return 1e3;
      }
      if (unit_name == "C") {
        if (sensorType == "") {
          return 16;
        }
        if (this._yapi.imm_atoi(sensorType) < 8) {
          return 16;
        } else {
          return 100;
        }
      }
      if (unit_name == "m" || unit_name == "deg") {
        return 10;
      }
      return 1;
    });
  }
  calibOffset(unit_name) {
    return __awaiter(this, void 0, void 0, function* () {
      if (unit_name == "% RH" || unit_name == "mbar" || unit_name == "lx") {
        return 0;
      }
      return 32767;
    });
  }
  calibConvert(param, currentFuncValue, unit_name, sensorType) {
    return __awaiter(this, void 0, void 0, function* () {
      let paramVer;
      let funVer;
      let funScale;
      let funOffset;
      let paramScale;
      let paramOffset;
      let words = [];
      let words_str = [];
      let calibData = [];
      let iCalib = [];
      let calibType;
      let i;
      let maxSize;
      let ratio;
      let nPoints;
      let wordVal;
      paramVer = yield this.calibVersion(param);
      funVer = yield this.calibVersion(currentFuncValue);
      funScale = yield this.calibScale(unit_name, sensorType);
      funOffset = yield this.calibOffset(unit_name);
      paramScale = funScale;
      paramOffset = funOffset;
      if (funVer < 3) {
        if (funVer == 2) {
          words = this._yapi.imm_decodeWords(currentFuncValue);
          if (words[0] == 1366 && words[1] == 12500) {
            funScale = 1;
            funOffset = 0;
          } else {
            funScale = words[1];
            funOffset = words[0];
          }
        } else {
          if (funVer == 1) {
            if (currentFuncValue == "" || this._yapi.imm_atoi(currentFuncValue) > 10) {
              funScale = 0;
            }
          }
        }
      }
      calibData.length = 0;
      calibType = 0;
      if (paramVer < 3) {
        if (paramVer == 2) {
          words = this._yapi.imm_decodeWords(param);
          if (words[0] == 1366 && words[1] == 12500) {
            paramScale = 1;
            paramOffset = 0;
          } else {
            paramScale = words[1];
            paramOffset = words[0];
          }
          if (words.length >= 3 && words[2] > 0) {
            maxSize = 3 + 2 * (words[2] % 10);
            if (maxSize > words.length) {
              maxSize = words.length;
            }
            i = 3;
            while (i < maxSize) {
              calibData.push(words[i]);
              i = i + 1;
            }
          }
        } else {
          if (paramVer == 1) {
            words_str = param.split(",");
            for (let ii in words_str) {
              words.push(this._yapi.imm_atoi(words_str[ii]));
            }
            if (param == "" || words[0] > 10) {
              paramScale = 0;
            }
            if (words.length > 0 && words[0] > 0) {
              maxSize = 1 + 2 * (words[0] % 10);
              if (maxSize > words.length) {
                maxSize = words.length;
              }
              i = 1;
              while (i < maxSize) {
                calibData.push(words[i]);
                i = i + 1;
              }
            }
          } else {
            if (paramVer == 0) {
              ratio = parseFloat(param);
              if (ratio > 0) {
                calibData.push(0);
                calibData.push(0);
                calibData.push(Math.round(65535 / ratio));
                calibData.push(65535);
              }
            }
          }
        }
        i = 0;
        while (i < calibData.length) {
          if (paramScale > 0) {
            calibData[i] = (calibData[i] - paramOffset) / paramScale;
          } else {
            calibData[i] = this._yapi.imm_decimalToDouble(Math.round(calibData[i]));
          }
          i = i + 1;
        }
      } else {
        iCalib = this._yapi.imm_decodeFloats(param);
        calibType = Math.round(iCalib[0] / 1e3);
        if (calibType >= 30) {
          calibType = calibType - 30;
        }
        i = 1;
        while (i < iCalib.length) {
          calibData.push(iCalib[i] / 1e3);
          i = i + 1;
        }
      }
      if (funVer >= 3) {
        if (calibData.length == 0) {
          param = "0,";
        } else {
          param = (30 + calibType).toString();
          i = 0;
          while (i < calibData.length) {
            if ((i & 1) > 0) {
              param = param + ":";
            } else {
              param = param + " ";
            }
            param = param + Math.round(calibData[i] * 1e3 / 1e3).toString();
            i = i + 1;
          }
          param = param + ",";
        }
      } else {
        if (funVer >= 1) {
          nPoints = calibData.length / 2 >> 0;
          param = nPoints.toString();
          i = 0;
          while (i < 2 * nPoints) {
            if (funScale == 0) {
              wordVal = this._yapi.imm_doubleToDecimal(Math.round(calibData[i]));
            } else {
              wordVal = calibData[i] * funScale + funOffset;
            }
            param = param + "," + Math.round(wordVal).toString();
            i = i + 1;
          }
        } else {
          if (calibData.length == 4) {
            param = Math.round(1e3 * (calibData[3] - calibData[1]) / calibData[2] - calibData[0]).toString();
          }
        }
      }
      return param;
    });
  }
  _tryExec(url) {
    return __awaiter(this, void 0, void 0, function* () {
      let res;
      let done;
      res = YAPI_SUCCESS;
      done = 1;
      try {
        yield this._download(url);
      } catch (e) {
        done = 0;
      }
      if (done == 0) {
        try {
          YAPI.Sleep(500);
          yield this._download(url);
        } catch (e) {
          res = yield this.get_errorType();
        }
      }
      return res;
    });
  }
  set_allSettings(settings) {
    return __awaiter(this, void 0, void 0, function* () {
      let restoreLast = [];
      let old_json_flat;
      let old_dslist = [];
      let old_jpath = [];
      let old_jpath_len = [];
      let old_val_arr = [];
      let actualSettings;
      let new_dslist = [];
      let new_jpath = [];
      let new_jpath_len = [];
      let new_val_arr = [];
      let cpos;
      let eqpos;
      let leng;
      let i;
      let j;
      let subres;
      let res;
      let njpath;
      let jpath;
      let fun;
      let attr;
      let value;
      let url;
      let tmp;
      let new_calib;
      let sensorType;
      let unit_name;
      let newval;
      let oldval;
      let old_calib;
      let each_str;
      let do_update;
      let found;
      res = YAPI_SUCCESS;
      tmp = this._yapi.imm_bin2str(settings);
      tmp = this.imm_get_json_path(tmp, "api");
      if (!(tmp == "")) {
        settings = this._yapi.imm_str2bin(tmp);
      }
      oldval = "";
      newval = "";
      old_json_flat = this.imm_flattenJsonStruct(settings);
      old_dslist = this.imm_json_get_array(old_json_flat);
      for (let ii in old_dslist) {
        each_str = this.imm_json_get_string(this._yapi.imm_str2bin(old_dslist[ii]));
        leng = each_str.length;
        eqpos = each_str.indexOf("=");
        if (eqpos < 0 || leng == 0) {
          this._throw(YAPI_INVALID_ARGUMENT, "Invalid settings");
          return YAPI_INVALID_ARGUMENT;
        }
        jpath = each_str.substr(0, eqpos);
        eqpos = eqpos + 1;
        value = each_str.substr(eqpos, leng - eqpos);
        old_jpath.push(jpath);
        old_jpath_len.push(jpath.length);
        old_val_arr.push(value);
      }
      try {
        actualSettings = yield this._download("api.json");
      } catch (e) {
        YAPI.Sleep(500);
        actualSettings = yield this._download("api.json");
      }
      actualSettings = this.imm_flattenJsonStruct(actualSettings);
      new_dslist = this.imm_json_get_array(actualSettings);
      for (let ii in new_dslist) {
        each_str = this.imm_json_get_string(this._yapi.imm_str2bin(new_dslist[ii]));
        leng = each_str.length;
        eqpos = each_str.indexOf("=");
        if (eqpos < 0 || leng == 0) {
          this._throw(YAPI_INVALID_ARGUMENT, "Invalid settings");
          return YAPI_INVALID_ARGUMENT;
        }
        jpath = each_str.substr(0, eqpos);
        eqpos = eqpos + 1;
        value = each_str.substr(eqpos, leng - eqpos);
        new_jpath.push(jpath);
        new_jpath_len.push(jpath.length);
        new_val_arr.push(value);
      }
      i = 0;
      while (i < new_jpath.length) {
        njpath = new_jpath[i];
        leng = njpath.length;
        cpos = njpath.indexOf("/");
        if (cpos < 0 || leng == 0) {
          continue;
        }
        fun = njpath.substr(0, cpos);
        cpos = cpos + 1;
        attr = njpath.substr(cpos, leng - cpos);
        do_update = true;
        if (fun == "services") {
          do_update = false;
        }
        if (do_update && attr == "firmwareRelease") {
          do_update = false;
        }
        if (do_update && attr == "usbCurrent") {
          do_update = false;
        }
        if (do_update && attr == "upTime") {
          do_update = false;
        }
        if (do_update && attr == "persistentSettings") {
          do_update = false;
        }
        if (do_update && attr == "adminPassword") {
          do_update = false;
        }
        if (do_update && attr == "userPassword") {
          do_update = false;
        }
        if (do_update && attr == "rebootCountdown") {
          do_update = false;
        }
        if (do_update && attr == "advertisedValue") {
          do_update = false;
        }
        if (do_update && attr == "poeCurrent") {
          do_update = false;
        }
        if (do_update && attr == "readiness") {
          do_update = false;
        }
        if (do_update && attr == "ipAddress") {
          do_update = false;
        }
        if (do_update && attr == "subnetMask") {
          do_update = false;
        }
        if (do_update && attr == "router") {
          do_update = false;
        }
        if (do_update && attr == "linkQuality") {
          do_update = false;
        }
        if (do_update && attr == "ssid") {
          do_update = false;
        }
        if (do_update && attr == "channel") {
          do_update = false;
        }
        if (do_update && attr == "security") {
          do_update = false;
        }
        if (do_update && attr == "message") {
          do_update = false;
        }
        if (do_update && attr == "signalValue") {
          do_update = false;
        }
        if (do_update && attr == "currentValue") {
          do_update = false;
        }
        if (do_update && attr == "currentRawValue") {
          do_update = false;
        }
        if (do_update && attr == "currentRunIndex") {
          do_update = false;
        }
        if (do_update && attr == "pulseTimer") {
          do_update = false;
        }
        if (do_update && attr == "lastTimePressed") {
          do_update = false;
        }
        if (do_update && attr == "lastTimeReleased") {
          do_update = false;
        }
        if (do_update && attr == "filesCount") {
          do_update = false;
        }
        if (do_update && attr == "freeSpace") {
          do_update = false;
        }
        if (do_update && attr == "timeUTC") {
          do_update = false;
        }
        if (do_update && attr == "rtcTime") {
          do_update = false;
        }
        if (do_update && attr == "unixTime") {
          do_update = false;
        }
        if (do_update && attr == "dateTime") {
          do_update = false;
        }
        if (do_update && attr == "rawValue") {
          do_update = false;
        }
        if (do_update && attr == "lastMsg") {
          do_update = false;
        }
        if (do_update && attr == "delayedPulseTimer") {
          do_update = false;
        }
        if (do_update && attr == "rxCount") {
          do_update = false;
        }
        if (do_update && attr == "txCount") {
          do_update = false;
        }
        if (do_update && attr == "msgCount") {
          do_update = false;
        }
        if (do_update && attr == "rxMsgCount") {
          do_update = false;
        }
        if (do_update && attr == "txMsgCount") {
          do_update = false;
        }
        if (do_update) {
          do_update = false;
          newval = new_val_arr[i];
          j = 0;
          found = false;
          while (j < old_jpath.length && !found) {
            if (new_jpath_len[i] == old_jpath_len[j] && new_jpath[i] == old_jpath[j]) {
              found = true;
              oldval = old_val_arr[j];
              if (!(newval == oldval)) {
                do_update = true;
              }
            }
            j = j + 1;
          }
        }
        if (do_update) {
          if (attr == "calibrationParam") {
            old_calib = "";
            unit_name = "";
            sensorType = "";
            new_calib = newval;
            j = 0;
            found = false;
            while (j < old_jpath.length && !found) {
              if (new_jpath_len[i] == old_jpath_len[j] && new_jpath[i] == old_jpath[j]) {
                found = true;
                old_calib = old_val_arr[j];
              }
              j = j + 1;
            }
            tmp = fun + "/unit";
            j = 0;
            found = false;
            while (j < new_jpath.length && !found) {
              if (tmp == new_jpath[j]) {
                found = true;
                unit_name = new_val_arr[j];
              }
              j = j + 1;
            }
            tmp = fun + "/sensorType";
            j = 0;
            found = false;
            while (j < new_jpath.length && !found) {
              if (tmp == new_jpath[j]) {
                found = true;
                sensorType = new_val_arr[j];
              }
              j = j + 1;
            }
            newval = yield this.calibConvert(old_calib, new_val_arr[i], unit_name, sensorType);
            url = "api/" + fun + ".json?" + attr + "=" + this.imm_escapeAttr(newval);
            subres = yield this._tryExec(url);
            if (res == YAPI_SUCCESS && subres != YAPI_SUCCESS) {
              res = subres;
            }
          } else {
            url = "api/" + fun + ".json?" + attr + "=" + this.imm_escapeAttr(oldval);
            if (attr == "resolution") {
              restoreLast.push(url);
            } else {
              subres = yield this._tryExec(url);
              if (res == YAPI_SUCCESS && subres != YAPI_SUCCESS) {
                res = subres;
              }
            }
          }
        }
        i = i + 1;
      }
      for (let ii in restoreLast) {
        subres = yield this._tryExec(restoreLast[ii]);
        if (res == YAPI_SUCCESS && subres != YAPI_SUCCESS) {
          res = subres;
        }
      }
      yield this.clearCache();
      return res;
    });
  }
  addFileToHTTPCallback(filename) {
    return __awaiter(this, void 0, void 0, function* () {
      let content;
      content = yield this._download("@YCB+" + filename);
      if (content.length == 0) {
        return YAPI_NOT_SUPPORTED;
      }
      return YAPI_SUCCESS;
    });
  }
  get_hardwareId() {
    return __awaiter(this, void 0, void 0, function* () {
      let serial;
      serial = yield this.get_serialNumber();
      return serial + ".module";
    });
  }
  download(pathname) {
    return __awaiter(this, void 0, void 0, function* () {
      return yield this._download(pathname);
    });
  }
  get_icon2d() {
    return __awaiter(this, void 0, void 0, function* () {
      return yield this._download("icon2d.png");
    });
  }
  get_lastLogs() {
    return __awaiter(this, void 0, void 0, function* () {
      let content;
      content = yield this._download("logs.txt");
      return this._yapi.imm_bin2str(content);
    });
  }
  log(text) {
    return __awaiter(this, void 0, void 0, function* () {
      return yield this._upload("logs.txt", this._yapi.imm_str2bin(text));
    });
  }
  get_subDevices() {
    return __awaiter(this, void 0, void 0, function* () {
      return yield this.get_subDevices_internal();
    });
  }
  get_parentHub() {
    return __awaiter(this, void 0, void 0, function* () {
      return yield this.get_parentHub_internal();
    });
  }
  get_url() {
    return __awaiter(this, void 0, void 0, function* () {
      return yield this.get_url_internal();
    });
  }
  nextModule() {
    let resolve = this._yapi.imm_resolveFunction(this._className, this._func);
    if (resolve.errorType != YAPI.SUCCESS)
      return null;
    let next_hwid = this._yapi.imm_getNextHardwareId(this._className, resolve.result);
    if (next_hwid == null)
      return null;
    return YModule.FindModuleInContext(this._yapi, next_hwid);
  }
  static FirstModule() {
    let next_hwid = YAPI.imm_getFirstHardwareId("Module");
    if (next_hwid == null)
      return null;
    return YModule.FindModule(next_hwid);
  }
  static FirstModuleInContext(yctx) {
    let next_hwid = yctx.imm_getFirstHardwareId("Module");
    if (next_hwid == null)
      return null;
    return YModule.FindModuleInContext(yctx, next_hwid);
  }
};
YModule.PRODUCTNAME_INVALID = YAPI_INVALID_STRING;
YModule.SERIALNUMBER_INVALID = YAPI_INVALID_STRING;
YModule.PRODUCTID_INVALID = YAPI_INVALID_UINT;
YModule.PRODUCTRELEASE_INVALID = YAPI_INVALID_UINT;
YModule.FIRMWARERELEASE_INVALID = YAPI_INVALID_STRING;
YModule.PERSISTENTSETTINGS_LOADED = 0;
YModule.PERSISTENTSETTINGS_SAVED = 1;
YModule.PERSISTENTSETTINGS_MODIFIED = 2;
YModule.PERSISTENTSETTINGS_INVALID = -1;
YModule.LUMINOSITY_INVALID = YAPI_INVALID_UINT;
YModule.BEACON_OFF = 0;
YModule.BEACON_ON = 1;
YModule.BEACON_INVALID = -1;
YModule.UPTIME_INVALID = YAPI_INVALID_LONG;
YModule.USBCURRENT_INVALID = YAPI_INVALID_UINT;
YModule.REBOOTCOUNTDOWN_INVALID = YAPI_INVALID_INT;
YModule.USERVAR_INVALID = YAPI_INVALID_INT;
var YSensor = class extends YFunction {
  constructor(yapi, func) {
    super(yapi, func);
    this._unit = YSensor.UNIT_INVALID;
    this._currentValue = YSensor.CURRENTVALUE_INVALID;
    this._lowestValue = YSensor.LOWESTVALUE_INVALID;
    this._highestValue = YSensor.HIGHESTVALUE_INVALID;
    this._currentRawValue = YSensor.CURRENTRAWVALUE_INVALID;
    this._logFrequency = YSensor.LOGFREQUENCY_INVALID;
    this._reportFrequency = YSensor.REPORTFREQUENCY_INVALID;
    this._advMode = YSensor.ADVMODE_INVALID;
    this._calibrationParam = YSensor.CALIBRATIONPARAM_INVALID;
    this._resolution = YSensor.RESOLUTION_INVALID;
    this._sensorState = YSensor.SENSORSTATE_INVALID;
    this._valueCallbackSensor = null;
    this._timedReportCallbackSensor = null;
    this._prevTimedReport = 0;
    this._iresol = 0;
    this._offset = 0;
    this._scale = 0;
    this._decexp = 0;
    this._caltyp = 0;
    this._calpar = [];
    this._calraw = [];
    this._calref = [];
    this.imm_calhdl = null;
    this.UNIT_INVALID = YAPI_INVALID_STRING;
    this.CURRENTVALUE_INVALID = YAPI_INVALID_DOUBLE;
    this.LOWESTVALUE_INVALID = YAPI_INVALID_DOUBLE;
    this.HIGHESTVALUE_INVALID = YAPI_INVALID_DOUBLE;
    this.CURRENTRAWVALUE_INVALID = YAPI_INVALID_DOUBLE;
    this.LOGFREQUENCY_INVALID = YAPI_INVALID_STRING;
    this.REPORTFREQUENCY_INVALID = YAPI_INVALID_STRING;
    this.ADVMODE_IMMEDIATE = 0;
    this.ADVMODE_PERIOD_AVG = 1;
    this.ADVMODE_PERIOD_MIN = 2;
    this.ADVMODE_PERIOD_MAX = 3;
    this.ADVMODE_INVALID = -1;
    this.CALIBRATIONPARAM_INVALID = YAPI_INVALID_STRING;
    this.RESOLUTION_INVALID = YAPI_INVALID_DOUBLE;
    this.SENSORSTATE_INVALID = YAPI_INVALID_INT;
    this._className = "Sensor";
  }
  imm_parseAttr(name, val) {
    switch (name) {
      case "unit":
        this._unit = val;
        return 1;
      case "currentValue":
        this._currentValue = Math.round(val / 65.536) / 1e3;
        return 1;
      case "lowestValue":
        this._lowestValue = Math.round(val / 65.536) / 1e3;
        return 1;
      case "highestValue":
        this._highestValue = Math.round(val / 65.536) / 1e3;
        return 1;
      case "currentRawValue":
        this._currentRawValue = Math.round(val / 65.536) / 1e3;
        return 1;
      case "logFrequency":
        this._logFrequency = val;
        return 1;
      case "reportFrequency":
        this._reportFrequency = val;
        return 1;
      case "advMode":
        this._advMode = val;
        return 1;
      case "calibrationParam":
        this._calibrationParam = val;
        return 1;
      case "resolution":
        this._resolution = Math.round(val / 65.536) / 1e3;
        return 1;
      case "sensorState":
        this._sensorState = val;
        return 1;
    }
    return super.imm_parseAttr(name, val);
  }
  get_unit() {
    return __awaiter(this, void 0, void 0, function* () {
      let res;
      if (this._cacheExpiration <= this._yapi.GetTickCount()) {
        if ((yield this.load(this._yapi.defaultCacheValidity)) != YAPI_SUCCESS) {
          return YSensor.UNIT_INVALID;
        }
      }
      res = this._unit;
      return res;
    });
  }
  get_currentValue() {
    return __awaiter(this, void 0, void 0, function* () {
      let res;
      if (this._cacheExpiration <= this._yapi.GetTickCount()) {
        if ((yield this.load(this._yapi.defaultCacheValidity)) != YAPI_SUCCESS) {
          return YSensor.CURRENTVALUE_INVALID;
        }
      }
      res = yield this._applyCalibration(this._currentRawValue);
      if (res == YSensor.CURRENTVALUE_INVALID) {
        res = this._currentValue;
      }
      res = res * this._iresol;
      res = Math.round(res) / this._iresol;
      return res;
    });
  }
  set_lowestValue(newval) {
    return __awaiter(this, void 0, void 0, function* () {
      let rest_val;
      rest_val = String(Math.round(newval * 65536));
      return yield this._setAttr("lowestValue", rest_val);
    });
  }
  get_lowestValue() {
    return __awaiter(this, void 0, void 0, function* () {
      let res;
      if (this._cacheExpiration <= this._yapi.GetTickCount()) {
        if ((yield this.load(this._yapi.defaultCacheValidity)) != YAPI_SUCCESS) {
          return YSensor.LOWESTVALUE_INVALID;
        }
      }
      res = this._lowestValue * this._iresol;
      res = Math.round(res) / this._iresol;
      return res;
    });
  }
  set_highestValue(newval) {
    return __awaiter(this, void 0, void 0, function* () {
      let rest_val;
      rest_val = String(Math.round(newval * 65536));
      return yield this._setAttr("highestValue", rest_val);
    });
  }
  get_highestValue() {
    return __awaiter(this, void 0, void 0, function* () {
      let res;
      if (this._cacheExpiration <= this._yapi.GetTickCount()) {
        if ((yield this.load(this._yapi.defaultCacheValidity)) != YAPI_SUCCESS) {
          return YSensor.HIGHESTVALUE_INVALID;
        }
      }
      res = this._highestValue * this._iresol;
      res = Math.round(res) / this._iresol;
      return res;
    });
  }
  get_currentRawValue() {
    return __awaiter(this, void 0, void 0, function* () {
      let res;
      if (this._cacheExpiration <= this._yapi.GetTickCount()) {
        if ((yield this.load(this._yapi.defaultCacheValidity)) != YAPI_SUCCESS) {
          return YSensor.CURRENTRAWVALUE_INVALID;
        }
      }
      res = this._currentRawValue;
      return res;
    });
  }
  get_logFrequency() {
    return __awaiter(this, void 0, void 0, function* () {
      let res;
      if (this._cacheExpiration <= this._yapi.GetTickCount()) {
        if ((yield this.load(this._yapi.defaultCacheValidity)) != YAPI_SUCCESS) {
          return YSensor.LOGFREQUENCY_INVALID;
        }
      }
      res = this._logFrequency;
      return res;
    });
  }
  set_logFrequency(newval) {
    return __awaiter(this, void 0, void 0, function* () {
      let rest_val;
      rest_val = String(newval);
      return yield this._setAttr("logFrequency", rest_val);
    });
  }
  get_reportFrequency() {
    return __awaiter(this, void 0, void 0, function* () {
      let res;
      if (this._cacheExpiration <= this._yapi.GetTickCount()) {
        if ((yield this.load(this._yapi.defaultCacheValidity)) != YAPI_SUCCESS) {
          return YSensor.REPORTFREQUENCY_INVALID;
        }
      }
      res = this._reportFrequency;
      return res;
    });
  }
  set_reportFrequency(newval) {
    return __awaiter(this, void 0, void 0, function* () {
      let rest_val;
      rest_val = String(newval);
      return yield this._setAttr("reportFrequency", rest_val);
    });
  }
  get_advMode() {
    return __awaiter(this, void 0, void 0, function* () {
      let res;
      if (this._cacheExpiration <= this._yapi.GetTickCount()) {
        if ((yield this.load(this._yapi.defaultCacheValidity)) != YAPI_SUCCESS) {
          return YSensor.ADVMODE_INVALID;
        }
      }
      res = this._advMode;
      return res;
    });
  }
  set_advMode(newval) {
    return __awaiter(this, void 0, void 0, function* () {
      let rest_val;
      rest_val = String(newval);
      return yield this._setAttr("advMode", rest_val);
    });
  }
  get_calibrationParam() {
    return __awaiter(this, void 0, void 0, function* () {
      let res;
      if (this._cacheExpiration <= this._yapi.GetTickCount()) {
        if ((yield this.load(this._yapi.defaultCacheValidity)) != YAPI_SUCCESS) {
          return YSensor.CALIBRATIONPARAM_INVALID;
        }
      }
      res = this._calibrationParam;
      return res;
    });
  }
  set_calibrationParam(newval) {
    return __awaiter(this, void 0, void 0, function* () {
      let rest_val;
      rest_val = String(newval);
      return yield this._setAttr("calibrationParam", rest_val);
    });
  }
  set_resolution(newval) {
    return __awaiter(this, void 0, void 0, function* () {
      let rest_val;
      rest_val = String(Math.round(newval * 65536));
      return yield this._setAttr("resolution", rest_val);
    });
  }
  get_resolution() {
    return __awaiter(this, void 0, void 0, function* () {
      let res;
      if (this._cacheExpiration <= this._yapi.GetTickCount()) {
        if ((yield this.load(this._yapi.defaultCacheValidity)) != YAPI_SUCCESS) {
          return YSensor.RESOLUTION_INVALID;
        }
      }
      res = this._resolution;
      return res;
    });
  }
  get_sensorState() {
    return __awaiter(this, void 0, void 0, function* () {
      let res;
      if (this._cacheExpiration <= this._yapi.GetTickCount()) {
        if ((yield this.load(this._yapi.defaultCacheValidity)) != YAPI_SUCCESS) {
          return YSensor.SENSORSTATE_INVALID;
        }
      }
      res = this._sensorState;
      return res;
    });
  }
  static FindSensor(func) {
    let obj;
    obj = YFunction._FindFromCache("Sensor", func);
    if (obj == null) {
      obj = new YSensor(YAPI, func);
      YFunction._AddToCache("Sensor", func, obj);
    }
    return obj;
  }
  static FindSensorInContext(yctx, func) {
    let obj;
    obj = YFunction._FindFromCacheInContext(yctx, "Sensor", func);
    if (obj == null) {
      obj = new YSensor(yctx, func);
      YFunction._AddToCache("Sensor", func, obj);
    }
    return obj;
  }
  registerValueCallback(callback) {
    return __awaiter(this, void 0, void 0, function* () {
      let val;
      if (callback != null) {
        yield YFunction._UpdateValueCallbackList(this, true);
      } else {
        yield YFunction._UpdateValueCallbackList(this, false);
      }
      this._valueCallbackSensor = callback;
      if (callback != null && (yield this.isOnline())) {
        val = this._advertisedValue;
        if (!(val == "")) {
          yield this._invokeValueCallback(val);
        }
      }
      return 0;
    });
  }
  _invokeValueCallback(value) {
    const _super = Object.create(null, {
      _invokeValueCallback: {get: () => super._invokeValueCallback}
    });
    return __awaiter(this, void 0, void 0, function* () {
      if (this._valueCallbackSensor != null) {
        try {
          yield this._valueCallbackSensor(this, value);
        } catch (e) {
          this._yapi.imm_log("Exception in valueCallback:", e);
        }
      } else {
        _super._invokeValueCallback.call(this, value);
      }
      return 0;
    });
  }
  _parserHelper() {
    return __awaiter(this, void 0, void 0, function* () {
      let position;
      let maxpos;
      let iCalib = [];
      let iRaw;
      let iRef;
      let fRaw;
      let fRef;
      this._caltyp = -1;
      this._scale = -1;
      this._calpar.length = 0;
      this._calraw.length = 0;
      this._calref.length = 0;
      if (this._resolution > 0) {
        this._iresol = Math.round(1 / this._resolution);
      } else {
        this._iresol = 1e4;
        this._resolution = 1e-4;
      }
      if (this._calibrationParam == "" || this._calibrationParam == "0") {
        this._caltyp = 0;
        return 0;
      }
      if (this._calibrationParam.indexOf(",") >= 0) {
        iCalib = this._yapi.imm_decodeFloats(this._calibrationParam);
        this._caltyp = iCalib[0] / 1e3 >> 0;
        if (this._caltyp > 0) {
          if (this._caltyp < YOCTO_CALIB_TYPE_OFS) {
            this._caltyp = -1;
            return 0;
          }
          this.imm_calhdl = this._yapi.imm_getCalibrationHandler(this._caltyp);
          if (!(this.imm_calhdl != null)) {
            this._caltyp = -1;
            return 0;
          }
        }
        this._offset = 0;
        this._scale = 1e3;
        maxpos = iCalib.length;
        this._calpar.length = 0;
        position = 1;
        while (position < maxpos) {
          this._calpar.push(iCalib[position]);
          position = position + 1;
        }
        this._calraw.length = 0;
        this._calref.length = 0;
        position = 1;
        while (position + 1 < maxpos) {
          fRaw = iCalib[position];
          fRaw = fRaw / 1e3;
          fRef = iCalib[position + 1];
          fRef = fRef / 1e3;
          this._calraw.push(fRaw);
          this._calref.push(fRef);
          position = position + 2;
        }
      } else {
        iCalib = this._yapi.imm_decodeWords(this._calibrationParam);
        if (iCalib.length < 2) {
          this._caltyp = -1;
          return 0;
        }
        this._offset = 0;
        this._scale = 1;
        this._decexp = 1;
        position = iCalib[0];
        while (position > 0) {
          this._decexp = this._decexp * 10;
          position = position - 1;
        }
        if (iCalib.length == 2) {
          this._caltyp = 0;
          return 0;
        }
        this._caltyp = iCalib[2];
        this.imm_calhdl = this._yapi.imm_getCalibrationHandler(this._caltyp);
        if (this._caltyp <= 10) {
          maxpos = this._caltyp;
        } else {
          if (this._caltyp <= 20) {
            maxpos = this._caltyp - 10;
          } else {
            maxpos = 5;
          }
        }
        maxpos = 3 + 2 * maxpos;
        if (maxpos > iCalib.length) {
          maxpos = iCalib.length;
        }
        this._calpar.length = 0;
        this._calraw.length = 0;
        this._calref.length = 0;
        position = 3;
        while (position + 1 < maxpos) {
          iRaw = iCalib[position];
          iRef = iCalib[position + 1];
          this._calpar.push(iRaw);
          this._calpar.push(iRef);
          this._calraw.push(this._yapi.imm_decimalToDouble(iRaw));
          this._calref.push(this._yapi.imm_decimalToDouble(iRef));
          position = position + 2;
        }
      }
      return 0;
    });
  }
  isSensorReady() {
    return __awaiter(this, void 0, void 0, function* () {
      if (!(yield this.isOnline())) {
        return false;
      }
      if (!(this._sensorState == 0)) {
        return false;
      }
      return true;
    });
  }
  get_dataLogger() {
    return __awaiter(this, void 0, void 0, function* () {
      let logger;
      let modu;
      let serial;
      let hwid;
      modu = yield this.get_module();
      serial = yield modu.get_serialNumber();
      if (serial == YAPI_INVALID_STRING) {
        return null;
      }
      hwid = serial + ".dataLogger";
      logger = YDataLogger.FindDataLogger(hwid);
      return logger;
    });
  }
  startDataLogger() {
    return __awaiter(this, void 0, void 0, function* () {
      let res;
      res = yield this._download("api/dataLogger/recording?recording=1");
      if (!(res.length > 0)) {
        return this._throw(YAPI_IO_ERROR, "unable to start datalogger", YAPI_IO_ERROR);
      }
      return YAPI_SUCCESS;
    });
  }
  stopDataLogger() {
    return __awaiter(this, void 0, void 0, function* () {
      let res;
      res = yield this._download("api/dataLogger/recording?recording=0");
      if (!(res.length > 0)) {
        return this._throw(YAPI_IO_ERROR, "unable to stop datalogger", YAPI_IO_ERROR);
      }
      return YAPI_SUCCESS;
    });
  }
  get_recordedData(startTime, endTime) {
    return __awaiter(this, void 0, void 0, function* () {
      let funcid;
      let funit;
      funcid = yield this.get_functionId();
      funit = yield this.get_unit();
      return new YDataSet(this, funcid, funit, startTime, endTime);
    });
  }
  registerTimedReportCallback(callback) {
    return __awaiter(this, void 0, void 0, function* () {
      let sensor;
      sensor = this;
      if (callback != null) {
        yield YFunction._UpdateTimedReportCallbackList(sensor, true);
      } else {
        yield YFunction._UpdateTimedReportCallbackList(sensor, false);
      }
      this._timedReportCallbackSensor = callback;
      return 0;
    });
  }
  _invokeTimedReportCallback(value) {
    return __awaiter(this, void 0, void 0, function* () {
      if (this._timedReportCallbackSensor != null) {
        try {
          yield this._timedReportCallbackSensor(this, value);
        } catch (e) {
          this._yapi.imm_log("Exception in timedReportCallback:", e);
        }
      } else {
      }
      return 0;
    });
  }
  calibrateFromPoints(rawValues, refValues) {
    return __awaiter(this, void 0, void 0, function* () {
      let rest_val;
      let res;
      rest_val = yield this._encodeCalibrationPoints(rawValues, refValues);
      res = yield this._setAttr("calibrationParam", rest_val);
      return res;
    });
  }
  loadCalibrationPoints(rawValues, refValues) {
    return __awaiter(this, void 0, void 0, function* () {
      rawValues.length = 0;
      refValues.length = 0;
      if (this._scale == 0) {
        if ((yield this.load(this._yapi.defaultCacheValidity)) != YAPI_SUCCESS) {
          return YAPI_DEVICE_NOT_FOUND;
        }
      }
      if (this._caltyp < 0) {
        this._throw(YAPI_NOT_SUPPORTED, "Calibration parameters format mismatch. Please upgrade your library or firmware.");
        return YAPI_NOT_SUPPORTED;
      }
      rawValues.length = 0;
      refValues.length = 0;
      for (let ii in this._calraw) {
        rawValues.push(this._calraw[ii]);
      }
      for (let ii in this._calref) {
        refValues.push(this._calref[ii]);
      }
      return YAPI_SUCCESS;
    });
  }
  _encodeCalibrationPoints(rawValues, refValues) {
    return __awaiter(this, void 0, void 0, function* () {
      let res;
      let npt;
      let idx;
      npt = rawValues.length;
      if (npt != refValues.length) {
        this._throw(YAPI_INVALID_ARGUMENT, "Invalid calibration parameters (size mismatch)");
        return YAPI_INVALID_STRING;
      }
      if (npt == 0) {
        return "0";
      }
      if (this._scale == 0) {
        if ((yield this.load(this._yapi.defaultCacheValidity)) != YAPI_SUCCESS) {
          return YAPI_INVALID_STRING;
        }
      }
      if (this._caltyp < 0 || this._scale < 0) {
        this._throw(YAPI_NOT_SUPPORTED, "Calibration parameters format mismatch. Please upgrade your library or firmware.");
        return "0";
      }
      res = String(Math.round(YOCTO_CALIB_TYPE_OFS));
      idx = 0;
      while (idx < npt) {
        res = res + "," + String(Math.round(rawValues[idx] * 1e3) / 1e3) + "," + String(Math.round(refValues[idx] * 1e3) / 1e3);
        idx = idx + 1;
      }
      return res;
    });
  }
  _applyCalibration(rawValue) {
    return __awaiter(this, void 0, void 0, function* () {
      if (rawValue == YSensor.CURRENTVALUE_INVALID) {
        return YSensor.CURRENTVALUE_INVALID;
      }
      if (this._caltyp == 0) {
        return rawValue;
      }
      if (this._caltyp < 0) {
        return YSensor.CURRENTVALUE_INVALID;
      }
      if (!(this.imm_calhdl != null)) {
        return YSensor.CURRENTVALUE_INVALID;
      }
      return this.imm_calhdl(rawValue, this._caltyp, this._calpar, this._calraw, this._calref);
    });
  }
  _decodeTimedReport(timestamp, duration, report) {
    return __awaiter(this, void 0, void 0, function* () {
      let i;
      let byteVal;
      let poww;
      let minRaw;
      let avgRaw;
      let maxRaw;
      let sublen;
      let difRaw;
      let startTime;
      let endTime;
      let minVal;
      let avgVal;
      let maxVal;
      if (duration > 0) {
        startTime = timestamp - duration;
      } else {
        startTime = this._prevTimedReport;
      }
      endTime = timestamp;
      this._prevTimedReport = endTime;
      if (startTime == 0) {
        startTime = endTime;
      }
      if (report.length <= 5) {
        poww = 1;
        avgRaw = 0;
        byteVal = 0;
        i = 1;
        while (i < report.length) {
          byteVal = report[i];
          avgRaw = avgRaw + poww * byteVal;
          poww = poww * 256;
          i = i + 1;
        }
        if ((byteVal & 128) != 0) {
          avgRaw = avgRaw - poww;
        }
        avgVal = avgRaw / 1e3;
        if (this._caltyp != 0) {
          if (this.imm_calhdl != null) {
            avgVal = this.imm_calhdl(avgVal, this._caltyp, this._calpar, this._calraw, this._calref);
          }
        }
        minVal = avgVal;
        maxVal = avgVal;
      } else {
        sublen = 1 + (report[1] & 3);
        poww = 1;
        avgRaw = 0;
        byteVal = 0;
        i = 2;
        while (sublen > 0 && i < report.length) {
          byteVal = report[i];
          avgRaw = avgRaw + poww * byteVal;
          poww = poww * 256;
          i = i + 1;
          sublen = sublen - 1;
        }
        if ((byteVal & 128) != 0) {
          avgRaw = avgRaw - poww;
        }
        sublen = 1 + (report[1] >> 2 & 3);
        poww = 1;
        difRaw = 0;
        while (sublen > 0 && i < report.length) {
          byteVal = report[i];
          difRaw = difRaw + poww * byteVal;
          poww = poww * 256;
          i = i + 1;
          sublen = sublen - 1;
        }
        minRaw = avgRaw - difRaw;
        sublen = 1 + (report[1] >> 4 & 3);
        poww = 1;
        difRaw = 0;
        while (sublen > 0 && i < report.length) {
          byteVal = report[i];
          difRaw = difRaw + poww * byteVal;
          poww = poww * 256;
          i = i + 1;
          sublen = sublen - 1;
        }
        maxRaw = avgRaw + difRaw;
        avgVal = avgRaw / 1e3;
        minVal = minRaw / 1e3;
        maxVal = maxRaw / 1e3;
        if (this._caltyp != 0) {
          if (this.imm_calhdl != null) {
            avgVal = this.imm_calhdl(avgVal, this._caltyp, this._calpar, this._calraw, this._calref);
            minVal = this.imm_calhdl(minVal, this._caltyp, this._calpar, this._calraw, this._calref);
            maxVal = this.imm_calhdl(maxVal, this._caltyp, this._calpar, this._calraw, this._calref);
          }
        }
      }
      return new YMeasure(startTime, endTime, minVal, avgVal, maxVal);
    });
  }
  imm_decodeVal(w) {
    let val;
    val = w;
    if (this._caltyp != 0) {
      if (this.imm_calhdl != null) {
        val = this.imm_calhdl(val, this._caltyp, this._calpar, this._calraw, this._calref);
      }
    }
    return val;
  }
  imm_decodeAvg(dw) {
    let val;
    val = dw;
    if (this._caltyp != 0) {
      if (this.imm_calhdl != null) {
        val = this.imm_calhdl(val, this._caltyp, this._calpar, this._calraw, this._calref);
      }
    }
    return val;
  }
  nextSensor() {
    let resolve = this._yapi.imm_resolveFunction(this._className, this._func);
    if (resolve.errorType != YAPI.SUCCESS)
      return null;
    let next_hwid = this._yapi.imm_getNextHardwareId(this._className, resolve.result);
    if (next_hwid == null)
      return null;
    return YSensor.FindSensorInContext(this._yapi, next_hwid);
  }
  static FirstSensor() {
    let next_hwid = YAPI.imm_getFirstHardwareId("Sensor");
    if (next_hwid == null)
      return null;
    return YSensor.FindSensor(next_hwid);
  }
  static FirstSensorInContext(yctx) {
    let next_hwid = yctx.imm_getFirstHardwareId("Sensor");
    if (next_hwid == null)
      return null;
    return YSensor.FindSensorInContext(yctx, next_hwid);
  }
};
YSensor.UNIT_INVALID = YAPI_INVALID_STRING;
YSensor.CURRENTVALUE_INVALID = YAPI_INVALID_DOUBLE;
YSensor.LOWESTVALUE_INVALID = YAPI_INVALID_DOUBLE;
YSensor.HIGHESTVALUE_INVALID = YAPI_INVALID_DOUBLE;
YSensor.CURRENTRAWVALUE_INVALID = YAPI_INVALID_DOUBLE;
YSensor.LOGFREQUENCY_INVALID = YAPI_INVALID_STRING;
YSensor.REPORTFREQUENCY_INVALID = YAPI_INVALID_STRING;
YSensor.ADVMODE_IMMEDIATE = 0;
YSensor.ADVMODE_PERIOD_AVG = 1;
YSensor.ADVMODE_PERIOD_MIN = 2;
YSensor.ADVMODE_PERIOD_MAX = 3;
YSensor.ADVMODE_INVALID = -1;
YSensor.CALIBRATIONPARAM_INVALID = YAPI_INVALID_STRING;
YSensor.RESOLUTION_INVALID = YAPI_INVALID_DOUBLE;
YSensor.SENSORSTATE_INVALID = YAPI_INVALID_INT;
var YMeasure = class {
  constructor(float_start, float_end, float_minVal, float_avgVal, float_maxVal) {
    this._start = 0;
    this._end = 0;
    this._minVal = 0;
    this._avgVal = 0;
    this._maxVal = 0;
    this._start = float_start;
    this._end = float_end;
    this._minVal = float_minVal;
    this._avgVal = float_avgVal;
    this._maxVal = float_maxVal;
  }
  get_startTimeUTC() {
    return this._start;
  }
  get_endTimeUTC() {
    return this._end;
  }
  get_minValue() {
    return this._minVal;
  }
  get_averageValue() {
    return this._avgVal;
  }
  get_maxValue() {
    return this._maxVal;
  }
  get_startTimeUTC_asDate() {
    return new Date(Math.round(this._start * 1e3));
  }
  get_endTimeUTC_asDate() {
    return new Date(Math.round(this._end * 1e3));
  }
};
var YDataLogger = class extends YFunction {
  constructor(yapi, func) {
    super(yapi, func);
    this._currentRunIndex = YDataLogger.CURRENTRUNINDEX_INVALID;
    this._timeUTC = YDataLogger.TIMEUTC_INVALID;
    this._recording = YDataLogger.RECORDING_INVALID;
    this._autoStart = YDataLogger.AUTOSTART_INVALID;
    this._beaconDriven = YDataLogger.BEACONDRIVEN_INVALID;
    this._usage = YDataLogger.USAGE_INVALID;
    this._clearHistory = YDataLogger.CLEARHISTORY_INVALID;
    this._valueCallbackDataLogger = null;
    this.CURRENTRUNINDEX_INVALID = YAPI_INVALID_UINT;
    this.TIMEUTC_INVALID = YAPI_INVALID_LONG;
    this.RECORDING_OFF = 0;
    this.RECORDING_ON = 1;
    this.RECORDING_PENDING = 2;
    this.RECORDING_INVALID = -1;
    this.AUTOSTART_OFF = 0;
    this.AUTOSTART_ON = 1;
    this.AUTOSTART_INVALID = -1;
    this.BEACONDRIVEN_OFF = 0;
    this.BEACONDRIVEN_ON = 1;
    this.BEACONDRIVEN_INVALID = -1;
    this.USAGE_INVALID = YAPI_INVALID_UINT;
    this.CLEARHISTORY_FALSE = 0;
    this.CLEARHISTORY_TRUE = 1;
    this.CLEARHISTORY_INVALID = -1;
    this._className = "DataLogger";
  }
  imm_parseAttr(name, val) {
    switch (name) {
      case "currentRunIndex":
        this._currentRunIndex = val;
        return 1;
      case "timeUTC":
        this._timeUTC = val;
        return 1;
      case "recording":
        this._recording = val;
        return 1;
      case "autoStart":
        this._autoStart = val;
        return 1;
      case "beaconDriven":
        this._beaconDriven = val;
        return 1;
      case "usage":
        this._usage = val;
        return 1;
      case "clearHistory":
        this._clearHistory = val;
        return 1;
    }
    return super.imm_parseAttr(name, val);
  }
  get_currentRunIndex() {
    return __awaiter(this, void 0, void 0, function* () {
      let res;
      if (this._cacheExpiration <= this._yapi.GetTickCount()) {
        if ((yield this.load(this._yapi.defaultCacheValidity)) != YAPI_SUCCESS) {
          return YDataLogger.CURRENTRUNINDEX_INVALID;
        }
      }
      res = this._currentRunIndex;
      return res;
    });
  }
  get_timeUTC() {
    return __awaiter(this, void 0, void 0, function* () {
      let res;
      if (this._cacheExpiration <= this._yapi.GetTickCount()) {
        if ((yield this.load(this._yapi.defaultCacheValidity)) != YAPI_SUCCESS) {
          return YDataLogger.TIMEUTC_INVALID;
        }
      }
      res = this._timeUTC;
      return res;
    });
  }
  set_timeUTC(newval) {
    return __awaiter(this, void 0, void 0, function* () {
      let rest_val;
      rest_val = String(newval);
      return yield this._setAttr("timeUTC", rest_val);
    });
  }
  get_recording() {
    return __awaiter(this, void 0, void 0, function* () {
      let res;
      if (this._cacheExpiration <= this._yapi.GetTickCount()) {
        if ((yield this.load(this._yapi.defaultCacheValidity)) != YAPI_SUCCESS) {
          return YDataLogger.RECORDING_INVALID;
        }
      }
      res = this._recording;
      return res;
    });
  }
  set_recording(newval) {
    return __awaiter(this, void 0, void 0, function* () {
      let rest_val;
      rest_val = String(newval);
      return yield this._setAttr("recording", rest_val);
    });
  }
  get_autoStart() {
    return __awaiter(this, void 0, void 0, function* () {
      let res;
      if (this._cacheExpiration <= this._yapi.GetTickCount()) {
        if ((yield this.load(this._yapi.defaultCacheValidity)) != YAPI_SUCCESS) {
          return YDataLogger.AUTOSTART_INVALID;
        }
      }
      res = this._autoStart;
      return res;
    });
  }
  set_autoStart(newval) {
    return __awaiter(this, void 0, void 0, function* () {
      let rest_val;
      rest_val = String(newval);
      return yield this._setAttr("autoStart", rest_val);
    });
  }
  get_beaconDriven() {
    return __awaiter(this, void 0, void 0, function* () {
      let res;
      if (this._cacheExpiration <= this._yapi.GetTickCount()) {
        if ((yield this.load(this._yapi.defaultCacheValidity)) != YAPI_SUCCESS) {
          return YDataLogger.BEACONDRIVEN_INVALID;
        }
      }
      res = this._beaconDriven;
      return res;
    });
  }
  set_beaconDriven(newval) {
    return __awaiter(this, void 0, void 0, function* () {
      let rest_val;
      rest_val = String(newval);
      return yield this._setAttr("beaconDriven", rest_val);
    });
  }
  get_usage() {
    return __awaiter(this, void 0, void 0, function* () {
      let res;
      if (this._cacheExpiration <= this._yapi.GetTickCount()) {
        if ((yield this.load(this._yapi.defaultCacheValidity)) != YAPI_SUCCESS) {
          return YDataLogger.USAGE_INVALID;
        }
      }
      res = this._usage;
      return res;
    });
  }
  get_clearHistory() {
    return __awaiter(this, void 0, void 0, function* () {
      let res;
      if (this._cacheExpiration <= this._yapi.GetTickCount()) {
        if ((yield this.load(this._yapi.defaultCacheValidity)) != YAPI_SUCCESS) {
          return YDataLogger.CLEARHISTORY_INVALID;
        }
      }
      res = this._clearHistory;
      return res;
    });
  }
  set_clearHistory(newval) {
    return __awaiter(this, void 0, void 0, function* () {
      let rest_val;
      rest_val = String(newval);
      return yield this._setAttr("clearHistory", rest_val);
    });
  }
  static FindDataLogger(func) {
    let obj;
    obj = YFunction._FindFromCache("DataLogger", func);
    if (obj == null) {
      obj = new YDataLogger(YAPI, func);
      YFunction._AddToCache("DataLogger", func, obj);
    }
    return obj;
  }
  static FindDataLoggerInContext(yctx, func) {
    let obj;
    obj = YFunction._FindFromCacheInContext(yctx, "DataLogger", func);
    if (obj == null) {
      obj = new YDataLogger(yctx, func);
      YFunction._AddToCache("DataLogger", func, obj);
    }
    return obj;
  }
  registerValueCallback(callback) {
    return __awaiter(this, void 0, void 0, function* () {
      let val;
      if (callback != null) {
        yield YFunction._UpdateValueCallbackList(this, true);
      } else {
        yield YFunction._UpdateValueCallbackList(this, false);
      }
      this._valueCallbackDataLogger = callback;
      if (callback != null && (yield this.isOnline())) {
        val = this._advertisedValue;
        if (!(val == "")) {
          yield this._invokeValueCallback(val);
        }
      }
      return 0;
    });
  }
  _invokeValueCallback(value) {
    const _super = Object.create(null, {
      _invokeValueCallback: {get: () => super._invokeValueCallback}
    });
    return __awaiter(this, void 0, void 0, function* () {
      if (this._valueCallbackDataLogger != null) {
        try {
          yield this._valueCallbackDataLogger(this, value);
        } catch (e) {
          this._yapi.imm_log("Exception in valueCallback:", e);
        }
      } else {
        _super._invokeValueCallback.call(this, value);
      }
      return 0;
    });
  }
  forgetAllDataStreams() {
    return __awaiter(this, void 0, void 0, function* () {
      return yield this.set_clearHistory(1);
    });
  }
  get_dataSets() {
    return __awaiter(this, void 0, void 0, function* () {
      return yield this.parse_dataSets(yield this._download("logger.json"));
    });
  }
  parse_dataSets(json) {
    return __awaiter(this, void 0, void 0, function* () {
      let dslist = [];
      let dataset;
      let res = [];
      dslist = this.imm_json_get_array(json);
      res.length = 0;
      for (let ii in dslist) {
        dataset = new YDataSet(this);
        yield dataset._parse(dslist[ii]);
        res.push(dataset);
      }
      return res;
    });
  }
  nextDataLogger() {
    let resolve = this._yapi.imm_resolveFunction(this._className, this._func);
    if (resolve.errorType != YAPI.SUCCESS)
      return null;
    let next_hwid = this._yapi.imm_getNextHardwareId(this._className, resolve.result);
    if (next_hwid == null)
      return null;
    return YDataLogger.FindDataLoggerInContext(this._yapi, next_hwid);
  }
  static FirstDataLogger() {
    let next_hwid = YAPI.imm_getFirstHardwareId("DataLogger");
    if (next_hwid == null)
      return null;
    return YDataLogger.FindDataLogger(next_hwid);
  }
  static FirstDataLoggerInContext(yctx) {
    let next_hwid = yctx.imm_getFirstHardwareId("DataLogger");
    if (next_hwid == null)
      return null;
    return YDataLogger.FindDataLoggerInContext(yctx, next_hwid);
  }
};
YDataLogger.CURRENTRUNINDEX_INVALID = YAPI_INVALID_UINT;
YDataLogger.TIMEUTC_INVALID = YAPI_INVALID_LONG;
YDataLogger.RECORDING_OFF = 0;
YDataLogger.RECORDING_ON = 1;
YDataLogger.RECORDING_PENDING = 2;
YDataLogger.RECORDING_INVALID = -1;
YDataLogger.AUTOSTART_OFF = 0;
YDataLogger.AUTOSTART_ON = 1;
YDataLogger.AUTOSTART_INVALID = -1;
YDataLogger.BEACONDRIVEN_OFF = 0;
YDataLogger.BEACONDRIVEN_ON = 1;
YDataLogger.BEACONDRIVEN_INVALID = -1;
YDataLogger.USAGE_INVALID = YAPI_INVALID_UINT;
YDataLogger.CLEARHISTORY_FALSE = 0;
YDataLogger.CLEARHISTORY_TRUE = 1;
YDataLogger.CLEARHISTORY_INVALID = -1;
var YSystemEnv = class {
  constructor() {
    this.isNodeJS = false;
    this.hasSSDP = false;
  }
  unknownSystemEnvError() {
    return new YoctoError("Unspecified runtime environment, your project should include at least once either yocto_api_nodejs or yocto_api_html");
  }
  hookUnhandledRejection(handler) {
    throw this.unknownSystemEnvError();
  }
  getWebSocketHub(obj_yapi, urlInfo) {
    throw this.unknownSystemEnvError();
  }
  getHttpHub(obj_yapi, urlInfo) {
    throw this.unknownSystemEnvError();
  }
  getWebSocketCallbackHub(obj_yapi, urlInfo, ws) {
    throw this.unknownSystemEnvError();
  }
  getHttpCallbackHub(yapi, urlInfo, incomingMessage, serverResponse) {
    throw this.unknownSystemEnvError();
  }
  getSSDPManager(obj_yapi) {
    throw this.unknownSystemEnvError();
  }
  loadfile(file) {
    return __awaiter(this, void 0, void 0, function* () {
      throw this.unknownSystemEnvError();
    });
  }
  downloadfile(url) {
    return __awaiter(this, void 0, void 0, function* () {
      throw this.unknownSystemEnvError();
    });
  }
};
var _UnspecifiedSystemEnv = new YSystemEnv();
var YGenericHub = class {
  constructor(yapi, urlInfo) {
    this._lastErrorType = YAPI_SUCCESS;
    this._lastErrorMsg = "no error";
    this.notiflen = 0;
    this.lastPingStamp = 0;
    this.timeoutId = null;
    this.isNotifWorking = false;
    this.devListExpires = 0;
    this.serialByYdx = [];
    this.retryDelay = 15;
    this.notifPos = -1;
    this.notifCarryOver = "";
    this.currPos = 0;
    this.missing = {};
    this.disconnecting = false;
    this.notbynOpenTimeout = null;
    this.notbynTryOpen = null;
    this._reconnectionTimer = null;
    this._firstArrivalCallback = true;
    this._missing = {};
    this._rwAccess = null;
    this._hubAdded = false;
    this._yapi = yapi;
    this.urlInfo = urlInfo;
    this._connectionType = 0;
  }
  _throw(int_errType, str_errMsg, obj_retVal) {
    this._lastErrorType = int_errType;
    this._lastErrorMsg = str_errMsg;
    return this._yapi._throw(int_errType, str_errMsg, obj_retVal);
  }
  imm_setConnectionType(hubtype) {
    this._connectionType = hubtype;
  }
  imm_forceUpdate() {
    this.devListExpires = this._yapi.GetTickCount();
  }
  imm_logrequest(method, devUrl, obj_body) {
    let msg = "Request: " + method + " " + devUrl;
    if (obj_body) {
      msg += " (file=" + obj_body.fname + ")";
    }
    this._yapi.imm_log(msg);
  }
  testHub(mstimeout, errmsg) {
    return __awaiter(this, void 0, void 0, function* () {
      let yreq = yield this.request("GET", "/api/module.json", null, 0);
      if (yreq.errorType != YAPI_SUCCESS) {
        errmsg.msg = yreq.errorMsg;
        return yreq.errorType;
      }
      if (!this._hubAdded) {
        yield this.signalHubConnected();
      }
      return YAPI_SUCCESS;
    });
  }
  signalHubConnected() {
    return __awaiter(this, void 0, void 0, function* () {
      this.notbynOpenTimeout = null;
      if (this._connectionType != 2) {
        yield this._yapi.ensureUpdateDeviceListNotRunning();
        yield this._yapi._addHub(this);
        this._hubAdded = true;
      }
    });
  }
  imm_testHubAgainLater() {
    this.isNotifWorking = false;
    this.devListExpires = 0;
    if (this._connectionType == 1 && this._hubAdded) {
      this._yapi._pendingHubs[this.urlInfo.url] = this;
      this._yapi.imm_forgetHub(this);
      this._hubAdded = false;
    }
    if (this._reconnectionTimer) {
      return true;
    }
    if (this.retryDelay < 15e3)
      this.retryDelay *= 2;
    if (this.notbynOpenTimeout) {
      let now = this._yapi.GetTickCount();
      if (now >= this.notbynOpenTimeout) {
        return false;
      }
      if (now + this.retryDelay > this.notbynOpenTimeout) {
        this.retryDelay = this.notbynOpenTimeout - now;
      }
    }
    this._reconnectionTimer = setTimeout(() => {
      this._reconnectionTimer = null;
      if (this.notbynTryOpen) {
        this.notbynTryOpen();
      }
    }, this.retryDelay);
    return true;
  }
  hubUpdateDeviceList() {
    return __awaiter(this, void 0, void 0, function* () {
      let hubDev = this._yapi.imm_getDevice(this.urlInfo.url);
      try {
        hubDev.imm_dropCache();
        let retcode = yield hubDev.refresh();
        if (retcode != YAPI_SUCCESS) {
          if (this._connectionType == 1) {
            yield this._yapi.updateDeviceList_process(this, hubDev, [], {});
          }
          this.imm_disconnectNow();
          return this._throw(retcode, hubDev._lastErrorMsg, retcode);
        }
        let yreq = yield hubDev.requestAPI(this._yapi.defaultCacheValidity);
        if (yreq.errorType != YAPI_SUCCESS) {
          if (this._connectionType == 1) {
            yield this._yapi.updateDeviceList_process(this, hubDev, [], {});
          }
          this.imm_disconnectNow();
          return yreq.errorType;
        }
        let whitePages = yreq.obj_result.services.whitePages;
        let yellowPages = yreq.obj_result.services.yellowPages;
        if (!whitePages) {
          this.imm_disconnectNow();
          return this._throw(YAPI_IO_ERROR, "Device " + hubDev.imm_describe() + " is not a hub", YAPI_IO_ERROR);
        }
        retcode = yield this._yapi.updateDeviceList_process(this, hubDev, whitePages, yellowPages);
        if (retcode != YAPI_SUCCESS) {
          this.imm_disconnectNow();
          return this._throw(this._yapi._lastErrorType, this._yapi._lastErrorMsg, this._yapi._lastErrorType);
        }
        if (this.isNotifWorking) {
          this.devListExpires = this._yapi.GetTickCount() + this._yapi._deviceListValidityMs;
        } else {
          this.devListExpires = this._yapi.GetTickCount() + 500;
        }
        return YAPI_SUCCESS;
      } catch (e) {
        this._yapi.imm_log("Exception during device enumeration: ", e);
        if (this._connectionType == 1) {
          try {
            yield this._yapi.updateDeviceList_process(this, hubDev, [], {});
          } catch (e2) {
          }
        }
        this.imm_disconnectNow();
        return YAPI_IO_ERROR;
      }
    });
  }
  hasRwAccess() {
    return __awaiter(this, void 0, void 0, function* () {
      if (this._rwAccess == null) {
        let yreq = yield this.request("GET", "/api/module/serialNumber.json?serialNumber=rwTest", null, 0);
        this._rwAccess = yreq.errorType == YAPI_SUCCESS;
      }
      return this._rwAccess;
    });
  }
  request(method, devUrl, obj_body, tcpchan) {
    return __awaiter(this, void 0, void 0, function* () {
      let res = new YHTTPRequest(null);
      res.errorType = YAPI_NOT_SUPPORTED;
      res.errorMsg = "GenericHub subclass expected";
      return res;
    });
  }
  imm_getBoundary() {
    return "Zz" + Math.floor(Math.random() * 16777215).toString(16) + "zZ";
  }
  imm_formEncodeBody(obj_body, str_boundary) {
    let hdr = this._yapi.imm_str2bin('Content-Disposition: form-data; name="' + obj_body.fname + '"; filename="api"\r\nContent-Type: application/octet-stream\r\nContent-Transfer-Encoding: binary\r\n\r\n');
    let boundary = this._yapi.imm_str2bin(str_boundary);
    let dash = this._yapi.imm_str2bin("--");
    let crlf = this._yapi.imm_str2bin("\r\n");
    let parts = [dash, boundary, crlf, hdr, obj_body.data, crlf, dash, boundary, dash, crlf];
    let i, len = 0;
    for (i = 0; i < parts.length; i++) {
      len += parts[i].length;
    }
    let res = new Uint8Array(len);
    len = 0;
    for (i = 0; i < parts.length; i++) {
      res.set(parts[i], len);
      len += parts[i].length;
    }
    return res;
  }
  getBootloaders() {
    return __awaiter(this, void 0, void 0, function* () {
      let yreq = yield this.request("GET", "/flash.json?a=list", null, 1);
      if (yreq.errorType != YAPI_SUCCESS) {
        return this._throw(yreq.errorType, yreq.errorMsg, []);
      }
      let flashState = JSON.parse(YAPI.imm_bin2str(yreq.bin_result));
      return flashState["list"];
    });
  }
  firmwareUpdate(serial, firmware, settings, progress) {
    return __awaiter(this, void 0, void 0, function* () {
      let use_self_flash = false;
      let baseUrl = "";
      let need_reboot = true;
      let _throw = (msg) => {
        return this._throw(YAPI.IO_ERROR, msg, [msg]);
      };
      progress(5, "Check bootloader type");
      let yreq = yield this.request("GET", "/api/module.json", null, 0);
      if (yreq.errorType != YAPI_SUCCESS) {
        return _throw("Hub is not responding");
      }
      let json = JSON.parse(this._yapi.imm_bin2str(yreq.bin_result));
      let ownSerial = json.serialNumber;
      if (ownSerial.slice(0, 7) == "VIRTHUB") {
        use_self_flash = false;
      } else if (serial == ownSerial) {
        use_self_flash = true;
      } else {
        yreq = yield this.request("GET", "/bySerial/" + serial + "/flash.json?a=state", null, 0);
        if (yreq.errorType == YAPI_SUCCESS) {
          use_self_flash = true;
          baseUrl = "/bySerial/" + serial;
        }
      }
      let bootloaders = yield this.getBootloaders();
      let is_shield = serial.slice(0, 7) == "YHUBSHL";
      let i;
      for (i = 0; i < bootloaders.length; i++) {
        let bl = bootloaders[i];
        if (bl == serial) {
          need_reboot = false;
        } else if (is_shield) {
          if (bl.slice(0, 7) == "YHUBSHL") {
            return _throw("Only one YoctoHub-Shield is allowed in update mode");
          }
        }
      }
      if (!use_self_flash && need_reboot) {
        if (bootloaders.length >= 4) {
          return _throw("Too many devices in update mode");
        }
      }
      yreq = yield this.request("GET", baseUrl + "/flash.json?a=state", null, 0);
      if (yreq.errorType != YAPI_SUCCESS) {
        return _throw("Cannot check state of firmware upload");
      }
      json = JSON.parse(this._yapi.imm_bin2str(yreq.bin_result));
      if (json["state"] == "uploading" || json["state"] == "flashing") {
        return _throw("Cannot start firmware update: busy (" + json["state"] + ")");
      }
      progress(10, "Send firmware file");
      let progressCb = function(curr, total) {
        curr >>= 10;
        total >>= 10;
        progress(10 + (28 * curr / total >> 0), "Send firmware file: " + curr + "KB / " + total + "KB");
      };
      yreq = yield this.request("POST", baseUrl + "/upload.html", new YHTTPBody("firmware", firmware.imm_getData(), progressCb), 0);
      if (yreq.errorType != YAPI_SUCCESS) {
        return _throw("Firmware upload failed: " + yreq.errorMsg);
      }
      yreq = yield this.request("GET", baseUrl + "/flash.json?a=state", null, 0);
      if (yreq.errorType != YAPI_SUCCESS) {
        return _throw("Cannot check state of firmware upload");
      }
      json = JSON.parse(this._yapi.imm_bin2str(yreq.bin_result));
      if (json["state"] != "valid") {
        return _throw("Upload of firmware failed: invalid firmware(" + json["state"] + ")");
      }
      if (json["progress"] != "100") {
        return _throw("Upload of firmware failed: incomplete upload");
      }
      if (use_self_flash) {
        let settingsStr = this._yapi.imm_bin2str(settings);
        let settingsAndFiles = JSON.parse(settingsStr);
        let settingsOnly = settingsAndFiles["api"];
        let startupApi = {};
        for (let key in settingsOnly) {
          if (key != "services") {
            startupApi[key] = settingsOnly[key];
          }
        }
        let startupConf = this._yapi.imm_str2bin(JSON.stringify(startupApi));
        progress(38, "Save current settings");
        yreq = yield this.request("POST", baseUrl + "/upload.html", new YHTTPBody("startupConf.json", startupConf, null), 0);
        if (yreq.errorType != YAPI_SUCCESS) {
          return _throw("Failed to save settings on hub");
        }
        progress(39, "Save current settings");
        yreq = yield this.request("POST", baseUrl + "/upload.html", new YHTTPBody("firmwareConf", startupConf, null), 0);
        if (yreq.errorType != YAPI_SUCCESS) {
          return _throw("Failed to save settings on hub");
        }
      }
      if (use_self_flash) {
        progress(40, "Flash firmware");
        yield this.request("GET", baseUrl + "/api/module/rebootCountdown?rebootCountdown=-1003", null, 0);
        yield this._yapi.Sleep(7e3);
      } else {
        if (need_reboot) {
          yield this.request("GET", "/bySerial/" + serial + "/api/module/rebootCountdown?rebootCountdown=-2", null, 0);
        }
        let timeout = YAPI.GetTickCount() + 2e4;
        let res;
        let found = false;
        progress(40, "Wait for device to be in bootloader");
        do {
          bootloaders = yield this.getBootloaders();
          for (i = 0; i < bootloaders.length; i++) {
            let bl = bootloaders[i];
            if (bl == serial) {
              found = true;
              break;
            }
          }
          if (!found) {
            yield this._yapi.Sleep(500);
          }
        } while (!found && YAPI.GetTickCount() < timeout);
        progress(45, "Flash firmware");
        let fwsize = firmware.imm_getData().length + 512 >> 10;
        let checkTimer;
        let checkFlash = () => {
          this.request("GET", baseUrl + "/flash.json?a=state", null, 1).then((flashReq) => {
            if (flashReq.errorType == YAPI_SUCCESS) {
              let jsonState = YAPI.imm_bin2str(flashReq.bin_result);
              let res2 = JSON.parse(jsonState);
              if (res2.state == "flashing") {
                if (res2.progress < 20) {
                  progress(45 + (res2.progress / 3 >> 0), "Erasing previous firmware: " + (fwsize * (res2.progress - 3) / 18 >> 0) + "KB / " + fwsize + "KB");
                } else {
                  progress(45 + (res2.progress / 3 >> 0), "Flashing new firmware: " + (fwsize * (res2.progress - 20) / 76 >> 0) + "KB / " + fwsize + "KB");
                }
              }
            }
            checkTimer = setTimeout(checkFlash, 500);
          }).catch((e) => {
            this._yapi.imm_log("Exception during firmware flash: ", e);
            checkTimer = setTimeout(checkFlash, 500);
          });
        };
        checkTimer = setTimeout(checkFlash, 1e3);
        yreq = yield this.request("GET", "/flash.json?a=flash&s=" + serial, null, 0);
        clearTimeout(checkTimer);
        if (yreq.errorType != YAPI_SUCCESS) {
          return _throw("Cannot check state of firmware flash");
        }
        return JSON.parse(this._yapi.imm_bin2str(yreq.bin_result));
      }
      return null;
    });
  }
  imm_commonDisconnect() {
    if (this.timeoutId)
      clearTimeout(this.timeoutId);
    this.timeoutId = null;
    this.disconnecting = true;
  }
  reportFailure(message) {
    return __awaiter(this, void 0, void 0, function* () {
    });
  }
  disconnect() {
    return __awaiter(this, void 0, void 0, function* () {
      this.imm_commonDisconnect();
    });
  }
  imm_isForwarded() {
    return false;
  }
  imm_disconnectNow() {
  }
  imm_isOnline() {
    return Date.now() - this.lastPingStamp < 1e4;
  }
};
var YWebSocketHub = class extends YGenericHub {
  constructor(yapi, urlInfo) {
    super(yapi, urlInfo);
    this._DEFAULT_TCP_ROUND_TRIP_TIME = 30;
    this._DEFAULT_TCP_MAX_WINDOW_SIZE = 4 * 65536;
    this._YIO_DEFAULT_TCP_TIMEOUT = 2e4;
    this._YIO_1_MINUTE_TCP_TIMEOUT = 6e4;
    this._YIO_10_MINUTES_TCP_TIMEOUT = 6e5;
    this._USB_META_UTCTIME_SIZE = 5;
    this._USB_META_DLFLUSH_SIZE = 1;
    this._USB_META_ACK_D2H_PACKET_SIZE = 2;
    this._USB_META_WS_ANNOUNCE_SIZE = 8 + 20;
    this._USB_META_WS_AUTHENTICATION_SIZE = 28;
    this._USB_META_WS_ERROR_SIZE = 6;
    this._USB_META_ACK_UPLOAD_SIZE = 6;
    this._USB_META_WS_VALID_SHA1 = 1;
    this._USB_META_WS_RW = 2;
    this.websocket = null;
    this.notbynOpenPromise = null;
    this.notbynOpenTimeoutObj = null;
    this.tcpChan = [];
    this.nextAsyncId = 48;
    this._reconnectionTimer = null;
    this._connectionTime = 0;
    this._remoteVersion = 0;
    this._remoteSerial = "";
    this._remoteNonce = -1;
    this._nonce = -1;
    this._session_error = null;
    this._session_errno = null;
    this._lastUploadAckBytes = [0];
    this._lastUploadAckTime = [0];
    this._lastUploadRateBytes = [0];
    this._lastUploadRateTime = [0];
    this._uploadRate = [0];
    this.fwd_nonce = -1;
    this.fwd_websocket = null;
    this.fwd_credentials = [];
    this.fwd_closeCallback = null;
    this._connectionState = 2;
    this._tcpRoundTripTime = this._DEFAULT_TCP_ROUND_TRIP_TIME;
    this._tcpMaxWindowSize = this._DEFAULT_TCP_MAX_WINDOW_SIZE;
    this.fwd_connectionState = 1;
  }
  imm_asyncWebSocketError(errorType, message) {
    this._yapi.imm_log("WS: " + message + " on " + this.urlInfo.url);
  }
  testHub(mstimeout, errmsg) {
    return __awaiter(this, void 0, void 0, function* () {
      if (this.disconnecting) {
        if (errmsg) {
          errmsg.msg = "I/O error";
        }
        return YAPI_IO_ERROR;
      }
      this._connectionState = 2;
      if (!this.notbynOpenPromise) {
        this.notbynOpenTimeout = mstimeout ? this._yapi.GetTickCount() + mstimeout : null;
        this.notbynOpenPromise = new Promise((resolve, reject) => {
          if (mstimeout) {
            this.notbynOpenTimeoutObj = setTimeout(() => {
              resolve({errorType: YAPI_TIMEOUT, errorMsg: "Timeout on WebSocket connection"});
              this.imm_commonDisconnect();
              this.imm_disconnectNow();
            }, mstimeout);
          }
          this.notbynTryOpen = () => {
            if (this.disconnecting) {
              resolve({errorType: YAPI_IO_ERROR, errorMsg: "I/O error"});
            } else {
              this.imm_webSocketOpen(this.urlInfo.url + "not.byn");
              this._firstArrivalCallback = true;
              if (!this.websocket) {
                resolve({errorType: YAPI_IO_ERROR, errorMsg: "I/O error"});
              } else {
                this.websocket.onmessage = (evt) => {
                  this._webSocketMsg(new Uint8Array(evt.data));
                  if (this._connectionState == 4) {
                    this._connectionState = 5;
                    if (this.notbynOpenTimeoutObj) {
                      clearTimeout(this.notbynOpenTimeoutObj);
                      this.notbynOpenTimeoutObj = null;
                    }
                    this.signalHubConnected().catch((e) => {
                      this.imm_disconnectNow();
                    }).then(() => {
                      resolve({errorType: YAPI_SUCCESS, errorMsg: ""});
                    });
                  } else if (this._connectionState == 0) {
                    if (this._session_error) {
                      if (errmsg) {
                        errmsg.msg = this._session_error;
                      }
                      this._yapi.imm_log("WebSocket error: " + this._session_error);
                    }
                    if (this._session_errno == 401) {
                      this.imm_commonDisconnect();
                      resolve({errorType: YAPI_UNAUTHORIZED, errorMsg: "Unauthorized access"});
                    } else {
                      resolve({errorType: YAPI_IO_ERROR, errorMsg: "I/O error"});
                    }
                    this.imm_disconnectNow();
                  }
                };
                this.websocket.onclose = (evt) => {
                  if (this._yapi._logLevel >= 4) {
                    this._yapi.imm_log("WebSocket connection closed");
                  }
                  this._connectionState = 1;
                  this.websocket = null;
                  if (this.retryDelay < 0) {
                    this.imm_commonDisconnect();
                  }
                  this.imm_dropAllPendingConnection();
                  if (this.disconnecting) {
                    return;
                  }
                  if (!this.imm_testHubAgainLater()) {
                    resolve({errorType: YAPI_IO_ERROR, errorMsg: "I/O error"});
                  }
                };
                this.websocket.onerror = (evt) => {
                  if (evt.message && (!/ ETIMEDOUT /.test(evt.message) || this._yapi._logLevel >= 4)) {
                    this._yapi.imm_log("WebSocket error: ", evt);
                  }
                  if (this.retryDelay < 0) {
                    this.imm_commonDisconnect();
                  }
                  this.imm_disconnectNow();
                  if (this.disconnecting) {
                    this._yapi.imm_log("Disconnecting after error");
                    return;
                  }
                  if (!this.imm_testHubAgainLater()) {
                    resolve({errorType: YAPI_IO_ERROR, errorMsg: "I/O error"});
                  }
                };
                if (this.timeoutId) {
                  clearTimeout(this.timeoutId);
                }
                this.timeoutId = setTimeout(() => {
                  if (!this.imm_isForwarded()) {
                    this._yapi.imm_log("WS: connection stalled during open");
                    this.imm_disconnectNow();
                  }
                }, 6e4);
              }
            }
          };
          this.notbynTryOpen();
        });
      }
      let res_struct = yield this.notbynOpenPromise;
      if (errmsg) {
        errmsg.msg = res_struct.errorMsg;
      }
      this.notbynOpenPromise = null;
      return res_struct.errorType;
    });
  }
  imm_computeAuth(user, pass, serial, nonce) {
    let ha1_str = user + ":" + serial + ":" + pass;
    let ha1 = this._yapi.imm_bin2hexstr(this._yapi.imm_yMD5(ha1_str)).toLowerCase();
    let nonce8 = new Uint8Array([(nonce & 255) >>> 0, (nonce & 65280) >>> 8, (nonce & 16711680) >>> 16, nonce >>> 24]);
    let sha1_raw = ha1 + this._yapi.imm_bin2hexstr(nonce8).toLowerCase();
    return this._yapi.imm_ySHA1(sha1_raw.toLowerCase());
  }
  imm_isForwarded() {
    return this.fwd_connectionState == 5 && this.fwd_websocket !== null;
  }
  _webSocketMsg(arr_bytes) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        if (this.imm_isForwarded()) {
          this.lastPingStamp = Date.now();
          this.fwd_websocket.send(arr_bytes);
          return;
        }
        let reltime = (this._yapi.GetTickCount() - this._connectionTime) / 1e3;
        let ystream = arr_bytes[0] >>> 3;
        let text = "";
        if (ystream == 8) {
          for (let i = 1; i < arr_bytes.length; i++) {
            text += String.fromCharCode(arr_bytes[i]);
          }
          yield this._yapi.parseEvents(this, text);
          return;
        }
        let ws = this.websocket;
        let tcpchan = arr_bytes[0] & 7;
        if (ystream == 1 || ystream == 2 || ystream == 9) {
          if (tcpchan > 3) {
            this.imm_asyncWebSocketError(YAPI_IO_ERROR, "Unexpected frame for tcpChan " + tcpchan + " (" + ystream + ")");
            return;
          }
          let tcp_end = arr_bytes.length;
          let yreq = this.tcpChan[tcpchan];
          if (!yreq) {
            this.imm_asyncWebSocketError(YAPI_IO_ERROR, "Drop frame for closed tcpChan " + tcpchan + " (" + ystream + ")");
            return;
          }
          if (ystream == 9) {
            tcp_end--;
            let rcvId = arr_bytes[tcp_end];
            if (this._yapi._logLevel >= 5) {
              this._yapi.imm_log("async-" + rcvId + " close received");
            }
            if (yreq.asyncId == 0) {
              if (this._yapi._logLevel >= 4) {
                this._yapi.imm_log("async-" + rcvId + " close received while req @" + yreq._creat + " was pending");
              }
              this.imm_asyncWebSocketError(YAPI_IO_ERROR, "Asynchronous close received, sync reply request");
              return;
            } else if (yreq.asyncId != rcvId) {
              if (this._yapi._logLevel >= 4) {
                this._yapi.imm_log("async-" + rcvId + " close received instead of async-" + yreq.asyncId + " close");
              }
              this.imm_asyncWebSocketError(YAPI_IO_ERROR, "Incorrect async-close signature on tcpChan " + tcpchan);
              return;
            }
          }
          let oldArr = yreq.bin_result;
          let newArr = new Uint8Array(oldArr.length + tcp_end - 1);
          newArr.set(oldArr, 0);
          newArr.set(arr_bytes.subarray(1, tcp_end), oldArr.length);
          yreq.bin_result = newArr;
          if (ystream == 2 || ystream == 9) {
            this.tcpChan[tcpchan] = yreq.next;
            if (ystream == 2) {
              if (yreq.asyncId != 0) {
                if (this._yapi._logLevel >= 4) {
                  this._yapi.imm_log("Synchronous close received instead of async-" + yreq.asyncId + " close");
                }
                this.imm_asyncWebSocketError(YAPI_IO_ERROR, "Synchronous close received, async ack expected");
                return;
              } else if (this.websocket) {
                if (yreq.toBeSent && yreq.sendPos < yreq.toBeSent.length) {
                  this._yapi.imm_log("WS: tcpclose at " + yreq.sendPos + " < " + yreq.toBeSent.length);
                  this.imm_disconnectNow();
                  if (yreq.timeoutId) {
                    clearTimeout(yreq.timeoutId);
                  }
                  if (yreq.asyncId == 0) {
                    yreq.errorType = YAPI_IO_ERROR;
                    yreq.errorMsg = "TCP closed during upload";
                    if (yreq.acceptor) {
                      try {
                        yreq.acceptor(yreq);
                      } catch (e) {
                      }
                    }
                  }
                  return;
                }
                if (yreq.timeoutId) {
                  let frame = new Uint8Array(1);
                  frame[0] = (2 << 3) + tcpchan;
                  this.websocket.send(frame);
                }
              }
            }
            if (yreq.timeoutId) {
              clearTimeout(yreq.timeoutId);
              yreq.timeoutId = 0;
            }
            let pos = yreq.bin_result.indexOf(13);
            if (pos < 0) {
              yreq.errorType = YAPI_IO_ERROR;
              yreq.errorMsg = "Bad response header";
            } else {
              let header = this._yapi.imm_bin2str(yreq.bin_result.subarray(0, pos));
              let words = header.split(" ");
              if (words[0] == "OK") {
                yreq.errorType = YAPI_SUCCESS;
                let nextpos = yreq.bin_result.indexOf(13, pos + 2);
                while (nextpos > pos + 2) {
                  pos = nextpos;
                  nextpos = yreq.bin_result.indexOf(13, pos + 2);
                }
                if (nextpos < 0) {
                  nextpos = pos;
                }
                yreq.bin_result = yreq.bin_result.subarray(nextpos + 2);
              } else if (words[0] == "0K") {
                yreq.errorType = YAPI_IO_ERROR;
                yreq.errorMsg = "Unexpected persistent connection";
              } else {
                let status = parseInt(words[1]);
                yreq.errorType = status == 401 ? YAPI_UNAUTHORIZED : YAPI_IO_ERROR;
                yreq.errorMsg = "HTTP error " + header.slice(words[0].length + 1) + " on " + yreq.devUrl;
              }
            }
            if (yreq.asyncId == 0) {
              if (this._yapi._logLevel >= 5) {
                this._yapi.imm_log("request @" + yreq._creat + " done, status=" + yreq.errorType);
              }
              this.imm_sendPendingRequest(tcpchan);
              if (yreq.acceptor) {
                yreq.acceptor(yreq);
              }
            } else {
              if (yreq.errorType != YAPI_SUCCESS) {
                this.imm_asyncWebSocketError(YAPI_IO_ERROR, "Async request error: " + yreq.errorMsg);
              }
            }
          }
          return;
        }
        if (!this.websocket) {
          return;
        }
        if (ystream == 5) {
          let metatype = arr_bytes[1];
          switch (metatype) {
            case 4:
              if (arr_bytes.length < 1 + this._USB_META_WS_ANNOUNCE_SIZE) {
                return;
              }
              this._remoteVersion = arr_bytes[2];
              if (this._remoteVersion < 1) {
                return;
              }
              let maxtcpws = (arr_bytes[3] << 4) + (arr_bytes[4] << 12);
              if (maxtcpws > 0) {
                this._tcpMaxWindowSize = maxtcpws;
              }
              this._remoteNonce = arr_bytes[5] + (arr_bytes[6] << 8) + (arr_bytes[7] << 16) + (arr_bytes[8] << 24);
              for (let i = 9; i < 9 + 20; i++) {
                if (arr_bytes[i] == 0) {
                  this._remoteSerial = this._yapi.imm_bin2str(arr_bytes.subarray(9, i));
                  break;
                }
              }
              let nonce = new Uint8Array(4);
              this.imm_getRandomValues(nonce);
              this._nonce = nonce[0] + (nonce[1] << 8) + (nonce[2] << 16) + (nonce[3] << 24);
              this._connectionTime = this._yapi.GetTickCount();
              this._connectionState = 3;
              let frame = new Uint8Array(1 + this._USB_META_WS_AUTHENTICATION_SIZE);
              let version = this._remoteVersion < 2 ? this._remoteVersion : 2;
              let flags = 0;
              frame[0] = 5 << 3;
              frame[1] = 5;
              frame[2] = version;
              if (this.urlInfo.pass != "") {
                flags = this._USB_META_WS_VALID_SHA1;
                let sha1 = this.imm_computeAuth(this.urlInfo.user, this.urlInfo.pass, this._remoteSerial, this._remoteNonce);
                for (let i = 0; i < sha1.length; i++) {
                  frame[9 + i] = sha1[i];
                }
              }
              frame[3] = flags & 255;
              frame[4] = flags >>> 8;
              frame[5] = this._nonce & 255;
              frame[6] = this._nonce >>> 8 & 255;
              frame[7] = this._nonce >>> 16 & 255;
              frame[8] = this._nonce >>> 24 & 255;
              this.websocket.send(frame);
              break;
            case 5:
              if (this._connectionState != 3) {
                return;
              }
              if (arr_bytes.length < 1 + this._USB_META_WS_AUTHENTICATION_SIZE) {
                return;
              }
              this._tcpRoundTripTime = this._yapi.GetTickCount() - this._connectionTime + 1;
              if (this._tcpMaxWindowSize < 2048 && this._tcpRoundTripTime < 7) {
                this._tcpRoundTripTime = 7;
              }
              let uploadRate = this._tcpMaxWindowSize * 1e3 / this._tcpRoundTripTime >> 0;
              if (this._yapi._logLevel >= 4) {
                this._yapi.imm_log("RTT=" + this._tcpRoundTripTime + "ms, WS=" + this._tcpMaxWindowSize + ", uploadRate=" + uploadRate / 1e3 + " KB/s");
              }
              this._remoteVersion = arr_bytes[2];
              if (this._remoteVersion < 1) {
                return;
              }
              let inflags = arr_bytes[3] + (arr_bytes[4] << 8);
              if ((inflags & this._USB_META_WS_RW) != 0) {
                this._rwAccess = true;
              } else {
                this._rwAccess = false;
              }
              if ((inflags & this._USB_META_WS_VALID_SHA1) != 0) {
                let remote_sha1 = arr_bytes.subarray(9, 29);
                let sha1 = this.imm_computeAuth(this.urlInfo.user, this.urlInfo.pass, this._remoteSerial, this._nonce);
                for (let i = 0; i < sha1.length; i++) {
                  if (sha1[i] != remote_sha1[i]) {
                    this._session_errno = 401;
                    this._session_error = "Authentication failed";
                    this._connectionState = 0;
                    return;
                  }
                }
                this._connectionState = 4;
              } else {
                if (this.urlInfo.pass == "") {
                  this._connectionState = 4;
                } else {
                  this._session_errno = 401;
                  if (this.urlInfo.user == "admin" && !this._rwAccess) {
                    this._session_error = "Authentication as admin failed";
                  } else {
                    this._session_error = "Password not set on remote hub";
                  }
                  this._connectionState = 0;
                  return;
                }
              }
              break;
            case 6:
              this._session_errno = arr_bytes[3] + (arr_bytes[4] << 8);
              if (this._session_errno == 401) {
                this._session_error = "Authentication failed";
              } else {
                this._session_error = "Remote hub closed connection with error " + this._session_errno;
              }
              this._connectionState = 0;
              break;
            case 7:
              tcpchan = arr_bytes[2];
              if (this.tcpChan[tcpchan]) {
                let yreq = this.tcpChan[tcpchan];
                let ackBytes = arr_bytes[3] + (arr_bytes[4] << 8) + (arr_bytes[5] << 16) + (arr_bytes[6] << 24);
                let ackTime = this._yapi.GetTickCount();
                if (this._lastUploadAckTime[tcpchan] != 0 && ackBytes > this._lastUploadAckBytes[tcpchan]) {
                  this._lastUploadAckBytes[tcpchan] = ackBytes;
                  this._lastUploadAckTime[tcpchan] = ackTime;
                  let deltaBytes = ackBytes - this._lastUploadRateBytes[tcpchan];
                  let deltaTime = ackTime - this._lastUploadRateTime[tcpchan];
                  if (deltaTime < 500)
                    break;
                  if (deltaTime < 1e3 && deltaBytes < 65536)
                    break;
                  this._lastUploadRateBytes[tcpchan] = ackBytes;
                  this._lastUploadRateTime[tcpchan] = ackTime;
                  if (yreq.progressCb && yreq.toBeSent) {
                    yreq.progressCb(ackBytes, yreq.toBeSent.length);
                  }
                  let newRate = deltaBytes * 1e3 / deltaTime;
                  this._uploadRate[tcpchan] = 0.8 * this._uploadRate[tcpchan] + 0.3 * newRate >> 0;
                  if (this._yapi._logLevel >= 5) {
                    this._yapi.imm_log("New rate: " + this._uploadRate[tcpchan] / 1e3 + " KB/s (last " + (deltaBytes / 1e3 >> 0) + "KB sent at " + (newRate >> 0) / 1e3 + " KB/s)");
                  }
                } else {
                  this._lastUploadAckBytes[tcpchan] = ackBytes;
                  this._lastUploadAckTime[tcpchan] = ackTime;
                  this._lastUploadRateBytes[tcpchan] = ackBytes;
                  this._lastUploadRateTime[tcpchan] = ackTime;
                  if (yreq.progressCb && yreq.toBeSent) {
                    yreq.progressCb(ackBytes, yreq.toBeSent.length);
                  }
                  this.imm_sendPendingRequest(tcpchan);
                }
              }
              break;
          }
          return;
        }
        this.imm_asyncWebSocketError(YAPI_IO_ERROR, "Unsupported message: " + this._yapi.imm_bin2hexstr(arr_bytes));
      } catch (e) {
        this._yapi.imm_log("Unhandled exception in _webSocketMsg:", e);
      }
    });
  }
  imm_webSocketSend(arr_bytes) {
    if (this.websocket) {
      this.websocket.send(arr_bytes);
    }
  }
  request(method, devUrl, obj_body, tcpchan) {
    return __awaiter(this, void 0, void 0, function* () {
      if (this._yapi._logLevel >= 3) {
        this.imm_logrequest(method, devUrl, obj_body);
      }
      let httpPromise = new Promise((resolve, reject) => {
        let subReq = method + " " + devUrl + " \r\n\r\n";
        let ws = this.websocket;
        let isAsync = this._remoteVersion > 0 && devUrl.slice(-2) == "&.";
        let yreq = new YHTTPRequest(new Uint8Array(0));
        if (this._yapi._logLevel >= 5) {
          yreq._creat = (Date.now() % 6e5).toString();
          this._yapi.imm_log("request @" + yreq._creat + ": " + method + " " + devUrl);
        }
        yreq.acceptor = resolve;
        yreq.devUrl = devUrl;
        yreq.sendPos = 0;
        if (obj_body) {
          let boundary = this.imm_getBoundary();
          let body = this.imm_formEncodeBody(obj_body, boundary);
          subReq = subReq.slice(0, -2) + "Content-Type: multipart/form-data, boundary=" + boundary + "\r\n\r\n";
          yreq.toBeSent = new Uint8Array(subReq.length + body.length);
          yreq.toBeSent.set(body, subReq.length);
          yreq.progressCb = obj_body.progressCb;
        } else {
          yreq.toBeSent = new Uint8Array(subReq.length);
        }
        for (let i = 0; i < subReq.length; i++) {
          yreq.toBeSent[i] = subReq.charCodeAt(i);
        }
        if (tcpchan > 3) {
          yreq.errorType = YAPI_IO_ERROR;
          yreq.errorMsg = "Unsupported tcpChan " + tcpchan;
          try {
            yreq.acceptor(yreq);
          } catch (e) {
          }
          return;
        }
        if (!ws || this.disconnecting || this._connectionState != 5) {
          if (this._yapi._logLevel >= 4) {
            this._yapi.imm_log("request @" + yreq._creat + " failed, websocket is down");
          }
          yreq.errorType = YAPI_IO_ERROR;
          yreq.errorMsg = "WebSocket not connected";
          try {
            yreq.acceptor(yreq);
          } catch (e) {
          }
          return;
        }
        if (isAsync) {
          yreq.asyncId = this.nextAsyncId++;
          if (this.nextAsyncId >= 127) {
            this.nextAsyncId = 48;
          }
        }
        let queue = this.tcpChan[tcpchan];
        if (queue) {
          while (queue.next) {
            queue = queue.next;
          }
          queue.next = yreq;
        } else {
          this.tcpChan[tcpchan] = yreq;
        }
        this.imm_sendPendingRequest(tcpchan);
      });
      return httpPromise;
    });
  }
  imm_sendPendingRequest(tcpchan) {
    let yreq = this.tcpChan[tcpchan];
    while (yreq) {
      if (!this.websocket || this.disconnecting || this._connectionState != 5) {
        if (this._yapi._logLevel >= 4) {
          this._yapi.imm_log("request @" + yreq._creat + " failed, websocket is down");
        }
        yreq.errorType = YAPI_IO_ERROR;
        yreq.errorMsg = "WebSocket not connected";
        if (yreq.acceptor) {
          try {
            yreq.acceptor(yreq);
          } catch (e) {
          }
        }
        yreq = yreq.next;
        continue;
      }
      let pendingCount = 1;
      for (let yr = yreq; yr.next; yr = yr.next)
        pendingCount++;
      if (!yreq.toBeSent) {
        if (yreq.asyncId == 0) {
          if (this._yapi._logLevel >= 5) {
            this._yapi.imm_log(pendingCount.toString() + " req pending, @" + yreq._creat + " not completed");
          }
          return;
        }
        yreq = yreq.next;
        continue;
      }
      let isAsync = yreq.asyncId != 0;
      let asyncCloseSet = false;
      let pos = yreq.sendPos;
      let end = yreq.toBeSent.length;
      let i, frame;
      if (end > 2108 && this._remoteVersion >= 2 && tcpchan == 0) {
        if (pos == 0) {
          end = 2108;
          this._lastUploadAckBytes[tcpchan] = 0;
          this._lastUploadAckTime[tcpchan] = 0;
          this._uploadRate[tcpchan] = this._tcpMaxWindowSize * 1e3 / this._tcpRoundTripTime >> 0;
        } else if (this._lastUploadAckTime[tcpchan] == 0) {
          if (yreq.sendTimeoutId)
            clearTimeout(yreq.sendTimeoutId);
          yreq.sendTimeoutId = setTimeout(() => {
            this.imm_sendPendingRequest(tcpchan);
          }, this._tcpRoundTripTime);
          return;
        } else {
          let bytesOnTheAir = pos - this._lastUploadAckBytes[tcpchan];
          let uploadRate = this._uploadRate[tcpchan];
          let timeOnTheAir = this._yapi.GetTickCount() - this._lastUploadAckTime[tcpchan];
          let toBeSent = 2 * uploadRate + 1024 - bytesOnTheAir + uploadRate * timeOnTheAir / 1e3 >> 0;
          if (toBeSent + bytesOnTheAir > this._DEFAULT_TCP_MAX_WINDOW_SIZE) {
            toBeSent = this._DEFAULT_TCP_MAX_WINDOW_SIZE - bytesOnTheAir;
          }
          if (toBeSent < 64) {
            let waitTime = 1e3 * (128 - toBeSent) / uploadRate >> 0;
            if (waitTime < 2)
              waitTime = 2;
            if (yreq.sendTimeoutId)
              clearTimeout(yreq.sendTimeoutId);
            yreq.sendTimeoutId = setTimeout(() => {
              this.imm_sendPendingRequest(tcpchan);
            }, waitTime);
            return;
          }
          if (end > pos + toBeSent) {
            if (toBeSent > 124) {
              toBeSent = (toBeSent / 124 >> 0) * 124;
            }
            end = pos + toBeSent;
          }
        }
      }
      while (pos < end) {
        let framelen = 1 + end - pos;
        if (framelen > 125)
          framelen = 125;
        let datalen = framelen - 1;
        if (isAsync && pos + datalen == yreq.toBeSent.length && framelen < 125) {
          frame = new Uint8Array(framelen + 1);
          frame[0] = 8 * 9 + tcpchan;
          frame[framelen] = yreq.asyncId;
          asyncCloseSet = true;
        } else {
          frame = new Uint8Array(framelen);
          frame[0] = 8 * 1 + tcpchan;
        }
        frame.set(yreq.toBeSent.subarray(pos, pos + datalen), 1);
        pos += datalen;
        this.imm_webSocketSend(frame);
      }
      let sent = pos - yreq.sendPos;
      yreq.sendPos = pos;
      if (yreq.sendPos < yreq.toBeSent.length) {
        let waitTime = 1e3 * sent / this._uploadRate[tcpchan] >> 0;
        if (waitTime < 2)
          waitTime = 2;
        if (yreq.sendTimeoutId)
          clearTimeout(yreq.sendTimeoutId);
        yreq.sendTimeoutId = setTimeout(() => {
          this.imm_sendPendingRequest(tcpchan);
        }, waitTime);
        return;
      }
      if (isAsync && !asyncCloseSet) {
        frame = new Uint8Array(2);
        frame[0] = 8 * 9 + tcpchan;
        frame[1] = yreq.asyncId;
        this.imm_webSocketSend(frame);
      }
      yreq.toBeSent = null;
      if (isAsync && yreq.acceptor) {
        try {
          yreq.acceptor(yreq);
        } catch (e) {
          this._yapi.imm_log("WS: async acceptor exception: ", e);
        }
      }
      let mstimeout = this._yapi._networkTimeoutMs;
      if (yreq.devUrl) {
        if (yreq.devUrl.indexOf("/testcb.txt") >= 0) {
          mstimeout = this._YIO_1_MINUTE_TCP_TIMEOUT;
        } else if (yreq.devUrl.indexOf("/logger.json") >= 0) {
          mstimeout = this._YIO_1_MINUTE_TCP_TIMEOUT;
        } else if (yreq.devUrl.indexOf("/rxmsg.json") >= 0) {
          mstimeout = this._YIO_1_MINUTE_TCP_TIMEOUT;
        } else if (yreq.devUrl.indexOf("/rxdata.bin") >= 0) {
          mstimeout = this._YIO_1_MINUTE_TCP_TIMEOUT;
        } else if (yreq.devUrl.indexOf("/at.txt") >= 0) {
          mstimeout = this._YIO_1_MINUTE_TCP_TIMEOUT;
        } else if (yreq.devUrl.indexOf("/files.json") >= 0) {
          mstimeout = this._YIO_1_MINUTE_TCP_TIMEOUT;
        } else if (yreq.devUrl.indexOf("/upload.html") >= 0) {
          mstimeout = this._YIO_10_MINUTES_TCP_TIMEOUT;
        } else if (yreq.devUrl.indexOf("/flash.json") >= 0) {
          mstimeout = this._YIO_10_MINUTES_TCP_TIMEOUT;
        }
      }
      yreq.timeoutId = setTimeout((chan, yr) => {
        this.imm_abortRequest(chan, yr);
      }, mstimeout, tcpchan, yreq);
      yreq._sent = (Date.now() % 6e5).toString();
      if (this._yapi._logLevel >= 5) {
        this._yapi.imm_log("req @" + yreq._creat + " sent (1/" + pendingCount.toString() + ")" + (isAsync ? " async-" + yreq.asyncId + ", continue" : ", waiting for reply"));
      }
      if (!isAsync) {
        return;
      }
      yreq = yreq.next;
    }
  }
  imm_abortRequest(tcpchan, yreq) {
    if (!yreq.timeoutId)
      return;
    yreq.timeoutId = null;
    if (yreq.asyncId == 0) {
      let frame = new Uint8Array(1);
      frame[0] = 8 * 2 + tcpchan;
      this.imm_webSocketSend(frame);
      if (this._yapi._logLevel >= 4) {
        let pendingCount = 1;
        for (let yr = yreq; yr.next; yr = yr.next)
          pendingCount++;
        this._yapi.imm_log(pendingCount.toString() + " req pending, @" + yreq._creat + " is in timeout");
      }
      setTimeout((chan, yr) => {
        this._yapi.imm_log("Dropping synchronous request after timeout: " + yr.devUrl);
        this.imm_forgetRequest(chan, yr);
      }, 5e3, tcpchan, yreq);
    }
    this.imm_asyncWebSocketError(YAPI_IO_ERROR, "Timeout on " + yreq.devUrl + " (tcpchan " + tcpchan + ")");
  }
  imm_forgetRequest(tcpchan, yreq) {
    let queue = this.tcpChan[tcpchan];
    if (queue == yreq) {
      this.tcpChan[tcpchan] = yreq.next;
      if (yreq.asyncId == 0) {
        yreq.errorType = YAPI_IO_ERROR;
        yreq.errorMsg = "Timeout on " + yreq.devUrl + " (tcpchan " + tcpchan + ")";
        if (yreq.acceptor) {
          try {
            yreq.acceptor(yreq);
          } catch (e) {
          }
        }
      }
      this.imm_sendPendingRequest(tcpchan);
    }
  }
  imm_dropAllPendingConnection() {
    if (this.fwd_connectionState != 1 && this.fwd_websocket) {
      this.fwd_connectionState = 1;
      this.fwd_websocket.close();
      this.fwd_websocket = null;
    }
    for (let tcpchan = 0; tcpchan < this.tcpChan.length; tcpchan++) {
      for (let yreq = this.tcpChan[tcpchan]; yreq; yreq = yreq.next) {
        this.tcpChan[tcpchan] = yreq.next;
        if (yreq.timeoutId) {
          clearTimeout(yreq.timeoutId);
          yreq.timeoutId = 0;
        }
        if (yreq.asyncId == 0) {
          if (this._yapi._logLevel >= 4) {
            this._yapi.imm_log("drop @" + yreq._creat + " (websocket down)");
          }
          yreq.errorType = YAPI_IO_ERROR;
          yreq.errorMsg = "Request " + yreq.devUrl + " dropped (websocket down)";
          if (yreq.acceptor) {
            try {
              yreq.acceptor(yreq);
            } catch (e) {
            }
          }
        }
      }
    }
  }
  websocketJoin(ws, arr_credentials, close_callback) {
    return __awaiter(this, void 0, void 0, function* () {
      if (this._connectionState != 5) {
        this.imm_asyncWebSocketError(YAPI_IO_ERROR, "Hub is disconnected, cannot join");
        return false;
      }
      this.fwd_websocket = ws;
      this.fwd_credentials = arr_credentials;
      this.fwd_closeCallback = close_callback;
      this.fwd_connectionState = 2;
      ws.onmessage = (evt) => {
        if (this.fwd_connectionState == 5) {
          if (this._connectionState == 5) {
            this.imm_webSocketSend(evt.data);
          } else {
            this._yapi.imm_log("WS: drop packet from fwd API (state=" + this._connectionState + ")");
          }
        } else if (this.fwd_connectionState == 3) {
          this.imm_handleAPIAuthPkt(evt.data);
        } else {
          this._yapi.imm_log("WS: drop packet from fwd API (fwd_state=" + this.fwd_connectionState + ")");
        }
      };
      ws.onclose = (evt) => {
        this.fwd_connectionState = 1;
        this.fwd_websocket = null;
        if (this.fwd_closeCallback) {
          this.fwd_closeCallback();
        }
      };
      return this.imm_sendAPIAnnouncePkt();
    });
  }
  imm_sendAPIAnnouncePkt() {
    if (!this.fwd_websocket) {
      return false;
    }
    let frame = new Uint8Array(1 + this._USB_META_WS_ANNOUNCE_SIZE);
    let nonce = new Uint8Array(4);
    this.imm_getRandomValues(nonce);
    frame[0] = 5 << 3;
    frame[1] = 4;
    frame[2] = 2;
    frame[3] = this._tcpMaxWindowSize >> 4 & 255;
    frame[4] = this._tcpMaxWindowSize >> 12 & 255;
    for (let i = 0; i < 4; i++) {
      frame[5 + i] = nonce[i];
    }
    for (let i = 0; i < this._remoteSerial.length && i < 20; i++) {
      frame[9 + i] = this._remoteSerial.charCodeAt(i);
    }
    this.fwd_nonce = frame[5] + (frame[6] << 8) + (frame[7] << 16) + (frame[8] << 24);
    this.fwd_connectionState = 3;
    this.fwd_websocket.send(frame);
    return true;
  }
  imm_handleAPIAuthPkt(msg) {
    if (msg.length < 1 + this._USB_META_WS_AUTHENTICATION_SIZE || msg[0] != 5 << 3) {
      this._yapi.imm_log("bad-apiauth1\n");
      this.fwd_connectionState = 0;
      return;
    }
    if (msg[1] != 5 || msg[2] > 2) {
      this._yapi.imm_log("bad-apiauth2\n");
      this.fwd_connectionState = 0;
      return;
    }
    this._remoteVersion = msg[2];
    let flags = msg[3] + (msg[4] << 8);
    if ((flags & this._USB_META_WS_VALID_SHA1) == 0) {
      this._yapi.imm_log("bad-apiauth3\n");
      this.fwd_connectionState = 0;
      return;
    }
    if (!this.fwd_websocket) {
      this._yapi.imm_log("no-fwd-ws\n");
      this.fwd_connectionState = 0;
      return;
    }
    let credIdx, remote_sha1 = msg.subarray(9, 29);
    let credentials = this.fwd_credentials;
    for (credIdx = 0; credIdx < credentials.length; credIdx++) {
      let j, sha12 = this.imm_computeAuth(credentials[credIdx].user, credentials[credIdx].pass, this._remoteSerial, this.fwd_nonce);
      for (j = 0; j < sha12.length; j++) {
        if (sha12[j] != remote_sha1[j])
          break;
      }
      if (j >= sha12.length)
        break;
    }
    if (credIdx >= credentials.length) {
      this._yapi.imm_log("bad-apiauth4\n");
      msg.fill(0, 3);
      this.fwd_websocket.send(msg);
      this.fwd_connectionState = 0;
      return;
    }
    msg[3] |= this._USB_META_WS_RW;
    this.fwd_nonce = msg[5] + (msg[6] << 8) + (msg[7] << 16) + (msg[8] << 24);
    let sha1 = this.imm_computeAuth(credentials[credIdx].user, credentials[credIdx].pass, this._remoteSerial, this.fwd_nonce);
    for (let i = 0; i < sha1.length; i++) {
      msg[9 + i] = sha1[i];
    }
    this.fwd_websocket.send(msg);
    this.fwd_connectionState = 5;
  }
  disconnect() {
    return __awaiter(this, void 0, void 0, function* () {
      let tcpchan_busy;
      let timeout = this._yapi.GetTickCount() + 3e3;
      do {
        tcpchan_busy = false;
        for (let tcpchan = 0; tcpchan < 4; tcpchan++) {
          if (this.tcpChan[tcpchan] != null) {
            tcpchan_busy = true;
            break;
          }
        }
        if (tcpchan_busy) {
          yield this._yapi._microSleep_internal();
        }
      } while (tcpchan_busy && timeout > this._yapi.GetTickCount());
      this.imm_commonDisconnect();
      this.imm_disconnectNow();
    });
  }
  imm_disconnectNow() {
    this._connectionState = 1;
    if (this.websocket) {
      let websocket = this.websocket;
      this.websocket = null;
      try {
        websocket.close();
      } catch (e) {
      }
      if (websocket.terminate) {
        setTimeout(() => {
          try {
            if (websocket.terminate) {
              websocket.terminate();
            }
          } catch (e) {
          }
        }, 1e3);
      }
    }
    this.imm_dropAllPendingConnection();
  }
  imm_isOnline() {
    if (this._connectionState != 5) {
      return false;
    }
    return super.imm_isOnline();
  }
};
var YGenericSSDPManager = class {
  constructor(obj_yapi) {
    this._started = false;
    this._callback = null;
    this._SSDPCache = {};
    this._thread = null;
    this.YSSDP_PORT = 1900;
    this.YSSDP_MCAST_ADDR_STR = "239.255.255.250";
    this.YSSDP_URN_YOCTOPUCE = "urn:yoctopuce-com:device:hub:1";
    this.YSSDP_DISCOVERY_MSG = "M-SEARCH * HTTP/1.1\r\nHOST:" + this.YSSDP_MCAST_ADDR_STR + ":" + this.YSSDP_PORT + '\r\nMAN:"ssdp:discover"\r\nMX:5\r\nST:' + this.YSSDP_URN_YOCTOPUCE + "\r\n\r\n";
    this._yapi = obj_yapi;
  }
  _invokeCallback(str_serial, str_addUrl, str_removeUrl) {
    return __awaiter(this, void 0, void 0, function* () {
      if (this._callback) {
        try {
          yield this._callback(str_serial, str_addUrl, str_removeUrl);
        } catch (e) {
          this._yapi.imm_log("Exception in hub discovery callback:", e);
        }
      }
    });
  }
  imm_uuidToSerial(str_uuid) {
    let s = "", pad = "";
    let i = 0, u = 0;
    for (; i < 4; i++, u += 2) {
      s += String.fromCharCode(parseInt(str_uuid.substr(u, 2), 16));
    }
    u++;
    for (; i < 6; i++, u += 2) {
      s += String.fromCharCode(parseInt(str_uuid.substr(u, 2), 16));
    }
    u++;
    for (; i < 8; i++, u += 2) {
      s += String.fromCharCode(parseInt(str_uuid.substr(u, 2), 16));
    }
    s += "-";
    u = str_uuid.indexOf("-COFF-EE");
    if (u < 0) {
      return null;
    }
    u += 8;
    while (str_uuid.charAt(u) === "0")
      u++;
    if (s.substr(0, 8) === "VIRTHUB0") {
      pad = "0000000000";
    } else {
      pad = "00000";
    }
    s += pad.substr(str_uuid.length - u);
    s += str_uuid.substr(u);
    return s;
  }
  ySSDPUpdateCache(str_uuid, str_url, int_cacheValidity) {
    return __awaiter(this, void 0, void 0, function* () {
      if (int_cacheValidity <= 0) {
        int_cacheValidity = 1800;
      }
      int_cacheValidity *= 1e3;
      let now = this._yapi.GetTickCount();
      let p = this._SSDPCache[str_uuid];
      if (p) {
        p.detectedTime = now;
        p.maxAge = int_cacheValidity;
        if (str_url !== p.url) {
          yield this._invokeCallback(p.serial, str_url, p.url);
          p.url = str_url;
        } else {
          yield this._invokeCallback(p.serial, str_url, null);
        }
      } else {
        let serial = this.imm_uuidToSerial(str_uuid);
        if (serial) {
          this._SSDPCache[str_uuid] = {
            serial,
            url: str_url,
            detectedTime: now,
            maxAge: int_cacheValidity
          };
          yield this._invokeCallback(serial, str_url, null);
        }
      }
    });
  }
  ySSDPParseMessage(str_msg) {
    return __awaiter(this, void 0, void 0, function* () {
      let SSDP_HTTP = "HTTP/1.1 200 OK";
      let SSDP_NOTIFY = "NOTIFY * HTTP/1.1";
      let lines = str_msg.split("\r\n");
      let values = {};
      if (lines[0] === SSDP_HTTP || lines[0] === SSDP_NOTIFY) {
        for (let i = 1; i < lines.length; i++) {
          let parts = lines[i].split(": ");
          if (parts.length === 2) {
            values[parts[0].trim()] = parts[1].trim();
          }
        }
        if (values["LOCATION"] && values["USN"] && values["CACHE-CONTROL"] && values["USN"].indexOf(this.YSSDP_URN_YOCTOPUCE) > 0) {
          let uuid = values["USN"].split(":")[1];
          let location2 = values["LOCATION"].split("/")[2];
          let cacheVal = parseInt(values["CACHE-CONTROL"]);
          yield this.ySSDPUpdateCache(uuid, location2, cacheVal);
        }
      }
    });
  }
  ySSDPCheckExpiration() {
    return __awaiter(this, void 0, void 0, function* () {
      let now = this._yapi.GetTickCount();
      if (this._thread) {
        clearTimeout(this._thread);
        this._thread = null;
      }
      for (let uuid in this._SSDPCache) {
        let p = this._SSDPCache[uuid];
        if (!p)
          continue;
        if (now - p.detectedTime > p.maxAge) {
          p.maxAge = 0;
          yield this._invokeCallback(p.serial, null, p.url);
        }
      }
      this._thread = setTimeout(() => {
        this.ySSDPCheckExpiration();
      }, 3e3);
    });
  }
  ySSDPStart(func_callback) {
    return __awaiter(this, void 0, void 0, function* () {
      if (this._started) {
        return YAPI.SUCCESS;
      }
      this._callback = func_callback;
      yield this.ySSDPOpenSockets();
      this.ySSDPDiscover();
      this._started = true;
      yield this.ySSDPCheckExpiration();
    });
  }
  ySSDPStop() {
    return __awaiter(this, void 0, void 0, function* () {
      if (this._thread) {
        clearTimeout(this._thread);
        this._thread = null;
      }
      yield this.ySSDPCloseSockets();
      for (let uuid in this._SSDPCache) {
        let p = this._SSDPCache[uuid];
        if (!p)
          continue;
        if (p.maxAge) {
          yield this._yapi.UnregisterHub(p.url);
          p.maxAge = 0;
          yield this._invokeCallback(p.serial, null, p.url);
        }
      }
      this._SSDPCache = {};
      this._started = false;
    });
  }
  ySSDPDiscover() {
    return __awaiter(this, void 0, void 0, function* () {
      for (let rep = 0; rep < 3; rep++) {
        yield YAPI.Sleep(10 << rep);
        yield this.ySSDPSendPacket(this.YSSDP_DISCOVERY_MSG, this.YSSDP_PORT, this.YSSDP_MCAST_ADDR_STR);
      }
    });
  }
};
var YAPIContext = class {
  constructor(system_env) {
    this._detectType = Y_DETECT_NONE;
    this._hubs = [];
    this._ssdpManager = null;
    this._pendingHubs = {};
    this._devs = {};
    this._snByUrl = {};
    this._snByName = {};
    this._fnByType = {};
    this._lastErrorType = YAPI_SUCCESS;
    this._lastErrorMsg = "no error";
    this._updateDevListStarted = 0;
    this._pendingCallbacks = [];
    this._logLevel = 2;
    this._logCallback = null;
    this._arrivalCallback = null;
    this._namechgCallback = null;
    this._removalCallback = null;
    this._hubDiscoveryCallback = null;
    this._forwardValues = 0;
    this._calibHandlers = [];
    this._ValueCallbackList = [];
    this._TimedReportCallbackList = [];
    this._beacons = {};
    this._isNodeJS = false;
    this._networkTimeoutMs = DEFAULT_NETWORK_TIMEOUT_MS;
    this._deviceListValidityMs = DEFAULT_DEVICE_LIST_VALIDITY_MS;
    this.defaultEncoding = "binary";
    this.exceptionsDisabled = false;
    this.SUCCESS = 0;
    this.NOT_INITIALIZED = -1;
    this.INVALID_ARGUMENT = -2;
    this.NOT_SUPPORTED = -3;
    this.DEVICE_NOT_FOUND = -4;
    this.VERSION_MISMATCH = -5;
    this.DEVICE_BUSY = -6;
    this.TIMEOUT = -7;
    this.IO_ERROR = -8;
    this.NO_MORE_DATA = -9;
    this.EXHAUSTED = -10;
    this.DOUBLE_ACCES = -11;
    this.UNAUTHORIZED = -12;
    this.RTC_NOT_READY = -13;
    this.FILE_NOT_FOUND = -14;
    this.SSL_ERROR = -15;
    this.defaultCacheValidity = 5;
    this.INVALID_INT = YAPI_INVALID_INT;
    this.INVALID_UINT = YAPI_INVALID_UINT;
    this.INVALID_LONG = YAPI_INVALID_LONG;
    this.INVALID_DOUBLE = YAPI_INVALID_DOUBLE;
    this.MIN_DOUBLE = YAPI_MIN_DOUBLE;
    this.MAX_DOUBLE = YAPI_MAX_DOUBLE;
    this.INVALID_STRING = YAPI_INVALID_STRING;
    this.HASH_BUF_SIZE = YOCTO_HASH_BUF_SIZE;
    this.DETECT_NONE = Y_DETECT_NONE;
    this.DETECT_USB = Y_DETECT_USB;
    this.DETECT_NET = Y_DETECT_NET;
    this.DETECT_ALL = Y_DETECT_ALL;
    this.system_env = system_env || YAPI && YAPI.system_env || _UnspecifiedSystemEnv;
    this._isNodeJS = this.system_env.isNodeJS;
    this._uniqueID = String.fromCharCode(Math.random() * 79 + 48, Math.random() * 79 + 48, Math.random() * 79 + 48);
    this.imm_ResetToDefaults();
  }
  imm_ResetToDefaults() {
    this._detectType = this.DETECT_NONE;
    this._hubs = [];
    this._pendingHubs = {};
    this._devs = {};
    this._snByUrl = {};
    this._snByName = {};
    this._fnByType = {};
    this._fnByType.Module = new YFunctionType(this, "Module");
    this._lastErrorType = YAPI_SUCCESS;
    this._lastErrorMsg = "no error";
    this._updateDevListStarted = 0;
    this._pendingCallbacks = [];
    this._logLevel = 2;
    this._logCallback = null;
    this._arrivalCallback = null;
    this._namechgCallback = null;
    this._removalCallback = null;
    this._hubDiscoveryCallback = null;
    this._forwardValues = 0;
    this._ValueCallbackList = [];
    this._TimedReportCallbackList = [];
    this._beacons = {};
    this._calibHandlers = [];
    for (let i = 1; i <= 20; i++) {
      this.RegisterCalibrationHandler(i, this.LinearCalibrationHandler);
    }
    this.RegisterCalibrationHandler(YOCTO_CALIB_TYPE_OFS, this.LinearCalibrationHandler);
    this.exceptionsDisabled = false;
  }
  _throw(int_errType, str_errMsg, obj_retVal) {
    this._lastErrorType = int_errType;
    this._lastErrorMsg = str_errMsg;
    if (!this.exceptionsDisabled) {
      let exc = new YoctoError(str_errMsg);
      exc.errorType = int_errType;
      throw exc;
    }
    return obj_retVal;
  }
  imm_setSystemEnv(env) {
    this.system_env = env;
    this._isNodeJS = env.isNodeJS;
  }
  imm_log(msg, ...moreArgs) {
    let now = new Date();
    let day = now.getFullYear().toString() + "-" + ("0" + (now.getMonth() + 1)).slice(-2) + "-" + ("0" + now.getDate()).slice(-2);
    let time = ("0" + now.getHours().toString()).slice(-2) + ":" + ("0" + now.getMinutes()).slice(-2) + ":" + ("0" + now.getSeconds()).slice(-2);
    let prefix = day + " " + time + " [" + this._uniqueID + "] ";
    let isError = false;
    if (moreArgs.length > 0) {
      if (moreArgs[0].constructor && /Error/i.test(moreArgs[0].constructor.name)) {
        isError = true;
      }
    }
    if (this._logCallback) {
      try {
        if (moreArgs.length > 0) {
          if (moreArgs[0].message) {
            msg += moreArgs[0].message;
          } else {
            msg += moreArgs[0].toString();
          }
        }
        this._logCallback(prefix + msg);
      } catch (e) {
        console.error(prefix + "Exception in custom log callback: ", e);
        console.log("... while trying to log:");
        if (isError) {
          console.error(prefix + msg, ...moreArgs);
        } else {
          console.log(prefix + msg, ...moreArgs);
        }
      }
    } else {
      if (isError) {
        console.error(prefix + msg, ...moreArgs);
      } else {
        console.log(prefix + msg, ...moreArgs);
      }
    }
  }
  RegisterLogFunction(logfun) {
    return __awaiter(this, void 0, void 0, function* () {
      this._logCallback = logfun;
      return YAPI_SUCCESS;
    });
  }
  _addHub(newhub) {
    return __awaiter(this, void 0, void 0, function* () {
      let serial = this._snByUrl[newhub.urlInfo.url];
      if (!serial) {
        let newdev = new YDevice(this, newhub.urlInfo.url, null, null);
        yield newdev.refresh();
      }
      let hubFound = false;
      for (let i = 0; i < this._hubs.length; i++) {
        let url = this._hubs[i].urlInfo.url;
        if (newhub.urlInfo.url == url) {
          hubFound = true;
          break;
        }
      }
      if (!hubFound) {
        this._hubs.push(newhub);
      }
      if (this._pendingHubs[newhub.urlInfo.url]) {
        delete this._pendingHubs[newhub.urlInfo.url];
      }
    });
  }
  imm_getHub(obj_urlInfo) {
    let i;
    for (i = 0; i < this._hubs.length; i++) {
      let info2 = this._hubs[i].urlInfo;
      if (info2.host == obj_urlInfo.host && info2.port == obj_urlInfo.port && info2.domain == obj_urlInfo.domain) {
        return this._hubs[i];
      }
    }
    return null;
  }
  ensureUpdateDeviceListNotRunning() {
    return __awaiter(this, void 0, void 0, function* () {
      while (this._updateDevListStarted && this.GetTickCount() - this._updateDevListStarted < 30 * 1e3) {
        yield this.Sleep(25);
      }
    });
  }
  _updateDeviceList_internal(bool_forceupdate, bool_invokecallbacks) {
    return __awaiter(this, void 0, void 0, function* () {
      if (this._updateDevListStarted && this.GetTickCount() - this._updateDevListStarted < 30 * 1e3) {
        return {
          errorType: YAPI_SUCCESS,
          errorMsg: "no error"
        };
      }
      for (let i = 0; i < this._hubs.length; i++) {
        if (this._hubs[i]._firstArrivalCallback && bool_invokecallbacks && this._arrivalCallback) {
          bool_forceupdate = true;
          break;
        }
      }
      if (bool_forceupdate) {
        for (let i = 0; i < this._hubs.length; i++) {
          this._hubs[i].imm_forceUpdate();
        }
      }
      try {
        this._updateDevListStarted = this.GetTickCount();
        let hubs = [];
        for (let i = 0; i < this._hubs.length; i++) {
          let hub = this._hubs[i];
          let rootUrl = hub.urlInfo.url;
          let hubDev = this.imm_getDevice(rootUrl);
          if (!hubDev) {
            continue;
          }
          if (hub.devListExpires <= this.GetTickCount()) {
            hub._missing = {};
            hubs.push(hub);
          }
        }
        for (let serial in this._devs) {
          let rooturl = this._devs[serial].imm_getRootUrl();
          for (let i = 0; i < hubs.length; i++) {
            let huburl = hubs[i].urlInfo.url;
            if (rooturl.substr(0, huburl.length) == huburl) {
              hubs[i]._missing[serial] = true;
            }
          }
        }
        let update_promises = [];
        for (let i = 0; i < hubs.length; i++) {
          let prom = hubs[i].hubUpdateDeviceList();
          update_promises.push(prom);
        }
        yield Promise.all(update_promises);
        if (bool_invokecallbacks) {
          let nbEvents = this._pendingCallbacks.length;
          for (let i = 0; i < nbEvents; i++) {
            let evt = this._pendingCallbacks[i];
            switch (evt.event) {
              case "+":
                if (this._logLevel >= 3) {
                  this.imm_log("Device " + evt.serial + " plugged");
                }
                if (this._arrivalCallback) {
                  try {
                    yield evt.module.load(this.defaultCacheValidity);
                    yield this._arrivalCallback(evt.module);
                  } catch (e) {
                    this.imm_log("Exception in device arrival callback:", e);
                  }
                }
                break;
              case "/":
                if (this._namechgCallback) {
                  try {
                    yield this._namechgCallback(evt.module);
                  } catch (e) {
                    this.imm_log("Exception in device change callback:", e);
                  }
                }
                break;
              case "-":
                if (this._logLevel >= 3) {
                  this.imm_log("Device " + evt.serial + " unplugged");
                }
                if (this._removalCallback) {
                  try {
                    yield this._removalCallback(evt.module);
                  } catch (e) {
                    this.imm_log("Exception in device removal callback:", e);
                  }
                }
                break;
            }
          }
          this._pendingCallbacks = this._pendingCallbacks.slice(nbEvents);
        }
      } finally {
        this._updateDevListStarted = 0;
      }
      return {
        errorType: YAPI_SUCCESS,
        errorMsg: "no error"
      };
    });
  }
  updateDeviceList_process(hub, hubDev, whitePages, yellowPages) {
    return __awaiter(this, void 0, void 0, function* () {
      let refresh = {};
      let serial = null;
      for (let classname in yellowPages) {
        let obj_yprecs = yellowPages[classname];
        let ftype = this._fnByType[classname];
        if (ftype == void 0) {
          ftype = new YFunctionType(this, classname);
          this._fnByType[classname] = ftype;
        }
        for (let i = 0; i < obj_yprecs.length; i++) {
          let yprec = obj_yprecs[i];
          let hwid = yprec.hardwareId;
          let basetype = yprec.baseType;
          if (ftype.imm_reindexFunction(hwid, yprec["logicalName"], yprec["advertisedValue"], basetype)) {
            serial = hwid.substr(0, hwid.indexOf("."));
            refresh[serial] = true;
          }
        }
      }
      for (let i = 0; i < whitePages.length; i++) {
        let devinfo = whitePages[i];
        serial = devinfo.serialNumber;
        let devydx = devinfo.index;
        let rooturl = devinfo.networkUrl.slice(0, -3);
        if (rooturl.charAt(0) == "/")
          rooturl = hubDev.imm_getRootUrl() + rooturl.substr(1);
        let currdev = this._devs[serial];
        if (currdev && this._arrivalCallback && hub._firstArrivalCallback) {
          let module = YModule.FindModuleInContext(this, serial + ".module");
          this._pendingCallbacks.push({event: "+", serial, module});
        }
        hub.serialByYdx[devydx] = serial;
        if (!currdev) {
          new YDevice(this, rooturl, devinfo, yellowPages);
          if (this._arrivalCallback) {
            let module = YModule.FindModuleInContext(this, serial + ".module");
            this._pendingCallbacks.push({event: "+", serial, module});
          }
        } else if (currdev.imm_getLogicalName() != devinfo["logicalName"]) {
          yield currdev.refresh();
          if (this._namechgCallback) {
            let module = YModule.FindModuleInContext(this, serial + ".module");
            this._pendingCallbacks.push({event: "/", serial, module});
          }
        } else if (refresh[serial] || currdev.imm_getRootUrl() != rooturl || currdev.imm_getBeacon() != devinfo["beacon"]) {
          yield currdev.refresh();
        }
        hub._missing[serial] = false;
      }
      if (this._arrivalCallback && hub._firstArrivalCallback) {
        hub._firstArrivalCallback = false;
      }
      for (serial in hub._missing) {
        if (hub._missing[serial] && this._devs[serial]) {
          if (this._removalCallback) {
            let module = YModule.FindModuleInContext(this, serial + ".module");
            this._pendingCallbacks.push({event: "-", serial, module});
          }
          this.imm_forgetDevice(this._devs[serial]);
        }
      }
      return YAPI_SUCCESS;
    });
  }
  parseEvents(hub, str_lines) {
    return __awaiter(this, void 0, void 0, function* () {
      hub.isNotifWorking = true;
      hub.lastPingStamp = Date.now();
      if (hub.timeoutId) {
        clearTimeout(hub.timeoutId);
      }
      hub.timeoutId = setTimeout(() => {
        if (!hub.imm_isForwarded()) {
          this.imm_log("WS: closing stalled connection");
          hub.imm_disconnectNow();
        }
      }, 6e4);
      let rows = (hub.notifCarryOver + str_lines).split("\n");
      let nrows = rows.length;
      let value;
      if (str_lines.substr(-1) != "\n") {
        hub.notifCarryOver = rows[--nrows];
      } else {
        hub.notifCarryOver = "";
      }
      nrows--;
      for (let idx = 0; idx < nrows; idx++) {
        let ev = rows[idx];
        if (ev.length == 0)
          continue;
        let firstCode = ev.charAt(0);
        if (ev.length >= 3 && firstCode >= NOTIFY_NETPKT_CONFCHGYDX && firstCode <= NOTIFY_NETPKT_TIMEAVGYDX) {
          hub.retryDelay = 15;
          if (hub.notifPos >= 0)
            hub.notifPos += ev.length + 1;
          let devydx = ev.charCodeAt(1) - 65;
          let funydx = ev.charCodeAt(2) - 48;
          if (funydx >= 64) {
            funydx -= 64;
            devydx += 128;
          }
          let serial = hub.serialByYdx[devydx];
          if (serial && this._devs[serial]) {
            let funcid = funydx == 15 ? "time" : this._devs[serial].imm_functionIdByFunYdx(funydx);
            if (funcid != "") {
              let dev;
              value = ev.slice(3);
              switch (firstCode) {
                case NOTIFY_NETPKT_FUNCVALYDX:
                  if (value != "")
                    value = value.split("\0")[0];
                  yield this.setFunctionValue(serial + "." + funcid, value);
                  break;
                case NOTIFY_NETPKT_DEVLOGYDX:
                  dev = this._devs[serial];
                  if (dev != null) {
                    dev.imm_triggerLogPull();
                  }
                  break;
                case NOTIFY_NETPKT_CONFCHGYDX:
                  yield this.setConfChange(serial);
                  break;
                case NOTIFY_NETPKT_TIMEVALYDX:
                case NOTIFY_NETPKT_TIMEAVGYDX:
                case NOTIFY_NETPKT_TIMEV2YDX:
                  let pos, arr = [firstCode == "x" ? 0 : firstCode == "z" ? 1 : 2];
                  for (pos = 0; pos < value.length; pos += 2) {
                    arr.push(parseInt(value.substr(pos, 2), 16));
                  }
                  dev = this._devs[serial];
                  if (funcid == "time") {
                    let time = arr[1] + 256 * arr[2] + 65536 * arr[3] + 16777216 * arr[4];
                    let ms = arr[5] * 4;
                    let duration;
                    if (arr.length >= 7) {
                      ms += arr[6] >> 6;
                      let duration_ms = arr[7];
                      duration_ms += (arr[6] & 15) * 256;
                      if (arr[6] & 16) {
                        duration = duration_ms;
                      } else {
                        duration = duration_ms / 1e3;
                      }
                    } else {
                      duration = 0;
                    }
                    dev.imm_setTimeRef(time + ms / 1e3, duration);
                  } else {
                    yield this.setTimedReport(serial + "." + funcid, dev.imm_getLastTimeRef(), dev.imm_getLastDuration(), arr);
                  }
                  break;
                case NOTIFY_NETPKT_FUNCV2YDX:
                  let rawval = this.imm_decodeNetFuncValV2(value);
                  if (rawval != null) {
                    let decodedval = this.imm_decodePubVal(rawval[0], rawval, 1, 6);
                    yield this.setFunctionValue(serial + "." + funcid, decodedval);
                  }
                  break;
                case NOTIFY_NETPKT_FLUSHV2YDX:
                default:
                  break;
              }
            }
          }
        } else if (ev.length > 5 && ev.substr(0, 4) == "YN01") {
          hub.retryDelay = 15;
          if (hub.notifPos >= 0)
            hub.notifPos += ev.length + 1;
          let notype = ev.substr(4, 1);
          let parts;
          if (notype == "@") {
            hub.notifPos = parseInt(ev.slice(5));
          } else {
            switch (parseInt(notype)) {
              case 0:
                parts = ev.slice(5).split(",");
                if (parts.length > 2) {
                  let int_beacon = parseInt(parts[2]);
                  yield this.setBeaconChange(parts[0], int_beacon);
                }
              case 2:
              case 4:
              case 8:
                hub.devListExpires = 0;
                break;
              case 5:
                parts = ev.slice(5).split(",");
                if (parts.length > 2) {
                  value = parts[2].split("\0");
                  yield this.setFunctionValue(parts[0] + "." + parts[1], value[0]);
                }
                break;
            }
          }
        } else {
          hub.devListExpires = 0;
          hub.notifPos = -1;
        }
        hub.currPos += ev.length + 1;
      }
      if (this._forwardValues > 0) {
        yield this.HandleEvents(new YErrorMsg());
      }
    });
  }
  imm_decodeNetFuncValV2(p) {
    let p_ofs = 0;
    let ch = p.charCodeAt(p_ofs) & 255;
    let len = 0;
    let funcVal = [0, 0, 0, 0, 0, 0, 0];
    if (ch < 32 || ch > 32 + 127) {
      return null;
    }
    ch -= 32;
    funcVal[0] = (ch & 64) != 0 ? NOTIFY_V2_6RAWBYTES : NOTIFY_V2_TYPEDDATA;
    ch &= 63;
    while (len < YOCTO_PUBVAL_SIZE) {
      p_ofs++;
      if (p_ofs >= p.length)
        break;
      let newCh = p.charCodeAt(p_ofs) & 255;
      if (newCh == NOTIFY_NETPKT_STOP) {
        break;
      }
      if (newCh < 32 || newCh > 32 + 127) {
        return null;
      }
      newCh -= 32;
      ch = (ch << 7) + newCh;
      funcVal[len + 1] = ch >>> 5 - len & 255;
      len++;
    }
    return funcVal;
  }
  imm_decodePubVal(int_typeV2, arr_funcval, int_ofs, int_funcvalen) {
    let buffer = "";
    let endp;
    if (int_typeV2 == NOTIFY_V2_6RAWBYTES || int_typeV2 == NOTIFY_V2_TYPEDDATA) {
      let funcValType;
      if (int_typeV2 == NOTIFY_V2_6RAWBYTES) {
        funcValType = PUBVAL_6RAWBYTES;
      } else {
        funcValType = arr_funcval[int_ofs++];
      }
      switch (funcValType) {
        case PUBVAL_LEGACY:
          break;
        case PUBVAL_1RAWBYTE:
        case PUBVAL_2RAWBYTES:
        case PUBVAL_3RAWBYTES:
        case PUBVAL_4RAWBYTES:
        case PUBVAL_5RAWBYTES:
        case PUBVAL_6RAWBYTES:
          for (let i = 0; i < funcValType; i++) {
            let c = arr_funcval[int_ofs++];
            let b = c >>> 4;
            buffer += b.toString(16);
            b = c & 15;
            buffer += b.toString(16);
          }
          return buffer;
        case PUBVAL_C_LONG:
        case PUBVAL_YOCTO_FLOAT_E3:
          let numVal = arr_funcval[int_ofs++];
          numVal += arr_funcval[int_ofs++] << 8;
          numVal += arr_funcval[int_ofs++] << 16;
          numVal += arr_funcval[int_ofs++] << 24;
          if (funcValType == PUBVAL_C_LONG) {
            return String(Math.round(numVal));
          } else {
            buffer = String(Math.round(numVal * 1e3) / 1e6);
            endp = buffer.length;
            while (endp > 0 && buffer[endp - 1] == "0") {
              --endp;
            }
            if (endp > 0 && buffer[endp - 1] == ".") {
              --endp;
              buffer = buffer.substr(0, endp);
            }
            return buffer;
          }
        case PUBVAL_C_FLOAT:
          let v = arr_funcval[int_ofs++];
          v += arr_funcval[int_ofs++] << 8;
          v += arr_funcval[int_ofs++] << 16;
          v += arr_funcval[int_ofs++] << 24;
          let fraction = (v & (1 << 23) - 1) + (1 << 23) * (v >>> 31 | 1);
          let exp = (v >>> 23 & 255) - 127;
          let floatVal = fraction * Math.pow(2, exp - 23);
          buffer = String(Math.round(floatVal * 1e6) / 1e6);
          endp = buffer.length;
          while (endp > 0 && buffer[endp - 1] == "0") {
            --endp;
          }
          if (endp > 0 && buffer[endp - 1] == ".") {
            --endp;
            buffer = buffer.substr(0, endp);
          }
          return buffer;
        default:
          return "?";
      }
      let len = 0;
      buffer = "";
      while (len < YOCTO_PUBVAL_SIZE && len < int_funcvalen) {
        if (arr_funcval[len] == 0)
          break;
        buffer += String.fromCharCode(arr_funcval[len]);
        len++;
      }
    }
    return buffer;
  }
  imm_decExp(int_pow) {
    const arr = [
      1e-6,
      1e-5,
      1e-4,
      1e-3,
      0.01,
      0.1,
      1,
      10,
      100,
      1e3,
      1e4,
      1e5,
      1e6,
      1e7,
      1e8,
      1e9
    ];
    return arr[int_pow];
  }
  imm_decimalToDouble(val) {
    let negate = false;
    let res;
    let mantis = val & 2047;
    if (mantis == 0)
      return 0;
    if (val > 32767) {
      negate = true;
      val = 65536 - val;
    } else if (val < 0) {
      negate = true;
      val = -val;
    }
    let decexp = this.imm_decExp(val >>> 11);
    if (decexp >= 1) {
      res = mantis * decexp;
    } else {
      res = mantis / Math.round(1 / decexp);
    }
    return negate ? -res : res;
  }
  imm_doubleToDecimal(val) {
    let negate = false;
    let comp, mant;
    let decpow;
    let res;
    if (val == 0) {
      return 0;
    }
    if (val < 0) {
      negate = true;
      val = -val;
    }
    comp = val / 1999;
    decpow = 0;
    while (comp > this.imm_decExp(decpow) && decpow < 15) {
      decpow++;
    }
    mant = val / this.imm_decExp(decpow);
    if (decpow == 15 && mant > 2047) {
      res = (15 << 11) + 2047;
    } else {
      res = (decpow << 11) + Math.round(mant);
    }
    return negate ? -res : res;
  }
  imm_getCalibrationHandler(calibType) {
    return this._calibHandlers[calibType];
  }
  imm_decodeWords(data) {
    let udata = [];
    for (let i = 0; i < data.length; ) {
      let c = data[i];
      let val = 0;
      if (c == "*") {
        i++;
      } else if (c == "X") {
        val = 65535;
        i++;
      } else if (c == "Y") {
        val = 32767;
        i++;
      } else if (c >= "a") {
        let srcpos = udata.length - 1 - (data.charCodeAt(i++) - 97);
        if (srcpos >= 0) {
          val = udata[srcpos];
        }
      } else {
        if (i + 3 > data.length) {
          return udata;
        }
        val = data.charCodeAt(i++) - 48;
        val += data.charCodeAt(i++) - 48 << 5;
        let lastcode = data.charCodeAt(i++);
        if (lastcode == 122)
          lastcode = 92;
        val += lastcode - 48 << 10;
      }
      udata.push(val);
    }
    return udata;
  }
  imm_decodeFloats(data) {
    let idata = [];
    let p = 0;
    let datalen = data.length;
    while (p < datalen) {
      let val = 0;
      let sign = 1;
      let dec = 0;
      let decInc = 0;
      let c = data[p++];
      while (c != "-" && (c < "0" || c > "9")) {
        if (p >= datalen) {
          return idata;
        }
        c = data[p++];
      }
      if (c == "-") {
        if (p >= datalen) {
          return idata;
        }
        sign = -sign;
        c = data[p++];
      }
      while (c >= "0" && c <= "9" || c == ".") {
        if (c == ".") {
          decInc = 1;
        } else if (dec < 3) {
          val = val * 10 + (c.charCodeAt(0) - 48);
          dec += decInc;
        }
        if (p < datalen) {
          c = data[p++];
        } else {
          c = "\0";
        }
      }
      if (dec < 3) {
        if (dec == 0)
          val *= 1e3;
        else if (dec == 1)
          val *= 100;
        else
          val *= 10;
      }
      idata.push(sign * val);
    }
    return idata;
  }
  imm_atoi(str_data) {
    let num = parseInt(str_data);
    if (isNaN(num)) {
      return 0;
    }
    return Math.floor(num);
  }
  imm_bin2str(bin_data) {
    let len = bin_data.length;
    let res = "";
    for (let i = 0; i < len; i += 20) {
      let subdata = bin_data.subarray(i, Math.min(i + 20, len));
      res += String.fromCharCode.apply(null, Array.from(subdata));
    }
    return res;
  }
  imm_str2bin(str_data) {
    let len = str_data.length;
    let res = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      res[i] = str_data.charCodeAt(i);
    }
    return res;
  }
  imm_bin2hexstr(bin_data) {
    let len = bin_data.length;
    let res = "";
    for (let i = 0; i < len; i++) {
      let n = bin_data[i].toString(16);
      res += n.length < 2 ? "0" + n : n;
    }
    return res.toUpperCase();
  }
  imm_hexstr2bin(str_data) {
    let len = str_data.length >>> 1;
    let res = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      res[i] = parseInt(str_data.substr(2 * i, 2), 16);
    }
    return res;
  }
  imm_getDevice(str_device) {
    let dev = null;
    let serial;
    if (str_device.substr(0, 7) == "http://" || str_device.substr(0, 5) == "ws://" || str_device.substr(0, 8) == "https://" || str_device.substr(0, 6) == "wss://") {
      serial = this._snByUrl[str_device];
      if (serial != void 0)
        dev = this._devs[serial];
    } else {
      if (this._devs[str_device]) {
        dev = this._devs[str_device];
      } else {
        serial = this._snByName[str_device];
        if (serial) {
          dev = this._devs[serial];
        }
      }
    }
    return dev;
  }
  _UpdateValueCallbackList(obj_func, bool_add) {
    return __awaiter(this, void 0, void 0, function* () {
      let index = this._ValueCallbackList.indexOf(obj_func);
      if (bool_add) {
        yield obj_func.isOnline();
        if (index < 0) {
          this._ValueCallbackList.push(obj_func);
        }
      } else if (index >= 0) {
        this._ValueCallbackList.splice(index, 1);
      }
    });
  }
  _UpdateTimedReportCallbackList(obj_func, bool_add) {
    return __awaiter(this, void 0, void 0, function* () {
      let index = this._TimedReportCallbackList.indexOf(obj_func);
      if (bool_add) {
        yield obj_func.isOnline();
        if (index < 0) {
          this._TimedReportCallbackList.push(obj_func);
        }
      } else if (index >= 0) {
        this._TimedReportCallbackList.splice(index, 1);
      }
    });
  }
  imm_functionClass(str_funcid) {
    let dotpos = str_funcid.indexOf(".");
    if (dotpos >= 0)
      str_funcid = str_funcid.substr(dotpos + 1);
    let classlen = str_funcid.length;
    while (str_funcid.substr(classlen - 1, 1) <= "9")
      classlen--;
    let classname = str_funcid.substr(0, 1).toUpperCase() + str_funcid.substr(1, classlen - 1);
    if (this._fnByType[classname] == void 0)
      this._fnByType[classname] = new YFunctionType(this, classname);
    return classname;
  }
  imm_reindexDevice(obj_dev) {
    let rootUrl = obj_dev.imm_getRootUrl();
    let serial = obj_dev.imm_getSerialNumber();
    let lname = obj_dev.imm_getLogicalName();
    this._devs[serial] = obj_dev;
    this._snByUrl[rootUrl] = serial;
    if (lname != "")
      this._snByName[lname] = serial;
    this._fnByType["Module"].imm_reindexFunction(serial + ".module", lname, null, null);
    let i, count = obj_dev.imm_functionCount();
    for (i = 0; i < count; i++) {
      let funcid = obj_dev.imm_functionId(i);
      if (funcid != "") {
        let funcname = obj_dev.imm_functionName(i);
        let classname = this.imm_functionClass(funcid);
        this._fnByType[classname].imm_reindexFunction(serial + "." + funcid, funcname, null, null);
      }
    }
  }
  imm_forgetDevice(obj_dev) {
    let rootUrl = obj_dev.imm_getRootUrl();
    let serial = obj_dev.imm_getSerialNumber();
    let lname = obj_dev.imm_getLogicalName();
    delete this._devs[serial];
    delete this._snByUrl[rootUrl];
    if (this._snByName[lname] == serial) {
      delete this._snByName[lname];
    }
    this._fnByType["Module"].imm_forgetFunction(serial + ".module");
    let i, count = obj_dev.imm_functionCount();
    for (i = 0; i < count; i++) {
      let funcid = obj_dev.imm_functionId(i);
      if (funcid != "") {
        let classname = this.imm_functionClass(funcid);
        this._fnByType[classname].imm_forgetFunction(serial + "." + funcid);
      }
    }
  }
  imm_resolveFunction(str_className, str_func) {
    if (Y_BASETYPES[str_className] == void 0) {
      if (this._fnByType[str_className] == void 0)
        this._fnByType[str_className] = new YFunctionType(this, str_className);
      return this._fnByType[str_className].imm_resolve(str_func);
    }
    let baseType = Y_BASETYPES[str_className];
    let res;
    for (str_className in this._fnByType) {
      if (this._fnByType[str_className].imm_matchBaseType(baseType)) {
        res = this._fnByType[str_className].imm_resolve(str_func);
        if (res.errorType == YAPI_SUCCESS)
          return res;
      }
    }
    return {
      errorType: YAPI_DEVICE_NOT_FOUND,
      errorMsg: "No " + str_className + " [" + str_func + "] found (old firmware?)"
    };
  }
  imm_getFriendlyNameFunction(str_className, str_func) {
    if (Y_BASETYPES[str_className] == void 0) {
      if (this._fnByType[str_className] == void 0)
        this._fnByType[str_className] = new YFunctionType(this, str_className);
      return this._fnByType[str_className].imm_getFriendlyName(str_func);
    }
    let baseType = Y_BASETYPES[str_className];
    let res;
    for (str_className in this._fnByType) {
      if (this._fnByType[str_className].imm_matchBaseType(baseType)) {
        res = this._fnByType[str_className].imm_getFriendlyName(str_func);
        if (res.errorType == YAPI_SUCCESS)
          return res;
      }
    }
    return {
      errorType: YAPI_DEVICE_NOT_FOUND,
      errorMsg: "No " + str_className + " [" + str_func + "] found (old firmware?)"
    };
  }
  imm_setFunction(str_className, str_func, obj_func) {
    if (this._fnByType[str_className] == void 0)
      this._fnByType[str_className] = new YFunctionType(this, str_className);
    this._fnByType[str_className].imm_setFunction(str_func, obj_func);
  }
  imm_getFunction(str_className, str_func) {
    if (this._fnByType[str_className] == void 0)
      this._fnByType[str_className] = new YFunctionType(this, str_className);
    return this._fnByType[str_className].imm_getFunction(str_func);
  }
  setFunctionValue(str_hwid, str_pubval) {
    return __awaiter(this, void 0, void 0, function* () {
      let classname = this.imm_functionClass(str_hwid);
      if (this._fnByType[classname].imm_setFunctionValue(str_hwid, str_pubval)) {
        let receivers = this._ValueCallbackList;
        for (let i = 0; i < receivers.length; i++) {
          let fun = receivers[i];
          if (!fun._hwId)
            continue;
          if (fun._hwId == str_hwid) {
            yield fun._invokeValueCallback(str_pubval);
          }
        }
      }
    });
  }
  setTimedReport(str_hwid, float_timestamp, float_duration, arr_report) {
    return __awaiter(this, void 0, void 0, function* () {
      let classname = this.imm_functionClass(str_hwid);
      let receivers = this._TimedReportCallbackList;
      for (let i = 0; i < receivers.length; i++) {
        let fun = receivers[i];
        if (!fun._hwId)
          continue;
        if (fun._hwId == str_hwid) {
          let dev = this.imm_getDevice(fun._serial);
          if (dev) {
            let sensor = fun;
            let report = yield sensor._decodeTimedReport(float_timestamp, float_duration, arr_report);
            yield sensor._invokeTimedReportCallback(report);
          }
        }
      }
    });
  }
  setConfChange(str_serial) {
    return __awaiter(this, void 0, void 0, function* () {
      let module = YModule.FindModuleInContext(this, str_serial + ".module");
      yield module._invokeConfigChangeCallback();
    });
  }
  setBeaconChange(str_serial, int_beacon) {
    return __awaiter(this, void 0, void 0, function* () {
      if (this._beacons[str_serial] === void 0 || this._beacons[str_serial] != int_beacon) {
        this._beacons[str_serial] = int_beacon;
        let dev = this.imm_getDevice(str_serial);
        if (dev) {
          dev._beacon = int_beacon;
        }
        let module = YModule.FindModuleInContext(this, str_serial + ".module");
        yield module._invokeBeaconCallback(int_beacon);
      }
    });
  }
  imm_getFunctionValue(str_hwid) {
    let classname = this.imm_functionClass(str_hwid);
    return this._fnByType[classname].imm_getFunctionValue(str_hwid);
  }
  imm_getFunctionBaseType(str_hwid) {
    let classname = this.imm_functionClass(str_hwid);
    return this._fnByType[classname].imm_getBaseType();
  }
  imm_getFirstHardwareId(str_className) {
    if (Y_BASETYPES[str_className] == void 0) {
      if (this._fnByType[str_className] == void 0)
        this._fnByType[str_className] = new YFunctionType(this, str_className);
      return this._fnByType[str_className].imm_getFirstHardwareId();
    }
    let baseType = Y_BASETYPES[str_className];
    let res;
    for (str_className in this._fnByType) {
      if (this._fnByType[str_className].imm_matchBaseType(baseType)) {
        res = this._fnByType[str_className].imm_getFirstHardwareId();
        if (res)
          return res;
      }
    }
    return null;
  }
  imm_getNextHardwareId(str_className, str_hwid) {
    if (Y_BASETYPES[str_className] == void 0) {
      return this._fnByType[str_className].imm_getNextHardwareId(str_hwid);
    }
    let baseType = Y_BASETYPES[str_className];
    let prevclass = this.imm_functionClass(str_hwid);
    let res = this._fnByType[prevclass].imm_getNextHardwareId(str_hwid);
    if (res)
      return res;
    for (str_className in this._fnByType) {
      if (prevclass != "") {
        if (str_className != prevclass)
          continue;
        prevclass = "";
        continue;
      }
      if (this._fnByType[str_className].imm_matchBaseType(baseType)) {
        res = this._fnByType[str_className].imm_getFirstHardwareId();
        if (res)
          return res;
      }
    }
    return null;
  }
  devRequest(str_device, str_request, obj_body = null, int_tcpchan = 0) {
    return __awaiter(this, void 0, void 0, function* () {
      let lines = str_request.split("\n");
      let res = new YHTTPRequest(null);
      let lockdev = null;
      let baseUrl;
      if (str_device.substr(0, 7) == "http://" || str_device.substr(0, 5) == "ws://" || str_device.substr(0, 8) == "https://" || str_device.substr(0, 6) == "wss://") {
        baseUrl = str_device;
        if (baseUrl.slice(-1) != "/")
          baseUrl = baseUrl + "/";
        if (lines[0].substr(0, 12) != "GET /not.byn") {
          let serial = this._snByUrl[baseUrl];
          if (serial) {
            lockdev = this._devs[serial];
          }
        }
      } else {
        lockdev = this.imm_getDevice(str_device);
        if (!lockdev) {
          res.errorType = YAPI_DEVICE_NOT_FOUND;
          res.errorMsg = "Device [" + str_device + "] not online";
          return res;
        }
        if (lines[0] == "GET /api.json") {
          return lockdev.requestAPI(this.defaultCacheValidity);
        }
        baseUrl = lockdev.imm_getRootUrl();
      }
      let words = lines[0].split(" ");
      if (words.length < 2) {
        res.errorType = YAPI_INVALID_ARGUMENT;
        res.errorMsg = "Invalid request, not enough words; expected a method name and a URL";
        return res;
      } else if (words.length > 2) {
        res.errorType = YAPI_INVALID_ARGUMENT;
        res.errorMsg = "Invalid request, too many words; make sure the URL is URI-encoded";
        return res;
      }
      let hub = null;
      for (let i = 0; i < this._hubs.length; i++) {
        let hubUrl = this._hubs[i].urlInfo.url;
        if (baseUrl.slice(0, hubUrl.length) == hubUrl) {
          hub = this._hubs[i];
          break;
        }
      }
      if (!hub && this._pendingHubs[str_device]) {
        hub = this._pendingHubs[str_device];
      }
      if (!hub) {
        res.errorType = YAPI_DEVICE_NOT_FOUND;
        res.errorMsg = "No hub found for URL " + baseUrl;
        return res;
      }
      let method = words[0];
      let devUrl = words[1];
      if (devUrl.substr(0, 1) == "/")
        devUrl = devUrl.substr(1);
      if (baseUrl.substr(0, hub.urlInfo.url.length) == hub.urlInfo.url) {
        devUrl = baseUrl.substr(hub.urlInfo.url.length - 1) + devUrl;
      } else {
        let pos = baseUrl.indexOf("//");
        pos = baseUrl.indexOf("/", pos + 3);
        devUrl = baseUrl.slice(pos) + devUrl;
      }
      if (devUrl.slice(-2) == "&." && !(yield hub.hasRwAccess())) {
        res.errorType = YAPI_UNAUTHORIZED;
        res.errorMsg = "Access denied: admin credentials required";
        return res;
      }
      let delayedCode = function delayedRequest() {
        return hub.request(method, devUrl, obj_body, int_tcpchan).catch((e) => {
          let res2 = new YHTTPRequest(null);
          res2.errorType = YAPI_IO_ERROR;
          res2.errorMsg = e.message;
          return res2;
        });
      };
      if (lockdev && int_tcpchan == 0) {
        let newPromise = lockdev._pendingQueries.then(delayedCode, delayedCode);
        lockdev._pendingQueries = newPromise;
        res = yield newPromise;
      } else {
        res = yield delayedCode();
      }
      return res;
    });
  }
  isReadOnly(str_device) {
    return __awaiter(this, void 0, void 0, function* () {
      let lockdev = this.imm_getDevice(str_device);
      if (!lockdev) {
        return true;
      }
      let baseUrl = lockdev.imm_getRootUrl();
      let hub = null;
      for (let i = 0; i < this._hubs.length; i++) {
        let hubUrl = this._hubs[i].urlInfo.url;
        if (baseUrl.slice(0, hubUrl.length) == hubUrl) {
          hub = this._hubs[i];
          break;
        }
      }
      if (!hub || !(yield hub.hasRwAccess())) {
        return true;
      }
      return false;
    });
  }
  imm_funcDev_internal(str_className, str_func) {
    let res = new YFuncRequest(null);
    let resolve = this.imm_resolveFunction(str_className, str_func);
    if (resolve.errorType != YAPI_SUCCESS) {
      res.errorType = resolve.errorType;
      res.errorMsg = resolve.errorMsg;
    } else {
      str_func = resolve.result;
      let dotpos = str_func.indexOf(".");
      let devid = str_func.substr(0, dotpos);
      let funcid = str_func.substr(dotpos + 1);
      let dev = this.imm_getDevice(devid);
      if (dev == null) {
        res.errorType = YAPI_DEVICE_NOT_FOUND;
        res.errorMsg = "Device [" + devid + "] not found";
      } else {
        res.obj_result = {_expiration: -1, device: dev, deviceid: devid, functionid: funcid, hwid: str_func};
      }
    }
    return res;
  }
  _funcDev(str_className, str_func) {
    return __awaiter(this, void 0, void 0, function* () {
      let res = this.imm_funcDev_internal(str_className, str_func);
      if (res.errorType == YAPI_SUCCESS) {
        return res;
      } else if (res.errorType == YAPI_DEVICE_NOT_FOUND && this._hubs.length == 0) {
        res.errorMsg = "Impossible to contact any device because no hub has been registered";
        return res;
      }
      let updRes = yield this._updateDeviceList_internal(true, false);
      if (updRes.errorType != YAPI_SUCCESS) {
        res.errorType = updRes.errorType;
        res.errorMsg = updRes.errorMsg;
        return res;
      }
      return this.imm_funcDev_internal(str_className, str_func);
    });
  }
  funcRequest(str_className, str_func, str_extra, int_msValidity = 0) {
    return __awaiter(this, void 0, void 0, function* () {
      let funcreq = this.imm_funcDev_internal(str_className, str_func);
      if (funcreq.errorType != YAPI_SUCCESS) {
        funcreq = yield this._funcDev(str_className, str_func);
        if (funcreq.errorType != YAPI_SUCCESS) {
          return funcreq;
        }
      }
      let devreq = funcreq.obj_result;
      let loadval = null;
      if (str_extra == "") {
        let yreq = yield devreq.device.requestAPI(int_msValidity);
        if (yreq != null) {
          if (yreq.errorType != YAPI_SUCCESS || !yreq.obj_result) {
            let res = new YFuncRequest(null);
            res.errorType = yreq.errorType;
            res.errorMsg = yreq.errorMsg;
            return res;
          }
          loadval = yreq.obj_result[devreq.functionid];
        }
      } else {
        devreq.device.imm_dropCache();
      }
      if (!loadval) {
        if (str_extra == "")
          str_extra = ".json";
        let httpreq = "GET /api/" + devreq.functionid + str_extra;
        let yreq = yield this.devRequest(devreq.deviceid, httpreq, null, 0);
        if (yreq.errorType != YAPI_SUCCESS)
          return yreq;
        let replyBuff = yreq.bin_result;
        if (replyBuff.length == 0 && httpreq.indexOf("?") >= 0) {
          funcreq.obj_result = null;
          return funcreq;
        }
        try {
          loadval = JSON.parse(this.imm_bin2str(replyBuff));
        } catch (err) {
        }
      }
      if (!loadval) {
        funcreq.errorType = YAPI_IO_ERROR;
        funcreq.errorMsg = "Request failed, could not parse API value for function " + devreq.hwid;
      } else {
        for (let key in devreq) {
          loadval[key] = devreq[key];
        }
        funcreq.obj_result = loadval;
      }
      return funcreq;
    });
  }
  HTTPRequest(str_device, str_request) {
    return __awaiter(this, void 0, void 0, function* () {
      let yreq = yield this.devRequest(str_device, str_request, null, 0);
      if (yreq.errorType != YAPI_SUCCESS) {
        return this._throw(yreq.errorType, yreq.errorMsg, null);
      }
      return yreq.bin_result;
    });
  }
  ForceDeviceRefresh(str_device) {
    return __awaiter(this, void 0, void 0, function* () {
      let dev = this.imm_getDevice(str_device);
      if (!dev)
        return YAPI_DEVICE_NOT_FOUND;
      let rootUrl = dev.imm_getRootUrl();
      for (let i = 0; i < this._hubs.length; i++) {
        let hub = this._hubs[i];
        let hubUrl = hub.urlInfo.url;
        if (rootUrl.substr(0, hubUrl.length) === hubUrl) {
          let hubDev = this.imm_getDevice(hubUrl);
          hubDev.imm_dropCache();
          let retcode = yield hubDev.refresh();
          if (retcode != YAPI_SUCCESS) {
            return this._throw(retcode, hubDev._lastErrorMsg, retcode);
          }
          let yreq = yield hubDev.requestAPI(this.defaultCacheValidity);
          if (yreq.errorType != YAPI_SUCCESS) {
            return yreq.errorType;
          }
          let yellowPages = yreq.obj_result["services"]["yellowPages"];
          dev.imm_updateFromYP(yellowPages);
        }
      }
      dev.imm_dropCache();
      return YAPI_SUCCESS;
    });
  }
  SetDeviceListValidity_internal(deviceListValidity) {
    return __awaiter(this, void 0, void 0, function* () {
      this._deviceListValidityMs = deviceListValidity * 1e3;
    });
  }
  GetDeviceListValidity_internal() {
    return __awaiter(this, void 0, void 0, function* () {
      return this._deviceListValidityMs / 1e3 >> 0;
    });
  }
  SetNetworkTimeout_internal(networkMsTimeout) {
    return __awaiter(this, void 0, void 0, function* () {
      this._networkTimeoutMs = networkMsTimeout;
    });
  }
  GetNetworkTimeout_internal() {
    return __awaiter(this, void 0, void 0, function* () {
      return this._networkTimeoutMs;
    });
  }
  AddUdevRule_internal(force) {
    return __awaiter(this, void 0, void 0, function* () {
      return "error: Not supported in TypeScript";
    });
  }
  SetDeviceListValidity(deviceListValidity) {
    return __awaiter(this, void 0, void 0, function* () {
      return yield this.SetDeviceListValidity_internal(deviceListValidity);
    });
  }
  GetDeviceListValidity() {
    return __awaiter(this, void 0, void 0, function* () {
      return yield this.GetDeviceListValidity_internal();
    });
  }
  AddUdevRule(force) {
    return __awaiter(this, void 0, void 0, function* () {
      return yield this.AddUdevRule_internal(force);
    });
  }
  SetNetworkTimeout(networkMsTimeout) {
    return __awaiter(this, void 0, void 0, function* () {
      return yield this.SetNetworkTimeout_internal(networkMsTimeout);
    });
  }
  GetNetworkTimeout() {
    return __awaiter(this, void 0, void 0, function* () {
      return yield this.GetNetworkTimeout_internal();
    });
  }
  SetCacheValidity(cacheValidityMs) {
    return __awaiter(this, void 0, void 0, function* () {
      this.defaultCacheValidity = cacheValidityMs;
    });
  }
  GetCacheValidity() {
    return __awaiter(this, void 0, void 0, function* () {
      return this.defaultCacheValidity;
    });
  }
  GetAPIVersion() {
    return __awaiter(this, void 0, void 0, function* () {
      return this.imm_GetAPIVersion();
    });
  }
  imm_GetAPIVersion() {
    return "1.10.51983";
  }
  InitAPI(mode, errmsg) {
    return __awaiter(this, void 0, void 0, function* () {
      this._detectType = mode;
      if (this.system_env.hasSSDP) {
        if ((mode & this.DETECT_NET) !== 0) {
          yield this.TriggerHubDiscovery();
        }
      } else {
      }
      return YAPI_SUCCESS;
    });
  }
  FreeAPI() {
    return __awaiter(this, void 0, void 0, function* () {
      for (let serial in this._devs) {
        let lockdev = this._devs[serial];
        let newPromise = lockdev._pendingQueries;
        if (newPromise != null) {
          try {
            yield newPromise;
          } catch (e) {
          }
        }
      }
      yield this.KillAPI();
    });
  }
  KillAPI() {
    return __awaiter(this, void 0, void 0, function* () {
      if (this._ssdpManager) {
        yield this._ssdpManager.ySSDPStop();
        this._ssdpManager = null;
      }
      for (let i = 0; i < this._hubs.length; i++) {
        yield this._hubs[i].disconnect();
      }
      this.imm_ResetToDefaults();
    });
  }
  DisableExceptions() {
    return __awaiter(this, void 0, void 0, function* () {
      this.exceptionsDisabled = true;
    });
  }
  EnableExceptions() {
    return __awaiter(this, void 0, void 0, function* () {
      this.exceptionsDisabled = false;
    });
  }
  LogUnhandledPromiseRejections() {
    return __awaiter(this, void 0, void 0, function* () {
      this.system_env.hookUnhandledRejection((reason, promise) => {
        this.imm_log("Unhandled Rejection at: Promise ", promise, " reason: ", reason);
      });
    });
  }
  imm_parseRegisteredUrl(str_url) {
    let proto = "ws://";
    let user = "";
    let pass = "";
    let port = "4444";
    let host;
    let dom = "";
    let url = "";
    if (!this._isNodeJS && window && window.navigator && window.navigator.userAgent && /(iPad|iPhone|iPod)/g.test(window.navigator.userAgent)) {
      proto = "http://";
    }
    if (str_url.slice(0, 7) == "http://") {
      proto = "http://";
      str_url = str_url.slice(7);
    } else if (str_url.slice(0, 5) == "ws://") {
      str_url = str_url.slice(5);
    } else if (str_url.slice(0, 8) == "https://") {
      proto = "https://";
      str_url = str_url.slice(8);
    } else if (str_url.slice(0, 6) == "wss://") {
      proto = "wss://";
      str_url = str_url.slice(6);
    }
    str_url = str_url.replace("/not.byn", "");
    let pos = str_url.indexOf("/");
    if (pos > 0) {
      dom = str_url.slice(pos + 1);
      if (dom.length > 0 && dom.slice(-1) != "/")
        dom += "/";
      str_url = str_url.slice(0, pos);
    }
    url = proto;
    let authpos = str_url.indexOf("@");
    if (authpos >= 0) {
      let auth = str_url.slice(0, authpos);
      let passpos = auth.indexOf(":");
      if (passpos >= 0) {
        user = auth.slice(0, passpos);
        pass = auth.slice(passpos + 1);
        url += user + ":" + pass + "@";
      } else {
        user = auth;
        url += user + "@";
      }
      str_url = str_url.slice(authpos + 1);
    }
    pos = str_url.indexOf(":");
    if (pos < 0) {
      host = str_url;
    } else {
      host = str_url.slice(0, pos);
      port = str_url.slice(pos + 1);
    }
    if (host == "callback") {
      if (proto == "ws:") {
        url = "ws://callback:4444/";
      } else {
        url = "http://callback:4444/";
      }
    } else {
      url += host + ":" + port + "/" + dom;
    }
    return {proto, user, pass, host, port, domain: dom, url};
  }
  imm_registerHub_internal(urlInfo) {
    let newhub;
    if (urlInfo.proto.slice(0, 3) == "ws:" || urlInfo.proto.slice(0, 4) == "wss:") {
      newhub = this.system_env.getWebSocketHub(this, urlInfo);
    } else {
      newhub = this.system_env.getHttpHub(this, urlInfo);
    }
    return newhub;
  }
  imm_forgetHub(hub) {
    for (let j = 0; j < hub.serialByYdx.length; j++) {
      let serial = hub.serialByYdx[j];
      if (serial && this._devs[serial]) {
        if (this._removalCallback) {
          let module = YModule.FindModuleInContext(this, serial + ".module");
          this._pendingCallbacks.push({event: "-", serial, module});
        }
        try {
          this.imm_forgetDevice(this._devs[serial]);
        } catch (e) {
        }
      }
    }
    let i = this._hubs.indexOf(hub);
    if (i >= 0) {
      this._hubs.splice(i, 1);
    }
  }
  RegisterHub(url, errmsg) {
    return __awaiter(this, void 0, void 0, function* () {
      if (url === "net") {
        if (this.system_env.hasSSDP) {
          this._detectType |= this.DETECT_NET;
          return this.TriggerHubDiscovery();
        } else {
          return this._throw(YAPI_NOT_SUPPORTED, "Network discovery is not possible in a browser", YAPI_NOT_SUPPORTED);
        }
      }
      if (url === "usb") {
        return this._throw(YAPI_NOT_SUPPORTED, "Use the VirtualHub on 127.0.0.1 to access USB devices", YAPI_NOT_SUPPORTED);
      }
      let urlInfo = this.imm_parseRegisteredUrl(url);
      let newhub = this.imm_getHub(urlInfo);
      if (newhub || this._pendingHubs[urlInfo.url]) {
        return YAPI_SUCCESS;
      }
      newhub = this.imm_registerHub_internal(urlInfo);
      if (!newhub) {
        return this._throw(YAPI_NOT_SUPPORTED, "Unsupported hub protocol: " + urlInfo.proto, YAPI_NOT_SUPPORTED);
      }
      this._pendingHubs[urlInfo.url] = newhub;
      let sub_errmsg = new YErrorMsg();
      let retcode = yield newhub.testHub(this._networkTimeoutMs, sub_errmsg);
      if (retcode != YAPI_SUCCESS) {
        if (errmsg) {
          errmsg.msg = sub_errmsg.msg;
        }
        return this._throw(retcode, sub_errmsg.msg, retcode);
      }
      let yreq = yield this._updateDeviceList_internal(true, false);
      if (yreq.errorType != YAPI_SUCCESS) {
        if (errmsg) {
          errmsg.msg = yreq.errorMsg;
        }
        return this._throw(yreq.errorType, yreq.errorMsg, yreq.errorType);
      }
      return YAPI_SUCCESS;
    });
  }
  PreregisterHub(url, errmsg) {
    return __awaiter(this, void 0, void 0, function* () {
      let urlInfo = this.imm_parseRegisteredUrl(url);
      let newhub = this.imm_getHub(urlInfo);
      if (newhub || this._pendingHubs[urlInfo.url]) {
        return YAPI_SUCCESS;
      }
      if (this._pendingHubs[urlInfo.url]) {
        return YAPI_SUCCESS;
      }
      newhub = this.imm_registerHub_internal(urlInfo);
      if (!newhub) {
        return this._throw(YAPI_NOT_SUPPORTED, "Unsupported hub protocol: " + urlInfo.proto, YAPI_NOT_SUPPORTED);
      }
      newhub.imm_setConnectionType(1);
      this._pendingHubs[urlInfo.url] = newhub;
      newhub.testHub(0, errmsg).then((errcode) => {
        if (errcode != YAPI_SUCCESS) {
          if (this._pendingHubs[urlInfo.url]) {
            delete this._pendingHubs[urlInfo.url];
          }
        }
      });
      return YAPI_SUCCESS;
    });
  }
  RegisterHubHttpCallback(incomingMessage, serverResponse, errmsg) {
    return __awaiter(this, void 0, void 0, function* () {
      let urlInfo = this.imm_parseRegisteredUrl("http://callback:4444");
      let newhub = this.imm_getHub(urlInfo);
      if (newhub || this._pendingHubs[urlInfo.url]) {
        return YAPI_SUCCESS;
      }
      newhub = this.system_env.getHttpCallbackHub(this, urlInfo, incomingMessage, serverResponse);
      if (!newhub) {
        return this._throw(YAPI_NOT_SUPPORTED, "HTTP Callback mode is not available in this environment", YAPI_NOT_SUPPORTED);
      }
      let retcode = yield newhub.testHub(this._networkTimeoutMs, errmsg);
      if (retcode != YAPI_SUCCESS) {
        newhub.reportFailure(errmsg.msg);
        return this._throw(retcode, errmsg.msg, retcode);
      }
      let yreq = yield this._updateDeviceList_internal(true, false);
      if (yreq.errorType != YAPI_SUCCESS) {
        if (errmsg) {
          errmsg.msg = yreq.errorMsg;
          newhub.reportFailure(errmsg.msg);
        }
        return this._throw(yreq.errorType, yreq.errorMsg, yreq.errorType);
      }
      return YAPI_SUCCESS;
    });
  }
  RegisterHubWebSocketCallback(ws, errmsg, authpwd) {
    return __awaiter(this, void 0, void 0, function* () {
      let authstr = authpwd ? "ws:" + authpwd + "@" : "";
      let urlInfo = this.imm_parseRegisteredUrl("http://" + authstr + "callback:4444");
      let newhub = this.imm_getHub(urlInfo);
      if (newhub || this._pendingHubs[urlInfo.url]) {
        return YAPI_SUCCESS;
      }
      newhub = this.system_env.getWebSocketCallbackHub(this, urlInfo, ws);
      if (!newhub) {
        return this._throw(YAPI_NOT_SUPPORTED, "HTTP Callback mode is not available in this environment", YAPI_NOT_SUPPORTED);
      }
      let retcode = yield newhub.testHub(this._networkTimeoutMs, errmsg);
      if (retcode != YAPI_SUCCESS) {
        return this._throw(retcode, errmsg.msg, retcode);
      }
      let yreq = yield this._updateDeviceList_internal(true, false);
      if (yreq.errorType != YAPI_SUCCESS) {
        if (errmsg) {
          errmsg.msg = yreq.errorMsg;
        }
        return this._throw(yreq.errorType, yreq.errorMsg, yreq.errorType);
      }
      return YAPI_SUCCESS;
    });
  }
  WebSocketJoin(ws, arr_credentials, closeCallback) {
    return __awaiter(this, void 0, void 0, function* () {
      if (this._hubs.length == 0) {
        return false;
      }
      return this._hubs[0].websocketJoin(ws, arr_credentials, closeCallback);
    });
  }
  UnregisterHub(url) {
    return __awaiter(this, void 0, void 0, function* () {
      let urlInfo = this.imm_parseRegisteredUrl(url);
      let hub = this.imm_getHub(urlInfo);
      if (hub) {
        this.imm_forgetHub(hub);
        yield hub.disconnect();
      } else {
        let pdghub = this._pendingHubs[urlInfo.url];
        if (pdghub) {
          delete this._pendingHubs[urlInfo.url];
          yield pdghub.disconnect();
        }
      }
    });
  }
  TestHub(url, mstimeout, errmsg) {
    return __awaiter(this, void 0, void 0, function* () {
      let urlInfo = this.imm_parseRegisteredUrl(url);
      let newhub = this.imm_getHub(urlInfo);
      if (newhub) {
        return newhub.imm_isOnline() ? YAPI_SUCCESS : YAPI_IO_ERROR;
      }
      if (this._pendingHubs[urlInfo.url]) {
        return YAPI_IO_ERROR;
      }
      newhub = this.imm_registerHub_internal(urlInfo);
      if (!newhub) {
        return YAPI_NOT_SUPPORTED;
      }
      newhub.imm_setConnectionType(2);
      if (!errmsg)
        errmsg = new YErrorMsg();
      let res = yield newhub.testHub(mstimeout, errmsg);
      yield newhub.disconnect();
      return res;
    });
  }
  UpdateDeviceList(errmsg = null) {
    return __awaiter(this, void 0, void 0, function* () {
      let yreq = yield this._updateDeviceList_internal(false, true);
      if (yreq.errorType !== YAPI_SUCCESS) {
        if (errmsg)
          errmsg.msg = yreq.errorMsg;
        return this._throw(yreq.errorType, yreq.errorMsg, yreq.errorType);
      }
      return YAPI_SUCCESS;
    });
  }
  _hubDiscoveryCallback_internal(serial, urlToRegister, urlToUnregister) {
    return __awaiter(this, void 0, void 0, function* () {
      if (this._hubDiscoveryCallback && urlToRegister) {
        try {
          yield this._hubDiscoveryCallback(serial, urlToRegister, urlToUnregister);
        } catch (e) {
          this.imm_log("Exception in hub discovery callback:", e);
        }
      }
      if ((this._detectType & Y_DETECT_NET) !== 0) {
        if (urlToRegister) {
          if (urlToUnregister) {
            yield this.UnregisterHub(urlToUnregister);
          }
          yield this.PreregisterHub(urlToRegister, new YErrorMsg());
        }
      }
    });
  }
  TriggerHubDiscovery(errmsg = null) {
    return __awaiter(this, void 0, void 0, function* () {
      if (!this._ssdpManager) {
        this._ssdpManager = this.system_env.getSSDPManager(this);
        if (!this._ssdpManager)
          return this._lastErrorType;
        yield this._ssdpManager.ySSDPStart((serial, newUrl, oldUrl) => {
          this._hubDiscoveryCallback_internal(serial, newUrl, oldUrl);
        });
      } else {
        yield this._ssdpManager.ySSDPDiscover();
      }
      return YAPI_SUCCESS;
    });
  }
  HandleEvents(errmsg = null) {
    return __awaiter(this, void 0, void 0, function* () {
      return YAPI_SUCCESS;
    });
  }
  Sleep(ms_duration, errmsg = null) {
    return __awaiter(this, void 0, void 0, function* () {
      let end = this.GetTickCount() + ms_duration;
      yield this.HandleEvents(errmsg);
      while (this.GetTickCount() < end) {
        yield this._microSleep_internal();
        yield this.HandleEvents(errmsg);
      }
      return YAPI_SUCCESS;
    });
  }
  _microSleep_internal() {
    return new Promise(function(resolve, reject) {
      setTimeout(resolve, 3);
    });
  }
  SetTimeout(callback, ms_timeout, args) {
    this._setTimeout_internal(callback, this.GetTickCount() + ms_timeout, args);
    return YAPI_SUCCESS;
  }
  _setTimeout_internal(callback, endtime, args) {
    let delay = endtime - YAPI.GetTickCount();
    if (delay < 0) {
      callback.apply(null, args);
    } else if (delay < 100) {
      this.Sleep(delay).then(() => {
        this._setTimeout_internal(callback, endtime, args);
      });
    } else {
      this.UpdateDeviceList().then(() => {
        this.Sleep(90).then(() => {
          this._setTimeout_internal(callback, endtime, args);
        });
      });
    }
  }
  GetTickCount() {
    return Date.now();
  }
  imm_CheckLogicalName(name) {
    if (name == "")
      return true;
    if (!name)
      return false;
    if (name.length > 19)
      return false;
    return /^[A-Za-z0-9_\-]*$/.test(name);
  }
  CheckLogicalName(name) {
    return __awaiter(this, void 0, void 0, function* () {
      return this.imm_CheckLogicalName(name);
    });
  }
  RegisterDeviceArrivalCallback(arrivalCallback) {
    return __awaiter(this, void 0, void 0, function* () {
      this._arrivalCallback = arrivalCallback;
    });
  }
  RegisterDeviceChangeCallback(changeCallback) {
    return __awaiter(this, void 0, void 0, function* () {
      this._namechgCallback = changeCallback;
    });
  }
  RegisterDeviceRemovalCallback(removalCallback) {
    return __awaiter(this, void 0, void 0, function* () {
      this._removalCallback = removalCallback;
    });
  }
  RegisterHubDiscoveryCallback(hubDiscoveryCallback) {
    return __awaiter(this, void 0, void 0, function* () {
      if (!this.system_env.hasSSDP) {
        return this._throw(YAPI_NOT_SUPPORTED, "Hub discovery is not supported in this environment", YAPI_NOT_SUPPORTED);
      }
      this._hubDiscoveryCallback = hubDiscoveryCallback;
      return this.TriggerHubDiscovery();
    });
  }
  RegisterCalibrationHandler(calibrationType, calibrationHandler) {
    return __awaiter(this, void 0, void 0, function* () {
      this._calibHandlers[calibrationType] = calibrationHandler;
    });
  }
  LinearCalibrationHandler(float_rawValue, int_calibType, arr_calibParams, arr_calibRawValues, arr_calibRefValues) {
    let npt;
    let x = arr_calibRawValues[0];
    let adj = arr_calibRefValues[0] - x;
    let i = 0;
    if (int_calibType < YOCTO_CALIB_TYPE_OFS) {
      npt = Math.min(int_calibType % 10, arr_calibRawValues.length, arr_calibRefValues.length);
    } else {
      npt = arr_calibRefValues.length;
    }
    while (float_rawValue > arr_calibRawValues[i] && ++i < npt) {
      let x2 = x;
      let adj2 = adj;
      x = arr_calibRawValues[i];
      adj = arr_calibRefValues[i] - x;
      if (float_rawValue < x && x > x2) {
        adj = adj2 + (adj - adj2) * (float_rawValue - x2) / (x - x2);
      }
    }
    return float_rawValue + adj;
  }
  imm_yMD5(text) {
    let ctx = new Y_MD5Ctx();
    ctx.addData(this.imm_str2bin(text));
    return ctx.calculate();
  }
  imm_initshaw(str_s, int_ofs, int_pad, int_xinit, _shaw) {
    let ii;
    let j = -1;
    let k = 0;
    let n = str_s.length;
    for (ii = 0; ii < 64; ii++) {
      let i = int_ofs + ii;
      let c = 0;
      if (i < n) {
        c = str_s.charCodeAt(i);
      } else if (int_pad != 0) {
        if ((int_pad & 128) != 0) {
          if (i == n)
            c = int_pad;
        } else {
          if (i == n + 3)
            c = int_pad;
          else if (i == n + 4)
            c = 128;
        }
      }
      if (k == 0) {
        j++;
        _shaw[j] = 0;
        k = 32;
      }
      k -= 8;
      _shaw[j] |= c << k;
    }
    if (int_pad != 0) {
      if (int_pad == 128) {
        if (n <= int_ofs + 55) {
          _shaw[15] = 8 * n;
        }
      } else {
        _shaw[15] = 8 * (64 + n + 4);
      }
    }
    if (int_xinit != 0) {
      let xdw = int_xinit << 16 | int_xinit;
      for (j = 0; j < 16; j++) {
        _shaw[j] ^= xdw;
      }
    }
  }
  imm_itershaw(s, _shaw) {
    let a, b, c, d, e, t, k;
    a = s[0];
    b = s[1];
    c = s[2];
    d = s[3];
    e = s[4];
    for (k = 16; k < 80; k++) {
      t = _shaw[k - 3] ^ _shaw[k - 8] ^ _shaw[k - 14] ^ _shaw[k - 16];
      _shaw[k] = t << 1 | t >>> 31;
    }
    for (k = 0; k < 20; k++) {
      t = (a << 5 | a >>> 27) + e + _shaw[k] + 1518500249 + (b & c | ~b & d);
      e = d;
      d = c;
      c = b << 30 | b >>> 2;
      b = a;
      a = t & 4294967295;
    }
    for (k = 20; k < 40; k++) {
      t = (a << 5 | a >>> 27) + e + _shaw[k] + 1859775393 + (b ^ c ^ d);
      e = d;
      d = c;
      c = b << 30 | b >>> 2;
      b = a;
      a = t & 4294967295;
    }
    for (k = 40; k < 60; k++) {
      t = (a << 5 | a >>> 27) + e + _shaw[k] + 2400959708 + (b & c | b & d | c & d);
      e = d;
      d = c;
      c = b << 30 | b >>> 2;
      b = a;
      a = t & 4294967295;
    }
    for (k = 60; k < 80; k++) {
      t = (a << 5 | a >>> 27) + e + _shaw[k] + 3395469782 + (b ^ c ^ d);
      e = d;
      d = c;
      c = b << 30 | b >>> 2;
      b = a;
      a = t & 4294967295;
    }
    _shaw[0] = s[0] + a & 4294967295;
    _shaw[1] = s[1] + b & 4294967295;
    _shaw[2] = s[2] + c & 4294967295;
    _shaw[3] = s[3] + d & 4294967295;
    _shaw[4] = s[4] + e & 4294967295;
  }
  imm_ySHA1(text) {
    let shau = [1732584193, 4023233417, 2562383102, 271733878, 3285377520];
    let i, ofs = 0;
    let n = text.length;
    let _shaw = new Uint32Array(80);
    do {
      this.imm_initshaw(text, ofs, 128, 0, _shaw);
      this.imm_itershaw(shau, _shaw);
      for (i = 0; i < 5; i++) {
        shau[i] = _shaw[i];
      }
      ofs += 64;
    } while (n > ofs - 9);
    let res = new Uint8Array(20);
    for (i = 0; i < 20; i++) {
      res[i] = shau[i >>> 2] >>> 24 - 8 * (i & 3) & 255;
    }
    return res;
  }
  ComputePSK(ssid, pass) {
    return __awaiter(this, void 0, void 0, function* () {
      let sha1_init = [1732584193, 4023233417, 2562383102, 271733878, 3285377520];
      let inner = [], outer = [], shau = [], res = [];
      let iter, pos, k, _shaw;
      _shaw = new Uint32Array(80);
      this.imm_initshaw(pass, 0, 0, 13878, _shaw);
      this.imm_itershaw(sha1_init, _shaw);
      for (k = 0; k < 5; k++)
        inner[k] = _shaw[k];
      _shaw = new Uint32Array(80);
      this.imm_initshaw(pass, 0, 0, 23644, _shaw);
      this.imm_itershaw(sha1_init, _shaw);
      for (k = 0; k < 5; k++)
        outer[k] = _shaw[k];
      pos = 0;
      for (k = 0; k < 5; k++)
        shau[k] = 0;
      _shaw = new Uint32Array(80);
      this.imm_initshaw(ssid, 0, 1, 0, _shaw);
      for (iter = 0; iter < 8192; ) {
        this.imm_itershaw(inner, _shaw);
        _shaw[5] = 2147483648;
        for (k = 6; k < 15; k++) {
          _shaw[k] = 0;
        }
        _shaw[15] = 8 * (64 + 20);
        this.imm_itershaw(outer, _shaw);
        shau[0] ^= _shaw[0];
        shau[1] ^= _shaw[1];
        shau[2] ^= _shaw[2];
        shau[3] ^= _shaw[3];
        shau[4] ^= _shaw[4];
        iter++;
        if ((iter & 4095) == 0) {
          for (k = 0; k < 5 && pos < 32; k++) {
            res[pos++] = shau[k] >>> 24 & 255;
            res[pos++] = shau[k] >>> 16 & 255;
            res[pos++] = shau[k] >>> 8 & 255;
            res[pos++] = shau[k] & 255;
          }
          if (iter == 4096) {
            for (k = 0; k < 5; k++)
              shau[k] = 0;
            _shaw = new Uint32Array(80);
            this.imm_initshaw(ssid, 0, 2, 0, _shaw);
          }
        }
      }
      let hex = "";
      for (k = 0; k < 32; k++) {
        hex += ("0" + Number(res[k]).toString(16)).slice(-2);
      }
      return hex;
    });
  }
};
YAPIContext.SUCCESS = 0;
YAPIContext.NOT_INITIALIZED = -1;
YAPIContext.INVALID_ARGUMENT = -2;
YAPIContext.NOT_SUPPORTED = -3;
YAPIContext.DEVICE_NOT_FOUND = -4;
YAPIContext.VERSION_MISMATCH = -5;
YAPIContext.DEVICE_BUSY = -6;
YAPIContext.TIMEOUT = -7;
YAPIContext.IO_ERROR = -8;
YAPIContext.NO_MORE_DATA = -9;
YAPIContext.EXHAUSTED = -10;
YAPIContext.DOUBLE_ACCES = -11;
YAPIContext.UNAUTHORIZED = -12;
YAPIContext.RTC_NOT_READY = -13;
YAPIContext.FILE_NOT_FOUND = -14;
YAPIContext.SSL_ERROR = -15;
var YAPI = new YAPIContext();

// obj/rdonly/Api/yocto_api_html.js
var __awaiter2 = function(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
var YSystemEnvHtml = class extends YSystemEnv {
  constructor() {
    super(...arguments);
    this.isNodeJS = false;
    this.hasSSDP = false;
  }
  hookUnhandledRejection(handler) {
    window.addEventListener("onunhandledrejection", (event) => {
      let promiseRejectionEvent = event;
      handler(promiseRejectionEvent.reason, promiseRejectionEvent.promise);
    });
  }
  getWebSocketHub(obj_yapi, urlInfo) {
    return new YWebSocketHtmlHub(obj_yapi, urlInfo);
  }
  getHttpHub(obj_yapi, urlInfo) {
    return new YHttpHtmlHub(obj_yapi, urlInfo);
  }
  getWebSocketCallbackHub(obj_yapi, urlInfo, ws) {
    return obj_yapi._throw(YAPI.NOT_SUPPORTED, "WebSocket Callback mode is not available in this environment", null);
  }
  getHttpCallbackHub(obj_yapi, urlInfo, incomingMessage, serverResponse) {
    return obj_yapi._throw(YAPI.NOT_SUPPORTED, "HTTP Callback mode is not available in this environment", null);
  }
  getSSDPManager(obj_yapi) {
    return obj_yapi._throw(YAPI.NOT_SUPPORTED, "Hub discovery is not available in this environment", null);
  }
  loadfile(file) {
    return new Promise((resolve, reject) => {
      let reader = new FileReader();
      reader.onerror = function(evt) {
        reject(evt.target.error);
      };
      reader.onload = function(evt) {
        resolve(new Uint8Array(evt.target.result));
      };
      reader.readAsArrayBuffer(file);
    });
  }
  downloadfile(url) {
    return new Promise((resolve, reject) => {
      let httpRequest = new XMLHttpRequest();
      httpRequest.open("GET", url, true);
      httpRequest.overrideMimeType("text/plain; charset=x-user-defined");
      httpRequest.onreadystatechange = () => {
        if (httpRequest.readyState == 4) {
          if (httpRequest.status != 200 && httpRequest.status != 304) {
            if (httpRequest.status) {
              reject(new Error("HTTP error " + httpRequest.status));
            } else {
              reject(new Error("Unable to complete HTTP request, network down?"));
            }
          } else {
            resolve(YAPI.imm_str2bin(httpRequest.responseText));
          }
        }
      };
      httpRequest.send("");
    });
  }
};
var _HtmlSystemEnv = new YSystemEnvHtml();
YAPI.imm_setSystemEnv(_HtmlSystemEnv);
var YHttpHtmlHub = class extends YGenericHub {
  constructor(yapi, urlInfo) {
    super(yapi, urlInfo);
    this.notbynRequest = null;
    this.notbynOpenPromise = null;
    this.notbynOpenTimeoutObj = null;
    this.infoJson = null;
    this.realm = "";
    this.nonce = "";
    this.nonceCount = 0;
  }
  imm_sendXHR(xmlHttpRequest, method, uri, obj_body, readyStateChangeHandler, errorHandler) {
    let body = "";
    if (this.infoJson && this.infoJson.realm && this.infoJson.nonce) {
      if (this.realm != this.infoJson.realm || this.nonce != this.infoJson.nonce) {
        this.realm = this.infoJson.realm;
        this.nonce = this.infoJson.nonce;
        this.nonceCount = 0;
      }
      let shorturi = uri;
      let parseURI = uri.match(/([A-Za-z]+:\/\/)([^\/@]+@)?([^\/]+)(\/.*)/);
      if (parseURI) {
        uri = parseURI[1] + parseURI[3] + parseURI[4];
        shorturi = parseURI[4];
      }
      let jsonBody = {
        "x-yauth": {
          method,
          uri: shorturi
        }
      };
      if (this.urlInfo.user || this.urlInfo.pass) {
        let cnonce = Math.floor(Math.random() * 2147483647).toString(16).toLowerCase();
        let nc = (++this.nonceCount).toString(16).toLowerCase();
        let ha1_str = this.urlInfo.user + ":" + this.realm + ":" + this.urlInfo.pass;
        let ha2_str = method + ":" + shorturi;
        let A1 = this._yapi.imm_bin2hexstr(this._yapi.imm_yMD5(ha1_str)).toLowerCase();
        let A2 = this._yapi.imm_bin2hexstr(this._yapi.imm_ySHA1(ha2_str)).toLowerCase();
        let signature = A1 + ":" + this.nonce + ":" + nc + ":" + cnonce + ":auth:" + A2;
        let response = this._yapi.imm_bin2hexstr(this._yapi.imm_ySHA1(signature)).toLowerCase();
        jsonBody["x-yauth"]["username"] = this.urlInfo.user;
        jsonBody["x-yauth"]["cnonce"] = cnonce;
        jsonBody["x-yauth"]["nonce"] = this.nonce;
        jsonBody["x-yauth"]["nc"] = nc;
        jsonBody["x-yauth"]["qop"] = "auth";
        jsonBody["x-yauth"]["response"] = response;
      }
      if (obj_body) {
        let binstr = this._yapi.imm_bin2str(obj_body.data);
        jsonBody["body"] = {
          filename: obj_body.fname,
          b64content: btoa(binstr)
        };
      }
      body = JSON.stringify(jsonBody);
      let qpos = uri.indexOf("?");
      if (qpos > 0) {
        uri = uri.slice(0, qpos);
      }
      xmlHttpRequest.open("POST", uri, true, "", "");
      xmlHttpRequest.setRequestHeader("Content-Type", "text/plain; charset=x-user-defined");
    } else {
      if (obj_body) {
        let blob = new Blob([obj_body.data], {type: "application/octet-binary"});
        body = new FormData();
        body.append(obj_body.fname, blob);
      }
      xmlHttpRequest.open(method, uri, true, "", "");
    }
    xmlHttpRequest.overrideMimeType("text/plain; charset=x-user-defined");
    xmlHttpRequest.onreadystatechange = readyStateChangeHandler;
    xmlHttpRequest.onerror = errorHandler;
    xmlHttpRequest.send(body);
  }
  testHub(mstimeout, errmsg) {
    return __awaiter2(this, void 0, void 0, function* () {
      if (this.disconnecting) {
        if (errmsg) {
          errmsg.msg = "I/O error";
        }
        return YAPI.IO_ERROR;
      }
      if (!this.infoJson) {
        if (!(yield new Promise((resolve, reject) => {
          let xhr = new XMLHttpRequest();
          this.imm_sendXHR(xhr, "GET", this.urlInfo.url + "info.json", null, () => {
            if (xhr.readyState == 4) {
              if (xhr.status == 200) {
                this.infoJson = JSON.parse(xhr.responseText);
                resolve(true);
              }
              resolve(false);
            }
          }, () => {
            resolve(false);
          });
        }))) {
          this.infoJson = {};
        }
        if (this.infoJson.serialNumber) {
          let knownHubs = this._yapi._hubs;
          for (let i = 0; i < knownHubs.length; i++) {
            let hubSerials = knownHubs[i].serialByYdx;
            if (hubSerials && hubSerials[0] == this.infoJson.serialNumber) {
              if (errmsg) {
                errmsg.msg = "Hub " + this.infoJson.serialNumber + " is already registered";
              }
              return YAPI.INVALID_ARGUMENT;
            }
          }
        }
      }
      let args = "?len=" + this.notiflen.toString();
      if (this.notifPos >= 0) {
        args += "&abs=" + this.notifPos.toString();
      } else {
        this._firstArrivalCallback = true;
      }
      if (!this.notbynOpenPromise) {
        this.notbynOpenTimeout = mstimeout ? this._yapi.GetTickCount() + mstimeout : null;
        this.notbynOpenPromise = new Promise((resolve, reject) => {
          if (mstimeout) {
            this.notbynOpenTimeoutObj = setTimeout(() => {
              resolve({errorType: YAPI.TIMEOUT, errorMsg: "Timeout on HTTP connection"});
              this.disconnect();
            }, mstimeout);
          }
          this.notbynTryOpen = () => {
            let xmlHttpRequest = new XMLHttpRequest();
            this.notbynRequest = xmlHttpRequest;
            this.imm_sendXHR(xmlHttpRequest, "GET", this.urlInfo.url + "not.byn" + args, null, () => {
              if (this.disconnecting) {
                return;
              }
              if (xmlHttpRequest.readyState >= 3) {
                let httpStatus = xmlHttpRequest.status >> 0;
                if (xmlHttpRequest.readyState == 4 && httpStatus != 200 && httpStatus != 304) {
                  if (httpStatus == 401 || httpStatus == 204) {
                    resolve({errorType: YAPI.UNAUTHORIZED, errorMsg: "Unauthorized access"});
                    return;
                  }
                  if (!this.imm_testHubAgainLater()) {
                    resolve({errorType: YAPI.IO_ERROR, errorMsg: "I/O error"});
                    return;
                  }
                } else {
                  if (!this._hubAdded) {
                    if (this.notbynOpenTimeoutObj) {
                      clearTimeout(this.notbynOpenTimeoutObj);
                      this.notbynOpenTimeoutObj = null;
                    }
                    this.signalHubConnected().then(() => {
                      resolve({errorType: YAPI_SUCCESS, errorMsg: ""});
                    });
                  }
                  if (xmlHttpRequest.readyState == 3) {
                    if (this.notiflen == 1)
                      return;
                  }
                  let newlen = xmlHttpRequest.responseText.length;
                  if (newlen > this.currPos) {
                    this._yapi.parseEvents(this, xmlHttpRequest.responseText.slice(this.currPos, newlen));
                  }
                  if (xmlHttpRequest.readyState == 4 && xmlHttpRequest.status >> 0 != 0) {
                    this.notbynOpenPromise = null;
                    this.currPos = 0;
                    this.testHub(0, errmsg);
                  }
                }
              }
            }, () => {
              if (!this.imm_testHubAgainLater()) {
                resolve({errorType: YAPI.IO_ERROR, errorMsg: "I/O error"});
              }
            });
          };
          this.notbynTryOpen();
        });
      }
      let res_struct = yield this.notbynOpenPromise;
      if (errmsg) {
        errmsg.msg = res_struct.errorMsg;
      }
      this.notbynOpenPromise = null;
      return res_struct.errorType;
    });
  }
  request(method, devUrl, obj_body, tcpchan) {
    return __awaiter2(this, void 0, void 0, function* () {
      return new Promise((resolve, reject) => {
        let prefix = this.urlInfo.url.slice(0, -1);
        let httpRequest = new XMLHttpRequest();
        this.imm_sendXHR(httpRequest, method, prefix + devUrl, obj_body, () => {
          if (httpRequest.readyState == 4) {
            let httpStatus = httpRequest.status;
            let yreq = new YHTTPRequest(null);
            if (httpStatus != 200 && httpStatus != 304) {
              yreq.errorType = httpStatus == 401 || httpStatus == 204 ? YAPI.UNAUTHORIZED : YAPI.NOT_SUPPORTED;
              yreq.errorMsg = "HTTP Error " + httpRequest.status + " on " + prefix + devUrl;
            } else {
              yreq.bin_result = this._yapi.imm_str2bin(httpRequest.responseText);
            }
            resolve(yreq);
          }
        }, () => {
          let yreq = new YHTTPRequest(null);
          yreq.errorType = YAPI.IO_ERROR;
          yreq.errorMsg = "I/O Error on " + prefix + devUrl;
          resolve(yreq);
        });
      });
    });
  }
  disconnect() {
    return __awaiter2(this, void 0, void 0, function* () {
      this.imm_commonDisconnect();
      if (this.notbynRequest) {
        this.notbynRequest.abort();
      }
    });
  }
};
var YWebSocketHtmlHub = class extends YWebSocketHub {
  imm_webSocketOpen(str_url) {
    let websock = new WebSocket(str_url);
    websock.binaryType = "arraybuffer";
    this.websocket = websock;
  }
  imm_getRandomValues(arr) {
    return window.crypto.getRandomValues(arr);
  }
};

// obj/rdonly/Api/yocto_network.js
var __awaiter3 = function(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
var YNetwork = class extends YFunction {
  constructor(yapi, func) {
    super(yapi, func);
    this._readiness = YNetwork.READINESS_INVALID;
    this._macAddress = YNetwork.MACADDRESS_INVALID;
    this._ipAddress = YNetwork.IPADDRESS_INVALID;
    this._subnetMask = YNetwork.SUBNETMASK_INVALID;
    this._router = YNetwork.ROUTER_INVALID;
    this._currentDNS = YNetwork.CURRENTDNS_INVALID;
    this._ipConfig = YNetwork.IPCONFIG_INVALID;
    this._primaryDNS = YNetwork.PRIMARYDNS_INVALID;
    this._secondaryDNS = YNetwork.SECONDARYDNS_INVALID;
    this._ntpServer = YNetwork.NTPSERVER_INVALID;
    this._userPassword = YNetwork.USERPASSWORD_INVALID;
    this._adminPassword = YNetwork.ADMINPASSWORD_INVALID;
    this._httpPort = YNetwork.HTTPPORT_INVALID;
    this._defaultPage = YNetwork.DEFAULTPAGE_INVALID;
    this._discoverable = YNetwork.DISCOVERABLE_INVALID;
    this._wwwWatchdogDelay = YNetwork.WWWWATCHDOGDELAY_INVALID;
    this._callbackUrl = YNetwork.CALLBACKURL_INVALID;
    this._callbackMethod = YNetwork.CALLBACKMETHOD_INVALID;
    this._callbackEncoding = YNetwork.CALLBACKENCODING_INVALID;
    this._callbackCredentials = YNetwork.CALLBACKCREDENTIALS_INVALID;
    this._callbackInitialDelay = YNetwork.CALLBACKINITIALDELAY_INVALID;
    this._callbackSchedule = YNetwork.CALLBACKSCHEDULE_INVALID;
    this._callbackMinDelay = YNetwork.CALLBACKMINDELAY_INVALID;
    this._callbackMaxDelay = YNetwork.CALLBACKMAXDELAY_INVALID;
    this._poeCurrent = YNetwork.POECURRENT_INVALID;
    this._valueCallbackNetwork = null;
    this.READINESS_DOWN = 0;
    this.READINESS_EXISTS = 1;
    this.READINESS_LINKED = 2;
    this.READINESS_LAN_OK = 3;
    this.READINESS_WWW_OK = 4;
    this.READINESS_INVALID = -1;
    this.MACADDRESS_INVALID = YAPI.INVALID_STRING;
    this.IPADDRESS_INVALID = YAPI.INVALID_STRING;
    this.SUBNETMASK_INVALID = YAPI.INVALID_STRING;
    this.ROUTER_INVALID = YAPI.INVALID_STRING;
    this.CURRENTDNS_INVALID = YAPI.INVALID_STRING;
    this.IPCONFIG_INVALID = YAPI.INVALID_STRING;
    this.PRIMARYDNS_INVALID = YAPI.INVALID_STRING;
    this.SECONDARYDNS_INVALID = YAPI.INVALID_STRING;
    this.NTPSERVER_INVALID = YAPI.INVALID_STRING;
    this.USERPASSWORD_INVALID = YAPI.INVALID_STRING;
    this.ADMINPASSWORD_INVALID = YAPI.INVALID_STRING;
    this.HTTPPORT_INVALID = YAPI.INVALID_UINT;
    this.DEFAULTPAGE_INVALID = YAPI.INVALID_STRING;
    this.DISCOVERABLE_FALSE = 0;
    this.DISCOVERABLE_TRUE = 1;
    this.DISCOVERABLE_INVALID = -1;
    this.WWWWATCHDOGDELAY_INVALID = YAPI.INVALID_UINT;
    this.CALLBACKURL_INVALID = YAPI.INVALID_STRING;
    this.CALLBACKMETHOD_POST = 0;
    this.CALLBACKMETHOD_GET = 1;
    this.CALLBACKMETHOD_PUT = 2;
    this.CALLBACKMETHOD_INVALID = -1;
    this.CALLBACKENCODING_FORM = 0;
    this.CALLBACKENCODING_JSON = 1;
    this.CALLBACKENCODING_JSON_ARRAY = 2;
    this.CALLBACKENCODING_CSV = 3;
    this.CALLBACKENCODING_YOCTO_API = 4;
    this.CALLBACKENCODING_JSON_NUM = 5;
    this.CALLBACKENCODING_EMONCMS = 6;
    this.CALLBACKENCODING_AZURE = 7;
    this.CALLBACKENCODING_INFLUXDB = 8;
    this.CALLBACKENCODING_MQTT = 9;
    this.CALLBACKENCODING_YOCTO_API_JZON = 10;
    this.CALLBACKENCODING_PRTG = 11;
    this.CALLBACKENCODING_INFLUXDB_V2 = 12;
    this.CALLBACKENCODING_INVALID = -1;
    this.CALLBACKCREDENTIALS_INVALID = YAPI.INVALID_STRING;
    this.CALLBACKINITIALDELAY_INVALID = YAPI.INVALID_UINT;
    this.CALLBACKSCHEDULE_INVALID = YAPI.INVALID_STRING;
    this.CALLBACKMINDELAY_INVALID = YAPI.INVALID_UINT;
    this.CALLBACKMAXDELAY_INVALID = YAPI.INVALID_UINT;
    this.POECURRENT_INVALID = YAPI.INVALID_UINT;
    this._className = "Network";
  }
  imm_parseAttr(name, val) {
    switch (name) {
      case "readiness":
        this._readiness = val;
        return 1;
      case "macAddress":
        this._macAddress = val;
        return 1;
      case "ipAddress":
        this._ipAddress = val;
        return 1;
      case "subnetMask":
        this._subnetMask = val;
        return 1;
      case "router":
        this._router = val;
        return 1;
      case "currentDNS":
        this._currentDNS = val;
        return 1;
      case "ipConfig":
        this._ipConfig = val;
        return 1;
      case "primaryDNS":
        this._primaryDNS = val;
        return 1;
      case "secondaryDNS":
        this._secondaryDNS = val;
        return 1;
      case "ntpServer":
        this._ntpServer = val;
        return 1;
      case "userPassword":
        this._userPassword = val;
        return 1;
      case "adminPassword":
        this._adminPassword = val;
        return 1;
      case "httpPort":
        this._httpPort = val;
        return 1;
      case "defaultPage":
        this._defaultPage = val;
        return 1;
      case "discoverable":
        this._discoverable = val;
        return 1;
      case "wwwWatchdogDelay":
        this._wwwWatchdogDelay = val;
        return 1;
      case "callbackUrl":
        this._callbackUrl = val;
        return 1;
      case "callbackMethod":
        this._callbackMethod = val;
        return 1;
      case "callbackEncoding":
        this._callbackEncoding = val;
        return 1;
      case "callbackCredentials":
        this._callbackCredentials = val;
        return 1;
      case "callbackInitialDelay":
        this._callbackInitialDelay = val;
        return 1;
      case "callbackSchedule":
        this._callbackSchedule = val;
        return 1;
      case "callbackMinDelay":
        this._callbackMinDelay = val;
        return 1;
      case "callbackMaxDelay":
        this._callbackMaxDelay = val;
        return 1;
      case "poeCurrent":
        this._poeCurrent = val;
        return 1;
    }
    return super.imm_parseAttr(name, val);
  }
  get_readiness() {
    return __awaiter3(this, void 0, void 0, function* () {
      let res;
      if (this._cacheExpiration <= this._yapi.GetTickCount()) {
        if ((yield this.load(this._yapi.defaultCacheValidity)) != this._yapi.SUCCESS) {
          return YNetwork.READINESS_INVALID;
        }
      }
      res = this._readiness;
      return res;
    });
  }
  get_macAddress() {
    return __awaiter3(this, void 0, void 0, function* () {
      let res;
      if (this._cacheExpiration == 0) {
        if ((yield this.load(this._yapi.defaultCacheValidity)) != this._yapi.SUCCESS) {
          return YNetwork.MACADDRESS_INVALID;
        }
      }
      res = this._macAddress;
      return res;
    });
  }
  get_ipAddress() {
    return __awaiter3(this, void 0, void 0, function* () {
      let res;
      if (this._cacheExpiration <= this._yapi.GetTickCount()) {
        if ((yield this.load(this._yapi.defaultCacheValidity)) != this._yapi.SUCCESS) {
          return YNetwork.IPADDRESS_INVALID;
        }
      }
      res = this._ipAddress;
      return res;
    });
  }
  get_subnetMask() {
    return __awaiter3(this, void 0, void 0, function* () {
      let res;
      if (this._cacheExpiration <= this._yapi.GetTickCount()) {
        if ((yield this.load(this._yapi.defaultCacheValidity)) != this._yapi.SUCCESS) {
          return YNetwork.SUBNETMASK_INVALID;
        }
      }
      res = this._subnetMask;
      return res;
    });
  }
  get_router() {
    return __awaiter3(this, void 0, void 0, function* () {
      let res;
      if (this._cacheExpiration <= this._yapi.GetTickCount()) {
        if ((yield this.load(this._yapi.defaultCacheValidity)) != this._yapi.SUCCESS) {
          return YNetwork.ROUTER_INVALID;
        }
      }
      res = this._router;
      return res;
    });
  }
  get_currentDNS() {
    return __awaiter3(this, void 0, void 0, function* () {
      let res;
      if (this._cacheExpiration <= this._yapi.GetTickCount()) {
        if ((yield this.load(this._yapi.defaultCacheValidity)) != this._yapi.SUCCESS) {
          return YNetwork.CURRENTDNS_INVALID;
        }
      }
      res = this._currentDNS;
      return res;
    });
  }
  get_ipConfig() {
    return __awaiter3(this, void 0, void 0, function* () {
      let res;
      if (this._cacheExpiration <= this._yapi.GetTickCount()) {
        if ((yield this.load(this._yapi.defaultCacheValidity)) != this._yapi.SUCCESS) {
          return YNetwork.IPCONFIG_INVALID;
        }
      }
      res = this._ipConfig;
      return res;
    });
  }
  set_ipConfig(newval) {
    return __awaiter3(this, void 0, void 0, function* () {
      let rest_val;
      rest_val = String(newval);
      return yield this._setAttr("ipConfig", rest_val);
    });
  }
  get_primaryDNS() {
    return __awaiter3(this, void 0, void 0, function* () {
      let res;
      if (this._cacheExpiration <= this._yapi.GetTickCount()) {
        if ((yield this.load(this._yapi.defaultCacheValidity)) != this._yapi.SUCCESS) {
          return YNetwork.PRIMARYDNS_INVALID;
        }
      }
      res = this._primaryDNS;
      return res;
    });
  }
  set_primaryDNS(newval) {
    return __awaiter3(this, void 0, void 0, function* () {
      let rest_val;
      rest_val = String(newval);
      return yield this._setAttr("primaryDNS", rest_val);
    });
  }
  get_secondaryDNS() {
    return __awaiter3(this, void 0, void 0, function* () {
      let res;
      if (this._cacheExpiration <= this._yapi.GetTickCount()) {
        if ((yield this.load(this._yapi.defaultCacheValidity)) != this._yapi.SUCCESS) {
          return YNetwork.SECONDARYDNS_INVALID;
        }
      }
      res = this._secondaryDNS;
      return res;
    });
  }
  set_secondaryDNS(newval) {
    return __awaiter3(this, void 0, void 0, function* () {
      let rest_val;
      rest_val = String(newval);
      return yield this._setAttr("secondaryDNS", rest_val);
    });
  }
  get_ntpServer() {
    return __awaiter3(this, void 0, void 0, function* () {
      let res;
      if (this._cacheExpiration <= this._yapi.GetTickCount()) {
        if ((yield this.load(this._yapi.defaultCacheValidity)) != this._yapi.SUCCESS) {
          return YNetwork.NTPSERVER_INVALID;
        }
      }
      res = this._ntpServer;
      return res;
    });
  }
  set_ntpServer(newval) {
    return __awaiter3(this, void 0, void 0, function* () {
      let rest_val;
      rest_val = String(newval);
      return yield this._setAttr("ntpServer", rest_val);
    });
  }
  get_userPassword() {
    return __awaiter3(this, void 0, void 0, function* () {
      let res;
      if (this._cacheExpiration <= this._yapi.GetTickCount()) {
        if ((yield this.load(this._yapi.defaultCacheValidity)) != this._yapi.SUCCESS) {
          return YNetwork.USERPASSWORD_INVALID;
        }
      }
      res = this._userPassword;
      return res;
    });
  }
  set_userPassword(newval) {
    return __awaiter3(this, void 0, void 0, function* () {
      let rest_val;
      if (newval.length > YAPI.HASH_BUF_SIZE) {
        return this._throw(YAPI.INVALID_ARGUMENT, "Password too long :" + newval, YAPI.INVALID_ARGUMENT);
      }
      rest_val = String(newval);
      return yield this._setAttr("userPassword", rest_val);
    });
  }
  get_adminPassword() {
    return __awaiter3(this, void 0, void 0, function* () {
      let res;
      if (this._cacheExpiration <= this._yapi.GetTickCount()) {
        if ((yield this.load(this._yapi.defaultCacheValidity)) != this._yapi.SUCCESS) {
          return YNetwork.ADMINPASSWORD_INVALID;
        }
      }
      res = this._adminPassword;
      return res;
    });
  }
  set_adminPassword(newval) {
    return __awaiter3(this, void 0, void 0, function* () {
      let rest_val;
      if (newval.length > YAPI.HASH_BUF_SIZE) {
        return this._throw(YAPI.INVALID_ARGUMENT, "Password too long :" + newval, YAPI.INVALID_ARGUMENT);
      }
      rest_val = String(newval);
      return yield this._setAttr("adminPassword", rest_val);
    });
  }
  get_httpPort() {
    return __awaiter3(this, void 0, void 0, function* () {
      let res;
      if (this._cacheExpiration <= this._yapi.GetTickCount()) {
        if ((yield this.load(this._yapi.defaultCacheValidity)) != this._yapi.SUCCESS) {
          return YNetwork.HTTPPORT_INVALID;
        }
      }
      res = this._httpPort;
      return res;
    });
  }
  set_httpPort(newval) {
    return __awaiter3(this, void 0, void 0, function* () {
      let rest_val;
      rest_val = String(newval);
      return yield this._setAttr("httpPort", rest_val);
    });
  }
  get_defaultPage() {
    return __awaiter3(this, void 0, void 0, function* () {
      let res;
      if (this._cacheExpiration <= this._yapi.GetTickCount()) {
        if ((yield this.load(this._yapi.defaultCacheValidity)) != this._yapi.SUCCESS) {
          return YNetwork.DEFAULTPAGE_INVALID;
        }
      }
      res = this._defaultPage;
      return res;
    });
  }
  set_defaultPage(newval) {
    return __awaiter3(this, void 0, void 0, function* () {
      let rest_val;
      rest_val = String(newval);
      return yield this._setAttr("defaultPage", rest_val);
    });
  }
  get_discoverable() {
    return __awaiter3(this, void 0, void 0, function* () {
      let res;
      if (this._cacheExpiration <= this._yapi.GetTickCount()) {
        if ((yield this.load(this._yapi.defaultCacheValidity)) != this._yapi.SUCCESS) {
          return YNetwork.DISCOVERABLE_INVALID;
        }
      }
      res = this._discoverable;
      return res;
    });
  }
  set_discoverable(newval) {
    return __awaiter3(this, void 0, void 0, function* () {
      let rest_val;
      rest_val = String(newval);
      return yield this._setAttr("discoverable", rest_val);
    });
  }
  get_wwwWatchdogDelay() {
    return __awaiter3(this, void 0, void 0, function* () {
      let res;
      if (this._cacheExpiration <= this._yapi.GetTickCount()) {
        if ((yield this.load(this._yapi.defaultCacheValidity)) != this._yapi.SUCCESS) {
          return YNetwork.WWWWATCHDOGDELAY_INVALID;
        }
      }
      res = this._wwwWatchdogDelay;
      return res;
    });
  }
  set_wwwWatchdogDelay(newval) {
    return __awaiter3(this, void 0, void 0, function* () {
      let rest_val;
      rest_val = String(newval);
      return yield this._setAttr("wwwWatchdogDelay", rest_val);
    });
  }
  get_callbackUrl() {
    return __awaiter3(this, void 0, void 0, function* () {
      let res;
      if (this._cacheExpiration <= this._yapi.GetTickCount()) {
        if ((yield this.load(this._yapi.defaultCacheValidity)) != this._yapi.SUCCESS) {
          return YNetwork.CALLBACKURL_INVALID;
        }
      }
      res = this._callbackUrl;
      return res;
    });
  }
  set_callbackUrl(newval) {
    return __awaiter3(this, void 0, void 0, function* () {
      let rest_val;
      rest_val = String(newval);
      return yield this._setAttr("callbackUrl", rest_val);
    });
  }
  get_callbackMethod() {
    return __awaiter3(this, void 0, void 0, function* () {
      let res;
      if (this._cacheExpiration <= this._yapi.GetTickCount()) {
        if ((yield this.load(this._yapi.defaultCacheValidity)) != this._yapi.SUCCESS) {
          return YNetwork.CALLBACKMETHOD_INVALID;
        }
      }
      res = this._callbackMethod;
      return res;
    });
  }
  set_callbackMethod(newval) {
    return __awaiter3(this, void 0, void 0, function* () {
      let rest_val;
      rest_val = String(newval);
      return yield this._setAttr("callbackMethod", rest_val);
    });
  }
  get_callbackEncoding() {
    return __awaiter3(this, void 0, void 0, function* () {
      let res;
      if (this._cacheExpiration <= this._yapi.GetTickCount()) {
        if ((yield this.load(this._yapi.defaultCacheValidity)) != this._yapi.SUCCESS) {
          return YNetwork.CALLBACKENCODING_INVALID;
        }
      }
      res = this._callbackEncoding;
      return res;
    });
  }
  set_callbackEncoding(newval) {
    return __awaiter3(this, void 0, void 0, function* () {
      let rest_val;
      rest_val = String(newval);
      return yield this._setAttr("callbackEncoding", rest_val);
    });
  }
  get_callbackCredentials() {
    return __awaiter3(this, void 0, void 0, function* () {
      let res;
      if (this._cacheExpiration <= this._yapi.GetTickCount()) {
        if ((yield this.load(this._yapi.defaultCacheValidity)) != this._yapi.SUCCESS) {
          return YNetwork.CALLBACKCREDENTIALS_INVALID;
        }
      }
      res = this._callbackCredentials;
      return res;
    });
  }
  set_callbackCredentials(newval) {
    return __awaiter3(this, void 0, void 0, function* () {
      let rest_val;
      rest_val = String(newval);
      return yield this._setAttr("callbackCredentials", rest_val);
    });
  }
  callbackLogin(username, password) {
    return __awaiter3(this, void 0, void 0, function* () {
      let rest_val;
      rest_val = username + ":" + password;
      return yield this._setAttr("callbackCredentials", rest_val);
    });
  }
  get_callbackInitialDelay() {
    return __awaiter3(this, void 0, void 0, function* () {
      let res;
      if (this._cacheExpiration <= this._yapi.GetTickCount()) {
        if ((yield this.load(this._yapi.defaultCacheValidity)) != this._yapi.SUCCESS) {
          return YNetwork.CALLBACKINITIALDELAY_INVALID;
        }
      }
      res = this._callbackInitialDelay;
      return res;
    });
  }
  set_callbackInitialDelay(newval) {
    return __awaiter3(this, void 0, void 0, function* () {
      let rest_val;
      rest_val = String(newval);
      return yield this._setAttr("callbackInitialDelay", rest_val);
    });
  }
  get_callbackSchedule() {
    return __awaiter3(this, void 0, void 0, function* () {
      let res;
      if (this._cacheExpiration <= this._yapi.GetTickCount()) {
        if ((yield this.load(this._yapi.defaultCacheValidity)) != this._yapi.SUCCESS) {
          return YNetwork.CALLBACKSCHEDULE_INVALID;
        }
      }
      res = this._callbackSchedule;
      return res;
    });
  }
  set_callbackSchedule(newval) {
    return __awaiter3(this, void 0, void 0, function* () {
      let rest_val;
      rest_val = String(newval);
      return yield this._setAttr("callbackSchedule", rest_val);
    });
  }
  get_callbackMinDelay() {
    return __awaiter3(this, void 0, void 0, function* () {
      let res;
      if (this._cacheExpiration <= this._yapi.GetTickCount()) {
        if ((yield this.load(this._yapi.defaultCacheValidity)) != this._yapi.SUCCESS) {
          return YNetwork.CALLBACKMINDELAY_INVALID;
        }
      }
      res = this._callbackMinDelay;
      return res;
    });
  }
  set_callbackMinDelay(newval) {
    return __awaiter3(this, void 0, void 0, function* () {
      let rest_val;
      rest_val = String(newval);
      return yield this._setAttr("callbackMinDelay", rest_val);
    });
  }
  get_callbackMaxDelay() {
    return __awaiter3(this, void 0, void 0, function* () {
      let res;
      if (this._cacheExpiration <= this._yapi.GetTickCount()) {
        if ((yield this.load(this._yapi.defaultCacheValidity)) != this._yapi.SUCCESS) {
          return YNetwork.CALLBACKMAXDELAY_INVALID;
        }
      }
      res = this._callbackMaxDelay;
      return res;
    });
  }
  set_callbackMaxDelay(newval) {
    return __awaiter3(this, void 0, void 0, function* () {
      let rest_val;
      rest_val = String(newval);
      return yield this._setAttr("callbackMaxDelay", rest_val);
    });
  }
  get_poeCurrent() {
    return __awaiter3(this, void 0, void 0, function* () {
      let res;
      if (this._cacheExpiration <= this._yapi.GetTickCount()) {
        if ((yield this.load(this._yapi.defaultCacheValidity)) != this._yapi.SUCCESS) {
          return YNetwork.POECURRENT_INVALID;
        }
      }
      res = this._poeCurrent;
      return res;
    });
  }
  static FindNetwork(func) {
    let obj;
    obj = YFunction._FindFromCache("Network", func);
    if (obj == null) {
      obj = new YNetwork(YAPI, func);
      YFunction._AddToCache("Network", func, obj);
    }
    return obj;
  }
  static FindNetworkInContext(yctx, func) {
    let obj;
    obj = YFunction._FindFromCacheInContext(yctx, "Network", func);
    if (obj == null) {
      obj = new YNetwork(yctx, func);
      YFunction._AddToCache("Network", func, obj);
    }
    return obj;
  }
  registerValueCallback(callback) {
    return __awaiter3(this, void 0, void 0, function* () {
      let val;
      if (callback != null) {
        yield YFunction._UpdateValueCallbackList(this, true);
      } else {
        yield YFunction._UpdateValueCallbackList(this, false);
      }
      this._valueCallbackNetwork = callback;
      if (callback != null && (yield this.isOnline())) {
        val = this._advertisedValue;
        if (!(val == "")) {
          yield this._invokeValueCallback(val);
        }
      }
      return 0;
    });
  }
  _invokeValueCallback(value) {
    const _super = Object.create(null, {
      _invokeValueCallback: {get: () => super._invokeValueCallback}
    });
    return __awaiter3(this, void 0, void 0, function* () {
      if (this._valueCallbackNetwork != null) {
        try {
          yield this._valueCallbackNetwork(this, value);
        } catch (e) {
          this._yapi.imm_log("Exception in valueCallback:", e);
        }
      } else {
        _super._invokeValueCallback.call(this, value);
      }
      return 0;
    });
  }
  useDHCP(fallbackIpAddr, fallbackSubnetMaskLen, fallbackRouter) {
    return __awaiter3(this, void 0, void 0, function* () {
      return yield this.set_ipConfig("DHCP:" + fallbackIpAddr + "/" + String(Math.round(fallbackSubnetMaskLen)) + "/" + fallbackRouter);
    });
  }
  useDHCPauto() {
    return __awaiter3(this, void 0, void 0, function* () {
      return yield this.set_ipConfig("DHCP:");
    });
  }
  useStaticIP(ipAddress, subnetMaskLen, router) {
    return __awaiter3(this, void 0, void 0, function* () {
      return yield this.set_ipConfig("STATIC:" + ipAddress + "/" + String(Math.round(subnetMaskLen)) + "/" + router);
    });
  }
  ping(host) {
    return __awaiter3(this, void 0, void 0, function* () {
      let content;
      content = yield this._download("ping.txt?host=" + host);
      return this._yapi.imm_bin2str(content);
    });
  }
  triggerCallback() {
    return __awaiter3(this, void 0, void 0, function* () {
      return yield this.set_callbackMethod(yield this.get_callbackMethod());
    });
  }
  set_periodicCallbackSchedule(interval, offset) {
    return __awaiter3(this, void 0, void 0, function* () {
      return yield this.set_callbackSchedule("every " + interval + "+" + String(Math.round(offset)));
    });
  }
  nextNetwork() {
    let resolve = this._yapi.imm_resolveFunction(this._className, this._func);
    if (resolve.errorType != YAPI.SUCCESS)
      return null;
    let next_hwid = this._yapi.imm_getNextHardwareId(this._className, resolve.result);
    if (next_hwid == null)
      return null;
    return YNetwork.FindNetworkInContext(this._yapi, next_hwid);
  }
  static FirstNetwork() {
    let next_hwid = YAPI.imm_getFirstHardwareId("Network");
    if (next_hwid == null)
      return null;
    return YNetwork.FindNetwork(next_hwid);
  }
  static FirstNetworkInContext(yctx) {
    let next_hwid = yctx.imm_getFirstHardwareId("Network");
    if (next_hwid == null)
      return null;
    return YNetwork.FindNetworkInContext(yctx, next_hwid);
  }
};
YNetwork.READINESS_DOWN = 0;
YNetwork.READINESS_EXISTS = 1;
YNetwork.READINESS_LINKED = 2;
YNetwork.READINESS_LAN_OK = 3;
YNetwork.READINESS_WWW_OK = 4;
YNetwork.READINESS_INVALID = -1;
YNetwork.MACADDRESS_INVALID = YAPI.INVALID_STRING;
YNetwork.IPADDRESS_INVALID = YAPI.INVALID_STRING;
YNetwork.SUBNETMASK_INVALID = YAPI.INVALID_STRING;
YNetwork.ROUTER_INVALID = YAPI.INVALID_STRING;
YNetwork.CURRENTDNS_INVALID = YAPI.INVALID_STRING;
YNetwork.IPCONFIG_INVALID = YAPI.INVALID_STRING;
YNetwork.PRIMARYDNS_INVALID = YAPI.INVALID_STRING;
YNetwork.SECONDARYDNS_INVALID = YAPI.INVALID_STRING;
YNetwork.NTPSERVER_INVALID = YAPI.INVALID_STRING;
YNetwork.USERPASSWORD_INVALID = YAPI.INVALID_STRING;
YNetwork.ADMINPASSWORD_INVALID = YAPI.INVALID_STRING;
YNetwork.HTTPPORT_INVALID = YAPI.INVALID_UINT;
YNetwork.DEFAULTPAGE_INVALID = YAPI.INVALID_STRING;
YNetwork.DISCOVERABLE_FALSE = 0;
YNetwork.DISCOVERABLE_TRUE = 1;
YNetwork.DISCOVERABLE_INVALID = -1;
YNetwork.WWWWATCHDOGDELAY_INVALID = YAPI.INVALID_UINT;
YNetwork.CALLBACKURL_INVALID = YAPI.INVALID_STRING;
YNetwork.CALLBACKMETHOD_POST = 0;
YNetwork.CALLBACKMETHOD_GET = 1;
YNetwork.CALLBACKMETHOD_PUT = 2;
YNetwork.CALLBACKMETHOD_INVALID = -1;
YNetwork.CALLBACKENCODING_FORM = 0;
YNetwork.CALLBACKENCODING_JSON = 1;
YNetwork.CALLBACKENCODING_JSON_ARRAY = 2;
YNetwork.CALLBACKENCODING_CSV = 3;
YNetwork.CALLBACKENCODING_YOCTO_API = 4;
YNetwork.CALLBACKENCODING_JSON_NUM = 5;
YNetwork.CALLBACKENCODING_EMONCMS = 6;
YNetwork.CALLBACKENCODING_AZURE = 7;
YNetwork.CALLBACKENCODING_INFLUXDB = 8;
YNetwork.CALLBACKENCODING_MQTT = 9;
YNetwork.CALLBACKENCODING_YOCTO_API_JZON = 10;
YNetwork.CALLBACKENCODING_PRTG = 11;
YNetwork.CALLBACKENCODING_INFLUXDB_V2 = 12;
YNetwork.CALLBACKENCODING_INVALID = -1;
YNetwork.CALLBACKCREDENTIALS_INVALID = YAPI.INVALID_STRING;
YNetwork.CALLBACKINITIALDELAY_INVALID = YAPI.INVALID_UINT;
YNetwork.CALLBACKSCHEDULE_INVALID = YAPI.INVALID_STRING;
YNetwork.CALLBACKMINDELAY_INVALID = YAPI.INVALID_UINT;
YNetwork.CALLBACKMAXDELAY_INVALID = YAPI.INVALID_UINT;
YNetwork.POECURRENT_INVALID = YAPI.INVALID_UINT;

// obj/rdonly/constants.js
var constants = class {
  static get buildVersion() {
    return "1.10.51983";
  }
  static get deviceScreenWidth() {
    return screen.width * window.devicePixelRatio;
  }
  static get deviceScreenHeight() {
    return screen.height * window.devicePixelRatio;
  }
  static get isPhoneOrTablet() {
    return constants.ScreenDPI > 96 && Math.max(constants.deviceScreenWidth, constants.deviceScreenHeight) / constants.ScreenDPI < 12;
  }
  static get captureSizePolicy() {
    return constants._defaultCaptureSizePolicy;
  }
  static set captureSizePolicy(value) {
    constants._defaultCaptureSizePolicy = value;
  }
  static get dbleClickBringsUpContextMenu() {
    return constants._defaulDbleClickBringsUpContextMenu;
  }
  static set dbleClickBringsUpContextMenu(value) {
    constants._defaulDbleClickBringsUpContextMenu = value;
  }
  static get maxPointsPerGraphSerie() {
    return constants._defaultMaxPointsPerGraphSerie;
  }
  static set maxPointsPerGraphSerie(value) {
    if (value >= 0)
      constants._defaultMaxPointsPerGraphSerie = value >> 0;
  }
  static get maxPointsPerDataloggerSerie() {
    return constants._defaultMaxPointsPerDataloggerSerie;
  }
  static set maxPointsPerDataloggerSerie(value) {
    if (value >= -1)
      constants._defaultMaxPointsPerDataloggerSerie = value >> 0;
  }
  static get maxDataRecordsPerSensor() {
    return constants._defaultMaxDataRecordsPerSensor;
  }
  static set maxDataRecordsPerSensor(value) {
    if (value >= 0)
      constants._defaultMaxDataRecordsPerSensor = value >> 0;
  }
  static get captureWidth() {
    return constants._defaultCaptureWidth;
  }
  static set captureWidth(value) {
    if (value > 0)
      constants._defaultCaptureWidth = value;
  }
  static get captureHeight() {
    return constants._defaultCaptureHeight;
  }
  static set captureHeight(value) {
    if (value > 0)
      constants._defaultCaptureHeight = value;
  }
  static get captureDPI() {
    return constants._defaultCaptureDPI;
  }
  static set captureDPI(value) {
    if (value > 0)
      constants._defaultCaptureDPI = value;
  }
  static get captureType() {
    return constants._defaultCaptureType;
  }
  static set captureType(value) {
    constants._defaultCaptureType = value;
  }
  static get generalFontFamily() {
    return constants.FontFamily;
  }
  static get generalFontSize() {
    return constants.FontSize;
  }
  static get generalSizeCoef() {
    return constants.FontSize / 12;
  }
  static get screenDPI() {
    return constants.ScreenDPI;
  }
  static get guiDPIFactor() {
    return constants.DPIfactor;
  }
  static get guiDPIFactorWasOverriden() {
    return constants.DPIfactorOverriden;
  }
  static get guiDPIFactorIsOverriden() {
    let vs = constants.getCookie(constants.DPIFactorKey);
    if (vs == null)
      return false;
    let v = parseFloat(vs);
    if (v > 0)
      return true;
    return false;
  }
  static get guiDPIFactorOverrideValue() {
    let vs = constants.getCookie(constants.DPIFactorKey);
    if (vs == null)
      return constants.DPIfactor;
    let v = parseFloat(vs);
    if (v > 0)
      return v;
    return constants.DPIfactor;
  }
  static overrideGuiDPIFactor(override, value) {
    if (override && typeof value !== "undefined") {
      constants.setCookie(constants.DPIFactorKey, value.toString(), 3650);
    } else {
      constants.setCookie(constants.DPIFactorKey, "none", 3650);
    }
  }
  static get RunningOnAndroid() {
    return constants.isAndroid;
  }
  static get WindowBackgroundColor() {
    return "#f0f0f0";
  }
  static get WindowBorder() {
    return "1px solid #808080";
  }
  static get WindowPadding() {
    return 2;
  }
  static get WindowInnerBorderColor() {
    return " #A0A0A0";
  }
  static get WindowInnerBackgroundColor() {
    return "#fAfAfA";
  }
  static get WindowInnerBorder() {
    return "1px solid " + constants.WindowInnerBorderColor;
  }
  static get WindowHeaderBackgroundColor() {
    return "#0072ca";
  }
  static get WindowHeaderColor() {
    return "white";
  }
  static get WindowHeaderBorder() {
    return "1px solid #0072ca";
  }
  static get WindowHeaderHeight() {
    return 20;
  }
  static get WindowHeaderFontSize() {
    return 8 * constants.FontSize / 6;
  }
  static get WindowHeaderFontFamily() {
    return constants.FontFamily;
  }
  static get mustCheckForUpdate() {
    return constants._checkForUpdate;
  }
  static set mustCheckForUpdate(value) {
  }
  static findDPI() {
    let DPI = 1;
    while (!matchMedia("(max-resolution: " + DPI.toString() + "dpi)").matches) {
      DPI = DPI << 1;
    }
    let a = DPI >> 1;
    let b = DPI;
    while (b - a > 1) {
      let pivot = b + a >> 1;
      if (matchMedia("(max-resolution: " + pivot.toString() + "dpi)").matches) {
        b = pivot;
      } else {
        a = pivot;
      }
    }
    return b * (constants.isAndroid ? window.devicePixelRatio : 1);
  }
  static InitCaptureParams(node) {
    let nodes = node.get_childsByName();
    for (let nodeName in nodes) {
      let node2 = nodes[nodeName];
      let value;
      switch (nodeName) {
        case "Target":
          if ("value" in node2.Attributes) {
            constants._captureTarget = YDataRenderer.CaptureTarget.fromString(YDataRenderer.CaptureTarget, node2.Attributes["value"]);
          }
          break;
        case "Type":
          if ("value" in node2.Attributes) {
            constants._defaultCaptureType = YDataRenderer.CaptureType.fromString(YDataRenderer.CaptureType, node2.Attributes["value"]);
          }
          break;
        case "Size":
          if ("value" in node2.Attributes) {
            constants._defaultCaptureSizePolicy = YDataRenderer.CaptureFormats.fromString(YDataRenderer.CaptureFormats, node2.Attributes["value"]);
          }
          break;
        case "Resolution":
          if ("value" in node2.Attributes) {
            constants.captureDPI = parseInt(node2.Attributes["value"]);
          }
          break;
        case "Width":
          if ("value" in node2.Attributes) {
            constants.captureWidth = value = parseInt(node2.Attributes["value"]);
          }
          break;
        case "Height":
          if ("value" in node2.Attributes) {
            constants.captureHeight = parseInt(node2.Attributes["value"]);
          }
          break;
        case "Folder":
          if ("value" in node2.Attributes) {
            constants._captureFolder = node2.Attributes["value"];
          }
          break;
      }
    }
  }
  static InitUIParams(node) {
    let nodes = node.get_childsByName();
    for (let nodeName in nodes) {
      let node2 = nodes[nodeName];
      switch (nodeName) {
        case "VerticalDragZoom":
          if ("value" in node2.Attributes) {
            YGraph.verticalDragZoomEnabled = node2.Attributes["value"].toUpperCase() == "TRUE";
          }
          break;
        case "DbleClickContextMenu":
          if ("value" in node2.Attributes) {
            constants.dbleClickBringsUpContextMenu = node2.Attributes["value"].toUpperCase() == "TRUE";
          }
          break;
      }
    }
  }
  static InitCheckForUpdateParams(node) {
    let nodes = node.get_childsByName();
    for (let nodeName in nodes) {
      let node2 = nodes[nodeName];
      switch (nodeName) {
        case "checkForUpdate":
          if ("value" in node2.Attributes) {
            constants._checkForUpdate = node2.Attributes["value"].toUpperCase() == "TRUE";
          }
          break;
        case "ignoreBuild":
          if ("value" in node2.Attributes) {
            constants._ignoreBuild = parseInt(node2.Attributes["value"].toUpperCase());
          }
          break;
      }
    }
  }
  static InitMemoryUsageParams(node) {
    let nodes = node.get_childsByName();
    for (let nodeName in nodes) {
      let node2 = nodes[nodeName];
      switch (nodeName) {
        case "maxPointsPerGraphSerie":
          if ("value" in node2.Attributes) {
            let value = parseInt(node2.Attributes["value"]);
            constants.maxPointsPerGraphSerie = value;
            DataSerie.MaxPointsPerSeries = value;
          }
          break;
        case "maxDataRecordsPerSensor":
          if ("value" in node2.Attributes) {
            let value = parseInt(node2.Attributes["value"]);
            if (value >= 0) {
              constants.maxDataRecordsPerSensor = value;
              CustomYSensor.MaxDataRecords = value;
            }
          }
          break;
        case "maxPointsPerDataloggerSerie":
          if ("value" in node2.Attributes) {
            let value = parseInt(node2.Attributes["value"]);
            constants.maxPointsPerDataloggerSerie = value;
            CustomYSensor.MaxLoggerRecords = value;
          }
          break;
        case "deviceListValidity":
          if ("value" in node2.Attributes) {
            let value = parseInt(node2.Attributes["value"]);
            if (value > 0) {
              constants._deviceListValidity = value;
              YAPI.SetDeviceListValidity(value).then();
            }
          }
          break;
      }
    }
  }
  static Init(initData) {
    let nodes = initData.get_childsByName();
    for (let nodeName in nodes) {
      let node = nodes[nodeName];
      switch (nodeName) {
        case "UseUSB":
          if ("value" in node.Attributes) {
            constants._useUSB = node.Attributes["value"].toUpperCase() == "TRUE";
          }
          break;
        case "Capture":
          constants.InitCaptureParams(node);
          break;
        case "UI":
          constants.InitUIParams(node);
          break;
        case "Updates":
          constants.InitCheckForUpdateParams(node);
          break;
        case "MemoryUsage":
          constants.InitMemoryUsageParams(node);
          break;
        case "UseVirtualHub":
          if ("value" in node.Attributes) {
            constants._useVirtualHub = node.Attributes["value"].toUpperCase() == "TRUE";
          }
          break;
        case "Hubs":
          sensorsManager.InitHubList(node);
          break;
      }
    }
  }
  static get CRCTable() {
    if (constants._crcTable != null)
      return constants._crcTable;
    constants._crcTable = [];
    let c;
    var crcTable = [];
    for (var n = 0; n < 256; n++) {
      c = n;
      for (var k = 0; k < 8; k++) {
        c = c & 1 ? 3988292384 ^ c >>> 1 : c >>> 1;
      }
      constants._crcTable[n] = c;
    }
    return constants._crcTable;
  }
  static crc32(str) {
    var crcTable = constants.CRCTable;
    var crc = 0 ^ -1;
    for (var i = 0; i < str.length; i++) {
      crc = crc >>> 8 ^ crcTable[(crc ^ str.charCodeAt(i)) & 255];
    }
    return (crc ^ -1) >>> 0;
  }
  static setCookie(cname, cvalue, exdays) {
    let d = new Date();
    d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1e3);
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  }
  static getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(";");
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == " ") {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return null;
  }
};
constants.DPIFactorKey = "YoctoVisualization4WebDPIFactor";
constants.isAndroid = navigator.userAgent.toLowerCase().indexOf("android") >= 0;
constants.ScreenDPI = constants.findDPI();
constants.FontFamily = "Arial, Helvetica, sans-serif";
constants.DPIfactorCookieValue = constants.getCookie(constants.DPIFactorKey);
constants.DPIfactorOverriden = constants.DPIfactorCookieValue != null;
constants.DPIfactor = constants.DPIfactorOverriden && parseFloat(constants.DPIfactorCookieValue) > 0 ? parseFloat(constants.DPIfactorCookieValue) : constants.isPhoneOrTablet ? Math.round(10 * constants.ScreenDPI / (96 * 1.2)) / 10 : 1;
constants.FontSize = 12 * constants.DPIfactor;
constants._defaultCaptureType = YDataRenderer.CaptureType.PNG;
constants._defaultCaptureWidth = 1024;
constants._defaultCaptureHeight = 1024;
constants._defaultCaptureDPI = 70;
constants._defaultCaptureSizePolicy = YDataRenderer.CaptureFormats.Keep;
constants._defaultMaxPointsPerGraphSerie = 0;
constants._defaultMaxPointsPerDataloggerSerie = 0;
constants._defaultMaxDataRecordsPerSensor = 0;
constants._defaulDbleClickBringsUpContextMenu = false;
constants._useUSB = true;
constants._useVirtualHub = false;
constants._captureTarget = YDataRenderer.CaptureTarget.ToFile;
constants._captureFolder = "";
constants._checkForUpdate = true;
constants._ignoreBuild = 0;
constants._deviceListValidity = 3600;
constants._crcTable = null;

// obj/rdonly/sensorManager.js
var __awaiter4 = function(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
var Hub = class {
  constructor(hubType, protocol, user, password, clearPassword, addr, port, path, removeable) {
    this._netname = "";
    this._module = null;
    this._logicname = "";
    this._previousURL = "";
    this._previousobfuscatedURL = "";
    this._hubType = 2;
    this._protocol = "";
    this._user = "";
    this._password = "";
    this._addr = "";
    this._port = "";
    this._removable = true;
    this._path = "";
    this._state = 0;
    while (/^\//.test(path)) {
      path = path.slice(1);
    }
    while (/\/$/.test(path)) {
      path = path.slice(0, -1);
    }
    this._hubType = hubType;
    this._protocol = protocol;
    this._user = user;
    this._port = port;
    this._password = clearPassword ? password != "" ? Hub.Encrypt(password, Hub.loginCypherPassword) : "" : password;
    this._addr = addr;
    this._path = path;
    this._removable = typeof removeable === "undefined" ? true : removeable;
  }
  static Decrypt(data, loginCypherPassword) {
    if (data == "")
      return "";
    if (data.length % 4)
      return "";
    let buffer = new Uint16Array(data.length >> 2);
    for (let i = 0; i < buffer.length; i++) {
      buffer[i] = parseInt(data.slice(i * 4, i * 4 + 4), 16);
    }
    let checksum = buffer[0];
    for (let i = 1; i < buffer.length - 1; i++) {
      checksum ^= buffer[i];
    }
    if (checksum != buffer[buffer.length - 1])
      return "";
    let res = "";
    for (let i = 0; i < buffer.length - 2; i++) {
      res += String.fromCharCode(buffer[i + 1] & 255 ^ loginCypherPassword.charCodeAt(i % loginCypherPassword.length) ^ buffer[0] + i & 255 ^ (buffer[i + 1] & 2048) >> 11 << ((buffer[i + 1] & 1792) >> 8) ^ (buffer[i + 1] & 32768) >> 15 << ((buffer[i + 1] & 28672) >> 12));
    }
    return res;
  }
  static Encrypt(data, loginCypherPassword) {
    if (data == "")
      return "";
    let buffer = crypto.getRandomValues(new Uint16Array(data.length + 2));
    for (let i = 0; i < data.length; i++) {
      buffer[i + 1] = buffer[i + 1] & 65280 | data.charCodeAt(i) ^ loginCypherPassword.charCodeAt(i % loginCypherPassword.length) ^ buffer[0] + i & 255 ^ (buffer[i + 1] & 2048) >> 11 << ((buffer[i + 1] & 1792) >> 8) ^ (buffer[i + 1] & 32768) >> 15 << ((buffer[i + 1] & 28672) >> 12);
    }
    buffer[buffer.length - 1] = buffer[0];
    for (let i = 1; i < buffer.length - 1; i++) {
      buffer[buffer.length - 1] ^= buffer[i];
    }
    let res = "";
    for (let i = 0; i < buffer.length; i++) {
      res += ("000" + buffer[i].toString(16)).slice(-4).toUpperCase();
    }
    return res;
  }
  static encryptPassword(clearPassword) {
    return clearPassword == "" ? "" : Hub.Encrypt(clearPassword, Hub.loginCypherPassword);
  }
  get hubType() {
    return this._hubType;
  }
  set hubType(value) {
    this._hubType = value;
  }
  get protocol() {
    return this._protocol;
  }
  set protocol(value) {
    this._protocol = value;
  }
  get user() {
    return this._user;
  }
  set user(value) {
    this._user = value;
  }
  get encryptedPassword() {
    return this._password;
  }
  set encryptedPassword(value) {
    this._password = value;
  }
  get clearPassword() {
    return this._password == "" ? "" : Hub.Decrypt(this._password, Hub.loginCypherPassword);
  }
  set clearPassword(value) {
    this._password = value == "" ? "" : Hub.encryptPassword(value);
  }
  get addr() {
    return this._addr;
  }
  set addr(value) {
    this._addr = value;
  }
  get port() {
    return this._port;
  }
  set port(value) {
    this._port = value;
  }
  get removable() {
    return this._removable;
  }
  set removable(value) {
    this._removable = value;
  }
  get path() {
    return this._path;
  }
  set path(value) {
    this._path = value;
  }
  get ConnectionState() {
    return this._state;
  }
  get ConnectionDescription() {
    switch (this._state) {
      case 1:
        return "Connecting..";
      case 2:
        return (this._logicname != "" ? this._logicname : this._netname) + " OK";
      case 3:
        return "Connection failed ";
      default:
        return "Not connected.";
    }
  }
  static HubFromXml(subnode) {
    let hubType = 2;
    let protocol = "ws";
    let removable = true;
    if ("protocol" in subnode.Attributes)
      protocol = subnode.Attributes["protocol"];
    let user = "";
    if ("user" in subnode.Attributes)
      user = subnode.Attributes["user"];
    let password = "";
    if ("password" in subnode.Attributes)
      password = subnode.Attributes["password"];
    let port = "";
    if ("port" in subnode.Attributes)
      port = subnode.Attributes["port"];
    let path = "";
    if ("path" in subnode.Attributes)
      path = subnode.Attributes["path"];
    let addr = "";
    if ("addr" in subnode.Attributes)
      addr = subnode.Attributes["addr"];
    if ("removable" in subnode.Attributes)
      removable = subnode.Attributes["removable"].toUpperCase() == "TRUE";
    return new Hub(hubType, protocol, user, password, false, addr, port, path, removable);
  }
  Connect() {
    return __awaiter4(this, void 0, void 0, function* () {
      let errmsg = new YErrorMsg();
      this._state = 1;
      logForm.log("preregistering  " + this.get_obfuscatedURL());
      let url = this.get_fullUrl();
      if ((yield YAPI.PreregisterHub(url, errmsg)) != YAPI_SUCCESS) {
        logForm.log("[!] preregistering  " + this.get_obfuscatedURL() + " failed (" + errmsg.msg + ")");
        this._state = 3;
        this._previousURL = "";
        this._previousobfuscatedURL = "";
      } else {
        this._previousURL = url;
        this._previousobfuscatedURL = this.get_obfuscatedURL();
      }
    });
  }
  Disconnect() {
    return __awaiter4(this, void 0, void 0, function* () {
      if (this._previousURL == "")
        return;
      logForm.log("Unregistering  " + this._previousobfuscatedURL);
      yield YAPI.UnregisterHub(this._previousURL);
      this._previousURL = "";
      this._previousobfuscatedURL = "";
      this._state = 0;
    });
  }
  arrival(ip, netname, module, logicname) {
    this._state = 2;
    this._netname = netname;
    this._module = module;
    this._logicname = logicname;
    this._state = 2;
  }
  get address() {
    return this._addr;
  }
  get_consoleUrl() {
    let fullurl = this._protocol + "://" + this._addr;
    if (this._port != "")
      fullurl = fullurl + ":" + this._port;
    return fullurl;
  }
  toString() {
    return this.get_consoleUrl();
  }
  get_fullUrl() {
    let fullurl = "";
    if (this._protocol != "")
      fullurl = this._protocol + "://";
    if (this._user != "") {
      fullurl = fullurl + this._user;
      if (this._password != "")
        fullurl = fullurl + ":" + Hub.Decrypt(this._password, Hub.loginCypherPassword);
      fullurl = fullurl + "@";
    }
    fullurl = fullurl + this._addr;
    if (this._port != "")
      fullurl = fullurl + ":" + this._port;
    else
      fullurl = fullurl + ":4444";
    fullurl = fullurl + "/";
    if (this._path) {
      fullurl = fullurl + this._path + "/";
    }
    return fullurl;
  }
  get_connexionUrl() {
    let fullurl;
    if (this._protocol != "")
      fullurl = this._protocol + "://";
    else
      fullurl = "ws://";
    fullurl = fullurl + this._addr;
    if (this._port != "")
      fullurl = fullurl + ":" + this._port;
    else
      fullurl = fullurl + ":4444";
    fullurl = fullurl + "/";
    return fullurl.toLowerCase();
  }
  get_obfuscatedURL() {
    let fullurl = "";
    if (this._protocol != "")
      fullurl = this._protocol + "://";
    if (this._user != "") {
      fullurl = fullurl + this._user;
      if (this._password != "")
        fullurl = fullurl + ":#####";
      fullurl = fullurl + "@";
    }
    fullurl = fullurl + this._addr;
    if (this._port != "")
      fullurl = fullurl + ":" + this._port;
    if (this._path != "")
      fullurl = fullurl + "/" + this._path;
    return fullurl;
  }
};
Hub.loginCypherPassword = "+>*X[?_ih$N7wA!}";
var TimedSensorValue = class {
  constructor(DateTime, value) {
    this._DateTime = DateTime;
    this._value = value;
  }
  get DateTime() {
    return this._DateTime;
  }
  get value() {
    return this._value;
  }
};
var AlarmSettings = class {
  constructor(index, owner, xmldata) {
    this.index = 0;
    this.Condition = 0;
    this.Source = 0;
    this.Value = 0;
    this.Delay = 15;
    this.Commandline = "";
    this.lastAlarm = new Date(0);
    this.index = index;
    this.parent = owner;
    if (typeof xmldata !== "undefined") {
      if ("Source" in xmldata.Attributes)
        this.Source = parseInt(xmldata.Attributes["Source"]);
      if ("Condition" in xmldata.Attributes)
        this.Condition = parseInt(xmldata.Attributes["Condition"]);
      if ("Value" in xmldata.Attributes)
        this.Value = parseFloat(xmldata.Attributes["Value"]);
      if ("Cmd" in xmldata.Attributes)
        this.Commandline = xmldata.Attributes["Cmd"];
      if ("Delay" in xmldata.Attributes)
        this.Delay = parseInt(xmldata.Attributes["Delay"]);
    }
  }
  static ExecuteCommand(source, command) {
  }
  setCondition(condition) {
    this.Condition = condition;
  }
  getCondition() {
    return this.Condition;
  }
  setSource(source) {
    this.Source = source;
  }
  getSource() {
    return this.Source;
  }
  setValue(value) {
    this.Value = value;
  }
  getValue() {
    return this.Value;
  }
  setDelay(value) {
    if (value < 0)
      throw "delay must be a positive value";
    this.Delay = value;
  }
  getDelay() {
    return this.Delay;
  }
  setCommandline(value) {
    this.Commandline = value;
  }
  getCommandline() {
    return this.Commandline;
  }
  check(m) {
    let alarm = false;
    let reason = "";
    let src;
    let SensorValue;
    switch (this.Source) {
      case 1:
        src = "MIN";
        SensorValue = m.get_minValue();
        break;
      case 2:
        src = "MAX";
        SensorValue = m.get_maxValue();
        break;
      default:
        src = "AVG";
        SensorValue = m.get_averageValue();
        break;
    }
    switch (this.Condition) {
      default:
        return;
      case 1:
        reason = ">";
        if (SensorValue > this.Value)
          alarm = true;
        break;
      case 2:
        reason = ">=";
        if (SensorValue >= this.Value)
          alarm = true;
        break;
      case 3:
        reason = "=";
        if (SensorValue == this.Value)
          alarm = true;
        break;
      case 4:
        reason = "<=";
        if (SensorValue <= this.Value)
          alarm = true;
        break;
      case 5:
        reason = "<";
        if (SensorValue < this.Value)
          alarm = true;
        break;
    }
    let now = new Date();
    if (!alarm)
      return;
    if (now.getTime() - this.lastAlarm.getTime() < 1e3 * this.Delay)
      return;
    let source = "ALARM " + (this.index + 1).toString();
    logForm.log(source + " on " + this.parent.get_hardwareId() + "/" + this.parent.get_friendlyName() + " (" + SensorValue.toString() + reason + this.Value.toString() + ")");
    let Execute = this.Commandline;
    Execute = Execute.replace("$SENSORVALUE$", SensorValue.toString());
    Execute = Execute.replace("$HWDID$", this.parent.get_hardwareId());
    Execute = Execute.replace("$NAME$", this.parent.get_friendlyName());
    Execute = Execute.replace("$UNIT$", this.parent.get_unit());
    Execute = Execute.replace("$CONDITION$", reason);
    Execute = Execute.replace("$DATATYPE$", src);
    Execute = Execute.replace("$TRIGGER$", this.Value.toString());
    Execute = Execute.replace("$NOW$", logForm.dateToString(now));
    try {
      Function(Execute)();
    } catch (e) {
      logForm.log("ALARM " + (this.index + 1) + " code (" + Execute + ") caused an exception :" + e.message);
    }
    this.lastAlarm = now;
  }
};
var DataLoggerBoundary = class {
  constructor(start, stop) {
    this._start = 0;
    this._stop = 0;
    this._start = start;
    this._stop = stop;
  }
  get start() {
    return this._start;
  }
  get stop() {
    return this._stop;
  }
};
var MergeSourceRange = class {
  constructor(start, stop) {
    this.MergeSourceStart = 0;
    this.MergeSourceStop = 0;
    this.MergeSourceStart = start;
    this.MergeSourceStop = stop;
  }
};
var CustomYSensor = class {
  constructor(s, name, SensorLocalConfig) {
    this.unit = "";
    this._frequency = "";
    this.resolution = 1;
    this._recording = false;
    this._online = false;
    this.preloadDone = false;
    this.loadDone = false;
    this.dataLoggerFeature = false;
    this.cfgChgNotificationsSupported = false;
    this.mustReloadConfig = false;
    this._readonly = false;
    this._plzCancelDataloggerLoading = false;
    this._predloadProcessIsBusy = false;
    this._loadProcessIsBusy = false;
    this.lastGetConfig = 0;
    this.recordedDataLoadProgress = 0;
    this.recordedData = null;
    this.loadFailed = false;
    this.loadCanceled = false;
    this.firstLiveDataTimeStamp = 0;
    this.firstDataloggerTimeStamp = 0;
    this.lastDataTimeStamp = 0;
    this.lastDataSource = "";
    this.consecutiveBadTimeStamp = 0;
    this.globalDataLoadProgress = 0;
    this.minData = [];
    this.curData = [];
    this.maxData = [];
    this.previewMinData = [];
    this.previewCurData = [];
    this.previewMaxData = [];
    this._lastAvgValue = Number.NaN;
    this._lastMinValue = Number.NaN;
    this._lastMaxValue = Number.NaN;
    this.dataLoggerStartReadTime = 0;
    this.Alarms = [];
    this.FormsToNotify = [];
    this.sensor = s;
    this.hwdName = name;
    this._friendlyname = name;
    if (s == null)
      return;
    if (SensorLocalConfig != null) {
      let index = 0;
      let childs = SensorLocalConfig.get_childsByIndex();
      for (let i = 0; i < childs.length; i++) {
        let n = childs[i];
        if (n.Name == "Alarm") {
          this.checkAlarmIndex(index);
          this.Alarms[index] = new AlarmSettings(index, this, n);
          index++;
        }
      }
    }
  }
  get isReadOnly() {
    return this._readonly || !this._online;
  }
  static get MaxDataRecords() {
    return CustomYSensor._MaxDataRecords;
  }
  static set MaxDataRecords(value) {
    CustomYSensor._MaxDataRecords = value;
  }
  static get MaxLoggerRecords() {
    return CustomYSensor._MaxLoggerRecords;
  }
  static set MaxLoggerRecords(value) {
    CustomYSensor._MaxLoggerRecords = value;
  }
  get_lastAvgValue() {
    if (this._online)
      return this._lastAvgValue;
    return Number.NaN;
  }
  get_lastMaxValue() {
    if (this._online)
      return this._lastMaxValue;
    return Number.NaN;
  }
  get_lastMinValue() {
    if (this._online)
      return this._lastMinValue;
    return Number.NaN;
  }
  ConfigHasChanged() {
    return __awaiter4(this, void 0, void 0, function* () {
      this.cfgChgNotificationsSupported = true;
      this.mustReloadConfig = true;
      this._online = true;
      yield this.reloadConfig();
      yield this.forceUpdate();
    });
  }
  checkAlarmIndex(index) {
    while (this.Alarms.length < index + 1) {
      this.Alarms.push(new AlarmSettings(this.Alarms.length, this));
    }
  }
  getAlarmCount() {
    return this.Alarms.length;
  }
  setAlarmCondition(index, condition) {
    this.checkAlarmIndex(index);
    this.Alarms[index].setCondition(condition);
  }
  getAlarmCondition(index) {
    this.checkAlarmIndex(index);
    return this.Alarms[index].getCondition();
  }
  setAlarmSource(index, source) {
    this.checkAlarmIndex(index);
    this.Alarms[index].setSource(source);
  }
  getAlarmSource(index) {
    this.checkAlarmIndex(index);
    return this.Alarms[index].getSource();
  }
  setAlarmValue(index, value) {
    this.checkAlarmIndex(index);
    this.Alarms[index].setValue(value);
  }
  getAlarmValue(index) {
    this.checkAlarmIndex(index);
    return this.Alarms[index].getValue();
  }
  setAlarmDelay(index, value) {
    this.checkAlarmIndex(index);
    this.Alarms[index].setDelay(value);
  }
  getAlarmDelay(index) {
    this.checkAlarmIndex(index);
    return this.Alarms[index].getDelay();
  }
  setAlarmCommandline(index, value) {
    this.checkAlarmIndex(index);
    this.Alarms[index].setCommandline(value);
  }
  getAlarmCommandline(index) {
    this.checkAlarmIndex(index);
    return this.Alarms[index].getCommandline();
  }
  getGetaLoadProgress() {
    return this.globalDataLoadProgress;
  }
  get_firstLiveDataTimeStamp() {
    return this.firstLiveDataTimeStamp;
  }
  get_firstDataloggerTimeStamp() {
    return this.firstDataloggerTimeStamp;
  }
  get_lastDataTimeStamp() {
    return this.lastDataTimeStamp;
  }
  preload_DoWork(arg) {
    return __awaiter4(this, void 0, void 0, function* () {
      this._predloadProcessIsBusy = true;
      logForm.log(this.hwdName + ": preloading data from " + arg.start.toString() + " to " + arg.stop.toString() + "(delta= " + (arg.stop - arg.start).toFixed(3) + ")");
      this.recordedData = yield this.sensor.get_recordedData(arg.start, arg.stop);
      try {
        this.recordedDataLoadProgress = yield this.recordedData.loadMore();
      } catch (e) {
        logForm.log(this.hwdName + ": load more caused an exception " + e.message);
      }
      this.globalDataLoadProgress = this.recordedDataLoadProgress;
      let measures = yield this.recordedData.get_preview();
      this.previewMinData = [];
      this.previewCurData = [];
      this.previewMaxData = [];
      let startIndex = 0;
      let errCount = 0;
      let maxErrorCount = 10;
      let lastT = -1;
      if (CustomYSensor._MaxDataRecords > 0 && measures.length > CustomYSensor._MaxDataRecords)
        startIndex = measures.length - CustomYSensor._MaxDataRecords;
      for (let i = startIndex; i < measures.length; i++) {
        let t = measures[i].get_endTimeUTC();
        if (t >= arg.start && t <= arg.stop) {
          this.previewMinData.push(new TimedSensorValue(t, measures[i].get_minValue()));
          this.previewCurData.push(new TimedSensorValue(t, measures[i].get_averageValue()));
          this.previewMaxData.push(new TimedSensorValue(t, measures[i].get_maxValue()));
          if (t < lastT && errCount < maxErrorCount) {
            logForm.log(this.hwdName + " preloading warning:  timestamp going back in time " + t + "<" + lastT + (errCount < maxErrorCount - 1 ? "" : ", further similar errors wont be logged."));
            errCount++;
          } else if (t == lastT && errCount < maxErrorCount) {
            logForm.log(this.hwdName + " preloading warning: duplicate timestamp  " + t + (errCount < maxErrorCount - 1 ? "" : ", further similar errors wont be logged."));
            errCount++;
          }
          lastT = t;
        }
      }
      if (this.previewCurData.length > 1) {
        let a = this.previewCurData[0].DateTime;
        let b = this.previewCurData[this.previewCurData.length - 1].DateTime;
        logForm.log(this.hwdName + ": preloaded data from " + a.toString() + " to " + b.toString() + " (delta=" + (b - a).toFixed(3) + ")");
        if (CustomYSensor._MaxLoggerRecords > 0 && arg.start == 0) {
          let list = yield this.recordedData.get_privateDataStreams();
          let index = list.length - 1;
          let totalRecords = 0;
          while (index > 0 && totalRecords < CustomYSensor._MaxLoggerRecords) {
            totalRecords += yield list[index].get_rowCount();
            this.dataLoggerStartReadTime = yield list[index].get_startTimeUTC();
            index--;
          }
          let n = 0;
          while (n < this.previewMinData.length && this.previewMinData[n].DateTime < this.dataLoggerStartReadTime) {
            n++;
          }
          if (n > 1) {
            this.previewMinData.splice(0, n - 1);
            this.previewCurData.splice(0, n - 1);
            this.previewMaxData.splice(0, n - 1);
          }
        }
      }
      this.preload_Completed(arg);
    });
  }
  findMergeBoundaries(previewMinData) {
    let MergeSourceStart = 0;
    let MergeSourceStop = 0;
    if (this.minData.length > 0) {
      while (MergeSourceStart < this.minData.length && previewMinData[0].DateTime > this.minData[MergeSourceStart].DateTime) {
        MergeSourceStart++;
      }
      MergeSourceStop = MergeSourceStart;
      while (MergeSourceStop < this.minData.length && previewMinData[previewMinData.length - 1].DateTime >= this.minData[MergeSourceStop].DateTime) {
        MergeSourceStop++;
      }
    }
    return new MergeSourceRange(MergeSourceStart, MergeSourceStop);
  }
  preload_Completed(arg) {
    if (this.previewMinData == null)
      return;
    logForm.log(this.hwdName + " : datalogger preloading completed (" + this.previewMinData.length + " rows )");
    if (this.previewMinData.length > 1) {
      let it = this.findMergeBoundaries(this.previewMinData);
      let insertIndex = it.MergeSourceStart;
      let deleteCount = it.MergeSourceStop - it.MergeSourceStart;
      this.minData = this.minData.slice(0, insertIndex).concat(this.previewMinData, this.minData.slice(insertIndex + deleteCount));
      this.curData = this.curData.slice(0, insertIndex).concat(this.previewCurData, this.curData.slice(insertIndex + deleteCount));
      this.maxData = this.maxData.slice(0, insertIndex).concat(this.previewMaxData, this.maxData.slice(insertIndex + deleteCount));
      for (let i = 0; i < this.FormsToNotify.length; i++) {
        if (this.FormsToNotify[i] instanceof graphWidget) {
          this.FormsToNotify[i].SensorNewDataBlock(this, it.MergeSourceStart, it.MergeSourceStart + this.previewMinData.length - 1, 0, true);
        }
      }
    }
    let count = this.curData.length;
    if (count > 0) {
      if (this.curData[count - 1].DateTime > this.lastDataTimeStamp) {
        this.lastDataTimeStamp = this.curData[count - 1].DateTime;
        this.lastDataSource = "last preload timestamp";
      }
    }
    logForm.log(this.hwdName + " : start datalogger loading");
    this._predloadProcessIsBusy = false;
    this.load_DoWork(arg).then();
  }
  get_frequency() {
    return this._frequency;
  }
  updateFrequncy(frequencyToSet) {
    return __awaiter4(this, void 0, void 0, function* () {
      if (yield this.sensor.isOnline()) {
        this._frequency = frequencyToSet;
        yield this.sensor.set_reportFrequency(this._frequency);
        let lfreq = yield this.sensor.get_logFrequency();
        try {
          if (lfreq != "OFF")
            yield this.sensor.set_logFrequency(this._frequency);
          let m = yield this.sensor.get_module();
          yield m.saveToFlash();
        } catch (e) {
          logForm.log("failed to change " + this.hwdName + " log frequency (" + e.message + ")");
        }
      } else {
        this._online = false;
      }
    });
  }
  set_frequency(frequencyToSet) {
    if (this._online) {
      this.updateFrequncy(frequencyToSet).then();
    }
  }
  get_recording() {
    return this._recording;
  }
  set_recording(recordingStatus) {
    this.updaterecording(recordingStatus).then();
  }
  updaterecording(recordingStatus) {
    return __awaiter4(this, void 0, void 0, function* () {
      if (!this.dataLoggerFeature)
        return;
      if (yield this.sensor.isOnline()) {
        this._recording = recordingStatus;
        try {
          yield this.sensor.set_logFrequency(this._recording ? this._frequency : "OFF");
          let module = yield this.sensor.get_module();
          let serial = yield module.get_serialNumber();
          let dl = YDataLogger.FindDataLogger(serial + ".dataLogger");
          yield dl.set_recording(this._recording ? YDataLogger.RECORDING_ON : YDataLogger.RECORDING_OFF);
          yield dl.set_autoStart(this._recording ? YDataLogger.AUTOSTART_ON : YDataLogger.AUTOSTART_OFF);
          yield module.saveToFlash();
        } catch (e) {
          logForm.log("failed to change " + this.hwdName + " recording (" + e.message + ")");
        }
      } else {
        this._online = false;
      }
    });
  }
  reportDataloggerLoadProgress(progress) {
  }
  load_DoWork(arg) {
    return __awaiter4(this, void 0, void 0, function* () {
      if (this._loadProcessIsBusy)
        return;
      this._loadProcessIsBusy = true;
      logForm.log(this.hwdName + " loading main data from datalogger");
      if (this.dataLoggerStartReadTime > 0) {
        this.recordedData = yield this.sensor.get_recordedData(this.dataLoggerStartReadTime, 0);
      }
      let errCount = 0;
      let maxErrorCount = 10;
      let lastT = -1;
      let lastProgress = 0;
      while (this.recordedDataLoadProgress < 100) {
        if (this._plzCancelDataloggerLoading) {
          this.globalDataLoadProgress = 100;
          this.loadDone = true;
          this.loadFailed = false;
          this.loadCanceled = true;
          break;
        }
        try {
          this.recordedDataLoadProgress = yield this.recordedData.loadMore();
        } catch (Exception) {
          this.loadFailed = true;
          return;
        }
        if (this.globalDataLoadProgress != this.recordedDataLoadProgress) {
          this.globalDataLoadProgress = this.recordedDataLoadProgress;
          this.reportDataloggerLoadProgress(this.globalDataLoadProgress);
        }
        if (this.recordedDataLoadProgress - lastProgress >= 2) {
          lastProgress = this.recordedDataLoadProgress;
          this.load_ProgressChanged();
        }
      }
      let measures = yield this.recordedData.get_measures();
      this.previewMinData = [];
      this.previewCurData = [];
      this.previewMaxData = [];
      for (let i = 0; i < measures.length; i++) {
        let t = measures[i].get_endTimeUTC();
        if (t >= arg.start && t <= arg.stop) {
          if (t < lastT && errCount < maxErrorCount) {
            logForm.log(this.hwdName + " loading warning:  timestamp going back in time " + t + "<" + lastT + (errCount < maxErrorCount - 1 ? "" : ", further similar errors wont be logged."));
            errCount++;
          } else if (t == lastT && errCount < maxErrorCount) {
            logForm.log(this.hwdName + " loading warning: duplicate timestamp  " + t + (errCount < maxErrorCount - 1 ? "" : ", further similar errors wont be logged."));
            errCount++;
          }
          lastT = t;
          if (this.previewMinData.length == 0 || t > this.previewMinData[this.previewMinData.length - 1].DateTime) {
            this.previewMinData.push(new TimedSensorValue(t, measures[i].get_minValue()));
            this.previewCurData.push(new TimedSensorValue(t, measures[i].get_averageValue()));
            this.previewMaxData.push(new TimedSensorValue(t, measures[i].get_maxValue()));
          }
        } else {
          let d = new Date(t * 1e3);
          let d1 = new Date(arg.start * 1e3);
          let d2 = new Date(arg.stop * 1e3);
          let dstr = d.toLocaleDateString() + " " + d.toLocaleTimeString();
          let d1str = d1.toLocaleDateString() + " " + d1.toLocaleTimeString();
          let d2str = d2.toLocaleDateString() + " " + d2.toLocaleTimeString();
          console.log(this.hwdName + " note: skipping measure at " + dstr + ", not in range " + d1str + " ... " + d2str);
        }
      }
      if (CustomYSensor._MaxDataRecords > 0)
        this.previewDataCleanUp();
      for (let i = 0; i < this.previewMinData.length - 1; i++) {
        if (this.previewMinData[i].DateTime >= this.previewMinData[i + 1].DateTime) {
          throw "Time-stamp inconsistency";
        }
      }
      if (this.previewCurData.length > 1) {
        logForm.log(this.hwdName + " loaded " + this.previewCurData.length.toString() + "/" + measures.length.toString() + " records over " + (this.previewCurData[this.previewCurData.length - 1].DateTime - this.previewCurData[0].DateTime).toFixed(3) + " sec");
      } else {
        logForm.log(this.hwdName + " loaded " + this.previewCurData.length.toString() + " records");
      }
      if (this.previewMinData.length > 2) {
        this.globalDataLoadProgress = 100;
        let lastPreviewTimeStamp = this.previewMinData[this.previewMinData.length - 1].DateTime;
        let it = this.findMergeBoundaries(this.previewMinData);
        let deleteCount = it.MergeSourceStop - it.MergeSourceStart;
        this.minData = this.minData.slice(0, it.MergeSourceStart).concat(this.previewMinData, this.minData.slice(it.MergeSourceStart + deleteCount));
        this.curData = this.curData.slice(0, it.MergeSourceStart).concat(this.previewCurData, this.curData.slice(it.MergeSourceStart + deleteCount));
        this.maxData = this.maxData.slice(0, it.MergeSourceStart).concat(this.previewMaxData, this.maxData.slice(it.MergeSourceStart + deleteCount));
        this.firstDataloggerTimeStamp = this.curData[0].DateTime;
      }
      this.loadDone = true;
      this.loadFailed = false;
      let count = this.curData.length;
      if (count > 0) {
        if (this.curData[count - 1].DateTime > this.lastDataTimeStamp) {
          this.lastDataTimeStamp = this.curData[count - 1].DateTime;
          this.lastDataSource = "end of datalogger";
        }
      }
      this.load_Completed();
    });
  }
  load_Completed() {
    if (this.loadFailed) {
      logForm.log(this.hwdName + " : datalogger loading failed");
      this._loadProcessIsBusy = false;
      return;
    }
    if (this.loadCanceled) {
      logForm.log(this.hwdName + " : datalogger loading was canceled");
      this.previewMinData = [];
      this.previewCurData = [];
      this.previewMaxData = [];
      this.loadCanceled = false;
      this._loadProcessIsBusy = false;
      this.preloadDone = false;
      this.loadDone = false;
      return;
    }
    if (this.previewCurData.length <= 2) {
      this.preloadDone = false;
      this.loadDone = false;
    }
    logForm.log(this.hwdName + " : datalogger loading completed  (" + this.previewMinData.length + " rows )");
    this.loadDone = true;
    this.globalDataLoadProgress = 100;
    if (this.previewMinData.length <= 0) {
      for (let i = 0; i < this.FormsToNotify.length; i++) {
        if (this.FormsToNotify[i] instanceof graphWidget) {
          this.FormsToNotify[i].DataLoggerProgress();
        }
      }
      return;
    }
    for (let i = 0; i < this.FormsToNotify.length; i++) {
      if (this.FormsToNotify[i] instanceof graphWidget) {
        this.FormsToNotify[i].DataloggerCompleted(this);
        this.FormsToNotify[i].DataLoggerProgress();
      }
    }
    this.previewMinData = [];
    this.previewCurData = [];
    this.previewMaxData = [];
    this.preloadDone = false;
    this.loadDone = false;
    this._loadProcessIsBusy = false;
  }
  dataCleanUp() {
    if (CustomYSensor._MaxDataRecords <= 0)
      return;
    let newsize = CustomYSensor._MaxDataRecords * 90 / 100 >> 0;
    if (this.curData != null && CustomYSensor._MaxDataRecords < this.curData.length) {
      this.minData.splice(0, this.minData.length - newsize);
      this.curData.splice(0, this.curData.length - newsize);
      this.maxData.splice(0, this.maxData.length - newsize);
    }
  }
  previewDataCleanUp() {
    if (CustomYSensor._MaxDataRecords <= 0)
      return;
    let newsize = CustomYSensor._MaxDataRecords * 90 / 100 >> 0;
    if (this.previewMinData != null && CustomYSensor._MaxDataRecords < this.previewMinData.length) {
      this.previewMinData.splice(0, this.previewMinData.length - newsize);
      this.previewCurData.splice(0, this.previewCurData.length - newsize);
      this.previewMaxData.splice(0, this.previewMaxData.length - newsize);
    }
  }
  stopDataloggerloading() {
  }
  load_ProgressChanged() {
    for (let i = 0; i < this.FormsToNotify.length; i++)
      if (this.FormsToNotify[i] instanceof graphWidget)
        this.FormsToNotify[i].DataLoggerProgress();
  }
  isOnline() {
    return this._online;
  }
  reloadConfig() {
    return __awaiter4(this, void 0, void 0, function* () {
      if (this._online) {
        let ison = yield this.sensor.isOnline();
        if (ison) {
          try {
            this.unit = yield this.sensor.get_unit();
            this._friendlyname = yield this.sensor.get_friendlyName();
            this.resolution = yield this.sensor.get_resolution();
            this._frequency = yield this.sensor.get_reportFrequency();
            this._readonly = yield this.sensor.isReadOnly();
            if (this.dataLoggerFeature) {
              this._recording = (yield this.sensor.get_logFrequency()) != "OFF";
            } else {
              this._recording = false;
            }
            this.lastGetConfig = YAPI.GetTickCount();
            this.mustReloadConfig = false;
          } catch (e) {
            logForm.log("reload configuration error: " + e.message);
          }
        } else {
          this._online = false;
        }
      }
    });
  }
  get_unit() {
    if (this.cfgChgNotificationsSupported && !this.mustReloadConfig)
      return this.unit;
    if (this.lastGetConfig <= 0 || YAPI.GetTickCount() - this.lastGetConfig > 5e3)
      this.reloadConfig().then();
    return this.unit;
  }
  get_resolution() {
    if (this.cfgChgNotificationsSupported && !this.mustReloadConfig)
      return this.resolution;
    if (this.lastGetConfig <= 0 || YAPI.GetTickCount() - this.lastGetConfig > 5e3)
      this.reloadConfig().then();
    return this.resolution;
  }
  loadDatalogger(start, stop) {
    if (!this.dataLoggerFeature)
      return;
    if (this._predloadProcessIsBusy)
      return;
    if (this._loadProcessIsBusy)
      return;
    if (constants.maxPointsPerDataloggerSerie < 0) {
      logForm.log(this.hwdName + " : datalogger access is disabled");
      return;
    }
    if (!this.preloadDone && this.dataLoggerFeature) {
      logForm.log(this.hwdName + " : start datalogger preloading");
      this.preload_DoWork(new DataLoggerBoundary(start, stop)).then();
    }
  }
  arrival(dataloggerOn) {
    return __awaiter4(this, void 0, void 0, function* () {
      yield this.configureSensor();
      this._online = true;
      yield this.reloadConfig();
      let dt = yield this.sensor.get_dataLogger();
      if (dt == null)
        return;
      if (this.curData.length > 0) {
        let end = yield dt.get_timeUTC();
        let start = this.curData[this.curData.length - 1].DateTime;
        let duration = end - start;
        if (duration > 1) {
          logForm.log(this.hwdName + " is back online trying to load " + duration.toFixed(3) + " sec of data from datalogger ");
          this.loadDatalogger(start, end);
        }
      } else {
        this.loadDatalogger(0, yield dt.get_timeUTC());
      }
      if (this.isReadOnly)
        logForm.log(this.hwdName + " is read only");
      this.notifySensorStateChange();
    });
  }
  notifySensorStateChange() {
    for (let i = 0; i < this.FormsToNotify.length; i++) {
      this.FormsToNotify[i].SensorStateChangedcallback(this);
    }
  }
  removal() {
    this._online = false;
    this.forceUpdate();
    this.notifySensorStateChange();
  }
  configureSensor() {
    return __awaiter4(this, void 0, void 0, function* () {
      logForm.log("Configuring  " + this.hwdName);
      if (!(yield this.sensor.isOnline()))
        return;
      let mustSave = false;
      let olfreq = yield this.sensor.get_logFrequency();
      let orfreq = yield this.sensor.get_reportFrequency();
      let readOnly = yield this.sensor.isReadOnly();
      let lfreq = olfreq;
      let rfreq = orfreq;
      let m = yield this.sensor.get_module();
      for (let i = 0; i < (yield m.functionCount()); i++) {
        if ((yield m.functionType(i)) == "DataLogger") {
          this.dataLoggerFeature = true;
        }
      }
      try {
        if (this.dataLoggerFeature) {
          let m2 = yield this.sensor.get_module();
          let dl = YDataLogger.FindDataLogger((yield m2.get_serialNumber()) + ".dataLogger");
          let dataloggerOn = (yield dl.get_recording()) != YDataLogger.RECORDING_OFF;
          let dataloggerAS = (yield dl.get_autoStart()) != YDataLogger.AUTOSTART_OFF;
          if (!dataloggerOn) {
            lfreq = "OFF";
          }
          if (lfreq != "OFF") {
            rfreq = lfreq;
          } else if (rfreq == "OFF") {
            rfreq = "1/s";
          }
          if (lfreq != olfreq) {
            if (readOnly)
              throw new Error(this.hwdName + " is read only, cannot change its logFrequency from " + olfreq + " to " + lfreq);
            yield this.sensor.set_logFrequency(lfreq);
            mustSave = true;
          }
          if (rfreq != orfreq) {
            if (readOnly)
              throw new Error(this.hwdName + " is read only, connot change its  reportFrequency from " + orfreq + " to " + rfreq);
            yield this.sensor.set_reportFrequency(rfreq);
            mustSave = true;
          }
          if (lfreq != "OFF") {
            if (!dataloggerOn) {
              if (readOnly)
                throw new Error(this.hwdName + " is read only, cannot change set its  datalogger recording to ON");
              yield dl.set_recording(YDataLogger.RECORDING_ON);
            }
            if (!dataloggerAS) {
              if (readOnly)
                throw new Error(this.hwdName + " is read only, cannot change set its datalogger autostart to ON");
              yield dl.set_autoStart(YDataLogger.AUTOSTART_ON);
              mustSave = true;
            }
          }
        } else {
          lfreq = "OFF";
          if (rfreq == "OFF") {
            rfreq = "1/s";
            if (readOnly)
              throw new Error(this.hwdName + " is read only, connot change is reportFrequency from OFF to " + rfreq);
            yield this.sensor.set_reportFrequency(rfreq);
            mustSave = true;
          }
        }
        if (mustSave)
          yield m.saveToFlash();
      } catch (e) {
        logForm.log("failed to configure " + this.hwdName + "  (" + e.message + ")");
      }
      logForm.log("registering timed callback for  " + (yield this.sensor.get_hardwareId()));
      yield this.sensor.registerTimedReportCallback((callbacksource, M) => {
        this.TimedCallback(callbacksource, M);
      });
      this._recording = lfreq != "OFF";
      this._frequency = rfreq;
    });
  }
  registerCallback(f) {
    if (this.FormsToNotify.indexOf(f) >= 0)
      return;
    this.FormsToNotify.push(f);
    return;
  }
  forceUpdate() {
    this.TimedCallback(this.sensor, null).then();
  }
  TimedCallback(source, M) {
    return __awaiter4(this, void 0, void 0, function* () {
      if (M != null) {
        this._online = true;
        let t = M.get_endTimeUTC();
        if (this.firstLiveDataTimeStamp == 0)
          this.firstLiveDataTimeStamp = t;
        if (t > this.lastDataTimeStamp) {
          this.lastDataTimeStamp = t;
          this.lastDataSource = "last timedReport";
          this.consecutiveBadTimeStamp = 0;
        } else {
          this.consecutiveBadTimeStamp++;
          if (this.consecutiveBadTimeStamp < 10) {
            logForm.log(this.hwdName + ": ignoring bad timestamp " + t.toFixed(3) + " (previous " + this.lastDataSource + " at " + this.lastDataTimeStamp.toFixed(3) + ")");
          }
        }
        if (this.consecutiveBadTimeStamp == 0 || this.consecutiveBadTimeStamp >= 10) {
          this._lastAvgValue = M.get_averageValue();
          this._lastMinValue = M.get_minValue();
          this._lastMaxValue = M.get_maxValue();
          this.curData.push(new TimedSensorValue(t, this._lastAvgValue));
          this.minData.push(new TimedSensorValue(t, this._lastMinValue));
          this.maxData.push(new TimedSensorValue(t, this._lastMaxValue));
          if (CustomYSensor._MaxDataRecords > 0)
            this.dataCleanUp();
        }
        for (let i = 0; i < this.Alarms.length; i++) {
          this.Alarms[i].check(M);
        }
      }
      for (let i = 0; i < this.FormsToNotify.length; i++) {
        this.FormsToNotify[i].SensorValuecallback(this, M);
      }
    });
  }
  forgetForm(source) {
    for (let i = this.FormsToNotify.length - 1; i >= 0; i--) {
      if (source == this.FormsToNotify[i]) {
        this.FormsToNotify.splice(i, 1);
      }
    }
  }
  get_sensor() {
    return this.sensor;
  }
  get_hardwareId() {
    return this.hwdName;
  }
  get_friendlyName() {
    return this._friendlyname;
  }
  toString() {
    let name = this._friendlyname;
    if (this._readonly)
      name += " (readonly)";
    if (this._online)
      return name;
    return name + " (OFFLINE)";
  }
};
CustomYSensor._MaxDataRecords = 0;
CustomYSensor._MaxLoggerRecords = 0;
var NullYSensor = class extends CustomYSensor {
  constructor() {
    super(null, "", null);
    this.hwdName = "NOTAREALSENSOR";
    this._friendlyname = "NOTAREALSENSOR";
  }
  get_unit() {
    return "";
  }
  registerCallback(Form) {
  }
  forceUpdate() {
  }
  get_frequency() {
    return "";
  }
  set_frequency(frequencyToSet) {
  }
  get_sensor() {
    return null;
  }
  toString() {
    return "(none)";
  }
  setAlarmCondition(index, condition) {
  }
  getAlarmCondition(index) {
    return 0;
  }
  setAlarmValue(index, value) {
  }
  getAlarmValue(index) {
    return 0;
  }
  setAlarmDelay(index, value) {
  }
  getAlarmDelay(index) {
    return 0;
  }
  setAlarmCommandline(index, value) {
  }
  getAlarmCommandline(index) {
    return "";
  }
};
var sensorsManager = class {
  static clearHublist() {
    return __awaiter4(this, void 0, void 0, function* () {
      for (let i = sensorsManager._hubList.length - 1; i >= 0; i--) {
        if (sensorsManager._hubList[i].removable) {
          yield YAPI.UnregisterHub(sensorsManager._hubList[i].get_fullUrl());
          sensorsManager._hubList.splice(i, 1);
        }
      }
    });
  }
  static registerChangeCallback(changeCallback) {
    this._changeCallback = changeCallback;
  }
  static registerChangeExternalCallback(changeCallback) {
    this._changeExternalCallback = changeCallback;
  }
  static forgetForm(source) {
    for (let i = 0; i < sensorsManager.sensorList.length; i++) {
      sensorsManager.sensorList[i].forgetForm(source);
    }
  }
  static InitHubList(node) {
    let nodes = node.get_childsByIndex();
    for (let i = 0; i < nodes.length; i++) {
      if (nodes[i].Name.toUpperCase() == "HUB") {
        let h = Hub.HubFromXml(nodes[i]);
        let alreadthere = false;
        for (let j = 0; j < sensorsManager._hubList.length; j++) {
          if (h.get_connexionUrl() == sensorsManager._hubList[j].get_connexionUrl())
            alreadthere = true;
        }
        if (!alreadthere) {
          sensorsManager._hubList.push(h);
          h.Connect().then();
        }
      }
    }
  }
  static get hubList() {
    return sensorsManager._hubList;
  }
  static hubWasremoved(h) {
    for (let i = sensorsManager._hubList.length - 1; i >= 0; i--) {
      if (sensorsManager._hubList[i] == h)
        sensorsManager._hubList.splice(i, 1);
    }
  }
  static newHubCreated(h) {
    let url = h.get_connexionUrl();
    for (let i = 0; i < sensorsManager._hubList.length; i++) {
      if (sensorsManager._hubList[i].get_connexionUrl() == url) {
        alert("This connection already exists");
        return false;
      }
    }
    sensorsManager._hubList.push(h);
    return true;
  }
  static removeExtraInfoFromUrl(url) {
    let it = new URL(url);
    let res = it.hostname + it.pathname;
    if (res.slice(0, 4).toLowerCase() === "www.") {
      res = res.slice(4);
    }
    return res;
  }
  static NetworkArrival(net) {
    return __awaiter4(this, void 0, void 0, function* () {
      logForm.log("Network device detected: " + (yield net.get_hardwareId()));
      let ip = yield net.get_ipAddress();
      let netname = yield net.get_logicalName();
      let module = yield net.get_module();
      let loginame = yield module.get_logicalName();
      let url = sensorsManager.removeExtraInfoFromUrl(yield module.get_url());
      for (let i = 0; i < sensorsManager._hubList.length; i++) {
        let str = sensorsManager.removeExtraInfoFromUrl(sensorsManager.hubList[i].get_fullUrl());
        if (str == url) {
          sensorsManager.hubList[i].arrival(ip, netname, module, loginame);
        }
      }
    });
  }
  static setKnownSensors(sensorXMLList) {
    this.KnownSensors = sensorXMLList;
  }
  static FindSensorLastLocalConfig(hwdId) {
    let SensorConfig = null;
    if (sensorsManager.KnownSensors != null) {
      let childs = sensorsManager.KnownSensors.get_childsByIndex();
      for (let i = 0; i < childs.length; i++) {
        let node = childs[i];
        if (node.Name == "Sensor") {
          let id = node.get_attributes()["ID"];
          if (id == hwdId) {
            SensorConfig = node;
          }
        }
      }
    }
    return SensorConfig;
  }
  static deviceConfigChanged(m) {
    return __awaiter4(this, void 0, void 0, function* () {
      logForm.log("Configuration change on device  " + (yield m.get_serialNumber()));
      let serialprefix = (yield m.get_serialNumber()).substring(0, 8);
      for (let i = 0; i < sensorsManager.sensorList.length; i++) {
        if (sensorsManager.sensorList[i].get_hardwareId().substring(0, 8) == serialprefix) {
          yield sensorsManager.sensorList[i].ConfigHasChanged();
        }
      }
      if (sensorsManager._changeCallback != null)
        sensorsManager._changeCallback();
      if (sensorsManager._changeExternalCallback != null) {
        let data = yield sensorsManager._changeExternalCallback(m);
        if (data != null)
          YWebPage.ConfigChanged(data);
      }
    });
  }
  static deviceArrival(m) {
    return __awaiter4(this, void 0, void 0, function* () {
      try {
        let count = yield m.functionCount();
        let serial = yield m.get_serialNumber();
        let luminosity = yield m.get_luminosity();
        logForm.log("--> Device Arrival " + serial);
        let recording = false;
        for (let i = 0; i < count; i++) {
          let ftype = yield m.functionType(i);
          let fid = yield m.functionId(i);
          if (ftype == "Network") {
            let net = yield YNetwork.FindNetwork(serial + "." + fid);
            yield sensorsManager.NetworkArrival(net);
          } else if (ftype == "DataLogger") {
            let dlog = YDataLogger.FindDataLogger(serial + "." + fid);
            let state = yield dlog.get_recording();
            if (state == YDataLogger.RECORDING_ON || state == YDataLogger.RECORDING_PENDING) {
              recording = true;
            }
          }
        }
        for (let i = 0; i < count; i++) {
          let fbasetype = yield m.functionBaseType(i);
          let fid = yield m.functionId(i);
          if (fbasetype == "Sensor") {
            let hwdID = serial + "." + fid;
            logForm.log("New sensor arrival: " + hwdID);
            let found = false;
            for (let j = 0; j < sensorsManager.sensorList.length && !found; j++) {
              if (sensorsManager.sensorList[j].get_hardwareId() == hwdID) {
                found = true;
                yield sensorsManager.sensorList[j].arrival(recording);
              }
            }
            if (!found) {
              let s = YSensor.FindSensor(hwdID);
              let hwd = yield s.get_hardwareId();
              let cs = new CustomYSensor(s, hwd, sensorsManager.FindSensorLastLocalConfig(hwd));
              sensorsManager.sensorList.push(cs);
              yield cs.configureSensor();
              cs.notifySensorStateChange();
            }
          }
        }
        yield m.registerConfigChangeCallback(sensorsManager.deviceConfigChanged);
        setTimeout(() => {
          sensorsManager.deviceConfigChanged(m);
        }, 100);
        if (sensorsManager._changeCallback != null)
          sensorsManager._changeCallback();
      } catch (e) {
        logForm.log("Device Arrival Error: " + e.message);
      }
    });
  }
  static deviceRemoval(m) {
    return __awaiter4(this, void 0, void 0, function* () {
      let serial = yield m.get_serialNumber();
      logForm.log("Device removal " + serial);
      sensorsManager.sensorList.forEach((alreadyThereSensor) => {
        if (!(alreadyThereSensor instanceof NullYSensor)) {
          let hwd = alreadyThereSensor.get_hardwareId();
          if (hwd.length >= serial.length) {
            if (hwd.substring(0, serial.length) == serial) {
              alreadyThereSensor.removal();
            }
          }
        }
      });
      if (sensorsManager._changeCallback != null)
        sensorsManager._changeCallback();
    });
  }
  static AddNewSensor(hwdID) {
    for (let i = 0; i < sensorsManager.sensorList.length; i++) {
      if (sensorsManager.sensorList[i] != null) {
        if (sensorsManager.sensorList[i].get_hardwareId() == hwdID)
          return sensorsManager.sensorList[i];
      }
    }
    let s = YSensor.FindSensor(hwdID);
    let cs = new CustomYSensor(s, hwdID, sensorsManager.FindSensorLastLocalConfig(hwdID));
    sensorsManager.sensorList.push(cs);
    return cs;
  }
  static getNullSensor() {
    return sensorsManager.NullSensor;
  }
  static UpdateDeviceList() {
    return __awaiter4(this, void 0, void 0, function* () {
      let err = new YErrorMsg();
      if ((yield YAPI.UpdateDeviceList(err)) != YAPI_SUCCESS) {
        logForm.log("UpdateDeviceList failed :" + err.msg);
      }
    });
  }
  static _runAsync() {
    return __awaiter4(this, void 0, void 0, function* () {
      let errmsg = new YErrorMsg();
      yield YAPI.RegisterDeviceArrivalCallback((m) => {
        sensorsManager.deviceArrival(m);
      });
      yield YAPI.RegisterDeviceRemovalCallback((m) => {
        sensorsManager.deviceRemoval(m);
      });
      yield sensorsManager.UpdateDeviceList();
      setInterval(() => {
        sensorsManager.UpdateDeviceList();
      }, 2e3);
    });
  }
  static run() {
    sensorsManager.NullSensor = new NullYSensor();
    sensorsManager.sensorList = [];
    sensorsManager.sensorList.push(sensorsManager.NullSensor);
    this._runAsync().then();
  }
};
sensorsManager.counter = 0;
sensorsManager.KnownSensors = null;
sensorsManager._hubList = [];
sensorsManager._changeCallback = null;
sensorsManager._changeExternalCallback = null;

// obj/rdonly/formManager.js
var __awaiter5 = function(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
var YWidget = class {
  constructor(node, editor, default_x, default_y, default_width, default_height) {
    this._genProp = null;
    this._genRenderer = null;
    this._BackColor = YColor.Transparent;
    this._BorderColor = YColor.Gray;
    this._relativePositionX = 0;
    this._relativePositionY = 0;
    this._PositionX = 0;
    this._PositionY = 0;
    this._relativeWidth = 100;
    this._relativeHeight = 100;
    this._Width = 300;
    this._Height = 0;
    this._InitialSizeIsRelative = false;
    this._SizeIsRelative = false;
    this._initialContainerID = "";
    this._containerID = "";
    this._Text = "";
    let left = typeof default_x != "undefined" ? default_x : 0;
    let top = typeof default_y != "undefined" ? default_y : 0;
    let width = typeof default_width != "undefined" ? default_width : 0;
    let height = typeof default_height != "undefined" ? default_height : 0;
    let bottom = Number.NaN;
    let right = Number.NaN;
    if (node != null) {
      let childnodes = node.get_childsByName();
      if ("location" in childnodes) {
        let it = childnodes["location"];
        let attributes = it.get_attributes();
        if ("x" in attributes)
          left = parseInt(attributes["x"]);
        if ("y" in attributes)
          top = parseInt(attributes["y"]);
      }
      if ("size" in childnodes) {
        let it = childnodes["size"];
        let attributes = it.get_attributes();
        if ("w" in attributes)
          width = parseInt(attributes["w"]);
        if ("h" in attributes)
          height = parseInt(attributes["h"]);
      }
      if ("relativeCoord" in childnodes) {
        let it = childnodes["relativeCoord"];
        let attributes = it.get_attributes();
        if ("x" in attributes)
          this._relativePositionX = this.sizeRound(parseFloat(attributes["x"]));
        if ("y" in attributes)
          this._relativePositionY = this.sizeRound(parseFloat(attributes["y"]));
        if ("w" in attributes)
          this._relativeWidth = this.sizeRound(parseFloat(attributes["w"]));
        if ("h" in attributes)
          this._relativeHeight = this.sizeRound(parseFloat(attributes["h"]));
        if ("active" in attributes)
          this._InitialSizeIsRelative = attributes["active"].toUpperCase() == "TRUE";
      }
      if ("container" in childnodes) {
        let it = childnodes["container"];
        let attributes = it.get_attributes();
        if ("id" in attributes)
          this._initialContainerID = attributes["id"];
      }
    }
    this.UIContainer = document.createElement("CANVAS");
    this.UIContainer.style.position = "absolute";
    let h = window.innerHeight;
    let w = window.innerWidth;
    this.PositionX = this._InitialSizeIsRelative ? Math.round(w * (this._relativePositionX / 100)) : left;
    this.PositionY = this._InitialSizeIsRelative ? Math.round(h * (this._relativePositionY / 100)) : top;
    this.Width = this._InitialSizeIsRelative ? Math.round(w * (this._relativeWidth / 100)) : width;
    this.Height = this._InitialSizeIsRelative ? Math.round(h * (this._relativeWidth / 100)) : height;
    this.UIContainer.style.border = "1px solid black";
    this.UIContainer.style.backgroundColor = this._BackColor.htmlCode;
    this.UIContainer.setAttribute("name", "YoctoVisualizationWidget");
    document.body.appendChild(this.UIContainer);
    this._windowResizeCallback = () => this.windowResized();
    window.addEventListener("resize", this._windowResizeCallback);
  }
  static log(st) {
    logForm.log(st);
  }
  SourceChanged(src, index) {
  }
  showRecordedDatachanged() {
  }
  snapshot() {
    let w = 1024;
    let h = 1024;
    let ratio = this.UIContainer.offsetHeight != 0 ? this.UIContainer.offsetWidth / this.UIContainer.offsetHeight : 1;
    switch (constants.captureSizePolicy) {
      case YDataRenderer.CaptureFormats.Keep:
        w = this.UIContainer.offsetWidth;
        h = this.UIContainer.offsetHeight;
        break;
      case YDataRenderer.CaptureFormats.FixedHeight:
        h = constants.captureHeight;
        w = h * ratio;
        break;
      case YDataRenderer.CaptureFormats.FixedWidth:
        w = constants.captureWidth;
        h = w / ratio;
        break;
      case YDataRenderer.CaptureFormats.Fixed:
        w = constants.captureWidth;
        h = constants.captureHeight;
        break;
    }
    this._genRenderer.captureAndDownloadImage(constants.captureType, "", w, h, constants.captureDPI);
  }
  get BackColor() {
    return this._BackColor;
  }
  set BackColor(value) {
    this._BackColor = value;
    this.UIContainer.style.backgroundColor = this._BackColor.htmlCode;
  }
  get BorderColor() {
    return this._BorderColor;
  }
  set BorderColor(value) {
    this._BorderColor = value;
    this.UIContainer.style.border = "1px solid " + this._BorderColor.htmlCode;
  }
  get parentWidth() {
    if (this.UIContainer.parentNode == document.body || this.UIContainer.parentNode == null)
      return window.innerWidth;
    return this.UIContainer.parentNode.clientWidth;
  }
  get parentHeight() {
    if (this.UIContainer.parentNode == document.body || this.UIContainer.parentNode == null)
      return window.innerHeight;
    return this.UIContainer.parentNode.clientHeight;
  }
  get relativePositionX() {
    if (this._SizeIsRelative)
      return this._relativePositionX;
    return this.sizeRound(100 * this.UIContainer.offsetLeft / this.parentWidth);
  }
  set relativePositionX(value) {
    this._relativePositionX = value;
    this._PositionX = Math.round(value * this.parentWidth / 100);
  }
  set relativePositionY(value) {
    this._relativePositionY = value;
    this._PositionY = Math.round(value * this.parentHeight / 100);
  }
  get relativePositionY() {
    if (this._SizeIsRelative)
      return this._relativePositionY;
    return this.sizeRound(100 * this.UIContainer.offsetTop / this.parentHeight);
  }
  get PositionX() {
    if (this._SizeIsRelative)
      return this.relativePositionX;
    return this.UIContainer.offsetLeft;
  }
  set PositionX(value) {
    if (this._SizeIsRelative)
      this.relativePositionX = value;
    else
      this._PositionX = value;
    this.UIContainer.style.left = this._PositionX.toString() + "px";
  }
  get PositionY() {
    if (this._SizeIsRelative)
      return this.relativePositionY;
    return this.UIContainer.offsetTop;
  }
  set PositionY(value) {
    if (this._SizeIsRelative)
      this.relativePositionY = value;
    else
      this._PositionY = value;
    this.UIContainer.style.top = this._PositionY.toString() + "px";
  }
  sizeRound(v) {
    return Math.round(100 * v) / 100;
  }
  get relativeWidth() {
    if (this._SizeIsRelative)
      return this._relativeWidth;
    return this.sizeRound(100 * this.UIContainer.offsetWidth / this.parentWidth);
  }
  set relativeWidth(value) {
    if (value <= 0)
      throw "Value must be strictly positive";
    this._relativeWidth = value;
    this._Width = Math.round(value * this.parentWidth / 100);
  }
  set relativeHeight(value) {
    if (value <= 0)
      throw "Value must be strictly positive";
    this._relativeHeight = value;
    this._Height = Math.round(value * this.parentHeight / 100);
  }
  get relativeHeight() {
    if (this._SizeIsRelative)
      return this._relativeHeight;
    return this.sizeRound(100 * this.UIContainer.offsetHeight / this.parentHeight);
  }
  updateRelativeSize() {
    if (Math.abs(this._relativeWidth * this.parentWidth / 100 - this.UIContainer.offsetWidth) > 1)
      this._relativeWidth = this.sizeRound(100 * this.UIContainer.offsetWidth / this.parentWidth);
    if (Math.abs(this._relativeHeight * this.parentHeight / 100 - this.UIContainer.offsetHeight) > 1)
      this._relativeHeight = this.sizeRound(100 * this.UIContainer.offsetHeight / this.parentHeight);
    if (Math.abs(this._relativePositionX * this.parentWidth / 100 - this.UIContainer.offsetLeft) > 1)
      this._relativePositionX = this.sizeRound(100 * this.UIContainer.offsetLeft / this.parentWidth);
    if (Math.abs(this._relativePositionY * this.parentHeight / 100 - this.UIContainer.offsetTop) > 1)
      this._relativePositionY = this.sizeRound(100 * this.UIContainer.offsetTop / this.parentHeight);
  }
  get Width() {
    if (this._SizeIsRelative)
      return this.relativeWidth;
    else
      return this.UIContainer.offsetWidth;
  }
  set Width(value) {
    if (value <= 0)
      throw "Value must be strictly positive";
    if (this._SizeIsRelative)
      this.relativeWidth = value;
    else
      this._Width = value;
    this.UIContainer.style.width = (this._Width - 2).toString() + "px";
    this.UIContainer.width = this._Width - 2;
    if (this._genRenderer != null)
      this._genRenderer.clearTransformationMatrix();
    this.containerResized();
  }
  get Height() {
    if (this._SizeIsRelative)
      return this.relativeHeight;
    else
      return this.UIContainer.offsetHeight;
  }
  set Height(value) {
    if (value <= 0)
      throw "Value must be strictly positive";
    if (this._SizeIsRelative)
      this.relativeHeight = value;
    else
      this._Height = value;
    this.UIContainer.style.height = (this._Height - 2).toString() + "px";
    this.UIContainer.height = this._Height - 2;
    if (this._genRenderer != null)
      this._genRenderer.clearTransformationMatrix();
    this.containerResized();
  }
  get SizeIsRelative() {
    return this._SizeIsRelative;
  }
  set SizeIsRelative(value) {
    if (this._SizeIsRelative != value) {
      this._SizeIsRelative = value;
      if (this._SizeIsRelative) {
        this._relativePositionX = this.sizeRound(100 * this.UIContainer.offsetLeft / this.parentWidth);
        this._relativePositionY = this.sizeRound(100 * this.UIContainer.offsetTop / this.parentHeight);
        this._relativeWidth = this.sizeRound(100 * this.UIContainer.offsetWidth / this.parentWidth);
        this._relativeHeight = this.sizeRound(100 * this.UIContainer.offsetHeight / this.parentHeight);
      }
      this.windowResized();
    }
  }
  get containerID() {
    return this._containerID;
  }
  set containerID(value) {
    if (this._containerID == value)
      return;
    let target = value != "" ? document.getElementById(value) : null;
    if (value != "" && target == null)
      throw "No HTMLElement on the page with such ID (" + value + ")";
    if (this.UIContainer.parentNode != null) {
      this.UIContainer.parentNode.removeChild(this.UIContainer);
    } else {
      document.body.removeChild(this.UIContainer);
    }
    if (target != null) {
      target.insertBefore(this.UIContainer, target.firstChild);
    } else {
      document.body.insertBefore(this.UIContainer, document.body.firstChild);
    }
    this._genRenderer.clearTransformationMatrix();
    this.windowResized();
    this._containerID = value;
  }
  get Text() {
    return this._Text;
  }
  set Text(value) {
    this._Text = value;
    this.UIContainer.title = value;
  }
  set_name(name) {
    this.Text = name;
    this._genProp.Form_Text = name;
  }
  windowResized() {
    this._genRenderer.DisableRedraw();
    if (this._SizeIsRelative) {
      this.PositionX = this._relativePositionX;
      this.PositionY = this._relativePositionY;
      this.Height = this._relativeHeight;
      this.Width = this._relativeWidth;
    }
    this.containerResized();
    this._genRenderer.AllowRedraw();
  }
  ApplyRelativeSizeIfRequired() {
    if (this._initialContainerID != "") {
      if (document.getElementById(this._initialContainerID) != null) {
        this.containerID = this._initialContainerID;
      } else {
        logForm.log('Warning: cannot place widget in "' + this._initialContainerID + '" : no such HTML element.');
      }
    }
    this._SizeIsRelative = this._InitialSizeIsRelative;
    this.windowResized();
  }
  destroy() {
    window.removeEventListener("resize", this._windowResizeCallback);
    this._genRenderer.destroy();
    Object.entries(this).forEach((pair) => {
      Reflect.set(this, pair[0], null);
    });
  }
  getContainerOffset() {
    let it = this.UIContainer.offsetParent;
    let absx = 0;
    let absy = 0;
    while (it) {
      absy += it.offsetTop;
      absx += it.offsetLeft;
      it = it.offsetParent;
    }
    return new pointXY(absx, absy);
  }
  contextMenuCallBack(mouseX, mouseY) {
    let p = this._genRenderer.Scr2ElmMatrix.multiplyByV(Vector3.FromXYCoord(mouseX, mouseY)).toPoint();
    if (p.X >= 0 && p.X <= this.UIContainer.offsetWidth && p.Y >= 0 && p.Y <= this.UIContainer.offsetHeight) {
      this.contextMenuIsOpening();
    }
  }
  contextMenuIsOpening() {
  }
  rearrangeZindexes() {
    let containers = document.getElementsByName("YoctoVisualizationWidget");
    let n = 0;
    for (let i = 0; i < containers.length; i++) {
      if (containers[i] != this.UIContainer) {
        containers[i].style.zIndex = n.toString();
        n++;
      }
    }
    this.UIContainer.style.zIndex = n.toString();
  }
  SensorStateChangedcallback(source) {
  }
  SensorValuecallback(source, M) {
  }
  updateWindowPositionProperties(prop) {
    prop.Form_PositionX = this.PositionX;
    prop.Form_PositionY = this.PositionY;
    prop.Form_Width = this.Width;
    prop.Form_Height = this.Height;
  }
  resize(newWidth, newHeight) {
    this.UIContainer.style.width = newWidth.toString() + "px";
    this.UIContainer.style.height = newHeight.toString() + "px";
    this.containerResized();
  }
  containerResized() {
  }
  getPropertiesXml() {
    return "";
  }
  PatchSensorAnnotationCallback(sensor, text) {
    let name = "None";
    let avgvalue = "N/A";
    let minvalue = "N/A";
    let maxvalue = "N/A";
    let unit = "";
    if (!(sensor instanceof NullYSensor)) {
      let resolution = -Math.round(Math.log10(sensor.get_resolution()));
      name = sensor.get_friendlyName();
      if (sensor.isOnline()) {
        avgvalue = sensor.get_lastAvgValue().toFixed(resolution);
        minvalue = sensor.get_lastMinValue().toFixed(resolution);
        maxvalue = sensor.get_lastMaxValue().toFixed(resolution);
      }
      unit = sensor.get_unit();
    }
    text = text.replace("$NAME$", name);
    text = text.replace("$AVGVALUE$", avgvalue);
    text = text.replace("$MAXVALUE$", maxvalue);
    text = text.replace("$MINVALUE$", minvalue);
    text = text.replace("$UNIT$", unit);
    return text;
  }
};
var gaugeWidget = class extends YWidget {
  constructor(node, editor, x, y, width, height) {
    super(node, editor, x, y, width, height);
    this._gauge = new YSolidGauge(this.UIContainer, YSolidGauge.DisplayMode.DISPLAY90, YWidget.log);
    this._genRenderer = this._gauge;
    this.noDataSourcepanel = this._gauge.addMessagePanel();
    this.noDataSourcepanel.font.size = constants.generalFontSize;
    this.noDataSourcepanel.text = "No data source configured\n";
    this.prop = new GaugeFormProperties(node, this);
    this._genProp = this.prop;
    let propDesc = GenericProperties.getAllProperties(this.prop);
    if (gaugeWidget.AnnotationPanelCount == 0) {
      for (let propname in propDesc.byName) {
        if (propname.startsWith("SolidGauge_annotationPanel"))
          gaugeWidget.AnnotationPanelCount++;
      }
    }
    for (let i = 0; i < gaugeWidget.AnnotationPanelCount; i++) {
      this._gauge.addAnnotationPanel();
    }
    this._gauge.setPatchAnnotationCallback((s) => {
      return this.AnnotationCallback(s);
    });
    this.updateWindowPositionProperties(this.prop);
    this.prop.ApplyAllProperties(this);
    YDataRenderer.minMaxCheckDisabled = true;
    this.prop.ApplyAllProperties(this._gauge);
    YDataRenderer.minMaxCheckDisabled = false;
    this._gauge.resetRefrenceSize();
    this._gauge.resizeRule = Proportional.ResizeRule.RELATIVETOBOTH;
    this.ApplyRelativeSizeIfRequired();
    this._gauge.AllowRedraw();
  }
  containerResized() {
    if (this._gauge != null)
      this._gauge.containerResized();
  }
  destroy() {
    this.prop.destroy();
    super.destroy();
    Object.entries(this).forEach((pair) => {
      Reflect.set(this, pair[0], null);
    });
  }
  contextMenuIsOpening() {
    YWebPage.snapshotMenuItem.userdata = this;
    YWebPage.snapshotMenuItem.visible = true;
    YWebPage.resetDataViewMenuItem.visible = false;
  }
  get confirmDeleteString() {
    return "Do you really want to delete this gauge ?";
  }
  AnnotationCallback(text) {
    let sensor = this.prop.DataSource_source;
    return this.PatchSensorAnnotationCallback(sensor, text);
  }
  SourceChanged(value, index) {
    this.noDataSourcepanel.enabled = value instanceof NullYSensor;
    if (value instanceof NullYSensor) {
      this._gauge.value = 0;
    } else {
      value.registerCallback(this);
    }
  }
  SensorValuecallback(source, M) {
    if (this.prop == null)
      return;
    if (source == this.prop.DataSource_source) {
      this._gauge.value = source.isOnline() ? M.get_averageValue() : 0;
    }
  }
};
gaugeWidget.AnnotationPanelCount = 0;
var angularGaugeWidget = class extends YWidget {
  constructor(node, editor, x, y, width, height) {
    super(node, editor, x, y, width, height);
    this._angularGauge = new YAngularGauge(this.UIContainer, YWidget.log);
    this._genRenderer = this._angularGauge;
    this.noDataSourcepanel = this._angularGauge.addMessagePanel();
    this.noDataSourcepanel.font.size = constants.generalFontSize;
    this.noDataSourcepanel.text = "No data source configured\n";
    this.prop = new AngularGaugeFormProperties(node, this);
    this._genProp = this.prop;
    let propDesc = GenericProperties.getAllProperties(this.prop);
    if (angularGaugeWidget.AnnotationPanelCount == 0) {
      for (let propname in propDesc.byName) {
        if (propname.startsWith("AngularGauge_annotationPanel"))
          angularGaugeWidget.AnnotationPanelCount++;
        if (propname.startsWith("AngularGauge_zone"))
          angularGaugeWidget.zonesCount++;
      }
    }
    for (let i = 0; i < angularGaugeWidget.zonesCount; i++) {
      this._angularGauge.AddZone();
    }
    for (let i = 0; i < angularGaugeWidget.AnnotationPanelCount; i++) {
      this._angularGauge.addAnnotationPanel();
    }
    this._angularGauge.setPatchAnnotationCallback((s) => {
      return this.AnnotationCallback(s);
    });
    this.initDataNode = node;
    this.updateWindowPositionProperties(this.prop);
    this.prop.ApplyAllProperties(this);
    YDataRenderer.minMaxCheckDisabled = true;
    this.prop.ApplyAllProperties(this._angularGauge);
    YDataRenderer.minMaxCheckDisabled = false;
    this._angularGauge.resetRefrenceSize();
    this._angularGauge.resizeRule = Proportional.ResizeRule.RELATIVETOBOTH;
    this.ApplyRelativeSizeIfRequired();
    this._angularGauge.AllowRedraw();
  }
  containerResized() {
    if (this._angularGauge != null)
      this._angularGauge.containerResized();
  }
  destroy() {
    this.prop.destroy();
    super.destroy();
    Object.entries(this).forEach((pair) => {
      Reflect.set(this, pair[0], null);
    });
  }
  AnnotationCallback(text) {
    let sensor = this.prop.DataSource_source;
    return this.PatchSensorAnnotationCallback(sensor, text);
  }
  contextMenuIsOpening() {
    YWebPage.snapshotMenuItem.userdata = this;
    YWebPage.snapshotMenuItem.visible = true;
    YWebPage.resetDataViewMenuItem.visible = false;
  }
  get confirmDeleteString() {
    return "Do you really want to delete this gauge ?";
  }
  showStatus(status) {
    if (status != "")
      this._angularGauge.value = 0;
    this._angularGauge.showNeedle = status == "";
    this._angularGauge.statusLine = status;
  }
  SourceChanged(value, index) {
    this._angularGauge.DisableRedraw();
    this.noDataSourcepanel.enabled = value instanceof NullYSensor;
    if (value instanceof NullYSensor) {
      this.showStatus("N/A");
      this._angularGauge.unit = "";
    } else if (!value.isOnline()) {
      this.showStatus("OFFLINE");
    } else {
      this.showStatus("");
      this._angularGauge.unit = value.get_unit();
    }
    this._angularGauge.AllowRedraw();
    value.registerCallback(this);
  }
  SensorValuecallback(source, M) {
    if (this.prop == null)
      return;
    if (source == this.prop.DataSource_source) {
      this._angularGauge.DisableRedraw();
      if (this.prop.DataSource_source instanceof NullYSensor) {
        this.showStatus("N/A");
        this._angularGauge.unit = "";
      } else if (!this.prop.DataSource_source.isOnline()) {
        this.showStatus("OFFLINE");
      } else {
        this._angularGauge.DisableRedraw();
        this.showStatus("");
        this._angularGauge.unit = source.get_unit();
        this._angularGauge.value = M.get_averageValue();
        this._angularGauge.AllowRedraw();
      }
      this._angularGauge.AllowRedraw();
    }
  }
};
angularGaugeWidget.AnnotationPanelCount = 0;
angularGaugeWidget.zonesCount = 0;
var digitalDisplayWidget = class extends YWidget {
  constructor(node, editor, x, y, width, height) {
    super(node, editor, x, y, width, height);
    this._unit = "";
    this._display = new YDigitalDisplay(this.UIContainer, YWidget.log);
    this._genRenderer = this._display;
    this.noDataSourcepanel = this._display.addMessagePanel();
    this.noDataSourcepanel.font.size = constants.generalFontSize;
    this.noDataSourcepanel.text = "No data source configured\n";
    this.prop = new digitalDisplayFormProperties(node, this);
    this._genProp = this.prop;
    let propDesc = GenericProperties.getAllProperties(this.prop);
    if (digitalDisplayWidget.AnnotationPanelCount == 0) {
      for (let propname in propDesc.byName) {
        if (propname.startsWith("display_annotationPanel"))
          digitalDisplayWidget.AnnotationPanelCount++;
      }
    }
    for (let i = 0; i < digitalDisplayWidget.AnnotationPanelCount; i++) {
      this._display.addAnnotationPanel();
    }
    this._display.setPatchAnnotationCallback((s) => {
      return this.AnnotationCallback(s);
    });
    this._display.valueFormater = (source, value) => {
      return this.valueFormater(source, value);
    };
    this.updateWindowPositionProperties(this.prop);
    this.prop.ApplyAllProperties(this);
    YDataRenderer.minMaxCheckDisabled = true;
    this.prop.ApplyAllProperties(this._display);
    YDataRenderer.minMaxCheckDisabled = false;
    this._display.resetRefrenceSize();
    this._display.AllowPrintScreenCapture = true;
    this._display.resetRefrenceSize();
    this._display.resizeRule = Proportional.ResizeRule.RELATIVETOBOTH;
    this.ApplyRelativeSizeIfRequired();
    this._display.AllowRedraw();
  }
  containerResized() {
    if (this._display != null)
      this._display.containerResized();
  }
  destroy() {
    this.prop.destroy();
    super.destroy();
    Object.entries(this).forEach((pair) => {
      Reflect.set(this, pair[0], null);
    });
  }
  AnnotationCallback(text) {
    let sensor = this.prop.DataSource_source;
    return this.PatchSensorAnnotationCallback(sensor, text);
  }
  contextMenuIsOpening() {
    YWebPage.snapshotMenuItem.userdata = this;
    YWebPage.snapshotMenuItem.visible = true;
    YWebPage.resetDataViewMenuItem.visible = false;
  }
  get confirmDeleteString() {
    return "Do you really want to delete this digital display ?";
  }
  valueFormater(source, value) {
    if (this.prop.DataSource_source instanceof NullYSensor) {
      return "N/A";
    } else if (!this.prop.DataSource_source.isOnline())
      return "OFFLINE";
    let format = this.prop.DataSource_precision;
    let p = format.indexOf(".");
    let n = 0;
    if (p >= 0)
      n = format.length - p - 1;
    let unit = this.prop.DataSource_source.get_unit();
    return value.toFixed(n) + unit;
  }
  SourceChanged(value, index) {
    this.noDataSourcepanel.enabled = value instanceof NullYSensor;
    this.SensorValuecallback(value, null);
    if (value instanceof NullYSensor) {
      this._display.alternateValue = "N/A";
    } else if (!value.isOnline())
      this._display.alternateValue = "OFFLINE";
    value.registerCallback(this);
  }
  SensorValuecallback(source, M) {
    if (this.prop == null)
      return;
    if (this.prop.DataSource_source instanceof NullYSensor) {
      this._display.alternateValue = "N/A";
    } else if (!this.prop.DataSource_source.isOnline()) {
      this._display.alternateValue = "OFFLINE";
    } else if (M == null) {
      this._display.alternateValue = "--" + this._unit;
    } else if (source == this.prop.DataSource_source) {
      this._display.DisableRedraw();
      this._display.alternateValue = null;
      this._display.value = M.get_averageValue();
      this._display.AllowRedraw();
    }
  }
};
digitalDisplayWidget.AnnotationPanelCount = 0;
var graphWidget = class extends YWidget {
  constructor(node, editor, x, y, width, height) {
    super(node, editor, x, y, width, height);
    this._graph = new YGraph(this.UIContainer, YWidget.log);
    this.noDataSourcepanel = this._graph.addMessagePanel();
    this.noDataSourcepanel.font.size = constants.generalFontSize;
    this.noDataSourcepanel.text = "No data source configured\n";
    this.dataloggerProgress = this._graph.addMessagePanel();
    this.dataloggerProgress.font.size = 12 * constants.guiDPIFactor;
    this.dataloggerProgress.font.color = YColor.DarkGray;
    this.dataloggerProgress.borderColor = YColor.Gray;
    this.dataloggerProgress.panelHrzAlign = MessagePanel.HorizontalAlignPos.LEFT;
    this.dataloggerProgress.panelVrtAlign = MessagePanel.VerticalAlignPos.TOP;
    this.dataloggerProgress.text = graphWidget.DataLoggerLoadingMsg;
    this.dataloggerProgress.enabled = false;
    this.prop = new GraphFormProperties(node, this);
    this._genProp = this.prop;
    let propDesc = GenericProperties.getAllProperties(this.prop);
    if (graphWidget.YAxisCount == 0) {
      for (let propname in propDesc.byName) {
        if (propname.startsWith("Graph_annotationPanel"))
          graphWidget.AnnotationPanelCount++;
        if (propname.startsWith("Graph_series"))
          graphWidget.SeriesCount++;
        if (propname.startsWith("Graph_yAxes"))
          graphWidget.YAxisCount++;
      }
    }
    if (graphWidget.ZoneCountPerYaxis == 0) {
      let yAxisProp = new YaxisDescription(0, false);
      let propDesc2 = GenericProperties.getAllProperties(yAxisProp);
      for (let propname in propDesc2.byName) {
        if (propname.startsWith("zones"))
          graphWidget.ZoneCountPerYaxis++;
      }
    }
    if (graphWidget.MarkerCountPerXaxis == 0) {
      let xAxisProp = new XaxisDescription();
      let propDesc2 = GenericProperties.getAllProperties(xAxisProp);
      for (let propname in propDesc2.byName) {
        if (propname.startsWith("markers"))
          graphWidget.MarkerCountPerXaxis++;
      }
    }
    this.offLineSourcesPanel = this._graph.addMessagePanel();
    this.offLineSourcesPanel.bgColor = YColor.FromArgb(192, 255, 192, 192);
    this.offLineSourcesPanel.borderColor = YColor.DarkRed;
    this.offLineSourcesPanel.font.color = YColor.DarkRed;
    this.offLineSourcesPanel.panelHrzAlign = MessagePanel.HorizontalAlignPos.RIGHT;
    this.offLineSourcesPanel.panelVrtAlign = MessagePanel.VerticalAlignPos.TOP;
    this.captureRunningPanel = this._graph.addMessagePanel();
    this.captureRunningPanel.bgColor = YColor.FromArgb(240, 200, 255, 193);
    this.captureRunningPanel.borderColor = YColor.DarkGreen;
    this.captureRunningPanel.font.color = YColor.DarkGreen;
    this.captureRunningPanel.panelHrzAlign = MessagePanel.HorizontalAlignPos.LEFT;
    this.captureRunningPanel.panelVrtAlign = MessagePanel.VerticalAlignPos.TOP;
    for (let i = 0; i < graphWidget.YAxisCount; i++) {
      let axis = this._graph.addYAxis();
      for (let j = 0; j < graphWidget.ZoneCountPerYaxis; j++) {
        axis.AddZone();
      }
    }
    this.markers = [];
    for (let i = 0; i < graphWidget.MarkerCountPerXaxis; i++) {
      let m = this._graph.xAxis.AddMarker();
      m.xposition = TimeConverter.ToUnixTime(new Date()) + i * 60;
      this.markers.push(m);
    }
    for (let i = 0; i < graphWidget.AnnotationPanelCount; i++) {
      this._graph.addAnnotationPanel();
    }
    this.seriesProperties = [];
    for (let i = 0; i < graphWidget.SeriesCount; i++) {
      this.seriesProperties.push(Reflect.get(this.prop, "Graph_series" + i.toString()));
      this._graph.addSerie();
    }
    this._graph.yAxes[0].visible = true;
    this._graph.setPatchAnnotationCallback((s) => {
      return this.AnnotationCallback(s);
    });
    this._genRenderer = this._graph;
    this._graph.resetRefrenceSize();
    this._graph.AllowPrintScreenCapture = true;
    this.offlineMessages = new Array(graphWidget.SeriesCount);
    this.showOffline = new Array(graphWidget.SeriesCount);
    this.updateWindowPositionProperties(this.prop);
    this.prop.ApplyAllProperties(this);
    YDataRenderer.minMaxCheckDisabled = true;
    this.prop.ApplyAllProperties(this._graph);
    YDataRenderer.minMaxCheckDisabled = false;
    for (let i = 0; i < graphWidget.YAxisCount; i++) {
      this._graph.yAxes[i].AxisChanged = () => {
        this.AxisParamtersChangedAutomatically(this._graph.yAxes[i]);
      };
      this._graph.yAxes[i].AllowAutoShow = true;
    }
    for (let i = 0; i < graphWidget.SeriesCount; i++) {
      let s = Reflect.get(this.prop, "Graph_series" + i.toString());
      s.Init(this, i);
      if (s.DataSource_source != null) {
        this.SourceChanged(s.DataSource_source, i);
      }
    }
    this._graph.resetRefrenceSize();
    this._graph.resizeRule = Proportional.ResizeRule.FIXED;
    this.ApplyRelativeSizeIfRequired();
    this._graph.AllowRedraw();
  }
  AnnotationCallback(text) {
    for (let i = 0; i < graphWidget.SeriesCount; i++) {
      let s = Reflect.get(this.prop, "Graph_series" + i.toString());
      let sensor = s.DataSource_source;
      let name = "None";
      let avgvalue = "N/A";
      let minvalue = "N/A";
      let maxvalue = "N/A";
      let unit = "";
      if (!(sensor instanceof NullYSensor)) {
        let resolution = -Math.round(Math.log10(sensor.get_resolution()));
        name = s.legend != "" ? s.legend : sensor.get_friendlyName();
        if (sensor.isOnline()) {
          avgvalue = sensor.get_lastAvgValue().toFixed(resolution);
          minvalue = sensor.get_lastMinValue().toFixed(resolution);
          maxvalue = sensor.get_lastMaxValue().toFixed(resolution);
        }
        unit = sensor.get_unit();
      }
      text = text.replace("$NAME" + (i + 1).toString() + "$", name);
      text = text.replace("$AVGVALUE" + (i + 1).toString() + "$", avgvalue);
      text = text.replace("$MAXVALUE" + (i + 1).toString() + "$", maxvalue);
      text = text.replace("$MINVALUE" + (i + 1).toString() + "$", minvalue);
      text = text.replace("$UNIT" + (i + 1).toString() + "$", unit);
    }
    return text;
  }
  destroy() {
    this.prop.destroy();
    super.destroy();
    Object.entries(this).forEach((pair) => {
      Reflect.set(this, pair[0], null);
    });
  }
  containerResized() {
    if (this._graph != null)
      this._graph.containerResized();
  }
  contextMenuIsOpening() {
    YWebPage.snapshotMenuItem.userdata = this;
    YWebPage.snapshotMenuItem.visible = true;
    YWebPage.resetDataViewMenuItem.visible = true;
    YWebPage.resetDataViewMenuItem.userdata = this;
  }
  startMarkerCapture(markerIndex) {
    this.markers[markerIndex].startCapture();
  }
  AxisParamtersChangedAutomatically(source) {
    let yaxis = source.userData;
    yaxis.visible = source.visible;
  }
  decomposeToSegments(data, start, dataCount) {
    let n1 = start;
    let n2 = 0;
    let l = [];
    let deltaT = 0;
    while (n1 < start + dataCount - 1) {
      try {
        deltaT = data[n1 + 1].DateTime - data[n1].DateTime;
      } catch (Exception) {
        debugger;
      }
      n2 = n1 + 1;
      while (n2 < dataCount && data[n2].DateTime - data[n2 - 1].DateTime < 2 * deltaT) {
        n2++;
      }
      let count = n2 - n1;
      if (count > 0) {
        let p = new Array(count);
        for (let i = 0; i < count; i++) {
          p[i] = new pointXY(data[n1 + i].DateTime, data[n1 + i].value);
        }
        l.push(p);
      }
      n1 = n2;
    }
    return l;
  }
  SourceChanged(value, index) {
    this._graph.DisableRedraw();
    let s;
    let noDataSource = true;
    for (let i = 0; i < graphWidget.SeriesCount; i++) {
      s = Reflect.get(this.prop, "Graph_series" + i.toString());
      if (!(s.DataSource_source instanceof NullYSensor))
        noDataSource = false;
    }
    this.noDataSourcepanel.enabled = noDataSource;
    if (value != null) {
      if (!(value instanceof NullYSensor)) {
        if (value.isOnline()) {
          this.showOffline[index] = false;
        } else {
          this.offlineMessages[index] = value.get_friendlyName() + " is OFFLINE";
          this.showOffline[index] = true;
          logForm.log(value.get_friendlyName() + " is OFFLINE");
        }
      } else {
        this.showOffline[index] = false;
      }
    } else {
      this.showOffline[index] = false;
    }
    this.updateOfflinePanel();
    this.preLoadSensorData(value, index);
    if (value)
      value.registerCallback(this);
    this._graph.AllowRedraw();
  }
  preLoadSensorData(value, index) {
    this.dataloggerProgress.text = graphWidget.DataLoggerLoadingMsg;
    if (value instanceof NullYSensor) {
      this._graph.series[index].clear();
      return;
    }
    this.dataloggerProgress.enabled = true;
    let s = Reflect.get(this.prop, "Graph_series" + index.toString());
    let data;
    switch (s.DataSource_datatype) {
      case 1:
        data = value.minData;
        break;
      case 2:
        data = value.maxData;
        break;
      default:
        data = value.curData;
        break;
    }
    let l = this.decomposeToSegments(data, 0, data.length);
    this._graph.series[index].clear();
    for (let i = l.length - 1; i >= 0; i--) {
      this._graph.series[index].InsertPoints(l[i]);
    }
  }
  updateOfflinePanel() {
    let message = "";
    for (let i = 0; i < graphWidget.SeriesCount; i++) {
      if (this.showOffline[i])
        message = message + (message != "" ? "\n" : "") + this.offlineMessages[i];
    }
    if (message == "" && this.offLineSourcesPanel.enabled)
      this.offLineSourcesPanel.enabled = false;
    if (message != "" && (this.offLineSourcesPanel.text != message || !this.offLineSourcesPanel.enabled)) {
      this.offLineSourcesPanel.text = message;
      this.offLineSourcesPanel.enabled = true;
    }
  }
  SensorValuecallback(source, M) {
    if (this.prop == null)
      return;
    for (let i = 0; i < graphWidget.SeriesCount; i++) {
      let s = this.seriesProperties[i];
      if (s.DataSource_source == source) {
        if (!s.DataSource_source.isOnline()) {
          this.offlineMessages[i] = s.DataSource_source.get_friendlyName() + " is OFFLINE";
          this.showOffline[i] = true;
          this.updateOfflinePanel();
          return;
        }
        this.showOffline[i] = false;
        this.updateOfflinePanel();
        let index = s.DataSource_source.curData.length - 1;
        if (index >= 0)
          switch (s.DataSource_datatype) {
            case 1:
              this._graph.series[i].AddPoint(new pointXY(s.DataSource_source.minData[index].DateTime, s.DataSource_source.minData[index].value));
              break;
            case 2:
              this._graph.series[i].AddPoint(new pointXY(s.DataSource_source.maxData[index].DateTime, s.DataSource_source.maxData[index].value));
              break;
            default:
              this._graph.series[i].AddPoint(new pointXY(s.DataSource_source.curData[index].DateTime, s.DataSource_source.curData[index].value));
              break;
          }
        this._graph.series[i].unit = s.DataSource_source.get_unit();
      }
    }
  }
  disableAllMarkers() {
    confirm.ask("Do you really want to disable all markers?", () => {
      for (let i = 0; i < this.markers.length; i++) {
        this.markers[i].enabled = false;
      }
    }, () => {
    }, null);
  }
  clearDataLogger() {
    confirm.ask("Do you really want to erase contents of all dataloggers related to this graph?", () => {
      this.startToClearDataLoggers();
    }, () => {
    }, null);
  }
  truncateView() {
    for (let i = 0; i < graphWidget.SeriesCount; i++) {
      this._graph.series[i].clear();
    }
    let FirstLiveValue = Math.floor(new Date().getTime() / 1e3);
    this._graph.xAxis.set_minMax(FirstLiveValue, FirstLiveValue + this._graph.xAxis.initialZoom);
  }
  resetDataView() {
    this.prop.Graph_showRecordedData = false;
    this.truncateView();
  }
  startToClearDataLoggers() {
    return __awaiter5(this, void 0, void 0, function* () {
      debugger;
      let loggers = [];
      for (let i = 0; i < graphWidget.SeriesCount; i++) {
        let s = Reflect.get(this.prop, "Graph_series" + i.toString());
        let sensor = s.DataSource_source;
        if (!(sensor instanceof NullYSensor)) {
          sensor.stopDataloggerloading();
          let serial = sensor.get_hardwareId();
          let n = serial.indexOf(".");
          serial = serial.substring(0, n);
          let d = yield YDataLogger.FindDataLogger(serial + ".dataLogger");
          if (yield d.isOnline()) {
            let found = false;
            for (let j = 0; j < loggers.length; j++) {
              if (loggers[j] == d)
                found = true;
            }
            if (!found)
              loggers.push(d);
          }
        }
      }
      for (let i = 0; i < loggers.length; i++) {
        yield loggers[i].forgetAllDataStreams();
        yield loggers[i].set_recording(YDataLogger.RECORDING_ON);
      }
      let tmp = this.prop.Graph_showRecordedData;
      this.prop.Graph_showRecordedData = false;
      this.truncateView();
      this.prop.Graph_showRecordedData = tmp;
    });
  }
  SensorNewDataBlock(source, sourceFromIndex, sourcetoIndex, targetIndex, fromDataLogger) {
    if (this.prop == null)
      return;
    if (fromDataLogger && !this.prop.Graph_showRecordedData)
      return;
    let l = null;
    for (let i = 0; i < graphWidget.SeriesCount; i++) {
      let s = Reflect.get(this.prop, "Graph_series" + i.toString());
      if (s.DataSource_source == source) {
        let count = sourcetoIndex - sourceFromIndex + 1;
        if (count > 1) {
          switch (s.DataSource_datatype) {
            case 1:
              l = this.decomposeToSegments(s.DataSource_source.minData, sourceFromIndex, count);
              for (let j = l.length - 1; j >= 0; j--) {
                this._graph.series[i].InsertPoints(l[j]);
              }
              break;
            case 2:
              l = this.decomposeToSegments(s.DataSource_source.maxData, sourceFromIndex, count);
              for (let j = l.length - 1; j >= 0; j--) {
                this._graph.series[i].InsertPoints(l[j]);
              }
              break;
            default:
              l = this.decomposeToSegments(s.DataSource_source.curData, sourceFromIndex, count);
              for (let j = l.length - 1; j >= 0; j--) {
                this._graph.series[i].InsertPoints(l[j]);
              }
              break;
          }
        }
      }
    }
  }
  showRecordedDatachanged() {
    if (this.prop == null)
      return;
    for (let i = 0; i < graphWidget.SeriesCount; i++) {
      let s = Reflect.get(this.prop, "Graph_series" + i.toString());
      this.SourceChanged(s.DataSource_source, i);
    }
  }
  DataLoggerProgress() {
    let progress = 0;
    let sensorCount = 0;
    if (!this.prop.Graph_showRecordedData) {
      this.dataloggerProgress.enabled = false;
      return;
    }
    let props = GenericProperties.getAllProperties(this.prop);
    for (let i = 0; i < props.byIndex.length; i++) {
      let name = props.byIndex[i].name;
      if (name.startsWith("Graph_series")) {
        let s = Reflect.get(this.prop, name);
        if (!(s.DataSource_source instanceof NullYSensor)) {
          progress += s.DataSource_source.getGetaLoadProgress();
          sensorCount++;
        }
      }
    }
    if (progress < 100 * sensorCount && sensorCount > 0) {
      this.dataloggerProgress.text = graphWidget.DataLoggerLoadingMsg + " (" + (progress / sensorCount).toFixed(0) + "%)";
    } else {
      this.dataloggerProgress.enabled = false;
    }
  }
  DataloggerCompleted(Source) {
    if (!this.prop.Graph_showRecordedData)
      return;
    this.dataloggerProgress.enabled = false;
    let props = GenericProperties.getAllProperties(this.prop);
    for (let i = 0; i < props.byIndex.length; i++) {
      let name = props.byIndex[i].name;
      if (name.startsWith("Graph_series")) {
        let s = Reflect.get(this.prop, name);
        if (s.DataSource_source == Source) {
          let index = parseInt(name.substring(12));
          this.SourceChanged(Source, index);
        }
      }
    }
  }
};
graphWidget.AnnotationPanelCount = 0;
graphWidget.SeriesCount = 0;
graphWidget.ZoneCountPerYaxis = 0;
graphWidget.MarkerCountPerXaxis = 0;
graphWidget.YAxisCount = 0;
graphWidget.DataLoggerLoadingMsg = "Loading from datalogger";

// obj/rdonly/propertiesMngmt.js
var YXmlNode = class {
  constructor(node) {
    this.node = node;
  }
  get Name() {
    return this.node.nodeName;
  }
  get_childsByName() {
    let res = {};
    this.node.childNodes.forEach((child) => {
      res[child.nodeName] = new YXmlNode(child);
    });
    return res;
  }
  get_childsByIndex() {
    let res = [];
    this.node.childNodes.forEach((child) => {
      res.push(new YXmlNode(child));
    });
    return res;
  }
  get_attributes() {
    let el = this.node;
    let res = {};
    let keys = el.getAttributeNames();
    for (let i = 0; i < keys.length; i++) {
      res[keys[i]] = el.getAttribute(keys[i]);
    }
    return res;
  }
  get Attributes() {
    return this.get_attributes();
  }
};
var PropertyAccess = class {
  constructor() {
    this.ttype = "";
    this.stype = "";
    this.finalTarget = null;
    this.terminalSource = null;
    this.propertyName = null;
  }
};
var doubleNan = class {
  constructor(v) {
    this._value = Number.NaN;
    if (typeof v == "undefined") {
      return;
    } else if (typeof v == "number") {
      this._value = v;
    } else if (typeof v == "string") {
      if (v == "") {
        this._value = Number.NaN;
      } else {
        this._value = Number(v);
      }
    } else {
      debugger;
    }
  }
  toString() {
    if (Number.isNaN(this._value))
      return "";
    return this._value.toString();
  }
  clone() {
    return new doubleNan(this.value);
  }
  get value() {
    return this._value;
  }
  set value(value) {
    this._value = value;
  }
};
var PropertyDescriptor = class {
  constructor(name) {
    this.isWritable = false;
    this.isEnum = false;
    this.type = "";
    this.Attributes = {};
    this.name = name;
  }
};
var PropertiesList = class {
  constructor() {
    this.byIndex = [];
    this.byName = {};
  }
};
var PropDescription = class {
  constructor(name, prop) {
    this.name = name;
    this.prop = prop;
  }
};
var GenericProperties = class {
  constructor(Owner) {
    this._Form_Text = "New window";
    this._Form_BackColor = YColor.FromArgb(255, 240, 240, 240);
    this._Form_BorderColor = YColor.LightGray;
    this._SizeIsRelative = false;
    this._Form_PositionX = 0;
    this._Form_PositionY = 0;
    this._Form_Width = 300;
    this._Form_Height = 200;
    this._containerID = "";
    this.ownerForm = Owner;
    this._Form_Text = "new window";
  }
  static NoFilter(propNname) {
    return true;
  }
  static escapeXml(unsafe) {
    return unsafe.replace(/[^ !#$%(-;=?-z]/g, (c) => "&#" + c.charCodeAt(0) + ";");
  }
  destroy() {
    Object.entries(this).forEach((pair) => {
      Reflect.set(this, pair[0], null);
    });
  }
  initFromXmlData(initData) {
    if (initData != null)
      this.loadProperties(initData, this.ownerForm, this);
  }
  loadProperties(initData, Owner, o) {
    let value;
    this.ownerForm = Owner;
    if (initData != null) {
      let properties = GenericProperties.getAllProperties(o);
      let childs = initData.get_childsByName();
      for (let propname in properties.byName) {
        let p = properties.byName[propname];
        if (p.isWritable) {
          for (let childName in childs) {
            if (childName == propname) {
              let target = Reflect.get(o, propname);
              let Mustload = true;
              if ("NotSavedInXMLAttribute" in p.Attributes) {
                Mustload = p.Attributes["NotSavedInXMLAttribute"];
              }
              if (Mustload) {
                if (GenericProperties.IsStructured(target)) {
                  this.loadProperties(childs[childName], Owner, target);
                } else {
                  let targetType = typeof target;
                  let attributes = childs[childName].get_attributes();
                  let value2 = attributes["value"];
                  if (target instanceof CustomYSensor) {
                    if (value2.toUpperCase() != "NULL" && value2 != "") {
                      let s = sensorsManager.AddNewSensor(value2);
                      Reflect.set(o, propname, s);
                    } else {
                      Reflect.set(o, propname, sensorsManager.getNullSensor());
                    }
                  } else if (target instanceof YEnumItem) {
                    Reflect.set(o, propname, target.fromString(value2));
                  } else if (target instanceof doubleNan) {
                    let d = new doubleNan(value2);
                    Reflect.set(o, propname, d);
                  } else if (target instanceof xAxisPosition) {
                    let xpos = Number(value2);
                    let rel = attributes["relative"].toUpperCase() == "TRUE";
                    Reflect.set(o, propname, new xAxisPosition(xpos, rel));
                  } else if (target instanceof YColor) {
                    let c = YColor.FromString(value2);
                    if (c == null)
                      c = YColor.Black;
                    Reflect.set(o, propname, c.clone());
                  } else if (target instanceof YFont) {
                    let size = attributes["size"];
                    let color = attributes["color"];
                    let italic = attributes["italic"];
                    let bold = attributes["bold"];
                    let f = Reflect.get(o, propname);
                    f.name = value2;
                    f.size = size !== "undefined" ? Number(size) : 10;
                    let c = YColor.FromString(color);
                    f.color = c != null ? c : YColor.Black.clone();
                    f.italic = italic.toUpperCase() == "TRUE";
                    f.bold = bold.toUpperCase() == "TRUE";
                  } else {
                    switch (targetType) {
                      case "string":
                        Reflect.set(o, propname, value2);
                        break;
                      case "number":
                        Reflect.set(o, propname, Number(value2));
                        break;
                      case "boolean":
                        let v = value2.toUpperCase() == "TRUE";
                        Reflect.set(o, propname, v);
                        break;
                      default:
                        debugger;
                        throw "unhandled target type : " + targetType + "(" + target.constructor.name + ")";
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  get ATTR_Form_Text__DisplayName() {
    return "Window title";
  }
  get ATTR_Form_Text__CategoryAttribute() {
    return "Window";
  }
  get ATTR_Form_Text__ChangeCausesParentRefreshAttribute() {
    return true;
  }
  get ATTR_Form_Text__DescriptionAttribute() {
    return "Widget name. This name is not show on display, but it might help you to identify each widget. ";
  }
  get Form_Text() {
    return this._Form_Text;
  }
  set Form_Text(value) {
    this._Form_Text = value;
  }
  get ATTR_Form_BackColor__DisplayName() {
    return "Background color";
  }
  get ATTR_Form_BackColor__CategoryAttribute() {
    return "Window";
  }
  get ATTR_Form_BackColor__DescriptionAttribute() {
    return "Window background color.";
  }
  get Form_BackColor() {
    return this._Form_BackColor;
  }
  set Form_BackColor(value) {
    this._Form_BackColor = value;
  }
  get ATTR_Form_BorderColor__DisplayName() {
    return "Border color";
  }
  get ATTR_Form_BorderColor__CategoryAttribute() {
    return "Window";
  }
  get ATTR_Form_BorderColor__DescriptionAttribute() {
    return "Window border color, use transparent color to hide the border.";
  }
  get Form_BorderColor() {
    return this._Form_BorderColor;
  }
  set Form_BorderColor(value) {
    this._Form_BorderColor = value;
  }
  get ATTR_Form_SizeIsRelative__NotSavedInXMLAttribute() {
    return true;
  }
  get ATTR_Form_SizeIsRelative__DisplayName() {
    return "Rel. size and pos.";
  }
  get ATTR_Form_SizeIsRelative__CategoryAttribute() {
    return "Window";
  }
  get ATTR_Form_SizeIsRelative__DescriptionAttribute() {
    return "Makes widget size and position relative to container size. This, for instance, allows to make a widget automatically occupy all of the browser viewport, no matter the browser window size. In relative mode, position and size value are expressed in %";
  }
  get ATTR_Form_SizeIsRelative__ChangeCausesParentRefreshAttribute() {
    return true;
  }
  get Form_SizeIsRelative() {
    return this._SizeIsRelative;
  }
  set Form_SizeIsRelative(value) {
    this._SizeIsRelative = value;
  }
  get ATTR_Form_PositionX__NotSavedInXMLAttribute() {
    return true;
  }
  get ATTR_Form_PositionX__DisplayName() {
    return "Left";
  }
  get ATTR_Form_PositionX__CategoryAttribute() {
    return "Window";
  }
  get ATTR_Form_PositionX__DescriptionAttribute() {
    return "Widget left border X position";
  }
  get Form_PositionX() {
    return this._Form_PositionX;
  }
  set Form_PositionX(value) {
    this._Form_PositionX = value;
  }
  get ATTR_Form_PositionY__NotSavedInXMLAttribute() {
    return true;
  }
  get ATTR_Form_PositionY__DisplayName() {
    return "Top";
  }
  get ATTR_Form_PositionY__CategoryAttribute() {
    return "Window";
  }
  get ATTR_Form_PositionY__DescriptionAttribute() {
    return "Widget top border Y position";
  }
  get Form_PositionY() {
    return this._Form_PositionY;
  }
  set Form_PositionY(value) {
    this._Form_PositionY = value;
  }
  get ATTR_Form_Width__NotSavedInXMLAttribute() {
    return true;
  }
  get ATTR_Form_Width__DisplayName() {
    return "Width";
  }
  get ATTR_Form_Width__CategoryAttribute() {
    return "Window";
  }
  get ATTR_Form_Width__DescriptionAttribute() {
    return "Widget width";
  }
  get Form_Width() {
    return this._Form_Width;
  }
  set Form_Width(value) {
    this._Form_Width = value;
  }
  get ATTR_Form_Height__NotSavedInXMLAttribute() {
    return true;
  }
  get ATTR_Form_Height__DisplayName() {
    return "Height";
  }
  get ATTR_Form_Height__CategoryAttribute() {
    return "Window";
  }
  get ATTR_Form_Height__DescriptionAttribute() {
    return "Widget height";
  }
  get Form_Height() {
    return this._Form_Height;
  }
  set Form_Height(value) {
    this._Form_Height = value;
  }
  get ATTR_Form_containerID__NotSavedInXMLAttribute() {
    return true;
  }
  get ATTR_Form_containerID__DisplayName() {
    return "Container ID";
  }
  get ATTR_Form_containerID__CategoryAttribute() {
    return "Window";
  }
  get ATTR_Form_containerID__DescriptionAttribute() {
    return "Forces the widget to be shown inside an HTML element with a specific ID already present on the page. If ID is empty, the widget is inserted at root level. Be aware that X,Y offsets are kept, you may want to set them to Zero. ";
  }
  get Form_containerID() {
    return this._containerID;
  }
  set Form_containerID(value) {
    this._containerID = value;
  }
  indent(n) {
    return " ".repeat(n);
  }
  static IsStructured(o) {
    if (o == null)
      return false;
    if (typeof o === "string" || o instanceof String)
      return false;
    if (typeof o === "number" || o instanceof Number)
      return false;
    if (typeof o === "boolean" || o instanceof Boolean)
      return false;
    if (o instanceof YEnumItem)
      return false;
    if (o instanceof CustomYSensor)
      return false;
    if (o instanceof YColor)
      return false;
    if (o instanceof doubleNan)
      return false;
    if (o instanceof xAxisPosition)
      return false;
    if (Object.getOwnPropertyNames(o).length > 0)
      return true;
    return false;
  }
  static getObjectFromPath(rootTarget, path) {
    let FinalTarget = rootTarget;
    for (let i = 0; i < path.length - 1; i++) {
      let name = path[i];
      let index = "";
      while (name.charCodeAt(name.length - 1) >= 48 && name.charCodeAt(name.length - 1) <= 57) {
        index = name.charAt(name.length - 1) + index;
        name = name.substring(0, name.length - 1);
      }
      if (index == "") {
        FinalTarget = Reflect.get(FinalTarget, name);
      } else {
        let arrayObject = Reflect.get(FinalTarget, name);
        FinalTarget = Reflect.get(arrayObject, parseInt(index));
      }
    }
    return FinalTarget;
  }
  static computePropertyAccess_SFT(WidgetObject, SettingObject, propertySourceName, path) {
    let res = new PropertyAccess();
    res.ttype = "";
    res.stype = "";
    res.finalTarget = null;
    res.terminalSource = null;
    res.terminalSource = GenericProperties.getObjectFromPath(WidgetObject, path);
    let props = GenericProperties.getAllProperties(res.terminalSource);
    if (!(path[path.length - 1] in props.byName))
      return res;
    res.stype = typeof res.terminalSource[path[path.length - 1]];
    if (res.stype == "object" && res.terminalSource[path[path.length - 1]] != null) {
      res.stype = res.terminalSource[path[path.length - 1]].constructor.name;
    }
    res.terminalSource = res.terminalSource[path[path.length - 1]];
    if (res.terminalSource == null)
      return res;
    res.propertyName = propertySourceName;
    res.finalTarget = SettingObject;
    let o = res.finalTarget[propertySourceName];
    res.ttype = typeof o;
    if (res.ttype == "object" && o != null)
      res.ttype = o.constructor.name;
    if (path.length <= 1)
      return res;
    for (let i = 1; i < path.length; i++) {
      res.finalTarget = res.finalTarget[res.propertyName];
      res.propertyName = path[i];
    }
    res.ttype = typeof res.finalTarget[res.propertyName];
    if (res.ttype == "object" && res.finalTarget[res.propertyName] != null)
      res.ttype = res.finalTarget[res.propertyName].constructor.name;
    return res;
  }
  static Reflect_getIndexed(o, indexedProp) {
    let res = Reflect.get(o, indexedProp);
    if (typeof res !== "undefined")
      return res;
    let name = indexedProp;
    let index = "";
    while (name.charCodeAt(name.length - 1) >= 48 && name.charCodeAt(name.length - 1) <= 57) {
      index = name.charAt(name.length - 1) + index;
      name = name.substring(0, name.length - 1);
    }
    if (index == "") {
      return null;
    }
    res = Reflect.get(o, name);
    return Reflect.get(res, parseInt(index));
  }
  static computePropertyAccess(rootTarget, source, propertySourceName, path) {
    let res = new PropertyAccess();
    res.ttype = "";
    res.finalTarget = GenericProperties.getObjectFromPath(rootTarget, path);
    res.terminalSource = source;
    res.terminalSource = Reflect.get(res.terminalSource, propertySourceName);
    for (let i = 1; i < path.length; i++) {
      res.terminalSource = Reflect.get(res.terminalSource, path[i]);
    }
    res.stype = typeof res.terminalSource;
    if (res.stype == "object")
      res.stype = res.terminalSource.constructor.name;
    if (path.length > 0) {
      res.propertyName = path[path.length - 1];
      let o = GenericProperties.Reflect_getIndexed(rootTarget, path[0]);
      if (o == null)
        return null;
      for (let i = 1; i < path.length; i++) {
        try {
          o = GenericProperties.Reflect_getIndexed(o, path[i]);
        } catch (e) {
          debugger;
        }
      }
      res.ttype = typeof o;
      if (res.ttype == "object")
        res.ttype = o.constructor.name;
    } else {
      let targetname = propertySourceName;
      let n = targetname.indexOf("__");
      res.propertyName = targetname.substring(n + 2);
      let o = Reflect.get(rootTarget, res.propertyName);
      res.ttype = typeof o;
      if (res.ttype == "object")
        res.ttype = o.constructor.name;
    }
    return res;
  }
  static newGetProperty(rootTarget, source, propertySourceName, path, filterAllow) {
    let access = GenericProperties.computePropertyAccess(rootTarget, source, propertySourceName, path);
    if (access == null)
      return null;
    return Reflect.get(access.finalTarget, access.propertyName);
  }
  static copyProperty_SFT(rootTarget, source, propertySourceName, path, filterAllow) {
    let ttype = "";
    let stype = "";
    let TerminalSource = null;
    let p = GenericProperties.computePropertyAccess_SFT(rootTarget, source, propertySourceName, path);
    if (p.finalTarget == null)
      return;
    ttype = p.ttype;
    stype = p.stype;
    if (stype == YColor.name && ttype == YColor.name) {
      Reflect.set(p.finalTarget, p.propertyName, p.terminalSource.clone());
    } else if (stype == xAxisPosition.name && ttype == xAxisPosition.name) {
      Reflect.set(p.finalTarget, p.propertyName, p.terminalSource.clone());
    } else if (p.stype == "number" && ttype == doubleNan.name) {
      Reflect.set(p.finalTarget, p.propertyName, new doubleNan(p.terminalSource));
    } else {
      Reflect.set(p.finalTarget, p.propertyName, p.terminalSource);
    }
  }
  static copyProperty_STT(rootTarget, source, propertySourceName, path, filterAllow) {
    let p = GenericProperties.computePropertyAccess(rootTarget, source, propertySourceName, path);
    if (p == null)
      return;
    if (p.stype == doubleNan.name && p.ttype == "number") {
      let v = p.terminalSource.value;
      if (Reflect.get(p.finalTarget, p.propertyName) != v) {
        Reflect.set(p.finalTarget, p.propertyName, v);
      }
    } else if (p.stype != p.ttype) {
      debugger;
    } else if (p.stype == YColor.name && p.ttype == YColor.name) {
      let color = p.terminalSource;
      if (!color.equal(Reflect.get(p.finalTarget, p.propertyName))) {
        Reflect.set(p.finalTarget, p.propertyName, color.clone());
      }
    } else if (p.stype == doubleNan.name && p.ttype == doubleNan.name) {
      let v = p.terminalSource;
      if (Reflect.get(p.finalTarget, p.propertyName) != v) {
        Reflect.set(p.finalTarget, p.propertyName, v.clone());
      }
    } else if (p.stype == xAxisPosition.name && p.ttype == xAxisPosition.name) {
      let x = p.terminalSource;
      let x2 = Reflect.get(p.finalTarget, p.propertyName);
      if (x.relative != x2.relative || x.value != x2.value) {
        Reflect.set(p.finalTarget, p.propertyName, x.clone());
      }
    } else if (Reflect.get(p.finalTarget, p.propertyName) != p.terminalSource) {
      Reflect.set(p.finalTarget, p.propertyName, p.terminalSource);
    }
  }
  ApplyAllProperties(target) {
    this.ApplyAllPropertiesEx(target, GenericProperties.NoFilter, 0);
  }
  RefreshAllProperties(target) {
    this.ApplyAllPropertiesEx(target, GenericProperties.NoFilter, 1);
  }
  ApplyProperties(rootSource, rootTarget, fullpropname, sourceValue, path, direction) {
    if (sourceValue instanceof AlarmSection)
      return;
    let sourceproperties = GenericProperties.getAllProperties(this);
    if ("CopyToTarget" in sourceproperties.byName[fullpropname].Attributes) {
      if (!sourceproperties.byName[fullpropname].Attributes["CopyToTarget"]) {
        return;
      }
    }
    if (!GenericProperties.IsStructured(sourceValue)) {
      if (direction == 0) {
        GenericProperties.copyProperty_STT(rootTarget, this, fullpropname, path);
      } else {
        GenericProperties.copyProperty_SFT(rootTarget, this, fullpropname, path);
      }
    } else {
      let path2 = path.slice();
      path2.push("");
      let target = GenericProperties.getObjectFromPath(rootTarget, path2);
      Reflect.set(target, "userData", sourceValue);
      let sourceproperties2 = GenericProperties.getAllProperties(sourceValue);
      for (let subpropname in sourceproperties2.byName) {
        let shouldcopy = true;
        if ("CopyToTarget" in sourceproperties2.byName[subpropname].Attributes) {
          shouldcopy = sourceproperties2.byName[subpropname].Attributes["CopyToTarget"];
        }
        if (sourceproperties2.byName[subpropname].isWritable && shouldcopy) {
          path.push(subpropname);
          this.ApplyProperties(rootSource, rootTarget, fullpropname, Reflect.get(sourceValue, subpropname), path, direction);
          path.splice(path.length - 1, 1);
        }
      }
    }
  }
  static isProperty(proto, propName) {
    let d = Reflect.getOwnPropertyDescriptor(proto, propName);
    let list = Object.getOwnPropertyNames(d);
    for (let i = 0; i < list.length; i++) {
      if (list[i] == "set")
        return true;
      if (list[i] == "get")
        return true;
    }
    return false;
  }
  static isWritable(proto, propName) {
    let d = Reflect.getOwnPropertyDescriptor(proto, propName);
    let list = Object.getOwnPropertyNames(d);
    for (let i = 0; i < list.length; i++) {
      if (list[i] == "set") {
        if (typeof d.set !== "undefined")
          return true;
      }
    }
    return false;
  }
  static getAllProperties(o) {
    if (typeof o === "undefined")
      debugger;
    if (o.hasOwnProperty("PropertiesDescriptionCache")) {
      return o["PropertiesDescriptionCache"];
    }
    let proto = Object.getPrototypeOf(o);
    let res = new PropertiesList();
    let p = proto;
    let entries = [];
    let genealogy = [];
    while (p != null) {
      genealogy.push(p);
      p = Object.getPrototypeOf(p);
    }
    for (let j = genealogy.length - 1; j >= 0; j--) {
      let names = Object.getOwnPropertyNames(genealogy[j]);
      let index = 0;
      for (let i = 0; i < names.length; i++) {
        if (names[i] != "constructor" && !names[i].startsWith("__")) {
          entries.splice(index, 0, new PropDescription(names[i], genealogy[j]));
          index++;
          for (let k = entries.length - 1; k >= index; k--) {
            if (entries[k].name == names[i])
              entries.splice(k, 1);
          }
        }
      }
    }
    for (let i = 0; i < entries.length; i++) {
      if (!entries[i].name.startsWith("ATTR") && entries[i].name != "constructor" && !entries[i].name.startsWith("__")) {
        if (GenericProperties.isProperty(entries[i].prop, entries[i].name)) {
          let d = new PropertyDescriptor(entries[i].name);
          res.byIndex.push(d);
          res.byName[d.name] = d;
          d.isWritable = GenericProperties.isWritable(entries[i].prop, entries[i].name);
          d.isEnum = o[entries[i].name] instanceof YEnumItem;
          d.type = typeof o[entries[i].name];
          if (d.type == "object" && o[entries[i].name] != null) {
            d.type = o[entries[i].name].constructor.name;
          }
        }
      }
    }
    for (let i = 0; i < entries.length; i++) {
      if (entries[i].name.startsWith("ATTR_")) {
        let p2 = entries[i].name.indexOf("__");
        if (p2 < 5)
          debugger;
        let name = entries[i].name.substring(5, p2);
        let attr = entries[i].name.substring(p2 + 2);
        if (typeof res.byName[name] === "undefined")
          debugger;
        try {
          res.byName[name].Attributes[attr] = Reflect.get(o, entries[i].name);
        } catch (e) {
          debugger;
        }
      }
    }
    o["PropertiesDescriptionCache"] = res;
    return res;
  }
  ApplyAllPropertiesEx(target, filter, direction) {
    let properties = GenericProperties.getAllProperties(this);
    for (let fullpropname in properties.byName) {
      if (properties.byName[fullpropname].isWritable) {
        let index = fullpropname.indexOf("_");
        if (index < 0)
          throw "invalid Property name";
        let propType = fullpropname.substring(0, index);
        let propname = fullpropname.substring(index + 1);
        let path = [];
        path.push(propname);
        if (target instanceof YWidget && propType == "Form") {
          this.ApplyProperties(this, target, fullpropname, Reflect.get(this, fullpropname), path, direction);
        }
        if (target instanceof YAngularGauge && propType == "AngularGauge") {
          this.ApplyProperties(this, target, fullpropname, Reflect.get(this, fullpropname), path, direction);
        }
        if (target instanceof YDigitalDisplay && propType == "display") {
          this.ApplyProperties(this, target, fullpropname, Reflect.get(this, fullpropname), path, direction);
        }
        if (target instanceof YSolidGauge && propType == "SolidGauge") {
          this.ApplyProperties(this, target, fullpropname, Reflect.get(this, fullpropname), path, direction);
        }
        if (target instanceof YGraph && propType == "Graph") {
          this.ApplyProperties(this, target, fullpropname, Reflect.get(this, fullpropname), path, direction);
        }
      }
    }
  }
};
GenericProperties.XmlFileVersion = -1;

// obj/rdonly/properties.js
var GenericHints = class {
};
GenericHints.DevConfAffected = " Changing this value will affect the device configuration.";
GenericHints.CheckSensor = "If the sensor you want to use is connected, but not listed or listed as OFFLINE, check USB / Network configuration in the global configuration.";
GenericHints.AnnotationGraph = "Annotation text.  Use \\n for carriage returns. Some variables are available: $DAY$ $MONTH$ $YEAR$ for date, $HOUR$ $MINUTE$ $SECOND$ for time, $AVGVALUE1$ $MINVALUE1$ $MAXVALUE1$ $NAME1$ $UNIT1$  for first series data, $AVGVALUE2$ $MINVALUE2$ $MAXVALUE2$ $NAME2$ $UNIT2$  for second series data and so on";
GenericHints.Annotation = "Annotation text.  Use \\n for carriage returns. Some variables are available: $DAY$ $MONTH$ $YEAR$ for date, $HOUR$ $MINUTE$ $SECOND$ for time, $AVGVALUE$ $MINVALUE$ $MAXVALUE$ $NAME$ $UNIT$ for sensor related data.";
var TypeDescription = class {
  static get AllowedValues() {
    return [];
  }
};
var sensorFreqTypeDescription = class {
  static get AllowedValues() {
    return this._AllowedValues;
  }
};
sensorFreqTypeDescription._AllowedValues = [
  "25/s",
  "10/s",
  "5/s",
  "4/s",
  "3/s",
  "2/s",
  "1/s",
  "60/m",
  "30/m",
  "12/m",
  "6/m",
  "4/m",
  "3/m",
  "2/m",
  "1/m",
  "30/h",
  "12/h",
  "6/h",
  "4/h",
  "3/h",
  "2/h",
  "1/h"
];
var yAxisDescription = class {
  static initialize() {
    let yaxiscount = 0;
    let obj = new GraphFormProperties(null, null);
    let names = Object.getOwnPropertyNames(obj);
    names.forEach((name) => {
      if (name.startsWith("_Graph_yAxes"))
        yaxiscount++;
    });
    for (let i = 0; i < yaxiscount; i++) {
      switch (i) {
        case 0:
          this._AllowedValues.push("1srt Y axis");
          break;
        case 1:
          this._AllowedValues.push("2nd Y axis");
          break;
        case 2:
          this._AllowedValues.push("3rd Y axis");
          break;
        default:
          this._AllowedValues.push((i + 1).toString() + "th Y axis");
          break;
      }
    }
    yAxisDescription.initialized = true;
  }
  static get AllowedValues() {
    if (!yAxisDescription.initialized)
      yAxisDescription.initialize();
    return this._AllowedValues;
  }
};
yAxisDescription._AllowedValues = [];
var AlarmTestTypeDescription = class {
  static get AllowedValues() {
    return this._AllowedValues;
  }
};
AlarmTestTypeDescription._AllowedValues = ["Disabled", ">", ">=", "=", "<=", "<"];
var fontNameTypeDescription = class {
  static fontNameTypeDescription() {
  }
  static get AllowedValues() {
    return this._AllowedValues;
  }
};
fontNameTypeDescription._AllowedValues = [
  "Arial",
  "Brush Script MT",
  "Comic Sans MS",
  "Courier New",
  "Garamond",
  "Georgia",
  "Helvetica",
  "Impact",
  "Tahoma",
  "Times New Roman",
  "Trebuchet MS",
  "Verdana"
];
var sensorPrecisionTypeDescription = class {
  static get AllowedValues() {
    return this._AllowedValues;
  }
};
sensorPrecisionTypeDescription._AllowedValues = ["0", "0.1", "0.12", "0.123"];
var sensorDataTypeDescription = class {
  static get AllowedValues() {
    return this._AllowedValues;
  }
};
sensorDataTypeDescription._AllowedValues = ["Avg values", "Min values", "Max values"];
var GaugeFormProperties = class extends GenericProperties {
  constructor(initData, owner) {
    super(owner);
    this._DataSource_source = sensorsManager.getNullSensor();
    this._DataSource_precision = "0.1";
    this._DataSource_AlarmSection0 = new AlarmSection(0);
    this._DataSource_AlarmSection1 = new AlarmSection(1);
    this._SolidGauge_min = 0;
    this._SolidGauge_max = 100;
    this._SolidGauge_showMinMax = true;
    this._SolidGauge_color1 = YColor.LightGreen;
    this._SolidGauge_color2 = YColor.Red;
    this._SolidGauge_font = new FontDescription("Arial", 20, YColor.Black, false, true);
    this._SolidGauge_minMaxFont = new FontDescription("Arial", 10, YColor.Black, false, true);
    this._SolidGauge_displayMode = YSolidGauge.DisplayMode.DISPLAY90;
    this._SolidGauge_borderColor = YColor.Black;
    this._SolidGauge_borderThickness = 2;
    this._SolidGauge_backgroundColor1 = YColor.FromArgb(255, 240, 240, 240);
    this._SolidGauge_backgroundColor2 = YColor.FromArgb(255, 200, 200, 200);
    this._SolidGauge_thickness = 25;
    this._SolidGauge_maxSpeed = 1;
    this._annotationPanels0 = new AnnotationPanelDescription(GenericPanel.HorizontalAlignPos.CENTER, GenericPanel.VerticalAlignPos.BOTTOM, 0, false, "$NAME$", YColor.FromArgb(0, 127, 127, 127), YColor.FromArgb(0, 127, 127, 127), 10, YColor.FromArgb(255, 0, 0, 0));
    this._annotationPanels1 = new AnnotationPanelDescription(GenericPanel.HorizontalAlignPos.CENTER, GenericPanel.VerticalAlignPos.BOTTOM, 0, false, "$NAME$", YColor.FromArgb(0, 127, 127, 127), YColor.FromArgb(0, 127, 127, 127), 10, YColor.FromArgb(255, 0, 0, 0));
    this.initFromXmlData(initData);
    this.PropagateDataSourceChange();
  }
  PropagateDataSourceChange() {
    this.ownerForm.SourceChanged(this._DataSource_source, 0);
    let props = GenericProperties.getAllProperties(this).byName;
    let name;
    for (name in props) {
      if (name.startsWith("DataSource_AlarmSection")) {
        this[name].setDataSource(this._DataSource_source);
      }
    }
  }
  get ATTR_DataSource_source__DisplayName() {
    return "Sensor";
  }
  get ATTR_DataSource_source__CategoryAttribute() {
    return "Data source";
  }
  get ATTR_DataSource_source__ParamCategorySummaryAttribute() {
    return "sensorDescription";
  }
  get ATTR_DataSource_source__PreExpandedCategoryAttribute() {
    return true;
  }
  get ATTR_DataSource_source__ChangeCausesParentRefreshAttribute() {
    return true;
  }
  get ATTR_DataSource_source__DescriptionAttribute() {
    return "Yoctopuce sensor feeding the gauge. ";
  }
  get DataSource_source() {
    return this._DataSource_source;
  }
  set DataSource_source(value) {
    let prev = this._DataSource_source;
    this._DataSource_source = value;
    this.PropagateDataSourceChange();
  }
  get sensorDescription() {
    return this._DataSource_source instanceof NullYSensor ? "none" : this._DataSource_source.get_friendlyName();
  }
  get isSensorReadOnly() {
    return this._DataSource_source.isReadOnly;
  }
  get ATTR_DataSource_freq__DisplayName() {
    return "Sensor freq";
  }
  get ATTR_DataSource_freq__CategoryAttribute() {
    return "Data source";
  }
  get ATTR_DataSource_freq__NotSavedInXMLAttribute() {
    return true;
  }
  get ATTR_DataSource_freq__IsReadonlyCallAttribute() {
    return this.isSensorReadOnly;
  }
  get ATTR_DataSource_freq__AllowedValues() {
    return sensorFreqTypeDescription.AllowedValues;
  }
  get ATTR_DataSource_freq__DescriptionAttribute() {
    return "Sensor data acquisition frequency." + GenericHints.DevConfAffected;
  }
  get DataSource_freq() {
    return this._DataSource_source.get_frequency();
  }
  set DataSource_freq(value) {
    this._DataSource_source.set_frequency(value);
  }
  get ATTR_DataSource_precision__DisplayName() {
    return "Precision";
  }
  get ATTR_DataSource_precision__CategoryAttribute() {
    return "Data source";
  }
  get ATTR_DataSource_precision__DescriptionAttribute() {
    return "How many digits shown after the decimal point";
  }
  get ATTR_DataSource_precision__AllowedValues() {
    return sensorPrecisionTypeDescription.AllowedValues;
  }
  get DataSource_precision() {
    return this._DataSource_precision;
  }
  set DataSource_precision(value) {
    this._DataSource_precision = value;
  }
  get ATTR_DataSource_AlarmSection0__DisplayName() {
    return "Sensor value alarm 1";
  }
  get ATTR_DataSource_AlarmSection0__NotSavedInXMLAttribute() {
    return true;
  }
  get ATTR_DataSource_AlarmSection0__ReadOnlyAttribute() {
    return true;
  }
  get ATTR_DataSource_AlarmSection0__CategoryAttribute() {
    return "Data source";
  }
  get ATTR_DataSource_AlarmSection0__DescriptionAttribute() {
    return "Alarm 1 for this data source, expand for more.";
  }
  get DataSource_AlarmSection0() {
    return this._DataSource_AlarmSection0;
  }
  set DataSource_AlarmSection0(value) {
    this._DataSource_AlarmSection0 = value;
  }
  get ATTR_DataSource_AlarmSection1__DisplayName() {
    return "Sensor value alarm 2";
  }
  get ATTR_DataSource_AlarmSection1__NotSavedInXMLAttribute() {
    return true;
  }
  get ATTR_DataSource_AlarmSection1__ReadOnlyAttribute() {
    return true;
  }
  get ATTR_DataSource_AlarmSection1__CategoryAttribute() {
    return "Data source";
  }
  get ATTR_DataSource_AlarmSection1__DescriptionAttribute() {
    return "Alarm 2 for this data source, expand for more.";
  }
  get DataSource_AlarmSection1() {
    return this._DataSource_AlarmSection1;
  }
  set DataSource_AlarmSection1(value) {
    this._DataSource_AlarmSection1 = value;
  }
  get ATTR_SolidGauge_min__DisplayName() {
    return "Minimum value";
  }
  get ATTR_SolidGauge_min__CategoryAttribute() {
    return "Values range";
  }
  get ATTR_SolidGauge_min__DescriptionAttribute() {
    return "Minimum value displayable by the gauge.";
  }
  get SolidGauge_min() {
    return this._SolidGauge_min;
  }
  set SolidGauge_min(value) {
    this._SolidGauge_min = value;
  }
  get ATTR_SolidGauge_max__DisplayName() {
    return "Maximum value";
  }
  get ATTR_SolidGauge_max__CategoryAttribute() {
    return "Values range";
  }
  get ATTR_SolidGauge_max__DescriptionAttribute() {
    return "Maximum value displayable by the gauge.";
  }
  get SolidGauge_max() {
    return this._SolidGauge_max;
  }
  set SolidGauge_max(value) {
    this._SolidGauge_max = value;
  }
  get ATTR_SolidGauge_showMinMax__DisplayName() {
    return "show  min/max";
  }
  get ATTR_SolidGauge_showMinMax__CategoryAttribute() {
    return "Values range";
  }
  get ATTR_SolidGauge_showMinMax__DescriptionAttribute() {
    return "Show the min / max values.";
  }
  get SolidGauge_showMinMax() {
    return this._SolidGauge_showMinMax;
  }
  set SolidGauge_showMinMax(value) {
    this._SolidGauge_showMinMax = value;
  }
  get ATTR_SolidGauge_color1__DisplayName() {
    return "Min Color";
  }
  get ATTR_SolidGauge_color1__CategoryAttribute() {
    return "Values range";
  }
  get ATTR_SolidGauge_color1__DescriptionAttribute() {
    return "Color for minimum value.";
  }
  get SolidGauge_color1() {
    return this._SolidGauge_color1;
  }
  set SolidGauge_color1(value) {
    this._SolidGauge_color1 = value;
  }
  get ATTR_SolidGauge_color2__DisplayName() {
    return "Max Color";
  }
  get ATTR_SolidGauge_color2__CategoryAttribute() {
    return "Values range";
  }
  get ATTR_SolidGauge_color2__DescriptionAttribute() {
    return "Color for maximum value.";
  }
  get SolidGauge_color2() {
    return this._SolidGauge_color2;
  }
  set SolidGauge_color2(value) {
    this._SolidGauge_color2 = value;
  }
  get ATTR_SolidGauge_font__DisplayName() {
    return "Unit  Font";
  }
  get ATTR_SolidGauge_font__CategoryAttribute() {
    return "Fonts";
  }
  get ATTR_SolidGauge_font__ReadOnlyAttribute() {
    return true;
  }
  get ATTR_SolidGauge_font__DescriptionAttribute() {
    return "Font for displaying the value/status indicator";
  }
  get SolidGauge_font() {
    return this._SolidGauge_font;
  }
  set SolidGauge_font(value) {
    this._SolidGauge_font = value;
  }
  get ATTR_SolidGauge_minMaxFont__DisplayName() {
    return "Min Max  Font";
  }
  get ATTR_SolidGauge_minMaxFont__CategoryAttribute() {
    return "Fonts";
  }
  get ATTR_SolidGauge_minMaxFont__ReadOnlyAttribute() {
    return true;
  }
  get ATTR_SolidGauge_minMaxFont__DescriptionAttribute() {
    return "Font for displaying min/max values";
  }
  get SolidGauge_minMaxFont() {
    return this._SolidGauge_minMaxFont;
  }
  set SolidGauge_minMaxFont(value) {
    this._SolidGauge_minMaxFont = value;
  }
  get ATTR_SolidGauge_displayMode__DisplayName() {
    return "Display mode";
  }
  get ATTR_SolidGauge_displayMode__CategoryAttribute() {
    return "Dial";
  }
  get ATTR_SolidGauge_displayMode__DescriptionAttribute() {
    return "Dial general shape";
  }
  get SolidGauge_displayMode() {
    return this._SolidGauge_displayMode;
  }
  set SolidGauge_displayMode(value) {
    this._SolidGauge_displayMode = value;
  }
  get ATTR_SolidGauge_borderColor__DisplayName() {
    return "Border color";
  }
  get ATTR_SolidGauge_borderColor__CategoryAttribute() {
    return "Dial";
  }
  get ATTR_SolidGauge_borderColor__DescriptionAttribute() {
    return "Dial border color.";
  }
  get SolidGauge_borderColor() {
    return this._SolidGauge_borderColor;
  }
  set SolidGauge_borderColor(value) {
    this._SolidGauge_borderColor = value;
  }
  get ATTR_SolidGauge_borderThickness__DisplayName() {
    return "Border thickness ";
  }
  get ATTR_SolidGauge_borderThickness__CategoryAttribute() {
    return "Dial";
  }
  get ATTR_SolidGauge_borderThickness__DescriptionAttribute() {
    return "Thickness of the dial border";
  }
  get SolidGauge_borderThickness() {
    return this._SolidGauge_borderThickness;
  }
  set SolidGauge_borderThickness(value) {
    this._SolidGauge_borderThickness = value;
  }
  get ATTR_SolidGauge_backgroundColor1__DisplayName() {
    return "Background color 1";
  }
  get ATTR_SolidGauge_backgroundColor1__CategoryAttribute() {
    return "Dial";
  }
  get ATTR_SolidGauge_backgroundColor1__DescriptionAttribute() {
    return "Dial background gradient color 1.";
  }
  get SolidGauge_backgroundColor1() {
    return this._SolidGauge_backgroundColor1;
  }
  set SolidGauge_backgroundColor1(value) {
    this._SolidGauge_backgroundColor1 = value;
  }
  get ATTR_SolidGauge_backgroundColor2__DisplayName() {
    return "Background color 2";
  }
  get ATTR_SolidGauge_backgroundColor2__CategoryAttribute() {
    return "Dial";
  }
  get ATTR_SolidGauge_backgroundColor2__DescriptionAttribute() {
    return "Dial background gradient color 2.";
  }
  get SolidGauge_backgroundColor2() {
    return this._SolidGauge_backgroundColor2;
  }
  set SolidGauge_backgroundColor2(value) {
    this._SolidGauge_backgroundColor2 = value;
  }
  get ATTR_SolidGauge_thickness__DisplayName() {
    return "Dial thickness (%) ";
  }
  get ATTR_SolidGauge_thickness__CategoryAttribute() {
    return "Dial";
  }
  get ATTR_SolidGauge_thickness__DescriptionAttribute() {
    return "Thickness of the dial, in percentage relative to radius";
  }
  get SolidGauge_thickness() {
    return this._SolidGauge_thickness;
  }
  set SolidGauge_thickness(value) {
    this._SolidGauge_thickness = value;
  }
  get ATTR_SolidGauge_maxSpeed__DisplayName() {
    return "Max speed (%) ";
  }
  get ATTR_SolidGauge_maxSpeed__CategoryAttribute() {
    return "Dial";
  }
  get ATTR_SolidGauge_maxSpeed__DescriptionAttribute() {
    return 'Maximum speed of the dial in percentage relative to Max-Min. This is meant to limit "teleporting" effects.';
  }
  get SolidGauge_maxSpeed() {
    return this._SolidGauge_maxSpeed;
  }
  set SolidGauge_maxSpeed(value) {
    this._SolidGauge_maxSpeed = value;
  }
  IsDataSourceAssigned() {
    return !(this._DataSource_source instanceof NullYSensor);
  }
  get ATTR_SolidGauge_annotationPanels0__DisplayName() {
    return "Annotation 1";
  }
  get ATTR_SolidGauge_annotationPanels0__CategoryAttribute() {
    return "Annotations";
  }
  get ATTR_SolidGauge_annotationPanels0__ReadOnlyAttribute() {
    return true;
  }
  get ATTR_SolidGauge_annotationPanels0__DescriptionAttribute() {
    return "Customizable text panels";
  }
  get SolidGauge_annotationPanels0() {
    return this._annotationPanels0;
  }
  set SolidGauge_annotationPanels0(value) {
    this._annotationPanels0 = value;
  }
  get ATTR_SolidGauge_annotationPanels1__DisplayName() {
    return "Annotation 2";
  }
  get ATTR_SolidGauge_annotationPanels1__CategoryAttribute() {
    return "Annotations";
  }
  get ATTR_SolidGauge_annotationPanels1__ReadOnlyAttribute() {
    return true;
  }
  get ATTR_SolidGauge_annotationPanels1__DescriptionAttribute() {
    return "Customizable text panels";
  }
  get SolidGauge_annotationPanels1() {
    return this._annotationPanels1;
  }
  set SolidGauge_annotationPanels1(value) {
    this._annotationPanels1 = value;
  }
};
var AngularGaugeFormProperties = class extends GenericProperties {
  constructor(initData, owner) {
    super(owner);
    this._DataSource_source = sensorsManager.getNullSensor();
    this._DataSource_AlarmSection0 = new AlarmSection(0);
    this._DataSource_AlarmSection1 = new AlarmSection(1);
    this._AngularGauge_min = 0;
    this._AngularGauge_max = 100;
    this._AngularGauge_unitFactor = 1;
    this._AngularGauge_graduation = 10;
    this._AngularGauge_graduationSize = 10;
    this._AngularGauge_graduationOuterRadiusSize = 98;
    this._AngularGauge_graduationThickness = 2;
    this._AngularGauge_graduationColor = YColor.Black;
    this._AngularGauge_graduationFont = new FontDescription("Arial", 20, YColor.Black, false, true);
    this._AngularGauge_subgraduationCount = 5;
    this._AngularGauge_subgraduationSize = 5;
    this._AngularGauge_subgraduationThickness = 1;
    this._AngularGauge_subgraduationColor = YColor.Black;
    this._AngularGauge_needleColor = YColor.Red;
    this._AngularGauge_needleContourColor = YColor.DarkRed;
    this._AngularGauge_needleContourThickness = 1;
    this._AngularGauge_needleLength1 = 90;
    this._AngularGauge_needleLength2 = 15;
    this._AngularGauge_needleWidth = 5;
    this._AngularGauge_needleMaxSpeed = 0.5;
    this._AngularGauge_unitFont = new FontDescription("Arial", 24, YColor.DarkGray, false, true);
    this._AngularGauge_statusFont = new FontDescription("Arial", 24, YColor.DarkGray, false, true);
    this._AngularGauge_borderColor = YColor.Black;
    this._AngularGauge_borderThickness = 5;
    this._AngularGauge_backgroundColor1 = YColor.FromArgb(255, 240, 240, 240);
    this._AngularGauge_backgroundColor2 = YColor.FromArgb(255, 200, 200, 200);
    this._AngularGauge_zones0 = new AngularZoneDescription(0, 50, YColor.LightGreen);
    this._AngularGauge_zones1 = new AngularZoneDescription(0, 50, YColor.Yellow);
    this._AngularGauge_zones2 = new AngularZoneDescription(0, 50, YColor.Red);
    this._annotationPanels0 = new AnnotationPanelDescription(GenericPanel.HorizontalAlignPos.CENTER, GenericPanel.VerticalAlignPos.CENTER, 0, false, "$NAME$", YColor.FromArgb(0, 127, 127, 127), YColor.FromArgb(0, 127, 127, 127), 10, YColor.FromArgb(255, 0, 0, 0));
    this._annotationPanels1 = new AnnotationPanelDescription(GenericPanel.HorizontalAlignPos.CENTER, GenericPanel.VerticalAlignPos.BOTTOM, 0, false, "$NAME$", YColor.FromArgb(0, 127, 127, 127), YColor.FromArgb(0, 127, 127, 127), 10, YColor.FromArgb(255, 0, 0, 0));
    this.initFromXmlData(initData);
    this.PropagateDataSourceChange();
  }
  PropagateDataSourceChange() {
    this.ownerForm.SourceChanged(this._DataSource_source, 0);
    let props = GenericProperties.getAllProperties(this).byName;
    let name;
    for (name in props) {
      if (name.startsWith("DataSource_AlarmSection")) {
        this[name].setDataSource(this._DataSource_source);
      }
    }
  }
  IsDataSourceAssigned() {
    return !(this._DataSource_source instanceof NullYSensor);
  }
  get ATTR_DataSource_source__DisplayName() {
    return "Sensor";
  }
  get ATTR_DataSource_source__CategoryAttribute() {
    return "Data source";
  }
  get ATTR_DataSource_source__ParamCategorySummaryAttribute() {
    return "sensorDescription";
  }
  get ATTR_DataSource_source__PreExpandedCategoryAttribute() {
    return true;
  }
  get ATTR_DataSource_source__ChangeCausesParentRefreshAttribute() {
    return true;
  }
  get ATTR_DataSource_source__DescriptionAttribute() {
    return "Yoctopuce sensor feeding the gauge. " + GenericHints.CheckSensor;
  }
  get DataSource_source() {
    return this._DataSource_source;
  }
  set DataSource_source(value) {
    let prev = this._DataSource_source;
    this._DataSource_source = value;
    this.PropagateDataSourceChange();
  }
  get sensorDescription() {
    return this._DataSource_source instanceof NullYSensor ? "none" : this._DataSource_source.get_friendlyName();
  }
  get isSensorReadOnly() {
    return this._DataSource_source.isReadOnly;
  }
  get ATTR_DataSource_freq__DisplayName() {
    return "Sensor freq";
  }
  get ATTR_DataSource_freq__CategoryAttribute() {
    return "Data source";
  }
  get ATTR_DataSource_freq__NotSavedInXMLAttribute() {
    return true;
  }
  get ATTR_DataSource_freq__IsReadonlyCallAttribute() {
    return "isSensorReadOnly";
  }
  get ATTR_DataSource_freq__DescriptionAttribute() {
    return "Sensor data acquisition frequency." + GenericHints.DevConfAffected;
  }
  get ATTR_DataSource_freq__AllowedValues() {
    return sensorFreqTypeDescription.AllowedValues;
  }
  get DataSource_freq() {
    return this._DataSource_source.get_frequency();
  }
  set DataSource_freq(value) {
    this._DataSource_source.set_frequency(value);
  }
  get ATTR_DataSource_AlarmSection0__DisplayName() {
    return "Sensor value alarm 1";
  }
  get ATTR_DataSource_AlarmSection0__NotSavedInXMLAttribute() {
    return true;
  }
  get ATTR_DataSource_AlarmSection0__ReadOnlyAttribute() {
    return true;
  }
  get ATTR_DataSource_AlarmSection0__CategoryAttribute() {
    return "Data source";
  }
  get ATTR_DataSource_AlarmSection0__DescriptionAttribute() {
    return "Alarm 1 for this data source, expand for more.";
  }
  get DataSource_AlarmSection0() {
    return this._DataSource_AlarmSection0;
  }
  set DataSource_AlarmSection0(value) {
    this._DataSource_AlarmSection0 = value;
  }
  get ATTR_DataSource_AlarmSection1__DisplayName() {
    return "Sensor value alarm 2";
  }
  get ATTR_DataSource_AlarmSection1__NotSavedInXMLAttribute() {
    return true;
  }
  get ATTR_DataSource_AlarmSection1__ReadOnlyAttribute() {
    return true;
  }
  get ATTR_DataSource_AlarmSection1__CategoryAttribute() {
    return "Data source";
  }
  get ATTR_DataSource_AlarmSection1__DescriptionAttribute() {
    return "Alarm 2 for this data source, expand for more.";
  }
  get DataSource_AlarmSection1() {
    return this._DataSource_AlarmSection1;
  }
  set DataSource_AlarmSection1(value) {
    this._DataSource_AlarmSection1 = value;
  }
  get ATTR_AngularGauge_min__DisplayName() {
    return "Minimum value";
  }
  get ATTR_AngularGauge_min__CategoryAttribute() {
    return "Gauge gradations";
  }
  get ATTR_AngularGauge_min__DescriptionAttribute() {
    return "Minimum value displayable by the gauge.";
  }
  get AngularGauge_min() {
    return this._AngularGauge_min;
  }
  set AngularGauge_min(value) {
    this._AngularGauge_min = value;
  }
  get ATTR_AngularGauge_max__DisplayName() {
    return "Maximum value";
  }
  get ATTR_AngularGauge_max__CategoryAttribute() {
    return "Gauge gradations";
  }
  get ATTR_AngularGauge_max__DescriptionAttribute() {
    return "Maximum value displayable by the gauge.";
  }
  get AngularGauge_max() {
    return this._AngularGauge_max;
  }
  set AngularGauge_max(value) {
    this._AngularGauge_max = value;
  }
  get ATTR_AngularGauge_unitFactor__DisplayName() {
    return "Unit factor";
  }
  get ATTR_AngularGauge_unitFactor__CategoryAttribute() {
    return "Gauge gradations";
  }
  get ATTR_AngularGauge_unitFactor__DescriptionAttribute() {
    return "Data  will be divided by this value before being displayed, this allows simpler gradation marks.";
  }
  get AngularGauge_unitFactor() {
    return this._AngularGauge_unitFactor;
  }
  set AngularGauge_unitFactor(value) {
    this._AngularGauge_unitFactor = value;
  }
  get ATTR_AngularGauge_graduation__DisplayName() {
    return "Main gradation steps";
  }
  get ATTR_AngularGauge_graduation__CategoryAttribute() {
    return "Gauge gradations";
  }
  get ATTR_AngularGauge_graduation__DescriptionAttribute() {
    return "Difference between two consecutive main gradation marks";
  }
  get AngularGauge_graduation() {
    return this._AngularGauge_graduation;
  }
  set AngularGauge_graduation(value) {
    this._AngularGauge_graduation = value;
  }
  get ATTR_AngularGauge_graduationSize__DisplayName() {
    return "Main gradation size (%)";
  }
  get ATTR_AngularGauge_graduationSize__CategoryAttribute() {
    return "Gauge gradations";
  }
  get ATTR_AngularGauge_graduationSize__DescriptionAttribute() {
    return "Main gradation marks size in percent, relative to dial radius";
  }
  get AngularGauge_graduationSize() {
    return this._AngularGauge_graduationSize;
  }
  set AngularGauge_graduationSize(value) {
    this._AngularGauge_graduationSize = value;
  }
  get ATTR_AngularGauge_graduationOuterRadiusSize__DisplayName() {
    return "Main gradation radius (%)";
  }
  get ATTR_AngularGauge_graduationOuterRadiusSize__CategoryAttribute() {
    return "Gauge gradations";
  }
  get ATTR_AngularGauge_graduationOuterRadiusSize__DescriptionAttribute() {
    return "Main gradation marks outer radius in percent, relative to dial radius";
  }
  get AngularGauge_graduationOuterRadiusSize() {
    return this._AngularGauge_graduationOuterRadiusSize;
  }
  set AngularGauge_graduationOuterRadiusSize(value) {
    this._AngularGauge_graduationOuterRadiusSize = value;
  }
  get ATTR_AngularGauge_graduationThickness__DisplayName() {
    return "Main gradation thickness";
  }
  get ATTR_AngularGauge_graduationThickness__CategoryAttribute() {
    return "Gauge gradations";
  }
  get ATTR_AngularGauge_graduationThickness__DescriptionAttribute() {
    return "Main gradation marks thickness";
  }
  get AngularGauge_graduationThickness() {
    return this._AngularGauge_graduationThickness;
  }
  set AngularGauge_graduationThickness(value) {
    this._AngularGauge_graduationThickness = value;
  }
  get ATTR_AngularGauge_graduationColor__DisplayName() {
    return "Main gradation color";
  }
  get ATTR_AngularGauge_graduationColor__CategoryAttribute() {
    return "Gauge gradations";
  }
  get ATTR_AngularGauge_graduationColor__DescriptionAttribute() {
    return "Main gradation marks color.";
  }
  get AngularGauge_graduationColor() {
    return this._AngularGauge_graduationColor;
  }
  set AngularGauge_graduationColor(value) {
    this._AngularGauge_graduationColor = value;
  }
  get ATTR_AngularGauge_graduationFont__DisplayName() {
    return "Main gradation font";
  }
  get ATTR_AngularGauge_graduationFont__CategoryAttribute() {
    return "Gauge gradations";
  }
  get ATTR_AngularGauge_graduationFont__ReadOnlyAttribute() {
    return true;
  }
  get ATTR_AngularGauge_graduationFont__DescriptionAttribute() {
    return "Font used for gradation labels";
  }
  get AngularGauge_graduationFont() {
    return this._AngularGauge_graduationFont;
  }
  set AngularGauge_graduationFont(value) {
    this._AngularGauge_graduationFont = value;
  }
  get ATTR_AngularGauge_subgraduationCount__DisplayName() {
    return "Sub-gradation count";
  }
  get ATTR_AngularGauge_subgraduationCount__CategoryAttribute() {
    return "Gauge gradations";
  }
  get ATTR_AngularGauge_subgraduationCount__DescriptionAttribute() {
    return "How many sub-gradation (+1) marks between two consecutive main graduation marks";
  }
  get AngularGauge_subgraduationCount() {
    return this._AngularGauge_subgraduationCount;
  }
  set AngularGauge_subgraduationCount(value) {
    this._AngularGauge_subgraduationCount = value;
  }
  get ATTR_AngularGauge_subgraduationSize__DisplayName() {
    return "Sub-gradation size (%)";
  }
  get ATTR_AngularGauge_subgraduationSize__CategoryAttribute() {
    return "Gauge gradations";
  }
  get ATTR_AngularGauge_subgraduationSize__DescriptionAttribute() {
    return "Sub-gradation marks size in percent, relative to dial radius";
  }
  get AngularGauge_subgraduationSize() {
    return this._AngularGauge_subgraduationSize;
  }
  set AngularGauge_subgraduationSize(value) {
    this._AngularGauge_subgraduationSize = value;
  }
  get ATTR_AngularGauge_subgraduationThickness__DisplayName() {
    return "Sub-gradation thickness";
  }
  get ATTR_AngularGauge_subgraduationThickness__CategoryAttribute() {
    return "Gauge gradations";
  }
  get ATTR_AngularGauge_subgraduationThickness__DescriptionAttribute() {
    return "Sub-gradation marks thickness";
  }
  get AngularGauge_subgraduationThickness() {
    return this._AngularGauge_subgraduationThickness;
  }
  set AngularGauge_subgraduationThickness(value) {
    this._AngularGauge_subgraduationThickness = value;
  }
  get ATTR_AngularGauge_subgraduationColor__DisplayName() {
    return "Sub-gradation color";
  }
  get ATTR_AngularGauge_subgraduationColor__CategoryAttribute() {
    return "Gauge gradations";
  }
  get ATTR_AngularGauge_subgraduationColor__DescriptionAttribute() {
    return "Sub-gradation marks color.";
  }
  get AngularGauge_subgraduationColor() {
    return this._AngularGauge_subgraduationColor;
  }
  set AngularGauge_subgraduationColor(value) {
    this._AngularGauge_subgraduationColor = value;
  }
  get ATTR_AngularGauge_needleColor__DisplayName() {
    return "Needle color";
  }
  get ATTR_AngularGauge_needleColor__CategoryAttribute() {
    return "Needle";
  }
  get ATTR_AngularGauge_needleColor__DescriptionAttribute() {
    return "Needle filling color.";
  }
  get AngularGauge_needleColor() {
    return this._AngularGauge_needleColor;
  }
  set AngularGauge_needleColor(value) {
    this._AngularGauge_needleColor = value;
  }
  get ATTR_AngularGauge_needleContourColor__DisplayName() {
    return "Needle contour color";
  }
  get ATTR_AngularGauge_needleContourColor__CategoryAttribute() {
    return "Needle";
  }
  get ATTR_AngularGauge_needleContourColor__DescriptionAttribute() {
    return "Needle contour color.";
  }
  get AngularGauge_needleContourColor() {
    return this._AngularGauge_needleContourColor;
  }
  set AngularGauge_needleContourColor(value) {
    this._AngularGauge_needleContourColor = value;
  }
  get ATTR_AngularGauge_needleContourThickness__DisplayName() {
    return "Needle contour thickness";
  }
  get ATTR_AngularGauge_needleContourThickness__CategoryAttribute() {
    return "Needle";
  }
  get ATTR_AngularGauge_needleContourThickness__DescriptionAttribute() {
    return "Thickness of the needle contour";
  }
  get AngularGauge_needleContourThickness() {
    return this._AngularGauge_needleContourThickness;
  }
  set AngularGauge_needleContourThickness(value) {
    this._AngularGauge_needleContourThickness = value;
  }
  get ATTR_AngularGauge_needleLength1__DisplayName() {
    return "Needle main size (%)";
  }
  get ATTR_AngularGauge_needleLength1__CategoryAttribute() {
    return "Needle";
  }
  get ATTR_AngularGauge_needleLength1__DescriptionAttribute() {
    return "Length of the needle part pointing to gradations, in % relative to radius";
  }
  get AngularGauge_needleLength1() {
    return this._AngularGauge_needleLength1;
  }
  set AngularGauge_needleLength1(value) {
    this._AngularGauge_needleLength1 = value;
  }
  get ATTR_AngularGauge_needleLength2__DisplayName() {
    return "Needle foot size (%)";
  }
  get ATTR_AngularGauge_needleLength2__CategoryAttribute() {
    return "Needle";
  }
  get ATTR_AngularGauge_needleLength2__DescriptionAttribute() {
    return "Length of the needle part not pointing to gradations, in % relative to radius";
  }
  get AngularGauge_needleLength2() {
    return this._AngularGauge_needleLength2;
  }
  set AngularGauge_needleLength2(value) {
    this._AngularGauge_needleLength2 = value;
  }
  get ATTR_AngularGauge_needleWidth__DisplayName() {
    return "Needle width (%)";
  }
  get ATTR_AngularGauge_needleWidth__CategoryAttribute() {
    return "Needle";
  }
  get ATTR_AngularGauge_needleWidth__DescriptionAttribute() {
    return "Width of the needle, in % relative to radius";
  }
  get AngularGauge_needleWidth() {
    return this._AngularGauge_needleWidth;
  }
  set AngularGauge_needleWidth(value) {
    this._AngularGauge_needleWidth = value;
  }
  get ATTR_AngularGauge_needleMaxSpeed__DisplayName() {
    return "Needle max speed (%)";
  }
  get ATTR_AngularGauge_needleMaxSpeed__CategoryAttribute() {
    return "Needle";
  }
  get ATTR_AngularGauge_needleMaxSpeed__DescriptionAttribute() {
    return 'Needle Maximum speed, in % relative to (max-min). This is meant to limit "teleporting" effects.';
  }
  get AngularGauge_needleMaxSpeed() {
    return this._AngularGauge_needleMaxSpeed;
  }
  set AngularGauge_needleMaxSpeed(value) {
    this._AngularGauge_needleMaxSpeed = value;
  }
  get ATTR_AngularGauge_unitFont__DisplayName() {
    return "Unit Line Font";
  }
  get ATTR_AngularGauge_unitFont__CategoryAttribute() {
    return "Text lines";
  }
  get ATTR_AngularGauge_unitFont__ReadOnlyAttribute() {
    return true;
  }
  get ATTR_AngularGauge_unitFont__DescriptionAttribute() {
    return "Font used in the text line describing unit";
  }
  get AngularGauge_unitFont() {
    return this._AngularGauge_unitFont;
  }
  set AngularGauge_unitFont(value) {
    this._AngularGauge_unitFont = value;
  }
  get ATTR_AngularGauge_statusFont__DisplayName() {
    return "Status Line Font";
  }
  get ATTR_AngularGauge_statusFont__ReadOnlyAttribute() {
    return true;
  }
  get ATTR_AngularGauge_statusFont__CategoryAttribute() {
    return "Text lines";
  }
  get ATTR_AngularGauge_statusFont__DescriptionAttribute() {
    return "Font used in the text line gauge status";
  }
  get AngularGauge_statusFont() {
    return this._AngularGauge_statusFont;
  }
  set AngularGauge_statusFont(value) {
    this._AngularGauge_statusFont = value;
  }
  get ATTR_AngularGauge_borderColor__DisplayName() {
    return "Border color";
  }
  get ATTR_AngularGauge_borderColor__CategoryAttribute() {
    return "Dial";
  }
  get ATTR_AngularGauge_borderColor__DescriptionAttribute() {
    return "Dial border color.";
  }
  get AngularGauge_borderColor() {
    return this._AngularGauge_borderColor;
  }
  set AngularGauge_borderColor(value) {
    this._AngularGauge_borderColor = value;
  }
  get ATTR_AngularGauge_borderThickness__DisplayName() {
    return "Border thickness ";
  }
  get ATTR_AngularGauge_borderThickness__CategoryAttribute() {
    return "Dial";
  }
  get ATTR_AngularGauge_borderThickness__DescriptionAttribute() {
    return "Thickness of the dial border";
  }
  get AngularGauge_borderThickness() {
    return this._AngularGauge_borderThickness;
  }
  set AngularGauge_borderThickness(value) {
    this._AngularGauge_borderThickness = value;
  }
  get ATTR_AngularGauge_backgroundColor1__DisplayName() {
    return "Background color 1";
  }
  get ATTR_AngularGauge_backgroundColor1__CategoryAttribute() {
    return "Dial";
  }
  get ATTR_AngularGauge_backgroundColor1__DescriptionAttribute() {
    return "Dial background gradient color 1.";
  }
  get AngularGauge_backgroundColor1() {
    return this._AngularGauge_backgroundColor1;
  }
  set AngularGauge_backgroundColor1(value) {
    this._AngularGauge_backgroundColor1 = value;
  }
  get ATTR_AngularGauge_backgroundColor2__DisplayName() {
    return "Background color 2";
  }
  get ATTR_AngularGauge_backgroundColor2__CategoryAttribute() {
    return "Dial";
  }
  get ATTR_AngularGauge_backgroundColor2__DescriptionAttribute() {
    return "Dial background gradient color 2.";
  }
  get AngularGauge_backgroundColor2() {
    return this._AngularGauge_backgroundColor2;
  }
  set AngularGauge_backgroundColor2(value) {
    this._AngularGauge_backgroundColor2 = value;
  }
  get ATTR_AngularGauge_zones0__DisplayName() {
    return "Zone 1";
  }
  get ATTR_AngularGauge_zones0__CategoryAttribute() {
    return "Zones";
  }
  get ATTR_AngularGauge_zones0__ReadOnlyAttribute() {
    return true;
  }
  get ATTR_AngularGauge_zones0__DescriptionAttribute() {
    return "Zone 1 parameters";
  }
  get AngularGauge_zones0() {
    return this._AngularGauge_zones0;
  }
  set AngularGauge_zones0(value) {
    this._AngularGauge_zones0 = value;
  }
  get ATTR_AngularGauge_zones1__DisplayName() {
    return "Zone 2";
  }
  get ATTR_AngularGauge_zones1__CategoryAttribute() {
    return "Zones";
  }
  get ATTR_AngularGauge_zones1__ReadOnlyAttribute() {
    return true;
  }
  get ATTR_AngularGauge_zones1__DescriptionAttribute() {
    return "Zone 2 parameters";
  }
  get AngularGauge_zones1() {
    return this._AngularGauge_zones1;
  }
  set AngularGauge_zones1(value) {
    this._AngularGauge_zones1 = value;
  }
  get ATTR_AngularGauge_zones2__DisplayName() {
    return "Zone 2";
  }
  get ATTR_AngularGauge_zones2__CategoryAttribute() {
    return "Zones";
  }
  get ATTR_AngularGauge_zones2__ReadOnlyAttribute() {
    return true;
  }
  get ATTR_AngularGauge_zones2__DescriptionAttribute() {
    return "Zone 2 parameters";
  }
  get AngularGauge_zones2() {
    return this._AngularGauge_zones2;
  }
  set AngularGauge_zones2(value) {
    this._AngularGauge_zones2 = value;
  }
  get ATTR_AngularGauge_annotationPanels0__DisplayName() {
    return "Annotation 1";
  }
  get ATTR_AngularGauge_annotationPanels0__CategoryAttribute() {
    return "Annotations";
  }
  get ATTR_AngularGauge_annotationPanels0__ReadOnlyAttribute() {
    return true;
  }
  get ATTR_AngularGauge_annotationPanels0__DescriptionAttribute() {
    return "Customizable text panels";
  }
  get AngularGauge_annotationPanels0() {
    return this._annotationPanels0;
  }
  set AngularGauge_annotationPanels0(value) {
    this._annotationPanels0 = value;
  }
  get ATTR_AngularGauge_annotationPanels1__DisplayName() {
    return "Annotation 2";
  }
  get ATTR_AngularGauge_annotationPanels1__CategoryAttribute() {
    return "Annotations";
  }
  get ATTR_AngularGauge_annotationPanels1__ReadOnlyAttribute() {
    return true;
  }
  get ATTR_AngularGauge_annotationPanels1__DescriptionAttribute() {
    return "Customizable text panels";
  }
  get AngularGauge_annotationPanels1() {
    return this._annotationPanels1;
  }
  set AngularGauge_annotationPanels1(value) {
    this._annotationPanels1 = value;
  }
};
var ZoneDescription = class {
  constructor(min, max, color) {
    this._visible = false;
    this._min = min;
    this._max = max;
    this._color = color;
  }
  get summary() {
    return this._visible ? this._min.toString() + ".." + this._max.toString() : "Disabled";
  }
  get ATTR_visible__DisplayName() {
    return "Visible";
  }
  get ATTR_visible__ChangeCausesParentRefreshAttribute() {
    return true;
  }
  get ATTR_visible__DescriptionAttribute() {
    return "Zone visibility.";
  }
  get visible() {
    return this._visible;
  }
  set visible(value) {
    this._visible = value;
  }
  get ATTR_min__DisplayName() {
    return "Minimum value";
  }
  get ATTR_min__ChangeCausesParentRefreshAttribute() {
    return true;
  }
  get ATTR_min__DescriptionAttribute() {
    return "Zone minimum value";
  }
  get min() {
    return this._min;
  }
  set min(value) {
    this._min = value;
  }
  get ATTR_max__DisplayName() {
    return "Maximum value";
  }
  get ATTR_max__ChangeCausesParentRefreshAttribute() {
    return true;
  }
  get ATTR_max__DescriptionAttribute() {
    return "Zone maximum value";
  }
  get max() {
    return this._max;
  }
  set max(value) {
    this._max = value;
  }
  get ATTR_color__DisplayName() {
    return "Color";
  }
  get ATTR_color__DescriptionAttribute() {
    return "Zone color";
  }
  get color() {
    return this._color;
  }
  set color(value) {
    this._color = value;
  }
};
var AngularZoneDescription = class {
  constructor(min, max, color) {
    this._width = 5;
    this._outerRadius = 98;
    this._visible = false;
    this._min = min;
    this._max = max;
    this._color = color;
  }
  get summary() {
    return this._visible ? this._min.toString() + ".." + this._max.toString() : "Disabled";
  }
  get ATTR_visible__DisplayName() {
    return "Visible";
  }
  get ATTR_visible__ChangeCausesParentRefreshAttribute() {
    return true;
  }
  get ATTR_visible__DescriptionAttribute() {
    return "Zone visibility.";
  }
  get visible() {
    return this._visible;
  }
  set visible(value) {
    this._visible = value;
  }
  get ATTR_min__DisplayName() {
    return "Minimum value";
  }
  get ATTR_min__ChangeCausesParentRefreshAttribute() {
    return true;
  }
  get ATTR_min__DescriptionAttribute() {
    return "Zone minimum value";
  }
  get min() {
    return this._min;
  }
  set min(value) {
    this._min = value;
  }
  get ATTR_max__DisplayName() {
    return "Maximum value";
  }
  get ATTR_max__ChangeCausesParentRefreshAttribute() {
    return true;
  }
  get ATTR_max__DescriptionAttribute() {
    return "Zone maximum value";
  }
  get max() {
    return this._max;
  }
  set max(value) {
    this._max = value;
  }
  get ATTR_color__DisplayName() {
    return "Color";
  }
  get ATTR_color__DescriptionAttribute() {
    return "Zone color";
  }
  get color() {
    return this._color;
  }
  set color(value) {
    this._color = value;
  }
  get ATTR_outerRadius__DisplayName() {
    return "Outer radius (%)";
  }
  get ATTR_outerRadius__DescriptionAttribute() {
    return "Zone outer radius, in percentage relative to dial radius ";
  }
  get outerRadius() {
    return this._outerRadius;
  }
  set outerRadius(value) {
    this._outerRadius = value;
  }
  get ATTR_width__DisplayName() {
    return "Width (%)";
  }
  get ATTR_width__DescriptionAttribute() {
    return "Zone  width, in percentage relative to dial radius ";
  }
  get width() {
    return this._width;
  }
  set width(value) {
    this._width = value;
  }
};
var FontDescription = class {
  constructor(name, size, color, italic, bold) {
    this._name = name;
    this._size = size;
    this._color = color;
    this._italic = italic;
    this._bold = bold;
  }
  ToString() {
    return this._name + " " + this._size.toString();
  }
  get summary() {
    return this._name + " " + this._size.toString();
  }
  get ATTR_name__DisplayName() {
    return "Font name";
  }
  get ATTR_name__AllowedValues() {
    return fontNameTypeDescription.AllowedValues;
  }
  get ATTR_name__ChangeCausesParentRefreshAttribute() {
    return true;
  }
  get ATTR_name__DescriptionAttribute() {
    return "Name of the font";
  }
  get name() {
    return this._name;
  }
  set name(value) {
    this._name = value;
  }
  get ATTR_size__DisplayName() {
    return "Font size";
  }
  get ATTR_size__ChangeCausesParentRefreshAttribute() {
    return true;
  }
  get ATTR_size__DescriptionAttribute() {
    return "Size of the font";
  }
  get size() {
    return this._size;
  }
  set size(value) {
    this._size = Math.round(100 * value) / 100;
  }
  get ATTR_color__DisplayName() {
    return "Font color";
  }
  get ATTR_color__DescriptionAttribute() {
    return "Color of the font.";
  }
  get color() {
    return this._color;
  }
  set color(value) {
    this._color = value;
  }
  get ATTR_italic__DisplayName() {
    return "Italic";
  }
  get ATTR_italic__DescriptionAttribute() {
    return "Is the font style italic?.";
  }
  get italic() {
    return this._italic;
  }
  set italic(value) {
    this._italic = value;
  }
  get ATTR_bold__DisplayName() {
    return "Bold";
  }
  get ATTR_bold__DescriptionAttribute() {
    return "Is the font style bold?.";
  }
  get bold() {
    return this._bold;
  }
  set bold(value) {
    this._bold = value;
  }
};
var digitalDisplayFormProperties = class extends GenericProperties {
  constructor(initData, owner) {
    super(owner);
    this._DataSource_source = sensorsManager.getNullSensor();
    this._DataSource_precision = "0.1";
    this._DataSource_AlarmSection0 = new AlarmSection(0);
    this._DataSource_AlarmSection1 = new AlarmSection(1);
    this._font = new FontDescription("Arial", 48, YColor.LightGreen, false, true);
    this._display_backgroundColor1 = YColor.Black;
    this._display_backgroundColor2 = YColor.Black;
    this._hrzAlignment = YDigitalDisplay.HrzAlignment.RIGHT;
    this._hrzAlignmentOfset = 5;
    this._outOfRangeMin = new doubleNan(Number.NaN);
    this._outOfRangeMax = new doubleNan(Number.NaN);
    this._outOfRangeColor = YColor.Red;
    this._annotationPanels0 = new AnnotationPanelDescription(GenericPanel.HorizontalAlignPos.CENTER, GenericPanel.VerticalAlignPos.CENTER, 0, false, "$NAME$", YColor.FromArgb(0, 127, 127, 127), YColor.FromArgb(0, 127, 127, 127), 10, YColor.FromArgb(255, 0, 0, 0));
    this._annotationPanels1 = new AnnotationPanelDescription(GenericPanel.HorizontalAlignPos.CENTER, GenericPanel.VerticalAlignPos.BOTTOM, 0, false, "$NAME$", YColor.FromArgb(0, 127, 127, 127), YColor.FromArgb(0, 127, 127, 127), 10, YColor.FromArgb(255, 0, 0, 0));
    this.initFromXmlData(initData);
    this.PropagateDataSourceChange();
  }
  PropagateDataSourceChange() {
    this.ownerForm.SourceChanged(this._DataSource_source, 0);
    let props = GenericProperties.getAllProperties(this).byName;
    let name;
    for (name in props) {
      if (name.startsWith("DataSource_AlarmSection")) {
        this[name].setDataSource(this._DataSource_source);
      }
    }
  }
  IsDataSourceAssigned() {
    return !(this._DataSource_source instanceof NullYSensor);
  }
  get ATTR_DataSource_source__DisplayName() {
    return "Sensor";
  }
  get ATTR_DataSource_source__CategoryAttribute() {
    return "Data source";
  }
  get ATTR_DataSource_source__ParamCategorySummaryAttribute() {
    return "sensorDescription";
  }
  get ATTR_DataSource_source__PreExpandedCategoryAttribute() {
    return true;
  }
  get ATTR_DataSource_source__ChangeCausesParentRefreshAttribute() {
    return true;
  }
  get ATTR_DataSource_source__DescriptionAttribute() {
    return "Yoctopuce sensor feeding the display. " + GenericHints.CheckSensor;
  }
  get DataSource_source() {
    return this._DataSource_source;
  }
  set DataSource_source(value) {
    let prev = this._DataSource_source;
    this._DataSource_source = value;
    this.PropagateDataSourceChange();
  }
  get isSensorReadOnly() {
    return this._DataSource_source.isReadOnly;
  }
  get sensorDescription() {
    return this._DataSource_source instanceof NullYSensor ? "none" : this._DataSource_source.get_friendlyName();
  }
  get ATTR_DataSource_freq__DisplayName() {
    return "Sensor freq";
  }
  get ATTR_DataSource_freq__CategoryAttribute() {
    return "Data source";
  }
  get ATTR_DataSource_freq__NotSavedInXMLAttribute() {
    return true;
  }
  get ATTR_DataSource_freq__IsReadonlyCallAttribute() {
    return "isSensorReadOnly";
  }
  get ATTR_DataSource_freq__DescriptionAttribute() {
    return "Sensor data acquisition frequency." + GenericHints.DevConfAffected;
  }
  get ATTR_DataSource_freq__AllowedValues() {
    return sensorFreqTypeDescription.AllowedValues;
  }
  get DataSource_freq() {
    return this._DataSource_source.get_frequency();
  }
  set DataSource_freq(value) {
    this._DataSource_source.set_frequency(value);
  }
  get ATTR_DataSource_precision__DisplayName() {
    return "Precision";
  }
  get ATTR_DataSource_precision__CategoryAttribute() {
    return "Data source";
  }
  get ATTR_DataSource_precision__DescriptionAttribute() {
    return "How many digits shown after the decimal point.";
  }
  get ATTR_DataSource_precision__AllowedValues() {
    return sensorPrecisionTypeDescription.AllowedValues;
  }
  get DataSource_precision() {
    return this._DataSource_precision;
  }
  set DataSource_precision(value) {
    this._DataSource_precision = value;
  }
  get ATTR_DataSource_AlarmSection0__DisplayName() {
    return "Sensor value alarm 1";
  }
  get ATTR_DataSource_AlarmSection0__NotSavedInXMLAttribute() {
    return true;
  }
  get ATTR_DataSource_AlarmSection0__ReadOnlyAttribute() {
    return true;
  }
  get ATTR_DataSource_AlarmSection0__CategoryAttribute() {
    return "Data source";
  }
  get ATTR_DataSource_AlarmSection0__DescriptionAttribute() {
    return "Alarm 1 for this data source, expand for more.";
  }
  get DataSource_AlarmSection0() {
    return this._DataSource_AlarmSection0;
  }
  set DataSource_AlarmSection0(value) {
    this._DataSource_AlarmSection0 = value;
  }
  get ATTR_DataSource_AlarmSection1__DisplayName() {
    return "Sensor value alarm 2";
  }
  get ATTR_DataSource_AlarmSection1__NotSavedInXMLAttribute() {
    return true;
  }
  get ATTR_DataSource_AlarmSection1__ReadOnlyAttribute() {
    return true;
  }
  get ATTR_DataSource_AlarmSection1__CategoryAttribute() {
    return "Data source";
  }
  get ATTR_DataSource_AlarmSection1__DescriptionAttribute() {
    return "Alarm 2 for this data source, expand for more.";
  }
  get DataSource_AlarmSection1() {
    return this._DataSource_AlarmSection1;
  }
  set DataSource_AlarmSection1(value) {
    this._DataSource_AlarmSection1 = value;
  }
  get ATTR_display_font__DisplayName() {
    return "Font";
  }
  get ATTR_display_font__CategoryAttribute() {
    return "Display";
  }
  get ATTR_display_font__ReadOnlyAttribute() {
    return true;
  }
  get ATTR_display_font__DescriptionAttribute() {
    return "Display font";
  }
  get display_font() {
    return this._font;
  }
  set display_font(value) {
    this._font = value;
  }
  get ATTR_display_backgroundColor1__DisplayName() {
    return "Background color 1";
  }
  get ATTR_display_backgroundColor1__CategoryAttribute() {
    return "Display";
  }
  get ATTR_display_backgroundColor1__DescriptionAttribute() {
    return "Display background gradient color 1.";
  }
  get display_backgroundColor1() {
    return this._display_backgroundColor1;
  }
  set display_backgroundColor1(value) {
    this._display_backgroundColor1 = value;
  }
  get ATTR_display_backgroundColor2__DisplayName() {
    return "Background color 2";
  }
  get ATTR_display_backgroundColor2__CategoryAttribute() {
    return "Display";
  }
  get ATTR_display_backgroundColor2__DescriptionAttribute() {
    return "Display background gradient color 2.";
  }
  get display_backgroundColor2() {
    return this._display_backgroundColor2;
  }
  set display_backgroundColor2(value) {
    this._display_backgroundColor2 = value;
  }
  get ATTR_display_hrzAlignment__DisplayName() {
    return "Hrz alignment method";
  }
  get ATTR_display_hrzAlignment__CategoryAttribute() {
    return "Display";
  }
  get ATTR_display_hrzAlignment__DescriptionAttribute() {
    return "Horizontal alignment method";
  }
  get display_hrzAlignment() {
    return this._hrzAlignment;
  }
  set display_hrzAlignment(value) {
    this._hrzAlignment = value;
  }
  get ATTR_display_hrzAlignmentOfset__DisplayName() {
    return "Hrz alignment offset";
  }
  get ATTR_display_hrzAlignmentOfset__CategoryAttribute() {
    return "Display";
  }
  get ATTR_display_hrzAlignmentOfset__DescriptionAttribute() {
    return "Horizontal alignment offset in percentage. No effect when chosen horizontal alignment is CENTER";
  }
  get display_hrzAlignmentOfset() {
    return this._hrzAlignmentOfset;
  }
  set display_hrzAlignmentOfset(value) {
    this._hrzAlignmentOfset = value;
  }
  get ATTR_display_outOfRangeMin__DisplayName() {
    return "Minimum value";
  }
  get ATTR_display_outOfRangeMin__CategoryAttribute() {
    return "Range Control";
  }
  get ATTR_display_outOfRangeMin__DescriptionAttribute() {
    return `Regular range minimum value. if value goes  outside regular  range, color will turn to "Out of range Color".Leave blank if you don't want to define such a range. `;
  }
  get display_outOfRangeMin() {
    return this._outOfRangeMin;
  }
  set display_outOfRangeMin(value) {
    this._outOfRangeMin = value;
  }
  get ATTR_display_outOfRangeMax__DisplayName() {
    return "Maximum value";
  }
  get ATTR_display_outOfRangeMax__CategoryAttribute() {
    return "Range Control";
  }
  get ATTR_display_outOfRangeMax__DescriptionAttribute() {
    return `Regular range minimum value. if value goes  outside regular  range, color will turn to "Out of range Color".Leave blank if you don't want to define such a range. `;
  }
  get display_outOfRangeMax() {
    return this._outOfRangeMax;
  }
  set display_outOfRangeMax(value) {
    this._outOfRangeMax = value;
  }
  get ATTR_display_outOfRangeColor__DisplayName() {
    return "Out of range Color";
  }
  get ATTR_display_outOfRangeColor__CategoryAttribute() {
    return "Range Control";
  }
  get ATTR_display_outOfRangeColor__DescriptionAttribute() {
    return "Digits color when value is out of range.";
  }
  get display_outOfRangeColor() {
    return this._outOfRangeColor;
  }
  set display_outOfRangeColor(value) {
    this._outOfRangeColor = value;
  }
  get ATTR_display_annotationPanels0__DisplayName() {
    return "Annotation 1";
  }
  get ATTR_display_annotationPanels0__CategoryAttribute() {
    return "Annotations";
  }
  get ATTR_display_annotationPanels0__ReadOnlyAttribute() {
    return true;
  }
  get ATTR_display_annotationPanels0__DescriptionAttribute() {
    return "Customizable text panels";
  }
  get display_annotationPanels0() {
    return this._annotationPanels0;
  }
  set display_annotationPanels0(value) {
    this._annotationPanels0 = value;
  }
  get ATTR_display_annotationPanels1__DisplayName() {
    return "Annotation 2";
  }
  get ATTR_display_annotationPanels1__CategoryAttribute() {
    return "Annotations";
  }
  get ATTR_display_annotationPanels1__ReadOnlyAttribute() {
    return true;
  }
  get ATTR_display_annotationPanels1__DescriptionAttribute() {
    return "Customizable text panels";
  }
  get display_annotationPanels1() {
    return this._annotationPanels1;
  }
  set display_annotationPanels1(value) {
    this._annotationPanels1 = value;
  }
};
var AlarmSection = class {
  constructor(index) {
    this._sensor = sensorsManager.getNullSensor();
    this._index = 0;
    this._index = index;
  }
  get summary() {
    let c = this._sensor.getAlarmCondition(this._index);
    if (c == 0)
      return "Disabled";
    return "Enabled";
  }
  get ATTR_source__DisplayName() {
    return "Data source type";
  }
  get ATTR_source__NotSavedInXMLAttribute() {
    return true;
  }
  get ATTR_source__AllowedValues() {
    return sensorDataTypeDescription.AllowedValues;
  }
  get ATTR_source__DescriptionAttribute() {
    return "Alarm sensor data source (Average, minimum or maximum value during last interval)";
  }
  get source() {
    return this._sensor.getAlarmSource(this._index);
  }
  set source(value) {
    this._sensor.setAlarmSource(this._index, value);
  }
  get ATTR_condition__DisplayName() {
    return "Test Condition";
  }
  get ATTR_condition__NotSavedInXMLAttribute() {
    return true;
  }
  get ATTR_condition__AllowedValues() {
    return AlarmTestTypeDescription.AllowedValues;
  }
  get ATTR_condition__ChangeCausesParentRefreshAttribute() {
    return true;
  }
  get ATTR_condition__DescriptionAttribute() {
    return "Alarm trigger condition";
  }
  get condition() {
    return this._sensor.getAlarmCondition(this._index);
  }
  set condition(value) {
    this._sensor.setAlarmCondition(this._index, value);
  }
  setDataSource(sensor) {
    this._sensor = sensor;
  }
  get ATTR_value__DisplayName() {
    return "Test Value";
  }
  get ATTR_value__NotSavedInXMLAttribute() {
    return true;
  }
  get ATTR_value__DescriptionAttribute() {
    return "Value for the Alarm trigger";
  }
  get value() {
    return this._sensor.getAlarmValue(this._index);
  }
  set value(value) {
    this._sensor.setAlarmValue(this._index, value);
  }
  get ATTR_commandLine__DisplayName() {
    return "Trigger action";
  }
  get ATTR_commandLine__NotSavedInXMLAttribute() {
    return true;
  }
  get ATTR_commandLine__DescriptionAttribute() {
    return "Javascript snippet executed in your browser each time the alarm is triggered, you can use the following variables: $SENSORVALUE$, $UNIT$, $HWDID$, $NAME$, $CONDITION$, $TRIGGER$, $DATATYPE$, $NOW$. Example : <tt>alarm('Warning $NAME$ = $SENSORVALUE$!');</tt>. You can check logs to find out if your alarm code works.";
  }
  get commandLine() {
    return this._sensor.getAlarmCommandline(this._index);
  }
  set commandLine(value) {
    this._sensor.setAlarmCommandline(this._index, value);
  }
  get ATTR_delay__DisplayName() {
    return "Trigger delay";
  }
  get ATTR_delay__NotSavedInXMLAttribute() {
    return true;
  }
  get ATTR_delay__DescriptionAttribute() {
    return "Minimum delay, in seconds, between two alarms. Think carefully and make sure you won't create alarm storms.";
  }
  get delay() {
    return this._sensor.getAlarmDelay(this._index);
  }
  set delay(value) {
    this._sensor.setAlarmDelay(this._index, value);
  }
};
var ChartSerie = class {
  constructor(defaultColor) {
    this.ownerForm = null;
    this.index = -1;
    this._DataSource_source = sensorsManager.getNullSensor();
    this._DataType = 0;
    this._thickness = 2;
    this._legend = "";
    this._color = YColor.Red;
    this._yAxisIndex = 0;
    this._DataSource_AlarmSection0 = new AlarmSection(0);
    this._DataSource_AlarmSection1 = new AlarmSection(1);
    this._color = defaultColor;
  }
  get summary() {
    return this._DataSource_source instanceof NullYSensor ? "none" : this._DataSource_source.get_friendlyName() + (this._DataSource_source.isOnline() ? "" : " - OFFLINE");
  }
  Init(owner, serieIndex) {
    this.ownerForm = owner;
    this.index = serieIndex;
    this.PropagateDataSourceChange(this._DataSource_source);
  }
  PropagateDataSourceChange(value) {
    this.ownerForm.SourceChanged(this._DataSource_source, this.index);
    let props = GenericProperties.getAllProperties(this).byName;
    let name;
    for (name in props) {
      if (name.startsWith("DataSource_AlarmSection")) {
        this[name].setDataSource(this._DataSource_source);
      }
    }
  }
  get ATTR_DataSource_source__DisplayName() {
    return "Sensor";
  }
  get ATTR_DataSource_source__CopyToTarget() {
    return false;
  }
  get ATTR_DataSource_source__ChangeCausesParentRefreshAttribute() {
    return true;
  }
  get ATTR_DataSource_source__DescriptionAttribute() {
    return "Yoctopuce sensor feeding the graph. " + GenericHints.CheckSensor;
  }
  get DataSource_source() {
    return this._DataSource_source;
  }
  set DataSource_source(value) {
    let prev = this._DataSource_source;
    this._DataSource_source = value;
    if (this.ownerForm != null)
      this.PropagateDataSourceChange(this._DataSource_source);
  }
  get isSensorReadOnly() {
    return this._DataSource_source.isReadOnly;
  }
  get ATTR_DataSource_freq__DisplayName() {
    return "Sensor frequency";
  }
  get ATTR_DataSource_freq__NotSavedInXMLAttribute() {
    return true;
  }
  get ATTR_DataSource_freq__CopyToTarget() {
    return false;
  }
  get ATTR_DataSource_freq__IsReadonlyCallAttribute() {
    return "isSensorReadOnly";
  }
  get ATTR_DataSource_freq__DescriptionAttribute() {
    return "Sensor data acquisition frequency." + GenericHints.DevConfAffected;
  }
  get ATTR_DataSource_freq__AllowedValues() {
    return sensorFreqTypeDescription.AllowedValues;
  }
  get DataSource_freq() {
    return this._DataSource_source.get_frequency();
  }
  set DataSource_freq(value) {
    this._DataSource_source.set_frequency(value);
  }
  get ATTR_DataSource_datatype__DisplayName() {
    return "Sensor data";
  }
  get ATTR_DataSource_datatype__AllowedValues() {
    return sensorDataTypeDescription.AllowedValues;
  }
  get ATTR_DataSource_datatype__CopyToTarget() {
    return false;
  }
  get ATTR_DataSource_datatype__DescriptionAttribute() {
    return "Which data for sensor are displayed on the graph. Min and Max are available only for frequencies <1Hz";
  }
  get DataSource_datatype() {
    return this._DataType;
  }
  set DataSource_datatype(value) {
    this._DataType = value;
    if (this.ownerForm != null) {
      this.ownerForm.SourceChanged(this._DataSource_source, this.index);
    }
  }
  get ATTR_DataSource_recording__DisplayName() {
    return "Sensor recording";
  }
  get ATTR_DataSource_recording__NotSavedInXMLAttribute() {
    return true;
  }
  get ATTR_DataSource_recording__IsReadonlyCallAttribute() {
    return "isSensorReadOnly";
  }
  get ATTR_DataSource_recording__CopyToTarget() {
    return false;
  }
  get ATTR_DataSource_recording__DescriptionAttribute() {
    return "Enable/ disable sensor data recording in the device on-board datalogger." + GenericHints.DevConfAffected;
  }
  get DataSource_recording() {
    return this._DataSource_source.get_recording();
  }
  set DataSource_recording(value) {
    this._DataSource_source.set_recording(value);
  }
  get ATTR_thickness__DisplayName() {
    return "Thickness";
  }
  get ATTR_thickness__DescriptionAttribute() {
    return "Line thickness.";
  }
  get thickness() {
    return this._thickness;
  }
  set thickness(value) {
    this._thickness = value;
  }
  get ATTR_legend__DisplayName() {
    return "Legend";
  }
  get ATTR_legend__DescriptionAttribute() {
    return "Short description of the series.";
  }
  get legend() {
    return this._legend;
  }
  set legend(value) {
    this._legend = value;
  }
  get ATTR_color__DisplayName() {
    return "Color";
  }
  get ATTR_color__DescriptionAttribute() {
    return "Line color.";
  }
  get color() {
    return this._color;
  }
  set color(value) {
    this._color = value;
  }
  get ATTR_yAxisIndex__AllowedValues() {
    return yAxisDescription.AllowedValues;
  }
  get ATTR_yAxisIndex__DisplayName() {
    return "Y axis";
  }
  get ATTR_yAxisIndex__DescriptionAttribute() {
    return "Choose which Y axis the data with be scaled to.";
  }
  get yAxisIndex() {
    return this._yAxisIndex;
  }
  set yAxisIndex(value) {
    this._yAxisIndex = value;
  }
  get ATTR_DataSource_AlarmSection0__DisplayName() {
    return "Sensor value alarm 1";
  }
  get ATTR_DataSource_AlarmSection0__NotSavedInXMLAttribute() {
    return true;
  }
  get ATTR_DataSource_AlarmSection0__DescriptionAttribute() {
    return "Alarm 1 for this data source, expand for more.";
  }
  get DataSource_AlarmSection0() {
    return this._DataSource_AlarmSection0;
  }
  set DataSource_AlarmSection0(value) {
    this._DataSource_AlarmSection0 = value;
  }
  get ATTR_DataSource_AlarmSection1__DisplayName() {
    return "Sensor value alarm 2";
  }
  get ATTR_DataSource_AlarmSection1__NotSavedInXMLAttribute() {
    return true;
  }
  get ATTR_DataSource_AlarmSection1__DescriptionAttribute() {
    return "Alarm 2 for this data source, expand for more.";
  }
  get DataSource_AlarmSection1() {
    return this._DataSource_AlarmSection1;
  }
  set DataSource_AlarmSection1(value) {
    this._DataSource_AlarmSection1 = value;
  }
};
var LegendPanelDescription = class {
  constructor() {
    this._enabled = false;
    this._overlap = false;
    this._position = LegendPanel.Position.RIGHT;
    this._font = new FontDescription("Arial", 7, YColor.FromArgb(255, 32, 32, 32), false, true);
    this._bgColor = YColor.FromArgb(200, 255, 255, 255);
    this._borderColor = YColor.Black;
    this._borderthickness = 1;
    this._padding = 10;
    this._verticalMargin = 10;
    this._horizontalMargin = 10;
    this._traceWidthFactor = 1;
  }
  get summary() {
    return this._enabled ? "Enabled" : "Disabled";
  }
  get ATTR_enabled__DisplayName() {
    return "Enabled";
  }
  get ATTR_enabled__ChangeCausesParentRefreshAttribute() {
    return true;
  }
  get ATTR_enabled__DescriptionAttribute() {
    return "Should the legend panel be shown or not";
  }
  get enabled() {
    return this._enabled;
  }
  set enabled(value) {
    this._enabled = value;
  }
  get ATTR_overlap__DisplayName() {
    return "Overlap";
  }
  get ATTR_overlap__DescriptionAttribute() {
    return "Can the panel overlap the graph data, or should we explicitly make space for it?";
  }
  get overlap() {
    return this._overlap;
  }
  set overlap(value) {
    this._overlap = value;
  }
  get ATTR_position__DisplayName() {
    return "Position";
  }
  get ATTR_position__DescriptionAttribute() {
    return "Position of the legend panel";
  }
  get position() {
    return this._position;
  }
  set position(value) {
    this._position = value;
  }
  get ATTR_font__DisplayName() {
    return "Font";
  }
  get ATTR_font__ReadOnlyAttribute() {
    return true;
  }
  get ATTR_font__DescriptionAttribute() {
    return "Legend panel contents fonts";
  }
  get font() {
    return this._font;
  }
  set font(value) {
    this._font = value;
  }
  get ATTR_bgColor__DisplayName() {
    return "Background color ";
  }
  get ATTR_bgColor__DescriptionAttribute() {
    return "Legend panel background color.";
  }
  get bgColor() {
    return this._bgColor;
  }
  set bgColor(value) {
    this._bgColor = value;
  }
  get ATTR_borderColor__DisplayName() {
    return "Border color ";
  }
  get ATTR_borderColor__DescriptionAttribute() {
    return "Legend panel border color.";
  }
  get borderColor() {
    return this._borderColor;
  }
  set borderColor(value) {
    this._borderColor = value;
  }
  get ATTR_borderthickness__DisplayName() {
    return "Border thickness ";
  }
  get ATTR_borderthickness__DescriptionAttribute() {
    return "Legend panel border thickness";
  }
  get borderthickness() {
    return this._borderthickness;
  }
  set borderthickness(value) {
    this._borderthickness = value;
  }
  get ATTR_padding__DisplayName() {
    return "Padding ";
  }
  get ATTR_padding__DescriptionAttribute() {
    return "Distance between the panel border and the panel contents";
  }
  get padding() {
    return this._padding;
  }
  set padding(value) {
    this._padding = value;
  }
  get ATTR_verticalMargin__DisplayName() {
    return "Vertical margin ";
  }
  get ATTR_verticalMargin__DescriptionAttribute() {
    return "Vertical distance between the panel border and its surroundings";
  }
  get verticalMargin() {
    return this._verticalMargin;
  }
  set verticalMargin(value) {
    this._verticalMargin = value;
  }
  get ATTR_horizontalMargin__DisplayName() {
    return "Horizontal margin ";
  }
  get ATTR_horizontalMargin__DescriptionAttribute() {
    return "Distance between the panel border and its surroundings";
  }
  get horizontalMargin() {
    return this._horizontalMargin;
  }
  set horizontalMargin(value) {
    this._horizontalMargin = value;
  }
  get ATTR_traceWidthFactor__DisplayName() {
    return "Color Indicator Factor";
  }
  get ATTR_traceWidthFactor__DescriptionAttribute() {
    return "Factor used to enlarge series color indicators shown in the legend panel";
  }
  get traceWidthFactor() {
    return this._traceWidthFactor;
  }
  set traceWidthFactor(value) {
    this._traceWidthFactor = value;
  }
};
var AnnotationPanelDescription = class {
  constructor(hrzAlignInit, vrtAlignInit, offsetY, overlap, textInit, BgColorInit, BorderColorInit, fontSizeInit, FontColorInit) {
    this._enabled = false;
    this._overlap = false;
    this._text = "Date: $DAY$/$MONTH$/$YEAR$";
    this._panelTextAlign = GenericPanel.TextAlign.CENTER;
    this._panelHrzAlign = GenericPanel.HorizontalAlignPos.CENTER;
    this._positionOffsetX = 0;
    this._panelVrtAlign = GenericPanel.VerticalAlignPos.TOP;
    this._positionOffsetY = 0;
    this._font = new FontDescription("Arial", 12, YColor.FromArgb(255, 32, 32, 32), false, false);
    this._bgColor = YColor.FromArgb(200, 255, 255, 255);
    this._borderColor = YColor.Black;
    this._borderthickness = 1;
    this._padding = 5;
    if (typeof textInit != "undefined")
      this._text = textInit;
    if (typeof offsetY != "undefined")
      this._positionOffsetY = offsetY;
    if (typeof overlap != "undefined")
      this._overlap = overlap;
    if (typeof BgColorInit != "undefined")
      this._bgColor = BgColorInit;
    if (typeof BorderColorInit != "undefined")
      this._borderColor = BorderColorInit;
    if (typeof fontSizeInit != "undefined")
      this._font.size = fontSizeInit;
    if (typeof FontColorInit != "undefined")
      this._font.color = FontColorInit;
    if (typeof vrtAlignInit != "undefined")
      this._panelVrtAlign = vrtAlignInit;
    if (typeof hrzAlignInit != "undefined")
      this._panelHrzAlign = hrzAlignInit;
  }
  get summary() {
    return this._enabled ? "Enabled" : "Disabled";
  }
  get ATTR_enabled__DisplayName() {
    return "Enabled";
  }
  get ATTR_enabled__ChangeCausesParentRefreshAttribute() {
    return true;
  }
  get ATTR_enabled__DescriptionAttribute() {
    return "Should the annotation panel be shown or not";
  }
  get enabled() {
    return this._enabled;
  }
  set enabled(value) {
    this._enabled = value;
  }
  get ATTR_overlap__DisplayName() {
    return "Overlap";
  }
  get ATTR_overlap__ChangeCausesParentRefreshAttribute() {
    return true;
  }
  get ATTR_overlap__DescriptionAttribute() {
    return "Can the annotation panel overlap the display zone, or should the display zone be squeezed to make space for the panel?";
  }
  get overlap() {
    return this._overlap;
  }
  set overlap(value) {
    this._overlap = value;
  }
  get ATTR_text__DisplayName() {
    return "Text ";
  }
  get ATTR_text__DescriptionAttribute() {
    return GenericHints.Annotation;
  }
  get text() {
    return this._text;
  }
  set text(value) {
    this._text = value;
  }
  get ATTR_panelTextAlign__DisplayName() {
    return "Text Alignment";
  }
  get ATTR_panelTextAlign__DescriptionAttribute() {
    return "How text is aligned, makes sense on multi-lines text only.";
  }
  get panelTextAlign() {
    return this._panelTextAlign;
  }
  set panelTextAlign(value) {
    this._panelTextAlign = value;
  }
  get ATTR_panelHrzAlign__DisplayName() {
    return "X Position";
  }
  get ATTR_panelHrzAlign__ChangeCausesParentRefreshAttribute() {
    return true;
  }
  get ATTR_panelHrzAlign__DescriptionAttribute() {
    return "Annotation panel X position";
  }
  get panelHrzAlign() {
    return this._panelHrzAlign;
  }
  set panelHrzAlign(value) {
    this._panelHrzAlign = value;
  }
  get ATTR_positionOffsetX__DisplayName() {
    return "X Offset";
  }
  get ATTR_positionOffsetX__DescriptionAttribute() {
    return "X Position offset, in %  (overlap mode only)";
  }
  get positionOffsetX() {
    return this._positionOffsetX;
  }
  set positionOffsetX(value) {
    this._positionOffsetX = value;
  }
  get ATTR_panelVrtAlign__DisplayName() {
    return "Y Position";
  }
  get ATTR_panelVrtAlign__ChangeCausesParentRefreshAttribute() {
    return true;
  }
  get ATTR_panelVrtAlign__DescriptionAttribute() {
    return "Annotation panel Y position";
  }
  get panelVrtAlign() {
    return this._panelVrtAlign;
  }
  set panelVrtAlign(value) {
    this._panelVrtAlign = value;
  }
  get ATTR_positionOffsetY__DisplayName() {
    return "Y Offset";
  }
  get ATTR_positionOffsetY__DescriptionAttribute() {
    return "Y Position offset, in %  (overlap mode only)";
  }
  get positionOffsetY() {
    return this._positionOffsetY;
  }
  set positionOffsetY(value) {
    this._positionOffsetY = value;
  }
  get ATTR_font__DisplayName() {
    return "Font";
  }
  get ATTR_font__ReadOnlyAttribute() {
    return true;
  }
  get ATTR_font__DescriptionAttribute() {
    return "Panel font";
  }
  get font() {
    return this._font;
  }
  set font(value) {
    this._font = value;
  }
  get ATTR_bgColor__DisplayName() {
    return "Background color ";
  }
  get ATTR_bgColor__DescriptionAttribute() {
    return "Legend panel background color.";
  }
  get bgColor() {
    return this._bgColor;
  }
  set bgColor(value) {
    this._bgColor = value;
  }
  get ATTR_borderColor__DisplayName() {
    return "Border color ";
  }
  get ATTR_borderColor__DescriptionAttribute() {
    return "Legend panel border color.";
  }
  get borderColor() {
    return this._borderColor;
  }
  set borderColor(value) {
    this._borderColor = value;
  }
  get ATTR_borderthickness__DisplayName() {
    return "Border thickness ";
  }
  get ATTR_borderthickness__DescriptionAttribute() {
    return "Panel border thickness";
  }
  get borderthickness() {
    return this._borderthickness;
  }
  set borderthickness(value) {
    this._borderthickness = value;
  }
  get ATTR_padding__DisplayName() {
    return "Padding ";
  }
  get ATTR_padding__DescriptionAttribute() {
    return "Distance between the panel border and the panel contents";
  }
  get padding() {
    return this._padding;
  }
  set padding(value) {
    this._padding = value;
  }
};
var AnnotationPanelDescriptionGraph = class extends AnnotationPanelDescription {
  get ATTR_enabled__DisplayName() {
    return "Enabled";
  }
  get ATTR_enabled__ChangeCausesParentRefreshAttribute() {
    return true;
  }
  get ATTR_enabled__DescriptionAttribute() {
    return "Should the annotation panel be shown or not";
  }
  get enabled() {
    return this._enabled;
  }
  set enabled(value) {
    this._enabled = value;
  }
  get ATTR_overlap__DisplayName() {
    return "Overlap";
  }
  get ATTR_overlap__ChangeCausesParentRefreshAttribute() {
    return true;
  }
  get ATTR_overlap__DescriptionAttribute() {
    return "Can the annotation panel overlap the graph, or should the graph be squeezed to make space for the panel?";
  }
  get overlap() {
    return this._overlap;
  }
  set overlap(value) {
    this._overlap = value;
  }
  get ATTR_text__DisplayName() {
    return "Text ";
  }
  get ATTR_text__DescriptionAttribute() {
    return GenericHints.AnnotationGraph;
  }
  get text() {
    return this._text;
  }
  set text(value) {
    this._text = value;
  }
};
var DataTrackerDescription = class {
  constructor() {
    this._enabled = false;
    this._showSerieName = false;
    this._showTimeStamp = false;
    this._dataPrecision = DataTrackerDescription.DataPrecision.PRECISION_NOLIMIT;
    this._diameter = 5;
    this._handleLength = 25;
    this._font = new FontDescription("Arial", 7, YColor.FromArgb(255, 32, 32, 32), false, false);
    this._bgColor = YColor.FromArgb(200, 255, 255, 255);
    this._borderColor = YColor.Black;
    this._borderthickness = 1;
    this._padding = 5;
    this._detectionDistance = 50;
  }
  get summary() {
    return this._enabled ? "Enabled" : "Disabled";
  }
  get ATTR_enabled__DisplayName() {
    return "Enabled";
  }
  get ATTR_enabled__ChangeCausesParentRefreshAttribute() {
    return true;
  }
  get ATTR_enabled__DescriptionAttribute() {
    return "Should the data tracker be shown or not.";
  }
  get enabled() {
    return this._enabled;
  }
  set enabled(value) {
    this._enabled = value;
  }
  get ATTR_showSerieName__DisplayName() {
    return "Show Series legend";
  }
  get ATTR_showSerieName__DescriptionAttribute() {
    return "Should the data tracker show the value's series legend.";
  }
  get showSerieName() {
    return this._showSerieName;
  }
  set showSerieName(value) {
    this._showSerieName = value;
  }
  get ATTR_showTimeStamp__DisplayName() {
    return "Show Timestamp";
  }
  get ATTR_showTimeStamp__DescriptionAttribute() {
    return "Should the data tracker show the value's timestamp.";
  }
  get showTimeStamp() {
    return this._showTimeStamp;
  }
  set showTimeStamp(value) {
    this._showTimeStamp = value;
  }
  get ATTR_dataPrecision__DisplayName() {
    return "Precision";
  }
  get ATTR_dataPrecision__DescriptionAttribute() {
    return "A way to limit data precision to meaningful digits in the data tracker.";
  }
  get dataPrecision() {
    return this._dataPrecision;
  }
  set dataPrecision(value) {
    this._dataPrecision = value;
  }
  get ATTR_diameter__DisplayName() {
    return "Point Diameter";
  }
  get ATTR_diameter__DescriptionAttribute() {
    return "Data point diameter, in pixels";
  }
  get diameter() {
    return this._diameter;
  }
  set diameter(value) {
    this._diameter = value;
  }
  get ATTR_handleLength__DisplayName() {
    return "Handle size";
  }
  get ATTR_handleLength__DescriptionAttribute() {
    return "size of the handle between the data point and the value panel";
  }
  get handleLength() {
    return this._handleLength;
  }
  set handleLength(value) {
    this._handleLength = value;
  }
  get ATTR_font__DisplayName() {
    return "Font";
  }
  get ATTR_font__ReadOnlyAttribute() {
    return true;
  }
  get ATTR_font__DescriptionAttribute() {
    return "Data tracker label fonts";
  }
  get font() {
    return this._font;
  }
  set font(value) {
    this._font = value;
  }
  get ATTR_bgColor__DisplayName() {
    return "Background color";
  }
  get ATTR_bgColor__DescriptionAttribute() {
    return "Value panel ground color.";
  }
  get bgColor() {
    return this._bgColor;
  }
  set bgColor(value) {
    this._bgColor = value;
  }
  get ATTR_borderColor__DisplayName() {
    return "Border color";
  }
  get ATTR_borderColor__DescriptionAttribute() {
    return "Value panel border and handle  color.";
  }
  get borderColor() {
    return this._borderColor;
  }
  set borderColor(value) {
    this._borderColor = value;
  }
  get ATTR_borderthickness__DisplayName() {
    return "Border thickness ";
  }
  get ATTR_borderthickness__DescriptionAttribute() {
    return "Value panel border and handle  thickness";
  }
  get borderthickness() {
    return this._borderthickness;
  }
  set borderthickness(value) {
    this._borderthickness = value;
  }
  get ATTR_padding__DisplayName() {
    return "Padding";
  }
  get ATTR_padding__DescriptionAttribute() {
    return "Distance between the panel border and its contents ";
  }
  get padding() {
    return this._padding;
  }
  set padding(value) {
    this._padding = value;
  }
  get ATTR_detectionDistance__DisplayName() {
    return "Detection distance";
  }
  get ATTR_detectionDistance__DescriptionAttribute() {
    return "Maximum distance, in pixels, between the mouse and a data point for data tracker to show. Use zero for infinite distance";
  }
  get detectionDistance() {
    return this._detectionDistance;
  }
  set detectionDistance(value) {
    this._detectionDistance = value;
  }
};
(function(DataTrackerDescription2) {
  class DataPrecisionEnumItem extends YEnumItem {
    constructor(value, humanreadable, container) {
      super(value, humanreadable, DataPrecision);
    }
  }
  DataTrackerDescription2.DataPrecisionEnumItem = DataPrecisionEnumItem;
  class DataPrecision extends YEnum {
  }
  DataPrecision.PRECISION_NOLIMIT = new DataPrecisionEnumItem("PRECISION_NOLIMIT", "As is");
  DataPrecision.PRECISION_1 = new DataPrecisionEnumItem("PRECISION_1", "1");
  DataPrecision.PRECISION_01 = new DataPrecisionEnumItem("PRECISION_01", "0.1");
  DataPrecision.PRECISION_001 = new DataPrecisionEnumItem("PRECISION_001", "0.01");
  DataPrecision.PRECISION_0001 = new DataPrecisionEnumItem("PRECISION_0001", "0.001");
  DataTrackerDescription2.DataPrecision = DataPrecision;
})(DataTrackerDescription || (DataTrackerDescription = {}));
var NavigatorDescription = class {
  constructor() {
    this._enabled = false;
    this._bgColor1 = YColor.FromArgb(255, 225, 225, 225);
    this._bgColor2 = YColor.FromArgb(255, 225, 225, 225);
    this._borderThickness = 1;
    this._borderColor = YColor.Black;
    this._cursorColor = YColor.FromArgb(25, 0, 255, 0);
    this._cursorBorderColor = YColor.FromArgb(255, 96, 96, 96);
    this._yAxisHandling = Navigator.YAxisHandling.AUTO;
    this._xAxisThickness = 1;
    this._xAxisColor = YColor.Black;
    this._font = new FontDescription("Arial", 10, YColor.FromArgb(255, 32, 32, 32), false, false);
  }
  get summary() {
    return this._enabled ? "Enabled" : "Disabled";
  }
  get ATTR_enabled__DisplayName() {
    return "Enabled";
  }
  get ATTR_enabled__ChangeCausesParentRefreshAttribute() {
    return true;
  }
  get ATTR_enabled__DescriptionAttribute() {
    return "Should the navigator be shown or not.";
  }
  get enabled() {
    return this._enabled;
  }
  set enabled(value) {
    this._enabled = value;
  }
  get ATTR_bgColor1__DisplayName() {
    return "Background color 1";
  }
  get ATTR_bgColor1__DescriptionAttribute() {
    return "Navigator background gradient color 1.";
  }
  get bgColor1() {
    return this._bgColor1;
  }
  set bgColor1(value) {
    this._bgColor1 = value;
  }
  get ATTR_bgColor2__DisplayName() {
    return "Background color 2";
  }
  get ATTR_bgColor2__DescriptionAttribute() {
    return "Navigator background gradient color 2.";
  }
  get bgColor2() {
    return this._bgColor2;
  }
  set bgColor2(value) {
    this._bgColor2 = value;
  }
  get ATTR_borderThickness__DisplayName() {
    return "Border thickness";
  }
  get ATTR_borderThickness__DescriptionAttribute() {
    return "Navigator";
  }
  get borderThickness() {
    return this._borderThickness;
  }
  set borderThickness(value) {
    this._borderThickness = value;
  }
  get ATTR_borderColor__DisplayName() {
    return "Border color";
  }
  get ATTR_borderColor__DescriptionAttribute() {
    return "Navigator Border color.";
  }
  get borderColor() {
    return this._borderColor;
  }
  set borderColor(value) {
    this._borderColor = value;
  }
  get ATTR_cursorColor__DisplayName() {
    return "Navigator cursor fill color";
  }
  get ATTR_cursorColor__DescriptionAttribute() {
    return "Navigator";
  }
  get cursorColor() {
    return this._cursorColor;
  }
  set cursorColor(value) {
    this._cursorColor = value;
  }
  get ATTR_cursorBorderColor__DisplayName() {
    return "Navigator cursor left/right border color.";
  }
  get ATTR_cursorBorderColor__DescriptionAttribute() {
    return "Navigator";
  }
  get cursorBorderColor() {
    return this._cursorBorderColor;
  }
  set cursorBorderColor(value) {
    this._cursorBorderColor = value;
  }
  get ATTR_yAxisHandling__DisplayName() {
    return "Y axis range";
  }
  get ATTR_yAxisHandling__DescriptionAttribute() {
    return "Is navigator Y axis zoom automatic or inherited from main view settings?";
  }
  get yAxisHandling() {
    return this._yAxisHandling;
  }
  set yAxisHandling(value) {
    this._yAxisHandling = value;
  }
  get ATTR_xAxisThickness__DisplayName() {
    return "X axis thickness";
  }
  get ATTR_xAxisThickness__DescriptionAttribute() {
    return "Navigator";
  }
  get xAxisThickness() {
    return this._xAxisThickness;
  }
  set xAxisThickness(value) {
    this._xAxisThickness = value;
  }
  get ATTR_xAxisColor__DisplayName() {
    return "X axis color";
  }
  get ATTR_xAxisColor__DescriptionAttribute() {
    return "Navigator X axis color.";
  }
  get xAxisColor() {
    return this._xAxisColor;
  }
  set xAxisColor(value) {
    this._xAxisColor = value;
  }
  get ATTR_font__DisplayName() {
    return "X-Axis Font";
  }
  get ATTR_font__ReadOnlyAttribute() {
    return true;
  }
  get ATTR_font__DescriptionAttribute() {
    return "Navigator X axis font";
  }
  get font() {
    return this._font;
  }
  set font(value) {
    this._font = value;
  }
};
var LegendDescription = class {
  constructor() {
    this._title = "";
    this._font = new FontDescription("Arial", 12, YColor.Black, false, true);
  }
  get ATTR_title__DisplayName() {
    return "Text";
  }
  get ATTR_title__DescriptionAttribute() {
    return "Legend text";
  }
  get title() {
    return this._title;
  }
  set title(value) {
    this._title = value;
  }
  get ATTR_font__DisplayName() {
    return "Font";
  }
  get ATTR_font__ReadOnlyAttribute() {
    return true;
  }
  get ATTR_font__DescriptionAttribute() {
    return "Legend font";
  }
  get font() {
    return this._font;
  }
  set font(value) {
    this._font = value;
  }
};
var YaxisDescription = class {
  constructor(index, shown) {
    this._visible = false;
    this._position = YAxis.HrzPosition.LEFT;
    this._min = new doubleNan(Number.NaN);
    this._max = new doubleNan(Number.NaN);
    this._step = new doubleNan(Number.NaN);
    this._color = YColor.FromArgb(255, 127, 127, 127);
    this._thickness = 1;
    this._showGrid = false;
    this._gridColor = YColor.FromArgb(255, 210, 210, 210);
    this._gridThickness = 1;
    this._font = new FontDescription("Arial", 10, YColor.Black, false, false);
    this._legend = new LegendDescription();
    this._zones0 = new ZoneDescription(0, 50, YColor.LightGreen);
    this._zones1 = new ZoneDescription(50, 80, YColor.Yellow);
    this._zones2 = new ZoneDescription(80, 100, YColor.Red);
    this._visible = shown;
    this._showGrid = index == 0;
    this._position = index == 0 ? YAxis.HrzPosition.LEFT : YAxis.HrzPosition.RIGHT;
  }
  get summary() {
    return this._visible ? "Enabled" : "Disabled";
  }
  get ATTR_visible__DisplayName() {
    return "Visible";
  }
  get ATTR_visible__ChangeCausesParentRefreshAttribute() {
    return true;
  }
  get ATTR_visible__DescriptionAttribute() {
    return "Should that YAxis be shown?.";
  }
  get visible() {
    return this._visible;
  }
  set visible(value) {
    this._visible = value;
  }
  get ATTR_position__DisplayName() {
    return "Position";
  }
  get ATTR_position__DescriptionAttribute() {
    return "Y Axis position (left / right)";
  }
  get position() {
    return this._position;
  }
  set position(value) {
    this._position = value;
  }
  get ATTR_min__DisplayName() {
    return "Minimum value";
  }
  get ATTR_min__DescriptionAttribute() {
    return "YAxis minimum value, leave blank for automatic behavior.";
  }
  get min() {
    return this._min;
  }
  set min(value) {
    this._min = value;
  }
  get ATTR_max__DisplayName() {
    return "Maximum value";
  }
  get ATTR_max__DescriptionAttribute() {
    return "YAxis maximum value, leave blank for automatic behavior.";
  }
  get max() {
    return this._max;
  }
  set max(value) {
    this._max = value;
  }
  get ATTR_step__DisplayName() {
    return "Steps";
  }
  get ATTR_step__DescriptionAttribute() {
    return "YAxis step size, leave blank for automatic behavior.";
  }
  get step() {
    return this._step;
  }
  set step(value) {
    this._step = value;
  }
  get ATTR_color__DisplayName() {
    return "Color";
  }
  get ATTR_color__DescriptionAttribute() {
    return "Y Axis Color.";
  }
  get color() {
    return this._color;
  }
  set color(value) {
    this._color = value;
  }
  get ATTR_thickness__DisplayName() {
    return "Thickness";
  }
  get ATTR_thickness__DescriptionAttribute() {
    return "Axis thickness";
  }
  get thickness() {
    return this._thickness;
  }
  set thickness(value) {
    this._thickness = value;
  }
  get ATTR_showGrid__DisplayName() {
    return "Show Grid";
  }
  get ATTR_showGrid__DescriptionAttribute() {
    return "Show grid horizontal lines, or not.";
  }
  get showGrid() {
    return this._showGrid;
  }
  set showGrid(value) {
    this._showGrid = value;
  }
  get ATTR_gridColor__DisplayName() {
    return "Grid Color";
  }
  get ATTR_gridColor__DescriptionAttribute() {
    return "Grid horizontal lines color.";
  }
  get gridColor() {
    return this._gridColor;
  }
  set gridColor(value) {
    this._gridColor = value;
  }
  get ATTR_gridThickness__DisplayName() {
    return "Grid thickness";
  }
  get ATTR_gridThickness__DescriptionAttribute() {
    return "Grid horizontal lines thickness";
  }
  get gridThickness() {
    return this._gridThickness;
  }
  set gridThickness(value) {
    this._gridThickness = value;
  }
  get ATTR_font__DisplayName() {
    return "Font";
  }
  get ATTR_font__ReadOnlyAttribute() {
    return true;
  }
  get ATTR_font__DescriptionAttribute() {
    return "Axis font";
  }
  get font() {
    return this._font;
  }
  set font(value) {
    this._font = value;
  }
  get ATTR_legend__DisplayName() {
    return "Legend";
  }
  get ATTR_legend__DescriptionAttribute() {
    return "Axis legend";
  }
  get legend() {
    return this._legend;
  }
  set legend(value) {
    this._legend = value;
  }
  get ATTR_zones0__DisplayName() {
    return "Zone 1";
  }
  get ATTR_zones0__CategoryAttribute() {
    return "Zones";
  }
  get ATTR_zones0__ReadOnlyAttribute() {
    return true;
  }
  get ATTR_zones0__DescriptionAttribute() {
    return "Zone 1 parameters";
  }
  get zones0() {
    return this._zones0;
  }
  set zones0(value) {
    this._zones0 = value;
  }
  get ATTR_zones1__DisplayName() {
    return "Zone 2";
  }
  get ATTR_zones1__CategoryAttribute() {
    return "Zones";
  }
  get ATTR_zones1__ReadOnlyAttribute() {
    return true;
  }
  get ATTR_zones1__DescriptionAttribute() {
    return "Zone 2 parameters";
  }
  get zones1() {
    return this._zones1;
  }
  set zones1(value) {
    this._zones1 = value;
  }
  get ATTR_zones2__DisplayName() {
    return "Zone 3";
  }
  get ATTR_zones2__CategoryAttribute() {
    return "Zones";
  }
  get ATTR_zones2__ReadOnlyAttribute() {
    return true;
  }
  get ATTR_zones2__DescriptionAttribute() {
    return "Zone 3 parameters";
  }
  get zones2() {
    return this._zones2;
  }
  set zones2(value) {
    this._zones2 = value;
  }
};
var MarkerDescription = class {
  constructor(defaultText) {
    this._enabled = false;
    this._text = "";
    this._textAlign = Marker.TextAlign.CENTER;
    this._timereference = TimeConverter.TimeReference.ABSOLUTE;
    this._positionOnXAxis = new xAxisPosition(TimeConverter.ToUnixTime(new Date()), false);
    this._yposition = 95;
    this._bgColor = YColor.FromArgb(200, 255, 255, 192);
    this._borderColor = YColor.DarkRed;
    this._borderthickness = 1;
    this._padding = 5;
    this._font = new FontDescription("Arial", 7, YColor.Black, false, false);
    this._text = defaultText;
  }
  get summary() {
    return this._enabled ? "Enabled" : "Disabled";
  }
  get ATTR_enabled__DisplayName() {
    return "Enabled";
  }
  get ATTR_enabled__ChangeCausesParentRefreshAttribute() {
    return true;
  }
  get ATTR_enabled__DescriptionAttribute() {
    return "Should that marker be shown?.";
  }
  get enabled() {
    return this._enabled;
  }
  set enabled(value) {
    this._enabled = value;
  }
  get ATTR_text__DisplayName() {
    return "Text";
  }
  get ATTR_text__DescriptionAttribute() {
    return "Marker text. Use \\n for multi-line text. Some variables are allowed such as $MARKERTIME$, $LEGEND1$, $VALUE1$, $UNIT1$, $LEGEND1$, $VALUE2$ etc.. Extensive use of marker variables migh make the graph rendering significantly slower.";
  }
  get text() {
    return this._text;
  }
  set text(value) {
    this._text = value;
  }
  get ATTR_textAlign__DisplayName() {
    return "Text Alignment";
  }
  get ATTR_textAlign__DescriptionAttribute() {
    return "How text is aligned, makes sense on multi-lines text only.";
  }
  get textAlign() {
    return this._textAlign;
  }
  set textAlign(value) {
    this._textAlign = value;
  }
  get ATTR_timereference__DisplayName() {
    return "Time reference";
  }
  get ATTR_timereference__ChangeCausesParentRefreshAttribute() {
    return true;
  }
  get ATTR_timereference__NotSavedInXMLAttribute() {
    return true;
  }
  get ATTR_timereference__DescriptionAttribute() {
    return "Should the marker time position be absolute or relative to first data timestamp? Note: relative markers won't be drawn until there is actual data.";
  }
  get timereference() {
    return this._timereference;
  }
  set timereference(value) {
    this._timereference = value;
    this._positionOnXAxis.relative = value == TimeConverter.TimeReference.RELATIVE;
  }
  get ATTR_positionOnXAxis__DisplayName() {
    return "Time position";
  }
  get ATTR_positionOnXAxis__DescriptionAttribute() {
    return "Marker position on X axis.";
  }
  get positionOnXAxis() {
    return this._positionOnXAxis;
  }
  set positionOnXAxis(value) {
    this._positionOnXAxis = value;
    this.timereference = value.relative ? TimeConverter.TimeReference.RELATIVE : TimeConverter.TimeReference.ABSOLUTE;
  }
  get ATTR_yposition__DisplayName() {
    return "Vrt position (%)";
  }
  get ATTR_yposition__DescriptionAttribute() {
    return "Vertical position of the marker label in % of available space. Zero is bottom";
  }
  get yposition() {
    return this._yposition;
  }
  set yposition(value) {
    this._yposition = value;
  }
  get ATTR_bgColor__DisplayName() {
    return "Background color ";
  }
  get ATTR_bgColor__DescriptionAttribute() {
    return "Marker  background color.";
  }
  get bgColor() {
    return this._bgColor;
  }
  set bgColor(value) {
    this._bgColor = value;
  }
  get ATTR_borderColor__DisplayName() {
    return "Border color ";
  }
  get ATTR_borderColor__DescriptionAttribute() {
    return "Marker border color.";
  }
  get borderColor() {
    return this._borderColor;
  }
  set borderColor(value) {
    this._borderColor = value;
  }
  get ATTR_borderthickness__DisplayName() {
    return "Border thickness ";
  }
  get ATTR_borderthickness__DescriptionAttribute() {
    return "Marker border thickness, in pixels.";
  }
  get borderthickness() {
    return this._borderthickness;
  }
  set borderthickness(value) {
    this._borderthickness = value;
  }
  get ATTR_padding__DisplayName() {
    return "Padding ";
  }
  get ATTR_padding__DescriptionAttribute() {
    return "Distance between the marker border and the marker contents, in pixels.";
  }
  get padding() {
    return this._padding;
  }
  set padding(value) {
    this._padding = value;
  }
  get ATTR_font__DisplayName() {
    return "Font";
  }
  get ATTR_font__ReadOnlyAttribute() {
    return true;
  }
  get ATTR_font__DescriptionAttribute() {
    return "Marker Font";
  }
  get font() {
    return this._font;
  }
  set font(value) {
    this._font = value;
  }
};
var XaxisDescription = class {
  constructor() {
    this._initialZoom = 60;
    this._initialOffset = 0;
    this._position = XAxis.VrtPosition.BOTTOM;
    this._timeReference = TimeConverter.TimeReference.ABSOLUTE;
    this._overflowHandling = XAxis.OverflowHandling.SCROLL;
    this._color = YColor.FromArgb(255, 127, 127, 127);
    this._thickness = 1;
    this._showGrid = false;
    this._gridColor = YColor.FromArgb(50, 0, 0, 0);
    this._gridThickness = 1;
    this._font = new FontDescription("Arial", 10, YColor.Black, false, false);
    this._legend = new LegendDescription();
    this._markers0 = new MarkerDescription("Marker 1");
    this._markers1 = new MarkerDescription("Marker 2");
    this._markers2 = new MarkerDescription("Marker 3");
    this._markers3 = new MarkerDescription("Marker 4");
    this._markers4 = new MarkerDescription("Marker 5");
    this._markers5 = new MarkerDescription("Marker 6");
    this._markers6 = new MarkerDescription("Marker 7");
    this._markers7 = new MarkerDescription("Marker 8");
  }
  get ATTR_initialZoom__DisplayName() {
    return "Initial Zoom";
  }
  get ATTR_initialZoom__DescriptionAttribute() {
    return "Zoom level at application startup, i.e. width of the view-port in seconds.";
  }
  get initialZoom() {
    return this._initialZoom;
  }
  set initialZoom(value) {
    this._initialZoom = value;
  }
  get ATTR_initialOffset__DisplayName() {
    return "Initial Offset";
  }
  get ATTR_initialOffset__DescriptionAttribute() {
    return "Offset of the first data point in percentage of the viewport width. For instance a 50% value will put the first point in the middle of the viewport. This can be used to give some room for datalogger contents.";
  }
  get initialOffset() {
    return this._initialOffset;
  }
  set initialOffset(value) {
    this._initialOffset = value;
  }
  get ATTR_position__DisplayName() {
    return "Position";
  }
  get ATTR_position__DescriptionAttribute() {
    return "X Axis position (top / bottom)";
  }
  get position() {
    return this._position;
  }
  set position(value) {
    this._position = value;
  }
  get ATTR_timeReference__DisplayName() {
    return "Time reference";
  }
  get ATTR_timeReference__DescriptionAttribute() {
    return "Are gradation timestamps absolute or relative to experiment start time? ";
  }
  get timeReference() {
    return this._timeReference;
  }
  set timeReference(value) {
    this._timeReference = value;
  }
  get ATTR_overflowHandling__DisplayName() {
    return "Overflow Handling";
  }
  get ATTR_overflowHandling__DescriptionAttribute() {
    return "What to do when new data are about to reach the graph right border";
  }
  get overflowHandling() {
    return this._overflowHandling;
  }
  set overflowHandling(value) {
    this._overflowHandling = value;
  }
  get ATTR_color__DisplayName() {
    return "Color";
  }
  get ATTR_color__DescriptionAttribute() {
    return "X Axis Color.";
  }
  get color() {
    return this._color;
  }
  set color(value) {
    this._color = value;
  }
  get ATTR_thickness__DisplayName() {
    return "Thickness";
  }
  get ATTR_thickness__DescriptionAttribute() {
    return "Axis thickness";
  }
  get thickness() {
    return this._thickness;
  }
  set thickness(value) {
    this._thickness = value;
  }
  get ATTR_showGrid__DisplayName() {
    return "Show Grid";
  }
  get ATTR_showGrid__DescriptionAttribute() {
    return "Show grid vertical lines, or not.";
  }
  get showGrid() {
    return this._showGrid;
  }
  set showGrid(value) {
    this._showGrid = value;
  }
  get ATTR_gridColor__DisplayName() {
    return "Grid Color";
  }
  get ATTR_gridColor__DescriptionAttribute() {
    return "Grid vertical lines color.";
  }
  get gridColor() {
    return this._gridColor;
  }
  set gridColor(value) {
    this._gridColor = value;
  }
  get ATTR_gridThickness__DisplayName() {
    return "Grid thickness";
  }
  get ATTR_gridThickness__DescriptionAttribute() {
    return "Grid vertical lines thickness";
  }
  get gridThickness() {
    return this._gridThickness;
  }
  set gridThickness(value) {
    this._gridThickness = value;
  }
  get ATTR_font__DisplayName() {
    return "Font";
  }
  get ATTR_font__ReadOnlyAttribute() {
    return true;
  }
  get ATTR_font__DescriptionAttribute() {
    return "Axis font";
  }
  get font() {
    return this._font;
  }
  set font(value) {
    this._font = value;
  }
  get ATTR_legend__DisplayName() {
    return "Legend";
  }
  get ATTR_legend__ReadOnlyAttribute() {
    return true;
  }
  get ATTR_legend__DescriptionAttribute() {
    return "X Axis legend";
  }
  get legend() {
    return this._legend;
  }
  set legend(value) {
    this._legend = value;
  }
  get ATTR_markers0__DisplayName() {
    return "Marker 1";
  }
  get ATTR_markers0__ReadOnlyAttribute() {
    return true;
  }
  get ATTR_markers0__CategoryAttribute() {
    return "Markers";
  }
  get ATTR_markers0__DescriptionAttribute() {
    return "First marker parameters";
  }
  get markers0() {
    return this._markers0;
  }
  set markers0(value) {
    this._markers0 = value;
  }
  get ATTR_markers1__DisplayName() {
    return "Marker 2";
  }
  get ATTR_markers1__ReadOnlyAttribute() {
    return true;
  }
  get ATTR_markers1__CategoryAttribute() {
    return "Markers";
  }
  get ATTR_markers1__DescriptionAttribute() {
    return "Second marker parameters";
  }
  get markers1() {
    return this._markers1;
  }
  set markers1(value) {
    this._markers1 = value;
  }
  get ATTR_markers2__DisplayName() {
    return "Marker 3";
  }
  get ATTR_markers2__ReadOnlyAttribute() {
    return true;
  }
  get ATTR_markers2__CategoryAttribute() {
    return "Markers";
  }
  get ATTR_markers2__DescriptionAttribute() {
    return "Third marker parameters";
  }
  get markers2() {
    return this._markers2;
  }
  set markers2(value) {
    this._markers2 = value;
  }
  get ATTR_markers3__DisplayName() {
    return "Marker 4";
  }
  get ATTR_markers3__ReadOnlyAttribute() {
    return true;
  }
  get ATTR_markers3__CategoryAttribute() {
    return "Markers";
  }
  get ATTR_markers3__DescriptionAttribute() {
    return "Fourth marker parameters";
  }
  get markers3() {
    return this._markers3;
  }
  set markers3(value) {
    this._markers3 = value;
  }
  get ATTR_markers4__DisplayName() {
    return "Marker 5";
  }
  get ATTR_markers4__ReadOnlyAttribute() {
    return true;
  }
  get ATTR_markers4__CategoryAttribute() {
    return "Markers";
  }
  get ATTR_markers4__DescriptionAttribute() {
    return "Fith marker parameters";
  }
  get markers4() {
    return this._markers4;
  }
  set markers4(value) {
    this._markers4 = value;
  }
  get ATTR_markers5__DisplayName() {
    return "Marker 6";
  }
  get ATTR_markers5__ReadOnlyAttribute() {
    return true;
  }
  get ATTR_markers5__CategoryAttribute() {
    return "Markers";
  }
  get ATTR_markers5__DescriptionAttribute() {
    return "Sixth marker parameters";
  }
  get markers5() {
    return this._markers5;
  }
  set markers5(value) {
    this._markers5 = value;
  }
  get ATTR_markers6__DisplayName() {
    return "Marker 7";
  }
  get ATTR_markers6__ReadOnlyAttribute() {
    return true;
  }
  get ATTR_markers6__CategoryAttribute() {
    return "Markers";
  }
  get ATTR_markers6__DescriptionAttribute() {
    return "Seventh marker parameters";
  }
  get markers6() {
    return this._markers6;
  }
  set markers6(value) {
    this._markers6 = value;
  }
  get ATTR_markers7__DisplayName() {
    return "Marker 8";
  }
  get ATTR_markers7__ReadOnlyAttribute() {
    return true;
  }
  get ATTR_markers7__CategoryAttribute() {
    return "Markers";
  }
  get ATTR_markers7__DescriptionAttribute() {
    return "Height marker parameters";
  }
  get markers7() {
    return this._markers7;
  }
  set markers7(value) {
    this._markers7 = value;
  }
};
var GraphFormProperties = class extends GenericProperties {
  constructor(initData, owner) {
    super(owner);
    this._Graph_series0 = new ChartSerie(YColor.Tomato);
    this._Graph_series1 = new ChartSerie(YColor.DodgerBlue);
    this._Graph_series2 = new ChartSerie(YColor.SeaGreen);
    this._Graph_series3 = new ChartSerie(YColor.Gold);
    this._Graph_showRecordedData = false;
    this._Graph_borderColor = YColor.LightGray;
    this._Graph_borderThickness = 1;
    this._Graph_bgColor1 = YColor.FromArgb(255, 220, 220, 220);
    this._Graph_bgColor2 = YColor.FromArgb(55, 240, 240, 240);
    this._Graph_resizeRule = Proportional.ResizeRule.FIXED;
    this._Graph_xAxis = new XaxisDescription();
    this._Graph_yAxes0 = new YaxisDescription(0, true);
    this._Graph_yAxes1 = new YaxisDescription(1, false);
    this._Graph_yAxes2 = new YaxisDescription(2, false);
    this._Graph_legendPanel = new LegendPanelDescription();
    this._Graph_dataTracker = new DataTrackerDescription();
    this._Graph_navigator = new NavigatorDescription();
    this._annotationPanels0 = new AnnotationPanelDescriptionGraph();
    this._annotationPanels1 = new AnnotationPanelDescriptionGraph();
    this.initFromXmlData(initData);
  }
  IsDataSourceAssigned() {
    let propList = Object.getOwnPropertyNames(this);
    propList.forEach((name) => {
      if (name.startsWith("Graphs_series")) {
        let s = this[name].GetValue(this, null);
        if (!(s.DataSource_source instanceof NullYSensor))
          return true;
      }
    });
    return false;
  }
  get ATTR_Graph_series0__DisplayName() {
    return "Series 1";
  }
  get ATTR_Graph_series0__CategoryAttribute() {
    return "Data Sources";
  }
  get ATTR_Graph_series0__PreExpandedCategoryAttribute() {
    return true;
  }
  get ATTR_Graph_series0__PreExpandedAttribute() {
    return true;
  }
  get ATTR_Graph_series0__ReadOnlyAttribute() {
    return true;
  }
  get ATTR_Graph_series0__DescriptionAttribute() {
    return "First data series, expand for more.";
  }
  get Graph_series0() {
    return this._Graph_series0;
  }
  set Graph_series0(value) {
    this._Graph_series1 = value;
  }
  get ATTR_Graph_series1__DisplayName() {
    return "Series 2";
  }
  get ATTR_Graph_series1__CategoryAttribute() {
    return "Data Sources";
  }
  get ATTR_Graph_series1__ReadOnlyAttribute() {
    return true;
  }
  get ATTR_Graph_series1__DescriptionAttribute() {
    return "Second data series, expand for more.";
  }
  get Graph_series1() {
    return this._Graph_series1;
  }
  set Graph_series1(value) {
    this._Graph_series1 = value;
  }
  get ATTR_Graph_series2__DisplayName() {
    return "Series 3";
  }
  get ATTR_Graph_series2__CategoryAttribute() {
    return "Data Sources";
  }
  get ATTR_Graph_series2__ReadOnlyAttribute() {
    return true;
  }
  get ATTR_Graph_series2__DescriptionAttribute() {
    return "Third data series, expand for more.";
  }
  get Graph_series2() {
    return this._Graph_series2;
  }
  set Graph_series2(value) {
    this._Graph_series2 = value;
  }
  get ATTR_Graph_series3__DisplayName() {
    return "Series 4";
  }
  get ATTR_Graph_series3__CategoryAttribute() {
    return "Data Sources";
  }
  get ATTR_Graph_series3__ReadOnlyAttribute() {
    return true;
  }
  get ATTR_Graph_series3__DescriptionAttribute() {
    return "Fourth data series, expand for more.";
  }
  get Graph_series3() {
    return this._Graph_series3;
  }
  set Graph_series3(value) {
    this._Graph_series3 = value;
  }
  get ATTR_Graph_showRecordedData__DisplayName() {
    return "Use datalogger data";
  }
  get ATTR_Graph_showRecordedData__CategoryAttribute() {
    return "Graph";
  }
  get ATTR_Graph_showRecordedData__CopyToTarget() {
    return false;
  }
  get ATTR_Graph_showRecordedData__DescriptionAttribute() {
    return "Makes the graph load the sensors datalogger contents. After disabling this feature, you may want to reset the dataview with the right-click context menu.";
  }
  get Graph_showRecordedData() {
    return this._Graph_showRecordedData;
  }
  set Graph_showRecordedData(value) {
    if (this._Graph_showRecordedData != value) {
      this._Graph_showRecordedData = value;
      if (this.ownerForm != null) {
        this.ownerForm.showRecordedDatachanged();
      }
    }
  }
  get ATTR_Graph_borderColor__DisplayName() {
    return "Border color";
  }
  get ATTR_Graph_borderColor__CategoryAttribute() {
    return "Graph";
  }
  get ATTR_Graph_borderColor__DescriptionAttribute() {
    return "Canvas borders color.";
  }
  get Graph_borderColor() {
    return this._Graph_borderColor;
  }
  set Graph_borderColor(value) {
    this._Graph_borderColor = value;
  }
  get ATTR_Graph_borderThickness__DisplayName() {
    return "Border thickness";
  }
  get ATTR_Graph_borderThickness__CategoryAttribute() {
    return "Graph";
  }
  get ATTR_Graph_borderThickness__DescriptionAttribute() {
    return "Canvas borders thickness.";
  }
  get Graph_borderThickness() {
    return this._Graph_borderThickness;
  }
  set Graph_borderThickness(value) {
    this._Graph_borderThickness = value;
  }
  get ATTR_Graph_bgColor1__DisplayName() {
    return "Background color 1";
  }
  get ATTR_Graph_bgColor1__CategoryAttribute() {
    return "Graph";
  }
  get ATTR_Graph_bgColor1__DescriptionAttribute() {
    return "Background gradient color 1.";
  }
  get Graph_bgColor1() {
    return this._Graph_bgColor1;
  }
  set Graph_bgColor1(value) {
    this._Graph_bgColor1 = value;
  }
  get ATTR_Graph_bgColor2__DisplayName() {
    return "Background color 2";
  }
  get ATTR_Graph_bgColor2__CategoryAttribute() {
    return "Graph";
  }
  get ATTR_Graph_bgColor2__DescriptionAttribute() {
    return "Background gradient color 2.";
  }
  get Graph_bgColor2() {
    return this._Graph_bgColor2;
  }
  set Graph_bgColor2(value) {
    this._Graph_bgColor2 = value;
  }
  get ATTR_Graph_resizeRule__DisplayName() {
    return "Font sizes";
  }
  get ATTR_Graph_resizeRule__CategoryAttribute() {
    return "Graph";
  }
  get ATTR_Graph_resizeRule__DescriptionAttribute() {
    return "Are font sizes fixed or do they change when window is resized?";
  }
  get Graph_resizeRule() {
    return this._Graph_resizeRule;
  }
  set Graph_resizeRule(value) {
    this._Graph_resizeRule = value;
  }
  get ATTR_Graph_xAxis__DisplayName() {
    return "X Axis";
  }
  get ATTR_Graph_xAxis__CategoryAttribute() {
    return "X/Y Axes";
  }
  get ATTR_Graph_xAxis__ReadOnlyAttribute() {
    return true;
  }
  get ATTR_Graph_xAxis__DescriptionAttribute() {
    return "X-Axis, expand for more";
  }
  get Graph_xAxis() {
    return this._Graph_xAxis;
  }
  set Graph_xAxis(value) {
    this._Graph_xAxis = value;
  }
  get ATTR_Graph_yAxes0__DisplayName() {
    return "YAxis 1";
  }
  get ATTR_Graph_yAxes0__ReadOnlyAttribute() {
    return true;
  }
  get ATTR_Graph_yAxes0__CategoryAttribute() {
    return "X/Y Axes";
  }
  get ATTR_Graph_yAxes0__DescriptionAttribute() {
    return "First Y Axis, expand for more.";
  }
  get Graph_yAxes0() {
    return this._Graph_yAxes0;
  }
  set Graph_yAxes0(value) {
    this._Graph_yAxes0 = value;
  }
  get ATTR_Graph_yAxes1__DisplayName() {
    return "YAxis 2";
  }
  get ATTR_Graph_yAxes1__ReadOnlyAttribute() {
    return true;
  }
  get ATTR_Graph_yAxes1__CategoryAttribute() {
    return "X/Y Axes";
  }
  get ATTR_Graph_yAxes1__DescriptionAttribute() {
    return "Second Y Axis, expand for more.";
  }
  get Graph_yAxes1() {
    return this._Graph_yAxes1;
  }
  set Graph_yAxes1(value) {
    this._Graph_yAxes1 = value;
  }
  get ATTR_Graph_yAxes2__DisplayName() {
    return "YAxis 3";
  }
  get ATTR_Graph_yAxes2__ReadOnlyAttribute() {
    return true;
  }
  get ATTR_Graph_yAxes2__CategoryAttribute() {
    return "X/Y Axes";
  }
  get ATTR_Graph_yAxes2__DescriptionAttribute() {
    return "Third Y Axis, expand for more.";
  }
  get Graph_yAxes2() {
    return this._Graph_yAxes2;
  }
  set Graph_yAxes2(value) {
    this._Graph_yAxes2 = value;
  }
  get ATTR_Graph_legendPanel__DisplayName() {
    return "Legend Panel";
  }
  get ATTR_Graph_legendPanel__ReadOnlyAttribute() {
    return true;
  }
  get ATTR_Graph_legendPanel__CategoryAttribute() {
    return "Graph";
  }
  get ATTR_Graph_legendPanel__DescriptionAttribute() {
    return "Panel containing a description of all data series. Expand for more.";
  }
  get Graph_legendPanel() {
    return this._Graph_legendPanel;
  }
  set Graph_legendPanel(value) {
    this._Graph_legendPanel = value;
  }
  get ATTR_Graph_dataTracker__DisplayName() {
    return "Data tracker";
  }
  get ATTR_Graph_dataTracker__ReadOnlyAttribute() {
    return true;
  }
  get ATTR_Graph_dataTracker__CategoryAttribute() {
    return "Graph";
  }
  get ATTR_Graph_dataTracker__DescriptionAttribute() {
    return "Show dynamic value labels while the mouse is moving over the graph. Expand for more.";
  }
  get Graph_dataTracker() {
    return this._Graph_dataTracker;
  }
  set Graph_dataTracker(value) {
    this._Graph_dataTracker = value;
  }
  get ATTR_Graph_navigator__DisplayName() {
    return "Navigator";
  }
  get ATTR_Graph_navigator__CategoryAttribute() {
    return "Graph";
  }
  get ATTR_Graph_navigator__ReadOnlyAttribute() {
    return true;
  }
  get ATTR_Graph_navigator__DescriptionAttribute() {
    return "Small additional graph showing the whole data set and allowing to quickly navigate among data. Expand for more.";
  }
  get Graph_navigator() {
    return this._Graph_navigator;
  }
  set Graph_navigator(value) {
    this._Graph_navigator = value;
  }
  get ATTR_Graph_annotationPanels0__DisplayName() {
    return "Annotation 1";
  }
  get ATTR_Graph_annotationPanels0__CategoryAttribute() {
    return "Annotations";
  }
  get ATTR_Graph_annotationPanels0__ReadOnlyAttribute() {
    return true;
  }
  get ATTR_Graph_annotationPanels0__DescriptionAttribute() {
    return "Customizable text panel 1";
  }
  get Graph_annotationPanels0() {
    return this._annotationPanels0;
  }
  set Graph_annotationPanels0(value) {
    this._annotationPanels0 = value;
  }
  get ATTR_Graph_annotationPanels1__DisplayName() {
    return "Annotation 2";
  }
  get ATTR_Graph_annotationPanels1__CategoryAttribute() {
    return "Annotations";
  }
  get ATTR_Graph_annotationPanels1__ReadOnlyAttribute() {
    return true;
  }
  get ATTR_Graph_annotationPanels1__DescriptionAttribute() {
    return "Customizable text panel 2";
  }
  get Graph_annotationPanels1() {
    return this._annotationPanels1;
  }
  set Graph_annotationPanels1(value) {
    this._annotationPanels1 = value;
  }
};

// obj/rdonly/contextMenu.js
var ContextMenuSeparator = class {
  constructor() {
    this.TR = document.createElement("TR");
    this.TR["objectData"] = this;
    this.TR.className = ContextMenu.SEPARATOR_MARKER;
    this.TD_caption = document.createElement("TD");
    this.TD_caption.style.backgroundColor = ContextMenu.iconBGColor;
    this.TD_caption.style.paddingLeft = "3px";
    this.TD_caption.style.paddingRight = "3px";
    let hr = document.createElement("HR");
    this.TD_caption.colSpan = 2;
    this.TD_caption.appendChild(hr);
    this.TD_icon = document.createElement("TD");
    this.TD_icon.style.backgroundColor = ContextMenu.captionBgColor;
    this.TR.appendChild(this.TD_icon);
    this.TR.appendChild(this.TD_caption);
  }
  toString() {
    return "Separator";
  }
  get focusable() {
    return false;
  }
  parentMenuisClosing() {
  }
  get domData() {
    return this.TR;
  }
};
var ContextMenuItemBase = class {
  constructor(menu, icon, caption) {
    this._clickHidesMenu = true;
    this._userdata = null;
    this._menu = menu;
    this.TR = document.createElement("TR");
    this.TR["objectData"] = this;
    this.TD_caption = document.createElement("TD");
    this.TD_caption.style.backgroundColor = ContextMenu.iconBGColor;
    this.TD_caption.style.paddingLeft = "3px";
    this.TD_caption.style.paddingRight = "3px";
    this.TD_caption.style.whiteSpace = "nowrap";
    this.TD_icon = document.createElement("TD");
    if (icon != null)
      this.TD_icon.innerHTML = icon;
    this.TD_icon.style.backgroundColor = ContextMenu.captionBgColor;
    this.A_caption = document.createElement("A");
    this.A_caption.innerHTML = caption;
    this.TR.style.cursor = "pointer";
    this.TR.tabIndex = 0;
    this.TR.style.outline = "none";
    this._TR_keydown = (e) => {
      e.preventDefault();
      this.keydown(e);
    };
    this._TR_mouseover = (e) => {
      this.mouserOver(e);
    };
    this._TR_mouseout = (e) => {
      this.mouserOut(e);
    };
    this._A_mouseover = (e) => {
      this.mouserOver(e);
    };
    this._A_mouseout = (e) => {
      this.mouserOut(e);
    };
    this._A_click = (e) => {
      this.activate();
    };
    this._TR_focusin = () => {
      this.focusIn();
    };
    this._TR_focusout = () => {
      this.focusOut();
    };
    this.TR.addEventListener("mouseover", this._TR_mouseover);
    this.TR.addEventListener("mouseout", this._TR_mouseout);
    this.TR.addEventListener("click", this._A_click);
    this.TR.addEventListener("keydown", this._TR_keydown);
    this.A_caption.addEventListener("mouseover", this._A_mouseover);
    this.A_caption.addEventListener("mouseout", this._A_mouseout);
    this.TD_caption.appendChild(this.A_caption);
    this.TR.appendChild(this.TD_icon);
    this.TR.appendChild(this.TD_caption);
    this.TR.addEventListener("focusin", this._TR_focusin);
    this.TR.addEventListener("focusout", this._TR_focusout);
  }
  get userdata() {
    return this._userdata;
  }
  set userdata(value) {
    this._userdata = value;
  }
  toString() {
    return this.TD_caption.innerText;
  }
  get focusable() {
    return this.visible;
  }
  activate() {
  }
  focus() {
    this.TR.focus();
    this._menu.closeSubmenus();
  }
  focusIn() {
    if (this.TD_caption.style.backgroundColor == ContextMenu.iconBGColor)
      this._menu.closeSubmenus();
    this.TD_caption.style.backgroundColor = ContextMenu.ActiveColor;
    this.TD_icon.style.backgroundColor = ContextMenu.ActiveColor;
  }
  focusOut() {
    this.TD_caption.style.backgroundColor = ContextMenu.iconBGColor;
    this.TD_icon.style.backgroundColor = ContextMenu.captionBgColor;
  }
  removeAndDestroy() {
    if (this.TR.parentNode != null)
      this.TR.parentNode.removeChild(this.TR);
    this.TR.removeEventListener("keydown", this._TR_keydown);
    this.TR.removeEventListener("mouseover", this._TR_mouseover);
    this.TR.removeEventListener("mouseout", this._TR_mouseout);
    this.A_caption.removeEventListener("mouseover", this._A_mouseover);
    this.A_caption.removeEventListener("mouseout", this._A_mouseout);
    this.A_caption.removeEventListener("click", this._A_click);
    this.TR.removeEventListener("focusin", this._TR_focusin);
    this.TR.removeEventListener("focusout", this._TR_focusout);
  }
  set caption(value) {
    this.A_caption.innerHTML = value;
  }
  get caption() {
    return this.A_caption.innerHTML;
  }
  keydown(e) {
    if (e.code == "ArrowDown")
      this._menu.activateNext(this);
    if (e.code == "ArrowUp")
      this._menu.activatePrevious(this);
    if (e.code == "Enter")
      this.activate();
    if (e.code == "Escape") {
      this._menu.close();
      if (this._menu.parentMenuItem != null)
        this._menu.parentMenuItem.focus();
    }
    if (e.code == "ArrowLeft") {
      if (this._menu.parentMenuItem != null) {
        this._menu.close();
        this._menu.parentMenuItem.focus();
      }
    }
  }
  mouserOver(e) {
    this.TD_caption.style.backgroundColor = ContextMenu.ActiveColor;
    this.TD_icon.style.backgroundColor = ContextMenu.ActiveColor;
    this._menu.closeSubmenus();
  }
  mouserOut(e) {
    this.TD_caption.style.backgroundColor = ContextMenu.iconBGColor;
    this.TD_icon.style.backgroundColor = ContextMenu.captionBgColor;
  }
  get domData() {
    return this.TR;
  }
  get visible() {
    return this.TR.style.display != "none";
  }
  set visible(value) {
    this.TR.style.display = value ? "" : "none";
  }
  parentMenuisClosing() {
  }
  closeMenu(all) {
    if (all)
      this._menu.closeAll();
    else
      this._menu.close();
  }
};
var ContextMenuItem = class extends ContextMenuItemBase {
  constructor(menu, icon, caption, callback) {
    super(menu, icon, caption);
    this._callback = callback;
    this.TD_caption.colSpan = 2;
  }
  activate() {
    if (this._clickHidesMenu)
      this.closeMenu(true);
    if (this._callback != null)
      this._callback();
  }
};
var ContextMenuItemSubMenuEntry = class extends ContextMenuItem {
  constructor(menu, icon, caption, submenu) {
    super(menu, icon, caption, null);
    this.TD_caption.colSpan = 1;
    this._submenu = submenu;
    this._submenu.parentMenuItem = this;
    this._parentmenu = menu;
    this._clickHidesMenu = false;
    this.TD_arrow = document.createElement("TD");
    this.TD_arrow.style.backgroundColor = ContextMenu.iconBGColor;
    this.TD_arrow.style.textAlign = "right";
    this.TD_arrow.style.paddingRight = "3px";
    this.TD_arrow.innerHTML = "&#9654;";
    this.TR.appendChild(this.TD_arrow);
    this.A_caption.addEventListener("click", (e) => {
      this.showSubmenu();
    });
    this.A_caption.addEventListener("touchstart", (e) => {
      if (e.touches.length == 1)
        this.activate();
    });
    this._submenu.zIndex = this._parentmenu.zIndex + 1;
  }
  keydown(e) {
    super.keydown(e);
    if (e.code == "ArrowRight") {
      this.activate();
      this._submenu.focusFirst();
    }
  }
  removeAndDestroy() {
    this._submenu.close();
    this._submenu.destroy();
    super.removeAndDestroy();
  }
  activate() {
    this.showSubmenu();
  }
  get submenu() {
    return this._submenu;
  }
  showSubmenu() {
    this._submenu.zIndex = this._parentmenu.zIndex + 1;
    let x = 0;
    let y = 0;
    let it = this.TR;
    do {
      x += it.offsetLeft || 0;
      y += it.offsetTop || 0;
      it = it.offsetParent;
    } while (it);
    this._submenu.showContextMenu(x + this._parentmenu.width - 15, y + 5);
  }
  focusIn() {
    super.focusIn();
    this.TD_arrow.style.backgroundColor = ContextMenu.ActiveColor;
  }
  focusOut() {
    super.focusOut();
    this.TD_arrow.style.backgroundColor = ContextMenu.iconBGColor;
  }
  parentMenuisClosing() {
    this._submenu.close();
  }
  mouserOver(e) {
    this.focusIn();
    this._parentmenu.setDelayedAction(() => {
      if (this.visible)
        this.showSubmenu();
    });
  }
  mouserOut(e) {
    this._parentmenu.cancelDelayedAction();
    this.focusOut();
  }
};
var ContextMenuBase = class {
  constructor(baseSize, openCallback, fontFamily) {
    this._visible = false;
    this._zIndex = 100002;
    this._parentmenu = null;
    this._parentMenuItem = null;
    this._userdata = null;
    this._openCallback = openCallback;
    this.Menutable = document.createElement("TABLE");
    this.Menutable.style.position = "absolute";
    this.Menutable.style.border = "1px solid #808080";
    if (typeof fontFamily !== "undefined")
      this.Menutable.style.fontFamily = fontFamily;
    this.Menutable.style.fontSize = (2 * baseSize / 3).toFixed(1) + "px";
    this.Menutable.style.borderSpacing = "0";
    this.Menutable.style.boxShadow = " 4px 4px 4px 1px rgba(0,0,0,0.05)";
    this.Menutable.style.zIndex = this._zIndex.toString();
    this._timer = null;
    this.visible = false;
  }
  get parentMenuItem() {
    return this._parentMenuItem;
  }
  set parentMenuItem(value) {
    this._parentMenuItem = value;
  }
  get userdata() {
    return this._userdata;
  }
  set userdata(value) {
    this._userdata = value;
  }
  closeAll() {
    this.close();
    if (this._parentmenu != null)
      this._parentmenu.closeAll();
  }
  cancelDelayedAction() {
    if (this._timer != null) {
      clearTimeout(this._timer);
      this._timer = null;
    }
  }
  setDelayedAction(action) {
    this.cancelDelayedAction();
    this._timer = setTimeout(() => {
      action();
    }, 500);
  }
  get parentMenu() {
    return this._parentmenu;
  }
  destroy() {
    for (let i = 0; i < this.Menutable.childNodes.length; i++) {
      let item = this.Menutable.childNodes[i]["objectData"];
      item.removeAndDestroy();
    }
    if (this.Menutable.parentNode != null)
      this.Menutable.parentNode.removeChild(this.Menutable);
  }
  focusFirst() {
    for (let i = 0; i < this.Menutable.childNodes.length; i++) {
      let item = this.Menutable.childNodes[i]["objectData"];
      if (item.focusable) {
        item.focus();
        return;
      }
    }
  }
  toString() {
    let res = "";
    for (let i = 0; i < this.Menutable.childNodes.length; i++) {
      let item = this.Menutable.childNodes[i]["objectData"];
      res = res + item.caption + "";
    }
    return res;
  }
  isXYOnMenu(x, y) {
    if (!this.visible)
      return false;
    if (x >= this.Menutable.offsetLeft && x <= this.Menutable.offsetLeft + this.Menutable.offsetWidth && y >= this.Menutable.offsetTop && y <= this.Menutable.offsetTop + this.Menutable.offsetHeight) {
      return true;
    }
    for (let i = 0; i < this.Menutable.childNodes.length; i++) {
      let item = this.Menutable.childNodes[i]["objectData"];
      if (item instanceof ContextMenuItemSubMenuEntry) {
        if (item.submenu.isXYOnMenu(x, y))
          return true;
      }
    }
    return false;
  }
  activateNext(source) {
    let found = false;
    for (let i = 0; i < this.Menutable.childNodes.length; i++) {
      let item = this.Menutable.childNodes[i]["objectData"];
      if (item == source) {
        found = true;
      } else if (found && item.focusable) {
        item.focus();
        return;
      }
    }
  }
  activatePrevious(source) {
    let previous = null;
    for (let i = 0; i < this.Menutable.childNodes.length; i++) {
      let item = this.Menutable.childNodes[i]["objectData"];
      if (item == source) {
        if (previous != null)
          previous.focus();
        return;
      }
      if (item.focusable)
        previous = item;
    }
  }
  get width() {
    return this.Menutable.offsetWidth;
  }
  closeSubmenus() {
    this.closeSubMenusExcept(null);
  }
  get zIndex() {
    return this._zIndex;
  }
  set zIndex(value) {
    this._zIndex = value;
    this.Menutable.style.zIndex = this._zIndex.toString();
  }
  get visible() {
    return this.Menutable.style.display != "none";
  }
  set visible(value) {
    this.Menutable.style.display = value ? "" : "none";
  }
  close() {
    this.cancelDelayedAction();
    for (let i = 0; i < this.Menutable.childNodes.length; i++) {
      let item = this.Menutable.childNodes[i]["objectData"];
      item.parentMenuisClosing();
    }
    this.visible = false;
    this.closeSubmenus();
  }
  refresh() {
    let showSeparation = false;
    for (let i = 0; i < this.Menutable.childNodes.length; i++) {
      let element = this.Menutable.childNodes[i];
      if (element.className == ContextMenu.SEPARATOR_MARKER) {
        element.style.display = showSeparation ? "" : "none";
        showSeparation = false;
      } else if (element.style.display == "")
        showSeparation = true;
    }
  }
  addMenuItem(icon, caption, callback) {
    let menuItem = new ContextMenuItem(this, icon, caption, callback);
    this.Menutable.appendChild(menuItem.domData);
    return menuItem;
  }
  get menuItemsCount() {
    return this.Menutable.childNodes.length;
  }
  closeSubMenusExcept(doNotClose) {
    for (let i = 0; i < this.Menutable.childNodes.length; i++) {
      let item = this.Menutable.childNodes[i]["objectData"];
      if (item instanceof ContextMenuItemSubMenuEntry) {
        if (item.submenu != doNotClose) {
          item.submenu.close();
        }
      }
    }
  }
  subMenuisOpening(source) {
    this.closeSubMenusExcept(source);
  }
  addSubMenuItem(icon, caption, submenu) {
    submenu.zIndex = this.zIndex + 1;
    let menuItem = new ContextMenuItemSubMenuEntry(this, icon, caption, submenu);
    this.Menutable.appendChild(menuItem.domData);
    return menuItem;
  }
  clearAllContents() {
    while (this.Menutable.childNodes.length > 0) {
      let item = this.Menutable.childNodes[0]["objectData"];
      item.removeAndDestroy();
    }
  }
  AddSeparator() {
    let separator = new ContextMenuSeparator();
    this.Menutable.appendChild(separator.domData);
    return separator;
  }
  showContextMenu(x, y) {
  }
};
ContextMenuBase.SEPARATOR_MARKER = "separator";
ContextMenuBase.iconBGColor = "#fdfdfd";
ContextMenuBase.captionBgColor = "#f1f1f1";
ContextMenuBase.ActiveColor = "#c4e1ff";
var ContextSubMenu = class extends ContextMenuBase {
  constructor(baseSize, parentMenu, openCallback, fontFamily) {
    super(baseSize, openCallback, fontFamily);
    this._parentmenu = parentMenu;
    document.body.appendChild(this.Menutable);
  }
  showContextMenu(x, y) {
    if (this._parentmenu != null)
      this._parentmenu.subMenuisOpening(this);
    if (this._openCallback != null)
      this._openCallback(x, y);
    this.Menutable.style.left = x.toString() + "px";
    this.Menutable.style.top = y.toString() + "px";
    this.visible = true;
    let right = this.Menutable.offsetLeft - this.Menutable.scrollLeft + this.Menutable.offsetWidth;
    let bottom = this.Menutable.offsetTop - this.Menutable.scrollTop + this.Menutable.offsetHeight;
    if (right > window.innerWidth)
      this.Menutable.style.left = (x - (right - window.innerWidth)).toString() + "px";
    if (bottom > window.innerHeight)
      this.Menutable.style.top = (y - (bottom - window.innerHeight)).toString() + "px";
  }
};
var ContextMenu = class extends ContextMenuBase {
  constructor(baseSize, openCallback, fontFamily) {
    super(baseSize, openCallback, fontFamily);
    document.addEventListener("contextmenu", (e) => {
      let tagname = "";
      if (e.target != null && constants.RunningOnAndroid)
        tagname = e.target.tagName;
      if (tagname != "INPUT") {
        e.preventDefault();
        this.showContextMenu(e.pageX, e.pageY);
      }
    });
    document.addEventListener("dblclick", (e) => {
      if (constants.dbleClickBringsUpContextMenu)
        this.showContextMenu(e.pageX, e.pageY);
    });
    document.addEventListener("click", (e) => {
      this.click(e);
    });
    document.body.appendChild(this.Menutable);
  }
  click(e) {
    if (!this.visible)
      return;
    if (!this.isXYOnMenu(e.pageX, e.pageY)) {
      this.close();
    }
  }
  showContextMenu(x, y) {
    let z = YWindow.ConTextMenuBestZindex;
    if (z < 0)
      return;
    this.zIndex = z;
    this.Menutable.style.left = x.toString() + "px";
    this.Menutable.style.top = y.toString() + "px";
    this.visible = true;
    let right = this.Menutable.offsetLeft - this.Menutable.scrollLeft + this.Menutable.offsetWidth;
    let bottom = this.Menutable.offsetTop - this.Menutable.scrollTop + this.Menutable.offsetHeight;
    if (right > window.innerWidth)
      this.Menutable.style.left = Math.max(0, x - (right - window.innerWidth)).toString() + "px";
    if (bottom > window.innerHeight)
      this.Menutable.style.top = Math.max(0, y - (bottom - window.innerHeight)).toString() + "px";
    if (this._openCallback != null)
      this._openCallback(x, y);
    if (x <= 5 && y <= 5)
      this.focusFirst();
  }
};

// obj/rdonly/ressources.js
var ressources = class {
  static SVGheader(size, shadowDef, title) {
    let res = '<svg  xmlns="http://www.w3.org/2000/svg" width="' + size + '" height="' + size + '" viewBox="0 0 128  128">';
    if (typeof title != "undefined")
      res = res + "<title>" + title + "</title>";
    if (shadowDef)
      res = res + '<defs><filter id="f1" x="0" y="0"><feGaussianBlur in="SourceGraphic" stdDeviation="2" /></filter></defs>';
    res = res + '<g transform="translate(0,128)"><g transform="scale(1,-1)">';
    return res;
  }
  static SVGFooter() {
    return "</g></g></svg>";
  }
  static addIconTransparency() {
    return '<g opacity="0.5">';
  }
  static addIconSrcCode() {
    return '<path d="m 8 24 L 8 40 L 24 40 L 24 56 L 40 56 L 40 40 L 56 40 L 56 24 L 40 24 L 40 8 L 24 8 L 24 24   Z" fill="#40ff40" stroke="black" stroke-width="8" stroke-linecap="round"/>';
  }
  static deleteIconSrcCode() {
    return '<path d="m 15 4 L 4 15 L 19 29 L 4 43 L 15 55 L 29 40 L 43 55 L 55 43 L 40 29 L 55 15 L 44 4 L 29 18 Z" fill="#ff4040" stroke="black" stroke-width="8" stroke-linecap="round">';
  }
  static IconSourceCode(size, shadow, semitransparent, addIcon, deleteIcon, shadowcode, activeCode, title) {
    let res = ressources.SVGheader(size, shadow, title);
    if (shadow)
      res = res + '<g transform="translate(6,-6)">' + shadowcode + "</g>";
    if (semitransparent)
      res = res + ressources.addIconTransparency();
    res = res + activeCode;
    if (semitransparent)
      res = res + "</g>";
    if (addIcon)
      res = res + ressources.addIconSrcCode();
    if (deleteIcon)
      res = res + ressources.deleteIconSrcCode();
    res = res + ressources.SVGFooter();
    return res;
  }
  static GraphIcon(size, shadow, semitransparent, addIcon, deleteIcon) {
    return ressources.IconSourceCode(size, shadow, semitransparent, addIcon, deleteIcon, '<path d="m 12 24 L 103 24 L 103 107 L 12 107 z" fill="lightgray" filter="url(#f1)" /><path d="m 112 24 L 12 24 L 12 113"  style="fill:none; stroke:lightgray; stroke-width:4px; stroke-linejoin:round;stroke-linecap:round;" filter="url(#f1)"/>', '<path d="m 12 24 L 103 24 L 103 107 L 12 107 z" fill="#ffffe9" /><line x1="43" y1="24" x2="43" y2="107" stroke="#e3e3e3" stroke-width="2" stroke-linecap="round" /><line x1="43" y1="24" x2="43" y2="107" stroke="#e3e3e3" stroke-width="2" stroke-linecap="round" /><line x1="73" y1="24" x2="73" y2="107" stroke="#e3e3e3" stroke-width="2" stroke-linecap="round" /><line x1="12" y1="51" x2="103" y2="51" stroke="#e3e3e3" stroke-width="2" stroke-linecap="round" /><line x1="12" y1="79" x2="103" y2="79" stroke="#e3e3e3" stroke-width="2" stroke-linecap="round" /><line x1="12" y1="107" x2="103" y2="107" stroke="#e3e3e3" stroke-width="2" stroke-linecap="round" /><path d="m 12 77 L 34 65 L 55 85 L 70 77 L 100 93" fill="none" stroke="#FF0000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /><line x1="103" y1="24" x2="103" y2="107" stroke="#e3e3e3" stroke-width="2" stroke-linecap="round" /><path d="m 112 24 L 12 24 L 12 113"  style="fill:none; stroke:black; stroke-width:4px; stroke-linejoin:round;stroke-linecap:round;"/>');
  }
  static SolidGaugeIcon(size, shadow, semitransparent, addIcon, deleteIcon) {
    return ressources.IconSourceCode(size, shadow, semitransparent, addIcon, deleteIcon, '<path d="M 34 40 L 14 40 14 52 A 50 50 0 0 0 114 52 L  114 40 L 94 40 L 94 52 A 30 30 0 1 1  34 52 Z" style="fill:lightgray;fill-opacity=0.4;" filter="url(#f1)"/><text x="43" y="-30" fill="black" transform="scale(1,-1)" style="font: bold 24px sans-serif;fill:lightgray;fill-opacity=0.4;" filter="url(#f1)">123</text>', '<path d="M 34 40 L 14 40 14 52 A 50 50 0 0 0 114 52 L  114 40 L 94 40 L 94 52 A 30 30 0 1 1  34 52 Z" style="fill:#ffffe9; stroke:none; "/><path d="M 34 40 L 14 40 14 52 A 50 50 0 0 0 29 88 L  43 72.5   A 30 30 0 0 1  34 52 Z" style="fill:red; stroke:none;"/><path d="M 34 40 L 14 40 14 52 A 50 50 0 0 0 114 52 L  114 40 L 94 40 L 94 52 A 30 30 0 1 1  34 52 Z" style="fill:none; stroke:black; stroke-width:4px; stroke-linejoin:round;stroke-linecap:round;"/><text x="43" y="-30" fill="black" transform="scale(1,-1)" style="font: bold 24px sans-serif;">123</text>');
  }
  static RawDataIcon(size, shadow, semitransparent, addIcon, deleteIcon) {
    return ressources.IconSourceCode(size, shadow, semitransparent, addIcon, deleteIcon, '<path d="m 16 27 L 107 27 L 107 107 L 16 107 z" fill="lightgray" filter="url(#f1)" />', '<path d="m 16 27 L 107 27 L 107 107 L 16 107 z" style="fill:#ffffe9;" /><line x1="47" y1="27" x2="47" y2="107" stroke="#e3e3e3" stroke-width="2"  /><line x1="76" y1="27" x2="76" y2="107" stroke="#e3e3e3" stroke-width="2"  /><line x1="16" y1="44" x2="107" y2="44" stroke="#e3e3e3" stroke-width="2"  /><line x1="16" y1="60" x2="107" y2="60" stroke="#e3e3e3" stroke-width="2"  /><line x1="16" y1="76" x2="107" y2="76" stroke="#e3e3e3" stroke-width="2"  /><path d="m 16 27 L 107 27 L 107 107 L 16 107 z" style="fill:none;stroke:black; stroke-width:4px; stroke-linejoin:round;" /><path d="m 19 91 L 104 91 L 104 104 L 19 104 z" style="fill:#b2b2b2; stroke:#6f6f6f; stroke-width:4px; stroke-linejoin:round;" /><line x1="47" y1="91" x2="47" y2="104" stroke="#6f6f6f" stroke-width="2"  /><line x1="76" y1="91" x2="76" y2="104" stroke="#6f6f6f" stroke-width="2"  />');
  }
  static ConfigureIcon(size, shadow, semitransparent, addIcon, deleteIcon) {
    return ressources.IconSourceCode(size, shadow, semitransparent, addIcon, deleteIcon, '<path d="M85 85 L 102 80 L 113 91 A  41 100 45 0 0  86 71 L 37 21 A  5 11 45 1 0  21 37 L 71 86  A  41 100 45 0 0  91 113 L 80 102 Z" style="fill:lightgray;fill-opacity=0.4;" filter="url(#f1)"/>', '<path d="M85 85 L 102 80 L 113 91 A  41 100 45 0 0  86 71 L 37 21 A  5 11 45 1 0  21 37 L 71 86  A  41 100 45 0 0  91 113 L 80 102 Z" style="fill:grey; stroke:black; stroke-width:4px; stroke-linejoin:round;stroke-linecap:round;"/>');
  }
  static DigitalDisplayIcon(size, shadow, semitransparent, addIcon, deleteIcon) {
    return ressources.IconSourceCode(size, shadow, semitransparent, addIcon, deleteIcon, '<path d="m 12 45 L 111 45 L 111 89 L 12 89 z" fill="lightgray" filter="url(#f1)" />', '<path d="m 12 45 L 111 45 L 111 89 L 12 89 z" style="fill:#ffffe9; stroke:black; stroke-width:4px; stroke-linejoin:round;" /><text x="29" y="-52" fill="black" transform="scale(1,-1)" style="font: bold 40px sans-serif;">123</text> ');
  }
  static AngularGaugeIcon(size, shadow, semitransparent, addIcon, deleteIcon) {
    return ressources.IconSourceCode(size, shadow, semitransparent, addIcon, deleteIcon, '<circle  cx="64" cy="64" r="40" fill="lightgray" filter="url(#f1)" />', '<circle  cx="64" cy="64" r="40" stroke="black" stroke-width="4" fill="#ffffe9" /><line x1="64" y1="104" x2="64" y2="94" stroke="black" stroke-width="2"   stroke-linecap="round" /><line x1="29" y1="84" x2="38" y2="79" stroke="black" stroke-width="2"   stroke-linecap="round" /><line x1="29" y1="44" x2="38" y2="48" stroke="black" stroke-width="2"   stroke-linecap="round" /><line x1="98" y1="84" x2="91" y2="79" stroke="black" stroke-width="2"   stroke-linecap="round" /><line x1="98" y1="44" x2="91" y2="48" stroke="black" stroke-width="2"   stroke-linecap="round" /><g transform="translate(64,64)"><g transform="rotate(-70,0,0)"><path d="m 5 0 L 0 5 L -25 0 L 0 -5 z" style="fill:black;stroke:black; stroke-width:2px; stroke-linejoin:round;"/></g></g>');
  }
  static EditIcon(size, shadow, semitransparent, addIcon, deleteIcon) {
    return ressources.IconSourceCode(size, shadow, semitransparent, addIcon, deleteIcon, '<path d="m 16 48 L 108 48 L 108 88 L 16 88 z" fill="lightgray" filter="url(#f1)" /><path d="m 87 24 L 75 40 L 67 31 L 62 64 L 93 50 L 82 44  L 94 29 z" fill="lightgray" filter="url(#f1)" />', '<path d="m 16 48 L 108 48 L 108 88 L 16 88 z" style="fill:#ffffe9; stroke:black; stroke-width:4px; stroke-linejoin:round;" /><path d="m 87 24 L 75 40 L 67 31 L 62 64 L 93 50 L 82 44  L 94 29 z" style="fill:white; stroke:black; stroke-width:2px; stroke-linejoin:round;" /> ');
  }
  static AllIcon(size, shadow, semitransparent, addIcon, deleteIcon) {
    return ressources.IconSourceCode(size, shadow, semitransparent, addIcon, deleteIcon, '<path d="m 60 108 L 46 74 L 8 72 L 38 48 L 28 12 L 60 32 L 92 12  L 82 48 L 112 70  L 74 74  z" fill="lightgray" filter="url(#f1)" />', '<path d="m 60 108 L 46 74 L 8 72 L 38 48 L 28 12 L 60 32 L 92 12  L 82 48 L 112 70  L 74 74  z" style="fill:#fee403; stroke:#918201; stroke-width:4px; stroke-linejoin:round;" />');
  }
  static TrashIcon(size, shadow, semitransparent, addIcon, deleteIcon) {
    return ressources.IconSourceCode(size, shadow, semitransparent, addIcon, deleteIcon, '<path d="m 33 12 L 24 94 L 104 94 L 95 12 z" fill="lightgray" filter="url(#f1)" /><g transform="translate(70,105)"><g transform="rotate(-10,0,0)"><path d="m -40 0 L -30 5 L 30 5 L 40 0 z" fill="lightgray" filter="url(#f1)" /><path d="m -9 5 L -9 12 L 9 12 L 9 5" stroke="lightgray" filter="url(#f1)"/> </g></g>', '<path d="m 33 12 L 24 94 L 104 94 L 95 12 z" style="fill:#f8f8f8; stroke:black; stroke-width:4px; stroke-linejoin:round;" /><Line x1="43" y1="82" x2="48" y2="21" style=" stroke:black; stroke-width:4px; stroke-linecap:round;" /><Line x1="64" y1="82" x2="64" y2="21" style=" stroke:black; stroke-width:4px; stroke-linecap:round;" /><Line x1="86" y1="82" x2="80" y2="21" style=" stroke:black; stroke-width:4px; stroke-linecap:round;" /><g transform="translate(70,105)"><g transform="rotate(-10,0,0)"><path d="m -40 0 L -30 5 L 30 5 L 40 0 z" style="fill:#f8f8f8; stroke:black; stroke-width:4px; stroke-linejoin:round;" /><path d="m -9 5 L -9 12 L 9 12 L 9 5" style="fill:none; stroke:black; stroke-width:4px; stroke-linejoin:round;" /></g></g>');
  }
  static SaveIcon(size, shadow, semitransparent, addIcon, deleteIcon) {
    return ressources.IconSourceCode(size, shadow, semitransparent, addIcon, deleteIcon, '<path d="m 20 12 A 4 4 0 0 0 16 16 L 16 106  A 4 4 0 0 0 20 110 L 24 110 L 24 108 L 97 108 L 97 110 L 104 110  A 4 4 0 0 0 108 106 L 108 16   A 4 4 0 0 0 104 12  z" fill="lightgray" filter="url(#f1)" />', '<path d="m 20 12 A 4 4 0 0 0 16 16 L 16 106  A 4 4 0 0 0 20 110 L 24 110 L 24 108 L 97 108 L 97 110 L 104 110  A 4 4 0 0 0 108 106 L 108 16   A 4 4 0 0 0 104 12  z" style="fill:#3583dd; stroke:#226fc8; stroke-width:4px; stroke-linejoin:round;" /><path d="m 24 11 L 24 65  A 5 5 0 0 0 29 70 L 95 70  A 5 5 0 0 0 100 65 L 100 11  z" style="fill:#f7f7f7; stroke:#c6c6c6; stroke-width:2px; stroke-linejoin:round;"/><path d="m 36 111 L 90 111 L 90 80 A 4 4 0 0 0 86 76 L 40 76 A 4 4 0 0 0 36 80 z"  style="fill:#e5e5e5; stroke:#c6c6c6; stroke-width:2px; stroke-linejoin:round;" /><rect x="67" y="79" width="14" height ="28"     style="fill:#3583dd; stroke:#c6c6c6; stroke-width:2px; stroke-linejoin:round;"');
  }
  static SaveNeededIcon(size, shadow, semitransparent, addIcon, deleteIcon) {
    return ressources.IconSourceCode(size, shadow, semitransparent, addIcon, deleteIcon, '<path d="m 8 16 L 64 110 L 120 16 z " style="fill:lightgray; stroke:lightgray; stroke-width:10px; stroke-linejoin:round;filter:url(#f1)" />', '<path d="m 8 16 L 64 110 L 120 16 z" style="fill:#FAE701; stroke:#FAE701; stroke-width:10px; stroke-linejoin:round;" /><path d="m 8 16 L 64 110 L 120 16 z" style="fill:none; stroke:black; stroke-width:2px; stroke-linejoin:round;" /><g transform="translate(-64,-64) scale(0.4 0.4) translate(260,215)"><path d="m 20 12 A 4 4 0 0 0 16 16 L 16 106  A 4 4 0 0 0 20 110 L 24 110 L 24 108 L 97 108 L 97 110 L 104 110  A 4 4 0 0 0 108 106 L 108 16   A 4 4 0 0 0 104 12  z" style="fill:black; stroke:black; stroke-width:4px; stroke-linejoin:round;" /><path d="m 24 11 L 24 65  A 5 5 0 0 0 29 70 L 95 70  A 5 5 0 0 0 100 65 L 100 11  z" style="fill:#FAE701; stroke:black; stroke-width:2px; stroke-linejoin:round;"/><path d="m 36 111 L 90 111 L 90 80 A 4 4 0 0 0 86 76 L 40 76 A 4 4 0 0 0 36 80 z"  style="fill:#FAE701; stroke:black; stroke-width:2px; stroke-linejoin:round;" /><rect x="67" y="79" width="14" height ="28"     style="fill:#FAE701; stroke:black; stroke-width:2px; stroke-linejoin:round;"</g>', "Don't forget to save.");
  }
  static snapshotIcon(size, shadow, semitransparent, addIcon, deleteIcon) {
    return ressources.IconSourceCode(size, shadow, semitransparent, addIcon, deleteIcon, '<path d="m 16 32  L 16 78 A 6 6 0 0 0 22 84 L 46 84 L 48 94 A 5.75 3.25 30 0 0 54 100 L 78 100 A 3.25 5.75  30 0 0 84 94  L 86 84 L 104 84  A 6 6 0 0 0 110 78  L 110 32 A 6 6 0 0 0 104 26 L 22 26 A 6 6 0 0 0 16 32 z"  fill="lightgray" filter="url(#f1)" />', '<path d="m 16 32  L 16 78 A 6 6 0 0 0 22 84 L 46 84 L 48 94 A 5.75 3.25 30 0 0 54 100 L 78 100 A 3.25 5.75  30 0 0 84 94  L 86 84 L 104 84  A 6 6 0 0 0 110 78  L 110 32 A 6 6 0 0 0 104 26 L 22 26 A 6 6 0 0 0 16 32 z" style="fill:#707070; stroke:#464646; stroke-width:4px; stroke-linejoin:round;" /><Circle cx="65" cy="55" r="26"   style="fill:#895e96; stroke:#464646; stroke-width:6px; stroke-linejoin:round;" />');
  }
  static CloseIcon(size, shadow, semitransparent, addIcon, deleteIcon, title) {
    return ressources.IconSourceCode(size, shadow, semitransparent, addIcon, deleteIcon, '<path d="m 21.6 38.6 L 47.1 64.3 L 22 89.5 L 38.4 106.2 L 64 81 L 89.3 106.2 L 105.8 89.5 L 80.6 64 L 105.8 38.9 L 89.3 22.2 L 64 47.5  L 38.3 22.1 z"  fill="lightgray" filter="url(#f1)" />', '<path d="m 21.6 38.6 L 47.1 64.3 L 22 89.5 L 38.4 106.2 L 64 81 L 89.3 106.2 L 105.8 89.5 L 80.6 64 L 105.8 38.9 L 89.3 22.2 L 64 47.5  L 38.3 22.1 z" style="fill:#ffffff; stroke:#004a82; stroke-width:4px; stroke-linejoin:round;" />', title);
  }
  static MoveToRightIcon(size, shadow, semitransparent, addIcon, deleteIcon, title) {
    return ressources.IconSourceCode(size, shadow, semitransparent, addIcon, deleteIcon, '<rect x="12" y="52" width="4"  height="24" fill="lightgray" filter="url(#f1)" /><rect x="20" y="52" width="8"  height="24" fill="lightgray" filter="url(#f1)" /><rect x="56" y="16" width="16"  height="96" fill="lightgray" filter="url(#f1)" /><path d="m  32 52 L 32 76 L 56 76 L 56 96 L 88 64 L 56 32 L 56 52 z" fill="lightgray" filter="url(#f1)" />', '<rect x="12" y="52" width="4"  height="24" style="fill:#ffffff; stroke:#004a82; stroke-width:4px; stroke-linejoin:round;" /><rect x="20" y="52" width="8"  height="24" style="fill:#ffffff; stroke:#004a82; stroke-width:4px; stroke-linejoin:round;" /><rect x="96" y="16" width="16"  height="96" style="fill:#ffffff; stroke:#004a82; stroke-width:4px; stroke-linejoin:round;" /><path d="m  32 52 L 32 76 L 56 76 L 56 96 L 88 64 L 56 32 L 56 52 z" style="fill:#ffffff; stroke:#004a82; stroke-width:4px; stroke-linejoin:round;" />', title);
  }
  static MoveToLeftIcon(size, shadow, semitransparent, addIcon, deleteIcon, title) {
    return ressources.IconSourceCode(size, shadow, semitransparent, addIcon, deleteIcon, '<rect x="112" y="52" width="4"  height="24" fill="lightgray" filter="url(#f1)" /><rect x="100" y="52" width="8"  height="24" fill="lightgray" filter="url(#f1)" /><rect x="16" y="16" width="16"  height="96" fill="lightgray" filter="url(#f1)" /><path d="m  96 52 L 96 76 L 72 76 L 72 96 L 40 64 L 72 32 L 72 52 z" fill="lightgray" filter="url(#f1)" />', '<rect x="112" y="52" width="4"  height="24" style="fill:#ffffff; stroke:#004a82; stroke-width:4px; stroke-linejoin:round;" /><rect x="100" y="52" width="8"  height="24" style="fill:#ffffff; stroke:#004a82; stroke-width:4px; stroke-linejoin:round;" /><rect x="16" y="16" width="16"  height="96" style="fill:#ffffff; stroke:#004a82; stroke-width:4px; stroke-linejoin:round;" /><path d="m  96 52 L 96 76 L 72 76 L 72 96 L 40 64 L 72 32 L 72 52 z" style="fill:#ffffff; stroke:#004a82; stroke-width:4px; stroke-linejoin:round;" />', title);
  }
  static ExpandIcon(size, shadow, semitransparent, addIcon, deleteIcon, title) {
    return ressources.IconSourceCode(size, shadow, semitransparent, addIcon, deleteIcon, '<path d="m  24 56 L 24 72 L 56 72 L 56 104 L 72 104 L 72 72 L 104 72 L 104 56 L 72 56 L 72 24 L 56 24 L 56 56 z"  fill="lightgray" filter="url(#f1)" />', '<path d="m 24 56 L 24 72 L 56 72 L 56 104 L 72 104 L 72 72 L 104 72 L 104 56 L 72 56 L 72 24 L 56 24 L 56 56  z" style="fill:black; " />', title);
  }
  static OkIcon(size, shadow, semitransparent, addIcon, deleteIcon, title) {
    return ressources.IconSourceCode(size, shadow, semitransparent, addIcon, deleteIcon, '<circle cx="64" cy="64" r="56"   fill="lightgray" filter="url(#f1)" />', '<circle cx="64" cy="64" r="56" fill="#00b20f"/><path d="m 19 72 L 34 87 L 60 62 L 94 96 L 109 81 L 60 32  z" style="fill:white; " />', title);
  }
  static FailedIcon(size, shadow, semitransparent, addIcon, deleteIcon, title) {
    return ressources.IconSourceCode(size, shadow, semitransparent, addIcon, deleteIcon, '<circle cx="64" cy="64" r="56"   fill="lightgray" filter="url(#f1)" />', '<circle cx="64" cy="64" r="56" fill="#ff101e"/><path d="m 43 99 L 64 79 L 85 99 L 100 85 L 79 64 L 100 43 L 85 28 L 64 49 L 43 28 L 28  43 L 49 64 L  28 85   z" style="fill:white; " />', title);
  }
  static DontKnowIcon(size, shadow, semitransparent, addIcon, deleteIcon, title) {
    return ressources.IconSourceCode(size, shadow, semitransparent, addIcon, deleteIcon, '<circle cx="64" cy="64" r="56"   fill="lightgray" filter="url(#f1)" />', '<circle cx="64" cy="64" r="56" fill="#f1ba00"/><text x="35" y="-30" fill="white" transform="scale(1,-1)" style="font: bold 96px sans-serif;">?</text> ', title);
  }
  static infoIcon(size, shadow, semitransparent, addIcon, deleteIcon, title) {
    return ressources.IconSourceCode(size, shadow, semitransparent, addIcon, deleteIcon, '<circle cx="64" cy="64" r="56"   fill="lightgray" filter="url(#f1)" />', '<circle cx="64" cy="64" r="56" fill="DodgerBlue"/><text x="50" y="-30" fill="white" transform="scale(1,-1)" style="font: bold 96px sans-serif;">i</text> ', title);
  }
  static ColapseIcon(size, shadow, semitransparent, addIcon, deleteIcon, title) {
    return ressources.IconSourceCode(size, shadow, semitransparent, addIcon, deleteIcon, '<path d="m 24 56 L 24 72 L 104 72 L 104 56 z"  fill="lightgray" filter="url(#f1)" />', '<path d="m 24 56 L 24 72 L 104 72 L 104 56 z" style="fill:black; " />', title);
  }
  static AddMarkerIcon(size, index) {
    return ressources.IconSourceCode(size, false, false, false, false, "", '<circle  cx="64" cy="64"  r="50"   style="fill:lightyellow;" stroke-width="8" stroke="darkred" /><text x="46" y="-40" fill="black" transform="scale(1,-1)" style="font: bold 64px sans-serif;">' + index.toString() + "</text>");
  }
  static AddMarker(size, shadow, semitransparent, addIcon, deleteIcon) {
    return ressources.IconSourceCode(size, shadow, semitransparent, addIcon, deleteIcon, "", '<line x1="80" y1="8" x2="80" y2="128" stroke="darkred" stroke-width="8" stroke-linecap="round" /><path d="m 60 64 L 100 64 L 80 20 z" style="fill:darkred; " /><rect x="40" y="56" width="80" height="32" style="fill:lightYellow" stroke="darkred" stroke-width="8" />');
  }
  static EraseDatalogger(size, shadow, semitransparent, addIcon, deleteIcon) {
    return ressources.IconSourceCode(size, shadow, semitransparent, addIcon, deleteIcon, "", '<g transform="rotate(-35,0,0)"><g transform="translate(-56,24)"><path d="m 108 24 L 108 46 L 60 46  A 22 22 0 1 0 60 90 L 108 90  L 108 112 L 60 112 A 44 44 0 1 1 60 24 z" style="fill:#808080; " /><rect x="88" y="24" width="20" height="22" style="fill:red" stroke="none"  /><rect x="88" y="90" width="20" height="22" style="fill:blue" stroke="none"  /><path d="m 108 24 L 108 46 L 60 46  A 22 22 0 1 0 60 90 L 108 90  L 108 112 L 60 112 A 44 44 0 1 1 60 24 z"  style="fill:none" stroke="black"  stroke-width="4" stroke-linejoin="round"/></g></g>');
  }
  static resetViewPort(size, shadow, semitransparent, addIcon, deleteIcon) {
    return ressources.IconSourceCode(size, shadow, semitransparent, addIcon, deleteIcon, "", '<line x1="116" y1="52" x2="116" y2="12"  stroke="black"  stroke-width="4"/><line x1="12" y1="52" x2="12" y2="12"  stroke="black"  stroke-width="4"/><path d="m 100 36 L 28 36 L 28 48 L 12 32  L 28 16 L 28 28 L 100 28 L 100 16 L 116 32 L 100 48z" style="fill:white" stroke="black"  stroke-width="4" stroke-linejoin="round" /><path d="m 7.3 97.7 L 20 107.4 L 51.6 114.7 L 78.5 112.2 L 101.6 103.3 L 114.4 91.7  L 117.7 81.7 L 104.3 66.9 L 80.9 61.2 L49.9 65 L 25 76.3 L 12.6 87.5 Z " style="fill:white" stroke="none" /><circle  cx="64" cy="88" r="27" style="fill:#6cc87b" stroke="none"  /> <path d="m 37.2 84.8 A 27 27 0 0 0 46.5 108.8 L 64 88 z" style="fill:#8ed698" stroke="none" /> <circle  cx="64" cy="88" r="16" style="fill:black" stroke="none"  /> <path d="m 6 97 A 59 34 -4 0 0 119 80" style="fill:none" stroke="black"  stroke-width="4"  stroke-linecap="round"/> <path d="m 113 79 A 56 31 -16 0 0 9 93 " style="fill:none" stroke="black"  stroke-width="4"  stroke-linecap="round" /> ');
  }
  static DeleteMarker(size, shadow, semitransparent, addIcon, deleteIcon) {
    return ressources.IconSourceCode(size, shadow, semitransparent, addIcon, deleteIcon, "", '<line x1="80" y1="8" x2="80" y2="128" stroke="darkred" stroke-width="8" stroke-linecap="round" /><path d="m 60 64 L 100 64 L 80 20 z" style="fill:darkred; " /><rect x="40" y="56" width="80" height="32" style="fill:lightYellow" stroke="darkred" stroke-width="8" />');
  }
  static targetIcon(size, shadow, semitransparent, addIcon, deleteIcon, title) {
    return ressources.IconSourceCode(size, shadow, semitransparent, addIcon, deleteIcon, "", '<circle  cx="64" cy="64"  r="42"   style="fill:none;" stroke-width="8" stroke="black" /><line  x1="0"   y1="64"  x2="42"  y2="64"  style="fill:none;" stroke-width="8" stroke="black" /><line  x1="128" y1="64"  x2="86"  y2="64"  style="fill:none;" stroke-width="8" stroke="black" /><line  y1="0"   x1="64"  y2="42"  x2="64"  style="fill:none;" stroke-width="8" stroke="black" /><line  y1="128" x1="64"  y2="86"  x2="64"  style="fill:none;" stroke-width="8" stroke="black" />', title);
  }
  static DotDotDotIcon(size, shadow, semitransparent, addIcon, deleteIcon, title) {
    return ressources.IconSourceCode(size, shadow, semitransparent, addIcon, deleteIcon, "", '<rect x="18" y="36" width="18" height="18" style="fill:black" /><rect x="54" y="36" width="18" height="18" style="fill:black" /><rect x="90" y="36" width="18" height="18" style="fill:black" />', title);
  }
  static LogFileIcon(size, shadow, semitransparent, addIcon, deleteIcon) {
    return ressources.IconSourceCode(size, shadow, semitransparent, addIcon, deleteIcon, "", '<line x1="4" y1="24" x2="30" y2="24"     style=" stroke:black; stroke-width:8px;" /><line x1="34" y1="24" x2="56" y2="24"    style=" stroke:black; stroke-width:8px; " /><line x1="64" y1="24" x2="74" y2="24"    style=" stroke:black; stroke-width:8px; " /><line x1="80" y1="24" x2="88" y2="24"    style=" stroke:black; stroke-width:8px; " /><line x1="4" y1="40" x2="30" y2="40"     style=" stroke:black; stroke-width:8px;" /><line x1="34" y1="40" x2="56" y2="40"    style=" stroke:black; stroke-width:8px; " /><line x1="61" y1="40" x2="90" y2="40"    style=" stroke:black; stroke-width:8px; " /><line x1="94" y1="40" x2="110" y2="40"    style=" stroke:black; stroke-width:8px; " /><line x1="4" y1="56" x2="30" y2="56"     style=" stroke:black; stroke-width:8px;" /><line x1="34" y1="56" x2="56" y2="56"    style=" stroke:black; stroke-width:8px; " /><line x1="61" y1="56" x2="86" y2="56"    style=" stroke:black; stroke-width:8px; " /><line x1="4" y1="72" x2="30" y2="72"     style=" stroke:black; stroke-width:8px;" /><line x1="34" y1="72" x2="50" y2="72"    style=" stroke:black; stroke-width:8px; " /><line x1="56" y1="72" x2="100" y2="72"    style=" stroke:black; stroke-width:8px; " /><line x1="4" y1="88" x2="30" y2="88"     style=" stroke:black; stroke-width:8px;" /><line x1="34" y1="88" x2="56" y2="88"    style=" stroke:black; stroke-width:8px; " /><line x1="61" y1="88" x2="72" y2="88"    style=" stroke:black; stroke-width:8px; " /><line x1="78" y1="88" x2="106" y2="88"    style=" stroke:black; stroke-width:8px; " />');
  }
};

// obj/rdonly/logForm.js
var logForm = class {
  static show() {
    if (logForm._window == null) {
      let params = new newWindowParam();
      params.positionType = 0;
      params.width = 8 * window.innerWidth / 10 >> 0;
      params.height = 6 * window.innerHeight / 10 >> 0;
      params.left = 1 * window.innerWidth / 10 >> 0;
      params.top = 2 * window.innerHeight / 10 >> 0;
      params.title = "LogFile";
      logForm._window = new YWindow(params);
      logForm._contents = logForm._window.innerContentDiv;
      logForm._contents.style.fontFamily = "courrier";
      logForm._contents.style.fontSize = (10 * constants.generalSizeCoef).toString() + "px";
      logForm._contents.style.overflow = "auto";
      for (let i = 0; i < logForm._lines.length; i++) {
        logForm.addLine(logForm._lines[i]);
      }
    }
    logForm._window.show();
  }
  static addLine(st) {
    let pre = document.createElement("PRE");
    pre.style.marginTop = "0";
    pre.style.marginBottom = "0";
    pre.innerText = st;
    logForm._contents.appendChild(pre);
    while (logForm._contents.childElementCount > 1e3) {
      logForm._contents.removeChild(logForm._contents.firstChild);
    }
  }
  static padStart(st, length) {
    while (st.length < length) {
      st = "0" + st;
    }
    return st;
  }
  static dateToString(d) {
    return d.getFullYear().toString() + "-" + logForm.padStart((d.getMonth() + 1).toString(), 2) + "-" + logForm.padStart(d.getDate().toString(), 2) + " " + logForm.padStart(d.getHours().toString(), 2) + ":" + logForm.padStart(d.getMinutes().toString(), 2) + ":" + logForm.padStart((d.getSeconds() + d.getMilliseconds() / 1e3).toFixed(3), 6);
  }
  static log(st) {
    logForm.logNOTS(logForm.dateToString(new Date()) + " " + st);
  }
  static logNOTS(st) {
    logForm._lines.push(st);
    if (logForm._lines.length > 1e3) {
      logForm._lines.splice(0, logForm._lines.length - 1e3);
    }
    if (logForm._window != null)
      logForm.addLine(st);
  }
};
logForm._lines = [];

// obj/rdonly/rawDataForm.js
var rawDataForm = class {
  static hide() {
    if (rawDataForm._window == null)
      return;
    rawDataForm._window.visible = false;
  }
  static show() {
    if (rawDataForm._window == null) {
      let params = new newWindowParam();
      params.positionType = 1;
      params.width = 9 * window.innerWidth / 10 >> 0;
      params.height = 8 * window.innerHeight / 10 >> 0;
      params.title = "Raw data";
      rawDataForm._window = new YWindow(params);
      rawDataForm._contents = rawDataForm._window.innerContentDiv;
      rawDataForm._statusline = document.createElement("DIV");
      rawDataForm._statusline.style.position = "absolute";
      rawDataForm._statusline.style.left = constants.WindowPadding.toString() + "px";
      rawDataForm._statusline.style.right = constants.WindowPadding.toString() + "px";
      rawDataForm._statusline.style.height = (rawDataForm.STATUSLINEHEIGHT * constants.generalSizeCoef).toString() + "px";
      rawDataForm._statusline.style.bottom = constants.WindowPadding.toString() + "px";
      rawDataForm._statusline.style.paddingTop = Math.round(5 * constants.generalSizeCoef).toString() + "px";
      rawDataForm._statusline.style.paddingLeft = "5px";
      rawDataForm._statusline.style.paddingRight = "5px";
      rawDataForm._statusline.style.overflowX = "auto";
      rawDataForm._statusline.style.paddingRight = "5px";
      rawDataForm._contents.append(rawDataForm._statusline);
      rawDataForm._sensorsList = document.createElement("DIV");
      rawDataForm._sensorsList.style.position = "absolute";
      rawDataForm._sensorsList.style.left = constants.WindowPadding.toString() + "px";
      rawDataForm._sensorsList.style.right = (rawDataForm.sensorListWidth * constants.generalSizeCoef + 8 * constants.WindowPadding).toString() + "px";
      rawDataForm._sensorsList.style.top = "2px";
      rawDataForm._sensorsList.style.overflowY = "auto";
      rawDataForm._sensorsList.style.height = (rawDataForm.topMargin * constants.generalSizeCoef).toString() + "px";
      rawDataForm._sensorsList.style.paddingLeft = "5px";
      rawDataForm._sensorsList.style.paddingRight = "5px";
      rawDataForm._sensorsList.style.border = constants.WindowInnerBorder;
      rawDataForm._sensorsList.style.backgroundColor = constants.WindowInnerBackgroundColor;
      rawDataForm._contents.append(rawDataForm._sensorsList);
      rawDataForm._optionsList = document.createElement("DIV");
      rawDataForm._optionsList.style.position = "absolute";
      rawDataForm._optionsList.style.width = (rawDataForm.sensorListWidth * constants.generalSizeCoef).toString() + "px";
      rawDataForm._optionsList.style.right = constants.WindowPadding.toString() + "px";
      rawDataForm._optionsList.style.top = "0px";
      rawDataForm._optionsList.style.height = (rawDataForm.topMargin * constants.generalSizeCoef).toString() + "px";
      rawDataForm._optionsList.style.paddingLeft = "5px";
      rawDataForm._optionsList.style.paddingRight = "5px";
      rawDataForm._optionsList.style.border = "1px solid transparent";
      rawDataForm._contents.append(rawDataForm._optionsList);
      let br;
      rawDataForm._optionMIN = document.createElement("INPUT");
      rawDataForm._optionMIN.type = "input";
      rawDataForm._optionMIN.checked = false;
      rawDataForm._optionMIN.style.display = "inline";
      rawDataForm._optionMIN.type = "checkbox";
      rawDataForm._optionMIN.style.transform = "scale(" + constants.generalSizeCoef.toString() + ")";
      rawDataForm._optionMIN.style.marginRight = Math.round(5 * constants.generalSizeCoef).toString() + "px";
      rawDataForm._optionMIN.addEventListener("change", () => {
        rawDataForm.refresh();
      });
      rawDataForm._optionsList.append(rawDataForm._optionMIN);
      let span;
      span = document.createElement("SPAN");
      span.innerText = "Include minimum values";
      rawDataForm._optionsList.append(span);
      br = document.createElement("BR");
      rawDataForm._optionsList.append(br);
      rawDataForm._optionAVG = document.createElement("INPUT");
      rawDataForm._optionAVG.type = "input";
      rawDataForm._optionAVG.checked = true;
      rawDataForm._optionAVG.style.display = "inline";
      rawDataForm._optionAVG.type = "checkbox";
      rawDataForm._optionAVG.style.transform = "scale(" + constants.generalSizeCoef.toString() + ")";
      rawDataForm._optionAVG.style.marginRight = Math.round(5 * constants.generalSizeCoef).toString() + "px";
      rawDataForm._optionAVG.addEventListener("change", () => {
        rawDataForm.refresh();
      });
      rawDataForm._optionsList.append(rawDataForm._optionAVG);
      span = document.createElement("SPAN");
      span.innerText = "Include average values";
      rawDataForm._optionsList.append(span);
      br = document.createElement("BR");
      rawDataForm._optionsList.append(br);
      rawDataForm._optionMAX = document.createElement("INPUT");
      rawDataForm._optionMAX.type = "input";
      rawDataForm._optionMAX.checked = false;
      rawDataForm._optionMAX.style.display = "inline";
      rawDataForm._optionMAX.type = "checkbox";
      rawDataForm._optionMAX.style.transform = "scale(" + constants.generalSizeCoef.toString() + ")";
      rawDataForm._optionMAX.style.marginRight = Math.round(5 * constants.generalSizeCoef).toString() + "px";
      rawDataForm._optionMAX.addEventListener("change", () => {
        rawDataForm.refresh();
      });
      rawDataForm._optionsList.append(rawDataForm._optionMAX);
      span = document.createElement("SPAN");
      span.innerText = "Include maximum values";
      rawDataForm._optionsList.append(span);
      rawDataForm._optionsList.append(document.createElement("BR"));
      rawDataForm._optionsList.append(document.createElement("BR"));
      let p = document.createElement("P");
      p.style.textAlign = "center";
      let refreshBtn = new button("refresh", () => {
        rawDataForm.refresh();
      });
      p.appendChild(refreshBtn.Element);
      let ExportBtn = new button("export", () => {
        rawDataForm.export();
      });
      p.appendChild(ExportBtn.Element);
      rawDataForm._optionsList.append(p);
      rawDataForm._datacontents = document.createElement("DIV");
      rawDataForm._datacontents.style.position = "absolute";
      rawDataForm._datacontents.style.left = constants.WindowPadding.toString() + "px";
      rawDataForm._datacontents.style.right = constants.WindowPadding.toString() + "px";
      rawDataForm._datacontents.style.top = (rawDataForm.topMargin * constants.generalSizeCoef + 5 * constants.WindowPadding).toString() + "px";
      rawDataForm._datacontents.style.bottom = (4 * constants.WindowPadding + rawDataForm.STATUSLINEHEIGHT * constants.generalSizeCoef).toString() + "px";
      rawDataForm._datacontents.style.paddingLeft = "5px";
      rawDataForm._datacontents.style.paddingRight = "5px";
      rawDataForm._datacontents.style.overflowX = "auto";
      rawDataForm._datacontents.style.paddingRight = "5px";
      rawDataForm._contents.append(rawDataForm._datacontents);
      rawDataForm._dataTable = document.createElement("TABLE");
      rawDataForm._dataTable.style.position = "absolute";
      rawDataForm._dataTable.style.overflow = "auto";
      rawDataForm._dataTable.style.left = "0px";
      rawDataForm._dataTable.style.width = "100%";
      rawDataForm._dataTable.style.top = "0px";
      rawDataForm._dataTable.style.bottom = "0px";
      rawDataForm._dataTable.style.fontSize = constants.generalFontSize.toString() + "px";
      rawDataForm._dataTable.style.borderCollapse = "colapse";
      rawDataForm._dataTable.style.borderSpacing = "0px";
      rawDataForm._dataTable.style.fontFamily = "sans-serif";
      rawDataForm._datacontents.appendChild(rawDataForm._dataTable);
    }
    rawDataForm._window.show();
    rawDataForm.refresh();
  }
  static refresh() {
    let list = [];
    for (let i = 0; i < sensorsManager.sensorList.length; i++) {
      if (!(sensorsManager.sensorList[i] instanceof NullYSensor)) {
        list.push(sensorsManager.sensorList[i]);
      }
    }
    rawDataForm._selection = [];
    for (let i = 0; i < list.length; i++) {
      let spanNode;
      let spanText;
      let input;
      if (i >= rawDataForm._sensorsList.childNodes.length) {
        spanNode = document.createElement("SPAN");
        input = document.createElement("INPUT");
        input.type = "input";
        input.checked = false;
        input.style.display = "inline";
        input.type = "checkbox";
        input.style.transform = "scale(" + constants.generalSizeCoef.toString() + ")";
        input.style.marginRight = Math.round(5 * constants.generalSizeCoef).toString() + "px";
        input.addEventListener("change", () => {
          rawDataForm.refresh();
        });
        spanNode.appendChild(input);
        spanText = document.createElement("SPAN");
        spanNode.appendChild(spanText);
        rawDataForm._sensorsList.appendChild(spanNode);
        spanNode.appendChild(document.createElement("BR"));
      } else {
        spanNode = rawDataForm._sensorsList.childNodes[i];
        input = spanNode.childNodes[0];
        spanText = spanNode.childNodes[1];
      }
      if (input.checked)
        rawDataForm._selection.push(list[i]);
      input.id = list[i].get_hardwareId();
      spanText.innerText = list[i].get_friendlyName();
    }
    while (rawDataForm._sensorsList.childNodes.length > list.length) {
      rawDataForm._sensorsList.removeChild(rawDataForm._sensorsList.lastChild);
    }
    rawDataForm.RefreshContents(rawDataForm._selection);
  }
  static padStart(st, length) {
    while (st.length < length) {
      st = "0" + st;
    }
    return st;
  }
  static UnixTimeStampTostring(ts) {
    let d = new Date(Date.UTC(1970, 0, 1));
    d.setUTCSeconds(ts >> 0, 1e3 * (ts % 1));
    return d.getFullYear().toString() + "-" + rawDataForm.padStart((d.getMonth() + 1).toString(), 2) + "-" + rawDataForm.padStart(d.getDate().toString(), 2) + " " + rawDataForm.padStart(d.getHours().toString(), 2) + ":" + rawDataForm.padStart(d.getMinutes().toString(), 2) + ":" + rawDataForm.padStart((d.getSeconds() + d.getMilliseconds() / 1e3).toFixed(3), 6);
  }
  static RefreshContents(slist) {
    let TH = document.createElement("THEAD");
    let TB = document.createElement("TBODY");
    let HR1 = document.createElement("TR");
    let HR2 = document.createElement("TR");
    let indexes = [];
    for (let i = 0; i < slist.length; i++) {
      indexes.push(slist[i].curData.length - 1);
    }
    while (rawDataForm._dataTable.childNodes.length > 0) {
      rawDataForm._dataTable.removeChild(rawDataForm._dataTable.lastChild);
    }
    rawDataForm._dataTable.appendChild(TH);
    rawDataForm._dataTable.appendChild(TB);
    let sMin = false;
    let sMax = false;
    let sAvg = false;
    let toShow = 0;
    if (rawDataForm._optionMIN.checked) {
      sMin = true;
      toShow++;
    }
    if (rawDataForm._optionAVG.checked) {
      sAvg = true;
      toShow++;
    }
    if (rawDataForm._optionMAX.checked) {
      sMax = true;
      toShow++;
    }
    TH.appendChild(HR1);
    TH.appendChild(HR2);
    let cell = document.createElement("TH");
    HR1.appendChild(cell);
    cell = document.createElement("TH");
    HR2.appendChild(cell);
    for (let i = 0; i < slist.length; i++) {
      cell = document.createElement("TH");
      cell.innerText = slist[i].get_friendlyName();
      cell.colSpan = Math.max(1, toShow);
      cell.style.backgroundColor = "#f0f0f0";
      cell.style.borderLeft = constants.WindowInnerBorder;
      cell.style.borderRight = constants.WindowInnerBorder;
      cell.style.borderTop = constants.WindowInnerBorder;
      HR1.appendChild(cell);
      if (sMin) {
        cell = document.createElement("TH");
        cell.innerText = "Min";
        cell.style.borderLeft = constants.WindowInnerBorder;
        cell.style.borderRight = sAvg || sMax ? "" : constants.WindowInnerBorder;
        cell.style.backgroundColor = "#f0f0f0";
        cell.style.textAlign = "right";
        HR2.appendChild(cell);
      }
      if (sAvg) {
        cell = document.createElement("TH");
        cell.innerText = "Avg";
        cell.style.borderLeft = sMin ? "" : constants.WindowInnerBorder;
        cell.style.borderRight = sMax ? "" : constants.WindowInnerBorder;
        cell.style.backgroundColor = "#f0f0f0";
        cell.style.textAlign = "right";
        HR2.appendChild(cell);
      }
      if (sMax) {
        cell = document.createElement("TH");
        cell.innerText = "Max";
        cell.style.borderLeft = sAvg || sMin ? "" : constants.WindowInnerBorder;
        cell.style.borderRight = constants.WindowInnerBorder;
        cell.style.backgroundColor = "#f0f0f0";
        cell.style.textAlign = "right";
        HR2.appendChild(cell);
      }
    }
    let colcount = slist.length * toShow;
    let MaxTimeStamp = 0;
    for (let i = 0; i < slist.length; i++) {
      if (indexes[i] >= 0) {
        if (MaxTimeStamp < slist[i].curData[indexes[i]].DateTime) {
          MaxTimeStamp = slist[i].curData[indexes[i]].DateTime;
        }
      }
    }
    let rowcount = 0;
    let currentRow = null;
    while (MaxTimeStamp > 0 && rowcount < rawDataForm.MAXRAWDATAROWS) {
      let row = new Array(colcount);
      let nextTimeStamp = 0;
      for (let i = 0; i < slist.length; i++) {
        let Shown = false;
        if (indexes[i] >= 0) {
          if (slist[i].curData[indexes[i]].DateTime == MaxTimeStamp) {
            let n = 0;
            if (sMin) {
              row[n + i * toShow] = slist[i].minData[indexes[i]].value.toString();
              n++;
            }
            if (sAvg) {
              row[n + i * toShow] = slist[i].curData[indexes[i]].value.toString();
              n++;
            }
            if (sMax) {
              row[n + i * toShow] = slist[i].maxData[indexes[i]].value.toString();
              n++;
            }
            Shown = true;
            indexes[i]--;
          }
          if (indexes[i] >= 0) {
            if (slist[i].curData[indexes[i]].DateTime > nextTimeStamp) {
              nextTimeStamp = slist[i].curData[indexes[i]].DateTime;
            }
          }
        }
        if (!Shown) {
          let n = 0;
          if (sMin) {
            row[n + i * toShow] = "";
            n++;
          }
          if (sAvg) {
            row[n + i * toShow] = "";
            n++;
          }
          if (sMax) {
            row[n + i * toShow] = "";
            n++;
          }
        }
      }
      if (colcount > 0 && toShow > 0) {
        currentRow = document.createElement("TR");
        let cell2 = document.createElement("TD");
        cell2.innerText = rawDataForm.UnixTimeStampTostring(MaxTimeStamp).toLocaleString();
        cell2.style.borderLeft = constants.WindowInnerBorder;
        cell2.style.borderTop = rowcount == 0 ? constants.WindowInnerBorder : "";
        cell2.style.backgroundColor = "#f0f0f0";
        currentRow.style.backgroundColor = (rowcount & 1) == 0 ? "white" : "#f0f0f0";
        currentRow.appendChild(cell2);
        for (let j = 0; j < row.length; j++) {
          cell2 = document.createElement("TD");
          cell2.innerText = row[j];
          cell2.style.textAlign = "right";
          cell2.style.borderLeft = j % toShow == 0 ? constants.WindowInnerBorder : "";
          cell2.style.borderRight = (j + 1) % toShow == 0 ? constants.WindowInnerBorder : "";
          cell2.style.fontFamily = "monospace";
          currentRow.appendChild(cell2);
        }
        TB.appendChild(currentRow);
        rowcount++;
      }
      MaxTimeStamp = nextTimeStamp;
    }
    if (currentRow != null) {
      for (let i = 0; i < currentRow.childNodes.length; i++) {
        currentRow.childNodes[i].style.borderBottom = constants.WindowInnerBorder;
      }
    }
    if (toShow == 0) {
      rawDataForm._statusline.style.backgroundColor = "#FF8080";
      rawDataForm._statusline.innerText = "No data shown, select at least Min, Avg or Max options in the top-right checkboxes";
    } else if (rowcount == 0) {
      rawDataForm._statusline.style.backgroundColor = "#FF8080";
      rawDataForm._statusline.innerText = "No data shown, select at least one sensor in the list above.";
    } else {
      rawDataForm._statusline.style.backgroundColor = constants.WindowBackgroundColor;
      if (rowcount < rawDataForm.MAXRAWDATAROWS) {
        rawDataForm._statusline.innerText = "These are the last " + rowcount.toString() + " data rows.";
      } else {
        rawDataForm._statusline.innerText = "These are the last " + rowcount.toString() + " data rows.  Use the export feature to get the whole data set.";
      }
    }
  }
  static getCvsdata(slist, sMin, sAvg, sMax) {
    let toShow = 0;
    let indexes = [];
    for (let i = 0; i < slist.length; i++) {
      indexes.push(0);
    }
    if (sMin)
      toShow++;
    if (sAvg)
      toShow++;
    if (sMax)
      toShow++;
    let res;
    let ColumnHeader = "Timestamp";
    for (let i = 0; i < slist.length; i++) {
      let sName = slist[i].toString();
      if (sMin)
        ColumnHeader += ";" + sName + "(min)";
      if (sAvg)
        ColumnHeader += ";" + sName + "(avg)";
      if (sMax)
        ColumnHeader += ";" + sName + "(max)";
    }
    res = ColumnHeader + "\r\n";
    let colcount = slist.length * toShow;
    let MinTimeStamp = Number.POSITIVE_INFINITY;
    for (let i = 0; i < slist.length; i++) {
      if (indexes[i] < slist[i].curData.length) {
        if (MinTimeStamp > slist[i].curData[indexes[i]].DateTime) {
          MinTimeStamp = slist[i].curData[indexes[i]].DateTime;
        }
      }
    }
    while (MinTimeStamp < Number.POSITIVE_INFINITY) {
      let line = "";
      let nextTimeStamp = Number.POSITIVE_INFINITY;
      for (let i = 0; i < slist.length; i++) {
        let Shown = false;
        if (indexes[i] < slist[i].curData.length) {
          if (slist[i].curData[indexes[i]].DateTime == MinTimeStamp) {
            if (sMin)
              line += ";" + slist[i].minData[indexes[i]].value.toString();
            if (sAvg)
              line += ";" + slist[i].curData[indexes[i]].value.toString();
            if (sMax)
              line += ";" + slist[i].maxData[indexes[i]].value.toString();
            Shown = true;
            indexes[i]++;
          }
          if (indexes[i] < slist[i].curData.length) {
            if (slist[i].curData[indexes[i]].DateTime < nextTimeStamp) {
              nextTimeStamp = slist[i].curData[indexes[i]].DateTime;
            }
          }
        }
        if (!Shown) {
          if (sMin)
            line += " ; ";
          if (sAvg)
            line += " ; ";
          if (sMax)
            line += " ; ";
        }
      }
      if (colcount > 0)
        line = rawDataForm.UnixTimeStampTostring(MinTimeStamp) + line;
      res += line + "\r\n";
      MinTimeStamp = nextTimeStamp;
    }
    return res;
  }
  static export() {
    let element = document.createElement("a");
    let data = "data:text/csv;charset=utf-8," + encodeURI(rawDataForm.getCvsdata(rawDataForm._selection, rawDataForm._optionMIN.checked, rawDataForm._optionAVG.checked, rawDataForm._optionMAX.checked));
    element.setAttribute("href", data);
    element.setAttribute("download", "rawdata.csv");
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }
};
rawDataForm._lines = [];
rawDataForm.topMargin = 100;
rawDataForm.sensorListWidth = 200;
rawDataForm.MAXRAWDATAROWS = 100;
rawDataForm.STATUSLINEHEIGHT = 20;
rawDataForm._selection = [];

// obj/rdonly/windowManager.js
var button = class {
  constructor(caption, action, sizeCoefOverload) {
    this._enabled = true;
    this._visible = true;
    this._caption = "";
    this._caption = caption;
    this._action = action;
    let GUIcoef = constants.generalSizeCoef;
    if (typeof sizeCoefOverload !== "undefined")
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
    this._link.style.fontFamily = constants.generalFontFamily;
    this._link.style.fontSize = (16 * GUIcoef).toString() + "px";
    this._link.style.cursor = "pointer";
    this._link.style.border = constants.WindowInnerBorder;
    this._link.addEventListener("mouseover", () => {
      if (this._enabled)
        this._link.style.backgroundColor = "white";
    });
    this._link.addEventListener("mouseout", () => {
      if (this._enabled)
        this._link.style.backgroundColor = "#f0f0f0";
    });
    this._link.addEventListener("click", () => {
      if (this._enabled)
        this._action(this);
    });
    this._link.addEventListener("keypress", (e) => {
      if (this._enabled && (e.key == "Enter" || e.key == " "))
        this._action(this);
    });
  }
  get Element() {
    return this._link;
  }
  set tabIndex(index) {
    this._link.tabIndex = index;
  }
  focus() {
    this._link.focus();
  }
  get visible() {
    return this._visible;
  }
  set visible(value) {
    this._visible = value;
    this._link.style.display = this._visible ? "" : "none";
  }
  get enabled() {
    return this._enabled;
  }
  set enabled(value) {
    this.enable(value);
  }
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
    } else {
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
    } else {
      this._link.style.backgroundColor = "#e0e0e0";
      this._link.style.cursor = "default";
      this._link.style.color = "#A0A0A0";
    }
  }
};
var newWindowParam = class {
  constructor(sizeCoefOverload) {
    this.createNow = false;
    this.left = 100;
    this.top = 100;
    this.positionType = 0;
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
    this.contentsDefaultFontSize = constants.generalFontSize;
    this.contentsDefaultFontFamily = constants.generalFontFamily;
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
    this._GUICoef = constants.generalSizeCoef;
    this.WindowHeaderHeight = Math.round(20 * constants.generalSizeCoef);
    this.WindowHeaderFontSize = 16 * constants.generalSizeCoef;
    this.WindowHeaderFontFamily = constants.generalFontFamily;
    this.buttons = [];
    if (typeof sizeCoefOverload !== "undefined") {
      this.WindowHeaderHeight = 20 * sizeCoefOverload;
      this.WindowHeaderFontSize = 16 * sizeCoefOverload;
      this._GUICoef = sizeCoefOverload;
    }
  }
  get GUICoef() {
    return this._GUICoef;
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
};
var YWindow = class {
  constructor(params) {
    this._div = null;
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
  static get ConTextMenuBestZindex() {
    for (let i = 0; i < YWindow.windowList.length; i++) {
      if (YWindow.windowList[i].isModal())
        return -1;
    }
    return 1e5 + 2 * YWindow.windowList.length;
  }
  get innerContentDiv() {
    return this._contents;
  }
  get bottomKeepClear() {
    return this._params.bottomKeepClear;
  }
  set bottomKeepClear(value) {
    this._params.bottomKeepClear = value;
    if (this._contents != null) {
      this._contents.style.bottom = (this._params.WindowPadding + this._params.bottomKeepClear).toString() + "px";
    }
  }
  get outterContentDiv() {
    return this._div;
  }
  isModal() {
    if (this._div == null)
      return false;
    return this._div.style.display == "" && this._params.isModal;
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
    if (typeof width !== "undefined" && this._params.positionType == 2) {
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
      case 0:
        this._div.style.position = "absolute";
        this._div.style.left = this._params.left.toString() + "px";
        this._div.style.top = this._params.top.toString() + "px";
        this._div.style.width = this._params.width.toString() + "px";
        this._div.style.height = this._params.height.toString() + "px";
        break;
      case 1:
        this._div.style.position = "absolute";
        this._div.style.left = "50%";
        this._div.style.top = "50%";
        this._div.style.transform = "translate(-50%, -50%)";
        this._div.style.width = this._params.width.toString() + "px";
        this._div.style.height = this._params.height.toString() + "px";
        break;
      case 2:
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
      title.addEventListener("click", () => {
        this.brintToFront();
      });
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
        closeDiv.innerHTML = ressources.CloseIcon(this._params.WindowHeaderHeight.toString(), false, false, false, false, "Click to close this window");
        closeDiv.addEventListener("click", () => {
          this.hide();
        });
        closeDiv.addEventListener("keypress", (e) => {
          if (e.key == "Enter")
            this.hide();
        });
        title.appendChild(closeDiv);
      }
      if (this._params.positionType == 2) {
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
        this._switchSideDiv.innerHTML = ressources.MoveToLeftIcon(this._params.WindowHeaderHeight.toString(), false, false, false, false, "Click to move editor on left side");
        this._switchSideDiv.addEventListener("click", () => {
          this.switchSide();
        });
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
    } else {
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
      this._ModalDivShield.style.zIndex = (1e5 + 2 * index).toString();
  }
  switchSide() {
    if (this._div.style.left == "") {
      this._div.style.left = "5px";
      this._div.style.right = "";
      this._switchSideDiv.innerHTML = ressources.MoveToRightIcon(Math.round(20 * this._params.GUICoef).toString(), false, false, false, false, "Click to move editor on right side");
    } else {
      this._div.style.left = "";
      this._div.style.right = "5px";
      this._switchSideDiv.innerHTML = ressources.MoveToLeftIcon(Math.round(20 * this._params.GUICoef).toString(), false, false, false, false, "Click to move editor on left side");
    }
  }
};
YWindow.windowList = [];
var confirm = class {
  static ask(message, yes, no, userdata) {
    let params = new newWindowParam();
    params.positionType = 1;
    params.width = Math.min(Math.round(400 * constants.generalSizeCoef), Math.round(screen.width * 0.9));
    params.height = Math.min(Math.round(160 * constants.generalSizeCoef), Math.round(screen.height * 0.7));
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
    TD.innerHTML = ressources.DontKnowIcon(Math.round(80 * constants.generalSizeCoef).toString(), true, false, false, false, "");
    TR.appendChild(TD);
    TD = document.createElement("TD");
    TD.style.paddingLeft = "20px";
    TD.style.fontFamily = constants.generalFontFamily;
    TD.style.fontSize = constants.generalFontSize.toString() + "px";
    TD.style.textAlign = "justify";
    TD.innerText = message;
    TR.appendChild(TD);
    table.appendChild(TR);
    contents.appendChild(table);
    confirm._window.show();
    return confirm._window;
  }
};
var notififaction = class {
  static show(icon, message) {
    let params = new newWindowParam();
    params.positionType = 1;
    params.width = Math.min(Math.round(400 * constants.generalSizeCoef), screen.width);
    params.height = Math.min(Math.round(160 * constants.generalSizeCoef), screen.height);
    params.isModal = true;
    params.showHeader = false;
    params.showContainerBorders = false;
    let okButton = new button("OK", () => {
      alert2._window.hide();
    });
    params.buttons.push(okButton);
    alert2._window = new YWindow(params);
    let contents = alert2._window.innerContentDiv;
    let table = document.createElement("TABLE");
    table.style.width = "100%";
    let TR = document.createElement("TR");
    let TD = document.createElement("TD");
    TD.style.width = "10";
    TD.innerHTML = icon;
    TR.appendChild(TD);
    TD = document.createElement("TD");
    TD.style.paddingLeft = "20px";
    TD.style.fontFamily = constants.generalFontFamily;
    TD.style.fontSize = constants.generalFontSize.toString() + "px";
    TD.style.textAlign = "justify";
    TD.innerText = message;
    TR.appendChild(TD);
    table.appendChild(TR);
    contents.appendChild(table);
    alert2._window.show();
    return alert2._window;
  }
};
var alert2 = class extends notififaction {
  static show(message) {
    return super.show(ressources.FailedIcon(Math.round(80 * constants.generalSizeCoef).toString(), true, false, false, false, ""), message);
  }
};
var info = class extends notififaction {
  static show(message) {
    return super.show(ressources.OkIcon(Math.round(80 * constants.generalSizeCoef).toString(), true, false, false, false, ""), message);
  }
};

// obj/rdonly/webPage.js
var __awaiter6 = function(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
var YWebPage = class {
  static get resetDataViewMenuItem() {
    return YWebPage._resetDataViewMenuItem;
  }
  static get snapshotMenuItem() {
    return YWebPage._snapshotMenuItem;
  }
  static applicationGlobalinit() {
    if (YWebPage._MarkerCountPerXaxis == 0) {
      let xAxisProp = new XaxisDescription();
      let propDesc = GenericProperties.getAllProperties(xAxisProp);
      for (let propname in propDesc.byName) {
        if (propname.startsWith("markers"))
          YWebPage._MarkerCountPerXaxis++;
      }
    }
    if (YWebPage.manager == null)
      YWebPage.manager = new sensorsManager();
    if (YWebPage._contextMenu == null) {
      YWebPage._contextMenu = new ContextMenu(YWebPage.baseSize, (mouseX, mouseY) => {
        YWebPage.menuIsOpening(mouseX, mouseY);
      }, constants.generalFontFamily);
      YWebPage._resetDataViewMenuItem = YWebPage._contextMenu.addMenuItem(ressources.resetViewPort(YWebPage.baseSize.toString(), false, false, false, false), "Reset dataview", () => {
        YWebPage.resetDataView();
      });
      YWebPage._resetDataViewMenuItem.visible = false;
      YWebPage._contextMenu.AddSeparator();
      YWebPage._contextMenu.addMenuItem(ressources.RawDataIcon(YWebPage.baseSize.toString(), false, false, false, false), "Show raw data", () => {
        rawDataForm.show();
      });
      YWebPage._snapshotMenuItem = YWebPage._contextMenu.addMenuItem(ressources.snapshotIcon(YWebPage.baseSize.toString(), false, false, false, false), "Snapshot", () => {
        YWebPage.snapShot();
      });
      YWebPage._contextMenu.addMenuItem(ressources.LogFileIcon(YWebPage.baseSize.toString(), false, false, false, false), "Show logs", () => {
        YWebPage.showLogsWindow();
      });
    }
  }
  static showLogsWindow() {
    logForm.show();
  }
  static snapShot() {
    let w = YWebPage._snapshotMenuItem.userdata;
    w.snapshot();
  }
  static menuIsOpening(mouseX, mouseY) {
    YWebPage.resetDataViewMenuItem.visible = false;
    YWebPage.snapshotMenuItem.visible = false;
    for (let i = 0; i < YWebPage.widgets.length; i++) {
      YWebPage.widgets[i].contextMenuCallBack(mouseX, mouseY);
    }
    YWebPage._contextMenu.refresh();
  }
  static resetDataView() {
    YWebPage._resetDataViewMenuItem.userdata.resetDataView();
  }
  static sensorListHaschanged() {
  }
  static EmptyReadonlyConfig() {
    alert2.show("Yocto-Visualization Error\n\nConfiguration is both empty and read only, check configuration file.");
  }
  static ForceReloadConfig(newXMLdata) {
    return __awaiter6(this, void 0, void 0, function* () {
      logForm.log("Reloading the whole configuration.");
      yield sensorsManager.clearHublist();
      for (let i = YWebPage.widgets.length - 1; i >= 0; i--) {
        YWebPage.widgets[i].destroy();
        YWebPage.widgets.splice(i, 1);
      }
      YWebPage.loadFromXML(newXMLdata);
    });
  }
  static ConfigChanged(newXMLdata) {
    if (YWebPage.ConfigChangedConfirmWindows != null) {
      YWebPage.ConfigChangedConfirmWindows.hide();
    }
    let newCRC = constants.crc32(newXMLdata);
    if (newCRC == YWebPage.xmlDataCRC)
      return;
    logForm.log("Config file changed behind our back!");
    if (!this.readonly) {
      YWebPage.ConfigChangedConfirmWindows = confirm.ask("Configuration has changed on server\nWould you like to reload it?", () => {
        YWebPage.ForceReloadConfig(newXMLdata);
        YWebPage.ConfigChangedConfirmWindows = null;
      }, () => {
        YWebPage.ConfigChangedConfirmWindows = null;
      }, null);
    } else {
      YWebPage.ForceReloadConfig(newXMLdata);
    }
    YWebPage.xmlDataCRC = newCRC;
  }
  static loadFromXML(xmlData) {
    if (xmlData == "") {
      {
        YWebPage.EmptyReadonlyConfig();
      }
      return;
    }
    let parser = new DOMParser();
    let doc = parser.parseFromString(xmlData.replace("<!-->", "<!-- "), "application/xml");
    let root = null;
    doc.childNodes.forEach((node) => {
      if (node.nodeName.toUpperCase() == "ROOT" && root == null)
        root = node;
    });
    if (root == null)
      throw "No ROOT top node in XML data";
    root.childNodes.forEach((node) => {
      if (node.nodeName.toUpperCase() == "SENSORS") {
        sensorsManager.setKnownSensors(new YXmlNode(node));
      }
    });
    root.childNodes.forEach((node) => {
      let editor = null;
      switch (node.nodeName.toUpperCase()) {
        case "CONFIG":
          constants.Init(new YXmlNode(node));
          break;
        case "GRAPHFORM":
          YWebPage.widgets.push(new graphWidget(new YXmlNode(node), editor));
          break;
        case "ANGULARGAUGEFORM":
          YWebPage.widgets.push(new angularGaugeWidget(new YXmlNode(node), editor));
          break;
        case "GAUGEFORM":
          YWebPage.widgets.push(new gaugeWidget(new YXmlNode(node), editor));
          break;
        case "DIGITALDISPLAYFORM":
          YWebPage.widgets.push(new digitalDisplayWidget(new YXmlNode(node), editor));
          break;
      }
      sensorsManager.registerChangeCallback(() => {
        YWebPage.sensorListHaschanged();
      });
      if (node.nodeName.toUpperCase() == "ROOT" && root == null)
        root = node;
    });
    if (YWebPage.widgets.length <= 0) {
      {
        YWebPage.EmptyReadonlyConfig();
      }
    }
  }
  static run(xmlData, ExternalConfigChange, saveFunction) {
    if (typeof ExternalConfigChange !== "undefined") {
      if (ExternalConfigChange != null) {
        sensorsManager.registerChangeExternalCallback(ExternalConfigChange);
      }
    }
    YWebPage.xmlDataCRC = constants.crc32(xmlData);
    logForm.log("Application start, Welcome to Yocto-Visualization (for web).");
    logForm.log("Yocto-Visualization version is " + constants.buildVersion);
    logForm.log("Yoctopuce API version is " + YAPI.imm_GetAPIVersion());
    if (constants.RunningOnAndroid)
      logForm.log("Browser is running on Android");
    let widthCm = Math.round(2.54 * constants.deviceScreenWidth / constants.screenDPI);
    let heightCm = Math.round(2.54 * constants.deviceScreenHeight / constants.screenDPI);
    logForm.log("Reported screen size is " + constants.deviceScreenWidth.toString() + "x" + constants.deviceScreenHeight.toString() + " at " + constants.screenDPI + " dpi, (~" + widthCm.toString() + "x" + heightCm.toString() + "cm) ");
    logForm.log("Reported pixel ratio is " + window.devicePixelRatio.toString());
    logForm.log(constants.isPhoneOrTablet ? "Probably running on a tablet or a phone." : "Probably running on a desktop.");
    logForm.log((constants.guiDPIFactorWasOverriden ? "DPI based zoom overridden  to " : "DPI based zoom factor set to ") + constants.guiDPIFactor.toFixed(1));
    logForm.log("Reported window inner size =" + window.innerWidth.toString() + "x" + window.innerHeight.toString() + "px");
    YWebPage.applicationGlobalinit();
    sensorsManager.run();
    YWebPage.loadFromXML(xmlData);
  }
  static pageIsleaving(e) {
    return __awaiter6(this, void 0, void 0, function* () {
    });
  }
  static get readonly() {
    let res = true;
    return res;
  }
  static save(force) {
    return __awaiter6(this, void 0, void 0, function* () {
      return true;
    });
  }
  static handleSavedNotification(div) {
    let opacity = parseFloat(div.style.opacity) - 0.05;
    if (opacity < 0) {
      document.body.removeChild(div);
      return;
    }
    div.style.opacity = opacity.toString();
    setTimeout(() => {
      YWebPage.handleSavedNotification(div);
    }, 100);
  }
};
YWebPage.baseSize = 18 * constants.generalSizeCoef;
YWebPage.xmlDataCRC = 0;
YWebPage.widgets = [];
YWebPage._markersSubMenuItems = [];
YWebPage._MarkerCountPerXaxis = 0;
YWebPage.ConfigChangedConfirmWindows = null;
var HTTPrequestResult = class {
  constructor(data, status, statusText) {
    this._data = data;
    this._status = status;
    this._statusText = statusText;
  }
  get data() {
    return this._data;
  }
  get status() {
    return this._status;
  }
  get statusText() {
    return this._statusText;
  }
};
var HubInfo = class {
  constructor(protocol, addr, port, path, srvusername, srvpassword) {
    this._userPassword = false;
    this._adminPassword = false;
    this._cred = "";
    this._serial = "";
    this._srvusername = null;
    this._srvpassword = null;
    if (protocol.slice(-1) == ":")
      protocol = protocol.slice(0, -1);
    this._protocol = protocol;
    this._addr = addr;
    this._port = port;
    this._protocol = protocol;
    this._path = path;
    if (srvusername !== void 0)
      this._srvusername = srvusername;
    if (srvpassword !== void 0)
      this._srvpassword = srvpassword;
    if (this._path != "") {
      if (this._path.charAt(0) == "/") {
        this._path = this._path.slice(1);
      }
    }
    if (this._path != "") {
      if (this._path.slice(-1) == "/") {
        this._path = this._path.slice(0, -1);
      }
    }
  }
  get protocol() {
    return this._protocol;
  }
  get addr() {
    return this._addr;
  }
  get port() {
    return this._port;
  }
  get path() {
    return this._path;
  }
  get userPassword() {
    return this._userPassword;
  }
  get adminPassword() {
    return this._adminPassword;
  }
  get serial() {
    return this._serial;
  }
  get srvUsername() {
    return this._srvusername != null ? this._srvusername : "";
  }
  get srvPassword() {
    return this._srvpassword != null ? this._srvpassword : "";
  }
  get_hubUrl(user, password) {
    let url = this.protocol + "://";
    if (typeof user != "undefined" && user != "") {
      if (user != "") {
        url += user + ":" + password + "@";
      }
    }
    url += this.addr + ":" + this.port.toString();
    if (this.path != "")
      url += "/" + this.path;
    return url;
  }
  makeRequest() {
    return __awaiter6(this, void 0, void 0, function* () {
      let url = this._protocol + "://" + this._addr + ":" + this._port.toString();
      if (this._path != "")
        url += "/" + this._path;
      url += "/info.json";
      let HubData = null;
      let res = yield YoctoHubFileHandler.makeRequest("GET", url, this._srvusername, this._srvpassword);
      if (res.data != null) {
        let data = new TextDecoder().decode(res.data);
        HubData = JSON.parse(data);
        if (HubData.port && HubData.port.length > 0) {
          let proto_port = HubData.port[0].split(":");
          this._protocol = proto_port[0];
          this._port = parseInt(proto_port[1]);
        }
        this._serial = HubData.serialNumber;
        this._path = HubData.dir;
        this._adminPassword = HubData.adminPassword.toUpperCase() == "TRUE";
        this._userPassword = HubData.userPassword.toUpperCase() == "TRUE";
        return true;
      } else {
        if (this._protocol == "https") {
          this._protocol = "wss";
        } else {
          this._protocol = "ws";
        }
      }
      return false;
    });
  }
  findChild(parent, name) {
    let res = null;
    parent.childNodes.forEach((node) => {
      if (node.nodeName == name) {
        res = node;
        return;
      }
    });
    return res;
  }
  findOutCredentialsFromConfigFile(xmlData) {
    if (xmlData == null)
      return;
    let parser = new DOMParser();
    let doc = parser.parseFromString(xmlData, "application/xml");
    let rootNode = this.findChild(doc, "ROOT");
    if (rootNode == null)
      return;
    let configNode = this.findChild(rootNode, "Config");
    if (configNode == null)
      return;
    let Hubs = this.findChild(configNode, "Hubs");
    if (Hubs == null)
      return;
    let HubSection;
    let list = Hubs.childNodes;
    let sourceHubFound = false;
    for (let i = 0; i < list.length; i++) {
      if (list[i].nodeName == "Hub") {
        let node = new YXmlNode(list[i]);
        let attributes = node.Attributes;
        let addr = attributes.hasOwnProperty("addr") ? attributes["addr"] : "";
        let port = attributes.hasOwnProperty("port") ? attributes["port"] : "80";
        let protocol = attributes.hasOwnProperty("protocol") ? attributes["protocol"] : "";
        let path = attributes.hasOwnProperty("path") ? attributes["path"] : "";
        let username = attributes.hasOwnProperty("user") ? attributes["user"] : "";
        let password = attributes.hasOwnProperty("password") ? attributes["password"] : "";
        let a1 = addr.toUpperCase();
        if (a1.substring(0, 4) == "WWW.")
          a1 = a1.substring(4);
        let a2 = this._addr.toUpperCase();
        if (a2.substring(0, 4) == "WWW.")
          a2 = a2.substring(4);
        if (a1 == a2 && path == this._path) {
          this._srvusername = username;
          this._srvpassword = Hub.Decrypt(password, Hub.loginCypherPassword);
        }
      }
    }
  }
};
var YoctoHubFileHandler = class {
  constructor(hubInfo) {
    this.filename = "";
    this.xmldata = "";
    this.htmlSrcCode = "";
    this.FileSystemAccessDenied = false;
    this._XMLConfigFileChanged = null;
    this.info = hubInfo;
  }
  init(defaultXmlConfigFileContents) {
    return __awaiter6(this, void 0, void 0, function* () {
      let url = location.href;
      this.filename = url.substring(url.lastIndexOf("/") + 1);
      let p = this.filename.indexOf("?");
      if (p > 0)
        this.filename = this.filename.substring(0, p);
      this.htmlSrcCode = document.documentElement.outerHTML;
      if (typeof defaultXmlConfigFileContents === "undefined" || defaultXmlConfigFileContents == "") {
        this.xmldata = '<?xml version="1.0" ?>\n<ROOT version="2.1">\n<Config>\n<Hubs>\n<Hub protocol="' + this.info.protocol + '" addr="' + this.info.addr + '" port="' + this.info.port.toString() + '"' + (this.info.path != "" ? ' path="' + this.info.path + '"' : "") + ' removable="FALSE"/>\n</Hubs>\n</Config>\n</ROOT>\n';
      } else {
        this.xmldata = defaultXmlConfigFileContents;
      }
    });
  }
  static start(defaultXmlConfigFileContents) {
    return __awaiter6(this, void 0, void 0, function* () {
      let dirpath = location.pathname;
      let defport = "80";
      let slashpos = dirpath.lastIndexOf("/");
      if (slashpos > 0) {
        dirpath = dirpath.slice(0, slashpos);
      } else {
        dirpath = "";
      }
      if (location.protocol == "https:") {
        defport = "443";
      }
      let hubinfo = new HubInfo(location.protocol, location.hostname, parseInt(location.port ? location.port : defport), dirpath);
      yield hubinfo.makeRequest();
      let filehandler = new YoctoHubFileHandler(hubinfo);
      yield filehandler.init(defaultXmlConfigFileContents);
      return filehandler;
    });
  }
  get xmlConfigData() {
    return this.xmldata;
  }
  static makeRequest(method, url, username, password) {
    return new Promise(function(resolve, reject) {
      let xhr = new XMLHttpRequest();
      if (username !== void 0 && password !== void 0 && username != null && password !== null) {
        xhr.open(method, url, true, username, password);
        xhr.withCredentials = true;
      } else {
        xhr.open(method, url);
      }
      xhr.overrideMimeType("text/plain; charset=x-user-defined");
      xhr.onload = function() {
        if (this.status >= 200 && this.status < 300) {
          resolve(new HTTPrequestResult(YAPI.imm_str2bin(xhr.response), this.status, xhr.statusText));
        } else {
          resolve(new HTTPrequestResult(null, this.status, xhr.statusText));
        }
      };
      xhr.onerror = function() {
        resolve(new HTTPrequestResult(null, this.status, xhr.statusText));
      };
      xhr.send();
    });
  }
};
YoctoHubFileHandler.signatureStart = "YoctoHubFileHandler.start(";
YoctoHubFileHandler.signatureEnd = '</ROOT>\\n");';
export {
  AlarmSection,
  AlarmSettings,
  AlarmTestTypeDescription,
  AngularGaugeFormProperties,
  AngularZoneDescription,
  AnnotationPanel,
  AnnotationPanelDescription,
  AnnotationPanelDescriptionGraph,
  ChartSerie,
  ContextMenu,
  ContextMenuItem,
  ContextMenuItemBase,
  ContextMenuItemSubMenuEntry,
  ContextMenuSeparator,
  ContextSubMenu,
  CustomYSensor,
  DataPanel,
  DataSegment,
  DataSerie,
  DataTracker,
  DataTrackerDescription,
  FontDescription,
  GaugeFormProperties,
  GenericAxis,
  GenericPanel,
  GenericProperties,
  GraphFormProperties,
  HTTPrequestResult,
  Hub,
  HubInfo,
  Legend,
  LegendDescription,
  LegendPanel,
  LegendPanelDescription,
  Marker,
  MarkerDescription,
  Matrix3x3,
  MessagePanel,
  MinMax,
  MinMaxHandler,
  Navigator,
  NavigatorDescription,
  NullYSensor,
  Point,
  PointF,
  PropertiesList,
  PropertyDescriptor,
  Proportional,
  StartStopStep,
  TimeConverter,
  TimeConverterParseResult,
  TimedSensorValue,
  TypeDescription,
  Vector3,
  ViewPortSettings,
  XAxis,
  XaxisDescription,
  YAPI,
  YAPIContext,
  YAPI_DEVICE_BUSY,
  YAPI_DEVICE_NOT_FOUND,
  YAPI_DOUBLE_ACCES,
  YAPI_EXHAUSTED,
  YAPI_FILE_NOT_FOUND,
  YAPI_INVALID_ARGUMENT,
  YAPI_INVALID_DOUBLE,
  YAPI_INVALID_INT,
  YAPI_INVALID_LONG,
  YAPI_INVALID_STRING,
  YAPI_INVALID_UINT,
  YAPI_IO_ERROR,
  YAPI_MAX_DOUBLE,
  YAPI_MIN_DOUBLE,
  YAPI_NOT_INITIALIZED,
  YAPI_NOT_SUPPORTED,
  YAPI_NO_MORE_DATA,
  YAPI_RTC_NOT_READY,
  YAPI_SSL_ERROR,
  YAPI_SUCCESS,
  YAPI_TIMEOUT,
  YAPI_UNAUTHORIZED,
  YAPI_VERSION_MISMATCH,
  YAngularGauge,
  YAngularZone,
  YAxis,
  YBrush,
  YColor,
  YConsolidatedDataSet,
  YDataLogger,
  YDataRenderer,
  YDataSet,
  YDataStream,
  YDate,
  YDigitalDisplay,
  YEnum,
  YEnumItem,
  YErrorMsg,
  YFirmwareFile,
  YFirmwareUpdate,
  YFont,
  YFunction,
  YGenericHub,
  YGenericSSDPManager,
  YGraph,
  YGraphics,
  YGraphicsSVG,
  YHTTPBody,
  YHTTPRequest,
  YLinearGradientBrush,
  YMeasure,
  YModule,
  YNetwork,
  YPen,
  YRectangle,
  YSensor,
  YSizeF,
  YSmoothingMode,
  YSolidBrush,
  YSolidGauge,
  YStringFormat,
  YSystemEnv,
  YSystemEnvHtml,
  YTextRenderingHint,
  YWebPage,
  YWebSocketHub,
  YWidget,
  YWindow,
  YXmlNode,
  Y_DETECT_ALL,
  Y_DETECT_NET,
  Y_DETECT_NONE,
  Y_DETECT_USB,
  Y_FUNCTIONDESCRIPTOR_INVALID,
  YaxisDescription,
  YoctoError,
  YoctoHubFileHandler,
  Zone,
  ZoneDescription,
  alert2 as alert,
  angularGaugeWidget,
  button,
  captureParametersSet,
  confirm,
  constants,
  digitalDisplayFormProperties,
  digitalDisplayWidget,
  doubleNan,
  fontNameTypeDescription,
  gaugeWidget,
  graphWidget,
  info,
  logForm,
  newWindowParam,
  pointXY,
  rawDataForm,
  ressources,
  sensorDataTypeDescription,
  sensorFreqTypeDescription,
  sensorPrecisionTypeDescription,
  sensorsManager,
  xAxisPosition,
  yAxisDescription
};
//# sourceMappingURL=yv4web-readonly.js.map

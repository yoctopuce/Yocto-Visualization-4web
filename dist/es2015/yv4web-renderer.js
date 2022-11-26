/* Yocto-Visualization-4web renderer library (ES2015 1.10.51774) - www.yoctopuce.com */
var Renderer = (() => {
  var __defProp = Object.defineProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, {get: all[name], enumerable: true});
  };

  // obj/rdonly/Renderer/YDataRendererFull.js
  var YDataRendererFull_exports = {};
  __export(YDataRendererFull_exports, {
    AnnotationPanel: () => AnnotationPanel,
    DataPanel: () => DataPanel,
    DataSegment: () => DataSegment,
    DataSerie: () => DataSerie,
    DataTracker: () => DataTracker,
    GenericAxis: () => GenericAxis,
    GenericPanel: () => GenericPanel,
    Legend: () => Legend,
    LegendPanel: () => LegendPanel,
    Marker: () => Marker,
    Matrix3x3: () => Matrix3x3,
    MessagePanel: () => MessagePanel,
    MinMax: () => MinMax,
    MinMaxHandler: () => MinMaxHandler,
    Navigator: () => Navigator,
    Point: () => Point,
    PointF: () => PointF,
    Proportional: () => Proportional,
    StartStopStep: () => StartStopStep,
    TimeConverter: () => TimeConverter,
    TimeConverterParseResult: () => TimeConverterParseResult,
    Vector3: () => Vector3,
    ViewPortSettings: () => ViewPortSettings,
    XAxis: () => XAxis,
    YAngularGauge: () => YAngularGauge,
    YAngularZone: () => YAngularZone,
    YAxis: () => YAxis,
    YBrush: () => YBrush,
    YColor: () => YColor,
    YDataRenderer: () => YDataRenderer,
    YDate: () => YDate,
    YDigitalDisplay: () => YDigitalDisplay,
    YEnum: () => YEnum,
    YEnumItem: () => YEnumItem,
    YFont: () => YFont,
    YGraph: () => YGraph,
    YGraphics: () => YGraphics,
    YGraphicsSVG: () => YGraphicsSVG,
    YLinearGradientBrush: () => YLinearGradientBrush,
    YPen: () => YPen,
    YRectangle: () => YRectangle,
    YSizeF: () => YSizeF,
    YSmoothingMode: () => YSmoothingMode,
    YSolidBrush: () => YSolidBrush,
    YSolidGauge: () => YSolidGauge,
    YStringFormat: () => YStringFormat,
    YTextRenderingHint: () => YTextRenderingHint,
    Zone: () => Zone,
    captureParametersSet: () => captureParametersSet,
    pointXY: () => pointXY,
    xAxisPosition: () => xAxisPosition
  });

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
    get userData() {
      return this._userData;
    }
    set userData(value) {
      this._userData = value;
    }
    get directParent() {
      return this._directParent;
    }
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
    constructor(clip) {
      this._Alignment = 0;
      this._LineAlignment = 0;
      this._formatFlags = 0;
      this._Trimming = 0;
      this._clip = 16384;
      this._clip = clip;
    }
  };
  var YColor = class {
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
    get userData() {
      return this._userData;
    }
    set userData(value) {
      this._userData = value;
    }
    get directParent() {
      return this._directParent;
    }
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
  };
  var YAngularGauge = class extends YDataRenderer {
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
    static ArrayCopy(sourceArray, sourceIndex, destinationArray, destinationIndex, length) {
      for (let i = 0; i < length; i++) {
        destinationArray[destinationIndex + i] = sourceArray[sourceIndex + i].clone();
      }
    }
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
    grow() {
      let targetCount = this.data.length + DataSegment.SegmentGranularity;
      while (this.data.length < targetCount) {
        this.data.push(null);
      }
    }
  };
  DataSegment.SegmentGranularity = 1e3;
  var DataSerie = class {
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
    get directParent() {
      return this._directParent;
    }
    get userData() {
      return this._userData;
    }
    set userData(value) {
      this._userData = value;
    }
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
    get directParent() {
      return this._directParent;
    }
    get userData() {
      return this._userData;
    }
    set userData(value) {
      this._userData = value;
    }
    constructor(parent, directParent) {
      this._userData = null;
      this._title = "";
      this._font = null;
      this._directParent = directParent;
      this._parentRenderer = parent;
      this._font = new YFont(parent, this, 12, null);
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
    constructor(v, rel, capture) {
      this._isRelative = false;
      this._value = 0;
      this._capture = false;
      this._isRelative = rel;
      this._value = v;
      this._capture = typeof capture == "undefined" ? false : capture;
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
  return YDataRendererFull_exports;
})();
//# sourceMappingURL=yv4web-renderer.js.map

/*
*   Yocto-Visualization (for web), a free web-based application
*   to visualize Yoctopuce Sensors.
*
*  Graph widget renderer
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
export class pointXY {
    constructor(X, Y) {
        this.x = X === undefined ? 0 : X;
        this.y = Y === undefined ? 0 : Y;
    }
    clone() { return new pointXY(this.x, this.y); }
}
export class TimeConverterParseResult {
    constructor() {
        this.success = false;
        this.result = 0;
    }
}
class TimeResolution {
    constructor() {
        this.step = 0;
        this.format = 0;
    }
}
export class YDate extends Date {
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
        }
        else if (format & YDate.YYYY) {
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
            }
            else {
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
        }
        else if (format & YDate.ms01) {
            let ms = "00" + this.getMilliseconds().toString();
            res = res + "." + ms.substring(ms.length - 3).substring(2);
        }
        else if (format & YDate.ms001) {
            let ms = "00" + this.getMilliseconds().toString();
            res = res + "." + ms.substring(ms.length - 3).substring(3);
        }
        if ((format & YDate.h) && !YDate.use24Hformat) {
            res = res + ampm;
        }
        return res;
    }
}
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
YDate.d = (new Date()).toLocaleTimeString().toUpperCase();
YDate.use24Hformat = (YDate.d.indexOf("AM") < 0) && (YDate.d.indexOf("PM") < 0);
YDate.months = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
export class TimeConverter {
    static UTCNow() { return new YDate(); }
    static ToUnixTime(datetime) { return datetime.getTime() / 1000.0; }
    static FromUnixTime(unixtime) {
        let t = new YDate();
        t.setTime(unixtime * 1000);
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
        for (let i = 0; i < (it.length) && (i < 2); i++) {
            if (it[i].indexOf("-") > 0) {
                let tokens = it[i].split("-");
                if (tokens.length == 1) {
                    day = parseInt(tokens[0]);
                }
                else if (tokens.length == 2) {
                    day = parseInt(tokens[1]);
                    month = parseInt(tokens[0]) - 1;
                }
                else {
                    day = parseInt(tokens[2]);
                    month = parseInt(tokens[1]) - 1;
                    year = parseInt(tokens[0]);
                }
                dateFound = true;
            }
            else if (it[i].indexOf(":") > 0) {
                let tokens = it[i].split(":");
                if (tokens.length == 1) {
                    hours = parseInt(tokens[0]);
                }
                else if (tokens.length == 2) {
                    hours = parseInt(tokens[0]);
                    minutes = parseInt(tokens[1]);
                }
                else {
                    hours = parseInt(tokens[0]);
                    minutes = parseInt(tokens[1]);
                    seconds = parseFloat(tokens[2]);
                }
                timeFound = true;
            }
        }
        if ((!timeFound) && (!dateFound))
            return res;
        if (isNaN(year) || isNaN(month) || isNaN(day) || isNaN(hours) || isNaN(minutes) || isNaN(seconds))
            return res;
        date.setFullYear(year, month, day);
        date.setHours(hours, minutes, seconds >> 0, (1000 * (seconds % 1)) >> 0);
        res.result = date.getTime() / 1000; //- 60*date.getTimezoneOffset();
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
    //public static  secTimeSpanToString( timespan:number):string
    //  { return TimeConverter.secTimeSpanToString( timespan, 0); }
    static secTimeSpanToString(timespan, resolution) {
        let started = false;
        let res = "";
        if (timespan < 0) {
            res = "-";
            timespan = -timespan;
        }
        if (timespan >= 86400) {
            let d = (timespan / 86400) >> 0;
            res = res + d.toString() + "d";
            timespan -= 86400 * d;
            started = true;
        }
        if (resolution >= 86400)
            return res != "" ? res : "0d";
        if (timespan >= 3600) {
            let d = ((timespan / 3600) >> 0);
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
            let d = (timespan / 60) >> 0;
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
        }
        else if (resolution > 0.01) {
            s = timespan.toFixed(1);
        }
        else if (resolution > 0.001) {
            s = timespan.toFixed(2);
        }
        else {
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
        if (dataDeltaTime <= 0.10) {
            ShowSecondsHundredth = true;
        }
        if (dataDeltaTime <= 1) {
            ShowSecondsTenth = true;
        }
        if ((dataDeltaTime >= 60) || (viewportDeltaTime >= 60)) {
            ShowMinutes = true;
        }
        if ((dataDeltaTime >= 3600) || (viewportDeltaTime >= 3600)) {
            ShowHours = true;
        }
        if ((dataDeltaTime >= 86400) || (viewportDeltaTime >= 86400)) {
            ShowDays = true;
        }
        if (resolution >= .1)
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
        if (viewportDeltaTime <= 0.10) {
            res.step = 0.01;
        }
        else if (viewportDeltaTime <= 1) {
            res.step = 0.1;
        }
        else if (viewportDeltaTime <= 2) {
            res.step = 0.2;
        }
        else if (viewportDeltaTime <= 5) {
            res.step = 0.5;
        }
        else if (viewportDeltaTime <= 10) {
            res.step = 1;
        }
        else if (viewportDeltaTime <= 20) {
            res.step = 2;
        }
        else if (viewportDeltaTime <= 30) {
            res.step = 3;
        }
        else if (viewportDeltaTime <= 40) {
            res.step = 4;
        }
        else if (viewportDeltaTime <= 60) {
            res.step = 5;
        }
        else if (viewportDeltaTime <= 120) {
            res.step = 10;
        }
        else if (viewportDeltaTime <= 300) {
            res.step = 30;
        }
        else if (viewportDeltaTime <= 900) {
            res.step = 60;
        }
        else if (viewportDeltaTime <= 1800) {
            res.step = 180;
        }
        else if (viewportDeltaTime <= 3600) {
            res.step = 300;
        }
        else if (viewportDeltaTime <= 7200) {
            res.step = 600;
        }
        else if (viewportDeltaTime <= 14000) {
            res.step = 900;
        }
        else if (viewportDeltaTime <= 21600) {
            res.step = 1800;
        }
        else if (viewportDeltaTime <= 43200) {
            res.step = 3600;
        }
        else if (viewportDeltaTime <= 86400) {
            res.step = 7200;
        }
        else if (viewportDeltaTime <= 2 * 86400) {
            res.step = 2 * 7200;
        }
        else if (viewportDeltaTime <= 4 * 86400) {
            res.step = 4 * 7200;
        }
        else if (viewportDeltaTime <= 7 * 86400) {
            res.step = 86400;
        }
        else if (viewportDeltaTime <= 14 * 86400) {
            res.step = 2 * 86400;
        }
        else if (viewportDeltaTime <= 28 * 86400) {
            res.step = 4 * 86400;
        }
        else if (viewportDeltaTime <= 56 * 86400) {
            res.step = 7 * 86400;
        }
        else if (viewportDeltaTime <= 112 * 86400) {
            res.step = 14 * 86400;
        }
        else if (viewportDeltaTime <= 224 * 86400) {
            res.step = 31 * 86400;
        }
        else if (viewportDeltaTime <= 448 * 86400) {
            res.step = 62 * 86400;
        }
        else if (viewportDeltaTime <= 896 * 86400) {
            res.step = 93 * 86400;
        }
        else {
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
            if (res.step >= .1)
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
            if ((res.format != 0) && (ShowDays || ShowMonths))
                res.format |= YDate.CR;
            if (ShowDays)
                res.format |= YDate.D;
            if (ShowMonths)
                res.format |= YDate.M;
            if (ShowYears)
                res.format |= YDate.YY;
            if (res.format == YDate.YY)
                res.format = YDate.YYYY;
            /*
      res.format = "";
      if (ShowSecondsHundredth) res.format = ".ff";
      if (ShowSecondsTenth) res.format = ".f";
      if (ShowSeconds) res.format = "ss" + res.format;
      if (ShowMinutes) res.format = "mm" + (res.format == "" ? "" : ":") + res.format;
      if (ShowHours) res.format = "HH" + (res.format == "" ? "\\H" : ":") + res.format;
      if ((res.format != "") && (ShowDays || ShowMonths)) res.format += "\n";
      if (ShowDays) res.format = res.format + "d";
      if (ShowMonths) res.format = res.format + " MMM";
      if (ShowYears) res.format = res.format + " yyyy";
  */
        }
        else {
            res.format = TimeConverter.RelativeFormat(dataDeltaTime, viewportDeltaTime, res.step);
        }
        return res;
    }
}
(function (TimeConverter) {
    class TimeReferenceEnumItem extends YDataRendering.YEnumItem {
        constructor(value, humanreadable, container) {
            super(value, humanreadable, TimeReference);
        }
    }
    TimeConverter.TimeReferenceEnumItem = TimeReferenceEnumItem;
    // export const enum TimeReference {ABSOLUTE = "Absolute", RELATIVE = "Relative to first data" }
    class TimeReference extends YDataRendering.YEnum {
    }
    TimeReference.ABSOLUTE = new TimeReferenceEnumItem("ABSOLUTE", "Absolute");
    TimeReference.RELATIVE = new TimeReferenceEnumItem("RELATIVE", "Relative to first data");
    TimeConverter.TimeReference = TimeReference;
})(TimeConverter || (TimeConverter = {}));
export class MinMax {
    constructor(minimum, maximum) {
        this.Min = 0;
        this.Max = 0;
        this.Min = minimum;
        this.Max = maximum;
    }
}
export class MinMaxHandler {
    static extend(M, factor) {
        if (isNaN(M.Min))
            return M;
        let delta = M.Max - M.Min;
        return new MinMax(M.Min - (delta * (factor - 1)) / 2, M.Max + (delta * (factor - 1)) / 2);
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
}
export class DataSegment {
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
        }
        else if (p instanceof pointXY) { /*
       this.data = new Array();
       this.data.push(p);
       this.count =1;
       while (this.data.length <  DataSegment.SegmentGranularity) { this.data.push(new pointXY()); }
       */
            this.data = new Array(DataSegment.SegmentGranularity);
            this.data[0] = p;
            this.count = 1;
        }
        else {
            throw new Error("invalid constructor paramter type");
        }
    }
    grow() {
        let targetCount = this.data.length + DataSegment.SegmentGranularity;
        while (this.data.length < targetCount) {
            this.data.push(null);
        }
    }
}
DataSegment.SegmentGranularity = 1000;
export class DataSerie {
    get userData() { return this._userData; }
    set userData(value) { this._userData = value; }
    static get MaxPointsPerSeries() { return DataSerie._MaxPointsPerSeries; }
    static set MaxPointsPerSeries(value) { DataSerie._MaxPointsPerSeries = value; }
    get timeRange() { return this._timeRange; }
    get valueRange() { return this._valueRange; }
    constructor(parent) {
        this.totalPointCount = 0;
        this._userData = null;
        this._yAxisIndex = 0;
        this._pen = null;
        this._legendPen = null;
        this._brush = null;
        this._navigatorpen = null;
        this._visible = true; // whet not visible, series is  not shown but still intervene in Axis auto range calculus
        this._disabled = false; // when series is disabled,rendering acts just like to series does not exists
        this._color = YDataRendering.YColor.Black;
        this._thickness = 1.0;
        this._legend = "";
        this._unit = "";
        this.segments = [];
        if (parent.yAxes.length <= 0)
            throw new Error("Define at least one yAxis");
        this._timeRange = MinMaxHandler.DefaultValue();
        this._valueRange = MinMaxHandler.DefaultValue();
        this.parent = parent;
    }
    get yAxisIndex() { return this._yAxisIndex; }
    set yAxisIndex(value) {
        if (value >= this.parent.yAxes.length)
            throw new RangeError("No such yAxis (" + value.toString() + ")");
        this._yAxisIndex = value;
        this.parent.yAxes[this._yAxisIndex].AutoShow();
    }
    get pen() {
        if (this._pen == null) {
            this._pen = new YDataRendering.YPen(this._color, this._thickness);
            this._pen.endCap = 2 /* YDataRendering.YPen.LineCap.Round */;
            this._pen.linejoin = YDataRendering.YPen.LineJoin.Round;
        }
        return this._pen;
    }
    get legendPen() {
        if (this._legendPen == null) {
            this._legendPen = new YDataRendering.YPen(this._color, this._thickness * this.parent.legendPanel.traceWidthFactor);
        }
        return this._legendPen;
    }
    resetlegendPen() { this._legendPen = null; }
    get brush() {
        if (this._brush == null)
            this._brush = new YDataRendering.YSolidBrush(this._color);
        return this._brush;
    }
    get navigatorpen() {
        if (this._navigatorpen == null) {
            this._navigatorpen = new YDataRendering.YPen(YDataRendering.YColor.FromArgb(100, this._color.red, this._color.green, this._color.blue), 1.0);
        }
        return this._navigatorpen;
    }
    get visible() { return this._visible; }
    set visible(value) {
        this._visible = value;
        this.parent.redraw();
    }
    get disabled() { return this._disabled; }
    set disabled(value) {
        this._disabled = value;
        this.parent.redraw();
    }
    get color() { return this._color; }
    set color(value) {
        this._color = value;
        this._pen = null;
        this._legendPen = null;
        this._brush = null;
        this._navigatorpen = null;
        this.parent.redraw();
    }
    get thickness() { return this._thickness; }
    set thickness(value) {
        if (value < 0)
            throw new RangeError("Thickness must be a positive value");
        this._thickness = value;
        this._pen = null;
        this._legendPen = null;
        this.parent.redraw();
    }
    get legend() { return this._legend; }
    set legend(value) {
        this._legend = value;
        this.parent.redraw();
    }
    get unit() { return this._unit; }
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
        }
        else if (this.segments[0].count > 1) {
            let delta1 = this.segments[0].data[this.segments[0].count - 1].x - this.segments[0].data[this.segments[0].count - 2].x;
            let delta2 = p.x - this.segments[0].data[this.segments[0].count - 1].x;
            if ((delta2 > 0.1) && ((delta2 < 0) || (delta2 > 2 * delta1))) {
                this.AddNewSegment(p);
                return;
            }
            else if (this.segments[0].count >= this.segments[0].data.length)
                this.segments[0].grow();
        }
        this.segments[0].data[this.segments[0].count] = p;
        this.segments[0].count++;
        this.totalPointCount++;
        if ((DataSerie._MaxPointsPerSeries > 0) && (this.totalPointCount > DataSerie._MaxPointsPerSeries))
            this.dataCleanUp();
        this.parent.adjustGlobalTimeRange(p.x);
        this.parent.redraw();
    }
    dataCleanUp() {
        if (this.segments.length <= 0)
            return;
        let newLimit = ((DataSerie._MaxPointsPerSeries * 90) / 100);
        while (this.segments[this.segments.length - 1].count <= (this.totalPointCount - newLimit)) {
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
        //int sz = System.Runtime.InteropServices.Marshal.SizeOf(typeof(pointXY));
        // can we merge with one already existing segment ?
        for (let i = 0; i < this.segments.length; i++) {
            if (this.segments[i].count > 1) {
                let DeltaInsertAtBegining = this.segments[i].data[0].x - points[points.length - 1].x;
                let DeltaInsertAtEnd = points[0].x - this.segments[i].data[this.segments[i].count - 1].x;
                if ((DeltaInsertAtBegining > 0) && (DeltaInsertAtBegining < 2 * FirstStep))
                    InsertAtBegining = i;
                if ((DeltaInsertAtEnd > 0) && (DeltaInsertAtEnd < 2 * LastStep))
                    InsertAtEnd = i;
            }
        }
        if (InsertAtBegining >= 0) // insert at the beginning of segments[InsertAtBeginning]
         {
            if (this.segments[InsertAtBegining].count + points.length >= this.segments[InsertAtBegining].data.length)
                this.segments[InsertAtBegining].grow();
            DataSegment.ArrayCopy(this.segments[InsertAtBegining].data, 0, this.segments[InsertAtBegining].data, points.length, this.segments[InsertAtBegining].count);
            DataSegment.ArrayCopy(points, 0, this.segments[InsertAtBegining].data, 0, points.length);
            this.segments[InsertAtBegining].count += points.length;
            this.totalPointCount += points.length;
        }
        else if (InsertAtEnd >= 0) // insert at the end of segments[InsertAtEnd]
         {
            if (this.segments[InsertAtEnd].count + points.length >= this.segments[InsertAtEnd].data.length)
                this.segments[InsertAtEnd].grow();
            DataSegment.ArrayCopy(points, 0, this.segments[InsertAtEnd].data, this.segments[InsertAtEnd].count, points.length);
            this.segments[InsertAtEnd].count += points.length;
            this.totalPointCount += points.length;
        }
        else // create a whole new segment
         {
            this.segments.push(new DataSegment(points));
            this.totalPointCount += points.length;
        }
        this._timeRange = MinMaxHandler.CombineWithNumber(this._timeRange, points[0].x);
        this._timeRange = MinMaxHandler.CombineWithNumber(this._timeRange, points[points.length - 1].x);
        for (let i = 0; i < points.length; i++) {
            this._valueRange = MinMaxHandler.CombineWithNumber(this._valueRange, points[i].y);
        }
        if ((DataSerie._MaxPointsPerSeries > 0) && (this.totalPointCount > DataSerie._MaxPointsPerSeries))
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
        // check for best match inside segments
        for (let i = 0; i < this.segments.length; i++) {
            if ((x >= this.segments[i].data[0].x) && (x <= this.segments[i].data[this.segments[i].count - 1].x)) {
                let data = this.segments[i].data;
                N1 = 0;
                N2 = this.segments[i].count - 1;
                while (N2 - N1 > 1) {
                    let N = (N1 + N2) >> 1;
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
                }
                else {
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
        // check for best match outside segments
        try {
            this.segments[0].data[0].clone();
        }
        catch (e) {
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
}
DataSerie._MaxPointsPerSeries = 0;
export class DataTracker {
    get directParent() { return this._directParent; }
    get userData() { return this._userData; }
    set userData(value) { this._userData = value; }
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
        this._bgColor = YDataRendering.YColor.FromArgb(200, 255, 255, 255);
        this._borderColor = YDataRendering.YColor.Black;
        this._borderthickness = 1.0;
        this._padding = 10;
        this._verticalMargin = 10;
        this._horizontalMargin = 10;
        this._bgBrush = null;
        this._pen = null;
        this._font = null;
        this._directParent = directParent;
        this._parentRenderer = parent;
        this._font = new YDataRendering.YFont(parent, this, 8, null);
    }
    get enabled() { return this._enabled; }
    set enabled(value) {
        this._enabled = value;
        this._parentRenderer.redraw();
    }
    get showSerieName() { return this._showSerieName; }
    set showSerieName(value) {
        this._showSerieName = value;
        this._parentRenderer.redraw();
    }
    get showTimeStamp() { return this._showTimeStamp; }
    set showTimeStamp(value) {
        this._showTimeStamp = value;
        this._parentRenderer.redraw();
    }
    get dataPrecisionString() { return this._dataPrecisionString; }
    get dataPrecision() { return this._dataPrecision; }
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
        // FIXME
        // for (let i: number = 1; i < this._dataPrecision; i++) this._dataPrecisionString += "#";
    }
    get diameter() { return this._diameter; }
    set diameter(value) {
        if (value < 0)
            throw new RangeError("Diameter must be a positive value");
        this._diameter = value;
        this._parentRenderer.redraw();
    }
    get handleLength() { return this._handleLength; }
    set handleLength(value) {
        if (value < 0)
            throw new RangeError("Hanle length must be a positive value");
        this._handleLength = value;
        this._parentRenderer.redraw();
    }
    get detectionDistance() { return this._detectionDistance; }
    set detectionDistance(value) {
        if (value <= 0)
            throw new RangeError("Distance must be a positive value");
        this._detectionDistance = value;
    }
    get bgColor() { return this._bgColor; }
    set bgColor(value) {
        this._bgColor = value;
        this._bgBrush = null;
        this._parentRenderer.redraw();
    }
    get borderColor() { return this._borderColor; }
    set borderColor(value) {
        this._borderColor = value;
        this._pen = null;
        this._parentRenderer.redraw();
    }
    get borderthickness() { return this._borderthickness; }
    set borderthickness(value) {
        if (value < 0)
            throw new RangeError("Thickness must be a positive value");
        this._borderthickness = value;
        this._pen = null;
        this._parentRenderer.redraw();
    }
    get padding() { return this._padding; }
    set padding(value) {
        if (value < 0)
            throw new RangeError("Padding must be a positive value");
        this._padding = value;
        this._parentRenderer.redraw();
    }
    get verticalMargin() { return this._verticalMargin; }
    set verticalMargin(value) {
        if (value < 0)
            throw new RangeError("Margin must be a positive value");
        this._verticalMargin = value;
        this._parentRenderer.redraw();
    }
    get horizontalMargin() { return this._horizontalMargin; }
    set horizontalMargin(value) {
        if (value < 0)
            throw new RangeError("Margin must be a positive value");
        this._horizontalMargin = value;
        this._parentRenderer.redraw();
    }
    get bgBrush() {
        if (this._bgBrush == null) {
            this._bgBrush = new YDataRendering.YSolidBrush(this._bgColor);
        }
        return this._bgBrush;
    }
    get pen() {
        if (this._pen == null)
            this._pen = new YDataRendering.YPen(this._borderColor, this._borderthickness, true);
        return this._pen;
    }
    get font() { return this._font; }
}
(function (DataTracker) {
    class DataPrecisionEnumItem extends YDataRendering.YEnumItem {
        constructor(value, humanreadable, container) {
            super(value, humanreadable, DataPrecision);
        }
    }
    DataTracker.DataPrecisionEnumItem = DataPrecisionEnumItem;
    class DataPrecision extends YDataRendering.YEnum {
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
    DataTracker.DataPrecision = DataPrecision;
})(DataTracker || (DataTracker = {}));
export class LegendPanel {
    get directParent() { return this._directParent; }
    get userData() { return this._userData; }
    set userData(value) { this._userData = value; }
    get traceWidthFactor() { return this._traceWidth; }
    set traceWidthFactor(value) {
        if (value <= 0)
            throw new RangeError("This has to be a strictly positive value");
        this._traceWidth = value;
        this._parentRenderer.resetlegendPens();
        this._parentRenderer.redraw();
    }
    constructor(parent, directParent) {
        this._userData = null;
        this._traceWidth = 1.0;
        this._enabled = false;
        this._position = LegendPanel.Position.BOTTOM;
        this._overlap = false;
        this._bgColor = YDataRendering.YColor.FromArgb(200, 255, 255, 255);
        this._borderColor = YDataRendering.YColor.Black;
        this._borderthickness = 1.0;
        this._padding = 10;
        this._verticalMargin = 10;
        this._horizontalMargin = 10;
        this._bgBrush = null;
        this._pen = null;
        this._font = null;
        this._directParent = directParent;
        this._parentRenderer = parent;
        this._font = new YDataRendering.YFont(parent, this, 8, null);
    }
    get enabled() { return this._enabled; }
    set enabled(value) {
        this._enabled = value;
        this._parentRenderer.redraw();
    }
    get position() { return this._position; }
    set position(value) {
        this._position = value;
        this._parentRenderer.redraw();
    }
    get overlap() { return this._overlap; }
    set overlap(value) {
        this._overlap = value;
        this._parentRenderer.redraw();
    }
    get bgColor() { return this._bgColor; }
    set bgColor(value) {
        this._bgColor = value;
        this._bgBrush = null;
        this._parentRenderer.redraw();
    }
    get borderColor() { return this._borderColor; }
    set borderColor(value) {
        this._borderColor = value;
        this._pen = null;
        this._parentRenderer.redraw();
    }
    get borderthickness() { return this._borderthickness; }
    set borderthickness(value) {
        if (value < 0)
            throw new RangeError("Thickness must be a positive value");
        this._borderthickness = value;
        this._pen = null;
        this._parentRenderer.redraw();
    }
    get padding() { return this._padding; }
    set padding(value) {
        if (value < 0)
            throw new RangeError("Padding must be a positive value");
        this._padding = value;
        this._parentRenderer.redraw();
    }
    get verticalMargin() { return this._verticalMargin; }
    set verticalMargin(value) {
        if (value < 0)
            throw new RangeError("Margin must be a positive value");
        this._verticalMargin = value;
        this._parentRenderer.redraw();
    }
    get horizontalMargin() { return this._horizontalMargin; }
    set horizontalMargin(value) {
        if (value < 0)
            throw new RangeError("Margin must be a positive value");
        this._horizontalMargin = value;
        this._parentRenderer.redraw();
    }
    get bgBrush() {
        if (this._bgBrush == null) {
            this._bgBrush = new YDataRendering.YSolidBrush(this._bgColor);
        }
        return this._bgBrush;
    }
    get pen() {
        if (this._pen == null)
            this._pen = new YDataRendering.YPen(this._borderColor, this._borderthickness, true);
        return this._pen;
    }
    get font() { return this._font; }
}
(function (LegendPanel) {
    class PositionEnumItem extends YDataRendering.YEnumItem {
        constructor(value, humanreadable, container) {
            super(value, humanreadable, Position);
        }
    }
    LegendPanel.PositionEnumItem = PositionEnumItem;
    class Position extends YDataRendering.YEnum {
    }
    Position.LEFT = new PositionEnumItem("LEFT", "Left");
    Position.TOPLEFT = new PositionEnumItem("TOPLEFT", "Top-Left");
    Position.TOP = new PositionEnumItem("TOP", "Top");
    Position.TOPRIGHT = new PositionEnumItem("TOPRIGHT", "Top-Right");
    Position.RIGHT = new PositionEnumItem("RIGHT", "Right");
    Position.BOTTOMRIGHT = new PositionEnumItem("BOTTOMRIGHT", "Bottom-Right");
    Position.BOTTOM = new PositionEnumItem("BOTTOM", "Bottom");
    Position.BOTTOMLEFT = new PositionEnumItem("BOTTOMLEFT", "Bottom-Left");
    LegendPanel.Position = Position;
})(LegendPanel || (LegendPanel = {}));
export class Navigator {
    get directParent() { return this._directParent; }
    get userData() { return this._userData; }
    set userData(value) { this._userData = value; }
    get showXAxisZones() { return this._showXAxisZones; }
    set showXAxisZones(value) { this._showXAxisZones = value; }
    get relativeheight() { return this._relativeheight; }
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
        this._viewport = new YDataRendering.ViewPortSettings();
        this.Xrange = null;
        this._showXAxisZones = true;
        this._relativeheight = 10;
        this._enabled = false;
        this._bgColor1 = YDataRendering.YColor.FromArgb(255, 225, 225, 225);
        this._cursorBorderColor = YDataRendering.YColor.FromArgb(255, 40, 40, 40);
        this._yAxisHandling = Navigator.YAxisHandling.AUTO;
        this._bgColor2 = YDataRendering.YColor.FromArgb(255, 225, 225, 225);
        this._cursorColor = YDataRendering.YColor.FromArgb(100, 0, 255, 0);
        this._cursorBrush = null;
        this._pen = null;
        this._cursorBorderPen = null;
        this._xAxisColor = YDataRendering.YColor.Black;
        this._xAxisThickness = 1.0;
        this._borderPen = null;
        this._borderColor = YDataRendering.YColor.DimGray;
        this._borderThickness = 1.0;
        this._bgBrush = null;
        this._font = null;
        this._directParent = directParent;
        this._parentRenderer = parent;
        this._font = new YDataRendering.YFont(parent, this, 8, null);
    }
    get enabled() { return this._enabled; }
    set enabled(value) {
        this._enabled = value;
        this._parentRenderer.redraw();
    }
    get bgColor1() { return this._bgColor1; }
    set bgColor1(value) {
        this._bgColor1 = value;
        this._bgBrush = null;
        this._parentRenderer.redraw();
    }
    get cursorBorderColor() { return this._cursorBorderColor; }
    set cursorBorderColor(value) {
        this._cursorBorderColor = value;
        this._cursorBorderPen = null;
        this._parentRenderer.redraw();
    }
    get yAxisHandling() { return this._yAxisHandling; }
    set yAxisHandling(value) {
        this._yAxisHandling = value;
        this._parentRenderer.redraw();
    }
    get bgColor2() { return this._bgColor2; }
    set bgColor2(value) {
        this._bgColor2 = value;
        this._bgBrush = null;
        this._parentRenderer.redraw();
    }
    get cursorColor() { return this._cursorColor; }
    set cursorColor(value) {
        this._cursorColor = value;
        this._cursorBrush = null;
        this._parentRenderer.redraw();
    }
    get cursorBrush() {
        if (this._cursorBrush == null) {
            this._cursorBrush = new YDataRendering.YSolidBrush(this._cursorColor);
        }
        return this._cursorBrush;
    }
    get pen() {
        if (this._pen == null)
            this._pen = new YDataRendering.YPen(this._xAxisColor, this._xAxisThickness, true);
        return this._pen;
    }
    get cursorBorderPen() {
        if (this._cursorBorderPen == null)
            this._cursorBorderPen = new YDataRendering.YPen(this._cursorBorderColor, 1, true);
        return this._cursorBorderPen;
    }
    get xAxisColor() { return this._xAxisColor; }
    set xAxisColor(value) {
        this._xAxisColor = value;
        this._pen = null;
        this._parentRenderer.redraw();
    }
    get xAxisThickness() { return this._xAxisThickness; }
    set xAxisThickness(value) {
        if (value < 0)
            throw new RangeError("Thickness must be a positive value");
        this._xAxisThickness = value;
        this._pen = null;
        this._parentRenderer.redraw();
    }
    get borderPen() {
        if (this._borderPen == null)
            this._borderPen = new YDataRendering.YPen(this._borderColor, this._borderThickness, true);
        return this._borderPen;
    }
    get borderColor() { return this._borderColor; }
    set borderColor(value) {
        this._borderColor = value;
        this._borderPen = null;
        this._parentRenderer.redraw();
    }
    get borderThickness() { return this._borderThickness; }
    set borderThickness(value) {
        if (value < 0)
            throw new RangeError("Thickness must be a positive value");
        this._borderThickness = value;
        this._borderPen = null;
        this._parentRenderer.redraw();
    }
    setPosition(ParentWidth, ParentHeight, Lmargin, Rmargin, Tmargin, Bmargin) {
        if ((this._viewport.Lmargin != Lmargin) || (this._viewport.Rmargin != Rmargin)
            || (this._viewport.Tmargin != Tmargin) || (this._viewport.Bmargin != Bmargin)) {
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
    get Capture() { return this._viewport.Capture; }
    stopCapture() { this._viewport.Capture = false; }
    get viewport() { return this._viewport; }
    get bgBrush() {
        if (this._bgBrush == null) {
            this._bgBrush = new YDataRendering.YLinearGradientBrush(this._bgColor1, this._bgColor2);
        }
        return this._bgBrush;
    }
    get font() { return this._font; }
}
(function (Navigator) {
    class YAxisHandlingEnumItem extends YDataRendering.YEnumItem {
        constructor(value, humanreadable, container) {
            super(value, humanreadable, YAxisHandling);
        }
    }
    Navigator.YAxisHandlingEnumItem = YAxisHandlingEnumItem;
    class YAxisHandling extends YDataRendering.YEnum {
    }
    YAxisHandling.AUTO = new YAxisHandlingEnumItem("AUTO", "Automatic");
    YAxisHandling.INHERIT = new YAxisHandlingEnumItem("INHERIT", "Inherit from main view");
    Navigator.YAxisHandling = YAxisHandling;
})(Navigator || (Navigator = {}));
export class Marker {
    get userData() { return this._userData; }
    set userData(value) { this._userData = value; }
    static _round100(v) { return Math.round(100 * v) / 100; }
    get stringFormat() {
        if (this._stringFormat != null)
            return this._stringFormat;
        this._stringFormat = new YDataRendering.YStringFormat(16384 /* YDataRendering.YStringFormat.StringFormatFlags.NoClip */);
        this._stringFormat.LineAlignment = 1 /* YDataRendering.YStringFormat.StringAlignment.Center */;
        switch (this._textAlign) {
            case Marker.TextAlign.LEFT:
                this._stringFormat.Alignment = 0 /* YDataRendering.YStringFormat.StringAlignment.Near */;
                break;
            case Marker.TextAlign.CENTER:
                this._stringFormat.Alignment = 1 /* YDataRendering.YStringFormat.StringAlignment.Center */;
                break;
            case Marker.TextAlign.RIGHT:
                this._stringFormat.Alignment = 2 /* YDataRendering.YStringFormat.StringAlignment.Far */;
                break;
        }
        return this._stringFormat;
    }
    get PatchTextCallback() { return this._MarkerTextCallback; }
    set PatchTextCallback(callback) { this._MarkerTextCallback = callback; }
    get directParent() { return this._directParent; }
    constructor(parent, directParent) {
        this._userData = null;
        this._stringFormat = null;
        this._MarkerTextCallback = null;
        this._enabled = false;
        this._xposition = 0.0;
        this._xpositionIsRelative = false;
        this._yposition = 92.0;
        this._text = "Marker";
        this._textAlign = Marker.TextAlign.CENTER;
        this._bgColor = YDataRendering.YColor.FromArgb(255, 255, 255, 192);
        this._borderColor = YDataRendering.YColor.DarkRed;
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
        this._font = new YDataRendering.YFont(parent, this, 8, null);
    }
    startCapture() {
        this._parentRenderer.startMarkerCapture(this);
    }
    setCapturedPosition(position, axis) {
        this.enabled = true;
        this._xpositionIsRelative = (axis.timeReference == TimeConverter.TimeReference.RELATIVE) && axis.zeroTime > 0;
        this._xposition = Marker._round100(this._xpositionIsRelative ? position - axis.zeroTime : position);
        this._parentRenderer.clearCachedObjects();
        this._parentRenderer.redraw();
    }
    get enabled() { return this._enabled; }
    set enabled(value) {
        if (this._enabled != value) {
            this._enabled = value;
            this._parentRenderer.clearCachedObjects();
            this._parentRenderer.redraw();
        }
    }
    get xposition() { return this._xposition; }
    set xposition(value) {
        this._xposition = Marker._round100(value);
        if (this._enabled)
            this._parentRenderer.redraw();
    }
    get timereference() { return this._xpositionIsRelative ? TimeConverter.TimeReference.RELATIVE : TimeConverter.TimeReference.ABSOLUTE; }
    set timereference(value) {
        let v = value == TimeConverter.TimeReference.RELATIVE;
        if (this._xpositionIsRelative != v) {
            let ZeroPosition = this._directParent.zeroTime;
            if (isNaN(ZeroPosition))
                ZeroPosition = 0;
            if (v) {
                this._xpositionIsRelative = true;
                this._xposition -= ZeroPosition;
            }
            else {
                this._xpositionIsRelative = false;
                this._xposition += ZeroPosition;
            }
            this._xposition = Marker._round100(this._xposition);
            this._parentRenderer.redraw();
        }
    }
    // a special variant which also to get/set both xposition and xpositionIsRelative at the same time
    // and allow to start position capture as well.
    get positionOnXAxis() { return new xAxisPosition(this._xposition, this._xpositionIsRelative); }
    set positionOnXAxis(value) {
        if (value.capture) {
            this.startCapture();
        }
        else {
            let v = Marker._round100(value.value);
            if ((this._xpositionIsRelative != value.relative) || (this._xposition != v)) {
                this._xposition = v;
                this._xpositionIsRelative = value.relative;
                if (this._enabled)
                    this._parentRenderer.redraw();
            }
        }
    }
    get yposition() { return this._yposition; }
    set yposition(value) {
        this._yposition = Math.min(100, Math.max(0, value));
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
    get textAlign() { return this._textAlign; }
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
        this._arrowBrush = null;
        this._pen = null;
        this._navigatorpen = null;
        if (this._enabled)
            this._parentRenderer.redraw();
    }
    get borderthickness() { return this._borderthickness; }
    set borderthickness(value) {
        if (value < 0)
            throw new RangeError("thickness must be a positive value");
        this._borderthickness = value;
        this._parentRenderer.clearCachedObjects();
        this._pen = null;
        if (this._enabled)
            this._parentRenderer.redraw();
    }
    get arrowSize() { return this._arrowSize; }
    set arrowSize(value) {
        this._arrowSize = value;
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
        if (this._bgBrush == null) {
            this._bgBrush = new YDataRendering.YSolidBrush(this._bgColor);
        }
        return this._bgBrush;
    }
    get arrowBrush() {
        if (this._arrowBrush == null) {
            this._arrowBrush = new YDataRendering.YSolidBrush(this._borderColor, true);
        }
        return this._arrowBrush;
    }
    get pen() {
        if (this._pen == null)
            this._pen = new YDataRendering.YPen(this._borderColor, this._borderthickness, true);
        return this._pen;
    }
    get navigatorpen() {
        if (this._navigatorpen == null)
            this._navigatorpen = new YDataRendering.YPen(this._borderColor, 1.0);
        return this._navigatorpen;
    }
    get font() { return this._font; }
}
(function (Marker) {
    /* export enum TextAlign
  {
    LEFT = "Left", CENTER = "Center", RIGHT = "Right"
  }*/
    class TextAlignEnumItem extends YDataRendering.YEnumItem {
        constructor(value, humanreadable, container) {
            super(value, humanreadable, TextAlign);
        }
    }
    Marker.TextAlignEnumItem = TextAlignEnumItem;
    class TextAlign extends YDataRendering.YEnum {
    }
    TextAlign.LEFT = new TextAlignEnumItem("LEFT", "Left");
    TextAlign.CENTER = new TextAlignEnumItem("CENTER", "Center");
    TextAlign.RIGHT = new TextAlignEnumItem("RIGHT", "Right");
    Marker.TextAlign = TextAlign;
})(Marker || (Marker = {}));
export class Legend {
    get directParent() { return this._directParent; }
    get userData() { return this._userData; }
    set userData(value) { this._userData = value; }
    constructor(parent, directParent) {
        this._userData = null;
        this._title = "";
        this._font = null;
        this._directParent = directParent;
        this._parentRenderer = parent;
        this._font = new YDataRendering.YFont(parent, this, 12, null);
    }
    get title() { return this._title; }
    set title(value) {
        this._title = value;
        this._parentRenderer.redraw();
    }
    get font() { return this._font; }
}
export class GenericAxis {
    get directParent() { return this._directParent; }
    get zones() { return this._zones; }
    AddZone() {
        let z = new YDataRendering.Zone(this._parentRenderer, this);
        this._zones.push(z);
        return z;
    }
    get userData() { return this._userData; }
    set userData(value) { this._userData = value; }
    get AxisChanged() { return this._AxisChanged; }
    set AxisChanged(value) { this._AxisChanged = value; }
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
        this._thickness = 1.0;
        this._color = YDataRendering.YColor.Black;
        this._showGrid = false;
        this._gridColor = YDataRendering.YColor.FromArgb(50, 0, 0, 0);
        this._gridThickness = 1.0;
        this._font = null;
        this._zones = [];
        this._directParent = directParent;
        this._parentRenderer = parent;
        this._legend = new Legend(parent, this);
        this._font = new YDataRendering.YFont(parent, this);
    }
    get pen() {
        if (this._pen == null)
            this._pen = new YDataRendering.YPen(this._color, this._thickness, true);
        return this._pen;
    }
    get gridPen() {
        if (this._gridPen == null)
            this._gridPen = new YDataRendering.YPen(this._gridColor, this._gridThickness, true);
        return this._gridPen;
    }
    get visible() { return this._visible; }
    set visible(value) {
        this._visible = value;
        if (!value) {
            this._AllowAutoShow = false;
        }
        this._parentRenderer.redraw();
    }
    get AllowAutoShow() { return this._AllowAutoShow; }
    set AllowAutoShow(value) { this._AllowAutoShow = value; }
    AutoShow() {
        if (this._AllowAutoShow) {
            this.visible = true;
            if (this._AxisChanged != null)
                this._AxisChanged(this);
        }
    }
    set_minMax(value_min, value_max) {
        if (!isNaN(value_min) && !isNaN(value_max) && (value_min >= value_max)) {
            throw new RangeError("Min (" + value_min.toString() + ") cannot be greater than max (" + value_max.toString() + ")");
        }
        this._min = value_min;
        this._max = value_max;
        this._parentRenderer.redraw();
    }
    get min() { return this._min; }
    set min(value) {
        if (!isNaN(value) && !isNaN(this._max) && !YDataRendering.YDataRenderer.minMaxCheckDisabled) {
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
    get max() { return this._max; }
    set max(value) {
        if (!isNaN(value) && !isNaN(this._min) && !YDataRendering.YDataRenderer.minMaxCheckDisabled) {
            if (value <= this._min)
                throw new RangeError("Max cannot be less than min (" + this._min.toString() + ")");
        }
        this._max = value;
        this._parentRenderer.redraw();
    }
    get step() { return this._step; }
    set step(value) {
        if (!isNaN(value) && (value < 0))
            throw new RangeError("Steps must be a strictely positive value");
        this._step = value;
        this._parentRenderer.redraw();
    }
    get thickness() { return this._thickness; }
    set thickness(value) {
        if (value < 0)
            throw new RangeError("Thickness must be a positive value");
        this._thickness = value;
        this._pen = null;
        this._parentRenderer.redraw();
    }
    get color() { return this._color; }
    set color(value) {
        this._color = value;
        this._pen = null;
        this._parentRenderer.redraw();
    }
    get showGrid() { return this._showGrid; }
    set showGrid(value) {
        this._showGrid = value;
        this._parentRenderer.redraw();
    }
    get gridColor() { return this._gridColor; }
    set gridColor(value) {
        this._gridColor = value;
        this._gridPen = null;
        this._parentRenderer.redraw();
    }
    get gridThickness() { return this._gridThickness; }
    set gridThickness(value) {
        if (value < 0)
            throw new RangeError("Thickness must be a positive value");
        this._gridThickness = value;
        this._gridPen = null;
        this._parentRenderer.redraw();
    }
    get font() { return this._font; }
    get legend() { return this._legend; }
}
export class StartStopStep {
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
}
/*  never used?

public class ReadOnlyIndexedProperty<TValue>
{
  readonly List<TValue> ContainerList;

  public ReadOnlyIndexedProperty(List<TValue> list)
{
  this.ContainerList = list;
}

public TValue this[int i]
{
  get
  {
    return ContainerList[i];
  }
}

public int Count { get { return ContainerList.Count; } }
}
*/
export class xAxisPosition {
    get relative() { return this._isRelative; }
    set relative(value) { this._isRelative = value; }
    get value() { return this._value; }
    set value(value) { this._value = value; }
    constructor(v, rel, capture) {
        this._isRelative = false;
        this._value = 0;
        // a weird way to start the marker position capture
        // through a property change, as Yocto-Visualization
        // editor can only change properties.
        this._capture = false;
        this._isRelative = rel;
        this._value = v;
        this._capture = typeof (capture) == "undefined" ? false : capture;
    }
    clone() {
        return new xAxisPosition(this._value, this._isRelative, this._capture);
    }
    toString() {
        if (this._isRelative) {
            return TimeConverter.secTimeSpanToString(this._value, 0);
        }
        else { // will need a fix to use this.DTdisplayformat
            let date = TimeConverter.FromUnixTime(this._value);
            let res = date.getFullYear().toString() + "-" + (date.getMonth() + 1).toString() + "-" + date.getDate().toString()
                + " " + date.getHours().toString() + ":";
            let st = date.getMinutes().toString();
            if (st.length <= 1)
                st = "0" + st;
            res = res + st + ":";
            let s = date.getSeconds();
            let ms = date.getMilliseconds();
            s = s + ms / 1000;
            if (s < 10)
                res = res + "0";
            if (ms == 0) {
                res = res + s.toString();
            }
            else {
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
    get capture() { return this._capture; }
    set capture(value) { this._capture = value; }
}
xAxisPosition.DTdisplayformat = "DD/MM/YY hh:mm:ss.ff";
xAxisPosition.TSdisplayformat = "dd.hh:mm:ss.ff";
class YNumberFormatInfo {
    constructor() {
        this.NumberDecimalSeparator = ".";
    }
}
export class YAxis extends GenericAxis {
    constructor(parent, directParent, index) {
        super(parent, directParent);
        this._index = 0;
        this._highlightZero = false;
        this._position = YAxis.HrzPosition.LEFT;
        this.innerWidth = 0; // public, really?
        this.zoom = 0;
        this.IRLy = 0;
        this._index = index;
        this.nfi = new YNumberFormatInfo();
        this.nfi.NumberDecimalSeparator = ".";
        this.startStopStep = new StartStopStep();
        this.startStopStep.start = 0;
        this.startStopStep.stop = 1;
        this.startStopStep.step = .1;
    }
    get index() { return this._index; }
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
    get highlightZero() { return this._highlightZero; }
    set highlightZero(value) {
        this._highlightZero = value;
        this._parentRenderer.redraw();
    }
    get position() { return this._position; }
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
            M.Max = 100.0;
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
            if ((MagnitudePwr - Math.floor(MagnitudePwr)) != 0)
                MagnitudePwr = Math.floor(MagnitudePwr) + 1;
            res.precision = (MagnitudePwr - 1) >> 0;
            let Magnitude = Math.pow(10, res.precision);
            let C = Delta / Magnitude;
            if (C <= 2) {
                res.step = (Magnitude / 5);
                res.precision--;
            }
            else if (C <= 5) {
                res.step = (Magnitude / 2);
                res.precision--;
            }
            else {
                res.step = (Magnitude);
            }
            if (isNaN(this.min)) {
                let c = min / res.step;
                if (c - Math.floor(c) != 0)
                    c = (c > 0) ? Math.floor(c) + 1 : Math.floor(c) - 1;
                res.start = res.step * c;
                //     if ((M.Min < 0) && (M.Min - (int)M.Min != 0)) res.start -= res.step;
            }
        }
        else {
            let v = res.step.toString();
            let p = v.indexOf('.');
            if (p >= 0) {
                res.precision = -(v.length - p - 1);
            }
            else {
                res.precision = 0;
            }
        }
        this.startStopStep = res;
        return res;
    }
}
(function (YAxis) {
    // export enum HrzPosition { LEFT = 'Left', RIGHT = 'Right' }
    //
    class HrzPositionEnumItem extends YDataRendering.YEnumItem {
        constructor(value, humanreadable, container) {
            super(value, humanreadable, HrzPosition);
        }
    }
    YAxis.HrzPositionEnumItem = HrzPositionEnumItem;
    class HrzPosition extends YDataRendering.YEnum {
    }
    HrzPosition.LEFT = new HrzPositionEnumItem("LEFT", "Left");
    HrzPosition.RIGHT = new HrzPositionEnumItem("RIGHT", "Right");
    YAxis.HrzPosition = HrzPosition;
})(YAxis || (YAxis = {}));
export class XAxis extends GenericAxis {
    get position() { return this._position; }
    set position(value) {
        this._position = value;
        this._parentRenderer.redraw();
    }
    get markers() { return this._markers; }
    AddMarker() {
        let m = new Marker(this._parentGraph, this);
        this._markers.push(m);
        this._parentGraph.clearCachedObjects();
        this._parentGraph.redraw();
        return m;
    }
    get initialZoom() { return this._initialZoom; }
    set initialZoom(value) {
        if (value <= 0)
            throw new RangeError("Zoom must be a positive value");
        this._initialZoom = value;
        this.min = this.min - (this._initialZoom * this._initialOffset / 100);
        this.max = this.min + this.initialZoom;
        this._parentRenderer.redraw();
    }
    get initialOffset() { return this._initialOffset; }
    set initialOffset(value) {
        this._initialOffset = value;
        let p = this._parentGraph.getMostRecentPoint();
        if (isNaN(p.x)) {
            this._min = this._min - (this._initialZoom * this._initialOffset / 100);
            this._max = this._min + this._initialZoom;
            this._parentRenderer.redraw();
        }
        else {
            let zoom = this._max - this._min;
            this._min = p.x - (zoom * this._initialOffset / 100);
            this._max = this._min + zoom;
        }
        this._parentRenderer.redraw();
    }
    get labelFormat() { return this._format; }
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
        // in case of relative time reference : position of the Zero
        this._zeroTime = 0;
        //  Max timestamp- Min timestamp of all series values
        this._fullSize = 0;
        this.innerHeight = 0;
        this._overflowHandling = XAxis.OverflowHandling.DONOTHING;
        this._parentGraph = parent;
        this._markers = [];
        this.min = TimeConverter.ToUnixTime(TimeConverter.UTCNow());
        this.max = this.min + this.initialZoom;
        this.step = 30;
    }
    get timeReference() { return this._timeReference; }
    set timeReference(value) {
        this._timeReference = value;
        this._parentRenderer.redraw();
    }
    get zeroTime() { return this._zeroTime; }
    set zeroTime(value) { this._zeroTime = value; }
    get fullSize() { return this._fullSize; }
    set fullSize(value) { this._fullSize = value; }
    bestFormat(dataTimedelta, viewportTimedelta) {
        return TimeConverter.BestTimeformat(dataTimedelta, viewportTimedelta, this._timeReference);
    }
    get overflowHandling() { return this._overflowHandling; }
    set overflowHandling(value) { this._overflowHandling = value; }
}
XAxis.FORMATAUTO = 0;
(function (XAxis) {
    // export enum VrtPosition {TOP ="Top", BOTTOM = 'Bottom' }
    class VrtPositionEnumItem extends YDataRendering.YEnumItem {
        constructor(value, humanreadable, container) {
            super(value, humanreadable, VrtPosition);
        }
    }
    XAxis.VrtPositionEnumItem = VrtPositionEnumItem;
    class VrtPosition extends YDataRendering.YEnum {
    }
    VrtPosition.TOP = new VrtPositionEnumItem("TOP", "Top");
    VrtPosition.BOTTOM = new VrtPositionEnumItem("BOTTOM", "Bottom");
    XAxis.VrtPosition = VrtPosition;
    class OverflowHandlingEnumItem extends YDataRendering.YEnumItem {
        constructor(value, humanreadable, container) {
            super(value, humanreadable, OverflowHandling);
        }
    }
    XAxis.OverflowHandlingEnumItem = OverflowHandlingEnumItem;
    class OverflowHandling extends YDataRendering.YEnum {
    }
    OverflowHandling.DONOTHING = new OverflowHandlingEnumItem("DONOTHING", "Do nothing");
    OverflowHandling.SCROLL = new OverflowHandlingEnumItem("SCROLL", "Scroll contents");
    OverflowHandling.CONTRACT = new OverflowHandlingEnumItem("CONTRACT", "Squeeze contents");
    XAxis.OverflowHandling = OverflowHandling;
})(XAxis || (XAxis = {}));
export class DataPanel extends YDataRendering.GenericPanel {
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
    get horizontalPosition() { return this._horizontalPosition; }
    set horizontalPosition(value) {
        this._horizontalPosition = value;
        if (this._enabled)
            this._parentRenderer.redraw();
    }
    get verticalPosition() { return this._verticalPosition; }
    set verticalPosition(value) {
        this._verticalPosition = value;
        if (this._enabled)
            this._parentRenderer.redraw();
    }
    get AbsoluteXposition() { return this._AbsoluteXposition; }
    set AbsoluteXposition(value) {
        this._AbsoluteXposition = value;
        if (this._enabled)
            this._parentRenderer.redraw();
    }
    get AbsoluteYposition() { return this._AbsoluteYposition; }
    set AbsoluteYposition(value) {
        this._AbsoluteYposition = value;
        if (this._enabled)
            this._parentRenderer.redraw();
    }
    get yScaleIndex() { return this._YScaleIndex; }
    set yScaleIndex(value) {
        this._YScaleIndex = value;
        if (this._enabled)
            this._parentRenderer.redraw();
    }
}
(function (DataPanel) {
    class HorizontalAlignEnumItem extends YDataRendering.YEnumItem {
        constructor(value, humanreadable, container) {
            super(value, humanreadable, HorizontalAlign);
        }
    }
    DataPanel.HorizontalAlignEnumItem = HorizontalAlignEnumItem;
    class HorizontalAlign extends YDataRendering.YEnum {
    }
    HorizontalAlign.LEFTOF = new HorizontalAlignEnumItem("LEFTOF", "Left");
    HorizontalAlign.CENTERED = new HorizontalAlignEnumItem("CENTERED", "Center");
    HorizontalAlign.RIGHTOF = new HorizontalAlignEnumItem("RIGHTOF", "Right");
    DataPanel.HorizontalAlign = HorizontalAlign;
    class VerticalAlignEnumItem extends YDataRendering.YEnumItem {
        constructor(value, humanreadable, container) {
            super(value, humanreadable, VerticalAlign);
        }
    }
    DataPanel.VerticalAlignEnumItem = VerticalAlignEnumItem;
    // export  enum VerticalAlign  {ABOVE="Top",CENTERED="Center", BELOW="Bottom"}
    class VerticalAlign extends YDataRendering.YEnum {
    }
    VerticalAlign.ABOVE = new VerticalAlignEnumItem("ABOVE", "Top");
    VerticalAlign.CENTERED = new VerticalAlignEnumItem("CENTERED", "Center");
    VerticalAlign.BELOW = new VerticalAlignEnumItem("BELOW", "Bottom");
    DataPanel.VerticalAlign = VerticalAlign;
    class HorizontalPositionEnumItem extends YDataRendering.YEnumItem {
        constructor(value, humanreadable, container) {
            super(value, humanreadable, HorizontalPosition);
        }
    }
    DataPanel.HorizontalPositionEnumItem = HorizontalPositionEnumItem;
    class HorizontalPosition extends YDataRendering.YEnum {
    }
    HorizontalPosition.LEFTBORDER = new HorizontalPositionEnumItem("LEFTBORDER", "Left border");
    HorizontalPosition.ABSOLUTEX = new HorizontalPositionEnumItem("ABSOLUTEX", "Absolute X position");
    HorizontalPosition.RIGHTBORDER = new HorizontalPositionEnumItem("RIGHTBORDER", "Right borde");
    DataPanel.HorizontalPosition = HorizontalPosition;
    class VerticalPositionEnumItem extends YDataRendering.YEnumItem {
        constructor(value, humanreadable, container) {
            super(value, humanreadable, VerticalPosition);
        }
    }
    DataPanel.VerticalPositionEnumItem = VerticalPositionEnumItem;
    class VerticalPosition extends YDataRendering.YEnum {
    }
    VerticalPosition.TOPBORDER = new VerticalPositionEnumItem("TOPBORDER", "Top border");
    VerticalPosition.ABSOLUTEY = new VerticalPositionEnumItem("ABSOLUTEY", "Absolute Y position");
    VerticalPosition.BOTTOMBORDER = new VerticalPositionEnumItem("BOTTOMBORDER", "Bottom border");
    DataPanel.VerticalPosition = VerticalPosition;
})(DataPanel || (DataPanel = {}));
class YCursor {
    constructor(pngImageData) { }
    get handle() { return "crosshair"; }
}
class YTimeSpan {
    constructor(value) {
        this._value = 0;
        this._value = value;
    }
    toString(format) {
        let res = "";
        let v = Math.abs(this._value / 1000);
        let dec = Math.floor(v);
        let frac = Math.round(1000 * (v - Math.floor(v)));
        if (format & YDate.ms1) {
            let ms = "00" + frac.toString();
            res = "." + ms.substring(ms.length - 3).substring(0, 1);
        }
        else if (format & YDate.ms01) {
            let ms = "00" + frac.toString();
            res = "." + ms.substring(ms.length - 3).substring(0, 2);
        }
        else if (format & YDate.ms001) {
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
}
YTimeSpan.TicksPerSecond = 1000;
export class YGraph extends YDataRendering.YDataRenderer {
    get legendPanel() { return this._legendPanel; }
    get dataTracker() { return this._dataTracker; }
    get borderColor() { return this._borderColor; }
    set borderColor(value) {
        this._borderColor = value;
        this._borderPen = null;
        this.redraw();
    }
    get borderThickness() { return this._borderThickness; }
    set borderThickness(value) {
        if (value < 0)
            throw new RangeError("thickness must be a positive value");
        this._borderThickness = value;
        this._borderPen = null;
        this.redraw();
    }
    static get verticalDragZoomEnabled() { return YGraph._defaultVerticalDragZoomEnabled; }
    static set verticalDragZoomEnabled(value) { YGraph._defaultVerticalDragZoomEnabled = value; }
    static createCaptureCursor() {
        if (YGraph.captureCursor != null)
            return;
        // mouse cursor graphics stored  in a base64 encoded PNG
        // this is just a way to keep the source code monolithic
        // no separate ressources file
        let base64png = "iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAALHRFWHRDcmVhdGlvbi"
            + "BUaW1lAFRodSAyMCBBdWcgMjAyMCAxMjoxNTo1MCArMDEwMP38NhoAAAAHdElNRQfk"
            + "CBQOJAvCrm0ZAAAACXBIWXMAAFxGAABcRgEUlENBAAAABGdBTUEAALGPC / xhBQAA"
            + "AmVJREFUeNrtVrFuFDEQHd9eBImAIBFoAgVC0NJQUFDwL / QgRXzAfUz + Iy0pQw"
            + "sIJAhCQMQBUS5c2DXv7T5fzN5qs / Fxdw0jPY3ttT3jt54ZmyXIYDDoQXnodWBV /"
            + " SRJXZhJbwCXov65pZ + 4zklfBsZRf2EMxOuTjc / igIu0s0UygAvnonWZ0NP4fB"
            + "2QkQz6yHvP / i76V4E1jZ / bic4LIuMnND7ZwDl + u4 / me + AnkKPvu + 7r"
            + "FMNZBzZ64eRTm5w6sQ8cAcUZexVytOCpOnv7j + QdDD + CHgKjMg80nWpeQrYgd4"
            + "A3wHjWPJAqN4BVoLcsB1ZMd25ZDkzkvwNLd6AMQ4XGIuXElKz6SAo3rYpLhsZKyyJm"
            + "wu2WTLiF5g / g2NozIY1 / BkacRwaYkZgUPlr7L2EdeAhjLxpqwTOr0vAHOZG37F"
            + "PIOO3mfXXG1qEWAGvM + TC6Rydk / KmMv7bmWlD / v95qtaCThGpo1TPsFvp7wB"
            + "O0v4nBqWoYvR0yOeLFThHmdH4TcgGQy8i + hkn5V / WbSjGr7e9oD96372LJB1o7"
            + "izbPtYHpPw7V / 8u4yvzFkvPTO3MXuMbx8JRPij8svgAcAw / EwCe0f8XGxZYFB6"
            + "JQZzl + rHWj1Gf5WZLVTj5py5HbVoXjeF4OuMhYnQHKulW / x6U64CPtbfpVxQu7"
            + "CX0PeicMov3cKup5EZmw / KwMFNb8pMtl5G3MhIyHkOX3PPUSMmXzOX7Fqsw35Gu5"
            + "NidEwXWr / jnnD + XUFzLARJRaDXnCQ53o0BpSLzcXzQfAK + Cl9EEwXrKTyr1O"
            + "WGa3sFnLvPDsn6Tg8P0PrBcSMR2NtfsAAAAASUVORK5CYII =";
        try {
            YGraph.captureCursor = new YCursor(atob(base64png));
        }
        catch (Exception) {
            console.log("Cannot create custom cursor");
        }
    }
    get dataPanels() { return this._dataPanels; }
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
        this._borderColor = YDataRendering.YColor.LightGray;
        this._borderThickness = 1.0;
        this._touchStartfct = null;
        this._touchMovefct = null;
        this._touchEndfct = null;
        this._mouseDownfct = null;
        this._mouseMovefct = null;
        this._mouseWheelfct = null;
        this._mouseKeyDownfct = null;
        this.mainViewPort = new YDataRendering.ViewPortSettings();
        this._timeRange = null;
        this._bgBrush = null;
        this._bgColor1 = YDataRendering.YColor.FromArgb(255, 200, 200, 200);
        this._bgColor2 = YDataRendering.YColor.FromArgb(255, 255, 255, 255);
        this._touchStartPinchDistance = -1;
        this._touchStartPinchCenter = new YDataRendering.Point(0, 0);
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
        this._touchStartfct = (e) => { this.TouchStart(this.UIContainer, e); };
        this._touchMovefct = (e) => { this.TouchMove(this.UIContainer, e); };
        this._touchEndfct = (e) => { this.TouchEnd(this.UIContainer, e); };
        this._mouseDownfct = (e) => { this.MouseDown(this.UIContainer, e); };
        this._mouseMovefct = (e) => { this.MouseMove(this.UIContainer, e); };
        this._mouseWheelfct = (e) => { this.mouseWheelEvent(this.UIContainer, e); };
        this._mouseKeyDownfct = (e) => { this.KeyDown(this.UIContainer, e); };
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
        Object.entries(this).forEach((pair) => { Reflect.set(this, pair[0], null); }); // sets all internal variables to NULL
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
                    if (max > this._xAxis.min + ((this._xAxis.max - this._xAxis.min) * 0.85) && (max <= this._xAxis.max)) {
                        this.DisableRedraw();
                        this._xAxis.set_minMax(this._xAxis.min + ofset, this._xAxis.max + ofset);
                        this.AllowRedraw();
                    }
                    break;
                case XAxis.OverflowHandling.CONTRACT:
                    if (max > this._xAxis.min + ((this._xAxis.max - this._xAxis.min) * 0.95) && (max <= this._xAxis.max)) {
                        this.DisableRedraw();
                        this._xAxis.max += ofset;
                        this.AllowRedraw();
                    }
                    break;
            }
        }
    }
    get bgColor1() { return this._bgColor1; }
    set bgColor1(value) {
        this._bgColor1 = value;
        this._bgBrush = null;
        this.redraw();
    }
    get bgColor2() { return this._bgColor2; }
    set bgColor2(value) {
        this._bgColor2 = value;
        this._bgBrush = null;
        this.redraw();
    }
    get xAxis() { return this._xAxis; }
    get navigator() { return this._navigator; }
    get yAxes() { return this._yAxes; }
    get series() { return this._series; }
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
        }
        else if (e.touches.length == 2) {
            e.preventDefault();
            this.HandleEndOfMouseCapture();
            this._touchStartPinchDistance = Math.sqrt(Math.pow(e.touches[1].pageX - e.touches[0].pageX, 2) + Math.pow(e.touches[1].pageY - e.touches[0].pageY, 2));
            this._touchStartPinchCenter = new YDataRendering.Point((e.touches[1].pageX + e.touches[0].pageX) >> 2, (e.touches[1].pageY + e.touches[0].pageY) >> 2);
            this._touchStartPinchZoom = this.mainViewPort.zoomx;
            this._touchStartPinchIRLx = this.mainViewPort.IRLx;
            this._touchStartPinchRange = this._xAxis.max - this._xAxis.min;
        }
    }
    MouseDown(sender, e) {
        if ((e.buttons == 2) && (this.markerCapture != null)) {
            this.markerCapture = null;
            if (this._markerCaptureStoppedCallback != null)
                this._markerCaptureStoppedCallback(null);
        }
        if (e.buttons != 1)
            return;
        this.HandleMouseDown(sender, e.pageX, e.pageY);
    }
    HandleMouseDown(sender, pageX, pageY) {
        let p = this.Scr2ElmMatrix.multiplyByV(YDataRendering.Vector3.FromXYCoord(pageX, pageY)).toPoint();
        let eX = p.X;
        let eY = p.Y;
        if ((eX >= this.mainViewPort.Lmargin)
            && (eX <= this.mainViewPort.Width - this.mainViewPort.Rmargin)
            && (eY >= this.mainViewPort.Tmargin)
            && (eY <= this.mainViewPort.Height - this.mainViewPort.Bmargin)) {
            if (this.markerCapture != null) {
                let p2 = YGraph.ViewPortPointToIRL(this.mainViewPort, new YDataRendering.Point(eX, eY));
                this.markerCapture.setCapturedPosition(p2.x, this.xAxis);
                if (this._markerCaptureStoppedCallback != null)
                    this._markerCaptureStoppedCallback(this.markerCapture);
                this.markerCapture = null;
                return;
            }
            let p = YGraph.ViewPortPointToIRL(this.mainViewPort, new YDataRendering.Point(eX, eY));
            this.mainViewPort.OriginalXAxisMin = this.xAxis.min;
            this.mainViewPort.OriginalXAxisMax = this.xAxis.max;
            this.mainViewPort.OriginalIRLx = this.mainViewPort.IRLx;
            this.mainViewPort.OriginalLmargin = this.mainViewPort.Lmargin;
            this.mainViewPort.OriginalZoomx = this.mainViewPort.zoomx;
            this.mainViewPort.CaptureStartY = eY;
            this.mainViewPort.IRLCaptureStartX = p.x;
            this.mainViewPort.Capture = true;
        }
        else if ((eX >= this._navigator.viewport.Lmargin)
            && (eX <= this._navigator.viewport.Width - this._navigator.viewport.Rmargin)
            && (eY >= this._navigator.viewport.Lmargin)
            && (eY <= this._navigator.viewport.Height - this._navigator.viewport.Bmargin)) {
            let p = YGraph.ViewPortPointToIRL(this._navigator.viewport, new YDataRendering.Point(eX, eY));
            let p2 = YGraph.ViewPortPointToIRL(this.mainViewPort, new YDataRendering.Point(this.mainViewPort.Lmargin, 0));
            let p3 = YGraph.ViewPortPointToIRL(this.mainViewPort, new YDataRendering.Point(this.mainViewPort.Width - this.mainViewPort.Rmargin, 0));
            if ((p.x >= p2.x) && (p.x <= p3.x)) {
                this._navigator.startCapture(p, this._xAxis.min, this._xAxis.max);
                //  log("monitor start monitor capture  at " + _navigator.viewport.IRLCaptureStartX.ToString());
            }
            else {
                this.DisableRedraw();
                let min = p.x - (p3.x - p2.x) / 2;
                let max = min + (p3.x - p2.x);
                this._xAxis.set_minMax(min, max);
                this.AllowRedraw();
                //  log("Jump to " + mainViewPort.IRLx.ToString());
                this.Draw(0);
            }
        }
    }
    TouchMove(sender, e) {
        if (e.touches.length == 1) {
            e.preventDefault();
            this.HandleMouseMove(sender, e.touches[0].pageX, e.touches[0].pageY);
        }
        else if (e.touches.length == 2) {
            e.preventDefault();
            let newdistance = Math.sqrt(Math.pow(e.touches[1].pageX - e.touches[0].pageX, 2) + Math.pow(e.touches[1].pageY - e.touches[0].pageY, 2));
            let ZoomFactor = newdistance / this._touchStartPinchDistance;
            let NextZoomX = this._touchStartPinchZoom * ZoomFactor;
            if ((NextZoomX > this.mainViewPort.zoomx) && (NextZoomX > 1000))
                return;
            let currentRange = this._xAxis.max - this._xAxis.min;
            this.mainViewPort.IRLx = this._touchStartPinchIRLx + ((this._touchStartPinchCenter.X - this.mainViewPort.Lmargin) / this._touchStartPinchZoom) - ((this._touchStartPinchCenter.X - this.mainViewPort.Lmargin) / NextZoomX);
            this._xAxis.set_minMax(this.mainViewPort.IRLx, this.mainViewPort.IRLx + this._touchStartPinchRange / ZoomFactor);
            this.mainViewPort.zoomx = NextZoomX;
            this.redraw();
        }
    }
    TouchEnd(sender, e) {
        this.HandleEndOfMouseCapture();
    }
    MouseMove(sender, e) {
        if ((e.buttons != 1) && (this.mainViewPort.Capture || this._navigator.Capture))
            this.HandleEndOfMouseCapture();
        this.HandleMouseMove(sender, e.pageX, e.pageY);
        if (this.dataTracker.enabled) {
            if (this.dataTrackerRefreshtimeout != null)
                clearTimeout(this.dataTrackerRefreshtimeout);
            this.dataTrackerRefreshtimeout = setTimeout(() => { this.redraw(); }, 100);
        }
    }
    HandleEndOfMouseCapture() {
        this.mainViewPort.Capture = false;
        this._navigator.stopCapture();
        if (this._dataTracker.enabled)
            this.redraw();
    }
    HandleMouseMove(sender, pageX, pageY) {
        let p = this.Scr2ElmMatrix.multiplyByV(YDataRendering.Vector3.FromXYCoord(pageX, pageY)).toPoint();
        let eX = p.X;
        let eY = p.Y;
        if (this.markerCapture != null) {
            if ((eX > this.mainViewPort.Lmargin) && (eX < this.mainViewPort.Width - this.mainViewPort.Rmargin)
                && (eY > this.mainViewPort.Tmargin) && (eY < this.mainViewPort.Height - this.mainViewPort.Bmargin)) {
                if ((this.UIContainer.style.cursor != YGraph.captureCursor.handle) && (this.UIContainer.style.cursor != "crosshair")) {
                    this.UIContainer.style.cursor = YGraph.captureCursor != null ? YGraph.captureCursor.handle : "crosshair";
                }
            }
            else if (this.UIContainer.style.cursor != "default")
                this.UIContainer.style.cursor = "default";
        }
        else if (this.UIContainer.style.cursor != "default")
            this.UIContainer.style.cursor = "default";
        if (this.mainViewPort.Capture) {
            let x1 = this.mainViewPort.OriginalIRLx + (eX - this.mainViewPort.OriginalLmargin) / this.mainViewPort.OriginalZoomx;
            let deltaX = (x1 - this.mainViewPort.IRLCaptureStartX);
            let deltaY = (eY - this.mainViewPort.CaptureStartY);
            this.DisableRedraw();
            let halfAxisDelta = (this.mainViewPort.OriginalXAxisMax - this.mainViewPort.OriginalXAxisMin) / 2;
            let Axismiddle = (this.mainViewPort.OriginalXAxisMax + this.mainViewPort.OriginalXAxisMin) / 2;
            let deltaCoef = (YGraph._defaultVerticalDragZoomEnabled && (Math.abs(deltaY) > 10)) ? Math.pow(1.01, deltaY) : 1;
            this._xAxis.set_minMax(Axismiddle - halfAxisDelta * deltaCoef - deltaX, Axismiddle + halfAxisDelta * deltaCoef - deltaX);
            this.AllowRedraw();
            this.redraw();
            return;
        }
        if (this._navigator.viewport.Capture) {
            let x1 = this._navigator.viewport.OriginalIRLx + (eX - this._navigator.viewport.OriginalLmargin) / this._navigator.viewport.OriginalZoomx;
            let delta = (x1 - this._navigator.viewport.IRLCaptureStartX);
            this.DisableRedraw();
            this._xAxis.set_minMax(this._navigator.viewport.OriginalXAxisMin + delta, this._navigator.viewport.OriginalXAxisMax + delta);
            this.AllowRedraw();
            this.redraw();
            return;
        }
    }
    cross(p) { }
    static IRLPointToViewPort(viewport, p, IRLy, zoomy) {
        if (IRLy === undefined) {
            let xx = viewport.Lmargin + Math.round((p.x - viewport.IRLx) * viewport.zoomx);
            let yy = viewport.Height - viewport.Bmargin - Math.round((p.y - viewport.IRLy) * viewport.zoomy);
            return new YDataRendering.Point(xx >> 0, yy >> 0);
        }
        let xx = viewport.Lmargin + Math.round((p.x - viewport.IRLx) * viewport.zoomx);
        let yy = viewport.Height - viewport.Bmargin - Math.round((p.y - IRLy) * zoomy);
        return new YDataRendering.Point(xx >> 0, yy >> 0);
    }
    static ViewPortPointToIRL(viewport, p, IRLy, zoomy) {
        if (IRLy === undefined) {
            return new pointXY(viewport.IRLx + (p.X - viewport.Lmargin) / viewport.zoomx, viewport.IRLy + (+viewport.Height - p.Y - viewport.Bmargin) / viewport.zoomy);
        }
        return new pointXY(viewport.IRLx + (p.X - viewport.Lmargin) / viewport.zoomx, IRLy + (+viewport.Height - p.Y - viewport.Bmargin) / zoomy);
    }
    static FindMinMax(start, end, data, count) {
        let res = MinMaxHandler.DefaultValue();
        // Do we need to consider that segment?
        if (!(data[0].x < end) && (data[count - 1].x > start))
            return res; // completely out of view port full zone, abort.
        let N1 = 0;
        let N2 = 0;
        // find out the first visible point ;
        let First = 0;
        if (data[0].x < start) {
            N1 = 0;
            N2 = count - 1;
            while (N2 - N1 > 1) {
                let N = (N1 + N2) >> 1;
                if (data[N].x > start)
                    N2 = N;
                else
                    N1 = N;
            }
            First = N1 - 1;
            if (First < 0)
                First = 0;
        }
        // data clipping: find out the last visible point;
        let Last = count - 1;
        if (data[Last] === undefined) {
            debugger;
        }
        if (data[Last].x > end) {
            N1 = 0;
            N2 = count - 1;
            while (N2 - N1 > 1) {
                let N = (N1 + N2) >> 1;
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
        g.TextRenderingHint = YDataRendering.YTextRenderingHint.SingleBitPerPixelGridFit;
        g.SetClip(new YDataRendering.YRectangle(0, 0, viewPortWidth, viewPortHeight));
        for (let i = 0; i < this._series.length; i++) {
            if (this._series[i].legend != "")
                legends[i] = this._series[i].legend;
            else
                legends[i] = "Series " + (i + 1).toString();
        }
        if ((this._legendPanel.position == LegendPanel.Position.TOP) || (this._legendPanel.position == LegendPanel.Position.BOTTOM)) {
            let availableWidth = viewPortWidth - 2 * this._legendPanel.padding + this._legendPanel.borderthickness;
            if (this._legendPanel.overlap)
                availableWidth = availableWidth - mainViewPort.Lmargin - mainViewPort.Rmargin;
            totalHeight = 0; // 2 * _legendPanel.padding + legendPanel.borderthickness;
            let xx = 0;
            let yy = 0;
            for (let i = 0; i < this._series.length; i++) {
                if ((this._series[i].segments.length > 0) && (this._series[i].visible) && (!this._series[i].disabled)) {
                    let ssize = g.MeasureString(legends[i], this._legendPanel.font, 100000);
                    legendHeight[i] = (ssize.height) + 1;
                    let ww = (ssize.width + 20);
                    if (xx == 0)
                        totalHeight += ssize.height;
                    if (availableWidth - xx < ww) {
                        if (xx == 0) {
                            ofsetx[i] = xx;
                            ofsety[i] = yy;
                            yy += ssize.height;
                            if (maxWidth < ww)
                                maxWidth = ww;
                        }
                        else {
                            yy += ssize.height;
                            ofsetx[i] = 0.0;
                            ofsety[i] = yy;
                            xx = ww;
                            totalHeight += ssize.height;
                            if (maxWidth < xx)
                                maxWidth = xx;
                        }
                    }
                    else {
                        ofsetx[i] = xx;
                        ofsety[i] = yy;
                        xx += ww;
                        if (maxWidth < xx)
                            maxWidth = xx;
                    }
                }
            }
            if (totalWidth > availableWidth) { // noinspection JSUnusedAssignment
                totalWidth = availableWidth;
            }
        }
        else {
            let ty = 0;
            for (let i = 0; i < this._series.length; i++) {
                if ((this._series[i].segments.length > 0) && (this._series[i].visible) && (!this._series[i].disabled)) {
                    let ssize = g.MeasureString(legends[i], this._legendPanel.font, 100000);
                    legendWidths[i] = (ssize.width) + 1;
                    if (maxWidth < legendWidths[i] + 20)
                        maxWidth = legendWidths[i] + 20;
                    legendHeight[i] = (ssize.height) + 1;
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
                    mainViewPort.Lmargin += (w + 2 * this.legendPanel.horizontalMargin + this.legendPanel.borderthickness) >> 0;
                    y = (viewPortHeight - h) / 2;
                }
                else {
                    x += mainViewPort.Lmargin;
                    y = mainViewPort.Tmargin + (viewPortHeight - mainViewPort.Tmargin - mainViewPort.Bmargin - h) / 2;
                }
                break;
            case LegendPanel.Position.TOPLEFT:
                x = this._legendPanel.horizontalMargin;
                y = this._legendPanel.verticalMargin;
                if (!this._legendPanel.overlap) {
                    mainViewPort.Lmargin += (w + 2 * this.legendPanel.horizontalMargin + this.legendPanel.borderthickness) >> 0;
                }
                else {
                    x += mainViewPort.Lmargin;
                    y += mainViewPort.Tmargin;
                }
                break;
            case LegendPanel.Position.TOP:
                if (!this._legendPanel.overlap) {
                    x = (viewPortWidth - w) / 2 - this._legendPanel.horizontalMargin - this._legendPanel.borderthickness;
                    y = this._legendPanel.verticalMargin + this._legendPanel.borderthickness;
                    mainViewPort.Tmargin += (totalHeight + this._legendPanel.verticalMargin + 2 * this._legendPanel.verticalMargin + this._legendPanel.borderthickness) >> 0;
                }
                else {
                    x = mainViewPort.Lmargin + (viewPortWidth - mainViewPort.Lmargin - mainViewPort.Rmargin - w) / 2 - this._legendPanel.horizontalMargin - this._legendPanel.borderthickness;
                    y = mainViewPort.Tmargin + this._legendPanel.verticalMargin - this._legendPanel.borderthickness;
                }
                break;
            case LegendPanel.Position.TOPRIGHT:
                x = viewPortWidth - this._legendPanel.horizontalMargin - w;
                y = this._legendPanel.verticalMargin;
                if (!this._legendPanel.overlap) {
                    mainViewPort.Rmargin += (w + 2 * this._legendPanel.horizontalMargin + this._legendPanel.borderthickness) >> 0;
                }
                else {
                    x -= mainViewPort.Rmargin;
                    y += mainViewPort.Tmargin;
                }
                break;
            case LegendPanel.Position.RIGHT:
                x = viewPortWidth - this._legendPanel.horizontalMargin - w;
                if (!this._legendPanel.overlap) {
                    mainViewPort.Rmargin += (w + 2 * this._legendPanel.horizontalMargin + this._legendPanel.borderthickness) >> 0;
                    y = (viewPortHeight - h) / 2;
                }
                else {
                    x -= mainViewPort.Rmargin;
                    y = mainViewPort.Tmargin + (viewPortHeight - mainViewPort.Tmargin - mainViewPort.Bmargin - h) / 2;
                }
                break;
            case LegendPanel.Position.BOTTOMRIGHT:
                x = viewPortWidth - this._legendPanel.horizontalMargin - w;
                if (!this._legendPanel.overlap) {
                    mainViewPort.Rmargin += (w + 2 * this._legendPanel.horizontalMargin + this._legendPanel.borderthickness) >> 0;
                    y = viewPortHeight - this._legendPanel.verticalMargin - h;
                }
                else {
                    x -= mainViewPort.Rmargin;
                    y = viewPortHeight - mainViewPort.Bmargin - h - this._legendPanel.verticalMargin;
                }
                break;
            case LegendPanel.Position.BOTTOM:
                if (!this._legendPanel.overlap) {
                    x = (viewPortWidth - w) / 2 - this._legendPanel.horizontalMargin - this._legendPanel.borderthickness;
                    y = viewPortHeight - this._legendPanel.verticalMargin - 2 * this._legendPanel.padding - this._legendPanel.borderthickness - totalHeight;
                    mainViewPort.Bmargin += (totalHeight + 2 * this._legendPanel.padding + 2 * this._legendPanel.verticalMargin + this._legendPanel.borderthickness);
                }
                else {
                    x = mainViewPort.Lmargin + (viewPortWidth - mainViewPort.Lmargin - mainViewPort.Rmargin - w) / 2 - this._legendPanel.horizontalMargin - this._legendPanel.borderthickness;
                    y = viewPortHeight - mainViewPort.Bmargin - totalHeight - 2 * this._legendPanel.padding - 2 * this._legendPanel.verticalMargin - this._legendPanel.borderthickness;
                }
                break;
            case LegendPanel.Position.BOTTOMLEFT:
                x = this._legendPanel.horizontalMargin;
                y = this._legendPanel.verticalMargin;
                if (!this._legendPanel.overlap) {
                    mainViewPort.Lmargin += (w + 2 * this._legendPanel.horizontalMargin + this._legendPanel.borderthickness);
                    y = viewPortHeight - this._legendPanel.verticalMargin - h;
                }
                else {
                    x += mainViewPort.Lmargin;
                    y = viewPortHeight - mainViewPort.Bmargin - h - this._legendPanel.verticalMargin;
                }
                break;
        }
        let rect = new YDataRendering.YRectangle(x >> 0, y >> 0, w >> 0, h >> 0);
        g.FillRectangle(this._legendPanel.bgBrush, rect);
        g.DrawRectangle(this._legendPanel.pen, rect);
        g.TextRenderingHint = YDataRendering.YTextRenderingHint.AntiAlias;
        for (let i = 0; i < this._series.length; i++) {
            if ((this._series[i].segments.length > 0) && (this._series[i].visible) && (!this._series[i].disabled)) {
                g.DrawStringXY(legends[i], this._legendPanel.font, this._legendPanel.font.brush, (x + ofsetx[i] + 20 + this._legendPanel.padding) >> 0, (y + ofsety[i] + this._legendPanel.padding) >> 0);
                let px = (x + ofsetx[i] + this._legendPanel.borderthickness / 2 + this._legendPanel.padding + 6) >> 0;
                let py = (y + ofsety[i] + this._legendPanel.padding + legendHeight[i] / 2) >> 0;
                g.DrawLine(this._series[i].legendPen, new YDataRendering.PointF(px, py), new YDataRendering.PointF(px + 12, py));
            }
        }
    }
    static DoSegmentRendering(w, g, p, data, count, xTimeStart, xTimeEnd) {
        if ((data[0].x > xTimeEnd) || (data[count - 1].x < xTimeStart))
            return 0;
        // let Bottomleft: pointXY = YGraph.ViewPortPointToIRL(w, new YDataRendering.Point(w.Lmargin, w.Height - w.Bmargin));
        // let TopRight: pointXY = YGraph.ViewPortPointToIRL(w, new YDataRendering.Point(w.Width - w.Rmargin, w.Tmargin));
        // Do we need to draw that segment?
        // if ((data[0].x > TopRight.x) || (data[count - 1].x < Bottomleft.x)) return 0; // completely out of view port display zone, abort.
        let isSVG = g instanceof YDataRendering.YGraphicsSVG;
        let N1 = 0;
        let N2 = 0;
        // data clipping: find out the first point to draw;
        let First = 0;
        if (data[0].x < xTimeStart) {
            N1 = 0;
            N2 = count - 1;
            while (N2 - N1 > 1) {
                let N = (N1 + N2) >> 1;
                if (data[N].x > xTimeStart)
                    N2 = N;
                else
                    N1 = N;
            }
            First = N1 - 1;
            if (First < 0)
                First = 0;
        }
        // data clipping: find out the last point to draw;
        let Last = count - 1;
        if (data[Last].x > xTimeEnd) {
            N1 = 0;
            N2 = count - 1;
            while (N2 - N1 > 1) {
                let N = (N1 + N2) >> 1;
                if (data[N].x < xTimeEnd)
                    N1 = N;
                else
                    N2 = N;
            }
            Last = N2 + 1;
            if (Last > count - 1)
                Last = count - 1;
        }
        if (Last - First > 2 * w.Width - w.Lmargin - w.Rmargin) // to many points to Draw, lets do some clean up
         {
            let ToDraw = new Array(3 * (Last - First + 1));
            let Current = YGraph.IRLPointToViewPort(w, data[First]);
            let New;
            let i = First + 1;
            let n = 0;
            let max;
            let min;
            let limit;
            while (i < Last) {
                ToDraw[n++] = new YDataRendering.PointF(Current.X, Current.Y);
                min = data[i].y;
                max = min;
                limit = YGraph.ViewPortPointToIRL(w, new YDataRendering.Point(Current.X + 1, Current.Y + 1)).x;
                do {
                    if (data[i].y > max)
                        max = data[i].y;
                    if (data[i].y < min)
                        min = data[i].y;
                    i++;
                } while ((i < Last) && (data[i].x < limit));
                let p1 = YGraph.IRLPointToViewPort(w, new pointXY(data[i].x, min));
                let p2 = YGraph.IRLPointToViewPort(w, new pointXY(data[i].x, max));
                if (Math.abs(p1.Y - p2.Y) > 2) {
                    ToDraw[n++] = new YDataRendering.PointF(p1.X, p1.Y);
                    ToDraw[n++] = new YDataRendering.PointF(p2.X, p2.Y);
                }
                /*
                let min: number = Current.Y;
                let max: number = Current.Y;
                ToDraw[n++] = new YDataRendering.PointF(Current.X, Current.Y);
                do
                {
                    New = YGraph.IRLPointToViewPort(w, data[i]);
                    if (New.Y > max) max = New.Y;
                    if (New.Y < min) min = New.Y;
                    i++;
                } while ((i < Last) && (Current.X == New.X));

                ToDraw[n++] = new YDataRendering.PointF(Current.X, min);
                ToDraw[n++] = new YDataRendering.PointF(Current.X, max);
                */
                Current = YGraph.IRLPointToViewPort(w, data[i]);
            }
            ToDraw[n++] = Current; //YGraph.IRLPointToViewPort(w, data[Last]);
            ToDraw = ToDraw.slice(0, n);
            if (n > 1)
                g.DrawLines(p, ToDraw);
            return n;
        }
        else { // in SVG mode, DrawLines linejoins are rendered correctly,
            // in bitmap mode they aren't
            if (isSVG) {
                let ToDraw = new Array(Last - First + 1);
                for (let i = First; i <= Last; i++) {
                    ToDraw[i - First] = YGraph.IRLPointToViewPort(w, data[i]);
                }
                g.DrawLines(p, ToDraw);
            }
            else {
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
        let YZoom = (Delta) / (w.Height - w.Bmargin - w.Tmargin);
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
        let XZoom = (delta) / (w.Width - w.Lmargin - w.Rmargin);
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
                g.FillRectangleXYHW(scale.zones[i].zoneBrush, x0, this.mainViewPort.Tmargin, ((max - min) / XZoom) >> 0, this.mainViewPort.Height - this.mainViewPort.Tmargin - this.mainViewPort.Bmargin);
            }
        }
    }
    // noinspection JSSuspiciousNameCombination
    static DrawYAxis(w, g, axis, ofset, simulation) {
        if (!axis.visible) {
            axis.innerWidth = 0;
            // noinspection JSSuspiciousNameCombination
            return axis.innerWidth;
        }
        let Delta = axis.startStopStep.dataMax - axis.startStopStep.dataMin;
        let YZoom = (Delta) / (w.Height - w.Bmargin - w.Tmargin);
        let leftSide = axis.position == YAxis.HrzPosition.LEFT;
        let x = leftSide ? w.Lmargin - ofset : (w.Width - w.Rmargin + ofset);
        if (!simulation)
            g.DrawLineXY(axis.pen, x, w.Tmargin, x, w.Height - w.Bmargin);
        let format = new YDataRendering.YStringFormat(16384 /* YDataRendering.YStringFormat.StringFormatFlags.NoClip */);
        format.LineAlignment = 1 /* YDataRendering.YStringFormat.StringAlignment.Center */;
        format.Alignment = leftSide ? 2 /* YDataRendering.YStringFormat.StringAlignment.Far */ : 0 /* YDataRendering.YStringFormat.StringAlignment.Near */;
        let FirstStep = axis.startStopStep.step * (Math.floor(axis.startStopStep.start / axis.startStopStep.step));
        if (FirstStep < 0) {
            FirstStep -= axis.startStopStep.step;
        }
        let stepCount = (((Delta - (FirstStep - axis.startStopStep.dataMin)) / axis.startStopStep.step) >> 0) + 1;
        if (!simulation)
            g.TextRenderingHint = YDataRendering.YTextRenderingHint.AntiAlias;
        let UnitWidth = 0;
        let labelPrecision = 0; // fix me
        if (axis.startStopStep.precision < 0)
            labelPrecision = (-axis.startStopStep.precision);
        if (stepCount < w.Height) // protection again infinity of graduation
         {
            for (let i = 0; i < stepCount; i++) {
                let y = Math.round((FirstStep + i * axis.startStopStep.step - axis.startStopStep.dataMin) / YZoom) >> 0;
                if (y >= 0) {
                    y = w.Height - w.Bmargin - y;
                    let v = FirstStep + i * axis.startStopStep.step;
                    if (!simulation) {
                        if ((axis.showGrid) && ((i > 0) || (axis.startStopStep.dataMin != 0)))
                            g.DrawLineXY(axis.gridPen, w.Lmargin, y, w.Width - w.Rmargin, y);
                        if ((Math.abs(v) < 1E-6) && axis.highlightZero) {
                            g.DrawLineXY(axis.pen, w.Lmargin, y, w.Width - w.Rmargin, y);
                        }
                        g.DrawLineXY(axis.pen, x + ((leftSide) ? -2 : 2), y, x + ((leftSide) ? 5 : -5), y);
                    }
                    let label = v.toFixed(labelPrecision);
                    let ssize = g.MeasureString(label, axis.font, 100000);
                    if (ssize.width > UnitWidth)
                        UnitWidth = ssize.width;
                    if (!simulation) {
                        let p = new YDataRendering.Point(x + (leftSide ? -3 : 3), y);
                        g.DrawStringPF(label, axis.font, axis.font.brush, p, format);
                    }
                }
            }
        }
        if (axis.legend.title != "") {
            let size = g.MeasureString(axis.legend.title, axis.legend.font, 100000);
            if (!simulation) {
                let format = new YDataRendering.YStringFormat(16384 /* YDataRendering.YStringFormat.StringFormatFlags.NoClip */);
                format.Alignment = 1 /* YDataRendering.YStringFormat.StringAlignment.Center */;
                format.LineAlignment = 1 /* YDataRendering.YStringFormat.StringAlignment.Center */;
                format.Trimming = 0 /* YDataRendering.YStringFormat.StringTrimming.None */;
                let legendX = x + ((leftSide) ? -UnitWidth - size.height : UnitWidth + size.height + 2) >> 0;
                let legendY = (w.Tmargin + (w.Height - w.Tmargin - w.Bmargin) / 2) >> 0;
                g.Transform(legendX, legendY, leftSide ? -Math.PI / 2 : Math.PI / 2);
                g.DrawStringPF(axis.legend.title, axis.legend.font, axis.legend.font.brush, new YDataRendering.Point(0, 0), format);
                g.ResetTransform();
            }
            // noinspection JSSuspiciousNameCombination
            UnitWidth += size.height;
        }
        axis.innerWidth = (UnitWidth >> 0) + 10;
        // noinspection JSSuspiciousNameCombination
        return axis.innerWidth;
    }
    DrawMonitorXAxis(w, g, xRange, format) {
        let delta = xRange.Max - xRange.Min;
        let scale = TimeConverter.BestTimeformat(delta, delta, this.xAxis.timeReference);
        let XZoom = (delta) / (w.Width - w.Lmargin - w.Rmargin);
        let stepCount = ((delta / scale.step) >> 0) + 2;
        let FirstStep = scale.step * (Math.floor(xRange.Min / scale.step));
        if (FirstStep < xRange.Min)
            FirstStep += scale.step;
        g.TextRenderingHint = YDataRendering.YTextRenderingHint.AntiAlias;
        let y = w.Height - w.Bmargin;
        g.DrawLineXY(this._navigator.pen, w.Lmargin, w.Height - w.Bmargin - 1, w.Width - w.Rmargin, w.Height - w.Bmargin - 1);
        let label;
        let t = FirstStep;
        do {
            let d = TimeConverter.FromUnixTime(t);
            if (scale.step > 30 * 86400) // resynchronize with the beginning of the month.
             {
                t = TimeConverter.ToUnixTime(new Date(d.getFullYear(), d.getMonth(), 1));
            }
            if (t >= xRange.Min) {
                let x = w.Lmargin + Math.round((t - xRange.Min) / XZoom);
                g.DrawLineXY(this._navigator.pen, x, y, x, y - 4);
                if (format == XAxis.FORMATAUTO) {
                    label = TimeConverter.FromUnixTime(t).ToString(scale.format);
                }
                else {
                    label = TimeConverter.FromUnixTime(t).ToString(format);
                }
                let ssize = g.MeasureString(label, this._navigator.font, 100000);
                g.DrawString(label, this._navigator.font, this._navigator.font.brush, new YDataRendering.Point((x - ssize.width / 2), (y - ssize.height - 1)));
            }
            t += scale.step;
        } while (t < xRange.Max);
    }
    static XLabel(t, scale, scaleFormat, timeRange) {
        let label;
        if (scale.timeReference == TimeConverter.TimeReference.ABSOLUTE) {
            if (scale.labelFormat == XAxis.FORMATAUTO) {
                label = TimeConverter.FromUnixTime(t).ToString(scaleFormat.format);
            }
            else {
                label = t.toString();
            } //(scale.labelFormat);
        }
        else {
            let ticks = YTimeSpan.TicksPerSecond * (Math.round(1000 * (t - scale.zeroTime)) / 1000);
            label = (ticks < 0) ? "-" + new YTimeSpan(-ticks).toString(scaleFormat.format) : new YTimeSpan(ticks).toString(scaleFormat.format);
        }
        return label;
    }
    DrawXAxis(w, g, scale, simulation) {
        if (w.Width - w.Rmargin - w.Lmargin < 10)
            return 1;
        //string lastdate = "";
        let stringFormat = new YDataRendering.YStringFormat(16384 /* YDataRendering.YStringFormat.StringFormatFlags.NoClip */);
        stringFormat.Alignment = 1 /* YDataRendering.YStringFormat.StringAlignment.Center */; // Horizontal Alignment
        let bottomSide = scale.position == XAxis.VrtPosition.BOTTOM;
        let y = bottomSide ? w.Height - w.Bmargin : w.Tmargin;
        if (!simulation)
            g.DrawLineXY(scale.pen, w.Lmargin, y, w.Width - w.Rmargin, y);
        let delta = scale.max - scale.min;
        let XZoom = (delta) / (w.Width - w.Lmargin - w.Rmargin);
        let stepCount = ((delta / scale.step) >> 0) + 1;
        let FirstStep = 0;
        let timeRange = MinMaxHandler.DefaultValue();
        for (let i = 0; i < this._series.length; i++) {
            if (!this._series[i].disabled) {
                timeRange = MinMaxHandler.Combine(timeRange, this._series[i].timeRange);
            }
        }
        scale.zeroTime = timeRange.Min;
        if (scale.timeReference == TimeConverter.TimeReference.ABSOLUTE) {
            FirstStep = scale.step * (Math.floor(scale.min / scale.step));
            timeRange.Min = scale.min;
            timeRange.Max = scale.max;
        }
        else {
            if (Number.isNaN(timeRange.Min))
                return 0;
            FirstStep = timeRange.Min + scale.step * (Math.floor((scale.min - scale.zeroTime) / scale.step));
        }
        if (FirstStep < scale.min)
            FirstStep += scale.step;
        let timeOffset = 0;
        if (scale.timeReference != TimeConverter.TimeReference.ABSOLUTE) {
            timeOffset = FirstStep;
        }
        scale.fullSize = timeRange.Max - timeRange.Min;
        //log("Viewport Size: " + (scale.max - scale.min).toString() + "Sec (" + ((scale.max - scale.min)/86400).toString()+" days)");
        let scaleFormat = scale.bestFormat(timeRange.Max - timeRange.Min, scale.max - scale.min);
        if (!simulation)
            g.TextRenderingHint = YDataRendering.YTextRenderingHint.AntiAlias;
        let UnitHeight = 0;
        let label;
        scale.step = scaleFormat.step;
        // compute the size of the first label
        let t = parseFloat(FirstStep.toString());
        label = YGraph.XLabel(t, scale, scaleFormat, timeRange);
        let ssize = g.MeasureString(label, scale.font, 100000);
        // Compute step to skip, to make sure labels don't overlap
        let mod = 1;
        while ((mod * (w.Width - w.Rmargin - w.Lmargin) / stepCount) < ssize.width) {
            mod++;
        }
        let steps = Math.round((t - timeOffset) / scale.step) >> 0;
        let previousT = 0;
        do {
            let d = TimeConverter.FromUnixTime(t);
            if ((scale.step > 32 * 86400) && (scale.timeReference == TimeConverter.TimeReference.ABSOLUTE)) // resynchronize with the begining of the month.
             {
                if (scale.step >= 365 * 86400) {
                    let m = d.getMonth();
                    t = TimeConverter.ToUnixTime(new Date(d.getFullYear() + (m > 5 ? 1 : 0), 0, 1));
                }
                else
                    t = TimeConverter.ToUnixTime(new Date(d.getFullYear(), d.getMonth(), 1));
                if (t < previousT) {
                    debugger;
                } // if this happens, we are in deep sh*t
                // console.log(" " + t.toString() +" / "+scale.max.toString() + " step = "+scale.step.toString())
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
                    //console.log("t="+t+" label="+label);
                    ssize = g.MeasureString(label, scale.font, 100000);
                    if (ssize.height > UnitHeight)
                        UnitHeight = ssize.height;
                    if (!simulation) {
                        if (steps % mod == 0) 
                        //if (Math.round(100 * (t - timeOffset)) % Math.round(100 * (scale.step * mod)) == 0)
                        {
                            g.DrawStringPF(label, scale.font, scale.font.brush, new YDataRendering.PointF(x, y + (bottomSide ? +5 : (-ssize.height) >> 0) - 2), stringFormat);
                        }
                    }
                }
            }
            previousT = t;
            t += scale.step;
            if (t < previousT)
                debugger; // if this happens, we are in deep sh*t
            steps++;
        } while (t <= scale.max);
        if (scale.legend.title != "") {
            let size = g.MeasureString(scale.legend.title, scale.legend.font, 100000);
            if (!simulation) {
                let legendX = (w.Lmargin + (w.Width - w.Lmargin - w.Rmargin - size.width) / 2) >> 0;
                let legendY = (bottomSide ? w.Height - w.Bmargin + UnitHeight + 5 : w.Tmargin - UnitHeight - size.height * 1.5);
                g.DrawString(scale.legend.title, scale.legend.font, scale.legend.font.brush, new YDataRendering.PointF(legendX, legendY));
            }
            UnitHeight += size.height >> 0;
        }
        scale.innerHeight = (UnitHeight >> 0) + 10;
        // noinspection JSSuspiciousNameCombination
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
        // double dview = mainViewPort.Width - mainViewPort.Lmargin - mainViewPort.Rmargin;
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
                    }
                    else if (pixelSize < 1) {
                        strValue += (strValue != "" ? " " : "") + HH + ":" + mm + ":" + ss + "." + f;
                    }
                    else if (pixelSize < 60) {
                        strValue += (strValue != "" ? " " : "") + HH + ":" + mm + ":" + ss;
                    }
                    else if (pixelSize < 3600) {
                        strValue += (strValue != "" ? " " : "") + HH + ":" + mm;
                    }
                    else if (pixelSize < 86400)
                        strValue += (strValue != "" ? " " : "") + HH + "H";
                }
                else {
                    let format = TimeConverter.RelativeFormat(scaleX.fullSize, dtime, pixelSize);
                    let ticks = YTimeSpan.TicksPerSecond * (Math.round(100 * (t - scaleX.zeroTime)) / 100);
                    strValue += (ticks < 0) ? "-" + new YTimeSpan(-ticks).toString(format) : new YTimeSpan(ticks).toString(format);
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
        g.SetClip(new YDataRendering.YRectangle(0, 0, viewPortWidth, viewPortHeight));
        let DataPoint = YGraph.ViewPortPointToIRL(this.mainViewPort, p); //DataPoint Y value will be incorrect, but we don't need it.
        let delta = -1;
        let bestindex = -1;
        let bestmatch = new Array(this._series.length);
        let IRLmatch = new Array(this._series.length);
        for (let i = 0; i < this._series.length; i++) {
            if ((this._series[i].visible) && (!this._series[i].disabled)) {
                let p2 = this._series[i].findClosestValue(DataPoint.x, false);
                if (p2 != null) {
                    IRLmatch[i] = p2;
                    bestmatch[i] = YGraph.IRLPointToViewPort(this.mainViewPort, IRLmatch[i], this.yAxes[this._series[i].yAxisIndex].IRLy, this.yAxes[this._series[i].yAxisIndex].zoom);
                    if (bestindex < 0 || (delta > Math.abs(bestmatch[i].Y - p.Y))) {
                        delta = Math.abs(bestmatch[i].Y - p.Y);
                        if ((this._dataTracker.detectionDistance == 0) ||
                            ((delta <= this._dataTracker.detectionDistance) &&
                                (Math.abs(bestmatch[i].X - p.X) < this._dataTracker.detectionDistance))) {
                            bestindex = i;
                        }
                    }
                }
            }
        }
        if (bestindex >= 0) {
            let xx = (bestmatch[bestindex].X - this._dataTracker.diameter / 2) >> 0;
            let yy = (bestmatch[bestindex].Y - this._dataTracker.diameter / 2) >> 0;
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
            let xx2 = (bestmatch[bestindex].X + dx * (this._dataTracker.handleLength * 1.5)) >> 0;
            let yy2 = (bestmatch[bestindex].Y + dy * this._dataTracker.handleLength) >> 0;
            g.DrawLineXY(this._dataTracker.pen, (bestmatch[bestindex].X + dx * 0.707 * this._dataTracker.diameter / 2) >> 0, (bestmatch[bestindex].Y + dy * 0.707 * this._dataTracker.diameter / 2) >> 0, (bestmatch[bestindex].X + dx * this._dataTracker.handleLength) >> 0, (bestmatch[bestindex].Y + dy * this._dataTracker.handleLength) >> 0);
            g.DrawLineXY(this._dataTracker.pen, (bestmatch[bestindex].X + dx * this._dataTracker.handleLength) >> 0, (bestmatch[bestindex].Y + dy * this._dataTracker.handleLength) >> 0, xx2, yy2);
            let strValue = "";
            if (this._dataTracker.showSerieName)
                strValue += this._series[bestindex].legend + "\r\n";
            if (this._dataTracker.showTimeStamp) {
                let t = IRLmatch[bestindex].x;
                strValue += this.TimeToAutoSting(t, this.mainViewPort, scaleX) + "\r\n";
            }
            // this string based comparaison  is an exception this._dataTracker.dataPrecision might actually be
            // DataTrackerDescription from Properties.ts which was  probably added to avoid precision values that
            // make no Sense in Yocto-Visualization
            if (this._dataTracker.dataPrecision.toString == DataTracker.DataPrecision.PRECISION_NOLIMIT.toString) {
                strValue += IRLmatch[bestindex].y.toString() + this._series[bestindex].unit;
            }
            else {
                let strvalue = this._dataTracker.dataPrecision.description; // not very elegent but it will do
                let precision = -Math.log10(Number(strvalue));
                strValue += IRLmatch[bestindex].y.toFixed(precision) + this._series[bestindex].unit; //FIXME
            }
            let ssize = g.MeasureString(strValue, this._dataTracker.font, 10000);
            let labelwidth = (ssize.width + 2 * this._dataTracker.padding + this._dataTracker.borderthickness);
            let labelHeight = (ssize.height + 2 * this._dataTracker.padding + this._dataTracker.borderthickness);
            if (dx > 0) {
                g.FillRectangleXYHW(this._dataTracker.bgBrush, xx2, yy2 - (labelHeight >> 1), labelwidth, labelHeight);
                g.DrawRectangleXYHW(this._dataTracker.pen, xx2, yy2 - (labelHeight >> 1), labelwidth, labelHeight);
                g.DrawStringXY(strValue, this._dataTracker.font, this._dataTracker.font.brush, (xx2 + this._dataTracker.padding) >> 0, (yy2 - (labelHeight >> 1) + this._dataTracker.padding) >> 0);
            }
            else {
                g.FillRectangleXYHW(this._dataTracker.bgBrush, xx2 - labelwidth, yy2 - (labelHeight >> 1), labelwidth, labelHeight);
                g.DrawRectangleXYHW(this._dataTracker.pen, xx2 - labelwidth, yy2 - (labelHeight >> 1), labelwidth, labelHeight);
                g.DrawStringXY(strValue, this._dataTracker.font, this.dataTracker.font.brush, (xx2 + this._dataTracker.padding - labelwidth) >> 0, (yy2 - (labelHeight >> 1) + this._dataTracker.padding) >> 0);
            }
        }
    }
    /*
     *  XAxis scale)
    {
        if (!scale.visible) return;
        double delta = scale.max - scale.min;
        Double XZoom = (delta) / (w.Width - w.Lmargin - w.Rmargin);

        for (int i = 0; i < scale.zones.Count; i++)
            if (scale.zones[i].visible)
            {
                double max = scale.zones[i].max;
                double min = scale.zones[i].min;
                if (double.IsNaN(max)) max = scale.min;
                if (double.IsNaN(min)) min = scale.max;
                if (max < min) { double t = max; max = min; min = t; }
                int x0 =  w.Lmargin + (int)Math.Round((min - scale.min) / XZoom);
     *
     * */
    DrawMarkers(w, g, scaleX, viewPortWidth, viewPortHeight) {
        if (this._xAxis.markers.length == 0)
            return;
        g.SetClip(new YDataRendering.YRectangle(w.Lmargin, w.Tmargin, w.Width - w.Rmargin - w.Lmargin, w.Height - w.Bmargin - w.Tmargin));
        let Bottomleft = YGraph.ViewPortPointToIRL(w, new YDataRendering.Point(w.Lmargin, w.Height - w.Bmargin));
        let TopRight = YGraph.ViewPortPointToIRL(w, new YDataRendering.Point(w.Width - w.Rmargin, w.Tmargin));
        let dy = (w.Height - w.Bmargin - w.Tmargin) / 100.0;
        let pixelSize = -1;
        g.TextRenderingHint = YDataRendering.YTextRenderingHint.AntiAlias;
        for (let i = 0; i < this._xAxis.markers.length; i++) {
            if (this._xAxis.markers[i].enabled) {
                if (pixelSize < 0)
                    pixelSize = this.pixelxSize(this.mainViewPort, scaleX);
                let mustdraw = true;
                let xpos = 0;
                if (this._xAxis.markers[i].timereference == TimeConverter.TimeReference.RELATIVE) {
                    if (this._xAxis.zeroTime > 0) {
                        xpos = this._xAxis.markers[i].xposition + this._xAxis.zeroTime;
                    }
                    else {
                        mustdraw = false;
                    }
                }
                else {
                    xpos = this._xAxis.markers[i].xposition;
                }
                if ((xpos > Bottomleft.x - 100 * pixelSize) && (xpos < TopRight.x + 100 * pixelSize) && mustdraw) {
                    let p = YGraph.IRLPointToViewPort(w, new pointXY(xpos, 0));
                    let xxCenter = (p.X) >> 0;
                    let yyCenter = (w.Height - w.Bmargin - (this._xAxis.markers[i].yposition * dy)) >> 0;
                    let strValue = this._xAxis.markers[i].text.replace("\\n", "\n");
                    let now = new Date();
                    if (strValue.indexOf('$') >= 0) {
                        if (strValue.indexOf("$MARKERTIME$") >= 0) {
                            // string s = _xAxis.markers[i].xpositionIsRelative ? _xAxis.markers[i].positionOnXAxis.toString()
                            // : TimeToAutoSting(_xAxis.markers[i].xposition, mainViewPort, scaleX);
                            let s = this._xAxis.markers[i].timereference == TimeConverter.TimeReference.RELATIVE ? TimeConverter.secTimeSpanToString(this._xAxis.markers[i].xposition, pixelSize)
                                : this.TimeToAutoSting(this._xAxis.markers[i].xposition, this.mainViewPort, scaleX);
                            strValue = strValue.replace("$MARKERTIME$", s);
                        }
                        if (strValue.indexOf("$VALUE") >= 0) {
                            for (let j = 0; j < this._series.length; j++) {
                                if (!this._series[j].disabled) {
                                    let pt = this._series[j].findClosestValue(xpos, true);
                                    let st = (pt != null) ? (pt.y).toFixed(0) : "--";
                                    strValue = strValue.replace("$VALUE" + (j + 1).toString() + "$", st);
                                }
                                else {
                                    strValue = strValue.replace("$VALUE" + (j + 1).toString() + "$", "");
                                }
                            }
                        }
                        if (strValue.indexOf("$UNIT") >= 0) {
                            for (let j = 0; j < this._series.length; j++) {
                                if (!this._series[j].disabled) {
                                    strValue = strValue.replace("$UNIT" + (j + 1).toString() + "$", this._series[j].unit);
                                }
                                else {
                                    strValue = strValue.replace("$UNIT" + (j + 1).toString() + "$", "");
                                }
                            }
                        }
                        if (strValue.indexOf("$LEGEND") >= 0) {
                            for (let j = 0; j < this._series.length; j++) {
                                if (!this._series[j].disabled) {
                                    strValue = strValue.replace("$LEGEND" + (j + 1).toString() + "$", this._series[j].legend);
                                }
                                else {
                                    strValue = strValue.replace("$LEGEND" + (j + 1).toString() + "$", "");
                                }
                            }
                        }
                        if (this._xAxis.markers[i].PatchTextCallback != null) {
                            strValue = this._xAxis.markers[i].PatchTextCallback(strValue);
                        }
                    }
                    let ssize = g.MeasureString(strValue, this._xAxis.markers[i].font, 10000);
                    let labelWidth = (ssize.width + 2 * this._xAxis.markers[i].padding + this._xAxis.markers[i].borderthickness);
                    let labelHeight = (ssize.height + 2 * this._xAxis.markers[i].padding + this._xAxis.markers[i].borderthickness);
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
                    g.DrawStringPF(strValue, this._xAxis.markers[i].font, this._xAxis.markers[i].font.brush, new YDataRendering.PointF(xText, yyCenter), this._xAxis.markers[i].stringFormat);
                    g.DrawLineXY(this._xAxis.markers[i].pen, xxCenter, (w.Tmargin) >> 0, xxCenter, yyCenter - (labelHeight >> 1));
                    g.DrawLineXY(this._xAxis.markers[i].pen, xxCenter, yyCenter + (labelHeight >> 1), xxCenter, (w.Height - w.Bmargin) >> 0);
                    if (this._xAxis.markers[i].arrowSize > 0) {
                        if (this._xAxis.markers[i].yposition > 25) {
                            let triangle = [
                                new YDataRendering.PointF((xxCenter - this._xAxis.markers[i].arrowSize), (yyCenter + (labelHeight >> 1))),
                                new YDataRendering.PointF((xxCenter + this._xAxis.markers[i].arrowSize), (yyCenter + (labelHeight >> 1))),
                                new YDataRendering.PointF(xxCenter, ((yyCenter + (labelHeight >> 1) + this._xAxis.markers[i].arrowSize)))
                            ];
                            g.FillPolygon(this._xAxis.markers[i].arrowBrush, triangle);
                        }
                        if (this._xAxis.markers[i].yposition < 75) {
                            let triangle = [
                                new YDataRendering.PointF((xxCenter - this._xAxis.markers[i].arrowSize), (yyCenter + (labelHeight >> 1))),
                                new YDataRendering.PointF((xxCenter + this._xAxis.markers[i].arrowSize), (yyCenter + (labelHeight >> 1))),
                                new YDataRendering.PointF(xxCenter, ((yyCenter - (labelHeight >> 1) - this._xAxis.markers[i].arrowSize)))
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
        g.SetClip(new YDataRendering.YRectangle(w.Lmargin, w.Tmargin, w.Width - w.Rmargin - w.Lmargin, w.Height - w.Bmargin - w.Tmargin));
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
                            let XZoom = (delta) / (w.Width - w.Lmargin - w.Rmargin);
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
                            x -= (panelWidth) / 2;
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
                            y -= (panelHeight) / 2;
                            break;
                    }
                    g.FillRectangleXYHW(p.bgBrush, x >> 0, y >> 0, panelWidth >> 0, panelHeight >> 0);
                    if (p.borderthickness > 0)
                        g.DrawRectangleXYHW(p.pen, x >> 0, y >> 0, panelWidth >> 0, panelHeight >> 0);
                    let sf = new YDataRendering.YStringFormat(16384 /* YDataRendering.YStringFormat.StringFormatFlags.NoClip */);
                    switch (p.panelTextAlign) {
                        case YDataRendering.MessagePanel.TextAlign.LEFT:
                            sf.LineAlignment = 0 /* YDataRendering.YStringFormat.StringAlignment.Near */;
                            sf.Alignment = 0 /* YDataRendering.YStringFormat.StringAlignment.Near */;
                            break;
                        case YDataRendering.MessagePanel.TextAlign.RIGHT:
                            sf.LineAlignment = 2 /* YDataRendering.YStringFormat.StringAlignment.Far */;
                            sf.Alignment = 2 /* YDataRendering.YStringFormat.StringAlignment.Far */;
                            break;
                        default:
                            sf.LineAlignment = 1 /* YDataRendering.YStringFormat.StringAlignment.Center */;
                            sf.Alignment = 1 /* YDataRendering.YStringFormat.StringAlignment.Center */;
                            break;
                    }
                    let rect = new YDataRendering.YRectangle((x + p.padding + p.borderthickness / 2) >> 0, (y + p.padding + p.borderthickness / 2) >> 0, ssize.width >>= +1, (ssize.height >> 0) + 1);
                    g.DrawStringRect(p.text, p.font, p.font.brush, rect, sf);
                }
                else {
                    throw new RangeError("Cannot renderer data panel #" + i.toString() + ", no such Y axis");
                }
            }
        }
    }
    Render(g, UIw, UIh) {
        if ((UIw < 50) || (UIh < 50))
            return 0; // too small size is likely to cause endless loops
        //#ifdef PROFILING
        //        let RenderTime :number = performance.now();
        ////#endif
        let lastLmargin = this.mainViewPort.Lmargin;
        let lastRmargin = this.mainViewPort.Rmargin;
        this.mainViewPort.Width = UIw;
        this.mainViewPort.Height = UIh;
        this.mainViewPort.Lmargin = 0;
        this.mainViewPort.Rmargin = 0;
        g.SmoothingMode = YDataRendering.YSmoothingMode.HighQuality;
        let yMarginOffset = 5;
        /* Step 1, found out margins */
        // top (bottom) margin: make sure the top(/bottom) number
        // on Y scale can be draw completely
        for (let i = 0; i < this._yAxes.length; i++) {
            if (this._yAxes[i].visible) {
                let s = g.MeasureString("8", this._yAxes[i].font, 100000);
                let o = ((s.height + 1) / 2) >> 0;
                if (yMarginOffset < o)
                    yMarginOffset = o;
            }
        }
        this.mainViewPort.Tmargin = (this._xAxis.position == XAxis.VrtPosition.TOP) ? 0 : yMarginOffset;
        this.mainViewPort.Bmargin = (this._xAxis.position == XAxis.VrtPosition.BOTTOM) ? 0 : yMarginOffset;
        /* Step 2B-2  Draw Legend if it doesn't overlap the data */
        if (!this._legendPanel.overlap)
            this.drawLegendPanel(g, UIw, UIh, this.mainViewPort);
        /* Step 2B-3  Draw annotations if it doesn't overlap the data */
        this.drawAnnotationPanels(g, this._annotationPanels, UIw, UIh, false, this.mainViewPort);
        if (this.mainViewPort.Bmargin == 0)
            this.mainViewPort.Bmargin = 5;
        if (this.mainViewPort.Tmargin == 0)
            this.mainViewPort.Tmargin = 5;
        /* Step 1-A  compute margins dues to X axis  */
        let h = this.DrawXAxis(this.mainViewPort, g, this._xAxis, true);
        if (this._xAxis.position == XAxis.VrtPosition.TOP)
            this.mainViewPort.Tmargin += h;
        else
            this.mainViewPort.Bmargin += h;
        this.mainViewPort.IRLx = this._xAxis.min;
        /* Step 1-B  Find out all Y axis  start / stop  graduation spacing  */
        let M;
        for (let i = 0; i < this._yAxes.length; i++) {
            M = MinMaxHandler.DefaultValue();
            for (let k = 0; k < this._series.length; k++) {
                if ((this._series[k].yAxisIndex == i) && (!this._series[k].disabled)) {
                    for (let j = 0; j < this._series[k].segments.length; j++) {
                        M = MinMaxHandler.Combine(M, YGraph.FindMinMax(this._xAxis.min, this._xAxis.max, this._series[k].segments[j].data, this._series[k].segments[j].count));
                    }
                }
            }
            this._yAxes[i].computeStartAndStep(M);
        }
        /* Step 1-B  compute  margins dues to Y axes  */
        if (this.mainViewPort.Lmargin == 0)
            this.mainViewPort.Lmargin = 5;
        if (this.mainViewPort.Rmargin == 0)
            this.mainViewPort.Rmargin = 5;
        for (let i = 0; i < this._yAxes.length; i++) {
            let sw = YGraph.DrawYAxis(this.mainViewPort, g, this._yAxes[i], 0, true);
            this.mainViewPort.Lmargin += (this._yAxes[i].position == YAxis.HrzPosition.LEFT) ? sw : 0;
            this.mainViewPort.Rmargin += (this._yAxes[i].position == YAxis.HrzPosition.RIGHT) ? sw : 0;
        }
        if (this._navigator.enabled) {
            if ((lastLmargin != this.mainViewPort.Lmargin) || (lastRmargin != this.mainViewPort.Rmargin)) {
                //console.log("L/R margin changed");
                this.navigatorCache = null;
            }
            let nh = (this._navigator.relativeheight * this.UIContainer.height / 100.0) >> 0;
            let ofset = this.xAxis.position == XAxis.VrtPosition.BOTTOM ? h : 0;
            this._navigator.setPosition(UIw, UIh, this.mainViewPort.Lmargin, this.mainViewPort.Rmargin, this.mainViewPort.Height - nh - this.mainViewPort.Bmargin + ofset, this.mainViewPort.Bmargin - ofset);
            this.mainViewPort.Bmargin += nh;
        }
        /* step 2A draw background */
        if ((this.lastTopMargin != this.mainViewPort.Tmargin) || (this.lastBottomMargin != this.mainViewPort.Bmargin)) {
            this._bgBrush = null;
            this.lastTopMargin = this.mainViewPort.Tmargin;
            this.lastBottomMargin = this.mainViewPort.Bmargin;
        }
        if (this._bgBrush == null) {
            this._bgBrush = new YDataRendering.YLinearGradientBrush(this._bgColor2, this._bgColor1);
        } // not sure why colors had to be inverted here
        g.FillRectangleXYHW(this._bgBrush, this.mainViewPort.Lmargin, this.mainViewPort.Tmargin, this.mainViewPort.Width - this.mainViewPort.Rmargin - this.mainViewPort.Lmargin, this.mainViewPort.Height - this.mainViewPort.Bmargin - this.mainViewPort.Tmargin);
        if (this._borderThickness > 0) {
            if (this._borderPen == null)
                this._borderPen = new YDataRendering.YPen(this._borderColor, this._borderThickness);
            g.DrawRectangleXYHW(this._borderPen, this.mainViewPort.Lmargin, this.mainViewPort.Tmargin, this.mainViewPort.Width - this.mainViewPort.Rmargin - this.mainViewPort.Lmargin, this.mainViewPort.Height - this.mainViewPort.Bmargin - this.mainViewPort.Tmargin);
        }
        /* Step 2B  Draw Y-axes and X axis zones */
        g.SetClip(new YDataRendering.YRectangle(this.mainViewPort.Lmargin, this.mainViewPort.Tmargin, this.mainViewPort.Width - this.mainViewPort.Rmargin - this.mainViewPort.Lmargin, this.mainViewPort.Height - this.mainViewPort.Bmargin - this.mainViewPort.Tmargin));
        for (let i = 0; i < this._yAxes.length; i++) {
            this.DrawYAxisZones(this.mainViewPort, g, this._yAxes[i]);
        }
        this.DrawXAxisZones(this.mainViewPort, g, this.xAxis);
        g.ResetClip();
        /* step 3 draw X scale */
        this.DrawXAxis(this.mainViewPort, g, this._xAxis, false);
        /* step 4 draw Y scale */
        let leftOffset = 0;
        let rightOffset = 0;
        //YDataRendering.YDataRenderer.RendererDebug = true;
        for (let i = 0; i < this._yAxes.length; i++) {
            let ww = YGraph.DrawYAxis(this.mainViewPort, g, this._yAxes[i], (this._yAxes[i].position == YAxis.HrzPosition.LEFT) ? leftOffset : rightOffset, false);
            if (this._yAxes[i].position == YAxis.HrzPosition.LEFT)
                leftOffset += ww;
            if (this._yAxes[i].position == YAxis.HrzPosition.RIGHT)
                rightOffset += ww;
        }
        //YDataRendering.YDataRenderer.RendererDebug = false;
        // step 5 step define data zone
        //  YDataRendering.YPen mypenb = Pens.Black;
        //g.DrawRectangle(mypenb, ViewPort1.Lmargin, ViewPort1.Tmargin, ViewPort1.Width - ViewPort1.Rmargin - ViewPort1.Lmargin, ViewPort1.Height - ViewPort1.Bmargin - ViewPort1.Tmargin);
        g.SetClip(new YDataRendering.YRectangle(this.mainViewPort.Lmargin, this.mainViewPort.Tmargin, this.mainViewPort.Width - this.mainViewPort.Rmargin - this.mainViewPort.Lmargin, this.mainViewPort.Height - this.mainViewPort.Bmargin - this.mainViewPort.Tmargin));
        // step 6 series rendering
        this.mainViewPort.zoomx = (this.mainViewPort.Width - this.mainViewPort.Lmargin - this.mainViewPort.Rmargin) / (this._xAxis.max - this._xAxis.min);
        let mypenb = null;
        let lineCount = 0;
        let pointCount = 0;
        let Bottomleft = YGraph.ViewPortPointToIRL(this.mainViewPort, new YDataRendering.Point(this.mainViewPort.Lmargin, this.mainViewPort.Height - this.mainViewPort.Bmargin));
        let TopRight = YGraph.ViewPortPointToIRL(this.mainViewPort, new YDataRendering.Point(this.mainViewPort.Width - this.mainViewPort.Rmargin, this.mainViewPort.Tmargin));
        let xTimeStart = Bottomleft.x;
        let xTimeEnd = TopRight.x;
        for (let k = 0; k < this._series.length; k++) {
            if ((this._series[k].visible) && !(this._series[k].disabled)) { //#ifdef PROFILING
                //                let perf : number  = performance.now();
                //                //#endif
                let scaleIndex = this._series[k].yAxisIndex;
                mypenb = this._series[k].pen;
                this.mainViewPort.IRLy = this._yAxes[scaleIndex].startStopStep.dataMin;
                this._yAxes[this._series[k].yAxisIndex].IRLy = this.mainViewPort.IRLy;
                let delta = this._yAxes[scaleIndex].startStopStep.dataMax - this._yAxes[scaleIndex].startStopStep.dataMin;
                if (delta == 0) {
                    delta = 1;
                    this.mainViewPort.IRLy -= delta / 2;
                }
                this.mainViewPort.zoomy = (this.mainViewPort.Height - this.mainViewPort.Tmargin - this.mainViewPort.Bmargin) / (delta);
                this._yAxes[this._series[k].yAxisIndex].zoom = this.mainViewPort.zoomy;
                g.comment("** main view-port series " + k.toString());
                for (let i = 0; i < this._series[k].segments.length; i++) {
                    lineCount += YGraph.DoSegmentRendering(this.mainViewPort, g, mypenb, this._series[k].segments[i].data, this._series[k].segments[i].count, xTimeStart, xTimeEnd);
                    pointCount += this._series[k].segments[i].count;
                }
                //#ifdef PROFILING
                //                console.log("Serie "+k+" rendering took  "+(performance.now()-perf).toString()+"ms ("+this._series[k].segments.length+" segments)");
                //                //#endif
            }
        }
        // step 7  draw  navigator
        g.ResetClip();
        if (this._navigator.enabled) { //#ifdef PROFILING
            //            let ntime :number =  performance.now();
            //            //#endif
            g.comment("** navigator **");
            let v = this._navigator.viewport;
            // step 7A, find out Time Range
            let range = MinMaxHandler.DefaultValue();
            for (let i = 0; i < this._series.length; i++) {
                if (!this._series[i].disabled)
                    range = MinMaxHandler.Combine(range, this._series[i].timeRange);
            }
            this._navigator.Xrange = MinMaxHandler.extend(range, 1.05);
            v.zoomx = (v.Width - v.Lmargin - v.Rmargin) / (this._navigator.Xrange.Max - this._navigator.Xrange.Min);
            if (((this.lastPointCount != pointCount)
                && (!this.mainViewPort.Capture) && (!this._navigator.Capture)) // performance : do not redraw navigator when a drag operation is running.
                || (this.navigatorCache == null) || (g instanceof YDataRendering.YGraphicsSVG)) {
                g.comment("Redraw navigator");
                if (this.navigatorCache != null)
                    this.navigatorCache = null; //.Dispose();
                this.navigatorCache = document.createElement('canvas'); //  new HTMLCanvasElement(); //v.Width, v.Height, g.graphics); FIXME?
                //document.body.appendChild(this.navigatorCache); // debug
                this.navigatorCache.width = v.Width;
                this.navigatorCache.height = v.Height;
                this.lastPointCount = pointCount;
                let ng;
                if (g instanceof YDataRendering.YGraphicsSVG) {
                    ng = g;
                }
                else {
                    ng = new YDataRendering.YGraphics(this.navigatorCache, v.Width, v.Height, 90);
                }
                //ng.SetClip(new Rectangle(v.Lmargin, v.Tmargin, v.Width - v.Rmargin - v.Lmargin, v.Height - v.Bmargin - v.Tmargin));
                //ng.ResetClip();
                ng.FillRectangleXYHW(this._navigator.bgBrush, v.Lmargin, v.Tmargin, v.Width - v.Rmargin - v.Lmargin, v.Height - v.Bmargin - v.Tmargin);
                if ((this.xAxis.zones.length > 0) && this._navigator.showXAxisZones) {
                    let delta = this._navigator.Xrange.Max - this._navigator.Xrange.Min;
                    let XZoom = (delta) / (v.Width - v.Lmargin - v.Rmargin);
                    for (let i = 0; i < this.xAxis.zones.length; i++) {
                        if (this.xAxis.zones[i].visible) {
                            let min = this.xAxis.zones[i].min;
                            let max = this.xAxis.zones[i].max;
                            if (isNaN(min))
                                min = this._navigator.Xrange.Min;
                            if (isNaN(max))
                                max = this._navigator.Xrange.Max;
                            ng.FillRectangleXYHW(this.xAxis.zones[i].zoneBrush, v.Lmargin + ((min - this._navigator.Xrange.Min) / XZoom) >> 0, v.Tmargin >> 0, ((max - min) / XZoom) >> 0, v.Height - v.Bmargin - v.Tmargin);
                        }
                    }
                }
                if ((MinMaxHandler.isDefined(this._navigator.Xrange)) && ((this._navigator.Xrange.Max - this._navigator.Xrange.Min) > 0)) // if (Xrange<=0) then nothing to draw
                 { // step 7B, draw series
                    let Min;
                    let Max;
                    v.IRLx = this._navigator.Xrange.Min;
                    let dontSticktoBorderZoom = 4.0 / (v.Height - v.Bmargin - v.Tmargin);
                    let Bottomleft = YGraph.ViewPortPointToIRL(v, new YDataRendering.Point(v.Lmargin, v.Height - v.Bmargin));
                    let TopRight = YGraph.ViewPortPointToIRL(v, new YDataRendering.Point(v.Width - v.Rmargin, v.Tmargin));
                    let xTimeStart = Bottomleft.x;
                    let xTimeEnd = TopRight.x;
                    if (this._navigator.yAxisHandling == Navigator.YAxisHandling.AUTO) { // Automatic yAxis handling
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
                                }
                                else {
                                    let delta = Max - Min;
                                    Min -= delta * dontSticktoBorderZoom; // 0.025;
                                    Max += delta * dontSticktoBorderZoom; // 0.025;
                                }
                                v.IRLy = Min;
                                v.zoomy = (v.Height - v.Tmargin - v.Bmargin) / (Max - Min);
                                for (let i = 0; i < this._series[k].segments.length; i++) {
                                    lineCount += YGraph.DoSegmentRendering(v, ng, mypenb, this._series[k].segments[i].data, this._series[k].segments[i].count, xTimeStart, xTimeEnd);
                                }
                            }
                        }
                    }
                    else { //  yAxis handling inherited from main view-port settings
                        for (let i = 0; i < this._yAxes.length; i++) { // find out data MinMax
                            let Yrange = MinMaxHandler.DefaultValue();
                            for (let j = 0; j < this._series.length; j++) {
                                if ((this._series[j].yAxisIndex == i) && (!this._series[j].disabled)) {
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
                                Min = 0.0;
                                Max = 1.0;
                            }
                            if (Max - Min <= 0) {
                                Min = Min - 0.5;
                                Max = Min + 0.5;
                            }
                            v.IRLy = Min;
                            v.zoomy = (v.Height - v.Tmargin - v.Bmargin) / (Max - Min);
                            for (let j = 0; j < this._series.length; j++) {
                                if ((this._series[j].yAxisIndex == i) && (!this._series[j].disabled) && (this._series[j].visible)) {
                                    ng.comment("** navigator series " + j.toString());
                                    mypenb = this._series[j].navigatorpen;
                                    for (let k = 0; k < this._series[j].segments.length; k++) {
                                        lineCount += YGraph.DoSegmentRendering(v, ng, mypenb, this._series[j].segments[k].data, this._series[j].segments[k].count, xTimeStart, xTimeEnd);
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
                    // step 7C, draw Scale
                    this.DrawMonitorXAxis(v, ng, this._navigator.Xrange, this.xAxis.labelFormat);
                    this._navigator.setIRLPosition(v.IRLx, v.IRLy, v.zoomx, v.zoomy);
                }
                if (!(g instanceof YDataRendering.YGraphicsSVG))
                    ng.Dispose();
            }
            // set  7E, copy cache to display
            let cacheW = v.Width - v.Rmargin - v.Lmargin + 1;
            let cacheH = v.Width - v.Rmargin - v.Lmargin + 1;
            let rectsrc = new YDataRendering.YRectangle(v.Lmargin, v.Tmargin - 1, cacheW, cacheH);
            let rectdst = new YDataRendering.YRectangle(v.Lmargin, v.Tmargin, cacheW, cacheH);
            g.SetClip(rectdst);
            if (!(g instanceof YDataRendering.YGraphicsSVG)) {
                //g.SetClip(rect);
                //let  p : YDataRendering.YPen = new YDataRendering.YPen( YDataRendering.YColor.Blue,1);
                //g.DrawLineXY(p,0,0,this.UIContainer.width,this.UIContainer.height);
                //g.DrawLineXY(p,this.UIContainer.width,0,0,this.UIContainer.height);
                g.DrawImage(this.navigatorCache, rectsrc, rectdst, 2 /* YDataRendering.YGraphicsUnit.Pixel */);
                // g.ResetClip();
            }
            //navigatorCache.Save("C:\\tmp\\t.png", ImageFormat.Png);
            // set  7E, draw Cursor
            if (this._navigator.borderThickness > 0) {
                g.DrawLineXY(this._navigator.borderPen, v.Lmargin + 1, v.Tmargin, v.Lmargin + 1, v.Height - v.Bmargin - 1);
                g.DrawLineXY(this._navigator.borderPen, v.Width - v.Rmargin, v.Tmargin, v.Width - v.Rmargin, v.Height - v.Bmargin - 1);
                g.DrawLineXY(this._navigator.borderPen, v.Lmargin + 1, v.Tmargin, v.Width - v.Rmargin, v.Tmargin);
            }
            let IRLCursorStart = YGraph.ViewPortPointToIRL(this.mainViewPort, new YDataRendering.Point(this.mainViewPort.Lmargin, 0));
            let IRLCursorEnd = YGraph.ViewPortPointToIRL(this.mainViewPort, new YDataRendering.Point(this.mainViewPort.Width - this.mainViewPort.Rmargin, 0));
            let CursorStart = YGraph.IRLPointToViewPort(this._navigator.viewport, new pointXY(IRLCursorStart.x, 0));
            let CursorEnd = YGraph.IRLPointToViewPort(this._navigator.viewport, new pointXY(IRLCursorEnd.x, 0));
            g.FillRectangle(this._navigator.cursorBrush, new YDataRendering.YRectangle(CursorStart.X - 1, v.Tmargin, CursorEnd.X - CursorStart.X + 2, v.Height - v.Bmargin - v.Tmargin - 1));
            g.DrawLineXY(this._navigator.cursorBorderPen, (CursorStart.X - 1) >> 0, (v.Tmargin) >> 0, (CursorStart.X - 1) >> 0, (v.Height - v.Bmargin) - 1);
            g.DrawLineXY(this._navigator.cursorBorderPen, (CursorEnd.X + 1) >> 0, (v.Tmargin) >> 0, (CursorEnd.X + 1) >> 0, (v.Height - v.Bmargin) - 1);
            g.ResetClip();
            //#ifdef PROFILING
            //            console.log("Navigator rendering took "+(performance.now()-ntime).toString()+"ms")
            //            //#endif
        }
        if (this._legendPanel.overlap)
            this.drawLegendPanel(g, UIw, UIh, this.mainViewPort);
        g.TextRenderingHint = YDataRendering.YTextRenderingHint.SingleBitPerPixelGridFit;
        this.DrawMarkers(this.mainViewPort, g, this.xAxis, UIw, UIh);
        this.drawAnnotationPanels(g, this._annotationPanels, UIw, UIh, true, this.mainViewPort);
        this.DrawDataPanels(this.mainViewPort, g, this.xAxis, this._yAxes, UIw, UIh);
        this.DrawDataTracker(g, UIw, UIh, this.xAxis);
        this.DrawMessagePanels(g, UIw, UIh);
        /*
                let p: YDataRendering.Point | null = this.mouseLocalPosition();
                 if (p != null)
                 {    let pen = new YPen(YColor.Red, 1);
                     g.DrawLineXY(pen, p.X - 5, p.Y, p.X + 5, p.Y);
                     g.DrawLineXY(pen, p.X, p.Y - 5, p.X, p.Y + 5);
                 }
        */
        //console.log("END OF GRAPH")
        //#ifdef PROFILING
        //
        //        console.log("graph rendering took "+ ( performance.now()-RenderTime ).toString()+"ms");
        //        //#endif
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
            this.mouseWheel(new YDataRendering.Point(this.UIContainer.width >> 1, this.UIContainer.height >> 1), 10);
        }
        if (e.code == "ArrowDown") {
            this.mouseWheel(new YDataRendering.Point(this.UIContainer.width >> 1, this.UIContainer.height >> 1), -10);
        }
    }
    mouseWheel(pos, delta) {
        let ZoomFactor = Math.pow(1.25, delta / 120); // 120 is totally arbitrary
        let NextZoomX = this.mainViewPort.zoomx * ZoomFactor;
        if ((NextZoomX > this.mainViewPort.zoomx) && (NextZoomX > 1000))
            return;
        let currentRange = this._xAxis.max - this._xAxis.min;
        if ((currentRange / ZoomFactor) > 25 * 365.0 * 86400.0)
            return; //  more zoom out may cause overflows, never-ending loops and freeze the browser
        this.mainViewPort.IRLx += ((pos.X - this.mainViewPort.Lmargin) / this.mainViewPort.zoomx) - ((pos.X - this.mainViewPort.Lmargin) / NextZoomX);
        let range = this._xAxis.max - this._xAxis.min;
        this._xAxis.set_minMax(this.mainViewPort.IRLx, this.mainViewPort.IRLx + range / ZoomFactor);
        this.mainViewPort.zoomx = NextZoomX;
        this.redraw();
    }
    mouseWheelEvent(sender, e) {
        let p = this.Scr2ElmMatrix.multiplyByV(YDataRendering.Vector3.FromXYCoord(e.pageX, e.pageY)).toPoint();
        let eX = p.X;
        let eY = p.Y;
        this.mouseWheel(new YDataRendering.Point(eX, eY), e.deltaY > 0 ? -150 : 150);
        e.preventDefault();
    }
}
YGraph._defaultVerticalDragZoomEnabled = false;
YGraph.captureCursor = null;

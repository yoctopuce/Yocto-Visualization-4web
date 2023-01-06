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
import Timeout = NodeJS.Timeout;
import {YColor, YPen} from "./YDataRendererCommon.js";

export class pointXY
{
    public x: number;
    public y: number;
    constructor(X?: number, Y?: number)
    {
        this.x = X === undefined ? 0 : X;
        this.y = Y === undefined ? 0 : Y;
    }
    public clone(): pointXY { return new pointXY(this.x, this.y)}
}

export interface PatchMarkerTextCallback {(text: string): string}

export class TimeConverterParseResult
{
    public success: boolean = false;
    public result: number = 0;

}

class TimeResolution
{
    public step: number = 0;
    public format: number = 0;
}

export class YDate extends Date
{
    public static readonly D: number = 1;
    public static readonly DD: number = 2;
    public static readonly M: number = 4;
    public static readonly YY: number = 8;
    public static readonly h: number = 16;
    public static readonly m: number = 32;
    public static readonly s: number = 64;
    public static readonly ms1: number = 128;
    public static readonly ms01: number = 256;
    public static readonly ms001: number = 512;
    public static readonly CR: number = 1024;
    public static readonly isRelative: number = 2048;
    public static readonly YYYY: number = 4096;

    private static d = (new Date()).toLocaleTimeString().toUpperCase();
    public static readonly use24Hformat = (YDate.d.indexOf("AM") < 0) && (YDate.d.indexOf("PM") < 0)

    private static readonly months: string[] = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];

    public ToString(format: number): string
    {
        let res: string = "";
        let ampm: string = "";
        if (format & YDate.D) res = res + this.getDate() + " ";
        if (format & YDate.M) res = res + YDate.months[this.getMonth()] + " ";
        if (format & YDate.YY)
        {
            let y: string = this.getFullYear().toString();
            res = res + y.substr(y.length - 2) + " ";
        }

        else if (format & YDate.YYYY)
        {
            let y: string = this.getFullYear().toString();
            res = res + y + " ";
        }

        if (format & YDate.CR) res = res + "\n";
        if (format & YDate.h)
        {
            if (YDate.use24Hformat)
            {
                let h = "0" + this.getHours().toString();
                res = res + h.substring(h.length - 2);
                if (!(format & YDate.m)) res = res + "H"
            }
            else
            {
                let hour = this.getHours();
                ampm = "AM";
                if (hour > 11) ampm = "PM";
                if (hour > 12) hour = hour - 12;
                if (hour == 0) hour = 12;
                res = res + hour.toString();

            }
        }
        if (format & YDate.m)
        {
            let m = "0" + this.getMinutes().toString();
            res = res + ":" + m.substring(m.length - 2);
        }
        if (format & YDate.s)
        {
            let s = "0" + this.getSeconds().toString();
            res = res + ":" + s.substring(s.length - 2);
        }
        if (format & YDate.ms1)
        {
            let ms = "00" + this.getMilliseconds().toString();
            res = res + "." + ms.substring(ms.length - 3).substring(1);
        }
        else if (format & YDate.ms01)
        {
            let ms = "00" + this.getMilliseconds().toString();
            res = res + "." + ms.substring(ms.length - 3).substring(2);
        }
        else if (format & YDate.ms001)
        {
            let ms = "00" + this.getMilliseconds().toString();
            res = res + "." + ms.substring(ms.length - 3).substring(3);
        }

        if ((format & YDate.h) && !YDate.use24Hformat)
        {
            res = res + ampm
        }
        return res;
    }
}

export class TimeConverter
{

    public static UTCNow(): YDate { return new YDate(); }

    public static ToUnixTime(datetime: Date): number { return datetime.getTime() / 1000.0; }

    public static FromUnixTime(unixtime: number): YDate
    {
        let t: YDate = new YDate()
        t.setTime(unixtime * 1000)
        return t;
    }

    public static tryParseStringToAbsDateTime(str: string): TimeConverterParseResult
    {
        let res = new TimeConverterParseResult();
        res.success = false;

        let date: Date = new Date();
        let year: number = date.getFullYear();
        let month: number = date.getMonth();
        let day: number = date.getDate();
        let hours: number = 0
        let minutes: number = 0
        let seconds: number = 0;

        str = str.trim();
        while (str.indexOf("  ") > 0)
        {
            str = str.replace("  ", " ");
        }
        let dateFound: boolean = false;
        let timeFound: boolean = false;

        let it: string[] = str.split(" ")

        if (it.length <= 0) return res;

        for (let i: number = 0; i < (it.length) && (i < 2); i++)
        {
            if (it[i].indexOf("-") > 0)
            {
                let tokens: string[] = it[i].split("-");
                if (tokens.length == 1)
                {day = parseInt(tokens[0]); }
                else if (tokens.length == 2)
                {
                    day = parseInt(tokens[1]);
                    month = parseInt(tokens[0]) - 1;
                }
                else
                {
                    day = parseInt(tokens[2]);
                    month = parseInt(tokens[1]) - 1;
                    year = parseInt(tokens[0]);
                }
                dateFound = true;
            }
            else if (it[i].indexOf(":") > 0)
            {
                let tokens: string[] = it[i].split(":");
                if (tokens.length == 1)
                {hours = parseInt(tokens[0]); }
                else if (tokens.length == 2)
                {
                    hours = parseInt(tokens[0]);
                    minutes = parseInt(tokens[1]);
                }
                else
                {
                    hours = parseInt(tokens[0]);
                    minutes = parseInt(tokens[1]);
                    seconds = parseFloat(tokens[2]);
                }
                timeFound = true;
            }
        }

        if ((!timeFound) && (!dateFound)) return res;
        if (isNaN(year) || isNaN(month) || isNaN(day) || isNaN(hours) || isNaN(minutes) || isNaN(seconds)) return res;

        date.setFullYear(year, month, day)
        date.setHours(hours, minutes, seconds >> 0, (1000 * (seconds % 1)) >> 0)
        res.result = date.getTime() / 1000; //- 60*date.getTimezoneOffset();
        res.success = true;
        return res;
    }

    public static tryParseStringToSecTimeSpan(st: string): TimeConverterParseResult
    {
        let res = new TimeConverterParseResult();
        let d: number = 0;

        st = st.toUpperCase();

        let n: number = st.indexOf("D");
        if (n > 0)
        {
            d = parseFloat(st.substring(0, n));
            if (isNaN(d))
            { return res}

            res.result += +d * 86400;
            if (n == st.length - 1)
            {
                res.success = true;
                return res
            }
            st = st.substring(n + 1);
        }
        n = st.indexOf("H");
        if (n > 0)
        {
            d = parseFloat(st.substring(0, n));
            if (isNaN(d))
            { return res}
            res.result += d * 3600;
            if (n == st.length - 1)
            {
                res.success = true;
                return res
            }
            st = st.substring(n + 1);
        }
        n = st.indexOf("M");
        if (n > 0)
        {
            d = parseFloat(st.substring(0, n));
            if (isNaN(d))
            { return res}
            res.result += d * 60;
            if (n == st.length - 1)
            {
                res.success = true;
                return res
            }
            st = st.substring(n + 1);
        }

        n = st.indexOf("S");
        if (n < 0) n = st.length;
        d = parseFloat(st.substring(0, n));
        if (isNaN(d))
        { return res}
        res.result += d;
        res.success = true;
        return res

    }

//public static  secTimeSpanToString( timespan:number):string
//  { return TimeConverter.secTimeSpanToString( timespan, 0); }

    public static secTimeSpanToString(timespan: number, resolution: number): string
    {
        let started: boolean = false;
        let res: string = "";
        if (timespan < 0)
        {
            res = "-";
            timespan = -timespan;
        }
        if (timespan >= 86400)
        {
            let d: number = (timespan / 86400) >> 0;
            res = res + d.toString() + "d";
            timespan -= 86400 * d;
            started = true;
        }
        if (resolution >= 86400) return res != "" ? res : "0d";
        if (timespan >= 3600)
        {
            let d: number = ((timespan / 3600) >> 0);
            let ds = d.toString();
            if (started && ds.length == 1) ds = "0" + ds
            res = res + ds + "h";
            timespan -= 3600 * d;
            started = true;
        }
        if (resolution >= 3600) return res != "" ? res : "0h";
        if (timespan < resolution) return res != "" ? res : "0h";
        if (timespan >= 60)
        {
            let d: number = (timespan / 60) >> 0;
            let ds = d.toString();
            if (started && ds.length == 1) ds = "0" + ds
            res = res + ds + "m";
            timespan -= 60 * d;
            started = true;
        }
        if (resolution >= 60) return res != "" ? res : "0m";
        if (timespan < resolution) return res != "" ? res : "0m";
        timespan = Math.round(timespan * 100) / 100;

        let s: string;

        if (resolution > 0.1)
        {
            s = timespan.toFixed(0);
        }
        else if (resolution > 0.01)
        {
            s = timespan.toFixed(1);
        }
        else if (resolution > 0.001)
        {
            s = timespan.toFixed(2);
        }
        else
        {
            s = timespan.toString();
        }
        if (started && timespan < 10) s = "0" + s;
        res = res + s + "s";
        return res;

    }

    public static RelativeFormat(dataDeltaTime: number, viewportDeltaTime: number, resolution: number): number
    {
        let ShowSecondsTenth: boolean = true;
        let ShowSecondsHundredth: boolean = true;
        let ShowSeconds: boolean = true;
        let ShowMinutes: boolean = false;
        let ShowHours: boolean = false;
        let ShowDays: boolean = false;

        if (dataDeltaTime <= 0.10)
        { ShowSecondsHundredth = true; }
        if (dataDeltaTime <= 1)
        { ShowSecondsTenth = true; }
        if ((dataDeltaTime >= 60) || (viewportDeltaTime >= 60))
        { ShowMinutes = true; }
        if ((dataDeltaTime >= 3600) || (viewportDeltaTime >= 3600))
        { ShowHours = true; }
        if ((dataDeltaTime >= 86400) || (viewportDeltaTime >= 86400))
        { ShowDays = true; }

        if (resolution >= .1) ShowSecondsHundredth = false;
        if (resolution >= 1) ShowSecondsTenth = false;
        if (resolution >= 60) ShowSeconds = false;
        if (resolution >= 3600) ShowMinutes = false;
        if (resolution >= 86400) ShowHours = false;

        let format: number = 0;
        format |= YDate.isRelative;
        if (ShowSecondsTenth) format |= YDate.ms1;
        if (ShowSecondsHundredth) format |= YDate.ms01;
        if (ShowSeconds) format |= YDate.s;
        if (ShowMinutes) format |= YDate.m;
        if (ShowHours) format |= YDate.h;
        if (ShowDays) format |= YDate.D;
        return format;

    }

    public static BestTimeformat(dataDeltaTime: number, viewportDeltaTime: number, tref: TimeConverter.TimeReference): TimeResolution
    {
        let res = new TimeResolution();
        let ShowSecondsTenth: boolean = true;
        let ShowSecondsHundredth: boolean = true;
        let ShowSeconds: boolean = true;
        let ShowMinutes: boolean = false;
        let ShowHours: boolean = false;
        let ShowDays: boolean = false;
        let ShowMonths: boolean = false;
        let ShowYears: boolean = false;

        if (viewportDeltaTime <= 0.10)
        { res.step = 0.01; }
        else if (viewportDeltaTime <= 1)
        { res.step = 0.1; }
        else if (viewportDeltaTime <= 2)
        { res.step = 0.2; }
        else if (viewportDeltaTime <= 5)
        { res.step = 0.5; }
        else if (viewportDeltaTime <= 10)
        { res.step = 1; }
        else if (viewportDeltaTime <= 20)
        { res.step = 2; }
        else if (viewportDeltaTime <= 30)
        { res.step = 3; }
        else if (viewportDeltaTime <= 40)
        { res.step = 4; }
        else if (viewportDeltaTime <= 60)
        { res.step = 5; }
        else if (viewportDeltaTime <= 120)
        { res.step = 10; }
        else if (viewportDeltaTime <= 300)
        { res.step = 30; }
        else if (viewportDeltaTime <= 900)
        { res.step = 60; }
        else if (viewportDeltaTime <= 1800)
        { res.step = 180; }
        else if (viewportDeltaTime <= 3600)
        { res.step = 300; }
        else if (viewportDeltaTime <= 7200)
        { res.step = 600; }
        else if (viewportDeltaTime <= 14000)
        { res.step = 900; }
        else if (viewportDeltaTime <= 21600)
        { res.step = 1800; }
        else if (viewportDeltaTime <= 43200)
        { res.step = 3600; }
        else if (viewportDeltaTime <= 86400)
        { res.step = 7200; }
        else if (viewportDeltaTime <= 2 * 86400)
        { res.step = 2 * 7200; }
        else if (viewportDeltaTime <= 4 * 86400)
        { res.step = 4 * 7200; }
        else if (viewportDeltaTime <= 7 * 86400)
        { res.step = 86400; }
        else if (viewportDeltaTime <= 14 * 86400)
        { res.step = 2 * 86400; }
        else if (viewportDeltaTime <= 28 * 86400)
        { res.step = 4 * 86400; }
        else if (viewportDeltaTime <= 56 * 86400)
        { res.step = 7 * 86400; }
        else if (viewportDeltaTime <= 112 * 86400)
        { res.step = 14 * 86400; }
        else if (viewportDeltaTime <= 224 * 86400)
        { res.step = 31 * 86400; }
        else if (viewportDeltaTime <= 448 * 86400)
        { res.step = 62 * 86400; }
        else if (viewportDeltaTime <= 896 * 86400)
        { res.step = 93 * 86400; }
        else
        { res.step = 365 * 86400; }

        if (tref == TimeConverter.TimeReference.ABSOLUTE)
        {
            ShowSecondsHundredth = true;
            ShowSecondsTenth = true;
            ShowMinutes = true;
            ShowHours = true;
            ShowDays = dataDeltaTime > 86400;
            ShowMonths = dataDeltaTime > 86400;
            ShowYears = dataDeltaTime > 28 * 6 * 86400;

            if (res.step >= .1) ShowSecondsHundredth = false;
            if (res.step >= 1) ShowSecondsTenth = false;
            if (res.step >= 60) ShowSeconds = false;
            if (res.step >= 3600) ShowMinutes = false;
            if (res.step >= 86400) ShowHours = false;
            if (res.step >= 31 * 86400) ShowDays = false;
            if (res.step >= 365 * 86400) ShowMonths = false;

            res.format = 0;
            if (ShowSecondsHundredth) res.format |= YDate.ms01;
            if (ShowSecondsTenth) res.format |= YDate.ms1;
            if (ShowSeconds) res.format |= YDate.s;
            if (ShowMinutes) res.format = res.format |= YDate.m;
            if (ShowHours) res.format = res.format |= YDate.h;
            if ((res.format != 0) && (ShowDays || ShowMonths)) res.format |= YDate.CR;
            if (ShowDays) res.format |= YDate.D;
            if (ShowMonths) res.format |= YDate.M;
            if (ShowYears) res.format |= YDate.YY;
            if (res.format == YDate.YY) res.format = YDate.YYYY;

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
        else
        {
            res.format = TimeConverter.RelativeFormat(dataDeltaTime, viewportDeltaTime, res.step);

        }

        return res;
    }
}

export namespace TimeConverter
{

    export class TimeReferenceEnumItem extends YDataRendering.YEnumItem
    {
        constructor(value: any, humanreadable: string, container?: object)
        {
            super(value, humanreadable, TimeReference)

        }
    }

    // export const enum TimeReference {ABSOLUTE = "Absolute", RELATIVE = "Relative to first data" }
    export class TimeReference extends YDataRendering.YEnum
    {
        public static readonly ABSOLUTE: TimeReferenceEnumItem = new TimeReferenceEnumItem("ABSOLUTE", "Absolute");
        public static readonly RELATIVE: TimeReferenceEnumItem = new TimeReferenceEnumItem("RELATIVE", "Relative to first data");
    }

}

export class MinMax
{
    Min: number = 0;
    Max: number = 0;

    constructor(minimum: number, maximum: number)
    {
        this.Min = minimum;
        this.Max = maximum
    }
}

export class MinMaxHandler
{

    public static extend(M: MinMax, factor: number): MinMax
    {
        if (isNaN(M.Min)) return M;
        let delta: number = M.Max - M.Min;
        return new MinMax(M.Min - (delta * (factor - 1)) / 2, M.Max + (delta * (factor - 1)) / 2);
    }

    public static DefaultValue(value1?: number, value2?: number): MinMax
    {
        if (typeof value2 === "undefined")
        {
            if (typeof value1 === "undefined") return new MinMax(Number.NaN, Number.NaN);
            return new MinMax(value1, value1);
        }

        if (typeof value1 === "undefined") return new MinMax(value2, value2);
        if (value2 < value1) throw new RangeError("MinMax invalid parameters (" + value1.toString() + ">" + value2.toString());
        return new MinMax(value1, value2);

    }

    public static isDefined(v: MinMax): boolean
    {
        return !isNaN(v.Min);

    }

    public static Combine(M1: MinMax, M2: MinMax): MinMax
    {
        if (isNaN(M1.Min)) return new MinMax(M2.Min, M2.Max);
        if (isNaN(M2.Min)) return new MinMax(M1.Min, M1.Max);
        let res = new MinMax(M2.Min, M2.Max);
        if (M1.Min < res.Min) res.Min = M1.Min;
        if (M1.Max < res.Min) res.Min = M1.Max;
        if (M1.Min > res.Max) res.Max = M1.Min;
        if (M1.Max > res.Max) res.Max = M1.Max;
        return res;
    }

    public static CombineWithNumber(M1: MinMax, value: number): MinMax
    {
        if (isNaN(M1.Min)) return new MinMax(value, value);
        if (value < M1.Min) return new MinMax(value, M1.Max);
        if (value > M1.Max) return new MinMax(M1.Min, value);
        return new MinMax(M1.Min, M1.Max);
    }

}

export class DataSegment
{
    public static readonly SegmentGranularity: number = 1000;
    public data: (pointXY | null)[] = [];
    public count: number = 0;

    public static ArrayCopy(sourceArray: Array<pointXY | null>, sourceIndex: number, destinationArray: Array<pointXY | null>, destinationIndex: number, length: number): void
    {   // FIXME : there is probably a much smarter/faster way to do this
        for (let i = 0; i < length; i++)
        {
            destinationArray[destinationIndex + i] = (<pointXY>sourceArray[sourceIndex + i]).clone();

        }
    }

    constructor(p: any)
    {
        if (p instanceof Array)
        {
            this.data = new Array(p.length)
            DataSegment.ArrayCopy(p, 0, this.data, 0, p.length);
            this.count = p.length;
        }
        else if (p instanceof pointXY)
        {/*
       this.data = new Array();
       this.data.push(p);
       this.count =1;
       while (this.data.length <  DataSegment.SegmentGranularity) { this.data.push(new pointXY()); }
       */
            this.data = new Array(DataSegment.SegmentGranularity);
            this.data[0] = p;
            this.count = 1;

        }
        else
        {
            throw new Error("invalid constructor paramter type")
        }
    }

    public grow()
    { /* let targetCount : number = this.data.length + DataSegment.SegmentGranularity ;
      while (this.data.length<targetCount)
        this.data.push(new pointXY())
   */
        let targetCount: number = this.data.length + DataSegment.SegmentGranularity;
        while (this.data.length < targetCount)
        {
            this.data.push(null)
        }

    }

}

export class DataSerie
{

    protected parent: YGraph;

    private totalPointCount: number = 0;

    private _userData: any = null;
    public get userData(): any {return this._userData; }
    public set userData(value: any) {this._userData = value; }

    static _MaxPointsPerSeries: number = 0;
    public static get MaxPointsPerSeries(): number { return DataSerie._MaxPointsPerSeries; }
    public static set MaxPointsPerSeries(value: number) { DataSerie._MaxPointsPerSeries = value; }

    private _timeRange: MinMax;
    public get timeRange(): MinMax { return this._timeRange; }

    private _valueRange: MinMax;
    public get valueRange(): MinMax { return this._valueRange; }

    constructor(parent: YGraph)
    {
        if (parent.yAxes.length <= 0) throw new Error("Define at least one yAxis");
        this._timeRange = MinMaxHandler.DefaultValue();
        this._valueRange = MinMaxHandler.DefaultValue();
        this.parent = parent;

    }

    private _yAxisIndex: number = 0;
    public get yAxisIndex(): number { return this._yAxisIndex;}
    public set yAxisIndex(value: number)
    {
        if (value >= this.parent.yAxes.length) throw new RangeError("No such yAxis (" + value.toString() + ")");
        this._yAxisIndex = value;
        this.parent.yAxes[this._yAxisIndex].AutoShow();

    }

    private _pen: YDataRendering.YPen | null = null;
    public get pen(): YDataRendering.YPen
    {
        if (this._pen == null)
        {
            this._pen = new YDataRendering.YPen(this._color, this._thickness);
            this._pen.endCap = YDataRendering.YPen.LineCap.Round;
            this._pen.linejoin = YDataRendering.YPen.LineJoin.Round;
        }
        return this._pen;
    }

    private _legendPen: YDataRendering.YPen | null = null;
    public get legendPen(): YDataRendering.YPen
    {
        if (this._legendPen == null)
        {
            this._legendPen = new YDataRendering.YPen(this._color, this._thickness * this.parent.legendPanel.traceWidthFactor);
        }
        return this._legendPen;
    }

    public resetlegendPen(): void { this._legendPen = null; }

    private _brush: YDataRendering.YBrush | null = null;
    public get brush(): YDataRendering.YBrush
    {
        if (this._brush == null) this._brush = new YDataRendering.YSolidBrush(this._color);
        return this._brush;
    }

    private _navigatorpen: YDataRendering.YPen | null = null;
    public get navigatorpen(): YDataRendering.YPen
    {
        if (this._navigatorpen == null)
        {
            this._navigatorpen = new YDataRendering.YPen(YDataRendering.YColor.FromArgb(100, this._color.red, this._color.green, this._color.blue), 1.0);
        }
        return this._navigatorpen;
    }

    private _visible: boolean = true;  // whet not visible, series is  not shown but still intervene in Axis auto range calculus
    public get visible(): boolean { return this._visible; }
    public set visible(value: boolean)
    {
        this._visible = value;
        this.parent.redraw();
    }

    private _disabled: boolean = false;  // when series is disabled,rendering acts just like to series does not exists
    public get disabled() {return this._disabled; }
    public set disabled(value)
    {
        this._disabled = value;
        this.parent.redraw();
    }

    private _color: YDataRendering.YColor = YDataRendering.YColor.Black;
    public get color(): YDataRendering.YColor { return this._color;}
    public set color(value: YDataRendering.YColor)
    {
        this._color = value;
        this._pen = null;
        this._legendPen = null;
        this._brush = null;
        this._navigatorpen = null;
        this.parent.redraw();
    }

    private _thickness: number = 1.0;
    public get thickness(): number { return this._thickness;}
    public set thickness(value: number)
    {
        if (value < 0) throw new RangeError("Thickness must be a positive value");
        this._thickness = value;
        this._pen = null;
        this._legendPen = null;
        this.parent.redraw();
    }

    private _legend: string = "";
    public get legend(): string {return this._legend; }
    public set legend(value: string)
    {
        this._legend = value;
        this.parent.redraw();
    }

    private _unit: string = "";
    public get unit(): string {return this._unit; }
    public set unit(value: string)
    {
        this._unit = value;
        this.parent.redraw();
    }

    public segments: DataSegment[] = [];
    private AddNewSegment(p: pointXY): void
    {
        this.segments.splice(0, 0, new DataSegment(p));
    }

    public  getlastPoint():pointXY
     {
      if (this.segments.length <= 0)
       {

          return new pointXY(NaN,NaN) ;
       }
      return this.segments[this.segments.length - 1].data[this.segments[this.segments.length - 1].count - 1] as pointXY;
    }

    public AddPoint(p: pointXY): void
    {
        this._timeRange = MinMaxHandler.CombineWithNumber(this._timeRange, p.x);
        this._valueRange = MinMaxHandler.CombineWithNumber(this._valueRange, p.y);

        if (this.segments.length <= 0)
        {
            this.AddNewSegment(p);
            this.totalPointCount++;
            return;
        }
        else if (this.segments[0].count > 1)
        {
            let delta1: number = (<pointXY>this.segments[0].data[this.segments[0].count - 1]).x - (<pointXY>this.segments[0].data[this.segments[0].count - 2]).x;
            let delta2: number = p.x - (<pointXY>this.segments[0].data[this.segments[0].count - 1]).x;
            if ((delta2 > 0.1) && ((delta2 < 0) || (delta2 > 2 * delta1)))
            {
                this.AddNewSegment(p);
                return;
            }
            else if (this.segments[0].count >= this.segments[0].data.length) this.segments[0].grow();

        }

        this.segments[0].data[this.segments[0].count] = p;
        this.segments[0].count++;
        this.totalPointCount++;
        if ((DataSerie._MaxPointsPerSeries > 0) && (this.totalPointCount > DataSerie._MaxPointsPerSeries)) this.dataCleanUp();
        this.parent.adjustGlobalTimeRange(p.x);
        this.parent.redraw();
    }

    public dataCleanUp(): void
    {
        if (this.segments.length <= 0) return;
        let newLimit: number = ((DataSerie._MaxPointsPerSeries * 90) / 100);
        while (this.segments[this.segments.length - 1].count <= (this.totalPointCount - newLimit))
        {
            this.totalPointCount -= this.segments[this.segments.length - 1].count;
            this.segments.splice(this.segments.length - 1, 1);
        }

        if (this.totalPointCount > newLimit)
        {
            let delta: number = this.totalPointCount - newLimit;
            let newsize: number = this.segments[this.segments.length - 1].count - delta;
            let newdata: pointXY[] = new Array(newsize);
            DataSegment.ArrayCopy(this.segments[this.segments.length - 1].data, delta, newdata, 0, this.segments[this.segments.length - 1].count - delta);
            this.segments[this.segments.length - 1].data = newdata;
            this.segments[this.segments.length - 1].count -= delta;
            this.totalPointCount -= delta;
        }

        let tmin: number = (<pointXY>this.segments[0].data[0]).x;
        let tmax: number = (<pointXY>this.segments[0].data[0]).x;
        let ymin: number = (<pointXY>this.segments[0].data[0]).y;
        let ymax: number = (<pointXY>this.segments[0].data[0]).y;

        for (let i: number = 0; i < this.segments.length; i++)
        {
            let count: number = this.segments[i].count;
            if (tmin > (<pointXY>this.segments[i].data[0]).x) tmin = (<pointXY>this.segments[i].data[0]).x;
            if (tmax < (<pointXY>this.segments[i].data[count - 1]).x) tmax = (<pointXY>this.segments[i].data[count - 1]).x;
            for (let j: number = 0; j < count; j++)
            {
                if (ymin > (<pointXY>this.segments[i].data[j]).y) ymin = (<pointXY>this.segments[i].data[j]).y;
                if (ymax < (<pointXY>this.segments[i].data[j]).y) ymax = (<pointXY>this.segments[i].data[j]).y;
            }
        }
        this._timeRange.Min = tmin;
        this._timeRange.Max = tmax;
        this._valueRange.Min = ymin;
        this._valueRange.Max = ymax;

    }

    public InsertPoints(points: pointXY[]): void
    {
        if (points.length == 0) return;
        if (points.length == 1)
        {
            this._timeRange = MinMaxHandler.CombineWithNumber(this._timeRange, points[0].x);
            this._valueRange = MinMaxHandler.CombineWithNumber(this._valueRange, points[0].y);
            return;
        }

        let FirstStep: number = points[1].x - points[0].x;
        let LastStep: number = points[points.length - 1].x - points[points.length - 2].x;
        let InsertAtBegining: number = -1;
        let InsertAtEnd: number = -1;
        //int sz = System.Runtime.InteropServices.Marshal.SizeOf(typeof(pointXY));

        // can we merge with one already existing segment ?
        for (let i = 0; i < this.segments.length; i++)
        {
            if (this.segments[i].count > 1)
            {
                let DeltaInsertAtBegining: number = (<pointXY>this.segments[i].data[0]).x - points[points.length - 1].x;
                let DeltaInsertAtEnd: number = points[0].x - (<pointXY>this.segments[i].data[this.segments[i].count - 1]).x;
                if ((DeltaInsertAtBegining > 0) && (DeltaInsertAtBegining < 2 * FirstStep)) InsertAtBegining = i;
                if ((DeltaInsertAtEnd > 0) && (DeltaInsertAtEnd < 2 * LastStep)) InsertAtEnd = i;
            }
        }

        if (InsertAtBegining >= 0)  // insert at the beginning of segments[InsertAtBeginning]
        {
            if (this.segments[InsertAtBegining].count + points.length >= this.segments[InsertAtBegining].data.length) this.segments[InsertAtBegining].grow();
            DataSegment.ArrayCopy(this.segments[InsertAtBegining].data, 0, this.segments[InsertAtBegining].data, points.length, this.segments[InsertAtBegining].count);
            DataSegment.ArrayCopy(points, 0, this.segments[InsertAtBegining].data, 0, points.length);
            this.segments[InsertAtBegining].count += points.length;
            this.totalPointCount += points.length;
        }

        else if (InsertAtEnd >= 0) // insert at the end of segments[InsertAtEnd]
        {

            if (this.segments[InsertAtEnd].count + points.length >= this.segments[InsertAtEnd].data.length) this.segments[InsertAtEnd].grow();
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

        for (let i: number = 0; i < points.length; i++)
        {
            this._valueRange = MinMaxHandler.CombineWithNumber(this._valueRange, points[i].y);
        }

        if ((DataSerie._MaxPointsPerSeries > 0) && (this.totalPointCount > DataSerie._MaxPointsPerSeries)) this.dataCleanUp();

        this.parent.redraw();

    }

    private static CompareSegments(a: DataSegment, b: DataSegment): number

    {
        if ((<pointXY>a.data[0]).x > (<pointXY>b.data[0]).x) return -1;

        if ((<pointXY>a.data[0]).x < (<pointXY>b.data[0]).x) return 1;
        return 0;

    }

    public getData(): pointXY[]
    {
        let res: pointXY[] = [];
        this.segments.sort(DataSerie.CompareSegments);
        for (let i: number = this.segments.length - 1; i >= 0; i--)
        {
            for (let j: number = 0; j < this.segments[i].count; j++)
            {
                res.push((<pointXY>this.segments[i].data[j]));
            }
        }
        return res;
    }

    public findClosestValue(x: number, AllowInterpolation: boolean): pointXY | null
    {
        let N1: number = 0;
        let N2: number = 0;
        let Pos: number = 0;

        if (this.segments.length <= 0) return null;

        // check for best match inside segments
        for (let i: number = 0; i < this.segments.length; i++)
        {
            if ((x >= (<pointXY>this.segments[i].data[0]).x) && (x <= (<pointXY>this.segments[i].data[this.segments[i].count - 1]).x))
            {
                let data: (pointXY | null)[] = this.segments[i].data;
                N1 = 0;
                N2 = this.segments[i].count - 1;
                while (N2 - N1 > 1)
                {
                    let N: number = (N1 + N2) >> 1;
                    if ((<pointXY>data[N]).x > x) N2 = N; else N1 = N;
                }
                Pos = N1 - 1;
                if (Pos < 0) Pos = 0;
                if (!AllowInterpolation)
                {
                    if (x - (<pointXY>data[Pos]).x < (<pointXY>data[Pos + 1]).x - x) return data[Pos]; else return data[Pos + 1];
                }
                else
                {
                    Pos++;
                    if (x == (<pointXY>data[Pos]).x) return data[Pos];
                    if (x == (<pointXY>data[Pos + 1]).x) return data[Pos + 1];
                    let p: pointXY = new pointXY();
                    p.x = x;
                    p.y = (<pointXY>data[Pos]).y + ((<pointXY>data[Pos + 1]).y - (<pointXY>data[Pos]).y) * (x - (<pointXY>data[Pos]).x) / ((<pointXY>data[Pos + 1]).x - (<pointXY>data[Pos]).x);
                    return p;
                }

            }
        }

        if (AllowInterpolation) return null;

        // check for best match outside segments
        try
        {
            (<pointXY>this.segments[0].data[0]).clone();

        }
        catch (e)
        {debugger}

        let match: pointXY | null = (<pointXY>this.segments[0].data[0]);
        let delta: number = Math.abs((<pointXY>this.segments[0].data[0]).x - x);
        for (let i: number = 0; i < this.segments.length; i++)
        {
            let d1: number = Math.abs((<pointXY>this.segments[i].data[0]).x - x);
            let d2: number = Math.abs((<pointXY>this.segments[i].data[this.segments[i].count - 1]).x - x);
            if (d1 < delta)
            {
                match = this.segments[i].data[0];
                delta = d1;
            }
            if (d2 < delta)
            {
                match = this.segments[i].data[this.segments[i].count - 1];
                delta = d2;
            }
        }

        return (<pointXY>match).clone();
    }

    public clear(): void
    {
        this.segments = [];
        this._timeRange = MinMaxHandler.DefaultValue();
        this._valueRange = MinMaxHandler.DefaultValue();
        this.parent.clearCachedObjects();
        this.totalPointCount = 0;
    }

}

export class DataTracker
{

    private _parentRenderer: YDataRendering.YDataRenderer;
    private _directParent: object;
    public get directParent(): object { return this._directParent; }

    private _userData: any = null;
    public get userData(): any { return this._userData;}
    public set userData(value: any) { this._userData = value;}

    constructor(parent: YDataRendering.YDataRenderer, directParent: object)
    {
        this._directParent = directParent;
        this._parentRenderer = parent;
        this._font = new YDataRendering.YFont(parent, this, 8, null);
    }

    private _enabled: boolean = false;
    public get enabled(): boolean { return this._enabled; }
    public set enabled(value: boolean)
    {
        this._enabled = value;
        this._parentRenderer.redraw();
    }

    private _showSerieName: boolean = false;
    public get showSerieName(): boolean { return this._showSerieName; }
    public set showSerieName(value: boolean)
    {
        this._showSerieName = value;
        this._parentRenderer.redraw();
    }

    private _showTimeStamp: boolean = false;
    public get showTimeStamp(): boolean { return this._showTimeStamp; }
    public set showTimeStamp(value: boolean)
    {
        this._showTimeStamp = value;
        this._parentRenderer.redraw();
    }

    private _dataPrecisionString: string = "";
    public get dataPrecisionString(): string { return this._dataPrecisionString;}

    private _dataPrecision: DataTracker.DataPrecisionEnumItem = DataTracker.DataPrecision.PRECISION_NOLIMIT;
    public get dataPrecision(): DataTracker.DataPrecisionEnumItem {return this._dataPrecision;}
    public set dataPrecision(value: DataTracker.DataPrecisionEnumItem)
    {
        this._dataPrecision = value;
        this.compute_dataPrecisionString();
        this._parentRenderer.redraw();
    }

    private compute_dataPrecisionString(): void
    {
        if (this._dataPrecision == DataTracker.DataPrecision.PRECISION_NOLIMIT)
        {
            this._dataPrecisionString = "";
            return;
        }
        this._dataPrecisionString = "0.";
        // FIXME
        // for (let i: number = 1; i < this._dataPrecision; i++) this._dataPrecisionString += "#";
    }

    private _diameter: number = 5;
    public get diameter(): number { return this._diameter; }
    public set diameter(value: number)
    {
        if (value < 0) throw new RangeError("Diameter must be a positive value");
        this._diameter = value;
        this._parentRenderer.redraw();
    }

    private _handleLength: number = 25;
    public get handleLength(): number {return this._handleLength; }
    public set handleLength(value: number)
    {
        if (value < 0) throw new RangeError("Hanle length must be a positive value");
        this._handleLength = value;
        this._parentRenderer.redraw();
    }

    private _detectionDistance: number = 50;
    public get detectionDistance(): number {return this._detectionDistance; }
    public set detectionDistance(value: number)
    {
        if (value <= 0) throw new RangeError("Distance must be a positive value");
        this._detectionDistance = value;
    }

    private _bgColor: YDataRendering.YColor = YDataRendering.YColor.FromArgb(200, 255, 255, 255);
    public get bgColor(): YDataRendering.YColor { return this._bgColor; }
    public set bgColor(value: YDataRendering.YColor)
    {
        this._bgColor = value;
        this._bgBrush = null;
        this._parentRenderer.redraw();
    }

    private _borderColor: YDataRendering.YColor = YDataRendering.YColor.Black;
    public get borderColor(): YDataRendering.YColor { return this._borderColor; }
    public set borderColor(value: YDataRendering.YColor)
    {
        this._borderColor = value;
        this._pen = null;
        this._parentRenderer.redraw();
    }

    private _borderthickness: number = 1.0;
    public get borderthickness(): number { return this._borderthickness; }
    public set borderthickness(value: number)
    {
        if (value < 0) throw new RangeError("Thickness must be a positive value");
        this._borderthickness = value;
        this._pen = null;
        this._parentRenderer.redraw();
    }

    private _padding: number = 10;
    public get padding(): number { return this._padding; }
    public set padding(value: number)
    {
        if (value < 0) throw new RangeError("Padding must be a positive value");
        this._padding = value;
        this._parentRenderer.redraw();
    }

    private _verticalMargin: number = 10;
    public get verticalMargin(): number {return this._verticalMargin; }
    public set verticalMargin(value: number)
    {
        if (value < 0) throw new RangeError("Margin must be a positive value");
        this._verticalMargin = value;
        this._parentRenderer.redraw();
    }

    private _horizontalMargin: number = 10;
    public get horizontalMargin(): number { return this._horizontalMargin;}
    public set horizontalMargin(value: number)
    {
        if (value < 0) throw new RangeError("Margin must be a positive value");
        this._horizontalMargin = value;
        this._parentRenderer.redraw();
    }

    private _bgBrush: YDataRendering.YBrush | null = null;
    public get bgBrush(): YDataRendering.YBrush
    {
        if (this._bgBrush == null)
        {
            this._bgBrush = new YDataRendering.YSolidBrush(this._bgColor);
        }
        return this._bgBrush;
    }

    private _pen: YDataRendering.YPen | null = null;
    public get pen(): YDataRendering.YPen
    {
        if (this._pen == null) this._pen = new YDataRendering.YPen(this._borderColor, this._borderthickness, true);
        return this._pen;
    }

    private _font: YDataRendering.YFont | null = null;
    public get font(): YDataRendering.YFont | null {return this._font; }

}

export namespace DataTracker
{

    export class DataPrecisionEnumItem extends YDataRendering.YEnumItem
    {
        constructor(value: any, humanreadable: string, container?: object)
        {
            super(value, humanreadable, DataPrecision)

        }
    }

    export class DataPrecision extends YDataRendering.YEnum
    {
        public static readonly PRECISION_NOLIMIT: DataPrecisionEnumItem = new DataPrecisionEnumItem("PRECISION_NOLIMIT", "As is");
        public static readonly PRECISION_1: DataPrecisionEnumItem = new DataPrecisionEnumItem("PRECISION_1", "1");
        public static readonly PRECISION_01: DataPrecisionEnumItem = new DataPrecisionEnumItem("PRECISION_01", "0.1");
        public static readonly PRECISION_001: DataPrecisionEnumItem = new DataPrecisionEnumItem("PRECISION_001", "0.01");
        public static readonly PRECISION_0001: DataPrecisionEnumItem = new DataPrecisionEnumItem("PRECISION_0001", "0.001");
        public static readonly PRECISION_00001: DataPrecisionEnumItem = new DataPrecisionEnumItem("PRECISION_00001", "0.0001");
        public static readonly PRECISION_000001: DataPrecisionEnumItem = new DataPrecisionEnumItem("PRECISION_000001", "0.00001");
        public static readonly PRECISION_0000001: DataPrecisionEnumItem = new DataPrecisionEnumItem("PRECISION_0000001", "0.000001");
        public static readonly PRECISION_00000001: DataPrecisionEnumItem = new DataPrecisionEnumItem("PRECISION_00000001", "0.0000001");
        public static readonly PRECISION_000000001: DataPrecisionEnumItem = new DataPrecisionEnumItem("PRECISION_000000001", "0.00000001");
        public static readonly PRECISION_0000000001: DataPrecisionEnumItem = new DataPrecisionEnumItem("PRECISION_0000000001", "0.000000001");
    }

}

export class LegendPanel
{
    private _parentRenderer: YDataRendering.YDataRenderer;

    private _directParent: object;
    public get directParent(): object { return this._directParent; }

    private _userData: any = null;
    public get userData(): any { return this._userData;}
    public set userData(value: any) { this._userData = value;}

    protected _traceWidth: number = 1.0;
    public get traceWidthFactor(): number { return this._traceWidth;}
    public set traceWidthFactor(value: number)
    {
        if (value <= 0) throw new RangeError("This has to be a strictly positive value");

        this._traceWidth = value;
        this._parentRenderer.resetlegendPens();
        this._parentRenderer.redraw();
    }

    constructor(parent: YDataRendering.YDataRenderer, directParent: object)
    {
        this._directParent = directParent;
        this._parentRenderer = parent;
        this._font = new YDataRendering.YFont(parent, this, 8, null);
    }

    private _enabled: boolean = false;
    public get enabled(): boolean { return this._enabled; }
    public set enabled(value: boolean)
    {
        this._enabled = value;
        this._parentRenderer.redraw();
    }

    private _position: LegendPanel.PositionEnumItem = LegendPanel.Position.BOTTOM;
    public get position(): LegendPanel.PositionEnumItem {return this._position;}
    public set position(value: LegendPanel.PositionEnumItem)
    {
        this._position = value;
        this._parentRenderer.redraw();
    }

    private _overlap: boolean = false;
    public get overlap(): boolean { return this._overlap;}
    public set overlap(value: boolean)
    {
        this._overlap = value;
        this._parentRenderer.redraw();
    }

    private _bgColor: YDataRendering.YColor = YDataRendering.YColor.FromArgb(200, 255, 255, 255);
    public get bgColor(): YDataRendering.YColor { return this._bgColor; }
    public set bgColor(value: YDataRendering.YColor)
    {
        this._bgColor = value;
        this._bgBrush = null;
        this._parentRenderer.redraw();
    }

    private _borderColor: YDataRendering.YColor = YDataRendering.YColor.Black;
    public get borderColor(): YDataRendering.YColor { return this._borderColor; }
    public set borderColor(value: YDataRendering.YColor)
    {
        this._borderColor = value;
        this._pen = null;
        this._parentRenderer.redraw();
    }

    private _borderthickness: number = 1.0;
    public get borderthickness(): number { return this._borderthickness; }
    public set borderthickness(value: number)
    {
        if (value < 0) throw new RangeError("Thickness must be a positive value");
        this._borderthickness = value;
        this._pen = null;
        this._parentRenderer.redraw();
    }
    private _padding: number = 10;
    public get padding(): number { return this._padding; }
    public set padding(value: number)
    {
        if (value < 0) throw new RangeError("Padding must be a positive value");
        this._padding = value;
        this._parentRenderer.redraw();
    }

    private _verticalMargin: number = 10;
    public get verticalMargin(): number {return this._verticalMargin; }
    public set verticalMargin(value: number)
    {
        if (value < 0) throw new RangeError("Margin must be a positive value");
        this._verticalMargin = value;
        this._parentRenderer.redraw();
    }

    private _horizontalMargin: number = 10;
    public get horizontalMargin(): number { return this._horizontalMargin;}
    public set horizontalMargin(value: number)
    {
        if (value < 0) throw new RangeError("Margin must be a positive value");
        this._horizontalMargin = value;
        this._parentRenderer.redraw();
    }

    private _bgBrush: YDataRendering.YBrush | null = null;
    public get bgBrush(): YDataRendering.YBrush
    {
        if (this._bgBrush == null)
        {
            this._bgBrush = new YDataRendering.YSolidBrush(this._bgColor);
        }
        return this._bgBrush;
    }

    private _pen: YDataRendering.YPen | null = null;
    public get pen(): YDataRendering.YPen
    {
        if (this._pen == null) this._pen = new YDataRendering.YPen(this._borderColor, this._borderthickness, true);
        return this._pen;
    }

    private _font: YDataRendering.YFont | null = null;
    public get font(): YDataRendering.YFont | null {return this._font; }
}

export namespace LegendPanel
{

    export class PositionEnumItem extends YDataRendering.YEnumItem
    {
        constructor(value: any, humanreadable: string, container?: object)
        {
            super(value, humanreadable, Position)

        }
    }

    export class Position extends YDataRendering.YEnum
    {
        public static readonly LEFT: PositionEnumItem = new PositionEnumItem("LEFT", "Left");
        public static readonly TOPLEFT: PositionEnumItem = new PositionEnumItem("TOPLEFT", "Top-Left");
        public static readonly TOP: PositionEnumItem = new PositionEnumItem("TOP", "Top");
        public static readonly TOPRIGHT: PositionEnumItem = new PositionEnumItem("TOPRIGHT", "Top-Right");
        public static readonly RIGHT: PositionEnumItem = new PositionEnumItem("RIGHT", "Right");
        public static readonly BOTTOMRIGHT: PositionEnumItem = new PositionEnumItem("BOTTOMRIGHT", "Bottom-Right");
        public static readonly BOTTOM: PositionEnumItem = new PositionEnumItem("BOTTOM", "Bottom");
        public static readonly BOTTOMLEFT: PositionEnumItem = new PositionEnumItem("BOTTOMLEFT", "Bottom-Left");
    }

}

export class Navigator
{

    private _parentRenderer: YGraph;

    private _directParent: object;
    public get directParent(): object { return this._directParent; }

    private _userData: any = null;
    public get userData(): any { return this._userData;}
    public set userData(value: any) { this._userData = value;}

    private _viewport: YDataRendering.ViewPortSettings = new YDataRendering.ViewPortSettings();

    public Xrange: MinMax | null = null;

    private _showXAxisZones: boolean = true;
    public get showXAxisZones(): boolean { return this._showXAxisZones; }

    public set showXAxisZones(value: boolean) { this._showXAxisZones = value; }

    private _relativeheight: number = 10;
    public get relativeheight(): number { return this._relativeheight;}

    public set relativeheight(value)
    {
        if (value < 10) value = 10;
        if (value > 50) value = 50;
        this._relativeheight = value;
        this._parentRenderer.redraw();
    }

    constructor(parent: YGraph, directParent: object)
    {
        this._directParent = directParent;
        this._parentRenderer = parent;
        this._font = new YDataRendering.YFont(parent, this, 8, null);
    }

    private _enabled: boolean = false;
    public get enabled(): boolean { return this._enabled; }

    public set enabled(value: boolean)
    {
        this._enabled = value;

        this._parentRenderer.redraw();
    }

    private _bgColor1: YDataRendering.YColor = YDataRendering.YColor.FromArgb(255, 225, 225, 225);
    public get bgColor1() { return this._bgColor1; }

    public set bgColor1(value)
    {
        this._bgColor1 = value;
        this._bgBrush = null;
        this._parentRenderer.redraw();
    }

    private _cursorBorderColor: YDataRendering.YColor = YDataRendering.YColor.FromArgb(255, 40, 40, 40);
    public get cursorBorderColor() {return this._cursorBorderColor;}

    public set cursorBorderColor(value)
    {
        this._cursorBorderColor = value;
        this._cursorBorderPen = null;
        this._parentRenderer.redraw();
    }

    private _yAxisHandling: Navigator.YAxisHandlingEnumItem = Navigator.YAxisHandling.AUTO;
    public get yAxisHandling(): Navigator.YAxisHandlingEnumItem { return this._yAxisHandling;}
    public set yAxisHandling(value: Navigator.YAxisHandlingEnumItem)
    {
        this._yAxisHandling = value;
        this._parentRenderer.redraw();
    }

    private _bgColor2: YDataRendering.YColor = YDataRendering.YColor.FromArgb(255, 225, 225, 225);
    public get bgColor2() { return this._bgColor2; }

    public set bgColor2(value)
    {
        this._bgColor2 = value;
        this._bgBrush = null;
        this._parentRenderer.redraw();
    }

    private _cursorColor: YDataRendering.YColor = YDataRendering.YColor.FromArgb(100, 0, 255, 0);
    public get cursorColor(): YDataRendering.YColor {return this._cursorColor;}

    public set cursorColor(value: YDataRendering.YColor)
    {
        this._cursorColor = value;
        this._cursorBrush = null;
        this._parentRenderer.redraw();
    }

    private _cursorBrush: YDataRendering.YBrush | null = null;
    public get cursorBrush(): YDataRendering.YBrush
    {
        if (this._cursorBrush == null)
        {
            this._cursorBrush = new YDataRendering.YSolidBrush(this._cursorColor);
        }
        return this._cursorBrush;
    }

    private _pen: YDataRendering.YPen | null = null;
    public get pen(): YDataRendering.YPen
    {
        if (this._pen == null) this._pen = new YDataRendering.YPen(this._xAxisColor, this._xAxisThickness, true);
        return this._pen;
    }

    private _cursorBorderPen: YDataRendering.YPen | null = null;
    public get cursorBorderPen(): YDataRendering.YPen
    {
        if (this._cursorBorderPen == null) this._cursorBorderPen = new YDataRendering.YPen(this._cursorBorderColor, 1, true);
        return this._cursorBorderPen;
    }

    private _xAxisColor: YDataRendering.YColor = YDataRendering.YColor.Black;
    public get xAxisColor(): YDataRendering.YColor { return this._xAxisColor;}

    public set xAxisColor(value: YDataRendering.YColor)
    {
        this._xAxisColor = value;
        this._pen = null;
        this._parentRenderer.redraw();
    }

    private _xAxisThickness: number = 1.0;
    public get xAxisThickness(): number {return this._xAxisThickness; }

    public set xAxisThickness(value: number)
    {
        if (value < 0) throw new RangeError("Thickness must be a positive value");
        this._xAxisThickness = value;
        this._pen = null;
        this._parentRenderer.redraw();
    }

    private _borderPen: YDataRendering.YPen | null = null;
    public get borderPen()
    {
        if (this._borderPen == null) this._borderPen = new YDataRendering.YPen(this._borderColor, this._borderThickness, true);
        return this._borderPen;
    }

    private _borderColor: YDataRendering.YColor = YDataRendering.YColor.DimGray;
    public get borderColor(): YDataRendering.YColor {return this._borderColor; }

    public set borderColor(value: YDataRendering.YColor)
    {
        this._borderColor = value;
        this._borderPen = null;
        this._parentRenderer.redraw();
    }

    private _borderThickness: number = 1.0;
    public get borderThickness(): number { return this._borderThickness; }

    public set borderThickness(value: number)
    {
        if (value < 0) throw new RangeError("Thickness must be a positive value");
        this._borderThickness = value;
        this._borderPen = null;
        this._parentRenderer.redraw();
    }

    private _bgBrush: YDataRendering.YLinearGradientBrush | null = null;

    public setPosition(ParentWidth: number, ParentHeight: number, Lmargin: number, Rmargin: number, Tmargin: number, Bmargin: number): void
    {
        if ((this._viewport.Lmargin != Lmargin) || (this._viewport.Rmargin != Rmargin)
            || (this._viewport.Tmargin != Tmargin) || (this._viewport.Bmargin != Bmargin))
        {
            this._bgBrush = null;
        }
        this._viewport.Lmargin = Lmargin;
        this._viewport.Rmargin = Rmargin;
        this._viewport.Bmargin = Bmargin;
        this._viewport.Tmargin = Tmargin;
        this._viewport.Width = ParentWidth;
        this._viewport.Height = ParentHeight;
    }

    public setIRLPosition(IRLx: number, IRLy: number, xZoom: number, yZoom: number): void
    {
        this._viewport.IRLx = IRLx;
        this._viewport.IRLy = IRLy;
        this._viewport.zoomx = xZoom;
        this._viewport.zoomy = yZoom;
    }

    public startCapture(IRLStartPoint: pointXY, xAxisMin: number, xAxisMax: number): void
    {
        this._viewport.OriginalXAxisMin = xAxisMin;
        this._viewport.OriginalXAxisMax = xAxisMax;
        this._viewport.OriginalIRLx = this._viewport.IRLx;
        this._viewport.OriginalLmargin = this._viewport.Lmargin;
        this._viewport.OriginalZoomx = this._viewport.zoomx;
        this._viewport.IRLCaptureStartX = IRLStartPoint.x;
        this._viewport.Capture = true;
    }

    public get Capture(): boolean { return this._viewport.Capture; }

    public stopCapture(): void
    { this._viewport.Capture = false; }

    public get viewport(): YDataRendering.ViewPortSettings { return this._viewport; }

    public get bgBrush(): YDataRendering.YLinearGradientBrush
    {
        if (this._bgBrush == null)
        {
            this._bgBrush = new YDataRendering.YLinearGradientBrush(this._bgColor1, this._bgColor2);
        }
        return this._bgBrush;
    }

    private _font: YDataRendering.YFont | null = null;
    public get font(): YDataRendering.YFont | null { return this._font; }
}

export namespace Navigator
{/*
  export const enum  YAxisHandling
  {
    AUTO ="Automatic", INHERIT="Inherit from main view"
  }*/

    export class YAxisHandlingEnumItem extends YDataRendering.YEnumItem
    {
        constructor(value: any, humanreadable: string, container?: object)
        {
            super(value, humanreadable, YAxisHandling)

        }
    }

    export class YAxisHandling extends YDataRendering.YEnum
    {
        public static readonly AUTO: YAxisHandlingEnumItem = new YAxisHandlingEnumItem("AUTO", "Automatic");
        public static readonly INHERIT: YAxisHandlingEnumItem = new YAxisHandlingEnumItem("INHERIT", "Inherit from main view");
    }
}

export class Marker
{
    private _userData: any = null;
    public get userData(): any { return this._userData;}
    public set userData(value: any) { this._userData = value;}

    private static _round100(v: number): number { return Math.round(100 * v) / 100; }

    private _stringFormat: YDataRendering.YStringFormat | null = null;
    public get stringFormat(): YDataRendering.YStringFormat
    {
        if (this._stringFormat != null) return this._stringFormat;
        this._stringFormat = new YDataRendering.YStringFormat(YDataRendering.YStringFormat.StringFormatFlags.NoClip);
        this._stringFormat.LineAlignment = YDataRendering.YStringFormat.StringAlignment.Center;
        switch (this._textAlign)
        {
        case Marker.TextAlign.LEFT:
            this._stringFormat.Alignment = YDataRendering.YStringFormat.StringAlignment.Near;
            break;
        case Marker.TextAlign.CENTER:
            this._stringFormat.Alignment = YDataRendering.YStringFormat.StringAlignment.Center;
            break;
        case Marker.TextAlign.RIGHT:
            this._stringFormat.Alignment = YDataRendering.YStringFormat.StringAlignment.Far;
            break;
        }
        return this._stringFormat;
    }

    public _MarkerTextCallback: PatchMarkerTextCallback | null = null;
    public get PatchTextCallback(): PatchMarkerTextCallback | null { return this._MarkerTextCallback; }
    public set PatchTextCallback(callback: PatchMarkerTextCallback | null)
    { this._MarkerTextCallback = callback; }

    protected _parentRenderer: YDataRendering.YDataRenderer;

    private _directParent: object;
    public get directParent(): object { return this._directParent; }

    constructor(parent: YDataRendering.YDataRenderer, directParent: object)
    {
        this._directParent = directParent;
        this._parentRenderer = parent;
        this._font = new YDataRendering.YFont(parent, this, 8, null);
    }

    public startCapture(): void
    {
        (<YGraph>this._parentRenderer).startMarkerCapture(this);
    }

    public setCapturedPosition(position: number, axis: XAxis): void
    {
        this.enabled = true;
        this._xpositionIsRelative = (axis.timeReference == TimeConverter.TimeReference.RELATIVE) && axis.zeroTime > 0;
        this._xposition = Marker._round100(this._xpositionIsRelative ? position - axis.zeroTime : position);
        (<YGraph>this._parentRenderer).clearCachedObjects();
        this._parentRenderer.redraw();
    }

    protected _enabled: boolean = false;
    public get enabled(): boolean { return this._enabled; }
    public set enabled(value: boolean)
    {
        if (this._enabled != value)
        {
            this._enabled = value;
            this._parentRenderer.clearCachedObjects();
            this._parentRenderer.redraw();
        }
    }

    private _xposition: number = 0.0;
    public get xposition(): number {return this._xposition; }
    public set xposition(value: number)
    {
        this._xposition = Marker._round100(value);
        if (this._enabled) this._parentRenderer.redraw();
    }

    protected _xpositionIsRelative: boolean = false;
    public get timereference(): TimeConverter.TimeReference
    {return this._xpositionIsRelative ? TimeConverter.TimeReference.RELATIVE : TimeConverter.TimeReference.ABSOLUTE; }
    public set timereference(value: TimeConverter.TimeReference)
    {
        let v: boolean = value == TimeConverter.TimeReference.RELATIVE;

        if (this._xpositionIsRelative != v)
        {
            let ZeroPosition: number = (<XAxis>this._directParent).zeroTime;
            if (isNaN(ZeroPosition)) ZeroPosition = 0;
            if (v)
            {
                this._xpositionIsRelative = true;
                this._xposition -= ZeroPosition;
            }
            else
            {
                this._xpositionIsRelative = false;
                this._xposition += ZeroPosition;
            }
            this._xposition = Marker._round100(this._xposition);
            this._parentRenderer.redraw();
        }
    }

    // a special variant which also to get/set both xposition and xpositionIsRelative at the same time
    // and allow to start position capture as well.
    public get positionOnXAxis(): xAxisPosition
    { return new xAxisPosition(this._xposition, this._xpositionIsRelative); }
    public set positionOnXAxis(value: xAxisPosition)
    {
        if (value.capture)
        {
            this.startCapture();
        }
        else
        {
            let v: number = Marker._round100(value.value);
            if ((this._xpositionIsRelative != value.relative) || (this._xposition != v))
            {
                this._xposition = v;
                this._xpositionIsRelative = value.relative;
                if (this._enabled) this._parentRenderer.redraw();
            }
        }
    }

    private _yposition: number = 92.0;
    public get yposition(): number {return this._yposition; }
    public set yposition(value: number)
    {
        this._yposition = Math.min(100, Math.max(0, value));
        if (this._enabled) this._parentRenderer.redraw();
    }

    private _text: string = "Marker";
    public get text(): string { return this._text;}
    public set text(value: string)
    {
        this._text = value;
        this._parentRenderer.clearCachedObjects();
        if (this._enabled) this._parentRenderer.redraw();
    }

    private _textAlign: Marker.TextAlignEnumItem = Marker.TextAlign.CENTER;
    public get textAlign(): Marker.TextAlignEnumItem { return this._textAlign;}
    public set textAlign(value: Marker.TextAlignEnumItem)
    {
        this._textAlign = value;
        this._stringFormat = null;
        if (this._enabled) this._parentRenderer.redraw();
    }

    public get shortText(): string
    {
        if (this._text.length <= 20) return this._text;
        return this._text.substring(0, 18) + "..";
    }

    private _bgColor: YDataRendering.YColor = YDataRendering.YColor.FromArgb(255, 255, 255, 192);
    public get bgColor(): YDataRendering.YColor {return this._bgColor;}
    public set bgColor(value: YDataRendering.YColor)
    {
        this._bgColor = value;
        this._bgBrush = null;
        if (this._enabled) this._parentRenderer.redraw();
    }

    private _borderColor: YDataRendering.YColor = YDataRendering.YColor.DarkRed;
    public get borderColor() { return this._borderColor; }
    public set borderColor(value)
    {
        this._borderColor = value;
        this._arrowBrush = null;
        this._pen = null;
        this._navigatorpen = null;
        if (this._enabled) this._parentRenderer.redraw();
    }

    private _borderthickness: number = 1;
    public get borderthickness(): number { return this._borderthickness;}
    public set borderthickness(value: number)
    {
        if (value < 0) throw new RangeError("thickness must be a positive value");
        this._borderthickness = value;
        this._parentRenderer.clearCachedObjects();
        this._pen = null;
        if (this._enabled) this._parentRenderer.redraw();
    }

    private _arrowSize: number = 5;
    public get arrowSize(): number { return this._arrowSize; }
    public set arrowSize(value: number)
    {
        this._arrowSize = value;
        if (this._enabled) this._parentRenderer.redraw();
    }

    private _padding: number = 5;
    public get padding(): number { return this._padding;}
    public set padding(value: number)
    {
        if (value < 0) throw new RangeError("Padding must be a positive value");
        this._padding = value;
        this._parentRenderer.clearCachedObjects();
        if (this._enabled) this._parentRenderer.redraw();
    }

    private _verticalMargin: number = 5;
    public get verticalMargin(): number { return this._verticalMargin; }
    public set verticalMargin(value: number)
    {
        this._verticalMargin = value;
        if (this._enabled) this._parentRenderer.redraw();
    }

    private _horizontalMargin: number = 5;
    public get horizontalMargin() { return this._horizontalMargin; }
    public set horizontalMargin(value)
    {
        this._horizontalMargin = value;
        if (this._enabled) this._parentRenderer.redraw();
    }

    private _bgBrush: YDataRendering.YBrush | null = null;
    public get bgBrush(): YDataRendering.YBrush
    {
        if (this._bgBrush == null)
        {
            this._bgBrush = new YDataRendering.YSolidBrush(this._bgColor);
        }
        return this._bgBrush;
    }

    private _arrowBrush: YDataRendering.YBrush | null = null;
    public get arrowBrush(): YDataRendering.YBrush
    {
        if (this._arrowBrush == null)
        {
            this._arrowBrush = new YDataRendering.YSolidBrush(this._borderColor, true);
        }
        return this._arrowBrush;
    }

    private _pen: YDataRendering.YPen | null = null;
    public get pen(): YDataRendering.YPen
    {
        if (this._pen == null) this._pen = new YDataRendering.YPen(this._borderColor, this._borderthickness, true);
        return this._pen;
    }

    private _navigatorpen: YDataRendering.YPen | null = null;
    public get navigatorpen(): YDataRendering.YPen
    {
        if (this._navigatorpen == null) this._navigatorpen = new YDataRendering.YPen(this._borderColor, 1.0);
        return this._navigatorpen;
    }

    private _font: YDataRendering.YFont | null = null;
    public get font(): YDataRendering.YFont | null { return this._font; }

}

export namespace Marker
{

    /* export enum TextAlign
  {
    LEFT = "Left", CENTER = "Center", RIGHT = "Right"
  }*/

    export class TextAlignEnumItem extends YDataRendering.YEnumItem
    {
        constructor(value: any, humanreadable: string, container?: object)
        {
            super(value, humanreadable, TextAlign)

        }
    }

    export class TextAlign extends YDataRendering.YEnum
    {
        public static readonly LEFT: TextAlignEnumItem = new TextAlignEnumItem("LEFT", "Left");
        public static readonly CENTER: TextAlignEnumItem = new TextAlignEnumItem("CENTER", "Center");
        public static readonly RIGHT: TextAlignEnumItem = new TextAlignEnumItem("RIGHT", "Right");
    }

}

export class Legend
{
    protected _parentRenderer: YGraph;

    private _directParent: object;
    public get directParent(): object { return this._directParent; }

    private _userData: any = null;
    public get userData(): any { return this._userData;}
    public set userData(value: any) { this._userData = value;}

    constructor(parent: YGraph, directParent: object)
    {
        this._directParent = directParent;
        this._parentRenderer = parent;
        this._font = new YDataRendering.YFont(parent, this, 12, null);
    }

    private _title: string = "";
    public get title(): string { return this._title;}
    public set title(value: string)
    {
        this._title = value;
        this._parentRenderer.redraw();
    }

    private _font: YDataRendering.YFont | null = null;
    public get font(): YDataRendering.YFont | null { return this._font;}
}

export interface axisChangedCallBack {(source: GenericAxis): void}

export abstract class GenericAxis
{

    protected _parentRenderer: YGraph;
    private _directParent: object;
    public get directParent(): object { return this._directParent; }

    protected _zones: YDataRendering.Zone[];
    public get zones(): YDataRendering.Zone[] { return this._zones;}

    public AddZone(): YDataRendering.Zone
    {
        let z: YDataRendering.Zone = new YDataRendering.Zone(this._parentRenderer as YDataRendering.YDataRenderer, this);
        this._zones.push(z);
        return z;
    }

    private _userData: any = null;
    public get userData(): any { return this._userData;}
    public set userData(value: any) { this._userData = value;}

    protected _AxisChanged: axisChangedCallBack | null = null;
    public get AxisChanged(): axisChangedCallBack | null { return this._AxisChanged;}
    public set AxisChanged(value: axisChangedCallBack | null) {this._AxisChanged = value;}

    constructor(parent: YGraph, directParent: object)
    {
        this._zones = [];
        this._directParent = directParent;
        this._parentRenderer = parent;
        this._legend = new Legend(parent, this);
        this._font = new YDataRendering.YFont(parent as YDataRendering.YDataRenderer, this);
    }

    protected _pen: YDataRendering.YPen | null = null;
    public get pen(): YDataRendering.YPen
    {
        if (this._pen == null) this._pen = new YDataRendering.YPen(this._color, this._thickness, true);
        return this._pen;
    }

    protected _gridPen: YDataRendering.YPen | null = null;
    public get gridPen(): YDataRendering.YPen
    {
        if (this._gridPen == null) this._gridPen = new YDataRendering.YPen(this._gridColor, this._gridThickness, true);
        return this._gridPen;
    }

    protected _visible: boolean = true;
    public get visible(): boolean { return this._visible; }
    public set visible(value: boolean)
    {
        this._visible = value;
        if (!value)
        { this._AllowAutoShow = false; }
        this._parentRenderer.redraw();
    }

    protected _AllowAutoShow: boolean = false;
    public get AllowAutoShow(): boolean {return this._AllowAutoShow;}
    public set AllowAutoShow(value: boolean) { this._AllowAutoShow = value;}

    public AutoShow(): void
    {
        if (this._AllowAutoShow)
        {
            this.visible = true;
            if (this._AxisChanged != null) this._AxisChanged(this);
        }
    }

    public set_minMax(value_min: number, value_max: number): void
    {
        if (!isNaN(value_min) && !isNaN(value_max) && (value_min >= value_max))
        {
            throw new RangeError("Min (" + value_min.toString() + ") cannot be greater than max (" + value_max.toString() + ")");
        }
        this._min = value_min;
        this._max = value_max;
        this._parentRenderer.redraw();
    }

    protected _min: number = Number.NaN;
    public get min(): number { return this._min; }
    public set min(value: number)
    {
        if (!isNaN(value) && !isNaN(this._max) && !YDataRendering.YDataRenderer.minMaxCheckDisabled)
        {
            if (value >= this._max)
            {
                throw new RangeError("Min cannot be greater than max (" + this._max.toString() + ")");
            }
        }
        this._min = value;
        this._parentRenderer.redraw();
    }

    public setMinMax(min: number, max: number): void
    {
        if (min < max)
        {
            this._min = min;
            this._max = max;
            this._parentRenderer.redraw();

        }
    }

    protected _max: number = Number.NaN;
    public get max(): number {return this._max;}
    public set max(value: number)
    {
        if (!isNaN(value) && !isNaN(this._min) && !YDataRendering.YDataRenderer.minMaxCheckDisabled)
        {
            if (value <= this._min) throw new RangeError("Max cannot be less than min (" + this._min.toString() + ")");
        }
        this._max = value;
        this._parentRenderer.redraw();
    }

    protected _step: number = Number.NaN;
    public get step(): number { return this._step; }
    public set step(value: number)
    {
        if (!isNaN(value) && (value < 0)) throw new RangeError("Steps must be a strictely positive value");
        this._step = value;
        this._parentRenderer.redraw();
    }

    protected _thickness: number = 1.0;
    public get thickness(): number { return this._thickness;}
    public set thickness(value: number)
    {
        if (value < 0) throw new RangeError("Thickness must be a positive value");
        this._thickness = value;
        this._pen = null;
        this._parentRenderer.redraw();
    }

    protected _color: YDataRendering.YColor = YDataRendering.YColor.Black;
    public get color(): YDataRendering.YColor { return this._color; }
    public set color(value)
    {
        this._color = value;
        this._pen = null;
        this._parentRenderer.redraw();
    }

    protected _showGrid: boolean = false;
    public get showGrid(): boolean { return this._showGrid;}
    public set showGrid(value: boolean)
    {
        this._showGrid = value;
        this._parentRenderer.redraw();
    }

    protected _gridColor: YDataRendering.YColor = YDataRendering.YColor.FromArgb(50, 0, 0, 0);
    public get gridColor(): YDataRendering.YColor { return this._gridColor;}
    public set gridColor(value: YDataRendering.YColor)
    {
        this._gridColor = value;
        this._gridPen = null;
        this._parentRenderer.redraw();
    }

    protected _gridThickness: number = 1.0;
    public get gridThickness() {return this._gridThickness;}
    public set gridThickness(value)
    {
        if (value < 0) throw new RangeError("Thickness must be a positive value");
        this._gridThickness = value;
        this._gridPen = null;
        this._parentRenderer.redraw();
    }

    private _font: YDataRendering.YFont | null = null;
    public get font(): YDataRendering.YFont | null { return this._font; }

    private _legend: Legend;
    public get legend(): Legend {return this._legend; }

}

export class StartStopStep
{
    public dataMin: number = 0;
    public dataMax: number = 0;
    public absMin: number = 0;
    public absMax: number = 0;
    public step: number = 0;
    public start: number = 0;
    public stop: number = 0;
    public precision: number = 0;

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

export class xAxisPosition
{

    public static DTdisplayformat: string = "DD/MM/YY hh:mm:ss.ff";
    public static TSdisplayformat: string = "dd.hh:mm:ss.ff";

    private _isRelative: boolean = false;
    public get relative(): boolean {return this._isRelative;}
    public set relative(value: boolean) {this._isRelative = value;}

    private _value: number = 0;
    public get value(): number {return this._value;}
    public set value(value: number) {this._value = value;}

    public constructor(v: number, rel: boolean, capture?: boolean)
    {
        this._isRelative = rel;
        this._value = v;
        this._capture = typeof (capture) == "undefined" ? false : capture;
    }

    public clone()
    {
        return new xAxisPosition(this._value, this._isRelative, this._capture)
    }

    public toString(): string
    {
        if (this._isRelative)
        {
            return TimeConverter.secTimeSpanToString(this._value, 0);

        }
        else
        {  // will need a fix to use this.DTdisplayformat
            let date = TimeConverter.FromUnixTime(this._value);
            let res: string = date.getFullYear().toString() + "-" + (date.getMonth() + 1).toString() + "-" + date.getDate().toString()
                + " " + date.getHours().toString() + ":";

            let st: string = date.getMinutes().toString();
            if (st.length <= 1) st = "0" + st;
            res = res + st + ":"
            let s: number = date.getSeconds()
            let ms: number = date.getMilliseconds();
            s = s + ms / 1000;
            if (s < 10) res = res + "0";
            if (ms == 0)
            {
                res = res + s.toString();
            }
            else
            {
                res = res + s.toFixed(3);
            }

            return res;
        }
    }

    public TryParse(str: string): TimeConverterParseResult
    {

        if (this._isRelative) return TimeConverter.tryParseStringToSecTimeSpan(str);
        return TimeConverter.tryParseStringToAbsDateTime(str);

    }

// a weird way to start the marker position capture
// through a property change, as Yocto-Visualization
// editor can only change properties.
    private _capture: boolean = false;
    public get capture(): boolean {return this._capture;}
    public set capture(value: boolean) { this._capture = value;}

}

class YNumberFormatInfo
{
    public NumberDecimalSeparator: string = ".";

}

export class YAxis extends GenericAxis
{

    private nfi: YNumberFormatInfo;
    public startStopStep: StartStopStep;

    constructor(parent: YGraph, directParent: object, index: number)
    {
        super(parent, directParent)
        this._index = index;
        this.nfi = new YNumberFormatInfo();
        this.nfi.NumberDecimalSeparator = ".";
        this.startStopStep = new StartStopStep();
        this.startStopStep.start = 0;
        this.startStopStep.stop = 1;
        this.startStopStep.step = .1;

    }
    private _index: number = 0;
    public get index(): number {return this._index; }

    public lockMinMax(): void
    {
        this._min = this.startStopStep.absMin;
        this._max = this.startStopStep.absMax;
        this._parentRenderer.redraw();
    }

    public unlockMinMax(): void
    {
        this._min = Number.NaN;
        this._max = Number.NaN;
        this._parentRenderer.redraw();
    }

    private _highlightZero: boolean = false;
    public get highlightZero(): boolean {return this._highlightZero;}
    public set highlightZero(value: boolean)
    {
        this._highlightZero = value;
        this._parentRenderer.redraw();
    }

    private _position: YAxis.HrzPositionEnumItem = YAxis.HrzPosition.LEFT;
    public get position(): YAxis.HrzPositionEnumItem {return this._position;}
    public set position(value: YAxis.HrzPositionEnumItem)
    {
        this._position = value;
        this._parentRenderer.redraw();
    }

    public innerWidth: number = 0;   // public, really?
    public zoom: number = 0;
    public IRLy: number = 0;

    public computeStartAndStep(M: MinMax): StartStopStep
    {
        let res: StartStopStep = new StartStopStep();
        let min: number = this.min;
        let max: number = this.max;
        res.step = this.step;
        res.precision = 0;

        if (!MinMaxHandler.isDefined(M))
        {
            M = MinMaxHandler.DefaultValue();
            M.Min = 0;
            M.Max = 100.0;
        }
        if (isNaN(min)) min = M.Min;
        if (isNaN(max)) max = M.Max;

        res.absMax = max;
        res.absMin = min;

        if (min == max)
        {
            min -= 0.5;
            max += 0.5;
        }
        if (min != 0) min -= (max - min) * 0.025;
        if (max != 0) max += (max - min) * 0.025;

        res.start = min;
        res.stop = max;
        res.dataMin = min;
        res.dataMax = max;

        let Delta: number = max - min;

        if (isNaN(res.step))
        {
            let MagnitudePwr: number = Math.log10(Delta);
            if ((MagnitudePwr - Math.floor(MagnitudePwr)) != 0) MagnitudePwr = Math.floor(MagnitudePwr) + 1;

            res.precision = (MagnitudePwr - 1) >> 0;
            let Magnitude: number = Math.pow(10, res.precision);

            let C: number = Delta / Magnitude;

            if (C <= 2)
            {
                res.step = (Magnitude / 5);
                res.precision--;
            }

            else if (C <= 5)
            {
                res.step = (Magnitude / 2);
                res.precision--;
            }
            else
            {
                res.step = (Magnitude);
            }

            if (isNaN(this.min))
            {
                let c: number = min / res.step;
                if (c - Math.floor(c) != 0) c = (c > 0) ? Math.floor(c) + 1 : Math.floor(c) - 1;
                res.start = res.step * c;

                //     if ((M.Min < 0) && (M.Min - (int)M.Min != 0)) res.start -= res.step;

            }
        }
        else
        {
            let v: string = res.step.toString();
            let p: number = v.indexOf('.');
            if (p >= 0)
            {
                res.precision = -(v.length - p - 1);
            }
            else
            {
                res.precision = 0;
            }

        }
        this.startStopStep = res;
        return res;
    }
}

export namespace YAxis
{

    // export enum HrzPosition { LEFT = 'Left', RIGHT = 'Right' }
    //
    export class HrzPositionEnumItem extends YDataRendering.YEnumItem
    {
        constructor(value: any, humanreadable: string, container?: object)
        {
            super(value, humanreadable, HrzPosition)

        }
    }

    export class HrzPosition extends YDataRendering.YEnum
    {
        public static readonly LEFT: HrzPositionEnumItem = new HrzPositionEnumItem("LEFT", "Left");
        public static readonly RIGHT: HrzPositionEnumItem = new HrzPositionEnumItem("RIGHT", "Right");
    }
}

export class XAxis extends GenericAxis
{

    public static readonly FORMATAUTO: number = 0;

    private _parentGraph: YGraph;
    private _position: XAxis.VrtPositionEnumItem = XAxis.VrtPosition.BOTTOM;
    public get position(): XAxis.VrtPositionEnumItem { return this._position;}
    public set position(value: XAxis.VrtPositionEnumItem)
    {
        this._position = value;
        this._parentRenderer.redraw();
    }

    private _markers: Marker[] = [];
    public get markers(): Marker[] { return this._markers;}

    public AddMarker(): Marker
    {
        let m: Marker = new Marker(this._parentGraph, this);
        this._markers.push(m);
        this._parentGraph.clearCachedObjects();
        this._parentGraph.redraw();
        return m;
    }

    private _initialZoom: number = 300;
    public get initialZoom(): number { return this._initialZoom; }
    public set initialZoom(value: number)
    {
        if (value <= 0) throw new RangeError("Zoom must be a positive value");
        this._initialZoom = value;
        this.min= this.min  - (this._initialZoom * this._initialOffset / 100);
        this.max = this.min + this.initialZoom;
        this._parentRenderer.redraw();
    }


    private _initialOffset: number = 0;
    public get initialOffset(): number { return this._initialOffset; }
    public set initialOffset(value: number)
    {
        this._initialOffset = value;
        let p : pointXY  = this._parentGraph.getMostRecentPoint();
        if (isNaN(p.x))
        {
            this._min = this._min - (this._initialZoom * this._initialOffset / 100);
            this._max = this._min + this._initialZoom; this._parentRenderer.redraw();
        }
        else
        {
            let zoom : number = this._max - this._min;
            this._min = p.x - (zoom * this._initialOffset / 100);
            this._max = this._min + zoom;
        }
        this._parentRenderer.redraw();
    }

    private _format: number = XAxis.FORMATAUTO;
    public get labelFormat(): number {return this._format;}
    public set labelFormat(value: number)
    {

        this._format = value;
        this._parentRenderer.redraw();
    }

    constructor(parent: YGraph, directParent: object)
    {
        super(parent, directParent)
        this._parentGraph = parent;
        this._markers = [];
        this.min = TimeConverter.ToUnixTime(TimeConverter.UTCNow());
        this.max = this.min + this.initialZoom;
        this.step = 30;
    }

    protected _timeReference: TimeConverter.TimeReferenceEnumItem = TimeConverter.TimeReference.ABSOLUTE;
    public get timeReference(): TimeConverter.TimeReferenceEnumItem {return this._timeReference;}
    public set timeReference(value: TimeConverter.TimeReferenceEnumItem)
    {
        this._timeReference = value;
        this._parentRenderer.redraw();
    }

    // in case of relative time reference : position of the Zero
    protected _zeroTime: number = 0;
    public get zeroTime(): number {return this._zeroTime;}
    public set zeroTime(value: number) {this._zeroTime = value; }

    //  Max timestamp- Min timestamp of all series values
    protected _fullSize: number = 0;
    public get fullSize(): number {return this._fullSize;}
    public set fullSize(value: number) {this._fullSize = value;}

    public bestFormat(dataTimedelta: number, viewportTimedelta: number): TimeResolution
    {
        return TimeConverter.BestTimeformat(dataTimedelta, viewportTimedelta, this._timeReference);
    }

    public innerHeight: number = 0;

    private _overflowHandling: XAxis.OverflowHandlingEnumItem = XAxis.OverflowHandling.DONOTHING;
    public get overflowHandling(): XAxis.OverflowHandlingEnumItem {return this._overflowHandling;}
    public set overflowHandling(value: XAxis.OverflowHandlingEnumItem) {this._overflowHandling = value;}

}

export namespace XAxis
{
    // export enum VrtPosition {TOP ="Top", BOTTOM = 'Bottom' }
    export class VrtPositionEnumItem extends YDataRendering.YEnumItem
    {
        constructor(value: any, humanreadable: string, container?: object)
        {
            super(value, humanreadable, VrtPosition)

        }
    }

    export class VrtPosition extends YDataRendering.YEnum
    {
        public static readonly TOP: VrtPositionEnumItem = new VrtPositionEnumItem("TOP", "Top");
        public static readonly BOTTOM: VrtPositionEnumItem = new VrtPositionEnumItem("BOTTOM", "Bottom");
    }

    export class OverflowHandlingEnumItem extends YDataRendering.YEnumItem
    {
        constructor(value: any, humanreadable: string, container?: object)
        {
            super(value, humanreadable, OverflowHandling)

        }
    }

    export class OverflowHandling extends YDataRendering.YEnum
    {
        public static readonly DONOTHING: OverflowHandlingEnumItem = new OverflowHandlingEnumItem("DONOTHING", "Do nothing");
        public static readonly SCROLL: OverflowHandlingEnumItem = new OverflowHandlingEnumItem("SCROLL", "Scroll contents");
        public static readonly CONTRACT: OverflowHandlingEnumItem = new OverflowHandlingEnumItem("CONTRACT", "Squeeze contents");
    }

}

export class DataPanel extends YDataRendering.GenericPanel
{

    constructor(parent: YDataRendering.YDataRenderer, directParent: object)
    { super(parent, directParent); }
    private _panelHrzAlign: DataPanel.HorizontalAlign = DataPanel.HorizontalAlign.CENTERED;
    public get panelHrzAlign(): DataPanel.HorizontalAlign {return this._panelHrzAlign;}
    public set panelHrzAlign(value: DataPanel.HorizontalAlign)
    {
        this._panelHrzAlign = value;
        if (this._enabled) this._parentRenderer.redraw();
    }

    private _panelVrtAlign: DataPanel.VerticalAlignEnumItem = DataPanel.VerticalAlign.CENTERED;
    public get panelVrtAlign(): DataPanel.VerticalAlignEnumItem {return this._panelVrtAlign; }
    public set panelVrtAlign(value: DataPanel.VerticalAlignEnumItem)
    {
        this._panelVrtAlign = value;
        if (this._enabled) this._parentRenderer.redraw();
    }

    private _horizontalPosition: DataPanel.HorizontalPositionEnumItem = DataPanel.HorizontalPosition.ABSOLUTEX;
    public get horizontalPosition(): DataPanel.HorizontalPositionEnumItem {return this._horizontalPosition;}
    public set horizontalPosition(value: DataPanel.HorizontalPositionEnumItem)
    {
        this._horizontalPosition = value;
        if (this._enabled) this._parentRenderer.redraw();
    }

    private _verticalPosition: DataPanel.VerticalPositionEnumItem = DataPanel.VerticalPosition.ABSOLUTEY;
    public get verticalPosition(): DataPanel.VerticalPositionEnumItem {return this._verticalPosition;}
    public set verticalPosition(value: DataPanel.VerticalPositionEnumItem)
    {
        this._verticalPosition = value;
        if (this._enabled) this._parentRenderer.redraw();
    }

    private _AbsoluteXposition: number = 0;
    public get AbsoluteXposition(): number {return this._AbsoluteXposition;}
    public set AbsoluteXposition(value: number)
    {
        this._AbsoluteXposition = value;
        if (this._enabled) this._parentRenderer.redraw();
    }

    private _AbsoluteYposition: number = 0;
    public get AbsoluteYposition(): number {return this._AbsoluteYposition;}
    public set AbsoluteYposition(value: number)
    {
        this._AbsoluteYposition = value;
        if (this._enabled) this._parentRenderer.redraw();
    }

    private _YScaleIndex: number = 0;
    public get yScaleIndex(): number {return this._YScaleIndex;}
    public set yScaleIndex(value: number)
    {
        this._YScaleIndex = value;
        if (this._enabled) this._parentRenderer.redraw();
    }

}

export namespace DataPanel
{

    export class HorizontalAlignEnumItem extends YDataRendering.YEnumItem
    {
        constructor(value: any, humanreadable: string, container?: object)
        {
            super(value, humanreadable, HorizontalAlign)

        }
    }

    export class HorizontalAlign extends YDataRendering.YEnum
    {
        public static readonly LEFTOF: HorizontalAlignEnumItem = new HorizontalAlignEnumItem("LEFTOF", "Left");
        public static readonly CENTERED: HorizontalAlignEnumItem = new HorizontalAlignEnumItem("CENTERED", "Center");
        public static readonly RIGHTOF: HorizontalAlignEnumItem = new HorizontalAlignEnumItem("RIGHTOF", "Right");
    }

    export class VerticalAlignEnumItem extends YDataRendering.YEnumItem
    {
        constructor(value: any, humanreadable: string, container?: object)
        {
            super(value, humanreadable, VerticalAlign)

        }
    }

    // export  enum VerticalAlign  {ABOVE="Top",CENTERED="Center", BELOW="Bottom"}
    export class VerticalAlign extends YDataRendering.YEnum
    {
        public static readonly ABOVE: VerticalAlignEnumItem = new VerticalAlignEnumItem("ABOVE", "Top");
        public static readonly CENTERED: VerticalAlignEnumItem = new VerticalAlignEnumItem("CENTERED", "Center");
        public static readonly BELOW: VerticalAlignEnumItem = new VerticalAlignEnumItem("BELOW", "Bottom");
    }

    export class HorizontalPositionEnumItem extends YDataRendering.YEnumItem
    {
        constructor(value: any, humanreadable: string, container?: object)
        {
            super(value, humanreadable, HorizontalPosition)

        }
    }

    export class HorizontalPosition extends YDataRendering.YEnum
    {
        public static readonly LEFTBORDER: HorizontalPositionEnumItem = new HorizontalPositionEnumItem("LEFTBORDER", "Left border");
        public static readonly ABSOLUTEX: HorizontalPositionEnumItem = new HorizontalPositionEnumItem("ABSOLUTEX", "Absolute X position");
        public static readonly RIGHTBORDER: HorizontalPositionEnumItem = new HorizontalPositionEnumItem("RIGHTBORDER", "Right borde");
    }

    export class VerticalPositionEnumItem extends YDataRendering.YEnumItem
    {
        constructor(value: any, humanreadable: string, container?: object)
        {
            super(value, humanreadable, VerticalPosition)

        }
    }

    export class VerticalPosition extends YDataRendering.YEnum
    {
        public static readonly TOPBORDER: VerticalPositionEnumItem = new VerticalPositionEnumItem("TOPBORDER", "Top border");
        public static readonly ABSOLUTEY: VerticalPositionEnumItem = new VerticalPositionEnumItem("ABSOLUTEY", "Absolute Y position");
        public static readonly BOTTOMBORDER: VerticalPositionEnumItem = new VerticalPositionEnumItem("BOTTOMBORDER", "Bottom border");
    }
}

class YCursor
{
    constructor(pngImageData: string) {}

    public get handle(): string { return "crosshair"}

}

class YTimeSpan
{
    public static readonly TicksPerSecond = 1000;
    _value: number = 0;
    constructor(value: number) {this._value = value;}
    public toString(format: number): string
    {
        let res: string = "";
        let v: number = Math.abs(this._value / 1000);
        let dec = Math.floor(v)
        let frac: number = Math.round(1000 * (v - Math.floor(v)));

        if (format & YDate.ms1)
        {
            let ms: string = "00" + frac.toString();
            res = "." + ms.substring(ms.length - 3).substring(0, 1);
        }
        else if (format & YDate.ms01)
        {
            let ms: string = "00" + frac.toString();
            res = "." + ms.substring(ms.length - 3).substring(0, 2);
        }
        else if (format & YDate.ms001)
        {
            let ms = "00" + frac.toString();
            res = "." + ms.substring(ms.length - 3).substring(0, 3);
        }

        if (format & YDate.s)
        {
            let sec: number = dec % 60;
            let s: string = "0" + sec.toString();
            res = s.substring(s.length - 2) + res + "s";
        }
        dec = Math.floor(dec / 60);

        if (format & YDate.m)
        {
            let min: number = dec % 60;
            let s: string = "0" + min.toString();
            res = s.substring(s.length - 2) + "m" + res;
        }
        dec = Math.floor(dec / 60);

        if (format & YDate.h)
        {
            let hrs: number = dec % 24;
            let s: string = "0" + hrs.toString();
            res = s.substring(s.length - 2) + "h" + res;
        }
        dec = Math.floor(dec / 24);

        if (format & YDate.D)
        {
            let s: string = dec.toString();
            res = s.substring(s.length - 2) + "d" + res;
        }

        return res
    }

}

export interface MarkerCaptureStartedCallback {(source: Marker): void}

export interface MarkerCaptureStoppedCallback {(source: Marker | null): void}

interface MouseEventCallback {(e: MouseEvent): void}

interface TouchEventCallback {(e: TouchEvent): void}

interface WheelEventCallback {(e: WheelEvent): void}

interface KeyboardEventCallback {(e: KeyboardEvent): void}

export class YGraph extends YDataRendering.YDataRenderer
{

    private _xAxis: XAxis;
    private _yAxes: YAxis[];
    private _series: DataSerie[];

    private _markerCaptureStartedCallback: MarkerCaptureStartedCallback | null = null;
    private _markerCaptureStoppedCallback: MarkerCaptureStoppedCallback | null = null;

    private static _defaultVerticalDragZoomEnabled: boolean = false;

    private lastPointCount: number = -1;
    private lastTopMargin: number = -1;
    private lastBottomMargin: number = -1;

    private navigatorCache: HTMLCanvasElement | null = null;
    private markerCapture: Marker | null = null;
    static captureCursor: YCursor | null = null;

    private _legendPanel: LegendPanel;
    public get legendPanel() {return this._legendPanel;}

    private _dataTracker: DataTracker;
    public get dataTracker() { return this._dataTracker;}

    private _borderPen: YDataRendering.YPen | null = null;

    private _borderColor: YDataRendering.YColor = YDataRendering.YColor.LightGray;
    public get borderColor(): YDataRendering.YColor {return this._borderColor; }
    public set borderColor(value: YDataRendering.YColor)
    {
        this._borderColor = value;
        this._borderPen = null;
        this.redraw();
    }

    private _borderThickness: number = 1.0;
    public get borderThickness(): number {return this._borderThickness;}
    public set borderThickness(value: number)
    {
        if (value < 0) throw new RangeError("thickness must be a positive value");
        this._borderThickness = value;
        this._borderPen = null;
        this.redraw();
    }

    private _touchStartfct: TouchEventCallback | null = null;
    private _touchMovefct: TouchEventCallback | null = null;
    private _touchEndfct: TouchEventCallback | null = null;
    private _mouseDownfct: MouseEventCallback | null = null;
    private _mouseMovefct: MouseEventCallback | null = null;
    private _mouseWheelfct: WheelEventCallback | null = null;
    private _mouseKeyDownfct: KeyboardEventCallback | null = null;

    public static get verticalDragZoomEnabled(): boolean {return YGraph._defaultVerticalDragZoomEnabled}
    public static set verticalDragZoomEnabled(value: boolean) { YGraph._defaultVerticalDragZoomEnabled = value}

    private static createCaptureCursor(): void
    {
        if (YGraph.captureCursor != null) return;

        // mouse cursor graphics stored  in a base64 encoded PNG
        // this is just a way to keep the source code monolithic
        // no separate ressources file
        let base64png: string =
            "iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAALHRFWHRDcmVhdGlvbi"
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

        try
        {
            YGraph.captureCursor = new YCursor(atob(base64png));

        }
        catch (Exception)
        {
            console.log("Cannot create custom cursor");

        }

    }

    private mainViewPort: YDataRendering.ViewPortSettings = new YDataRendering.ViewPortSettings();

    protected _dataPanels: DataPanel[];
    public get dataPanels() {return this._dataPanels;}

    public addDataPanel(): DataPanel
    {
        let p: DataPanel = new DataPanel(this, this);
        this._dataPanels.push(p);
        return p;

    }

    public setMarkerCaptureCallbacks(start: MarkerCaptureStartedCallback, stop: MarkerCaptureStoppedCallback): void
    {
        this._markerCaptureStartedCallback = start;
        this._markerCaptureStoppedCallback = stop;
    }

    public startMarkerCapture(m: Marker): void
    {
        if (this._markerCaptureStartedCallback != null) this._markerCaptureStartedCallback(m);
        this.markerCapture = m;
        this.UIContainer.focus();
    }

    constructor(ChartContainer: HTMLCanvasElement, logFunction: YDataRendering.logFct)
    {
        super(ChartContainer, logFunction);
        YGraph.createCaptureCursor();

        this._xAxis = new XAxis(this, this);
        this._yAxes = [];
        this._series = [];
        this._dataPanels = [];
        this._navigator = new Navigator(this, this);
        this._legendPanel = new LegendPanel(this, this);
        this._dataTracker = new DataTracker(this, this);

        this._touchStartfct = (e: TouchEvent) => {this.TouchStart(this.UIContainer, e)};
        this._touchMovefct = (e: TouchEvent) => {this.TouchMove(this.UIContainer, e)};
        this._touchEndfct = (e: TouchEvent) => {this.TouchEnd(this.UIContainer, e)};
        this._mouseDownfct = (e: MouseEvent) => {this.MouseDown(this.UIContainer, e)};
        this._mouseMovefct = (e: MouseEvent) => {this.MouseMove(this.UIContainer, e)};
        this._mouseWheelfct = (e: WheelEvent) => {this.mouseWheelEvent(this.UIContainer, e)};
        this._mouseKeyDownfct = (e: KeyboardEvent) => {this.KeyDown(this.UIContainer, e)};

        this.UIContainer.addEventListener("touchstart", this._touchStartfct);
        this.UIContainer.addEventListener("touchmove", this._touchMovefct);
        this.UIContainer.addEventListener("touchend", this._touchEndfct);
        this.UIContainer.addEventListener("mousedown", this._mouseDownfct);
        this.UIContainer.addEventListener("mousemove", this._mouseMovefct);
        this.UIContainer.addEventListener("wheel", this._mouseWheelfct);
        this.UIContainer.addEventListener("keydown", this._mouseKeyDownfct);

        this._timeRange = MinMaxHandler.DefaultValue();
        let originalContainerWidth: number = ChartContainer.width;
        let originalContainerHeight: number = ChartContainer.height;
        let originalFormWidth: number = ChartContainer.width;
        let originalFormHeight: number = ChartContainer.height;

    }

    public destroy()
    {
        if (this._touchStartfct != null) this.UIContainer.removeEventListener("touchstart", this._touchStartfct);
        if (this._touchMovefct != null) this.UIContainer.removeEventListener("touchstart", this._touchMovefct);
        if (this._touchEndfct != null) this.UIContainer.removeEventListener("touchstart", this._touchEndfct);
        if (this._mouseDownfct != null) this.UIContainer.removeEventListener("mousedown", this._mouseDownfct);
        if (this._mouseMovefct != null) this.UIContainer.removeEventListener("mousemove", this._mouseMovefct);
        if (this._mouseWheelfct != null) this.UIContainer.removeEventListener("wheel", this._mouseWheelfct);
        if (this._mouseKeyDownfct != null) this.UIContainer.removeEventListener("keydown", this._mouseKeyDownfct);
        super.destroy();
        Object.entries(this).forEach((pair: string[]) => {Reflect.set(this, pair[0], null);}); // sets all internal variables to NULL

    }

    public getMostRecentPoint(): pointXY
    {
        let res: pointXY = new pointXY(NaN, NaN);

        for (let i: number = 0; i < this._series.length; i++)
            if (!this.series[i].disabled)
            {
                let p: pointXY = this.series[i].getlastPoint();
                if (!isNaN(p.x))
                {
                    if (isNaN(res.x)) res = p;
                    else if (p.x > res.x) res = p;

                }
            }

        return res;

    }


    private _timeRange: MinMax | null = null;

    public adjustGlobalTimeRange(x: number): void
    {
        let max: number = (<MinMax>this._timeRange).Max;
        this._timeRange = MinMaxHandler.CombineWithNumber(<MinMax>this._timeRange, x);
        if (isNaN(max)) return;
        let ofset: number = x - max;
        if (ofset > 0)
        {
            switch (this._xAxis.overflowHandling)
            {
            case XAxis.OverflowHandling.SCROLL:
                if (max > this._xAxis.min + ((this._xAxis.max - this._xAxis.min) * 0.85) && (max <= this._xAxis.max))
                {
                    this.DisableRedraw();
                    this._xAxis.set_minMax(this._xAxis.min + ofset, this._xAxis.max + ofset);
                    this.AllowRedraw();
                }
                break;
            case XAxis.OverflowHandling.CONTRACT:
                if (max > this._xAxis.min + ((this._xAxis.max - this._xAxis.min) * 0.95) && (max <= this._xAxis.max))
                {
                    this.DisableRedraw();
                    this._xAxis.max += ofset;
                    this.AllowRedraw();
                }
                break;
            }
        }
    }

    private _bgBrush: YDataRendering.YLinearGradientBrush | null = null;
    public _navigator: Navigator;

    private _bgColor1: YDataRendering.YColor = YDataRendering.YColor.FromArgb(255, 200, 200, 200);
    public get bgColor1(): YDataRendering.YColor {return this._bgColor1;}
    public set bgColor1(value: YDataRendering.YColor)
    {
        this._bgColor1 = value;
        this._bgBrush = null;
        this.redraw();
    }

    private _bgColor2: YDataRendering.YColor = YDataRendering.YColor.FromArgb(255, 255, 255, 255);
    public get bgColor2(): YDataRendering.YColor {return this._bgColor2;}
    public set bgColor2(value: YDataRendering.YColor)
    {
        this._bgColor2 = value;
        this._bgBrush = null;
        this.redraw();
    }

    public get xAxis(): XAxis { return this._xAxis; }
    public get navigator(): Navigator | null { return this._navigator; }
    public get yAxes(): YAxis[] { return this._yAxes; }
    public get series(): DataSerie[] { return this._series; }

    public addYAxis(): YAxis
    {
        let s: YAxis = new YAxis(this, this, this._yAxes.length);
        this._yAxes.push(s);
        this.redraw();
        return s;
    }

    public addSerie(): DataSerie
    {
        let s: DataSerie = new DataSerie(this);
        this._series.push(s);
        this.redraw();
        return s;
    }

    public clearCachedObjects(): void
    {
        this._bgBrush = null;
        this.navigatorCache = null;

    }
    private _touchStartPinchDistance: number = -1;
    private _touchStartPinchCenter: YDataRendering.Point = new YDataRendering.Point(0, 0);
    private _touchStartPinchZoom: number = 1;
    private _touchStartPinchIRLx: number = 0;
    private _touchStartPinchRange: number = 0;
    private TouchStart(sender: HTMLCanvasElement, e: TouchEvent): void
    {

        if (e.touches.length == 1)
        {
            this.HandleMouseDown(sender, e.touches[0].pageX, e.touches[0].pageY);
        }
        else if (e.touches.length == 2)
        {
            e.preventDefault();
            this.HandleEndOfMouseCapture();
            this._touchStartPinchDistance = Math.sqrt(Math.pow(e.touches[1].pageX - e.touches[0].pageX, 2) + Math.pow(e.touches[1].pageY - e.touches[0].pageY, 2));
            this._touchStartPinchCenter = new YDataRendering.Point((e.touches[1].pageX + e.touches[0].pageX) >> 2, (e.touches[1].pageY + e.touches[0].pageY) >> 2);
            this._touchStartPinchZoom = this.mainViewPort.zoomx;
            this._touchStartPinchIRLx = this.mainViewPort.IRLx
            this._touchStartPinchRange = this._xAxis.max - this._xAxis.min
        }

    }

    private MouseDown(sender: HTMLCanvasElement, e: MouseEvent): void
    {

        if ((e.buttons == 2) && (this.markerCapture != null))
        {
            this.markerCapture = null;
            if (this._markerCaptureStoppedCallback != null) this._markerCaptureStoppedCallback(null);
        }

        if (e.buttons != 1) return;
        this.HandleMouseDown(sender, e.pageX, e.pageY);
    }

    private HandleMouseDown(sender: HTMLCanvasElement, pageX: number, pageY: number): void
    {   //uses matrix calculus to convert mouse  coord to local coord
        let p: YDataRendering.Point = this.Scr2ElmMatrix.multiplyByV(YDataRendering.Vector3.FromXYCoord(pageX, pageY)).toPoint();
        let eX: number = p.X
        let eY: number = p.Y

        if ((eX >= this.mainViewPort.Lmargin)
            && (eX <= this.mainViewPort.Width - this.mainViewPort.Rmargin)
            && (eY >= this.mainViewPort.Tmargin)
            && (eY <= this.mainViewPort.Height - this.mainViewPort.Bmargin))
        {
            if (this.markerCapture != null)
            {
                let p2: pointXY = YGraph.ViewPortPointToIRL(this.mainViewPort, new YDataRendering.Point(eX, eY));
                this.markerCapture.setCapturedPosition(p2.x, this.xAxis);
                if (this._markerCaptureStoppedCallback != null) this._markerCaptureStoppedCallback(this.markerCapture);
                this.markerCapture = null;
                return;
            }
            let p: pointXY = YGraph.ViewPortPointToIRL(this.mainViewPort, new YDataRendering.Point(eX, eY));
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
            && (eY <= this._navigator.viewport.Height - this._navigator.viewport.Bmargin))
        {
            let p: pointXY = YGraph.ViewPortPointToIRL(this._navigator.viewport, new YDataRendering.Point(eX, eY));
            let p2: pointXY = YGraph.ViewPortPointToIRL(this.mainViewPort, new YDataRendering.Point(this.mainViewPort.Lmargin, 0));
            let p3: pointXY = YGraph.ViewPortPointToIRL(this.mainViewPort, new YDataRendering.Point(this.mainViewPort.Width - this.mainViewPort.Rmargin, 0));

            if ((p.x >= p2.x) && (p.x <= p3.x))
            {

                this._navigator.startCapture(p, this._xAxis.min, this._xAxis.max);
                //  log("monitor start monitor capture  at " + _navigator.viewport.IRLCaptureStartX.ToString());
            }
            else
            {
                this.DisableRedraw();
                let min: number = p.x - (p3.x - p2.x) / 2;
                let max: number = min + (p3.x - p2.x);
                this._xAxis.set_minMax(min, max);
                this.AllowRedraw();
                //  log("Jump to " + mainViewPort.IRLx.ToString());
                this.Draw(0);
            }
        }
    }

    private TouchMove(sender: HTMLCanvasElement, e: TouchEvent): void
    {

        if (e.touches.length == 1)
        {
            e.preventDefault();
            this.HandleMouseMove(sender, e.touches[0].pageX, e.touches[0].pageY);
        }
        else if (e.touches.length == 2)
        {
            e.preventDefault();
            let newdistance: number = Math.sqrt(Math.pow(e.touches[1].pageX - e.touches[0].pageX, 2) + Math.pow(e.touches[1].pageY - e.touches[0].pageY, 2));
            let ZoomFactor: number = newdistance / this._touchStartPinchDistance
            let NextZoomX: number = this._touchStartPinchZoom * ZoomFactor;
            if ((NextZoomX > this.mainViewPort.zoomx) && (NextZoomX > 1000)) return;
            let currentRange: number = this._xAxis.max - this._xAxis.min;
            this.mainViewPort.IRLx = this._touchStartPinchIRLx + ((this._touchStartPinchCenter.X - this.mainViewPort.Lmargin) / this._touchStartPinchZoom) - ((this._touchStartPinchCenter.X - this.mainViewPort.Lmargin) / NextZoomX);
            this._xAxis.set_minMax(this.mainViewPort.IRLx, this.mainViewPort.IRLx + this._touchStartPinchRange / ZoomFactor);
            this.mainViewPort.zoomx = NextZoomX;
            this.redraw();

        }

    }

    private TouchEnd(sender: HTMLCanvasElement, e: TouchEvent): void
    {
        this.HandleEndOfMouseCapture()
    }

    private  dataTrackerRefreshtimeout : Timeout | null = null;

    private MouseMove(sender: HTMLCanvasElement, e: MouseEvent): void
    {
        if ((e.buttons != 1) && (this.mainViewPort.Capture || this._navigator.Capture)) this.HandleEndOfMouseCapture();
        this.HandleMouseMove(sender, e.pageX, e.pageY);
        if (this.dataTracker.enabled)
         {  if (this.dataTrackerRefreshtimeout!=null)  clearTimeout(this.dataTrackerRefreshtimeout);
             this.dataTrackerRefreshtimeout = setTimeout(  () =>{ this.redraw(); } , 100);

         }




    }

    private HandleEndOfMouseCapture(): void
    {
        this.mainViewPort.Capture = false;
        this._navigator.stopCapture();
        if (this._dataTracker.enabled) this.redraw();

    }

    private HandleMouseMove(sender: HTMLCanvasElement, pageX: number, pageY: number): void
    { //uses matrix calculus to convert mouse  coord to local coord
        let p: YDataRendering.Point = this.Scr2ElmMatrix.multiplyByV(YDataRendering.Vector3.FromXYCoord(pageX, pageY)).toPoint();
        let eX: number = p.X
        let eY: number = p.Y

        if (this.markerCapture != null)
        {
            if ((eX > this.mainViewPort.Lmargin) && (eX < this.mainViewPort.Width - this.mainViewPort.Rmargin)
                && (eY > this.mainViewPort.Tmargin) && (eY < this.mainViewPort.Height - this.mainViewPort.Bmargin))
            {
                if ((this.UIContainer.style.cursor != (<YCursor>YGraph.captureCursor).handle) && (this.UIContainer.style.cursor != "crosshair"))
                {
                    this.UIContainer.style.cursor = YGraph.captureCursor != null ? YGraph.captureCursor.handle : "crosshair";
                }
            }
            else if (this.UIContainer.style.cursor != "default") this.UIContainer.style.cursor = "default";
        }
        else if (this.UIContainer.style.cursor != "default") this.UIContainer.style.cursor = "default";

        if (this.mainViewPort.Capture)
        {
            let x1: number = this.mainViewPort.OriginalIRLx + (eX - this.mainViewPort.OriginalLmargin) / this.mainViewPort.OriginalZoomx;
            let deltaX: number = (x1 - this.mainViewPort.IRLCaptureStartX);
            let deltaY: number = (eY - this.mainViewPort.CaptureStartY);
            this.DisableRedraw();
            let halfAxisDelta: number = (this.mainViewPort.OriginalXAxisMax - this.mainViewPort.OriginalXAxisMin) / 2;
            let Axismiddle: number = (this.mainViewPort.OriginalXAxisMax + this.mainViewPort.OriginalXAxisMin) / 2;
            let deltaCoef: number = (YGraph._defaultVerticalDragZoomEnabled && (Math.abs(deltaY) > 10)) ? Math.pow(1.01, deltaY) : 1;
            this._xAxis.set_minMax(Axismiddle - halfAxisDelta * deltaCoef - deltaX,
                Axismiddle + halfAxisDelta * deltaCoef - deltaX);
            this.AllowRedraw();
            this.redraw();
            return;
        }
        if (this._navigator.viewport.Capture)
        {
            let x1: number = this._navigator.viewport.OriginalIRLx + (eX - this._navigator.viewport.OriginalLmargin) / this._navigator.viewport.OriginalZoomx;
            let delta: number = (x1 - this._navigator.viewport.IRLCaptureStartX);
            this.DisableRedraw();
            this._xAxis.set_minMax(this._navigator.viewport.OriginalXAxisMin + delta,
                this._navigator.viewport.OriginalXAxisMax + delta);
            this.AllowRedraw();
            this.redraw();
            return;
        }
    }

    public cross(p: pointXY)
    {}

    private static IRLPointToViewPort(viewport: YDataRendering.ViewPortSettings, p: pointXY, IRLy?: number, zoomy?: number): YDataRendering.Point
    {
        if (IRLy === undefined)
        {
            let xx: number = viewport.Lmargin + Math.round((p.x - viewport.IRLx) * viewport.zoomx);
            let yy: number = viewport.Height - viewport.Bmargin - Math.round((p.y - viewport.IRLy) * viewport.zoomy);
            return new YDataRendering.Point(xx >> 0, yy >> 0);
        }
        let xx: number = viewport.Lmargin + Math.round((p.x - viewport.IRLx) * viewport.zoomx);
        let yy: number = viewport.Height - viewport.Bmargin - Math.round((p.y - IRLy) * <number>zoomy);
        return new YDataRendering.Point(xx >> 0, yy >> 0);
    }

    private static ViewPortPointToIRL(viewport: YDataRendering.ViewPortSettings, p: YDataRendering.Point, IRLy?: number, zoomy?: number): pointXY
    {
        if (IRLy === undefined)
        {
            return new pointXY(
                viewport.IRLx + (p.X - viewport.Lmargin) / viewport.zoomx,
                viewport.IRLy + (+viewport.Height - p.Y - viewport.Bmargin) / viewport.zoomy
            );
        }
        return new pointXY(
            viewport.IRLx + (p.X - viewport.Lmargin) / viewport.zoomx,
            IRLy + (+viewport.Height - p.Y - viewport.Bmargin) / <number>zoomy);

    }

    private static FindMinMax(start: number, end: number, data: pointXY[], count: number): MinMax
    {
        let res: MinMax = MinMaxHandler.DefaultValue();

        // Do we need to consider that segment?
        if (data[0].x > end) return res; // completely out of view port full zone, abort.
        if (data[count - 1].x < start) return res; // completely out of view port full zone, abort.

        let N1: number = 0;
        let N2: number = 0;
        // find out the first visible point ;
        let First: number = 0;
        if (data[0].x < start)
        {
            N1 = 0;
            N2 = count - 1;
            while (N2 - N1 > 1)
            {
                let N: number = (N1 + N2) >> 1;
                if (data[N].x > start) N2 = N; else N1 = N;
            }
            First = N1 - 1;
            if (First < 0) First = 0;
        }
        // data clipping: find out the last visible point;
        let Last: number = count - 1;
        if (data[Last] === undefined)
        {
            debugger;
        }
        if (data[Last].x > end)
        {
            N1 = 0;
            N2 = count - 1;
            while (N2 - N1 > 1)
            {
                let N: number = (N1 + N2) >> 1;
                if (data[N].x < end) N1 = N; else N2 = N;
            }
            Last = N2 + 1;
            if (Last > count - 1) Last = count - 1;
        }
        res.Min = data[First].y;
        res.Max = data[First].y;
        for (let i: number = First + 1; i <= Last; i++)
        {
            if (data[i].y < res.Min) res.Min = data[i].y;
            if (data[i].y > res.Max) res.Max = data[i].y;
        }

        return res;
    }

    public resetlegendPens(): void
    {
        for (let i: number = 0; i < this._series.length; i++)
        {
            this._series[i].resetlegendPen();
        }
    }

    public drawLegendPanel(g: YDataRendering.YGraphics, viewPortWidth: number, viewPortHeight: number, mainViewPort: YDataRendering.ViewPortSettings): void
    {
        let verticalRatio: number = 1.25;
        if (!this._legendPanel.enabled) return;
        let legendWidths: number[] = new Array(this._series.length);
        let legendHeight: number[] = new Array(this._series.length);
        let ofsetx: number[] = new Array(this._series.length);
        let ofsety: number[] = new Array(this._series.length);

        let legends: string[] = new Array(this._series.length);
        let totalHeight: number = 0;
        let totalWidth: number = 0;
        let maxWidth: number = 0;
        let maxHeight: number = 0;
        g.TextRenderingHint = YDataRendering.YTextRenderingHint.SingleBitPerPixelGridFit;

        g.SetClip(new YDataRendering.YRectangle(0, 0, viewPortWidth, viewPortHeight));

        for (let i: number = 0; i < this._series.length; i++)
        {
            if (this._series[i].legend != "") legends[i] = this._series[i].legend; else legends[i] = "Series " + (i + 1).toString();
        }

        if ((this._legendPanel.position == LegendPanel.Position.TOP) || (this._legendPanel.position == LegendPanel.Position.BOTTOM))
        {
            let availableWidth: number = viewPortWidth - 2 * this._legendPanel.padding + this._legendPanel.borderthickness;
            if (this._legendPanel.overlap) availableWidth = availableWidth - mainViewPort.Lmargin - mainViewPort.Rmargin;

            totalHeight = 0; // 2 * _legendPanel.padding + legendPanel.borderthickness;
            let xx: number = 0;
            let yy: number = 0;

            for (let i: number = 0; i < this._series.length; i++)
            {
                if ((this._series[i].segments.length > 0) && (this._series[i].visible) && (!this._series[i].disabled))
                {
                    let ssize: YDataRendering.YSizeF = g.MeasureString(legends[i], <YDataRendering.YFont>this._legendPanel.font, 100000);
                    legendHeight[i] = (ssize.height) + 1;
                    let ww: number = (ssize.width + 20);
                    if (xx == 0) totalHeight += ssize.height;
                    if (availableWidth - xx < ww)
                    {
                        if (xx == 0)
                        {
                            ofsetx[i] = xx;
                            ofsety[i] = yy;
                            yy += ssize.height;
                            if (maxWidth < ww) maxWidth = ww;
                        }
                        else
                        {
                            yy += ssize.height;
                            ofsetx[i] = 0.0;
                            ofsety[i] = yy;
                            xx = ww;
                            totalHeight += ssize.height;
                            if (maxWidth < xx) maxWidth = xx;
                        }
                    }
                    else
                    {
                        ofsetx[i] = xx;
                        ofsety[i] = yy;
                        xx += ww;
                        if (maxWidth < xx) maxWidth = xx;
                    }
                }
            }
            if (totalWidth > availableWidth)
            { // noinspection JSUnusedAssignment
                totalWidth = availableWidth;
            }
        }
        else
        {
            let ty: number = 0;
            for (let i: number = 0; i < this._series.length; i++)
            {
                if ((this._series[i].segments.length > 0) && (this._series[i].visible) && (!this._series[i].disabled))
                {
                    let ssize: YDataRendering.YSizeF = g.MeasureString(legends[i], <YDataRendering.YFont>this._legendPanel.font, 100000);
                    legendWidths[i] = (ssize.width) + 1;
                    if (maxWidth < legendWidths[i] + 20) maxWidth = legendWidths[i] + 20;
                    legendHeight[i] = (ssize.height) + 1;
                    if (maxHeight < legendHeight[i]) maxHeight = legendHeight[i];
                    ofsetx[i] = 0;
                    ofsety[i] = ty;
                    ty += ssize.height * verticalRatio;
                    totalHeight += i == 0 ? ssize.height : ssize.height * verticalRatio;
                }
            }

        }

        let w: number = maxWidth + 2 * this._legendPanel.padding + this._legendPanel.borderthickness;
        let h: number = totalHeight + 2 * this._legendPanel.padding + this._legendPanel.borderthickness;
        let x: number = 0;
        let y: number = 0;

        switch (this._legendPanel.position)
        {
        case LegendPanel.Position.LEFT:
            x = this._legendPanel.horizontalMargin;
            if (!this._legendPanel.overlap)
            {
                mainViewPort.Lmargin += (w + 2 * this.legendPanel.horizontalMargin + this.legendPanel.borderthickness) >> 0;
                y = (viewPortHeight - h) / 2;
            }
            else
            {
                x += mainViewPort.Lmargin;
                y = mainViewPort.Tmargin + (viewPortHeight - mainViewPort.Tmargin - mainViewPort.Bmargin - h) / 2;
            }
            break;
        case LegendPanel.Position.TOPLEFT:
            x = this._legendPanel.horizontalMargin;
            y = this._legendPanel.verticalMargin;
            if (!this._legendPanel.overlap)
            {
                mainViewPort.Lmargin += (w + 2 * this.legendPanel.horizontalMargin + this.legendPanel.borderthickness) >> 0;
            }
            else
            {
                x += mainViewPort.Lmargin;
                y += mainViewPort.Tmargin;
            }
            break;
        case LegendPanel.Position.TOP:
            if (!this._legendPanel.overlap)
            {
                x = (viewPortWidth - w) / 2 - this._legendPanel.horizontalMargin - this._legendPanel.borderthickness;
                y = this._legendPanel.verticalMargin + this._legendPanel.borderthickness;
                mainViewPort.Tmargin += (totalHeight + this._legendPanel.verticalMargin + 2 * this._legendPanel.verticalMargin + this._legendPanel.borderthickness) >> 0;
            }
            else
            {
                x = mainViewPort.Lmargin + (viewPortWidth - mainViewPort.Lmargin - mainViewPort.Rmargin - w) / 2 - this._legendPanel.horizontalMargin - this._legendPanel.borderthickness;
                y = mainViewPort.Tmargin + this._legendPanel.verticalMargin - this._legendPanel.borderthickness;
            }
            break;

        case LegendPanel.Position.TOPRIGHT:
            x = viewPortWidth - this._legendPanel.horizontalMargin - w;
            y = this._legendPanel.verticalMargin;
            if (!this._legendPanel.overlap)
            {
                mainViewPort.Rmargin += (w + 2 * this._legendPanel.horizontalMargin + this._legendPanel.borderthickness) >> 0;
            }
            else
            {
                x -= mainViewPort.Rmargin;
                y += mainViewPort.Tmargin;
            }

            break;
        case LegendPanel.Position.RIGHT:

            x = viewPortWidth - this._legendPanel.horizontalMargin - w;
            if (!this._legendPanel.overlap)
            {
                mainViewPort.Rmargin += (w + 2 * this._legendPanel.horizontalMargin + this._legendPanel.borderthickness) >> 0;
                y = (viewPortHeight - h) / 2;
            }
            else
            {
                x -= mainViewPort.Rmargin;
                y = mainViewPort.Tmargin + (viewPortHeight - mainViewPort.Tmargin - mainViewPort.Bmargin - h) / 2;
            }

            break;
        case LegendPanel.Position.BOTTOMRIGHT:
            x = viewPortWidth - this._legendPanel.horizontalMargin - w;

            if (!this._legendPanel.overlap)
            {
                mainViewPort.Rmargin += (w + 2 * this._legendPanel.horizontalMargin + this._legendPanel.borderthickness) >> 0;
                y = viewPortHeight - this._legendPanel.verticalMargin - h;
            }
            else
            {
                x -= mainViewPort.Rmargin;
                y = viewPortHeight - mainViewPort.Bmargin - h - this._legendPanel.verticalMargin;
            }
            break;
        case LegendPanel.Position.BOTTOM:
            if (!this._legendPanel.overlap)
            {
                x = (viewPortWidth - w) / 2 - this._legendPanel.horizontalMargin - this._legendPanel.borderthickness;
                y = viewPortHeight - this._legendPanel.verticalMargin - 2 * this._legendPanel.padding - this._legendPanel.borderthickness - totalHeight;
                mainViewPort.Bmargin += (totalHeight + 2 * this._legendPanel.padding + 2 * this._legendPanel.verticalMargin + this._legendPanel.borderthickness);
            }
            else
            {
                x = mainViewPort.Lmargin + (viewPortWidth - mainViewPort.Lmargin - mainViewPort.Rmargin - w) / 2 - this._legendPanel.horizontalMargin - this._legendPanel.borderthickness;
                y = viewPortHeight - mainViewPort.Bmargin - totalHeight - 2 * this._legendPanel.padding - 2 * this._legendPanel.verticalMargin - this._legendPanel.borderthickness;
            }
            break;

        case LegendPanel.Position.BOTTOMLEFT:
            x = this._legendPanel.horizontalMargin;
            y = this._legendPanel.verticalMargin;
            if (!this._legendPanel.overlap)
            {
                mainViewPort.Lmargin += (w + 2 * this._legendPanel.horizontalMargin + this._legendPanel.borderthickness);
                y = viewPortHeight - this._legendPanel.verticalMargin - h;
            }
            else
            {
                x += mainViewPort.Lmargin;
                y = viewPortHeight - mainViewPort.Bmargin - h - this._legendPanel.verticalMargin;
            }
            break;
        }

        let rect: YDataRendering.YRectangle = new YDataRendering.YRectangle(x >> 0, y >> 0, w >> 0, h >> 0);
        g.FillRectangle(this._legendPanel.bgBrush, rect);
        g.DrawRectangle(this._legendPanel.pen, rect);
        g.TextRenderingHint = YDataRendering.YTextRenderingHint.AntiAlias;
        for (let i: number = 0; i < this._series.length; i++)
        {
            if ((this._series[i].segments.length > 0) && (this._series[i].visible) && (!this._series[i].disabled))
            {
                g.DrawStringXY(legends[i], <YDataRendering.YFont>this._legendPanel.font, (<YDataRendering.YFont>this._legendPanel.font).brush,
                    (x + ofsetx[i] + 20 + this._legendPanel.padding) >> 0,
                    (y + ofsety[i] + this._legendPanel.padding) >> 0);
                let px: number = (x + ofsetx[i] + this._legendPanel.borderthickness / 2 + this._legendPanel.padding + 6) >> 0;
                let py: number = (y + ofsety[i] + this._legendPanel.padding + legendHeight[i] / 2) >> 0;
                g.DrawLine(this._series[i].legendPen, new YDataRendering.PointF(px, py), new YDataRendering.PointF(px + 12, py));

            }
        }
    }

    private static DoSegmentRendering(w: YDataRendering.ViewPortSettings, g: YDataRendering.YGraphics, p: YDataRendering.YPen, data: pointXY[], count: number , xTimeStart :number, xTimeEnd :number )
    {// Do we need to draw that segment?

        if ((data[0].x  >xTimeEnd ) ||(data[count - 1].x < xTimeStart))  return  0 ;


       // let Bottomleft: pointXY = YGraph.ViewPortPointToIRL(w, new YDataRendering.Point(w.Lmargin, w.Height - w.Bmargin));
       // let TopRight: pointXY = YGraph.ViewPortPointToIRL(w, new YDataRendering.Point(w.Width - w.Rmargin, w.Tmargin));
        // Do we need to draw that segment?
       // if ((data[0].x > TopRight.x) || (data[count - 1].x < Bottomleft.x)) return 0; // completely out of view port display zone, abort.
        let isSVG: boolean = g instanceof YDataRendering.YGraphicsSVG;
        let N1: number = 0;
        let N2: number = 0;


        // data clipping: find out the first point to draw;
        let First: number = 0;
        if (data[0].x < xTimeStart)
        {
            N1 = 0;
            N2 = count - 1;
            while (N2 - N1 > 1)
            {
                let N: number = (N1 + N2) >> 1;
                if (data[N].x > xTimeStart) N2 = N; else N1 = N;
            }
            First = N1 - 1;
            if (First < 0) First = 0;
        }
        // data clipping: find out the last point to draw;
        let Last: number = count - 1;
        if (data[Last].x > xTimeEnd)
        {
            N1 = 0;
            N2 = count - 1;
            while (N2 - N1 > 1)
            {
                let N: number = (N1 + N2) >> 1;
                if (data[N].x < xTimeEnd) N1 = N; else N2 = N;
            }
            Last = N2 + 1;
            if (Last > count - 1) Last = count - 1;
        }

        if (Last - First > 2 * w.Width - w.Lmargin - w.Rmargin)  // to many points to Draw, lets do some clean up
        {
            let ToDraw: YDataRendering.PointF[] = new Array(3 * (Last - First + 1));
            let Current: YDataRendering.Point = YGraph.IRLPointToViewPort(w, data[First]);
            let New: YDataRendering.Point;
            let i: number = First + 1;
            let n: number = 0;
            let max :number;
            let min :number;
            let limit:number;
            while (i < Last)
            {   ToDraw[n++] = new YDataRendering.PointF(Current.X, Current.Y);
                min = data[i].y;
                max=min;
                limit = YGraph.ViewPortPointToIRL(w, new YDataRendering.Point(Current.X+1,Current.Y+1)).x;
                do
                {  if (data[i].y > max) max = data[i].y;
                    if(data[i].y < min) min = data[i].y;
                    i++;
                } while ((i < Last) && (data[i].x < limit));

                let p1 = YGraph.IRLPointToViewPort(w, new pointXY(data[i].x,min));
                let p2 = YGraph.IRLPointToViewPort(w, new pointXY(data[i].x,max));
                if (Math.abs(p1.Y-p2.Y) >2)
                {
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
                Current =  YGraph.IRLPointToViewPort(w, data[i]);
            }

            ToDraw[n++] = Current; //YGraph.IRLPointToViewPort(w, data[Last]);
            ToDraw = ToDraw.slice(0, n);
            if (n > 1) g.DrawLines(p, ToDraw);
            return n;

        }
        else
        { // in SVG mode, DrawLines linejoins are rendered correctly,
            // in bitmap mode they aren't
            if (isSVG)
            {
                let ToDraw: YDataRendering.Point[] = new Array(Last - First + 1);
                for (let i: number = First; i <= Last; i++)
                {
                    ToDraw[i - First] = YGraph.IRLPointToViewPort(w, data[i]);
                }
                g.DrawLines(p, ToDraw);
            }
            else
            {
                for (let i: number = First; i < Last; i++)
                {
                    g.DrawLine(p, YGraph.IRLPointToViewPort(w, data[i]), YGraph.IRLPointToViewPort(w, data[i + 1]));
                }
            }
        }
        return Last - First;

    }

    private DrawYAxisZones(w: YDataRendering.ViewPortSettings, g: YDataRendering.YGraphics, scale: YAxis): void
    {
        if (!scale.visible) return;

        let Delta: number = scale.startStopStep.dataMax - scale.startStopStep.dataMin;
        let YZoom: number = (Delta) / (w.Height - w.Bmargin - w.Tmargin);
        for (let i: number = 0; i < scale.zones.length; i++)
        {
            if (scale.zones[i].visible)
            {
                let max: number = scale.zones[i].max;
                let min: number = scale.zones[i].min;
                if (Number.isNaN(max))
                {
                    max = scale.startStopStep.dataMax;
                }
                if (Number.isNaN(min)) min = scale.startStopStep.dataMin;

                if (max < min)
                {
                    let t: number = max;
                    max = min;
                    min = t;
                }

                let y0: number = w.Height - w.Bmargin - Math.round((max - scale.startStopStep.dataMin) / YZoom) >> 0;
                let h: number = Math.round((max - min) / YZoom) >> 0;
                g.FillRectangleXYHW(scale.zones[i].zoneBrush, this.mainViewPort.Lmargin, y0, this.mainViewPort.Width - this.mainViewPort.Rmargin - this.mainViewPort.Lmargin + 1, h);

            }
        }

    }

    private DrawXAxisZones(w: YDataRendering.ViewPortSettings, g: YDataRendering.YGraphics, scale: XAxis): void
    {
        if (!scale.visible) return;
        let delta: number = scale.max - scale.min;
        let XZoom: number = (delta) / (w.Width - w.Lmargin - w.Rmargin);

        for (let i: number = 0; i < scale.zones.length; i++)
        {
            if (scale.zones[i].visible)
            {
                let max: number = scale.zones[i].max;
                let min: number = scale.zones[i].min;
                if (Number.isNaN(max)) max = scale.min;
                if (Number.isNaN(min)) min = scale.max;
                if (max < min)
                {
                    let t: number = max;
                    max = min;
                    min = t;
                }
                let x0: number = w.Lmargin + Math.round((min - scale.min) / XZoom) >> 0;
                g.FillRectangleXYHW(scale.zones[i].zoneBrush,
                    x0, this.mainViewPort.Tmargin,
                    ((max - min) / XZoom) >> 0,
                    this.mainViewPort.Height - this.mainViewPort.Tmargin - this.mainViewPort.Bmargin);
            }
        }
    }

// noinspection JSSuspiciousNameCombination
    private static DrawYAxis(w: YDataRendering.ViewPortSettings, g: YDataRendering.YGraphics, axis: YAxis, ofset: number, simulation: boolean): number
    {
        if (!axis.visible)
        {
            axis.innerWidth = 0;
            // noinspection JSSuspiciousNameCombination
            return axis.innerWidth;
        }

        let Delta: number = axis.startStopStep.dataMax - axis.startStopStep.dataMin;

        let YZoom: number = (Delta) / (w.Height - w.Bmargin - w.Tmargin);
        let leftSide: boolean = axis.position == YAxis.HrzPosition.LEFT;

        let x: number = leftSide ? w.Lmargin - ofset : (w.Width - w.Rmargin + ofset);

        if (!simulation) g.DrawLineXY(axis.pen, x, w.Tmargin, x, w.Height - w.Bmargin);
        let format: YDataRendering.YStringFormat = new YDataRendering.YStringFormat(YDataRendering.YStringFormat.StringFormatFlags.NoClip);
        format.LineAlignment = YDataRendering.YStringFormat.StringAlignment.Center;
        format.Alignment = leftSide ? YDataRendering.YStringFormat.StringAlignment.Far : YDataRendering.YStringFormat.StringAlignment.Near;

        let FirstStep: number = axis.startStopStep.step * (Math.floor(axis.startStopStep.start / axis.startStopStep.step));

        if (FirstStep < 0)
        { FirstStep -= axis.startStopStep.step; }

        let stepCount: number = (((Delta - (FirstStep - axis.startStopStep.dataMin)) / axis.startStopStep.step) >> 0) + 1;

        if (!simulation) g.TextRenderingHint = YDataRendering.YTextRenderingHint.AntiAlias;
        let UnitWidth: number = 0;

        let labelPrecision: number = 0;  // fix me
        if (axis.startStopStep.precision < 0) labelPrecision = (-axis.startStopStep.precision);

        if (stepCount < w.Height) // protection again infinity of graduation
        {
            for (let i: number = 0; i < stepCount; i++)
            {
                let y: number = Math.round((FirstStep + i * axis.startStopStep.step - axis.startStopStep.dataMin) / YZoom) >> 0;
                if (y >= 0)
                {

                    y = w.Height - w.Bmargin - y;
                    let v: number = FirstStep + i * axis.startStopStep.step;

                    if (!simulation)
                    {
                        if ((axis.showGrid) && ((i > 0) || (axis.startStopStep.dataMin != 0))) g.DrawLineXY(axis.gridPen, w.Lmargin, y, w.Width - w.Rmargin, y);
                        if ((Math.abs(v) < 1E-6) && axis.highlightZero)
                        {
                            g.DrawLineXY(axis.pen, w.Lmargin, y, w.Width - w.Rmargin, y);

                        }
                        g.DrawLineXY(axis.pen, x + ((leftSide) ? -2 : 2), y, x + ((leftSide) ? 5 : -5), y);
                    }

                    let label: string = v.toFixed(labelPrecision);
                    let ssize: YDataRendering.YSizeF = g.MeasureString(label, <YDataRendering.YFont>axis.font, 100000);
                    if (ssize.width > UnitWidth) UnitWidth = ssize.width;
                    if (!simulation)
                    {
                        let p: YDataRendering.Point = new YDataRendering.Point(x + (leftSide ? -3 : 3), y);
                        g.DrawStringPF(label, <YDataRendering.YFont>axis.font, (<YDataRendering.YFont>axis.font).brush, p, format);

                    }
                }

            }
        }

        if (axis.legend.title != "")
        {
            let size: YDataRendering.YSizeF = g.MeasureString(axis.legend.title, (<YDataRendering.YFont>axis.legend.font), 100000);

            if (!simulation)
            {
                let format: YDataRendering.YStringFormat = new YDataRendering.YStringFormat(YDataRendering.YStringFormat.StringFormatFlags.NoClip);
                format.Alignment = YDataRendering.YStringFormat.StringAlignment.Center;
                format.LineAlignment = YDataRendering.YStringFormat.StringAlignment.Center;

                format.Trimming = YDataRendering.YStringFormat.StringTrimming.None;
                let legendX: number = x + ((leftSide) ? -UnitWidth - size.height : UnitWidth + size.height + 2) >> 0;
                let legendY: number = (w.Tmargin + (w.Height - w.Tmargin - w.Bmargin) / 2) >> 0;

                g.Transform(legendX, legendY, leftSide ? -Math.PI / 2 : Math.PI / 2);
                g.DrawStringPF(axis.legend.title, <YDataRendering.YFont>axis.legend.font, (<YDataRendering.YFont>axis.legend.font).brush, new YDataRendering.Point(0, 0), format);
                g.ResetTransform();
            }
            // noinspection JSSuspiciousNameCombination
            UnitWidth += size.height;
        }
        axis.innerWidth = (UnitWidth >> 0) + 10;
        // noinspection JSSuspiciousNameCombination
        return axis.innerWidth;
    }

    private DrawMonitorXAxis(w: YDataRendering.ViewPortSettings, g: YDataRendering.YGraphics, xRange: MinMax, format: number): void
    {
        let delta: number = xRange.Max - xRange.Min;
        let scale: TimeResolution = TimeConverter.BestTimeformat(delta, delta, this.xAxis.timeReference);
        let XZoom: number = (delta) / (w.Width - w.Lmargin - w.Rmargin);

        let stepCount: number = ((delta / scale.step) >> 0) + 2;
        let FirstStep: number = scale.step * (Math.floor(xRange.Min / scale.step));
        if (FirstStep < xRange.Min) FirstStep += scale.step;
        g.TextRenderingHint = YDataRendering.YTextRenderingHint.AntiAlias;
        let y: number = w.Height - w.Bmargin;

        g.DrawLineXY(this._navigator.pen, w.Lmargin, w.Height - w.Bmargin - 1, w.Width - w.Rmargin, w.Height - w.Bmargin - 1);
        let label: string;
        let t: number = FirstStep;
        do
        {

            let d: YDate = TimeConverter.FromUnixTime(t);
            if (scale.step > 30 * 86400)  // resynchronize with the beginning of the month.
            {
                t = TimeConverter.ToUnixTime(new Date(d.getFullYear(), d.getMonth(), 1));

            }
            if (t >= xRange.Min)
            {
                let x: number = w.Lmargin + Math.round((t - xRange.Min) / XZoom);
                g.DrawLineXY(this._navigator.pen, x, y, x, y - 4);
                if (format == XAxis.FORMATAUTO)
                {
                    label = TimeConverter.FromUnixTime(t).ToString(scale.format);
                }
                else
                {
                    label = TimeConverter.FromUnixTime(t).ToString(format);
                }

                let ssize: YDataRendering.YSizeF = g.MeasureString(label, <YDataRendering.YFont>this._navigator.font, 100000);
                g.DrawString(label, <YDataRendering.YFont>this._navigator.font, (<YDataRendering.YFont>this._navigator.font).brush, new YDataRendering.Point((x - ssize.width / 2), (y - ssize.height - 1)));
            }
            t += scale.step;

        } while (t < xRange.Max);

    }
    private static XLabel(t: number, scale: XAxis, scaleFormat: TimeResolution, timeRange: MinMax): string
    {
        let label: string;
        if (scale.timeReference == TimeConverter.TimeReference.ABSOLUTE)
        {
            if (scale.labelFormat == XAxis.FORMATAUTO)
            {
                label = TimeConverter.FromUnixTime(t).ToString(scaleFormat.format);
            }
            else
            {
                label = t.toString();
            } //(scale.labelFormat);
        }
        else
        {
            let ticks: number = YTimeSpan.TicksPerSecond * (Math.round(1000 * (t - scale.zeroTime)) / 1000);
            label = (ticks < 0) ? "-" + new YTimeSpan(-ticks).toString(scaleFormat.format) : new YTimeSpan(ticks).toString(scaleFormat.format);
        }
        return label;
    }

    private DrawXAxis(w: YDataRendering.ViewPortSettings, g: YDataRendering.YGraphics, scale: XAxis, simulation: boolean): number
    {   //  actual avaiable size is less than 10 px, abort
        if (w.Width - w.Rmargin - w.Lmargin <10) return 1;



        //string lastdate = "";
        let stringFormat: YDataRendering.YStringFormat = new YDataRendering.YStringFormat(YDataRendering.YStringFormat.StringFormatFlags.NoClip);
        stringFormat.Alignment = YDataRendering.YStringFormat.StringAlignment.Center;      // Horizontal Alignment

        let bottomSide: boolean = scale.position == XAxis.VrtPosition.BOTTOM;

        let y: number = bottomSide ? w.Height - w.Bmargin : w.Tmargin;

        if (!simulation) g.DrawLineXY(scale.pen, w.Lmargin, y, w.Width - w.Rmargin, y);

        let delta: number = scale.max - scale.min;
        let XZoom: number = (delta) / (w.Width - w.Lmargin - w.Rmargin);
        let stepCount: number = ((delta / scale.step) >> 0) + 1;
        let FirstStep: number = 0;
        let timeRange: MinMax = MinMaxHandler.DefaultValue();

        for (let i: number = 0; i < this._series.length; i++)
        {
            if (!this._series[i].disabled)
            {
                timeRange = MinMaxHandler.Combine(timeRange, this._series[i].timeRange);
            }
        }
        scale.zeroTime = timeRange.Min;

        if (scale.timeReference == TimeConverter.TimeReference.ABSOLUTE)
        {
            FirstStep = scale.step * (Math.floor(scale.min / scale.step));
            timeRange.Min = scale.min;
            timeRange.Max = scale.max;
        }
        else
        {

            if (Number.isNaN(timeRange.Min)) return 0;
            FirstStep = timeRange.Min + scale.step * (Math.floor((scale.min - scale.zeroTime) / scale.step));
        }
        if (FirstStep < scale.min) FirstStep += scale.step;

        let timeOffset: number = 0;
        if (scale.timeReference != TimeConverter.TimeReference.ABSOLUTE)
        {
            timeOffset = FirstStep;

        }
        scale.fullSize = timeRange.Max - timeRange.Min;

        //log("Viewport Size: " + (scale.max - scale.min).toString() + "Sec (" + ((scale.max - scale.min)/86400).toString()+" days)");

        let scaleFormat: TimeResolution = scale.bestFormat(timeRange.Max - timeRange.Min, scale.max - scale.min);

        if (!simulation) g.TextRenderingHint = YDataRendering.YTextRenderingHint.AntiAlias;
        let UnitHeight: number = 0;
        let label: string;

        scale.step = scaleFormat.step;

        // compute the size of the first label
        let t: number = parseFloat(FirstStep.toString());
        label = YGraph.XLabel(t, scale, scaleFormat, timeRange);
        let ssize: YDataRendering.YSizeF = g.MeasureString(label, <YDataRendering.YFont>scale.font, 100000);

        // Compute step to skip, to make sure labels don't overlap

        let mod: number = 1;
        while ((mod * (w.Width - w.Rmargin - w.Lmargin) / stepCount) < ssize.width)
        {
            mod++;
        }

        let steps: number = Math.round((t - timeOffset) / scale.step) >> 0;
        let previousT: number = 0;

        do
        {
            let d: Date = TimeConverter.FromUnixTime(t);
            if ((scale.step > 32 * 86400) && (scale.timeReference == TimeConverter.TimeReference.ABSOLUTE))  // resynchronize with the begining of the month.
            {   if  (scale.step >= 365 * 86400)
                 {   let m : number = d.getMonth();
                     t = TimeConverter.ToUnixTime(new Date(d.getFullYear()+(m>5?1:0),0, 1));
                 }
                 else
                 t = TimeConverter.ToUnixTime(new Date(d.getFullYear(), d.getMonth(), 1));
                if (t < previousT)
                {
                    debugger;
                } // if this happens, we are in deep sh*t

                // console.log(" " + t.toString() +" / "+scale.max.toString() + " step = "+scale.step.toString())
            }
            if (t >= scale.min)
            {
                let x: number = w.Lmargin + Math.round((t - scale.min) / XZoom) >> 0;
                if (x <= w.Width - w.Rmargin)
                {

                    if (!simulation)
                    {
                        if (scale.showGrid) g.DrawLineXY(scale.gridPen, x, w.Tmargin, x, w.Height - w.Bmargin);
                        g.DrawLineXY(scale.pen, x, y + (bottomSide ? 2 : -2), x, y + (bottomSide ? -5 : 5));
                    }

                    label = YGraph.XLabel(t, scale, scaleFormat, timeRange);
                    //console.log("t="+t+" label="+label);
                    ssize = g.MeasureString(label, <YDataRendering.YFont>scale.font, 100000);
                    if (ssize.height > UnitHeight) UnitHeight = ssize.height;
                    if (!simulation)
                    {

                        if (steps % mod == 0)
                            //if (Math.round(100 * (t - timeOffset)) % Math.round(100 * (scale.step * mod)) == 0)
                        {
                            g.DrawStringPF(label, <YDataRendering.YFont>scale.font, (<YDataRendering.YFont>scale.font).brush, new YDataRendering.PointF(x, y + (bottomSide ? +5 : (-ssize.height) >> 0) - 2), stringFormat);
                        }
                    }
                }
            }
            previousT = t;
            t += scale.step;
            if (t < previousT) debugger;  // if this happens, we are in deep sh*t

            steps++;
        } while (t <= scale.max);

        if (scale.legend.title != "")
        {

            let size: YDataRendering.YSizeF = g.MeasureString(scale.legend.title, <YDataRendering.YFont>scale.legend.font, 100000);
            if (!simulation)
            {
                let legendX: number = (w.Lmargin + (w.Width - w.Lmargin - w.Rmargin - size.width) / 2) >> 0;
                let legendY: number = (bottomSide ? w.Height - w.Bmargin + UnitHeight + 5 : w.Tmargin - UnitHeight - size.height * 1.5);

                g.DrawString(scale.legend.title, <YDataRendering.YFont>scale.legend.font, (<YDataRendering.YFont>scale.legend.font).brush, new YDataRendering.PointF(legendX, legendY));
            }
            UnitHeight += size.height >> 0;
        }
        scale.innerHeight = (UnitHeight >> 0) + 10;

        // noinspection JSSuspiciousNameCombination
        return scale.innerHeight;
    }

    public pixelxSize(mainViewPort: YDataRendering.ViewPortSettings, scaleX: XAxis): number
    {
        let dtime: number = scaleX.max - scaleX.min;
        let dview: number = mainViewPort.Width - mainViewPort.Lmargin - mainViewPort.Rmargin;
        if (dview > 0) return dtime / dview;
        return 0;
    }

    public TimeToAutoSting(t: number, mainViewPort: YDataRendering.ViewPortSettings, scaleX: XAxis): string
    {
        let strValue: string = "";
        let dtime: number = scaleX.max - scaleX.min;
        let months: string[] = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        // double dview = mainViewPort.Width - mainViewPort.Lmargin - mainViewPort.Rmargin;
        if (dtime > 0)
        {
            let pixelSize: number = this.pixelxSize(mainViewPort, scaleX);
            if (pixelSize > 0)
            {

                if (scaleX.timeReference == TimeConverter.TimeReference.ABSOLUTE)
                {
                    let date: Date = TimeConverter.FromUnixTime(t);
                    let MMMM: string = months[date.getMonth()];
                    let dd: string = date.getDate().toString();
                    let HH: string = date.getHours().toString();
                    if (HH.length < 2) HH = "0" + HH;
                    let mm: string = date.getMinutes().toString();
                    if (mm.length < 2) mm = "0" + mm;
                    let ss: string = date.getSeconds().toString();
                    if (ss.length < 2) ss = "0" + ss;
                    let ff: string = Math.round(date.getMilliseconds() / 10).toString();
                    if (ff.length < 2) ff = "0" + ss;
                    let f: string = Math.round(date.getMilliseconds() / 100).toString();
                    if (dtime >= 86400) strValue += MMMM + " " + dd;
                    if (pixelSize < 0.1)
                    {
                        strValue += (strValue != "" ? " " : "") + HH + ":" + mm + ":" + ss + "." + ff;
                    }
                    else if (pixelSize < 1)
                    {
                        strValue += (strValue != "" ? " " : "") + HH + ":" + mm + ":" + ss + "." + f;
                    }
                    else if (pixelSize < 60)
                    {
                        strValue += (strValue != "" ? " " : "") + HH + ":" + mm + ":" + ss;
                    }
                    else if (pixelSize < 3600)
                    {
                        strValue += (strValue != "" ? " " : "") + HH + ":" + mm;
                    }
                    else if (pixelSize < 86400) strValue += (strValue != "" ? " " : "") + HH + "H";
                }
                else
                {
                    let format: number = TimeConverter.RelativeFormat(scaleX.fullSize, dtime, pixelSize);
                    let ticks: number = YTimeSpan.TicksPerSecond * (Math.round(100 * (t - scaleX.zeroTime)) / 100);
                    strValue += (ticks < 0) ? "-" + new YTimeSpan(-ticks).toString(format) : new YTimeSpan(ticks).toString(format);

                }
            }
        }
        return strValue;
    }

    private DrawDataTracker(g: YDataRendering.YGraphics, viewPortWidth: number, viewPortHeight: number, scaleX: XAxis): void
    {
        if (!this._dataTracker.enabled)
        { return; }

        let p: YDataRendering.Point | null = this.mouseLocalPosition();
        if (p == null)
        { return; }

        if (p.X <= this.mainViewPort.Lmargin)
        { return; }
        if (p.Y <= this.mainViewPort.Tmargin)
        { return; }

        if (p.X >= this.UIContainer.width - this.mainViewPort.Rmargin)
        { return; }
        if (p.Y >= this.UIContainer.height - this.mainViewPort.Bmargin)
        { return; }

        g.SetClip(new YDataRendering.YRectangle(0, 0, viewPortWidth, viewPortHeight));

        let DataPoint: pointXY = YGraph.ViewPortPointToIRL(this.mainViewPort, p);  //DataPoint Y value will be incorrect, but we don't need it.

        let delta: number = -1;
        let bestindex: number = -1;
        let bestmatch: YDataRendering.Point[] = new Array(this._series.length);
        let IRLmatch: pointXY[] = new Array(this._series.length);

        for (let i: number = 0; i < this._series.length; i++)
        {
            if ((this._series[i].visible) && (!this._series[i].disabled))
            {
                let p2: pointXY | null = this._series[i].findClosestValue(DataPoint.x, false);
                if (p2 != null)
                {
                    IRLmatch[i] = p2
                    bestmatch[i] = YGraph.IRLPointToViewPort(this.mainViewPort, IRLmatch[i], this.yAxes[this._series[i].yAxisIndex].IRLy, this.yAxes[this._series[i].yAxisIndex].zoom);
                    if (bestindex < 0 || (delta > Math.abs(bestmatch[i].Y - p.Y)))
                    {
                        delta = Math.abs(bestmatch[i].Y - p.Y);

                        if ((this._dataTracker.detectionDistance == 0) ||
                            ((delta <= this._dataTracker.detectionDistance) &&
                                (Math.abs(bestmatch[i].X - p.X) < this._dataTracker.detectionDistance)))
                        {
                            bestindex = i;
                        }
                    }
                }
            }
        }

        if (bestindex >= 0)
        {

            let xx: number = (bestmatch[bestindex].X - this._dataTracker.diameter / 2) >> 0;
            let yy: number = (bestmatch[bestindex].Y - this._dataTracker.diameter / 2) >> 0;
            let dd: number = this._dataTracker.diameter;

            g.FillEllipse(this._series[bestindex].brush, xx, yy, dd, dd);

            g.DrawEllipse(this._dataTracker.pen, xx, yy, dd, dd);

            let dx: number;
            let dy: number;
            if (p.X > this.mainViewPort.Lmargin + (viewPortWidth - this.mainViewPort.Lmargin - this.mainViewPort.Rmargin) / 2) dx = -1; else dx = 1;
            if (p.Y > this.mainViewPort.Tmargin + (viewPortHeight - this.mainViewPort.Tmargin - this.mainViewPort.Bmargin) / 2) dy = -1; else dy = 1;

            let xx2: number = (bestmatch[bestindex].X + dx * (this._dataTracker.handleLength * 1.5)) >> 0;
            let yy2: number = (bestmatch[bestindex].Y + dy * this._dataTracker.handleLength) >> 0;

            g.DrawLineXY(this._dataTracker.pen, (bestmatch[bestindex].X + dx * 0.707 * this._dataTracker.diameter / 2) >> 0, (bestmatch[bestindex].Y + dy * 0.707 * this._dataTracker.diameter / 2) >> 0,
                (bestmatch[bestindex].X + dx * this._dataTracker.handleLength) >> 0, (bestmatch[bestindex].Y + dy * this._dataTracker.handleLength) >> 0);

            g.DrawLineXY(this._dataTracker.pen, (bestmatch[bestindex].X + dx * this._dataTracker.handleLength) >> 0, (bestmatch[bestindex].Y + dy * this._dataTracker.handleLength) >> 0,
                xx2, yy2);

            let strValue: string = "";
            if (this._dataTracker.showSerieName) strValue += this._series[bestindex].legend + "\r\n";

            if (this._dataTracker.showTimeStamp)
            {
                let t: number = IRLmatch[bestindex].x;
                strValue += this.TimeToAutoSting(t, this.mainViewPort, scaleX) + "\r\n";

            }
            // this string based comparaison  is an exception this._dataTracker.dataPrecision might actually be
            // DataTrackerDescription from Properties.ts which was  probably added to avoid precision values that
            // make no Sense in Yocto-Visualization


            if (this._dataTracker.dataPrecision.toString == DataTracker.DataPrecision.PRECISION_NOLIMIT.toString)
            {
                strValue += IRLmatch[bestindex].y.toString() + this._series[bestindex].unit;
            }
            else
            {
                let strvalue: string = this._dataTracker.dataPrecision.description;  // not very elegent but it will do
                let precision: number = -Math.log10(Number(strvalue));
                strValue += IRLmatch[bestindex].y.toFixed(precision) + this._series[bestindex].unit; //FIXME
            }

            let ssize: YDataRendering.YSizeF = g.MeasureString(strValue, <YDataRendering.YFont>this._dataTracker.font, 10000);
            let labelwidth: number = (ssize.width + 2 * this._dataTracker.padding + this._dataTracker.borderthickness);
            let labelHeight: number = (ssize.height + 2 * this._dataTracker.padding + this._dataTracker.borderthickness);

            if (dx > 0)
            {
                g.FillRectangleXYHW(this._dataTracker.bgBrush, xx2, yy2 - (labelHeight >> 1), labelwidth, labelHeight);
                g.DrawRectangleXYHW(this._dataTracker.pen, xx2, yy2 - (labelHeight >> 1), labelwidth, labelHeight);
                g.DrawStringXY(strValue, <YDataRendering.YFont>this._dataTracker.font, (<YDataRendering.YFont>this._dataTracker.font).brush, (xx2 + this._dataTracker.padding) >> 0, (yy2 - (labelHeight >> 1) + this._dataTracker.padding) >> 0);
            }
            else
            {
                g.FillRectangleXYHW(this._dataTracker.bgBrush, xx2 - labelwidth, yy2 - (labelHeight >> 1), labelwidth, labelHeight);
                g.DrawRectangleXYHW(this._dataTracker.pen, xx2 - labelwidth, yy2 - (labelHeight >> 1), labelwidth, labelHeight);
                g.DrawStringXY(strValue, <YDataRendering.YFont>this._dataTracker.font, (<YDataRendering.YFont>this.dataTracker.font).brush, (xx2 + this._dataTracker.padding - labelwidth) >> 0, (yy2 - (labelHeight >> 1) + this._dataTracker.padding) >> 0);
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

    public DrawMarkers(w: YDataRendering.ViewPortSettings, g: YDataRendering.YGraphics, scaleX: XAxis, viewPortWidth: number, viewPortHeight: number): void
    {
        if (this._xAxis.markers.length == 0) return;

        g.SetClip(new YDataRendering.YRectangle(w.Lmargin, w.Tmargin, w.Width - w.Rmargin - w.Lmargin, w.Height - w.Bmargin - w.Tmargin));
        let Bottomleft: pointXY = YGraph.ViewPortPointToIRL(w, new YDataRendering.Point(w.Lmargin, w.Height - w.Bmargin));
        let TopRight: pointXY = YGraph.ViewPortPointToIRL(w, new YDataRendering.Point(w.Width - w.Rmargin, w.Tmargin));
        let dy: number = (w.Height - w.Bmargin - w.Tmargin) / 100.0;

        let pixelSize: number = -1;

        g.TextRenderingHint = YDataRendering.YTextRenderingHint.AntiAlias;

        for (let i: number = 0; i < this._xAxis.markers.length; i++)
        {
            if (this._xAxis.markers[i].enabled)
            {
                if (pixelSize < 0) pixelSize = this.pixelxSize(this.mainViewPort, scaleX);

                let mustdraw: boolean = true;
                let xpos: number = 0;
                if (this._xAxis.markers[i].timereference == TimeConverter.TimeReference.RELATIVE)
                {
                    if (this._xAxis.zeroTime > 0)
                    { xpos = this._xAxis.markers[i].xposition + this._xAxis.zeroTime; }
                    else
                    {
                        mustdraw = false;
                    }

                }
                else
                {
                    xpos = this._xAxis.markers[i].xposition;
                }

                if ((xpos > Bottomleft.x - 100 * pixelSize) && (xpos < TopRight.x + 100 * pixelSize) && mustdraw)
                {
                    let p: YDataRendering.Point = YGraph.IRLPointToViewPort(w, new pointXY(xpos, 0));
                    let xxCenter: number = (p.X) >> 0;
                    let yyCenter: number = (w.Height - w.Bmargin - (this._xAxis.markers[i].yposition * dy)) >> 0;

                    let strValue: string = this._xAxis.markers[i].text.replace("\\n", "\n");

                    let now: Date = new Date();
                    if (strValue.indexOf('$') >= 0)
                    {

                        if (strValue.indexOf("$MARKERTIME$") >= 0)
                        {
                            // string s = _xAxis.markers[i].xpositionIsRelative ? _xAxis.markers[i].positionOnXAxis.toString()
                            // : TimeToAutoSting(_xAxis.markers[i].xposition, mainViewPort, scaleX);
                            let s: string = this._xAxis.markers[i].timereference == TimeConverter.TimeReference.RELATIVE ? TimeConverter.secTimeSpanToString(this._xAxis.markers[i].xposition, pixelSize)
                                : this.TimeToAutoSting(this._xAxis.markers[i].xposition, this.mainViewPort, scaleX);
                            strValue = strValue.replace("$MARKERTIME$", s);
                        }

                        if (strValue.indexOf("$VALUE") >= 0)
                        {
                            for (let j: number = 0; j < this._series.length; j++)
                            {
                                if (!this._series[j].disabled)
                                {
                                    let pt: pointXY | null = this._series[j].findClosestValue(xpos, true);
                                    let st: string = (pt != null) ? (pt.y).toFixed(0) : "--";
                                    strValue = strValue.replace("$VALUE" + (j + 1).toString() + "$", st);
                                }
                                else
                                {
                                    strValue = strValue.replace("$VALUE" + (j + 1).toString() + "$", "");
                                }
                            }
                        }

                        if (strValue.indexOf("$UNIT") >= 0)
                        {
                            for (let j: number = 0; j < this._series.length; j++)
                            {
                                if (!this._series[j].disabled)
                                {
                                    strValue = strValue.replace("$UNIT" + (j + 1).toString() + "$", this._series[j].unit);
                                }
                                else
                                {
                                    strValue = strValue.replace("$UNIT" + (j + 1).toString() + "$", "");
                                }
                            }
                        }

                        if (strValue.indexOf("$LEGEND") >= 0)
                        {
                            for (let j: number = 0; j < this._series.length; j++)
                            {
                                if (!this._series[j].disabled)
                                {
                                    strValue = strValue.replace("$LEGEND" + (j + 1).toString() + "$", this._series[j].legend);
                                }
                                else
                                {
                                    strValue = strValue.replace("$LEGEND" + (j + 1).toString() + "$", "");
                                }
                            }
                        }
                        if (this._xAxis.markers[i].PatchTextCallback != null)
                        { strValue = (<any>this._xAxis.markers[i].PatchTextCallback)(strValue); }
                    }
                    let ssize: YDataRendering.YSizeF = g.MeasureString(strValue, <YDataRendering.YFont>this._xAxis.markers[i].font, 10000);
                    let labelWidth: number = (ssize.width + 2 * this._xAxis.markers[i].padding + this._xAxis.markers[i].borderthickness);
                    let labelHeight: number = (ssize.height + 2 * this._xAxis.markers[i].padding + this._xAxis.markers[i].borderthickness);
                    g.FillRectangleXYHW(this._xAxis.markers[i].bgBrush, xxCenter - (labelWidth >> 1), yyCenter - (labelHeight >> 1), labelWidth >> 0, labelHeight >> 0);
                    g.DrawRectangleXYHW(this._xAxis.markers[i].pen, xxCenter - (labelWidth >> 1), yyCenter - (labelHeight >> 1), labelWidth >> 0, labelHeight >> 0);

                    let xText: number;
                    switch (this._xAxis.markers[i].textAlign)
                    {
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

                    g.DrawStringPF(strValue, <YDataRendering.YFont>this._xAxis.markers[i].font, (<YDataRendering.YFont>this._xAxis.markers[i].font).brush,
                        new YDataRendering.PointF(xText, yyCenter), this._xAxis.markers[i].stringFormat);
                    g.DrawLineXY(this._xAxis.markers[i].pen, xxCenter, (w.Tmargin) >> 0, xxCenter, yyCenter - (labelHeight >> 1));
                    g.DrawLineXY(this._xAxis.markers[i].pen, xxCenter, yyCenter + (labelHeight >> 1), xxCenter, (w.Height - w.Bmargin) >> 0);
                    if (this._xAxis.markers[i].arrowSize > 0)
                    {
                        if (this._xAxis.markers[i].yposition > 25)
                        {
                            let triangle: YDataRendering.PointF[] = [
                                new YDataRendering.PointF((xxCenter - this._xAxis.markers[i].arrowSize), (yyCenter + (labelHeight >> 1))),
                                new YDataRendering.PointF((xxCenter + this._xAxis.markers[i].arrowSize), (yyCenter + (labelHeight >> 1))),
                                new YDataRendering.PointF(xxCenter, ((yyCenter + (labelHeight >> 1) + this._xAxis.markers[i].arrowSize)))];
                            g.FillPolygon(this._xAxis.markers[i].arrowBrush, triangle);
                        }

                        if (this._xAxis.markers[i].yposition < 75)
                        {
                            let triangle: YDataRendering.PointF[] = [
                                new YDataRendering.PointF((xxCenter - this._xAxis.markers[i].arrowSize), (yyCenter + (labelHeight >> 1))),
                                new YDataRendering.PointF((xxCenter + this._xAxis.markers[i].arrowSize), (yyCenter + (labelHeight >> 1))),
                                new YDataRendering.PointF(xxCenter, ((yyCenter - (labelHeight >> 1) - this._xAxis.markers[i].arrowSize)))];
                            g.FillPolygon(this._xAxis.markers[i].arrowBrush, triangle);
                        }
                    }
                }
            }
        }
        g.ResetClip();
    }

    public DrawDataPanels(w: YDataRendering.ViewPortSettings, g: YDataRendering.YGraphics, scaleX: XAxis, scalesY: YAxis[], viewPortWidth: number, viewPortHeight: number): void
    {
        if (this._dataPanels.length == 0) return;

        g.SetClip(new YDataRendering.YRectangle(w.Lmargin, w.Tmargin, w.Width - w.Rmargin - w.Lmargin, w.Height - w.Bmargin - w.Tmargin));
        for (let i: number = 0; i < this._dataPanels.length; i++)
        {
            if (this._dataPanels[i].enabled)
            {
                let p: DataPanel = this._dataPanels[i];

                if (p.yScaleIndex < scalesY.length)
                {
                    let AvailableWidth: number = w.Width - 2 * p.padding - p.borderthickness;
                    if (AvailableWidth < 100) AvailableWidth = 100;

                    let ssize: YDataRendering.YSizeF = g.MeasureString(p.text, <YDataRendering.YFont>p.font, AvailableWidth >> 0);
                    let panelWidth: number = ssize.width + 2 * p.padding + p.borderthickness;
                    let panelHeight: number = ssize.height + 2 * p.padding + p.borderthickness;
                    let x: number = 0;
                    switch (p.horizontalPosition)
                    {
                    case DataPanel.HorizontalPosition.LEFTBORDER:
                        x = w.Lmargin;
                        break;
                    case DataPanel.HorizontalPosition.RIGHTBORDER:
                        x = w.Width - w.Rmargin;
                        break;
                    case DataPanel.HorizontalPosition.ABSOLUTEX:
                        let delta: number = scaleX.max - scaleX.min;
                        let XZoom: number = (delta) / (w.Width - w.Lmargin - w.Rmargin);
                        x = w.Lmargin + Math.round((p.AbsoluteXposition - scaleX.min) / XZoom) >> 0;
                        break;
                    }

                    let y: number = 0;
                    switch (p.verticalPosition)
                    {
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

                    switch (p.panelHrzAlign)
                    {
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

                    switch (p.panelVrtAlign)
                    {
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
                    if (p.borderthickness > 0) g.DrawRectangleXYHW(p.pen, x >> 0, y >> 0, panelWidth >> 0, panelHeight >> 0);

                    let sf: YDataRendering.YStringFormat = new YDataRendering.YStringFormat(YDataRendering.YStringFormat.StringFormatFlags.NoClip);
                    switch (p.panelTextAlign)
                    {
                    case YDataRendering.MessagePanel.TextAlign.LEFT:
                        sf.LineAlignment = YDataRendering.YStringFormat.StringAlignment.Near;
                        sf.Alignment = YDataRendering.YStringFormat.StringAlignment.Near;
                        break;
                    case YDataRendering.MessagePanel.TextAlign.RIGHT:
                        sf.LineAlignment = YDataRendering.YStringFormat.StringAlignment.Far;
                        sf.Alignment = YDataRendering.YStringFormat.StringAlignment.Far;
                        break;
                    default:
                        sf.LineAlignment = YDataRendering.YStringFormat.StringAlignment.Center;
                        sf.Alignment = YDataRendering.YStringFormat.StringAlignment.Center;
                        break;
                    }
                    let rect: YDataRendering.YRectangle = new YDataRendering.YRectangle(
                        (x + p.padding + p.borderthickness / 2) >> 0,
                        (y + p.padding + p.borderthickness / 2) >> 0,
                        ssize.width >>= +1, (ssize.height >> 0) + 1);

                    g.DrawStringRect(p.text, <YDataRendering.YFont>p.font, (<YDataRendering.YFont>p.font).brush, rect, sf);

                }
                else
                {
                    throw new RangeError("Cannot renderer data panel #" + i.toString() + ", no such Y axis");
                }
            }
        }
    }

    protected Render(g: YDataRendering.YGraphics, UIw: number, UIh: number): number
    { //console.log("START OF GRAPH")
        if ((UIw < 50) || (UIh < 50)) return 0; // too small size is likely to cause endless loops
//#ifdef PROFILING
        let RenderTime :number = performance.now();
//#endif
        let lastLmargin: number = this.mainViewPort.Lmargin;
        let lastRmargin: number = this.mainViewPort.Rmargin;

        this.mainViewPort.Width = UIw;
        this.mainViewPort.Height = UIh;
        this.mainViewPort.Lmargin = 0;
        this.mainViewPort.Rmargin = 0;

        g.SmoothingMode = YDataRendering.YSmoothingMode.HighQuality;

        let yMarginOffset: number = 5;

        /* Step 1, found out margins */
        // top (bottom) margin: make sure the top(/bottom) number
        // on Y scale can be draw completely

        for (let i: number = 0; i < this._yAxes.length; i++)
        {
            if (this._yAxes[i].visible)
            {
                let s: YDataRendering.YSizeF = g.MeasureString("8", <YDataRendering.YFont>this._yAxes[i].font, 100000);
                let o: number = ((s.height + 1) / 2) >> 0;
                if (yMarginOffset < o) yMarginOffset = o;
            }
        }
        this.mainViewPort.Tmargin = (this._xAxis.position == XAxis.VrtPosition.TOP) ? 0 : yMarginOffset;
        this.mainViewPort.Bmargin = (this._xAxis.position == XAxis.VrtPosition.BOTTOM) ? 0 : yMarginOffset;

        /* Step 2B-2  Draw Legend if it doesn't overlap the data */

        if (!this._legendPanel.overlap) this.drawLegendPanel(g, UIw, UIh, this.mainViewPort);

        /* Step 2B-3  Draw annotations if it doesn't overlap the data */
        this.drawAnnotationPanels(g, this._annotationPanels, UIw, UIh, false, this.mainViewPort);
        if (this.mainViewPort.Bmargin == 0) this.mainViewPort.Bmargin = 5;
        if (this.mainViewPort.Tmargin == 0) this.mainViewPort.Tmargin = 5;

        /* Step 1-A  compute margins dues to X axis  */
        let h: number = this.DrawXAxis(this.mainViewPort, g, this._xAxis, true);
        if (this._xAxis.position == XAxis.VrtPosition.TOP) this.mainViewPort.Tmargin += h; else this.mainViewPort.Bmargin += h;

        this.mainViewPort.IRLx = this._xAxis.min;

        /* Step 1-B  Find out all Y axis  start / stop  graduation spacing  */
        let M: MinMax;
        for (let i: number = 0; i < this._yAxes.length; i++)
        {
            M = MinMaxHandler.DefaultValue();
            for (let k: number = 0; k < this._series.length; k++)
            {
                if ((this._series[k].yAxisIndex == i) && (!this._series[k].disabled))
                {
                    for (let j: number = 0; j < this._series[k].segments.length; j++)
                    {
                        M = MinMaxHandler.Combine(M, YGraph.FindMinMax(this._xAxis.min, this._xAxis.max, <pointXY[]>this._series[k].segments[j].data, this._series[k].segments[j].count));
                    }

                }
            }
            this._yAxes[i].computeStartAndStep(M);
        }

        /* Step 1-B  compute  margins dues to Y axes  */
        if (this.mainViewPort.Lmargin == 0) this.mainViewPort.Lmargin = 5;
        if (this.mainViewPort.Rmargin == 0) this.mainViewPort.Rmargin = 5;

        for (let i: number = 0; i < this._yAxes.length; i++)
        {
            let sw: number = YGraph.DrawYAxis(this.mainViewPort, g, this._yAxes[i], 0, true);
            this.mainViewPort.Lmargin += (this._yAxes[i].position == YAxis.HrzPosition.LEFT) ? sw : 0;
            this.mainViewPort.Rmargin += (this._yAxes[i].position == YAxis.HrzPosition.RIGHT) ? sw : 0;
        }

        if (this._navigator.enabled)
        {

            if ((lastLmargin != this.mainViewPort.Lmargin) || (lastRmargin != this.mainViewPort.Rmargin))
            {
                //console.log("L/R margin changed");
                this.navigatorCache = null;
            }

            let nh: number = (this._navigator.relativeheight * this.UIContainer.height / 100.0) >> 0;
            let ofset: number = this.xAxis.position == XAxis.VrtPosition.BOTTOM ? h : 0;
            this._navigator.setPosition(UIw, UIh, this.mainViewPort.Lmargin, this.mainViewPort.Rmargin, this.mainViewPort.Height - nh - this.mainViewPort.Bmargin + ofset, this.mainViewPort.Bmargin - ofset);
            this.mainViewPort.Bmargin += nh;

        }

        /* step 2A draw background */
        if ((this.lastTopMargin != this.mainViewPort.Tmargin) || (this.lastBottomMargin != this.mainViewPort.Bmargin))
        {
            this._bgBrush = null;
            this.lastTopMargin = this.mainViewPort.Tmargin;
            this.lastBottomMargin = this.mainViewPort.Bmargin;
        }
        if (this._bgBrush == null)
        {
            this._bgBrush = new YDataRendering.YLinearGradientBrush(this._bgColor2, this._bgColor1);
        } // not sure why colors had to be inverted here

        g.FillRectangleXYHW(this._bgBrush,
            this.mainViewPort.Lmargin,
            this.mainViewPort.Tmargin,
            this.mainViewPort.Width - this.mainViewPort.Rmargin - this.mainViewPort.Lmargin,
            this.mainViewPort.Height - this.mainViewPort.Bmargin - this.mainViewPort.Tmargin
        );

        if (this._borderThickness > 0)
        {
            if (this._borderPen == null) this._borderPen = new YDataRendering.YPen(this._borderColor, this._borderThickness);
            g.DrawRectangleXYHW(this._borderPen,
                this.mainViewPort.Lmargin,
                this.mainViewPort.Tmargin,
                this.mainViewPort.Width - this.mainViewPort.Rmargin - this.mainViewPort.Lmargin,
                this.mainViewPort.Height - this.mainViewPort.Bmargin - this.mainViewPort.Tmargin);
        }

        /* Step 2B  Draw Y-axes and X axis zones */
        g.SetClip(new YDataRendering.YRectangle(this.mainViewPort.Lmargin,
            this.mainViewPort.Tmargin,
            this.mainViewPort.Width - this.mainViewPort.Rmargin - this.mainViewPort.Lmargin,
            this.mainViewPort.Height - this.mainViewPort.Bmargin - this.mainViewPort.Tmargin));
        for (let i: number = 0; i < this._yAxes.length; i++)
        {
            this.DrawYAxisZones(this.mainViewPort, g, this._yAxes[i]);
        }
        this.DrawXAxisZones(this.mainViewPort, g, this.xAxis);
        g.ResetClip();

        /* step 3 draw X scale */
        this.DrawXAxis(this.mainViewPort, g, this._xAxis, false);

        /* step 4 draw Y scale */
        let leftOffset: number = 0;
        let rightOffset: number = 0;
        //YDataRendering.YDataRenderer.RendererDebug = true;
        for (let i: number = 0; i < this._yAxes.length; i++)
        {
            let ww: number = YGraph.DrawYAxis(this.mainViewPort, g, this._yAxes[i], (this._yAxes[i].position == YAxis.HrzPosition.LEFT) ? leftOffset : rightOffset, false);
            if (this._yAxes[i].position == YAxis.HrzPosition.LEFT) leftOffset += ww;
            if (this._yAxes[i].position == YAxis.HrzPosition.RIGHT) rightOffset += ww;

        }
        //YDataRendering.YDataRenderer.RendererDebug = false;
        // step 5 step define data zone
        //  YDataRendering.YPen mypenb = Pens.Black;
        //g.DrawRectangle(mypenb, ViewPort1.Lmargin, ViewPort1.Tmargin, ViewPort1.Width - ViewPort1.Rmargin - ViewPort1.Lmargin, ViewPort1.Height - ViewPort1.Bmargin - ViewPort1.Tmargin);
        g.SetClip(new YDataRendering.YRectangle(this.mainViewPort.Lmargin,
            this.mainViewPort.Tmargin,
            this.mainViewPort.Width - this.mainViewPort.Rmargin - this.mainViewPort.Lmargin,
            this.mainViewPort.Height - this.mainViewPort.Bmargin - this.mainViewPort.Tmargin));

        // step 6 series rendering
        this.mainViewPort.zoomx = (this.mainViewPort.Width - this.mainViewPort.Lmargin - this.mainViewPort.Rmargin) / (this._xAxis.max - this._xAxis.min);

        let mypenb: YDataRendering.YPen | null = null;
        let lineCount: number = 0;
        let pointCount: number = 0;

        let Bottomleft: pointXY = YGraph.ViewPortPointToIRL(this.mainViewPort, new YDataRendering.Point(this.mainViewPort.Lmargin, this.mainViewPort.Height - this.mainViewPort.Bmargin));
        let TopRight: pointXY = YGraph.ViewPortPointToIRL(this.mainViewPort, new YDataRendering.Point(this.mainViewPort.Width - this.mainViewPort.Rmargin, this.mainViewPort.Tmargin));
        let xTimeStart : number = Bottomleft.x;
        let xTimeEnd   : number = TopRight.x;



        for (let k: number = 0; k < this._series.length; k++)
        {
            if ((this._series[k].visible) && !(this._series[k].disabled))
            {   //#ifdef PROFILING
                let perf : number  = performance.now();
                //#endif
                let scaleIndex: number = this._series[k].yAxisIndex;
                mypenb = this._series[k].pen;
                this.mainViewPort.IRLy = this._yAxes[scaleIndex].startStopStep.dataMin;
                this._yAxes[this._series[k].yAxisIndex].IRLy = this.mainViewPort.IRLy;
                let delta: number = this._yAxes[scaleIndex].startStopStep.dataMax - this._yAxes[scaleIndex].startStopStep.dataMin;
                if (delta == 0)
                {
                    delta = 1;
                    this.mainViewPort.IRLy -= delta / 2;
                }

                this.mainViewPort.zoomy = (this.mainViewPort.Height - this.mainViewPort.Tmargin - this.mainViewPort.Bmargin) / (delta);
                this._yAxes[this._series[k].yAxisIndex].zoom = this.mainViewPort.zoomy;
                g.comment("** main view-port series " + k.toString());

                for (let i: number = 0; i < this._series[k].segments.length; i++)
                {
                    lineCount += YGraph.DoSegmentRendering(this.mainViewPort, g, mypenb, <pointXY[]>this._series[k].segments[i].data, this._series[k].segments[i].count,xTimeStart,xTimeEnd);
                    pointCount += this._series[k].segments[i].count;
                }
                //#ifdef PROFILING
                console.log("Serie "+k+" rendering took  "+(performance.now()-perf).toString()+"ms ("+this._series[k].segments.length+" segments)");
                //#endif

            }
        }

        // step 7  draw  navigator
        g.ResetClip();
        if (this._navigator.enabled)
        {   //#ifdef PROFILING
            let ntime :number =  performance.now();
            //#endif

            g.comment("** navigator **");
            let v: YDataRendering.ViewPortSettings = this._navigator.viewport;

            // step 7A, find out Time Range
            let range: MinMax = MinMaxHandler.DefaultValue();
            for (let i: number = 0; i < this._series.length; i++)
            {
                if (!this._series[i].disabled) range = MinMaxHandler.Combine(range, this._series[i].timeRange);
            }

            this._navigator.Xrange = MinMaxHandler.extend(range, 1.05);

            v.zoomx = (v.Width - v.Lmargin - v.Rmargin) / (this._navigator.Xrange.Max - this._navigator.Xrange.Min);
            if (((this.lastPointCount != pointCount)
                 && (!this.mainViewPort.Capture) && (!this._navigator.Capture)) // performance : do not redraw navigator when a drag operation is running.
               || (this.navigatorCache == null) || (g instanceof YDataRendering.YGraphicsSVG))
            {
                g.comment("Redraw navigator");
                if (this.navigatorCache != null) this.navigatorCache = null //.Dispose();
                this.navigatorCache = document.createElement('canvas'); //  new HTMLCanvasElement(); //v.Width, v.Height, g.graphics); FIXME?
                //document.body.appendChild(this.navigatorCache); // debug

                this.navigatorCache.width = v.Width;
                this.navigatorCache.height = v.Height;

                this.lastPointCount = pointCount;

                let ng: YDataRendering.YGraphics;
                if (g instanceof YDataRendering.YGraphicsSVG)
                {
                    ng = g;
                }
                else
                {
                    ng = new YDataRendering.YGraphics(this.navigatorCache, v.Width, v.Height, 90);

                }

                //ng.SetClip(new Rectangle(v.Lmargin, v.Tmargin, v.Width - v.Rmargin - v.Lmargin, v.Height - v.Bmargin - v.Tmargin));
                //ng.ResetClip();
                ng.FillRectangleXYHW(this._navigator.bgBrush, v.Lmargin, v.Tmargin, v.Width - v.Rmargin - v.Lmargin, v.Height - v.Bmargin - v.Tmargin);

                if ((this.xAxis.zones.length > 0) && this._navigator.showXAxisZones)
                {
                    let delta: number = this._navigator.Xrange.Max - this._navigator.Xrange.Min;
                    let XZoom: number = (delta) / (v.Width - v.Lmargin - v.Rmargin);
                    for (let i: number = 0; i < this.xAxis.zones.length; i++)
                    {
                        if (this.xAxis.zones[i].visible)
                        {
                            let min: number = this.xAxis.zones[i].min;
                            let max: number = this.xAxis.zones[i].max;
                            if (isNaN(min)) min = this._navigator.Xrange.Min;
                            if (isNaN(max)) max = this._navigator.Xrange.Max;
                            ng.FillRectangleXYHW(this.xAxis.zones[i].zoneBrush,
                                v.Lmargin + ((min - this._navigator.Xrange.Min) / XZoom) >> 0,
                                v.Tmargin >> 0,
                                ((max - min) / XZoom) >> 0,
                                v.Height - v.Bmargin - v.Tmargin);
                        }
                    }
                }

                if ((MinMaxHandler.isDefined(this._navigator.Xrange)) && ((this._navigator.Xrange.Max - this._navigator.Xrange.Min) > 0))  // if (Xrange<=0) then nothing to draw
                { // step 7B, draw series
                    let Min: number;
                    let Max: number;
                    v.IRLx = this._navigator.Xrange.Min;
                    let dontSticktoBorderZoom: number = 4.0 / (v.Height - v.Bmargin - v.Tmargin);

                    let Bottomleft: pointXY = YGraph.ViewPortPointToIRL(v, new YDataRendering.Point(v.Lmargin, v.Height - v.Bmargin));
                    let TopRight: pointXY = YGraph.ViewPortPointToIRL(v, new YDataRendering.Point(v.Width - v.Rmargin, v.Tmargin));
                    let xTimeStart : number = Bottomleft.x;
                    let xTimeEnd   : number = TopRight.x;


                    if (this._navigator.yAxisHandling == Navigator.YAxisHandling.AUTO)
                    { // Automatic yAxis handling



                        for (let k: number = 0; k < this._series.length; k++)
                        {
                            if (!this._series[k].disabled)
                            {
                                ng.comment("** navigator series " + k.toString());
                                v.IRLy = this._series[k].valueRange.Min;
                                let yAxisIndex: number = this._series[k].yAxisIndex;
                                mypenb = this._series[k].navigatorpen;
                                Min = this._series[k].valueRange.Min;
                                Max = this._series[k].valueRange.Max;
                                if (Max - Min <= 0)
                                {
                                    v.IRLy = Min - 0.5;
                                    Max = Min + 0.5;
                                }
                                else
                                {
                                    let delta: number = Max - Min;
                                    Min -= delta * dontSticktoBorderZoom; // 0.025;
                                    Max += delta * dontSticktoBorderZoom; // 0.025;
                                }
                                v.IRLy = Min;
                                v.zoomy = (v.Height - v.Tmargin - v.Bmargin) / (Max - Min);
                                for (let i: number = 0; i < this._series[k].segments.length; i++)
                                {
                                    lineCount += YGraph.DoSegmentRendering(v, ng, mypenb, <pointXY[]>this._series[k].segments[i].data, this._series[k].segments[i].count,xTimeStart,xTimeEnd);
                                }
                            }
                        }
                    }
                    else
                    {  //  yAxis handling inherited from main view-port settings
                        for (let i: number = 0; i < this._yAxes.length; i++)
                        { // find out data MinMax
                            let Yrange: MinMax = MinMaxHandler.DefaultValue();
                            for (let j: number = 0; j < this._series.length; j++)
                            {
                                if ((this._series[j].yAxisIndex == i) && (!this._series[j].disabled))
                                {
                                    Yrange = MinMaxHandler.Combine(Yrange, this._series[j].valueRange);
                                }
                            }
                            Yrange = MinMaxHandler.extend(Yrange, 1 + 2 * dontSticktoBorderZoom);
                            Min = this._yAxes[i].min;
                            if (isNaN(Min)) Min = Yrange.Min;
                            Max = this._yAxes[i].max;
                            if (isNaN(Max)) Max = Yrange.Max;
                            if (Number.isNaN(Min))
                            {
                                Min = 0.0;
                                Max = 1.0;
                            }
                            if (Max - Min <= 0)
                            {
                                Min = Min - 0.5;
                                Max = Min + 0.5;
                            }
                            v.IRLy = Min;
                            v.zoomy = (v.Height - v.Tmargin - v.Bmargin) / (Max - Min);
                            for (let j: number = 0; j < this._series.length; j++)
                            {
                                if ((this._series[j].yAxisIndex == i) && (!this._series[j].disabled) && (this._series[j].visible))
                                {
                                    ng.comment("** navigator series " + j.toString());
                                    mypenb = this._series[j].navigatorpen;
                                    for (let k: number = 0; k < this._series[j].segments.length; k++)
                                    {
                                        lineCount += YGraph.DoSegmentRendering(v, ng, mypenb, <pointXY[]>this._series[j].segments[k].data, this._series[j].segments[k].count,xTimeStart,xTimeEnd);
                                    }
                                }
                            }
                        }
                    }

                    for (let i: number = 0; i < this._xAxis.markers.length; i++)
                    {
                        if (this._xAxis.markers[i].enabled)
                        {
                            let p: YDataRendering.Point = YGraph.IRLPointToViewPort(v, new pointXY(this._xAxis.markers[i].xposition + (this._xAxis.markers[i].timereference == TimeConverter.TimeReference.RELATIVE ? this._xAxis.zeroTime : 0), 0));
                            ng.DrawLineXY(this._xAxis.markers[i].navigatorpen, p.X, v.Tmargin, p.X, v.Height - v.Bmargin);
                        }
                    }

                    if (this._navigator.borderThickness > 0)
                    {
                        ng.DrawLineXY(this._navigator.borderPen, v.Lmargin, v.Tmargin, v.Width - v.Rmargin, v.Tmargin);

                    }
                    // step 7C, draw Scale

                    this.DrawMonitorXAxis(v, ng, this._navigator.Xrange, this.xAxis.labelFormat);
                    this._navigator.setIRLPosition(v.IRLx, v.IRLy, v.zoomx, v.zoomy);

                }
                if (!(g instanceof YDataRendering.YGraphicsSVG)) ng.Dispose();

            }
            // set  7E, copy cache to display
            let cacheW : number = v.Width - v.Rmargin - v.Lmargin + 1;
            let cacheH : number = v.Width - v.Rmargin - v.Lmargin + 1;

            let rectsrc: YDataRendering.YRectangle = new YDataRendering.YRectangle(v.Lmargin, v.Tmargin - 1, cacheW, cacheH);
            let rectdst: YDataRendering.YRectangle = new YDataRendering.YRectangle(v.Lmargin , v.Tmargin , cacheW, cacheH);
            g.SetClip(rectdst);

            if (!(g instanceof YDataRendering.YGraphicsSVG))
            {

                //g.SetClip(rect);
                //let  p : YDataRendering.YPen = new YDataRendering.YPen( YDataRendering.YColor.Blue,1);
                //g.DrawLineXY(p,0,0,this.UIContainer.width,this.UIContainer.height);
                //g.DrawLineXY(p,this.UIContainer.width,0,0,this.UIContainer.height);
                g.DrawImage(this.navigatorCache, rectsrc, rectdst, YDataRendering.YGraphicsUnit.Pixel);
                // g.ResetClip();
            }

            //navigatorCache.Save("C:\\tmp\\t.png", ImageFormat.Png);
            // set  7E, draw Cursor

            if (this._navigator.borderThickness > 0)
            {
                g.DrawLineXY(this._navigator.borderPen, v.Lmargin + 1, v.Tmargin, v.Lmargin + 1, v.Height - v.Bmargin - 1);
                g.DrawLineXY(this._navigator.borderPen, v.Width - v.Rmargin, v.Tmargin, v.Width - v.Rmargin, v.Height - v.Bmargin - 1);
                g.DrawLineXY(this._navigator.borderPen, v.Lmargin + 1, v.Tmargin, v.Width - v.Rmargin, v.Tmargin);

            }
            let IRLCursorStart: pointXY = YGraph.ViewPortPointToIRL(this.mainViewPort, new YDataRendering.Point(this.mainViewPort.Lmargin, 0));
            let IRLCursorEnd: pointXY = YGraph.ViewPortPointToIRL(this.mainViewPort, new YDataRendering.Point(this.mainViewPort.Width - this.mainViewPort.Rmargin, 0));
            let CursorStart: YDataRendering.Point = YGraph.IRLPointToViewPort(this._navigator.viewport, new pointXY(IRLCursorStart.x, 0));
            let CursorEnd: YDataRendering.Point = YGraph.IRLPointToViewPort(this._navigator.viewport, new pointXY(IRLCursorEnd.x, 0));

            g.FillRectangle(this._navigator.cursorBrush, new YDataRendering.YRectangle(CursorStart.X - 1, v.Tmargin, CursorEnd.X - CursorStart.X + 2, v.Height - v.Bmargin - v.Tmargin - 1));
            g.DrawLineXY(this._navigator.cursorBorderPen, (CursorStart.X - 1) >> 0, (v.Tmargin) >> 0, (CursorStart.X - 1) >> 0, (v.Height - v.Bmargin) - 1);
            g.DrawLineXY(this._navigator.cursorBorderPen, (CursorEnd.X + 1) >> 0, (v.Tmargin) >> 0, (CursorEnd.X + 1) >> 0, (v.Height - v.Bmargin) - 1);
            g.ResetClip();

            //#ifdef PROFILING
            console.log("Navigator rendering took "+(performance.now()-ntime).toString()+"ms")
            //#endif
        }

        if (this._legendPanel.overlap) this.drawLegendPanel(g, UIw, UIh, this.mainViewPort);

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

        console.log("graph rendering took "+ ( performance.now()-RenderTime ).toString()+"ms");
        //#endif
        return 0;
    }

    private KeyDown(sender: object, e: KeyboardEvent): void
    {
        if (e.code == "ArrowLeft")
        {
            let delta: number = 0.2 * (this._xAxis.max - this._xAxis.min);
            this._xAxis.set_minMax(this._xAxis.min - delta, this._xAxis.max - delta);
            this.redraw();
        }
        if (e.code == "ArrowRight")
        {
            let delta: number = 0.2 * (this._xAxis.max - this._xAxis.min);
            this._xAxis.set_minMax(this._xAxis.min + delta, this._xAxis.max + delta);
            this.redraw();
        }
        if (e.code == "ArrowUp")
        {
            this.mouseWheel(new YDataRendering.Point(this.UIContainer.width >> 1, this.UIContainer.height >> 1), 10);
        }

        if (e.code == "ArrowDown")
        {
            this.mouseWheel(new YDataRendering.Point(this.UIContainer.width >> 1, this.UIContainer.height >> 1), -10);
        }
    }

    public mouseWheel(pos: YDataRendering.Point, delta: number): void
    { // not the most elegant way to perform the zoom transformation :-(
        let ZoomFactor: number = Math.pow(1.25, delta / 120);  // 120 is totally arbitrary
        let NextZoomX: number = this.mainViewPort.zoomx * ZoomFactor;
        if ((NextZoomX > this.mainViewPort.zoomx) && (NextZoomX > 1000)) return;
        let currentRange: number = this._xAxis.max - this._xAxis.min;
        if ((currentRange / ZoomFactor) > 25 * 365.0 * 86400.0) return;  //  more zoom out may cause overflows, never-ending loops and freeze the browser
        this.mainViewPort.IRLx += ((pos.X - this.mainViewPort.Lmargin) / this.mainViewPort.zoomx) - ((pos.X - this.mainViewPort.Lmargin) / NextZoomX);
        let range: number = this._xAxis.max - this._xAxis.min;
        this._xAxis.set_minMax(this.mainViewPort.IRLx,
            this.mainViewPort.IRLx + range / ZoomFactor);
        this.mainViewPort.zoomx = NextZoomX;
        this.redraw();
    }

    public mouseWheelEvent(sender: HTMLCanvasElement, e: WheelEvent): void
    { //uses matrix calculus to convert mouse  coord to local coord
        let p: YDataRendering.Point = this.Scr2ElmMatrix.multiplyByV(YDataRendering.Vector3.FromXYCoord(e.pageX, e.pageY)).toPoint();
        let eX: number = p.X
        let eY: number = p.Y
        this.mouseWheel(new YDataRendering.Point(eX, eY), e.deltaY > 0 ? -150 : 150);

        e.preventDefault();
    }

}

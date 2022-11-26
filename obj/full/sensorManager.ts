/*
*   Yocto-Visualization (for web), a free web-based application
*   to visualize Yoctopuce Sensors.
*
*  Yoctopuce Sensors management
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

import * as YoctoVisualization from "./YoctoVisualizationFull.js";
import * as YoctoAPI from "./YoctoApiFull.js";

export const enum HubType { LOCALUSB, LOCALHUB, REMOTEHUB }

export const enum HubState { NOTCONNECTED, CONNECTING, CONNECTED, FAILURE }

export class Hub
{

    static loginCypherPassword: string = "+>*X[?_ih$N7wA!}"
    // not really crypto functions, but since source code will end up in the client browser,
    // there is no point in using techniques more complicated than obfuscation

    static Decrypt(data: string, loginCypherPassword: string)
    {
        if (data == "") return "";

        if (data.length % 4) return "";

        let buffer: Uint16Array = new Uint16Array(data.length >> 2);
        for (let i: number = 0; i < buffer.length; i++)
        {
            buffer[i] = parseInt(data.slice(i * 4, i * 4 + 4), 16);
        }
        let checksum: number = buffer[0];
        for (let i = 1; i < buffer.length - 1; i++)
        {
            checksum ^= buffer[i]
        }
        if (checksum != buffer[buffer.length - 1]) return "";
        let res: string = "";
        for (let i: number = 0; i < buffer.length - 2; i++)
        {
            res += String.fromCharCode((buffer [i + 1] & 0x00FF) ^ loginCypherPassword.charCodeAt(i % loginCypherPassword.length) ^ ((buffer[0] + i) & 0xff) ^ (((buffer [i + 1] & 0x0800) >> 11) << ((buffer [i + 1] & 0x0700) >> 8)) ^ (((buffer [i + 1] & 0x8000) >> 15) << ((buffer [i + 1] & 0x7000) >> 12)));
        }
        return res
    }

    static Encrypt(data: string, loginCypherPassword: string): string
    {
        if (data == "") return "";

        let buffer: Uint16Array = crypto.getRandomValues(new Uint16Array(data.length + 2));
        for (let i: number = 0; i < data.length; i++)
        {
            buffer [i + 1] = (buffer [i + 1] & 0xFF00) | (data.charCodeAt(i) ^ loginCypherPassword.charCodeAt(i % loginCypherPassword.length) ^ ((buffer[0] + i) & 0xff) ^ (((buffer [i + 1] & 0x0800) >> 11) << ((buffer [i + 1] & 0x0700) >> 8)) ^ (((buffer [i + 1] & 0x8000) >> 15) << ((buffer [i + 1] & 0x7000) >> 12)));
        }
        buffer[buffer.length - 1] = buffer[0];
        for (let i = 1; i < buffer.length - 1; i++)
        {
            buffer[buffer.length - 1] ^= buffer[i]
        }

        let res: string = "";
        for (let i = 0; i < buffer.length; i++)
        {
            res += ("000" + (buffer[i]).toString(16)).slice(-4).toUpperCase();

        }
        return res;
    }

    public static encryptPassword(clearPassword: string): string
    {
        return clearPassword == "" ? "" : Hub.Encrypt(clearPassword, Hub.loginCypherPassword)

    }

    private _netname: string = "";
    private _module: YoctoAPI.YModule | null = null;
    private _logicname: string = "";
    private _previousURL: string = "";
    private _previousobfuscatedURL: string = "";

    private _hubType: HubType = HubType.REMOTEHUB;
    public get hubType(): HubType {return this._hubType;}
    public set hubType(value: HubType) {this._hubType = value;}

    private _protocol: string = "";
    public get protocol(): string {return this._protocol;}
    public set protocol(value: string) { this._protocol = value;}

    private _user: string = "";
    public get user(): string {return this._user;}
    public set user(value: string) { this._user = value;}

    private _password: string = "";
    public get encryptedPassword(): string { return this._password; }
    public set encryptedPassword(value: string) { this._password = value; }
    public get clearPassword(): string { return (this._password == "") ? "" : Hub.Decrypt(this._password, Hub.loginCypherPassword) }
    public set clearPassword(value: string) { this._password = value == "" ? "" : Hub.encryptPassword(value) }

    private _addr: string = "";
    public get addr(): string { return this._addr;}
    public set addr(value: string) { this._addr = value;}

    private _port: string = "";
    public get port(): string { return this._port; }
    public set port(value: string) {this._port = value;}

    private _removable: boolean = true;
    public get removable(): boolean { return this._removable; }
    public set removable(value: boolean) {this._removable = value;}

    private _path: string = "";
    public get path(): string { return this._path; }
    public set path(value: string) { this._path = value; }

    private _state: HubState = HubState.NOTCONNECTED;
    public get ConnectionState(): HubState { return this._state }
    public get ConnectionDescription(): string
    {
        switch (this._state)
        {
        case HubState.CONNECTING :
            return "Connecting..";
        case HubState.CONNECTED :
            return (this._logicname != "" ? this._logicname : this._netname) + " OK";
        case HubState.FAILURE :
            return "Connection failed ";
        default :
            return "Not connected.";
        }

    }

    constructor(hubType: HubType, protocol: string, user: string, password: string, clearPassword: boolean, addr: string, port: string, path: string, removeable?: boolean)
    {
        while (/^\//.test(path))
        {
            path = path.slice(1);
        }
        while (/\/$/.test(path))
        {
            path = path.slice(0, -1);
        }
        this._hubType = hubType;
        this._protocol = protocol;
        this._user = user;
        this._port = port;
        this._password = clearPassword ? (password != "" ? Hub.Encrypt(password, Hub.loginCypherPassword) : "") : password;
        this._addr = addr;
        this._path = path;
        this._removable = (typeof (removeable) === "undefined") ? true : removeable;
    }

    public static HubFromXml(subnode: YoctoVisualization.YXmlNode)
    {
        let hubType: HubType = HubType.REMOTEHUB;
        let protocol: string = "ws";
        let removable = true;
        if ("protocol" in subnode.Attributes) protocol = subnode.Attributes["protocol"];
        let user: string = "";
        if ("user" in subnode.Attributes) user = subnode.Attributes["user"];
        let password: string = "";
        if ("password" in subnode.Attributes) password = subnode.Attributes["password"];
        let port: string = "";
        if ("port" in subnode.Attributes) port = subnode.Attributes["port"];
        let path: string = "";
        if ("path" in subnode.Attributes) path = subnode.Attributes["path"];
        let addr: string = "";
        if ("addr" in subnode.Attributes) addr = subnode.Attributes["addr"];
        if ("removable" in subnode.Attributes) removable = (subnode.Attributes["removable"].toUpperCase() == "TRUE");

        return new Hub(hubType, protocol, user, password, false, addr, port, path, removable,)
    }

    public async Connect()
    {
        let errmsg: YoctoAPI.YErrorMsg = new YoctoAPI.YErrorMsg();
        this._state = HubState.CONNECTING;
        YoctoVisualization.logForm.log("preregistering  " + this.get_obfuscatedURL());
//#ifndef READONLY
        if (!YoctoVisualization.YWebPage.readonly) YoctoVisualization.configForm.hubStateChanged(this)
//#endif
        let url: string = this.get_fullUrl()

        if (await YoctoAPI.YAPI.PreregisterHub(url, errmsg) != YoctoAPI.YAPI_SUCCESS)
        {
            YoctoVisualization.logForm.log("[!] preregistering  " + this.get_obfuscatedURL() + " failed (" + errmsg.msg + ")");
            this._state = HubState.FAILURE;
            this._previousURL = "";
            this._previousobfuscatedURL = "";
        }
        else
        {
            this._previousURL = url;
            this._previousobfuscatedURL = this.get_obfuscatedURL()
        }
//#ifndef READONLY
        if (!YoctoVisualization.YWebPage.readonly) YoctoVisualization.configForm.hubStateChanged(this)
//#endif
    }

    public async Disconnect()
    {
        if (this._previousURL == "") return;
        YoctoVisualization.logForm.log("Unregistering  " + this._previousobfuscatedURL);
        await YoctoAPI.YAPI.UnregisterHub(this._previousURL);
        this._previousURL = "";
        this._previousobfuscatedURL = "";
        this._state = HubState.NOTCONNECTED;
//#ifndef READONLY
        if (!YoctoVisualization.YWebPage.readonly) YoctoVisualization.configForm.hubStateChanged(this)
//#endif
    }

    public arrival(ip: string, netname: string, module: YoctoAPI.YModule, logicname: string)
    {
        this._state = HubState.CONNECTED;
        this._netname = netname;
        this._module = module;
        this._logicname = logicname;
        this._state = HubState.CONNECTED;
//#ifndef READONLY
        if (!YoctoVisualization.YWebPage.readonly)
        {
            YoctoVisualization.configForm.hubStateChanged(this)
        }
//#endif

    }

    public get address(): string
    {
        return this._addr;
    }

    public get_consoleUrl(): string
    {
        let fullurl: string = this._protocol + "://" + this._addr;
        if (this._port != "") fullurl = fullurl + ":" + this._port; //else fullurl = fullurl + ":4444";
        return fullurl;

    }
    public toString(): string
    { return this.get_consoleUrl()}

    public get_fullUrl(): string
    {
        let fullurl: string = "";
        if (this._protocol != "") fullurl = this._protocol + "://";
        if (this._user != "")
        {
            fullurl = fullurl + this._user;
            if (this._password != "") fullurl = fullurl + ":" + Hub.Decrypt(this._password, Hub.loginCypherPassword);
            fullurl = fullurl + "@";
        }
        fullurl = fullurl + this._addr;
        if (this._port != "") fullurl = fullurl + ":" + this._port; else fullurl = fullurl + ":4444"

        fullurl = fullurl + "/";
        if (this._path)
        {
            fullurl = fullurl + this._path + "/";
        }
        return fullurl;

    }

    public get_connexionUrl(): string
    {
        let fullurl: string;
        if (this._protocol != "") fullurl = this._protocol + "://"; else fullurl = "ws://";
        fullurl = fullurl + this._addr;
        if (this._port != "") fullurl = fullurl + ":" + this._port; else fullurl = fullurl + ":4444";
        fullurl = fullurl + "/";
        return fullurl.toLowerCase();
    }

    public get_obfuscatedURL(): string
    {
        let fullurl: string = "";
        if (this._protocol != "") fullurl = this._protocol + "://";
        if (this._user != "")
        {
            fullurl = fullurl + this._user;
            if (this._password != "") fullurl = fullurl + ":#####";
            fullurl = fullurl + "@";
        }
        fullurl = fullurl + this._addr;
        if (this._port != "") fullurl = fullurl + ":" + this._port;
        if (this._path != "") fullurl = fullurl + "/" + this._path;
        return fullurl;
    }

//#ifndef READONLY
    public XmlCode(): string
    {
        let NodeLine: string = "<Hub ";
        if (this._protocol != "") NodeLine = NodeLine + "protocol=\"" + YoctoVisualization.constants.XMLquote(this._protocol) + "\" ";
        if (this._user != "") NodeLine = NodeLine + "user=\"" + YoctoVisualization.constants.XMLquote(this._user) + "\" ";
        if (this._password != "") NodeLine = NodeLine + "password=\"" + YoctoVisualization.constants.XMLquote(this._password) + "\" ";
        NodeLine = NodeLine + "addr=\"" + YoctoVisualization.constants.XMLquote(this._addr) + "\" ";
        if (this._port != "") NodeLine = NodeLine + "port=\"" + YoctoVisualization.constants.XMLquote(this.port) + "\" ";
        if (this._path != "") NodeLine = NodeLine + "path=\"" + YoctoVisualization.constants.XMLquote(this._path) + "\" ";
        if (!this._removable) NodeLine = NodeLine + "removable=\"FALSE\" ";
        return NodeLine + "/>";
    }
//#endif

}

export class TimedSensorValue
{
    private _DateTime: number;
    private _value: number;
    constructor(DateTime: number, value: number)
    {
        this._DateTime = DateTime;
        this._value = value;
    }
    public get DateTime(): number {return this._DateTime}
    public get value(): number {return this._value}

}

export class AlarmSettings
{
    private index: number = 0;
    private Condition: number = 0;
    private Source: number = 0;
    private Value: number = 0;
    private Delay: number = 15;
    private Commandline: string = "";
    private parent: CustomYSensor;
    private lastAlarm: Date = new Date(0);

    static ExecuteCommand(source: string, command: string)
    {

    }

    constructor(index: number, owner: CustomYSensor, xmldata?: YoctoVisualization.YXmlNode)
    {
        this.index = index;
        this.parent = owner;
        if (typeof xmldata !== "undefined")
        {
            if ("Source" in xmldata.Attributes) this.Source = parseInt(xmldata.Attributes["Source"]);
            if ("Condition" in xmldata.Attributes) this.Condition = parseInt(xmldata.Attributes["Condition"]);
            if ("Value" in xmldata.Attributes) this.Value = parseFloat(xmldata.Attributes["Value"]);
            if ("Cmd" in xmldata.Attributes) this.Commandline = xmldata.Attributes["Cmd"];
            if ("Delay" in xmldata.Attributes) this.Delay = parseInt(xmldata.Attributes["Delay"]);
        }
    }

//#ifndef READONLY
    public getXmlData(): string
    {
        return "<Alarm "
            + "Source=\"" + this.Source.toString() + "\" "
            + "Condition=\"" + this.Condition.toString() + "\" "
            + "Value=\"" + this.Value.toString() + "\" "
            + "Cmd=\"" + YoctoVisualization.GenericProperties.escapeXml(this.Commandline) + "\" "
            + "Delay=\"" + this.Delay.toString() + "\"/>\n";
    }
//#endif

    public setCondition(condition: number) { this.Condition = condition; }
    public getCondition(): number { return this.Condition; }
    public setSource(source: number) { this.Source = source; }
    public getSource(): number { return this.Source; }
    public setValue(value: number) { this.Value = value; }
    public getValue(): number { return this.Value; }
    public setDelay(value: number)
    {
        if (value < 0) throw "delay must be a positive value"
        this.Delay = value;
    }
    public getDelay(): number { return this.Delay; }
    public setCommandline(value: string) { this.Commandline = value; }
    public getCommandline(): string { return this.Commandline; }

    public check(m: YoctoAPI.YMeasure)
    {
        let alarm: boolean = false;
        let reason: string = "";
        let src: string;
        let SensorValue: number;
        switch (this.Source)
        {
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
        switch (this.Condition)
        {
        default :
            return;  // alarm disabled
        case 1:
            reason = ">";
            if (SensorValue > this.Value) alarm = true;
            break;
        case 2:
            reason = ">=";
            if (SensorValue >= this.Value) alarm = true;
            break;
        case 3:
            reason = "=";
            if (SensorValue == this.Value) alarm = true;
            break;
        case 4:
            reason = "<=";
            if (SensorValue <= this.Value) alarm = true;
            break;
        case 5:
            reason = "<";
            if (SensorValue < this.Value) alarm = true;
            break;
        }
        let now: Date = new Date();
        if (!alarm) return;
        if ((now.getTime() - this.lastAlarm.getTime()) < 1000 * this.Delay) return;

        let source: string = "ALARM " + (this.index + 1).toString();
        YoctoVisualization.logForm.log(source + " on " + this.parent.get_hardwareId() + "/" + this.parent.get_friendlyName() + " (" + SensorValue.toString() + reason + this.Value.toString() + ")");

        let Execute: string = this.Commandline;
        Execute = Execute.replace("$SENSORVALUE$", SensorValue.toString());
        Execute = Execute.replace("$HWDID$", this.parent.get_hardwareId());
        Execute = Execute.replace("$NAME$", this.parent.get_friendlyName());
        Execute = Execute.replace("$UNIT$", this.parent.get_unit());
        Execute = Execute.replace("$CONDITION$", reason);
        Execute = Execute.replace("$DATATYPE$", src);
        Execute = Execute.replace("$TRIGGER$", this.Value.toString());
        Execute = Execute.replace("$NOW$", YoctoVisualization.logForm.dateToString(now));

        try
        {
            Function(Execute)()
        }
        catch (e)
        {
            YoctoVisualization.logForm.log("ALARM " + (this.index + 1) + " code (" + Execute + ") caused an exception :" + (e as Error).message);
        }

        /* Alarm code is supposed to be executed here
         new Thread(() =>
          {
            Thread.CurrentThread.IsBackground = true;
             ExecuteCommand(source,Execute);
           }).Start();
        */

        this.lastAlarm = now;
    }

}

class DataLoggerBoundary
{
    private _start: number = 0;
    private _stop: number = 0;
    public constructor(start: number, stop: number)
    {
        this._start = start;
        this._stop = stop;
    }
    public get start(): number { return this._start; }
    public get stop(): number { return this._stop; }

}

class MergeSourceRange
{
    public MergeSourceStart: number = 0;
    public MergeSourceStop: number = 0;
    constructor(start: number, stop: number)
    {
        this.MergeSourceStart = start;
        this.MergeSourceStop = stop
    }
}

export class CustomYSensor
{

    private sensor: YoctoAPI.YSensor | null;
    protected hwdName: string;
    protected _friendlyname: string;
    private unit: string = "";
    private _frequency: string = "";
    private resolution: number = 1;
    private _recording: boolean = false;
    private FormsToNotify: YoctoVisualization.YWidget[];
    private _online: boolean = false;
    private preloadDone: boolean = false;
    private loadDone: boolean = false;
    private dataLoggerFeature: boolean = false;
    private cfgChgNotificationsSupported: boolean = false;
    private mustReloadConfig: boolean = false;
    private _readonly: boolean = false;
    public get isReadOnly(): boolean { return this._readonly || !this._online}
    private _plzCancelDataloggerLoading: boolean = false;

    private _predloadProcessIsBusy: boolean = false;
    private _loadProcessIsBusy: boolean = false;

    private lastGetConfig: number = 0;
    private recordedDataLoadProgress: number = 0;
    private recordedData: YoctoAPI.YDataSet | null = null;
    private loadFailed: boolean = false;
    private loadCanceled: boolean = false;
    private firstLiveDataTimeStamp: number = 0;
    private firstDataloggerTimeStamp: number = 0;
    private lastDataTimeStamp: number = 0;
    private lastDataSource: string = "";
    private consecutiveBadTimeStamp: number = 0;

    private globalDataLoadProgress: number = 0;
    public minData: TimedSensorValue[] = [];
    public curData: TimedSensorValue[] = [];
    public maxData: TimedSensorValue[] = [];

    public previewMinData: TimedSensorValue[] = [];
    public previewCurData: TimedSensorValue[] = [];
    public previewMaxData: TimedSensorValue[] = [];

    private _lastAvgValue: number = Number.NaN;
    private _lastMinValue: number = Number.NaN;
    private _lastMaxValue: number = Number.NaN;

    private dataLoggerStartReadTime: number = 0;
    private Alarms: AlarmSettings[] = [];

    private static _MaxDataRecords: number = 0;
    public static get MaxDataRecords(): number { return CustomYSensor._MaxDataRecords; }
    public static set MaxDataRecords(value: number) { CustomYSensor._MaxDataRecords = value; }

    private static _MaxLoggerRecords: number = 0;
    public static get MaxLoggerRecords(): number { return CustomYSensor._MaxLoggerRecords;}
    public static set MaxLoggerRecords(value: number) { CustomYSensor._MaxLoggerRecords = value;}

    public get_lastAvgValue(): number
    {
        if (this._online) return this._lastAvgValue;
        return Number.NaN;
    }

    public get_lastMaxValue(): number
    {
        if (this._online) return this._lastMaxValue;
        return Number.NaN;
    }

    public get_lastMinValue(): number
    {
        if (this._online) return this._lastMinValue;
        return Number.NaN;
    }

    public async ConfigHasChanged(): Promise<void>
    {
        this.cfgChgNotificationsSupported = true;
        this.mustReloadConfig = true;
        this._online = true;
        await this.reloadConfig();
        await this.forceUpdate();
    }

    constructor(s: YoctoAPI.YSensor | null, name: string, SensorLocalConfig: YoctoVisualization.YXmlNode | null)
    {
        this.FormsToNotify = [];
        this.sensor = s;
        this.hwdName = name;
        this._friendlyname = name;
        if (s == null) return;

        if (SensorLocalConfig != null)
        {
            let index: number = 0;
            let childs: YoctoVisualization.YXmlNode[] = SensorLocalConfig.get_childsByIndex();
            for (let i: number = 0; i < childs.length; i++)
            {
                let n: YoctoVisualization.YXmlNode = childs[i]
                if (n.Name == "Alarm")
                {
                    this.checkAlarmIndex(index);
                    this.Alarms[index] = new AlarmSettings(index, this, n);
                    index++;
                }
            }
        }
    }

    private checkAlarmIndex(index: number)
    {
        while (this.Alarms.length < index + 1)
        {
            this.Alarms.push(new AlarmSettings(this.Alarms.length, this));
        }

    }

    public getAlarmCount(): number
    {
        return this.Alarms.length;
    }

    public setAlarmCondition(index: number, condition: number)
    {
        this.checkAlarmIndex(index);
        this.Alarms[index].setCondition(condition);
    }
    public getAlarmCondition(index: number): number
    {
        this.checkAlarmIndex(index);
        return this.Alarms[index].getCondition();
    }
    public setAlarmSource(index: number, source: number)
    {
        this.checkAlarmIndex(index);
        this.Alarms[index].setSource(source);
    }
    public getAlarmSource(index: number): number
    {
        this.checkAlarmIndex(index);
        return this.Alarms[index].getSource();
    }
    public setAlarmValue(index: number, value: number)
    {
        this.checkAlarmIndex(index);
        this.Alarms[index].setValue(value);
    }
    public getAlarmValue(index: number): number
    {
        this.checkAlarmIndex(index);
        return this.Alarms[index].getValue();
    }
    public setAlarmDelay(index: number, value: number)
    {
        this.checkAlarmIndex(index);
        this.Alarms[index].setDelay(value);
    }
    public getAlarmDelay(index: number): number
    {
        this.checkAlarmIndex(index);
        return this.Alarms[index].getDelay();
    }
    public setAlarmCommandline(index: number, value: string)
    {
        this.checkAlarmIndex(index);
        this.Alarms[index].setCommandline(value);
    }
    public getAlarmCommandline(index: number)
    {
        this.checkAlarmIndex(index);
        return this.Alarms[index].getCommandline();
    }

//#ifndef READONLY
    public GetXmlData(): string
    {
        let res: string = "<Sensor ID=\"" + this.get_hardwareId() + "\">\n";
        for (let i: number = 0; i < this.getAlarmCount(); i++)
        {
            res = res + this.Alarms[i].getXmlData();
        }
        res = res + "</Sensor>\n";
        return res;
    }
//#endif

    public getGetaLoadProgress(): number { return this.globalDataLoadProgress; }
    public get_firstLiveDataTimeStamp(): number { return this.firstLiveDataTimeStamp; }
    public get_firstDataloggerTimeStamp(): number { return this.firstDataloggerTimeStamp; }
    public get_lastDataTimeStamp(): number { return this.lastDataTimeStamp; }

    protected async preload_DoWork(arg: DataLoggerBoundary)
    {
        this._predloadProcessIsBusy = true;
        YoctoVisualization.logForm.log(this.hwdName + ": preloading data from " + arg.start.toString() + " to " + arg.stop.toString() + "(delta= " + (arg.stop - arg.start).toFixed(3) + ")");
        this.recordedData = await (<YoctoAPI.YSensor>this.sensor).get_recordedData(arg.start, arg.stop);
        try
        {
            this.recordedDataLoadProgress = await this.recordedData.loadMore();
        }
        catch (e)
        { YoctoVisualization.logForm.log(this.hwdName + ": load more caused an exception " + (e as Error).message); }

        this.globalDataLoadProgress = this.recordedDataLoadProgress;

        let measures: YoctoAPI.YMeasure[] = await this.recordedData.get_preview();

        this.previewMinData = [];
        this.previewCurData = [];
        this.previewMaxData = [];
        let startIndex: number = 0;
        let errCount=0;
        let maxErrorCount =10;
        let lastT :number=-1;
        if ((CustomYSensor._MaxDataRecords > 0) && (measures.length > CustomYSensor._MaxDataRecords)) startIndex = measures.length - CustomYSensor._MaxDataRecords;

        for (let i: number = startIndex; i < measures.length; i++)
        {
            let t: number = measures[i].get_endTimeUTC();
            if ((t >= arg.start) && (t <= arg.stop)) // returned dataset might be slightly larger than what we asked for
            {
                this.previewMinData.push(new TimedSensorValue(t, measures[i].get_minValue()));
                this.previewCurData.push(new TimedSensorValue(t, measures[i].get_averageValue()));
                this.previewMaxData.push(new TimedSensorValue(t, measures[i].get_maxValue()));
                if ((t<lastT) && (errCount<maxErrorCount))
                { YoctoVisualization.logForm.log(this.hwdName + " preloading warning:  timestamp going back in time "+t+"<"+lastT+(errCount<maxErrorCount-1?"":", further similar errors wont be logged."));
                  errCount++;
                }
                else
                if ((t==lastT) && (errCount<maxErrorCount))
                { YoctoVisualization.logForm.log(this.hwdName + " preloading warning: duplicate timestamp  "+t+(errCount<maxErrorCount-1?"":", further similar errors wont be logged."));
                  errCount++;
                }
                lastT=t;
            }
        }

        if (this.previewCurData.length > 1)
        {
            let a: number = this.previewCurData[0].DateTime;
            let b: number = this.previewCurData[this.previewCurData.length - 1].DateTime;

            YoctoVisualization.logForm.log(this.hwdName + ": preloaded data from " + a.toString() + " to " + b.toString() + " (delta=" + (b - a).toFixed(3) + ")");

            if ((CustomYSensor._MaxLoggerRecords > 0) && (arg.start == 0))
            { // find out where to start reading datalogger to make sure we don't read more the _MaxLoggerRecords records
                // tested only when loading initial data (arg.start==0)

                let list: YoctoAPI.YDataStream[] = await this.recordedData.get_privateDataStreams();
                let index: number = list.length - 1;
                let totalRecords: number = 0;
                while ((index > 0) && (totalRecords < CustomYSensor._MaxLoggerRecords))
                {
                    totalRecords += await list[index].get_rowCount();
                    this.dataLoggerStartReadTime = await list[index].get_startTimeUTC();
                    index--;
                }

                let n: number = 0;
                while ((n < this.previewMinData.length) && (this.previewMinData[n].DateTime < this.dataLoggerStartReadTime))
                {
                    n++;
                }
                if (n > 1)
                {
                    this.previewMinData.splice(0, n - 1);
                    this.previewCurData.splice(0, n - 1);
                    this.previewMaxData.splice(0, n - 1);
                }

            }
        }

        this.preload_Completed(arg)
    }

    protected findMergeBoundaries(previewMinData: TimedSensorValue[]): MergeSourceRange
    {
        let MergeSourceStart: number = 0;
        let MergeSourceStop: number = 0;
        if (this.minData.length > 0)
        {
            while ((MergeSourceStart < this.minData.length) && (previewMinData[0].DateTime > this.minData[MergeSourceStart].DateTime))
            {
                MergeSourceStart++;
            }
            MergeSourceStop = MergeSourceStart;
            while ((MergeSourceStop < this.minData.length) && (previewMinData[previewMinData.length - 1].DateTime >= this.minData[MergeSourceStop].DateTime))
            {
                MergeSourceStop++;
            }
        }
        return new MergeSourceRange(MergeSourceStart, MergeSourceStop);
    }

    protected preload_Completed(arg: DataLoggerBoundary)
    {
        if (this.previewMinData == null) return;
        YoctoVisualization.logForm.log(this.hwdName + " : datalogger preloading completed (" + this.previewMinData.length + " rows )");

        if (this.previewMinData.length > 1) // make sure there is enough data not enough data for rendering
        { // find out where datalogger data fit in the already there data

            let it: MergeSourceRange = this.findMergeBoundaries(this.previewMinData);
            // insert loaded data in current data

            // target.slice(0, insertIndex).concat(insertArr, target.slice(insertIndex));
            let insertIndex = it.MergeSourceStart;
            let deleteCount = it.MergeSourceStop - it.MergeSourceStart;

            this.minData = this.minData.slice(0, insertIndex).concat(this.previewMinData, this.minData.slice(insertIndex + deleteCount));
            this.curData = this.curData.slice(0, insertIndex).concat(this.previewCurData, this.curData.slice(insertIndex + deleteCount));
            this.maxData = this.maxData.slice(0, insertIndex).concat(this.previewMaxData, this.maxData.slice(insertIndex + deleteCount));

//    this.minData.splice(it.MergeSourceStart, it.MergeSourceStop - it.MergeSourceStart,...this.previewMinData); // will cause a stack overfly if too many data
//    this.curData.splice(it.MergeSourceStart, it.MergeSourceStop - it.MergeSourceStart,...this.previewCurData);
//    this.maxData.splice(it.MergeSourceStart, it.MergeSourceStop - it.MergeSourceStart,...this.previewMaxData);
            for (let i: number = 0; i < this.FormsToNotify.length; i++)
            {
                if (this.FormsToNotify[i] instanceof YoctoVisualization.graphWidget)
                {
                    (this.FormsToNotify[i] as YoctoVisualization.graphWidget).SensorNewDataBlock(this, it.MergeSourceStart, it.MergeSourceStart + this.previewMinData.length - 1, 0, true);
                }
            }
        }

        let count: number = this.curData.length;
        if (count > 0)
        {
            if (this.curData[count - 1].DateTime > this.lastDataTimeStamp)
            {
                this.lastDataTimeStamp = this.curData[count - 1].DateTime;
                this.lastDataSource = "last preload timestamp";
            }
        }

        // if (recordedDataLoadProgress < 100)
        // {
        YoctoVisualization.logForm.log(this.hwdName + " : start datalogger loading");

        // loadProcess.RunWorkerAsync(e.Result); // e.result contains the start stop parameters

        // }
        this._predloadProcessIsBusy = false;
        this.load_DoWork(arg).then();
    }

    public get_frequency(): string
    {
        return this._frequency;

    }

    private async updateFrequncy(frequencyToSet: string): Promise<void>
    {
        if (await (<YoctoAPI.YSensor>this.sensor).isOnline())
        {
            this._frequency = frequencyToSet;
            await (<YoctoAPI.YSensor>this.sensor).set_reportFrequency(this._frequency);
            let lfreq: string = await (<YoctoAPI.YSensor>this.sensor).get_logFrequency();
            try
            {
                if (lfreq != "OFF") await (<YoctoAPI.YSensor>this.sensor).set_logFrequency(this._frequency);
                let m: YoctoAPI.YModule = await (<YoctoAPI.YSensor>this.sensor).get_module();
                await m.saveToFlash();
            }
            catch (e)
            {
                YoctoVisualization.logForm.log("failed to change " + this.hwdName + " log frequency (" + (e as Error).message + ")");

            }

        }
        else
        {
            this._online = false;
        }
    }
    public set_frequency(frequencyToSet: string): void
    {
        if (this._online)
        {
            this.updateFrequncy(frequencyToSet).then();
        }
    }

    public get_recording(): boolean
    {
        return this._recording

    }

    public set_recording(recordingStatus: boolean)
    {
        this.updaterecording(recordingStatus).then();
    }

    public async updaterecording(recordingStatus: boolean)
    {
        if (!this.dataLoggerFeature) return;
        if (await (<YoctoAPI.YSensor>this.sensor).isOnline())
        {
            this._recording = recordingStatus;
            try
            {
                await (<YoctoAPI.YSensor>this.sensor).set_logFrequency(this._recording ? this._frequency : "OFF");
                let module: YoctoAPI.YModule = await (<YoctoAPI.YSensor>this.sensor).get_module();
                let serial: string = await module.get_serialNumber()
                let dl: YoctoAPI.YDataLogger = YoctoAPI.YDataLogger.FindDataLogger(serial + ".dataLogger");
                await dl.set_recording(this._recording ? YoctoAPI.YDataLogger.RECORDING_ON : YoctoAPI.YDataLogger.RECORDING_OFF);
                await dl.set_autoStart(this._recording ? YoctoAPI.YDataLogger.AUTOSTART_ON : YoctoAPI.YDataLogger.AUTOSTART_OFF);
                await module.saveToFlash();
            }
            catch (e)
            {
                YoctoVisualization.logForm.log("failed to change " + this.hwdName + " recording (" + (e as Error).message + ")");
            }
        }
        else
        {
            this._online = false;
        }
    }

    protected reportDataloggerLoadProgress(progress: number) {}
    protected async load_DoWork(arg: DataLoggerBoundary)
    {
        if (this._loadProcessIsBusy) return;
        this._loadProcessIsBusy = true;

        YoctoVisualization.logForm.log(this.hwdName + " loading main data from datalogger");
        if (this.dataLoggerStartReadTime > 0)
        {
            this.recordedData = await (<YoctoAPI.YSensor>this.sensor).get_recordedData(this.dataLoggerStartReadTime, 0);
        }

       let errCount=0;
       let maxErrorCount =10;
       let lastT :number=-1;
       let lastProgress:number=0;

        while (this.recordedDataLoadProgress < 100)
        {

            if (this._plzCancelDataloggerLoading)
            {
                this.globalDataLoadProgress = 100;
                this.loadDone = true;
                this.loadFailed = false;
                this.loadCanceled = true;
                break;
            }

            try
            {
                this.recordedDataLoadProgress = await (<YoctoAPI.YDataSet>this.recordedData).loadMore();
                //LogManager.Log(hwdName + " loading " + recordedDataLoadProgress.ToString() + "%");
            }
            catch (Exception)
            {
                this.loadFailed = true;
                return;
            }

            if (this.globalDataLoadProgress != (this.recordedDataLoadProgress))
            {
                this.globalDataLoadProgress = this.recordedDataLoadProgress;
                this.reportDataloggerLoadProgress(this.globalDataLoadProgress);
            }

            if ((this.recordedDataLoadProgress-lastProgress)>=2)
            {   lastProgress = this.recordedDataLoadProgress;
                this.load_ProgressChanged();
            }
        }

        let measures: YoctoAPI.YMeasure[] = await (<YoctoAPI.YDataSet>this.recordedData).get_measures();

        this.previewMinData = [];
        this.previewCurData = [];
        this.previewMaxData = [];
        for (let i = 0; i < measures.length; i++)
        {
            let t: number = measures[i].get_endTimeUTC();
            // debug
            // let d :Date = new Date(t * 1000)
            // console.log(this.hwdName +"loaded "+d.toLocaleDateString()+" "+d.toLocaleTimeString()+" "+measures[i].get_minValue()+","+measures[i].get_averageValue()+","+measures[i].get_maxValue()+" arg was "+arg.start+" "+arg.stop)
            // end debug

            if ((t >= arg.start) && (t <= arg.stop))   // trust no one!
            {
                if ((t<lastT) && (errCount<maxErrorCount))
                { YoctoVisualization.logForm.log(this.hwdName + " loading warning:  timestamp going back in time "+t+"<"+lastT+(errCount<maxErrorCount-1?"":", further similar errors wont be logged."));
                    errCount++;
                }
                else
                if ((t==lastT)  && (errCount<maxErrorCount))
                { YoctoVisualization.logForm.log(this.hwdName + " loading warning: duplicate timestamp  "+t+(errCount<maxErrorCount-1?"":", further similar errors wont be logged."));
                    errCount++;
                }
                lastT=t;


                if ((this.previewMinData.length == 0) || (t > this.previewMinData[this.previewMinData.length - 1].DateTime))
                {
                    this.previewMinData.push(new TimedSensorValue(t, measures[i].get_minValue()));
                    this.previewCurData.push(new TimedSensorValue(t, measures[i].get_averageValue()));
                    this.previewMaxData.push(new TimedSensorValue(t, measures[i].get_maxValue()));
                }
            } else {
                let d: Date = new Date(t * 1000);
                let d1: Date = new Date(arg.start * 1000);
                let d2: Date = new Date(arg.stop * 1000);
                let dstr: string = d.toLocaleDateString()+" "+d.toLocaleTimeString();
                let d1str: string = d1.toLocaleDateString()+" "+d1.toLocaleTimeString();
                let d2str: string = d2.toLocaleDateString()+" "+d2.toLocaleTimeString();
                console.log(this.hwdName +" note: skipping measure at "+dstr+", not in range "+d1str+" ... "+d2str);
            }
        }

        if (CustomYSensor._MaxDataRecords > 0) this.previewDataCleanUp();

        for (let i: number = 0; i < this.previewMinData.length - 1; i++)
        {
            if (this.previewMinData[i].DateTime >= this.previewMinData[i + 1].DateTime)
            {
                throw "Time-stamp inconsistency";
            }
        }

        if (this.previewCurData.length > 1)
        {
            YoctoVisualization.logForm.log(this.hwdName + " loaded " + this.previewCurData.length.toString() + "/" + measures.length.toString() + " records over " + (this.previewCurData[this.previewCurData.length - 1].DateTime - this.previewCurData[0].DateTime).toFixed(3) + " sec");
        }
        else
        {
            YoctoVisualization.logForm.log(this.hwdName + " loaded " + this.previewCurData.length.toString() + " records");
        }

        if (this.previewMinData.length > 2)
        {
            this.globalDataLoadProgress = 100;
            let lastPreviewTimeStamp: number = this.previewMinData[this.previewMinData.length - 1].DateTime;
            //while ((index < minData.Count) && (minData[index].DateTime < lastPreviewTimeStamp)) index++;
            //LogManager.Log(hwdName + " time range is ["+constants.UnixTimeStampToDateTime(previewMinData[0].DateTime)+".."+ constants.UnixTimeStampToDateTime(lastPreviewTimeStamp)+"]");
            // find out where datalogger data fit in the already there data
            let it: MergeSourceRange = this.findMergeBoundaries(this.previewMinData);
            let deleteCount = it.MergeSourceStop - it.MergeSourceStart;

            this.minData = this.minData.slice(0, it.MergeSourceStart).concat(this.previewMinData, this.minData.slice(it.MergeSourceStart + deleteCount));
            this.curData = this.curData.slice(0, it.MergeSourceStart).concat(this.previewCurData, this.curData.slice(it.MergeSourceStart + deleteCount));
            this.maxData = this.maxData.slice(0, it.MergeSourceStart).concat(this.previewMaxData, this.maxData.slice(it.MergeSourceStart + deleteCount));

            //this.minData.splice(it.MergeSourceStart, recordcount,...this.previewMinData); // will cause a stack overflow if too many data
            //this.curData.splice(it.MergeSourceStart, recordcount,...this.previewCurData);
            //this.maxData.splice(it.MergeSourceStart, recordcount,...this.previewMaxData);
            this.firstDataloggerTimeStamp = this.curData[0].DateTime;
        }

        this.loadDone = true;
        this.loadFailed = false;

        let count = this.curData.length;
        if (count > 0)
        {
            if (this.curData[count - 1].DateTime > this.lastDataTimeStamp)
            {
                this.lastDataTimeStamp = this.curData[count - 1].DateTime;
                this.lastDataSource = "end of datalogger";
            }
        }

        this.load_Completed()

    }

    protected load_Completed()
    {

        if (this.loadFailed)
        {
            YoctoVisualization.logForm.log(this.hwdName + " : datalogger loading failed");
            this._loadProcessIsBusy = false;
            return;
        }

        if ((this.loadCanceled))
        {
            YoctoVisualization.logForm.log(this.hwdName + " : datalogger loading was canceled");
            this.previewMinData = []
            this.previewCurData = []
            this.previewMaxData = []
            this.loadCanceled = false;
            this._loadProcessIsBusy = false;
            this.preloadDone = false;
            this.loadDone = false;
            return;
        }

        if (this.previewCurData.length <= 2)
        {
            this.preloadDone = false;
            this.loadDone = false;

        }

        YoctoVisualization.logForm.log(this.hwdName + " : datalogger loading completed  (" + this.previewMinData.length + " rows )");

        this.loadDone = true;
        this.globalDataLoadProgress = 100;
        if (this.previewMinData.length <= 0)
        {
            for (let i: number = 0; i < this.FormsToNotify.length; i++)
            {
                if (this.FormsToNotify[i] instanceof YoctoVisualization.graphWidget)
                {
                    (this.FormsToNotify[i] as YoctoVisualization.graphWidget).DataLoggerProgress();
                }
            }
            return;
        }

        for (let i: number = 0; i < this.FormsToNotify.length; i++)
        {
            if (this.FormsToNotify[i] instanceof YoctoVisualization.graphWidget)
            {
                (this.FormsToNotify[i] as YoctoVisualization.graphWidget).DataloggerCompleted(this);
                (this.FormsToNotify[i] as YoctoVisualization.graphWidget).DataLoggerProgress();
            }
        }
        this.previewMinData = [];
        this.previewCurData = [];
        this.previewMaxData = [];
        this.preloadDone = false;
        this.loadDone = false;
        this._loadProcessIsBusy = false;
    }

    private dataCleanUp()
    {
        if (CustomYSensor._MaxDataRecords <= 0) return;
        let newsize: number = ((CustomYSensor._MaxDataRecords * 90) / 100) >> 0;
        if ((this.curData != null) && (CustomYSensor._MaxDataRecords < this.curData.length))
        {
            this.minData.splice(0, this.minData.length - newsize);
            this.curData.splice(0, this.curData.length - newsize);
            this.maxData.splice(0, this.maxData.length - newsize);
        }

    }

    private previewDataCleanUp()
    {
        if (CustomYSensor._MaxDataRecords <= 0) return;
        let newsize: number = ((CustomYSensor._MaxDataRecords * 90) / 100) >> 0;
        if ((this.previewMinData != null) && (CustomYSensor._MaxDataRecords < this.previewMinData.length))
        {
            this.previewMinData.splice(0, this.previewMinData.length - newsize);
            this.previewCurData.splice(0, this.previewCurData.length - newsize);
            this.previewMaxData.splice(0, this.previewMaxData.length - newsize);
        }
    }

    public stopDataloggerloading()
    {
        /*
        dataMutex.WaitOne();
        minData.Clear();
        curData.Clear();
        maxData.Clear();
        dataMutex.ReleaseMutex();
        firstLiveDataTimeStamp = 0;
        firstDataloggerTimeStamp = 0;
        lastDataTimeStamp = 0;
        lastDataSource = "stop";

        if (!loadProcess.CancellationPending) loadProcess.CancelAsync();
        load_ProgressChanged(null, null);
       */
    }
    protected load_ProgressChanged()
    {
       for (let i :number = 0; i < this.FormsToNotify.length; i++)
         if  (this.FormsToNotify[i] instanceof  YoctoVisualization.graphWidget)
          (this.FormsToNotify[i] as YoctoVisualization.graphWidget) .DataLoggerProgress();

    }

    public isOnline(): boolean
    {
        return this._online;
    }

    public async reloadConfig(): Promise<void>
    {
        if (this._online)
        {
            let ison: boolean = await (<YoctoAPI.YSensor>this.sensor).isOnline();

            if (ison)
            {
                try
                {
                    this.unit = await (<YoctoAPI.YSensor>this.sensor).get_unit();
                    this._friendlyname = await (<YoctoAPI.YSensor>this.sensor).get_friendlyName();
                    this.resolution = await (<YoctoAPI.YSensor>this.sensor).get_resolution();
                    this._frequency = await (<YoctoAPI.YSensor>this.sensor).get_reportFrequency();
                    this._readonly = await (<YoctoAPI.YSensor>this.sensor).isReadOnly();
                    if (this.dataLoggerFeature)
                    {
                        this._recording = (await (<YoctoAPI.YSensor>this.sensor).get_logFrequency()) != "OFF";
                    }
                    else
                    {
                        this._recording = false;
                    }
                    this.lastGetConfig = YoctoAPI.YAPI.GetTickCount();

                    this.mustReloadConfig = false;
                }
                catch (e)
                { YoctoVisualization.logForm.log("reload configuration error: " + (e as Error).message); }
            }
            else
            {
                this._online = false;
            }
        }

    }

    public get_unit(): string
    {
        if ((this.cfgChgNotificationsSupported) && (!this.mustReloadConfig)) return this.unit;
        if ((this.lastGetConfig <= 0) || (YoctoAPI.YAPI.GetTickCount() - this.lastGetConfig > 5000)) this.reloadConfig().then();
        return this.unit;
    }

    public get_resolution(): number
    {
        if ((this.cfgChgNotificationsSupported) && (!this.mustReloadConfig)) return this.resolution;
        if ((this.lastGetConfig <= 0) || (YoctoAPI.YAPI.GetTickCount() - this.lastGetConfig > 5000)) this.reloadConfig().then();
        return this.resolution;
    }

    public loadDatalogger(start: number, stop: number)
    {
        if (!this.dataLoggerFeature) return;
        if (this._predloadProcessIsBusy) return;
        if (this._loadProcessIsBusy) return;

        if (YoctoVisualization.constants.maxPointsPerDataloggerSerie < 0)
        {
            YoctoVisualization.logForm.log(this.hwdName + " : datalogger access is disabled");
            return;
        }

       /* if (this.isReadOnly)
        {
            YoctoVisualization.logForm.log(this.hwdName + " is read only, cannot load the datalogger contents  (yes that's a bug)");
            return;
        }
       */
        if ((!this.preloadDone) && this.dataLoggerFeature)
        {
            YoctoVisualization.logForm.log(this.hwdName + " : start datalogger preloading");
            this.preload_DoWork(new DataLoggerBoundary(start, stop)).then();

        }

    }

    public async arrival(dataloggerOn: boolean): Promise<void>
    {

        await this.configureSensor();
        this._online = true;
        await this.reloadConfig();
        let dt: YoctoAPI.YDataLogger | null = await (<YoctoAPI.YSensor>this.sensor).get_dataLogger();
        if (dt == null) return;
        if (this.curData.length > 0)
        {
            let end: number = await dt.get_timeUTC();
            let start: number = this.curData[this.curData.length - 1].DateTime;
            let duration: number = end - start;
            if (duration > 1)
            {
                YoctoVisualization.logForm.log(this.hwdName + " is back online trying to load " + duration.toFixed(3) + " sec of data from datalogger ");
                this.loadDatalogger(start, end);
            }
        }
        else
        {
            this.loadDatalogger(0, await dt.get_timeUTC());
        }
        if (this.isReadOnly) YoctoVisualization.logForm.log(this.hwdName + " is read only");
        this.notifySensorStateChange();
    }

    public notifySensorStateChange(): void
    {
        for (let i = 0; i < this.FormsToNotify.length; i++)
        {
            this.FormsToNotify[i].SensorStateChangedcallback(this);
        }
    }

    public removal()
    {
        this._online = false;
        this.forceUpdate();
        this.notifySensorStateChange();

    }

    public async configureSensor(): Promise<void>
    {
        YoctoVisualization.logForm.log("Configuring  " + this.hwdName);
        if (!await (<YoctoAPI.YSensor>this.sensor).isOnline()) return;
        let mustSave: boolean = false;
        let olfreq: string = await (<YoctoAPI.YSensor>this.sensor).get_logFrequency();
        let orfreq: string = await (<YoctoAPI.YSensor>this.sensor).get_reportFrequency();
        let readOnly : boolean = await (<YoctoAPI.YSensor>this.sensor).isReadOnly();
        let lfreq: string = olfreq;
        let rfreq: string = orfreq;
        let m: YoctoAPI.YModule = await (<YoctoAPI.YSensor>this.sensor).get_module();
        for (let i: number = 0; i < await m.functionCount(); i++)
        {
            if (await m.functionType(i) == "DataLogger")
            {
                this.dataLoggerFeature = true;
            }
        }
        try
        {
            if (this.dataLoggerFeature)
            {
                let m: YoctoAPI.YModule = await (<YoctoAPI.YSensor>this.sensor).get_module();
                let dl: YoctoAPI.YDataLogger = YoctoAPI.YDataLogger.FindDataLogger(await m.get_serialNumber() + ".dataLogger");
                let dataloggerOn: boolean = await dl.get_recording() != YoctoAPI.YDataLogger.RECORDING_OFF;
                let dataloggerAS: boolean = await dl.get_autoStart() != YoctoAPI.YDataLogger.AUTOSTART_OFF;
                if (!dataloggerOn)
                { lfreq = "OFF"; }
                if (lfreq != "OFF")
                { rfreq = lfreq; }
                else if (rfreq == "OFF")
                { rfreq = "1/s"; }
                if (lfreq != olfreq)
                {   if (readOnly) throw new Error(this.hwdName+" is read only, cannot change its logFrequency from " +olfreq+" to "+lfreq);
                    await (<YoctoAPI.YSensor>this.sensor).set_logFrequency(lfreq);

                    mustSave = true;
                }
                if (rfreq != orfreq)
                {   if (readOnly) throw new Error(this.hwdName+" is read only, connot change its  reportFrequency from " +orfreq+" to "+rfreq);
                    await (<YoctoAPI.YSensor>this.sensor).set_reportFrequency(rfreq);
                    mustSave = true;
                }
                if (lfreq != "OFF")
                {
                    if (!dataloggerOn)
                    {   if (readOnly) throw new Error(this.hwdName+" is read only, cannot change set its  datalogger recording to ON");
                        await dl.set_recording(YoctoAPI.YDataLogger.RECORDING_ON); }
                    if (!dataloggerAS)
                    {   if (readOnly) throw new Error(this.hwdName+" is read only, cannot change set its datalogger autostart to ON");
                        await dl.set_autoStart(YoctoAPI.YDataLogger.AUTOSTART_ON);
                        mustSave = true;
                    }
                }
            }
            else
            {
                lfreq = "OFF";
                if (rfreq == "OFF")
                {
                    rfreq = "1/s";
                    if (readOnly) throw new Error(this.hwdName+" is read only, connot change is reportFrequency from OFF to "+rfreq);
                    await (<YoctoAPI.YSensor>this.sensor).set_reportFrequency(rfreq);
                    mustSave = true;
                }
            }
            if (mustSave) await m.saveToFlash();
        }
        catch (e)
        {
            YoctoVisualization.logForm.log("failed to configure " + this.hwdName + "  (" + (e as Error).message + ")");
        }
        YoctoVisualization.logForm.log("registering timed callback for  " + await (<YoctoAPI.YSensor>this.sensor).get_hardwareId())
        await (<YoctoAPI.YSensor>this.sensor).registerTimedReportCallback((callbacksource: YoctoAPI.YSensor, M: YoctoAPI.YMeasure) => { this.TimedCallback(callbacksource, M)});
        this._recording = (lfreq != "OFF");
        this._frequency = rfreq;
    }

    public registerCallback(f: YoctoVisualization.YWidget)
    {
        if (this.FormsToNotify.indexOf(f) >= 0) return;
        this.FormsToNotify.push(f);
        return;
    }

    public forceUpdate()
    {
        this.TimedCallback(<YoctoAPI.YSensor>this.sensor, null).then();
    }

    public async TimedCallback(source: YoctoAPI.YSensor, M: YoctoAPI.YMeasure | null): Promise<void>
    {
        if (M != null)
        {
            this._online = true;
            let t: number = M.get_endTimeUTC();
            // YoctoVisualization.logForm.log(await source.get_hardwareId() + " :: TimedCallback : " + t.toFixed(3));

            if (this.firstLiveDataTimeStamp == 0) this.firstLiveDataTimeStamp = t;
            if (t > this.lastDataTimeStamp)
            {
                this.lastDataTimeStamp = t;
                this.lastDataSource = "last timedReport";
                this.consecutiveBadTimeStamp = 0;
            }
            else
            {
                this.consecutiveBadTimeStamp++;
                if (this.consecutiveBadTimeStamp < 10)
                {
                    YoctoVisualization.logForm.log(this.hwdName + ": ignoring bad timestamp " + t.toFixed(3) + " (previous " + this.lastDataSource + " at " + this.lastDataTimeStamp.toFixed(3) + ")");
                }
            }
            if ((this.consecutiveBadTimeStamp == 0) || (this.consecutiveBadTimeStamp >= 10))
            {
                this._lastAvgValue = M.get_averageValue();
                this._lastMinValue = M.get_minValue();
                this._lastMaxValue = M.get_maxValue();
                this.curData.push(new TimedSensorValue(t, this._lastAvgValue));
                this.minData.push(new TimedSensorValue(t, this._lastMinValue));
                this.maxData.push(new TimedSensorValue(t, this._lastMaxValue));
                if (CustomYSensor._MaxDataRecords > 0) this.dataCleanUp();
            }
            for (let i: number = 0; i < this.Alarms.length; i++)
            {
                this.Alarms[i].check(M);
            }
        }

        for (let i = 0; i < this.FormsToNotify.length; i++)
        {
            this.FormsToNotify[i].SensorValuecallback(this, M);
        }

    }

    public forgetForm(source: YoctoVisualization.YWidget)
    {
        for (let i = this.FormsToNotify.length - 1; i >= 0; i--)
        {
            if (source == this.FormsToNotify[i])
            {
                this.FormsToNotify.splice(i, 1)
            }
        }
    }

    public get_sensor(): YoctoAPI.YSensor | null
    {
        return this.sensor;
    }

    public get_hardwareId(): string
    { return this.hwdName; }

    public get_friendlyName(): string
    {

        return this._friendlyname;
    }

    public toString(): string
    {
        let name: string = this._friendlyname;
        if (this._readonly) name += " (readonly)"
        if (this._online) return name;
        return name + " (OFFLINE)";

    }
}

export class NullYSensor extends CustomYSensor
{
    constructor()
    {
        super(null, "", null)
        this.hwdName = "NOTAREALSENSOR";
        this._friendlyname = "NOTAREALSENSOR";
    }
    public get_unit(): string { return ""; }
    public registerCallback(Form: YoctoVisualization.YWidget) { }
    public forceUpdate(): void { }
    public get_frequency(): string { return ""; }
    public set_frequency(frequencyToSet: string): void { }
    public get_sensor(): YoctoAPI.YSensor | null { return null; }
    public toString(): string { return "(none)"; }
    public setAlarmCondition(index: number, condition: number) { }
    public getAlarmCondition(index: number): number { return 0; }
    public setAlarmValue(index: number, value: number) { }
    public getAlarmValue(index: number): number { return 0; }
    public setAlarmDelay(index: number, value: number) { }
    public getAlarmDelay(index: number): number { return 0; }
    public setAlarmCommandline(index: number, value: string) { }
    public getAlarmCommandline(index: number): string { return ""; }

}

export interface SensorManagerChangeCallback {(): void}

export class sensorsManager
{

    private static counter: number = 0;

    public static sensorList: CustomYSensor[];  // actual list of sensors
    public static NullSensor: CustomYSensor;
    private static KnownSensors: YoctoVisualization.YXmlNode | null = null;  // sensors list picked up from XML configuration file
    private static _hubList: YoctoVisualization.Hub[] = [];

    private static _changeCallback: SensorManagerChangeCallback | null = null;
    private static _changeExternalCallback: YoctoVisualization.ConfigChangeHandler | null = null;

    public static async clearHublist()
    {
        for (let i: number = sensorsManager._hubList.length - 1; i >= 0; i--)
        {
            if (sensorsManager._hubList[i].removable)
            {
                await YoctoAPI.YAPI.UnregisterHub(sensorsManager._hubList[i].get_fullUrl());
                sensorsManager._hubList.splice(i, 1);
            }
        }
    }

    public static registerChangeCallback(changeCallback: SensorManagerChangeCallback)
    { this._changeCallback = changeCallback; }

    public static registerChangeExternalCallback(changeCallback: YoctoVisualization.ConfigChangeHandler)
    { this._changeExternalCallback = changeCallback; }

    public static forgetForm(source: YoctoVisualization.YWidget)
    {
        for (let i = 0; i < sensorsManager.sensorList.length; i++)
        {
            sensorsManager.sensorList[i].forgetForm(source);
        }
    }
    // load config data  from XML config file
    public static InitHubList(node: YoctoVisualization.YXmlNode): void
    {
        let nodes: YoctoVisualization.YXmlNode[] = node.get_childsByIndex();
        for (let i: number = 0; i < nodes.length; i++)
        {
            if (nodes[i].Name.toUpperCase() == "HUB")
            {
                let h: Hub = Hub.HubFromXml(nodes[i]);
                let alreadthere = false;
                for (let j: number = 0; j < sensorsManager._hubList.length; j++)
                {
                    if (h.get_connexionUrl() == sensorsManager._hubList[j].get_connexionUrl()) alreadthere = true;
                }
                if (!alreadthere)
                {
                    sensorsManager._hubList.push(h);
                    h.Connect().then();
                }
            }
        }

    }
    public static get hubList(): YoctoVisualization.Hub[] {return sensorsManager._hubList}

    public static hubWasremoved(h: YoctoVisualization.Hub)
    {
        for (let i: number = sensorsManager._hubList.length - 1; i >= 0; i--)
        {
            if (sensorsManager._hubList[i] == h) sensorsManager._hubList.splice(i, 1);
        }
    }

    public static newHubCreated(h: YoctoVisualization.Hub): boolean
    {
        let url: string = h.get_connexionUrl();
        for (let i = 0; i < sensorsManager._hubList.length; i++)
        {
            if (sensorsManager._hubList[i].get_connexionUrl() == url)
            {
                alert("This connection already exists");
                return false;
            }
        }
        sensorsManager._hubList.push(h)
        return true;
    }

    private static removeExtraInfoFromUrl(url: string):string
       {
         let it: URL = new URL(url);
         let res : string =  it.hostname + it.pathname;
         if(res.slice(0,4).toLowerCase() === 'www.') {
             res = res.slice(4);
         }
         return res;
       }




    public static async NetworkArrival(net: YoctoAPI.YNetwork)
    {
        YoctoVisualization.logForm.log("Network device detected: " + await net.get_hardwareId());
        let ip: string = await net.get_ipAddress();
        let netname: string = await net.get_logicalName();
        let module: YoctoAPI.YModule = await net.get_module();
        let loginame: string = await module.get_logicalName();
        let url: string = sensorsManager.removeExtraInfoFromUrl(await module.get_url());
        for (let i = 0; i < sensorsManager._hubList.length; i++)
        {
            let str: string = sensorsManager.removeExtraInfoFromUrl(sensorsManager.hubList[i].get_fullUrl());

            if (str == url)
            {
                sensorsManager.hubList[i].arrival(ip, netname, module, loginame);
            }
        }

    }

//#ifndef READONLY
    public static getXmlHublist(): string
    {
        let res: string = "";
        for (let i: number = 0; i < sensorsManager._hubList.length; i++)
        {
            res += "    " + sensorsManager._hubList[i].XmlCode() + "\n"
        }
        return res;
    }

    public static getXMLSensorsConfig(): string
    {
        let res: string = "<Sensors>\n";
        sensorsManager.sensorList.forEach((s: CustomYSensor) =>
        {
            if (!(s instanceof NullYSensor))
            {
                res = res + s.GetXmlData();
            }
        });
        res = res + "</Sensors>\n";
        return res;
    }
//#endif

    public static setKnownSensors(sensorXMLList: YoctoVisualization.YXmlNode)
    {
        this.KnownSensors = sensorXMLList;
    }

    public static FindSensorLastLocalConfig(hwdId: string): YoctoVisualization.YXmlNode | null
    {
        let SensorConfig: YoctoVisualization.YXmlNode | null = null;
        if (sensorsManager.KnownSensors != null)
        {
            let childs: YoctoVisualization.YXmlNode[] = sensorsManager.KnownSensors.get_childsByIndex()
            for (let i: number = 0; i < childs.length; i++)
            {
                let node: YoctoVisualization.YXmlNode = childs[i];
                if (node.Name == "Sensor")
                {
                    let id: string = node.get_attributes()["ID"];
                    if (id == hwdId)
                    {
                        SensorConfig = node;
                    }
                }
            }
        }
        return SensorConfig;
    }

    public static async deviceConfigChanged(m: YoctoAPI.YModule): Promise<void>
    {
        YoctoVisualization.logForm.log("Configuration change on device  " + await m.get_serialNumber());
        let serialprefix: string = (await m.get_serialNumber()).substring(0, 8);
        for (let i = 0; i < sensorsManager.sensorList.length; i++)
        {
            if (sensorsManager.sensorList[i].get_hardwareId().substring(0, 8) == serialprefix)
            {
                await sensorsManager.sensorList[i].ConfigHasChanged();
            }
        }
        if (sensorsManager._changeCallback != null) sensorsManager._changeCallback();
        if (sensorsManager._changeExternalCallback != null)
        {
            let data: string | null = await sensorsManager._changeExternalCallback(m);
            if (data != null) YoctoVisualization.YWebPage.ConfigChanged(data);
        }
    }

    public static async deviceArrival(m: YoctoAPI.YModule): Promise<void>
    {
        try
        {
            let count: number = await m.functionCount();
            let serial: string = await m.get_serialNumber();
            let luminosity: number = await m.get_luminosity();

            YoctoVisualization.logForm.log("--> Device Arrival " + serial);
            let recording: boolean = false;
            // first loop to find network and datalogger settings
            for (let i: number = 0; i < count; i++)
            {
                let ftype: string = await m.functionType(i);
                let fid: string = await m.functionId(i);

                if (ftype == "Network")
                {
                    let net: YoctoAPI.YNetwork = await YoctoAPI.YNetwork.FindNetwork(serial + "." + fid);
                    await YoctoVisualization.sensorsManager.NetworkArrival(net);
                }
                else if (ftype == "DataLogger")
                {
                    let dlog: YoctoAPI.YDataLogger = YoctoAPI.YDataLogger.FindDataLogger(serial + "." + fid);
                    let state: number = await dlog.get_recording();

                    if ((state == YoctoAPI.YDataLogger.RECORDING_ON) || (state == YoctoAPI.YDataLogger.RECORDING_PENDING))
                    {
                        recording = true;
                    }
                }
            }

            // second loop to register all Sensors
            for (let i: number = 0; i < count; i++)
            {
                let fbasetype: string = await m.functionBaseType(i);
                let fid: string = await m.functionId(i);
                if (fbasetype == "Sensor")
                {
                    let hwdID: string = serial + "." + fid;
                    YoctoVisualization.logForm.log("New sensor arrival: " + hwdID);
                    let found: boolean = false;
                    for (let j: number = 0; j < sensorsManager.sensorList.length && !found; j++)
                    {
                        if (sensorsManager.sensorList[j].get_hardwareId() == hwdID)
                        {
                            found = true;
                            await sensorsManager.sensorList[j].arrival(recording);
                        }
                    }

                    if (!found)
                    {
                        let s: YoctoAPI.YSensor = YoctoAPI.YSensor.FindSensor(hwdID);
                        let hwd: string = await s.get_hardwareId();
                        //if (s.isReadOnly()) LogManager.Log(hwd + " is read only!");
                        let cs: CustomYSensor = new CustomYSensor(s, hwd, sensorsManager.FindSensorLastLocalConfig(hwd))
                        sensorsManager.sensorList.push(cs);  // put the sensor as possible in the array
                        await cs.configureSensor();
                        //#ifndef READONLY
                        YoctoVisualization.YWebPage.refreshEditor() // will force a refresh the  editor sensor lists present in the editor
                        //#endif
                        cs.notifySensorStateChange();
                    }
                }
            }

            // register configuration change callback then tries to trigger a configuration
            // change to check to the devices supports that feature
            // (depends on firmware version)
            await m.registerConfigChangeCallback(sensorsManager.deviceConfigChanged);
            /* Original version, not compatible with delayed processing in CloudHub:
            try {
              await m.triggerConfigChangeCallback();
            } catch (e) {}
            Instead, we use setTimeout: */
            setTimeout(() => { sensorsManager.deviceConfigChanged(m); }, 100);
            if (sensorsManager._changeCallback != null) sensorsManager._changeCallback();
        }
        catch (e)
        {
            YoctoVisualization.logForm.log("Device Arrival Error: " + (e as Error).message);
        }
    }

    public static async deviceRemoval(m: YoctoAPI.YModule): Promise<void>
    {

        let serial: string = await m.get_serialNumber();

        YoctoVisualization.logForm.log("Device removal " + serial);
        //StartForm.DeviceRemoval(serial);
        sensorsManager.sensorList.forEach((alreadyThereSensor: CustomYSensor) =>
        {
            if (!(alreadyThereSensor instanceof NullYSensor))
            {
                let hwd: string = alreadyThereSensor.get_hardwareId();
                if (hwd.length >= serial.length)
                {
                    if (hwd.substring(0, serial.length) == serial)
                    {
                        alreadyThereSensor.removal();
                    }
                }
            }
        })

        if (sensorsManager._changeCallback != null) sensorsManager._changeCallback();

    }

    public static AddNewSensor(hwdID: string): CustomYSensor
    {
        for (let i: number = 0; i < sensorsManager.sensorList.length; i++)
        {
            if (sensorsManager.sensorList[i] != null)
            {
                if (sensorsManager.sensorList[i].get_hardwareId() == hwdID) return sensorsManager.sensorList[i];
            }
        }

        let s: YoctoAPI.YSensor = YoctoAPI.YSensor.FindSensor(hwdID);
        let cs: CustomYSensor = new CustomYSensor(s, hwdID, sensorsManager.FindSensorLastLocalConfig(hwdID));
        sensorsManager.sensorList.push(cs);
        return cs;
    }

    public static getNullSensor(): CustomYSensor
    {
        return sensorsManager.NullSensor;
    }

    private static async UpdateDeviceList()
    {
        let err: YoctoAPI.YErrorMsg = new YoctoAPI.YErrorMsg();
        if (await YoctoAPI.YAPI.UpdateDeviceList(err) != YoctoAPI.YAPI_SUCCESS)
        {
            YoctoVisualization.logForm.log("UpdateDeviceList failed :" + err.msg);
        }
    }

    private static async _runAsync(): Promise<void>
    {
        let errmsg: YoctoAPI.YErrorMsg = new YoctoAPI.YErrorMsg();
        await YoctoAPI.YAPI.RegisterDeviceArrivalCallback((m: YoctoAPI.YModule) => {sensorsManager.deviceArrival(m)});
        await YoctoAPI.YAPI.RegisterDeviceRemovalCallback((m: YoctoAPI.YModule) => {sensorsManager.deviceRemoval(m)});
        await sensorsManager.UpdateDeviceList();
        setInterval(() => { sensorsManager.UpdateDeviceList()}, 2000)

    }

    public static run()
    {
        sensorsManager.NullSensor = new NullYSensor();
        sensorsManager.sensorList = [];
        sensorsManager.sensorList.push(sensorsManager.NullSensor);

        this._runAsync().then();

    }

}

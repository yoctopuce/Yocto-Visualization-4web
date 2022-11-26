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
export class Hub {
    // not really crypto functions, but since source code will end up in the client browser,
    // there is no point in using techniques more complicated than obfuscation
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
            res += String.fromCharCode((buffer[i + 1] & 0x00FF) ^ loginCypherPassword.charCodeAt(i % loginCypherPassword.length) ^ ((buffer[0] + i) & 0xff) ^ (((buffer[i + 1] & 0x0800) >> 11) << ((buffer[i + 1] & 0x0700) >> 8)) ^ (((buffer[i + 1] & 0x8000) >> 15) << ((buffer[i + 1] & 0x7000) >> 12)));
        }
        return res;
    }
    static Encrypt(data, loginCypherPassword) {
        if (data == "")
            return "";
        let buffer = crypto.getRandomValues(new Uint16Array(data.length + 2));
        for (let i = 0; i < data.length; i++) {
            buffer[i + 1] = (buffer[i + 1] & 0xFF00) | (data.charCodeAt(i) ^ loginCypherPassword.charCodeAt(i % loginCypherPassword.length) ^ ((buffer[0] + i) & 0xff) ^ (((buffer[i + 1] & 0x0800) >> 11) << ((buffer[i + 1] & 0x0700) >> 8)) ^ (((buffer[i + 1] & 0x8000) >> 15) << ((buffer[i + 1] & 0x7000) >> 12)));
        }
        buffer[buffer.length - 1] = buffer[0];
        for (let i = 1; i < buffer.length - 1; i++) {
            buffer[buffer.length - 1] ^= buffer[i];
        }
        let res = "";
        for (let i = 0; i < buffer.length; i++) {
            res += ("000" + (buffer[i]).toString(16)).slice(-4).toUpperCase();
        }
        return res;
    }
    static encryptPassword(clearPassword) {
        return clearPassword == "" ? "" : Hub.Encrypt(clearPassword, Hub.loginCypherPassword);
    }
    get hubType() { return this._hubType; }
    set hubType(value) { this._hubType = value; }
    get protocol() { return this._protocol; }
    set protocol(value) { this._protocol = value; }
    get user() { return this._user; }
    set user(value) { this._user = value; }
    get encryptedPassword() { return this._password; }
    set encryptedPassword(value) { this._password = value; }
    get clearPassword() { return (this._password == "") ? "" : Hub.Decrypt(this._password, Hub.loginCypherPassword); }
    set clearPassword(value) { this._password = value == "" ? "" : Hub.encryptPassword(value); }
    get addr() { return this._addr; }
    set addr(value) { this._addr = value; }
    get port() { return this._port; }
    set port(value) { this._port = value; }
    get removable() { return this._removable; }
    set removable(value) { this._removable = value; }
    get path() { return this._path; }
    set path(value) { this._path = value; }
    get ConnectionState() { return this._state; }
    get ConnectionDescription() {
        switch (this._state) {
            case 1 /* HubState.CONNECTING */:
                return "Connecting..";
            case 2 /* HubState.CONNECTED */:
                return (this._logicname != "" ? this._logicname : this._netname) + " OK";
            case 3 /* HubState.FAILURE */:
                return "Connection failed ";
            default:
                return "Not connected.";
        }
    }
    constructor(hubType, protocol, user, password, clearPassword, addr, port, path, removeable) {
        this._netname = "";
        this._module = null;
        this._logicname = "";
        this._previousURL = "";
        this._previousobfuscatedURL = "";
        this._hubType = 2 /* HubType.REMOTEHUB */;
        this._protocol = "";
        this._user = "";
        this._password = "";
        this._addr = "";
        this._port = "";
        this._removable = true;
        this._path = "";
        this._state = 0 /* HubState.NOTCONNECTED */;
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
        this._password = clearPassword ? (password != "" ? Hub.Encrypt(password, Hub.loginCypherPassword) : "") : password;
        this._addr = addr;
        this._path = path;
        this._removable = (typeof (removeable) === "undefined") ? true : removeable;
    }
    static HubFromXml(subnode) {
        let hubType = 2 /* HubType.REMOTEHUB */;
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
            removable = (subnode.Attributes["removable"].toUpperCase() == "TRUE");
        return new Hub(hubType, protocol, user, password, false, addr, port, path, removable);
    }
    async Connect() {
        let errmsg = new YoctoAPI.YErrorMsg();
        this._state = 1 /* HubState.CONNECTING */;
        YoctoVisualization.logForm.log("preregistering  " + this.get_obfuscatedURL());
        //#ifndef READONLY
        //        if (!YoctoVisualization.YWebPage.readonly) YoctoVisualization.configForm.hubStateChanged(this)
        ////#endif
        let url = this.get_fullUrl();
        if (await YoctoAPI.YAPI.PreregisterHub(url, errmsg) != YoctoAPI.YAPI_SUCCESS) {
            YoctoVisualization.logForm.log("[!] preregistering  " + this.get_obfuscatedURL() + " failed (" + errmsg.msg + ")");
            this._state = 3 /* HubState.FAILURE */;
            this._previousURL = "";
            this._previousobfuscatedURL = "";
        }
        else {
            this._previousURL = url;
            this._previousobfuscatedURL = this.get_obfuscatedURL();
        }
        //#ifndef READONLY
        //        if (!YoctoVisualization.YWebPage.readonly) YoctoVisualization.configForm.hubStateChanged(this)
        ////#endif
    }
    async Disconnect() {
        if (this._previousURL == "")
            return;
        YoctoVisualization.logForm.log("Unregistering  " + this._previousobfuscatedURL);
        await YoctoAPI.YAPI.UnregisterHub(this._previousURL);
        this._previousURL = "";
        this._previousobfuscatedURL = "";
        this._state = 0 /* HubState.NOTCONNECTED */;
        //#ifndef READONLY
        //        if (!YoctoVisualization.YWebPage.readonly) YoctoVisualization.configForm.hubStateChanged(this)
        ////#endif
    }
    arrival(ip, netname, module, logicname) {
        this._state = 2 /* HubState.CONNECTED */;
        this._netname = netname;
        this._module = module;
        this._logicname = logicname;
        this._state = 2 /* HubState.CONNECTED */;
        //#ifndef READONLY
        //        if (!YoctoVisualization.YWebPage.readonly)
        //        {
        //            YoctoVisualization.configForm.hubStateChanged(this)
        //        }
        ////#endif
    }
    get address() {
        return this._addr;
    }
    get_consoleUrl() {
        let fullurl = this._protocol + "://" + this._addr;
        if (this._port != "")
            fullurl = fullurl + ":" + this._port; //else fullurl = fullurl + ":4444";
        return fullurl;
    }
    toString() { return this.get_consoleUrl(); }
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
}
Hub.loginCypherPassword = "+>*X[?_ih$N7wA!}";
export class TimedSensorValue {
    constructor(DateTime, value) {
        this._DateTime = DateTime;
        this._value = value;
    }
    get DateTime() { return this._DateTime; }
    get value() { return this._value; }
}
export class AlarmSettings {
    static ExecuteCommand(source, command) {
    }
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
    //#ifndef READONLY
    //    public getXmlData(): string
    //    {
    //        return "<Alarm "
    //            + "Source=\"" + this.Source.toString() + "\" "
    //            + "Condition=\"" + this.Condition.toString() + "\" "
    //            + "Value=\"" + this.Value.toString() + "\" "
    //            + "Cmd=\"" + YoctoVisualization.GenericProperties.escapeXml(this.Commandline) + "\" "
    //            + "Delay=\"" + this.Delay.toString() + "\"/>\n";
    //    }
    ////#endif
    setCondition(condition) { this.Condition = condition; }
    getCondition() { return this.Condition; }
    setSource(source) { this.Source = source; }
    getSource() { return this.Source; }
    setValue(value) { this.Value = value; }
    getValue() { return this.Value; }
    setDelay(value) {
        if (value < 0)
            throw "delay must be a positive value";
        this.Delay = value;
    }
    getDelay() { return this.Delay; }
    setCommandline(value) { this.Commandline = value; }
    getCommandline() { return this.Commandline; }
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
                return; // alarm disabled
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
        if ((now.getTime() - this.lastAlarm.getTime()) < 1000 * this.Delay)
            return;
        let source = "ALARM " + (this.index + 1).toString();
        YoctoVisualization.logForm.log(source + " on " + this.parent.get_hardwareId() + "/" + this.parent.get_friendlyName() + " (" + SensorValue.toString() + reason + this.Value.toString() + ")");
        let Execute = this.Commandline;
        Execute = Execute.replace("$SENSORVALUE$", SensorValue.toString());
        Execute = Execute.replace("$HWDID$", this.parent.get_hardwareId());
        Execute = Execute.replace("$NAME$", this.parent.get_friendlyName());
        Execute = Execute.replace("$UNIT$", this.parent.get_unit());
        Execute = Execute.replace("$CONDITION$", reason);
        Execute = Execute.replace("$DATATYPE$", src);
        Execute = Execute.replace("$TRIGGER$", this.Value.toString());
        Execute = Execute.replace("$NOW$", YoctoVisualization.logForm.dateToString(now));
        try {
            Function(Execute)();
        }
        catch (e) {
            YoctoVisualization.logForm.log("ALARM " + (this.index + 1) + " code (" + Execute + ") caused an exception :" + e.message);
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
class DataLoggerBoundary {
    constructor(start, stop) {
        this._start = 0;
        this._stop = 0;
        this._start = start;
        this._stop = stop;
    }
    get start() { return this._start; }
    get stop() { return this._stop; }
}
class MergeSourceRange {
    constructor(start, stop) {
        this.MergeSourceStart = 0;
        this.MergeSourceStop = 0;
        this.MergeSourceStart = start;
        this.MergeSourceStop = stop;
    }
}
export class CustomYSensor {
    get isReadOnly() { return this._readonly || !this._online; }
    static get MaxDataRecords() { return CustomYSensor._MaxDataRecords; }
    static set MaxDataRecords(value) { CustomYSensor._MaxDataRecords = value; }
    static get MaxLoggerRecords() { return CustomYSensor._MaxLoggerRecords; }
    static set MaxLoggerRecords(value) { CustomYSensor._MaxLoggerRecords = value; }
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
    async ConfigHasChanged() {
        this.cfgChgNotificationsSupported = true;
        this.mustReloadConfig = true;
        this._online = true;
        await this.reloadConfig();
        await this.forceUpdate();
    }
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
    //#ifndef READONLY
    //    public GetXmlData(): string
    //    {
    //        let res: string = "<Sensor ID=\"" + this.get_hardwareId() + "\">\n";
    //        for (let i: number = 0; i < this.getAlarmCount(); i++)
    //        {
    //            res = res + this.Alarms[i].getXmlData();
    //        }
    //        res = res + "</Sensor>\n";
    //        return res;
    //    }
    ////#endif
    getGetaLoadProgress() { return this.globalDataLoadProgress; }
    get_firstLiveDataTimeStamp() { return this.firstLiveDataTimeStamp; }
    get_firstDataloggerTimeStamp() { return this.firstDataloggerTimeStamp; }
    get_lastDataTimeStamp() { return this.lastDataTimeStamp; }
    async preload_DoWork(arg) {
        this._predloadProcessIsBusy = true;
        YoctoVisualization.logForm.log(this.hwdName + ": preloading data from " + arg.start.toString() + " to " + arg.stop.toString() + "(delta= " + (arg.stop - arg.start).toFixed(3) + ")");
        this.recordedData = await this.sensor.get_recordedData(arg.start, arg.stop);
        try {
            this.recordedDataLoadProgress = await this.recordedData.loadMore();
        }
        catch (e) {
            YoctoVisualization.logForm.log(this.hwdName + ": load more caused an exception " + e.message);
        }
        this.globalDataLoadProgress = this.recordedDataLoadProgress;
        let measures = await this.recordedData.get_preview();
        this.previewMinData = [];
        this.previewCurData = [];
        this.previewMaxData = [];
        let startIndex = 0;
        let errCount = 0;
        let maxErrorCount = 10;
        let lastT = -1;
        if ((CustomYSensor._MaxDataRecords > 0) && (measures.length > CustomYSensor._MaxDataRecords))
            startIndex = measures.length - CustomYSensor._MaxDataRecords;
        for (let i = startIndex; i < measures.length; i++) {
            let t = measures[i].get_endTimeUTC();
            if ((t >= arg.start) && (t <= arg.stop)) // returned dataset might be slightly larger than what we asked for
             {
                this.previewMinData.push(new TimedSensorValue(t, measures[i].get_minValue()));
                this.previewCurData.push(new TimedSensorValue(t, measures[i].get_averageValue()));
                this.previewMaxData.push(new TimedSensorValue(t, measures[i].get_maxValue()));
                if ((t < lastT) && (errCount < maxErrorCount)) {
                    YoctoVisualization.logForm.log(this.hwdName + " preloading warning:  timestamp going back in time " + t + "<" + lastT + (errCount < maxErrorCount - 1 ? "" : ", further similar errors wont be logged."));
                    errCount++;
                }
                else if ((t == lastT) && (errCount < maxErrorCount)) {
                    YoctoVisualization.logForm.log(this.hwdName + " preloading warning: duplicate timestamp  " + t + (errCount < maxErrorCount - 1 ? "" : ", further similar errors wont be logged."));
                    errCount++;
                }
                lastT = t;
            }
        }
        if (this.previewCurData.length > 1) {
            let a = this.previewCurData[0].DateTime;
            let b = this.previewCurData[this.previewCurData.length - 1].DateTime;
            YoctoVisualization.logForm.log(this.hwdName + ": preloaded data from " + a.toString() + " to " + b.toString() + " (delta=" + (b - a).toFixed(3) + ")");
            if ((CustomYSensor._MaxLoggerRecords > 0) && (arg.start == 0)) { // find out where to start reading datalogger to make sure we don't read more the _MaxLoggerRecords records
                // tested only when loading initial data (arg.start==0)
                let list = await this.recordedData.get_privateDataStreams();
                let index = list.length - 1;
                let totalRecords = 0;
                while ((index > 0) && (totalRecords < CustomYSensor._MaxLoggerRecords)) {
                    totalRecords += await list[index].get_rowCount();
                    this.dataLoggerStartReadTime = await list[index].get_startTimeUTC();
                    index--;
                }
                let n = 0;
                while ((n < this.previewMinData.length) && (this.previewMinData[n].DateTime < this.dataLoggerStartReadTime)) {
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
    }
    findMergeBoundaries(previewMinData) {
        let MergeSourceStart = 0;
        let MergeSourceStop = 0;
        if (this.minData.length > 0) {
            while ((MergeSourceStart < this.minData.length) && (previewMinData[0].DateTime > this.minData[MergeSourceStart].DateTime)) {
                MergeSourceStart++;
            }
            MergeSourceStop = MergeSourceStart;
            while ((MergeSourceStop < this.minData.length) && (previewMinData[previewMinData.length - 1].DateTime >= this.minData[MergeSourceStop].DateTime)) {
                MergeSourceStop++;
            }
        }
        return new MergeSourceRange(MergeSourceStart, MergeSourceStop);
    }
    preload_Completed(arg) {
        if (this.previewMinData == null)
            return;
        YoctoVisualization.logForm.log(this.hwdName + " : datalogger preloading completed (" + this.previewMinData.length + " rows )");
        if (this.previewMinData.length > 1) // make sure there is enough data not enough data for rendering
         { // find out where datalogger data fit in the already there data
            let it = this.findMergeBoundaries(this.previewMinData);
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
            for (let i = 0; i < this.FormsToNotify.length; i++) {
                if (this.FormsToNotify[i] instanceof YoctoVisualization.graphWidget) {
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
        // if (recordedDataLoadProgress < 100)
        // {
        YoctoVisualization.logForm.log(this.hwdName + " : start datalogger loading");
        // loadProcess.RunWorkerAsync(e.Result); // e.result contains the start stop parameters
        // }
        this._predloadProcessIsBusy = false;
        this.load_DoWork(arg).then();
    }
    get_frequency() {
        return this._frequency;
    }
    async updateFrequncy(frequencyToSet) {
        if (await this.sensor.isOnline()) {
            this._frequency = frequencyToSet;
            await this.sensor.set_reportFrequency(this._frequency);
            let lfreq = await this.sensor.get_logFrequency();
            try {
                if (lfreq != "OFF")
                    await this.sensor.set_logFrequency(this._frequency);
                let m = await this.sensor.get_module();
                await m.saveToFlash();
            }
            catch (e) {
                YoctoVisualization.logForm.log("failed to change " + this.hwdName + " log frequency (" + e.message + ")");
            }
        }
        else {
            this._online = false;
        }
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
    async updaterecording(recordingStatus) {
        if (!this.dataLoggerFeature)
            return;
        if (await this.sensor.isOnline()) {
            this._recording = recordingStatus;
            try {
                await this.sensor.set_logFrequency(this._recording ? this._frequency : "OFF");
                let module = await this.sensor.get_module();
                let serial = await module.get_serialNumber();
                let dl = YoctoAPI.YDataLogger.FindDataLogger(serial + ".dataLogger");
                await dl.set_recording(this._recording ? YoctoAPI.YDataLogger.RECORDING_ON : YoctoAPI.YDataLogger.RECORDING_OFF);
                await dl.set_autoStart(this._recording ? YoctoAPI.YDataLogger.AUTOSTART_ON : YoctoAPI.YDataLogger.AUTOSTART_OFF);
                await module.saveToFlash();
            }
            catch (e) {
                YoctoVisualization.logForm.log("failed to change " + this.hwdName + " recording (" + e.message + ")");
            }
        }
        else {
            this._online = false;
        }
    }
    reportDataloggerLoadProgress(progress) { }
    async load_DoWork(arg) {
        if (this._loadProcessIsBusy)
            return;
        this._loadProcessIsBusy = true;
        YoctoVisualization.logForm.log(this.hwdName + " loading main data from datalogger");
        if (this.dataLoggerStartReadTime > 0) {
            this.recordedData = await this.sensor.get_recordedData(this.dataLoggerStartReadTime, 0);
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
                this.recordedDataLoadProgress = await this.recordedData.loadMore();
                //LogManager.Log(hwdName + " loading " + recordedDataLoadProgress.ToString() + "%");
            }
            catch (Exception) {
                this.loadFailed = true;
                return;
            }
            if (this.globalDataLoadProgress != (this.recordedDataLoadProgress)) {
                this.globalDataLoadProgress = this.recordedDataLoadProgress;
                this.reportDataloggerLoadProgress(this.globalDataLoadProgress);
            }
            if ((this.recordedDataLoadProgress - lastProgress) >= 2) {
                lastProgress = this.recordedDataLoadProgress;
                this.load_ProgressChanged();
            }
        }
        let measures = await this.recordedData.get_measures();
        this.previewMinData = [];
        this.previewCurData = [];
        this.previewMaxData = [];
        for (let i = 0; i < measures.length; i++) {
            let t = measures[i].get_endTimeUTC();
            // debug
            // let d :Date = new Date(t * 1000)
            // console.log(this.hwdName +"loaded "+d.toLocaleDateString()+" "+d.toLocaleTimeString()+" "+measures[i].get_minValue()+","+measures[i].get_averageValue()+","+measures[i].get_maxValue()+" arg was "+arg.start+" "+arg.stop)
            // end debug
            if ((t >= arg.start) && (t <= arg.stop)) // trust no one!
             {
                if ((t < lastT) && (errCount < maxErrorCount)) {
                    YoctoVisualization.logForm.log(this.hwdName + " loading warning:  timestamp going back in time " + t + "<" + lastT + (errCount < maxErrorCount - 1 ? "" : ", further similar errors wont be logged."));
                    errCount++;
                }
                else if ((t == lastT) && (errCount < maxErrorCount)) {
                    YoctoVisualization.logForm.log(this.hwdName + " loading warning: duplicate timestamp  " + t + (errCount < maxErrorCount - 1 ? "" : ", further similar errors wont be logged."));
                    errCount++;
                }
                lastT = t;
                if ((this.previewMinData.length == 0) || (t > this.previewMinData[this.previewMinData.length - 1].DateTime)) {
                    this.previewMinData.push(new TimedSensorValue(t, measures[i].get_minValue()));
                    this.previewCurData.push(new TimedSensorValue(t, measures[i].get_averageValue()));
                    this.previewMaxData.push(new TimedSensorValue(t, measures[i].get_maxValue()));
                }
            }
            else {
                let d = new Date(t * 1000);
                let d1 = new Date(arg.start * 1000);
                let d2 = new Date(arg.stop * 1000);
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
            YoctoVisualization.logForm.log(this.hwdName + " loaded " + this.previewCurData.length.toString() + "/" + measures.length.toString() + " records over " + (this.previewCurData[this.previewCurData.length - 1].DateTime - this.previewCurData[0].DateTime).toFixed(3) + " sec");
        }
        else {
            YoctoVisualization.logForm.log(this.hwdName + " loaded " + this.previewCurData.length.toString() + " records");
        }
        if (this.previewMinData.length > 2) {
            this.globalDataLoadProgress = 100;
            let lastPreviewTimeStamp = this.previewMinData[this.previewMinData.length - 1].DateTime;
            //while ((index < minData.Count) && (minData[index].DateTime < lastPreviewTimeStamp)) index++;
            //LogManager.Log(hwdName + " time range is ["+constants.UnixTimeStampToDateTime(previewMinData[0].DateTime)+".."+ constants.UnixTimeStampToDateTime(lastPreviewTimeStamp)+"]");
            // find out where datalogger data fit in the already there data
            let it = this.findMergeBoundaries(this.previewMinData);
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
        if (count > 0) {
            if (this.curData[count - 1].DateTime > this.lastDataTimeStamp) {
                this.lastDataTimeStamp = this.curData[count - 1].DateTime;
                this.lastDataSource = "end of datalogger";
            }
        }
        this.load_Completed();
    }
    load_Completed() {
        if (this.loadFailed) {
            YoctoVisualization.logForm.log(this.hwdName + " : datalogger loading failed");
            this._loadProcessIsBusy = false;
            return;
        }
        if ((this.loadCanceled)) {
            YoctoVisualization.logForm.log(this.hwdName + " : datalogger loading was canceled");
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
        YoctoVisualization.logForm.log(this.hwdName + " : datalogger loading completed  (" + this.previewMinData.length + " rows )");
        this.loadDone = true;
        this.globalDataLoadProgress = 100;
        if (this.previewMinData.length <= 0) {
            for (let i = 0; i < this.FormsToNotify.length; i++) {
                if (this.FormsToNotify[i] instanceof YoctoVisualization.graphWidget) {
                    this.FormsToNotify[i].DataLoggerProgress();
                }
            }
            return;
        }
        for (let i = 0; i < this.FormsToNotify.length; i++) {
            if (this.FormsToNotify[i] instanceof YoctoVisualization.graphWidget) {
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
        let newsize = ((CustomYSensor._MaxDataRecords * 90) / 100) >> 0;
        if ((this.curData != null) && (CustomYSensor._MaxDataRecords < this.curData.length)) {
            this.minData.splice(0, this.minData.length - newsize);
            this.curData.splice(0, this.curData.length - newsize);
            this.maxData.splice(0, this.maxData.length - newsize);
        }
    }
    previewDataCleanUp() {
        if (CustomYSensor._MaxDataRecords <= 0)
            return;
        let newsize = ((CustomYSensor._MaxDataRecords * 90) / 100) >> 0;
        if ((this.previewMinData != null) && (CustomYSensor._MaxDataRecords < this.previewMinData.length)) {
            this.previewMinData.splice(0, this.previewMinData.length - newsize);
            this.previewCurData.splice(0, this.previewCurData.length - newsize);
            this.previewMaxData.splice(0, this.previewMaxData.length - newsize);
        }
    }
    stopDataloggerloading() {
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
    load_ProgressChanged() {
        for (let i = 0; i < this.FormsToNotify.length; i++)
            if (this.FormsToNotify[i] instanceof YoctoVisualization.graphWidget)
                this.FormsToNotify[i].DataLoggerProgress();
    }
    isOnline() {
        return this._online;
    }
    async reloadConfig() {
        if (this._online) {
            let ison = await this.sensor.isOnline();
            if (ison) {
                try {
                    this.unit = await this.sensor.get_unit();
                    this._friendlyname = await this.sensor.get_friendlyName();
                    this.resolution = await this.sensor.get_resolution();
                    this._frequency = await this.sensor.get_reportFrequency();
                    this._readonly = await this.sensor.isReadOnly();
                    if (this.dataLoggerFeature) {
                        this._recording = (await this.sensor.get_logFrequency()) != "OFF";
                    }
                    else {
                        this._recording = false;
                    }
                    this.lastGetConfig = YoctoAPI.YAPI.GetTickCount();
                    this.mustReloadConfig = false;
                }
                catch (e) {
                    YoctoVisualization.logForm.log("reload configuration error: " + e.message);
                }
            }
            else {
                this._online = false;
            }
        }
    }
    get_unit() {
        if ((this.cfgChgNotificationsSupported) && (!this.mustReloadConfig))
            return this.unit;
        if ((this.lastGetConfig <= 0) || (YoctoAPI.YAPI.GetTickCount() - this.lastGetConfig > 5000))
            this.reloadConfig().then();
        return this.unit;
    }
    get_resolution() {
        if ((this.cfgChgNotificationsSupported) && (!this.mustReloadConfig))
            return this.resolution;
        if ((this.lastGetConfig <= 0) || (YoctoAPI.YAPI.GetTickCount() - this.lastGetConfig > 5000))
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
        if (YoctoVisualization.constants.maxPointsPerDataloggerSerie < 0) {
            YoctoVisualization.logForm.log(this.hwdName + " : datalogger access is disabled");
            return;
        }
        /* if (this.isReadOnly)
         {
             YoctoVisualization.logForm.log(this.hwdName + " is read only, cannot load the datalogger contents  (yes that's a bug)");
             return;
         }
        */
        if ((!this.preloadDone) && this.dataLoggerFeature) {
            YoctoVisualization.logForm.log(this.hwdName + " : start datalogger preloading");
            this.preload_DoWork(new DataLoggerBoundary(start, stop)).then();
        }
    }
    async arrival(dataloggerOn) {
        await this.configureSensor();
        this._online = true;
        await this.reloadConfig();
        let dt = await this.sensor.get_dataLogger();
        if (dt == null)
            return;
        if (this.curData.length > 0) {
            let end = await dt.get_timeUTC();
            let start = this.curData[this.curData.length - 1].DateTime;
            let duration = end - start;
            if (duration > 1) {
                YoctoVisualization.logForm.log(this.hwdName + " is back online trying to load " + duration.toFixed(3) + " sec of data from datalogger ");
                this.loadDatalogger(start, end);
            }
        }
        else {
            this.loadDatalogger(0, await dt.get_timeUTC());
        }
        if (this.isReadOnly)
            YoctoVisualization.logForm.log(this.hwdName + " is read only");
        this.notifySensorStateChange();
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
    async configureSensor() {
        YoctoVisualization.logForm.log("Configuring  " + this.hwdName);
        if (!await this.sensor.isOnline())
            return;
        let mustSave = false;
        let olfreq = await this.sensor.get_logFrequency();
        let orfreq = await this.sensor.get_reportFrequency();
        let readOnly = await this.sensor.isReadOnly();
        let lfreq = olfreq;
        let rfreq = orfreq;
        let m = await this.sensor.get_module();
        for (let i = 0; i < await m.functionCount(); i++) {
            if (await m.functionType(i) == "DataLogger") {
                this.dataLoggerFeature = true;
            }
        }
        try {
            if (this.dataLoggerFeature) {
                let m = await this.sensor.get_module();
                let dl = YoctoAPI.YDataLogger.FindDataLogger(await m.get_serialNumber() + ".dataLogger");
                let dataloggerOn = await dl.get_recording() != YoctoAPI.YDataLogger.RECORDING_OFF;
                let dataloggerAS = await dl.get_autoStart() != YoctoAPI.YDataLogger.AUTOSTART_OFF;
                if (!dataloggerOn) {
                    lfreq = "OFF";
                }
                if (lfreq != "OFF") {
                    rfreq = lfreq;
                }
                else if (rfreq == "OFF") {
                    rfreq = "1/s";
                }
                if (lfreq != olfreq) {
                    if (readOnly)
                        throw new Error(this.hwdName + " is read only, cannot change its logFrequency from " + olfreq + " to " + lfreq);
                    await this.sensor.set_logFrequency(lfreq);
                    mustSave = true;
                }
                if (rfreq != orfreq) {
                    if (readOnly)
                        throw new Error(this.hwdName + " is read only, connot change its  reportFrequency from " + orfreq + " to " + rfreq);
                    await this.sensor.set_reportFrequency(rfreq);
                    mustSave = true;
                }
                if (lfreq != "OFF") {
                    if (!dataloggerOn) {
                        if (readOnly)
                            throw new Error(this.hwdName + " is read only, cannot change set its  datalogger recording to ON");
                        await dl.set_recording(YoctoAPI.YDataLogger.RECORDING_ON);
                    }
                    if (!dataloggerAS) {
                        if (readOnly)
                            throw new Error(this.hwdName + " is read only, cannot change set its datalogger autostart to ON");
                        await dl.set_autoStart(YoctoAPI.YDataLogger.AUTOSTART_ON);
                        mustSave = true;
                    }
                }
            }
            else {
                lfreq = "OFF";
                if (rfreq == "OFF") {
                    rfreq = "1/s";
                    if (readOnly)
                        throw new Error(this.hwdName + " is read only, connot change is reportFrequency from OFF to " + rfreq);
                    await this.sensor.set_reportFrequency(rfreq);
                    mustSave = true;
                }
            }
            if (mustSave)
                await m.saveToFlash();
        }
        catch (e) {
            YoctoVisualization.logForm.log("failed to configure " + this.hwdName + "  (" + e.message + ")");
        }
        YoctoVisualization.logForm.log("registering timed callback for  " + await this.sensor.get_hardwareId());
        await this.sensor.registerTimedReportCallback((callbacksource, M) => { this.TimedCallback(callbacksource, M); });
        this._recording = (lfreq != "OFF");
        this._frequency = rfreq;
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
    async TimedCallback(source, M) {
        if (M != null) {
            this._online = true;
            let t = M.get_endTimeUTC();
            // YoctoVisualization.logForm.log(await source.get_hardwareId() + " :: TimedCallback : " + t.toFixed(3));
            if (this.firstLiveDataTimeStamp == 0)
                this.firstLiveDataTimeStamp = t;
            if (t > this.lastDataTimeStamp) {
                this.lastDataTimeStamp = t;
                this.lastDataSource = "last timedReport";
                this.consecutiveBadTimeStamp = 0;
            }
            else {
                this.consecutiveBadTimeStamp++;
                if (this.consecutiveBadTimeStamp < 10) {
                    YoctoVisualization.logForm.log(this.hwdName + ": ignoring bad timestamp " + t.toFixed(3) + " (previous " + this.lastDataSource + " at " + this.lastDataTimeStamp.toFixed(3) + ")");
                }
            }
            if ((this.consecutiveBadTimeStamp == 0) || (this.consecutiveBadTimeStamp >= 10)) {
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
    get_hardwareId() { return this.hwdName; }
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
}
CustomYSensor._MaxDataRecords = 0;
CustomYSensor._MaxLoggerRecords = 0;
export class NullYSensor extends CustomYSensor {
    constructor() {
        super(null, "", null);
        this.hwdName = "NOTAREALSENSOR";
        this._friendlyname = "NOTAREALSENSOR";
    }
    get_unit() { return ""; }
    registerCallback(Form) { }
    forceUpdate() { }
    get_frequency() { return ""; }
    set_frequency(frequencyToSet) { }
    get_sensor() { return null; }
    toString() { return "(none)"; }
    setAlarmCondition(index, condition) { }
    getAlarmCondition(index) { return 0; }
    setAlarmValue(index, value) { }
    getAlarmValue(index) { return 0; }
    setAlarmDelay(index, value) { }
    getAlarmDelay(index) { return 0; }
    setAlarmCommandline(index, value) { }
    getAlarmCommandline(index) { return ""; }
}
export class sensorsManager {
    static async clearHublist() {
        for (let i = sensorsManager._hubList.length - 1; i >= 0; i--) {
            if (sensorsManager._hubList[i].removable) {
                await YoctoAPI.YAPI.UnregisterHub(sensorsManager._hubList[i].get_fullUrl());
                sensorsManager._hubList.splice(i, 1);
            }
        }
    }
    static registerChangeCallback(changeCallback) { this._changeCallback = changeCallback; }
    static registerChangeExternalCallback(changeCallback) { this._changeExternalCallback = changeCallback; }
    static forgetForm(source) {
        for (let i = 0; i < sensorsManager.sensorList.length; i++) {
            sensorsManager.sensorList[i].forgetForm(source);
        }
    }
    // load config data  from XML config file
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
    static get hubList() { return sensorsManager._hubList; }
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
        if (res.slice(0, 4).toLowerCase() === 'www.') {
            res = res.slice(4);
        }
        return res;
    }
    static async NetworkArrival(net) {
        YoctoVisualization.logForm.log("Network device detected: " + await net.get_hardwareId());
        let ip = await net.get_ipAddress();
        let netname = await net.get_logicalName();
        let module = await net.get_module();
        let loginame = await module.get_logicalName();
        let url = sensorsManager.removeExtraInfoFromUrl(await module.get_url());
        for (let i = 0; i < sensorsManager._hubList.length; i++) {
            let str = sensorsManager.removeExtraInfoFromUrl(sensorsManager.hubList[i].get_fullUrl());
            if (str == url) {
                sensorsManager.hubList[i].arrival(ip, netname, module, loginame);
            }
        }
    }
    //#ifndef READONLY
    //    public static getXmlHublist(): string
    //    {
    //        let res: string = "";
    //        for (let i: number = 0; i < sensorsManager._hubList.length; i++)
    //        {
    //            res += "    " + sensorsManager._hubList[i].XmlCode() + "\n"
    //        }
    //        return res;
    //    }
    //
    //    public static getXMLSensorsConfig(): string
    //    {
    //        let res: string = "<Sensors>\n";
    //        sensorsManager.sensorList.forEach((s: CustomYSensor) =>
    //        {
    //            if (!(s instanceof NullYSensor))
    //            {
    //                res = res + s.GetXmlData();
    //            }
    //        });
    //        res = res + "</Sensors>\n";
    //        return res;
    //    }
    ////#endif
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
    static async deviceConfigChanged(m) {
        YoctoVisualization.logForm.log("Configuration change on device  " + await m.get_serialNumber());
        let serialprefix = (await m.get_serialNumber()).substring(0, 8);
        for (let i = 0; i < sensorsManager.sensorList.length; i++) {
            if (sensorsManager.sensorList[i].get_hardwareId().substring(0, 8) == serialprefix) {
                await sensorsManager.sensorList[i].ConfigHasChanged();
            }
        }
        if (sensorsManager._changeCallback != null)
            sensorsManager._changeCallback();
        if (sensorsManager._changeExternalCallback != null) {
            let data = await sensorsManager._changeExternalCallback(m);
            if (data != null)
                YoctoVisualization.YWebPage.ConfigChanged(data);
        }
    }
    static async deviceArrival(m) {
        try {
            let count = await m.functionCount();
            let serial = await m.get_serialNumber();
            let luminosity = await m.get_luminosity();
            YoctoVisualization.logForm.log("--> Device Arrival " + serial);
            let recording = false;
            // first loop to find network and datalogger settings
            for (let i = 0; i < count; i++) {
                let ftype = await m.functionType(i);
                let fid = await m.functionId(i);
                if (ftype == "Network") {
                    let net = await YoctoAPI.YNetwork.FindNetwork(serial + "." + fid);
                    await YoctoVisualization.sensorsManager.NetworkArrival(net);
                }
                else if (ftype == "DataLogger") {
                    let dlog = YoctoAPI.YDataLogger.FindDataLogger(serial + "." + fid);
                    let state = await dlog.get_recording();
                    if ((state == YoctoAPI.YDataLogger.RECORDING_ON) || (state == YoctoAPI.YDataLogger.RECORDING_PENDING)) {
                        recording = true;
                    }
                }
            }
            // second loop to register all Sensors
            for (let i = 0; i < count; i++) {
                let fbasetype = await m.functionBaseType(i);
                let fid = await m.functionId(i);
                if (fbasetype == "Sensor") {
                    let hwdID = serial + "." + fid;
                    YoctoVisualization.logForm.log("New sensor arrival: " + hwdID);
                    let found = false;
                    for (let j = 0; j < sensorsManager.sensorList.length && !found; j++) {
                        if (sensorsManager.sensorList[j].get_hardwareId() == hwdID) {
                            found = true;
                            await sensorsManager.sensorList[j].arrival(recording);
                        }
                    }
                    if (!found) {
                        let s = YoctoAPI.YSensor.FindSensor(hwdID);
                        let hwd = await s.get_hardwareId();
                        //if (s.isReadOnly()) LogManager.Log(hwd + " is read only!");
                        let cs = new CustomYSensor(s, hwd, sensorsManager.FindSensorLastLocalConfig(hwd));
                        sensorsManager.sensorList.push(cs); // put the sensor as possible in the array
                        await cs.configureSensor();
                        //#ifndef READONLY
                        //                        YoctoVisualization.YWebPage.refreshEditor() // will force a refresh the  editor sensor lists present in the editor
                        //                        //#endif
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
            if (sensorsManager._changeCallback != null)
                sensorsManager._changeCallback();
        }
        catch (e) {
            YoctoVisualization.logForm.log("Device Arrival Error: " + e.message);
        }
    }
    static async deviceRemoval(m) {
        let serial = await m.get_serialNumber();
        YoctoVisualization.logForm.log("Device removal " + serial);
        //StartForm.DeviceRemoval(serial);
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
    }
    static AddNewSensor(hwdID) {
        for (let i = 0; i < sensorsManager.sensorList.length; i++) {
            if (sensorsManager.sensorList[i] != null) {
                if (sensorsManager.sensorList[i].get_hardwareId() == hwdID)
                    return sensorsManager.sensorList[i];
            }
        }
        let s = YoctoAPI.YSensor.FindSensor(hwdID);
        let cs = new CustomYSensor(s, hwdID, sensorsManager.FindSensorLastLocalConfig(hwdID));
        sensorsManager.sensorList.push(cs);
        return cs;
    }
    static getNullSensor() {
        return sensorsManager.NullSensor;
    }
    static async UpdateDeviceList() {
        let err = new YoctoAPI.YErrorMsg();
        if (await YoctoAPI.YAPI.UpdateDeviceList(err) != YoctoAPI.YAPI_SUCCESS) {
            YoctoVisualization.logForm.log("UpdateDeviceList failed :" + err.msg);
        }
    }
    static async _runAsync() {
        let errmsg = new YoctoAPI.YErrorMsg();
        await YoctoAPI.YAPI.RegisterDeviceArrivalCallback((m) => { sensorsManager.deviceArrival(m); });
        await YoctoAPI.YAPI.RegisterDeviceRemovalCallback((m) => { sensorsManager.deviceRemoval(m); });
        await sensorsManager.UpdateDeviceList();
        setInterval(() => { sensorsManager.UpdateDeviceList(); }, 2000);
    }
    static run() {
        sensorsManager.NullSensor = new NullYSensor();
        sensorsManager.sensorList = [];
        sensorsManager.sensorList.push(sensorsManager.NullSensor);
        this._runAsync().then();
    }
}
sensorsManager.counter = 0;
sensorsManager.KnownSensors = null; // sensors list picked up from XML configuration file
sensorsManager._hubList = [];
sensorsManager._changeCallback = null;
sensorsManager._changeExternalCallback = null;

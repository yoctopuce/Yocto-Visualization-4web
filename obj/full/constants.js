/*
*   Yocto-Visualization (for web), a free web-based application
*   to visualize Yoctopuce Sensors.
*
*  programs constants and global settings
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
import * as YDataRendering from "./Renderer/YDataRendererFull.js";
import * as YoctoVisualization from "./YoctoVisualizationFull.js";
import * as YoctoAPI from "./YoctoApiFull.js";
export class constants {
    static get buildVersion() {
        return /* version number patched automatically */ '1.10.51774';
    }
    static get deviceScreenWidth() { return screen.width * window.devicePixelRatio; }
    static get deviceScreenHeight() { return screen.height * window.devicePixelRatio; }
    // if screen DPI is greater than 96 and screen width is less the 12 " (~A4) then it's probably a phone a tablet
    static get isPhoneOrTablet() { return (constants.ScreenDPI > 96) && (Math.max(constants.deviceScreenWidth, constants.deviceScreenHeight) / (constants.ScreenDPI) < 12); }
    static get captureSizePolicy() { return constants._defaultCaptureSizePolicy; }
    static set captureSizePolicy(value) { constants._defaultCaptureSizePolicy = value; }
    static get dbleClickBringsUpContextMenu() { return constants._defaulDbleClickBringsUpContextMenu; }
    static set dbleClickBringsUpContextMenu(value) { constants._defaulDbleClickBringsUpContextMenu = value; }
    static get maxPointsPerGraphSerie() { return constants._defaultMaxPointsPerGraphSerie; }
    static set maxPointsPerGraphSerie(value) { if (value >= 0)
        constants._defaultMaxPointsPerGraphSerie = value >> 0; }
    static get maxPointsPerDataloggerSerie() { return constants._defaultMaxPointsPerDataloggerSerie; }
    static set maxPointsPerDataloggerSerie(value) { if (value >= -1)
        constants._defaultMaxPointsPerDataloggerSerie = value >> 0; }
    static get maxDataRecordsPerSensor() { return constants._defaultMaxDataRecordsPerSensor; }
    static set maxDataRecordsPerSensor(value) { if (value >= 0)
        constants._defaultMaxDataRecordsPerSensor = value >> 0; }
    static get captureWidth() { return constants._defaultCaptureWidth; }
    static set captureWidth(value) { if (value > 0)
        constants._defaultCaptureWidth = value; }
    static get captureHeight() { return constants._defaultCaptureHeight; }
    static set captureHeight(value) { if (value > 0)
        constants._defaultCaptureHeight = value; }
    static get captureDPI() { return constants._defaultCaptureDPI; }
    static set captureDPI(value) { if (value > 0)
        constants._defaultCaptureDPI = value; }
    static get captureType() { return constants._defaultCaptureType; }
    static set captureType(value) { constants._defaultCaptureType = value; }
    // UI constants
    static get generalFontFamily() { return constants.FontFamily; }
    static get generalFontSize() { return constants.FontSize; }
    static get generalSizeCoef() { return constants.FontSize / 12.0; }
    static get screenDPI() { return constants.ScreenDPI; }
    static get guiDPIFactor() { return constants.DPIfactor; }
    static get guiDPIFactorWasOverriden() { return constants.DPIfactorOverriden; }
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
        if ((override) && typeof (value) !== "undefined") {
            constants.setCookie(constants.DPIFactorKey, value.toString(), 3650);
        }
        else {
            constants.setCookie(constants.DPIFactorKey, "none", 3650);
        }
    }
    static get RunningOnAndroid() { return constants.isAndroid; }
    static get WindowBackgroundColor() { return "#f0f0f0"; }
    static get WindowBorder() { return "1px solid #808080"; }
    static get WindowPadding() { return 2; }
    static get WindowInnerBorderColor() { return " #A0A0A0"; }
    static get WindowInnerBackgroundColor() { return "#fAfAfA"; }
    static get WindowInnerBorder() { return "1px solid " + constants.WindowInnerBorderColor; }
    static get WindowHeaderBackgroundColor() { return "#0072ca"; }
    static get WindowHeaderColor() { return "white"; }
    static get WindowHeaderBorder() { return "1px solid #0072ca"; }
    static get WindowHeaderHeight() { return 20; }
    static get WindowHeaderFontSize() { return (8 * constants.FontSize / 6); }
    static get WindowHeaderFontFamily() { return constants.FontFamily; }
    static get mustCheckForUpdate() { return constants._checkForUpdate; }
    static set mustCheckForUpdate(value) {
        if (value != constants._checkForUpdate) {
            constants._checkForUpdate = true;
            constants.edited = true;
        }
        //#endif
    }
    static get edited() { return constants._edited; }
    ;
    static set edited(value) {
        if (constants._edited != value) {
            constants._edited = value;
            YoctoVisualization.YWebPage.ShowSaveReminder(value);
        }
    }
    static InitColorHistory(node) {
        let nodes = node.get_childsByIndex();
        for (let i = 0; i < nodes.length; i++) {
            let node = nodes[i];
            switch (nodes[i].Name) {
                case "Color":
                    try {
                        let colordef = node.Attributes["value"];
                        let color = YDataRendering.YColor.FromString(colordef);
                        if (color != null)
                            YoctoVisualization.colorEditor.AddColorToHistory(color);
                    }
                    catch (_a) { }
            }
        }
    }
    //#endif
    static findDPI() {
        let DPI = 1;
        while (!matchMedia("(max-resolution: " + DPI.toString() + "dpi)").matches) {
            DPI = DPI << 1;
        }
        let a = DPI >> 1;
        let b = DPI;
        while (b - a > 1) {
            let pivot = (b + a) >> 1;
            if (matchMedia("(max-resolution: " + pivot.toString() + "dpi)").matches) {
                b = pivot;
            }
            else {
                a = pivot;
            }
        }
        return b * (constants.isAndroid ? window.devicePixelRatio : 1);
    }
    static InitCaptureParams(node) {
        let nodes = node.get_childsByName();
        for (let nodeName in nodes) {
            let node = nodes[nodeName];
            let value;
            switch (nodeName) {
                case "Target":
                    if ("value" in node.Attributes) {
                        constants._captureTarget = YDataRendering.YDataRenderer.CaptureTarget.fromString(YDataRendering.YDataRenderer.CaptureTarget, node.Attributes["value"]);
                    }
                    break;
                case "Type":
                    if ("value" in node.Attributes) {
                        constants._defaultCaptureType = YDataRendering.YDataRenderer.CaptureType.fromString(YDataRendering.YDataRenderer.CaptureType, node.Attributes["value"]);
                    }
                    break;
                case "Size":
                    if ("value" in node.Attributes) {
                        constants._defaultCaptureSizePolicy = YDataRendering.YDataRenderer.CaptureFormats.fromString(YDataRendering.YDataRenderer.CaptureFormats, node.Attributes["value"]);
                    }
                    break;
                case "Resolution":
                    if ("value" in node.Attributes) {
                        constants.captureDPI = parseInt(node.Attributes["value"]);
                    }
                    break;
                case "Width":
                    if ("value" in node.Attributes) {
                        constants.captureWidth = value = parseInt(node.Attributes["value"]);
                    }
                    break;
                case "Height":
                    if ("value" in node.Attributes) {
                        constants.captureHeight = parseInt(node.Attributes["value"]);
                    }
                    break;
                case "Folder":
                    if ("value" in node.Attributes) {
                        constants._captureFolder = node.Attributes["value"];
                    }
                    break;
            }
        }
    }
    static InitUIParams(node) {
        let nodes = node.get_childsByName();
        for (let nodeName in nodes) {
            let node = nodes[nodeName];
            switch (nodeName) {
                case "VerticalDragZoom":
                    if ("value" in node.Attributes) {
                        YDataRendering.YGraph.verticalDragZoomEnabled = node.Attributes["value"].toUpperCase() == "TRUE";
                    }
                    break;
                case "DbleClickContextMenu":
                    if ("value" in node.Attributes) {
                        constants.dbleClickBringsUpContextMenu = node.Attributes["value"].toUpperCase() == "TRUE";
                    }
                    break;
            }
        }
    }
    static InitCheckForUpdateParams(node) {
        let nodes = node.get_childsByName();
        for (let nodeName in nodes) {
            let node = nodes[nodeName];
            switch (nodeName) {
                case "checkForUpdate":
                    if ("value" in node.Attributes) {
                        constants._checkForUpdate = node.Attributes["value"].toUpperCase() == "TRUE";
                    }
                    break;
                case "ignoreBuild":
                    if ("value" in node.Attributes) {
                        constants._ignoreBuild = parseInt(node.Attributes["value"].toUpperCase());
                    }
                    break;
            }
        }
    }
    static InitMemoryUsageParams(node) {
        let nodes = node.get_childsByName();
        for (let nodeName in nodes) {
            let node = nodes[nodeName];
            switch (nodeName) {
                case "maxPointsPerGraphSerie":
                    if ("value" in node.Attributes) {
                        let value = parseInt(node.Attributes["value"]);
                        constants.maxPointsPerGraphSerie = value;
                        YDataRendering.DataSerie.MaxPointsPerSeries = value;
                    }
                    break;
                case "maxDataRecordsPerSensor":
                    if ("value" in node.Attributes) {
                        let value = parseInt(node.Attributes["value"]);
                        if (value >= 0) {
                            constants.maxDataRecordsPerSensor = value;
                            YoctoVisualization.CustomYSensor.MaxDataRecords = value;
                        }
                    }
                    break;
                case "maxPointsPerDataloggerSerie":
                    if ("value" in node.Attributes) {
                        let value = parseInt(node.Attributes["value"]);
                        constants.maxPointsPerDataloggerSerie = value;
                        YoctoVisualization.CustomYSensor.MaxLoggerRecords = value;
                    }
                    break;
                case "deviceListValidity":
                    if ("value" in node.Attributes) {
                        let value = parseInt(node.Attributes["value"]);
                        if (value > 0) {
                            constants._deviceListValidity = value;
                            YoctoAPI.YAPI.SetDeviceListValidity(value).then();
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
                //#ifndef READONLY
                case "Colors":
                    constants.InitColorHistory(node);
                    break;
                //#endif
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
                    YoctoVisualization.sensorsManager.InitHubList(node);
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
                c = ((c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
            }
            constants._crcTable[n] = c;
        }
        return constants._crcTable;
    }
    static crc32(str) {
        var crcTable = constants.CRCTable;
        var crc = 0 ^ (-1);
        for (var i = 0; i < str.length; i++) {
            crc = (crc >>> 8) ^ crcTable[(crc ^ str.charCodeAt(i)) & 0xFF];
        }
        return (crc ^ (-1)) >>> 0;
    }
    ;
    static setCookie(cname, cvalue, exdays) {
        let d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        let expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }
    static getCookie(cname) {
        let name = cname + "=";
        let decodedCookie = decodeURIComponent(document.cookie);
        let ca = decodedCookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return null;
    }
    //#ifndef READONLY
    static XMLquote(st) {
        return st.replace("'", "&apos;").replace('"', "&quot;");
    }
    static GetXMLConfiguration() {
        let res = "<Config>\n"
            + "  <UseUSB value=\"" + (constants._useUSB ? "TRUE" : "FALSE") + "\"/>\n"
            + "  <UseVirtualHub value=\"" + (constants._useVirtualHub ? "TRUE" : "FALSE") + "\"/>\n"
            + "  <Hubs>\n";
        res += YoctoVisualization.sensorsManager.getXmlHublist();
        res += "  </Hubs>\n";
        res += "  <Colors>\n";
        for (let i = 0; i < YoctoVisualization.colorEditor.colorHistory.length; i++) {
            res = res + "    <Color value=\"" + YoctoVisualization.colorEditor.colorHistory[i].toString() + "\"/>\n";
        }
        res += "  </Colors>\n";
        res += "  <MemoryUsage>\n";
        res += "    <maxPointsPerGraphSerie value= \"" + constants.maxPointsPerGraphSerie.toString() + "\"/>\n";
        res += "    <maxDataRecordsPerSensor value= \"" + constants.maxDataRecordsPerSensor.toString() + "\"/>\n";
        res += "    <maxPointsPerDataloggerSerie value= \"" + constants.maxPointsPerDataloggerSerie.toString() + "\"/>\n";
        res += "    <deviceListValidity value= \"" + constants._deviceListValidity.toString() + "\"/>\n";
        res += "  </MemoryUsage>\n";
        res += "  <Capture>\n";
        res += "    <Target value= \"" + constants._captureTarget.toString + "\"/>\n";
        res += "    <Type value= \"" + constants.captureType.toString + "\"/>\n";
        res += "    <Size value= \"" + constants.captureSizePolicy.toString + "\"/>\n";
        res += "    <Resolution value= \"" + constants.captureDPI.toString() + "\"/>\n";
        res += "    <Folder value= \"" + constants.XMLquote(constants._captureFolder) + "\"/>\n";
        res += "    <Width value= \"" + constants.captureWidth.toString() + "\"/>\n";
        res += "    <Height value= \"" + constants.captureHeight.toString() + "\"/>\n";
        res += "  </Capture>\n";
        res += "  <Updates>\n";
        res += "    <checkForUpdate  value = \"" + (constants._checkForUpdate ? "True" : "False") + "\"/>\n";
        res += "    <ignoreBuild  value = \"" + constants._ignoreBuild.toString() + "\"/>\n";
        res += "  </Updates>\n";
        res += "  <UI>\n";
        res += "    <VerticalDragZoom value= \"" + (YDataRendering.YGraph.verticalDragZoomEnabled ? "True" : "False") + "\"/>\n";
        res += "    <DbleClickContextMenu value= \"" + (constants.dbleClickBringsUpContextMenu ? "True" : "False") + "\"/>\n";
        res += "  </UI>\n";
        res += "</Config>\n";
        return res;
    }
}
constants.DPIFactorKey = "YoctoVisualization4WebDPIFactor";
constants.isAndroid = navigator.userAgent.toLowerCase().indexOf("android") >= 0;
constants.ScreenDPI = constants.findDPI();
constants.FontFamily = "Arial, Helvetica, sans-serif"; // Will affect the whole application. Would you dare using "Comic Sans MS" ?
// allows to resize GUI element on devices too much pixels on a very small screen (looking at you smartphones)
constants.DPIfactorCookieValue = constants.getCookie(constants.DPIFactorKey);
constants.DPIfactorOverriden = constants.DPIfactorCookieValue != null;
constants.DPIfactor = (constants.DPIfactorOverriden && parseFloat(constants.DPIfactorCookieValue) > 0) ? parseFloat(constants.DPIfactorCookieValue) : constants.isPhoneOrTablet ? Math.round(10 * constants.ScreenDPI / (96 * 1.2)) / 10 : 1;
constants.FontSize = 12 * constants.DPIfactor; // UI base font size, all other fonts will be proportional to this value, windows and menus will also be resized accordingly
// configurable properties
constants._defaultCaptureType = YDataRendering.YDataRenderer.CaptureType.PNG;
constants._defaultCaptureWidth = 1024;
constants._defaultCaptureHeight = 1024;
constants._defaultCaptureDPI = 70;
constants._defaultCaptureSizePolicy = YDataRendering.YDataRenderer.CaptureFormats.Keep;
constants._defaultMaxPointsPerGraphSerie = 0;
constants._defaultMaxPointsPerDataloggerSerie = 0;
constants._defaultMaxDataRecordsPerSensor = 0;
constants._defaulDbleClickBringsUpContextMenu = false;
// dummy properties, useless in the JS version, but keep nonetheless to
// keep config file compatible the C# version
constants._useUSB = true;
constants._useVirtualHub = false;
constants._captureTarget = YDataRendering.YDataRenderer.CaptureTarget.ToFile;
constants._captureFolder = "";
constants._checkForUpdate = true;
constants._ignoreBuild = 0;
constants._deviceListValidity = 3600;
//#ifndef READONLY
constants._edited = false;
// thanks Alex @ stakckoverflow
constants._crcTable = null;

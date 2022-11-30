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

export class constants
{
    public static get buildVersion(): string
    {
        return /* version number patched automatically */'1.10.51909';
    }
    public static get deviceScreenWidth(): number {return screen.width * window.devicePixelRatio;}
    public static get deviceScreenHeight(): number {return screen.height * window.devicePixelRatio;}

    private static readonly DPIFactorKey: string = "YoctoVisualization4WebDPIFactor";
    private static readonly isAndroid: boolean = navigator.userAgent.toLowerCase().indexOf("android") >= 0;

    private static readonly ScreenDPI: number = constants.findDPI();
    private static readonly FontFamily: string = "Arial, Helvetica, sans-serif";  // Will affect the whole application. Would you dare using "Comic Sans MS" ?
    // if screen DPI is greater than 96 and screen width is less the 12 " (~A4) then it's probably a phone a tablet

    public static get isPhoneOrTablet(): boolean {return (constants.ScreenDPI > 96) && (Math.max(constants.deviceScreenWidth, constants.deviceScreenHeight) / (constants.ScreenDPI) < 12)}
    // allows to resize GUI element on devices too much pixels on a very small screen (looking at you smartphones)
    private static readonly DPIfactorCookieValue: string | null = constants.getCookie(constants.DPIFactorKey);
    private static readonly DPIfactorOverriden: boolean = constants.DPIfactorCookieValue != null;
    private static readonly DPIfactor: number = (constants.DPIfactorOverriden && parseFloat(<string>constants.DPIfactorCookieValue) > 0) ? parseFloat(<string>constants.DPIfactorCookieValue) : constants.isPhoneOrTablet ? Math.round(10 * constants.ScreenDPI / (96 * 1.2)) / 10 : 1;

    private static readonly FontSize: number = 12 * constants.DPIfactor;  // UI base font size, all other fonts will be proportional to this value, windows and menus will also be resized accordingly

    // configurable properties

    private static _defaultCaptureType: YDataRendering.YDataRenderer.CaptureTypeEnumItem = YDataRendering.YDataRenderer.CaptureType.PNG
    public static _defaultCaptureWidth: number = 1024;
    public static _defaultCaptureHeight: number = 1024;
    public static _defaultCaptureDPI: number = 70;
    public static _defaultCaptureSizePolicy: YDataRendering.YDataRenderer.CaptureFormatsEnumItem = YDataRendering.YDataRenderer.CaptureFormats.Keep;
    public static _defaultMaxPointsPerGraphSerie: number = 0;
    public static _defaultMaxPointsPerDataloggerSerie: number = 0;
    public static _defaultMaxDataRecordsPerSensor: number = 0;
    public static _defaulDbleClickBringsUpContextMenu: boolean = false;

    public static get captureSizePolicy(): YDataRendering.YDataRenderer.CaptureFormatsEnumItem {return constants._defaultCaptureSizePolicy }
    public static set captureSizePolicy(value: YDataRendering.YDataRenderer.CaptureFormatsEnumItem) { constants._defaultCaptureSizePolicy = value }
    public static get dbleClickBringsUpContextMenu(): boolean {return constants._defaulDbleClickBringsUpContextMenu}
    public static set dbleClickBringsUpContextMenu(value: boolean) { constants._defaulDbleClickBringsUpContextMenu = value}
    public static get maxPointsPerGraphSerie(): number {return constants._defaultMaxPointsPerGraphSerie}
    public static set maxPointsPerGraphSerie(value: number) {if (value >= 0) constants._defaultMaxPointsPerGraphSerie = value >> 0}
    public static get maxPointsPerDataloggerSerie(): number {return constants._defaultMaxPointsPerDataloggerSerie}
    public static set maxPointsPerDataloggerSerie(value: number) {if (value >= -1) constants._defaultMaxPointsPerDataloggerSerie = value >> 0}
    public static get maxDataRecordsPerSensor(): number {return constants._defaultMaxDataRecordsPerSensor}
    public static set maxDataRecordsPerSensor(value: number) {if (value >= 0) constants._defaultMaxDataRecordsPerSensor = value >> 0}
    public static get captureWidth(): number {return constants._defaultCaptureWidth}
    public static set captureWidth(value: number) {if (value > 0) constants._defaultCaptureWidth = value}
    public static get captureHeight(): number {return constants._defaultCaptureHeight}
    public static set captureHeight(value: number) { if (value > 0) constants._defaultCaptureHeight = value}
    public static get captureDPI(): number {return constants._defaultCaptureDPI}
    public static set captureDPI(value: number) { if (value > 0) constants._defaultCaptureDPI = value}
    public static get captureType(): YDataRendering.YDataRenderer.CaptureTypeEnumItem {return constants._defaultCaptureType}
    public static set captureType(value: YDataRendering.YDataRenderer.CaptureTypeEnumItem) { constants._defaultCaptureType = value}

    // UI constants
    public static get generalFontFamily(): string {return constants.FontFamily}
    public static get generalFontSize(): number {return constants.FontSize}
    public static get generalSizeCoef(): number {return constants.FontSize / 12.0}
    public static get screenDPI(): number {return constants.ScreenDPI }
    public static get guiDPIFactor(): number {return constants.DPIfactor }
    public static get guiDPIFactorWasOverriden(): boolean {return constants.DPIfactorOverriden }

    public static get guiDPIFactorIsOverriden(): boolean
    {
        let vs: string | null = constants.getCookie(constants.DPIFactorKey);
        if (vs == null) return false;
        let v: number = parseFloat(vs);
        if (v > 0) return true;
        return false;
    }

    public static get guiDPIFactorOverrideValue(): number
    {
        let vs: string | null = constants.getCookie(constants.DPIFactorKey);
        if (vs == null) return constants.DPIfactor;
        let v: number = parseFloat(vs);
        if (v > 0) return v;
        return constants.DPIfactor;
    }

    public static overrideGuiDPIFactor(override: boolean, value?: number)
    {
        if ((override) && typeof (value) !== "undefined")
        {
            constants.setCookie(constants.DPIFactorKey, value.toString(), 3650);
        }
        else
        {
            constants.setCookie(constants.DPIFactorKey, "none", 3650);
        }
    }
    public static get RunningOnAndroid(): boolean {return constants.isAndroid}
    public static get WindowBackgroundColor(): string {return "#f0f0f0"}
    public static get WindowBorder(): string {return "1px solid #808080"}
    public static get WindowPadding(): number {return 2}
    public static get WindowInnerBorderColor(): string {return " #A0A0A0"}
    public static get WindowInnerBackgroundColor(): string {return "#fAfAfA"}
    public static get WindowInnerBorder(): string {return "1px solid " + constants.WindowInnerBorderColor}
    public static get WindowHeaderBackgroundColor(): string {return "#0072ca"}
    public static get WindowHeaderColor(): string {return "white"}
    public static get WindowHeaderBorder(): string {return "1px solid #0072ca"}
    public static get WindowHeaderHeight(): number {return 20}
    public static get WindowHeaderFontSize(): number {return (8 * constants.FontSize / 6)}
    public static get WindowHeaderFontFamily(): string {return constants.FontFamily}

    // dummy properties, useless in the JS version, but keep nonetheless to
    // keep config file compatible the C# version

    private static _useUSB: boolean = true;
    private static _useVirtualHub: boolean = false;
    private static _captureTarget: YDataRendering.YDataRenderer.CaptureTargetEnumItem = YDataRendering.YDataRenderer.CaptureTarget.ToFile;
    private static _captureFolder: string = "";
    private static _checkForUpdate: boolean = true;
    public static get mustCheckForUpdate(): boolean {return constants._checkForUpdate;}
    public static set mustCheckForUpdate(value:boolean)
    {  //#ifndef READONLY
        if (value!=constants._checkForUpdate)
        {  constants._checkForUpdate =value;
            constants.edited=true;
        }
        //#endif
    }


    private static _ignoreBuild: number = 0;
    private static _deviceListValidity: number = 3600;

//#ifndef READONLY
    private static _edited: boolean = false;
    public static get edited(): boolean {return constants._edited};
    public static set edited(value: boolean)
    {
        if (constants._edited != value)
        {
            constants._edited = value;
            YoctoVisualization.YWebPage.ShowSaveReminder(value)
        }
    }

    public static InitColorHistory(node: YoctoVisualization.YXmlNode): void
    {
        let nodes: YoctoVisualization.YXmlNode[] = node.get_childsByIndex();
        for (let i: number = 0; i < nodes.length; i++)
        {
            let node: YoctoVisualization.YXmlNode = nodes[i]
            switch (nodes[i].Name)
            {
            case "Color":
                try
                {
                    let colordef: string = (<any>node.Attributes)["value"];
                    let color: YDataRendering.YColor | null = YDataRendering.YColor.FromString(colordef)
                    if (color != null) YoctoVisualization.colorEditor.AddColorToHistory(color)
                }
                catch
                {}
            }
        }
    }
//#endif

    private static findDPI(): number
    {
        let DPI: number = 1;
        while (!matchMedia("(max-resolution: " + DPI.toString() + "dpi)").matches)
        {
            DPI = DPI << 1;
        }

        let a = DPI >> 1;
        let b = DPI
        while (b - a > 1)
        {
            let pivot = (b + a) >> 1;
            if (matchMedia("(max-resolution: " + pivot.toString() + "dpi)").matches)
            {b = pivot }
            else
            {a = pivot}
        }

        return b * (constants.isAndroid ? window.devicePixelRatio : 1);
    }

    public static InitCaptureParams(node: YoctoVisualization.YXmlNode): void
    {
        let nodes: YoctoVisualization.YXmlNodeDict = node.get_childsByName();
        for (let nodeName in nodes)
        {
            let node: YoctoVisualization.YXmlNode = nodes[nodeName]
            let value: number;
            switch (nodeName)
            {
            case "Target":
                if ("value" in node.Attributes)
                {
                    constants._captureTarget = YDataRendering.YDataRenderer.CaptureTarget.fromString(YDataRendering.YDataRenderer.CaptureTarget, node.Attributes["value"]);
                }
                break;
            case "Type":
                if ("value" in node.Attributes)
                {
                    constants._defaultCaptureType = YDataRendering.YDataRenderer.CaptureType.fromString(YDataRendering.YDataRenderer.CaptureType, node.Attributes["value"]);
                }
                break;
            case "Size":
                if ("value" in node.Attributes)
                {
                    constants._defaultCaptureSizePolicy = YDataRendering.YDataRenderer.CaptureFormats.fromString(YDataRendering.YDataRenderer.CaptureFormats, node.Attributes["value"]);
                }
                break;
            case "Resolution":
                if ("value" in node.Attributes)
                {
                    constants.captureDPI = parseInt(node.Attributes["value"]);
                }
                break;
            case "Width":
                if ("value" in node.Attributes)
                {
                    constants.captureWidth = value = parseInt(node.Attributes["value"]);
                }
                break
            case "Height":
                if ("value" in node.Attributes)
                {
                    constants.captureHeight = parseInt(node.Attributes["value"]);
                }
                break
            case "Folder":
                if ("value" in node.Attributes)
                {
                    constants._captureFolder = node.Attributes["value"];
                }
                break;
            }
        }
    }

    public static InitUIParams(node: YoctoVisualization.YXmlNode): void
    {
        let nodes: YoctoVisualization.YXmlNodeDict = node.get_childsByName();
        for (let nodeName in nodes)
        {
            let node: YoctoVisualization.YXmlNode = nodes[nodeName]

            switch (nodeName)
            {
            case "VerticalDragZoom":
                if ("value" in node.Attributes)
                { YDataRendering.YGraph.verticalDragZoomEnabled = (node.Attributes["value"] as string).toUpperCase() == "TRUE";}

                break;
            case "DbleClickContextMenu":
                if ("value" in node.Attributes)
                { constants.dbleClickBringsUpContextMenu = (node.Attributes["value"] as string).toUpperCase() == "TRUE";}

                break;
            }
        }
    }

    public static InitCheckForUpdateParams(node: YoctoVisualization.YXmlNode): void
    {
        let nodes: YoctoVisualization.YXmlNodeDict = node.get_childsByName();
        for (let nodeName in nodes)
        {
            let node: YoctoVisualization.YXmlNode = nodes[nodeName]

            switch (nodeName)
            {
            case "checkForUpdate":
                if ("value" in node.Attributes)
                { constants._checkForUpdate = (node.Attributes["value"] as string).toUpperCase() == "TRUE";}

                break;
            case "ignoreBuild":
                if ("value" in node.Attributes)
                { constants._ignoreBuild = parseInt((node.Attributes["value"] as string).toUpperCase()) }

                break;
            }
        }
    }
    public static InitMemoryUsageParams(node: YoctoVisualization.YXmlNode): void
    {
        let nodes: YoctoVisualization.YXmlNodeDict = node.get_childsByName();
        for (let nodeName in nodes)
        {
            let node: YoctoVisualization.YXmlNode = nodes[nodeName]

            switch (nodeName)
            {
            case "maxPointsPerGraphSerie":
                if ("value" in node.Attributes)
                {
                    let value: number = parseInt(node.Attributes["value"]);
                    constants.maxPointsPerGraphSerie = value;
                    YDataRendering.DataSerie.MaxPointsPerSeries = value;
                }
                break;
            case "maxDataRecordsPerSensor":
                if ("value" in node.Attributes)
                {
                    let value: number = parseInt(node.Attributes["value"]);
                    if (value >= 0)
                    {
                        constants.maxDataRecordsPerSensor = value;
                        YoctoVisualization.CustomYSensor.MaxDataRecords = value;
                    }
                }
                break;
            case "maxPointsPerDataloggerSerie":
                if ("value" in node.Attributes)
                {
                    let value: number = parseInt(node.Attributes["value"]);
                    constants.maxPointsPerDataloggerSerie = value;
                    YoctoVisualization.CustomYSensor.MaxLoggerRecords = value;
                }
                break;
            case "deviceListValidity":
                if ("value" in node.Attributes)
                {
                    let value: number = parseInt(node.Attributes["value"])
                    if (value > 0)
                    {
                        constants._deviceListValidity = value
                        YoctoAPI.YAPI.SetDeviceListValidity(value).then();
                    }
                }
                break;
            }
        }
    }

    public static Init(initData: YoctoVisualization.YXmlNode): void
    {
        let nodes: YoctoVisualization.YXmlNodeDict = initData.get_childsByName();
        for (let nodeName in nodes)
        {
            let node: YoctoVisualization.YXmlNode = nodes[nodeName]
            switch (nodeName)
            {
            case "UseUSB":
                if ("value" in node.Attributes)
                {constants._useUSB = (node.Attributes["value"] as string).toUpperCase() == "TRUE";}
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
                if ("value" in node.Attributes)
                {constants._useVirtualHub = (node.Attributes["value"] as string).toUpperCase() == "TRUE";}
                break;
            case "Hubs":
                YoctoVisualization.sensorsManager.InitHubList(node);
                break;

            }
        }
    }

    // thanks Alex @ stakckoverflow
    private static _crcTable: number[] | null = null;
    private static get CRCTable(): number[]
    {
        if (constants._crcTable != null) return constants._crcTable;
        constants._crcTable = []
        let c: number;
        var crcTable = [];
        for (var n = 0; n < 256; n++)
        {
            c = n;
            for (var k = 0; k < 8; k++)
            {
                c = ((c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
            }
            constants._crcTable[n] = c;
        }
        return constants._crcTable;
    }

    public static crc32(str: string): number
    {
        var crcTable = constants.CRCTable;
        var crc = 0 ^ (-1);
        for (var i = 0; i < str.length; i++)
        {
            crc = (crc >>> 8) ^ crcTable[(crc ^ str.charCodeAt(i)) & 0xFF];
        }
        return (crc ^ (-1)) >>> 0;
    };

    public static setCookie(cname: string, cvalue: string, exdays: number)
    {
        let d: Date = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        let expires: string = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }

    public static getCookie(cname: string): string | null
    {
        let name: string = cname + "=";
        let decodedCookie: string = decodeURIComponent(document.cookie);
        let ca: string[] = decodedCookie.split(';');
        for (let i: number = 0; i < ca.length; i++)
        {
            let c: string = ca[i];
            while (c.charAt(0) == ' ')
            {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0)
            {
                return c.substring(name.length, c.length);
            }
        }
        return null;
    }

//#ifndef READONLY
    public static XMLquote(st: string): string
    {
        return st.replace("'", "&apos;").replace('"', "&quot;");
    }

    public static GetXMLConfiguration(): string
    {
        let res: string = "<Config>\n"
            + "  <UseUSB value=\"" + (constants._useUSB ? "TRUE" : "FALSE") + "\"/>\n"
            + "  <UseVirtualHub value=\"" + (constants._useVirtualHub ? "TRUE" : "FALSE") + "\"/>\n"
            + "  <Hubs>\n";
        res += YoctoVisualization.sensorsManager.getXmlHublist();

        res += "  </Hubs>\n";
        res += "  <Colors>\n";
        for (let i: number = 0; i < YoctoVisualization.colorEditor.colorHistory.length; i++)
        {
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
    //#endif
}

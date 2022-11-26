"use strict";
/*
*   Yocto-Visualization (for web), a free web-based application
*   to visualize Yoctopuce Sensors.
*
*  Installer to install Yoctovisulization 4 web on a YoctoHub
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
//#ifndef READONLY
//
//import * as YoctoVisualization from "./YoctoVisualizationFull.js";
//import * as Binaries from "./YoctoVisualizationBinaries.js";
//import * as YoctoAPI from "./YoctoApiFull.js";
//import * as Pako from "./Pako/Pakofull.js"
//
//interface installLogFct
//{
//    (s: string): HTMLSpanElement
//}
//
//class codeInstance
//{
//    private _filename: string;
//    private _EStarget: string;
//    private _version: string;
//    private _compressed: boolean;
//    private _readonly: boolean;
//    private _minified: boolean;
//
//    constructor(filename: string, EStarget: string, version: string, readonly: boolean)
//    {
//        this._compressed = filename.slice(-3) == ".gz";
//        this._filename = this._compressed ? filename.slice(0, -3) : filename;
//        this._version = version == "" ? "Unknown" : version;
//        this._EStarget = EStarget == "" ? "Unknown" : EStarget;
//        this._minified = filename.indexOf(".min.") > 0;
//        this._readonly = readonly;
//    }
//
//    public get compressed(): boolean {return this._compressed;}
//    public get version(): string { return this._version;}
//    public get readonly(): boolean {return this._readonly;}
//    public get EStarget(): string { return this._EStarget;}
//    public get minified(): boolean {return this._minified;}
//    public get filename(): string {return this._filename + (this.compressed ? ".gz" : "");}
//}
//
//class pageInstance
//{
//    private _filename: string;
//    private _compressed: boolean;
//    private _readonly: boolean;
//    private _action: number;
//    private _contents: Uint8Array;
//    private _useMinified: boolean;
//
//    constructor(filename: string, contents: Uint8Array)
//    {
//        let strContents = YoctoAPI.YAPI.imm_bin2str(contents);
//        this._compressed = filename.slice(-3) == ".gz";
//        this._filename = this._compressed ? filename.slice(0, -3) : filename;
//        this._readonly = strContents.indexOf("yv4web-readonly") > 0;
//        this._useMinified = (strContents.indexOf("yv4web-readonly.min.js") > 0) || (strContents.indexOf("yv4web-full.min.js") > 0);
//        this._action = 0;
//        this._contents = contents;
//    }
//
//    public get compressed(): boolean {return this._compressed; }
//    public get readonly(): boolean { return this._readonly; }
//    public set readonly(value: boolean) {this._readonly = value;}
//    public get fs_filename(): string {return this._filename + (this.compressed ? ".gz" : "");}
//    public get http_filename(): string {return this._filename;}
//    public set action(value: number) {this._action = value;}
//    public get action(): number { return this._action;}
//    public get contents(): Uint8Array {return this._contents; }
//    public get useMinified(): boolean {return this._useMinified;}
//    public set useMinified(value: boolean) {this._useMinified = value;}
//
//}
//
//export class YV4W_installer
//{
//
//    public static readonly HTTP = "http";
//    public static readonly HTTPS = "https";
//
//    // debug purpose
//    private   DEFAULT_PROTOCOL: string = YV4W_installer.HTTPS;
//    private  DEFAULTADDR: string = "yoctopuce-demo.org";
//    private  DEFAULTPORT: string = "443";
//    private  DEFAULTPATH: string = "CloudHub/mm";
//
//    private readonly DEFAULTUSER: string = "";
//    private readonly DEFAULTPWD: string = "";
//    private readonly DEFAULTFILEPREFIX: string = "default";
//
//    private readonly DEFAULTSRVUSERNAME: string = ""
//    private readonly DEFAULTSRVPASSORD: string = ""
//
//    private _container: HTMLElement
//    private _prevButton: YoctoVisualization.button;
//    private _nextButton: YoctoVisualization.button;
//    private _okButton: YoctoVisualization.button;
//    private _currentStep: number = 0;
//    private _welcomeText: HTMLDivElement | null = null;
//    private _hubAddr: HTMLDivElement | null = null;
//    private _connectingText: HTMLDivElement | null = null;
//    private _ipAddrInput: HTMLInputElement | null = null;
//    private _protocolInput: HTMLSelectElement | null = null;
//    private _ipPortInput: HTMLInputElement | null = null;
//    private _pathInput: HTMLInputElement | null = null;
//    private _configFileInput: HTMLInputElement | null = null;
//    private _webPageInput: HTMLInputElement | null = null;
//    private _connectiongError: HTMLDivElement | null = null;
//    private _pwdPanel: HTMLDivElement | null = null;
//    private _descPanel: HTMLDivElement | null = null;
//    private _customFilesPanel: HTMLDivElement | null = null;
//    private _doneMsgContainer: HTMLTableCellElement | null = null;
//    private _confirmUninstallPanel: HTMLDivElement | null = null;
//    private _modInstancesPanel: HTMLDivElement | null = null;
//    private _donePanel: HTMLDivElement | null = null;
//    private _runPanel: HTMLDivElement | null = null;
//    private _modifyInstallPanel: HTMLDivElement | null = null;
//    private _adminNameInput: HTMLInputElement | null = null;
//    private _adminPasswordInput: HTMLInputElement | null = null;
//    private _userNameInput: HTMLInputElement | null = null;
//    private _userPasswordInput: HTMLInputElement | null = null;
//    private _useReadOnlyInput: HTMLInputElement | null = null;
//    private _fileprefixInput: HTMLInputElement | null = null;
//    private _useFullVersionInput: HTMLInputElement | null = null;
//    private _removeUnusedJs: HTMLInputElement | null = null;
//    private _makeDefaultInput: HTMLInputElement | null = null;
//    private _userCredTable: HTMLTableElement | null = null;
//    private _optionsPanel: HTMLDivElement | null = null;
//    private _connectionErrorMsg: HTMLParagraphElement | null = null;
//    private _instancesFiles: YoctoAPI.YFileRecord[] = [];
//    private _jsCodeinstances: codeInstance[] = [];
//    private _webPageinstances: pageInstance[] = [];
//    private _uninstallOpt: HTMLInputElement | null = null
//    private _updateOpt: HTMLInputElement | null = null
//    private _addInstanceOpt: HTMLInputElement | null = null
//    private _modInstanceOpt: HTMLInputElement | null = null
//    private _confirmUninstall: HTMLInputElement | null = null;
//    //private _srvUsername: HTMLInputElement | null = null
//    //private _srvPassword: HTMLInputElement | null = null
//
//    private _history: number[] = [];
//    private _ErrMsgContainer: HTMLTableCellElement | null = null;
//    private _currentHub: YoctoAPI.YModule | null = null;
//    private _currentfs: YoctoAPI.YFiles | null = null;
//    private _currentHub_RW_username: string = "";
//    private _currentHub_RW_password: string = "";
//    private _currentHub_RO_username: string = "";
//    private _currentHub_RO_password: string = "";
//    private _currentHub_protocol: string = "";
//    private _currentHub_Addr: string = "";
//    private _currentHub_port: string = "";
//    private _currentHub_path: string = "";
//    private _currentHub_ReadOnlyProtected: boolean = false;
//    private _warning: string = "";
//    private _finalURL: string = "";
//    private _plannedaction: number = 0;
//
//    private _alreadyInstalled = false;
//    private _applicationURL: string = "";
//
//    private readonly ESVersion: string = "es2017";
//
//    private readonly WELCOMEPANEL: number = 0;
//    private readonly ENTERHUBADDR: number = 1;
//    private readonly CONNECTINGPANEL: number = 2;
//    private readonly CONNECTIONERROR: number = 3;
//    private readonly PASSWORDPANEL: number = 4;
//    private readonly DESCRIPTIONPANEL: number = 5;
//    private readonly CUSTOMFILESPANEL: number = 6;
//    private readonly OPTIONSPANEL: number = 7;
//    private readonly RUNPANEL: number = 8;
//    private readonly DONEPANEL: number = 9;
//    private readonly MODIFYINSTALLPANEL: number = 10;
//    private readonly CONFIRMUNINSTALLPANEL: number = 11;
//    private readonly MODINSTANCESPANEL: number = 12;
//
//    private readonly ACTIONINSTALL: number = 1;
//    private readonly ACTIONUNINSTALL: number = 2;
//    private readonly ACTIONADDINSTANCE: number = 3;
//    private readonly ACTIONMODINSTANCE: number = 4;
//    private readonly ACTIONUPDATE: number = 5;
//
//    private readonly _MODIFYNOTHING: number = 0;
//    private readonly _MODIFYCOMPRESS: number = 1;
//    private readonly _MODIFYUNCOMPRESS: number = 2;
//    private readonly _MODIFYMAKEREADONLY: number = 3;
//    private readonly _MODIFYMAKEREADWRITE: number = 4;
//
//    private readonly _MODIFYUSEMINIFIED: number = 5;
//    private readonly _MODIFYUSEPLAIN: number = 6;
//    private readonly _MODIFYDELETE: number = 7;
//    private readonly TARGETEXTENSION: string = ".html"
//
//    private readonly icon = '<link rel="icon" type="image/svg+xml" href="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGh'
//        + 'laWdodD0iNjQiIHZlcnNpb249IjEuMSIgdmlld0JveD0iMCAwIDE3IDE3IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0I'
//        + 'Hg9IjAiIHk9IjAiIHdpZHRoPSIxNyIgaGVpZ2h0PSIxNyIgcng9IjEuMSIgcnk9IjEuMSIgZmlsbD0iI2ZmZiIgZmlsbC1vcGFjaXR5PSIuOSIvPjx'
//        + 'wYXRoIGQ9Im0xMC43IDEuMy0wLjI5IDAuMjljLTAuMDQ3IDAuMDQ3LTAuMDczIDAuMTEtMC4wNzIgMC4xOHYxLjFjLTEuMS0wLjktMi43LTAuODM'
//        + 'tMy43IDAuMTRsLTAuNC0wLjR2LTAuOTdjMC4zNS0wLjI1IDAuMi0wLjgyLTAuMjMtMC44My0wLjQzLTAuMDE0LTAuNjMgMC41My0wLjI3IDAuODJ'
//        + '2MS4xYzAgMC4wNjcgMC4wMjcgMC4xMyAwLjA3NCAwLjE4bDAuNDkgMC40OWMtMC40MyAwLjU5LTAuNjMgMS4zLTAuNTQgMi4xdjAuMDA3MmwtMC4'
//        + '4My0wLjgzYy0wLjA0Ny0wLjA0Ny0wLjExLTAuMDczLTAuMTgtMC4wNzJoLTJjLTAuMjctMC4zNi0wLjgzLTAuMTktMC44MyAwLjI1IDAuMDAxMiA'
//        + 'wLjQ0IDAuNTYgMC42MiAwLjgyIDAuMjVoMS45bDEuMyAxLjNjMC40MyAwLjM4IDAuNzQgMS4yIDAuNTkgMS42aC0yLjVjLTAuMDY2IDAgLTAuMTM'
//        + 'gMC4wMjctMC4xOCAwLjA3NGwtMS40IDEuNGMtMC4zOS0wLjA4OS0wLjcyIDAuMzQtMC40OCAwLjY5czAuODYgMC4yIDAuODItMC4zM2wxLjMtMS4'
//        + 'zaDIuNmMwLjI2IDAuMTUgMC41MSAwLjQgMC42NyAwLjY1djEuOWwtMS41IDEuNWMtMC4wNDcgMC4wNDctMC4wNzMgMC4xMS0wLjA3NCAwLjE4djA'
//        + 'uMjhjLTAuNDUgMC4zLTAuMTUgMC44MyAwLjIzIDAuODMgMC4zOCAwIDAuNjMtMC40NyAwLjI3LTAuODF2LTAuMjFsMS41LTEuNWMwLjA0Ny0wLjA'
//        + '0NiAwLjA3NC0wLjExIDAuMDc0LTAuMTh2LTEuN2MwLjI0LTAuMzIgMS4xLTAuNCAxLjQtMC4wM3YxLjJjIDAgMC4wNjYgMC4wMjcgMC4xMyAwLjA'
//        + '3NCAwLjE4bDEuNSAxLjV2MC42OWMtMC4zNiAwLjI0LTAuMjMgMC44MSAwLjI3IDAuODIgMC40OSAwLjAwMjEgMC41NC0wLjY0IDAuMjMtMC44MnY'
//        + 'tMC43OWMgMCAtMC4wNjYtMC4wMjctMC4xMy0wLjA3NC0wLjE4bC0xLjUtMS41di0xLjRjMC4xNS0wLjIgMC4zLTAuMjUgMC41My0wLjI0aDMuMmw'
//        + 'wLjkxIDAuOTFjLTAuMDk5IDAuNDQgMC40OCAwLjcyIDAuNzcgMC40IDAuMjgtMC4zMiAwLjA3Mi0wLjc5LTAuNDItMC43NmwtMC45OC0wLjk4Yy0'
//        + 'wLjA0Ny0wLjA0Ny0wLjExLTAuMDcyLTAuMTgtMC4wNzJoLTNjLTAuMjEtMC4zMiAwLjI0LTEuNSAwLjY3LTEuOWwyLjIgMC4wMDU5YzAuMDY3IDA'
//        + 'gMC4xMy0wLjAyNiAwLjE4LTAuMDcybDEuMS0xLjFjMC4zOSAwLjA5NiAwLjczLTAuNCAwLjQ0LTAuNzNzLTAuODctMC4xLTAuNzggMC4zNmwtMS4'
//        + 'xIDEuMWgtMmMwLjI3LTAuOTUgMC4wMDY3LTEuOS0wLjQzLTIuNXYtMS41bDAuMjEtMC4yMWMwLjM4IDAuMDgyIDAuNzEtMC4zMyAwLjQ2LTAuNjl'
//        + 'zLTAuODctMC4xOS0wLjggMC4zM3ptLTMuMiA0LjljMC44NC0wLjAyOSAwLjk2IDEuNSAwLjIgMS41LTAuNzYtMC4wMTQtMS0xLjQtMC4yLTEuNXp'
//        + 'tMi4xIDBjMC43NSAwLjA4NCAwLjYxIDEuNS0wLjIgMS41LTAuODEgMC4wMDMzLTAuNTUtMS41IDAuMi0xLjV6IiBmaWxsLW9wYWNpdHk9Ii4xIi8'
//        + '+PHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjE3IiBoZWlnaHQ9IjE2IiByeT0iMS44IiBvcGFjaXR5PSIwIiBzdHJva2Utd2lkdGg9Ii4yNiIvPjx'
//        + 'lbGxpcHNlIGN4PSI5LjQiIGN5PSI3LjQiIHJ4PSIuMzQiIHJ5PSIuMzMiIG9wYWNpdHk9Ii4xIi8+PGVsbGlwc2UgY3g9IjcuNyIgY3k9IjcuNCI'
//        + 'gcng9Ii4zNCIgcnk9Ii4zMyIgb3BhY2l0eT0iLjEiLz48ZyBmaWxsPSJub25lIj48cGF0aCBkPSJtMS4xIDEuOSAwLjA2NiAxNCIgc3Ryb2tlPSI'
//        + 'jN2U3ZTdlIiBzdHJva2Utd2lkdGg9Ii4yIi8+PHBhdGggZD0ibTE1IDEzaC0xNSIgc3Ryb2tlPSIjN2U3ZTdlIiBzdHJva2Utd2lkdGg9Ii4yIi8'
//        + '+PHBhdGggZD0ibTEuMiAxM2M1LjQtMS4xIDEwLTIuNyAxNS02LjkiIHN0cm9rZT0ibGltZSIgIHN0cm9rZS13aWR0aD0iLjQiLz48cGF0aCBkPSJ'
//        + 'tMS4yIDEzYzAuMS0wLjA1MyAwLjQ1LTEuNCAxLjItMS40IDAuNzggMCAxLjQgMi44IDIuMyAyLjggMC44Ni0wLjAwMTUgMS42LTIuOCAyLjQtMi4'
//        + '4IDAuODQgMCAxLjUgMi44IDIuNCAyLjggMC45IDAuMDEzIDEuNi0yLjggMi40LTIuOCAwLjgyIDAuMDI4IDEuNSAyLjcgMi4zIDIuOCAwLjI2IDA'
//        + 'uMDQzIDAuNjgtMC4zNCAwLjY3LTAuNDIiICBzdHJva2U9InJlZCIgIHN0cm9rZS13aWR0aD0iLjQiLz48L2c+PHBhdGggZD0ibTE1IDEyLjQgMS4'
//        + 'xIDAuNi0xLjEgMC41N3oiIGZpbGw9IiM3ZTdlN2UiLz48cGF0aCBkPSJtMC41MiAyIDAuNjItMSAwLjU5IDF6IiBmaWxsPSIjN2U3ZTdlIi8+PHB'
//        + 'hdGggZD0ibTkuOCAwIDcuMiA3LjJ2LTRsLTMuMi0zLjJ6IiBmaWxsPSJncmVlbiIvPjxnIGZpbGw9IiNmZmYiIHN0cm9rZS13aWR0aD0iMSI+PHB'
//        + 'hdGggZD0ibTEyLjcgMS42MyAwLjQ5LTEuMSAwLjE5IDAuMTktMC4zMyAwLjc0IDAuNzUtMC4zMiAwLjEyIDAuMTItMC4zMiAwLjc1IDAuNzMtMC4'
//        + 'zNCAwLjE3IDAuMTctMS4xIDAuNDktMC4xMi0wLjEyIDAuMzMtMC43Ny0wLjc3IDAuMzN6Ii8+PHBhdGggZD0ibTEzLjggMi43OSAwLjc5LTAuNzk'
//        + 'gMC44MiAwLjgyLTAuMTQgMC4xNC0wLjY0LTAuNjQtMC4xOCAwLjE4IDAuMzYgMC4zNi0wLjE0IDAuMTQtMC4zNi0wLjM2LTAuMTkgMC4xOSAwLjY'
//        + '0IDAuNjQtMC4xNSAwLjE1eiIvPjxwYXRoIGQ9Im0xNi4xIDMuOC0wLjQyLTAuNDItMC4xOSAwLjE5IDAuNDIgMC40MnEwLjA0OSAwLjA0OSAwLjA'
//        + '3OSAwLjA1MyAwLjAzMiAwIDAuMDY0LTAuMDI2bDAuMDc1LTAuMDc1cTAuMDMxLTAuMDMxIDAuMDI1LTAuMDYyLTAuMDA0NS0wLjAzMi0wLjA1Mi0'
//        + 'wLjA3OXptLTAuMzIgMC4zMi0wLjQyLTAuNDItMC4yIDAuMiAwLjQyIDAuNDJxMC4wNTIgMC4wNTMgMC4wODYgMC4wNTQgMC4wMzUgMC4wMDMxIDA'
//        + 'uMDc1LTAuMDM3bDAuMDYtMC4wNnEwLjA0LTAuMDQgMC4wMzYtMC4wNzQtMC4wMDIzLTAuMDM0LTAuMDU0LTAuMDg2em0tMC45NS0wLjI2IDAuNzk'
//        + 'tMC43OSAwLjY4IDAuNjhxMC4wOTQgMC4wOTQgMC4xIDAuMTcgMC4wMDUzIDAuMDc5LTAuMDc1IDAuMTZsLTAuMDk4IDAuMDk4cS0wLjA1NyAwLjA'
//        + '1Ny0wLjEyIDAuMDU3LTAuMDY5LTAuMDAxNS0wLjE1LTAuMDU5IDAuMDU5IDAuMDc3IDAuMDU3IDAuMTYtMC4wMDIzIDAuMDc3LTAuMDY2IDAuMTR'
//        + 'sLTAuMSAwLjFxLTAuMDc5IDAuMDc5LTAuMTcgMC4wNTktMC4wOTYtMC4wMTktMC4yMi0wLjE0eiIvPjwvZz48L3N2Zz4=">';
//
//    constructor(container: HTMLElement, options? : any)
//    {  if (typeof options !== 'undefined')
//          if (options!=null)
//          {  if (typeof options["protocol"]  === "string") this.DEFAULT_PROTOCOL =  (options["protocol"].toUpperCase() ==  YV4W_installer.HTTPS.toUpperCase()) ? YV4W_installer.HTTPS : YV4W_installer.HTTP;
//              if (typeof options["addr"]  === "string")  this.DEFAULTADDR =  options["addr"];
//              if (typeof options["port"]  === "number")  this.DEFAULTPORT =  options["port"].toString();
//              if (typeof options["path"]  === "string")  this.DEFAULTPATH =  options["path"];
//
//          }
//
//        this._container = container
//        this._container.innerHTML = ""
//
//        this._container.style.backgroundColor = YoctoVisualization.constants.WindowBackgroundColor;
//        this._container.style.fontFamily = YoctoVisualization.constants.WindowHeaderFontFamily;
//
//        let bottomdiv: HTMLDivElement = document.createElement("DIV") as HTMLDivElement;
//        bottomdiv.style.position = "absolute";
//        bottomdiv.style.bottom = "0px"
//        bottomdiv.style.right = "5px";
//        bottomdiv.style.height = "30px";
//        bottomdiv.style.textAlign = "right"
//        bottomdiv.style.verticalAlign = "center"
//        this._prevButton = new YoctoVisualization.button("< Prev", () =>
//        {
//            this.gotoPrevious()
//        }, 1);
//        this._nextButton = new YoctoVisualization.button("Next >", () =>
//        {
//            this.gotoNext()
//        }, 1);
//        this._okButton = new YoctoVisualization.button("Ok", async () =>
//        {
//            await this.resetAll()
//        }, 1);
//
//        this._prevButton.tabIndex=100;
//        this._nextButton.tabIndex=101;
//        this._okButton.tabIndex=102;
//
//        bottomdiv.appendChild(this._prevButton.Element);
//        bottomdiv.appendChild(this._nextButton.Element);
//        bottomdiv.appendChild(this._okButton.Element);
//
//        this._prevButton.visible = false;
//        this._container.appendChild(bottomdiv)
//
//        let topDiv: HTMLDivElement = document.createElement("DIV") as HTMLDivElement;
//        topDiv.style.position = "absolute";
//        topDiv.style.top = "5px"
//        topDiv.style.paddingLeft = "10px"
//        topDiv.style.paddingTop = "5px"
//        topDiv.style.paddingBottom = "5px"
//
//        topDiv.style.left = "5px";
//        topDiv.style.right = "5px";
//        topDiv.style.backgroundColor = YoctoVisualization.constants.WindowHeaderBackgroundColor;
//        topDiv.style.color = YoctoVisualization.constants.WindowHeaderColor;
//        topDiv.style.fontSize = YoctoVisualization.constants.WindowHeaderFontSize.toString() + "px";
//
//        topDiv.innerText = "Yocto-Visualization (for web) installer"
//        this._container.appendChild(topDiv)
//
//        this.gotoPanel(this.WELCOMEPANEL)
//    }
//
//    private createNewContentDiv(): HTMLDivElement
//    {
//        let div: HTMLDivElement = document.createElement("DIV") as HTMLDivElement;
//        div.style.position = "absolute";
//        div.style.textAlign = "justify";
//        div.style.top = "50px"
//        div.style.left = "15px"
//        div.style.right = "15px"
//        return div;
//    }
//
//    private loadLocalFile(fileChooser: HTMLInputElement): Promise<string | null>
//    {
//        return new Promise(function (resolve, reject)
//        {
//            if (fileChooser.files && fileChooser.files[0])
//            {
//                let reader: FileReader = new FileReader();
//                reader.onload = function (e: ProgressEvent<FileReader>)
//                {
//                    resolve((<any>e).target.result as string);
//                }
//                reader.readAsText(fileChooser.files[0]);
//            }
//            else
//            {
//                resolve(null);
//            }
//        });
//    }
//
//    private showWelcomePanel(visible: boolean, goingback: boolean)
//    {
//        if (!visible)
//        {
//            if (this._welcomeText != null) this._welcomeText.style.display = "none";
//            return;
//        }
//        this._okButton.visible = false;
//        this._prevButton.visible = false;
//        this._nextButton.visible = true;
//        if (this._welcomeText == null)
//        {
//            this._welcomeText = this.createNewContentDiv()
//            this._welcomeText.innerText = 'Yoctopuce is proud to offer you  Yocto-Visualization (for web), an application that will allows to view Yoctopuce sensors data with a simple web browser.\n\nThis wizard will help you to install Yocto-Visualization (for web) version ' + YoctoVisualization.constants.buildVersion + ' (' + this.ESVersion + ') on a YoctoHub such as YoctoHub-Ethernet, YoctoHub-Wireless, VirtualHub etc..\n\n Click on "next" to start'
//            this._container.appendChild(this._welcomeText)
//
//        }
//        this._currentHub = null;
//        this._currentfs = null;
//        this._currentHub_RW_username = "";
//        this._currentHub_RW_password = "";
//        this._currentHub_RO_username = "";
//        this._currentHub_RO_password = "";
//        this._currentHub_protocol = "";
//        this._currentHub_Addr = "";
//        this._currentHub_port = "";
//        this._currentHub_path = "";
//
//        let tabIndex:number=1;
//        this._nextButton.tabIndex=tabIndex++;
//        this._nextButton.focus();
//        this._welcomeText.style.display = "";
//    }
//
//    private showEnterHubAddr(visible: boolean, goingback: boolean)
//    {
//        if (!visible)
//        {
//            if (this._hubAddr != null) this._hubAddr.style.display = "none";
//            return;
//        }
//        if (this._hubAddr == null)
//        {
//            this._hubAddr = this.createNewContentDiv()
//            let p: HTMLParagraphElement = document.createElement("P") as HTMLParagraphElement;
//            p.innerText = "Enter the address of the hub you want to install Yocto-Visualization on. This address must be reacheable from your web browser.";
//            this._hubAddr.appendChild(p);
//
//            let Table: HTMLTableElement = document.createElement("TABLE") as HTMLTableElement;
//            Table.style.fontSize = "smaller"
//
//            let Row: HTMLTableRowElement = document.createElement("TR") as HTMLTableRowElement;
//            let TD1: HTMLTableCellElement = document.createElement("TD") as HTMLTableCellElement;
//            TD1.innerText = "Hub address:"
//            Row.appendChild(TD1);
//            let TD2: HTMLTableCellElement = document.createElement("TD") as HTMLTableCellElement;
//
//            this._protocolInput = document.createElement("SELECT") as HTMLSelectElement;
//            let httpopt1: HTMLOptionElement = document.createElement("OPTION") as HTMLOptionElement;
//            httpopt1.text = "http://";
//            httpopt1.value = YV4W_installer.HTTP;
//            this._protocolInput.add(httpopt1);
//            let httpopt2: HTMLOptionElement = document.createElement("OPTION") as HTMLOptionElement;
//            httpopt2.text = "https://";
//            httpopt2.value = YV4W_installer.HTTPS;
//            this._protocolInput.add(httpopt2);
//            this._protocolInput.value =  this.DEFAULT_PROTOCOL;
//
//            this._protocolInput.addEventListener("change", () =>
//            {
//                if ((this._protocolInput != null) && (this._ipPortInput != null))
//                {
//                    if ((this._protocolInput.value == YV4W_installer.HTTPS) && (parseInt(this._ipPortInput.value) == 80)) this._ipPortInput.value = "443";
//                    if ((this._protocolInput.value == YV4W_installer.HTTP) && (parseInt(this._ipPortInput.value) == 443)) this._ipPortInput.value = "80";
//                }
//            });
//
//            TD2.appendChild(this._protocolInput);
//
//            this._ipAddrInput = document.createElement("INPUT") as HTMLInputElement;
//            this._ipAddrInput.value =  this.DEFAULTADDR
//            this._ipAddrInput.size = 34
//            this._ipAddrInput.addEventListener("input", () =>
//            {
//                this._nextButton.enabled = (((<HTMLInputElement>this._ipAddrInput).value != "") && (<HTMLInputElement>this._ipPortInput).value != "")
//            })
//            TD2.appendChild(this._ipAddrInput);
//
//            let span: HTMLSpanElement = document.createElement("SPAN") as HTMLSpanElement;
//            span.innerText = ":"
//            TD2.appendChild(span);
//            this._ipPortInput = document.createElement("INPUT") as HTMLInputElement;
//            this._ipPortInput.value = this.DEFAULTPORT != "" ? this.DEFAULTPORT : "4444";
//            this._ipPortInput.type = "number";
//            this._ipPortInput.min = "1";
//            this._ipPortInput.max = "65535";
//            this._ipPortInput.maxLength = 6;
//            this._ipPortInput.style.width = "60px";
//            this._ipPortInput.addEventListener("input", () =>
//            {
//                this._nextButton.enabled = (((<HTMLInputElement>this._ipAddrInput).value != "") && (<HTMLInputElement>this._ipPortInput).value != "")
//            })
//            TD2.appendChild(this._ipPortInput);
//            Row.appendChild(TD2);
//            Table.appendChild(Row);
//
//            Row = document.createElement("TR") as HTMLTableRowElement;
//            TD1 = document.createElement("TD") as HTMLTableCellElement;
//            TD1.innerText = "On VirtualHub (for web), port is likely to be 80 if it is accessible by HTTP or 443 if it is only accessible through HTTPS. On VirtualHubs, port is likely to be 4444.\n\n"
//                + "On VirtualHub (for web), path is probably required, HTTP username et password might be required as well if the Cloudhub is installed on a password protected web server.";
//            TD1.colSpan = 2;
//            Row.appendChild(TD1);
//            Table.appendChild(Row);
//
//            Row = document.createElement("TR") as HTMLTableRowElement;
//            TD1 = document.createElement("TD") as HTMLTableCellElement;
//            TD1.innerText = "Hub path:"
//            Row.appendChild(TD1);
//
//            TD2 = document.createElement("TD") as HTMLTableCellElement;
//            this._pathInput = document.createElement("INPUT") as HTMLInputElement;
//            this._pathInput.value = this.DEFAULTPATH;
//            this._pathInput.size = 48
//            TD2.appendChild(this._pathInput);
//            Row.appendChild(TD2);
//            Table.appendChild(Row);
//            /*
//                  Row = document.createElement("TR") as HTMLTableRowElement;
//                  TD1 = document.createElement("TD") as HTMLTableCellElement;
//                  TD1.innerText = "username:"
//                  Row.appendChild(TD1);
//                  TD2 = document.createElement("TD") as HTMLTableCellElement;
//                  this._srvUsername = document.createElement("INPUT") as HTMLInputElement;
//                  this._srvUsername.value = this.DEFAULTSRVUSERNAME;
//                  this._srvUsername.size = 12
//                  TD2.appendChild(this._srvUsername);
//                  Row.appendChild(TD2);
//                  let txt: HTMLSpanElement = document.createElement("SPAN") as HTMLSpanElement;
//                  txt.innerText ="password:"
//                  TD2.appendChild(txt);
//                  this._srvPassword = document.createElement("INPUT") as HTMLInputElement;
//                   this._srvPassword.value = this.DEFAULTSRVPASSORD;
//                    this._srvPassword.size = 12
//                    TD2.appendChild(this._srvPassword);
//
//                    Table.appendChild(Row);
//            */
//
//            this._hubAddr.appendChild(Table);
//
//
//
//
//
//            this._container.appendChild(this._hubAddr);
//        }
//        this._hubAddr.style.display = "";
//        let tabIndex:number=1;
//        (this._protocolInput as HTMLElement).tabIndex=tabIndex++;
//        (this._ipAddrInput as HTMLElement).tabIndex=tabIndex++;
//        (this._ipPortInput as HTMLElement).tabIndex=tabIndex++;
//        (this._pathInput as HTMLElement).tabIndex=tabIndex++;
//        this._prevButton.tabIndex=tabIndex++;
//        this._nextButton.tabIndex=tabIndex++;
//        (this._protocolInput as HTMLElement).focus();
//
//
//        this._nextButton.enabled = (<HTMLInputElement>this._ipAddrInput).value != "";
//    }
//
//    private async showConnectingPanel(visible: boolean, goingback: boolean)
//    {
//        if (!visible)
//        {
//            if (this._connectingText != null) this._connectingText.style.display = "none";
//            return;
//        }
//
//        if (this._connectingText == null)
//        {
//            this._connectingText = this.createNewContentDiv()
//            this._container.appendChild(this._connectingText)
//        }
//        this._history.pop(); // this panel is not accessible through prev button
//        this._connectingText.innerText = 'Connecting to hub ' + (<HTMLInputElement>this._ipAddrInput).value + ". Please wait..."
//        this._connectingText.style.display = "";
//        this._nextButton.visible = false;
//        this._prevButton.visible = false;
//        let IP: string = (<HTMLInputElement>this._ipAddrInput).value;
//        let port: number = parseInt((<HTMLInputElement>this._ipPortInput).value);
//        let protocol: string = (<HTMLSelectElement>this._protocolInput).value;
//        //let srvusername = this._srvUsername != null ? this._srvUsername.value : null;
//        //let srvpassword = this._srvPassword != null ? this._srvPassword.value : null;
//
//        let RW_username: string = "";
//        let RW_password: string = "";
//        let RO_username: string = "";
//        let RO_password: string = "";
//        if (this._adminNameInput != null) RW_username = this._adminNameInput.value;
//        if (this._adminPasswordInput != null) RW_password = this._adminPasswordInput.value;
//        if (this._userNameInput != null) RO_username = this._userNameInput.value;
//        if (this._userPasswordInput != null) RO_password = this._userPasswordInput.value;
//
//
//        let url = protocol + "://" + IP + ":" + port.toString()
//
//        let HubData: any = null;
//
//        let serial: string = "";
//        let path: string = (<HTMLInputElement>this._pathInput).value;
//        if (path != "")
//        {
//            if (path.charAt(0) == "/") path = path.slice(1);
//            url += "/" + path;
//        }
//
//        let info: YoctoVisualization.HubInfo = new YoctoVisualization.HubInfo(protocol, IP, port, path, null,null/*srvusername, srvpassword*/);
//
//       if (!await info.makeRequest())
//        {
//            let err: string = "Cannot connect to Hub\n\n" + url + '.\n\nMake sure the server is up, protocol, path, username and password are correct then click the "prev" to try again';
//            this.gotoPanel(this.CONNECTIONERROR, err);
//            return;
//
//        }
//
//        if (info.serial != "")  // if serial is not empty names the request worked
//        {
//            port = info.port;
//            serial = info.serial;
//            path = info.path;
//            this._currentHub_ReadOnlyProtected = info.userPassword;
//        }
//        protocol = info.protocol;
//
//        if ((info.adminPassword) && (RW_username == "") && (RW_password == ""))
//        {
//            this.gotoPanel(this.PASSWORDPANEL);
//            return;
//        }
//        await YoctoAPI.YAPI.DisableExceptions();
//        let errmsg: YoctoAPI.YErrorMsg = new YoctoAPI.YErrorMsg();
//
//        if (info.userPassword)
//        {
//            let RO_addr: string = info.get_hubUrl(RO_username, RO_password);
//            let RO_res: number = await YoctoAPI.YAPI.TestHub(RO_addr, 5000, errmsg);
//            if (RO_res != YoctoAPI.YAPI.SUCCESS)
//            {
//               if (RO_res == YoctoAPI.YAPI.UNAUTHORIZED)
//               {
//                  this.gotoPanel(this.PASSWORDPANEL,"ReadOnly test failed, check credentials for read only operations.");
//                  return;
//               }
//            else {
//                   let err: string = "Cannot connect to " + url + " : " + errmsg.msg + '.\n\nMake sure the Hub is Up and address is correct, then click the "prev" to try again';
//                   this.gotoPanel(this.CONNECTIONERROR, err);
//                   return;
//               }
//
//        } }
//
//        let addr: string = info.get_hubUrl(RW_username, RW_password);
//
//
//        this._applicationURL = IP + ":" + port.toString() + ((path != "") ? "/" + path : "");
//
//        let res: number = await YoctoAPI.YAPI.TestHub(addr, 5000, errmsg);
//
//        if (res != YoctoAPI.YAPI.SUCCESS)
//        {
//            if (res == YoctoAPI.YAPI.UNAUTHORIZED)
//            {
//                this.gotoPanel(this.PASSWORDPANEL);
//                return;
//            }
//            else
//            {
//                let err: string = "Cannot connect to " + url + " : " + errmsg.msg + '.\n\nMake sure the Hub is Up and address is correct, then click the "prev" to try again';
//                this.gotoPanel(this.CONNECTIONERROR, err);
//                return;
//            }
//        }
//
//        if (await YoctoAPI.YAPI.RegisterHub(addr, errmsg) != YoctoAPI.YAPI.SUCCESS)
//        {
//            let err: string = "Cannot connect to " + IP + " : " + errmsg.msg + '.\nMake sure the Hub is Up and address is correct, then click the "prev" to try again';
//            this.gotoPanel(this.CONNECTIONERROR, err);
//            return;
//        }
//
//        let m: YoctoAPI.YModule | null = YoctoAPI.YModule.FirstModule();
//        while (m != null)
//        {
//            if (await m.get_parentHub() == "")
//            {
//                let urlMatch: boolean = false;
//                let serialMatch: boolean = await m.get_serialNumber() == serial;
//                if (!serialMatch) urlMatch = (await m.get_url()).indexOf(IP + ":" + port.toString()) > 0; // backup if info.json couldn't be retreived
//                if (serialMatch || urlMatch)
//                {
//                    this._currentHub = m;
//                    this._currentHub_RW_username = RW_username;
//                    this._currentHub_RW_password = RW_password;
//                    this._currentHub_protocol = protocol;
//                    this._currentHub_Addr = IP;
//                    this._currentHub_port = port.toString();
//                    this._currentHub_path = path;
//
//                    if (await m.isReadOnly())
//                    {
//                        await YoctoAPI.YAPI.UnregisterHub(await m.get_url());
//                        this._currentHub = null;
//
//                        this.gotoPanel(this.PASSWORDPANEL, "Write test failed, check credentials for read/write operations.");
//                    }
//                    else
//                    {
//                        this.gotoPanel(this.DESCRIPTIONPANEL)
//                    }
//
//                    return;
//                }
//            }
//            m = m.nextModule()
//        }
//
//        this.gotoPanel(this.CONNECTIONERROR, "Internal Error, cannot find Hub after RegisterHub call");
//
//    }
//
//    private async showConnectionError(visible: boolean, goingback: boolean, message: string)
//    {
//        if (!visible)
//        {
//            if (this._connectiongError != null) this._connectiongError.style.display = "none";
//            return;
//        }
//
//        if (this._connectiongError == null)
//        {
//            this._connectiongError = this.createNewContentDiv();
//            this._container.appendChild(this._connectiongError)
//        }
//        this.removeAllChilds(this._connectiongError)
//        let Table: HTMLTableElement = document.createElement("TABLE") as HTMLTableElement;
//        let Row: HTMLTableRowElement = document.createElement("TR") as HTMLTableRowElement;
//        let TD1: HTMLTableCellElement = document.createElement("TD") as HTMLTableCellElement;
//        TD1.innerHTML = YoctoVisualization.ressources.FailedIcon("64", true, false, false, false, "oops");
//        Row.appendChild(TD1);
//        this._ErrMsgContainer = document.createElement("TD") as HTMLTableCellElement;
//        Row.appendChild(this._ErrMsgContainer);
//        Table.appendChild(Row)
//        this._connectiongError.appendChild(Table)
//
//        this._history.pop(); // this panel is not accessible through prev button
//        (<HTMLTableCellElement>this._ErrMsgContainer).innerText = message;
//        this._nextButton.visible = false;
//        this._prevButton.visible = true;
//        this._connectiongError.style.display = "";
//
//        let tabIndex:number=1;
//        this._prevButton.tabIndex=tabIndex++;
//        this._prevButton.focus();
//
//    }
//
//
//
//    private MakeSureCredentialsAreNotEmpty()
//    {
//        if (this._currentHub_ReadOnlyProtected )
//        {
//            this._nextButton.enabled = ((<HTMLInputElement>this._userPasswordInput).value != "") && ((<HTMLInputElement>this._userNameInput).value != "");
//        }
//        else
//        {
//            this._nextButton.enabled = true;
//        }
//       if    (((<HTMLInputElement>this._adminPasswordInput).value == "") || ((<HTMLInputElement>this._adminNameInput).value == ""))
//        {this._nextButton.enabled = false;}
//        }
//
//    private showPasswordPanel(visible: boolean, goingback: boolean, err?: string)
//    {
//        if (!visible)
//        {
//            if (this._pwdPanel != null) this._pwdPanel.style.display = "none";
//            return;
//        }
//        let errmsg: string = ((typeof (err) != "undefined") ? err : "Well, looks like this hub requires some authentication.");
//        if (this._history[this._history.length - 2] == this.PASSWORDPANEL)
//        {
//            errmsg = "Invalid credentials. " + errmsg;
//            this._history.pop()
//        }
//        if (this._pwdPanel == null)
//        {
//            this._pwdPanel = this.createNewContentDiv()
//            this._connectionErrorMsg = document.createElement("P") as HTMLParagraphElement;
//            this._connectionErrorMsg.style.marginTop="0px"
//
//            this._pwdPanel.appendChild(this._connectionErrorMsg);
//            let Table: HTMLTableElement = document.createElement("TABLE") as HTMLTableElement;
//            let Row: HTMLTableRowElement = document.createElement("TR") as HTMLTableRowElement;
//            let TD1: HTMLTableCellElement = document.createElement("TD") as HTMLTableCellElement;
//            /* admin credentials */
//            TD1.innerText="Enter read/write credentials below, these are required for the installation but won't be saved in Yocto-Visualization's configuration."
//            TD1.style.fontSize = "smaller"
//            TD1.colSpan=4;
//            Row.appendChild(TD1);
//            Table.appendChild(Row);
//
//            Row= document.createElement("TR") as HTMLTableRowElement;
//            TD1 = document.createElement("TD") as HTMLTableCellElement;
//            TD1.innerText = "Username:";
//            TD1.style.borderLeft="20px solid transparent";
//            Row.appendChild(TD1);
//            let TD2: HTMLTableCellElement = document.createElement("TD") as HTMLTableCellElement;
//            this._adminNameInput = document.createElement("INPUT") as HTMLInputElement;
//            this._adminNameInput.addEventListener("input", () =>
//            {
//                this.MakeSureCredentialsAreNotEmpty()
//            })
//            TD2.appendChild(this._adminNameInput);
//            Row.appendChild(TD2);
//
//            let TD3 : HTMLTableCellElement = document.createElement("TD") as HTMLTableCellElement;
//            TD3.innerText = "Password:";
//            Row.appendChild(TD3);
//            let TD4 : HTMLTableCellElement = document.createElement("TD") as HTMLTableCellElement;
//            this._adminPasswordInput = document.createElement("INPUT") as HTMLInputElement;
//            this._adminPasswordInput.type="password"
//            this._adminPasswordInput.addEventListener("input", () =>
//            {
//            this.MakeSureCredentialsAreNotEmpty()
//            })
//            TD4.appendChild(this._adminPasswordInput);
//            Row.appendChild(TD4);
//
//            this._adminNameInput.value = this.DEFAULTUSER;
//            this._adminPasswordInput.value = this.DEFAULTPWD;
//            Table.appendChild(Row)
//
//
//            /* user credentials */
//
//
//            let userRow1: HTMLTableRowElement = document.createElement("TR") as HTMLTableRowElement;
//
//            TD1 = document.createElement("TD") as HTMLTableCellElement;
//            TD1.innerText="\n\nEnter read-only credentials below, these will be saved in the configuration"
//            TD1.style.fontSize = "smaller"
//            TD1.colSpan=4;
//            userRow1.appendChild(TD1);
//            Table.appendChild(userRow1);
//
//            let userRow2: HTMLTableRowElement = document.createElement("TR") as HTMLTableRowElement;
//            TD1 = document.createElement("TD") as HTMLTableCellElement;
//            TD1.innerText = "Username:";
//            TD1.style.borderLeft="20px solid transparent";
//            userRow2.appendChild(TD1);
//            TD2 = document.createElement("TD") as HTMLTableCellElement;
//            this._userNameInput = document.createElement("INPUT") as HTMLInputElement;
//            this._userNameInput.addEventListener("input", () =>
//            {
//            this.MakeSureCredentialsAreNotEmpty()
//            })
//            TD2.appendChild(this._userNameInput);
//            userRow2.appendChild(TD2);
//
//            TD3  = document.createElement("TD") as HTMLTableCellElement;
//            TD3.innerText = "Password:";
//            userRow2.appendChild(TD3);
//            TD4  = document.createElement("TD") as HTMLTableCellElement;
//            this._userPasswordInput = document.createElement("INPUT") as HTMLInputElement;
//            this._userPasswordInput.type="password"
//            this._userPasswordInput.addEventListener("input", () =>
//            {
//            this.MakeSureCredentialsAreNotEmpty()
//            })
//            TD4.appendChild(this._userPasswordInput);
//            userRow2.appendChild(TD4);
//
//            this._userNameInput.value = this.DEFAULTUSER;
//            this._userPasswordInput.value = this.DEFAULTPWD;
//            Table.appendChild(userRow2)
//
//
//            Table.style.marginTop = "0px";
//            Table.style.marginBottom = "20px";
//            this._pwdPanel.appendChild(Table);
//
//
//            let  userCredVisible : string = "";
//            if (!this._currentHub_ReadOnlyProtected ) {
//                userCredVisible = "none"
//                this._userPasswordInput.value="";
//                this._userNameInput.value="";
//
//            }
//            userRow1.style.display = userCredVisible
//            userRow2.style.display = userCredVisible
//
//
//            let p: HTMLParagraphElement = document.createElement("P") as HTMLParagraphElement;
//            p.innerText = 'Note: On YoctoHubs and VirtualHub, username is either "user" for readonly or "admin" for read/write. Only ready-only credentials (if any) will saved in the configuration as Yocto-Visualization will ask for read/write credentials when saving, if needed.';
//            p.style.fontSize = "smaller"
//            this._pwdPanel.appendChild(p);
//            this._container.appendChild(this._pwdPanel)
//        }
//        (<HTMLParagraphElement>this._connectionErrorMsg).innerText = errmsg;
//
//        this._nextButton.visible = true;
//        this._prevButton.visible = true;
//        this._pwdPanel.style.display = "";
//
//        let tabIndex:number=1;
//        (this._adminNameInput     as HTMLElement).tabIndex=tabIndex++;
//        (this._adminPasswordInput as HTMLElement).tabIndex=tabIndex++;
//        (this._userNameInput      as HTMLElement).tabIndex=tabIndex++;
//        (this._userPasswordInput  as HTMLElement).tabIndex=tabIndex++;
//        this._prevButton.tabIndex=tabIndex++;
//        this._nextButton.tabIndex=tabIndex++;
//        (this._adminNameInput as HTMLElement).focus();
//
//        this.MakeSureCredentialsAreNotEmpty();
//    }
//
//    private createTextRow(caption: string, value: string): HTMLTableRowElement
//    {
//        let Row: HTMLTableRowElement = document.createElement("TR") as HTMLTableRowElement;
//        let TD1: HTMLTableCellElement = document.createElement("TD") as HTMLTableCellElement;
//        TD1.style.whiteSpace = "nowrap";
//        TD1.innerText = caption;
//        Row.appendChild(TD1);
//
//        let TD2: HTMLTableCellElement = document.createElement("TD") as HTMLTableCellElement;
//        TD2.innerText = value;
//        Row.appendChild(TD2);
//        return Row;
//    }
//
//    private async showHubDescription(visible: boolean, goingback: boolean)
//    {
//
//        if (!visible)
//        {
//            if (this._descPanel != null) this._descPanel.style.display = "none";
//            return;
//        }
//
//        if (this._descPanel == null)
//        {
//            this._descPanel = this.createNewContentDiv()
//            this._container.appendChild(this._descPanel)
//        }
//
//        if (!goingback)
//        {
//            this.removeAllChilds(this._descPanel);
//            this._alreadyInstalled = false;
//
//            let p: HTMLParagraphElement = document.createElement("P") as HTMLParagraphElement;
//
//            p.innerText = "Sucessfully connected to Hub " + (<HTMLInputElement>this._ipAddrInput).value;
//            this._descPanel.appendChild(p);
//            let m: YoctoAPI.YModule = <YoctoAPI.YModule>this._currentHub
//            let Table: HTMLTableElement = document.createElement("TABLE") as HTMLTableElement;
//            Table.style.marginTop = "20px";
//            Table.style.marginBottom = "20px";
//            let serial: string = await m.get_serialNumber();
//            let firmware: string = await m.get_firmwareRelease();
//            Table.appendChild(this.createTextRow("Model:", await m.get_productName()));
//            Table.appendChild(this.createTextRow("Serial:", serial));
//            Table.appendChild(this.createTextRow("Firmware:", firmware));
//
//            this._instancesFiles = [];
//
//            let freespace: number = 0;
//            this._instancesFiles = [];
//            this._currentfs = null;
//            let error: string = "";
//
//            if ((firmware.indexOf("-") < 0) && (parseInt(firmware) < 43805))
//            {
//                error = "Hub firmware is too old for Yocto-Visualization to run properly. You need at least version 43805";
//                this._nextButton.enabled = false;
//            }
//
//            if (error == "")
//            {
//                let ids: string[] = await m.get_functionIds("Files")
//                if (ids.length > 0)
//                {
//                    this._currentfs = await YoctoAPI.YFiles.FindFiles(serial + "." + ids[0]);
//                    freespace = Math.floor(await this._currentfs.get_freeSpace() / 1024);
//                    this._instancesFiles = await this._currentfs.get_list("yv4web*");
//                    Table.appendChild(this.createTextRow("Free space:", freespace.toString() + "K"));
//                    this._nextButton.enabled = true;
//                    if (freespace < 200)
//                    {
//                        error = "Not enough free space on device, please make sure there is at least 200K available.";
//                        this._nextButton.enabled = false;
//                    }
//
//                }
//                else
//                {
//                    error = "No filesystem found on hub. On VirtualHub, the filesystem feature needs to be explicitely enabled at startup with the -F flag.";
//                }
//            }
//
//            if (error != "")
//            {
//                Table.appendChild(this.createTextRow(" ", " "));
//                let Row: HTMLTableRowElement = document.createElement("TR") as HTMLTableRowElement;
//                let TD1: HTMLTableCellElement = document.createElement("TD") as HTMLTableCellElement;
//                TD1.innerHTML = YoctoVisualization.ressources.FailedIcon("32", true, false, false, false, "oops");
//                TD1.style.textAlign = "right"
//                Row.appendChild(TD1);
//                let TD2: HTMLTableCellElement = document.createElement("TD") as HTMLTableCellElement;
//                TD2.style.fontSize = "smaller";
//                TD2.innerText = error;
//                Row.appendChild(TD2);
//                Table.appendChild(Row);
//                this._nextButton.enabled = false;
//            }
//            this._descPanel.appendChild(Table);
//            if (this._instancesFiles.length > 0)
//            {
//                let p: HTMLParagraphElement = document.createElement("P") as HTMLParagraphElement;
//                p.innerText = "Yocto-Visualization (for web) appears to be already installed on this hub. Click on next to modify this installation.";
//                this._descPanel.appendChild(p);
//                this._alreadyInstalled = true;
//
//            }
//        }
//        this._descPanel.style.display = "";
//        this._nextButton.visible = true;
//        this._prevButton.visible = true;
//
//        let tabIndex:number=1;
//        this._prevButton.tabIndex=tabIndex++;
//        this._nextButton.tabIndex=tabIndex++;
//        this._nextButton.focus();
//
//
//    }
//
//    private async loadWebPagesList(filenameDesc: HTMLParagraphElement | null)
//    {
//        this._webPageinstances = [];
//        let webFiles = await (<YoctoAPI.YFiles>this._currentfs).get_list("*");
//        for (let i: number = 0; i < webFiles.length; i++)
//        {
//            let filename: string = await webFiles[i].get_name();
//            if (filename.indexOf(".html") >= 0)
//            {
//                if (filenameDesc != null)
//                {
//                    filenameDesc.innerText = "Now downloading " + filename + "...";
//                }
//                let contents: Uint8Array = <Uint8Array>await (<YoctoAPI.YFiles>this._currentfs).download(filename);
//                if (filename.slice(-3) == ".gz")
//                {
//                    contents = <Uint8Array>Pako.Pako_Inflate.ungzip(contents, {})
//                }
//                let contentsStr: string = YoctoAPI.YAPI.imm_bin2str(contents);
//                if (contentsStr.indexOf("window.runYV()") > 0)
//                {
//                    this._webPageinstances.push(new pageInstance(filename, contents));
//                }
//
//            }
//        }
//    }
//
//    private async showModifyInstallPanel(visible: boolean, goingback: boolean)
//    {
//        if (!visible)
//        {
//            if (this._modifyInstallPanel != null) this._modifyInstallPanel.style.display = "none";
//            return;
//        }
//
//        this._nextButton.visible = false;
//        this._prevButton.visible = false;
//
//        if (this._modifyInstallPanel == null)
//        {
//
//            this._modifyInstallPanel = this.createNewContentDiv()
//            this._container.appendChild(this._modifyInstallPanel)
//
//        }
//        if (!goingback)
//        {
//
//            this.removeAllChilds(this._modifyInstallPanel);
//            this._jsCodeinstances = [];
//            this._webPageinstances = [];
//
//            let p: HTMLParagraphElement = document.createElement("P") as HTMLParagraphElement;
//            p.innerText = "Please wait, downloading and parsing files from the hub ";
//            this._modifyInstallPanel.appendChild(p);
//            this._modifyInstallPanel.style.display = "";
//
//            let files: HTMLParagraphElement = document.createElement("P") as HTMLParagraphElement;
//            files.innerText = "";
//            let filenameDesc: HTMLParagraphElement = document.createElement("P") as HTMLParagraphElement;
//            filenameDesc.style.fontSize = "smaller"
//            this._modifyInstallPanel.appendChild(filenameDesc);
//
//            for (let i: number = 0; i < this._instancesFiles.length; i++)
//            {
//                let filename: string = await this._instancesFiles[i].get_name();
//                filenameDesc.innerText = "Now downloading " + filename + "..."
//                files.innerText = filename;
//                let contentsStr: string = "";
//                let contents: Uint8Array = <Uint8Array>await (<YoctoAPI.YFiles>this._currentfs).download(filename);
//                if (filename.slice(-3) == ".gz")
//                {
//                    contents = <Uint8Array>Pako.Pako_Inflate.ungzip(contents, {})
//
//                }
//                contentsStr = YoctoAPI.YAPI.imm_bin2str(contents);
//                let esTarget: string = "";
//                let version: string = "";
//                let readonlyVersion: boolean = true;
//
//                let p: number = contentsStr.indexOf("*/");
//                if (p > 0)
//                {
//                    let firstLine = contentsStr.slice(0, p);
//                    let p1 = firstLine.indexOf("(");
//                    let p2 = firstLine.indexOf(")");
//                    /* Yocto-Visualization-4web (ES2017 read-only 1.2.3) - www.yoctopuce.com */
//
//                    if ((p1 > 0) && (p2 > p1))
//                    {
//                        let tokens: string[] = firstLine.slice(p1 + 1, p2).split(' ');
//                        if (tokens.length > 0) esTarget = tokens[0];
//                        if (tokens.length > 1) readonlyVersion = (tokens[1] != "full");
//                        if (tokens.length > 2) version = tokens[2];
//                    }
//                }
//                this._jsCodeinstances.push(new codeInstance(filename, esTarget, version, readonlyVersion));
//
//            }
//
//            await this.loadWebPagesList(filenameDesc);
//            filenameDesc.style.display = "none";
//
//            p.innerText = "What would you like to do ?"
//
//            let uninstallLegend: HTMLSpanElement = document.createElement("span") as HTMLSpanElement;
//            uninstallLegend.innerText = "Uninstall / delete all Yocto-Visualization (for web) related files\n\n";
//            this._uninstallOpt = document.createElement("input") as HTMLInputElement;
//            this._uninstallOpt.setAttribute('type', 'radio');
//            this._uninstallOpt.setAttribute('name', 'installType');
//            this._modifyInstallPanel.appendChild(this._uninstallOpt);
//            this._modifyInstallPanel.appendChild(uninstallLegend);
//
//            let BuildsFound: { [key: string]: number } = {};
//            for (let i: number = 0; i < this._jsCodeinstances.length; i++)
//            {
//                BuildsFound[<string>this._jsCodeinstances[i].version] = 1;
//            }
//            let BuildsFoundList: string = "";
//            for (let key in BuildsFound)
//            {
//                if (BuildsFound.hasOwnProperty(key))
//                {
//                    BuildsFoundList += (BuildsFoundList != "" ? ", " : "") + key
//                }
//            }
//
//            let updateLegend: HTMLSpanElement = document.createElement("span") as HTMLSpanElement;
//            updateLegend.innerText = "Update all from " + BuildsFoundList + " to " + YoctoVisualization.constants.buildVersion + "\n\n";
//            this._updateOpt = document.createElement("input") as HTMLInputElement;
//            this._updateOpt.setAttribute('type', 'radio');
//            this._updateOpt.setAttribute('name', 'installType');
//            this._modifyInstallPanel.appendChild(this._updateOpt);
//            this._modifyInstallPanel.appendChild(updateLegend);
//
//            let addInstanceLegend: HTMLSpanElement = document.createElement("span") as HTMLSpanElement;
//            addInstanceLegend.innerText = "Add a new instance \n\n";
//            this._addInstanceOpt = document.createElement("input") as HTMLInputElement;
//            this._addInstanceOpt.setAttribute('type', 'radio');
//            this._addInstanceOpt.setAttribute('name', 'installType');
//            this._modifyInstallPanel.appendChild(this._addInstanceOpt);
//            this._modifyInstallPanel.appendChild(addInstanceLegend);
//
//            let modInstanceLegend: HTMLSpanElement = document.createElement("span") as HTMLSpanElement;
//            modInstanceLegend.innerText = "Modify or delete existing instances \n\n";
//            this._modInstanceOpt = document.createElement("input") as HTMLInputElement;
//            this._modInstanceOpt.setAttribute('type', 'radio');
//            this._modInstanceOpt.setAttribute('name', 'installType');
//            this._modifyInstallPanel.appendChild(this._modInstanceOpt);
//            this._modifyInstallPanel.appendChild(modInstanceLegend);
//
//            if (!this._uninstallOpt.checked && !this._updateOpt.checked && !this._addInstanceOpt.checked && !this._modInstanceOpt.checked)
//            {
//                this._updateOpt.checked = true;
//            }
//
//        }
//
//        this._modifyInstallPanel.style.display = "";
//        this._nextButton.enabled = true;
//        this._prevButton.enabled = true;
//        this._nextButton.visible = true;
//        this._prevButton.visible = true;
//
//        let tabIndex:number=1;
//        (this._uninstallOpt    as HTMLElement).tabIndex=tabIndex++;
//        (this._updateOpt as HTMLElement).tabIndex=tabIndex++;
//        (this._addInstanceOpt      as HTMLElement).tabIndex=tabIndex++;
//        (this._modInstanceOpt  as HTMLElement).tabIndex=tabIndex++;
//        this._prevButton.tabIndex=tabIndex++;
//        this._nextButton.tabIndex=tabIndex++;
//        this._nextButton.focus();
//
//
//    }
//
//    private async showModInstancesPanel(visible: boolean, goingback: boolean)
//    {
//        if (!visible)
//        {
//            if (this._modInstancesPanel != null) this._modInstancesPanel.style.display = "none";
//            return;
//        }
//
//        if (this._modInstancesPanel == null)
//        {
//            this._modInstancesPanel = this.createNewContentDiv()
//            this._container.appendChild(this._modInstancesPanel)
//        }
//
//        let tabIndex:number=1;
//        if (!goingback)
//        {
//            this.removeAllChilds(this._modInstancesPanel);
//            let p: HTMLParagraphElement = document.createElement("P") as HTMLParagraphElement;
//            this._modInstancesPanel.appendChild(p);
//
//            p.innerText = "Here is a list of installed instances. Select an action for each one, then click on next to have them applied.";
//
//            let table: HTMLTableElement = document.createElement("Table") as HTMLTableElement;
//            table.style.marginLeft = "20px";
//            for (let i: number = 0; i < this._webPageinstances.length; i++)
//            {
//                let tr: HTMLTableRowElement = document.createElement("TR") as HTMLTableRowElement;
//                let td: HTMLTableCellElement = document.createElement("TD") as HTMLTableCellElement;
//
//                td.innerText = this._webPageinstances[i].http_filename + (this._webPageinstances[i].compressed ? "[.gz]" : "");
//                tr.appendChild(td);
//
//                let td2: HTMLTableCellElement = document.createElement("TD") as HTMLTableCellElement;
//                td2.style.paddingLeft = "10px";
//                let chooser: HTMLSelectElement = document.createElement("SELECT") as HTMLSelectElement;
//                chooser.tabIndex = tabIndex++;
//                let opt: HTMLOptionElement = document.createElement("OPTION") as HTMLOptionElement;
//                opt.tabIndex = tabIndex++;
//                opt.text = "Do Nothing";
//                opt.value = this._MODIFYNOTHING.toString();
//                chooser.add(opt);
//
//                let opt2: HTMLOptionElement = document.createElement("OPTION") as HTMLOptionElement;
//                if (this._webPageinstances[i].compressed)
//                {
//                    opt2.text = "Uncompress instance file";
//                    opt2.value = this._MODIFYUNCOMPRESS.toString();
//                }
//                else
//                {
//                    opt2.text = "Compress instance file";
//                    opt2.value = this._MODIFYCOMPRESS.toString();
//                }
//                chooser.add(opt2);
//
//                let opt3: HTMLOptionElement = document.createElement("OPTION") as HTMLOptionElement;
//                if (this._webPageinstances[i].readonly)
//                {
//                    opt3.text = "Allow read/write";
//                    opt3.value = this._MODIFYMAKEREADWRITE.toString();
//                }
//                else
//                {
//                    opt3.text = "Make read only";
//                    opt3.value = this._MODIFYMAKEREADONLY.toString();
//                }
//                chooser.add(opt3);
//
//                let opt4: HTMLOptionElement = document.createElement("OPTION") as HTMLOptionElement;
//                if (this._webPageinstances[i].useMinified)
//                {
//                    opt4.text = "Use human readable JS module";
//                    opt4.value = this._MODIFYUSEPLAIN.toString();
//                }
//                else
//                {
//                    opt4.text = "Use minified JS module";
//                    opt4.value = this._MODIFYUSEMINIFIED.toString();
//                }
//                chooser.add(opt4);
//
//                let opt5: HTMLOptionElement = document.createElement("OPTION") as HTMLOptionElement;
//                opt5.text = "Delete (cannot be reverted)";
//                opt5.value = this._MODIFYDELETE.toString();
//                chooser.add(opt5);
//
//                let index: number = i;
//                chooser.addEventListener("change", () =>
//                {
//                    this._webPageinstances[index].action = Number(chooser.value)
//                })
//                td2.appendChild(chooser);
//                tr.appendChild(td2);
//                table.appendChild(tr);
//
//            }
//            this._modInstancesPanel.appendChild(table)
//
//            let p2: HTMLParagraphElement = document.createElement("P") as HTMLParagraphElement;
//            this._removeUnusedJs = document.createElement("INPUT") as HTMLInputElement;
//            this._removeUnusedJs.tabIndex=tabIndex++;
//            this._removeUnusedJs.type = "checkbox";
//            this._removeUnusedJs.checked = true;
//            p2.appendChild(this._removeUnusedJs);
//            let span: HTMLInputElement = document.createElement("SPAN") as HTMLInputElement;
//            span.innerText = "Remove unused Yocto-Visualization (for web) JS module files";
//            p2.appendChild(span);
//            this._modInstancesPanel.appendChild(p2);
//
//            this._prevButton.tabIndex=tabIndex++;
//            this._nextButton.tabIndex=tabIndex++;
//            this._nextButton.focus();
//        }
//        this._modInstancesPanel.style.display = ""
//
//    }
//
//    private async showCustomFilesPanel(visible: boolean, goingback: boolean)
//    {
//        if (!visible)
//        {
//            if (this._customFilesPanel != null) this._customFilesPanel.style.display = "none";
//            return;
//        }
//
//        if (this._customFilesPanel == null)
//        {
//            this._customFilesPanel = this.createNewContentDiv()
//            this._container.appendChild(this._customFilesPanel)
//        }
//        if (!goingback)
//        {
//            this.removeAllChilds(this._customFilesPanel);
//            let p: HTMLParagraphElement = document.createElement("P") as HTMLParagraphElement;
//            p.innerText = this._plannedaction == this.ACTIONINSTALL ? "Optionnaly, you can customize your Yocto-Visualization (for web) installation by providing some files"
//                : "Optionnaly, you can customize your new instance by providing some files";
//            this._customFilesPanel.appendChild(p);
//
//            let Table: HTMLTableElement = document.createElement("TABLE") as HTMLTableElement;
//            Table.style.fontSize = "smaller"
//            Table.style.marginTop = "20px";
//            Table.style.marginBottom = "20px";
//            let Row: HTMLTableRowElement;
//            let TD1: HTMLTableCellElement
//            let TD2: HTMLTableCellElement
//
//            Row = document.createElement("TR") as HTMLTableRowElement;
//            TD1 = document.createElement("TD") as HTMLTableCellElement;
//            TD1.colSpan = 2;
//            // TD1.style.fontSize="smaller"
//            TD1.style.textAlign = "justify"
//            TD1.innerText = "You can choose an initial XML configuration file. You can get a XML configuration file from a Yocto-Visualization (for web) instance in the  \"Global configulation\" panel. You can also use a config.xml file from the Yocto-Visualization native version."
//            Row.appendChild(TD1);
//            Table.appendChild(Row);
//
//            Row = document.createElement("TR") as HTMLTableRowElement;
//            TD1 = document.createElement("TD") as HTMLTableCellElement;
//            TD1.innerText = "Config file:";
//            Row.appendChild(TD1);
//            TD2 = document.createElement("TD") as HTMLTableCellElement;
//            this._configFileInput = document.createElement("INPUT") as HTMLInputElement;
//            this._configFileInput.type = "file";
//            this._configFileInput.accept = ".xml"
//            TD2.appendChild(this._configFileInput)
//            Row.style.marginBottom = "10px";
//            Row.appendChild(TD2);
//            Table.appendChild(Row);
//
//            Row = document.createElement("TR") as HTMLTableRowElement;
//            TD1 = document.createElement("TD") as HTMLTableCellElement;
//            TD1.colSpan = 2;
//            //TD1.style.fontSize="smaller"
//            TD1.style.textAlign = "justify"
//            TD1.innerText = "\nYou can choose a container HTML file. Note: if this file relies on local dependencies such as images or CSS files, you'll have to upload them on the hub yourself."
//            Row.appendChild(TD1);
//            Table.appendChild(Row);
//            this._customFilesPanel.appendChild(Table);
//
//            Row = document.createElement("TR") as HTMLTableRowElement;
//            TD1 = document.createElement("TD") as HTMLTableCellElement;
//            TD1.innerText = "HTML file:";
//            Row.appendChild(TD1);
//            TD2 = document.createElement("TD") as HTMLTableCellElement;
//            this._webPageInput = document.createElement("INPUT") as HTMLInputElement;
//            this._webPageInput.type = "file";
//            this._webPageInput.accept = ".html"
//            TD2.appendChild(this._webPageInput)
//            Row.appendChild(TD2);
//            Table.appendChild(Row);
//
//        }
//        this._customFilesPanel.style.display = "";
//
//        this._nextButton.enabled = true;
//        this._prevButton.enabled = true;
//        this._nextButton.visible = true;
//        this._prevButton.visible = true;
//
//        let tabIndex:number=1;
//        (this._webPageInput      as HTMLElement).tabIndex=tabIndex++;
//        (this._configFileInput  as HTMLElement).tabIndex=tabIndex++;
//        this._prevButton.tabIndex=tabIndex++;
//        this._nextButton.tabIndex=tabIndex++;
//        this._nextButton.focus();
//
//
//    }
//
//    private async showOptionsPanel(visible: boolean, goingback: boolean)
//    {
//        if (!visible)
//        {
//            if (this._optionsPanel != null) this._optionsPanel.style.display = "none";
//            return;
//        }
//
//        if (this._optionsPanel == null)
//        {
//            this._optionsPanel = this.createNewContentDiv()
//            let p: HTMLParagraphElement = document.createElement("P") as HTMLParagraphElement;
//            p.innerText = (this._plannedaction == this.ACTIONINSTALL ? "You can also customize the installation behavior" :
//                "You can also customize this new instance behavior");
//            this._optionsPanel.appendChild(p);
//
//            p = document.createElement("P") as HTMLParagraphElement;
//            p.style.fontSize = "smaller";
//            p.style.marginBottom = "0px";
//            p.style.marginTop = "0px";
//            this._fileprefixInput = document.createElement("INPUT") as HTMLInputElement;
//
//            let presetname: string = this.DEFAULTFILEPREFIX;
//            let n: number = 1;
//            let checkgain: boolean = false;
//
//            do
//            {
//                checkgain = false;
//                for (let i: number = 0; i < this._webPageinstances.length; i++)
//                {
//                    if (presetname + this.TARGETEXTENSION == this._webPageinstances[i].http_filename)
//                    {
//                        n++;
//                        presetname = this.DEFAULTFILEPREFIX + "(" + n.toString() + ")";
//                        checkgain = true
//                    }
//                }
//            } while (checkgain) ;
//            this._fileprefixInput.value = presetname;
//
//            this._fileprefixInput.maxLength = 10;
//            this._fileprefixInput.size = 10;
//            let span: HTMLSpanElement = document.createElement("SPAN") as HTMLSpanElement;
//            span.innerText = "Set the instance name to : ";
//            p.appendChild(span);
//            p.appendChild(this._fileprefixInput);
//            this._optionsPanel.appendChild(p);
//
//            p = document.createElement("P") as HTMLParagraphElement;
//            p.style.fontSize = "smaller";
//            p.style.marginBottom = "0px";
//            p.style.marginTop = "0px";
//            this._useFullVersionInput = document.createElement("INPUT") as HTMLInputElement;
//            this._useFullVersionInput.type = "checkbox";
//            p.appendChild(this._useFullVersionInput);
//            span = document.createElement("SPAN") as HTMLInputElement;
//            span.innerText = this._plannedaction == this.ACTIONINSTALL ? "Install the non-minified version (easier to debug)"
//                : "Use the non-minified version (easier to debug)";
//            p.appendChild(span);
//            this._optionsPanel.appendChild(p);
//
//            p = document.createElement("P") as HTMLParagraphElement;
//            p.style.fontSize = "smaller";
//            p.style.marginBottom = "0px";
//            p.style.marginTop = "0px";
//
//            this._makeDefaultInput = document.createElement("INPUT") as HTMLInputElement;
//            this._makeDefaultInput.type = "checkbox";
//            p.appendChild(this._makeDefaultInput);
//            span = document.createElement("SPAN") as HTMLInputElement;
//            span.innerText = (this._plannedaction == this.ACTIONINSTALL ? "Make Yocto-Visualization (for web) the hub's default page" :
//                "Make this instance the hub's default page");
//            p.appendChild(span);
//            this._optionsPanel.appendChild(p);
//
//            p = document.createElement("P") as HTMLParagraphElement;
//            p.style.fontSize = "smaller";
//            p.style.marginBottom = "0px";
//            p.style.marginTop = "0px";
//            this._useReadOnlyInput = document.createElement("INPUT") as HTMLInputElement;
//            this._useReadOnlyInput.type = "checkbox";
//            //this._useReadOnlyInput.addEventListener("change", () =>
//            //{
//            //    this.MakeSureUserCredentialIsNotEmpty();
//            //    (<HTMLTableElement>this._userCredTable).style.display = (this._currentHub_ReadOnlyProtected && (<HTMLInputElement>this._useReadOnlyInput).checked) ? "" : "none"
//            //})
//            p.appendChild(this._useReadOnlyInput);
//            span = document.createElement("SPAN") as HTMLSpanElement;
//            span.innerText = (this._plannedaction == this.ACTIONINSTALL ? "Make the install read-only" : "Make this instance read-only");
//            p.appendChild(span);
//            this._optionsPanel.appendChild(p);
//
//            if (this._jsCodeinstances.length > 0)
//            {
//                this._useReadOnlyInput.checked = this._jsCodeinstances[0].readonly;
//                this._useFullVersionInput.checked = !this._jsCodeinstances[0].minified;
//            }
///*
//            this._userCredTable = document.createElement("TABLE") as HTMLTableElement;
//            this._userCredTable.style.fontSize = "small";
//            this._userCredTable.style.marginLeft = "20px";
//            this._userCredTable.style.marginTop = "0px";
//            this._userCredTable.style.marginBottom = "0px";
//
//            let Row: HTMLTableRowElement = document.createElement("TR") as HTMLTableRowElement;
//            let TD1: HTMLTableCellElement = document.createElement("TD") as HTMLTableCellElement;
//            TD1.colSpan = 2;
//            TD1.innerText = "On this hub, read-only feature requires the read-only credentials";
//            Row.appendChild(TD1);
//            this._userCredTable.appendChild(Row)
//            Row = document.createElement("TR") as HTMLTableRowElement;
//            TD1 = document.createElement("TD") as HTMLTableCellElement;
//
//            TD1.innerText = "Username:";
//            Row.appendChild(TD1);
//            let TD2: HTMLTableCellElement = document.createElement("TD") as HTMLTableCellElement;
//            this._userNameInput = document.createElement("INPUT") as HTMLInputElement;
//            this._userNameInput.value = "user"
//            this._userNameInput.addEventListener("input", () =>
//            {
//                this.MakeSureUserCredentialIsNotEmpty()
//            })
//            TD2.appendChild(this._userNameInput);
//            Row.appendChild(TD2);
//            this._userCredTable.appendChild(Row)
//            Row = document.createElement("TR") as HTMLTableRowElement;
//            TD1 = document.createElement("TD") as HTMLTableCellElement;
//            TD1.innerText = "Password:";
//            Row.appendChild(TD1);
//            TD2 = document.createElement("TD") as HTMLTableCellElement;
//            this._userPasswordInput = document.createElement("INPUT") as HTMLInputElement;
//            this._userPasswordInput.addEventListener("input", () =>
//            {
//                this.MakeSureUserCredentialIsNotEmpty()
//            })
//            TD2.appendChild(this._userPasswordInput);
//            Row.appendChild(TD2);
//            this._userCredTable.appendChild(Row)
//            this._userCredTable.style.display = "none"
//            this._optionsPanel.appendChild(this._userCredTable);
//            */
//
//
//            p = document.createElement("P") as HTMLParagraphElement;
//            p.innerText = 'Click on "Next" button to start the installation';
//            this._optionsPanel.appendChild(p);
//
//            this._container.appendChild(this._optionsPanel)
//        }
//       // this.MakeSureUserCredentialIsNotEmpty();
//   //     (<HTMLTableElement>this._userCredTable).style.display = (this._currentHub_ReadOnlyProtected && (<HTMLInputElement>this._useReadOnlyInput).checked) ? "" : "none"
//        this._nextButton.visible = true;
//        this._prevButton.visible = true;
//        this._optionsPanel.style.display = "";
//
//        let tabIndex:number=1;
//        (this._fileprefixInput      as HTMLElement).tabIndex=tabIndex++;
//        (this._useFullVersionInput  as HTMLElement).tabIndex=tabIndex++;
//        (this._makeDefaultInput     as HTMLElement).tabIndex=tabIndex++;
//        (this._useReadOnlyInput     as HTMLElement).tabIndex=tabIndex++;
//        this._prevButton.tabIndex=tabIndex++;
//        this._nextButton.tabIndex=tabIndex++;
//        this._nextButton.focus();
//
//    }
//
//    private logLine(line: string): HTMLSpanElement
//    {
//        let p: HTMLParagraphElement = document.createElement("P") as HTMLParagraphElement;
//        p.innerText = line + " ";
//        p.style.fontSize = "smaller";
//        p.style.marginLeft = "10px";
//        p.style.marginTop = "0px;"
//        p.style.marginBottom = "0px;"
//        p.style.paddingTop = "0px;"
//        p.style.paddingBottom = "0px;"
//
//        let span: HTMLSpanElement = document.createElement("SPAN") as HTMLSpanElement;
//        p.appendChild(span);
//        (<HTMLDivElement>this._runPanel).appendChild(p);
//        return span;
//    }
//
//    private async showRunPanel(visible: boolean, goingback: boolean)
//    {
//        if (!visible)
//        {
//            if (this._runPanel != null) this._runPanel.style.display = "none";
//            return;
//        }
//        if (this._runPanel == null)
//        {
//            this._runPanel = this.createNewContentDiv()
//        }
//        this.removeAllChilds(this._runPanel);
//        this._runPanel.style.display = "";
//
//        let desc: HTMLParagraphElement = document.createElement("P") as HTMLParagraphElement;
//
//        this._runPanel.appendChild(desc);
//        this._container.appendChild(this._runPanel)
//
//        this._nextButton.visible = false;
//        this._prevButton.visible = false;
//
//        switch (this._plannedaction)
//        {
//        case this.ACTIONINSTALL:
//            desc.innerText = "Installing on " + this._currentHub_Addr + "... please wait.";
//            try
//            {
//                await this.install((line: string): HTMLSpanElement =>
//                {
//                    return this.logLine(line);
//                });
//            }
//            catch (e)
//            {
//                this.gotoPanel(this.CONNECTIONERROR, "Installation failed with an internal error : " + (e as any).toString() + "\n\nFeel free to contact Yoctopuce support.");
//            }
//            break;
//        case this.ACTIONADDINSTANCE:
//            desc.innerText = "Creating new instance  on " + this._currentHub_Addr + "... please wait.";
//            try
//            {
//                await this.install((line: string): HTMLSpanElement =>
//                {
//                    return this.logLine(line);
//                });
//            }
//            catch (e)
//            {
//                this.gotoPanel(this.CONNECTIONERROR, "Instance creation failed with an internal error : " + (e as any).toString() + "\n\nFeel free to contact Yoctopuce support.");
//            }
//            break;
//        case this.ACTIONUNINSTALL:
//            desc.innerText = "Uninstalling everything from " + this._currentHub_Addr + "... please wait.";
//            try
//            {
//                await this.uninstall((line: string): HTMLSpanElement =>
//                {
//                    return this.logLine(line);
//                });
//            }
//            catch (e)
//            {
//                this.gotoPanel(this.CONNECTIONERROR, "Installation failed with an internal error : " + (e as any).toString() + "\n\nFeel free to contact Yoctopuce support.");
//            }
//            break;
//        case this.ACTIONUPDATE:
//            desc.innerText = "Updating js files on " + this._currentHub_Addr + "... please wait.";
//            try
//            {
//                await this.upgrade((line: string): HTMLSpanElement =>
//                {
//                    return this.logLine(line);
//                })
//            }
//            catch (e)
//            {
//                this.gotoPanel(this.CONNECTIONERROR, "Update failed with an internal error : " + (e as any).toString() + "\n\nFeel free to contact Yoctopuce support.");
//            }
//            break;
//        case this.ACTIONMODINSTANCE:
//            desc.innerText = "Modifying instances on " + this._currentHub_Addr + "... please wait.";
//            try
//            {
//                await this.modifyInstances((line: string): HTMLSpanElement =>
//                {
//                    return this.logLine(line);
//                })
//            }
//            catch (e)
//            {
//                this.gotoPanel(this.CONNECTIONERROR, "Instances modification failed with an internal error : " + (e as any).toString() + "\n\nFeel free to contact Yoctopuce support.");
//            }
//            break;
//
//        }
//
//    }
//
//    private checkHTMLfile(htmlData: string, errmsg: YoctoAPI.YErrorMsg): boolean
//    {
//        let upper: string = htmlData.toUpperCase();
//        if (upper.indexOf("<HTML") < 0)
//        {
//            errmsg.msg = "Provided web page is not a proper HTML file: no HTML tag";
//            return false;
//        }
//
//        if (upper.indexOf("</BODY>") < 0)
//        {
//            errmsg.msg = "Provided web page has an unexpected structure: no closing BODY tag";
//            return false;
//        }
//        return true;
//    }
//
//    private checkConfigfile(xmlData: string, errmsg: YoctoAPI.YErrorMsg): boolean
//    {
//        let parser: DOMParser = new DOMParser()
//
//        let doc: XMLDocument = parser.parseFromString(xmlData, "application/xml")
//        let root: ChildNode | null = null;
//
//        doc.childNodes.forEach(
//            node =>
//            {
//
//                if ((node.nodeName.toUpperCase() == "ROOT") && (root == null)) root = node;
//            })
//        if (root == null)
//        {
//            errmsg.msg = "Provided config XML file is not a proper YoctoVisualization 2 config file. Unable to find ROOT node, either the root node does not exists or the file caused an XML parse error."
//            return false;
//        }
//
//        let rootNode: YoctoVisualization.YXmlNode = new YoctoVisualization.YXmlNode(root)
//        let attributes: { [index: string]: string } = rootNode.Attributes;
//        if (!attributes.hasOwnProperty("version"))
//        {
//            errmsg.msg = "Provided  XML config file is not a proper Yocto-Visualization 2 config file (No ROOT Version attribute)"
//            return false;
//        }
//        if (parseFloat(attributes["version"]) < 2)
//        {
//            errmsg.msg = "Provided XML config file is not a proper Yocto-Visualization 2 config file (at least Version 2.0 is required)"
//            return false;
//        }
//        return true;
//    }
//
//    private findChild(parent: XMLDocument | ChildNode, name: string): ChildNode | null
//    {
//        let res: ChildNode | null = null
//        parent.childNodes.forEach(node =>
//        {
//            if ((node.nodeName == name))
//            {
//                res = node;
//                return
//            }
//        });
//        return res;
//    }
//
//    private patchConfigFile(xmlData: string): string
//    {
//        let startTag = "<Hubs>"
//        let endTag = "</Hubs>"
//
//        let parser: DOMParser = new DOMParser()
//        let doc: XMLDocument = parser.parseFromString(xmlData, "application/xml")
//        let rootNode: ChildNode | null = this.findChild(doc, "ROOT");
//        if (rootNode == null) throw "No root node in config file."
//        let configNode: ChildNode | null = this.findChild(rootNode, "Config");
//        if (configNode == null) throw "No config node in config file."
//        let Hubs: ChildNode | null = this.findChild(configNode, "Hubs");
//        let HubSection: string;
//        if (Hubs == null)
//        {
//            HubSection = startTag + '\n' + this.getHubConfig() + "\n" + endTag + "\n"
//            xmlData = xmlData.replace("<Config>", "<Config>\n" + HubSection)
//        }
//        else
//        {
//            let list: NodeListOf<ChildNode> = Hubs.childNodes;
//            let sourceHubFound: boolean = false;
//            HubSection = startTag + "\n";
//            for (let i: number = 0; i < list.length; i++)
//            {
//                if (list[i].nodeName == "Hub")
//                {
//                    let node: YoctoVisualization.YXmlNode = new YoctoVisualization.YXmlNode(list[i])
//                    let attributes: { [index: string]: string } = node.Attributes;
//                    let addr: string = attributes.hasOwnProperty("addr") ? attributes["addr"] : "";
//                    let port: string = attributes.hasOwnProperty("port") ? attributes["port"] : "80";
//                    let protocol: string = attributes.hasOwnProperty("protocol") ? attributes["protocol"] : "";
//                    let path: string = attributes.hasOwnProperty("path") ? attributes["path"] : "";
//                    let username: string = attributes.hasOwnProperty("user") ? attributes["user"] : "";
//                    let password: string = attributes.hasOwnProperty("password") ? attributes["password"] : "";
//                    if (!sourceHubFound && (addr == this._currentHub_Addr) && (port == this._currentHub_port) && (path == this._currentHub_path))
//                    {
//                        sourceHubFound = true;
//                        HubSection += "    " + this.getHubConfig() + "\n";
//                    }
//                    else
//                    {
//                        HubSection += "    " + this.createHubRecord(protocol, addr, port, path, username, password, true) + "\n"
//                    }
//                }
//            }
//            if (!sourceHubFound) HubSection += "    " + this.getHubConfig() + "\n";
//            HubSection += "  ";
//            let indexStart: number = xmlData.indexOf(startTag);
//            let indexStop: number = xmlData.indexOf(endTag);
//            if (indexStart < 0) throw "Cannot locate Hubs start tag in provided  config file";
//            if (indexStop < 0) throw "Cannot locate Hubs end tag in provided  config file";
//            xmlData = xmlData.substr(0, indexStart) + HubSection + xmlData.substr(indexStop)
//
//        }
//        return xmlData;
//    }
//
//    private createHubRecord(protocol: string, addr: string, port: string, path: string, username: string, password: string, removable: boolean): string
//    {
//        let res: string = '<Hub protocol="' + YoctoVisualization.constants.XMLquote(protocol) + '"'
//            + ' addr="' + YoctoVisualization.constants.XMLquote(addr) + '"'
//            + ' port="' + YoctoVisualization.constants.XMLquote(port) + '"';
//        if (path != "") res += ' path="' + YoctoVisualization.constants.XMLquote(path) + '"';
//        if (username != "") res += ' user="' + YoctoVisualization.constants.XMLquote(username) + '"';
//        if (password != "") res += ' password="' + YoctoVisualization.constants.XMLquote(password) + '"';
//        if (!removable) res += ' removable="FALSE"'
//        res += "/>"
//        return res;
//
//    }
//
//    private getHubConfig(): string
//    {
//        let username = "";
//        let password = ""
//        if (this._currentHub_ReadOnlyProtected )
//        {
//            username = (<HTMLInputElement>this._userNameInput).value;
//            password = YoctoVisualization.Hub.encryptPassword((<HTMLInputElement>this._userPasswordInput).value);
//        }
//        return this.createHubRecord(this._currentHub_protocol, this._currentHub_Addr, this._currentHub_port, this._currentHub_path, username, password, false);
//    }
//
//    private getSeedCode(configfile: string | null, readonly: boolean, minified: boolean): string
//    {
//        let res: string = '\n<script type="module">\n'
//        if (configfile == null) configfile = '<?xml version="1.0" ?><ROOT version="2.1"><Config><Hubs>' + this.getHubConfig() + '</Hubs></Config></ROOT>\n';
//
//        let filename = 'yv4web-' + (readonly ? "readonly" : "full") + (minified ? ".min" : "") + ".js"
//        res += ' import { YWebPage, YoctoHubFileHandler }  from "./' + filename + '";\n'
//        res += ' window.runYV= async ()=>{'
//        res += ' let filehandler = await YoctoHubFileHandler.start(';
//        if (configfile != null) res += JSON.stringify(configfile);
//        res += ");\n";
//        res += '  YWebPage.run(filehandler.xmlConfigData, filehandler.configChangeCallbackFct';
//        if (!readonly) res += ',filehandler.saveFct';
//        res += ");\n";
//        res += '};\n window.runYV();</script>\n';
//        res += '<script nomodule="">\n';
//        res += 'document.write("<p style=\'font-family: sans-serif; text-align:center\'>Yocto-Visualization (for web) cannot run on this browser. Sorry.<br>Consider using a more recent browser, or <a href=\'https://www.yoctopuce.com/EN/tools.php\'>the native version</a>. </p>")\n';
//        res += '</script>\n';
//        return res;
//    }
//
//    private defaultHTMLfile(configfile: string | null, readonly: boolean, minified: boolean)
//    {   // pinch zoom is disabled beacause it interfers with graphs pinch zoom and automatic DPI detection
//        return "<!DOCTYPE HTML>\n<HTML lang='en-US'><HEAD>\n<title>\nYocto-Visualization</title>\n" + this.icon + "\n<meta name='viewport' content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'/></HEAD>\n<BODY>\n</BODY>" + this.getSeedCode(configfile, readonly, minified) + "\n</HTML>\n"
//    }
//
//    async uploadWidthProgress(str_path: string, bin_content: Uint8Array | string | number[], progress: YoctoAPI.YDownloadProgressCallback): Promise<number>
//    {
//        let yreq = await (<YoctoAPI.YFiles>this._currentfs)._uploadWithProgress(str_path, bin_content, progress);
//        return yreq.errorType;
//    }
//
//    private async upgrade(log: installLogFct)
//    {
//        let install_minified_readonly: boolean = false;
//        let install_plain_readonly: boolean = false;
//        let install_minified_readwrite: boolean = false;
//        let install_plain_readwrite: boolean = false;
//
//        for (let i: number = 0; i < this._jsCodeinstances.length; i++)
//        {
//            if (this._jsCodeinstances[i].minified)
//            {
//                if (this._jsCodeinstances[i].readonly)
//                {
//                    install_minified_readonly = true;
//                }
//                else
//                {
//                    install_minified_readwrite = true;
//                }
//            }
//            else
//            {
//                if (this._jsCodeinstances[i].readonly)
//                {
//                    install_plain_readonly = true;
//                }
//                else
//                {
//                    install_plain_readwrite = true;
//                }
//            }
//        }
//
//        if (install_minified_readonly) await this.copyJsCode(log, true, true);
//        if (install_plain_readonly) await this.copyJsCode(log, true, false);
//        if (install_minified_readwrite) await this.copyJsCode(log, false, true);
//        if (install_plain_readwrite) await this.copyJsCode(log, false, false);
//        log('Done.');
//        setTimeout(() =>
//        {
//            this.gotoPanel(this.DONEPANEL);
//        }, 2000);
//    }
//
//    private async syncJsFile(log: installLogFct, required: boolean, readonly: boolean, minified: boolean, removeunused: boolean)
//    {
//        let jsfile: string = this.get_js_filename(readonly, minified) + ".gz";
//        let exists: boolean = await (<YoctoAPI.YFiles>this._currentfs).fileExist(jsfile);
//        if (required && (!exists)) await this.copyJsCode(log, readonly, minified);
//        if (!required && exists && removeunused)
//        {
//            let span = log("Deleting " + jsfile);
//            await (<YoctoAPI.YFiles>this._currentfs).remove(jsfile);
//            span.innerText = "done."
//        }
//
//    }
//
//    private async syncJsFileVersions(log: installLogFct, removeunused: boolean)
//    {
//        let require_minified_readonly: boolean = false;
//        let require_plain_readonly: boolean = false;
//        let require_minified_readwrite: boolean = false;
//        let require_plain_readwrite: boolean = false;
//
//        for (let i: number = 0; i < this._webPageinstances.length; i++)
//        {
//            if (this._webPageinstances[i].useMinified)
//            {
//                if (this._webPageinstances[i].readonly)
//                {
//                    require_minified_readonly = true;
//                }
//                else
//                {
//                    require_minified_readwrite = true;
//                }
//            }
//            else
//            {
//                if (this._webPageinstances[i].readonly)
//                {
//                    require_plain_readonly = true;
//                }
//                else
//                {
//                    require_plain_readwrite = true;
//                }
//            }
//        }
//        await this.syncJsFile(log, require_minified_readonly, true, true, removeunused);
//        await this.syncJsFile(log, require_plain_readonly, true, false, removeunused);
//        await this.syncJsFile(log, require_minified_readwrite, false, true, removeunused);
//        await this.syncJsFile(log, require_plain_readwrite, false, false, removeunused);
//
//    }
//
//    private async patchPageInstance(log: installLogFct, page: pageInstance,
//                                    signature1: string, replace1: string,
//                                    altsignature1: string, altreplace1: string,
//                                    signature2: string, replace2: string)
//    {
//        let contents: string = YoctoAPI.YAPI.imm_bin2str(page.contents);
//
//        let p: number = contents.indexOf(signature1);
//        if ((p < 0) && (altsignature1 != ""))
//        {
//            signature1 = altsignature1;
//            replace1 = altreplace1;
//            p = contents.indexOf(signature1);
//        }
//        if (p < 0) throw "Operation failed: cannot find the [" + signature1 + "] import signature in " + page.fs_filename;
//        contents = contents.substr(0, p) + replace1 + contents.substr(p + signature1.length);
//        if (signature2 != "")
//        {
//            p = contents.indexOf(signature2);
//            if (p < 0) throw "Operation failed: cannot find the [" + signature2 + "] signature parameter in " + page.fs_filename;
//            contents = contents.substr(0, p) + replace2 + contents.substr(p + signature2.length);
//        }
//        let bincontents: Uint8Array = YoctoAPI.YAPI.imm_str2bin(contents);
//        let filename: string = page.fs_filename;
//        if (page.compressed)
//        {
//            let status: HTMLSpanElement = log("Compressing  " + filename)
//            bincontents = <Uint8Array>Pako.Pako_Deflate.gzip(bincontents, {level: 9})
//            status.innerText = 'done';
//        }
//        let status: HTMLSpanElement = log('Uploading  ' + filename + " to hub");
//        status.innerText = '0%';
//        let success: number = await this.uploadWidthProgress(filename, bincontents, (curr: number, total: number) =>
//        {
//            status.innerText = Math.round(100 * curr / total).toString() + "%"
//        })
//        status.innerText = 'done';
//
//        if (success != YoctoAPI.YAPI_SUCCESS) throw "Upload failed (Error" + success.toString() + ")";
//
//    }
//
//    private async modifyInstances(log: installLogFct)
//    {
//        for (let i: number = 0; i < this._webPageinstances.length; i++)
//        {
//            switch (this._webPageinstances[i].action)
//            {
//            case this._MODIFYNOTHING :
//                break;
//            case this._MODIFYDELETE :
//                let span: HTMLSpanElement = log('Deleting ' + this._webPageinstances[i].fs_filename);
//                await (<YoctoAPI.YFiles>this._currentfs).remove(this._webPageinstances[i].fs_filename);
//                span.innerText = "done."
//                break;
//            case this._MODIFYUNCOMPRESS :
//            {
//                let filename: string = this._webPageinstances[i].http_filename
//                let status: HTMLSpanElement = log('Uploading  ' + filename + " to hub");
//                status.innerText = '0%';
//                let success: number = await this.uploadWidthProgress(filename, this._webPageinstances[i].contents, (curr: number, total: number) =>
//                {
//                    status.innerText = Math.round(100 * curr / total).toString() + "%"
//                })
//                status.innerText = 'done';
//                if (success != YoctoAPI.YAPI_SUCCESS) throw "Upload failed (Error" + success.toString() + ")";
//                status = log('Deleting ' + this._webPageinstances[i].fs_filename);
//                await (<YoctoAPI.YFiles>this._currentfs).remove(this._webPageinstances[i].fs_filename);
//                status.innerText = "done."
//            }
//                break;
//            case this._MODIFYCOMPRESS :
//            {
//                let filename: string = this._webPageinstances[i].http_filename + ".gz";
//                let status: HTMLSpanElement = log("Compressing  " + filename)
//                let GZ_data: Uint8Array = <Uint8Array>Pako.Pako_Deflate.gzip(this._webPageinstances[i].contents, {level: 9})
//                status.innerText = 'done';
//                status = log('Uploading  ' + filename + " to hub");
//                status.innerText = '0%';
//                let success: number = await this.uploadWidthProgress(filename, GZ_data, (curr: number, total: number) =>
//                {
//                    status.innerText = Math.round(100 * curr / total).toString() + "%"
//                })
//                status.innerText = 'done';
//                if (success != YoctoAPI.YAPI_SUCCESS) throw "Upload failed (Error" + success.toString() + ")";
//                status = log('Deleting ' + this._webPageinstances[i].http_filename);
//                await (<YoctoAPI.YFiles>this._currentfs).remove(this._webPageinstances[i].http_filename);
//
//                status.innerText = "done."
//            }
//                break;
//            case this._MODIFYMAKEREADONLY :
//
//                await this.patchPageInstance(log, this._webPageinstances[i],
//                    "from \"./yv4web-full", "from \"./yv4web-readonly",
//                    "", "",
//
//                    ",filehandler.saveFct);", ");");
//                this._webPageinstances[i].readonly = true;
//                break;
//
//            case this._MODIFYMAKEREADWRITE :
//                await this.patchPageInstance(log, this._webPageinstances[i],
//                    "from \"./yv4web-readonly", "from \"./yv4web-full",
//                    "", "",
//                    "filehandler.configChangeCallbackFct);", "filehandler.configChangeCallbackFct,filehandler.saveFct);");
//                this._webPageinstances[i].readonly = false;
//                break;
//
//            case this._MODIFYUSEPLAIN :
//                await this.patchPageInstance(log, this._webPageinstances[i],
//                    "\"./yv4web-full.min.js\"", "\"./yv4web-full.js\"",
//                    "\"./yv4web-readonly.min.js\"", "\"./yv4web-readonly.js\"",
//                    "", "");
//                this._webPageinstances[i].useMinified = false;
//                break;
//
//            case this._MODIFYUSEMINIFIED :
//                await this.patchPageInstance(log, this._webPageinstances[i],
//                    "\"./yv4web-full.js\"", "\"./yv4web-full.min.js\"",
//                    "\"./yv4web-readonly.js\"", "\"./yv4web-readonly.min.js\"",
//                    "", "");
//                this._webPageinstances[i].useMinified = true;
//                break;
//            }
//        }
//
//        await this.syncJsFileVersions(log, (<HTMLInputElement>this._removeUnusedJs).checked);
//        log('Done.');
//        setTimeout(() =>
//        {
//            this.gotoPanel(this.DONEPANEL);
//        }, 2000);
//    }
//
//    private async uninstall(log: installLogFct)
//    {
//        for (let i: number = 0; i < this._jsCodeinstances.length; i++)
//        {
//            let filename: string = this._jsCodeinstances[i].filename;
//            log('Deleteting ' + filename);
//            await (<YoctoAPI.YFiles>this._currentfs).remove(filename);
//        }
//
//        let network: YoctoAPI.YNetwork = await YoctoAPI.YNetwork.FindNetwork((await (<YoctoAPI.YModule>this._currentHub).get_serialNumber()) + ".network")
//        let startPage: string = await network.get_defaultPage();
//        let mustResetStartPage: boolean = false;
//
//        for (let i: number = 0; i < this._webPageinstances.length; i++)
//        {
//            let filename: string = this._webPageinstances[i].fs_filename;
//            if (startPage == this._webPageinstances[i].http_filename) mustResetStartPage = true;
//            log('Deleteting ' + filename);
//            await (<YoctoAPI.YFiles>this._currentfs).remove(filename)
//        }
//
//        if (mustResetStartPage)
//        {
//            log('Setting default page to index.html');
//            await network.set_defaultPage("");
//            await (<YoctoAPI.YModule>this._currentHub).saveToFlash()
//        }
//
//        log('Done.');
//        setTimeout(() =>
//        {
//            this.gotoPanel(this.DONEPANEL);
//        }, 2000);
//
//    }
//
//    private get_js_filename(readonly: boolean, minified: boolean)
//    {
//        return 'yv4web-' + (readonly ? "readonly" : "full") + (minified ? ".min" : "") + ".js";
//
//    }
//
//    private get_js_blob(readonly: boolean, minified: boolean): Uint8Array | null
//    {
//        let data: string;
//        if (readonly)
//        {
//            data = minified ? Binaries.BinariesBlobs.ro_minjs : Binaries.BinariesBlobs.ro_js;
//        }
//        else
//        {
//            data = minified ? Binaries.BinariesBlobs.rw_minjs : Binaries.BinariesBlobs.rw_js;
//        }
//        if (data == "") return null;
//
//        return YoctoAPI.YAPI.imm_str2bin(atob(data));
//    }
//
//    private async copyJsCode(log: installLogFct, readonly: boolean, minified: boolean)
//    {
//        let currentURL: string = window.location.href;
//        let filename: string = (<string>currentURL.split('/').pop()).split('#')[0].split('?')[0]; // thanks  Quidn @ stackoverflow
//        let jsfile = this.get_js_filename(readonly, minified);
//        let GZ_data: Uint8Array | null = this.get_js_blob(readonly, minified);
//        let status: HTMLSpanElement;
//        if (GZ_data == null)
//        {  // if Module Gzipped data blob  not present in the installer, we try to download it from the server.
//            status = log('Downloading ' + jsfile + ' module from server..');
//            let jsfileURL = currentURL.replace(filename, '../../dist/' + this.ESVersion + '/' + jsfile);
//            let result: YoctoVisualization.HTTPrequestResult;
//            result = await YoctoVisualization.YoctoHubFileHandler.makeRequest("GET", jsfileURL);
//            if (result.data == null)
//            {
//                let err: string = "Installation Failed: cannot download the Yocto-Visualization file from the serveur serving this installer.\n\nError was : " + result.statusText + '\n\nURL was: ' + jsfileURL;
//                this.gotoPanel(this.CONNECTIONERROR, err);
//                return;
//            }
//            status.innerText = 'done.';
//            // save JS module
//            status = log('Compressing JS Module..');
//            GZ_data = <Uint8Array>Pako.Pako_Deflate.gzip(result.data, {level: 9})
//            status.innerText = 'done.';
//        }
//        status = log('Copying JS Module to hub..');
//        status.innerText = '0%';
//        let success: number = await this.uploadWidthProgress(jsfile + '.gz', <Uint8Array>GZ_data, (curr: number, total: number) =>
//        {
//            status.innerText = Math.round(100 * curr / total).toString() + "%"
//        })
//        if (success != YoctoAPI.YAPI_SUCCESS) throw "Upload failed (Error" + success.toString() + ")";
//        status.innerText = 'done.';
//    }
//
//    private async install(log: installLogFct)
//    {
//        let configFile: string | null = await this.loadLocalFile(<HTMLInputElement>this._configFileInput)
//        if (configFile != null)
//        {
//            configFile = configFile.replace("<" + "!-->", "<" + "!-- ")  // some YoctoVisualization version save a buggy XML file
//            let err: YoctoAPI.YErrorMsg = new YoctoAPI.YErrorMsg()
//            if (!this.checkConfigfile(configFile, err))
//            {
//                this.gotoPanel(this.CONNECTIONERROR, "Installation failed\n\n" + err.msg);
//                return;
//            }
//            let index: number = configFile.toUpperCase().indexOf("</ROOT");
//            if (index < 0) this.gotoPanel(this.CONNECTIONERROR, "Installation failed\n\nunable to find ROOT closing tag in provided config file");
//            configFile = configFile.substring(0, index) + "</ROOT>\n"; // the config file *MUST* end with this specific signature sequence.
//            configFile = this.patchConfigFile(configFile);
//        }
//
//        let htmlFile: string | null = await this.loadLocalFile(<HTMLInputElement>this._webPageInput)
//        if (htmlFile != null)
//        {
//            let err: YoctoAPI.YErrorMsg = new YoctoAPI.YErrorMsg()
//            if (!this.checkHTMLfile(htmlFile, err))
//            {
//                this.gotoPanel(this.CONNECTIONERROR, "Installation failed\n\n" + err.msg);
//                return;
//            }
//        }
//
//        let status: HTMLSpanElement;
//        let GZ_data: Uint8Array;
//        let success: number;
//        let readonly: boolean = (<HTMLInputElement>this._useReadOnlyInput).checked;
//        let minified: boolean = !(<HTMLInputElement>this._useFullVersionInput).checked;
//        let mustInstallJsCode = this._plannedaction == this.ACTIONINSTALL
//
//        // add instance, check if matching jsCode is already installed
//        if (this._plannedaction == this.ACTIONADDINSTANCE)
//        {
//            mustInstallJsCode = true;
//            for (let i = 0; i < this._jsCodeinstances.length; i++)
//            {
//                if ((this._jsCodeinstances[i].minified == minified)
//                    && (this._jsCodeinstances[i].readonly == readonly))
//                {
//                    mustInstallJsCode = false;
//                }
//            }
//        }
//
//        if (mustInstallJsCode) await this.copyJsCode(log, readonly, minified);
//
//        status = log('Creating HTML file..');
//        let targetHTMLfile: string;
//        // load web  file
//        if (htmlFile != null)
//        {
//            let index: number = htmlFile.toUpperCase().indexOf("</BODY>");
//            let tag: string = htmlFile.substr(index, 7)
//            targetHTMLfile = htmlFile.replace(tag, tag + this.getSeedCode(configFile, readonly, minified))
//        }
//        else
//        {
//            targetHTMLfile = this.defaultHTMLfile(configFile, readonly, minified);
//        }
//
//        status = log('Compressing  HTML file..');
//
//        GZ_data = <Uint8Array>Pako.Pako_Deflate.gzip(YoctoAPI.YAPI.imm_str2bin(targetHTMLfile), {level: 9})
//        status.innerText = 'done.';
//        status = log('Saving HTML file on hub');
//
//        let targetFile: string = (<HTMLInputElement>this._fileprefixInput).value + this.TARGETEXTENSION;
//        status.innerText = '0%';
//        success = await this.uploadWidthProgress(targetFile + ".gz", GZ_data, (curr: number, total: number) =>
//        {
//            status.innerText = Math.round(100 * curr / total).toString() + "%"
//        })
//        if (success != YoctoAPI.YAPI_SUCCESS) throw "Upload failed (Error" + success.toString() + ")";
//        status.innerText = 'done.';
//        status = log('Configuring hub');
//        let url = this._currentHub_protocol + "://" + this._applicationURL;
//        let network = await YoctoAPI.YNetwork.FindNetwork(await ((<YoctoAPI.YModule>this._currentHub).get_serialNumber()) + ".network");
//        if ((<HTMLInputElement>this._makeDefaultInput).checked)
//        {
//            await network.set_defaultPage(targetFile);
//        }
//        else
//        {
//            if (await network.get_defaultPage() == targetFile) await network.set_defaultPage("");
//            url += "/" + targetFile;
//        }
//        let warning: string = "";
//        if (readonly && (configFile == null)) warning = "However, since you chose to install the read-only version without any configuration file, your install is probably useless."
//
//        await YoctoAPI.YAPI.UnregisterHub(await (<YoctoAPI.YModule>this._currentHub).get_url());
//        status.innerText = 'done.';
//        this._warning = warning;
//        this._finalURL = url;
//        setTimeout(() =>
//        {
//            this.gotoPanel(this.DONEPANEL);
//        }, 2000);
//
//    }
//
//    private removeAllChilds(element: HTMLElement)
//    {
//        while (element.firstChild)
//        {
//            element.removeChild(<any>element.firstChild);
//        }
//
//    }
//
//    private async showConfirmUninstallPanel(visible: boolean, goingback: boolean)
//    {
//        if (!visible)
//        {
//            if (this._confirmUninstallPanel != null) this._confirmUninstallPanel.style.display = "none";
//            return;
//        }
//
//        if (this._confirmUninstallPanel == null)
//        {
//            this._confirmUninstallPanel = this.createNewContentDiv()
//            this._container.appendChild(this._confirmUninstallPanel)
//        }
//        if (!goingback)
//        {
//            this.removeAllChilds(this._confirmUninstallPanel);
//
//            let p: HTMLParagraphElement = document.createElement("P") as HTMLParagraphElement;
//            p.innerText = "You are about to remove all files related to Yocto-Visualization (for web)  from hub " + this._currentHub_Addr
//                + ", including instances that probably took you quite some time to configure. Are you sure you want to "
//                + "click on Next and start uninstallation? You will not be able to revert this operation.\n\n";
//
//            this._confirmUninstallPanel.appendChild(p);
//
//            this._confirmUninstall = document.createElement("input") as HTMLInputElement;
//            this._confirmUninstall.type = "checkbox"
//            let bt: YoctoVisualization.button = this._nextButton;
//            this._confirmUninstall.addEventListener('change', function ()
//            {
//                bt.enabled = this.checked;
//            });
//
//            this._confirmUninstallPanel.appendChild(this._confirmUninstall);
//            let txt: HTMLSpanElement = document.createElement("span") as HTMLSpanElement;
//            txt.innerText = "Yes, I know what I am doing."
//            this._confirmUninstallPanel.appendChild(txt);
//
//        }
//        this._confirmUninstallPanel.style.display = "";
//        this._nextButton.visible = true;
//        this._nextButton.enabled = (<HTMLInputElement>this._confirmUninstall).checked;
//        this._prevButton.visible = true;
//
//        let tabIndex:number=1;
//        (this._confirmUninstall    as HTMLElement).tabIndex=tabIndex++;
//
//        this._prevButton.tabIndex=tabIndex++;
//        this._nextButton.tabIndex=tabIndex++;
//        (this._confirmUninstall as HTMLElement).focus();
//
//
//
//    }
//
//    private async showDonePanel(visible: boolean, goingback: boolean)
//    {
//        if (!visible)
//        {
//            if (this._donePanel != null) this._donePanel.style.display = "none";
//            return;
//        }
//
//        if (this._donePanel == null)
//        {
//            this._donePanel = this.createNewContentDiv()
//            let Table: HTMLTableElement = document.createElement("TABLE") as HTMLTableElement;
//            let Row: HTMLTableRowElement = document.createElement("TR") as HTMLTableRowElement;
//            let TD1: HTMLTableCellElement = document.createElement("TD") as HTMLTableCellElement;
//            TD1.innerHTML = YoctoVisualization.ressources.OkIcon("64", true, false, false, false, "youpi!");
//            Row.appendChild(TD1);
//            this._doneMsgContainer = document.createElement("TD") as HTMLTableCellElement;
//            Row.appendChild(this._doneMsgContainer);
//            Table.appendChild(Row)
//            this._donePanel.appendChild(Table)
//            this._container.appendChild(this._donePanel)
//        }
//
//        this.removeAllChilds(<HTMLTableCellElement>this._doneMsgContainer);
//
//        let p: HTMLParagraphElement = document.createElement("P") as HTMLParagraphElement;
//        switch (this._plannedaction)
//        {
//        case this.ACTIONADDINSTANCE :
//        case this.ACTIONINSTALL:
//            p.innerText = this._plannedaction == this.ACTIONINSTALL ?
//                "Installation sucessfully completed. Application can be accessed through the following URL:"
//                : "New instance sucessfully completed, it can be accessed through the following URL:";
//            (<HTMLTableCellElement>this._doneMsgContainer).appendChild(p);
//            let url: HTMLAnchorElement = document.createElement("A") as HTMLAnchorElement;
//            url.innerText = this._finalURL;
//            url.style.cursor = "pointer";
//            url.style.color = "#0000EE";
//            url.style.textDecoration = "underline";
//
//            url.addEventListener("click", () =>
//            {
//                if (top) top.location.assign(this._finalURL);
//            });
//            (<HTMLTableCellElement>this._doneMsgContainer).appendChild(url);
//            if (this._warning != "")
//            {
//                p = document.createElement("P") as HTMLParagraphElement;
//                p.innerText = this._warning;
//                (<HTMLTableCellElement>this._doneMsgContainer).appendChild(p);
//            }
//            break;
//        case this.ACTIONUNINSTALL:
//            p.innerText = "Files sucessfully removed.";
//            (<HTMLTableCellElement>this._doneMsgContainer).appendChild(p);
//            break;
//        case this.ACTIONUPDATE:
//            p.innerText = "JS Files sucessfully updated.";
//            (<HTMLTableCellElement>this._doneMsgContainer).appendChild(p);
//            break;
//        case this.ACTIONMODINSTANCE:
//            p.innerText = "Instances modifications done";
//            (<HTMLTableCellElement>this._doneMsgContainer).appendChild(p);
//            break;
//
//        }
//
//        p = document.createElement("P") as HTMLParagraphElement;
//        p.innerText = 'Click on the "Ok" button to restart the wizard';
//        (<HTMLTableCellElement>this._doneMsgContainer).appendChild(p);
//
//        this._history.pop(); // this panel is not accessible through prev button
//        this._nextButton.visible = false;
//        this._prevButton.visible = false;
//        this._okButton.visible = true;
//        this._donePanel.style.display = "";
//
//        let tabIndex:number=1;
//        this._okButton.tabIndex=tabIndex++;
//        this._okButton.focus();
//    }
//
//    private showCurrentStep(back: boolean, msg?: string)
//    {
//        /* debug
//        if(this._currentStep == this.WELCOMEPANEL) console.log("WELCOMEPANEL");
//        else if(this._currentStep == this.ENTERHUBADDR) console.log("ENTERHUBADDR");
//        else if(this._currentStep == this.CONNECTINGPANEL) console.log("CONNECTINGPANEL");
//        else if(this._currentStep == this.CONNECTIONERROR) console.log("CONNECTIONERROR");
//        else if(this._currentStep == this.PASSWORDPANEL) console.log("PASSWORDPANEL");
//        else if(this._currentStep == this.DESCRIPTIONPANEL) console.log("DESCRIPTIONPANEL");
//        else if(this._currentStep == this.CUSTOMFILESPANEL) console.log("CUSTOMFILESPANEL");
//        else if(this._currentStep == this.OPTIONSPANEL) console.log("OPTIONSPANEL");
//        else if(this._currentStep == this.RUNPANEL) console.log("RUNPANEL");
//        else if(this._currentStep == this.DONEPANEL) console.log("DONEPANEL");
//        else if(this._currentStep == this.MODIFYINSTALLPANEL) console.log("MODIFYINSTALLPANEL");
//        else if(this._currentStep == this.CONFIRMUNINSTALLPANEL) console.log("CONFIRMUNINSTALLPANEL");
//        else if(this._currentStep == this.MODINSTANCESPANEL) console.log("MODINSTANCESPANEL");
//        else console.log("unknown panel ("+this._currentStep.toString()+")");
//        */
//
//        this.showWelcomePanel(this._currentStep == this.WELCOMEPANEL, back);
//        this.showEnterHubAddr(this._currentStep == this.ENTERHUBADDR, back);
//        this.showConnectingPanel(this._currentStep == this.CONNECTINGPANEL, back);
//        this.showConnectionError(this._currentStep == this.CONNECTIONERROR, back, <string>msg)
//        this.showPasswordPanel(this._currentStep == this.PASSWORDPANEL, back, <string>msg);
//        this.showHubDescription(this._currentStep == this.DESCRIPTIONPANEL, back);
//        this.showCustomFilesPanel(this._currentStep == this.CUSTOMFILESPANEL, back);
//        this.showOptionsPanel(this._currentStep == this.OPTIONSPANEL, back);
//        this.showRunPanel(this._currentStep == this.RUNPANEL, back);
//        this.showDonePanel(this._currentStep == this.DONEPANEL, back);
//        this.showModifyInstallPanel(this._currentStep == this.MODIFYINSTALLPANEL, back);
//        this.showConfirmUninstallPanel(this._currentStep == this.CONFIRMUNINSTALLPANEL, back);
//        this.showModInstancesPanel(this._currentStep == this.MODINSTANCESPANEL, back);
//
//    }
//
//    private gotoPrevious(): void
//    {
//        if (this._history.length > 1)
//        {
//            this._history.pop();
//            this._currentStep = this._history[this._history.length - 1];
//        }
//        this.showCurrentStep(true);
//
//    }
//
//    private gotoPanel(step: number, errmsg?: string)
//    {
//        this._currentStep = step;
//        this._prevButton.visible = step > 0;
//        this._history.push(step);
//        this.showCurrentStep(false, errmsg);
//
//    }
//
//    private async resetAll()
//    {
//        this._currentStep = this.WELCOMEPANEL;
//        this._history = [this.WELCOMEPANEL];
//        this._alreadyInstalled = false;
//        this._prevButton.visible = false;
//        this._nextButton.visible = true;
//        this._okButton.visible = false;
//        this._jsCodeinstances = [];
//        this._webPageinstances = [];
//
//        //if (this._srvUsername != null) this._srvUsername.value = "";
//        //if (this._srvPassword != null) this._srvPassword.value = "";
//
//        //this._srvUsername = null
//        //this._srvPassword = null
//
//        await YoctoAPI.YAPI.UnregisterHub(await (<YoctoAPI.YModule>this._currentHub).get_url());
//        await YoctoAPI.YAPI.FreeAPI();
//        this._currentHub = null;
//        this.showCurrentStep(false);
//    }
//
//    private gotoNext(): void
//    {
//        switch (this._currentStep)
//        {
//        case this.WELCOMEPANEL:
//            this.gotoPanel(this.ENTERHUBADDR);
//            break;
//        case this.ENTERHUBADDR:
//            this.gotoPanel(this.CONNECTINGPANEL);
//            break;
//        case  this.PASSWORDPANEL :
//            this.gotoPanel(this.CONNECTINGPANEL);
//            break;
//        case  this.DESCRIPTIONPANEL :
//            if (this._alreadyInstalled)
//            {
//                this.gotoPanel(this.MODIFYINSTALLPANEL);
//            }
//            else
//            {
//                this._plannedaction = this.ACTIONINSTALL;
//                this.gotoPanel(this.CUSTOMFILESPANEL);
//            }
//            break;
//        case  this.CUSTOMFILESPANEL:
//            this.gotoPanel(this.OPTIONSPANEL);
//
//            break;
//        case  this.OPTIONSPANEL:
//            this.gotoPanel(this.RUNPANEL);
//            break;
//        case  this.MODIFYINSTALLPANEL:
//            if ((<HTMLInputElement>this._uninstallOpt).checked) this.gotoPanel(this.CONFIRMUNINSTALLPANEL);
//            if ((<HTMLInputElement>this._addInstanceOpt).checked)
//            {
//                this._plannedaction = this.ACTIONADDINSTANCE;
//                this.gotoPanel(this.CUSTOMFILESPANEL);
//            }
//            if ((<HTMLInputElement>this._updateOpt).checked)
//            {
//                this._plannedaction = this.ACTIONUPDATE;
//                this.gotoPanel(this.RUNPANEL);
//            }
//            if ((<HTMLInputElement>this._modInstanceOpt).checked)
//            {
//                this._plannedaction = this.ACTIONMODINSTANCE;
//                this.gotoPanel(this.MODINSTANCESPANEL);
//            }
//            break
//        case  this.MODINSTANCESPANEL:
//            this.gotoPanel(this.RUNPANEL);
//            break;
//        case   this.CONFIRMUNINSTALLPANEL:
//            this._plannedaction = this.ACTIONUNINSTALL
//            this.gotoPanel(this.RUNPANEL);
//            break;
//        }
//
//    }
//
//}
//
//(window as any).startYV4W_installer = (div: HTMLDivElement, options?:any) => { new YV4W_installer(div,options); }
//
////#endif

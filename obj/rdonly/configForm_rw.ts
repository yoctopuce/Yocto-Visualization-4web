/*
*   Yocto-Visualization (for web), a free web-based application
*   to visualize Yoctopuce Sensors.
*
*  global configuration window
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
//import * as YDataRendering from "./Renderer/YDataRendererFull.js";
//import * as YoctoVisualization from "./YoctoVisualizationFull.js";
//
//class configEditorTab
//{
//    private _td: HTMLTableCellElement;
//
//    private _realTab: boolean = false;
//    private _div: HTMLDivElement | null = null;
//    private _tabLabel: HTMLAnchorElement | null = null;
//
//    constructor(editor: configForm, label: string, fontSize: number, GUIcoef: number)
//    {
//        this._td = document.createElement("TD") as HTMLTableCellElement;
//        // this._editor=editor;
//        if (label != "")
//        {
//            this._div = document.createElement("DIV") as HTMLDivElement;
//            this._div.style.display = "none";
//            let sz: string = Math.round(5 * GUIcoef).toString() + "px";
//            this._div.style.padding = sz + " " + sz + " " + sz + " " + sz;
//
//            this._td.style.paddingTop = Math.round(4 * GUIcoef).toString() + "px";
//            this._td.style.fontSize = fontSize.toString() + "px";
//            this._td.style.paddingBottom = Math.round(2 * GUIcoef).toString() + "px";
//            this._td.tabIndex = 0;
//            this._td.style.borderLeft = "1px solid " + configForm.inactiveBorderColor;
//            this._td.style.borderRight = "1px solid " + configForm.inactiveBorderColor;
//            this._td.style.borderTop = "1px solid " + configForm.inactiveBorderColor;
//            this._td.style.borderBottom = "1px solid " + configForm.activeBorderColor;
//            this._td.style.color = configForm.inactiveColor;
//            this._td.style.backgroundColor = configForm.inactiveBackgroundColor;
//            this._td.style.borderTopLeftRadius = Math.round(3 * GUIcoef).toString() + "px";
//            this._td.style.borderTopRightRadius = Math.round(3 * GUIcoef).toString() + "px";
//            this._td.style.paddingLeft = "5px"
//            this._td.style.paddingRight = "5px"
//            this._realTab = true;
//            this._tabLabel = document.createElement("ANCHOR") as HTMLAnchorElement;
//            this._tabLabel.innerText = label;
//            this._tabLabel.addEventListener("click", () => {configForm.tabSelected(this)})
//            this._tabLabel.addEventListener('keyup', (e) =>
//            {
//                if ((e.key === "Enter") || (e.key === " ")) configForm.tabSelected(this)
//            });
//            this._tabLabel.style.cursor = "pointer";
//
//            this._td.appendChild(this._tabLabel)
//
//        }
//        else
//        {
//            this._td.style.borderBottom = "1px solid " + configForm.activeBorderColor;
//            this._td.innerHTML = "<span>&nbsp;</span>";
//        }
//
//    }
//
//    public setTabIndex(index: number): number
//    {
//        (<HTMLAnchorElement>this._tabLabel).tabIndex = index++;
//        return index;
//    }
//
//    public set active(value: boolean)
//    {
//        if (!this._realTab) return;
//        this._td.style.borderLeftColor = value ? configForm.activeBorderColor : configForm.inactiveBorderColor
//        this._td.style.borderTopColor = value ? configForm.activeBorderColor : configForm.inactiveBorderColor
//        this._td.style.borderRightColor = value ? configForm.activeBorderColor : configForm.inactiveBorderColor
//        this._td.style.borderBottomColor = value ? "rgba(0, 0, 0, 0)" : configForm.activeBorderColor
//        this._td.style.color = value ? configForm.activeColor : configForm.inactiveColor
//        this._td.style.backgroundColor = value ? configForm.activeBackgroundColor : configForm.inactiveBackgroundColor;
//        (<HTMLDivElement>this._div).style.display = value ? "" : "none";
//
//    }
//
//    public get tabElement(): HTMLTableCellElement {return this._td}
//    public get divElement(): HTMLDivElement {return <HTMLDivElement>this._div}
//}
//
//export class configForm
//{
//    private static _window: YoctoVisualization.YWindow
//    private static GUIcoef: number = 1;
//    private static readonly REFWIDH: number = 520;
//    private static readonly REFHEIGHT = 300;
//    private static _contents: HTMLDivElement
//    private static _tabPanelContents: HTMLTableCellElement;
//    private static _table: HTMLTableElement;
//    private static _tr1: HTMLTableRowElement
//
//    private static _tr2: HTMLTableRowElement;
//    private static _tabNetwork: configEditorTab;
//    private static _tabCapture: configEditorTab;
//    private static _tabResources: configEditorTab;
//    private static _tabUI: configEditorTab;
//    private static _tabExport: configEditorTab;
//    private static _tabStub: configEditorTab;
//    private static fontSize: number = YoctoVisualization.constants.generalFontSize;
//
//    private static _Hubtable: HTMLTableElement;
//    private static _selectedHub: YoctoVisualization.Hub | null;
//
//    private static inputPNG: HTMLInputElement;
//    private static inputSVG: HTMLInputElement;
//    private static inputResolution: HTMLInputElement;
//    private static inputSizeSelect: HTMLSelectElement;
//    private static inputCaptureWidth: HTMLInputElement
//    private static inputCaptureHeight: HTMLInputElement
//    private static inputCaptureWidthInfo: HTMLSpanElement
//    private static inputCaptureHeightInfo: HTMLSpanElement
//    private static captureHeightTR: HTMLTableRowElement
//    private static captureWidthTR: HTMLTableRowElement
//
//    private static _newButton: YoctoVisualization.button;
//    private static _editButton: YoctoVisualization.button;
//    private static _deleteButton: YoctoVisualization.button;
//
//    public static get activeBorderColor(): string { return YoctoVisualization.constants.WindowInnerBorderColor;}
//    public static get inactiveBorderColor(): string { return "#b0b0b0";}
//    public static get activeColor(): string { return "black";}
//    public static get inactiveColor(): string { return "grey";}
//    public static get activeBackgroundColor(): string { return YoctoVisualization.constants.WindowInnerBackgroundColor;}
//    public static get inactiveBackgroundColor(): string { return YoctoVisualization.constants.WindowBackgroundColor;}
//
//    public static hubStateChanged(source: YoctoVisualization.Hub)
//    {
//        if (configForm._Hubtable == null) return;
//        let srvNotification: string = source.removable ? "" : " (server)"
//        for (let i: number = 1; i < configForm._Hubtable.childElementCount; i++) // skip the header
//        {
//            if ((<any>configForm._Hubtable.childNodes[i])["YHUB"] == source)
//            {
//                (configForm._Hubtable.childNodes[i].childNodes[2] as HTMLTableCellElement).innerText = source.ConnectionDescription + srvNotification;
//                switch (source.ConnectionState)
//                {
//                case YoctoVisualization.HubState.CONNECTED :
//                    (configForm._Hubtable.childNodes[i].childNodes[0] as HTMLTableCellElement).innerHTML = YoctoVisualization.ressources.OkIcon((1.2 * configForm.fontSize).toString(), true, false, false, false, " ")
//                    break;
//                case YoctoVisualization.HubState.FAILURE :
//                    (configForm._Hubtable.childNodes[i].childNodes[0] as HTMLTableCellElement).innerHTML = YoctoVisualization.ressources.FailedIcon((1.2 * configForm.fontSize).toString(), true, false, false, false, " ")
//                    break;
//                default :
//                    (configForm._Hubtable.childNodes[i].childNodes[0] as HTMLTableCellElement).innerHTML = YoctoVisualization.ressources.DontKnowIcon((1.2 * configForm.fontSize).toString(), true, false, false, false, " ")
//                    break;
//                }
//            }
//        }
//    }
//
//    public static RefreshUI(h: YoctoVisualization.Hub)
//    {
//        for (let i: number = 1; i < configForm._Hubtable.childElementCount; i++) // skip the header
//        {
//            if ((<any>configForm._Hubtable.childNodes[i])["YHUB"] == h)
//            {
//                (configForm._Hubtable.childNodes[i].childNodes[1] as HTMLTableCellElement).innerText = h.toString();
//                (configForm._Hubtable.childNodes[i].childNodes[2] as HTMLTableCellElement).innerText = "...";
//
//            }
//        }
//    }
//
//    private static HublineSelected(source: HTMLTableRowElement | null): void
//    {
//        configForm._selectedHub = null;
//        for (let i: number = 1; i < configForm._Hubtable.childElementCount; i++) // skip the header
//        {
//            if (configForm._Hubtable.childNodes[i] == source)
//            {
//                configForm._selectedHub = (<any>configForm._Hubtable.childNodes[i])["YHUB"] as YoctoVisualization.Hub;
//                (configForm._Hubtable.childNodes[i] as HTMLTableRowElement).style.backgroundColor = "#2fa5ff";
//                (configForm._Hubtable.childNodes[i].childNodes[0] as HTMLTableCellElement).style.color = "white";
//                (configForm._Hubtable.childNodes[i].childNodes[1] as HTMLTableCellElement).style.color = "white";
//                (configForm._Hubtable.childNodes[i].childNodes[2] as HTMLTableCellElement).style.color = "white";
//            }
//            else
//            {
//                (configForm._Hubtable.childNodes[i] as HTMLTableRowElement).style.backgroundColor = "white";
//                (configForm._Hubtable.childNodes[i].childNodes[0] as HTMLTableCellElement).style.color = "black";
//                (configForm._Hubtable.childNodes[i].childNodes[1] as HTMLTableCellElement).style.color = "black";
//                (configForm._Hubtable.childNodes[i].childNodes[2] as HTMLTableCellElement).style.color = "black";
//
//            }
//        }
//        configForm._editButton.enabled = configForm._selectedHub != null;
//        configForm._deleteButton.enabled = configForm._selectedHub != null;
//        this._editButton.showShortcut(configForm._selectedHub != null);
//        this._deleteButton.showShortcut(configForm._selectedHub != null);
//
//    }
//
//    private static newHub()
//    {
//        YoctoVisualization.HubEdit.newHub(() => {configForm._window.show();})
//    }
//
//    private static AddHubToUI(hub: YoctoVisualization.Hub): void
//    {
//        let HubtableTR: HTMLTableRowElement = document.createElement("TR") as HTMLTableRowElement;
//        HubtableTR.style.fontSize = configForm.fontSize.toString() + "px";
//        (<any>HubtableTR)["YHUB"] = hub;
//        HubtableTR.style.backgroundColor = "white"
//        HubtableTR.style.cursor = "pointer"
//        HubtableTR.tabIndex = 0;
//        HubtableTR.addEventListener("keypress", (e: KeyboardEvent) =>
//        {
//            switch (e.key.toUpperCase())
//            {
//            case "D" :
//                this._deleteButton.performAction();
//                break;
//            case "E" :
//                this._editButton.performAction();
//                break;
//            }
//        });
//
//        HubtableTR.style.outline = "none";
//        HubtableTR.addEventListener("click", () => {configForm.HublineSelected(HubtableTR);})
//        HubtableTR.addEventListener("focusin", () => {configForm.HublineSelected(HubtableTR);})
//
//        let HubtableTD: HTMLTableCellElement = document.createElement("TD") as HTMLTableCellElement;
//
//        switch (hub.ConnectionState)
//        {
//        case YoctoVisualization.HubState.CONNECTED :
//            HubtableTD.innerHTML = YoctoVisualization.ressources.OkIcon((1.2 * configForm.fontSize).toString(), true, false, false, false, " ");
//            break;
//        case YoctoVisualization.HubState.FAILURE   :
//            HubtableTD.innerHTML = YoctoVisualization.ressources.FailedIcon((1.2 * configForm.fontSize).toString(), true, false, false, false, " ");
//            break;
//        case YoctoVisualization.HubState.CONNECTING :
//        default :
//            HubtableTD.innerHTML = YoctoVisualization.ressources.DontKnowIcon((1.2 * configForm.fontSize).toString(), true, false, false, false, " ");
//
//        }
//        HubtableTD.style.width = (2 * configForm.fontSize).toString() + "px";
//        HubtableTD.style.verticalAlign = "center"
//        HubtableTD.style.borderBottom = "1px solid " + configForm.inactiveBorderColor;
//        HubtableTD.style.paddingLeft = "5px"
//        HubtableTR.appendChild(HubtableTD)
//        HubtableTD = document.createElement("TD") as HTMLTableCellElement;
//        HubtableTD.innerText = hub.toString()
//        HubtableTD.style.borderBottom = "1px solid " + configForm.inactiveBorderColor;
//        HubtableTD.style.verticalAlign = "center"
//        HubtableTD.style.height = (2 * configForm.fontSize).toString() + "px"
//        HubtableTR.appendChild(HubtableTD)
//        HubtableTD = document.createElement("TD") as HTMLTableCellElement;
//        HubtableTD.style.verticalAlign = "center"
//        HubtableTD.innerText = hub.ConnectionDescription +  (hub.removable ? "" : " (server)");
//        HubtableTD.style.borderBottom = "1px solid " + configForm.inactiveBorderColor;
//
//        HubtableTR.appendChild(HubtableTD)
//        configForm._Hubtable.appendChild(HubtableTR);
//    }
//
//    public static editSelectedHub()
//    {
//        if (configForm._selectedHub == null) return;
//        YoctoVisualization.HubEdit.editHub(configForm._selectedHub, () => {configForm._window.show();});
//
//    }
//
//    public static deleteSelectedHub()
//    {
//        if (configForm._selectedHub == null) return;
//
//        let ExtraMessage: string = configForm._selectedHub.removable ? "" : "\n\nThis one is also the one serving the Yocto-Visualization software. If you remove it, you won't be able to save later on.";
//        YoctoVisualization.confirm.ask("Do you really want to remove connection " + configForm._selectedHub.toString() + " ?" + ExtraMessage,
//            () =>
//            {
//                if (configForm._selectedHub == null) return;
//                configForm._selectedHub.Disconnect().then(r => {});
//                for (let i: number = configForm._Hubtable.childElementCount - 1; i > 0; i--) // skip the header
//                {
//                    if ((<any>configForm._Hubtable.childNodes[i])["YHUB"] == configForm._selectedHub)
//                    {
//                        configForm._Hubtable.removeChild((configForm._Hubtable.childNodes[i]))
//                    }
//                }
//                YoctoVisualization.sensorsManager.hubWasremoved(configForm._selectedHub)
//                configForm._selectedHub = null;
//                configForm._editButton.enabled = false;
//                configForm._deleteButton.enabled = false;
//                YoctoVisualization.constants.edited = true;
//
//            }, null, null);
//    }
//    public static hide()
//    {
//        if (configForm._window == null) return;
//        configForm._window.visible = false;
//    }
//
//    public static show()
//    {
//        if (configForm._window == null)
//        {
//            configForm.GUIcoef = YoctoVisualization.constants.generalSizeCoef;
//            // ooops default size is going to be larger than screen, let adjust on the fly
//            if (configForm.REFWIDH * configForm.GUIcoef > screen.width) configForm.GUIcoef = screen.width / configForm.REFWIDH;
//            if (configForm.REFHEIGHT * configForm.GUIcoef > screen.height) configForm.GUIcoef = screen.height / configForm.REFHEIGHT;
//            configForm.fontSize *= configForm.GUIcoef / YoctoVisualization.constants.generalSizeCoef;
//
//            let params: YoctoVisualization.newWindowParam = new YoctoVisualization.newWindowParam(configForm.GUIcoef);
//            params.positionType = YoctoVisualization.WindowPositionType.CENTERED
//            params.width = Math.round(configForm.REFWIDH * this.GUIcoef);
//            params.height = Math.round(configForm.REFHEIGHT * this.GUIcoef);
//            params.showContainerBorders = false;
//
//            params.title = "Global configuration";
//            configForm._window = new YoctoVisualization.YWindow(params)
//
//            configForm._contents = configForm._window.innerContentDiv;
//
//            configForm._table = document.createElement("TABLE") as HTMLTableElement;
//            configForm._contents.appendChild(configForm._table)
//            configForm._table.style.position = "absolute"
//
//            configForm._table.style.left = "0px"
//            configForm._table.style.right = "0px"
//
//            configForm._table.style.width = "100%";
//            configForm._table.style.height = "100%";
//
//            configForm._table.style.borderSpacing = "0";
//            configForm._table.style.paddingLeft = (5 * this.GUIcoef).toString() + "px";
//            configForm._table.style.paddingTop = (5 * this.GUIcoef).toString() + "px";
//            configForm._table.style.paddingRight = (5 * this.GUIcoef).toString() + "px";
//            configForm._table.style.borderCollapse = "separate";
//            configForm._tr1 = document.createElement("TR") as HTMLTableRowElement;
//            configForm._tr2 = document.createElement("TR") as HTMLTableRowElement;
//            configForm._tr1.style.height = (2 * configForm.fontSize).toString() + "px"
//            configForm._tabNetwork = new configEditorTab(configForm, "Network", configForm.fontSize, configForm.GUIcoef);
//            configForm._tabCapture = new configEditorTab(configForm, "Screen capture", configForm.fontSize, configForm.GUIcoef);
//            configForm._tabResources = new configEditorTab(configForm, "Ressources", configForm.fontSize, configForm.GUIcoef);
//            configForm._tabUI = new configEditorTab(configForm, "User interface", configForm.fontSize, configForm.GUIcoef);
//            configForm._tabExport = new configEditorTab(configForm, "XML Export", configForm.fontSize, configForm.GUIcoef);
//            configForm._tabStub = new configEditorTab(configForm, "", configForm.fontSize, configForm.GUIcoef);
//
//            this._tabPanelContents = document.createElement("TD") as HTMLTableCellElement;
//            this._tabPanelContents.colSpan = 6;
//
//            this._tabPanelContents.style.borderLeft = "1px solid " + this.activeBorderColor
//            this._tabPanelContents.style.borderRight = "1px solid " + this.activeBorderColor
//            this._tabPanelContents.style.borderBottom = "1px solid " + this.activeBorderColor
//            this._tabPanelContents.style.backgroundColor = this.activeBackgroundColor;
//
//            configForm._tr1.appendChild(this._tabNetwork.tabElement);
//            configForm._tr1.appendChild(this._tabCapture.tabElement);
//            configForm._tr1.appendChild(this._tabResources.tabElement);
//            configForm._tr1.appendChild(this._tabUI.tabElement);
//            configForm._tr1.appendChild(this._tabExport.tabElement);
//            configForm._tr1.appendChild(this._tabStub.tabElement);
//            configForm._tr2.appendChild(this._tabPanelContents);
//            (configForm._tr2.childNodes[0] as HTMLTableCellElement).style.verticalAlign = "top"
//
//            configForm._table.appendChild(this._tr1);
//            configForm._table.appendChild(this._tr2);
//
//            /*  NETWORK SECTION  */
//
//            let p: HTMLParagraphElement = document.createElement("P") as HTMLParagraphElement;
//            p.style.textAlign = "justify"
//            p.style.fontSize = configForm.fontSize.toString() + "px";
//            p.style.paddingTop = "0px";
//            p.style.marginTop = Math.round(3 * this.GUIcoef).toString() + "px";
//            p.innerText = "Enter the list of VirtualHub / YoctoHub / Yocto-Visualization server IP addresses this page can connect to"
//            this._tabNetwork.divElement.appendChild(p)
//
//            configForm._Hubtable = document.createElement("TABLE") as HTMLTableElement;
//            configForm._Hubtable.style.position = "absolute";
//            configForm._Hubtable.style.display = "block";
//            configForm._Hubtable.style.left = Math.round(20 * this.GUIcoef).toString() + "px"
//            configForm._Hubtable.style.right = Math.round(20 * this.GUIcoef).toString() + "px"
//            configForm._Hubtable.style.tableLayout = "auto";
//            configForm._Hubtable.style.top = Math.round(80 * this.GUIcoef).toString() + "px"
//            configForm._Hubtable.style.bottom = Math.round(40 * this.GUIcoef).toString() + "px"
//            configForm._Hubtable.style.borderCollapse = "colapse";
//            configForm._Hubtable.style.borderSpacing = "0px";
//            configForm._Hubtable.style.border = "1px solid " + configForm.activeBorderColor;
//
//            let HubtableTR: HTMLTableRowElement = document.createElement("TR") as HTMLTableRowElement;
//            HubtableTR.style.fontSize = configForm.fontSize.toString() + "px";
//
//            let HubtableTH: HTMLTableHeaderCellElement = document.createElement("TH") as HTMLTableHeaderCellElement;
//            HubtableTH.colSpan = 2;
//            HubtableTH.innerText = "Address"
//            HubtableTH.style.borderBottom = "1px solid " + configForm.activeBorderColor;
//            HubtableTH.style.width = Math.round(400 * this.GUIcoef).toString() + "px"
//            HubtableTR.appendChild(HubtableTH);
//
//            HubtableTH = document.createElement("TH") as HTMLTableHeaderCellElement;
//            HubtableTH.innerText = "Status"
//            HubtableTH.style.width = "40%"
//            HubtableTH.style.borderBottom = "1px solid " + configForm.activeBorderColor;
//            HubtableTH.style.borderLeft = "1px solid " + configForm.activeBorderColor;
//            HubtableTR.appendChild(HubtableTH);
//            configForm._Hubtable.appendChild(HubtableTR)
//
//            let hubList: YoctoVisualization.Hub[] = YoctoVisualization.sensorsManager.hubList;
//            for (let i: number = 0; i < hubList.length; i++)
//            {
//                configForm.AddHubToUI(hubList[i])
//            }
//
//            let div: HTMLDivElement = document.createElement("DIV") as HTMLDivElement;
//            div.style.position = "absolute";
//            div.style.bottom = "0px"
//            div.style.right = (Math.round(20 * configForm.GUIcoef)).toString() + "px";
//            div.style.height = (Math.round(30 * configForm.GUIcoef)).toString() + "px";
//
//            div.style.textAlign = "right"
//            div.style.verticalAlign = "center"
//
//            configForm._newButton = new YoctoVisualization.button("New", () =>
//            {
//                configForm._window.hide();
//                configForm.newHub()
//            }, configForm.GUIcoef);
//            div.appendChild(configForm._newButton.Element);
//
//            configForm._editButton = new YoctoVisualization.button("Edit", () =>
//            {
//                configForm._window.hide();
//                configForm.editSelectedHub()
//            }, configForm.GUIcoef);
//            configForm._editButton.enabled = false;
//            div.appendChild(configForm._editButton.Element);
//
//            configForm._deleteButton = new YoctoVisualization.button("Delete", () => {configForm.deleteSelectedHub()}, configForm.GUIcoef);
//            configForm._deleteButton.enabled = false;
//            div.appendChild(configForm._deleteButton.Element);
//
//            this._tabNetwork.divElement.appendChild(div)
//            this._tabNetwork.divElement.appendChild(configForm._Hubtable)
//
//            /*  SCREEN CAPTURE SECTION  */
//
//            p = document.createElement("P") as HTMLParagraphElement;
//            p.innerHTML = "Widgets content can be captured at anytime thought the <i>Snapshop</i> option available in right-click contextual menu"
//            p.style.textAlign = "justify"
//            p.style.fontSize = configForm.fontSize.toString() + "px";
//            this._tabCapture.divElement.appendChild(p)
//
//            let tableSize: HTMLTableElement = document.createElement("TABLE") as HTMLTableElement;
//            tableSize.style.fontSize = configForm.fontSize.toString() + "px";
//            let row: HTMLTableRowElement = document.createElement("TR") as HTMLTableRowElement;
//            let td: HTMLTableCellElement = document.createElement("TD") as HTMLTableCellElement;
//            td.style.fontSize = configForm.fontSize.toString() + "px";
//            td.innerText = "ImageType";
//            row.appendChild(td);
//            td = document.createElement("TD") as HTMLTableCellElement;
//            td.style.fontSize = configForm.fontSize.toString() + "px";
//            td.style.verticalAlign = "center"
//            // PNG option
//            configForm.inputPNG = document.createElement("INPUT") as HTMLInputElement;
//
//            configForm.inputSVG = document.createElement("INPUT") as HTMLInputElement;
//
//            configForm.inputPNG.checked = YoctoVisualization.constants.captureType == YDataRendering.YDataRenderer.CaptureType.PNG;
//            configForm.inputPNG.style.display = "inline";
//            configForm.inputPNG.type = "checkbox";
//            configForm.inputPNG.style.transform = "scale(" + this.GUIcoef.toString() + ")"
//            configForm.inputPNG.style.marginRight = Math.round(5 * this.GUIcoef).toString() + "px"
//            configForm.inputPNG.style.marginLeft = Math.round(5 * this.GUIcoef).toString() + "px"
//
//            configForm.inputPNG.addEventListener("change", () => {configForm.captureFormatChange(configForm.inputPNG)})
//            td.append(configForm.inputPNG);
//            let span: HTMLSpanElement
//            span = document.createElement("SPAN") as HTMLSpanElement;
//            span.innerText = YDataRendering.YDataRenderer.CaptureType.PNG.description
//            td.append(span);
//            // PNG option
//            configForm.inputSVG = document.createElement("INPUT") as HTMLInputElement;
//
//            configForm.inputSVG.checked = YoctoVisualization.constants.captureType == YDataRendering.YDataRenderer.CaptureType.SVG;
//            configForm.inputSVG.style.display = "inline";
//            configForm.inputSVG.type = "checkbox";
//            configForm.inputSVG.style.transform = "scale(" + this.GUIcoef.toString() + ")"
//            configForm.inputSVG.style.marginRight = Math.round(5 * this.GUIcoef).toString() + "px"
//            configForm.inputSVG.style.marginLeft = Math.round(5 * this.GUIcoef).toString() + "px"
//
//            configForm.inputSVG.addEventListener("change", () => {configForm.captureFormatChange(configForm.inputSVG)})
//            td.append(configForm.inputSVG);
//
//            span = document.createElement("SPAN") as HTMLSpanElement;
//            span.innerText = YDataRendering.YDataRenderer.CaptureType.SVG.description
//            td.append(span);
//            row.appendChild(td);
//            tableSize.appendChild(row)
//
//            // resolution
//            row = document.createElement("TR") as HTMLTableRowElement;
//            td = document.createElement("TD") as HTMLTableCellElement;
//            td.style.fontSize = configForm.fontSize.toString() + "px";
//            td.innerText = "Resolution:";
//            row.appendChild(td);
//            td = document.createElement("TD") as HTMLTableCellElement;
//            td.style.fontSize = configForm.fontSize.toString() + "px";
//            configForm.inputResolution = document.createElement("INPUT") as HTMLInputElement;
//            configForm.inputResolution.style.fontFamily = YoctoVisualization.constants.generalFontFamily;
//            configForm.inputResolution.style.fontSize = YoctoVisualization.constants.generalFontSize.toString() + "px";
//            configForm.inputResolution.style.border = "1px solid grey";
//            configForm.inputResolution.type = "number"
//            configForm.inputResolution.style.textAlign = "right"
//            configForm.inputResolution.style.marginRight = "5px"
//            configForm.inputResolution.style.width = "60px"
//            configForm.inputResolution.value = YoctoVisualization.constants.captureDPI.toString()
//            configForm.inputResolution.style.display = "inline";
//            new YoctoVisualization.InputFieldManager(configForm.inputResolution, YoctoVisualization.InputFieldManager.dataType.DATA_STRICT_POSITIVE_FLOAT, false, Number.NaN, Number.NaN, (sender: HTMLInputElement, refreshInput: boolean) => {configForm.captureDPIChange(configForm.inputResolution);});
//
//            //configForm.inputResolution.addEventListener("change",()=>{configForm.captureDPIChange(configForm.inputResolution)})
//            td.append(configForm.inputResolution);
//            span = document.createElement("SPAN") as HTMLSpanElement;
//            span.innerText = "DPI"
//            td.append(span);
//            row.appendChild(td);
//            tableSize.appendChild(row)
//
//            // Size selection
//            row = document.createElement("TR") as HTMLTableRowElement;
//            td = document.createElement("TD") as HTMLTableCellElement;
//            td.style.fontSize = configForm.fontSize.toString() + "px";
//            td.innerText = "Size:";
//            td.style.verticalAlign = "top"
//            row.appendChild(td);
//            td = document.createElement("TD") as HTMLTableCellElement;
//            td.style.fontSize = configForm.fontSize.toString() + "px";
//            configForm.inputSizeSelect = document.createElement("SELECT") as HTMLSelectElement;
//            configForm.inputSizeSelect.style.border = "1px solid grey";
//            configForm.inputSizeSelect.style.fontFamily = YoctoVisualization.constants.generalFontFamily;
//            configForm.inputSizeSelect.style.fontSize = YoctoVisualization.constants.generalFontSize.toString() + "px";
//
//            let sizingOptions: YDataRendering.YEnumItem[] = YDataRendering.YDataRenderer.CaptureFormats.Keep.sibblings;
//            for (let i: number = 0; i < sizingOptions.length; i++)
//            {
//                let option: HTMLOptionElement = document.createElement("OPTION") as HTMLOptionElement;
//                option.text = sizingOptions[i].description;
//                option.value = sizingOptions[i].toString;
//                configForm.inputSizeSelect.add(option, null);
//            }
//            configForm.inputSizeSelect.value = YoctoVisualization.constants.captureSizePolicy.toString;
//            configForm.inputSizeSelect.addEventListener("change", () => {configForm.captureSizeSelectChange(configForm.inputSizeSelect)})
//
//            td.append(configForm.inputSizeSelect);
//            row.appendChild(td);
//            tableSize.appendChild(row)
//
//            let subtable: HTMLTableElement = document.createElement("TABLE") as HTMLTableElement;
//            configForm.captureWidthTR = document.createElement("TR") as HTMLTableRowElement;
//            let subTD: HTMLTableCellElement = document.createElement("TD") as HTMLTableCellElement;
//            subTD.style.fontSize = configForm.fontSize.toString() + "px";
//            subTD.innerText = "Width:";
//            configForm.captureWidthTR.appendChild(subTD);
//            subTD = document.createElement("TD") as HTMLTableCellElement;
//            subTD.style.fontSize = configForm.fontSize.toString() + "px";
//            configForm.inputCaptureWidth = document.createElement("INPUT") as HTMLInputElement;
//            configForm.inputCaptureWidth.style.border = "1px solid grey";
//            configForm.inputCaptureWidth.style.fontFamily = YoctoVisualization.constants.generalFontFamily;
//            configForm.inputCaptureWidth.style.fontSize = YoctoVisualization.constants.generalFontSize.toString() + "px";
//            configForm.inputCaptureWidth.type = "number"
//            configForm.inputCaptureWidth.style.textAlign = "right"
//            configForm.inputCaptureWidth.style.marginRight = "5px"
//            configForm.inputCaptureWidth.style.width = "60px"
//            configForm.inputCaptureWidth.value = YoctoVisualization.constants.captureWidth.toString()
//            configForm.inputCaptureWidth.style.display = "inline";
//
//            new YoctoVisualization.InputFieldManager(configForm.inputCaptureWidth, YoctoVisualization.InputFieldManager.dataType.DATA_STRICT_POSITIVE_INT, false, Number.NaN, Number.NaN, (sender: HTMLInputElement, refreshInput: boolean) => {configForm.captureWidthChange(configForm.inputCaptureWidth);});
//
//            //configForm.inputCaptureWidth.addEventListener("change",()=>{configForm.captureWidthChange(configForm.inputCaptureWidth)})
//            subTD.append(configForm.inputCaptureWidth);
//            configForm.inputCaptureWidthInfo = document.createElement("SPAN") as HTMLSpanElement;
//            configForm.inputCaptureWidthInfo.innerText = "pixels"
//            subTD.append(configForm.inputCaptureWidthInfo);
//            configForm.captureWidthTR.appendChild(subTD);
//            subtable.appendChild(configForm.captureWidthTR)
//
//            configForm.captureHeightTR = document.createElement("TR") as HTMLTableRowElement;
//            subTD = document.createElement("TD") as HTMLTableCellElement;
//            subTD.style.fontSize = configForm.fontSize.toString() + "px";
//            subTD.innerText = "Height:";
//            configForm.captureHeightTR.appendChild(subTD);
//            subTD = document.createElement("TD") as HTMLTableCellElement;
//            subTD.style.fontSize = configForm.fontSize.toString() + "px";
//            configForm.inputCaptureHeight = document.createElement("INPUT") as HTMLInputElement;
//            configForm.inputCaptureHeight.style.border = "1px solid grey";
//            configForm.inputCaptureHeight.style.fontFamily = YoctoVisualization.constants.generalFontFamily;
//            configForm.inputCaptureHeight.style.fontSize = YoctoVisualization.constants.generalFontSize.toString() + "px";
//            configForm.inputCaptureHeight.type = "number"
//            configForm.inputCaptureHeight.style.textAlign = "right"
//            configForm.inputCaptureHeight.style.marginRight = "5px"
//            configForm.inputCaptureHeight.style.width = "60px"
//            configForm.inputCaptureHeight.value = YoctoVisualization.constants.captureHeight.toString()
//            configForm.inputCaptureHeight.style.display = "inline";
//            new YoctoVisualization.InputFieldManager(configForm.inputCaptureHeight, YoctoVisualization.InputFieldManager.dataType.DATA_STRICT_POSITIVE_INT, false, Number.NaN, Number.NaN, (sender: HTMLInputElement, refreshInput: boolean) => {configForm.captureHeightChange(configForm.inputCaptureHeight);});
//
//            //configForm.inputCaptureHeight.addEventListener("change",()=>{configForm.captureHeightChange(configForm.inputCaptureHeight)})
//            subTD.append(configForm.inputCaptureHeight);
//            configForm.inputCaptureHeightInfo = document.createElement("SPAN") as HTMLSpanElement;
//            configForm.inputCaptureHeightInfo.innerText = "pixels"
//            subTD.append(configForm.inputCaptureHeightInfo);
//            configForm.captureHeightTR.appendChild(subTD);
//            subtable.appendChild(configForm.captureHeightTR)
//            td.appendChild(subtable)
//
//            configForm._tabCapture.divElement.appendChild(tableSize)
//
//            /*  RESOURCES SECTION  */
//
//            let tableRessources: HTMLTableElement = document.createElement("TABLE") as HTMLTableElement;
//
//            row = document.createElement("TR") as HTMLTableRowElement;
//            td = document.createElement("TD") as HTMLTableCellElement;
//            td.style.fontSize = configForm.fontSize.toString() + "px";
//            td.innerText = "If you plan to use YoctoVisualization continuously for an extended period of time (i.e. several weeks),  or if you are running it on a computer with limited resources, you may want to limit the application memory consumption."
//            td.colSpan = 2;
//            td.style.textAlign = "justify";
//            row.appendChild(td)
//            tableRessources.appendChild(row);
//            row = document.createElement("TR") as HTMLTableRowElement;
//            td = document.createElement("TD") as HTMLTableCellElement;
//            td.style.fontSize = configForm.fontSize.toString() + "px";
//            td.innerText = "Max count of sensors data records:";
//            row.appendChild(td)
//            td = document.createElement("TD") as HTMLTableCellElement;
//
//            td.style.fontSize = configForm.fontSize.toString() + "px";
//            let maxSensorRecs: HTMLInputElement = document.createElement("INPUT") as HTMLInputElement;
//            maxSensorRecs.style.border = "1px solid grey";
//            maxSensorRecs.style.fontFamily = YoctoVisualization.constants.generalFontFamily;
//            maxSensorRecs.style.fontSize = YoctoVisualization.constants.generalFontSize.toString() + "px";
//
//            maxSensorRecs.type = "number"
//            maxSensorRecs.style.textAlign = "right"
//            maxSensorRecs.style.marginRight = "5px"
//            maxSensorRecs.style.marginLeft = "5px"
//            maxSensorRecs.style.width = "60px"
//            maxSensorRecs.value = YoctoVisualization.constants.maxDataRecordsPerSensor.toString()
//            maxSensorRecs.style.display = "inline";
//            new YoctoVisualization.InputFieldManager(maxSensorRecs, YoctoVisualization.InputFieldManager.dataType.DATA_POSITIVE_INT, false, Number.NaN, Number.NaN, (sender: HTMLInputElement, refreshInput: boolean) => {configForm.maxSensorRecsChange(maxSensorRecs);});
//            //maxSensorRecs.addEventListener("change",()=>{configForm.maxSensorRecsChange(maxSensorRecs)})
//            td.append(maxSensorRecs);
//            span = document.createElement("SPAN") as HTMLSpanElement;
//            span.innerText = "(0 = unlimited)"
//            td.append(span);
//            row.appendChild(td)
//            tableRessources.appendChild(row);
//
//            row = document.createElement("TR") as HTMLTableRowElement;
//            td = document.createElement("TD") as HTMLTableCellElement;
//            td.style.fontSize = configForm.fontSize.toString() + "px";
//            td.innerText = "Max count of graph series data points:";
//            row.appendChild(td)
//            td = document.createElement("TD") as HTMLTableCellElement;
//            td.style.fontSize = configForm.fontSize.toString() + "px";
//            let maxSeriesRecs: HTMLInputElement = document.createElement("INPUT") as HTMLInputElement;
//            maxSeriesRecs.style.border = "1px solid grey";
//            maxSeriesRecs.style.fontFamily = YoctoVisualization.constants.generalFontFamily;
//            maxSeriesRecs.style.fontSize = YoctoVisualization.constants.generalFontSize.toString() + "px";
//
//            maxSeriesRecs.type = "number"
//            maxSeriesRecs.style.textAlign = "right"
//            maxSeriesRecs.style.marginRight = "5px"
//            maxSeriesRecs.style.marginLeft = "5px"
//            maxSeriesRecs.style.width = "60px"
//            maxSeriesRecs.value = YoctoVisualization.constants.maxPointsPerGraphSerie.toString()
//            maxSeriesRecs.style.display = "inline";
//            new YoctoVisualization.InputFieldManager(maxSeriesRecs, YoctoVisualization.InputFieldManager.dataType.DATA_POSITIVE_INT, false, Number.NaN, Number.NaN, (sender: HTMLInputElement, refreshInput: boolean) => {configForm.maxSeriesRecsChange(maxSeriesRecs);});
//
//            //maxSeriesRecs.addEventListener("change",()=>{configForm.maxSeriesRecsChange(maxSeriesRecs)})
//            td.append(maxSeriesRecs);
//            span = document.createElement("SPAN") as HTMLSpanElement;
//            span.innerText = "(0 = unlimited)"
//            td.append(span);
//            row.appendChild(td)
//            tableRessources.appendChild(row);
//
//            row = document.createElement("TR") as HTMLTableRowElement;
//            td = document.createElement("TD") as HTMLTableCellElement;
//            td.style.fontSize = configForm.fontSize.toString() + "px";
//            td.innerText = "\nYocto-Visualization automatically loads datalogger contents for all connected devices.  If you are using networked devices featuring  billable data transfers (GSM) you may want to limit or even disable that feature."
//            td.colSpan = 2;
//            td.style.textAlign = "justify";
//            row.appendChild(td)
//            tableRessources.appendChild(row);
//
//            row = document.createElement("TR") as HTMLTableRowElement;
//            td = document.createElement("TD") as HTMLTableCellElement;
//            td.style.fontSize = configForm.fontSize.toString() + "px";
//            td.innerText = "Max data points/series loaded from dataloggers:";
//            row.appendChild(td)
//            td = document.createElement("TD") as HTMLTableCellElement;
//            td.style.fontSize = configForm.fontSize.toString() + "px";
//            let maxDataLogRecs: HTMLInputElement = document.createElement("INPUT") as HTMLInputElement;
//            maxDataLogRecs.style.border = "1px solid grey";
//            maxDataLogRecs.style.fontFamily = YoctoVisualization.constants.generalFontFamily;
//            maxDataLogRecs.style.fontSize = YoctoVisualization.constants.generalFontSize.toString() + "px";
//
//            maxDataLogRecs.type = "number"
//            maxDataLogRecs.style.textAlign = "right"
//            maxDataLogRecs.style.marginRight = "5px"
//            maxDataLogRecs.style.marginLeft = "5px"
//            maxDataLogRecs.style.width = "60px"
//            maxDataLogRecs.value = YoctoVisualization.constants.maxPointsPerDataloggerSerie.toString()
//            maxDataLogRecs.style.display = "inline";
//            new YoctoVisualization.InputFieldManager(maxDataLogRecs, YoctoVisualization.InputFieldManager.dataType.DATA_INT, false, -1, Number.NaN, (sender: HTMLInputElement, refreshInput: boolean) => {configForm.maxDataLogRecsChange(maxDataLogRecs);});
//            //maxDataLogRecs.addEventListener("change",()=>{configForm.maxDataLogRecsChange(maxDataLogRecs)})
//            td.append(maxDataLogRecs);
//            span = document.createElement("SPAN") as HTMLSpanElement;
//            span.innerText = "(0 = unlimited,\n-1 = disabled)"
//            td.append(span);
//            row.appendChild(td)
//            tableRessources.appendChild(row);
//
//            row = document.createElement("TR") as HTMLTableRowElement;
//            td = document.createElement("TD") as HTMLTableCellElement;
//            td.style.fontSize = configForm.fontSize.toString() + "px";
//            td.innerText = "After a  limit increase, you\'ll have to restart the application to get your old data back."
//            td.colSpan = 2;
//            td.style.textAlign = "justify";
//            row.appendChild(td)
//            tableRessources.appendChild(row);
//
//            configForm._tabResources.divElement.appendChild(tableRessources)
//            /*  USER INTERFACE SECTION  */
//
//            p = document.createElement("P") as HTMLParagraphElement;
//            p.style.fontSize = configForm.fontSize.toString() + "px";
//            p.innerText = "You can alter user interface behavior according to your hardware capabilities."
//            this._tabUI.divElement.appendChild(p)
//
//            let checkbox1: HTMLInputElement = document.createElement("INPUT") as HTMLInputElement;
//            checkbox1.style.fontFamily = YoctoVisualization.constants.generalFontFamily;
//            checkbox1.style.fontSize = YoctoVisualization.constants.generalFontSize.toString() + "px";
//            checkbox1.style.display = "inline";
//            checkbox1.type = "checkbox";
//            checkbox1.style.transform = "scale(" + this.GUIcoef.toString() + ")"
//            checkbox1.style.marginRight = Math.round(5 * this.GUIcoef).toString() + "px"
//            checkbox1.checked = YoctoVisualization.constants.dbleClickBringsUpContextMenu
//            checkbox1.addEventListener("change", () => {configForm.dbleClickBringsUpContextMenuChange(checkbox1)})
//            this._tabUI.divElement.appendChild(checkbox1)
//            span = document.createElement("SPAN") as HTMLSpanElement;
//            span.style.fontSize = configForm.fontSize.toString() + "px";
//            span.innerText = "Double click/tap  brings up context menu\n"
//            this._tabUI.divElement.appendChild(span)
//
//            let checkbox2 = document.createElement("INPUT") as HTMLInputElement;
//            checkbox2.style.display = "inline";
//            checkbox2.type = "checkbox";
//            checkbox2.style.transform = "scale(" + this.GUIcoef.toString() + ")"
//            checkbox2.style.marginRight = Math.round(5 * this.GUIcoef).toString() + "px"
//            checkbox2.checked = YDataRendering.YGraph.verticalDragZoomEnabled;
//            checkbox2.addEventListener("change", () => {configForm.verticalDragZoomChange(checkbox2)})
//            this._tabUI.divElement.appendChild(checkbox2)
//            span = document.createElement("SPAN") as HTMLSpanElement;
//            span.style.fontSize = configForm.fontSize.toString() + "px";
//            span.innerText = "Graphs zoom can be driven by vertical drag\n"
//            this._tabUI.divElement.appendChild(span)
//
//            p = document.createElement("P") as HTMLParagraphElement;
//            p.style.fontSize = configForm.fontSize.toString() + "px";
//            p.innerText = "Yocto-Visualization tries to ajust UI size to screen resolution the best it can through a DPI based zoom factor. "
//                + "Unfortunately not all devices can properly report their screen resolution. That's why you can manually override that factor.";
//            this._tabUI.divElement.appendChild(p)
//
//            let DPIoverride: HTMLInputElement = document.createElement("INPUT") as HTMLInputElement;
//            let checkbox3 = document.createElement("INPUT") as HTMLInputElement;
//            checkbox3.style.display = "inline";
//            checkbox3.type = "checkbox";
//            checkbox3.style.transform = "scale(" + this.GUIcoef.toString() + ")"
//            checkbox3.style.marginRight = Math.round(5 * this.GUIcoef).toString() + "px"
//            checkbox3.checked = YoctoVisualization.constants.guiDPIFactorIsOverriden;
//            checkbox3.addEventListener("change", () => {configForm.DPIoverrideChange(checkbox3, DPIoverride)})
//            this._tabUI.divElement.appendChild(checkbox3)
//            span = document.createElement("SPAN") as HTMLSpanElement;
//            span.style.fontSize = configForm.fontSize.toString() + "px";
//            span.innerText = "Override zoom factor to "
//            this._tabUI.divElement.appendChild(span)
//
//            DPIoverride.style.border = "1px solid grey";
//            DPIoverride.style.fontFamily = YoctoVisualization.constants.generalFontFamily;
//            DPIoverride.style.fontSize = YoctoVisualization.constants.generalFontSize.toString() + "px";
//            DPIoverride.disabled = !YoctoVisualization.constants.guiDPIFactorIsOverriden;
//            DPIoverride.type = "number"
//            DPIoverride.style.textAlign = "right"
//            DPIoverride.style.marginRight = "5px"
//            DPIoverride.style.marginLeft = "5px"
//            DPIoverride.style.width = "60px"
//            DPIoverride.value = YoctoVisualization.constants.guiDPIFactorOverrideValue.toString();
//            DPIoverride.style.display = "inline";
//            new YoctoVisualization.InputFieldManager(DPIoverride, YoctoVisualization.InputFieldManager.dataType.DATA_POSITIVE_FLOAT, false, Number.NaN, Number.NaN, (sender: HTMLInputElement, refreshInput: boolean) => {configForm.DPIoverrideChange(checkbox3, DPIoverride);});
//            this._tabUI.divElement.appendChild(DPIoverride)
//
//            p = document.createElement("P") as HTMLParagraphElement;
//            p.style.fontSize = configForm.fontSize.toString() + "px";
//            p.innerText = "This setting is stored in your browser cookies. So it is specific to this device, browser and server."
//                + "You will have to reload this page for this setting to take effect";
//            this._tabUI.divElement.appendChild(p)
//
//            /*  USER INTERFACE SECTION  */
//
//            p = document.createElement("P") as HTMLParagraphElement;
//            p.style.fontSize = configForm.fontSize.toString() + "px";
//            p.style.textAlign = "justify";
//            p.innerText = "Yocto-Visualization (for web) stores its configuration in a XML file. "
//                + "This file can be used to create a static web page running Yocto-Visualization (for web). "
//                + "It can be used in the Yocto-Visualization (for web) installer to create a pre-configured install. "
//                + "Also, it is mostly compatible with the native version of Yocto-Visualization: you can use "
//                + "it instead of the original config.xml file. "
//                + "Just click on the link below to export/download your current configuration.";
//
//            this._tabExport.divElement.appendChild(p)
//            p = document.createElement("P") as HTMLParagraphElement;
//            p.style.fontSize = configForm.fontSize.toString() + "px";
//            p.style.textAlign = "right";
//
//            let a: HTMLAnchorElement = document.createElement("A") as HTMLAnchorElement;
//            a.innerText = "Export current configuration"
//            a.style.cursor = "pointer";
//            a.style.color = "#0000EE";
//            a.style.textDecoration = "underline";
//            a.addEventListener("click", () => {configForm.downloadCurrentConfig();});
//            p.appendChild(a)
//            this._tabExport.divElement.appendChild(p)
//
//            configForm._tabPanelContents.appendChild(this._tabNetwork.divElement);
//            configForm._tabPanelContents.appendChild(this._tabCapture.divElement);
//            configForm._tabPanelContents.appendChild(this._tabResources.divElement);
//            configForm._tabPanelContents.appendChild(this._tabUI.divElement);
//            configForm._tabPanelContents.appendChild(this._tabExport.divElement);
//            configForm.tabSelected(this._tabNetwork);
//
//            configForm.refreshSizeParams();
//
//        }
//        configForm._window.show();
//    }
//
//    public static DPIoverrideChange(checkbox: HTMLInputElement, input: HTMLInputElement): void
//    {
//        let value: number = parseFloat(input.value);
//        input.disabled = !checkbox.checked;
//        if ((checkbox.checked) && (value > 0))
//        {
//            YoctoVisualization.constants.overrideGuiDPIFactor(true, value)
//        }
//        else
//        {
//            YoctoVisualization.constants.overrideGuiDPIFactor(false)
//        }
//
//    }
//
//    public static hubWasAdded(hub: YoctoVisualization.Hub)
//    {
//        if (YoctoVisualization.sensorsManager.newHubCreated(hub))
//        {
//            configForm.AddHubToUI(hub);
//            YoctoVisualization.constants.edited = true;
//            hub.Connect().then(r => {});
//        }
//    }
//
//    public static hubGotEdited(hub: YoctoVisualization.Hub)
//    {
//
//        configForm.RefreshUI(hub);
//        YoctoVisualization.constants.edited = true;
//        hub.Disconnect().then(r => {});
//        hub.Connect().then(r => {});
//
//    }
//
//    private static dbleClickBringsUpContextMenuChange(source: HTMLInputElement)
//    {
//        let prev: boolean = YoctoVisualization.constants.dbleClickBringsUpContextMenu;
//        YoctoVisualization.constants.dbleClickBringsUpContextMenu = source.checked
//        if (prev != YoctoVisualization.constants.dbleClickBringsUpContextMenu) YoctoVisualization.constants.edited = true;
//
//    }
//
//    private static verticalDragZoomChange(source: HTMLInputElement)
//    {
//        let prev: boolean = YDataRendering.YGraph.verticalDragZoomEnabled;
//        YDataRendering.YGraph.verticalDragZoomEnabled = source.checked
//        if (prev != YDataRendering.YGraph.verticalDragZoomEnabled) YoctoVisualization.constants.edited = true;
//
//    }
//
//    private static maxDataLogRecsChange(source: HTMLInputElement)
//    {
//        let value: number = parseInt(source.value);
//        if ((value != YoctoVisualization.constants.maxPointsPerDataloggerSerie) || (value != YoctoVisualization.CustomYSensor.MaxLoggerRecords))
//        {
//            YoctoVisualization.constants.maxPointsPerDataloggerSerie = value;
//            YoctoVisualization.CustomYSensor.MaxLoggerRecords = value;
//            YoctoVisualization.constants.edited = true;
//
//        }
//    }
//
//    private static maxSeriesRecsChange(source: HTMLInputElement)
//    {
//        let value: number = parseInt(source.value);
//        if ((value != YoctoVisualization.constants.maxPointsPerGraphSerie) || (value != YDataRendering.DataSerie.MaxPointsPerSeries))
//        {
//            YoctoVisualization.constants.maxPointsPerGraphSerie = value
//            YDataRendering.DataSerie.MaxPointsPerSeries = value;
//            YoctoVisualization.constants.edited = true;
//
//        }
//    }
//    private static maxSensorRecsChange(source: HTMLInputElement)
//    {
//        let value: number = parseInt(source.value);
//        if ((value != YoctoVisualization.constants.maxDataRecordsPerSensor) || (value != YoctoVisualization.CustomYSensor.MaxDataRecords))
//        {
//            YoctoVisualization.constants.maxDataRecordsPerSensor = value
//            YoctoVisualization.CustomYSensor.MaxDataRecords = value;
//            YoctoVisualization.constants.edited = true;
//
//        }
//    }
//
//    private static captureDPIChange(source: HTMLInputElement)
//    {
//        let prev: number = YoctoVisualization.constants.captureDPI;
//        YoctoVisualization.constants.captureDPI = parseInt(source.value)
//        if (YoctoVisualization.constants.captureDPI != prev) YoctoVisualization.constants.edited = true;
//        configForm.refreshSizeParams();
//    }
//
//    private static captureWidthChange(source: HTMLInputElement)
//    {
//        let prev: number = YoctoVisualization.constants.captureWidth;
//        YoctoVisualization.constants.captureWidth = parseInt(source.value)
//        if (YoctoVisualization.constants.captureWidth != prev) YoctoVisualization.constants.edited = true;
//        configForm.refreshSizeParams();
//    }
//
//    private static captureHeightChange(source: HTMLInputElement)
//    {
//        let prev: number = YoctoVisualization.constants.captureHeight;
//        YoctoVisualization.constants.captureHeight = parseInt(source.value)
//        if (YoctoVisualization.constants.captureHeight != prev) YoctoVisualization.constants.edited = true;
//
//        configForm.refreshSizeParams();
//    }
//
//    private static captureSizeSelectChange(source: HTMLSelectElement)
//    {
//        let prev: YDataRendering.YDataRenderer.CaptureFormatsEnumItem = YoctoVisualization.constants.captureSizePolicy;
//        YoctoVisualization.constants.captureSizePolicy = YDataRendering.YDataRenderer.CaptureFormats.fromString(YDataRendering.YDataRenderer.CaptureFormats, source.value)
//        if (YoctoVisualization.constants.captureSizePolicy != prev) YoctoVisualization.constants.edited = true;
//        configForm.refreshSizeParams();
//    }
//
//    private static refreshSizeParams()
//    {
//        let value: YDataRendering.YDataRenderer.CaptureFormatsEnumItem = YDataRendering.YDataRenderer.CaptureFormats.fromString(YDataRendering.YDataRenderer.CaptureFormats, configForm.inputSizeSelect.value)
//        if (value == YDataRendering.YDataRenderer.CaptureFormats.Keep)
//        {
//            configForm.captureWidthTR.style.display = "none";
//            configForm.captureHeightTR.style.display = "none";
//
//        }
//        else if (value == YDataRendering.YDataRenderer.CaptureFormats.FixedWidth)
//        {
//            configForm.captureWidthTR.style.display = "";
//            configForm.captureHeightTR.style.display = "none";
//        }
//        else if (value == YDataRendering.YDataRenderer.CaptureFormats.FixedHeight)
//        {
//            configForm.captureWidthTR.style.display = "none";
//            configForm.captureHeightTR.style.display = "";
//        }
//
//        if (value == YDataRendering.YDataRenderer.CaptureFormats.Fixed)
//        {
//            configForm.captureWidthTR.style.display = "";
//            configForm.captureHeightTR.style.display = "";
//        }
//        let sw: number = 25.4 * parseInt(configForm.inputCaptureWidth.value) / parseInt(configForm.inputResolution.value)
//        configForm.inputCaptureWidthInfo.innerText = "Pixels  (" + sw.toFixed(1) + "mm)";
//
//        let sh: number = 25.4 * parseInt(configForm.inputCaptureHeight.value) / parseInt(configForm.inputResolution.value)
//        configForm.inputCaptureHeightInfo.innerText = "Pixels  (" + sh.toFixed(1) + "mm)";
//
//    }
//
//    private static downloadCurrentConfig(): void
//    {
//        let element: HTMLAnchorElement = document.createElement('a') as HTMLAnchorElement;
//        let data: string = "data:text/xml;base64," + btoa(YoctoVisualization.YWebPage.get_XmlData());
//
//        element.setAttribute('href', data);
//        element.setAttribute('download', "config.xml");
//        element.style.display = 'none';
//        document.body.appendChild(element);
//        element.click();
//        document.body.removeChild(element);
//    }
//
//    private static captureFormatChange(source: HTMLInputElement)
//    {
//        if (source == configForm.inputPNG) configForm.inputSVG.checked = !source.checked;
//        if (source == configForm.inputSVG) configForm.inputPNG.checked = !source.checked;
//        let prev: YDataRendering.YDataRenderer.CaptureTypeEnumItem = YoctoVisualization.constants.captureType
//        YoctoVisualization.constants.captureType = configForm.inputPNG.checked ? YDataRendering.YDataRenderer.CaptureType.PNG : YDataRendering.YDataRenderer.CaptureType.SVG
//        if (YoctoVisualization.constants.captureType != prev) YoctoVisualization.constants.edited = true;
//
//    }
//
//    public static tabSelected(source: configEditorTab)
//    {
//        this._tabNetwork.active = (source == this._tabNetwork);
//        this._tabCapture.active = (source == this._tabCapture);
//        this._tabResources.active = (source == this._tabResources);
//        this._tabUI.active = (source == this._tabUI);
//        this._tabExport.active = (source == this._tabExport);
//
//    }
//
//}
//
////#endif

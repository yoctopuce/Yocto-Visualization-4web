/*
*   Yocto-Visualization (for web), a free web-based application
*   to visualize Yoctopuce Sensors.
*
*  Web page management, this is the application entry point
*  just add the following lines in you web page.
*
*  import * as YoctoVisualization from './YoctoVisualizationFull.js';
*  YoctoVisualization.YWebPage.run(xmlConfigFileContents);
*
*  xmlConfigFileContents being a string containing the XML
*  Configuration data ( Compatible with the native version
*  of Yocto-Visualization)
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
import * as Pako from "./Pako/Pakofull.js"

export * from "./YoctoApiFull.js";
export * from "./YoctoVisualizationFull.js";

export interface XMLConfigSaveFunction {(xmlDataToSave: string, completedCallback?: XMLConfigSaveFunctionCompleted ): Promise<boolean>;}
export interface XMLConfigSaveFunctionCompleted {(success: boolean, message:string): void }


export interface XMLConfigFileChangedCallback {(newXmlData: string): void;}

export interface ConfigChangeHandler {(m: YoctoAPI.YModule): Promise<string | null>}

export class YWebPage
{
    private static readonly baseSize: number = 18 * YoctoVisualization.constants.generalSizeCoef;
    private static xmlDataCRC: number = 0;
    private static manager: YoctoVisualization.sensorsManager;
    private static widgets: YoctoVisualization.YWidget[] = [];
    private static _contextMenu: YoctoVisualization.ContextMenu;
    private static _contextMarkerSubMenu: YoctoVisualization.ContextSubMenu;
    private static _contextWidgetsSubMenu: YoctoVisualization.ContextSubMenu;
    private static _widgetsMenuItem: YoctoVisualization.ContextMenuItem;
    private static _markersSubMenuItems: YoctoVisualization.ContextMenuItemBase[] = [];
//#ifndef READONLY
    private static _editor: YoctoVisualization.PropertiesForm2 | null = null;
    private static _mainform: YoctoVisualization.mainForm | null = null;
    private static _saveFunction: XMLConfigSaveFunction | null = null;

    public edit(widgetIndex: number)
    {YWebPage.widgets[widgetIndex].edit(); }

    private static _editMenuItem: YoctoVisualization.ContextMenuItem;
    public static get editMenuItem(): YoctoVisualization.ContextMenuItem { return YWebPage._editMenuItem;}

    private static _deleteMenuItem: YoctoVisualization.ContextMenuItem;
    public static get deleteMenuItem(): YoctoVisualization.ContextMenuItem { return YWebPage._deleteMenuItem;}

    private static _disableMarkerMenuItem: YoctoVisualization.ContextMenuItem;
    public static get disableMarkerMenuItem(): YoctoVisualization.ContextMenuItem { return YWebPage._disableMarkerMenuItem;}

    private static _clearDataloggerMenuItem: YoctoVisualization.ContextMenuItem;
    public static get clearDataloggerMenuItem(): YoctoVisualization.ContextMenuItem { return YWebPage._clearDataloggerMenuItem;}

    private static _addMarkerMenuItem: YoctoVisualization.ContextMenuItem;
    public static get addMarkerMenuItem(): YoctoVisualization.ContextMenuItem {return YWebPage._addMarkerMenuItem;}

    public static get markersSubMenuItems(): YoctoVisualization.ContextMenuItemBase[] { return YWebPage._markersSubMenuItems;}

    public static get contextMarkerSubMenu(): YoctoVisualization.ContextSubMenu { return YWebPage._contextMarkerSubMenu;}
    public static get contextWidgetsSubMenu(): YoctoVisualization.ContextSubMenu { return YWebPage._contextWidgetsSubMenu;}

//#endif

    private static _resetDataViewMenuItem: YoctoVisualization.ContextMenuItem;
    public static get resetDataViewMenuItem(): YoctoVisualization.ContextMenuItem { return YWebPage._resetDataViewMenuItem;}

    private static _snapshotMenuItem: YoctoVisualization.ContextMenuItem;
    public static get snapshotMenuItem(): YoctoVisualization.ContextMenuItem { return YWebPage._snapshotMenuItem;}

    private static _MarkerCountPerXaxis: number = 0;

    private static applicationGlobalinit()
    {
        if (YWebPage._MarkerCountPerXaxis == 0)
        {
            let xAxisProp = new YoctoVisualization.XaxisDescription();
            let propDesc: YoctoVisualization.PropertiesList = YoctoVisualization.GenericProperties.getAllProperties(xAxisProp)
            for (let propname in propDesc.byName)
            {
                if (propname.startsWith("markers")) YWebPage._MarkerCountPerXaxis++;
            }
        }
        if (YWebPage.manager == null) YWebPage.manager = new YoctoVisualization.sensorsManager();
//#ifndef READONLY
        if (!YWebPage.readonly && (YWebPage._editor == null)) YWebPage._editor = new YoctoVisualization.PropertiesForm2();
        if (!YWebPage.readonly && (YWebPage._mainform == null)) YWebPage._mainform = new YoctoVisualization.mainForm();
//#endif
        if (YWebPage._contextMenu == null)
        {
            YWebPage._contextMenu = new YoctoVisualization.ContextMenu(YWebPage.baseSize, (mouseX: number, mouseY: number,) => {YWebPage.menuIsOpening(mouseX, mouseY) }, YoctoVisualization.constants.generalFontFamily);

            //#ifndef READONLY
            YWebPage._contextMarkerSubMenu = new YoctoVisualization.ContextSubMenu(YWebPage.baseSize, YWebPage._contextMenu, null, YoctoVisualization.constants.generalFontFamily);
            for (let i: number = 0; i < YWebPage._MarkerCountPerXaxis; i++)
            {
                YWebPage._markersSubMenuItems.push(YWebPage._contextMarkerSubMenu.addMenuItem(YoctoVisualization.ressources.AddMarkerIcon(YWebPage.baseSize.toString(), i + 1), "Place marker " + (i + 1).toString(),
                    () =>
                    {
                        let target: YoctoVisualization.graphWidget = YWebPage._markersSubMenuItems[i].userdata as YoctoVisualization.graphWidget;
                        target.startMarkerCapture(i);
                    }
                ))
            }

            if (!YWebPage.readonly)
            {
                YWebPage._contextWidgetsSubMenu = new YoctoVisualization.ContextSubMenu(YWebPage.baseSize, YWebPage._contextMenu,
                    (mouseX: number, mouseY: number) => {YWebPage.WidgetsSubMenuIsOpening(mouseX, mouseY) },
                    YoctoVisualization.constants.generalFontFamily);
                YWebPage._widgetsMenuItem = YWebPage._contextMenu.addSubMenuItem(YoctoVisualization.ressources.AllIcon(YWebPage.baseSize.toString(), false, false, false, false), "All widgets", YWebPage._contextWidgetsSubMenu)

                YWebPage._editMenuItem = YWebPage._contextMenu.addMenuItem(YoctoVisualization.ressources.EditIcon(YWebPage.baseSize.toString(), false, false, false, false), "Configure this widget", () => {YWebPage.editWidget()})
                YWebPage._deleteMenuItem = YWebPage._contextMenu.addMenuItem(YoctoVisualization.ressources.TrashIcon(YWebPage.baseSize.toString(), false, false, false, false), "Delete this widget", () => {YWebPage.deleteWidget()})
                YWebPage._editMenuItem.visible = false;
                YWebPage._deleteMenuItem.visible = false;

            }
//#endif

            YWebPage._resetDataViewMenuItem = YWebPage._contextMenu.addMenuItem(YoctoVisualization.ressources.resetViewPort(YWebPage.baseSize.toString(), false, false, false, false), "Reset dataview", () => {YWebPage.resetDataView()})
            YWebPage._resetDataViewMenuItem.visible = false;
//#ifndef READONLY
            if (!YWebPage.readonly)
            {
                YWebPage._clearDataloggerMenuItem = YWebPage._contextMenu.addMenuItem(YoctoVisualization.ressources.EraseDatalogger(YWebPage.baseSize.toString(), false, false, false, false), "Clear datalogger", () => {YWebPage.clearDatalogger()})
                YWebPage._resetDataViewMenuItem.visible = false;
            }
//#endif
            YWebPage._contextMenu.AddSeparator();
//#ifndef READONLY
            if (!YWebPage.readonly)
            {
                YWebPage._addMarkerMenuItem = YWebPage._contextMenu.addSubMenuItem(YoctoVisualization.ressources.AddMarker(YWebPage.baseSize.toString(), false, true, true, false), "Place markers", YWebPage._contextMarkerSubMenu)
                YWebPage._disableMarkerMenuItem = YWebPage._contextMenu.addMenuItem(YoctoVisualization.ressources.DeleteMarker(YWebPage.baseSize.toString(), false, true, false, true), "Disable Allmarkers", () => {YWebPage.disableAllMarker()})
                YWebPage._addMarkerMenuItem.visible = false;
                YWebPage._disableMarkerMenuItem.visible = false;
                YWebPage._contextMenu.AddSeparator();
                YWebPage._contextMenu.addMenuItem(YoctoVisualization.ressources.SolidGaugeIcon(YWebPage.baseSize.toString(), false, true, true, false), "Add a new Solid gauge", () => {YWebPage.newGaugeWidget();})
                YWebPage._contextMenu.addMenuItem(YoctoVisualization.ressources.AngularGaugeIcon(YWebPage.baseSize.toString(), false, true, true, false), "Add a new Angular gauge", () => {YWebPage.newAngularGaugeWidget();})
                YWebPage._contextMenu.addMenuItem(YoctoVisualization.ressources.DigitalDisplayIcon(YWebPage.baseSize.toString(), false, true, true, false), "Add a new Digital Display", () => {YWebPage.newDigitalDisplayWidget();})
                YWebPage._contextMenu.addMenuItem(YoctoVisualization.ressources.GraphIcon(YWebPage.baseSize.toString(), false, true, true, false), "Add a new Graph", () => {YWebPage.newGraphWidget();})
            }
//#endif
            YWebPage._contextMenu.addMenuItem(YoctoVisualization.ressources.RawDataIcon(YWebPage.baseSize.toString(), false, false, false, false), "Show raw data", () => {YoctoVisualization.rawDataForm.show();})
            YWebPage._snapshotMenuItem = YWebPage._contextMenu.addMenuItem(YoctoVisualization.ressources.snapshotIcon(YWebPage.baseSize.toString(), false, false, false, false), "Snapshot", () => {YWebPage.snapShot();})
//#ifndef READONLY
            if (!YWebPage.readonly) {
                YWebPage._contextMenu.AddSeparator();
                YWebPage._contextMenu.addMenuItem(YoctoVisualization.ressources.ConfigureIcon(YWebPage.baseSize.toString(), false, false, false, false), "Global configuration", () => {YoctoVisualization.configForm.show();})
                YWebPage._contextMenu.addMenuItem(YoctoVisualization.ressources.SaveIcon(YWebPage.baseSize.toString(), false, false, false, false), "Save now", () => {YWebPage.save(true);})
                
              //  YWebPage._contextMenu.addMenuItem(null, "Run internal test", () =>
              //  {
              //  YWebPage.runInternalTest();
              //  })
            }
//#endif
            YWebPage._contextMenu.addMenuItem(YoctoVisualization.ressources.LogFileIcon(YWebPage.baseSize.toString(), false, false, false, false), "Show logs", () => { YWebPage.showLogsWindow();})
        }
    }

//#ifndef READONLY
    private static WidgetsSubMenuIsOpening(mouseX: number, mouseY: number)
    {
        YWebPage._contextWidgetsSubMenu.clearAllContents();
        for (let i: number = 0; i < YWebPage.widgets.length; i++)
        {
            let icon: string = "";
            let subMenu: YoctoVisualization.ContextSubMenu = new YoctoVisualization.ContextSubMenu(YWebPage.baseSize, YWebPage._contextWidgetsSubMenu,
                (mouseX: number, mouseY: number) => {YWebPage.specificWidgetSubMenuIsOpening(subMenu, mouseX, mouseY) },
                YoctoVisualization.constants.generalFontFamily);
            subMenu.userdata = YWebPage.widgets[i];
            if (YWebPage.widgets[i] instanceof YoctoVisualization.graphWidget) icon = YoctoVisualization.ressources.GraphIcon(YWebPage.baseSize.toString(), false, false, false, false)
            if (YWebPage.widgets[i] instanceof YoctoVisualization.digitalDisplayWidget) icon = YoctoVisualization.ressources.DigitalDisplayIcon(YWebPage.baseSize.toString(), false, false, false, false)
            if (YWebPage.widgets[i] instanceof YoctoVisualization.gaugeWidget) icon = YoctoVisualization.ressources.SolidGaugeIcon(YWebPage.baseSize.toString(), false, false, false, false)
            if (YWebPage.widgets[i] instanceof YoctoVisualization.angularGaugeWidget) icon = YoctoVisualization.ressources.AngularGaugeIcon(YWebPage.baseSize.toString(), false, false, false, false)

            YWebPage._contextWidgetsSubMenu.addSubMenuItem(icon, YWebPage.widgets[i].Text, subMenu)
        }
    }

    private static specificWidgetSubMenuIsOpening(source: YoctoVisualization.ContextSubMenu, mouseX: number, mouseY: number)
    {
        if (source.menuItemsCount > 0) return;

        let w: YoctoVisualization.YWidget = source.userdata as YoctoVisualization.YWidget;
        source.addMenuItem(YoctoVisualization.ressources.EditIcon(YWebPage.baseSize.toString(), false, false, false, false), "Configure", () => {w.edit()})
        source.addMenuItem(YoctoVisualization.ressources.TrashIcon(YWebPage.baseSize.toString(), false, false, false, false), "Delete", () => {YWebPage.deleteWidget(w)})
        if (w instanceof YoctoVisualization.graphWidget)
        {
            source.addMenuItem(YoctoVisualization.ressources.resetViewPort(YWebPage.baseSize.toString(), false, false, false, false), "Reset dataview", () => {(w as YoctoVisualization.graphWidget).resetDataView()})
            source.addMenuItem(YoctoVisualization.ressources.EraseDatalogger(YWebPage.baseSize.toString(), false, false, false, false), "Clear datalogger", () => {(w as YoctoVisualization.graphWidget).clearDataLogger()})
        }

    }

    //#endif

    private static showLogsWindow()
    { YoctoVisualization.logForm.show(); }

    private static snapShot()
    {
        let w: YoctoVisualization.YWidget = YWebPage._snapshotMenuItem.userdata as YoctoVisualization.YWidget;
        w.snapshot();
    }

    private static menuIsOpening(mouseX: number, mouseY: number)
    {
//#ifndef READONLY
        if (YWebPage.disableMarkerMenuItem != null) YWebPage.disableMarkerMenuItem.visible = false;
        if (YWebPage.addMarkerMenuItem != null) YWebPage.addMarkerMenuItem.visible = false;
        if (YWebPage.clearDataloggerMenuItem != null) YWebPage.clearDataloggerMenuItem.visible = false;
        if (YWebPage.editMenuItem != null) YWebPage.editMenuItem.visible = false;
        if (YWebPage.deleteMenuItem != null) YWebPage.deleteMenuItem.visible = false;

//#endif
        YWebPage.resetDataViewMenuItem.visible = false;
        YWebPage.snapshotMenuItem.visible = false;
        for (let i: number = 0; i < YWebPage.widgets.length; i++)
        {
            YWebPage.widgets[i].contextMenuCallBack(mouseX, mouseY);
        }
        //#ifndef READONLY

        YWebPage._widgetsMenuItem.visible = (!YWebPage.readonly) && (YWebPage.widgets.length > 0) && (!YWebPage._editMenuItem.visible);
        //#endif
        YWebPage._contextMenu.refresh();

    }

    private static resetDataView()

    {
        (YWebPage._resetDataViewMenuItem.userdata as YoctoVisualization.graphWidget).resetDataView()
    }

//#ifndef READONLY
    private static editWidget()
    {
        let w: YoctoVisualization.YWidget = YWebPage._editMenuItem.userdata as YoctoVisualization.YWidget;
        w.edit();
    }

    private static disableAllMarker()
    {
        (YWebPage._disableMarkerMenuItem.userdata as YoctoVisualization.graphWidget).disableAllMarkers();
    }

    private static clearDatalogger()
    {
        (YWebPage._clearDataloggerMenuItem.userdata as YoctoVisualization.graphWidget).clearDataLogger();
    }

    private static deleteWidget(widget?: YoctoVisualization.YWidget)
    {
        let w: YoctoVisualization.YWidget = typeof (widget) == "undefined" ? YWebPage._deleteMenuItem.userdata as YoctoVisualization.YWidget : widget;

        YoctoVisualization.confirm.ask(w.confirmDeleteString,
            () =>
            {
                if (!YWebPage.readonly && (w.isBeingEdited) && (YWebPage._editor != null)) YWebPage._editor.hide();

                w.delete();
                YoctoVisualization.constants.edited = true;
                for (let i: number = YWebPage.widgets.length - 1; i >= 0; i--)
                {
                    if (YWebPage.widgets[i] == w)
                    {
                        YWebPage.widgets.splice(i, 1)
                    }
                }
                if ((YWebPage.widgets.length <= 0) && (YWebPage._mainform != null)) YWebPage._mainform.show();
            },
            null, null);
    }

    public static FindUniqueNewName(prefix: string): string
    {
        let n: number = 1;
        for (let i: number = 0; i < YWebPage.widgets.length; i++)
        {
            if (YWebPage.widgets[i].Text.startsWith(prefix)) n++;
        }
        if (n > 1) prefix = prefix + " " + n.toString();
        return prefix;
    }

    public static newGraphWidget(): void
    {
        let w: number = (window.innerWidth / 2) >> 0;
        let h: number = (window.innerHeight / 2) >> 0;
        if (w < 350) w = 350;
        if (h < 200) w = 200;

        let x: number = ((window.innerWidth - w) / 2) >> 0;
        let y: number = ((window.innerHeight - h) / 2) >> 0;

        let index: number = YWebPage.widgets.length;
        if (index > 0)
        {
            x = index * 25;
            y = index * 25;
        }
        let wdg: YoctoVisualization.graphWidget = new YoctoVisualization.graphWidget(null, YWebPage._editor, x, y, 765, 470)
        wdg.set_name(YWebPage.FindUniqueNewName("New Graph"));

        YWebPage.widgets.push(wdg);
        wdg.resize(w, h);   // first create it with default size, then resize so default font sizes  are resized accordingly
        if (this._mainform != null) this._mainform.hide();
        if (!YWebPage.readonly)
        {
            if ((YWebPage._editor != null) && (YWebPage._editor.visible)) wdg.edit();
        }

    }

    public static newAngularGaugeWidget(): void
    {
        let s = Math.min(window.innerWidth, window.innerHeight) / 2;
        if (s < 350) s = 350;
        let x: number = ((window.innerWidth - s) / 2) >> 0;
        let y: number = ((window.innerHeight - s) / 2) >> 0;
        let w: number = s >> 0;
        let h: number = s >> 0;
        let index: number = YWebPage.widgets.length;
        if (index > 0)
        {
            x = index * 25;
            y = index * 25;
        }
        let wdg: YoctoVisualization.angularGaugeWidget = new YoctoVisualization.angularGaugeWidget(null, YWebPage._editor, x, y, 375, 300)
        wdg.set_name(YWebPage.FindUniqueNewName("New Angular Gauge"));
        YWebPage.widgets.push(wdg);
        wdg.resize(w, h);   // first create it with default size, then resize so default font sizes  are resized accordingly
        if (this._mainform != null) this._mainform.hide();
        if (!YWebPage.readonly)
        {
            if ((YWebPage._editor != null) && (YWebPage._editor.visible)) wdg.edit();
        }
    }

    public static newGaugeWidget(): void
    {
        let s = Math.min(window.innerWidth, window.innerHeight) / 2;
        if (s < 350) s = 350;
        let x: number = ((window.innerWidth - s) / 2) >> 0;
        let y: number = ((window.innerHeight - s) / 2) >> 0;
        let w: number = s >> 0;
        let h: number = s >> 0;
        let index: number = YWebPage.widgets.length;
        if (index > 0)
        {
            x = index * 25;
            y = index * 25;
        }
        let wdg: YoctoVisualization.gaugeWidget = new YoctoVisualization.gaugeWidget(null, YWebPage._editor, x, y, 355, 201)
        wdg.set_name(YWebPage.FindUniqueNewName("New Solid Gauge"));
        YWebPage.widgets.push(wdg);
        wdg.resize(w, h);   // first create it with default size, then resize so default font sizes  are resized accordingly
        if (this._mainform != null) this._mainform.hide();
        if (!YWebPage.readonly)
        {
            if ((YWebPage._editor != null) && (YWebPage._editor.visible)) wdg.edit();
        }
    }


    public static newDigitalDisplayWidget(): void
    {
        let s = Math.min(window.innerWidth, window.innerHeight) / 8;
        if (s < 90) s = 90;
        let x: number = ((window.innerWidth - (4 * s)) / 2) >> 0;
        let y: number = ((window.innerHeight - s) / 2) >> 0;
        let w: number = (4 * s) >> 0;
        let h: number = s >> 0;
        let index: number = YWebPage.widgets.length;
        if (index > 0)
        {
            x = index * 25;
            y = index * 25;
        }
        let wdg: YoctoVisualization.digitalDisplayWidget = new YoctoVisualization.digitalDisplayWidget(null, YWebPage._editor, x, y, 410, 125)
        wdg.set_name(YWebPage.FindUniqueNewName("New Digital Display"));

        let n: number = 1;
        for (let i: number = 0; i < YWebPage.widgets.length; i++)
        {
            if (YWebPage.widgets[i].Text.startsWith(wdg.Text)) n++;
        }
        if (n > 1) wdg.Text = wdg.Text + " " + n.toString();

        YWebPage.widgets.push(wdg);
        wdg.resize(w, h);   // first create it with default size, then resize so default font sizes  are resized accordingly
        if (this._mainform != null) this._mainform.hide();
        if (!YWebPage.readonly)
        {
            if ((YWebPage._editor != null) && (YWebPage._editor.visible)) wdg.edit();
        }
    }

    static refreshPropertiesForm()
    {
        if ((!YWebPage.readonly) && (YWebPage._editor != null)) YWebPage._editor.refresh();
    }

//#endif

    static sensorListHaschanged()
    {
//#ifndef READONLY
        YWebPage.refreshPropertiesForm()
//#endif
    }

    static EmptyReadonlyConfig()
    {
        YoctoVisualization.alert.show("Yocto-Visualization Error\n\nConfiguration is both empty and read only, check configuration file.")

    }

    public static async ForceReloadConfig(newXMLdata: string)
    {
//#ifndef READONLY
        if (!YWebPage.readonly)
        {
            if (YWebPage._editor != null) YWebPage._editor.visible = false;
            YoctoVisualization.configForm.hide();
            YoctoVisualization.rawDataForm.hide();
            YoctoVisualization.HubEdit.hide();
        }
//#endif

        YoctoVisualization.logForm.log("Reloading the whole configuration.");
        await YoctoVisualization.sensorsManager.clearHublist();
        for (let i: number = YWebPage.widgets.length - 1; i >= 0; i--)
        {
            YWebPage.widgets[i].destroy();
            YWebPage.widgets.splice(i, 1)
        }
        YWebPage.loadFromXML(newXMLdata);
        //#ifndef READONLY
        YoctoVisualization.constants.edited = false;
        //#endif

    }

    private static ConfigChangedConfirmWindows: YoctoVisualization.YWindow | null = null;
    public static ConfigChanged(newXMLdata: string)
    {
        if (YWebPage.ConfigChangedConfirmWindows != null)  // prevent confirmation from stacking
        {
            YWebPage.ConfigChangedConfirmWindows.hide();
        }

        let newCRC: number = YoctoVisualization.constants.crc32(newXMLdata)
        if (newCRC == YWebPage.xmlDataCRC) return;
        YoctoVisualization.logForm.log("Config file changed behind our back!")

        if (!this.readonly)
        {
            YWebPage.ConfigChangedConfirmWindows = YoctoVisualization.confirm.ask("Configuration has changed on server\nWould you like to reload it?",
                () =>
                {
                    YWebPage.ForceReloadConfig(newXMLdata);
                    YWebPage.ConfigChangedConfirmWindows = null;
                },
                () => { YWebPage.ConfigChangedConfirmWindows = null;}, null
            )
        }
        else
        {
            YWebPage.ForceReloadConfig(newXMLdata)
        }
        YWebPage.xmlDataCRC = newCRC;
        //#ifndef READONLY
        YoctoVisualization.constants.edited = false;
        //#endif
    }
    //#ifndef READONLY
    private static saveIntDiv: HTMLDivElement | null = null;
    public static ShowSaveReminder(visible: boolean)
    {
        if (YWebPage.saveIntDiv == null)
        {
            YWebPage.saveIntDiv = document.createElement("DIV") as HTMLDivElement;
            YWebPage.saveIntDiv.style.position = "fixed";
            YWebPage.saveIntDiv.style.left = "5px";
            YWebPage.saveIntDiv.style.top = "5px";
            YWebPage.saveIntDiv.style.zIndex = "200000";
            YWebPage.saveIntDiv.style.cursor = "pointer";
            YWebPage.saveIntDiv.innerHTML = YoctoVisualization.ressources.SaveNeededIcon((48 * YoctoVisualization.constants.guiDPIFactor).toString(), false, false, false, false)
            YWebPage.saveIntDiv.addEventListener("click", () =>
            {
                (<HTMLDivElement>YWebPage.saveIntDiv).style.display = "none";
                YWebPage.save(true);
            });
            document.body.appendChild(YWebPage.saveIntDiv)
        }
        YWebPage.saveIntDiv.style.display = visible ? "" : "none";
    }
//#endif
    private static loadFromXML(xmlData: string)
    {
        if (xmlData == "")
        {
//#ifndef READONLY
            if ((!YWebPage.readonly) && (YWebPage._mainform != null))
            {
                YWebPage._mainform.show();
            }
            else
//#endif
            {
                YWebPage.EmptyReadonlyConfig();
            }
            return;
        }
        let parser: DOMParser = new DOMParser()
        let doc: XMLDocument = parser.parseFromString(xmlData.replace("<" + "!-->", "<" + "!-- "), "application/xml")
        let root: ChildNode | null = null;
        doc.childNodes.forEach(node => {if ((node.nodeName.toUpperCase() == "ROOT") && (root == null)) root = node; })
        if (root == null) throw "No ROOT top node in XML data";

        // sensor configuration must be loaded first
        (<ChildNode>root).childNodes.forEach(node =>
        {
            if (node.nodeName.toUpperCase() == "SENSORS")
            {
                YoctoVisualization.sensorsManager.setKnownSensors(new YoctoVisualization.YXmlNode(node));
            }
        });

        (<ChildNode>root).childNodes.forEach(node =>
        {
            let editor:
                //#ifndef READONLY
                YoctoVisualization.PropertiesForm2 |
                //#endif
                null = null;
//#ifndef READONLY
            editor = YWebPage._editor;
//#endif
            switch (node.nodeName.toUpperCase())
            {
            case "CONFIG" :
                YoctoVisualization.constants.Init(new YoctoVisualization.YXmlNode(node));
                break
            case "GRAPHFORM":
                YWebPage.widgets.push(new YoctoVisualization.graphWidget(new YoctoVisualization.YXmlNode(node), editor));
                break;
            case "ANGULARGAUGEFORM":
                YWebPage.widgets.push(new YoctoVisualization.angularGaugeWidget(new YoctoVisualization.YXmlNode(node), editor));
                break;
            case "GAUGEFORM":
                YWebPage.widgets.push(new YoctoVisualization.gaugeWidget(new YoctoVisualization.YXmlNode(node), editor));
                break;
            case "DIGITALDISPLAYFORM":
                YWebPage.widgets.push(new YoctoVisualization.digitalDisplayWidget(new YoctoVisualization.YXmlNode(node), editor));
                break;
            }

            YoctoVisualization.sensorsManager.registerChangeCallback(() => {YWebPage.sensorListHaschanged();});

            if ((node.nodeName.toUpperCase() == "ROOT") && (root == null)) root = node;
        })

        if (YWebPage.widgets.length <= 0)
        {
//#ifndef READONLY
            YoctoVisualization.constants.edited = false;
            if ((!YWebPage.readonly) && (YWebPage._mainform != null))
            {
                YWebPage._mainform.show();
            }
            else
//#endif
            {
                YWebPage.EmptyReadonlyConfig();
            }
        }
        //#ifndef READONLY
        else if ((!YWebPage.readonly) && (YWebPage._mainform != null)) YWebPage._mainform.hide();
        //#endif
    }

    //#ifndef READONLY


    private static NewVersionmessageDiv : HTMLDivElement;

    private static AnimateNewVerwsionMessage(step :number)
    { YWebPage.NewVersionmessageDiv.style.left = Math.round((100-step))+"%";
      if (step<100)
        { step+=2;
            if (step>100) step=100;
            setTimeout(    () => {YWebPage.AnimateNewVerwsionMessage(step);});

        }
    }

    private static StartInstaller(roothub : YoctoVisualization.Hub |null)
         {
           let installerDiv :  HTMLDivElement = document.createElement("DIV") as HTMLDivElement;

           installerDiv.style.position="absolute";
           installerDiv.style.top="50%";
           installerDiv.style.left="50%";
           installerDiv.style.transform="translate(-50%,-50%)";
           installerDiv.style.width="550px";
           installerDiv.style.height="380px";
           installerDiv.style.zIndex=  YWebPage.getTopZIndex().toString();
           installerDiv.style.border="1px solid black";
           installerDiv.style.boxShadow="rgba(0, 0, 0, 0.05) 4px 4px 4px 1px";
           document.body.appendChild(installerDiv);
           let options : any = {};
           if (roothub != null)
               options = {"protocol": roothub.protocol,
                         "addr":  roothub.addr,
                         "port": parseInt(roothub.port),
                         "path" : roothub.path,
                         "cancelable":true};

           (window as any).startYV4W_installer(installerDiv,options);


        }



    private static DownloadAndStartInstaller(installerURL:string,roothub : YoctoVisualization.Hub |null ,deleteTimer : NodeJS.Timeout)
       { clearTimeout(deleteTimer);
         console.log("Downloading installer ("+installerURL+")...");
         let P : HTMLParagraphElement = document.createElement("P") as HTMLParagraphElement;
         P.style.textAlign="center";
         P.style.fontFamily=YoctoVisualization.constants.generalFontFamily;
         P.style.fontSize="16px";
         P.innerHTML ="Downloading Installer<br>Please wait...";
         YWebPage.NewVersionmessageDiv.removeChild(YWebPage.NewVersionmessageDiv.firstChild as ChildNode );
         YWebPage.NewVersionmessageDiv.appendChild(P)
         //debugger
         let  script : HTMLScriptElement = document.createElement("script") as HTMLScriptElement;
         script.async = false;
         script.type = "module";
         script.onerror = (err : Event | string)=>
             { console.log("Failed to donwload installer ("+Event.toString()+")" );
               P.innerHTML =("Failed to download installer,<br>Check conole logs");
             };

          script.onload = () =>
            { P.innerHTML ="Starting installer...";
             YWebPage.DeleteNewVersionMessage(100)
             YWebPage.StartInstaller(roothub);
            }


         document.body.appendChild(script);

         script.src = installerURL;

     }

    private static  DeleteNewVersionMessage(opacity : number)
    {   opacity-=5;
        if (opacity>0)
        {  YWebPage.NewVersionmessageDiv.style.opacity=(opacity/100).toString();
           setTimeout(    () => {YWebPage.DeleteNewVersionMessage(opacity);},100);
           return;

        }
        document.body.removeChild(YWebPage.NewVersionmessageDiv.parentNode as Node);
    }

    private static getTopZIndex() : number
    {  var elems :  HTMLCollectionOf<HTMLDivElement> = document.getElementsByTagName("DIV") as HTMLCollectionOf<HTMLDivElement> ;
        var highestZ :number = 0;
        for (var i :number = 0; i < elems.length; i++)
        { var z :number = Number.parseInt( window.getComputedStyle(elems[i] ,null).getPropertyValue( "z-index"));
            if (z > highestZ) highestZ =z;

        }
        return highestZ+1;
    }

    public static async CheckForNewVersion( force: boolean)
    {   if (!YoctoVisualization.constants.mustCheckForUpdate && !force) return;



        let checkurl = location.protocol+"//www.yoctopuce.com/FR/common/getLastFirmwareLink.php?app=yoctovisualization4web.installer&version="+YoctoVisualization.constants.buildVersion+"&platform=_";
        let response :Response;
        try { response = await fetch(checkurl);} catch(e:any) {return;}
        if (!response.ok)  return;
        let json : any;
        try  { json  = await response.json();} catch (e) {return}
        if (!(json instanceof Array)) return;
        if (json.length<=0) return;
        if (!("version" in json[0])) return;
        if (!("link" in json[0])) return;

        let newVersionInstallerURL :string =  json[0]["link"];
        let newVersionNumber  : number = parseInt( json[0]["version"]);
        let currentVersionStr  : string = YoctoVisualization.constants.buildVersion;
        let currentVersionNumber : number=0;
        if (currentVersionStr.indexOf("-")<0)
        {  let n = currentVersionStr.lastIndexOf(".");
           if (n>=0) currentVersionStr=currentVersionStr.substr(n+1);
           currentVersionNumber= parseInt(currentVersionStr);
        }
        if (currentVersionNumber>= newVersionNumber) return;

        let generalSize : number =YoctoVisualization.constants.generalFontSize;
        let  NewVersionSizeX  : number =generalSize*24;
        let  NewVersionSizeY  : number =generalSize*5;

        let containerDiv : HTMLDivElement = document.createElement("DIV") as HTMLDivElement;
        containerDiv.style.position="absolute";
        containerDiv.style.width=NewVersionSizeX+"px";
        containerDiv.style.height=NewVersionSizeY+"px";
        containerDiv.style.zIndex=  YWebPage.getTopZIndex().toString();

        containerDiv.style.top="5px";
        containerDiv.style.right="0px";
        containerDiv.style.overflow="hidden"
        document.body.appendChild(containerDiv);

        YWebPage.NewVersionmessageDiv = document.createElement("DIV") as HTMLDivElement;
        YWebPage.NewVersionmessageDiv.style.position="absolute";
        YWebPage.NewVersionmessageDiv.style.width=(NewVersionSizeX-7)+"px";
        YWebPage.NewVersionmessageDiv.style.height=(NewVersionSizeY-2)+"px";
        YWebPage.NewVersionmessageDiv.style.backgroundColor="GhostWhite";
        YWebPage.NewVersionmessageDiv.style.border="1px solid dimgray";

        YWebPage.NewVersionmessageDiv.style.top="0px";
        YWebPage.NewVersionmessageDiv.style.left=NewVersionSizeX+"px";


        let table : HTMLTableElement = document.createElement("TABLE") as HTMLTableElement;

        table.style.fontFamily=YoctoVisualization.constants.generalFontFamily;
        table.style.fontSize=generalSize+"px";
        let TR  :  HTMLTableRowElement = document.createElement("TR") as HTMLTableRowElement;

        let TD1  :  HTMLTableCellElement = document.createElement("TD") as HTMLTableCellElement;
        TD1.style.paddingLeft="5px";
        TD1.style.paddingRight="10px";
        TD1.rowSpan=2;
        TD1.style.verticalAlign="middle";
        TD1.innerHTML=  YoctoVisualization.ressources.infoIcon((generalSize*4).toString(), false, false, false, false, "information")
        TR.appendChild(TD1)
        let TD2  :  HTMLTableCellElement = document.createElement("TD") as HTMLTableCellElement;

        TD2.innerHTML=  "A new Yocto-Visualization (for web)<br>version is available";
        TR.appendChild(TD2)
        table.appendChild(TR);

        TR   =  document.createElement("TR") as HTMLTableRowElement;
        TD2  =  document.createElement("TD") as HTMLTableCellElement;
        TD2.style.textAlign="right";
        TD2.style.verticalAlign="bottom";


        let hubList: YoctoVisualization.Hub[] = YoctoVisualization.sensorsManager.hubList;
        let rootHub : YoctoVisualization.Hub | null  =null;
        for (let i:number =0;i<hubList.length;i++)
        { if (!hubList[i].removable) rootHub = hubList[i];

        }

        let a : HTMLAnchorElement = document.createElement("A") as HTMLAnchorElement;
        let deleteTimer : NodeJS.Timeout  = setTimeout(    () => {YWebPage.DeleteNewVersionMessage(100);},5000);
        a.style.fontSize="12px";
        a.style.color=" #0000EE"
        a.style.textDecoration="underline";
        a.style.cursor="pointer";
        a.style.fontFamily=YoctoVisualization.constants.generalFontFamily;
        a.style.fontSize=generalSize+"px";

       if (rootHub!=null)
        {   a.innerText="Download and start installer..";
            a.addEventListener("click" ,()=>{YWebPage.DownloadAndStartInstaller(newVersionInstallerURL,rootHub as YoctoVisualization.Hub,deleteTimer);});
        }
        else
        { a.innerText="www.yoctopuce.com";
          a.addEventListener("click" ,()=>{window.location.assign("http://www.yoctopuce.com/EN/tools.php")});
        }



        TD2.appendChild(a);
        TR.appendChild(TD2)
        table.appendChild(TR);

        YWebPage.NewVersionmessageDiv.appendChild(table);

        containerDiv.appendChild(YWebPage.NewVersionmessageDiv);
        YWebPage.AnimateNewVerwsionMessage(0);

    }
//#endif


    // YWebPage.run is the application entry point.
    //
    // params:
    // xmldata  : XML  configuration data string
    // ExternalConfigChange:  will be called if a module config changes , can be used to track configuration file changes,
    // ExternalConfigChange should return the new  XML  configuration data string or null. If you don't want
    // to use that feature, set ExternalConfigChange to null
    // saveFunction will be called at save time and is supposed to sve the configuration data the way it sees fit
    // One can use the internal  YWebPage.Dummysave to test.

    public static run(xmlData: string, ExternalConfigChange?: ConfigChangeHandler, saveFunction?: XMLConfigSaveFunction): void
    {

        if (typeof (ExternalConfigChange) !== "undefined")
        {
            if (ExternalConfigChange != null)
            {
                YoctoVisualization.sensorsManager.registerChangeExternalCallback(ExternalConfigChange);
            }
        }

        YWebPage.xmlDataCRC = YoctoVisualization.constants.crc32(xmlData)

//#ifndef READONLY
        if (typeof saveFunction !== "undefined") YWebPage._saveFunction = saveFunction;
//#endif
        YoctoVisualization.logForm.log("Application start, Welcome to Yocto-Visualization (for web).");
        //#ifndef READONLY
        YoctoVisualization.logForm.log("This application contains code ported from the Pako library (www.github.com/nodeca/pako).");
        //#endif
        YoctoVisualization.logForm.log("Yocto-Visualization version is " + YoctoVisualization.constants.buildVersion);

        YoctoVisualization.logForm.log("Yoctopuce API version is " + YoctoAPI.YAPI.imm_GetAPIVersion());
        if (YoctoVisualization.constants.RunningOnAndroid) YoctoVisualization.logForm.log("Browser is running on Android");
        let widthCm: number = Math.round(2.54 * YoctoVisualization.constants.deviceScreenWidth / YoctoVisualization.constants.screenDPI);
        let heightCm: number = Math.round(2.54 * YoctoVisualization.constants.deviceScreenHeight / YoctoVisualization.constants.screenDPI);

        YoctoVisualization.logForm.log("Reported screen size is " + YoctoVisualization.constants.deviceScreenWidth.toString() + "x" + YoctoVisualization.constants.deviceScreenHeight.toString() + " at " + YoctoVisualization.constants.screenDPI + " dpi, (~" + widthCm.toString() + "x" + heightCm.toString() + "cm) ");
        YoctoVisualization.logForm.log("Reported pixel ratio is " + window.devicePixelRatio.toString());
        YoctoVisualization.logForm.log(YoctoVisualization.constants.isPhoneOrTablet ? "Probably running on a tablet or a phone." : "Probably running on a desktop.");
        YoctoVisualization.logForm.log((YoctoVisualization.constants.guiDPIFactorWasOverriden ? "DPI based zoom overridden  to " : "DPI based zoom factor set to ") + YoctoVisualization.constants.guiDPIFactor.toFixed(1));

        YoctoVisualization.logForm.log("Reported window inner size =" + window.innerWidth.toString() + "x" + window.innerHeight.toString() + "px");

        YWebPage.applicationGlobalinit()
        YoctoVisualization.sensorsManager.run()
        YWebPage.loadFromXML(xmlData);

        //  window.addEventListener("beforeunload", async (e: Event) => { await YWebPage.pageIsleaving(e); })
        //  window.addEventListener("pagehide", async (e: Event) => { await YWebPage.pageIsleaving(e); })

        //#ifndef READONLY
        YoctoVisualization.constants.edited = false;
        YWebPage.CheckForNewVersion(false);
        //#endif


    }

    private static async pageIsleaving(e: Event)
    {
//#ifndef READONLY
        if (!(<any>e).persistent)
        {
            if (YoctoVisualization.constants.edited)
            {
                await YWebPage.save(false)
                await YoctoAPI.YAPI.FreeAPI();

            }
        }
        //#endif

//#ifndef READONLY
        //if (!await this.save(false)) e.preventDefault();  not reliable :-/

        //   if (YoctoVisualization.constants.edited)
        //   {  e.preventDefault();

        //   } else  await YoctoAPI.YAPI.FreeAPI();

        //#endif

    }
//#ifndef READONLY
    public static refreshEditor()
    {
        if (YWebPage.readonly) return
        if (YWebPage._editor == null) return
        YWebPage._editor.refresh();
    }

    public static EditObject(widget: YoctoVisualization.YWidget, structData: object,
                             setvalueCallBack: YoctoVisualization.SetValueCallBack2,
                             getvalueCallBack: YoctoVisualization.GetValueCallBack2,
                             EditStoppedCallBack: YoctoVisualization.EditorWasClosedCallback): void
    {
        if (YWebPage.readonly) return
        if (YWebPage._editor == null) return
        YWebPage._editor.showWindow(widget, structData, setvalueCallBack, getvalueCallBack, EditStoppedCallBack);
    }

    public static get_XmlData(): string
    {
        let XmlConfigFile: string = "<?xml version=\"1.0\" ?>\n"
            + "<!--\n"
            + "   **************************************************\n"
            + "   Yocto-Visualization (for web)  configuration file\n"
            + "   **************************************************\n"
            + "-->\n"
            + "<ROOT version='2.1'>\n"
            + "<!-- in 2.1 version, floating point values are saved in CultureInfo.InvariantCulture form -->\n";
        XmlConfigFile += YoctoVisualization.constants.GetXMLConfiguration();
        for (let i: number = 0; i < YWebPage.widgets.length; i++)
        {
            if (YWebPage.widgets[i] instanceof YoctoVisualization.graphWidget) XmlConfigFile += (YWebPage.widgets[i] as YoctoVisualization.graphWidget).getConfigData();
            if (YWebPage.widgets[i] instanceof YoctoVisualization.angularGaugeWidget) XmlConfigFile += (YWebPage.widgets[i] as YoctoVisualization.angularGaugeWidget).getConfigData();
            if (YWebPage.widgets[i] instanceof YoctoVisualization.gaugeWidget) XmlConfigFile += (YWebPage.widgets[i] as YoctoVisualization.gaugeWidget).getConfigData();
            if (YWebPage.widgets[i] instanceof YoctoVisualization.digitalDisplayWidget) XmlConfigFile += (YWebPage.widgets[i] as YoctoVisualization.digitalDisplayWidget).getConfigData();
        }
        //  XmlConfigFile += propWindow2.getConfigData();   // no really important
        XmlConfigFile += YoctoVisualization.sensorsManager.getXMLSensorsConfig();
        XmlConfigFile += "</ROOT>\n";
        return XmlConfigFile;
    }

//#endif

    public static get readonly(): boolean
    {
        let res: boolean = true;
//#ifndef READONLY
        res = (YWebPage._saveFunction == null);
//#endif
        return res;
        }
     //#ifndef READONLY
    // stub for dev tests
    private static async runInternalTest()
        {

         // put test code here

        }
    //#endif

    private static async save(force: boolean): Promise<boolean>
    {
        //#ifndef READONLY
        if (YWebPage.readonly) return true;
        let xml: string = this.get_XmlData();
        let newCRC: number = YoctoVisualization.constants.crc32(xml);
        if (!force && newCRC == YWebPage.xmlDataCRC) return true;


        let saveDoneCallback  = (ok:boolean,message:string) =>
          {
            let div: HTMLDivElement = document.createElement("DIV") as HTMLDivElement;
            div.style.position = "Fixed"
            div.style.left = "5px";
            div.style.top = "5px";
            div.style.padding = "2px 5px 2px 5px";
            div.style.margin = "2px 2px 2px 2px";
            div.style.border = "1px solid darkgreen";
            div.style.fontFamily = "Arial"
            div.style.fontSize = (12 * YoctoVisualization.constants.guiDPIFactor).toString();
            div.style.whiteSpace = "nowrap";
            div.style.zIndex = "200000";
            div.style.textAlign = "center";
            div.style.opacity = "1";
            let  fgcolor : string = ok?  "darkgreen":"darkred";
            let  bgcolor : string = ok?  "#b9eea9":"#eea9a9";
            div.style.opacity = "1";
            div.style.backgroundColor = bgcolor;
            div.style.border = "1px solid "+fgcolor;
            div.style.color = fgcolor;
            div.innerText = message;
            document.body.appendChild(div)
            setTimeout(() => {YWebPage.handleSavedNotification(div)}, 100)
          };


        try
        {
            if (YWebPage._saveFunction != null)
            {
               return  await YWebPage._saveFunction(this.get_XmlData(),saveDoneCallback);

            }
        }
        catch (e)
        {   saveDoneCallback(false,"Save failed" )
            YoctoVisualization.alert.show("Configuration save failed, sorry\n" + (e as Error).message)
            return false;
        }
        YWebPage.xmlDataCRC = newCRC
        YoctoVisualization.logForm.log("Configuration saved.");
        YoctoVisualization.constants.edited = false;

        //#endif
        return true;

    }

    private static handleSavedNotification(div: HTMLDivElement)
    {
        let opacity = parseFloat(div.style.opacity) - 0.05;
        if (opacity < 0)
        {
            document.body.removeChild(div);
            return;
        }
        div.style.opacity = opacity.toString();
        setTimeout(() => {YWebPage.handleSavedNotification(div)}, 100)
    }

//#ifndef READONLY
    // Will just print the XML  config  file on the page
    public static Dummysave(xml: string): boolean
    {

        let contents: HTMLPreElement = document.createElement("PRE") as HTMLPreElement;
        contents.innerText = xml;
        document.body.appendChild(contents);
        return true;
    }

//#endif

}

export class HTTPrequestResult
{
    private _data: Uint8Array | null;
    private _status: number;
    private _statusText: string;
    constructor(data: Uint8Array | null, status: number, statusText: string)
    {
        this._data = data;
        this._status = status;
        this._statusText = statusText;
    }
    public get data(): Uint8Array | null {return this._data};
    public get status(): number {return this._status};
    public get statusText(): string {return this._statusText};

}

export class HubInfo
{
    private _protocol: string;
    private _addr: string;
    private _port: number;
    private _path: string;
    private _userPassword: boolean = false;
    private _adminPassword: boolean = false;
    private _cred: string = ""
    private _serial: string = "";
    private _srvusername: string | null = null;
    private _srvpassword: string | null = null;

    public get protocol(): string {return this._protocol;}
    public get addr(): string {return this._addr;}
    public get port(): number {return this._port;}
    public get path(): string {return this._path;}
    public get userPassword(): boolean {return this._userPassword;}
    public get adminPassword(): boolean {return this._adminPassword;}
    public get serial(): string {return this._serial;}
    public get srvUsername(): string {return this._srvusername != null ? this._srvusername : "";}
    public get srvPassword(): string {return this._srvpassword != null ? this._srvpassword : "";}

    constructor(protocol: string, addr: string, port: number, path: string, srvusername?: string | null, srvpassword?: string | null)
    {
        if (protocol.slice(-1) == ':') protocol = protocol.slice(0, -1);
        this._protocol = protocol
        this._addr = addr;
        this._port = port;

        this._protocol = protocol
        this._path = path;
        if (srvusername !== undefined) this._srvusername = srvusername;
        if (srvpassword !== undefined) this._srvpassword = srvpassword;

        if (this._path != "")
        {
            if (this._path.charAt(0) == "/")
            {
                this._path = this._path.slice(1);
            }
        }
        if (this._path != "")
        {
            if (this._path.slice(-1) == '/')
            {
                this._path = this._path.slice(0, -1);
            }
        }
    }

    public get_hubUrl(user?: string, password?: string): string
    {
        let url: string = this.protocol + "://";
        if ((typeof (user) != "undefined") && (user != ""))
        {
            if (user != "")
            {
                url += user + ":" + password + "@";

            }
        }
        url += this.addr + ":" + this.port.toString();
        if (this.path != "") url += "/" + this.path;
        return url;
    }
    public async makeRequest(): Promise<boolean | number>
    {
      let url: string = this._protocol + "://" + this._addr + ":" + this._port.toString();
      if (this._path != "") url += "/" + this._path;
      url += "/info.json";
      let response :Response;
      try { response  = await fetch(url,{mode: 'cors'});}
      catch (e: any) {return -3;}
      if (response.ok)
       {  let HubData: any;
          try {HubData = await response.json();} catch (e) {return -1;}
          if (HubData.port && HubData.port.length > 0) {
              let proto_port: string = HubData.port[0].split(':');
              this._protocol = proto_port[0];
              this._port = parseInt(proto_port[1]);
          }
          this._serial = HubData.serialNumber;
          this._path = HubData.dir;
          this._adminPassword = (HubData.adminPassword.toUpperCase() == "TRUE");
          this._userPassword = (HubData.userPassword.toUpperCase() == "TRUE");
          return true;
      }

      if   ((response.status == 404) &&  (this._path != "")) return -2;
      if   ((response.status == 0) &&  (response.statusText == null)) return -3;
      return response.status;
   /*



        let url: string = this._protocol + "://" + this._addr + ":" + this._port.toString();
        if (this._path != "") url += "/" + this._path;
        url += "/info.json";
        let HubData: any = null;
        let res: YoctoVisualization.HTTPrequestResult = await YoctoVisualization.YoctoHubFileHandler.makeRequest("GET", url, this._srvusername, this._srvpassword);
        if (res.data != null)
        {
            let data: string = new TextDecoder().decode(res.data);
            HubData = JSON.parse(data);
            if (HubData.port && HubData.port.length > 0)
            {
                let proto_port: string = HubData.port[0].split(':');
                this._protocol = proto_port[0];
                this._port = parseInt(proto_port[1]);
            }
            this._serial = HubData.serialNumber;
            this._path = HubData.dir;
            this._adminPassword = (HubData.adminPassword.toUpperCase() == "TRUE");
            this._userPassword = (HubData.userPassword.toUpperCase() == "TRUE");
            return true;
        }
        /*
        else
        {
            // probably a hub or a virtualhub
            if (this._protocol == 'https')
            {
                this._protocol = "wss";
            }
            else
            {
                this._protocol = "ws";
            }
        }

        return res.status;*/
        //return false;
    }

    private findChild(parent: XMLDocument | ChildNode, name: string): ChildNode | null
    {
        let res: ChildNode | null = null
        parent.childNodes.forEach(node =>
        {
            if ((node.nodeName == name))
            {
                res = node;
                return
            }
        });
        return res;
    }

    public findOutCredentialsFromConfigFile(xmlData?: string)
    {
        if (xmlData == null) return;
        let parser: DOMParser = new DOMParser()
        let doc: XMLDocument = parser.parseFromString(xmlData, "application/xml")
        let rootNode: ChildNode | null = this.findChild(doc, "ROOT");
        if (rootNode == null) return;
        let configNode: ChildNode | null = this.findChild(rootNode, "Config");
        if (configNode == null) return;
        let Hubs: ChildNode | null = this.findChild(configNode, "Hubs");
        if (Hubs == null) return;
        let HubSection: string;
        let list: NodeListOf<ChildNode> = Hubs.childNodes;
        let sourceHubFound: boolean = false;
        for (let i: number = 0; i < list.length; i++)
        {
            if (list[i].nodeName == "Hub")
            {
                let node: YoctoVisualization.YXmlNode = new YoctoVisualization.YXmlNode(list[i])
                let attributes: { [index: string]: string } = node.Attributes;
                let addr: string = attributes.hasOwnProperty("addr") ? attributes["addr"] : "";
                let port: string = attributes.hasOwnProperty("port") ? attributes["port"] : "80";
                let protocol: string = attributes.hasOwnProperty("protocol") ? attributes["protocol"] : "";
                let path: string = attributes.hasOwnProperty("path") ? attributes["path"] : "";
                let username: string = attributes.hasOwnProperty("user") ? attributes["user"] : "";
                let password: string = attributes.hasOwnProperty("password") ? attributes["password"] : "";

                let a1 = addr.toUpperCase();
                if (a1.substring(0, 4) == "WWW.") a1 = a1.substring(4);
                let a2 = this._addr.toUpperCase();
                if (a2.substring(0, 4) == "WWW.") a2 = a2.substring(4);

                if ((a1 == a2) && (path == this._path))
                {
                    this._srvusername = username;
                    this._srvpassword = YoctoVisualization.Hub.Decrypt(password, YoctoVisualization.Hub.loginCypherPassword);
                }
            }
        }

    }


}

export class YoctoHubFileHandler
{
    private static signatureStart: string = "YoctoHubFileHandler.start(";
    private static signatureEnd: string = "</ROOT>\\n\");";
    private info: HubInfo;
    private filename: string = '';
    private xmldata: string = '';
    private htmlSrcCode: string = '';
    private FileSystemAccessDenied: boolean = false;
    private _XMLConfigFileChanged: XMLConfigFileChangedCallback | null = null
    //#ifndef READONLY
    private fileSystem: YoctoAPI.YFiles | null = null;
    private fileSystemReady: boolean = false;
    private configFileCRC: number = -1;
    //#endif
    constructor(hubInfo: HubInfo)
    {
        this.info = hubInfo;
    }

    public async init(defaultXmlConfigFileContents?: string)
    {
        let url: string = location.href;
        this.filename = url.substring(url.lastIndexOf('/') + 1);
        let p: number = this.filename.indexOf("?");
        if (p > 0) this.filename = this.filename.substring(0, p);
        this.htmlSrcCode = document.documentElement.outerHTML;
        if ((typeof (defaultXmlConfigFileContents) === "undefined") || (defaultXmlConfigFileContents == ""))
        {
            this.xmldata =
                '<?xml version="1.0" ?>\n'
                + '<ROOT version="2.1">\n'
                + '<Config>\n'
                + '<Hubs>\n'
                + '<Hub protocol="' + this.info.protocol + '" addr="' + this.info.addr + '" port="' + this.info.port.toString() + '"'
                + (this.info.path != "" ? ' path="' + this.info.path + '"' : "")
                + ' removable="FALSE"/>\n'
                + '</Hubs>\n'
                + '</Config>\n'
                + '</ROOT>\n';
        }
        else
        {
            this.xmldata = defaultXmlConfigFileContents;
        }
        //#ifndef READONLY
        this.fileSystem = null;
        this.fileSystemReady = false;
        await this.findSourceFileSystem(defaultXmlConfigFileContents);
        //#endif
    }

    public static async start(defaultXmlConfigFileContents?: string)
    {
        let dirpath: string = location.pathname;
        let defport: string = "80";
        let slashpos: number = dirpath.lastIndexOf('/');
        if (slashpos > 0)
        {
            dirpath = dirpath.slice(0, slashpos);
        }
        else
        {
            dirpath = "";
        }
        if (location.protocol == 'https:')
        {
            defport = "443";
        }
        let hubinfo: HubInfo = new HubInfo(location.protocol, location.hostname, parseInt(location.port ? location.port : defport), dirpath);
        await hubinfo.makeRequest();
        let filehandler = new YoctoHubFileHandler(hubinfo);
        await filehandler.init(defaultXmlConfigFileContents);
        return filehandler;
    }

    public get xmlConfigData(): string {return this.xmldata;}

    public static makeRequest(method: string, url: string, username?: string | null, password?: string | null): Promise<HTTPrequestResult>
    {
        //console.log(method + " " + url)
        return new Promise(function (resolve, reject)
        {
            let xhr = new XMLHttpRequest();

            if ((username !== undefined) && (password !== undefined) && (username != null) && (password !== null))
            {
                xhr.open(method, url, true, username, password);
                xhr.withCredentials = true;

            }
            else
            {
                xhr.open(method, url);
            }
            xhr.overrideMimeType('text/plain; charset=x-user-defined');
            xhr.onreadystatechange = function ()
            {
                //console.log('readyState:'+xhr.readyState+' status='+xhr.status);
                if (xhr.readyState == 4) {
                    if (this.status >= 200 && this.status < 300)
                    {
                        resolve(new HTTPrequestResult(YoctoAPI.YAPI.imm_str2bin(xhr.response), this.status, xhr.statusText));
                    }
                    else
                    {
                        resolve(new HTTPrequestResult(null, this.status, xhr.statusText));
                    }
                }
            }
            xhr.onerror = function ()
            {
                resolve(new HTTPrequestResult(null, this.status, xhr.statusText));
            };
            xhr.send();
        });
    }

//#ifndef READONLY

    private async findSourceFileSystem(xmldata?: string)
    {

        this.fileSystem = null;
        let errmsg: YoctoAPI.YErrorMsg = new YoctoAPI.YErrorMsg();
        this.info.findOutCredentialsFromConfigFile(xmldata);

        let url: string = this.info.get_hubUrl(this.info.srvUsername, this.info.srvPassword);

        //console.log("registering " + url);
        try
        {
            await YoctoAPI.YAPI.RegisterHub(url, errmsg)
        }
        catch (e)
        {
            this.fileSystemReady = false;
            if ((e as YoctoAPI.YoctoError).errorType == YoctoAPI.YAPI.UNAUTHORIZED)
            {
                console.log("Access to hub " + url + " is denied, waiting for YV callback to save the situation.");
                this.FileSystemAccessDenied = true;
                return;
            }
            throw "YV4F ERROR: Unable to register Hub " + this.info.get_hubUrl() + "(" + (e as Error).message + "), save will not work.";

        }
        let fs: YoctoAPI.YFiles | null = YoctoAPI.YFiles.FirstFiles();
        if (fs == null)
        {
            this.fileSystemReady = true;
            throw "YV4F ERROR: No file system found on Hub " + this.info.get_hubUrl() + ", save will not work.";
        }
        // first search by serial number
        while (fs != null)
        {
            if (await fs.get_serialNumber() == this.info.serial)
            {
                await this.registerSourceFileSystem(fs)
                return;
            }
            fs = fs.nextFiles();
        }
        // serial not matched, fallback to search by URL
        fs = YoctoAPI.YFiles.FirstFiles();
        while (fs != null)
        {
            let m: YoctoAPI.YModule = await fs.get_module();
            let url = await m.get_url();
            console.log("URL = (" + url + ")")
            let p: number = url.indexOf("://");
            if (p >= 0) url = url.slice(p + 3);
            p = url.indexOf(":");
            if (p > 0) url = url.slice(0, p);
            {
                if (url == this.info.addr)
                {
                    await this.registerSourceFileSystem(fs)
                    return;
                }
            }
            fs = fs.nextFiles();
        }
        this.fileSystemReady = true;
        throw "YV4F ERROR: No file system matching Hub " + this.info.get_hubUrl() + " found, save will not work.";
    }

    private async registerSourceFileSystem(fs: YoctoAPI.YFiles)
    {
        this.fileSystem = fs
        this.fileSystemReady = true;
        this.FileSystemAccessDenied = false;
        let entries: YoctoAPI.YFileRecord[] = await this.fileSystem.get_list(this.filename);
        if (entries.length > 0) this.configFileCRC = await entries[0].get_crc();
        //console.log("Origin file system is  " + await this.fileSystem.get_friendlyName() + " config File=" + this.filename + " CRC=" + this.configFileCRC.toString(16));

    }

    // called from Yocto-visualization when a Module had a config change and
    // will find out if the config change source is the web page host and if
    // the original file has changed. This is called from a string of callbacks
    // because there can be only one change call back per module, and it is
    // already used by the Sensor manager
    private async configChangeCallback(m: YoctoAPI.YModule): Promise<string | null>
    {
        //console.log("Config change on " + await m.get_serialNumber());
        if (this.fileSystem == null)
        {  // if hub is password protected then we couldn't access the filesystem,but
            // since a configchange is triggered on the hub arrival in Yocto-Visualisation
            // and this callback is forwarded to us, we get a second chance to get it right.
            let urlSignature = this.info.addr + ":" + this.info.port.toString() + "/"+this.info.path+(this.info.path!=""?"/":"");
            let sourceUrl = await m.get_url();
            console.log('urlSignature=' + urlSignature);
            console.log('sourceUrl=' + sourceUrl);
            if ((sourceUrl.length > urlSignature.length) && (sourceUrl.substring(sourceUrl.length - urlSignature.length) == urlSignature))
            {
                let fs: YoctoAPI.YFiles | null = YoctoAPI.YFiles.FindFiles(await m.get_serialNumber() + ".files");
                if (await fs.isOnline()) await this.registerSourceFileSystem(fs)
            }
        }
        if (this.fileSystem == null) return null;
        if ((await this.fileSystem.get_serialNumber()) != (await m.get_serialNumber())) return null;
        let entries: YoctoAPI.YFileRecord[] = await this.fileSystem.get_list(this.filename);
        if (entries.length <= 0) return null;
        if (this.configFileCRC == await entries[0].get_crc()) return null;

        let data: Uint8Array = await this.fileSystem.download(this.filename);
        let file = new TextDecoder("utf-8").decode(data);
        let indexStart: number = file.indexOf(YoctoHubFileHandler.signatureStart);
        if (indexStart < 0) return null;
        this.configFileCRC = await entries[0].get_crc();
        indexStart += YoctoHubFileHandler.signatureStart.length;
        let indexEnd: number = file.indexOf(YoctoHubFileHandler.signatureEnd);
        if (indexEnd < indexStart) return ''; // empty configuration
        indexEnd += YoctoHubFileHandler.signatureEnd.length - 2;
        let configdata: string = file.substring(indexStart, indexEnd);
        try
        { return JSON.parse(configdata); }
        catch (e)
        {}
        return null;
    }

    public get configChangeCallbackFct(): ConfigChangeHandler
    {
        return async (module: YoctoAPI.YModule): Promise<string | null> => {return await this.configChangeCallback(module)};
    }

    public get saveFct(): XMLConfigSaveFunction
    {
        return async (xml: string, callback? :XMLConfigSaveFunctionCompleted): Promise<boolean> =>
        {
            return await this.saveFctinternal(xml,callback);

        }
    }

    private async  retryWithNewCredentials(xml :string, username:string , password:string,callback? :XMLConfigSaveFunctionCompleted)
        {
            if (this.fileSystem == null) {debugger; return} // not supposed to happen
           let m: YoctoAPI.YModule | null= await this.fileSystem.get_module();
           let url : string = await m.get_url();
           let err: YoctoAPI.YErrorMsg = new YoctoAPI.YErrorMsg();
           let p1 :number = url.indexOf("://");
           let p2 :number = url.indexOf("@",p1+3);
           let newurl :string  = url.substring(0,p1+3)+username+":"+password+"@" ;
           if (p2<0)   newurl+=url.substring(p1+3)
                 else  newurl+=url.substring(p2+1)
           await YoctoAPI.YAPI.UnregisterHub(url);
           if (await YoctoAPI.YAPI.RegisterHub(newurl,err) != YoctoAPI.YAPI.SUCCESS)
             {  await YoctoAPI.YAPI.RegisterHub(url,err)  // retore previous
             }
           try { if (!await this.saveFctinternal(xml,callback)) return; }
           catch (e) { if (callback!=null) callback(false,"Save failed ("+(e as Error).message)+")"; return }

        }

    public async saveFctinternal(xml: string, callback? :XMLConfigSaveFunctionCompleted): Promise<boolean>
    {
        if (this.FileSystemAccessDenied)
        { throw ("YV4F ERROR: Access to file system on " + this.info.get_hubUrl() + " is denied, it is probably password protected. Check network connections in the global configuration."); }

        if (this.fileSystem == null)
        { throw ("YV4F ERROR: No file system, Save aborted"); }

        if (!this.fileSystemReady)
        { throw ("YV4F ERROR: File system is not ready yet, retry in a few seconds."); }

        if (!this.fileSystem.isOnline())
        { throw ("YV4F ERROR: File system is off line, Save aborted"); }

        let tosave: string = "";
        let index: number = this.htmlSrcCode.indexOf(YoctoHubFileHandler.signatureStart + ")")
        if (index > 0)
        {
            tosave = this.htmlSrcCode.substring(0, index + YoctoHubFileHandler.signatureStart.length) + JSON.stringify(xml) + this.htmlSrcCode.substring(index + YoctoHubFileHandler.signatureStart.length);
        }
        else
        {
            let index1: number = this.htmlSrcCode.indexOf(YoctoHubFileHandler.signatureStart)
            let index2: number = this.htmlSrcCode.indexOf(YoctoHubFileHandler.signatureEnd)
            //console.log("indexes = " + index1.toString() + " " + index2.toString())
            if ((index1 > 0) && (index2) && (index2 > index1))
            {
                tosave = this.htmlSrcCode.substring(0, index1 + YoctoHubFileHandler.signatureStart.length) + JSON.stringify(xml) + ");" + this.htmlSrcCode.substring(index2 + YoctoHubFileHandler.signatureEnd.length);
            }
            else
            {
                throw("Unable to locate YoctoHubFileHandler constructor call in original HTML file.");
            }
        }
        tosave = "<!DOCTYPE html>\n" + tosave;

        let GZdata: Uint8Array = <Uint8Array>Pako.Pako_Deflate.gzip(tosave, {level: 9})
        let askForRwCredentials=false;
        try  { await this.fileSystem.upload(this.filename + ".gz", GZdata);}
        catch (e)
          {
               if (this.fileSystem.get_errorType() ==  YoctoAPI.YAPI_UNAUTHORIZED) askForRwCredentials=true;
              else throw (e);
          }
        if (askForRwCredentials)
        {
            let m: YoctoAPI.YModule = await this.fileSystem.get_module();
            let url : string = await m.get_url();
            let err: YoctoAPI.YErrorMsg = new YoctoAPI.YErrorMsg();
            let p1 :number = url.indexOf("://");
            let p2 :number = url.indexOf("@",p1+3);
            if (p2>=0) url=url.substring(p2+1); else if (p1>=0)  url=url.substring(p1+3);
            await YoctoVisualization.CredentialsPrompt.show( url,async()=>{await this.retryWithNewCredentials(xml,YoctoVisualization.CredentialsPrompt.username,YoctoVisualization.CredentialsPrompt.password,callback)})
            if (callback!=null)  callback(false,"Save failed, credentials required");
            return false;
        }

        let entries: YoctoAPI.YFileRecord[] = await this.fileSystem.get_list(this.filename);
        if (entries.length > 0) this.configFileCRC = await entries[0].get_crc();

        if (callback!=null)  callback(true,"Save sucessfull");

        return true;
    }
    //#endif

}

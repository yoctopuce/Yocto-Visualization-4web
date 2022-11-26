"use strict";
/*
*   Yocto-Visualization (for web), a free web-based application
*   to visualize Yoctopuce Sensors.
*
*  Properties editor
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
//
//class EditedDataSource
//{
//    private _source: object;
//    private _root: YoctoVisualization.UIElement;
//    private _htmlchilds: ChildNode[] = [];
//
//    constructor(source: object, root: YoctoVisualization.UIElement)
//    {
//        this._source = source;
//        this._root = root;
//        this._htmlchilds = [];
//
//    }
//
//    public storeChilds(childsList: NodeListOf<ChildNode>)
//    {
//        this._htmlchilds = [];
//        for (let i: number = 0; i < childsList.length; i++)
//        {
//            this._htmlchilds.push(childsList.item(i));
//        }
//    }
//
//    public getStoredChilds(): ChildNode[] { return this._htmlchilds }
//
//    public get root(): YoctoVisualization.UIElement {return this._root; }
//
//    public refresh(): void
//    {
//        if (this._root != null) this._root.refresh();
//    }
//}
//
//class keyDataObject
//{
//    public key: object;
//    public data: object;
//    constructor(key: object, data: object)
//    {
//        this.key = key;
//        this.data = data;
//    }
//}
//
//class objectDictionnary
//{
//    private list: any[] = [];
//
//    public isInlist(key: any): boolean
//    {
//        for (let i: number = 0; i < this.list.length; i++)
//        {
//            if (key == this.list[i].key) return true;
//        }
//        return false;
//    }
//
//    public find(key: any): any
//    {
//        for (let i: number = 0; i < this.list.length; i++)
//        {
//            if (key == this.list[i].key) return this.list[i].data;
//        }
//        return null;
//    }
//
//    public insert(key: any, data: any)
//    {
//        for (let i: number = 0; i < this.list.length; i++)
//        {
//            if (key == this.list[i].key)
//            {
//                this.list[i].data = data;
//                return;
//            }
//        }
//        this.list.push(new keyDataObject(key, data));
//    }
//}
//
//export class EditorBaseDef
//// little trick to make the editor object compatible with UIElement tree root node,
//// this is just meant to make the compiler happy: all members will be overridden anyway
//{
//    protected refresh(): void {}
//    protected get panel(): HTMLDivElement | null { return null}
//    public get expanded(): boolean {return true};
//    protected AllocateControls(): void {}
//}
//
//export interface EditorWasClosedCallback {(): void;}
//
//export class PropertiesForm2 extends EditorBaseDef
//{
//
//    private static readonly HelpHeight: number = Math.round(75 * YoctoVisualization.constants.generalSizeCoef);
//    private static readonly MinHeightforShowingHelp: number = 175
//
//    private _hostWindow: YoctoVisualization.YWidget | null = null;
//    private _window: YoctoVisualization.YWindow;
//    private _helpPanel: HTMLDivElement;
//
//    private _container: HTMLDivElement;
//    private _editorClosedCallback: EditorWasClosedCallback | null = null;
//
//    private EditedDataSourceList: objectDictionnary;
//    private currentEditedDataSource: EditedDataSource | null = null;
//
//    private _changeCallback: YoctoVisualization.SetValueCallBack2 | null = null;
//    private _getvalueCallback: YoctoVisualization.GetValueCallBack2 | null = null;
//
//    public get visible(): boolean {return this._window.visible}
//    public set visible(v: boolean)
//    {
//        v ? this.show() : this.hide()
//
//    }
//
//    private _text = "Properties editor";
//    public get text(): string { return this._text}
//    public set text(value: string)
//    {
//        this._text = value;
//        this._window.title = this._text;
//    }
//
//    private _helpText = "Properties editor";
//    public get help(): string { return this._helpText}
//    public set help(value: string)
//    {
//        this._helpText = value;
//        this._helpPanel.innerHTML = this._helpText;
//    }
//
//    static testid: number = 0;
//    public addTest(parentDiv: HTMLDivElement)
//    {
//        PropertiesForm2.testid++;
//        let mainlabel = document.createElement("DIV") as HTMLDivElement;
//
//        mainlabel.style.position = "relative";
//        mainlabel.style.display = "inline-block;"
//        mainlabel.style.left = "0px"
//        mainlabel.style.padding = "2px 2px 2px 2px"
//        mainlabel.style.right = "5px"
//        mainlabel.style.border = "1px solid black"
//        mainlabel.style.marginTop = "2px"
//        mainlabel.style.backgroundColor = "yellow"
//
//        if (parentDiv != null)
//        {
//            parentDiv.appendChild(mainlabel);
//        }
//        else
//        {
//            this._container.appendChild(mainlabel);
//        }
//        let expandCtrl = document.createElement("ANCHOR") as HTMLAnchorElement;
//        expandCtrl.innerText = "[+]"
//        mainlabel.appendChild(expandCtrl)
//
//        let mainText = document.createElement("SPAN") as HTMLSpanElement;
//        mainText.innerText = "Pouet " + PropertiesForm2.testid.toString();
//        mainlabel.appendChild(mainText)
//
//        let subElementPanel = document.createElement("DIV") as HTMLDivElement;
//        subElementPanel.style.position = "relative";
//        subElementPanel.style.display = "inline-block;"
//        subElementPanel.style.left = "5px"
//        subElementPanel.style.padding = "2px 2px 2px 2px"
//        subElementPanel.style.right = "5px"
//
//        subElementPanel.style.marginTop = "2px"
//        subElementPanel.style.backgroundColor = "lightgray"
//        subElementPanel.innerText = "sub elements"
//
//        if (parentDiv != null)
//        {
//            parentDiv.appendChild(subElementPanel);
//        }
//        else
//        {
//            this._container.appendChild(subElementPanel);
//        }
//
//        return subElementPanel
//    }
//
//    private editorIsClosing(source: YoctoVisualization.YWindow)
//    {
//        if (this._editorClosedCallback != null) this._editorClosedCallback();
//    }
//
//    private bestWidth(): number
//    {
//        let w: number = ((window.innerWidth / 4) >> 0);
//        let minWidth: number = 275 * YoctoVisualization.constants.guiDPIFactor;
//        if (w < minWidth) w = minWidth;
//        if (w > window.innerWidth - 10) (w = window.innerWidth - 10)
//        return w;
//
//    }
//    constructor()
//    {
//        super()
//        this.EditedDataSourceList = new objectDictionnary()
//
//        let params: YoctoVisualization.newWindowParam = new YoctoVisualization.newWindowParam();
//        params.positionType = YoctoVisualization.WindowPositionType.SIDEANCHORED
//        params.width = this.bestWidth();
//        params.createNow = true;
//        params.closingCallBack = (source: YoctoVisualization.YWindow) => {this.editorIsClosing(source);}
//        params.bottomKeepClear = PropertiesForm2.HelpHeight + 3 * YoctoVisualization.constants.WindowPadding;
//        params.title = this._text;
//
//        this._window = new YoctoVisualization.YWindow(params)
//        this._container = this._window.innerContentDiv;
//
//        this._helpPanel = document.createElement("DIV") as HTMLDivElement;
//        this._helpPanel.style.position = "absolute";
//        this._helpPanel.style.left = YoctoVisualization.constants.WindowPadding.toString() + "px";
//        this._helpPanel.style.bottom = YoctoVisualization.constants.WindowPadding.toString() + "px";
//        this._helpPanel.style.right = YoctoVisualization.constants.WindowPadding.toString() + "px";
//        this._helpPanel.style.height = PropertiesForm2.HelpHeight.toString() + "px";
//        this._helpPanel.style.paddingLeft = "5px"
//        this._helpPanel.style.paddingTop = "5px"
//        this._helpPanel.style.overflowY = "auto"
//        this._helpPanel.style.border = YoctoVisualization.constants.WindowInnerBorder;
//        this._helpPanel.style.backgroundColor = YoctoVisualization.constants.WindowInnerBackgroundColor;
//        this._helpPanel.style.fontFamily = YoctoVisualization.constants.generalFontFamily;
//        this._helpPanel.style.fontSize = YoctoVisualization.constants.generalFontSize.toString() + "px";
//        this._helpPanel.style.color = "black";
//        this._helpPanel.style.display = "";
//        this._helpPanel.innerHTML = "Help panel. Editor is loading, please wait...."
//        this._window.outterContentDiv.appendChild(this._helpPanel);
//
//        this._container.style.overflowY = "scroll"
//        this._container.style.overflowX = "hidden"
//        this._container.style.backgroundColor = YoctoVisualization.constants.WindowInnerBackgroundColor;
//
//        window.addEventListener("resize", () => {this.windowResized()})
//
//    }
//
//    private windowResized()
//    {
//        if (this._window.innerContentDiv == null) return;
//
//        if ((this._window.innerContentDiv.offsetHeight < PropertiesForm2.MinHeightforShowingHelp) && (this._helpPanel.style.display == ""))
//        {
//            this._helpPanel.style.display = "none";
//            this._window.bottomKeepClear = 0;
//        }
//        else if ((this._window.innerContentDiv.offsetHeight >= PropertiesForm2.MinHeightforShowingHelp + PropertiesForm2.HelpHeight) && (this._helpPanel.style.display != ""))
//        {
//            this._helpPanel.style.display = "";
//            this._window.bottomKeepClear = PropertiesForm2.HelpHeight;
//        }
//
//    }
//
//    public show()
//    {
//        this._window.show(this.bestWidth());
//        this.windowResized();
//    }
//    public hide()
//    {
//        YoctoVisualization.YWidget.stopEdition();
//        this._window.hide();
//    }
//
//    public get panel(): HTMLDivElement {return this._container;}
//
//    public refresh(): void
//    {
//        if (!this.visible) return;
//
//        if (this.currentEditedDataSource == null) return;
//        this.currentEditedDataSource.refresh();
//    }
//
//    public refreshBanner()
//    {
//        if (this._hostWindow != null)
//        {
//            this.text = "Properties of " + this._hostWindow.Text;
//        }
//    }
//
//    public showWindow(hostWindow: YoctoVisualization.YWidget,
//                      structData: object,
//                      setvalueCallBack: YoctoVisualization.SetValueCallBack2,
//                      getvalueCallBack: YoctoVisualization.GetValueCallBack2,
//                      EditStoppedCallBack: EditorWasClosedCallback)
//    {
//        this._hostWindow = hostWindow;
//        this._changeCallback = setvalueCallBack;
//        this._getvalueCallback = getvalueCallBack;
//        this.text = "Properties editor";
//        this.show();
//        this.refreshBanner()
//        this.EditObject(structData, setvalueCallBack, getvalueCallBack, EditStoppedCallBack);
//
//    }
//
//    public EditObject(structData: object, setvalueCallBack: YoctoVisualization.SetValueCallBack2, getvalueCallBack: YoctoVisualization.GetValueCallBack2, EditStoppedCallBack: EditorWasClosedCallback): void
//    {
//        this._editorClosedCallback = EditStoppedCallBack;
//        let helpYourselfMsg: string = "This is the property editor. Change any parameter you want. All changes are applied in real time.";
//        if (!this.visible) return;
//        this.help = "Please wait....";
//
//        if (this.EditedDataSourceList.isInlist(structData))
//        {
//            if (this.EditedDataSourceList.find(structData) == this.currentEditedDataSource)
//            {
//                this.help = helpYourselfMsg;
//                return;
//            }
//        }
//
//        if (this.currentEditedDataSource != null)
//        {
//            this.currentEditedDataSource.root.stopEdit();
//            this.currentEditedDataSource.storeChilds(this._container.childNodes)
//            while (this._container.firstChild)
//            {
//                this._container.removeChild(<Node>this._container.lastChild);
//            }
//        }
//
//        let it: YoctoVisualization.UIElement;
//
//        if (!this.EditedDataSourceList.isInlist(structData))
//        {
//            let rootparam: YoctoVisualization.UIElementBaseParams = new YoctoVisualization.UIElementBaseParams(this._helpPanel, this, null, "root", "Root", "root node", "");
//            it = new YoctoVisualization.UIElement(rootparam);
//            it.rootEditor = this;
//            this.currentEditedDataSource = new EditedDataSource(structData, it);
//            this.EditedDataSourceList.insert(structData, this.currentEditedDataSource);
//            it.showLabel = false;
//            it.expandable = true;
//            it.ProcessNewType(structData);
//            it.expanded = true;
//
//        }
//        else
//        {
//            this.currentEditedDataSource = this.EditedDataSourceList.find(structData) as EditedDataSource;
//            let childNodes: ChildNode[] = this.currentEditedDataSource.getStoredChilds();
//            for (let i: number = 0; i < childNodes.length; i++)
//            {
//                (this._container.appendChild(childNodes[i]));
//            }
//            this.currentEditedDataSource.refresh();
//        }
//
//        this.currentEditedDataSource.root.startEdit(setvalueCallBack, getvalueCallBack);
//        this.currentEditedDataSource.root.resizeAll();
//        this.help = helpYourselfMsg;
//
//    }
//
//    public getConfigData(): string
//    {
//        let p: DOMRect = this._window.outterContentDiv.getBoundingClientRect();
//        return "<PropertiesForm>\n"
//            + "<location x='" + p.left.toString() + "' y='" + p.top.toString() + "'/>\n"
//            + "<size     w='" + p.width.toString() + "' h='" + p.width.toString() + "'/>\n"
//            + "</PropertiesForm>\n";
//    }
//
//    private Form1_SizeChanged(sender: object): void
//    {
//        if (this.currentEditedDataSource == null) return;
//        if (this.currentEditedDataSource.root != null) this.currentEditedDataSource.root.resizeAll();
//    }
//    private valuechange(src: YoctoVisualization.UIElement): void
//    {
//        let OriginalPropName: string = "";
//        let fullpropname: string = "";
//        let propType: string = "";
//        if (this._changeCallback != null) this._changeCallback(src);
//    }
//
//}
//
////#endif

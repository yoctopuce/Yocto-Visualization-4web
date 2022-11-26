"use strict";
/*
*   Yocto-Visualization (for web), a free web-based application
*   to visualize Yoctopuce Sensors.
*
*   all sub-UI to edit properties within the properties editor
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
//export interface SetValueCallBack2 {(src: UIElement): void}
//
//export interface GetValueCallBack2 {(src: UIElement): object}
//
//export interface GetSummaryCallBack {(): string;}
//
//export interface refreshUIElementListCallback {(): any[];}
//
//export class UIElementBaseParams
//{
//    // public  parentPanel :  HTMLDivElement;
//    public HelpZoneLabel: HTMLDivElement;
//    public parentNode: YoctoVisualization.EditorBaseDef;
//
//    public RootNode: UIElement | null;
//    public internalname: string;
//    public label: string;
//    public description: string;
//
//    public changeCausesParentRefresh: boolean;
//    public preExpanded: boolean;
//    public expandable: boolean = false;
//    public isReadonlyCall: string = "";
//
//    // public GetSummaryCallBack summaryCallback = null;
//    public summary: YoctoVisualization.PropertyDescriptor | null = null;
//    public structRoot: any = null;
//
//    public constructor(
//        p_descriptionLabel: HTMLDivElement, p_parentNode: YoctoVisualization.EditorBaseDef, p_RootNode: UIElement | null,
//        p_internalname: string, p_label: string, p_description: string, p_isReadonlyCall: string)
//    {
//
//        this.HelpZoneLabel = p_descriptionLabel;
//        this.parentNode = p_parentNode;
//        this.RootNode = p_RootNode;
//        this.internalname = p_internalname;
//        this.label = p_label;
//        this.description = p_description;
//        this.changeCausesParentRefresh = false;
//        this.preExpanded = false;
//        this.isReadonlyCall = p_isReadonlyCall;
//    }
//
//}
//
//export class PropPathinfo
//{
//    public OriginalPropName: string = "";
//    public fullpropname: string = "";
//    public propType: string = "";
//}
//
//class CustomAttributesExtractor
//{
//    public available: boolean = true;
//    public displayName: string = "unknown";
//    public category: string = "";
//    public displayDescription: string = "Not documented";
//    public prefinedValues: any[] | null = null;
//    public changeCausesParentRefresh: boolean = false;
//    public PreExpandedCategory: boolean = false;
//    public PreExpanded: boolean = false;
//    public summaryPropertyName: string = "";
//    public isReadOnlyCall: string = "";
//    public NotSavedInXML: boolean = false;
//    public ReadOnly: boolean = false;
//    public ParamCategorySummary: string = "";
//
//    public constructor(ps: YoctoVisualization.PropertyDescriptor)
//    {
//        if ("OnlyAvailableon" in ps.Attributes) this.available = ps.Attributes["OnlyAvailableon"];
//        if ("DisplayName" in ps.Attributes) this.displayName = ps.Attributes["DisplayName"];
//        if ("CategoryAttribute" in ps.Attributes) this.category = ps.Attributes["CategoryAttribute"];
//        if ("DescriptionAttribute" in ps.Attributes) this.displayDescription = ps.Attributes["DescriptionAttribute"];
//        if ("AllowedValues" in ps.Attributes) this.prefinedValues = ps.Attributes["AllowedValues"];
//        if ("ChangeCausesParentRefreshAttribute" in ps.Attributes) this.changeCausesParentRefresh = ps.Attributes["ChangeCausesParentRefreshAttribute"];
//        if ("PreExpandedCategoryAttribute" in ps.Attributes) this.PreExpandedCategory = ps.Attributes["PreExpandedCategoryAttribute"];
//        if ("PreExpandedAttribute" in ps.Attributes) this.PreExpanded = ps.Attributes["PreExpandedAttribute"];
//        if ("ParamCategorySummaryAttribute" in ps.Attributes) this.summaryPropertyName = ps.Attributes["ParamCategorySummaryAttribute"];
//        if ("IsReadonlyCallAttribute" in ps.Attributes) this.isReadOnlyCall = ps.Attributes["IsReadonlyCallAttribute"];
//        if ("NotSavedInXMLAttribute" in ps.Attributes) this.NotSavedInXML = ps.Attributes["NotSavedInXMLAttribute"];
//        if ("ReadOnlyAttribute " in ps.Attributes) this.ReadOnly = ps.Attributes["ReadOnlyAttribute "];
//        if ("ParamCategorySummaryAttribute " in ps.Attributes) this.ParamCategorySummary = ps.Attributes["ParamCategorySummaryAttribute "];
//
//    }
//
//}
//
//const enum ExpandButtonside { LEFT, RIGHT }
//
//export class UIElement extends YoctoVisualization.EditorBaseDef
//{
//
//    static readonly defaultFontFamily: string = YoctoVisualization.constants.generalFontFamily;
//    static readonly defaultFontSize: number = YoctoVisualization.constants.generalFontSize;
//
//    protected static readonly ARTIFICIALSECTIONNAME: string = "-ignore-";
//
//    public name: string = "NoName";
//    protected _targetFullName: string = "unknowTargetName";
//    protected static baseheight: number = 0;
//    protected static indentation: number = 16;
//    protected static expandableShift: number = 0;
//    protected static scrollBarWidth: number = 0;
//    protected static expandableVerticalOffset: number = 2;
//
//    protected ExpandableDepth: number = 0;
//
//    protected _expanded: boolean = false;
//    protected _expandButtonSide: ExpandButtonside = ExpandButtonside.LEFT;
//
//    protected _rootEditor: YoctoVisualization.PropertiesForm2 | null = null;
//    protected _helpZoneLabel: HTMLDivElement;
//    protected _description: string = "";
//
//    protected expandCtrl: HTMLAnchorElement | null = null;
//    protected mainlabel: HTMLDivElement | null = null;
//    protected mainText: HTMLSpanElement | null = null;
//    protected subElementPanel: HTMLDivElement | null = null;
//
//    protected _rootNode: UIElement | null = null;
//    protected _parentNode: YoctoVisualization.EditorBaseDef | null = null;
//    protected _parentPanel: HTMLDivElement | null = null;
//    protected _changeCausesParentRefresh: boolean = false;
//
//    protected _summaryProperty: YoctoVisualization.PropertyDescriptor | null;
//    protected _isReadOnlyCall: string = "";
//    protected _controlsAllocated: boolean = false;
//
//    protected expandButtonInitDone: boolean = false;
//    protected mainLabelInitDone: boolean = false;
//    protected subElements: UIElement[] = [];
//    protected _structRoot: object;
//
//    protected _valueChangeCallback: SetValueCallBack2 | null = null;
//    protected _getValueCallback: GetValueCallBack2 | null = null;
//    protected _shown: boolean = true;
//
//    protected get parentNode(): UIElement { return this._parentNode as UIElement; }
//    protected get targetFullName(): string { return this._targetFullName; }
//    protected _summaryCallback: GetSummaryCallBack | null = null;
//
//    protected get expandIcon(): string { return YoctoVisualization.ressources.ExpandIcon(UIElement.defaultFontSize.toString(), false, false, false, false, "Click to expand");}
//    protected get colapseIcon(): string { return YoctoVisualization.ressources.ColapseIcon(UIElement.defaultFontSize.toString(), false, false, false, false, "Click to colapse");}
//
//    public removeFromEditor(): void
//    {
//    }
//
//    public get panel(): HTMLDivElement {return <HTMLDivElement>this.subElementPanel}
//
//    public get editorHelpText(): string {return ""; }
//    public get isRootElement(): boolean {return this._rootNode == this;}
//
//    public addToEditor(): void
//    {
//        if (this.mainlabel != null)
//        {
//            for (let i = 0; i < (<HTMLDivElement>this._parentPanel).children.length; i++)
//            {
//                if ((<HTMLDivElement>this._parentPanel).children[i] == this.mainlabel) return;
//            }
//            (<HTMLDivElement>this._parentPanel).appendChild(this.mainlabel);
//            (<HTMLDivElement>this._parentPanel).appendChild(<HTMLDivElement>this.subElementPanel);
//        }
//
//        //if ((expandCtrl != null) && (!_parentPanel.Controls.Contains(expandCtrl))) _parentPanel.Controls.Add(expandCtrl);
//
//    }
//
//    public refresh(): void
//    {
//        if (this.mainText != null) this.mainText.innerText = this.name + this.getSummary();
//        for (let i: number = 0; i < this.subElements.length; i++)
//        {
//            this.subElements[i].refresh();
//        }
//        if ((this._rootNode != null) && (this._rootNode.rootEditor != null)) this._rootNode.rootEditor.refreshBanner();
//    }
//
//    public tabReOrder(index: number): number
//    {
//        if ((this._expandable) && (this.expandCtrl != null)) this.expandCtrl.tabIndex = index++;
//        this.subElements.forEach((e: UIElement) => {index = e.tabReOrder(index)})
//        return index;
//    }
//
//    public triggerValueChangeCallback(): void
//    {
//        if (this._valueChangeCallback != null) this._valueChangeCallback(this);
//    }
//
//    private scrollToMakeVisible(): void
//    {
//        if (this.mainlabel == null) return;
//        if (this._parentPanel == null) return;
//        this.mainlabel.scrollIntoView();
//
//    }
//
//    public control_GotFocus(sender: object): void
//    {
//        let extraHelp: string = this.editorHelpText;
//        if (extraHelp != "") extraHelp = " " + extraHelp;
//        this._helpZoneLabel.innerHTML = this._description + extraHelp;
//        // this.scrollToMakeVisible();
//    }
//
//    protected control_LostFocus(sender: object)
//    {
//        this._helpZoneLabel.innerHTML = "";
//    }
//
//    protected preExpandIfNeeded(): void
//    {
//        if ((this._parentNode != null) && (this._parentNode.expanded))
//        {
//            this.AllocateControls();
//            if (this.expandable) this.initExpandButton();
//            this.initMainLabel();
//        }
//        this.initExpandButton();
//
//    }
//
//    constructor(p: UIElementBaseParams)
//    {
//        super();
//        this.name = p.label;
//        this._targetFullName = p.internalname;
//        this._helpZoneLabel = p.HelpZoneLabel;
//        this._description = p.description;
//        this._changeCausesParentRefresh = p.changeCausesParentRefresh;
//        this._expandable = p.expandable;
//        this._preExpanded = p.preExpanded;
//        this._structRoot = p.structRoot;
//        this._isReadOnlyCall = p.isReadonlyCall;
//        this._summaryProperty = p.summary;
//
//        if (UIElement.baseheight == 0)
//        {
//            UIElement.baseheight = 12;  // hardcoded for now, might need to compute it dynamically in the future
//            UIElement.expandableShift = UIElement.baseheight + 2;
//            UIElement.scrollBarWidth = 20;
//
//        }
//
//        //this._availableWidth = p.parentPanel.clientWidth;
//        // this._parentPanel    = p.parentPanel;
//        this._parentNode = p.parentNode;
//        this._rootNode = p.RootNode == null ? this : p.RootNode;
//
//    }
//
//    public set rootEditor(value: YoctoVisualization.PropertiesForm2 | null)
//    {
//        this._rootEditor = value;
//    }
//
//    public get rootEditor(): YoctoVisualization.PropertiesForm2 | null
//    {
//        return this._rootEditor;
//    }
//
//    protected initMainLabel(): void
//    {
//
//        if (this.mainlabel == null) return;
//        if (this.mainLabelInitDone) return;
//        this.ExpandableDepth = 0;
//
//        let p: UIElement = this;
//        while (p != null)
//        {
//            if (p.expandable) this.ExpandableDepth++;
//            p = p.parentNode;
//        }
//
//        (<HTMLSpanElement>this.mainText).innerText = this.name + this.getSummary();
//        if ((this.expandable) && (this._expandButtonSide == ExpandButtonside.LEFT))
//        {
//            switch (this.ExpandableDepth)
//            {
//            case 1:
//                this.mainlabel.style.backgroundColor = "Blue";
//                (<HTMLSpanElement>this.mainText).style.color = "black"
//                break;
//            case 2:
//                this.mainlabel.style.backgroundColor = "rgb(7,141,255)";
//                (<HTMLSpanElement>this.mainText).style.color = "white"
//                break;
//            case 3:
//                (<HTMLSpanElement>this.mainlabel).style.backgroundColor = "rgb(120,196,255)";
//                break;
//            case 4:
//                (<HTMLSpanElement>this.mainlabel).style.backgroundColor = "rgb(213,237,255)";
//                break;
//            case 5:
//                (<HTMLSpanElement>this.mainlabel).style.backgroundColor = "rgb(237,246,253)";
//                break;
//            default:
//                (<HTMLSpanElement>this.mainlabel).style.backgroundColor = "rgb(246,251,255)";
//                break;
//            }
//        }
//        else
//        {
//            (<HTMLSpanElement>this.mainlabel).style.backgroundColor = "rgba( 0, 0, 0,0)";
//        }
//
//        this.mainLabelInitDone = true;
//    }
//
//    public AllocateControls()
//    {
//        if (this._controlsAllocated) return;
//
//        if (!this.isRootElement) this.parentNode.AllocateControls();
//
//        this._parentPanel = this.parentNode.panel;
//
//        if (this.mainlabel == null)
//        {
//            this.mainlabel = document.createElement("DIV") as HTMLDivElement;
//            this.mainlabel.style.position = "relative";
//            this.mainlabel.style.display = "inline-block;"
//            this.mainlabel.style.left = "0px"
//            this.mainlabel.style.padding = "2px 2px 2px 2px"
//            this.mainlabel.style.overflow = "hidden";
//            this.mainlabel.style.fontFamily = UIElement.defaultFontFamily;
//            this.mainlabel.style.fontSize = UIElement.defaultFontSize.toString() + "px";
//
//            this.mainlabel.style.right = "5px"
//            this.mainlabel.style.whiteSpace = "nowrap";
//            this.mainlabel.style.marginTop = "2px"
//            this.mainlabel.style.backgroundColor = "yellow"
//            this.mainText = document.createElement("SPAN") as HTMLSpanElement;
//            this.mainText.innerText = "Pouet";
//            (<HTMLDivElement>this.mainlabel).appendChild(this.mainText)
//            this.mainlabel.style.display = this.isRootElement ? "none" : ""
//            this.initMainLabel();
//            if (this._parentPanel == null)
//            {
//                debugger
//            }
//
//            this._parentPanel.appendChild(this.mainlabel);
//
//        }
//
//        if ((this._expandable) && (this.expandCtrl == null))
//        {
//            this.expandCtrl = document.createElement("ANCHOR") as HTMLAnchorElement;
//            if (this._expandButtonSide == ExpandButtonside.LEFT)
//            {
//                this.mainlabel.insertBefore(this.expandCtrl, this.mainText)
//            }
//            this.initExpandButton();
//            this.subElementPanel = document.createElement("DIV") as HTMLDivElement;
//            this.subElementPanel.style.position = "relative";
//            this.subElementPanel.style.display = "inline-block;"
//            this.subElementPanel.style.left = this.isRootElement ? "0px" : "5px"
//            this.subElementPanel.style.padding = "2px 2px 2px 2px"
//            this.subElementPanel.style.right = "5px"
//            this.subElementPanel.style.display = "none"
//            this.subElementPanel.style.marginTop = "2px"
//            this.subElementPanel.style.marginRight = "2px"
//            this._parentPanel.appendChild(this.subElementPanel);
//
//        }
//        this._controlsAllocated = true;
//    }
//
//    protected initExpandButton()
//    {
//        if (this.expandCtrl == null) return;
//        if (this.expandButtonInitDone) return;
//
//        this.expandCtrl.innerHTML = this.expandIcon;
//        //this.expandCtrl.style.border="1px solid black"
//        this.expandCtrl.style.top = "0px";
//        this.expandCtrl.style.left = "0px";
//        this.expandCtrl.style.cursor = "pointer";
//        this.expandCtrl.style.backgroundColor = "white"
//        this.expandCtrl.style.marginRight = "3px"
//        this.expandCtrl.style.paddingLeft = "0px"
//        this.expandCtrl.style.paddingRight = "0px"
//        this.expandCtrl.style.paddingTop = "1px"
//        this.expandCtrl.style.marginTop = "0px"
//        this.expandCtrl.style.marginBottom = "0px"
//        this.expandCtrl.style.paddingBottom = "0px"
//        this.expandCtrl.style.paddingRight = "0px"
//        this.expandCtrl.addEventListener("click", () => {this.ToggleExpand()});
//        this.expandCtrl.addEventListener('keyup', (e) => { if ((e.key === "Enter") || (e.key === " ")) this.ToggleExpand()});
//        this.expandCtrl.addEventListener("focusin", () => {this.control_GotFocus(this);})
//        this.expandCtrl.addEventListener("focusout", () => {this.control_LostFocus(this);})
//        this.expandButtonInitDone = true;
//    }
//
//    public get rowHeight(): number { return UIElement.baseheight; }
//
//    public ExtractPropPath(info: PropPathinfo): string[]
//    {
//        let index: number = -1;
//        let path: string[] = [];
//        let p: UIElement = this;
//        info.OriginalPropName = p.targetFullName;
//        do
//        {
//            info.fullpropname = p.targetFullName;
//            index = info.fullpropname.indexOf("_");
//            if (index < 0)
//            {
//                if (info.fullpropname != UIElement.ARTIFICIALSECTIONNAME) path.splice(0, 0, info.fullpropname); // ignore artificial sections
//                p = p.parentNode;
//                if (p == null) throw "invalid Property name";
//            }
//
//        } while (index < 0)  ;
//
//        info.propType = info.fullpropname.substring(0, index);
//        let propname: string = info.fullpropname.substring(index + 1);
//        path.splice(0, 0, propname);
//        return path;
//
//    }
//
//    public startEdit(setcallback: SetValueCallBack2, getCallback: GetValueCallBack2): void
//    {
//        this.addToEditor();
//        this._valueChangeCallback = setcallback;
//        this._getValueCallback = getCallback;
//        this.subElements.forEach((item: UIElement) => { item.startEdit(setcallback, getCallback);})
//    }
//
//    public stopEdit(): void
//    {
//        this.removeFromEditor();
//        this._valueChangeCallback = null;
//        this._getValueCallback = null;
//        this.subElements.forEach((item: UIElement) => { item.stopEdit();})
//    }
//
//    protected expand(): void
//    {
//
//        this.subElements.forEach((e: UIElement) =>
//        {
//            e.AllocateControls();
//            e.show();
//        });
//        (<UIElement>this._rootNode).tabReOrder(0);
//        this._expanded = true;
//        (<HTMLDivElement>this.subElementPanel).style.display = "";
//        (<HTMLAnchorElement>this.expandCtrl).innerHTML = this.colapseIcon;
//
//    }
//    protected colapse(): void
//    {
//        //this.subElements.forEach((e: UIElement) => {e.hide(); });
//        (<HTMLDivElement>this.subElementPanel).style.display = "none";
//        (<HTMLAnchorElement>this.expandCtrl).innerHTML = this.expandIcon;
//    }
//
//    public get expanded(): boolean { return this._expanded;}
//    public set expanded(value: boolean)
//    {
//        this._expanded = value;
//
//        if (this._expanded)
//        {
//
//            this.expand();
//        }
//        else
//        {
//            this.colapse();
//        }
//        (<UIElement>this._rootNode).resizeAll();
//
//    }
//    public ToggleExpand()
//    {
//        this.expanded = !this.expanded;
//    }
//
//    public getSummary(): string
//    {
//        if (this._summaryProperty != null)
//        {
//            return " (" + Reflect.get(this._structRoot, this._summaryProperty.name) + ")";
//        }
//        return "";
//    }
//
//    public sensorList(): object[]
//    {
//        let res: object[] = [];
//        YoctoVisualization.sensorsManager.sensorList.forEach((s: YoctoVisualization.CustomYSensor) => {res.push(s)});
//        return res;
//    }
//
//    public ProcessNewType(dataStucture: any): void
//    {
//
//        let subsections: { [index: string]: UIElement } = {};
//
//        this._structRoot = dataStucture;
//        let toExpand: UIElement[] = [];
//        let properties: YoctoVisualization.PropertiesList = YoctoVisualization.GenericProperties.getAllProperties(dataStucture);
//
//        for (let i: number = 0; i < properties.byIndex.length; i++)
//        {
//            let ps: YoctoVisualization.PropertyDescriptor = properties.byIndex[i];
//            if (ps.isWritable)
//            {
//                let attr: CustomAttributesExtractor = new CustomAttributesExtractor(ps);
//                if (attr.available)
//                {
//                    let section: UIElement = this;
//                    if (attr.category != "")
//                    {
//                        if (attr.category in subsections)
//                        {
//                            section = subsections[attr.category];
//                        }
//                        else
//                        {
//                            let sectionparam: UIElementBaseParams = new UIElementBaseParams(this._helpZoneLabel, this, this._rootNode, UIElement.ARTIFICIALSECTIONNAME, attr.category, attr.category + " section, expand for more...", "");
//                            sectionparam.preExpanded = attr.PreExpandedCategory;
//                            sectionparam.expandable = true;
//                            sectionparam.structRoot = dataStucture;
//                            if (attr.summaryPropertyName != "")
//                            {
//                                sectionparam.summary = ps;
//                            }
//
//                            section = new UIElement(sectionparam);
//                            if (attr.PreExpandedCategory) toExpand.push(section);
//
//                            section.showLabel = true;
//                            subsections[attr.category] = section;
//                            this.addSubElement(section);
//                        }
//                    }
//
//                    let elParam: UIElementBaseParams = new UIElementBaseParams(this._helpZoneLabel, section, this._rootNode, ps.name, attr.displayName, attr.displayDescription, attr.isReadOnlyCall);
//                    elParam.preExpanded = attr.PreExpanded;
//                    elParam.changeCausesParentRefresh = attr.changeCausesParentRefresh;
//
//                    let targetName: string = this._targetFullName;
//                    let targetPrefix: string = "";
//
//                    let p: number = targetName.indexOf("_");
//                    if (p >= 0)
//                    {
//                        targetPrefix = targetName.substring(0, p);
//                        targetName = targetName.substring(p + 1);
//                    }
//
//                    if (ps.isEnum)
//                    {
//                        let s: UIElementEnum = new UIElementEnum(elParam, dataStucture, ps);
//                        section.addSubElement(s);
//                    }
//                    else
//                    {
//                        switch (ps.type)
//                        {
//                        case "number":
//                            if (attr.prefinedValues == null)
//                            {
//                                let n: UIElementNumber = new UIElementNumber(elParam, dataStucture, ps);
//                                section.addSubElement(n);
//                            }
//                            else
//                            {
//                                let s: UIElementList = new UIElementList(elParam, dataStucture, ps, () => {return <any[]>attr.prefinedValues});
//                                section.addSubElement(s);
//                            }
//                            break;
//                        case "boolean":
//                            let b: UIElementBoolean = new UIElementBoolean(elParam, dataStucture, ps);
//                            section.addSubElement(b);
//                            break;
//                        case YoctoVisualization.doubleNan.name  :
//                            let d: UIElementDoubleNan = new UIElementDoubleNan(elParam, dataStucture, ps);
//                            section.addSubElement(d);
//                            break;
//                        case YoctoVisualization.NullYSensor.name:
//                        case YoctoVisualization.CustomYSensor.name:
//                            let s: UIElementList = new UIElementList(elParam, dataStucture, ps, () => {return this.sensorList()});
//                            section.addSubElement(s);
//                            break;
//                        case YDataRendering.YColor.name:
//                            let c: UIElementColor = new UIElementColor(elParam, dataStucture, ps);
//                            section.addSubElement(c);
//                            break;
//                        case  YDataRendering.xAxisPosition.name:
//                            let p: UIElementMarkerPos = new UIElementMarkerPos(elParam, dataStucture, ps);
//                            section.addSubElement(p);
//                            break;
//                        case "string":
//
//                            if (attr.prefinedValues == null)
//                            {
//                                let s: UIElementString = new UIElementString(elParam, dataStucture, ps);
//                                section.addSubElement(s);
//                            }
//                            else
//                            {
//                                let s: UIElementList = new UIElementList(elParam, dataStucture, ps, () => {return <any[]>attr.prefinedValues;});
//                                section.addSubElement(s);
//                            }
//                            break;
//                        default:
//                        {
//                            elParam.expandable = true;
//                            elParam.preExpanded = attr.PreExpanded;
//                            let subobjectsection: UIElement = new UIElement(elParam);
//                            if (attr.PreExpanded) toExpand.push(subobjectsection);
//                            subobjectsection.showLabel = true;
//                            section.addSubElement(subobjectsection);
//
//                            subobjectsection.ProcessNewType(dataStucture[ps.name]);
//                        }
//                            break;
//                        }
//                    }
//
//                    //    watch1.Stop(); Console.WriteLine("creating sub node  " + displayName +" took "+ watch1.ElapsedMilliseconds.ToString() + " ms");
//                }
//            }
//            else
//            {
//                if (ps.name == "summary")
//                { this._summaryProperty = ps; }
//            }
//        }
//
//        if (this._summaryProperty != null) this.refresh();
//        toExpand.forEach((e: UIElement) => {e.expand();});
//    }
//
//    public show(): void
//    {
//        this._shown = true;
//        if (this.mainlabel != null) this.mainlabel.style.display = "";
//        if (this.expandCtrl != null) this.expandCtrl.style.display = this._expandable ? "" : "hidden";
//        if (this.expanded)
//        {
//            this.subElements.forEach((e: UIElement) => { e.show();});
//        }
//    }
//
//    public hide(): void
//    {
//        this._shown = false;
//        if (this.mainlabel != null) this.mainlabel.style.display = "hidden";
//        if (this.expandCtrl != null) this.expandCtrl.style.display = this._expandable ? "hidden" : "";
//        this.subElements.forEach((e: UIElement) => { e.hide();});
//    }
//
//    private ExpandCtrl_Click_expand(sender: object)
//    {
//        this.expanded = !this._expanded;
//    }
//
//    public resizeAll(): void
//    {
//        this.resize(0, 0, 0, 0);
//        if (this.expanded)
//        {
//            this.subElements.forEach((e: UIElement) => {e.resizeAll()});
//        }
//    }
//    protected _showLabel: boolean = false;
//    public get showLabel(): boolean { return this._showLabel; }
//    public set showLabel(value: boolean)
//    {
//        this._showLabel = value;
//        if (this.expandCtrl != null) this.expandCtrl.style.display = (value && this._expandable) ? "" : "hidden";
//    }
//
//    protected _expandable: boolean = false;
//    protected _preExpanded: boolean = false;
//
//    public get expandable(): boolean { return this._expandable; }
//    public set expandable(value: boolean)
//    {
//        this._expandable = value;
//        if (!value) return;
//
//        if (this.expandCtrl == null)
//        {
//            this.AllocateControls();
//            this.initExpandButton();
//        }
//
//        (<HTMLAnchorElement>this.expandCtrl).style.display = (value && this._showLabel) ? "" : "hidden";
//
//    }
//
//    public addSubElement(node: UIElement): void
//    {
//        this.subElements.push(node);
//    }
//
//    public computeHeight(): number
//    { // not sure if this is useful here since editor is auto sizing
//        return 0;
//    }
//
//    public resize(top: number, left1: number, left2: number, width: number): number
//    { // not sure if this is useful here since editor is auto sizing
//        return 0;
//    }
//
//}
//
//export class UIElementGeneric extends UIElement
//{
//    protected _dataContainer: object;
//    protected _prop: YoctoVisualization.PropertyDescriptor;
//    protected input: HTMLInputElement | null = null;
//    protected select: HTMLSelectElement | null = null;
//
//    constructor(p: UIElementBaseParams, dataContainer: object, prop: YoctoVisualization.PropertyDescriptor)
//    {
//        super(p);
//
//        this._prop = prop;
//        this._dataContainer = dataContainer;
//        this._showLabel = true;
//
//        if (this._preExpanded) this.AllocateControls();
//        if ((this._expandable) && (this._preExpanded)) this.expand();
//
//    }
//
//    public removeFromEditor(): void
//    {
//        super.removeFromEditor();
//        //if (this.input != null) this._parentPanel.Controls.Remove(input);
//
//    }
//
//    public tabReOrder(index: number): number
//    {
//
//        if (this.input != null) this.input.tabIndex = index++;
//
//        this.subElements.forEach((e: UIElement) => { index = e.tabReOrder(index); });
//        return index;
//    }
//
//    public addToEditor(): void
//    {
//        super.addToEditor();
//        // if (this.input != null) this._parentPanel.Controls.Add(input);
//    }
//
//    public show(): void
//    {
//        super.show();
//        if (this.input != null) this.input.style.visibility = "";
//    }
//
//    public checkForReadOnly()
//    {
//        if ((this.input == null) && (this.select == null)) return;
//
//        if (this._isReadOnlyCall != "")
//        {
//            let ro: boolean = Reflect.get(this._dataContainer, this._isReadOnlyCall) as boolean;
//
//            if (this.input != null) this.input.disabled = ro;
//            if (this.select != null) this.select.disabled = ro;
//
//        }
//
//    }
//
//    public hide(): void
//    {
//        if (this.input != null) this.input.style.visibility = "hidden";
//        super.hide();
//    }
//
//    public resize(top: number, left1: number, left2: number, width: number): number
//    {
//        return 0;
//
//    }
//
//}
//
///***
// ***  String
// ***/
//export class UIElementString extends UIElementGeneric
//{
//
//    constructor(p: UIElementBaseParams, dataContainer: object, prop: YoctoVisualization.PropertyDescriptor)
//    {
//        super(p, dataContainer, prop)
//        this.preExpandIfNeeded();
//    }
//
//    public AllocateControls(): void
//    {
//        super.AllocateControls();
//        if (this.input == null)
//        {
//            this.input = document.createElement("INPUT") as HTMLInputElement;
//            this.input.type = "input"
//            this.input.value = Reflect.get(this._dataContainer, this._prop.name);
//            this.input.style.position = "absolute";
//            this.input.style.marginTop = "0px";
//            this.input.style.marginBottom = "0px";
//            this.input.style.fontFamily = UIElement.defaultFontFamily;
//            this.input.style.fontSize = UIElement.defaultFontSize.toString() + "px";
//            this.input.style.border = "1px solid grey";
//            this.input.style.borderRadius = "1px";
//            this.input.style.top = "0px";
//            this.input.style.right = "3px";
//            this.input.style.width = "50%";
//            (<HTMLDivElement>this.mainlabel).appendChild(this.input)
//
//            //  this.input.addEventListener("keyup" , ()=>{this.Text_TextChanged(null);} )
//
//            new InputFieldManager(this.input, InputFieldManager.dataType.DATA_STRING, true, Number.NaN, Number.NaN, () => {this.Text_TextChanged(null);});
//
//            //new InputFieldManager(input, InputFieldManager.dataType.DATA_STRING, true, Double.NaN, Double.NaN, Text_TextChanged);
//            //((TextBox)input).BorderStyle = BorderStyle.None;
//            //this. _parentPanel.Controls.Add(input);
//            this.input.addEventListener("focusin", () => {this.control_GotFocus(this);})
//            this.input.addEventListener("focusout", () => {this.control_LostFocus(this);})
//            this.checkForReadOnly();
//
//        }
//
//    }
//
//    public refresh(): void
//    {
//        if (this.input == null) return;
//        if (this._getValueCallback == null) return;
//        let value: object = this._getValueCallback(this);
//        if (value == null) return;
//        let s: string = (value as String).toString();
//        if (this.input != null) if (s != this.input.value) this.input.value = s;
//        this.checkForReadOnly();
//    }
//
//    private Text_TextChanged(sender: any): void
//    {
//        if (this.input != null)
//        {
//            this._value = this.input.value;
//            Reflect.set(this._dataContainer, this._prop.name, this._value);
//            if (this._valueChangeCallback != null) this._valueChangeCallback(this);
//            if (this._changeCausesParentRefresh) this.parentNode.refresh();
//        }
//    }
//
//    protected _value: string = "";
//    public get value(): string { return this._value; }
//    public set value(value: string)
//    {
//        this._value = value;
//        (<HTMLInputElement>this.input).value = value;
//    }
//
//    public resize(top: number, left1: number, left2: number, width: number): number
//    {
//        (<HTMLDivElement>this.mainlabel).style.height = (<HTMLInputElement>this.input).offsetHeight.toString() + "px";
//        return 0;
//    }
//
//}
//
///***
// ***  Number
// ***/
//export class UIElementNumber extends UIElementGeneric
//{
//
//    constructor(p: UIElementBaseParams, dataContainer: object, prop: YoctoVisualization.PropertyDescriptor)
//    {
//        super(p, dataContainer, prop)
//        this.preExpandIfNeeded();
//    }
//
//    public AllocateControls(): void
//    {
//        super.AllocateControls();
//        if (this.input == null)
//        {
//            this.input = document.createElement("INPUT") as HTMLInputElement;
//            this.input.type = "input"
//            this.input.value = Reflect.get(this._dataContainer, this._prop.name);
//            this.input.style.textAlign = "right"
//            this.input.style.position = "absolute";
//            this.input.style.marginTop = "0px";
//            this.input.style.marginBottom = "0px";
//            this.input.style.fontFamily = UIElement.defaultFontFamily;
//            this.input.style.fontSize = UIElement.defaultFontSize.toString() + "px";
//            this.input.type = "number";
//            this.input.style.border = "1px solid grey";
//            this.input.style.borderRadius = "1px";
//            this.input.style.top = "0px";
//            this.input.style.right = "3px";
//            this.input.style.width = "50%";
//            (<HTMLDivElement>this.mainlabel).appendChild(this.input)
//
//            new InputFieldManager(this.input, InputFieldManager.dataType.DATA_FLOAT, false, Number.NaN, Number.NaN, () => {this.Text_TextChanged(null);});
//
//            //this.input.addEventListener("keyup" , ()=>{this.Text_TextChanged(null);} )
//            //this.input.addEventListener("change" , ()=>{this.Text_TextChanged(null);} )
//
//            //new InputFieldManager(input, InputFieldManager.dataType.DATA_STRING, true, Double.NaN, Double.NaN, Text_TextChanged);
//            //((TextBox)input).BorderStyle = BorderStyle.None;
//            //this. _parentPanel.Controls.Add(input);
//            this.input.addEventListener("focusin", () => {this.control_GotFocus(this);})
//            this.input.addEventListener("focusout", () => {this.control_LostFocus(this);})
//            this.checkForReadOnly();
//        }
//    }
//
//    public refresh(): void
//    {
//        if (this.input == null) return;
//        if (this._getValueCallback == null) return;
//        let s: Number = this._getValueCallback(this) as Number;
//        if (s == null) return;
//        if (this.input != null) if (s != parseFloat(this.input.value)) this.input.value = s.toString();
//        this.checkForReadOnly();
//    }
//
//    private Text_TextChanged(sender: any): void
//    {
//        if (this.input != null)
//        {
//            this._value = parseFloat(this.input.value);
//            Reflect.set(this._dataContainer, this._prop.name, this._value);
//            if (this._valueChangeCallback != null) this._valueChangeCallback(this);
//            if (this._changeCausesParentRefresh) this.parentNode.refresh();
//
//        }
//    }
//
//    protected _value: number = 0;
//    public get value(): number { return this._value; }
//    public set value(value: number)
//    {
//        this._value = value;
//        (<HTMLInputElement>this.input).value = value.toString();
//    }
//
//    public resize(top: number, left1: number, left2: number, width: number): number
//    {
//        (<HTMLDivElement>this.mainlabel).style.height = (<HTMLInputElement>this.input).offsetHeight.toString() + "px";
//        //super.resize(top, left1, left2, width);
//        return 0;// top + input.Height;
//    }
//
//}
//
///***
// ***  boolean
// ***/
//export class UIElementBoolean extends UIElementGeneric
//{
//    private _text: HTMLSpanElement | null = null;
//
//    constructor(p: UIElementBaseParams, dataContainer: object, prop: YoctoVisualization.PropertyDescriptor)
//    {
//        super(p, dataContainer, prop)
//        this.preExpandIfNeeded();
//    }
//
//    public AllocateControls(): void
//    {
//        super.AllocateControls();
//        if (this.input == null)
//        {
//
//            let span = document.createElement("SPAN") as HTMLSpanElement;
//            span.style.position = "absolute";
//            span.style.display = "inline-block";
//            span.style.width = "50%";
//            span.style.right = "0px";
//            (<HTMLDivElement>this.mainlabel).appendChild(span);
//            this.input = document.createElement("INPUT") as HTMLInputElement;
//            this.input.type = "input"
//            this.input.checked = Reflect.get(this._dataContainer, this._prop.name);
//            this.input.style.textAlign = "right"
//            this.input.style.display = "inline";
//            this.input.style.marginTop = "0px";
//            this.input.style.marginBottom = "0px";
//            this.input.type = "checkbox";
//            this.input.style.transform = "scale(" + YoctoVisualization.constants.generalSizeCoef.toString() + ")"
//            this.input.style.marginRight = Math.round(5 * YoctoVisualization.constants.generalSizeCoef).toString() + "px"
//
//            this.input.style.top = "0px";
//            this.input.style.border = "1px solid grey";
//            this.input.style.borderRadius = "1px";
//            span.appendChild(this.input)
//            this.input.addEventListener("keyup", (e) => { if (e.key === " ") this.value_TextChanged(null);})
//            this.input.addEventListener("change", () => {this.value_TextChanged(null);})
//
//            this._text = document.createElement("SPAN") as HTMLSpanElement;
//            this._text.style.display = "inline";
//            this._text.style.fontFamily = UIElement.defaultFontFamily;
//            this._text.style.fontSize = UIElement.defaultFontSize.toString() + "px";
//            span.appendChild(this._text)
//            this.updateText();
//
//            //new InputFieldManager(input, InputFieldManager.dataType.DATA_STRING, true, Double.NaN, Double.NaN, Text_TextChanged);
//            //((TextBox)input).BorderStyle = BorderStyle.None;
//            //this. _parentPanel.Controls.Add(input);
//            this.input.addEventListener("focusin", () => {this.control_GotFocus(this);})
//            this.input.addEventListener("focusout", () => {this.control_LostFocus(this);})
//            this.checkForReadOnly();
//
//        }
//
//    }
//
//    private updateText()
//    {
//        (<HTMLSpanElement>this._text).innerText = (<HTMLInputElement>this.input).checked ? "Enabled" : "Disabled";
//    }
//
//    public refresh(): void
//    {
//        if (this.input == null) return;
//        this.checkForReadOnly();
//        if (this._getValueCallback == null) return;
//        let v: object = this._getValueCallback(this);
//        if (v == null) return
//        let b: Boolean = v as Boolean;
//        if (this.input != null)
//        {
//            this.input.checked = b.valueOf();
//            this.updateText();
//        }
//
//    }
//
//    private value_TextChanged(sender: any): void
//    {
//        if (this.input != null)
//        {
//            this._value = this.input.checked;
//            this.updateText();
//            Reflect.set(this._dataContainer, this._prop.name, this._value);
//            if (this._valueChangeCallback != null) this._valueChangeCallback(this);
//            if (this._changeCausesParentRefresh) this.parentNode.refresh();
//        }
//    }
//
//    protected _value: boolean = false;
//    public get value(): boolean { return this._value; }
//    public set value(value: boolean)
//    {
//        this._value = value;
//        (<HTMLInputElement>this.input).checked = value;
//        this.updateText();
//    }
//
//    public resize(top: number, left1: number, left2: number, width: number): number
//    {
//
//        return 0;
//    }
//
//}
//
///***
// ***  DoubleNan
// ***/
//export class UIElementDoubleNan extends UIElementGeneric
//{
//
//    constructor(p: UIElementBaseParams, dataContainer: object, prop: YoctoVisualization.PropertyDescriptor)
//    {
//        super(p, dataContainer, prop)
//        this.preExpandIfNeeded();
//    }
//
//    public AllocateControls(): void
//    {
//        super.AllocateControls();
//        if (this.input == null)
//        {
//            this.input = document.createElement("INPUT") as HTMLInputElement;
//            this.input.type = "input"
//            this.input.value = (Reflect.get(this._dataContainer, this._prop.name)).toString();
//            this.input.style.textAlign = "right"
//            this.input.style.position = "absolute";
//            this.input.style.marginTop = "0px";
//            this.input.style.marginBottom = "0px";
//            this.input.style.fontFamily = UIElement.defaultFontFamily;
//            this.input.style.fontSize = UIElement.defaultFontSize.toString() + "px";
//            this.input.type = "number";
//            this.input.style.border = "1px solid grey";
//            this.input.style.borderRadius = "1px";
//            this.input.style.top = "0px";
//            this.input.style.right = "3px";
//            this.input.style.width = "50%";
//            (<HTMLDivElement>this.mainlabel).appendChild(this.input)
//
//            //this.input.addEventListener("keyup" , ()=>{this.Text_TextChanged(null);} )
//            //this.input.addEventListener("change" , ()=>{this.Text_TextChanged(null);} )
//
//            new InputFieldManager(this.input, InputFieldManager.dataType.DATA_FLOAT, true, Number.NaN, Number.NaN, () => {this.Text_TextChanged(null);});
//
//            //new InputFieldManager(input, InputFieldManager.dataType.DATA_STRING, true, Double.NaN, Double.NaN, Text_TextChanged);
//            //((TextBox)input).BorderStyle = BorderStyle.None;
//            //this. _parentPanel.Controls.Add(input);
//            this.input.addEventListener("focusin", () => {this.control_GotFocus(this);})
//            this.input.addEventListener("focusout", () => {this.control_LostFocus(this);})
//            this.checkForReadOnly();
//        }
//    }
//
//    public refresh(): void
//    {
//        if (this.input == null) return;
//        if (this._getValueCallback == null) return;
//        let s: string = (this._getValueCallback(this) as YoctoVisualization.doubleNan).toString();
//        if (this.input != null) if (s != this.input.value) this.input.value = s;
//        this.checkForReadOnly();
//    }
//
//    private Text_TextChanged(sender: any): void
//    {
//        if (this.input != null)
//        {
//            this._value = this.input.value == "" ? Number.NaN : parseFloat(this.input.value);
//            Reflect.set(this._dataContainer, this._prop.name, new YoctoVisualization.doubleNan(this._value));
//            if (this._valueChangeCallback != null) this._valueChangeCallback(this);
//            if (this._changeCausesParentRefresh) this.parentNode.refresh();
//        }
//    }
//
//    protected _value: number = 0;
//    public get value(): YoctoVisualization.doubleNan { return new YoctoVisualization.doubleNan(this._value); }
//    public set value(value: YoctoVisualization.doubleNan)
//    {
//        this._value = value.value;
//        (<HTMLInputElement>this.input).value = value.toString();
//    }
//
//    public resize(top: number, left1: number, left2: number, width: number): number
//    {
//        (<HTMLDivElement>this.mainlabel).style.height = (<HTMLInputElement>this.input).offsetHeight.toString() + "px";
//        //super.resize(top, left1, left2, width);
//        return 0;// top + input.Height;
//    }
//
//}
//
///***
// ***  Enums
// ***/
//export class UIElementEnum extends UIElementGeneric
//{
//
//    private allValues: YDataRendering.YEnumItem[] = [];
//
//    constructor(p: UIElementBaseParams, dataContainer: object, prop: YoctoVisualization.PropertyDescriptor)
//    {
//        super(p, dataContainer, prop)
//        this.preExpandIfNeeded();
//    }
//
//    public AllocateControls(): void
//    {
//        super.AllocateControls();
//        if (this.select == null)
//        {
//            this.select = document.createElement("SELECT") as HTMLSelectElement;
//            let enumvalue: YDataRendering.YEnumItem = Reflect.get(this._dataContainer, this._prop.name);
//            this.allValues = enumvalue.sibblings;
//
//            for (let i: number = 0; i < this.allValues.length; i++)
//            {
//                let opt: HTMLOptionElement = document.createElement("OPTION") as HTMLOptionElement;
//                opt.text = this.allValues[i].description;
//                opt.value = this.allValues[i].toString;
//                this.select.add(opt, null);
//            }
//            this.select.value = enumvalue.toString;
//            this.select.style.position = "absolute";
//            this.select.style.marginTop = "0px";
//            this.select.style.marginBottom = "0px";
//            this.select.style.fontFamily = UIElement.defaultFontFamily;
//            this.select.style.fontSize = UIElement.defaultFontSize.toString() + "px";
//            this.select.style.top = "0px";
//            this.select.style.right = "3px";
//            this.select.style.width = "50%";
//            (<HTMLDivElement>this.mainlabel).appendChild(this.select)
//            this.select.addEventListener("change", () => {this.valueChanged(null);})
//            //new InputFieldManager(input, InputFieldManager.dataType.DATA_STRING, true, Double.NaN, Double.NaN, Text_TextChanged);
//            //((TextBox)input).BorderStyle = BorderStyle.None;
//            //this. _parentPanel.Controls.Add(input);
//            this.select.addEventListener("focusin", () => {this.control_GotFocus(this);})
//            this.select.addEventListener("focusout", () => {this.control_LostFocus(this);})
//            this.checkForReadOnly();
//
//        }
//
//    }
//
//    public refresh(): void
//    {
//        if (this.select == null) return;
//        if (this._getValueCallback == null) return;
//        let value: YDataRendering.YEnumItem = this._getValueCallback(this) as YDataRendering.YEnumItem;
//        let s: string = value.toString;
//        if (this.select != null) if (s != this.select.value) this.select.value = s;
//        this.checkForReadOnly();
//    }
//
//    private valueChanged(sender: any): void
//    {
//        if (this.select != null)
//        {
//            this._value = this.select.value;
//            let it: YDataRendering.YEnumItem | null = null;
//            for (let i: number = 0; i < this.allValues.length; i++)
//            {
//                if (this.allValues[i].toString == this._value) it = this.allValues[i];
//            }
//
//            if (it != null) Reflect.set(this._dataContainer, this._prop.name, it);
//            if (this._valueChangeCallback != null) this._valueChangeCallback(this);
//            if (this._changeCausesParentRefresh) this.parentNode.refresh();
//        }
//    }
//
//    public tabReOrder(index: number): number
//    {
//        if (this.select != null) this.select.tabIndex = index++;
//        return index;
//    }
//
//    protected _value: string = "";
//    public get value(): string { return this._value; }
//    public set value(value: string)
//    {
//        this._value = value;
//        (<HTMLSelectElement>this.select).value = value;
//    }
//
//    public resize(top: number, left1: number, left2: number, width: number): number
//    {
//        (<HTMLDivElement>this.mainlabel).style.height = (<HTMLSelectElement>this.select).offsetHeight.toString() + "px";
//        //super.resize(top, left1, left2, width);
//        return 0
//    }
//
//}
//
///***
// ***  List of string values
// ***/
//export class UIElementList extends UIElementGeneric
//{
//
//    private _refreshCallback: refreshUIElementListCallback | null = null;
//    private _indexedValue: boolean = true;
//    private allValues: any[] = [];
//    private valueType: string = "";
//
//    constructor(p: UIElementBaseParams, dataContainer: object, prop: YoctoVisualization.PropertyDescriptor, allowedValues: refreshUIElementListCallback)
//    {
//        super(p, dataContainer, prop)
//        this._refreshCallback = allowedValues;
//        this.preExpandIfNeeded();
//
//    }
//
//    public AllocateControls(): void
//    {
//        super.AllocateControls();
//        if (this.select == null)
//        {
//            this.allValues = (<refreshUIElementListCallback>this._refreshCallback)();
//            this.select = document.createElement("SELECT") as HTMLSelectElement;
//
//            let value: any = Reflect.get(this._dataContainer, this._prop.name);
//            this.valueType = typeof value;
//            this._indexedValue = ((typeof (value) == 'number') && (typeof (this.allValues[0]) != 'number'));
//            let found: boolean = false;
//            let first: HTMLOptionElement | null = null;
//            for (let i: number = 0; i < this.allValues.length; i++)
//            {
//                let opt: HTMLOptionElement = document.createElement("OPTION") as HTMLOptionElement;
//                if (i == 0) first = opt;
//                opt.text = this.allValues[i].toString();
//                opt.value = this._indexedValue ? i : this.allValues[i];
//                this.select.add(opt, null);
//                if (opt.value.toString() == value.toString()) found = true;
//            }
//
//            if ((!found) && (!this._indexedValue))
//            {
//                let opt: HTMLOptionElement = document.createElement("OPTION") as HTMLOptionElement;
//                opt.text = value.toString();
//                opt.value = value;
//                this.select.add(opt, first);
//
//            }
//
//            this.select.value = value;
//            this.select.style.position = "absolute";
//            this.select.style.marginTop = "0px";
//            this.select.style.marginBottom = "0px";
//            this.select.style.fontFamily = UIElement.defaultFontFamily;
//            this.select.style.fontSize = UIElement.defaultFontSize.toString() + "px";
//            this.select.style.top = "0px";
//            this.select.style.right = "3px";
//            this.select.style.width = "50%";
//            (<HTMLDivElement>this.mainlabel).appendChild(this.select)
//            this.select.addEventListener("change", () => {this.valueChanged(null);})
//            //new InputFieldManager(input, InputFieldManager.dataType.DATA_STRING, true, Double.NaN, Double.NaN, Text_TextChanged);
//            //((TextBox)input).BorderStyle = BorderStyle.None;
//            //this. _parentPanel.Controls.Add(input);
//            this.select.addEventListener("focusin", () => {this.control_GotFocus(this);})
//            this.select.addEventListener("focusout", () => {this.control_LostFocus(this);})
//            this.checkForReadOnly();
//
//        }
//
//    }
//
//    public refresh(): void
//    {
//        if (this.select == null) return;
//        if (this._getValueCallback == null) return;
//        this.allValues = (<refreshUIElementListCallback>this._refreshCallback)();
//        for (let i: number = 0; i < this.allValues.length; i++)
//        {
//            let opt: HTMLOptionElement = (i < this.select.options.length) ? this.select.options[i] : document.createElement("OPTION") as HTMLOptionElement;
//            opt.text = this.allValues[i].toString();
//            opt.value = this._indexedValue ? i : this.allValues[i];
//            if (i >= this.select.options.length) this.select.add(opt, null);
//        }
//        while (this.allValues.length < this.select.options.length)
//        {
//            this.select.options[this.select.options.length - 1].remove();
//        }
//
//        let v: object = Reflect.get(this._dataContainer, this._prop.name);
//        if (v == null) return;
//
//        if (this._indexedValue)
//        {
//            let it: string = Number(v).toString();
//            if (this.select.value != it) this.select.value = it;
//        }
//        else
//        {
//            let it: string = v.toString();
//            if (this.select.value != it) this.select.value = it;
//        }
//
//        this.checkForReadOnly();
//    }
//
//    private valueChanged(sender: any): void
//    {
//        if (this.select != null)
//        {
//            this._value = this.select.value;
//            if (this.valueType == "number")
//            {
//                let it: number = parseInt(this._value);
//                if (it >= 0) Reflect.set(this._dataContainer, this._prop.name, it);
//            }
//            else
//            {
//                let it: string = "";
//                for (let i: number = 0; i < this.allValues.length; i++)
//                {
//                    if (this.allValues[i] == this._value) it = this.allValues[i];
//                }
//                if (it != "") Reflect.set(this._dataContainer, this._prop.name, it);
//            }
//            if (this._valueChangeCallback != null) this._valueChangeCallback(this);
//            if (this._changeCausesParentRefresh)
//            {
//                this.parentNode.refresh();
//            }
//        }
//    }
//
//    public tabReOrder(index: number): number
//    {
//        if (this.select != null) this.select.tabIndex = index++;
//        return index;
//    }
//
//    protected _value: string = "";
//    public get value(): string { return this._value; }
//    public set value(value: string)
//    {
//        this._value = value;
//        (<HTMLSelectElement>this.select).value = value;
//    }
//
//    public resize(top: number, left1: number, left2: number, width: number): number
//    {
//        (<HTMLDivElement>this.mainlabel).style.height = (<HTMLSelectElement>this.select).offsetHeight.toString() + "px";
//        //super.resize(top, left1, left2, width);
//        return 0
//    }
//
//}
//
///***
// ***  Color
// ***/
//export class UIElementColor extends UIElementGeneric
//{
//    private colorSample: HTMLDivElement | null = null;
//    private colorEditor: YoctoVisualization.colorEditor | null = null;
//    private colorPreview: YoctoVisualization.ColorSampler | null = null;
//    private currentColor: YDataRendering.YColor | null = null;
//
//    constructor(p: UIElementBaseParams, dataContainer: object, prop: YoctoVisualization.PropertyDescriptor)
//    {
//        super(p, dataContainer, prop)
//        this.preExpandIfNeeded();
//    }
//
//    get expandIcon(): string { return YoctoVisualization.ressources.DotDotDotIcon(UIElement.defaultFontSize.toString(), false, false, false, false, 'Click to open color chooser');}
//    get colapseIcon(): string { return YoctoVisualization.ressources.DotDotDotIcon(UIElement.defaultFontSize.toString(), false, false, false, false, 'Click to close color chooser');}
//
//    public AllocateControls(): void
//    {
//        this._expandable = true;
//        this._expandButtonSide = ExpandButtonside.RIGHT;
//
//        super.AllocateControls();
//        if (this.input == null)
//        {
//            let table: HTMLTableElement = document.createElement("TABLE") as HTMLTableElement;
//            table.style.position = "absolute";
//            table.style.top = "0px";
//            table.style.right = "3px";
//            table.style.width = "50%";
//            table.style.borderCollapse = "collapse";
//            let tr: HTMLTableRowElement = document.createElement("TR") as HTMLTableRowElement;
//            table.appendChild(tr);
//            let td1: HTMLTableCellElement = document.createElement("TD") as HTMLTableCellElement;
//            tr.appendChild(td1);
//            this.colorSample = document.createElement("Div") as HTMLDivElement;
//            this.colorSample.style.display = "inline-block";
//            this.colorSample.style.border = "1px solid black";
//            this.colorSample.style.marginRight = "1px";
//            this.colorSample.style.marginTop = "0px";
//            this.colorSample.style.width = "16px";
//            this.colorSample.style.height = "16px"
//            this.colorSample.style.top = "0px";
//            this.colorSample.style.bottom = "0px";
//            this.colorPreview = new YoctoVisualization.ColorSampler(this.colorSample, null);
//            td1.appendChild(this.colorSample);
//
//            let td2: HTMLTableCellElement = document.createElement("TD") as HTMLTableCellElement;
//            td2.style.width = "100%";
//            tr.appendChild(td2);
//            this.input = document.createElement("INPUT") as HTMLInputElement;
//            this.input.type = "input"
//            this.currentColor = Reflect.get(this._dataContainer, this._prop.name) as YDataRendering.YColor;
//            this.colorPreview.color = this.currentColor;
//            this.input.value = this.currentColor.toString();
//            this.input.style.marginTop = "0px";
//            this.input.style.marginBottom = "0px";
//            this.input.style.width = "100%"
//            this.input.style.border = "1px solid grey";
//            this.input.style.borderRadius = "1px";
//
//            this.input.style.fontFamily = UIElement.defaultFontFamily;
//            this.input.style.fontSize = UIElement.defaultFontSize.toString() + "px";
//            // this.input.addEventListener("keyup" , ()=>{this.Text_TextChanged(null,true);} )
//            //  this.input.addEventListener("change" , ()=>{this.Text_TextChanged(null,false);} )
//            td2.appendChild(this.input);
//
//            let td3: HTMLTableCellElement = document.createElement("TD") as HTMLTableCellElement;
//            td3.style.paddingLeft = "5px";
//            tr.appendChild(td3);
//            td3.appendChild(<HTMLAnchorElement>this.expandCtrl);
//            (<HTMLDivElement>this.mainlabel).appendChild(table)
//
//            new InputFieldManager(this.input, InputFieldManager.dataType.DATA_COLOR, false, Number.NaN, Number.NaN, (sender: HTMLInputElement, refreshInput: boolean) => {this.Text_TextChanged(sender, refreshInput);});
//
//            //((TextBox)input).BorderStyle = BorderStyle.None;
//            //this. _parentPanel.Controls.Add(input);
//            this.input.addEventListener("focusin", () => {this.control_GotFocus(this);})
//            this.input.addEventListener("focusout", () => {this.control_LostFocus(this);})
//            this.checkForReadOnly();
//
//        }
//
//    }
//
//    protected expand(): void
//    {
//
//        if (this.colorEditor == null)
//        {
//            (<HTMLDivElement>this.subElementPanel).style.marginLeft = "20px";
//            this.colorEditor = new YoctoVisualization.colorEditor(<HTMLDivElement>this.subElementPanel, UIElement.defaultFontSize, <YDataRendering.YColor>this.currentColor, (c: YDataRendering.YColor) => {this.coloredited(c);});
//        }
//
//        (<UIElement>this._rootNode).tabReOrder(0);
//        this._expanded = true;
//        (<HTMLDivElement>this.subElementPanel).style.display = "";
//        (<HTMLAnchorElement>this.expandCtrl).innerHTML = this.colapseIcon;
//
//    }
//    protected colapse(): void
//    {
//        //this.subElements.forEach((e: UIElement) => {e.hide(); });
//        (<HTMLDivElement>this.subElementPanel).style.display = "none";
//        (<HTMLAnchorElement>this.expandCtrl).innerHTML = this.expandIcon;
//    }
//
//    private coloredited(newColor: YDataRendering.YColor)
//    {
//        this.currentColor = newColor.clone();
//        (<YoctoVisualization.ColorSampler>this.colorPreview).color = this.currentColor;
//        (<HTMLInputElement>this.input).value = this.currentColor.toString();
//        Reflect.set(this._dataContainer, this._prop.name, this.currentColor);
//        if (this._valueChangeCallback != null) this._valueChangeCallback(this);
//        if (this._changeCausesParentRefresh) this.parentNode.refresh();
//    }
//
//    public refresh(): void
//    {
//        if (this.input == null) return;
//        if (this._getValueCallback == null) return;
//        let c: YDataRendering.YColor = this._getValueCallback(this) as YDataRendering.YColor;
//        if (c != null)
//        {
//            if (this.colorPreview != null) this.colorPreview.color = c;
//            if (this.input != null)
//            {
//                let s: string = c.toString();
//                if (s != this.input.value) this.input.value = s;
//            }
//        }
//        this.checkForReadOnly();
//    }
//
//    private Text_TextChanged(sender: object, refreshInput: boolean): void
//    {
//        if (this.input != null)
//        {
//            this._value = this.input.value;
//            let c: YDataRendering.YColor | null = YDataRendering.YColor.FromString(this._value);
//            if (c != null)
//            {
//                (<YoctoVisualization.ColorSampler>this.colorPreview).color = c;
//                this.currentColor = c;
//                if (this.colorEditor != null) this.colorEditor.color = c;
//                Reflect.set(this._dataContainer, this._prop.name, c);
//                if (refreshInput) this.input.value = c.toString();
//                if (this._valueChangeCallback != null) this._valueChangeCallback(this);
//                if (this._changeCausesParentRefresh) this.parentNode.refresh();
//            }
//        }
//    }
//
//    protected _value: string = "";
//    public get value(): string { return this._value; }
//    public set value(value: string)
//    {
//        this._value = value;
//        (<HTMLInputElement>this.input).value = value;
//    }
//
//    public resize(top: number, left1: number, left2: number, width: number): number
//    {
//        let h = (<HTMLInputElement>this.input).offsetHeight;
//        (<HTMLDivElement>this.mainlabel).style.height = h.toString() + "px";
//        //this.colorSample.style.height=(h-3).toString()+"px";
//        //super.resize(top, left1, left2, width);
//        return 0;// top + input.Height;
//    }
//
//}
//
///***
// ***  UIElementMarkerPos
// ***/
//export class UIElementMarkerPos extends UIElementGeneric
//{
//
//    private _cachedValue: YDataRendering.xAxisPosition | null = null;
//
//    constructor(p: UIElementBaseParams, dataContainer: object, prop: YoctoVisualization.PropertyDescriptor)
//    {
//        super(p, dataContainer, prop)
//        this.preExpandIfNeeded();
//    }
//
//    static expandIconSVG(size: number): string
//    {
//        return YoctoVisualization.ressources.targetIcon(size.toString(), false, false, false, false, "Click to place marker on graph")
//    }
//
//    get expandIcon(): string { return UIElementMarkerPos.expandIconSVG(UIElement.defaultFontSize);}
//    get colapseIcon(): string { return UIElementMarkerPos.expandIconSVG(UIElement.defaultFontSize);}
//
//    public AllocateControls(): void
//    {
//        this._expandable = true;
//        this._expandButtonSide = ExpandButtonside.RIGHT;
//        super.AllocateControls();
//        if (this.input == null)
//        {
//            let table: HTMLTableElement = document.createElement("TABLE") as HTMLTableElement;
//            table.style.position = "absolute";
//            table.style.top = "0px";
//            table.style.right = "3px";
//            table.style.width = "50%";
//            table.style.borderCollapse = "collapse";
//            let tr: HTMLTableRowElement = document.createElement("TR") as HTMLTableRowElement;
//            table.appendChild(tr);
//            let td2: HTMLTableCellElement = document.createElement("TD") as HTMLTableCellElement;
//            td2.style.width = "100%";
//            tr.appendChild(td2);
//            this.input = document.createElement("INPUT") as HTMLInputElement;
//            this.input.type = "input"
//            this._cachedValue = Reflect.get(this._dataContainer, this._prop.name) as YDataRendering.xAxisPosition;
//            this.input.value = this._cachedValue.toString();
//            this.input.style.marginTop = "0px";
//            this.input.style.marginBottom = "0px";
//            this.input.style.textAlign = "right";
//            this.input.style.width = "100%"
//            this.input.style.border = "1px solid grey";
//            this.input.style.borderRadius = "1px";
//            this.input.style.fontFamily = UIElement.defaultFontFamily;
//            this.input.style.fontSize = UIElement.defaultFontSize.toString() + "px";
//            this.input.addEventListener("keyup", () => {this.Text_TextChanged(null, true);})
//            this.input.addEventListener("change", () => {this.Text_TextChanged(null, false);})
//            td2.appendChild(this.input);
//
//            let td3: HTMLTableCellElement = document.createElement("TD") as HTMLTableCellElement;
//            td3.style.paddingLeft = "5px";
//            tr.appendChild(td3);
//            td3.appendChild(<HTMLAnchorElement>this.expandCtrl);
//
//            (<HTMLDivElement>this.mainlabel).appendChild(table)
//
//            //new InputFieldManager(input, InputFieldManager.dataType.DATA_STRING, true, Double.NaN, Double.NaN, Text_TextChanged);
//            //((TextBox)input).BorderStyle = BorderStyle.None;
//            //this. _parentPanel.Controls.Add(input);
//            this.input.addEventListener("focusin", () => {this.control_GotFocus(this);})
//            this.input.addEventListener("focusout", () => {this.control_LostFocus(this);})
//            this.checkForReadOnly();
//
//        }
//
//    }
//
//    protected expand(): void
//    {
//
//        let value: YDataRendering.xAxisPosition = Reflect.get(this._dataContainer, this._prop.name) as YDataRendering.xAxisPosition;
//        this.expanded = false;
//        value.capture = true;
//        Reflect.set(this._dataContainer, this._prop.name, value);
//        if (this._valueChangeCallback != null) this._valueChangeCallback(this);
//    }
//    protected colapse(): void
//    {
//
//    }
//
//    public refresh(): void
//    {
//        if (this.input == null) return;
//        if (this._getValueCallback == null) return;
//
//        //this.currentPosition  =  Reflect.get(this._dataContainer,this._prop.name ) as YDataRendering.xAxisPosition;
//
//        this._cachedValue = this._getValueCallback(this) as YDataRendering.xAxisPosition;
//
//        if (this.input != null)
//        {
//            //debugger
//            this.input.value = this._cachedValue.toString();
//        }
//        this.checkForReadOnly();
//    }
//
//    private Text_TextChanged(sender: any, refreshInput: boolean): void
//    {
//
//        let parsedValue: YDataRendering.TimeConverterParseResult = (<YDataRendering.xAxisPosition>this._cachedValue).TryParse((<HTMLInputElement>this.input).value)
//        if (parsedValue.success)
//        {
//            (<YDataRendering.xAxisPosition>this._cachedValue).value = parsedValue.result;
//            Reflect.set(this._dataContainer, this._prop.name, this._cachedValue);
//            if (this._valueChangeCallback != null) this._valueChangeCallback(this);
//            if (this._changeCausesParentRefresh) this.parentNode.refresh();
//            // this.input.style.backgroundColor = "yellow";
//
//        } //else this.input.style.backgroundColor = "pink";
//
//    }
//
//    protected _value: string = "";
//    public get value(): string { return this._value; }
//    public set value(value: string)
//    {
//        this._value = value;
//        (<HTMLInputElement>this.input).value = value;
//    }
//
//    public resize(top: number, left1: number, left2: number, width: number): number
//    {
//        let h = (<HTMLInputElement>this.input).offsetHeight;
//        (<HTMLDivElement>this.mainlabel).style.height = h.toString() + "px";
//        //this.colorSample.style.height=(h-3).toString()+"px";
//        //super.resize(top, left1, left2, width);
//        return 0;// top + input.Height;
//    }
//
//}
//
//export interface InputFieldManagerChange {(sender: HTMLInputElement, refreshInput: boolean): void}
//
//export class InputFieldManager
//{
//    private _input: HTMLInputElement;
//    private _type: InputFieldManager.dataType;
//    private _allowEmpty: boolean = false;
//    private _min: number = Number.NaN;
//    private _max: number = Number.NaN;
//    private _callback: InputFieldManagerChange | null = null;
//    public static nullCallback(sender: HTMLInputElement) {}
//
//    public constructor(input: HTMLInputElement, type: InputFieldManager.dataType, allowEmpty: boolean, min: number, max: number, callback: InputFieldManagerChange | null)
//    {
//        this._input = input;
//        this._type = type;
//        this._allowEmpty = allowEmpty;
//        this._min = min;
//        this._max = max;
//        this._callback = callback;
//        this.checkData();
//        this._input.addEventListener("keyup", () => {this.InputChange(this._input, true);})
//        this._input.addEventListener("change", () => {this.InputChange(this._input, false); })
//    }
//
//    private showError(msg: string)
//    {
//        this._input.title = msg;
//    }
//
//    private clearError()
//    {
//        this._input.title = "";
//
//    }
//
//    public backGroundColorFeedback(ErrorMsg: string, state: boolean)
//    {
//        if (state) this.clearError(); else this.showError(ErrorMsg);
//        let c: string = this._input.style.backgroundColor;
//        if ((state) && (c != "white")) this._input.style.backgroundColor = "white";
//        if ((!state) && (c != "pink")) this._input.style.backgroundColor = "pink";
//        return state;
//    }
//
//    public checkData(): boolean
//    {
//        let intValue: number = 0;
//        let doubleValue: number = 0;
//        if (this._input.disabled) return true;
//        let strValue: string = this._input.value;
//        if (strValue == "") return this.backGroundColorFeedback("This field can't be empty", this._allowEmpty);
//
//        switch (this._type)
//        {
//        case InputFieldManager.dataType.DATA_STRING:
//            break;
//        case InputFieldManager.dataType.DATA_INT:
//            intValue = parseInt(strValue);
//            doubleValue = parseFloat(strValue);
//            if (Number.isNaN(intValue) || intValue != doubleValue) return this.backGroundColorFeedback("Integer value expected", false);
//            if ((!Number.isNaN(this._min)) && (intValue < this._min)) return this.backGroundColorFeedback("Integer value greater or equal to " + this._min.toString() + " expected", false);
//            if ((!Number.isNaN(this._max)) && (intValue > this._max)) return this.backGroundColorFeedback("Integer value lower or equal to  " + this._min.toString() + " expected", false);
//            break;
//        case InputFieldManager.dataType.DATA_POSITIVE_INT:
//            intValue = parseInt(strValue);
//            doubleValue = parseFloat(strValue);
//            if (Number.isNaN(intValue) || intValue != doubleValue) return this.backGroundColorFeedback("Positive integer  expected", false);
//            if (intValue < 0) return this.backGroundColorFeedback("Positive integer value  expected", false);
//            if ((!Number.isNaN(this._min)) && (intValue < this._min)) return this.backGroundColorFeedback("Positive integer value greater or equal to " + this._min.toString() + " expected", false);
//            if ((!Number.isNaN(this._max)) && (intValue > this._max)) return this.backGroundColorFeedback("Positive integer value lower or equal to  " + this._min.toString() + " expected", false);
//            break;
//        case InputFieldManager.dataType.DATA_STRICT_POSITIVE_INT:
//            intValue = parseInt(strValue);
//            doubleValue = parseFloat(strValue);
//            if (Number.isNaN(intValue) || intValue != doubleValue) return this.backGroundColorFeedback("Strictly positive Integer value expected", false);
//            if (intValue <= 0) return this.backGroundColorFeedback("Strictly positive integer value  expected", false);
//            if ((!Number.isNaN(this._min)) && (intValue < this._min)) return this.backGroundColorFeedback("Positive integer value greater or equal to " + this._min.toString() + " expected", false);
//            if ((!Number.isNaN(this._max)) && (intValue > this._max)) return this.backGroundColorFeedback("Positive integer value lower or equal to  " + this._min.toString() + " expected", false);
//            break;
//        case InputFieldManager.dataType.DATA_FLOAT:
//            doubleValue = parseFloat(strValue);
//            if (Number.isNaN(intValue)) return this.backGroundColorFeedback("Floating point value expected", false);
//            if ((!Number.isNaN(this._min)) && (doubleValue < this._min)) return this.backGroundColorFeedback("Floating point value greater or equal to " + this._min.toString() + " expected", false);
//            if ((!Number.isNaN(this._max)) && (doubleValue > this._max)) return this.backGroundColorFeedback("Floating point value lower or equal to  " + this._min.toString() + " expected", false);
//            break;
//        case InputFieldManager.dataType.DATA_POSITIVE_FLOAT:
//            doubleValue = parseFloat(strValue);
//            if (Number.isNaN(doubleValue)) return this.backGroundColorFeedback("Positive floating point value expected", false);
//            if (doubleValue < 0) return this.backGroundColorFeedback("Positive floating point value expected", false);
//            if (!Number.isNaN(this._min) && (doubleValue < this._min)) return this.backGroundColorFeedback("Floating point value greater or equal to " + this._min.toString() + " expected", false);
//            if (!Number.isNaN(this._max) && (doubleValue > this._max)) return this.backGroundColorFeedback("Floating point value lower or equal to  " + this._min.toString() + " expected", false);
//            break;
//        case InputFieldManager.dataType.DATA_STRICT_POSITIVE_FLOAT:
//            doubleValue = parseFloat(strValue);
//            if (Number.isNaN(doubleValue)) return this.backGroundColorFeedback("Strictly positive floating point value expected", false);
//            if (doubleValue <= 0) return this.backGroundColorFeedback("Strictly positive floating point value expected", false);
//            if (!Number.isNaN(this._min) && (doubleValue < this._min)) return this.backGroundColorFeedback("Floating point value greater or equal to " + this._min.toString() + " expected", false);
//            if (!Number.isNaN(this._max) && (doubleValue > this._max)) return this.backGroundColorFeedback("Floating point value greater or equal to " + this._min.toString() + " expected", false);
//            break;
//        case InputFieldManager.dataType.DATA_COLOR:
//            if (YDataRendering.YColor.FromString(strValue) == null) return this.backGroundColorFeedback("Value color name/definition expected", false);
//            break;
//
//        }
//        return this.backGroundColorFeedback("", true);
//    }
//
//    private InputChange(sender: HTMLInputElement, refreshInput: boolean)
//    {
//        if (this.checkData())
//        {
//            try
//            { if (this._callback != null) this._callback(sender, refreshInput); }
//            catch (ex)
//            { this.backGroundColorFeedback((ex as Error).message, false);}
//        }
//    }
//
//}
//
//export namespace InputFieldManager
//{
//    export const enum dataType
//    {
//        DATA_STRING,
//        DATA_INT,
//        DATA_POSITIVE_INT,
//        DATA_STRICT_POSITIVE_INT,
//        DATA_FLOAT,
//        DATA_POSITIVE_FLOAT,
//        DATA_STRICT_POSITIVE_FLOAT,
//        DATA_COLOR,
//        DATA_PATH,
//        DATA_XAXISPOS
//    }
//}
//
////#endif

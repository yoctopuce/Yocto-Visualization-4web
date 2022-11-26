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
import * as YDataRendering from "./Renderer/YDataRendererFull.js";
import * as YoctoVisualization from "./YoctoVisualizationFull.js";
export class UIElementBaseParams {
    constructor(p_descriptionLabel, p_parentNode, p_RootNode, p_internalname, p_label, p_description, p_isReadonlyCall) {
        this.expandable = false;
        this.isReadonlyCall = "";
        // public GetSummaryCallBack summaryCallback = null;
        this.summary = null;
        this.structRoot = null;
        this.HelpZoneLabel = p_descriptionLabel;
        this.parentNode = p_parentNode;
        this.RootNode = p_RootNode;
        this.internalname = p_internalname;
        this.label = p_label;
        this.description = p_description;
        this.changeCausesParentRefresh = false;
        this.preExpanded = false;
        this.isReadonlyCall = p_isReadonlyCall;
    }
}
export class PropPathinfo {
    constructor() {
        this.OriginalPropName = "";
        this.fullpropname = "";
        this.propType = "";
    }
}
class CustomAttributesExtractor {
    constructor(ps) {
        this.available = true;
        this.displayName = "unknown";
        this.category = "";
        this.displayDescription = "Not documented";
        this.prefinedValues = null;
        this.changeCausesParentRefresh = false;
        this.PreExpandedCategory = false;
        this.PreExpanded = false;
        this.summaryPropertyName = "";
        this.isReadOnlyCall = "";
        this.NotSavedInXML = false;
        this.ReadOnly = false;
        this.ParamCategorySummary = "";
        if ("OnlyAvailableon" in ps.Attributes)
            this.available = ps.Attributes["OnlyAvailableon"];
        if ("DisplayName" in ps.Attributes)
            this.displayName = ps.Attributes["DisplayName"];
        if ("CategoryAttribute" in ps.Attributes)
            this.category = ps.Attributes["CategoryAttribute"];
        if ("DescriptionAttribute" in ps.Attributes)
            this.displayDescription = ps.Attributes["DescriptionAttribute"];
        if ("AllowedValues" in ps.Attributes)
            this.prefinedValues = ps.Attributes["AllowedValues"];
        if ("ChangeCausesParentRefreshAttribute" in ps.Attributes)
            this.changeCausesParentRefresh = ps.Attributes["ChangeCausesParentRefreshAttribute"];
        if ("PreExpandedCategoryAttribute" in ps.Attributes)
            this.PreExpandedCategory = ps.Attributes["PreExpandedCategoryAttribute"];
        if ("PreExpandedAttribute" in ps.Attributes)
            this.PreExpanded = ps.Attributes["PreExpandedAttribute"];
        if ("ParamCategorySummaryAttribute" in ps.Attributes)
            this.summaryPropertyName = ps.Attributes["ParamCategorySummaryAttribute"];
        if ("IsReadonlyCallAttribute" in ps.Attributes)
            this.isReadOnlyCall = ps.Attributes["IsReadonlyCallAttribute"];
        if ("NotSavedInXMLAttribute" in ps.Attributes)
            this.NotSavedInXML = ps.Attributes["NotSavedInXMLAttribute"];
        if ("ReadOnlyAttribute " in ps.Attributes)
            this.ReadOnly = ps.Attributes["ReadOnlyAttribute "];
        if ("ParamCategorySummaryAttribute " in ps.Attributes)
            this.ParamCategorySummary = ps.Attributes["ParamCategorySummaryAttribute "];
    }
}
export class UIElement extends YoctoVisualization.EditorBaseDef {
    get parentNode() { return this._parentNode; }
    get targetFullName() { return this._targetFullName; }
    get expandIcon() { return YoctoVisualization.ressources.ExpandIcon(UIElement.defaultFontSize.toString(), false, false, false, false, "Click to expand"); }
    get colapseIcon() { return YoctoVisualization.ressources.ColapseIcon(UIElement.defaultFontSize.toString(), false, false, false, false, "Click to colapse"); }
    removeFromEditor() {
    }
    get panel() { return this.subElementPanel; }
    get editorHelpText() { return ""; }
    get isRootElement() { return this._rootNode == this; }
    addToEditor() {
        if (this.mainlabel != null) {
            for (let i = 0; i < this._parentPanel.children.length; i++) {
                if (this._parentPanel.children[i] == this.mainlabel)
                    return;
            }
            this._parentPanel.appendChild(this.mainlabel);
            this._parentPanel.appendChild(this.subElementPanel);
        }
        //if ((expandCtrl != null) && (!_parentPanel.Controls.Contains(expandCtrl))) _parentPanel.Controls.Add(expandCtrl);
    }
    refresh() {
        if (this.mainText != null)
            this.mainText.innerText = this.name + this.getSummary();
        for (let i = 0; i < this.subElements.length; i++) {
            this.subElements[i].refresh();
        }
        if ((this._rootNode != null) && (this._rootNode.rootEditor != null))
            this._rootNode.rootEditor.refreshBanner();
    }
    tabReOrder(index) {
        if ((this._expandable) && (this.expandCtrl != null))
            this.expandCtrl.tabIndex = index++;
        this.subElements.forEach((e) => { index = e.tabReOrder(index); });
        return index;
    }
    triggerValueChangeCallback() {
        if (this._valueChangeCallback != null)
            this._valueChangeCallback(this);
    }
    scrollToMakeVisible() {
        if (this.mainlabel == null)
            return;
        if (this._parentPanel == null)
            return;
        this.mainlabel.scrollIntoView();
    }
    control_GotFocus(sender) {
        let extraHelp = this.editorHelpText;
        if (extraHelp != "")
            extraHelp = " " + extraHelp;
        this._helpZoneLabel.innerHTML = this._description + extraHelp;
        // this.scrollToMakeVisible();
    }
    control_LostFocus(sender) {
        this._helpZoneLabel.innerHTML = "";
    }
    preExpandIfNeeded() {
        if ((this._parentNode != null) && (this._parentNode.expanded)) {
            this.AllocateControls();
            if (this.expandable)
                this.initExpandButton();
            this.initMainLabel();
        }
        this.initExpandButton();
    }
    constructor(p) {
        super();
        this.name = "NoName";
        this._targetFullName = "unknowTargetName";
        this.ExpandableDepth = 0;
        this._expanded = false;
        this._expandButtonSide = 0 /* ExpandButtonside.LEFT */;
        this._rootEditor = null;
        this._description = "";
        this.expandCtrl = null;
        this.mainlabel = null;
        this.mainText = null;
        this.subElementPanel = null;
        this._rootNode = null;
        this._parentNode = null;
        this._parentPanel = null;
        this._changeCausesParentRefresh = false;
        this._isReadOnlyCall = "";
        this._controlsAllocated = false;
        this.expandButtonInitDone = false;
        this.mainLabelInitDone = false;
        this.subElements = [];
        this._valueChangeCallback = null;
        this._getValueCallback = null;
        this._shown = true;
        this._summaryCallback = null;
        this._showLabel = false;
        this._expandable = false;
        this._preExpanded = false;
        this.name = p.label;
        this._targetFullName = p.internalname;
        this._helpZoneLabel = p.HelpZoneLabel;
        this._description = p.description;
        this._changeCausesParentRefresh = p.changeCausesParentRefresh;
        this._expandable = p.expandable;
        this._preExpanded = p.preExpanded;
        this._structRoot = p.structRoot;
        this._isReadOnlyCall = p.isReadonlyCall;
        this._summaryProperty = p.summary;
        if (UIElement.baseheight == 0) {
            UIElement.baseheight = 12; // hardcoded for now, might need to compute it dynamically in the future
            UIElement.expandableShift = UIElement.baseheight + 2;
            UIElement.scrollBarWidth = 20;
        }
        //this._availableWidth = p.parentPanel.clientWidth;
        // this._parentPanel    = p.parentPanel;
        this._parentNode = p.parentNode;
        this._rootNode = p.RootNode == null ? this : p.RootNode;
    }
    set rootEditor(value) {
        this._rootEditor = value;
    }
    get rootEditor() {
        return this._rootEditor;
    }
    initMainLabel() {
        if (this.mainlabel == null)
            return;
        if (this.mainLabelInitDone)
            return;
        this.ExpandableDepth = 0;
        let p = this;
        while (p != null) {
            if (p.expandable)
                this.ExpandableDepth++;
            p = p.parentNode;
        }
        this.mainText.innerText = this.name + this.getSummary();
        if ((this.expandable) && (this._expandButtonSide == 0 /* ExpandButtonside.LEFT */)) {
            switch (this.ExpandableDepth) {
                case 1:
                    this.mainlabel.style.backgroundColor = "Blue";
                    this.mainText.style.color = "black";
                    break;
                case 2:
                    this.mainlabel.style.backgroundColor = "rgb(7,141,255)";
                    this.mainText.style.color = "white";
                    break;
                case 3:
                    this.mainlabel.style.backgroundColor = "rgb(120,196,255)";
                    break;
                case 4:
                    this.mainlabel.style.backgroundColor = "rgb(213,237,255)";
                    break;
                case 5:
                    this.mainlabel.style.backgroundColor = "rgb(237,246,253)";
                    break;
                default:
                    this.mainlabel.style.backgroundColor = "rgb(246,251,255)";
                    break;
            }
        }
        else {
            this.mainlabel.style.backgroundColor = "rgba( 0, 0, 0,0)";
        }
        this.mainLabelInitDone = true;
    }
    AllocateControls() {
        if (this._controlsAllocated)
            return;
        if (!this.isRootElement)
            this.parentNode.AllocateControls();
        this._parentPanel = this.parentNode.panel;
        if (this.mainlabel == null) {
            this.mainlabel = document.createElement("DIV");
            this.mainlabel.style.position = "relative";
            this.mainlabel.style.display = "inline-block;";
            this.mainlabel.style.left = "0px";
            this.mainlabel.style.padding = "2px 2px 2px 2px";
            this.mainlabel.style.overflow = "hidden";
            this.mainlabel.style.fontFamily = UIElement.defaultFontFamily;
            this.mainlabel.style.fontSize = UIElement.defaultFontSize.toString() + "px";
            this.mainlabel.style.right = "5px";
            this.mainlabel.style.whiteSpace = "nowrap";
            this.mainlabel.style.marginTop = "2px";
            this.mainlabel.style.backgroundColor = "yellow";
            this.mainText = document.createElement("SPAN");
            this.mainText.innerText = "Pouet";
            this.mainlabel.appendChild(this.mainText);
            this.mainlabel.style.display = this.isRootElement ? "none" : "";
            this.initMainLabel();
            if (this._parentPanel == null) {
                debugger;
            }
            this._parentPanel.appendChild(this.mainlabel);
        }
        if ((this._expandable) && (this.expandCtrl == null)) {
            this.expandCtrl = document.createElement("ANCHOR");
            if (this._expandButtonSide == 0 /* ExpandButtonside.LEFT */) {
                this.mainlabel.insertBefore(this.expandCtrl, this.mainText);
            }
            this.initExpandButton();
            this.subElementPanel = document.createElement("DIV");
            this.subElementPanel.style.position = "relative";
            this.subElementPanel.style.display = "inline-block;";
            this.subElementPanel.style.left = this.isRootElement ? "0px" : "5px";
            this.subElementPanel.style.padding = "2px 2px 2px 2px";
            this.subElementPanel.style.right = "5px";
            this.subElementPanel.style.display = "none";
            this.subElementPanel.style.marginTop = "2px";
            this.subElementPanel.style.marginRight = "2px";
            this._parentPanel.appendChild(this.subElementPanel);
        }
        this._controlsAllocated = true;
    }
    initExpandButton() {
        if (this.expandCtrl == null)
            return;
        if (this.expandButtonInitDone)
            return;
        this.expandCtrl.innerHTML = this.expandIcon;
        //this.expandCtrl.style.border="1px solid black"
        this.expandCtrl.style.top = "0px";
        this.expandCtrl.style.left = "0px";
        this.expandCtrl.style.cursor = "pointer";
        this.expandCtrl.style.backgroundColor = "white";
        this.expandCtrl.style.marginRight = "3px";
        this.expandCtrl.style.paddingLeft = "0px";
        this.expandCtrl.style.paddingRight = "0px";
        this.expandCtrl.style.paddingTop = "1px";
        this.expandCtrl.style.marginTop = "0px";
        this.expandCtrl.style.marginBottom = "0px";
        this.expandCtrl.style.paddingBottom = "0px";
        this.expandCtrl.style.paddingRight = "0px";
        this.expandCtrl.addEventListener("click", () => { this.ToggleExpand(); });
        this.expandCtrl.addEventListener('keyup', (e) => { if ((e.key === "Enter") || (e.key === " "))
            this.ToggleExpand(); });
        this.expandCtrl.addEventListener("focusin", () => { this.control_GotFocus(this); });
        this.expandCtrl.addEventListener("focusout", () => { this.control_LostFocus(this); });
        this.expandButtonInitDone = true;
    }
    get rowHeight() { return UIElement.baseheight; }
    ExtractPropPath(info) {
        let index = -1;
        let path = [];
        let p = this;
        info.OriginalPropName = p.targetFullName;
        do {
            info.fullpropname = p.targetFullName;
            index = info.fullpropname.indexOf("_");
            if (index < 0) {
                if (info.fullpropname != UIElement.ARTIFICIALSECTIONNAME)
                    path.splice(0, 0, info.fullpropname); // ignore artificial sections
                p = p.parentNode;
                if (p == null)
                    throw "invalid Property name";
            }
        } while (index < 0);
        info.propType = info.fullpropname.substring(0, index);
        let propname = info.fullpropname.substring(index + 1);
        path.splice(0, 0, propname);
        return path;
    }
    startEdit(setcallback, getCallback) {
        this.addToEditor();
        this._valueChangeCallback = setcallback;
        this._getValueCallback = getCallback;
        this.subElements.forEach((item) => { item.startEdit(setcallback, getCallback); });
    }
    stopEdit() {
        this.removeFromEditor();
        this._valueChangeCallback = null;
        this._getValueCallback = null;
        this.subElements.forEach((item) => { item.stopEdit(); });
    }
    expand() {
        this.subElements.forEach((e) => {
            e.AllocateControls();
            e.show();
        });
        this._rootNode.tabReOrder(0);
        this._expanded = true;
        this.subElementPanel.style.display = "";
        this.expandCtrl.innerHTML = this.colapseIcon;
    }
    colapse() {
        //this.subElements.forEach((e: UIElement) => {e.hide(); });
        this.subElementPanel.style.display = "none";
        this.expandCtrl.innerHTML = this.expandIcon;
    }
    get expanded() { return this._expanded; }
    set expanded(value) {
        this._expanded = value;
        if (this._expanded) {
            this.expand();
        }
        else {
            this.colapse();
        }
        this._rootNode.resizeAll();
    }
    ToggleExpand() {
        this.expanded = !this.expanded;
    }
    getSummary() {
        if (this._summaryProperty != null) {
            return " (" + Reflect.get(this._structRoot, this._summaryProperty.name) + ")";
        }
        return "";
    }
    sensorList() {
        let res = [];
        YoctoVisualization.sensorsManager.sensorList.forEach((s) => { res.push(s); });
        return res;
    }
    ProcessNewType(dataStucture) {
        let subsections = {};
        this._structRoot = dataStucture;
        let toExpand = [];
        let properties = YoctoVisualization.GenericProperties.getAllProperties(dataStucture);
        for (let i = 0; i < properties.byIndex.length; i++) {
            let ps = properties.byIndex[i];
            if (ps.isWritable) {
                let attr = new CustomAttributesExtractor(ps);
                if (attr.available) {
                    let section = this;
                    if (attr.category != "") {
                        if (attr.category in subsections) {
                            section = subsections[attr.category];
                        }
                        else {
                            let sectionparam = new UIElementBaseParams(this._helpZoneLabel, this, this._rootNode, UIElement.ARTIFICIALSECTIONNAME, attr.category, attr.category + " section, expand for more...", "");
                            sectionparam.preExpanded = attr.PreExpandedCategory;
                            sectionparam.expandable = true;
                            sectionparam.structRoot = dataStucture;
                            if (attr.summaryPropertyName != "") {
                                sectionparam.summary = ps;
                            }
                            section = new UIElement(sectionparam);
                            if (attr.PreExpandedCategory)
                                toExpand.push(section);
                            section.showLabel = true;
                            subsections[attr.category] = section;
                            this.addSubElement(section);
                        }
                    }
                    let elParam = new UIElementBaseParams(this._helpZoneLabel, section, this._rootNode, ps.name, attr.displayName, attr.displayDescription, attr.isReadOnlyCall);
                    elParam.preExpanded = attr.PreExpanded;
                    elParam.changeCausesParentRefresh = attr.changeCausesParentRefresh;
                    let targetName = this._targetFullName;
                    let targetPrefix = "";
                    let p = targetName.indexOf("_");
                    if (p >= 0) {
                        targetPrefix = targetName.substring(0, p);
                        targetName = targetName.substring(p + 1);
                    }
                    if (ps.isEnum) {
                        let s = new UIElementEnum(elParam, dataStucture, ps);
                        section.addSubElement(s);
                    }
                    else {
                        switch (ps.type) {
                            case "number":
                                if (attr.prefinedValues == null) {
                                    let n = new UIElementNumber(elParam, dataStucture, ps);
                                    section.addSubElement(n);
                                }
                                else {
                                    let s = new UIElementList(elParam, dataStucture, ps, () => { return attr.prefinedValues; });
                                    section.addSubElement(s);
                                }
                                break;
                            case "boolean":
                                let b = new UIElementBoolean(elParam, dataStucture, ps);
                                section.addSubElement(b);
                                break;
                            case YoctoVisualization.doubleNan.name:
                                let d = new UIElementDoubleNan(elParam, dataStucture, ps);
                                section.addSubElement(d);
                                break;
                            case YoctoVisualization.NullYSensor.name:
                            case YoctoVisualization.CustomYSensor.name:
                                let s = new UIElementList(elParam, dataStucture, ps, () => { return this.sensorList(); });
                                section.addSubElement(s);
                                break;
                            case YDataRendering.YColor.name:
                                let c = new UIElementColor(elParam, dataStucture, ps);
                                section.addSubElement(c);
                                break;
                            case YDataRendering.xAxisPosition.name:
                                let p = new UIElementMarkerPos(elParam, dataStucture, ps);
                                section.addSubElement(p);
                                break;
                            case "string":
                                if (attr.prefinedValues == null) {
                                    let s = new UIElementString(elParam, dataStucture, ps);
                                    section.addSubElement(s);
                                }
                                else {
                                    let s = new UIElementList(elParam, dataStucture, ps, () => { return attr.prefinedValues; });
                                    section.addSubElement(s);
                                }
                                break;
                            default:
                                {
                                    elParam.expandable = true;
                                    elParam.preExpanded = attr.PreExpanded;
                                    let subobjectsection = new UIElement(elParam);
                                    if (attr.PreExpanded)
                                        toExpand.push(subobjectsection);
                                    subobjectsection.showLabel = true;
                                    section.addSubElement(subobjectsection);
                                    subobjectsection.ProcessNewType(dataStucture[ps.name]);
                                }
                                break;
                        }
                    }
                    //    watch1.Stop(); Console.WriteLine("creating sub node  " + displayName +" took "+ watch1.ElapsedMilliseconds.ToString() + " ms");
                }
            }
            else {
                if (ps.name == "summary") {
                    this._summaryProperty = ps;
                }
            }
        }
        if (this._summaryProperty != null)
            this.refresh();
        toExpand.forEach((e) => { e.expand(); });
    }
    show() {
        this._shown = true;
        if (this.mainlabel != null)
            this.mainlabel.style.display = "";
        if (this.expandCtrl != null)
            this.expandCtrl.style.display = this._expandable ? "" : "hidden";
        if (this.expanded) {
            this.subElements.forEach((e) => { e.show(); });
        }
    }
    hide() {
        this._shown = false;
        if (this.mainlabel != null)
            this.mainlabel.style.display = "hidden";
        if (this.expandCtrl != null)
            this.expandCtrl.style.display = this._expandable ? "hidden" : "";
        this.subElements.forEach((e) => { e.hide(); });
    }
    ExpandCtrl_Click_expand(sender) {
        this.expanded = !this._expanded;
    }
    resizeAll() {
        this.resize(0, 0, 0, 0);
        if (this.expanded) {
            this.subElements.forEach((e) => { e.resizeAll(); });
        }
    }
    get showLabel() { return this._showLabel; }
    set showLabel(value) {
        this._showLabel = value;
        if (this.expandCtrl != null)
            this.expandCtrl.style.display = (value && this._expandable) ? "" : "hidden";
    }
    get expandable() { return this._expandable; }
    set expandable(value) {
        this._expandable = value;
        if (!value)
            return;
        if (this.expandCtrl == null) {
            this.AllocateControls();
            this.initExpandButton();
        }
        this.expandCtrl.style.display = (value && this._showLabel) ? "" : "hidden";
    }
    addSubElement(node) {
        this.subElements.push(node);
    }
    computeHeight() {
        return 0;
    }
    resize(top, left1, left2, width) {
        return 0;
    }
}
UIElement.defaultFontFamily = YoctoVisualization.constants.generalFontFamily;
UIElement.defaultFontSize = YoctoVisualization.constants.generalFontSize;
UIElement.ARTIFICIALSECTIONNAME = "-ignore-";
UIElement.baseheight = 0;
UIElement.indentation = 16;
UIElement.expandableShift = 0;
UIElement.scrollBarWidth = 0;
UIElement.expandableVerticalOffset = 2;
export class UIElementGeneric extends UIElement {
    constructor(p, dataContainer, prop) {
        super(p);
        this.input = null;
        this.select = null;
        this._prop = prop;
        this._dataContainer = dataContainer;
        this._showLabel = true;
        if (this._preExpanded)
            this.AllocateControls();
        if ((this._expandable) && (this._preExpanded))
            this.expand();
    }
    removeFromEditor() {
        super.removeFromEditor();
        //if (this.input != null) this._parentPanel.Controls.Remove(input);
    }
    tabReOrder(index) {
        if (this.input != null)
            this.input.tabIndex = index++;
        this.subElements.forEach((e) => { index = e.tabReOrder(index); });
        return index;
    }
    addToEditor() {
        super.addToEditor();
        // if (this.input != null) this._parentPanel.Controls.Add(input);
    }
    show() {
        super.show();
        if (this.input != null)
            this.input.style.visibility = "";
    }
    checkForReadOnly() {
        if ((this.input == null) && (this.select == null))
            return;
        if (this._isReadOnlyCall != "") {
            let ro = Reflect.get(this._dataContainer, this._isReadOnlyCall);
            if (this.input != null)
                this.input.disabled = ro;
            if (this.select != null)
                this.select.disabled = ro;
        }
    }
    hide() {
        if (this.input != null)
            this.input.style.visibility = "hidden";
        super.hide();
    }
    resize(top, left1, left2, width) {
        return 0;
    }
}
/***
 ***  String
 ***/
export class UIElementString extends UIElementGeneric {
    constructor(p, dataContainer, prop) {
        super(p, dataContainer, prop);
        this._value = "";
        this.preExpandIfNeeded();
    }
    AllocateControls() {
        super.AllocateControls();
        if (this.input == null) {
            this.input = document.createElement("INPUT");
            this.input.type = "input";
            this.input.value = Reflect.get(this._dataContainer, this._prop.name);
            this.input.style.position = "absolute";
            this.input.style.marginTop = "0px";
            this.input.style.marginBottom = "0px";
            this.input.style.fontFamily = UIElement.defaultFontFamily;
            this.input.style.fontSize = UIElement.defaultFontSize.toString() + "px";
            this.input.style.border = "1px solid grey";
            this.input.style.borderRadius = "1px";
            this.input.style.top = "0px";
            this.input.style.right = "3px";
            this.input.style.width = "50%";
            this.mainlabel.appendChild(this.input);
            //  this.input.addEventListener("keyup" , ()=>{this.Text_TextChanged(null);} )
            new InputFieldManager(this.input, 0 /* InputFieldManager.dataType.DATA_STRING */, true, Number.NaN, Number.NaN, () => { this.Text_TextChanged(null); });
            //new InputFieldManager(input, InputFieldManager.dataType.DATA_STRING, true, Double.NaN, Double.NaN, Text_TextChanged);
            //((TextBox)input).BorderStyle = BorderStyle.None;
            //this. _parentPanel.Controls.Add(input);
            this.input.addEventListener("focusin", () => { this.control_GotFocus(this); });
            this.input.addEventListener("focusout", () => { this.control_LostFocus(this); });
            this.checkForReadOnly();
        }
    }
    refresh() {
        if (this.input == null)
            return;
        if (this._getValueCallback == null)
            return;
        let value = this._getValueCallback(this);
        if (value == null)
            return;
        let s = value.toString();
        if (this.input != null)
            if (s != this.input.value)
                this.input.value = s;
        this.checkForReadOnly();
    }
    Text_TextChanged(sender) {
        if (this.input != null) {
            this._value = this.input.value;
            Reflect.set(this._dataContainer, this._prop.name, this._value);
            if (this._valueChangeCallback != null)
                this._valueChangeCallback(this);
            if (this._changeCausesParentRefresh)
                this.parentNode.refresh();
        }
    }
    get value() { return this._value; }
    set value(value) {
        this._value = value;
        this.input.value = value;
    }
    resize(top, left1, left2, width) {
        this.mainlabel.style.height = this.input.offsetHeight.toString() + "px";
        return 0;
    }
}
/***
 ***  Number
 ***/
export class UIElementNumber extends UIElementGeneric {
    constructor(p, dataContainer, prop) {
        super(p, dataContainer, prop);
        this._value = 0;
        this.preExpandIfNeeded();
    }
    AllocateControls() {
        super.AllocateControls();
        if (this.input == null) {
            this.input = document.createElement("INPUT");
            this.input.type = "input";
            this.input.value = Reflect.get(this._dataContainer, this._prop.name);
            this.input.style.textAlign = "right";
            this.input.style.position = "absolute";
            this.input.style.marginTop = "0px";
            this.input.style.marginBottom = "0px";
            this.input.style.fontFamily = UIElement.defaultFontFamily;
            this.input.style.fontSize = UIElement.defaultFontSize.toString() + "px";
            this.input.type = "number";
            this.input.style.border = "1px solid grey";
            this.input.style.borderRadius = "1px";
            this.input.style.top = "0px";
            this.input.style.right = "3px";
            this.input.style.width = "50%";
            this.mainlabel.appendChild(this.input);
            new InputFieldManager(this.input, 4 /* InputFieldManager.dataType.DATA_FLOAT */, false, Number.NaN, Number.NaN, () => { this.Text_TextChanged(null); });
            //this.input.addEventListener("keyup" , ()=>{this.Text_TextChanged(null);} )
            //this.input.addEventListener("change" , ()=>{this.Text_TextChanged(null);} )
            //new InputFieldManager(input, InputFieldManager.dataType.DATA_STRING, true, Double.NaN, Double.NaN, Text_TextChanged);
            //((TextBox)input).BorderStyle = BorderStyle.None;
            //this. _parentPanel.Controls.Add(input);
            this.input.addEventListener("focusin", () => { this.control_GotFocus(this); });
            this.input.addEventListener("focusout", () => { this.control_LostFocus(this); });
            this.checkForReadOnly();
        }
    }
    refresh() {
        if (this.input == null)
            return;
        if (this._getValueCallback == null)
            return;
        let s = this._getValueCallback(this);
        if (s == null)
            return;
        if (this.input != null)
            if (s != parseFloat(this.input.value))
                this.input.value = s.toString();
        this.checkForReadOnly();
    }
    Text_TextChanged(sender) {
        if (this.input != null) {
            this._value = parseFloat(this.input.value);
            Reflect.set(this._dataContainer, this._prop.name, this._value);
            if (this._valueChangeCallback != null)
                this._valueChangeCallback(this);
            if (this._changeCausesParentRefresh)
                this.parentNode.refresh();
        }
    }
    get value() { return this._value; }
    set value(value) {
        this._value = value;
        this.input.value = value.toString();
    }
    resize(top, left1, left2, width) {
        this.mainlabel.style.height = this.input.offsetHeight.toString() + "px";
        //super.resize(top, left1, left2, width);
        return 0; // top + input.Height;
    }
}
/***
 ***  boolean
 ***/
export class UIElementBoolean extends UIElementGeneric {
    constructor(p, dataContainer, prop) {
        super(p, dataContainer, prop);
        this._text = null;
        this._value = false;
        this.preExpandIfNeeded();
    }
    AllocateControls() {
        super.AllocateControls();
        if (this.input == null) {
            let span = document.createElement("SPAN");
            span.style.position = "absolute";
            span.style.display = "inline-block";
            span.style.width = "50%";
            span.style.right = "0px";
            this.mainlabel.appendChild(span);
            this.input = document.createElement("INPUT");
            this.input.type = "input";
            this.input.checked = Reflect.get(this._dataContainer, this._prop.name);
            this.input.style.textAlign = "right";
            this.input.style.display = "inline";
            this.input.style.marginTop = "0px";
            this.input.style.marginBottom = "0px";
            this.input.type = "checkbox";
            this.input.style.transform = "scale(" + YoctoVisualization.constants.generalSizeCoef.toString() + ")";
            this.input.style.marginRight = Math.round(5 * YoctoVisualization.constants.generalSizeCoef).toString() + "px";
            this.input.style.top = "0px";
            this.input.style.border = "1px solid grey";
            this.input.style.borderRadius = "1px";
            span.appendChild(this.input);
            this.input.addEventListener("keyup", (e) => { if (e.key === " ")
                this.value_TextChanged(null); });
            this.input.addEventListener("change", () => { this.value_TextChanged(null); });
            this._text = document.createElement("SPAN");
            this._text.style.display = "inline";
            this._text.style.fontFamily = UIElement.defaultFontFamily;
            this._text.style.fontSize = UIElement.defaultFontSize.toString() + "px";
            span.appendChild(this._text);
            this.updateText();
            //new InputFieldManager(input, InputFieldManager.dataType.DATA_STRING, true, Double.NaN, Double.NaN, Text_TextChanged);
            //((TextBox)input).BorderStyle = BorderStyle.None;
            //this. _parentPanel.Controls.Add(input);
            this.input.addEventListener("focusin", () => { this.control_GotFocus(this); });
            this.input.addEventListener("focusout", () => { this.control_LostFocus(this); });
            this.checkForReadOnly();
        }
    }
    updateText() {
        this._text.innerText = this.input.checked ? "Enabled" : "Disabled";
    }
    refresh() {
        if (this.input == null)
            return;
        this.checkForReadOnly();
        if (this._getValueCallback == null)
            return;
        let v = this._getValueCallback(this);
        if (v == null)
            return;
        let b = v;
        if (this.input != null) {
            this.input.checked = b.valueOf();
            this.updateText();
        }
    }
    value_TextChanged(sender) {
        if (this.input != null) {
            this._value = this.input.checked;
            this.updateText();
            Reflect.set(this._dataContainer, this._prop.name, this._value);
            if (this._valueChangeCallback != null)
                this._valueChangeCallback(this);
            if (this._changeCausesParentRefresh)
                this.parentNode.refresh();
        }
    }
    get value() { return this._value; }
    set value(value) {
        this._value = value;
        this.input.checked = value;
        this.updateText();
    }
    resize(top, left1, left2, width) {
        return 0;
    }
}
/***
 ***  DoubleNan
 ***/
export class UIElementDoubleNan extends UIElementGeneric {
    constructor(p, dataContainer, prop) {
        super(p, dataContainer, prop);
        this._value = 0;
        this.preExpandIfNeeded();
    }
    AllocateControls() {
        super.AllocateControls();
        if (this.input == null) {
            this.input = document.createElement("INPUT");
            this.input.type = "input";
            this.input.value = (Reflect.get(this._dataContainer, this._prop.name)).toString();
            this.input.style.textAlign = "right";
            this.input.style.position = "absolute";
            this.input.style.marginTop = "0px";
            this.input.style.marginBottom = "0px";
            this.input.style.fontFamily = UIElement.defaultFontFamily;
            this.input.style.fontSize = UIElement.defaultFontSize.toString() + "px";
            this.input.type = "number";
            this.input.style.border = "1px solid grey";
            this.input.style.borderRadius = "1px";
            this.input.style.top = "0px";
            this.input.style.right = "3px";
            this.input.style.width = "50%";
            this.mainlabel.appendChild(this.input);
            //this.input.addEventListener("keyup" , ()=>{this.Text_TextChanged(null);} )
            //this.input.addEventListener("change" , ()=>{this.Text_TextChanged(null);} )
            new InputFieldManager(this.input, 4 /* InputFieldManager.dataType.DATA_FLOAT */, true, Number.NaN, Number.NaN, () => { this.Text_TextChanged(null); });
            //new InputFieldManager(input, InputFieldManager.dataType.DATA_STRING, true, Double.NaN, Double.NaN, Text_TextChanged);
            //((TextBox)input).BorderStyle = BorderStyle.None;
            //this. _parentPanel.Controls.Add(input);
            this.input.addEventListener("focusin", () => { this.control_GotFocus(this); });
            this.input.addEventListener("focusout", () => { this.control_LostFocus(this); });
            this.checkForReadOnly();
        }
    }
    refresh() {
        if (this.input == null)
            return;
        if (this._getValueCallback == null)
            return;
        let s = this._getValueCallback(this).toString();
        if (this.input != null)
            if (s != this.input.value)
                this.input.value = s;
        this.checkForReadOnly();
    }
    Text_TextChanged(sender) {
        if (this.input != null) {
            this._value = this.input.value == "" ? Number.NaN : parseFloat(this.input.value);
            Reflect.set(this._dataContainer, this._prop.name, new YoctoVisualization.doubleNan(this._value));
            if (this._valueChangeCallback != null)
                this._valueChangeCallback(this);
            if (this._changeCausesParentRefresh)
                this.parentNode.refresh();
        }
    }
    get value() { return new YoctoVisualization.doubleNan(this._value); }
    set value(value) {
        this._value = value.value;
        this.input.value = value.toString();
    }
    resize(top, left1, left2, width) {
        this.mainlabel.style.height = this.input.offsetHeight.toString() + "px";
        //super.resize(top, left1, left2, width);
        return 0; // top + input.Height;
    }
}
/***
 ***  Enums
 ***/
export class UIElementEnum extends UIElementGeneric {
    constructor(p, dataContainer, prop) {
        super(p, dataContainer, prop);
        this.allValues = [];
        this._value = "";
        this.preExpandIfNeeded();
    }
    AllocateControls() {
        super.AllocateControls();
        if (this.select == null) {
            this.select = document.createElement("SELECT");
            let enumvalue = Reflect.get(this._dataContainer, this._prop.name);
            this.allValues = enumvalue.sibblings;
            for (let i = 0; i < this.allValues.length; i++) {
                let opt = document.createElement("OPTION");
                opt.text = this.allValues[i].description;
                opt.value = this.allValues[i].toString;
                this.select.add(opt, null);
            }
            this.select.value = enumvalue.toString;
            this.select.style.position = "absolute";
            this.select.style.marginTop = "0px";
            this.select.style.marginBottom = "0px";
            this.select.style.fontFamily = UIElement.defaultFontFamily;
            this.select.style.fontSize = UIElement.defaultFontSize.toString() + "px";
            this.select.style.top = "0px";
            this.select.style.right = "3px";
            this.select.style.width = "50%";
            this.mainlabel.appendChild(this.select);
            this.select.addEventListener("change", () => { this.valueChanged(null); });
            //new InputFieldManager(input, InputFieldManager.dataType.DATA_STRING, true, Double.NaN, Double.NaN, Text_TextChanged);
            //((TextBox)input).BorderStyle = BorderStyle.None;
            //this. _parentPanel.Controls.Add(input);
            this.select.addEventListener("focusin", () => { this.control_GotFocus(this); });
            this.select.addEventListener("focusout", () => { this.control_LostFocus(this); });
            this.checkForReadOnly();
        }
    }
    refresh() {
        if (this.select == null)
            return;
        if (this._getValueCallback == null)
            return;
        let value = this._getValueCallback(this);
        let s = value.toString;
        if (this.select != null)
            if (s != this.select.value)
                this.select.value = s;
        this.checkForReadOnly();
    }
    valueChanged(sender) {
        if (this.select != null) {
            this._value = this.select.value;
            let it = null;
            for (let i = 0; i < this.allValues.length; i++) {
                if (this.allValues[i].toString == this._value)
                    it = this.allValues[i];
            }
            if (it != null)
                Reflect.set(this._dataContainer, this._prop.name, it);
            if (this._valueChangeCallback != null)
                this._valueChangeCallback(this);
            if (this._changeCausesParentRefresh)
                this.parentNode.refresh();
        }
    }
    tabReOrder(index) {
        if (this.select != null)
            this.select.tabIndex = index++;
        return index;
    }
    get value() { return this._value; }
    set value(value) {
        this._value = value;
        this.select.value = value;
    }
    resize(top, left1, left2, width) {
        this.mainlabel.style.height = this.select.offsetHeight.toString() + "px";
        //super.resize(top, left1, left2, width);
        return 0;
    }
}
/***
 ***  List of string values
 ***/
export class UIElementList extends UIElementGeneric {
    constructor(p, dataContainer, prop, allowedValues) {
        super(p, dataContainer, prop);
        this._refreshCallback = null;
        this._indexedValue = true;
        this.allValues = [];
        this.valueType = "";
        this._value = "";
        this._refreshCallback = allowedValues;
        this.preExpandIfNeeded();
    }
    AllocateControls() {
        super.AllocateControls();
        if (this.select == null) {
            this.allValues = this._refreshCallback();
            this.select = document.createElement("SELECT");
            let value = Reflect.get(this._dataContainer, this._prop.name);
            this.valueType = typeof value;
            this._indexedValue = ((typeof (value) == 'number') && (typeof (this.allValues[0]) != 'number'));
            let found = false;
            let first = null;
            for (let i = 0; i < this.allValues.length; i++) {
                let opt = document.createElement("OPTION");
                if (i == 0)
                    first = opt;
                opt.text = this.allValues[i].toString();
                opt.value = this._indexedValue ? i : this.allValues[i];
                this.select.add(opt, null);
                if (opt.value.toString() == value.toString())
                    found = true;
            }
            if ((!found) && (!this._indexedValue)) {
                let opt = document.createElement("OPTION");
                opt.text = value.toString();
                opt.value = value;
                this.select.add(opt, first);
            }
            this.select.value = value;
            this.select.style.position = "absolute";
            this.select.style.marginTop = "0px";
            this.select.style.marginBottom = "0px";
            this.select.style.fontFamily = UIElement.defaultFontFamily;
            this.select.style.fontSize = UIElement.defaultFontSize.toString() + "px";
            this.select.style.top = "0px";
            this.select.style.right = "3px";
            this.select.style.width = "50%";
            this.mainlabel.appendChild(this.select);
            this.select.addEventListener("change", () => { this.valueChanged(null); });
            //new InputFieldManager(input, InputFieldManager.dataType.DATA_STRING, true, Double.NaN, Double.NaN, Text_TextChanged);
            //((TextBox)input).BorderStyle = BorderStyle.None;
            //this. _parentPanel.Controls.Add(input);
            this.select.addEventListener("focusin", () => { this.control_GotFocus(this); });
            this.select.addEventListener("focusout", () => { this.control_LostFocus(this); });
            this.checkForReadOnly();
        }
    }
    refresh() {
        if (this.select == null)
            return;
        if (this._getValueCallback == null)
            return;
        this.allValues = this._refreshCallback();
        for (let i = 0; i < this.allValues.length; i++) {
            let opt = (i < this.select.options.length) ? this.select.options[i] : document.createElement("OPTION");
            opt.text = this.allValues[i].toString();
            opt.value = this._indexedValue ? i : this.allValues[i];
            if (i >= this.select.options.length)
                this.select.add(opt, null);
        }
        while (this.allValues.length < this.select.options.length) {
            this.select.options[this.select.options.length - 1].remove();
        }
        let v = Reflect.get(this._dataContainer, this._prop.name);
        if (v == null)
            return;
        if (this._indexedValue) {
            let it = Number(v).toString();
            if (this.select.value != it)
                this.select.value = it;
        }
        else {
            let it = v.toString();
            if (this.select.value != it)
                this.select.value = it;
        }
        this.checkForReadOnly();
    }
    valueChanged(sender) {
        if (this.select != null) {
            this._value = this.select.value;
            if (this.valueType == "number") {
                let it = parseInt(this._value);
                if (it >= 0)
                    Reflect.set(this._dataContainer, this._prop.name, it);
            }
            else {
                let it = "";
                for (let i = 0; i < this.allValues.length; i++) {
                    if (this.allValues[i] == this._value)
                        it = this.allValues[i];
                }
                if (it != "")
                    Reflect.set(this._dataContainer, this._prop.name, it);
            }
            if (this._valueChangeCallback != null)
                this._valueChangeCallback(this);
            if (this._changeCausesParentRefresh) {
                this.parentNode.refresh();
            }
        }
    }
    tabReOrder(index) {
        if (this.select != null)
            this.select.tabIndex = index++;
        return index;
    }
    get value() { return this._value; }
    set value(value) {
        this._value = value;
        this.select.value = value;
    }
    resize(top, left1, left2, width) {
        this.mainlabel.style.height = this.select.offsetHeight.toString() + "px";
        //super.resize(top, left1, left2, width);
        return 0;
    }
}
/***
 ***  Color
 ***/
export class UIElementColor extends UIElementGeneric {
    constructor(p, dataContainer, prop) {
        super(p, dataContainer, prop);
        this.colorSample = null;
        this.colorEditor = null;
        this.colorPreview = null;
        this.currentColor = null;
        this._value = "";
        this.preExpandIfNeeded();
    }
    get expandIcon() { return YoctoVisualization.ressources.DotDotDotIcon(UIElement.defaultFontSize.toString(), false, false, false, false, 'Click to open color chooser'); }
    get colapseIcon() { return YoctoVisualization.ressources.DotDotDotIcon(UIElement.defaultFontSize.toString(), false, false, false, false, 'Click to close color chooser'); }
    AllocateControls() {
        this._expandable = true;
        this._expandButtonSide = 1 /* ExpandButtonside.RIGHT */;
        super.AllocateControls();
        if (this.input == null) {
            let table = document.createElement("TABLE");
            table.style.position = "absolute";
            table.style.top = "0px";
            table.style.right = "3px";
            table.style.width = "50%";
            table.style.borderCollapse = "collapse";
            let tr = document.createElement("TR");
            table.appendChild(tr);
            let td1 = document.createElement("TD");
            tr.appendChild(td1);
            this.colorSample = document.createElement("Div");
            this.colorSample.style.display = "inline-block";
            this.colorSample.style.border = "1px solid black";
            this.colorSample.style.marginRight = "1px";
            this.colorSample.style.marginTop = "0px";
            this.colorSample.style.width = "16px";
            this.colorSample.style.height = "16px";
            this.colorSample.style.top = "0px";
            this.colorSample.style.bottom = "0px";
            this.colorPreview = new YoctoVisualization.ColorSampler(this.colorSample, null);
            td1.appendChild(this.colorSample);
            let td2 = document.createElement("TD");
            td2.style.width = "100%";
            tr.appendChild(td2);
            this.input = document.createElement("INPUT");
            this.input.type = "input";
            this.currentColor = Reflect.get(this._dataContainer, this._prop.name);
            this.colorPreview.color = this.currentColor;
            this.input.value = this.currentColor.toString();
            this.input.style.marginTop = "0px";
            this.input.style.marginBottom = "0px";
            this.input.style.width = "100%";
            this.input.style.border = "1px solid grey";
            this.input.style.borderRadius = "1px";
            this.input.style.fontFamily = UIElement.defaultFontFamily;
            this.input.style.fontSize = UIElement.defaultFontSize.toString() + "px";
            // this.input.addEventListener("keyup" , ()=>{this.Text_TextChanged(null,true);} )
            //  this.input.addEventListener("change" , ()=>{this.Text_TextChanged(null,false);} )
            td2.appendChild(this.input);
            let td3 = document.createElement("TD");
            td3.style.paddingLeft = "5px";
            tr.appendChild(td3);
            td3.appendChild(this.expandCtrl);
            this.mainlabel.appendChild(table);
            new InputFieldManager(this.input, 7 /* InputFieldManager.dataType.DATA_COLOR */, false, Number.NaN, Number.NaN, (sender, refreshInput) => { this.Text_TextChanged(sender, refreshInput); });
            //((TextBox)input).BorderStyle = BorderStyle.None;
            //this. _parentPanel.Controls.Add(input);
            this.input.addEventListener("focusin", () => { this.control_GotFocus(this); });
            this.input.addEventListener("focusout", () => { this.control_LostFocus(this); });
            this.checkForReadOnly();
        }
    }
    expand() {
        if (this.colorEditor == null) {
            this.subElementPanel.style.marginLeft = "20px";
            this.colorEditor = new YoctoVisualization.colorEditor(this.subElementPanel, UIElement.defaultFontSize, this.currentColor, (c) => { this.coloredited(c); });
        }
        this._rootNode.tabReOrder(0);
        this._expanded = true;
        this.subElementPanel.style.display = "";
        this.expandCtrl.innerHTML = this.colapseIcon;
    }
    colapse() {
        //this.subElements.forEach((e: UIElement) => {e.hide(); });
        this.subElementPanel.style.display = "none";
        this.expandCtrl.innerHTML = this.expandIcon;
    }
    coloredited(newColor) {
        this.currentColor = newColor.clone();
        this.colorPreview.color = this.currentColor;
        this.input.value = this.currentColor.toString();
        Reflect.set(this._dataContainer, this._prop.name, this.currentColor);
        if (this._valueChangeCallback != null)
            this._valueChangeCallback(this);
        if (this._changeCausesParentRefresh)
            this.parentNode.refresh();
    }
    refresh() {
        if (this.input == null)
            return;
        if (this._getValueCallback == null)
            return;
        let c = this._getValueCallback(this);
        if (c != null) {
            if (this.colorPreview != null)
                this.colorPreview.color = c;
            if (this.input != null) {
                let s = c.toString();
                if (s != this.input.value)
                    this.input.value = s;
            }
        }
        this.checkForReadOnly();
    }
    Text_TextChanged(sender, refreshInput) {
        if (this.input != null) {
            this._value = this.input.value;
            let c = YDataRendering.YColor.FromString(this._value);
            if (c != null) {
                this.colorPreview.color = c;
                this.currentColor = c;
                if (this.colorEditor != null)
                    this.colorEditor.color = c;
                Reflect.set(this._dataContainer, this._prop.name, c);
                if (refreshInput)
                    this.input.value = c.toString();
                if (this._valueChangeCallback != null)
                    this._valueChangeCallback(this);
                if (this._changeCausesParentRefresh)
                    this.parentNode.refresh();
            }
        }
    }
    get value() { return this._value; }
    set value(value) {
        this._value = value;
        this.input.value = value;
    }
    resize(top, left1, left2, width) {
        let h = this.input.offsetHeight;
        this.mainlabel.style.height = h.toString() + "px";
        //this.colorSample.style.height=(h-3).toString()+"px";
        //super.resize(top, left1, left2, width);
        return 0; // top + input.Height;
    }
}
/***
 ***  UIElementMarkerPos
 ***/
export class UIElementMarkerPos extends UIElementGeneric {
    constructor(p, dataContainer, prop) {
        super(p, dataContainer, prop);
        this._cachedValue = null;
        this._value = "";
        this.preExpandIfNeeded();
    }
    static expandIconSVG(size) {
        return YoctoVisualization.ressources.targetIcon(size.toString(), false, false, false, false, "Click to place marker on graph");
    }
    get expandIcon() { return UIElementMarkerPos.expandIconSVG(UIElement.defaultFontSize); }
    get colapseIcon() { return UIElementMarkerPos.expandIconSVG(UIElement.defaultFontSize); }
    AllocateControls() {
        this._expandable = true;
        this._expandButtonSide = 1 /* ExpandButtonside.RIGHT */;
        super.AllocateControls();
        if (this.input == null) {
            let table = document.createElement("TABLE");
            table.style.position = "absolute";
            table.style.top = "0px";
            table.style.right = "3px";
            table.style.width = "50%";
            table.style.borderCollapse = "collapse";
            let tr = document.createElement("TR");
            table.appendChild(tr);
            let td2 = document.createElement("TD");
            td2.style.width = "100%";
            tr.appendChild(td2);
            this.input = document.createElement("INPUT");
            this.input.type = "input";
            this._cachedValue = Reflect.get(this._dataContainer, this._prop.name);
            this.input.value = this._cachedValue.toString();
            this.input.style.marginTop = "0px";
            this.input.style.marginBottom = "0px";
            this.input.style.textAlign = "right";
            this.input.style.width = "100%";
            this.input.style.border = "1px solid grey";
            this.input.style.borderRadius = "1px";
            this.input.style.fontFamily = UIElement.defaultFontFamily;
            this.input.style.fontSize = UIElement.defaultFontSize.toString() + "px";
            this.input.addEventListener("keyup", () => { this.Text_TextChanged(null, true); });
            this.input.addEventListener("change", () => { this.Text_TextChanged(null, false); });
            td2.appendChild(this.input);
            let td3 = document.createElement("TD");
            td3.style.paddingLeft = "5px";
            tr.appendChild(td3);
            td3.appendChild(this.expandCtrl);
            this.mainlabel.appendChild(table);
            //new InputFieldManager(input, InputFieldManager.dataType.DATA_STRING, true, Double.NaN, Double.NaN, Text_TextChanged);
            //((TextBox)input).BorderStyle = BorderStyle.None;
            //this. _parentPanel.Controls.Add(input);
            this.input.addEventListener("focusin", () => { this.control_GotFocus(this); });
            this.input.addEventListener("focusout", () => { this.control_LostFocus(this); });
            this.checkForReadOnly();
        }
    }
    expand() {
        let value = Reflect.get(this._dataContainer, this._prop.name);
        this.expanded = false;
        value.capture = true;
        Reflect.set(this._dataContainer, this._prop.name, value);
        if (this._valueChangeCallback != null)
            this._valueChangeCallback(this);
    }
    colapse() {
    }
    refresh() {
        if (this.input == null)
            return;
        if (this._getValueCallback == null)
            return;
        //this.currentPosition  =  Reflect.get(this._dataContainer,this._prop.name ) as YDataRendering.xAxisPosition;
        this._cachedValue = this._getValueCallback(this);
        if (this.input != null) {
            //debugger
            this.input.value = this._cachedValue.toString();
        }
        this.checkForReadOnly();
    }
    Text_TextChanged(sender, refreshInput) {
        let parsedValue = this._cachedValue.TryParse(this.input.value);
        if (parsedValue.success) {
            this._cachedValue.value = parsedValue.result;
            Reflect.set(this._dataContainer, this._prop.name, this._cachedValue);
            if (this._valueChangeCallback != null)
                this._valueChangeCallback(this);
            if (this._changeCausesParentRefresh)
                this.parentNode.refresh();
            // this.input.style.backgroundColor = "yellow";
        } //else this.input.style.backgroundColor = "pink";
    }
    get value() { return this._value; }
    set value(value) {
        this._value = value;
        this.input.value = value;
    }
    resize(top, left1, left2, width) {
        let h = this.input.offsetHeight;
        this.mainlabel.style.height = h.toString() + "px";
        //this.colorSample.style.height=(h-3).toString()+"px";
        //super.resize(top, left1, left2, width);
        return 0; // top + input.Height;
    }
}
export class InputFieldManager {
    static nullCallback(sender) { }
    constructor(input, type, allowEmpty, min, max, callback) {
        this._allowEmpty = false;
        this._min = Number.NaN;
        this._max = Number.NaN;
        this._callback = null;
        this._input = input;
        this._type = type;
        this._allowEmpty = allowEmpty;
        this._min = min;
        this._max = max;
        this._callback = callback;
        this.checkData();
        this._input.addEventListener("keyup", () => { this.InputChange(this._input, true); });
        this._input.addEventListener("change", () => { this.InputChange(this._input, false); });
    }
    showError(msg) {
        this._input.title = msg;
    }
    clearError() {
        this._input.title = "";
    }
    backGroundColorFeedback(ErrorMsg, state) {
        if (state)
            this.clearError();
        else
            this.showError(ErrorMsg);
        let c = this._input.style.backgroundColor;
        if ((state) && (c != "white"))
            this._input.style.backgroundColor = "white";
        if ((!state) && (c != "pink"))
            this._input.style.backgroundColor = "pink";
        return state;
    }
    checkData() {
        let intValue = 0;
        let doubleValue = 0;
        if (this._input.disabled)
            return true;
        let strValue = this._input.value;
        if (strValue == "")
            return this.backGroundColorFeedback("This field can't be empty", this._allowEmpty);
        switch (this._type) {
            case 0 /* InputFieldManager.dataType.DATA_STRING */:
                break;
            case 1 /* InputFieldManager.dataType.DATA_INT */:
                intValue = parseInt(strValue);
                doubleValue = parseFloat(strValue);
                if (Number.isNaN(intValue) || intValue != doubleValue)
                    return this.backGroundColorFeedback("Integer value expected", false);
                if ((!Number.isNaN(this._min)) && (intValue < this._min))
                    return this.backGroundColorFeedback("Integer value greater or equal to " + this._min.toString() + " expected", false);
                if ((!Number.isNaN(this._max)) && (intValue > this._max))
                    return this.backGroundColorFeedback("Integer value lower or equal to  " + this._min.toString() + " expected", false);
                break;
            case 2 /* InputFieldManager.dataType.DATA_POSITIVE_INT */:
                intValue = parseInt(strValue);
                doubleValue = parseFloat(strValue);
                if (Number.isNaN(intValue) || intValue != doubleValue)
                    return this.backGroundColorFeedback("Positive integer  expected", false);
                if (intValue < 0)
                    return this.backGroundColorFeedback("Positive integer value  expected", false);
                if ((!Number.isNaN(this._min)) && (intValue < this._min))
                    return this.backGroundColorFeedback("Positive integer value greater or equal to " + this._min.toString() + " expected", false);
                if ((!Number.isNaN(this._max)) && (intValue > this._max))
                    return this.backGroundColorFeedback("Positive integer value lower or equal to  " + this._min.toString() + " expected", false);
                break;
            case 3 /* InputFieldManager.dataType.DATA_STRICT_POSITIVE_INT */:
                intValue = parseInt(strValue);
                doubleValue = parseFloat(strValue);
                if (Number.isNaN(intValue) || intValue != doubleValue)
                    return this.backGroundColorFeedback("Strictly positive Integer value expected", false);
                if (intValue <= 0)
                    return this.backGroundColorFeedback("Strictly positive integer value  expected", false);
                if ((!Number.isNaN(this._min)) && (intValue < this._min))
                    return this.backGroundColorFeedback("Positive integer value greater or equal to " + this._min.toString() + " expected", false);
                if ((!Number.isNaN(this._max)) && (intValue > this._max))
                    return this.backGroundColorFeedback("Positive integer value lower or equal to  " + this._min.toString() + " expected", false);
                break;
            case 4 /* InputFieldManager.dataType.DATA_FLOAT */:
                doubleValue = parseFloat(strValue);
                if (Number.isNaN(intValue))
                    return this.backGroundColorFeedback("Floating point value expected", false);
                if ((!Number.isNaN(this._min)) && (doubleValue < this._min))
                    return this.backGroundColorFeedback("Floating point value greater or equal to " + this._min.toString() + " expected", false);
                if ((!Number.isNaN(this._max)) && (doubleValue > this._max))
                    return this.backGroundColorFeedback("Floating point value lower or equal to  " + this._min.toString() + " expected", false);
                break;
            case 5 /* InputFieldManager.dataType.DATA_POSITIVE_FLOAT */:
                doubleValue = parseFloat(strValue);
                if (Number.isNaN(doubleValue))
                    return this.backGroundColorFeedback("Positive floating point value expected", false);
                if (doubleValue < 0)
                    return this.backGroundColorFeedback("Positive floating point value expected", false);
                if (!Number.isNaN(this._min) && (doubleValue < this._min))
                    return this.backGroundColorFeedback("Floating point value greater or equal to " + this._min.toString() + " expected", false);
                if (!Number.isNaN(this._max) && (doubleValue > this._max))
                    return this.backGroundColorFeedback("Floating point value lower or equal to  " + this._min.toString() + " expected", false);
                break;
            case 6 /* InputFieldManager.dataType.DATA_STRICT_POSITIVE_FLOAT */:
                doubleValue = parseFloat(strValue);
                if (Number.isNaN(doubleValue))
                    return this.backGroundColorFeedback("Strictly positive floating point value expected", false);
                if (doubleValue <= 0)
                    return this.backGroundColorFeedback("Strictly positive floating point value expected", false);
                if (!Number.isNaN(this._min) && (doubleValue < this._min))
                    return this.backGroundColorFeedback("Floating point value greater or equal to " + this._min.toString() + " expected", false);
                if (!Number.isNaN(this._max) && (doubleValue > this._max))
                    return this.backGroundColorFeedback("Floating point value greater or equal to " + this._min.toString() + " expected", false);
                break;
            case 7 /* InputFieldManager.dataType.DATA_COLOR */:
                if (YDataRendering.YColor.FromString(strValue) == null)
                    return this.backGroundColorFeedback("Value color name/definition expected", false);
                break;
        }
        return this.backGroundColorFeedback("", true);
    }
    InputChange(sender, refreshInput) {
        if (this.checkData()) {
            try {
                if (this._callback != null)
                    this._callback(sender, refreshInput);
            }
            catch (ex) {
                this.backGroundColorFeedback(ex.message, false);
            }
        }
    }
}
//#endif

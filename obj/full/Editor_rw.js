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
import * as YoctoVisualization from "./YoctoVisualizationFull.js";
class EditedDataSource {
    constructor(source, root) {
        this._htmlchilds = [];
        this._source = source;
        this._root = root;
        this._htmlchilds = [];
    }
    storeChilds(childsList) {
        this._htmlchilds = [];
        for (let i = 0; i < childsList.length; i++) {
            this._htmlchilds.push(childsList.item(i));
        }
    }
    getStoredChilds() { return this._htmlchilds; }
    get root() { return this._root; }
    refresh() {
        if (this._root != null)
            this._root.refresh();
    }
}
class keyDataObject {
    constructor(key, data) {
        this.key = key;
        this.data = data;
    }
}
class objectDictionnary {
    constructor() {
        this.list = [];
    }
    isInlist(key) {
        for (let i = 0; i < this.list.length; i++) {
            if (key == this.list[i].key)
                return true;
        }
        return false;
    }
    find(key) {
        for (let i = 0; i < this.list.length; i++) {
            if (key == this.list[i].key)
                return this.list[i].data;
        }
        return null;
    }
    insert(key, data) {
        for (let i = 0; i < this.list.length; i++) {
            if (key == this.list[i].key) {
                this.list[i].data = data;
                return;
            }
        }
        this.list.push(new keyDataObject(key, data));
    }
}
export class EditorBaseDef {
    refresh() { }
    get panel() { return null; }
    get expanded() { return true; }
    ;
    AllocateControls() { }
}
export class PropertiesForm2 extends EditorBaseDef {
    get visible() { return this._window.visible; }
    set visible(v) {
        v ? this.show() : this.hide();
    }
    get text() { return this._text; }
    set text(value) {
        this._text = value;
        this._window.title = this._text;
    }
    get help() { return this._helpText; }
    set help(value) {
        this._helpText = value;
        this._helpPanel.innerHTML = this._helpText;
    }
    addTest(parentDiv) {
        PropertiesForm2.testid++;
        let mainlabel = document.createElement("DIV");
        mainlabel.style.position = "relative";
        mainlabel.style.display = "inline-block;";
        mainlabel.style.left = "0px";
        mainlabel.style.padding = "2px 2px 2px 2px";
        mainlabel.style.right = "5px";
        mainlabel.style.border = "1px solid black";
        mainlabel.style.marginTop = "2px";
        mainlabel.style.backgroundColor = "yellow";
        if (parentDiv != null) {
            parentDiv.appendChild(mainlabel);
        }
        else {
            this._container.appendChild(mainlabel);
        }
        let expandCtrl = document.createElement("ANCHOR");
        expandCtrl.innerText = "[+]";
        mainlabel.appendChild(expandCtrl);
        let mainText = document.createElement("SPAN");
        mainText.innerText = "Pouet " + PropertiesForm2.testid.toString();
        mainlabel.appendChild(mainText);
        let subElementPanel = document.createElement("DIV");
        subElementPanel.style.position = "relative";
        subElementPanel.style.display = "inline-block;";
        subElementPanel.style.left = "5px";
        subElementPanel.style.padding = "2px 2px 2px 2px";
        subElementPanel.style.right = "5px";
        subElementPanel.style.marginTop = "2px";
        subElementPanel.style.backgroundColor = "lightgray";
        subElementPanel.innerText = "sub elements";
        if (parentDiv != null) {
            parentDiv.appendChild(subElementPanel);
        }
        else {
            this._container.appendChild(subElementPanel);
        }
        return subElementPanel;
    }
    editorIsClosing(source) {
        if (this._editorClosedCallback != null)
            this._editorClosedCallback();
    }
    bestWidth() {
        let w = ((window.innerWidth / 4) >> 0);
        let minWidth = 275 * YoctoVisualization.constants.guiDPIFactor;
        if (w < minWidth)
            w = minWidth;
        if (w > window.innerWidth - 10)
            (w = window.innerWidth - 10);
        return w;
    }
    constructor() {
        super();
        this._hostWindow = null;
        this._editorClosedCallback = null;
        this.currentEditedDataSource = null;
        this._changeCallback = null;
        this._getvalueCallback = null;
        this._text = "Properties editor";
        this._helpText = "Properties editor";
        this.EditedDataSourceList = new objectDictionnary();
        let params = new YoctoVisualization.newWindowParam();
        params.positionType = 2 /* YoctoVisualization.WindowPositionType.SIDEANCHORED */;
        params.width = this.bestWidth();
        params.createNow = true;
        params.closingCallBack = (source) => { this.editorIsClosing(source); };
        params.bottomKeepClear = PropertiesForm2.HelpHeight + 3 * YoctoVisualization.constants.WindowPadding;
        params.title = this._text;
        this._window = new YoctoVisualization.YWindow(params);
        this._container = this._window.innerContentDiv;
        this._helpPanel = document.createElement("DIV");
        this._helpPanel.style.position = "absolute";
        this._helpPanel.style.left = YoctoVisualization.constants.WindowPadding.toString() + "px";
        this._helpPanel.style.bottom = YoctoVisualization.constants.WindowPadding.toString() + "px";
        this._helpPanel.style.right = YoctoVisualization.constants.WindowPadding.toString() + "px";
        this._helpPanel.style.height = PropertiesForm2.HelpHeight.toString() + "px";
        this._helpPanel.style.paddingLeft = "5px";
        this._helpPanel.style.paddingTop = "5px";
        this._helpPanel.style.overflowY = "auto";
        this._helpPanel.style.border = YoctoVisualization.constants.WindowInnerBorder;
        this._helpPanel.style.backgroundColor = YoctoVisualization.constants.WindowInnerBackgroundColor;
        this._helpPanel.style.fontFamily = YoctoVisualization.constants.generalFontFamily;
        this._helpPanel.style.fontSize = YoctoVisualization.constants.generalFontSize.toString() + "px";
        this._helpPanel.style.color = "black";
        this._helpPanel.style.display = "";
        this._helpPanel.innerHTML = "Help panel. Editor is loading, please wait....";
        this._window.outterContentDiv.appendChild(this._helpPanel);
        this._container.style.overflowY = "scroll";
        this._container.style.overflowX = "hidden";
        this._container.style.backgroundColor = YoctoVisualization.constants.WindowInnerBackgroundColor;
        window.addEventListener("resize", () => { this.windowResized(); });
    }
    windowResized() {
        if (this._window.innerContentDiv == null)
            return;
        if ((this._window.innerContentDiv.offsetHeight < PropertiesForm2.MinHeightforShowingHelp) && (this._helpPanel.style.display == "")) {
            this._helpPanel.style.display = "none";
            this._window.bottomKeepClear = 0;
        }
        else if ((this._window.innerContentDiv.offsetHeight >= PropertiesForm2.MinHeightforShowingHelp + PropertiesForm2.HelpHeight) && (this._helpPanel.style.display != "")) {
            this._helpPanel.style.display = "";
            this._window.bottomKeepClear = PropertiesForm2.HelpHeight;
        }
    }
    show() {
        this._window.show(this.bestWidth());
        this.windowResized();
    }
    hide() {
        YoctoVisualization.YWidget.stopEdition();
        this._window.hide();
    }
    get panel() { return this._container; }
    refresh() {
        if (!this.visible)
            return;
        if (this.currentEditedDataSource == null)
            return;
        this.currentEditedDataSource.refresh();
    }
    refreshBanner() {
        if (this._hostWindow != null) {
            this.text = "Properties of " + this._hostWindow.Text;
        }
    }
    showWindow(hostWindow, structData, setvalueCallBack, getvalueCallBack, EditStoppedCallBack) {
        this._hostWindow = hostWindow;
        this._changeCallback = setvalueCallBack;
        this._getvalueCallback = getvalueCallBack;
        this.text = "Properties editor";
        this.show();
        this.refreshBanner();
        this.EditObject(structData, setvalueCallBack, getvalueCallBack, EditStoppedCallBack);
    }
    EditObject(structData, setvalueCallBack, getvalueCallBack, EditStoppedCallBack) {
        this._editorClosedCallback = EditStoppedCallBack;
        let helpYourselfMsg = "This is the property editor. Change any parameter you want. All changes are applied in real time.";
        if (!this.visible)
            return;
        this.help = "Please wait....";
        if (this.EditedDataSourceList.isInlist(structData)) {
            if (this.EditedDataSourceList.find(structData) == this.currentEditedDataSource) {
                this.help = helpYourselfMsg;
                return;
            }
        }
        if (this.currentEditedDataSource != null) {
            this.currentEditedDataSource.root.stopEdit();
            this.currentEditedDataSource.storeChilds(this._container.childNodes);
            while (this._container.firstChild) {
                this._container.removeChild(this._container.lastChild);
            }
        }
        let it;
        if (!this.EditedDataSourceList.isInlist(structData)) {
            let rootparam = new YoctoVisualization.UIElementBaseParams(this._helpPanel, this, null, "root", "Root", "root node", "");
            it = new YoctoVisualization.UIElement(rootparam);
            it.rootEditor = this;
            this.currentEditedDataSource = new EditedDataSource(structData, it);
            this.EditedDataSourceList.insert(structData, this.currentEditedDataSource);
            it.showLabel = false;
            it.expandable = true;
            it.ProcessNewType(structData);
            it.expanded = true;
        }
        else {
            this.currentEditedDataSource = this.EditedDataSourceList.find(structData);
            let childNodes = this.currentEditedDataSource.getStoredChilds();
            for (let i = 0; i < childNodes.length; i++) {
                (this._container.appendChild(childNodes[i]));
            }
            this.currentEditedDataSource.refresh();
        }
        this.currentEditedDataSource.root.startEdit(setvalueCallBack, getvalueCallBack);
        this.currentEditedDataSource.root.resizeAll();
        this.help = helpYourselfMsg;
    }
    getConfigData() {
        let p = this._window.outterContentDiv.getBoundingClientRect();
        return "<PropertiesForm>\n"
            + "<location x='" + p.left.toString() + "' y='" + p.top.toString() + "'/>\n"
            + "<size     w='" + p.width.toString() + "' h='" + p.width.toString() + "'/>\n"
            + "</PropertiesForm>\n";
    }
    Form1_SizeChanged(sender) {
        if (this.currentEditedDataSource == null)
            return;
        if (this.currentEditedDataSource.root != null)
            this.currentEditedDataSource.root.resizeAll();
    }
    valuechange(src) {
        let OriginalPropName = "";
        let fullpropname = "";
        let propType = "";
        if (this._changeCallback != null)
            this._changeCallback(src);
    }
}
PropertiesForm2.HelpHeight = Math.round(75 * YoctoVisualization.constants.generalSizeCoef);
PropertiesForm2.MinHeightforShowingHelp = 175;
PropertiesForm2.testid = 0;
//#endif

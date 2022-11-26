/*
*   Yocto-Visualization (for web), a free web-based application
*   to visualize Yoctopuce Sensors.
*
*  all reflexion bases properties management
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
export class YXmlNode {
    constructor(node) {
        this.node = node;
    }
    get Name() { return this.node.nodeName; }
    get_childsByName() {
        let res = {};
        this.node.childNodes.forEach(child => { res[child.nodeName] = new YXmlNode(child); });
        return res;
    }
    get_childsByIndex() {
        let res = [];
        this.node.childNodes.forEach(child => { res.push(new YXmlNode(child)); });
        return res;
    }
    get_attributes() {
        let el = this.node;
        let res = {};
        let keys = el.getAttributeNames();
        for (let i = 0; i < keys.length; i++) {
            res[keys[i]] = el.getAttribute(keys[i]);
        }
        // this.node.childNodes.forEach(child => { res[child.nodeName] = child;})
        return res;
    }
    get Attributes() { return this.get_attributes(); }
}
class PropertyAccess {
    constructor() {
        this.ttype = "";
        this.stype = "";
        this.finalTarget = null;
        this.terminalSource = null;
        this.propertyName = null;
    }
}
export class doubleNan {
    constructor(v) {
        this._value = Number.NaN;
        if (typeof v == "undefined") {
            return;
        }
        else if (typeof v == "number") {
            this._value = v;
        }
        else if (typeof v == "string") {
            if (v == "") {
                this._value = Number.NaN;
            }
            else {
                this._value = Number(v);
            }
        }
        else {
            debugger;
        } // init value type is definitely wrong.
    }
    toString() {
        if (Number.isNaN(this._value))
            return "";
        return this._value.toString();
    }
    clone() { return new doubleNan(this.value); }
    get value() { return this._value; }
    set value(value) { this._value = value; }
}
export class PropertyDescriptor {
    constructor(name) {
        this.isWritable = false;
        this.isEnum = false;
        this.type = "";
        this.Attributes = {};
        this.name = name;
    }
}
export class PropertiesList {
    constructor() {
        this.byIndex = [];
        this.byName = {};
    }
}
class PropDescription {
    constructor(name, prop) {
        this.name = name;
        this.prop = prop;
    }
}
export class GenericProperties {
    static NoFilter(propNname) { return true; }
    static escapeXml(unsafe) {
        return unsafe.replace(/[^ !#$%(-;=?-z]/g, (c) => '&#' + c.charCodeAt(0) + ';'); // MV power!  :-)
    }
    constructor(Owner) {
        this._Form_Text = "New window";
        this._Form_BackColor = YDataRendering.YColor.FromArgb(0xff, 0xf0, 0xf0, 0xf0);
        this._Form_BorderColor = YDataRendering.YColor.LightGray;
        this._SizeIsRelative = false;
        this._Form_PositionX = 0;
        this._Form_PositionY = 0;
        this._Form_Width = 300;
        this._Form_Height = 200;
        this._containerID = "";
        this.ownerForm = Owner;
        this._Form_Text = "new window"; //  StartForm.newWindowName();
    }
    destroy() {
        Object.entries(this).forEach((pair) => { Reflect.set(this, pair[0], null); }); // sets all internal variables to NULL
    }
    initFromXmlData(initData) {
        if (initData != null)
            this.loadProperties(initData, this.ownerForm, this);
    }
    loadProperties(initData, Owner, o) {
        let value;
        this.ownerForm = Owner;
        if (initData != null) {
            let properties = GenericProperties.getAllProperties(o);
            let childs = initData.get_childsByName();
            for (let propname in properties.byName) {
                let p = properties.byName[propname];
                if (p.isWritable) {
                    for (let childName in childs) {
                        if (childName == propname) {
                            let target = Reflect.get(o, propname);
                            let Mustload = true;
                            if ("NotSavedInXMLAttribute" in p.Attributes) {
                                Mustload = p.Attributes["NotSavedInXMLAttribute"];
                            }
                            if (Mustload) {
                                if (GenericProperties.IsStructured(target)) {
                                    this.loadProperties(childs[childName], Owner, target);
                                }
                                else {
                                    let targetType = typeof target;
                                    let attributes = childs[childName].get_attributes();
                                    let value = attributes["value"];
                                    //console.log(childName+" : "+targetType+" = "+value);
                                    // sensor
                                    if (target instanceof YoctoVisualization.CustomYSensor) {
                                        if ((value.toUpperCase() != "NULL") && (value != "")) {
                                            let s = YoctoVisualization.sensorsManager.AddNewSensor(value);
                                            Reflect.set(o, propname, s);
                                        }
                                        else {
                                            Reflect.set(o, propname, YoctoVisualization.sensorsManager.getNullSensor());
                                        }
                                    }
                                    else if (target instanceof YDataRendering.YEnumItem) { //let  d :  YoctoVisualization.doubleNan =  new YoctoVisualization.doubleNan(value);
                                        Reflect.set(o, propname, target.fromString(value));
                                    }
                                    else if (target instanceof YoctoVisualization.doubleNan) {
                                        let d = new YoctoVisualization.doubleNan(value);
                                        Reflect.set(o, propname, d);
                                    }
                                    else if (target instanceof YDataRendering.xAxisPosition) {
                                        let xpos = Number(value);
                                        let rel = attributes["relative"].toUpperCase() == "TRUE";
                                        Reflect.set(o, propname, new YDataRendering.xAxisPosition(xpos, rel));
                                    }
                                    else if (target instanceof YDataRendering.YColor) {
                                        let c = YDataRendering.YColor.FromString(value);
                                        if (c == null)
                                            c = YDataRendering.YColor.Black;
                                        Reflect.set(o, propname, c.clone());
                                    }
                                    else if (target instanceof YDataRendering.YFont) {
                                        let size = attributes["size"];
                                        let color = attributes["color"];
                                        let italic = attributes["italic"];
                                        let bold = attributes["bold"];
                                        let f = Reflect.get(o, propname);
                                        f.name = value;
                                        f.size = size !== "undefined" ? Number(size) : 10;
                                        let c = YDataRendering.YColor.FromString(color);
                                        f.color = c != null ? c : YDataRendering.YColor.Black.clone();
                                        f.italic = italic.toUpperCase() == "TRUE";
                                        f.bold = bold.toUpperCase() == "TRUE";
                                    }
                                    else {
                                        switch (targetType) {
                                            case "string":
                                                Reflect.set(o, propname, value);
                                                break;
                                            case "number":
                                                Reflect.set(o, propname, Number(value));
                                                break;
                                            case "boolean":
                                                let v = value.toUpperCase() == "TRUE";
                                                Reflect.set(o, propname, v);
                                                break;
                                            default:
                                                debugger;
                                                throw "unhandled target type : " + targetType + "(" + target.constructor.name + ")";
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    get ATTR_Form_Text__DisplayName() { return "Window title"; }
    get ATTR_Form_Text__CategoryAttribute() { return "Window"; }
    get ATTR_Form_Text__ChangeCausesParentRefreshAttribute() { return true; }
    get ATTR_Form_Text__DescriptionAttribute() { return "Widget name. This name is not show on display, but it might help you to identify each widget. "; }
    get Form_Text() { return this._Form_Text; }
    set Form_Text(value) { this._Form_Text = value; }
    get ATTR_Form_BackColor__DisplayName() { return "Background color"; }
    get ATTR_Form_BackColor__CategoryAttribute() { return "Window"; }
    get ATTR_Form_BackColor__DescriptionAttribute() { return "Window background color."; }
    get Form_BackColor() { return this._Form_BackColor; }
    set Form_BackColor(value) { this._Form_BackColor = value; }
    get ATTR_Form_BorderColor__DisplayName() { return "Border color"; }
    get ATTR_Form_BorderColor__CategoryAttribute() { return "Window"; }
    get ATTR_Form_BorderColor__DescriptionAttribute() { return "Window border color, use transparent color to hide the border."; }
    get Form_BorderColor() { return this._Form_BorderColor; }
    set Form_BorderColor(value) { this._Form_BorderColor = value; }
    get ATTR_Form_SizeIsRelative__NotSavedInXMLAttribute() { return true; }
    get ATTR_Form_SizeIsRelative__DisplayName() { return "Rel. size and pos."; }
    get ATTR_Form_SizeIsRelative__CategoryAttribute() { return "Window"; }
    get ATTR_Form_SizeIsRelative__DescriptionAttribute() { return "Makes widget size and position relative to container size. This, for instance, allows to make a widget automatically occupy all of the browser viewport, no matter the browser window size. In relative mode, position and size value are expressed in %"; }
    get ATTR_Form_SizeIsRelative__ChangeCausesParentRefreshAttribute() { return true; }
    get Form_SizeIsRelative() { return this._SizeIsRelative; }
    set Form_SizeIsRelative(value) { this._SizeIsRelative = value; }
    // Form/widget positions are handled differently (inheritance from the C# version)
    get ATTR_Form_PositionX__NotSavedInXMLAttribute() { return true; }
    get ATTR_Form_PositionX__DisplayName() { return "Left"; }
    get ATTR_Form_PositionX__CategoryAttribute() { return "Window"; }
    get ATTR_Form_PositionX__DescriptionAttribute() { return "Widget left border X position"; }
    get Form_PositionX() { return this._Form_PositionX; }
    set Form_PositionX(value) { this._Form_PositionX = value; }
    // Form/widget positions are handled differently (inheritance from the C# version)
    get ATTR_Form_PositionY__NotSavedInXMLAttribute() { return true; }
    get ATTR_Form_PositionY__DisplayName() { return "Top"; }
    get ATTR_Form_PositionY__CategoryAttribute() { return "Window"; }
    get ATTR_Form_PositionY__DescriptionAttribute() { return "Widget top border Y position"; }
    get Form_PositionY() { return this._Form_PositionY; }
    set Form_PositionY(value) { this._Form_PositionY = value; }
    // Form/widget positions are handled differently (inheritance from the C# version)
    get ATTR_Form_Width__NotSavedInXMLAttribute() { return true; }
    get ATTR_Form_Width__DisplayName() { return "Width"; }
    get ATTR_Form_Width__CategoryAttribute() { return "Window"; }
    get ATTR_Form_Width__DescriptionAttribute() { return "Widget width"; }
    get Form_Width() { return this._Form_Width; }
    set Form_Width(value) { this._Form_Width = value; }
    // Form/widget positions are handled differently (inheritance from the C# version)
    get ATTR_Form_Height__NotSavedInXMLAttribute() { return true; }
    get ATTR_Form_Height__DisplayName() { return "Height"; }
    get ATTR_Form_Height__CategoryAttribute() { return "Window"; }
    get ATTR_Form_Height__DescriptionAttribute() { return "Widget height"; }
    get Form_Height() { return this._Form_Height; }
    set Form_Height(value) { this._Form_Height = value; }
    get ATTR_Form_containerID__NotSavedInXMLAttribute() { return true; }
    get ATTR_Form_containerID__DisplayName() { return "Container ID"; }
    get ATTR_Form_containerID__CategoryAttribute() { return "Window"; }
    get ATTR_Form_containerID__DescriptionAttribute() { return "Forces the widget to be shown inside an HTML element with a specific ID already present on the page. If ID is empty, the widget is inserted at root level. Be aware that X,Y offsets are kept, you may want to set them to Zero. "; }
    get Form_containerID() { return this._containerID; }
    set Form_containerID(value) { this._containerID = value; }
    indent(n) { return " ".repeat(n); }
    //#ifndef READONLY
    getXml(deep, o) {
        if (typeof (o) == "undefined")
            o = this;
        let res = "";
        let value = "";
        let properties = GenericProperties.getAllProperties(o);
        let propName = "";
        for (propName in properties.byName) {
            let p = properties.byName[propName];
            if (p.isWritable) {
                let Mustsave = true;
                if ("NotSavedInXMLAttribute" in p.Attributes)
                    Mustsave = !p.Attributes["NotSavedInXMLAttribute"];
                let child = Reflect.get(o, p.name);
                if (GenericProperties.IsStructured(child)) {
                    if (Mustsave) {
                        res = res + this.indent(2 * deep) + "<" + p.name + ">\r\n"
                            + this.getXml(deep + 1, child)
                            + this.indent(2 * deep) + "</" + p.name + ">\r\n";
                    }
                }
                else {
                    if (Mustsave) {
                        if (child instanceof YDataRendering.YEnumItem) {
                            value = child.toString;
                        }
                        else {
                            let type = typeof (child);
                            if (type == "object")
                                type = child.constructor.name;
                            switch (type) {
                                case "boolean":
                                    value = child ? "TRUE" : "FALSE";
                                    break;
                                case "number":
                                    value = child.toString();
                                    break;
                                case "string":
                                    value = YoctoVisualization.GenericProperties.escapeXml(child);
                                    break;
                                case YDataRendering.YColor.name:
                                    value = child.toString();
                                    break;
                                case YoctoVisualization.doubleNan.name:
                                    value = child.value.toString();
                                    break;
                                case YDataRendering.xAxisPosition.name:
                                    let it = child;
                                    value = it.value.toString() + "\" relative=\"" + (it.relative ? "True" : "False");
                                    break;
                                case YoctoVisualization.NullYSensor.name:
                                case YoctoVisualization.CustomYSensor.name:
                                    let s = child;
                                    value = ((s == null) || (s instanceof YoctoVisualization.NullYSensor)) ? "NULL" : s.get_hardwareId();
                                    break;
                                default:
                                    throw "XML generation : unhandled type (" + p.type + ")";
                            }
                        }
                        res = res + this.indent(2 * deep) + "<" + p.name + " value=\"" + value + "\"/>\n";
                    }
                }
            }
        }
        return res;
    }
    //#endif
    static IsStructured(o) {
        if (o == null)
            return false;
        if (typeof o === 'string' || o instanceof String)
            return false;
        if (typeof o === 'number' || o instanceof Number)
            return false;
        if (typeof o === 'boolean' || o instanceof Boolean)
            return false;
        if (o instanceof YDataRendering.YEnumItem)
            return false;
        if (o instanceof YoctoVisualization.CustomYSensor)
            return false;
        if (o instanceof YDataRendering.YColor)
            return false;
        if (o instanceof doubleNan)
            return false;
        if (o instanceof YDataRendering.xAxisPosition)
            return false;
        if (Object.getOwnPropertyNames(o).length > 0)
            return true; // sure this is doing what I think
        return false;
    }
    static getObjectFromPath(rootTarget, path) {
        let FinalTarget = rootTarget;
        for (let i = 0; i < path.length - 1; i++) {
            let name = path[i];
            let index = "";
            while (name.charCodeAt(name.length - 1) >= 48 && name.charCodeAt(name.length - 1) <= 57) {
                index = name.charAt(name.length - 1) + index;
                name = name.substring(0, name.length - 1);
            }
            if (index == "") {
                FinalTarget = Reflect.get(FinalTarget, name);
            }
            else {
                let arrayObject = Reflect.get(FinalTarget, name);
                FinalTarget = Reflect.get(arrayObject, parseInt(index));
            }
        }
        return FinalTarget;
    }
    //Direction Settings From Target
    static computePropertyAccess_SFT(WidgetObject, SettingObject, propertySourceName, path) {
        let res = new PropertyAccess();
        res.ttype = "";
        res.stype = "";
        res.finalTarget = null;
        res.terminalSource = null;
        // FinalTarget = getObjectFromPath(WidgetObject, path);
        res.terminalSource = GenericProperties.getObjectFromPath(WidgetObject, path);
        let props = GenericProperties.getAllProperties(res.terminalSource);
        if (!(path[path.length - 1] in props.byName))
            return res;
        res.stype = typeof (res.terminalSource[path[path.length - 1]]);
        if ((res.stype == "object") && (res.terminalSource[path[path.length - 1]] != null)) {
            res.stype = res.terminalSource[path[path.length - 1]].constructor.name;
        }
        res.terminalSource = res.terminalSource[path[path.length - 1]];
        if (res.terminalSource == null)
            return res;
        res.propertyName = propertySourceName;
        res.finalTarget = SettingObject;
        let o = res.finalTarget[propertySourceName];
        res.ttype = typeof (o);
        if ((res.ttype == "object") && (o != null))
            res.ttype = o.constructor.name;
        //debugger
        if (path.length <= 1)
            return res;
        for (let i = 1; i < path.length; i++) {
            res.finalTarget = res.finalTarget[res.propertyName];
            res.propertyName = path[i];
        }
        res.ttype = typeof (res.finalTarget[res.propertyName]);
        if ((res.ttype == "object") && (res.finalTarget[res.propertyName] != null))
            res.ttype = res.finalTarget[res.propertyName].constructor.name;
        return res;
    }
    static Reflect_getIndexed(o, indexedProp) {
        //  indexedProp is ending with digit, then o is supposed to
        //  be an array, but not always (see angularGauge.needleLength1 )
        let res = Reflect.get(o, indexedProp);
        if (typeof res !== "undefined")
            return res; // ugly fix about indexes properties
        let name = indexedProp;
        let index = "";
        while (name.charCodeAt(name.length - 1) >= 48 && name.charCodeAt(name.length - 1) <= 57) {
            index = name.charAt(name.length - 1) + index;
            name = name.substring(0, name.length - 1);
        }
        if (index == "") {
            return null;
            //throw "Reflect_getIndexed : cannot find property  " + indexedProp + " in class " + o.constructor.name // oops
        }
        res = Reflect.get(o, name);
        return Reflect.get(res, parseInt(index));
    }
    static computePropertyAccess(rootTarget, source, propertySourceName, path) {
        let res = new PropertyAccess;
        res.ttype = "";
        res.finalTarget = GenericProperties.getObjectFromPath(rootTarget, path);
        res.terminalSource = source;
        res.terminalSource = Reflect.get(res.terminalSource, propertySourceName);
        for (let i = 1; i < path.length; i++) {
            res.terminalSource = Reflect.get(res.terminalSource, path[i]);
        }
        res.stype = typeof res.terminalSource;
        if (res.stype == "object")
            res.stype = res.terminalSource.constructor.name;
        if (path.length > 0) {
            res.propertyName = path[path.length - 1];
            let o = GenericProperties.Reflect_getIndexed(rootTarget, path[0]);
            if (o == null)
                return null;
            for (let i = 1; i < path.length; i++) {
                try {
                    o = GenericProperties.Reflect_getIndexed(o, path[i]);
                    //o=Reflect.get(o, path[i]);
                }
                catch (e) {
                    debugger;
                }
            } // something went wrong: cannot descent inside target object
            res.ttype = typeof o;
            if (res.ttype == "object")
                res.ttype = o.constructor.name;
        }
        else {
            let targetname = propertySourceName;
            let n = targetname.indexOf("__");
            res.propertyName = targetname.substring(n + 2);
            let o = Reflect.get(rootTarget, res.propertyName);
            res.ttype = typeof o;
            if (res.ttype == "object")
                res.ttype = o.constructor.name;
        }
        return res;
    }
    static newGetProperty(rootTarget, source, propertySourceName, path, filterAllow) {
        let access = GenericProperties.computePropertyAccess(rootTarget, source, propertySourceName, path);
        if (access == null)
            return null;
        return Reflect.get(access.finalTarget, access.propertyName);
    }
    // Direction : settings From Target
    //Direction : Settings From Target
    //   public static   copyProperty_SFT( rootTarget:object , source :object ,  propertySourceName: string, path: string[]): void
    //     {
    //     copyProperty_SFT(rootTarget, source, propertySourceName, path,  GenericProperties.NoFilter);
    //     }
    static copyProperty_SFT(rootTarget, source, propertySourceName, path, filterAllow) {
        // if ( typeof filterAllow =="undefined")  filterAllow = GenericProperties.NoFilter
        let ttype = "";
        let stype = "";
        let TerminalSource = null;
        let p = GenericProperties.computePropertyAccess_SFT(rootTarget, source, propertySourceName, path);
        if (p.finalTarget == null)
            return; // the property does not exist in the widget
        ttype = p.ttype;
        stype = p.stype;
        if ((stype == YDataRendering.YColor.name) && (ttype == YDataRendering.YColor.name)) {
            Reflect.set(p.finalTarget, p.propertyName, p.terminalSource.clone());
        }
        else if ((stype == YDataRendering.xAxisPosition.name) && (ttype == YDataRendering.xAxisPosition.name)) {
            Reflect.set(p.finalTarget, p.propertyName, p.terminalSource.clone());
        }
        else if ((p.stype == "number") && (ttype == YoctoVisualization.doubleNan.name)) {
            Reflect.set(p.finalTarget, p.propertyName, new doubleNan(p.terminalSource));
        }
        else {
            Reflect.set(p.finalTarget, p.propertyName, p.terminalSource);
        }
    }
    //Direction :Settings To Target
    /*
  static public  copyProperty_STT(object rootTarget, object source, string propertySourceName, List<string> path) : void
  {
  copyProperty_STT(rootTarget, source, propertySourceName, path,  NoFilter);
  }
   */
    //Direction :Settings To Target
    static copyProperty_STT(rootTarget, source, propertySourceName, path, filterAllow) {
        // if (typeof filterAllow === 'undefined') filterAllow = GenericProperties.NoFilter;
        let p = GenericProperties.computePropertyAccess(rootTarget, source, propertySourceName, path);
        if (p == null)
            return;
        if ((p.stype == YoctoVisualization.doubleNan.name) && (p.ttype == "number")) {
            let v = p.terminalSource.value;
            if (Reflect.get(p.finalTarget, p.propertyName) != v) {
                Reflect.set(p.finalTarget, p.propertyName, v);
                //#ifndef READONLY
                YoctoVisualization.constants.edited = true;
                //#endif
            }
        }
        else if (p.stype != p.ttype) {
            debugger;
        } // something went wrong source and target type don't match
        else if ((p.stype == YDataRendering.YColor.name) && (p.ttype == YDataRendering.YColor.name)) {
            let color = p.terminalSource;
            if (!color.equal(Reflect.get(p.finalTarget, p.propertyName))) {
                Reflect.set(p.finalTarget, p.propertyName, color.clone());
                //#ifndef READONLY
                YoctoVisualization.constants.edited = true;
                //#endif
            }
        }
        else if ((p.stype == YoctoVisualization.doubleNan.name) && (p.ttype == YoctoVisualization.doubleNan.name)) {
            let v = p.terminalSource;
            if (Reflect.get(p.finalTarget, p.propertyName) != v) {
                Reflect.set(p.finalTarget, p.propertyName, v.clone());
                //#ifndef READONLY
                YoctoVisualization.constants.edited = true;
                //#endif
            }
        }
        else if ((p.stype == YDataRendering.xAxisPosition.name) && (p.ttype == YDataRendering.xAxisPosition.name)) {
            let x = p.terminalSource;
            let x2 = Reflect.get(p.finalTarget, p.propertyName);
            if ((x.relative != x2.relative) || (x.value != x2.value)) {
                Reflect.set(p.finalTarget, p.propertyName, x.clone());
                //#ifndef READONLY
                YoctoVisualization.constants.edited = true;
                //#endif
            }
        }
        else if (Reflect.get(p.finalTarget, p.propertyName) != p.terminalSource) {
            Reflect.set(p.finalTarget, p.propertyName, p.terminalSource);
            //#ifndef READONLY
            YoctoVisualization.constants.edited = true;
            //#endif
        }
    }
    ApplyAllProperties(target) { this.ApplyAllPropertiesEx(target, GenericProperties.NoFilter, 0 /* GenericProperties.APPLYDIRECTION.SETTINGS_TO_TARGET */); }
    RefreshAllProperties(target) { this.ApplyAllPropertiesEx(target, GenericProperties.NoFilter, 1 /* GenericProperties.APPLYDIRECTION.SETTINGS_FROM_TARGET */); }
    ApplyProperties(rootSource, rootTarget, fullpropname, sourceValue, path, direction) {
        if (sourceValue instanceof YoctoVisualization.AlarmSection)
            return; // dirty hack: alarms are not handled through reflexion
        let sourceproperties = GenericProperties.getAllProperties(this);
        if ("CopyToTarget" in sourceproperties.byName[fullpropname].Attributes) {
            if (!sourceproperties.byName[fullpropname].Attributes["CopyToTarget"]) {
                return;
            }
        }
        if (!GenericProperties.IsStructured(sourceValue)) {
            if (direction == 0 /* GenericProperties.APPLYDIRECTION.SETTINGS_TO_TARGET */) {
                GenericProperties.copyProperty_STT(rootTarget, this, fullpropname, path);
            }
            else {
                GenericProperties.copyProperty_SFT(rootTarget, this, fullpropname, path);
            }
        }
        else {
            // map all target's user data to its mirrored source
            let path2 = path.slice(); // array Close
            path2.push("");
            let target = GenericProperties.getObjectFromPath(rootTarget, path2);
            Reflect.set(target, "userData", sourceValue);
            // recursive decent in structured property
            let sourceproperties = GenericProperties.getAllProperties(sourceValue);
            for (let subpropname in sourceproperties.byName) {
                let shouldcopy = true;
                if ("CopyToTarget" in sourceproperties.byName[subpropname].Attributes) {
                    shouldcopy = sourceproperties.byName[subpropname].Attributes["CopyToTarget"];
                }
                if ((sourceproperties.byName[subpropname].isWritable) && shouldcopy) {
                    path.push(subpropname);
                    this.ApplyProperties(rootSource, rootTarget, fullpropname, Reflect.get(sourceValue, subpropname), path, direction);
                    path.splice(path.length - 1, 1);
                }
            }
        }
    }
    // will return true  if property has a getter or a setter
    static isProperty(proto, propName) {
        let d = Reflect.getOwnPropertyDescriptor(proto, propName); // unknown type , no info found in API
        let list = Object.getOwnPropertyNames(d);
        for (let i = 0; i < list.length; i++) {
            if (list[i] == "set")
                return true;
            if (list[i] == "get")
                return true;
        }
        return false;
    }
    // will return true if property has  an implemented  setter
    static isWritable(proto, propName) {
        let d = Reflect.getOwnPropertyDescriptor(proto, propName); // unknown type , no info found in API
        let list = Object.getOwnPropertyNames(d);
        for (let i = 0; i < list.length; i++) {
            if (list[i] == "set") { // @ts-ignore
                if (typeof (d.set) !== "undefined")
                    return true;
            }
        }
        return false;
    }
    static getAllProperties(o) {
        if (typeof (o) === "undefined")
            debugger;
        // this is the YoctoVisualization "magic"  function
        //
        // we are trying to construct a list of all o object public properties
        // (getter and setter). Since enumerating the object key only return
        // the object "variables" we iterate through the object prototype,
        // and through the object parent to get inherited properties as well.
        // this function is quite heavy and can be called many times
        // for the same object, so we store the result in the
        // object itself for future uses
        if (o.hasOwnProperty('PropertiesDescriptionCache')) {
            return o["PropertiesDescriptionCache"];
        }
        let proto = Object.getPrototypeOf(o);
        let res = new PropertiesList();
        let p = proto;
        let entries = [];
        let genealogy = [];
        while (p != null) {
            genealogy.push(p);
            p = Object.getPrototypeOf(p);
        }
        // build the structure to make sure that
        // A/ definition order is kept
        // B/ inherited properties are listed last
        // C/ overridden properties are not listed
        for (let j = genealogy.length - 1; j >= 0; j--) {
            let names = Object.getOwnPropertyNames(genealogy[j]);
            let index = 0;
            for (let i = 0; i < names.length; i++) {
                if ((names[i] != "constructor") && (!names[i].startsWith("__"))) {
                    entries.splice(index, 0, new PropDescription(names[i], genealogy[j]));
                    index++;
                    for (let k = entries.length - 1; k >= index; k--) {
                        if (entries[k].name == names[i])
                            entries.splice(k, 1);
                    } // remove overridden properties
                }
            }
        }
        //let propNames: string [] = Object.keys(keys);
        for (let i = 0; i < entries.length; i++) {
            if ((!entries[i].name.startsWith("ATTR")) && (entries[i].name != "constructor") && (!entries[i].name.startsWith("__"))) {
                if (GenericProperties.isProperty(entries[i].prop, entries[i].name)) {
                    let d = new PropertyDescriptor(entries[i].name);
                    res.byIndex.push(d);
                    res.byName[d.name] = d;
                    d.isWritable = GenericProperties.isWritable(entries[i].prop, entries[i].name);
                    d.isEnum = o[entries[i].name] instanceof YDataRendering.YEnumItem;
                    d.type = typeof (o[entries[i].name]);
                    if ((d.type == "object") && (o[entries[i].name] != null)) {
                        d.type = o[entries[i].name].constructor.name;
                    }
                }
            }
        }
        for (let i = 0; i < entries.length; i++) {
            if (entries[i].name.startsWith("ATTR_")) {
                let p = entries[i].name.indexOf("__");
                if (p < 5)
                    debugger; //  ATTR_*  definition incorrect: should be ATTR_propName__attrName
                let name = entries[i].name.substring(5, p);
                let attr = entries[i].name.substring(p + 2);
                if (typeof (res.byName[name]) === "undefined")
                    debugger; // unknown propName in ATTR_propName__attrName
                try {
                    res.byName[name].Attributes[attr] = Reflect.get(o, entries[i].name);
                    //  res[name].Attributes[attr] = Reflect.apply(Reflect.get(o, propNames[i]), o, []); // calls method propNames[i] in object o,  tricky huh !?
                }
                catch (e) {
                    debugger;
                }
            }
        }
        o["PropertiesDescriptionCache"] = res;
        return res;
    }
    ApplyAllPropertiesEx(target, filter, direction) {
        //let proto  = Object.getPrototypeOf(this)
        //let propNames : string [] =  Object.getOwnPropertyNames(proto)
        let properties = GenericProperties.getAllProperties(this);
        for (let fullpropname in properties.byName) {
            if (properties.byName[fullpropname].isWritable) {
                let index = fullpropname.indexOf("_");
                if (index < 0)
                    throw ("invalid Property name");
                let propType = fullpropname.substring(0, index);
                let propname = fullpropname.substring(index + 1);
                let path = [];
                path.push(propname);
                if ((target instanceof YoctoVisualization.YWidget) && (propType == "Form")) {
                    this.ApplyProperties(this, target, fullpropname, Reflect.get(this, fullpropname), path, direction);
                }
                if ((target instanceof YDataRendering.YAngularGauge) && (propType == "AngularGauge")) {
                    this.ApplyProperties(this, target, fullpropname, Reflect.get(this, fullpropname), path, direction);
                }
                if ((target instanceof YDataRendering.YDigitalDisplay) && (propType == "display")) {
                    this.ApplyProperties(this, target, fullpropname, Reflect.get(this, fullpropname), path, direction);
                }
                if ((target instanceof YDataRendering.YSolidGauge) && (propType == "SolidGauge")) {
                    this.ApplyProperties(this, target, fullpropname, Reflect.get(this, fullpropname), path, direction);
                }
                if ((target instanceof YDataRendering.YGraph) && (propType == "Graph")) {
                    this.ApplyProperties(this, target, fullpropname, Reflect.get(this, fullpropname), path, direction);
                }
            }
        }
    }
}
GenericProperties.XmlFileVersion = -1;

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

export interface YXmlNodeDict
{
    [key: string]: YXmlNode;
}

export class YXmlNode
{
    private node: Node;
    constructor(node: Node)
    {
        this.node = node;

    }

    public get Name(): string { return this.node.nodeName;}

    public get_childsByName(): YoctoVisualization.YXmlNodeDict  // result indexed by name
    {
        let res: YoctoVisualization.YXmlNodeDict = {};
        this.node.childNodes.forEach(child => { res[(<any>child).nodeName] = new YXmlNode(child);})
        return res;
    }

    public get_childsByIndex(): YXmlNode[]  // simple list
    {
        let res: YXmlNode[] = [];
        this.node.childNodes.forEach(child => { res.push(new YXmlNode(child))})
        return res;
    }

    public get_attributes(): { [index: string]: string }
    {
        let el: Element = this.node as Element;
        let res: { [index: string]: string } = {};
        let keys = el.getAttributeNames();
        for (let i: number = 0; i < keys.length; i++)
        {
            res[keys[i]] = <string>el.getAttribute(keys[i]);
        }
        // this.node.childNodes.forEach(child => { res[child.nodeName] = child;})
        return res;
    }

    public get Attributes(): { [index: string]: string } {return this.get_attributes()}

}

class PropertyAccess
{
    public ttype: string = "";
    public stype: string = "";
    public finalTarget: any = null;
    public terminalSource: any = null;
    public propertyName: any = null;
}

export interface PropFilter {(propNname: string): boolean}

export class doubleNan
{
    private _value: number = Number.NaN;
    constructor(v?: any)
    {
        if (typeof v == "undefined")
        {
            return
        }
        else if (typeof v == "number")
        {
            this._value = v;
        }
        else if (typeof v == "string")
        {
            if (v == "")
            {
                this._value = Number.NaN;
            }
            else
            {
                this._value = Number(v)
            }
        }
        else
        { debugger }  // init value type is definitely wrong.
    }

    public toString(): string
    {
        if (Number.isNaN(this._value)) return ""
        return this._value.toString();
    }

    public clone()
    {return new doubleNan(this.value)}

    public get value(): number { return this._value;}
    public set value(value: number) { this._value = value;}

}

export class PropertyDescriptor
{
    public name: string;
    public isWritable: boolean = false
    public isEnum: boolean = false;
    public type: string = "";
    public Attributes: { [index: string]: any } = {};
    constructor(name: string) {this.name = name;}
}

export class PropertiesList
{
    public byIndex: PropertyDescriptor[] = [];
    public byName: { [index: string]: PropertyDescriptor } = {};

}

class PropDescription
{
    public name: string;
    public prop: any[]
    constructor(name: string, prop: any[])
    {
        this.name = name;
        this.prop = prop;
    }
}

export abstract class GenericProperties
{

    public ownerForm: YoctoVisualization.YWidget | null;

    public static NoFilter(propNname: string): boolean { return true; }

    public abstract IsDataSourceAssigned(): boolean;

    public static XmlFileVersion: number = -1;

    public static escapeXml(unsafe: string)
    {
        return unsafe.replace(/[^ !#$%(-;=?-z]/g,(c)=>'&#'+c.charCodeAt(0)+';') // MV power!  :-)
    }

    protected constructor(Owner: YoctoVisualization.YWidget | null)
    {
        this.ownerForm = Owner;
        this._Form_Text = "new window"; //  StartForm.newWindowName();
    }

    public destroy()
    {

        Object.entries(this).forEach((pair: any) => {Reflect.set(this, pair[0], null);}); // sets all internal variables to NULL
    }

    public initFromXmlData(initData: YXmlNode | null)
    {
        if (initData != null) this.loadProperties(initData, <YoctoVisualization.YWidget>this.ownerForm, this);
    }

    public loadProperties(initData: YXmlNode, Owner: YoctoVisualization.YWidget, o: Object): void
    {
        let value: string;
        this.ownerForm = Owner;
        if (initData != null)
        {
            let properties: PropertiesList = GenericProperties.getAllProperties(o);
            let childs: YoctoVisualization.YXmlNodeDict = initData.get_childsByName();
            for (let propname in properties.byName)
            {
                let p: PropertyDescriptor = properties.byName[propname];
                if (p.isWritable)
                {
                    for (let childName in childs)
                    {
                        if (childName == propname)
                        {
                            let target: object = Reflect.get(o, propname)
                            let Mustload: boolean = true;

                            if ("NotSavedInXMLAttribute" in p.Attributes)
                            {
                                Mustload = p.Attributes["NotSavedInXMLAttribute"]
                            }
                            if (Mustload)
                            {
                                if (GenericProperties.IsStructured(target))
                                {
                                    this.loadProperties(childs[childName], Owner, target);
                                }
                                else
                                {
                                    let targetType: string = typeof target;
                                    let attributes: { [index: string]: string } = childs[childName].get_attributes();
                                    let value: string = attributes["value"];
                                    //console.log(childName+" : "+targetType+" = "+value);
                                    // sensor
                                    if (target instanceof YoctoVisualization.CustomYSensor)
                                    {
                                        if ((value.toUpperCase() != "NULL") && (value != ""))
                                        {
                                            let s: YoctoVisualization.CustomYSensor = YoctoVisualization.sensorsManager.AddNewSensor(value);
                                            Reflect.set(o, propname, s);
                                        }
                                        else
                                        {
                                            Reflect.set(o, propname, YoctoVisualization.sensorsManager.getNullSensor());
                                        }
                                    }
                                    else if (target instanceof YDataRendering.YEnumItem)
                                    {  //let  d :  YoctoVisualization.doubleNan =  new YoctoVisualization.doubleNan(value);
                                        Reflect.set(o, propname, target.fromString(value));
                                    }
                                    else if (target instanceof YoctoVisualization.doubleNan)
                                    {
                                        let d: YoctoVisualization.doubleNan = new YoctoVisualization.doubleNan(value);
                                        Reflect.set(o, propname, d);
                                    }
                                    else if (target instanceof YDataRendering.xAxisPosition)
                                    {
                                        let xpos: number = Number(value);
                                        let rel: boolean = attributes["relative"].toUpperCase() == "TRUE";
                                        Reflect.set(o, propname, new YDataRendering.xAxisPosition(xpos, rel));
                                    }
                                    else if (target instanceof YDataRendering.YColor)
                                    {
                                        let c: YDataRendering.YColor | null = YDataRendering.YColor.FromString(value);
                                        if (c == null) c = YDataRendering.YColor.Black;
                                        Reflect.set(o, propname, c.clone());
                                    }
                                    else if (target instanceof YDataRendering.YFont)
                                    {
                                        let size: string = attributes["size"];
                                        let color: string = attributes["color"];
                                        let italic: string = attributes["italic"];
                                        let bold: string = attributes["bold"];
                                        let f: YDataRendering.YFont = Reflect.get(o, propname);
                                        f.name = value;
                                        f.size = size !== "undefined" ? Number(size) : 10;
                                        let c: YDataRendering.YColor | null = YDataRendering.YColor.FromString(color);
                                        f.color = c != null ? c : YDataRendering.YColor.Black.clone();
                                        f.italic = italic.toUpperCase() == "TRUE";
                                        f.bold = bold.toUpperCase() == "TRUE";
                                    }
                                    else
                                    {
                                        switch (targetType)
                                        {
                                        case "string":
                                            Reflect.set(o, propname, value);
                                            break;
                                        case "number":
                                            Reflect.set(o, propname, Number(value));
                                            break;
                                        case "boolean":
                                            let v: boolean = value.toUpperCase() == "TRUE";
                                            Reflect.set(o, propname, v);
                                            break;
                                        default :
                                            debugger
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

    private _Form_Text: string = "New window";
    public get ATTR_Form_Text__DisplayName(): string {return "Window title"}
    public get ATTR_Form_Text__CategoryAttribute(): string {return "Window"}
    public get ATTR_Form_Text__ChangeCausesParentRefreshAttribute(): boolean {return true;}
    public get ATTR_Form_Text__DescriptionAttribute(): string {return "Widget name. This name is not show on display, but it might help you to identify each widget. "}
    public get Form_Text(): string { return this._Form_Text;}
    public set Form_Text(value: string) { this._Form_Text = value;}

    private _Form_BackColor: YDataRendering.YColor = YDataRendering.YColor.FromArgb(0xff, 0xf0, 0xf0, 0xf0);
    public get ATTR_Form_BackColor__DisplayName(): string {return "Background color"}
    public get ATTR_Form_BackColor__CategoryAttribute(): string {return "Window"}
    public get ATTR_Form_BackColor__DescriptionAttribute(): string {return "Window background color." }
    public get Form_BackColor(): YDataRendering.YColor {return this._Form_BackColor}
    public set Form_BackColor(value: YDataRendering.YColor) { this._Form_BackColor = value}

    private _Form_BorderColor: YDataRendering.YColor = YDataRendering.YColor.LightGray;
    public get ATTR_Form_BorderColor__DisplayName(): string {return "Border color"}
    public get ATTR_Form_BorderColor__CategoryAttribute(): string {return "Window"}
    public get ATTR_Form_BorderColor__DescriptionAttribute(): string {return "Window border color, use transparent color to hide the border." }
    public get Form_BorderColor(): YDataRendering.YColor {return this._Form_BorderColor}
    public set Form_BorderColor(value: YDataRendering.YColor) { this._Form_BorderColor = value}

    private _SizeIsRelative: boolean = false;
    public get ATTR_Form_SizeIsRelative__NotSavedInXMLAttribute(): boolean {return true}
    public get ATTR_Form_SizeIsRelative__DisplayName(): string {return "Rel. size and pos."}
    public get ATTR_Form_SizeIsRelative__CategoryAttribute(): string {return "Window"}
    public get ATTR_Form_SizeIsRelative__DescriptionAttribute(): string {return "Makes widget size and position relative to container size. This, for instance, allows to make a widget automatically occupy all of the browser viewport, no matter the browser window size. In relative mode, position and size value are expressed in %" }
    public get ATTR_Form_SizeIsRelative__ChangeCausesParentRefreshAttribute(): boolean {return true;}
    public get Form_SizeIsRelative(): boolean {return this._SizeIsRelative}
    public set Form_SizeIsRelative(value: boolean) { this._SizeIsRelative = value}

    private _Form_PositionX: number = 0;
    // Form/widget positions are handled differently (inheritance from the C# version)
    public get ATTR_Form_PositionX__NotSavedInXMLAttribute(): boolean {return true}
    public get ATTR_Form_PositionX__DisplayName(): string {return "Left"}
    public get ATTR_Form_PositionX__CategoryAttribute(): string {return "Window"}
    public get ATTR_Form_PositionX__DescriptionAttribute(): string {return "Widget left border X position" }
    public get Form_PositionX(): number {return this._Form_PositionX}
    public set Form_PositionX(value: number) { this._Form_PositionX = value}

    private _Form_PositionY: number = 0;
    // Form/widget positions are handled differently (inheritance from the C# version)
    public get ATTR_Form_PositionY__NotSavedInXMLAttribute(): boolean {return true}
    public get ATTR_Form_PositionY__DisplayName(): string {return "Top"}
    public get ATTR_Form_PositionY__CategoryAttribute(): string {return "Window"}
    public get ATTR_Form_PositionY__DescriptionAttribute(): string {return "Widget top border Y position" }
    public get Form_PositionY(): number {return this._Form_PositionY}
    public set Form_PositionY(value: number) { this._Form_PositionY = value}

    private _Form_Width: number = 300;
    // Form/widget positions are handled differently (inheritance from the C# version)
    public get ATTR_Form_Width__NotSavedInXMLAttribute(): boolean {return true}
    public get ATTR_Form_Width__DisplayName(): string {return "Width"}
    public get ATTR_Form_Width__CategoryAttribute(): string {return "Window"}
    public get ATTR_Form_Width__DescriptionAttribute(): string {return "Widget width" }
    public get Form_Width(): number {return this._Form_Width}
    public set Form_Width(value: number) { this._Form_Width = value}

    private _Form_Height: number = 200;
    // Form/widget positions are handled differently (inheritance from the C# version)
    public get ATTR_Form_Height__NotSavedInXMLAttribute(): boolean {return true}
    public get ATTR_Form_Height__DisplayName(): string {return "Height"}
    public get ATTR_Form_Height__CategoryAttribute(): string {return "Window"}
    public get ATTR_Form_Height__DescriptionAttribute(): string {return "Widget height" }
    public get Form_Height(): number {return this._Form_Height}
    public set Form_Height(value: number) { this._Form_Height = value}

    private _containerID: string = "";
    public get ATTR_Form_containerID__NotSavedInXMLAttribute(): boolean {return true}
    public get ATTR_Form_containerID__DisplayName(): string {return "Container ID"}
    public get ATTR_Form_containerID__CategoryAttribute(): string {return "Window"}
    public get ATTR_Form_containerID__DescriptionAttribute(): string {return "Forces the widget to be shown inside an HTML element with a specific ID already present on the page. If ID is empty, the widget is inserted at root level. Be aware that X,Y offsets are kept, you may want to set them to Zero. " }

    public get Form_containerID(): string {return this._containerID}
    public set Form_containerID(value: string) { this._containerID = value}

    public indent(n: number): string {return " ".repeat(n);}

    //#ifndef READONLY
//    public getXml(deep: number, o?: Object): string
//    {
//        if (typeof (o) == "undefined") o = this;
//        let res: string = "";
//        let value: string = "";
//        let properties: PropertiesList = GenericProperties.getAllProperties(o);
//        let propName: string = "";
//
//        for (propName in properties.byName)
//        {
//            let p: PropertyDescriptor = properties.byName[propName];
//            if (p.isWritable)
//            {
//                let Mustsave: boolean = true;
//                if ("NotSavedInXMLAttribute" in p.Attributes) Mustsave = !p.Attributes["NotSavedInXMLAttribute"]
//                let child = Reflect.get(o, p.name);
//                if (GenericProperties.IsStructured(child))
//                {
//                    if (Mustsave)
//                    {
//                        res = res + this.indent(2 * deep) + "<" + p.name + ">\r\n"
//                            + this.getXml(deep + 1, child)
//                            + this.indent(2 * deep) + "</" + p.name + ">\r\n";
//                    }
//                }
//                else
//                {
//                    if (Mustsave)
//                    {
//                        if (child instanceof YDataRendering.YEnumItem)
//                        { value = (child as YDataRendering.YEnumItem).toString }
//                        else
//                        {
//                            let type: string = typeof (child);
//                            if (type == "object") type = child.constructor.name;
//                            switch (type)
//                            {
//                            case "boolean":
//                                value = child as boolean ? "TRUE" : "FALSE";
//                                break;
//                            case "number":
//                                value = (child as number).toString();
//                                break;
//                            case "string":
//                                value = YoctoVisualization.GenericProperties.escapeXml(child as string);
//                                break;
//                            case YDataRendering.YColor.name:
//                                value = (child as YDataRendering.YColor).toString();
//                                break;
//                            case YoctoVisualization.doubleNan.name:
//                                value = (child as YoctoVisualization.doubleNan).value.toString();
//                                break;
//                            case  YDataRendering.xAxisPosition.name:
//                                let it: YDataRendering.xAxisPosition = child as YDataRendering.xAxisPosition
//                                value = it.value.toString() + "\" relative=\"" + (it.relative ? "True" : "False");
//                                break;
//                            case YoctoVisualization.NullYSensor.name:
//                            case YoctoVisualization.CustomYSensor.name:
//                                let s: YoctoVisualization.CustomYSensor = child as YoctoVisualization.CustomYSensor;
//                                value = ((s == null) || (s instanceof YoctoVisualization.NullYSensor)) ? "NULL" : s.get_hardwareId();
//                                break;
//                            default:
//                                throw "XML generation : unhandled type (" + p.type + ")";
//
//                            }
//                        }
//                        res = res + this.indent(2 * deep) + "<" + p.name + " value=\"" + value + "\"/>\n";
//                    }
//                }
//            }
//        }
//        return res;
//    }
////#endif

    public static IsStructured(o: any): boolean
    {
        if (o == null) return false;
        if (typeof o === 'string' || o instanceof String) return false;
        if (typeof o === 'number' || o instanceof Number) return false;
        if (typeof o === 'boolean' || o instanceof Boolean) return false;
        if (o instanceof YDataRendering.YEnumItem) return false;
        if (o instanceof YoctoVisualization.CustomYSensor) return false;
        if (o instanceof YDataRendering.YColor) return false;
        if (o instanceof doubleNan) return false;
        if (o instanceof YDataRendering.xAxisPosition) return false;

        if (Object.getOwnPropertyNames(o).length > 0) return true; // sure this is doing what I think

        return false;
    }

    public static getObjectFromPath(rootTarget: object, path: string[]): object
    {

        let FinalTarget: object = rootTarget;
        for (let i: number = 0; i < path.length - 1; i++)
        {
            let name: string = path[i];
            let index: string = "";
            while (name.charCodeAt(name.length - 1) >= 48 && name.charCodeAt(name.length - 1) <= 57)
            {
                index = name.charAt(name.length - 1) + index;
                name = name.substring(0, name.length - 1);
            }

            if (index == "")
            {

                FinalTarget = Reflect.get(FinalTarget, name);
            }
            else
            {
                let arrayObject: object = Reflect.get(FinalTarget, name);
                FinalTarget = Reflect.get(arrayObject, parseInt(index));

            }
        }
        return FinalTarget;
    }

    //Direction Settings From Target
    private static computePropertyAccess_SFT(WidgetObject: object, SettingObject: object,
                                             propertySourceName: string, path: string[]): PropertyAccess
    {
        let res: PropertyAccess = new PropertyAccess()

        res.ttype = "";
        res.stype = "";
        res.finalTarget = null;
        res.terminalSource = null;

        // FinalTarget = getObjectFromPath(WidgetObject, path);

        res.terminalSource = GenericProperties.getObjectFromPath(WidgetObject, path);

        let props: PropertiesList = GenericProperties.getAllProperties(res.terminalSource);

        if (!(path[path.length - 1] in props.byName)) return res;
        res.stype = typeof (res.terminalSource[path[path.length - 1]]);
        if ((res.stype == "object") && (res.terminalSource[path[path.length - 1]] != null))
        {
            res.stype = res.terminalSource[path[path.length - 1]].constructor.name;
        }

        res.terminalSource = res.terminalSource[path[path.length - 1]];

        if (res.terminalSource == null) return res;

        res.propertyName = propertySourceName;
        res.finalTarget = SettingObject;
        let o: object = res.finalTarget[propertySourceName];
        res.ttype = typeof (o);
        if ((res.ttype == "object") && (o != null)) res.ttype = o.constructor.name;
        //debugger

        if (path.length <= 1) return res;

        for (let i: number = 1; i < path.length; i++)
        {
            res.finalTarget = res.finalTarget[res.propertyName];
            res.propertyName = path[i];

        }
        res.ttype = typeof (res.finalTarget[res.propertyName]);
        if ((res.ttype == "object") && (res.finalTarget[res.propertyName] != null)) res.ttype = res.finalTarget[res.propertyName].constructor.name;
        return res;

    }

    private static Reflect_getIndexed(o: object, indexedProp: string): any
    {
        //  indexedProp is ending with digit, then o is supposed to
        //  be an array, but not always (see angularGauge.needleLength1 )
        let res: object = Reflect.get(o, indexedProp);
        if (typeof res !== "undefined") return res;  // ugly fix about indexes properties

        let name: string = indexedProp;
        let index: string = "";
        while (name.charCodeAt(name.length - 1) >= 48 && name.charCodeAt(name.length - 1) <= 57)
        {
            index = name.charAt(name.length - 1) + index;
            name = name.substring(0, name.length - 1);
        }
        if (index == "")
        {
            return null;
            //throw "Reflect_getIndexed : cannot find property  " + indexedProp + " in class " + o.constructor.name // oops
        }
        res = Reflect.get(o, name);
        return Reflect.get(res, parseInt(index));
    }

    private static computePropertyAccess(rootTarget: object, source: object,
                                         propertySourceName: string, path: string[]): PropertyAccess | null

    {

        let res: PropertyAccess = new PropertyAccess;
        res.ttype = "";
        res.finalTarget = GenericProperties.getObjectFromPath(rootTarget, path);
        res.terminalSource = source;
        res.terminalSource = Reflect.get(res.terminalSource, propertySourceName)

        for (let i: number = 1; i < path.length; i++)
        {
            res.terminalSource = Reflect.get(res.terminalSource, path[i])
        }

        res.stype = typeof res.terminalSource;
        if (res.stype == "object") res.stype = res.terminalSource.constructor.name

        if (path.length > 0)
        {
            res.propertyName = path[path.length - 1];

            let o: any = GenericProperties.Reflect_getIndexed(rootTarget, path[0])
            if (o == null) return null;

            for (let i: number = 1; i < path.length; i++)
            {
                try
                {
                    o = GenericProperties.Reflect_getIndexed(o, path[i])
                    //o=Reflect.get(o, path[i]);

                }
                catch (e)
                {debugger}
            } // something went wrong: cannot descent inside target object

            res.ttype = typeof o;
            if (res.ttype == "object") res.ttype = o.constructor.name
        }
        else
        {
            let targetname: string = propertySourceName;
            let n: number = targetname.indexOf("__");
            res.propertyName = targetname.substring(n + 2);
            let o: object = Reflect.get(rootTarget, res.propertyName);
            res.ttype = typeof o;
            if (res.ttype == "object") res.ttype = o.constructor.name

        }

        return res;
    }

    public static newGetProperty(rootTarget: object, source: object, propertySourceName: string, path: string[], filterAllow: PropFilter | null): any
    {
        let access: PropertyAccess | null = GenericProperties.computePropertyAccess(rootTarget, source, propertySourceName, path);
        if (access == null) return null;
        return Reflect.get(access.finalTarget, access.propertyName);
    }

// Direction : settings From Target

    //Direction : Settings From Target
    //   public static   copyProperty_SFT( rootTarget:object , source :object ,  propertySourceName: string, path: string[]): void
    //     {
    //     copyProperty_SFT(rootTarget, source, propertySourceName, path,  GenericProperties.NoFilter);
    //     }

    public static copyProperty_SFT(rootTarget: object, source: object, propertySourceName: string, path: string[], filterAllow?: PropFilter): void
    {
        // if ( typeof filterAllow =="undefined")  filterAllow = GenericProperties.NoFilter

        let ttype: string = "";
        let stype: string = "";

        let TerminalSource: any = null;

        let p: PropertyAccess = GenericProperties.computePropertyAccess_SFT(rootTarget, source, propertySourceName, path);
        if (p.finalTarget == null) return; // the property does not exist in the widget
        ttype = p.ttype;
        stype = p.stype;
        if ((stype == YDataRendering.YColor.name) && (ttype == YDataRendering.YColor.name))
        {
            Reflect.set(p.finalTarget, p.propertyName, (p.terminalSource as YDataRendering.YColor).clone());
        }
        else if ((stype == YDataRendering.xAxisPosition.name) && (ttype == YDataRendering.xAxisPosition.name))
        {
            Reflect.set(p.finalTarget, p.propertyName, (p.terminalSource as YDataRendering.xAxisPosition).clone());
        }
        else if ((p.stype == "number") && (ttype == YoctoVisualization.doubleNan.name))
        {
            Reflect.set(p.finalTarget, p.propertyName, new doubleNan(p.terminalSource as Number));

        }

        else
        {
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
    static copyProperty_STT(rootTarget: object, source: object, propertySourceName: string, path: string[], filterAllow?: PropFilter): void
    {
        // if (typeof filterAllow === 'undefined') filterAllow = GenericProperties.NoFilter;

        let p: PropertyAccess | null = GenericProperties.computePropertyAccess(rootTarget, source, propertySourceName, path)
        if (p == null) return;

        if ((p.stype == YoctoVisualization.doubleNan.name) && (p.ttype == "number"))
        {
            let v: number = (p.terminalSource as YoctoVisualization.doubleNan).value;
            if (Reflect.get(p.finalTarget, p.propertyName) != v)
            {
                Reflect.set(p.finalTarget, p.propertyName, v)
                //#ifndef READONLY
//                YoctoVisualization.constants.edited = true;
//                //#endif
            }
        }
        else if (p.stype != p.ttype)
        {
            debugger;
        }// something went wrong source and target type don't match
        else if ((p.stype == YDataRendering.YColor.name) && (p.ttype == YDataRendering.YColor.name))
        {
            let color: YDataRendering.YColor = p.terminalSource as YDataRendering.YColor;
            if (!color.equal(Reflect.get(p.finalTarget, p.propertyName)))
            {
                Reflect.set(p.finalTarget, p.propertyName, color.clone());
                //#ifndef READONLY
//                YoctoVisualization.constants.edited = true;
//                //#endif
            }
        }
        else if ((p.stype == YoctoVisualization.doubleNan.name) && (p.ttype == YoctoVisualization.doubleNan.name))
        {
            let v: doubleNan = p.terminalSource as doubleNan;
            if (Reflect.get(p.finalTarget, p.propertyName) != v)
            {
                Reflect.set(p.finalTarget, p.propertyName, v.clone())
                //#ifndef READONLY
//                YoctoVisualization.constants.edited = true;
//                //#endif
            }
        }
        else if ((p.stype == YDataRendering.xAxisPosition.name) && (p.ttype == YDataRendering.xAxisPosition.name))
        {
            let x: YDataRendering.xAxisPosition = p.terminalSource as YDataRendering.xAxisPosition;
            let x2: YDataRendering.xAxisPosition = Reflect.get(p.finalTarget, p.propertyName)
            if ((x.relative != x2.relative) || (x.value != x2.value))
            {
                Reflect.set(p.finalTarget, p.propertyName, x.clone())
                //#ifndef READONLY
//                YoctoVisualization.constants.edited = true;
//                //#endif
            }

        }
        else if (Reflect.get(p.finalTarget, p.propertyName) != p.terminalSource)
        {
            Reflect.set(p.finalTarget, p.propertyName, p.terminalSource)
            //#ifndef READONLY
//            YoctoVisualization.constants.edited = true;
//            //#endif
        }

    }

    public ApplyAllProperties(target: object): void
    { this.ApplyAllPropertiesEx(target, GenericProperties.NoFilter, GenericProperties.APPLYDIRECTION.SETTINGS_TO_TARGET); }

    public RefreshAllProperties(target: object): void
    { this.ApplyAllPropertiesEx(target, GenericProperties.NoFilter, GenericProperties.APPLYDIRECTION.SETTINGS_FROM_TARGET); }

    public ApplyProperties(rootSource: object, rootTarget: object, fullpropname: string, sourceValue: object, path: string[], direction: GenericProperties.APPLYDIRECTION)
    {
        if (sourceValue instanceof YoctoVisualization.AlarmSection) return;  // dirty hack: alarms are not handled through reflexion

        let sourceproperties: PropertiesList = GenericProperties.getAllProperties(this);
        if ("CopyToTarget" in sourceproperties.byName[fullpropname].Attributes)
        {
            if (!sourceproperties.byName[fullpropname].Attributes["CopyToTarget"])
            {
                return;
            }
        }

        if (!GenericProperties.IsStructured(sourceValue))
        {
            if (direction == GenericProperties.APPLYDIRECTION.SETTINGS_TO_TARGET)
            {
                GenericProperties.copyProperty_STT(rootTarget, this, fullpropname, path);
            }
            else
            {
                GenericProperties.copyProperty_SFT(rootTarget, this, fullpropname, path);
            }

        }
        else
        {

            // map all target's user data to its mirrored source
            let path2: string[] = path.slice(); // array Close
            path2.push("");
            let target: object = GenericProperties.getObjectFromPath(rootTarget, path2);
            Reflect.set(target, "userData", sourceValue)
            // recursive decent in structured property
            let sourceproperties: PropertiesList = GenericProperties.getAllProperties(sourceValue);
            for (let subpropname in sourceproperties.byName)
            {
                let shouldcopy: boolean = true;
                if ("CopyToTarget" in sourceproperties.byName[subpropname].Attributes)
                {
                    shouldcopy = sourceproperties.byName[subpropname].Attributes["CopyToTarget"];
                }

                if ((sourceproperties.byName[subpropname].isWritable) && shouldcopy)
                {
                    path.push(subpropname);
                    this.ApplyProperties(rootSource, rootTarget, fullpropname, Reflect.get(sourceValue, subpropname), path, direction);
                    path.splice(path.length - 1, 1);
                }
            }

        }

    }

    // will return true  if property has a getter or a setter
    public static isProperty(proto: any, propName: string)
    {
        let d = Reflect.getOwnPropertyDescriptor(proto, propName); // unknown type , no info found in API
        let list: string[] = Object.getOwnPropertyNames(d);
        for (let i = 0; i < list.length; i++)
        {
            if (list[i] == "set") return true;
            if (list[i] == "get") return true;
        }
        return false;
    }

    // will return true if property has  an implemented  setter
    public static isWritable(proto: any, propName: string)
    {
        let d = Reflect.getOwnPropertyDescriptor(proto, propName); // unknown type , no info found in API
        let list: string[] = Object.getOwnPropertyNames(d);
        for (let i = 0; i < list.length; i++)
        {
            if (list[i] == "set")
            { // @ts-ignore
                if (typeof (d.set) !== "undefined") return true;
            }
        }
        return false;
    }

    public static getAllProperties(o: any): PropertiesList
    {

        if (typeof (o) === "undefined") debugger

        // this is the YoctoVisualization "magic"  function
        //
        // we are trying to construct a list of all o object public properties
        // (getter and setter). Since enumerating the object key only return
        // the object "variables" we iterate through the object prototype,
        // and through the object parent to get inherited properties as well.

        // this function is quite heavy and can be called many times
        // for the same object, so we store the result in the
        // object itself for future uses
        if (o.hasOwnProperty('PropertiesDescriptionCache'))
        {
            return o["PropertiesDescriptionCache"];
        }

        let proto: any = Object.getPrototypeOf(o)
        let res = new PropertiesList();
        let p: any = proto;
        let entries: PropDescription[] = [];
        let genealogy: any[] = [];

        while (p != null)
        {
            genealogy.push(p);
            p = Object.getPrototypeOf(p)
        }

        // build the structure to make sure that
        // A/ definition order is kept
        // B/ inherited properties are listed last
        // C/ overridden properties are not listed
        for (let j: number = genealogy.length - 1; j >= 0; j--)
        {
            let names: string[] = Object.getOwnPropertyNames(genealogy[j]);
            let index = 0;
            for (let i: number = 0; i < names.length; i++)
            {
                if ((names[i] != "constructor") && (!names[i].startsWith("__")))
                {
                    entries.splice(index, 0, new PropDescription(names[i], genealogy[j]));
                    index++;
                    for (let k: number = entries.length - 1; k >= index; k--)
                    {
                        if (entries[k].name == names[i]) entries.splice(k, 1)
                    } // remove overridden properties
                }
            }
        }

        //let propNames: string [] = Object.keys(keys);

        for (let i: number = 0; i < entries.length; i++)
        {
            if ((!entries[i].name.startsWith("ATTR")) && (entries[i].name != "constructor") && (!entries[i].name.startsWith("__")))
            {
                if (GenericProperties.isProperty(entries[i].prop, entries[i].name))
                {
                    let d: PropertyDescriptor = new PropertyDescriptor(entries[i].name);
                    res.byIndex.push(d);
                    res.byName[d.name] = d;
                    d.isWritable = GenericProperties.isWritable(entries[i].prop, entries[i].name)
                    d.isEnum = o[entries[i].name] instanceof YDataRendering.YEnumItem
                    d.type = typeof (o[entries[i].name]);
                    if ((d.type == "object") && (o[entries[i].name] != null))
                    {
                        d.type = o[entries[i].name].constructor.name;
                    }

                }
            }
        }

        for (let i: number = 0; i < entries.length; i++)
        {
            if (entries[i].name.startsWith("ATTR_"))
            {
                let p: number = entries[i].name.indexOf("__")
                if (p < 5) debugger;  //  ATTR_*  definition incorrect: should be ATTR_propName__attrName
                let name: string = entries[i].name.substring(5, p);
                let attr: string = entries[i].name.substring(p + 2);
                if (typeof (res.byName[name]) === "undefined") debugger; // unknown propName in ATTR_propName__attrName
                try
                {
                    res.byName[name].Attributes[attr] = Reflect.get(o, entries[i].name);

                    //  res[name].Attributes[attr] = Reflect.apply(Reflect.get(o, propNames[i]), o, []); // calls method propNames[i] in object o,  tricky huh !?
                }
                catch (e)
                {debugger}
            }
        }

        o["PropertiesDescriptionCache"] = res;
        return res;
    }

    public ApplyAllPropertiesEx(target: object, filter: PropFilter, direction: GenericProperties.APPLYDIRECTION): void
    {
        //let proto  = Object.getPrototypeOf(this)
        //let propNames : string [] =  Object.getOwnPropertyNames(proto)

        let properties: PropertiesList = GenericProperties.getAllProperties(this);

        for (let fullpropname in properties.byName)
        {
            if (properties.byName[fullpropname].isWritable)
            {

                let index: number = fullpropname.indexOf("_");
                if (index < 0) throw  ("invalid Property name");
                let propType: string = fullpropname.substring(0, index);
                let propname: string = fullpropname.substring(index + 1);
                let path: string [] = [];
                path.push(propname);
                if ((target instanceof YoctoVisualization.YWidget) && (propType == "Form"))
                {
                    this.ApplyProperties(this, target, fullpropname, Reflect.get(this, fullpropname), path, direction);
                }

                if ((target instanceof YDataRendering.YAngularGauge) && (propType == "AngularGauge"))
                {
                    this.ApplyProperties(this, target, fullpropname, Reflect.get(this, fullpropname), path, direction);
                }

                if ((target instanceof YDataRendering.YDigitalDisplay) && (propType == "display"))
                {
                    this.ApplyProperties(this, target, fullpropname, Reflect.get(this, fullpropname), path, direction);
                }

                if ((target instanceof YDataRendering.YSolidGauge) && (propType == "SolidGauge"))
                {
                    this.ApplyProperties(this, target, fullpropname, Reflect.get(this, fullpropname), path, direction);
                }

                if ((target instanceof YDataRendering.YGraph) && (propType == "Graph"))
                {
                    this.ApplyProperties(this, target, fullpropname, Reflect.get(this, fullpropname), path, direction);
                }

            }
        }

    }

}

export namespace GenericProperties
{
    export const enum APPLYDIRECTION
    {
        SETTINGS_TO_TARGET,
        SETTINGS_FROM_TARGET
    }
}
